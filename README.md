# Hotelprojekt Ziegenkrug – Statische Website

## Projektstruktur
- `index.html` – Startseite mit Fokus auf Direktbuchung
- `hotels/rostock.html` – Standortseite Rostock
- `hotels/schwerin.html` – Standortseite Schwerin
- `hotels/pritzwalk.html` – Standortseite Pritzwalk
- `styles.css` – Zentrales Styling (responsive, mobile first)
- `script.js` – Kleine Interaktionen (FAQ-Details)

## Lokales Starten
1. Im Projektordner einen lokalen Webserver starten, z. B.:
   - Python: `python3 -m http.server 8080`
2. Im Browser öffnen:
   - `http://localhost:8080/index.html`

## Deployment (klassischer Webserver)
1. Alle Dateien in das Webroot hochladen (inkl. Ordner `hotels`).
2. Sicherstellen, dass `index.html` im Root liegt.
3. Domain auf dieses Verzeichnis zeigen lassen (z. B. `www.ziegenkrug.de`).

## Buchungslinks pro Standort eintragen
In allen HTML-Dateien sind Marker hinterlegt, die später ersetzt werden:
- `BOOKING_LINK_ROSTOCK`
- `BOOKING_LINK_SCHWERIN`
- `BOOKING_LINK_PRITZWALK`

Einfach per Suchen/Ersetzen gegen die echten Buchungs-URLs austauschen.
