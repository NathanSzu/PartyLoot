import React, { useContext, useState, useEffect } from 'react';
import { ListGroupItem, Col, Row, Button } from 'react-bootstrap';
import { AuthContext } from '../../utils/contexts/AuthContext';
import { MemoizedPanelTrigger } from './DetailsPanel';
import LikeDisplay from './LikeDisplay';
import { SingleLineLoading } from '../common/LoadingIndicators';

export function CompendiumListItem({ item, idx, setShow, setItem }) {
  const { currentUser, db } = useContext(AuthContext);
  const compendiumRef = db.collection('compendium').doc(item.id).collection('likes').doc(currentUser.uid);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (item?.id) {
      compendiumRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            setLiked(true);
          } else {
            // doc.data() will be undefined in this case
            console.warn('No such document!');
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        });
    }
  }, []);

  return (
    <ListGroupItem className='rounded border-dark' key={item.id} id={`item${idx}`}>
      <Row>
        <Col>
          <h1 className='item-h1 m-0'>{item.itemName}</h1>
          <LikeDisplay likeCount={item?.likeCount} fill={liked ? 'solid' : 'regular'} />
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
          <SingleLineLoading classProps='w-50 mt-1'/>
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
          <h1 className='item-h1 m-0 text-center'>No more items</h1>
        </Col>
      </Row>
    </ListGroupItem>
  );
}

export const MemoizedListItem = React.memo(CompendiumListItem);
