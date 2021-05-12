import React, { useEffect, useContext, useRef, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import BootModalAddLoot from '../components/BootModalAddLoot';
import firebase from '../utils/firebase';

export default function Loot() {
  const [loading, setLoading] = useState(false)
  const { currentUser } = useContext(AuthContext);
  const { currentGroup, setCurrentGroup } = useContext(GroupContext);
  const itemRef = useRef(null)

  const db = firebase.firestore();
  const lootRef = firebase.firestore().collection('groups').doc(currentGroup).collection('loot');
  const query = lootRef.orderBy('created');
  const [lootItems] = useCollectionData(query);

  useEffect(() => {

    console.log('currentUser: ', currentUser)
    console.log('currentGroup: ', currentGroup)
  }, [])

  const test = () => {
    console.log('lootItems: ', lootItems)
  }

  return (
    <>
      {lootItems && lootItems.map((item) => {
        <>
          hello
          <p>{item.id}</p>
          <p>{item.itemDesc}</p>
        </>
      })}
      <Row className='justify-content-center'>
        <BootModalAddLoot currentUser={currentUser} currentGroup={currentGroup} />
      </Row>
      <button onClick={test}>test</button>
    </>
  )
}
