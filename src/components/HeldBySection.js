import React from 'react';
import { Col, Row, Badge } from 'react-bootstrap';
import ItemDelete from './ItemDelete';
import ItemSale from './ItemSale';

export default function HeldBySection({ item }) {
  return (
    <>
      <Row className='border-bottom border-dark pt-1 pb-1'>
        <Col className='d-flex align-items-center'>
          <h2 className='item-h2 mb-1 mt-1'>Held By</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Badge variant='dark' className='mt-3 p-2 pl-3 pr-3'>
            {item.owner || 'Party'}
          </Badge>
        </Col>
        <Col className='d-flex justify-content-end'>
          <ItemSale item={item} />
          <ItemDelete item={item} />
        </Col>
      </Row>
    </>
  );
}
