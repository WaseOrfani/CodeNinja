#!/usr/bin/env python3
"""
Seed-Skript für AfghanFood.de
Führt initiale Daten in die MongoDB ein
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import bcrypt
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'afghanfood')

# Admin User
ADMIN_USER = {
    "id": str(uuid.uuid4()),
    "email": "admin@afghanfood.de",
    "name": "Administrator",
    "role": "admin",
    "password_hash": bcrypt.hashpw("Admin123!".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
    "created_at": datetime.now(timezone.utc).isoformat()
}

# Rezepte mit echtem Inhalt
RECIPES = [
    {
        "id": str(uuid.uuid4()),
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
        "tips": "Das Geheimnis eines perfekten Qabuli Palaw liegt in der Qualität des Reises und der Geduld beim Dämpfen. Der Reis sollte locker und jedes Korn einzeln sein.",
        "tags": ["Traditionell", "Festessen", "Lamm", "Reis"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Mantu",
        "slug": "mantu",
        "description": "Afghanische Teigtaschen gefüllt mit gewürztem Hackfleisch, serviert mit Joghurt-Knoblauch-Sauce und Tomaten-Linsen-Sauce. Ein Fest für die Sinne.",
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
            {"name": "Schwarzer Pfeffer", "amount": "1/2 TL"},
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
            "Die Mantu auf einem Teller anrichten, erst mit Joghurt-, dann mit Tomaten-Sauce übergießen.",
            "Mit getrockneter Minze und Chili garnieren."
        ],
        "tips": "Die Mantu können auch eingefroren werden. Direkt aus dem Gefrierschrank dämpfen, die Garzeit verlängert sich um 10-15 Minuten.",
        "tags": ["Teigtaschen", "Hackfleisch", "Festessen"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Bolani",
        "slug": "bolani",
        "description": "Knusprige afghanische Fladenbrote gefüllt mit Kartoffeln und Lauch oder Kürbis. Perfekt als Vorspeise oder Beilage.",
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
        "tips": "Bolani schmecken am besten frisch aus der Pfanne. Sie können aber auch im Ofen bei 180°C aufgewärmt werden.",
        "tags": ["Vegetarisch", "Vorspeise", "Brot", "Street Food"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

# Blog Posts
BLOG_POSTS = [
    {
        "id": str(uuid.uuid4()),
        "title": "Die Bedeutung von Nowruz in der afghanischen Kultur",
        "slug": "bedeutung-von-nowruz",
        "excerpt": "Nowruz, das persische Neujahr, ist eines der wichtigsten Feste in Afghanistan. Erfahren Sie mehr über Traditionen, Speisen und Bräuche.",
        "content": """
# Die Bedeutung von Nowruz in der afghanischen Kultur

Nowruz, wörtlich übersetzt „Neuer Tag", markiert den Beginn des Frühlings und des neuen Jahres nach dem persischen Kalender. In Afghanistan ist dieses Fest tief in der Kultur verwurzelt und wird von Menschen aller Ethnien gefeiert.

## Traditionen und Bräuche

### Haft Sin - Die sieben S
Zum Nowruz gehört das Aufstellen des „Haft Sin"-Tisches mit sieben symbolischen Gegenständen, die alle mit dem Buchstaben „S" beginnen:

- **Sabzeh** (Weizengras) - Symbol für Wiedergeburt
- **Samanu** (Weizenpudding) - Symbol für Süße
- **Senjed** (Dörrfrüchte) - Symbol für Liebe
- **Sir** (Knoblauch) - Symbol für Gesundheit
- **Sib** (Apfel) - Symbol für Schönheit
- **Somaq** (Sumach) - Symbol für Sonnenaufgang
- **Serkeh** (Essig) - Symbol für Geduld

## Traditionelle Nowruz-Speisen

Zu Nowruz werden besondere Gerichte zubereitet:

1. **Haft Mewa** - Ein Kompott aus sieben verschiedenen Trockenfrüchten
2. **Samanak** - Ein süßer Weizenpudding, der tagelang gekocht wird
3. **Sabzi Palaw** - Reis mit frischen Kräutern

