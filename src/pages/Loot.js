import React, { useEffect, useContext, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../utils/GroupContext';
import ModalLoot from '../components/ModalLoot';
import GoldTracker from '../components/GoldTracker';
import ItemSearch from '../components/ItemSearch';
import AlertLoading from '../components/AlertLoading';
import LootAccordion from '../components/AccordionLoot';
import fb from 'firebase';
import firebase from '../utils/firebase';

export default function Loot() {
  const { currentGroup } = useContext(GroupContext);

  const db = firebase.firestore();
  const lootRef = db.collection('groups').doc(currentGroup).collection('loot');
  const memberRef = db.collection('groups').doc(currentGroup)
  const currencyRef = db.collection('groups').doc(currentGroup).collection('currency');

  const query = lootRef.orderBy('created', 'desc');
  const goldQuery = currencyRef.where('name', '==', 'gold');
  const silverQuery = currencyRef.where('name', '==', 'silver');
  const copperQuery = currencyRef.where('name', '==', 'copper');
  const misc1Query = currencyRef.where('name', '==', 'misc1');

  const [groupMembers] = useDocumentData(memberRef)

  const [filteredItems, setFilteredItems] = useState([])

  const [lootItems, loading] = useCollectionData(query, { idField: 'id' });
  const [gold] = useCollectionData(goldQuery, { idField: 'id' });
  const [silver] = useCollectionData(silverQuery, { idField: 'id' });
  const [copper] = useCollectionData(copperQuery, { idField: 'id' });
  const [misc1] = useCollectionData(misc1Query, { idField: 'id' });

  useEffect(() => {
    lootItems && setFilteredItems(lootItems)
    groupMembers && console.log('Group Members', groupMembers)
  }, [lootItems])

  // useEffect(() => {
  //   gold && console.log('gold', gold[0])
  // }, [gold])

  // useEffect(() => {
  //   silver && console.log('silver', silver[0])
  // }, [silver])

  // useEffect(() => {
  //   copper && console.log('copper', copper[0])
  // }, [copper])

  // useEffect(() => {
  //   groupData && groupData.groupName && console.log('groupData', groupData)
  // }, [groupData])



  return (
    <>
      <GoldTracker gold={gold} silver={silver} copper={copper} misc1={misc1} currencyRef={currencyRef} />
      <Card className='mt-2 mb-2'>
        <Card.Header>
          <ItemSearch items={lootItems} setFilteredItems={setFilteredItems} />
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
    </>
  )
}
