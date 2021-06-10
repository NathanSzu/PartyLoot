import React, { useRef, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function ItemSearch({ items, setFilteredItems }) {
    const searchRef = useRef('');

    const search = (item) => {
        if (item.itemName.includes(searchRef.current.value)) {
            return item
        } else if (item.itemDesc.includes(searchRef.current.value)) {
            return item
        }
    };

    return (
        <Form onSubmit={(e) => { e.preventDefault(); setFilteredItems(items.filter(search)); }}>
            <Row>
                <Col xs={12}>
                    <Form.Control type='text' placeholder='Type to search items!' ref={searchRef} onChange={() => { setFilteredItems(items.filter(search)); }}></Form.Control>
                </Col>
            </Row>
        </Form>
    )
}
