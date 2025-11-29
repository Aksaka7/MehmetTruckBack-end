const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');
const Order = require('../models/Order');

router.post('/create-payment-intent', authenticateToken, paymentController.createPaymentIntent);
router.post('/confirm', authenticateToken, paymentController.confirmPayment);
router.post('/webhook', paymentController.handleWebhook);

if (process.env.NODE_ENV === 'development') {
  router.post('/manual-update', authenticateToken, paymentController.manuallyUpdateOrder);
}


router.post('/temp-update/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paidAt = new Date();
    await order.save();

    res.json({
      message: 'Sipariş güncellendi',
      order: {
        _id: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        paidAt: order.paidAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 