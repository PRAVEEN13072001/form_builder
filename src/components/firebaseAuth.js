// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-G4sC-_MZQOwP5D2hjVdxxq80bskFR8U",
  authDomain: "form-builder-6392a.firebaseapp.com",
  projectId: "form-builder-6392a",
  storageBucket: "form-builder-6392a.appspot.com",
  messagingSenderId: "452633661226",
  appId: "1:452633661226:web:3d2bfe03826bd79ff9d853",
  measurementId: "G-CV5WMPSTBL"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default app;
