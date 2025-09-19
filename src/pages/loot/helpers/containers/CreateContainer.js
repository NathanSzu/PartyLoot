import { useState, useContext } from 'react';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormLabel,
  FormControl,
  FormText,
  FormSelect,
  FormGroup,
  Alert,
  ModalTitle,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { GroupContext } from '../../../../utils/contexts/GroupContext';

export default function CreateContainer() {
  const { groupDoc, partyStorageContainers, isGameMaster } = useContext(GroupContext);
  const [show, setShow] = useState(false);
  const [containerData, setContainerData] = useState({
    type: '1',
  });
  const [containerToEdit, setContainerToEdit] = useState(null);
  const [validationMsg, setValidationMsg] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContainerUpdate = (field, value) => {
    setContainerData({ ...containerData, [field]: value });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setContainerToEdit(null);
    setValidationMsg(null);
    setLoading(false);
    setContainerData({ type: '1' });
    setDeleteConfirmation(false);
    setShow(true);
  };

  const addContainer = () => {
    if (!containerData?.name) {
      setValidationMsg('Container name cannot be empty');
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

  const updateContainer = (containerData) => {
    setLoading(true);
    let tempContainerData = { ...containerData };
    delete tempContainerData.id;
    groupDoc
      .collection('containers')
      .doc(containerData.id)
      .set(tempContainerData, { merge: true })
      .then(() => {
        handleClose();
        setLoading(false);
      });
  };

  const deleteContainer = (id) => {
    setLoading(true);
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      setLoading(false);
    }
    if (deleteConfirmation) {
      groupDoc
        .collection('containers')
        .doc(id)
        .delete()
        .then(() => {
          handleClose();
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Button variant='dark' className='pt-1 background-dark w-100' onClick={handleShow} data-cy='container-modal'>
        <img alt='Add container' src='APPIcons/treasure-chest.svg' />
      </Button>

      <Modal show={show} onHide={handleClose} data-cy='create-container-form'>
        <ModalHeader closeButton>
          <ModalTitle>{containerToEdit ? `Edit: ${containerToEdit}` : 'Create new container'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormGroup className='mb-3' controlId='formContainerName'>
              <FormLabel>Name</FormLabel>
              <FormControl
                data-cy='container-name'
                type='text'
                placeholder='Enter container name (required)'
                value={containerData?.name || ''}
                onChange={(e) => handleContainerUpdate('name', e.target.value)}
              />
              <FormText className='text-muted'>Ex. locked chest, warhorse saddlebags, bag of holding</FormText>
            </FormGroup>

            <FormGroup className='mb-3' controlId='formContainerDescription'>
              <FormLabel>Description</FormLabel>
              <FormControl
                data-cy='container-description'
                type='text'
                as='textarea'
                rows='3'
                placeholder='Additional details'
                value={containerData?.description || ''}
                onChange={(e) => handleContainerUpdate('description', e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId='formContainerType'>
              <FormLabel>Type</FormLabel>
              <FormSelect value={containerData.type} onChange={(e) => handleContainerUpdate('type', e.target.value)}>
                <option value='1'>Party storage</option>
                {isGameMaster && <option value='2'>GM vault</option>}
              </FormSelect>
              {containerData.type === '1' && (
                <FormText className='text-muted'>
                  Party storage containers will automatically show on your loot list if you are the owner of any items
                  in the container
                </FormText>
              )}
              {containerData.type === '2' && (
                <FormText className='text-muted'>
                  GM vault containers are only visible to Game Masters and can be used to store hidden loot and rewards
                </FormText>
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalBody className='border-top text-end'>
          {validationMsg && (
            <Alert className='w-100' variant='danger'>
              {validationMsg}
            </Alert>
          )}
          {containerData?.id ? (
            <>
              <Button
                data-cy='delete-container'
                disabled={loading}
                className='me-2'
                variant={!deleteConfirmation ? 'outline-danger' : 'danger'}
                onClick={() => deleteContainer(containerData.id)}
              >
                {!deleteConfirmation ? 'Delete' : "I'm sure, delete!"}
              </Button>
              <Button data-cy='clear-container-fields' className='me-2' onClick={() => handleShow()}>
                Clear
              </Button>
              <Button
                data-cy='save-container-changes'
                disabled={loading}
                variant='dark'
                className='background-dark'
                onClick={() => updateContainer(containerData)}
              >
                Save changes
              </Button>
            </>
          ) : (
            <Button
              data-cy='create-container'
              disabled={loading}
              variant='dark'
              className='background-dark'
              onClick={addContainer}
            >
              Create container
            </Button>
          )}
        </ModalBody>
        {!containerData?.id && partyStorageContainers.length > 0 && (
          <ModalFooter>
            <ModalTitle className='w-100'>Existing containers</ModalTitle>

            <ListGroup className='w-100'>
              {partyStorageContainers?.map((container) => (
                <ListGroupItem key={container.id}>
                  <Row>
                    <Col className='align-self-center'>{container.name}</Col>
                    <Col xs={3} className='text-end'>
                      <Button
                        variant='dark'
                        className='background-dark'
                        onClick={() => {
                          setContainerData(container);
                          setContainerToEdit(container.name);
                        }}
                      >
                        <img alt='Edit Container' src='APPIcons/pencil-square.svg' />
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          </ModalFooter>
        )}
      </Modal>
    </>
  );
}
