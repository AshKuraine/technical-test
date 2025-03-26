const db = require('../config/db');

const util = require('util');

const query = util.promisify(db.query).bind(db);

const Product = {
    getAll: async () => {
        return await query('SELECT * FROM products');
    },

    getById: async (id) => {
        return await query('SELECT * FROM products WHERE id = ?', [id]);
    },

    create: async (product) => {
        return await query('INSERT INTO products (name, unit_price) VALUES (?, ?)', 
            [product.name, product.unit_price]);
    },

    update: async (id, product) => {
        return await query('UPDATE products SET name = ?, unit_price = ? WHERE id = ?', 
            [product.name, product.unit_price, id]);
    },

    delete: async (id) => {
        return await query('DELETE FROM products WHERE id = ?', [id]);
    }
};

module.exports = Product;