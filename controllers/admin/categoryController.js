const Category = require('../../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({
      message: 'Categories fetched successfully',
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'This category already exists' });
    }


    const parsedIsActive = isActive !== undefined ?
      (typeof isActive === 'string' ? isActive === 'true' : Boolean(isActive)) :
      true;

    const category = new Category({
      name,
      description,
      image,
      isActive: parsedIsActive
    });
    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;




    // Boolean değeri doğru şekilde parse et
    const parsedIsActive = isActive !== undefined ?
      (typeof isActive === 'string' ? isActive === 'true' : Boolean(isActive)) :
      true;



    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, image, isActive: parsedIsActive },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }



    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 