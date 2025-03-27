import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
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
        <Button
          key={index}
          data-cy='tag-button'
          variant="dark"
          size="sm"
          className="rounded-pill px-3 py-1 me-1 mt-1"
          onClick={() => handleBadgeClick(badge)}
        >
          {badge}
        </Button>
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