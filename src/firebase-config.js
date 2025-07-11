// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// 🔐 Dane konfiguracyjne Firebase projektu
const firebaseConfig = {
  apiKey: "AIzaSyDD8dWivFZ-5k21Dzu550PzBe3nk7ygTa8",
  authDomain: "foxorox-firebase.firebaseapp.com",
  projectId: "foxorox-firebase",
  storageBucket: "foxorox-firebase.appspot.com",
  messagingSenderId: "301343245724",
  appId: "1:301343245724:web:fb072c37c1188c01b3b459",
  measurementId: "G-8X56DX0V0T"
};

// ✅ Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Inicjalizacja autoryzacji + Google & Facebook Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
