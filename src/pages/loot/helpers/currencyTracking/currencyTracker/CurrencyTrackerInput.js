import React, { useRef, useContext } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { GroupContext } from '../../../../../utils/contexts/GroupContext';

export default function CurrencyTrackerInput({
  tags,
  updateTagState,
  defaultColor,
  currencyKey,
  newCurrencyTotals,
  setNewCurrencyTotals,
}) {
  const { currency, sortBy } = useContext(GroupContext);

  const colorRef = useRef();
  const symbolRef = useRef();
  const currencyRef = useRef();

  const findDiff = () => {
    let newTotal = newCurrencyTotals && newCurrencyTotals[currencyKey] ? newCurrencyTotals[currencyKey] : 0;
    let oldTotal = currency && currency[sortBy] && currency[sortBy][currencyKey] ? currency[sortBy][currencyKey] : 0;
    return newTotal - oldTotal || '';
  };

  return (
    <Row className='pb-2'>
      <Col xs={2} className='px-1'>
        <Form.Control
          className='w-100'
          type='color'
          defaultValue={tags?.color || defaultColor}
          ref={colorRef}
          onChange={() => {
            updateTagState(currencyKey, 'color', colorRef.current.value);
          }}
        />
      </Col>
      <Col xs={2} className='px-1'>
        <Form.Control
          type='text'
          defaultValue={tags?.symbol}
          ref={symbolRef}
          onChange={() => {
            updateTagState(currencyKey, 'symbol', symbolRef.current.value);
          }}
          maxLength='1'
        />
      </Col>
      <Col xs={3} className='px-1'>
        <Form.Control
          as='select'
          defaultValue={tags?.symbolTheme}
          onChange={(e) => {
            updateTagState(currencyKey, 'symbolTheme', e.target.value);
          }}
        >
          <option value='black'>Dark</option>
          <option value='white'>Light</option>
        </Form.Control>
      </Col>
      <Col xs={3} className='px-1'>
        <Form.Control
          type='number'
          ref={currencyRef}
          value={newCurrencyTotals ? newCurrencyTotals[currencyKey] : 0}
          onChange={() =>
            setNewCurrencyTotals({ ...newCurrencyTotals, [currencyKey]: parseInt(currencyRef.current.value) })
          }
        />
      </Col>
      <Col xs={2} className='px-1 d-flex align-items-center'>
        <div className={findDiff() > 0 ? 'text-success' : 'text-danger'}>
          {newCurrencyTotals ? findDiff() : ''}
        </div>
      </Col>
    </Row>
  );
}
