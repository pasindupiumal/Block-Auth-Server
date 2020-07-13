const express = require('express');
const router = express.Router();
const config = require('../config');
const BlockAuthService = require('../services/blockAuthService');

const CONTRACT_ADDRESS = config.CONTRACT_ADDRESS;
const ABI = config.ABI;
//const ABI = JSON.stringify(config.ABIFrontEnd);
const ETHEREUM_NODE_ADDRESS = config.ETHEREUM_NODE_ADDRESS;
const BASE_URL = config.BASE_URL;


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
  const id = req.params.id;

  const userUrl = BASE_URL + '/authentication/' + id;

  //Check username status
  BlockAuthService.usernameAvailable(username).then(data => {
  
    if(data.data == true){

      console.log('Invalid username');
      res.render('authentication', {username: 'Invalid username'});
      return;
    }
    else{

      BlockAuthService.getBlockAuthUrl(username).then(data => {

        if(data.data == userUrl){
          
          res.render('authentication', {username: username});

        }
        else{

          res.render('authentication', {username: 'Invalid username'});
        }

      }).catch(error => {

        console.log('Error retreiving url from chain ' + error);
        res.render('authentication', {username: undefined});
        return;


      });
    }
  
  }).catch(error => {
  
    console.log('Error checking username: ' + error);
    res.render('authentication', {username: undefined});
    return;

  });

});



module.exports = router;