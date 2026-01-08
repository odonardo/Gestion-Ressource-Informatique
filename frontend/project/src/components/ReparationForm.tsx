// import React, { useState, useEffect } from 'react';
// import { X, Wrench, Calendar, Clock, DollarSign, Package, AlertTriangle } from 'lucide-react';
// import { Reparation } from '../types';

// interface ReparationFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (reparationData: Omit<Reparation, 'id' | 'materiel_nom'>) => void;
//   reparation?: Reparation;
// }

// const ReparationForm: React.FC<ReparationFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   reparation
// }) => {
//   const [formData, setFormData] = useState({
//     description: '',
//     date_fin: '',
//     heure_fin: '',
//     type_reparation: '' as '' | 'preventive' | 'corrective' | 'ameliorative',
//     cout: 0,
//     materiel: 0,
//     incident: 0
//   });

//   const [showHeurePicker, setShowHeurePicker] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Heures prédéfinies
//   const heuresPredefinies = [
//     { value: '00:00', label: 'Minuit' },
//     { value: '06:00', label: '6:00' },
//     { value: '12:00', label: 'Midi' },
//     { value: '18:00', label: '18:00' }
//   ];

//   useEffect(() => {
//     if (reparation) {
//       let dateFin = '';
//       let heureFin = '';

//       if (reparation.date_fin) {
//         const dateObj = new Date(reparation.date_fin);
//         dateFin = dateObj.toISOString().split('T')[0];
//         heureFin = dateObj.toTimeString().slice(0, 5);
//       }

//       setFormData({
//         description: reparation.description || '',
//         date_fin: dateFin,
//         heure_fin: heureFin,
//         type_reparation: reparation.type_reparation || '',
//         cout: reparation.cout || 0,
//         materiel: reparation.materiel || 0,
//         incident: reparation.incident || 0
//       });
//     } else {
//       const now = new Date();
//       const today = now.toISOString().split('T')[0];
//       const currentTime = now.toTimeString().slice(0, 5);
      
