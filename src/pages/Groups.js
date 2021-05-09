import React, { useEffect, useContext } from 'react';
import firebase from '../utils/firebase';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import { useState } from 'react';
import BootModalAddGroup from '../components/BootModalAddGroup';
import BootModalEditGroup from '../components/BootModalEditGroup';

export default function Groups() {
  const { currentUser } = useContext(AuthContext);
  const { currentGroup, setCurrentGroup } = useContext(GroupContext);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const db = firebase.firestore();

  const updateDisplay = () => {
    if (update === false) {
      setUpdate(true);
    } else {
      setUpdate(false);
    }
  }



  const retrieveGroups = () => {
    db.collection('groups').where('members', 'array-contains', `${currentUser.uid}`).get()
      .then((querySnapshot) => {
        let groups = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          groups.push({
            id: doc.id,
            data: doc.data()
          });
        });
        groups.sort((a, b) => {
          return b.data.created - a.data.created;
        })
        setUserGroups(groups)
        setLoading(false)
        console.log('usergroups: ', groups)
      })
      .catch((error) => {
        console.log("Error getting groups: ", error);
      });
  }

  useEffect(() => {
    console.log(currentUser)
    retrieveGroups();
  }, [update])

  return (
    <>

      {loading && <Alert variant={'dark'}>Loading groups...</Alert>}
      {userGroups.map((group, idx) => (
        <Row key={idx} className='p-2'>
          <Col>
            <Button id={group.id} variant='outline-dark' className='w-100 text-left' onClick={(e) => {setCurrentGroup(e.target.id)}}>
              {group.data.groupName}
            </Button>
          </Col>
          <Col xs='auto'>
            {/* <Button variant='dark' className='p-1'><img src={gear} fill='white'></img></Button> */}
            <BootModalEditGroup name={group.data.groupName} id={group.id} owner={group.data.owner} members={group.data.members} />
          </Col>
        </Row>
      ))}


      <Row className='justify-content-center'>
        <BootModalAddGroup updateDisplay={updateDisplay} />
      </Row>
    </>
  )
}
