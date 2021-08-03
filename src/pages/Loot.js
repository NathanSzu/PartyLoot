import React, { useEffect, useContext, useState } from 'react';
import { Card, Navbar, Row, Col } from 'react-bootstrap';
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

  return (
    <Row className='mb-5'>
      <Navbar sticky='top' className='w-100 p-0 theme1-backer'>
        <div className='d-block w-100'>
          <GoldTracker />
          <Card className='m-2 texture-backer'>
            <Card.Header className='border-0'>
              <ItemSearch items={lootItems} setFilteredItems={setFilteredItems} sortBy={sortBy} />
              <OwnerFilter setSortBy={setSortBy} />
            </Card.Header>
          </Card>
          <Card className='texture-backer m-2'>
            <Card.Header className='border-0'>
              {/* Item should be empty string to prevent error */}
              <ModalLoot item={''} />
            </Card.Header>
          </Card>
        </div>
      </Navbar>
      <Col className='pt-2'>
        {loading && <AlertLoading />}
        {filteredItems.map((item, idx) => (
          <LootAccordion item={item} key={idx} idx={idx} />
        ))}
      </Col>
    </Row>
  )
}
