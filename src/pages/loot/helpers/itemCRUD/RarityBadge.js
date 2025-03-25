import React from 'react';
import { Badge } from 'react-bootstrap';

export default function RarityBadge({ itemRarity, bgColor='light', txtColor='text-secondary' }) {
  const formatRarity = (itemRarity) => {
    let formattedRarity = itemRarity.toLowerCase();
    return formattedRarity?.charAt(0).toUpperCase() + formattedRarity?.slice(1);
  };

  return <>{itemRarity ? <Badge bg={bgColor} className={txtColor} pill>Rarity: {formatRarity(itemRarity)}</Badge> : null}</>;
}
