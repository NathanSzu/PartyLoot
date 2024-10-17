import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';
import { Row, Col, Navbar } from 'react-bootstrap';
import CompendiumList from './helpers/CompendiumList';
import OglList from './helpers/OglList';
import { Filter, SettingFilter, SearchFilter } from './helpers/Filter';
import UserDiscoveriesControls from './helpers/UserDiscoveriesControls';

export default function Compendium() {
  const { db, currentUser, userData } = useContext(AuthContext);
  const { isVisible, itemMetadata } = useContext(GlobalFeatures);

  const [compendium, setCompendium] = useState([]);
  const [oglResults, setOglResults] = useState(null);
  const [showMyDiscoveries, setShowMyDiscoveries] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(['abc']);
  const [settingFilter, setSettingFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [orderBy, setOrderBy] = useState('likeCount');
  const [startAfter, setStartAfter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingOgl, setLoadingOgl] = useState(true);
  const [oglTabActive, setOglTabActive] = useState(false);
  const [timer, setTimer] = useState(0); 

  function delay(fn) {
    clearTimeout(timer);
    setTimer(setTimeout(fn, 1000));
  }

  const setOglTab = (active) => {
    setOglTabActive(active);
    setSearchFilter('');
  };

  const queryRef = db
    .collection('compendium')
    .where('itemStatus', '==', 'published')
    .where('categories', 'array-contains-any', categoryFilter)
    .where('itemNameLower', '>=', searchFilter.toLowerCase())
    .where('itemNameLower', '<=', searchFilter.toLowerCase() + '\uf8ff')
    .orderBy('itemNameLower', 'desc')
    .orderBy(orderBy, 'desc');

  const complexQueryRef = db
    .collection('compendium')
    .where('itemStatus', '==', 'published')
    .where('categories', 'array-contains-any', categoryFilter)
    .where('itemNameLower', '>=', searchFilter.toLowerCase())
    .where('itemNameLower', '<=', searchFilter.toLowerCase() + '\uf8ff')
    .orderBy('itemNameLower', 'desc')
    .where('setting', '==', settingFilter)
    .orderBy(orderBy, 'desc');

  const authorQueryRef = db
    .collection('compendium')
    .where('categories', 'array-contains-any', categoryFilter)
    .where('itemNameLower', '>=', searchFilter.toLowerCase())
    .where('itemNameLower', '<=', searchFilter.toLowerCase() + '\uf8ff')
    .orderBy('itemNameLower', 'desc')
    .where('creatorId', '==', currentUser.uid)
    .orderBy(orderBy, 'desc');

  const authorComplexQueryRef = db
    .collection('compendium')
    .where('categories', 'array-contains-any', categoryFilter)
    .where('itemNameLower', '>=', searchFilter.toLowerCase())
    .where('itemNameLower', '<=', searchFilter.toLowerCase() + '\uf8ff')
    .orderBy('itemNameLower', 'desc')
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
    setCompendium([]);
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
    const response = await fetch(
      changePageQuery || `https://api.open5e.com/v1/magicitems/?page=${page}&search=${query}&limit=25`,
      {
        method: 'GET',
        cache: 'default',
      }
    );

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
    if ((categoryFilter || settingFilter || showMyDiscoveries) && !oglTabActive) {
      setCompendium([]);
      setLoading(true);
      delay(() => getCompendium());
    } else if (oglTabActive) {
      delay(() => getOglResults(null, searchFilter));
    }
  }, [categoryFilter, settingFilter, showMyDiscoveries, searchFilter, oglTabActive]);

  useEffect(() => {
    oglTabActive && !oglResults && getOglResults();
  }, [oglTabActive]);

  return (
    <Row className='lazy-scroll-container' onScroll={() => loadMore(compendium.length)}>
      <Navbar sticky='top' className='w-100 p-0 background-light rounded-bottom' id='sticky-compendium-filter'>
        <div className='d-block w-100'>
          <div className='accordion accordion-flush' id='compendium-accordion'>
            <div className='accordion-item clear-background'>
              <h2 className='accordion-header' id='compendiumHeading'>
                <button
                  data-cy='filters-tab-toggle'
                  className='accordion-icon-alt accordion-button accordion-button-loot-dark collapsed fancy-font fs-md-deco'
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
                <div className='accordion-body'>
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
                    <Col xs={12} className='pt-2'>
                      <SearchFilter state={searchFilter} setState={setSearchFilter} />
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
            setOglTab={setOglTab}
          />

          {!showMyDiscoveries && (
            <div className='nav nav-pills p-2' id='nav-tab' role='tablist'>
              <button
                className={`nav-link w-50 ${!oglTabActive && 'active'}`}
                id='community-tab'
                data-bs-toggle='tab'
                data-bs-target='#community'
                type='button'
                role='tab'
                aria-controls='community'
                aria-selected={!oglTabActive}
                onClick={() => setOglTab(false)}
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
                onClick={() => setOglTab(true)}
              >
                OGL Content
              </button>
            </div>
          )}
        </div>
      </Navbar>

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
    </Row>
  );
}
