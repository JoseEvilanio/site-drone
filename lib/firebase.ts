
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAt7iEfgW48-rC9DZacYdTysjAd7NYcSjQ",
  authDomain: "app-barbearia-7e30a.firebaseapp.com",
  projectId: "app-barbearia-7e30a",
  storageBucket: "app-barbearia-7e30a.firebasestorage.app",
  messagingSenderId: "710904836521",
  appId: "1:710904836521:web:77e532518db94e063c14b8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
