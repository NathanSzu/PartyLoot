import React from 'react';

export default function RaritySelect({ itemData, setItemData, disabled = false }) {
  return (
    <select
      onChange={(e) => {
        setItemData({ ...itemData, rarity: e.target.value });
      }}
      className='form-select'
      disabled={disabled}
      value={itemData?.rarity}
      id='raritySelect'
      data-cy='rarity-select'
      aria-label='Set item rarity'
    >
      <option value=''>none</option>
      <option value='Common'>Common</option>
      <option value='Uncommon'>Uncommon</option>
      <option value='Rare'>Rare</option>
      <option value='Very Rare'>Very Rare</option>
      <option value='Legendary'>Legendary</option>
    </select>
  );
}
