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
      <option value=''>Rarity</option>
      <option value='common'>Common</option>
      <option value='uncommon'>Uncommon</option>
      <option value='rare'>Rare</option>
      <option value='very rare'>Very rare</option>
      <option value='legendary'>Legendary</option>
    </select>
  );
}
