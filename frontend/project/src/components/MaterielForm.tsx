

// // // // import React, { useState, useEffect } from 'react';
// // // // import { Materiel, Fournisseur } from '../types';
// // // // import { X } from 'lucide-react';

// // // // interface MaterielFormProps {
// // // //   isOpen: boolean;
// // // //   materiel?: Materiel;
// // // //   fournisseurs?: Fournisseur[]; // Rendre optionnel
// // // //   onSubmit: (materiel: Omit<Materiel, 'id'>) => void;
// // // //   onClose: () => void;
// // // // }

// // // // export default function MaterielForm({ isOpen, materiel, fournisseurs = [], onSubmit, onClose }: MaterielFormProps) {
// // // //   const [formData, setFormData] = useState({
// // // //     nom: '',
// // // //     reference: '',
// // // //     date_achat: '',
// // // //     etat: 'fonctionnel' as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete',
// // // //     service_attribue: '',
// // // //     utilisateur_attribue: '',
// // // //     fournisseur: '' // Gardé en string pour le select HTML
// // // //   });

// // // //   const [errors, setErrors] = useState<Record<string, string>>({});

// // // //   useEffect(() => {
// // // //     if (materiel) {
// // // //       setFormData({
// // // //         nom: materiel.nom || '',
// // // //         reference: materiel.reference || '',
// // // //         date_achat: materiel.date_achat || '',
// // // //         etat: materiel.etat || 'fonctionnel',
// // // //         service_attribue: materiel.service_attribue || '',
// // // //         utilisateur_attribue: materiel.utilisateur_attribue || '',
// // // //         fournisseur: materiel.fournisseur ? materiel.fournisseur.toString() : ''
// // // //       });
// // // //     } else {
// // // //       setFormData({
// // // //         nom: '',
// // // //         reference: '',
// // // //         date_achat: '',
// // // //         etat: 'fonctionnel',
// // // //         service_attribue: '',
// // // //         utilisateur_attribue: '',
// // // //         fournisseur: ''
// // // //       });
// // // //     }
// // // //     setErrors({});
// // // //   }, [materiel, isOpen]);

// // // //   const validateForm = (): boolean => {
// // // //     const newErrors: Record<string, string> = {};

// // // //     if (!formData.nom.trim()) {
// // // //       newErrors.nom = 'Le nom est requis';
// // // //     }
// // // //     if (!formData.reference.trim()) {
// // // //       newErrors.reference = 'La référence est requise';
// // // //     }
// // // //     if (!formData.date_achat) {
// // // //       newErrors.date_achat = 'La date d\'achat est requise';
// // // //     }
// // // //     if (!formData.service_attribue) {
// // // //       newErrors.service_attribue = 'Le service est requis';
// // // //     }

// // // //     setErrors(newErrors);
// // // //     return Object.keys(newErrors).length === 0;
// // // //   };

// // // //   const handleSubmit = (e: React.FormEvent) => {
// // // //     e.preventDefault();
    
// // // //     if (validateForm()) {
// // // //       // Préparer les données pour l'API - CORRECTION ICI
// // // //       const submitData: Omit<Materiel, 'id'> = {
// // // //         nom: formData.nom,
// // // //         reference: formData.reference,
// // // //         date_achat: formData.date_achat,
// // // //         etat: formData.etat,
// // // //         service_attribue: formData.service_attribue,
// // // //         utilisateur_attribue: formData.utilisateur_attribue,
// // // //         fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
// // // //       };
      
// // // //       onSubmit(submitData);
// // // //     }
// // // //   };

// // // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
// // // //     const { name, value } = e.target;
    
// // // //     if (name === 'etat') {
// // // //       setFormData(prev => ({ 
// // // //         ...prev, 
// // // //         [name]: value as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete'
// // // //       }));
// // // //     } else {
// // // //       setFormData(prev => ({ 
// // // //         ...prev, 
// // // //         [name]: value 
// // // //       }));
// // // //     }
    
// // // //     if (errors[name]) {
// // // //       setErrors(prev => ({ 
// // // //         ...prev, 
// // // //         [name]: '' 
// // // //       }));
// // // //     }
// // // //   };

// // // //   const handleClose = () => {
// // // //     setFormData({
// // // //       nom: '',
// // // //       reference: '',
// // // //       date_achat: '',
// // // //       etat: 'fonctionnel',
// // // //       service_attribue: '',
// // // //       utilisateur_attribue: '',
// // // //       fournisseur: ''
// // // //     });
// // // //     setErrors({});
// // // //     onClose();
// // // //   };

// // // //   if (!isOpen) return null;

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //       <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
// // // //         <div className="flex justify-between items-center p-6 border-b border-base-300">
// // // //           <h2 className="text-xl font-bold text-base-content">
// // // //             {materiel ? 'Modifier le matériel' : 'Ajouter un matériel'}
// // // //           </h2>
// // // //           <button
// // // //             onClick={handleClose}
// // // //             className="btn btn-ghost btn-sm btn-circle"
// // // //             type="button"
// // // //           >
// // // //             <X className="w-5 h-5" />
// // // //           </button>
// // // //         </div>

// // // //         <form onSubmit={handleSubmit} className="p-6 space-y-4">
// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Nom du matériel *</span>
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               name="nom"
// // // //               value={formData.nom}
// // // //               onChange={handleChange}
// // // //               className={`input input-bordered w-full ${errors.nom ? 'input-error' : ''}`}
// // // //               placeholder="Ex: Ordinateur portable Dell"
// // // //             />
// // // //             {errors.nom && <span className="text-error text-sm mt-1">{errors.nom}</span>}
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Référence/Numéro de série *</span>
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               name="reference"
// // // //               value={formData.reference}
// // // //               onChange={handleChange}
// // // //               className={`input input-bordered w-full ${errors.reference ? 'input-error' : ''}`}
// // // //               placeholder="Ex: DELL-LAT-001"
// // // //             />
// // // //             {errors.reference && <span className="text-error text-sm mt-1">{errors.reference}</span>}
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Date d'achat *</span>
// // // //             </label>
// // // //             <input
// // // //               type="date"
// // // //               name="date_achat"
// // // //               value={formData.date_achat}
// // // //               onChange={handleChange}
// // // //               className={`input input-bordered w-full ${errors.date_achat ? 'input-error' : ''}`}
// // // //             />
// // // //             {errors.date_achat && <span className="text-error text-sm mt-1">{errors.date_achat}</span>}
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">État</span>
// // // //             </label>
// // // //             <select
// // // //               name="etat"
// // // //               value={formData.etat}
// // // //               onChange={handleChange}
// // // //               className="select select-bordered w-full"
// // // //             >
// // // //               <option value="fonctionnel">Fonctionnel</option>
// // // //               <option value="en_panne">En panne</option>
// // // //               <option value="repare">Réparé</option>
// // // //               <option value="obsolete">Obsolète</option>
// // // //             </select>
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Service attribué *</span>
// // // //             </label>
// // // //             <select
// // // //               name="service_attribue"
// // // //               value={formData.service_attribue}
// // // //               onChange={handleChange}
// // // //               className={`select select-bordered w-full ${errors.service_attribue ? 'select-error' : ''}`}
// // // //             >
// // // //               <option value="">Sélectionner un service</option>
// // // //               <option value="Direction">Direction</option>
// // // //               <option value="Comptabilité">Comptabilité</option>
// // // //               <option value="Ressources Humaines">Ressources Humaines</option>
// // // //               <option value="Informatique">Informatique</option>
// // // //               <option value="Secrétariat">Secrétariat</option>
// // // //               <option value="Archives">Archives</option>
// // // //             </select>
// // // //             {errors.service_attribue && <span className="text-error text-sm mt-1">{errors.service_attribue}</span>}
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Utilisateur attribué</span>
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               name="utilisateur_attribue"
// // // //               value={formData.utilisateur_attribue}
// // // //               onChange={handleChange}
// // // //               className="input input-bordered w-full"
// // // //               placeholder="Ex: Jean Dupont"
// // // //             />
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Fournisseur</span>
// // // //             </label>
// // // //             <select
// // // //               name="fournisseur"
// // // //               value={formData.fournisseur}
// // // //               onChange={handleChange}
// // // //               className="select select-bordered w-full"
// // // //             >
// // // //               <option value="">Sélectionner un fournisseur</option>
// // // //               {/* CORRECTION ICI : Utiliser fournisseurs qui a une valeur par défaut de [] */}
// // // //               {fournisseurs.map((fournisseur) => (
// // // //                 <option key={fournisseur.id} value={fournisseur.id}>
// // // //                   {fournisseur.nom}
// // // //                 </option>
// // // //               ))}
// // // //             </select>
// // // //           </div>

