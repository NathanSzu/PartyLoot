import React, { useRef, useState, useContext } from 'react';
import { Form, Row, Col, Button, Modal, Container } from 'react-bootstrap';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from '../utils/firebase';
import { GroupContext } from '../utils/contexts/GroupContext';
import addUser from '../assets/add-user.svg';
import viewUsers from '../assets/view-users.svg';
import removeUser from '../assets/remove-user.svg';
import fb from 'firebase';

export default function OwnerFilter() {
    const { currentGroup, setSortBy } = useContext(GroupContext);
    
    const sortRef = useRef('');
    const addPartyMemberRef = useRef('');

    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)

    const db = firebase.firestore();
    const groupRef = db.collection('groups').doc(currentGroup);

    const [partyData] = useDocumentData(groupRef)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addPartyMember = () => {
        if (!addPartyMemberRef.current.value) {
            console.log('Enter a name first')
            return
        }
        setLoading(true)
        groupRef.update({
            'party': fb.firestore.FieldValue.arrayUnion(addPartyMemberRef.current.value.trim())
        }).then(() => {
            addPartyMemberRef.current.value = ''
            setLoading(false)
        }).catch((err) => {
            console.log(err.code);
            console.log(err.message)
        })
    }

    const removePartyMember = (partyMember) => {
        setLoading(true)
        groupRef.update({
            'party': fb.firestore.FieldValue.arrayRemove(partyMember)
        }).then(() => {
            setLoading(false)
        }).catch((err) => {
            console.log(err.code);
            console.log(err.message)
        })
    }

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
                <Button className='w-100 pl-0 pr-0 background-dark border-0' variant="dark" onClick={handleShow}><img alt='Edit Party' src={viewUsers} /></Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Party Members</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Form onSubmit={(e) => { e.preventDefault() }}>
                                <Row>
                                    <Col className='pl-0' xs={10}>
                                        <Form.Control type='input' placeholder='Add Party Members' ref={addPartyMemberRef}></Form.Control>
                                    </Col>
                                    <Col className='pl-2' xs={2}>
                                        <Button disabled={loading} variant="dark" type='submit' onClick={addPartyMember}>
                                            <img alt='Add Party Member' src={addUser} />
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Container>
                    </Modal.Body>

                    <Modal.Footer>
                        {partyData && partyData.party && partyData.party.map((member, idx) => (
                            <Container key={idx}>
                                <Row>
                                    <Col className='pl-0' xs={10}>
                                        {member}
                                    </Col>
                                    <Col className='pl-2' xs={2}>
                                        <Button disabled={loading} variant='danger' type='button' onClick={(e) => { removePartyMember(member) }}>
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
