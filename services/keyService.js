const cryptico = require('cryptico');
const crypto = require('crypto');
const config = require('../config');
const BASE_URL = config.BASE_URL;

const KeyService = () => {

    this.newKeys = () => {

        return new Promise((resolve, reject) => {

            console.log('Generating a new set of keys');
            const rsaKey = cryptico.generateRSAKey(Math.random().toString(), 2048);
            console.log('RSA key generated');
            const rsaPublicKey = cryptico.publicKeyString(rsaKey);
            console.log('RSA public key generated');

            //Get the user specific url
            const url = BASE_URL + "authentication/" + crypto.createHash('sha256').update(rsaPublicKey).digest('base64').substr(0, 8);


        })
    }
};


module.exports = new KeyService();