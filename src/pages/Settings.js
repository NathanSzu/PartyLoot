import React, { useContext, useState } from 'react';
import ModalEditUser from '../components/ModalEditUsername';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import app from '../utils/firebase'

export default function Settings() {
    const { currentUser, userRef } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const [userData] = useDocumentData(userRef);

    const passwordReset = (email) => {
        setLoading(true);
        app.auth().sendPasswordResetEmail(email).then(function () {
            // Email sent.
            setResetEmailSent(true);
            setLoading(false);
        }).catch(function (error) {
            // An error happened.
            setLoading(false);
        });
    }

    return (
        <Row className='texture-backer'>
            <div className='p-2 m-0 w-100 text-center border-top border-dark'>

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
                    <ModalEditUser loading={loading} setLoading={setLoading} userData={userData}/>
                </Col>

                <Col md={8} className='mr-auto ml-auto'>
                    <Button className='w-100' disabled={loading} variant="dark" type="submit" onClick={(e) => { e.preventDefault(); passwordReset(currentUser.email) }} >
                        Reset password!
                    </Button>
                    {
                        !resetEmailSent ? null :
                            <Alert variant={'success'}>Your email has been sent. Please check your inbox!</Alert>
                    }
                </Col>

            </div>

            <div className='p-2 w-100 text-center border-top border-dark'>

                <Col xs={12}>
                    <h1 className='settings-h1'>Group Code</h1>
                </Col>

                <Col xs={12}>
                    {loading ?
                        <Spinner animation="border" role="status" />
                        :
                        <p className='settings-p'>{userData && userData.code}</p>}
                </Col>

            </div>
        </Row>
    )
}
