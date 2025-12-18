<?php
/**
 * ORIA FRESH - Kategorien API
 */

$db = getDB();

switch ($requestMethod) {
    case 'GET':
        // Alle Kategorien abrufen
        $stmt = $db->query('SELECT id, name, slug, icon, sort_order FROM categories ORDER BY sort_order ASC');
        $categories = $stmt->fetchAll();
        
        // Produktanzahl pro Kategorie
        foreach ($categories as &$cat) {
            $countStmt = $db->prepare('SELECT COUNT(*) FROM products WHERE category_id = ? AND is_active = 1');
            $countStmt->execute([$cat['id']]);
            $cat['product_count'] = (int) $countStmt->fetchColumn();
        }
        
        jsonResponse($categories);
        break;
        
    case 'POST':
        requireAuth();
        $data = getJsonInput();
        
        $stmt = $db->prepare('INSERT INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)');
        $stmt->execute([
            $data['name'],
            createSlug($data['name']),
            $data['icon'] ?? '',
            $data['sort_order'] ?? 0
        ]);
        
        jsonResponse(['id' => $db->lastInsertId(), 'message' => 'Kategorie erstellt'], 201);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>