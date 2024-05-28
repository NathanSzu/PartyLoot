import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';

export default function ConfigurationCard() {
  const tutorialCards = ['groupIntroCard', 'lootIntroCard'];
  const configurationKeys = [{ key: 'lootValueEnabled', label: 'Enable loot values in currency tracker' }];
  const { clearLocalStorageItems, checkLocalStorage } = useContext(GlobalFeatures);

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
    lootValueEnabled: checkLocalStorage('lootValueEnabled'),
  });

  const handleUpdateConfigs = (config, value) => {
    setConfigurations({ ...configurations, [config]: value });
  };

  const handleTutorialReset = (e) => {
    handleUpdateConfigs('tutorialEnabled', e.target.checked);
    if (e.target.checked) {
      clearLocalStorageItems(tutorialCards);
    } else {
      tutorialCards.forEach((messageKey) => {
        checkLocalStorage(messageKey, true);
      });
    }
  };

  const handleSettingSelection = (e, settingId) => {
    if (e.target.checked) {
      checkLocalStorage(settingId, true);
    } else {
      clearLocalStorageItems([settingId]);
    }
    handleUpdateConfigs(settingId, e.target.checked);
  };

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
                <Form.Label htmlFor='tutorialEnabled'>Enable tutorial messages</Form.Label>
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

          {configurationKeys.map((config) => (
            <Card.Text key={config.key} className='border-bottom'>
              <Row>
                <Col>
                  <Form.Label htmlFor={config.key}>{config.label}</Form.Label>
                </Col>
                <Col xs={2}>
                  <Form.Check
                    className='text-end'
                    id={config.key}
                    checked={configurations[config.key]}
                    onChange={(e) => {
                      handleSettingSelection(e, config.key);
                    }}
                  />
                </Col>
              </Row>
            </Card.Text>
          ))}
        </Card.Body>
      </Card>
    </Col>
  );
}
