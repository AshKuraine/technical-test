import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Axios from "axios";
import ProductModal from "./ProductModal";

const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const generateOrderNumber = () => {
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0].replace(/-/g, "");
        const time = now.toTimeString().split(" ")[0].replace(/:/g, "");
        return `ORD-${formattedDate}${time}`;
    };

    const [order, setOrder] = useState({
        order_num: generateOrderNumber(),
        order_date: new Date().toISOString().split("T")[0],
        num_products: 0,
        final_price: "0.00",
        products: [],
    });

    const [products, setProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const getProducts = async () => {
        try {
            const response = await Axios.get(apiUrl + "/api/products/");
            if (response.status === 200) {
                setProducts(response.data.rows);
            }
        } catch (error) {
            console.error("Error getting products:", error);
        }
    };

    const getOrder = async () => {
        try {
            const response = await Axios.get(apiUrl + "/api/orders/" + id);
            if (response.status === 200) {
                const data = response.data;
                console.log(response.data);
                getOrderProducts(data.id);
                setOrder({
                    ...data,
                    order_date: data.order_date.split("T")[0],
                    num_products: 0,
                    final_price: "0.00",
                    products: [],
                });
            }
        } catch (error) {
            console.error("Error getting order:", error);
        }
    };

    const getOrderProducts = async (orderId) => {
        try {
            const response = await Axios.get(apiUrl + "/api/orderProducts/" + orderId);
            if (response.status === 200) {
                const updatedProducts = response.data.rows.map((p) => ({
                    ...p,
                    total_price: parseFloat(p.total_price).toFixed(2),
                }));
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    products: updatedProducts,
                    num_products: updatedProducts.length,
                    final_price: updatedProducts.reduce((sum, p) => sum + parseFloat(p.total_price), 0).toFixed(2),
                }));
            }
        } catch (error) {
            console.error("Error getting order products:", error);
        }
    };

    const handleAddProduct = (newProduct) => {
        setOrder((prevOrder) => {
            const existingProductIndex = prevOrder.products.findIndex(p => p.id === newProduct.id);
    
            let updatedProducts;
            if (existingProductIndex !== -1) {
                updatedProducts = [...prevOrder.products];
                updatedProducts[existingProductIndex].quantity += newProduct.quantity;
                updatedProducts[existingProductIndex].total_price = 
                    (updatedProducts[existingProductIndex].unit_price * updatedProducts[existingProductIndex].quantity).toFixed(2);
            } else {
                newProduct.total_price = (newProduct.unit_price * newProduct.quantity).toFixed(2);
                updatedProducts = [...prevOrder.products, newProduct];
            }
    
            return {
                ...prevOrder,
                products: updatedProducts,
                num_products: updatedProducts.length,
                final_price: updatedProducts.reduce((sum, p) => sum + parseFloat(p.total_price), 0).toFixed(2),
            };
        });
    };    

    const handleRemoveProduct = (index) => {
        const updatedProducts = order.products.filter((_, i) => i !== index);
        updateOrderData(updatedProducts);
    };

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedProducts = [...order.products];
        updatedProducts[index].quantity = newQuantity;
        updatedProducts[index].total_price = (updatedProducts[index].unit_price * newQuantity).toFixed(2);

        updateOrderData(updatedProducts);
    };

    const updateOrderData = (updatedProducts) => {
        setOrder({
            ...order,
            products: updatedProducts,
            num_products: updatedProducts.length,
            final_price: updatedProducts.reduce((sum, p) => sum + parseFloat(p.total_price), 0).toFixed(2),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await Axios.put(apiUrl+"/api/orders/"+id, order);
            } else {
                await Axios.post(apiUrl+"/api/orders", order);
            }
            navigate("/my-orders");
        } catch (error) {
            console.error("Error saving order:", error);
        }
    };

    useEffect(() => {
        getProducts();
        if (id) getOrder();
    }, [id]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <TextField label="Order #" value={order.order_num} fullWidth margin="normal" disabled />
                <TextField label="Date" value={order.order_date} fullWidth margin="normal" disabled />
                <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ marginTop: 2 }}>
                    Add Product
                </Button>
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Unit Price</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell>Options</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.products.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>${parseFloat(product.unit_price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                            inputProps={{ min: 1 }}
                                            sx={{ width: "80px" }}
                                        />
                                    </TableCell>
                                    <TableCell>${parseFloat(product.total_price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" onClick={() => handleRemoveProduct(index)}>
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TextField label="# Products" value={order.num_products} fullWidth margin="normal" disabled />
                <TextField label="Final Price" value={`$${order.final_price}`} fullWidth margin="normal" disabled />
                <Button type="submit" variant="contained" color="success" sx={{ marginTop: 2 }} disabled={order.num_products === 0 || order.final_price === "0.00"}>
                    {id ? "Update Order" : "Create Order"}
                </Button>
            </form>
            <ProductModal open={openModal} onClose={() => setOpenModal(false)} products={products} onAddProduct={handleAddProduct} />
        </div>
    );
};

export default OrderForm;