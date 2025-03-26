import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";

const ProductModal = ({ open, onClose, products, onAddProduct }) => {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleAddProduct = () => {
        if (!selectedProduct || quantity < 1) return;
        const product = products.find((p) => p.id === selectedProduct);
        if (!product) return;

        onAddProduct({ ...product, quantity, total_price: product.unit_price * quantity });

        setSelectedProduct("");
        setQuantity(1);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Product</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Product</InputLabel>
                    <Select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                        {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                                {product.name} - ${parseFloat(product.unit_price).toFixed(2)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleAddProduct} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductModal;