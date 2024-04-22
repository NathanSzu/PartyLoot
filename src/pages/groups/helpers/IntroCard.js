import React, { useContext, useState } from 'react';
import { Row, Col, Button, CloseButton, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';

export default function IntroCard() {
  const navigate = useNavigate();

  const [dismiss, setDismiss] = useState(false);

  const { checkLocalStorage } = useContext(GlobalFeatures);

  return (
    <div className={`mx-1 mb-2 ${dismiss && 'd-none'}`}>
      <div className='modal intro-modal show top-layer' style={{ display: 'block', position: 'initial' }}>
        <Modal.Dialog className='m-0'>
          <Modal.Header>
            <Modal.Title className='fancy-font fs-md-deco'>Welcome Adventurer!</Modal.Title>
            <CloseButton
              onClick={() => {
                checkLocalStorage('groupIntroCard', true);
                setDismiss(true);
              }}
            />
          </Modal.Header>

          <Modal.Body>
            <p className='m-0'>
              Create a new group using the "+" button above, or share your party code with your friends to join an
              existing crew.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Row>
              <Col xs={8} className='p-0'>
                You can view your group code from the settings page.
              </Col>
              <Col className='d-flex align-items-center p-0'>
                <Button className='background-dark w-100' variant='dark' onClick={() => navigate('/settings')}>
                  Settings
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    </div>
  );
}
