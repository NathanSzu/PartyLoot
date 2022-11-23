import React from 'react';
import { Button } from 'react-bootstrap';

export default function TagEditTrigger({ tags = {}, handleShow, colorTag, disabled = false }) {
  // tags contains color, symbol, and symbolTheme
  return (
    <Button
      disabled={disabled}
      className='w-100 border d-flex justify-content-center mh-36 disabled-opacity-100'
      style={{ backgroundColor: `${tags?.color || colorTag}`, color: `${tags?.symbolTheme || 'black'}` }}
      onClick={handleShow}
    >
      {tags?.symbol}
    </Button>
  );
}
