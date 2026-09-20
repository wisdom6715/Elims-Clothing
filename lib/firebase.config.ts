import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAarOolYHXu23X9ckMZKogj4r4jJrWmgyA",
  authDomain: "elims-clothing.firebaseapp.com",
  projectId: "elims-clothing",
  storageBucket: "elims-clothing.firebasestorage.app",
  messagingSenderId: "468829536736",
  appId: "1:468829536736:web:2fbbe711feb2ceb8a5ab85",
  measurementId: "G-JR97DB8FR1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);