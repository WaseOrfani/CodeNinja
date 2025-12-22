-- ORIA FRESH - Produktdaten (Lieferando-optimiert)
-- Dieses Script nach schema.sql ausführen

USE oriafresh;

-- Kategorien aktualisieren
TRUNCATE TABLE categories;
INSERT INTO categories (name, slug, icon, sort_order) VALUES 
('Burger', 'burger', '🍔', 1),
('Menüs', 'menus', '🍟', 2),
('Beilagen', 'beilagen', '🍟', 3),
('Saucen', 'saucen', '🥫', 4),
('Getränke', 'getraenke', '🥤', 5);

-- =====================
-- BURGER
-- =====================
INSERT INTO products (name, slug, description, category_id, image, is_bestseller, is_active) VALUES
('Classic Smash Burger', 'classic-smash-burger', 'Saftiges Smash-Patty, geschmolzener Cheddar, karamellisierte Zwiebeln, Pickles und unsere Smash-Sauce.', 1, '/uploads/products/classic-smash.jpg', 1, 1),
('Cheese Smash Burger', 'cheese-smash-burger', 'Smash-Patty mit doppelt Cheddar, karamellisierte Zwiebeln und Smash-Sauce.', 1, '/uploads/products/cheese-smash.jpg', 1, 1),
('Double Smash Cheese Burger', 'double-smash-cheese-burger', 'Zwei saftige Smash-Patties, doppelt Cheddar, karamellisierte Zwiebeln und Smash-Sauce.', 1, '/uploads/products/double-smash.jpg', 1, 1),
('Chili Cheese Smash Burger', 'chili-cheese-smash-burger', 'Smash-Patty mit würziger Chili-Cheese-Sauce, Jalapeños und Cheddar.', 1, '/uploads/products/chili-cheese-smash.jpg', 0, 1),
('BBQ Smash Burger', 'bbq-smash-burger', 'Smash-Patty mit rauchiger BBQ-Sauce, Bacon, Cheddar und Röstzwiebeln.', 1, '/uploads/products/bbq-smash.jpg', 0, 1),
('Crispy Chicken Burger', 'crispy-chicken-burger', 'Knuspriges Chicken-Filet, frischer Salat, Tomaten und Garlic-Mayo.', 1, '/uploads/products/crispy-chicken.jpg', 1, 1),
('Veggie Burger', 'veggie-burger', 'Hausgemachtes Veggie-Patty, frisches Gemüse und vegane Mayo.', 1, '/uploads/products/veggie-burger.jpg', 0, 1);

-- Burger Varianten (Single)
INSERT INTO product_variants (product_id, name, price, includes) VALUES
((SELECT id FROM products WHERE slug = 'classic-smash-burger'), 'Single', 7.90, '1 Patty'),
((SELECT id FROM products WHERE slug = 'cheese-smash-burger'), 'Single', 8.50, '1 Patty'),
((SELECT id FROM products WHERE slug = 'double-smash-cheese-burger'), 'Single', 11.90, '2 Patties'),
((SELECT id FROM products WHERE slug = 'chili-cheese-smash-burger'), 'Single', 9.50, '1 Patty'),
((SELECT id FROM products WHERE slug = 'bbq-smash-burger'), 'Single', 9.90, '1 Patty'),
((SELECT id FROM products WHERE slug = 'crispy-chicken-burger'), 'Single', 8.90, '1 Filet'),
((SELECT id FROM products WHERE slug = 'veggie-burger'), 'Single', 8.50, '1 Patty');

