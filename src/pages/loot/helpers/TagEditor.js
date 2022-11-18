import React, { useState, useContext } from 'react';
import { Modal, Container, Row, Button } from 'react-bootstrap';
import TagInput from './TagInput';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function TagEditor({ allTags, colorTags, show, handleClose }) {
  const { db } = useContext(AuthContext);
  const { currentGroup } = useContext(GroupContext);
  const { defaultColors, currencyKeys } = useContext(GlobalFeatures);

  const colorDataRef = db.collection('groups').doc(currentGroup).collection('currency').doc('colorTags');
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

  const updateColor = (currency, color) => {
    colorDataRef.set(
      {
        [currency]: color,
      },
      { merge: true }
    );
  };

  const updateTags = async (tagState) => {
    // setLoading(true);
    tagRef.set(tagState, { merge: true }).catch((err) => console.error(err));
  };

  const updateColorTags = async (tagState) => {
    let keys = Object.keys(tagState);
    let values = Object.values(tagState);
    keys.forEach((key, idx) => {
      values[idx].color && updateColor(key, values[idx].color);
    });
  };

  const updateTagData = (tagState) => {
    updateTags(tagState).then(() => {
      updateColorTags(tagState).then(() => {
        // clearStateAndClose();
        // setLoading(false);
      });
    });
  };

  // useEffect(() => {
  //   console.log('tagState: ', tagState);
  // }, [tagState]);

  return (
    <Modal size='lg' show={show} onHide={clearStateAndClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
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
