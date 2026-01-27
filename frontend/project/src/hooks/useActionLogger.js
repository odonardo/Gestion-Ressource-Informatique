// // src/hooks/useActionLogger.js
// import { useCallback } from 'react';
// import { ActionLogger, useAuth } from '../services/api';

// export const useActionLogger = () => {
//   const { user } = useAuth();

//   const logAction = useCallback((action, module, details) => {
//     const username = user?.username || 'System';
//     ActionLogger.custom(action, module, details, username);
//   }, [user]);

//   const logCreate = useCallback((module, itemName) => {
//     logAction('CREATION', module, `Création: ${itemName}`);
//   }, [logAction]);

//   const logUpdate = useCallback((module, itemName) => {
//     logAction('MODIFICATION', module, `Mise à jour: ${itemName}`);
//   }, [logAction]);

//   const logDelete = useCallback((module, itemName) => {
//     logAction('SUPPRESSION', module, `Suppression: ${itemName}`);
//   }, [logAction]);

//   const logView = useCallback((module) => {
//     logAction('LECTURE', module, 'Consultation');
//   }, [logAction]);

//   return {
//     logAction,
//     logCreate,
//     logUpdate,
//     logDelete,
//     logView
//   };
// };


// src/hooks/useActionLogger.js
export const useActionLogger = () => {
  const logMaterielCreate = (materielData) => {
    console.log('📝 Matériel créé:', materielData);
    // Optionnel: envoyer à une API de journalisation
    if (window.ActionLogger?.createMateriel) {
      window.ActionLogger.createMateriel(materielData);
    }
  };

  const logMaterielUpdate = (materielData) => {
    console.log('✏️ Matériel modifié:', materielData);
    if (window.ActionLogger?.updateMateriel) {
      window.ActionLogger.updateMateriel(materielData);
    }
  };

  const logMaterielDelete = (materielData) => {
    console.log('🗑️ Matériel supprimé:', materielData);
    if (window.ActionLogger?.deleteMateriel) {
      window.ActionLogger.deleteMateriel(materielData);
    }
  };

  const logMaterielExport = (count) => {
    console.log(`📤 Export de ${count} matériels`);
    if (window.ActionLogger?.exportMateriels) {
      window.ActionLogger.exportMateriels(count);
    }
  };

  return {
    logMaterielCreate,
    logMaterielUpdate,
    logMaterielDelete,
    logMaterielExport
  };
};