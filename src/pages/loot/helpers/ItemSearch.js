import React, { useRef, useContext } from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
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
          <InputGroup>
            <Form.Control
              className='text-center'
              type='text'
              placeholder='Type to search items!'
              ref={searchRef}
              value={itemQuery.searchQuery}
              onChange={() => {
                setItemQuery({ ...itemQuery, searchQuery: searchRef.current.value });
              }}
            />
            {itemQuery.searchQuery && (
              <InputGroup.Text 
                as="button" 
                type="button"
                onClick={() => setItemQuery({ ...itemQuery, searchQuery: '' })}
                style={{ cursor: 'pointer' }}
              >
                ×
              </InputGroup.Text>
            )}
          </InputGroup>
        </Col>
      </Row>
    </Form>
  );
}
