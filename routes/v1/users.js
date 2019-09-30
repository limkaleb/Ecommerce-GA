const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const auth = require('../../middlewares/auth');
const { multerUploads } = require('../../middlewares/multer');

router.post('/', usersController.postRegister);

// Protected route
router.post('/photo/:userId', multerUploads, auth.isAuthenticated, usersController.uploadPhotos);

// Protected route
router.delete('/photo/:userId', multerUploads, auth.isAuthenticated, usersController.destroyPhoto);

router.post('/login', usersController.postLogin);

router.get('/', usersController.getUsers);

router.get('/:userId', usersController.getUser);

// Protected route
router.put('/update/:userId', auth.isAuthenticated, usersController.updateToMerchant);

// Protected route
router.delete('/:userId', auth.isAuthenticated, usersController.deleteById);

router.post('/change-password/:userId', usersController.changePassword);

module.exports = router;
