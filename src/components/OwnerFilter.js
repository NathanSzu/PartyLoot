import React, { useRef, useContext, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { GroupContext } from '../utils/contexts/GroupContext';
import { AuthContext } from '../utils/contexts/AuthContext';
import ModalParty from './ModalParty';

export default function OwnerFilter() {
  const { currentGroup, setSortBy } = useContext(GroupContext);
  const { currentUser, db } = useContext(AuthContext);

  const sortRef = useRef('');
  const groupRef = db.collection('groups').doc(currentGroup);

  const [partyData] = useDocumentData(groupRef);

  useEffect(() => {
    partyData &&
      partyData.favorites &&
      partyData.favorites[currentUser.uid] &&
      setDefaultMember(currentUser.uid, partyData);
  }, [partyData]);

  const setDefaultMember = (member, party) => {
    if (party.party.includes(party.favorites[member])) {
      document.getElementById('defaultMember').value = party.favorites[member];
      setSortBy(party.favorites[member]);
    } else {
      setSortBy('All');
    }
  };

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
