import React, { useEffect, useContext, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Navbar, Row, Col, Container, Spinner, Button } from 'react-bootstrap';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../../utils/contexts/GroupContext';
import { AuthContext } from '../../utils/contexts/AuthContext';
import ModalLoot from './helpers/ModalLoot';
import GoldTracker from './helpers/GoldTracker';
import ItemSearch from './helpers/ItemSearch';
import OwnerFilter from './helpers/OwnerFilter';
import LootAccordion from './helpers/AccordionLoot';
import fb from 'firebase';
import { gsap } from 'gsap';

export default function Loot() {
  const { currentGroup, setSortBy } = useContext(GroupContext);
  const { db, currentUser } = useContext(AuthContext);

  const groupRef = db.collection('groups').doc(currentGroup);
  const itemOwnersRef = groupRef.collection('itemOwners');
  const lootRef = groupRef.collection('loot');
  const query = lootRef.orderBy('itemName');

  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemOwnerName, setItemOwnerName] = useState('Party')

  const [lootItems, loadingItems] = useCollectionData(query, { idField: 'id' });
  const [partyData, loadingPartyData] = useDocumentData(groupRef);
  const [itemOwners, loadingItemOwners] = useCollectionData(itemOwnersRef.orderBy('name'), { idField: 'id' });

  const setDefaultItemOwner = (member, party) => {
    document.getElementById('defaultMember').value = party.favorites[member];
    setSortBy(party?.favorites[member] || 'All');
  };

  // This function is necessary to migrate all party data to a new itemOwner collection to set the stage for users to edit owner names and to support other planned features.
  const updatePartyData = (party) => {
    party &&
      itemOwnersRef
        .add({
          name: party[0],
          type: 'party',
          createdOn: fb.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          party.shift();

          if (party.length === 0) {
            groupRef
              .update({
                party: fb.firestore.FieldValue.delete(),
              })
              .catch((err) => {
                console.error('Error deleting item: ', err);
              });
          }

          if (party.length > 0) {
            groupRef
              .update({
                party,
              })
              .catch((err) => {
                console.error('Error deleting item: ', err);
              });
          }
        })
        .catch((err) => {
          console.error('Error migrating data: ', err);
        });
  };

  const updateItemData = (items, loadingItems, itemOwners, loadingItemOwners) => {
    if (!loadingItems && !loadingItemOwners) {
      const noOwnerItems = items.filter((item) => item.owner && !item.ownerId);

      if (noOwnerItems.length === 0) return;

      itemOwners.forEach((itemOwner) => {
        itemOwner.name === noOwnerItems[0].owner &&
          lootRef
            .doc(`${noOwnerItems[0].id}`)
            .update({
              ownerId: itemOwner.id,
            })
            .catch((err) => {
              console.error('Error updating item: ', err);
            });
      });
    }
  };

  useEffect(() => {
    !loadingPartyData && updatePartyData(partyData.party);
  }, [partyData]);

  useEffect(() => {
    itemOwners && updateItemData(lootItems, loadingItems, itemOwners, loadingItemOwners);
  }, [lootItems, itemOwners]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      gsap.fromTo('.loot-item', { opacity: 0 }, { duration: 0.3, opacity: 1, stagger: 0.03 });
    }
  }, [filteredItems]);

  useEffect(() => {
    !loadingPartyData &&
      partyData &&
      partyData.favorites &&
      partyData.favorites[currentUser.uid] &&
      setDefaultItemOwner(currentUser.uid, partyData);
  }, [partyData, itemOwners]);
  
  return (
    <Container className='pb-5'>
      <Row>
        <Navbar sticky='top' className='w-100 p-0 theme1-backer' id='sticky-filter'>
          <div className='d-block w-100'>
            <GoldTracker />
            <Card className='background-light rounded-0 border-dark border-left-0 border-right-0 border-bottom-0'>
              <Card.Header className='border-0'>
                <ItemSearch items={lootItems} setFilteredItems={setFilteredItems} setLoading={setLoading} />
                <OwnerFilter itemOwners={itemOwners} />
              </Card.Header>
            </Card>
            <Card className='background-light rounded-0 border-dark border-left-0 border-right-0 border-bottom-0'>
              <Card.Header className='border-0 d-flex'>
                <ModalLoot />
                <LinkContainer to='/history' data-cy='button-history'>
                  <Button variant='dark' className='background-dark ml-2'>
                    <img className='m-1' alt='History' src='APPIcons/clock-fill.svg' />
                  </Button>
                </LinkContainer>
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
          <LootAccordion filteredItems={filteredItems} itemOwners={itemOwners} />
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
