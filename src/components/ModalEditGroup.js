import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Container, Alert } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import fb from 'firebase';
import { AuthContext } from '../utils/contexts/AuthContext';

export default function ModalEditGroup({ name, id, owner, members }) {
    const { currentUser, db } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [leaveConfirmation, setLeaveConfirmation] = useState(false);
    const [displayMembers, setDisplayMembers] = useState([]);
    const [noResult, setNoResult] = useState(false);
    const [maxReached, setMaxReached] = useState(false);

    const userRef = db.collection('users')
    const membersQuery = userRef.where(fb.firestore.FieldPath.documentId(), 'in', members);
    const [groupMembers, loading] = useCollectionData(membersQuery, { idField: 'id' })

    const nameRef = useRef();
    const memberRef = useRef();

    useEffect(() => {
        groupMembers && setDisplayMembers(
            () => {
                let filtered = groupMembers.filter((member) => {
                    if (member.id !== currentUser.uid) {
                        return member
                    } else { return null }
                })
                return (filtered)
            }
        )
    }, [groupMembers, currentUser.uid])

    const setFalseThenClose = () => {
        setDeleteConfirmation(false);
        setLeaveConfirmation(false);
        setNoResult(false);
        setMaxReached(false)
        handleClose();
    }

    const setFalseNoClose = () => {
        setDeleteConfirmation(false);
        setLeaveConfirmation(false);
        setNoResult(false);
        setMaxReached(false)
    }

    const editGroup = () => {
        // Does not call update function if the group name has not been changed or is left empty.
        if (nameRef.current.value === name || !nameRef.current.value) {
            setFalseThenClose();
            return
        }
        db.collection('groups').doc(`${id}`).update({
            groupName: nameRef.current.value
        })
            .then(() => {
                setFalseThenClose();
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error('Error updating document: ', error);
                setFalseThenClose();
            });
    }

    const deleteGroup = () => {
        if (currentUser.uid !== owner) { return }
        db.collection('groups').doc(`${id}`).delete()
            .then(() => {
                setFalseThenClose();
            }).catch((error) => {
                console.error('Error removing document: ', error);
                setFalseThenClose();
            });
    }

    const addMember = () => {
        if (memberRef.current.value) {
            setFalseNoClose();
            db.collection('users').where('code', '==', memberRef.current.value.toUpperCase()).get()
                .then((querySnapshot) => {
                    // Check if there are no results and display alert
                    if (querySnapshot.empty) {
                        setNoResult(true);
                    } else {
                        if (groupMembers.length > 9) { 
                            setMaxReached(true)
                            return
                        }
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            if (doc.id) {
                                db.collection('groups').doc(id).update({
                                    // Adds the user with the entered group code to be added to the groups user array.
                                    members: fb.firestore.FieldValue.arrayUnion(doc.id)
                                })
                            }
                        });
                        memberRef.current.value = '';
                        setFalseNoClose();
                    }
                })
                .catch((error) => {
                    console.error("Error getting user: ", error);
                });
        }
    }

    const leaveGroup = () => {
        db.collection('groups').doc(`${id}`).update({
            'members': fb.firestore.FieldValue.arrayRemove(currentUser.uid)
        })
            .then(() => {
                setFalseThenClose();
            }).catch((error) => {
                console.error('Error removing member: ', error);
                setFalseThenClose();
            });
    }

    const removeMember = (e) => {
        db.collection('groups').doc(`${id}`).update({
            'members': fb.firestore.FieldValue.arrayRemove(e.target.id)
        })
            .then(() => {
                setFalseNoClose();
            }).catch((error) => {
                console.error('Error removing member: ', error);
                setFalseNoClose();
            });
    }

    return (
        <>
            <Button variant='dark' className='p-2 background-dark border-0' onClick={() => { handleShow() }}><img alt='Edit Group' src='/APPIcons/gear-fill.svg'></img></Button>

            <Modal show={show} onHide={setFalseThenClose}>
                <div className='texture-backer rounded'>
                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title>{currentUser.uid === owner ? 'Edit: ' : null} {name}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group controlId='groupName'>
                                <Form.Control ref={nameRef} disabled={currentUser.uid === owner ? false : true} type='text' defaultValue={name} />
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer className='justify-content-between border-0 pt-0'>
                            {currentUser.uid === owner ?
                                <Button as='input' value='Save' disabled={loading} variant='dark' className='background-dark border-0' type='submit' onClick={(e) => { e.preventDefault(); editGroup() }} />
                                : <div></div>}

                            {deleteConfirmation ?
                                <Button as='input' value={`Yes, I'm sure. Delete!`} disabled={loading} variant='danger' className='background-danger border-0' type='button' onClick={(e) => { e.preventDefault(); deleteGroup() }} />
                                : null}

                            {leaveConfirmation ?
                                <Button as='input' value={`Yes, I'm sure. Leave Group!`} disabled={loading} variant='danger' className='background-danger border-0' type='button' onClick={(e) => { e.preventDefault(); leaveGroup(currentUser.uid) }} />
                                : null}

                            {currentUser.uid === owner && !deleteConfirmation ?
                                // Delete button that only shows if the current user owns the group.
                                <Button as='input' value='Delete' disabled={loading} variant='danger' className='background-danger border-0' type='button' onClick={(e) => { setDeleteConfirmation(true) }} />
                                : null}

                            {currentUser.uid !== owner && !leaveConfirmation ?
                                // Alternate Leave Group button that only shows if current user does not own the group.
                                <Button as='input' value={`Leave Group`} disabled={loading} variant='danger' className='background-danger border-0' type='button' onClick={(e) => { setLeaveConfirmation(true) }} />
                                : null}
                        </Modal.Footer>


                    </Form>

                    {displayMembers.length === 0 ? null :
                        <Modal.Header>
                            <Modal.Title>Members</Modal.Title>
                        </Modal.Header>}

                    {displayMembers && displayMembers.map((member, idx) => (
                        <Container key={idx}>
                            <Row className='p-2'>
                                <Col>
                                    {member.displayName}
                                </Col>
                                {currentUser.uid === owner ?
                                    <Col xs='auto'>
                                        <Button disabled={loading} variant='danger' className='background-danger border-0' id={member.id} type='button' onClick={(e) => { removeMember(e) }}>
                                            <img alt='Delete Group' id={member.id} src='/APPIcons/remove-user.svg'></img>
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
                                        <Row className='p-2'>
                                            <Col>
                                                <Form.Group controlId='addMember'>
                                                    <Form.Control ref={memberRef} type='text' placeholder='Enter group code' />
                                                </Form.Group>
                                            </Col>

                                            <Col xs='auto'>
                                                <Button disabled={loading} variant='dark' className='background-dark border-0' type='submit' onClick={(e) => { e.preventDefault(); addMember() }}>
                                                    <img alt='Add Group Member' src='/APPIcons/add-user.svg' />
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                {noResult ? <Alert variant='warning'>User not found!</Alert> : null}
                                                {maxReached ? <Alert variant='warning'>Limit of 10 members!</Alert> : null}
                                            </Col>
                                        </Row>
                                    </Container>
                                </Form>
                            </> : null
                    }
                </div>
            </Modal>
        </>
    )
}
