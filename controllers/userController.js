const express =  require('express');
const router = express.Router();
const UserService = require('../services/userService');


router.post('/', (req, res) => {

    console.log(req.body);

    user = {
        username: req.body.username,
        password: req.body.password,
        publicKey: req.body.publicKey
    }

    UserService.updateUsernameAndPassword(user).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});
    }).catch(error => {

        res.status(error.status).send({message: error.message});
    });

})

module.exports = router;