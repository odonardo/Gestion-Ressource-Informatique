





// // AuthContext.tsx - VERSION CORRIGÉE ET OPTIMISÉE
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import axios from 'axios';

// // Types
// interface User {
//   id: string | number;
//   username: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   full_name: string;
//   role: string;
//   departement?: string;
//   telephone?: string;
//   is_active?: boolean;
//   date_joined?: string;
// }

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User | null;
//   login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
//   register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
//   logout: () => Promise<void>;
//   isLoading: boolean;
//   refreshUserInfo: () => Promise<void>;
//   error: string | null;
// }

// interface RegisterData {
//   username: string;
//   email: string;
//   password: string;
//   first_name?: string;
//   last_name?: string;
//   role?: string;
//   password_confirm?: string;
//   departement?: string;
//   telephone?: string;
// }

// // Configuration
// // const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';
// const API_BASE_URL = 'https://gestion-ressource-informatique.onrender.com';

// // Créer une instance axios configurée
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Intercepteur pour ajouter le token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('auth_token');
//     if (token) {
//       config.headers.Authorization = `Token ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Initialisation - vérifier l'authentification au chargement
//   useEffect(() => {
//     console.log('🔄 Initialisation AuthContext');
//     console.log('🔧 API Base URL:', API_BASE_URL);
    
//     const initAuth = async () => {
//       const token = localStorage.getItem('auth_token');
//       const storedUser = localStorage.getItem('user_data');
      
//       if (token && storedUser) {
//         try {
//           // Vérifier si le token est toujours valide
//           await refreshUserInfo();
//           setIsAuthenticated(true);
//           console.log('✅ Session restaurée');
//         } catch (error) {
//           console.warn('⚠️ Session expirée ou invalide');
//           await logout();
//         }
//       }
//       setIsLoading(false);
//     };
    
//     initAuth();
//   }, []);

//   // Rafraîchir les infos utilisateur
//   const refreshUserInfo = async (): Promise<void> => {
//     try {
//       const response = await api.get('/users/me/');
//       const userData = response.data;
      
//       // Formater l'utilisateur
//       const formattedUser: User = {
//         id: userData.id,
//         username: userData.username,
//         email: userData.email,
//         first_name: userData.first_name || '',
//         last_name: userData.last_name || '',
//         full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username,
//         role: userData.role || userData.groups?.[0] || 'user',
//         departement: userData.departement,
//         telephone: userData.telephone,
//         is_active: userData.is_active,
//         date_joined: userData.date_joined
//       };
      
//       localStorage.setItem('user_data', JSON.stringify(formattedUser));
//       setUser(formattedUser);
//       setError(null);
      
//       console.log('✅ User info refreshed:', formattedUser.role);
      
//     } catch (error: any) {
//       console.error('❌ Could not refresh user info:', error.message);
//       throw error;
//     }
//   };

//   // Connexion
//   const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       console.log('🔐 Tentative de connexion avec:', username);
//       console.log('📤 URL:', `${API_BASE_URL}/login/`);
      
//       // Essayer plusieurs endpoints possibles
//       const endpoints = [
//         '/login/',
//         '/api/login/',
//         '/api-token-auth/',
//         '/auth/login/',
//         '/api/auth/login/',
//         '/token/'
//       ];
      
