import React, { useEffect, useContext, useRef, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import firebase from '../utils/firebase';

export default function Loot() {
  const [loading, setLoading] = useState(false)
  const { currentUser } = useContext(AuthContext);
  const { currentGroup, setCurrentGroup } = useContext(GroupContext);
  const itemRef = useRef(null)

  useEffect(() => {
    console.log('currentUser: ', currentUser)
    console.log('currentGroup: ', currentGroup)
  }, [])

  const addItem = () => {

  }

  return (
    <>
      <Row className='p-2'>
        <Col>
          <Form.Group controlId='addMember'>
            <Form.Control ref={itemRef} type='text' placeholder='Enter group code' />
          </Form.Group>
        </Col>

        <Col xs='auto'>
          <Button disabled={loading} variant='dark' type='submit' onClick={(e) => { e.preventDefault(); addItem() }}>
            +
          </Button>
        </Col>
      </Row>
    </>
  )
}
