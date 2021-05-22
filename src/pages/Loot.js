import React, { useEffect, useContext, useRef, useState } from 'react';
import { Row, Card, Accordion } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import Modal from '../components/BootModalAddLoot';
import AlertLoading from '../components/AlertLoading';
import LootAccordion from '../components/BootAccordionLoot';
import firebase from '../utils/firebase';

export default function Loot() {
  const { currentUser } = useContext(AuthContext);
  const { currentGroup } = useContext(GroupContext);
  const itemRef = useRef(null)

  const db = firebase.firestore();
  const lootRef = db.collection('groups').doc(currentGroup).collection('loot');
  const query = lootRef.orderBy('created');
  const [lootItems, loading, error] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    error && console.log('Error loading items: ', error)
  }, [lootItems])

  return (
    <>
    <Card className='mt-2'>
      <Card.Header>Gold Will Go Here</Card.Header>
    </Card>
    <Card className='mt-3 mb-2'>
      <Card.Header>search & sort</Card.Header>
    </Card>
      {loading && <AlertLoading />}
      {lootItems && lootItems.map((item, idx) => (
        <LootAccordion item={item} key={idx} />
      ))}
      <Row className='justify-content-center'>
        <Modal currentUser={currentUser} currentGroup={currentGroup} />
      </Row>
    </>
  )
}
