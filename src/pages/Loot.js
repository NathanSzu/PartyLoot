import React, { useEffect, useContext, useRef, useState } from 'react';
import { Row, Card, Col, Form } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import AddLoot from '../components/BootModalAddLoot';
import GoldTracker from '../components/GoldTracker';
import ItemSearch from '../components/ItemSearch';
import AlertLoading from '../components/AlertLoading';
import LootAccordion from '../components/BootAccordionLoot';
import firebase from '../utils/firebase';

export default function Loot() {
  const { currentUser } = useContext(AuthContext);
  const { currentGroup } = useContext(GroupContext);
  const itemRef = useRef(null);

  const db = firebase.firestore();
  const lootRef = db.collection('groups').doc(currentGroup).collection('loot');
  const currencyRef = db.collection('groups').doc(currentGroup).collection('currency');

  const query = lootRef.orderBy('created', 'desc');
  const goldQuery = currencyRef.where('name', '==', 'gold');
  const silverQuery = currencyRef.where('name', '==', 'silver');
  const copperQuery = currencyRef.where('name', '==', 'copper');
  const misc1Query = currencyRef.where('name', '==', 'misc1');

  const [filteredItems, setFilteredItems] = useState([])

  const [lootItems, loading, error] = useCollectionData(query, { idField: 'id' });
  const [gold] = useCollectionData(goldQuery, { idField: 'id' });
  const [silver] = useCollectionData(silverQuery, { idField: 'id' });
  const [copper] = useCollectionData(copperQuery, { idField: 'id' });
  const [misc1] = useCollectionData(misc1Query, { idField: 'id' });

  useEffect(() => {
    error && console.log('Error loading items: ', error)
    lootItems && setFilteredItems(lootItems)
  }, [lootItems])

  useEffect(() => {
    gold && console.log('gold', gold[0])
  }, [gold])

  useEffect(() => {
    silver && console.log('silver', silver[0])
  }, [silver])

  useEffect(() => {
    copper && console.log('copper', copper[0])
  }, [copper])



  return (
    <>
      <Card className='mt-2'>
        <Card.Header>
          <GoldTracker gold={gold} silver={silver} copper={copper} misc1={misc1} currencyRef={currencyRef} />
        </Card.Header>
      </Card>
      <Card className='mt-2 mb-2'>
        <Card.Header>
          <ItemSearch items={lootItems} setFilteredItems={setFilteredItems} />
        </Card.Header>
      </Card>
      <Card>
        <Card.Header>
          <AddLoot currentUser={currentUser} currentGroup={currentGroup} />
        </Card.Header>
      </Card>
      {loading && <AlertLoading />}
      {filteredItems.map((item, idx) => (
        <LootAccordion item={item} key={idx} />
      ))}

    </>
  )
}
