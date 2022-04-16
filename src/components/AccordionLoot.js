import React, { useContext, useState } from 'react';
import { Accordion, Card, Col, Row, Badge, Container, Button } from 'react-bootstrap';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';
import ModalLoot from './ModalLoot';
import ItemDelete from './ItemDelete';
import ItemSale from './ItemSale';

export default function AccordionLoot({ filteredItems }) {
  const { currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  // const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`);

  // const dragStart = (e) => console.log('Drag Started', e.currentTarget.offsetWidth, e.touches[0]);
  // const dragging = (e) => console.log('Dragging...', e.currentTarget);
  // const dragStop = (e) => console.log('Drag Ended!', e.touches);
  // Below is code for the draggable accordion.
  // onTouchStart={dragStart} onTouchEnd={dragStop} onDragStart={dragStart} onDragEnd={dragStop}

  return (
    <Accordion className='m-0'>
      {filteredItems.map((item, idx) => (
        <Card className='loot-item' key={idx}>
          <Accordion.Toggle as={Card.Header} variant='link' eventKey={item.id} className='p-2'>
            <Container>
              <Row>
                <Col className='pl-0 pr-1'>
                  <h1
                    className={`item-h1 m-0 pt-1 pb-1 ${
                      item.itemQty && item.itemQty > 1 ? 'border-right border-dark' : ''
                    }`}
                  >
                    {item.itemName}
                  </h1>
                </Col>
                {item.itemQty && item.itemQty > 1 ? (
                  <Col xs={1} className='p-0'>
                    <p className='m-0 vertical-center pl-1'>x{item.itemQty}</p>
                  </Col>
                ) : null}
              </Row>
            </Container>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={item.id}>
            <div className=''>
              <Card.Body className='background-light'>
                <Row className='pt-1 pb-1'>
                  <Col className='d-flex align-items-center border-bottom border-dark'>
                    <h2 className='item-h2 m-0'>Description</h2>
                  </Col>
                  {item.currCharges && item.maxCharges ? (
                    <Col className='d-flex align-items-center border-bottom border-dark'>
                      <h2 className='item-h2 mb-1 mt-1'>
                        {item.currCharges} / {item.maxCharges} <img alt='Charges' src='APPIcons/charge.svg' />
                      </h2>
                    </Col>
                  ) : null}
                  <Col xs={2} className='text-right'>
                    <ModalLoot item={item} idx={idx} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <pre>{item.itemDesc}</pre>
                  </Col>
                </Row>
                <Row className='border-bottom border-dark pt-1 pb-1'>
                  <Col className='d-flex align-items-center'>
                    <h2 className='item-h2 mb-1 mt-1'>Held By</h2>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Badge variant='dark' className='mt-3 p-2 pl-3 pr-3'>
                      {item.owner || 'Party'}
                    </Badge>
                  </Col>
                  <Col className='d-flex justify-content-end'>
                    {/* Commented incomplete feature */}
                    {/* <ItemSale item={item} /> */}
                    <ItemDelete item={item} />
                  </Col>
                </Row>
              </Card.Body>
            </div>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );
}
