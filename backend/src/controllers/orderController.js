const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
    try {
        const results = await Order.getAllOrders();
        return res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await Order.getOrderById(id);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const newOrder = req.body;
        const result = await Order.createOrder(newOrder);

        return res.status(200).json({ message: 'Order created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = req.body;

        await Order.updateOrder(id, updatedOrder);
        return res.status(200).json({ message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        await Order.deleteOrder(id);
        return res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        await Order.updateOrderStatus(id, status);
        return res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};