import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyOrders from './pages/MyOrders';
import AddEditOrder from './pages/AddEditOrder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyOrders />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/add-order/:id?" element={<AddEditOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
