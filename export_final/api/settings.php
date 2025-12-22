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
            // JSON-Werte dekodieren
            $value = $row['setting_value'];
            $decoded = json_decode($value, true);
            $settings[$row['setting_key']] = $decoded !== null ? $decoded : $value;
        }
        
        // Standard-Werte falls nicht in DB (Frontend-kompatibles Format)
        $defaults = [
            'restaurant_name' => 'ORIA FRESH',
            'address' => 'Kirchenplatz 9, 18119 Rostock-Warnemünde',
            'phone' => '+49 381 7704 - 0',
            'email' => 'info@oriafresh.de',
            'opening_hours' => [
                ['day' => 'Montag', 'open' => '11:00', 'close' => '22:00', 'is_closed' => false],
                ['day' => 'Dienstag', 'open' => '11:00', 'close' => '22:00', 'is_closed' => false],
                ['day' => 'Mittwoch', 'open' => '11:00', 'close' => '22:00', 'is_closed' => false],
                ['day' => 'Donnerstag', 'open' => '11:00', 'close' => '22:00', 'is_closed' => false],
                ['day' => 'Freitag', 'open' => '11:00', 'close' => '23:00', 'is_closed' => false],
                ['day' => 'Samstag', 'open' => '12:00', 'close' => '23:00', 'is_closed' => false],
                ['day' => 'Sonntag', 'open' => '12:00', 'close' => '21:00', 'is_closed' => false],
            ],
            'pickup_slots' => ['sofort', '15 min', '30 min', '45 min', '60 min'],
            'delivery_fee' => 0,
            'min_order_delivery' => 15,
            'min_order_pickup' => 0,
            'paypal_enabled' => false,
            'delivery_enabled' => true,
            'pickup_enabled' => true,
            'qr_bonus' => [
                'enabled' => true,
                'bonus_type' => 'extra_sauce',
                'bonus_name' => 'Gratis Extra Sauce',
                'bonus_value' => 0.80
            ]
        ];
        
        foreach ($defaults as $key => $value) {
            if (!isset($settings[$key])) {
                $settings[$key] = $value;
            }
        }
        
        // Sicherstellen dass opening_hours immer ein Array ist
        if (isset($settings['opening_hours']) && is_string($settings['opening_hours'])) {
            $settings['opening_hours'] = $defaults['opening_hours'];
        }
        
        jsonResponse($settings);
        break;
        
    case 'PUT':
        requireAuth();
        $data = getJsonInput();
        
        $stmt = $db->prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
        
        foreach ($data as $key => $value) {
            // Arrays/Objects als JSON speichern
            $valueToStore = is_array($value) || is_object($value) ? json_encode($value) : $value;
            $stmt->execute([$key, $valueToStore]);
        }
        
        jsonResponse(['message' => 'Einstellungen gespeichert']);
        break;
        
    default:
        jsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
?>