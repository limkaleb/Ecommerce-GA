const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
const auth = require('../../middlewares/auth');
const { multerUploads } = require('../../middlewares/multer');

router.post('/:userId', auth.isAuthenticated, productsController.postProduct);

router.post('/photo/:productId', multerUploads, auth.isAuthenticated, productsController.uploadPhotos);

router.delete('/photo/:productId', multerUploads, auth.isAuthenticated, productsController.destroyPhoto);

router.get('/byUser/:userId', productsController.getProducts);

router.get('/byProduct/:productId', productsController.getProduct);

router.put('/:productId', auth.isAuthenticated, productsController.updateProducts);

router.delete('/:productId', auth.isAuthenticated, productsController.deleteById);

// get all products
router.get('/', productsController.getAllProducts);

module.exports = router;