# AfghanFood.de - Product Requirements Document

## Projektübersicht

**Projektname:** AfghanFood.de  
**Version:** 1.1.0  
**Erstellungsdatum:** Januar 2026  
**Status:** Produktionsbereit ✅

---

## Ursprüngliche Anforderung

Eine vollständig funktionsfähige Food- & Kultur-Plattform für afghanische Küche, ähnlich einem WordPress-System, aber als moderne React-Anwendung mit:
- Rezepte-Management (CRUD)
- Blog-Funktion mit SEO
- Statische Inhaltsseiten
- Admin-Panel
- Bildupload
- Docker-basiertes Deployment

---

## Benutzer-Personas

### 1. Food-Enthusiast (Besucher)
- Sucht nach authentischen afghanischen Rezepten
- Möchte mehr über afghanische Esskultur erfahren
- Verwendet Desktop und Mobile

### 2. Administrator
- Verwaltet Rezepte und Blog-Artikel
- Pflegt statische Seiten
- Benötigt einfaches Admin-Interface mit Bildupload

---

## Kernfunktionen (Implementiert)

### ✅ Frontend (React 19 + TailwindCSS)

| Feature | Status |
|---------|--------|
| Responsive Design | ✅ |
| Startseite mit Hero | ✅ |
| Rezepte-Übersicht mit Filter | ✅ |
| Rezept-Detailseite | ✅ |
| Blog-Übersicht | ✅ |
| Blog-Artikel-Detail | ✅ |
| Statische Seiten (6 Stück) | ✅ |
| Admin-Login | ✅ |
| Admin-Dashboard (Tabs) | ✅ |
| Rezept-CRUD im Admin | ✅ |
| Blog-CRUD im Admin | ✅ |
| Bildupload-Funktion | ✅ |
| Navigation & Footer | ✅ |
| Deutsche Lokalisierung | ✅ |

### ✅ Backend (FastAPI + MongoDB)

| Feature | Status |
|---------|--------|
| REST API | ✅ |
| JWT Authentication | ✅ |
| Rezepte CRUD | ✅ |
| Blog CRUD mit SEO-Feldern | ✅ |
| Bildupload API | ✅ |
| Statische Seiten API | ✅ |
| Kategorien-System | ✅ |
| Sitemap-Endpunkt | ✅ |
| Health Check | ✅ |

### ✅ Deployment

| Feature | Status |
|---------|--------|
| Docker Compose | ✅ |
| Dockerfiles (Frontend/Backend) | ✅ |
| Nginx Reverse Proxy | ✅ |
| SSL-Ready Config | ✅ |
| Upload-Volume | ✅ |
| Seed-Daten | ✅ |
| INSTALL.md Anleitung | ✅ |
| INFO.txt Dokumentation | ✅ |

---

## Design-System

**Farbpalette:**
- Safran: #D4A017
- Dunkelgrün (Pine): #1B4D3E
- Creme: #FFF8E7
- Granatapfel: #C41E3A

**Typografie:**
- Überschriften: Playfair Display
- Fließtext: Inter
- Akzente: Caveat

---

## Technologie-Stack

| Layer | Technologie |
|-------|-------------|
| Frontend | React 19, TailwindCSS 3.4, React Router 7 |
| Backend | FastAPI, Python 3.11 |
| Datenbank | MongoDB 7 |
| Auth | JWT (PyJWT, bcrypt) |
| Container | Docker, Docker Compose |
| Webserver | Nginx Alpine |

---

## API-Endpunkte

### Öffentlich
- `GET /api/` - API Status
- `GET /api/health` - Health Check
- `GET /api/recipes` - Alle Rezepte
- `GET /api/recipes/{slug}` - Einzelnes Rezept
- `GET /api/blog` - Alle Blog-Artikel
- `GET /api/blog/{slug}` - Einzelner Artikel
- `GET /api/pages/{slug}` - Statische Seite
- `GET /api/categories` - Rezept-Kategorien
- `GET /api/blog-categories` - Blog-Kategorien
- `GET /api/uploads/{file}` - Hochgeladene Bilder

### Authentifiziert (Admin)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Benutzer-Info
- `POST /api/upload` - Bild hochladen
- `POST /api/recipes` - Rezept erstellen
- `PUT /api/recipes/{id}` - Rezept aktualisieren
- `DELETE /api/recipes/{id}` - Rezept löschen
- `POST /api/blog` - Artikel erstellen
- `PUT /api/blog/{id}` - Artikel aktualisieren
- `DELETE /api/blog/{id}` - Artikel löschen

---

## Was wurde implementiert

**24. Januar 2026 - Version 1.0:**
- [x] Vollständiges Backend mit allen API-Endpunkten
- [x] Vollständiges Frontend mit allen Seiten
- [x] Admin-Panel mit Rezept-CRUD
- [x] Seed-Daten (3 Rezepte, 1 Blog-Post, 6 Seiten)
- [x] Docker-Konfiguration
- [x] Installationsanleitung

**24. Januar 2026 - Version 1.1:**
- [x] Blog-CRUD im Admin-Dashboard (Tabs: Rezepte | Blog)
- [x] Meta-Titel & Meta-Description pro Blog-Artikel
- [x] Bildupload-Funktion für Rezepte & Blog
- [x] URL-Fallback für externe Bilder
- [x] Persistentes Upload-Volume
- [x] Aktualisierte Dokumentation

---

## Admin-Zugangsdaten

| Feld | Wert |
|------|------|
| URL | /login |
| E-Mail | admin@afghanfood.de |
| Passwort | Admin123! |

⚠️ **Passwort nach erstem Login ändern!**

---

## Backlog / Zukünftige Features (Phase 2)

### P1 (Wichtig)
- [ ] Newsletter-Funktion (vorgemerkt)
- [ ] Rezept-Suche
- [ ] Kontaktformular

### P2 (Nice-to-have)
- [ ] Rezept-Bewertungen
- [ ] Kommentare
- [ ] Social Sharing
- [ ] Mehrsprachigkeit (EN)
- [ ] Dark Mode

---

## Deployment-Checklist

```bash
# 1. Dateien auf Server kopieren
scp afghanfood.zip user@server:/home/user/

# 2. Entpacken
unzip afghanfood.zip && cd afghanfood

# 3. Environment konfigurieren
cp .env.example .env
nano .env  # JWT_SECRET, BACKEND_URL, CORS_ORIGINS anpassen

# 4. Starten
docker compose up -d --build

# 5. Seed-Daten laden
docker compose exec backend python seed_data.py

# 6. Testen
curl http://localhost/api/health
```

---

## Dateien für Export

```
afghanfood/
├── backend/
│   ├── server.py
│   ├── seed_data.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── nginx.conf
│   ├── Dockerfile
│   └── .env
├── nginx/
│   └── nginx.conf
├── seed/
│   ├── seed.sh
│   └── seed_data.js
├── docker-compose.yml
├── .env.example
├── INSTALL.md
└── INFO.txt
```