// // // //           <div className="flex gap-3 pt-4 border-t border-base-300">
// // // //             <button
// // // //               type="button"
// // // //               onClick={handleClose}
// // // //               className="btn btn-ghost flex-1"
// // // //             >
// // // //               Annuler
// // // //             </button>
// // // //             <button
// // // //               type="submit"
// // // //               className="btn btn-primary flex-1"
// // // //             >
// // // //               {materiel ? 'Modifier' : 'Ajouter'}
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }















// // // // import React, { useState, useEffect } from 'react';
// // // // import { Materiel, Fournisseur } from '../types';
// // // // import { X } from 'lucide-react';

// // // // interface MaterielFormProps {
// // // //   isOpen: boolean;
// // // //   materiel?: Materiel;
// // // //   fournisseurs?: Fournisseur[];
// // // //   onSubmit: (materiel: Omit<Materiel, 'id'>) => void;
// // // //   onClose: () => void;
// // // // }

// // // // export default function MaterielForm({ isOpen, materiel, fournisseurs = [], onSubmit, onClose }: MaterielFormProps) {
// // // //   const [formData, setFormData] = useState({
// // // //     nom: '',
// // // //     reference: '',
// // // //     date_achat: '',
// // // //     etat: 'fonctionnel' as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete',
// // // //     service_attribue: '',
// // // //     utilisateur_attribue: '',
// // // //     fournisseur: ''
// // // //   });

// // // //   const [errors, setErrors] = useState<Record<string, string>>({});

// // // //   useEffect(() => {
// // // //     if (materiel) {
// // // //       setFormData({
// // // //         nom: materiel.nom || '',
// // // //         reference: materiel.reference || '',
// // // //         date_achat: materiel.date_achat || '',
// // // //         etat: materiel.etat || 'fonctionnel',
// // // //         service_attribue: materiel.service_attribue || '',
// // // //         utilisateur_attribue: materiel.utilisateur_attribue || '',
// // // //         fournisseur: materiel.fournisseur ? materiel.fournisseur.toString() : ''
// // // //       });
// // // //     } else {
// // // //       setFormData({
// // // //         nom: '',
// // // //         reference: '',
// // // //         date_achat: '',
// // // //         etat: 'fonctionnel',
// // // //         service_attribue: '',
// // // //         utilisateur_attribue: '',
// // // //         fournisseur: ''
// // // //       });
// // // //     }
// // // //     setErrors({});
// // // //   }, [materiel, isOpen]);

// // // //   const validateForm = (): boolean => {
// // // //     const newErrors: Record<string, string> = {};

// // // //     if (!formData.nom.trim()) {
// // // //       newErrors.nom = 'Le nom est requis';
// // // //     }
// // // //     if (!formData.reference.trim()) {
// // // //       newErrors.reference = 'La référence est requise';
// // // //     }
// // // //     if (!formData.date_achat) {
// // // //       newErrors.date_achat = 'La date d\'achat est requise';
// // // //     }
// // // //     if (!formData.service_attribue) {
// // // //       newErrors.service_attribue = 'Le service est requis';
// // // //     }

// // // //     setErrors(newErrors);
// // // //     return Object.keys(newErrors).length === 0;
// // // //   };

// // // //   const handleSubmit = (e: React.FormEvent) => {
// // // //     e.preventDefault();
    
// // // //     if (validateForm()) {
// // // //       const submitData: Omit<Materiel, 'id'> = {
// // // //         nom: formData.nom,
// // // //         reference: formData.reference,
// // // //         date_achat: formData.date_achat,
// // // //         etat: formData.etat,
// // // //         service_attribue: formData.service_attribue,
// // // //         utilisateur_attribue: formData.utilisateur_attribue,
// // // //         fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
// // // //       };
      
// // // //       onSubmit(submitData);
// // // //     }
// // // //   };

// // // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
// // // //     const { name, value } = e.target;
    
// // // //     if (name === 'etat') {
// // // //       setFormData(prev => ({ 
// // // //         ...prev, 
// // // //         [name]: value as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete'
// // // //       }));
// // // //     } else {
// // // //       setFormData(prev => ({ 
// // // //         ...prev, 
// // // //         [name]: value 
// // // //       }));
// // // //     }
    
// // // //     if (errors[name]) {
// // // //       setErrors(prev => ({ 
// // // //         ...prev, 
// // // //         [name]: '' 
// // // //       }));
// // // //     }
// // // //   };

// // // //   const handleClose = () => {
// // // //     setFormData({
// // // //       nom: '',
// // // //       reference: '',
// // // //       date_achat: '',
// // // //       etat: 'fonctionnel',
// // // //       service_attribue: '',
// // // //       utilisateur_attribue: '',
// // // //       fournisseur: ''
// // // //     });
// // // //     setErrors({});
// // // //     onClose();
// // // //   };

// // // //   if (!isOpen) return null;

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //       <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
// // // //         <div className="flex justify-between items-center p-6 border-b border-base-300">
// // // //           <h2 className="text-xl font-bold text-base-content">
// // // //             {materiel ? 'Modifier le matériel' : 'Ajouter un matériel'}
// // // //           </h2>
// // // //           <button
// // // //             onClick={handleClose}
// // // //             className="btn btn-ghost btn-sm btn-circle"
// // // //             type="button"
// // // //           >
// // // //             <X className="w-5 h-5" />
// // // //           </button>
// // // //         </div>

// // // //         <form onSubmit={handleSubmit} className="p-6 space-y-4">
// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Nom du matériel *</span>
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               name="nom"
// // // //               value={formData.nom}
// // // //               onChange={handleChange}
// // // //               className={`input input-bordered w-full ${errors.nom ? 'input-error' : ''}`}
// // // //               placeholder="Ex: Ordinateur portable Dell"
// // // //             />
// // // //             {errors.nom && <span className="text-error text-sm mt-1">{errors.nom}</span>}
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Référence/Numéro de série *</span>
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               name="reference"
// // // //               value={formData.reference}
// // // //               onChange={handleChange}
// // // //               className={`input input-bordered w-full ${errors.reference ? 'input-error' : ''}`}
// // // //               placeholder="Ex: DELL-LAT-001"
// // // //             />
// // // //             {errors.reference && <span className="text-error text-sm mt-1">{errors.reference}</span>}
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Date d'achat *</span>
// // // //             </label>
// // // //             <input
// // // //               type="date"
// // // //               name="date_achat"
// // // //               value={formData.date_achat}
// // // //               onChange={handleChange}
// // // //               className={`input input-bordered w-full ${errors.date_achat ? 'input-error' : ''}`}
// // // //             />
// // // //             {errors.date_achat && <span className="text-error text-sm mt-1">{errors.date_achat}</span>}
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">État</span>
// // // //             </label>
// // // //             <select
// // // //               name="etat"
// // // //               value={formData.etat}
// // // //               onChange={handleChange}
// // // //               className="select select-bordered w-full"
// // // //             >
// // // //               <option value="fonctionnel">Fonctionnel</option>
// // // //               <option value="en_panne">En panne</option>
// // // //               <option value="repare">Réparé</option>
// // // //               <option value="obsolete">Obsolète</option>
// // // //             </select>
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Service attribué *</span>
// // // //             </label>
// // // //             <select
// // // //               name="service_attribue"
// // // //               value={formData.service_attribue}
// // // //               onChange={handleChange}
// // // //               className={`select select-bordered w-full ${errors.service_attribue ? 'select-error' : ''}`}
// // // //             >
// // // //               <option value="">Sélectionner un service</option>
// // // //               <option value="Direction">Direction</option>
// // // //               <option value="Comptabilité">Comptabilité</option>
// // // //               <option value="Ressources Humaines">Ressources Humaines</option>
// // // //               <option value="Informatique">Informatique</option>
// // // //               <option value="Secrétariat">Secrétariat</option>
// // // //               <option value="Archives">Archives</option>
// // // //             </select>
// // // //             {errors.service_attribue && <span className="text-error text-sm mt-1">{errors.service_attribue}</span>}
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Utilisateur attribué</span>
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               name="utilisateur_attribue"
// // // //               value={formData.utilisateur_attribue}
// // // //               onChange={handleChange}
// // // //               className="input input-bordered w-full"
// // // //               placeholder="Ex: Jean Dupont"
// // // //             />
// // // //           </div>

