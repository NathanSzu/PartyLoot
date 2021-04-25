import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../utils/AuthContext';
import firebase from '../utils/firebase';

export default function Settings() {
    const { currentUser } = useContext(AuthContext);
    const db = firebase.firestore();

    useEffect(() => {
        db.collection('users').doc(`${currentUser.uid}`)
            .onSnapshot((doc) => {
                console.log('Current data: ', doc.data());
            });
    }, [])

    const initiateUsername = () => {

    }

    const initiateGroupCode = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let code = '';
        for (let i = 0; i < 2; i++) {
            code += alphabet[Math.floor(Math.random() * alphabet.length)];
            code += Math.floor(Math.random() * 10);
        }
        db.collection('users').doc(`${currentUser.uid}`).set({code: code})
        .then(() => {console.log('Code created!')})
        .catch((error) => {console.error('Error creating code: ', error)});
    }

    return (
        <div>
            <button>test</button>
        </div>
    )
}
