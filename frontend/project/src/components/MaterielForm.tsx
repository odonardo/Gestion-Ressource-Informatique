

// import React, { useState, useEffect } from 'react';
// import { Materiel, Fournisseur } from '../types';
// import { X } from 'lucide-react';

// interface MaterielFormProps {
//   isOpen: boolean;
//   materiel?: Materiel;
//   fournisseurs?: Fournisseur[]; // Rendre optionnel
//   onSubmit: (materiel: Omit<Materiel, 'id'>) => void;
//   onClose: () => void;
// }

// export default function MaterielForm({ isOpen, materiel, fournisseurs = [], onSubmit, onClose }: MaterielFormProps) {
//   const [formData, setFormData] = useState({
//     nom: '',
//     reference: '',
//     date_achat: '',
//     etat: 'fonctionnel' as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete',
//     service_attribue: '',
//     utilisateur_attribue: '',
//     fournisseur: '' // Gardé en string pour le select HTML
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (materiel) {
//       setFormData({
//         nom: materiel.nom || '',
//         reference: materiel.reference || '',
//         date_achat: materiel.date_achat || '',
//         etat: materiel.etat || 'fonctionnel',
//         service_attribue: materiel.service_attribue || '',
//         utilisateur_attribue: materiel.utilisateur_attribue || '',
//         fournisseur: materiel.fournisseur ? materiel.fournisseur.toString() : ''
//       });
//     } else {
//       setFormData({
//         nom: '',
//         reference: '',
//         date_achat: '',
//         etat: 'fonctionnel',
//         service_attribue: '',
//         utilisateur_attribue: '',
//         fournisseur: ''
//       });
//     }
//     setErrors({});
//   }, [materiel, isOpen]);

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.nom.trim()) {
//       newErrors.nom = 'Le nom est requis';
//     }
//     if (!formData.reference.trim()) {
//       newErrors.reference = 'La référence est requise';
//     }
//     if (!formData.date_achat) {
//       newErrors.date_achat = 'La date d\'achat est requise';
//     }
//     if (!formData.service_attribue) {
//       newErrors.service_attribue = 'Le service est requis';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       // Préparer les données pour l'API - CORRECTION ICI
//       const submitData: Omit<Materiel, 'id'> = {
//         nom: formData.nom,
//         reference: formData.reference,
//         date_achat: formData.date_achat,
//         etat: formData.etat,
//         service_attribue: formData.service_attribue,
//         utilisateur_attribue: formData.utilisateur_attribue,
//         fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
//       };
      
//       onSubmit(submitData);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'etat') {
//       setFormData(prev => ({ 
//         ...prev, 
//         [name]: value as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete'
//       }));
//     } else {
//       setFormData(prev => ({ 
//         ...prev, 
//         [name]: value 
//       }));
//     }
    
//     if (errors[name]) {
//       setErrors(prev => ({ 
//         ...prev, 
//         [name]: '' 
//       }));
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       nom: '',
//       reference: '',
//       date_achat: '',
//       etat: 'fonctionnel',
//       service_attribue: '',
//       utilisateur_attribue: '',
//       fournisseur: ''
//     });
//     setErrors({});
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center p-6 border-b border-base-300">
//           <h2 className="text-xl font-bold text-base-content">
//             {materiel ? 'Modifier le matériel' : 'Ajouter un matériel'}
//           </h2>
//           <button
//             onClick={handleClose}
//             className="btn btn-ghost btn-sm btn-circle"
//             type="button"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Nom du matériel *</span>
//             </label>
//             <input
//               type="text"
//               name="nom"
//               value={formData.nom}
//               onChange={handleChange}
//               className={`input input-bordered w-full ${errors.nom ? 'input-error' : ''}`}
//               placeholder="Ex: Ordinateur portable Dell"
//             />
//             {errors.nom && <span className="text-error text-sm mt-1">{errors.nom}</span>}
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Référence/Numéro de série *</span>
//             </label>
//             <input
//               type="text"
//               name="reference"
//               value={formData.reference}
//               onChange={handleChange}
//               className={`input input-bordered w-full ${errors.reference ? 'input-error' : ''}`}
//               placeholder="Ex: DELL-LAT-001"
//             />
//             {errors.reference && <span className="text-error text-sm mt-1">{errors.reference}</span>}
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Date d'achat *</span>
//             </label>
//             <input
//               type="date"
//               name="date_achat"
//               value={formData.date_achat}
//               onChange={handleChange}
//               className={`input input-bordered w-full ${errors.date_achat ? 'input-error' : ''}`}
//             />
//             {errors.date_achat && <span className="text-error text-sm mt-1">{errors.date_achat}</span>}
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">État</span>
//             </label>
//             <select
//               name="etat"
//               value={formData.etat}
//               onChange={handleChange}
//               className="select select-bordered w-full"
//             >
//               <option value="fonctionnel">Fonctionnel</option>
//               <option value="en_panne">En panne</option>
//               <option value="repare">Réparé</option>
//               <option value="obsolete">Obsolète</option>
//             </select>
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Service attribué *</span>
//             </label>
//             <select
//               name="service_attribue"
//               value={formData.service_attribue}
//               onChange={handleChange}
//               className={`select select-bordered w-full ${errors.service_attribue ? 'select-error' : ''}`}
//             >
//               <option value="">Sélectionner un service</option>
//               <option value="Direction">Direction</option>
//               <option value="Comptabilité">Comptabilité</option>
//               <option value="Ressources Humaines">Ressources Humaines</option>
//               <option value="Informatique">Informatique</option>
//               <option value="Secrétariat">Secrétariat</option>
//               <option value="Archives">Archives</option>
//             </select>
//             {errors.service_attribue && <span className="text-error text-sm mt-1">{errors.service_attribue}</span>}
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Utilisateur attribué</span>
//             </label>
//             <input
//               type="text"
//               name="utilisateur_attribue"
//               value={formData.utilisateur_attribue}
//               onChange={handleChange}
//               className="input input-bordered w-full"
//               placeholder="Ex: Jean Dupont"
//             />
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Fournisseur</span>
//             </label>
//             <select
//               name="fournisseur"
//               value={formData.fournisseur}
//               onChange={handleChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Sélectionner un fournisseur</option>
//               {/* CORRECTION ICI : Utiliser fournisseurs qui a une valeur par défaut de [] */}
//               {fournisseurs.map((fournisseur) => (
//                 <option key={fournisseur.id} value={fournisseur.id}>
//                   {fournisseur.nom}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex gap-3 pt-4 border-t border-base-300">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="btn btn-ghost flex-1"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary flex-1"
//             >
//               {materiel ? 'Modifier' : 'Ajouter'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }















// import React, { useState, useEffect } from 'react';
// import { Materiel, Fournisseur } from '../types';
// import { X } from 'lucide-react';

// interface MaterielFormProps {
//   isOpen: boolean;
//   materiel?: Materiel;
//   fournisseurs?: Fournisseur[];
//   onSubmit: (materiel: Omit<Materiel, 'id'>) => void;
//   onClose: () => void;
// }

// export default function MaterielForm({ isOpen, materiel, fournisseurs = [], onSubmit, onClose }: MaterielFormProps) {
//   const [formData, setFormData] = useState({
//     nom: '',
//     reference: '',
//     date_achat: '',
//     etat: 'fonctionnel' as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete',
//     service_attribue: '',
//     utilisateur_attribue: '',
//     fournisseur: ''
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (materiel) {
//       setFormData({
//         nom: materiel.nom || '',
//         reference: materiel.reference || '',
//         date_achat: materiel.date_achat || '',
//         etat: materiel.etat || 'fonctionnel',
//         service_attribue: materiel.service_attribue || '',
//         utilisateur_attribue: materiel.utilisateur_attribue || '',
//         fournisseur: materiel.fournisseur ? materiel.fournisseur.toString() : ''
//       });
//     } else {
//       setFormData({
//         nom: '',
//         reference: '',
//         date_achat: '',
//         etat: 'fonctionnel',
//         service_attribue: '',
//         utilisateur_attribue: '',
//         fournisseur: ''
//       });
//     }
//     setErrors({});
//   }, [materiel, isOpen]);

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.nom.trim()) {
//       newErrors.nom = 'Le nom est requis';
//     }
//     if (!formData.reference.trim()) {
//       newErrors.reference = 'La référence est requise';
//     }
//     if (!formData.date_achat) {
//       newErrors.date_achat = 'La date d\'achat est requise';
//     }
//     if (!formData.service_attribue) {
//       newErrors.service_attribue = 'Le service est requis';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       const submitData: Omit<Materiel, 'id'> = {
//         nom: formData.nom,
//         reference: formData.reference,
//         date_achat: formData.date_achat,
//         etat: formData.etat,
//         service_attribue: formData.service_attribue,
//         utilisateur_attribue: formData.utilisateur_attribue,
//         fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
//       };
      
//       onSubmit(submitData);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'etat') {
//       setFormData(prev => ({ 
//         ...prev, 
//         [name]: value as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete'
//       }));
//     } else {
//       setFormData(prev => ({ 
//         ...prev, 
//         [name]: value 
//       }));
//     }
    
//     if (errors[name]) {
//       setErrors(prev => ({ 
//         ...prev, 
//         [name]: '' 
//       }));
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       nom: '',
//       reference: '',
//       date_achat: '',
//       etat: 'fonctionnel',
//       service_attribue: '',
//       utilisateur_attribue: '',
//       fournisseur: ''
//     });
//     setErrors({});
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center p-6 border-b border-base-300">
//           <h2 className="text-xl font-bold text-base-content">
//             {materiel ? 'Modifier le matériel' : 'Ajouter un matériel'}
//           </h2>
//           <button
//             onClick={handleClose}
//             className="btn btn-ghost btn-sm btn-circle"
//             type="button"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Nom du matériel *</span>
//             </label>
//             <input
//               type="text"
//               name="nom"
//               value={formData.nom}
//               onChange={handleChange}
//               className={`input input-bordered w-full ${errors.nom ? 'input-error' : ''}`}
//               placeholder="Ex: Ordinateur portable Dell"
//             />
//             {errors.nom && <span className="text-error text-sm mt-1">{errors.nom}</span>}
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Référence/Numéro de série *</span>
//             </label>
//             <input
//               type="text"
//               name="reference"
//               value={formData.reference}
//               onChange={handleChange}
//               className={`input input-bordered w-full ${errors.reference ? 'input-error' : ''}`}
//               placeholder="Ex: DELL-LAT-001"
//             />
//             {errors.reference && <span className="text-error text-sm mt-1">{errors.reference}</span>}
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Date d'achat *</span>
//             </label>
//             <input
//               type="date"
//               name="date_achat"
//               value={formData.date_achat}
//               onChange={handleChange}
//               className={`input input-bordered w-full ${errors.date_achat ? 'input-error' : ''}`}
//             />
//             {errors.date_achat && <span className="text-error text-sm mt-1">{errors.date_achat}</span>}
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">État</span>
//             </label>
//             <select
//               name="etat"
//               value={formData.etat}
//               onChange={handleChange}
//               className="select select-bordered w-full"
//             >
//               <option value="fonctionnel">Fonctionnel</option>
//               <option value="en_panne">En panne</option>
//               <option value="repare">Réparé</option>
//               <option value="obsolete">Obsolète</option>
//             </select>
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Service attribué *</span>
//             </label>
//             <select
//               name="service_attribue"
//               value={formData.service_attribue}
//               onChange={handleChange}
//               className={`select select-bordered w-full ${errors.service_attribue ? 'select-error' : ''}`}
//             >
//               <option value="">Sélectionner un service</option>
//               <option value="Direction">Direction</option>
//               <option value="Comptabilité">Comptabilité</option>
//               <option value="Ressources Humaines">Ressources Humaines</option>
//               <option value="Informatique">Informatique</option>
//               <option value="Secrétariat">Secrétariat</option>
//               <option value="Archives">Archives</option>
//             </select>
//             {errors.service_attribue && <span className="text-error text-sm mt-1">{errors.service_attribue}</span>}
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Utilisateur attribué</span>
//             </label>
//             <input
//               type="text"
//               name="utilisateur_attribue"
//               value={formData.utilisateur_attribue}
//               onChange={handleChange}
//               className="input input-bordered w-full"
//               placeholder="Ex: Jean Dupont"
//             />
//           </div>

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Fournisseur</span>
//             </label>
//             <select
//               name="fournisseur"
//               value={formData.fournisseur}
//               onChange={handleChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Sélectionner un fournisseur</option>
//               {fournisseurs.map((fournisseur) => (
//                 <option key={fournisseur.id} value={fournisseur.id}>
//                   {fournisseur.nom}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex gap-3 pt-4 border-t border-base-300">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="btn btn-ghost flex-1"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary flex-1"
//             >
//               {materiel ? 'Modifier' : 'Ajouter'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { X, Package, Cpu, User, Calendar, Building } from 'lucide-react';
import { Materiel, Fournisseur } from '../types';

interface MaterielFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (materielData: Omit<Materiel, 'id'>) => void;
  materiel?: Materiel;
  fournisseurs?: Fournisseur[];
}

// Définir le type pour le formulaire - doit correspondre au modèle Materiel
interface MaterielFormData {
  nom: string;
  reference: string;
  date_achat: string;
  etat: 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete';
  service_attribue: string;
  utilisateur_attribue: string;
  fournisseur: string; // Gardé en string pour le select
}

const MaterielForm: React.FC<MaterielFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  materiel,
  fournisseurs = []
}) => {
  const [formData, setFormData] = useState<MaterielFormData>({
    nom: '',
    reference: '',
    date_achat: '',
    etat: 'fonctionnel',
    service_attribue: '',
    utilisateur_attribue: '',
    fournisseur: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (materiel) {
      setFormData({
        nom: materiel.nom || '',
        reference: materiel.reference || '',
        date_achat: materiel.date_achat ? 
          new Date(materiel.date_achat).toISOString().split('T')[0] : 
          '',
        etat: materiel.etat || 'fonctionnel',
        service_attribue: materiel.service_attribue || '',
        utilisateur_attribue: materiel.utilisateur_attribue || '',
        fournisseur: materiel.fournisseur ? materiel.fournisseur.toString() : ''
      });
    } else {
      setFormData({
        nom: '',
        reference: '',
        date_achat: '',
        etat: 'fonctionnel',
        service_attribue: '',
        utilisateur_attribue: '',
        fournisseur: ''
      });
    }
    setErrors({});
  }, [materiel, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.reference.trim()) {
      newErrors.reference = 'La référence est requise';
    }
    if (!formData.date_achat) {
      newErrors.date_achat = 'La date d\'achat est requise';
    }
    if (!formData.service_attribue) {
      newErrors.service_attribue = 'Le service est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'etat') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete'
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
    
    // Effacer l'erreur du champ quand l'utilisateur modifie
    if (errors[name]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: '' 
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Préparer les données pour l'API
    const submitData: Omit<Materiel, 'id'> = {
      nom: formData.nom.trim(),
      reference: formData.reference.trim(),
      date_achat: formData.date_achat,
      etat: formData.etat,
      service_attribue: formData.service_attribue,
      utilisateur_attribue: formData.utilisateur_attribue.trim(),
      fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
    };

    console.log('📤 Données soumises:', submitData);
    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      nom: '',
      reference: '',
      date_achat: '',
      etat: 'fonctionnel',
      service_attribue: '',
      utilisateur_attribue: '',
      fournisseur: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <h2 className="text-xl font-bold text-base-content">
            {materiel ? 'Modifier le matériel' : 'Nouveau matériel'}
          </h2>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom du matériel */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom du matériel *</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${errors.nom ? 'input-error' : ''}`}
                  placeholder="Ex: Ordinateur portable Dell"
                />
              </div>
              {errors.nom && <span className="text-error text-sm mt-1">{errors.nom}</span>}
            </div>

            {/* Référence */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Référence/Numéro de série *</span>
              </label>
              <div className="relative">
                <Cpu className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${errors.reference ? 'input-error' : ''}`}
                  placeholder="Ex: DELL-LAT-001"
                />
              </div>
              {errors.reference && <span className="text-error text-sm mt-1">{errors.reference}</span>}
            </div>

            {/* Date d'achat */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date d'achat *</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="date"
                  name="date_achat"
                  value={formData.date_achat}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${errors.date_achat ? 'input-error' : ''}`}
                />
              </div>
              {errors.date_achat && <span className="text-error text-sm mt-1">{errors.date_achat}</span>}
            </div>

            {/* État */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">État</span>
              </label>
              <select
                name="etat"
                value={formData.etat}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="fonctionnel">Fonctionnel</option>
                <option value="en_panne">En panne</option>
                <option value="repare">Réparé</option>
                <option value="obsolete">Obsolète</option>
              </select>
            </div>

            {/* Service attribué */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Service attribué *</span>
              </label>
              <select
                name="service_attribue"
                value={formData.service_attribue}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.service_attribue ? 'select-error' : ''}`}
              >
                <option value="">Sélectionner un service</option>
                <option value="Direction">Direction</option>
                <option value="Comptabilité">Comptabilité</option>
                <option value="Ressources Humaines">Ressources Humaines</option>
                <option value="Informatique">Informatique</option>
                <option value="Secrétariat">Secrétariat</option>
                <option value="Archives">Archives</option>
              </select>
              {errors.service_attribue && <span className="text-error text-sm mt-1">{errors.service_attribue}</span>}
            </div>

            {/* Utilisateur attribué */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Utilisateur attribué</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  name="utilisateur_attribue"
                  value={formData.utilisateur_attribue}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
            </div>

            {/* Fournisseur */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Fournisseur</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <select
                  name="fournisseur"
                  value={formData.fournisseur}
                  onChange={handleChange}
                  className="select select-bordered w-full pl-10"
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.map((fournisseur) => (
                    <option key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              {materiel ? 'Modifier' : 'Ajouter'} le matériel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterielForm;