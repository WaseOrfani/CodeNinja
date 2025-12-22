<?php
/**
 * ORIA FRESH - Admin API
 */

$db = getDB();
$action = $segments[1] ?? null;
$itemId = $segments[2] ?? null;
$subAction = $segments[3] ?? null;

switch ($action) {
    case 'login':
        if ($requestMethod !== 'POST') {
            jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
        }
        
        $data = getJsonInput();
        
        if (empty($data['email']) || empty($data['password'])) {
            jsonResponse(['error' => 'E-Mail und Passwort erforderlich'], 400);
        }
        
        $stmt = $db->prepare('SELECT * FROM admins WHERE email = ? AND is_active = 1');
        $stmt->execute([$data['email']]);
        $admin = $stmt->fetch();
        
        if (!$admin || !verifyPassword($data['password'], $admin['password_hash'])) {
            jsonResponse(['error' => 'Ungültige Anmeldedaten'], 401);
        }
        
        // Login-Zeit aktualisieren
        $db->prepare('UPDATE admins SET last_login = NOW() WHERE id = ?')->execute([$admin['id']]);
        
        // Token erstellen
        $token = createJWT([
            'admin_id' => $admin['id'],
            'email' => $admin['email'],
            'name' => $admin['name']
        ]);
        
        jsonResponse([
            'access_token' => $token,
            'token' => $token,
            'admin' => [
                'id' => $admin['id'],
                'email' => $admin['email'],
                'name' => $admin['name']
            ]
        ]);
        break;
        
    case 'me':
        if ($requestMethod !== 'GET') {
            jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
        }
        
        $auth = requireAuth();
        
        $stmt = $db->prepare('SELECT id, email, name FROM admins WHERE id = ?');
        $stmt->execute([$auth['admin_id']]);
        $admin = $stmt->fetch();
        
        if (!$admin) {
            jsonResponse(['error' => 'Admin nicht gefunden'], 404);
        }
        
        jsonResponse($admin);
        break;
        
    case 'change-password':
        if ($requestMethod !== 'POST') {
            jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
        }
        
        $auth = requireAuth();
        $data = getJsonInput();
        
        if (empty($data['current_password']) || empty($data['new_password'])) {
            jsonResponse(['error' => 'Aktuelles und neues Passwort erforderlich'], 400);
        }
        
        // Aktuelles Passwort prüfen
        $stmt = $db->prepare('SELECT password_hash FROM admins WHERE id = ?');
        $stmt->execute([$auth['admin_id']]);
        $admin = $stmt->fetch();
        
        if (!verifyPassword($data['current_password'], $admin['password_hash'])) {
            jsonResponse(['error' => 'Aktuelles Passwort falsch'], 400);
        }
        
        // Neues Passwort setzen
        $newHash = hashPassword($data['new_password']);
        $db->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')->execute([$newHash, $auth['admin_id']]);
        
        jsonResponse(['message' => 'Passwort geändert']);
        break;
        
    case 'dashboard':
        if ($requestMethod !== 'GET') {
            jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
        }
        
        requireAuth();
        
        // Heutige Statistiken
        $today = date('Y-m-d');
        
        // Bestellungen heute
        $ordersStmt = $db->prepare('SELECT COUNT(*) as count, COALESCE(SUM(total_cents), 0) as revenue FROM orders WHERE DATE(created_at) = ?');
        $ordersStmt->execute([$today]);
        $todayStats = $ordersStmt->fetch();
        
        // Status-Aufschlüsselung
        $statusStmt = $db->prepare('
            SELECT status, COUNT(*) as count 
            FROM orders 
            WHERE DATE(created_at) = ? 
            GROUP BY status
        ');
        $statusStmt->execute([$today]);
        $statusBreakdown = [];
        while ($row = $statusStmt->fetch()) {
            $statusBreakdown[$row['status']] = (int) $row['count'];
        }
        
        // Produkte zählen
        $productCount = $db->query('SELECT COUNT(*) FROM products WHERE is_active = 1')->fetchColumn();
        
        // Kategorien zählen
        $categoryCount = $db->query('SELECT COUNT(*) FROM categories WHERE is_active = 1')->fetchColumn();
        
        jsonResponse([
            'orders_today' => (int) $todayStats['count'],
            'revenue_today' => (float) ($todayStats['revenue'] / 100),
            'status_breakdown' => $statusBreakdown,
            'total_products' => (int) $productCount,
            'total_categories' => (int) $categoryCount
        ]);
        break;
        
    case 'orders':
        requireAuth();
        
        if ($requestMethod === 'GET') {
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
                $order['fees'] = $order['fees_cents'] / 100;
                $order['total'] = $order['total_cents'] / 100;
                
                // Positionen laden
                $itemsStmt = $db->prepare('SELECT * FROM order_items WHERE order_id = ?');
                $itemsStmt->execute([$order['id']]);
                $items = $itemsStmt->fetchAll();
                
                foreach ($items as &$item) {
                    $item['unit_price'] = $item['unit_cents'] / 100;
                }
                $order['items'] = $items;
            }
            
            jsonResponse($orders);
        } elseif ($requestMethod === 'PUT' && $itemId) {
            // Status aktualisieren: PUT /api/admin/orders/{id}/status?new_status=...
            $newStatus = $_GET['new_status'] ?? null;
            
            if (!$newStatus) {
                $data = getJsonInput();
                $newStatus = $data['status'] ?? null;
            }
            
            if ($newStatus) {
                $validStatuses = ['NEW', 'PAID', 'ACCEPTED', 'IN_PROGRESS', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELED'];
                if (!in_array($newStatus, $validStatuses)) {
                    jsonResponse(['error' => 'Ungültiger Status'], 400);
                }
                
                $stmt = $db->prepare('UPDATE orders SET status = ? WHERE id = ?');
                $stmt->execute([$newStatus, $itemId]);
                
                jsonResponse(['message' => 'Status aktualisiert']);
            } else {
                jsonResponse(['error' => 'Status erforderlich'], 400);
            }
        } else {
            jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
        }
        break;
        
    case 'products':
        requireAuth();
        
        if ($requestMethod === 'GET') {
            $stmt = $db->query('
                SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                ORDER BY c.sort_order ASC, p.sort_order ASC
            ');
            $products = $stmt->fetchAll();
            
            foreach ($products as &$product) {
                $product['price'] = $product['price_cents'] / 100;
                
                // Extras laden
                $extStmt = $db->prepare('
                    SELECT e.id, e.slug, e.name, e.price_cents 
                    FROM extras e 
                    JOIN product_extras pe ON e.id = pe.extra_id 
                    WHERE pe.product_id = ?
                ');
                $extStmt->execute([$product['id']]);
                $extras = $extStmt->fetchAll();
                
                foreach ($extras as &$extra) {
                    $extra['price'] = $extra['price_cents'] / 100;
                }
                $product['extras'] = $extras;
            }
            
            jsonResponse($products);
        } elseif ($requestMethod === 'POST') {
            $data = getJsonInput();
            $priceCents = isset($data['price']) ? (int)($data['price'] * 100) : 0;
            
            $stmt = $db->prepare('
                INSERT INTO products (category_id, slug, name, description, price_cents, image_path, patties, is_menu, is_active, sort_order) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([
                $data['category_id'],
                createSlug($data['name']),
                $data['name'],
                $data['description'] ?? '',
                $priceCents,
                $data['image_path'] ?? null,
                $data['patties'] ?? null,
                $data['is_menu'] ?? 0,
                $data['is_active'] ?? 1,
                $data['sort_order'] ?? 0
            ]);
            
            $productId = $db->lastInsertId();
            
            // Extras zuweisen
            if (!empty($data['extra_ids'])) {
                $extStmt = $db->prepare('INSERT INTO product_extras (product_id, extra_id) VALUES (?, ?)');
                foreach ($data['extra_ids'] as $extraId) {
                    $extStmt->execute([$productId, $extraId]);
                }
            }
            
            jsonResponse(['id' => $productId, 'message' => 'Produkt erstellt'], 201);
        } elseif ($requestMethod === 'PUT' && $itemId) {
            $data = getJsonInput();
            $updates = [];
            $params = [];
            
            if (isset($data['name'])) { $updates[] = 'name = ?'; $params[] = $data['name']; }
            if (isset($data['description'])) { $updates[] = 'description = ?'; $params[] = $data['description']; }
            if (isset($data['price'])) { $updates[] = 'price_cents = ?'; $params[] = (int)($data['price'] * 100); }
            if (isset($data['category_id'])) { $updates[] = 'category_id = ?'; $params[] = $data['category_id']; }
            if (isset($data['image_path'])) { $updates[] = 'image_path = ?'; $params[] = $data['image_path']; }
            if (isset($data['patties'])) { $updates[] = 'patties = ?'; $params[] = $data['patties']; }
            if (isset($data['is_menu'])) { $updates[] = 'is_menu = ?'; $params[] = $data['is_menu']; }
            if (isset($data['is_active'])) { $updates[] = 'is_active = ?'; $params[] = $data['is_active']; }
            if (isset($data['sort_order'])) { $updates[] = 'sort_order = ?'; $params[] = $data['sort_order']; }
            
            if (!empty($updates)) {
                $params[] = $itemId;
                $sql = 'UPDATE products SET ' . implode(', ', $updates) . ' WHERE id = ?';
                $db->prepare($sql)->execute($params);
            }
            
            // Extras aktualisieren
            if (isset($data['extra_ids'])) {
                $db->prepare('DELETE FROM product_extras WHERE product_id = ?')->execute([$itemId]);
                $extStmt = $db->prepare('INSERT INTO product_extras (product_id, extra_id) VALUES (?, ?)');
                foreach ($data['extra_ids'] as $extraId) {
                    $extStmt->execute([$itemId, $extraId]);
                }
            }
            
            jsonResponse(['message' => 'Produkt aktualisiert']);
        } elseif ($requestMethod === 'DELETE' && $itemId) {
            // Soft delete
            $stmt = $db->prepare('UPDATE products SET is_active = 0 WHERE id = ?');
            $stmt->execute([$itemId]);
            jsonResponse(['message' => 'Produkt deaktiviert']);
        } else {
            jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
        }
        break;
        
    case 'categories':
        requireAuth();
        
        if ($requestMethod === 'GET') {
            $stmt = $db->query('SELECT * FROM categories ORDER BY sort_order ASC');
            jsonResponse($stmt->fetchAll());
        } elseif ($requestMethod === 'POST') {
            $data = getJsonInput();
            $stmt = $db->prepare('INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)');
            $stmt->execute([
                $data['name'],
                createSlug($data['name']),
                $data['sort_order'] ?? 0
            ]);
            jsonResponse(['id' => $db->lastInsertId(), 'message' => 'Kategorie erstellt'], 201);
        } elseif ($requestMethod === 'PUT' && $itemId) {
            $data = getJsonInput();
            $updates = [];
            $params = [];
            
            if (isset($data['name'])) { $updates[] = 'name = ?'; $params[] = $data['name']; }
            if (isset($data['sort_order'])) { $updates[] = 'sort_order = ?'; $params[] = $data['sort_order']; }
            if (isset($data['is_active'])) { $updates[] = 'is_active = ?'; $params[] = $data['is_active']; }
            
            if (!empty($updates)) {
                $params[] = $itemId;
                $sql = 'UPDATE categories SET ' . implode(', ', $updates) . ' WHERE id = ?';
                $db->prepare($sql)->execute($params);
            }
            
            jsonResponse(['message' => 'Kategorie aktualisiert']);
        } elseif ($requestMethod === 'DELETE' && $itemId) {
            $stmt = $db->prepare('UPDATE categories SET is_active = 0 WHERE id = ?');
            $stmt->execute([$itemId]);
            jsonResponse(['message' => 'Kategorie deaktiviert']);
        } else {
            jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
        }
        break;
        
    case 'extras':
        requireAuth();
        
        if ($requestMethod === 'GET') {
            $stmt = $db->query('SELECT * FROM extras ORDER BY sort_order ASC');
            $extras = $stmt->fetchAll();
            foreach ($extras as &$extra) {
                $extra['price'] = $extra['price_cents'] / 100;
            }
            jsonResponse($extras);
        }
        break;
        
    case 'settings':
        requireAuth();
        
        if ($requestMethod === 'PUT') {
            $data = getJsonInput();
            
            $stmt = $db->prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
            
            foreach ($data as $key => $value) {
                $stmt->execute([$key, $value]);
            }
            
            jsonResponse(['message' => 'Einstellungen gespeichert']);
        } else {
            jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
        }
        break;
        
    default:
        jsonResponse(['error' => 'Admin-Endpoint nicht gefunden'], 404);
}
?>