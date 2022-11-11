import React from 'react';
import { Col, Form } from 'react-bootstrap';

export default function GoldInput({ colorTag, colorRef, currencyRef }) {
  return (
    <>
      <Col xs={1} className='p-0'>
        <Form.Control
          type='color'
          value={colorTag || '#ffbb00'}
          ref={colorRef}
          className='p-0 border-0 background-unset'
        />
      </Col>
      <Col xs={5} className='pl-1 pr-1'>
        <Form.Control
          type='number'
          ref={currencyRef}
        />
      </Col>
    </>
  );
}
