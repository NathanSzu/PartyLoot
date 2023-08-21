import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';

export default function Welcome({ setWelcome, setLogin }) {
  const showForms = () => {
    setWelcome(false);
    setLogin(true);
  };

  return (
    <Container fluid className='background-light rounded-bottom p-3' data-cy='welcome-message'>
      <Row border='dark'>
        <Col xs={12} sm={10} md={8} className='ms-auto me-auto'>
          <div className='p-3 fs-5'>
            <h1 className='text-center mb-4 background-dark rounded text-light p-2'>Welcome to Party Loot</h1>
            <p>Track your adventuring inventory like never before!</p>
            <ul>
              <li>Record updates in real time</li>
              <li>Collaboratively view party items</li>
              <li>Track customizable currency</li>
              <li>Access unique homebrew items</li>
            </ul>
            <p>
              Tap "Get Started" to set up an account, or "Patreon" if you'd like to support this free application for
              others.
            </p>
            <p className='mb-4'>
              With this page open in your mobile browser remember to select <strong>add to home screen</strong> for the
              full experience.
            </p>
          </div>
        </Col>
      </Row>
      <Row className='pb-3 justify-content-center'>
        <Col xs={4} className=''>
          <a href='https://www.patreon.com/dndnathan?fan_landing=true' target='blank'>
            <Button variant='light' className='w-100 shadow'>
              Patreon
            </Button>
          </a>
        </Col>
        <Col xs={4} className=''>
          <Button variant='light' className='w-100 shadow' data-cy='get-started' onClick={showForms}>
            Get Started
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
