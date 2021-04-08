// Importing firebase SDK
import firebase from 'firebase/app';
// Importing firestore database
import 'firebase/firestore';
// Importing firebase user authentication
import 'firebase/auth';

// Configuration for firebase
// NEED NEW HIDDEN KEYS BEFORE GOING TO PRODUCTION
const firebaseConfig = {
    apiKey: "AIzaSyBr9csPLKYWZhRzkmWzE-iDUofw1tK03nY",
    authDomain: "partyloot-6299f.firebaseapp.com",
    projectId: "partyloot-6299f",
    storageBucket: "partyloot-6299f.appspot.com",
    messagingSenderId: "389228486252",
    appId: "1:389228486252:web:2e0caa7d3144a1a8d6c249"
  };
  const app = firebase.initializeApp(firebaseConfig);
  // var db = firebase.firestore(fbApp)

  export default app