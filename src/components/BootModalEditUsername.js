import React, { useState } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import Filter from 'bad-words';
import firebase from '../utils/firebase';

export default function BootModalEditUsername({ username, setUsername }) {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [usernameValid, setUsernameValid] = useState(true);
    const [loading, setLoading] = useState(false);

    const checkUsername = (e) => {
        var filter = new Filter().isProfane(e.target.value)
        setUsernameValid(filter)
        console.log(filter)
    }

    const editUsername = () => {

    }

    return (
        <>
            <Button variant='dark' className='p-1 mt-2 mb-2 w-100' onClick={handleShow}>Change Username</Button>

            <Modal show={show} onHide={() => { handleClose() }}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Username</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId="Username">
                            <Form.Control type="text" defaultValue={username} onChange={(e) => { setUsername(e.target.value); checkUsername(e) }} />
                            {usernameValid ? null : <Alert variant={'warning'}>Must be at least 8 characters!</Alert>}
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
