import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { GroupContext } from '../contexts/GroupContext';

export default function GroupRoutes() {
  const { currentGroup } = useContext(GroupContext);

  return currentGroup === ' ' ? <Navigate to={'/groups'} /> : <Outlet />;
}
