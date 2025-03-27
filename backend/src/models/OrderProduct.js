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
            WHERE op.order_id = $1`,
            [orderId]
        );
    },

    create: async (orderProduct) => {
        const result = await query(
            `INSERT INTO order_products (order_id, product_id, quantity, total_price) 
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [orderProduct.order_id, orderProduct.product_id, orderProduct.quantity, orderProduct.total_price]
        );
        return result.rows[0]; // Devuelve el ID insertado
    },

    update: async (id, orderProduct) => {
        return await query(
            `UPDATE order_products 
             SET product_id = $1, quantity = $2, total_price = $3 
             WHERE id = $4`,
            [orderProduct.product_id, orderProduct.quantity, orderProduct.total_price, id]
        );
    },

    delete: async (id) => {
        return await query('DELETE FROM order_products WHERE id = $1', [id]);
    }
};

module.exports = OrderProduct;