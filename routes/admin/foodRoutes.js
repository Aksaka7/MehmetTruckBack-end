const express = require('express');
const router = express.Router();
const foodController = require('../../controllers/admin/foodController');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');
const upload = require('../../middleware/upload');


router.use(authenticateToken, requireAdmin);

router.get('/', foodController.getAllFoods);
router.post('/', upload.single('image'), foodController.createFood);
router.get('/:id', foodController.getFoodById);
router.put('/:id', upload.single('image'), foodController.updateFood);
router.delete('/:id', foodController.deleteFood);
router.patch('/:id/toggle-availability', foodController.toggleAvailability);
router.patch('/:foodId/update-discount', foodController.updateDiscount);
router.patch('/update-all-discounts', foodController.updateAllDiscounts);

module.exports = router; 