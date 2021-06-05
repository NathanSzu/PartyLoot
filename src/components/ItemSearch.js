import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import search from '../assets/search.svg'

export default function ItemSearch() {
    return (
        <Form>
            <Row>
                <Col xs={10}>
                    <Form.Control type='text'></Form.Control>
                </Col>
                <Col xs={2} className='p-0 pr-3'>
                    <Button variant="dark" type="submit" className='w-100'>
                        <img src={search}></img>
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}
