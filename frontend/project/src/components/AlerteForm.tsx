// // import React, { useState, useEffect } from 'react';
// // import { X, AlertTriangle, Bell, Info } from 'lucide-react';
// // import { Alerte, Materiel, Logiciel, Incident, Reseau } from '../types';

// // interface AlerteFormProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   onSubmit: (alerteData: any) => void;
// //   alerte?: Alerte;
// //   materiels?: Materiel[];
// //   logiciels?: Logiciel[];
// //   reseaux?: Reseau[];
// //   incidents?: Incident[];
// // }

// // const AlerteForm: React.FC<AlerteFormProps> = ({
// //   isOpen,
// //   onClose,
// //   onSubmit,
// //   alerte,
// //   materiels = [],
// //   logiciels = [],
// //   reseaux = [],
// //   incidents = []
// // }) => {
// //   const [formData, setFormData] = useState({
// //     description: '',
// //     date_alerte: new Date().toISOString().split('T')[0],
// //     type_alerte: 'securite',
// //     severite: 'moyenne',
// //     statut: 'nouvelle',
// //     materiel_source: '',
// //     logiciel_source: '',
// //     reseau_source: '',
// //     incident_lie: ''
// //   });

// //   const [errors, setErrors] = useState<Record<string, string>>({});

// //   useEffect(() => {
// //     if (alerte) {
// //       setFormData({
// //         description: alerte.description || '',
// //         date_alerte: alerte.date_alerte ? new Date(alerte.date_alerte).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
// //         type_alerte: alerte.type_alerte || 'securite',
// //         severite: alerte.severite || 'moyenne',
// //         statut: alerte.statut || 'nouvelle',
// //         materiel_source: alerte.materiel_source?.toString() || '',
// //         logiciel_source: alerte.logiciel_source?.toString() || '',
// //         reseau_source: alerte.reseau_source?.toString() || '',
// //         incident_lie: alerte.incident_lie?.toString() || ''
// //       });
// //     } else {
// //       setFormData({
// //         description: '',
// //         date_alerte: new Date().toISOString().split('T')[0],
// //         type_alerte: 'securite',
// //         severite: 'moyenne',
// //         statut: 'nouvelle',
// //         materiel_source: '',
// //         logiciel_source: '',
// //         reseau_source: '',
// //         incident_lie: ''
// //       });
// //     }
// //     setErrors({});
// //   }, [alerte, isOpen]);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));

// //     // Clear error when user starts typing
// //     if (errors[name]) {
// //       setErrors(prev => ({
// //         ...prev,
// //         [name]: ''
// //       }));
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors: Record<string, string> = {};

// //     if (!formData.description.trim()) {
// //       newErrors.description = 'La description est requise';
// //     }

