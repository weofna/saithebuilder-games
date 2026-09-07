import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC-_xvVIYEsv4wiilfk2Z6TovS2lzaBGAs",
  authDomain: "games1-c664b.firebaseapp.com",
  projectId: "games1-c664b",
  storageBucket: "games1-c664b.firebasestorage.app",
  messagingSenderId: "281575736561",
  appId: "1:281575736561:web:7bc736705e996f7db55550",
  measurementId: "G-RZM53DL95X",
};

export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
