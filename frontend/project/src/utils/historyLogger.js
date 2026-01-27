// src/utils/historyLogger.js
// ==================== FONCTIONS DE L'HISTORIQUE ====================

// Fonction pour initialiser l'historique local
export const initHistoriqueLocal = () => {
  console.log('🔄 Initialisation de l\'historique local...');
  
  const STORAGE_KEY = 'gestion_parc_historique';
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const now = new Date();
    const defaultData = [
      {
        id: 'hist_' + Date.now(),
        utilisateur: 'admin',
        action: 'CONNEXION',
        module: 'Authentification',
        details: 'Première initialisation du système',
        date: new Date(now.getTime() - 86400000).toISOString(),
        ip_address: '192.168.1.1',
        user_agent: 'Chrome/120.0',
        status: 'SUCCESS'
      },
      {
        id: 'hist_' + (Date.now() + 1),
        utilisateur: 'admin',
        action: 'CREATION',
        module: 'Utilisateurs',
        details: 'Création compte technicien',
        date: new Date(now.getTime() - 172800000).toISOString(),
        ip_address: '192.168.1.1',
        user_agent: 'Chrome/120.0',
        status: 'SUCCESS'
      },
      {
        id: 'hist_' + (Date.now() + 2),
        utilisateur: 'technicien',
        action: 'MODIFICATION',
        module: 'Matériels',
        details: 'Mise à jour PC-001',
        date: new Date(now.getTime() - 259200000).toISOString(),
        ip_address: '192.168.1.2',
        user_agent: 'Firefox/119.0',
        status: 'SUCCESS'
      },
      {
        id: 'hist_' + (Date.now() + 3),
        utilisateur: 'user1',
        action: 'LECTURE',
        module: 'Dashboard',
        details: 'Consultation tableau de bord',
        date: new Date(now.getTime() - 345600000).toISOString(),
        ip_address: '192.168.1.3',
        user_agent: 'Safari/17.0',
        status: 'SUCCESS'
      },
      {
        id: 'hist_' + (Date.now() + 4),
        utilisateur: 'admin',
        action: 'SUPPRESSION',
        module: 'Fournisseurs',
        details: 'Suppression fournisseur TechCorp',
        date: new Date(now.getTime() - 432000000).toISOString(),
        ip_address: '192.168.1.1',
        user_agent: 'Chrome/120.0',
        status: 'SUCCESS'
      }
    ];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    console.log(`✅ Historique initialisé avec ${defaultData.length} entrées`);
  } else {
    try {
      const data = JSON.parse(saved);
      console.log(`✅ Historique déjà initialisé (${data.length} entrées)`);
    } catch {
      console.log('⚠️ Historique corrompu, réinitialisation...');
      localStorage.removeItem(STORAGE_KEY);
      initHistoriqueLocal();
    }
  }
};

// Fonction pour obtenir l'historique
export const getHistoriqueLocal = (filters = {}) => {
  const STORAGE_KEY = 'gestion_parc_historique';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let data = saved ? JSON.parse(saved) : [];
    
    // Appliquer les filtres
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      data = data.filter(item => 
        item.utilisateur?.toLowerCase().includes(searchTerm) ||
        item.action?.toLowerCase().includes(searchTerm) ||
        item.module?.toLowerCase().includes(searchTerm) ||
        item.details?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.utilisateur) {
      data = data.filter(item => item.utilisateur === filters.utilisateur);
    }
    
    if (filters.action) {
      data = data.filter(item => item.action === filters.action);
    }
    
    if (filters.module) {
      data = data.filter(item => item.module === filters.module);
    }
    
    if (filters.dateDebut) {
      const startDate = new Date(filters.dateDebut);
      data = data.filter(item => new Date(item.date) >= startDate);
    }
    
    if (filters.dateFin) {
      const endDate = new Date(filters.dateFin);
      data = data.filter(item => new Date(item.date) <= endDate);
    }
    
    // Trier par date (plus récent en premier par défaut)
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return data;
  } catch {
    return [];
  }
};

// Fonction pour ajouter une entrée d'historique
export const addHistoriqueEntry = (action, module, details, utilisateur = null) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const newEntry = {
      id: 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      utilisateur: utilisateur || user?.username || 'System',
      action: action,
      module: module,
      details: details,
      date: new Date().toISOString(),
      ip_address: 'localhost',
      user_agent: navigator.userAgent,
      status: 'SUCCESS'
    };
    
    const STORAGE_KEY = 'gestion_parc_historique';
    const historique = getHistoriqueLocal();
    const newHistorique = [newEntry, ...historique.slice(0, 99)]; // Limite à 100 entrées
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
    console.log(`✅ Entrée ajoutée: ${action} - ${module} - ${details}`);
    
    // Émettre un événement de mise à jour
    window.dispatchEvent(new CustomEvent('historique-updated', { detail: newEntry }));
    
    return newEntry;
  } catch (error) {
    console.error('❌ Erreur ajout historique:', error);
    return null;
  }
};

