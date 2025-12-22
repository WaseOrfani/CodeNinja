<?php
/**
 * ORIA FRESH - Bestseller API
 */

$db = getDB();

if ($requestMethod !== 'GET') {
    jsonResponse(['error' => 'Nur GET erlaubt'], 405);
}

$stmt = $db->query('
    SELECT p.*, c.name as category 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.is_active = 1 AND p.is_bestseller = 1 
    ORDER BY p.name ASC 
    LIMIT 8
');

$products = $stmt->fetchAll();

foreach ($products as &$product) {
    $varStmt = $db->prepare('SELECT name, price, includes FROM product_variants WHERE product_id = ?');
    $varStmt->execute([$product['id']]);
    $product['variants'] = $varStmt->fetchAll();
}

jsonResponse($products);
?>