const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
const auth = require('../../middlewares/auth');

router.post('/:userId', auth.isAuthenticated, productsController.postProduct);

router.get('/byUser/:userId', productsController.getProducts);

router.get('/byProduct/:productId', productsController.getProduct);

router.put('/:productId', auth.isAuthenticated, productsController.updateProducts);

router.delete('/:productId', auth.isAuthenticated, productsController.deleteById);

module.exports = router;