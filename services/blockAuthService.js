const config = require('../config');
const Web3 = require('web3');
const BASE_URL = config.BASE_URL;
const ETHEREUM_NODE_ADDRESS = config.ETHEREUM_NODE_ADDRESS;
const CONTRACT_ADDRESS = config.CONTRACT_ADDRESS;
const ABI = config.ABI;
const web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_NODE_ADDRESS));
var contract = web3.eth.contract(ABI).at(CONTRACT_ADDRESS);

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