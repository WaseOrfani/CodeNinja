<?php
/**
 * ORIA FRESH - Warenkorb API
 * 
 * Der Warenkorb wird clientseitig (React) verwaltet.
 * Diese API dient nur zur Validierung vor der Bestellung.
 */

$db = getDB();

if ($requestMethod !== 'POST') {
    jsonResponse(['error' => 'Nur POST erlaubt'], 405);
}

$data = getJsonInput();
$items = $data['items'] ?? [];

if (empty($items)) {
    jsonResponse(['error' => 'Warenkorb ist leer'], 400);
}

$validatedItems = [];
$subtotal = 0;

foreach ($items as $item) {
    $productId = $item['product_id'] ?? null;
    $variantName = $item['variant'] ?? null;
    $quantity = (int) ($item['quantity'] ?? 1);
    
    if (!$productId) continue;
    
    // Produkt validieren
    $stmt = $db->prepare('SELECT id, name, is_active FROM products WHERE id = ?');
    $stmt->execute([$productId]);
    $product = $stmt->fetch();
    
    if (!$product || !$product['is_active']) {
        continue; // Produkt überspringen wenn nicht verfügbar
    }
    
    // Variante validieren
    $varStmt = $db->prepare('SELECT name, price FROM product_variants WHERE product_id = ? AND name = ?');
    $varStmt->execute([$productId, $variantName]);
    $variant = $varStmt->fetch();
    
    if (!$variant) {
        // Erste Variante nehmen
        $varStmt = $db->prepare('SELECT name, price FROM product_variants WHERE product_id = ? LIMIT 1');
        $varStmt->execute([$productId]);
        $variant = $varStmt->fetch();
    }
    
    $itemTotal = $variant['price'] * $quantity;
    
    // Extras validieren und berechnen
    $extras = [];
    $extrasTotal = 0;
    if (!empty($item['extras'])) {
        foreach ($item['extras'] as $extra) {
            $extStmt = $db->prepare('SELECT name, price FROM product_extras WHERE product_id = ? AND name = ?');
            $extStmt->execute([$productId, $extra['name']]);
            $validExtra = $extStmt->fetch();
            
            if ($validExtra) {
                $extras[] = $validExtra;
                $extrasTotal += $validExtra['price'] * $quantity;
            }
        }
    }
    
    $itemTotal += $extrasTotal;
    $subtotal += $itemTotal;
    
    $validatedItems[] = [
        'product_id' => $product['id'],
        'product_name' => $product['name'],
        'variant' => $variant['name'],
        'variant_price' => (float) $variant['price'],
        'quantity' => $quantity,
        'extras' => $extras,
        'total' => $itemTotal
    ];
}

jsonResponse([
    'valid' => true,
    'items' => $validatedItems,
    'subtotal' => $subtotal,
    'total' => $subtotal // Hier könnten Rabatte/Gebühren hinzukommen
]);
?>