import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import CampaignSettingSelect from './CampaignSettingSelect';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import CategorySelect from './CategorySelect';
import fb from 'firebase';
import QuillInput from '../../common/QuillInput';
import RaritySelect from '../../common/RaritySelect';

export function DiscoveryFields({ discoveryRecord, setDiscoveryRecord, itemValidations, item }) {
  const { itemMetadata } = useContext(GlobalFeatures);

  const [discoveryCategories, setDiscoveryCategories] = useState([]);
  const [discoveryDescription, setDiscoveryDescription] = useState('');

  useEffect(() => {
    setDiscoveryRecord({ ...discoveryRecord, itemDesc: discoveryDescription });
  }, [discoveryDescription]);

  useEffect(() => {
    setDiscoveryRecord({ ...discoveryRecord, categories: discoveryCategories });
  }, [discoveryCategories]);

  useEffect(() => {
    item &&
      setDiscoveryRecord({
        setting: item.setting,
        itemName: item.itemName,
        maxCharges: item.maxCharges,
        categories: item.categories,
        itemDesc: item.itemDesc || '',
        rarity: item.rarity || ''
      });
    item && setDiscoveryCategories(item.categories);
  }, [item]);

  const nameRef = useRef();
  const chargeRef = useRef();

  return (
    <>
      <Row className='mb-2'>
        <Col>
          <Form.Group controlId='discoveryName'>
            <Form.Control
              ref={nameRef}
              onChange={() => setDiscoveryRecord({ ...discoveryRecord, itemName: nameRef.current.value })}
              type='text'
              placeholder='Item name'
              defaultValue={item && item.itemName}
              data-cy='new-discovery-name'
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className='mb-2'>
        <Col className='pe-0'>
          <Form.Group controlId='discoveryCharges'>
            <Form.Control
              ref={chargeRef}
              onChange={() => setDiscoveryRecord({ ...discoveryRecord, maxCharges: chargeRef.current.value })}
              type='text'
              placeholder='Charges'
              defaultValue={item && item.maxCharges}
              data-cy='new-discovery-charges'
              maxLength='3'
            />
          </Form.Group>
        </Col>
        <Col className='pe-0'>
          <Form.Group controlId='discoverySetting'>
            <CampaignSettingSelect metadata={itemMetadata} setState={setDiscoveryRecord} state={discoveryRecord} />
          </Form.Group>
        </Col>
        <Col>
          <RaritySelect itemData={discoveryRecord} setItemData={setDiscoveryRecord} />
        </Col>
      </Row>
      <Row className='mb-2'>
        <Form.Group>
          <QuillInput
            itemDesc={discoveryDescription || discoveryRecord.itemDesc}
            setItemDesc={setDiscoveryDescription}
            placeholder='Please include a detailed description'
          />
        </Form.Group>
      </Row>
      <CategorySelect
        metadata={itemMetadata?.categories}
        categories={item?.categories}
        setState={setDiscoveryCategories}
      />
      <Row>
        <Col>
          <Alert variant='info'>
            <Form.Check
              data-cy='discovery-acknowledgement'
              onChange={() =>
                setDiscoveryRecord({ ...discoveryRecord, acknowledgement: !discoveryRecord.acknowledgement })
              }
              label='By checking this box you acknowledge that
                any profane or offensive language is grounds for deletion of this post and removal of community features from your account.'
            />
          </Alert>
        </Col>
      </Row>
      {itemValidations && (
        <Row>
          <Col>
            <Alert className='mb-2' variant='warning'>
              {itemValidations}
            </Alert>
          </Col>
        </Row>
      )}
    </>
  );
}

