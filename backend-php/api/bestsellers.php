<?php
/**
 * ORIA FRESH - Bestseller API
 * Gibt die beliebtesten Produkte zurück (basierend auf Bestellungen)
 */

$db = getDB();

if ($requestMethod !== 'GET') {
    jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}

// Bestseller: Erste 6 Burger-Produkte
$stmt = $db->query('
    SELECT p.id, p.slug, p.name, p.description, p.price_cents, p.image_path, p.patties, p.is_menu, p.sort_order,
           c.name as category, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1 AND c.slug = "burger"
    ORDER BY p.sort_order ASC
    LIMIT 6
');
$products = $stmt->fetchAll();

$result = [];
foreach ($products as $product) {
    $price = $product['price_cents'] / 100;
    $image = $product['image_path'] 
        ? '/uploads/products/' . $product['image_path']
        : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400';
    
    $result[] = [
        'id' => $product['id'],
        'slug' => $product['slug'],
        'name' => $product['name'],
        'description' => $product['description'] ?? '',
        'category' => $product['category'],
        'category_slug' => $product['category_slug'],
        'image' => $image,
        'price' => $price,
        'is_bestseller' => true,
        'is_featured' => false,
        'variants' => [
            ['name' => 'Standard', 'price' => $price]
        ]
    ];
}

jsonResponse($result);
?>