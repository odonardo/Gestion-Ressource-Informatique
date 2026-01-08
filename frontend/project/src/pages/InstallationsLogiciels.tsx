

// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Filter, Edit, Trash2, CheckCircle, X, Package, Download, CheckSquare, Square, Monitor } from 'lucide-react';
// import { InstallationLogiciel, Materiel, Logiciel } from '../types';
// import { installationsAPI, materielsAPI, logicielsAPI } from '../services/api';
// import InstallationLogicielForm from '../components/InstallationLogicielForm';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): any[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): any[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): any[] => {
//   if (!response || !response.data) {
//     console.log('❌ Réponse vide ou sans data:', response);
//     return [];
//   }
  
//   if (Array.isArray(response.data)) {
//     return response.data;
//   }
  
//   if (response.data.results && Array.isArray(response.data.results)) {
//     return response.data.results;
//   }
  
//   if (response.data.data && Array.isArray(response.data.data)) {
//     return response.data.data;
//   }
  
//   if (typeof response.data === 'object' && !Array.isArray(response.data)) {
//     return [response.data];
//   }
  
//   console.warn('⚠️ Format de réponse non reconnu:', response.data);
//   return [];
// };

// interface InstallationFormData {
//   materiel: number;
//   logiciel: number;
//   date_installation: string;
//   statut: 'actif' | 'desinstalle' | 'en_erreur';
// }

// const InstallationsLogiciels: React.FC = () => {
//   const [installations, setInstallations] = useState<InstallationLogiciel[]>([]);
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
//   const [filteredInstallations, setFilteredInstallations] = useState<InstallationLogiciel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingInstallation, setEditingInstallation] = useState<InstallationLogiciel | undefined>();
//   const [selectedInstallations, setSelectedInstallations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterInstallations();
//   }, [installations, searchTerm, filterStatut]);

//   useEffect(() => {
//     if (filteredInstallations.length > 0 && selectedInstallations.length === filteredInstallations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedInstallations, filteredInstallations]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [installationsRes, materielsRes, logicielsRes] = await Promise.all([
//         installationsAPI.getAll(),
//         materielsAPI.getAll(),
//         logicielsAPI.getAll()
//       ]);

//       const extractedInstallations = extractDataFromResponse(installationsRes);
//       const extractedMateriels = extractDataFromResponse(materielsRes);
//       const extractedLogiciels = extractDataFromResponse(logicielsRes);

//       console.log('📦 Installations chargées:', extractedInstallations);
//       console.log('💻 Matériels chargés:', extractedMateriels);
//       console.log('🔧 Logiciels chargés:', extractedLogiciels);

//       setInstallations(extractedInstallations);
//       setMateriels(extractedMateriels);
//       setLogiciels(extractedLogiciels);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement:', err);
//       setError('Erreur lors du chargement des données');
//       showMessage('error', 'Erreur lors du chargement des données');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterInstallations = () => {
//     let filtered = safeArray(installations);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, installation => 
//         installation.materiel_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         installation.logiciel_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         installation.materiel_reference?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterStatut) {
//       filtered = safeFilter(filtered, installation => installation.statut === filterStatut);
//     }

//     setFilteredInstallations(filtered);
//     setSelectedInstallations([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // CORRECTION : handleSubmit améliorée avec debug
//   const handleSubmit = async (formData: InstallationFormData) => {
//     try {
//       console.group('🔧 DEBUG Installation Submission');
//       console.log('Données du formulaire:', formData);
      
//       // Formater les données pour l'API
//       const apiData = {
//         materiel: formData.materiel,
//         logiciel: formData.logiciel,
//         date_installation: formData.date_installation,
//         statut: formData.statut
//       };
      
//       console.log('📤 Données API formatées:', apiData);
//       console.groupEnd();

//       if (editingInstallation) {
//         const response = await installationsAPI.update(editingInstallation.id, apiData);
//         console.log('✅ Réponse update:', response.data);
//         showMessage('success', 'Installation modifiée avec succès');
//       } else {
//         const response = await installationsAPI.create(apiData);
//         console.log('✅ Réponse create:', response.data);
//         showMessage('success', 'Installation créée avec succès');
//       }
      
//       await fetchData();
//       setIsFormOpen(false);
//       setEditingInstallation(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur détaillée:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         config: error.config
//       });
      
//       // Afficher les erreurs spécifiques du backend
//       if (error.response?.data?.non_field_errors) {
//         showMessage('error', `Erreur de validation: ${error.response.data.non_field_errors.join(', ')}`);
//       } else if (error.response?.data) {
//         // Afficher toutes les erreurs de champ
//         const errorMessages = [];
//         for (const [field, errors] of Object.entries(error.response.data)) {
//           if (field === 'non_field_errors') continue;
//           errorMessages.push(`${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`);
//         }
//         showMessage('error', `Erreurs: ${errorMessages.join('; ')}`);
//       } else {
//         showMessage('error', `Erreur réseau: ${error.message}`);
//       }
//     }
//   };

//   const toggleSelectInstallation = (id: number) => {
//     setSelectedInstallations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedInstallations([]);
//     } else {
//       const allIds = filteredInstallations.map(i => i.id);
//       setSelectedInstallations(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedInstallations.length === 0) {
//       showMessage('error', 'Aucune installation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedInstallations.length} installation(s) ?`)) {
//       try {
//         for (const id of selectedInstallations) {
//           await installationsAPI.delete(id);
//         }
        
