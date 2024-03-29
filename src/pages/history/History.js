import React, { useContext, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Row, Col, ListGroup, Button, Navbar } from 'react-bootstrap';
import { GroupContext } from '../../utils/contexts/GroupContext';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import HistoryItem from './helpers/HistoryItem';

export default function History() {
  const { groupDoc } = useContext(GroupContext);

  const [resultQty, setResultQty] = useState(25);

  const historyRef = groupDoc.collection('history');
  const query = historyRef.orderBy('timestamp', 'desc').limit(resultQty);

  const [historyEvents] = useCollectionData(query);

  return (
    <Row className='lazy-scroll-container'>
      <Navbar sticky='top' className='theme1-backer rounded-bottom p-3 mb-2' id='sticky-history-menu'>
        <Col>
          <h1 className='m-0 text-light fancy-font fs-md-deco'>History</h1>
        </Col>
        <Col xs={2} className='text-end'>
          <LinkContainer to='/loot' data-cy='button-loot'>
            <Button variant='dark' className='background-dark pt-1 pb-1'>
              <img className='m-1' alt='Loot list' src='APPIcons/loot-list.svg' />
            </Button>
          </LinkContainer>
        </Col>
      </Navbar>
      <Col>
        <ListGroup>
          {historyEvents?.length === 0 && <p className='text-center pt-3 text-light'>History is empty!</p>}
          {historyEvents && historyEvents.map((event, idx) => <HistoryItem event={event} key={idx} />)}
        </ListGroup>
      </Col>
    </Row>
  );
}
