import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function Welcome() {
  return (
    <Container fluid className='background-light rounded-bottom p-3' data-cy='welcome-message'>
      <Row className='justify-content-center p-3'>
        <Col xs={4} sm={4} md={3} className='p-0'>
          <img src='/PWAIcons/PL_Icon.svg' fetchPriority='high' className='img-fluid rounded-start' alt='Party loot icon' />
        </Col>
        <Col xs={8} sm={6} md={5} className='text-center background-white rounded-end d-flex align-items-center py-2'>
          <h1 className='w-100'>Welcome to Party Loot</h1>
        </Col>
      </Row>
      <Row>
        <Col sm={10} md={8} className='mx-auto pt-3'>
          <h2 className='text-center background-dark rounded text-light p-2 m-0'>Adventure awaits</h2>
        </Col>
      </Row>
      <Row>
        <Col sm={10} md={8} className='mx-auto pb-3'>
          <ul className='list-group list-group-horizontal'>
            <li className='list-group-item flex-fill d-flex align-items-center fs-sm-deco'>Record updates in real time</li>
            <li className='list-group-item d-flex align-items-center'>
              <img src='/APPIcons/Home/clock-fill.svg' alt='Realt time updates' width='40' height='40' />
            </li>
          </ul>
          <ul className='list-group list-group-horizontal'>
            <li className='list-group-item flex-fill d-flex align-items-center fs-sm-deco'>
              Collaboratively view party items
            </li>
            <li className='list-group-item d-flex align-items-center'>
              <img src='/APPIcons/Home/people-fill.svg' alt='Collaborative tracking' width='40' height='40' />
            </li>
          </ul>
          <ul className='list-group list-group-horizontal'>
            <li className='list-group-item flex-fill d-flex align-items-center fs-sm-deco'>Track customizable currency</li>
            <li className='list-group-item d-flex align-items-center'>
              <img src='/APPIcons/Home/piggy-bank-fill.svg' alt='Customizable currency' width='40' height='40' />
            </li>
          </ul>
          <ul className='list-group list-group-horizontal'>
            <li className='list-group-item flex-fill d-flex align-items-center fs-sm-deco'>Access unique homebrew items</li>
            <li className='list-group-item d-flex align-items-center'>
              <img src='/APPIcons/Home/shield-fill-plus.svg' alt='Homebrew library' width='40' height='40' />
            </li>
          </ul>
        </Col>
      </Row>
      <Row>
        <Col sm={10} md={8} className='mx-auto pt-3'>
          <h2 className='text-center background-dark rounded text-light p-2 m-0'>Start tracking today</h2>
        </Col>
      </Row>
      <Row>
        <Col sm={10} md={8} className='mx-auto pb-3'>
          <ul className='list-group list-group-horizontal'>
            <li className='list-group-item flex-fill d-flex align-items-center fs-sm-deco'>Create account/login</li>
            <li className='list-group-item d-flex align-items-center'>
              <LinkContainer to='/login'>
                <Button variant='dark background-dark' className='minw-button' data-cy='get-started'>
                  Get Started
                </Button>
              </LinkContainer>
            </li>
          </ul>
          <ul className='list-group list-group-horizontal'>
            <li className='list-group-item flex-fill d-flex align-items-center fs-sm-deco'>Support us on patreon</li>
            <li className='list-group-item d-flex align-items-center'>
              <a href='https://www.patreon.com/dndnathan?fan_landing=true' target='blank'>
                <Button variant='dark background-dark' className='minw-button'>
                  Patreon
                </Button>
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
