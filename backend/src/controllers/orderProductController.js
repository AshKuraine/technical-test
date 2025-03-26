const OrderProduct = require('../models/OrderProduct');

exports.getOrderProducts = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderProducts = await OrderProduct.getByOrderId(orderId);
        return res.status(200).json(orderProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createOrderProduct = async (req, res) => {
    try {
        const newOrderProduct = req.body;
        const result = await OrderProduct.create(newOrderProduct);
        return res.status(200).json({ message: 'Product added to order', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateOrderProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrderProduct = req.body;
        await OrderProduct.update(id, updatedOrderProduct);
        return res.status(200).json({ message: 'Product in the order updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOrderProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await OrderProduct.delete(id);
        return res.status(200).json({ message: 'Product removed from order' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};