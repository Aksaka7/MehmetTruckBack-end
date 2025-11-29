const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 500000,
    connectTimeoutMS: 500000,
    socketTimeoutMS: 500000,
  });
};

module.exports = connectDB;
