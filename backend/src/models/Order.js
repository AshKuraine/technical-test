const db = require('../config/db');
const util = require('util');

const query = util.promisify(db.query).bind(db);

const Order = {
    getAllOrders: async () => {
        return await query('SELECT * FROM orders');
    },

    getOrderById: async (id) => {
        return await query('SELECT * FROM orders WHERE id = ?', [id]);
    },

    createOrder: async (orderData) => {
        const { order_num, order_date, num_products, final_price, products } = orderData;

        try {
            const result = await query(
                `INSERT INTO orders (order_num, order_date, num_products, final_price) 
                 VALUES (?, ?, ?, ?)`,
                [order_num, order_date, num_products, final_price]
            );

            const orderId = result.insertId;

            for (const product of products) {
                await query(
                    `INSERT INTO order_products (order_id, product_id, quantity, total_price) 
                     VALUES (?, ?, ?, ?)`,
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
            const existingOrder = await query(`SELECT id FROM orders WHERE id = ?`, [id]);
            if (existingOrder.length === 0) {
                throw new Error("Order not found");
            }
            await query(
                `UPDATE orders 
                 SET order_num = ?, order_date = ?, num_products = ?, final_price = ? 
                 WHERE id = ?`,
                [order_num, order_date, num_products, final_price, id]
            );
            await query(`DELETE FROM order_products WHERE order_id = ?`, [id]);
            for (const product of products) {
                await query(
                    `INSERT INTO order_products (order_id, product_id, quantity, total_price) 
                     VALUES (?, ?, ?, ?)`,
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
        return await query('DELETE FROM orders WHERE id = ?', [id]);
    },

    updateOrderStatus: async (id, status) => {
        return await query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    }    
};

module.exports = Order;