// // // //           <div className="form-control">
// // // //             <label className="label">
// // // //               <span className="label-text">Fournisseur</span>
// // // //             </label>
// // // //             <select
// // // //               name="fournisseur"
// // // //               value={formData.fournisseur}
// // // //               onChange={handleChange}
// // // //               className="select select-bordered w-full"
// // // //             >
// // // //               <option value="">Sélectionner un fournisseur</option>
// // // //               {fournisseurs.map((fournisseur) => (
// // // //                 <option key={fournisseur.id} value={fournisseur.id}>
// // // //                   {fournisseur.nom}
// // // //                 </option>
// // // //               ))}
// // // //             </select>
// // // //           </div>

// // // //           <div className="flex gap-3 pt-4 border-t border-base-300">
// // // //             <button
// // // //               type="button"
// // // //               onClick={handleClose}
// // // //               className="btn btn-ghost flex-1"
// // // //             >
// // // //               Annuler
// // // //             </button>
// // // //             <button
// // // //               type="submit"
// // // //               className="btn btn-primary flex-1"
// // // //             >
// // // //               {materiel ? 'Modifier' : 'Ajouter'}
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }




// // // import React, { useState, useEffect } from 'react';
// // // import { X, Package, Cpu, User, Calendar, Building } from 'lucide-react';
// // // import { Materiel, Fournisseur } from '../types';

// // // interface MaterielFormProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   onSubmit: (materielData: Omit<Materiel, 'id'>) => void;
// // //   materiel?: Materiel;
// // //   fournisseurs?: Fournisseur[];
// // // }

// // // // Définir le type pour le formulaire - doit correspondre au modèle Materiel
// // // interface MaterielFormData {
// // //   nom: string;
// // //   reference: string;
// // //   date_achat: string;
// // //   etat: 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete';
// // //   service_attribue: string;
// // //   utilisateur_attribue: string;
// // //   fournisseur: string; // Gardé en string pour le select
// // // }

// // // const MaterielForm: React.FC<MaterielFormProps> = ({
// // //   isOpen,
// // //   onClose,
// // //   onSubmit,
// // //   materiel,
// // //   fournisseurs = []
// // // }) => {
// // //   const [formData, setFormData] = useState<MaterielFormData>({
// // //     nom: '',
// // //     reference: '',
// // //     date_achat: '',
// // //     etat: 'fonctionnel',
// // //     service_attribue: '',
// // //     utilisateur_attribue: '',
// // //     fournisseur: ''
// // //   });

// // //   const [errors, setErrors] = useState<Record<string, string>>({});

// // //   useEffect(() => {
// // //     if (materiel) {
// // //       setFormData({
// // //         nom: materiel.nom || '',
// // //         reference: materiel.reference || '',
// // //         date_achat: materiel.date_achat ? 
// // //           new Date(materiel.date_achat).toISOString().split('T')[0] : 
// // //           '',
// // //         etat: materiel.etat || 'fonctionnel',
// // //         service_attribue: materiel.service_attribue || '',
// // //         utilisateur_attribue: materiel.utilisateur_attribue || '',
// // //         fournisseur: materiel.fournisseur ? materiel.fournisseur.toString() : ''
// // //       });
// // //     } else {
// // //       setFormData({
// // //         nom: '',
// // //         reference: '',
// // //         date_achat: '',
// // //         etat: 'fonctionnel',
// // //         service_attribue: '',
// // //         utilisateur_attribue: '',
// // //         fournisseur: ''
// // //       });
// // //     }
// // //     setErrors({});
// // //   }, [materiel, isOpen]);

// // //   const validateForm = (): boolean => {
// // //     const newErrors: Record<string, string> = {};

// // //     if (!formData.nom.trim()) {
// // //       newErrors.nom = 'Le nom est requis';
// // //     }
// // //     if (!formData.reference.trim()) {
// // //       newErrors.reference = 'La référence est requise';
// // //     }
// // //     if (!formData.date_achat) {
// // //       newErrors.date_achat = 'La date d\'achat est requise';
// // //     }
// // //     if (!formData.service_attribue) {
// // //       newErrors.service_attribue = 'Le service est requis';
// // //     }

// // //     setErrors(newErrors);
// // //     return Object.keys(newErrors).length === 0;
// // //   };

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
// // //     const { name, value } = e.target;
    
// // //     if (name === 'etat') {
// // //       setFormData(prev => ({ 
// // //         ...prev, 
// // //         [name]: value as 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete'
// // //       }));
// // //     } else {
// // //       setFormData(prev => ({ 
// // //         ...prev, 
// // //         [name]: value 
// // //       }));
// // //     }
    
// // //     // Effacer l'erreur du champ quand l'utilisateur modifie
// // //     if (errors[name]) {
// // //       setErrors(prev => ({ 
// // //         ...prev, 
// // //         [name]: '' 
// // //       }));
// // //     }
// // //   };

// // //   const handleSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
    
// // //     if (!validateForm()) {
// // //       return;
// // //     }

// // //     // Préparer les données pour l'API
// // //     const submitData: Omit<Materiel, 'id'> = {
// // //       nom: formData.nom.trim(),
// // //       reference: formData.reference.trim(),
// // //       date_achat: formData.date_achat,
// // //       etat: formData.etat,
// // //       service_attribue: formData.service_attribue,
// // //       utilisateur_attribue: formData.utilisateur_attribue.trim(),
// // //       fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
// // //     };

// // //     console.log('📤 Données soumises:', submitData);
// // //     onSubmit(submitData);
// // //   };

// // //   const handleClose = () => {
// // //     setFormData({
// // //       nom: '',
// // //       reference: '',
// // //       date_achat: '',
// // //       etat: 'fonctionnel',
// // //       service_attribue: '',
// // //       utilisateur_attribue: '',
// // //       fournisseur: ''
// // //     });
// // //     setErrors({});
// // //     onClose();
// // //   };

// // //   if (!isOpen) return null;

// // //   return (
// // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // //       <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// // //         <div className="flex justify-between items-center p-6 border-b border-base-300">
// // //           <h2 className="text-xl font-bold text-base-content">
// // //             {materiel ? 'Modifier le matériel' : 'Nouveau matériel'}
// // //           </h2>
// // //           <button
// // //             onClick={handleClose}
// // //             className="btn btn-ghost btn-sm btn-circle"
// // //             type="button"
// // //           >
// // //             <X className="w-5 h-5" />
// // //           </button>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="p-6 space-y-4">
// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //             {/* Nom du matériel */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">Nom du matériel *</span>
// // //               </label>
// // //               <div className="relative">
// // //                 <Package className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // //                 <input
// // //                   type="text"
// // //                   name="nom"
// // //                   value={formData.nom}
// // //                   onChange={handleChange}
// // //                   className={`input input-bordered w-full pl-10 ${errors.nom ? 'input-error' : ''}`}
// // //                   placeholder="Ex: Ordinateur portable Dell"
// // //                 />
// // //               </div>
// // //               {errors.nom && <span className="text-error text-sm mt-1">{errors.nom}</span>}
// // //             </div>

// // //             {/* Référence */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">Référence/Numéro de série *</span>
// // //               </label>
// // //               <div className="relative">
// // //                 <Cpu className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // //                 <input
// // //                   type="text"
// // //                   name="reference"
// // //                   value={formData.reference}
// // //                   onChange={handleChange}
// // //                   className={`input input-bordered w-full pl-10 ${errors.reference ? 'input-error' : ''}`}
// // //                   placeholder="Ex: DELL-LAT-001"
// // //                 />
// // //               </div>
// // //               {errors.reference && <span className="text-error text-sm mt-1">{errors.reference}</span>}
// // //             </div>

// // //             {/* Date d'achat */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">Date d'achat *</span>
// // //               </label>
// // //               <div className="relative">
// // //                 <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // //                 <input
// // //                   type="date"
// // //                   name="date_achat"
// // //                   value={formData.date_achat}
// // //                   onChange={handleChange}
// // //                   className={`input input-bordered w-full pl-10 ${errors.date_achat ? 'input-error' : ''}`}
// // //                 />
// // //               </div>
// // //               {errors.date_achat && <span className="text-error text-sm mt-1">{errors.date_achat}</span>}
// // //             </div>

