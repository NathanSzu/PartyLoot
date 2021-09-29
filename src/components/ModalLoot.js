import React, { useState, useContext, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import edit from '../assets/pencil-square.svg';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../utils/GroupContext';
import fb from 'firebase';
import firebase from '../utils/firebase';
import boxDown from '../assets/box-down.svg'
import DropdownAddItem from './DropdownAddItem';
import SearchOpen5E from './SearchOpen5E';

export default function ModalLoot({ item, idx }) {
    const { currentGroup, groupData } = useContext(GroupContext);

    const db = firebase.firestore();
    const itemRef = db.collection('groups').doc(`${currentGroup}`).collection('loot').doc(`${item.id}`);
    const groupRef = db.collection('groups').doc(currentGroup);

    const [show, setShow] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchSRD, setSearchSRD] = useState(false);
    const [SRDContent, setSRDContent] = useState({})

    const [partyData] = useDocumentData(groupRef);

    const nameRef = useRef();
    const descRef = useRef();
    const chargeRef = useRef();
    const chargesRef = useRef();
    const tagsRef = useRef();
    const ownerRef = useRef();

    const handleClose = () => {setShow(false); setSRDContent({}); setSearchSRD(false);}
    const handleShow = () => setShow(true);

    const addLoot = () => {
        if (!nameRef.current.value || !descRef.current.value) { return }
        if (ownerRef.current.value === 'Select Owner') { ownerRef.current.value = '' }
        setLoading(true);
        db.collection('groups').doc(`${currentGroup}`).collection('loot').add({
            itemName: nameRef.current.value,
            itemDesc: descRef.current.value,
            currCharges: chargeRef.current.value,
            maxCharges: chargesRef.current.value,
            itemTags: tagsRef.current.value,
            owner: ownerRef.current.value,
            created: fb.firestore.FieldValue.serverTimestamp()
        })
            .then((docRef) => {
                console.log("Item added: ");
                setLoading(false);
                handleClose();
            })
            .catch((error) => {
                console.error("Error creating new group: ", error);
                setLoading(false);
                handleClose();
            });
    }

    const editLoot = () => {
        // Does not call update function if the group name or description is left empty.
        if (!nameRef.current.value || !descRef.current.value) {
            handleClose();
            return
        }
        if (ownerRef.current.value === 'Select Owner') { ownerRef.current.value = '' }
        setLoading(true)
        itemRef.update({
            itemName: nameRef.current.value,
            itemDesc: descRef.current.value,
            currCharges: chargeRef.current.value,
            maxCharges: chargesRef.current.value,
            itemTags: tagsRef.current.value,
            owner: ownerRef.current.value
        })
            .then(() => {
                console.log('Item successfully updated!');
                handleClose();
                setLoading(false);
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error('Error updating item: ', error);
                handleClose();
                setLoading(false);
            });
    }

    const deleteItem = () => {
        setLoading(true);
        handleClose();
        itemRef.delete()
            .then(() => {
                setLoading(false);
                console.log('Item successfully deleted!');
            }).catch((error) => {
                setLoading(false);
                console.error('Error removing item: ', error);
            });
    }

    return (
        <>
            {item ? <Button variant='dark' className='p-1 m-0' onClick={handleShow}><img alt='Edit Item' src={edit}></img></Button>
                :
                <Button variant='dark' onClick={handleShow} className='w-100 m-0 mr-auto ml-auto'>Add Item</Button>}


            <Modal show={show} onHide={handleClose}>
                <Form className='texture-backer'>
                    <Modal.Header closeButton>
                        {item ? <Modal.Title>{`Edit ${item.itemName}`}</Modal.Title>
                            :
                            <Modal.Title>Add an item!</Modal.Title>}
                    </Modal.Header>

                    {searchSRD ? <SearchOpen5E setSearchSRD={setSearchSRD} setSRDContent={setSRDContent} /> :
                    <> 
                        <Modal.Body>
                            <Row>
                                {!item &&
                                <Col xs={2} className='pr-0'>
                                    <DropdownAddItem setSearchSRD={setSearchSRD} />
                                </Col>}
                                <Col>
                                    <Form.Group controlId='itemName'>
                                        <Form.Control ref={nameRef} defaultValue={item && item.itemName || SRDContent.name} type='text' placeholder='Item name' />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>

                                <Col xs={5}>
                                    <Form.Group controlId='itemCharge'>
                                        <Form.Control className='text-center' ref={chargeRef} defaultValue={item && item.currCharges} type='number' placeholder='Charge' />
                                    </Form.Group>
                                </Col>

                                <Col xs={2} className='d-flex align-items-center justify-content-center'>
                                    /
                                </Col>

                                <Col xs={5}>
                                    <Form.Group controlId='itemCharges'>
                                        <Form.Control className='text-center' ref={chargesRef} defaultValue={item && item.maxCharges} type='number' placeholder='Charges' />
                                    </Form.Group>
                                </Col>

                            </Row>


                            <Form.Group controlId='itemDesc'>
                                <Form.Control ref={descRef} as='textarea' rows={4} defaultValue={item && item.itemDesc || SRDContent.desc} placeholder='Item description' />
                            </Form.Group>

                            <Form.Group controlId='itemTags'>
                                <Form.Control ref={tagsRef} type='text' defaultValue={item && item.itemTags || SRDContent.type} placeholder='Enter searchable item tags here' />
                            </Form.Group>

                            <Form.Group controlId='itemOwner'>
                                <Form.Control as='select' defaultValue={item && item.owner} ref={ownerRef}>
                                    <option>Select Owner</option>
                                    {partyData && partyData.party && partyData.party.map((partyMember, idx) => (
                                        <option key={idx}>{partyMember}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                        </Modal.Body>


                        <Modal.Footer className='justify-content-between'>

                            {item ?
                                <Button as='input' disabled={loading} value='Save' variant='dark' type='submit' onClick={(e) => { e.preventDefault(); editLoot() }} />
                                :
                                <Button disabled={loading} variant='dark' type='submit' onClick={(e) => { e.preventDefault(); addLoot() }}>
                                    Create
                                </Button>}

                            {deleteConfirmation ?
                                <Button as='input' value={`Yes, I'm sure. Delete!`} disabled={loading} variant='danger' type='button' onClick={(e) => { e.preventDefault(); deleteItem() }} />
                                : null}

                            {!deleteConfirmation && item ?
                                <Button as='input' value='Delete' disabled={loading} variant='danger' type='button' onClick={(e) => { setDeleteConfirmation(true) }} />
                                : null}



                        </Modal.Footer>
                    </>}
                </Form>


            </Modal>

        </>
    )
}
