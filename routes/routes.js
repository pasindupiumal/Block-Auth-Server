const express = require('express');
const router = express.Router();
const indexRouter = require('../controllers/indexController');
const keyRouter = require('../controllers/keyController');
const userRouter = require('../controllers/userController');
const blockAuthRouter = require('../controllers/blockAuthController');

router.use('/', indexRouter);
router.use('/keys', keyRouter);
router.use('/users/', userRouter);
router.use('/blockauth/', blockAuthRouter);


module.exports = router;