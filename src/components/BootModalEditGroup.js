import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Container, Alert } from 'react-bootstrap';
import fb from 'firebase';
import firebase from '../utils/firebase';
import { AuthContext } from '../utils/AuthContext';
import gear from '../assets/gear-fill.svg';
import remove from '../assets/remove-user.svg';

export default function BootModalEditGroup({ name, id, updateDisplay, owner, members }) {
    const { currentUser } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [leaveConfirmation, setLeaveConfirmation] = useState(false);
    const [displayMembers, setDisplayMembers] = useState([]);
    const [noResult, setNoResult] = useState(false);

    const nameRef = useRef();
    const memberRef = useRef();

    const db = firebase.firestore();

    const getGroupMembers = () => {
        db.collection('users').where(fb.firestore.FieldPath.documentId(), 'in', members).get()
        .then((querySnapshot) => {
            let currMembers = [];
            querySnapshot.forEach((doc) => {
                if (doc.id !== currentUser.uid) {
                    currMembers.push({
                        id: doc.id,
                        data: doc.data()
                    })
                }
            });
            setDisplayMembers(currMembers)
            console.log(currMembers)
        })
    }

    const setFalseThenClose = () => {
        setLoading(false);
        setDeleteConfirmation(false);
        setLeaveConfirmation(false);
        setNoResult(false);
        handleClose();
    }

    const setFalseNoClose = () => {
        setLoading(false);
        setDeleteConfirmation(false);
        setLeaveConfirmation(false);
        setNoResult(false);
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

    const addMember = () => {
        if (memberRef.current.value) {
            setLoading(true);
            db.collection('users').where('code', '==', memberRef.current.value.toUpperCase()).get()
                .then((querySnapshot) => {
                    // Check if there are no results and display alert
                    if (querySnapshot.empty) {
                        setNoResult(true);
                        setLoading(false);
                    } else {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            console.log(doc.id, " => ", doc.data());
                            if (doc.id) {
                                db.collection('groups').doc(id).update({
                                    members: fb.firestore.FieldValue.arrayUnion(doc.id)
                                })
                            }
                        });
                        setFalseNoClose();
                    }
                })
                .catch((error) => {
                    console.log("Error getting user: ", error);
                });
        }
    }

    const leaveGroup = () => {
        setLoading(true)
        db.collection('groups').doc(`${id}`).update({
            'members': fb.firestore.FieldValue.arrayRemove(currentUser.uid)
        })
            .then(() => {
                console.log('Member romved!');
                updateDisplay();
                setFalseThenClose();
            }).catch((error) => {
                console.error('Error removing member: ', error);
                setFalseThenClose();
            });
    }

    const removeMember = (e) => {
        setLoading(true)
        db.collection('groups').doc(`${id}`).update({
            'members': fb.firestore.FieldValue.arrayRemove(e.target.id)
        })
            .then(() => {
                console.log('Member removed!');
                updateDisplay();
                setFalseNoClose();
            }).catch((error) => {
                console.error('Error removing member: ', error);
                setFalseNoClose();
            });
    }

    return (
        <>
            <Button variant='dark' className='p-1' onClick={() => { handleShow(); getGroupMembers() }}><img src={gear}></img></Button>

            <Modal show={show} onHide={setFalseThenClose}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>{currentUser.uid === owner ? 'Edit' : null} {name}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group controlId='groupName'>
                            <Form.Control ref={nameRef} disabled={currentUser.uid === owner ? false : true} type='text' defaultValue={name} />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className='justify-content-between'>
                        {currentUser.uid === owner ?
                            <Button as='input' value='Save' disabled={loading} variant='dark' type='submit' onClick={(e) => { e.preventDefault(); editGroup() }} />
                            : <div></div>}

                        {deleteConfirmation ?
                            <Button as='input' value={`Yes, I'm sure. Delete!`} disabled={loading} variant='danger' type='button' onClick={(e) => { e.preventDefault(); deleteGroup() }} />
                            : null}

                        {leaveConfirmation ?
                            <Button as='input' value={`Yes, I'm sure. Leave Group!`} disabled={loading} variant='danger' type='button' onClick={(e) => { e.preventDefault(); leaveGroup(currentUser.uid) }} />
                            : null}

                        {currentUser.uid === owner && !deleteConfirmation ?
                            // Delete button that only shows if the current user owns the group.
                            <Button as='input' value='Delete' disabled={loading} variant='danger' type='button' onClick={(e) => { setDeleteConfirmation(true) }} />
                            : null}

                        {currentUser.uid !== owner && !leaveConfirmation ?
                            // Alternate Leave Group button that only shows if current user does not own the group.
                            <Button as='input' value={`Leave Group`} disabled={loading} variant='danger' type='button' onClick={(e) => { setLeaveConfirmation(true) }} />
                            : null}
                    </Modal.Footer>

                    {/* Purely for the border */}
                    <Modal.Footer></Modal.Footer>

                </Form>

                <Modal.Header>
                    <Modal.Title>Members</Modal.Title>
                </Modal.Header>

                {displayMembers.map((displayMember, idx) => (
                    <Container>
                        <Row key={idx} className='p-2'>
                            <Col>
                                {displayMember.data.displayName}
                            </Col>
                            {currentUser.uid === owner ?
                                <Col xs='auto'>
                                    <Button disabled={loading} variant='danger' id={displayMember.id} type='button' onClick={(e) => { removeMember(e) }}>
                                        <img id={displayMember.id} src={remove}></img>
                                    </Button>
                                </Col> : null
                            }
                        </Row>
                    </Container>
                ))}


                {
                    currentUser.uid === owner ?
                        <>
                            <Modal.Header>
                                <Modal.Title>Add Members</Modal.Title>
                            </Modal.Header>
                            <Form className='w-100 mt-3'>
                                <Container>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId='addMember'>
                                                <Form.Control ref={memberRef} type='text' placeholder='Enter group code' />
                                            </Form.Group>
                                        </Col>

                                        <Col xs='auto'>
                                            <Button disabled={loading} variant='dark' type='submit' onClick={(e) => { e.preventDefault(); addMember() }}>
                                                +
                                                </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {noResult ? <Alert variant='dark'>User not found!</Alert> : null}
                                        </Col>
                                    </Row>
                                </Container>
                            </Form>
                        </> : null
                }
            </Modal>
        </>
    )
}
