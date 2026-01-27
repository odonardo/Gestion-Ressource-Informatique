





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
// const API_BASE_URL = 'https://gestion-ressource-informatique.onrender.com';

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











// // AuthContext.tsx - VERSION FINALE CORRIGÉE
// import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
// import axios from 'axios';

// // Types
// interface User {
//   id: string | number;
//   username: string;
//   email: string;
//   name: string;
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
//         name: userData.name || username,
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
//   groups?: string[];
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
//   password_confirm: string;
//   name?: string;
//   first_name?: string;
//   last_name?: string;
//   role?: string;
//   departement?: string;
//   telephone?: string;
// }

// // Configuration
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';

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

//   // Rafraîchir les infos utilisateur - CORRIGÉ pour gérer le rôle
//   const refreshUserInfo = async (): Promise<void> => {
//     const token = localStorage.getItem('auth_token');
//     if (!token) return;
    
//     try {
//       // Essayer plusieurs endpoints pour récupérer les infos utilisateur
//       const endpoints = [
//         '/api/users/me/',
//         '/users/me/',
//         '/api/auth/user/',
//         '/auth/user/',
//         '/get-user-role/', // Endpoint spécifique pour le rôle
//         '/api/user/profile/'
//       ];
      
//       let userData = null;
//       let userRole = 'user';
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Récupération info user: ${endpoint}`);
//           const response = await api.get(endpoint);
//           userData = response.data;
//           console.log(`✅ Données récupérées de ${endpoint}:`, userData);
          
//           // Essayer de déterminer le rôle
//           if (userData.role) {
//             userRole = userData.role;
//           } else if (userData.groups && userData.groups.length > 0) {
//             // Si pas de champ role, vérifier les groupes
//             const groups = userData.groups;
//             if (groups.includes('admin')) userRole = 'admin';
//             else if (groups.includes('technician')) userRole = 'technician';
//             else if (groups.includes('director')) userRole = 'director';
//             else if (groups.includes('secretary')) userRole = 'secretary';
//             else if (groups.includes('user')) userRole = 'user';
//           } else if (endpoint === '/get-user-role/' && userData.role) {
//             // Endpoint spécifique pour le rôle
//             userRole = userData.role;
//           }
//           break;
//         } catch (error: any) {
//           if (error.response?.status === 404) {
//             console.log(`➡️ ${endpoint} non trouvé, essai suivant...`);
//             continue;
//           }
//         }
//       }
      
//       // Si aucune donnée n'a été récupérée, utiliser les données stockées
//       if (!userData) {
//         const storedUser = localStorage.getItem('user_data');
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           userData = parsedUser;
//           userRole = parsedUser.role || 'user';
//         } else {
//           userData = {};
//         }
//       }
      
//       // Formater l'utilisateur
//       const formattedUser: User = {
//         id: userData.id || Date.now(),
//         username: userData.username || '',
//         email: userData.email || '',
//         first_name: userData.first_name || '',
//         last_name: userData.last_name || '',
//         full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username || '',
//         role: userRole,
//         departement: userData.departement,
//         telephone: userData.telephone,
//         is_active: userData.is_active,
//         date_joined: userData.date_joined,
//         groups: userData.groups
//       };
      
//       // Vérifier s'il y a un rôle demandé en attente
//       const requestedRole = localStorage.getItem('requested_role');
//       if (requestedRole && formattedUser.role === 'user') {
//         console.log(`🔄 Mise à jour du rôle demandé: ${requestedRole}`);
//         formattedUser.role = requestedRole;
//         localStorage.removeItem('requested_role');
//       }
      
//       localStorage.setItem('user_data', JSON.stringify(formattedUser));
//       setUser(formattedUser);
//       setError(null);
      
//       console.log('✅ User info refreshed. Role:', formattedUser.role);
      
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
      
//       // Essayer plusieurs endpoints possibles
//       const endpoints = [
//         '/login/', // Votre API répond à cet endpoint
//         '/api/auth/login/',
//         '/auth/login/',
//         '/api/login/',
//         '/api-token-auth/',
//         '/token/'
//       ];

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
          
//           // Rafraîchir les informations utilisateur
//           await refreshUserInfo();
          
//           setIsAuthenticated(true);
          
//           console.log('✅ Login successful!');
//           return { success: true };
          
//         } catch (error: any) {
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
//       setError(error.message);
//       return { 
//         success: false, 
//         message: 'Erreur de connexion: ' + (error.message || 'Serveur inaccessible') 
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Inscription - CORRIGÉ pour gérer le rôle correctement
//   const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       console.log('📝 Tentative d\'inscription:', userData.username);
//       console.log('📦 Données reçues:', userData);
      
//       // Sauvegarder le rôle demandé pour usage ultérieur
//       if (userData.role && userData.role !== 'user') {
//         localStorage.setItem('requested_role', userData.role);
//         console.log('📌 Rôle demandé sauvegardé:', userData.role);
//       }
      
//       // Extraire le nom complet et le diviser en first_name et last_name
//       const fullName = userData.name || '';
//       let first_name = '';
//       let last_name = '';
      
//       if (fullName) {
//         const nameParts = fullName.trim().split(' ');
//         if (nameParts.length >= 2) {
//           first_name = nameParts[0];
//           last_name = nameParts.slice(1).join(' ');
//         } else {
//           first_name = fullName;
//           last_name = '';
//         }
//       }
      
//       // Préparer les données pour l'API Django
//       const registrationData: any = {
//         username: userData.username,
//         email: userData.email,
//         password: userData.password,
//         password2: userData.password_confirm,
//         first_name: first_name || userData.first_name || '',
//         last_name: last_name || userData.last_name || ''
//       };
      
//       // Ajouter les champs optionnels si présents
//       if (userData.departement) {
//         registrationData.departement = userData.departement;
//       }
      
//       if (userData.telephone) {
//         registrationData.telephone = userData.telephone;
//       }
      
//       // Inclure le rôle dans les données d'inscription
//       if (userData.role) {
//         registrationData.role = userData.role;
//       }
      
//       console.log('📤 Données envoyées à l\'API:', registrationData);
      
//       // Essayer différents endpoints d'inscription
//       const endpoints = [
//         '/api/register/', // Celui qui fonctionne pour vous
//         '/register/',
//         '/api/auth/register/',
//         '/auth/register/',
//         '/api/users/',
//         '/users/'
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai inscription sur: ${endpoint}`);
          
//           const response = await api.post(endpoint, registrationData);
//           console.log(`✅ Inscription ${endpoint}:`, response.data);
          
//           // Stocker temporairement les données utilisateur avec le rôle
//           const tempUserData = {
//             id: response.data.id || Date.now(),
//             username: userData.username,
//             email: userData.email,
//             first_name: first_name || '',
//             last_name: last_name || '',
//             full_name: fullName || '',
//             role: userData.role || 'user',
//             departement: userData.departement,
//             telephone: userData.telephone
//           };
          
//           localStorage.setItem('user_data', JSON.stringify(tempUserData));
          
//           // Si l'inscription réussit, connecter automatiquement
//           if (response.data.token || response.data.access || response.data.key) {
//             const loginResult = await login(userData.username, userData.password);
            
//             if (loginResult.success) {
//               return { 
//                 success: true, 
//                 message: response.data.message || response.data.detail || 'Compte créé avec succès!' 
//               };
//             }
//           }
          
//           // Si pas de token mais succès
//           if (response.status >= 200 && response.status < 300) {
//             // Essayer de se connecter automatiquement
//             try {
//               const loginResult = await login(userData.username, userData.password);
//               if (loginResult.success) {
//                 return { 
//                   success: true, 
//                   message: 'Compte créé avec succès! Connexion automatique établie.' 
//                 };
//               }
//             } catch (loginError) {
//               // Continuer sans connexion automatique
//               return { 
//                 success: true, 
//                 message: 'Compte créé avec succès! Veuillez vous connecter.' 
//               };
//             }
            
//             return { 
//               success: true, 
//               message: response.data.detail || response.data.message || 'Inscription réussie!' 
//             };
//           }
          
//         } catch (error: any) {
//           const status = error.response?.status;
          
//           if (status === 404) {
//             console.log(`➡️ ${endpoint} non trouvé, essai suivant...`);
//             continue;
//           } else if (status === 400) {
//             // Erreurs de validation Django
//             const errors = error.response?.data;
//             console.log('❌ Erreurs de validation:', errors);
            
//             let errorMessage = 'Erreur lors de l\'inscription';
            
//             if (typeof errors === 'object') {
//               // Django REST Framework format
//               if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
//                 errorMessage = errors.non_field_errors[0];
//               } else if (errors.email && Array.isArray(errors.email)) {
//                 errorMessage = `Email: ${errors.email[0]}`;
//               } else if (errors.username && Array.isArray(errors.username)) {
//                 errorMessage = `Nom d'utilisateur: ${errors.username[0]}`;
//               } else if (errors.password && Array.isArray(errors.password)) {
//                 errorMessage = `Mot de passe: ${errors.password[0]}`;
//               } else if (errors.detail) {
//                 errorMessage = errors.detail;
//               } else {
//                 // Parcourir toutes les erreurs
//                 for (const [field, messages] of Object.entries(errors)) {
//                   if (Array.isArray(messages) && messages.length > 0) {
//                     errorMessage = `${field}: ${messages[0]}`;
//                     break;
//                   }
//                 }
//               }
//             } else if (typeof errors === 'string') {
//               errorMessage = errors;
//             }
            
//             return { success: false, message: errorMessage };
//           } else if (status === 500) {
//             console.error(`❌ Erreur serveur (500) sur ${endpoint}`);
//             return { 
//               success: false, 
//               message: 'Erreur serveur. Veuillez réessayer plus tard.' 
//             };
//           }
          
//           console.log(`⚠️ ${endpoint}: Erreur ${status || error.message}`);
//         }
//       }
      
//       return { 
//         success: false, 
//         message: 'Impossible de créer un compte. Veuillez contacter l\'administrateur.' 
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
//       localStorage.removeItem('requested_role');
      
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





















// // AuthContext.tsx - VERSION CORRIGÉE POUR VOS ENDPOINTS
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
//   password_confirm: string;
//   name: string;  // Champ "Nom complet" du formulaire
//   role: string;  // Champ "Rôle demandé" du formulaire
//   departement?: string;
//   telephone?: string;
// }

// // Configuration
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';

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

//   // Rafraîchir les infos utilisateur - CORRIGÉ POUR LES ENDPOINTS
//   const refreshUserInfo = async (): Promise<void> => {
//     const token = localStorage.getItem('auth_token');
//     if (!token) return;
    
//     try {
//       console.log('🔍 Tentative de récupération des infos utilisateur');
      
//       // Essayer plusieurs endpoints pour récupérer les infos utilisateur
//       const endpoints = [
//         '/get-user-role/',  // Endpoint spécifique pour le rôle
//         '/api/user/',       // Endpoint générique user
//         '/user/',           // Sans préfixe
//         '/profile/',        // Endpoint profile
//         '/auth/user/'       // Endpoint auth user
//       ];
      
//       let userData = null;
//       let userRole = 'user';
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai endpoint: ${endpoint}`);
//           const response = await api.get(endpoint);
//           userData = response.data;
//           console.log(`✅ Données récupérées de ${endpoint}:`, userData);
          
//           // Essayer de déterminer le rôle
//           if (userData.role) {
//             userRole = userData.role;
//           } else if (userData.groups && userData.groups.length > 0) {
//             // Si pas de champ role, vérifier les groupes
//             const groups = userData.groups;
//             if (groups.includes('admin')) userRole = 'admin';
//             else if (groups.includes('technician')) userRole = 'technician';
//             else if (groups.includes('director')) userRole = 'director';
//             else if (groups.includes('secretary')) userRole = 'secretary';
//             else if (groups.includes('user')) userRole = 'user';
//           }
//           break;
//         } catch (error: any) {
//           if (error.response?.status === 404) {
//             console.log(`➡️ ${endpoint} non trouvé, essai suivant...`);
//             continue;
//           }
//         }
//       }
      
//       // Si aucune donnée n'a été récupérée, utiliser les données stockées
//       if (!userData) {
//         const storedUser = localStorage.getItem('user_data');
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           userData = parsedUser;
//           userRole = parsedUser.role || 'user';
//           console.log('📌 Utilisation des données utilisateur stockées');
//         } else {
//           userData = {};
//           console.log('⚠️ Aucune donnée utilisateur trouvée');
//         }
//       }
      
//       // Formater l'utilisateur
//       const formattedUser: User = {
//         id: userData.id || Date.now(),
//         username: userData.username || '',
//         email: userData.email || '',
//         first_name: userData.first_name || '',
//         last_name: userData.last_name || '',
//         full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username || '',
//         role: userRole,
//         departement: userData.departement,
//         telephone: userData.telephone,
//         is_active: userData.is_active,
//         date_joined: userData.date_joined
//       };
      
//       localStorage.setItem('user_data', JSON.stringify(formattedUser));
//       setUser(formattedUser);
//       setError(null);
      
//       console.log('✅ User info refreshed. Role:', formattedUser.role);
      
//     } catch (error: any) {
//       console.error('❌ Could not refresh user info:', error.message);
//       // Ne pas throw l'erreur ici, on continue avec les données stockées
//       const storedUser = localStorage.getItem('user_data');
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//         console.log('📌 Utilisation des données utilisateur stockées après erreur');
//       }
//     }
//   };

//   // Connexion - CORRIGÉ POUR GÉRER LES DIFFÉRENTS FORMATS DE RÉPONSE
//   const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       console.log('🔐 Tentative de connexion avec:', username);
      
//       // Essayer plusieurs endpoints possibles
//       const endpoints = [
//         '/api-token-auth/',  // Celui qui fonctionne pour vous
//         '/login/',
//         '/api/login/',
//         '/api/auth/login/',
//         '/auth/login/',
//         '/token/'
//       ];
      
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
//           } else if (response.data.id) {
//             // Si la réponse contient directement les données utilisateur
//             userData = response.data;
//           }
          
//           if (!token && !userData) {
//             console.warn(`⚠️ ${endpoint}: Pas de token ni données utilisateur`);
//             continue;
//           }
          
//           // Stocker le token si présent
//           if (token) {
//             localStorage.setItem('auth_token', token);
//             console.log('✅ Token stocké');
//           }
          
//           // Si pas de données utilisateur, créer un objet minimal
//           if (!userData) {
//             userData = {
//               username: username,
//               role: 'user' // Rôle par défaut
//             };
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
//             telephone: userData.telephone,
//             is_active: userData.is_active,
//             date_joined: userData.date_joined
//           };
          
//           localStorage.setItem('user_data', JSON.stringify(formattedUser));
//           setUser(formattedUser);
//           setIsAuthenticated(true);
          
//           // Essayer de rafraîchir les infos (mais ne pas bloquer si ça échoue)
//           try {
//             await refreshUserInfo();
//           } catch (refreshError) {
//             console.warn('⚠️ Impossible de rafraîchir les infos, utilisation des données locales');
//           }
          
//           console.log('✅ Login successful! Role:', formattedUser.role);
//           return { success: true };
          
//         } catch (error: any) {
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
//           } else if (status === 400) {
//             console.log(`❌ ${endpoint}: Requête invalide`);
//             return { 
//               success: false, 
//               message: 'Données de connexion invalides' 
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

//   // Inscription - CORRIGÉ POUR GÉRER LES DONNÉES DE VOTRE FORMULAIRE
//   const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       console.log('📝 Tentative d\'inscription:', userData.username);
//       console.log('📦 Données reçues du formulaire:', userData);
      
//       // Traitement du champ "name" (Nom complet) : le diviser en first_name et last_name
//       const fullName = userData.name || '';
//       let first_name = '';
//       let last_name = '';
      
//       if (fullName) {
//         const nameParts = fullName.trim().split(' ');
//         if (nameParts.length >= 2) {
//           first_name = nameParts[0];
//           last_name = nameParts.slice(1).join(' ');
//         } else {
//           first_name = fullName;
//           last_name = '';
//         }
//       }
      
//       // Préparer les données pour l'API Django
//       const registrationData: any = {
//         username: userData.username,
//         email: userData.email,
//         password: userData.password,
//         password2: userData.password_confirm || userData.password,
//         first_name: first_name,
//         last_name: last_name
//       };
      
//       // Ajouter le rôle et autres champs si présents
//       if (userData.role) {
//         registrationData.role = userData.role;
//       }
      
//       if (userData.departement) {
//         registrationData.departement = userData.departement;
//       }
      
//       if (userData.telephone) {
//         registrationData.telephone = userData.telephone;
//       }
      
//       console.log('📤 Données envoyées à l\'API:', registrationData);
      
//       // Essayer différents endpoints d'inscription
//       const endpoints = [
//         '/api/register/',
//         '/register/',
//         '/api/auth/register/',
//         '/auth/register/',
//         '/api/users/',
//         '/users/'
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai inscription: ${endpoint}`);
          
//           const response = await api.post(endpoint, registrationData);
//           console.log(`✅ Inscription ${endpoint}:`, response.data);
          
//           // Créer un objet utilisateur avec les données du formulaire
//           const tempUser = {
//             id: response.data.id || Date.now(),
//             username: userData.username,
//             email: userData.email,
//             first_name: first_name,
//             last_name: last_name,
//             full_name: fullName,
//             role: userData.role || 'user',
//             departement: userData.departement,
//             telephone: userData.telephone,
//             is_active: true,
//             date_joined: new Date().toISOString()
//           };
          
//           // Sauvegarder l'utilisateur avec son rôle
//           localStorage.setItem('user_data', JSON.stringify(tempUser));
//           setUser(tempUser);
//           console.log('📌 Utilisateur créé avec rôle:', tempUser.role);
          
//           // Si l'inscription retourne un token, stocker et connecter
//           if (response.data.token) {
//             localStorage.setItem('auth_token', response.data.token);
//             setIsAuthenticated(true);
//             return { 
//               success: true, 
//               message: 'Compte créé avec succès! Vous êtes maintenant connecté.' 
//             };
//           }
          
//           // Sinon, essayer de se connecter automatiquement
//           try {
//             const loginResult = await login(userData.username, userData.password);
//             if (loginResult.success) {
//               return { 
//                 success: true, 
//                 message: 'Compte créé avec succès! Connexion automatique établie.' 
//               };
//             }
//           } catch (loginError) {
//             // Continuer sans connexion automatique
//             return { 
//               success: true, 
//               message: 'Compte créé avec succès! Veuillez vous connecter.' 
//             };
//           }
          
//           return { 
//             success: true, 
//             message: response.data.detail || response.data.message || 'Inscription réussie!' 
//           };
          
//         } catch (error: any) {
//           const status = error.response?.status;
          
//           if (status === 404) {
//             console.log(`➡️ ${endpoint} non trouvé, essai suivant...`);
//             continue;
//           } else if (status === 400) {
//             // Erreurs de validation Django
//             const errors = error.response?.data;
//             console.log('❌ Erreurs de validation:', errors);
            
//             let errorMessage = 'Erreur lors de l\'inscription';
            
//             if (typeof errors === 'object') {
//               // Django REST Framework format
//               if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
//                 errorMessage = errors.non_field_errors[0];
//               } else if (errors.email && Array.isArray(errors.email)) {
//                 errorMessage = `Email: ${errors.email[0]}`;
//               } else if (errors.username && Array.isArray(errors.username)) {
//                 errorMessage = `Nom d'utilisateur: ${errors.username[0]}`;
//               } else if (errors.password && Array.isArray(errors.password)) {
//                 errorMessage = `Mot de passe: ${errors.password[0]}`;
//               } else if (errors.role && Array.isArray(errors.role)) {
//                 errorMessage = `Rôle: ${errors.role[0]}`;
//               } else if (errors.detail) {
//                 errorMessage = errors.detail;
//               } else {
//                 // Parcourir toutes les erreurs
//                 for (const [field, messages] of Object.entries(errors)) {
//                   if (Array.isArray(messages) && messages.length > 0) {
//                     errorMessage = `${field}: ${messages[0]}`;
//                     break;
//                   }
//                 }
//               }
//             } else if (typeof errors === 'string') {
//               errorMessage = errors;
//             }
            
//             return { success: false, message: errorMessage };
//           } else if (status === 500) {
//             console.error(`❌ Erreur serveur (500) sur ${endpoint}`);
//             return { 
//               success: false, 
//               message: 'Erreur serveur. Veuillez réessayer plus tard.' 
//             };
//           }
          
//           console.log(`⚠️ ${endpoint}: Erreur ${status || error.message}`);
//         }
//       }
      
//       return { 
//         success: false, 
//         message: 'Impossible de créer un compte. Veuillez contacter l\'administrateur.' 
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












// AuthContext.tsx - VERSION CORRIGÉE POUR RÉCUPÉRER LE RÔLE

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
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
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
  refreshUserInfo: () => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
  password_confirm: string;
  departement?: string;
  telephone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'https://gestion-ressource-informatique.onrender.com';
// const API_BASE_URL = 'http://localhost:8000';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('auth_token');
    const storedUserData = localStorage.getItem('user_data');
    
    if (token && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        
        // Vérifier que le token est encore valide
        try {
          const response = await axios.get(`${API_BASE_URL}/get-user-role/`, {
            headers: {
              'Authorization': `Token ${token}`,
            },
          });
          
          // Mettre à jour avec les données fraîches
          const freshUserData = {
            ...userData,
            ...response.data,
            role: response.data.role || userData.role || 'user' // Priorité au rôle de l'API
          };
          
          localStorage.setItem('user_data', JSON.stringify(freshUserData));
          setUser(freshUserData);
          setIsAuthenticated(true);
          console.log('✅ Session restaurée avec rôle:', freshUserData.role);
          
        } catch (error: any) {
          console.warn('Token invalide ou expiré:', error.message);
          logout();
        }
      } catch (error) {
        console.error('Erreur de parsing des données utilisateur:', error);
        logout();
      }
    }
    setIsLoading(false);
  };

  // Fonction pour rafraîchir les infos utilisateur
  const refreshUserInfo = async (): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/get-user-role/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      
      const currentUserData = localStorage.getItem('user_data');
      if (currentUserData) {
        const userData = JSON.parse(currentUserData);
        const updatedUserData = {
          ...userData,
          ...response.data,
          role: response.data.role || userData.role || 'user' // Priorité au rôle de l'API
        };
        
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
        console.log('✅ User info refreshed with role:', updatedUserData.role);
      }
    } catch (error) {
      console.error('Could not refresh user info:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('🔐 Tentative de connexion avec:', username);
      
      // 1. Se connecter pour obtenir le token
      const loginResponse = await axios.post(`${API_BASE_URL}/login/`, {
        username,
        password,
      });

      console.log('✅ Réponse login:', loginResponse.data);

      if (loginResponse.status !== 200 || !loginResponse.data.token) {
        console.error('Login failed - no token:', loginResponse.data);
        return false;
      }

      const { token, user: userData } = loginResponse.data;
      
      // 2. Récupérer le rôle spécifique de l'utilisateur
      let userRole = 'user';
      
      try {
        const roleResponse = await axios.get(`${API_BASE_URL}/get-user-role/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        
        console.log('✅ Réponse rôle:', roleResponse.data);
        userRole = roleResponse.data.role || userData.role || 'user';
      } catch (roleError) {
        console.warn('⚠️ Impossible de récupérer le rôle spécifique, utilisation du rôle par défaut');
        userRole = userData.role || 'user';
      }
      
      // 3. Créer l'objet utilisateur complet avec le bon rôle
      const completeUserData = {
        ...userData,
        id: userData.id?.toString() || '1',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username,
        role: userRole, // Utiliser le rôle déterminé
        departement: userData.departement || '',
        telephone: userData.telephone || ''
      };
      
      console.log('🎯 Données utilisateur finales:', completeUserData);
      
      // 4. Stocker les données
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(completeUserData));
      
      // 5. Mettre à jour l'état
      setIsAuthenticated(true);
      setUser(completeUserData);
      
      console.log('✅ Login successful! Rôle:', completeUserData.role);
      
      return true;

    } catch (error: any) {
      console.error('❌ Login error:', error);
      if (error.response) {
        console.error('❌ Server response:', error.response.data);
        console.error('❌ Status:', error.response.status);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      console.log('📝 Tentative d\'inscription avec rôle:', userData.role);
      
      // 1. Envoyer les données d'inscription
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // 2. Vérifier la réponse
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Server returned non-JSON response:', textResponse.substring(0, 200));
        return {
          success: false,
          message: 'Erreur serveur: réponse non valide'
        };
      }

      const data = await response.json();

      if (!response.ok) {
        // Gérer les erreurs de validation
        console.error('Registration failed:', data);
        
        let errorMessage = 'Erreur lors de l\'inscription';
        
        if (data.errors) {
          const errorFields = Object.keys(data.errors);
          errorMessage = `Erreur: ${data.errors[errorFields[0]][0]}`;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'object') {
          const firstError = Object.values(data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          }
        }
        
        return {
          success: false,
          message: errorMessage
        };
      }

      // 3. Traitement de la réponse réussie
      const token = data.token;
      
      if (!token) {
        console.error('No token in registration response:', data);
        return {
          success: false,
          message: 'Erreur: token manquant dans la réponse'
        };
      }

      // 4. Créer l'objet utilisateur avec le rôle du formulaire
      const fullName = userData.name || '';
      const nameParts = fullName.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';
      
      const userDataResponse: User = {
        id: data.user?.id?.toString() || Date.now().toString(),
        username: data.user?.username || userData.username,
        email: data.user?.email || userData.email,
        first_name: data.user?.first_name || first_name,
        last_name: data.user?.last_name || last_name,
        full_name: fullName,
        role: userData.role, // Utiliser le rôle du formulaire
        departement: userData.departement || '',
        telephone: userData.telephone || ''
      };
      
      console.log('🎯 Utilisateur créé avec rôle:', userDataResponse.role);
      
      // 5. Stocker les données
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userDataResponse));
      
      // 6. Mettre à jour l'état
      setIsAuthenticated(true);
      setUser(userDataResponse);
      
      console.log('✅ Registration successful! Rôle:', userDataResponse.role);
      
      return {
        success: true,
        message: data.message || 'Compte créé avec succès! Vous êtes maintenant connecté.'
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
    
    console.log('✅ Déconnexion réussie');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout, 
      isLoading,
      refreshUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};