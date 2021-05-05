import React, { useState } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import firebase from '../utils/firebase';

export default function BootModalEditPassword({ loading, setLoading }) {
    const [password, setPassword] = useState(null);
    const [passwordValid, setPasswordValid] = useState('empty');
    const [passwordLengthValid, setPasswordLengthValid] = useState('empty');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const editPassword = () => {
        if (passwordValid && passwordLengthValid && password) {
            setLoading(true)
            firebase.auth().currentUser.updatePassword(password)
                .then(() => {
                    // Update successful.
                    console.log('update')
                    handleClose();
                    setLoading(false);
                }).catch((error) => {
                    // An error happened.
                    handleClose();
                    setLoading(false)
                    console.log(error)
                });
        }
    }

    const validatePassword = (e) => {
        if (e.target.value.length > 7) {
            setPasswordLengthValid(true)
        } else { setPasswordLengthValid(false) }
    }

    const validatePasswordMatch = (e) => {
        console.log(password, e.target.value)
        if (password !== e.target.value) {
            setPasswordValid(false)
        } else { setPasswordValid(true) }
    }

    return (
        <>
            <Button variant='dark' className='p-1 w-100 mt-2 mb-2' onClick={handleShow}>Change Password</Button>

            <Modal show={show} onHide={() => { handleClose() }}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId="Password">
                            <Form.Control type="password" placeholder="New Password" onChange={(e) => { setPassword(e.target.value); validatePassword(e) }} />
                            {passwordLengthValid ? null : <Alert variant={'warning'}>Must be at least 8 characters!</Alert>}
                        </Form.Group>

                        < Form.Group controlId="PasswordConfirm">
                            <Form.Control type="password" placeholder="Confirm New Password" onChange={(e) => { validatePasswordMatch(e) }} />
                            {passwordValid ? null : <Alert variant={'warning'}>Passwords must match!</Alert>}
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className='justify-content-between'>
                        <Button disabled={loading} variant="dark" type="submit" onClick={(e) => { e.preventDefault(); editPassword() }} >
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
