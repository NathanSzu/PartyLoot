import React, { useContext, useRef } from 'react'
import { Row, Card, Col, Form, Accordion } from 'react-bootstrap';
import goldImg from '../assets/currency_gold.svg';
import silverImg from '../assets/currency_silver.svg';
import copperImg from '../assets/currency_copper.svg';
// import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from '../utils/firebase';

export default function GoldTracker() {
    const { currentGroup } = useContext(GroupContext);

    const db = firebase.firestore();
    const currencyRef = db.collection('groups').doc(currentGroup).collection('currency');

    const currency1Query = currencyRef.where('name', '==', 'currency1');
    const currency2Query = currencyRef.where('name', '==', 'currency2');
    const currency3Query = currencyRef.where('name', '==', 'currency3');
    const currency4Query = currencyRef.where('name', '==', 'currency4');
    const currency5Query = currencyRef.where('name', '==', 'currency5');
    const currency6Query = currencyRef.where('name', '==', 'currency6');

    const [currency1] = useCollectionData(currency1Query, { idField: 'id' });
    const [currency2] = useCollectionData(currency2Query, { idField: 'id' });
    const [currency3] = useCollectionData(currency3Query, { idField: 'id' });
    const [currency4] = useCollectionData(currency4Query, { idField: 'id' });
    const [currency5] = useCollectionData(currency5Query, { idField: 'id' });
    const [currency6] = useCollectionData(currency6Query, { idField: 'id' });

    const currency1Ref = useRef();
    const currency2Ref = useRef();
    const currency3Ref = useRef();
    const currency4Ref = useRef();
    const currency5Ref = useRef();
    const currency6Ref = useRef();

    const color1Ref = useRef();

    const updateCurrency = (currency, currencyValueRef) => {
        currencyRef.doc(currency).update({
            name: currency,
            qty: currencyValueRef.current.value
        })
    }

    const updateColor = (currency, colorValueRef) => {
        currencyRef.doc(currency).update({
            color: colorValueRef.current.value
        })
    }

    const getColor = () => {
        console.log(color1Ref.current.value)
    }

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
                                    <Form.Control type='color' defaultValue={'#ffbb00'} value={currency1 && currency1[0] && currency1[0].color || '#ffbb00'} ref={color1Ref} className='p-0 border-0' onChange={() => { updateColor('currency1', color1Ref) }} />
                                    {/* <Form.Label className='text-right'><img alt='Currency1' src={goldImg} className='w-100'></img></Form.Label> */}
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={currency1 && currency1[0] && currency1[0].qty ? currency1[0].qty : null} ref={currency1Ref} onChange={() => { updateCurrency('currency1', currency1Ref) }} />
                                </Col>
                                <Col xs={1} className='p-0'>
                                    <Form.Label className='text-right'><img alt='Currency2' src={silverImg} className='w-100'></img></Form.Label>
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={currency2 && currency2[0] && currency2[0].qty ? currency2[0].qty : null} ref={currency2Ref} onChange={() => { updateCurrency('currency2', currency2Ref) }} />
                                </Col>
                            </Row>
                            <Row className='mt-2 pl-2'>
                                <Col xs={1} className='p-0'>
                                    <Form.Label className='text-right'><img alt='Currency3' src={copperImg} className='w-100'></img></Form.Label>
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={currency3 && currency3[0] && currency3[0].qty ? currency3[0].qty : null} ref={currency3Ref} onChange={() => { updateCurrency('currency3', currency3Ref) }} />
                                </Col>
                                <Col xs={1} className='p-0'>
                                    <Form.Label className='text-right'><img alt='Currency4' src={copperImg} className='w-100'></img></Form.Label>
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={currency4 && currency4[0] && currency4[0].qty ? currency4[0].qty : null} ref={currency4Ref} onChange={() => { updateCurrency('currency4', currency4Ref) }} />
                                </Col>
                            </Row>
                            <Row className='mt-2 pl-2'>
                                <Col xs={1} className='p-0'>
                                    <Form.Label className='text-right'><img alt='Currency5' src={copperImg} className='w-100'></img></Form.Label>
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={currency5 && currency5[0] && currency5[0].qty ? currency5[0].qty : null} ref={currency5Ref} onChange={() => { updateCurrency('currency5', currency5Ref) }} />
                                </Col>
                                <Col xs={1} className='p-0'>
                                    <Form.Label className='text-right'><img alt='Currency6' src={copperImg} className='w-100'></img></Form.Label>
                                </Col>
                                <Col xs={5} className='pl-2'>
                                    <Form.Control type='number' defaultValue={currency6 && currency6[0] && currency6[0].qty ? currency6[0].qty : null} ref={currency6Ref} onChange={() => { updateCurrency('currency6', currency6Ref) }} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </>
    )
}