## Die Feierlichkeiten

Die Feierlichkeiten beginnen am 21. März und dauern 13 Tage. Familien besuchen sich gegenseitig, tauschen Geschenke aus und genießen gemeinsame Mahlzeiten. Am 13. Tag, bekannt als „Sizdah Bedar", verbringen die Menschen den Tag im Freien und werfen ihr Sabzeh in fließendes Wasser.

Nowruz ist mehr als nur ein Fest - es ist ein Ausdruck der afghanischen Identität und ein Symbol für Hoffnung und Erneuerung.
        """,
        "image_url": "https://images.unsplash.com/photo-1709004157726-cb9df09bfce5?w=800",
        "category": "Kultur",
        "tags": ["Nowruz", "Tradition", "Feste", "Kultur"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

# Statische Seiten
PAGES = [
    {
        "id": str(uuid.uuid4()),
        "slug": "afghanische-esskultur",
        "title": "Afghanische Esskultur",
        "meta_title": "Afghanische Esskultur - Tradition, Gastfreundschaft & Genuss | AfghanFood.de",
        "meta_description": "Entdecken Sie die reiche afghanische Esskultur mit ihrer legendären Gastfreundschaft, traditionellen Gerichten und kulinarischen Bräuchen.",
        "content": """
# Afghanische Esskultur

Die afghanische Küche ist ein Spiegelbild der reichen Geschichte und kulturellen Vielfalt des Landes. Gelegen an der historischen Seidenstraße, hat Afghanistan kulinarische Einflüsse aus Persien, Indien, Zentralasien und dem Mittleren Osten aufgenommen und zu einer einzigartigen Küche verschmolzen.

## Mehman Nawazi - Die Kunst der Gastfreundschaft

In Afghanistan ist Gastfreundschaft mehr als eine Tugend - sie ist eine heilige Pflicht. Gäste werden mit dem Besten bewirtet, was das Haus zu bieten hat. Diese Tradition, bekannt als „Mehman Nawazi", ist tief in der afghanischen Kultur verwurzelt.

## Die Mahlzeiten des Tages

### Frühstück (Nashta)
Das afghanische Frühstück ist herzhaft und nahrhaft. Typisch sind frisches Naan-Brot, Butter, Honig, Qaimaq (Rahm), gekochte Eier und grüner Tee.

### Mittagessen
Die Hauptmahlzeit des Tages, oft ein Reisgericht mit Fleisch, Gemüse und Brot.

### Abendessen
Leichter als das Mittagessen, oft Suppen oder übrig gebliebene Speisen vom Tag.

## Traditionelle Zutaten

Die afghanische Küche verwendet charakteristische Gewürze und Zutaten:
- Safran, Kardamom und Kreuzkümmel
- Frische Kräuter wie Koriander und Minze
- Trockenfrüchte und Nüsse
- Joghurt und Qaimaq
- Lamm- und Hühnerfleisch

## Gemeinsam Essen

In Afghanistan wird traditionell auf dem Boden um eine Dastarkhwan (Tischtuch) sitzend gegessen. Das Essen wird in gemeinsamen Schüsseln serviert, und es ist üblich, mit der rechten Hand zu essen.
        """,
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "zutaten-gewuerze",
        "title": "Zutaten & Gewürze",
        "meta_title": "Afghanische Zutaten & Gewürze | AfghanFood.de",
        "meta_description": "Die wichtigsten Zutaten und Gewürze der afghanischen Küche - von Safran über Kardamom bis zu traditionellen Kräutern.",
        "content": """
# Zutaten & Gewürze der afghanischen Küche

Die Magie der afghanischen Küche liegt in ihren aromatischen Gewürzen und hochwertigen Zutaten. Hier finden Sie einen Überblick über die wichtigsten Bestandteile.

## Gewürze

### Safran (Zafaran)
Das „rote Gold" ist eines der wertvollsten Gewürze der Welt. Afghanischer Safran gilt als einer der besten weltweit und verleiht Gerichten eine goldene Farbe und ein einzigartiges Aroma.

