import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,

} from "firebase/auth";

// import serviceAccount from "./ChaveAcesso.json";

admin.initializeApp();
const db = admin.firestore();


const firebaseConfig = {
    apiKey: process.env.FB_API_KEY || "PUT_IN_A_DUMMY_KEY",
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);


export {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    admin,
    db,
};
