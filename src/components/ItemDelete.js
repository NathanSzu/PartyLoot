import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';

export default function ModalLoot({ item }) {
  const { currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const deleteItem = () => {
    setLoading(true);
    handleClose();
    itemRef
      .delete()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error removing item: ', error);
      });
  };

  return (
    <>
      <Badge
        as='button'
        className='mt-3 mr-2 p-0 pl-3 pr-3 background-danger border-0'
        disabled={loading}
        type='button'
        onClick={handleShow}
      >
        <img alt='Sell Item' src='APPIcons/trash-fill.svg'></img>
      </Badge>

      <Modal show={show} onHide={handleClose}>
        <Form className='rounded'>
          <Modal.Header closeButton>
            <Modal.Title>Delete item?</Modal.Title>
          </Modal.Header>
          <Modal.Body>This action cannot be undone!</Modal.Body>
          <Modal.Footer className='pt-0'>
            <Button
              className='mt-3 p-2 pl-3 pr-3 background-danger border-0 text-light'
              disabled={loading}
              variant='danger'
              type='button'
              onClick={deleteItem}
            >
              Yes, delete item!
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
