import React, { useState, useContext } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import TagInput from './TagInput';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function TagEditor({ allTags, colorTags, show, handleClose }) {
  const { db } = useContext(AuthContext);
  const { currentGroup } = useContext(GroupContext);
  const { defaultColors, currencyKeys } = useContext(GlobalFeatures);

  const tagRef = db.collection('groups').doc(currentGroup).collection('currency').doc('tags');

  const [tagState, setTagState] = useState({});
  const [loading, setLoading] = useState(false);

  const updateTagState = (key, tag, value) => {
    setTagState({
      ...tagState,
      [key]: {
        ...tagState[key],
        [tag]: value,
      },
    });
  };

  const clearStateAndClose = () => {
    setTagState({});
    handleClose();
  };

  const updateTags = async (tagState) => {
    setLoading(true);
    tagRef.set(tagState, { merge: true }).catch((err) => console.error(err));
  };

  const updateTagData = (tagState) => {
    updateTags(tagState).then(() => {
      clearStateAndClose();
      setLoading(false);
    });
  };

  return (
    <Modal size='lg' show={show} onHide={clearStateAndClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className='text-center'>
            <Col xs={1} className='p-0 pb-1 h-100'>
              <img alt='Edit Group' src='/APPIcons/palette.svg'></img>
            </Col>
            <Col xs={2} md={1} className='pl-1 pr-1 pb-1'>
              <img alt='Edit Group' src='/APPIcons/type.svg'></img>
            </Col>
            <Col xs={3} md={2} className='pl-1 pr-1 pb-1'>
              <img alt='Edit Group' src='/APPIcons/type-theme.svg'></img>
            </Col>
          </Row>
          <Row className='pb-2'>
            {currencyKeys.map((currencyKey, idx) => (
              <TagInput
                key={idx}
                tags={allTags?.[currencyKey]}
                updateTagState={updateTagState}
                colorTag={colorTags?.[currencyKey]}
                defaultColor={defaultColors[idx]}
                currencyKey={currencyKey}
              />
            ))}
          </Row>
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button disabled={loading} variant='dark' className='background-dark' onClick={() => updateTagData(tagState)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
