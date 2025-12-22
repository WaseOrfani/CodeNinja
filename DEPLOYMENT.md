# ORIA FRESH - Deployment Guide

Vollständige Anleitung für das Self-Hosting auf All-Inkl, IONOS, Hetzner oder jedem anderen Standard-Webhosting.

## Voraussetzungen

- PHP 8.0+ mit PDO MySQL
- MySQL 8.0+ oder MariaDB 10.5+
- Apache mit mod_rewrite ODER nginx
- Node.js 18+ (nur für Frontend-Build)

---

## 1. Datenbank einrichten

### Option A: phpMyAdmin

1. Neue Datenbank erstellen: `oriafresh`
2. Datei `backend-php/config/001_schema.sql` importieren
3. Datei `backend-php/config/002_seed_menu.sql` importieren

### Option B: MySQL CLI

```bash
mysql -u USERNAME -p < backend-php/config/001_schema.sql
mysql -u USERNAME -p < backend-php/config/002_seed_menu.sql
```

---

## 2. Backend konfigurieren

### 2.1 Umgebungsvariablen setzen

Kopieren Sie die Beispiel-Konfiguration:

```bash
cp backend-php/.env.example backend-php/.env
```

Bearbeiten Sie `backend-php/.env`:

```env
DB_HOST=localhost
DB_NAME=oriafresh
DB_USER=ihr_db_benutzer
DB_PASS=ihr_db_passwort
JWT_SECRET=ein-sehr-langes-sicheres-geheimnis-hier

# Optional: E-Mail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ihr-email@gmail.com
SMTP_PASS=ihr-app-passwort
SMTP_FROM=info@oriafresh.de
ADMIN_EMAIL=info@oriafresh.de
```

### 2.2 Alternative: Direkt in database.php

Wenn keine .env unterstützt wird, bearbeiten Sie `backend-php/config/database.php` direkt:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'oriafresh');
define('DB_USER', 'ihr_db_benutzer');
define('DB_PASS', 'ihr_db_passwort');
```

---

## 3. Frontend konfigurieren & bauen

### 3.1 API-URL setzen

Bearbeiten Sie `frontend/.env`:

```env
REACT_APP_BACKEND_URL=https://ihre-domain.de
```

### 3.2 Production Build erstellen

```bash
cd frontend
yarn install
yarn build
```

Das erstellt einen `build/` Ordner mit den statischen Dateien.

---

## 4. Dateien hochladen

### Verzeichnisstruktur auf dem Server

```
public_html/
├── api/                    # backend-php/api/*
│   ├── .htaccess
│   ├── index.php
│   ├── categories.php
│   ├── products.php
│   ├── orders.php
│   ├── admin.php
│   └── ...
├── config/                 # backend-php/config/*
│   ├── database.php
│   └── ...
├── includes/               # backend-php/includes/*
│   └── functions.php
├── uploads/                # Für Produkt-Bilder
│   └── products/
├── index.html              # frontend/build/*
├── static/
└── ...
```

### Upload-Schritte

1. **Backend hochladen:**
   - Kopieren Sie `backend-php/api/*` nach `public_html/api/`
   - Kopieren Sie `backend-php/config/*` nach `public_html/config/`
   - Kopieren Sie `backend-php/includes/*` nach `public_html/includes/`
   - Erstellen Sie `public_html/uploads/products/` (mit Schreibrechten)

2. **Frontend hochladen:**
   - Kopieren Sie `frontend/build/*` nach `public_html/`

---

## 5. Apache Konfiguration

### .htaccess für Root-Verzeichnis (public_html/.htaccess)

```apache
RewriteEngine On

# Wenn die Datei/Ordner existiert, direkt ausliefern
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# API-Anfragen an PHP weiterleiten
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Alles andere an React weiterleiten
RewriteRule ^ index.html [L]
```

---

## 6. nginx Konfiguration (Alternative)

```nginx
server {
    listen 80;
    server_name ihre-domain.de;
    root /var/www/oriafresh/public_html;
    index index.html;

    # API-Routing
    location /api/ {
        try_files $uri /api/index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # React SPA Routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 7. Testen

### API testen

```bash
# Kategorien
curl https://ihre-domain.de/api/categories

# Produkte
curl https://ihre-domain.de/api/products

# Admin Login
curl -X POST https://ihre-domain.de/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oriafresh.de","password":"admin123"}'
```

### Frontend testen

1. Öffnen Sie https://ihre-domain.de
2. Navigieren Sie zum Shop
3. Fügen Sie Produkte zum Warenkorb hinzu
4. Testen Sie den Checkout
5. Loggen Sie sich als Admin ein: /admin

---

## 8. Admin-Zugang

- **URL:** https://ihre-domain.de/admin
- **E-Mail:** admin@oriafresh.de
- **Passwort:** admin123

⚠️ **Wichtig:** Ändern Sie das Admin-Passwort sofort nach der ersten Anmeldung!

---

## 9. Troubleshooting

### Problem: 500 Internal Server Error

1. Prüfen Sie die PHP-Fehlerprotokolle
2. Stellen Sie sicher, dass PDO MySQL installiert ist:
   ```bash
   php -m | grep pdo_mysql
   ```
3. Prüfen Sie die Datenbankverbindung in `config/database.php`

### Problem: CORS-Fehler

Stellen Sie sicher, dass die CORS-Header in `includes/functions.php` korrekt sind:

```php
header('Access-Control-Allow-Origin: *');
```

Für Produktion sollten Sie die Origin einschränken:

```php
header('Access-Control-Allow-Origin: https://ihre-domain.de');
```

### Problem: 404 bei API-Aufrufen

Prüfen Sie, ob mod_rewrite aktiviert ist:

```bash
a2enmod rewrite
service apache2 restart
```

---

## 10. Produktbilder

Produktbilder werden im Ordner `uploads/products/` gespeichert.

Benennung: Verwenden Sie den Produkt-Slug + .jpg/.png

Beispiele:
- `classic-smash-burger.jpg`
- `cheese-smash-burger.jpg`

Stellen Sie sicher, dass der Ordner Schreibrechte hat:

```bash
chmod 755 uploads/products/
```

---

## Support

Bei Fragen wenden Sie sich an: info@oriafresh.de
