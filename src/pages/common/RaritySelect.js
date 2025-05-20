import { useEffect, useState } from 'react';
import { getSettingByName } from '../../controllers/metadataController';

export default function RaritySelect({ itemData, setItemData, disabled = false, isInvalid = false, onBlur }) {
  const [rarityOptions, setRarityOptions] = useState([]);

  useEffect(() => {
    const fetchRarityOptions = async () => {
      try {
        const raritySetting = await getSettingByName('rarity');
        setRarityOptions(raritySetting?.options || []);
      } catch (error) {
        console.error('Error fetching rarity options:', error);
      }
    };

    fetchRarityOptions();
  }, []);

  return (
    <div className="form-group">
      <select
        onChange={(e) => setItemData('rarity', e.target.value)}
        onBlur={onBlur}
        className={`form-select ${isInvalid ? 'is-invalid' : ''}`}
        disabled={disabled}
        value={itemData?.rarity}
        id='raritySelect'
        data-cy='rarity-select'
        aria-label='Set item rarity'
        required
      >
        <option value=''>Rarity</option>
        {rarityOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {isInvalid && (
        <div className='invalid-feedback d-block text-start'>Select an item rarity!</div>
      )}
    </div>
  );
}
