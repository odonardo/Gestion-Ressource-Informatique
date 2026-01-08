
// import React, { useState, useEffect } from 'react';
// import { X, Calendar, Info } from 'lucide-react';
// import { InstallationLogiciel, Materiel, Logiciel } from '../types';

// interface InstallationLogicielFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
//   installation?: InstallationLogiciel;
//   materiels: Materiel[];
//   logiciels: Logiciel[];
// }

// const InstallationLogicielForm: React.FC<InstallationLogicielFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   installation,
//   materiels,
//   logiciels
// }) => {
//   const [formData, setFormData] = useState({
//     materiel: installation?.materiel || '',
//     logiciel: installation?.logiciel || '',
//     date_installation: installation?.date_installation || '',
//     statut: installation?.statut || 'actif'
//   });

//   const [selectedLogiciel, setSelectedLogiciel] = useState<Logiciel | undefined>();

//   // Fonction pour formater la date en YYYY-MM-DD
//   const formatDateForInput = (dateString?: string): string => {
//     if (!dateString) return '';
//     try {
//       const date = new Date(dateString);
//       return date.toISOString().split('T')[0];
//     } catch {
//       return '';
//     }
//   };

//   // Fonction pour afficher la date en format français
//   const formatDateDisplay = (dateString?: string): string => {
//     if (!dateString) return 'Non définie';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR');
//     } catch {
//       return 'Date invalide';
//     }
//   };

//   // Effet pour récupérer le logiciel sélectionné (SANS pré-remplir la date)
//   useEffect(() => {
//     if (formData.logiciel) {
//       const logicielId = parseInt(formData.logiciel as string);
//       const foundLogiciel = logiciels.find(l => l.id === logicielId);
//       setSelectedLogiciel(foundLogiciel);
      
//       // SUPPRIMÉ : Ne plus pré-remplir automatiquement la date
//       // if (!installation && foundLogiciel?.date_installation) {
//       //   const logicielDate = formatDateForInput(foundLogiciel.date_installation);
//       //   if (!formData.date_installation) {
//       //     setFormData(prev => ({
//       //       ...prev,
//       //       date_installation: logicielDate
//       //     }));
//       //   }
//       // }
//     } else {
//       setSelectedLogiciel(undefined);
//     }
//   }, [formData.logiciel, logiciels]);

//   // Effet pour l'édition d'une installation existante
//   useEffect(() => {
//     if (installation) {
//       setFormData({
//         materiel: installation.materiel,
//         logiciel: installation.logiciel,
//         date_installation: formatDateForInput(installation.date_installation),
//         statut: installation.statut
//       });
      
//       // Récupérer le logiciel correspondant
//       const foundLogiciel = logiciels.find(l => l.id === installation.logiciel);
//       setSelectedLogiciel(foundLogiciel);
//     } else {
//       // Réinitialiser pour une nouvelle installation - DATE VIDE
//       setFormData({
//         materiel: '',
//         logiciel: '',
//         date_installation: '', // ← VIDE, pas de date par défaut
//         statut: 'actif'
//       });
//       setSelectedLogiciel(undefined);
//     }
//   }, [installation, logiciels]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Valider que les champs requis sont remplis
//     if (!formData.materiel || !formData.logiciel || !formData.date_installation) {
//       alert('Veuillez remplir tous les champs obligatoires');
//       return;
//     }

//     // Validation optionnelle : vérifier que la date est logique
//     const installationDate = new Date(formData.date_installation);
//     const today = new Date();
    
//     // Optionnel : empêcher les dates trop anciennes (plus de 10 ans)
//     const tenYearsAgo = new Date();
//     tenYearsAgo.setFullYear(today.getFullYear() - 10);
    
//     if (installationDate < tenYearsAgo) {
//       if (!window.confirm(`La date d'installation (${formatDateDisplay(formData.date_installation)}) est très ancienne (plus de 10 ans). Êtes-vous sûr ?`)) {
//         return;
//       }
//     }
    
//     // Optionnel : avertir pour les dates futures
//     if (installationDate > today) {
//       if (!window.confirm(`La date d'installation (${formatDateDisplay(formData.date_installation)}) est dans le futur. Êtes-vous sûr ?`)) {
//         return;
//       }
//     }

//     onSubmit({
//       materiel: parseInt(formData.materiel as string),
//       logiciel: parseInt(formData.logiciel as string),
//       date_installation: formData.date_installation,
//       statut: formData.statut
//     });
//   };

//   // Fonction pour obtenir la date d'aujourd'hui
//   const getTodayDate = (): string => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Fonction pour obtenir la date maximale (aujourd'hui)
//   const getMaxDate = (): string => {
//     return getTodayDate();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal modal-open">
//       <div className="modal-box max-w-2xl">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-2xl font-bold">
//             {installation ? '✏️ Modifier Installation' : '➕ Nouvelle Installation'}
//           </h3>
//           <button onClick={onClose} className="btn btn-ghost btn-circle">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* Matériel */}
//           <div className="form-control mb-4">
//             <label className="label">
//               <span className="label-text font-semibold">💻 Matériel *</span>
//             </label>
//             <select
//               name="materiel"
//               className="select select-bordered w-full"
//               value={formData.materiel}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Sélectionner un matériel</option>
//               {materiels.map(materiel => (
//                 <option key={materiel.id} value={materiel.id}>
//                   {materiel.nom} ({materiel.reference})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Logiciel */}
//           <div className="form-control mb-4">
//             <label className="label">
//               <span className="label-text font-semibold">🔧 Logiciel *</span>
//             </label>
//             <select
//               name="logiciel"
//               className="select select-bordered w-full"
//               value={formData.logiciel}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Sélectionner un logiciel</option>
//               {logiciels.map(logiciel => (
//                 <option key={logiciel.id} value={logiciel.id}>
//                   {logiciel.nom} v{logiciel.version} 
//                   {logiciel.date_installation && (
//                     <span className="text-xs opacity-60 ml-2">
//                       (📅 Entrée inventaire: {new Date(logiciel.date_installation).toLocaleDateString('fr-FR')})
//                     </span>
//                   )}
//                 </option>
//               ))}
//             </select>
            
//             {/* Information sur le logiciel sélectionné */}
//             {selectedLogiciel && (
//               <div className="mt-2 p-2 bg-base-200 rounded">
//                 <p className="text-sm">
//                   <span className="font-medium">Logiciel sélectionné:</span> {selectedLogiciel.nom} v{selectedLogiciel.version}
//                 </p>
//                 {selectedLogiciel.date_installation && (
//                   <p className="text-xs text-info mt-1">
//                     {/* Date d'entrée inventaire disponible */}
//                   </p>
//                 )}
                
//                 {/* Information sur la licence si disponible */}
//                 {selectedLogiciel.date_expiration_licence && (
//                   <div className="mt-2 p-2 bg-warning/10 rounded">
//                     <p className="text-sm font-medium">⚠️ Information licence</p>
//                     <p className="text-xs">
//                       Expire le: {formatDateDisplay(selectedLogiciel.date_expiration_licence)}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Date d'installation - CHAMP OBLIGATOIRE ET VIDE PAR DÉFAUT */}
//           <div className="form-control mb-4">
//             <div className="flex items-center justify-between mb-2">
//               <label className="label-text font-semibold flex items-center gap-2">
//                 <Calendar className="h-4 w-4" />
//                 Date d'installation *
//                 <span className="text-error text-sm">(obligatoire)</span>
//               </label>
//               {/* Bouton pour remplir avec aujourd'hui */}
//               {!formData.date_installation && (
//                 <button
//                   type="button"
//                   onClick={() => setFormData(prev => ({ 
//                     ...prev, 
//                     date_installation: getTodayDate() 
//                   }))}
//                   className="btn btn-xs btn-outline btn-info"
//                   title="Remplir avec la date d'aujourd'hui"
//                 >
//                   Aujourd'hui
//                 </button>
//               )}
//             </div>
            
