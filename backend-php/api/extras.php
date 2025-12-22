<?php
/**
 * ORIA FRESH - Extras API
 */

$db = getDB();
$extraId = $segments[1] ?? null;

switch ($requestMethod) {
    case 'GET':
        if ($extraId) {
            $stmt = $db->prepare('SELECT * FROM extras WHERE id = ?');
            $stmt->execute([$extraId]);
            $extra = $stmt->fetch();
            
            if (!$extra) {
                jsonResponse(['error' => 'Extra nicht gefunden'], 404);
            }
            
            $extra['price'] = $extra['price_cents'] / 100;
            jsonResponse($extra);
        } else {
            $stmt = $db->query('SELECT * FROM extras WHERE is_active = 1 ORDER BY sort_order');
            $extras = $stmt->fetchAll();
            
            foreach ($extras as &$extra) {
                $extra['price'] = $extra['price_cents'] / 100;
            }
            
            jsonResponse($extras);
        }
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
        
    case 'PUT':
        requireAuth();
        if (!$extraId) jsonResponse(['error' => 'Extra-ID erforderlich'], 400);
        
        $data = getJsonInput();
        $priceCents = isset($data['price']) ? (int)($data['price'] * 100) : null;
        
        $updates = [];
        $params = [];
        
        if (isset($data['name'])) { $updates[] = 'name = ?'; $params[] = $data['name']; }
        if ($priceCents !== null) { $updates[] = 'price_cents = ?'; $params[] = $priceCents; }
        if (isset($data['is_active'])) { $updates[] = 'is_active = ?'; $params[] = $data['is_active']; }
        if (isset($data['sort_order'])) { $updates[] = 'sort_order = ?'; $params[] = $data['sort_order']; }
        
        if (!empty($updates)) {
            $params[] = $extraId;
            $sql = 'UPDATE extras SET ' . implode(', ', $updates) . ' WHERE id = ?';
            $db->prepare($sql)->execute($params);
        }
        
        jsonResponse(['message' => 'Extra aktualisiert']);
        break;
        
    case 'DELETE':
        requireAuth();
        if (!$extraId) jsonResponse(['error' => 'Extra-ID erforderlich'], 400);
        
        $stmt = $db->prepare('UPDATE extras SET is_active = 0 WHERE id = ?');
        $stmt->execute([$extraId]);
        
        jsonResponse(['message' => 'Extra deaktiviert']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>