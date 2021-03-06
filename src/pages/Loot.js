import React, { useEffect, useContext, useState } from 'react';
import { Card, Navbar, Row, Col, Container, Spinner } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';
import ModalLoot from '../components/ModalLoot';
import GoldTracker from '../components/GoldTracker';
import ItemSearch from '../components/ItemSearch';
import OwnerFilter from '../components/OwnerFilter';
import LootAccordion from '../components/AccordionLoot';
import { gsap } from 'gsap';

export default function Loot() {
  const { currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const lootRef = db.collection('groups').doc(currentGroup).collection('loot');
  const query = lootRef.orderBy('itemName');

  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lootItems] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    if (filteredItems.length > 0) {
      gsap.fromTo('.loot-item', { opacity: 0 }, { duration: 0.3, opacity: 1, stagger: 0.03 });
    }
  }, [filteredItems]);

  return (
    <Container>
      <Row className='mb-5'>
        <Navbar sticky='top' className='w-100 p-0 theme1-backer' id='sticky-filter'>
          <div className='d-block w-100'>
            <GoldTracker />
            <Card className='background-light rounded-0 border-dark border-left-0 border-right-0 border-bottom-0'>
              <Card.Header className='border-0'>
                <ItemSearch items={lootItems} setFilteredItems={setFilteredItems} setLoading={setLoading} />
                <OwnerFilter />
              </Card.Header>
            </Card>
            <Card className='background-light rounded-0 border-dark border-left-0 border-right-0 border-bottom-0'>
              <Card.Header className='border-0'>
                {/* Item should be empty string to prevent error */}
                <ModalLoot item={''} />
              </Card.Header>
            </Card>
          </div>
        </Navbar>
        <Col xs={12} className='pl-1 pr-1 pt-1'>
          {loading && (
            <Spinner
              as='div'
              className='d-flex mt-4 ml-auto mr-auto loading-spinner'
              animation='border'
              role='status'
              variant='light'
            />
          )}
          {/* {filteredItems.map((item, idx) => ( */}
            <LootAccordion filteredItems={filteredItems} />
          {/* // ))} */}
        </Col>
        {filteredItems.length > 0 || loading ? null : (
          <Col xs={12} className='pt-4 pb-4 pl-5 pr-5 background-unset add-background-dark'>
            <p className='text-center font-weight-bold text-light'>
              Tap Party Gold to expand. Color tags can be edited to suit your party's needs.
            </p>
            <p className='text-center font-weight-bold text-light'>
              Search bar filters items as you type. This feature searches item names, descriptions, and tags.
            </p>
            <p className='text-center font-weight-bold text-light'>
              Items and gold totals can be filtered by character using the dropdown menu. Click the button to the right
              to add or remove characters.
            </p>
            <p className='text-center font-weight-bold text-light'>
              To add items click the Add Item button. A name and description are required, all other information is
              optional.
            </p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
