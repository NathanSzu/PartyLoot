import React, { useEffect, useContext, useRef, useState } from 'react';
import { Row, Card } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import Modal from '../components/BootModalAddLoot';
import Accordion from '../components/BootAccordionLoot';
import firebase from '../utils/firebase';

export default function Loot() {
  const [loading, setLoading] = useState(false)
  const { currentUser } = useContext(AuthContext);
  const { currentGroup, setCurrentGroup } = useContext(GroupContext);
  const itemRef = useRef(null)

  const db = firebase.firestore();
  const lootRef = firebase.firestore().collection('groups').doc(currentGroup).collection('loot');
  const query = lootRef.orderBy('created');
  const [lootItems] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    console.log(lootItems)

  }, [lootItems])

  return (
    <>
    <Card>
      <Card.Header>Gold Will Go Here</Card.Header>
    </Card>
    <Card>
      <Card.Header>search & sort</Card.Header>
    </Card>
      {lootItems && lootItems.map((item) => (
        <Accordion item={item} />
      ))}
      <Row className='justify-content-center'>
        <Modal currentUser={currentUser} currentGroup={currentGroup} />
      </Row>
    </>
  )
}
