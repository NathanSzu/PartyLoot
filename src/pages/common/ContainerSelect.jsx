import { useContext } from 'react';
import { GroupContext } from '../../utils/contexts/GroupContext';

export default function ContainerSelect({ itemData, setItemData, disabled = false }) {
  const { allContainers, isGameMaster } = useContext(GroupContext);

  // Filter containers - show all containers if user has GM permissions, otherwise only show type '1'
  const availableContainers = isGameMaster 
    ? allContainers
    : allContainers.filter(container => container.type === '1');

  return (
    <select
      onChange={(e) => {
        setItemData('container', e.target.value );
      }}
      className='form-select'
      disabled={disabled}
      value={itemData?.container}
      id='containerSelect'
      data-cy='container-select'
      aria-label='Add to container'
    >
      <option value=''>none</option>
      {availableContainers.map((container) => (
        <option key={container.id} value={container.id}>
          {container.name}
        </option>
      ))}
    </select>
  );
}
