import React from 'react';

export default function CurrencyIcon({ tags = {}, defaultColor }) {
  return (
    <div
      className='circle border border-secondary'
      style={{ backgroundColor: `${tags?.color || defaultColor}`, color: `${tags?.symbolTheme || 'black'}` }}
    >
      <p>{tags?.symbol}</p>
    </div>
  );
}
