const db = require('../config/db');

const util = require('util');

const query = util.promisify(db.query).bind(db);

const OrderProduct = {
    getByOrderId: async (orderId) => {
        return await query(
            `SELECT 
                op.product_id AS id, 
                p.name AS name, 
                p.unit_price, 
                op.quantity, 
                (p.unit_price * op.quantity) AS total_price
            FROM order_products op
            JOIN products p ON op.product_id = p.id
            WHERE op.order_id = ?`,
            [orderId]
        );
    },

    create: async (orderProduct) => {
        return await query('INSERT INTO order_products (order_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)', 
            [orderProduct.order_id, orderProduct.product_id, orderProduct.quantity, orderProduct.total_price]);
    },

    update: async (id, orderProduct) => {
        return await query('UPDATE order_products SET product_id = ?, quantity = ?, total_price = ? WHERE id = ?', 
            [orderProduct.product_id, orderProduct.quantity, orderProduct.total_price, id]);
    },

    delete: async (id) => {
        return await query('DELETE FROM order_products WHERE id = ?', [id]);
    }
};

module.exports = OrderProduct;