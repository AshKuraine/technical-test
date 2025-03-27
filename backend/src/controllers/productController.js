const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        console.log(products);
        return res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const products = await Product.getById(id);
        if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json(products[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        const result = await Product.create(newProduct);
        return res.status(200).json({ message: 'Product created', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = req.body;
        await Product.update(id, updatedProduct);
        return res.status(200).json({ message: 'Updated product' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.delete(id);
        return res.status(200).json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};