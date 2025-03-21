import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Row, Col, Alert, FormLabel } from 'react-bootstrap';
import { GroupContext } from '../../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../../utils/contexts/GlobalFeatures';
import { createLootItem, updateLootItem } from '../../../../controllers/lootController';
import ItemOwnerSelect from '../../../common/ItemOwnerSelect';
import ItemValueInput from './ItemValueInput';
import ContainerSelect from '../../../common/ContainerSelect';
import RaritySelect from '../../../common/RaritySelect';
import QuillInput from '../../../common/QuillInput';

export default function CreateLootItem({ item = '' }) {
  const { currentGroup, allTags, itemOwners } = useContext(GroupContext);
  const { currentUser } = useContext(AuthContext);
  const { writeHistoryEvent, currencyKeys, defaultColors } = useContext(GlobalFeatures);

  const [formState, setFormState] = useState({
    show: false,
    loading: false,
    validation: '',
    itemData: {
      itemName: '',
      itemQty: '',
      currCharges: '',
      maxCharges: '',
      itemTags: '',
      rarity: '',
      container: '',
      ownerId: 'party',
      value: {},
      itemDesc: ''
    }
  });

  const handleClose = () => {
    setFormState(prev => ({ ...prev, validation: '', show: false }));
  };

  const handleShow = () => {
    setFormState(prev => ({
      ...prev,
      show: true,
      itemData: {
        ...(item || {
          itemName: '',
          itemQty: '',
          currCharges: '',
          maxCharges: '',
          itemTags: '',
          rarity: '',
          container: '',
          ownerId: item?.ownerId || 'party',
          value: item?.value || {},
          itemDesc: item?.itemDesc || ''
        }),
      }
    }));
  };

  const updateValue = (currencyKey, value) => {
    setFormState(prev => ({
      ...prev,
      itemData: {
        ...prev.itemData,
        value: {
          ...prev.itemData.value,
          [currencyKey]: parseInt(value)
        }
      }
    }));
  };

  const checkItemValidations = () => {
    if (!formState.itemData.itemName?.trim()) {
      setFormState(prev => ({ ...prev, validation: 'Item name is required!' }));
      return false;
    }
    setFormState(prev => ({ ...prev, validation: '' }));
    return true;
  };

  const addLoot = async () => {
    if (!checkItemValidations()) return;
    setFormState(prev => ({ ...prev, loading: true }));

    const historyData = {
      itemName: formState.itemData.itemName,
      owner: formState.itemData.ownerId === 'party' ? 'the party' : itemOwners.find((owner) => owner.id === formState.itemData.ownerId).name,
    };

    try {
      await createLootItem(formState.itemData, currentGroup);
      await writeHistoryEvent(currentUser.uid, 'createItem', historyData);
      handleClose();
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const editLoot = async () => {
    if (!checkItemValidations()) return;
    setFormState(prev => ({ ...prev, loading: true }));
  
    try {
      console.log(item.id)
      await updateLootItem(formState.itemData, currentGroup, item.id);
      handleClose();
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateItemData = (field, value) => {
    setFormState(prev => ({
      ...prev,
      itemData: {
        ...prev.itemData,
        [field]: value
      }
    }));
  };

  return (
    <>
      <Button
        data-cy={item ? 'edit-item' : 'add-item'}
        variant='dark'
        className={`p-2 m-0 background-dark border-0 ${item ? 'w-100' : 'w-100 fg-3'}`}
        onClick={handleShow}
      >
        {item ? (
          <img alt='Edit Item' src='APPIcons/pencil-square.svg' />
        ) : (
          'Add Item'
        )}
      </Button>

      <Modal show={formState.show} onHide={handleClose}>
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
                      onChange={(e) => updateItemData('itemName', e.target.value)}
                      value={formState.itemData.itemName}
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
                      onChange={(e) => updateItemData('itemQty', parseInt(e.target.value) || '')}
                      value={formState.itemData.itemQty}
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
                      onChange={(e) => updateItemData('currCharges', parseInt(e.target.value) || '')}
                      value={formState.itemData.currCharges}
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
                      onChange={(e) => updateItemData('maxCharges', parseInt(e.target.value) || '')}
                      value={formState.itemData.maxCharges}
                      type='text'
                      placeholder='Charges'
                      maxLength='3'
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Form.Group controlId='itemDesc'>
                  <QuillInput 
                    itemDesc={formState.itemData.itemDesc} 
                    setItemDesc={(value) => updateItemData('itemDesc', value)} 
                  />
                </Form.Group>
              </Row>

              <Row className='mb-2'>
                <Form.Group controlId='itemTags'>
                  <Form.Control
                    data-cy='item-tags'
                    onChange={(e) => updateItemData('itemTags', e.target.value)}
                    type='text'
                    value={formState.itemData.itemTags}
                    placeholder='Enter searchable item tags here'
                  />
                </Form.Group>
              </Row>

              <Row>
                <Col className='pe-0'>
                  <Form.Group controlId='itemOwner'>
                    <Col className='p-2 pt-0 border rounded'>
                      <FormLabel className='m-0 mt-1'>Owner</FormLabel>
                      <ItemOwnerSelect 
                        setState={(value) => updateItemData('ownerId', value)} 
                        group={currentGroup} 
                        state={formState.itemData.ownerId} 
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId='rarity'>
                    <Col className='p-2 pt-0 border rounded'>
                      <FormLabel className='m-0 mt-1'>Rarity</FormLabel>
                      <RaritySelect 
                        setItemData={(value) => updateItemData('rarity', value)} 
                        itemData={formState.itemData} 
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col className='ps-0'>
                  <Form.Group controlId='container'>
                    <Col className='p-2 pt-0 border rounded'>
                      <FormLabel className='m-0 mt-1'>Container</FormLabel>
                      <ContainerSelect 
                        setItemData={(value) => updateItemData('container', value)} 
                        itemData={formState.itemData} 
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='mt-2'>{formState.validation && <Alert variant='warning'>{formState.validation}</Alert>}</Col>
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
                    setState={updateValue}
                    disabled={true}
                    value={formState.itemData.value?.[currencyKey]}
                  />
                ))}
              </Row>
            </Modal.Body>

            <Modal.Footer className='justify-content-end'>
              <Button
                data-cy={item ? 'save-item' : 'create-item'}
                disabled={formState.loading}
                className='background-dark border-0'
                variant='dark'
                type='button'
                onClick={item ? editLoot : addLoot}
              >
                {item ? 'Save' : 'Create'}
              </Button>
            </Modal.Footer>
          </div>
        </Form>
      </Modal>
    </>
  );
}
