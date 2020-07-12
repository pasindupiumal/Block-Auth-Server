const express = require('express');
const router = express.Router();
const config = require('../config');

const CONTRACT_ADDRESS = config.CONTRACT_ADDRESS;
const ABI = config.ABI;
//const ABI = JSON.stringify(config.ABIFrontEnd);
const ETHEREUM_NODE_ADDRESS = config.ETHEREUM_NODE_ADDRESS;


router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/signup', (req, res) => {
  res.render('signup', { contractAddress: CONTRACT_ADDRESS, abi: ABI, node_address: ETHEREUM_NODE_ADDRESS});
})


router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/authentication/:id', (req, res) => {

  const username = req.query.username;
  console.log(username);

  res.render('authentication', {username: 'pasindu'});
});



module.exports = router;