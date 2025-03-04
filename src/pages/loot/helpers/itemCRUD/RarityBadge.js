import React from 'react';
import { Badge } from 'react-bootstrap';

export default function RarityBadge({ itemRarity }) {

  return <>{itemRarity ? <Badge bg='light' className='text-secondary' pill>Item rarity: {itemRarity}</Badge> : null}</>;
}
