import React, { useState, useRef, useContext } from 'react';
import { Accordion, Card, Col, Row, Container, Button, Alert, Form, useAccordionToggle } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function EditItemOwnerAccordion({ itemOwner }) {
  const { currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const groupRef = db.collection('groups').doc(currentGroup);
  const itemOwnersRef = groupRef.collection('itemOwners');

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const nameRef = useRef();

  const removeItemOwner = (itemOwnerId) => {
    setLoadingDelete(true);
    itemOwnersRef
      .doc(itemOwnerId)
      .update({
        type: 'deleted',
      })
      .then(() => {
        setLoadingDelete(false);
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  const saveNameChange = (itemOwnerId) => {
    setLoadingSave(true);
    itemOwnersRef
      .doc(itemOwnerId)
      .update({
        name: nameRef.current.value,
      })
      .then(() => {
        setLoadingSave(false);
        toggleAccordion()
        
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  const toggleAccordion = useAccordionToggle(itemOwner.id)

  return (
    <Card className='loot-item' key={itemOwner.id}>
      <Accordion.Toggle
        as={Card.Header}
        variant='link'
        eventKey={itemOwner.id}
        className='pr-0'
        onClick={() => setShowConfirmation(false)}
      >
        <Container className='pr-0'>
          <Row className='mr-1'>
            <Col className='pl-0 pr-0 itemOwner-h1 my-auto'>{itemOwner.name}</Col>
            <Col xs={2} className='p-0'>
              <Button variant='dark' className='background-dark'>
                <img alt='Edit Group' src='/APPIcons/pencil-square.svg' />
              </Button>
            </Col>
          </Row>
        </Container>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={itemOwner.id}>
        <Card.Body className='background-light p-2'>
          <Container className='pl-2 pr-2 pt-0'>
            <Row className='pt-1 pb-1'>
              <Col className=''>
                <Form.Control ref={nameRef} disabled={loadingSave} type='text' defaultValue={itemOwner.name} />
              </Col>
              <Col xs={4} className='text-right d-flex'>
                <Button
                  disabled={loadingSave}
                  onClick={() => saveNameChange(itemOwner.id)}
                  variant='success'
                  className='text-right mr-2'
                >
                  <img alt='Save name change' src='/APPIcons/person-fill-up.svg' />
                </Button>

                {!showConfirmation ? (
                  <Button variant='danger' className='background-danger' onClick={() => setShowConfirmation(true)}>
                    <img alt='Delete member' src='/APPIcons/remove-user.svg' />
                  </Button>
                ) : (
                  <Button
                    disabled={loadingDelete}
                    onClick={() => removeItemOwner(itemOwner.id)}
                    variant='danger'
                    className='background-danger'
                  >
                    <img alt='Confirm delete item' src='/APPIcons/person-x-fill.svg' />
                  </Button>
                )}
              </Col>
            </Row>
            {showConfirmation && (
              <Row className='pt-1 pb-1'>
                <Alert variant='danger'>
                  <p>{`Delete ${itemOwner.name}?`}</p>
                  <p>Deleting an item owner is a permanent action.</p>
                  <p>{`This will not delete items in ${itemOwner.name}'s inventory.`}</p>
                </Alert>
              </Row>
            )}
          </Container>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
