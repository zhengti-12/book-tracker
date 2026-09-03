import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsOIXNXmp1868pollJSIncjbJLzNKDn2Y",
  authDomain: "book-tracker-e7790.firebaseapp.com",
  projectId: "book-tracker-e7790",
  storageBucket: "book-tracker-e7790.firebasestorage.app",
  messagingSenderId: "430877932855",
  appId: "1:430877932855:web:643837ae171bb872e46eb2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);