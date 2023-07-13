import React from 'react';
import { Button } from 'react-bootstrap';

export default function LikeDisplay({ fill = 'regular', color = '#3a343f', likeCount = 0, badges = [] }) {
  return (
    <p className='m-0'>
      <i className={`fa-${fill} fa-heart`} style={{ color: color }} /> {likeCount} {badges.length > 0 && '| Category'}
    </p>
  );
}
