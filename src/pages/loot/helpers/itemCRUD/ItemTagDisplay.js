import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { GroupContext } from '../../../../utils/contexts/GroupContext';

const ItemTagDisplay = ({ itemTags, className = '' }) => {
  const { setItemQuery } = useContext(GroupContext);
  
  // Convert comma-separated string to array and trim whitespace
  const badgeArray = typeof itemTags === 'string' 
    ? itemTags.split(',').map(badge => badge.trim()).filter(Boolean)
    : Array.isArray(itemTags) ? itemTags : [];

  if (badgeArray.length === 0) {
    return null;
  }

  const handleBadgeClick = (badge) => {
    setItemQuery(prev => ({
      ...prev,
      searchQuery: badge.toLowerCase()
    }));
  };

  return (
    <div className={`d-flex flex-wrap gap-1 ${className}`}>
      {badgeArray.map((badge, index) => (
        <button
          key={index}
          data-cy='tag-button'
          className="btn btn-sm rounded-pill bg-dark text-white border-0 px-3 py-1 me-1 hover-opacity"
          onClick={() => handleBadgeClick(badge)}
          style={{
            transition: 'opacity 0.2s ease-in-out',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          {badge}
        </button>
      ))}
    </div>
  );
};

ItemTagDisplay.propTypes = {
  itemTags: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  className: PropTypes.string,
};

export default ItemTagDisplay; 