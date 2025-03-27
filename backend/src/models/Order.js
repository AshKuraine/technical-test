const db = require('../config/db');
const util = require('util');

const query = util.promisify(db.query).bind(db);

const Order = {
    getAllOrders: async () => {
        return await query('SELECT * FROM orders');
    },

    getOrderById: async (id) => {
        return await query('SELECT * FROM orders WHERE id = $1', [id]);
    },

    createOrder: async (orderData) => {
        const { order_num, order_date, num_products, final_price, products } = orderData;

        try {
            const result = await query(
                `INSERT INTO orders (order_num, order_date, num_products, final_price) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                [order_num, order_date, num_products, final_price]
            );

            const orderId = result.rows[0].id;

            for (const product of products) {
                await query(
                    `INSERT INTO order_products (order_id, product_id, quantity, total_price) 
                     VALUES ($1, $2, $3, $4)`,
                    [orderId, product.id, product.quantity, product.total_price]
                );
            }

            return { orderId };
        } catch (error) {
            throw error;
        }
    },

    updateOrder: async (id, updatedOrder) => {
        const { order_num, order_date, num_products, final_price, products } = updatedOrder;
    
        try {
            const existingOrder = await query(`SELECT id FROM orders WHERE id = $1`, [id]);
            if (existingOrder.rows.length === 0) {
                throw new Error("Order not found");
            }

            await query(
                `UPDATE orders 
                 SET order_num = $1, order_date = $2, num_products = $3, final_price = $4 
                 WHERE id = $5`,
                [order_num, order_date, num_products, final_price, id]
            );

            await query(`DELETE FROM order_products WHERE order_id = $1`, [id]);

            for (const product of products) {
                await query(
                    `INSERT INTO order_products (order_id, product_id, quantity, total_price) 
                     VALUES ($1, $2, $3, $4)`,
                    [id, product.id ?? product.product_id, product.quantity, product.total_price]
                );
            }

            return { message: "Order updated successfully" };
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    },

    deleteOrder: async (id) => {
        return await query('DELETE FROM orders WHERE id = $1', [id]);
    },

    updateOrderStatus: async (id, status) => {
        return await query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
    }    
};

module.exports = Order;