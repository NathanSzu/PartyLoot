import React, { useEffect, useContext } from 'react';
import firebase from '../utils/firebase';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { useState } from 'react';
import BootModalAddGroup from '../components/BootModalAddGroup';
import gear from '../assets/gear-fill.svg'

export default function Groups() {
  const { currentUser } = useContext(AuthContext)
  const [userGroups, setUserGroups] = useState([])
  const [loading, setLoading] = useState(true)

  const db = firebase.firestore();

  useEffect(() => {
    db.collection('groups').where('members', 'array-contains', `${currentUser.uid}`).get()
      .then((querySnapshot) => {
        let groups = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          groups.push(doc.data());
        });
        setUserGroups(groups)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Error getting groups: ", error);
      });
  }, [])

  return (
    <>

      {loading && <Alert variant={'dark'}>Loading groups...</Alert>}
      {userGroups.map((group, idx) => (
        <Row key={idx} className='p-2'>
          <Col>
            {group.groupName}
          </Col>
          <Col xs='auto'>
            <Button variant='dark' className='p-1'><img src={gear} fill='white'></img></Button>
          </Col>
        </Row>
      ))}


      <Row className='justify-content-center'>
        <BootModalAddGroup />
      </Row>
    </>
  )
}
