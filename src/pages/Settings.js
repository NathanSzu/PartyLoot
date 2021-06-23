import React, { useContext, useState, useEffect } from 'react';
import ModalEditUser from '../components/BootModalEditUsername';
import ModalEditPass from '../components/BootModalEditPassword';
import { Row, Col, Spinner } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function Settings() {
    const { currentUser, userRef } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [userData] = useDocumentData(userRef);

    useEffect(() => {
        console.log(currentUser.uid)
        userData && console.log('settings userdata', userData.code)
    }, [userData])

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
                    <ModalEditUser loading={loading} setLoading={setLoading} />
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
