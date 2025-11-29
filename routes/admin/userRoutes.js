const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');

router.use(authenticateToken, requireAdmin);

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.get('/:userId/orders', userController.getUserOrders);

router.patch('/:id/toggle-status', userController.toggleUserStatus);

router.delete('/:id', userController.deleteUser);

module.exports = router; 