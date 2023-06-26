import React, { useContext, useState, useEffect } from 'react';
import { ListGroupItem, Col, Row } from 'react-bootstrap';
import { AuthContext } from '../../utils/contexts/AuthContext';
import DetailsPanel from './DetailsPanel';
import LikeDisplay from './LikeDisplay';

export default function CompendiumListItem({ item, idx }) {
  const { currentUser, db } = useContext(AuthContext);
  const compendiumRef = db.collection('compendium').doc(item.id).collection('likes').doc(currentUser.uid);
  
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    compendiumRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setLiked(true);
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
  }, []);

  return (
    <ListGroupItem className='rounded border-dark' key={item.id} id={`item${idx}`}>
      <Row>
        <Col>
          <h1 className='item-h1 m-0'>{item.itemName}</h1>
          <LikeDisplay likeCount={item?.likeCount} fill={liked ? 'solid' : 'regular'} />
        </Col>
        <DetailsPanel item={item} />
      </Row>
    </ListGroupItem>
  );
}
