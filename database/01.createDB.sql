show databases;

DROP DATABASE IF EXISTS order_db;

CREATE DATABASE IF NOT EXISTS order_db;

USE order_db;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_num VARCHAR(20) UNIQUE NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    num_products INT DEFAULT 0,
    final_price DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('Pending', 'InProgress', 'Completed') DEFAULT 'Pending'
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE order_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

SHOW TABLES;

DESCRIBE orders;

DESCRIBE products;

DESCRIBE order_products;

CREATE TRIGGER before_insert_order_product
BEFORE INSERT ON order_products
FOR EACH ROW
BEGIN
    DECLARE unit_price DECIMAL(10,2);
    DECLARE order_status ENUM('Pending', 'InProgress', 'Completed');
    SELECT p.unit_price INTO unit_price FROM products p WHERE p.id = NEW.product_id;
    SELECT o.status INTO order_status FROM orders o WHERE o.id = NEW.order_id;
    IF order_status = 'Completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A completed order cannot be modified.';
    END IF;
    SET NEW.total_price = unit_price * NEW.quantity;
END;

CREATE TRIGGER before_update_order_product
BEFORE UPDATE ON order_products
FOR EACH ROW
BEGIN
    DECLARE unit_price DECIMAL(10,2);
    DECLARE order_status ENUM('Pending', 'InProgress', 'Completed');
    SELECT p.unit_price INTO unit_price FROM products p WHERE p.id = NEW.product_id;
    SELECT o.status INTO order_status FROM orders o WHERE o.id = NEW.order_id;
    IF order_status = 'Completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A completed order cannot be modified.';
    END IF;
    SET NEW.total_price = unit_price * NEW.quantity;
END;

CREATE TRIGGER after_insert_order_product
AFTER INSERT ON order_products
FOR EACH ROW
BEGIN
    DECLARE order_status ENUM('Pending', 'InProgress', 'Completed');
    SELECT status INTO order_status FROM orders WHERE id = NEW.order_id;
    IF order_status = 'Completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A completed order cannot be modified.';
    END IF;
    UPDATE orders
    SET final_price = (SELECT IFNULL(SUM(total_price), 0) FROM order_products WHERE order_id = NEW.order_id)
    WHERE id = NEW.order_id;
END;

CREATE TRIGGER after_update_order_product
AFTER UPDATE ON order_products
FOR EACH ROW
BEGIN
    DECLARE order_status ENUM('Pending', 'InProgress', 'Completed');
    SELECT status INTO order_status FROM orders WHERE id = NEW.order_id;
    IF order_status = 'Completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A completed order cannot be modified.';
    END IF;
    UPDATE orders
    SET final_price = (SELECT IFNULL(SUM(total_price), 0) FROM order_products WHERE order_id = NEW.order_id)
    WHERE id = NEW.order_id;
END;

CREATE TRIGGER after_delete_order_product
AFTER DELETE ON order_products
FOR EACH ROW
BEGIN
    DECLARE order_status ENUM('Pending', 'InProgress', 'Completed');
    SELECT status INTO order_status FROM orders WHERE id = OLD.order_id;
    IF order_status = 'Completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A completed order cannot be modified.';
    END IF;
    UPDATE orders
    SET final_price = (SELECT IFNULL(SUM(total_price), 0) FROM order_products WHERE order_id = OLD.order_id)
    WHERE id = OLD.order_id;
END;