import React, { useEffect, useContext } from 'react';
import firebase from '../utils/firebase';
import { Row, Col, Button } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { useState } from 'react';

export default function Groups() {
  const { currentUser } = useContext(AuthContext)
  const [userGroups, setUserGroups] = useState([])

  const db = firebase.firestore();

  useEffect(() => {
    db.collection('users').doc(`${currentUser.uid}`)
      .get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          let groupData = doc.data().groups
          console.log("group data: ", doc.data().groups)
          let pushData = []

          for (let i = 0; i < groupData.length; i++) {
            let docRef = db.collection('groups').doc(groupData[i])

            docRef.get().then((doc) => {
              if (doc.exists) {
                // console.log("Document data:", doc.data());
                let docData = doc.data()
                pushData.push(docData)
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
              setUserGroups(pushData)
            }).catch((error) => { console.log("Error getting document:", error) });

          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [])

  return (
    <>
      <Row>
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
        <Col xs='3' md='2'>
          <Button variant='dark' type='button' className='w-100'>+</Button>
        </Col>
      </Row>
    </>
  )
}
