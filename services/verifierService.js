const cryptico = require('cryptico');
const crypto = require('crypto');
const config = require('../config');
const axios = require('axios');
const { default: Axios } = require('axios');


const BASE_URL = config.BASE_URL;

const VerifierService = function() {

    this.verifyUser = (username, code, hashCode) => {

        return new Promise((resolve, reject) => {

           const getUserURL = BASE_URL + '/blockauth/url';
           const getAddress = BASE_URL + '/blockauth/address';
           const getKey = BASE_URL +  '/blockauth/key';

           var userURL = "";
           var userKey = "";

           axios.post(getUserURL, {username: username}).then( data => {

                userURL = data.data.data;

                //Get key

                axios.post(getKey, {username: username}).then( data => {

                    userKey = data.data.data;

                    console.log('User Key: ' + userKey);

                    const tokenRaw = crypto.createHash('sha256').update(Math.random().toString()).digest('base64').substr(0,10);
                    const encrypted = cryptico.encrypt(tokenRaw, userKey, "").cipher;

                }).catch(error => {

                    console.log('Error getting user key ' + error);
                    reject({status: 500, message: 'Error getting user key - ' + error});

                });


                resolve({status: 200, message: 'Got the keys', data: userURL});

           }).catch(error => {

                console.log('Error getting user url ' + error);
                reject({status: 500, message: 'Error getting user url - ' + error});
        

           })
        })
    }
};


module.exports = new VerifierService();