// // //             {/* État */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">État</span>
// // //               </label>
// // //               <select
// // //                 name="etat"
// // //                 value={formData.etat}
// // //                 onChange={handleChange}
// // //                 className="select select-bordered w-full"
// // //               >
// // //                 <option value="fonctionnel">Fonctionnel</option>
// // //                 <option value="en_panne">En panne</option>
// // //                 <option value="repare">Réparé</option>
// // //                 <option value="obsolete">Obsolète</option>
// // //               </select>
// // //             </div>

// // //             {/* Service attribué */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">Service attribué *</span>
// // //               </label>
// // //               <select
// // //                 name="service_attribue"
// // //                 value={formData.service_attribue}
// // //                 onChange={handleChange}
// // //                 className={`select select-bordered w-full ${errors.service_attribue ? 'select-error' : ''}`}
// // //               >
// // //                 <option value="">Sélectionner un service</option>
// // //                 <option value="Direction">Direction</option>
// // //                 <option value="Comptabilité">Comptabilité</option>
// // //                 <option value="Ressources Humaines">Ressources Humaines</option>
// // //                 <option value="Informatique">Informatique</option>
// // //                 <option value="Secrétariat">Secrétariat</option>
// // //                 <option value="Archives">Archives</option>
// // //               </select>
// // //               {errors.service_attribue && <span className="text-error text-sm mt-1">{errors.service_attribue}</span>}
// // //             </div>

// // //             {/* Utilisateur attribué */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">Utilisateur attribué</span>
// // //               </label>
// // //               <div className="relative">
// // //                 <User className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // //                 <input
// // //                   type="text"
// // //                   name="utilisateur_attribue"
// // //                   value={formData.utilisateur_attribue}
// // //                   onChange={handleChange}
// // //                   className="input input-bordered w-full pl-10"
// // //                   placeholder="Ex: Jean Dupont"
// // //                 />
// // //               </div>
// // //             </div>

// // //             {/* Fournisseur */}
// // //             <div className="form-control md:col-span-2">
// // //               <label className="label">
// // //                 <span className="label-text">Fournisseur</span>
// // //               </label>
// // //               <div className="relative">
// // //                 <Building className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // //                 <select
// // //                   name="fournisseur"
// // //                   value={formData.fournisseur}
// // //                   onChange={handleChange}
// // //                   className="select select-bordered w-full pl-10"
// // //                 >
// // //                   <option value="">Sélectionner un fournisseur</option>
// // //                   {fournisseurs.map((fournisseur) => (
// // //                     <option key={fournisseur.id} value={fournisseur.id}>
// // //                       {fournisseur.nom}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="flex gap-3 pt-4 border-t border-base-300">
// // //             <button
// // //               type="button"
// // //               onClick={handleClose}
// // //               className="btn btn-ghost flex-1"
// // //             >
// // //               Annuler
// // //             </button>
// // //             <button
// // //               type="submit"
// // //               className="btn btn-primary flex-1"
// // //             >
// // //               {materiel ? 'Modifier' : 'Ajouter'} le matériel
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default MaterielForm;





// import React, { useState, useEffect } from 'react';
// import { X, Package, Cpu, User, Calendar, Building, Wrench, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
// import { Materiel, Fournisseur } from '../types';

// interface MaterielFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (materielData: Omit<Materiel, 'id'>) => void;
//   materiel?: Materiel;
//   fournisseurs?: Fournisseur[];
// }

// // Définir tous les états possibles
// type EtatMateriel = 
//   | 'fonctionnel' 
//   | 'en_panne' 
//   | 'repare' 
//   | 'obsolete'
//   | 'en_maintenance'
//   | 'en_amelioration'
//   | 'en_reparation'
//   | 'hors_service';

// interface MaterielFormData {
//   nom: string;
//   reference: string;
//   date_achat: string;
//   etat: EtatMateriel;
//   service_attribue: string;
//   utilisateur_attribue: string;
//   fournisseur: string;
// }

// const MaterielForm: React.FC<MaterielFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   materiel,
//   fournisseurs = []
// }) => {
//   const [formData, setFormData] = useState<MaterielFormData>({
//     nom: '',
//     reference: '',
//     date_achat: '',
//     etat: 'fonctionnel',
//     service_attribue: '',
//     utilisateur_attribue: '',
//     fournisseur: ''
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Services disponibles
//   const services = [
//     'Direction',
//     'Comptabilité',
//     'Ressources Humaines',
//     'Informatique',
//     'Secrétariat',
//     'Archives',
//     'Commercial',
//     'Marketing',
//     'Production',
//     'Logistique',
//     'Maintenance',
//     'Qualité',
//     'Recherche & Développement',
//     'Support Technique'
//   ];

//   // Options d'état avec descriptions
//   const etatOptions: { value: EtatMateriel; label: string; description: string; icon: React.ReactNode; color: string }[] = [
//     { 
//       value: 'fonctionnel', 
//       label: 'Fonctionnel', 
//       description: 'En parfait état de fonctionnement', 
//       icon: <CheckCircle className="h-4 w-4" />,
//       color: 'badge-success'
//     },
//     { 
//       value: 'en_panne', 
//       label: 'En panne', 
//       description: 'Ne fonctionne pas - nécessite réparation', 
//       icon: <AlertTriangle className="h-4 w-4" />,
//       color: 'badge-error'
//     },
//     { 
//       value: 'repare', 
//       label: 'Réparé', 
//       description: 'Récemment réparé et fonctionnel', 
//       icon: <Wrench className="h-4 w-4" />,
//       color: 'badge-warning'
//     },
//     { 
//       value: 'obsolete', 
//       label: 'Obsolète', 
//       description: 'Technologiquement dépassé mais fonctionnel', 
//       icon: <Package className="h-4 w-4" />,
//       color: 'badge-neutral'
//     },
//     { 
//       value: 'en_maintenance', 
//       label: 'En maintenance', 
//       description: 'En cours de maintenance préventive', 
//       icon: <Wrench className="h-4 w-4" />,
//       color: 'badge-info'
//     },
//     { 
//       value: 'en_amelioration', 
//       label: 'En amélioration', 
//       description: 'En cours de mise à niveau ou amélioration', 
//       icon: <Zap className="h-4 w-4" />,
//       color: 'badge-primary'
//     },
//     { 
//       value: 'en_reparation', 
//       label: 'En réparation', 
//       description: 'En cours de réparation corrective', 
//       icon: <Wrench className="h-4 w-4" />,
//       color: 'badge-warning'
//     },
//     { 
//       value: 'hors_service', 
//       label: 'Hors service', 
//       description: 'Inutilisable - à remplacer', 
//       icon: <X className="h-4 w-4" />,
//       color: 'badge-error'
//     }
//   ];

//   useEffect(() => {
//     if (materiel) {
//       setFormData({
//         nom: materiel.nom || '',
//         reference: materiel.reference || '',
//         date_achat: materiel.date_achat ? 
//           new Date(materiel.date_achat).toISOString().split('T')[0] : 
//           '',
//         etat: (materiel.etat as EtatMateriel) || 'fonctionnel',
//         service_attribue: materiel.service_attribue || '',
//         utilisateur_attribue: materiel.utilisateur_attribue || '',
//         fournisseur: materiel.fournisseur ? materiel.fournisseur.toString() : ''
//       });
//     } else {
//       // Valeurs par défaut pour un nouveau matériel
//       setFormData({
//         nom: '',
//         reference: '',
//         date_achat: new Date().toISOString().split('T')[0], // Date du jour par défaut
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
//     } else if (formData.nom.trim().length < 2) {
//       newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
//     }

//     if (!formData.reference.trim()) {
//       newErrors.reference = 'La référence est requise';
//     } else if (formData.reference.trim().length < 3) {
//       newErrors.reference = 'La référence doit contenir au moins 3 caractères';
//     }

//     if (!formData.date_achat) {
//       newErrors.date_achat = 'La date d\'achat est requise';
//     } else {
//       const date = new Date(formData.date_achat);
//       const today = new Date();
//       if (date > today) {
//         newErrors.date_achat = 'La date d\'achat ne peut pas être dans le futur';
//       }
//     }

