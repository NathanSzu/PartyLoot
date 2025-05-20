import { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { DiscoveryForm } from './DiscoveryForm';

export function DiscoveryFormWrapper({ item, setQueryParams }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Col>
        {item ? (
          <Button variant='primary' data-cy={`open-edit-discovery-${item.itemName}`} className='w-100' onClick={handleOpenModal}>
            <img src='APPIcons/pencil-square.svg' alt='Edit' style={{ width: '1em', height: '1em' }} />
          </Button>
        ) : (
          <Button variant='success' data-cy='open-add-discovery' className='background-success' onClick={handleOpenModal}>
            Record a new discovery
          </Button>
        )}
      </Col>
      <DiscoveryForm item={item} showModal={showModal} handleCloseModal={handleCloseModal} setQueryParams={setQueryParams} />
    </>
  );
}
