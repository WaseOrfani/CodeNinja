<?php
/**
 * ORIA FRESH - Produkte API
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
            
            // Varianten laden
            $varStmt = $db->prepare('SELECT id, name, price, includes FROM product_variants WHERE product_id = ?');
            $varStmt->execute([$productId]);
            $product['variants'] = $varStmt->fetchAll();
            
            // Extras laden
            $extStmt = $db->prepare('SELECT id, name, price FROM product_extras WHERE product_id = ?');
            $extStmt->execute([$productId]);
            $product['extras'] = $extStmt->fetchAll();
            
            jsonResponse($product);
        } else {
            // Alle Produkte (mit Filter)
            $category = $_GET['category'] ?? null;
            $featured = $_GET['featured'] ?? null;
            
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
            
            if ($featured) {
                $sql .= ' AND p.is_featured = 1';
            }
            
            $sql .= ' ORDER BY p.is_bestseller DESC, p.is_featured DESC, p.name ASC';
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $products = $stmt->fetchAll();
            
            // Varianten für jedes Produkt
            foreach ($products as &$product) {
                $varStmt = $db->prepare('SELECT name, price, includes FROM product_variants WHERE product_id = ?');
                $varStmt->execute([$product['id']]);
                $product['variants'] = $varStmt->fetchAll();
                
                $extStmt = $db->prepare('SELECT name, price FROM product_extras WHERE product_id = ?');
                $extStmt->execute([$product['id']]);
                $product['extras'] = $extStmt->fetchAll();
            }
            
            jsonResponse($products);
        }
        break;
        
    case 'POST':
        requireAuth();
        $data = getJsonInput();
        
        $stmt = $db->prepare('
            INSERT INTO products (name, slug, description, category_id, image, allergens, is_vegan, is_spicy, is_featured, is_bestseller, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $data['name'],
            createSlug($data['name']),
            $data['description'] ?? '',
            $data['category_id'] ?? null,
            $data['image'] ?? '',
            $data['allergens'] ?? '',
            $data['is_vegan'] ?? 0,
            $data['is_spicy'] ?? 0,
            $data['is_featured'] ?? 0,
            $data['is_bestseller'] ?? 0,
            $data['is_active'] ?? 1
        ]);
        
        $productId = $db->lastInsertId();
        
        // Varianten hinzufügen
        if (!empty($data['variants'])) {
            $varStmt = $db->prepare('INSERT INTO product_variants (product_id, name, price, includes) VALUES (?, ?, ?, ?)');
            foreach ($data['variants'] as $variant) {
                $varStmt->execute([$productId, $variant['name'], $variant['price'], $variant['includes'] ?? null]);
            }
        }
        
        // Extras hinzufügen
        if (!empty($data['extras'])) {
            $extStmt = $db->prepare('INSERT INTO product_extras (product_id, name, price) VALUES (?, ?, ?)');
            foreach ($data['extras'] as $extra) {
                $extStmt->execute([$productId, $extra['name'], $extra['price']]);
            }
        }
        
        jsonResponse(['id' => $productId, 'message' => 'Produkt erstellt'], 201);
        break;
        
    case 'PUT':
        requireAuth();
        if (!$productId) jsonResponse(['error' => 'Produkt-ID erforderlich'], 400);
        
        $data = getJsonInput();
        
        $stmt = $db->prepare('
            UPDATE products SET 
                name = ?, description = ?, category_id = ?, image = ?, allergens = ?,
                is_vegan = ?, is_spicy = ?, is_featured = ?, is_bestseller = ?, is_active = ?
            WHERE id = ?
        ');
        $stmt->execute([
            $data['name'],
            $data['description'] ?? '',
            $data['category_id'] ?? null,
            $data['image'] ?? '',
            $data['allergens'] ?? '',
            $data['is_vegan'] ?? 0,
            $data['is_spicy'] ?? 0,
            $data['is_featured'] ?? 0,
            $data['is_bestseller'] ?? 0,
            $data['is_active'] ?? 1,
            $productId
        ]);
        
        // Varianten aktualisieren
        $db->prepare('DELETE FROM product_variants WHERE product_id = ?')->execute([$productId]);
        if (!empty($data['variants'])) {
            $varStmt = $db->prepare('INSERT INTO product_variants (product_id, name, price, includes) VALUES (?, ?, ?, ?)');
            foreach ($data['variants'] as $variant) {
                $varStmt->execute([$productId, $variant['name'], $variant['price'], $variant['includes'] ?? null]);
            }
        }
        
        // Extras aktualisieren
        $db->prepare('DELETE FROM product_extras WHERE product_id = ?')->execute([$productId]);
        if (!empty($data['extras'])) {
            $extStmt = $db->prepare('INSERT INTO product_extras (product_id, name, price) VALUES (?, ?, ?)');
            foreach ($data['extras'] as $extra) {
                $extStmt->execute([$productId, $extra['name'], $extra['price']]);
            }
        }
        
        jsonResponse(['message' => 'Produkt aktualisiert']);
        break;
        
    case 'DELETE':
        requireAuth();
        if (!$productId) jsonResponse(['error' => 'Produkt-ID erforderlich'], 400);
        
        $stmt = $db->prepare('UPDATE products SET is_active = 0 WHERE id = ?');
        $stmt->execute([$productId]);
        
        jsonResponse(['message' => 'Produkt gelöscht']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>