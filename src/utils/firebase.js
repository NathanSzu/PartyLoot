// Importing firebase SDK
import firebase from 'firebase/app';
// Importing firestore database
import 'firebase/firestore';
// Importing firebase user authentication
import 'firebase/auth';

// Configuration for firebase
// NEED NEW HIDDEN KEYS BEFORE GOING TO PRODUCTION
const firebaseConfig = {
	apiKey: 'AIzaSyDNZIpJQJeKFGSZXmC-Jtn8wpJg2Nf-95Y',
	authDomain: 'party-loot-tracker.firebaseapp.com',
	projectId: 'party-loot-tracker',
	storageBucket: 'party-loot-tracker.appspot.com',
	messagingSenderId: '589283233009',
	appId: '1:589283233009:web:4a1cd797c52177c5ab6d50'
};
const app = firebase.initializeApp(firebaseConfig);
// var db = firebase.firestore(fbApp)

export default app;
