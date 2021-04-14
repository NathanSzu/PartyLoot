import React, { useEffect, useState } from 'react';
import firebase from './firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              setCurrentUser(user)
            } else {
              // No user is signed in.
            }
          });
    }, [])


    return (
        <AuthContext.Provider
        value={{currentUser}}
        >
            {children}
        </AuthContext.Provider>
    );
}
