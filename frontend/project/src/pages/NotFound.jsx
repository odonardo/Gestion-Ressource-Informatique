// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 p-4 rounded-full">
              <AlertTriangle className="h-16 w-16 text-yellow-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page non trouvée
          </h2>
          
          <p className="text-gray-600 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
            Vérifiez l'URL ou revenez à la page d'accueil.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary w-full"
            >
              <Home className="h-5 w-5 mr-2" />
              Retour au tableau de bord
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline w-full"
            >
              <Search className="h-5 w-5 mr-2" />
              Page précédente
            </button>
            
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur système.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;