//       let lastError = null;
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai endpoint: ${endpoint}`);
          
//           const response = await api.post(endpoint, { username, password });
//           console.log(`✅ Réponse ${endpoint}:`, response.data);
          
//           // Gestion des différents formats de réponse
//           let token = null;
//           let userData = null;
          
//           if (response.data.token) {
//             token = response.data.token;
//             userData = response.data.user;
//           } else if (response.data.access) {
//             token = response.data.access;
//             userData = response.data.user || response.data;
//           } else if (response.data.key) {
//             token = response.data.key;
//             userData = response.data.user;
//           } else if (response.data.auth_token) {
//             token = response.data.auth_token;
//             userData = response.data.user;
//           }
          
//           if (!token) {
//             console.warn(`⚠️ ${endpoint}: Pas de token dans la réponse`);
//             continue;
//           }
          
//           // Stocker le token
//           localStorage.setItem('auth_token', token);
          
//           // Si pas de données utilisateur, essayer de les récupérer
//           if (!userData) {
//             try {
//               const userResponse = await api.get('/users/me/', {
//                 headers: { Authorization: `Token ${token}` }
//               });
//               userData = userResponse.data;
//             } catch (userError) {
//               console.warn('⚠️ Impossible de récupérer les infos utilisateur');
//               userData = { username, role: 'user' };
//             }
//           }
          
//           // Formater l'utilisateur
//           const formattedUser: User = {
//             id: userData.id || Date.now(),
//             username: userData.username || username,
//             email: userData.email || '',
//             first_name: userData.first_name || '',
//             last_name: userData.last_name || '',
//             full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || username,
//             role: userData.role || userData.groups?.[0] || 'user',
//             departement: userData.departement,
//             telephone: userData.telephone
//           };
          
//           localStorage.setItem('user_data', JSON.stringify(formattedUser));
//           setUser(formattedUser);
//           setIsAuthenticated(true);
          
//           console.log('✅ Login successful! Role:', formattedUser.role);
//           return { success: true };
          
//         } catch (error: any) {
//           lastError = error;
//           const status = error.response?.status;
          
//           if (status === 404) {
//             console.log(`➡️ ${endpoint} non trouvé, essai suivant...`);
//             continue;
//           } else if (status === 401) {
//             console.log(`❌ ${endpoint}: Identifiants incorrects`);
//             return { 
//               success: false, 
//               message: 'Nom d\'utilisateur ou mot de passe incorrect' 
//             };
//           } else {
//             console.log(`⚠️ ${endpoint}: Erreur ${status || error.message}`);
//             continue;
//           }
//         }
//       }
      
//       // Tous les endpoints ont échoué
//       console.error('❌ Tous les endpoints de login ont échoué');
//       setError('Impossible de se connecter au serveur');
//       return { 
//         success: false, 
//         message: 'Service de connexion indisponible' 
//       };
      
//     } catch (error: any) {
//       console.error('❌ Login error:', error);
//       setError(error.message);
//       return { 
//         success: false, 
//         message: 'Erreur de connexion: ' + (error.message || 'Serveur inaccessible') 
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Inscription
//   const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       console.log('📝 Tentative d\'inscription:', userData.username);
      
//       // Préparer les données pour Django
//       const registrationData = {
//         username: userData.username,
//         email: userData.email,
//         password: userData.password,
//         password2: userData.password_confirm || userData.password,
//         first_name: userData.first_name || '',
//         last_name: userData.last_name || ''
//       };
      
//       // Essayer différents endpoints
//       const endpoints = ['/register/', '/api/register/', '/auth/register/', '/users/'];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai inscription: ${endpoint}`);
          
//           const response = await api.post(endpoint, registrationData);
//           console.log(`✅ Inscription ${endpoint}:`, response.data);
          
//           // Si l'inscription réussit, connecter automatiquement
//           if (response.data.token || response.data.access) {
//             const loginResult = await login(userData.username, userData.password);
            
//             if (loginResult.success) {
//               return { 
//                 success: true, 
//                 message: response.data.message || 'Compte créé avec succès!' 
//               };
//             }
//           }
          
//           return { 
//             success: true, 
//             message: response.data.detail || 'Inscription réussie!' 
//           };
          
//         } catch (error: any) {
//           const status = error.response?.status;
          
//           if (status === 404) {
//             continue; // Essayer le prochain endpoint
//           } else if (status === 400) {
//             // Erreurs de validation Django
//             const errors = error.response.data;
//             let errorMessage = 'Erreur de validation';
            
