let loginForm = "";
let registrationForm = "";
let btnDiv = "";
let formBox = "";
let publicKey = "";
let userUrl = "";

$(document).ready(function() {

    loginForm = document.getElementById("loginForm");
    registerForm = document.getElementById("registerForm");
    btnDiv = document.getElementById("btn");
    formBox = document.getElementById("form-box");

    getRSAKeys();

});


function registerButton() {

    loginForm.style.left = "-400px";
    registerForm.style.left = "78px";
    btnDiv.style.left = "110px";
    formBox.style.height = "710px";
}

function loginButton() {

    loginForm.style.left = "78px";
    registerForm.style.left = "450px";
    btnDiv.style.left = "0";
    formBox.style.height = "480px";
}

function login(){

    const username = $("#loginUsername").val();
    const password = $("#loginPassword").val();
    const redirect = "http://localhost:5000/users/authenticate";

    $.post('/blockauth/url', {username: username}).then(data => {

        if(!data.data){
            toastr.error("Username is not registered");
            return;
        }
        else{

            const code = Math.ceil(Math.random() * 1000);
            const token = CryptoJS.SHA256(code.toString()+CryptoJS.SHA256(password).toString()).toString();
            //window.location.href = redirect + "?code=" + code + "&hashcode=" + token + "&username=" + username;

            $.get(redirect + "?code=" + code + "&hashcode=" + token + "&username=" + username).then(data => {

                usernameFromChain = data.data;

                if (data.data == true){

                    window.location.href = "https://www.google.com";
                }
                else{

                    toastr.error("Invalid password");
                    return;
        
                }
    
        
            }).catch(error => {
        
                toastr.error("Error occured when validating credentials");
                return;
            }); 
            

        }

    }).catch(error => {

        toastr.error("Error validating username provided");
        console.log('Error retrieving user url: ' + error);
    });

}

function register() {

    var username = $("#username").val();
    var password1 = $("#password1").val();
    var password2 = $("#password2").val();
    var validUsername = /^[a-z0-9\.\_]+$/i.test( username );

    var valid = true;

    if( !validUsername ){
        toastr.error("Username can have only alpha numeric characters, . and _");
        valid = false;
    }
    if(password1 != password2){
        toastr.error("Passwords don't match");
        valid = false;
    }
    if(publicKey == "" || userUrl == ""){
        valid = false;
        toastr.error("Not yet ready. Please try after a few seconds.");
    }
    if( !valid ){
        return;
    }

    var usernameFromChain = "";



    //Check username availability status
    $.get("/blockauth/username?username=" + username).then(data => {

        usernameFromChain = data.data;

        if (usernameFromChain == true){
            
            addUser();

        }
        else{

            toastr.error("Username already taken");
            return;

        }

    }).catch(error => {

        toastr.error("Error retreving username availability status");
        console.log('Error retrieving keys - ' + error);
        return;
    }); 


    function addUser(){

        const password = CryptoJS.SHA256(password1).toString();                
    
        //console.log("Username: " + username);
        //console.log("Password: " + password1);
    
        $.post('/blockauth/user', {username: username, url: userUrl, publicKey: publicKey}).then( response1 => {
                            
            console.log('Insert new user transaction successful');
    
            $.post('/users/', {username: username, password: password, publicKey: publicKey}).then( response2 => {
                     
                toastr.success("Registration successful");
                return;
    
            }).catch(error =>{ 
    
                console.log('Database operation failed - ' + error);
                toastr.error("Registration unsuccessful. Database operation failed");
                return;
            });
                  
    
        }).catch( error => { 
    
            console.log('Error with new user blockchain transaction - ' + error);
            toastr.error("Registration unsuccessful. Transaction error");
            return;
    
        }); 
    
    
    }
}



function getRSAKeys() {

    $.get("/keys/").then(data => {

        publicKey = data.data.publicKey;
        userUrl = data.data.url;

        console.log('Public Key: ' + publicKey);
        console.log("\n");
        console.log(userUrl);

    }).catch(erro => {
        console.log('Error retrieving keys - ' + error);
    });
}

