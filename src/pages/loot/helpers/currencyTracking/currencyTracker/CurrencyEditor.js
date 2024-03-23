import React, { useState, useContext, useEffect } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import CurrencyTrackerInput from './CurrencyTrackerInput';
import { GlobalFeatures } from '../../../../../utils/contexts/GlobalFeatures';
import { GroupContext } from '../../../../../utils/contexts/GroupContext';

export default function CurrencyEditor({ allTags }) {
  const { groupDoc, sortBy, currency } = useContext(GroupContext);
  const { defaultColors, currencyKeys } = useContext(GlobalFeatures);

  const tagRef = groupDoc.collection('currency').doc('tags');

  const [tagState, setTagState] = useState({});
  const [loading, setLoading] = useState(false);
  const [newCurrencyTotals, setNewCurrencyTotals] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNewCurrencyTotals(currency[sortBy]);
    setShow(true);
  };

  const updateTagState = (key, tag, value) => {
    setTagState({
      ...tagState,
      [key]: {
        ...tagState[key],
        [tag]: value,
      },
    });
  };

  const clearStateAndClose = () => {
    setTagState({});
    handleClose();
  };

  const updateTags = async (tagState) => {
    setLoading(true);
    tagRef.set(tagState, { merge: true }).catch((err) => console.error(err));
  };

  const updateCurrencyTotals = async (newCurrencyTotals) => {
    setLoading(true);
    const groupCurrency = groupDoc.collection('currency').doc('currency');
    groupCurrency.set({ [sortBy]: newCurrencyTotals }, { merge: true }).catch((err) => console.error(err));
  };

  const updateCurrencyData = (tagState, newCurrencyTotals) => {
    updateTags(tagState).then(() => {
      clearStateAndClose();
      setLoading(false);
    });
    console.log(sortBy);
    console.log(newCurrencyTotals);
    updateCurrencyTotals(newCurrencyTotals);
  };

  useEffect(() => {
    newCurrencyTotals && console.log('newCurrencyTotals: ', newCurrencyTotals);
  }, [newCurrencyTotals]);

  return (
    <>
      <Button
        variant='dark'
        className='w-100 background-dark h-100 border d-flex align-items-center justify-content-center'
        onClick={handleShow}
      >
        <img alt='Edit Item' src='APPIcons/pencil-square.svg' />
      </Button>
      <Modal size='lg' show={show} onHide={clearStateAndClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className='text-left pb-2'>
              <Col xs={2} className='px-1'>
                <img alt='Palette' src='/APPIcons/palette.svg'></img>
              </Col>
              <Col xs={2} className='px-1'>
                <img alt='Symbol' src='/APPIcons/type.svg'></img>
              </Col>
              <Col xs={3} className='px-1'>
                <img alt='Theme' src='/APPIcons/type-theme.svg'></img>
              </Col>
              <Col>
                <img alt='Quantity' src='APPIcons/coin-dark.svg'></img>
              </Col>
            </Row>
            {currencyKeys.map((currencyKey, idx) => (
              <CurrencyTrackerInput
                key={idx}
                tags={allTags?.[currencyKey]}
                updateTagState={updateTagState}
                defaultColor={defaultColors[idx]}
                currencyKey={currencyKey}
                newCurrencyTotals={newCurrencyTotals}
                setNewCurrencyTotals={setNewCurrencyTotals}
              />
            ))}
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button
            disabled={loading}
            variant='dark'
            className='background-dark'
            onClick={() => updateCurrencyData(tagState, newCurrencyTotals)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
