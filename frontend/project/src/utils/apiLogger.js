// src/utils/apiLogger.js
import { useAuth } from '../context/AuthContext';

export const setupAPILogger = () => {
  console.log('🔧 Configuration du logger API...');
  
  // Intercepter les appels fetch
  const originalFetch = window.fetch;
  
  window.fetch = async function(...args) {
    const [url, options = {}] = args;
    const method = options.method || 'GET';
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Logger les requêtes importantes
    if (method !== 'GET' && user) {
      const module = getModuleFromURL(url);
      const action = getActionFromMethod(method);
      
      if (module && action) {
        // Attendre un peu pour que la requête soit traitée
        setTimeout(() => {
          if (window.ActionLogger) {
            const details = `${action} ${module} via API`;
            window.ActionLogger.custom(action, module, details, user.username, {
              url: url,
              method: method,
              type: 'api_call'
            });
          }
        }, 100);
      }
    }
    
    return originalFetch.apply(this, args);
  };
  
  console.log('✅ Logger API configuré');
};

const getModuleFromURL = (url) => {
  if (typeof url !== 'string') return null;
  
  if (url.includes('/materiels')) return 'Matériels';
  if (url.includes('/incidents')) return 'Incidents';
  if (url.includes('/logiciels')) return 'Logiciels';
  if (url.includes('/reparations')) return 'Réparations';
  if (url.includes('/fournisseurs')) return 'Fournisseurs';
  if (url.includes('/users')) return 'Utilisateurs';
  if (url.includes('/alertes')) return 'Alertes';
  return null;
};

const getActionFromMethod = (method) => {
  switch (method.toUpperCase()) {
    case 'POST': return 'AJOUT';
    case 'PUT': 
    case 'PATCH': return 'MODIFICATION';
    case 'DELETE': return 'SUPPRESSION';
    default: return null;
  }
};