const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  confirmPayment, 
  handleWebhook 
} = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const handleCreatePayment = async (req, res, next) => {
  try {
    await createPaymentIntent(req, res);
  } catch (error) {
    next(error);
  }
};

const handleConfirmPayment = async (req, res, next) => {
  try {
    await confirmPayment(req, res);
  } catch (error) {
    next(error);
  }
};

const handleWebhookRequest = async (req, res, next) => {
  try {
    await handleWebhook(req, res);
  } catch (error) {
    next(error);
  }
};

router.post('/create-payment-intent', auth.authenticateToken, handleCreatePayment);
router.post('/confirm-payment', auth.authenticateToken, handleConfirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhookRequest);

module.exports = router; 