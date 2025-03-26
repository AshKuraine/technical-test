require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/orders', require('./routes/order'));
app.use('/api/orderProducts', require('./routes/orderProduct'));
app.use('/api/products', require('./routes/product'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});