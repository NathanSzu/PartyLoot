import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';
// import fb from 'firebase';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import CompendiumList from './helpers/CompendiumList';
import OglList from './helpers/OglList';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { Filter, SettingFilter } from './helpers/Filter';
import UserDiscoveriesControls from './helpers/UserDiscoveriesControls';

export default function Compendium() {
  const { db, userRef, currentUser } = useContext(AuthContext);
  const { isVisible, itemMetadata } = useContext(GlobalFeatures);

  const [compendium, setCompendium] = useState([]);
  const [oglResults, setOglResults] = useState(null);
  const [showMyDiscoveries, setShowMyDiscoveries] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(['abc']);
  const [settingFilter, setSettingFilter] = useState(null);
  const [orderBy, setOrderBy] = useState('likeCount');
  const [startAfter, setStartAfter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingOgl, setLoadingOgl] = useState(true);
  const [userData] = useDocumentDataOnce(userRef);
  const [oglTabActive, setOglTabActive] = useState(false);

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

  const getOglResults = async (changePageQuery = '', query = '', page = 1) => {
    setLoadingOgl(true);
    const response = await fetch(changePageQuery || `https://api.open5e.com/v1/magicitems/?page=${page}&search=${query}&limit=25`, {
      method: 'GET',
      cache: 'default'
    });

    const resJson = await response.json();
    setLoadingOgl(false);
    setOglResults(resJson);
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

  useEffect(() => {
    oglTabActive && !oglResults && getOglResults();
  }, [oglTabActive]);

  return (
    <Container className='lazy-scroll-container pl-1 pr-1' onScroll={() => loadMore(compendium.length)}>
      <Navbar sticky='top' className='w-100 p-0' id='sticky-compendium-filter'>
        <div className='d-block w-100 mx-0 mt-2 shadow background-light rounded'>
          <div className='accordion accordion-flush' id='compendium-accordion'>
            <div className='accordion-item clear-background'>
              <h2 className='accordion-header' id='compendiumHeading'>
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
                aria-labelledby='compendiumHeading'
                data-bs-parent='#compendium-accordion'
              >
                <div className='accordion-body background-light'>
                  <Row>
                    <Col xs={6}>
                      <Filter
                        metadata={itemMetadata?.categories}
                        setState={setCategoryFilter}
                        oglTabActive={oglTabActive}
                      />
                    </Col>
                    <Col xs={6}>
                      <SettingFilter
                        metadata={itemMetadata?.settings}
                        setState={setSettingFilter}
                        oglTabActive={oglTabActive}
                      />
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
            setOglTabActive={setOglTabActive}
          />
        </div>
      </Navbar>
      {!showMyDiscoveries && (
        <nav>
          <div className='nav nav-pills border-0 p-2 rounded mt-2 background-light' id='nav-tab' role='tablist'>
            <button
              className={`nav-link w-50 ${!oglTabActive && 'active'}`}
              id='community-tab'
              data-bs-toggle='tab'
              data-bs-target='#community'
              type='button'
              role='tab'
              aria-controls='community'
              aria-selected={!oglTabActive}
              onClick={() => setOglTabActive(false)}
            >
              Community
            </button>
            <button
              className={`nav-link w-50 ${oglTabActive && 'active'}`}
              id='ogl-tab'
              data-bs-toggle='tab'
              data-bs-target='#ogl'
              type='button'
              role='tab'
              aria-controls='ogl'
              aria-selected={oglTabActive}
              onClick={() => setOglTabActive(true)}
            >
              OGL Content
            </button>
          </div>
        </nav>
      )}
      <div className='tab-content' id='nav-tabContent'>
        <div
          className={`tab-pane fade ${!oglTabActive && 'show active'}`}
          id='community'
          role='tabpanel'
          aria-labelledby='community-tab'
          tabIndex='0'
        >
          <CompendiumList compendium={compendium} loading={loading} getCompendium={getCompendium} />
        </div>
        <div
          className={`tab-pane fade ${oglTabActive && 'show active'}`}
          id='ogl'
          role='tabpanel'
          aria-labelledby='ogl-tab'
          tabIndex='0'
        >
          <OglList oglResults={oglResults} getOglResults={getOglResults} loading={loadingOgl} />
        </div>
      </div>
    </Container>
  );
}
