import React, { useContext, useEffect, useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import GoldInput from './GoldInput';
import TagEditor from './TagEditor';
import { gsap } from 'gsap';

export default function GoldTracker() {
  const { db } = useContext(AuthContext);
  const { currentGroup, sortBy } = useContext(GroupContext);
  const { defaultColors, currencyKeys } = useContext(GlobalFeatures);

  const [showTagEditor, setShowTagEditor] = useState(false);
  const [open, setOpen] = useState(false);
  const [itemOwnerName, setItemOwnerName] = useState('Party');
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShowTagEditor(false);
  const handleShow = () => setShowTagEditor(true);

  const groupRef = db.collection('groups').doc(currentGroup);
  const currencyRef = groupRef.collection('currency').doc('currency');
  const colorTagRef = groupRef.collection('currency').doc('colorTags');
  // All tag data will eventually be stored in a single tag object in DB. We are transitioning from 'colorTags'
  const tagRef = groupRef.collection('currency').doc('tags');

  const [currency, loadingCurrency] = useDocumentData(currencyRef);
  const [colorTags] = useDocumentData(colorTagRef);
  const [allTags] = useDocumentData(tagRef);

  useEffect(() => {
    gsap.fromTo('.chevron-left', { rotate: 180 }, { rotate: 0, duration: 0.35 });
    gsap.fromTo('.chevron-right', { rotate: -180 }, { rotate: 0, duration: 0.35 });
  }, [open]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    groupRef
      .collection('itemOwners')
      .doc(sortBy)
      .get()
      .then((doc) => {
        if (isMounted) {
          if (doc.exists) {
            setItemOwnerName(doc.data().name);
          } else {
            setItemOwnerName('Party');
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error getting document:', error);
      });
    return () => {
      isMounted = false;
    };
  }, [sortBy]);

  return (
    <>
      <TagEditor allTags={allTags} colorTags={colorTags} show={showTagEditor} handleClose={handleClose} />
      <div className='accordion accordion-flush' id='gold-tracker-accordion'>
        <div className='accordion-item clear-background'>
          <h2 className='accordion-header' id='goldTrackerHeading'>
            <button
              className='accordion-icon-alt accordion-button rounded-top accordion-button-loot-dark collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseOne'
              aria-expanded='false'
              aria-controls='collapseOne'
            >
              {loading ? (
                <Spinner
                  as='div'
                  className='d-flex ml-auto mr-auto loading-spinner-xs'
                  animation='border'
                  role='status'
                  variant='light'
                />
              ) : (
                <h1 className='item-h1 m-0 text-center'>{itemOwnerName} Gold</h1>
              )}
            </button>
          </h2>
          <div
            id='collapseOne'
            className='accordion-collapse collapse'
            aria-labelledby='goldTrackerHeading'
            data-bs-parent='#gold-tracker-accordion'
          >
            <div className='accordion-body background-light'>
              <Row>
                {currencyKeys.map((currencyKey, idx) => (
                  <GoldInput
                    key={idx}
                    tags={allTags?.[currencyKey]}
                    currency={!loadingCurrency && currency && currency[sortBy]?.[currencyKey]}
                    currencyKey={currencyKey}
                    handleShow={handleShow}
                    colorTag={colorTags?.[currencyKey]}
                    defaultColor={defaultColors[idx]}
                  />
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
