import React, { useEffect, useState } from 'react';
import firebase from './firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
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
        value={{currentUser}}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}
