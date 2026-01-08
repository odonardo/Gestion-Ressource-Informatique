// src/hooks/usePermissions.js
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const permissions = {
    // Admin: accès complet
    isAdmin: user?.role === 'admin',
    
    // Technicien: gestion technique
    isTechnician: user?.role === 'technician',
    
    // Directeur: vue globale et rapports
    isDirector: user?.role === 'director',
    
    // Secrétaire: gestion administrative
    isSecretary: user?.role === 'secretary',
    
    // Utilisateur standard: consultation basique
    isUser: user?.role === 'user',
    
    // Vérifier si l'utilisateur a au moins le niveau requis
    hasAccess: (requiredRole) => {
      const roleHierarchy = {
        'user': 1,
        'secretary': 2,
        'technician': 3,
        'director': 4,
        'admin': 5
      };
      return roleHierarchy[user?.role] >= roleHierarchy[requiredRole];
    },
    
    // Vérifier des permissions spécifiques
    canManageUsers: () => ['admin', 'director'].includes(user?.role),
    canManageTechnicians: () => ['admin', 'director'].includes(user?.role),
    canManageIncidents: () => ['admin', 'technician', 'director'].includes(user?.role),
    canManageReparations: () => ['admin', 'technician'].includes(user?.role),
    canViewReports: () => ['admin', 'director', 'secretary'].includes(user?.role),
    canManageConfiguration: () => ['admin', 'technician'].includes(user?.role)
  };
  
  return permissions;
};