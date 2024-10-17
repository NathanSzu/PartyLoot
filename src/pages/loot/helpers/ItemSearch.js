import React, { useRef, useContext } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';

export default function ItemSearch() {
  const { itemQuery, setItemQuery } = useContext(GroupContext);
  const searchRef = useRef('');

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
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
              setItemQuery({ ...itemQuery, searchQuery: searchRef.current.value });
            }}
          ></Form.Control>
        </Col>
      </Row>
    </Form>
  );
}
