const UserModel = require('../models/user');

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

    this.updateUsernameAndPassword = (userData) => {

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
                                password: userData.password
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

            
        })
    }
}

module.exports = new UserService();