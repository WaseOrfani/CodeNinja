<?php
/**
 * ORIA FRESH - Bild-Upload API
 */

requireAuth();

if ($requestMethod !== 'POST') {
    jsonResponse(['error' => 'Nur POST erlaubt'], 405);
}

if (empty($_FILES['image'])) {
    jsonResponse(['error' => 'Keine Datei hochgeladen'], 400);
}

$result = uploadImage($_FILES['image'], 'products');

if (isset($result['error'])) {
    jsonResponse($result, 400);
}

jsonResponse($result, 201);
?>