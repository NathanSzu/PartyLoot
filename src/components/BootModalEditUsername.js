import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import Filter from 'bad-words';
import firebase from '../utils/firebase';
import { AuthContext } from '../utils/AuthContext';

export default function BootModalEditUsername({ username, setUsername }) {
    const { currentUser } = useContext(AuthContext);
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [usernameProfane, setUsernameProfane] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkUsername = (e) => {
        var filter = new Filter().isProfane(e.target.value)
        setUsernameProfane(filter)
    }

    const editUsername = () => {
        if (!usernameProfane && !username.includes('#')) {
            setLoading(true);
            firebase.auth().currentUser.updateProfile({
                displayName: username
            }).then(function () {
                // Update successful.
                setLoading(false);
                handleClose();
                console.log('profile updated');
            }).catch(function (error) {
                // An error happened.
                setLoading(false);
                handleClose();
                console.log(error);
            });
        }
    }

    return (
        <>
            <Button variant='dark' className='p-1 mt-2 mb-2 w-100' onClick={handleShow}>Change Username</Button>

            <Modal show={show} onHide={() => { handleClose(); setUsername(currentUser.displayName) }}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Username</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId="Username">
                            <Form.Control type="text" defaultValue={username} onChange={(e) => { setUsername(e.target.value); checkUsername(e) }} />
                            {!usernameProfane ? null : <Alert variant={'warning'}>Keep it clean!</Alert>}
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className='justify-content-between'>
                        <Button disabled={loading} variant="dark" type="submit" onClick={(e) => { e.preventDefault(); editUsername() }} >
                            Save
                            </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
