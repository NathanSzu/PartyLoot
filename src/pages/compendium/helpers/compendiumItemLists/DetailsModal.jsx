import React, { useState } from 'react';
import { Button, Col, Row, Modal } from 'react-bootstrap';
import QuillDisplay from '../../../common/QuillDisplay';
import CopyToGroupSection from '../CopyToGroupSection';

export function CompendiumDetailsModal({ itemName, itemDesc, item }) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <Col>
        <Button
          className='background-dark w-100'
          variant='dark'
          onClick={handleShow}
          data-cy={`compendium-details-${itemName}`}
        >
          <img src='/APPIcons/eye-fill.svg' alt='View Icon' />
        </Button>
      </Col>
      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header closeButton className='border-bottom'>
          <Modal.Title className='fancy-font fs-md-deco'>{itemName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {item.document__title && (
            <Row className='text-start pb-3'>
              <span>
                Source:{' '}
                <a href={item.document__url} target='_blank' rel='noopener noreferrer'>
                  {item.document__title}
                </a>
              </span>
            </Row>
          )}
          <Row className='border-bottom'>
            <Col xs={12}>
              <QuillDisplay value={itemDesc} />
            </Col>
          </Row>

          <Row className='p-2'>
            <Col xs={6} sm={6} lg={4}>
              <div className='card mb-2'>
                <div className='card-body p-0 text-center'>
                  <h6 className='card-title text-white rounded-top py-1 bg-dark mb-0'>Type</h6>
                  <p className='card-text py-1'>{item.type}</p>
                </div>
              </div>
            </Col>
            <Col xs={6} sm={6} lg={4}>
              <div className='card mb-2'>
                <div className='card-body p-0 text-center'>
                  <h6 className='card-title text-white rounded-top py-1 bg-dark mb-0'>Rarity</h6>
                  <p className='card-text py-1'>{item.rarity}</p>
                </div>
              </div>
            </Col>
          </Row>
          <Row className='border-bottom pb-3'>
            <CopyToGroupSection itemName={itemName} itemDesc={itemDesc} item={item} handleClose={handleClose} />
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export const MemoizedModal = React.memo(CompendiumDetailsModal);