-- =====================
-- MENÜS
-- =====================
INSERT INTO products (name, slug, description, category_id, image, is_featured, is_active) VALUES
('Classic Smash Menü', 'classic-smash-menu', 'Classic Smash Burger + Pommes + Getränk (0,33l)', 2, '/uploads/products/classic-smash-menu.jpg', 1, 1),
('Cheese Smash Menü', 'cheese-smash-menu', 'Cheese Smash Burger + Pommes + Getränk (0,33l)', 2, '/uploads/products/cheese-smash-menu.jpg', 1, 1),
('Double Smash Menü', 'double-smash-menu', 'Double Smash Cheese Burger + Pommes + Getränk (0,33l)', 2, '/uploads/products/double-smash-menu.jpg', 1, 1),
('Chili Cheese Smash Menü', 'chili-cheese-smash-menu', 'Chili Cheese Smash Burger + Pommes + Getränk (0,33l)', 2, '/uploads/products/chili-cheese-menu.jpg', 0, 1),
('BBQ Smash Menü', 'bbq-smash-menu', 'BBQ Smash Burger + Pommes + Getränk (0,33l)', 2, '/uploads/products/bbq-smash-menu.jpg', 0, 1),
('Crispy Chicken Menü', 'crispy-chicken-menu', 'Crispy Chicken Burger + Pommes + Getränk (0,33l)', 2, '/uploads/products/crispy-chicken-menu.jpg', 1, 1),
('Veggie Menü', 'veggie-menu', 'Veggie Burger + Pommes + Getränk (0,33l)', 2, '/uploads/products/veggie-menu.jpg', 0, 1);

-- Menü Preise
INSERT INTO product_variants (product_id, name, price, includes) VALUES
((SELECT id FROM products WHERE slug = 'classic-smash-menu'), 'Menü', 11.90, 'inkl. Pommes + Getränk'),
((SELECT id FROM products WHERE slug = 'cheese-smash-menu'), 'Menü', 12.50, 'inkl. Pommes + Getränk'),
((SELECT id FROM products WHERE slug = 'double-smash-menu'), 'Menü', 15.90, 'inkl. Pommes + Getränk'),
((SELECT id FROM products WHERE slug = 'chili-cheese-smash-menu'), 'Menü', 13.50, 'inkl. Pommes + Getränk'),
((SELECT id FROM products WHERE slug = 'bbq-smash-menu'), 'Menü', 13.90, 'inkl. Pommes + Getränk'),
((SELECT id FROM products WHERE slug = 'crispy-chicken-menu'), 'Menü', 12.90, 'inkl. Pommes + Getränk'),
((SELECT id FROM products WHERE slug = 'veggie-menu'), 'Menü', 12.50, 'inkl. Pommes + Getränk');

-- =====================
-- BEILAGEN
-- =====================
INSERT INTO products (name, slug, description, category_id, image, is_active) VALUES
('Pommes Frites', 'pommes-frites', 'Knusprige Pommes Frites, goldbraun gebacken.', 3, '/uploads/products/pommes.jpg', 1),
('Sweet Potato Fries', 'sweet-potato-fries', 'Süßkartoffel-Pommes, knusprig und leicht süß.', 3, '/uploads/products/sweet-potato-fries.jpg', 1),
('Loaded Fries Cheese', 'loaded-fries-cheese', 'Pommes mit geschmolzenem Cheddar überbacken.', 3, '/uploads/products/loaded-fries-cheese.jpg', 1),
('Loaded Fries Chili Cheese', 'loaded-fries-chili-cheese', 'Pommes mit Chili-Cheese-Sauce und Jalapeños.', 3, '/uploads/products/loaded-fries-chili.jpg', 1);

INSERT INTO product_variants (product_id, name, price, includes) VALUES
((SELECT id FROM products WHERE slug = 'pommes-frites'), 'Portion', 3.50, NULL),
((SELECT id FROM products WHERE slug = 'sweet-potato-fries'), 'Portion', 4.50, NULL),
((SELECT id FROM products WHERE slug = 'loaded-fries-cheese'), 'Portion', 5.90, NULL),
((SELECT id FROM products WHERE slug = 'loaded-fries-chili-cheese'), 'Portion', 6.90, NULL);

-- =====================
-- SAUCEN
-- =====================
INSERT INTO products (name, slug, description, category_id, image, is_vegan, is_active) VALUES
('Ketchup', 'ketchup', 'Klassischer Tomaten-Ketchup.', 4, '/uploads/products/ketchup.jpg', 1, 1),
('Mayonnaise', 'mayonnaise', 'Cremige Mayonnaise.', 4, '/uploads/products/mayo.jpg', 0, 1),
('Garlic Mayonnaise', 'garlic-mayo', 'Mayonnaise mit Knoblauch-Note.', 4, '/uploads/products/garlic-mayo.jpg', 0, 1),
('Chili Cheese Sauce', 'chili-cheese-sauce', 'Würzige Käsesauce mit Chili.', 4, '/uploads/products/chili-cheese-sauce.jpg', 0, 1),
('BBQ-Sauce', 'bbq-sauce', 'Rauchige BBQ-Sauce.', 4, '/uploads/products/bbq-sauce.jpg', 1, 1),
('Smash-Sauce', 'smash-sauce', 'Unsere hausgemachte Smash-Sauce.', 4, '/uploads/products/smash-sauce.jpg', 0, 1);

