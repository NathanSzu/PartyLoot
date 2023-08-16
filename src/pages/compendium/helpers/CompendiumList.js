import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { MemoizedListItem, LoadingListItem, EndOfList } from './CompendiumListItem';

export default function CompendiumList({ compendium, loading, getCompendium }) {
  return (
    <ListGroup className='pt-2'>
      {compendium?.map((item, idx) => (
        <MemoizedListItem key={item.id} idx={idx} item={item} getCompendium={getCompendium} />
      ))}
      {loading ? (
        <>
          <LoadingListItem />
          <LoadingListItem />
          <LoadingListItem />
        </>
      ) : (
        <EndOfList />
      )}
    </ListGroup>
  );
}
