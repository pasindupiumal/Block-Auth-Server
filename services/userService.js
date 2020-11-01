const UserModel = require('../models/user');
const crypto = require('crypto');
const cryptico = require('cryptico');

const UserService = function() {

    this.addUser = (data) => {

        return new Promise((resolve, reject) => {

            //Create new user
            const newUser = new UserModel.User({

                privateKey: data.privateKey,
                publicKey: data.publicKey,
                url: data.url
            });

            newUser.save().then(() => {

                const newUserCopy = {
                    publicKey: newUser.publicKey,
                    url: newUser.url
                }

                resolve({status: 200, message: 'New user created successfully', data: newUserCopy});

            }).catch(error => {

                reject({status: 500, message: 'Error - ' + error});
            })


        })
    };

    this.addNewUser = (userData) => {

        return new Promise((resolve, reject) => {

            UserModel.User.findOne({username: userData.username}).then(user => {

                if (user == null){

                    const newUser = new UserModel.User ({
                        privateKey: userData.privateKey,
                        publicKey: userData.publicKey,
                        url: userData.url,
                        username: userData.username,
                        password: userData.password,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email
                    });

                    newUser.save().then(() => {

                        const userTempData = {
                            username: newUser.username,
                            email: newUser.email
                        }

                        resolve({status: 200, message: 'New user created successfully', data: userTempData});

                    }).catch(error => {

                        reject({status: 500, message: 'Error - ' + error});
                    })

                }
                else{

                    reject({status: 500, message: 'Error - Username already taken.'});
                }

            }).catch(error => {

                reject({status: 500, message: 'Error - ' + error});
            });


        });
    };

    this.findUserByUsername = (username) => {

        return new Promise((resolve, reject) => {

            UserModel.User.findOne({username: username}).then(user => {

                if(user == null){
                    reject({status: 500, message: 'User not found'});
                }
                else{

                    resolve({status: 200, message: 'User retrieved', data: user});
                }


            }).catch(error => {

                reject({status: 500, message: 'Error - ' + error});
            });
        });

    }

    this.updateUserData = (userData) => {

        return new Promise((resolve, reject) => {

            UserModel.User.findOne({username: userData.username}).then(user => {

                if (user == null){

                    UserModel.User.findOne({publicKey: userData.publicKey}).then(currentUser => {

                        if (currentUser == null){

                            reject({status: 500, message: 'Error - Invalid public key.'});
                        }
                        else{

                            const newUser = {
                                privateKey: currentUser.privateKey,
                                publicKey: currentUser.publicKey,
                                url: currentUser.url,
                                username: userData.username,
                                password: userData.password,
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                email: userData.email
                            }
        
                            UserModel.User.findByIdAndUpdate(currentUser._id, newUser).then(() => {
            
                                UserModel.User.findById(currentUser._id).then(data => {
            
                                    resolve({status: 200, message: 'User data updated succesfully', data: ''});

                                }).catch(error => {

                                    reject({status: 500, message: 'Error - ' + error});
                                });
                            }).catch(error => {
            
                                reject({status: 500, message: 'Error - ' + error});
                            });
                        }
            
        
                    }).catch(error => {
        
                        reject({status: 500, message: 'Error - ' + error});
                    });
                    
                }
                else{

                    reject({status: 500, message: 'Error - Username already taken.'});
                }
                
            }).catch(error => {

                reject({status: 500, message: 'Error - ' + error});
            });

            
        });
    }

    this.authenticateUser = (username, code, hashCode, cipher) => {

        return new Promise((resolve, reject) => {


            this.findUserByUsername(username).then(data => {

                
                const expectedHashCode = crypto.createHash('sha256').update(code + data.data.password).digest('hex');

                if(expectedHashCode != hashCode ){

                    reject({status: 500, message: 'Authentication failed. Password hash comparison failed'});
                
                }else{
                    
                    const privateKey = data.data.privateKey;
                    var privateKeyTemp = cryptico.RSAKey();
                    var privateKeyTemp = cryptico.RSAKey.parse(privateKey);

                    const decrypted = cryptico.decrypt(cipher, privateKeyTemp);

                    if(decrypted.status == "success"){

                        resolve({status: 200, message: 'Authentication successful', data: decrypted.plaintext});
                    }
                    else{
                        reject({status: 500, message: 'Authentication unsuccessful. Decryption unsuccessful'});
                    }
                }


            }).catch(error => {

                console.log('Error retrieving user data ' + error);
                reject({status: 500, message: 'Error retrieving user data - ' + error});
            });
            
        });
    };
}

module.exports = new UserService();