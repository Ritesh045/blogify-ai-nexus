
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkTJoWxJa_KyG0EZGrU-Jx5hgN6DMPxIs",
  authDomain: "blogify-ai-app.firebaseapp.com",
  projectId: "blogify-ai-app",
  storageBucket: "blogify-ai-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
