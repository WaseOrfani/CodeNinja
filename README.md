# ORIA FRESH - E-Commerce Website

Vollständige, self-hostable E-Commerce-Lösung für einen Food-Shop.

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, shadcn/ui
- **Backend:** PHP 8.2, MySQL/MariaDB
- **Keine externen Abhängigkeiten** - läuft auf jedem Standard-Webhosting

## Features

- 🍔 Produktkatalog mit Kategorien
- 🛒 Warenkorb & Checkout
- 💳 Bestellverwaltung
- 👨‍💻 Admin-Panel
- 📱 Mobile-First Design
- 🔒 JWT-basierte Authentifizierung

## Schnellstart

1. **Datenbank einrichten:**
   ```bash
   mysql -u root -p < backend-php/config/001_schema.sql
   mysql -u root -p < backend-php/config/002_seed_menu.sql
   ```

2. **Backend konfigurieren:**
   ```bash
   cp backend-php/.env.example backend-php/.env
   # .env bearbeiten mit Ihren Datenbank-Zugangsdaten
   ```

3. **Frontend bauen:**
   ```bash
   cd frontend
   yarn install
   yarn build
   ```

4. **Deployment:** Siehe [DEPLOYMENT.md](DEPLOYMENT.md)

## Admin-Zugang

- **E-Mail:** admin@oriafresh.de
- **Passwort:** admin123

## Lizenz

Proprietary - ORIA FRESH
