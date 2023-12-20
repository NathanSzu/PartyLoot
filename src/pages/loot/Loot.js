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

export default function Loot() {
  const { setSortBy, groupDoc } = useContext(GroupContext);
  const { currentUser } = useContext(AuthContext);

  const itemOwnersRef = groupDoc.collection('itemOwners');
  const lootRef = groupDoc.collection('loot');
  const currencyRef = groupDoc.collection('currency').doc('currency');
  const query = lootRef.orderBy('itemName');

  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lootItems, loadingItems] = useCollectionData(query, { idField: 'id' });
  const [partyData, loadingPartyData] = useDocumentData(groupDoc);
  const [itemOwners, loadingItemOwners] = useCollectionData(itemOwnersRef.orderBy('name'), { idField: 'id' });
  // Used for transferring currency to be stored under new id's
  const [currency, loadingCurrency] = useDocumentData(currencyRef);

  // Updates all party member data from an array on the group document to new documents with unique id's.
  // This will support itemOwner name changes, categorization, and other planned features.
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
            groupDoc
              .update({
                party: fb.firestore.FieldValue.delete(),
                favorites: fb.firestore.FieldValue.delete(),
              })
              .catch((err) => {
                console.error('Error deleting item: ', err);
              });
          }

          if (party.length > 0) {
            groupDoc
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

  // Updates item data from being stored under a name to storage under an itemOwner.id.
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

  // Updates currency from being stored under a name to storage under an itemOwner.id.
  const updateCurrency = (currencyValues, itemOwnerId, itemOwnerName) => {
    currencyRef
      .set(
        {
          [itemOwnerId]: currencyValues,
        },
        { merge: true }
      )
      .then(() => {
        currencyRef.update({
          [itemOwnerName]: fb.firestore.FieldValue.delete(),
        });
      });
  };

  useEffect(() => {
    !loadingPartyData && updatePartyData(partyData.party);
  }, [partyData]);

  useEffect(() => {
    itemOwners && updateItemData(lootItems, loadingItems, itemOwners, loadingItemOwners);
  }, [lootItems, itemOwners]);

  useEffect(() => {
    !loadingPartyData && partyData && setSortBy(partyData?.favorites?.[currentUser.uid] || 'party');
  }, [partyData, itemOwners]);

  useEffect(() => {
    !loadingItemOwners &&
      !loadingCurrency &&
      itemOwners.forEach((itemOwner) => {
        if (currency[itemOwner?.name]) {
          updateCurrency(currency[itemOwner.name], itemOwner.id, itemOwner.name);
        }
      });
    if (currency?.All) {
      updateCurrency(currency.All, 'party', 'All');
    }
  }, [currency]);

  return (
    <Container className='lazy-scroll-container'>
      <Navbar sticky='top' className='w-100 p-0' id='sticky-filter'>
        <div className='d-block w-100 mx-0 my-2 shadow'>
          <GoldTracker />
          <Card className='background-light rounded-0 border-dark border-bottom-0 border-end-0 border-start-0'>
            <Card.Header className='border-0'>
              <Container>
                <ItemSearch items={lootItems} setFilteredItems={setFilteredItems} setLoading={setLoading} />
                <OwnerFilter itemOwners={itemOwners} />
              </Container>
            </Card.Header>
          </Card>
          <Card className='background-light rounded-0 rounded-bottom border-dark border-start-0 border-end-0 border-bottom-0'>
            <Card.Header className='border-0 d-flex'>
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
            </Card.Header>
          </Card>
        </div>
      </Navbar>
      <Row className='mx-1'>
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
