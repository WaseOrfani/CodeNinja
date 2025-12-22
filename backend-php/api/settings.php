<?php
/**
 * ORIA FRESH - Einstellungen API
 */

$db = getDB();

switch ($requestMethod) {
    case 'GET':
        // Alle Einstellungen laden
        $stmt = $db->query('SELECT setting_key, setting_value FROM settings');
        $settings = [];
        
        while ($row = $stmt->fetch()) {
            $value = $row['setting_value'];
            // JSON dekodieren wenn möglich
            $decoded = json_decode($value, true);
            $settings[$row['setting_key']] = $decoded !== null ? $decoded : $value;
        }
        
        // Standard-Werte wenn leer
        $defaults = [
            'restaurant_name' => 'ORIA FRESH',
            'address' => 'Kirchenplatz 9, 18119 Rostock-Warnemünde',
            'phone' => '+49 381 7704 – 0',
            'email' => 'info@oriafresh.de',
            'pickup_slots' => ['sofort', '15 min', '30 min', '45 min', '60 min'],
            'qr_bonus' => [
                'enabled' => true,
                'bonus_name' => 'Golden Cheese Dip',
                'bonus_value' => 3.90,
                'bonus_type' => 'cheese_dip'
            ]
        ];
        
        $result = array_merge($defaults, $settings);
        jsonResponse($result);
        break;
        
    case 'PUT':
        requireAuth();
        $data = getJsonInput();
        
        foreach ($data as $key => $value) {
            $valueStr = is_array($value) ? json_encode($value) : $value;
            
            $stmt = $db->prepare('
                INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
                ON DUPLICATE KEY UPDATE setting_value = ?
            ');
            $stmt->execute([$key, $valueStr, $valueStr]);
        }
        
        jsonResponse(['message' => 'Einstellungen gespeichert']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>