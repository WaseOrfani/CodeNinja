-- 002_seed_menu.sql
-- ORIA FRESH - Produktdaten (Lieferando-optimiert)

USE oriafresh;

START TRANSACTION;

-- Kategorien
INSERT INTO categories (slug, name, sort_order) VALUES
('burger',   'Burger',   10),
('menus',    'Menüs',    20),
('sides',    'Beilagen', 30),
('sauces',   'Saucen',   40),
('drinks',   'Getränke', 50)
ON DUPLICATE KEY UPDATE name=VALUES(name), sort_order=VALUES(sort_order);

-- Produkte: Burger
INSERT INTO products (category_id, slug, name, description, price_cents, image_path, patties, is_menu, sort_order)
VALUES
((SELECT id FROM categories WHERE slug='burger'), 'classic-smash-burger', 'Classic Smash Burger',
 'Smash-Patty, Salat, Zwiebeln, Gurken, Smash-Sauce', 890, 'classic-smash-burger.jpg', 1, 0, 10),

((SELECT id FROM categories WHERE slug='burger'), 'cheese-smash-burger', 'Cheese Smash Burger',
 'Smash-Patty, 2x Cheddar, karamellisierte Zwiebeln, Smash-Sauce', 990, 'cheese-smash-burger.jpg', 1, 0, 20),

((SELECT id FROM categories WHERE slug='burger'), 'double-smash-cheese-burger', 'Double Smash Cheese Burger',
 '2 Smash-Patties, 2x Cheddar, karamellisierte Zwiebeln, Smash-Sauce', 1290, 'double-smash-cheese-burger.jpg', 2, 0, 30),

((SELECT id FROM categories WHERE slug='burger'), 'chili-cheese-smash-burger', 'Chili Cheese Smash Burger',
 'Smash-Patty, Cheddar, Chili-Cheese-Sauce, Jalapeños', 1090, 'chili-cheese-smash-burger.jpg', 1, 0, 40),

((SELECT id FROM categories WHERE slug='burger'), 'bbq-smash-burger', 'BBQ Smash Burger',
 'Smash-Patty, Bacon, Cheddar, BBQ-Sauce, Röstzwiebeln', 1190, 'bbq-smash-burger.jpg', 1, 0, 50),

((SELECT id FROM categories WHERE slug='burger'), 'crispy-chicken-burger', 'Crispy Chicken Burger',
 'Knuspriges Hähnchenfilet, Salat, Tomaten, Garlic-Mayo', 1090, 'crispy-chicken-burger.jpg', 1, 0, 60),

((SELECT id FROM categories WHERE slug='burger'), 'veggie-burger', 'Veggie Burger',
 'Veggie-Patty, Cheddar, Salat, Tomaten, Smash-Sauce', 990, 'veggie-burger.jpg', 1, 0, 70)
ON DUPLICATE KEY UPDATE
name=VALUES(name), description=VALUES(description), price_cents=VALUES(price_cents),
image_path=VALUES(image_path), patties=VALUES(patties), sort_order=VALUES(sort_order);

-- Produkte: Beilagen
INSERT INTO products (category_id, slug, name, description, price_cents, image_path, is_menu, sort_order)
VALUES
((SELECT id FROM categories WHERE slug='sides'), 'pommes', 'Pommes Frites', 'Goldbraun frittierte Pommes', 350, 'pommes.jpg', 0, 10),
((SELECT id FROM categories WHERE slug='sides'), 'sweet-potato-fries', 'Sweet Potato Fries', 'Knusprige Süßkartoffel-Pommes', 450, 'sweet-potato-fries.jpg', 0, 20),
((SELECT id FROM categories WHERE slug='sides'), 'loaded-fries-cheese', 'Loaded Fries Cheese', 'Pommes mit cremiger Käsesauce', 590, 'loaded-fries-cheese.jpg', 0, 30),
((SELECT id FROM categories WHERE slug='sides'), 'loaded-fries-chili-cheese', 'Loaded Fries Chili Cheese', 'Pommes mit Chili-Cheese-Sauce', 590, 'loaded-fries-chili-cheese.jpg', 0, 40)
ON DUPLICATE KEY UPDATE
name=VALUES(name), description=VALUES(description), price_cents=VALUES(price_cents), image_path=VALUES(image_path), sort_order=VALUES(sort_order);

