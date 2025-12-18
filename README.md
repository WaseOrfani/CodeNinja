# ORIA FRESH - Food Ordering Website

Modern, mobile-first website mit integriertem Shop für ORIA FRESH.

## 🚀 Features

### Frontend
- **Homepage**: Hero-Bereich, Bestseller, Vorteile-Sektion
- **Shop**: Kategorien-Filter, Produktsuche, Sortierung
- **Produktdetails**: Varianten (Single/Menü), Extras
- **Warenkorb**: Drawer, Mengensteuerung
- **Checkout**: Abholzeit, Kundendaten, PayPal/Bar-Zahlung
- **Rechtliches**: Impressum, Datenschutz, AGB, Widerruf

### Admin Panel
- JWT-Authentifizierung
- Dashboard mit Tagesübersicht
- Produkte verwalten (CRUD)
- Bestellungen einsehen & Status ändern
- Öffnungszeiten & Einstellungen

## 🛠 Tech Stack

- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI (Python)
- **Datenbank**: MongoDB
- **Zahlung**: PayPal Checkout

## ⚙️ Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=oria_fresh
CORS_ORIGINS=*
JWT_SECRET=your-secret-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
PAYPAL_ENV=sandbox
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_PAYPAL_CLIENT_ID=your-paypal-client-id
```

## 🔑 PayPal Sandbox Setup

1. Erstelle einen Account auf [developer.paypal.com](https://developer.paypal.com)
2. Erstelle eine Sandbox App
3. Kopiere Client ID und Secret in die .env Dateien
4. Nutze Sandbox-Konten zum Testen

## 👤 Admin-Zugang

Nach dem Seeding:
- **E-Mail**: admin@oriafresh.de
- **Passwort**: admin123

## 📦 API Endpoints

### Public
- `GET /api/products` - Alle Produkte
- `GET /api/products/{id}` - Produkt-Details
- `GET /api/categories` - Alle Kategorien
- `GET /api/bestsellers` - Bestseller-Produkte
- `GET /api/settings` - Restaurant-Einstellungen
- `POST /api/orders` - Bestellung erstellen
- `POST /api/orders/{id}/capture` - PayPal-Zahlung abschließen
- `GET /api/orders/{id}/status` - Bestellstatus

### Admin (JWT erforderlich)
- `POST /api/admin/login` - Admin-Login
- `GET /api/admin/me` - Admin-Info
- `GET /api/admin/dashboard` - Dashboard-Daten
- `GET /api/admin/products` - Alle Produkte (inkl. inaktive)
- `POST /api/admin/products` - Produkt erstellen
- `PUT /api/admin/products/{id}` - Produkt bearbeiten
- `DELETE /api/admin/products/{id}` - Produkt deaktivieren
- `GET /api/admin/orders` - Alle Bestellungen
- `PUT /api/admin/orders/{id}/status` - Status ändern
- `PUT /api/admin/settings` - Einstellungen speichern

## 🏃 Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend
cd frontend
yarn install
yarn start

# Datenbank seeden
curl -X POST http://localhost:8001/api/seed
```

## 📱 Seiten

| Route | Beschreibung |
|-------|-------------|
| `/` | Homepage |
| `/shop` | Shop mit allen Produkten |
| `/shop/:category` | Shop gefiltert nach Kategorie |
| `/product/:id` | Produktdetails |
| `/cart` | Warenkorb |
| `/checkout` | Kasse |
| `/order-confirmation/:id` | Bestellbestätigung |
| `/about` | Über uns |
| `/location` | Standort & Öffnungszeiten |
| `/contact` | Kontaktformular |
| `/impressum` | Impressum |
| `/datenschutz` | Datenschutzerklärung |
| `/agb` | AGB |
| `/widerruf` | Widerrufsbelehrung |
| `/admin/login` | Admin-Login |
| `/admin` | Admin-Dashboard |
| `/admin/products` | Produkte verwalten |
| `/admin/orders` | Bestellungen |
| `/admin/settings` | Einstellungen |

## 📧 E-Mail Service

Der E-Mail-Service ist aktuell als Mock implementiert. Bestellbestätigungen werden in der Konsole und in der DB geloggt. Später einfach austauschbar mit Resend/SendGrid.

---

© 2024 ORIA FRESH
