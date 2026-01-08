// src/services/auth.ts
import { LoginCredentials, User } from '../types';

export const loginUser = async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
  try {
    const response = await fetch('http://localhost:8000/api-token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Échec de l\'authentification');
    }
  } catch (error) {
    console.error('Erreur de login:', error);
    throw error;
  }
};

// Test avec un utilisateur Django
export const testLogin = async (): Promise<{ token: string; user: User }> => {
  return await loginUser({
    username: 'admin', // Remplacez par un utilisateur existant
    password: 'password' // Remplacez par le mot de passe
  });
};