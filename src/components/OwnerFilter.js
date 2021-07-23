import React, { useRef, useState, useContext, useEffect } from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from '../utils/firebase';
import { GroupContext } from '../utils/GroupContext';

export default function OwnerFilter({ setSortBy }) {
    const { currentGroup } = useContext(GroupContext);
    const sortRef = useRef('');
    const addPartyMemberRef = useRef('');

    const [show, setShow] = useState(false)

    const db = firebase.firestore();
    const groupRef = db.collection('groups').doc(currentGroup);

    const [groupData] = useDocumentData(groupRef)

    useEffect(() => {
        groupData && console.log('groupData', groupData)
    }, [groupData])

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
                        {groupData && groupData.party && groupData.party.map((partyMember, idx) => (
                            <option key={idx}>{partyMember}</option>
                        ))}
                    </Form.Control>
                </Form>
            </Col>

            <Col xs={2} className='pl-0'>
                <Button className='w-100' variant="dark" onClick={handleShow}>+</Button>

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
                                    <Button variant="dark" type='submit' onClick={handleClose}>+</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            </Col>

        </Row>

    )
}
