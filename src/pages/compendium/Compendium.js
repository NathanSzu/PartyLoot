import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';
// import fb from 'firebase';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import CompendiumList from './helpers/CompendiumList';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { Filter, SettingFilter } from './helpers/Filter';
import UserDiscoveriesControls from './helpers/UserDiscoveriesControls';

export default function Compendium() {
  const { db, userRef, currentUser } = useContext(AuthContext);
  const { isVisible, itemMetadata } = useContext(GlobalFeatures);

  const [compendium, setCompendium] = useState([]);
  const [showMyDiscoveries, setShowMyDiscoveries] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(['abc']);
  const [settingFilter, setSettingFilter] = useState(null);
  const [orderBy, setOrderBy] = useState('likeCount');
  const [startAfter, setStartAfter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData] = useDocumentDataOnce(userRef);

  const queryRef = db
    .collection('compendium')
    .where('itemStatus', '==', 'published')
    .where('categories', 'array-contains-any', categoryFilter)
    .orderBy(orderBy, 'desc');

  const complexQueryRef = db
    .collection('compendium')
    .where('itemStatus', '==', 'published')
    .where('categories', 'array-contains-any', categoryFilter)
    .where('setting', '==', settingFilter)
    .orderBy(orderBy, 'desc');

  const authorQueryRef = db
    .collection('compendium')
    .where('categories', 'array-contains-any', categoryFilter)
    .where('creatorId', '==', currentUser.uid)
    .orderBy(orderBy, 'desc');

  const authorComplexQueryRef = db
    .collection('compendium')
    .where('categories', 'array-contains-any', categoryFilter)
    .where('setting', '==', settingFilter)
    .where('creatorId', '==', currentUser.uid)
    .orderBy(orderBy, 'desc');

  const defineQuery = () => {
    if (showMyDiscoveries) {
      return settingFilter ? authorComplexQueryRef : authorQueryRef;
    }
    if (!showMyDiscoveries) {
      return settingFilter ? complexQueryRef : queryRef;
    }
  };

  const getCompendium = () => {
    setLoading(true);
    return defineQuery()
      .limit(15)
      .get()
      .then((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          results.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        if (results.length < 15) {
          setLoading(false);
        }
        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        lastVisible && setStartAfter(lastVisible);
        lastVisible ? setCompendium([...results]) : setCompendium([]);
      });
  };

  const getNextPage = () => {
    return defineQuery()
      .startAfter(startAfter)
      .limit(15)
      .get()
      .then((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          results.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        if (results.length < 15) {
          setLoading(false);
        }
        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        lastVisible && setStartAfter(lastVisible);
        lastVisible && setCompendium([...compendium, ...results]);
      });
  };

  const loadMore = (length) => {
    isVisible(`#item${length - 3}`) && getNextPage();
  };

  useEffect(() => {
    itemMetadata?.categories && setCategoryFilter(Object.keys(itemMetadata.categories));
  }, [itemMetadata]);

  useEffect(() => {
    setCompendium([]);
    categoryFilter && getCompendium();
    settingFilter && getCompendium();
    showMyDiscoveries && getCompendium();
  }, [categoryFilter, settingFilter, showMyDiscoveries]);

  return (
    <Container className='lazy-scroll-container pl-1 pr-1' onScroll={() => loadMore(compendium.length)}>
      <Navbar sticky='top' className='w-100 p-0' id='sticky-compendium-filter'>
        <div className='d-block w-100 mx-0 mt-2 shadow background-light rounded'>
          <div className='accordion accordion-flush' id='gold-tracker-accordion'>
            <div className='accordion-item clear-background'>
              <h2 className='accordion-header' id='goldTrackerHeading'>
                <button
                  className='accordion-icon-alt accordion-button rounded-top accordion-button-loot-dark collapsed fancy-font fs-md-deco'
                  type='button'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseOne'
                  aria-expanded='false'
                  aria-controls='collapseOne'
                >
                  Filter / search
                </button>
              </h2>
              <div
                id='collapseOne'
                className='accordion-collapse collapse rounded-0'
                aria-labelledby='goldTrackerHeading'
                data-bs-parent='#gold-tracker-accordion'
              >
                <div className='accordion-body background-light'>
                  <Row>
                    <Col xs={6}>
                      <Filter metadata={itemMetadata?.categories} setState={setCategoryFilter} />
                    </Col>
                    <Col xs={6}>
                      <SettingFilter metadata={itemMetadata?.settings} setState={setSettingFilter} />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
          <UserDiscoveriesControls
            show={showMyDiscoveries}
            setShow={setShowMyDiscoveries}
            displayName={userData?.displayName}
            getCompendium={getCompendium}
          />
        </div>
      </Navbar>
      <CompendiumList compendium={compendium} loading={loading} getCompendium={getCompendium} />
    </Container>
  );
}