//       setFormData({
//         description: '',
//         date_fin: today,
//         heure_fin: currentTime,
//         type_reparation: '',
//         cout: 0,
//         materiel: 0,
//         incident: 0
//       });
//     }
//     setErrors({});
//   }, [reparation, isOpen]);

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.description.trim()) {
//       newErrors.description = 'La description de la réparation est requise';
//     }
//     if (!formData.type_reparation) {
//       newErrors.type_reparation = 'Le type de réparation est requis';
//     }
//     if (formData.cout < 0) {
//       newErrors.cout = 'Le coût ne peut pas être négatif';
//     }
//     // Validation du format d'heure
//     if (formData.heure_fin && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.heure_fin)) {
//       newErrors.heure_fin = 'Format d\'heure invalide (HH:MM)';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'cout' ? parseFloat(value) || 0 : 
//               ['materiel', 'incident'].includes(name) ? parseInt(value) || 0 : value
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleHeureSelection = (heure: string) => {
//     setFormData(prev => ({
//       ...prev,
//       heure_fin: heure
//     }));
//     setShowHeurePicker(false);
//   };

//   const handleMaintenant = () => {
//     const now = new Date();
//     const currentTime = now.toTimeString().slice(0, 5);
//     setFormData(prev => ({
//       ...prev,
//       heure_fin: currentTime
//     }));
//     setShowHeurePicker(false);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       let reparationData;
//       if (formData.date_fin && formData.heure_fin) {
//         const dateTimeString = `${formData.date_fin}T${formData.heure_fin}`;
//         reparationData = {
//           ...formData,
//           date_fin: dateTimeString
//         };
//       } else {
//         reparationData = formData;
//       }

//       onSubmit(reparationData);
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       description: '',
//       date_fin: '',
//       heure_fin: '',
//       type_reparation: '',
//       cout: 0,
//       materiel: 0,
//       incident: 0
//     });
//     setErrors({});
//     setShowHeurePicker(false);
//     onClose();
//   };

//   const getTypeReparationIcon = (type: string) => {
//     switch (type) {
//       case 'preventive': return <Wrench className="h-4 w-4 text-blue-500" />;
//       case 'corrective': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
//       case 'ameliorative': return <Package className="h-4 w-4 text-green-500" />;
//       default: return <Wrench className="h-4 w-4" />;
//     }
//   };

//   const getTypeReparationText = (type: string) => {
//     switch (type) {
//       case 'preventive': return 'Préventive';
//       case 'corrective': return 'Corrective';
//       case 'ameliorative': return 'Améliorative';
//       default: return type;
//     }
//   };

//   const ServerTimeInfo = () => (
//     <div className="alert alert-info alert-sm">
//       <InfoIcon className="h-4 w-4" />
//       <div>
//         <span className="text-sm">Note : l'heure du serveur précède votre heure de 2 heures.</span>
//       </div>
//     </div>
//   );

//   const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center p-6 border-b border-base-300">
//           <h2 className="text-xl font-bold text-base-content">
//             {reparation ? 'Modifier la réparation' : 'Ajouter une Réparation'}
//           </h2>
//           <button
//             onClick={handleClose}
//             className="btn btn-ghost btn-sm btn-circle"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* Description */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Description :</span>
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
//               placeholder="Description détaillée de la réparation effectuée..."
//               required
//             />
//             {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
//           </div>

//           {/* Date et Heure de fin */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Date fin :</span>
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Date */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Date :</span>
//                 </label>
//                 <div className="flex items-center gap-3">
//                   <div className="relative flex-1">
//                     <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                     <input
//                       type="date"
//                       name="date_fin"
//                       value={formData.date_fin}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10"
//                     />
//                   </div>
//                   <div className="badge badge-outline">Aujourd'hui</div>
//                 </div>
//               </div>

//               {/* Heure - Champ texte modifiable */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Heure :</span>
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <div className="relative flex-1">
//                     <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                     <input
//                       type="text"
//                       name="heure_fin"
//                       value={formData.heure_fin}
//                       onChange={handleChange}
//                       className={`input input-bordered w-full pl-10 ${errors.heure_fin ? 'input-error' : ''}`}
//                       placeholder="HH:MM (ex: 14:30)"
//                       maxLength={5}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => setShowHeurePicker(true)}
//                     className="btn btn-outline btn-sm"
//                     title="Choisir une heure prédéfinie"
//                   >
//                     <Clock className="h-4 w-4" />
//                   </button>
//                   <div className="badge badge-outline">Maintenant</div>
//                 </div>
//                 {errors.heure_fin && (
//                   <span className="text-error text-sm mt-1">{errors.heure_fin}</span>
//                 )}
//                 <div className="text-xs text-base-content opacity-50 mt-1">
//                   Format: HH:MM (24h)
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Information heure serveur */}
//           <ServerTimeInfo />

//           {/* Type réparation et Coût */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Type reparation :</span>
//               </label>
//               <select
//                 name="type_reparation"
//                 value={formData.type_reparation}
//                 onChange={handleChange}
//                 className={`select select-bordered w-full ${errors.type_reparation ? 'select-error' : ''}`}
//                 required
//               >
//                 <option value="">---------</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
//               {errors.type_reparation && <span className="text-error text-sm mt-1">{errors.type_reparation}</span>}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Cout :</span>
//               </label>
//               <div className="relative">
//                 <DollarSign className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="number"
//                   name="cout"
//                   value={formData.cout}
//                   onChange={handleChange}
//                   className={`input input-bordered w-full pl-10 ${errors.cout ? 'input-error' : ''}`}
//                   placeholder="0.00"
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//               {errors.cout && <span className="text-error text-sm mt-1">{errors.cout}</span>}
//             </div>
//           </div>

//           {/* Relations */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Materiel :</span>
//               </label>
//               <select
//                 name="materiel"
//                 value={formData.materiel}
//                 onChange={handleChange}
//                 className="select select-bordered w-full"
//               >
//                 <option value={0}>---------</option>
//                 <option value={1}>Ordinateur Portable Dell - Ref: DELL-001</option>
//                 <option value={2}>Imprimante HP LaserJet - Ref: HP-LJ-002</option>
//                 <option value={3}>Serveur Principal - Ref: SRV-MAIN-001</option>
//                 <option value={4}>Écran 24" Samsung - Ref: SAM-24-003</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Incident :</span>
//               </label>
//               <select
//                 name="incident"
//                 value={formData.incident}
//                 onChange={handleChange}
//                 className="select select-bordered w-full"
//               >
//                 <option value={0}>---------</option>
//                 <option value={1}>Incident #001 - Panne écran</option>
//                 <option value={2}>Incident #002 - Imprimante en erreur</option>
//                 <option value={3}>Incident #003 - Serveur lent</option>
//                 <option value={4}>Incident #004 - Logiciel crash</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="btn btn-ghost"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary"
//             >
//               {reparation ? 'Modifier' : 'Créer'} la réparation
//             </button>
//           </div>
//         </form>

//         {/* Modal de sélection d'heure */}
//         {showHeurePicker && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
//             <div className="bg-base-100 rounded-lg w-full max-w-sm p-6">
//               <h3 className="font-bold text-lg mb-4">Choisir une heure</h3>
//               <div className="space-y-2">
//                 <button
//                   onClick={handleMaintenant}
//                   className="btn btn-outline w-full justify-start"
//                 >
//                   <Clock className="h-4 w-4 mr-2" />
//                   Maintenant
//                 </button>
//                 {heuresPredefinies.map((heure) => (
//                   <button
//                     key={heure.value}
//                     onClick={() => handleHeureSelection(heure.value)}
//                     className="btn btn-ghost w-full justify-start"
//                   >
//                     {heure.label}
//                   </button>
//                 ))}
//               </div>
//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={() => setShowHeurePicker(false)}
//                   className="btn btn-ghost"
//                 >
//                   Annuler
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReparationForm;




import React, { useState, useEffect } from 'react';
import { X, Wrench, Calendar, Clock, DollarSign, Package, AlertTriangle, User } from 'lucide-react';
import { Reparation } from '../types';

interface ReparationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reparationData: Omit<Reparation, 'id' | 'materiel_nom'>) => void;
  reparation?: Reparation;
  materiels?: any[]; // AJOUT: Données des matériels depuis l'API
  incidents?: any[]; // AJOUT: Données des incidents depuis l'API
}

