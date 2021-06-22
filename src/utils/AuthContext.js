import React, { useEffect, useState } from 'react';
import { useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import firebase from './firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const db = firebase.firestore();
  // Default setting is ' ' so the app will initiate react-firebase-hooks useDocumentData call
  const [currentUser, setCurrentUser] = useState(' ');
  const [loading, setLoading] = useState(true);
  const [userData] = useDocumentData(db.collection('users').doc(currentUser.uid));
  const [randomData] = useDocumentDataOnce(db.collection('random-data').doc('identification'));

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setCurrentUser(user);
        setLoading(false);
      } else {
        // No user is signed in.
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [])


  return (
    <AuthContext.Provider
      value={{ currentUser, userData, randomData }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
