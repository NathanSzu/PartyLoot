import React from 'react';
import { Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ItemTagDisplay = ({ itemTags, className = '' }) => {
  // Convert comma-separated string to array and trim whitespace
  const badgeArray = typeof itemTags === 'string' 
    ? itemTags.split(',').map(badge => badge.trim()).filter(Boolean)
    : Array.isArray(itemTags) ? itemTags : [];

  if (badgeArray.length === 0) {
    return null;
  }

  return (
    <div className={`d-flex flex-wrap gap-1 ${className}`}>
      {badgeArray.map((badge, index) => (
        <Badge key={index} pill bg="dark" className="me-1" as='button'>
          {badge}
        </Badge>
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