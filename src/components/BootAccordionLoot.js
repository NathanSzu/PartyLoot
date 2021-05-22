import React from 'react';
import edit from '../assets/pencil-square.svg';
import { Accordion, Card, Button, Col, Row } from 'react-bootstrap';
import EditLoot from '../components/ModalEditLoot';

export default function BootAccordionLoot({ item }) {
    return (
        <Accordion className='m-1'>
            <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                    <h1 className='item-h1'>{item.itemName}</h1>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Row>
                            <Col>
                                <h2 className='item-h2'>Description</h2>
                            </Col>
                            <Col xs={2} className='text-right'>
                                <EditLoot item={item} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <pre>{item.itemDesc}</pre>
                            </Col>
                        </Row>

                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}
