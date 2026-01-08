import React, { useState, useEffect } from 'react';
import { X, Building, Phone, Mail, MapPin, User } from 'lucide-react';
import { Fournisseur } from '../types';

interface FournisseurFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fournisseurData: Omit<Fournisseur, 'id'>) => void;
  fournisseur?: Fournisseur;
}

// Définir le type pour le formulaire - doit correspondre au modèle Fournisseur
interface FournisseurFormData {
  nom: string;
  type_fournisseur: 'materiel' | 'logiciel' | 'mixte';
  contact_email: string;
  telephone: string;
  adresse: string;
}

const FournisseurForm: React.FC<FournisseurFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fournisseur
}) => {
  const [formData, setFormData] = useState<FournisseurFormData>({
    nom: '',
    type_fournisseur: 'materiel',
    contact_email: '',
    telephone: '',
    adresse: ''
  });

  useEffect(() => {
    if (fournisseur) {
      setFormData({
        nom: fournisseur.nom || '',
        type_fournisseur: fournisseur.type_fournisseur || 'materiel',
        contact_email: fournisseur.contact_email || '',
        telephone: fournisseur.telephone || '',
        adresse: fournisseur.adresse || ''
      });
    } else {
      setFormData({
        nom: '',
        type_fournisseur: 'materiel',
        contact_email: '',
        telephone: '',
        adresse: ''
      });
    }
  }, [fournisseur, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <h2 className="text-xl font-bold text-base-content">
            {fournisseur ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom du fournisseur *</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Type fournisseur</span>
              </label>
              <select
                name="type_fournisseur"
                value={formData.type_fournisseur}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                <option value="materiel">Matériel</option>
                <option value="logiciel">Logiciel</option>
                <option value="mixte">Mixte</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Téléphone *</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10"
                  required
                />
              </div>
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Adresse</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Adresse complète..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {fournisseur ? 'Modifier' : 'Créer'} le fournisseur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FournisseurForm;