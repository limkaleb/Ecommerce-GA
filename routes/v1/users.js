const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const auth = require('../../middlewares/auth');

router.post('/', usersController.postRegister);

router.post('/login', usersController.postLogin);

router.get('/', usersController.getUsers);

router.get('/:userId', usersController.getUser);

// Protected route
router.put('/update/:userId', auth.isAuthenticated, usersController.updateToMerchant);

router.delete('/', usersController.deleteAll);

// Protected route
router.delete('/:userId', auth.isAuthenticated, usersController.deleteById);

module.exports = router;
