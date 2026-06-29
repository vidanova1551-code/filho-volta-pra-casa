import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg1NUa_ar4dFYuQSl36lPe5aaWUp60H3Q",
  authDomain: "filho-volta-pra-casa.firebaseapp.com",
  projectId: "filho-volta-pra-casa",
  storageBucket: "filho-volta-pra-casa.firebasestorage.app",
  messagingSenderId: "113789852901",
  appId: "1:113789852901:web:7d298b1527d5b7806f880c",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);