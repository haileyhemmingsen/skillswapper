// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrLSIqV5jsFoUo3cEFJh-K8brzcliVL-0",
  authDomain: "skillswapper-ucsc.firebaseapp.com",
  projectId: "skillswapper-ucsc",
  storageBucket: "skillswapper-ucsc.appspot.com",
  messagingSenderId: "528591904435",
  appId: "1:528591904435:web:57cdf2f269f77fa5a01ac6",
  measurementId: "G-DZ9BHFCWGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);