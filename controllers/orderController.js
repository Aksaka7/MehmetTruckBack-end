const Order = require('../models/Order');
const Food = require('../models/Food');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate('items.food', 'name price image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ user: userId });

    res.json({
      message: 'Order history fetched successfully',
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate('items.food', 'name price image category');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order details fetched successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId, status } = req.body;

    const order = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = status === 'succeeded' ? 'paid' : 'failed';
    if (status === 'succeeded') {
      order.orderStatus = 'confirmed';
    }

    await order.save();

    res.json({
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
      return res.status(400).json({
        message: 'This order cannot be cancelled'
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 