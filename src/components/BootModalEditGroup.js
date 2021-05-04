import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import fb from 'firebase';
import firebase from '../utils/firebase';
import { AuthContext } from '../utils/AuthContext';
import gear from '../assets/gear-fill.svg'

export default function BootModalEditGroup({ name, id, updateDisplay, owner }) {
    const { currentUser } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [leaveConfirmation, setLeaveConfirmation] = useState(false);

    const nameRef = useRef()

    const db = firebase.firestore();

    const setFalseThenClose = () => {
        setLoading(false);
        setDeleteConfirmation(false);
        setLeaveConfirmation(false);
        handleClose();
    }

    const editGroup = () => {
        // Does not call update function if the group name has not been changed or is left empty.
        if (nameRef.current.value === name || !nameRef.current.value) {
            setFalseThenClose();
            return
        }
        setLoading(true)
        db.collection('groups').doc(`${id}`).update({
            groupName: nameRef.current.value
        })
            .then(() => {
                console.log('Document successfully updated!');
                setFalseThenClose();
                updateDisplay();
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error('Error updating document: ', error);
                setFalseThenClose();
            });
    }

    const deleteGroup = () => {
        if (currentUser.uid !== owner) { return }
        setLoading(true)
        db.collection('groups').doc(`${id}`).delete()
            .then(() => {
                console.log('Document successfully deleted!');
                setFalseThenClose();
                updateDisplay();
            }).catch((error) => {
                console.error('Error removing document: ', error);
                setFalseThenClose();
            });
    }

    const leaveGroup = () => {
        if (currentUser.uid === owner) { return }
        setLoading(true)
        db.collection('groups').doc(`${id}`).update({
            'members': fb.firestore.FieldValue.arrayRemove(currentUser.uid)
        })
            .then(() => {
                console.log('Document successfully deleted!');
                updateDisplay();
                setFalseThenClose();
            }).catch((error) => {
                console.error('Error removing document: ', error);
                setFalseThenClose();
            });
    }

    return (
        <>
            <Button variant='dark' className='p-1' onClick={handleShow}><img src={gear} fill='white'></img></Button>

            <Modal show={show} onHide={setFalseThenClose}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {name}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId='groupName'>
                            <Form.Control ref={nameRef} disabled={currentUser.uid === owner ? false : true} type='text' defaultValue={name} />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className='justify-content-between'>
                        {currentUser.uid === owner ?
                        <Button disabled={loading} variant='dark' type='submit' onClick={(e) => { e.preventDefault(); editGroup() }}>
                            Save
                        </Button> : 
                        <div></div>}

                        {deleteConfirmation ? <Button disabled={loading} variant='danger' type='button' onClick={(e) => { e.preventDefault(); deleteGroup() }}>
                            Yes, I'm sure. Delete!
                        </Button> : null}

                        {leaveConfirmation ? <Button disabled={loading} variant='danger' type='button' onClick={(e) => { e.preventDefault(); leaveGroup() }}>
                            Yes, I'm sure. Leave Group!
                        </Button> : null}

                        {currentUser.uid === owner && !deleteConfirmation ?
                        // Delete button that only shows if the current user owns the group.
                            <Button disabled={loading} variant='danger' type='button' onClick={(e) => { setDeleteConfirmation(true) }}>
                                Delete
                            </Button> : null}

                        {currentUser.uid !== owner && !leaveConfirmation ?
                            // Alternate Leave Group button that only shows if current user does not own the group.
                            <Button disabled={loading} variant='danger' type='button' onClick={(e) => { setLeaveConfirmation(true) }}>
                                Leave Group
                            </Button> : null}
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
