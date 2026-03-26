import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFi-O1ZwheHDJSImmtysb46vsJesgfYPk",
  authDomain: "expensetracker-e2c2d.firebaseapp.com",
  projectId: "expensetracker-e2c2d",
  storageBucket: "expensetracker-e2c2d.firebasestorage.app",
  messagingSenderId: "552887560228",
  appId: "1:552887560228:web:409ec3dca043eda2c290b1",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);


export const db = getFirestore(app);

