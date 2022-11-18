import React, { useContext } from 'react';
import { Col, Form } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import TagEditTrigger from './TagEditTrigger';

export default function GoldInput({ tags, currency, handleShow, colorTag, currencyRef, defaultColor }) {
  const { db } = useContext(AuthContext);
  const { currentGroup, sortBy } = useContext(GroupContext);

  const currencyDataRef = db.collection('groups').doc(currentGroup).collection('currency').doc('currency');

  const updateCurrency = (currency, currencyValueRef) => {
    currencyDataRef.set(
      {
        [sortBy]: { [currency]: currencyValueRef.current.value },
      },
      { merge: true }
    );
  };

  return (
    <>
      <Col xs={1} className='p-0 pb-1 h-100'>
        <TagEditTrigger tags={tags} handleShow={handleShow} colorTag={colorTag || defaultColor} />
      </Col>
      <Col xs={5} md={3} className='pl-1 pr-1 pb-1'>
        <Form.Control
          type='number'
          ref={currencyRef}
          onChange={() => {
            updateCurrency(currency, currencyRef);
          }}
        />
      </Col>
    </>
  );
}
