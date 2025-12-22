<?php
/**
 * ORIA FRESH - Bestseller API
 * Gibt die beliebtesten Produkte zurück (basierend auf Bestellungen)
 */

$db = getDB();

if ($requestMethod !== 'GET') {
    jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}

// Bestseller basierend auf Bestellungen oder manuell sortiert
// Für MVP: Erste 6 Burger-Produkte als Bestseller
$stmt = $db->query('
    SELECT p.id, p.slug, p.name, p.description, p.price_cents, p.image_path, p.patties, p.is_menu,
           c.name as category, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1 AND c.slug = "burger"
    ORDER BY p.sort_order ASC
    LIMIT 6
');
$products = $stmt->fetchAll();

// Preise konvertieren
foreach ($products as &$product) {
    $product['price'] = $product['price_cents'] / 100;
}

jsonResponse($products);
?>