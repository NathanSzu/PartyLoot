import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import fb from 'firebase';
import DropdownAddItem from './DropdownAddItem';
import SearchOpen5E from './SearchOpen5E';
import ItemOwnerSelect from '../../common/ItemOwnerSelect';
import QuillInput from '../../common/QuillInput';

export default function ModalLoot({ item = '' }) {
  const { groupDoc } = useContext(GroupContext);
  const { currentUser } = useContext(AuthContext);
  const { writeHistoryEvent } = useContext(GlobalFeatures);

  const itemRef = groupDoc.collection('loot').doc(item.id);
  const itemOwnersRef = groupDoc.collection('itemOwners');

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchSRD, setSearchSRD] = useState(false);
  const [SRDContent, setSRDContent] = useState({});
  const [itemValidations, setItemValidations] = useState('');
  const [itemOwner, setItemOwner] = useState('party');
  const [quillValue, setQuillValue] = useState(item?.itemDesc || '');

  const [itemOwners] = useCollectionData(itemOwnersRef.orderBy('name'), { idField: 'id' });

  const nameRef = useRef();
  const chargeRef = useRef();
  const chargesRef = useRef();
  const tagsRef = useRef();
  const qtyRef = useRef();

  const handleClose = () => {
    setItemValidations('');
    setShow(false);
    setSRDContent({});
    setSearchSRD(false);
  };

  const handleShow = () => {
    item && setItemOwner(item.ownerId);
    setQuillValue(item?.itemDesc || '');
    setShow(true);
  };

  const checkItemValidations = () => {
    if (!nameRef.current.value.trim()) {
      setItemValidations('Item name is required!');
      return false;
    }
    if (!/^\d+$/.test(qtyRef.current.value) && qtyRef.current.value !== '') {
      setItemValidations('Item quantity must be a positive number!');
      return false;
    }
    if (!/^\d+$/.test(chargeRef.current.value) && chargeRef.current.value !== '') {
      setItemValidations('Item charge values must be a positive number!');
      return false;
    }
    if (!/^\d+$/.test(chargesRef.current.value) && chargesRef.current.value !== '') {
      setItemValidations('Item charge values must be a positive number!');
      return false;
    }
    setItemValidations('');
    return true;
  };

  const addLoot = () => {
    if (!checkItemValidations()) return;
    setLoading(true);

    let historyData = {
      itemName: nameRef.current.value,
      owner: itemOwner === 'party' ? 'the party' : itemOwners.find((owner) => owner.id === itemOwner).name,
    };

    groupDoc
      .collection('loot')
      .add({
        itemName: nameRef.current.value,
        itemQty: qtyRef.current.value,
        itemDesc: quillValue,
        currCharges: chargeRef.current.value,
        maxCharges: chargesRef.current.value,
        itemTags: tagsRef.current.value,
        ownerId: itemOwner,
        created: fb.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        writeHistoryEvent(currentUser.uid, 'createItem', historyData).then(() => {
          handleClose();
          setLoading(false);
        });
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
        itemDesc: quillValue,
        currCharges: chargeRef.current.value,
        maxCharges: chargesRef.current.value,
        itemTags: tagsRef.current.value,
        ownerId: itemOwner || 'party',
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

  useEffect(() => {
    setQuillValue(item?.itemDesc || '');
  }, [item]);

  return (
    <>
      {item ? (
        <Button
          data-cy='edit-item'
          variant='dark'
          className='p-2 m-0 background-dark border-0 w-100'
          onClick={handleShow}
        >
          <img alt='Edit Item' src='APPIcons/pencil-square.svg' />
        </Button>
      ) : (
        <Button
          data-cy='add-item'
          variant='dark'
          onClick={handleShow}
          className='m-0 w-100 background-dark border-0 fg-3'
        >
          Add Item
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
        <Form className='rounded' onSubmitCapture={(e) => e.preventDefault()}>
          <Modal.Header closeButton>
            {item ? <Modal.Title>{`Edit ${item.itemName}`}</Modal.Title> : <Modal.Title>Add an item!</Modal.Title>}
          </Modal.Header>

          {searchSRD ? (
            <SearchOpen5E setSearchSRD={setSearchSRD} setSRDContent={setSRDContent} />
          ) : (
            <div>
              <Modal.Body>
                <Row className='mb-2'>
                  {!item && (
                    <Col xs={2} className='pr-0'>
                      <DropdownAddItem setSearchSRD={setSearchSRD} />
                    </Col>
                  )}
                  <Col>
                    <Form.Group controlId='itemName'>
                      <Form.Control
                        data-cy='item-name'
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
                        data-cy='item-qty'
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

                <Row className='mb-2'>
                  <Col xs={5}>
                    <Form.Group controlId='itemCharge'>
                      <Form.Control
                        data-cy='charge'
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
                        data-cy='charge-max'
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

                <Row className='mb-2'>
                  <Form.Group controlId='itemDesc'>
                    <QuillInput
                      defaultValue={SRDContent?.desc}
                      value={quillValue}
                      setValue={setQuillValue}
                      placeholder='Item description'
                    />
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group controlId='itemTags'>
                    <Form.Control
                      data-cy='item-tags'
                      ref={tagsRef}
                      type='text'
                      defaultValue={(item && item.itemTags) || SRDContent.type}
                      placeholder='Enter searchable item tags here'
                    />
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group controlId='itemOwner'>
                    <ItemOwnerSelect itemOwners={itemOwners} setState={setItemOwner} value={itemOwner} />
                  </Form.Group>
                  <Col className='mt-2'>{itemValidations && <Alert variant='warning'>{itemValidations}</Alert>}</Col>
                </Row>
              </Modal.Body>

              <Modal.Footer className='justify-content-end'>
                {item ? (
                  <Button
                    data-cy='save-item'
                    disabled={loading}
                    className='background-dark border-0'
                    variant='dark'
                    type='button'
                    onClick={() => editLoot()}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    data-cy='create-item'
                    disabled={loading}
                    className='background-dark border-0'
                    variant='dark'
                    type='button'
                    onClick={() => addLoot()}
                  >
                    Create
                  </Button>
                )}
              </Modal.Footer>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
}
