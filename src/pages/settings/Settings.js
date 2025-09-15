import { Row, Col, Card } from 'react-bootstrap';
import metadata from '../../utils/metadata.json';
import AccountSettingsCard from './helpers/AccountSettingsCard';
import AppSupportCard from './helpers/AppSupportCard';
import ConfigurationCard from './helpers/ConfigurationsCard'

export default function Settings() {

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
