import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAzPqQ-03HSU6rWbbmSuhQDVfOhaxjIJ6o",
  authDomain: "topdeck-32685.firebaseapp.com",
  projectId: "topdeck-32685",
  storageBucket: "topdeck-32685.appspot.com",
  messagingSenderId: "704711820446",
  appId: "1:704711820446:web:48aeedd9c647f93711e78f",
  measurementId: "G-97VSPF0RBW"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export { firebase };