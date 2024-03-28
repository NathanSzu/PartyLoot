import React, { useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, ListGroup, Button, Navbar } from 'react-bootstrap';
import { GroupContext } from '../../utils/contexts/GroupContext';
import HistoryItem from './helpers/HistoryItem';

export default function History() {
  const { groupData } = useContext(GroupContext);

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
          {groupData?.history.length < 1 && <p className='text-center pt-3 text-light'>History is empty!</p>}
          {groupData?.history.map((event, idx) => <HistoryItem event={event} key={idx} />)}
        </ListGroup>
      </Col>
    </Row>
  );
}