//             <input
//               type="date"
//               name="date_installation"
//               className="input input-bordered w-full"
//               value={formData.date_installation}
//               onChange={handleChange}
//               required
//               max={getMaxDate()} // Empêcher les dates futures si souhaité
//             />
            
//             {/* Instructions et validation */}
//             <div className="mt-2 space-y-1">
//               <div className="text-xs text-base-content/60">
//                 <p>💡 <strong>Instructions :</strong></p>
//                 <ul className="list-disc list-inside ml-2 mt-1">
//                   <li>Sélectionnez la <strong>date réelle</strong> d'installation</li>
//                   <li>Pour une installation <strong>aujourd'hui</strong>, cliquez sur "Aujourd'hui"</li>
//                   <li>Pour une installation <strong>passée</strong>, sélectionnez la date correspondante</li>
//                 </ul>
//               </div>
              
//               {/* Validation de la date saisie */}
//               {formData.date_installation && (
//                 <div className="mt-2">
//                   {(() => {
//                     const selectedDate = new Date(formData.date_installation);
//                     const today = new Date();
//                     today.setHours(0, 0, 0, 0);
//                     selectedDate.setHours(0, 0, 0, 0);
                    
//                     const diffTime = today.getTime() - selectedDate.getTime();
//                     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    
//                     if (selectedDate > today) {
//                       return (
//                         <div className="alert alert-warning py-2">
//                           <Info className="h-4 w-4" />
//                           <span className="text-sm">
//                             ⚠️ La date est dans le futur. Assurez-vous qu'il s'agit bien d'une date prévue.
//                           </span>
//                         </div>
//                       );
//                     } else if (diffDays === 0) {
//                       return (
//                         <div className="alert alert-success py-2">
//                           <Info className="h-4 w-4" />
//                           <span className="text-sm">
//                             ✅ Installation prévue pour aujourd'hui.
//                           </span>
//                         </div>
//                       );
//                     } else if (diffDays <= 7) {
//                       return (
//                         <div className="alert alert-info py-2">
//                           <Info className="h-4 w-4" />
//                           <span className="text-sm">
//                             📅 Installation prévue il y a {diffDays} jour{diffDays !== 1 ? 's' : ''}.
//                           </span>
//                         </div>
//                       );
//                     } else {
//                       return (
//                         <div className="alert alert-info py-2">
//                           <Info className="h-4 w-4" />
//                           <span className="text-sm">
//                             📅 Installation prévue il y a {diffDays} jour{diffDays !== 1 ? 's' : ''}.
//                           </span>
//                         </div>
//                       );
//                     }
//                   })()}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Statut */}
//           <div className="form-control mb-6">
//             <label className="label">
//               <span className="label-text font-semibold">📊 Statut</span>
//             </label>
//             <select
//               name="statut"
//               className="select select-bordered w-full"
//               value={formData.statut}
//               onChange={handleChange}
//             >
//               <option value="actif">✅ Actif (logiciel installé et fonctionnel)</option>
//               <option value="desinstalle">❌ Désinstallé (logiciel retiré)</option>
//               <option value="en_erreur">⚠️ En erreur (problème d'installation)</option>
//             </select>
//             <label className="label">
//               <span className="label-text-alt">
//                 Sélectionnez "Actif" pour une installation réussie
//               </span>
//             </label>
//           </div>

//           {/* Résumé de validation */}
//           <div className="bg-base-200 rounded-lg p-4 mb-6">
//             <h4 className="font-bold mb-2">📋 Validation</h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex items-center">
//                 {formData.materiel ? (
//                   <span className="text-success">✅</span>
//                 ) : (
//                   <span className="text-error">❌</span>
//                 )}
//                 <span className="ml-2">
//                   <strong>Matériel :</strong> {formData.materiel ? 'Sélectionné' : 'À sélectionner'}
//                 </span>
//               </div>
              
