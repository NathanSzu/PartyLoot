import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function IntroCard() {
  const navigate = useNavigate();

  return (
    <>
      <Row className='border-top border-dark background-light mx-1 rounded'>
        <Col className='groups-overflow px-3 py-2'>
          <span className='fancy-font fs-md-deco'>Hey there first timer!</span>
          <p className='m-0'>Create a new group above, or share your party code to join an existing crew</p>
        </Col>
        <Col xs={3} className='auto d-flex align-items-center'>
          <div className='vstack gap-1 col-md-5 mx-auto my-2'>
            <Button disabled variant='dark' className=' background-dark border-0'>
              <img alt='Edit Group' src='/APPIcons/gear-fill.svg'></img>
            </Button>

            <Button disabled>View</Button>
          </div>
        </Col>
      </Row>
      <Row className='border-top border-dark background-light mx-1 rounded'>
        <Col className='groups-overflow px-3 py-2'>
          You can view your party code from the{' '}
          <Button className='p-0 m-0' variant='link' onClick={() => navigate('/settings')}>
            settings
          </Button>{' '}
          page
        </Col>
      </Row>
    </>
  );
}
