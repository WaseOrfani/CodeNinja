#!/bin/bash
# ORIA FRESH - Export Script
# Erstellt ein ZIP-Archiv für das Self-Hosting

set -e

echo "=== ORIA FRESH Export ==="
echo ""

# Verzeichnisse
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXPORT_DIR="$SCRIPT_DIR/export"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ZIP_NAME="oriafresh_${TIMESTAMP}.zip"

# Cleanup
rm -rf "$EXPORT_DIR"
mkdir -p "$EXPORT_DIR"

echo "[1/4] Backend kopieren..."
cp -r "$SCRIPT_DIR/backend-php" "$EXPORT_DIR/backend"
# Sensible Dateien entfernen
rm -f "$EXPORT_DIR/backend/.env" 2>/dev/null || true
rm -f "$EXPORT_DIR/backend/config/schema.sql" 2>/dev/null || true
rm -f "$EXPORT_DIR/backend/config/seed_data.sql" 2>/dev/null || true

echo "[2/4] Frontend Build erstellen..."
if [ -d "$SCRIPT_DIR/frontend/build" ]; then
    cp -r "$SCRIPT_DIR/frontend/build" "$EXPORT_DIR/frontend"
    echo "    [OK] Build-Ordner gefunden"
else
    echo "    [!] Kein Build gefunden. Führen Sie 'cd frontend && yarn build' aus."
    mkdir -p "$EXPORT_DIR/frontend"
    echo "<h1>Frontend Build fehlt</h1>" > "$EXPORT_DIR/frontend/index.html"
fi

echo "[3/4] Dokumentation kopieren..."
cp "$SCRIPT_DIR/DEPLOYMENT.md" "$EXPORT_DIR/"
cp "$SCRIPT_DIR/README.md" "$EXPORT_DIR/"

echo "[4/4] ZIP-Archiv erstellen..."
cd "$EXPORT_DIR"
zip -r "../$ZIP_NAME" . -x "*.git*" -x "*.DS_Store" -x "node_modules/*"
cd "$SCRIPT_DIR"

# Cleanup
rm -rf "$EXPORT_DIR"

echo ""
echo "=== Export abgeschlossen ==="
echo "Datei: $ZIP_NAME"
echo "Größe: $(du -h "$ZIP_NAME" | cut -f1)"
echo ""
echo "Nächste Schritte:"
echo "1. Laden Sie $ZIP_NAME herunter"
echo "2. Entpacken Sie auf Ihrem Server"
echo "3. Folgen Sie der DEPLOYMENT.md Anleitung"
