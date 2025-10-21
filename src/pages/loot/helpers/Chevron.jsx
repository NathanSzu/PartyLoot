import React from 'react';
import { Col } from 'react-bootstrap';

export default function Chevron({ open, reverse = false }) {
  return (
    <Col xs={1} className='d-flex justify-content-center'>
      {open ? (
        <img alt='Open chevron' src='APPIcons/chevron-up.svg' className={`chevron-${reverse ? 'right' : 'left'}`} />
      ) : (
        <img alt='Close chevron' src='APPIcons/chevron-down.svg' className={`chevron-${reverse ? 'right' : 'left'}`} />
      )}
    </Col>
  );
}
