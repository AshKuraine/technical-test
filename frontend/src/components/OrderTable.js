import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import ModalConfirmation from "./ModalConfirmation";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [editedStatuses, setEditedStatuses] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const getOrders = async () => {
        try {
            const response = await Axios.get(apiUrl + "/api/orders/");
            if (response.status === 200) {
                setOrders(response.data.rows);
            }
        } catch (error) {
            console.error("Error getting orders:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await Axios.delete(apiUrl+"/api/orders/"+id);
            if (response.status === 200) {
                setOrders(orders.filter(order => order.id !== id));
            }
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setEditedStatuses(prev => ({ ...prev, [id]: newStatus }));
    };

    const updateOrderStatus = async (id, newStatus) => {
        try {
            const response = await Axios.put(apiUrl+"/api/orders/"+id+"/status", { status: newStatus });
            if (response.status === 200) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === id ? { ...order, status: newStatus } : order
                    )
                );
                setEditedStatuses(prev => {
                    const updated = { ...prev };
                    delete updated[id];
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };    

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedOrder(null);
    };

    const handleConfirmDelete = () => {
        if (selectedOrder) {
            handleDelete(selectedOrder.id);
        }
        handleCloseModal();
    };

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Order #</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell># Products</TableCell>
                            <TableCell>Final Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.order_num}</TableCell>
                                <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                                <TableCell>{order.num_products}</TableCell>
                                <TableCell>${parseFloat(order.final_price).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Select
                                        value={editedStatuses[order.id] || order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        sx={{ minWidth: 120, backgroundColor: "white" }}
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="InProgress">InProgress</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </Select>
                                    {editedStatuses[order.id] && (
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            size="small"
                                            sx={{ marginLeft: 1 }}
                                            onClick={() => updateOrderStatus(order.id, editedStatuses[order.id])}
                                        >
                                            Guardar
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => navigate(`/add-order/${order.id}`)} 
                                        disabled={order.status === "Completed"}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={() => handleOpenModal(order)} 
                                        sx={{ marginLeft: 1 }} 
                                        disabled={order.status === "Completed"}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ModalConfirmation open={open} handleCloseModal={handleCloseModal} handleConfirmDelete={handleConfirmDelete} />
        </div>
    );
};

export default OrdersTable;