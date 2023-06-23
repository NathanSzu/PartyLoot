import React, { useState } from 'react';
import { Button, Col, Offcanvas } from 'react-bootstrap';
import QuillDisplay from '../common/QuillDisplay';

export default function DetailsPanel({item}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (
    <Col xs={3} className='text-end'>
      <Button className='h-100' variant='primary' onClick={toggleShow}>
        View
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{item?.itemName}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <QuillDisplay className='p-0' value={item?.itemDesc} />
          <p>
          Creator:
          </p>
        </Offcanvas.Body>
      </Offcanvas>
    </Col>
  );
}
