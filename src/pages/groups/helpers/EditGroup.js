import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Container, Alert } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import fb from 'firebase';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function EditGroup({ name, id, owner, members }) {
  const { currentUser, db } = useContext(AuthContext);
  const { groups } = useContext(GroupContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [leaveConfirmation, setLeaveConfirmation] = useState(false);
  const [displayMembers, setDisplayMembers] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [maxReached, setMaxReached] = useState(false);

  const userRef = db.collection('users');
  const membersQuery = userRef.where(fb.firestore.FieldPath.documentId(), 'in', members);
  const [groupMembers, loading] = useCollectionData(membersQuery, { idField: 'id' });

  const nameRef = useRef();
  const memberRef = useRef();

  useEffect(() => {
    groupMembers &&
      setDisplayMembers(() => {
        let filtered = groupMembers.filter((member) => {
          if (member.id !== currentUser.uid) {
            return member;
          } else {
            return null;
          }
        });
        return filtered;
      });
  }, [groupMembers, currentUser.uid]);

  const setFalse = () => {
    setDeleteConfirmation(false);
    setLeaveConfirmation(false);
    setNoResult(false);
    setMaxReached(false);
  };

  const editGroup = () => {
    // Does not call update function if the group name has not been changed or is left empty.
    if (nameRef.current.value === name || !nameRef.current.value) {
      setFalse();
      return;
    }
    groups
      .doc(id)
      .update({
        groupName: nameRef.current.value,
      })
      .then(() => {
        handleClose();
        setFalse();
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
      });
  };

  const deleteGroup = () => {
    if (currentUser.uid !== owner) {
      return;
    }
    handleClose();
    groups
      .doc(id)
      .delete()
      .then(() => {
        setFalse();
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  };

  const addMember = () => {
    if (memberRef.current.value) {
      setFalse();
      db.collection('users')
        .where('code', '==', memberRef.current.value.toUpperCase())
        .get()
        .then((querySnapshot) => {
          // Check if there are no results and display alert
          if (querySnapshot.empty) {
            setNoResult(true);
          } else {
            if (groupMembers.length > 9) {
              setMaxReached(true);
              return;
            }
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              if (doc.id) {
                groups.doc(id).update({
                  // Adds the user with the entered group code to be added to the groups user array.
                  members: fb.firestore.FieldValue.arrayUnion(doc.id),
                });
              }
            });
            memberRef.current.value = '';
            setFalse();
          }
        })
        .catch((error) => {
          console.error('Error getting user: ', error);
        });
    }
  };

  const leaveGroup = () => {
    groups
      .doc(id)
      .update({
        members: fb.firestore.FieldValue.arrayRemove(currentUser.uid),
      })
      .then(() => {
        handleClose();
        setFalse();
      })
      .catch((error) => {
        console.error('Error removing member: ', error);
      });
  };

  const removeMember = (e) => {
    groups
      .doc(id)
      .update({
        members: fb.firestore.FieldValue.arrayRemove(e.target.id),
      })
      .then(() => {
        setFalse();
      })
      .catch((error) => {
        console.error('Error removing member: ', error);
      });
  };

  return (
    <>
      <Button
        variant='dark'
        className=' background-dark border-0'
        onClick={() => {
          handleShow();
        }}
        data-cy='edit-group'
      >
        <img alt='Edit Group' src='/APPIcons/gear-fill.svg'></img>
      </Button>

      <Modal
        show={show}
        onHide={() => {
          handleClose();
          setFalse();
        }}
      >
        <div className='rounded'>
          <Form onSubmitCapture={(e) => e.preventDefault()}>
            <Modal.Header closeButton>
              <Modal.Title className='groups-overflow'>
                {currentUser.uid === owner ? 'Edit: ' : null} {name}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form.Group controlId='groupName' className='m-0'>
                <Form.Control
                  ref={nameRef}
                  disabled={currentUser.uid === owner ? false : true}
                  type='text'
                  defaultValue={name}
                  data-cy='edit-group-name'
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer className='justify-content-between border-0 pt-0'>
              {deleteConfirmation ? (
                <Col xs={12} className='p-0'>
                  <Alert key='danger' variant='danger' className='w-100'>
                    Be careful! Delete will permanently remove all group members and data.
                  </Alert>
                </Col>
              ) : null}

              {currentUser.uid === owner ? (
                <Button
                  as='input'
                  value='Save'
                  disabled={loading}
                  variant='dark'
                  className='background-dark border-0'
                  type='button'
                  onClick={() => editGroup()}
                />
              ) : null}

              {deleteConfirmation ? (
                <Button
                  as='input'
                  value={`Yes, I'm sure. Delete!`}
                  disabled={loading}
                  variant='danger'
                  className='background-danger border-0'
                  type='button'
                  onClick={() => deleteGroup()}
                  data-cy='confirm-delete'
                />
              ) : null}

              {leaveConfirmation ? (
                <Button
                  as='input'
                  value={`Yes, I'm sure. Leave Group!`}
                  disabled={loading}
                  variant='danger'
                  className='background-danger border-0'
                  type='button'
                  onClick={() => leaveGroup(currentUser.uid)}
                />
              ) : null}

              {currentUser.uid === owner && !deleteConfirmation ? (
                // Delete button that only shows if the current user owns the group.
                <Button
                  as='input'
                  value='Delete'
                  disabled={loading}
                  variant='danger'
                  className='background-danger border-0'
                  type='button'
                  onClick={() => {
                    setDeleteConfirmation(true);
                  }}
                  data-cy='delete'
                />
              ) : null}

              {currentUser.uid !== owner && !leaveConfirmation ? (
                // Alternate Leave Group button that only shows if current user does not own the group.
                <Button
                  as='input'
                  value={`Leave Group`}
                  disabled={loading}
                  variant='danger'
                  className='background-danger border-0'
                  type='button'
                  onClick={() => {
                    setLeaveConfirmation(true);
                  }}
                />
              ) : null}
            </Modal.Footer>
          </Form>

          {displayMembers.length === 0 ? null : (
            <Modal.Header>
              <Modal.Title>Members</Modal.Title>
            </Modal.Header>
          )}

          {displayMembers &&
            displayMembers.map((member, idx) => (
              <Container key={idx}>
                <Row className='p-2'>
                  <Col>{member.displayName}</Col>
                  {currentUser.uid === owner ? (
                    <Col xs='auto'>
                      <Button
                        disabled={loading}
                        variant='danger'
                        className='background-danger border-0'
                        id={member.id}
                        type='button'
                        onClick={(e) => {
                          removeMember(e);
                        }}
                        data-cy='remove-member'
                      >
                        <img alt='Delete Group' id={member.id} src='/APPIcons/remove-user.svg'></img>
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              </Container>
            ))}

          {currentUser.uid === owner ? (
            <>
              <Modal.Header>
                <Modal.Title>Add Members</Modal.Title>
              </Modal.Header>
              <Form className='w-100 mt-3' onSubmitCapture={(e) => e.preventDefault()}>
                <Container>
                  <Row className='p-2'>
                    <Col>
                      <Form.Group controlId='addMember'>
                        <Form.Control
                          ref={memberRef}
                          type='text'
                          placeholder='Enter group code'
                          data-cy='enter-group-code'
                        />
                      </Form.Group>
                    </Col>

                    <Col xs='auto'>
                      <Button
                        disabled={loading}
                        variant='dark'
                        className='background-dark border-0'
                        type='button'
                        onClick={(e) => {
                          e.preventDefault();
                          addMember();
                        }}
                        data-cy='add-member'
                      >
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
            </>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
