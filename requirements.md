# ORIA FRESH - Anforderungen & Architektur

## Ursprüngliche Anforderung

Moderne, mobile-first Website mit integriertem Shop für ORIA FRESH (oriafresh.de).
Ziel: Bestellungen über Smartphone in unter 60 Sekunden abschließen.

## Implementierte Features ✅

### Frontend
- [x] Homepage mit Hero, Bestseller, Vorteile-Sektion, Standort-Teaser, CTA
- [x] Shop mit Kategorien (Smash Burger, Chicken & Veggie, Bowls & Salads, Sides, Kids, Drinks, Specials)
- [x] Produktsuche und Sortierung (Preis, Bestseller)
- [x] Produktdetails mit Varianten (Single/Menü) und Extras
- [x] Warenkorb als Slide-Over Drawer
- [x] Checkout mit Abholzeit, Kundendaten, PayPal/Bar-Zahlung
- [x] Bestellbestätigungs-Seite
- [x] Über uns, Standort, Kontakt Seiten
- [x] Rechtliche Seiten (Impressum, Datenschutz, AGB, Widerruf)
- [x] Mobile Bottom Navigation
- [x] Responsive Design (Mobile-First)

### Backend
- [x] RESTful API mit FastAPI
- [x] MongoDB Datenbank
- [x] JWT-Authentifizierung (Access + Refresh Token)
- [x] Produkte CRUD
- [x] Kategorien-Verwaltung
- [x] Bestellungen mit Status-Workflow
- [x] PayPal Integration (Server-side Order Creation & Capture)
- [x] Einstellungen-Verwaltung (Öffnungszeiten, Kontakt)

### Admin Panel
- [x] Secure Login
- [x] Dashboard mit Tagesübersicht (Bestellungen, Umsatz)
- [x] Produkte verwalten (erstellen, bearbeiten, deaktivieren)
- [x] Bestellungen einsehen & Status ändern
- [x] Öffnungszeiten & Einstellungen

### Seed-Daten
- [x] 18 Produkte erstellt
- [x] 7 Kategorien
- [x] Admin-User (admin@oriafresh.de / admin123)

## Architektur

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     React       │────▶│     FastAPI     │────▶│    MongoDB      │
│   (Frontend)    │     │    (Backend)    │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│    PayPal       │     │  Email Service  │
│   (Payments)    │     │    (Mocked)     │
└─────────────────┘     └─────────────────┘
```

## Neu implementiert (Update 2) ✅

### Sicherheit
- [x] Rate-Limiting für Admin-Login (5 Versuche, dann 15 Min. Sperre)
- [x] Passwort-Änderung mit starken Anforderungen (12+ Zeichen, Groß/Klein, Zahl, Sonderzeichen)
- [x] Login-Protokollierung (IP, Zeitstempel)
- [x] Kürzere JWT Token-Laufzeit (15 Min.)

### E-Mail-Service (Resend)
- [x] Resend-Integration vorbereitet
- [x] HTML-E-Mail-Templates (Kunde + Restaurant)
- [x] Fallback auf Mock wenn nicht konfiguriert

### DSGVO
- [x] Cookie-Banner implementiert
- [x] Nur technisch notwendige Cookies

### Umsatz-Booster
- [x] "Dazu passt perfekt" Upsell-Feature im Checkout
- [x] Intelligente Produktempfehlungen (Burger → Käse, Bowl → Protein)

## Nächste Schritte (Next Actions)

1. **Admin-Passwort ändern** - Über `/admin/password` neues sicheres Passwort setzen
2. **PayPal Live-Keys einrichten**:
   ```
   PAYPAL_ENV=live
   PAYPAL_CLIENT_ID=dein-live-client-id
   PAYPAL_CLIENT_SECRET=dein-live-secret
   ```
3. **Resend E-Mail aktivieren**:
   - Account erstellen: https://resend.com
   - Domain verifizieren (SPF/DKIM)
   - API Key in .env: `RESEND_API_KEY=re_xxx`
   - Sender-Email: `SENDER_EMAIL=bestellung@oriafresh.de`
4. **Produktbilder hochladen** - Eigene Produktfotos verwenden
5. **Test-Bestellung** - 1€ Testprodukt mit echtem PayPal testen

## Umsatz-Optimierung (Update 3) ✅

### Automatische Sortierung
- [x] **Bestseller automatisch oben** im Shop
- [x] **Featured → Bestseller → Rest** Sortierlogik
- [x] Featured-Produkte werden zuerst angezeigt (für Monthly Drops)

### Intelligentes Upsell
- [x] **Nur bei Warenkorb < €25** - pusht Mindestkorbwert ohne zu nerven
- [x] Zeigt "Noch €X.XX bis €25" an
- [x] Max. 3 Vorschläge, passend zum Warenkorb

### Featured-Flag im Admin
- [x] ⭐ Featured Toggle für "Monthly Drop" Produkte
- [x] Featured-Badge "⭐ NEU" auf Produktkarten
- [x] Featured-Produkte werden vor Bestsellern angezeigt

## Upsell-Regeln (implementiert)

| Warenkorb enthält | Empfohlene Extras |
|-------------------|-------------------|
| Smash Burger | Extra Käse €1.50, Truffle Mayo €1.80, Jalapeños €1.00 |
| Chicken/Veggie | Extra Sauce €0.80, Extra Käse €1.50 |
| Bowls/Salads | Extra Protein €3.00, Extra Dressing €0.80, Avocado €2.00 |
| Sides/Fries | Cheese Topping €1.50, Bacon Bits €1.80 |

**Erwarteter Impact:** +10-20% Warenkorbwert

## E-Mail Templates

E-Mails werden automatisch gesendet bei:
- Bestellung an Kunde (Bestätigung)
- Bestellung an Restaurant (Neue Bestellung Notification)

Aktuell als Mock implementiert. Aktivierung durch Setzen von `RESEND_API_KEY` in der .env.
