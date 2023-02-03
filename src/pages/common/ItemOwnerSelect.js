import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

export default function ItemOwnerSelect({ itemOwners, setState, value = 'party' }) {
  const [noDeletedOwners, setNoDeletedOwners] = useState([]);

  useEffect(() => {
    itemOwners &&
      setNoDeletedOwners(
        itemOwners.filter((itemOwner) => {
          return itemOwner.type !== 'deleted';
        })
      );
  }, [itemOwners]);

  return (
    <Form.Control
      as='select'
      onChange={(e) => {
        setState(e.target.value);
      }}
      value={value}
    >
      <option value={'party'}>Party</option>
      {noDeletedOwners &&
        noDeletedOwners.map((itemOwner) => (
          <option key={itemOwner.id} value={itemOwner.id}>
            {itemOwner.name}
          </option>
        ))}
    </Form.Control>
  );
}
