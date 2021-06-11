import React, { useState, useContext, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import fb from 'firebase';
import firebase from '../utils/firebase';

export default function BootModalAddLoot({ currentGroup }) {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false);

    const nameRef = useRef();
    const descRef = useRef();
    const chargeRef = useRef();
    const chargesRef = useRef();
    const tagsRef = useRef();

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
            <Button variant='dark' onClick={handleShow} className='w-100 m-0 mr-auto ml-auto'>
                Add Item
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

                        <Form.Group controlId='itemCharges'>
                            <Row>
                                <Col xs={4}>
                                    <Form.Control className='text-center' ref={chargeRef} type='number' placeholder='Charge' />
                                </Col>
                                <Col xs={4} className='d-flex align-items-center justify-content-center'>
                                    out of
                                </Col>
                                <Col xs={4}>
                                    <Form.Control className='text-center' ref={chargesRef} type='number' placeholder='Charges' />
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId='itemDesc'>
                            <Form.Control ref={descRef} as='textarea' rows={4} placeholder='Item description' />
                        </Form.Group>

                        <Form.Group controlId='itemTags'>
                            <Form.Control ref={tagsRef} type='text' placeholder='Enter searchable item tags here' />
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
