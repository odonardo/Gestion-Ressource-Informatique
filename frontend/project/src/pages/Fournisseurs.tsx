
// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Filter, Download, Edit, Trash2, Building, Phone, Mail, MapPin, X, CheckSquare, Square } from 'lucide-react';
// import { Fournisseur } from '../types';
// import FournisseurForm from '../components/FournisseurForm';
// import { fournisseursAPI } from '../services/api';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Fournisseur[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Fournisseur[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): Fournisseur[] => {
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

// const Fournisseurs: React.FC = () => {
//   const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
//   const [filteredFournisseurs, setFilteredFournisseurs] = useState<Fournisseur[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | undefined>();
//   const [importFile, setImportFile] = useState<File | null>(null);
//   const [selectedFournisseurs, setSelectedFournisseurs] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

//   useEffect(() => {
//     fetchFournisseurs();
//   }, []);

//   useEffect(() => {
//     filterFournisseurs();
//   }, [fournisseurs, searchTerm, filterType]);

//   useEffect(() => {
//     // Mettre à jour l'état de sélection globale
//     if (filteredFournisseurs.length > 0 && selectedFournisseurs.length === filteredFournisseurs.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedFournisseurs, filteredFournisseurs]);

//   const fetchFournisseurs = async () => {
//     try {
//       setLoading(true);
//       const response = await fournisseursAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       setFournisseurs(extractedData);
//     } catch (err: any) {
//       setError('Erreur lors du chargement des fournisseurs');
//       showMessage('error', 'Erreur lors du chargement des fournisseurs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterFournisseurs = () => {
//     let filtered = safeArray(fournisseurs);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, f => 
//         f.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         f.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         f.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         f.adresse?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, f => f.type_fournisseur === filterType);
//     }

//     setFilteredFournisseurs(filtered);
//     // Réinitialiser les sélections quand les filtres changent
//     setSelectedFournisseurs([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Gestion de la sélection individuelle
//   const toggleSelectFournisseur = (id: number) => {
//     setSelectedFournisseurs(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   // Gestion de la sélection globale
//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       // Désélectionner tous
//       setSelectedFournisseurs([]);
//     } else {
//       // Sélectionner tous les fournisseurs filtrés
//       const allIds = filteredFournisseurs.map(f => f.id);
//       setSelectedFournisseurs(allIds);
//     }
//   };

//   // Supprimer les fournisseurs sélectionnés
//   const handleDeleteSelected = async () => {
//     if (selectedFournisseurs.length === 0) {
//       showMessage('error', 'Aucun fournisseur sélectionné');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFournisseurs.length} fournisseur(s) ?`)) {
//       try {
//         // Supprimer chaque fournisseur sélectionné
//         for (const id of selectedFournisseurs) {
//           await fournisseursAPI.delete(id);
//         }
        
//         showMessage('success', `${selectedFournisseurs.length} fournisseur(s) supprimé(s) avec succès`);
//         setSelectedFournisseurs([]);
//         fetchFournisseurs();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression des fournisseurs');
//       }
//     }
//   };

//   // Modifier les fournisseurs sélectionnés
//   const handleEditSelected = () => {
//     if (selectedFournisseurs.length === 0) {
//       showMessage('error', 'Aucun fournisseur sélectionné');
//       return;
//     }

//     if (selectedFournisseurs.length === 1) {
//       // Si un seul fournisseur sélectionné, ouvrir l'édition normale
//       const fournisseur = fournisseurs.find(f => f.id === selectedFournisseurs[0]);
//       if (fournisseur) {
//         handleEdit(fournisseur);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedFournisseurs.length} fournisseurs`);
//     }
//   };

//   const handleSubmit = async (fournisseurData: Omit<Fournisseur, 'id'>) => {
//     try {
//       if (editingFournisseur) {
//         await fournisseursAPI.update(editingFournisseur.id, fournisseurData);
//         showMessage('success', 'Fournisseur modifié avec succès');
//       } else {
//         await fournisseursAPI.create(fournisseurData);
//         showMessage('success', 'Fournisseur créé avec succès');
//       }
//       fetchFournisseurs();
//       setIsFormOpen(false);
//       setEditingFournisseur(undefined);
//     } catch (error) {
//       showMessage('error', 'Erreur lors de la sauvegarde');
//     }
//   };

//   const handleEdit = (fournisseur: Fournisseur) => {
//     setEditingFournisseur(fournisseur);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
//       try {
//         await fournisseursAPI.delete(id);
//         showMessage('success', 'Fournisseur supprimé avec succès');
//         fetchFournisseurs();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression');
//       }
//     }
//   };

//   const handleAddNew = () => {
//     setEditingFournisseur(undefined);
//     setIsFormOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredFournisseurs.map(f => ({
//         Nom: f.nom,
//         'Type Fournisseur': getTypeText(f.type_fournisseur || 'autre'),
//         Email: f.contact_email,
//         Téléphone: f.telephone,
//         Adresse: f.adresse
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `fournisseurs_${new Date().toISOString().split('T')[0]}.csv`);
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
//     setFilterType('');
//     setSelectedFournisseurs([]);
//   };

//   const getTypeBadge = (type: string) => {
//     const badges = {
//       materiel: 'badge-primary',
//       logiciel: 'badge-success',
//       mixte: 'badge-neutral'
//     };

//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       materiel: 'Matériel',
//       logiciel: 'Logiciel',
//       mixte: 'Mixte'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des fournisseurs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Message de notification */}
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🏢 Gestion des Fournisseurs</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             Liste et gestion des partenaires fournisseurs ({safeArray(filteredFournisseurs).length} fournisseurs)
//             {selectedFournisseurs.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedFournisseurs.length} sélectionné(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {/* Export */}
//           <button
//             onClick={handleExport}
//             className="btn btn-outline btn-sm"
//             title="Exporter la liste"
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button>

//           {/* Ajouter */}
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouveau fournisseur
//           </button>
//         </div>
//       </div>

//       {/* Filtres et recherche */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Recherche */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Nom, email, téléphone..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Filtre par type */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="materiel">Matériel</option>
//                 <option value="logiciel">Logiciel</option>
//                 <option value="mixte">Mixte</option>
//               </select>
//             </div>

//             {/* Réinitialiser */}
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

//             {/* Statistiques */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📈 Statistiques</span>
//               </label>
//               <div className="text-sm text-base-content opacity-70">
//                 {safeArray(filteredFournisseurs).length} / {safeArray(fournisseurs).length} fournisseurs
//               </div>
//             </div>
//           </div>

//           {/* Actions de sélection */}
//           {selectedFournisseurs.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedFournisseurs.length} fournisseur(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedFournisseurs.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedFournisseurs.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedFournisseurs([])}
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

//       {/* Tableau des fournisseurs */}
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
//                   <th className="font-bold">Nom</th>
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Email</th>
//                   <th className="font-bold">Téléphone</th>
//                   <th className="font-bold">Adresse</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredFournisseurs).map((fournisseur) => (
//                   <tr key={fournisseur.id} className="hover">
//                     <td className="text-center">
//                       <div className="flex justify-center">
//                         <input
//                           type="checkbox"
//                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                           checked={selectedFournisseurs.includes(fournisseur.id)}
//                           onChange={() => toggleSelectFournisseur(fournisseur.id)}
//                         />
//                       </div>
//                     </td>
//                     <td className="font-semibold">
//                       <div className="flex items-center gap-2">
//                         <Building className="h-4 w-4 text-primary" />
//                         {fournisseur.nom}
//                       </div>
//                     </td>
//                     <td>
//                       <div className={`badge ${getTypeBadge(fournisseur.type_fournisseur || 'autre')}`}>
//                         {getTypeText(fournisseur.type_fournisseur || 'autre')}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex items-center gap-1">
//                         <Mail className="h-3 w-3 opacity-70" />
//                         {fournisseur.contact_email || 'Non spécifié'}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex items-center gap-1">
//                         <Phone className="h-3 w-3 opacity-70" />
//                         {fournisseur.telephone || 'Non spécifié'}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex items-center gap-1 max-w-xs">
//                         <MapPin className="h-3 w-3 opacity-70 flex-shrink-0" />
//                         <span className="truncate">{fournisseur.adresse || 'Non spécifiée'}</span>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex justify-center space-x-1">
//                         <button
//                           onClick={() => handleEdit(fournisseur)}
//                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                           title="Modifier"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(fournisseur.id)}
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

//           {safeArray(filteredFournisseurs).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Building className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucun fournisseur trouvé</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucun fournisseur n'est enregistré dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de fournisseur */}
//       <FournisseurForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingFournisseur(undefined);
//         }}
//         onSubmit={handleSubmit}
//         fournisseur={editingFournisseur}
//       />
//     </div>
//   );
// };

// export default Fournisseurs;




// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Filter, Download, Edit, Trash2, Building, 
//   Phone, Mail, MapPin, X, CheckSquare, Square, RefreshCw,
//   Users, Package, Globe, TrendingUp, Activity, Award, Briefcase,
//   Eye // Ajout de l'icône Eye manquante
// } from 'lucide-react';
// import { Fournisseur } from '../types';
// import FournisseurForm from '../components/FournisseurForm';
// import { fournisseursAPI } from '../services/api';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Fournisseur[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Fournisseur[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): Fournisseur[] => {
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

