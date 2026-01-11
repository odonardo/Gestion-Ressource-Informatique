

// // services/api.ts - VERSION CORRIGÉE
// import axios from 'axios';
// import {
//   User,
//   Fournisseur,
//   Materiel,
//   Logiciel,
//   InstallationLogiciel,
//   Incident,
//   Alerte,
//   Reparation,
//   ProfilUtilisateur,
//   DashboardData,
//   LoginCredentials,
//   Reseau
// } from '../types';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'https://gestion-ressources-informatiques.onrender.com/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
//   timeout: 10000,
// });

// // Gestion du token CSRF
// const getCsrfToken = (): string => {
//   try {
//     const match = document.cookie.match(/csrftoken=([^;]+)/);
//     return match ? match[1] : '';
//   } catch (error) {
//     console.error('Erreur CSRF token:', error);
//     return '';
//   }
// };

// // Stockage du token
// let csrfToken = getCsrfToken();
// if (csrfToken) {
//   api.defaults.headers.common['X-CSRFToken'] = csrfToken;
// }

// // Stockage du token d'authentification
// const getAuthToken = (): string | null => {
//   return localStorage.getItem('auth_token') || 
//          localStorage.getItem('token') || 
//          localStorage.getItem('access_token');
// };

// // Intercepteur pour les requêtes - CORRIGÉ
// api.interceptors.request.use(
//   (config) => {
//     // Ajouter le token d'authentification pour TOUTES les requêtes
//     const authToken = getAuthToken();
//     if (authToken) {
//       // Essayer différents formats
//       config.headers.Authorization = `Token ${authToken}`;
//       // Alternative: `Bearer ${authToken}` selon votre backend
//     }
    
//     // Ajouter CSRF pour méthodes non-GET
//     if (csrfToken && config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
//       config.headers['X-CSRFToken'] = csrfToken;
//     }
    
//     console.log('📤 Requête:', {
//       method: config.method?.toUpperCase(),
//       url: config.url,
//       hasAuth: !!authToken,
//       authToken: authToken ? 'Oui' : 'Non'
//     });
    
//     return config;
//   },
//   (error) => {
//     console.error('❌ Erreur requête:', error);
//     return Promise.reject(error);
//   }
// );

