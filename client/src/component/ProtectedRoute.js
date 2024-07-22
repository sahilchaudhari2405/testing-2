// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  let userRole = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      userRole = payload.role;
    } catch (e) {
      console.error('Invalid token:', e);
    }
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default ProtectedRoute;
