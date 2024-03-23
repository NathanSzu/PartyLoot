import React from 'react';
import { Col, Row } from 'react-bootstrap';
import CurrencyIcon from '../shared/CurrencyIcon';

export default function CurrencyTrackerDisplay({ tags, currency, defaultColor }) {
  return (
    <Col xs={6}>
      <Row>
        <Col className='py-1 pe-0'>
          <div className='d-flex bg-white rounded-pill align-items-center'>
            <CurrencyIcon tags={tags} defaultColor={defaultColor} />
            <div className='ms-2'>{currency}</div>
          </div>
        </Col>
      </Row>
    </Col>
  );
}