// // Intercepteur pour les réponses
// api.interceptors.response.use(
//   (response) => {
//     console.log(`✅ ${response.status} ${response.config.url}`);
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     console.error('❌ Erreur API:', {
//       status: error.response?.status,
//       url: originalRequest?.url,
//       data: error.response?.data,
//     });

//     // Si erreur 401 et ce n'est pas une requête de login
//     if (error.response?.status === 401 && 
//         !originalRequest.url?.includes('/login/') &&
//         !originalRequest.url?.includes('/csrf/')) {
//       console.log('🔑 Token expiré ou invalide');
      
//       // Essayer de rafraîchir le token CSRF
//       try {
//         await api.get('/csrf/');
//         csrfToken = getCsrfToken();
//         if (csrfToken) {
//           api.defaults.headers.common['X-CSRFToken'] = csrfToken;
//         }
//       } catch (csrfError) {
//         console.error('❌ Échec rafraîchissement CSRF');
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // Fonctions d'authentification - SIMPLIFIÉES
// export const authAPI = {
//   login: async (credentials: LoginCredentials) => {
//     try {
//       console.log('🔐 Tentative de connexion...');
      
//       // Obtenir un token CSRF d'abord
//       await api.get('/csrf/');
//       csrfToken = getCsrfToken();
//       if (csrfToken) {
//         api.defaults.headers.common['X-CSRFToken'] = csrfToken;
//       }
      
//       // Se connecter
//       const response = await api.post('/login/', credentials);
//       console.log('✅ Connexion réussie');
      
//       // Stocker le token (gérer différents formats)
//       if (response.data.token) {
//         localStorage.setItem('auth_token', response.data.token);
//       } else if (response.data.key) {
//         localStorage.setItem('auth_token', response.data.key);
//       } else if (response.data.access) {
//         localStorage.setItem('auth_token', response.data.access);
//       }
      
//       // Stocker les infos utilisateur
//       if (response.data.user) {
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       }
      
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Échec connexion:', error.response?.data);
//       throw error;
//     }
//   },

//   logout: async () => {
//     try {
//       await api.post('/logout/');
//     } catch (error) {
//       console.warn('⚠️ Erreur logout:', error);
//     } finally {
//       localStorage.clear();
//       window.location.href = '/login';
//     }
//   },

//   checkAuth: async () => {
//     try {
//       const response = await api.get('/users/me/');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Non authentifié');
//       throw error;
//     }
//   }
// };

// // Fonction utilitaire pour extraire les données
// const extractData = (response: any): any[] => {
//   if (!response) return [];
  
//   // Si response est déjà un tableau
//   if (Array.isArray(response)) return response;
  
//   // Si response a une propriété data
//   if (response.data !== undefined) {
//     if (Array.isArray(response.data)) return response.data;
//     if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
//     if (typeof response.data === 'object') {
//       const values = Object.values(response.data);
//       if (values.length > 0) return values as any[];
//     }
//   }
  
//   return [];
// };

// // API pour les utilisateurs - VERSION SIMPLE ET FONCTIONNELLE
// export const usersAPI = {
//   // Méthode principale - SIMPLIFIÉE
//   getAll: async (): Promise<{ data: User[] }> => {
//     try {
//       console.log('🔄 Chargement des utilisateurs...');
      
//       // Essayer les endpoints les plus probables
//       const endpoints = [
//         '/users/',
//         '/utilisateurs/',
//         '/users/list/'
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai endpoint: ${endpoint}`);
//           const response = await api.get(endpoint);
//           console.log(`✅ Réponse de ${endpoint}:`, response.data);
          
//           const usersData = extractData(response);
          
//           if (usersData.length > 0) {
//             console.log(`✅ ${usersData.length} utilisateur(s) trouvé(s)`);
            
//             // Convertir au format User
//             const formattedUsers: User[] = usersData.map((user: any) => ({
//               id: user.id || 0,
//               username: user.username || `user_${user.id}`,
//               first_name: user.first_name || user.prenom || '',
//               last_name: user.last_name || user.nom || '',
//               email: user.email || '',
//               is_active: user.is_active !== undefined ? user.is_active : true,
//               date_joined: user.date_joined || user.date_creation || new Date().toISOString(),
//               role: user.role || user.role_utilisateur || 'user',
//               departement: user.departement || user.service || ''
//             }));
            
//             return { data: formattedUsers };
//           }
//         } catch (error: any) {
//           console.log(`❌ Endpoint ${endpoint} échoué:`, error.message);
//           continue;
//         }
//       }
      
//       // Si aucun endpoint ne fonctionne
//       console.warn('⚠️ Tous les endpoints utilisateur ont échoué');
//       return { data: [] };
      
//     } catch (error: any) {
//       console.error('❌ Erreur critique usersAPI.getAll():', error);
//       return { data: [] };
//     }
//   },
  
//   // Autres méthodes CRUD
//   getById: (id: number) => api.get<User>(`/users/${id}/`),
//   create: (data: Partial<User>) => api.post<User>('/users/', data),
//   update: (id: number, data: Partial<User>) => api.patch<User>(`/users/${id}/`, data),
//   delete: (id: number) => api.delete(`/users/${id}/`),
  
//   // Méthode utilitaire
//   formatUserName: (user: User): string => {
//     const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
//     return fullName ? `${fullName} (${user.username})` : user.username || `Utilisateur #${user.id}`;
//   }
// };

// // Fonction factory pour les endpoints standard
// const createApiEndpoint = <T>(endpoint: string) => ({
//   getAll: (params?: any) => api.get<T[]>(endpoint, { params }),
//   getById: (id: number) => api.get<T>(`${endpoint}${id}/`),
//   create: (data: Partial<T>) => api.post<T>(endpoint, data),
//   update: (id: number, data: Partial<T>) => api.patch<T>(`${endpoint}${id}/`, data),
//   delete: (id: number) => api.delete(`${endpoint}${id}/`),
// });

// // API pour les fournisseurs
// export const fournisseursAPI = createApiEndpoint<Fournisseur>('/fournisseurs/');

// // API pour les matériels
// export const materielsAPI = createApiEndpoint<Materiel>('/materiels/');

// // API pour les logiciels
// export const logicielsAPI = createApiEndpoint<Logiciel>('/logiciels/');

// // API pour les installations
// export const installationsAPI = createApiEndpoint<InstallationLogiciel>('/installations/');

// // API pour le réseau
// export const reseauAPI = createApiEndpoint<Reseau>('/reseau/');

// // API pour les incidents
// export const incidentsAPI = {
//   ...createApiEndpoint<Incident>('/incidents/'),
//   resoudre: (id: number) => api.post<Incident>(`/incidents/${id}/resoudre/`),
//   search: (query: string) => api.get<Incident[]>('/incidents/', { params: { search: query } }),
// };

// // API pour les alertes
// export const alertesAPI = createApiEndpoint<Alerte>('/alertes/');

// // API pour les réparations
// export const reparationsAPI = createApiEndpoint<Reparation>('/reparations/');

// // API pour les profils
// export const profilsUtilisateurAPI = createApiEndpoint<ProfilUtilisateur>('/profils-utilisateurs/');

// // API pour le dashboard
// export const dashboardAPI = {
//   getData: () => api.get<DashboardData>('/tableau-de-bord/'),
// };

// // Fonction pour gérer les erreurs
// export const handleApiError = (error: any): string => {
//   if (axios.isAxiosError(error)) {
//     if (!error.response) {
//       return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
//     }
    
//     const { status, data } = error.response;
    
//     if (typeof data === 'string') return data;
//     if (data.detail) return data.detail;
//     if (data.message) return data.message;
    
//     if (typeof data === 'object') {
//       const messages: string[] = [];
//       for (const [key, value] of Object.entries(data)) {
//         if (Array.isArray(value)) {
//           messages.push(`${key}: ${value.join(', ')}`);
//         } else if (typeof value === 'string') {
//           messages.push(value);
//         }
//       }
//       if (messages.length > 0) return messages.join('; ');
//     }
    
//     switch (status) {
//       case 400: return 'Requête invalide. Vérifiez les données saisies.';
//       case 401: return 'Non authentifié. Veuillez vous reconnecter.';
//       case 403: return 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
//       case 404: return 'Ressource non trouvée.';
//       case 500: return 'Erreur interne du serveur. Veuillez contacter l\'administrateur.';
//       default: return `Erreur ${status}`;
//     }
//   }
  
//   return error.message || 'Erreur inconnue';
// };

// // Export par défaut
// export default api;
// export { api };






// services/api.ts - VERSION FINALE CORRIGÉE
import axios from 'axios';
import {
  User,
  Fournisseur,
  Materiel,
  Logiciel,
  InstallationLogiciel,
  Incident,
  Alerte,
  Reparation,
  ProfilUtilisateur,
  DashboardData,
  LoginCredentials,
  Reseau
} from '../types';

// ==================== CONFIGURATION ====================
// IMPORTANT: Vérifier que VITE_API_URL est correctement chargé
console.log('⚙️ Configuration API - VITE_API_URL:', import.meta.env.VITE_API_URL);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';

// Créer deux instances axios : une avec /api, une sans
const apiWithPrefix = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Pour les endpoints /api/*
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

const apiWithoutPrefix = axios.create({
  baseURL: API_BASE_URL, // Pour les endpoints sans /api (login, logout, csrf)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// ==================== GESTION DES TOKENS ====================
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || 
         localStorage.getItem('token') || 
         localStorage.getItem('access_token');
};

let csrfToken = '';

const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  
  try {
    // Essayer de récupérer le token CSRF
    const response = await apiWithoutPrefix.get('/csrf/');
    if (response.data.csrfToken) {
      csrfToken = response.data.csrfToken;
    }
    
    // Vérifier aussi dans les cookies
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    if (match) {
      csrfToken = match[1];
    }
    
    // Appliquer aux deux instances
    if (csrfToken) {
      apiWithPrefix.defaults.headers.common['X-CSRFToken'] = csrfToken;
      apiWithoutPrefix.defaults.headers.common['X-CSRFToken'] = csrfToken;
    }
    
    return csrfToken;
  } catch (error) {
    console.warn('⚠️ Impossible de récupérer le token CSRF:', error);
    return '';
  }
};

// ==================== INTERCEPTEURS ====================
// Intercepteur pour apiWithPrefix
apiWithPrefix.interceptors.request.use(
  (config) => {
    const authToken = getAuthToken();
    if (authToken) {
      config.headers.Authorization = `Token ${authToken}`;
    }
    
    if (csrfToken && config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour apiWithoutPrefix
apiWithoutPrefix.interceptors.request.use(
  (config) => {
    const authToken = getAuthToken();
    if (authToken && !config.url?.includes('/login/') && !config.url?.includes('/csrf/')) {
      config.headers.Authorization = `Token ${authToken}`;
    }
    
    if (csrfToken && config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse commun
const responseInterceptor = {
  onFulfilled: (response: any) => response,
  onRejected: async (error: any) => {
    console.error('❌ Erreur API:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });

    // Gestion des erreurs CORS
    if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
      console.error('🛡️ Erreur CORS détectée');
      // Essayez avec un proxy CORS
      if (error.config && !error.config._retry) {
        error.config._retry = true;
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        error.config.url = corsProxy + error.config.baseURL?.replace(/^https?:\/\//, '') + error.config.url;
        return axios(error.config);
      }
    }

    return Promise.reject(error);
  }
};

apiWithPrefix.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);
apiWithoutPrefix.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);

// ==================== AUTHENTIFICATION ====================
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 Tentative de connexion...');
      console.log('URL:', `${API_BASE_URL}/login/`);
      
      // Essayer plusieurs formats d'endpoints
      const loginEndpoints = [
        '/login/',
        '/api/login/',
        '/auth/login/',
        '/api/auth/login/'
      ];
      
      let lastError: any = null;
      
      for (const endpoint of loginEndpoints) {
        try {
          console.log(`🔍 Essai endpoint: ${endpoint}`);
          
          const response = await apiWithoutPrefix.post(endpoint, credentials);
          
          console.log('✅ Connexion réussie via', endpoint);
          
          // Gestion des différents formats de réponse
          let token = null;
          let userData = null;
          
          if (response.data.token) token = response.data.token;
          else if (response.data.key) token = response.data.key;
          else if (response.data.access) token = response.data.access;
          else if (response.data.auth_token) token = response.data.auth_token;
          
          if (response.data.user) userData = response.data.user;
          else if (response.data) userData = response.data;
          
          // Stockage
          if (token) {
            localStorage.setItem('auth_token', token);
          }
          
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          // Récupérer le token CSRF après login
          await getCsrfToken();
          
          return response.data;
          
        } catch (error: any) {
          lastError = error;
          console.log(`❌ ${endpoint} échoué:`, error.response?.status || error.message);
          
          // Si ce n'est pas une 404, continuer à essayer
          if (error.response?.status !== 404) {
            break;
          }
        }
      }
      
      throw lastError || new Error('Aucun endpoint de login disponible');
      
    } catch (error: any) {
      console.error('❌ Échec connexion:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect.');
      } else if (error.response?.status === 404) {
        throw new Error('Endpoint de login non trouvé sur le serveur.');
      } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez la configuration CORS.');
      } else {
        throw new Error('Erreur de connexion: ' + (error.response?.data?.detail || error.message));
      }
    }
  },

  logout: async () => {
    try {
      await apiWithoutPrefix.post('/logout/');
    } catch (error) {
      console.warn('⚠️ Erreur logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      csrfToken = '';
      window.location.href = '/login';
    }
  },

  checkAuth: async () => {
    try {
      const response = await apiWithPrefix.get('/users/me/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// ==================== FONCTIONS UTILITAIRES ====================
const extractData = (response: any): any[] => {
  if (!response?.data) return [];
  
  const { data } = response;
  
  if (Array.isArray(data)) return data;
  if (data.results && Array.isArray(data.results)) return data.results;
  if (typeof data === 'object') {
    const values = Object.values(data);
    if (values.length > 0 && Array.isArray(values[0])) return values[0];
    return [data];
  }
  
  return [];
};

// Fonction pour tester la connexion
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await apiWithoutPrefix.get('/', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('❌ Serveur inaccessible');
    return false;
  }
};

// ==================== API ENDPOINTS ====================
// Fonction factory simplifiée
const createApiEndpoint = <T>(endpoint: string) => ({
  getAll: (params?: any) => apiWithPrefix.get<T[]>(endpoint, { params }),
  getById: (id: number) => apiWithPrefix.get<T>(`${endpoint}${id}/`),
  create: (data: Partial<T>) => apiWithPrefix.post<T>(endpoint, data),
  update: (id: number, data: Partial<T>) => apiWithPrefix.patch<T>(`${endpoint}${id}/`, data),
  delete: (id: number) => apiWithPrefix.delete(`${endpoint}${id}/`),
});

// API pour les utilisateurs
export const usersAPI = {
  getAll: async (): Promise<{ data: User[] }> => {
    try {
      const response = await apiWithPrefix.get('/users/');
      const usersData = extractData(response);
      
      const formattedUsers: User[] = usersData.map((user: any) => ({
        id: user.id || 0,
        username: user.username || `user_${user.id}`,
        first_name: user.first_name || user.prenom || '',
        last_name: user.last_name || user.nom || '',
        email: user.email || '',
        is_active: user.is_active !== false,
        date_joined: user.date_joined || new Date().toISOString(),
        role: user.role || 'user',
        departement: user.departement || ''
      }));
      
      return { data: formattedUsers };
    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error);
      return { data: [] };
    }
  },
  getById: (id: number) => apiWithPrefix.get<User>(`/users/${id}/`),
  create: (data: Partial<User>) => apiWithPrefix.post<User>('/users/', data),
  update: (id: number, data: Partial<User>) => apiWithPrefix.patch<User>(`/users/${id}/`, data),
  delete: (id: number) => apiWithPrefix.delete(`/users/${id}/`)
};

// Autres APIs
export const fournisseursAPI = createApiEndpoint<Fournisseur>('/fournisseurs/');
export const materielsAPI = createApiEndpoint<Materiel>('/materiels/');
export const logicielsAPI = createApiEndpoint<Logiciel>('/logiciels/');
export const installationsAPI = createApiEndpoint<InstallationLogiciel>('/installations/');
export const reseauAPI = createApiEndpoint<Reseau>('/reseau/');
export const alertesAPI = createApiEndpoint<Alerte>('/alertes/');
export const reparationsAPI = createApiEndpoint<Reparation>('/reparations/');
export const profilsUtilisateurAPI = createApiEndpoint<ProfilUtilisateur>('/profils-utilisateurs/');

// API pour les incidents (spécial)
export const incidentsAPI = {
  ...createApiEndpoint<Incident>('/incidents/'),
  resoudre: (id: number) => apiWithPrefix.post<Incident>(`/incidents/${id}/resoudre/`),
  search: (query: string) => apiWithPrefix.get<Incident[]>('/incidents/', { params: { search: query } }),
};

// API pour le dashboard
export const dashboardAPI = {
  getData: () => apiWithPrefix.get<DashboardData>('/tableau-de-bord/'),
};

// ==================== GESTION DES ERREURS ====================
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ERR_NETWORK') {
        return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
      }
      return 'Erreur réseau. Le serveur est peut-être indisponible.';
    }
    
    const { status, data } = error.response;
    
    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
    if (typeof data === 'string') return data;
    
    if (typeof data === 'object') {
      const messages: string[] = [];
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          messages.push(`${key}: ${value.join(', ')}`);
        } else if (typeof value === 'string') {
          messages.push(value);
        }
      }
      if (messages.length > 0) return messages.join('; ');
    }
    
    switch (status) {
      case 400: return 'Données invalides. Vérifiez les informations saisies.';
      case 401: return 'Session expirée. Veuillez vous reconnecter.';
      case 403: return 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
      case 404: return 'Ressource non trouvée.';
      case 500: return 'Erreur interne du serveur. Veuillez contacter l\'administrateur.';
      default: return `Erreur ${status}: ${error.message}`;
    }
  }
  
  return error.message || 'Erreur inconnue';
};

// ==================== EXPORTS ====================
export { apiWithPrefix as api, apiWithoutPrefix };
export default apiWithPrefix;