import React, { useState, useRef, useContext } from 'react';
import { Col, Row, Container, Button, Alert, Form } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function EditItemOwnerAccordion({ itemOwner, handleClose }) {
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
          checkFavorite(party, itemOwner) && setFavoriteItemOwner(itemOwner);
          handleClose();
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
          handleClose();
        });
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  const checkFavorite = (party, itemOwner) => {
    return party?.favorites?.[currentUser.uid] === itemOwner?.id;
  };

  const setFavoriteItemOwner = (itemOwner) => {
    setLoadingSave(true);
    groupRef
      .update({
        [`favorites.${currentUser.uid}`]: checkFavorite(party, itemOwner) ? 'party' : itemOwner.id,
      })
      .then(() => {
        handleClose();
        setLoadingSave(false);
      })
      .catch((err) => {
        console.error(err.code);
        console.error(err.message);
      });
  };

  return (
    <div class='accordion-item'>
      <h2 class='accordion-header' id={`partyHeading${itemOwner.id}`}>
        <button
          data-cy={itemOwner.name}
          class='accordion-button accordion-button-loot collapsed'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target={`#partyCollapse${itemOwner.id}`}
          aria-expanded='true'
          aria-controls={`partyCollapse${itemOwner.id}`}
          onClick={() => setShowConfirmation(false)}
        >
          {itemOwner.name}
        </button>
      </h2>
      <div
        id={`partyCollapse${itemOwner.id}`}
        class='accordion-collapse collapse background-light'
        aria-labelledby={`partyHeading${itemOwner.id}`}
        data-bs-parent='#partyAccordion'
      >
        <Container>
          <Row className='p-2'>
            <Col xs={2} lg={1} className='p-0 d-flex justify-content-start'>
              {checkFavorite(party, itemOwner) ? (
                <Button
                  data-cy='set-unfavorite'
                  className='background-dark'
                  disabled={loadingSave}
                  onClick={() => setFavoriteItemOwner(itemOwner)}
                  variant='dark'
                >
                  <img alt='Favorited' src='APPIcons/star-fill.svg' className='mb-1' />
                </Button>
              ) : (
                <Button
                  data-cy='set-favorite'
                  disabled={loadingSave}
                  onClick={() => setFavoriteItemOwner(itemOwner)}
                  variant='outline-dark'
                >
                  <img alt='Not favorited' src='APPIcons/star.svg' className='mb-1' />
                </Button>
              )}
            </Col>
            <Col className='p-0'>
              <Form.Control
                data-cy='edit-member-input'
                ref={nameRef}
                disabled={loadingSave}
                type='text'
                defaultValue={itemOwner.name}
              />
            </Col>
            <Col xs={2} lg={1} className='p-0 d-flex justify-content-end'>
              <Button
                data-cy='save-member-input'
                disabled={loadingSave}
                className='background-success'
                onClick={() => saveNameChange(itemOwner.id)}
                variant='success'
              >
                <img alt='Save name change' src='/APPIcons/person-fill-up.svg' />
              </Button>
            </Col>
            <Col xs={2} lg={1} className='p-0 d-flex justify-content-end'>
              {!showConfirmation ? (
                <Button
                  data-cy='delete-member'
                  variant='danger'
                  className='background-danger'
                  onClick={() => setShowConfirmation(true)}
                >
                  <img alt='Delete member' src='/APPIcons/remove-user.svg' />
                </Button>
              ) : (
                <Button
                  data-cy='confirm-delete-member'
                  disabled={loadingDelete}
                  onClick={() => removeItemOwner(itemOwner.id)}
                  variant='danger'
                  className='background-danger'
                >
                  <img alt='Confirm delete member' src='/APPIcons/person-x-fill.svg' />
                </Button>
              )}
            </Col>
          </Row>
          {showConfirmation && (
            <Row className='p-2'>
              <Alert variant='danger' className='m-0'>
                <p>{`Delete ${itemOwner.name}?`}</p>
                <p>Deleting an item owner is a permanent action.</p>
                <p>{`This will not delete items in ${itemOwner.name}'s inventory.`}</p>
              </Alert>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
}
