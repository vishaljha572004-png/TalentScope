import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "talent-scope-12e8d.firebaseapp.com",
  projectId: "talent-scope-12e8d",
  storageBucket: "talent-scope-12e8d.firebasestorage.app",
  messagingSenderId: "679836513618",
  appId: "1:679836513618:web:da851ff2a78e4c5a50b68b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };