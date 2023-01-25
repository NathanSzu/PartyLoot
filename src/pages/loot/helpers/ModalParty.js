import React, { useContext, useState, useRef } from 'react';
import { Form, Row, Col, Button, Modal, Container } from 'react-bootstrap';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import fb from 'firebase';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import FavoriteIcon from './FavoriteIcon';

export default function ModalParty({ itemOwners }) {
  const { currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const groupRef = db.collection('groups').doc(currentGroup);
  const itemOwnersRef = groupRef.collection('itemOwners');
  const addItemOwnerRef = useRef('');

  const [partyData] = useDocumentData(groupRef);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addItemOwner = () => {
    if (!addItemOwnerRef.current.value) {
      console.error('Enter a name first');
      return;
    }
    setLoading(true);
    itemOwnersRef
      .add({
        name: addItemOwnerRef.current.value,
        type: 'party',
        createdOn: fb.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        addItemOwnerRef.current.value = '';
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  const removeItemOwner = (itemOwnerId) => {
    setLoading(true);
    itemOwnersRef
      .doc(itemOwnerId)
      .update({
        type: 'deleted',
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  return (
    <div>
      <Button className='w-100 pl-0 pr-0 background-dark border-0' variant='dark' onClick={handleShow}>
        <img alt='Edit Party' src='APPIcons/view-users.svg' />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Party Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form
              className='rounded'
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Row>
                <Col className='pl-0' xs={10}>
                  <Form.Control type='input' placeholder='Add Party Members' ref={addItemOwnerRef}></Form.Control>
                </Col>
                <Col className='pl-2' xs={2}>
                  <Button disabled={loading} variant='dark' type='submit' onClick={addItemOwner}>
                    <img alt='Add Party Member' src='APPIcons/add-user.svg' />
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          {itemOwners &&
            itemOwners.map((itemOwner) => (
              <Container key={itemOwner.id}>
                <Row>
                  <Col className='pl-0' xs={10}>
                    <p className='vertical-center'>
                      <FavoriteIcon groupRef={groupRef} currentGroupData={partyData} itemOwnerId={itemOwner.id} />
                      {itemOwner.name}
                    </p>
                  </Col>
                  <Col className='pl-2' xs={2}>
                    <Button
                      disabled={loading}
                      variant='danger'
                      type='button'
                      onClick={() => {
                        removeItemOwner(itemOwner.id);
                      }}
                    >
                      <img alt='Delete Group' src='APPIcons/remove-user.svg'></img>
                    </Button>
                  </Col>
                </Row>
              </Container>
            ))}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
