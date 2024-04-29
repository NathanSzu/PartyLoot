import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { GroupContext } from '../../../../utils/contexts/GroupContext';

export default function ItemDelete({ item }) {
  const { groupDoc } = useContext(GroupContext);

  const itemRef = groupDoc.collection('loot').doc(`${item.id}`);

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
      <Button
        data-cy='delete-item'
        className='mt-3 me-0 p-0 px-3 btn-danger background-danger border-0'
        disabled={loading}
        type='button'
        onClick={handleShow}
      >
        <img alt='Sell Item' src='APPIcons/trash-fill.svg'></img>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Form className='rounded' onSubmitCapture={(e) => e.preventDefault()}>
          <Modal.Header closeButton>
            <Modal.Title>Delete item?</Modal.Title>
          </Modal.Header>
          <Modal.Body>This action cannot be undone!</Modal.Body>
          <Modal.Footer className='pt-0'>
            <Button
              data-cy='confirm-item-delete'
              className='mt-3 p-2 px-3 background-danger border-0 text-light'
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
