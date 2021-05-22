import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import edit from '../assets/pencil-square.svg';
import { GroupContext } from '../utils/GroupContext';
import fb from 'firebase';
import firebase from '../utils/firebase';

export default function BootModalAddLoot({ item }) {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const { currentGroup } = useContext(GroupContext);

    useEffect(() => {
        console.log(item.id)
    }, [])

    const nameRef = useRef();
    const descRef = useRef();

    const db = firebase.firestore();
    const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`)

    const editLoot = () => {
        // Does not call update function if the group name has not been changed or is left empty.
        if (!nameRef.current.value) {
            handleClose();
            return
        }
        setLoading(true)
        itemRef.update({
            itemName: nameRef.current.value,
            itemDesc: descRef.current.value
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
            <Button variant='dark' className='p-2' onClick={handleShow}><img src={edit}></img></Button>

            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>{`Edit ${item.itemName}`}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId='itemName'>
                            <Form.Control ref={nameRef} defaultValue={item.itemName} type='text' placeholder='Item name' />
                        </Form.Group>
                        <Form.Group controlId='itemDesc'>
                            <Form.Control ref={descRef} as='textarea' defaultValue={item.itemDesc} rows={4} placeholder='Item description' />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className='justify-content-between'>
                        <Button as='input' disabled={loading} value='Save' variant='dark' type='submit' onClick={(e) => { e.preventDefault(); editLoot() }} />

                        {deleteConfirmation ?
                            <Button as='input' value={`Yes, I'm sure. Delete!`} disabled={loading} variant='danger' type='button' onClick={(e) => { e.preventDefault(); deleteItem() }} />
                            : null}

                        {!deleteConfirmation ?
                            // Delete button that only shows if the current user owns the group.
                            <Button as='input' value='Delete' disabled={loading} variant='danger' type='button' onClick={(e) => { setDeleteConfirmation(true) }} />
                            : null}
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
