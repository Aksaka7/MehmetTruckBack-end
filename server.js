require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

const connectDB = require('./database/connection');
const config = require('./config');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminCategoryRoutes = require('./routes/admin/categoryRoutes');
const adminFoodRoutes = require('./routes/admin/foodRoutes');
const adminOrderRoutes = require('./routes/admin/orderRoutes');
const adminUserRoutes = require('./routes/admin/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// MongoDB bağlantısı
connectDB()
  .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
  .catch((err) => {
    console.error('❌ MongoDB bağlantı hatası:', err);
    process.exit(1);
  });

// Middleware
app.use(cors(
  {
    origin: '*',
    credentials: true,
  }
));

// Stripe webhook
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/foods', adminFoodRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Global Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// ✅ Vercel uyumlu export
module.exports = app; // sadece `app` export edilir
module.exports.handler = serverless(app); // Vercel için `handler` gerekir
