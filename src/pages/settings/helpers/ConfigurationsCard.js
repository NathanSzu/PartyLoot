import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';

export default function ConfigurationCard() {
  const tutorialCards = ['groupIntroCard', 'lootIntroCard'];
  const { setToastContent, setToastHeader, toggleShowToast, clearLocalStorageItems, checkLocalStorage } =
    useContext(GlobalFeatures);

  const checkTutorialsEnabled = (messages) => {
    let tutorialsEnabled = true;
    messages.forEach((messageKey) => {
      if (checkLocalStorage(messageKey)) {
        tutorialsEnabled = false;
      }
    });
    return tutorialsEnabled;
  };

  const [configurations, setConfigurations] = useState({
    tutorialEnabled: checkTutorialsEnabled(tutorialCards),
  });

  const handleUpdateConfigs = (config, value) => {
    setConfigurations({ ...configurations, [config]: value });
  };

  const handleTutorialReset = (e) => {
    handleUpdateConfigs('tutorialEnabled', e.target.checked);
    if (e.target.checked) {
      clearLocalStorageItems(tutorialCards);
      setToastHeader('Tutorial reset complete');
      setToastContent('All tutorial messages have been reset and should appear in the application.');
      toggleShowToast();
    } else {
      tutorialCards.forEach((messageKey) => {
        checkLocalStorage(messageKey, true);
      });
    }
  };

  useEffect(() => {
    console.log(configurations);
  }, [configurations]);

  return (
    <Col lg={8} className='mx-auto pt-2'>
      <Card>
        <Card.Header>
          <h1 className='text-center fancy-font fs-md-deco m-0'>Configurations</h1>
        </Card.Header>
        <Card.Body>
          <Card.Text className='border-bottom'>
            <Row>
              <Col>
                <Form.Label for='tutorialEnabled'>Enable tutorial messages</Form.Label>
              </Col>
              <Col xs={2}>
                <Form.Check
                  className='text-end'
                  id='tutorialEnabled'
                  checked={configurations.tutorialEnabled}
                  onChange={(e) => {
                    handleTutorialReset(e);
                  }}
                />
              </Col>
            </Row>
          </Card.Text>

          <Col md={8} className='mx-auto mt-2'>
            <Button
              className='w-100 background-dark border-0'
              variant='dark'
              onClick={(e) => {
                e.preventDefault();
                handleTutorialReset(e);
              }}
            >
              Enable Tutorials
            </Button>
          </Col>
        </Card.Body>
      </Card>
    </Col>
  );
}