//             if (typeof errors === 'object') {
//               for (const [field, messages] of Object.entries(errors)) {
//                 if (Array.isArray(messages)) {
//                   errorMessage = `${field}: ${messages[0]}`;
//                   break;
//                 }
//               }
//             } else if (typeof errors === 'string') {
//               errorMessage = errors;
//             }
            
//             return { success: false, message: errorMessage };
//           }
          
//           console.log(`⚠️ ${endpoint}: Erreur ${status || error.message}`);
//         }
//       }
      
//       return { 
//         success: false, 
//         message: 'Aucun endpoint d\'inscription disponible' 
//       };
      
//     } catch (error: any) {
//       console.error('❌ Registration error:', error);
//       setError(error.message);
//       return { 
//         success: false, 
//         message: 'Erreur serveur: ' + (error.message || 'Impossible de créer le compte') 
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Déconnexion
//   const logout = async (): Promise<void> => {
//     try {
//       // Appeler l'endpoint logout si disponible
//       await api.post('/logout/');
//     } catch (error) {
//       console.warn('⚠️ Logout endpoint non disponible, déconnexion locale uniquement');
//     } finally {
//       // Nettoyer le localStorage
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user_data');
      
//       // Réinitialiser l'état
//       setIsAuthenticated(false);
//       setUser(null);
//       setError(null);
      
//       console.log('✅ Déconnexion réussie');
      
//       // Rediriger vers la page de login
//       window.location.href = '/login';
//     }
//   };

//   const value = {
//     isAuthenticated,
//     user,
//     login,
//     register,
//     logout,
//     isLoading,
//     refreshUserInfo,
//     error
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
//   }
//   return context;
// };

// // Hook utilitaire pour la protection des routes
// export const useRequireAuth = () => {
//   const { isAuthenticated, isLoading } = useAuth();
  
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       window.location.href = '/login';
//     }
//   }, [isAuthenticated, isLoading]);
  
//   return { isAuthenticated, isLoading };
// };






















// // AuthContext.tsx - VERSION FINALE CORRIGÉE
// import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
// import axios from 'axios';

// // Types
// interface User {
//   id: string | number;
//   username: string;
//   email: string;
//   // name: string;
//   first_name: string;
//   last_name: string;
//   full_name: string;
//   role: string;
//   departement?: string;
//   telephone?: string;
// }

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User | null;
//   login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
//   register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
//   logout: () => void;
//   isLoading: boolean;
//   error: string | null;
//   clearError: () => void;
// }

// interface RegisterData {
//   username: string;
//   email: string;
//   password: string;
//   name?: string;
//   first_name?: string;
//   last_name?: string;
//   role?: string;
//   password_confirm?: string;
//   departement?: string;
//   telephone?: string;
// }

// // Configuration
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const initRef = useRef(false);
  
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
//     return !!localStorage.getItem('auth_token');
//   });
  
//   const [user, setUser] = useState<User | null>(() => {
//     try {
//       const stored = localStorage.getItem('user_data');
//       return stored ? JSON.parse(stored) : null;
//     } catch {
//       return null;
//     }
//   });
  
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const clearError = () => setError(null);

//   // Initialisation UNE SEULE FOIS
//   useEffect(() => {
//     if (initRef.current) return;
//     initRef.current = true;
    
//     console.log('🔄 AuthContext initialisé - URL:', API_BASE_URL);
    
//     const token = localStorage.getItem('auth_token');
//     if (token && !user) {
//       setIsLoading(true);
//       verifyToken(token)
//         .then(() => {
//           console.log('✅ Session restaurée');
//         })
//         .catch(() => {
//           console.warn('⚠️ Session expirée');
//           localStorage.removeItem('auth_token');
//           localStorage.removeItem('user_data');
//           setIsAuthenticated(false);
//         })
//         .finally(() => {
//           setIsLoading(false);
//         });
//     } else {
//       setIsLoading(false);
//     }
//   }, []);

//   const verifyToken = async (token: string): Promise<void> => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/users/me/`, {
//         headers: { Authorization: `Token ${token}` }
//       });
      
