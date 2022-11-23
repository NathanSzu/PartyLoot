import React, { useContext, useEffect, useRef } from 'react';
import { Col, Form } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import TagEditTrigger from './TagEditTrigger';

export default function GoldInput({
  tags,
  currency,
  currencyKey,
  handleShow,
  colorTag,
  defaultColor,
  setState,
  disabled,
}) {
  const { db } = useContext(AuthContext);
  const { currentGroup, sortBy } = useContext(GroupContext);

  useEffect(() => {
    currencyRef.current.value = currency;
  }, [currency]);

  const currencyRef = useRef();

  const currencyDataRef = db.collection('groups').doc(currentGroup).collection('currency').doc('currency');

  const updateCurrency = (currencyKey, currencyValueRef) => {
    currencyDataRef.set(
      {
        [sortBy]: { [currencyKey]: currencyValueRef.current.value },
      },
      { merge: true }
    );
  };

  return (
    <>
      <Col xs={2} className='p-1'>
        <TagEditTrigger tags={tags} handleShow={handleShow} colorTag={colorTag || defaultColor} disabled={disabled} />
      </Col>
      <Col xs={4} md={2} className='p-1'>
        <Form.Control
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
      </Col>
    </>
  );
}
