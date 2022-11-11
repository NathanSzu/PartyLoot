import React, { useContext, useEffect, useRef } from 'react';
import { Row, Card, Col, Form, Accordion } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import GoldInput from './GoldInput';

export default function GoldTracker() {
  const { db } = useContext(AuthContext);
  const { currentGroup, sortBy } = useContext(GroupContext);

  const currencyRef = db.collection('groups').doc(currentGroup).collection('currency').doc('currency');
  const colorTagRef = db.collection('groups').doc(currentGroup).collection('currency').doc('colorTags');

  const [currency, loadingCurrency] = useDocumentData(currencyRef);
  const [colorTags] = useDocumentData(colorTagRef);

  const currency1Ref = useRef();
  const currency2Ref = useRef();
  const currency3Ref = useRef();
  const currency4Ref = useRef();
  const currency5Ref = useRef();
  const currency6Ref = useRef();

  const currencyRefs = [currency1Ref, currency2Ref, currency3Ref, currency4Ref, currency5Ref, currency6Ref];

  const color1Ref = useRef();
  const color2Ref = useRef();
  const color3Ref = useRef();
  const color4Ref = useRef();
  const color5Ref = useRef();
  const color6Ref = useRef();

  const updateCurrency = (currency, currencyValueRef) => {
    currencyRef.set(
      {
        [sortBy]: { [currency]: currencyValueRef.current.value },
      },
      { merge: true }
    );
  };

  const updateColor = (currency, colorValueRef) => {
    colorTagRef.set(
      {
        [currency]: colorValueRef.current.value,
      },
      { merge: true }
    );
  };

  const clearValues = (currencyRefs) => {
    currencyRefs.forEach((ref) => {
      ref.current.value = '';
    });
  };

  useEffect(() => {
    if (!loadingCurrency) {
      if (currency && currency[sortBy]) {
        currency1Ref.current.value = currency[sortBy].currency1;
        currency2Ref.current.value = currency[sortBy].currency2;
        currency3Ref.current.value = currency[sortBy].currency3;
        currency4Ref.current.value = currency[sortBy].currency4;
        currency5Ref.current.value = currency[sortBy].currency5;
        currency6Ref.current.value = currency[sortBy].currency6;
        console.log('currency[sortBy]', currency[sortBy]);
      } else {
        clearValues(currencyRefs);
        console.log('currency[sortBy]', currency[sortBy]);
      }
    }
  }, [currency, sortBy]);

  return (
    <div>
      <Accordion>
        <Card className='background-light rounded-0 border-dark border-left-0 border-right-0 border-bottom-0'>
          <Accordion.Toggle as={Card.Header} variant='link' eventKey='0'>
            <h1 className='item-h1 m-0 text-center'>{sortBy === 'All' ? 'Party' : sortBy} Gold</h1>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey='0'>
            <Card.Body>
              <Row className='pl-1'>
                <Col xs={1} className='p-0'>
                  <Form.Control
                    type='color'
                    value={(colorTags && colorTags.currency1) || '#ffbb00'}
                    ref={color1Ref}
                    className='p-0 border-0 background-unset'
                    onChange={() => {
                      updateColor('currency1', color1Ref);
                    }}
                  />
                </Col>
                <Col xs={5} className='pl-1 pr-1'>
                  <Form.Control
                    type='number'
                    ref={currency1Ref}
                    onChange={() => {
                      updateCurrency('currency1', currency1Ref);
                    }}
                  />
                </Col>
                <Col xs={1} className='p-0'>
                  <Form.Control
                    type='color'
                    value={(colorTags && colorTags.currency2) || '#bdbdbd'}
                    ref={color2Ref}
                    className='p-0 border-0 background-unset'
                    onChange={() => {
                      updateColor('currency2', color2Ref);
                    }}
                  />
                </Col>
                <Col xs={5} className='pl-1 pr-1'>
                  <Form.Control
                    type='number'
                    ref={currency2Ref}
                    onChange={() => {
                      updateCurrency('currency2', currency2Ref);
                    }}
                  />
                </Col>
              </Row>
              <Row className='mt-2 pl-1'>
                <Col xs={1} className='p-0'>
                  <Form.Control
                    type='color'
                    value={(colorTags && colorTags.currency3) || '#d27e1e'}
                    ref={color3Ref}
                    className='p-0 border-0 background-unset'
                    onChange={() => {
                      updateColor('currency3', color3Ref);
                    }}
                  />
                </Col>
                <Col xs={5} className='pl-1 pr-1'>
                  <Form.Control
                    type='number'
                    ref={currency3Ref}
                    onChange={() => {
                      updateCurrency('currency3', currency3Ref);
                    }}
                  />
                </Col>
                <Col xs={1} className='p-0'>
                  <Form.Control
                    type='color'
                    value={(colorTags && colorTags.currency4) || '#ffffff'}
                    ref={color4Ref}
                    className='p-0 border-0 background-unset'
                    onChange={() => {
                      updateColor('currency4', color4Ref);
                    }}
                  />
                </Col>
                <Col xs={5} className='pl-1 pr-1'>
                  <Form.Control
                    type='number'
                    ref={currency4Ref}
                    onChange={() => {
                      updateCurrency('currency4', currency4Ref);
                    }}
                  />
                </Col>
              </Row>
              <Row className='mt-2 pl-1'>
                <Col xs={1} className='p-0'>
                  <Form.Control
                    type='color'
                    value={(colorTags && colorTags.currency5) || '#ffffff'}
                    ref={color5Ref}
                    className='p-0 border-0 background-unset'
                    onChange={() => {
                      updateColor('currency5', color5Ref);
                    }}
                  />
                </Col>
                <Col xs={5} className='pl-1 pr-1'>
                  <Form.Control
                    type='number'
                    ref={currency5Ref}
                    onChange={() => {
                      updateCurrency('currency5', currency5Ref);
                    }}
                  />
                </Col>
                <Col xs={1} className='p-0'>
                  <Form.Control
                    type='color'
                    value={(colorTags && colorTags.currency6) || '#ffffff'}
                    ref={color6Ref}
                    className='p-0 border-0 background-unset'
                    onChange={() => {
                      updateColor('currency6', color6Ref);
                    }}
                  />
                </Col>
                <Col xs={5} className='pl-1 pr-1'>
                  <Form.Control
                    type='number'
                    ref={currency6Ref}
                    onChange={() => {
                      updateCurrency('currency6', currency6Ref);
                    }}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
