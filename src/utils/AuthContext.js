import React, { useEffect, useState } from 'react';
import firebase from './firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  // Default setting is ' ' so the app will initiate react-firebase-hooks useDocumentData call
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);

  const db = firebase.firestore();
  const userRef = db.collection('users').doc(currentUser.uid)

  const randomData = ['name1', 'name2', 'name3']

  const setUsername = (username) => {
    userRef.set({
      displayName: username
    }, { merge: true })
      .then(() => { console.log('Username saved!') })
      .catch((error) => { console.error('Error creating code: ', error) });
  }

  const randomUsername = () => {
    return randomData[Math.floor(Math.random() * randomData.length)]
  }

  const setGroupCode = () => {
    const alphabet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ1234567890'
    let code = '';
    for (let i = 0; i < 3; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
      code += Math.floor(Math.random() * 10);
    }
    userRef.set({
      code: code
    }, { merge: true })
      .then(() => { console.log('Code created!') })
      .catch((error) => { console.error('Error creating code: ', error) });
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
              
        setCurrentUser(user);
        setLoading(false);
      } else {
        // No user is signed in.
        console.log('signed out')
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [])


  return (
    <AuthContext.Provider
      value={{ currentUser, randomData, setUsername, setGroupCode, randomUsername, userRef }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
