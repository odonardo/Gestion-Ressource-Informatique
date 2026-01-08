// src/components/LoginTest.tsx
import React, { useState } from 'react';
import { testLogin } from '../services/auth';

const LoginTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await testLogin();
      setMessage(`✅ Login réussi! Token: ${result.token.substring(0, 20)}...`);
    } catch (error: any) {
      setMessage(`❌ Erreur: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Test d'authentification</h3>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Connexion...' : 'Tester la connexion'}
      </button>
      {message && (
        <div style={{ 
          marginTop: '10px', 
          color: message.includes('✅') ? 'green' : 'red' 
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default LoginTest;