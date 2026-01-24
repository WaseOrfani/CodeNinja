// AfghanFood.de - MongoDB Seed Data
// Wird beim ersten Start automatisch ausgeführt

// Admin User
db.users.insertOne({
    "id": "admin-user-001",
    "email": "admin@afghanfood.de",
    "name": "Administrator",
    "role": "admin",
    "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4m3LfU5N/dJhJLiy", // Admin123!
    "created_at": new Date().toISOString()
});

// Rezepte
db.recipes.insertMany([
    {
        "id": "recipe-001",
        "title": "Qabuli Palaw",
        "slug": "qabuli-palaw",
        "description": "Das Nationalgericht Afghanistans - ein aromatisches Reisgericht mit Lamm, Karotten, Rosinen und Gewürzen. Qabuli Palaw ist das Herzstück jeder afghanischen Feier.",
        "image_url": "https://images.unsplash.com/photo-1634324092526-91f5e878b72f?w=800",
        "category": "hauptgerichte",
        "difficulty": "Mittel",
        "prep_time": "30 Minuten",
        "cook_time": "2 Stunden",
        "servings": 6,
        "ingredients": [
            {"name": "Basmati Reis", "amount": "500g"},
            {"name": "Lammfleisch (Schulter)", "amount": "800g"},
            {"name": "Karotten", "amount": "4 große"},
            {"name": "Rosinen", "amount": "100g"},
            {"name": "Zwiebeln", "amount": "2 große"},
            {"name": "Pflanzenöl", "amount": "150ml"},
            {"name": "Kreuzkümmel", "amount": "1 TL"},
            {"name": "Kardamom", "amount": "5 Kapseln"},
            {"name": "Zimt", "amount": "1 Stange"},
            {"name": "Salz", "amount": "nach Geschmack"},
            {"name": "Schwarzer Pfeffer", "amount": "1/2 TL"}
        ],
        "instructions": [
            "Den Reis in kaltem Wasser waschen, bis das Wasser klar ist. Dann für 30 Minuten einweichen.",
            "Das Lammfleisch in große Stücke schneiden und in einem großen Topf mit den Zwiebeln, Kardamom und Zimt anbraten.",
            "Mit Wasser bedecken und bei niedriger Hitze 1,5 Stunden köcheln lassen, bis das Fleisch zart ist.",
            "Die Karotten in dünne Streifen schneiden. In einer Pfanne mit etwas Öl und Zucker karamellisieren.",
            "Die Rosinen separat in warmem Wasser einweichen.",
            "Den eingeweichten Reis in kochendem Salzwasser halb gar kochen (ca. 7 Minuten).",
            "Den Reis abgießen und in Schichten mit dem Fleisch in den Topf geben.",
            "Etwas Fleischbrühe darüber gießen und bei niedriger Hitze 30 Minuten dämpfen.",
            "Zum Servieren den Reis auf eine große Platte geben, das Fleisch in die Mitte legen und mit den karamellisierten Karotten und Rosinen garnieren."
        ],
        "tips": "Das Geheimnis eines perfekten Qabuli Palaw liegt in der Qualität des Reises und der Geduld beim Dämpfen.",
        "tags": ["Traditionell", "Festessen", "Lamm", "Reis"],
        "created_at": new Date().toISOString(),
        "updated_at": new Date().toISOString()
    },
    {
        "id": "recipe-002",
        "title": "Mantu",
        "slug": "mantu",
        "description": "Afghanische Teigtaschen gefüllt mit gewürztem Hackfleisch, serviert mit Joghurt-Knoblauch-Sauce und Tomaten-Linsen-Sauce.",
        "image_url": "https://images.unsplash.com/photo-1648726443433-d5a62ba13863?w=800",
        "category": "hauptgerichte",
        "difficulty": "Schwer",
        "prep_time": "1 Stunde",
        "cook_time": "45 Minuten",
        "servings": 4,
        "ingredients": [
            {"name": "Mehl", "amount": "400g"},
            {"name": "Wasser", "amount": "200ml"},
            {"name": "Salz", "amount": "1 TL"},
            {"name": "Rinderhackfleisch", "amount": "500g"},
            {"name": "Zwiebeln", "amount": "3 große"},
            {"name": "Knoblauch", "amount": "4 Zehen"},
            {"name": "Koriander (gemahlen)", "amount": "1 TL"},
            {"name": "Kreuzkümmel", "amount": "1 TL"},
            {"name": "Joghurt", "amount": "400g"},
            {"name": "Tomatenmark", "amount": "3 EL"},
            {"name": "Gelbe Linsen", "amount": "100g"}
        ],
        "instructions": [
            "Für den Teig: Mehl, Wasser und Salz zu einem glatten Teig verkneten. 30 Minuten ruhen lassen.",
            "Für die Füllung: Hackfleisch mit fein gewürfelten Zwiebeln, Gewürzen und Salz vermischen.",
            "Den Teig dünn ausrollen und in 8x8cm große Quadrate schneiden.",
            "Jeweils 1 EL Füllung in die Mitte setzen und die Ecken zusammenfalten.",
            "Die Mantu in einem Dämpfeinsatz 40-45 Minuten dämpfen.",
            "Für die Joghurt-Sauce: Joghurt mit gepresstem Knoblauch und Salz verrühren.",
            "Für die Tomaten-Sauce: Linsen weich kochen, Tomatenmark und Gewürze hinzufügen.",
            "Die Mantu auf einem Teller anrichten, erst mit Joghurt-, dann mit Tomaten-Sauce übergießen."
        ],
        "tips": "Die Mantu können auch eingefroren werden. Direkt aus dem Gefrierschrank dämpfen.",
        "tags": ["Teigtaschen", "Hackfleisch", "Festessen"],
        "created_at": new Date().toISOString(),
        "updated_at": new Date().toISOString()
    },
    {
        "id": "recipe-003",
        "title": "Bolani",
        "slug": "bolani",
        "description": "Knusprige afghanische Fladenbrote gefüllt mit Kartoffeln und Lauch. Perfekt als Vorspeise oder Beilage.",
        "image_url": "https://images.unsplash.com/photo-1629782665638-cf19de43c96a?w=800",
        "category": "vorspeisen",
        "difficulty": "Einfach",
        "prep_time": "20 Minuten",
        "cook_time": "20 Minuten",
        "servings": 8,
        "ingredients": [
            {"name": "Mehl", "amount": "500g"},
            {"name": "Wasser (warm)", "amount": "250ml"},
            {"name": "Salz", "amount": "1 TL"},
            {"name": "Kartoffeln", "amount": "500g"},
            {"name": "Lauch", "amount": "2 Stangen"},
            {"name": "Frischer Koriander", "amount": "1 Bund"},
            {"name": "Kurkuma", "amount": "1/2 TL"},
            {"name": "Chili", "amount": "1/2 TL"},
            {"name": "Pflanzenöl", "amount": "zum Braten"}
        ],
        "instructions": [
            "Mehl, Wasser und Salz zu einem weichen Teig verkneten. 15 Minuten ruhen lassen.",
            "Kartoffeln kochen und zu Püree verarbeiten.",
            "Lauch fein schneiden und kurz anbraten. Mit dem Kartoffelpüree, Koriander und Gewürzen vermischen.",
            "Den Teig in 8 Teile teilen und jeweils dünn ausrollen.",
            "Die Füllung auf eine Hälfte geben, zuklappen und die Ränder fest andrücken.",
            "In einer Pfanne mit wenig Öl von beiden Seiten goldbraun braten.",
            "Heiß servieren mit Joghurt oder Chutney."
        ],
        "tips": "Bolani schmecken am besten frisch aus der Pfanne.",
        "tags": ["Vegetarisch", "Vorspeise", "Brot", "Street Food"],
        "created_at": new Date().toISOString(),
        "updated_at": new Date().toISOString()
    }
]);

