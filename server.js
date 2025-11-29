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

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mehmet Truck Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Global Error:', err);
  
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    error: process.env.NODE_ENV === 'production' ? undefined : err
  });
});

// ✅ Vercel uyumlu export
module.exports = app; // sadece `app` export edilir
module.exports.handler = serverless(app); // Vercel için `handler` gerekir
