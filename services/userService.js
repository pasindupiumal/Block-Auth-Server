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
    }
}

module.exports = new UserService();