// //     if (!formData.date_alerte) {
// //       newErrors.date_alerte = 'La date d\'alerte est requise';
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     if (!validateForm()) {
// //       return;
// //     }

// //     // Préparer les données pour l'API selon votre backend
// //     const submitData: any = {
// //       description: formData.description,
// //       date_alerte: formData.date_alerte,
// //       type_alerte: formData.type_alerte,
// //       severite: formData.severite,
// //       statut: formData.statut
// //     };

// //     // CORRECTION : Utiliser les noms exacts de votre backend
// //     // Materiel source
// //     if (formData.materiel_source) {
// //       submitData.materiel_source = parseInt(formData.materiel_source);
// //     } else {
// //       submitData.materiel_source = null; // Explicitement null si vide
// //     }

// //     // Logiciel source
// //     if (formData.logiciel_source) {
// //       submitData.logiciel_source = parseInt(formData.logiciel_source);
// //     } else {
// //       submitData.logiciel_source = null; // Explicitement null si vide
// //     }

// //     // Reseau source
// //     if (formData.reseau_source) {
// //       submitData.reseau_source = parseInt(formData.reseau_source);
// //     } else {
// //       submitData.reseau_source = null; // Explicitement null si vide
// //     }

// //     // Incident lié
// //     if (formData.incident_lie) {
// //       submitData.incident_lie = parseInt(formData.incident_lie);
// //     } else {
// //       submitData.incident_lie = null; // Explicitement null si vide
// //     }

// //     console.log('📤 Données envoyées à l\'API:', submitData);
// //     onSubmit(submitData);
// //   };

// //   const getSeveriteIcon = (severite: string) => {
// //     const icons = {
// //       critique: <AlertTriangle className="h-4 w-4" />,
// //       elevee: <AlertTriangle className="h-4 w-4" />,
// //       moyenne: <Bell className="h-4 w-4" />,
// //       basse: <Info className="h-4 w-4" />
// //     };
// //     return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
// //   };

// //   const getSeveriteBadge = (severite: string) => {
// //     const badges = {
// //       critique: 'badge-error',
// //       elevee: 'badge-warning',
// //       moyenne: 'badge-info',
// //       basse: 'badge-neutral'
// //     };
// //     return badges[severite as keyof typeof badges] || 'badge-neutral';
// //   };

// //   const getSeveriteText = (severite: string) => {
// //     const texts = {
// //       critique: 'Critique',
// //       elevee: 'Élevée',
// //       moyenne: 'Moyenne',
// //       basse: 'Basse'
// //     };
// //     return texts[severite as keyof typeof texts] || severite;
// //   };

// //   const getTypeText = (type: string) => {
// //     const texts = {
// //       securite: 'Sécurité',
// //       performance: 'Performance',
// //       panne: 'Panne',
// //       maintenance: 'Maintenance'
// //     };
// //     return texts[type as keyof typeof texts] || type;
// //   };

// //   const getStatutText = (statut: string) => {
// //     const texts = {
// //       nouvelle: 'Nouvelle',
// //       en_traitement: 'En traitement',
// //       resolue: 'Résolue'
// //     };
// //     return texts[statut as keyof typeof texts] || statut;
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// //         <div className="flex justify-between items-center p-6 border-b border-base-300">
// //           <h2 className="text-xl font-bold text-base-content">
// //             {alerte ? 'Modifier l\'alerte' : 'Nouvelle alerte'}
// //           </h2>
// //           <button
// //             onClick={onClose}
// //             className="btn btn-ghost btn-sm btn-circle"
// //           >
// //             <X className="h-4 w-4" />
// //           </button>
// //         </div>

// //         <form onSubmit={handleSubmit} className="p-6 space-y-6">
// //           {/* Description */}
// //           <div className="form-control">
// //             <label className="label">
// //               <span className="label-text">Description *</span>
// //             </label>
// //             <textarea
// //               name="description"
// //               value={formData.description}
// //               onChange={handleChange}
// //               className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
// //               placeholder="Description détaillée de l'alerte..."
// //               required
// //             />
// //             {errors.description && (
// //               <label className="label">
// //                 <span className="label-text-alt text-error">{errors.description}</span>
// //               </label>
// //             )}
// //           </div>

// //           {/* Informations principales */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Date d'alerte *</span>
// //               </label>
// //               <input
// //                 type="date"
// //                 name="date_alerte"
// //                 value={formData.date_alerte}
// //                 onChange={handleChange}
// //                 className={`input input-bordered ${errors.date_alerte ? 'input-error' : ''}`}
// //                 required
// //               />
// //               {errors.date_alerte && (
// //                 <label className="label">
// //                   <span className="label-text-alt text-error">{errors.date_alerte}</span>
// //                 </label>
// //               )}
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Type d'alerte *</span>
// //               </label>
// //               <select
// //                 name="type_alerte"
// //                 value={formData.type_alerte}
// //                 onChange={handleChange}
// //                 className="select select-bordered"
// //                 required
// //               >
// //                 <option value="securite">Sécurité</option>
// //                 <option value="performance">Performance</option>
// //                 <option value="panne">Panne</option>
// //                 <option value="maintenance">Maintenance</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Sévérité *</span>
// //               </label>
// //               <select
// //                 name="severite"
// //                 value={formData.severite}
// //                 onChange={handleChange}
// //                 className="select select-bordered"
// //                 required
// //               >
// //                 <option value="critique">Critique</option>
// //                 <option value="elevee">Élevée</option>
// //                 <option value="moyenne">Moyenne</option>
// //                 <option value="basse">Basse</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Statut *</span>
// //               </label>
// //               <select
// //                 name="statut"
// //                 value={formData.statut}
// //                 onChange={handleChange}
// //                 className="select select-bordered"
// //                 required
// //               >
// //                 <option value="nouvelle">Nouvelle</option>
// //                 <option value="en_traitement">En traitement</option>
// //                 <option value="resolue">Résolue</option>
// //               </select>
// //             </div>
// //           </div>

// //           {/* Sources de l'alerte */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Matériel source</span>
// //               </label>
// //               <select
// //                 name="materiel_source"
// //                 value={formData.materiel_source}
// //                 onChange={handleChange}
// //                 className="select select-bordered"
// //               >
// //                 <option value="">Aucun matériel</option>
// //                 {materiels.map((materiel) => (
// //                   <option key={materiel.id} value={materiel.id.toString()}>
// //                     {materiel.nom} ({materiel.reference})
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Logiciel source</span>
// //               </label>
// //               <select
// //                 name="logiciel_source"
// //                 value={formData.logiciel_source}
// //                 onChange={handleChange}
// //                 className="select select-bordered"
// //               >
// //                 <option value="">Aucun logiciel</option>
// //                 {logiciels.map((logiciel) => (
// //                   <option key={logiciel.id} value={logiciel.id.toString()}>
// //                     {logiciel.nom} ({logiciel.editeur})
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Réseau source</span>
// //               </label>
// //               <select
// //                 name="reseau_source"
// //                 value={formData.reseau_source}
// //                 onChange={handleChange}
// //                 className="select select-bordered"
// //               >
// //                 <option value="">Aucun réseau</option>
// //                 {reseaux.map((reseau) => (
// //                   <option key={reseau.id} value={reseau.id.toString()}>
// //                     {reseau.nom_hote} ({reseau.adresse_ip})
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Incident lié</span>
// //               </label>
// //               <select
// //                 name="incident_lie"
// //                 value={formData.incident_lie}
// //                 onChange={handleChange}
// //                 className="select select-bordered"
// //               >
// //                 <option value="">Aucun incident</option>
// //                 {incidents.map((incident) => (
// //                   <option key={incident.id} value={incident.id.toString()}>
// //                     Incident #{incident.id} - {incident.description?.substring(0, 50)}...
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           {/* Aperçu de l'alerte */}
// //           <div className="form-control">
// //             <label className="label">
// //               <span className="label-text">Aperçu</span>
// //             </label>
// //             <div className={`alert ${getSeveriteBadge(formData.severite)}`}>
// //               <div className="flex items-center gap-3">
// //                 {getSeveriteIcon(formData.severite)}
// //                 <div className="flex-1">
// //                   <div className="flex items-center gap-2 mb-1">
// //                     <span className="font-bold">{getTypeText(formData.type_alerte)}</span>
// //                     <span className={`badge ${getSeveriteBadge(formData.severite)} badge-sm`}>
// //                       {getSeveriteText(formData.severite)}
// //                     </span>
// //                     <span className="badge badge-ghost badge-sm">
// //                       {getStatutText(formData.statut)}
// //                     </span>
// //                   </div>
// //                   <div className="text-sm opacity-80">
// //                     {formData.description || 'Description de l\'alerte...'}
// //                   </div>
// //                   {formData.date_alerte && (
// //                     <div className="text-xs opacity-60 mt-1">
// //                       {new Date(formData.date_alerte).toLocaleDateString('fr-FR')}
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Actions */}
// //           <div className="flex justify-end space-x-3 pt-4 border-t border-base-300">
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               className="btn btn-ghost"
// //             >
// //               Annuler
// //             </button>
// //             <button
// //               type="submit"
// //               className="btn btn-primary"
// //             >
// //               {alerte ? 'Modifier' : 'Créer'} l'alerte
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AlerteForm;




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

//     // Préparer les données pour l'API selon votre backend Django
//     const submitData: any = {
//       description: formData.description,
//       date_alerte: formData.date_alerte,
//       type_alerte: formData.type_alerte,
//       severite: formData.severite,
//       statut: formData.statut
//     };

//     // CORRECTION : Gestion des relations ForeignKey selon votre modèle Django
//     // Ces champs attendent des IDs d'objets (entiers) ou null
//     if (formData.materiel_source) {
//       submitData.materiel_source = parseInt(formData.materiel_source);
//     } else {
//       submitData.materiel_source = null;
//     }

//     if (formData.logiciel_source) {
//       submitData.logiciel_source = parseInt(formData.logiciel_source);
//     } else {
//       submitData.logiciel_source = null;
//     }

//     if (formData.reseau_source) {
//       submitData.reseau_source = parseInt(formData.reseau_source);
//     } else {
//       submitData.reseau_source = null;
//     }

//     if (formData.incident_lie) {
//       submitData.incident_lie = parseInt(formData.incident_lie);
//     } else {
//       submitData.incident_lie = null;
//     }

//     console.log('📤 Données envoyées à l\'API Django:', submitData);
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

//           {/* Sources de l'alerte - CORRESPOND À VOTRE MODÈLE DJANGO */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
//           </div>

