import React from 'react';
import { ListGroup, ListGroupItem, Col, Row } from 'react-bootstrap';
import DetailsPanel from './DetailsPanel';

export default function CompendiumList({ compendium }) {
  return (
    <ListGroup className='pt-2'>
      {compendium?.map((item, idx) => (
        <ListGroupItem className='rounded border-dark' key={item.id} id={`item${idx}`}>
          <Row>
            <Col>
              <h1 className='item-h1 m-0'>{item.itemName}</h1>
              <p className='m-0'>Likes | Category</p>
            </Col>
            <DetailsPanel item={item}/>
          </Row>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}
