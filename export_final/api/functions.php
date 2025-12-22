<?php
/**
 * ORIA FRESH - Hilfsfunktionen
 */

require_once __DIR__ . '/config/database.php';

// CORS Headers für API
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// JSON Response
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// JSON Input lesen
function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

// JWT Token erstellen
function createJWT($payload) {
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload['exp'] = time() + (24 * 60 * 60); // 24 Stunden
    $payloadEncoded = base64_encode(json_encode($payload));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true));
    return "$header.$payloadEncoded.$signature";
}

// JWT Token validieren
function validateJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    
    list($header, $payload, $signature) = $parts;
    $validSignature = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    
    if ($signature !== $validSignature) return false;
    
    $payloadData = json_decode(base64_decode($payload), true);
    if ($payloadData['exp'] < time()) return false;
    
    return $payloadData;
}

// Auth prüfen
function requireAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
        jsonResponse(['error' => 'Nicht autorisiert'], 401);
    }
    
    $payload = validateJWT($matches[1]);
    if (!$payload) {
        jsonResponse(['error' => 'Token ungültig oder abgelaufen'], 401);
    }
    
    return $payload;
}

// Passwort hashen
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Passwort prüfen
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Slug erstellen
function createSlug($text) {
    $text = iconv('UTF-8', 'ASCII//TRANSLIT', $text);
    $text = preg_replace('/[^a-zA-Z0-9]/', '-', $text);
    $text = strtolower(trim($text, '-'));
    return preg_replace('/-+/', '-', $text);
}

// Bestellnummer generieren
function generateOrderNumber() {
    return 'OF-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
}

// E-Mail senden
function sendEmail($to, $subject, $body) {
    if (empty(SMTP_USER) || empty(SMTP_PASS)) {
        error_log("E-Mail nicht gesendet (SMTP nicht konfiguriert): $subject");
        return false;
    }
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: ' . SMTP_FROM,
        'Reply-To: ' . SMTP_FROM
    ];
    
    return mail($to, $subject, $body, implode("\r\n", $headers));
}

// Bild hochladen
function uploadImage($file, $subfolder = 'products') {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!in_array($file['type'], $allowedTypes)) {
        return ['error' => 'Nur JPG, PNG, WebP und GIF erlaubt'];
    }
    
    if ($file['size'] > 5 * 1024 * 1024) { // 5MB
        return ['error' => 'Datei zu groß (max. 5MB)'];
    }
    
    $uploadDir = UPLOAD_PATH . $subfolder . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $ext;
    $filepath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return ['url' => UPLOAD_URL . $subfolder . '/' . $filename];
    }
    
    return ['error' => 'Upload fehlgeschlagen'];
}
?>