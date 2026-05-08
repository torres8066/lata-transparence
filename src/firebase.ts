import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsiKdHQDTkj61v0wj6VYSCP1c1xiawDuA",
  authDomain: "lata-garage-db-5997d.firebaseapp.com",
  projectId: "lata-garage-db-5997d",
  storageBucket: "lata-garage-db-5997d.firebasestorage.app",
  messagingSenderId: "353664380120",
  appId: "1:353664380120:web:355b3ff5d5cc7d8896fbad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);