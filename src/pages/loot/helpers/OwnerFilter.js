import React, { useRef, useContext, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import ModalParty from './ModalParty';
import ItemOwnerSelect from '../../common/ItemOwnerSelect';

export default function OwnerFilter({ itemOwners }) {
  const { setSortBy, sortBy } = useContext(GroupContext);

  const sortRef = useRef('');

  return (
    <Row className='mt-2'>
      <Col xs={10} className='pr-2'>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setSortBy(sortRef.current.value);
          }}
        >
          <ItemOwnerSelect itemOwners={itemOwners} setState={setSortBy} value={sortBy} />
        </Form>
      </Col>

      <Col xs={2} className='pl-0'>
        <ModalParty itemOwners={itemOwners} />
      </Col>
    </Row>
  );
}
