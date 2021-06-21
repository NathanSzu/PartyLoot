import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import edit from '../assets/pencil-square.svg';
import { GroupContext } from '../utils/GroupContext';
import fb from 'firebase';
import firebase from '../utils/firebase';

export default function ModalLoot({ item }) {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectOwner, setSelectOwner] = useState(false);
    const { currentGroup, groupData } = useContext(GroupContext);
    const db = firebase.firestore();
    const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`);

    const nameRef = useRef();
    const descRef = useRef();
    const chargeRef = useRef();
    const chargesRef = useRef();
    const tagsRef = useRef();

    const addLoot = () => {
        if (!nameRef.current.value || !descRef.current.value) { return }
        setLoading(true);
        console.log('Name: ', nameRef.current.value)
        console.log('Desc: ', descRef.current.value)
        db.collection('groups').doc(`${currentGroup}`).collection('loot').add({
            itemName: nameRef.current.value,
            itemDesc: descRef.current.value,
            currCharges: chargeRef.current.value,
            maxCharges: chargesRef.current.value,
            itemTags: tagsRef.current.value,
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

    const editLoot = () => {
        // Does not call update function if the group name or description is left empty.
        if (!nameRef.current.value || !descRef.current.value) {
            handleClose();
            return
        }
        setLoading(true)
        itemRef.update({
            itemName: nameRef.current.value,
            itemDesc: descRef.current.value,
            currCharges: chargeRef.current.value,
            maxCharges: chargesRef.current.value,
            itemTags: tagsRef.current.value
        })
            .then(() => {
                console.log('Item successfully updated!');
                setLoading(false);
                handleClose();
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error('Error updating item: ', error);
                setLoading(false);
                handleClose();
            });
    }

    const deleteItem = () => {
        itemRef.delete()
            .then(() => {
                console.log('Item successfully deleted!');
                console.log('Group: ', currentGroup)
                console.log('Item: ', item.id)
                setLoading(false);
                handleClose();
            }).catch((error) => {
                console.error('Error removing item: ', error);
                setLoading(false);
            });
    }


    return (
        <>
            {item ? <Button variant='dark' className='p-1 m-0' onClick={handleShow}><img src={edit}></img></Button>
                :
                <Button variant='dark' onClick={handleShow} className='w-100 m-0 mr-auto ml-auto'>Add Item</Button>}


            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                        {item ? <Modal.Title>{`Edit ${item.itemName}`}</Modal.Title>
                            :
                            <Modal.Title>Add an item!</Modal.Title>}
                    </Modal.Header>

                    <Modal.Body>

                        <Form.Group controlId='itemName'>
                            <Form.Control ref={nameRef} defaultValue={item && item.itemName} type='text' placeholder='Item name' />
                        </Form.Group>

                        <Form.Group controlId='itemCharges'>
                            <Row>
                                <Col xs={5}>
                                    <Form.Control className='text-center' ref={chargeRef} defaultValue={item && item.currCharges} type='number' placeholder='Charge' />
                                </Col>
                                <Col xs={2} className='d-flex align-items-center justify-content-center'>
                                    /
                                </Col>
                                <Col xs={5}>
                                    <Form.Control className='text-center' ref={chargesRef} defaultValue={item && item.maxCharges} type='number' placeholder='Charges' />
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId='itemDesc'>
                            <Form.Control ref={descRef} as='textarea' rows={4} defaultValue={item && item.itemDesc} placeholder='Item description' />
                        </Form.Group>

                        <Form.Group controlId='itemTags'>
                            <Form.Control ref={tagsRef} type='text' defaultValue={item && item.itemTags} placeholder='Enter searchable item tags here' />
                        </Form.Group>

                        <Form.Group controlId='itemOwner'>
                            <span>{selectOwner ? 'Choose Owner: ' : 'Owner: '}
                                {!item.itemOwner && !selectOwner ? <Badge as='button' pill variant='secondary' onClick={(e) => { e.preventDefault(); setSelectOwner(true) }}>Unclaimed</Badge> : null}
                                {item.itemOwner && !selectOwner ? <Badge as='button' pill variant='secondary' onClick={(e) => { e.preventDefault(); setSelectOwner(true) }}>{item.itemOwner}</Badge> : null}
                            </span>
                            {selectOwner ?
                                <Row>
                                {groupData.members.map((member, idx) => (
                                    <Col xs={6} key={idx}>
                                        <Badge as='button' pill variant='secondary' onClick={(e) => { e.preventDefault(); setSelectOwner(false) }}>{member}</Badge>
                                    </Col>
                                    ))}
                                </Row>
                                :
                                null
                            }
                        </Form.Group>

                    </Modal.Body>


                    <Modal.Footer className='justify-content-between'>

                        {item ?
                            <Button as='input' disabled={loading} value='Save' variant='dark' type='submit' onClick={(e) => { e.preventDefault(); editLoot() }} />
                            :
                            <Button disabled={loading} variant='dark' type='submit' onClick={(e) => { e.preventDefault(); addLoot() }}>
                                Create
                            </Button>}

                        {deleteConfirmation ?
                            <Button as='input' value={`Yes, I'm sure. Delete!`} disabled={loading} variant='danger' type='button' onClick={(e) => { e.preventDefault(); deleteItem() }} />
                            : null}

                        {!deleteConfirmation && item ?
                            <Button as='input' value='Delete' disabled={loading} variant='danger' type='button' onClick={(e) => { setDeleteConfirmation(true) }} />
                            : null}



                    </Modal.Footer>
                </Form>


            </Modal>

        </>
    )
}
