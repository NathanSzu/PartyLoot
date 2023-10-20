import React, { useEffect, useContext } from 'react';
import { Row, Col, Button, Spinner, Container, Navbar } from 'react-bootstrap';
import { AuthContext } from '../../utils/contexts/AuthContext';
import { GroupContext } from '../../utils/contexts/GroupContext';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import AddGroup from './helpers/AddGroup';
import EditGroup from './helpers/EditGroup';
import PatchNotes from './helpers/PatchNotes';
import { LinkContainer } from 'react-router-bootstrap';

export default function Groups() {
  const { currentUser, setUsername, setGroupCode, randomUsername, db } = useContext(AuthContext);
  const { setCurrentGroup, groups } = useContext(GroupContext);
  const [sortedGroups, setSortedGroups] = useState([]);

  const query = groups.where('members', 'array-contains', `${currentUser.uid}`);
  const userRef = db.collection('users').doc(currentUser.uid);
  const [groupList, loading] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    setCurrentGroup(' ');
    groupList &&
      setSortedGroups(() => {
        let sorted = groupList.sort((a, b) => {
          return b.created - a.created;
        });
        return sorted;
      });
  }, [groupList]);

  useEffect(() => {
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Do nothing unless missing data
          if (!doc.data().displayName) setUsername(currentUser.displayName || randomUsername());
          if (!doc.data().code) setGroupCode();
        } else {
          setUsername(currentUser.displayName || randomUsername());
          setGroupCode();
        }
      })
      .catch((error) => {
        console.error('Error getting document:', error);
      });
  }, [currentUser]);

  return (
    <Container className='lazy-scroll-container'>
      <PatchNotes />

      <Navbar sticky='top' className='theme1-backer rounded my-2' id='sticky-group-add'>
        <Col>
          <p className='text-center fancy-font fs-md-deco text-light m-0'>
            Tap <AddGroup /> to create a new group.
          </p>
        </Col>
      </Navbar>

      {loading ? (
        <Spinner as='div' className='d-flex mt-4 loading-spinner' animation='border' role='status' variant='light' />
      ) : (
        <>
          {sortedGroups.map((group, idx) => (
            <Row key={idx} className='border-top border-dark background-light mx-1 rounded'>
              <Col className='groups-overflow px-3 py-2'>
                <LinkContainer to='/loot' className='p-0'>
                  <Button
                    id={group.id}
                    data-cy={`group${idx}`}
                    variant='outline'
                    className='w-100 text-start fs-md-deco fancy-font border-0'
                    onClick={(e) => {
                      setCurrentGroup(e.target.id);
                    }}
                  >
                    {group.groupName}
                  </Button>
                </LinkContainer>
              </Col>
              <Col xs='auto d-flex align-items-center'>
                <EditGroup name={group.groupName} id={group.id} owner={group.owner} members={group.members} />
              </Col>
            </Row>
          ))}
        </>
      )}
    </Container>
  );
}
