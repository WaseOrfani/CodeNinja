<?php
/**
 * ORIA FRESH - Bestellungen API (Lieferando-optimiert)
 * Preise in Cents, serverseitige Preisberechnung
 */

$db = getDB();
$orderId = $segments[1] ?? null;
$action = $segments[2] ?? null;

switch ($requestMethod) {
    case 'GET':
        if ($orderId && $action === 'status') {
            // Öffentlicher Status-Check (ohne Auth)
            $stmt = $db->prepare('SELECT order_number, status, delivery_type, created_at FROM orders WHERE id = ? OR order_number = ?');
            $stmt->execute([$orderId, $orderId]);
            $order = $stmt->fetch();
            
            if (!$order) {
                jsonResponse(['error' => 'Bestellung nicht gefunden'], 404);
            }
            
            jsonResponse([
                'order_number' => $order['order_number'],
                'status' => $order['status'],
                'delivery_type' => $order['delivery_type'],
                'created_at' => $order['created_at']
            ]);
        } elseif ($orderId) {
            // Einzelne Bestellung (Auth erforderlich)
            $auth = requireAuth();
            
            $stmt = $db->prepare('SELECT * FROM orders WHERE id = ?');
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();
            
            if (!$order) {
                jsonResponse(['error' => 'Bestellung nicht gefunden'], 404);
            }
            
            // Preise in Euro
            $order['subtotal'] = $order['subtotal_cents'] / 100;
            $order['fees'] = $order['fees_cents'] / 100;
            $order['total'] = $order['total_cents'] / 100;
            
            // Positionen laden
            $itemsStmt = $db->prepare('SELECT * FROM order_items WHERE order_id = ?');
            $itemsStmt->execute([$orderId]);
            $items = $itemsStmt->fetchAll();
            
            foreach ($items as &$item) {
                $item['unit_price'] = $item['unit_cents'] / 100;
                
                // Extras laden
                $extStmt = $db->prepare('SELECT * FROM order_item_extras WHERE order_item_id = ?');
                $extStmt->execute([$item['id']]);
                $extras = $extStmt->fetchAll();
                foreach ($extras as &$ext) {
                    $ext['unit_price'] = $ext['unit_cents'] / 100;
                }
                $item['extras'] = $extras;
            }
            $order['items'] = $items;
            
            jsonResponse($order);
        } else {
            // Alle Bestellungen (Auth erforderlich)
            $auth = requireAuth();
            
            $status = $_GET['status'] ?? null;
            $date = $_GET['date'] ?? null;
            
            $sql = 'SELECT * FROM orders WHERE 1=1';
            $params = [];
            
            if ($status) {
                $sql .= ' AND status = ?';
                $params[] = $status;
            }
            if ($date) {
                $sql .= ' AND DATE(created_at) = ?';
                $params[] = $date;
            }
            
            $sql .= ' ORDER BY created_at DESC LIMIT 100';
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $orders = $stmt->fetchAll();
            
            foreach ($orders as &$order) {
                $order['subtotal'] = $order['subtotal_cents'] / 100;
                $order['total'] = $order['total_cents'] / 100;
            }
            
            jsonResponse($orders);
        }
        break;
        
    case 'POST':
        // Neue Bestellung (öffentlich) - SERVERSEITIGE PREISBERECHNUNG
        $data = getJsonInput();
        
        if (empty($data['items'])) {
            jsonResponse(['error' => 'Keine Produkte im Warenkorb'], 400);
        }
        
        // Customer-Daten validieren
        $customerName = $data['customer_name'] ?? $data['customer']['name'] ?? '';
        $customerEmail = $data['customer_email'] ?? $data['customer']['email'] ?? '';
        $customerPhone = $data['customer_phone'] ?? $data['customer']['phone'] ?? '';
        $deliveryType = $data['delivery_type'] ?? $data['customer']['delivery_type'] ?? 'PICKUP';
        
        if (empty($customerName)) {
            jsonResponse(['error' => 'Name erforderlich'], 400);
        }
        
        // Preise serverseitig berechnen (Sicherheit!)
        $subtotalCents = 0;
        $validatedItems = [];
        
        foreach ($data['items'] as $item) {
            // Unterstützt beide Formate: product_id oder id
            $productId = $item['product_id'] ?? $item['id'] ?? null;
            $quantity = max(1, (int)($item['quantity'] ?? 1));
            
            // Produkt aus DB laden
            $prodStmt = $db->prepare('SELECT id, name, price_cents FROM products WHERE id = ? AND is_active = 1');
            $prodStmt->execute([$productId]);
            $product = $prodStmt->fetch();
            
            if (!$product) continue;
            
            $itemCents = $product['price_cents'] * $quantity;
            
            // Extras berechnen
            $validatedExtras = [];
            $itemExtras = $item['extras'] ?? $item['selectedExtras'] ?? [];
            
            if (!empty($itemExtras)) {
                foreach ($itemExtras as $extraData) {
                    $extraId = $extraData['id'] ?? $extraData['extra_id'] ?? null;
                    $extStmt = $db->prepare('SELECT id, name, price_cents FROM extras WHERE id = ? AND is_active = 1');
                    $extStmt->execute([$extraId]);
                    $extra = $extStmt->fetch();
                    
                    if ($extra) {
                        $extraQty = max(1, (int)($extraData['quantity'] ?? 1));
                        $itemCents += $extra['price_cents'] * $extraQty * $quantity;
                        $validatedExtras[] = [
                            'extra_id' => $extra['id'],
                            'name' => $extra['name'],
                            'unit_cents' => $extra['price_cents'],
                            'quantity' => $extraQty
                        ];
                    }
                }
            }
            
            $subtotalCents += $itemCents;
            $validatedItems[] = [
                'product_id' => $product['id'],
                'name' => $product['name'],
                'unit_cents' => $product['price_cents'],
                'quantity' => $quantity,
                'notes' => $item['notes'] ?? null,
                'extras' => $validatedExtras
            ];
        }
        
        if (empty($validatedItems)) {
            jsonResponse(['error' => 'Keine gültigen Produkte'], 400);
        }
        
        $feesCents = 0; // Liefergebühr etc.
        $totalCents = $subtotalCents + $feesCents;
        $orderNumber = 'OF-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -5));
        
        // Bestellung erstellen
        $stmt = $db->prepare('
            INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, delivery_type, address_line1, address_city, address_zip, notes, subtotal_cents, fees_cents, total_cents) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $orderNumber,
            $customerName,
            $customerEmail,
            $customerPhone,
            $deliveryType,
            $data['address_line1'] ?? $data['customer']['address'] ?? null,
            $data['address_city'] ?? $data['customer']['city'] ?? null,
            $data['address_zip'] ?? $data['customer']['zip'] ?? null,
            $data['notes'] ?? $data['customer']['notes'] ?? null,
            $subtotalCents,
            $feesCents,
            $totalCents
        ]);
        
        $newOrderId = $db->lastInsertId();
        
        // Positionen speichern
        $itemStmt = $db->prepare('INSERT INTO order_items (order_id, product_id, name_snapshot, unit_cents, quantity, notes) VALUES (?, ?, ?, ?, ?, ?)');
        $extraStmt = $db->prepare('INSERT INTO order_item_extras (order_item_id, extra_id, name_snapshot, unit_cents, quantity) VALUES (?, ?, ?, ?, ?)');
        
        foreach ($validatedItems as $item) {
            $itemStmt->execute([
                $newOrderId,
                $item['product_id'],
                $item['name'],
                $item['unit_cents'],
                $item['quantity'],
                $item['notes']
            ]);
            
            $orderItemId = $db->lastInsertId();
            
            foreach ($item['extras'] as $extra) {
                $extraStmt->execute([
                    $orderItemId,
                    $extra['extra_id'],
                    $extra['name'],
                    $extra['unit_cents'],
                    $extra['quantity']
                ]);
            }
        }
        
        // E-Mail an Admin
        $total = number_format($totalCents / 100, 2, ',', '.');
        $emailBody = "<h2>Neue Bestellung: $orderNumber</h2><p><strong>Kunde:</strong> $customerName<br><strong>E-Mail:</strong> $customerEmail<br><strong>Gesamt:</strong> {$total} €</p>";
        sendEmail(ADMIN_EMAIL, "Neue Bestellung: $orderNumber", $emailBody);
        
        // Bestätigung an Kunde
        if (!empty($customerEmail)) {
            $customerBody = "<h2>Danke für deine Bestellung!</h2><p>Bestellnummer: <strong>$orderNumber</strong><br>Gesamt: <strong>{$total} €</strong><br><br>Bis gleich!<br>Dein ORIA FRESH Team</p>";
            sendEmail($customerEmail, "Bestellbestätigung $orderNumber", $customerBody);
        }
        
        jsonResponse([
            'id' => $newOrderId,
            'order_id' => $newOrderId,
            'order_number' => $orderNumber,
            'subtotal' => $subtotalCents / 100,
            'total' => $totalCents / 100,
            'message' => 'Bestellung erfolgreich'
        ], 201);
        break;
        
    case 'PUT':
        $auth = requireAuth();
        if (!$orderId) jsonResponse(['error' => 'Bestell-ID erforderlich'], 400);
        
        $data = getJsonInput();
        $newStatus = $_GET['new_status'] ?? $data['status'] ?? null;
        
        if ($newStatus) {
            $validStatuses = ['NEW', 'PAID', 'ACCEPTED', 'IN_PROGRESS', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELED'];
            if (!in_array($newStatus, $validStatuses)) {
                jsonResponse(['error' => 'Ungültiger Status'], 400);
            }
            
            $stmt = $db->prepare('UPDATE orders SET status = ? WHERE id = ?');
            $stmt->execute([$newStatus, $orderId]);
        }
        
        jsonResponse(['message' => 'Bestellung aktualisiert']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>