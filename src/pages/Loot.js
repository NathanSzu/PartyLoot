import React, { useEffect, useContext, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../utils/GroupContext';
import ModalLoot from '../components/ModalLoot';
import GoldTracker from '../components/GoldTracker';
import ItemSearch from '../components/ItemSearch';
import OwnerFilter from '../components/OwnerFilter';
import AlertLoading from '../components/AlertLoading';
import LootAccordion from '../components/AccordionLoot';
import firebase from '../utils/firebase';

export default function Loot() {
  const { currentGroup } = useContext(GroupContext);

  const db = firebase.firestore();
  const lootRef = db.collection('groups').doc(currentGroup).collection('loot');
  const query = lootRef.orderBy('created', 'desc');

  const [filteredItems, setFilteredItems] = useState([]);
  const [sortBy, setSortBy] = useState('All');

  const [lootItems, loading] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    console.log('sortBy: ', sortBy)
  }, [sortBy])

  useEffect(() => {
    lootItems && setFilteredItems(lootItems)
  }, [lootItems])

  return (
    <div className='mb-5'>
      <GoldTracker />
      <Card className='mt-2 mb-2'>
        <Card.Header>
          <ItemSearch items={lootItems} setFilteredItems={setFilteredItems} sortBy={sortBy} />
          <OwnerFilter setSortBy={setSortBy} />
        </Card.Header>
      </Card>
      <Card>
        <Card.Header>
          {/* Item should be empty string to prevent error */}
          <ModalLoot item={''} />
        </Card.Header>
      </Card>
      {loading && <AlertLoading />}
      {filteredItems.map((item, idx) => (
        <LootAccordion item={item} key={idx} />
      ))}
    </div>
  )
}
