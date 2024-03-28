import React, { useState, useEffect, useContext } from 'react';
import { GroupContext } from '../../utils/contexts/GroupContext';

export default function ItemOwnerSelect({ setSortBy, group, sortBy, disabled = false, type = 'party' }) {
  const { itemOwners } = useContext(GroupContext);
  const [ownerList, setOwnerList] = useState([]);

  const getItemOwners = () => {
    return itemOwners
      .orderBy('name')
      .where('type', '==', type)
      .onSnapshot((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          results.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setOwnerList(results);
      });
  };

  useEffect(() => {
    let unsubscribe;
    unsubscribe = getItemOwners();
    return () => {
      unsubscribe();
    };
  }, [group]);

  return (
    <select
      onChange={(e) => {
        setSortBy(e.target.value);
      }}
      className='form-select'
      disabled={disabled}
      value={sortBy}
      id='ownerSelect'
      aria-label='Select owner'
    >
      <option value='party'>Party</option>
      {ownerList &&
        ownerList.map((itemOwner) => (
          <option key={itemOwner.id} value={itemOwner.id}>
            {itemOwner.name}
          </option>
        ))}
    </select>
  );
}