//               <div className="flex items-center">
//                 {formData.logiciel ? (
//                   <span className="text-success">✅</span>
//                 ) : (
//                   <span className="text-error">❌</span>
//                 )}
//                 <span className="ml-2">
//                   <strong>Logiciel :</strong> {formData.logiciel ? 'Sélectionné' : 'À sélectionner'}
//                 </span>
//               </div>
              
//               <div className="flex items-center">
//                 {formData.date_installation ? (
//                   <span className="text-success">✅</span>
//                 ) : (
//                   <span className="text-error">❌</span>
//                 )}
//                 <span className="ml-2">
//                   <strong>Date d'installation :</strong> {formData.date_installation ? formatDateDisplay(formData.date_installation) : 'À renseigner'}
//                 </span>
//               </div>
              
//               {formData.date_installation && (
//                 <div className="mt-2 p-2 bg-base-100 rounded">
//                   <p className="font-medium">Installation programmée :</p>
//                   <p className="text-sm">
//                     {formData.materiel && materiels.find(m => m.id === parseInt(formData.materiel as string))?.nom} ← 
//                     {selectedLogiciel?.nom} v{selectedLogiciel?.version} 
//                     {formData.date_installation && (
//                       <span className="ml-2">
//                         le {formatDateDisplay(formData.date_installation)}
//                       </span>
//                     )}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Boutons */}
//           <div className="modal-action">
//             <button type="button" onClick={onClose} className="btn btn-ghost">
//               Annuler
//             </button>
//             <button 
//               type="submit" 
//               className="btn btn-primary"
//               disabled={!formData.materiel || !formData.logiciel || !formData.date_installation}
//             >
//               {installation ? 'Modifier' : 'Créer'}
//             </button>
//           </div>
//         </form>
//       </div>
//       <div className="modal-backdrop" onClick={onClose}></div>
//     </div>
//   );
// };

// export default InstallationLogicielForm;











































import React, { useState, useEffect } from 'react';
import { X, Calendar, Info, Monitor, Smartphone } from 'lucide-react';
import { InstallationLogiciel, Materiel, Logiciel } from '../types';

interface InstallationLogicielFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  installation?: InstallationLogiciel;
  materiels: Materiel[];
  logiciels: Logiciel[];
}

const InstallationLogicielForm: React.FC<InstallationLogicielFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  installation,
  materiels,
  logiciels
}) => {
  const [formData, setFormData] = useState({
    materiel: installation?.materiel || '',
    logiciel: installation?.logiciel || '',
    date_installation: installation?.date_installation || '',
    statut: installation?.statut || 'actif'
  });

  const [selectedLogiciel, setSelectedLogiciel] = useState<Logiciel | undefined>();
  const [selectedMateriel, setSelectedMateriel] = useState<Materiel | undefined>();

  // Fonction pour formater la date en YYYY-MM-DD
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Fonction pour afficher la date en format français
  const formatDateDisplay = (dateString?: string): string => {
    if (!dateString) return 'Non définie';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  // Fonction pour filtrer les matériels qui peuvent installer des logiciels
  const getMaterielsCompatibles = () => {
    // Filtre seulement les ordinateurs et smartphones
    return materiels.filter(materiel => {
      // Convertir le nom en minuscules pour la comparaison
      const nomMateriel = materiel.nom.toLowerCase();
      const referenceMateriel = materiel.reference?.toLowerCase() || '';
      
      // Liste des mots-clés qui indiquent qu'un matériel peut installer des logiciels
      const motsClesCompatibles = [
        'ordinateur', 'pc', 'laptop', 'portable', 'desktop', 'station',
        'smartphone', 'mobile', 'phone', 'téléphone', 'tablette', 'tablet'
      ];
      
      // Vérifier si le nom ou la référence contient un mot-clé compatible
      return motsClesCompatibles.some(motCle => 
        nomMateriel.includes(motCle) || referenceMateriel.includes(motCle)
      );
    });
  };

  // Vérifier si le matériel sélectionné est un ordinateur
  const isOrdinateur = (materiel: Materiel | undefined): boolean => {
    if (!materiel) return false;
    
    const nomMateriel = materiel.nom.toLowerCase();
    const motsClesOrdinateur = [
      'ordinateur', 'pc', 'laptop', 'portable', 'desktop', 'station', 'serveur'
    ];
    
    return motsClesOrdinateur.some(motCle => nomMateriel.includes(motCle));
  };

  // Vérifier si le matériel sélectionné est un téléphone
  const isTelephone = (materiel: Materiel | undefined): boolean => {
    if (!materiel) return false;
    
    const nomMateriel = materiel.nom.toLowerCase();
    const motsClesTelephone = [
      'smartphone', 'mobile', 'phone', 'téléphone', 'tablette', 'tablet'
    ];
    
    return motsClesTelephone.some(motCle => nomMateriel.includes(motCle));
  };

  // Effet pour récupérer le matériel sélectionné
  useEffect(() => {
    if (formData.materiel) {
      const materielId = parseInt(formData.materiel as string);
      const foundMateriel = materiels.find(m => m.id === materielId);
      setSelectedMateriel(foundMateriel);
    } else {
      setSelectedMateriel(undefined);
    }
  }, [formData.materiel, materiels]);

  // Effet pour récupérer le logiciel sélectionné
  useEffect(() => {
    if (formData.logiciel) {
      const logicielId = parseInt(formData.logiciel as string);
      const foundLogiciel = logiciels.find(l => l.id === logicielId);
      setSelectedLogiciel(foundLogiciel);
    } else {
      setSelectedLogiciel(undefined);
    }
  }, [formData.logiciel, logiciels]);

  // Effet pour l'édition d'une installation existante
  useEffect(() => {
    if (installation) {
      setFormData({
        materiel: installation.materiel,
        logiciel: installation.logiciel,
        date_installation: formatDateForInput(installation.date_installation),
        statut: installation.statut
      });
      
      // Récupérer le matériel correspondant
      const foundMateriel = materiels.find(m => m.id === installation.materiel);
      setSelectedMateriel(foundMateriel);
      
      // Récupérer le logiciel correspondant
      const foundLogiciel = logiciels.find(l => l.id === installation.logiciel);
      setSelectedLogiciel(foundLogiciel);
    } else {
      // Réinitialiser pour une nouvelle installation
      setFormData({
        materiel: '',
        logiciel: '',
        date_installation: '',
        statut: 'actif'
      });
      setSelectedMateriel(undefined);
      setSelectedLogiciel(undefined);
    }
  }, [installation, materiels, logiciels]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider que les champs requis sont remplis
    if (!formData.materiel || !formData.logiciel || !formData.date_installation) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation optionnelle : vérifier que la date est logique
    const installationDate = new Date(formData.date_installation);
    const today = new Date();
    
    // Optionnel : empêcher les dates trop anciennes (plus de 10 ans)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(today.getFullYear() - 10);
    
    if (installationDate < tenYearsAgo) {
      if (!window.confirm(`La date d'installation (${formatDateDisplay(formData.date_installation)}) est très ancienne (plus de 10 ans). Êtes-vous sûr ?`)) {
        return;
      }
    }
    
    // Optionnel : avertir pour les dates futures
    if (installationDate > today) {
      if (!window.confirm(`La date d'installation (${formatDateDisplay(formData.date_installation)}) est dans le futur. Êtes-vous sûr ?`)) {
        return;
      }
    }

    onSubmit({
      materiel: parseInt(formData.materiel as string),
      logiciel: parseInt(formData.logiciel as string),
      date_installation: formData.date_installation,
      statut: formData.statut
    });
  };

  // Fonction pour obtenir la date d'aujourd'hui
  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fonction pour obtenir la date maximale (aujourd'hui)
  const getMaxDate = (): string => {
    return getTodayDate();
  };

  const materielsCompatibles = getMaterielsCompatibles();

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">
            {installation ? '✏️ Modifier Installation' : '➕ Nouvelle Installation'}
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-circle">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Matériel avec filtre */}
          <div className="form-control mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Matériel *
                </span>
              </label>
              <div className="text-xs text-info">
                {materielsCompatibles.length} matériel(s) compatible(s)
              </div>
            </div>
            
            <select
              name="materiel"
              className="select select-bordered w-full"
              value={formData.materiel}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un matériel</option>
              {materielsCompatibles.map(materiel => {
                const estOrdinateur = isOrdinateur(materiel);
                const estTelephone = isTelephone(materiel);
                
                return (
                  <option key={materiel.id} value={materiel.id}>
                    {estOrdinateur && '💻 '}
                    {estTelephone && '📱 '}
                    {materiel.nom} ({materiel.reference})
                  </option>
                );
              })}
            </select>
            
            {/* Information sur le matériel sélectionné */}
            {selectedMateriel && (
              <div className="mt-2 p-2 bg-base-200 rounded">
                <div className="flex items-center gap-2">
                  {isOrdinateur(selectedMateriel) && (
                    <div className="badge badge-info gap-1">
                      <Monitor className="w-3 h-3" />
                      Ordinateur
                    </div>
                  )}
                  {isTelephone(selectedMateriel) && (
                    <div className="badge badge-primary gap-1">
                      <Smartphone className="w-3 h-3" />
                      Mobile
                    </div>
                  )}
                </div>
                <p className="text-sm mt-1">
                  <span className="font-medium">Matériel sélectionné:</span> {selectedMateriel.nom}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  Référence: {selectedMateriel.reference}
                </p>
              </div>
            )}
            
            {materielsCompatibles.length === 0 && (
              <div className="alert alert-warning mt-2 py-2">
                <Info className="h-4 w-4" />
                <span className="text-sm">
                  Aucun matériel compatible trouvé. Seuls les ordinateurs et smartphones peuvent installer des logiciels.
                </span>
              </div>
            )}
          </div>

          {/* Logiciel */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">🔧 Logiciel *</span>
            </label>
            <select
              name="logiciel"
              className="select select-bordered w-full"
              value={formData.logiciel}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un logiciel</option>
              {logiciels.map(logiciel => (
                <option key={logiciel.id} value={logiciel.id}>
                  {logiciel.nom} v{logiciel.version}
                </option>
              ))}
            </select>
            
            {/* Information sur le logiciel sélectionné */}
            {selectedLogiciel && (
              <div className="mt-2 p-2 bg-base-200 rounded">
                <p className="text-sm">
                  <span className="font-medium">Logiciel sélectionné:</span> {selectedLogiciel.nom} v{selectedLogiciel.version}
                </p>
                
                {/* Information sur la licence si disponible */}
                {selectedLogiciel.date_expiration_licence && (
                  <div className="mt-2 p-2 bg-warning/10 rounded">
                    <p className="text-sm font-medium">⚠️ Information licence</p>
                    <p className="text-xs">
                      Expire le: {formatDateDisplay(selectedLogiciel.date_expiration_licence)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date d'installation */}
          <div className="form-control mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="label-text font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date d'installation *
                <span className="text-error text-sm">(obligatoire)</span>
              </label>
              {/* Bouton pour remplir avec aujourd'hui */}
              {!formData.date_installation && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    date_installation: getTodayDate() 
                  }))}
                  className="btn btn-xs btn-outline btn-info"
                  title="Remplir avec la date d'aujourd'hui"
                >
                  Aujourd'hui
                </button>
              )}
            </div>
            
            <input
              type="date"
              name="date_installation"
              className="input input-bordered w-full"
              value={formData.date_installation}
              onChange={handleChange}
              required
              max={getMaxDate()}
            />
            
            {/* Instructions et validation */}
            <div className="mt-2 space-y-1">
              <div className="text-xs text-base-content/60">
                <p>💡 <strong>Instructions :</strong></p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Sélectionnez la <strong>date réelle</strong> d'installation</li>
                  <li>Pour une installation <strong>aujourd'hui</strong>, cliquez sur "Aujourd'hui"</li>
                  <li>Pour une installation <strong>passée</strong>, sélectionnez la date correspondante</li>
                </ul>
              </div>
              
              {/* Validation de la date saisie */}
              {formData.date_installation && (
                <div className="mt-2">
                  {(() => {
                    const selectedDate = new Date(formData.date_installation);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    selectedDate.setHours(0, 0, 0, 0);
                    
                    const diffTime = today.getTime() - selectedDate.getTime();
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (selectedDate > today) {
                      return (
                        <div className="alert alert-warning py-2">
                          <Info className="h-4 w-4" />
                          <span className="text-sm">
                            ⚠️ La date est dans le futur. Assurez-vous qu'il s'agit bien d'une date prévue.
                          </span>
                        </div>
                      );
                    } else if (diffDays === 0) {
                      return (
                        <div className="alert alert-success py-2">
                          <Info className="h-4 w-4" />
                          <span className="text-sm">
                            ✅ Installation prévue pour aujourd'hui.
                          </span>
                        </div>
                      );
                    } else if (diffDays <= 7) {
                      return (
                        <div className="alert alert-info py-2">
                          <Info className="h-4 w-4" />
                          <span className="text-sm">
                            📅 Installation prévue il y a {diffDays} jour{diffDays !== 1 ? 's' : ''}.
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <div className="alert alert-info py-2">
                          <Info className="h-4 w-4" />
                          <span className="text-sm">
                            📅 Installation prévue il y a {diffDays} jour{diffDays !== 1 ? 's' : ''}.
                          </span>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Statut */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-semibold">📊 Statut</span>
            </label>
            <select
              name="statut"
              className="select select-bordered w-full"
              value={formData.statut}
              onChange={handleChange}
            >
              <option value="actif">✅ Actif (logiciel installé et fonctionnel)</option>
              <option value="desinstalle">❌ Désinstallé (logiciel retiré)</option>
              <option value="en_erreur">⚠️ En erreur (problème d'installation)</option>
            </select>
            <label className="label">
              <span className="label-text-alt">
                Sélectionnez "Actif" pour une installation réussie
              </span>
            </label>
          </div>

          {/* Résumé de validation */}
          <div className="bg-base-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold mb-2">📋 Validation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                {formData.materiel ? (
                  <span className="text-success">✅</span>
                ) : (
                  <span className="text-error">❌</span>
                )}
                <span className="ml-2">
                  <strong>Matériel :</strong> {formData.materiel ? 'Sélectionné' : 'À sélectionner'}
                </span>
              </div>
              
              <div className="flex items-center">
                {formData.logiciel ? (
                  <span className="text-success">✅</span>
                ) : (
                  <span className="text-error">❌</span>
                )}
                <span className="ml-2">
                  <strong>Logiciel :</strong> {formData.logiciel ? 'Sélectionné' : 'À sélectionner'}
                </span>
              </div>
              
              <div className="flex items-center">
                {formData.date_installation ? (
                  <span className="text-success">✅</span>
                ) : (
                  <span className="text-error">❌</span>
                )}
                <span className="ml-2">
                  <strong>Date d'installation :</strong> {formData.date_installation ? formatDateDisplay(formData.date_installation) : 'À renseigner'}
                </span>
              </div>
              
              {formData.materiel && formData.logiciel && (
                <div className="mt-2 p-2 bg-base-100 rounded">
                  <p className="font-medium">Installation programmée :</p>
                  <p className="text-sm">
                    {selectedMateriel?.nom} 
                    {isOrdinateur(selectedMateriel) && ' (Ordinateur)'}
                    {isTelephone(selectedMateriel) && ' (Mobile)'}
                    {' ← '}
                    {selectedLogiciel?.nom} v{selectedLogiciel?.version} 
                    {formData.date_installation && (
                      <span className="ml-2">
                        le {formatDateDisplay(formData.date_installation)}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!formData.materiel || !formData.logiciel || !formData.date_installation}
            >
              {installation ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default InstallationLogicielForm;