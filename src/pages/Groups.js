import React, { useEffect, useContext } from 'react';
import firebase from '../utils/firebase';
import { Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ModalAdd from '../components/ModalAddGroup';
import ModalEdit from '../components/ModalEditGroup';


export default function Groups() {
  const { currentUser, setUsername, setGroupCode, randomUsername } = useContext(AuthContext);
  const { setCurrentGroup } = useContext(GroupContext);
  const [sortedGroups, setSortedGroups] = useState([])

  const db = firebase.firestore();
  const groupRef = db.collection('groups')
  const query = groupRef.where('members', 'array-contains', `${currentUser.uid}`);
  const userRef = db.collection('users').doc(currentUser.uid);
  const [groupList, loading] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    groupList && setSortedGroups(defaultSort())
  }, [groupList])

  useEffect(() => {
    userRef.get()
      .then((doc) => {
        if (doc.exists) {
          // console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          setUsername(currentUser.displayName || randomUsername())
          setGroupCode()
        }

      }).catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [])

  const defaultSort = () => {
    let sorted = groupList.sort((a, b) => {
      return b.created - a.created;
    })
    return (sorted)
  }

  return (
    <>

      {loading && <Spinner animation="border" role="status" />}
      {!loading && groupList.length === 0 && <Alert variant='dark' className='text-center'> Click '+' to create a new group!</Alert>}
      {sortedGroups.map((group, idx) => (
        <Row key={idx} className='p-0 mt-1 texture-backer'>
          <Col className='p-0'>
            <Link to='/loot' >
              <Button id={group.id} variant='outline' className='w-100 text-left p-3 groups-h1 fancy-font' onClick={(e) => { setCurrentGroup(e.target.id) }}>
                {group.groupName}
              </Button>
            </Link>
          </Col>
          <Col xs='auto d-flex align-items-center'>
            <ModalEdit name={group.groupName} id={group.id} owner={group.owner} members={group.members} />
          </Col>
        </Row>
      ))}

      <Row className='justify-content-center border-0 pt-1 pb-2 clear-background'>
        <ModalAdd />
      </Row>
    </>
  )
}
