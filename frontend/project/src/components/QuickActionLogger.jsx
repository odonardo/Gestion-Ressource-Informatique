// src/components/QuickActionLogger.jsx
import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const QuickActionLogger = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState('MODIFICATION');
  const [module, setModule] = useState('Matériels');
  const [details, setDetails] = useState('');
  
  const logAction = () => {
    if (!details.trim()) {
      alert('Veuillez saisir des détails');
      return;
    }
    
    if (window.ActionLogger) {
      window.ActionLogger.custom(action, module, details, user?.username);
      alert('✅ Action ajoutée à l\'historique !');
      setDetails('');
      setShowForm(false);
    } else {
      alert('❌ Logger non disponible');
    }
  };
  
  const modules = [
    'Matériels', 'Logiciels', 'Incidents', 'Réparations', 
    'Alertes', 'Fournisseurs', 'Utilisateurs', 'Rapports',
    'Authentification', 'Configuration', 'Système'
  ];
  
  const actions = [
    'CONNEXION', 'DECONNEXION', 'CREATION', 'MODIFICATION',
    'SUPPRESSION', 'LECTURE', 'NAVIGATION', 'GENERATION',
    'IMPORT', 'EXPORT', 'VALIDATION', 'REJECTION'
  ];
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showForm ? (
        <div className="card bg-base-100 shadow-xl w-96">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">📝 Ajouter une action</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="btn btn-ghost btn-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Action</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                >
                  {actions.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Module</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                >
                  {modules.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Détails</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24"
                  placeholder="Description détaillée de l'action..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={logAction}
                  className="btn btn-primary flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </button>
                <button 
                  onClick={() => setShowForm(false)}
                  className="btn btn-ghost"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-circle btn-lg shadow-lg"
          title="Ajouter une action manuelle"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default QuickActionLogger;