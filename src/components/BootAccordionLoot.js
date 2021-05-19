import React from 'react';
import edit from '../assets/pencil-square.svg';
import { Accordion, Card, Button, Col, Row } from 'react-bootstrap';

export default function BootAccordionLoot({ item }) {
    return (
        <Accordion>
            <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                    <h1>{item.itemName}</h1>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Row>
                            <Col>
                                <h2>Description</h2>
                            </Col>
                            <Col xs={2} className='text-right'>
                                <Button variant='dark' className='p-2'><img src={edit}></img></Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>{item.itemDesc}</p>
                            </Col>
                        </Row>

                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}
