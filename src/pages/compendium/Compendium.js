import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';
// import fb from 'firebase';
import { Button, Container, Row, Col } from 'react-bootstrap';
import CompendiumList from './CompendiumList';

export default function Compendium() {
  const { db } = useContext(AuthContext);
  const { isVisible } = useContext(GlobalFeatures);

  const [compendium, setCompendium] = useState([]);
  const [orderBy, setOrderBy] = useState('likeCount');
  const [startAfter, setStartAfter] = useState(0);

  const queryRef = db.collection('compendium').orderBy(orderBy).orderBy('created').startAfter(startAfter).limit(25);

  // const seedCompendium = () => {
  //   for (let i = 0; i < 200; i++) {
  //     let data = {
  //       category: [Math.ceil(Math.random() * 5)],
  //       created: fb.firestore.FieldValue.serverTimestamp(),
  //       creatorId: 'FSoy7RhYIwMOBvgxpH9lMns7aNf1',
  //       itemDesc: `Item description ${i}!`,
  //       itemName: `Item name ${i}`,
  //       likeCount: 1,
  //       setting: '2345hdgj',

  //     };
  //     db.collection('compendium').add(data);
  //   }

  // };

  const getCompendium = () => {
    return queryRef
      .get()
      .then((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          results.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        lastVisible && setStartAfter(lastVisible);
        lastVisible && setCompendium([...compendium, ...results]);
      })
      .catch((error) => {
        console.error('Error viewing compendium: ', error);
      });
  };

  const loadMore = (length) => {
    isVisible(`#item${length - 3}`) && getCompendium();
  }

  useEffect(() => {
    getCompendium();
  }, []);

  return (
    <Container className='lazy-scroll-container pl-1 pr-1' onScroll={() => loadMore(compendium.length)}>
      <CompendiumList compendium={compendium} />
    </Container>
  );
}
