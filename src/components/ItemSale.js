import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Badge, Row, Col, Alert } from 'react-bootstrap';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';
import { GlobalFeatures } from '../utils/contexts/GlobalFeatures';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import TagEditTrigger from '../pages/loot/helpers/TagEditTrigger';

export default function ItemSale({ item }) {
  const { currentGroup } = useContext(GroupContext);
  const { writeHistoryEvent, defaultColors, currencyKeys } = useContext(GlobalFeatures);
  const { db, currentUser } = useContext(AuthContext);

  const groupRef = db.collection('groups').doc(currentGroup);
  const currencyRef = db.collection('groups').doc(currentGroup).collection('currency').doc('currency');
  const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`);
  const colorTagRef = db.collection('groups').doc(currentGroup).collection('currency').doc('colorTags');
  // All tag data will eventually be stored in a single tag object in DB. We are transitioning from 'colorTags'
  const tagRef = db.collection('groups').doc(currentGroup).collection('currency').doc('tags');

  const [partyData] = useDocumentData(groupRef);
  const [colorTags] = useDocumentData(colorTagRef);
  const [currency] = useDocumentData(currencyRef);
  const [allTags] = useDocumentData(tagRef);

  const qtyRef = useRef();

  const currency1Ref = useRef();
  const currency2Ref = useRef();
  const currency3Ref = useRef();
  const currency4Ref = useRef();
  const currency5Ref = useRef();
  const currency6Ref = useRef();

  const sellerRef = useRef();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sellState, setSellState] = useState({});
  const [sellQty, setSellQty] = useState(1);

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

  const calculateSale = (seller, currency, sellState, currencyKeys) => {
    let output = {};
    currencyKeys.forEach((currencyKey) => {
      output[currencyKey] =
        parseInt(currency?.[seller]?.[currencyKey] || 0) + (sellState?.[currencyKey] || 0) * sellQty;
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

  const writeSaleTotals = async (seller, total) => {
    currencyRef
      .set(
        {
          [seller]: total,
        },
        { merge: true }
      )
      .catch((err) => console.error(err));
  };

  const compileHistoryData = (seller, sellQty, item, sellState, currencyKeys) => {
    let data = {
      qty: parseInt(sellQty),
      itemName: item.itemName,
      currency: [],
      seller: seller === 'All' ? 'the party' : seller,
    };
    currencyKeys.forEach((currencyKey) => {
      data.currency.push((sellState[currencyKey] || 0) * sellQty);
    });
    writeHistoryEvent(currentUser.uid, 'sellItem', data);
  };

  const sellItem = () => {
    if (!checkSellValidations(currencyKeys, sellState, sellQty)) return;
    setLoading(true);
    let totals = calculateSale(sellerRef.current.value, currency, sellState, currencyKeys);
    writeSaleTotals(sellerRef.current.value, totals).then(() => {
      compileHistoryData(sellerRef.current.value, sellQty, item, sellState, currencyKeys);
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
    console.log('sellState: ', sellState);
    console.log('sellQty: ', sellQty);
  }, [sellState]);

  return (
    <>
      <Badge
        as='button'
        className='mt-3 mr-2 p-0 pl-3 pr-3 background-success border-0'
        disabled={loading}
        type='button'
        onClick={handleShow}
      >
        <img alt='Sell Item' src='APPIcons/coin.svg'></img>
      </Badge>

      <Modal show={show} onHide={handleClose}>
        <Form className='texture-backer rounded'>
          <Modal.Header closeButton>
            <Modal.Title>Sell {item.itemName}?</Modal.Title>
          </Modal.Header>
          <Modal.Body className='pt-0 pb-0'>
            <Row>
              <Col className='pb-2'>This action cannot be undone!</Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId='itemQty'>
                  <Form.Control
                    type='number'
                    ref={qtyRef}
                    disabled={item.itemQty <= 1 && true}
                    defaultValue={item.itemQty <= 1 && 1}
                    placeholder='Qty'
                    onChange={() => setSellQty(parseInt(qtyRef.current.value || 0))}
                  />
                </Form.Group>
              </Col>
              <Col xs={3} className='pl-0'>
                <Button
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
              <Col xs={2} className='pr-0'>
                <TagEditTrigger
                  tags={allTags?.[currencyKeys[0]]}
                  colorTag={colorTags?.[currencyKeys[0]] || defaultColors[0]}
                  disabled={true}
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice1'>
                  <Form.Control
                    type='number'
                    ref={currency1Ref}
                    onChange={() => updateSellState(currencyKeys[0], currency1Ref.current.value)}
                    placeholder='Price'
                  />
                </Form.Group>
              </Col>
              <Col xs={2} className='pr-0'>
                <TagEditTrigger
                  tags={allTags?.[currencyKeys[1]]}
                  colorTag={colorTags?.[currencyKeys[1]] || defaultColors[1]}
                  disabled={true}
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice2'>
                  <Form.Control
                    type='number'
                    ref={currency2Ref}
                    onChange={() => updateSellState(currencyKeys[1], currency2Ref.current.value)}
                    placeholder='Price'
                  />
                </Form.Group>
              </Col>

              <Col xs={2} className='pr-0'>
                <TagEditTrigger
                  tags={allTags?.[currencyKeys[2]]}
                  colorTag={colorTags?.[currencyKeys[2]] || defaultColors[2]}
                  disabled={true}
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice3'>
                  <Form.Control
                    type='number'
                    ref={currency3Ref}
                    onChange={() => updateSellState(currencyKeys[2], currency3Ref.current.value)}
                    placeholder='Price'
                  />
                </Form.Group>
              </Col>
              <Col xs={2} className='pr-0'>
                <TagEditTrigger
                  tags={allTags?.[currencyKeys[3]]}
                  colorTag={colorTags?.[currencyKeys[3]] || defaultColors[3]}
                  disabled={true}
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice4'>
                  <Form.Control
                    type='number'
                    ref={currency4Ref}
                    onChange={() => updateSellState(currencyKeys[3], currency4Ref.current.value)}
                    placeholder='Price'
                  />
                </Form.Group>
              </Col>

              <Col xs={2} className='pr-0'>
                <TagEditTrigger
                  tags={allTags?.[currencyKeys[4]]}
                  colorTag={colorTags?.[currencyKeys[4]] || defaultColors[4]}
                  disabled={true}
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice5'>
                  <Form.Control
                    type='number'
                    ref={currency5Ref}
                    onChange={() => updateSellState(currencyKeys[4], currency5Ref.current.value)}
                    placeholder='Price'
                  />
                </Form.Group>
              </Col>
              <Col xs={2} className='pr-0'>
                <TagEditTrigger
                  tags={allTags?.[currencyKeys[5]]}
                  colorTag={colorTags?.[currencyKeys[5]] || defaultColors[5]}
                  disabled={true}
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice6'>
                  <Form.Control
                    type='number'
                    ref={currency6Ref}
                    onChange={() => updateSellState(currencyKeys[5], currency6Ref.current.value)}
                    placeholder='Price'
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId='itemOwner'>
                  <Form.Label>Item seller</Form.Label>
                  <Form.Control as='select' defaultValue={item && item.owner} ref={sellerRef}>
                    <option value={'All'}>Party</option>
                    {partyData &&
                      partyData.party &&
                      partyData.party.map((partyMember, idx) => <option key={idx}>{partyMember}</option>)}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className='pt-0'>
            {errorMessage && (
              <Alert variant='warning' className='w-100'>
                {errorMessage}
              </Alert>
            )}
            <Button
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
