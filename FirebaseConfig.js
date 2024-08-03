import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDuTTkMEuo9lbw8_EEn_iQ3R9jMLlYfuDU",
  authDomain: "mycrudshopsbook.firebaseapp.com",
  projectId: "mycrudshopsbook",
  storageBucket: "mycrudshopsbook.appspot.com",
  messagingSenderId: "922762553677",
  appId: "1:922762553677:web:256fae3afb39425ef9ef04",
  measurementId: "G-ZRMQHML7GQ",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(FIREBASE_APP);
const storage = getStorage(FIREBASE_APP);

export { db, storage };
