import React, { useContext, useState } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import firebaseApp from '../../../utils/firebase';
import ModalEditUsername from './ModalEditUsername';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';

export default function AccountSettingsCard() {
  const { currentUser, userData } = useContext(AuthContext);
  const { setToastContent, setToastHeader, toggleShowToast } = useContext(GlobalFeatures);

  const [loading, setLoading] = useState(false);

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
            <Row className='justify-content-center pt-3'>
              <Col xs={6} md={4}>
                <ModalEditUsername userData={userData} />
              </Col>
              <Col xs={6} md={4}>
                <Button
                  className='w-100 background-dark'
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
            </Row>
          </Card.Text>
          <Card.Title>Party code: {userData?.code}</Card.Title>
          <Card.Text>
            This is a unique code specific to your account. Party owners will need to use this code to add you as a
            member.
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}