-- Produkte: Saucen
INSERT INTO products (category_id, slug, name, description, price_cents, image_path, is_menu, sort_order)
VALUES
((SELECT id FROM categories WHERE slug='sauces'), 'ketchup', 'Ketchup', 'Klassischer Ketchup', 60, 'ketchup.jpg', 0, 10),
((SELECT id FROM categories WHERE slug='sauces'), 'mayonnaise', 'Mayonnaise', 'Cremige Mayonnaise', 60, 'mayonnaise.jpg', 0, 20),
((SELECT id FROM categories WHERE slug='sauces'), 'garlic-mayonnaise', 'Garlic Mayonnaise', 'Knoblauch-Mayonnaise', 200, 'garlic-mayo.jpg', 0, 30),
((SELECT id FROM categories WHERE slug='sauces'), 'chili-cheese-sauce', 'Chili Cheese Sauce', 'Würzige Chili-Cheese-Sauce', 200, 'chili-cheese-sauce.jpg', 0, 40),
((SELECT id FROM categories WHERE slug='sauces'), 'bbq-sauce', 'BBQ-Sauce', 'Rauchige BBQ-Sauce', 200, 'bbq-sauce.jpg', 0, 50),
((SELECT id FROM categories WHERE slug='sauces'), 'smash-sauce', 'Smash-Sauce', 'Hausgemachte Smash-Sauce', 200, 'smash-sauce.jpg', 0, 60)
ON DUPLICATE KEY UPDATE
name=VALUES(name), description=VALUES(description), price_cents=VALUES(price_cents), image_path=VALUES(image_path), sort_order=VALUES(sort_order);

-- Produkte: Getränke
INSERT INTO products (category_id, slug, name, description, price_cents, image_path, is_menu, sort_order)
VALUES
((SELECT id FROM categories WHERE slug='drinks'), 'cola-033', 'Cola 0,33 l', NULL, 250, NULL, 0, 10),
((SELECT id FROM categories WHERE slug='drinks'), 'cola-zero-033', 'Cola Zero 0,33 l', NULL, 250, NULL, 0, 20),
((SELECT id FROM categories WHERE slug='drinks'), 'fanta-033', 'Fanta 0,33 l', NULL, 250, NULL, 0, 30),
((SELECT id FROM categories WHERE slug='drinks'), 'sprite-033', 'Sprite 0,33 l', NULL, 250, NULL, 0, 40),
((SELECT id FROM categories WHERE slug='drinks'), 'wasser-still-05', 'Wasser still 0,5 l', NULL, 200, NULL, 0, 50),
((SELECT id FROM categories WHERE slug='drinks'), 'wasser-medium-05', 'Wasser medium 0,5 l', NULL, 200, NULL, 0, 60),
((SELECT id FROM categories WHERE slug='drinks'), 'ayran', 'Ayran', NULL, 200, NULL, 0, 70)
ON DUPLICATE KEY UPDATE
name=VALUES(name), price_cents=VALUES(price_cents), sort_order=VALUES(sort_order);

-- Produkte: Menüs (is_menu=1)
INSERT INTO products (category_id, slug, name, description, price_cents, is_menu, sort_order)
VALUES
((SELECT id FROM categories WHERE slug='menus'), 'classic-smash-menu', 'Classic Smash Menü', 'Burger + Pommes + Getränk', 1290, 1, 10),
((SELECT id FROM categories WHERE slug='menus'), 'cheese-smash-menu', 'Cheese Smash Menü', 'Burger + Pommes + Getränk', 1390, 1, 20),
((SELECT id FROM categories WHERE slug='menus'), 'chili-cheese-smash-menu', 'Chili Cheese Smash Menü', 'Burger + Pommes + Getränk', 1490, 1, 30),
((SELECT id FROM categories WHERE slug='menus'), 'bbq-smash-menu', 'BBQ Smash Menü', 'Burger + Pommes + Getränk', 1590, 1, 40),
((SELECT id FROM categories WHERE slug='menus'), 'double-smash-menu', 'Double Smash Menü', 'Burger + Pommes + Getränk', 1690, 1, 50),
((SELECT id FROM categories WHERE slug='menus'), 'crispy-chicken-menu', 'Crispy Chicken Menü', 'Burger + Pommes + Getränk', 1490, 1, 60),
((SELECT id FROM categories WHERE slug='menus'), 'veggie-menu', 'Veggie Menü', 'Burger + Pommes + Getränk', 1390, 1, 70)
ON DUPLICATE KEY UPDATE
name=VALUES(name), description=VALUES(description), price_cents=VALUES(price_cents), is_menu=VALUES(is_menu), sort_order=VALUES(sort_order);

-- Extras
INSERT INTO extras (slug, name, price_cents, sort_order) VALUES
('extra-patty',  'Extra Patty', 300, 10),
('extra-cheddar','Extra Cheddar',100, 20),
('bacon',        'Bacon',        150, 30),
('jalapenos',    'Jalapeños',    100, 40),
('sauce-extra',  'Sauce extra',  200, 50)
ON DUPLICATE KEY UPDATE name=VALUES(name), price_cents=VALUES(price_cents), sort_order=VALUES(sort_order);

-- Extras -> Burger erlauben
INSERT INTO product_extras (product_id, extra_id)
SELECT p.id, e.id
FROM products p
JOIN extras e
WHERE p.slug IN (
  'classic-smash-burger','cheese-smash-burger','double-smash-cheese-burger',
  'chili-cheese-smash-burger','bbq-smash-burger','crispy-chicken-burger','veggie-burger'
)
AND e.slug IN ('extra-patty','extra-cheddar','bacon','jalapenos','sauce-extra')
ON DUPLICATE KEY UPDATE product_id=product_id;

COMMIT;
