import React, { useState, useContext, useRef } from 'react';
import { Modal, Button, Form, Badge, Row, Col, Alert } from 'react-bootstrap';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function ModalLoot({ item }) {
  const { currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const groupRef = db.collection('groups').doc(currentGroup);
  const colorTagRef = db.collection('groups').doc(currentGroup).collection('currency').doc('colorTags');
  const currencyRef = db.collection('groups').doc(currentGroup).collection('currency').doc('currency');
  const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`);

  const [partyData] = useDocumentData(groupRef);
  const [colorTags] = useDocumentData(colorTagRef);
  const [currency] = useDocumentData(currencyRef);

  const qtyRef = useRef();

  const currency1Ref = useRef();
  const currency2Ref = useRef();
  const currency3Ref = useRef();
  const currency4Ref = useRef();
  const currency5Ref = useRef();
  const currency6Ref = useRef();

  const allCurrencies = ['currency1', 'currency2', 'currency3', 'currency4', 'currency5', 'currency6'];
  const allCurrencyRefs = [currency1Ref, currency2Ref, currency3Ref, currency4Ref, currency5Ref, currency6Ref];

  const sellerRef = useRef();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const maxQty = () => (qtyRef.current.value = item.itemQty);

  const deleteItem = () => {
    setLoading(true);
    handleClose();
    itemRef
      .delete()
      .then(() => {
        handleClose();
        setLoading(false);
      })
      .catch((error) => {
        handleClose();
        setLoading(false);
        console.error('Error removing item: ', error);
      });
  };

  const updateQty = (qty, qtySold) => {
    itemRef
      .update({
        itemQty: qty - qtySold,
      })
      .then(() => {
        handleClose();
        setLoading(false);
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error('Error updating quantity: ', error);
        handleClose();
        setLoading(false);
      });
  };

  const checkSellValidations = () => {
    if (!qtyRef.current.value) {
      setErrorMessage('Quantity must be greater than 0');
      return false;
    }
    if (parseInt(qtyRef.current.value) > parseInt((item.itemQty || 1))) {
      setErrorMessage('Cannot sell more items than you own');
      console.log(item.itemQty);
      return false;
    }
    if (
      !currency1Ref.current.value &&
      !currency2Ref.current.value &&
      !currency3Ref.current.value &&
      !currency4Ref.current.value &&
      !currency5Ref.current.value &&
      !currency6Ref.current.value
    ) {
      setErrorMessage('At least one sale price must be entered');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const addCurrency = (currentCurrency, currencyValueRefs, currencies) => {
    for (let i = 0; i < currencyValueRefs.length; i++) {
      let updatedValue =
        parseInt(currentCurrency[sellerRef.current.value][currencies[i]] || 0) +
        parseInt(currencyValueRefs[i].current.value || 0) * parseInt(qtyRef.current.value || 1);
      console.log(updatedValue);
      currencyRef.set(
        {
          [sellerRef.current.value]: {
            [currencies[i]]: updatedValue,
          },
        },
        { merge: true }
      );
    }
  };

  const sellItem = () => {
    qtyRef.current && console.log('Qty: ', qtyRef.current.value);
    sellerRef.current && console.log('Seller: ', sellerRef.current.value);
    if (item.itemQty >= 2) {
      if (!checkSellValidations()) return;
      setLoading(true);
      addCurrency(currency, allCurrencyRefs, allCurrencies);
      if (item.itemQty <= qtyRef.current.value) {
        deleteItem();
      } else {
        // In this case, just add currency and update item qty
        updateQty(item.itemQty, qtyRef.current.value);
      }
    }
    if (item.itemQty < 2) {
      if (!checkSellValidations()) return;
      setLoading(true);
      addCurrency(currency, allCurrencyRefs, allCurrencies);
      deleteItem();
    }
  };

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
                  />
                </Form.Group>
              </Col>
              <Col xs={3} className='pl-0'>
                <Button
                  className='w-100 background-dark border-0'
                  disabled={item.itemQty <= 1 && true}
                  variant='dark'
                  onClick={maxQty}
                >
                  Sell all
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={2} className='pr-0'>
                <Form.Control
                  type='color'
                  value={(colorTags && colorTags.currency1) || '#ffbb00'}
                  disabled='true'
                  className='p-0 border-0 background-unset'
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice1'>
                  <Form.Control type='number' ref={currency1Ref} placeholder='Price' />
                </Form.Group>
              </Col>
              <Col xs={2} className='pr-0'>
                <Form.Control
                  type='color'
                  value={(colorTags && colorTags.currency2) || '#bdbdbd'}
                  disabled='true'
                  className='p-0 border-0 background-unset'
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice2'>
                  <Form.Control type='number' ref={currency2Ref} placeholder='Price' />
                </Form.Group>
              </Col>

              <Col xs={2} className='pr-0'>
                <Form.Control
                  type='color'
                  value={(colorTags && colorTags.currency3) || '#d27e1e'}
                  disabled='true'
                  className='p-0 border-0 background-unset'
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice3'>
                  <Form.Control type='number' ref={currency3Ref} placeholder='Price' />
                </Form.Group>
              </Col>
              <Col xs={2} className='pr-0'>
                <Form.Control
                  type='color'
                  value={(colorTags && colorTags.currency4) || '#ffffff'}
                  disabled='true'
                  className='p-0 border-0 background-unset'
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice4'>
                  <Form.Control type='number' ref={currency4Ref} placeholder='Price' />
                </Form.Group>
              </Col>

              <Col xs={2} className='pr-0'>
                <Form.Control
                  type='color'
                  value={(colorTags && colorTags.currency5) || '#ffffff'}
                  disabled='true'
                  className='p-0 border-0 background-unset'
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice5'>
                  <Form.Control type='number' ref={currency5Ref} placeholder='Price' />
                </Form.Group>
              </Col>
              <Col xs={2} className='pr-0'>
                <Form.Control
                  type='color'
                  value={(colorTags && colorTags.currency6) || '#ffffff'}
                  disabled='true'
                  className='p-0 border-0 background-unset'
                />
              </Col>
              <Col xs={4}>
                <Form.Group controlId='itemPrice6'>
                  <Form.Control type='number' ref={currency6Ref} placeholder='Price' />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId='itemOwner'>
                  <Form.Label>Item seller</Form.Label>
                  <Form.Control as='select' defaultValue={item && item.owner} ref={sellerRef}>
                    <option>Party</option>
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
