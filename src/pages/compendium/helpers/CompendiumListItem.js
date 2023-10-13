import React, { useContext, useState, useEffect } from 'react';
import { ListGroupItem, Col, Row, Button } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { MemoizedPanel, MemoizedOglPanel } from './DetailsPanel';
import LikeDisplay from './LikeDisplay';
import { SingleLineLoading } from '../../common/LoadingIndicators';

export function CompendiumListItem({ item, idx, getCompendium }) {
  const { currentUser, db } = useContext(AuthContext);
  const compendiumRef = db.collection('compendium').doc(item.id).collection('likes').doc(currentUser.uid);

  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let unsubscribe;
    if (item?.id) {
      setLoading(true);
      unsubscribe = compendiumRef.onSnapshot((doc) => {
        if (doc.exists) {
          setLiked(true);
        } else {
          setLiked(false);
        }
        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, []);

  return (
    <ListGroupItem className='rounded border-dark' key={item.id} id={`item${idx}`}>
      <Row>
        <Col>
          <h1 className='fancy-font fs-sm-deco m-0'>{item.itemName}</h1>
          <LikeDisplay
            likeCount={item?.likeCount}
            liked={liked}
            loading={loading}
            setLoading={setLoading}
            item={item}
          />
        </Col>
        <MemoizedPanel item={item} getCompendium={getCompendium} />
      </Row>
    </ListGroupItem>
  );
}

export function LoadingListItem() {
  return (
    <ListGroupItem className='rounded border-dark'>
      <Row>
        <Col>
          <SingleLineLoading />
          <SingleLineLoading classProps='w-50 mt-1' />
        </Col>
        <Col xs={3} className='text-end'>
          <Button className='h-100 background-dark' variant='dark' disabled>
            View
          </Button>
        </Col>
      </Row>
    </ListGroupItem>
  );
}

export function EndOfList() {
  return (
    <ListGroupItem className='rounded border-dark my-2'>
      <Row>
        <Col>
          <h1 className='fancy-font fs-sm-deco m-0 text-center'>No more items</h1>
        </Col>
      </Row>
    </ListGroupItem>
  );
}

export function OglPageinationButtons({ oglResults, getOglResults }) {
  return (
    <ListGroupItem className='rounded border-dark my-2'>
      <Row>
        <Col>
          <Button className='w-100 background-dark' variant='dark' disabled={!oglResults?.previous} onClick={() => getOglResults(oglResults.previous)}>Previous page</Button>
        </Col>
        <Col>
          <Button className='w-100 background-dark' variant='dark' disabled={!oglResults?.next} onClick={() => getOglResults(oglResults.next)}>Next page</Button>
        </Col>
      </Row>
    </ListGroupItem>
  );
}

export function OglListItem({ item, idx }) {
  return (
    <ListGroupItem className='rounded border-dark' key={item.slug} id={`item${idx}`}>
      <Row>
        <Col>
          <h1 className='fancy-font fs-sm-deco m-0'>{item.name}</h1>
        </Col>
        <MemoizedOglPanel item={item} />
      </Row>
    </ListGroupItem>
  );
}

export const MemoizedListItem = React.memo(CompendiumListItem);

export const MemoizedOglListItem = React.memo(OglListItem);
