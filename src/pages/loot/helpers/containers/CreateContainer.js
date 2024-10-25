import React, { useState, useContext } from 'react';
import {
  Modal,
  Button,
  Form,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormLabel,
  FormControl,
  FormText,
  FormSelect,
  FormGroup,
  Alert
} from 'react-bootstrap';
import { GroupContext } from '../../../../utils/contexts/GroupContext';

export default function CreateContainer() {
  const { groupDoc } = useContext(GroupContext);
  const [show, setShow] = useState(false);
  const [containerData, setContainerData] = useState({
    type: '1',
  });
  const [validationMsg, setValidationMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContainerUpdate = (field, value) => {
    setContainerData({ ...containerData, [field]: value });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setValidationMsg(null);
    setLoading(false);
    setContainerData({ type: '1' });
    setShow(true);
  };

  const addContainer = () => {
    if (!containerData?.name) {
      setValidationMsg('Name cannot be empty');
      return;
    }
    setLoading(true);
    groupDoc
      .collection('containers')
      .add(containerData)
      .then(() => {
        handleClose();
        setLoading(false);
      });
  };

  return (
    <>
      <Button variant='dark' className='pt-1 background-dark w-100' onClick={handleShow}>
        <img alt='Add container' src='APPIcons/treasure-chest.svg' />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <ModalHeader closeButton>
          <Modal.Title>Create new container</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormGroup className='mb-3' controlId='formContainerName'>
              <FormLabel>Name</FormLabel>
              <FormControl
                type='text'
                placeholder='Enter container name (required)'
                onChange={(e) => handleContainerUpdate('name', e.target.value)}
              />
              <FormText className='text-muted'>Ex. locked chest, warhorse saddlebags, bag of holding</FormText>
            </FormGroup>

            <FormGroup className='mb-3' controlId='formContainerDescription'>
              <FormLabel>Description</FormLabel>
              <FormControl
                type='text'
                as='textarea'
                rows='3'
                placeholder='Additional details'
                onChange={(e) => handleContainerUpdate('description', e.target.value)}
              />
            </FormGroup>

            <FormGroup className='mb-3' controlId='formContainerType'>
              <FormLabel>Type</FormLabel>
              <FormSelect value={containerData.type} onChange={(e) => handleContainerUpdate('type', e.target.value)}>
                <option value='1'>Party storage</option>
              </FormSelect>
              {containerData.type === '1' && (
                <FormText className='text-muted'>
                  Party storage containers will automatically show on your loot list if you are the owner of any items
                  in the container
                </FormText>
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          {validationMsg && <Alert className='w-100' variant='danger'>{validationMsg}</Alert>}
          <Button disabled={loading} variant='dark' className='background-dark' onClick={addContainer}>
            Create
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
