import React, { useRef, useContext } from 'react'
import { Row, Card, Col, Form, Accordion } from 'react-bootstrap';
import goldImg from '../assets/currency_gold.svg';
import silverImg from '../assets/currency_silver.svg';
import copperImg from '../assets/currency_copper.svg';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import firebase from '../utils/firebase';

export default function GoldTracker({ gold, silver, copper, misc1, currencyRef }) {
    const { currentUser } = useContext(AuthContext);
    const { currentGroup } = useContext(GroupContext);

    const goldRef = useRef();
    const silverRef = useRef();
    const copperRef = useRef();
    const misc1Ref = useRef();

    const updateGold = () => {
        currencyRef.doc('gold').set({
            name: 'gold',
            qty: goldRef.current.value
        })
    };
    const updateSilver = () => {
        currencyRef.doc('silver').set({
            name: 'silver',
            qty: silverRef.current.value
        })
    };
    const updateCopper = () => {
        currencyRef.doc('copper').set({
            name: 'copper',
            qty: copperRef.current.value
        })
    };
    const updateMisc1 = () => {
        currencyRef.doc('misc1').set({
            name: 'misc1',
            qty: misc1Ref.current.value
        })
    };

    return (
        <>
            <Accordion className='m-0 mt-1'>
                <Card>
                    <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                        <h1 className='item-h1 m-0 text-center'>Gold Tracker</h1>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey='0'>
                        <Card.Body>
                            <Row className='pl-2'>
                                <Col xs={1} className='p-0'>
                                    <Form.Label className='text-right'><img src={goldImg} className='w-100'></img></Form.Label>
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={gold && gold[0] && gold[0].qty ? gold[0].qty : null} ref={goldRef} onChange={updateGold} />
                                </Col>
                                <Col xs={1} className='p-0'>
                                    <Form.Label className='text-right'><img src={silverImg} className='w-100'></img></Form.Label>
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={silver && silver[0] && silver[0].qty ? silver[0].qty : null} ref={silverRef} onChange={updateSilver} />
                                </Col>
                            </Row>
                            <Row className='mt-2 pl-2'>
                                <Col xs={1} className='p-0'>
                                    <Form.Label className='text-right'><img src={copperImg} className='w-100'></img></Form.Label>
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={copper && copper[0] && copper[0].qty ? copper[0].qty : null} ref={copperRef} onChange={updateCopper} />
                                </Col>
                                <Col xs={1} className='p-0'>
                                    <Form.Label className='text-right'><img src={copperImg} className='w-100'></img></Form.Label>
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={misc1 && misc1[0] && misc1[0].qty ? misc1[0].qty : null} ref={misc1Ref} onChange={updateMisc1} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </>
    )
}