// // Fonction de notification
// const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
//   const notification = document.createElement('div');
//   notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
//     type === 'success' ? 'bg-green-500 text-white' :
//     type === 'error' ? 'bg-red-500 text-white' :
//     type === 'warning' ? 'bg-yellow-500 text-white' :
//     'bg-blue-500 text-white'
//   }`;
//   notification.innerHTML = `
//     <div class="flex items-center gap-2">
//       ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
//       <span>${message}</span>
//     </div>
//   `;
  
//   document.body.appendChild(notification);
  
//   setTimeout(() => {
//     document.body.removeChild(notification);
//   }, 5000);
// };

// const Fournisseurs: React.FC = () => {
//   const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
//   const [filteredFournisseurs, setFilteredFournisseurs] = useState<Fournisseur[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | undefined>();
//   const [selectedFournisseurs, setSelectedFournisseurs] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
  
//   // États pour la confirmation de suppression
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [fournisseurToDelete, setFournisseurToDelete] = useState<number | null>(null);
//   const [deleteMultiple, setDeleteMultiple] = useState(false);

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     materiel: 0,
//     logiciel: 0,
//     mixte: 0,
//     autres: 0,
//     avecContact: 0,
//     sansContact: 0,
//     parPays: {} as Record<string, number>,
//     notesMoyenne: 0,
//     fournisseursActifs: 0,
//     evolution30j: 8, // valeur simulée
//   });

//   useEffect(() => {
//     fetchFournisseurs();
//   }, []);

//   useEffect(() => {
//     filterFournisseurs();
//     if (fournisseurs.length > 0) {
//       calculerStatistiques(fournisseurs);
//     }
//   }, [fournisseurs, searchTerm, filterType]);

//   useEffect(() => {
//     if (filteredFournisseurs.length > 0 && selectedFournisseurs.length === filteredFournisseurs.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedFournisseurs, filteredFournisseurs]);

//   const fetchFournisseurs = async () => {
//     try {
//       setLoading(true);
//       const response = await fournisseursAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       console.log('🏢 Fournisseurs chargés:', extractedData);
//       setFournisseurs(extractedData);
//       // showNotification('success', `✅ ${extractedData.length} fournisseurs chargés`);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement fournisseurs:', err);
//       setError('Erreur lors du chargement des fournisseurs');
//       showNotification('error', '❌ Erreur lors du chargement des fournisseurs');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const calculerStatistiques = (data: Fournisseur[]) => {
//     const pays: Record<string, number> = {};
//     let totalNotes = 0;
//     let countNotes = 0;

//     data.forEach(fournisseur => {
//       // Compter par type
//       const type = fournisseur.type_fournisseur || 'autre';
      
//       // Compter par pays (extrait de l'adresse)
//       if (fournisseur.adresse) {
//         // Simple extraction de pays - à adapter selon votre format
//         const paysMatch = fournisseur.adresse.match(/,\s*([A-Za-z\s]+)$/);
//         if (paysMatch) {
//           const paysNom = paysMatch[1].trim();
//           pays[paysNom] = (pays[paysNom] || 0) + 1;
//         }
//       }

//       // Notes
//       if (fournisseur.note && typeof fournisseur.note === 'number') {
//         totalNotes += fournisseur.note;
//         countNotes++;
//       }
//     });

//     const stats = {
//       total: data.length,
//       materiel: data.filter(f => f.type_fournisseur === 'materiel').length,
//       logiciel: data.filter(f => f.type_fournisseur === 'logiciel').length,
//       mixte: data.filter(f => f.type_fournisseur === 'mixte').length,
//       autres: data.filter(f => !f.type_fournisseur || !['materiel', 'logiciel', 'mixte'].includes(f.type_fournisseur)).length,
//       avecContact: data.filter(f => f.contact_email || f.telephone).length,
//       sansContact: data.filter(f => !f.contact_email && !f.telephone).length,
//       parPays: pays,
//       notesMoyenne: countNotes > 0 ? Math.round((totalNotes / countNotes) * 10) / 10 : 0,
//       fournisseursActifs: data.filter(f => f.statut === 'actif' || !f.statut).length,
//       evolution30j: 8 // Valeur simulée
//     };
    
//     setStatistiques(stats);
//   };

//   const filterFournisseurs = () => {
//     let filtered = safeArray(fournisseurs);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, f => 
//         f.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         f.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         f.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         f.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (f.note && f.note.toString().includes(searchTerm))
//       );
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, f => f.type_fournisseur === filterType);
//     }

//     setFilteredFournisseurs(filtered);
//     setSelectedFournisseurs([]);
//   };

//   const handleSubmit = async (fournisseurData: Omit<Fournisseur, 'id'>) => {
//     try {
//       console.group('🔧 DEBUG Fournisseur Submission');
//       console.log('Données du formulaire:', fournisseurData);
      
//       const apiData: any = {
//         nom: fournisseurData.nom?.trim() || '',
//         type_fournisseur: fournisseurData.type_fournisseur || 'autre',
//         contact_email: fournisseurData.contact_email?.trim() || '',
//         telephone: fournisseurData.telephone?.trim() || '',
//         adresse: fournisseurData.adresse?.trim() || '',
//         note: fournisseurData.note || null,
//         statut: fournisseurData.statut || 'actif'
//       };
      
//       console.log('📤 Données API formatées:', apiData);
//       console.groupEnd();

//       if (editingFournisseur) {
//         const response = await fournisseursAPI.update(editingFournisseur.id, apiData);
//         console.log('✅ Réponse update:', response.data);
//         showNotification('success', '✅ Fournisseur modifié avec succès');
//       } else {
//         const response = await fournisseursAPI.create(apiData);
//         console.log('✅ Réponse create:', response.data);
//         showNotification('success', '✅ Fournisseur créé avec succès');
//       }
      
//       fetchFournisseurs();
//       setIsFormOpen(false);
//       setEditingFournisseur(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur détaillée:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         config: error.config
//       });
      
//       if (error.response?.data?.non_field_errors) {
//         showNotification('error', `❌ Erreur de validation: ${error.response.data.non_field_errors.join(', ')}`);
//       } else if (error.response?.data) {
//         const errorMessages = [];
//         for (const [field, errors] of Object.entries(error.response.data)) {
//           if (field === 'non_field_errors') continue;
//           errorMessages.push(`${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`);
//         }
//         showNotification('error', `❌ Erreurs: ${errorMessages.join('; ')}`);
//       } else {
//         showNotification('error', `❌ Erreur réseau: ${error.message}`);
//       }
//     }
//   };

//   const toggleSelectFournisseur = (id: number) => {
//     setSelectedFournisseurs(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedFournisseurs([]);
//       showNotification('info', '✅ Sélection annulée');
//     } else {
//       const allIds = filteredFournisseurs.map(f => f.id);
//       setSelectedFournisseurs(allIds);
//       showNotification('success', `✅ ${allIds.length} fournisseurs sélectionnés`);
//     }
//   };

//   // Rafraîchir les données
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchFournisseurs();
//     showNotification('success', '🔄 Données rafraîchies avec succès');
//   };

//   // Confirmation de suppression
//   const confirmDelete = async () => {
//     try {
//       if (deleteMultiple) {
//         // Suppression multiple
//         for (const id of selectedFournisseurs) {
//           await fournisseursAPI.delete(id);
//         }
        
//         showNotification('success', `✅ ${selectedFournisseurs.length} fournisseur(s) supprimé(s) avec succès`);
//         setSelectedFournisseurs([]);
//       } else if (fournisseurToDelete) {
//         // Suppression simple
//         await fournisseursAPI.delete(fournisseurToDelete);
//         showNotification('success', '✅ Fournisseur supprimé avec succès');
//       }
      
//       await fetchFournisseurs();
//     } catch (error) {
//       showNotification('error', '❌ Erreur lors de la suppression');
//     } finally {
//       setShowDeleteConfirm(false);
//       setFournisseurToDelete(null);
//       setDeleteMultiple(false);
//     }
//   };

//   const handleDeleteSelected = () => {
//     if (selectedFournisseurs.length === 0) {
//       showNotification('error', '❌ Aucun fournisseur sélectionné');
//       return;
//     }

//     setDeleteMultiple(true);
//     setShowDeleteConfirm(true);
//   };

//   const handleDelete = (id: number) => {
//     setFournisseurToDelete(id);
//     setDeleteMultiple(false);
//     setShowDeleteConfirm(true);
//   };

//   const handleEditSelected = () => {
//     if (selectedFournisseurs.length === 0) {
//       showNotification('error', '❌ Aucun fournisseur sélectionné');
//       return;
//     }

//     if (selectedFournisseurs.length === 1) {
//       const fournisseur = fournisseurs.find(f => f.id === selectedFournisseurs[0]);
//       if (fournisseur) {
//         handleEdit(fournisseur);
//       }
//     } else {
//       showNotification('info', `📝 Édition multiple de ${selectedFournisseurs.length} fournisseurs`);
//     }
//   };

