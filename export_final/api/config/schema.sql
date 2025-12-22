-- ORIA FRESH - MySQL Datenbankschema
-- Erstellt für Self-Hosting

CREATE DATABASE IF NOT EXISTS oriafresh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oriafresh;

-- Kategorien
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(10) DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Produkte
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    image VARCHAR(500),
    allergens VARCHAR(500),
    is_vegan TINYINT(1) DEFAULT 0,
    is_spicy TINYINT(1) DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0,
    is_bestseller TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Produkt-Varianten (Single, Menü, etc.)
CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    includes VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Produkt-Extras (Zusatzoptionen)
CREATE TABLE IF NOT EXISTS product_extras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bestellungen
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    pickup_time VARCHAR(50),
    notes TEXT,
    payment_method VARCHAR(50) DEFAULT 'pickup',
    subtotal DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    source VARCHAR(20) DEFAULT 'web',
    qr_bonus_applied TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Bestellpositionen
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(100),
    variant_price DECIMAL(10,2),
    quantity INT DEFAULT 1,
    extras TEXT,
    item_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Admin-Benutzer
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    is_active TINYINT(1) DEFAULT 1,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Einstellungen
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Kontaktformular-Einreichungen
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Standard Admin-Benutzer (Passwort: admin123)
INSERT INTO admins (email, password_hash, name) VALUES 
('admin@oriafresh.de', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator')
ON DUPLICATE KEY UPDATE email=email;

-- Standard-Einstellungen
INSERT INTO settings (setting_key, setting_value) VALUES 
('restaurant_name', 'ORIA FRESH'),
('address', 'Kirchenplatz 9, 18119 Rostock-Warnemünde'),
('phone', '+49 381 7704 – 0'),
('email', 'info@oriafresh.de'),
('qr_bonus_enabled', '1'),
('qr_bonus_name', 'Golden Cheese Dip'),
('qr_bonus_value', '3.90')
ON DUPLICATE KEY UPDATE setting_key=setting_key;

-- Standard-Kategorien
INSERT INTO categories (name, slug, icon, sort_order) VALUES 
('Burger', 'burger', '🍔', 1),
('Bowls', 'bowls', '🥗', 2),
('Salate', 'salate', '🥬', 3),
('Saucen & Dips', 'saucen-dips', '🥫', 4),
('Getränke – Kalt', 'getraenke-kalt', '🥤', 5),
('Kaffee & Tee', 'kaffee-tee', '☕', 6),
('Alkoholische Getränke', 'alkohol', '🍺', 7)
ON DUPLICATE KEY UPDATE name=name;