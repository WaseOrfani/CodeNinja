<?php
/**
 * ORIA FRESH - Bestellungen API
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
            
            // Positionen laden
            $itemsStmt = $db->prepare('SELECT * FROM order_items WHERE order_id = ?');
            $itemsStmt->execute([$orderId]);
            $order['items'] = $itemsStmt->fetchAll();
            
            // Extras dekodieren
            foreach ($order['items'] as &$item) {
                $item['extras'] = json_decode($item['extras'], true) ?? [];
            }
            
            jsonResponse($order);
        } else {
            // Alle Bestellungen (Admin)
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
            
            jsonResponse($orders);
        }
        break;
        
    case 'POST':
        // Neue Bestellung (öffentlich)
        $data = getJsonInput();
        
        // Validierung
        if (empty($data['items']) || empty($data['customer_name']) || empty($data['customer_email'])) {
            jsonResponse(['error' => 'Pflichtfelder fehlen'], 400);
        }
        
        $orderNumber = generateOrderNumber();
        
        // Bestellung erstellen
        $stmt = $db->prepare('
            INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, pickup_time, notes, payment_method, subtotal, total, source, qr_bonus_applied) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $orderNumber,
            $data['customer_name'],
            $data['customer_email'],
            $data['customer_phone'] ?? '',
            $data['pickup_time'] ?? 'sofort',
            $data['notes'] ?? '',
            $data['payment_method'] ?? 'pickup',
            $data['subtotal'] ?? 0,
            $data['total'] ?? 0,
            $data['source'] ?? 'web',
            json_encode($data['qr_bonus_applied'] ?? null)
        ]);
        
        $orderId = $db->lastInsertId();
        
        // Positionen hinzufügen
        $itemStmt = $db->prepare('
            INSERT INTO order_items (order_id, product_name, variant_name, variant_price, quantity, extras, item_total) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ');
        
        foreach ($data['items'] as $item) {
            $itemStmt->execute([
                $orderId,
                $item['product_name'],
                $item['variant'] ?? '',
                $item['variant_price'] ?? 0,
                $item['quantity'] ?? 1,
                json_encode($item['extras'] ?? []),
                $item['total'] ?? 0
            ]);
        }
        
        // E-Mail an Admin senden
        $emailBody = "
            <h2>Neue Bestellung bei ORIA FRESH</h2>
            <p><strong>Bestellnummer:</strong> $orderNumber</p>
            <p><strong>Kunde:</strong> {$data['customer_name']}</p>
            <p><strong>E-Mail:</strong> {$data['customer_email']}</p>
            <p><strong>Telefon:</strong> {$data['customer_phone']}</p>
            <p><strong>Abholzeit:</strong> {$data['pickup_time']}</p>
            <p><strong>Gesamt:</strong> €" . number_format($data['total'], 2) . "</p>
        ";
        sendEmail(ADMIN_EMAIL, "Neue Bestellung: $orderNumber", $emailBody);
        
        // Bestätigung an Kunde
        $customerBody = "
            <h2>Danke für deine Bestellung!</h2>
            <p>Hallo {$data['customer_name']},</p>
            <p>Deine Bestellung <strong>$orderNumber</strong> wurde erfolgreich aufgenommen.</p>
            <p><strong>Abholzeit:</strong> {$data['pickup_time']}</p>
            <p><strong>Adresse:</strong> Kirchenplatz 9, 18119 Rostock-Warnemünde</p>
            <p><strong>Gesamt:</strong> €" . number_format($data['total'], 2) . "</p>
            <br>
            <p>Bis gleich!<br>Dein ORIA FRESH Team</p>
        ";
        sendEmail($data['customer_email'], "Bestellbestätigung $orderNumber", $customerBody);
        
        jsonResponse([
            'order_id' => $orderId,
            'order_number' => $orderNumber,
            'message' => 'Bestellung erfolgreich'
        ], 201);
        break;
        
    case 'PUT':
        $auth = requireAuth();
        if (!$orderId) jsonResponse(['error' => 'Bestell-ID erforderlich'], 400);
        
        $data = getJsonInput();
        
        $stmt = $db->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $stmt->execute([$data['status'], $orderId]);
        
        jsonResponse(['message' => 'Status aktualisiert']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>