import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import EditGroup from './EditGroup';
import GroupIcon from '../../../assets/GroupIcon';

export default function GroupCard({ group }) {
  const { setCurrentGroup } = useContext(GroupContext);
  const navigate = useNavigate();

  const handleSelectGroup = (groupId) => {
    setCurrentGroup(groupId);
    navigate('/loot');
  };

  return (
    <div className='card mb-2 background-light'>
      <div className='row g-0'>
        <div className='col-2 d-flex align-items-center justify-content-center p-1 background-white rounded-start'>
          <GroupIcon id={group?.icon?.id} fillColor={group?.icon?.color} />
        </div>
        <div className='col'>
          <div className='card-body pe-0'>
            <h5 className='card-title fancy-font fs-md-deco'>{group?.groupName}</h5>
            <p className='card-text'>
              <small className='text-body-secondary'>
                {group?.members.length} member{group?.members.length > 1 && 's'}
              </small>
            </p>
          </div>
        </div>
        <div className='col-3 col-sm-2 d-flex align-items-center'>
          <div className='vstack gap-1 col-md-5 m-2'>
            <EditGroup group={group} />
            <button
              type='button'
              className='btn btn-primary'
              disabled={!group}
              id={group?.id}
              data-cy='view-group'
              onClick={() => handleSelectGroup(group.id)}
            >
              <img alt='View Group' src='/APPIcons/eye-fill.svg' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
