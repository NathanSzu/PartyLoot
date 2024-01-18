import React from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { AddDiscovery } from './RecordDiscovery';

export default function UserDiscoveriesControls({ show, setShow, displayName, getCompendium, setOglTab }) {
  return (
    <Card className='rounded-0 border-0 rounded-bottom background-light'>
      <Card.Header>
        <Row>
          <Col>
            <span className='p-2 mt-1 badge rounded-pill bg-light text-dark'>User | {displayName}</span>
          </Col>
          <Col className='text-end'>
            <Button
              data-cy={show ? 'all-discoveries' : 'my-discoveries'}
              variant='dark'
              className='background-dark'
              onClick={() => {
                setShow(!show);
                setOglTab(false);
              }}
            >
              {show ? 'All discoveries' : 'My discoveries'}
            </Button>
          </Col>
        </Row>
      </Card.Header>

      {show && (
        <>
          <Card.Footer>
            <Row>
              <Col>
                <p className='m-0 text-center fs-md-deco mx-auto fancy-font text-dark'>
                  Tap <AddDiscovery getCompendium={getCompendium} /> to record a discovery.
                </p>
              </Col>
            </Row>
          </Card.Footer>
        </>
      )}
    </Card>
  );
}