//           {/* Incident lié */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Incident lié</span>
//             </label>
//             <select
//               name="incident_lie"
//               value={formData.incident_lie}
//               onChange={handleChange}
//               className="select select-bordered"
//             >
//               <option value="">Aucun incident</option>
//               {incidents.map((incident) => (
//                 <option key={incident.id} value={incident.id.toString()}>
//                   Incident #{incident.id} - {incident.description?.substring(0, 50)}...
//                 </option>
//               ))}
//             </select>
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





// // src/components/AlerteForm.jsx - VERSION SANS LOGICIEL ET RÉSEAU
// import React, { useState, useEffect } from 'react';
// import { X, AlertTriangle, Bell, Info } from 'lucide-react';
// import { Alerte, Materiel, Incident } from '../types';

// interface AlerteFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (alerteData: any) => void;
//   alerte?: Alerte;
//   materiels?: Materiel[];
//   incidents?: Incident[];
// }

// const AlerteForm: React.FC<AlerteFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   alerte,
//   materiels = [],
//   incidents = []
// }) => {
//   const [formData, setFormData] = useState({
//     description: '',
//     date_alerte: new Date().toISOString().split('T')[0],
//     type_alerte: 'securite',
//     severite: 'moyenne',
//     statut: 'nouvelle',
//     materiel_source: '',
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

//     const submitData: any = {
//       description: formData.description,
//       date_alerte: formData.date_alerte,
//       type_alerte: formData.type_alerte,
//       severite: formData.severite,
//       statut: formData.statut
//     };

//     // Gestion des relations ForeignKey
//     if (formData.materiel_source) {
//       submitData.materiel_source = parseInt(formData.materiel_source);
//     } else {
//       submitData.materiel_source = null;
//     }

//     if (formData.incident_lie) {
//       submitData.incident_lie = parseInt(formData.incident_lie);
//     } else {
//       submitData.incident_lie = null;
//     }

//     console.log('📤 Données envoyées à l\'API Django:', submitData);
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













// AlerteForm.tsx - Version avec API matériels en panne
import React, { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle, Bell, Info, Wrench, Cpu, BatteryWarning, Loader2 } from 'lucide-react';
import { Alerte, Materiel } from '../types';
import { materielsPanneAPI, handleApiError } from '../services/api'; // Importez l'API


interface AlerteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (alerteData: any) => void;
  alerte?: Alerte;
  materielSourceId?: number; // ID du matériel source (optionnel)
}

