import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Offcanvas, Row } from 'react-bootstrap';
import QuillDisplay from '../common/QuillDisplay';
import { AuthContext } from '../../utils/contexts/AuthContext';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';

export function DetailsPanelTrigger({ item, setShow, setItem }) {
  const show = () => {
    setItem(item);
    setShow(true);
  };

  return (
    <Col xs={3} className='text-end'>
      <Button className='h-100 background-dark' variant='dark' onClick={show}>
        View
      </Button>
    </Col>
  );
}

export const MemoizedPanelTrigger = React.memo(DetailsPanelTrigger);

export function DetailsPanelDisplay({ show, setShow, item }) {
  const { db } = useContext(AuthContext);
  const { itemMetadata } = useContext(GlobalFeatures);

  const [creator, setCreator] = useState('');
  const [loading, setLoading] = useState(true);

  const getCreator = () => {
    setLoading(true);
    db.collection('users')
      .doc(item.creatorId)
      .get()
      .then((doc) => {
        let data = doc.data();
        setCreator(data?.displayName);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCreator();
  }, [item]);

  return (
    <Offcanvas show={show} onHide={() => setShow(false)}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{item?.itemName}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row>
          <Col className='bg-secondary bg-gradient bg-opacity-25 shadow-sm rounded mb-4 mx-1'>
            <QuillDisplay className='p-0' value={item?.itemDesc} />
          </Col>
        </Row>
        <Row>
          <Col className='border-end'>
            <p className='m-0'>
              Types: <br />
              {item.category &&
                item.category.map((type) => (
                  <span key={type} class='badge rounded-pill background-dark me-1'>
                    {itemMetadata.categories[type]}
                  </span>
                ))}
            </p>
          </Col>
          <Col className='border-end'>
            <p className='m-0'>
              Setting: <br />
              <span class='badge rounded-pill background-dark'>
                {item.setting && itemMetadata?.settings?.[item?.setting].setting}
              </span>
            </p>
          </Col>
          <Col>
            <p className='m-0'>
              Author: <br />
              <span class='badge rounded-pill background-dark'>{creator}</span>
            </p>
          </Col>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
