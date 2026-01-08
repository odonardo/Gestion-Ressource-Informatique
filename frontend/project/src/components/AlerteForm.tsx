// import React, { useState, useEffect } from 'react';
// import { X, AlertTriangle, Bell, Info } from 'lucide-react';
// import { Alerte, Materiel, Logiciel, Incident, Reseau } from '../types';

// interface AlerteFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (alerteData: any) => void;
//   alerte?: Alerte;
//   materiels?: Materiel[];
//   logiciels?: Logiciel[];
//   reseaux?: Reseau[];
//   incidents?: Incident[];
// }

// const AlerteForm: React.FC<AlerteFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   alerte,
//   materiels = [],
//   logiciels = [],
//   reseaux = [],
//   incidents = []
// }) => {
//   const [formData, setFormData] = useState({
//     description: '',
//     date_alerte: new Date().toISOString().split('T')[0],
//     type_alerte: 'securite',
//     severite: 'moyenne',
//     statut: 'nouvelle',
//     materiel_source: '',
//     logiciel_source: '',
//     reseau_source: '',
//     incident_lie: ''
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (alerte) {
//       setFormData({
//         description: alerte.description || '',
//         date_alerte: alerte.date_alerte ? new Date(alerte.date_alerte).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         type_alerte: alerte.type_alerte || 'securite',
//         severite: alerte.severite || 'moyenne',
//         statut: alerte.statut || 'nouvelle',
//         materiel_source: alerte.materiel_source?.toString() || '',
//         logiciel_source: alerte.logiciel_source?.toString() || '',
//         reseau_source: alerte.reseau_source?.toString() || '',
//         incident_lie: alerte.incident_lie?.toString() || ''
//       });
//     } else {
//       setFormData({
//         description: '',
//         date_alerte: new Date().toISOString().split('T')[0],
//         type_alerte: 'securite',
//         severite: 'moyenne',
//         statut: 'nouvelle',
//         materiel_source: '',
//         logiciel_source: '',
//         reseau_source: '',
//         incident_lie: ''
//       });
//     }
//     setErrors({});
//   }, [alerte, isOpen]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.description.trim()) {
//       newErrors.description = 'La description est requise';
//     }

//     if (!formData.date_alerte) {
//       newErrors.date_alerte = 'La date d\'alerte est requise';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     // Préparer les données pour l'API selon votre backend
//     const submitData: any = {
//       description: formData.description,
//       date_alerte: formData.date_alerte,
//       type_alerte: formData.type_alerte,
//       severite: formData.severite,
//       statut: formData.statut
//     };

//     // CORRECTION : Utiliser les noms exacts de votre backend
//     // Materiel source
//     if (formData.materiel_source) {
//       submitData.materiel_source = parseInt(formData.materiel_source);
//     } else {
//       submitData.materiel_source = null; // Explicitement null si vide
//     }

//     // Logiciel source
//     if (formData.logiciel_source) {
//       submitData.logiciel_source = parseInt(formData.logiciel_source);
//     } else {
//       submitData.logiciel_source = null; // Explicitement null si vide
//     }

//     // Reseau source
//     if (formData.reseau_source) {
//       submitData.reseau_source = parseInt(formData.reseau_source);
//     } else {
//       submitData.reseau_source = null; // Explicitement null si vide
//     }

//     // Incident lié
//     if (formData.incident_lie) {
//       submitData.incident_lie = parseInt(formData.incident_lie);
//     } else {
//       submitData.incident_lie = null; // Explicitement null si vide
//     }

//     console.log('📤 Données envoyées à l\'API:', submitData);
//     onSubmit(submitData);
//   };

//   const getSeveriteIcon = (severite: string) => {
//     const icons = {
//       critique: <AlertTriangle className="h-4 w-4" />,
//       elevee: <AlertTriangle className="h-4 w-4" />,
//       moyenne: <Bell className="h-4 w-4" />,
//       basse: <Info className="h-4 w-4" />
//     };
//     return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
//   };

//   const getSeveriteBadge = (severite: string) => {
//     const badges = {
//       critique: 'badge-error',
//       elevee: 'badge-warning',
//       moyenne: 'badge-info',
//       basse: 'badge-neutral'
//     };
//     return badges[severite as keyof typeof badges] || 'badge-neutral';
//   };

//   const getSeveriteText = (severite: string) => {
//     const texts = {
//       critique: 'Critique',
//       elevee: 'Élevée',
//       moyenne: 'Moyenne',
//       basse: 'Basse'
//     };
//     return texts[severite as keyof typeof texts] || severite;
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       securite: 'Sécurité',
//       performance: 'Performance',
//       panne: 'Panne',
//       maintenance: 'Maintenance'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getStatutText = (statut: string) => {
//     const texts = {
//       nouvelle: 'Nouvelle',
//       en_traitement: 'En traitement',
//       resolue: 'Résolue'
//     };
//     return texts[statut as keyof typeof texts] || statut;
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center p-6 border-b border-base-300">
//           <h2 className="text-xl font-bold text-base-content">
//             {alerte ? 'Modifier l\'alerte' : 'Nouvelle alerte'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="btn btn-ghost btn-sm btn-circle"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Description */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Description *</span>
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
//               placeholder="Description détaillée de l'alerte..."
//               required
//             />
//             {errors.description && (
//               <label className="label">
//                 <span className="label-text-alt text-error">{errors.description}</span>
//               </label>
//             )}
//           </div>

//           {/* Informations principales */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Date d'alerte *</span>
//               </label>
//               <input
//                 type="date"
//                 name="date_alerte"
//                 value={formData.date_alerte}
//                 onChange={handleChange}
//                 className={`input input-bordered ${errors.date_alerte ? 'input-error' : ''}`}
//                 required
//               />
//               {errors.date_alerte && (
//                 <label className="label">
//                   <span className="label-text-alt text-error">{errors.date_alerte}</span>
//                 </label>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Type d'alerte *</span>
//               </label>
//               <select
//                 name="type_alerte"
//                 value={formData.type_alerte}
//                 onChange={handleChange}
//                 className="select select-bordered"
//                 required
//               >
//                 <option value="securite">Sécurité</option>
//                 <option value="performance">Performance</option>
//                 <option value="panne">Panne</option>
//                 <option value="maintenance">Maintenance</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Sévérité *</span>
//               </label>
//               <select
//                 name="severite"
//                 value={formData.severite}
//                 onChange={handleChange}
//                 className="select select-bordered"
//                 required
//               >
//                 <option value="critique">Critique</option>
//                 <option value="elevee">Élevée</option>
//                 <option value="moyenne">Moyenne</option>
//                 <option value="basse">Basse</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Statut *</span>
//               </label>
//               <select
//                 name="statut"
//                 value={formData.statut}
//                 onChange={handleChange}
//                 className="select select-bordered"
//                 required
//               >
//                 <option value="nouvelle">Nouvelle</option>
//                 <option value="en_traitement">En traitement</option>
//                 <option value="resolue">Résolue</option>
//               </select>
//             </div>
//           </div>

//           {/* Sources de l'alerte */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Matériel source</span>
//               </label>
//               <select
//                 name="materiel_source"
//                 value={formData.materiel_source}
//                 onChange={handleChange}
//                 className="select select-bordered"
//               >
//                 <option value="">Aucun matériel</option>
//                 {materiels.map((materiel) => (
//                   <option key={materiel.id} value={materiel.id.toString()}>
//                     {materiel.nom} ({materiel.reference})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Logiciel source</span>
//               </label>
//               <select
//                 name="logiciel_source"
//                 value={formData.logiciel_source}
//                 onChange={handleChange}
//                 className="select select-bordered"
//               >
//                 <option value="">Aucun logiciel</option>
//                 {logiciels.map((logiciel) => (
//                   <option key={logiciel.id} value={logiciel.id.toString()}>
//                     {logiciel.nom} ({logiciel.editeur})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Réseau source</span>
//               </label>
//               <select
//                 name="reseau_source"
//                 value={formData.reseau_source}
//                 onChange={handleChange}
//                 className="select select-bordered"
//               >
//                 <option value="">Aucun réseau</option>
//                 {reseaux.map((reseau) => (
//                   <option key={reseau.id} value={reseau.id.toString()}>
//                     {reseau.nom_hote} ({reseau.adresse_ip})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Incident lié</span>
//               </label>
//               <select
//                 name="incident_lie"
//                 value={formData.incident_lie}
//                 onChange={handleChange}
//                 className="select select-bordered"
//               >
//                 <option value="">Aucun incident</option>
//                 {incidents.map((incident) => (
//                   <option key={incident.id} value={incident.id.toString()}>
//                     Incident #{incident.id} - {incident.description?.substring(0, 50)}...
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Aperçu de l'alerte */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Aperçu</span>
//             </label>
//             <div className={`alert ${getSeveriteBadge(formData.severite)}`}>
//               <div className="flex items-center gap-3">
//                 {getSeveriteIcon(formData.severite)}
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="font-bold">{getTypeText(formData.type_alerte)}</span>
//                     <span className={`badge ${getSeveriteBadge(formData.severite)} badge-sm`}>
//                       {getSeveriteText(formData.severite)}
//                     </span>
//                     <span className="badge badge-ghost badge-sm">
//                       {getStatutText(formData.statut)}
//                     </span>
//                   </div>
//                   <div className="text-sm opacity-80">
//                     {formData.description || 'Description de l\'alerte...'}
//                   </div>
//                   {formData.date_alerte && (
//                     <div className="text-xs opacity-60 mt-1">
//                       {new Date(formData.date_alerte).toLocaleDateString('fr-FR')}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end space-x-3 pt-4 border-t border-base-300">
//             <button
//               type="button"
//               onClick={onClose}
//               className="btn btn-ghost"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary"
//             >
//               {alerte ? 'Modifier' : 'Créer'} l'alerte
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AlerteForm;




import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Bell, Info } from 'lucide-react';
import { Alerte, Materiel, Logiciel, Incident, Reseau } from '../types';

