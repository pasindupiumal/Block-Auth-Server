const express = require('express');
const router = express.Router();
const indexRouter = require('../controllers/indexController');
const keyRouter = require('../controllers/keyController');

router.use('/', indexRouter);
router.use('/keys', keyRouter);


module.exports = router;