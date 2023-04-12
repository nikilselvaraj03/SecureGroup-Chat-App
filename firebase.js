// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAzPqQ-03HSU6rWbbmSuhQDVfOhaxjIJ6o",
  authDomain: "topdeck-32685.firebaseapp.com",
  projectId: "topdeck-32685",
  storageBucket: "topdeck-32685.appspot.com",
  messagingSenderId: "704711820446",
  appId: "1:704711820446:web:48aeedd9c647f93711e78f",
  measurementId: "G-97VSPF0RBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};