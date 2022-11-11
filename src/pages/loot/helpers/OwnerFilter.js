import React, { useRef, useContext, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import ModalParty from '../../../components/ModalParty';

export default function OwnerFilter({ partyData }) {
  const { setSortBy } = useContext(GroupContext);

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
          <Form.Control
            as='select'
            ref={sortRef}
            onChange={() => {
              setSortBy(sortRef.current.value);
            }}
            id='defaultMember'
          >
            <option>All</option>
            {partyData &&
              partyData.party &&
              partyData.party.map((partyMember, idx) => (
                <option key={idx}>{partyMember}</option>
              ))}
          </Form.Control>
        </Form>
      </Col>

      <Col xs={2} className='pl-0'>
        <ModalParty />
      </Col>
    </Row>
  );
}
