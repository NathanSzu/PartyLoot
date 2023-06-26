import React from 'react';
import { ListGroup } from 'react-bootstrap';
import CompendiumListItem from './CompendiumListItem';

export default function CompendiumList({ compendium }) {
  return (
    <ListGroup className='pt-2'>
      {compendium?.map((item, idx) => (
        <CompendiumListItem key={idx} idx={idx} item={item}/>
      ))}
    </ListGroup>
  );
}
