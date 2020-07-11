const express =  require('express');
const router = express.Router();
const BlockAuthService = require('../services/blockAuthService');

router.get('/key', (req, res) => {

    console.log('Username: ' + req.body.username);
    BlockAuthService.getBlockAuthPublicKey(req.body.username).then(data => {

        res.send({message: data.message, data: data.data});
    }).catch(error => {

       res.send({message: error.message});
    });

});

module.exports = router;