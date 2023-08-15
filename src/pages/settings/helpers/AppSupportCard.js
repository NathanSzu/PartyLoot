import React from 'react';
import { Col, Button, Card } from 'react-bootstrap';
import ModalAppRequest from './ModalAppRequest';
import ButtonShareLink from '../../common/ButtonShareLink';

export default function AccountSettingsCard() {
  return (
    <Col md={8} className='mx-auto'>
      <Card>
        <Card.Header>
          <h1 className='text-center fancy-font fs-md-deco m-0'>Help support us!</h1>
        </Card.Header>
        <Card.Body>
          <Card.Text>Here are some awesome ways you can help us make this application the best it can be!</Card.Text>
          <Col md={8} className='mx-auto'>
            <ButtonShareLink />
          </Col>
          <Col md={8} className='mx-auto'>
            <a href='https://www.patreon.com/dndnathan?fan_landing=true' target='blank'>
              <Button variant='dark background-dark w-100 mb-2'>Visit our Patreon</Button>
            </a>
          </Col>
          <Col md={8} className='mx-auto'>
            <ModalAppRequest />
          </Col>
        </Card.Body>
      </Card>
    </Col>
  );
}