//     if (!formData.service_attribue) {
//       newErrors.service_attribue = 'Le service est requis';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'etat') {
//       setFormData(prev => ({ 
//         ...prev, 
//         [name]: value as EtatMateriel
//       }));
//     } else {
//       setFormData(prev => ({ 
//         ...prev, 
//         [name]: value 
//       }));
//     }
    
//     // Effacer l'erreur du champ quand l'utilisateur modifie
//     if (errors[name]) {
//       setErrors(prev => ({ 
//         ...prev, 
//         [name]: '' 
//       }));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     // Préparer les données pour l'API
//     const submitData: Omit<Materiel, 'id'> = {
//       nom: formData.nom.trim(),
//       reference: formData.reference.trim(),
//       date_achat: formData.date_achat,
//       etat: formData.etat,
//       service_attribue: formData.service_attribue,
//       utilisateur_attribue: formData.utilisateur_attribue.trim(),
//       fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
//     };

//     console.log('📤 Données soumises:', submitData);
//     onSubmit(submitData);
//   };

//   const handleClose = () => {
//     setFormData({
//       nom: '',
//       reference: '',
//       date_achat: new Date().toISOString().split('T')[0],
//       etat: 'fonctionnel',
//       service_attribue: '',
//       utilisateur_attribue: '',
//       fournisseur: ''
//     });
//     setErrors({});
//     onClose();
//   };

//   // Calculer la date maximale (aujourd'hui)
//   const getMaxDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Calculer la date minimale (10 ans en arrière)
//   const getMinDate = () => {
//     const tenYearsAgo = new Date();
//     tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
//     return tenYearsAgo.toISOString().split('T')[0];
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center p-6 border-b border-base-300">
//           <div>
//             <h2 className="text-xl font-bold text-base-content">
//               {materiel ? '✏️ Modifier le matériel' : '➕ Nouveau matériel'}
//             </h2>
//             <p className="text-sm text-base-content opacity-60 mt-1">
//               {materiel ? 'Modifier les informations du matériel' : 'Ajouter un nouveau matériel à l\'inventaire'}
//             </p>
//           </div>
//           <button
//             onClick={handleClose}
//             className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
//             type="button"
//             aria-label="Fermer"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Section Informations de base */}
//           <div className="bg-base-200 p-4 rounded-lg">
//             <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
//               <Package className="h-5 w-5" />
//               Informations de base
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Nom du matériel */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Nom du matériel *</span>
//                 </label>
//                 <div className="relative">
//                   <Package className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                   <input
//                     type="text"
//                     name="nom"
//                     value={formData.nom}
//                     onChange={handleChange}
//                     className={`input input-bordered w-full pl-10 ${errors.nom ? 'input-error' : 'input-primary'}`}
//                     placeholder="Ex: Ordinateur portable Dell XPS 15"
//                     maxLength={100}
//                   />
//                 </div>
//                 {errors.nom && (
//                   <span className="text-error text-sm mt-1 flex items-center gap-1">
//                     <AlertTriangle className="h-3 w-3" />
//                     {errors.nom}
//                   </span>
//                 )}
//                 <div className="text-xs opacity-60 mt-1">
//                   {formData.nom.length}/100 caractères
//                 </div>
//               </div>

//               {/* Référence */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Référence/Numéro de série *</span>
//                 </label>
//                 <div className="relative">
//                   <Cpu className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                   <input
//                     type="text"
//                     name="reference"
//                     value={formData.reference}
//                     onChange={handleChange}
//                     className={`input input-bordered w-full pl-10 ${errors.reference ? 'input-error' : 'input-primary'}`}
//                     placeholder="Ex: DELL-XPS15-001-2024"
//                     maxLength={50}
//                   />
//                 </div>
//                 {errors.reference && (
//                   <span className="text-error text-sm mt-1 flex items-center gap-1">
//                     <AlertTriangle className="h-3 w-3" />
//                     {errors.reference}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Section État et Caractéristiques */}
//           <div className="bg-base-200 p-4 rounded-lg">
//             <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
//               <Wrench className="h-5 w-5" />
//               État et Caractéristiques
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Date d'achat */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Date d'achat *</span>
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                   <input
//                     type="date"
//                     name="date_achat"
//                     value={formData.date_achat}
//                     onChange={handleChange}
//                     min={getMinDate()}
//                     max={getMaxDate()}
//                     className={`input input-bordered w-full pl-10 ${errors.date_achat ? 'input-error' : 'input-primary'}`}
//                   />
//                 </div>
//                 {errors.date_achat && (
//                   <span className="text-error text-sm mt-1 flex items-center gap-1">
//                     <AlertTriangle className="h-3 w-3" />
//                     {errors.date_achat}
//                   </span>
//                 )}
//               </div>

//               {/* État */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">État du matériel</span>
//                 </label>
//                 <select
//                   name="etat"
//                   value={formData.etat}
//                   onChange={handleChange}
//                   className="select select-bordered w-full select-primary"
//                 >
//                   {etatOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="mt-2">
//                   <div className={`badge gap-2 ${etatOptions.find(o => o.value === formData.etat)?.color}`}>
//                     {etatOptions.find(o => o.value === formData.etat)?.icon}
//                     {etatOptions.find(o => o.value === formData.etat)?.label}
//                   </div>
//                   <div className="text-xs opacity-60 mt-1">
//                     {etatOptions.find(o => o.value === formData.etat)?.description}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section Attribution */}
//           <div className="bg-base-200 p-4 rounded-lg">
//             <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Attribution
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Service attribué */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Service attribué *</span>
//                 </label>
//                 <select
//                   name="service_attribue"
//                   value={formData.service_attribue}
//                   onChange={handleChange}
//                   className={`select select-bordered w-full ${errors.service_attribue ? 'select-error' : 'select-primary'}`}
//                 >
//                   <option value="">Sélectionner un service</option>
//                   {services.map((service) => (
//                     <option key={service} value={service}>
//                       {service}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.service_attribue && (
//                   <span className="text-error text-sm mt-1 flex items-center gap-1">
//                     <AlertTriangle className="h-3 w-3" />
//                     {errors.service_attribue}
//                   </span>
//                 )}
//               </div>

//               {/* Utilisateur attribué */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Utilisateur attribué</span>
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                   <input
//                     type="text"
//                     name="utilisateur_attribue"
//                     value={formData.utilisateur_attribue}
//                     onChange={handleChange}
//                     className="input input-bordered w-full pl-10 input-primary"
//                     placeholder="Ex: Jean Dupont"
//                     maxLength={50}
//                   />
//                 </div>
//                 <div className="text-xs opacity-60 mt-1">
//                   Laisser vide si non attribué
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section Fournisseur */}
//           <div className="bg-base-200 p-4 rounded-lg">
//             <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
//               <Building className="h-5 w-5" />
//               Fournisseur
//             </h3>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Fournisseur</span>
//               </label>
//               <div className="relative">
//                 <Building className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <select
//                   name="fournisseur"
//                   value={formData.fournisseur}
//                   onChange={handleChange}
//                   className="select select-bordered w-full pl-10 select-primary"
//                 >
//                   <option value="">Sélectionner un fournisseur (optionnel)</option>
//                   {fournisseurs.map((fournisseur) => (
//                     <option key={fournisseur.id} value={fournisseur.id}>
//                       {fournisseur.nom}
//                       {fournisseur.contact ? ` - ${fournisseur.contact}` : ''}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="text-xs opacity-60 mt-1">
//                 Sélectionnez un fournisseur existant ou laissez vide
//               </div>
//             </div>
//           </div>

//           {/* Section Notes et Instructions (optionnel) */}
//           <div className="bg-base-200 p-4 rounded-lg">
//             <h3 className="font-bold text-base-content mb-4">📝 Notes supplémentaires</h3>
//             <div className="form-control">
//               <textarea
//                 className="textarea textarea-bordered textarea-primary w-full"
//                 placeholder="Ajoutez des notes, instructions ou détails supplémentaires sur ce matériel..."
//                 rows={3}
//               ></textarea>
//               <div className="text-xs opacity-60 mt-1">
//                 Ces informations seront visibles dans les détails du matériel
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-4 border-t border-base-300">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="btn btn-ghost flex-1 hover:bg-base-300"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary flex-1"
//             >
//               {materiel ? 'Enregistrer les modifications' : 'Ajouter le matériel'}
//             </button>
//           </div>

