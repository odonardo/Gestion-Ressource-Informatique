// src/pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card bg-white/95 backdrop-blur-sm shadow-2xl">
          <div className="card-body text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <Shield className="h-12 w-12 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Accès Non Autorisé
            </h1>
            
            <p className="text-gray-600 mb-2">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            
            <p className="text-gray-500 text-sm mb-6">
              Votre rôle actuel ne vous permet pas d'accéder à cette ressource.
              Contactez votre administrateur si vous pensez que c'est une erreur.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-outline btn-primary w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary w-full"
              >
                Aller au Tableau de Bord
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;