
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCek9etgw95yCB_v9m5s7GdpZwv1Opqm9g",
  authDomain: "medicareapp-40c84.firebaseapp.com",
  databaseURL: "https://medicareapp-40c84-default-rtdb.firebaseio.com",
  projectId: "medicareapp-40c84",
  storageBucket: "medicareapp-40c84.firebasestorage.app",
  messagingSenderId: "962792917904",
  appId: "1:962792917904:web:e6be43773f5956e9898115",
  measurementId: "G-8HEJYBDXXV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
console.log('Firebase initialized:', { app, db, auth });
export { app, db, auth };  // Add auth to exports

