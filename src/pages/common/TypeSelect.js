import { useEffect, useState } from 'react';
import { getSettingByName } from '../../controllers/metadataController';

export default function TypeSelect({ itemData, setItemData, disabled = false, isInvalid = false, onBlur }) {
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    const fetchTypeOptions = async () => {
      try {
        const typeSetting = await getSettingByName('type');
        setTypeOptions(typeSetting?.options || []);
      } catch (error) {
        console.error('Error fetching type options:', error);
      }
    };

    fetchTypeOptions();
  }, []);

  return (
    <div className="form-group">
      <select
        onChange={(e) => setItemData('type', e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        value={itemData?.type}
        id="typeSelect"
        data-cy="type-select"
        aria-label="Set item type"
        className={`form-select ${isInvalid ? 'is-invalid' : ''}`}
        required
      >
        <option value="">Type</option>
        {typeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {isInvalid && (
        <div className="invalid-feedback d-block text-start">Select an item type!</div>
      )}
    </div>
  );
}
