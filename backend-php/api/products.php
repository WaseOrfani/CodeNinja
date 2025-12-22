<?php
/**
 * ORIA FRESH - Produkte API (Lieferando-optimiert)
 * Preise in Cents, Extras als separate Tabelle
 */

$db = getDB();
$productId = $segments[1] ?? null;

switch ($requestMethod) {
    case 'GET':
        if ($productId) {
            // Einzelnes Produkt
            $stmt = $db->prepare('
                SELECT p.*, c.name as category_name, c.slug as category_slug 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.id = ? AND p.is_active = 1
            ');
            $stmt->execute([$productId]);
            $product = $stmt->fetch();
            
            if (!$product) {
                jsonResponse(['error' => 'Produkt nicht gefunden'], 404);
            }
            
            // Preis in Euro konvertieren
            $product['price'] = $product['price_cents'] / 100;
            
            // Extras laden
            $extStmt = $db->prepare('
                SELECT e.id, e.slug, e.name, e.price_cents 
                FROM extras e 
                JOIN product_extras pe ON e.id = pe.extra_id 
                WHERE pe.product_id = ? AND e.is_active = 1
                ORDER BY e.sort_order
            ');
            $extStmt->execute([$productId]);
            $extras = $extStmt->fetchAll();
            
            // Extras Preise konvertieren
            foreach ($extras as &$extra) {
                $extra['price'] = $extra['price_cents'] / 100;
            }
            $product['extras'] = $extras;
            
            // Menü-Bestandteile laden (wenn is_menu=1)
            if ($product['is_menu']) {
                $menuStmt = $db->prepare('
                    SELECT p.id, p.slug, p.name, p.price_cents, mi.quantity
                    FROM menu_items mi
                    JOIN products p ON mi.item_id = p.id
                    WHERE mi.menu_id = ?
                ');
                $menuStmt->execute([$productId]);
                $product['menu_items'] = $menuStmt->fetchAll();
            }
            
            jsonResponse($product);
        } else {
            // Alle Produkte (mit Filter)
            $category = $_GET['category'] ?? null;
            $isMenu = $_GET['is_menu'] ?? null;
            
            $sql = '
                SELECT p.*, c.name as category, c.slug as category_slug 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.is_active = 1
            ';
            $params = [];
            
            if ($category) {
                $sql .= ' AND c.slug = ?';
                $params[] = $category;
            }
            
            if ($isMenu !== null) {
                $sql .= ' AND p.is_menu = ?';
                $params[] = (int)$isMenu;
            }
            
            $sql .= ' ORDER BY c.sort_order ASC, p.sort_order ASC';
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $products = $stmt->fetchAll();
            
            // Preise konvertieren und Extras laden
            foreach ($products as &$product) {
                $product['price'] = $product['price_cents'] / 100;
                
                // Extras für jedes Produkt
                $extStmt = $db->prepare('
                    SELECT e.id, e.slug, e.name, e.price_cents 
                    FROM extras e 
                    JOIN product_extras pe ON e.id = pe.extra_id 
                    WHERE pe.product_id = ? AND e.is_active = 1
                    ORDER BY e.sort_order
                ');
                $extStmt->execute([$product['id']]);
                $extras = $extStmt->fetchAll();
                
                foreach ($extras as &$extra) {
                    $extra['price'] = $extra['price_cents'] / 100;
                }
                $product['extras'] = $extras;
            }
            
            jsonResponse($products);
        }
        break;
        
    case 'POST':
        requireAuth();
        $data = getJsonInput();
        
        // Preis in Cents umrechnen
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
        break;
        
    case 'PUT':
        requireAuth();
        if (!$productId) jsonResponse(['error' => 'Produkt-ID erforderlich'], 400);
        
        $data = getJsonInput();
        $priceCents = isset($data['price']) ? (int)($data['price'] * 100) : null;
        
        $updates = [];
        $params = [];
        
        if (isset($data['name'])) { $updates[] = 'name = ?'; $params[] = $data['name']; }
        if (isset($data['description'])) { $updates[] = 'description = ?'; $params[] = $data['description']; }
        if ($priceCents !== null) { $updates[] = 'price_cents = ?'; $params[] = $priceCents; }
        if (isset($data['image_path'])) { $updates[] = 'image_path = ?'; $params[] = $data['image_path']; }
        if (isset($data['patties'])) { $updates[] = 'patties = ?'; $params[] = $data['patties']; }
        if (isset($data['is_menu'])) { $updates[] = 'is_menu = ?'; $params[] = $data['is_menu']; }
        if (isset($data['is_active'])) { $updates[] = 'is_active = ?'; $params[] = $data['is_active']; }
        if (isset($data['sort_order'])) { $updates[] = 'sort_order = ?'; $params[] = $data['sort_order']; }
        
        if (!empty($updates)) {
            $params[] = $productId;
            $sql = 'UPDATE products SET ' . implode(', ', $updates) . ' WHERE id = ?';
            $db->prepare($sql)->execute($params);
        }
        
        // Extras aktualisieren
        if (isset($data['extra_ids'])) {
            $db->prepare('DELETE FROM product_extras WHERE product_id = ?')->execute([$productId]);
            $extStmt = $db->prepare('INSERT INTO product_extras (product_id, extra_id) VALUES (?, ?)');
            foreach ($data['extra_ids'] as $extraId) {
                $extStmt->execute([$productId, $extraId]);
            }
        }
        
        jsonResponse(['message' => 'Produkt aktualisiert']);
        break;
        
    case 'DELETE':
        requireAuth();
        if (!$productId) jsonResponse(['error' => 'Produkt-ID erforderlich'], 400);
        
        // Soft delete
        $stmt = $db->prepare('UPDATE products SET is_active = 0 WHERE id = ?');
        $stmt->execute([$productId]);
        
        jsonResponse(['message' => 'Produkt deaktiviert']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>