INSERT INTO product_variants (product_id, name, price, includes) VALUES
((SELECT id FROM products WHERE slug = 'ketchup'), 'Portion', 0.50, NULL),
((SELECT id FROM products WHERE slug = 'mayonnaise'), 'Portion', 0.50, NULL),
((SELECT id FROM products WHERE slug = 'garlic-mayo'), 'Portion', 0.50, NULL),
((SELECT id FROM products WHERE slug = 'chili-cheese-sauce'), 'Portion', 1.00, NULL),
((SELECT id FROM products WHERE slug = 'bbq-sauce'), 'Portion', 0.50, NULL),
((SELECT id FROM products WHERE slug = 'smash-sauce'), 'Portion', 0.50, NULL);

-- =====================
-- GETRÄNKE
-- =====================
INSERT INTO products (name, slug, description, category_id, image, is_active) VALUES
('Coca-Cola', 'coca-cola', 'Coca-Cola Classic. 0,33l.', 5, '/uploads/products/cola.jpg', 1),
('Coca-Cola Zero', 'coca-cola-zero', 'Coca-Cola Zero Sugar. 0,33l.', 5, '/uploads/products/cola-zero.jpg', 1),
('Fanta', 'fanta', 'Fanta Orange. 0,33l.', 5, '/uploads/products/fanta.jpg', 1),
('Sprite', 'sprite', 'Sprite. 0,33l.', 5, '/uploads/products/sprite.jpg', 1),
('Wasser still', 'wasser-still', 'Stilles Mineralwasser. 0,5l.', 5, '/uploads/products/wasser-still.jpg', 1),
('Wasser medium', 'wasser-medium', 'Mineralwasser medium. 0,5l.', 5, '/uploads/products/wasser-medium.jpg', 1),
('Ayran', 'ayran', 'Erfrischender Ayran. 0,25l.', 5, '/uploads/products/ayran.jpg', 1);

INSERT INTO product_variants (product_id, name, price, includes) VALUES
((SELECT id FROM products WHERE slug = 'coca-cola'), '0,33l', 2.50, NULL),
((SELECT id FROM products WHERE slug = 'coca-cola-zero'), '0,33l', 2.50, NULL),
((SELECT id FROM products WHERE slug = 'fanta'), '0,33l', 2.50, NULL),
((SELECT id FROM products WHERE slug = 'sprite'), '0,33l', 2.50, NULL),
((SELECT id FROM products WHERE slug = 'wasser-still'), '0,5l', 2.00, NULL),
((SELECT id FROM products WHERE slug = 'wasser-medium'), '0,5l', 2.00, NULL),
((SELECT id FROM products WHERE slug = 'ayran'), '0,25l', 2.00, NULL);

-- =====================
-- EXTRAS FÜR BURGER
-- =====================
INSERT INTO product_extras (product_id, name, price) 
SELECT p.id, 'Extra Patty', 2.50 FROM products p WHERE p.category_id = 1;

INSERT INTO product_extras (product_id, name, price) 
SELECT p.id, 'Extra Cheddar', 1.00 FROM products p WHERE p.category_id = 1;

INSERT INTO product_extras (product_id, name, price) 
SELECT p.id, 'Bacon', 1.50 FROM products p WHERE p.category_id = 1;

INSERT INTO product_extras (product_id, name, price) 
SELECT p.id, 'Jalapeños', 0.80 FROM products p WHERE p.category_id = 1;

-- Admin-Benutzer (Passwort: admin123)
-- Hash für 'admin123' mit password_hash('admin123', PASSWORD_BCRYPT)
UPDATE admins SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@oriafresh.de';
