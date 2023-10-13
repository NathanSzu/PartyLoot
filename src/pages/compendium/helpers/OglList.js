import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { MemoizedOglListItem, LoadingListItem, EndOfList, OglPageinationButtons } from './CompendiumListItem';

export default function OglList({ oglResults, getOglResults, loading, getCompendium }) {
  return (
    <ListGroup className='pt-2'>
      {oglResults?.results?.map((item, idx) => (
        <MemoizedOglListItem key={item.slug} idx={idx} item={item} getCompendium={getCompendium} />
      ))}
      {loading ? (
        <>
          <LoadingListItem />
          <LoadingListItem />
          <LoadingListItem />
        </>
      ) : oglResults?.next || oglResults?.previous ? (
        <OglPageinationButtons oglResults={oglResults} getOglResults={getOglResults}/>
      ) : (
        <EndOfList />
      )}
    </ListGroup>
  );
}