export function AddDiscovery({ getCompendium }) {
  const { currentUser, db } = useContext(AuthContext);
  const { setToastHeader, setToastContent, toggleShowToast } = useContext(GlobalFeatures);

  const [show, setShow] = useState(false);
  const [itemValidations, setItemValidations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discoveryRecord, setDiscoveryRecord] = useState({
    setting: '',
    itemName: '',
    maxCharges: '',
    categories: [],
    likeCount: 0,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setDiscoveryRecord({
      setting: '',
      itemName: '',
      maxCharges: '',
      categories: [],
      likeCount: 0,
    });
    setShow(true);
  };

  const checkItemValidations = () => {
    if (!discoveryRecord.itemName.trim()) {
      setItemValidations('Item name is required!');
      return false;
    }
    if (!discoveryRecord.setting) {
      setItemValidations('Campaign setting is required!');
      return false;
    }
    if (!/^\d+$/.test(discoveryRecord.maxCharges) && discoveryRecord.maxCharges) {
      setItemValidations('Item charge values must be a positive number!');
      return false;
    }
    if (discoveryRecord.categories.length < 1) {
      setItemValidations('Choose at least one category!');
      return false;
    }
    if (!discoveryRecord.acknowledgement) {
      setItemValidations('Please review the acknowledgement!');
      return false;
    }
    setItemValidations('');
    return true;
  };

  const addDiscovery = (publish = false) => {
    if (!checkItemValidations()) return;
    setLoading(true);
    db.collection('compendium')
      .add({
        ...discoveryRecord,
        itemNameLower: discoveryRecord.itemName.toLowerCase(),
        itemStatus: publish ? 'published' : 'draft',
        creatorId: currentUser.uid,
        created: fb.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setLoading(false);
        handleClose();
        getCompendium();
        setToastHeader('Item recorded');
        setToastContent(`You have successfully recorded your item "${discoveryRecord.itemName}" in the compendium.`);
        toggleShowToast();
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error writing to compendium collection', err);
        handleClose();
      });
  };

  return (
    <>
      <Button variant='dark' onClick={handleShow} className='m-2 background-dark' data-cy='add-discovery'>
        +
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Form className='rounded' onSubmitCapture={(e) => e.preventDefault()}>
          <Modal.Header closeButton>
            <Modal.Title>Record a discovery</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <DiscoveryFields
              discoveryRecord={discoveryRecord}
              itemValidations={itemValidations}
              setDiscoveryRecord={setDiscoveryRecord}
            />
          </Modal.Body>

          <Modal.Footer>
            <Col>
              <Button
                disabled={loading}
                data-cy='add-entry'
                className='background-success w-100'
                variant='success'
                type='button'
                onClick={() => addDiscovery(true)}
              >
                Publish
              </Button>
            </Col>
            <Col>
              <Button
                disabled={loading}
                data-cy='save-draft'
                className='w-100'
                variant='warning'
                type='button'
                onClick={() => addDiscovery()}
              >
                Save draft
              </Button>
            </Col>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export function EditDiscoveryTrigger({ setShow }) {
  return (
    <Row>
      <Col className='text-center p-3'>
        <Alert className='m-0'>
          <p className='mb-0'>You reported this discovery!</p>
          <Button variant='link' data-cy='edit-compendium-entry' onClick={() => setShow(true)}>
            <strong>Click here to make changes!</strong>
          </Button>
        </Alert>
      </Col>
    </Row>
  );
}

export function EditDiscoverySection({ item, getCompendium }) {
  const { db } = useContext(AuthContext);
  const { setToastHeader, setToastContent, toggleShowToast } = useContext(GlobalFeatures);

  const [itemValidations, setItemValidations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [discoveryRecord, setDiscoveryRecord] = useState({
    setting: '',
    itemName: '',
    maxCharges: '',
    categories: [],
    likeCount: 0,
  });

  const checkItemValidations = () => {
    if (!discoveryRecord.itemName.trim()) {
      setItemValidations('Item name is required!');
      return false;
    }
    if (!discoveryRecord.setting) {
      setItemValidations('Campaign setting is required!');
      return false;
    }
    if (!/^\d+$/.test(discoveryRecord.maxCharges) && discoveryRecord.maxCharges) {
      setItemValidations('Item charge values must be a positive number!');
      return false;
    }
    if (discoveryRecord.categories.length < 1) {
      setItemValidations('Choose at least one category!');
      return false;
    }
    if (!discoveryRecord.acknowledgement) {
      setItemValidations('Please review the acknowledgement!');
      return false;
    }
    setItemValidations('');
    return true;
  };

  const editDiscovery = (publish = false) => {
    if (!checkItemValidations()) return;
    setLoading(true);
    db.collection('compendium')
      .doc(item.id)
      .set(
        {
          ...discoveryRecord,
          itemNameLower: discoveryRecord.itemName.toLowerCase(),
          itemStatus: publish ? 'published' : 'draft',
          lastUpdate: fb.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .then(() => {
        getCompendium();
        setToastHeader('Item changes recorded');
        setToastContent(
          `Changes to your item "${discoveryRecord.itemName}" have been recorded and it has been ${
            publish ? 'published to the compendium' : 'saved as a draft'
          }.`
        );
        toggleShowToast();
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error saving changes', err);
      });
  };

  const deleteEntry = () => {
    if (!confirmDelete) return;
    setLoading(true);
    db.collection('compendium')
      .doc(item.id)
      .delete()
      .then(() => {
        getCompendium();
        setToastHeader('Item deleted');
        setToastContent(`Your item "${discoveryRecord.itemName}" has been successfully deleted.`);
        toggleShowToast();
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error deleting entry', err);
      });
  };

  return (
    <>
      <DiscoveryFields
        discoveryRecord={discoveryRecord}
        itemValidations={itemValidations}
        setDiscoveryRecord={setDiscoveryRecord}
        item={item}
      />
      <Row className='pt-2'>
        <Col>
          <Button
            disabled={loading}
            className='w-100 background-success'
            variant='success'
            type='button'
            onClick={() => editDiscovery(true)}
          >
            Publish
          </Button>
        </Col>
        <Col>
          <Button disabled={loading} className='w-100' variant='warning' type='button' onClick={() => editDiscovery()}>
            Save draft
          </Button>
        </Col>
        <Col>
          {confirmDelete ? (
            <Button
              disabled={loading}
              data-cy='confirm-delete-entry'
              className='w-100 background-danger'
              variant='danger'
              type='button'
              onClick={() => deleteEntry()}
            >
              Confirm
            </Button>
          ) : (
            <Button
              disabled={loading}
              data-cy='delete-entry'
              className='w-100 background-danger'
              variant='danger'
              type='button'
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}
