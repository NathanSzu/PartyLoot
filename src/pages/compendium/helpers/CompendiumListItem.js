import React, { useContext, useState, useEffect } from 'react';
import { ListGroupItem, Col, Row, Button } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { MemoizedPanelTrigger } from './DetailsPanel';
import LikeDisplay from './LikeDisplay';
import { SingleLineLoading } from '../../common/LoadingIndicators';

export function CompendiumListItem({ item, idx, setShow, setItem }) {
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
        <MemoizedPanelTrigger item={item} setShow={setShow} setItem={setItem} />
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

export const MemoizedListItem = React.memo(CompendiumListItem);
