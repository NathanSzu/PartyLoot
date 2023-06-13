import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function SkippedRoutes() {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? <Navigate to={'/groups'} /> : <Outlet />;
}
