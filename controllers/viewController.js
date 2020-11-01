const express = require('express');
const router = express.Router();
const config = require('../config');
const VerifierService = require('../services/verifierService');
const UserService = require('../services/userService');

const redirectToLogin = (req, res, next) => {

  if (!req.session.isLogged){
    res.redirect('http://localhost:3000/signin?redirect=http://localhost:3000/verify');
  }
  else{
    next();
  }
}

const redirectToHome = (req, res, next) => {

  if (req.session.isLogged){
    res.redirect('http://localhost:3000/profile');
  }
  else{
    next();
  }
}

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/signin', redirectToHome, (req, res) => {
  res.render('signin');
});

router.get('/profile', redirectToLogin, (req, res) => {
  res.render('profile');
});

router.get('/integrate', (req, res) => {
  res.render('integrate');
});

router.get('/verify', (req, res) => {

  const username = req.query.username;
  const code = req.query.code;
  const hashCode = req.query.hashcode;

  VerifierService.verifyUser(username, code, hashCode).then(data => {

    if(data.message == 'Authentication successful'){

      console.log('Login success');
      const returnData = {
        status: true,
        to: 'http://localhost:3000/profile',
        username: username
      }
      req.session.isLogged = true;
      res.send({message: 'Authentication Successful', data: returnData});
    }
    else{
      const returnData = {
        status: false,
      }
      res.send({message: 'Authentication Unuccessful', data: returnData});
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