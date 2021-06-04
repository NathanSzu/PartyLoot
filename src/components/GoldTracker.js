import React from 'react'
import { Row, Card, Col, Form } from 'react-bootstrap';
import gold from '../assets/currency_gold.svg';
import silver from '../assets/currency_silver.svg';
import copper from '../assets/currency_copper.svg';

export default function GoldTracker() {
    return (
        <Row>
            <Col xs={2} className='p-0'>
                <Form.Label className='text-right'><img src={gold} className='w-50'></img></Form.Label>
            </Col>
            <Col xs={4} className='pl-2'>
                <Form.Control type='number' />
            </Col>
            <Col xs={2} className='p-0'>
                <Form.Label className='text-right'><img src={silver} className='w-50'></img></Form.Label>
            </Col>
            <Col xs={4} className='pl-2'>
                <Form.Control type='number' />
            </Col>
            <Col xs={2} className='p-0'>
                <Form.Label className='text-right'><img src={copper} className='w-50'></img></Form.Label>
            </Col>
            <Col xs={4} className='pl-2'>
                <Form.Control type='number' />
            </Col>
        </Row>
    )
}