//   const handleEdit = (fournisseur: Fournisseur) => {
//     setEditingFournisseur(fournisseur);
//     setIsFormOpen(true);
//     showNotification('info', `✏️ Modification du fournisseur "${fournisseur.nom}"`);
//   };

//   const handleAddNew = () => {
//     setEditingFournisseur(undefined);
//     setIsFormOpen(true);
//     showNotification('info', '📝 Ouverture du formulaire de création de fournisseur');
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredFournisseurs.map(f => ({
//         Nom: f.nom,
//         'Type Fournisseur': getTypeText(f.type_fournisseur || 'autre'),
//         Email: f.contact_email || 'Non spécifié',
//         Téléphone: f.telephone || 'Non spécifié',
//         Adresse: f.adresse || 'Non spécifiée',
//         Note: f.note || 'Non noté',
//         Statut: f.statut || 'actif'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `fournisseurs_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showNotification('success', '✅ Export CSV réussi !');
//     } catch (error) {
//       showNotification('error', '❌ Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setSelectedFournisseurs([]);
//     showNotification('info', '🔄 Filtres réinitialisés');
//   };

//   const getTypeBadge = (type: string) => {
//     const badges = {
//       materiel: 'badge-primary',
//       logiciel: 'badge-success',
//       mixte: 'badge-neutral',
//       autre: 'badge-secondary'
//     };

//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       materiel: 'Matériel',
//       logiciel: 'Logiciel',
//       mixte: 'Mixte',
//       autre: 'Autre'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getNoteColor = (note: number) => {
//     if (note >= 4) return 'text-green-500';
//     if (note >= 3) return 'text-yellow-500';
//     return 'text-red-500';
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des fournisseurs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Modal de confirmation de suppression */}
//       {showDeleteConfirm && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg">Confirmation de suppression</h3>
//             <p className="py-4">
//               {deleteMultiple 
//                 ? `Êtes-vous sûr de vouloir supprimer ${selectedFournisseurs.length} fournisseur(s) ? Cette action est irréversible.`
//                 : 'Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible.'
//               }
//             </p>
//             <div className="modal-action">
//               <button 
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setFournisseurToDelete(null);
//                   setDeleteMultiple(false);
//                   showNotification('info', '🗑️ Suppression annulée');
//                 }}
//               >
//                 Annuler
//               </button>
//               <button 
//                 className="btn btn-error"
//                 onClick={confirmDelete}
//               >
//                 Supprimer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4 shadow-lg">
//           <span>{error}</span>
//           <button className="btn btn-ghost btn-sm" onClick={fetchFournisseurs}>
//             Réessayer
//           </button>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
//             <Building className="h-8 w-8 text-primary" />
//             Gestion des Fournisseurs
//           </h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray(filteredFournisseurs).length} fournisseur(s) trouvé(s)
//             {selectedFournisseurs.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedFournisseurs.length} sélectionné(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleRefresh}
//             className="btn btn-outline btn-sm"
//             title="Rafraîchir"
//             disabled={refreshing}
//           >
//             <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//             {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouveau fournisseur
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques - 5 CARTES SUR UNE SEULE LIGNE */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        
//         {/* Stat 1 - Total fournisseurs */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Building className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total fournisseurs</p>
//           </div>
//         </div>

//         {/* Stat 2 - Matériel */}
//         <div className="card bg-primary/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Package className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.materiel}</h3>
//             <p className="text-sm opacity-60">Matériel</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.materiel / statistiques.total) * 100) : 0}%
//             </p>
//           </div>
//         </div>

//         {/* Stat 4 - Mixte */}
//         <div className="card bg-neutral/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Globe className="h-8 w-8 text-neutral" />
//             </div>
//             <h3 className="text-3xl font-bold text-neutral mb-1">{statistiques.mixte}</h3>
//             <p className="text-sm opacity-60">Mixte</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.mixte / statistiques.total) * 100) : 0}%
//             </p>
//           </div>
//         </div>
//         {/* Fournisseurs actifs */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Activity className="h-10 w-10 text-success" />
//                 <div>
//                   <h3 className="text-2xl font-bold text-success">{statistiques.fournisseursActifs}</h3>
//                   <p className="text-sm opacity-60">Actifs</p>
//                   <p className="text-xs mt-1">
//                     {statistiques.total > 0 ? Math.round((statistiques.fournisseursActifs / statistiques.total) * 100) : 0}% du parc
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 {/* <h3 className="text-2xl font-bold text-warning">
//                   {statistiques.total - statistiques.fournisseursActifs}
//                 </h3> */}
//                 {/* <p className="text-sm opacity-60">Inactifs</p> */}
//               </div>
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
//                   placeholder="Nom, email, téléphone, adresse..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="materiel">Matériel</option>
//                 <option value="autre">Autre</option>
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
//                 {safeArray(filteredFournisseurs).length} / {safeArray(fournisseurs).length} fournisseurs
//               </div>
//             </div>
//           </div>

//           {/* Actions de sélection */}
//           {selectedFournisseurs.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedFournisseurs.length} fournisseur(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedFournisseurs.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedFournisseurs.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedFournisseurs([])}
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

//       {/* Tableau des fournisseurs */}
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
//                   <th className="font-bold">Nom</th>
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Contact</th>
//                   <th className="font-bold">Adresse</th>
//                   {/* <th className="font-bold">Note</th> */}
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredFournisseurs).map((fournisseur) => (
//                   <tr key={fournisseur.id} className="hover">
//                     <td className="text-center">
//                       <div className="flex justify-center">
//                         <input
//                           type="checkbox"
//                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                           checked={selectedFournisseurs.includes(fournisseur.id)}
//                           onChange={() => toggleSelectFournisseur(fournisseur.id)}
//                         />
//                       </div>
//                     </td>
//                     <td className="font-semibold">
//                       <div className="flex items-center gap-2">
//                         <Building className="h-4 w-4 text-primary" />
//                         {fournisseur.nom}
//                       </div>
//                     </td>
//                     <td>
//                       <div className={`badge ${getTypeBadge(fournisseur.type_fournisseur || 'autre')} gap-1`}>
//                         {getTypeText(fournisseur.type_fournisseur || 'autre')}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="space-y-1">
//                         {fournisseur.contact_email && (
//                           <div className="flex items-center gap-1 text-sm">
//                             <Mail className="h-3 w-3 opacity-70" />
//                             <span className="truncate max-w-[150px]">{fournisseur.contact_email}</span>
//                           </div>
//                         )}
//                         {fournisseur.telephone && (
//                           <div className="flex items-center gap-1 text-sm">
//                             <Phone className="h-3 w-3 opacity-70" />
//                             <span>{fournisseur.telephone}</span>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex items-center gap-1 max-w-[200px]">
//                         <MapPin className="h-3 w-3 opacity-70 flex-shrink-0" />
//                         <span className="truncate">{fournisseur.adresse || 'Non spécifiée'}</span>
//                       </div>
//                     </td>

//                     <td>
//                       <div className="flex justify-center space-x-1">
//                         <button
//                           onClick={() => handleEdit(fournisseur)}
//                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                           title="Modifier"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(fournisseur.id)}
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

//           {safeArray(filteredFournisseurs).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Building className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucun fournisseur trouvé</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType 
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucun fournisseur n'est enregistré dans le système"
//                   }
//                 </p>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-primary btn-sm mt-4"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Ajouter le premier fournisseur
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de fournisseur */}
//       <FournisseurForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingFournisseur(undefined);
//           showNotification('info', '📝 Formulaire de fournisseur fermé');
//         }}
//         onSubmit={handleSubmit}
//         fournisseur={editingFournisseur}
//       />
//     </div>
//   );
// };

// export default Fournisseurs;




// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Filter, Download, Edit, Trash2, Building, 
//   Phone, Mail, MapPin, X, CheckSquare, Square, RefreshCw,
//   Users, Package, Globe, Activity, Briefcase, Eye, 
//   ArrowLeft, BarChart3, TrendingUp, Award, CheckCircle,
//   AlertTriangle, Info, Calendar, History, User as UserIcon
// } from 'lucide-react';
// import { Fournisseur } from '../types';
// import FournisseurForm from '../components/FournisseurForm';
// import { fournisseursAPI } from '../services/api';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Fournisseur[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Fournisseur[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): Fournisseur[] => {
//   if (!response || !response.data) {
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
  
//   return [];
// };

// // Système de notification simple comme pour les matériels
// const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
//   // Créer l'élément de notification
//   const notification = document.createElement('div');
//   notification.className = `fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slideInRight ${
//     type === 'success' ? 'bg-green-500 text-white' :
//     type === 'error' ? 'bg-red-500 text-white' :
//     type === 'warning' ? 'bg-yellow-500 text-white' :
//     'bg-blue-500 text-white'
//   }`;
  
//   // Ajouter le style d'animation
//   const style = document.createElement('style');
//   style.textContent = `
//     @keyframes slideInRight {
//       from { transform: translateX(100%); opacity: 0; }
//       to { transform: translateX(0); opacity: 1; }
//     }
//     .animate-slideInRight {
//       animation: slideInRight 0.3s ease-out;
//     }
//   `;
//   document.head.appendChild(style);
  
//   // Icône selon le type
//   const icon = type === 'success' ? '✅' : 
//                type === 'error' ? '❌' : 
//                type === 'warning' ? '⚠️' : 'ℹ️';
  
//   notification.innerHTML = `
//     <div class="flex items-start gap-3">
//       <div class="text-xl">${icon}</div>
//       <div class="flex-1">
//         ${title ? `<div class="font-bold mb-1">${title}</div>` : ''}
//         <div class="text-sm">${message}</div>
//       </div>
//       <button onclick="this.parentElement.parentElement.remove()" class="btn btn-ghost btn-xs p-1 hover:bg-white/20">
//         <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
//         </svg>
//       </button>
//     </div>
//   `;
  
//   document.body.appendChild(notification);
  
//   // Auto-suppression après 5 secondes
//   setTimeout(() => {
//     if (notification.parentElement) {
//       notification.style.transform = 'translateX(100%)';
//       notification.style.opacity = '0';
//       setTimeout(() => {
//         if (notification.parentElement) {
//           document.body.removeChild(notification);
//         }
//       }, 300);
//     }
//   }, 5000);
// };

// const Fournisseurs: React.FC = () => {
//   const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
//   const [filteredFournisseurs, setFilteredFournisseurs] = useState<Fournisseur[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | undefined>();
//   const [selectedFournisseurs, setSelectedFournisseurs] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
  
//   // États pour la confirmation de suppression
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [fournisseurToDelete, setFournisseurToDelete] = useState<number | null>(null);
//   const [deleteMultiple, setDeleteMultiple] = useState(false);
//   const [deleteMessage, setDeleteMessage] = useState('');

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     materiel: 0,
//     mixte: 0,
//     autres: 0,
//     actif: 0,
//     inactif: 0,
//     avecContact: 0,
//     sansContact: 0,
//     parType: {} as Record<string, number>,
//     parStatut: {} as Record<string, number>,
//     evolution30j: 8,
//   });

//   useEffect(() => {
//     fetchFournisseurs();
    
//     // Afficher une notification de bienvenue
//     setTimeout(() => {
//       showNotification('info', 'Chargement des fournisseurs...', 'Bienvenue');
//     }, 500);
//   }, []);

//   useEffect(() => {
//     filterFournisseurs();
//     if (fournisseurs.length > 0) {
//       calculerStatistiques(fournisseurs);
//     }
//   }, [fournisseurs, searchTerm, filterType, filterStatut]);

//   useEffect(() => {
//     if (filteredFournisseurs.length > 0 && selectedFournisseurs.length === filteredFournisseurs.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedFournisseurs, filteredFournisseurs]);

//   const fetchFournisseurs = async () => {
//     try {
//       setLoading(true);
//       const response = await fournisseursAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       setFournisseurs(extractedData);
//     } catch (err: any) {
//       showNotification('error', 'Erreur lors du chargement des fournisseurs', 'Erreur');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const calculerStatistiques = (data: Fournisseur[]) => {
//     const parType: Record<string, number> = {};
//     const parStatut: Record<string, number> = {};
//     let avecContact = 0;

//     data.forEach(fournisseur => {
//       // Compter par type
//       const type = fournisseur.type_fournisseur || 'autre';
//       parType[type] = (parType[type] || 0) + 1;
      
//       // Compter par statut
//       const statut = fournisseur.statut || 'actif';
//       parStatut[statut] = (parStatut[statut] || 0) + 1;
      
//       // Contact
//       if (fournisseur.contact_email || fournisseur.telephone) {
//         avecContact++;
//       }
//     });

//     setStatistiques({
//       total: data.length,
//       materiel: parType['materiel'] || 0,
//       mixte: parType['mixte'] || 0,
//       autres: parType['autre'] || 0,
//       actif: parStatut['actif'] || 0,
//       inactif: parStatut['inactif'] || 0,
//       avecContact: avecContact,
//       sansContact: data.length - avecContact,
//       parType: parType,
//       parStatut: parStatut,
//       evolution30j: 8
//     });
//   };

//   const filterFournisseurs = () => {
//     let filtered = safeArray(fournisseurs);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, f => 
//         f.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         f.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         f.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         f.adresse?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, f => f.type_fournisseur === filterType);
//     }

//     if (filterStatut) {
//       filtered = safeFilter(filtered, f => f.statut === filterStatut);
//     }

//     setFilteredFournisseurs(filtered);
//     setSelectedFournisseurs([]);
//   };

//   const handleSubmit = async (fournisseurData: Omit<Fournisseur, 'id'>) => {
//     try {
//       const apiData: any = {
//         nom: fournisseurData.nom?.trim() || '',
//         type_fournisseur: fournisseurData.type_fournisseur || 'autre',
//         contact_email: fournisseurData.contact_email?.trim() || '',
//         telephone: fournisseurData.telephone?.trim() || '',
//         adresse: fournisseurData.adresse?.trim() || '',
//         note: fournisseurData.note || null,
//         statut: fournisseurData.statut || 'actif'
//       };
      
//       let actionMessage = '';
      
//       if (editingFournisseur) {
//         await fournisseursAPI.update(editingFournisseur.id, apiData);
//         actionMessage = `Fournisseur "${fournisseurData.nom}" modifié avec succès`;
//         showNotification('success', actionMessage, 'Modification réussie');
//       } else {
//         await fournisseursAPI.create(apiData);
//         actionMessage = `Fournisseur "${fournisseurData.nom}" créé avec succès`;
//         showNotification('success', actionMessage, 'Création réussie');
//       }
      
//       fetchFournisseurs();
//       setIsFormOpen(false);
//       setEditingFournisseur(undefined);
      
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
//       showNotification('error', errorMessage, 'Erreur');
//     }
//   };

//   const toggleSelectFournisseur = (id: number) => {
//     setSelectedFournisseurs(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedFournisseurs([]);
//       showNotification('info', 'Sélection annulée', 'Information');
//     } else {
//       const allIds = filteredFournisseurs.map(f => f.id);
//       setSelectedFournisseurs(allIds);
//       showNotification('success', `${allIds.length} fournisseurs sélectionnés`, 'Sélection');
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchFournisseurs();
//     showNotification('success', 'Données rafraîchies avec succès', 'Rafraîchissement');
//   };

//   const confirmDelete = async () => {
//     try {
//       if (deleteMultiple) {
//         for (const id of selectedFournisseurs) {
//           await fournisseursAPI.delete(id);
//         }
        
//         showNotification('success', `${selectedFournisseurs.length} fournisseur(s) supprimé(s)`, 'Suppression réussie');
//         setSelectedFournisseurs([]);
//       } else if (fournisseurToDelete) {
//         await fournisseursAPI.delete(fournisseurToDelete);
//         showNotification('success', 'Fournisseur supprimé avec succès', 'Suppression réussie');
//       }
      
//       await fetchFournisseurs();
//     } catch (error) {
//       showNotification('error', 'Erreur lors de la suppression', 'Erreur');
//     } finally {
//       setShowDeleteConfirm(false);
//       setFournisseurToDelete(null);
//       setDeleteMultiple(false);
//       setDeleteMessage('');
//     }
//   };

//   const handleDeleteSelected = () => {
//     if (selectedFournisseurs.length === 0) {
//       showNotification('error', 'Aucun fournisseur sélectionné', 'Erreur');
//       return;
//     }

//     setDeleteMultiple(true);
//     setDeleteMessage(`Êtes-vous sûr de vouloir supprimer ${selectedFournisseurs.length} fournisseur(s) ? Cette action est irréversible.`);
//     setShowDeleteConfirm(true);
//   };

//   const handleDelete = (id: number) => {
//     const fournisseur = fournisseurs.find(f => f.id === id);
//     setFournisseurToDelete(id);
//     setDeleteMultiple(false);
//     setDeleteMessage(`Êtes-vous sûr de vouloir supprimer le fournisseur "${fournisseur?.nom}" ? Cette action est irréversible.`);
//     setShowDeleteConfirm(true);
//   };

//   const handleEditSelected = () => {
//     if (selectedFournisseurs.length === 0) {
//       showNotification('error', 'Aucun fournisseur sélectionné', 'Erreur');
//       return;
//     }

//     if (selectedFournisseurs.length === 1) {
//       const fournisseur = fournisseurs.find(f => f.id === selectedFournisseurs[0]);
//       if (fournisseur) {
//         handleEdit(fournisseur);
//       }
//     } else {
//       showNotification('info', `Édition multiple de ${selectedFournisseurs.length} fournisseurs`, 'Information');
//     }
//   };

//   const handleEdit = (fournisseur: Fournisseur) => {
//     setEditingFournisseur(fournisseur);
//     setIsFormOpen(true);
//   };

//   const handleAddNew = () => {
//     setEditingFournisseur(undefined);
//     setIsFormOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredFournisseurs.map(f => ({
//         Nom: f.nom,
//         Type: getTypeText(f.type_fournisseur || 'autre'),
//         Email: f.contact_email || 'Non spécifié',
//         Téléphone: f.telephone || 'Non spécifié',
//         Adresse: f.adresse || 'Non spécifiée',
//         Statut: getStatutText(f.statut || 'actif')
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `fournisseurs_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showNotification('success', 'Export CSV réussi !', 'Export');
//     } catch (error) {
//       showNotification('error', 'Erreur lors de l\'export', 'Erreur');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedFournisseurs([]);
//     showNotification('info', 'Filtres réinitialisés', 'Information');
//   };

//   const getTypeBadge = (type: string) => {
//     const badges = {
//       materiel: 'badge-primary',
//       logiciel: 'badge-success',
//       mixte: 'badge-warning',
//       autre: 'badge-neutral'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       materiel: 'Matériel',
//       logiciel: 'Logiciel',
//       mixte: 'Mixte',
//       autre: 'Autre'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     switch (type) {
//       case 'materiel': return <Package className="h-4 w-4" />;
//       case 'logiciel': return <Globe className="h-4 w-4" />;
//       case 'mixte': return <Briefcase className="h-4 w-4" />;
//       default: return <Building className="h-4 w-4" />;
//     }
//   };

//   const getStatutBadge = (statut: string) => {
//     const badges = {
//       actif: 'badge-success',
//       inactif: 'badge-error',
//       suspendu: 'badge-warning'
//     };
//     return badges[statut as keyof typeof badges] || 'badge-neutral';
//   };

//   const getStatutText = (statut: string) => {
//     const texts = {
//       actif: 'Actif',
//       inactif: 'Inactif',
//       suspendu: 'Suspendu'
//     };
//     return texts[statut as keyof typeof texts] || statut;
//   };

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case 'actif': return <CheckCircle className="h-4 w-4" />;
//       case 'inactif': return <AlertTriangle className="h-4 w-4" />;
//       case 'suspendu': return <X className="h-4 w-4" />;
//       default: return <Activity className="h-4 w-4" />;
//     }
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setEditingFournisseur(undefined);
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des fournisseurs...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isFormOpen) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen">
//         <div className="max-w-7xl mx-auto">
//           <div className="mb-6">
//             <button
//               onClick={handleCloseForm}
//               className="btn btn-ghost mb-4 hover:bg-base-300"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Retour à la liste
//             </button>
//             <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
//               {editingFournisseur ? '✏️ Modifier le fournisseur' : '➕ Nouveau fournisseur'}
//             </h1>
//             <p className="text-base-content opacity-60 mt-1">
//               {editingFournisseur 
//                 ? `Modification de "${editingFournisseur.nom}"` 
//                 : 'Ajouter un nouveau fournisseur à l\'inventaire'
//               }
//             </p>
//           </div>

//           <div className="bg-base-200 rounded-lg shadow-xl">
//             <FournisseurForm
//               isOpen={true}
//               onClose={handleCloseForm}
//               onSubmit={handleSubmit}
//               fournisseur={editingFournisseur}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Modal de confirmation de suppression */}
//       {showDeleteConfirm && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-warning" />
//               Confirmation de suppression
//             </h3>
//             <p className="py-4">{deleteMessage}</p>
//             <div className="modal-action">
//               <button 
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setFournisseurToDelete(null);
//                   setDeleteMultiple(false);
//                   setDeleteMessage('');
//                 }}
//               >
//                 Annuler
//               </button>
//               <button 
//                 className="btn btn-error"
//                 onClick={confirmDelete}
//               >
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Supprimer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
//             <Building className="h-8 w-8 text-primary" />
//             Gestion des Fournisseurs
//           </h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray(filteredFournisseurs).length} fournisseur(s) trouvé(s)
//             {selectedFournisseurs.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedFournisseurs.length} sélectionné(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleRefresh}
//             className="btn btn-outline btn-sm"
//             title="Rafraîchir"
//             disabled={refreshing}
//           >
//             <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//             Rafraîchir
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouveau fournisseur
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques - 4 CARTES */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Building className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total fournisseurs</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <CheckCircle className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-3xl font-bold text-success mb-1">{statistiques.actif}</h3>
//             <p className="text-sm opacity-60">Actifs</p>
//           </div>
//         </div>

//         <div className="card bg-primary/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Package className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.materiel}</h3>
//             <p className="text-sm opacity-60">Matériel</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Briefcase className="h-8 w-8 text-warning" />
//             </div>
//             <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.mixte}</h3>
//             <p className="text-sm opacity-60">Mixte</p>
//           </div>
//         </div>
//       </div>

//       {/* Autres statistiques - 3 CARTES */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//         <div className="card bg-info/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Mail className="h-8 w-8 text-info" />
//             </div>
//             <h3 className="text-2xl font-bold text-info mb-1">{statistiques.avecContact}</h3>
//             <p className="text-sm opacity-60">Avec contact</p>
//           </div>
//         </div>

//         <div className="card bg-neutral/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Building className="h-8 w-8 text-neutral" />
//             </div>
//             <h3 className="text-2xl font-bold text-neutral mb-1">{statistiques.autres}</h3>
//             <p className="text-sm opacity-60">Autres types</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <AlertTriangle className="h-8 w-8 text-error" />
//             </div>
//             <h3 className="text-2xl font-bold text-error mb-1">{statistiques.inactif}</h3>
//             <p className="text-sm opacity-60">Inactifs</p>
//           </div>
//         </div>
//       </div>

//       {/* Filtres */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Nom, email, téléphone, adresse..."
//                 className="input input-bordered w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="materiel">Matériel</option>
//                 <option value="mixte">Mixte</option>
//                 <option value="autre">Autre</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-1">
//                   <Activity className="h-4 w-4" />
//                   Statut
//                 </span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 value={filterStatut}
//                 onChange={(e) => setFilterStatut(e.target.value)}
//               >
//                 <option value="">Tous les statuts</option>
//                 <option value="actif">Actif</option>
//                 <option value="inactif">Inactif</option>
//                 <option value="suspendu">Suspendu</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🏢 Fournisseurs</span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 onChange={(e) => e.target.value && setSearchTerm(e.target.value)}
//               >
//                 <option value="">Tous les fournisseurs</option>
//                 {Object.entries(statistiques.parType).map(([type, count]) => (
//                   <option key={type} value={type}>
//                     {getTypeText(type)} ({count})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📈 Statistiques</span>
//               </label>
//               <div className="text-sm text-base-content opacity-70 pt-2">
//                 {safeArray(filteredFournisseurs).length} / {safeArray(fournisseurs).length} fournisseurs
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-between items-center mt-4">
//             <div className="flex gap-2">
//               {selectedFournisseurs.length > 0 && (
//                 <>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-outline btn-sm"
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Modifier ({selectedFournisseurs.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-error btn-sm"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Supprimer ({selectedFournisseurs.length})
//                   </button>
//                 </>
//               )}
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={resetFilters}
//                 className="btn btn-ghost btn-sm"
//               >
//                 <X className="h-4 w-4 mr-2" />
//                 Réinitialiser
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tableau */}
//       <div className="card bg-base-200 shadow-xl">
//         <div className="card-body p-0">
//           <div className="overflow-x-auto">
//             <table className="table table-zebra">
//               <thead>
//                 <tr className="bg-base-300">
//                   <th className="w-1">
//                     <div className="flex items-center">
//                       <button 
//                         onClick={toggleSelectAll}
//                         className="btn btn-ghost btn-xs p-1 mr-2"
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-4 w-4 text-primary" />
//                         ) : (
//                           <Square className="h-4 w-4" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th>Nom</th>
//                   <th>Type</th>
//                   <th>Statut</th>
//                   <th>Contact</th>
//                   <th>Adresse</th> {/* Colonne Adresse ajoutée */}
//                   <th className="text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredFournisseurs).length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-8">
//                       <div className="flex flex-col items-center gap-2">
//                         <Building className="h-12 w-12 text-base-content opacity-30" />
//                         <p className="text-base-content opacity-50">
//                           {searchTerm || filterType || filterStatut ? 'Aucun fournisseur correspondant aux filtres' : 'Aucun fournisseur trouvé'}
//                         </p>
//                         <button 
//                           onClick={searchTerm || filterType || filterStatut ? resetFilters : handleAddNew}
//                           className="btn btn-sm btn-primary mt-2"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           {searchTerm || filterType || filterStatut ? 'Réinitialiser les filtres' : 'Ajouter un premier fournisseur'}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   safeArray(filteredFournisseurs).map(fournisseur => {
//                     return (
//                       <tr key={fournisseur.id} className="hover:bg-base-100/50">
//                         <td>
//                           <div className="flex items-center">
//                             <input
//                               type="checkbox"
//                               className="checkbox checkbox-xs"
//                               checked={selectedFournisseurs.includes(fournisseur.id)}
//                               onChange={() => toggleSelectFournisseur(fournisseur.id)}
//                             />
//                           </div>
//                         </td>
//                         <td>
//                           <div className="font-medium">{fournisseur.nom}</div>
//                         </td>
//                         <td>
//                           <div className={`badge gap-2 ${getTypeBadge(fournisseur.type_fournisseur || 'autre')}`}>
//                             {getTypeIcon(fournisseur.type_fournisseur || 'autre')}
//                             {getTypeText(fournisseur.type_fournisseur || 'autre')}
//                           </div>
//                         </td>
//                         <td>
//                           <div className={`badge gap-2 ${getStatutBadge(fournisseur.statut || 'actif')}`}>
//                             {getStatutIcon(fournisseur.statut || 'actif')}
//                             {getStatutText(fournisseur.statut || 'actif')}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="space-y-1">
//                             {fournisseur.contact_email && (
//                               <div className="flex items-center gap-1 text-sm">
//                                 <Mail className="h-3 w-3 opacity-70" />
//                                 <span className="truncate max-w-[120px]">{fournisseur.contact_email}</span>
//                               </div>
//                             )}
//                             {fournisseur.telephone && (
//                               <div className="flex items-center gap-1 text-sm">
//                                 <Phone className="h-3 w-3 opacity-70" />
//                                 <span>{fournisseur.telephone}</span>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="flex items-center gap-1 max-w-[180px]">
//                             <MapPin className="h-3 w-3 opacity-70 flex-shrink-0" />
//                             <span className="truncate">{fournisseur.adresse || 'Non spécifiée'}</span>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="flex justify-end gap-2">
//                             <button
//                               onClick={() => handleEdit(fournisseur)}
//                               className="btn btn-ghost btn-sm btn-square"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(fournisseur.id)}
//                               className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/20"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Message d'information */}
//       <div className="mt-6 p-4 bg-info/10 rounded-lg">
//         <div className="flex items-start gap-3">
//           <Info className="h-5 w-5 text-info mt-0.5" />
//           <div className="flex-1">
//             <h4 className="font-bold text-info mb-1">📊 Gestion des fournisseurs</h4>
//             <p className="text-sm opacity-80">
//               Gérez efficacement vos fournisseurs : suivez les types, statuts, contacts et adresses pour optimiser vos relations fournisseurs.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Fournisseurs;







import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Download, Edit, Trash2, Building, 
  Phone, Mail, MapPin, X, CheckSquare, Square, RefreshCw,
  Users, Package, Globe, Activity, Briefcase, Eye, 
  ArrowLeft, BarChart3, TrendingUp, Award, CheckCircle,
  AlertTriangle, Info, Calendar, History, User as UserIcon
} from 'lucide-react';
import { Fournisseur } from '../types';
import FournisseurForm from '../components/FournisseurForm';
import { fournisseursAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ==================== AUTO-LOGGER ====================
// Hook pour l'Auto-Logger
const useAutoLogger = () => {
  const { user } = useAuth();
  
  const getUsername = () => {
    if (user?.username) return user.username;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        return parsed.username || 'System';
      } catch {
        return 'System';
      }
    }
    
    return 'System';
  };
  
  const logAction = (action, module, details, extraData = {}) => {
    if (!window.ActionLogger) {
      console.log(`📝 [AUTO-LOGGER] ${action} - ${module} - ${details}`);
      return;
    }
    
    const username = getUsername();
    
    window.ActionLogger.custom(action, module, details, username, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...extraData
    });
    
    console.log(`📝 [AUTO-LOGGER] ${action} - ${module} - ${details}`);
  };
  
  const logCRUD = (operation, module, itemName, itemData = {}) => {
    const actionsMap = {
      'create': 'AJOUT',
      'read': 'CONSULTATION',
      'update': 'MODIFICATION',
      'delete': 'SUPPRESSION',
      'export': 'EXPORTATION',
      'import': 'IMPORTATION'
    };
    
    const action = actionsMap[operation] || operation.toUpperCase();
    const details = `${operation === 'create' ? 'Ajout' : 
                     operation === 'read' ? 'Consultation' :
                     operation === 'update' ? 'Modification' :
                     operation === 'delete' ? 'Suppression' :
                     operation === 'export' ? 'Export' :
                     operation === 'import' ? 'Import' : operation} ${module.toLowerCase()}: ${itemName}`;
    
    logAction(action, module, details, {
      type: operation,
      itemType: module.toLowerCase(),
      itemName: itemName,
      ...itemData
    });
  };
  
  const logSearch = (module, searchTerm, resultsCount) => {
    logAction('RECHERCHE', module, `Recherche "${searchTerm}" (${resultsCount} résultats)`, {
      searchTerm: searchTerm,
      resultsCount: resultsCount,
      type: 'search'
    });
  };
  
  const logFilter = (module, filterType, resultsCount) => {
    logAction('FILTRAGE', module, `Filtre ${filterType} (${resultsCount} résultats)`, {
      filterType: filterType,
      resultsCount: resultsCount,
      type: 'filter'
    });
  };
  
  const logExport = (module, format, dataCount, filters = {}) => {
    logAction('EXPORTATION', 'Rapports', `Export ${module} en ${format} (${dataCount} éléments)`, {
      module: module,
      format: format,
      count: dataCount,
      filters: filters,
      type: 'export'
    });
  };
  
  return {
    logAction,
    logCRUD,
    logSearch,
    logFilter,
    logExport,
    
    // Fonctions spécifiques pour les fournisseurs
    logFournisseurCreate: (fournisseurData) => 
      logCRUD('create', 'Fournisseurs', fournisseurData.nom || 'Nouveau fournisseur', { data: fournisseurData }),
    
    logFournisseurUpdate: (id, oldData, newData) => 
      logCRUD('update', 'Fournisseurs', newData.nom || oldData.nom || id, {
        id: id,
        oldData: oldData,
        newData: newData,
        changes: getChanges(oldData, newData)
      }),
    
    logFournisseurDelete: (id, fournisseurData) =>
      logCRUD('delete', 'Fournisseurs', fournisseurData.nom || id, { id: id, data: fournisseurData }),
    
    logFournisseurExport: (format, count, filters) =>
      logExport('Fournisseurs', format, count, filters),
    
    logFournisseurView: (fournisseur) =>
      logCRUD('read', 'Fournisseurs', fournisseur.nom || 'Fournisseur', { id: fournisseur.id, data: fournisseur }),
    
    logFournisseurSearch: (term, count) =>
      logSearch('Fournisseurs', term, count),
    
    logFournisseurFilter: (filterType, count) =>
      logFilter('Fournisseurs', filterType, count)
  };
};

// Fonction utilitaire pour détecter les changements
const getChanges = (oldData, newData) => {
  const changes = {};
  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        old: oldData[key],
        new: newData[key]
      };
    }
  }
  return changes;
};
// ==================== FIN AUTO-LOGGER ====================

// Fonctions helper pour la sécurité des tableaux
const safeArray = (data: any): Fournisseur[] => {
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): Fournisseur[] => {
  if (!Array.isArray(array)) return [];
  return array.filter(condition);
};

const extractDataFromResponse = (response: any): Fournisseur[] => {
  if (!response || !response.data) {
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
  
  return [];
};

// Système de notification simple comme pour les matériels
const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
  // Créer l'élément de notification
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slideInRight ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    type === 'warning' ? 'bg-yellow-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  
  // Ajouter le style d'animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slideInRight {
      animation: slideInRight 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
  
  // Icône selon le type
  const icon = type === 'success' ? '✅' : 
               type === 'error' ? '❌' : 
               type === 'warning' ? '⚠️' : 'ℹ️';
  
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="text-xl">${icon}</div>
      <div class="flex-1">
        ${title ? `<div class="font-bold mb-1">${title}</div>` : ''}
        <div class="text-sm">${message}</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="btn btn-ghost btn-xs p-1 hover:bg-white/20">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-suppression après 5 secondes
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentElement) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
};

const Fournisseurs: React.FC = () => {
  // ==================== INITIALISATION AUTO-LOGGER ====================
  const autoLogger = useAutoLogger();
  
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [filteredFournisseurs, setFilteredFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatut, setFilterStatut] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | undefined>();
  const [selectedFournisseurs, setSelectedFournisseurs] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // États pour la confirmation de suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fournisseurToDelete, setFournisseurToDelete] = useState<number | null>(null);
  const [deleteMultiple, setDeleteMultiple] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  // Statistiques
  const [statistiques, setStatistiques] = useState({
    total: 0,
    materiel: 0,
    mixte: 0,
    autres: 0,
    actif: 0,
    inactif: 0,
    avecContact: 0,
    sansContact: 0,
    parType: {} as Record<string, number>,
    parStatut: {} as Record<string, number>,
    evolution30j: 8,
  });

  useEffect(() => {
    fetchFournisseurs();
    
    // Afficher une notification de bienvenue
    setTimeout(() => {
      showNotification('info', 'Chargement des fournisseurs...', 'Bienvenue');
    }, 500);
  }, []);

  useEffect(() => {
    filterFournisseurs();
    if (fournisseurs.length > 0) {
      calculerStatistiques(fournisseurs);
    }
  }, [fournisseurs, searchTerm, filterType, filterStatut]);

  useEffect(() => {
    if (filteredFournisseurs.length > 0 && selectedFournisseurs.length === filteredFournisseurs.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedFournisseurs, filteredFournisseurs]);

  const fetchFournisseurs = async () => {
    try {
      setLoading(true);
      const response = await fournisseursAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      
      setFournisseurs(extractedData);
      
      // 🔥 AUTO-LOGGER: Chargement des fournisseurs
      autoLogger.logAction('CHARGEMENT', 'Fournisseurs', `Chargement de ${extractedData.length} fournisseurs`, {
        count: extractedData.length,
        type: 'load'
      });
      
    } catch (err: any) {
      showNotification('error', 'Erreur lors du chargement des fournisseurs', 'Erreur');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculerStatistiques = (data: Fournisseur[]) => {
    const parType: Record<string, number> = {};
    const parStatut: Record<string, number> = {};
    let avecContact = 0;

    data.forEach(fournisseur => {
      // Compter par type
      const type = fournisseur.type_fournisseur || 'autre';
      parType[type] = (parType[type] || 0) + 1;
      
      // Compter par statut
      const statut = fournisseur.statut || 'actif';
      parStatut[statut] = (parStatut[statut] || 0) + 1;
      
      // Contact
      if (fournisseur.contact_email || fournisseur.telephone) {
        avecContact++;
      }
    });

    setStatistiques({
      total: data.length,
      materiel: parType['materiel'] || 0,
      mixte: parType['mixte'] || 0,
      autres: parType['autre'] || 0,
      actif: parStatut['actif'] || 0,
      inactif: parStatut['inactif'] || 0,
      avecContact: avecContact,
      sansContact: data.length - avecContact,
      parType: parType,
      parStatut: parStatut,
      evolution30j: 8
    });
  };

  const filterFournisseurs = () => {
    let filtered = safeArray(fournisseurs);

    if (searchTerm) {
      filtered = safeFilter(filtered, f => 
        f.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.adresse?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // 🔥 AUTO-LOGGER: Recherche de fournisseurs
      if (searchTerm.trim()) {
        autoLogger.logFournisseurSearch(searchTerm, filtered.length);
      }
    }

    if (filterType) {
      filtered = safeFilter(filtered, f => f.type_fournisseur === filterType);
      
      // 🔥 AUTO-LOGGER: Filtre par type
      autoLogger.logFournisseurFilter(`type: ${filterType}`, filtered.length);
    }

    if (filterStatut) {
      filtered = safeFilter(filtered, f => f.statut === filterStatut);
      
      // 🔥 AUTO-LOGGER: Filtre par statut
      autoLogger.logFournisseurFilter(`statut: ${filterStatut}`, filtered.length);
    }

    setFilteredFournisseurs(filtered);
    setSelectedFournisseurs([]);
  };

  const handleSubmit = async (fournisseurData: Omit<Fournisseur, 'id'>) => {
    try {
      const apiData: any = {
        nom: fournisseurData.nom?.trim() || '',
        type_fournisseur: fournisseurData.type_fournisseur || 'autre',
        contact_email: fournisseurData.contact_email?.trim() || '',
        telephone: fournisseurData.telephone?.trim() || '',
        adresse: fournisseurData.adresse?.trim() || '',
        note: fournisseurData.note || null,
        statut: fournisseurData.statut || 'actif'
      };
      
      let actionMessage = '';
      
      if (editingFournisseur) {
        await fournisseursAPI.update(editingFournisseur.id, apiData);
        actionMessage = `Fournisseur "${fournisseurData.nom}" modifié avec succès`;
        showNotification('success', actionMessage, 'Modification réussie');
        
        // 🔥 AUTO-LOGGER: Modification de fournisseur
        autoLogger.logFournisseurUpdate(editingFournisseur.id, editingFournisseur, fournisseurData);
        
      } else {
        await fournisseursAPI.create(apiData);
        actionMessage = `Fournisseur "${fournisseurData.nom}" créé avec succès`;
        showNotification('success', actionMessage, 'Création réussie');
        
        // 🔥 AUTO-LOGGER: Création de fournisseur
        autoLogger.logFournisseurCreate(fournisseurData);
      }
      
      fetchFournisseurs();
      setIsFormOpen(false);
      setEditingFournisseur(undefined);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
      showNotification('error', errorMessage, 'Erreur');
    }
  };

  const toggleSelectFournisseur = (id: number) => {
    setSelectedFournisseurs(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedFournisseurs([]);
      showNotification('info', 'Sélection annulée', 'Information');
    } else {
      const allIds = filteredFournisseurs.map(f => f.id);
      setSelectedFournisseurs(allIds);
      showNotification('success', `${allIds.length} fournisseurs sélectionnés`, 'Sélection');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // 🔥 AUTO-LOGGER: Rafraîchissement
    autoLogger.logAction('RAFRAÎCHISSEMENT', 'Fournisseurs', 'Rafraîchissement des données', {
      timestamp: new Date().toISOString()
    });
    
    await fetchFournisseurs();
    showNotification('success', 'Données rafraîchies avec succès', 'Rafraîchissement');
  };

  const confirmDelete = async () => {
    try {
      if (deleteMultiple) {
        for (const id of selectedFournisseurs) {
          await fournisseursAPI.delete(id);
        }
        
        // 🔥 AUTO-LOGGER: Suppression multiple de fournisseurs
        selectedFournisseurs.forEach(id => {
          const fournisseur = fournisseurs.find(f => f.id === id);
          if (fournisseur) {
            autoLogger.logFournisseurDelete(id, fournisseur);
          }
        });
        
        showNotification('success', `${selectedFournisseurs.length} fournisseur(s) supprimé(s)`, 'Suppression réussie');
        setSelectedFournisseurs([]);
      } else if (fournisseurToDelete) {
        const fournisseur = fournisseurs.find(f => f.id === fournisseurToDelete);
        await fournisseursAPI.delete(fournisseurToDelete);
        showNotification('success', 'Fournisseur supprimé avec succès', 'Suppression réussie');
        
        // 🔥 AUTO-LOGGER: Suppression de fournisseur
        if (fournisseur) {
          autoLogger.logFournisseurDelete(fournisseurToDelete, fournisseur);
        }
      }
      
      await fetchFournisseurs();
    } catch (error) {
      showNotification('error', 'Erreur lors de la suppression', 'Erreur');
    } finally {
      setShowDeleteConfirm(false);
      setFournisseurToDelete(null);
      setDeleteMultiple(false);
      setDeleteMessage('');
    }
  };

  const handleDeleteSelected = () => {
    if (selectedFournisseurs.length === 0) {
      showNotification('error', 'Aucun fournisseur sélectionné', 'Erreur');
      return;
    }

    setDeleteMultiple(true);
    setDeleteMessage(`Êtes-vous sûr de vouloir supprimer ${selectedFournisseurs.length} fournisseur(s) ? Cette action est irréversible.`);
    setShowDeleteConfirm(true);
  };

  const handleDelete = (id: number) => {
    const fournisseur = fournisseurs.find(f => f.id === id);
    setFournisseurToDelete(id);
    setDeleteMultiple(false);
    setDeleteMessage(`Êtes-vous sûr de vouloir supprimer le fournisseur "${fournisseur?.nom}" ? Cette action est irréversible.`);
    setShowDeleteConfirm(true);
  };

  const handleEditSelected = () => {
    if (selectedFournisseurs.length === 0) {
      showNotification('error', 'Aucun fournisseur sélectionné', 'Erreur');
      return;
    }

    if (selectedFournisseurs.length === 1) {
      const fournisseur = fournisseurs.find(f => f.id === selectedFournisseurs[0]);
      if (fournisseur) {
        handleEdit(fournisseur);
      }
    } else {
      showNotification('info', `Édition multiple de ${selectedFournisseurs.length} fournisseurs`, 'Information');
    }
  };

  const handleEdit = (fournisseur: Fournisseur) => {
    // 🔥 AUTO-LOGGER: Consultation de fournisseur (pour édition)
    autoLogger.logFournisseurView(fournisseur);
    
    setEditingFournisseur(fournisseur);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    // 🔥 AUTO-LOGGER: Ouverture formulaire nouveau fournisseur
    autoLogger.logAction('OUVERTURE FORMULAIRE', 'Fournisseurs', 'Nouveau fournisseur');
    
    setEditingFournisseur(undefined);
    setIsFormOpen(true);
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredFournisseurs.map(f => ({
        Nom: f.nom,
        Type: getTypeText(f.type_fournisseur || 'autre'),
        Email: f.contact_email || 'Non spécifié',
        Téléphone: f.telephone || 'Non spécifié',
        Adresse: f.adresse || 'Non spécifiée',
        Statut: getStatutText(f.statut || 'actif')
      }));

      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `fournisseurs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('success', 'Export CSV réussi !', 'Export');
      
      // 🔥 AUTO-LOGGER: Exportation de fournisseurs
      autoLogger.logFournisseurExport('CSV', filteredFournisseurs.length, {
        searchTerm: searchTerm,
        filterType: filterType,
        filterStatut: filterStatut
      });
      
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'export', 'Erreur');
    }
  };

  const resetFilters = () => {
    // 🔥 AUTO-LOGGER: Réinitialisation des filtres
    autoLogger.logFournisseurFilter('réinitialisation', fournisseurs.length);
    
    setSearchTerm('');
    setFilterType('');
    setFilterStatut('');
    setSelectedFournisseurs([]);
    showNotification('info', 'Filtres réinitialisés', 'Information');
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      materiel: 'badge-primary',
      logiciel: 'badge-success',
      mixte: 'badge-warning',
      autre: 'badge-neutral'
    };
    return badges[type as keyof typeof badges] || 'badge-neutral';
  };

  const getTypeText = (type: string) => {
    const texts = {
      materiel: 'Matériel',
      logiciel: 'Logiciel',
      mixte: 'Mixte',
      autre: 'Autre'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'materiel': return <Package className="h-4 w-4" />;
      case 'logiciel': return <Globe className="h-4 w-4" />;
      case 'mixte': return <Briefcase className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      actif: 'badge-success',
      inactif: 'badge-error',
      suspendu: 'badge-warning'
    };
    return badges[statut as keyof typeof badges] || 'badge-neutral';
  };

  const getStatutText = (statut: string) => {
    const texts = {
      actif: 'Actif',
      inactif: 'Inactif',
      suspendu: 'Suspendu'
    };
    return texts[statut as keyof typeof texts] || statut;
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'actif': return <CheckCircle className="h-4 w-4" />;
      case 'inactif': return <AlertTriangle className="h-4 w-4" />;
      case 'suspendu': return <X className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingFournisseur(undefined);
  };

  if (loading && !refreshing) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des fournisseurs...</p>
        </div>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <div className="p-6 bg-base-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleCloseForm}
              className="btn btn-ghost mb-4 hover:bg-base-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </button>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
              {editingFournisseur ? '✏️ Modifier le fournisseur' : '➕ Nouveau fournisseur'}
            </h1>
            <p className="text-base-content opacity-60 mt-1">
              {editingFournisseur 
                ? `Modification de "${editingFournisseur.nom}"` 
                : 'Ajouter un nouveau fournisseur à l\'inventaire'
              }
            </p>
          </div>

          <div className="bg-base-200 rounded-lg shadow-xl">
            <FournisseurForm
              isOpen={true}
              onClose={handleCloseForm}
              onSubmit={handleSubmit}
              fournisseur={editingFournisseur}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Confirmation de suppression
            </h3>
            <p className="py-4">{deleteMessage}</p>
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setFournisseurToDelete(null);
                  setDeleteMultiple(false);
                  setDeleteMessage('');
                }}
              >
                Annuler
              </button>
              <button 
                className="btn btn-error"
                onClick={confirmDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            Gestion des Fournisseurs
          </h1>
          <p className="text-base-content opacity-60 mt-1">
            {safeArray(filteredFournisseurs).length} fournisseur(s) trouvé(s)
            {selectedFournisseurs.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedFournisseurs.length} sélectionné(s))
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
            onClick={handleRefresh}
            className="btn btn-outline btn-sm"
            title="Rafraîchir"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Rafraîchir
          </button>
          <button
            onClick={handleAddNew}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau fournisseur
          </button>
        </div>
      </div>

      {/* Section Statistiques - 4 CARTES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
            <p className="text-sm opacity-60">Total fournisseurs</p>
          </div>
        </div>

        <div className="card bg-success/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-3xl font-bold text-success mb-1">{statistiques.actif}</h3>
            <p className="text-sm opacity-60">Actifs</p>
          </div>
        </div>

        <div className="card bg-primary/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.materiel}</h3>
            <p className="text-sm opacity-60">Matériel</p>
          </div>
        </div>

        <div className="card bg-warning/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Briefcase className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.mixte}</h3>
            <p className="text-sm opacity-60">Mixte</p>
          </div>
        </div>
      </div>

      {/* Autres statistiques - 3 CARTES */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-info/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Mail className="h-8 w-8 text-info" />
            </div>
            <h3 className="text-2xl font-bold text-info mb-1">{statistiques.avecContact}</h3>
            <p className="text-sm opacity-60">Avec contact</p>
          </div>
        </div>

        <div className="card bg-neutral/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Building className="h-8 w-8 text-neutral" />
            </div>
            <h3 className="text-2xl font-bold text-neutral mb-1">{statistiques.autres}</h3>
            <p className="text-sm opacity-60">Autres types</p>
          </div>
        </div>

        <div className="card bg-error/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-error" />
            </div>
            <h3 className="text-2xl font-bold text-error mb-1">{statistiques.inactif}</h3>
            <p className="text-sm opacity-60">Inactifs</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">🔍 Rechercher</span>
              </label>
              <input
                type="text"
                placeholder="Nom, email, téléphone, adresse..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📊 Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  // 🔥 AUTO-LOGGER: Filtre par type
                  if (e.target.value) {
                    const resultsCount = fournisseurs.filter(f => f.type_fournisseur === e.target.value).length;
                    autoLogger.logFournisseurFilter(`type: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Tous les types</option>
                <option value="materiel">Matériel</option>
                <option value="mixte">Mixte</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  Statut
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filterStatut}
                onChange={(e) => {
                  setFilterStatut(e.target.value);
                  // 🔥 AUTO-LOGGER: Filtre par statut
                  if (e.target.value) {
                    const resultsCount = fournisseurs.filter(f => f.statut === e.target.value).length;
                    autoLogger.logFournisseurFilter(`statut: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">🏢 Fournisseurs</span>
              </label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => {
                  if (e.target.value) {
                    setSearchTerm(e.target.value);
                    // 🔥 AUTO-LOGGER: Filtre par nom
                    const resultsCount = fournisseurs.filter(f => 
                      f.nom?.toLowerCase().includes(e.target.value.toLowerCase())
                    ).length;
                    
                    autoLogger.logFournisseurFilter(`nom: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Tous les fournisseurs</option>
                {Object.entries(statistiques.parType).map(([type, count]) => (
                  <option key={type} value={type}>
                    {getTypeText(type)} ({count})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📈 Statistiques</span>
              </label>
              <div className="text-sm text-base-content opacity-70 pt-2">
                {safeArray(filteredFournisseurs).length} / {safeArray(fournisseurs).length} fournisseurs
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              {selectedFournisseurs.length > 0 && (
                <>
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier ({selectedFournisseurs.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-error btn-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer ({selectedFournisseurs.length})
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="btn btn-ghost btn-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="bg-base-300">
                  <th className="w-1">
                    <div className="flex items-center">
                      <button 
                        onClick={toggleSelectAll}
                        className="btn btn-ghost btn-xs p-1 mr-2"
                      >
                        {isSelectAll ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Contact</th>
                  <th>Adresse</th> {/* Colonne Adresse ajoutée */}
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredFournisseurs).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Building className="h-12 w-12 text-base-content opacity-30" />
                        <p className="text-base-content opacity-50">
                          {searchTerm || filterType || filterStatut ? 'Aucun fournisseur correspondant aux filtres' : 'Aucun fournisseur trouvé'}
                        </p>
                        <button 
                          onClick={searchTerm || filterType || filterStatut ? resetFilters : handleAddNew}
                          className="btn btn-sm btn-primary mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {searchTerm || filterType || filterStatut ? 'Réinitialiser les filtres' : 'Ajouter un premier fournisseur'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  safeArray(filteredFournisseurs).map(fournisseur => {
                    return (
                      <tr key={fournisseur.id} className="hover:bg-base-100/50">
                        <td>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs"
                              checked={selectedFournisseurs.includes(fournisseur.id)}
                              onChange={() => toggleSelectFournisseur(fournisseur.id)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="font-medium">{fournisseur.nom}</div>
                        </td>
                        <td>
                          <div className={`badge gap-2 ${getTypeBadge(fournisseur.type_fournisseur || 'autre')}`}>
                            {getTypeIcon(fournisseur.type_fournisseur || 'autre')}
                            {getTypeText(fournisseur.type_fournisseur || 'autre')}
                          </div>
                        </td>
                        <td>
                          <div className={`badge gap-2 ${getStatutBadge(fournisseur.statut || 'actif')}`}>
                            {getStatutIcon(fournisseur.statut || 'actif')}
                            {getStatutText(fournisseur.statut || 'actif')}
                          </div>
                        </td>
                        <td>
                          <div className="space-y-1">
                            {fournisseur.contact_email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3 opacity-70" />
                                <span className="truncate max-w-[120px]">{fournisseur.contact_email}</span>
                              </div>
                            )}
                            {fournisseur.telephone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 opacity-70" />
                                <span>{fournisseur.telephone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1 max-w-[180px]">
                            <MapPin className="h-3 w-3 opacity-70 flex-shrink-0" />
                            <span className="truncate">{fournisseur.adresse || 'Non spécifiée'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(fournisseur)}
                              className="btn btn-ghost btn-sm btn-square"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(fournisseur.id)}
                              className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Message d'information */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-info mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-info mb-1">📊 Gestion des fournisseurs</h4>
            <p className="text-sm opacity-80">
              Gérez efficacement vos fournisseurs : suivez les types, statuts, contacts et adresses pour optimiser vos relations fournisseurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fournisseurs;