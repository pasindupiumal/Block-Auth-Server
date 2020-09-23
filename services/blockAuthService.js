const config = require('../config');
const Web3 = require('web3');
const ethereumTx = require('ethereumjs-tx').Transaction;

const abi = config.ABI;
const contractAddress = config.CONTRACT_ADDRESS;
const ethereumAccount = config.ETHEREUM_ACCOUNT_ADDRESS;
const privateKey = config.PRIVATE_KEY;
const ethNodeAddress = config.ETHEREUM_NODE_ADDRESS;
const baseURL = config.BASE_URL;

const web3 = new Web3(new Web3.providers.HttpProvider(ethNodeAddress));
//Set up default account
web3.eth.defaultAccount = ethereumAccount;
//Set up contract
const contract = new web3.eth.Contract(abi, contractAddress, {

    from: web3.eth.defaultAccount,
    gas: 3000000
});


const BlockAuthService = function() {


    this.addNewUser = (userData) => {

        console.log(userData);

        return new Promise((resolve, reject) => {

            web3.eth.getTransactionCount(web3.eth.defaultAccount, function (error, nonce) {

                if (error){

                    reject({status: 500, message: 'Error obtaining nonce value - ' + error});
                }
                else{

                    console.log('Nonce value is ' + nonce);
        
                    const functionABI = contract.methods.addNewUser(userData.username, userData.block_auth_url, userData.public_key).encodeABI();
            
                    let details = {
            
                        "nonce": nonce,
                        "gasPrice": web3.utils.toHex(web3.utils.toWei('47', 'gwei')),
                        "gas": 3000000,
                        "to": contractAddress,
                        "value": 0,
                        "data": functionABI
                    };
            
                    const transaction = new ethereumTx(details);
            
                    transaction.sign(Buffer.from(privateKey, 'hex'));
            
                    let rawData = '0x' + transaction.serialize().toString('hex');

                    web3.eth.sendSignedTransaction(rawData).on('transactionHash', function(hash) {
            
                        console.log('Transaction Hash: ' + hash);
            
                    }).on('receipt', function(receipt) {
            
                        console.log('Transaction Receipt: ' + receipt);
                        
                        contract.methods.usernameAvailable(userData.username).call((error, result) => {
            
                            if (error){

                                reject({status: 500, message: 'Error obtaining new user confirmation: ' + error});
                            }
                            else{

                                if (result == false){

                                    resolve({status: 200, message: 'User data added to blockchain', data: receipt});
                                }
                                else{

                                    reject({status: 500, message: 'Error inserting new user to blockchain'});
                                }

                                
                                
                            }
                        });
            
                    }).on('error', function(error){

                        console.log('Transaction error: ' + error);
                        reject({status: 500, message: 'Error completing insert user transaction: ' + error});
                    });

                }        
        
            });
            
        });
    };

    this.getBlockAuthPublicKey = (username) => {

        return new Promise((resolve, reject) => {


            contract.methods.getBlockAuthPublicKey(username).call((error, result) => {

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'Public key received', data: result});
                }

            });
            
        });
    };


    this.usernameAvailable = (username) => {

        return new Promise((resolve, reject) => {

            contract.methods.usernameAvailable(username).call((error, result) => {

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'Username availability status received', data: result});
                }

            });
            
        });
    };

    this.getBlockAuthUrl = (username) => {

        return new Promise((resolve, reject) => {

            contract.methods.getBlockAuthUrl(username).call((error, result) => {

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'User url received', data: result});
                }

            });
            
        });
    };

    this.getAddress = (username) => {

        return new Promise((resolve, reject) => {

            contract.methods.getAddress(username).call((error, result) => {

                if(error){
                    reject({status: 500, message: 'Error - ' + error});
                }
                else{
                    resolve({status: 200, message: 'User address received', data: result});
                }

            });
                        
        });
    };

    
};


module.exports = new BlockAuthService();