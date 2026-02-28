// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADJPo270xFJWb4LvdwsT0bFfBX6ZmRwEk",
  authDomain: "website-7e897.firebaseapp.com",
  projectId: "website-7e897",
  storageBucket: "website-7e897.firebasestorage.app",
  messagingSenderId: "519082781158",
  appId: "1:519082781158:web:6bfe071df3173616bc4e27",
  measurementId: "G-0G5X9GDDLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };
