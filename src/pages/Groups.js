import React, { useEffect } from 'react';
import firebase from '../utils/firebase';

export default function Groups() {
    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              console.log(user.email)
            } else {
              // No user is signed in.
            }
          });
    }, [])

    return (
        <div>
            groups
        </div>
    )
}
