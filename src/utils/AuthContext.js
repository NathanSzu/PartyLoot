import React, { useEffect, useState } from 'react';
import firebase from './firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              setLoading(false);
              // User is signed in.
              setCurrentUser(user)
            } else {
              // No user is signed in.
              setLoading(false);
            }
          });
    }, [])


    return (
        <AuthContext.Provider
        value={{currentUser}}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}
