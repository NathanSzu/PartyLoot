import { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, ListGroup, InputGroup } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { getGroupMembers, editGroup, deleteGroup, addMember, removeMember } from '../../../controllers/groupController';
import GroupIcon from '../../../assets/GroupIcon';

export default function EditGroup({ group }) {
  const { groupName, id, owner, members, gameMasters = [] } = group;
  const { currentUser } = useContext(AuthContext);
  const { groups } = useContext(GroupContext);
  const { setToastContent, setToastHeader, toggleShowToast } = useContext(GlobalFeatures);
  const isOwner = currentUser?.uid === owner;
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
    if (members && members.length > 0) {
      getGroupMembers(members, setGroupMembers, setLoading);
    }
  }, [members]);

  // Reset state when currentUser changes (user logout/login)
  useEffect(() => {
    if (!currentUser) {
      // Only reset when user is completely logged out
      setGroupMembers([]);
      setAlert(null);
      setConfirming(false);
      setLoading(false);
      setShow(false);
    }
    // Update form state when group data changes
    setFormState({
      groupName: groupName || '',
      icon: {
        id: group.icon?.id || 1,
        color: group.icon?.color || '#000000',
      },
    });
  }, [currentUser, groupName, group.icon?.id, group.icon?.color]);

  // Close modal if user is no longer owner (only on user change, not ownership change)
  useEffect(() => {
    if (show && !currentUser) {
      // Only close if user is logged out completely
      setShow(false);
    }
  }, [show, currentUser]);

  const resetState = () => {
    setConfirming(false);
    setAlert(null);
    // Don't reset groupMembers here - let the useEffect handle it
    setLoading(false);
    // Reset form state to current group data
    setFormState({
      groupName: groupName || '',
      icon: {
        id: group.icon?.id || 1,
        color: group.icon?.color || '#000000',
      },
    });
  };

  const toggleGMStatus = async (memberId, isCurrentlyGM) => {
    if (!isOwner) return;

    setLoading(true);
    setAlert(null);

    try {
      const groupRef = groups.doc(id);
      let updatedGMs;
      
      if (isCurrentlyGM) {
        // Remove GM status
        updatedGMs = gameMasters.filter(gmId => gmId !== memberId);
      } else {
        // Add GM status
        updatedGMs = [...gameMasters, memberId];
      }

      await groupRef.update({
        gameMasters: updatedGMs
      });

      const memberName = groupMembers.find(m => m.id === memberId)?.displayName || 'User';
      const isOwnerTogglingSelf = memberId === currentUser.uid;
      
      setToastHeader('GM Permissions Updated');
      setToastContent(
        `${isOwnerTogglingSelf ? 'You have' : memberName + ' has'} been ${isCurrentlyGM ? 'removed from' : 'granted'} Game Master permissions.`
      );
      toggleShowToast();

    } catch (error) {
      console.error('Error updating GM permissions:', error);
      setAlert('Failed to update GM permissions. Please try again.');
    } finally {
      setLoading(false);
    }
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
                {isOwner ? 'Edit: ' : 'View: '} {groupName}
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
                <Row className='pe-2'>
                  <Col xs={3}>
                    <div className='d-flex justify-content-center align-items-center' style={{ height: '86px' }}>
                      <GroupIcon id={formState.icon.id} fillColor={formState.icon.color} />
                    </div>
                  </Col>
                  <Col xs={6}>
                    <Form.Group controlId='groupIcon' className='mb-0 w-100'>
                      <Form.Label className='mb-1'>Icon</Form.Label>
                      <InputGroup>
                        <Button
                          variant='outline-secondary'
                          disabled={!isOwner || formState.icon.id <= 1}
                          onClick={() =>
                            setFormState((prev) => ({
                              ...prev,
                              icon: { ...prev.icon, id: Math.max(1, prev.icon.id - 1) },
                            }))
                          }
                          data-cy='decrement-icon'
                        >
                          -
                        </Button>
                        <Form.Control
                          className='border-secondary text-center'
                          type='number'
                          min={1}
                          max={28}
                          value={formState.icon.id}
                          disabled
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              icon: { ...prev.icon, id: Number(e.target.value) },
                            }))
                          }
                          data-cy='edit-group-icon'
                        />
                        <Button
                          variant='outline-secondary'
                          disabled={!isOwner || formState.icon.id >= 28}
                          onClick={() =>
                            setFormState((prev) => ({
                              ...prev,
                              icon: { ...prev.icon, id: Math.min(28, prev.icon.id + 1) },
                            }))
                          }
                          data-cy='increment-icon'
                        >
                          +
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId='iconColor' className='mb-0 w-100'>
                      <Form.Label className='mb-1'>Color</Form.Label>
                      <Form.Control
                        className='w-100 p-0'
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
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <Form.Label className='pt-3'>Group members</Form.Label>

              <ListGroup className='mt-1'>
                {groupMembers &&
                  groupMembers.map((member) => {
                    const isGM = gameMasters.includes(member.id);
                    const isSelf = member.id === currentUser.uid;
                    return (
                      <ListGroup.Item
                        key={member.id}
                        className='d-flex justify-content-between align-items-center'
                        variant={isSelf ? 'secondary' : undefined}
                      >
                        <div>
                          <span>
                            {member.displayName}
                            {isSelf && ' (You)'}
                          </span>
                          {isGM && (
                            <span className='badge bg-success ms-2'>GM</span>
                          )}
                        </div>
                        
                        {isOwner && (
                          <div className='d-flex gap-2'>
                            <Button
                              variant={isGM ? 'outline-danger' : 'outline-success'}
                              size='sm'
                              disabled={loading}
                              onClick={() => toggleGMStatus(member.id, isGM)}
                              title={isGM ? 'Remove GM permissions' : 'Grant GM permissions'}
                            >
                              {isGM ? '- GM' : '+ GM'}
                            </Button>
                            {!isSelf && (
                              <Button
                                disabled={loading}
                                variant='danger'
                                className='background-danger'
                                id={member.id}
                                type='button'
                                onClick={(e) => {
                                  removeMember(id, e.target.id, setLoading, handleClose);
                                }}
                                data-cy='remove-member'
                                size='sm'
                                title='Remove member from group'
                              >
                                <img alt='Delete Group' id={member.id} src='/APPIcons/remove-user.svg' />
                              </Button>
                            )}
                          </div>
                        )}
                      </ListGroup.Item>
                    );
                  })}

                {isOwner && (
                  <ListGroup.Item>
                    <Form className='w-100' onSubmitCapture={(e) => e.preventDefault()}>
                      <Row>
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
                        <Col xs={2} className='ps-0 text-end'>
                          <Button
                            disabled={loading}
                            variant='dark'
                            className='background-dark'
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
                        <Col xs={12}>
                          {alert && (
                            <Alert variant='warning' className='mt-3 py-2'>
                              {alert}
                            </Alert>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  </ListGroup.Item>
                )}
              </ListGroup>
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
        </div>
      </Modal>
    </>
  );
}
