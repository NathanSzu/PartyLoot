import React from 'react';
import { Accordion, Card, Col, Row, Badge, Container } from 'react-bootstrap';
import ModalLoot from './ModalLoot';
import HeldBySection from './HeldBySection';

export default function AccordionLoot({ filteredItems }) {
  return (
    <Accordion className='m-0'>
      {filteredItems.map((item, idx) => (
        <Card className='loot-item' key={idx}>
          <Accordion.Toggle as={Card.Header} variant='link' eventKey={item.id} className='pr-0'>
            <Container className='pr-0'>
              <Row className='mr-1'>
                <Col className='pl-0 pr-0'>
                  <h1 className='item-h1 m-0 pt-1 pb-1'>{item.itemName}</h1>
                </Col>
                {item.itemQty && item.itemQty > 1 && (
                  <Col xs={2} className='p-0 border-left border-dark'>
                    <p className='m-0 vertical-center pl-1 pr-1 w-100 text-center'>x{item.itemQty}</p>
                  </Col>
                )}
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
                  {item.currCharges && item.maxCharges && (
                    <Col className='d-flex align-items-center border-bottom border-dark'>
                      <h2 className='item-h2 mb-1 mt-1'>
                        {item.currCharges} / {item.maxCharges} <img alt='Charges' src='APPIcons/charge.svg' />
                      </h2>
                    </Col>
                  )}
                  <Col xs={2} className='text-right'>
                    <ModalLoot item={item} idx={idx} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <pre>{item.itemDesc}</pre>
                  </Col>
                </Row>
                <HeldBySection item={item} />
              </Card.Body>
            </div>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );
}
