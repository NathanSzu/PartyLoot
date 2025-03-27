import React, { useContext } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import ItemDelete from './ItemDelete';
import ItemSale from '../currencyTracking/itemSale/ItemSale';
import { GroupContext } from '../../../../utils/contexts/GroupContext';

export default function HeldBySection({ item }) {
  const { itemOwners } = useContext(GroupContext);
  let owner = itemOwners && itemOwners.filter((itemOwner) => itemOwner.id === item.ownerId)[0];

  return (
    <Row className='pt-2'>
      <Col className='ps-0'>
        <Button disabled variant="light" size="sm" className='mt-1 rounded-pill border-0'>
          Owner: {owner?.name || 'Party'}
        </Button>
      </Col>
      <Col className='d-flex justify-content-end pe-0'>
        <ItemSale item={item} itemOwners={itemOwners} />
        <ItemDelete item={item} />
      </Col>
    </Row>
  );
}
