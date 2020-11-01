const express =  require('express');
const router = express.Router();
const BlockAuthService = require('../services/blockAuthService');
const config = require('../config');
const ethereumTx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');


const contractAddress = config.CONTRACT_ADDRESS;
const abi = config.ABI;
const ethNodeAddress = config.ETHEREUM_NODE_ADDRESS;
const privateKey = "f6779c36dd61671a3f7ef654c49a642260ca985277bc6c980ea9923fdc477b34";


router.post('/key', (req, res) => {

    BlockAuthService.getBlockAuthPublicKey(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});
    });

});

router.get('/username', (req, res) => {

    BlockAuthService.usernameAvailable(req.query.username).then(data => {

        res.send({message: data.message, data: data.data});

    }).catch(error => {

        //res.status(error.status).send({message: error.message});
        res.send({message: error.message});
    });

});

router.post('/url', (req, res) => {

    BlockAuthService.getBlockAuthUrl(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});
    });

});

router.post('/address', (req, res) => {

    BlockAuthService.getAddress(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});
    });

});

router.post('/user', (req, res) => {

    userData = {
        username: req.body.username,
        block_auth_url: req.body.url,
        public_key: req.body.publicKey
    }

    BlockAuthService.addNewUser(userData).then(data => {

        //console.log('Log file : ' + data.data);
        res.send({message: data.message, data: data.data});

    }).catch(error => {

        res.send({message: error.message});
    });

});

router.post('/newuser', (req, res) => {

    const web3 = new Web3(new Web3.providers.HttpProvider(ethNodeAddress));

    web3.eth.defaultAccount = '0x73255a1298c6f69d911e5d5BDBd7c32383a0487D';

    web3.eth.getTransactionCount(web3.eth.defaultAccount, function (error, nonce) {

        console.log('Nonce value is ' + nonce);

        const contract = new web3.eth.Contract(abi, contractAddress, {

            from: web3.eth.defaultAccount,
            gas: 3000000
        });

        const functionABI = contract.methods.addNewUser('jj1111', '123', '123456').encodeABI();

        let details = {

            "nonce": nonce,
            "gasPrice": web3.utils.toHex(web3.utils.toWei('47', 'gwei')),
            "gas": 300000,
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
            //res.send(receipt);

            contract.methods.usernameAvailable('jj1111').call((error, result) => {

                if (error){
                    res.send('Error: ' + error);
                }
                else{
                    res.send('Result: ' + result);
                }
            });

        }).on('error', console.error);

    });

});

router.post('/ethereum', (req, res) => {

    const web3 = new Web3(new Web3.providers.HttpProvider(ethNodeAddress));

    web3.eth.defaultAccount = '0x73255a1298c6f69d911e5d5BDBd7c32383a0487D';

    web3.eth.getTransactionCount(web3.eth.defaultAccount, function (error, nonce) {

        console.log('Nonce value is ' + nonce);

        const contract = new web3.eth.Contract(abi, contractAddress, {

            from: web3.eth.defaultAccount,
            gas: 3000000
        });

        

    });

});

module.exports = router;