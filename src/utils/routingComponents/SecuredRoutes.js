import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function SecuredRoutes() {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? <Outlet /> : <Navigate to={'/'} />;
}
