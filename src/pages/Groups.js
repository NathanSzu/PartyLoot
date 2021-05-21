import React, { useEffect, useContext } from 'react';
import firebase from '../utils/firebase';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCollectionData, useCollection } from 'react-firebase-hooks/firestore';
import ModalAdd from '../components/BootModalAddGroup';
import ModalEdit from '../components/BootModalEditGroup';

export default function Groups() {
  const { currentUser } = useContext(AuthContext);
  const { currentGroup, setCurrentGroup } = useContext(GroupContext);
  const [userGroups, setUserGroups] = useState([]);
  const [update, setUpdate] = useState(false);
  const [sortedGroups, setSortedGroups] = useState([])

  const db = firebase.firestore();
  const groupRef = db.collection('groups')
  const query = groupRef.where('members', 'array-contains', `${currentUser.uid}`);
  const [groupList, loading, error] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    groupList && setSortedGroups(defaultSort())
    error && console.log('Group load error: ', error)
  }, [groupList])

  const defaultSort = () => {
    let sorted = groupList.sort((a, b) => {
      return b.created - a.created;
    })
    return(sorted)
  }

  return (
    <>

      {loading && <Alert variant={'dark'}>Loading groups...</Alert>}
      {sortedGroups.map((group, idx) => (
        <Row key={idx} className='p-2'>
          <Col>
            <Link to='/loot' >
              <Button id={group.id} variant='outline-dark' className='w-100 text-left' onClick={(e) => { setCurrentGroup(e.target.id) }}>
                {group.groupName}
              </Button>
            </Link>
          </Col>
          <Col xs='auto'>
            {/* <Button variant='dark' className='p-1'><img src={gear} fill='white'></img></Button> */}
            <ModalEdit name={group.groupName} id={group.id} owner={group.owner} members={group.members} />
          </Col>
        </Row>
      ))}

      <Row className='justify-content-center'>
        <ModalAdd />
      </Row>
    </>
  )
}
