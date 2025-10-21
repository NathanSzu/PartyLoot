import { useState, useContext, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function AddGroup() {
  const { currentUser } = useContext(AuthContext);
  const { setCurrentGroup } = useContext(GroupContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();

  const addGroup = async () => {
    if (!nameRef.current.value) {
      return;
    }
    
    setLoading(true);
    
    try {
      const groupsRef = collection(db, 'groups');
      const docRef = await addDoc(groupsRef, {
        groupName: nameRef.current.value,
        owner: currentUser.uid,
        members: [currentUser.uid],
        gameMasters: [currentUser.uid],
        created: serverTimestamp(),
      });
      
      // Optionally set the new group as current
      setCurrentGroup(docRef.id);
      
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error('Error creating new group: ', error);
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Button variant='light' onClick={handleShow} className='m-2' data-cy='create-group'>
        +
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Form className='rounded' onSubmitCapture={(e) => e.preventDefault()}>
          <Modal.Header closeButton>
            <Modal.Title>Start a new group!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId='groupName'>
              <Form.Control ref={nameRef} type='text' placeholder='Group name' data-cy='new-group-name' />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button disabled={loading} variant='dark' type='button' onClick={() => addGroup()}>
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
