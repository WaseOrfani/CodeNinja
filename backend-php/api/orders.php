<?php
/**
 * ORIA FRESH - Bestellungen API (Lieferando-optimiert)
 * Preise in Cents, serverseitige Preisberechnung
 */

$db = getDB();
$orderId = $segments[1] ?? null;

switch ($requestMethod) {
    case 'GET':
        $auth = requireAuth();
        
        if ($orderId) {
            // Einzelne Bestellung
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
            // Alle Bestellungen
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
        
        if (empty($data['items']) || empty($data['customer_name']) || empty($data['customer_email'])) {
            jsonResponse(['error' => 'Pflichtfelder fehlen'], 400);
        }
        
        // Preise serverseitig berechnen (Sicherheit!)
        $subtotalCents = 0;
        $validatedItems = [];
        
        foreach ($data['items'] as $item) {
            $productId = $item['product_id'] ?? null;
            $quantity = max(1, (int)($item['quantity'] ?? 1));
            
            // Produkt aus DB laden
            $prodStmt = $db->prepare('SELECT id, name, price_cents FROM products WHERE id = ? AND is_active = 1');
            $prodStmt->execute([$productId]);
            $product = $prodStmt->fetch();
            
            if (!$product) continue;
            
            $itemCents = $product['price_cents'] * $quantity;
            
            // Extras berechnen
            $validatedExtras = [];
            if (!empty($item['extras'])) {
                foreach ($item['extras'] as $extraData) {
                    $extraId = $extraData['id'] ?? null;
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
            $data['customer_name'],
            $data['customer_email'],
            $data['customer_phone'] ?? null,
            $data['delivery_type'] ?? 'PICKUP',
            $data['address_line1'] ?? null,
            $data['address_city'] ?? null,
            $data['address_zip'] ?? null,
            $data['notes'] ?? null,
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
        $emailBody = "<h2>Neue Bestellung: $orderNumber</h2><p><strong>Kunde:</strong> {$data['customer_name']}<br><strong>E-Mail:</strong> {$data['customer_email']}<br><strong>Gesamt:</strong> {$total} €</p>";
        sendEmail(ADMIN_EMAIL, "Neue Bestellung: $orderNumber", $emailBody);
        
        // Bestätigung an Kunde
        $customerBody = "<h2>Danke für deine Bestellung!</h2><p>Bestellnummer: <strong>$orderNumber</strong><br>Gesamt: <strong>{$total} €</strong><br><br>Bis gleich!<br>Dein ORIA FRESH Team</p>";
        sendEmail($data['customer_email'], "Bestellbestätigung $orderNumber", $customerBody);
        
        jsonResponse([
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
        
        if (isset($data['status'])) {
            $validStatuses = ['NEW', 'PAID', 'ACCEPTED', 'IN_PROGRESS', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELED'];
            if (!in_array($data['status'], $validStatuses)) {
                jsonResponse(['error' => 'Ungültiger Status'], 400);
            }
            
            $stmt = $db->prepare('UPDATE orders SET status = ? WHERE id = ?');
            $stmt->execute([$data['status'], $orderId]);
        }
        
        jsonResponse(['message' => 'Bestellung aktualisiert']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>