//       const userData = response.data;
//       const formattedUser: User = {
//         id: userData.id,
//         username: userData.username,
//         email: userData.email,
//         name: userData.name || '',
//         first_name: userData.first_name || '',
//         last_name: userData.last_name || '',
//         full_name: userData.full_name || userData.name || userData.username,
//         role: userData.role || 'user',
//         departement: userData.departement,
//         telephone: userData.telephone
//       };
      
//       setUser(formattedUser);
//       setIsAuthenticated(true);
//       localStorage.setItem('user_data', JSON.stringify(formattedUser));
      
//     } catch (error) {
//       throw new Error('Token invalide');
//     }
//   };

//   const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
//     setIsLoading(true);
//     clearError();
    
//     try {
//       console.log('🔐 Tentative de connexion...');
      
//       const response = await axios.post(
//         `${API_BASE_URL}/login/`,
//         { username, password },
//         { timeout: 10000 }
//       );

//       console.log('✅ Réponse login:', response.data);

//       const token = response.data.token || response.data.access || response.data.key;
//       if (!token) {
//         return {
//           success: false,
//           message: 'Token manquant dans la réponse'
//         };
//       }

//       localStorage.setItem('auth_token', token);

//       let userData = response.data.user;
//       if (!userData) {
//         try {
//           const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
//             headers: { Authorization: `Token ${token}` }
//           });
//           userData = userResponse.data;
//         } catch {
//           userData = {
//             id: Date.now(),
//             username,
//             email: '',
//             name: username,
//             role: 'user'
//           };
//         }
//       }

//       const formattedUser: User = {
//         id: userData.id || Date.now(),
//         username: userData.username || username,
//         email: userData.email || '',
//         // name: userData.name || username,
//         first_name: userData.first_name || '',
//         last_name: userData.last_name || '',
//         full_name: userData.full_name || userData.name || username,
//         role: userData.role || 'user',
//         departement: userData.departement,
//         telephone: userData.telephone
//       };

//       localStorage.setItem('user_data', JSON.stringify(formattedUser));
//       setUser(formattedUser);
//       setIsAuthenticated(true);
      
//       return { success: true, message: 'Connexion réussie' };

//     } catch (error: any) {
//       console.error('❌ Erreur login:', error);
      
//       let errorMessage = 'Erreur de connexion';
      
//       if (error.response) {
//         const { status, data } = error.response;
        
//         if (status === 400 || status === 401) {
//           errorMessage = data?.detail || data?.non_field_errors?.[0] || 'Identifiants incorrects';
//         }
//       }
      
//       setError(errorMessage);
//       return { success: false, message: errorMessage };
      
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // FONCTION D'INSCRIPTION CORRIGÉE SELON LES ERREURS DU BACKEND
//   const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
//     setIsLoading(true);
//     clearError();
    
//     try {
//       console.log('📝 =========== TENTATIVE D\'INSCRIPTION ===========');
//       console.log('📤 URL:', `${API_BASE_URL}/register/`);
      
//       // CORRECTION: Basé sur les erreurs reçues, le backend attend:
//       // 1. "name" au lieu de "first_name"/"last_name"
//       // 2. "password" et "password_confirm" (pas password1/password2)
      
//       const registrationData = {
//         username: userData.username.trim(),
//         email: userData.email.trim(),
//         password: userData.password,
//         password_confirm: userData.password_confirm || userData.password,
//         name: userData.name || userData.first_name || userData.username,
//         role: userData.role || 'user',
//         departement: userData.departement || '',
//         telephone: userData.telephone || ''
//       };
      
//       console.log('📤 Données envoyées (CORRIGÉES):', registrationData);
      
//       const response = await axios.post(
//         `${API_BASE_URL}/register/`,
//         registrationData,
//         { 
//           timeout: 10000,
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('✅ Réponse du serveur:', response.data);
      
//       if (response.status >= 200 && response.status < 300) {
//         // Vérifier si la réponse contient un token
//         const token = response.data.token || response.data.access;
        
//         if (token) {
//           localStorage.setItem('auth_token', token);
          
//           const userDataResponse = response.data.user || {
//             id: Date.now(),
//             username: registrationData.username,
//             email: registrationData.email,
//             name: registrationData.name,
//             role: registrationData.role
//           };
          
//           const formattedUser: User = {
//             id: userDataResponse.id,
//             username: userDataResponse.username,
//             email: userDataResponse.email,
//             name: userDataResponse.name || registrationData.name,
//             first_name: userDataResponse.first_name || '',
//             last_name: userDataResponse.last_name || '',
//             full_name: userDataResponse.full_name || userDataResponse.name || registrationData.name,
//             role: userDataResponse.role || registrationData.role,
//             departement: userDataResponse.departement,
//             telephone: userDataResponse.telephone
//           };
          
//           localStorage.setItem('user_data', JSON.stringify(formattedUser));
//           setUser(formattedUser);
//           setIsAuthenticated(true);
          
//           return {
//             success: true,
//             message: response.data.message || 'Compte créé avec succès!'
//           };
//         } else {
//           // Si pas de token, essayer de se connecter automatiquement
//           const loginResult = await login(userData.username, userData.password);
          
//           if (loginResult.success) {
//             return {
//               success: true,
//               message: response.data.message || 'Compte créé avec succès!'
//             };
//           } else {
//             return {
//               success: false,
//               message: 'Compte créé mais connexion échouée'
//             };
//           }
//         }
//       }
      
//       return {
//         success: false,
//         message: 'Réponse inattendue du serveur'
//       };
      
//     } catch (error: any) {
//       console.error('❌ Erreur inscription:', error);
      
//       let errorMessage = 'Erreur lors de l\'inscription';
//       let errorDetails = '';
      
//       if (error.response) {
//         const { status, data } = error.response;
//         console.error('📋 Détails erreur:', { status, data });
        
//         if (status === 400) {
//           // Analyser les erreurs spécifiques
//           if (data.errors) {
//             const errors = data.errors;
//             const errorMessages: string[] = [];
            
//             if (errors.password && Array.isArray(errors.password) && errors.password.length > 0) {
//               errorMessages.push(`Mot de passe: ${errors.password[0]}`);
//             }
            
//             if (errors.password_confirm && Array.isArray(errors.password_confirm) && errors.password_confirm.length > 0) {
//               errorMessages.push(`Confirmation: ${errors.password_confirm[0]}`);
//             }
            
//             if (errors.name && Array.isArray(errors.name) && errors.name.length > 0) {
//               errorMessages.push(`Nom: ${errors.name[0]}`);
//             }
            
//             if (errors.username && Array.isArray(errors.username) && errors.username.length > 0) {
//               errorMessages.push(`Nom d'utilisateur: ${errors.username[0]}`);
//             }
            
//             if (errors.email && Array.isArray(errors.email) && errors.email.length > 0) {
//               errorMessages.push(`Email: ${errors.email[0]}`);
//             }
            
//             if (errorMessages.length > 0) {
//               errorDetails = errorMessages.join(', ');
//             }
//           }
          
//           errorMessage = data.message || 'Données invalides';
//           if (errorDetails) {
//             errorMessage += ' - ' + errorDetails;
//           }
//         } else if (status === 409) {
//           errorMessage = 'Nom d\'utilisateur ou email déjà utilisé';
//         }
//       }
      
//       console.error('❌ Message d\'erreur final:', errorMessage);
//       setError(errorMessage);
//       return { success: false, message: errorMessage };
      
//     } finally {
//       setIsLoading(false);
//       console.log('📝 =========== FIN TENTATIVE D\'INSCRIPTION ===========\n');
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('user_data');
//     setIsAuthenticated(false);
//     setUser(null);
//     clearError();
    
//     console.log('✅ Déconnexion');
//     window.location.href = '/login';
//   };

//   const value: AuthContextType = {
//     isAuthenticated,
//     user,
//     login,
//     register,
//     logout,
//     isLoading,
//     error,
//     clearError
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth doit être dans un AuthProvider');
//   }
//   return context;
// };











// AuthContext.tsx - VERSION FINALE CORRIGÉE
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import axios from 'axios';

// Types
interface User {
  id: string | number;
  username: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  departement?: string;
  telephone?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  password_confirm?: string;
  departement?: string;
  telephone?: string;
}

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initRef = useRef(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('auth_token');
  });
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user_data');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Initialisation UNE SEULE FOIS
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    console.log('🔄 AuthContext initialisé - URL:', API_BASE_URL);
    
    const token = localStorage.getItem('auth_token');
    if (token && !user) {
      setIsLoading(true);
      verifyToken(token)
        .then(() => {
          console.log('✅ Session restaurée');
        })
        .catch(() => {
          console.warn('⚠️ Session expirée');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string): Promise<void> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/me/`, {
        headers: { Authorization: `Token ${token}` }
      });
      
      const userData = response.data;
      const formattedUser: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        name: userData.name || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        full_name: userData.full_name || userData.name || userData.username,
        role: userData.role || 'user',
        departement: userData.departement,
        telephone: userData.telephone
      };
      
      setUser(formattedUser);
      setIsAuthenticated(true);
      localStorage.setItem('user_data', JSON.stringify(formattedUser));
      
    } catch (error) {
      throw new Error('Token invalide');
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    clearError();
    
    try {
      console.log('🔐 Tentative de connexion...');
      
      const response = await axios.post(
        `${API_BASE_URL}/login/`,
        { username, password },
        { timeout: 10000 }
      );

      console.log('✅ Réponse login:', response.data);

      const token = response.data.token || response.data.access || response.data.key;
      if (!token) {
        return {
          success: false,
          message: 'Token manquant dans la réponse'
        };
      }

      localStorage.setItem('auth_token', token);

      let userData = response.data.user;
      if (!userData) {
        try {
          const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
            headers: { Authorization: `Token ${token}` }
          });
          userData = userResponse.data;
        } catch {
          userData = {
            id: Date.now(),
            username,
            email: '',
            name: username,
            role: 'user'
          };
        }
      }

      const formattedUser: User = {
        id: userData.id || Date.now(),
        username: userData.username || username,
        email: userData.email || '',
        name: userData.name || username,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        full_name: userData.full_name || userData.name || username,
        role: userData.role || 'user',
        departement: userData.departement,
        telephone: userData.telephone
      };

      localStorage.setItem('user_data', JSON.stringify(formattedUser));
      setUser(formattedUser);
      setIsAuthenticated(true);
      
      return { success: true, message: 'Connexion réussie' };

    } catch (error: any) {
      console.error('❌ Erreur login:', error);
      
      let errorMessage = 'Erreur de connexion';
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400 || status === 401) {
          errorMessage = data?.detail || data?.non_field_errors?.[0] || 'Identifiants incorrects';
        }
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
      
    } finally {
      setIsLoading(false);
    }
  };

  // FONCTION D'INSCRIPTION CORRIGÉE SELON LES ERREURS DU BACKEND
  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    clearError();
    
    try {
      console.log('📝 =========== TENTATIVE D\'INSCRIPTION ===========');
      console.log('📤 URL:', `${API_BASE_URL}/register/`);
      
      // CORRECTION: Basé sur les erreurs reçues, le backend attend:
      // 1. "name" au lieu de "first_name"/"last_name"
      // 2. "password" et "password_confirm" (pas password1/password2)
      
      const registrationData = {
        username: userData.username.trim(),
        email: userData.email.trim(),
        password: userData.password,
        password_confirm: userData.password_confirm || userData.password,
        name: userData.name || userData.first_name || userData.username,
        role: userData.role || 'user',
        departement: userData.departement || '',
        telephone: userData.telephone || ''
      };
      
      console.log('📤 Données envoyées (CORRIGÉES):', registrationData);
      
      const response = await axios.post(
        `${API_BASE_URL}/register/`,
        registrationData,
        { 
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Réponse du serveur:', response.data);
      
      if (response.status >= 200 && response.status < 300) {
        // Vérifier si la réponse contient un token
        const token = response.data.token || response.data.access;
        
        if (token) {
          localStorage.setItem('auth_token', token);
          
          const userDataResponse = response.data.user || {
            id: Date.now(),
            username: registrationData.username,
            email: registrationData.email,
            name: registrationData.name,
            role: registrationData.role
          };
          
          const formattedUser: User = {
            id: userDataResponse.id,
            username: userDataResponse.username,
            email: userDataResponse.email,
            name: userDataResponse.name || registrationData.name,
            first_name: userDataResponse.first_name || '',
            last_name: userDataResponse.last_name || '',
            full_name: userDataResponse.full_name || userDataResponse.name || registrationData.name,
            role: userDataResponse.role || registrationData.role,
            departement: userDataResponse.departement,
            telephone: userDataResponse.telephone
          };
          
          localStorage.setItem('user_data', JSON.stringify(formattedUser));
          setUser(formattedUser);
          setIsAuthenticated(true);
          
          return {
            success: true,
            message: response.data.message || 'Compte créé avec succès!'
          };
        } else {
          // Si pas de token, essayer de se connecter automatiquement
          const loginResult = await login(userData.username, userData.password);
          
          if (loginResult.success) {
            return {
              success: true,
              message: response.data.message || 'Compte créé avec succès!'
            };
          } else {
            return {
              success: false,
              message: 'Compte créé mais connexion échouée'
            };
          }
        }
      }
      
      return {
        success: false,
        message: 'Réponse inattendue du serveur'
      };
      
    } catch (error: any) {
      console.error('❌ Erreur inscription:', error);
      
      let errorMessage = 'Erreur lors de l\'inscription';
      let errorDetails = '';
      
      if (error.response) {
        const { status, data } = error.response;
        console.error('📋 Détails erreur:', { status, data });
        
        if (status === 400) {
          // Analyser les erreurs spécifiques
          if (data.errors) {
            const errors = data.errors;
            const errorMessages: string[] = [];
            
            if (errors.password && Array.isArray(errors.password) && errors.password.length > 0) {
              errorMessages.push(`Mot de passe: ${errors.password[0]}`);
            }
            
            if (errors.password_confirm && Array.isArray(errors.password_confirm) && errors.password_confirm.length > 0) {
              errorMessages.push(`Confirmation: ${errors.password_confirm[0]}`);
            }
            
            if (errors.name && Array.isArray(errors.name) && errors.name.length > 0) {
              errorMessages.push(`Nom: ${errors.name[0]}`);
            }
            
            if (errors.username && Array.isArray(errors.username) && errors.username.length > 0) {
              errorMessages.push(`Nom d'utilisateur: ${errors.username[0]}`);
            }
            
            if (errors.email && Array.isArray(errors.email) && errors.email.length > 0) {
              errorMessages.push(`Email: ${errors.email[0]}`);
            }
            
            if (errorMessages.length > 0) {
              errorDetails = errorMessages.join(', ');
            }
          }
          
          errorMessage = data.message || 'Données invalides';
          if (errorDetails) {
            errorMessage += ' - ' + errorDetails;
          }
        } else if (status === 409) {
          errorMessage = 'Nom d\'utilisateur ou email déjà utilisé';
        }
      }
      
      console.error('❌ Message d\'erreur final:', errorMessage);
      setError(errorMessage);
      return { success: false, message: errorMessage };
      
    } finally {
      setIsLoading(false);
      console.log('📝 =========== FIN TENTATIVE D\'INSCRIPTION ===========\n');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
    clearError();
    
    console.log('✅ Déconnexion');
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être dans un AuthProvider');
  }
  return context;
};