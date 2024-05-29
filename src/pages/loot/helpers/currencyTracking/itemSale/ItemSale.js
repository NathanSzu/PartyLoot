import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Container } from 'react-bootstrap';
import { GroupContext } from '../../../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../../../utils/contexts/GlobalFeatures';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import ItemSaleInput from './ItemSaleInput';
import ItemOwnerSelect from '../../../../common/ItemOwnerSelect';

export default function ItemSale({ item }) {
  const { groupDoc, currentGroup, allTags, itemOwners } = useContext(GroupContext);
  const { writeHistoryEvent, defaultColors, currencyKeys } = useContext(GlobalFeatures);
  const { currentUser } = useContext(AuthContext);

  const currencyRef = groupDoc.collection('currency').doc('currency');
  const itemRef = groupDoc.collection('loot').doc(item.id);

  const [currency] = useDocumentData(currencyRef);

  const qtyRef = useRef();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sellState, setSellState] = useState({});
  const [sellQty, setSellQty] = useState(1);
  const [sellerId, setSellerId] = useState('party');
  const [sellerName, setSellerName] = useState('the party');

  const handleClose = () => {
    setSellQty(1);
    setSellState({});
    setErrorMessage('');
    setShow(false);
  };
  const handleShow = () => {
    setSellState(item?.value);
    setShow(true);
  };

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
        handleClose();
        setLoading(false);
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
      if (sellState?.[currencyKey]) valueCheck = true;
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

  const getItemOwner = (itemOwnerId) => {
    itemOwnerId &&
      itemOwners
        .doc(itemOwnerId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setSellerName(doc.data().name);
          } else {
            setSellerName('the party');
          }
        });
  };

  const compileHistoryData = (sellQty, item, sellState, currencyKeys) => {
    let data = {
      qty: parseInt(sellQty),
      itemName: item.itemName,
      currency: [],
      seller: sellerName,
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
      compileHistoryData(sellQty, item, sellState, currencyKeys);
      if (item.itemQty >= 2) {
        if (item.itemQty <= sellQty) {
          deleteItem();
        } else {
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
  }, []);

  useEffect(() => {
    getItemOwner(sellerId);
  }, [sellerId]);

  return (
    <>
      <Button
        data-cy='sell-item'
        className='mt-3 me-2 p-0 px-3 btn-success background-success border-0'
        disabled={loading}
        type='button'
        onClick={handleShow}
      >
        <img alt='Sell Item' src='APPIcons/coin.svg'></img>
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Form className='rounded' onSubmitCapture={(e) => e.preventDefault()}>
          <Modal.Header closeButton>
            <Modal.Title className='p-1'>Sell {item.itemName}?</Modal.Title>
          </Modal.Header>
          <Modal.Body className='pt-0 pb-0 background-light'>
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
                  <ItemSaleInput
                    key={idx}
                    tags={allTags?.[currencyKey]}
                    currencyKey={currencyKey}
                    defaultColor={defaultColors[idx]}
                    setState={updateSellState}
                    disabled={true}
                    value={sellState?.[currencyKey] || 0}
                  />
                ))}
              </Row>
              <Row className='pb-2'>
                <Col className='p-1'>
                  <Form.Label>Item seller</Form.Label>
                  <ItemOwnerSelect setState={setSellerId} group={currentGroup} state={sellerId} />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer className='pt-0 border-0 background-light'>
            {errorMessage && (
              <Alert variant='warning' className='w-100'>
                {errorMessage}
              </Alert>
            )}
            <Button
              data-cy='confirm-sell-item'
              className='mt-3 p-2 px-3 background-success border-0 text-light'
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
