const express =  require('express');
const router = express.Router();
const UserService = require('../services/userService');

//Endpoint for adding new user
router.post('/', (req, res) => {

    user = {
        username: req.body.username,
        password: req.body.password,
        publicKey: req.body.publicKey,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }

    UserService.updateUserData(user).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});

    });

});

/*router.post('/userData', (req, res) => {

    UserService.findUserByUsername(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});

    });

}); */


module.exports = router;