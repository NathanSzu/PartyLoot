import React, { useState, useContext, useRef } from 'react';
import { Modal, Button, Form, Badge, Row, Col } from 'react-bootstrap';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function ModalLoot({ item }) {
  const { currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`);
  const groupRef = db.collection('groups').doc(currentGroup);
  const colorTagRef = db.collection('groups').doc(currentGroup).collection('currency').doc('colorTags');

  const [partyData] = useDocumentData(groupRef);
  const [colorTags] = useDocumentData(colorTagRef);

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

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const sellItem = () => {
    console.log('Qty: ', qtyRef.current.value);
    console.log('Seller: ', sellerRef.current.value);

    // setLoading(true);
    // handleClose();
    // itemRef
    //   .delete()
    //   .then(() => {
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     console.error('Error removing item: ', error);
    //   });
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
              {item.itemQty > 1 ? (
                <Col>
                  <Form.Group controlId='itemQty'>
                    <Form.Control type='number' ref={qtyRef} placeholder='Qty' />
                  </Form.Group>
                </Col>
              ) : null}
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
              <Col>
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
              <Col>
                <Form.Group controlId='itemPrice2'>
                  <Form.Control type='number' ref={currency2Ref} placeholder='Price' />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={2} className='pr-0'>
                <Form.Control
                  type='color'
                  value={(colorTags && colorTags.currency3) || '#d27e1e'}
                  disabled='true'
                  className='p-0 border-0 background-unset'
                />
              </Col>
              <Col>
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
              <Col>
                <Form.Group controlId='itemPrice4'>
                  <Form.Control type='number' ref={currency4Ref} placeholder='Price' />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={2} className='pr-0'>
                <Form.Control
                  type='color'
                  value={(colorTags && colorTags.currency5) || '#ffffff'}
                  disabled='true'
                  className='p-0 border-0 background-unset'
                />
              </Col>
              <Col>
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
              <Col>
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
