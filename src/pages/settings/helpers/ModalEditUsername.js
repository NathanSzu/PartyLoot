import React, { useState, useContext, useRef } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function ModalEditUsername({ userData }) {
  const { db, setUsername } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setAlert('');
    setShow(true);
  };
  const usernameRef = useRef(null);

  const uniqueNameCheck = (value) => {
    db.collection('users')
      .where('displayName', '==', value)
      .limit(1)
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length === 0) {
          setUsername(value).then(() => {
            handleClose();
            setLoading(false);
          });
        } else {
          setAlert('Username taken!');
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error checking username: ', err);
      });
  };

  const save = (e) => {
    e.preventDefault();
    let value = usernameRef?.current?.value.trim();
    if (value === userData?.displayName?.trim()) {
      return;
    }
    setLoading(true);
    uniqueNameCheck(value);
  };

  return (
    <>
      <Button variant='dark' className='p-2 mb-2 w-100 background-dark border-0' onClick={handleShow}>
        Change Username
      </Button>

      <Modal
        show={show}
        onHide={() => {
          handleClose();
        }}
      >
        <Form className='rounded'>
          <Modal.Header closeButton>
            <Modal.Title>Change Username</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId='Username'>
              <Form.Control type='text' ref={usernameRef} defaultValue={userData?.displayName} />
            </Form.Group>
            {alert && <Alert variant={'warning'}>{alert}</Alert>}
          </Modal.Body>

          <Modal.Footer>
            <Button disabled={loading} variant='dark' className='background-dark border-0' type='submit' onClick={save}>
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
