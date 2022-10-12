import React, { useContext, useState } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import HistoryItem from '../components/HistoryItem';

export default function History() {
  const { groupData, currentGroup } = useContext(GroupContext);
  const { db } = useContext(AuthContext);

  const [resultQty, setResultQty] = useState(10);

  const historyRef = db.collection('groups').doc(currentGroup).collection('history');
  const query = historyRef.orderBy('timestamp', 'desc').limitToLast(resultQty);

  const [historyEvents] = useCollectionData(query);

  return (
    <Container>
      <Row>
        <Col className='background-light p-3 fancy-font'>
          <h1 className='groups-h1 m-0'>History: {groupData.groupName}</h1>
        </Col>
      </Row>
      <Row>
        <ListGroup className='w-100'>
          {historyEvents && historyEvents.length === 0 && <p className='text-center pt-3 text-light'>History is empty!</p>}
          {historyEvents && historyEvents.map((event, idx) => <HistoryItem event={event} key={idx} />)}
        </ListGroup>
      </Row>
    </Container>
  );
}
