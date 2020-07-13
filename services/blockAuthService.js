const config = require('../config');
const Web3 = require('web3');
const crypto = require('crypto');
const cryptico = require('cryptico');
const BASE_URL = config.BASE_URL;
const ETHEREUM_NODE_ADDRESS = config.ETHEREUM_NODE_ADDRESS;
const CONTRACT_ADDRESS = config.CONTRACT_ADDRESS;
const ABI = config.ABI;
const web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_NODE_ADDRESS));
var contract = web3.eth.contract(ABI).at(CONTRACT_ADDRESS);
const UserService = require('../services/userService');

const BlockAuthService = function() {


    this.addNewUser = (userData) => {

        console.log(userData);

        return new Promise((resolve, reject) => {

            contract.addNewUser(userData.username, userData.block_auth_url, userData.public_key, function(error, response){

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'User data added to blockchain', data: response});
                }
            });
            
        });
    };

    this.getBlockAuthPublicKey = (username) => {

        return new Promise((resolve, reject) => {

            contract.getBlockAuthPublicKey(username, function(error, response){

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'Public key received', data: response});
                }
            });
            
        });
    };


    this.verify = (username, code, hashCode, cipher) => {

        return new Promise((resolve, reject) => {


            UserService.findUserByUsername(username).then(data => {

                
                const expectedHashCode = crypto.createHash('sha256').update(code + data.data.password).digest('hex');

                if(expectedHashCode != hashCode ){

                    reject({status: 500, message: 'Authentication failed. Hash comparison failed'});
                
                }else{
                    
                    const privateKey = data.data.privateKey;
                    var privateKeyTemp = cryptico.RSAKey();
                    var privateKeyTemp = cryptico.RSAKey.parse(privateKey);

                    const decrypted = cryptico.decrypt(cipher, privateKeyTemp);

                    if(decrypted.status == "success"){

                        resolve({status: 200, message: 'Authentication successful', data: decrypted.plaintext});
                    }
                }


            }).catch(error => {

                console.log('Error retrieving user data ' + error);
                reject({status: 500, message: 'Error retrieving user data - ' + error});
            });

            contract.getBlockAuthPublicKey(username, function(error, response){

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'Public key received', data: response});
                }
            });
            
        });
    };




    this.usernameAvailable = (username) => {

        return new Promise((resolve, reject) => {

            contract.usernameAvailable(username, function(error, response){

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'Username availability status received', data: response});
                }
            });
            
        });
    };

    this.getBlockAuthUrl = (username) => {

        return new Promise((resolve, reject) => {

            contract.getBlockAuthUrl(username, function(error, response){

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'User url received', data: response});
                }
            });
            
        });
    };

    this.getAddress = (username) => {

        return new Promise((resolve, reject) => {

            contract.getAddress(username, function(error, response){

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'User address received', data: response});
                }
            });
            
        });
    };

    
};


module.exports = new BlockAuthService();