// src/utils/autoLogger.js - LOGGER AUTOMATIQUE POUR TOUTES LES ACTIONS CRUD

import { useAuth } from '../context/AuthContext';

// ==================== CONFIGURATION ====================
const ACTION_CONFIG = {
  // Types d'actions
  CREATE: 'AJOUT',
  READ: 'CONSULTATION', 
  UPDATE: 'MODIFICATION',
  DELETE: 'SUPPRESSION',
  EXPORT: 'EXPORTATION',
  IMPORT: 'IMPORTATION',
  LOGIN: 'CONNEXION',
  LOGOUT: 'DECONNEXION',
  NAVIGATE: 'NAVIGATION',
  RESOLVE: 'RÉSOLUTION',
  VALIDATE: 'VALIDATION',
  REJECT: 'REJET',
  APPROVE: 'APPROBATION',
  PRINT: 'IMPRESSION',
  GENERATE: 'GÉNÉRATION',
  SEARCH: 'RECHERCHE',
  FILTER: 'FILTRAGE',
  
  // Modules
  MODULES: {
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
    CONFIGURATION: 'Configuration',
    HISTORIQUE: 'Historique',
    RESEAU: 'Réseau',
    STOCKAGE: 'Stockage',
    SECURITE: 'Sécurité'
  }
};

// ==================== HOOK PRINCIPAL ====================
export const useAutoLogger = () => {
  const { user } = useAuth();
  
  const getUsername = () => {
    if (user?.username) return user.username;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        return parsed.username || 'System';
      } catch {
        return 'System';
      }
    }
    
    return 'System';
  };
  
  const logAction = (action, module, details, extraData = {}) => {
    if (!window.ActionLogger) {
      console.warn('⚠️ ActionLogger non disponible');
      return;
    }
    
    const username = getUsername();
    
    window.ActionLogger.custom(action, module, details, username, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...extraData
    });
    
    console.log(`📝 AutoLogger: ${action} - ${module} - ${details}`);
  };
  
  // ========== FONCTIONS SPÉCIFIQUES ==========
  
  // CRUD Générique
  const logCRUD = (operation, module, itemName, itemData = {}) => {
    const actionsMap = {
      'create': ACTION_CONFIG.CREATE,
      'read': ACTION_CONFIG.READ,
      'update': ACTION_CONFIG.UPDATE,
      'delete': ACTION_CONFIG.DELETE
    };
    
    const action = actionsMap[operation] || operation.toUpperCase();
    const details = getCRUDDetails(operation, module, itemName);
    
    logAction(action, module, details, {
      type: operation,
      itemType: module.toLowerCase(),
      itemName: itemName,
      ...itemData
    });
  };
  
  // Export/Import
  const logExport = (module, format, dataCount, filters = {}) => {
    logAction(ACTION_CONFIG.EXPORT, ACTION_CONFIG.MODULES.RAPPORTS, 
      `Export ${module} en ${format} (${dataCount} éléments)`, {
        module: module,
        format: format,
        count: dataCount,
        filters: filters,
        type: 'export'
      });
  };
  
  const logImport = (module, format, dataCount, source = '') => {
    logAction(ACTION_CONFIG.IMPORT, ACTION_CONFIG.MODULES.RAPPORTS,
      `Import ${module} depuis ${source} (${dataCount} éléments)`, {
        module: module,
        format: format,
        count: dataCount,
        source: source,
        type: 'import'
      });
  };
  
  // Authentification
  const logLogin = (username = null) => {
    const user = username || getUsername();
    logAction(ACTION_CONFIG.LOGIN, ACTION_CONFIG.MODULES.AUTH,
      `Connexion de ${user}`, {
        username: user,
        type: 'login'
      });
  };
  
  const logLogout = (username = null) => {
    const user = username || getUsername();
    logAction(ACTION_CONFIG.LOGOUT, ACTION_CONFIG.MODULES.AUTH,
      `Déconnexion de ${user}`, {
        username: user,
        type: 'logout'
      });
  };
  
  // Recherche et Filtrage
  const logSearch = (module, searchTerm, resultsCount) => {
    logAction(ACTION_CONFIG.SEARCH, module,
      `Recherche "${searchTerm}" (${resultsCount} résultats)`, {
        searchTerm: searchTerm,
        resultsCount: resultsCount,
        type: 'search'
      });
  };
  
  const logFilter = (module, filters, resultsCount) => {
    logAction(ACTION_CONFIG.FILTER, module,
      `Filtrage (${resultsCount} résultats)`, {
        filters: filters,
        resultsCount: resultsCount,
        type: 'filter'
      });
  };
  
  // Navigation
  const logNavigation = (page) => {
    logAction(ACTION_CONFIG.NAVIGATE, ACTION_CONFIG.MODULES.SYSTEM,
      `Navigation vers ${page}`, {
        page: page,
        type: 'navigation'
      });
  };
  
  // Rapport et Impression
  const logReport = (type, format, filters = {}) => {
    logAction(ACTION_CONFIG.GENERATE, ACTION_CONFIG.MODULES.RAPPORTS,
      `Génération rapport ${type} en ${format}`, {
        reportType: type,
        format: format,
        filters: filters,
        type: 'report'
      });
  };
  
  const logPrint = (documentType, pages = 1) => {
    logAction(ACTION_CONFIG.PRINT, ACTION_CONFIG.MODULES.RAPPORTS,
      `Impression ${documentType} (${pages} pages)`, {
        documentType: documentType,
        pages: pages,
        type: 'print'
      });
  };
  
  // Validation/Approbation
  const logValidation = (module, itemName, status) => {
    const action = status === 'approved' ? ACTION_CONFIG.APPROVE : 
                  status === 'rejected' ? ACTION_CONFIG.REJECT : 
                  ACTION_CONFIG.VALIDATE;
    
    logAction(action, module,
      `${status === 'approved' ? 'Approbation' : 
        status === 'rejected' ? 'Rejet' : 'Validation'} ${itemName}`, {
        itemName: itemName,
        status: status,
        type: 'validation'
      });
  };
  
  // Résolution d'incident
  const logResolution = (incidentId, incidentName, resolutionType) => {
    logAction(ACTION_CONFIG.RESOLVE, ACTION_CONFIG.MODULES.INCIDENTS,
      `Résolution incident ${incidentName} (${resolutionType})`, {
        incidentId: incidentId,
        incidentName: incidentName,
        resolutionType: resolutionType,
        type: 'resolution'
      });
  };
  
  // ========== HELPERS ==========
  const getCRUDDetails = (operation, module, itemName) => {
    const verbs = {
      'create': 'Ajout',
      'read': 'Consultation',
      'update': 'Modification',
      'delete': 'Suppression'
    };
    
    const verb = verbs[operation] || operation;
    return `${verb} ${module.toLowerCase()}: ${itemName}`;
  };
  
  return {
    // Configuration
    ACTION_CONFIG,
    
    // Logging général
    logAction,
    
    // Logging spécifique
    logCRUD,
    logExport,
    logImport,
    logLogin,
    logLogout,
    logSearch,
    logFilter,
    logNavigation,
    logReport,
    logPrint,
    logValidation,
    logResolution,
    
    // Fonctions rapides par module
    // Matériels
    logMaterielCreate: (materielData) => 
      logCRUD('create', ACTION_CONFIG.MODULES.MATERIELS, 
        materielData.nom || 'Nouveau matériel', { data: materielData }),
    
    logMaterielUpdate: (id, oldData, newData) => 
      logCRUD('update', ACTION_CONFIG.MODULES.MATERIELS,
        newData.nom || oldData.nom || id, {
          id: id,
          oldData: oldData,
          newData: newData,
          changes: getChanges(oldData, newData)
        }),
    
    logMaterielDelete: (id, materielData) =>
      logCRUD('delete', ACTION_CONFIG.MODULES.MATERIELS,
        materielData.nom || id, { id: id, data: materielData }),
    
    logMaterielExport: (format, count, filters) =>
      logExport(ACTION_CONFIG.MODULES.MATERIELS, format, count, filters),
    
    // Incidents
    logIncidentCreate: (incidentData) =>
      logCRUD('create', ACTION_CONFIG.MODULES.INCIDENTS,
        incidentData.titre || 'Nouvel incident', { data: incidentData }),
    
    logIncidentResolve: (id, incidentData, resolution) =>
      logResolution(id, incidentData.titre || id, resolution),
    
    // Utilisateurs
    logUserCreate: (userData) =>
      logCRUD('create', ACTION_CONFIG.MODULES.UTILISATEURS,
        userData.username || 'Nouvel utilisateur', { data: userData }),
    
    logUserUpdate: (id, oldData, newData) =>
      logCRUD('update', ACTION_CONFIG.MODULES.UTILISATEURS,
        newData.username || oldData.username || id, {
          id: id,
          oldData: oldData,
          newData: newData
        }),
    
    // Fournisseurs
    logFournisseurCreate: (fournisseurData) =>
      logCRUD('create', ACTION_CONFIG.MODULES.FOURNISSEURS,
        fournisseurData.nom || 'Nouveau fournisseur', { data: fournisseurData }),
    
    // Dashboard
    logDashboardView: () =>
      logAction(ACTION_CONFIG.READ, ACTION_CONFIG.MODULES.DASHBOARD,
        'Consultation tableau de bord', { type: 'dashboard_view' }),
    
    // Historique
    logHistoriqueView: (filters = {}) =>
      logAction(ACTION_CONFIG.READ, ACTION_CONFIG.MODULES.HISTORIQUE,
        'Consultation historique', { filters: filters, type: 'historique_view' }),
    
    logHistoriqueExport: (format, count) =>
      logExport(ACTION_CONFIG.MODULES.HISTORIQUE, format, count)
  };
};

