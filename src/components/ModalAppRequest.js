import React, { useState, useContext, useRef } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { AuthContext } from '../utils/contexts/AuthContext';
import { GlobalFeatures } from '../utils/contexts/GlobalFeatures';

export default function ModalEditUsername({ loading, setLoading, userData }) {
    const { currentUser } = useContext(AuthContext);
    const { showRequestModal, handleCloseRequestModal } = useContext(GlobalFeatures);
    const [action, setAction] = useState('...');
    const [errorMsg, setErrorMsg] = useState('');
    
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const actionRef = useRef(null);
    const descriptionRef = useRef(null);

    const actionSwitcher = () => {
        if (actionRef.current.value === '0') setAction('...')
        if (actionRef.current.value === '1') setAction('feature')
        if (actionRef.current.value === '2') setAction('bug')
    }

    const submit = (e) => {
        e.preventDefault()
        console.log('clicked')
    }

    return (
        <>
            {/* <Button variant='dark' className='p-2 mb-2 w-100 background-dark border-0' onClick={handleShow}>Request Feature / Report Bug</Button> */}

            <Modal show={showRequestModal} onHide={() => { handleCloseRequestModal() }}>
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
                                <option value="1">Request a Feature</option>
                                <option value="2">Report a Bug</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="Description">
                            <Form.Label>{`Describe your ${action}`}</Form.Label>
                            <Form.Control as="textarea" ref={descriptionRef} placeholder="Please be as descriptive as possible!" />
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