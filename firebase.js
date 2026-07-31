// ==============================
// FIREBASE IMPORTS
// ==============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
getFirestore,
collection,
getDocs,
addDoc,
doc,
updateDoc,
deleteDoc,
serverTimestamp,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ==============================
// FIREBASE CONFIG
// ==============================

const firebaseConfig = {

apiKey: "AIzaSyCbueiyZTyBmjGbCFp8OHtTbl80Q97HLV4",

authDomain: "fresh-fruit-basket.firebaseapp.com",

projectId: "fresh-fruit-basket",

storageBucket: "fresh-fruit-basket.firebasestorage.app",

messagingSenderId: "536643836290",

appId: "1:536643836290:web:788a35aefd7051538ed79b",

measurementId: "G-RYVKQFMLXR"

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
    signOut,
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy
};