// ==================== ACTION LOGGER ====================

// Fonction principale pour logger les actions
const logAction = (action, module, details, username = null) => {
  return addHistoriqueEntry(action, module, details, username);
};

// Objet ActionLogger avec des méthodes prédéfinies
export const ActionLogger = {
  // Authentification
  login: (username) => 
    logAction('CONNEXION', 'Authentification', `Connexion de ${username}`, username),
  
  logout: (username) => 
    logAction('DECONNEXION', 'Authentification', `Déconnexion de ${username}`, username),
  
  // Utilisateurs
  createUser: (username, createdBy) => 
    logAction('CREATION', 'Utilisateurs', `Création utilisateur ${username}`, createdBy),
  
  updateUser: (username, updatedBy) => 
    logAction('MODIFICATION', 'Utilisateurs', `Mise à jour utilisateur ${username}`, updatedBy),
  
  deleteUser: (username, deletedBy) => 
    logAction('SUPPRESSION', 'Utilisateurs', `Suppression utilisateur ${username}`, deletedBy),
  
  // Matériels
  createMateriel: (name, createdBy) => 
    logAction('CREATION', 'Matériels', `Création matériel ${name}`, createdBy),
  
  updateMateriel: (name, updatedBy) => 
    logAction('MODIFICATION', 'Matériels', `Mise à jour matériel ${name}`, updatedBy),
  
  deleteMateriel: (name, deletedBy) => 
    logAction('SUPPRESSION', 'Matériels', `Suppression matériel ${name}`, deletedBy),
  
  // Incidents
  createIncident: (id, createdBy) => 
    logAction('CREATION', 'Incidents', `Création incident #${id}`, createdBy),
  
  resolveIncident: (id, resolvedBy) => 
    logAction('MODIFICATION', 'Incidents', `Résolution incident #${id}`, resolvedBy),
  
  // Dashboard
  viewDashboard: (username) => 
    logAction('LECTURE', 'Dashboard', 'Consultation tableau de bord', username),
  
  // Générique
  custom: (action, module, details, username) => 
    logAction(action, module, details, username)
};

// Initialiser les écouteurs d'actions
export const initActionLogger = () => {
  console.log('🎯 Configuration des écouteurs d\'actions...');
  
  // Écouter les événements de connexion
  window.addEventListener('user-login', (event) => {
    const { username } = event.detail || {};
    if (username) {
      ActionLogger.login(username);
    }
  });
  
  // Écouter les événements de déconnexion
  window.addEventListener('user-logout', (event) => {
    const { username } = event.detail || {};
    if (username) {
      ActionLogger.logout(username);
    }
  });
  
  // Écouter les événements génériques
  window.addEventListener('log-action', (event) => {
    const { action, module, details, username } = event.detail || {};
    if (action && module && details) {
      ActionLogger.custom(action, module, details, username);
    }
  });
  
  console.log('✅ ActionLogger initialisé');
};

// ==================== HOOK useActionLogger ====================

// Hook pour utiliser le logger d'actions dans les composants
export const useActionLogger = () => {
  const log = (action, module, details, username = null) => {
    return ActionLogger.custom(action, module, details, username);
  };
  
  const logLogin = (username) => {
    return ActionLogger.login(username);
  };
  
  const logLogout = (username) => {
    return ActionLogger.logout(username);
  };
  
  const logCreate = (module, itemName, username = null) => {
    return ActionLogger.custom('CREATION', module, `Création: ${itemName}`, username);
  };
  
  const logUpdate = (module, itemName, username = null) => {
    return ActionLogger.custom('MODIFICATION', module, `Mise à jour: ${itemName}`, username);
  };
  
  const logDelete = (module, itemName, username = null) => {
    return ActionLogger.custom('SUPPRESSION', module, `Suppression: ${itemName}`, username);
  };
  
  const logView = (module, username = null) => {
    return ActionLogger.custom('LECTURE', module, 'Consultation', username);
  };
  
  return {
    log,
    logLogin,
    logLogout,
    logCreate,
    logUpdate,
    logDelete,
    logView
  };
};