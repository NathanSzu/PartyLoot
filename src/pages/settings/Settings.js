import React, { useContext, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
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
      <Row className='background-unset add-background-light border-top border-dark'>
        <AccountSettingsCard />
      </Row>

      <Row className='background-unset add-background-light'>
        <AppSupportCard />
      </Row>
      <Row>
        <Col className='text-right p-3'>
          Version: {metadata.buildMajor}.{metadata.buildMinor}.{metadata.buildRevision} {metadata.buildTag}
        </Col>
      </Row>
    </Container>
  );
}
