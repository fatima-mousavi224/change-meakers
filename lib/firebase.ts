// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAulecdlFMOWDm7QjJiyTG0atcw9JtIwGc",
  authDomain: "change-makers-bc230.firebaseapp.com",
  projectId: "change-makers-bc230",
  storageBucket: "change-makers-bc230.appspot.com",
  messagingSenderId: "169621300059",
  appId: "1:169621300059:web:4ba806fb62666fc2c5f07e",
  measurementId: "G-3GSSTGLBZV",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export default firebaseApp;
