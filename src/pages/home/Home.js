import React, { useState } from 'react';
import Welcome from './helpers/Welcome';
import Login from './helpers/BootLogin';
import { Row, Col } from 'react-bootstrap';

export default function Home() {
  const [login, setLogin] = useState(null);
  const [welcome, setWelcome] = useState(true);

  return (
    <div className='p-0'>
      {welcome ? (
        <Welcome setLogin={setLogin} setWelcome={setWelcome} />
      ) : (
        <Row className='justify-content-md-center'>
          <Col>
            <Login login={login} setLogin={setLogin} />
          </Col>
        </Row>
      )}
    </div>
  );
}
