<?php
/**
 * ORIA FRESH - Haupteinstiegspunkt
 * 
 * Leitet alle Anfragen an die entsprechenden Handler weiter.
 */

// Autoload und Konfiguration
require_once __DIR__ . '/includes/functions.php';

// Einfache Weiterleitung zur API
$uri = $_SERVER['REQUEST_URI'];

if (strpos($uri, '/api/') === 0) {
    require __DIR__ . '/api/index.php';
    exit;
}

// Standardantwort für Root
header('Content-Type: application/json');
echo json_encode([
    'name' => 'ORIA FRESH API',
    'version' => '1.0.0',
    'status' => 'running',
    'endpoints' => [
        '/api/products',
        '/api/categories', 
        '/api/orders',
        '/api/settings',
        '/api/admin/login',
        '/api/admin/dashboard',
        '/api/contact',
        '/api/health'
    ]
]);
?>