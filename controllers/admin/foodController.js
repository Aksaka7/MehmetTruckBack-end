const Food = require('../../models/Food');
const Category = require('../../models/Category');
const fs = require('fs').promises;
const path = require('path');

exports.getAllFoods = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    const foods = await Food.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Food.countDocuments(query);
    const totalAvailable = await Food.countDocuments({ ...query, isAvailable: true });
    const totalUnavailable = await Food.countDocuments({ ...query, isAvailable: false });



    res.json({
      message: 'Foods fetched successfully',
      foods,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      totalAvailable,
      totalUnavailable
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createFood = async (req, res) => {
  try {
    const { name, description, price, category, ingredients, preparationTime } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let image = null;

    if (req.file) {
      // base64 string olarak kaydet
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      image = base64Image;
    }

    const food = new Food({
      name,
      description,
      price,
      category,
      image,
      ingredients: ingredients ? JSON.parse(ingredients) : [],
      preparationTime
    });

    await food.save();
    await food.populate('category', 'name');

    res.status(201).json({
      message: 'Food created successfully',
      food
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    const existingFood = await Food.findById(id);
    if (!existingFood) {
      return res.status(404).json({ message: 'Food not found' });
    }

    if (updateData.ingredients && typeof updateData.ingredients === 'string') {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }

    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      updateData.image = base64Image;
    }

    const food = await Food.findByIdAndUpdate(id, updateData, { new: true }).populate('category', 'name');

    res.json({
      message: 'Food updated successfully',
      food
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    await food.deleteOne();

    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id).populate('category', 'name');
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json({
      message: 'Food fetched successfully',
      food
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.json({
      message: 'Food status updated successfully',
      food
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { isDiscount, discount } = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    food.isDiscount = isDiscount;
    food.discount = isDiscount ? (discount || 0) : 0;

    if (isDiscount && discount > 0) {
      food.discountPrice = food.price - (food.price * discount / 100);
    } else {
      food.discountPrice = food.price;
    }

    await food.save();

    res.json({
      message: 'Discount status updated successfully',
      food
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateAllDiscounts = async (req, res) => {
  try {
    const { isDiscount, discount, categoryId } = req.body;
    const query = {};

    if (categoryId) {
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      query.category = categoryId;
    }

    
    const foods = await Food.find(query);


    const updatedFoods = await Promise.all(foods.map(async (food) => {
      food.isDiscount = isDiscount;
      food.discount = isDiscount ? (discount || 0) : 0;

      if (isDiscount && discount > 0) {
        food.discountPrice = food.price - (food.price * discount / 100);
      } else {
        food.discountPrice = food.price;
      }

      return food.save();
    }));

    res.json({
      message: `${updatedFoods.length} food discount status updated successfully`,
      totalUpdated: updatedFoods.length,
      discountApplied: {
        isDiscount,
        discount,
        categoryId: categoryId || 'all'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 