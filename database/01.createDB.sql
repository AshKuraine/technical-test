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
