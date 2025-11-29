const Order = require('../../models/Order');

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'username email phone')
      .populate('items.food', 'name price image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('user items totalAmount deliveryAddress paymentStatus orderStatus paymentMethod stripePaymentIntentId paidAt createdAt updatedAt');

    const total = await Order.countDocuments(query);
    const totalPendingOrders = await Order.countDocuments({
      orderStatus: { $ne: 'delivered' }
    });
    const totalDeliveredOrders = await Order.countDocuments({
      orderStatus: 'delivered'
    });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      message: 'Orders fetched successfully',
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      totalPendingOrders,
      totalDeliveredOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('user', 'username email phone addresses')
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

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, estimatedDeliveryTime } = req.body;

    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus === 'confirmed') {
      if (currentOrder.paymentStatus !== 'paid') {
        return res.status(400).json({
          message: 'Unpaid orders cannot be confirmed. Please make sure the payment is completed.'
        });
      }
    }

    const updateData = { orderStatus };
    if (estimatedDeliveryTime) {
      updateData.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'username email')
      .populate('items.food', 'name');

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const confirmedOrders = await Order.countDocuments({ orderStatus: 'confirmed' });
    const preparingOrders = await Order.countDocuments({ orderStatus: 'preparing' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      message: 'Statistics fetched successfully',
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        preparingOrders,
        deliveredOrders,
        todayOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

