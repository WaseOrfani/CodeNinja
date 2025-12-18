<?php
/**
 * ORIA FRESH - API Router
 * 
 * Alle API-Anfragen werden hier verarbeitet
 */

require_once __DIR__ . '/../includes/functions.php';

setCorsHeaders();

// Request parsen
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// API Prefix entfernen
$path = preg_replace('/^\/api/', '', parse_url($requestUri, PHP_URL_PATH));
$path = trim($path, '/');
$segments = explode('/', $path);

// Router
try {
    switch ($segments[0] ?? '') {
        case 'categories':
            require __DIR__ . '/categories.php';
            break;
            
        case 'products':
            require __DIR__ . '/products.php';
            break;
            
        case 'orders':
            require __DIR__ . '/orders.php';
            break;
            
        case 'settings':
            require __DIR__ . '/settings.php';
            break;
            
        case 'admin':
            require __DIR__ . '/admin.php';
            break;
            
        case 'contact':
            require __DIR__ . '/contact.php';
            break;
            
        case 'upload':
            require __DIR__ . '/upload.php';
            break;
            
        case 'health':
            jsonResponse(['status' => 'ok', 'timestamp' => date('c')]);
            break;
            
        default:
            jsonResponse(['error' => 'Endpoint nicht gefunden'], 404);
    }
} catch (Exception $e) {
    error_log('API Error: ' . $e->getMessage());
    jsonResponse(['error' => 'Interner Serverfehler'], 500);
}
?>