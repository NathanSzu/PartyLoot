import React from 'react';
import { Accordion, Card, Col, Row, Container } from 'react-bootstrap';
import ModalLoot from './ModalLoot';
import HeldBySection from './HeldBySection';
import QuillDisplay from '../../common/QuillDisplay';

export default function AccordionLoot({ filteredItems, itemOwners }) {
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
                {item?.itemQty > 0 && (
                  <Col xs={2} className='p-0 border-left border-dark'>
                    <p className='m-0 vertical-center pl-1 pr-1 w-100 text-center'>x{item?.itemQty || 1}</p>
                  </Col>
                )}
              </Row>
            </Container>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={item.id}>
            <Card.Body className='background-light pt-2'>
              <Container className='pl-2 pr-2 pt-0'>
                <Row className='pt-1 pb-1'>
                  <Col className='d-flex align-items-center border-bottom border-dark pl-0'>
                    <h2 className='item-h2 m-0'>Description</h2>
                  </Col>
                  {item.currCharges && item.maxCharges && (
                    <Col className='d-flex align-items-center border-bottom border-dark pl-0'>
                      <h2 className='item-h2 mb-1 mt-1'>
                        {item.currCharges} / {item.maxCharges} <img alt='Charges' src='APPIcons/charge.svg' />
                      </h2>
                    </Col>
                  )}
                  <Col xs={2} className='text-right pl-2 pr-0'>
                    <ModalLoot item={item} idx={idx} />
                  </Col>
                </Row>

                <Row>
                  <Col className='p-0'>
                    <QuillDisplay className='p-0' value={item.itemDesc} />
                  </Col>
                </Row>

                <HeldBySection item={item} itemOwners={itemOwners} />
              </Container>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );
}
