const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token is required' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated' });
    }

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.username
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};


exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin permission is required for this action' });
  }
  next();
}; 