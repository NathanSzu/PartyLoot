import React from 'react';
import { Accordion, Card, Col, Row, Badge } from 'react-bootstrap';
import ModalLoot from './ModalLoot';

export default function AccordionLoot({ item, idx }) {
    return (
        <Accordion className='m-0 mt-1'>
            <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                    <h1 className='item-h1 m-0'>{item.itemName}</h1>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='0'>
                    <div className='texture-backer'>
                        <Card.Body>
                            <Row className='pt-1 pb-1'>
                                <Col className='d-flex align-items-center border-bottom border-dark'>
                                    <h2 className='item-h2 m-0'>Description</h2>
                                </Col>
                                {item.currCharges && item.maxCharges ?
                                    <Col className='d-flex align-items-center border-bottom border-dark'>
                                        <h2 className='item-h2 mb-1 mt-1'>{item.currCharges} / {item.maxCharges} charges</h2>
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
