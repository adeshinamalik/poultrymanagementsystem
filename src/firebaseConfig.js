// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIDyzy0Vqe1hcT6Kf1W7yMt6x9L-MYlSQ",
  authDomain: "poultrymanagement-2b961.firebaseapp.com",
  projectId: "poultrymanagement-2b961",
  storageBucket: "poultrymanagement-2b961.appspot.com",
  messagingSenderId: "535661216536",
  appId: "1:535661216536:web:c7e8f6aaf0d912197cd46d",
  measurementId: "G-6KNXYL3JCF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const database = getDatabase(app);

export default database;