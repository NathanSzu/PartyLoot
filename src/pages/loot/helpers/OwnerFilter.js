import React, { useRef, useContext } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import ModalParty from './ModalParty';
import ItemOwnerSelect from '../../common/ItemOwnerSelect';

export default function OwnerFilter({ itemOwners }) {
  const { setSortBy, sortBy, currentGroup } = useContext(GroupContext);

  const sortRef = useRef('');

  return (
    <Row className='mt-2'>
      <Col xs={9} className='pe-0'>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setSortBy(sortRef.current.value);
          }}
        >
          <ItemOwnerSelect setSortBy={setSortBy} group={currentGroup} sortBy={sortBy} />
        </Form>
      </Col>

      <Col xs={3}>
        <ModalParty itemOwners={itemOwners} />
      </Col>
    </Row>
  );
}
