const cryptico = require('cryptico');
const crypto = require('crypto');
const config = require('../config');
const UserService = require('./userService');

const BASE_URL = config.BASE_URL;

const KeyService = function() {

    this.newKeys = () => {

        return new Promise((resolve, reject) => {

            console.log('Generating a new set of keys');
            const rsaKey = cryptico.generateRSAKey(Math.random().toString(), 2048);
            console.log('RSA key generated');
            const rsaPublicKey = cryptico.publicKeyString(rsaKey);
            console.log('RSA public key generated');

            const code = crypto.createHash('sha256').update(rsaPublicKey).digest('base64').substr(0, 8);

            var codeModified = code.replace(/\//g, 'ktr');

            //Get the user specific url
            const userURL = BASE_URL + '/authentication/' + codeModified;

            const newUser = {
                publicKey: rsaPublicKey,
                privateKey: JSON.stringify(rsaKey.toJSON()),
                url: userURL
            };

            //Add new user
            UserService.addUser(newUser).then(data => {

                resolve({status: data.status, message: 'New set of keys generated succesfully', data: data.data});
            }).catch(error => {

                reject({status: error.status, message: 'Error - ' + error});
            });


        })
    }
};


module.exports = new KeyService();