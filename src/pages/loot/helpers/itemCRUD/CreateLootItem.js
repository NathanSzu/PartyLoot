import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Row, Col, Alert, FormLabel } from 'react-bootstrap';
import { GroupContext } from '../../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../../utils/contexts/GlobalFeatures';
import fb from 'firebase';
import ItemOwnerSelect from '../../../common/ItemOwnerSelect';
import ItemValueInput from './ItemValueInput';
import ContainerSelect from '../../../common/ContainerSelect';
import RaritySelect from '../../../common/RaritySelect';
import QuillInput from '../../../common/QuillInput';

export default function CreateLootItem({ item = '' }) {
  const { groupDoc, currentGroup, allTags, itemOwners } = useContext(GroupContext);
  const { currentUser } = useContext(AuthContext);
  const { writeHistoryEvent, currencyKeys, defaultColors } = useContext(GlobalFeatures);

  const itemRef = groupDoc.collection('loot').doc(item.id);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemValidations, setItemValidations] = useState('');
  const [itemOwner, setItemOwner] = useState('party');
  const [valueState, setValueState] = useState({});
  const [itemDesc, setItemDesc] = useState();

  const [itemData, setItemData] = useState();

  const handleClose = () => {
    setItemValidations('');
    setShow(false);
  };

  const handleShow = () => {
    if (item) {
      setItemOwner(item.ownerId);
    } else {
      setItemOwner('party');
    }
    setItemData(item);
    setItemDesc(item?.itemDesc || '');
    setShow(true);
    setValueState(item?.value || {});
  };

  const updateValueState = (currencyKey, value) => {
    setValueState({
      ...valueState,
      [currencyKey]: parseInt(value),
    });
  };

  const checkItemValidations = () => {
    if (!itemData?.itemName?.trim()) {
      setItemValidations('Item name is required!');
      return false;
    }
    setItemValidations('');
    return true;
  };

  const addLoot = () => {
    if (!checkItemValidations()) return;
    setLoading(true);

    const dataToWrite = {
      ...itemData,
      ownerId: itemOwner || 'party',
      value: valueState,
      itemDesc,
      created: fb.firestore.FieldValue.serverTimestamp(),
    };

    const historyData = {
      itemName: itemData?.itemName,
      owner: itemOwner === 'party' ? 'the party' : itemOwners.find((owner) => owner.id === itemOwner).name,
    };

    groupDoc
      .collection('loot')
      .add(dataToWrite)
      .then(() => {
        writeHistoryEvent(currentUser.uid, 'createItem', historyData).then(() => {
          handleClose();
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error('Error creating new item: ', error);
        setLoading(false);
        handleClose();
      });
  };

  const editLoot = () => {
    if (!checkItemValidations()) return;
    setLoading(true);
    const dataToWrite = {
      ...itemData,
      ownerId: itemOwner || 'party',
      value: valueState,
      itemDesc,
      updated: fb.firestore.FieldValue.serverTimestamp(),
    };
    itemRef
      .update(dataToWrite)
      .then(() => {
        handleClose();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error updating item: ', error);
        handleClose();
        setLoading(false);
      });
  };

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
            {item ? <Modal.Title>{`Edit ${item.itemName}`}</Modal.Title> : <Modal.Title>Create new item</Modal.Title>}
          </Modal.Header>

            <div>
              <Modal.Body>
                <Row className='mb-2'>
                  <Col>
                    <Form.Group controlId='itemName'>
                      <Form.Control
                        data-cy='item-name'
                        onChange={(e) => setItemData({ ...itemData, itemName: e.target.value })}
                        value={itemData?.itemName}
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
                        onChange={(e) => setItemData({ ...itemData, itemQty: parseInt(e.target.value) || '' })}
                        value={itemData?.itemQty}
                        type='text'
                        placeholder='Qty'
                        maxLength='3'
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className='mb-2'>
                  <Col>
                    <Form.Group controlId='itemCharge'>
                      <Form.Control
                        data-cy='charge'
                        className='text-center'
                        onChange={(e) => setItemData({ ...itemData, currCharges: parseInt(e.target.value) || '' })}
                        value={itemData?.currCharges}
                        type='text'
                        placeholder='Charge'
                        maxLength='3'
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={1} className='d-flex align-items-center justify-content-center'>
                    /
                  </Col>

                  <Col>
                    <Form.Group controlId='itemCharges'>
                      <Form.Control
                        data-cy='charge-max'
                        className='text-center'
                        onChange={(e) => setItemData({ ...itemData, maxCharges: parseInt(e.target.value) || '' })}
                        value={itemData?.maxCharges}
                        type='text'
                        placeholder='Charges'
                        maxLength='3'
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Form.Group controlId='itemDesc'>
                    <QuillInput itemDesc={itemDesc} setItemDesc={setItemDesc} />
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group controlId='itemTags'>
                    <Form.Control
                      data-cy='item-tags'
                      onChange={(e) => setItemData({ ...itemData, itemTags: e.target.value })}
                      type='text'
                      value={itemData?.itemTags}
                      placeholder='Enter searchable item tags here'
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Col className='pe-0'>
                    <Form.Group controlId='itemOwner'>
                      <Col className='p-2 pt-0 border rounded'>
                        <FormLabel className='m-0 mt-1'>Owner</FormLabel>
                        <ItemOwnerSelect setState={setItemOwner} group={currentGroup} state={itemOwner} />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId='rarity'>
                      <Col className='p-2 pt-0 border rounded'>
                        <FormLabel className='m-0 mt-1'>Rarity</FormLabel>
                        <RaritySelect setItemData={setItemData} itemData={itemData} />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col className='ps-0'>
                    <Form.Group controlId='container'>
                      <Col className='p-2 pt-0 border rounded'>
                        <FormLabel className='m-0 mt-1'>Container</FormLabel>
                        <ContainerSelect setItemData={setItemData} itemData={itemData} />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className='mt-2'>{itemValidations && <Alert variant='warning'>{itemValidations}</Alert>}</Col>
                </Row>

                <Row className='mx-1'>
                  <h5 className='py-2 m-0 text-center border rounded-top'>Item value</h5>
                </Row>
                <Row className='p-2 mx-1 background-light rounded-bottom'>
                  {currencyKeys.map((currencyKey, idx) => (
                    <ItemValueInput
                      key={idx}
                      tags={allTags?.[currencyKey]}
                      currencyKey={currencyKey}
                      defaultColor={defaultColors[idx]}
                      setState={updateValueState}
                      disabled={true}
                      value={valueState?.[currencyKey]}
                    />
                  ))}
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
        </Form>
      </Modal>
    </>
  );
}
