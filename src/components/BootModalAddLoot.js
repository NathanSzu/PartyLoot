import React, { useState, useContext, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import fb from 'firebase';
import firebase from '../utils/firebase';

export default function BootModalAddLoot({ currentGroup }) {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false);

    const nameRef = useRef();
    const descRef = useRef();

    const db = firebase.firestore();

    const addLoot = () => {
        if (!nameRef.current.value || !descRef.current.value) { return }
        setLoading(true);
        console.log('Name: ', nameRef.current.value)
        console.log('Desc: ', descRef.current.value)
        db.collection('groups').doc(`${currentGroup}`).collection('loot').add({
            itemName: nameRef.current.value,
            itemDesc: descRef.current.value,
            created: fb.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Item added with ID: ", docRef.id);
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
            <Button variant='dark' onClick={handleShow} className='w-75 m-2'>
                +
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Add an item!</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId='itemName'>
                            <Form.Control ref={nameRef} type='text' placeholder='Item name' />
                        </Form.Group>
                        <Form.Group controlId='itemDesc'>
                            <Form.Control ref={descRef} as='textarea' rows={4} placeholder='Item description' />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button disabled={loading} variant='dark' type='submit' onClick={(e) => {e.preventDefault(); addLoot()}}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
