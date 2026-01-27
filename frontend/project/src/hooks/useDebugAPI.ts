// hooks/useDebugAPI.ts
import { useState, useCallback } from 'react';

export const useDebugAPI = () => {
  const [debugData, setDebugData] = useState<any>(null);
  
  const debugRequest = useCallback(async (url: string, method: string, data: any, config?: any) => {
    console.group('🔍 DEBUG API REQUEST');
    console.log('URL:', url);
    console.log('Method:', method);
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Config:', config);
    
    // Vérifier spécifiquement technicien_responsable
    if (data.technicien_responsable === undefined || data.technicien_responsable === null) {
      console.error('❌ CRITIQUE: technicien_responsable est undefined/null!');
      console.error('Valeur actuelle:', data.technicien_responsable);
      console.error('Type:', typeof data.technicien_responsable);
    }
    
    console.groupEnd();
    
    setDebugData({
      url,
      method,
      data,
      timestamp: new Date().toISOString()
    });
    
    return data;
  }, []);
  
  return {
    debugRequest,
    debugData
  };
};

// Utiliser dans Reparations.tsx
import { useDebugAPI } from '../hooks/useDebugAPI';

const Reparations: React.FC = () => {
  const { debugRequest } = useDebugAPI();
  
  // Dans handleSubmit, avant l'appel API
  const validatedData = await debugRequest(
    '/reparations/',
    editingReparation ? 'PUT' : 'POST',
    formattedData,
    config
  );
  
  // Continuer avec validatedData...
};