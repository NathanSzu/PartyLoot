import React, { useState, useContext } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import TagInput from './TagInput';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { GroupContext } from '../../../utils/contexts/GroupContext';

export default function TagEditor({ allTags, show, handleClose }) {
  const { groupDoc } = useContext(GroupContext);
  const { defaultColors, currencyKeys } = useContext(GlobalFeatures);

  const tagRef = groupDoc.collection('currency').doc('tags');

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
          <Row className='text-left pb-2 justify-content-center'>
            <Col xs={2} md={1} className='ps-0'>
              <img alt='Palette' src='/APPIcons/palette.svg'></img>
            </Col>
            <Col xs={3}>
              <img alt='Symbol' src='/APPIcons/type.svg'></img>
            </Col>
            <Col xs={6}>
              <img alt='Theme' src='/APPIcons/type-theme.svg'></img>
            </Col>
          </Row>
            {currencyKeys.map((currencyKey, idx) => (
              <TagInput
                key={idx}
                tags={allTags?.[currencyKey]}
                updateTagState={updateTagState}
                defaultColor={defaultColors[idx]}
                currencyKey={currencyKey}
              />
            ))}
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
