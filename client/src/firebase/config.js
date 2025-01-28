import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfdgJqYsURgiOhoRl0deLD2rv5cJNL8pM",
  authDomain: "adaptivetestai.firebaseapp.com",
  projectId: "adaptivetestai",
  storageBucket: "adaptivetestai.firebasestorage.app",
  messagingSenderId: "865009733582",
  appId: "1:865009733582:web:8eac686c3993c2f29f659f",
  measurementId: "G-4LTB5S4E3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 