import React, { useRef, useEffect, useContext, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';

export default function ItemSearch({ items, setFilteredItems, setLoading }) {
  const { sortBy } = useContext(GroupContext);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef('');

  useEffect(() => {
    // Waits for a brief delay after the last change to update the display
    if (searchTerm.length > 0 && items) {
      const delay = setTimeout(() => {
        setFilteredItems(items.filter(search));
        setLoading(false);
      }, 750);
      return () => {
        clearTimeout(delay);
      };
    }
    if (searchTerm.length === 0 && items) {
      setFilteredItems(items.filter(search));
      setLoading(false);
    }
  }, [searchTerm, items, setFilteredItems]);

  useEffect(() => {
    items && setFilteredItems(items.filter(search));
  }, [sortBy, setFilteredItems]);

  const search = (item) => {
    const { itemName, itemDesc, itemTags, owner } = item;
    if (owner.toLowerCase() !== sortBy.toLowerCase() && sortBy !== 'All')
      return;
    if (
      itemName
        .toLowerCase()
        .includes(searchRef.current.value.toLowerCase().trim())
    )
      return item;
    if (
      itemDesc
        .toLowerCase()
        .includes(searchRef.current.value.toLowerCase().trim())
    )
      return item;
    if (
      itemTags
        .toLowerCase()
        .includes(searchRef.current.value.toLowerCase().trim())
    )
      return item;
  };

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setFilteredItems(items.filter(search));
      }}
    >
      <Row>
        <Col xs={12}>
          <Form.Control
            className='text-center'
            type='text'
            placeholder='Type to search items!'
            ref={searchRef}
            onChange={() => {
              setSearchTerm(searchRef.current.value);
            }}
          ></Form.Control>
        </Col>
      </Row>
    </Form>
  );
}
