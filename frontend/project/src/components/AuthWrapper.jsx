// src/components/AuthWrapper.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';

// ✅ Export par défaut
const AuthWrapper = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AuthWrapper; // ✅ Export par défaut