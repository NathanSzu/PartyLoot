import React from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { AddDiscovery } from './RecordDiscovery';

export default function UserDiscoveriesControls({ show, setShow, displayName, getCompendium, setOglTab }) {
  return (
    <>
      <Card className='rounded-0 rounded-bottom background-light border-dark border-bottom-0 border-end-0 border-start-0'>
        <Card.Header>
          <Row>
            <Col>
              <p className='vertical-center'>
                <span className='p-2 badge rounded-pill bg-light text-dark me-1'>User | {displayName}</span>
              </p>
            </Col>
            <Col className='text-end'>
              <Button variant='dark' className='background-dark' onClick={() => {setShow(!show); setOglTab(false);}}>
                {show ? 'All discoveries' : 'My discoveries'}
              </Button>
            </Col>
          </Row>
        </Card.Header>
      </Card>
      {show && (
        <Card>
          <Card.Header>
            <Row>
              <Col>
                <p className='m-0 text-center fs-md-deco mx-auto fancy-font text-dark'>
                  Tap <AddDiscovery getCompendium={getCompendium} /> to record a discovery.
                </p>
              </Col>
            </Row>
          </Card.Header>
        </Card>
      )}
    </>
  );
}
