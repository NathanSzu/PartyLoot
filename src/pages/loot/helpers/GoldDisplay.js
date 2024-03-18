import React, { useContext, useEffect, useRef } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import CurrencyIcon from './CurrencyIcon';

export default function GoldDisplay({ tags, currency, currencyKey, handleShow, defaultColor, setState}) {
  const { sortBy, groupDoc } = useContext(GroupContext);

  useEffect(() => {
    currencyRef.current.value = currency;
  }, [currency]);

  const currencyRef = useRef();

  const currencyDataRef = groupDoc.collection('currency').doc('currency');

  const updateCurrency = (currencyKey, currencyValueRef) => {
    currencyDataRef.set(
      {
        [sortBy]: { [currencyKey]: currencyValueRef.current.value },
      },
      { merge: true }
    );
  };

  return (
    <Col xs={6}>
      <Row>
        <Col className='py-1 pe-0'>
          <div className='d-flex bg-white rounded-pill'>
            <CurrencyIcon tags={tags} handleShow={handleShow} defaultColor={defaultColor} />
            <Form.Control
            className='border-0'
              data-cy={currencyKey}
              defaultValue={currency || 0}
              type='number'
              ref={currencyRef}
              onChange={() => {
                if (setState) {
                  setState(currencyKey, currencyRef.current.value);
                } else {
                  updateCurrency(currencyKey, currencyRef);
                }
              }}
            />
          </div>
        </Col>
      </Row>
    </Col>
  );
}
