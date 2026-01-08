


// Dans votre fichier LogicielForm.tsx
import React, { useState, useEffect } from 'react';
import { Logiciel, Fournisseur } from '../types';

// CORRECTION : Ajouter onCalculerExpiration à l'interface
interface LogicielFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  logiciel?: Logiciel;
  fournisseurs: Fournisseur[];
  onCalculerExpiration?: (installationDate: string) => string | null;
}

const LogicielForm: React.FC<LogicielFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  logiciel,
  fournisseurs,
  onCalculerExpiration
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    editeur: '',
    version: '',
    type_logiciel: 'os',
    date_installation: '',
    date_expiration_licence: '',
    fournisseur: ''
  });

  const [autoCalculateExpiration, setAutoCalculateExpiration] = useState(true);

  // Initialiser le formulaire
  useEffect(() => {
    if (logiciel) {
      setFormData({
        nom: logiciel.nom || '',
        editeur: logiciel.editeur || '',
        version: logiciel.version || '',
        type_logiciel: logiciel.type_logiciel || 'os',
        date_installation: logiciel.date_installation || '',
        date_expiration_licence: logiciel.date_expiration_licence || '',
        fournisseur: logiciel.fournisseur?.toString() || ''
      });
      // Si le logiciel a déjà une date d'expiration manuelle, désactiver le calcul auto
      setAutoCalculateExpiration(!logiciel.date_expiration_licence);
    } else {
      setFormData({
        nom: '',
        editeur: '',
        version: '',
        type_logiciel: 'os',
        date_installation: '',
        date_expiration_licence: '',
        fournisseur: ''
      });
      setAutoCalculateExpiration(true);
    }
  }, [logiciel, isOpen]);

  // CORRECTION : Mettre à jour automatiquement la date d'expiration quand la date d'installation change
  useEffect(() => {
    if (autoCalculateExpiration && formData.date_installation && onCalculerExpiration) {
      const nouvelleExpiration = onCalculerExpiration(formData.date_installation);
      if (nouvelleExpiration) {
        setFormData(prev => ({
          ...prev,
          date_expiration_licence: nouvelleExpiration
        }));
      }
    }
  }, [formData.date_installation, autoCalculateExpiration, onCalculerExpiration]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // CORRECTION : Si l'utilisateur modifie manuellement la date d'expiration, désactiver le calcul auto
    if (name === 'date_expiration_licence' && value) {
      setAutoCalculateExpiration(false);
    }
  };

  const handleDateInstallationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      date_installation: value
    }));

    // CORRECTION : Réactiver le calcul auto si la date d'installation change
    if (value && !formData.date_expiration_licence) {
      setAutoCalculateExpiration(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Préparer les données pour la soumission
    const submissionData = {
      ...formData,
      fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
    };

    onSubmit(submissionData);
  };

  const toggleAutoCalculate = () => {
    const newAutoCalculate = !autoCalculateExpiration;
    setAutoCalculateExpiration(newAutoCalculate);
    
    // Si on réactive le calcul auto et qu'on a une date d'installation, recalculer
    if (newAutoCalculate && formData.date_installation && onCalculerExpiration) {
      const nouvelleExpiration = onCalculerExpiration(formData.date_installation);
      if (nouvelleExpiration) {
        setFormData(prev => ({
          ...prev,
          date_expiration_licence: nouvelleExpiration
        }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-4">
          {logiciel ? 'Modifier le logiciel' : 'Nouveau logiciel'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Champ Nom */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom du logiciel</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            {/* Champ Éditeur */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Éditeur</span>
              </label>
              <input
                type="text"
                name="editeur"
                value={formData.editeur}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            {/* Champ Version */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Version</span>
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            {/* Champ Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                name="type_logiciel"
                value={formData.type_logiciel}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="os">Système d'exploitation</option>
                <option value="bureautique">Bureautique</option>
                <option value="metier">Métier</option>
                <option value="securite">Sécurité</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* CORRECTION : Champ Date d'installation avec gestion séparée */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date entrée inventaire</span>
              </label>
              <input
                type="date"
                name="date_installation"
                value={formData.date_installation}
                onChange={handleDateInstallationChange}
                className="input input-bordered"
              />
            </div>

            {/* CORRECTION : Champ Date d'expiration avec toggle de calcul auto */}
            <div className="form-control">
              <label className="label">
                <div className="flex items-center gap-2">
                  <span className="label-text">Date d'expiration</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={autoCalculateExpiration}
                      onChange={toggleAutoCalculate}
                      className="checkbox checkbox-xs"
                    />
                    <span className="text-xs opacity-70">Calcul auto (+1 an)</span>
                  </div>
                </div>
              </label>
              <input
                type="date"
                name="date_expiration_licence"
                value={formData.date_expiration_licence}
                onChange={handleChange}
                className="input input-bordered"
                disabled={autoCalculateExpiration}
                title={autoCalculateExpiration ? "Date calculée automatiquement" : "Date manuelle"}
              />
              {autoCalculateExpiration && formData.date_installation && (
                <div className="text-xs text-info mt-1">
                  ⓘ Calculée automatiquement à partir de la date d'installation
                </div>
              )}
            </div>

            {/* Champ Fournisseur */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Fournisseur</span>
              </label>
              <select
                name="fournisseur"
                value={formData.fournisseur}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="">Sélectionner un fournisseur</option>
                {fournisseurs.map(fournisseur => (
                  <option key={fournisseur.id} value={fournisseur.id}>
                    {fournisseur.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {logiciel ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogicielForm;