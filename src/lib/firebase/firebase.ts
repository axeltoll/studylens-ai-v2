import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8oP2UiFPLe2u-8IyvvAaxYZyd9jYQYnY",
  authDomain: "insightlens-ai.firebaseapp.com",
  projectId: "insightlens-ai",
  storageBucket: "insightlens-ai.firebasestorage.app",
  messagingSenderId: "146944652854",
  appId: "1:146944652854:web:0818df1fba9200526c0a97",
  measurementId: "G-00N29T4M50"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics - only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, analytics };
