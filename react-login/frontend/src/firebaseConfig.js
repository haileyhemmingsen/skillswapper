// SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrLSIqV5jsFoUo3cEFJh-K8brzcliVL-0",
  authDomain: "skillswapper-ucsc.firebaseapp.com",
  projectId: "skillswapper-ucsc",
  storageBucket: "skillswapper-ucsc.appspot.com",
  messagingSenderId: "528591904435",
  appId: "1:528591904435:web:57cdf2f269f77fa5a01ac6",
  measurementId: "G-DZ9BHFCWGV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);