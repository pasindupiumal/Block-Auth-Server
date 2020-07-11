const express =  require('express');
const router = express.Router();
const KeyService = require('../services/keyService');
const UserModel = require('../models/user');

//End point for generating new sets of keys for new users
router.get('/', (req, res) => {

    KeyService.newKeys().then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

       res.status(error.status).send({message: error.message});
    });
});


router.post('/', (req, res) => {

    username = 'pasindu9696';
    UserModel.User.findOne({username: username}).then(data => {

        if (data == null){
            res.send({message: 'User not found'});
        }
        else{
            res.send({message: 'User found'});
        }
        
    }).catch(error => {
        res.send({message: 'Error - ' + error});
    });

})

module.exports = router;