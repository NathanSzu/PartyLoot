import React, { useContext, useState } from 'react';
import ModalEditUser from '../components/ModalEditUsername';
import ModalAppRequestTrigger from '../components/ModalAppRequestTrigger';
import { Row, Col, Alert, Button, Container } from 'react-bootstrap';
import { AuthContext } from '../utils/contexts/AuthContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import app from '../utils/firebase';
import ButtonShareLink from '../components/ButtonShareLink';

export default function Settings() {
  const { currentUser, userRef } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [userData] = useDocumentData(userRef);

  const passwordReset = (email) => {
    setLoading(true);
    app
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        // Email sent.
        setResetEmailSent(true);
        setLoading(false);
      })
      .catch(function (error) {
        // An error happened.
        setLoading(false);
      });
  };

  return (
    <Container>
      <Row className='background-unset add-background-light pt-3 pb-4 border-top border-dark'>
        <div className='p-2 m-0 w-100'>
          <Col xs={12}>
            <h1 className='text-center settings-h1'>Account Settings</h1>
          </Col>

          <Col md={8} className='p-3 mr-auto ml-auto'>
            <p className='settings-p m-0'>
              <span className='font-weight-bold'>Username:</span> {userData && userData.displayName}
            </p>
            <p className='settings-p m-0'>
              <span className='font-weight-bold'>Group Code:</span> {userData && userData.code}
            </p>
          </Col>

          <Col md={8} className='mr-auto ml-auto'>
            <ModalEditUser loading={loading} setLoading={setLoading} userData={userData} />
          </Col>

          <Col md={8} className='mr-auto ml-auto'>
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
              <Alert variant={'success'}>Your email has been sent. Please check your inbox!</Alert>
            )}
          </Col>
        </div>
      </Row>

      <Row className='background-unset add-background-light pt-3 pb-4 border-top border-dark'>
        <div className='p-2 m-0 w-100'>
          <Col xs={12} className='mb-4'>
            <h2 className='text-center settings-h2'>Want to support the app?</h2>
          </Col>
          <Col md={8} className='mr-auto ml-auto'>
            <ButtonShareLink />
          </Col>
          <Col md={8} className='mr-auto ml-auto'>
            {/* <Button variant="dark background-dark w-100 mb-2">Report a Bug</Button> */}
            <a href='https://www.patreon.com/dndnathan?fan_landing=true' target='blank'>
              <Button variant='dark background-dark w-100 mb-2'>Visit our Patreon</Button>
            </a>
          </Col>
          <Col md={8} className='mr-auto ml-auto'>
            <ModalAppRequestTrigger />
          </Col>
        </div>
      </Row>
    </Container>
  );
}
