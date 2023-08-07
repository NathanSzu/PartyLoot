import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

export default function ItemOwnerSelect({ metadata, state, setState, value = '' }) {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    metadata?.settings && setKeys(Object.keys(metadata.settings));
  }, [metadata]);

  return (
    <Form.Control
      as='select'
      onChange={(e) => {
        setState({ ...state, setting: e.target.value });
      }}
      value={state.setting}
      data-cy='new-discovery-campaign-setting'
    >
      <option value={''}>Choose setting</option>
      {keys &&
        keys.map((key) => (
          <option key={key} value={key}>
            {metadata?.settings[key].setting}
          </option>
        ))}
    </Form.Control>
  );
}
