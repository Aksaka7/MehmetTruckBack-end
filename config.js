const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.STRIPE_SECRET_KEY) {

  process.exit(1);
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/food_delivery',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51RTIZVRaw8EJNYR4naR3JJ5Af24kIKcTfArv3jckyHIwWqM70RPXTJehSBH1aLH7l3V4Uj43lhtb7wlzklLKfLld00Bc3CT2Ju',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret'
}; 