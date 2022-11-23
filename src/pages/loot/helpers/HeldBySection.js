import React from 'react';
import { Col, Row, Badge } from 'react-bootstrap';
import ItemDelete from './ItemDelete';
import ItemSale from './ItemSale';

export default function HeldBySection({ item }) {
  return (
    <>
      <Row className='border-bottom border-dark pt-1 pb-1'>
        <Col className='d-flex align-items-center pl-0'>
          <h2 className='item-h2 mb-1 mt-1'>Held By</h2>
        </Col>
      </Row>
      <Row>
        <Col className='pl-0'>
          <Badge variant='dark' className='mt-3 p-2 pl-3 pr-3'>
            {item.owner || 'Party'}
          </Badge>
        </Col>
        <Col className='d-flex justify-content-end pr-0'>
          <ItemSale item={item} />
          <ItemDelete item={item} />
        </Col>
      </Row>
    </>
  );
}
