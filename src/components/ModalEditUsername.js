import React, { useState, useContext, useRef } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { AuthContext } from '../utils/contexts/AuthContext';

export default function ModalEditUsername({ loading, userData }) {
    const { setUsername, currentUser } = useContext(AuthContext);
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const usernameRef = useRef(null);

    const save = (e) => {
        e.preventDefault()
        if (usernameRef.current.value !== currentUser.displayName) {
            setUsername(usernameRef.current.value);
        }
        handleClose();
    }

    return (
        <>
            <Button variant='dark' className='p-2 mb-2 w-100 background-dark border-0' onClick={handleShow}>Change Username</Button>

            <Modal show={show} onHide={() => { handleClose() }}>
                <Form className='texture-backer'>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Username</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId="Username">
                            <Form.Control type="text" ref={usernameRef} defaultValue={userData && userData.displayName} />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className='justify-content-between'>
                        <Button disabled={loading} variant="dark" className='background-dark border-0' type="submit" onClick={save} >
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
