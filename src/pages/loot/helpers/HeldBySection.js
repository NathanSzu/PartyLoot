import React from 'react';
import { Col, Row, Badge } from 'react-bootstrap';
import ItemDelete from './ItemDelete';
import ItemSale from './ItemSale';

export default function HeldBySection({ item, itemOwners }) {
  let owner = itemOwners && itemOwners.filter((itemOwner) => itemOwner.id === item.ownerId)[0]

  return (
    <>
      <Row className='border-bottom border-dark py-1'>
        <Col className='d-flex align-items-center px-0'>
          <h2 className='item-h2 mb-1 mt-1'>Held By</h2>
        </Col>
      </Row>
      <Row>
        <Col className='ps-0'>
          <Badge bg='dark' className='mt-3 p-2 px-3'>
            {owner?.name || 'Party'}
          </Badge>
        </Col>
        <Col className='d-flex justify-content-end pe-0'>
          <ItemSale item={item} itemOwners={itemOwners} />
          <ItemDelete item={item} />
        </Col>
      </Row>
    </>
  );
}
