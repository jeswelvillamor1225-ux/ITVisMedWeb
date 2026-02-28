import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type AuthError,
  type User 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADJPo270xFJWb4LvdwsT0bFfBX6ZmRwEk",
  authDomain: "website-7e897.firebaseapp.com",
  projectId: "website-7e897",
  storageBucket: "website-7e897.firebasestorage.app",
  messagingSenderId: "519082781158",
  appId: "1:519082781158:web:6bfe071df3173616bc4e27",
  measurementId: "G-0G5X9GDDLM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };
export type { AuthError, User };
