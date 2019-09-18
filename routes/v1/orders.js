const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/ordersController');
const auth = require('../../middlewares/auth');

router.post('/:userId', auth.isAuthenticated, ordersController.postOrder);

// Only for active order
router.get('/active/:userId', auth.isAuthenticated, ordersController.getOrderActive);

// Get history for all completed orders
router.get('/history/:userId', auth.isAuthenticated, ordersController.getOrderHistory);

// Update isComplete to true 
router.put('/complete/:orderId', auth.isAuthenticated, ordersController.updateOrderStatus);

// Update product's order quantity
router.put('/quantity/:orderId/:cartId', auth.isAuthenticated, ordersController.updateOrderQty);

// delete single order from orderID
router.delete('/:orderId', auth.isAuthenticated, ordersController.deleteById);

// delete all order for developer
router.delete('/', ordersController.deleteAllOrder);

module.exports = router;