interface AlerteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (alerteData: any) => void;
  alerte?: Alerte;
  materiels?: Materiel[];
  logiciels?: Logiciel[];
  reseaux?: Reseau[];
  incidents?: Incident[];
}

const AlerteForm: React.FC<AlerteFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  alerte,
  materiels = [],
  logiciels = [],
  reseaux = [],
  incidents = []
}) => {
  const [formData, setFormData] = useState({
    description: '',
    date_alerte: new Date().toISOString().split('T')[0],
    type_alerte: 'securite',
    severite: 'moyenne',
    statut: 'nouvelle',
    materiel_source: '',
    logiciel_source: '',
    reseau_source: '',
    incident_lie: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (alerte) {
      setFormData({
        description: alerte.description || '',
        date_alerte: alerte.date_alerte ? new Date(alerte.date_alerte).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type_alerte: alerte.type_alerte || 'securite',
        severite: alerte.severite || 'moyenne',
        statut: alerte.statut || 'nouvelle',
        materiel_source: alerte.materiel_source?.toString() || '',
        logiciel_source: alerte.logiciel_source?.toString() || '',
        reseau_source: alerte.reseau_source?.toString() || '',
        incident_lie: alerte.incident_lie?.toString() || ''
      });
    } else {
      setFormData({
        description: '',
        date_alerte: new Date().toISOString().split('T')[0],
        type_alerte: 'securite',
        severite: 'moyenne',
        statut: 'nouvelle',
        materiel_source: '',
        logiciel_source: '',
        reseau_source: '',
        incident_lie: ''
      });
    }
    setErrors({});
  }, [alerte, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.date_alerte) {
      newErrors.date_alerte = 'La date d\'alerte est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Préparer les données pour l'API selon votre backend Django
    const submitData: any = {
      description: formData.description,
      date_alerte: formData.date_alerte,
      type_alerte: formData.type_alerte,
      severite: formData.severite,
      statut: formData.statut
    };

    // CORRECTION : Gestion des relations ForeignKey selon votre modèle Django
    // Ces champs attendent des IDs d'objets (entiers) ou null
    if (formData.materiel_source) {
      submitData.materiel_source = parseInt(formData.materiel_source);
    } else {
      submitData.materiel_source = null;
    }

    if (formData.logiciel_source) {
      submitData.logiciel_source = parseInt(formData.logiciel_source);
    } else {
      submitData.logiciel_source = null;
    }

    if (formData.reseau_source) {
      submitData.reseau_source = parseInt(formData.reseau_source);
    } else {
      submitData.reseau_source = null;
    }

    if (formData.incident_lie) {
      submitData.incident_lie = parseInt(formData.incident_lie);
    } else {
      submitData.incident_lie = null;
    }

    console.log('📤 Données envoyées à l\'API Django:', submitData);
    onSubmit(submitData);
  };

  const getSeveriteIcon = (severite: string) => {
    const icons = {
      critique: <AlertTriangle className="h-4 w-4" />,
      elevee: <AlertTriangle className="h-4 w-4" />,
      moyenne: <Bell className="h-4 w-4" />,
      basse: <Info className="h-4 w-4" />
    };
    return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
  };

  const getSeveriteBadge = (severite: string) => {
    const badges = {
      critique: 'badge-error',
      elevee: 'badge-warning',
      moyenne: 'badge-info',
      basse: 'badge-neutral'
    };
    return badges[severite as keyof typeof badges] || 'badge-neutral';
  };

  const getSeveriteText = (severite: string) => {
    const texts = {
      critique: 'Critique',
      elevee: 'Élevée',
      moyenne: 'Moyenne',
      basse: 'Basse'
    };
    return texts[severite as keyof typeof texts] || severite;
  };

  const getTypeText = (type: string) => {
    const texts = {
      securite: 'Sécurité',
      performance: 'Performance',
      panne: 'Panne',
      maintenance: 'Maintenance'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getStatutText = (statut: string) => {
    const texts = {
      nouvelle: 'Nouvelle',
      en_traitement: 'En traitement',
      resolue: 'Résolue'
    };
    return texts[statut as keyof typeof texts] || statut;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <h2 className="text-xl font-bold text-base-content">
            {alerte ? 'Modifier l\'alerte' : 'Nouvelle alerte'}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description *</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
              placeholder="Description détaillée de l'alerte..."
              required
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.description}</span>
              </label>
            )}
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date d'alerte *</span>
              </label>
              <input
                type="date"
                name="date_alerte"
                value={formData.date_alerte}
                onChange={handleChange}
                className={`input input-bordered ${errors.date_alerte ? 'input-error' : ''}`}
                required
              />
              {errors.date_alerte && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.date_alerte}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Type d'alerte *</span>
              </label>
              <select
                name="type_alerte"
                value={formData.type_alerte}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                <option value="securite">Sécurité</option>
                <option value="performance">Performance</option>
                <option value="panne">Panne</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Sévérité *</span>
              </label>
              <select
                name="severite"
                value={formData.severite}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                <option value="critique">Critique</option>
                <option value="elevee">Élevée</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Statut *</span>
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                <option value="nouvelle">Nouvelle</option>
                <option value="en_traitement">En traitement</option>
                <option value="resolue">Résolue</option>
              </select>
            </div>
          </div>

          {/* Sources de l'alerte - CORRESPOND À VOTRE MODÈLE DJANGO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Matériel source</span>
              </label>
              <select
                name="materiel_source"
                value={formData.materiel_source}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="">Aucun matériel</option>
                {materiels.map((materiel) => (
                  <option key={materiel.id} value={materiel.id.toString()}>
                    {materiel.nom} ({materiel.reference})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Logiciel source</span>
              </label>
              <select
                name="logiciel_source"
                value={formData.logiciel_source}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="">Aucun logiciel</option>
                {logiciels.map((logiciel) => (
                  <option key={logiciel.id} value={logiciel.id.toString()}>
                    {logiciel.nom} ({logiciel.editeur})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Réseau source</span>
              </label>
              <select
                name="reseau_source"
                value={formData.reseau_source}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="">Aucun réseau</option>
                {reseaux.map((reseau) => (
                  <option key={reseau.id} value={reseau.id.toString()}>
                    {reseau.nom_hote} ({reseau.adresse_ip})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Incident lié */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Incident lié</span>
            </label>
            <select
              name="incident_lie"
              value={formData.incident_lie}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="">Aucun incident</option>
              {incidents.map((incident) => (
                <option key={incident.id} value={incident.id.toString()}>
                  Incident #{incident.id} - {incident.description?.substring(0, 50)}...
                </option>
              ))}
            </select>
          </div>

          {/* Aperçu de l'alerte */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Aperçu</span>
            </label>
            <div className={`alert ${getSeveriteBadge(formData.severite)}`}>
              <div className="flex items-center gap-3">
                {getSeveriteIcon(formData.severite)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{getTypeText(formData.type_alerte)}</span>
                    <span className={`badge ${getSeveriteBadge(formData.severite)} badge-sm`}>
                      {getSeveriteText(formData.severite)}
                    </span>
                    <span className="badge badge-ghost badge-sm">
                      {getStatutText(formData.statut)}
                    </span>
                  </div>
                  <div className="text-sm opacity-80">
                    {formData.description || 'Description de l\'alerte...'}
                  </div>
                  {formData.date_alerte && (
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(formData.date_alerte).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-base-300">
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
              {alerte ? 'Modifier' : 'Créer'} l'alerte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlerteForm;