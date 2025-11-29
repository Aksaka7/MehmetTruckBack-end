const Food = require('../models/Food');
const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    console.log('Kategoriler getiriliyor...');

    // Önce kategorileri getir
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    if (!categories) {
      console.log('Kategori bulunamadı');
      return res.status(404).json({
        message: 'No categories found',
        categories: []
      });
    }

    console.log(`${categories.length} kategori bulundu`);

    // Her kategori için yemek sayısını hesapla
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        try {
          const count = await Food.countDocuments({ category: category._id });
          return {
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
            isActive: category.isActive,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            foodCount: count
          };
        } catch (error) {
          console.error(`Kategori için yemek sayısı hesaplanırken hata: ${category._id}`, error);
          return {
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
            isActive: category.isActive,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            foodCount: 0
          };
        }
      })
    );

    console.log('Kategoriler başarıyla hazırlandı');

    return res.json({
      message: 'Categories fetched successfully',
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('Kategoriler getirilirken hata:', error);
    return res.status(500).json({
      message: 'Error fetching categories',
      error: error.message || 'Internal server error'
    });
  }
};

exports.getFoods = async (req, res) => {
  try {
    const { category, page = 1, limit = 12, search } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const foods = await Food.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Food.countDocuments(query);

    res.json({
      message: 'Foods fetched successfully',
      foods,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Tek yemek detayı
exports.getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id)
      .populate('category', 'name');

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json({
      message: 'Food details fetched successfully',
      food
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPopularFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate('category', 'name')
      .sort({ rating: -1, reviewCount: -1 })
      .limit(8);

    res.json({
      message: 'Popular foods fetched successfully',
      foods
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({
      message: 'All foods fetched successfully',
      foods,
      total: foods.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};