### Kardamom (Hel)
Sowohl grüner als auch schwarzer Kardamom werden verwendet. Er verleiht Reis- und Fleischgerichten sowie Tee ein unverwechselbares Aroma.

### Kreuzkümmel (Zira)
Ein Grundgewürz in vielen afghanischen Gerichten, besonders in Reis und Fleischspeisen.

### Koriander (Gashneez)
Sowohl die frischen Blätter als auch die gemahlenen Samen sind unverzichtbar in der afghanischen Küche.

## Kräuter

- **Minze** - Frisch und getrocknet, für Joghurt-Saucen und Tee
- **Dill** - Für Reis und Gemüsegerichte
- **Petersilie** - In Salaten und als Garnierung

## Grundzutaten

### Reis
Langkornreis, insbesondere Basmati, ist das Herzstück vieler afghanischer Gerichte. Die Qualität des Reises bestimmt oft die Qualität des gesamten Gerichts.

### Hülsenfrüchte
Linsen, Kichererbsen und verschiedene Bohnen sind wichtige Proteinquellen.

### Milchprodukte
Joghurt (Mast) und Qaimaq (geronnene Sahne) sind in vielen Gerichten und Saucen zu finden.
        """,
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "kuechenhelfer",
        "title": "Küchenhelfer",
        "meta_title": "Afghanische Küchenhelfer & Werkzeuge | AfghanFood.de",
        "meta_description": "Die wichtigsten Küchenhelfer und traditionellen Werkzeuge für die authentische afghanische Küche.",
        "content": """
# Küchenhelfer für die afghanische Küche

Um authentische afghanische Gerichte zuzubereiten, benötigen Sie einige spezielle Küchenhelfer. Hier stellen wir die wichtigsten vor.

## Traditionelle Werkzeuge

### Deg (Großer Kochtopf)
Ein großer, schwerer Topf mit Deckel, ideal für Reisgerichte und Eintöpfe. Die dicke Unterseite sorgt für gleichmäßige Hitzeverteilung.

### Tawa (Flache Pfanne)
Eine große, flache Pfanne zum Backen von Brot wie Bolani oder zum Braten von Fleisch.

### Mantoo-Dämpfer
Ein mehrstöckiger Dämpfeinsatz aus Metall, speziell für die Zubereitung von Mantu und anderen gedämpften Speisen.

### Mörser und Stößel
Unverzichtbar zum Mahlen frischer Gewürze und zur Herstellung von Pasten.

## Moderne Hilfsmittel

### Reiskocher
Ein guter Reiskocher kann die Zubereitung von Reis erheblich erleichtern und liefert konsistente Ergebnisse.

### Fleischwolf
Für die Herstellung von frischem Hackfleisch für Mantu, Kebab und andere Fleischgerichte.

### Standmixer
Nützlich für die Zubereitung von Saucen, Chutneys und Marinaden.

## Tipps zur Ausstattung

Für den Einstieg in die afghanische Küche empfehlen wir:
1. Einen großen, schweren Topf mit gut schließendem Deckel
2. Eine große Pfanne oder Tawa
3. Einen Dämpfeinsatz
4. Qualitativ hochwertige Messer
5. Diverse Schüsseln in verschiedenen Größen
        """,
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "ueber-uns",
        "title": "Über uns",
        "meta_title": "Über AfghanFood.de - Unsere Mission | AfghanFood.de",
        "meta_description": "Erfahren Sie mehr über AfghanFood.de und unsere Mission, die afghanische Küche und Kultur zu teilen.",
        "content": """
# Über AfghanFood.de

## Unsere Mission

AfghanFood.de wurde gegründet, um die reiche kulinarische Tradition Afghanistans mit der Welt zu teilen. Wir glauben, dass Essen mehr ist als nur Nahrung - es ist eine Brücke zwischen Kulturen, ein Ausdruck von Liebe und ein Fenster in die Seele eines Volkes.

## Was uns antreibt

