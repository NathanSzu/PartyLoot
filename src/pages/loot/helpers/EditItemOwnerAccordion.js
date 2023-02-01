import React, { useState, useRef, useContext } from 'react';
import { Accordion, Card, Col, Row, Container, Button, Alert, Form, useAccordionToggle } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function EditItemOwnerAccordion({ itemOwner }) {
  const { currentGroup } = useContext(GroupContext);
  const { db, currentUser } = useContext(AuthContext);
  const { writeHistoryEvent } = useContext(GlobalFeatures);

  const groupRef = db.collection('groups').doc(currentGroup);
  const itemOwnersRef = groupRef.collection('itemOwners');

  const [party] = useDocumentData(groupRef);

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
        writeHistoryEvent(currentUser.uid, 'deletePartyMember', { name: itemOwner.name }).then(() => {
          setLoadingDelete(false);
          setFavoriteItemOwner(itemOwner);
        });
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  const saveNameChange = (itemOwnerId) => {
    let itemOwnerName = itemOwner.name;
    setLoadingSave(true);
    itemOwnersRef
      .doc(itemOwnerId)
      .update({
        name: nameRef.current.value,
      })
      .then(() => {
        writeHistoryEvent(currentUser.uid, 'editPartyMember', {
          name: nameRef.current.value,
          oldName: itemOwnerName,
        }).then(() => {
          setLoadingSave(false);
          toggleAccordion();
        });
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  const toggleAccordion = useAccordionToggle(itemOwner.id);

  const checkFavorite = (party, itemOwner) => {
    if (party?.favorites && party?.favorites[currentUser.uid] === itemOwner.id) {
      return true;
    } else {
      return false;
    }
  };

  const setFavoriteItemOwner = (itemOwner) => {
    setLoadingSave(true);
    groupRef
      .update({
        [`favorites.${currentUser.uid}`]: checkFavorite(party, itemOwner) ? 'party' : itemOwner.id,
      })
      .then(() => {
        toggleAccordion();
        setLoadingSave(false);
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  return (
    <Card className='loot-item'>
      <Accordion.Toggle
        as={Card.Header}
        variant='link'
        className='pr-3 pl-3'
        eventKey={itemOwner.id}
        onClick={() => setShowConfirmation(false)}
      >
        <Container fluid>
          <Row>
            <Col className='pl-0 pr-0 itemOwner-h1 my-auto'>{itemOwner.name}</Col>
            <Col xs={2} className='pr-0 d-flex justify-content-end'>
              <Button variant='dark' className='background-dark'>
                <img alt='Edit Group' src='/APPIcons/pencil-square.svg' />
              </Button>
            </Col>
          </Row>
        </Container>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={itemOwner.id}>
        <Card.Body className='background-light pt-2 pb-2 pl-3 pr-3'>
          <Container>
            <Row className='pt-1 pb-1'>
              <Col xs={2} lg={1} className='p-0 d-flex justify-content-start'>
                {checkFavorite(party, itemOwner) ? (
                  <Button
                    className='background-dark'
                    disabled={loadingSave}
                    onClick={() => setFavoriteItemOwner(itemOwner)}
                    variant='dark'
                  >
                    <img alt='Favorited' src='APPIcons/star-fill.svg' className='mb-1' />
                  </Button>
                ) : (
                  <Button disabled={loadingSave} onClick={() => setFavoriteItemOwner(itemOwner)} variant='outline-dark'>
                    <img alt='Not favorited' src='APPIcons/star.svg' className='mb-1' />
                  </Button>
                )}
              </Col>
              <Col className='p-0'>
                <Form.Control ref={nameRef} disabled={loadingSave} type='text' defaultValue={itemOwner.name} />
              </Col>
              <Col xs={2} lg={1} className='p-0 d-flex justify-content-end'>
                <Button disabled={loadingSave} onClick={() => saveNameChange(itemOwner.id)} variant='success'>
                  <img alt='Save name change' src='/APPIcons/person-fill-up.svg' />
                </Button>
              </Col>
              <Col xs={2} lg={1} className='p-0 d-flex justify-content-end'>
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
