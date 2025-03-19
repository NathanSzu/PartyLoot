import React, { useState, useEffect } from 'react';

export default function CampaignSettingSelect({ metadata, state, setState }) {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    metadata?.settings && setKeys(Object.keys(metadata.settings));
  }, [metadata]);

  return (
    <select
      onChange={(e) => {
        setState({ ...state, setting: e.target.value });
      }}
      value={state?.setting || ''}
      id='settingSelect'
      aria-label='Set item setting'
      data-cy='discovery-setting'
      className='form-select'
    >
      <option value=''>Setting</option>
      {keys &&
        keys.map((key) => (
          <option key={key} value={key}>
            {metadata?.settings[key].setting}
          </option>
        ))}
    </select>
  );
}
