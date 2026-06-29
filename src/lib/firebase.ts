import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtDD8ZdaGPRRrg9ZcaEJwx30g7HlE13XQ",
  authDomain: "gen-lang-client-0888844723.firebaseapp.com",
  projectId: "gen-lang-client-0888844723",
  storageBucket: "gen-lang-client-0888844723.firebasestorage.app",
  messagingSenderId: "1028361918749",
  appId: "1:1028361918749:web:eda499bd379ebe2ce869f4"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {}, "ai-studio-8272730c-be7c-4c44-a36d-cfa6ab57ac3c");
export const storage = getStorage(app);
