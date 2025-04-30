// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD95VWz3YsYaJEOiMp0xJv7Ly0Q1RNIX48",
  authDomain: "postly-ffd61.firebaseapp.com",
  projectId: "postly-ffd61",
  storageBucket: "postly-ffd61.firebasestorage.app", // Atualizado para o bucket correto
  messagingSenderId: "653579097268",
  appId: "1:653579097268:web:61086a60a0aa6b4cc773e1",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };