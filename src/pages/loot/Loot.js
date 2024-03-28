import React, { useEffect, useContext, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Navbar, Row, Col, Container, Spinner, Button } from 'react-bootstrap';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../../utils/contexts/GroupContext';
import { AuthContext } from '../../utils/contexts/AuthContext';
import ModalLoot from './helpers/ModalLoot';
import CurrencyTracker from './helpers/currencyTracking/currencyTracker/CurrencyTracker';
import ItemSearch from './helpers/ItemSearch';
import OwnerFilter from './helpers/OwnerFilter';
import LootAccordion from './helpers/AccordionLoot';
import IntroCard from './helpers/IntroCard';

export default function Loot() {
  const { setSortBy, groupDoc } = useContext(GroupContext);
  const { currentUser } = useContext(AuthContext);

  const itemOwnersRef = groupDoc.collection('itemOwners');
  const lootRef = groupDoc.collection('loot');
  const query = lootRef.orderBy('itemName');

  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lootItems] = useCollectionData(query, { idField: 'id' });
  const [partyData, loadingPartyData] = useDocumentData(groupDoc);
  const [itemOwners] = useCollectionData(itemOwnersRef.orderBy('name'), { idField: 'id' });

  useEffect(() => {
    !loadingPartyData && partyData && setSortBy(partyData?.favorites?.[currentUser.uid] || 'party');
  }, [itemOwners]);

  return (
    <Row className='lazy-scroll-container'>
      <Navbar sticky='top' className='w-100 p-0' id='sticky-filter'>
        <div className='d-block w-100 mx-0 mb-2'>
          <Card className='rounded-top-0 background-light border-dark border-bottom-0 border-end-0 border-start-0'>
            <Card.Header className='p-0'>
              <CurrencyTracker />
            </Card.Header>
            <Card.Body>
              <Container>
                <ItemSearch items={lootItems} setFilteredItems={setFilteredItems} setLoading={setLoading} />
                <OwnerFilter itemOwners={itemOwners} />
              </Container>
            </Card.Body>
            <Card.Footer className='d-flex'>
              <Container>
                <Row>
                  <Col xs={9} className='pe-0'>
                    <ModalLoot />
                  </Col>
                  <Col xs={3}>
                    <LinkContainer to='/history' data-cy='button-history'>
                      <Button variant='dark' className='background-dark w-100'>
                        <img alt='History' src='APPIcons/clock-fill.svg' />
                      </Button>
                    </LinkContainer>
                  </Col>
                </Row>
              </Container>
            </Card.Footer>
          </Card>
        </div>
      </Navbar>
      <Container>
        <Row>
          <Col>
            {loading && (
              <Spinner
                as='div'
                className='d-flex mt-4 mx-auto loading-spinner'
                animation='border'
                role='status'
                variant='light'
              />
            )}
            <LootAccordion filteredItems={filteredItems} itemOwners={itemOwners} />
            {filteredItems.length > 0 || loading ? null : (
              <Col>
                <IntroCard />
              </Col>
            )}
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
