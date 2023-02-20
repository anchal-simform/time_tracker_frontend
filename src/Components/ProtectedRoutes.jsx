import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { COOKIE_KEYS } from '../constants';
import { getCookie } from '../utils/cookieManager';

const ProtectedRoute = ({ children }) => {
  const userToken = getCookie(COOKIE_KEYS.token);
  let location = useLocation();
  //  If User token is not there in cookie take to Home screen
  if (!userToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
