import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-V67KGP5q7he_ugyYTJQHvfzx2BbeNWA",
  authDomain: "polyprojects-ff9f0.firebaseapp.com",
  projectId: "polyprojects-ff9f0",
  storageBucket: "polyprojects-ff9f0.appspot.com",
  messagingSenderId: "873075287581",
  appId: "1:873075287581:web:3c293f057c5cbf30aac8f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default { app, db };  
