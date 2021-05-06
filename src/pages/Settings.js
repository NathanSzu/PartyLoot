import React, { useContext, useState, useEffect } from 'react';
import BootModalEditUsername from '../components/BootModalEditUsername';
import BootModalEditPassword from '../components/BootModalEditPassword';
import { Row, Col } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import firebase from '../utils/firebase';

export default function Settings() {
    const { currentUser } = useContext(AuthContext);
    const db = firebase.firestore();
    const [groupCode, setGroupCode] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (currentUser.displayName) { setUsername(currentUser.displayName) }
        else {
            db.collection('random-data').doc('identification')
                .onSnapshot((doc) => {
                    initiateUsername(doc.data().usernames)
                    console.log('Current data: ', doc.data().usernames);
                });
        }

        db.collection('users').doc(`${currentUser.uid}`)
            .onSnapshot((doc) => {
                if (doc.data()) {
                    console.log('Current data: ', doc.data());
                    setGroupCode(doc.data().code);
                    setUsername(doc.data().displayName);
                }
                else {
                    initiateGroupCode();
                    initiateUsername('Anonymous-Bear');
                };
            });
    }, [currentUser])

    const initiateUsername = (name) => {
        setLoading(true)
        db.collection('users').doc(`${currentUser.uid}`).set({ displayName: name }, { merge: true })
            .then(() => {
                console.log('Display name updated!')
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error creating code: ', error)
                setLoading(false);
            });
    }



    const initiateGroupCode = () => {
        const alphabet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ1234567890'
        let code = '';
        for (let i = 0; i < 3; i++) {
            code += alphabet[Math.floor(Math.random() * alphabet.length)];
            code += Math.floor(Math.random() * 10);
        }
        db.collection('users').doc(`${currentUser.uid}`).set({ code: code }, { merge: true })
            .then(() => { console.log('Code created!') })
            .catch((error) => { console.error('Error creating code: ', error) });
    }

    return (
        <Row className='p-2 text-center'>
            <Col xs={12}>
                <h1>Username</h1>
            </Col>
            <Col xs={12}>
                <p>{username}</p>
            </Col>
            <Col md={8} className='mr-auto ml-auto'>
                <BootModalEditUsername username={username} initiateUsername={initiateUsername} loading={loading} setLoading={setLoading} />
            </Col>

            <Col xs={12}>
                <h1>Group Code</h1>
            </Col>
            <Col xs={12}>
                <p>{groupCode}</p>
            </Col>
            <Col md={8} className='mr-auto ml-auto'>
                <BootModalEditPassword loading={loading} setLoading={setLoading} />
            </Col>
        </Row>
    )
}