// ==================== FONCTION UTILITAIRE ====================
const getChanges = (oldData, newData) => {
  const changes = {};
  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        old: oldData[key],
        new: newData[key]
      };
    }
  }
  return changes;
};

// ==================== WRAPPERS AUTOMATIQUES POUR LES APIs ====================

export const wrapAPIWithLogger = (apiInstance, moduleName) => {
  const wrappedAPI = { ...apiInstance };
  
  // Wrapper pour create
  if (apiInstance.create) {
    const originalCreate = apiInstance.create;
    wrappedAPI.create = async function(data) {
      const result = await originalCreate.call(this, data);
      
      // Log l'action
      if (window.ActionLogger) {
        const username = getCurrentUsername();
        const action = ACTION_CONFIG.CREATE;
        const details = `Ajout ${moduleName}: ${data.nom || data.titre || data.username || 'Nouvel élément'}`;
        
        window.ActionLogger.custom(action, moduleName, details, username, {
          data: data,
          result: result,
          type: 'api_create'
        });
      }
      
      return result;
    };
  }
  
  // Wrapper pour update
  if (apiInstance.update) {
    const originalUpdate = apiInstance.update;
    wrappedAPI.update = async function(id, data) {
      const result = await originalUpdate.call(this, id, data);
      
      if (window.ActionLogger) {
        const username = getCurrentUsername();
        const action = ACTION_CONFIG.UPDATE;
        const details = `Modification ${moduleName} #${id}`;
        
        window.ActionLogger.custom(action, moduleName, details, username, {
          id: id,
          data: data,
          result: result,
          type: 'api_update'
        });
      }
      
      return result;
    };
  }
  
  // Wrapper pour delete
  if (apiInstance.delete) {
    const originalDelete = apiInstance.delete;
    wrappedAPI.delete = async function(id) {
      const result = await originalDelete.call(this, id);
      
      if (window.ActionLogger) {
        const username = getCurrentUsername();
        const action = ACTION_CONFIG.DELETE;
        const details = `Suppression ${moduleName} #${id}`;
        
        window.ActionLogger.custom(action, moduleName, details, username, {
          id: id,
          result: result,
          type: 'api_delete'
        });
      }
      
      return result;
    };
  }
  
  return wrappedAPI;
};

const getCurrentUsername = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.username || 'System';
    } catch {
      return 'System';
    }
  }
  return 'System';
};

// ==================== EXPORT ====================
export default useAutoLogger;