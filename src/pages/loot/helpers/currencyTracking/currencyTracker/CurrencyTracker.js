import React, { useContext, useEffect, useState } from 'react';
import { Row, Spinner, Col } from 'react-bootstrap';
import { GroupContext } from '../../../../../utils/contexts/GroupContext';
import { GlobalFeatures } from '../../../../../utils/contexts/GlobalFeatures';
import CurrencyTrackerDisplay from './CurrencyTrackerDisplay';
import CurrencyEditor from './CurrencyEditor';
import ValueDisplay from '../../itemCRUD/ValueDisplay';

export default function CurrencyTracker({ filteredItems }) {
  const { sortBy, groupDoc, currency, loadingCurrency, allTags } = useContext(GroupContext);
  const { defaultColors, currencyKeys } = useContext(GlobalFeatures);

  const [itemOwnerName, setItemOwnerName] = useState('Party');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    groupDoc
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
      <div className='accordion accordion-flush' id='gold-tracker-accordion'>
        <div className='accordion-item clear-background'>
          <h2 className='accordion-header' id='currencyTrackerHeading'>
            <button
              className='accordion-icon-alt accordion-button accordion-button-loot-dark collapsed'
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
                <h1 className='fancy-font fs-md-deco m-0 text-center'>{itemOwnerName} Gold</h1>
              )}
            </button>
          </h2>
          <div
            id='collapseOne'
            className='accordion-collapse collapse'
            aria-labelledby='currencyTrackerHeading'
            data-bs-parent='#gold-tracker-accordion'
          >
            <div className='accordion-body'>
              <Row className='px-2'>
                <Col>
                  <Row>
                    {currencyKeys.map((currencyKey, idx) => (
                      <CurrencyTrackerDisplay
                        key={idx}
                        tags={allTags?.[currencyKey]}
                        currency={!loadingCurrency && currency && currency[sortBy]?.[currencyKey]}
                        currencyKey={currencyKey}
                        defaultColor={defaultColors[idx]}
                      />
                    ))}
                  </Row>
                </Col>
                <Col xs={2}>
                  <CurrencyEditor />
                </Col>
              </Row>
              <ValueDisplay filteredItems={filteredItems}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
