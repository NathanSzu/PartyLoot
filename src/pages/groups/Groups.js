import React, { useContext } from 'react';
import { Row, Col, Button, Spinner, Container, Navbar } from 'react-bootstrap';
import { GroupContext } from '../../utils/contexts/GroupContext';
import AddGroup from './helpers/AddGroup';
import EditGroup from './helpers/EditGroup';
import PatchNotes from './helpers/PatchNotes';
import { useNavigate } from 'react-router-dom';

export default function Groups() {
  const { setCurrentGroup, groupList } = useContext(GroupContext);

  const navigate = useNavigate();

  const handleSelectGroup = (groupId) => {
    setCurrentGroup(groupId);
    navigate('/loot');
  };

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
              {groupList.map((group, idx) => (
                <Col key={idx} lg={6}>
                  <Row className='border-top border-dark background-light mx-1 rounded h-100'>
                    <Col className='groups-overflow px-3 py-2'>{group.groupName}</Col>
                    <Col xs={3} className='auto d-flex align-items-center'>
                      <div className='vstack gap-1 col-md-5 mx-auto my-2'>
                        <EditGroup name={group.groupName} id={group.id} owner={group.owner} members={group.members} />
                        <Button
                          id={group.id}
                          onClick={(e) => {
                            handleSelectGroup(e.target.id);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              ))}
            </>
          )}
        </Row>
      </Container>
    </Row>
  );
}
