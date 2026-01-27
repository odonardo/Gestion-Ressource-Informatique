// src/config/actionsConfig.js
export const ACTION_TYPES = {
  // CRUD
  CREATE: 'AJOUT',
  READ: 'CONSULTATION',
  UPDATE: 'MODIFICATION',
  DELETE: 'SUPPRESSION',
  
  // Authentification
  LOGIN: 'CONNEXION',
  LOGOUT: 'DECONNEXION',
  REGISTER: 'CREATION COMPTE',
  
  // Export/Import
  EXPORT: 'EXPORTATION',
  IMPORT: 'IMPORTATION',
  GENERATE: 'GÉNÉRATION',
  PRINT: 'IMPRESSION',
  
  // Système
  STARTUP: 'DÉMARRAGE',
  SHUTDOWN: 'ARRÊT SYSTÈME',
  MAINTENANCE: 'MAINTENANCE',
  BACKUP: 'SAUVEGARDE',
  RESTORE: 'RESTAURATION',
  
  // Autres
  VALIDATE: 'VALIDATION',
  REJECT: 'REJET',
  APPROVE: 'APPROBATION',
  RESOLVE: 'RÉSOLUTION',
  NAVIGATE: 'NAVIGATION'
};

export const MODULES = {
  MATERIELS: 'Matériels',
  LOGICIELS: 'Logiciels',
  INCIDENTS: 'Incidents',
  REPARATIONS: 'Réparations',
  FOURNISSEURS: 'Fournisseurs',
  UTILISATEURS: 'Utilisateurs',
  ALERTES: 'Alertes',
  RAPPORTS: 'Rapports',
  PROFILS: 'Profils Utilisateurs',
  AUTH: 'Authentification',
  SYSTEM: 'Système',
  DASHBOARD: 'Dashboard',
  CONFIGURATION: 'Configuration'
};

export const ACTION_COLORS = {
  [ACTION_TYPES.CREATE]: 'badge-primary',
  [ACTION_TYPES.READ]: 'badge-info',
  [ACTION_TYPES.UPDATE]: 'badge-warning',
  [ACTION_TYPES.DELETE]: 'badge-error',
  [ACTION_TYPES.LOGIN]: 'badge-success',
  [ACTION_TYPES.LOGOUT]: 'badge-warning',
  [ACTION_TYPES.EXPORT]: 'badge-secondary',
  [ACTION_TYPES.GENERATE]: 'badge-accent',
  [ACTION_TYPES.RESOLVE]: 'badge-success',
  [ACTION_TYPES.NAVIGATE]: 'badge-neutral'
};

export const ACTION_ICONS = {
  [ACTION_TYPES.CREATE]: '➕',
  [ACTION_TYPES.READ]: '👁️',
  [ACTION_TYPES.UPDATE]: '✏️',
  [ACTION_TYPES.DELETE]: '🗑️',
  [ACTION_TYPES.LOGIN]: '🔑',
  [ACTION_TYPES.LOGOUT]: '🚪',
  [ACTION_TYPES.EXPORT]: '📤',
  [ACTION_TYPES.IMPORT]: '📥',
  [ACTION_TYPES.GENERATE]: '📄',
  [ACTION_TYPES.RESOLVE]: '✅',
  [ACTION_TYPES.NAVIGATE]: '🧭'
};