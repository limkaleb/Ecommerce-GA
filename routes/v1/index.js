const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const productsRouter = require('./products');
const ordersROuter = require('./orders');

router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersROuter);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'E-Commerce API' });
});

module.exports = router;
