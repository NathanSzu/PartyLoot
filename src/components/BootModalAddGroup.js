import React, { useState, useContext, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import fbApp from 'firebase/app';
import firebase from '../utils/firebase';
import { AuthContext } from '../utils/AuthContext';

export default function BootModalAddGroup() {
    const { currentUser } = useContext(AuthContext)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const nameRef = useRef()

    const db = firebase.firestore();

    const addGroup = () => {
        console.log(nameRef.current.value)
        db.collection('groups').add({
            groupName: nameRef.current.value
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            db.collection('users').doc(currentUser.uid).update({
                groups: fbApp.firestore.FieldValue.arrayUnion(docRef.id)
            })
            .then(() => {
                console.log("Group added to user list!");
                handleClose()
            })
            .catch((error) => {
                console.error("Error adding to user list: ", error);
            });
            
        })
        .catch((error) => {
            console.error("Error creating new group: ", error);
        });
    }

    return (
        <>
            <Button variant='dark' onClick={handleShow} className='w-75 m-2'>
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
                        <Button variant='dark' type='submit' onClick={(e) => {e.preventDefault(); addGroup()}}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
