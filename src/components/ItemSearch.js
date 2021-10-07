import React, { useRef, useEffect, useContext } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { GroupContext } from '../utils/contexts/GroupContext';

export default function ItemSearch({ items, setFilteredItems }) {
    const { sortBy } = useContext(GroupContext);

    const searchRef = useRef('');

    useEffect(() => {
        items && setFilteredItems(items.filter(search));
    }, [sortBy, items, setFilteredItems])

    const search = (item) => {
        if (sortBy === 'All') {
            if (item.itemName.toLowerCase().includes(searchRef.current.value.toLowerCase().trim())) {
                return item
            } else if (item.itemDesc && item.itemDesc.toLowerCase().includes(searchRef.current.value.toLowerCase().trim())) {
                return item
            } else if (item.itemTags && item.itemTags.toLowerCase().includes(searchRef.current.value.toLowerCase().trim())) {
                return item
            }
        } else if ( item.owner && item.owner.toLowerCase() === sortBy.toLowerCase()) {
            if (item.itemName.toLowerCase().includes(searchRef.current.value.toLowerCase().trim())) {
                return item
            } else if (item.itemDesc && item.itemDesc.toLowerCase().includes(searchRef.current.value.toLowerCase().trim())) {
                return item
            } else if (item.itemTags && item.itemTags.toLowerCase().includes(searchRef.current.value.toLowerCase().trim())) {
                return item
            }
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
