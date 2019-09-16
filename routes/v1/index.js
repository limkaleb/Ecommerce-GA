const express = require('express');
const router = express.Router();

const usersRouter = require('./users');

router.use('/users', usersRouter);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'E-Commerce API' });
});

module.exports = router;
