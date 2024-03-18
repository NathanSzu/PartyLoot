import React from 'react';
import { Button } from 'react-bootstrap';

export default function TagEditTrigger({ handleShow }) {
  return (
    <Button
      variant='dark'
      className='w-100 background-dark h-100 border d-flex align-items-center justify-content-center'
      onClick={handleShow}
    >
      <img alt='Edit Item' src='APPIcons/pencil-square.svg' />
    </Button>
  );
}
