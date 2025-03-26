const express = require('express');
const router = express.Router();
const orderProductController = require('../controllers/orderProductController');

router.get('/:orderId', orderProductController.getOrderProducts);
router.post('/', orderProductController.createOrderProduct);
router.put('/:id', orderProductController.updateOrderProduct);
router.delete('/:id', orderProductController.deleteOrderProduct);

module.exports = router;