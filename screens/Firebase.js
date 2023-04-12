// Import the functions you need from the SDKs you need
import *  as firebase from "firebase";
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
let app;
if(firebase.apps.length == 0) {
    app = firebase.initializeApp(firebaseConfig); }
 else {
    app = firebase.app;
 }

 const auth = firebase.auth();

 export {auth};