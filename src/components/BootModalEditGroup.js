import React, { useState, useContext, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import fb from 'firebase';
import firebase from '../utils/firebase';
import { AuthContext } from '../utils/AuthContext';
import gear from '../assets/gear-fill.svg'

export default function BootModalEditGroup({ name }) {
    const { currentUser } = useContext(AuthContext)
    const [show, setShow] = useState(false)
    const [groupName, setGroupName] = useState(name)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const nameRef = useRef()

    const db = firebase.firestore();

    const editGroup = () => {
        console.log(nameRef.current.value)
        db.collection('groups').add({
            groupName: nameRef.current.value,
            members: [currentUser.uid],
            created: fb.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Group added with ID: ", docRef.id);
            handleClose();
        })
        .catch((error) => {
            console.error("Error creating new group: ", error);
            handleClose();
        });
    }

    return (
        <>
            <Button variant='dark' className='p-1' onClick={handleShow}><img src={gear} fill='white'></img></Button>

            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {name}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId='groupName'>
                            <Form.Control ref={nameRef} type='text' value={groupName} />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant='dark' type='submit' onClick={(e) => {e.preventDefault(); editGroup()}}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
