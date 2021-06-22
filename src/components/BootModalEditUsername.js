import React, { useState, useContext, useRef } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';

export default function BootModalEditUsername({ loading }) {
    const { setUsername, userData } = useContext(AuthContext);
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const usernameRef = useRef(null);

    const save = (e) => {
        e.preventDefault()
        if (usernameRef.current.value !== userData.displayName) {
            setUsername(usernameRef.current.value);
        }
        handleClose();
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
                            <Form.Control type="text" ref={usernameRef} defaultValue={userData && userData.displayName} />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className='justify-content-between'>
                        <Button disabled={loading} variant="dark" type="submit" onClick={save} >
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
