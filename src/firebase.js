// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD95VWz3YsYaJEOiMp0xJv7Ly0Q1RNIX48",
  authDomain: "postly-ffd61.firebaseapp.com",
  projectId: "postly-ffd61",
  storageBucket: "postly-ffd61.appspot.com",
  messagingSenderId: "653579097268",
  appId: "1:653579097268:web:61086a60a0aa6b4cc773e1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Em ambiente de desenvolvimento, conecte-se ao Storage Emulator para evitar CORS
if (import.meta.env.DEV) {
  // Certifique-se de ter inicializado o emulador: firebase emulators:start --only storage
  connectStorageEmulator(storage, 'localhost', 9199);
}
