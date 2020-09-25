$(document).ready(function() {

    
});

function signInBtnClick() {

    window.location.href = "http://localhost:3000/signin?redirect=http://localhost:3000/verify/";
}

function signUpBtnClick() {

    window.location.href = "http://localhost:3000/signin?redirect=http://localhost:3000/verify/&action=register";
}

function useCXBtnClick() {

    window.location.href = "http://localhost:3000/integrate";
}