//           {/* Aide sur les champs obligatoires */}
//           <div className="text-xs text-base-content opacity-50 pt-2 border-t border-base-300">
//             <p>* Champs obligatoires</p>
//             <p>L'état du matériel sera automatiquement synchronisé avec les réparations</p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MaterielForm;




// import React, { useState, useEffect } from 'react';
// import { X, Package, Cpu, User, Calendar, Building, Wrench, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
// import { Materiel, Fournisseur } from '../types';

// interface MaterielFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (materielData: Omit<Materiel, 'id' | 'created_at' | 'updated_at' | 'fournisseur_nom'>) => void;
//   materiel?: Materiel;
//   fournisseurs?: Fournisseur[];
// }

// // Définir le type pour le formulaire
// interface MaterielFormData {
//   nom: string;
//   reference: string;
//   date_achat: string;
//   etat: Materiel['etat']; // Utiliser le type de Materiel.etat
//   service_attribue: string;
//   utilisateur_attribue: string;
//   fournisseur: string; // Gardé en string pour le select
// }

// const MaterielForm: React.FC<MaterielFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   materiel,
//   fournisseurs = []
// }) => {
//   const [formData, setFormData] = useState<MaterielFormData>({
//     nom: '',
//     reference: '',
//     date_achat: new Date().toISOString().split('T')[0], // Date du jour par défaut
//     etat: 'fonctionnel',
//     service_attribue: '',
//     utilisateur_attribue: '',
//     fournisseur: ''
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Services disponibles
//   const services = [
//     'Direction',
//     'Comptabilité',
//     'Ressources Humaines',
//     'Informatique',
//     'Secrétariat',
//     'Archives',
//     'Commercial',
//     'Marketing',
//     'Production',
//     'Logistique',
//     'Maintenance',
//     'Qualité',
//     'Recherche & Développement',
//     'Support Technique'
//   ];

//   // Options d'état avec descriptions
//   const etatOptions: { value: Materiel['etat']; label: string; description: string; icon: React.ReactNode; color: string }[] = [
//     { 
//       value: 'fonctionnel', 
//       label: 'Fonctionnel', 
//       description: 'En parfait état de fonctionnement', 
//       icon: <CheckCircle className="h-4 w-4" />,
//       color: 'badge-success'
//     },
//     { 
//       value: 'en_panne', 
//       label: 'En panne', 
//       description: 'Ne fonctionne pas - nécessite réparation', 
//       icon: <AlertTriangle className="h-4 w-4" />,
//       color: 'badge-error'
//     },
//     { 
//       value: 'repare', 
//       label: 'Réparé', 
//       description: 'Récemment réparé et fonctionnel', 
//       icon: <Wrench className="h-4 w-4" />,
//       color: 'badge-warning'
//     },
//     { 
//       value: 'obsolete', 
//       label: 'Obsolète', 
//       description: 'Technologiquement dépassé mais fonctionnel', 
//       icon: <Package className="h-4 w-4" />,
//       color: 'badge-neutral'
//     },
//     { 
//       value: 'en_maintenance', 
//       label: 'En maintenance', 
//       description: 'En cours de maintenance préventive', 
//       icon: <Wrench className="h-4 w-4" />,
//       color: 'badge-info'
//     },
//     { 
//       value: 'en_amelioration', 
//       label: 'En amélioration', 
//       description: 'En cours de mise à niveau ou amélioration', 
//       icon: <Zap className="h-4 w-4" />,
//       color: 'badge-primary'
//     },
//     { 
//       value: 'en_reparation', 
//       label: 'En réparation', 
//       description: 'En cours de réparation corrective', 
//       icon: <Wrench className="h-4 w-4" />,
//       color: 'badge-warning'
//     },
//     { 
//       value: 'hors_service', 
//       label: 'Hors service', 
//       description: 'Inutilisable - à remplacer', 
//       icon: <X className="h-4 w-4" />,
//       color: 'badge-error'
//     }
//   ];

//   useEffect(() => {
//     if (materiel) {
//       setFormData({
//         nom: materiel.nom || '',
//         reference: materiel.reference || '',
//         date_achat: materiel.date_achat ? 
//           new Date(materiel.date_achat).toISOString().split('T')[0] : 
//           new Date().toISOString().split('T')[0],
//         etat: materiel.etat || 'fonctionnel',
//         service_attribue: materiel.service_attribue || '',
//         utilisateur_attribue: materiel.utilisateur_attribue || '',
//         fournisseur: materiel.fournisseur ? materiel.fournisseur.toString() : ''
//       });
//     } else {
//       // Valeurs par défaut pour un nouveau matériel
//       setFormData({
//         nom: '',
//         reference: '',
//         date_achat: new Date().toISOString().split('T')[0],
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
//     } else if (formData.nom.trim().length < 2) {
//       newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
//     }

//     if (!formData.reference.trim()) {
//       newErrors.reference = 'La référence est requise';
//     } else if (formData.reference.trim().length < 3) {
//       newErrors.reference = 'La référence doit contenir au moins 3 caractères';
//     }

//     if (!formData.date_achat) {
//       newErrors.date_achat = 'La date d\'achat est requise';
//     } else {
//       const date = new Date(formData.date_achat);
//       const today = new Date();
//       if (date > today) {
//         newErrors.date_achat = 'La date d\'achat ne peut pas être dans le futur';
//       }
//     }

//     if (!formData.service_attribue) {
//       newErrors.service_attribue = 'Le service est requis';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'etat') {
//       setFormData(prev => ({ 
//         ...prev, 
//         [name]: value as Materiel['etat']
//       }));
//     } else {
//       setFormData(prev => ({ 
//         ...prev, 
//         [name]: value 
//       }));
//     }
    
//     // Effacer l'erreur du champ quand l'utilisateur modifie
//     if (errors[name]) {
//       setErrors(prev => ({ 
//         ...prev, 
//         [name]: '' 
//       }));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     // Préparer les données pour l'API
//     const submitData: Omit<Materiel, 'id' | 'created_at' | 'updated_at' | 'fournisseur_nom'> = {
//       nom: formData.nom.trim(),
//       reference: formData.reference.trim(),
//       date_achat: formData.date_achat,
//       etat: formData.etat,
//       service_attribue: formData.service_attribue,
//       utilisateur_attribue: formData.utilisateur_attribue.trim() || null,
//       fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
//     };

//     console.log('📤 Données soumises:', submitData);
//     onSubmit(submitData);
//   };

//   const handleClose = () => {
//     setFormData({
//       nom: '',
//       reference: '',
//       date_achat: new Date().toISOString().split('T')[0],
//       etat: 'fonctionnel',
//       service_attribue: '',
//       utilisateur_attribue: '',
//       fournisseur: ''
//     });
//     setErrors({});
//     onClose();
//   };

//   // Calculer la date maximale (aujourd'hui)
//   const getMaxDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Calculer la date minimale (10 ans en arrière)
//   const getMinDate = () => {
//     const tenYearsAgo = new Date();
//     tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
//     return tenYearsAgo.toISOString().split('T')[0];
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="bg-base-100 rounded-lg shadow-xl">
//       <div className="flex justify-between items-center p-6 border-b border-base-300">
//         <div>
//           <h2 className="text-xl font-bold text-base-content">
//             {materiel ? '✏️ Modifier le matériel' : '➕ Nouveau matériel'}
//           </h2>
//           <p className="text-sm text-base-content opacity-60 mt-1">
//             {materiel ? 'Modifier les informations du matériel' : 'Ajouter un nouveau matériel à l\'inventaire'}
//           </p>
//         </div>
//         <button
//           onClick={handleClose}
//           className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
//           type="button"
//           aria-label="Fermer"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="p-6 space-y-6">
//         {/* Section Informations de base */}
//         <div className="bg-base-200 p-4 rounded-lg">
//           <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
//             <Package className="h-5 w-5" />
//             Informations de base
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Nom du matériel */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Nom du matériel *</span>
//               </label>
//               <div className="relative">
//                 <Package className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   name="nom"
//                   value={formData.nom}
//                   onChange={handleChange}
//                   className={`input input-bordered w-full pl-10 ${errors.nom ? 'input-error' : 'input-primary'}`}
//                   placeholder="Ex: Ordinateur portable Dell XPS 15"
//                   maxLength={100}
//                 />
//               </div>
//               {errors.nom && (
//                 <span className="text-error text-sm mt-1 flex items-center gap-1">
//                   <AlertTriangle className="h-3 w-3" />
//                   {errors.nom}
//                 </span>
//               )}
//               <div className="text-xs opacity-60 mt-1">
//                 {formData.nom.length}/100 caractères
//               </div>
//             </div>

