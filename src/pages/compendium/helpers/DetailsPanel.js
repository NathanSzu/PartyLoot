import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import QuillDisplay from '../../common/QuillDisplay';
import CopyToGroupSection from './CopyToGroupSection';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { EditDiscoveryTrigger, EditDiscoverySection } from './RecordDiscovery';

export function DetailsPanel({ item, getCompendium }) {
  const { db, currentUser } = useContext(AuthContext);
  const { itemMetadata } = useContext(GlobalFeatures);

  const [creator, setCreator] = useState('');
  const [showEditTrigger, setShowEditTrigger] = useState(false);
  const [showEditSection, setShowEditSection] = useState(false);

  const getCreator = () => {
    db.collection('users')
      .doc(item.creatorId)
      .get()
      .then((doc) => {
        let data = doc.data();
        setCreator(data?.displayName);
      });
  };

  const handleShow = () => {
    setShowEditSection(false);
    item?.creatorId === currentUser.uid ? setShowEditTrigger(true) : setShowEditTrigger(false);
  };

  useEffect(() => {
    getCreator();
    setShowEditSection(false);
    item?.creatorId === currentUser.uid ? setShowEditTrigger(true) : setShowEditTrigger(false);
  }, [item]);

  return (
    <>
      <Col xs={3} className='text-end'>
        <Button
          className='h-100 background-dark'
          variant='dark'
          onClick={handleShow}
          data-bs-toggle='offcanvas'
          data-bs-target={`#canvas-${item.id}`}
          aria-controls={`canvas-${item.id}`}
        >
          View
        </Button>
      </Col>
      <div
        className='offcanvas offcanvas-start'
        data-bs-backdrop='static'
        tabIndex='-1'
        id={`canvas-${item.id}`}
        aria-labelledby='staticBackdropLabel'
      >
        <div className='offcanvas-header'>
          <h5 className='offcanvas-title fancy-font fs-md-deco' id='staticBackdropLabel'>
            {item?.itemName}
          </h5>
          <button type='button' className='btn-close' data-bs-dismiss='offcanvas' aria-label='Close'></button>
        </div>
        <div className='offcanvas-body'>
          {!showEditSection ? (
            <>
              <Row>
                <Col className='p-3 bg-secondary bg-gradient bg-opacity-25 shadow-sm rounded mb-4 mx-2'>
                  <QuillDisplay value={item?.itemDesc} />
                </Col>
              </Row>
              {showEditTrigger && !showEditSection && <EditDiscoveryTrigger setShow={setShowEditSection} />}
              <Row className='border-bottom pb-3'>
                <CopyToGroupSection item={item}/>
              </Row>
              <Row className='pt-3'>
                <Col className='border-end'>
                  <p className='m-0'>
                    Categories: <br />
                    {item.categories &&
                      item.categories.map((type) => (
                        <span key={type} className='badge rounded-pill background-dark me-1'>
                          {itemMetadata.categories[type]}
                        </span>
                      ))}
                  </p>
                </Col>
                <Col className='border-end'>
                  <p className='m-0'>
                    Setting: <br />
                    <span className='badge rounded-pill background-dark'>
                      {item.setting && itemMetadata?.settings?.[item?.setting].setting}
                    </span>
                  </p>
                </Col>
                <Col>
                  <p className='m-0'>
                    Author: <br />
                    <span className='badge rounded-pill background-dark'>{creator}</span>
                  </p>
                </Col>
              </Row>
            </>
          ) : (
            <EditDiscoverySection item={item} getCompendium={getCompendium} />
          )}
        </div>
      </div>
    </>
  );
}

export function OglDetailsPanel({ item }) {
  const { formatItemDescription } = useContext(GlobalFeatures);
  const itemDescFormatted = formatItemDescription(item);

  return (
    <>
      <Col xs={3} className='text-end'>
        <Button
          className='h-100 background-dark'
          variant='dark'
          data-bs-toggle='offcanvas'
          data-bs-target={`#canvas-${item.slug}`}
          aria-controls={`canvas-${item.slug}`}
        >
          View
        </Button>
      </Col>
      <div
        className='offcanvas offcanvas-start'
        data-bs-backdrop='static'
        tabIndex='-1'
        id={`canvas-${item.slug}`}
        aria-labelledby='staticBackdropLabel'
      >
        <div className='offcanvas-header'>
          <h5 className='offcanvas-title fancy-font fs-md-deco' id='staticBackdropLabel'>
            {item?.name}
          </h5>
          <button type='button' className='btn-close' data-bs-dismiss='offcanvas' aria-label='Close'></button>
        </div>
        <div className='offcanvas-body'>
          <Row>
            <Col className='p-3 bg-secondary bg-gradient bg-opacity-25 shadow-sm rounded mb-4 mx-2'>
              <QuillDisplay value={itemDescFormatted} />
            </Col>
          </Row>

          <Row>
            <Col className='pb-3'>
              <p className='m-0'>
                Source: <br />
                <span className='badge rounded-pill background-dark'>{item?.document__title}</span>
              </p>
            </Col>
          </Row>
          <CopyToGroupSection item={item}/>
        </div>
      </div>
    </>
  );
}

export const MemoizedPanel = React.memo(DetailsPanel);

export const MemoizedOglPanel = React.memo(OglDetailsPanel);
