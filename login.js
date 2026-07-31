import { auth, onAuthStateChanged } from "./firebase.js";
import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// Already logged in?
onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "index.html";

    }

});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Login Successful 🎉");

        window.location.href = "index.html";

    }

    catch (error) {

        switch (error.code) {

            case "auth/invalid-credential":
                alert("Invalid email or password.");
                break;

            case "auth/user-not-found":
                alert("User not found.");
                break;

            case "auth/wrong-password":
                alert("Wrong password.");
                break;

            default:
                alert(error.message);

        }

    }

});