//             {/* Référence */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Référence/Numéro de série *</span>
//               </label>
//               <div className="relative">
//                 <Cpu className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   name="reference"
//                   value={formData.reference}
//                   onChange={handleChange}
//                   className={`input input-bordered w-full pl-10 ${errors.reference ? 'input-error' : 'input-primary'}`}
//                   placeholder="Ex: DELL-XPS15-001-2024"
//                   maxLength={50}
//                 />
//               </div>
//               {errors.reference && (
//                 <span className="text-error text-sm mt-1 flex items-center gap-1">
//                   <AlertTriangle className="h-3 w-3" />
//                   {errors.reference}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Section État et Caractéristiques */}
//         <div className="bg-base-200 p-4 rounded-lg">
//           <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
//             <Wrench className="h-5 w-5" />
//             État et Caractéristiques
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Date d'achat */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Date d'achat *</span>
//               </label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="date"
//                   name="date_achat"
//                   value={formData.date_achat}
//                   onChange={handleChange}
//                   min={getMinDate()}
//                   max={getMaxDate()}
//                   className={`input input-bordered w-full pl-10 ${errors.date_achat ? 'input-error' : 'input-primary'}`}
//                 />
//               </div>
//               {errors.date_achat && (
//                 <span className="text-error text-sm mt-1 flex items-center gap-1">
//                   <AlertTriangle className="h-3 w-3" />
//                   {errors.date_achat}
//                 </span>
//               )}
//             </div>

//             {/* État */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">État du matériel</span>
//               </label>
//               <select
//                 name="etat"
//                 value={formData.etat}
//                 onChange={handleChange}
//                 className="select select-bordered w-full select-primary"
//               >
//                 {etatOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//               <div className="mt-2">
//                 <div className={`badge gap-2 ${etatOptions.find(o => o.value === formData.etat)?.color}`}>
//                   {etatOptions.find(o => o.value === formData.etat)?.icon}
//                   {etatOptions.find(o => o.value === formData.etat)?.label}
//                 </div>
//                 <div className="text-xs opacity-60 mt-1">
//                   {etatOptions.find(o => o.value === formData.etat)?.description}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Section Attribution */}
//         <div className="bg-base-200 p-4 rounded-lg">
//           <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
//             <User className="h-5 w-5" />
//             Attribution
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Service attribué */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Service attribué *</span>
//               </label>
//               <select
//                 name="service_attribue"
//                 value={formData.service_attribue}
//                 onChange={handleChange}
//                 className={`select select-bordered w-full ${errors.service_attribue ? 'select-error' : 'select-primary'}`}
//               >
//                 <option value="">Sélectionner un service</option>
//                 {services.map((service) => (
//                   <option key={service} value={service}>
//                     {service}
//                   </option>
//                 ))}
//               </select>
//               {errors.service_attribue && (
//                 <span className="text-error text-sm mt-1 flex items-center gap-1">
//                   <AlertTriangle className="h-3 w-3" />
//                   {errors.service_attribue}
//                 </span>
//               )}
//             </div>

//             {/* Utilisateur attribué */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Utilisateur attribué</span>
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   name="utilisateur_attribue"
//                   value={formData.utilisateur_attribue}
//                   onChange={handleChange}
//                   className="input input-bordered w-full pl-10 input-primary"
//                   placeholder="Ex: Jean Dupont"
//                   maxLength={50}
//                 />
//               </div>
//               <div className="text-xs opacity-60 mt-1">
//                 Laisser vide si non attribué
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Section Fournisseur */}
//         <div className="bg-base-200 p-4 rounded-lg">
//           <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
//             <Building className="h-5 w-5" />
//             Fournisseur
//           </h3>
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-semibold">Fournisseur</span>
//             </label>
//             <div className="relative">
//               <Building className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//               <select
//                 name="fournisseur"
//                 value={formData.fournisseur}
//                 onChange={handleChange}
//                 className="select select-bordered w-full pl-10 select-primary"
//               >
//                 <option value="">Sélectionner un fournisseur (optionnel)</option>
//                 {fournisseurs.map((fournisseur) => (
//                   <option key={fournisseur.id} value={fournisseur.id}>
//                     {fournisseur.nom}
//                     {fournisseur.contact ? ` - ${fournisseur.contact}` : ''}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="text-xs opacity-60 mt-1">
//               Sélectionnez un fournisseur existant ou laissez vide
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-3 pt-4 border-t border-base-300">
//           <button
//             type="button"
//             onClick={handleClose}
//             className="btn btn-ghost flex-1 hover:bg-base-300"
//           >
//             Annuler
//           </button>
//           <button
//             type="submit"
//             className="btn btn-primary flex-1"
//           >
//             {materiel ? 'Enregistrer les modifications' : 'Ajouter le matériel'}
//           </button>
//         </div>

//         {/* Aide sur les champs obligatoires */}
//         <div className="text-xs text-base-content opacity-50 pt-2 border-t border-base-300">
//           <p>* Champs obligatoires</p>
//           <p>L'état du matériel sera automatiquement synchronisé avec les réparations</p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MaterielForm;





import React, { useState, useEffect } from 'react';
import { X, Package, Cpu, User, Calendar, Building, Wrench, Zap, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Materiel, Fournisseur } from '../types';

interface MaterielFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (materielData: Omit<Materiel, 'id' | 'created_at' | 'updated_at' | 'fournisseur_nom'>) => void;
  materiel?: Materiel;
  fournisseurs?: Fournisseur[];
}

// Interface pour les états d'affichage
interface EtatAffichage {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  apiValue: string; // Valeur à envoyer à l'API
  showInSelect: boolean; // Si l'état doit apparaître dans le select
}

