import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB85Lk_p5D-MsKFJ9_p0JHrMGRBwe_-OZE",
  authDomain: "shopcart-8ec10.firebaseapp.com",
  projectId: "shopcart-8ec10",
  storageBucket: "shopcart-8ec10.firebasestorage.app",
  messagingSenderId: "870610317387",
  appId: "1:870610317387:web:b0550a456de84f6b665dce",
  measurementId: "G-CR1YES0M9K"
};

// Initialize Firebase securely ensuring it doesn't double-initialize on Next.js fast refreshes
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Setup Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, auth, googleProvider, facebookProvider };
