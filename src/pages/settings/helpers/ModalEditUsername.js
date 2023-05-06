import React, { useState, useContext, useRef } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function ModalEditUsername({ userData }) {
  const { db, setUsername } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState('');
  const [validationMsg, setValidationMsg] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setAlert('');
    setValidationMsg('');
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

  const usernameIsValid = (value) => {
    setLoading(true);
    let regex = new RegExp('^[A-z0-9-_]{5,15}$');
    if (value === userData?.displayName?.trim()) return false;
    if (value.length < 5) {
      setValidationMsg('Username must contain at least 5 characters');
      return false;
    }
    if (value.length > 15) {
      setValidationMsg('Username must contain fewer than 15 characters');
      return false;
    }
    if (!regex.test(value)) {
      setValidationMsg('Username cannot contain spaces or special characters');
      return false;
    }
    setValidationMsg('');
    setLoading(false);
    return true;
  };

  const save = (e) => {
    e.preventDefault();
    let value = usernameRef?.current?.value.trim();

    if (usernameIsValid(value)) {
      setLoading(true);
      uniqueNameCheck(value);
    }
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
        <Form className='rounded' autoComplete='off'>
          <Modal.Header closeButton>
            <Modal.Title>Change Username</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId='Screen-name'>
              <Form.Label>
                <small>
                  This username will be publicly visible so please keep it clean! By setting a custom username you
                  acknowledge that any profane or offensive language is grounds for removal of community features from
                  your account.
                </small>
              </Form.Label>

              <Form.Control
                type='text'
                ref={usernameRef}
                defaultValue={userData?.displayName}
                onChange={() => usernameIsValid(usernameRef?.current?.value)}
              />
              {validationMsg && (
                <Form.Label className='text-danger'>
                  <small>{validationMsg}</small>
                </Form.Label>
              )}
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
