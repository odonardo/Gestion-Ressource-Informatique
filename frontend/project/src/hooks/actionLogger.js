// // src/services/actionLogger.js - SERVICE POUR ENREGISTRER LES ACTIONS
// import { addHistoriqueEntry } from './historiqueLocal';

// // Fonction pour enregistrer une action
// export const logAction = async (action, module, details, utilisateur = null) => {
//   try {
//     // Récupérer l'utilisateur depuis localStorage
//     const userStr = localStorage.getItem('user');
//     const user = userStr ? JSON.parse(userStr) : null;
    
//     // Déterminer l'utilisateur
//     const finalUtilisateur = utilisateur || user?.username || 'System';
    
//     // Enregistrer l'action
//     const entry = await addHistoriqueEntry(action, module, details, finalUtilisateur);
    
//     console.log(`✅ Action enregistrée: ${action} - ${module} - ${finalUtilisateur}`);
    
//     // Émettre un événement pour notifier les composants
//     window.dispatchEvent(new CustomEvent('action-logged', { detail: entry }));
    
//     return { success: true, entry };
//   } catch (error) {
//     console.error('❌ Erreur enregistrement action:', error);
//     return { success: false, error };
//   }
// };

// // Actions prédéfinies
// export const ActionLogger = {
//   // Authentification
//   login: (username) => 
//     logAction('CONNEXION', 'Authentification', `Connexion de l'utilisateur "${username}"`, username),
  
//   logout: (username) => 
//     logAction('DECONNEXION', 'Authentification', `Déconnexion de l'utilisateur "${username}"`, username),
  
//   // Utilisateurs
//   createUser: (username, createdBy) => 
//     logAction('CREATION', 'Utilisateurs', `Création de l'utilisateur "${username}"`, createdBy),
  
//   updateUser: (username, updatedBy) => 
//     logAction('MODIFICATION', 'Utilisateurs', `Mise à jour de l'utilisateur "${username}"`, updatedBy),
  
//   deleteUser: (username, deletedBy) => 
//     logAction('SUPPRESSION', 'Utilisateurs', `Suppression de l'utilisateur "${username}"`, deletedBy),
  
//   // Matériels
//   createMateriel: (materielName, createdBy) => 
//     logAction('CREATION', 'Matériels', `Création du matériel "${materielName}"`, createdBy),
  
//   updateMateriel: (materielName, updatedBy) => 
//     logAction('MODIFICATION', 'Matériels', `Mise à jour du matériel "${materielName}"`, updatedBy),
  
//   deleteMateriel: (materielName, deletedBy) => 
//     logAction('SUPPRESSION', 'Matériels', `Suppression du matériel "${materielName}"`, deletedBy),
  
//   // Incidents
//   createIncident: (incidentId, createdBy) => 
//     logAction('CREATION', 'Incidents', `Création de l'incident #${incidentId}`, createdBy),
  
//   resolveIncident: (incidentId, resolvedBy) => 
//     logAction('MODIFICATION', 'Incidents', `Résolution de l'incident #${incidentId}`, resolvedBy),
  
//   // Dashboard
//   viewDashboard: (username) => 
//     logAction('LECTURE', 'Dashboard', 'Consultation du tableau de bord', username),
  
//   // Générique
//   custom: (action, module, details, username) => 
//     logAction(action, module, details, username)
// };

// // Intercepter les événements globaux
// export const setupActionListeners = () => {
//   // Écouter les événements de connexion
//   window.addEventListener('user-login', (event) => {
//     const { username } = event.detail;
//     ActionLogger.login(username);
//   });
  
//   // Écouter les événements de déconnexion
//   window.addEventListener('user-logout', (event) => {
//     const { username } = event.detail;
//     ActionLogger.logout(username);
//   });
  
//   // Écouter les événements génériques
//   window.addEventListener('log-action', (event) => {
//     const { action, module, details, username } = event.detail;
//     ActionLogger.custom(action, module, details, username);
//   });
  
//   console.log('🎯 Écouteurs d\'actions configurés');
// };

// // Initialiser le logger
// export const initActionLogger = () => {
//   setupActionListeners();
//   console.log('✅ ActionLogger initialisé');
// };

// export default ActionLogger;