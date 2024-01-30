import React, { useContext } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import EditGroup from './EditGroup';

export default function GroupCard({ group, idx }) {
  const { setCurrentGroup } = useContext(GroupContext);

  const navigate = useNavigate();

  const handleSelectGroup = (groupId) => {
    setCurrentGroup(groupId);
    navigate('/loot');
  };

  return (
    <Row key={idx} className='border-top border-dark background-light mx-1 rounded'>
      <Col className='groups-overflow px-3 py-2'>
        <span className='fancy-font fs-md-deco'>{group?.groupName}</span>
      </Col>
      <Col xs={3} className='auto d-flex align-items-center'>
        <div className='vstack gap-1 col-md-5 mx-auto my-2'>
          <EditGroup name={group.groupName} id={group.id} owner={group.owner} members={group.members} />

          <Button
            disabled={!group}
            id={group?.id}
            data-cy={`group${idx}`}
            onClick={(e) => {
              handleSelectGroup(e.target.id);
            }}
          >
            View
          </Button>
        </div>
      </Col>
    </Row>
  );
}
