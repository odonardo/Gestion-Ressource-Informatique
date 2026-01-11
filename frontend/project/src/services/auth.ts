// // src/services/auth.ts
// import { LoginCredentials, User } from '../types';

// export const loginUser = async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
//   try {
//     const response = await fetch('http://localhost:8000/api-token-auth/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       localStorage.setItem('authToken', data.token);
//       return data;
//     } else {
//       const errorData = await response.json();
//       throw new Error(errorData.detail || 'Échec de l\'authentification');
//     }
//   } catch (error) {
//     console.error('Erreur de login:', error);
//     throw error;
//   }
// };

// // Test avec un utilisateur Django
// export const testLogin = async (): Promise<{ token: string; user: User }> => {
//   return await loginUser({
//     username: 'admin', // Remplacez par un utilisateur existant
//     password: 'password' // Remplacez par le mot de passe
//   });
// };




// src/services/auth.ts - VERSION CORRIGÉE POUR PRODUCTION
import { LoginCredentials, User } from '../types';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';

export const loginUser = async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
  try {
    console.log('🔐 Tentative de connexion vers:', `${API_BASE_URL}/api-token-auth/`);
    console.log('📤 Données:', { username: credentials.username });
    
    const response = await fetch(`${API_BASE_URL}/api-token-auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      mode: 'cors',
      credentials: 'include' // Pour les cookies si nécessaire
    });

    console.log('📥 Réponse status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connexion réussie, données:', data);
      
      // Stocker le token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        console.log('🔑 Token stocké');
      }
      
      // Créer un objet utilisateur si non fourni
      const userData: User = data.user || {
        id: 0,
        username: credentials.username,
        first_name: '',
        last_name: '',
        email: '',
        is_active: true,
        date_joined: new Date().toISOString(),
        role: 'user',
        departement: ''
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      return {
        token: data.token,
        user: userData
      };
    } else {
      const errorData = await response.json();
      console.error('❌ Erreur de réponse:', errorData);
      throw new Error(errorData.detail || errorData.non_field_errors?.[0] || 'Échec de l\'authentification');
    }
  } catch (error: any) {
    console.error('❌ Erreur de login:', {
      message: error.message,
      name: error.name,
      type: error.constructor.name
    });
    
    // Messages d'erreur plus spécifiques
    if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez:\n1. Le serveur est démarré\n2. CORS est configuré\n3. L\'URL est correcte');
    }
    
    throw error;
  }
};

// Test avec différents utilisateurs
export const testLogin = async (username: string = 'admin', password: string = 'admin2024'): Promise<{ token: string; user: User }> => {
  console.log('🧪 Test de connexion avec:', username);
  return await loginUser({ username, password });
};

// Fonction pour vérifier si le token est valide
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/token/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ token }),
      mode: 'cors'
    });
    
    return response.ok;
  } catch (error) {
    console.error('❌ Erreur vérification token:', error);
    return false;
  }
};

// Fonction pour obtenir les informations utilisateur
export const getUserInfo = async (token: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Impossible de récupérer les informations utilisateur');
    }
  } catch (error) {
    console.error('❌ Erreur récupération infos utilisateur:', error);
    throw error;
  }
};

// Logout
export const logoutUser = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  console.log('👋 Utilisateur déconnecté');
};