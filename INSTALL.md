# AfghanFood.de - Installationsanleitung

## 🚀 Schnellstart

Mit Docker Compose kann die gesamte Anwendung mit wenigen Befehlen gestartet werden.

### Voraussetzungen

- **Betriebssystem**: Ubuntu 20.04+ / Debian 11+ (oder jedes Linux mit Docker)
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **RAM**: Mindestens 2 GB
- **Speicherplatz**: Mindestens 5 GB frei
- **Ports**: 80 und 443 müssen verfügbar sein

### Installation

#### 1. Docker installieren (falls nicht vorhanden)

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Neu einloggen oder: newgrp docker
```

#### 2. Projekt auf den Server kopieren

```bash
# ZIP-Datei auf Server kopieren
scp afghanfood.zip user@server:/home/user/

# Auf dem Server
cd /home/user
unzip afghanfood.zip
cd afghanfood
```

#### 3. Umgebungsvariablen konfigurieren

```bash
# .env Datei erstellen
cp .env.example .env

# Bearbeiten Sie die .env Datei
nano .env
```

**Wichtige Einstellungen in `.env`:**

```env
# Sicheres JWT Secret generieren
JWT_SECRET=$(openssl rand -base64 32)

# Ihre Domain (mit https:// für Produktion)
BACKEND_URL=https://ihre-domain.de

# Erlaubte Origins
CORS_ORIGINS=https://ihre-domain.de,https://www.ihre-domain.de
```

#### 4. Anwendung starten

```bash
# Alle Container bauen und starten
docker compose up -d --build

# Logs anzeigen
docker compose logs -f
```

#### 5. Seed-Daten importieren (erster Start)

```bash
# Container betreten und Seed ausführen
docker compose exec backend python seed_data.py
```

Die Anwendung ist nun unter `http://ihre-server-ip` erreichbar.

---

## 🔒 SSL/HTTPS mit Let's Encrypt einrichten

### 1. Certbot installieren

```bash
sudo apt install certbot
```

### 2. Zertifikat erstellen

```bash
# Container stoppen
docker compose down

# Zertifikat erstellen
sudo certbot certonly --standalone -d ihre-domain.de -d www.ihre-domain.de

# Zertifikate kopieren
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/ihre-domain.de/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/ihre-domain.de/privkey.pem nginx/ssl/
sudo chown -R $USER:$USER nginx/ssl/
```

### 3. HTTPS in Nginx aktivieren

Bearbeiten Sie `nginx/nginx.conf`:

1. Kommentieren Sie den HTTP-Block aus (location-Abschnitte)
2. Kommentieren Sie den HTTPS-Server-Block ein
3. Ersetzen Sie `your-domain.de` mit Ihrer Domain

### 4. Neustart

```bash
docker compose up -d
```

### 5. Automatische Zertifikatserneuerung

```bash
# Crontab bearbeiten
crontab -e

# Zeile hinzufügen (erneuert alle 2 Monate):
0 0 1 */2 * certbot renew --quiet && docker compose restart nginx
```

---

## 📤 Bildupload-Funktion

Die Anwendung unterstützt Bildupload für Rezepte und Blog-Artikel.

### Konfiguration

- **Upload-Verzeichnis**: Die Bilder werden im Docker-Volume `uploads_data` gespeichert
- **Erlaubte Dateitypen**: JPG, JPEG, PNG, GIF, WebP
- **Maximale Dateigröße**: 5 MB

### Backup der Uploads

```bash
# Backup erstellen
docker run --rm -v afghanfood_uploads_data:/data -v $(pwd):/backup alpine tar cvf /backup/uploads_backup.tar /data

# Backup wiederherstellen
docker run --rm -v afghanfood_uploads_data:/data -v $(pwd):/backup alpine tar xvf /backup/uploads_backup.tar -C /
```

---

## 🌐 Domain-Konfiguration

### DNS-Einstellungen

Erstellen Sie folgende DNS-Einträge bei Ihrem Domain-Provider:

| Typ | Name | Wert |
|-----|------|------|
| A | @ | Ihre-Server-IP |
| A | www | Ihre-Server-IP |
| CNAME | api | ihre-domain.de |

---

## 📁 Verzeichnisstruktur

```
afghanfood/
├── backend/               # FastAPI Backend
│   ├── server.py         # Haupt-API
│   ├── seed_data.py      # Seed-Skript
│   ├── requirements.txt  # Python Dependencies
│   ├── uploads/          # Hochgeladene Bilder (Volume)
│   └── Dockerfile
├── frontend/              # React Frontend
│   ├── src/              # React Source Code
│   ├── public/           # Statische Dateien
│   ├── nginx.conf        # Frontend Nginx Config
│   └── Dockerfile
├── nginx/                 # Reverse Proxy
│   ├── nginx.conf        # Haupt-Konfiguration
│   └── ssl/              # SSL-Zertifikate
├── seed/                  # Seed-Daten
│   ├── seed.sh           # Seed-Skript
│   └── seed_data.js      # MongoDB Seed
├── docker-compose.yml     # Docker Compose Config
├── .env.example          # Beispiel-Umgebungsvariablen
├── INSTALL.md            # Diese Datei
└── INFO.txt              # Kurzinfo
```

---

## 🔧 Wartung & Befehle

### Container verwalten

```bash
# Status anzeigen
docker compose ps

# Logs anzeigen
docker compose logs -f [service]

# Neustart
docker compose restart [service]

# Stoppen
docker compose down

# Mit Volumes löschen (ACHTUNG: Löscht Datenbank + Uploads!)
docker compose down -v
```

### Datenbank-Backup

```bash
# Backup erstellen
docker compose exec mongodb mongodump --out /data/backup

# Backup kopieren
docker cp afghanfood-mongodb:/data/backup ./backup-$(date +%Y%m%d)

# Backup wiederherstellen
docker cp ./backup-DATUM afghanfood-mongodb:/data/backup
docker compose exec mongodb mongorestore /data/backup
```

### Komplettes Backup (DB + Uploads)

```bash
#!/bin/bash
# backup.sh - Speichern Sie dieses Skript

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# MongoDB Backup
docker compose exec -T mongodb mongodump --archive > $BACKUP_DIR/mongodb.archive

# Uploads Backup
docker run --rm -v afghanfood_uploads_data:/data -v $(pwd)/$BACKUP_DIR:/backup alpine tar cvf /backup/uploads.tar /data

echo "Backup erstellt in: $BACKUP_DIR"
```

### Updates einspielen

```bash
# Neue Version hochladen
# Container neu bauen
docker compose build --no-cache
docker compose up -d
```

---

## 🐛 Fehlerbehebung

### Container startet nicht

```bash
# Logs prüfen
docker compose logs [container-name]

# Ports prüfen
sudo netstat -tlnp | grep -E '(80|443|8001)'
```

### Datenbank-Verbindung fehlgeschlagen

```bash
# MongoDB prüfen
docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Frontend zeigt Fehler

```bash
# Browser-Console prüfen (F12)
# CORS-Einstellungen in .env prüfen
# BACKEND_URL muss von außen erreichbar sein
```

### Bildupload funktioniert nicht

```bash
# Prüfen ob Volume existiert
docker volume ls | grep uploads

# Berechtigungen im Container prüfen
docker compose exec backend ls -la /app/uploads
```

---

## 📞 Support

Bei Fragen oder Problemen:
- E-Mail: info@afghanfood.de

---

**Viel Erfolg mit AfghanFood.de!** 🍲