const MaterielForm: React.FC<MaterielFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  materiel,
  fournisseurs = []
}) => {
  // États acceptés par l'API Django (seulement 4)
  const etatsAPIValides = ['fonctionnel', 'en_panne', 'repare', 'obsolete'];
  
  // États d'affichage avec mapping vers états API
  const etatOptions: EtatAffichage[] = [
    { 
      value: 'fonctionnel', 
      label: 'Fonctionnel', 
      description: 'En parfait état de fonctionnement', 
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'badge-success',
      apiValue: 'fonctionnel',
      showInSelect: true
    },
    { 
      value: 'en_panne', 
      label: 'En panne', 
      description: 'Ne fonctionne pas - nécessite réparation', 
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'badge-error',
      apiValue: 'en_panne',
      showInSelect: true
    },
    { 
      value: 'repare', 
      label: 'Réparé', 
      description: 'Récemment réparé et fonctionnel', 
      icon: <Wrench className="h-4 w-4" />,
      color: 'badge-warning',
      apiValue: 'repare',
      showInSelect: true
    },
    { 
      value: 'obsolete', 
      label: 'Obsolète', 
      description: 'Technologiquement dépassé mais fonctionnel', 
      icon: <Package className="h-4 w-4" />,
      color: 'badge-neutral',
      apiValue: 'obsolete',
      showInSelect: true
    },
    // Nouveaux états qui seront mappés
    { 
      value: 'en_maintenance', 
      label: 'En maintenance', 
      description: 'En cours de maintenance préventive (API: En panne)', 
      icon: <Wrench className="h-4 w-4" />,
      color: 'badge-info',
      apiValue: 'en_panne', // Map à 'en_panne'
      showInSelect: false
    },
    { 
      value: 'en_amelioration', 
      label: 'En amélioration', 
      description: 'En cours de mise à niveau (API: Fonctionnel)', 
      icon: <Zap className="h-4 w-4" />,
      color: 'badge-primary',
      apiValue: 'fonctionnel', // Map à 'fonctionnel'
      showInSelect: false
    },
    { 
      value: 'en_reparation', 
      label: 'En réparation', 
      description: 'En cours de réparation (API: En panne)', 
      icon: <Wrench className="h-4 w-4" />,
      color: 'badge-warning',
      apiValue: 'en_panne', // Map à 'en_panne'
      showInSelect: false
    },
    { 
      value: 'hors_service', 
      label: 'Hors service', 
      description: 'Inutilisable (API: Obsolète)', 
      icon: <X className="h-4 w-4" />,
      color: 'badge-error',
      apiValue: 'obsolete', // Map à 'obsolete'
      showInSelect: false
    }
  ];

  // Type pour le formulaire - utiliser uniquement les états API valides
  type EtatForm = 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete';

  interface MaterielFormData {
    nom: string;
    reference: string;
    date_achat: string;
    etat: EtatForm; // Seulement les 4 états valides
    service_attribue: string;
    utilisateur_attribue: string;
    fournisseur: string;
    // Champ caché pour stocker l'état d'affichage
    _etatAffichage?: string;
  }

  const [formData, setFormData] = useState<MaterielFormData>({
    nom: '',
    reference: '',
    date_achat: new Date().toISOString().split('T')[0],
    etat: 'fonctionnel',
    service_attribue: '',
    utilisateur_attribue: '',
    fournisseur: '',
    _etatAffichage: 'fonctionnel' // Par défaut
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Services disponibles
  const services = [
    'Direction',
    'Comptabilité',
    'Ressources Humaines',
    'Informatique',
    'Secrétariat',
    'Archives',
    'Commercial',
    'Marketing',
    'Production',
    'Logistique',
    'Maintenance',
    'Qualité',
    'Recherche & Développement',
    'Support Technique'
  ];

  useEffect(() => {
    if (materiel) {
      // Déterminer l'état d'affichage basé sur l'état API
      let etatAffichage = materiel.etat;
      
      // Si le matériel a un état non standard, le mapper pour l'affichage
      // Cette logique pourrait être basée sur d'autres données (comme les réparations en cours)
      if (materiel.etat === 'fonctionnel') {
        // Vérifier si une réparation améliorative est en cours
        etatAffichage = 'fonctionnel'; // Par défaut
      } else if (materiel.etat === 'en_panne') {
        // Vérifier si une réparation corrective ou préventive est en cours
        etatAffichage = 'en_panne'; // Par défaut
      }
      
      setFormData({
        nom: materiel.nom || '',
        reference: materiel.reference || '',
        date_achat: materiel.date_achat ? 
          new Date(materiel.date_achat).toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0],
        etat: materiel.etat as EtatForm, // Forcer le type
        service_attribue: materiel.service_attribue || '',
        utilisateur_attribue: materiel.utilisateur_attribue || '',
        fournisseur: materiel.fournisseur ? materiel.fournisseur.toString() : '',
        _etatAffichage: etatAffichage
      });
    } else {
      setFormData({
        nom: '',
        reference: '',
        date_achat: new Date().toISOString().split('T')[0],
        etat: 'fonctionnel',
        service_attribue: '',
        utilisateur_attribue: '',
        fournisseur: '',
        _etatAffichage: 'fonctionnel'
      });
    }
    setErrors({});
  }, [materiel, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.reference.trim()) {
      newErrors.reference = 'La référence est requise';
    } else if (formData.reference.trim().length < 3) {
      newErrors.reference = 'La référence doit contenir au moins 3 caractères';
    }

    if (!formData.date_achat) {
      newErrors.date_achat = 'La date d\'achat est requise';
    } else {
      const date = new Date(formData.date_achat);
      const today = new Date();
      if (date > today) {
        newErrors.date_achat = 'La date d\'achat ne peut pas être dans le futur';
      }
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
      // S'assurer que l'état est valide pour l'API
      if (etatsAPIValides.includes(value)) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value as EtatForm,
          _etatAffichage: value // Mettre à jour l'état d'affichage
        }));
      }
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
    
    // Effacer l'erreur du champ
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

    // Préparer les données pour l'API (uniquement les 4 états valides)
    const submitData: Omit<Materiel, 'id' | 'created_at' | 'updated_at' | 'fournisseur_nom'> = {
      nom: formData.nom.trim(),
      reference: formData.reference.trim(),
      date_achat: formData.date_achat,
      etat: formData.etat, // Déjà un état API valide
      service_attribue: formData.service_attribue,
      utilisateur_attribue: formData.utilisateur_attribue.trim() || null,
      fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
    };

    console.log('📤 Données soumises à l\'API:', submitData);
    console.log('État d\'affichage:', formData._etatAffichage);
    console.log('État envoyé à l\'API:', formData.etat);
    
    onSubmit(submitData);
  };

  // Trouver l'option d'état pour l'affichage
  const etatActuel = etatOptions.find(o => o.value === formData._etatAffichage) || etatOptions[0];

  if (!isOpen) return null;

  return (
    <div className="bg-base-100 rounded-lg shadow-xl">
      <div className="flex justify-between items-center p-6 border-b border-base-300">
        <div>
          <h2 className="text-xl font-bold text-base-content">
            {materiel ? '✏️ Modifier le matériel' : '➕ Nouveau matériel'}
          </h2>
          <p className="text-sm text-base-content opacity-60 mt-1">
            {materiel ? 'Modifier les informations du matériel' : 'Ajouter un nouveau matériel à l\'inventaire'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
          type="button"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Avertissement sur les états */}
        <div className="alert alert-info shadow-lg">
          <Info className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Information sur les états</h3>
            <div className="text-xs">
              <p>• Les états "En réparation", "En maintenance", "En amélioration" et "Hors service" sont gérés automatiquement par le système de réparations.</p>
              <p>• Dans ce formulaire, vous pouvez seulement définir les 4 états de base.</p>
            </div>
          </div>
        </div>

        {/* Section Informations de base */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Informations de base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nom du matériel *</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${errors.nom ? 'input-error' : 'input-primary'}`}
                  placeholder="Ex: Ordinateur portable Dell XPS 15"
                  maxLength={100}
                />
              </div>
              {errors.nom && (
                <span className="text-error text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.nom}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Référence/Numéro de série *</span>
              </label>
              <div className="relative">
                <Cpu className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${errors.reference ? 'input-error' : 'input-primary'}`}
                  placeholder="Ex: DELL-XPS15-001-2024"
                  maxLength={50}
                />
              </div>
              {errors.reference && (
                <span className="text-error text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.reference}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section État et Caractéristiques */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            État et Caractéristiques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Date d'achat *</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="date"
                  name="date_achat"
                  value={formData.date_achat}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${errors.date_achat ? 'input-error' : 'input-primary'}`}
                />
              </div>
              {errors.date_achat && (
                <span className="text-error text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.date_achat}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">État du matériel *</span>
                <div className="tooltip" data-tip="Seulement 4 états sont configurables manuellement">
                  <Info className="h-4 w-4 opacity-50" />
                </div>
              </label>
              <select
                name="etat"
                value={formData.etat}
                onChange={handleChange}
                className="select select-bordered w-full select-primary"
              >
                {etatOptions
                  .filter(option => option.showInSelect) // Seulement les états visibles
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              
              {/* Afficher l'état actuel avec badge */}
              <div className="mt-2">
                <div className={`badge gap-2 ${etatActuel.color}`}>
                  {etatActuel.icon}
                  {etatActuel.label}
                </div>
                <div className="text-xs opacity-60 mt-1">
                  {etatActuel.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Attribution */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Attribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Service attribué *</span>
              </label>
              <select
                name="service_attribue"
                value={formData.service_attribue}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.service_attribue ? 'select-error' : 'select-primary'}`}
              >
                <option value="">Sélectionner un service</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.service_attribue && (
                <span className="text-error text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.service_attribue}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Utilisateur attribué</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  name="utilisateur_attribue"
                  value={formData.utilisateur_attribue}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10 input-primary"
                  placeholder="Ex: Jean Dupont"
                  maxLength={50}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Fournisseur */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
            <Building className="h-5 w-5" />
            Fournisseur
          </h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Fournisseur</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
              <select
                name="fournisseur"
                value={formData.fournisseur}
                onChange={handleChange}
                className="select select-bordered w-full pl-10 select-primary"
              >
                <option value="">Sélectionner un fournisseur (optionnel)</option>
                {fournisseurs.map((fournisseur) => (
                  <option key={fournisseur.id} value={fournisseur.id}>
                    {fournisseur.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-base-300">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost flex-1 hover:bg-base-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
          >
            {materiel ? 'Enregistrer les modifications' : 'Ajouter le matériel'}
          </button>
        </div>

        <div className="text-xs text-base-content opacity-50 pt-2 border-t border-base-300">
          <p>* Champs obligatoires</p>
          <p>Les états étendus sont gérés automatiquement par le système de réparations</p>
        </div>
      </form>
    </div>
  );
};

export default MaterielForm;