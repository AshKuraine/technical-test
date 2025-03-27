require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: 'https://try-front.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type, Authorization'],
  };

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/orders', require('./routes/order'));
app.use('/api/orderProducts', require('./routes/orderProduct'));
app.use('/api/products', require('./routes/product'));

app.listen(PORT, () => {
    console.log(`Hello World from Express with CORS enabled!`);
});