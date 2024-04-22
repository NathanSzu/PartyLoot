import React, { useContext, useState } from 'react';
import { Col, Button, Card } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebaseApp from '../../../utils/firebase';
import ModalEditUsername from './ModalEditUsername';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';

export default function AccountSettingsCard() {
  const { currentUser, userRef } = useContext(AuthContext);
  const { setToastContent, setToastHeader, toggleShowToast, clearLocalStorageItems } = useContext(GlobalFeatures);

  const [loading, setLoading] = useState(false);

  const [userData] = useDocumentData(userRef);

  const passwordReset = (email) => {
    setLoading(true);
    firebaseApp
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        setToastHeader('Reset email sent');
        setToastContent('Your email has been sent. Please check your inbox and spam folder.');
        toggleShowToast();
        setLoading(false);
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  const handleTutorialReset = () => {
    const tutorialCards = ['groupIntroCard', 'lootIntroCard'];
    clearLocalStorageItems(tutorialCards);
    setToastHeader('Tutorial reset complete');
    setToastContent('All tutorial messages have been reset and should show again.');
    toggleShowToast();
  };

  return (
    <Col lg={8} className='mx-auto pt-2'>
      <Card>
        <Card.Header>
          <h1 className='text-center fancy-font fs-md-deco m-0'>Account Settings</h1>
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
              onClick={(e) => {
                e.preventDefault();
                passwordReset(currentUser.email);
              }}
            >
              Reset Password
            </Button>
          </Col>
          <Col md={8} className='mx-auto mt-2'>
            <Button
              className='w-100 background-dark border-0'
              variant='dark'
              onClick={(e) => {
                e.preventDefault();
                handleTutorialReset();
              }}
            >
              Enable Tutorials
            </Button>
          </Col>
        </Card.Body>
      </Card>
    </Col>
  );
}
