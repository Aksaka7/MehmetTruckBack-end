const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');


router.get('/categories', foodController.getCategories);
router.get('/popular', foodController.getPopularFoods);
router.get('/', foodController.getFoods);
router.get('/:id', foodController.getFoodById);

module.exports = router; 