Die afghanische Küche ist eine der am wenigsten bekannten, aber gleichzeitig eine der köstlichsten der Welt. Mit AfghanFood.de möchten wir:

- **Authentische Rezepte** bewahren und teilen
- **Kulturelles Wissen** über afghanische Esskultur vermitteln
- **Eine Gemeinschaft** von Food-Enthusiasten aufbauen
- **Brücken bauen** zwischen verschiedenen Kulturen durch die gemeinsame Liebe zum Essen

## Unsere Rezepte

Alle Rezepte auf AfghanFood.de wurden sorgfältig recherchiert und getestet. Wir arbeiten mit afghanischen Köchen und Familien zusammen, um sicherzustellen, dass unsere Rezepte authentisch und nachkochbar sind.

## Kontakt

Haben Sie Fragen, Anregungen oder möchten Sie Ihre eigenen Rezepte teilen? Wir freuen uns über Ihre Nachricht!

E-Mail: info@afghanfood.de

Folgen Sie uns auf unseren Social-Media-Kanälen für tägliche Inspiration und neue Rezepte.
        """,
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "impressum",
        "title": "Impressum",
        "meta_title": "Impressum | AfghanFood.de",
        "meta_description": "Impressum und rechtliche Informationen zu AfghanFood.de",
        "content": """
# Impressum

## Angaben gemäß § 5 TMG

AfghanFood.de
Musterstraße 123
12345 Musterstadt
Deutschland

## Kontakt

E-Mail: info@afghanfood.de
Telefon: +49 (0) 123 456789

## Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV

[Name des Verantwortlichen]
Musterstraße 123
12345 Musterstadt

## Haftungsausschluss

### Haftung für Inhalte

Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.

### Haftung für Links

Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.

## Urheberrecht

Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
        """,
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "datenschutz",
        "title": "Datenschutzerklärung",
        "meta_title": "Datenschutzerklärung | AfghanFood.de",
        "meta_description": "Datenschutzerklärung und Informationen zum Umgang mit Ihren Daten auf AfghanFood.de",
        "content": """
# Datenschutzerklärung

## 1. Datenschutz auf einen Blick

### Allgemeine Hinweise

Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.

### Datenerfassung auf dieser Website

**Wer ist verantwortlich für die Datenerfassung auf dieser Website?**

Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.

**Wie erfassen wir Ihre Daten?**

Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.

## 2. Allgemeine Hinweise und Pflichtinformationen

### Datenschutz

Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.

## 3. Datenerfassung auf dieser Website

### Cookies

Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an.

### Server-Log-Dateien

Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.

## 4. Ihre Rechte

Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.
        """,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🌱 Starte Seed-Prozess für AfghanFood.de...")
    
    # Clear existing data
    await db.users.delete_many({})
    await db.recipes.delete_many({})
    await db.blog_posts.delete_many({})
    await db.pages.delete_many({})
    
    # Insert admin user
    await db.users.insert_one(ADMIN_USER)
    print(f"✅ Admin-Benutzer erstellt: {ADMIN_USER['email']}")
    
    # Insert recipes
    for recipe in RECIPES:
        await db.recipes.insert_one(recipe)
        print(f"✅ Rezept erstellt: {recipe['title']}")
    
    # Insert blog posts
    for post in BLOG_POSTS:
        await db.blog_posts.insert_one(post)
        print(f"✅ Blog-Artikel erstellt: {post['title']}")
    
    # Insert pages
    for page in PAGES:
        await db.pages.insert_one(page)
        print(f"✅ Seite erstellt: {page['title']}")
    
    print("\n🎉 Seed-Prozess erfolgreich abgeschlossen!")
    print(f"\n📋 Zusammenfassung:")
    print(f"   - 1 Admin-Benutzer")
    print(f"   - {len(RECIPES)} Rezepte")
    print(f"   - {len(BLOG_POSTS)} Blog-Artikel")
    print(f"   - {len(PAGES)} Seiten")
    print(f"\n🔑 Admin-Login:")
    print(f"   E-Mail: admin@afghanfood.de")
    print(f"   Passwort: Admin123!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
