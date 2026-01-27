// src/components/AutoLoggerProvider.jsx - PROVIDER POUR LOGGER AUTOMATIQUE
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useAutoLogger from '../utils/autoLogger';

const AutoLoggerProvider = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { logNavigation, logDashboardView, logHistoriqueView } = useAutoLogger();
  
  useEffect(() => {
    // Logger la navigation
    if (user && location.pathname) {
      setTimeout(() => {
        logNavigation(location.pathname);
      }, 500);
    }
    
    // Logger les vues spécifiques
    if (user) {
      switch (location.pathname) {
        case '/dashboard':
          logDashboardView();
          break;
        case '/historique':
          logHistoriqueView();
          break;
        default:
          break;
      }
    }
  }, [location.pathname, user, logNavigation, logDashboardView, logHistoriqueView]);
  
  return <>{children}</>;
};

export default AutoLoggerProvider;