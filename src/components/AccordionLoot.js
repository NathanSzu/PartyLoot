import React from 'react';
import { Accordion, Card, Col, Row, Badge, Container } from 'react-bootstrap';
import ModalLoot from './ModalLoot';

export default function AccordionLoot({ item, idx }) {
    return (
        <Accordion className='m-0 mt-1 loot-item'>
            <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="0" className="p-2">
                    <Container>
                        <Row>
                            <Col className='pl-0 pr-1'>
                                <h1 className={`item-h1 m-0 pt-1 pb-1 ${item.itemQty && item.itemQty > 1 ? "border-right border-dark" : ""}`}>{item.itemName}</h1>
                            </Col>
                            {item.itemQty && item.itemQty > 1 ?
                                <Col xs={1} className="p-0">
                                    <p className="m-0 vertical-center pl-1">x{item.itemQty}</p>
                                </Col> : null}
                        </Row>
                    </Container>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='0'>
                    <div className=''>
                        <Card.Body className='background-light'>
                            <Row className='pt-1 pb-1'>
                                <Col className='d-flex align-items-center border-bottom border-dark'>
                                    <h2 className='item-h2 m-0'>Description</h2>
                                </Col>
                                {item.currCharges && item.maxCharges ?
                                    <Col className='d-flex align-items-center border-bottom border-dark'>
                                        <h2 className='item-h2 mb-1 mt-1'>{item.currCharges} / {item.maxCharges} <img alt='Charges' src='APPIcons/charge.svg' /></h2>
                                    </Col>
                                    : null}
                                <Col xs={2} className='text-right'>
                                    <ModalLoot item={item} idx={idx} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <pre>{item.itemDesc}</pre>
                                </Col>
                            </Row>
                            {item.owner ?
                                <>
                                    <Row className='border-bottom border-dark pt-1 pb-1'>
                                        <Col className='d-flex align-items-center'>
                                            <h2 className='item-h2 mb-1 mt-1'>Held By</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Badge variant="dark" className='mt-3 p-2 pl-3 pr-3'>{item.owner}</Badge>
                                        </Col>
                                    </Row>
                                </>
                                : null}

                        </Card.Body>
                    </div>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}
