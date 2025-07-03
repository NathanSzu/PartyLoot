import { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Container, Alert } from 'react-bootstrap';
import fb from 'firebase';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function EditGroup({ name, id, owner, members }) {
  const { currentUser, db } = useContext(AuthContext);
  const { groups } = useContext(GroupContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setFalse();
    setShow(true);
  };
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [leaveConfirmation, setLeaveConfirmation] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const getGroupMembers = async () => {
    setLoading(true);
    await db
      .collection('users')
      .where(fb.firestore.FieldPath.documentId(), 'in', members)
      .onSnapshot((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          results.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setGroupMembers(results);
      });
    setLoading(false);
  };

  const nameRef = useRef();
  const memberRef = useRef();

  useEffect(() => {
    getGroupMembers();
  }, [members]);

  const setFalse = () => {
    setDeleteConfirmation(false);
    setLeaveConfirmation(false);
    setAlert(null);
  };

  const editGroup = () => {
    if (nameRef.current.value === name || !nameRef.current.value) return;
    setLoading(true);
    groups
      .doc(id)
      .update({
        groupName: nameRef.current.value,
      })
      .then(() => {
        handleClose();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  };

  const deleteGroup = async () => {
    if (currentUser.uid !== owner) return;
    setLoading(true);
    await fetch(process.env.REACT_APP_DELETE_GROUP_URL, {
      method: 'POST',
      body: id,
    });
    handleClose();
    setLoading(false);
  };

  const addMember = () => {
    if (!memberRef.current.value) return;
    if (groupMembers.length > 9) {
      setAlert('No more than 10 members can be added');
      return;
    }
    setLoading(true);
    db.collection('users')
      .where('code', '==', memberRef.current.value.toUpperCase())
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setAlert('User not found!');
        } else {
          querySnapshot.forEach((doc) => {
            groups.doc(id).update({
              members: fb.firestore.FieldValue.arrayUnion(doc.id),
            });
          });
          memberRef.current.value = '';
          setFalse();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting user: ', error);
      });
  };

  const removeMember = (uid, close = false) => {
    setLoading(true);
    groups
      .doc(id)
      .update({
        members: fb.firestore.FieldValue.arrayRemove(uid),
      })
      .then(() => {
        close && handleClose();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error removing member: ', error);
      });
  };

  return (
    <>
      <Button
        disabled={!name}
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

              {currentUser.uid === owner && (
                <Button
                  as='input'
                  value='Save'
                  disabled={loading}
                  variant='dark'
                  className='background-dark border-0'
                  type='button'
                  onClick={() => editGroup()}
                />
              )}

              {currentUser.uid === owner ? (
                <Button
                  as='input'
                  value={deleteConfirmation ? "Yes, I'm sure. Delete!" : 'Delete'}
                  disabled={loading}
                  variant='danger'
                  className='background-danger border-0'
                  type='button'
                  onClick={() => {
                    deleteConfirmation ? deleteGroup() : setDeleteConfirmation(true);
                  }}
                  data-cy={deleteConfirmation ? 'confirm-delete' : 'delete'}
                />
              ) : (
                <Button
                  as='input'
                  value={leaveConfirmation ? "Yes, I'm sure. Leave Group!" : 'Leave Group'}
                  disabled={loading}
                  variant='danger'
                  className='background-danger border-0'
                  type='button'
                  onClick={() => {
                    leaveConfirmation ? removeMember(currentUser.uid, true) : setLeaveConfirmation(true);
                  }}
                />
              )}
            </Modal.Footer>
          </Form>

          {groupMembers.length > 1 && (
            <Modal.Header>
              <Modal.Title>Members</Modal.Title>
            </Modal.Header>
          )}

          {groupMembers &&
            groupMembers
              .filter((member) => member.id !== currentUser.uid)
              .map((member, idx) => (
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
                            removeMember(e.target.id);
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

          {currentUser.uid === owner && (
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
                    <Col>{alert && <Alert variant='warning'>{alert}</Alert>}</Col>
                  </Row>
                </Container>
              </Form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
