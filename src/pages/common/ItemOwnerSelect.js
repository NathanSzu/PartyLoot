import { useEffect, useContext } from 'react';
import { GroupContext } from '../../utils/contexts/GroupContext';

export default function ItemOwnerSelect({ setState, group, state, disabled = false }) {
  const { groups, itemOwners, getItemOwners } = useContext(GroupContext);

  const ownerRef = groups.doc(group || 'null');

  useEffect(() => {
    getItemOwners(ownerRef);
  }, [group]);

  return (
    <select
      onChange={(e) => {
        setState(e.target.value);
      }}
      className='form-select'
      disabled={disabled}
      value={state}
      id='ownerSelect'
      data-cy='owner-select'
      aria-label='Select owner'
    >
      <option value='party'>Party</option>
      {itemOwners &&
        itemOwners.map((itemOwner) => (
          <option key={itemOwner.id} value={itemOwner.id}>
            {itemOwner.name}
          </option>
        ))}
    </select>
  );
}
