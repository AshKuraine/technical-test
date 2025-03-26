import React, {useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderTable from "../components/OrderTable";
import "./pages.css";

const MyOrders = () => {

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "My Orders";
    }, []);

    return (
        <div className="root-container">
            <div className="information" style={{ display: 'inline-block' }}>
                <label style={{ display: 'inline-block', marginBottom: '30px', fontSize: '2em' }}>My Orders</label>
                <div style={{ marginBottom: '30px'}}><OrderTable /></div>
                <button 
                    onClick={() => navigate("/add-order")} 
                    style={{
                        padding: "10px 15px",
                        fontSize: "1em",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Add New Order
                </button>
            </div>
            
        </div>
    );
};

export default MyOrders;