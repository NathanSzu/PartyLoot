import React, { useRef } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export default function ItemSearch({ items, setFilteredItems }) {
    const searchRef = useRef('');

    const search = (item) => {
        if (item.itemName.toLowerCase().includes(searchRef.current.value.toLowerCase())) {
            return item
        } else if (item.itemDesc.toLowerCase().includes(searchRef.current.value.toLowerCase())) {
            return item
        } else if (item.itemTags && item.itemTags.toLowerCase().includes(searchRef.current.value.toLowerCase())) {
            return item
        }
    };

    return (
        <Form onSubmit={(e) => { e.preventDefault(); setFilteredItems(items.filter(search)); }}>
            <Row>
                <Col xs={12}>
                    <Form.Control className='text-center' type='text' placeholder='Type to search items!' ref={searchRef} onChange={() => { setFilteredItems(items.filter(search)); }}></Form.Control>
                </Col>
            </Row>
        </Form>
    )
}
