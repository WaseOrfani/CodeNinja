#!/bin/bash
# AfghanFood.de - Seed Script
# Führt initiale Daten in die MongoDB ein

echo "🌱 Starte Seed-Prozess für AfghanFood.de..."

# Warte auf MongoDB
until mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
    echo "Warte auf MongoDB..."
    sleep 2
done

echo "MongoDB ist bereit. Importiere Daten..."

# Importiere Seed-Daten
mongosh afghanfood /docker-entrypoint-initdb.d/seed_data.js

echo "🎉 Seed-Prozess abgeschlossen!"
