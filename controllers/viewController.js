const express = require('express');
const router = express.Router();
const config = require('../config');
const BlockAuthService = require('../services/blockAuthService');
const VerifierService = require('../services/verifierService');
const UserService = require('../services/userService');

const CONTRACT_ADDRESS = config.CONTRACT_ADDRESS;
const ABI = config.ABI;
const ETHEREUM_NODE_ADDRESS = config.ETHEREUM_NODE_ADDRESS;
const BASE_URL = config.BASE_URL;

const redirectToLogin = (req, res, next) => {

  if (!req.session.isLogged){
    res.redirect('http://localhost:3000/signin?redirect=http://localhost:3000/verify/');
  }
  else{
    next();
  }
}

const redirectToHome = (req, res, next) => {

  if (req.session.isLogged){
    res.redirect('http://localhost:3000/profile/');
  }
  else{
    next();
  }
}

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/signup', redirectToHome, (req, res) => {
  res.render('signup', { contractAddress: CONTRACT_ADDRESS, abi: ABI, node_address: ETHEREUM_NODE_ADDRESS});
})


router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.get('/profile', redirectToLogin, (req, res) => {
  res.render('profile');
});

router.get('/integrate', (req, res) => {
  res.render('integrate');
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

router.get('/verify', (req, res) => {

  const username = req.query.username;
  const code = req.query.code;
  const hashCode = req.query.hashcode;

  VerifierService.verifyUser(username, code, hashCode).then(data => {

    if(data.message == 'Authentication successful'){

      console.log('Login success');
      req.session.isLogged = true;
      res.send({message: 'Authentication Successful', data: true, to: 'http://localhost:3000/profile'});
    }
    else{
      res.send({message: 'Authentication Unuccessful', data: false});
    }

  }).catch(error => {

    res.send({message: error.message});
  
  })


});

router.post('/authentication/:id/verify', (req, res) => {


  const username = req.body.username;
  const code = req.body.code;
  const hashCode = req.body.hashCode;
  const cipher = req.body.cipher;

  UserService.authenticateUser(username, code, hashCode, cipher).then(data => {

    res.send({message: data.message, data:data.data});

  }).catch(error => {

    res.send({message: error.message});

  })

});

router.get('/logout', (req, res) => {

  req.session.destroy(error => {
    if(error){
      return res.redirect('/profile');
    }
    res.clearCookie('SID');
    res.redirect('/');
  })
})



module.exports = router;