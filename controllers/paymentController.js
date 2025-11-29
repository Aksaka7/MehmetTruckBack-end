const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');


exports.createPaymentIntent = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe API key not found');
    }

    const { amount, items, deliveryAddress, currency = 'try' } = req.body;


    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Payment process failed',
        error: 'User login required'
      });
    }


    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Payment process failed',
        error: 'Order items are required'
      });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city ||
      !deliveryAddress.district || !deliveryAddress.phone) {
      return res.status(400).json({
        message: 'Payment process failed',
        error: 'Delivery address information is missing'
      });
    }


    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      metadata: {
        userId: req.user.id
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });


    const order = new Order({
      user: req.user.id,
      items: items.map(item => ({
        food: item.food,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: amount,
      deliveryAddress: {
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        district: deliveryAddress.district,
        phone: deliveryAddress.phone,
        postalCode: deliveryAddress.postalCode || ''
      },
      orderStatus: 'pending',
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      stripePaymentIntentId: paymentIntent.id
    });

    await order.save();


    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: order._id
    });
  } catch (error) {

    res.status(500).json({
      message: 'Ödeme işlemi başlatılamadı',
      error: error.message
    });
  }
};


exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.id;


    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ message: 'Payment not found' });
    }


    const order = await Order.findOne({ paymentIntentId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have access to this order' });
    }


    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.paidAt = new Date();
    } else if (paymentIntent.status === 'payment_failed') {
      order.paymentStatus = 'failed';
    }

    await order.save();

    res.json({
      message: 'Payment status updated successfully',
      paymentStatus: paymentIntent.status,
      order: order
    });
  } catch (error) {

    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};


exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

  } catch (err) {

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      await handleSuccessfulPayment(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;

      await handleFailedPayment(failedPayment);
      break;
    default:

  }

  res.json({ received: true });
};


const handleSuccessfulPayment = async (paymentIntent) => {
  try {


    let order = await Order.findById(paymentIntent.metadata.orderId);


    if (!order) {
      order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    }

    if (order) {
    

      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.paidAt = new Date();
      await order.save();
    } else {
    }
  } catch (error) {

  }
};


const handleFailedPayment = async (paymentIntent) => {
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    if (order) {
      order.paymentStatus = 'failed';
      await order.save();


    }
  } catch (error) {

  }
};


exports.manuallyUpdateOrder = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;


    let order;
    if (orderId) {
      order = await Order.findById(orderId);
    } else if (paymentIntentId) {
      order = await Order.findOne({ paymentIntentId });
    }

    if (!order) {
      return res.status(404).json({
        message: 'Sipariş bulunamadı',
        searchCriteria: { orderId, paymentIntentId }
      });
    }

    
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paidAt = new Date();
    await order.save();

    res.json({
      message: 'Order updated successfully',
      order: {
        _id: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        paidAt: order.paidAt
      }
    });
  } catch (error) {

    res.status(500).json({
      message: 'Error updating order',
      error: error.message
    });
  }
}; 