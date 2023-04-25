// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage,ref } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAzPqQ-03HSU6rWbbmSuhQDVfOhaxjIJ6o",
  authDomain: "topdeck-32685.firebaseapp.com",
  projectId: "topdeck-32685",
  storageBucket: "topdeck-32685.appspot.com",
  messagingSenderId: "704711820446",
  appId: "1:704711820446:web:48aeedd9c647f93711e78f",
  measurementId: "G-97VSPF0RBW",
  storageBucket:"gs://topdeck-32685.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {persistence: browserLocalPersistence});
const db = getFirestore(app);
const storage = getStorage(app);
const groupProfileRef = ref(storage,'group_profile');
const userProfileRef = ref(storage,'user_profile');
export {app}
export {auth};
export {db};
export{groupProfileRef}
export{userProfileRef}
