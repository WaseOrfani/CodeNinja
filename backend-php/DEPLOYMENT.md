# ORIA FRESH - Deployment-Anleitung

## 📋 Voraussetzungen

- Webhosting mit PHP 7.4+ (empfohlen: PHP 8.x)
- MySQL 5.7+ oder MariaDB 10.x
- Apache mit mod_rewrite ODER Nginx
- FTP-Zugang oder SSH

## 🚀 Installation (Schritt für Schritt)

### 1. Dateien hochladen

```
Per FTP hochladen:
/backend-php/  →  /ihr-webspace/api/
```

Ordnerstruktur auf dem Server:
```
/ihr-webspace/
├── api/
│   ├── api/
│   │   ├── index.php
│   │   ├── products.php
│   │   ├── orders.php
│   │   └── ...
│   ├── config/
│   │   └── database.php
│   ├── includes/
│   │   └── functions.php
│   ├── uploads/
│   │   └── products/
│   └── .htaccess
└── (React Frontend später)
```

### 2. Datenbank einrichten

1. **MySQL-Datenbank erstellen** (im Hosting-Panel):
   - Datenbankname: `oriafresh`
   - Benutzer erstellen mit allen Rechten

2. **Schema importieren**:
   ```bash
   mysql -u username -p oriafresh < config/schema.sql
   ```
   Oder über phpMyAdmin: SQL-Tab → schema.sql einfügen → Ausführen

3. **Produktdaten importieren**:
   ```bash
   mysql -u username -p oriafresh < config/seed_data.sql
   ```

### 3. Konfiguration anpassen

Datei `config/database.php` bearbeiten:

```php
define('DB_HOST', 'localhost');        // Meist 'localhost'
define('DB_NAME', 'oriafresh');        // Ihr Datenbankname
define('DB_USER', 'db_benutzer');      // Ihr DB-Benutzer
define('DB_PASS', 'ihr_passwort');     // Ihr DB-Passwort

// E-Mail (optional, für Bestellbenachrichtigungen)
define('SMTP_HOST', 'smtp.gmail.com'); // Oder Ihr Mailserver
define('SMTP_PORT', 587);
define('SMTP_USER', 'ihre@email.de');
define('SMTP_PASS', 'app-passwort');   // Gmail: App-Passwort erstellen
define('ADMIN_EMAIL', 'bestellungen@oriafresh.de');
```

### 4. Upload-Ordner Berechtigungen

```bash
chmod 755 uploads/
chmod 755 uploads/products/
```

Bei FTP: Rechtsklick auf Ordner → Berechtigungen → 755

### 5. API testen

Im Browser aufrufen:
```
https://ihre-domain.de/api/health
```

Erwartete Antwort:
```json
{"status": "ok", "timestamp": "2024-..."}
```

## 🔐 Admin-Zugang

**Standard-Login:**
- E-Mail: `admin@oriafresh.de`
- Passwort: `admin123`

⚠️ **WICHTIG:** Passwort nach dem ersten Login ändern!

## 📧 E-Mail einrichten (Gmail)

1. Gmail-Konto → Sicherheit → 2-Faktor-Authentifizierung aktivieren
2. App-Passwörter → Neues App-Passwort erstellen
3. Dieses Passwort in `SMTP_PASS` eintragen

## 🌐 React Frontend verbinden

In der React-App `.env`:
```
REACT_APP_BACKEND_URL=https://ihre-domain.de/api
```

Dann `yarn build` und den `build/` Ordner hochladen.

## 📁 Komplette Dateistruktur

```
/ihr-webspace/
├── api/                    ← PHP Backend
│   ├── api/
│   ├── config/
│   ├── includes/
│   ├── uploads/
│   └── .htaccess
├── index.html              ← React Build
├── static/
│   ├── css/
│   └── js/
└── .htaccess               ← Für React SPA Routing
```

## 🔧 Troubleshooting

### "500 Internal Server Error"
- PHP-Fehler aktivieren: In .htaccess `php_flag display_errors on`
- Logs prüfen: `/var/log/apache2/error.log`

### "Datenbankverbindung fehlgeschlagen"
- Zugangsdaten in database.php prüfen
- MySQL läuft? `service mysql status`

### "CORS-Fehler im Browser"
- .htaccess prüfen (CORS Headers)
- mod_headers aktiviert? `a2enmod headers`

### Bilder werden nicht angezeigt
- Upload-Ordner Berechtigungen prüfen (755)
- Pfad in database.php: `UPLOAD_URL` korrekt?

## 📞 Support

Bei Fragen: info@oriafresh.de
