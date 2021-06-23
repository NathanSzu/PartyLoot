import React, { useEffect, useContext } from 'react';
import firebase from '../utils/firebase';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ModalAdd from '../components/BootModalAddGroup';
import ModalEdit from '../components/BootModalEditGroup';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function Groups() {
  const { currentUser, randomUsername, setGroupCode, setUsername, userRef } = useContext(AuthContext);
  const { setCurrentGroup } = useContext(GroupContext);
  const [sortedGroups, setSortedGroups] = useState([])

  const db = firebase.firestore();
  const groupRef = db.collection('groups')
  const query = groupRef.where('members', 'array-contains', `${currentUser.uid}`);
  const [groupList, loading] = useCollectionData(query, { idField: 'id' });

  // const [userData] = useDocumentData(userRef);

  useEffect(() => {
    groupList && setSortedGroups(defaultSort())
  }, [groupList])

  // useEffect(() => {
  //   console.log(userData)
  // }, [userData])

  useEffect(() => {
    console.log('currentUser: ', currentUser)
  }, [currentUser])

  const defaultSort = () => {
    let sorted = groupList.sort((a, b) => {
      return b.created - a.created;
    })
    return(sorted)
  }

  return (
    <>

      {loading && <Spinner animation="border" role="status" />}
      {sortedGroups.map((group, idx) => (
        <Row key={idx} className='p-0 border'>
          <Col className='p-0'>
            <Link to='/loot' >
              <Button id={group.id} variant='outline' className='w-100 text-left p-3 groups-h1' onClick={(e) => { setCurrentGroup(e.target.id) }}>
                {group.groupName}
              </Button>
            </Link>
          </Col>
          <Col xs='auto d-flex align-items-center'>
            <ModalEdit name={group.groupName} id={group.id} owner={group.owner} members={group.members} />
          </Col>
        </Row>
      ))}

      <Row className='justify-content-center border pt-2 pb-2'>
        <ModalAdd />
      </Row>
    </>
  )
}
