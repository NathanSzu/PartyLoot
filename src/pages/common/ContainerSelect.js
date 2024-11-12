import React, { useContext } from 'react';
import { GroupContext } from '../../utils/contexts/GroupContext';

export default function ContainerSelect({ state, setState, disabled = false }) {
  const { sortedLoot } = useContext(GroupContext);

  return (
    <select
      onChange={(e) => {
        setState(e.target.value);
      }}
      className='form-select'
      disabled={disabled}
      value={state}
      id='containerSelect'
      data-cy='container-select'
      aria-label='Add to container'
    >
      <option value={false}>No container</option>
      {sortedLoot?.sortedContainers?.map((container) => (
        <option key={container.id} value={container.id}>
          {container.name}
        </option>
      ))}
    </select>
  );
}
