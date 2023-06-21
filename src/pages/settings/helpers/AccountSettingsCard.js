import React, { useContext, useState } from 'react';
import { Col, Button, Card, Alert } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebaseApp from '../../../utils/firebase';
import ModalEditUsername from './ModalEditUsername';

export default function AccountSettingsCard() {
  const { currentUser, userRef } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [userData] = useDocumentData(userRef);

  const passwordReset = (email) => {
    setLoading(true);
    firebaseApp
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        setResetEmailSent(true);
        setLoading(false);
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  return (
    <Col md={8} className='mx-auto'>
      <Card>
        <Card.Header>
          <h1 className='text-center settings-h1'>Account Settings</h1>
        </Card.Header>
        <Card.Body>
          <Card.Title>Username: {userData?.displayName}</Card.Title>
          <Card.Text>
            Click the button below to change your name. This username is shared for your whole account and is not
            specific to each group.
          </Card.Text>
          <Card.Title>Party code: {userData?.code}</Card.Title>
          <Card.Text>
            This is a unique code specific to your account. Party owners will need to use this code to add you as a
            member.
          </Card.Text>
          <Col md={8} className='mx-auto'>
            <ModalEditUsername userData={userData} />
          </Col>
          <Col md={8} className='mx-auto'>
            <Button
              className='w-100 background-dark border-0'
              disabled={loading}
              variant='dark'
              type='submit'
              onClick={(e) => {
                e.preventDefault();
                passwordReset(currentUser.email);
              }}
            >
              Reset Password
            </Button>
            {!resetEmailSent ? null : (
              <Alert variant={'success'}>Your email has been sent. Please check your inbox and spam folder!</Alert>
            )}
          </Col>
        </Card.Body>
      </Card>
    </Col>
  );
}
