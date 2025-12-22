<?php
/**
 * ORIA FRESH - Einstellungen API
 */

$db = getDB();

switch ($requestMethod) {
    case 'GET':
        $stmt = $db->query('SELECT setting_key, setting_value FROM settings');
        $rows = $stmt->fetchAll();
        
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        
        // Standard-Werte falls nicht in DB
        $defaults = [
            'restaurant_name' => 'ORIA FRESH',
            'address' => 'Kirchenplatz 9, 18119 Rostock-Warnemünde',
            'phone' => '+49 381 7704 - 0',
            'email' => 'info@oriafresh.de',
            'opening_hours' => 'Mo-So: 11:00 - 22:00',
            'delivery_fee' => '0',
            'min_order_delivery' => '15',
            'min_order_pickup' => '0',
            'paypal_enabled' => 'false',
            'delivery_enabled' => 'true',
            'pickup_enabled' => 'true'
        ];
        
        foreach ($defaults as $key => $value) {
            if (!isset($settings[$key])) {
                $settings[$key] = $value;
            }
        }
        
        jsonResponse($settings);
        break;
        
    case 'PUT':
        requireAuth();
        $data = getJsonInput();
        
        $stmt = $db->prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
        
        foreach ($data as $key => $value) {
            $stmt->execute([$key, $value]);
        }
        
        jsonResponse(['message' => 'Einstellungen gespeichert']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>