<?php
/**
 * ORIA FRESH - Extras API
 */

$db = getDB();

switch ($requestMethod) {
    case 'GET':
        $stmt = $db->query('SELECT id, slug, name, price_cents FROM extras WHERE is_active = 1 ORDER BY sort_order ASC');
        $extras = $stmt->fetchAll();
        
        foreach ($extras as &$extra) {
            $extra['price'] = $extra['price_cents'] / 100;
        }
        
        jsonResponse($extras);
        break;
        
    case 'POST':
        requireAuth();
        $data = getJsonInput();
        
        $priceCents = isset($data['price']) ? (int)($data['price'] * 100) : 0;
        
        $stmt = $db->prepare('INSERT INTO extras (slug, name, price_cents, sort_order) VALUES (?, ?, ?, ?)');
        $stmt->execute([
            createSlug($data['name']),
            $data['name'],
            $priceCents,
            $data['sort_order'] ?? 0
        ]);
        
        jsonResponse(['id' => $db->lastInsertId(), 'message' => 'Extra erstellt'], 201);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>