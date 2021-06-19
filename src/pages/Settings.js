import React, { useContext, useState, useEffect } from 'react';
import ModalEditUser from '../components/BootModalEditUsername';
import ModalEditPass from '../components/BootModalEditPassword';
import { Row, Col, Spinner } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import firebase from '../utils/firebase';

export default function Settings() {
    const { currentUser } = useContext(AuthContext);
    const db = firebase.firestore();
    const [groupCode, setGroupCode] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
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
                    setLoading(false)
                }
                else {
                    initiateGroupCode();
                    initiateUsername('Anonymous-Bear');
                    setLoading(false);
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
        <>
            <Row className='p-2 text-center border-top border-dark'>
                
                <Col xs={12}>
                    <h1 className='settings-h1'>Account Settings</h1>
                </Col>

                <Col xs={12}>
                    {loading ?
                        <Spinner animation="border" role="status" />
                        :
                        <p className='settings-p'>Username: {username}</p>}
                </Col>

                <Col md={8} className='mr-auto ml-auto'>
                    <ModalEditUser username={username} initiateUsername={initiateUsername} loading={loading} setLoading={setLoading} />
                </Col>

                <Col md={8} className='mr-auto ml-auto'>
                    <ModalEditPass loading={loading} setLoading={setLoading} />
                </Col>

            </Row>

            <Row className='p-2 text-center border-top border-dark'>

                <Col xs={12}>
                    <h1 className='settings-h1'>Group Code</h1>
                </Col>

                <Col xs={12}>
                    {loading ?
                        <Spinner animation="border" role="status" />
                        :
                        <p className='settings-p'>{groupCode}</p>}
                </Col>

            </Row>
        </>
    )
}
