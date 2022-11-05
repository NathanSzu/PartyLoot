import React, { useContext, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import HistoryItem from '../components/HistoryItem';

export default function History() {
  const { currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const [resultQty, setResultQty] = useState(10);

  const historyRef = db.collection('groups').doc(currentGroup).collection('history');
  const query = historyRef.orderBy('timestamp', 'desc').limit(resultQty);

  const [historyEvents] = useCollectionData(query);

  return (
    <Container className='pb-5'>
      <Row>
        <Col xs={12} className='background-light pr-3 pl-3 pt-2 pb-2 d-flex'>
          <div className='fg-3'>
            <h1 className='groups-h1 m-0 text-center fancy-font pt-2 pb-1'>History</h1>
          </div>
          <div>
            <LinkContainer to='/loot' data-cy='button-loot'>
              <Button variant='dark' className='background-dark pt-1 pb-1'>
                <img className='m-1' alt='Loot list' src='APPIcons/loot-list.svg' />
              </Button>
            </LinkContainer>
          </div>
        </Col>
      </Row>
      <Row>
        <ListGroup className='w-100'>
          {historyEvents && historyEvents.length === 0 && (
            <p className='text-center pt-3 text-light'>History is empty!</p>
          )}
          {historyEvents && historyEvents.map((event, idx) => <HistoryItem event={event} key={idx} />)}
        </ListGroup>
        {historyEvents && historyEvents.length >= 10 && (
          <Col xs={12} className='background-light d-flex flex-row-reverse p-0'>
            <Button variant='link' className='pt-0 pb-0 pl-1 pr-1' onClick={() => setResultQty(50)}>
              50
            </Button>
            <Button variant='link' className='pt-0 pb-0 pl-1 pr-1' onClick={() => setResultQty(25)}>
              25
            </Button>
            <Button variant='link' className='pt-0 pb-0 pl-1 pr-1' onClick={() => setResultQty(10)}>
              10
            </Button>
            <div>Results:</div>
          </Col>
        )}
      </Row>
    </Container>
  );
}
