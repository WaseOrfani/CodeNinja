-- 001_schema.sql
-- ORIA FRESH - MySQL Schema (Lieferando-optimiert)
-- MySQL 8+, InnoDB, utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS oriafresh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oriafresh;

CREATE TABLE IF NOT EXISTS categories (
  id           BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug         VARCHAR(64)  NOT NULL UNIQUE,
  name         VARCHAR(128) NOT NULL,
  sort_order   INT NOT NULL DEFAULT 0,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  category_id   BIGINT UNSIGNED NOT NULL,
  sku           VARCHAR(64) NULL UNIQUE,
  slug          VARCHAR(128) NOT NULL UNIQUE,
  name          VARCHAR(160) NOT NULL,
  description   TEXT NULL,
  price_cents   INT NOT NULL,
  image_path    VARCHAR(255) NULL,
  patties       TINYINT UNSIGNED NULL,     -- nur für Burger (Single=1, Double=2)
  is_menu       TINYINT(1) NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Menü-Bundles: Ein Menü ist ein product mit is_menu=1.
CREATE TABLE IF NOT EXISTS menu_items (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  menu_id       BIGINT UNSIGNED NOT NULL,
  item_id       BIGINT UNSIGNED NOT NULL,
  quantity      INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_menu_items_menu
    FOREIGN KEY (menu_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_menu_items_item
    FOREIGN KEY (item_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_menu_item (menu_id, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Extras (Checkboxen): Extra Patty, Cheddar, Bacon, Jalapeños, Sauce extra
CREATE TABLE IF NOT EXISTS extras (
  id           BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug         VARCHAR(64) NOT NULL UNIQUE,
  name         VARCHAR(128) NOT NULL,
  price_cents  INT NOT NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Welche Extras sind für welches Produkt erlaubt
CREATE TABLE IF NOT EXISTS product_extras (
  product_id   BIGINT UNSIGNED NOT NULL,
  extra_id     BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, extra_id),
  CONSTRAINT fk_product_extras_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_product_extras_extra
    FOREIGN KEY (extra_id) REFERENCES extras(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_number    VARCHAR(32) NOT NULL UNIQUE,
  status          VARCHAR(32) NOT NULL DEFAULT 'NEW',
  customer_name   VARCHAR(160) NULL,
  customer_phone  VARCHAR(64)  NULL,
  customer_email  VARCHAR(160) NULL,
  delivery_type   VARCHAR(16) NOT NULL DEFAULT 'PICKUP',
  address_line1   VARCHAR(255) NULL,
  address_city    VARCHAR(120) NULL,
  address_zip     VARCHAR(16)  NULL,
  notes           TEXT NULL,
  subtotal_cents  INT NOT NULL DEFAULT 0,
  fees_cents      INT NOT NULL DEFAULT 0,
  total_cents     INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_id      BIGINT UNSIGNED NOT NULL,
  product_id    BIGINT UNSIGNED NOT NULL,
  name_snapshot VARCHAR(160) NOT NULL,
  unit_cents    INT NOT NULL,
  quantity      INT NOT NULL DEFAULT 1,
  notes         VARCHAR(255) NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_item_extras (
  id             BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_item_id  BIGINT UNSIGNED NOT NULL,
  extra_id       BIGINT UNSIGNED NOT NULL,
  name_snapshot  VARCHAR(128) NOT NULL,
  unit_cents     INT NOT NULL,
  quantity       INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_oie_item
    FOREIGN KEY (order_item_id) REFERENCES order_items(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_oie_extra
    FOREIGN KEY (extra_id) REFERENCES extras(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin Benutzer
CREATE TABLE IF NOT EXISTS admins (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email         VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  last_login    TIMESTAMP NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Kontaktformular
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(160) NOT NULL,
  email       VARCHAR(160) NOT NULL,
  phone       VARCHAR(64) NULL,
  message     TEXT NOT NULL,
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Einstellungen
CREATE TABLE IF NOT EXISTS settings (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  setting_key   VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NULL,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Standard Admin (Passwort: admin123)
INSERT INTO admins (email, password_hash, name) VALUES 
('admin@oriafresh.de', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator')
ON DUPLICATE KEY UPDATE email=email;

-- Standard Einstellungen
INSERT INTO settings (setting_key, setting_value) VALUES 
('restaurant_name', 'ORIA FRESH'),
('address', 'Kirchenplatz 9, 18119 Rostock-Warnemünde'),
('phone', '+49 381 7704 - 0'),
('email', 'info@oriafresh.de')
ON DUPLICATE KEY UPDATE setting_key=setting_key;

SET FOREIGN_KEY_CHECKS = 1;
