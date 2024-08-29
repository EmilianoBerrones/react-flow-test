// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGK1BL0n4t_L_53iKZ40U1ozIKHf6-GaI",
    authDomain: "yorkuassurance.firebaseapp.com",
    projectId: "yorkuassurance",
    storageBucket: "yorkuassurance.appspot.com",
    messagingSenderId: "997144539474",
    appId: "1:997144539474:web:ba786fe11fa7e50b530a8b",
    measurementId: "G-2B5DVNB9HH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
