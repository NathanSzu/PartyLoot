import React, { useRef } from 'react';
import { Col, Form } from 'react-bootstrap';

export default function TagInput({ tags, updateTagState, colorTag, defaultColor, currencyKey }) {
  const colorRef = useRef();
  const symbolRef = useRef();

  return (
    <>
      <Col xs={3} md={2} className='p-0 pb-1 h-100'>
        <Form.Control
          type='color'
          defaultValue={colorTag || defaultColor}
          ref={colorRef}
          className='p-0 border-0'
          onChange={() => {
            updateTagState(currencyKey, 'color', colorRef.current.value);
          }}
        />
      </Col>
      <Col xs={3} md={2} className='pl-1 pr-1 pb-1'>
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
    </>
  );
}
