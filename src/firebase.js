import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "chatapp-f284f.firebaseapp.com",
  projectId: "chatapp-f284f",
  storageBucket: "chatapp-f284f.appspot.com",
  messagingSenderId: "353302093217",
  appId: "1:353302093217:web:5e01e4758f296b10dc7fe0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth();
export const storage = getStorage();
