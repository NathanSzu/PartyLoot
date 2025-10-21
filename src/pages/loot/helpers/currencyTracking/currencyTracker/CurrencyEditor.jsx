import { useState, useContext, useEffect } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../utils/firebase';
import CurrencyTrackerInput from './CurrencyTrackerInput';
import { GlobalFeatures } from '../../../../../utils/contexts/GlobalFeatures';
import { GroupContext } from '../../../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../../../utils/contexts/AuthContext';

export default function CurrencyEditor() {
  const { currentUser } = useContext(AuthContext);
  const { groupDoc, getItemOwner, itemQuery, currency, allTags } = useContext(GroupContext);
  const { defaultColors, currencyKeys, writeHistoryEvent } = useContext(GlobalFeatures);

  const [tagState, setTagState] = useState({});
  const [loading, setLoading] = useState(false);
  const [newCurrencyTotals, setNewCurrencyTotals] = useState({});
  const [show, setShow] = useState(false);
  const [itemOwner, setItemOwner] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNewCurrencyTotals(currency?.[itemQuery.itemOwner] || {});
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
    try {
      const tagsRef = doc(db, 'groups', groupDoc.id, 'currency', 'tags');
      await setDoc(tagsRef, tagState, { merge: true });
    } catch (err) {
      console.error('Error updating tags:', err);
    }
  };

  const updateCurrencyTotals = async (newCurrencyTotals) => {
    setLoading(true);
    try {
      const currencyRef = doc(db, 'groups', groupDoc.id, 'currency', 'currency');
      await setDoc(currencyRef, { [itemQuery.itemOwner]: newCurrencyTotals }, { merge: true });
    } catch (err) {
      console.error('Error updating currency:', err);
    }
  };

  const compileHistoryData = (itemOwner, oldCurrency, newCurrency, currencyKeys) => {
    let data = {
      itemOwner: itemOwner,
      oldCurrency: [],
      newCurrency: [],
    };
    currencyKeys.forEach((currencyKey) => {
      data.oldCurrency.push(oldCurrency?.[currencyKey] || 0);
      data.newCurrency.push(newCurrency?.[currencyKey] || 0);
    });
    writeHistoryEvent(currentUser.uid, 'updateCurrency', data);
  };

  const updateCurrencyData = async (tagState, newCurrencyTotals) => {
    try {
      await updateTags(tagState);
      await updateCurrencyTotals(newCurrencyTotals);
      compileHistoryData(itemOwner, currency?.[itemQuery.itemOwner] || {}, newCurrencyTotals, currencyKeys);
      clearStateAndClose();
      setLoading(false);
    } catch (err) {
      console.error('Error updating currency data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getItemOwner(itemQuery.itemOwner, setItemOwner);
  }, [itemQuery.itemOwner]);

  return (
    <>
      <Button
        variant='dark'
        className='w-100 background-dark h-100 border d-flex align-items-center justify-content-center'
        onClick={handleShow}
        data-cy='edit-currency'
      >
        <img alt='Edit Currency' src='APPIcons/pencil-square.svg' />
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
            data-cy='save-currency'
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
