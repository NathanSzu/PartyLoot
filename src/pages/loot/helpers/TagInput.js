import React, { useRef } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

export default function TagInput({ tags, updateTagState, defaultColor, currencyKey }) {
  const colorRef = useRef();
  const symbolRef = useRef();

  return (
    <Row className='pb-2 justify-content-center'>
      <Col xs={2} md={1} className='p-0'>
        <Form.Control
          type='color'
          defaultValue={tags?.color || defaultColor}
          ref={colorRef}
          onChange={() => {
            updateTagState(currencyKey, 'color', colorRef.current.value);
          }}
        />
      </Col>
      <Col xs={3}>
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
      <Col xs={6}>
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
    </Row>
  );
}
