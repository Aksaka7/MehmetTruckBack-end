const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');
const Order = require('../../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


router.get('/:orderId/debug', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    let paymentInfo = null;
    if (order.stripePaymentIntentId) {
      try {
        paymentInfo = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
      } catch (stripeError) {

      }
    }

    res.json({
      order: {
        _id: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        stripePaymentIntentId: order.stripePaymentIntentId,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      },
      stripePaymentInfo: paymentInfo
    });
  } catch (error) {

    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.post('/:orderId/force-update', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.stripePaymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        order.paymentStatus = 'paid';
        if (order.orderStatus === 'pending') {
          order.orderStatus = 'confirmed';
        }
        order.paidAt = new Date(paymentIntent.created * 1000);
      } else if (paymentIntent.status === 'canceled') {
        order.paymentStatus = 'failed';
      }

      await order.save();

      res.json({
        message: 'Order updated successfully',
        order: {
          _id: order._id,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          paidAt: order.paidAt,
          stripeStatus: paymentIntent.status
        },
        stripePaymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          created: paymentIntent.created
        }
      });
    } else {
      res.status(400).json({ message: 'Order payment ID is missing' });
    }
  } catch (error) {

    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.post('/:orderId/add-payment-intent', async (req, res) => {
  try {
    const { stripePaymentIntentId } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);
    if (!paymentIntent) {
      return res.status(404).json({ message: 'Payment information not found' });
    }

    order.stripePaymentIntentId = stripePaymentIntentId;

    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = 'paid';
      if (order.orderStatus === 'pending') {
        order.orderStatus = 'confirmed';
      }
      order.paidAt = new Date(paymentIntent.created * 1000);
    }

    await order.save();

    await stripe.paymentIntents.update(stripePaymentIntentId, {
      metadata: {
        orderId: order._id.toString()
      }
    });

    res.json({
      message: 'Order updated successfully',
      order: {
        _id: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        stripePaymentIntentId: order.stripePaymentIntentId,
        paidAt: order.paidAt
      },
      stripePaymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        created: paymentIntent.created
      }
    });
  } catch (error) {

    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.use(authenticateToken, requireAdmin);

router.get('/', orderController.getAllOrders);
router.get('/stats', orderController.getOrderStats);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

router.post('/:orderId/check-payment', async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ message: 'Payment information not found' });
    }

    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = 'paid';
      if (order.orderStatus === 'pending') {
        order.orderStatus = 'confirmed';
      }
      order.paidAt = new Date();
      await order.save();

      return res.json({
        message: 'Payment status updated successfully',
        order: {
          _id: order._id,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          paidAt: order.paidAt
        }
      });
    } else if (paymentIntent.status === 'canceled') {
      order.paymentStatus = 'failed';
      await order.save();

      return res.json({
        message: 'Payment cancelled',
        order: {
          _id: order._id,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus
        }
      });
    }

    res.json({
      message: 'Payment status did not change',
      order: {
        _id: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        stripeStatus: paymentIntent.status
      }
    });
  } catch (error) {

    res.status(500).json({
      message: 'Error checking payment status',
      error: error.message
    });
  }
});

module.exports = router; 