import React, { useEffect, useRef } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import CurrencyIcon from '../currencyTracking/shared/CurrencyIcon';

export default function ItemValueInput({ tags, currencyKey, handleShow, defaultColor, setState, value }) {

  useEffect(() => {
    currencyRef.current.value = value;
  }, [value]);

  const currencyRef = useRef();

  return (
    <Col xs={6}>
      <Row>
        <Col className='py-1 px-1'>
          <div className='d-flex bg-white rounded-pill'>
            <CurrencyIcon tags={tags} handleShow={handleShow} defaultColor={defaultColor} />
            <Form.Control
              className='border-0 rounded-pill'
              data-cy={currencyKey}
              type='number'
              ref={currencyRef}
              onChange={() => {
                setState(currencyKey, currencyRef.current.value);
              }}
              value={value}
            />
          </div>
        </Col>
      </Row>
    </Col>
  );
}
