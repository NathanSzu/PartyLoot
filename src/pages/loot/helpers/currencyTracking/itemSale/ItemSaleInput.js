import React, { useEffect, useRef } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import CurrencyIcon from '../shared/CurrencyIcon';

export default function ItemSaleInput({ tags, currency, currencyKey, handleShow, defaultColor, setState }) {

  useEffect(() => {
    currencyRef.current.value = currency;
  }, [currency]);

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
              defaultValue={currency || 0}
              type='number'
              ref={currencyRef}
              onChange={() => {
                setState(currencyKey, currencyRef.current.value);
              }}
            />
          </div>
        </Col>
      </Row>
    </Col>
  );
}
