// src/services/test-api.ts
import { authAPI } from './api';

console.log('authAPI:', authAPI);
console.log('Login function:', authAPI.login);

// Testez l'import
export const testAuthAPI = () => {
  return {
    login: authAPI.login,
    logout: authAPI.logout,
    getProfile: authAPI.getProfile
  };
};