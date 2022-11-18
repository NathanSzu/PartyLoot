import React from 'react';
import { Button } from 'react-bootstrap';

export default function TagEditTrigger({ tags = {}, handleShow, colorTag }) {
  // tags contains color, symbol, and symbolTheme
  return (
    <Button
      className='w-100 border-0 d-flex justify-content-center mh-36'
      style={{ backgroundColor: `${colorTag}`, color: `${tags?.symbolTheme || 'black'}` }}
      onClick={handleShow}
    >
      {tags?.symbol}
    </Button>
  );
}
