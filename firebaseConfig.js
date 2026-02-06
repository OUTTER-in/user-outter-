// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9DsXnSxN1PkvgbpNLEVF4U4I7OXfo_0s",
  authDomain: "outter-2a9e1.firebaseapp.com",
  projectId: "outter-2a9e1",
  storageBucket: "outter-2a9e1.firebasestorage.app",
  messagingSenderId: "981767713194",
  appId: "1:981767713194:web:3449b7b3b06301301b3bd3",
  measurementId: "G-B4TJNMMK8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);