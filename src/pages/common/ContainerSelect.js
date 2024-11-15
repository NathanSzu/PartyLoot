import React, { useContext } from 'react';
import { GroupContext } from '../../utils/contexts/GroupContext';

export default function ContainerSelect({ itemData, setItemData, disabled = false }) {
  const { partyStorageContainers } = useContext(GroupContext);

  return (
    <select
      onChange={(e) => {
        setItemData({ ...itemData, container: e.target.value });
      }}
      className='form-select'
      disabled={disabled}
      value={itemData?.container}
      id='containerSelect'
      data-cy='container-select'
      aria-label='Add to container'
    >
      <option value={false}>No container</option>
      {partyStorageContainers.map((container) => (
        <option key={container.id} value={container.id}>
          {container.name}
        </option>
      ))}
    </select>
  );
}
