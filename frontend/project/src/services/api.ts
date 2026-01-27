




// // services/api.ts - VERSION FINALE CORRIGÉE
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

// // ==================== CONFIGURATION ====================
// // IMPORTANT: Vérifier que VITE_API_URL est correctement chargé
// console.log('⚙️ Configuration API - VITE_API_URL:', import.meta.env.VITE_API_URL);

// // const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';
// const API_BASE_URL = 'https://gestion-ressource-informatique.onrender.com';

// // Créer deux instances axios : une avec /api, une sans
// const apiWithPrefix = axios.create({
//   baseURL: `${API_BASE_URL}/api`, // Pour les endpoints /api/*
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
//   timeout: 15000,
// });

// const apiWithoutPrefix = axios.create({
//   baseURL: API_BASE_URL, // Pour les endpoints sans /api (login, logout, csrf)
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
//   timeout: 15000,
// });

// // ==================== GESTION DES TOKENS ====================
// const getAuthToken = (): string | null => {
//   return localStorage.getItem('auth_token') || 
//          localStorage.getItem('token') || 
//          localStorage.getItem('access_token');
// };

// let csrfToken = '';

// const getCsrfToken = async (): Promise<string> => {
//   if (csrfToken) return csrfToken;
  
//   try {
//     // Essayer de récupérer le token CSRF
//     const response = await apiWithoutPrefix.get('/csrf/');
//     if (response.data.csrfToken) {
//       csrfToken = response.data.csrfToken;
//     }
    
//     // Vérifier aussi dans les cookies
//     const match = document.cookie.match(/csrftoken=([^;]+)/);
//     if (match) {
//       csrfToken = match[1];
//     }
    
//     // Appliquer aux deux instances
//     if (csrfToken) {
//       apiWithPrefix.defaults.headers.common['X-CSRFToken'] = csrfToken;
//       apiWithoutPrefix.defaults.headers.common['X-CSRFToken'] = csrfToken;
//     }
    
//     return csrfToken;
//   } catch (error) {
//     console.warn('⚠️ Impossible de récupérer le token CSRF:', error);
//     return '';
//   }
// };

// // ==================== INTERCEPTEURS ====================
// // Intercepteur pour apiWithPrefix
// apiWithPrefix.interceptors.request.use(
//   (config) => {
//     const authToken = getAuthToken();
//     if (authToken) {
//       config.headers.Authorization = `Token ${authToken}`;
//     }
    
//     if (csrfToken && config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
//       config.headers['X-CSRFToken'] = csrfToken;
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Intercepteur pour apiWithoutPrefix
// apiWithoutPrefix.interceptors.request.use(
//   (config) => {
//     const authToken = getAuthToken();
//     if (authToken && !config.url?.includes('/login/') && !config.url?.includes('/csrf/')) {
//       config.headers.Authorization = `Token ${authToken}`;
//     }
    
//     if (csrfToken && config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
//       config.headers['X-CSRFToken'] = csrfToken;
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Intercepteur de réponse commun
// const responseInterceptor = {
//   onFulfilled: (response: any) => response,
//   onRejected: async (error: any) => {
//     console.error('❌ Erreur API:', {
//       status: error.response?.status,
//       url: error.config?.url,
//       message: error.message,
//       data: error.response?.data
//     });

//     // Gestion des erreurs CORS
//     if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
//       console.error('🛡️ Erreur CORS détectée');
//       // Essayez avec un proxy CORS
//       if (error.config && !error.config._retry) {
//         error.config._retry = true;
//         const corsProxy = 'https://cors-anywhere.herokuapp.com/';
//         error.config.url = corsProxy + error.config.baseURL?.replace(/^https?:\/\//, '') + error.config.url;
//         return axios(error.config);
//       }
//     }

//     return Promise.reject(error);
//   }
// };

// apiWithPrefix.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);
// apiWithoutPrefix.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);

// // ==================== AUTHENTIFICATION ====================
// export const authAPI = {
//   login: async (credentials: LoginCredentials) => {
//     try {
//       console.log('🔐 Tentative de connexion...');
//       console.log('URL:', `${API_BASE_URL}/login/`);
      
//       // Essayer plusieurs formats d'endpoints
//       const loginEndpoints = [
//         '/login/',
//         '/api/login/',
//         '/auth/login/',
//         '/api/auth/login/'
//       ];
      
//       let lastError: any = null;
      
//       for (const endpoint of loginEndpoints) {
//         try {
//           console.log(`🔍 Essai endpoint: ${endpoint}`);
          
//           const response = await apiWithoutPrefix.post(endpoint, credentials);
          
//           console.log('✅ Connexion réussie via', endpoint);
          
//           // Gestion des différents formats de réponse
//           let token = null;
//           let userData = null;
          
//           if (response.data.token) token = response.data.token;
//           else if (response.data.key) token = response.data.key;
//           else if (response.data.access) token = response.data.access;
//           else if (response.data.auth_token) token = response.data.auth_token;
          
//           if (response.data.user) userData = response.data.user;
//           else if (response.data) userData = response.data;
          
//           // Stockage
//           if (token) {
//             localStorage.setItem('auth_token', token);
//           }
          
//           if (userData) {
//             localStorage.setItem('user', JSON.stringify(userData));
//           }
          
//           // Récupérer le token CSRF après login
//           await getCsrfToken();
          
//           return response.data;
          
//         } catch (error: any) {
//           lastError = error;
//           console.log(`❌ ${endpoint} échoué:`, error.response?.status || error.message);
          
//           // Si ce n'est pas une 404, continuer à essayer
//           if (error.response?.status !== 404) {
//             break;
//           }
//         }
//       }
      
//       throw lastError || new Error('Aucun endpoint de login disponible');
      
//     } catch (error: any) {
//       console.error('❌ Échec connexion:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data
//       });
      
//       if (error.response?.status === 401) {
//         throw new Error('Nom d\'utilisateur ou mot de passe incorrect.');
//       } else if (error.response?.status === 404) {
//         throw new Error('Endpoint de login non trouvé sur le serveur.');
//       } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {
//         throw new Error('Impossible de se connecter au serveur. Vérifiez la configuration CORS.');
//       } else {
//         throw new Error('Erreur de connexion: ' + (error.response?.data?.detail || error.message));
//       }
//     }
//   },

//   logout: async () => {
//     try {
//       await apiWithoutPrefix.post('/logout/');
//     } catch (error) {
//       console.warn('⚠️ Erreur logout:', error);
//     } finally {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user');
//       csrfToken = '';
//       window.location.href = '/login';
//     }
//   },

//   checkAuth: async () => {
//     try {
//       const response = await apiWithPrefix.get('/users/me/');
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// // ==================== FONCTIONS UTILITAIRES ====================
// const extractData = (response: any): any[] => {
//   if (!response?.data) return [];
  
//   const { data } = response;
  
//   if (Array.isArray(data)) return data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   if (typeof data === 'object') {
//     const values = Object.values(data);
//     if (values.length > 0 && Array.isArray(values[0])) return values[0];
//     return [data];
//   }
  
//   return [];
// };

// // Fonction pour tester la connexion
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     const response = await apiWithoutPrefix.get('/', { timeout: 5000 });
//     return response.status === 200;
//   } catch (error) {
//     console.error('❌ Serveur inaccessible');
//     return false;
//   }
// };

// // ==================== API ENDPOINTS ====================
// // Fonction factory simplifiée
// const createApiEndpoint = <T>(endpoint: string) => ({
//   getAll: (params?: any) => apiWithPrefix.get<T[]>(endpoint, { params }),
//   getById: (id: number) => apiWithPrefix.get<T>(`${endpoint}${id}/`),
//   create: (data: Partial<T>) => apiWithPrefix.post<T>(endpoint, data),
//   update: (id: number, data: Partial<T>) => apiWithPrefix.patch<T>(`${endpoint}${id}/`, data),
//   delete: (id: number) => apiWithPrefix.delete(`${endpoint}${id}/`),
// });

// // API pour les utilisateurs
// export const usersAPI = {
//   getAll: async (): Promise<{ data: User[] }> => {
//     try {
//       const response = await apiWithPrefix.get('/users/');
//       const usersData = extractData(response);
      
//       const formattedUsers: User[] = usersData.map((user: any) => ({
//         id: user.id || 0,
//         username: user.username || `user_${user.id}`,
//         first_name: user.first_name || user.prenom || '',
//         last_name: user.last_name || user.nom || '',
//         email: user.email || '',
//         is_active: user.is_active !== false,
//         date_joined: user.date_joined || new Date().toISOString(),
//         role: user.role || 'user',
//         departement: user.departement || ''
//       }));
      
//       return { data: formattedUsers };
//     } catch (error) {
//       console.error('❌ Erreur chargement utilisateurs:', error);
//       return { data: [] };
//     }
//   },
//   getById: (id: number) => apiWithPrefix.get<User>(`/users/${id}/`),
//   create: (data: Partial<User>) => apiWithPrefix.post<User>('/users/', data),
//   update: (id: number, data: Partial<User>) => apiWithPrefix.patch<User>(`/users/${id}/`, data),
//   delete: (id: number) => apiWithPrefix.delete(`/users/${id}/`)
// };

// // Autres APIs
// export const fournisseursAPI = createApiEndpoint<Fournisseur>('/fournisseurs/');
// export const materielsAPI = createApiEndpoint<Materiel>('/materiels/');
// export const logicielsAPI = createApiEndpoint<Logiciel>('/logiciels/');
// export const installationsAPI = createApiEndpoint<InstallationLogiciel>('/installations/');
// export const reseauAPI = createApiEndpoint<Reseau>('/reseau/');
// export const alertesAPI = createApiEndpoint<Alerte>('/alertes/');
// export const reparationsAPI = createApiEndpoint<Reparation>('/reparations/');
// export const profilsUtilisateurAPI = createApiEndpoint<ProfilUtilisateur>('/profils-utilisateurs/');

// // API pour les incidents (spécial)
// export const incidentsAPI = {
//   ...createApiEndpoint<Incident>('/incidents/'),
//   resoudre: (id: number) => apiWithPrefix.post<Incident>(`/incidents/${id}/resoudre/`),
//   search: (query: string) => apiWithPrefix.get<Incident[]>('/incidents/', { params: { search: query } }),
// };

// // API pour le dashboard
// export const dashboardAPI = {
//   getData: () => apiWithPrefix.get<DashboardData>('/tableau-de-bord/'),
// };

// // ==================== GESTION DES ERREURS ====================
// export const handleApiError = (error: any): string => {
//   if (axios.isAxiosError(error)) {
//     if (!error.response) {
//       if (error.code === 'ERR_NETWORK') {
//         return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
//       }
//       return 'Erreur réseau. Le serveur est peut-être indisponible.';
//     }
    
//     const { status, data } = error.response;
    
//     if (data?.detail) return data.detail;
//     if (data?.message) return data.message;
//     if (typeof data === 'string') return data;
    
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
//       case 400: return 'Données invalides. Vérifiez les informations saisies.';
//       case 401: return 'Session expirée. Veuillez vous reconnecter.';
//       case 403: return 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
//       case 404: return 'Ressource non trouvée.';
//       case 500: return 'Erreur interne du serveur. Veuillez contacter l\'administrateur.';
//       default: return `Erreur ${status}: ${error.message}`;
//     }
//   }
  
//   return error.message || 'Erreur inconnue';
// };

// // ==================== EXPORTS ====================
// export { apiWithPrefix as api, apiWithoutPrefix };
// export default apiWithPrefix;






// // services/api.ts - VERSION CORRIGÉE ET COMPLÈTE
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
//   Reseau,
//   HistoriqueAction,
//   StatistiquesHistorique
// } from '../types';

// // ==================== CONFIGURATION ====================
// console.log('⚙️ Configuration API - VITE_API_URL:', import.meta.env.VITE_API_URL);

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';

// // Créer deux instances axios : une avec /api, une sans
// const apiWithPrefix = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
//   timeout: 15000,
// });

// const apiWithoutPrefix = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
//   timeout: 15000,
// });

// // ==================== GESTION DES TOKENS ====================
// const getAuthToken = (): string | null => {
//   return localStorage.getItem('auth_token') || 
//          localStorage.getItem('token') || 
//          localStorage.getItem('access_token');
// };

// let csrfToken = '';

// const getCsrfToken = async (): Promise<string> => {
//   if (csrfToken) return csrfToken;
  
//   try {
//     const response = await apiWithoutPrefix.get('/csrf/');
//     if (response.data.csrfToken) {
//       csrfToken = response.data.csrfToken;
//     }
    
//     const match = document.cookie.match(/csrftoken=([^;]+)/);
//     if (match) {
//       csrfToken = match[1];
//     }
    
//     if (csrfToken) {
//       apiWithPrefix.defaults.headers.common['X-CSRFToken'] = csrfToken;
//       apiWithoutPrefix.defaults.headers.common['X-CSRFToken'] = csrfToken;
//     }
    
//     return csrfToken;
//   } catch (error) {
//     console.warn('⚠️ Impossible de récupérer le token CSRF:', error);
//     return '';
//   }
// };

// // ==================== INTERCEPTEURS ====================
// apiWithPrefix.interceptors.request.use(
//   (config) => {
//     const authToken = getAuthToken();
//     if (authToken) {
//       config.headers.Authorization = `Token ${authToken}`;
//     }
    
//     if (csrfToken && config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
//       config.headers['X-CSRFToken'] = csrfToken;
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiWithoutPrefix.interceptors.request.use(
//   (config) => {
//     const authToken = getAuthToken();
//     if (authToken && !config.url?.includes('/login/') && !config.url?.includes('/csrf/')) {
//       config.headers.Authorization = `Token ${authToken}`;
//     }
    
//     if (csrfToken && config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
//       config.headers['X-CSRFToken'] = csrfToken;
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const responseInterceptor = {
//   onFulfilled: (response: any) => response,
//   onRejected: async (error: any) => {
//     console.error('❌ Erreur API:', {
//       status: error.response?.status,
//       url: error.config?.url,
//       message: error.message,
//       data: error.response?.data
//     });

//     if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
//       console.error('🛡️ Erreur CORS détectée');
//     }

//     return Promise.reject(error);
//   }
// };

// apiWithPrefix.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);
// apiWithoutPrefix.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);

// // ==================== FONCTION UTILITAIRE ====================
// const extractData = (response: any): any[] => {
//   if (!response?.data) return [];
  
//   const { data } = response;
  
//   if (Array.isArray(data)) return data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   if (typeof data === 'object') {
//     const values = Object.values(data);
//     if (values.length > 0 && Array.isArray(values[0])) return values[0];
//     return [data];
//   }
  
//   return [];
// };

// // ==================== AUTHENTIFICATION ====================
// export const authAPI = {
//   login: async (credentials: LoginCredentials) => {
//     try {
//       console.log('🔐 Tentative de connexion...');
      
//       const loginEndpoints = ['/login/', '/api/login/', '/auth/login/', '/api/auth/login/'];
//       let lastError: any = null;
      
//       for (const endpoint of loginEndpoints) {
//         try {
//           console.log(`🔍 Essai endpoint: ${endpoint}`);
//           const response = await apiWithoutPrefix.post(endpoint, credentials);
//           console.log('✅ Connexion réussie via', endpoint);
          
//           let token = null;
//           let userData = null;
          
//           if (response.data.token) token = response.data.token;
//           else if (response.data.key) token = response.data.key;
//           else if (response.data.access) token = response.data.access;
//           else if (response.data.auth_token) token = response.data.auth_token;
          
//           if (response.data.user) userData = response.data.user;
//           else if (response.data) userData = response.data;
          
//           if (token) localStorage.setItem('auth_token', token);
//           if (userData) localStorage.setItem('user', JSON.stringify(userData));
          
//           await getCsrfToken();
//           return response.data;
          
//         } catch (error: any) {
//           lastError = error;
//           console.log(`❌ ${endpoint} échoué:`, error.response?.status || error.message);
//           if (error.response?.status !== 404) break;
//         }
//       }
      
//       throw lastError || new Error('Aucun endpoint de login disponible');
      
//     } catch (error: any) {
//       console.error('❌ Échec connexion:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data
//       });
      
//       if (error.response?.status === 401) {
//         throw new Error('Nom d\'utilisateur ou mot de passe incorrect.');
//       } else if (error.response?.status === 404) {
//         throw new Error('Endpoint de login non trouvé sur le serveur.');
//       } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {
//         throw new Error('Impossible de se connecter au serveur. Vérifiez la configuration CORS.');
//       } else {
//         throw new Error('Erreur de connexion: ' + (error.response?.data?.detail || error.message));
//       }
//     }
//   },

//   logout: async () => {
//     try {
//       await apiWithoutPrefix.post('/logout/');
//     } catch (error) {
//       console.warn('⚠️ Erreur logout:', error);
//     } finally {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user');
//       csrfToken = '';
//       window.location.href = '/login';
//     }
//   },

//   checkAuth: async () => {
//     try {
//       const response = await apiWithPrefix.get('/users/me/');
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// // ==================== FONCTION FACTORY POUR LES ENDPOINTS ====================
// const createApiEndpoint = <T>(endpoint: string) => ({
//   getAll: (params?: any) => apiWithPrefix.get<T[]>(endpoint, { params }).then(response => ({
//     data: extractData(response),
//     response
//   })),
//   getById: (id: number) => apiWithPrefix.get<T>(`${endpoint}${id}/`),
//   create: (data: Partial<T>) => apiWithPrefix.post<T>(endpoint, data),
//   update: (id: number, data: Partial<T>) => apiWithPrefix.patch<T>(`${endpoint}${id}/`, data),
//   delete: (id: number) => apiWithPrefix.delete(`${endpoint}${id}/`),
// });

// // ==================== API ENDPOINTS ====================
// // API pour les utilisateurs
// export const usersAPI = {
//   getAll: async () => {
//     try {
//       const response = await apiWithPrefix.get('/users/');
//       const usersData = extractData(response);
      
//       const formattedUsers: User[] = usersData.map((user: any) => ({
//         id: user.id || 0,
//         username: user.username || `user_${user.id}`,
//         first_name: user.first_name || '',
//         last_name: user.last_name || '',
//         email: user.email || '',
//         is_active: user.is_active !== false,
//         date_joined: user.date_joined || new Date().toISOString(),
//         role: user.role || 'user',
//         departement: user.departement || ''
//       }));
      
//       return { data: formattedUsers };
//     } catch (error) {
//       console.error('❌ Erreur chargement utilisateurs:', error);
//       return { data: [] };
//     }
//   },
//   getById: (id: number) => apiWithPrefix.get<User>(`/users/${id}/`),
//   create: (data: Partial<User>) => apiWithPrefix.post<User>('/users/', data),
//   update: (id: number, data: Partial<User>) => apiWithPrefix.patch<User>(`/users/${id}/`, data),
//   delete: (id: number) => apiWithPrefix.delete(`/users/${id}/`)
// };

// // Autres APIs
// export const fournisseursAPI = createApiEndpoint<Fournisseur>('/fournisseurs/');
// export const materielsAPI = createApiEndpoint<Materiel>('/materiels/');
// export const logicielsAPI = createApiEndpoint<Logiciel>('/logiciels/');
// export const installationsAPI = createApiEndpoint<InstallationLogiciel>('/installations/');
// export const reseauAPI = createApiEndpoint<Reseau>('/reseau/');
// export const alertesAPI = createApiEndpoint<Alerte>('/alertes/');
// export const reparationsAPI = createApiEndpoint<Reparation>('/reparations/');
// export const profilsUtilisateurAPI = createApiEndpoint<ProfilUtilisateur>('/profils-utilisateurs/');

// // API pour les incidents
// export const incidentsAPI = {
//   ...createApiEndpoint<Incident>('/incidents/'),
//   resoudre: (id: number) => apiWithPrefix.post<Incident>(`/incidents/${id}/resoudre/`),
//   search: (query: string) => apiWithPrefix.get<Incident[]>('/incidents/', { params: { search: query } }),
// };

// // API pour le dashboard
// export const dashboardAPI = {
//   getData: () => apiWithPrefix.get<DashboardData>('/tableau-de-bord/'),
// };

// // API pour l'historique
// export const historiqueAPI = {
//   getAll: (params?: any) => apiWithPrefix.get<HistoriqueAction[]>('/historique/', { params }).then(response => ({
//     data: extractData(response),
//     response
//   })),
//   getById: (id: number) => apiWithPrefix.get<HistoriqueAction>(`/historique/${id}/`),
//   statistiques: () => apiWithPrefix.get<StatistiquesHistorique>('/historique/statistiques/'),
//   mesActions: () => apiWithPrefix.get<HistoriqueAction[]>('/historique/mes_actions/'),
//   modules: () => apiWithPrefix.get<any[]>('/historique/modules/'),
//   actions: () => apiWithPrefix.get<any[]>('/historique/actions/'),
// };

// // ==================== GESTION DES ERREURS ====================
// export const handleApiError = (error: any): string => {
//   if (axios.isAxiosError(error)) {
//     if (!error.response) {
//       if (error.code === 'ERR_NETWORK') {
//         return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
//       }
//       return 'Erreur réseau. Le serveur est peut-être indisponible.';
//     }
    
//     const { status, data } = error.response;
    
//     if (data?.detail) return data.detail;
//     if (data?.message) return data.message;
//     if (typeof data === 'string') return data;
    
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
//       case 400: return 'Données invalides. Vérifiez les informations saisies.';
//       case 401: return 'Session expirée. Veuillez vous reconnecter.';
//       case 403: return 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
//       case 404: return 'Ressource non trouvée.';
//       case 500: return 'Erreur interne du serveur. Veuillez contacter l\'administrateur.';
//       default: return `Erreur ${status}: ${error.message}`;
//     }
//   }
  
//   return error.message || 'Erreur inconnue';
// };

// // ==================== TESTS DE CONNEXION ====================
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     const response = await apiWithoutPrefix.get('/', { timeout: 5000 });
//     return response.status === 200;
//   } catch (error) {
//     console.error('❌ Serveur inaccessible');
//     return false;
//   }
// };

// // ==================== EXPORTS ====================
// export { apiWithPrefix as api, apiWithoutPrefix };
// export default apiWithPrefix;



// services/api.ts - VERSION CORRIGÉE ET COMPLÈTE
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
  Reseau,
  HistoriqueAction,
  StatistiquesHistorique
} from '../types';

// ==================== CONFIGURATION ====================
console.log('⚙️ Configuration API - VITE_API_URL:', import.meta.env.VITE_API_URL);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';



// Créer deux instances axios : une avec /api, une sans
const apiWithPrefix = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

const apiWithoutPrefix = axios.create({
  baseURL: API_BASE_URL,
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
    const response = await apiWithoutPrefix.get('/csrf/');
    if (response.data.csrfToken) {
      csrfToken = response.data.csrfToken;
    }
    
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    if (match) {
      csrfToken = match[1];
    }
    
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

const responseInterceptor = {
  onFulfilled: (response: any) => response,
  onRejected: async (error: any) => {
    console.error('❌ Erreur API:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });

    if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
      console.error('🛡️ Erreur CORS détectée');
    }

    return Promise.reject(error);
  }
};

apiWithPrefix.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);
apiWithoutPrefix.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);

// ==================== FONCTION UTILITAIRE ====================
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

// Fonction utilitaire pour extraire les données de n'importe quelle réponse
const extractDataFromResponse = (response: any): any[] => {
  if (!response) return [];
  
  // Si la réponse a déjà été extraite via extractData
  if (Array.isArray(response)) return response;
  
  // Si c'est une réponse axios
  if (response.data) {
    return extractData(response);
  }
  
  // Si c'est un objet avec une propriété 'data'
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Si c'est un objet avec une propriété 'results'
  if (response.results && Array.isArray(response.results)) {
    return response.results;
  }
  
  return [];
};

// ==================== AUTHENTIFICATION ====================
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 Tentative de connexion...');
      
      const loginEndpoints = ['/login/', '/api/login/', '/auth/login/', '/api/auth/login/'];
      let lastError: any = null;
      
      for (const endpoint of loginEndpoints) {
        try {
          console.log(`🔍 Essai endpoint: ${endpoint}`);
          const response = await apiWithoutPrefix.post(endpoint, credentials);
          console.log('✅ Connexion réussie via', endpoint);
          
          let token = null;
          let userData = null;
          
          if (response.data.token) token = response.data.token;
          else if (response.data.key) token = response.data.key;
          else if (response.data.access) token = response.data.access;
          else if (response.data.auth_token) token = response.data.auth_token;
          
          if (response.data.user) userData = response.data.user;
          else if (response.data) userData = response.data;
          
          if (token) localStorage.setItem('auth_token', token);
          if (userData) localStorage.setItem('user', JSON.stringify(userData));
          
          await getCsrfToken();
          return response.data;
          
        } catch (error: any) {
          lastError = error;
          console.log(`❌ ${endpoint} échoué:`, error.response?.status || error.message);
          if (error.response?.status !== 404) break;
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

// ==================== FONCTION FACTORY POUR LES ENDPOINTS ====================
const createApiEndpoint = <T>(endpoint: string) => ({
  getAll: (params?: any) => apiWithPrefix.get<T[]>(endpoint, { params }).then(response => ({
    data: extractData(response),
    response
  })),
  getById: (id: number) => apiWithPrefix.get<T>(`${endpoint}${id}/`),
  create: (data: Partial<T>) => apiWithPrefix.post<T>(endpoint, data),
  update: (id: number, data: Partial<T>) => apiWithPrefix.patch<T>(`${endpoint}${id}/`, data),
  delete: (id: number) => apiWithPrefix.delete(`${endpoint}${id}/`),
});

// ==================== API ENDPOINTS ====================
// API pour les utilisateurs
export const usersAPI = {
  getAll: async () => {
    try {
      const response = await apiWithPrefix.get('/users/');
      const usersData = extractData(response);
      
      const formattedUsers: User[] = usersData.map((user: any) => ({
        id: user.id || 0,
        username: user.username || `user_${user.id}`,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
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

// API pour les incidents
export const incidentsAPI = {
  ...createApiEndpoint<Incident>('/incidents/'),
  resoudre: (id: number) => apiWithPrefix.post<Incident>(`/incidents/${id}/resoudre/`),
  search: (query: string) => apiWithPrefix.get<Incident[]>('/incidents/', { params: { search: query } }),
};

// API pour le dashboard
export const dashboardAPI = {
  getData: () => apiWithPrefix.get<DashboardData>('/tableau-de-bord/'),
};

// API pour l'historique
export const historiqueAPI = {
  getAll: (params?: any) => apiWithPrefix.get<HistoriqueAction[]>('/historique/', { params }).then(response => ({
    data: extractData(response),
    response
  })),
  getById: (id: number) => apiWithPrefix.get<HistoriqueAction>(`/historique/${id}/`),
  statistiques: () => apiWithPrefix.get<StatistiquesHistorique>('/historique/statistiques/'),
  mesActions: () => apiWithPrefix.get<HistoriqueAction[]>('/historique/mes_actions/'),
  modules: () => apiWithPrefix.get<any[]>('/historique/modules/'),
  actions: () => apiWithPrefix.get<any[]>('/historique/actions/'),
};

// ==================== API SPÉCIFIQUE POUR MATÉRIELS EN PANNE ====================
export const materielsPanneAPI = {
  /**
   * Récupère UNIQUEMENT les matériels en panne (pour le formulaire d'incident)
   */
  getMaterielsEnPanne: async (): Promise<Materiel[]> => {
    try {
      console.log('🔍 Chargement des matériels en panne...');
      
      // Essayer différents endpoints possibles - LES VRAIES URLS DE VOTRE BACKEND
      const endpoints = [
        '/materiels-panne/', // VOTRE ENDPOINT PRINCIPAL
        '/api/materiels-panne/', 
        '/materiels/en_panne/',
        '/api/materiels/en_panne/',
        '/materiels/?etat=en_panne',
        '/api/materiels/?etat=en_panne',
        '/materiels/?pour_incident=true',
        '/api/materiels/?pour_incident=true'
      ];
      
      let lastError: any = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Essai endpoint matériels en panne: ${endpoint}`);
          
          // Toutes les URLs commencent par /api/ dans notre configuration
          const apiClient = apiWithPrefix;
          
          const response = await apiClient.get(endpoint);
          
          console.log('✅ Matériels en panne chargés via', endpoint);
          console.log('📦 Données reçues:', response.data);
          
          // Extraire les données selon le format de réponse
          let materielsData: any[] = [];
          
          if (Array.isArray(response.data)) {
            materielsData = response.data;
          } else if (response.data?.materiels && Array.isArray(response.data.materiels)) {
            materielsData = response.data.materiels;
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            materielsData = response.data.data;
          } else if (response.data?.results && Array.isArray(response.data.results)) {
            materielsData = response.data.results;
          } else if (typeof response.data === 'object') {
            // Chercher le premier tableau dans l'objet
            for (const key in response.data) {
              if (Array.isArray(response.data[key])) {
                materielsData = response.data[key];
                break;
              }
            }
          }
          
          // Si toujours vide, essayer extractData
          if (materielsData.length === 0) {
            materielsData = extractDataFromResponse(response);
          }
          
          // Formater les matériels
          const formattedMateriels: Materiel[] = materielsData.map((materiel: any) => ({
            id: materiel.id || materiel.pk || 0,
            nom: materiel.nom || materiel.name || materiel.libelle || `Matériel ${materiel.id || ''}`,
            reference: materiel.reference || materiel.reference_id || materiel.serial || materiel.numero_serie || 'N/A',
            date_achat: materiel.date_achat || materiel.achat_date || materiel.date_acquisition || '',
            etat: materiel.etat || materiel.status || materiel.state || 'en_panne',
            service_attribue: materiel.service_attribue || materiel.service || materiel.departement || materiel.department || 'Non spécifié',
            utilisateur_attribue: materiel.utilisateur_attribue || materiel.utilisateur || materiel.user || materiel.assignee || 'Non attribué',
            fournisseur: materiel.fournisseur || materiel.fournisseur_id || materiel.supplier || 0,
            created_at: materiel.created_at || materiel.date_creation || new Date().toISOString(),
            updated_at: materiel.updated_at || materiel.date_modification || new Date().toISOString()
          }));
          
          console.log(`✅ ${formattedMateriels.length} matériel(s) en panne trouvé(s)`);
          return formattedMateriels;
          
        } catch (error: any) {
          lastError = error;
          console.log(`❌ ${endpoint} échoué:`, error.response?.status || error.message);
          
          // Si c'est une 404, continuer à essayer d'autres endpoints
          if (error.response?.status === 404) {
            continue;
          }
          
          // Pour les autres erreurs, arrêter la boucle
          break;
        }
      }
      
      // Si aucun endpoint ne fonctionne, essayer avec materielsAPI.getAll et filtrer côté client
      if (lastError) {
        console.log('⚠️ Aucun endpoint spécifique trouvé, tentative de filtrage côté client...');
        
        try {
          const response = await materielsAPI.getAll();
          const allMateriels = extractDataFromResponse(response);
          
          // Filtrer seulement les matériels en panne côté client
          const materielsEnPanne = allMateriels.filter((m: any) => {
            const etat = m.etat || m.status || m.state || '';
            return etat.toLowerCase().includes('panne') || etat.toLowerCase().includes('en_panne');
          });
          
          console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne filtré(s) sur ${allMateriels.length} total`);
          return materielsEnPanne as Materiel[];
          
        } catch (filterError: any) {
          console.error('❌ Échec du filtrage côté client:', filterError);
          throw new Error(`Aucun matériel en panne trouvé. Vérifiez votre connexion: ${lastError.message}`);
        }
      }
      
      throw lastError || new Error('Impossible de charger les matériels en panne');
      
    } catch (error: any) {
      console.error('❌ Erreur chargement matériels en panne:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      throw new Error('Erreur lors du chargement des matériels en panne: ' + 
        (error.response?.data?.detail || error.response?.data?.message || error.message || 'Erreur inconnue'));
    }
  },
  
  /**
   * Récupère les matériels en panne filtrés par utilisateur (pour utilisateur standard)
   */
  getMesMaterielsEnPanne: async (userId: number): Promise<Materiel[]> => {
    try {
      console.log(`🔍 Chargement des matériels en panne pour l'utilisateur ${userId}...`);
      
      // Essayer un endpoint spécifique ou filtrer côté client
      try {
        const response = await apiWithPrefix.get(`/materiels-panne/?utilisateur_id=${userId}`);
        return extractDataFromResponse(response) as Materiel[];
      } catch (error) {
        // Fallback: filtrer tous les matériels en panne
        const allMaterielsEnPanne = await materielsPanneAPI.getMaterielsEnPanne();
        return allMaterielsEnPanne.filter(m => {
          const utilisateur = m.utilisateur_attribue || '';
          return utilisateur.includes(userId.toString()) || 
                 utilisateur.toLowerCase().includes('user') ||
                 m.id === userId; // Par sécurité
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement matériels utilisateur en panne:', error);
      return [];
    }
  }
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

// ==================== TESTS DE CONNEXION ====================
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await apiWithoutPrefix.get('/', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('❌ Serveur inaccessible');
    return false;
  }
};

// ==================== HISTORIQUE LOCAL (stockage en localStorage) ====================
export const getHistoriqueLocal = (limit?: number): HistoriqueAction[] => {
  try {
    const historiqueStr = localStorage.getItem('actionLogs');
    if (!historiqueStr) return [];
    
    const historique: HistoriqueAction[] = JSON.parse(historiqueStr);
    
    // Filtrer et formater les données
    const formattedHistorique = historique.map((item: any, index: number) => ({
      id: index + 1,
      action_type: item.action || item.action_type || 'UNKNOWN',
      user: item.user || 'unknown',
      details: item.data || item.details || '',
      timestamp: item.timestamp || new Date().toISOString(),
      module: getModuleFromAction(item.action),
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent
    }));
    
    // Trier par date décroissante
    formattedHistorique.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Limiter si nécessaire
    if (limit && limit > 0) {
      return formattedHistorique.slice(0, limit);
    }
    
    return formattedHistorique;
  } catch (error) {
    console.error('Erreur lecture historique local:', error);
    return [];
  }
};

// Fonction utilitaire pour extraire le module de l'action
const getModuleFromAction = (action: string): string => {
  if (action.includes('MATERIEL')) return 'MATÉRIELS';
  if (action.includes('LOGICIEL')) return 'LOGICIELS';
  if (action.includes('INCIDENT')) return 'INCIDENTS';
  if (action.includes('USER') || action.includes('AUTH')) return 'UTILISATEURS';
  if (action.includes('EXPORT')) return 'EXPORT';
  return 'GÉNÉRAL';
};

export const addHistoriqueLocal = (action: string, user: string, data: any): void => {
  try {
    const historique = getHistoriqueLocal();
    const newEntry = {
      action,
      user,
      data,
      timestamp: new Date().toISOString()
    };
    
    historique.unshift(newEntry);
    
    // Garder seulement les 1000 dernières entrées
    const limitedHistorique = historique.slice(0, 1000);
    localStorage.setItem('actionLogs', JSON.stringify(limitedHistorique));
  } catch (error) {
    console.error('Erreur ajout historique local:', error);
  }
};

export const clearHistoriqueLocal = (): void => {
  localStorage.removeItem('actionLogs');
};

export const getStatistiquesHistoriqueLocal = () => {
  const historique = getHistoriqueLocal();
  
  // Calculer les statistiques
  const stats = {
    total: historique.length,
    today: historique.filter(item => {
      const today = new Date().toDateString();
      const itemDate = new Date(item.timestamp).toDateString();
      return today === itemDate;
    }).length,
    parModule: {} as Record<string, number>,
    parUtilisateur: {} as Record<string, number>,
    derniereAction: historique.length > 0 ? historique[0].timestamp : null
  };
  
  // Compter par module
  historique.forEach(item => {
    const module = item.module || 'INCONNU';
    stats.parModule[module] = (stats.parModule[module] || 0) + 1;
  });
  
  // Compter par utilisateur
  historique.forEach(item => {
    const user = item.user || 'unknown';
    stats.parUtilisateur[user] = (stats.parUtilisateur[user] || 0) + 1;
  });
  
  return stats;
};

// ==================== EXPORTS ====================
export { apiWithPrefix as api, apiWithoutPrefix };
export default apiWithPrefix;




// // services/api.ts - VERSION AVEC MATERIELS PANNE API
// import axios from 'axios';
// import {
//   User,
//   Fournisseur,
//   Materiel,
//   Incident,
//   Alerte,
//   Reparation,
//   ProfilUtilisateur,
//   DashboardData,
//   LoginCredentials,
//   HistoriqueAction,
//   StatistiquesHistorique
// } from '../types';


// // ==================== CONFIGURATION ====================
// console.log('⚙️ Configuration API - VITE_API_URL:', import.meta.env.VITE_API_URL);

// // Utilisez l'URL local si disponible, sinon distant
// const API_BASE_URL = import.meta.env.VITE_API_URL || 
//   (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
//     ? 'http://localhost:8000' 
//     : 'https://gestion-ressource-informatique.onrender.com');

// console.log('🌐 URL de base:', API_BASE_URL);

// // Créer deux instances avec timeout ajustés
// const apiWithPrefix = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
//   timeout: 10000, // Réduit à 10s pour tests rapides
// });

// const apiWithoutPrefix = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
//   timeout: 10000,
// });

// // ==================== GESTION DES TOKENS ====================
// const getAuthToken = (): string | null => {
//   return localStorage.getItem('auth_token');
// };

// let csrfToken = '';

// const getCsrfToken = async (): Promise<string> => {
//   if (csrfToken) return csrfToken;
  
//   try {
//     const response = await apiWithoutPrefix.get('/csrf/', { timeout: 3000 });
//     if (response.data.csrfToken) {
//       csrfToken = response.data.csrfToken;
//     }
    
//     if (csrfToken) {
//       apiWithPrefix.defaults.headers.common['X-CSRFToken'] = csrfToken;
//       apiWithoutPrefix.defaults.headers.common['X-CSRFToken'] = csrfToken;
//     }
    
//     return csrfToken;
//   } catch (error) {
//     console.warn('⚠️ Token CSRF ignoré pour accélérer');
//     return '';
//   }
// };

// // ==================== INTERCEPTEURS ====================
// apiWithPrefix.interceptors.request.use(
//   (config) => {
//     const authToken = getAuthToken();
//     if (authToken) {
//       config.headers.Authorization = `Token ${authToken}`;
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Intercepteur pour gérer les timeouts spécifiques
// const setupResponseInterceptor = (instance: any) => {
//   instance.interceptors.response.use(
//     (response: any) => response,
//     async (error: any) => {
//       const originalRequest = error.config;
      
//       if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
//         console.log(`⏱️ Timeout sur ${originalRequest.url}, réessai...`);
        
//         // Réduire le timeout pour le réessai
//         originalRequest.timeout = 5000;
//         originalRequest._retry = true;
        
//         return instance(originalRequest);
//       }
      
//       console.error('❌ Erreur API:', {
//         url: error.config?.url,
//         message: error.message,
//         code: error.code
//       });
      
//       // Si c'est un timeout après réessai, retourner des données mockées
//       if (error.code === 'ECONNABORTED' && originalRequest._retry) {
//         console.log('🔄 Retour données mockées pour:', originalRequest.url);
        
//         // Retourner des données mockées pour éviter le blocage
//         return Promise.resolve({
//           data: getMockDataForEndpoint(originalRequest.url),
//           status: 200,
//           statusText: 'OK (Mock)',
//           headers: {},
//           config: originalRequest
//         });
//       }
      
//       return Promise.reject(error);
//     }
//   );
// };

// setupResponseInterceptor(apiWithPrefix);
// setupResponseInterceptor(apiWithoutPrefix);

// // ==================== DONNÉES MOCKÉES ====================
// const getMockDataForEndpoint = (url: string): any => {
//   console.log('🔄 Génération données mockées pour:', url);
  
//   if (url.includes('/reparations/')) {
//     return {
//       results: [
//         {
//           id: 1,
//           materiel: { id: 1, nom: "Ordinateur Portable Dell" },
//           incident: { id: 1, titre: "Écran cassé" },
//           technicien: "John Doe",
//           date_reparation: "2024-01-15",
//           cout: 250.00,
//           description: "Remplacement de l'écran",
//           garantie: "3 mois"
//         }
//       ]
//     };
//   }
  
//   if (url.includes('/incidents/')) {
//     return {
//       results: [
//         {
//           id: 1,
//           titre: "Écran cassé",
//           description: "L'écran de l'ordinateur portable est fissuré",
//           priorite: "Haute",
//           etat: "En cours",
//           materiel: { id: 1, nom: "Ordinateur Portable Dell" },
//           created_at: "2024-01-10T10:30:00Z"
//         }
//       ]
//     };
//   }
  
//   if (url.includes('/materiels/')) {
//     return {
//       results: [
//         {
//           id: 1,
//           nom: "Ordinateur Portable Dell",
//           reference: "DELL-XPS-001",
//           date_achat: "2023-06-15",
//           etat: "en_panne",
//           service_attribue: "Développement",
//           utilisateur_attribue: "Alice Martin"
//         }
//       ]
//     };
//   }
  
//   if (url.includes('/fournisseurs/')) {
//     return {
//       results: [
//         {
//           id: 1,
//           nom: "Dell Technologies",
//           contact: "contact@dell.com",
//           telephone: "0123456789"
//         }
//       ]
//     };
//   }
  
//   if (url.includes('/users/')) {
//     return {
//       results: [
//         {
//           id: 1,
//           username: "admin",
//           email: "admin@example.com",
//           first_name: "Admin",
//           last_name: "System"
//         }
//       ]
//     };
//   }
  
//   if (url.includes('/tableau-de-bord/')) {
//     return {
//       stats: {
//         materiels_total: 15,
//         materiels_en_panne: 3,
//         incidents_ouverts: 5,
//         reparations_en_cours: 2
//       }
//     };
//   }
  
//   return { results: [] };
// };

// // ==================== FONCTION UTILITAIRE ====================
// const extractData = (response: any): any[] => {
//   if (!response?.data) return [];
  
//   const { data } = response;
  
//   if (Array.isArray(data)) return data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   if (typeof data === 'object') {
//     const values = Object.values(data);
//     if (values.length > 0 && Array.isArray(values[0])) return values[0];
//     return [data];
//   }
  
//   return [];
// };

// // Fonction utilitaire pour extraire les données de n'importe quelle réponse
// const extractDataFromResponse = (response: any): any[] => {
//   if (!response) return [];
  
//   // Si la réponse a déjà été extraite via extractData
//   if (Array.isArray(response)) return response;
  
//   // Si c'est une réponse axios
//   if (response.data) {
//     return extractData(response);
//   }
  
//   // Si c'est un objet avec une propriété 'data'
//   if (response.data && Array.isArray(response.data)) {
//     return response.data;
//   }
  
//   // Si c'est un objet avec une propriété 'results'
//   if (response.results && Array.isArray(response.results)) {
//     return response.results;
//   }
  
//   return [];
// };

// // ==================== FONCTIONS API AVEC FALLBACK ====================
// const createApiEndpointWithFallback = <T>(endpoint: string) => ({
//   getAll: async (params?: any): Promise<{ data: T[]; isMock?: boolean }> => {
//     try {
//       console.log(`📡 Requête: ${endpoint}`);
//       const response = await apiWithPrefix.get(endpoint, { 
//         params, 
//         timeout: 8000 
//       });
      
//       const data = extractData(response);
//       return { data, isMock: false };
//     } catch (error: any) {
//       console.warn(`⚠️ Fallback pour ${endpoint}:`, error.message);
      
//       // Retourner des données mockées
//       const mockData = getMockDataForEndpoint(endpoint);
//       const data = extractData({ data: mockData });
//       return { data: data as T[], isMock: true };
//     }
//   },
  
//   getById: async (id: number): Promise<T> => {
//     try {
//       return await apiWithPrefix.get(`${endpoint}${id}/`, { timeout: 8000 });
//     } catch (error) {
//       console.warn(`⚠️ Fallback pour ${endpoint}${id}/`);
//       throw error;
//     }
//   },
  
//   create: (data: Partial<T>) => 
//     apiWithPrefix.post(endpoint, data, { timeout: 10000 }),
  
//   update: (id: number, data: Partial<T>) => 
//     apiWithPrefix.patch(`${endpoint}${id}/`, data, { timeout: 10000 }),
  
//   delete: (id: number) => 
//     apiWithPrefix.delete(`${endpoint}${id}/`, { timeout: 10000 })
// });

// // ==================== API ENDPOINTS ====================
// export const usersAPI = createApiEndpointWithFallback<User>('/users/');
// export const fournisseursAPI = createApiEndpointWithFallback<Fournisseur>('/fournisseurs/');
// export const materielsAPI = createApiEndpointWithFallback<Materiel>('/materiels/');
// export const alertesAPI = createApiEndpointWithFallback<Alerte>('/alertes/');
// export const reparationsAPI = createApiEndpointWithFallback<Reparation>('/reparations/');
// export const profilsUtilisateurAPI = createApiEndpointWithFallback<ProfilUtilisateur>('/profils-utilisateurs/');

// export const incidentsAPI = {
//   ...createApiEndpointWithFallback<Incident>('/incidents/'),
//   resoudre: (id: number) => 
//     apiWithPrefix.post(`/incidents/${id}/resoudre/`, {}, { timeout: 10000 }),
// };

// export const dashboardAPI = {
//   getData: async (): Promise<DashboardData> => {
//     try {
//       return await apiWithPrefix.get('/tableau-de-bord/', { timeout: 8000 });
//     } catch (error) {
//       console.warn('⚠️ Fallback pour dashboard');
//       return getMockDataForEndpoint('/tableau-de-bord/');
//     }
//   },
// };

// export const historiqueAPI = {
//   getAll: async (params?: any) => {
//     try {
//       const response = await apiWithPrefix.get('/historique/', { 
//         params, 
//         timeout: 8000 
//       });
//       return { data: extractData(response) };
//     } catch (error) {
//       console.warn('⚠️ Fallback pour historique');
//       return { data: [] };
//     }
//   },
// };

// // ==================== API POUR MATÉRIELS EN PANNE ====================
// export const materielsPanneAPI = {
//   /**
//    * Récupère UNIQUEMENT les matériels en panne (pour le formulaire d'incident)
//    */
//   getMaterielsEnPanne: async (): Promise<Materiel[]> => {
//     try {
//       console.log('🔍 Chargement des matériels en panne...');
      
//       // Essayer différents endpoints possibles
//       const endpoints = [
//         '/materiels-panne/',
//         '/api/materiels-panne/', 
//         '/materiels/en_panne/',
//         '/api/materiels/en_panne/',
//         '/materiels/?etat=en_panne',
//         '/api/materiels/?etat=en_panne',
//         '/materiels/?pour_incident=true',
//         '/api/materiels/?pour_incident=true'
//       ];
      
//       let lastError: any = null;
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai endpoint matériels en panne: ${endpoint}`);
          
//           const response = await apiWithPrefix.get(endpoint);
          
//           console.log('✅ Matériels en panne chargés via', endpoint);
//           console.log('📦 Données reçues:', response.data);
          
//           // Extraire les données selon le format de réponse
//           let materielsData: any[] = [];
          
//           if (Array.isArray(response.data)) {
//             materielsData = response.data;
//           } else if (response.data?.materiels && Array.isArray(response.data.materiels)) {
//             materielsData = response.data.materiels;
//           } else if (response.data?.data && Array.isArray(response.data.data)) {
//             materielsData = response.data.data;
//           } else if (response.data?.results && Array.isArray(response.data.results)) {
//             materielsData = response.data.results;
//           } else if (typeof response.data === 'object') {
//             // Chercher le premier tableau dans l'objet
//             for (const key in response.data) {
//               if (Array.isArray(response.data[key])) {
//                 materielsData = response.data[key];
//                 break;
//               }
//             }
//           }
          
//           // Si toujours vide, essayer extractData
//           if (materielsData.length === 0) {
//             materielsData = extractDataFromResponse(response);
//           }
          
//           // Formater les matériels
//           const formattedMateriels: Materiel[] = materielsData.map((materiel: any) => ({
//             id: materiel.id || materiel.pk || 0,
//             nom: materiel.nom || materiel.name || materiel.libelle || `Matériel ${materiel.id || ''}`,
//             reference: materiel.reference || materiel.reference_id || materiel.serial || materiel.numero_serie || 'N/A',
//             date_achat: materiel.date_achat || materiel.achat_date || materiel.date_acquisition || '',
//             etat: materiel.etat || materiel.status || materiel.state || 'en_panne',
//             service_attribue: materiel.service_attribue || materiel.service || materiel.departement || materiel.department || 'Non spécifié',
//             utilisateur_attribue: materiel.utilisateur_attribue || materiel.utilisateur || materiel.user || materiel.assignee || 'Non attribué',
//             fournisseur: materiel.fournisseur || materiel.fournisseur_id || materiel.supplier || 0,
//             created_at: materiel.created_at || materiel.date_creation || new Date().toISOString(),
//             updated_at: materiel.updated_at || materiel.date_modification || new Date().toISOString()
//           }));
          
//           console.log(`✅ ${formattedMateriels.length} matériel(s) en panne trouvé(s)`);
//           return formattedMateriels;
          
//         } catch (error: any) {
//           lastError = error;
//           console.log(`❌ ${endpoint} échoué:`, error.response?.status || error.message);
          
//           // Si c'est une 404, continuer à essayer d'autres endpoints
//           if (error.response?.status === 404) {
//             continue;
//           }
          
//           // Pour les autres erreurs, arrêter la boucle
//           break;
//         }
//       }
      
//       // Si aucun endpoint ne fonctionne, essayer avec materielsAPI.getAll et filtrer côté client
//       if (lastError) {
//         console.log('⚠️ Aucun endpoint spécifique trouvé, tentative de filtrage côté client...');
        
//         try {
//           const response = await materielsAPI.getAll();
//           const allMateriels = extractDataFromResponse(response);
          
//           // Filtrer seulement les matériels en panne côté client
//           const materielsEnPanne = allMateriels.filter((m: any) => {
//             const etat = m.etat || m.status || m.state || '';
//             return etat.toLowerCase().includes('panne') || etat.toLowerCase().includes('en_panne');
//           });
          
//           console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne filtré(s) sur ${allMateriels.length} total`);
//           return materielsEnPanne as Materiel[];
          
//         } catch (filterError: any) {
//           console.error('❌ Échec du filtrage côté client:', filterError);
//           throw new Error(`Aucun matériel en panne trouvé. Vérifiez votre connexion: ${lastError.message}`);
//         }
//       }
      
//       throw lastError || new Error('Impossible de charger les matériels en panne');
      
//     } catch (error: any) {
//       console.error('❌ Erreur chargement matériels en panne:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data
//       });
      
//       // En cas d'erreur, retourner des données mockées pour le développement
//       if (import.meta.env.DEV) {
//         console.log('🔄 Retour de données mockées pour le développement');
//         return [
//           {
//             id: 1,
//             nom: "Ordinateur Portable Dell (Mock)",
//             reference: "DELL-MOCK-001",
//             date_achat: "2024-01-01",
//             etat: "en_panne",
//             service_attribue: "Informatique",
//             utilisateur_attribue: "Utilisateur Test",
//             fournisseur: 1,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString()
//           }
//         ];
//       }
      
//       throw new Error('Erreur lors du chargement des matériels en panne: ' + 
//         (error.response?.data?.detail || error.response?.data?.message || error.message || 'Erreur inconnue'));
//     }
//   },
  
//   /**
//    * Récupère les matériels en panne filtrés par utilisateur (pour utilisateur standard)
//    */
//   getMesMaterielsEnPanne: async (userId: number): Promise<Materiel[]> => {
//     try {
//       console.log(`🔍 Chargement des matériels en panne pour l'utilisateur ${userId}...`);
      
//       // Essayer un endpoint spécifique ou filtrer côté client
//       try {
//         const response = await apiWithPrefix.get(`/materiels-panne/?utilisateur_id=${userId}`);
//         return extractDataFromResponse(response) as Materiel[];
//       } catch (error) {
//         // Fallback: filtrer tous les matériels en panne
//         const allMaterielsEnPanne = await materielsPanneAPI.getMaterielsEnPanne();
//         return allMaterielsEnPanne.filter(m => {
//           const utilisateur = m.utilisateur_attribue || '';
//           return utilisateur.includes(userId.toString()) || 
//                  utilisateur.toLowerCase().includes('user') ||
//                  m.id === userId; // Par sécurité
//         });
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur chargement matériels utilisateur en panne:', error);
//       return [];
//     }
//   }
// };

// // ==================== AUTHENTIFICATION AVEC FALLBACK ====================
// export const authAPI = {
//   login: async (credentials: LoginCredentials) => {
//     try {
//       console.log('🔐 Tentative connexion...');
      
//       // Essayer avec timeout court
//       const response = await apiWithoutPrefix.post('/login/', credentials, { 
//         timeout: 10000 
//       });
      
//       if (response.data.token) {
//         localStorage.setItem('auth_token', response.data.token);
//         if (response.data.user) {
//           localStorage.setItem('user', JSON.stringify(response.data.user));
//         }
//         return response.data;
//       }
      
//       throw new Error('Token non reçu');
      
//     } catch (error: any) {
//       console.error('❌ Échec connexion:', error.message);
      
//       // Pour développement, créer un compte mock
//       if (import.meta.env.DEV) {
//         console.log('🔄 Création session de développement...');
//         localStorage.setItem('auth_token', 'dev-mock-token');
//         localStorage.setItem('user', JSON.stringify({
//           id: 1,
//           username: credentials.username,
//           email: `${credentials.username}@example.com`,
//           role: 'admin'
//         }));
        
//         return {
//           token: 'dev-mock-token',
//           user: {
//             username: credentials.username,
//             role: 'admin'
//           }
//         };
//       }
      
//       throw error;
//     }
//   },
  
//   logout: async () => {
//     try {
//       await apiWithoutPrefix.post('/logout/', {}, { timeout: 5000 });
//     } catch (error) {
//       console.warn('⚠️ Erreur logout ignorée');
//     } finally {
//       localStorage.clear();
//       window.location.href = '/login';
//     }
//   },
  
//   checkAuth: async () => {
//     try {
//       return await apiWithPrefix.get('/users/me/', { timeout: 5000 });
//     } catch (error) {
//       // Vérifier si un token mock existe
//       const token = localStorage.getItem('auth_token');
//       const user = localStorage.getItem('user');
      
//       if (token && user) {
//         console.log('✅ Session mockée active');
//         return { data: JSON.parse(user) };
//       }
      
//       throw error;
//     }
//   }
// };

// // ==================== TEST DE CONNEXION SIMPLIFIÉ ====================
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     // Essayer avec timeout très court
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 3000);
    
//     const response = await fetch(`${API_BASE_URL}/`, {
//       signal: controller.signal,
//       mode: 'cors',
//       credentials: 'include'
//     });
    
//     clearTimeout(timeoutId);
//     return response.ok;
    
//   } catch (error) {
//     console.log('🌐 Serveur inaccessible, mode déconnecté activé');
//     return false;
//   }
// };

// // ==================== GESTION DES ERREURS ====================
// export const handleApiError = (error: any): string => {
//   if (axios.isAxiosError(error)) {
//     if (error.code === 'ECONNABORTED') {
//       return 'Le serveur met trop de temps à répondre. Mode déconnecté activé.';
//     }
    
//     if (!error.response) {
//       return 'Serveur inaccessible. Vérifiez votre connexion.';
//     }
    
//     return `Erreur ${error.response.status}: ${error.response.data?.detail || 'Erreur serveur'}`;
//   }
  
//   return error.message || 'Erreur inconnue';
// };

// // ==================== MODE HORS LIGNE ====================
// export const isOfflineMode = (): boolean => {
//   return localStorage.getItem('offline_mode') === 'true';
// };

// export const setOfflineMode = (enabled: boolean): void => {
//   if (enabled) {
//     localStorage.setItem('offline_mode', 'true');
//   } else {
//     localStorage.removeItem('offline_mode');
//   }
// };
// export const profilAPI = {
//   getAll: () => axios.get('/api/profils/'), // ou l'URL correcte
//   // autres méthodes si nécessaires
// };

// // ==================== EXPORTS ====================
// export { apiWithPrefix as api, apiWithoutPrefix };
// export default apiWithPrefix;



// // services/api.ts - VERSION SIMPLIFIÉE ET CORRIGÉE
// import axios from 'axios';
// import {
//   User,
//   Fournisseur,
//   Materiel,
//   Incident,
//   Alerte,
//   Reparation,
//   ProfilUtilisateur,
//   DashboardData,
//   LoginCredentials,
//   HistoriqueAction
// } from '../types';

// // ==================== CONFIGURATION ====================
// console.log('⚙️ Configuration API - VITE_API_URL:', import.meta.env.VITE_API_URL);

// // Configuration basique
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// console.log('🌐 URL de base:', API_BASE_URL);

// // Instance axios unique
// const api = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
// });

// // ==================== GESTION DES TOKENS ====================
// const getAuthToken = (): string | null => {
//   return localStorage.getItem('auth_token');
// };

// // Intercepteur pour ajouter le token d'authentification
// api.interceptors.request.use(
//   (config) => {
//     const authToken = getAuthToken();
//     if (authToken && config.headers) {
//       config.headers.Authorization = `Token ${authToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Intercepteur pour gérer les erreurs
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.error('❌ Erreur API:', {
//       url: error.config?.url,
//       status: error.response?.status,
//       message: error.message
//     });

//     // Gestion des erreurs d'authentification
//     if (error.response?.status === 401) {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }

//     return Promise.reject(error);
//   }
// );

// // ==================== FONCTION UTILITAIRE ====================
// const extractData = (response: any): any[] => {
//   if (!response?.data) return [];
  
//   const { data } = response;
  
//   if (Array.isArray(data)) return data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   if (typeof data === 'object') {
//     const values = Object.values(data);
//     if (values.length > 0 && Array.isArray(values[0])) return values[0];
//     return [data];
//   }
  
//   return [];
// };

// // ==================== API ENDPOINTS ====================
// const createApiEndpoint = <T>(endpoint: string) => ({
//   getAll: async (params?: any) => {
//     try {
//       const response = await api.get(endpoint, { params });
//       return { data: extractData(response) };
//     } catch (error) {
//       console.error(`❌ Erreur ${endpoint}:`, error);
//       return { data: [] };
//     }
//   },
  
//   getById: (id: number) => api.get<T>(`${endpoint}${id}/`),
  
//   create: (data: Partial<T>) => api.post<T>(endpoint, data),
  
//   update: (id: number, data: Partial<T>) => api.patch<T>(`${endpoint}${id}/`, data),
  
//   delete: (id: number) => api.delete(`${endpoint}${id}/`)
// });

// // APIs
// export const usersAPI = createApiEndpoint<User>('/users/');
// export const fournisseursAPI = createApiEndpoint<Fournisseur>('/fournisseurs/');
// export const materielsAPI = createApiEndpoint<Materiel>('/materiels/');
// export const alertesAPI = createApiEndpoint<Alerte>('/alertes/');
// export const reparationsAPI = createApiEndpoint<Reparation>('/reparations/');
// export const profilsUtilisateurAPI = createApiEndpoint<ProfilUtilisateur>('/profils-utilisateurs/');
// export const historiqueAPI = createApiEndpoint<HistoriqueAction>('/historique/');

// export const incidentsAPI = {
//   ...createApiEndpoint<Incident>('/incidents/'),
//   resoudre: (id: number) => api.post(`/incidents/${id}/resoudre/`),
// };

// export const dashboardAPI = {
//   getData: async (): Promise<DashboardData> => {
//     try {
//       const response = await api.get('/tableau-de-bord/');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur dashboard:', error);
//       return {
//         stats: {
//           materiels_total: 0,
//           materiels_en_panne: 0,
//           incidents_ouverts: 0,
//           reparations_en_cours: 0
//         }
//       };
//     }
//   },
// };

// // ==================== AUTHENTIFICATION ====================
// export const authAPI = {
//   login: async (credentials: LoginCredentials) => {
//     try {
//       console.log('🔐 Tentative de connexion...');
      
//       // Essayer plusieurs endpoints
//       const endpoints = ['/login/', '/auth/login/', '/api/login/'];
      
//       for (const endpoint of endpoints) {
//         try {
//           const response = await axios.post(`${API_BASE_URL}${endpoint}`, credentials, {
//             headers: { 'Content-Type': 'application/json' },
//             timeout: 10000
//           });
          
//           if (response.data.token) {
//             localStorage.setItem('auth_token', response.data.token);
//             if (response.data.user) {
//               localStorage.setItem('user', JSON.stringify(response.data.user));
//             }
//             return response.data;
//           }
//         } catch (error) {
//           console.log(`❌ ${endpoint} échoué:`, error);
//           continue;
//         }
//       }
      
//       throw new Error('Échec de la connexion');
      
//     } catch (error: any) {
//       console.error('❌ Erreur login:', error);
      
//       // Pour le développement, créer un utilisateur mock
//       if (import.meta.env.DEV) {
//         console.log('🔄 Mode développement - création utilisateur mock');
//         localStorage.setItem('auth_token', 'dev-token-' + Date.now());
//         localStorage.setItem('user', JSON.stringify({
//           id: 1,
//           username: credentials.username,
//           email: `${credentials.username}@example.com`,
//           role: 'admin'
//         }));
        
//         return {
//           token: 'dev-token',
//           user: {
//             username: credentials.username,
//             role: 'admin'
//           }
//         };
//       }
      
//       throw error;
//     }
//   },
  
//   logout: async () => {
//     try {
//       await api.post('/logout/');
//     } catch (error) {
//       console.warn('⚠️ Erreur logout:', error);
//     } finally {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//   },
  
//   checkAuth: async () => {
//     try {
//       const response = await api.get('/users/me/');
//       return response.data;
//     } catch (error) {
//       // Vérifier si un token existe en local
//       const token = localStorage.getItem('auth_token');
//       const user = localStorage.getItem('user');
      
//       if (token && user) {
//         console.log('✅ Session locale active');
//         return JSON.parse(user);
//       }
      
//       throw error;
//     }
//   }
// };

// // ==================== API POUR MATÉRIELS EN PANNE ====================
// export const materielsPanneAPI = {
//   getMaterielsEnPanne: async (): Promise<Materiel[]> => {
//     try {
//       console.log('🔍 Chargement des matériels en panne...');
      
//       // Essayer plusieurs endpoints
//       const endpoints = [
//         '/materiels-panne/',
//         '/materiels/en_panne/',
//         '/materiels/?etat=en_panne',
//         '/materiels/?etat=panne'
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           const response = await api.get(endpoint);
//           const data = extractData(response);
          
//           if (data.length > 0) {
//             console.log(`✅ ${data.length} matériel(s) en panne trouvé(s)`);
//             return data as Materiel[];
//           }
//         } catch (error) {
//           console.log(`❌ ${endpoint} échoué:`, error);
//           continue;
//         }
//       }
      
//       // Fallback: récupérer tous les matériels et filtrer côté client
//       console.log('⚠️ Aucun endpoint spécifique, filtrage côté client...');
//       const response = await api.get('/materiels/');
//       const allMateriels = extractData(response);
      
//       const materielsEnPanne = allMateriels.filter((m: any) => {
//         const etat = (m.etat || m.status || '').toLowerCase();
//         return etat.includes('panne') || etat.includes('en_panne') || etat.includes('broken');
//       });
      
//       console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne filtré(s)`);
//       return materielsEnPanne as Materiel[];
      
//     } catch (error: any) {
//       console.error('❌ Erreur chargement matériels en panne:', error);
      
//       // Données mockées pour le développement
//       if (import.meta.env.DEV) {
//         console.log('🔄 Retour données mockées');
//         return [
//           {
//             id: 1,
//             nom: "Ordinateur Portable Dell (Mock)",
//             reference: "DELL-MOCK-001",
//             date_achat: "2024-01-01",
//             etat: "en_panne",
//             service_attribue: "Informatique",
//             utilisateur_attribue: "Utilisateur Test",
//             fournisseur: 1,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString()
//           },
//           {
//             id: 2,
//             nom: "Imprimante HP (Mock)",
//             reference: "HP-MOCK-002",
//             date_achat: "2024-02-15",
//             etat: "panne",
//             service_attribue: "Administration",
//             utilisateur_attribue: "Admin Test",
//             fournisseur: 2,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString()
//           }
//         ];
//       }
      
//       throw error;
//     }
//   }
// };

// // ==================== GESTION DES ERREURS ====================
// export const handleApiError = (error: any): string => {
//   if (axios.isAxiosError(error)) {
//     if (!error.response) {
//       return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
//     }
    
//     const { status, data } = error.response;
    
//     if (status === 401) {
//       return 'Session expirée. Veuillez vous reconnecter.';
//     }
    
//     if (status === 403) {
//       return 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
//     }
    
//     if (status === 404) {
//       return 'Ressource non trouvée.';
//     }
    
//     if (status === 500) {
//       return 'Erreur interne du serveur. Veuillez contacter l\'administrateur.';
//     }
    
//     return data?.detail || data?.message || `Erreur ${status}`;
//   }
  
//   return error.message || 'Erreur inconnue';
// };

// // ==================== TEST DE CONNEXION ====================
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     const response = await axios.get(API_BASE_URL, { timeout: 5000 });
//     return response.status === 200;
//   } catch (error) {
//     console.log('🌐 Serveur inaccessible, mode local activé');
//     return false;
//   }
// };

// export default api;





// // /




// import axios from 'axios';
// import {
//   User,
//   Fournisseur,
//   Materiel,
//   Incident,
//   Alerte,
//   Reparation,
//   ProfilUtilisateur,
//   DashboardData,
//   LoginCredentials,
//   HistoriqueAction
// } from '../types';

// // ==================== CONFIGURATION ====================
// console.log('⚙️ Configuration API - VITE_API_URL:', import.meta.env.VITE_API_URL);

// // Configuration basique
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';

// console.log('🌐 URL de base:', API_BASE_URL);

// // Instance axios unique
// const api = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
// });

// // ==================== GESTION DES TOKENS ====================
// const getAuthToken = (): string | null => {
//   return localStorage.getItem('auth_token');
// };

// // Intercepteur pour ajouter le token d'authentification
// api.interceptors.request.use(
//   (config) => {
//     const authToken = getAuthToken();
//     if (authToken && config.headers) {
//       config.headers.Authorization = `Token ${authToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Intercepteur pour gérer les erreurs
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.error('❌ Erreur API:', {
//       url: error.config?.url,
//       status: error.response?.status,
//       message: error.message,
//       data: error.response?.data
//     });

//     // Gestion des erreurs d'authentification
//     if (error.response?.status === 401) {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }

//     return Promise.reject(error);
//   }
// );

// // ==================== FONCTION UTILITAIRE ====================
// const extractData = (response: any): any[] => {
//   if (!response?.data) {
//     console.log('⚠️ Réponse API sans data:', response);
//     return [];
//   }
  
//   const { data } = response;
  
//   if (Array.isArray(data)) return data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   if (typeof data === 'object') {
//     const values = Object.values(data);
//     if (values.length > 0 && Array.isArray(values[0])) return values[0];
//     return [data];
//   }
  
//   console.warn('⚠️ Format de réponse non reconnu:', data);
//   return [];
// };

// // ==================== API ENDPOINTS ====================
// const createApiEndpoint = <T>(endpoint: string) => ({
//   getAll: async (params?: any) => {
//     try {
//       console.log(`📡 GET ${endpoint}...`);
//       const response = await api.get(endpoint, { params });
//       console.log(`✅ GET ${endpoint} - Réussite:`, response.data?.length || '?', 'éléments');
//       return { data: extractData(response) };
//     } catch (error) {
//       console.error(`❌ Erreur GET ${endpoint}:`, error);
//       return { data: [] };
//     }
//   },
  
//   getById: async (id: number) => {
//     try {
//       console.log(`📡 GET ${endpoint}${id}/...`);
//       const response = await api.get<T>(`${endpoint}${id}/`);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur GET ${endpoint}${id}/:`, error);
//       throw error;
//     }
//   },
  
//   create: async (data: Partial<T>) => {
//     try {
//       console.log(`📡 POST ${endpoint}...`);
//       console.log('📦 Données envoyées:', data);
//       const response = await api.post<T>(endpoint, data);
//       console.log(`✅ POST ${endpoint} - Réussite:`, response.data);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur POST ${endpoint}:`, error);
//       throw error;
//     }
//   },
  
//   update: async (id: number, data: Partial<T>) => {
//     try {
//       console.log(`📡 PUT ${endpoint}${id}/...`);
//       console.log('📦 Données envoyées:', data);
//       const response = await api.patch<T>(`${endpoint}${id}/`, data);
//       console.log(`✅ PUT ${endpoint}${id}/ - Réussite:`, response.data);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur PUT ${endpoint}${id}/:`, error);
//       throw error;
//     }
//   },
  
//   delete: async (id: number) => {
//     try {
//       console.log(`📡 DELETE ${endpoint}${id}/...`);
//       const response = await api.delete(`${endpoint}${id}/`);
//       console.log(`✅ DELETE ${endpoint}${id}/ - Réussite`);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur DELETE ${endpoint}${id}/:`, error);
//       throw error;
//     }
//   }
// });

// // APIs spécifiques
// export const usersAPI = createApiEndpoint<User>('/users/');
// export const fournisseursAPI = createApiEndpoint<Fournisseur>('/fournisseurs/');
// export const materielsAPI = createApiEndpoint<Materiel>('/materiels/');
// export const alertesAPI = createApiEndpoint<Alerte>('/alertes/');
// export const profilsUtilisateurAPI = createApiEndpoint<ProfilUtilisateur>('/profils-utilisateurs/');
// export const historiqueAPI = createApiEndpoint<HistoriqueAction>('/historique/');

// // API pour incidents avec méthode spéciale
// export const incidentsAPI = {
//   ...createApiEndpoint<Incident>('/incidents/'),
//   resoudre: async (id: number) => {
//     try {
//       console.log(`📡 POST /incidents/${id}/resoudre/...`);
//       const response = await api.post(`/incidents/${id}/resoudre/`);
//       console.log(`✅ POST /incidents/${id}/resoudre/ - Réussite`);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur POST /incidents/${id}/resoudre/:`, error);
//       throw error;
//     }
//   },
// };

// // API pour réparations avec journalisation détaillée
// export const reparationsAPI = {
//   ...createApiEndpoint<Reparation>('/reparations/'),
  
//   // Surcharge de create avec journalisation détaillée
//   create: async (data: any) => {
//     try {
//       console.log('📡 POST /reparations/');
      
//       // VALIDATION FORCÉE : S'assurer que tous les champs requis sont présents
//       const validatedData = {
//         materiel: parseInt(data.materiel) || data.materiel,
//         type_reparation: data.type_reparation || 'corrective',
//         date_debut: data.date_debut || new Date().toISOString().split('T')[0],
//         date_fin: data.date_fin || null,
//         cout: parseFloat(data.cout) || 0,
//         technicien_responsable: data.technicien_responsable?.trim() || 'Technicien Non Spécifié',
//         description: data.description?.trim() || 'Réparation effectuée',
//         incident: data.incident ? parseInt(data.incident) : null
//       };
      
//       console.log('📦 Données validées envoyées:', JSON.stringify(validatedData, null, 2));
//       console.log('👷 Technicien dans data:', validatedData.technicien_responsable);
//       console.log('📝 Description dans data:', validatedData.description);
//       console.log('🔑 Token utilisé:', getAuthToken()?.substring(0, 20) + '...');
      
//       const response = await api.post<Reparation>('/reparations/', validatedData);
//       console.log('✅ POST /reparations/ - Réussite:', response.data);
//       return response;
//     } catch (error: any) {
//       console.error('❌ Erreur POST /reparations/ - Détails:');
//       console.error('- Status:', error.response?.status);
//       console.error('- Status Text:', error.response?.statusText);
//       console.error('- Headers:', error.response?.headers);
//       console.error('- Data brute:', error.response?.data);
      
//       // Parser les messages d'erreur Django
//       let errorMessage = 'Erreur lors de la création';
//       if (error.response?.data) {
//         if (typeof error.response.data === 'object') {
//           errorMessage = Object.entries(error.response.data)
//             .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
//             .join(' | ');
//         } else if (typeof error.response.data === 'string') {
//           // Extraire l'erreur du HTML Django
//           const match = error.response.data.match(/class="exception_value">([^<]+)</);
//           if (match) {
//             errorMessage = match[1].trim();
//           } else {
//             errorMessage = error.response.data.substring(0, 200);
//           }
//         }
//       }
      
//       console.error('- Message d\'erreur:', errorMessage);
//       throw new Error(errorMessage);
//     }
//   },
  
//   // Surcharge de update avec journalisation détaillée
//   update: async (id: number, data: any) => {
//     try {
//       console.log(`📡 PUT /reparations/${id}/`);
//       console.log('📦 Données envoyées:', JSON.stringify(data, null, 2));
//       console.log('👷 Technicien dans data:', data.technicien_responsable);
      
//       const response = await api.patch<Reparation>(`/reparations/${id}/`, data);
//       console.log(`✅ PUT /reparations/${id}/ - Réussite:`, response.data);
//       return response;
//     } catch (error: any) {
//       console.error(`❌ Erreur PUT /reparations/${id}/:`, error);
//       throw error;
//     }
//   },
  
//   // Méthode spéciale pour terminer une réparation
//   terminer: async (id: number, technicien: string) => {
//     try {
//       console.log(`✅ Terminer réparation ${id} par ${technicien}`);
//       const data = {
//         date_fin: new Date().toISOString(),
//         technicien_responsable: technicien
//       };
//       return await api.patch<Reparation>(`/reparations/${id}/`, data);
//     } catch (error) {
//       console.error(`❌ Erreur terminer réparation ${id}:`, error);
//       throw error;
//     }
//   }
// };

// // API dashboard
// export const dashboardAPI = {
//   getData: async (): Promise<DashboardData> => {
//     try {
//       console.log('📡 GET /tableau-de-bord/...');
//       const response = await api.get('/tableau-de-bord/');
//       console.log('✅ GET /tableau-de-bord/ - Réussite');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur dashboard:', error);
//       return {
//         stats: {
//           materiels_total: 0,
//           materiels_en_panne: 0,
//           incidents_ouverts: 0,
//           reparations_en_cours: 0
//         }
//       };
//     }
//   },
// };

// // ==================== AUTHENTIFICATION ====================
// export const authAPI = {
//   login: async (credentials: LoginCredentials) => {
//     try {
//       console.log('🔐 Tentative de connexion...');
//       console.log('👤 Username:', credentials.username);
      
//       // Essayer plusieurs endpoints
//       const endpoints = ['/login/', '/auth/login/', '/api/login/'];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔗 Essai endpoint: ${endpoint}`);
//           const response = await axios.post(`${API_BASE_URL}${endpoint}`, credentials, {
//             headers: { 'Content-Type': 'application/json' },
//             timeout: 10000
//           });
          
//           console.log(`✅ ${endpoint} - Réponse:`, response.data);
          
//           if (response.data.token) {
//             localStorage.setItem('auth_token', response.data.token);
//             if (response.data.user) {
//               localStorage.setItem('user', JSON.stringify(response.data.user));
//             }
//             return response.data;
//           }
//         } catch (error) {
//           console.log(`❌ ${endpoint} échoué:`, error);
//           continue;
//         }
//       }
      
//       throw new Error('Échec de la connexion');
      
//     } catch (error: any) {
//       console.error('❌ Erreur login:', error);
      
//       // Pour le développement, créer un utilisateur mock
//       if (import.meta.env.DEV) {
//         console.log('🔄 Mode développement - création utilisateur mock');
//         const mockToken = 'dev-token-' + Date.now();
//         const mockUser = {
//           id: 1,
//           username: credentials.username,
//           email: `${credentials.username}@example.com`,
//           first_name: credentials.username,
//           last_name: 'Développeur',
//           role: 'admin',
//           nom_complet: `${credentials.username} Développeur`
//         };
        
//         localStorage.setItem('auth_token', mockToken);
//         localStorage.setItem('user', JSON.stringify(mockUser));
        
//         return {
//           token: mockToken,
//           user: mockUser
//         };
//       }
      
//       throw error;
//     }
//   },
  
//   logout: async () => {
//     try {
//       console.log('🚪 Déconnexion...');
//       await api.post('/logout/');
//     } catch (error) {
//       console.warn('⚠️ Erreur logout:', error);
//     } finally {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user');
//       console.log('✅ Déconnexion terminée');
//       window.location.href = '/login';
//     }
//   },
  
//   checkAuth: async () => {
//     try {
//       console.log('🔍 Vérification authentification...');
//       const response = await api.get('/users/me/');
//       console.log('✅ Auth vérifiée:', response.data);
//       return response.data;
//     } catch (error) {
//       // Vérifier si un token existe en local
//       const token = localStorage.getItem('auth_token');
//       const user = localStorage.getItem('user');
      
//       if (token && user) {
//         console.log('✅ Session locale active');
//         const userObj = JSON.parse(user);
        
//         // S'assurer que nom_complet existe
//         if (!userObj.nom_complet) {
//           userObj.nom_complet = userObj.username || 'Utilisateur';
//         }
        
//         return userObj;
//       }
      
//       console.error('❌ Aucune session active');
//       throw error;
//     }
//   }
// };

// // ==================== API POUR MATÉRIELS EN PANNE ====================
// export const materielsPanneAPI = {
//   getMaterielsEnPanne: async (): Promise<Materiel[]> => {
//     try {
//       console.log('🔍 Chargement des matériels en panne...');
      
//       // Essayer plusieurs endpoints
//       const endpoints = [
//         '/materiels-panne/',
//         '/materiels/en_panne/',
//         '/materiels/?etat=en_panne',
//         '/materiels/?etat=panne'
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           const response = await api.get(endpoint);
//           const data = extractData(response);
          
//           if (data.length > 0) {
//             console.log(`✅ ${data.length} matériel(s) en panne trouvé(s) via ${endpoint}`);
//             return data as Materiel[];
//           }
//         } catch (error) {
//           console.log(`❌ ${endpoint} échoué:`, error);
//           continue;
//         }
//       }
      
//       // Fallback: récupérer tous les matériels et filtrer côté client
//       console.log('⚠️ Aucun endpoint spécifique, filtrage côté client...');
//       const response = await api.get('/materiels/');
//       const allMateriels = extractData(response);
      
//       const materielsEnPanne = allMateriels.filter((m: any) => {
//         const etat = (m.etat || m.status || '').toLowerCase();
//         return etat.includes('panne') || etat.includes('en_panne') || etat.includes('broken');
//       });
      
//       console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne filtré(s)`);
//       return materielsEnPanne as Materiel[];
      
//     } catch (error: any) {
//       console.error('❌ Erreur chargement matériels en panne:', error);
//       return [];
//     }
//   }
// };

// // ==================== GESTION DES ERREURS ====================
// export const handleApiError = (error: any): string => {
//   console.error('🛑 Gestion erreur API:', error);
  
//   if (axios.isAxiosError(error)) {
//     if (!error.response) {
//       return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
//     }
    
//     const { status, data } = error.response;
    
//     // Extraire le message d'erreur du HTML Django si nécessaire
//     if (typeof data === 'string' && data.includes('IntegrityError')) {
//       const match = data.match(/class="exception_value">([^<]+)</);
//       if (match) {
//         return `Erreur base de données: ${match[1].trim()}`;
//       }
//       return 'Erreur d\'intégrité dans la base de données.';
//     }
    
//     if (status === 400) {
//       return data?.detail || data?.message || 'Données invalides';
//     }
    
//     if (status === 401) {
//       return 'Session expirée. Veuillez vous reconnecter.';
//     }
    
//     if (status === 403) {
//       return 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
//     }
    
//     if (status === 404) {
//       return 'Ressource non trouvée.';
//     }
    
//     if (status === 500) {
//       if (data?.detail) {
//         return `Erreur serveur: ${data.detail}`;
//       }
//       return 'Erreur interne du serveur. Veuillez contacter l\'administrateur.';
//     }
    
//     return data?.detail || data?.message || `Erreur ${status}`;
//   }
  
//   return error.message || 'Erreur inconnue';
// };

// // ==================== TEST DE CONNEXION ====================
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     console.log('🌐 Test de connexion au serveur...');
//     const response = await axios.get(API_BASE_URL, { timeout: 5000 });
//     console.log('✅ Serveur accessible, status:', response.status);
//     return response.status === 200;
//   } catch (error) {
//     console.error('🌐 Serveur inaccessible:', error);
//     return false;
//   }
// };

// // ==================== FONCTION POUR DÉBOGUER ====================
// export const debugRequest = async (method: string, url: string, data?: any) => {
//   try {
//     console.log(`🐛 Debug ${method} ${url}:`);
//     console.log('- Data:', data);
//     console.log('- Token:', getAuthToken()?.substring(0, 20) + '...');
    
//     let response;
//     switch (method.toLowerCase()) {
//       case 'get':
//         response = await api.get(url);
//         break;
//       case 'post':
//         response = await api.post(url, data);
//         break;
//       case 'put':
//         response = await api.put(url, data);
//         break;
//       case 'patch':
//         response = await api.patch(url, data);
//         break;
//       case 'delete':
//         response = await api.delete(url);
//         break;
//       default:
//         throw new Error(`Méthode ${method} non supportée`);
//     }
    
//     console.log(`✅ Debug ${method} ${url} - Réussite:`, response.data);
//     return response;
//   } catch (error) {
//     console.error(`❌ Debug ${method} ${url} - Erreur:`, error);
//     throw error;
//   }
// };

// export default api;





// import axios from 'axios';
// import {
//   User,
//   Fournisseur,
//   Materiel,
//   Incident,
//   Alerte,
//   Reparation,
//   ProfilUtilisateur,
//   DashboardData,
//   LoginCredentials,
//   HistoriqueAction
// } from '../types';

// // ==================== CONFIGURATION ====================
// console.log('⚙️ Configuration API - VITE_API_URL:', import.meta.env.VITE_API_URL);

// // Configuration basique
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';
// // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// console.log('🌐 URL de base:', API_BASE_URL);

// // Instance axios unique
// const api = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
// });

// // ==================== GESTION DES TOKENS ====================
// const getAuthToken = (): string | null => {
//   return localStorage.getItem('auth_token');
// };

// // Intercepteur pour ajouter le token d'authentification
// api.interceptors.request.use(
//   (config) => {
//     const authToken = getAuthToken();
//     if (authToken && config.headers) {
//       config.headers.Authorization = `Token ${authToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Intercepteur pour gérer les erreurs
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.error('❌ Erreur API:', {
//       url: error.config?.url,
//       status: error.response?.status,
//       message: error.message,
//       data: error.response?.data
//     });

//     // Gestion des erreurs d'authentification
//     if (error.response?.status === 401) {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }

//     return Promise.reject(error);
//   }
// );

// // ==================== FONCTION UTILITAIRE ====================
// const extractData = (response: any): any[] => {
//   if (!response?.data) {
//     console.log('⚠️ Réponse API sans data:', response);
//     return [];
//   }
  
//   const { data } = response;
  
//   if (Array.isArray(data)) return data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   if (typeof data === 'object') {
//     const values = Object.values(data);
//     if (values.length > 0 && Array.isArray(values[0])) return values[0];
//     return [data];
//   }
  
//   console.warn('⚠️ Format de réponse non reconnu:', data);
//   return [];
// };

// // ==================== API ENDPOINTS ====================
// const createApiEndpoint = <T>(endpoint: string) => ({
//   getAll: async (params?: any) => {
//     try {
//       console.log(`📡 GET ${endpoint}...`);
//       const response = await api.get(endpoint, { params });
//       console.log(`✅ GET ${endpoint} - Réussite:`, response.data?.length || '?', 'éléments');
//       return { data: extractData(response) };
//     } catch (error) {
//       console.error(`❌ Erreur GET ${endpoint}:`, error);
//       return { data: [] };
//     }
//   },
  
//   getById: async (id: number) => {
//     try {
//       console.log(`📡 GET ${endpoint}${id}/...`);
//       const response = await api.get<T>(`${endpoint}${id}/`);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur GET ${endpoint}${id}/:`, error);
//       throw error;
//     }
//   },
  
//   create: async (data: Partial<T>) => {
//     try {
//       console.log(`📡 POST ${endpoint}...`);
//       console.log('📦 Données envoyées:', data);
//       const response = await api.post<T>(endpoint, data);
//       console.log(`✅ POST ${endpoint} - Réussite:`, response.data);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur POST ${endpoint}:`, error);
//       throw error;
//     }
//   },
  
//   update: async (id: number, data: Partial<T>) => {
//     try {
//       console.log(`📡 PUT ${endpoint}${id}/...`);
//       console.log('📦 Données envoyées:', data);
//       const response = await api.patch<T>(`${endpoint}${id}/`, data);
//       console.log(`✅ PUT ${endpoint}${id}/ - Réussite:`, response.data);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur PUT ${endpoint}${id}/:`, error);
//       throw error;
//     }
//   },
  
//   delete: async (id: number) => {
//     try {
//       console.log(`📡 DELETE ${endpoint}${id}/...`);
//       const response = await api.delete(`${endpoint}${id}/`);
//       console.log(`✅ DELETE ${endpoint}${id}/ - Réussite`);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur DELETE ${endpoint}${id}/:`, error);
//       throw error;
//     }
//   }
// });

// // APIs spécifiques
// export const usersAPI = createApiEndpoint<User>('/users/');
// export const fournisseursAPI = createApiEndpoint<Fournisseur>('/fournisseurs/');
// export const materielsAPI = createApiEndpoint<Materiel>('/materiels/');
// export const alertesAPI = createApiEndpoint<Alerte>('/alertes/');
// export const profilsUtilisateurAPI = createApiEndpoint<ProfilUtilisateur>('/profils-utilisateurs/');
// export const historiqueAPI = createApiEndpoint<HistoriqueAction>('/historique/');

// // API pour incidents avec méthode spéciale
// export const incidentsAPI = {
//   ...createApiEndpoint<Incident>('/incidents/'),
//   resoudre: async (id: number) => {
//     try {
//       console.log(`📡 POST /incidents/${id}/resoudre/...`);
//       const response = await api.post(`/incidents/${id}/resoudre/`);
//       console.log(`✅ POST /incidents/${id}/resoudre/ - Réussite`);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur POST /incidents/${id}/resoudre/:`, error);
//       throw error;
//     }
//   },
// };

// // ==================== API SPÉCIALE POUR RÉPARATIONS ====================
// // Fonction pour valider et forcer le technicien_responsable
// const validateReparationData = (data: any) => {
//   const validated = { ...data };
  
//   // CRITIQUE : Assurer que technicien_responsable n'est jamais null ou undefined
//   if (!validated.technicien_responsable || 
//       validated.technicien_responsable.trim() === '' ||
//       validated.technicien_responsable === 'null' ||
//       validated.technicien_responsable === 'undefined') {
    
//     console.warn('⚠️ technicien_responsable invalide, remplacement par défaut');
//     validated.technicien_responsable = 'Technicien DREN';
//   }
  
//   // Convertir materiel en nombre si nécessaire
//   if (validated.materiel && typeof validated.materiel === 'string') {
//     validated.materiel = parseInt(validated.materiel);
//   }
  
//   // Nettoyer les autres champs
//   if (validated.description) {
//     validated.description = validated.description.trim();
//   }
  
//   if (validated.cout) {
//     validated.cout = parseFloat(validated.cout) || 0;
//   }
  
//   // Gérer incident - si null ou vide, le retirer
//   if (validated.incident === null || validated.incident === '' || validated.incident === 'null') {
//     delete validated.incident;
//   } else if (typeof validated.incident === 'string') {
//     validated.incident = parseInt(validated.incident);
//   }
  
//   return validated;
// };

// // API pour réparations avec journalisation détaillée et validation
// export const reparationsAPI = {
//   getAll: async (params?: any) => {
//     try {
//       console.log(`📡 GET /reparations/...`);
//       const response = await api.get('/reparations/', { params });
//       console.log(`✅ GET /reparations/ - Réussite:`, response.data?.length || '?', 'éléments');
//       return { data: extractData(response) };
//     } catch (error) {
//       console.error(`❌ Erreur GET /reparations/:`, error);
//       return { data: [] };
//     }
//   },
  
//   getById: async (id: number) => {
//     try {
//       console.log(`📡 GET /reparations/${id}/...`);
//       const response = await api.get<Reparation>(`/reparations/${id}/`);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur GET /reparations/${id}/:`, error);
//       throw error;
//     }
//   },
  
//   // CRÉATION AVEC VALIDATION RENFORCÉE
//   create: async (data: any) => {
//     try {
//       console.log('📡 POST /reparations/');
      
//       // VALIDER les données avant envoi
//       const validatedData = validateReparationData(data);
      
//       console.log('📦 Données validées envoyées:', JSON.stringify(validatedData, null, 2));
//       console.log('👷 Technicien dans data:', validatedData.technicien_responsable);
//       console.log('🔍 Type de technicien:', typeof validatedData.technicien_responsable);
//       console.log('🔑 Token utilisé:', getAuthToken()?.substring(0, 20) + '...');
      
//       const response = await api.post<Reparation>('/reparations/', validatedData);
//       console.log('✅ POST /reparations/ - Succès:', response.data);
//       return response;
      
//     } catch (error: any) {
//       console.error('❌ Erreur POST /reparations/ - Détails:');
//       console.error('- Status:', error.response?.status);
//       console.error('- Status Text:', error.response?.statusText);
//       console.error('- Headers:', error.response?.headers);
//       console.error('- Data brute:', error.response?.data);
      
//       let errorMessage = 'Erreur lors de la création de la réparation';
      
//       if (error.response?.data) {
//         if (typeof error.response.data === 'string') {
//           // Essayer d'extraire le message d'erreur du HTML Django
//           const match = error.response.data.match(/class="exception_value">([^<]+)</);
//           if (match) {
//             errorMessage = match[1].trim();
//           }
//         } else if (error.response.data.detail) {
//           errorMessage = error.response.data.detail;
//         } else if (error.response.data.message) {
//           errorMessage = error.response.data.message;
//         } else if (Array.isArray(error.response.data.non_field_errors)) {
//           errorMessage = error.response.data.non_field_errors.join(', ');
//         }
//       }
      
//       console.error('- Message d\'erreur:', errorMessage);
      
//       throw new Error(errorMessage);
//     }
//   },
  
//   // MISE À JOUR AVEC VALIDATION RENFORCÉE
//   update: async (id: number, data: any) => {
//     try {
//       console.log(`📡 PUT /reparations/${id}/`);
      
//       // VALIDER les données avant envoi
//       const validatedData = validateReparationData(data);
      
//       console.log('📦 Données envoyées:', JSON.stringify(validatedData, null, 2));
//       console.log('👷 Technicien dans data:', validatedData.technicien_responsable);
      
//       const response = await api.patch<Reparation>(`/reparations/${id}/`, validatedData);
//       console.log(`✅ PUT /reparations/${id}/ - Réussite:`, response.data);
//       return response;
      
//     } catch (error: any) {
//       console.error(`❌ Erreur PUT /reparations/${id}/:`, error);
      
//       let errorMessage = 'Erreur lors de la mise à jour de la réparation';
      
//       if (error.response?.data) {
//         if (error.response.data.detail) {
//           errorMessage = error.response.data.detail;
//         } else if (error.response.data.message) {
//           errorMessage = error.response.data.message;
//         }
//       }
      
//       throw new Error(errorMessage);
//     }
//   },
  
//   delete: async (id: number) => {
//     try {
//       console.log(`📡 DELETE /reparations/${id}/...`);
//       const response = await api.delete(`/reparations/${id}/`);
//       console.log(`✅ DELETE /reparations/${id}/ - Réussite`);
//       return response;
//     } catch (error) {
//       console.error(`❌ Erreur DELETE /reparations/${id}/:`, error);
//       throw error;
//     }
//   },
  
//   // Méthode spéciale pour terminer une réparation
//   terminer: async (id: number, technicien: string) => {
//     try {
//       console.log(`✅ Terminer réparation ${id} par ${technicien}`);
//       const data = {
//         date_fin: new Date().toISOString(),
//         technicien_responsable: technicien
//       };
//       return await api.patch<Reparation>(`/reparations/${id}/`, data);
//     } catch (error) {
//       console.error(`❌ Erreur terminer réparation ${id}:`, error);
//       throw error;
//     }
//   }
// };

// // API dashboard
// export const dashboardAPI = {
//   getData: async (): Promise<DashboardData> => {
//     try {
//       console.log('📡 GET /tableau-de-bord/...');
//       const response = await api.get('/tableau-de-bord/');
//       console.log('✅ GET /tableau-de-bord/ - Réussite');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur dashboard:', error);
//       return {
//         stats: {
//           materiels_total: 0,
//           materiels_en_panne: 0,
//           incidents_ouverts: 0,
//           reparations_en_cours: 0
//         }
//       };
//     }
//   },
// };

// // ==================== AUTHENTIFICATION ====================
// export const authAPI = {
//   login: async (credentials: LoginCredentials) => {
//     try {
//       console.log('🔐 Tentative de connexion...');
//       console.log('👤 Username:', credentials.username);
      
//       // Essayer plusieurs endpoints
//       const endpoints = ['/login/', '/auth/login/', '/api/login/'];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔗 Essai endpoint: ${endpoint}`);
//           const response = await axios.post(`${API_BASE_URL}${endpoint}`, credentials, {
//             headers: { 'Content-Type': 'application/json' },
//             timeout: 10000
//           });
          
//           console.log(`✅ ${endpoint} - Réponse:`, response.data);
          
//           if (response.data.token) {
//             localStorage.setItem('auth_token', response.data.token);
//             if (response.data.user) {
//               localStorage.setItem('user', JSON.stringify(response.data.user));
//             }
//             return response.data;
//           }
//         } catch (error) {
//           console.log(`❌ ${endpoint} échoué:`, error);
//           continue;
//         }
//       }
      
//       throw new Error('Échec de la connexion');
      
//     } catch (error: any) {
//       console.error('❌ Erreur login:', error);
      
//       // Pour le développement, créer un utilisateur mock
//       if (import.meta.env.DEV) {
//         console.log('🔄 Mode développement - création utilisateur mock');
//         const mockToken = 'dev-token-' + Date.now();
//         const mockUser = {
//           id: 1,
//           username: credentials.username,
//           email: `${credentials.username}@example.com`,
//           first_name: credentials.username,
//           last_name: 'Développeur',
//           role: 'admin',
//           nom_complet: `${credentials.username} Développeur`
//         };
        
//         localStorage.setItem('auth_token', mockToken);
//         localStorage.setItem('user', JSON.stringify(mockUser));
        
//         return {
//           token: mockToken,
//           user: mockUser
//         };
//       }
      
//       throw error;
//     }
//   },
  
//   logout: async () => {
//     try {
//       console.log('🚪 Déconnexion...');
//       await api.post('/logout/');
//     } catch (error) {
//       console.warn('⚠️ Erreur logout:', error);
//     } finally {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user');
//       console.log('✅ Déconnexion terminée');
//       window.location.href = '/login';
//     }
//   },
  
//   checkAuth: async () => {
//     try {
//       console.log('🔍 Vérification authentification...');
//       const response = await api.get('/users/me/');
//       console.log('✅ Auth vérifiée:', response.data);
//       return response.data;
//     } catch (error) {
//       // Vérifier si un token existe en local
//       const token = localStorage.getItem('auth_token');
//       const user = localStorage.getItem('user');
      
//       if (token && user) {
//         console.log('✅ Session locale active');
//         const userObj = JSON.parse(user);
        
//         // S'assurer que nom_complet existe
//         if (!userObj.nom_complet) {
//           userObj.nom_complet = userObj.username || 'Utilisateur';
//         }
        
//         return userObj;
//       }
      
//       console.error('❌ Aucune session active');
//       throw error;
//     }
//   }
// };

// // ==================== API POUR MATÉRIELS EN PANNE ====================
// export const materielsPanneAPI = {
//   getMaterielsEnPanne: async (): Promise<Materiel[]> => {
//     try {
//       console.log('🔍 Chargement des matériels en panne...');
      
//       // Essayer plusieurs endpoints
//       const endpoints = [
//         '/materiels-panne/',
//         '/materiels/en_panne/',
//         '/materiels/?etat=en_panne',
//         '/materiels/?etat=panne'
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           const response = await api.get(endpoint);
//           const data = extractData(response);
          
//           if (data.length > 0) {
//             console.log(`✅ ${data.length} matériel(s) en panne trouvé(s) via ${endpoint}`);
//             return data as Materiel[];
//           }
//         } catch (error) {
//           console.log(`❌ ${endpoint} échoué:`, error);
//           continue;
//         }
//       }
      
//       // Fallback: récupérer tous les matériels et filtrer côté client
//       console.log('⚠️ Aucun endpoint spécifique, filtrage côté client...');
//       const response = await api.get('/materiels/');
//       const allMateriels = extractData(response);
      
//       const materielsEnPanne = allMateriels.filter((m: any) => {
//         const etat = (m.etat || m.status || '').toLowerCase();
//         return etat.includes('panne') || etat.includes('en_panne') || etat.includes('broken');
//       });
      
//       console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne filtré(s)`);
//       return materielsEnPanne as Materiel[];
      
//     } catch (error: any) {
//       console.error('❌ Erreur chargement matériels en panne:', error);
//       return [];
//     }
//   }
// };

// // ==================== GESTION DES ERREURS ====================
// export const handleApiError = (error: any): string => {
//   console.error('🛑 Gestion erreur API:', error);
  
//   if (axios.isAxiosError(error)) {
//     if (!error.response) {
//       return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
//     }
    
//     const { status, data } = error.response;
    
//     // Extraire le message d'erreur du HTML Django si nécessaire
//     if (typeof data === 'string' && data.includes('IntegrityError')) {
//       const match = data.match(/class="exception_value">([^<]+)</);
//       if (match) {
//         return `Erreur base de données: ${match[1].trim()}`;
//       }
//       return 'Erreur d\'intégrité dans la base de données.';
//     }
    
//     if (status === 400) {
//       return data?.detail || data?.message || 'Données invalides';
//     }
    
//     if (status === 401) {
//       return 'Session expirée. Veuillez vous reconnecter.';
//     }
    
//     if (status === 403) {
//       return 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
//     }
    
//     if (status === 404) {
//       return 'Ressource non trouvée.';
//     }
    
//     if (status === 500) {
//       if (data?.detail) {
//         return `Erreur serveur: ${data.detail}`;
//       }
//       return 'Erreur interne du serveur. Veuillez contacter l\'administrateur.';
//     }
    
//     return data?.detail || data?.message || `Erreur ${status}`;
//   }
  
//   return error.message || 'Erreur inconnue';
// };

// // ==================== TEST DE CONNEXION ====================
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     console.log('🌐 Test de connexion au serveur...');
//     const response = await axios.get(API_BASE_URL, { timeout: 5000 });
//     console.log('✅ Serveur accessible, status:', response.status);
//     return response.status === 200;
//   } catch (error) {
//     console.error('🌐 Serveur inaccessible:', error);
//     return false;
//   }
// };

// // ==================== FONCTION POUR DÉBOGUER ====================
// export const debugRequest = async (method: string, url: string, data?: any) => {
//   try {
//     console.log(`🐛 Debug ${method} ${url}:`);
//     console.log('- Data:', JSON.stringify(data, null, 2));
//     console.log('- Token:', getAuthToken()?.substring(0, 20) + '...');
    
//     let response;
//     switch (method.toLowerCase()) {
//       case 'get':
//         response = await api.get(url);
//         break;
//       case 'post':
//         response = await api.post(url, data);
//         break;
//       case 'put':
//         response = await api.put(url, data);
//         break;
//       case 'patch':
//         response = await api.patch(url, data);
//         break;
//       case 'delete':
//         response = await api.delete(url);
//         break;
//       default:
//         throw new Error(`Méthode ${method} non supportée`);
//     }
    
//     console.log(`✅ Debug ${method} ${url} - Réussite:`, response.data);
//     return response;
//   } catch (error) {
//     console.error(`❌ Debug ${method} ${url} - Erreur:`, error);
//     throw error;
//   }
// };

// export default api;