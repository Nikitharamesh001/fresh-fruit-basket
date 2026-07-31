// ==============================
// FIREBASE IMPORTS
// ==============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
getFirestore,
collection,
getDocs,
addDoc,
doc,
updateDoc,
deleteDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ==============================
// FIREBASE CONFIG
// ==============================

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT.firebaseapp.com",

projectId: "YOUR_PROJECT_ID",

storageBucket: "YOUR_PROJECT.firebasestorage.app",

messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

appId: "YOUR_APP_ID",

measurementId: "YOUR_MEASUREMENT_ID"

};


// ==============================
// INITIALIZE FIREBASE
// ==============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==============================
// EXPORTS
// ==============================

export {

app,

auth,

db,

onAuthStateChanged,

collection,

getDocs,

addDoc,

doc,

updateDoc,

deleteDoc,

serverTimestamp

};