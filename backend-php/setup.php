<?php
/**
 * ORIA FRESH - Setup-Skript
 * 
 * Führt die Datenbank-Migration aus
 * 
 * Verwendung: php setup.php
 */

echo "\n=== ORIA FRESH Setup ===\n\n";

// Konfiguration laden
require_once __DIR__ . '/config/database.php';

try {
    // Verbindung ohne Datenbank
    $dsn = "mysql:host=" . DB_HOST . ";charset=" . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    echo "[OK] Verbindung zu MySQL hergestellt\n";
    
    // Schema ausführen
    echo "[...] Führe 001_schema.sql aus...\n";
    $schema = file_get_contents(__DIR__ . '/config/001_schema.sql');
    $pdo->exec($schema);
    echo "[OK] Schema erstellt\n";
    
    // Seed ausführen
    echo "[...] Führe 002_seed_menu.sql aus...\n";
    $seed = file_get_contents(__DIR__ . '/config/002_seed_menu.sql');
    $pdo->exec($seed);
    echo "[OK] Produktdaten eingefügt\n";
    
    // Verbindung mit Datenbank testen
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET, DB_USER, DB_PASS);
    
    // Statistik
    $categories = $pdo->query('SELECT COUNT(*) FROM categories')->fetchColumn();
    $products = $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
    $extras = $pdo->query('SELECT COUNT(*) FROM extras')->fetchColumn();
    
    echo "\n=== Datenbank-Statistik ===\n";
    echo "Kategorien: $categories\n";
    echo "Produkte: $products\n";
    echo "Extras: $extras\n";
    
    echo "\n[OK] Setup abgeschlossen!\n";
    echo "\nAdmin-Login:\n";
    echo "E-Mail: admin@oriafresh.de\n";
    echo "Passwort: admin123\n\n";
    
} catch (PDOException $e) {
    echo "[FEHLER] " . $e->getMessage() . "\n";
    exit(1);
}
?>