//         showMessage('success', `${selectedInstallations.length} installation(s) supprimée(s) avec succès`);
//         setSelectedInstallations([]);
//         fetchData();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression des installations');
//       }
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedInstallations.length === 0) {
//       showMessage('error', 'Aucune installation sélectionnée');
//       return;
//     }

//     if (selectedInstallations.length === 1) {
//       const installation = installations.find(i => i.id === selectedInstallations[0]);
//       if (installation) {
//         handleEdit(installation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedInstallations.length} installations`);
//     }
//   };

//   const handleEdit = (installation: InstallationLogiciel) => {
//     setEditingInstallation(installation);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette installation ?')) {
//       try {
//         await installationsAPI.delete(id);
//         showMessage('success', 'Installation supprimée avec succès');
//         fetchData();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression');
//       }
//     }
//   };

//   const handleDesinstaller = async (id: number) => {
//     try {
//       await installationsAPI.desinstaller(id);
//       showMessage('success', 'Logiciel désinstallé avec succès');
//       fetchData();
//     } catch (error) {
//       showMessage('error', 'Erreur lors de la désinstallation');
//     }
//   };

//   const handleAddNew = () => {
//     setEditingInstallation(undefined);
//     setIsFormOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredInstallations.map(i => ({
//         Matériel: i.materiel_nom || 'N/A',
//         Référence: i.materiel_reference || 'N/A',
//         Logiciel: i.logiciel_nom || 'N/A',
//         Version: i.logiciel_version || 'N/A',
//         'Date installation': i.date_installation ? new Date(i.date_installation).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         Statut: getStatutText(i.statut)
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `installations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterStatut('');
//     setSelectedInstallations([]);
//   };

//   const getStatutBadge = (statut: string) => {
//     const badges = {
//       actif: 'badge-success',
//       desinstalle: 'badge-neutral',
//       en_erreur: 'badge-error'
//     };
//     return badges[statut as keyof typeof badges] || 'badge-neutral';
//   };

//   const getStatutText = (statut: string) => {
//     const texts = {
//       actif: 'Actif',
//       desinstalle: 'Désinstallé',
//       en_erreur: 'En erreur'
//     };
//     return texts[statut as keyof typeof texts] || statut;
//   };

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case 'actif':
//         return <CheckCircle className="w-3 h-3 mr-1" />;
//       case 'desinstalle':
//       case 'en_erreur':
//         return <X className="w-3 h-3 mr-1" />;
//       default:
//         return <Package className="w-3 h-3 mr-1" />;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR');
//     } catch {
//       return '-';
//     }
//   };

//   // Statistiques avec safeArray et safeFilter
//   const stats = {
//     total: safeArray(installations).length,
//     actifs: safeFilter(installations, i => i.statut === 'actif').length,
//     desinstalles: safeFilter(installations, i => i.statut === 'desinstalle').length,
//     en_erreur: safeFilter(installations, i => i.statut === 'en_erreur').length
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des installations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages d'alerte */}
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && !message && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Installations sur Matériel</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             Association des logiciels avec le parc matériel ({safeArray(filteredInstallations).length} installation{safeArray(filteredInstallations).length !== 1 ? 's' : ''})
//             {selectedInstallations.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedInstallations.length} sélectionnée(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleExport}
//             className="btn btn-outline btn-sm"
//             title="Exporter la liste"
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle installation
//           </button>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
//                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
//               </div>
//               <Package className="w-6 h-6 text-blue-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Actifs</p>
//                 <p className="text-2xl font-bold text-primary">{stats.actifs}</p>
//               </div>
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Désinstallés</p>
//                 <p className="text-2xl font-bold text-secondary">{stats.desinstalles}</p>
//               </div>
//               <X className="w-6 h-6 text-gray-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">En erreur</p>
//                 <p className="text-2xl font-bold text-error">{stats.en_erreur}</p>
//               </div>
//               <X className="w-6 h-6 text-red-500" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filtres et recherche */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Matériel, logiciel, référence..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Statut</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterStatut}
//                 onChange={(e) => setFilterStatut(e.target.value)}
//               >
//                 <option value="">Tous les statuts</option>
//                 <option value="actif">Actif</option>
//                 <option value="desinstalle">Désinstallé</option>
//                 <option value="en_erreur">En erreur</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔄 Actions</span>
//               </label>
//               <button
//                 onClick={resetFilters}
//                 className="btn btn-outline w-full gap-2"
//               >
//                 <Filter className="h-4 w-4" />
//                 Réinitialiser
//               </button>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📈 Statistiques</span>
//               </label>
//               <div className="text-sm text-base-content opacity-70">
//                 {safeArray(filteredInstallations).length} / {safeArray(installations).length} installations
//               </div>
//             </div>
//           </div>

//           {/* Actions de sélection */}
//           {selectedInstallations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedInstallations.length} installation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedInstallations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedInstallations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedInstallations([])}
//                     className="btn btn-ghost btn-sm"
//                   >
//                     <X className="h-4 w-4" />
//                     Annuler
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tableau des installations */}
//       <div className="card bg-base-200 shadow-xl">
//         <div className="card-body p-0">
//           <div className="overflow-x-auto">
//             <table className="table table-zebra w-full">
//               <thead>
//                 <tr className="bg-base-300">
//                   <th className="font-bold w-12 text-center">
//                     <div className="flex justify-center">
//                       <button
//                         onClick={toggleSelectAll}
//                         className="btn btn-ghost btn-xs p-1 hover:bg-base-200 transition-colors"
//                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-5 w-5 text-primary" />
//                         ) : (
//                           <Square className="h-5 w-5 text-base-content/40" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th className="font-bold">Matériel</th>
//                   <th className="font-bold">Logiciel</th>
//                   <th className="font-bold">Date installation</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredInstallations).map((installation) => (
//                   <tr key={installation.id} className="hover">
//                     <td className="text-center">
//                       <div className="flex justify-center">
//                         <input
//                           type="checkbox"
//                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                           checked={selectedInstallations.includes(installation.id)}
//                           onChange={() => toggleSelectInstallation(installation.id)}
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       <div className="font-semibold">{installation.materiel_nom || 'N/A'}</div>
//                       {installation.materiel_reference && (
//                         <div className="text-sm text-base-content opacity-60">
//                           {installation.materiel_reference}
//                         </div>
//                       )}
//                     </td>
//                     <td>
//                       <div className="font-semibold">{installation.logiciel_nom || 'N/A'}</div>
//                       {installation.logiciel_version && (
//                         <div className="text-sm text-base-content opacity-60">
//                           v{installation.logiciel_version}
//                         </div>
//                       )}
//                     </td>
//                     <td>
//                       <span className="text-sm">
//                         {installation.date_installation ? formatDate(installation.date_installation) : '-'}
//                       </span>
//                     </td>
//                     <td>
//                       <div className={`badge ${getStatutBadge(installation.statut)} badge-lg gap-1`}>
//                         {getStatutIcon(installation.statut)}
//                         {getStatutText(installation.statut)}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex justify-center space-x-1">
//                         <button
//                           onClick={() => handleEdit(installation)}
//                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                           title="Modifier"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         {installation.statut === 'actif' && (
//                           <button
//                             onClick={() => handleDesinstaller(installation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
//                             title="Désinstaller"
//                           >
//                             <X className="h-4 w-4" />
//                           </button>
//                         )}
//                         <button
//                           onClick={() => handleDelete(installation.id)}
//                           className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                           title="Supprimer"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredInstallations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Search className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune installation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterStatut 
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune installation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'installation */}
//       <InstallationLogicielForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingInstallation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         installation={editingInstallation}
//         materiels={materiels}
//         logiciels={logiciels}
//       />
//     </div>
//   );
// };

// export default InstallationsLogiciels;






// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Filter, Edit, Trash2, CheckCircle, X, Package, Download, CheckSquare, Square, Monitor } from 'lucide-react';
// import { InstallationLogiciel, Materiel, Logiciel } from '../types';
// import { installationsAPI, materielsAPI, logicielsAPI } from '../services/api';
// import InstallationLogicielForm from '../components/InstallationLogicielForm';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): any[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): any[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): any[] => {
//   if (!response || !response.data) {
//     console.log('❌ Réponse vide ou sans data:', response);
//     return [];
//   }
  
//   if (Array.isArray(response.data)) {
//     return response.data;
//   }
  
//   if (response.data.results && Array.isArray(response.data.results)) {
//     return response.data.results;
//   }
  
//   if (response.data.data && Array.isArray(response.data.data)) {
//     return response.data.data;
//   }
  
//   if (typeof response.data === 'object' && !Array.isArray(response.data)) {
//     return [response.data];
//   }
  
//   console.warn('⚠️ Format de réponse non reconnu:', response.data);
//   return [];
// };

// interface InstallationFormData {
//   materiel: number;
//   logiciel: number;
//   date_installation: string;
//   statut: 'actif' | 'desinstalle' | 'en_erreur';
// }

// const InstallationsLogiciels: React.FC = () => {
//   const [installations, setInstallations] = useState<InstallationLogiciel[]>([]);
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
//   const [filteredInstallations, setFilteredInstallations] = useState<InstallationLogiciel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingInstallation, setEditingInstallation] = useState<InstallationLogiciel | undefined>();
//   const [selectedInstallations, setSelectedInstallations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterInstallations();
//   }, [installations, searchTerm, filterStatut]);

//   useEffect(() => {
//     if (filteredInstallations.length > 0 && selectedInstallations.length === filteredInstallations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedInstallations, filteredInstallations]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [installationsRes, materielsRes, logicielsRes] = await Promise.all([
//         installationsAPI.getAll(),
//         materielsAPI.getAll(),
//         logicielsAPI.getAll()
//       ]);

//       const extractedInstallations = extractDataFromResponse(installationsRes);
//       const extractedMateriels = extractDataFromResponse(materielsRes);
//       const extractedLogiciels = extractDataFromResponse(logicielsRes);

//       console.log('📦 Installations chargées:', extractedInstallations);
//       console.log('💻 Matériels chargés:', extractedMateriels);
//       console.log('🔧 Logiciels chargés:', extractedLogiciels);

//       setInstallations(extractedInstallations);
//       setMateriels(extractedMateriels);
//       setLogiciels(extractedLogiciels);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement:', err);
//       setError('Erreur lors du chargement des données');
//       showMessage('error', 'Erreur lors du chargement des données');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterInstallations = () => {
//     let filtered = safeArray(installations);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, installation => 
//         installation.materiel_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         installation.logiciel_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         installation.materiel_reference?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterStatut) {
//       filtered = safeFilter(filtered, installation => installation.statut === filterStatut);
//     }

//     setFilteredInstallations(filtered);
//     setSelectedInstallations([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // CORRECTION : handleSubmit améliorée avec debug
//   const handleSubmit = async (formData: InstallationFormData) => {
//     try {
//       console.group('🔧 DEBUG Installation Submission');
//       console.log('Données du formulaire:', formData);
      
//       // Formater les données pour l'API
//       const apiData = {
//         materiel: formData.materiel,
//         logiciel: formData.logiciel,
//         date_installation: formData.date_installation,
//         statut: formData.statut
//       };
      
//       console.log('📤 Données API formatées:', apiData);
//       console.groupEnd();

//       if (editingInstallation) {
//         const response = await installationsAPI.update(editingInstallation.id, apiData);
//         console.log('✅ Réponse update:', response.data);
//         showMessage('success', 'Installation modifiée avec succès');
//       } else {
//         const response = await installationsAPI.create(apiData);
//         console.log('✅ Réponse create:', response.data);
//         showMessage('success', 'Installation créée avec succès');
//       }
      
//       await fetchData();
//       setIsFormOpen(false);
//       setEditingInstallation(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur détaillée:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         config: error.config
//       });
      
//       // Afficher les erreurs spécifiques du backend
//       if (error.response?.data?.non_field_errors) {
//         showMessage('error', `Erreur de validation: ${error.response.data.non_field_errors.join(', ')}`);
//       } else if (error.response?.data) {
//         // Afficher toutes les erreurs de champ
//         const errorMessages = [];
//         for (const [field, errors] of Object.entries(error.response.data)) {
//           if (field === 'non_field_errors') continue;
//           errorMessages.push(`${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`);
//         }
//         showMessage('error', `Erreurs: ${errorMessages.join('; ')}`);
//       } else {
//         showMessage('error', `Erreur réseau: ${error.message}`);
//       }
//     }
//   };

//   const toggleSelectInstallation = (id: number) => {
//     setSelectedInstallations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedInstallations([]);
//     } else {
//       const allIds = filteredInstallations.map(i => i.id);
//       setSelectedInstallations(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedInstallations.length === 0) {
//       showMessage('error', 'Aucune installation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedInstallations.length} installation(s) ?`)) {
//       try {
//         for (const id of selectedInstallations) {
//           await installationsAPI.delete(id);
//         }
        
//         showMessage('success', `${selectedInstallations.length} installation(s) supprimée(s) avec succès`);
//         setSelectedInstallations([]);
//         fetchData();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression des installations');
//       }
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedInstallations.length === 0) {
//       showMessage('error', 'Aucune installation sélectionnée');
//       return;
//     }

//     if (selectedInstallations.length === 1) {
//       const installation = installations.find(i => i.id === selectedInstallations[0]);
//       if (installation) {
//         handleEdit(installation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedInstallations.length} installations`);
//     }
//   };

//   const handleEdit = (installation: InstallationLogiciel) => {
//     setEditingInstallation(installation);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette installation ?')) {
//       try {
//         await installationsAPI.delete(id);
//         showMessage('success', 'Installation supprimée avec succès');
//         fetchData();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression');
//       }
//     }
//   };

//   const handleDesinstaller = async (id: number) => {
//     try {
//       await installationsAPI.desinstaller(id);
//       showMessage('success', 'Logiciel désinstallé avec succès');
//       fetchData();
//     } catch (error) {
//       showMessage('error', 'Erreur lors de la désinstallation');
//     }
//   };

//   const handleAddNew = () => {
//     setEditingInstallation(undefined);
//     setIsFormOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredInstallations.map(i => ({
//         Matériel: i.materiel_nom || 'N/A',
//         Référence: i.materiel_reference || 'N/A',
//         Logiciel: i.logiciel_nom || 'N/A',
//         Version: i.logiciel_version || 'N/A',
//         'Date installation': i.date_installation ? new Date(i.date_installation).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         Statut: getStatutText(i.statut)
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `installations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterStatut('');
//     setSelectedInstallations([]);
//   };

//   const getStatutBadge = (statut: string) => {
//     const badges = {
//       actif: 'badge-success',
//       desinstalle: 'badge-neutral',
//       en_erreur: 'badge-error'
//     };
//     return badges[statut as keyof typeof badges] || 'badge-neutral';
//   };

//   const getStatutText = (statut: string) => {
//     const texts = {
//       actif: 'Actif',
//       desinstalle: 'Désinstallé',
//       en_erreur: 'En erreur'
//     };
//     return texts[statut as keyof typeof texts] || statut;
//   };

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case 'actif':
//         return <CheckCircle className="w-3 h-3 mr-1" />;
//       case 'desinstalle':
//       case 'en_erreur':
//         return <X className="w-3 h-3 mr-1" />;
//       default:
//         return <Package className="w-3 h-3 mr-1" />;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR');
//     } catch {
//       return '-';
//     }
//   };

//   // Statistiques avec safeArray et safeFilter
//   const stats = {
//     total: safeArray(installations).length,
//     actifs: safeFilter(installations, i => i.statut === 'actif').length,
//     desinstalles: safeFilter(installations, i => i.statut === 'desinstalle').length,
//     en_erreur: safeFilter(installations, i => i.statut === 'en_erreur').length
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des installations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages d'alerte */}
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && !message && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Installations sur Matériel</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             Association des logiciels avec le parc matériel ({safeArray(filteredInstallations).length} installation{safeArray(filteredInstallations).length !== 1 ? 's' : ''})
//             {selectedInstallations.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedInstallations.length} sélectionnée(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleExport}
//             className="btn btn-outline btn-sm"
//             title="Exporter la liste"
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle installation
//           </button>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
//                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
//               </div>
//               <Package className="w-6 h-6 text-blue-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Actifs</p>
//                 <p className="text-2xl font-bold text-primary">{stats.actifs}</p>
//               </div>
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Désinstallés</p>
//                 <p className="text-2xl font-bold text-secondary">{stats.desinstalles}</p>
//               </div>
//               <X className="w-6 h-6 text-gray-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">En erreur</p>
//                 <p className="text-2xl font-bold text-error">{stats.en_erreur}</p>
//               </div>
//               <X className="w-6 h-6 text-red-500" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filtres et recherche */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Matériel, logiciel, référence..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Statut</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterStatut}
//                 onChange={(e) => setFilterStatut(e.target.value)}
//               >
//                 <option value="">Tous les statuts</option>
//                 <option value="actif">Actif</option>
//                 <option value="desinstalle">Désinstallé</option>
//                 <option value="en_erreur">En erreur</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔄 Actions</span>
//               </label>
//               <button
//                 onClick={resetFilters}
//                 className="btn btn-outline w-full gap-2"
//               >
//                 <Filter className="h-4 w-4" />
//                 Réinitialiser
//               </button>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📈 Statistiques</span>
//               </label>
//               <div className="text-sm text-base-content opacity-70">
//                 {safeArray(filteredInstallations).length} / {safeArray(installations).length} installations
//               </div>
//             </div>
//           </div>

//           {/* Actions de sélection */}
//           {selectedInstallations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedInstallations.length} installation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedInstallations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedInstallations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedInstallations([])}
//                     className="btn btn-ghost btn-sm"
//                   >
//                     <X className="h-4 w-4" />
//                     Annuler
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tableau des installations */}
//       <div className="card bg-base-200 shadow-xl">
//         <div className="card-body p-0">
//           <div className="overflow-x-auto">
//             <table className="table table-zebra w-full">
//               <thead>
//                 <tr className="bg-base-300">
//                   <th className="font-bold w-12 text-center">
//                     <div className="flex justify-center">
//                       <button
//                         onClick={toggleSelectAll}
//                         className="btn btn-ghost btn-xs p-1 hover:bg-base-200 transition-colors"
//                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-5 w-5 text-primary" />
//                         ) : (
//                           <Square className="h-5 w-5 text-base-content/40" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th className="font-bold">Matériel</th>
//                   <th className="font-bold">Logiciel</th>
//                   <th className="font-bold">Date installation</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredInstallations).map((installation) => (
//                   <tr key={installation.id} className="hover">
//                     <td className="text-center">
//                       <div className="flex justify-center">
//                         <input
//                           type="checkbox"
//                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                           checked={selectedInstallations.includes(installation.id)}
//                           onChange={() => toggleSelectInstallation(installation.id)}
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       <div className="font-semibold">{installation.materiel_nom || 'N/A'}</div>
//                       {installation.materiel_reference && (
//                         <div className="text-sm text-base-content opacity-60">
//                           {installation.materiel_reference}
//                         </div>
//                       )}
//                     </td>
//                     <td>
//                       <div className="font-semibold">{installation.logiciel_nom || 'N/A'}</div>
//                       {installation.logiciel_version && (
//                         <div className="text-sm text-base-content opacity-60">
//                           v{installation.logiciel_version}
//                         </div>
//                       )}
//                     </td>
//                     <td>
//                       <span className="text-sm">
//                         {installation.date_installation ? formatDate(installation.date_installation) : '-'}
//                       </span>
//                     </td>
//                     <td>
//                       <div className={`badge ${getStatutBadge(installation.statut)} badge-lg gap-1`}>
//                         {getStatutIcon(installation.statut)}
//                         {getStatutText(installation.statut)}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex justify-center space-x-1">
//                         <button
//                           onClick={() => handleEdit(installation)}
//                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                           title="Modifier"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         {installation.statut === 'actif' && (
//                           <button
//                             onClick={() => handleDesinstaller(installation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
//                             title="Désinstaller"
//                           >
//                             <X className="h-4 w-4" />
//                           </button>
//                         )}
//                         <button
//                           onClick={() => handleDelete(installation.id)}
//                           className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                           title="Supprimer"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredInstallations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Search className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune installation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterStatut 
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune installation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'installation */}
//       <InstallationLogicielForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingInstallation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         installation={editingInstallation}
//         materiels={materiels}
//         logiciels={logiciels}
//       />
//     </div>
//   );
// };

// export default InstallationsLogiciels;




import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, CheckCircle, X, Package, Download, CheckSquare, Square, Monitor, Calendar } from 'lucide-react';
import { InstallationLogiciel, Materiel, Logiciel } from '../types';
import { installationsAPI, materielsAPI, logicielsAPI } from '../services/api';
import InstallationLogicielForm from '../components/InstallationLogicielForm';

// Fonctions helper pour la sécurité des tableaux
const safeArray = (data: any): any[] => {
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): any[] => {
  if (!Array.isArray(array)) return [];
  return array.filter(condition);
};

const extractDataFromResponse = (response: any): any[] => {
  if (!response || !response.data) {
    console.log('❌ Réponse vide ou sans data:', response);
    return [];
  }
  
  if (Array.isArray(response.data)) {
    return response.data;
  }
  
  if (response.data.results && Array.isArray(response.data.results)) {
    return response.data.results;
  }
  
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  if (typeof response.data === 'object' && !Array.isArray(response.data)) {
    return [response.data];
  }
  
  console.warn('⚠️ Format de réponse non reconnu:', response.data);
  return [];
};

interface InstallationFormData {
  materiel: number;
  logiciel: number;
  date_installation: string;
  statut: 'actif' | 'desinstalle' | 'en_erreur';
}

const InstallationsLogiciels: React.FC = () => {
  const [installations, setInstallations] = useState<InstallationLogiciel[]>([]);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
  const [filteredInstallations, setFilteredInstallations] = useState<InstallationLogiciel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInstallation, setEditingInstallation] = useState<InstallationLogiciel | undefined>();
  const [selectedInstallations, setSelectedInstallations] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatut, setFilterStatut] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterInstallations();
  }, [installations, searchTerm, filterStatut]);

  useEffect(() => {
    if (filteredInstallations.length > 0 && selectedInstallations.length === filteredInstallations.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedInstallations, filteredInstallations]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [installationsRes, materielsRes, logicielsRes] = await Promise.all([
        installationsAPI.getAll(),
        materielsAPI.getAll(),
        logicielsAPI.getAll()
      ]);

      const extractedInstallations = extractDataFromResponse(installationsRes);
      const extractedMateriels = extractDataFromResponse(materielsRes);
      const extractedLogiciels = extractDataFromResponse(logicielsRes);

      console.log('📦 Installations chargées:', extractedInstallations);
      console.log('💻 Matériels chargés:', extractedMateriels);
      console.log('🔧 Logiciels chargés:', extractedLogiciels);

      setInstallations(extractedInstallations);
      setMateriels(extractedMateriels);
      setLogiciels(extractedLogiciels);
    } catch (err: any) {
      console.error('❌ Erreur chargement:', err);
      setError('Erreur lors du chargement des données');
      showMessage('error', 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const filterInstallations = () => {
    let filtered = safeArray(installations);

    if (searchTerm) {
      filtered = safeFilter(filtered, installation => 
        installation.materiel_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.logiciel_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.materiel_reference?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatut) {
      filtered = safeFilter(filtered, installation => installation.statut === filterStatut);
    }

    setFilteredInstallations(filtered);
    setSelectedInstallations([]);
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (formData: InstallationFormData) => {
    try {
      console.group('🔧 DEBUG Installation Submission');
      console.log('Données du formulaire:', formData);
      
      // Formater les données pour l'API
      const apiData = {
        materiel: formData.materiel,
        logiciel: formData.logiciel,
        date_installation: formData.date_installation,
        statut: formData.statut
      };
      
      console.log('📤 Données API formatées:', apiData);
      console.groupEnd();

      if (editingInstallation) {
        const response = await installationsAPI.update(editingInstallation.id, apiData);
        console.log('✅ Réponse update:', response.data);
        showMessage('success', 'Installation modifiée avec succès');
      } else {
        const response = await installationsAPI.create(apiData);
        console.log('✅ Réponse create:', response.data);
        showMessage('success', 'Installation créée avec succès');
      }
      
      await fetchData();
      setIsFormOpen(false);
      setEditingInstallation(undefined);
    } catch (error: any) {
      console.error('❌ Erreur détaillée:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      // Afficher les erreurs spécifiques du backend
      if (error.response?.data?.non_field_errors) {
        showMessage('error', `Erreur de validation: ${error.response.data.non_field_errors.join(', ')}`);
      } else if (error.response?.data) {
        // Afficher toutes les erreurs de champ
        const errorMessages = [];
        for (const [field, errors] of Object.entries(error.response.data)) {
          if (field === 'non_field_errors') continue;
          errorMessages.push(`${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`);
        }
        showMessage('error', `Erreurs: ${errorMessages.join('; ')}`);
      } else {
        showMessage('error', `Erreur réseau: ${error.message}`);
      }
    }
  };

  const toggleSelectInstallation = (id: number) => {
    setSelectedInstallations(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedInstallations([]);
    } else {
      const allIds = filteredInstallations.map(i => i.id);
      setSelectedInstallations(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedInstallations.length === 0) {
      showMessage('error', 'Aucune installation sélectionnée');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedInstallations.length} installation(s) ?`)) {
      try {
        for (const id of selectedInstallations) {
          await installationsAPI.delete(id);
        }
        
        showMessage('success', `${selectedInstallations.length} installation(s) supprimée(s) avec succès`);
        setSelectedInstallations([]);
        fetchData();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression des installations');
      }
    }
  };

  const handleEditSelected = () => {
    if (selectedInstallations.length === 0) {
      showMessage('error', 'Aucune installation sélectionnée');
      return;
    }

    if (selectedInstallations.length === 1) {
      const installation = installations.find(i => i.id === selectedInstallations[0]);
      if (installation) {
        handleEdit(installation);
      }
    } else {
      showMessage('info', `Édition multiple de ${selectedInstallations.length} installations`);
    }
  };

  const handleEdit = (installation: InstallationLogiciel) => {
    setEditingInstallation(installation);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette installation ?')) {
      try {
        await installationsAPI.delete(id);
        showMessage('success', 'Installation supprimée avec succès');
        fetchData();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const handleDesinstaller = async (id: number) => {
    try {
      await installationsAPI.desinstaller(id);
      showMessage('success', 'Logiciel désinstallé avec succès');
      fetchData();
    } catch (error) {
      showMessage('error', 'Erreur lors de la désinstallation');
    }
  };

  const handleAddNew = () => {
    setEditingInstallation(undefined);
    setIsFormOpen(true);
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredInstallations.map(i => ({
        Matériel: i.materiel_nom || 'N/A',
        Référence: i.materiel_reference || 'N/A',
        Logiciel: i.logiciel_nom || 'N/A',
        Version: i.logiciel_version || 'N/A',
        'Date installation': i.date_installation ? new Date(i.date_installation).toLocaleDateString('fr-FR') : 'Non spécifiée',
        Statut: getStatutText(i.statut)
      }));

      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `installations_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showMessage('success', 'Export CSV réussi !');
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'export');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatut('');
    setSelectedInstallations([]);
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      actif: 'badge-success',
      desinstalle: 'badge-neutral',
      en_erreur: 'badge-error'
    };
    return badges[statut as keyof typeof badges] || 'badge-neutral';
  };

  const getStatutText = (statut: string) => {
    const texts = {
      actif: 'Actif',
      desinstalle: 'Désinstallé',
      en_erreur: 'En erreur'
    };
    return texts[statut as keyof typeof texts] || statut;
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'desinstalle':
      case 'en_erreur':
        return <X className="w-3 h-3 mr-1" />;
      default:
        return <Package className="w-3 h-3 mr-1" />;
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return '-';
    }
  };

  // Fonction pour calculer l'âge de l'installation
  const calculateInstallationAge = (dateString: string): string => {
    try {
      const installationDate = new Date(dateString);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - installationDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Aujourd'hui";
      if (diffDays === 1) return "Hier";
      if (diffDays < 7) return `Il y a ${diffDays} jours`;
      if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
      if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
      return `Il y a ${Math.floor(diffDays / 365)} ans`;
    } catch {
      return '-';
    }
  };

  // Récupérer la date du logiciel depuis l'inventaire
  const getLogicielInventoryDate = (logicielId: number): string | undefined => {
    const logiciel = logiciels.find(l => l.id === logicielId);
    return logiciel?.date_installation;
  };

  // Vérifier si la date correspond à celle de l'inventaire
  const isDateFromInventory = (installation: InstallationLogiciel): boolean => {
    const inventoryDate = getLogicielInventoryDate(installation.logiciel);
    if (!inventoryDate || !installation.date_installation) return false;
    
    try {
      const invDate = new Date(inventoryDate).toDateString();
      const instDate = new Date(installation.date_installation).toDateString();
      return invDate === instDate;
    } catch {
      return false;
    }
  };

  // Vérifier si la date d'installation est aujourd'hui
  const isDateToday = (installation: InstallationLogiciel): boolean => {
    if (!installation.date_installation) return false;
    
    try {
      const installationDate = new Date(installation.date_installation);
      const today = new Date();
      return installationDate.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  };

  // Vérifier si la date d'installation est dans le futur
  const isDateInFuture = (installation: InstallationLogiciel): boolean => {
    if (!installation.date_installation) return false;
    
    try {
      const installationDate = new Date(installation.date_installation);
      const today = new Date();
      return installationDate > today;
    } catch {
      return false;
    }
  };

  // Statistiques avec safeArray et safeFilter
  const stats = {
    total: safeArray(installations).length,
    actifs: safeFilter(installations, i => i.statut === 'actif').length,
    desinstalles: safeFilter(installations, i => i.statut === 'desinstalle').length,
    en_erreur: safeFilter(installations, i => i.statut === 'en_erreur').length,
    // Supprimer cette statistique car la date n'est plus automatique
    // datesAutomatiques: safeFilter(installations, i => isDateFromInventory(i)).length
  };

  if (loading) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des installations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Messages d'alerte */}
      {message && (
        <div className={`alert ${
          message.type === 'success' ? 'alert-success' : 
          message.type === 'error' ? 'alert-error' : 
          'alert-info'
        } mb-4`}>
          <span>{message.text}</span>
        </div>
      )}

      {error && !message && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">🔧 Installations sur Matériel</h1>
          <p className="text-base-content opacity-60 mt-1">
            Association des logiciels avec le parc matériel ({safeArray(filteredInstallations).length} installation{safeArray(filteredInstallations).length !== 1 ? 's' : ''})
            {selectedInstallations.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedInstallations.length} sélectionnée(s))
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="btn btn-outline btn-sm"
            title="Exporter la liste"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button
            onClick={handleAddNew}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle installation
          </button>
        </div>
      </div>

      {/* Statistiques améliorées - MODIFIÉ pour enlever "Dates auto" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Total</p>
                <p className="text-2xl font-bold text-base-content">{stats.total}</p>
              </div>
              <Package className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Actifs</p>
                <p className="text-2xl font-bold text-primary">{stats.actifs}</p>
                <p className="text-xs opacity-60 mt-1">
                  {stats.actifs > 0 ? `${((stats.actifs / stats.total) * 100).toFixed(1)}% du total` : 'Aucun'}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Désinstallés</p>
                <p className="text-2xl font-bold text-secondary">{stats.desinstalles}</p>
              </div>
              <X className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">En erreur</p>
                <p className="text-2xl font-bold text-error">{stats.en_erreur}</p>
              </div>
              <X className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche - MODIFIÉ pour enlever statistiques avec "dates automatiques" */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">🔍 Rechercher</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  placeholder="Matériel, logiciel, référence..."
                  className="input input-bordered w-full pl-10 bg-base-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📊 Statut</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="desinstalle">Désinstallé</option>
                <option value="en_erreur">En erreur</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">🔄 Actions</span>
              </label>
              <button
                onClick={resetFilters}
                className="btn btn-outline w-full gap-2"
              >
                <Filter className="h-4 w-4" />
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Actions de sélection */}
          {selectedInstallations.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-semibold text-primary text-lg">
                      {selectedInstallations.length} installation(s) sélectionnée(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier ({selectedInstallations.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-outline btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer ({selectedInstallations.length})
                  </button>
                  <button
                    onClick={() => setSelectedInstallations([])}
                    className="btn btn-ghost btn-sm"
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tableau des installations amélioré - MODIFIÉ pour enlever "Depuis inventaire" */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-300">
                  <th className="font-bold w-12 text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={toggleSelectAll}
                        className="btn btn-ghost btn-xs p-1 hover:bg-base-200 transition-colors"
                        title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
                      >
                        {isSelectAll ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5 text-base-content/40" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="font-bold">Matériel</th>
                  <th className="font-bold">Logiciel</th>
                  <th className="font-bold">Date installation</th>
                  <th className="font-bold">Âge</th>
                  {/* <th className="font-bold">Indicateur date</th> */}
                  <th className="font-bold">Statut</th>
                  <th className="font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredInstallations).map((installation) => {
                  const isToday = isDateToday(installation);
                  const isFuture = isDateInFuture(installation);
                  const inventoryDate = getLogicielInventoryDate(installation.logiciel);
                  
                  return (
                    <tr key={installation.id} className="hover">
                      <td className="text-center">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
                            checked={selectedInstallations.includes(installation.id)}
                            onChange={() => toggleSelectInstallation(installation.id)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">{installation.materiel_nom || 'N/A'}</div>
                        {installation.materiel_reference && (
                          <div className="text-sm text-base-content opacity-60">
                            {installation.materiel_reference}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="font-semibold">{installation.logiciel_nom || 'N/A'}</div>
                        {installation.logiciel_version && (
                          <div className="text-sm text-base-content opacity-60">
                            v{installation.logiciel_version}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {installation.date_installation ? formatDate(installation.date_installation) : '-'}
                          </span>
                          {inventoryDate && (
                            <span className="text-xs opacity-60 mt-1">
                              📅 Inventaire: {formatDate(inventoryDate)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {installation.date_installation && (
                          <div className="text-sm">
                            {calculateInstallationAge(installation.date_installation)}
                          </div>
                        )}
                      </td>

                      <td>
                        <div className={`badge ${getStatutBadge(installation.statut)} badge-lg gap-1`}>
                          {getStatutIcon(installation.statut)}
                          {getStatutText(installation.statut)}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() => handleEdit(installation)}
                            className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {installation.statut === 'actif' && (
                            <button
                              onClick={() => handleDesinstaller(installation.id)}
                              className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
                              title="Désinstaller"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(installation.id)}
                            className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {safeArray(filteredInstallations).length === 0 && (
            <div className="text-center py-12">
              <div className="text-base-content opacity-40 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Aucune installation trouvée</p>
                <p className="text-sm mt-2">
                  {searchTerm || filterStatut 
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucune installation n'est enregistrée dans le système"
                  }
                </p>
                <button
                  onClick={handleAddNew}
                  className="btn btn-primary mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la première installation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire d'installation */}
      <InstallationLogicielForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingInstallation(undefined);
        }}
        onSubmit={handleSubmit}
        installation={editingInstallation}
        materiels={materiels}
        logiciels={logiciels}
      />
    </div>
  );
};

export default InstallationsLogiciels;