//Variable declarations
let loginForm = "";
let registrationForm = "";
let btnDiv = "";
let formBox = "";
let publicKey = "";
let userUrl = "";

//Operations to be performed once the document is ready.
$(document).ready(function() {

    loginForm = document.getElementById("loginForm");
    registerForm = document.getElementById("registerForm");
    btnDiv = document.getElementById("btn");
    formBox = document.getElementById("form-box");

    const url = new URL(window.location.href);
    const action = url.searchParams.get("action");

    if(action == "register"){

        registerButton();
    }

});

//Method for managing transitions for user interface.
function registerButton() {

    loginForm.style.left = "-400px";
    registerForm.style.left = "78px";
    btnDiv.style.left = "110px";
    formBox.style.height = "710px";
    getRSAKeys();
}

//Method for managing transitions for user interface.
function loginButton() {

    loginForm.style.left = "78px";
    registerForm.style.left = "450px";
    btnDiv.style.left = "0";
    formBox.style.height = "480px";
}


function login(){

    const username = $("#loginUsername").val();
    const password = $("#loginPassword").val();
    const url = new URL(window.location.href);
    const redirect = url.searchParams.get("redirect");

    console.log("Redirect link: " + redirect);

    $.post('/blockauth/url', {username: username}).then(data => {

        if(!data.data){
            toastr.error("Username is not registered");
            return;
        }
        else{

            const code = Math.ceil(Math.random() * 1000);
            const token = CryptoJS.SHA256(code.toString()+CryptoJS.SHA256(password).toString()).toString();

            $.get(redirect + "?code=" + code + "&hashcode=" + token + "&username=" + username).then(data => {

                usernameFromChain = data.data;

                if (data.data.status === true){

                    toastr.success("Login successful");
                    window.location.href = data.data.to;
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

//Method for performing registration of new users.
function register() {

    //Obtain values user provided for input fields.
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var email = $("#email").val();
    var username = $("#username").val();
    var password1 = $("#password1").val();
    var password2 = $("#password2").val();
    var validUsername = /^[a-z0-9\.\_]+$/i.test( username );

    var valid = true;

    //Perform form validation for data inserted.
    if( !firstName ){
        toastr.error("First name field cannot be empty");
        valid = false;
    }
    if( !lastName ){
        toastr.error("Last name field cannot be empty");
        valid = false;
    }
    if( !email ){
        toastr.error("Email field cannot be empty");
        valid = false;
    }
    if( !username ){
        toastr.error("Username field cannot be empty");
        valid = false;
    }
    if( !password1 ){
        toastr.error("Password field cannot be empty");
        valid = false;
    }
    if( !password2 ){
        toastr.error("Confirm password field cannot be empty");
        valid = false;
    }
    if( username && !validUsername ){
        toastr.error("Username can have only alpha numeric characters, . and _");
        valid = false;
    }
    if( (password1 && password2) && (password1 != password2)){
        toastr.error("Passwords don't match");
        valid = false;
    }
    if(publicKey == "" || userUrl == ""){
        valid = false;
        toastr.error("Generating a new set of RSA keys. Please try after a few seconds.");
    }
    if( !valid ){
        return;
    }


    var usernameFromChain = "";



    //Check username availability status.
    $.get("/blockauth/username?username=" + username).then(data => {

        usernameFromChain = data.data;

        if (usernameFromChain == true){

            //Incase the selected username is available. Proceed with the registration process.
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

        //Hash the password prior to transmissions between API calls.
        const password = CryptoJS.SHA256(password1).toString();

        //Provide the necessary parameters and invoke the relevant blockauth endpoint to add the new user data to the blockchain.
        $.post('/blockauth/user', {username: username, url: userUrl, publicKey: publicKey}).then( response1 => {

            //In case of a successful trnascation. Proceed with the registration and persist the private data in the MongoDB database.
            console.log('Insert new user transaction successful');

            $.post('/users/', {username: username, password: password, publicKey: publicKey, firstName: firstName, lastName: lastName, email: email}).then( response2 => {

                //In case of a successful registration. Notify the user and redirect to the login page.
                $('#registerForm').trigger('reset');
                toastr.success("Registration successful");
                loginButton();
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


//Function to generate a new set of RSA keys for new users.
function getRSAKeys() {

    //Invoke the REST endpoint responsible for the RSA key generation and obtain the releavant key data.
    $.get("/keys/").then(data => {

        publicKey = data.data.publicKey;
        userUrl = data.data.url;

    }).catch(erro => {
        console.log('Error retrieving keys - ' + error);
    });
}

