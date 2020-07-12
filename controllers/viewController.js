var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
})



module.exports = router;