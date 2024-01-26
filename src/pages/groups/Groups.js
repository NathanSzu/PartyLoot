import React, { useContext } from 'react';
import { Row, Col, Spinner, Container, Navbar } from 'react-bootstrap';
import { GroupContext } from '../../utils/contexts/GroupContext';
import AddGroup from './helpers/AddGroup';
import PatchNotes from './helpers/PatchNotes';
import GroupCard from './helpers/GroupCard';
import IntroCard from './helpers/IntroCard';

export default function Groups() {
  const { groupList } = useContext(GroupContext);

  return (
    <Row className='lazy-scroll-container'>
      <Navbar sticky='top' className='theme1-backer rounded-bottom mb-2' id='sticky-group-add'>
        <p className='fancy-font fs-md-deco text-light m-auto'>
          Tap <AddGroup /> to create a new group.
        </p>
      </Navbar>

      <Container>
        <Row>
          <PatchNotes />

          {!groupList ? (
            <Spinner
              as='div'
              className='d-flex mt-4 loading-spinner'
              animation='border'
              role='status'
              variant='light'
            />
          ) : (
            <>
              {
                <Col className='d-none top-0 d-lg-block mx-auto'>
                  <div className='py-3 position-fixed background-light rounded bs-fixed-col'>
                    <Container>
                      <Row>
                        <Col xs={4}>
                          <img src='/PWAIcons/PL_512.png' className='img-fluid rounded' alt='...' />
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </Col>
              }
              <Col>
                {groupList.length < 1 ? (
                  <IntroCard />
                ) : (
                  <>
                    {groupList.map((group, idx) => (
                      <GroupCard group={group} idx={idx} />
                    ))}
                  </>
                )}
              </Col>
            </>
          )}
        </Row>
      </Container>
    </Row>
  );
}
