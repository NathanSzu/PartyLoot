import React, { useState, useContext, useRef } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { AuthContext } from '../utils/contexts/AuthContext';
import { GlobalFeatures } from '../utils/contexts/GlobalFeatures';
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import fb from 'firebase';

export default function ModalAppRequest() {
    const { currentUser, userRef, db } = useContext(AuthContext);
    const { showRequestModal, handleCloseRequestModal } = useContext(GlobalFeatures);
    const [action, setAction] = useState('...');
    const [userMsg, setUserMsg] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData] = useDocumentDataOnce(userRef);

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const actionRef = useRef(null);
    const descriptionRef = useRef(null);

    const actionSwitcher = () => {
        if (actionRef.current.value === '0') setAction('...')
        if (actionRef.current.value === 'Request a Feature') setAction('feature')
        if (actionRef.current.value === 'Report a Bug') setAction('bug')
    }

    const clearModal = () => {
        setAction('...');
        setStatus(null);
        setUserMsg('');
        setLoading(false);
    }

    const submit = (e) => {
        e.preventDefault()
        if (!usernameRef.current.value || !emailRef.current.value || actionRef.current.value === '0' || !descriptionRef.current.value) {
            setUserMsg('All fields are required!');
            setStatus('danger');
            return
        }
        setLoading(true);
        db.collection('communications').doc().set({
            username: usernameRef.current.value,
            email: emailRef.current.value,
            action: actionRef.current.value,
            description: descriptionRef.current.value,
            sent: fb.firestore.FieldValue.serverTimestamp()
        })
            .then(() => {
                setUserMsg('Message sent!');
                setStatus('success');
                const killModal = setTimeout(() => {
                    handleCloseRequestModal();
                    clearModal();
                }, 3500)
                return () => {
                    clearTimeout(killModal);
                };
            })
            .catch((error) => {
                console.log("Error creating new group: ", error);
                setLoading(false);
                setUserMsg('Unknown error, please try again.');
                setStatus('danger');
            });
    }

    return (
        <>
            {/* <Button variant='dark' className='p-2 mb-2 w-100 background-dark border-0' onClick={handleShow}>Request Feature / Report Bug</Button> */}

            <Modal show={showRequestModal} onHide={() => { handleCloseRequestModal(); clearModal(); }}>
                <Form className='texture-backer'>
                    <Modal.Header closeButton>
                        <Modal.Title>Request Feature / Report Bug</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId="Username">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" ref={usernameRef} defaultValue={userData && userData.displayName} />
                        </Form.Group>
                        <Form.Group controlId="Username">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" ref={emailRef} defaultValue={currentUser && currentUser.email} />
                        </Form.Group>
                        <Form.Group controlId="Action">
                            <Form.Label>What would you like to do?</Form.Label>
                            <Form.Control as="select" ref={actionRef} aria-label="Request/Report Select Menu" onChange={actionSwitcher}>
                                <option value="0">---</option>
                                <option value="Request a Feature">Request a Feature</option>
                                <option value="Report a Bug">Report a Bug</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="Description">
                            <Form.Label>{`Describe your ${action}`}</Form.Label>
                            <Form.Control as="textarea" ref={descriptionRef} placeholder="Please be as descriptive as possible!" />
                        </Form.Group>
                        <Form.Group>
                            {userMsg && <Alert variant={status && status}>{userMsg}</Alert>}
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className='justify-content-between'>

                        <Button disabled={loading} variant="dark" className='background-dark border-0' type="submit" onClick={submit} >
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}