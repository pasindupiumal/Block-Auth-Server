const express =  require('express');
const router = express.Router();
const BlockAuthService = require('../services/blockAuthService');

router.post('/key', (req, res) => {

    BlockAuthService.getBlockAuthPublicKey(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});
    });

});

router.get('/username', (req, res) => {

    BlockAuthService.usernameAvailable(req.query.username).then(data => {

        res.send({message: data.message, data: data.data});

    }).catch(error => {

        //res.status(error.status).send({message: error.message});
        res.send({message: error.message});
    });

});

router.post('/url', (req, res) => {

    BlockAuthService.getBlockAuthUrl(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});
    });

});

router.post('/address', (req, res) => {

    BlockAuthService.getAddress(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});
    });

});

router.post('/user', (req, res) => {

    userData = {
        username: req.body.username,
        block_auth_url: req.body.url,
        public_key: req.body.publicKey
    }

    BlockAuthService.addNewUser(userData).then(data => {

        res.send({message: data.message, data: data.data});

    }).catch(error => {

        res.send({message: error.message});
    });

});

module.exports = router;