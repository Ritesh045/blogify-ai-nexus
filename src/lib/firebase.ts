
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBJV8XuRrSgb8cWzHHG2BlK9xywfGw9kPg",
  authDomain: "ai-blog-demo.firebaseapp.com",
  projectId: "ai-blog-demo",
  storageBucket: "ai-blog-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
