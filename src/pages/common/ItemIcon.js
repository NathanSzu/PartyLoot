import React from 'react';

export default function ItemIcon({ type }) {
  const chooseIcon = () => {
    console.log(type)
    if (type == 1) return 'fa-flask-round-potion';
    if (type == 2) return 'fa-sword';
    if (type == 3) return 'fa-bow-arrow';
    if (type == 4) return 'fa-shield-cross';
    if (type == 5) return 'fa-screwdriver-wrench';
  };

  return <i className={`fa-regular ${chooseIcon()}`} style={{color: '#3a343f'}}></i>;
}
