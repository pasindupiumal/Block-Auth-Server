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
           const getKey = BASE_URL +  '/blockauth/key';

           var userURL = "";
           var userKey = "";

           axios.post(getUserURL, {username: username}).then( data => {

                userURL = data.data.data;

                //Get key

                axios.post(getKey, {username: username}).then( data => {

                    userKey = data.data.data;


                    const tokenRaw = crypto.createHash('sha256').update(Math.random().toString()).digest('base64').substr(0,10);
                    const encrypted = cryptico.encrypt(tokenRaw, userKey, "").cipher;

                    axios.post(userURL + '/verify', {username: username, code: code, hashCode: hashCode, cipher: encrypted}).then(data => {

                        if(data.data.data == tokenRaw){
                            console.log("Authentication successfull. Token validation successful");
                            resolve({status: 200, message: 'Authentication successful', data: ''});
                        }
                        else{
                            console.log("Authentication unsuccessful. Token validation failed");
                            reject({status: 500, message: 'Error - Authentication failed. Token validation mismatch'});
                        }


                    }).catch(error => {

                        console.log('Error - Authentication failed - ' + error );
                        reject({status: 500, message: 'Error - Authentication failed - ' + error});
                    });

                }).catch(error => {

                    console.log('Error getting user key ' + error);
                    reject({status: 500, message: 'Error getting user key - ' + error});

                });


           }).catch(error => {

                console.log('Error getting user url ' + error);
                reject({status: 500, message: 'Error getting user url - ' + error});
        

           })
        })
    }
};


module.exports = new VerifierService();