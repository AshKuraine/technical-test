import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import OrderForm from "../components/OrderForm";
import "./pages.css";

const AddEditOrder = () => {
    const { id } = useParams();

    useEffect(() => {
        document.title = id ? "Edit Order" : "Add Order";
    }, [id]);

    return (
        <div className="root-container">
            <div className="information" style={{ display: 'inline-block' }}>
                <label style={{ display: 'inline-block', marginBottom: '30px', fontSize: '2em' }}>{ id ? "Edit Order" : "Add Order" }</label>
                <div style={{ marginBottom: '30px'}}>
                    <OrderForm />
                </div>
            </div>
        </div>
    );
};

export default AddEditOrder;