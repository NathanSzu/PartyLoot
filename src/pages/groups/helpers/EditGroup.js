import { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Container, Alert } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { getGroupMembers, editGroup, deleteGroup, addMember, removeMember } from '../../../controllers/groupController';
import GroupIcon from '../../../assets/GroupIcon';

export default function EditGroup({ group }) {
  const { groupName, id, owner, members } = group;
  const { currentUser } = useContext(AuthContext);
  const isOwner = currentUser.uid === owner;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetState();
    setShow(true);
  };
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const [formState, setFormState] = useState({
    groupName: groupName || '',
    icon: {
      id: group.icon?.id || 1,
      color: group.icon?.color || '#000000',
    },
  });

  useEffect(() => {
    getGroupMembers(members, setGroupMembers, setLoading);
  }, [members]);

  const resetState = () => {
    setConfirming(false);
    setAlert(null);
  };

  const memberRef = useRef();

  const handleDelete = () => {
    confirming ? deleteGroup(currentUser, owner, setLoading, id, handleClose) : setConfirming(true);
  };

  const handleLeave = () => {
    confirming ? removeMember(id, currentUser.uid, setLoading, handleClose, true) : setConfirming(true);
  };

  return (
    <>
      <Button
        disabled={!groupName}
        variant='dark'
        className=' background-dark border-0'
        onClick={() => {
          handleShow();
        }}
        data-cy='edit-group'
      >
        <img alt='Edit Group' src='/APPIcons/gear-fill.svg'></img>
      </Button>

      <Modal show={show} onHide={() => handleClose()}>
        <div className='rounded'>
          <Form onSubmitCapture={(e) => e.preventDefault()}>
            <Modal.Header closeButton>
              <Modal.Title className='groups-overflow'>
                {isOwner ? 'Edit: ' : null} {groupName}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form.Group controlId='groupName' className='m-0'>
                <Form.Label>Group name</Form.Label>
                <Form.Control
                  disabled={!isOwner}
                  type='text'
                  value={formState.groupName}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      groupName: e.target.value,
                    }))
                  }
                  data-cy='edit-group-name'
                />
              </Form.Group>

              {isOwner && (
                <div className='d-flex border rounded mt-2 align-items-center'>
                  <Col
                    xs={3}
                    className='text-center border-end d-flex flex-column justify-content-center'
                    style={{ maxHeight: 86 }}
                  >
                    <GroupIcon id={formState.icon.id} fillColor={formState.icon.color} />
                  </Col>
                  <Col className='d-flex align-items-center'>
                    <Form.Group controlId='groupIcon' className='mb-0 w-100'>
                      <div className='d-flex align-items-center text-end'>
                        <Form.Label className='mb-0 me-2' style={{ minWidth: 45 }}>
                          Icon
                        </Form.Label>
                        <Form.Control
                          className='w-100'
                          type='number'
                          min={1}
                          max={28}
                          value={formState.icon.id}
                          disabled={!isOwner}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              icon: { ...prev.icon, id: Number(e.target.value) },
                            }))
                          }
                          data-cy='edit-group-icon'
                          style={{ width: 70 }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col className='d-flex align-items-center text-end'>
                    <Form.Group controlId='iconColor' className='mb-0 w-100'>
                      <div className='d-flex align-items-center pe-3'>
                        <Form.Label className='mb-0 me-2' style={{ minWidth: 45 }}>
                          Color
                        </Form.Label>
                        <Form.Control
                          className='w-100'
                          type='color'
                          value={formState.icon.color}
                          disabled={!isOwner}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              icon: { ...prev.icon, color: e.target.value },
                            }))
                          }
                          data-cy='edit-icon-color'
                          style={{ width: 50, height: 38, padding: 0, border: 'none', background: 'none' }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer className='justify-content-between border-0 pt-0'>
              {confirming && (
                <Col xs={12} className='p-0'>
                  <Alert key='danger' variant='danger' className='w-100'>
                    {isOwner
                      ? 'Be careful! Delete will permanently remove all group members and data.'
                      : 'Are you sure you want to leave this group?'}
                  </Alert>
                </Col>
              )}

              {isOwner && (
                <Button
                  as='input'
                  value='Save'
                  disabled={loading}
                  variant='dark'
                  className='background-dark border-0'
                  type='button'
                  onClick={() => editGroup(id, formState, handleClose, setLoading)}
                />
              )}

              <Button
                as='input'
                value={
                  isOwner
                    ? confirming
                      ? "Yes, I'm sure. Delete!"
                      : 'Delete'
                    : confirming
                    ? "Yes, I'm sure. Leave Group!"
                    : 'Leave Group'
                }
                disabled={loading}
                variant='danger'
                className='background-danger border-0'
                type='button'
                onClick={isOwner ? handleDelete : handleLeave}
                data-cy={isOwner ? (confirming ? 'confirm-delete' : 'delete') : undefined}
              />
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
                    {isOwner ? (
                      <Col xs='auto'>
                        <Button
                          disabled={loading}
                          variant='danger'
                          className='background-danger border-0'
                          id={member.id}
                          type='button'
                          onClick={(e) => {
                            removeMember(id, e.target.id, setLoading, handleClose);
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

          {isOwner && (
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
                          addMember(memberRef, groupMembers, setAlert, setLoading, id, resetState);
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
