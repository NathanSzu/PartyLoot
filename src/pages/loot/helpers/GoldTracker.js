import React, { useContext, useEffect, useState } from 'react';
import { Row, Card, Accordion, Col, Container } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import GoldInput from './GoldInput';
import Chevron from './Chevron';
import TagEditor from './TagEditor';
import { gsap } from 'gsap';

export default function GoldTracker() {
  const { db } = useContext(AuthContext);
  const { currentGroup, sortBy } = useContext(GroupContext);
  const { defaultColors, currencyKeys } = useContext(GlobalFeatures);

  const [showTagEditor, setShowTagEditor] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => setShowTagEditor(false);
  const handleShow = () => setShowTagEditor(true);

  const currencyRef = db.collection('groups').doc(currentGroup).collection('currency').doc('currency');
  const colorTagRef = db.collection('groups').doc(currentGroup).collection('currency').doc('colorTags');
  // All tag data will eventually be stored in a single tag object in DB. We are transitioning from 'colorTags'
  const tagRef = db.collection('groups').doc(currentGroup).collection('currency').doc('tags');

  const [currency, loadingCurrency] = useDocumentData(currencyRef);
  const [colorTags] = useDocumentData(colorTagRef);
  const [allTags] = useDocumentData(tagRef);

  useEffect(() => {
    gsap.fromTo('.chevron-left', { rotate: 180 }, { rotate: 0, duration: 0.35 });
    gsap.fromTo('.chevron-right', { rotate: -180 }, { rotate: 0, duration: 0.35 });
  }, [open]);

  return (
    <Accordion>
      <TagEditor allTags={allTags} colorTags={colorTags} show={showTagEditor} handleClose={handleClose} />
      <Card className='background-light rounded-0 border-dark border-left-0 border-right-0 border-bottom-0'>
        <Accordion.Toggle
          as={Card.Header}
          variant='link'
          eventKey='0'
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Row>
            <Chevron open={open} />
            <Col>
              <h1 className='item-h1 m-0 text-center'>{sortBy === 'All' ? 'Party' : sortBy} Gold</h1>
            </Col>
            <Chevron open={open} reverse={true} />
          </Row>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey='0'>
          <Card.Body className='p-3'>
            <Container fluid className='p-0'>
              {currencyKeys.map((currencyKey, idx) => (
                <GoldInput
                  key={idx}
                  tags={allTags?.[currencyKey]}
                  currency={!loadingCurrency && currency && currency[sortBy]?.[currencyKey]}
                  currencyKey={currencyKey}
                  handleShow={handleShow}
                  colorTag={colorTags?.[currencyKey]}
                  defaultColor={defaultColors[idx]}
                />
              ))}
            </Container>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
