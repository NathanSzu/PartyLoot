import React, { useRef, useState, useContext, useEffect } from 'react';
import { Form, Row, Col, Button, Modal, Container } from 'react-bootstrap';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from '../utils/firebase';
import { GroupContext } from '../utils/GroupContext';
import addUser from '../assets/add-user.svg';
import viewUsers from '../assets/view-users.svg';
import removeUser from '../assets/remove-user.svg';

export default function OwnerFilter({ setSortBy }) {
    const { currentGroup } = useContext(GroupContext);
    const sortRef = useRef('');
    const addPartyMemberRef = useRef('');
    const [loading, setLoading] = useState(false)

    const displayMembers = ['Dave', 'Allie']

    const [show, setShow] = useState(false)

    const db = firebase.firestore();
    const groupRef = db.collection('groups').doc(currentGroup);

    const [partyData] = useDocumentData(groupRef)

    useEffect(() => {
        partyData && console.log('partyData', partyData)
    }, [partyData])

    useEffect(() => {
        sortRef && console.log('sortRef', sortRef.current.value)
    }, [sortRef])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Row className='mt-2'>

            <Col xs={10}>
                <Form onSubmit={(e) => { e.preventDefault(); setSortBy(sortRef.current.value); }}>
                    <Form.Control as='select' ref={sortRef} onChange={() => { setSortBy(sortRef.current.value); }}>
                        <option>All</option>
                        {partyData && partyData.party && partyData.party.map((partyMember, idx) => (
                            <option key={idx}>{partyMember}</option>
                        ))}
                    </Form.Control>
                </Form>
            </Col>

            <Col xs={2} className='pl-0'>
                <Button className='w-100 pl-0 pr-0' variant="dark" onClick={handleShow}><img alt='Edit Party' src={viewUsers} /></Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Party Members</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => { e.preventDefault() }}>
                            <Row>
                                <Col xs={10}>
                                    <Form.Control type='input' ref={addPartyMemberRef}></Form.Control>
                                </Col>
                                <Col xs={2} className='pl-1'>
                                    <Button variant="dark" type='submit' onClick={handleClose}><img alt='Add Party Member' src={addUser} /></Button>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        {partyData && partyData.party && partyData.party.map((member, idx) => (
                            <Container key={idx}>
                                <Row className='p-0'>
                                    <Col>
                                        {member}
                                    </Col>
                                    <Col xs='auto' className='p-0'>
                                        <Button disabled={loading} variant='danger' type='button' onClick={(e) => { }}>
                                            <img alt='Delete Group' src={removeUser}></img>
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        ))}
                    </Modal.Footer>

                </Modal>
            </Col>

        </Row>

    )
}
