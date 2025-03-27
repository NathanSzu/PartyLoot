import React from 'react';
import { Button } from 'react-bootstrap';

export default function RarityBadge({ itemRarity, variant='light' }) {
  const formatRarity = (itemRarity) => {
    let formattedRarity = itemRarity.toLowerCase();
    return formattedRarity?.charAt(0).toUpperCase() + formattedRarity?.slice(1);
  };

  return <>{itemRarity ? <Button disabled variant={variant} className='rounded-pill my-1 border-0' size="sm">Rarity: {formatRarity(itemRarity)}</Button> : null}</>;
}
