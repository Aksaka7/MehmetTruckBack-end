const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');


router.use(authenticateToken);

router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/cancel', orderController.cancelOrder);
router.post('/payment-status', orderController.updatePaymentStatus);

module.exports = router; 