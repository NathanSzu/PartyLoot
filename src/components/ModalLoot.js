import React, { useState, useContext, useRef } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';
import fb from 'firebase';
import DropdownAddItem from './DropdownAddItem';
import SearchOpen5E from './SearchOpen5E';

export default function ModalLoot({ item }) {
  const { currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`);
  const groupRef = db.collection('groups').doc(currentGroup);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchSRD, setSearchSRD] = useState(false);
  const [SRDContent, setSRDContent] = useState({});
  const [itemValidations, setItemValidations] = useState('');

  const [partyData] = useDocumentData(groupRef);

  const nameRef = useRef();
  const descRef = useRef();
  const chargeRef = useRef();
  const chargesRef = useRef();
  const tagsRef = useRef();
  const ownerRef = useRef();
  const qtyRef = useRef();

  const handleClose = () => {
    setItemValidations('');
    setShow(false);
    setSRDContent({});
    setSearchSRD(false);
  };

  const handleShow = () => setShow(true);

  const checkItemValidations = () => {
    if (!nameRef.current.value || !descRef.current.value) {
      setItemValidations('Item name and description are required!');
      return;
    };
    if (!/^\d+$/.test(qtyRef.current.value) && qtyRef.current.value !== '') {
      setItemValidations('Item quantity must be a positive number!');
      return false;
    };
    setItemValidations('');
    return true;
  };

  const addLoot = () => {
    if (!checkItemValidations()) return;
    setLoading(true);
    groupRef
      .collection('loot')
      .add({
        itemName: nameRef.current.value,
        itemQty: qtyRef.current.value,
        itemDesc: descRef.current.value,
        currCharges: chargeRef.current.value,
        maxCharges: chargesRef.current.value,
        itemTags: tagsRef.current.value,
        owner: ownerRef.current.value === 'Select owner' ? '' : ownerRef.current.value,
        created: fb.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        handleClose();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating new group: ', error);
        setLoading(false);
        handleClose();
      });
  };

  const editLoot = () => {
    if (!checkItemValidations()) return;
    setLoading(true);
    itemRef
      .update({
        itemName: nameRef.current.value,
        itemQty: qtyRef.current.value,
        itemDesc: descRef.current.value,
        currCharges: chargeRef.current.value,
        maxCharges: chargesRef.current.value,
        itemTags: tagsRef.current.value,
        owner: ownerRef.current.value === 'Select owner' ? '' : ownerRef.current.value,
      })
      .then(() => {
        handleClose();
        setLoading(false);
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error('Error updating item: ', error);
        handleClose();
        setLoading(false);
      });
  };

  return (
    <div>
      {item ? (
        <Button variant='dark' className='p-2 m-0 background-dark border-0' onClick={handleShow}>
          <img alt='Edit Item' src='APPIcons/pencil-square.svg' />
        </Button>
      ) : (
        <Button variant='dark' onClick={handleShow} className='w-100 m-0 mr-auto ml-auto background-dark border-0'>
          Add Item
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
        <Form className='texture-backer rounded'>
          <Modal.Header closeButton>
            {item ? <Modal.Title>{`Edit ${item.itemName}`}</Modal.Title> : <Modal.Title>Add an item!</Modal.Title>}
          </Modal.Header>

          {searchSRD ? (
            <SearchOpen5E setSearchSRD={setSearchSRD} setSRDContent={setSRDContent} />
          ) : (
            <div>
              <Modal.Body>
                <Row>
                  {!item && (
                    <Col xs={2} className='pr-0'>
                      <DropdownAddItem setSearchSRD={setSearchSRD} />
                    </Col>
                  )}
                  <Col>
                    <Form.Group controlId='itemName'>
                      <Form.Control
                        ref={nameRef}
                        defaultValue={(item && item.itemName) || SRDContent.name}
                        type='text'
                        placeholder='Item name'
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={3} className='pl-0'>
                    <Form.Group controlId='itemQty'>
                      <Form.Control
                        className='text-center'
                        ref={qtyRef}
                        defaultValue={item && item.itemQty}
                        type='text'
                        placeholder='Qty'
                        maxLength='3'
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={5}>
                    <Form.Group controlId='itemCharge'>
                      <Form.Control
                        className='text-center'
                        ref={chargeRef}
                        defaultValue={item && item.currCharges}
                        type='text'
                        placeholder='Charge'
                        maxLength='3'
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={2} className='d-flex align-items-center justify-content-center'>
                    /
                  </Col>

                  <Col xs={5}>
                    <Form.Group controlId='itemCharges'>
                      <Form.Control
                        className='text-center'
                        ref={chargesRef}
                        defaultValue={item && item.maxCharges}
                        type='text'
                        placeholder='Charges'
                        maxLength='3'
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId='itemDesc'>
                  <Form.Control
                    ref={descRef}
                    as='textarea'
                    rows={4}
                    defaultValue={(item && item.itemDesc) || SRDContent.desc}
                    placeholder='Item description'
                  />
                </Form.Group>

                <Form.Group controlId='itemTags'>
                  <Form.Control
                    ref={tagsRef}
                    type='text'
                    defaultValue={(item && item.itemTags) || SRDContent.type}
                    placeholder='Enter searchable item tags here'
                  />
                </Form.Group>

                <Form.Group controlId='itemOwner'>
                  <Form.Control as='select' defaultValue={item && item.owner} ref={ownerRef}>
                    <option>Select owner</option>
                    {partyData &&
                      partyData.party &&
                      partyData.party.map((partyMember, idx) => <option key={idx}>{partyMember}</option>)}
                  </Form.Control>
                </Form.Group>
                {itemValidations && <Alert variant='warning'>{itemValidations}</Alert>}
              </Modal.Body>

              <Modal.Footer className='justify-content-end'>
                {item ? (
                  <Button
                    as='input'
                    disabled={loading}
                    className='background-dark border-0'
                    value='Save'
                    variant='dark'
                    type='submit'
                    onClick={(e) => {
                      e.preventDefault();
                      editLoot();
                    }}
                  />
                ) : (
                  <Button
                    disabled={loading}
                    className='background-dark border-0'
                    variant='dark'
                    type='submit'
                    onClick={(e) => {
                      e.preventDefault();
                      addLoot();
                    }}
                  >
                    Create
                  </Button>
                )}
              </Modal.Footer>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
