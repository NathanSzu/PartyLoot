import React, { useContext, useEffect } from 'react';
import { Row, Col, Container, Card } from 'react-bootstrap';
import { GroupContext } from '../../utils/contexts/GroupContext';
import metadata from '../../utils/metadata.json';
import AccountSettingsCard from './helpers/AccountSettingsCard';
import AppSupportCard from './helpers/AppSupportCard';
import ConfigurationCard from './helpers/ConfigurationsCard'

export default function Settings() {
  const { setCurrentGroup } = useContext(GroupContext);

  useEffect(() => {
    setCurrentGroup(' ');
  });

  return (
    <Row className='background-light rounded-bottom'>
      <AccountSettingsCard />
      <ConfigurationCard />
      <AppSupportCard />

      <Col lg={8} className='mx-auto p-2'>
        <Card>
          <Card.Body>
            Version: {metadata.buildMajor}.{metadata.buildMinor}.{metadata.buildRevision} {metadata.buildTag}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
