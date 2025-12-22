<?php
/**
 * ORIA FRESH - Datenbank-Konfiguration
 * 
 * Für Ihr Hosting anpassen:
 * - DB_HOST: localhost (meistens)
 * - DB_NAME: Ihr Datenbankname
 * - DB_USER: Ihr Datenbankbenutzer
 * - DB_PASS: Ihr Datenbankpasswort
 */

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'oriafresh');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

// JWT Secret für Admin-Login
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'oria-fresh-secret-key-change-in-production');

// SMTP Konfiguration
define('SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.gmail.com');
define('SMTP_PORT', getenv('SMTP_PORT') ?: 587);
define('SMTP_USER', getenv('SMTP_USER') ?: '');
define('SMTP_PASS', getenv('SMTP_PASS') ?: '');
define('SMTP_FROM', getenv('SMTP_FROM') ?: 'info@oriafresh.de');
define('ADMIN_EMAIL', getenv('ADMIN_EMAIL') ?: 'info@oriafresh.de');

// Upload-Pfad
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('UPLOAD_URL', '/uploads/');

// PDO Verbindung
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Datenbankverbindung fehlgeschlagen']));
        }
    }
    return $pdo;
}
?>