// Blog Posts
db.blog_posts.insertOne({
    "id": "blog-001",
    "title": "Die Bedeutung von Nowruz in der afghanischen Kultur",
    "slug": "bedeutung-von-nowruz",
    "excerpt": "Nowruz, das persische Neujahr, ist eines der wichtigsten Feste in Afghanistan.",
    "content": "# Die Bedeutung von Nowruz in der afghanischen Kultur\n\nNowruz, wörtlich übersetzt „Neuer Tag", markiert den Beginn des Frühlings und des neuen Jahres nach dem persischen Kalender.\n\n## Traditionen und Bräuche\n\n### Haft Sin - Die sieben S\nZum Nowruz gehört das Aufstellen des „Haft Sin"-Tisches mit sieben symbolischen Gegenständen.\n\n## Traditionelle Nowruz-Speisen\n\nZu Nowruz werden besondere Gerichte zubereitet wie Haft Mewa, Samanak und Sabzi Palaw.",
    "image_url": "https://images.unsplash.com/photo-1709004157726-cb9df09bfce5?w=800",
    "category": "Kultur",
    "tags": ["Nowruz", "Tradition", "Feste", "Kultur"],
    "created_at": new Date().toISOString(),
    "updated_at": new Date().toISOString()
});

// Static Pages
db.pages.insertMany([
    {
        "id": "page-001",
        "slug": "afghanische-esskultur",
        "title": "Afghanische Esskultur",
        "meta_title": "Afghanische Esskultur - Tradition & Gastfreundschaft | AfghanFood.de",
        "meta_description": "Entdecken Sie die reiche afghanische Esskultur mit ihrer legendären Gastfreundschaft.",
        "content": "# Afghanische Esskultur\n\nDie afghanische Küche ist ein Spiegelbild der reichen Geschichte und kulturellen Vielfalt des Landes.\n\n## Mehman Nawazi - Die Kunst der Gastfreundschaft\n\nIn Afghanistan ist Gastfreundschaft mehr als eine Tugend - sie ist eine heilige Pflicht.",
        "updated_at": new Date().toISOString()
    },
    {
        "id": "page-002",
        "slug": "zutaten-gewuerze",
        "title": "Zutaten & Gewürze",
        "meta_title": "Afghanische Zutaten & Gewürze | AfghanFood.de",
        "meta_description": "Die wichtigsten Zutaten und Gewürze der afghanischen Küche.",
        "content": "# Zutaten & Gewürze der afghanischen Küche\n\nDie Magie der afghanischen Küche liegt in ihren aromatischen Gewürzen.\n\n## Safran (Zafaran)\nDas „rote Gold" ist eines der wertvollsten Gewürze der Welt.",
        "updated_at": new Date().toISOString()
    },
    {
        "id": "page-003",
        "slug": "kuechenhelfer",
        "title": "Küchenhelfer",
        "meta_title": "Afghanische Küchenhelfer & Werkzeuge | AfghanFood.de",
        "meta_description": "Die wichtigsten Küchenhelfer für die authentische afghanische Küche.",
        "content": "# Küchenhelfer für die afghanische Küche\n\n## Traditionelle Werkzeuge\n\n### Deg (Großer Kochtopf)\nEin großer, schwerer Topf mit Deckel, ideal für Reisgerichte.",
        "updated_at": new Date().toISOString()
    },
    {
        "id": "page-004",
        "slug": "ueber-uns",
        "title": "Über uns",
        "meta_title": "Über AfghanFood.de - Unsere Mission",
        "meta_description": "Erfahren Sie mehr über AfghanFood.de und unsere Mission.",
        "content": "# Über AfghanFood.de\n\n## Unsere Mission\n\nAfghanFood.de wurde gegründet, um die reiche kulinarische Tradition Afghanistans mit der Welt zu teilen.",
        "updated_at": new Date().toISOString()
    },
    {
        "id": "page-005",
        "slug": "impressum",
        "title": "Impressum",
        "meta_title": "Impressum | AfghanFood.de",
        "meta_description": "Impressum und rechtliche Informationen zu AfghanFood.de",
        "content": "# Impressum\n\n## Angaben gemäß § 5 TMG\n\nAfghanFood.de\nMusterstraße 123\n12345 Musterstadt\nDeutschland",
        "updated_at": new Date().toISOString()
    },
    {
        "id": "page-006",
        "slug": "datenschutz",
        "title": "Datenschutzerklärung",
        "meta_title": "Datenschutzerklärung | AfghanFood.de",
        "meta_description": "Datenschutzerklärung für AfghanFood.de",
        "content": "# Datenschutzerklärung\n\n## 1. Datenschutz auf einen Blick\n\nDie folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert.",
        "updated_at": new Date().toISOString()
    }
]);

print("✅ Seed-Daten erfolgreich importiert!");
