import React, { useState, useContext, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import fb from 'firebase';
import firebase from '../utils/firebase';
import { AuthContext } from '../utils/AuthContext';

export default function BootModalAddGroup() {
    const { currentUser } = useContext(AuthContext)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false);

    const nameRef = useRef()

    const db = firebase.firestore();

    const addGroup = () => {
        if (!nameRef.current.value) { return }
        setLoading(true);
        console.log(nameRef.current.value)
        db.collection('groups').add({
            groupName: nameRef.current.value,
            owner: currentUser.uid,
            members: [currentUser.uid],
            created: fb.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Group added with ID: ", docRef.id);
            setLoading(false);
            handleClose();
        })
        .catch((error) => {
            console.error("Error creating new group: ", error);
            setLoading(false);
            handleClose();
        });
    }

    return (
        <>
            <Button variant='dark' onClick={handleShow} className='w-100 m-2'>
                +
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Start a new group!</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId='groupName'>
                            <Form.Control ref={nameRef} type='text' placeholder='Group name' />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button disabled={loading} variant='dark' type='submit' onClick={(e) => {e.preventDefault(); addGroup()}}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
