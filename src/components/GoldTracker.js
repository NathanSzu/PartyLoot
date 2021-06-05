import React from 'react'
import { Row, Card, Col, Form } from 'react-bootstrap';
import gold from '../assets/currency_gold.svg';
import silver from '../assets/currency_silver.svg';
import copper from '../assets/currency_copper.svg';

export default function GoldTracker() {
    return (
        <>
            <Row>
                <Col xs={1} className='p-0'>
                    <Form.Label className='text-right'><img src={gold} className='w-100'></img></Form.Label>
                </Col>
                <Col xs={5} className='pl-2'>
                    <Form.Control type='number' />
                </Col>
                <Col xs={1} className='p-0'>
                    <Form.Label className='text-right'><img src={silver} className='w-100'></img></Form.Label>
                </Col>
                <Col xs={5} className='pl-2'>
                    <Form.Control type='number' />
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col xs={1} className='p-0'>
                    <Form.Label className='text-right'><img src={copper} className='w-100'></img></Form.Label>
                </Col>
                <Col xs={5} className='pl-2'>
                    <Form.Control type='number' />
                </Col>
                <Col xs={1} className='p-0'>
                    <Form.Label className='text-right'><img src={copper} className='w-100'></img></Form.Label>
                </Col>
                <Col xs={5} className='pl-2'>
                    <Form.Control type='number' />
                </Col>
            </Row>
        </>
    )
}
