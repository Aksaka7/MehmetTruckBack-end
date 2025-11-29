const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');


const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '24h' });
};


exports.register = async (req, res) => {
  try {
    const { username, email, password, phone, adress } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'This email or username is already in use'
      });
    }


    const user = new User({ username, email, password, phone, adress });
    await user.save();


    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        adress: user.adress
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;


    const user = await User.findOne({ email });


    if (!user) {

      return res.status(401).json({ message: 'Invalid email or password' });
    }


    const isPasswordValid = await user.comparePassword(password);


    if (!isPasswordValid) {

      return res.status(401).json({ message: 'Invalid email or password' });
    }


    if (!user.isActive) {

      return res.status(401).json({ message: 'Your account has been deactivated' });
    }


    const token = generateToken(user._id);


    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {

    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 