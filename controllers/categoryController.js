const Category = require('../models/Category');


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      message: 'Categories fetched successfully',
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 