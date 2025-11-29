const User = require('../../models/User');
const Order = require('../../models/Order');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users: users
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
};


exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }


    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin users cannot be changed'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'active' : 'inactive'} status changed`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error changing user status',
      error: error.message
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }


    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin users cannot be deleted'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('items.food', 'name price')
      .select('_id totalAmount orderStatus paymentStatus createdAt items deliveryAddress');

    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
}; 