const AlerteForm: React.FC<AlerteFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  alerte,
  materielSourceId
}) => {
  // États du formulaire
  const [formData, setFormData] = useState({
    description: '',
    date_alerte: new Date().toISOString().split('T')[0],
    type_alerte: 'panne',
    severite: 'moyenne',
    statut: 'nouvelle',
    materiel_source: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showNoPanneMessage, setShowNoPanneMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Références pour éviter les rechargements
  const dataLoadedRef = useRef(false);
  const isOpenRef = useRef(false);

  // Fonction pour charger les matériels en panne
  const fetchMaterielsEnPanne = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      console.log('🔄 Chargement des matériels en panne pour alerte...');
      const materielsEnPanne = await materielsPanneAPI.getMaterielsEnPanne();
      
      console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne chargé(s)`);
      setMateriels(materielsEnPanne);
      setShowNoPanneMessage(materielsEnPanne.length === 0);
      
      // Si un matériel source est spécifié, pré-sélectionner
      if (materielSourceId && materielsEnPanne.length > 0) {
        const materielSource = materielsEnPanne.find(m => m.id === materielSourceId);
        if (materielSource) {
          initializeFromMateriel(materielSource);
        }
      }
      
    } catch (error: any) {
      console.error('❌ Erreur chargement matériels en panne:', error);
      setApiError(handleApiError(error));
      setShowNoPanneMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour initialiser depuis un matériel
  const initializeFromMateriel = (materiel: Materiel) => {
    const description = `🚨 ALERTE PANNE - ${materiel.nom} (${materiel.reference}) est ${materiel.etat || 'en panne'}. Nécessite une intervention.`;
    
    // Déterminer la sévérité basée sur l'état
    const determineSeverite = (): string => {
      if (!materiel.etat) return 'moyenne';
      
      const etat = materiel.etat.toLowerCase();
      if (etat.includes('critique') || etat.includes('grave')) return 'critique';
      if (etat.includes('urgent') || etat.includes('élevé')) return 'elevee';
      if (etat.includes('modéré') || etat.includes('moyen')) return 'moyenne';
      return 'basse';
    };

    setFormData({
      description,
      date_alerte: new Date().toISOString().split('T')[0],
      type_alerte: 'panne',
      severite: determineSeverite(),
      statut: 'nouvelle',
      materiel_source: materiel.id.toString()
    });
  };

  // Fonction pour générer une description automatique
  const generateDescriptionFromMateriel = (materiel: Materiel | undefined): string => {
    if (!materiel) return '';
    
    const etat = materiel.etat || 'en panne';
    const nom = materiel.nom || materiel.reference || `Matériel #${materiel.id}`;
    const typePanne = etat.toLowerCase().includes('critique') ? 'CRITIQUE' : 'URGENTE';
    
    return `🚨 ALERTE ${typePanne} - ${nom} est ${etat}. Nécessite une intervention immédiate.`;
  };

  // Effet pour charger les matériels quand le formulaire s'ouvre
  useEffect(() => {
    if (isOpen && !isOpenRef.current) {
      isOpenRef.current = true;
      dataLoadedRef.current = false;
      
      // Réinitialiser le formulaire
      setFormData({
        description: '',
        date_alerte: new Date().toISOString().split('T')[0],
        type_alerte: 'panne',
        severite: 'moyenne',
        statut: 'nouvelle',
        materiel_source: ''
      });
      setErrors({});
      setApiError(null);
      
      // Charger les matériels en panne
      fetchMaterielsEnPanne();
      
      dataLoadedRef.current = true;
    }
    
    if (!isOpen) {
      isOpenRef.current = false;
    }
    
    return () => {
      if (!isOpen) {
        dataLoadedRef.current = false;
      }
    };
  }, [isOpen]);

  // Effet pour initialiser en mode édition
  useEffect(() => {
    if (isOpen && dataLoadedRef.current && alerte) {
      console.log('📝 Initialisation avec alerte existante:', alerte);
      
      setFormData({
        description: alerte.description || '',
        date_alerte: alerte.date_alerte ? new Date(alerte.date_alerte).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type_alerte: alerte.type_alerte || 'panne',
        severite: alerte.severite || 'moyenne',
        statut: alerte.statut || 'nouvelle',
        materiel_source: alerte.materiel_id?.toString() || alerte.materiel_source?.toString() || ''
      });
    }
  }, [alerte, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMaterielChange = (materielId: string) => {
    const materiel = materiels.find(m => m.id.toString() === materielId);
    
    // Mettre à jour la description automatiquement
    const newDescription = generateDescriptionFromMateriel(materiel);
    
    // Mettre à jour la sévérité basée sur le matériel
    const determineSeverite = (materiel: Materiel | undefined): string => {
      if (!materiel || !materiel.etat) return 'moyenne';
      
      const etat = materiel.etat.toLowerCase();
      if (etat.includes('critique') || etat.includes('grave')) return 'critique';
      if (etat.includes('urgent') || etat.includes('élevé')) return 'elevee';
      if (etat.includes('modéré') || etat.includes('moyen')) return 'moyenne';
      return 'basse';
    };

    setFormData(prev => ({
      ...prev,
      materiel_source: materielId,
      description: newDescription || prev.description,
      severite: determineSeverite(materiel) || prev.severite,
      type_alerte: 'panne'
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description requise';
    }

    if (!formData.date_alerte) {
      newErrors.date_alerte = 'Date d\'alerte requise';
    }

    if (!formData.materiel_source) {
      newErrors.materiel_source = 'Matériel en panne requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: any = {
        description: formData.description,
        date_alerte: formData.date_alerte,
        type_alerte: formData.type_alerte,
        severite: formData.severite,
        statut: formData.statut,
        materiel_id: parseInt(formData.materiel_source) // Important: utiliser materiel_id
      };

      // Pour la compatibilité avec différents backend
      if (submitData.materiel_id) {
        submitData.materiel_source = submitData.materiel_id;
      }

      console.log('📤 Création d\'alerte:', submitData);
      await onSubmit(submitData);
      onClose();
      
    } catch (error: any) {
      console.error('❌ Erreur soumission alerte:', error);
      setApiError(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeveriteIcon = (severite: string) => {
    const icons = {
      critique: <AlertTriangle className="h-4 w-4 text-error" />,
      elevee: <AlertTriangle className="h-4 w-4 text-warning" />,
      moyenne: <Bell className="h-4 w-4 text-info" />,
      basse: <Info className="h-4 w-4 text-success" />
    };
    return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
  };

  const getSeveriteBadge = (severite: string) => {
    const badges = {
      critique: 'badge-error',
      elevee: 'badge-warning',
      moyenne: 'badge-info',
      basse: 'badge-success'
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

  const getMaterielEtatBadge = (etat: string | undefined) => {
    if (!etat) return 'badge-neutral';
    
    const etatLower = etat.toLowerCase();
    if (etatLower.includes('critique') || etatLower.includes('grave')) return 'badge-error';
    if (etatLower.includes('urgent') || etatLower.includes('élevé')) return 'badge-warning';
    if (etatLower.includes('modéré') || etatLower.includes('moyen')) return 'badge-info';
    return 'badge-neutral';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <div>
            <h2 className="text-xl font-bold text-base-content">
              {alerte ? 'Modifier l\'alerte' : '🚨 Nouvelle alerte de panne'}
            </h2>
            <p className="text-sm text-base-content opacity-70 mt-1">
              {alerte ? 'Modifiez les informations de l\'alerte' : 'Créer une alerte pour un matériel en panne'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message d'erreur API */}
        {apiError && (
          <div className="m-4 alert alert-error">
            <AlertTriangle className="h-5 w-5" />
            <span>{apiError}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-base-content">Chargement des matériels en panne...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Sélection du matériel en panne */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Matériel en panne 
                  <span className="text-error ml-1">*</span>
                  {materiels.length > 0 && (
                    <span className="label-text-alt text-success ml-2">
                      ✅ {materiels.length} matériel(s) en panne
                    </span>
                  )}
                </span>
              </label>
              
              {showNoPanneMessage ? (
                <div className="alert alert-warning">
                  <div className="flex items-center gap-3">
                    <BatteryWarning className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Aucun matériel en panne disponible</p>
                      <p className="text-sm opacity-80">
                        Les alertes sont réservées aux matériels en panne.
                        Veuillez d'abord marquer un matériel comme "en panne" dans l'interface des matériels.
                      </p>
                      <a 
                        href="/materiels" 
                        className="link link-primary mt-2 inline-block text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          onClose();
                          window.location.href = '/materiels';
                        }}
                      >
                        Gérer les états des matériels →
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <select
                    name="materiel_source"
                    value={formData.materiel_source}
                    onChange={(e) => handleMaterielChange(e.target.value)}
                    className={`select select-bordered ${errors.materiel_source ? 'select-error' : ''}`}
                    disabled={isSubmitting || materiels.length === 0}
                    required
                  >
                    <option value="">Sélectionnez un matériel en panne...</option>
                    {materiels.map((materiel) => (
                      <option key={materiel.id} value={materiel.id.toString()}>
                        {materiel.nom} ({materiel.reference}) - {materiel.service_attribue || 'Non spécifié'}
                      </option>
                    ))}
                  </select>
                  
                  {errors.materiel_source && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.materiel_source}</span>
                    </label>
                  )}
                  
                  <div className="text-xs text-base-content opacity-60 mt-1 flex items-center gap-2">
                    <span>💡 Seuls les matériels marqués comme "en panne" sont disponibles</span>
                  </div>
                </>
              )}
              
              {/* Aperçu du matériel sélectionné */}
              {formData.materiel_source && materiels.length > 0 && (
                <div className="mt-4 p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-bold text-base-content">
                          {materiels.find(m => m.id.toString() === formData.materiel_source)?.nom}
                        </h4>
                        <p className="text-sm text-base-content opacity-70">
                          Réf: {materiels.find(m => m.id.toString() === formData.materiel_source)?.reference}
                        </p>
                      </div>
                    </div>
                    <span className={`badge ${getMaterielEtatBadge(
                      materiels.find(m => m.id.toString() === formData.materiel_source)?.etat
                    )}`}>
                      {materiels.find(m => m.id.toString() === formData.materiel_source)?.etat || 'État inconnu'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div>
                      <span className="opacity-70">Type:</span>
                      <span className="font-medium ml-2">
                        {materiels.find(m => m.id.toString() === formData.materiel_source)?.type || 'Non spécifié'}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-70">Emplacement:</span>
                      <span className="font-medium ml-2">
                        {materiels.find(m => m.id.toString() === formData.materiel_source)?.emplacement || 'Non spécifié'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Description :</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Décrivez l'alerte en détails..."
                disabled={isSubmitting}
                required
              />
              <div className="flex justify-between mt-1">
                {errors.description && (
                  <span className="label-text-alt text-error">{errors.description}</span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (formData.materiel_source && materiels.length > 0) {
                      const materiel = materiels.find(m => m.id.toString() === formData.materiel_source);
                      const newDescription = generateDescriptionFromMateriel(materiel);
                      setFormData(prev => ({ ...prev, description: newDescription }));
                    }
                  }}
                  className="btn btn-xs btn-outline"
                  disabled={!formData.materiel_source || isSubmitting}
                >
                  Générer automatiquement
                </button>
              </div>
            </div>

            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Date d'alerte :</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="date"
                  name="date_alerte"
                  value={formData.date_alerte}
                  onChange={handleChange}
                  className={`input input-bordered ${errors.date_alerte ? 'input-error' : ''}`}
                  disabled={isSubmitting}
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
                  <span className="label-text font-semibold">Type d'alerte :</span>
                </label>
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <Wrench className="h-5 w-5 text-warning" />
                  <div>
                    <p className="font-medium">Panne Matérielle</p>
                    <p className="text-sm opacity-70">(Type automatique pour les matériels en panne)</p>
                  </div>
                </div>
                <input type="hidden" name="type_alerte" value="panne" />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Sévérité :</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <div className="flex items-center gap-3 mb-2">
                  {getSeveriteIcon(formData.severite)}
                  <div className={`badge ${getSeveriteBadge(formData.severite)}`}>
                    {getSeveriteText(formData.severite)}
                  </div>
                </div>
                <select
                  name="severite"
                  value={formData.severite}
                  onChange={handleChange}
                  className="select select-bordered"
                  disabled={isSubmitting}
                  required
                >
                  <option value="critique">Critique - Intervention immédiate</option>
                  <option value="elevee">Élevée - Intervention urgente</option>
                  <option value="moyenne">Moyenne - Intervention nécessaire</option>
                  <option value="basse">Basse - Surveillance recommandée</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Statut :</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="select select-bordered"
                  disabled={isSubmitting}
                  required
                >
                  <option value="nouvelle">Nouvelle - À traiter</option>
                  <option value="en_traitement">En traitement - En cours de résolution</option>
                  <option value="resolue">Résolue - Problème corrigé</option>
                </select>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || materiels.length === 0}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {alerte ? 'Modification...' : 'Création...'}
                  </span>
                ) : (
                  alerte ? 'Modifier' : 'Créer'
                )} l'alerte
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AlerteForm;