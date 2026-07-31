import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(name === ""){
        alert("Enter your name");
        return;
    }

    if(password !== confirmPassword){
        alert("Passwords do not match");
        return;
    }

    try{

        const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log(userCredential.user);

        alert("Account Created Successfully 🎉");

        registerForm.reset();

        window.location.href="login.html";

    }

    catch(error){

        console.log(error);

        switch(error.code){

            case "auth/email-already-in-use":
                alert("Email already exists.");
                break;

            case "auth/invalid-email":
                alert("Invalid email.");
                break;

            case "auth/weak-password":
                alert("Password must be at least 6 characters.");
                break;

            default:
                alert(error.message);

        }

    }

});