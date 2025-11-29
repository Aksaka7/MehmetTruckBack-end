const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');


router.use(authenticateToken, requireAdmin);

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 