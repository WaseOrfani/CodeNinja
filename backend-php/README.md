# ORIA FRESH - PHP/MySQL Backend

Dieses Verzeichnis enthält das vollständige PHP-Backend für ORIA FRESH.

## Schnellstart

### 1. Datenbank einrichten

```bash
# In phpMyAdmin oder MySQL CLI:
mysql -u root -p < config/001_schema.sql
mysql -u root -p < config/002_seed_menu.sql
```

### 2. Konfiguration anpassen

```bash
cp .env.example .env
nano .env  # Datenbankzugangsdaten eintragen
```

### 3. Testen

```bash
curl http://localhost/api/categories
curl http://localhost/api/products
```

## API Endpunkte

### Öffentlich (ohne Auth)

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| GET | `/api/categories` | Alle Kategorien |
| GET | `/api/products` | Alle Produkte |
| GET | `/api/products?category=burger` | Produkte einer Kategorie |
| GET | `/api/products/{id}` | Einzelnes Produkt mit Extras |
| GET | `/api/bestsellers` | Bestseller |
| GET | `/api/extras` | Alle Extras |
| GET | `/api/settings` | Shop-Einstellungen |
| POST | `/api/orders` | Bestellung aufgeben |
| GET | `/api/orders/{id}/status` | Bestellstatus prüfen |
| POST | `/api/contact` | Kontaktformular |

### Admin (Auth erforderlich)

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| POST | `/api/admin/login` | Admin-Login |
| GET | `/api/admin/me` | Aktueller Admin |
| GET | `/api/admin/dashboard` | Dashboard-Statistiken |
| GET | `/api/admin/orders` | Alle Bestellungen |
| PUT | `/api/admin/orders/{id}/status?new_status=...` | Status ändern |
| GET | `/api/admin/products` | Alle Produkte |
| POST | `/api/admin/products` | Produkt erstellen |
| PUT | `/api/admin/products/{id}` | Produkt bearbeiten |
| DELETE | `/api/admin/products/{id}` | Produkt löschen |
| PUT | `/api/admin/settings` | Einstellungen speichern |

## Admin-Login

- **E-Mail:** admin@oriafresh.de
- **Passwort:** admin123

## Dateistruktur

```
backend-php/
├── api/
│   ├── index.php        # Router
│   ├── categories.php   # Kategorien
│   ├── products.php     # Produkte
│   ├── orders.php       # Bestellungen
│   ├── admin.php        # Admin-Funktionen
│   ├── bestsellers.php  # Bestseller
│   ├── settings.php     # Einstellungen
│   ├── extras.php       # Extras
│   ├── contact.php      # Kontakt
│   └── .htaccess        # URL Rewriting
├── config/
│   ├── database.php     # DB-Verbindung
│   ├── 001_schema.sql   # Datenbank-Schema
│   └── 002_seed_menu.sql # Produktdaten
├── includes/
│   └── functions.php    # Hilfsfunktionen
├── uploads/             # Hochgeladene Bilder
├── .env.example         # Beispiel-Konfiguration
├── setup.php            # Installations-Skript
└── README.md            # Diese Datei
```