const ReparationForm: React.FC<ReparationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reparation,
  materiels = [], // AJOUT: Valeur par défaut
  incidents = []  // AJOUT: Valeur par défaut
}) => {
  const [formData, setFormData] = useState({
    description: '',
    date_fin: '',
    heure_fin: '',
    type_reparation: '' as '' | 'preventive' | 'corrective' | 'ameliorative',
    cout: 0,
    materiel: 0,
    incident: 0,
    technicien_responsable: '' // AJOUT: Champ technicien responsable
  });

  const [showHeurePicker, setShowHeurePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Heures prédéfinies
  const heuresPredefinies = [
    { value: '00:00', label: 'Minuit' },
    { value: '06:00', label: '6:00' },
    { value: '12:00', label: 'Midi' },
    { value: '18:00', label: '18:00' }
  ];

  // AJOUT: Liste des techniciens
  const techniciens = [
    { id: 1, nom: 'Jean Dupont', specialite: 'Informatique' },
    { id: 2, nom: 'Marie Martin', specialite: 'Réseaux' },
    { id: 3, nom: 'Pierre Durand', specialite: 'Électronique' },
    { id: 4, nom: 'Sophie Laurent', specialite: 'Systèmes' },
    { id: 5, nom: 'Thomas Moreau', specialite: 'Maintenance' }
  ];

  useEffect(() => {
    if (reparation) {
      let dateFin = '';
      let heureFin = '';

      if (reparation.date_fin) {
        const dateObj = new Date(reparation.date_fin);
        dateFin = dateObj.toISOString().split('T')[0];
        heureFin = dateObj.toTimeString().slice(0, 5);
      }

      setFormData({
        description: reparation.description || '',
        date_fin: dateFin,
        heure_fin: heureFin,
        type_reparation: reparation.type_reparation || '',
        cout: reparation.cout || 0,
        materiel: reparation.materiel || 0,
        incident: reparation.incident || 0,
        technicien_responsable: reparation.technicien_responsable || '' // AJOUT: Initialisation
      });
    } else {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);
      
      setFormData({
        description: '',
        date_fin: today,
        heure_fin: currentTime,
        type_reparation: '',
        cout: 0,
        materiel: 0,
        incident: 0,
        technicien_responsable: '' // AJOUT: Initialisation vide
      });
    }
    setErrors({});
  }, [reparation, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La description de la réparation est requise';
    }
    if (!formData.type_reparation) {
      newErrors.type_reparation = 'Le type de réparation est requis';
    }
    if (formData.cout < 0) {
      newErrors.cout = 'Le coût ne peut pas être négatif';
    }
    // Validation du format d'heure
    if (formData.heure_fin && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.heure_fin)) {
      newErrors.heure_fin = 'Format d\'heure invalide (HH:MM)';
    }
    // AJOUT: Validation technicien responsable
    if (!formData.technicien_responsable.trim()) {
      newErrors.technicien_responsable = 'Le technicien responsable est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cout' ? parseFloat(value) || 0 : 
              ['materiel', 'incident'].includes(name) ? parseInt(value) || 0 : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleHeureSelection = (heure: string) => {
    setFormData(prev => ({
      ...prev,
      heure_fin: heure
    }));
    setShowHeurePicker(false);
  };

  const handleMaintenant = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    setFormData(prev => ({
      ...prev,
      heure_fin: currentTime
    }));
    setShowHeurePicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      let reparationData;
      if (formData.date_fin && formData.heure_fin) {
        const dateTimeString = `${formData.date_fin}T${formData.heure_fin}`;
        reparationData = {
          ...formData,
          date_fin: dateTimeString
        };
      } else {
        reparationData = formData;
      }

      onSubmit(reparationData);
    }
  };

  const handleClose = () => {
    setFormData({
      description: '',
      date_fin: '',
      heure_fin: '',
      type_reparation: '',
      cout: 0,
      materiel: 0,
      incident: 0,
      technicien_responsable: '' // AJOUT: Reset
    });
    setErrors({});
    setShowHeurePicker(false);
    onClose();
  };

  const getTypeReparationIcon = (type: string) => {
    switch (type) {
      case 'preventive': return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'corrective': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'ameliorative': return <Package className="h-4 w-4 text-green-500" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const getTypeReparationText = (type: string) => {
    switch (type) {
      case 'preventive': return 'Préventive';
      case 'corrective': return 'Corrective';
      case 'ameliorative': return 'Améliorative';
      default: return type;
    }
  };

  const ServerTimeInfo = () => (
    <div className="alert alert-info alert-sm">
      <InfoIcon className="h-4 w-4" />
      <div>
        <span className="text-sm">Note : l'heure du serveur précède votre heure de 2 heures.</span>
      </div>
    </div>
  );

  const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <h2 className="text-xl font-bold text-base-content">
            {reparation ? 'Modifier la réparation' : 'Ajouter une Réparation'}
          </h2>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description :</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
              placeholder="Description détaillée de la réparation effectuée..."
              required
            />
            {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
          </div>

          {/* AJOUT: Technicien responsable */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Technicien responsable :</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
              <select
                name="technicien_responsable"
                value={formData.technicien_responsable}
                onChange={handleChange}
                className={`select select-bordered w-full pl-10 ${errors.technicien_responsable ? 'select-error' : ''}`}
                required
              >
                <option value="">Sélectionnez un technicien...</option>
                {techniciens.map((technicien) => (
                  <option key={technicien.id} value={technicien.nom}>
                    {technicien.nom} - {technicien.specialite}
                  </option>
                ))}
              </select>
            </div>
            {errors.technicien_responsable && (
              <span className="text-error text-sm mt-1">{errors.technicien_responsable}</span>
            )}
          </div>

          {/* Date et Heure de fin */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date fin :</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date :</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                    <input
                      type="date"
                      name="date_fin"
                      value={formData.date_fin}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-10"
                    />
                  </div>
                  <div className="badge badge-outline">Aujourd'hui</div>
                </div>
              </div>

              {/* Heure - Champ texte modifiable */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Heure :</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                    <input
                      type="text"
                      name="heure_fin"
                      value={formData.heure_fin}
                      onChange={handleChange}
                      className={`input input-bordered w-full pl-10 ${errors.heure_fin ? 'input-error' : ''}`}
                      placeholder="HH:MM (ex: 14:30)"
                      maxLength={5}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHeurePicker(true)}
                    className="btn btn-outline btn-sm"
                    title="Choisir une heure prédéfinie"
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                  <div className="badge badge-outline">Maintenant</div>
                </div>
                {errors.heure_fin && (
                  <span className="text-error text-sm mt-1">{errors.heure_fin}</span>
                )}
                <div className="text-xs text-base-content opacity-50 mt-1">
                  Format: HH:MM (24h)
                </div>
              </div>
            </div>
          </div>

          {/* Information heure serveur */}
          <ServerTimeInfo />

          {/* Type réparation et Coût */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type reparation :</span>
              </label>
              <select
                name="type_reparation"
                value={formData.type_reparation}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.type_reparation ? 'select-error' : ''}`}
                required
              >
                <option value="">---------</option>
                <option value="preventive">Préventive</option>
                <option value="corrective">Corrective</option>
                <option value="ameliorative">Améliorative</option>
              </select>
              {errors.type_reparation && <span className="text-error text-sm mt-1">{errors.type_reparation}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Cout :</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="number"
                  name="cout"
                  value={formData.cout}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${errors.cout ? 'input-error' : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.cout && <span className="text-error text-sm mt-1">{errors.cout}</span>}
            </div>
          </div>

          {/* Relations - CORRECTION: Utilisation des données API */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Materiel :</span>
              </label>
              <select
                name="materiel"
                value={formData.materiel}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value={0}>---------</option>
                {materiels.map((materiel) => (
                  <option key={materiel.id} value={materiel.id}>
                    {materiel.nom || materiel.libelle} - {materiel.reference || `Ref: ${materiel.id}`}
                  </option>
                ))}
              </select>
              {materiels.length === 0 && (
                <div className="text-warning text-xs mt-1">
                  ⚠️ Aucun matériel disponible
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Incident :</span>
              </label>
              <select
                name="incident"
                value={formData.incident}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value={0}>---------</option>
                {incidents.map((incident) => (
                  <option key={incident.id} value={incident.id}>
                    Incident #{incident.id} - {incident.description?.substring(0, 50)}...
                  </option>
                ))}
              </select>
              {incidents.length === 0 && (
                <div className="text-warning text-xs mt-1">
                  ⚠️ Aucun incident disponible
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {reparation ? 'Modifier' : 'Créer'} la réparation
            </button>
          </div>
        </form>

        {/* Modal de sélection d'heure */}
        {showHeurePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-base-100 rounded-lg w-full max-w-sm p-6">
              <h3 className="font-bold text-lg mb-4">Choisir une heure</h3>
              <div className="space-y-2">
                <button
                  onClick={handleMaintenant}
                  className="btn btn-outline w-full justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Maintenant
                </button>
                {heuresPredefinies.map((heure) => (
                  <button
                    key={heure.value}
                    onClick={() => handleHeureSelection(heure.value)}
                    className="btn btn-ghost w-full justify-start"
                  >
                    {heure.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowHeurePicker(false)}
                  className="btn btn-ghost"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReparationForm;