



// AuthContext.tsx - VERSION CORRIGÉE COMPLÈTE

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

// const API_BASE_URL = 'https://gestion-ressources-informatiques.onrender.com';



// BON (après remplacement) :
// const API_BASE_URL = import.meta.env.VITE_API_URL;

// OU si tu veux un fallback :
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';

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
            ...response.data
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
          ...response.data
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
      
      // IMPORTANT: Utilisez /login/ (SANS api/)
      const response = await axios.post(`${API_BASE_URL}/login/`, {
        username,
        password,
      });

      console.log('✅ Réponse du serveur:', response.data);

      if (response.status !== 200 || !response.data.token) {
        console.error('Login failed - no token:', response.data);
        return false;
      }

      const { token, user: userData } = response.data;
      
      // Stocker les données
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Mettre à jour l'état
      setIsAuthenticated(true);
      setUser(userData);
      
      console.log('✅ Login successful! Role:', userData.role);
      console.log('✅ User data:', userData);
      
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
      // ✅ CORRECTION : Utiliser la bonne URL https://gestion-ressources-informatiques.onrender.com/register/
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Vérifier si la réponse est JSON
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
        // Gérer les erreurs de validation Django
        console.error('Registration failed:', data);
        
        let errorMessage = 'Erreur lors de l\'inscription';
        
        if (data.errors) {
          // Si c'est un objet d'erreurs Django
          const errorFields = Object.keys(data.errors);
          errorMessage = `Erreur: ${data.errors[errorFields[0]][0]}`;
        } else if (data.message) {
          // Si c'est un message d'erreur simple
          errorMessage = data.message;
        } else if (typeof data === 'object') {
          // Si c'est un objet avec des erreurs par champ
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

      // ✅ SUCCESS - Traitement de la réponse
      const token = data.token;
      
      if (!token) {
        console.error('No token in registration response:', data);
        return {
          success: false,
          message: 'Erreur: token manquant dans la réponse'
        };
      }

      // Stocker le token
      localStorage.setItem('access_token', token);

      // Utiliser les données utilisateur du backend
      const userDataResponse = {
        id: data.user?.id?.toString() || '1',
        username: data.user?.username || userData.username,
        email: data.user?.email || userData.email,
        name: data.user?.name || userData.name,
        role: data.user?.role || userData.role || 'user'
      };
      
      localStorage.setItem('userData', JSON.stringify(userDataResponse));
      setIsAuthenticated(true);
      setUser(userDataResponse);
      
      console.log('Registration successful with token:', token);
      
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
    // Nettoyer toutes les données
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
    
    console.log('✅ Déconnexion réussie');
    
    // Rediriger vers la page de login
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



