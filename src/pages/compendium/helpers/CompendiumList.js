import React, { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { MemoizedListItem, LoadingListItem, EndOfList } from './CompendiumListItem';
import { DetailsPanelDisplay } from './DetailsPanel';

export default function CompendiumList({ compendium, loading }) {
  const [show, setShow] = useState(false);
  const [item, setItem] = useState({});
  

  return (
    <ListGroup className='pt-2'>
      {compendium?.map((item, idx) => (
        <MemoizedListItem key={idx} idx={idx} item={item} show={show} setShow={setShow} setItem={setItem} />
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
      <DetailsPanelDisplay show={show} setShow={setShow} item={item} />
    </ListGroup>
  );
}
