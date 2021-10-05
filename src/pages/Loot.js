import React, { useEffect, useContext, useState, useRef } from 'react';
import { Card, Navbar, Row, Col, Container } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../utils/GroupContext';
import ModalLoot from '../components/ModalLoot';
import GoldTracker from '../components/GoldTracker';
import ItemSearch from '../components/ItemSearch';
import OwnerFilter from '../components/OwnerFilter';
import AlertLoading from '../components/AlertLoading';
import LootAccordion from '../components/AccordionLoot';
import firebase from '../utils/firebase';
import { gsap } from 'gsap';

export default function Loot() {
  const { currentGroup } = useContext(GroupContext);

  const db = firebase.firestore();
  const lootRef = db.collection('groups').doc(currentGroup).collection('loot');
  const query = lootRef.orderBy('created', 'desc');

  const [filteredItems, setFilteredItems] = useState([]);
  const [sortBy, setSortBy] = useState('All');

  const [lootItems, loading] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    gsap.fromTo('.loot-item', { opacity: 0 }, { duration: .3, opacity: 1, stagger: .03 })
    console.log('filtered items set')
  }, [filteredItems])

  return (
    <Container>
      <Row className='mb-5'>
        <Navbar sticky='top' className='w-100 p-0 theme1-backer' id='sticky-filter'>
          <div className='d-block w-100'>
            <GoldTracker sortBy={sortBy} />
            <Card className='texture-backer rounded-0 border-dark border-left-0 border-right-0 border-bottom-0'>
              <Card.Header className='border-0'>
                <ItemSearch items={lootItems} setFilteredItems={setFilteredItems} sortBy={sortBy} />
                <OwnerFilter setSortBy={setSortBy} />
              </Card.Header>
            </Card>
            <Card className='texture-backer rounded-0 border-dark border-left-0 border-right-0 border-bottom-0'>
              <Card.Header className='border-0'>
                {/* Item should be empty string to prevent error */}
                <ModalLoot item={''} />
              </Card.Header>
            </Card>
          </div>
        </Navbar>
        <Col className='pl-2 pr-2 pt-1'>
          {loading && <AlertLoading />}
          {filteredItems.map((item, idx) => (
            <LootAccordion item={item} key={idx} idx={idx} />
          ))}
        </Col>
      </Row>
    </Container>
  )
}
