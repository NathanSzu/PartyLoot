import React, { useContext, useState, useEffect } from 'react';
import ModalEditUser from '../components/BootModalEditUsername';
import ModalEditPass from '../components/BootModalEditPassword';
import { Row, Col, Spinner } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import firebase from '../utils/firebase';

export default function Settings() {
    const { currentUser, userData, randomData } = useContext(AuthContext);
    const db = firebase.firestore();
    const [groupCode, setGroupCode] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        randomData && console.log(randomData.usernames)
    }, [randomData])

    useEffect(() => {
        setLoading(true)

        console.log('Current data: ', userData);
        if (userData) {
            userData.code && setGroupCode(userData.code);
            userData.displayName && setUsername(userData.displayName);
            setLoading(false)
        }
    }, [userData])

    const initiateGroupCode = () => {
        const alphabet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ1234567890'
        let code = '';
        for (let i = 0; i < 3; i++) {
            code += alphabet[Math.floor(Math.random() * alphabet.length)];
            code += Math.floor(Math.random() * 10);
        }
        db.collection('users').doc(currentUser).set({ code: code }, { merge: true })
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
                        <p className='settings-p'>Username: {userData && userData.displayName}</p>}
                </Col>

                <Col md={8} className='mr-auto ml-auto'>
                    <ModalEditUser username={userData && userData.displayName} loading={loading} setLoading={setLoading} />
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
                        <p className='settings-p'>{userData && userData.code}</p>}
                </Col>

            </Row>
        </>
    )
}
