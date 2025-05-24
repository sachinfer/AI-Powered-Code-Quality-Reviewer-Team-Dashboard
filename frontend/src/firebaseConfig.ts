// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPmtPXhpkc6IGuIn1jypnNDQdHVVu8lCI",
  authDomain: "chat-app-d65d6.firebaseapp.com",
  projectId: "chat-app-d65d6",
  storageBucket: "chat-app-d65d6.firebasestorage.app",
  messagingSenderId: "879019427393",
  appId: "1:879019427393:web:875a02d9e7e23fa5e068c0",
  measurementId: "G-DZE86Z266N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 