// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcpsl5TfUJXlgtbG6XRZ_RKVqQhbbLIEg",
  authDomain: "prepwise-612dd.firebaseapp.com",
  projectId: "prepwise-612dd",
  storageBucket: "prepwise-612dd.firebasestorage.app",
  messagingSenderId: "528821818159",
  appId: "1:528821818159:web:548e9593eb49b9a3ee87da",
  measurementId: "G-X622ESLTXE"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig)  : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);