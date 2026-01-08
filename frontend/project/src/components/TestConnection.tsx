// src/components/TestConnection.tsx
import React, { useState, useEffect } from 'react';
import { fournisseursAPI, materielsAPI, dashboardAPI } from '../services/api';

interface TestResult {
  status: string;
  statusCode?: number;
  error?: string;
  data?: any;
}

const TestConnection: React.FC = () => {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = async () => {
    setLoading(true);
    
    const endpoints = [
      { name: 'Fournisseurs', api: () => fournisseursAPI.getAll() },
      { name: 'Matériels', api: () => materielsAPI.getAll() },
      { name: 'Dashboard', api: () => dashboardAPI.getData() },
    ];

    const results: Record<string, TestResult> = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint.name}...`);
        const response = await endpoint.api();
        results[endpoint.name] = {
          status: '✅ Success',
          statusCode: response.status,
          data: response.data
        };
      } catch (error: any) {
        results[endpoint.name] = {
          status: '❌ Error',
          statusCode: error.response?.status,
          error: error.message,
          data: error.response?.data
        };
      }
    }

    setResults(results);
    setLoading(false);
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Test de connexion API</h3>
      <button onClick={testEndpoints} disabled={loading}>
        {loading ? 'Test en cours...' : 'Relancer les tests'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        {Object.entries(results).map(([name, result]) => (
          <div key={name} style={{ 
            padding: '10px', 
            margin: '5px', 
            backgroundColor: result.statusCode === 200 ? '#e8f5e8' : '#ffebee',
            border: '1px solid #ddd'
          }}>
            <strong>{name}:</strong> {result.status} (Code: {result.statusCode})
            {result.error && <div style={{ color: 'red' }}>Erreur: {result.error}</div>}
            {result.data && (
              <div style={{ marginTop: '5px', fontSize: '0.9em' }}>
                Données: {JSON.stringify(result.data).substring(0, 100)}...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestConnection;