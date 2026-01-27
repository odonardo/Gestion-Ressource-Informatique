


// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Eye, Filter, Download, Edit, Trash2, 
//   CheckSquare, Square, X, BarChart3, Cpu, HardDrive, 
//   Clock, User, CheckCircle, AlertTriangle, RefreshCw,
//   TrendingUp, Battery, BatteryFull, BatteryLow, BatteryMedium,
//   Server, Wrench, Zap, Shield, Package, Database
// } from 'lucide-react';
// import { Materiel, Fournisseur } from '../types';
// import MaterielForm from '../components/MaterielForm';
// import { materielsAPI, fournisseursAPI } from '../services/api';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Materiel[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Materiel[] => {
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

// const Materiels: React.FC = () => {
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
//   const [filteredMateriels, setFilteredMateriels] = useState<Materiel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterEtat, setFilterEtat] = useState<string>('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingMateriel, setEditingMateriel] = useState<Materiel | undefined>();
//   const [selectedMateriels, setSelectedMateriels] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
  
//   // États pour la confirmation de suppression
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [materielToDelete, setMaterielToDelete] = useState<number | null>(null);
//   const [deleteMultiple, setDeleteMultiple] = useState(false);

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     fonctionnel: 0,
//     enPanne: 0,
//     repare: 0,
//     obsolete: 0,
//     nonAttribue: 0,
//     attribue: 0,
//     parService: {} as Record<string, number>,
//     ageMoyen: 0, // en jours
//     tauxPanne: 0, // pourcentage
//     evolution30j: 12, // valeur simulée
//     parFournisseur: {} as Record<string, number>
//   });

//   useEffect(() => {
//     fetchMateriels();
//     fetchFournisseurs();
//   }, []);

//   useEffect(() => {
//     filterMateriels();
//     if (materiels.length > 0) {
//       calculerStatistiques(materiels);
//     }
//   }, [materiels, searchTerm, filterEtat]);

//   useEffect(() => {
//     if (filteredMateriels.length > 0 && selectedMateriels.length === filteredMateriels.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedMateriels, filteredMateriels]);

//   const fetchMateriels = async () => {
//     try {
//       setLoading(true);
//       const response = await materielsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       console.log('📦 Matériels chargés:', extractedData);
//       setMateriels(extractedData);
//       // showNotification('success', `✅ ${extractedData.length} matériels chargés`);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement matériels:', err);
//       setError('Erreur lors du chargement des matériels');
//       showNotification('error', '❌ Erreur lors du chargement des matériels');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchFournisseurs = async () => {
//     try {
//       const response = await fournisseursAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       console.log('🏢 Fournisseurs chargés:', extractedData);
//       setFournisseurs(extractedData);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement fournisseurs:', err);
//     }
//   };

//   const calculerStatistiques = (data: Materiel[]) => {
//     const now = new Date();
//     let totalAge = 0;
//     let countWithDate = 0;
//     const services: Record<string, number> = {};
//     const fournisseurs: Record<string, number> = {};

//     data.forEach(materiel => {
//       // Calcul de l'âge
//       if (materiel.date_achat) {
//         const dateAchat = new Date(materiel.date_achat);
//         const age = Math.floor((now.getTime() - dateAchat.getTime()) / (1000 * 60 * 60 * 24));
//         totalAge += age;
//         countWithDate++;
//       }

//       // Compter par service
//       if (materiel.service_attribue) {
//         services[materiel.service_attribue] = (services[materiel.service_attribue] || 0) + 1;
//       }

//       // Compter par fournisseur
//       if (materiel.fournisseur && typeof materiel.fournisseur === 'object' && 'nom' in materiel.fournisseur) {
//         const nomFournisseur = (materiel.fournisseur as any).nom;
//         fournisseurs[nomFournisseur] = (fournisseurs[nomFournisseur] || 0) + 1;
//       }
//     });

//     const stats = {
//       total: data.length,
//       fonctionnel: data.filter(m => m.etat === 'fonctionnel').length,
//       enPanne: data.filter(m => m.etat === 'en_panne').length,
//       repare: data.filter(m => m.etat === 'repare').length,
//       obsolete: data.filter(m => m.etat === 'obsolete').length,
//       nonAttribue: data.filter(m => !m.utilisateur_attribue || m.utilisateur_attribue.trim() === '').length,
//       attribue: data.filter(m => m.utilisateur_attribue && m.utilisateur_attribue.trim() !== '').length,
//       parService: services,
//       parFournisseur: fournisseurs,
//       ageMoyen: countWithDate > 0 ? Math.round(totalAge / countWithDate) : 0,
//       tauxPanne: data.length > 0 ? Math.round((data.filter(m => m.etat === 'en_panne').length / data.length) * 100) : 0,
//       evolution30j: 12 // Valeur simulée pour l'exemple
//     };
    
//     setStatistiques(stats);
//   };

//   const filterMateriels = () => {
//     let filtered = safeArray(materiels);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, m => 
//         m.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         m.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (m.utilisateur_attribue && m.utilisateur_attribue.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (m.service_attribue && m.service_attribue.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     if (filterEtat) {
//       filtered = safeFilter(filtered, m => m.etat === filterEtat);
//     }

//     setFilteredMateriels(filtered);
//     setSelectedMateriels([]);
//   };

//   const handleSubmit = async (materielData: Omit<Materiel, 'id'>) => {
//     try {
//       console.group('🔧 DEBUG Materiel Submission');
//       console.log('Données du formulaire:', materielData);
      
//       const apiData: any = {
//         nom: materielData.nom?.trim() || '',
//         reference: materielData.reference?.trim() || '',
//         date_achat: materielData.date_achat,
//         etat: materielData.etat || 'fonctionnel',
//         service_attribue: materielData.service_attribue || '',
//         utilisateur_attribue: materielData.utilisateur_attribue?.trim() || ''
//       };

//       if (materielData.fournisseur) {
//         apiData.fournisseur = materielData.fournisseur;
//       }
      
//       console.log('📤 Données API formatées:', apiData);
//       console.groupEnd();

//       if (editingMateriel) {
//         const response = await materielsAPI.update(editingMateriel.id, apiData);
//         console.log('✅ Réponse update:', response.data);
//         showNotification('success', '✅ Matériel modifié avec succès');
//       } else {
//         const response = await materielsAPI.create(apiData);
//         console.log('✅ Réponse create:', response.data);
//         showNotification('success', '✅ Matériel créé avec succès');
//       }
      
//       fetchMateriels();
//       setIsFormOpen(false);
//       setEditingMateriel(undefined);
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

//   const toggleSelectMateriel = (id: number) => {
//     setSelectedMateriels(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedMateriels([]);
//       showNotification('info', '✅ Sélection annulée');
//     } else {
//       const allIds = filteredMateriels.map(m => m.id);
//       setSelectedMateriels(allIds);
//       showNotification('success', `✅ ${allIds.length} matériels sélectionnés`);
//     }
//   };

//   // Rafraîchir les données
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchMateriels();
//     showNotification('success', '🔄 Données rafraîchies avec succès');
//   };

//   // Confirmation de suppression
//   const confirmDelete = async () => {
//     try {
//       if (deleteMultiple) {
//         // Suppression multiple
//         for (const id of selectedMateriels) {
//           await materielsAPI.delete(id);
//         }
        
//         showNotification('success', `✅ ${selectedMateriels.length} matériel(s) supprimé(s) avec succès`);
//         setSelectedMateriels([]);
//       } else if (materielToDelete) {
//         // Suppression simple
//         await materielsAPI.delete(materielToDelete);
//         showNotification('success', '✅ Matériel supprimé avec succès');
//       }
      
//       await fetchMateriels();
//     } catch (error) {
//       showNotification('error', '❌ Erreur lors de la suppression');
//     } finally {
//       setShowDeleteConfirm(false);
//       setMaterielToDelete(null);
//       setDeleteMultiple(false);
//     }
//   };

//   const handleDeleteSelected = () => {
//     if (selectedMateriels.length === 0) {
//       showNotification('error', '❌ Aucun matériel sélectionné');
//       return;
//     }

//     setDeleteMultiple(true);
//     setShowDeleteConfirm(true);
//   };

//   const handleDelete = (id: number) => {
//     setMaterielToDelete(id);
//     setDeleteMultiple(false);
//     setShowDeleteConfirm(true);
//   };

//   const handleEditSelected = () => {
//     if (selectedMateriels.length === 0) {
//       showNotification('error', '❌ Aucun matériel sélectionné');
//       return;
//     }

//     if (selectedMateriels.length === 1) {
//       const materiel = materiels.find(m => m.id === selectedMateriels[0]);
//       if (materiel) {
//         handleEdit(materiel);
//       }
//     } else {
//       showNotification('info', `📝 Édition multiple de ${selectedMateriels.length} matériels`);
//     }
//   };

//   const handleEdit = (materiel: Materiel) => {
//     setEditingMateriel(materiel);
//     setIsFormOpen(true);
//     showNotification('info', `✏️ Modification du matériel "${materiel.nom}"`);
//   };

//   const handleAddNew = () => {
//     setEditingMateriel(undefined);
//     setIsFormOpen(true);
//     showNotification('info', '📝 Ouverture du formulaire de création de matériel');
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredMateriels.map(m => ({
//         Nom: m.nom,
//         Référence: m.reference,
//         État: getEtatText(m.etat),
//         Service: m.service_attribue,
//         Utilisateur: m.utilisateur_attribue || 'Non attribué',
//         'Date d\'achat': m.date_achat ? new Date(m.date_achat).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         Fournisseur: m.fournisseur && typeof m.fournisseur === 'object' && 'nom' in m.fournisseur 
//           ? (m.fournisseur as any).nom 
//           : 'Non spécifié'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `materiels_${new Date().toISOString().split('T')[0]}.csv`);
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
//     setFilterEtat('');
//     setSelectedMateriels([]);
//     showNotification('info', '🔄 Filtres réinitialisés');
//   };

//   const getEtatBadge = (etat: string) => {
//     const badges = {
//       fonctionnel: 'badge-success',
//       en_panne: 'badge-error',
//       repare: 'badge-warning',
//       obsolete: 'badge-neutral'
//     };
//     return badges[etat as keyof typeof badges] || 'badge-neutral';
//   };

//   const getEtatText = (etat: string) => {
//     const texts = {
//       fonctionnel: 'Fonctionnel',
//       en_panne: 'En panne',
//       repare: 'Réparé',
//       obsolete: 'Obsolète'
//     };
//     return texts[etat as keyof typeof texts] || etat;
//   };

//   const getEtatIcon = (etat: string) => {
//     switch (etat) {
//       case 'fonctionnel': return <CheckCircle className="h-4 w-4" />;
//       case 'en_panne': return <AlertTriangle className="h-4 w-4" />;
//       case 'repare': return <Wrench className="h-4 w-4" />;
//       case 'obsolete': return <Package className="h-4 w-4" />;
//       default: return <HardDrive className="h-4 w-4" />;
//     }
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des matériels...</p>
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
//                 ? `Êtes-vous sûr de vouloir supprimer ${selectedMateriels.length} matériel(s) ? Cette action est irréversible.`
//                 : 'Êtes-vous sûr de vouloir supprimer ce matériel ? Cette action est irréversible.'
//               }
//             </p>
//             <div className="modal-action">
//               <button 
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setMaterielToDelete(null);
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
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button className="btn btn-ghost btn-sm" onClick={fetchMateriels}>
//             Réessayer
//           </button>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
//             <Server className="h-8 w-8 text-primary" />
//             Gestion des Matériels
//           </h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray(filteredMateriels).length} matériel(s) trouvé(s)
//             {selectedMateriels.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedMateriels.length} sélectionné(s))
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
//             Nouveau matériel
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques - 5 CARTES SUR UNE SEULE LIGNE */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        
//         {/* Stat 1 - Total matériels */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Server className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total matériels</p>
//           </div>
//         </div>

//         {/* Stat 2 - Fonctionnels */}
//         <div className="card bg-success/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <CheckCircle className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-3xl font-bold text-success mb-1">{statistiques.fonctionnel}</h3>
//             <p className="text-sm opacity-60">Fonctionnels</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.fonctionnel / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 3 - En panne */}
//         <div className="card bg-error/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <AlertTriangle className="h-8 w-8 text-error" />
//             </div>
//             <h3 className="text-3xl font-bold text-error mb-1">{statistiques.enPanne}</h3>
//             <p className="text-sm opacity-60">En panne</p>
//             <p className="text-xs mt-1">
//               {statistiques.tauxPanne}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 4 - Réparés */}
//         <div className="card bg-warning/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Wrench className="h-8 w-8 text-warning" />
//             </div>
//             <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.repare}</h3>
//             <p className="text-sm opacity-60">Réparés</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.repare / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 5 - Obsolètes */}
//         <div className="card bg-neutral/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Package className="h-8 w-8 text-neutral" />
//             </div>
//             <h3 className="text-3xl font-bold text-neutral mb-1">{statistiques.obsolete}</h3>
//             <p className="text-sm opacity-60">Obsolètes</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.obsolete / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//       </div>

//       {/* Section Métriques secondaires - 2 cartes sur une ligne */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
//         {/* Âge moyen */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4">
//             <div className="flex items-center gap-3">
//               <Clock className="h-10 w-10 text-warning" />
//               <div>
//                 <h3 className="text-2xl font-bold text-warning">{statistiques.ageMoyen}</h3>
//                 <p className="text-sm opacity-60">Âge moyen (jours)</p>
//                 <p className="text-xs mt-1">
//                   {statistiques.ageMoyen < 365 
//                     ? `Jeune parc (${Math.floor(statistiques.ageMoyen / 30)} mois)` 
//                     : `Ancien parc (${Math.floor(statistiques.ageMoyen / 365)} ans)`
//                   }
//                 </p>
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
//                   placeholder="Nom, référence, utilisateur, service..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 État</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterEtat}
//                 onChange={(e) => setFilterEtat(e.target.value)}
//               >
//                 <option value="">Tous les états</option>
//                 <option value="fonctionnel">Fonctionnel</option>
//                 <option value="en_panne">En panne</option>
//                 <option value="repare">Réparé</option>
//                 <option value="obsolete">Obsolète</option>
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
//                 {safeArray(filteredMateriels).length} / {safeArray(materiels).length} matériels
//               </div>
//             </div>
//           </div>

//           {/* Actions de sélection */}
//           {selectedMateriels.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedMateriels.length} matériel(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedMateriels.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedMateriels.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedMateriels([])}
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

//       {/* Tableau des matériels */}
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
//                   <th className="font-bold">Référence</th>
//                   <th className="font-bold">État</th>
//                   <th className="font-bold">Service</th>
//                   <th className="font-bold">Utilisateur</th>
//                   <th className="font-bold">Date d'achat</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredMateriels).map((materiel) => (
//                   <tr key={materiel.id} className="hover">
//                     <td className="text-center">
//                       <div className="flex justify-center">
//                         <input
//                           type="checkbox"
//                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                           checked={selectedMateriels.includes(materiel.id)}
//                           onChange={() => toggleSelectMateriel(materiel.id)}
//                         />
//                       </div>
//                     </td>
//                     <td className="font-semibold">{materiel.nom}</td>
//                     <td>
//                       <code className="bg-base-100 px-2 py-1 rounded text-sm">
//                         {materiel.reference}
//                       </code>
//                     </td>
//                     <td>
//                       <div className={`badge ${getEtatBadge(materiel.etat)} badge-lg gap-1`}>
//                         {getEtatIcon(materiel.etat)}
//                         {getEtatText(materiel.etat)}
//                       </div>
//                     </td>
//                     <td>{materiel.service_attribue}</td>
//                     <td>
//                       {materiel.utilisateur_attribue ? (
//                         <span className="font-medium flex items-center gap-1">
//                           <User className="h-3 w-3 opacity-60" />
//                           {materiel.utilisateur_attribue}
//                         </span>
//                       ) : (
//                         <span className="text-base-content opacity-50">-</span>
//                       )}
//                     </td>
//                     <td>
//                       <span className="text-sm flex items-center gap-1">
//                         <Clock className="h-3 w-3 opacity-50" />
//                         {materiel.date_achat ? new Date(materiel.date_achat).toLocaleDateString('fr-FR') : '-'}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="flex justify-center space-x-1">
//                         <button
//                           onClick={() => handleEdit(materiel)}
//                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                           title="Modifier"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(materiel.id)}
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

//           {safeArray(filteredMateriels).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Search className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucun matériel trouvé</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterEtat 
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucun matériel n'est enregistré dans le système"
//                   }
//                 </p>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-primary btn-sm mt-4"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Ajouter le premier matériel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de matériel */}
//       <MaterielForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingMateriel(undefined);
//           showNotification('info', '📝 Formulaire de matériel fermé');
//         }}
//         onSubmit={handleSubmit}
//         materiel={editingMateriel}
//         fournisseurs={fournisseurs}
//       />
//     </div>
//   );
// };

// export default Materiels;




// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Plus, Search, Eye, Filter, Download, Edit, Trash2, 
// //   CheckSquare, Square, X, BarChart3, Cpu, HardDrive, 
// //   Clock, User, CheckCircle, AlertTriangle, RefreshCw,
// //   TrendingUp, Battery, BatteryFull, BatteryLow, BatteryMedium,
// //   Server, Wrench, Zap, Shield, Package, Database
// // } from 'lucide-react';
// // import { Materiel, Fournisseur } from '../types';
// // import MaterielForm from '../components/MaterielForm';
// // import { materielsAPI, fournisseursAPI } from '../services/api';

// // // Fonctions helper pour la sécurité des tableaux
// // const safeArray = (data: any): Materiel[] => {
// //   return Array.isArray(data) ? data : [];
// // };

// // const safeFilter = (array: any[], condition: (item: any) => boolean): Materiel[] => {
// //   if (!Array.isArray(array)) return [];
// //   return array.filter(condition);
// // };

// // const extractDataFromResponse = (response: any): any[] => {
// //   if (!response || !response.data) {
// //     console.log('❌ Réponse vide ou sans data:', response);
// //     return [];
// //   }
  
// //   if (Array.isArray(response.data)) {
// //     return response.data;
// //   }
  
// //   if (response.data.results && Array.isArray(response.data.results)) {
// //     return response.data.results;
// //   }
  
// //   if (response.data.data && Array.isArray(response.data.data)) {
// //     return response.data.data;
// //   }
  
// //   if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// //     return [response.data];
// //   }
  
// //   console.warn('⚠️ Format de réponse non reconnu:', response.data);
// //   return [];
// // };

// // // Fonction de notification
// // const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
// //   const notification = document.createElement('div');
// //   notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
// //     type === 'success' ? 'bg-green-500 text-white' :
// //     type === 'error' ? 'bg-red-500 text-white' :
// //     type === 'warning' ? 'bg-yellow-500 text-white' :
// //     'bg-blue-500 text-white'
// //   }`;
// //   notification.innerHTML = `
// //     <div class="flex items-center gap-2">
// //       ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
// //       <span>${message}</span>
// //     </div>
// //   `;
  
// //   document.body.appendChild(notification);
  
// //   setTimeout(() => {
// //     document.body.removeChild(notification);
// //   }, 5000);
// // };

// // const Materiels: React.FC = () => {
// //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// //   const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
// //   const [filteredMateriels, setFilteredMateriels] = useState<Materiel[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string>('');
// //   const [searchTerm, setSearchTerm] = useState<string>('');
// //   const [filterEtat, setFilterEtat] = useState<string>('');
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [editingMateriel, setEditingMateriel] = useState<Materiel | undefined>();
// //   const [selectedMateriels, setSelectedMateriels] = useState<number[]>([]);
// //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
// //   const [refreshing, setRefreshing] = useState<boolean>(false);
  
// //   // États pour la confirmation de suppression
// //   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
// //   const [materielToDelete, setMaterielToDelete] = useState<number | null>(null);
// //   const [deleteMultiple, setDeleteMultiple] = useState(false);

// //   // Statistiques avec tous les états
// //   const [statistiques, setStatistiques] = useState({
// //     total: 0,
// //     fonctionnel: 0,
// //     enPanne: 0,
// //     repare: 0,
// //     obsolete: 0,
// //     enMaintenance: 0,
// //     enAmelioration: 0,
// //     enReparation: 0,
// //     horsService: 0,
// //     nonAttribue: 0,
// //     attribue: 0,
// //     parService: {} as Record<string, number>,
// //     ageMoyen: 0, // en jours
// //     tauxPanne: 0, // pourcentage
// //     evolution30j: 12, // valeur simulée
// //     parFournisseur: {} as Record<string, number>
// //   });

// //   useEffect(() => {
// //     fetchMateriels();
// //     fetchFournisseurs();
// //   }, []);

// //   useEffect(() => {
// //     filterMateriels();
// //     if (materiels.length > 0) {
// //       calculerStatistiques(materiels);
// //     }
// //   }, [materiels, searchTerm, filterEtat]);

// //   useEffect(() => {
// //     if (filteredMateriels.length > 0 && selectedMateriels.length === filteredMateriels.length) {
// //       setIsSelectAll(true);
// //     } else {
// //       setIsSelectAll(false);
// //     }
// //   }, [selectedMateriels, filteredMateriels]);

// //   const fetchMateriels = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await materielsAPI.getAll();
// //       const extractedData = extractDataFromResponse(response);
// //       console.log('📦 Matériels chargés:', extractedData);
// //       setMateriels(extractedData);
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement matériels:', err);
// //       setError('Erreur lors du chargement des matériels');
// //       showNotification('error', '❌ Erreur lors du chargement des matériels');
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   const fetchFournisseurs = async () => {
// //     try {
// //       const response = await fournisseursAPI.getAll();
// //       const extractedData = extractDataFromResponse(response);
// //       console.log('🏢 Fournisseurs chargés:', extractedData);
// //       setFournisseurs(extractedData);
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement fournisseurs:', err);
// //     }
// //   };

// //   // Fonction pour compter tous les états possibles
// //   const calculerStatistiques = (data: Materiel[]) => {
// //     const now = new Date();
// //     let totalAge = 0;
// //     let countWithDate = 0;
// //     const services: Record<string, number> = {};
// //     const fournisseurs: Record<string, number> = {};

// //     // Initialiser les compteurs pour tous les états
// //     const etats: Record<string, number> = {
// //       fonctionnel: 0,
// //       en_panne: 0,
// //       repare: 0,
// //       obsolete: 0,
// //       en_maintenance: 0,
// //       en_amelioration: 0,
// //       en_reparation: 0,
// //       hors_service: 0
// //     };

// //     data.forEach(materiel => {
// //       // Calcul de l'âge
// //       if (materiel.date_achat) {
// //         const dateAchat = new Date(materiel.date_achat);
// //         const age = Math.floor((now.getTime() - dateAchat.getTime()) / (1000 * 60 * 60 * 24));
// //         totalAge += age;
// //         countWithDate++;
// //       }

// //       // Compter par service
// //       if (materiel.service_attribue) {
// //         services[materiel.service_attribue] = (services[materiel.service_attribue] || 0) + 1;
// //       }

// //       // Compter par fournisseur
// //       if (materiel.fournisseur && typeof materiel.fournisseur === 'object' && 'nom' in materiel.fournisseur) {
// //         const nomFournisseur = (materiel.fournisseur as any).nom;
// //         fournisseurs[nomFournisseur] = (fournisseurs[nomFournisseur] || 0) + 1;
// //       }

// //       // Compter par état
// //       const etat = materiel.etat || 'inconnu';
// //       if (etats.hasOwnProperty(etat)) {
// //         etats[etat]++;
// //       } else {
// //         etats[etat] = 1;
// //       }
// //     });

// //     const stats = {
// //       total: data.length,
// //       fonctionnel: etats.fonctionnel,
// //       enPanne: etats.en_panne,
// //       repare: etats.repare,
// //       obsolete: etats.obsolete,
// //       enMaintenance: etats.en_maintenance,
// //       enAmelioration: etats.en_amelioration,
// //       enReparation: etats.en_reparation,
// //       horsService: etats.hors_service,
// //       nonAttribue: data.filter(m => !m.utilisateur_attribue || m.utilisateur_attribue.trim() === '').length,
// //       attribue: data.filter(m => m.utilisateur_attribue && m.utilisateur_attribue.trim() !== '').length,
// //       parService: services,
// //       parFournisseur: fournisseurs,
// //       ageMoyen: countWithDate > 0 ? Math.round(totalAge / countWithDate) : 0,
// //       tauxPanne: data.length > 0 ? Math.round((etats.en_panne / data.length) * 100) : 0,
// //       evolution30j: 12 // Valeur simulée
// //     };
    
// //     setStatistiques(stats);
// //   };

// //   const filterMateriels = () => {
// //     let filtered = safeArray(materiels);

// //     if (searchTerm) {
// //       filtered = safeFilter(filtered, m => 
// //         m.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         m.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         (m.utilisateur_attribue && m.utilisateur_attribue.toLowerCase().includes(searchTerm.toLowerCase())) ||
// //         (m.service_attribue && m.service_attribue.toLowerCase().includes(searchTerm.toLowerCase()))
// //       );
// //     }

// //     if (filterEtat) {
// //       filtered = safeFilter(filtered, m => m.etat === filterEtat);
// //     }

// //     setFilteredMateriels(filtered);
// //     setSelectedMateriels([]);
// //   };

// //   const handleSubmit = async (materielData: Omit<Materiel, 'id'>) => {
// //     try {
// //       console.group('🔧 DEBUG Materiel Submission');
// //       console.log('Données du formulaire:', materielData);
      
// //       const apiData: any = {
// //         nom: materielData.nom?.trim() || '',
// //         reference: materielData.reference?.trim() || '',
// //         date_achat: materielData.date_achat,
// //         etat: materielData.etat || 'fonctionnel',
// //         service_attribue: materielData.service_attribue || '',
// //         utilisateur_attribue: materielData.utilisateur_attribue?.trim() || ''
// //       };

// //       if (materielData.fournisseur) {
// //         apiData.fournisseur = materielData.fournisseur;
// //       }
      
// //       console.log('📤 Données API formatées:', apiData);
// //       console.groupEnd();

// //       if (editingMateriel) {
// //         const response = await materielsAPI.update(editingMateriel.id, apiData);
// //         console.log('✅ Réponse update:', response.data);
// //         showNotification('success', '✅ Matériel modifié avec succès');
// //       } else {
// //         const response = await materielsAPI.create(apiData);
// //         console.log('✅ Réponse create:', response.data);
// //         showNotification('success', '✅ Matériel créé avec succès');
// //       }
      
// //       fetchMateriels();
// //       setIsFormOpen(false);
// //       setEditingMateriel(undefined);
// //     } catch (error: any) {
// //       console.error('❌ Erreur détaillée:', {
// //         status: error.response?.status,
// //         data: error.response?.data,
// //         config: error.config
// //       });
      
// //       if (error.response?.data?.non_field_errors) {
// //         showNotification('error', `❌ Erreur de validation: ${error.response.data.non_field_errors.join(', ')}`);
// //       } else if (error.response?.data) {
// //         const errorMessages = [];
// //         for (const [field, errors] of Object.entries(error.response.data)) {
// //           if (field === 'non_field_errors') continue;
// //           errorMessages.push(`${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`);
// //         }
// //         showNotification('error', `❌ Erreurs: ${errorMessages.join('; ')}`);
// //       } else {
// //         showNotification('error', `❌ Erreur réseau: ${error.message}`);
// //       }
// //     }
// //   };

// //   const toggleSelectMateriel = (id: number) => {
// //     setSelectedMateriels(prev => 
// //       prev.includes(id) 
// //         ? prev.filter(item => item !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   const toggleSelectAll = () => {
// //     if (isSelectAll) {
// //       setSelectedMateriels([]);
// //       showNotification('info', '✅ Sélection annulée');
// //     } else {
// //       const allIds = filteredMateriels.map(m => m.id);
// //       setSelectedMateriels(allIds);
// //       showNotification('success', `✅ ${allIds.length} matériels sélectionnés`);
// //     }
// //   };

// //   // Rafraîchir les données
// //   const handleRefresh = async () => {
// //     setRefreshing(true);
// //     await fetchMateriels();
// //     showNotification('success', '🔄 Données rafraîchies avec succès');
// //   };

// //   // Confirmation de suppression
// //   const confirmDelete = async () => {
// //     try {
// //       if (deleteMultiple) {
// //         // Suppression multiple
// //         for (const id of selectedMateriels) {
// //           await materielsAPI.delete(id);
// //         }
        
// //         showNotification('success', `✅ ${selectedMateriels.length} matériel(s) supprimé(s) avec succès`);
// //         setSelectedMateriels([]);
// //       } else if (materielToDelete) {
// //         // Suppression simple
// //         await materielsAPI.delete(materielToDelete);
// //         showNotification('success', '✅ Matériel supprimé avec succès');
// //       }
      
// //       await fetchMateriels();
// //     } catch (error) {
// //       showNotification('error', '❌ Erreur lors de la suppression');
// //     } finally {
// //       setShowDeleteConfirm(false);
// //       setMaterielToDelete(null);
// //       setDeleteMultiple(false);
// //     }
// //   };

// //   const handleDeleteSelected = () => {
// //     if (selectedMateriels.length === 0) {
// //       showNotification('error', '❌ Aucun matériel sélectionné');
// //       return;
// //     }

// //     setDeleteMultiple(true);
// //     setShowDeleteConfirm(true);
// //   };

// //   const handleDelete = (id: number) => {
// //     setMaterielToDelete(id);
// //     setDeleteMultiple(false);
// //     setShowDeleteConfirm(true);
// //   };

// //   const handleEditSelected = () => {
// //     if (selectedMateriels.length === 0) {
// //       showNotification('error', '❌ Aucun matériel sélectionné');
// //       return;
// //     }

// //     if (selectedMateriels.length === 1) {
// //       const materiel = materiels.find(m => m.id === selectedMateriels[0]);
// //       if (materiel) {
// //         handleEdit(materiel);
// //       }
// //     } else {
// //       showNotification('info', `📝 Édition multiple de ${selectedMateriels.length} matériels`);
// //     }
// //   };

// //   const handleEdit = (materiel: Materiel) => {
// //     setEditingMateriel(materiel);
// //     setIsFormOpen(true);
// //     showNotification('info', `✏️ Modification du matériel "${materiel.nom}"`);
// //   };

// //   const handleAddNew = () => {
// //     setEditingMateriel(undefined);
// //     setIsFormOpen(true);
// //     showNotification('info', '📝 Ouverture du formulaire de création de matériel');
// //   };

// //   const handleExport = () => {
// //     try {
// //       const dataToExport = filteredMateriels.map(m => ({
// //         Nom: m.nom,
// //         Référence: m.reference,
// //         État: getEtatText(m.etat),
// //         Service: m.service_attribue,
// //         Utilisateur: m.utilisateur_attribue || 'Non attribué',
// //         'Date d\'achat': m.date_achat ? new Date(m.date_achat).toLocaleDateString('fr-FR') : 'Non spécifiée',
// //         Fournisseur: m.fournisseur && typeof m.fournisseur === 'object' && 'nom' in m.fournisseur 
// //           ? (m.fournisseur as any).nom 
// //           : 'Non spécifié'
// //       }));

// //       const csvContent = [
// //         Object.keys(dataToExport[0] || {}).join(','),
// //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// //       ].join('\n');

// //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //       const link = document.createElement('a');
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', `materiels_${new Date().toISOString().split('T')[0]}.csv`);
// //       link.style.visibility = 'hidden';
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);

// //       showNotification('success', '✅ Export CSV réussi !');
// //     } catch (error) {
// //       showNotification('error', '❌ Erreur lors de l\'export');
// //     }
// //   };

// //   const resetFilters = () => {
// //     setSearchTerm('');
// //     setFilterEtat('');
// //     setSelectedMateriels([]);
// //     showNotification('info', '🔄 Filtres réinitialisés');
// //   };

// //   // Fonction pour obtenir le badge d'état
// //   const getEtatBadge = (etat: string) => {
// //     const badges = {
// //       fonctionnel: 'badge-success',
// //       en_panne: 'badge-error',
// //       repare: 'badge-warning',
// //       obsolete: 'badge-neutral',
// //       en_maintenance: 'badge-info',
// //       en_amelioration: 'badge-primary',
// //       en_reparation: 'badge-warning',
// //       hors_service: 'badge-error'
// //     };
// //     return badges[etat as keyof typeof badges] || 'badge-neutral';
// //   };

// //   // Fonction pour obtenir le texte d'état
// //   const getEtatText = (etat: string) => {
// //     const texts = {
// //       fonctionnel: 'Fonctionnel',
// //       en_panne: 'En panne',
// //       repare: 'Réparé',
// //       obsolete: 'Obsolète',
// //       en_maintenance: 'En maintenance',
// //       en_amelioration: 'En amélioration',
// //       en_reparation: 'En réparation',
// //       hors_service: 'Hors service'
// //     };
// //     return texts[etat as keyof typeof texts] || etat;
// //   };

// //   // Fonction pour obtenir l'icône d'état
// //   const getEtatIcon = (etat: string) => {
// //     switch (etat) {
// //       case 'fonctionnel': return <CheckCircle className="h-4 w-4" />;
// //       case 'en_panne': return <AlertTriangle className="h-4 w-4" />;
// //       case 'repare': return <Wrench className="h-4 w-4" />;
// //       case 'obsolete': return <Package className="h-4 w-4" />;
// //       case 'en_maintenance': return <Wrench className="h-4 w-4" />;
// //       case 'en_amelioration': return <Zap className="h-4 w-4" />;
// //       case 'en_reparation': return <Wrench className="h-4 w-4" />;
// //       case 'hors_service': return <X className="h-4 w-4" />;
// //       default: return <HardDrive className="h-4 w-4" />;
// //     }
// //   };

  

// //   if (loading && !refreshing) {
// //     return (
// //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-4">
// //           <span className="loading loading-spinner loading-lg text-primary"></span>
// //           <p className="text-base-content">Chargement des matériels...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 bg-base-100 min-h-screen">
// //       {/* Modal de confirmation de suppression */}
// //       {showDeleteConfirm && (
// //         <div className="modal modal-open">
// //           <div className="modal-box">
// //             <h3 className="font-bold text-lg">Confirmation de suppression</h3>
// //             <p className="py-4">
// //               {deleteMultiple 
// //                 ? `Êtes-vous sûr de vouloir supprimer ${selectedMateriels.length} matériel(s) ? Cette action est irréversible.`
// //                 : 'Êtes-vous sûr de vouloir supprimer ce matériel ? Cette action est irréversible.'
// //               }
// //             </p>
// //             <div className="modal-action">
// //               <button 
// //                 className="btn btn-ghost"
// //                 onClick={() => {
// //                   setShowDeleteConfirm(false);
// //                   setMaterielToDelete(null);
// //                   setDeleteMultiple(false);
// //                   showNotification('info', '🗑️ Suppression annulée');
// //                 }}
// //               >
// //                 Annuler
// //               </button>
// //               <button 
// //                 className="btn btn-error"
// //                 onClick={confirmDelete}
// //               >
// //                 Supprimer
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {error && (
// //         <div className="alert alert-error mb-4 shadow-lg">
// //           <AlertTriangle className="h-5 w-5" />
// //           <span>{error}</span>
// //           <button className="btn btn-ghost btn-sm" onClick={fetchMateriels}>
// //             Réessayer
// //           </button>
// //         </div>
// //       )}

// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
// //             <Server className="h-8 w-8 text-primary" />
// //             Gestion des Matériels
// //           </h1>
// //           <p className="text-base-content opacity-60 mt-1">
// //             {safeArray(filteredMateriels).length} matériel(s) trouvé(s)
// //             {selectedMateriels.length > 0 && (
// //               <span className="text-primary font-semibold ml-2">
// //                 ({selectedMateriels.length} sélectionné(s))
// //               </span>
// //             )}
// //           </p>
// //         </div>
// //         <div className="flex gap-2">
// //           <button
// //             onClick={handleRefresh}
// //             className="btn btn-outline btn-sm"
// //             title="Rafraîchir"
// //             disabled={refreshing}
// //           >
// //             <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
// //             {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
// //           </button>
// //           <button
// //             onClick={handleExport}
// //             className="btn btn-outline btn-sm"
// //             title="Exporter la liste"
// //           >
// //             <Download className="h-4 w-4 mr-2" />
// //             Exporter
// //           </button>
// //           <button
// //             onClick={handleAddNew}
// //             className="btn btn-primary btn-sm"
// //           >
// //             <Plus className="h-4 w-4 mr-2" />
// //             Nouveau matériel
// //           </button>
// //         </div>
// //       </div>

// //       {/* Section Statistiques - 8 CARTES POUR TOUS LES ÉTATS */}
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
// //         {/* Stat 1 - Total matériels */}
// //         <div className="card bg-base-200 shadow-lg">
// //           <div className="card-body p-4 text-center">
// //             <div className="flex justify-center mb-2">
// //               <Server className="h-8 w-8 text-primary" />
// //             </div>
// //             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
// //             <p className="text-sm opacity-60">Total matériels</p>
// //           </div>
// //         </div>

// //         {/* Stat 2 - Fonctionnels */}
// //         <div className="card bg-success/10 shadow-lg">
// //           <div className="card-body p-4 text-center">
// //             <div className="flex justify-center mb-2">
// //               <CheckCircle className="h-8 w-8 text-success" />
// //             </div>
// //             <h3 className="text-3xl font-bold text-success mb-1">{statistiques.fonctionnel}</h3>
// //             <p className="text-sm opacity-60">Fonctionnels</p>
// //             <p className="text-xs mt-1">
// //               {statistiques.total > 0 ? Math.round((statistiques.fonctionnel / statistiques.total) * 100) : 0}% du parc
// //             </p>
// //           </div>
// //         </div>

// //         {/* Stat 3 - En panne */}
// //         <div className="card bg-error/10 shadow-lg">
// //           <div className="card-body p-4 text-center">
// //             <div className="flex justify-center mb-2">
// //               <AlertTriangle className="h-8 w-8 text-error" />
// //             </div>
// //             <h3 className="text-3xl font-bold text-error mb-1">{statistiques.enPanne}</h3>
// //             <p className="text-sm opacity-60">En panne</p>
// //             <p className="text-xs mt-1">
// //               {statistiques.tauxPanne}% du parc
// //             </p>
// //           </div>
// //         </div>

// //         {/* Stat 4 - Réparés */}
// //         <div className="card bg-warning/10 shadow-lg">
// //           <div className="card-body p-4 text-center">
// //             <div className="flex justify-center mb-2">
// //               <Wrench className="h-8 w-8 text-warning" />
// //             </div>
// //             <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.repare}</h3>
// //             <p className="text-sm opacity-60">Réparés</p>
// //             <p className="text-xs mt-1">
// //               {statistiques.total > 0 ? Math.round((statistiques.repare / statistiques.total) * 100) : 0}% du parc
// //             </p>
// //           </div>
// //         </div>

// //         {/* Stat 5 - En maintenance */}
// //         <div className="card bg-info/10 shadow-lg">
// //           <div className="card-body p-4 text-center">
// //             <div className="flex justify-center mb-2">
// //               <Wrench className="h-8 w-8 text-info" />
// //             </div>
// //             <h3 className="text-3xl font-bold text-info mb-1">{statistiques.enMaintenance || 0}</h3>
// //             <p className="text-sm opacity-60">En maintenance</p>
// //             <p className="text-xs mt-1">
// //               {statistiques.total > 0 ? Math.round((statistiques.enMaintenance / statistiques.total) * 100) : 0}% du parc
// //             </p>
// //           </div>
// //         </div>

// //         {/* Stat 6 - En amélioration */}
// //         <div className="card bg-primary/10 shadow-lg">
// //           <div className="card-body p-4 text-center">
// //             <div className="flex justify-center mb-2">
// //               <Zap className="h-8 w-8 text-primary" />
// //             </div>
// //             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.enAmelioration || 0}</h3>
// //             <p className="text-sm opacity-60">En amélioration</p>
// //             <p className="text-xs mt-1">
// //               {statistiques.total > 0 ? Math.round((statistiques.enAmelioration / statistiques.total) * 100) : 0}% du parc
// //             </p>
// //           </div>
// //         </div>

// //         {/* Stat 7 - Obsolètes */}
// //         <div className="card bg-neutral/10 shadow-lg">
// //           <div className="card-body p-4 text-center">
// //             <div className="flex justify-center mb-2">
// //               <Package className="h-8 w-8 text-neutral" />
// //             </div>
// //             <h3 className="text-3xl font-bold text-neutral mb-1">{statistiques.obsolete}</h3>
// //             <p className="text-sm opacity-60">Obsolètes</p>
// //             <p className="text-xs mt-1">
// //               {statistiques.total > 0 ? Math.round((statistiques.obsolete / statistiques.total) * 100) : 0}% du parc
// //             </p>
// //           </div>
// //         </div>

// //         {/* Stat 8 - Hors service */}
// //         <div className="card bg-error/20 shadow-lg">
// //           <div className="card-body p-4 text-center">
// //             <div className="flex justify-center mb-2">
// //               <X className="h-8 w-8 text-error" />
// //             </div>
// //             <h3 className="text-3xl font-bold text-error mb-1">{statistiques.horsService || 0}</h3>
// //             <p className="text-sm opacity-60">Hors service</p>
// //             <p className="text-xs mt-1">
// //               {statistiques.total > 0 ? Math.round((statistiques.horsService / statistiques.total) * 100) : 0}% du parc
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section Correspondance avec réparations */}
// //       <div className="mb-6">
// //         <div className="card bg-base-200 shadow-sm">
// //           <div className="card-body p-4">
// //             <h3 className="font-bold text-base-content mb-3">⚙️ Synchronisation avec les réparations</h3>
// //             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
// //                 <div className="flex items-center justify-between">
// //                   <span className="font-medium text-sm">Réparation terminée</span>
// //                   <span className="badge badge-success badge-sm">✅</span>
// //                 </div>
// //                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>Fonctionnel</strong></div>
// //               </div>
// //               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-warning">
// //                 <div className="flex items-center justify-between">
// //                   <span className="font-medium text-sm">Corrective en cours</span>
// //                   <span className="badge badge-warning badge-sm">🔧</span>
// //                 </div>
// //                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>En panne</strong></div>
// //               </div>
// //               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-info">
// //                 <div className="flex items-center justify-between">
// //                   <span className="font-medium text-sm">Préventive en cours</span>
// //                   <span className="badge badge-info badge-sm">🛠️</span>
// //                 </div>
// //                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>En maintenance</strong></div>
// //               </div>
// //               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-primary">
// //                 <div className="flex items-center justify-between">
// //                   <span className="font-medium text-sm">Améliorative en cours</span>
// //                   <span className="badge badge-primary badge-sm">⚡</span>
// //                 </div>
// //                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>En amélioration</strong></div>
// //               </div>
// //             </div>
// //             <div className="text-xs opacity-60 mt-3">
// //               ⚡ Ces mises à jour sont automatiques après chaque réparation. L'état du matériel est synchronisé en temps réel.
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section Métriques secondaires */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
// //         {/* Âge moyen */}
// //         <div className="card bg-base-200 shadow-lg">
// //           <div className="card-body p-4">
// //             <div className="flex items-center gap-3">
// //               <Clock className="h-10 w-10 text-warning" />
// //               <div>
// //                 <h3 className="text-2xl font-bold text-warning">{statistiques.ageMoyen}</h3>
// //                 <p className="text-sm opacity-60">Âge moyen (jours)</p>
// //                 <p className="text-xs mt-1">
// //                   {statistiques.ageMoyen < 365 
// //                     ? `Jeune parc (${Math.floor(statistiques.ageMoyen / 30)} mois)` 
// //                     : `Ancien parc (${Math.floor(statistiques.ageMoyen / 365)} ans)`
// //                   }
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Taux d'attribution */}
// //         <div className="card bg-base-200 shadow-lg">
// //           <div className="card-body p-4">
// //             <div className="flex items-center gap-3">
// //               <User className="h-10 w-10 text-primary" />
// //               <div>
// //                 <h3 className="text-2xl font-bold text-primary">
// //                   {statistiques.total > 0 
// //                     ? `${Math.round((statistiques.attribue / statistiques.total) * 100)}%`
// //                     : '0%'
// //                   }
// //                 </h3>
// //                 <p className="text-sm opacity-60">Taux d'attribution</p>
// //                 <p className="text-xs mt-1">
// //                   {statistiques.attribue} attribués / {statistiques.nonAttribue} non attribués
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Filtres et recherche */}
// //       <div className="card bg-base-200 shadow-xl mb-6">
// //         <div className="card-body">
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔍 Rechercher</span>
// //               </label>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// //                 <input
// //                   type="text"
// //                   placeholder="Nom, référence, utilisateur, service..."
// //                   className="input input-bordered w-full pl-10 bg-base-100"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">📊 État</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterEtat}
// //                 onChange={(e) => setFilterEtat(e.target.value)}
// //               >
// //                 <option value="">Tous les états</option>
// //                 <option value="fonctionnel">Fonctionnel</option>
// //                 <option value="en_panne">En panne</option>
// //                 <option value="repare">Réparé</option>
// //                 <option value="obsolete">Obsolète</option>
// //                 <option value="en_maintenance">En maintenance</option>
// //                 <option value="en_amelioration">En amélioration</option>
// //                 <option value="en_reparation">En réparation</option>
// //                 <option value="hors_service">Hors service</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">📁 Service</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 onChange={(e) => {
// //                   if (e.target.value) {
// //                     setSearchTerm(e.target.value);
// //                   }
// //                 }}
// //               >
// //                 <option value="">Tous les services</option>
// //                 {Object.entries(statistiques.parService).map(([service, count]) => (
// //                   <option key={service} value={service}>
// //                     {service} ({count})
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🏢 Fournisseur</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 onChange={(e) => {
// //                   if (e.target.value) {
// //                     setSearchTerm(e.target.value);
// //                   }
// //                 }}
// //               >
// //                 <option value="">Tous les fournisseurs</option>
// //                 {Object.entries(statistiques.parFournisseur).map(([fournisseur, count]) => (
// //                   <option key={fournisseur} value={fournisseur}>
// //                     {fournisseur} ({count})
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           <div className="flex justify-between items-center mt-4">
// //             <div className="flex gap-2">
// //               {selectedMateriels.length > 0 && (
// //                 <>
// //                   <button
// //                     onClick={handleEditSelected}
// //                     className="btn btn-outline btn-sm"
// //                     title="Modifier la sélection"
// //                   >
// //                     <Edit className="h-4 w-4 mr-2" />
// //                     Modifier ({selectedMateriels.length})
// //                   </button>
// //                   <button
// //                     onClick={handleDeleteSelected}
// //                     className="btn btn-error btn-sm"
// //                     title="Supprimer la sélection"
// //                   >
// //                     <Trash2 className="h-4 w-4 mr-2" />
// //                     Supprimer ({selectedMateriels.length})
// //                   </button>
// //                 </>
// //               )}
// //             </div>
// //             <div className="flex gap-2">
// //               <button
// //                 onClick={resetFilters}
// //                 className="btn btn-ghost btn-sm"
// //                 title="Réinitialiser les filtres"
// //               >
// //                 <X className="h-4 w-4 mr-2" />
// //                 Réinitialiser
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Tableau des matériels */}
// //       <div className="card bg-base-200 shadow-xl">
// //         <div className="card-body p-0">
// //           <div className="overflow-x-auto">
// //             <table className="table table-zebra">
// //               <thead>
// //                 <tr className="bg-base-300">
// //                   <th>
// //                     <div className="flex items-center">
// //                       <button 
// //                         onClick={toggleSelectAll}
// //                         className="btn btn-ghost btn-xs p-1 mr-2"
// //                         title={isSelectAll ? "Désélectionner tout" : "Sélectionner tout"}
// //                       >
// //                         {isSelectAll ? (
// //                           <CheckSquare className="h-4 w-4 text-primary" />
// //                         ) : (
// //                           <Square className="h-4 w-4" />
// //                         )}
// //                       </button>
// //                       ID
// //                     </div>
// //                   </th>
// //                   <th>Nom</th>
// //                   <th>Référence</th>
// //                   <th>État</th>
// //                   <th>Service</th>
// //                   <th>Utilisateur</th>
// //                   <th>Date d'achat</th>
// //                   <th>Fournisseur</th>
// //                   <th className="text-right">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {safeArray(filteredMateriels).length === 0 ? (
// //                   <tr>
// //                     <td colSpan={9} className="text-center py-8">
// //                       <div className="flex flex-col items-center gap-2">
// //                         <Package className="h-12 w-12 text-base-content opacity-30" />
// //                         <p className="text-base-content opacity-50">
// //                           {searchTerm || filterEtat ? 'Aucun matériel correspondant aux filtres' : 'Aucun matériel trouvé'}
// //                         </p>
// //                         {searchTerm || filterEtat ? (
// //                           <button 
// //                             onClick={resetFilters}
// //                             className="btn btn-sm btn-ghost mt-2"
// //                           >
// //                             Réinitialiser les filtres
// //                           </button>
// //                         ) : (
// //                           <button 
// //                             onClick={handleAddNew}
// //                             className="btn btn-sm btn-primary mt-2"
// //                           >
// //                             <Plus className="h-4 w-4 mr-2" />
// //                             Ajouter un premier matériel
// //                           </button>
// //                         )}
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   safeArray(filteredMateriels).map(materiel => (
// //                     <tr key={materiel.id} className="hover:bg-base-100/50">
// //                       <td>
// //                         <div className="flex items-center">
// //                           <input
// //                             type="checkbox"
// //                             className="checkbox checkbox-xs mr-3"
// //                             checked={selectedMateriels.includes(materiel.id)}
// //                             onChange={() => toggleSelectMateriel(materiel.id)}
// //                           />
// //                           <span className="font-mono text-xs opacity-70">#{materiel.id}</span>
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className="font-medium">{materiel.nom}</div>
// //                       </td>
// //                       <td>
// //                         <div className="font-mono text-sm">{materiel.reference}</div>
// //                       </td>
// //                       <td>
// //                         <div className={`badge gap-2 ${getEtatBadge(materiel.etat)}`}>
// //                           {getEtatIcon(materiel.etat)}
// //                           {getEtatText(materiel.etat)}
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className="flex items-center gap-2">
// //                           <Database className="h-4 w-4 opacity-50" />
// //                           <span>{materiel.service_attribue || 'Non attribué'}</span>
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className="flex items-center gap-2">
// //                           <User className="h-4 w-4 opacity-50" />
// //                           <span>{materiel.utilisateur_attribue || 'Non attribué'}</span>
// //                         </div>
// //                       </td>
// //                       <td>
// //                         {materiel.date_achat ? (
// //                           <div className="flex items-center gap-2">
// //                             <Clock className="h-4 w-4 opacity-50" />
// //                             <span>{new Date(materiel.date_achat).toLocaleDateString('fr-FR')}</span>
// //                           </div>
// //                         ) : (
// //                           <span className="opacity-50">Non spécifiée</span>
// //                         )}
// //                       </td>
// //                       <td>
// //                         {materiel.fournisseur && typeof materiel.fournisseur === 'object' && 'nom' in materiel.fournisseur ? (
// //                           <div className="flex items-center gap-2">
// //                             <Shield className="h-4 w-4 opacity-50" />
// //                             <span>{(materiel.fournisseur as any).nom}</span>
// //                           </div>
// //                         ) : (
// //                           <span className="opacity-50">Non spécifié</span>
// //                         )}
// //                       </td>
// //                       <td>
// //                         <div className="flex justify-end gap-2">
// //                           <button
// //                             onClick={() => handleEdit(materiel)}
// //                             className="btn btn-ghost btn-sm"
// //                             title="Modifier"
// //                           >
// //                             <Edit className="h-4 w-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDelete(materiel.id)}
// //                             className="btn btn-ghost btn-sm text-error hover:bg-error/20"
// //                             title="Supprimer"
// //                           >
// //                             <Trash2 className="h-4 w-4" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Footer avec statistiques */}
// //       <div className="mt-6 text-center text-sm text-base-content opacity-50">
// //         <p>
// //           Dernière mise à jour : {new Date().toLocaleString('fr-FR')} | 
// //           Matériels chargés : {safeArray(materiels).length} | 
// //           Filtre actif : {searchTerm ? `"${searchTerm}"` : 'Aucun'} {filterEtat && `| État: ${filterEtat}`}
// //         </p>
// //       </div>

// //       {/* Formulaire de création/édition */}
// //       {isFormOpen && (
// //         <div className="modal modal-open">
// //           <div className="modal-box max-w-4xl">
// //             <div className="flex justify-between items-center mb-6">
// //               <h3 className="font-bold text-2xl">
// //                 {editingMateriel ? '✏️ Modifier le matériel' : '➕ Nouveau matériel'}
// //               </h3>
// //               <button
// //                 onClick={() => {
// //                   setIsFormOpen(false);
// //                   setEditingMateriel(undefined);
// //                   showNotification('info', '❌ Formulaire fermé');
// //                 }}
// //                 className="btn btn-ghost btn-sm"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>
// //             <MaterielForm
// //               materiel={editingMateriel}
// //               onSubmit={handleSubmit}
// //               onCancel={() => {
// //                 setIsFormOpen(false);
// //                 setEditingMateriel(undefined);
// //                 showNotification('info', '❌ Formulaire fermé');
// //               }}
// //               fournisseurs={fournisseurs}
// //             />
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Materiels;






// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Eye, Filter, Download, Edit, Trash2, 
//   CheckSquare, Square, X, BarChart3, Cpu, HardDrive, 
//   Clock, User, CheckCircle, AlertTriangle, RefreshCw,
//   TrendingUp, Battery, BatteryFull, BatteryLow, BatteryMedium,
//   Server, Wrench, Zap, Shield, Package, Database, ArrowLeft
// } from 'lucide-react';
// import { Materiel, Fournisseur } from '../types';
// import MaterielForm from '../components/MaterielForm';
// import { materielsAPI, fournisseursAPI } from '../services/api';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Materiel[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Materiel[] => {
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

// const Materiels: React.FC = () => {
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
//   const [filteredMateriels, setFilteredMateriels] = useState<Materiel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterEtat, setFilterEtat] = useState<string>('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingMateriel, setEditingMateriel] = useState<Materiel | undefined>();
//   const [selectedMateriels, setSelectedMateriels] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
  
//   // États pour la confirmation de suppression
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [materielToDelete, setMaterielToDelete] = useState<number | null>(null);
//   const [deleteMultiple, setDeleteMultiple] = useState(false);

//   // Statistiques avec tous les états
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     fonctionnel: 0,
//     enPanne: 0,
//     repare: 0,
//     obsolete: 0,
//     enMaintenance: 0,
//     enAmelioration: 0,
//     enReparation: 0,
//     horsService: 0,
//     nonAttribue: 0,
//     attribue: 0,
//     parService: {} as Record<string, number>,
//     ageMoyen: 0, // en jours
//     tauxPanne: 0, // pourcentage
//     evolution30j: 12, // valeur simulée
//     parFournisseur: {} as Record<string, number>
//   });

//   useEffect(() => {
//     fetchMateriels();
//     fetchFournisseurs();
//   }, []);

//   useEffect(() => {
//     filterMateriels();
//     if (materiels.length > 0) {
//       calculerStatistiques(materiels);
//     }
//   }, [materiels, searchTerm, filterEtat]);

//   useEffect(() => {
//     if (filteredMateriels.length > 0 && selectedMateriels.length === filteredMateriels.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedMateriels, filteredMateriels]);

//   const fetchMateriels = async () => {
//     try {
//       setLoading(true);
//       const response = await materielsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       console.log('📦 Matériels chargés:', extractedData);
//       setMateriels(extractedData);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement matériels:', err);
//       setError('Erreur lors du chargement des matériels');
//       showNotification('error', '❌ Erreur lors du chargement des matériels');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchFournisseurs = async () => {
//     try {
//       const response = await fournisseursAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       console.log('🏢 Fournisseurs chargés:', extractedData);
//       setFournisseurs(extractedData);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement fournisseurs:', err);
//     }
//   };

//   // Fonction pour compter tous les états possibles
//   const calculerStatistiques = (data: Materiel[]) => {
//     const now = new Date();
//     let totalAge = 0;
//     let countWithDate = 0;
//     const services: Record<string, number> = {};
//     const fournisseurs: Record<string, number> = {};

//     // Initialiser les compteurs pour tous les états
//     const etats: Record<string, number> = {
//       fonctionnel: 0,
//       en_panne: 0,
//       repare: 0,
//       obsolete: 0,
//       en_maintenance: 0,
//       en_amelioration: 0,
//       en_reparation: 0,
//       hors_service: 0
//     };

//     data.forEach(materiel => {
//       // Calcul de l'âge
//       if (materiel.date_achat) {
//         const dateAchat = new Date(materiel.date_achat);
//         const age = Math.floor((now.getTime() - dateAchat.getTime()) / (1000 * 60 * 60 * 24));
//         totalAge += age;
//         countWithDate++;
//       }

//       // Compter par service
//       if (materiel.service_attribue) {
//         services[materiel.service_attribue] = (services[materiel.service_attribue] || 0) + 1;
//       }

//       // Compter par fournisseur
//       if (materiel.fournisseur && typeof materiel.fournisseur === 'object' && 'nom' in materiel.fournisseur) {
//         const nomFournisseur = (materiel.fournisseur as any).nom;
//         fournisseurs[nomFournisseur] = (fournisseurs[nomFournisseur] || 0) + 1;
//       }

//       // Compter par état
//       const etat = materiel.etat || 'inconnu';
//       if (etats.hasOwnProperty(etat)) {
//         etats[etat]++;
//       } else {
//         etats[etat] = 1;
//       }
//     });

//     const stats = {
//       total: data.length,
//       fonctionnel: etats.fonctionnel,
//       enPanne: etats.en_panne,
//       repare: etats.repare,
//       obsolete: etats.obsolete,
//       enMaintenance: etats.en_maintenance,
//       enAmelioration: etats.en_amelioration,
//       enReparation: etats.en_reparation,
//       horsService: etats.hors_service,
//       nonAttribue: data.filter(m => !m.utilisateur_attribue || m.utilisateur_attribue.trim() === '').length,
//       attribue: data.filter(m => m.utilisateur_attribue && m.utilisateur_attribue.trim() !== '').length,
//       parService: services,
//       parFournisseur: fournisseurs,
//       ageMoyen: countWithDate > 0 ? Math.round(totalAge / countWithDate) : 0,
//       tauxPanne: data.length > 0 ? Math.round((etats.en_panne / data.length) * 100) : 0,
//       evolution30j: 12 // Valeur simulée
//     };
    
//     setStatistiques(stats);
//   };

//   const filterMateriels = () => {
//     let filtered = safeArray(materiels);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, m => 
//         m.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         m.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (m.utilisateur_attribue && m.utilisateur_attribue.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (m.service_attribue && m.service_attribue.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     if (filterEtat) {
//       filtered = safeFilter(filtered, m => m.etat === filterEtat);
//     }

//     setFilteredMateriels(filtered);
//     setSelectedMateriels([]);
//   };

//   const handleSubmit = async (materielData: Omit<Materiel, 'id'>) => {
//     try {
//       console.group('🔧 DEBUG Materiel Submission');
//       console.log('Données du formulaire:', materielData);
      
//       const apiData: any = {
//         nom: materielData.nom?.trim() || '',
//         reference: materielData.reference?.trim() || '',
//         date_achat: materielData.date_achat,
//         etat: materielData.etat || 'fonctionnel',
//         service_attribue: materielData.service_attribue || '',
//         utilisateur_attribue: materielData.utilisateur_attribue?.trim() || ''
//       };

//       if (materielData.fournisseur) {
//         apiData.fournisseur = materielData.fournisseur;
//       }
      
//       console.log('📤 Données API formatées:', apiData);
//       console.groupEnd();

//       if (editingMateriel) {
//         const response = await materielsAPI.update(editingMateriel.id, apiData);
//         console.log('✅ Réponse update:', response.data);
//         showNotification('success', '✅ Matériel modifié avec succès');
//       } else {
//         const response = await materielsAPI.create(apiData);
//         console.log('✅ Réponse create:', response.data);
//         showNotification('success', '✅ Matériel créé avec succès');
//       }
      
//       fetchMateriels();
//       setIsFormOpen(false);
//       setEditingMateriel(undefined);
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

//   const toggleSelectMateriel = (id: number) => {
//     setSelectedMateriels(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedMateriels([]);
//       showNotification('info', '✅ Sélection annulée');
//     } else {
//       const allIds = filteredMateriels.map(m => m.id);
//       setSelectedMateriels(allIds);
//       showNotification('success', `✅ ${allIds.length} matériels sélectionnés`);
//     }
//   };

//   // Rafraîchir les données
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchMateriels();
//     showNotification('success', '🔄 Données rafraîchies avec succès');
//   };

//   // Confirmation de suppression
//   const confirmDelete = async () => {
//     try {
//       if (deleteMultiple) {
//         // Suppression multiple
//         for (const id of selectedMateriels) {
//           await materielsAPI.delete(id);
//         }
        
//         showNotification('success', `✅ ${selectedMateriels.length} matériel(s) supprimé(s) avec succès`);
//         setSelectedMateriels([]);
//       } else if (materielToDelete) {
//         // Suppression simple
//         await materielsAPI.delete(materielToDelete);
//         showNotification('success', '✅ Matériel supprimé avec succès');
//       }
      
//       await fetchMateriels();
//     } catch (error) {
//       showNotification('error', '❌ Erreur lors de la suppression');
//     } finally {
//       setShowDeleteConfirm(false);
//       setMaterielToDelete(null);
//       setDeleteMultiple(false);
//     }
//   };

//   const handleDeleteSelected = () => {
//     if (selectedMateriels.length === 0) {
//       showNotification('error', '❌ Aucun matériel sélectionné');
//       return;
//     }

//     setDeleteMultiple(true);
//     setShowDeleteConfirm(true);
//   };

//   const handleDelete = (id: number) => {
//     setMaterielToDelete(id);
//     setDeleteMultiple(false);
//     setShowDeleteConfirm(true);
//   };

//   const handleEditSelected = () => {
//     if (selectedMateriels.length === 0) {
//       showNotification('error', '❌ Aucun matériel sélectionné');
//       return;
//     }

//     if (selectedMateriels.length === 1) {
//       const materiel = materiels.find(m => m.id === selectedMateriels[0]);
//       if (materiel) {
//         handleEdit(materiel);
//       }
//     } else {
//       showNotification('info', `📝 Édition multiple de ${selectedMateriels.length} matériels`);
//     }
//   };

//   const handleEdit = (materiel: Materiel) => {
//     setEditingMateriel(materiel);
//     setIsFormOpen(true);
//     showNotification('info', `✏️ Modification du matériel "${materiel.nom}"`);
//   };

//   const handleAddNew = () => {
//     setEditingMateriel(undefined);
//     setIsFormOpen(true);
//     showNotification('info', '📝 Ouverture du formulaire de création de matériel');
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredMateriels.map(m => ({
//         Nom: m.nom,
//         Référence: m.reference,
//         État: getEtatText(m.etat),
//         Service: m.service_attribue,
//         Utilisateur: m.utilisateur_attribue || 'Non attribué',
//         'Date d\'achat': m.date_achat ? new Date(m.date_achat).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         Fournisseur: m.fournisseur && typeof m.fournisseur === 'object' && 'nom' in m.fournisseur 
//           ? (m.fournisseur as any).nom 
//           : 'Non spécifié'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `materiels_${new Date().toISOString().split('T')[0]}.csv`);
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
//     setFilterEtat('');
//     setSelectedMateriels([]);
//     showNotification('info', '🔄 Filtres réinitialisés');
//   };

//   // Fonction pour obtenir le badge d'état
//   const getEtatBadge = (etat: string) => {
//     const badges = {
//       fonctionnel: 'badge-success',
//       en_panne: 'badge-error',
//       repare: 'badge-warning',
//       obsolete: 'badge-neutral',
//       en_maintenance: 'badge-info',
//       en_amelioration: 'badge-primary',
//       en_reparation: 'badge-warning',
//       hors_service: 'badge-error'
//     };
//     return badges[etat as keyof typeof badges] || 'badge-neutral';
//   };

//   // Fonction pour obtenir le texte d'état
//   const getEtatText = (etat: string) => {
//     const texts = {
//       fonctionnel: 'Fonctionnel',
//       en_panne: 'En panne',
//       repare: 'Réparé',
//       obsolete: 'Obsolète',
//       en_maintenance: 'En maintenance',
//       en_amelioration: 'En amélioration',
//       en_reparation: 'En réparation',
//       hors_service: 'Hors service'
//     };
//     return texts[etat as keyof typeof texts] || etat;
//   };

//   // Fonction pour obtenir l'icône d'état
//   const getEtatIcon = (etat: string) => {
//     switch (etat) {
//       case 'fonctionnel': return <CheckCircle className="h-4 w-4" />;
//       case 'en_panne': return <AlertTriangle className="h-4 w-4" />;
//       case 'repare': return <Wrench className="h-4 w-4" />;
//       case 'obsolete': return <Package className="h-4 w-4" />;
//       case 'en_maintenance': return <Wrench className="h-4 w-4" />;
//       case 'en_amelioration': return <Zap className="h-4 w-4" />;
//       case 'en_reparation': return <Wrench className="h-4 w-4" />;
//       case 'hors_service': return <X className="h-4 w-4" />;
//       default: return <HardDrive className="h-4 w-4" />;
//     }
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setEditingMateriel(undefined);
//     showNotification('info', '❌ Formulaire fermé');
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des matériels...</p>
//         </div>
//       </div>
//     );
//   }

//   // Si le formulaire est ouvert, afficher seulement le formulaire
//   if (isFormOpen) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen">
//         <div className="max-w-7xl mx-auto">
//           {/* En-tête du formulaire */}
//           <div className="mb-6">
//             <button
//               onClick={handleCloseForm}
//               className="btn btn-ghost mb-4 hover:bg-base-300"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Retour à la liste
//             </button>
//             <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
//               {editingMateriel ? '✏️ Modifier le matériel' : '➕ Nouveau matériel'}
//             </h1>
//             <p className="text-base-content opacity-60 mt-1">
//               {editingMateriel 
//                 ? `Modification de "${editingMateriel.nom}"` 
//                 : 'Ajouter un nouveau matériel à l\'inventaire'
//               }
//             </p>
//           </div>

//           {/* Formulaire intégré directement */}
//           <div className="bg-base-200 rounded-lg shadow-xl">
//             <MaterielForm
//               isOpen={true}
//               onClose={handleCloseForm}
//               onSubmit={handleSubmit}
//               materiel={editingMateriel}
//               fournisseurs={fournisseurs}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Sinon, afficher la liste normale des matériels
//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Modal de confirmation de suppression */}
//       {showDeleteConfirm && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg">Confirmation de suppression</h3>
//             <p className="py-4">
//               {deleteMultiple 
//                 ? `Êtes-vous sûr de vouloir supprimer ${selectedMateriels.length} matériel(s) ? Cette action est irréversible.`
//                 : 'Êtes-vous sûr de vouloir supprimer ce matériel ? Cette action est irréversible.'
//               }
//             </p>
//             <div className="modal-action">
//               <button 
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setMaterielToDelete(null);
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
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button className="btn btn-ghost btn-sm" onClick={fetchMateriels}>
//             Réessayer
//           </button>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
//             <Server className="h-8 w-8 text-primary" />
//             Gestion des Matériels
//           </h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray(filteredMateriels).length} matériel(s) trouvé(s)
//             {selectedMateriels.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedMateriels.length} sélectionné(s))
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
//             Nouveau matériel
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques - 8 CARTES POUR TOUS LES ÉTATS */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
//         {/* Stat 1 - Total matériels */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Server className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total matériels</p>
//           </div>
//         </div>

//         {/* Stat 2 - Fonctionnels */}
//         <div className="card bg-success/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <CheckCircle className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-3xl font-bold text-success mb-1">{statistiques.fonctionnel}</h3>
//             <p className="text-sm opacity-60">Fonctionnels</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.fonctionnel / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 3 - En panne */}
//         <div className="card bg-error/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <AlertTriangle className="h-8 w-8 text-error" />
//             </div>
//             <h3 className="text-3xl font-bold text-error mb-1">{statistiques.enPanne}</h3>
//             <p className="text-sm opacity-60">En panne</p>
//             <p className="text-xs mt-1">
//               {statistiques.tauxPanne}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 4 - Réparés */}
//         <div className="card bg-warning/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Wrench className="h-8 w-8 text-warning" />
//             </div>
//             <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.repare}</h3>
//             <p className="text-sm opacity-60">Réparés</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.repare / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 5 - En maintenance */}
//         <div className="card bg-info/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Wrench className="h-8 w-8 text-info" />
//             </div>
//             <h3 className="text-3xl font-bold text-info mb-1">{statistiques.enMaintenance || 0}</h3>
//             <p className="text-sm opacity-60">En maintenance</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.enMaintenance / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 6 - En amélioration */}
//         <div className="card bg-primary/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Zap className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.enAmelioration || 0}</h3>
//             <p className="text-sm opacity-60">En amélioration</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.enAmelioration / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 7 - Obsolètes */}
//         <div className="card bg-neutral/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Package className="h-8 w-8 text-neutral" />
//             </div>
//             <h3 className="text-3xl font-bold text-neutral mb-1">{statistiques.obsolete}</h3>
//             <p className="text-sm opacity-60">Obsolètes</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.obsolete / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 8 - Hors service */}
//         <div className="card bg-error/20 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <X className="h-8 w-8 text-error" />
//             </div>
//             <h3 className="text-3xl font-bold text-error mb-1">{statistiques.horsService || 0}</h3>
//             <p className="text-sm opacity-60">Hors service</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.horsService / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Section Correspondance avec réparations */}
//       <div className="mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4">
//             <h3 className="font-bold text-base-content mb-3">⚙️ Synchronisation avec les réparations</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Réparation terminée</span>
//                   <span className="badge badge-success badge-sm">✅</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>Fonctionnel</strong></div>
//               </div>
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-warning">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Corrective en cours</span>
//                   <span className="badge badge-warning badge-sm">🔧</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>En panne</strong></div>
//               </div>
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-info">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Préventive en cours</span>
//                   <span className="badge badge-info badge-sm">🛠️</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>En maintenance</strong></div>
//               </div>
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-primary">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Améliorative en cours</span>
//                   <span className="badge badge-primary badge-sm">⚡</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>En amélioration</strong></div>
//               </div>
//             </div>
//             <div className="text-xs opacity-60 mt-3">
//               ⚡ Ces mises à jour sont automatiques après chaque réparation. L'état du matériel est synchronisé en temps réel.
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section Métriques secondaires */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
//         {/* Âge moyen */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4">
//             <div className="flex items-center gap-3">
//               <Clock className="h-10 w-10 text-warning" />
//               <div>
//                 <h3 className="text-2xl font-bold text-warning">{statistiques.ageMoyen}</h3>
//                 <p className="text-sm opacity-60">Âge moyen (jours)</p>
//                 <p className="text-xs mt-1">
//                   {statistiques.ageMoyen < 365 
//                     ? `Jeune parc (${Math.floor(statistiques.ageMoyen / 30)} mois)` 
//                     : `Ancien parc (${Math.floor(statistiques.ageMoyen / 365)} ans)`
//                   }
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Taux d'attribution */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4">
//             <div className="flex items-center gap-3">
//               <User className="h-10 w-10 text-primary" />
//               <div>
//                 <h3 className="text-2xl font-bold text-primary">
//                   {statistiques.total > 0 
//                     ? `${Math.round((statistiques.attribue / statistiques.total) * 100)}%`
//                     : '0%'
//                   }
//                 </h3>
//                 <p className="text-sm opacity-60">Taux d'attribution</p>
//                 <p className="text-xs mt-1">
//                   {statistiques.attribue} attribués / {statistiques.nonAttribue} non attribués
//                 </p>
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
//                   placeholder="Nom, référence, utilisateur, service..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 État</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterEtat}
//                 onChange={(e) => setFilterEtat(e.target.value)}
//               >
//                 <option value="">Tous les états</option>
//                 <option value="fonctionnel">Fonctionnel</option>
//                 <option value="en_panne">En panne</option>
//                 <option value="repare">Réparé</option>
//                 <option value="obsolete">Obsolète</option>
//                 <option value="en_maintenance">En maintenance</option>
//                 <option value="en_amelioration">En amélioration</option>
//                 <option value="en_reparation">En réparation</option>
//                 <option value="hors_service">Hors service</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📁 Service</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 onChange={(e) => {
//                   if (e.target.value) {
//                     setSearchTerm(e.target.value);
//                   }
//                 }}
//               >
//                 <option value="">Tous les services</option>
//                 {Object.entries(statistiques.parService).map(([service, count]) => (
//                   <option key={service} value={service}>
//                     {service} ({count})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🏢 Fournisseur</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 onChange={(e) => {
//                   if (e.target.value) {
//                     setSearchTerm(e.target.value);
//                   }
//                 }}
//               >
//                 <option value="">Tous les fournisseurs</option>
//                 {Object.entries(statistiques.parFournisseur).map(([fournisseur, count]) => (
//                   <option key={fournisseur} value={fournisseur}>
//                     {fournisseur} ({count})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex justify-between items-center mt-4">
//             <div className="flex gap-2">
//               {selectedMateriels.length > 0 && (
//                 <>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-outline btn-sm"
//                     title="Modifier la sélection"
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Modifier ({selectedMateriels.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-error btn-sm"
//                     title="Supprimer la sélection"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Supprimer ({selectedMateriels.length})
//                   </button>
//                 </>
//               )}
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={resetFilters}
//                 className="btn btn-ghost btn-sm"
//                 title="Réinitialiser les filtres"
//               >
//                 <X className="h-4 w-4 mr-2" />
//                 Réinitialiser
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tableau des matériels */}
//       <div className="card bg-base-200 shadow-xl">
//         <div className="card-body p-0">
//           <div className="overflow-x-auto">
//             <table className="table table-zebra">
//               <thead>
//                 <tr className="bg-base-300">
//                   <th>
//                     <div className="flex items-center">
//                       <button 
//                         onClick={toggleSelectAll}
//                         className="btn btn-ghost btn-xs p-1 mr-2"
//                         title={isSelectAll ? "Désélectionner tout" : "Sélectionner tout"}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-4 w-4 text-primary" />
//                         ) : (
//                           <Square className="h-4 w-4" />
//                         )}
//                       </button>
//                       ID
//                     </div>
//                   </th>
//                   <th>Nom</th>
//                   <th>Référence</th>
//                   <th>État</th>
//                   <th>Service</th>
//                   <th>Utilisateur</th>
//                   <th>Date d'achat</th>
//                   <th>Fournisseur</th>
//                   <th className="text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredMateriels).length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-8">
//                       <div className="flex flex-col items-center gap-2">
//                         <Package className="h-12 w-12 text-base-content opacity-30" />
//                         <p className="text-base-content opacity-50">
//                           {searchTerm || filterEtat ? 'Aucun matériel correspondant aux filtres' : 'Aucun matériel trouvé'}
//                         </p>
//                         {searchTerm || filterEtat ? (
//                           <button 
//                             onClick={resetFilters}
//                             className="btn btn-sm btn-ghost mt-2"
//                           >
//                             Réinitialiser les filtres
//                           </button>
//                         ) : (
//                           <button 
//                             onClick={handleAddNew}
//                             className="btn btn-sm btn-primary mt-2"
//                           >
//                             <Plus className="h-4 w-4 mr-2" />
//                             Ajouter un premier matériel
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   safeArray(filteredMateriels).map(materiel => (
//                     <tr key={materiel.id} className="hover:bg-base-100/50">
//                       <td>
//                         <div className="flex items-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-xs mr-3"
//                             checked={selectedMateriels.includes(materiel.id)}
//                             onChange={() => toggleSelectMateriel(materiel.id)}
//                           />
//                           <span className="font-mono text-xs opacity-70">#{materiel.id}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">{materiel.nom}</div>
//                       </td>
//                       <td>
//                         <div className="font-mono text-sm">{materiel.reference}</div>
//                       </td>
//                       <td>
//                         <div className={`badge gap-2 ${getEtatBadge(materiel.etat)}`}>
//                           {getEtatIcon(materiel.etat)}
//                           {getEtatText(materiel.etat)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex items-center gap-2">
//                           <Database className="h-4 w-4 opacity-50" />
//                           <span>{materiel.service_attribue || 'Non attribué'}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex items-center gap-2">
//                           <User className="h-4 w-4 opacity-50" />
//                           <span>{materiel.utilisateur_attribue || 'Non attribué'}</span>
//                         </div>
//                       </td>
//                       <td>
//                         {materiel.date_achat ? (
//                           <div className="flex items-center gap-2">
//                             <Clock className="h-4 w-4 opacity-50" />
//                             <span>{new Date(materiel.date_achat).toLocaleDateString('fr-FR')}</span>
//                           </div>
//                         ) : (
//                           <span className="opacity-50">Non spécifiée</span>
//                         )}
//                       </td>
//                       <td>
//                         {materiel.fournisseur && typeof materiel.fournisseur === 'object' && 'nom' in materiel.fournisseur ? (
//                           <div className="flex items-center gap-2">
//                             <Shield className="h-4 w-4 opacity-50" />
//                             <span>{(materiel.fournisseur as any).nom}</span>
//                           </div>
//                         ) : (
//                           <span className="opacity-50">Non spécifié</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className="flex justify-end gap-2">
//                           <button
//                             onClick={() => handleEdit(materiel)}
//                             className="btn btn-ghost btn-sm"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(materiel.id)}
//                             className="btn btn-ghost btn-sm text-error hover:bg-error/20"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Footer avec statistiques */}
//       <div className="mt-6 text-center text-sm text-base-content opacity-50">
//         <p>
//           Dernière mise à jour : {new Date().toLocaleString('fr-FR')} | 
//           Matériels chargés : {safeArray(materiels).length} | 
//           Filtre actif : {searchTerm ? `"${searchTerm}"` : 'Aucun'} {filterEtat && `| État: ${filterEtat}`}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Materiels;




// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Eye, Filter, Download, Edit, Trash2, 
//   CheckSquare, Square, X, BarChart3, Cpu, HardDrive, 
//   Clock, User, CheckCircle, AlertTriangle, RefreshCw,
//   TrendingUp, Battery, BatteryFull, BatteryLow, BatteryMedium,
//   Server, Wrench, Zap, Shield, Package, Database, ArrowLeft,
//   Calendar, History, RotateCcw, CalendarDays
// } from 'lucide-react';
// import { Materiel, Fournisseur, Reparation } from '../types';
// import MaterielForm from '../components/MaterielForm';
// import { materielsAPI, fournisseursAPI, reparationsAPI } from '../services/api';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Materiel[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Materiel[] => {
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

// // Fonction pour calculer les jours depuis la dernière réparation
// const getJoursDepuisReparation = (materiel: Materiel, reparations: Reparation[]): number | null => {
//   if (!materiel.id || !reparations || reparations.length === 0) {
//     return null;
//   }
  
//   // Filtrer les réparations pour ce matériel qui ont une date_fin
//   const reparationsMateriel = reparations.filter(rep => 
//     rep.materiel?.toString() === materiel.id.toString() && 
//     rep.date_fin
//   );
  
//   if (reparationsMateriel.length === 0) {
//     return null;
//   }
  
//   // Trier par date_fin décroissante pour avoir la plus récente
//   const reparationsTriees = reparationsMateriel.sort((a, b) => {
//     const dateA = new Date(a.date_fin!).getTime();
//     const dateB = new Date(b.date_fin!).getTime();
//     return dateB - dateA;
//   });
  
//   const derniereReparation = reparationsTriees[0];
  
//   if (!derniereReparation.date_fin) {
//     return null;
//   }
  
//   // Calculer la différence en jours
//   const dateFin = new Date(derniereReparation.date_fin);
//   const aujourdhui = new Date();
//   const differenceMs = aujourdhui.getTime() - dateFin.getTime();
//   const differenceJours = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  
//   return differenceJours;
// };

// // Fonction pour obtenir le texte des jours
// const getJoursTexte = (jours: number | null): string => {
//   if (jours === null) {
//     return 'Jamais réparé';
//   }
  
//   if (jours === 0) {
//     return 'Aujourd\'hui';
//   }
  
//   if (jours === 1) {
//     return 'Hier';
//   }
  
//   return `Il y a ${jours} jours`;
// };

// // Fonction pour obtenir la couleur des jours
// const getJoursCouleur = (jours: number | null): string => {
//   if (jours === null) {
//     return 'text-gray-500';
//   }
  
//   if (jours < 7) {
//     return 'text-green-500';
//   }
  
//   if (jours < 30) {
//     return 'text-yellow-500';
//   }
  
//   if (jours < 90) {
//     return 'text-orange-500';
//   }
  
//   return 'text-red-500';
// };

// // Fonction pour obtenir la badge des jours
// const getJoursBadge = (jours: number | null): string => {
//   if (jours === null) {
//     return 'badge-neutral';
//   }
  
//   if (jours < 7) {
//     return 'badge-success';
//   }
  
//   if (jours < 30) {
//     return 'badge-warning';
//   }
  
//   if (jours < 90) {
//     return 'badge-warning';
//   }
  
//   return 'badge-error';
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

// const Materiels: React.FC = () => {
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredMateriels, setFilteredMateriels] = useState<Materiel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterEtat, setFilterEtat] = useState<string>('');
//   const [filterJours, setFilterJours] = useState<string>('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingMateriel, setEditingMateriel] = useState<Materiel | undefined>();
//   const [selectedMateriels, setSelectedMateriels] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
  
//   // États pour la confirmation de suppression
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [materielToDelete, setMaterielToDelete] = useState<number | null>(null);
//   const [deleteMultiple, setDeleteMultiple] = useState(false);

//   // Statistiques avec tous les états
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     fonctionnel: 0,
//     enPanne: 0,
//     repare: 0,
//     obsolete: 0,
//     enMaintenance: 0,
//     enAmelioration: 0,
//     enReparation: 0,
//     horsService: 0,
//     nonAttribue: 0,
//     attribue: 0,
//     parService: {} as Record<string, number>,
//     ageMoyen: 0, // en jours
//     tauxPanne: 0, // pourcentage
//     evolution30j: 12, // valeur simulée
//     parFournisseur: {} as Record<string, number>,
//     joursDepuisDerniereReparation: 0, // jours moyens depuis dernière réparation
//     materielsSansReparation: 0, // nombre de matériels jamais réparés
//     materielsReparesRecemment: 0, // nombre de matériels réparés il y a moins de 7 jours
//   });

//   useEffect(() => {
//     fetchMateriels();
//     fetchFournisseurs();
//     fetchReparations();
//   }, []);

//   useEffect(() => {
//     filterMateriels();
//     if (materiels.length > 0) {
//       calculerStatistiques(materiels);
//     }
//   }, [materiels, searchTerm, filterEtat, filterJours, reparations]);

//   useEffect(() => {
//     if (filteredMateriels.length > 0 && selectedMateriels.length === filteredMateriels.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedMateriels, filteredMateriels]);

//   const fetchMateriels = async () => {
//     try {
//       setLoading(true);
//       const response = await materielsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       console.log('📦 Matériels chargés:', extractedData);
//       setMateriels(extractedData);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement matériels:', err);
//       setError('Erreur lors du chargement des matériels');
//       showNotification('error', '❌ Erreur lors du chargement des matériels');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchFournisseurs = async () => {
//     try {
//       const response = await fournisseursAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       console.log('🏢 Fournisseurs chargés:', extractedData);
//       setFournisseurs(extractedData);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement fournisseurs:', err);
//     }
//   };

//   const fetchReparations = async () => {
//     try {
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       console.log('🔧 Réparations chargées:', extractedData.length);
//       setReparations(extractedData);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//     }
//   };

//   // Fonction pour compter tous les états possibles
//   const calculerStatistiques = (data: Materiel[]) => {
//     const now = new Date();
//     let totalAge = 0;
//     let countWithDate = 0;
//     const services: Record<string, number> = {};
//     const fournisseurs: Record<string, number> = {};

//     // Pour les statistiques de réparation
//     let totalJoursDepuisReparation = 0;
//     let countAvecReparation = 0;
//     let materielsSansReparation = 0;
//     let materielsReparesRecemment = 0;

//     // Initialiser les compteurs pour tous les états
//     const etats: Record<string, number> = {
//       fonctionnel: 0,
//       en_panne: 0,
//       repare: 0,
//       obsolete: 0,
//       en_maintenance: 0,
//       en_amelioration: 0,
//       en_reparation: 0,
//       hors_service: 0
//     };

//     data.forEach(materiel => {
//       // Calcul de l'âge
//       if (materiel.date_achat) {
//         const dateAchat = new Date(materiel.date_achat);
//         const age = Math.floor((now.getTime() - dateAchat.getTime()) / (1000 * 60 * 60 * 24));
//         totalAge += age;
//         countWithDate++;
//       }

//       // Compter par service
//       if (materiel.service_attribue) {
//         services[materiel.service_attribue] = (services[materiel.service_attribue] || 0) + 1;
//       }

//       // Compter par fournisseur
//       if (materiel.fournisseur && typeof materiel.fournisseur === 'object' && 'nom' in materiel.fournisseur) {
//         const nomFournisseur = (materiel.fournisseur as any).nom;
//         fournisseurs[nomFournisseur] = (fournisseurs[nomFournisseur] || 0) + 1;
//       }

//       // Compter par état
//       const etat = materiel.etat || 'inconnu';
//       if (etats.hasOwnProperty(etat)) {
//         etats[etat]++;
//       } else {
//         etats[etat] = 1;
//       }

//       // Calculer les jours depuis la dernière réparation
//       const joursDepuisRep = getJoursDepuisReparation(materiel, reparations);
//       if (joursDepuisRep !== null) {
//         totalJoursDepuisReparation += joursDepuisRep;
//         countAvecReparation++;
        
//         // Compter les réparations récentes
//         if (joursDepuisRep < 7) {
//           materielsReparesRecemment++;
//         }
//       } else {
//         materielsSansReparation++;
//       }
//     });

//     const stats = {
//       total: data.length,
//       fonctionnel: etats.fonctionnel,
//       enPanne: etats.en_panne,
//       repare: etats.repare,
//       obsolete: etats.obsolete,
//       enMaintenance: etats.en_maintenance,
//       enAmelioration: etats.en_amelioration,
//       enReparation: etats.en_reparation,
//       horsService: etats.hors_service,
//       nonAttribue: data.filter(m => !m.utilisateur_attribue || m.utilisateur_attribue.trim() === '').length,
//       attribue: data.filter(m => m.utilisateur_attribue && m.utilisateur_attribue.trim() !== '').length,
//       parService: services,
//       parFournisseur: fournisseurs,
//       ageMoyen: countWithDate > 0 ? Math.round(totalAge / countWithDate) : 0,
//       tauxPanne: data.length > 0 ? Math.round((etats.en_panne / data.length) * 100) : 0,
//       evolution30j: 12, // Valeur simulée
//       joursDepuisDerniereReparation: countAvecReparation > 0 ? Math.round(totalJoursDepuisReparation / countAvecReparation) : 0,
//       materielsSansReparation: materielsSansReparation,
//       materielsReparesRecemment: materielsReparesRecemment
//     };
    
//     setStatistiques(stats);
//   };

//   const filterMateriels = () => {
//     let filtered = safeArray(materiels);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, m => 
//         m.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         m.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (m.utilisateur_attribue && m.utilisateur_attribue.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (m.service_attribue && m.service_attribue.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     if (filterEtat) {
//       filtered = safeFilter(filtered, m => m.etat === filterEtat);
//     }

//     // Filtre par jours depuis dernière réparation
//     if (filterJours) {
//       filtered = safeFilter(filtered, m => {
//         const jours = getJoursDepuisReparation(m, reparations);
        
//         switch(filterJours) {
//           case 'jamais':
//             return jours === null;
//           case 'moins7':
//             return jours !== null && jours < 7;
//           case '7a30':
//             return jours !== null && jours >= 7 && jours < 30;
//           case '30a90':
//             return jours !== null && jours >= 30 && jours < 90;
//           case 'plus90':
//             return jours !== null && jours >= 90;
//           case 'avec':
//             return jours !== null;
//           default:
//             return true;
//         }
//       });
//     }

//     setFilteredMateriels(filtered);
//     setSelectedMateriels([]);
//   };

//   const handleSubmit = async (materielData: Omit<Materiel, 'id'>) => {
//     try {
//       console.group('🔧 DEBUG Materiel Submission');
//       console.log('Données du formulaire:', materielData);
      
//       const apiData: any = {
//         nom: materielData.nom?.trim() || '',
//         reference: materielData.reference?.trim() || '',
//         date_achat: materielData.date_achat,
//         etat: materielData.etat || 'fonctionnel',
//         service_attribue: materielData.service_attribue || '',
//         utilisateur_attribue: materielData.utilisateur_attribue?.trim() || ''
//       };

//       if (materielData.fournisseur) {
//         apiData.fournisseur = materielData.fournisseur;
//       }
      
//       console.log('📤 Données API formatées:', apiData);
//       console.groupEnd();

//       if (editingMateriel) {
//         const response = await materielsAPI.update(editingMateriel.id, apiData);
//         console.log('✅ Réponse update:', response.data);
//         showNotification('success', '✅ Matériel modifié avec succès');
//       } else {
//         const response = await materielsAPI.create(apiData);
//         console.log('✅ Réponse create:', response.data);
//         showNotification('success', '✅ Matériel créé avec succès');
//       }
      
//       fetchMateriels();
//       setIsFormOpen(false);
//       setEditingMateriel(undefined);
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

//   const toggleSelectMateriel = (id: number) => {
//     setSelectedMateriels(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedMateriels([]);
//       showNotification('info', '✅ Sélection annulée');
//     } else {
//       const allIds = filteredMateriels.map(m => m.id);
//       setSelectedMateriels(allIds);
//       showNotification('success', `✅ ${allIds.length} matériels sélectionnés`);
//     }
//   };

//   // Rafraîchir les données
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchMateriels();
//     await fetchReparations();
//     showNotification('success', '🔄 Données rafraîchies avec succès');
//   };

//   // Confirmation de suppression
//   const confirmDelete = async () => {
//     try {
//       if (deleteMultiple) {
//         // Suppression multiple
//         for (const id of selectedMateriels) {
//           await materielsAPI.delete(id);
//         }
        
//         showNotification('success', `✅ ${selectedMateriels.length} matériel(s) supprimé(s) avec succès`);
//         setSelectedMateriels([]);
//       } else if (materielToDelete) {
//         // Suppression simple
//         await materielsAPI.delete(materielToDelete);
//         showNotification('success', '✅ Matériel supprimé avec succès');
//       }
      
//       await fetchMateriels();
//     } catch (error) {
//       showNotification('error', '❌ Erreur lors de la suppression');
//     } finally {
//       setShowDeleteConfirm(false);
//       setMaterielToDelete(null);
//       setDeleteMultiple(false);
//     }
//   };

//   const handleDeleteSelected = () => {
//     if (selectedMateriels.length === 0) {
//       showNotification('error', '❌ Aucun matériel sélectionné');
//       return;
//     }

//     setDeleteMultiple(true);
//     setShowDeleteConfirm(true);
//   };

//   const handleDelete = (id: number) => {
//     setMaterielToDelete(id);
//     setDeleteMultiple(false);
//     setShowDeleteConfirm(true);
//   };

//   const handleEditSelected = () => {
//     if (selectedMateriels.length === 0) {
//       showNotification('error', '❌ Aucun matériel sélectionné');
//       return;
//     }

//     if (selectedMateriels.length === 1) {
//       const materiel = materiels.find(m => m.id === selectedMateriels[0]);
//       if (materiel) {
//         handleEdit(materiel);
//       }
//     } else {
//       showNotification('info', `📝 Édition multiple de ${selectedMateriels.length} matériels`);
//     }
//   };

//   const handleEdit = (materiel: Materiel) => {
//     setEditingMateriel(materiel);
//     setIsFormOpen(true);
//     showNotification('info', `✏️ Modification du matériel "${materiel.nom}"`);
//   };

//   const handleAddNew = () => {
//     setEditingMateriel(undefined);
//     setIsFormOpen(true);
//     showNotification('info', '📝 Ouverture du formulaire de création de matériel');
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredMateriels.map(m => ({
//         Nom: m.nom,
//         Référence: m.reference,
//         État: getEtatText(m.etat),
//         'Jours dernière réparation': getJoursTexte(getJoursDepuisReparation(m, reparations)),
//         Service: m.service_attribue,
//         Utilisateur: m.utilisateur_attribue || 'Non attribué',
//         'Date d\'achat': m.date_achat ? new Date(m.date_achat).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         Fournisseur: m.fournisseur && typeof m.fournisseur === 'object' && 'nom' in m.fournisseur 
//           ? (m.fournisseur as any).nom 
//           : 'Non spécifié'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `materiels_${new Date().toISOString().split('T')[0]}.csv`);
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
//     setFilterEtat('');
//     setFilterJours('');
//     setSelectedMateriels([]);
//     showNotification('info', '🔄 Filtres réinitialisés');
//   };

//   // Fonction pour obtenir le badge d'état
//   const getEtatBadge = (etat: string) => {
//     const badges = {
//       fonctionnel: 'badge-success',
//       en_panne: 'badge-error',
//       repare: 'badge-warning',
//       obsolete: 'badge-neutral',
//       en_maintenance: 'badge-info',
//       en_amelioration: 'badge-primary',
//       en_reparation: 'badge-warning',
//       hors_service: 'badge-error'
//     };
//     return badges[etat as keyof typeof badges] || 'badge-neutral';
//   };

//   // Fonction pour obtenir le texte d'état
//   const getEtatText = (etat: string) => {
//     const texts = {
//       fonctionnel: 'Fonctionnel',
//       en_panne: 'En panne',
//       repare: 'Réparé',
//       obsolete: 'Obsolète',
//       en_maintenance: 'En maintenance',
//       en_amelioration: 'En amélioration',
//       en_reparation: 'En réparation',
//       hors_service: 'Hors service'
//     };
//     return texts[etat as keyof typeof texts] || etat;
//   };

//   // Fonction pour obtenir l'icône d'état
//   const getEtatIcon = (etat: string) => {
//     switch (etat) {
//       case 'fonctionnel': return <CheckCircle className="h-4 w-4" />;
//       case 'en_panne': return <AlertTriangle className="h-4 w-4" />;
//       case 'repare': return <Wrench className="h-4 w-4" />;
//       case 'obsolete': return <Package className="h-4 w-4" />;
//       case 'en_maintenance': return <Wrench className="h-4 w-4" />;
//       case 'en_amelioration': return <Zap className="h-4 w-4" />;
//       case 'en_reparation': return <Wrench className="h-4 w-4" />;
//       case 'hors_service': return <X className="h-4 w-4" />;
//       default: return <HardDrive className="h-4 w-4" />;
//     }
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setEditingMateriel(undefined);
//     showNotification('info', '❌ Formulaire fermé');
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des matériels...</p>
//         </div>
//       </div>
//     );
//   }

//   // Si le formulaire est ouvert, afficher seulement le formulaire
//   if (isFormOpen) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen">
//         <div className="max-w-7xl mx-auto">
//           {/* En-tête du formulaire */}
//           <div className="mb-6">
//             <button
//               onClick={handleCloseForm}
//               className="btn btn-ghost mb-4 hover:bg-base-300"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Retour à la liste
//             </button>
//             <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
//               {editingMateriel ? '✏️ Modifier le matériel' : '➕ Nouveau matériel'}
//             </h1>
//             <p className="text-base-content opacity-60 mt-1">
//               {editingMateriel 
//                 ? `Modification de "${editingMateriel.nom}"` 
//                 : 'Ajouter un nouveau matériel à l\'inventaire'
//               }
//             </p>
//           </div>

//           {/* Formulaire intégré directement */}
//           <div className="bg-base-200 rounded-lg shadow-xl">
//             <MaterielForm
//               isOpen={true}
//               onClose={handleCloseForm}
//               onSubmit={handleSubmit}
//               materiel={editingMateriel}
//               fournisseurs={fournisseurs}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Sinon, afficher la liste normale des matériels
//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Modal de confirmation de suppression */}
//       {showDeleteConfirm && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg">Confirmation de suppression</h3>
//             <p className="py-4">
//               {deleteMultiple 
//                 ? `Êtes-vous sûr de vouloir supprimer ${selectedMateriels.length} matériel(s) ? Cette action est irréversible.`
//                 : 'Êtes-vous sûr de vouloir supprimer ce matériel ? Cette action est irréversible.'
//               }
//             </p>
//             <div className="modal-action">
//               <button 
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setMaterielToDelete(null);
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
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button className="btn btn-ghost btn-sm" onClick={fetchMateriels}>
//             Réessayer
//           </button>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
//             <Server className="h-8 w-8 text-primary" />
//             Gestion des Matériels
//           </h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray(filteredMateriels).length} matériel(s) trouvé(s)
//             {selectedMateriels.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedMateriels.length} sélectionné(s))
//               </span>
//             )}
//           </p>
//           <p className="text-xs opacity-50 mt-1">
//             <History className="h-3 w-3 inline mr-1" />
//             Mise à jour des réparations: {reparations.length} réparations chargées
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
//             Nouveau matériel
//           </button>
//         </div>
//       </div>

//       {/* NOUVELLE SECTION : Statistiques des réparations */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        
//         {/* Stat 9 - Jours moyens depuis dernière réparation */}
//         <div className="card bg-info/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <CalendarDays className="h-8 w-8 text-info" />
//             </div>
//             <h3 className="text-2xl font-bold text-info mb-1">
//               {statistiques.joursDepuisDerniereReparation}
//             </h3>
//             <p className="text-sm opacity-60">Jours depuis dernière réparation</p>
//             <p className="text-xs mt-1">
//               Moyenne sur {statistiques.total - statistiques.materielsSansReparation} matériels réparés
//             </p>
//           </div>
//         </div>

//         {/* Stat 10 - Réparés récemment */}
//         <div className="card bg-success/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <RotateCcw className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-2xl font-bold text-success mb-1">
//               {statistiques.materielsReparesRecemment}
//             </h3>
//             <p className="text-sm opacity-60">Réparés récemment (&lt;7 jours)</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.materielsReparesRecemment / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 11 - Jamais réparés */}
//         <div className="card bg-warning/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <History className="h-8 w-8 text-warning" />
//             </div>
//             <h3 className="text-2xl font-bold text-warning mb-1">
//               {statistiques.materielsSansReparation}
//             </h3>
//             <p className="text-sm opacity-60">Jamais réparés</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.materielsSansReparation / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Section Statistiques - 8 CARTES POUR TOUS LES ÉTATS */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
//         {/* Stat 1 - Total matériels */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Server className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total matériels</p>
//           </div>
//         </div>

//         {/* Stat 2 - Fonctionnels */}
//         <div className="card bg-success/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <CheckCircle className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-3xl font-bold text-success mb-1">{statistiques.fonctionnel}</h3>
//             <p className="text-sm opacity-60">Fonctionnels</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.fonctionnel / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 3 - En panne */}
//         <div className="card bg-error/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <AlertTriangle className="h-8 w-8 text-error" />
//             </div>
//             <h3 className="text-3xl font-bold text-error mb-1">{statistiques.enPanne}</h3>
//             <p className="text-sm opacity-60">En panne</p>
//             <p className="text-xs mt-1">
//               {statistiques.tauxPanne}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 4 - Réparés */}
//         <div className="card bg-warning/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Wrench className="h-8 w-8 text-warning" />
//             </div>
//             <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.repare}</h3>
//             <p className="text-sm opacity-60">Réparés</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.repare / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 5 - En maintenance */}
//         <div className="card bg-info/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Wrench className="h-8 w-8 text-info" />
//             </div>
//             <h3 className="text-3xl font-bold text-info mb-1">{statistiques.enMaintenance || 0}</h3>
//             <p className="text-sm opacity-60">En maintenance</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.enMaintenance / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 6 - En amélioration */}
//         <div className="card bg-primary/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Zap className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.enAmelioration || 0}</h3>
//             <p className="text-sm opacity-60">En amélioration</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.enAmelioration / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 7 - Obsolètes */}
//         <div className="card bg-neutral/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Package className="h-8 w-8 text-neutral" />
//             </div>
//             <h3 className="text-3xl font-bold text-neutral mb-1">{statistiques.obsolete}</h3>
//             <p className="text-sm opacity-60">Obsolètes</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.obsolete / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>

//         {/* Stat 8 - Hors service */}
//         <div className="card bg-error/20 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <X className="h-8 w-8 text-error" />
//             </div>
//             <h3 className="text-3xl font-bold text-error mb-1">{statistiques.horsService || 0}</h3>
//             <p className="text-sm opacity-60">Hors service</p>
//             <p className="text-xs mt-1">
//               {statistiques.total > 0 ? Math.round((statistiques.horsService / statistiques.total) * 100) : 0}% du parc
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Section Correspondance avec réparations */}
//       <div className="mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4">
//             <h3 className="font-bold text-base-content mb-3">⚙️ Synchronisation avec les réparations</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Réparation terminée</span>
//                   <span className="badge badge-success badge-sm">✅</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>Fonctionnel</strong></div>
//               </div>
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-warning">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Corrective en cours</span>
//                   <span className="badge badge-warning badge-sm">🔧</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>En panne</strong></div>
//               </div>
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-info">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Préventive en cours</span>
//                   <span className="badge badge-info badge-sm">🛠️</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>En maintenance</strong></div>
//               </div>
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-primary">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Améliorative en cours</span>
//                   <span className="badge badge-primary badge-sm">⚡</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>En amélioration</strong></div>
//               </div>
//             </div>
//             <div className="text-xs opacity-60 mt-3">
//               ⚡ Ces mises à jour sont automatiques après chaque réparation. L'état du matériel est synchronisé en temps réel.
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section Métriques secondaires */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
//         {/* Âge moyen */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4">
//             <div className="flex items-center gap-3">
//               <Clock className="h-10 w-10 text-warning" />
//               <div>
//                 <h3 className="text-2xl font-bold text-warning">{statistiques.ageMoyen}</h3>
//                 <p className="text-sm opacity-60">Âge moyen (jours)</p>
//                 <p className="text-xs mt-1">
//                   {statistiques.ageMoyen < 365 
//                     ? `Jeune parc (${Math.floor(statistiques.ageMoyen / 30)} mois)` 
//                     : `Ancien parc (${Math.floor(statistiques.ageMoyen / 365)} ans)`
//                   }
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Taux d'attribution */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4">
//             <div className="flex items-center gap-3">
//               <User className="h-10 w-10 text-primary" />
//               <div>
//                 <h3 className="text-2xl font-bold text-primary">
//                   {statistiques.total > 0 
//                     ? `${Math.round((statistiques.attribue / statistiques.total) * 100)}%`
//                     : '0%'
//                   }
//                 </h3>
//                 <p className="text-sm opacity-60">Taux d'attribution</p>
//                 <p className="text-xs mt-1">
//                   {statistiques.attribue} attribués / {statistiques.nonAttribue} non attribués
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filtres et recherche - AJOUT DU FILTRE PAR JOURS */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Nom, référence, utilisateur, service..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 État</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterEtat}
//                 onChange={(e) => setFilterEtat(e.target.value)}
//               >
//                 <option value="">Tous les états</option>
//                 <option value="fonctionnel">Fonctionnel</option>
//                 <option value="en_panne">En panne</option>
//                 <option value="repare">Réparé</option>
//                 <option value="obsolete">Obsolète</option>
//                 <option value="en_maintenance">En maintenance</option>
//                 <option value="en_amelioration">En amélioration</option>
//                 <option value="en_reparation">En réparation</option>
//                 <option value="hors_service">Hors service</option>
//               </select>
//             </div>

//             {/* NOUVEAU FILTRE : Jours depuis dernière réparation */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-1">
//                   <Calendar className="h-4 w-4" />
//                   Dernière réparation
//                 </span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterJours}
//                 onChange={(e) => setFilterJours(e.target.value)}
//               >
//                 <option value="">Toutes périodes</option>
//                 <option value="jamais">Jamais réparé</option>
//                 <option value="moins7">&lt; 7 jours</option>
//                 <option value="7a30">7 à 30 jours</option>
//                 <option value="30a90">30 à 90 jours</option>
//                 <option value="plus90">&gt; 90 jours</option>
//                 <option value="avec">Avec réparation</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📁 Service</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 onChange={(e) => {
//                   if (e.target.value) {
//                     setSearchTerm(e.target.value);
//                   }
//                 }}
//               >
//                 <option value="">Tous les services</option>
//                 {Object.entries(statistiques.parService).map(([service, count]) => (
//                   <option key={service} value={service}>
//                     {service} ({count})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🏢 Fournisseur</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 onChange={(e) => {
//                   if (e.target.value) {
//                     setSearchTerm(e.target.value);
//                   }
//                 }}
//               >
//                 <option value="">Tous les fournisseurs</option>
//                 {Object.entries(statistiques.parFournisseur).map(([fournisseur, count]) => (
//                   <option key={fournisseur} value={fournisseur}>
//                     {fournisseur} ({count})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex justify-between items-center mt-4">
//             <div className="flex gap-2">
//               {selectedMateriels.length > 0 && (
//                 <>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-outline btn-sm"
//                     title="Modifier la sélection"
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Modifier ({selectedMateriels.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-error btn-sm"
//                     title="Supprimer la sélection"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Supprimer ({selectedMateriels.length})
//                   </button>
//                 </>
//               )}
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={resetFilters}
//                 className="btn btn-ghost btn-sm"
//                 title="Réinitialiser les filtres"
//               >
//                 <X className="h-4 w-4 mr-2" />
//                 Réinitialiser
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tableau des matériels - AJOUT DE LA COLONNE JOURS */}
//       <div className="card bg-base-200 shadow-xl">
//         <div className="card-body p-0">
//           <div className="overflow-x-auto">
//             <table className="table table-zebra">
//               <thead>
//                 <tr className="bg-base-300">
//                   <th>
//                     <div className="flex items-center">
//                       <button 
//                         onClick={toggleSelectAll}
//                         className="btn btn-ghost btn-xs p-1 mr-2"
//                         title={isSelectAll ? "Désélectionner tout" : "Sélectionner tout"}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-4 w-4 text-primary" />
//                         ) : (
//                           <Square className="h-4 w-4" />
//                         )}
//                       </button>
//                       ID
//                     </div>
//                   </th>
//                   <th>Nom</th>
//                   <th>Référence</th>
//                   <th>État</th>
//                   <th>Jours dernière réparation</th>
//                   <th>Service</th>
//                   <th>Utilisateur</th>
//                   <th>Date d'achat</th>
//                   <th>Fournisseur</th>
//                   <th className="text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredMateriels).length === 0 ? (
//                   <tr>
//                     <td colSpan={10} className="text-center py-8">
//                       <div className="flex flex-col items-center gap-2">
//                         <Package className="h-12 w-12 text-base-content opacity-30" />
//                         <p className="text-base-content opacity-50">
//                           {searchTerm || filterEtat || filterJours ? 'Aucun matériel correspondant aux filtres' : 'Aucun matériel trouvé'}
//                         </p>
//                         {searchTerm || filterEtat || filterJours ? (
//                           <button 
//                             onClick={resetFilters}
//                             className="btn btn-sm btn-ghost mt-2"
//                           >
//                             Réinitialiser les filtres
//                           </button>
//                         ) : (
//                           <button 
//                             onClick={handleAddNew}
//                             className="btn btn-sm btn-primary mt-2"
//                           >
//                             <Plus className="h-4 w-4 mr-2" />
//                             Ajouter un premier matériel
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   safeArray(filteredMateriels).map(materiel => {
//                     const joursDepuisRep = getJoursDepuisReparation(materiel, reparations);
                    
//                     return (
//                       <tr key={materiel.id} className="hover:bg-base-100/50">
//                         <td>
//                           <div className="flex items-center">
//                             <input
//                               type="checkbox"
//                               className="checkbox checkbox-xs mr-3"
//                               checked={selectedMateriels.includes(materiel.id)}
//                               onChange={() => toggleSelectMateriel(materiel.id)}
//                             />
//                             <span className="font-mono text-xs opacity-70">#{materiel.id}</span>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="font-medium">{materiel.nom}</div>
//                         </td>
//                         <td>
//                           <div className="font-mono text-sm">{materiel.reference}</div>
//                         </td>
//                         <td>
//                           <div className={`badge gap-2 ${getEtatBadge(materiel.etat)}`}>
//                             {getEtatIcon(materiel.etat)}
//                             {getEtatText(materiel.etat)}
//                           </div>
//                         </td>
//                         <td>
//                           <div className={`badge gap-1 ${getJoursBadge(joursDepuisRep)} ${getJoursCouleur(joursDepuisRep)}`}>
//                             <History className="h-3 w-3" />
//                             {getJoursTexte(joursDepuisRep)}
//                           </div>
//                           {joursDepuisRep !== null && (
//                             <div className="text-xs opacity-50 mt-1">
//                               {joursDepuisRep} jour{joursDepuisRep !== 1 ? 's' : ''}
//                             </div>
//                           )}
//                         </td>
//                         <td>
//                           <div className="flex items-center gap-2">
//                             <Database className="h-4 w-4 opacity-50" />
//                             <span>{materiel.service_attribue || 'Non attribué'}</span>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="flex items-center gap-2">
//                             <User className="h-4 w-4 opacity-50" />
//                             <span>{materiel.utilisateur_attribue || 'Non attribué'}</span>
//                           </div>
//                         </td>
//                         <td>
//                           {materiel.date_achat ? (
//                             <div className="flex items-center gap-2">
//                               <Clock className="h-4 w-4 opacity-50" />
//                               <span>{new Date(materiel.date_achat).toLocaleDateString('fr-FR')}</span>
//                             </div>
//                           ) : (
//                             <span className="opacity-50">Non spécifiée</span>
//                           )}
//                         </td>
//                         <td>
//                           {materiel.fournisseur && typeof materiel.fournisseur === 'object' && 'nom' in materiel.fournisseur ? (
//                             <div className="flex items-center gap-2">
//                               <Shield className="h-4 w-4 opacity-50" />
//                               <span>{(materiel.fournisseur as any).nom}</span>
//                             </div>
//                           ) : (
//                             <span className="opacity-50">Non spécifié</span>
//                           )}
//                         </td>
//                         <td>
//                           <div className="flex justify-end gap-2">
//                             <button
//                               onClick={() => handleEdit(materiel)}
//                               className="btn btn-ghost btn-sm"
//                               title="Modifier"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(materiel.id)}
//                               className="btn btn-ghost btn-sm text-error hover:bg-error/20"
//                               title="Supprimer"
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

//       {/* Footer avec statistiques */}
//       <div className="mt-6 text-center text-sm text-base-content opacity-50">
//         <p>
//           Dernière mise à jour : {new Date().toLocaleString('fr-FR')} | 
//           Matériels chargés : {safeArray(materiels).length} | 
//           Réparations chargées : {reparations.length} |
//           Filtre actif : {searchTerm ? `"${searchTerm}"` : 'Aucun'} 
//           {filterEtat && ` | État: ${filterEtat}`}
//           {filterJours && ` | Réparation: ${filterJours}`}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Materiels;





// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Eye, Filter, Download, Edit, Trash2, 
//   CheckSquare, Square, X, BarChart3, Cpu, HardDrive, 
//   Clock, User, CheckCircle, AlertTriangle, RefreshCw,
//   TrendingUp, Battery, BatteryFull, BatteryLow, BatteryMedium,
//   Server, Wrench, Zap, Shield, Package, Database, ArrowLeft,
//   Calendar, History, RotateCcw, CalendarDays, Bell, Info
// } from 'lucide-react';
// import { Materiel, Fournisseur, Reparation } from '../types';
// import MaterielForm from '../components/MaterielForm';
// import { materielsAPI, fournisseursAPI, reparationsAPI } from '../services/api';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Materiel[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Materiel[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): any[] => {
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

// // Système de notification simple
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

// // Fonction pour calculer les jours depuis la dernière réparation
// const getJoursDepuisReparation = (materiel: Materiel, reparations: Reparation[]): number | null => {
//   if (!materiel.id || !reparations || reparations.length === 0) {
//     return null;
//   }
  
//   const reparationsMateriel = reparations.filter(rep => 
//     rep.materiel?.toString() === materiel.id.toString() && 
//     rep.date_fin
//   );
  
//   if (reparationsMateriel.length === 0) {
//     return null;
//   }
  
//   const reparationsTriees = reparationsMateriel.sort((a, b) => {
//     const dateA = new Date(a.date_fin!).getTime();
//     const dateB = new Date(b.date_fin!).getTime();
//     return dateB - dateA;
//   });
  
//   const derniereReparation = reparationsTriees[0];
  
//   if (!derniereReparation.date_fin) {
//     return null;
//   }
  
//   const dateFin = new Date(derniereReparation.date_fin);
//   const aujourdhui = new Date();
//   const differenceMs = aujourdhui.getTime() - dateFin.getTime();
//   return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
// };

// const getJoursTexte = (jours: number | null): string => {
//   if (jours === null) return 'Jamais réparé';
//   if (jours === 0) return 'Aujourd\'hui';
//   if (jours === 1) return 'Hier';
//   return `Il y a ${jours} jours`;
// };

// const getJoursCouleur = (jours: number | null): string => {
//   if (jours === null) return 'text-gray-500';
//   if (jours < 7) return 'text-green-500';
//   if (jours < 30) return 'text-yellow-500';
//   if (jours < 90) return 'text-orange-500';
//   return 'text-red-500';
// };

// const getJoursBadge = (jours: number | null): string => {
//   if (jours === null) return 'badge-neutral';
//   if (jours < 7) return 'badge-success';
//   if (jours < 30) return 'badge-warning';
//   if (jours < 90) return 'badge-warning';
//   return 'badge-error';
// };

// const Materiels: React.FC = () => {
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredMateriels, setFilteredMateriels] = useState<Materiel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterEtat, setFilterEtat] = useState<string>('');
//   const [filterJours, setFilterJours] = useState<string>('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingMateriel, setEditingMateriel] = useState<Materiel | undefined>();
//   const [selectedMateriels, setSelectedMateriels] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
  
//   // États pour la confirmation de suppression
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [materielToDelete, setMaterielToDelete] = useState<number | null>(null);
//   const [deleteMultiple, setDeleteMultiple] = useState(false);
//   const [deleteMessage, setDeleteMessage] = useState('');

//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     fonctionnel: 0,
//     enPanne: 0,
//     repare: 0,
//     obsolete: 0,
//     enMaintenance: 0,
//     enAmelioration: 0,
//     enReparation: 0,
//     horsService: 0,
//     nonAttribue: 0,
//     attribue: 0,
//     parService: {} as Record<string, number>,
//     ageMoyen: 0,
//     tauxPanne: 0,
//     evolution30j: 12,
//     parFournisseur: {} as Record<string, number>,
//     joursDepuisDerniereReparation: 0,
//     materielsSansReparation: 0,
//     materielsReparesRecemment: 0,
//   });

//   useEffect(() => {
//     fetchMateriels();
//     fetchFournisseurs();
//     fetchReparations();
    
//     // Afficher une notification de bienvenue
//     setTimeout(() => {
//       showNotification('info', 'Chargement des matériels et réparations...', 'Bienvenue');
//     }, 500);
//   }, []);

//   useEffect(() => {
//     filterMateriels();
//     if (materiels.length > 0) {
//       calculerStatistiques(materiels);
//     }
//   }, [materiels, searchTerm, filterEtat, filterJours, reparations]);

//   useEffect(() => {
//     if (filteredMateriels.length > 0 && selectedMateriels.length === filteredMateriels.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedMateriels, filteredMateriels]);

//   const fetchMateriels = async () => {
//     try {
//       setLoading(true);
//       const response = await materielsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       // Vérifier les états venant des réparations
//       const updatedData = await verifierEtatsMateriels(extractedData);
      
//       setMateriels(updatedData);
//       // showNotification('success', `${updatedData.length} matériels chargés avec succès`, 'Chargement terminé');
//     } catch (err: any) {
//       showNotification('error', 'Erreur lors du chargement des matériels', 'Erreur');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchFournisseurs = async () => {
//     try {
//       const response = await fournisseursAPI.getAll();
//       setFournisseurs(extractDataFromResponse(response));
//     } catch (err: any) {
//       console.error('Erreur chargement fournisseurs:', err);
//     }
//   };

//   const fetchReparations = async () => {
//     try {
//       const response = await reparationsAPI.getAll();
//       setReparations(extractDataFromResponse(response));
//     } catch (err: any) {
//       console.error('Erreur chargement réparations:', err);
//     }
//   };

//   // Vérifier et mettre à jour les états des matériels selon les réparations
//   const verifierEtatsMateriels = async (materielsData: Materiel[]): Promise<Materiel[]> => {
//     try {
//       // Récupérer toutes les réparations en cours (sans date_fin)
//       const reparationsEnCours = reparations.filter(rep => !rep.date_fin);
      
//       return materielsData.map(materiel => {
//         // Chercher si ce matériel a une réparation en cours
//         const reparationEnCours = reparationsEnCours.find(rep => 
//           rep.materiel?.toString() === materiel.id.toString()
//         );
        
//         if (reparationEnCours) {
//           // Déterminer le nouvel état selon le type de réparation
//           let nouvelEtat = materiel.etat;
          
//           switch(reparationEnCours.type_reparation) {
//             case 'corrective':
//               nouvelEtat = 'en_reparation';
//               break;
//             case 'preventive':
//               nouvelEtat = 'en_maintenance';
//               break;
//             case 'ameliorative':
//               nouvelEtat = 'en_amelioration';
//               break;
//           }
          
//           // Si l'état a changé, afficher une notification
//           if (nouvelEtat !== materiel.etat) {
//             showNotification('info', 
//               `Matériel "${materiel.nom}" est maintenant ${getEtatText(nouvelEtat)}`, 
//               'État mis à jour'
//             );
//           }
          
//           return { ...materiel, etat: nouvelEtat };
//         }
        
//         return materiel;
//       });
//     } catch (error) {
//       console.error('Erreur vérification états:', error);
//       return materielsData;
//     }
//   };

//   const calculerStatistiques = (data: Materiel[]) => {
//     const now = new Date();
//     let totalAge = 0;
//     let countWithDate = 0;
//     const services: Record<string, number> = {};
//     const fournisseurs: Record<string, number> = {};

//     let totalJoursDepuisReparation = 0;
//     let countAvecReparation = 0;
//     let materielsSansReparation = 0;
//     let materielsReparesRecemment = 0;

//     const etats: Record<string, number> = {
//       fonctionnel: 0,
//       en_panne: 0,
//       repare: 0,
//       obsolete: 0,
//       en_maintenance: 0,
//       en_amelioration: 0,
//       en_reparation: 0,
//       hors_service: 0
//     };

//     data.forEach(materiel => {
//       if (materiel.date_achat) {
//         const dateAchat = new Date(materiel.date_achat);
//         const age = Math.floor((now.getTime() - dateAchat.getTime()) / (1000 * 60 * 60 * 24));
//         totalAge += age;
//         countWithDate++;
//       }

//       if (materiel.service_attribue) {
//         services[materiel.service_attribue] = (services[materiel.service_attribue] || 0) + 1;
//       }

//       if (materiel.fournisseur && typeof materiel.fournisseur === 'object' && 'nom' in materiel.fournisseur) {
//         const nomFournisseur = (materiel.fournisseur as any).nom;
//         fournisseurs[nomFournisseur] = (fournisseurs[nomFournisseur] || 0) + 1;
//       }

//       const etat = materiel.etat || 'inconnu';
//       if (etats.hasOwnProperty(etat)) {
//         etats[etat]++;
//       } else {
//         etats[etat] = 1;
//       }

//       const joursDepuisRep = getJoursDepuisReparation(materiel, reparations);
//       if (joursDepuisRep !== null) {
//         totalJoursDepuisReparation += joursDepuisRep;
//         countAvecReparation++;
        
//         if (joursDepuisRep < 7) {
//           materielsReparesRecemment++;
//         }
//       } else {
//         materielsSansReparation++;
//       }
//     });

//     setStatistiques({
//       total: data.length,
//       fonctionnel: etats.fonctionnel,
//       enPanne: etats.en_panne,
//       repare: etats.repare,
//       obsolete: etats.obsolete,
//       enMaintenance: etats.en_maintenance,
//       enAmelioration: etats.en_amelioration,
//       enReparation: etats.en_reparation,
//       horsService: etats.hors_service,
//       nonAttribue: data.filter(m => !m.utilisateur_attribue || m.utilisateur_attribue.trim() === '').length,
//       attribue: data.filter(m => m.utilisateur_attribue && m.utilisateur_attribue.trim() !== '').length,
//       parService: services,
//       parFournisseur: fournisseurs,
//       ageMoyen: countWithDate > 0 ? Math.round(totalAge / countWithDate) : 0,
//       tauxPanne: data.length > 0 ? Math.round((etats.en_panne / data.length) * 100) : 0,
//       evolution30j: 12,
//       joursDepuisDerniereReparation: countAvecReparation > 0 ? Math.round(totalJoursDepuisReparation / countAvecReparation) : 0,
//       materielsSansReparation: materielsSansReparation,
//       materielsReparesRecemment: materielsReparesRecemment
//     });
//   };

//   const filterMateriels = () => {
//     let filtered = safeArray(materiels);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, m => 
//         m.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         m.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (m.utilisateur_attribue && m.utilisateur_attribue.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (m.service_attribue && m.service_attribue.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     if (filterEtat) {
//       filtered = safeFilter(filtered, m => m.etat === filterEtat);
//     }

//     if (filterJours) {
//       filtered = safeFilter(filtered, m => {
//         const jours = getJoursDepuisReparation(m, reparations);
        
//         switch(filterJours) {
//           case 'jamais':
//             return jours === null;
//           case 'moins7':
//             return jours !== null && jours < 7;
//           case '7a30':
//             return jours !== null && jours >= 7 && jours < 30;
//           case '30a90':
//             return jours !== null && jours >= 30 && jours < 90;
//           case 'plus90':
//             return jours !== null && jours >= 90;
//           case 'avec':
//             return jours !== null;
//           default:
//             return true;
//         }
//       });
//     }

//     setFilteredMateriels(filtered);
//     setSelectedMateriels([]);
//   };

//   const handleSubmit = async (materielData: Omit<Materiel, 'id'>) => {
//     try {
//       const apiData: any = {
//         nom: materielData.nom?.trim() || '',
//         reference: materielData.reference?.trim() || '',
//         date_achat: materielData.date_achat,
//         etat: materielData.etat || 'fonctionnel',
//         service_attribue: materielData.service_attribue || '',
//         utilisateur_attribue: materielData.utilisateur_attribue?.trim() || ''
//       };

//       if (materielData.fournisseur) {
//         apiData.fournisseur = materielData.fournisseur;
//       }
      
//       let actionMessage = '';
      
//       if (editingMateriel) {
//         await materielsAPI.update(editingMateriel.id, apiData);
//         actionMessage = `Matériel "${materielData.nom}" modifié avec succès`;
//         showNotification('success', actionMessage, 'Modification réussie');
//       } else {
//         await materielsAPI.create(apiData);
//         actionMessage = `Matériel "${materielData.nom}" créé avec succès`;
//         showNotification('success', actionMessage, 'Création réussie');
//       }
      
//       fetchMateriels();
//       setIsFormOpen(false);
//       setEditingMateriel(undefined);
      
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
//       showNotification('error', errorMessage, 'Erreur');
//     }
//   };

//   const toggleSelectMateriel = (id: number) => {
//     setSelectedMateriels(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedMateriels([]);
//       showNotification('info', 'Sélection annulée', 'Information');
//     } else {
//       const allIds = filteredMateriels.map(m => m.id);
//       setSelectedMateriels(allIds);
//       showNotification('success', `${allIds.length} matériels sélectionnés`, 'Sélection');
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchMateriels();
//     await fetchReparations();
//     showNotification('success', 'Données rafraîchies avec succès', 'Rafraîchissement');
//   };

//   const confirmDelete = async () => {
//     try {
//       if (deleteMultiple) {
//         for (const id of selectedMateriels) {
//           await materielsAPI.delete(id);
//         }
        
//         showNotification('success', `${selectedMateriels.length} matériel(s) supprimé(s)`, 'Suppression réussie');
//         setSelectedMateriels([]);
//       } else if (materielToDelete) {
//         await materielsAPI.delete(materielToDelete);
//         showNotification('success', 'Matériel supprimé avec succès', 'Suppression réussie');
//       }
      
//       await fetchMateriels();
//     } catch (error) {
//       showNotification('error', 'Erreur lors de la suppression', 'Erreur');
//     } finally {
//       setShowDeleteConfirm(false);
//       setMaterielToDelete(null);
//       setDeleteMultiple(false);
//       setDeleteMessage('');
//     }
//   };

//   const handleDeleteSelected = () => {
//     if (selectedMateriels.length === 0) {
//       showNotification('error', 'Aucun matériel sélectionné', 'Erreur');
//       return;
//     }

//     setDeleteMultiple(true);
//     setDeleteMessage(`Êtes-vous sûr de vouloir supprimer ${selectedMateriels.length} matériel(s) ? Cette action est irréversible.`);
//     setShowDeleteConfirm(true);
//   };

//   const handleDelete = (id: number) => {
//     const materiel = materiels.find(m => m.id === id);
//     setMaterielToDelete(id);
//     setDeleteMultiple(false);
//     setDeleteMessage(`Êtes-vous sûr de vouloir supprimer le matériel "${materiel?.nom}" ? Cette action est irréversible.`);
//     setShowDeleteConfirm(true);
//   };

//   const handleEditSelected = () => {
//     if (selectedMateriels.length === 0) {
//       showNotification('error', 'Aucun matériel sélectionné', 'Erreur');
//       return;
//     }

//     if (selectedMateriels.length === 1) {
//       const materiel = materiels.find(m => m.id === selectedMateriels[0]);
//       if (materiel) {
//         handleEdit(materiel);
//       }
//     } else {
//       showNotification('info', `Édition multiple de ${selectedMateriels.length} matériels`, 'Information');
//     }
//   };

//   const handleEdit = (materiel: Materiel) => {
//     setEditingMateriel(materiel);
//     setIsFormOpen(true);
//   };

//   const handleAddNew = () => {
//     setEditingMateriel(undefined);
//     setIsFormOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredMateriels.map(m => ({
//         Nom: m.nom,
//         Référence: m.reference,
//         État: getEtatText(m.etat),
//         'Jours dernière réparation': getJoursTexte(getJoursDepuisReparation(m, reparations)),
//         Service: m.service_attribue,
//         Utilisateur: m.utilisateur_attribue || 'Non attribué',
//         'Date d\'achat': m.date_achat ? new Date(m.date_achat).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         Fournisseur: m.fournisseur && typeof m.fournisseur === 'object' && 'nom' in m.fournisseur 
//           ? (m.fournisseur as any).nom 
//           : 'Non spécifié'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `materiels_${new Date().toISOString().split('T')[0]}.csv`);
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
//     setFilterEtat('');
//     setFilterJours('');
//     setSelectedMateriels([]);
//     showNotification('info', 'Filtres réinitialisés', 'Information');
//   };

//   const getEtatBadge = (etat: string) => {
//     const badges = {
//       fonctionnel: 'badge-success',
//       en_panne: 'badge-error',
//       repare: 'badge-warning',
//       obsolete: 'badge-neutral',
//       en_maintenance: 'badge-info',
//       en_amelioration: 'badge-primary',
//       en_reparation: 'badge-warning',
//       hors_service: 'badge-error'
//     };
//     return badges[etat as keyof typeof badges] || 'badge-neutral';
//   };

//   const getEtatText = (etat: string) => {
//     const texts = {
//       fonctionnel: 'Fonctionnel',
//       en_panne: 'En panne',
//       repare: 'Réparé',
//       obsolete: 'Obsolète',
//       en_maintenance: 'En maintenance',
//       en_amelioration: 'En amélioration',
//       en_reparation: 'En réparation',
//       hors_service: 'Hors service'
//     };
//     return texts[etat as keyof typeof texts] || etat;
//   };

//   const getEtatIcon = (etat: string) => {
//     switch (etat) {
//       case 'fonctionnel': return <CheckCircle className="h-4 w-4" />;
//       case 'en_panne': return <AlertTriangle className="h-4 w-4" />;
//       case 'repare': return <Wrench className="h-4 w-4" />;
//       case 'obsolete': return <Package className="h-4 w-4" />;
//       case 'en_maintenance': return <Wrench className="h-4 w-4" />;
//       case 'en_amelioration': return <Zap className="h-4 w-4" />;
//       case 'en_reparation': return <Wrench className="h-4 w-4" />;
//       case 'hors_service': return <X className="h-4 w-4" />;
//       default: return <HardDrive className="h-4 w-4" />;
//     }
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setEditingMateriel(undefined);
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des matériels...</p>
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
//               {editingMateriel ? '✏️ Modifier le matériel' : '➕ Nouveau matériel'}
//             </h1>
//             <p className="text-base-content opacity-60 mt-1">
//               {editingMateriel 
//                 ? `Modification de "${editingMateriel.nom}"` 
//                 : 'Ajouter un nouveau matériel à l\'inventaire'
//               }
//             </p>
//           </div>

//           <div className="bg-base-200 rounded-lg shadow-xl">
//             <MaterielForm
//               isOpen={true}
//               onClose={handleCloseForm}
//               onSubmit={handleSubmit}
//               materiel={editingMateriel}
//               fournisseurs={fournisseurs}
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
//                   setMaterielToDelete(null);
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
//             <Server className="h-8 w-8 text-primary" />
//             Gestion des Matériels
//           </h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray(filteredMateriels).length} matériel(s) trouvé(s)
//             {selectedMateriels.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedMateriels.length} sélectionné(s))
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
//           {/* <button
//             onClick={handleExport}
//             className="btn btn-outline btn-sm"
//             title="Exporter la liste"
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button> */}
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouveau matériel
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//         <div className="card bg-info/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <CalendarDays className="h-8 w-8 text-info" />
//             </div>
//             <h3 className="text-2xl font-bold text-info mb-1">
//               {statistiques.joursDepuisDerniereReparation}
//             </h3>
//             <p className="text-sm opacity-60">Jours depuis dernière réparation</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <RotateCcw className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-2xl font-bold text-success mb-1">
//               {statistiques.materielsReparesRecemment}
//             </h3>
//             <p className="text-sm opacity-60">Réparés récemment (&lt;7 jours)</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <History className="h-8 w-8 text-warning" />
//             </div>
//             <h3 className="text-2xl font-bold text-warning mb-1">
//               {statistiques.materielsSansReparation}
//             </h3>
//             <p className="text-sm opacity-60">Jamais réparés</p>
//           </div>
//         </div>
//       </div> */}

//       {/* Cartes pour tous les états */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Server className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total matériels</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <CheckCircle className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-3xl font-bold text-success mb-1">{statistiques.fonctionnel}</h3>
//             <p className="text-sm opacity-60">Fonctionnels</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <AlertTriangle className="h-8 w-8 text-error" />
//             </div>
//             <h3 className="text-3xl font-bold text-error mb-1">{statistiques.enPanne}</h3>
//             <p className="text-sm opacity-60">En panne</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Wrench className="h-8 w-8 text-warning" />
//             </div>
//             <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.repare}</h3>
//             <p className="text-sm opacity-60">Réparés</p>
//           </div>
//         </div>
//       </div>

//       {/* Autres états */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//         <div className="card bg-info/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Wrench className="h-8 w-8 text-info" />
//             </div>
//             <h3 className="text-2xl font-bold text-info mb-1">{statistiques.enMaintenance || 0}</h3>
//             <p className="text-sm opacity-60">En maintenance</p>
//           </div>
//         </div>

//         <div className="card bg-primary/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Zap className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-2xl font-bold text-primary mb-1">{statistiques.enAmelioration || 0}</h3>
//             <p className="text-sm opacity-60">En amélioration</p>
//           </div>
//         </div>

//         <div className="card bg-neutral/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Package className="h-8 w-8 text-neutral" />
//             </div>
//             <h3 className="text-2xl font-bold text-neutral mb-1">{statistiques.obsolete}</h3>
//             <p className="text-sm opacity-60">Obsolètes</p>
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
//                 placeholder="Nom, référence, utilisateur..."
//                 className="input input-bordered w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 État</span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 value={filterEtat}
//                 onChange={(e) => setFilterEtat(e.target.value)}
//               >
//                 <option value="">Tous les états</option>
//                 <option value="fonctionnel">Fonctionnel</option>
//                 <option value="en_panne">En panne</option>
//                 <option value="repare">Réparé</option>
//                 <option value="obsolete">Obsolète</option>
//                 <option value="en_maintenance">En maintenance</option>
//                 <option value="en_amelioration">En amélioration</option>
//                 <option value="en_reparation">En réparation</option>
//                 <option value="hors_service">Hors service</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-1">
//                   <Calendar className="h-4 w-4" />
//                   Dernière réparation
//                 </span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 value={filterJours}
//                 onChange={(e) => setFilterJours(e.target.value)}
//               >
//                 <option value="">Toutes périodes</option>
//                 <option value="jamais">Jamais réparé</option>
//                 <option value="moins7">&lt; 7 jours</option>
//                 <option value="7a30">7 à 30 jours</option>
//                 <option value="30a90">30 à 90 jours</option>
//                 <option value="plus90">&gt; 90 jours</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📁 Service</span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 onChange={(e) => e.target.value && setSearchTerm(e.target.value)}
//               >
//                 <option value="">Tous les services</option>
//                 {Object.entries(statistiques.parService).map(([service, count]) => (
//                   <option key={service} value={service}>
//                     {service} ({count})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🏢 Fournisseur</span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 onChange={(e) => e.target.value && setSearchTerm(e.target.value)}
//               >
//                 <option value="">Tous les fournisseurs</option>
//                 {Object.entries(statistiques.parFournisseur).map(([fournisseur, count]) => (
//                   <option key={fournisseur} value={fournisseur}>
//                     {fournisseur} ({count})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex justify-between items-center mt-4">
//             <div className="flex gap-2">
//               {selectedMateriels.length > 0 && (
//                 <>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-outline btn-sm"
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Modifier ({selectedMateriels.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-error btn-sm"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Supprimer ({selectedMateriels.length})
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
//       {/* Tableau */}
// <div className="card bg-base-200 shadow-xl">
//   <div className="card-body p-0">
//     <div className="overflow-x-auto">
//       <table className="table table-zebra">
//         <thead>
//           <tr className="bg-base-300">
//             <th className="w-1">
//               <div className="flex items-center">
//                 <button 
//                   onClick={toggleSelectAll}
//                   className="btn btn-ghost btn-xs p-1 mr-2"
//                 >
//                   {isSelectAll ? (
//                     <CheckSquare className="h-4 w-4 text-primary" />
//                   ) : (
//                     <Square className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//             </th>
//             <th>Nom</th>
//             <th>Référence</th>
//             <th>État</th>
//             <th>Service</th>
//             <th>Utilisateur</th>
//             <th className="text-right">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {safeArray(filteredMateriels).length === 0 ? (
//             <tr>
//               <td colSpan={7} className="text-center py-8">
//                 <div className="flex flex-col items-center gap-2">
//                   <Package className="h-12 w-12 text-base-content opacity-30" />
//                   <p className="text-base-content opacity-50">
//                     {searchTerm || filterEtat || filterJours ? 'Aucun matériel correspondant aux filtres' : 'Aucun matériel trouvé'}
//                   </p>
//                   <button 
//                     onClick={searchTerm || filterEtat || filterJours ? resetFilters : handleAddNew}
//                     className="btn btn-sm btn-primary mt-2"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     {searchTerm || filterEtat || filterJours ? 'Réinitialiser les filtres' : 'Ajouter un premier matériel'}
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ) : (
//             safeArray(filteredMateriels).map(materiel => {
//               return (
//                 <tr key={materiel.id} className="hover:bg-base-100/50">
//                   <td>
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="checkbox checkbox-xs"
//                         checked={selectedMateriels.includes(materiel.id)}
//                         onChange={() => toggleSelectMateriel(materiel.id)}
//                       />
//                     </div>
//                   </td>
//                   <td>
//                     <div className="font-medium">{materiel.nom}</div>
//                   </td>
//                   <td>
//                     <div className="font-mono text-sm">{materiel.reference}</div>
//                   </td>
//                   <td>
//                     <div className={`badge gap-2 ${getEtatBadge(materiel.etat)}`}>
//                       {getEtatIcon(materiel.etat)}
//                       {getEtatText(materiel.etat)}
//                     </div>
//                   </td>
//                   <td>
//                     <div>{materiel.service_attribue || 'Non attribué'}</div>
//                   </td>
//                   <td>
//                     <div>{materiel.utilisateur_attribue || 'Non attribué'}</div>
//                   </td>
//                   <td>
//                     <div className="flex justify-end gap-2">
//                       <button
//                         onClick={() => handleEdit(materiel)}
//                         className="btn btn-ghost btn-sm btn-square"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(materiel.id)}
//                         className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/20"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   </div>
// </div>

//       {/* Message d'information sur les états */}
//       <div className="mt-6 p-4 bg-info/10 rounded-lg">
//         <div className="flex items-start gap-3">
//           <Info className="h-5 w-5 text-info mt-0.5" />
//           <div className="flex-1">
//             <h4 className="font-bold text-info mb-1">🔄 Synchronisation automatique des états</h4>
//             <p className="text-sm opacity-80">
//               Les états des matériels sont automatiquement mis à jour selon les réparations :
//             </p>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
//               <div className="flex items-center gap-1">
//                 <span className="badge badge-info badge-xs">en_maintenance</span>
//                 <span>← Réparation préventive</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="badge badge-warning badge-xs">en_reparation</span>
//                 <span>← Réparation corrective</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="badge badge-primary badge-xs">en_amelioration</span>
//                 <span>← Amélioration</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="badge badge-success badge-xs">repare/ameliore</span>
//                 <span>← Réparation terminée</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Materiels;


// src/pages/Materiels.jsx - AVEC AUTO-LOGGER AJOUTÉ
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Eye, Filter, Download, Edit, Trash2, 
  CheckSquare, Square, X, BarChart3, Cpu, HardDrive, 
  Clock, User, CheckCircle, AlertTriangle, RefreshCw,
  TrendingUp, Battery, BatteryFull, BatteryLow, BatteryMedium,
  Server, Wrench, Zap, Shield, Package, Database, ArrowLeft,
  Calendar, History, RotateCcw, CalendarDays, Bell, Info
} from 'lucide-react';
import { Materiel, Fournisseur, Reparation } from '../types';
import MaterielForm from '../components/MaterielForm';
import { materielsAPI, fournisseursAPI, reparationsAPI } from '../services/api';

// ==================== AUTO-LOGGER ====================
// Ajout du système de logging automatique
import { useAuth } from '../context/AuthContext';

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
    
    // Fonctions spécifiques pour les matériels
    logMaterielCreate: (materielData) => 
      logCRUD('create', 'Matériels', materielData.nom || 'Nouveau matériel', { data: materielData }),
    
    logMaterielUpdate: (id, oldData, newData) => 
      logCRUD('update', 'Matériels', newData.nom || oldData.nom || id, {
        id: id,
        oldData: oldData,
        newData: newData,
        changes: getChanges(oldData, newData)
      }),
    
    logMaterielDelete: (id, materielData) =>
      logCRUD('delete', 'Matériels', materielData.nom || id, { id: id, data: materielData }),
    
    logMaterielExport: (format, count, filters) =>
      logExport('Matériels', format, count, filters),
    
    logMaterielView: (materiel) =>
      logCRUD('read', 'Matériels', materiel.nom || 'Matériel', { id: materiel.id, data: materiel }),
    
    logMaterielSearch: (term, count) =>
      logSearch('Matériels', term, count),
    
    logMaterielFilter: (filterType, count) =>
      logFilter('Matériels', filterType, count)
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
const safeArray = (data: any): Materiel[] => {
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): Materiel[] => {
  if (!Array.isArray(array)) return [];
  return array.filter(condition);
};

const extractDataFromResponse = (response: any): any[] => {
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

// Système de notification simple
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

// Fonction pour calculer les jours depuis la dernière réparation
const getJoursDepuisReparation = (materiel: Materiel, reparations: Reparation[]): number | null => {
  if (!materiel.id || !reparations || reparations.length === 0) {
    return null;
  }
  
  const reparationsMateriel = reparations.filter(rep => 
    rep.materiel?.toString() === materiel.id.toString() && 
    rep.date_fin
  );
  
  if (reparationsMateriel.length === 0) {
    return null;
  }
  
  const reparationsTriees = reparationsMateriel.sort((a, b) => {
    const dateA = new Date(a.date_fin!).getTime();
    const dateB = new Date(b.date_fin!).getTime();
    return dateB - dateA;
  });
  
  const derniereReparation = reparationsTriees[0];
  
  if (!derniereReparation.date_fin) {
    return null;
  }
  
  const dateFin = new Date(derniereReparation.date_fin);
  const aujourdhui = new Date();
  const differenceMs = aujourdhui.getTime() - dateFin.getTime();
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
};

const getJoursTexte = (jours: number | null): string => {
  if (jours === null) return 'Jamais réparé';
  if (jours === 0) return 'Aujourd\'hui';
  if (jours === 1) return 'Hier';
  return `Il y a ${jours} jours`;
};

const getJoursCouleur = (jours: number | null): string => {
  if (jours === null) return 'text-gray-500';
  if (jours < 7) return 'text-green-500';
  if (jours < 30) return 'text-yellow-500';
  if (jours < 90) return 'text-orange-500';
  return 'text-red-500';
};

const getJoursBadge = (jours: number | null): string => {
  if (jours === null) return 'badge-neutral';
  if (jours < 7) return 'badge-success';
  if (jours < 30) return 'badge-warning';
  if (jours < 90) return 'badge-warning';
  return 'badge-error';
};

const Materiels: React.FC = () => {
  // ==================== INITIALISATION AUTO-LOGGER ====================
  const autoLogger = useAutoLogger();
  
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [reparations, setReparations] = useState<Reparation[]>([]);
  const [filteredMateriels, setFilteredMateriels] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterEtat, setFilterEtat] = useState<string>('');
  const [filterJours, setFilterJours] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMateriel, setEditingMateriel] = useState<Materiel | undefined>();
  const [selectedMateriels, setSelectedMateriels] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // États pour la confirmation de suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [materielToDelete, setMaterielToDelete] = useState<number | null>(null);
  const [deleteMultiple, setDeleteMultiple] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  const [statistiques, setStatistiques] = useState({
    total: 0,
    fonctionnel: 0,
    enPanne: 0,
    repare: 0,
    obsolete: 0,
    enMaintenance: 0,
    enAmelioration: 0,
    enReparation: 0,
    horsService: 0,
    nonAttribue: 0,
    attribue: 0,
    parService: {} as Record<string, number>,
    ageMoyen: 0,
    tauxPanne: 0,
    evolution30j: 12,
    parFournisseur: {} as Record<string, number>,
    joursDepuisDerniereReparation: 0,
    materielsSansReparation: 0,
    materielsReparesRecemment: 0,
  });

  useEffect(() => {
    fetchMateriels();
    fetchFournisseurs();
    fetchReparations();
    
    // Afficher une notification de bienvenue
    setTimeout(() => {
      showNotification('info', 'Chargement des matériels et réparations...', 'Bienvenue');
    }, 500);
  }, []);

  useEffect(() => {
    filterMateriels();
    if (materiels.length > 0) {
      calculerStatistiques(materiels);
    }
  }, [materiels, searchTerm, filterEtat, filterJours, reparations]);

  useEffect(() => {
    if (filteredMateriels.length > 0 && selectedMateriels.length === filteredMateriels.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedMateriels, filteredMateriels]);

  const fetchMateriels = async () => {
    try {
      setLoading(true);
      const response = await materielsAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      
      // Vérifier les états venant des réparations
      const updatedData = await verifierEtatsMateriels(extractedData);
      
      setMateriels(updatedData);
      
      // 🔥 AUTO-LOGGER: Chargement des matériels
      autoLogger.logAction('CHARGEMENT', 'Matériels', `Chargement de ${updatedData.length} matériels`, {
        count: updatedData.length,
        type: 'load'
      });
      
    } catch (err: any) {
      showNotification('error', 'Erreur lors du chargement des matériels', 'Erreur');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const response = await fournisseursAPI.getAll();
      setFournisseurs(extractDataFromResponse(response));
    } catch (err: any) {
      console.error('Erreur chargement fournisseurs:', err);
    }
  };

  const fetchReparations = async () => {
    try {
      const response = await reparationsAPI.getAll();
      setReparations(extractDataFromResponse(response));
    } catch (err: any) {
      console.error('Erreur chargement réparations:', err);
    }
  };

  // Vérifier et mettre à jour les états des matériels selon les réparations
  const verifierEtatsMateriels = async (materielsData: Materiel[]): Promise<Materiel[]> => {
    try {
      // Récupérer toutes les réparations en cours (sans date_fin)
      const reparationsEnCours = reparations.filter(rep => !rep.date_fin);
      
      return materielsData.map(materiel => {
        // Chercher si ce matériel a une réparation en cours
        const reparationEnCours = reparationsEnCours.find(rep => 
          rep.materiel?.toString() === materiel.id.toString()
        );
        
        if (reparationEnCours) {
          // Déterminer le nouvel état selon le type de réparation
          let nouvelEtat = materiel.etat;
          
          switch(reparationEnCours.type_reparation) {
            case 'corrective':
              nouvelEtat = 'en_reparation';
              break;
            case 'preventive':
              nouvelEtat = 'en_maintenance';
              break;
            case 'ameliorative':
              nouvelEtat = 'en_amelioration';
              break;
          }
          
          // Si l'état a changé, afficher une notification
          if (nouvelEtat !== materiel.etat) {
            showNotification('info', 
              `Matériel "${materiel.nom}" est maintenant ${getEtatText(nouvelEtat)}`, 
              'État mis à jour'
            );
          }
          
          return { ...materiel, etat: nouvelEtat };
        }
        
        return materiel;
      });
    } catch (error) {
      console.error('Erreur vérification états:', error);
      return materielsData;
    }
  };

  const calculerStatistiques = (data: Materiel[]) => {
    const now = new Date();
    let totalAge = 0;
    let countWithDate = 0;
    const services: Record<string, number> = {};
    const fournisseurs: Record<string, number> = {};

    let totalJoursDepuisReparation = 0;
    let countAvecReparation = 0;
    let materielsSansReparation = 0;
    let materielsReparesRecemment = 0;

    const etats: Record<string, number> = {
      fonctionnel: 0,
      en_panne: 0,
      repare: 0,
      obsolete: 0,
      en_maintenance: 0,
      en_amelioration: 0,
      en_reparation: 0,
      hors_service: 0
    };

    data.forEach(materiel => {
      if (materiel.date_achat) {
        const dateAchat = new Date(materiel.date_achat);
        const age = Math.floor((now.getTime() - dateAchat.getTime()) / (1000 * 60 * 60 * 24));
        totalAge += age;
        countWithDate++;
      }

      if (materiel.service_attribue) {
        services[materiel.service_attribue] = (services[materiel.service_attribue] || 0) + 1;
      }

      if (materiel.fournisseur && typeof materiel.fournisseur === 'object' && 'nom' in materiel.fournisseur) {
        const nomFournisseur = (materiel.fournisseur as any).nom;
        fournisseurs[nomFournisseur] = (fournisseurs[nomFournisseur] || 0) + 1;
      }

      const etat = materiel.etat || 'inconnu';
      if (etats.hasOwnProperty(etat)) {
        etats[etat]++;
      } else {
        etats[etat] = 1;
      }

      const joursDepuisRep = getJoursDepuisReparation(materiel, reparations);
      if (joursDepuisRep !== null) {
        totalJoursDepuisReparation += joursDepuisRep;
        countAvecReparation++;
        
        if (joursDepuisRep < 7) {
          materielsReparesRecemment++;
        }
      } else {
        materielsSansReparation++;
      }
    });

    setStatistiques({
      total: data.length,
      fonctionnel: etats.fonctionnel,
      enPanne: etats.en_panne,
      repare: etats.repare,
      obsolete: etats.obsolete,
      enMaintenance: etats.en_maintenance,
      enAmelioration: etats.en_amelioration,
      enReparation: etats.en_reparation,
      horsService: etats.hors_service,
      nonAttribue: data.filter(m => !m.utilisateur_attribue || m.utilisateur_attribue.trim() === '').length,
      attribue: data.filter(m => m.utilisateur_attribue && m.utilisateur_attribue.trim() !== '').length,
      parService: services,
      parFournisseur: fournisseurs,
      ageMoyen: countWithDate > 0 ? Math.round(totalAge / countWithDate) : 0,
      tauxPanne: data.length > 0 ? Math.round((etats.en_panne / data.length) * 100) : 0,
      evolution30j: 12,
      joursDepuisDerniereReparation: countAvecReparation > 0 ? Math.round(totalJoursDepuisReparation / countAvecReparation) : 0,
      materielsSansReparation: materielsSansReparation,
      materielsReparesRecemment: materielsReparesRecemment
    });
  };

  const filterMateriels = () => {
    let filtered = safeArray(materiels);

    if (searchTerm) {
      filtered = safeFilter(filtered, m => 
        m.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.utilisateur_attribue && m.utilisateur_attribue.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.service_attribue && m.service_attribue.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterEtat) {
      filtered = safeFilter(filtered, m => m.etat === filterEtat);
    }

    if (filterJours) {
      filtered = safeFilter(filtered, m => {
        const jours = getJoursDepuisReparation(m, reparations);
        
        switch(filterJours) {
          case 'jamais':
            return jours === null;
          case 'moins7':
            return jours !== null && jours < 7;
          case '7a30':
            return jours !== null && jours >= 7 && jours < 30;
          case '30a90':
            return jours !== null && jours >= 30 && jours < 90;
          case 'plus90':
            return jours !== null && jours >= 90;
          case 'avec':
            return jours !== null;
          default:
            return true;
        }
      });
    }

    setFilteredMateriels(filtered);
    setSelectedMateriels([]);
  };

  const handleSubmit = async (materielData: Omit<Materiel, 'id'>) => {
    try {
      const apiData: any = {
        nom: materielData.nom?.trim() || '',
        reference: materielData.reference?.trim() || '',
        date_achat: materielData.date_achat,
        etat: materielData.etat || 'fonctionnel',
        service_attribue: materielData.service_attribue || '',
        utilisateur_attribue: materielData.utilisateur_attribue?.trim() || ''
      };

      if (materielData.fournisseur) {
        apiData.fournisseur = materielData.fournisseur;
      }
      
      let actionMessage = '';
      
      if (editingMateriel) {
        await materielsAPI.update(editingMateriel.id, apiData);
        actionMessage = `Matériel "${materielData.nom}" modifié avec succès`;
        showNotification('success', actionMessage, 'Modification réussie');
        
        // 🔥 AUTO-LOGGER: Modification de matériel
        autoLogger.logMaterielUpdate(editingMateriel.id, editingMateriel, materielData);
        
      } else {
        await materielsAPI.create(apiData);
        actionMessage = `Matériel "${materielData.nom}" créé avec succès`;
        showNotification('success', actionMessage, 'Création réussie');
        
        // 🔥 AUTO-LOGGER: Création de matériel
        autoLogger.logMaterielCreate(materielData);
      }
      
      fetchMateriels();
      setIsFormOpen(false);
      setEditingMateriel(undefined);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
      showNotification('error', errorMessage, 'Erreur');
    }
  };

  const toggleSelectMateriel = (id: number) => {
    setSelectedMateriels(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedMateriels([]);
      showNotification('info', 'Sélection annulée', 'Information');
    } else {
      const allIds = filteredMateriels.map(m => m.id);
      setSelectedMateriels(allIds);
      showNotification('success', `${allIds.length} matériels sélectionnés`, 'Sélection');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMateriels();
    await fetchReparations();
    showNotification('success', 'Données rafraîchies avec succès', 'Rafraîchissement');
    
    // 🔥 AUTO-LOGGER: Rafraîchissement
    autoLogger.logAction('RAFRAÎCHISSEMENT', 'Matériels', 'Rafraîchissement des données', {
      type: 'refresh',
      timestamp: new Date().toISOString()
    });
  };

  const confirmDelete = async () => {
    try {
      if (deleteMultiple) {
        for (const id of selectedMateriels) {
          await materielsAPI.delete(id);
        }
        
        showNotification('success', `${selectedMateriels.length} matériel(s) supprimé(s)`, 'Suppression réussie');
        setSelectedMateriels([]);
        
        // 🔥 AUTO-LOGGER: Suppression multiple
        selectedMateriels.forEach(id => {
          const materiel = materiels.find(m => m.id === id);
          if (materiel) {
            autoLogger.logMaterielDelete(id, materiel);
          }
        });
        
      } else if (materielToDelete) {
        const materiel = materiels.find(m => m.id === materielToDelete);
        await materielsAPI.delete(materielToDelete);
        showNotification('success', 'Matériel supprimé avec succès', 'Suppression réussie');
        
        // 🔥 AUTO-LOGGER: Suppression unique
        if (materiel) {
          autoLogger.logMaterielDelete(materielToDelete, materiel);
        }
      }
      
      await fetchMateriels();
    } catch (error) {
      showNotification('error', 'Erreur lors de la suppression', 'Erreur');
    } finally {
      setShowDeleteConfirm(false);
      setMaterielToDelete(null);
      setDeleteMultiple(false);
      setDeleteMessage('');
    }
  };

  const handleDeleteSelected = () => {
    if (selectedMateriels.length === 0) {
      showNotification('error', 'Aucun matériel sélectionné', 'Erreur');
      return;
    }

    setDeleteMultiple(true);
    setDeleteMessage(`Êtes-vous sûr de vouloir supprimer ${selectedMateriels.length} matériel(s) ? Cette action est irréversible.`);
    setShowDeleteConfirm(true);
  };

  const handleDelete = (id: number) => {
    const materiel = materiels.find(m => m.id === id);
    setMaterielToDelete(id);
    setDeleteMultiple(false);
    setDeleteMessage(`Êtes-vous sûr de vouloir supprimer le matériel "${materiel?.nom}" ? Cette action est irréversible.`);
    setShowDeleteConfirm(true);
  };

  const handleEditSelected = () => {
    if (selectedMateriels.length === 0) {
      showNotification('error', 'Aucun matériel sélectionné', 'Erreur');
      return;
    }

    if (selectedMateriels.length === 1) {
      const materiel = materiels.find(m => m.id === selectedMateriels[0]);
      if (materiel) {
        handleEdit(materiel);
      }
    } else {
      showNotification('info', `Édition multiple de ${selectedMateriels.length} matériels`, 'Information');
    }
  };

  const handleEdit = (materiel: Materiel) => {
    setEditingMateriel(materiel);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingMateriel(undefined);
    setIsFormOpen(true);
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredMateriels.map(m => ({
        Nom: m.nom,
        Référence: m.reference,
        État: getEtatText(m.etat),
        'Jours dernière réparation': getJoursTexte(getJoursDepuisReparation(m, reparations)),
        Service: m.service_attribue,
        Utilisateur: m.utilisateur_attribue || 'Non attribué',
        'Date d\'achat': m.date_achat ? new Date(m.date_achat).toLocaleDateString('fr-FR') : 'Non spécifiée',
        Fournisseur: m.fournisseur && typeof m.fournisseur === 'object' && 'nom' in m.fournisseur 
          ? (m.fournisseur as any).nom 
          : 'Non spécifié'
      }));

      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `materiels_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('success', 'Export CSV réussi !', 'Export');
      
      // 🔥 AUTO-LOGGER: Exportation
      autoLogger.logMaterielExport('CSV', filteredMateriels.length, {
        dateRange: 'toutes',
        searchTerm: searchTerm,
        filterEtat: filterEtat,
        filterJours: filterJours
      });
      
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'export', 'Erreur');
    }
  };

  const resetFilters = () => {
    // 🔥 AUTO-LOGGER: Réinitialisation des filtres
    autoLogger.logMaterielFilter('réinitialisation', materiels.length);
    
    setSearchTerm('');
    setFilterEtat('');
    setFilterJours('');
    setSelectedMateriels([]);
    showNotification('info', 'Filtres réinitialisés', 'Information');
  };

  const getEtatBadge = (etat: string) => {
    const badges = {
      fonctionnel: 'badge-success',
      en_panne: 'badge-error',
      repare: 'badge-warning',
      obsolete: 'badge-neutral',
      en_maintenance: 'badge-info',
      en_amelioration: 'badge-primary',
      en_reparation: 'badge-warning',
      hors_service: 'badge-error'
    };
    return badges[etat as keyof typeof badges] || 'badge-neutral';
  };

  const getEtatText = (etat: string) => {
    const texts = {
      fonctionnel: 'Fonctionnel',
      en_panne: 'En panne',
      repare: 'Réparé',
      obsolete: 'Obsolète',
      en_maintenance: 'En maintenance',
      en_amelioration: 'En amélioration',
      en_reparation: 'En réparation',
      hors_service: 'Hors service'
    };
    return texts[etat as keyof typeof texts] || etat;
  };

  const getEtatIcon = (etat: string) => {
    switch (etat) {
      case 'fonctionnel': return <CheckCircle className="h-4 w-4" />;
      case 'en_panne': return <AlertTriangle className="h-4 w-4" />;
      case 'repare': return <Wrench className="h-4 w-4" />;
      case 'obsolete': return <Package className="h-4 w-4" />;
      case 'en_maintenance': return <Wrench className="h-4 w-4" />;
      case 'en_amelioration': return <Zap className="h-4 w-4" />;
      case 'en_reparation': return <Wrench className="h-4 w-4" />;
      case 'hors_service': return <X className="h-4 w-4" />;
      default: return <HardDrive className="h-4 w-4" />;
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMateriel(undefined);
  };

  if (loading && !refreshing) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des matériels...</p>
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
              {editingMateriel ? '✏️ Modifier le matériel' : '➕ Nouveau matériel'}
            </h1>
            <p className="text-base-content opacity-60 mt-1">
              {editingMateriel 
                ? `Modification de "${editingMateriel.nom}"` 
                : 'Ajouter un nouveau matériel à l\'inventaire'
              }
            </p>
          </div>

          <div className="bg-base-200 rounded-lg shadow-xl">
            <MaterielForm
              isOpen={true}
              onClose={handleCloseForm}
              onSubmit={handleSubmit}
              materiel={editingMateriel}
              fournisseurs={fournisseurs}
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
                  setMaterielToDelete(null);
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
            <Server className="h-8 w-8 text-primary" />
            Gestion des Matériels
          </h1>
          <p className="text-base-content opacity-60 mt-1">
            {safeArray(filteredMateriels).length} matériel(s) trouvé(s)
            {selectedMateriels.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedMateriels.length} sélectionné(s))
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
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
            Nouveau matériel
          </button>
        </div>
      </div>

      {/* Section Statistiques
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-info/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <CalendarDays className="h-8 w-8 text-info" />
            </div>
            <h3 className="text-2xl font-bold text-info mb-1">
              {statistiques.joursDepuisDerniereReparation}
            </h3>
            <p className="text-sm opacity-60">Jours depuis dernière réparation</p>
          </div>
        </div>

        <div className="card bg-success/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <RotateCcw className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-success mb-1">
              {statistiques.materielsReparesRecemment}
            </h3>
            <p className="text-sm opacity-60">Réparés récemment (&lt;7 jours)</p>
          </div>
        </div>

        <div className="card bg-warning/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <History className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-2xl font-bold text-warning mb-1">
              {statistiques.materielsSansReparation}
            </h3>
            <p className="text-sm opacity-60">Jamais réparés</p>
          </div>
        </div>
      </div> */}

      {/* Cartes pour tous les états */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Server className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
            <p className="text-sm opacity-60">Total matériels</p>
          </div>
        </div>

        <div className="card bg-success/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-3xl font-bold text-success mb-1">{statistiques.fonctionnel}</h3>
            <p className="text-sm opacity-60">Fonctionnels</p>
          </div>
        </div>

        <div className="card bg-error/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-error" />
            </div>
            <h3 className="text-3xl font-bold text-error mb-1">{statistiques.enPanne}</h3>
            <p className="text-sm opacity-60">En panne</p>
          </div>
        </div>

        <div className="card bg-warning/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Wrench className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.repare}</h3>
            <p className="text-sm opacity-60">Réparés</p>
          </div>
        </div>
      </div>

      {/* Autres états */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-info/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Wrench className="h-8 w-8 text-info" />
            </div>
            <h3 className="text-2xl font-bold text-info mb-1">{statistiques.enMaintenance || 0}</h3>
            <p className="text-sm opacity-60">En maintenance</p>
          </div>
        </div>

        <div className="card bg-primary/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-1">{statistiques.enAmelioration || 0}</h3>
            <p className="text-sm opacity-60">En amélioration</p>
          </div>
        </div>

        <div className="card bg-neutral/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Package className="h-8 w-8 text-neutral" />
            </div>
            <h3 className="text-2xl font-bold text-neutral mb-1">{statistiques.obsolete}</h3>
            <p className="text-sm opacity-60">Obsolètes</p>
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
                placeholder="Nom, référence, utilisateur..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // 🔥 AUTO-LOGGER: Recherche
                  if (e.target.value.trim()) {
                    const resultsCount = materiels.filter(m => 
                      m.nom?.toLowerCase().includes(e.target.value.toLowerCase()) ||
                      m.reference?.toLowerCase().includes(e.target.value.toLowerCase()) ||
                      (m.utilisateur_attribue && m.utilisateur_attribue.toLowerCase().includes(e.target.value.toLowerCase())) ||
                      (m.service_attribue && m.service_attribue.toLowerCase().includes(e.target.value.toLowerCase()))
                    ).length;
                    
                    autoLogger.logMaterielSearch(e.target.value, resultsCount);
                  }
                }}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📊 État</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filterEtat}
                onChange={(e) => {
                  setFilterEtat(e.target.value);
                  // 🔥 AUTO-LOGGER: Filtre par état
                  if (e.target.value) {
                    const resultsCount = materiels.filter(m => m.etat === e.target.value).length;
                    autoLogger.logMaterielFilter(`état: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Tous les états</option>
                <option value="fonctionnel">Fonctionnel</option>
                <option value="en_panne">En panne</option>
                <option value="repare">Réparé</option>
                <option value="obsolete">Obsolète</option>
                <option value="en_maintenance">En maintenance</option>
                <option value="en_amelioration">En amélioration</option>
                <option value="en_reparation">En réparation</option>
                <option value="hors_service">Hors service</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Dernière réparation
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filterJours}
                onChange={(e) => {
                  setFilterJours(e.target.value);
                  // 🔥 AUTO-LOGGER: Filtre par jours
                  if (e.target.value) {
                    const resultsCount = materiels.filter(m => {
                      const jours = getJoursDepuisReparation(m, reparations);
                      
                      switch(e.target.value) {
                        case 'jamais':
                          return jours === null;
                        case 'moins7':
                          return jours !== null && jours < 7;
                        case '7a30':
                          return jours !== null && jours >= 7 && jours < 30;
                        case '30a90':
                          return jours !== null && jours >= 30 && jours < 90;
                        case 'plus90':
                          return jours !== null && jours >= 90;
                        case 'avec':
                          return jours !== null;
                        default:
                          return true;
                      }
                    }).length;
                    
                    autoLogger.logMaterielFilter(`jours: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Toutes périodes</option>
                <option value="jamais">Jamais réparé</option>
                <option value="moins7">&lt; 7 jours</option>
                <option value="7a30">7 à 30 jours</option>
                <option value="30a90">30 à 90 jours</option>
                <option value="plus90">&gt; 90 jours</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📁 Service</span>
              </label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => {
                  if (e.target.value) {
                    setSearchTerm(e.target.value);
                    // 🔥 AUTO-LOGGER: Filtre par service
                    const resultsCount = materiels.filter(m => 
                      m.service_attribue && m.service_attribue.includes(e.target.value)
                    ).length;
                    
                    autoLogger.logMaterielFilter(`service: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Tous les services</option>
                {Object.entries(statistiques.parService).map(([service, count]) => (
                  <option key={service} value={service}>
                    {service} ({count})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">🏢 Fournisseur</span>
              </label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => {
                  if (e.target.value) {
                    setSearchTerm(e.target.value);
                    // 🔥 AUTO-LOGGER: Filtre par fournisseur
                    const resultsCount = materiels.filter(m => {
                      if (m.fournisseur && typeof m.fournisseur === 'object' && 'nom' in m.fournisseur) {
                        return (m.fournisseur as any).nom.includes(e.target.value);
                      }
                      return false;
                    }).length;
                    
                    autoLogger.logMaterielFilter(`fournisseur: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Tous les fournisseurs</option>
                {Object.entries(statistiques.parFournisseur).map(([fournisseur, count]) => (
                  <option key={fournisseur} value={fournisseur}>
                    {fournisseur} ({count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              {selectedMateriels.length > 0 && (
                <>
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier ({selectedMateriels.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-error btn-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer ({selectedMateriels.length})
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
                  <th>Référence</th>
                  <th>État</th>
                  <th>Service</th>
                  <th>Utilisateur</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredMateriels).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-12 w-12 text-base-content opacity-30" />
                        <p className="text-base-content opacity-50">
                          {searchTerm || filterEtat || filterJours ? 'Aucun matériel correspondant aux filtres' : 'Aucun matériel trouvé'}
                        </p>
                        <button 
                          onClick={searchTerm || filterEtat || filterJours ? resetFilters : handleAddNew}
                          className="btn btn-sm btn-primary mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {searchTerm || filterEtat || filterJours ? 'Réinitialiser les filtres' : 'Ajouter un premier matériel'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  safeArray(filteredMateriels).map(materiel => {
                    return (
                      <tr key={materiel.id} className="hover:bg-base-100/50">
                        <td>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs"
                              checked={selectedMateriels.includes(materiel.id)}
                              onChange={() => toggleSelectMateriel(materiel.id)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="font-medium">{materiel.nom}</div>
                        </td>
                        <td>
                          <div className="font-mono text-sm">{materiel.reference}</div>
                        </td>
                        <td>
                          <div className={`badge gap-2 ${getEtatBadge(materiel.etat)}`}>
                            {getEtatIcon(materiel.etat)}
                            {getEtatText(materiel.etat)}
                          </div>
                        </td>
                        <td>
                          <div>{materiel.service_attribue || 'Non attribué'}</div>
                        </td>
                        <td>
                          <div>{materiel.utilisateur_attribue || 'Non attribué'}</div>
                        </td>
                        <td>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                handleEdit(materiel);
                                // 🔥 AUTO-LOGGER: Consultation d'un matériel
                                autoLogger.logMaterielView(materiel);
                              }}
                              className="btn btn-ghost btn-sm btn-square"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(materiel.id)}
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

      {/* Message d'information sur les états */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-info mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-info mb-1">🔄 Synchronisation automatique des états</h4>
            <p className="text-sm opacity-80">
              Les états des matériels sont automatiquement mis à jour selon les réparations :
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="badge badge-info badge-xs">en_maintenance</span>
                <span>← Réparation préventive</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="badge badge-warning badge-xs">en_reparation</span>
                <span>← Réparation corrective</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="badge badge-primary badge-xs">en_amelioration</span>
                <span>← Amélioration</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="badge badge-success badge-xs">repare/ameliore</span>
                <span>← Réparation terminée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materiels;