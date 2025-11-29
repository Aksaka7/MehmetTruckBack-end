const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

router.get('/addresses', authenticateToken, userController.getAddresses);
router.post('/addresses', authenticateToken, userController.addAddress);
router.put('/addresses/:addressId', authenticateToken, userController.updateAddress);
router.put('/addresses/:addressId/default', authenticateToken, userController.setDefaultAddress);
router.delete('/addresses/:addressId', authenticateToken, userController.deleteAddress);

router.get('/all', authenticateToken, requireAdmin, userController.getAllUsers);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);
router.patch('/:id/toggle-status', authenticateToken, requireAdmin, userController.toggleUserStatus);

module.exports = router; 