import React, { useEffect, useContext } from 'react';
import firebase from '../utils/firebase';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { useState } from 'react';
import BootModalAddGroup from '../components/BootModalAddGroup'

export default function Groups() {
  const { currentUser } = useContext(AuthContext)
  const [userGroups, setUserGroups] = useState([])
  const [loading, setLoading] = useState(true)

  const db = firebase.firestore();

  useEffect(() => {
    console.log(currentUser)
    db.collection('users').doc(`${currentUser.uid}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let groupIDS = doc.data().groups
          console.log("group data: ", doc.data().groups)
          let pushData = [];

          for (let i = 0; i < groupIDS.length; i++) {
            let docRef = db.collection('groups').doc(groupIDS[i])

            docRef.get().then((doc) => {
              if (doc.exists) {
                // console.log("Document data:", doc.data());
                pushData.push(doc.data())
                console.log(doc.data())
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
              
              setUserGroups(pushData)
              
            }).catch((error) => { console.log("Error getting document:", error) });
          }
          console.log('pushData: ', pushData)

        } else {
          // doc.data() will be undefined in this case
          console.log("Tap '+' to create a new group!");
        }
        setLoading(false)
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [])

  return (
    <>
      <Row>
        {loading && <Alert variant={'dark'}>Loading groups...</Alert>}
        {userGroups.map((group) => (
          <div key={userGroups.keys()}>
            <Col>
              {group.groupName}
            </Col>
            <Col xs='3'>
            </Col>
          </div>
        ))}
      </Row>

      <Row className='justify-content-center'>
        <BootModalAddGroup />
      </Row>
    </>
  )
}
