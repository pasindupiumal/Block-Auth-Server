const express =  require('express');
const router = express.Router();
const KeyService = require('../services/keyService');

//End point for generating new sets of keys for new users
router.get('/', (req, res) => {

    KeyService.newKeys().then(data => {

        //res.status(data.status).send({message: data.message, data: data.data});
        res.send({message: data.message, data: data.data});

    }).catch(error => {

       //res.status(error.status).send({message: error.message});
       res.send({message: error.message});
    });
});

module.exports = router;