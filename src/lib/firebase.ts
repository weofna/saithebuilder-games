import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrz89ea5hamAolHVDaJBeuB5WtToLQ4sE",
  authDomain: "saithebuilder.firebaseapp.com",
  projectId: "saithebuilder",
  storageBucket: "saithebuilder.firebasestorage.app",
  messagingSenderId: "636049396468",
  appId: "1:636049396468:web:9ec7a46e467725d4a504a1",
  measurementId: "G-YY2WD7W1Q9",
};

export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
