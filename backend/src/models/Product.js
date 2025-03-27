const db = require('../config/db');
const util = require('util');

const query = util.promisify(db.query).bind(db);

const Product = {
    getAll: async () => {
        return await query('SELECT * FROM products');
    },

    getById: async (id) => {
        return await query('SELECT * FROM products WHERE id = $1', [id]);
    },

    create: async (product) => {
        return await query('INSERT INTO products (name, unit_price) VALUES ($1, $2)', 
            [product.name, product.unit_price]);
    },

    update: async (id, product) => {
        return await query('UPDATE products SET name = $1, unit_price = $2 WHERE id = $3', 
            [product.name, product.unit_price, id]);
    },

    delete: async (id) => {
        return await query('DELETE FROM products WHERE id = $1', [id]);
    }
};

module.exports = Product;