import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Badge, Row, Col, Alert, Container } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import GoldInput from './GoldInput';
import ItemOwnerSelect from '../../common/ItemOwnerSelect';

export default function ItemSale({ item, itemOwners }) {
  const { currentGroup } = useContext(GroupContext);
  const { writeHistoryEvent, defaultColors, currencyKeys } = useContext(GlobalFeatures);
  const { db, currentUser } = useContext(AuthContext);

  const groupRef = db.collection('groups').doc(currentGroup);
  const currencyRef = groupRef.collection('currency').doc('currency');
  const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`);
  const colorTagRef = groupRef.collection('currency').doc('colorTags');
  // All tag data will eventually be stored in a single tag object in DB. We are transitioning from 'colorTags'
  const tagRef = groupRef.collection('currency').doc('tags');

  const [colorTags] = useDocumentData(colorTagRef);
  const [currency] = useDocumentData(currencyRef);
  const [allTags] = useDocumentData(tagRef);

  const qtyRef = useRef();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sellState, setSellState] = useState({});
  const [sellQty, setSellQty] = useState(1);
  const [sellerId, setSellerId] = useState('party');

  const handleClose = () => {
    setShow(false);
    setErrorMessage('');
    setSellQty(1);
    setSellState({});
  };
  const handleShow = () => setShow(true);

  const maxQty = (qty, qtyRef) => {
    setSellQty(qty);
    qtyRef.current.value = qty;
  };

  const updateSellState = (currencyKey, value) => {
    setSellState({
      ...sellState,
      [currencyKey]: parseInt(value),
    });
  };

  const calculateSale = (sellerId, currency, sellState, currencyKeys) => {
    let output = {};
    currencyKeys.forEach((currencyKey) => {
      output[currencyKey] =
        parseInt(currency?.[sellerId]?.[currencyKey] || 0) + (sellState?.[currencyKey] || 0) * sellQty;
    });
    return output;
  };

  const deleteItem = () => {
    itemRef
      .delete()
      .then(() => {
        setLoading(false);
        handleClose();
      })
      .catch((err) => {
        console.error('Error removing item: ', err);
      });
  };

  const updateQty = (itemQty, sellQty) => {
    itemRef
      .update({
        itemQty: itemQty - sellQty,
      })
      .then(() => {
        handleClose();
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error updating quantity: ', err);
      });
  };

  const checkSellValidations = (currencyKeys, sellState, sellQty) => {
    let valueCheck = false;
    if (sellQty < 1) {
      setErrorMessage('Quantity must be greater than 0');
      return false;
    }
    if (sellQty > parseInt(item.itemQty || 1)) {
      setErrorMessage('Cannot sell more items than you own');
      return false;
    }
    currencyKeys.forEach((currencyKey) => {
      if (sellState[currencyKey]) valueCheck = true;
    });
    if (valueCheck === false) {
      setErrorMessage('At least one sale price must be entered');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const writeSaleTotals = async (sellerId, total) => {
    currencyRef
      .set(
        {
          [sellerId]: total,
        },
        { merge: true }
      )
      .catch((err) => console.error(err));
  };

  const compileHistoryData = (seller = 'party', sellQty, item, sellState, currencyKeys) => {
    let data = {
      qty: parseInt(sellQty),
      itemName: item.itemName,
      currency: [],
      seller: seller === 'party' ? 'the party' : itemOwners.find((owner) => owner.id === seller).name,
    };
    currencyKeys.forEach((currencyKey) => {
      data.currency.push((sellState[currencyKey] || 0) * sellQty);
    });
    writeHistoryEvent(currentUser.uid, 'sellItem', data);
  };

  const sellItem = () => {
    if (!checkSellValidations(currencyKeys, sellState, sellQty)) return;
    setLoading(true);
    let totals = calculateSale(sellerId, currency, sellState, currencyKeys);
    writeSaleTotals(sellerId, totals).then(() => {
      compileHistoryData(sellerId, sellQty, item, sellState, currencyKeys);
      if (item.itemQty >= 2) {
        if (item.itemQty <= sellQty) {
          deleteItem();
        } else {
          // In this case, just add currency and update item qty
          updateQty(item.itemQty, sellQty);
        }
      }
      if (item.itemQty < 2) {
        deleteItem();
      }
    });
  };

  useEffect(() => {
    item && setSellerId(item.ownerId);
  }, [item]);

  return (
    <>
      <Badge
        data-cy='sell-item'
        as='button'
        className='mt-3 mr-2 p-0 pl-3 pr-3 background-success border-0'
        disabled={loading}
        type='button'
        onClick={handleShow}
      >
        <img alt='Sell Item' src='APPIcons/coin.svg'></img>
      </Badge>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Form className=' rounded'>
          <Modal.Header closeButton>
            <Modal.Title className='p-1'>Sell {item.itemName}?</Modal.Title>
          </Modal.Header>
          <Modal.Body className='pt-0 pb-0'>
            <Container fluid>
              <Row>
                <Col className='p-1 pb-2'>This action cannot be undone!</Col>
              </Row>
              <Row className='pb-2'>
                <Col className='p-1'>
                  <Form.Control
                    data-cy='sell-qty'
                    type='number'
                    ref={qtyRef}
                    disabled={item.itemQty <= 1 && true}
                    defaultValue={item.itemQty <= 1 && 1}
                    placeholder='Qty'
                    onChange={() => setSellQty(parseInt(qtyRef.current.value || 0))}
                  />
                </Col>
                <Col xs={3} className='p-1'>
                  <Button
                    data-cy='sell-max-qty'
                    className='w-100 background-dark border-0'
                    disabled={item.itemQty <= 1 && true}
                    variant='dark'
                    onClick={() => maxQty(item.itemQty, qtyRef)}
                  >
                    Sell all
                  </Button>
                </Col>
              </Row>
              <Row>
                {currencyKeys.map((currencyKey, idx) => (
                  <GoldInput
                    key={idx}
                    tags={allTags?.[currencyKey]}
                    currencyKey={currencyKey}
                    colorTag={colorTags?.[currencyKey]}
                    defaultColor={defaultColors[idx]}
                    setState={updateSellState}
                    disabled={true}
                  />
                ))}
              </Row>
              <Row className='pb-2'>
                <Col className='p-1'>
                  <Form.Label>Item seller</Form.Label>
                  <ItemOwnerSelect itemOwners={itemOwners} setState={setSellerId} value={sellerId} />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer className='pt-0 texture-backer'>
            {errorMessage && (
              <Alert variant='warning' className='w-100'>
                {errorMessage}
              </Alert>
            )}
            <Button
              data-cy='confirm-sell-item'
              className='mt-3 p-2 pl-3 pr-3 background-success border-0 text-light'
              disabled={loading}
              variant='success'
              type='button'
              onClick={sellItem}
            >
              Sell item
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
