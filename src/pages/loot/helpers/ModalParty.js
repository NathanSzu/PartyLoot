import React, { useContext, useState, useRef, useEffect } from 'react';
import { Form, Row, Col, Button, Modal, Container, Accordion } from 'react-bootstrap';
import fb from 'firebase';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import EditItemOwnerAccordion from './EditItemOwnerAccordion';

export default function ModalParty({ itemOwners }) {
  const { currentGroup } = useContext(GroupContext);
  const { db, currentUser } = useContext(AuthContext);
  const { writeHistoryEvent } = useContext(GlobalFeatures);

  const groupRef = db.collection('groups').doc(currentGroup);
  const itemOwnersRef = groupRef.collection('itemOwners');
  const addItemOwnerRef = useRef('');

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [noDeletedOwners, setNoDeletedOwners] = useState([]);

  useEffect(() => {
    itemOwners &&
      setNoDeletedOwners(
        itemOwners.filter((itemOwner) => {
          return itemOwner.type !== 'deleted';
        })
      );
  }, [itemOwners]);

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
        writeHistoryEvent(currentUser.uid, 'addPartyMember', { name: addItemOwnerRef.current.value }).then(() => {
          addItemOwnerRef.current.value = '';
          setLoading(false);
        });
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  return (
    <>
      <Button className='w-100 background-dark border-0' variant='dark' onClick={handleShow}>
        <img alt='Edit Party' src='APPIcons/view-users.svg' />
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
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
                <Col className='ps-0' xs={10}>
                  <Form.Control type='input' placeholder='Add Party Members' ref={addItemOwnerRef}></Form.Control>
                </Col>
                <Col className='px-0 text-end' xs={2}>
                  <Button disabled={loading} className='w-100 background-dark' variant='dark' type='submit' onClick={addItemOwner}>
                    <img alt='Add Party Member' src='APPIcons/add-user.svg' />
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Container className='px-0'>
            <div class='accordion' id='partyAccordion'>
              {noDeletedOwners.map((itemOwner) => (
                <EditItemOwnerAccordion key={itemOwner.id} itemOwner={itemOwner} handleClose={handleClose}/>
              ))}
            </div>
          </Container>
        </Modal.Footer>
      </Modal>
    </>
  );
}
