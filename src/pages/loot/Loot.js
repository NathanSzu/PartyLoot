import React, { useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Navbar, Row, Col, Container, Button } from 'react-bootstrap';
import ModalLoot from './helpers/itemCRUD/CreateLootItem';
import CurrencyTracker from './helpers/currencyTracking/currencyTracker/CurrencyTracker';
import ItemSearch from './helpers/ItemSearch';
import OwnerFilter from './helpers/OwnerFilter';
import LootAccordion from './helpers/itemCRUD/LootWrapper';
import IntroCard from './helpers/IntroCard';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';
import CreateContainer from './helpers/containers/CreateContainer';

export default function Loot() {
  const { checkLocalStorage } = useContext(GlobalFeatures);

  return (
    <Row className='lazy-scroll-container'>
      <Navbar sticky='top' className='w-100 p-0' id='sticky-filter'>
        <div className='d-block w-100 mx-0 mb-2'>
          <Card className='rounded-top-0 background-light border-dark border-bottom-0 border-end-0 border-start-0'>
            <Card.Header className='p-0'>
              <CurrencyTracker />
            </Card.Header>
            <Card.Body>
              <Container>
                <ItemSearch />
                <OwnerFilter />
              </Container>
            </Card.Body>
            <Card.Footer className='d-flex'>
              <Container>
                <Row>
                  <Col xs={6}>
                    <ModalLoot />
                  </Col>
                  <Col className='ps-0'>
                    <CreateContainer  />
                  </Col>
                  <Col xs={3} className='ps-0'>
                    <LinkContainer to='/history' data-cy='button-history'>
                      <Button variant='dark' className='background-dark w-100'>
                        <img alt='History' src='APPIcons/clock-fill.svg' />
                      </Button>
                    </LinkContainer>
                  </Col>
                </Row>
              </Container>
            </Card.Footer>
          </Card>
        </div>
      </Navbar>
      <Container>
        <Row>
          <Col>
            {!checkLocalStorage('lootIntroCard') && <IntroCard />}
            <LootAccordion />
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
