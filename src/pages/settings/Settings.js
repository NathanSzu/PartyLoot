import React, { useContext, useEffect } from 'react';
import { Row, Col, Container, Card } from 'react-bootstrap';
import { GroupContext } from '../../utils/contexts/GroupContext';
import metadata from '../../utils/metadata.json';
import AccountSettingsCard from './helpers/AccountSettingsCard';
import AppSupportCard from './helpers/AppSupportCard';

export default function Settings() {
  const { setCurrentGroup } = useContext(GroupContext);

  useEffect(() => {
    setCurrentGroup(' ');
  });

  return (
    <Container className='lazy-scroll-container'>
      <Row className='pt-2'>
        <AccountSettingsCard />
      </Row>

      <Row className='py-2'>
        <AppSupportCard />
      </Row>
      <Row>
        <Col md={8} className='mx-auto'>
          <Card>
            <Card.Body>
              Version: {metadata.buildMajor}.{metadata.buildMinor}.{metadata.buildRevision} {metadata.buildTag}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
