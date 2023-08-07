import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import CampaignSettingSelect from './CampaignSettingSelect';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import QuillInput from '../../common/QuillInput';
import CategorySelect from './CategorySelect';
import fb from 'firebase';

export default function AddGroup() {
  const { currentUser, db } = useContext(AuthContext);
  const { itemMetadata } = useContext(GlobalFeatures);

  const [show, setShow] = useState(false);
  const [itemValidations, setItemValidations] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setDiscoveryDescription('');
    setDiscoveryRecord({
      setting: '',
      itemName: '',
      maxCharges: '',
      categories: [],
      likeCount: 1,
    });
    setShow(true);
  };
  const [loading, setLoading] = useState(false);
  const [discoveryDescription, setDiscoveryDescription] = useState('');
  const [discoveryCategories, setDiscoveryCategories] = useState([]);
  const [discoveryRecord, setDiscoveryRecord] = useState({
    setting: '',
    itemName: '',
    maxCharges: '',
    categories: [],
    likeCount: 1,
  });

  const nameRef = useRef();
  const chargeRef = useRef();

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

  const addDiscovery = (e) => {
    e.preventDefault();
    if (!checkItemValidations()) return;
    setLoading(true);
    db.collection('compendium')
      .add({
        ...discoveryRecord,
        creatorId: currentUser.uid,
        created: fb.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        db.collection('compendium')
          .doc(doc.id)
          .collection('likes')
          .doc(currentUser.uid)
          .set({
            timestamp: fb.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            setLoading(false);
            handleClose();
          })
          .catch((err) => {
            setLoading(false);
            console.error('Error writing to like collection', err);
            handleClose();
          });
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error writing to compendium collection', err);
        handleClose();
      });
  };

  useEffect(() => {
    console.log(discoveryRecord);
  }, [discoveryRecord]);

  useEffect(() => {
    setDiscoveryRecord({ ...discoveryRecord, itemDesc: discoveryDescription });
  }, [discoveryDescription]);

  useEffect(() => {
    setDiscoveryRecord({ ...discoveryRecord, categories: discoveryCategories });
  }, [discoveryCategories]);

  return (
    <>
      <Button variant='dark' onClick={handleShow} className='m-2 background-dark' data-cy='create-group'>
        +
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Form className='rounded'>
          <Modal.Header closeButton>
            <Modal.Title>Record a discovery</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row className='mb-2'>
              <Col>
                <Form.Group controlId='discoveryName'>
                  <Form.Control
                    ref={nameRef}
                    onChange={() => setDiscoveryRecord({ ...discoveryRecord, itemName: nameRef.current.value })}
                    type='text'
                    placeholder='Item name'
                    data-cy='new-discovery-name'
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col>
                <Form.Group controlId='discoveryCharges'>
                  <Form.Control
                    ref={chargeRef}
                    onChange={() => setDiscoveryRecord({ ...discoveryRecord, maxCharges: chargeRef.current.value })}
                    type='text'
                    placeholder='Charges (optional)'
                    data-cy='new-discovery-charges'
                    maxLength='3'
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId='discoverySetting'>
                  <CampaignSettingSelect
                    metadata={itemMetadata}
                    setState={setDiscoveryRecord}
                    state={discoveryRecord}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className='mb-2'>
              <Form.Group>
                <QuillInput
                  setValue={setDiscoveryDescription}
                  value={discoveryDescription}
                  placeholder='Please include a detailed description'
                />
              </Form.Group>
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
            <CategorySelect metadata={itemMetadata?.categories} setState={setDiscoveryCategories} />
            <Row>
              <Col>
                <Alert variant='info'>
                  <Form.Check
                    onChange={() =>
                      setDiscoveryRecord({ ...discoveryRecord, acknowledgement: !discoveryRecord.acknowledgement })
                    }
                    label='By checking this box you acknowledge that
                any profane or offensive language is grounds for deletion of this post and removal of community features from your account.'
                  />
                </Alert>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button disabled={loading} variant='dark' type='submit' onClick={(e) => addDiscovery(e)}>
              Add to compendium
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
