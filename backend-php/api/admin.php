<?php
/**
 * ORIA FRESH - Admin API
 */

$db = getDB();
$action = $segments[1] ?? null;

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
            'admin' => [
                'id' => $admin['id'],
                'email' => $admin['email'],
                'name' => $admin['name']
            ]
        ]);
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
        $ordersStmt = $db->prepare('SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders WHERE DATE(created_at) = ?');
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
        
        // QR-Bestellungen
        $qrStmt = $db->prepare('SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders WHERE DATE(created_at) = ? AND source = "qr"');
        $qrStmt->execute([$today]);
        $qrStats = $qrStmt->fetch();
        
        // Produkte zählen
        $productCount = $db->query('SELECT COUNT(*) FROM products WHERE is_active = 1')->fetchColumn();
        
        jsonResponse([
            'orders_today' => (int) $todayStats['count'],
            'revenue_today' => (float) $todayStats['revenue'],
            'status_breakdown' => $statusBreakdown,
            'qr_orders_today' => (int) $qrStats['count'],
            'qr_revenue_today' => (float) $qrStats['revenue'],
            'qr_percentage' => $todayStats['count'] > 0 ? round(($qrStats['count'] / $todayStats['count']) * 100, 1) : 0,
            'total_products' => (int) $productCount
        ]);
        break;
        
    case 'orders':
        requireAuth();
        
        if ($requestMethod === 'GET') {
            $stmt = $db->query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
            jsonResponse($stmt->fetchAll());
        }
        break;
        
    case 'products':
        requireAuth();
        
        if ($requestMethod === 'GET') {
            $stmt = $db->query('
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                ORDER BY p.name ASC
            ');
            $products = $stmt->fetchAll();
            
            foreach ($products as &$product) {
                $varStmt = $db->prepare('SELECT * FROM product_variants WHERE product_id = ?');
                $varStmt->execute([$product['id']]);
                $product['variants'] = $varStmt->fetchAll();
            }
            
            jsonResponse($products);
        }
        break;
        
    default:
        jsonResponse(['error' => 'Admin-Endpoint nicht gefunden'], 404);
}
?>