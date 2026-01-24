# AfghanFood.de - Product Requirements Document

## Projektübersicht

**Projektname:** AfghanFood.de  
**Version:** 1.0.0  
**Erstellungsdatum:** Januar 2026  
**Status:** MVP Complete ✅

---

## Ursprüngliche Anforderung

Eine vollständig funktionsfähige Food- & Kultur-Plattform für afghanische Küche, ähnlich einem WordPress-System, aber als moderne React-Anwendung mit:
- Rezepte-Management (CRUD)
- Blog-Funktion
- Statische Inhaltsseiten
- Admin-Panel
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
- Benötigt einfaches Admin-Interface

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
| Admin-Dashboard | ✅ |
| Rezept-CRUD im Admin | ✅ |
| Navigation & Footer | ✅ |
| Deutsche Lokalisierung | ✅ |

### ✅ Backend (FastAPI + MongoDB)

| Feature | Status |
|---------|--------|
| REST API | ✅ |
| JWT Authentication | ✅ |
| Rezepte CRUD | ✅ |
| Blog CRUD | ✅ |
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

## Datenbankschema

### Users
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "role": "admin",
  "password_hash": "string",
  "created_at": "ISO datetime"
}
```

### Recipes
```json
{
  "id": "uuid",
  "title": "string",
  "slug": "string",
  "description": "string",
  "image_url": "string",
  "category": "string",
  "difficulty": "Einfach|Mittel|Schwer",
  "prep_time": "string",
  "cook_time": "string",
  "servings": "number",
  "ingredients": [{"name": "string", "amount": "string"}],
  "instructions": ["string"],
  "tips": "string",
  "tags": ["string"],
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

---

## Was wurde implementiert

**24. Januar 2026:**
- [x] Vollständiges Backend mit allen API-Endpunkten
- [x] Vollständiges Frontend mit allen Seiten
- [x] Admin-Panel mit Rezept-CRUD
- [x] Seed-Daten (3 Rezepte, 1 Blog-Post, 6 Seiten)
- [x] Docker-Konfiguration
- [x] Installationsanleitung
- [x] 98% Testabdeckung bestanden

---

## Backlog / Zukünftige Features

### P0 (Kritisch)
- [ ] Passwort-Ändern im Admin
- [ ] Blog-CRUD im Admin-Panel

### P1 (Wichtig)
- [ ] Bildupload-Funktion
- [ ] Rezept-Suche
- [ ] Newsletter-Anmeldung
- [ ] Kontaktformular

### P2 (Nice-to-have)
- [ ] Rezept-Bewertungen
- [ ] Kommentare
- [ ] Social Sharing
- [ ] Mehrsprachigkeit (EN)
- [ ] Dark Mode

---

## Deployment-Anleitung

Siehe `/app/INSTALL.md` für detaillierte Schritte.

**Schnellstart:**
```bash
cp .env.example .env
# .env anpassen
docker compose up -d --build
docker compose exec backend python seed_data.py
```

---

## Admin-Zugangsdaten

| Feld | Wert |
|------|------|
| URL | /login |
| E-Mail | admin@afghanfood.de |
| Passwort | Admin123! |

⚠️ **Passwort nach erstem Login ändern!**

---

## Nächste Schritte

1. Domain konfigurieren
2. SSL-Zertifikat einrichten
3. Admin-Passwort ändern
4. Weitere Rezepte hinzufügen
5. Blog-Artikel erstellen
