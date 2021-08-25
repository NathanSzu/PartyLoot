import React, { useEffect, useState } from 'react';
import firebase from './firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  // Default setting is ' ' so the app will initiate react-firebase-hooks useDocumentData call
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);

  const db = firebase.firestore();
  const userRef = db.collection('users').doc(currentUser.uid)

  const randomAttr = ['Angry', 'Frustrated', 'Sad', 'Excited', 'Frightened', 'Prideful', 'Gloomy']

  const randomName = ['Wizard', 'Fighter', 'Warlock', 'Artificer', 'Rogue', 'Sorcerer', 'Monk', 'Druid', 'Bard', 'Barbarian', 'Cleric', 'Paladin', 'Ranger']

  const setUsername = (username) => {
    userRef.set({
      displayName: username
    }, { merge: true })
      .then(() => { console.log('Username saved!') })
      .catch((error) => { console.error('Error creating code: ', error) });
  }

  const randomUsername = () => {
    return `${randomAttr[Math.floor(Math.random() * randomAttr.length)]} ${randomName[Math.floor(Math.random() * randomName.length)]}`
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
      value={{ currentUser, randomName, setUsername, setGroupCode, randomUsername, userRef }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
