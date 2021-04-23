import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import firebase from '../utils/firebase';
import { AuthContext } from '../utils/AuthContext';
import gear from '../assets/gear-fill.svg'

export default function BootModalEditGroup({ name, id, updateDisplay, owner }) {
    const { currentUser } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false);
    const [userIsOwner, setUserIsOwner] = useState(false);
    const [confirmation, setConfirmation] = useState(false);

    const nameRef = useRef()

    const db = firebase.firestore();

    const editGroup = () => {
        if (nameRef.current.value === name || !nameRef.current.value) {
            handleClose()
            return
        }
        setLoading(true)
        db.collection('groups').doc(`${id}`).update({
            groupName: nameRef.current.value
        })
            .then(() => {
                console.log('Document successfully updated!');
                updateDisplay();
                setLoading(false);
                setConfirmation(false);
                handleClose();
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error('Error updating document: ', error);
                setLoading(false);
                setConfirmation(false);
                handleClose();
            });
    }

    const deleteGroup = () => {
        if (currentUser.uid !== owner) { return }
        setLoading(true)
        db.collection('groups').doc(`${id}`).delete()
            .then(() => {
                console.log('Document successfully deleted!');
                updateDisplay();
                setLoading(false);
                setConfirmation(false);
                handleClose();
            }).catch((error) => {
                console.error('Error removing document: ', error);
                setLoading(false)
                setConfirmation(false);
                handleClose()
            });
    }

    useEffect(() => {
        if (currentUser.uid === owner) {
            setUserIsOwner(true)
        }

    }, [])

    return (
        <>
            <Button variant='dark' className='p-1' onClick={handleShow}><img src={gear} fill='white'></img></Button>

            <Modal show={show} onHide={() => { handleClose(); setConfirmation(false) }}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {name}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId='groupName'>
                            <Form.Control ref={nameRef} type='text' defaultValue={name} />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className='justify-content-between'>
                        <Button disabled={loading} variant='dark' type='submit' onClick={(e) => { e.preventDefault(); editGroup() }}>
                            Save
                        </Button>
                        {confirmation ? <Button disabled={loading} variant='danger' type='button' onClick={(e) => { e.preventDefault(); deleteGroup() }}>
                            Yes, I'm sure. Delete!
                        </Button> : null}
                        {userIsOwner && !confirmation ? <Button disabled={loading} variant='danger' type='button' onClick={(e) => { e.preventDefault(); setConfirmation(true) }}>
                            Delete
                        </Button> : null}
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
