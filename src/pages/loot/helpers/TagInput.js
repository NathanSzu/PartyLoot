import React, { useRef } from 'react';
import { Col, Form } from 'react-bootstrap';

export default function TagInput({ tags, updateTagState, colorTag, defaultColor, currencyKey }) {
  const colorRef = useRef();
  const symbolRef = useRef();

  return (
    <>
      <Col xs={1} className='p-0 pt-1 pb-1 pl-1 h-100'>
        <Form.Control
          type='color'
          defaultValue={tags?.color || colorTag || defaultColor}
          ref={colorRef}
          className='p-0 border-0'
          onChange={() => {
            updateTagState(currencyKey, 'color', colorRef.current.value);
          }}
        />
      </Col>
      <Col xs={2} md={1} className='pt-1 pl-1 pr-1 pb-1'>
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
      <Col xs={3} md={2} className='pt-1 pl-1 pr-1 pb-1'>
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
    </>
  );
}
