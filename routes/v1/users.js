const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');

router.post('/', usersController.postRegister);

router.post('/login', usersController.postLogin);

router.get('/', usersController.getUsers);

router.get('/:userId', usersController.getUser);

router.put('/update/:userId', usersController.updateToMerchant);

router.delete('/', usersController.deleteAll);

router.delete('/:userId', usersController.deleteById);

module.exports = router;
