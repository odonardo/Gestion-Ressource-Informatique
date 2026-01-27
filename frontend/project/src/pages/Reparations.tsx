

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Reparation[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // Type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// // Type pour les statistiques
// interface StatistiquesReparations {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
//   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // Statistiques détaillées
//   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParMois: [],
//     topTechniciens: []
//   });

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     if (user.nom_complet) return user.nom_complet;
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user.name) return user.name;
//     if (user.username) return user.username;
    
//     return 'Utilisateur';
//   }, [user]);

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Calculs de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => 
//       r.date_debut && new Date(r.date_debut) >= debutMois
//     );
    
//     // Calcul des coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
//     // Calcul du coût moyen
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Calcul de la durée moyenne des réparations terminées
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         try {
//           const dateDebut = new Date(rep.date_debut);
//           const dateFin = new Date(rep.date_fin);
//           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
//             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
//             dureeTotale += duree;
//             reparationsAvecDuree++;
//           }
//         } catch (e) {
//           console.warn('Erreur calcul durée:', e);
//         }
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     const moisActuel = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         try {
//           const date = new Date(rep.date_debut);
//           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
//           if (reparationsParMoisMap[moisKey]) {
//             reparationsParMoisMap[moisKey].count++;
//             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
//           }
//         } catch (e) {
//           console.warn('Erreur date réparation:', e);
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
//     data.forEach(rep => {
//       const technicien = getTechnicienName(rep) || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5); // Top 5 techniciens
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
//       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des réparations...');
      
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log('✅ Réparations chargées:', extractedData.length);
      
//       setReparations(extractedData);
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des réparations';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);

//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Charger toutes les données au montage
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Filtrer les réparations
//   useEffect(() => {
//     let filtered = safeArray(reparations);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter(filtered, reparation => {
//         const technicien = getTechnicienName(reparation).toLowerCase();
//         return (
//           reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
//           reparation.description?.toLowerCase().includes(searchLower) ||
//           technicien.includes(searchLower)
//         );
//       });
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
//     }

//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = safeFilter(filtered, reparation => reparation.date_fin);
//       }
//     }

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut]);

//   // Gérer la sélection multiple
//   useEffect(() => {
//     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedReparations, filteredReparations]);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Trouver le nom du technicien
//   const getTechnicienName = useCallback((reparation: any): string => {
//     if (!reparation) return '';
    
//     const possibleFields = [
//       'technicien_responsable',
//       'technicien',
//       'responsable', 
//       'technician',
//       'technician_responsable',
//       'responsible_technician',
//       'tech_responsable',
//       'nom_technicien',
//       'technicien_nom',
//       'technician_name',
//       'responsible',
//       'assigné_à',
//       'assigned_to'
//     ];
    
//     for (const field of possibleFields) {
//       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
//         return reparation[field];
//       }
//     }
    
//     return '';
//   }, []);

//   // Formater la devise en Ariary
//   const formatCurrency = useCallback((amount: number | string): string => {
//     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(numAmount)) return '0 Ar';
//     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
//   }, []);

//   // Formater les nombres
//   const formatNumber = useCallback((num: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(num);
//   }, []);

//   // Gérer la soumission d'une réparation
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       const currentUserName = getCurrentUserName();
//       const reparationDataAvecTechnicien = {
//         ...reparationData,
//         technicien_responsable: currentUserName
//       };
      
//       if (editingReparation) {
//         await reparationsAPI.update(editingReparation.id, reparationDataAvecTechnicien);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         await reparationsAPI.create(reparationDataAvecTechnicien);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde réparation:', error);
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'édition
//   const handleEdit = (reparation: Reparation) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   // Gérer la suppression
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer la fin de réparation
//   const handleTerminer = async (id: number) => {
//     try {
//       const currentUserName = getCurrentUserName();
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName
//       });
//       showMessage('success', 'Réparation marquée comme terminée');
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'ajout d'une nouvelle réparation
//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Aucune donnée de relation disponible.');
//       return;
//     }

//     setEditingReparation(undefined);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Gérer la suppression multiple
//   const handleDeleteSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer l'édition multiple
//   const handleEditSelected = () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (selectedReparations.length === 1) {
//       const reparation = reparations.find(r => r.id === selectedReparations[0]);
//       if (reparation) {
//         handleEdit(reparation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
//       setEditingReparation(undefined);
//       setIsFormOpen(true);
//     }
//   };

//   // Gérer la fin de réparation multiple
//   const handleTerminerSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       const currentUserName = getCurrentUserName();
//       await Promise.all(
//         selectedReparations.map(id => 
//           reparationsAPI.update(id, { 
//             date_fin: new Date().toISOString(),
//             technicien_responsable: currentUserName
//           })
//         )
//       );
      
//       showMessage('success', `${selectedReparations.length} réparation(s) marquée(s) comme terminées`);
//       setSelectedReparations([]);
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
//       showMessage('error', errorMessage);
//     }
//   };

//   // FONCTION AJOUTÉE : Exporter en CSV
//   const handleExport = useCallback(() => {
//     try {
//       const dataToExport = filteredReparations.map(reparation => ({
//         'Matériel': reparation.materiel_nom || 'Non spécifié',
//         'Type': getTypeText(reparation.type_reparation),
//         'Technicien': getTechnicienName(reparation) || 'Non assigné',
//         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
//         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
//         'Statut': getStatutText(reparation),
//         'Description': reparation.description || 'Aucune description'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export CSV:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   }, [filteredReparations, getTechnicienName]);

//   // Fonctions d'affichage
//   const getTypeBadge = (type: string) => {
//     const badges = {
//       preventive: 'badge-info',
//       corrective: 'badge-warning',
//       ameliorative: 'badge-success'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       preventive: 'Préventive',
//       corrective: 'Corrective',
//       ameliorative: 'Améliorative'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     const icons = {
//       preventive: <Wrench className="h-4 w-4" />,
//       corrective: <Wrench className="h-4 w-4" />,
//       ameliorative: <CheckCircle className="h-4 w-4" />
//     };
//     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
//   };

//   const isEnCours = (reparation: Reparation) => {
//     return !reparation.date_fin;
//   };

//   const getStatutBadge = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'En cours' : 'Terminée';
//   };

//   const getStatutIcon = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 
//       <Calendar className="h-4 w-4" /> : 
//       <CheckCircle className="h-4 w-4" />;
//   };

//   // Obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedReparations([]);
//   };

//   // Rendre la section statistiques
//   const renderStatistiquesSection = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {/* Carte Total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
//               <p className="text-sm opacity-60">Total réparations</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Package className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span className="text-success">{statistiques.terminees} terminées</span>
//             <span className="mx-2">•</span>
//             <span className="text-warning">{statistiques.enCours} en cours</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
//               <p className="text-sm opacity-60">Coût total</p>
//             </div>
//             <div className="p-2 bg-purple-500/10 rounded-lg">
//               <DollarSign className="h-6 w-6 text-purple-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût ce mois */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
//               <p className="text-sm opacity-60">Coût ce mois</p>
//             </div>
//             <div className="p-2 bg-blue-500/10 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-blue-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Durée moyenne */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
//               <p className="text-sm opacity-60">Jours moyen</p>
//             </div>
//             <div className="p-2 bg-green-500/10 rounded-lg">
//               <Clock className="h-6 w-6 text-green-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} réparations terminées</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Taux de complétion */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">
//                 {statistiques.total > 0 
//                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                   : '0%'
//                 }
//               </h3>
//               <p className="text-sm opacity-60">Taux de complétion</p>
//             </div>
//             <div className="p-2 bg-orange-500/10 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} / {statistiques.total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredReparations.length} réparation(s) trouvée(s)
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {getCurrentUserName()}
//             </span>
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle réparation
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques détaillées */}
//       {renderStatistiquesSection()}

//       {/* Section Utilisateur actuel */}
//       <div className="mb-6">
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Users className="h-5 w-5 text-success" />
//                 <div>
//                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
//                   <p className="text-sm">
//                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
//                   </p>
//                   <p className="text-xs text-success opacity-70 mt-1">
//                     Ce nom sera automatiquement utilisé comme "technicien responsable" lorsque vous créez ou modifiez une réparation.
//                   </p>
//                 </div>
//               </div>
//               <div className="badge badge-success badge-lg">
//                 Connecté
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section Top Techniciens */}
//       {statistiques.topTechniciens.length > 0 && (
//         <div className="mb-6">
//           <div className="card bg-base-200 shadow-sm">
//             <div className="card-body p-4">
//               <h3 className="font-bold text-base-content mb-3">🏆 Top Techniciens</h3>
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                 {statistiques.topTechniciens.map((tech, index) => (
//                   <div key={index} className="bg-base-100 p-3 rounded-lg">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-sm truncate">{tech.technicien}</span>
//                       <span className="badge badge-primary badge-sm">{tech.count}</span>
//                     </div>
//                     <div className="text-xs opacity-70">
//                       Coût: {formatCurrency(tech.cout)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

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
//                   placeholder="Matériel, technicien..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🛠️ Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
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
//                 <option value="en_cours">En cours</option>
//                 <option value="terminee">Terminée</option>
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
//           </div>

//           {/* Actions de sélection */}
//           {selectedReparations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedReparations.length} réparation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
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

//       {/* Tableau des réparations */}
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
//                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Technicien</th>
//                   <th className="font-bold">Date début</th>
//                   <th className="font-bold">Date fin</th>
//                   <th className="font-bold">Coût</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredReparations).map((reparation) => {
//                   const technicien = getTechnicienName(reparation);
//                   const isCurrentUser = technicien === getCurrentUserName();
                  
//                   return (
//                     <tr key={reparation.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedReparations.includes(reparation.id)}
//                             onChange={() => toggleSelectReparation(reparation.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {reparation.materiel_nom}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
//                           {getTypeIcon(reparation.type_reparation)}
//                           {getTypeText(reparation.type_reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {technicien ? (
//                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
//                               <span>{technicien}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-base-content opacity-50">Non assigné</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm">
//                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                       </td>
//                       <td>
//                         {reparation.date_fin ? (
//                           <span className="text-sm">
//                             {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
//                           </span>
//                         ) : (
//                           <div className="badge badge-warning badge-sm">En cours</div>
//                         )}
//                       </td>
//                       <td>
//                         {reparation.cout ? (
//                           <span className="font-semibold text-green-600 text-sm">
//                             {reparation.cout.toLocaleString('fr-FR')} Ar
//                           </span>
//                         ) : (
//                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
//                           {getStatutIcon(reparation)}
//                           {getStatutText(reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(reparation)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {isEnCours(reparation) && (
//                             <button
//                               onClick={() => handleTerminer(reparation.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Terminer la réparation"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(reparation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredReparations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Wrench className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType || filterStatut
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune réparation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//       />
//     </div>
//   );
// };

// export default Reparations;




// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Reparation[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // Type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// // Type pour les statistiques
// interface StatistiquesReparations {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
//   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // Statistiques détaillées
//   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParMois: [],
//     topTechniciens: []
//   });

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     if (user.nom_complet) return user.nom_complet;
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user.name) return user.name;
//     if (user.username) return user.username;
    
//     return 'Utilisateur';
//   }, [user]);

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Calculs de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => 
//       r.date_debut && new Date(r.date_debut) >= debutMois
//     );
    
//     // Calcul des coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
//     // Calcul du coût moyen
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Calcul de la durée moyenne des réparations terminées
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         try {
//           const dateDebut = new Date(rep.date_debut);
//           const dateFin = new Date(rep.date_fin);
//           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
//             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
//             dureeTotale += duree;
//             reparationsAvecDuree++;
//           }
//         } catch (e) {
//           console.warn('Erreur calcul durée:', e);
//         }
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     const moisActuel = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         try {
//           const date = new Date(rep.date_debut);
//           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
//           if (reparationsParMoisMap[moisKey]) {
//             reparationsParMoisMap[moisKey].count++;
//             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
//           }
//         } catch (e) {
//           console.warn('Erreur date réparation:', e);
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
//     data.forEach(rep => {
//       const technicien = getTechnicienName(rep) || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
//       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des réparations...');
      
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log('✅ Réparations chargées:', extractedData.length);
      
//       setReparations(extractedData);
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des réparations';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);

//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Charger toutes les données au montage
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Filtrer les réparations
//   useEffect(() => {
//     let filtered = safeArray(reparations);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter(filtered, reparation => {
//         const technicien = getTechnicienName(reparation).toLowerCase();
//         return (
//           reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
//           reparation.description?.toLowerCase().includes(searchLower) ||
//           technicien.includes(searchLower)
//         );
//       });
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
//     }

//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = safeFilter(filtered, reparation => reparation.date_fin);
//       }
//     }

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut]);

//   // Gérer la sélection multiple
//   useEffect(() => {
//     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedReparations, filteredReparations]);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Trouver le nom du technicien
//   const getTechnicienName = useCallback((reparation: any): string => {
//     if (!reparation) return '';
    
//     const possibleFields = [
//       'technicien_responsable',
//       'technicien',
//       'responsable', 
//       'technician',
//       'technician_responsable',
//       'responsible_technician',
//       'tech_responsable',
//       'nom_technicien',
//       'technicien_nom',
//       'technician_name',
//       'responsible',
//       'assigné_à',
//       'assigned_to'
//     ];
    
//     for (const field of possibleFields) {
//       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
//         return reparation[field];
//       }
//     }
    
//     return '';
//   }, []);

//   // Formater la devise en Ariary
//   const formatCurrency = useCallback((amount: number | string): string => {
//     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(numAmount)) return '0 Ar';
//     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
//   }, []);

//   // Formater les nombres
//   const formatNumber = useCallback((num: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(num);
//   }, []);

//   // Gérer la soumission d'une réparation
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       const currentUserName = getCurrentUserName();
//       console.log('👤 Technicien automatique (depuis parent):', currentUserName);
      
//       // Le formulaire a déjà ajouté le technicien, mais on s'assure qu'il est correct
//       const reparationDataAvecTechnicien = {
//         ...reparationData,
//         technicien_responsable: currentUserName
//       };
      
//       if (editingReparation) {
//         console.log('📝 Modification réparation avec technicien:', currentUserName);
//         await reparationsAPI.update(editingReparation.id, reparationDataAvecTechnicien);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         console.log('➕ Création réparation avec technicien:', currentUserName);
//         await reparationsAPI.create(reparationDataAvecTechnicien);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde réparation:', error);
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'édition
//   const handleEdit = (reparation: Reparation) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   // Gérer la suppression
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer la fin de réparation
//   const handleTerminer = async (id: number) => {
//     try {
//       const currentUserName = getCurrentUserName();
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName
//       });
//       showMessage('success', 'Réparation marquée comme terminée');
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'ajout d'une nouvelle réparation
//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Aucune donnée de relation disponible.');
//       return;
//     }

//     setEditingReparation(undefined);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Gérer la suppression multiple
//   const handleDeleteSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer l'édition multiple
//   const handleEditSelected = () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (selectedReparations.length === 1) {
//       const reparation = reparations.find(r => r.id === selectedReparations[0]);
//       if (reparation) {
//         handleEdit(reparation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
//       setEditingReparation(undefined);
//       setIsFormOpen(true);
//     }
//   };

//   // Gérer la fin de réparation multiple
//   const handleTerminerSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       const currentUserName = getCurrentUserName();
//       await Promise.all(
//         selectedReparations.map(id => 
//           reparationsAPI.update(id, { 
//             date_fin: new Date().toISOString(),
//             technicien_responsable: currentUserName
//           })
//         )
//       );
      
//       showMessage('success', `${selectedReparations.length} réparation(s) marquée(s) comme terminées`);
//       setSelectedReparations([]);
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Exporter en CSV
//   const handleExport = useCallback(() => {
//     try {
//       const dataToExport = filteredReparations.map(reparation => ({
//         'Matériel': reparation.materiel_nom || 'Non spécifié',
//         'Type': getTypeText(reparation.type_reparation),
//         'Technicien': getTechnicienName(reparation) || 'Non assigné',
//         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
//         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
//         'Statut': getStatutText(reparation),
//         'Description': reparation.description || 'Aucune description'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export CSV:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   }, [filteredReparations, getTechnicienName]);

//   // Fonctions d'affichage
//   const getTypeBadge = (type: string) => {
//     const badges = {
//       preventive: 'badge-info',
//       corrective: 'badge-warning',
//       ameliorative: 'badge-success'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       preventive: 'Préventive',
//       corrective: 'Corrective',
//       ameliorative: 'Améliorative'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     const icons = {
//       preventive: <Wrench className="h-4 w-4" />,
//       corrective: <Wrench className="h-4 w-4" />,
//       ameliorative: <CheckCircle className="h-4 w-4" />
//     };
//     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
//   };

//   const isEnCours = (reparation: Reparation) => {
//     return !reparation.date_fin;
//   };

//   const getStatutBadge = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'En cours' : 'Terminée';
//   };

//   const getStatutIcon = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 
//       <Calendar className="h-4 w-4" /> : 
//       <CheckCircle className="h-4 w-4" />;
//   };

//   // Obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedReparations([]);
//   };

//   // Rendre la section statistiques
//   const renderStatistiquesSection = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {/* Carte Total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
//               <p className="text-sm opacity-60">Total réparations</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Package className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span className="text-success">{statistiques.terminees} terminées</span>
//             <span className="mx-2">•</span>
//             <span className="text-warning">{statistiques.enCours} en cours</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
//               <p className="text-sm opacity-60">Coût total</p>
//             </div>
//             <div className="p-2 bg-purple-500/10 rounded-lg">
//               <DollarSign className="h-6 w-6 text-purple-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût ce mois */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
//               <p className="text-sm opacity-60">Coût ce mois</p>
//             </div>
//             <div className="p-2 bg-blue-500/10 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-blue-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Durée moyenne */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
//               <p className="text-sm opacity-60">Jours moyen</p>
//             </div>
//             <div className="p-2 bg-green-500/10 rounded-lg">
//               <Clock className="h-6 w-6 text-green-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} réparations terminées</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Taux de complétion */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">
//                 {statistiques.total > 0 
//                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                   : '0%'
//                 }
//               </h3>
//               <p className="text-sm opacity-60">Taux de complétion</p>
//             </div>
//             <div className="p-2 bg-orange-500/10 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} / {statistiques.total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredReparations.length} réparation(s) trouvée(s)
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {getCurrentUserName()}
//             </span>
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle réparation
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques détaillées */}
//       {renderStatistiquesSection()}

//       {/* Section Utilisateur actuel */}
//       <div className="mb-6">
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Users className="h-5 w-5 text-success" />
//                 <div>
//                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
//                   <p className="text-sm">
//                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
//                   </p>
//                   <p className="text-xs text-success opacity-70 mt-1">
//                     Ce nom sera automatiquement utilisé comme "technicien responsable" lorsque vous créez ou modifiez une réparation.
//                   </p>
//                 </div>
//               </div>
//               <div className="badge badge-success badge-lg">
//                 Connecté
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section Top Techniciens */}
//       {statistiques.topTechniciens.length > 0 && (
//         <div className="mb-6">
//           <div className="card bg-base-200 shadow-sm">
//             <div className="card-body p-4">
//               <h3 className="font-bold text-base-content mb-3">🏆 Top Techniciens</h3>
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                 {statistiques.topTechniciens.map((tech, index) => (
//                   <div key={index} className="bg-base-100 p-3 rounded-lg">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-sm truncate">{tech.technicien}</span>
//                       <span className="badge badge-primary badge-sm">{tech.count}</span>
//                     </div>
//                     <div className="text-xs opacity-70">
//                       Coût: {formatCurrency(tech.cout)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

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
//                   placeholder="Matériel, technicien..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🛠️ Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
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
//                 <option value="en_cours">En cours</option>
//                 <option value="terminee">Terminée</option>
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
//           </div>

//           {/* Actions de sélection */}
//           {selectedReparations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedReparations.length} réparation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
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

//       {/* Tableau des réparations */}
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
//                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Technicien</th>
//                   <th className="font-bold">Date début</th>
//                   <th className="font-bold">Date fin</th>
//                   <th className="font-bold">Coût</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredReparations).map((reparation) => {
//                   const technicien = getTechnicienName(reparation);
//                   const isCurrentUser = technicien === getCurrentUserName();
                  
//                   return (
//                     <tr key={reparation.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedReparations.includes(reparation.id)}
//                             onChange={() => toggleSelectReparation(reparation.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {reparation.materiel_nom}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
//                           {getTypeIcon(reparation.type_reparation)}
//                           {getTypeText(reparation.type_reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {technicien ? (
//                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
//                               <span>{technicien}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-base-content opacity-50">Non assigné</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm">
//                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                       </td>
//                       <td>
//                         {reparation.date_fin ? (
//                           <span className="text-sm">
//                             {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
//                           </span>
//                         ) : (
//                           <div className="badge badge-warning badge-sm">En cours</div>
//                         )}
//                       </td>
//                       <td>
//                         {reparation.cout ? (
//                           <span className="font-semibold text-green-600 text-sm">
//                             {reparation.cout.toLocaleString('fr-FR')} Ar
//                           </span>
//                         ) : (
//                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
//                           {getStatutIcon(reparation)}
//                           {getStatutText(reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(reparation)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {isEnCours(reparation) && (
//                             <button
//                               onClick={() => handleTerminer(reparation.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Terminer la réparation"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(reparation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredReparations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Wrench className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType || filterStatut
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune réparation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()} // PASSER le nom de l'utilisateur
//       />
//     </div>
//   );
// };

// export default Reparations;




// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm.tsx';
// import { useAuth } from '../context/AuthContext';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Reparation[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // Type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// // Type pour les statistiques
// interface StatistiquesReparations {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
//   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // Statistiques détaillées
//   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParMois: [],
//     topTechniciens: []
//   });

//   // Récupérer le nom de l'utilisateur connecté - FORMAT IDENTIQUE AU BACKEND
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return '';
    
//     // FORMAT EXACTEMENT COMME LE BACKEND (ReparationViewSet.perform_create)
//     let nom_complet = '';
    
//     if (user.first_name || user.last_name) {
//       nom_complet = `${user.first_name || ''} ${user.last_name || ''}`.trim();
//     }
    
//     if (!nom_complet && user.username) {
//       nom_complet = user.username;
//     }
    
//     if (!nom_complet && user.nom_complet) {
//       nom_complet = user.nom_complet;
//     }
    
//     if (!nom_complet && user.name) {
//       nom_complet = user.name;
//     }
    
//     if (!nom_complet) {
//       nom_complet = 'Utilisateur Inconnu';
//     }
    
//     return nom_complet;
//   }, [user]);

//   // Trouver le nom du technicien - PRIORITÉ AU CHAMP BACKEND
//   const getTechnicienName = useCallback((reparation: any): string => {
//     if (!reparation) return '';
    
//     // PRIORITÉ ABSOLUE : technicien_responsable (nom exact du backend)
//     if (reparation.technicien_responsable && typeof reparation.technicien_responsable === 'string' && reparation.technicien_responsable.trim() !== '') {
//       return reparation.technicien_responsable;
//     }
    
//     // Fallback sur d'autres champs possibles (pour compatibilité)
//     const fallbackFields = [
//       'technicien',
//       'responsable', 
//       'technician',
//       'technician_responsable',
//       'responsible_technician',
//       'tech_responsable',
//       'nom_technicien',
//       'technicien_nom',
//       'technician_name',
//       'responsible',
//       'assigné_à',
//       'assigned_to'
//     ];
    
//     for (const field of fallbackFields) {
//       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
//         return reparation[field];
//       }
//     }
    
//     return '';
//   }, []);

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Calculs de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => 
//       r.date_debut && new Date(r.date_debut) >= debutMois
//     );
    
//     // Calcul des coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
//     // Calcul du coût moyen
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Calcul de la durée moyenne des réparations terminées
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         try {
//           const dateDebut = new Date(rep.date_debut);
//           const dateFin = new Date(rep.date_fin);
//           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
//             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
//             dureeTotale += duree;
//             reparationsAvecDuree++;
//           }
//         } catch (e) {
//           console.warn('Erreur calcul durée:', e);
//         }
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     const moisActuel = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         try {
//           const date = new Date(rep.date_debut);
//           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
//           if (reparationsParMoisMap[moisKey]) {
//             reparationsParMoisMap[moisKey].count++;
//             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
//           }
//         } catch (e) {
//           console.warn('Erreur date réparation:', e);
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens (utilise technicien_responsable directement)
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
//     data.forEach(rep => {
//       const technicien = rep.technicien_responsable || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
//       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des réparations...');
      
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log('✅ Réparations chargées:', extractedData.length);
//       console.log('👷 Exemple technicien:', extractedData[0]?.technicien_responsable);
      
//       setReparations(extractedData);
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des réparations';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);

//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Charger toutes les données au montage
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Filtrer les réparations
//   useEffect(() => {
//     let filtered = safeArray(reparations);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter(filtered, reparation => {
//         const technicien = (reparation.technicien_responsable || '').toLowerCase();
//         return (
//           (reparation.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
//           (reparation.description?.toLowerCase() || '').includes(searchLower) ||
//           technicien.includes(searchLower)
//         );
//       });
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
//     }

//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = safeFilter(filtered, reparation => reparation.date_fin);
//       }
//     }

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut]);

//   // Gérer la sélection multiple
//   useEffect(() => {
//     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedReparations, filteredReparations]);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Formater la devise en Ariary
//   const formatCurrency = useCallback((amount: number | string): string => {
//     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(numAmount)) return '0 Ar';
//     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
//   }, []);

//   // Formater les nombres
//   const formatNumber = useCallback((num: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(num);
//   }, []);

//   // Gérer la soumission d'une réparation
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       const currentUserName = getCurrentUserName();
//       console.log('👤 Technicien automatique:', currentUserName);
      
//       // Créer l'objet avec le nom exact du champ backend
//       const reparationDataAvecTechnicien = {
//         ...reparationData,
//         technicien_responsable: currentUserName // NOM EXACT DU CHAMP
//       };
      
//       console.log('📤 Données envoyées:', reparationDataAvecTechnicien);
      
//       if (editingReparation) {
//         console.log('📝 Modification réparation avec technicien:', currentUserName);
//         await reparationsAPI.update(editingReparation.id, reparationDataAvecTechnicien);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         console.log('➕ Création réparation avec technicien:', currentUserName);
//         await reparationsAPI.create(reparationDataAvecTechnicien);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde réparation:', error);
//       console.error('📋 Réponse erreur:', error.response?.data);
//       const errorMessage = error.response?.data?.message || 
//                          error.response?.data?.technicien_responsable || 
//                          'Erreur lors de la sauvegarde';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'édition
//   const handleEdit = (reparation: Reparation) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   // Gérer la suppression
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer la fin de réparation
//   const handleTerminer = async (id: number) => {
//     try {
//       const currentUserName = getCurrentUserName();
//       const updateData = { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName // NOM EXACT DU CHAMP
//       };
      
//       console.log('✅ Terminer réparation:', updateData);
      
//       await reparationsAPI.update(id, updateData);
//       showMessage('success', 'Réparation marquée comme terminée');
//       fetchReparations();
//     } catch (error: any) {
//       console.error('❌ Erreur fin réparation:', error);
//       const errorMessage = error.response?.data?.message || 
//                          error.response?.data?.technicien_responsable || 
//                          'Erreur lors de la finalisation de la réparation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'ajout d'une nouvelle réparation
//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Aucune donnée de relation disponible.');
//       return;
//     }

//     setEditingReparation(undefined);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Gérer la suppression multiple
//   const handleDeleteSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer l'édition multiple
//   const handleEditSelected = () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (selectedReparations.length === 1) {
//       const reparation = reparations.find(r => r.id === selectedReparations[0]);
//       if (reparation) {
//         handleEdit(reparation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
//       setEditingReparation(undefined);
//       setIsFormOpen(true);
//     }
//   };

//   // Gérer la fin de réparation multiple
//   const handleTerminerSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       const currentUserName = getCurrentUserName();
//       const updateData = { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName
//       };
      
//       await Promise.all(
//         selectedReparations.map(id => reparationsAPI.update(id, updateData))
//       );
      
//       showMessage('success', `${selectedReparations.length} réparation(s) marquée(s) comme terminées`);
//       setSelectedReparations([]);
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Exporter en CSV
//   const handleExport = useCallback(() => {
//     try {
//       const dataToExport = filteredReparations.map(reparation => ({
//         'Matériel': reparation.materiel_nom || 'Non spécifié',
//         'Type': getTypeText(reparation.type_reparation),
//         'Technicien': reparation.technicien_responsable || 'Non assigné', // Utilise le champ direct
//         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
//         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
//         'Statut': getStatutText(reparation),
//         'Description': reparation.description || 'Aucune description'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export CSV:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   }, [filteredReparations]);

//   // Fonctions d'affichage
//   const getTypeBadge = (type: string) => {
//     const badges = {
//       preventive: 'badge-info',
//       corrective: 'badge-warning',
//       ameliorative: 'badge-success'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       preventive: 'Préventive',
//       corrective: 'Corrective',
//       ameliorative: 'Améliorative'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     const icons = {
//       preventive: <Wrench className="h-4 w-4" />,
//       corrective: <Wrench className="h-4 w-4" />,
//       ameliorative: <CheckCircle className="h-4 w-4" />
//     };
//     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
//   };

//   const isEnCours = (reparation: Reparation) => {
//     return !reparation.date_fin;
//   };

//   const getStatutBadge = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'En cours' : 'Terminée';
//   };

//   const getStatutIcon = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 
//       <Calendar className="h-4 w-4" /> : 
//       <CheckCircle className="h-4 w-4" />;
//   };

//   // Obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedReparations([]);
//   };

//   // Rendre la section statistiques
//   const renderStatistiquesSection = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {/* Carte Total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
//               <p className="text-sm opacity-60">Total réparations</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Package className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span className="text-success">{statistiques.terminees} terminées</span>
//             <span className="mx-2">•</span>
//             <span className="text-warning">{statistiques.enCours} en cours</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
//               <p className="text-sm opacity-60">Coût total</p>
//             </div>
//             <div className="p-2 bg-purple-500/10 rounded-lg">
//               <DollarSign className="h-6 w-6 text-purple-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût ce mois */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
//               <p className="text-sm opacity-60">Coût ce mois</p>
//             </div>
//             <div className="p-2 bg-blue-500/10 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-blue-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Durée moyenne */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
//               <p className="text-sm opacity-60">Jours moyen</p>
//             </div>
//             <div className="p-2 bg-green-500/10 rounded-lg">
//               <Clock className="h-6 w-6 text-green-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} réparations terminées</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Taux de complétion */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">
//                 {statistiques.total > 0 
//                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                   : '0%'
//                 }
//               </h3>
//               <p className="text-sm opacity-60">Taux de complétion</p>
//             </div>
//             <div className="p-2 bg-orange-500/10 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} / {statistiques.total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredReparations.length} réparation(s) trouvée(s)
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {getCurrentUserName()}
//             </span>
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle réparation
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques détaillées */}
//       {renderStatistiquesSection()}

//       {/* Section Utilisateur actuel */}
//       <div className="mb-6">
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Users className="h-5 w-5 text-success" />
//                 <div>
//                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
//                   <p className="text-sm">
//                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
//                   </p>
//                   <p className="text-xs text-success opacity-70 mt-1">
//                     Ce nom sera automatiquement utilisé comme <span className="font-bold">"technicien_responsable"</span> lorsque vous créez ou modifiez une réparation.
//                   </p>
//                 </div>
//               </div>
//               <div className="badge badge-success badge-lg">
//                 Connecté
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section Top Techniciens */}
//       {statistiques.topTechniciens.length > 0 && (
//         <div className="mb-6">
//           <div className="card bg-base-200 shadow-sm">
//             <div className="card-body p-4">
//               <h3 className="font-bold text-base-content mb-3">🏆 Top Techniciens</h3>
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                 {statistiques.topTechniciens.map((tech, index) => (
//                   <div key={index} className="bg-base-100 p-3 rounded-lg">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-sm truncate">{tech.technicien}</span>
//                       <span className="badge badge-primary badge-sm">{tech.count}</span>
//                     </div>
//                     <div className="text-xs opacity-70">
//                       Coût: {formatCurrency(tech.cout)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

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
//                   placeholder="Matériel, technicien..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🛠️ Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
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
//                 <option value="en_cours">En cours</option>
//                 <option value="terminee">Terminée</option>
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
//           </div>

//           {/* Actions de sélection */}
//           {selectedReparations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedReparations.length} réparation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
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

//       {/* Tableau des réparations */}
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
//                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Technicien</th>
//                   <th className="font-bold">Date début</th>
//                   <th className="font-bold">Date fin</th>
//                   <th className="font-bold">Coût</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredReparations).map((reparation) => {
//                   const technicien = reparation.technicien_responsable; // Utilise directement le champ du backend
//                   const isCurrentUser = technicien === getCurrentUserName();
                  
//                   return (
//                     <tr key={reparation.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedReparations.includes(reparation.id)}
//                             onChange={() => toggleSelectReparation(reparation.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {reparation.materiel_nom || 'Non spécifié'}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
//                           {getTypeIcon(reparation.type_reparation)}
//                           {getTypeText(reparation.type_reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {technicien ? (
//                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
//                               <span className={isCurrentUser ? 'font-bold' : ''}>{technicien}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-base-content opacity-50">Non assigné</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm">
//                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                       </td>
//                       <td>
//                         {reparation.date_fin ? (
//                           <span className="text-sm">
//                             {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
//                           </span>
//                         ) : (
//                           <div className="badge badge-warning badge-sm">En cours</div>
//                         )}
//                       </td>
//                       <td>
//                         {reparation.cout ? (
//                           <span className="font-semibold text-green-600 text-sm">
//                             {reparation.cout.toLocaleString('fr-FR')} Ar
//                           </span>
//                         ) : (
//                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
//                           {getStatutIcon(reparation)}
//                           {getStatutText(reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(reparation)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {isEnCours(reparation) && (
//                             <button
//                               onClick={() => handleTerminer(reparation.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Terminer la réparation"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(reparation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredReparations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Wrench className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType || filterStatut
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune réparation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()} // PASSER le nom de l'utilisateur
//       />
//     </div>
//   );
// };

// export default Reparations;




// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   Plus, Search, Filter, Edit, Trash2, CheckCircle, Wrench, 
//   Calendar, CheckSquare, Square, X, Download, Users, 
//   TrendingUp, DollarSign, Clock, Package, BarChart3, 
//   AlertTriangle, RefreshCw, Eye, FileText, Printer, ChevronDown,
//   ChevronUp, SortAsc, SortDesc, Filter as FilterIcon
// } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Types
// type MessageType = 'success' | 'error' | 'info' | 'warning';
// type SortField = 'date_debut' | 'date_fin' | 'cout' | 'technicien_responsable' | 'type_reparation';
// type SortDirection = 'asc' | 'desc';

// interface Statistiques {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParType: {
//     preventive: number;
//     corrective: number;
//     ameliorative: number;
//   };
//   reparationsParMois: Array<{
//     mois: string;
//     count: number;
//     cout: number;
//   }>;
//   topTechniciens: Array<{
//     technicien: string;
//     count: number;
//     cout: number;
//   }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   // États principaux
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
  
//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
  
//   // États pour les statistiques
//   const [statistiques, setStatistiques] = useState<Statistiques>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParType: {
//       preventive: 0,
//       corrective: 0,
//       ameliorative: 0
//     },
//     reparationsParMois: [],
//     topTechniciens: []
//   });
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterTechnicien, setFilterTechnicien] = useState<string>('');
//   const [filterMateriel, setFilterMateriel] = useState<string>('');
  
//   // États pour le tri
//   const [sortField, setSortField] = useState<SortField>('date_debut');
//   const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
//   // États pour la sélection multiple
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les options déroulantes
//   const [showFilters, setShowFilters] = useState<boolean>(false);
//   const [showStats, setShowStats] = useState<boolean>(true);

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user.nom_complet) return user.nom_complet;
//     if (user.username) return user.username;
    
//     return 'Utilisateur';
//   }, [user]);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       console.log('🔄 Chargement des réparations...');
//       const response = await reparationsAPI.getAll();
//       const data = response.data || [];
      
//       console.log(`✅ ${data.length} réparations chargées`);
//       setReparations(data);
      
//       // Calculer les statistiques
//       calculerStatistiques(data);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll(),
//         incidentsAPI.getAll()
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' ? materielsResponse.value.data : [];
//       const incidentsData = incidentsResponse.status === 'fulfilled' ? incidentsResponse.value.data : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//     }
//   };

//   // Calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParType: { preventive: 0, corrective: 0, ameliorative: 0 },
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Statistiques de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => {
//       if (!r.date_debut) return false;
//       const dateDebut = new Date(r.date_debut);
//       return dateDebut >= debutMois;
//     });
    
//     // Coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (rep.cout || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (rep.cout || 0), 0);
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Durée moyenne
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         const dateDebut = new Date(rep.date_debut);
//         const dateFin = new Date(rep.date_fin);
//         const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24);
//         dureeTotale += duree;
//         reparationsAvecDuree++;
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par type
//     const reparationsParType = {
//       preventive: data.filter(r => r.type_reparation === 'preventive').length,
//       corrective: data.filter(r => r.type_reparation === 'corrective').length,
//       ameliorative: data.filter(r => r.type_reparation === 'ameliorative').length
//     };
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         const date = new Date(rep.date_debut);
//         const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//         if (reparationsParMoisMap[moisKey]) {
//           reparationsParMoisMap[moisKey].count++;
//           reparationsParMoisMap[moisKey].cout += rep.cout || 0;
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
//     data.forEach(rep => {
//       const technicien = rep.technicien_responsable || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += rep.cout || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen,
//       dureeMoyenne,
//       reparationsParType,
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Filtrer et trier les réparations
//   useEffect(() => {
//     let filtered = [...reparations];

//     // Filtre par recherche
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(reparation => 
//         reparation.description?.toLowerCase().includes(searchLower) ||
//         reparation.technicien_responsable?.toLowerCase().includes(searchLower) ||
//         reparation.materiel_nom?.toLowerCase().includes(searchLower)
//       );
//     }

//     // Filtre par type
//     if (filterType) {
//       filtered = filtered.filter(reparation => reparation.type_reparation === filterType);
//     }

//     // Filtre par statut
//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = filtered.filter(reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = filtered.filter(reparation => reparation.date_fin);
//       }
//     }

//     // Filtre par technicien
//     if (filterTechnicien) {
//       filtered = filtered.filter(reparation => 
//         reparation.technicien_responsable === filterTechnicien
//       );
//     }

//     // Tri
//     filtered.sort((a, b) => {
//       let aValue: any, bValue: any;
      
//       switch (sortField) {
//         case 'date_debut':
//           aValue = a.date_debut ? new Date(a.date_debut).getTime() : 0;
//           bValue = b.date_debut ? new Date(b.date_debut).getTime() : 0;
//           break;
//         case 'date_fin':
//           aValue = a.date_fin ? new Date(a.date_fin).getTime() : 0;
//           bValue = b.date_fin ? new Date(b.date_fin).getTime() : 0;
//           break;
//         case 'cout':
//           aValue = a.cout || 0;
//           bValue = b.cout || 0;
//           break;
//         case 'technicien_responsable':
//           aValue = a.technicien_responsable?.toLowerCase() || '';
//           bValue = b.technicien_responsable?.toLowerCase() || '';
//           break;
//         case 'type_reparation':
//           aValue = a.type_reparation || '';
//           bValue = b.type_reparation || '';
//           break;
//         default:
//           return 0;
//       }
      
//       if (sortDirection === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut, filterTechnicien, sortField, sortDirection]);

//   // Initialisation
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Formater la devise
//   const formatCurrency = useCallback((amount: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
//   }, []);

//   // Formater la date
//   const formatDate = useCallback((dateString?: string): string => {
//     if (!dateString) return '-';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR');
//     } catch {
//       return dateString;
//     }
//   }, []);

//   // Gestion du formulaire
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       if (editingReparation) {
//         await reparationsAPI.update(editingReparation.id, reparationData);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         await reparationsAPI.create(reparationData);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Actions sur les réparations
//   const handleEdit = (reparation: Reparation) => {
//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   const handleTerminer = async (id: number) => {
//     try {
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: getCurrentUserName()
//       });
//       showMessage('success', 'Réparation marquée comme terminée');
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Sélection multiple
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Actions sur la sélection multiple
//   const handleTerminerSelection = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       await Promise.all(
//         selectedReparations.map(id => 
//           reparationsAPI.update(id, { 
//             date_fin: new Date().toISOString(),
//             technicien_responsable: getCurrentUserName()
//           })
//         )
//       );
//       showMessage('success', `${selectedReparations.length} réparation(s) terminée(s)`);
//       setSelectedReparations([]);
//       fetchReparations();
//     } catch (error) {
//       showMessage('error', 'Erreur lors de la finalisation');
//     }
//   };

//   const handleDeleteSelection = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s)`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression');
//       }
//     }
//   };

//   // Export CSV
//   const handleExportCSV = () => {
//     const headers = [
//       'ID',
//       'Matériel',
//       'Description',
//       'Type',
//       'Technicien',
//       'Date début',
//       'Date fin',
//       'Coût (Ar)',
//       'Statut'
//     ];

//     const rows = filteredReparations.map(reparation => [
//       reparation.id,
//       reparation.materiel_nom || '',
//       reparation.description,
//       getTypeText(reparation.type_reparation),
//       reparation.technicien_responsable,
//       formatDate(reparation.date_debut),
//       formatDate(reparation.date_fin),
//       reparation.cout,
//       reparation.date_fin ? 'Terminée' : 'En cours'
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     showMessage('success', 'Export CSV réussi');
//   };

//   // Fonctions utilitaires
//   const getTypeText = (type: string) => {
//     switch (type) {
//       case 'preventive': return 'Préventive';
//       case 'corrective': return 'Corrective';
//       case 'ameliorative': return 'Améliorative';
//       default: return type;
//     }
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case 'preventive': return 'bg-blue-100 text-blue-800';
//       case 'corrective': return 'bg-orange-100 text-orange-800';
//       case 'ameliorative': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatutColor = (reparation: Reparation) => {
//     return reparation.date_fin 
//       ? 'bg-green-100 text-green-800' 
//       : 'bg-yellow-100 text-yellow-800';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return reparation.date_fin ? 'Terminée' : 'En cours';
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setFilterTechnicien('');
//     setSortField('date_debut');
//     setSortDirection('desc');
//     setSelectedReparations([]);
//   };

//   // Liste des techniciens uniques
//   const techniciens = [...new Set(reparations.map(r => r.technicien_responsable).filter(Boolean))];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-base-100 p-6">
//         <div className="flex flex-col items-center justify-center h-96">
//           <div className="loading loading-spinner loading-lg text-primary"></div>
//           <p className="mt-4 text-lg">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* En-tête */}
//       <div className="p-6 pb-0">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//             <div className="flex items-center gap-2 mt-2">
//               <div className="badge badge-primary">
//                 {filteredReparations.length} réparation(s)
//               </div>
//               <div className="badge badge-success">
//                 👤 {getCurrentUserName()}
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowStats(!showStats)}
//               className="btn btn-outline btn-sm"
//               title={showStats ? "Masquer statistiques" : "Afficher statistiques"}
//             >
//               <BarChart3 className="h-4 w-4" />
//             </button>
//             <button
//               onClick={handleExportCSV}
//               className="btn btn-outline btn-sm"
//               title="Exporter en CSV"
//             >
//               <Download className="h-4 w-4" />
//               Exporter
//             </button>
//             <button
//               onClick={fetchReparations}
//               className="btn btn-outline btn-sm"
//               title="Actualiser"
//             >
//               <RefreshCw className="h-4 w-4" />
//             </button>
//             <button
//               onClick={() => setIsFormOpen(true)}
//               className="btn btn-primary btn-sm"
//             >
//               <Plus className="h-4 w-4" />
//               Nouvelle réparation
//             </button>
//           </div>
//         </div>

//         {/* Message d'alerte */}
//         {message && (
//           <div className={`alert alert-${message.type} mt-4`}>
//             <span>{message.text}</span>
//           </div>
//         )}

//         {error && (
//           <div className="alert alert-error mt-4">
//             <AlertTriangle className="h-5 w-5" />
//             <span>{error}</span>
//           </div>
//         )}
//       </div>

//       {/* Section Statistiques (repliable) */}
//       {showStats && (
//         <div className="p-6 pt-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {/* Carte Totale */}
//             <div className="card bg-base-200 shadow-sm">
//               <div className="card-body p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-2xl font-bold">{statistiques.total}</div>
//                     <div className="text-sm opacity-70">Total réparations</div>
//                   </div>
//                   <div className="p-2 bg-primary/10 rounded-lg">
//                     <Package className="h-6 w-6 text-primary" />
//                   </div>
//                 </div>
//                 <div className="mt-2 text-xs flex gap-2">
//                   <span className="badge badge-success">{statistiques.terminees} terminées</span>
//                   <span className="badge badge-warning">{statistiques.enCours} en cours</span>
//                 </div>
//               </div>
//             </div>

//             {/* Carte Coûts */}
//             <div className="card bg-base-200 shadow-sm">
//               <div className="card-body p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-2xl font-bold">{formatCurrency(statistiques.coutTotal)}</div>
//                     <div className="text-sm opacity-70">Coût total</div>
//                   </div>
//                   <div className="p-2 bg-purple-500/10 rounded-lg">
//                     <DollarSign className="h-6 w-6 text-purple-500" />
//                   </div>
//                 </div>
//                 <div className="mt-2 text-xs">
//                   <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Carte Durée */}
//             <div className="card bg-base-200 shadow-sm">
//               <div className="card-body p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-2xl font-bold">{statistiques.dureeMoyenne.toFixed(1)}</div>
//                     <div className="text-sm opacity-70">Jours moyen</div>
//                   </div>
//                   <div className="p-2 bg-green-500/10 rounded-lg">
//                     <Clock className="h-6 w-6 text-green-500" />
//                   </div>
//                 </div>
//                 <div className="mt-2 text-xs">
//                   <span>{statistiques.terminees} réparations terminées</span>
//                 </div>
//               </div>
//             </div>

//             {/* Carte Taux */}
//             <div className="card bg-base-200 shadow-sm">
//               <div className="card-body p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-2xl font-bold">
//                       {statistiques.total > 0 
//                         ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                         : '0%'}
//                     </div>
//                     <div className="text-sm opacity-70">Taux de complétion</div>
//                   </div>
//                   <div className="p-2 bg-orange-500/10 rounded-lg">
//                     <TrendingUp className="h-6 w-6 text-orange-500" />
//                   </div>
//                 </div>
//                 <div className="mt-2 text-xs">
//                   <span>{statistiques.terminees} / {statistiques.total}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Graphiques et détails */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Réparations par type */}
//             <div className="card bg-base-200">
//               <div className="card-body">
//                 <h3 className="card-title text-lg">📊 Réparations par type</h3>
//                 <div className="space-y-3 mt-4">
//                   <div className="flex justify-between items-center">
//                     <span className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded"></div>
//                       <span>Préventive</span>
//                     </span>
//                     <span className="font-bold">{statistiques.reparationsParType.preventive}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-orange-500 rounded"></div>
//                       <span>Corrective</span>
//                     </span>
//                     <span className="font-bold">{statistiques.reparationsParType.corrective}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded"></div>
//                       <span>Améliorative</span>
//                     </span>
//                     <span className="font-bold">{statistiques.reparationsParType.ameliorative}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Top techniciens */}
//             <div className="card bg-base-200">
//               <div className="card-body">
//                 <h3 className="card-title text-lg">🏆 Top Techniciens</h3>
//                 <div className="space-y-3 mt-4">
//                   {statistiques.topTechniciens.map((tech, index) => (
//                     <div key={tech.technicien} className="flex justify-between items-center">
//                       <div className="flex items-center gap-2">
//                         <div className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-xs font-bold">
//                           {index + 1}
//                         </div>
//                         <span className="truncate max-w-[120px]">{tech.technicien}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="badge badge-primary badge-sm">{tech.count}</span>
//                         <span className="text-xs opacity-70">{formatCurrency(tech.cout)}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Réparations par mois */}
//             <div className="card bg-base-200">
//               <div className="card-body">
//                 <h3 className="card-title text-lg">📅 Réparations par mois</h3>
//                 <div className="space-y-3 mt-4 max-h-48 overflow-y-auto">
//                   {statistiques.reparationsParMois.map((item) => (
//                     <div key={item.mois} className="flex justify-between items-center">
//                       <span>{item.mois}</span>
//                       <div className="flex items-center gap-3">
//                         <span className="badge badge-outline badge-sm">{item.count}</span>
//                         <span className="text-xs font-medium">{formatCurrency(item.cout)}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filtres et recherche */}
//       <div className="p-6 pt-4">
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="btn btn-sm btn-outline flex items-center gap-2"
//               >
//                 <FilterIcon className="h-4 w-4" />
//                 {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
//                 {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//               </button>
              
//               <div className="relative flex-1 max-w-md">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Rechercher par description, technicien ou matériel..."
//                   className="input input-bordered w-full pl-10"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               {selectedReparations.length > 0 && (
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelection}
//                     className="btn btn-success btn-sm"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelection}
//                     className="btn btn-error btn-sm"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
//                     className="btn btn-ghost btn-sm"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Filtres détaillés */}
//             {showFilters && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-base-300">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Type de réparation</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={filterType}
//                     onChange={(e) => setFilterType(e.target.value)}
//                   >
//                     <option value="">Tous les types</option>
//                     <option value="preventive">Préventive</option>
//                     <option value="corrective">Corrective</option>
//                     <option value="ameliorative">Améliorative</option>
//                   </select>
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Statut</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={filterStatut}
//                     onChange={(e) => setFilterStatut(e.target.value)}
//                   >
//                     <option value="">Tous les statuts</option>
//                     <option value="en_cours">En cours</option>
//                     <option value="terminee">Terminée</option>
//                   </select>
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Technicien</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={filterTechnicien}
//                     onChange={(e) => setFilterTechnicien(e.target.value)}
//                   >
//                     <option value="">Tous les techniciens</option>
//                     {techniciens.map(tech => (
//                       <option key={tech} value={tech}>{tech}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Actions</span>
//                   </label>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={resetFilters}
//                       className="btn btn-outline flex-1"
//                     >
//                       <X className="h-4 w-4" />
//                       Réinitialiser
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Tableau des réparations */}
//       <div className="p-6 pt-0">
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-0">
//             <div className="overflow-x-auto">
//               <table className="table table-zebra w-full">
//                 <thead>
//                   <tr className="bg-base-300">
//                     <th className="w-12 text-center">
//                       <div className="flex justify-center">
//                         <button
//                           onClick={toggleSelectAll}
//                           className="btn btn-ghost btn-xs"
//                           title={isSelectAll ? "Désélectionner tout" : "Sélectionner tout"}
//                         >
//                           {isSelectAll ? (
//                             <CheckSquare className="h-5 w-5 text-primary" />
//                           ) : (
//                             <Square className="h-5 w-5 text-base-content/40" />
//                           )}
//                         </button>
//                       </div>
//                     </th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'date_debut') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('date_debut');
//                             setSortDirection('desc');
//                           }
//                         }}
//                       >
//                         Date début
//                         {sortField === 'date_debut' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th className="font-bold">Matériel</th>
//                     <th className="font-bold">Description</th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'type_reparation') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('type_reparation');
//                             setSortDirection('asc');
//                           }
//                         }}
//                       >
//                         Type
//                         {sortField === 'type_reparation' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'technicien_responsable') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('technicien_responsable');
//                             setSortDirection('asc');
//                           }
//                         }}
//                       >
//                         Technicien
//                         {sortField === 'technicien_responsable' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th className="font-bold">Date fin</th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'cout') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('cout');
//                             setSortDirection('desc');
//                           }
//                         }}
//                       >
//                         Coût
//                         {sortField === 'cout' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th className="font-bold">Statut</th>
//                     <th className="text-center font-bold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredReparations.length === 0 ? (
//                     <tr>
//                       <td colSpan={10} className="text-center py-8">
//                         <div className="flex flex-col items-center gap-3">
//                           <Package className="h-12 w-12 text-base-content/30" />
//                           <p className="font-medium">Aucune réparation trouvée</p>
//                           <p className="text-sm text-base-content/60">
//                             {searchTerm || filterType || filterStatut
//                               ? "Essayez de modifier vos critères de recherche"
//                               : "Créez votre première réparation en cliquant sur 'Nouvelle réparation'"}
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredReparations.map((reparation) => {
//                       const isCurrentUser = reparation.technicien_responsable === getCurrentUserName();
//                       const isSelected = selectedReparations.includes(reparation.id);
                      
//                       return (
//                         <tr key={reparation.id} className="hover">
//                           <td className="text-center">
//                             <input
//                               type="checkbox"
//                               className="checkbox checkbox-primary checkbox-sm"
//                               checked={isSelected}
//                               onChange={() => toggleSelectReparation(reparation.id)}
//                             />
//                           </td>
//                           <td>
//                             <div className="text-sm font-medium">
//                               {formatDate(reparation.date_debut)}
//                             </div>
//                           </td>
//                           <td>
//                             <div className="font-medium">
//                               {reparation.materiel_nom || 'Non spécifié'}
//                             </div>
//                           </td>
//                           <td>
//                             <div className="max-w-xs truncate" title={reparation.description}>
//                               {reparation.description}
//                             </div>
//                           </td>
//                           <td>
//                             <span className={`badge ${getTypeColor(reparation.type_reparation)}`}>
//                               {getTypeText(reparation.type_reparation)}
//                             </span>
//                           </td>
//                           <td>
//                             <div className={`flex items-center gap-2 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <Users className="h-4 w-4" />
//                               <span>{reparation.technicien_responsable || 'Non assigné'}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs">VOUS</span>
//                               )}
//                             </div>
//                           </td>
//                           <td>
//                             {reparation.date_fin ? (
//                               <div className="text-sm">{formatDate(reparation.date_fin)}</div>
//                             ) : (
//                               <span className="badge badge-warning badge-sm">En cours</span>
//                             )}
//                           </td>
//                           <td>
//                             <div className="font-medium text-green-600">
//                               {formatCurrency(reparation.cout)}
//                             </div>
//                           </td>
//                           <td>
//                             <span className={`badge ${getStatutColor(reparation)}`}>
//                               {getStatutText(reparation)}
//                             </span>
//                           </td>
//                           <td>
//                             <div className="flex justify-center gap-1">
//                               <button
//                                 onClick={() => handleEdit(reparation)}
//                                 className="btn btn-ghost btn-xs btn-square text-info"
//                                 title="Modifier"
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </button>
//                               {!reparation.date_fin && (
//                                 <button
//                                   onClick={() => handleTerminer(reparation.id)}
//                                   className="btn btn-ghost btn-xs btn-square text-success"
//                                   title="Terminer"
//                                 >
//                                   <CheckCircle className="h-4 w-4" />
//                                 </button>
//                               )}
//                               <button
//                                 onClick={() => handleDelete(reparation.id)}
//                                 className="btn btn-ghost btn-xs btn-square text-error"
//                                 title="Supprimer"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()}
//       />
//     </div>
//   );
// };

// export default Reparations;












// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   Plus, Search, Filter, Edit, Trash2, CheckCircle, Wrench, 
//   Calendar, CheckSquare, Square, X, Download, Users, 
//   TrendingUp, DollarSign, Clock, Package, BarChart3, 
//   AlertTriangle, RefreshCw, Eye, FileText, Printer, ChevronDown,
//   ChevronUp, SortAsc, SortDesc, Filter as FilterIcon
// } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Types
// type MessageType = 'success' | 'error' | 'info' | 'warning';
// type SortField = 'materiel' | 'type_reparation' | 'date_debut' | 'date_fin' | 'cout' | 'technicien_responsable';
// type SortDirection = 'asc' | 'desc';

// interface Statistiques {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParType: {
//     preventive: number;
//     corrective: number;
//     ameliorative: number;
//   };
//   reparationsParMois: Array<{
//     mois: string;
//     count: number;
//     cout: number;
//   }>;
//   topTechniciens: Array<{
//     technicien: string;
//     count: number;
//     cout: number;
//   }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   // États principaux
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
  
//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
  
//   // États pour les statistiques
//   const [statistiques, setStatistiques] = useState<Statistiques>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParType: {
//       preventive: 0,
//       corrective: 0,
//       ameliorative: 0
//     },
//     reparationsParMois: [],
//     topTechniciens: []
//   });
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterTechnicien, setFilterTechnicien] = useState<string>('');
//   const [filterMateriel, setFilterMateriel] = useState<string>('');
  
//   // États pour le tri
//   const [sortField, setSortField] = useState<SortField>('date_debut');
//   const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
//   // États pour la sélection multiple
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les options déroulantes
//   const [showFilters, setShowFilters] = useState<boolean>(false);
//   const [showStats, setShowStats] = useState<boolean>(true);

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user.nom_complet) return user.nom_complet;
//     if (user.username) return user.username;
    
//     return 'Utilisateur';
//   }, [user]);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       console.log('🔄 Chargement des réparations...');
//       const response = await reparationsAPI.getAll();
//       const data = response.data || [];
      
//       console.log(`✅ ${data.length} réparations chargées`);
//       setReparations(data);
      
//       // Calculer les statistiques
//       calculerStatistiques(data);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll(),
//         incidentsAPI.getAll()
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' ? materielsResponse.value.data : [];
//       const incidentsData = incidentsResponse.status === 'fulfilled' ? incidentsResponse.value.data : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//     }
//   };

//   // Calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParType: { preventive: 0, corrective: 0, ameliorative: 0 },
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Statistiques de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => {
//       if (!r.date_debut) return false;
//       const dateDebut = new Date(r.date_debut);
//       return dateDebut >= debutMois;
//     });
    
//     // Coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (rep.cout || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (rep.cout || 0), 0);
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Durée moyenne
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         const dateDebut = new Date(rep.date_debut);
//         const dateFin = new Date(rep.date_fin);
//         const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24);
//         dureeTotale += duree;
//         reparationsAvecDuree++;
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par type
//     const reparationsParType = {
//       preventive: data.filter(r => r.type_reparation === 'preventive').length,
//       corrective: data.filter(r => r.type_reparation === 'corrective').length,
//       ameliorative: data.filter(r => r.type_reparation === 'ameliorative').length
//     };
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         const date = new Date(rep.date_debut);
//         const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//         if (reparationsParMoisMap[moisKey]) {
//           reparationsParMoisMap[moisKey].count++;
//           reparationsParMoisMap[moisKey].cout += rep.cout || 0;
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
//     data.forEach(rep => {
//       const technicien = rep.technicien_responsable || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += rep.cout || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen,
//       dureeMoyenne,
//       reparationsParType,
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Filtrer et trier les réparations
//   useEffect(() => {
//     let filtered = [...reparations];

//     // Filtre par recherche
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(reparation => 
//         reparation.technicien_responsable?.toLowerCase().includes(searchLower) ||
//         (reparation.materiel_nom && reparation.materiel_nom.toLowerCase().includes(searchLower)) ||
//         (reparation.materiel?.nom && reparation.materiel.nom.toLowerCase().includes(searchLower))
//       );
//     }

//     // Filtre par type
//     if (filterType) {
//       filtered = filtered.filter(reparation => reparation.type_reparation === filterType);
//     }

//     // Filtre par statut
//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = filtered.filter(reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = filtered.filter(reparation => reparation.date_fin);
//       }
//     }

//     // Filtre par technicien
//     if (filterTechnicien) {
//       filtered = filtered.filter(reparation => 
//         reparation.technicien_responsable === filterTechnicien
//       );
//     }

//     // Filtre par matériel
//     if (filterMateriel) {
//       filtered = filtered.filter(reparation => 
//         reparation.materiel_nom === filterMateriel ||
//         reparation.materiel?.nom === filterMateriel
//       );
//     }

//     // Tri
//     filtered.sort((a, b) => {
//       let aValue: any, bValue: any;
      
//       switch (sortField) {
//         case 'materiel':
//           aValue = a.materiel_nom || a.materiel?.nom || '';
//           bValue = b.materiel_nom || b.materiel?.nom || '';
//           break;
//         case 'type_reparation':
//           aValue = a.type_reparation || '';
//           bValue = b.type_reparation || '';
//           break;
//         case 'date_debut':
//           aValue = a.date_debut ? new Date(a.date_debut).getTime() : 0;
//           bValue = b.date_debut ? new Date(b.date_debut).getTime() : 0;
//           break;
//         case 'date_fin':
//           aValue = a.date_fin ? new Date(a.date_fin).getTime() : 0;
//           bValue = b.date_fin ? new Date(b.date_fin).getTime() : 0;
//           break;
//         case 'cout':
//           aValue = a.cout || 0;
//           bValue = b.cout || 0;
//           break;
//         case 'technicien_responsable':
//           aValue = a.technicien_responsable?.toLowerCase() || '';
//           bValue = b.technicien_responsable?.toLowerCase() || '';
//           break;
//         default:
//           return 0;
//       }
      
//       if (sortDirection === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut, filterTechnicien, filterMateriel, sortField, sortDirection]);

//   // Initialisation
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Formater la devise
//   const formatCurrency = useCallback((amount: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
//   }, []);

//   // Formater la date
//   const formatDate = useCallback((dateString?: string): string => {
//     if (!dateString) return '-';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR');
//     } catch {
//       return dateString;
//     }
//   }, []);

//   // Gestion du formulaire
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       if (editingReparation) {
//         await reparationsAPI.update(editingReparation.id, reparationData);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         await reparationsAPI.create(reparationData);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Actions sur les réparations
//   const handleEdit = (reparation: Reparation) => {
//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   const handleTerminer = async (id: number) => {
//     try {
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: getCurrentUserName()
//       });
//       showMessage('success', 'Réparation marquée comme terminée');
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Sélection multiple
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//     setIsSelectAll(!isSelectAll);
//   };

//   // Actions sur la sélection multiple
//   const handleTerminerSelection = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       await Promise.all(
//         selectedReparations.map(id => 
//           reparationsAPI.update(id, { 
//             date_fin: new Date().toISOString(),
//             technicien_responsable: getCurrentUserName()
//           })
//         )
//       );
//       showMessage('success', `${selectedReparations.length} réparation(s) terminée(s)`);
//       setSelectedReparations([]);
//       setIsSelectAll(false);
//       fetchReparations();
//     } catch (error) {
//       showMessage('error', 'Erreur lors de la finalisation');
//     }
//   };

//   const handleDeleteSelection = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s)`);
//         setSelectedReparations([]);
//         setIsSelectAll(false);
//         fetchReparations();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression');
//       }
//     }
//   };

//   // Export CSV
//   const handleExportCSV = () => {
//     const headers = [
//       'ID',
//       'Matériel',
//       'Type',
//       'Technicien',
//       'Date début',
//       'Date fin',
//       'Coût (Ar)',
//       'Statut'
//     ];

//     const rows = filteredReparations.map(reparation => [
//       reparation.id,
//       reparation.materiel_nom || reparation.materiel?.nom || '',
//       getTypeText(reparation.type_reparation),
//       reparation.technicien_responsable,
//       formatDate(reparation.date_debut),
//       formatDate(reparation.date_fin),
//       reparation.cout,
//       reparation.date_fin ? 'Terminée' : 'En cours'
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     showMessage('success', 'Export CSV réussi');
//   };

//   // Fonctions utilitaires
//   const getTypeText = (type: string) => {
//     switch (type) {
//       case 'preventive': return 'Préventive';
//       case 'corrective': return 'Corrective';
//       case 'ameliorative': return 'Améliorative';
//       default: return type;
//     }
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case 'preventive': return 'bg-blue-100 text-blue-800';
//       case 'corrective': return 'bg-orange-100 text-orange-800';
//       case 'ameliorative': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatutColor = (reparation: Reparation) => {
//     return reparation.date_fin 
//       ? 'bg-green-100 text-green-800' 
//       : 'bg-yellow-100 text-yellow-800';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return reparation.date_fin ? 'Terminée' : 'En cours';
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setFilterTechnicien('');
//     setFilterMateriel('');
//     setSortField('date_debut');
//     setSortDirection('desc');
//     setSelectedReparations([]);
//     setIsSelectAll(false);
//   };

//   // Liste des techniciens uniques
//   const techniciens = [...new Set(reparations.map(r => r.technicien_responsable).filter(Boolean))];
  
//   // Liste des matériels uniques
//   const materielsUniques = [...new Set(
//     reparations.map(r => r.materiel_nom || r.materiel?.nom).filter(Boolean)
//   )];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-base-100 p-6">
//         <div className="flex flex-col items-center justify-center h-96">
//           <div className="loading loading-spinner loading-lg text-primary"></div>
//           <p className="mt-4 text-lg">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* En-tête */}
//       <div className="p-6 pb-0">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//             <div className="flex items-center gap-2 mt-2">
//               <div className="badge badge-primary">
//                 {filteredReparations.length} réparation(s)
//               </div>
//               <div className="badge badge-success">
//                 👤 {getCurrentUserName()}
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowStats(!showStats)}
//               className="btn btn-outline btn-sm"
//               title={showStats ? "Masquer statistiques" : "Afficher statistiques"}
//             >
//               <BarChart3 className="h-4 w-4" />
//             </button>
//             <button
//               onClick={handleExportCSV}
//               className="btn btn-outline btn-sm"
//               title="Exporter en CSV"
//             >
//               <Download className="h-4 w-4" />
//               Exporter
//             </button>
//             <button
//               onClick={fetchReparations}
//               className="btn btn-outline btn-sm"
//               title="Actualiser"
//             >
//               <RefreshCw className="h-4 w-4" />
//             </button>
//             <button
//               onClick={() => setIsFormOpen(true)}
//               className="btn btn-primary btn-sm"
//             >
//               <Plus className="h-4 w-4" />
//               Nouvelle réparation
//             </button>
//           </div>
//         </div>

//         {/* Message d'alerte */}
//         {message && (
//           <div className={`alert alert-${message.type} mt-4`}>
//             <span>{message.text}</span>
//           </div>
//         )}

//         {error && (
//           <div className="alert alert-error mt-4">
//             <AlertTriangle className="h-5 w-5" />
//             <span>{error}</span>
//           </div>
//         )}
//       </div>

//       {/* Section Statistiques (repliable) */}
//       {showStats && (
//         <div className="p-6 pt-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {/* Carte Totale */}
//             <div className="card bg-base-200 shadow-sm">
//               <div className="card-body p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-2xl font-bold">{statistiques.total}</div>
//                     <div className="text-sm opacity-70">Total réparations</div>
//                   </div>
//                   <div className="p-2 bg-primary/10 rounded-lg">
//                     <Package className="h-6 w-6 text-primary" />
//                   </div>
//                 </div>
//                 <div className="mt-2 text-xs flex gap-2">
//                   <span className="badge badge-success">{statistiques.terminees} terminées</span>
//                   <span className="badge badge-warning">{statistiques.enCours} en cours</span>
//                 </div>
//               </div>
//             </div>

//             {/* Carte Coûts */}
//             <div className="card bg-base-200 shadow-sm">
//               <div className="card-body p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-2xl font-bold">{formatCurrency(statistiques.coutTotal)}</div>
//                     <div className="text-sm opacity-70">Coût total</div>
//                   </div>
//                   <div className="p-2 bg-purple-500/10 rounded-lg">
//                     <DollarSign className="h-6 w-6 text-purple-500" />
//                   </div>
//                 </div>
//                 <div className="mt-2 text-xs">
//                   <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Carte Durée */}
//             <div className="card bg-base-200 shadow-sm">
//               <div className="card-body p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-2xl font-bold">{statistiques.dureeMoyenne.toFixed(1)}</div>
//                     <div className="text-sm opacity-70">Jours moyen</div>
//                   </div>
//                   <div className="p-2 bg-green-500/10 rounded-lg">
//                     <Clock className="h-6 w-6 text-green-500" />
//                   </div>
//                 </div>
//                 <div className="mt-2 text-xs">
//                   <span>{statistiques.terminees} réparations terminées</span>
//                 </div>
//               </div>
//             </div>

//             {/* Carte Taux */}
//             <div className="card bg-base-200 shadow-sm">
//               <div className="card-body p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-2xl font-bold">
//                       {statistiques.total > 0 
//                         ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                         : '0%'}
//                     </div>
//                     <div className="text-sm opacity-70">Taux de complétion</div>
//                   </div>
//                   <div className="p-2 bg-orange-500/10 rounded-lg">
//                     <TrendingUp className="h-6 w-6 text-orange-500" />
//                   </div>
//                 </div>
//                 <div className="mt-2 text-xs">
//                   <span>{statistiques.terminees} / {statistiques.total}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Graphiques et détails */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Réparations par type */}
//             <div className="card bg-base-200">
//               <div className="card-body">
//                 <h3 className="card-title text-lg">📊 Réparations par type</h3>
//                 <div className="space-y-3 mt-4">
//                   <div className="flex justify-between items-center">
//                     <span className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded"></div>
//                       <span>Préventive</span>
//                     </span>
//                     <span className="font-bold">{statistiques.reparationsParType.preventive}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-orange-500 rounded"></div>
//                       <span>Corrective</span>
//                     </span>
//                     <span className="font-bold">{statistiques.reparationsParType.corrective}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded"></div>
//                       <span>Améliorative</span>
//                     </span>
//                     <span className="font-bold">{statistiques.reparationsParType.ameliorative}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Top techniciens */}
//             <div className="card bg-base-200">
//               <div className="card-body">
//                 <h3 className="card-title text-lg">🏆 Top Techniciens</h3>
//                 <div className="space-y-3 mt-4">
//                   {statistiques.topTechniciens.map((tech, index) => (
//                     <div key={tech.technicien} className="flex justify-between items-center">
//                       <div className="flex items-center gap-2">
//                         <div className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-xs font-bold">
//                           {index + 1}
//                         </div>
//                         <span className="truncate max-w-[120px]">{tech.technicien}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="badge badge-primary badge-sm">{tech.count}</span>
//                         <span className="text-xs opacity-70">{formatCurrency(tech.cout)}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Réparations par mois */}
//             <div className="card bg-base-200">
//               <div className="card-body">
//                 <h3 className="card-title text-lg">📅 Réparations par mois</h3>
//                 <div className="space-y-3 mt-4 max-h-48 overflow-y-auto">
//                   {statistiques.reparationsParMois.map((item) => (
//                     <div key={item.mois} className="flex justify-between items-center">
//                       <span>{item.mois}</span>
//                       <div className="flex items-center gap-3">
//                         <span className="badge badge-outline badge-sm">{item.count}</span>
//                         <span className="text-xs font-medium">{formatCurrency(item.cout)}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filtres et recherche */}
//       <div className="p-6 pt-4">
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="btn btn-sm btn-outline flex items-center gap-2"
//               >
//                 <FilterIcon className="h-4 w-4" />
//                 {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
//                 {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//               </button>
              
//               <div className="relative flex-1 max-w-md">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Rechercher par technicien ou matériel..."
//                   className="input input-bordered w-full pl-10"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               {selectedReparations.length > 0 && (
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelection}
//                     className="btn btn-success btn-sm"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelection}
//                     className="btn btn-error btn-sm"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => {
//                       setSelectedReparations([]);
//                       setIsSelectAll(false);
//                     }}
//                     className="btn btn-ghost btn-sm"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Filtres détaillés */}
//             {showFilters && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-base-300">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Type de réparation</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={filterType}
//                     onChange={(e) => setFilterType(e.target.value)}
//                   >
//                     <option value="">Tous les types</option>
//                     <option value="preventive">Préventive</option>
//                     <option value="corrective">Corrective</option>
//                     <option value="ameliorative">Améliorative</option>
//                   </select>
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Statut</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={filterStatut}
//                     onChange={(e) => setFilterStatut(e.target.value)}
//                   >
//                     <option value="">Tous les statuts</option>
//                     <option value="en_cours">En cours</option>
//                     <option value="terminee">Terminée</option>
//                   </select>
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Technicien</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={filterTechnicien}
//                     onChange={(e) => setFilterTechnicien(e.target.value)}
//                   >
//                     <option value="">Tous les techniciens</option>
//                     {techniciens.map(tech => (
//                       <option key={tech} value={tech}>{tech}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Matériel</span>
//                   </label>
//                   <select
//                     className="select select-bordered w-full"
//                     value={filterMateriel}
//                     onChange={(e) => setFilterMateriel(e.target.value)}
//                   >
//                     <option value="">Tous les matériels</option>
//                     {materielsUniques.map(mat => (
//                       <option key={mat} value={mat}>{mat}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Actions</span>
//                   </label>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={resetFilters}
//                       className="btn btn-outline flex-1"
//                     >
//                       <X className="h-4 w-4" />
//                       Réinitialiser
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Tableau des réparations - STRUCTURE SIMILAIRE À DJANGO ADMIN */}
//       <div className="p-6 pt-0">
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-0">
//             <div className="overflow-x-auto">
//               <table className="table table-zebra w-full">
//                 <thead>
//                   <tr className="bg-base-300">
//                     <th className="w-12 text-center">
//                       <div className="flex justify-center">
//                         <button
//                           onClick={toggleSelectAll}
//                           className="btn btn-ghost btn-xs"
//                           title={isSelectAll ? "Désélectionner tout" : "Sélectionner tout"}
//                         >
//                           {isSelectAll ? (
//                             <CheckSquare className="h-5 w-5 text-primary" />
//                           ) : (
//                             <Square className="h-5 w-5 text-base-content/40" />
//                           )}
//                         </button>
//                       </div>
//                     </th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'materiel') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('materiel');
//                             setSortDirection('asc');
//                           }
//                         }}
//                       >
//                         Matériel
//                         {sortField === 'materiel' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'type_reparation') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('type_reparation');
//                             setSortDirection('asc');
//                           }
//                         }}
//                       >
//                         Type
//                         {sortField === 'type_reparation' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'date_debut') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('date_debut');
//                             setSortDirection('desc');
//                           }
//                         }}
//                       >
//                         Date début
//                         {sortField === 'date_debut' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'date_fin') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('date_fin');
//                             setSortDirection('desc');
//                           }
//                         }}
//                       >
//                         Date fin
//                         {sortField === 'date_fin' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'cout') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('cout');
//                             setSortDirection('desc');
//                           }
//                         }}
//                       >
//                         Coût
//                         {sortField === 'cout' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th>
//                       <button
//                         className="flex items-center gap-1 font-bold"
//                         onClick={() => {
//                           if (sortField === 'technicien_responsable') {
//                             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//                           } else {
//                             setSortField('technicien_responsable');
//                             setSortDirection('asc');
//                           }
//                         }}
//                       >
//                         Technicien
//                         {sortField === 'technicien_responsable' && (
//                           sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
//                         )}
//                       </button>
//                     </th>
//                     <th className="text-center font-bold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredReparations.length === 0 ? (
//                     <tr>
//                       <td colSpan={9} className="text-center py-8">
//                         <div className="flex flex-col items-center gap-3">
//                           <Package className="h-12 w-12 text-base-content/30" />
//                           <p className="font-medium">Aucune réparation trouvée</p>
//                           <p className="text-sm text-base-content/60">
//                             {searchTerm || filterType || filterStatut
//                               ? "Essayez de modifier vos critères de recherche"
//                               : "Créez votre première réparation en cliquant sur 'Nouvelle réparation'"}
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredReparations.map((reparation) => {
//                       const isCurrentUser = reparation.technicien_responsable === getCurrentUserName();
//                       const isSelected = selectedReparations.includes(reparation.id);
                      
//                       return (
//                         <tr key={reparation.id} className="hover">
//                           <td className="text-center">
//                             <input
//                               type="checkbox"
//                               className="checkbox checkbox-primary checkbox-sm"
//                               checked={isSelected}
//                               onChange={() => toggleSelectReparation(reparation.id)}
//                             />
//                           </td>
//                           <td>
//                             {/* Matériel */}
//                             <div className="font-medium">
//                               {reparation.materiel_nom || reparation.materiel?.nom || 'Non spécifié'}
//                             </div>
//                           </td>
//                           <td>
//                             {/* Type de réparation */}
//                             <span className={`badge ${getTypeColor(reparation.type_reparation)}`}>
//                               {getTypeText(reparation.type_reparation)}
//                             </span>
//                           </td>
//                           <td>
//                             {/* Date début */}
//                             <div className="text-sm font-medium">
//                               {formatDate(reparation.date_debut)}
//                             </div>
//                           </td>
//                           <td>
//                             {/* Date fin */}
//                             {reparation.date_fin ? (
//                               <div className="text-sm">{formatDate(reparation.date_fin)}</div>
//                             ) : (
//                               <span className="badge badge-warning badge-sm">En cours</span>
//                             )}
//                           </td>
//                           <td>
//                             {/* Coût */}
//                             <div className="font-medium text-green-600">
//                               {formatCurrency(reparation.cout)}
//                             </div>
//                           </td>
//                           <td>
//                             {/* Technicien responsable */}
//                             <div className={`flex items-center gap-2 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <Users className="h-4 w-4" />
//                               <span>{reparation.technicien_responsable || 'Non assigné'}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs">VOUS</span>
//                               )}
//                             </div>
//                           </td>
//                           <td>
//                             {/* Actions */}
//                             <div className="flex justify-center gap-1">
//                               <button
//                                 onClick={() => handleEdit(reparation)}
//                                 className="btn btn-ghost btn-xs btn-square text-info"
//                                 title="Modifier"
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </button>
//                               {!reparation.date_fin && (
//                                 <button
//                                   onClick={() => handleTerminer(reparation.id)}
//                                   className="btn btn-ghost btn-xs btn-square text-success"
//                                   title="Terminer"
//                                 >
//                                   <CheckCircle className="h-4 w-4" />
//                                 </button>
//                               )}
//                               <button
//                                 onClick={() => handleDelete(reparation.id)}
//                                 className="btn btn-ghost btn-xs btn-square text-error"
//                                 title="Supprimer"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()}
//       />
//     </div>
//   );
// };

// export default Reparations;


// // // kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk


// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Reparation[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // Type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// // Type pour les statistiques
// interface StatistiquesReparations {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
//   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // Statistiques détaillées
//   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParMois: [],
//     topTechniciens: []
//   });

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     if (user.nom_complet) return user.nom_complet;
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user.name) return user.name;
//     if (user.username) return user.username;
    
//     return 'Utilisateur';
//   }, [user]);

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Calculs de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => 
//       r.date_debut && new Date(r.date_debut) >= debutMois
//     );
    
//     // Calcul des coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
//     // Calcul du coût moyen
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Calcul de la durée moyenne des réparations terminées
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         try {
//           const dateDebut = new Date(rep.date_debut);
//           const dateFin = new Date(rep.date_fin);
//           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
//             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
//             dureeTotale += duree;
//             reparationsAvecDuree++;
//           }
//         } catch (e) {
//           console.warn('Erreur calcul durée:', e);
//         }
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     const moisActuel = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         try {
//           const date = new Date(rep.date_debut);
//           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
//           if (reparationsParMoisMap[moisKey]) {
//             reparationsParMoisMap[moisKey].count++;
//             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
//           }
//         } catch (e) {
//           console.warn('Erreur date réparation:', e);
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
//     data.forEach(rep => {
//       const technicien = getTechnicienName(rep) || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
//       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des réparations...');
      
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log('✅ Réparations chargées:', extractedData.length);
      
//       setReparations(extractedData);
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des réparations';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);

//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Charger toutes les données au montage
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Filtrer les réparations
//   useEffect(() => {
//     let filtered = safeArray(reparations);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter(filtered, reparation => {
//         const technicien = getTechnicienName(reparation).toLowerCase();
//         return (
//           reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
//           reparation.description?.toLowerCase().includes(searchLower) ||
//           technicien.includes(searchLower)
//         );
//       });
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
//     }

//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = safeFilter(filtered, reparation => reparation.date_fin);
//       }
//     }

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut]);

//   // Gérer la sélection multiple
//   useEffect(() => {
//     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedReparations, filteredReparations]);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Trouver le nom du technicien
//   const getTechnicienName = useCallback((reparation: any): string => {
//     if (!reparation) return '';
    
//     const possibleFields = [
//       'technicien_responsable',
//       'technicien',
//       'responsable', 
//       'technician',
//       'technician_responsable',
//       'responsible_technician',
//       'tech_responsable',
//       'nom_technicien',
//       'technicien_nom',
//       'technician_name',
//       'responsible',
//       'assigné_à',
//       'assigned_to'
//     ];
    
//     for (const field of possibleFields) {
//       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
//         return reparation[field];
//       }
//     }
    
//     return '';
//   }, []);

//   // Formater la devise en Ariary
//   const formatCurrency = useCallback((amount: number | string): string => {
//     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(numAmount)) return '0 Ar';
//     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
//   }, []);

//   // Formater les nombres
//   const formatNumber = useCallback((num: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(num);
//   }, []);

//   // Gérer la soumission d'une réparation - CORRIGÉ
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       console.log('📤 Données reçues du formulaire:', reparationData);
      
//       const currentUserName = getCurrentUserName();
//       console.log('👤 Technicien automatique (depuis parent):', currentUserName);
      
//       // CORRECTION CRITIQUE : Assurer que technicien_responsable n'est jamais null
//       const technicienResponsable = reparationData.technicien_responsable?.trim() || currentUserName;
      
//       if (!technicienResponsable || technicienResponsable === '') {
//         throw new Error('Le nom du technicien est requis');
//       }
      
//       // Préparer les données pour l'API
//       const formattedData = {
//         materiel: reparationData.materiel,
//         type_reparation: reparationData.type_reparation,
//         date_debut: reparationData.date_debut,
//         date_fin: reparationData.date_fin || null,
//         cout: parseFloat(reparationData.cout) || 0,
//         technicien_responsable: technicienResponsable, // CORRIGÉ : Toujours une chaîne non vide
//         description: reparationData.description || 'Réparation effectuée',
//         incident: reparationData.incident || null
//       };
      
//       console.log('📝 Données formatées pour API:', formattedData);
//       console.log('✅ Technicien dans données:', formattedData.technicien_responsable);
      
//       if (editingReparation) {
//         await reparationsAPI.update(editingReparation.id, formattedData);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         await reparationsAPI.create(formattedData);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde réparation:', error);
//       const errorMessage = error.response?.data?.message || 
//                           error.message || 
//                           'Erreur lors de la sauvegarde de la réparation';
//       showMessage('error', errorMessage);
      
//       // Log détaillé pour débogage
//       console.error('🔍 Détails de l\'erreur:', {
//         user: getCurrentUserName(),
//         dataSent: reparationData,
//         error: error.response?.data
//       });
//     }
//   };

//   // Gérer l'édition
//   const handleEdit = (reparation: Reparation) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   // Gérer la suppression
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer la fin de réparation
//   const handleTerminer = async (id: number) => {
//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName
//       });
//       showMessage('success', 'Réparation marquée comme terminée');
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'ajout d'une nouvelle réparation
//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Aucune donnée de relation disponible.');
//       return;
//     }

//     setEditingReparation(undefined);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Gérer la suppression multiple
//   const handleDeleteSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer l'édition multiple
//   const handleEditSelected = () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (selectedReparations.length === 1) {
//       const reparation = reparations.find(r => r.id === selectedReparations[0]);
//       if (reparation) {
//         handleEdit(reparation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
//       setEditingReparation(undefined);
//       setIsFormOpen(true);
//     }
//   };

//   // Gérer la fin de réparation multiple
//   const handleTerminerSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       await Promise.all(
//         selectedReparations.map(id => 
//           reparationsAPI.update(id, { 
//             date_fin: new Date().toISOString(),
//             technicien_responsable: currentUserName
//           })
//         )
//       );
      
//       showMessage('success', `${selectedReparations.length} réparation(s) marquée(s) comme terminées`);
//       setSelectedReparations([]);
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Exporter en CSV
//   const handleExport = useCallback(() => {
//     try {
//       const dataToExport = filteredReparations.map(reparation => ({
//         'Matériel': reparation.materiel_nom || 'Non spécifié',
//         'Type': getTypeText(reparation.type_reparation),
//         'Technicien': getTechnicienName(reparation) || 'Non assigné',
//         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
//         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
//         'Statut': getStatutText(reparation),
//         'Description': reparation.description || 'Aucune description'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export CSV:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   }, [filteredReparations, getTechnicienName]);

//   // Fonctions d'affichage
//   const getTypeBadge = (type: string) => {
//     const badges = {
//       preventive: 'badge-info',
//       corrective: 'badge-warning',
//       ameliorative: 'badge-success'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       preventive: 'Préventive',
//       corrective: 'Corrective',
//       ameliorative: 'Améliorative'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     const icons = {
//       preventive: <Wrench className="h-4 w-4" />,
//       corrective: <Wrench className="h-4 w-4" />,
//       ameliorative: <CheckCircle className="h-4 w-4" />
//     };
//     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
//   };

//   const isEnCours = (reparation: Reparation) => {
//     return !reparation.date_fin;
//   };

//   const getStatutBadge = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'En cours' : 'Terminée';
//   };

//   const getStatutIcon = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 
//       <Calendar className="h-4 w-4" /> : 
//       <CheckCircle className="h-4 w-4" />;
//   };

//   // Obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedReparations([]);
//   };

//   // Rendre la section statistiques
//   const renderStatistiquesSection = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {/* Carte Total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
//               <p className="text-sm opacity-60">Total réparations</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Package className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span className="text-success">{statistiques.terminees} terminées</span>
//             <span className="mx-2">•</span>
//             <span className="text-warning">{statistiques.enCours} en cours</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
//               <p className="text-sm opacity-60">Coût total</p>
//             </div>
//             <div className="p-2 bg-purple-500/10 rounded-lg">
//               <DollarSign className="h-6 w-6 text-purple-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût ce mois */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
//               <p className="text-sm opacity-60">Coût ce mois</p>
//             </div>
//             <div className="p-2 bg-blue-500/10 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-blue-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Durée moyenne */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
//               <p className="text-sm opacity-60">Jours moyen</p>
//             </div>
//             <div className="p-2 bg-green-500/10 rounded-lg">
//               <Clock className="h-6 w-6 text-green-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} réparations terminées</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Taux de complétion */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">
//                 {statistiques.total > 0 
//                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                   : '0%'
//                 }
//               </h3>
//               <p className="text-sm opacity-60">Taux de complétion</p>
//             </div>
//             <div className="p-2 bg-orange-500/10 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} / {statistiques.total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredReparations.length} réparation(s) trouvée(s)
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {getCurrentUserName()}
//             </span>
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle réparation
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques détaillées */}
//       {renderStatistiquesSection()}

//       {/* Section Utilisateur actuel */}
//       <div className="mb-6">
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Users className="h-5 w-5 text-success" />
//                 <div>
//                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
//                   <p className="text-sm">
//                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
//                   </p>
//                   <p className="text-xs text-success opacity-70 mt-1">
//                     Ce nom sera automatiquement utilisé comme "technicien responsable" lorsque vous créez ou modifiez une réparation.
//                   </p>
//                 </div>
//               </div>
//               <div className="badge badge-success badge-lg">
//                 Connecté
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section Top Techniciens */}
//       {statistiques.topTechniciens.length > 0 && (
//         <div className="mb-6">
//           <div className="card bg-base-200 shadow-sm">
//             <div className="card-body p-4">
//               <h3 className="font-bold text-base-content mb-3">🏆 Top Techniciens</h3>
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                 {statistiques.topTechniciens.map((tech, index) => (
//                   <div key={index} className="bg-base-100 p-3 rounded-lg">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-sm truncate">{tech.technicien}</span>
//                       <span className="badge badge-primary badge-sm">{tech.count}</span>
//                     </div>
//                     <div className="text-xs opacity-70">
//                       Coût: {formatCurrency(tech.cout)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

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
//                   placeholder="Matériel, technicien..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🛠️ Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
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
//                 <option value="en_cours">En cours</option>
//                 <option value="terminee">Terminée</option>
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
//           </div>

//           {/* Actions de sélection */}
//           {selectedReparations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedReparations.length} réparation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
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

//       {/* Tableau des réparations */}
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
//                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Technicien</th>
//                   <th className="font-bold">Date début</th>
//                   <th className="font-bold">Date fin</th>
//                   <th className="font-bold">Coût</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredReparations).map((reparation) => {
//                   const technicien = getTechnicienName(reparation);
//                   const isCurrentUser = technicien === getCurrentUserName();
                  
//                   return (
//                     <tr key={reparation.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedReparations.includes(reparation.id)}
//                             onChange={() => toggleSelectReparation(reparation.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {reparation.materiel_nom}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
//                           {getTypeIcon(reparation.type_reparation)}
//                           {getTypeText(reparation.type_reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {technicien ? (
//                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
//                               <span>{technicien}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-base-content opacity-50">Non assigné</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm">
//                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                       </td>
//                       <td>
//                         {reparation.date_fin ? (
//                           <span className="text-sm">
//                             {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
//                           </span>
//                         ) : (
//                           <div className="badge badge-warning badge-sm">En cours</div>
//                         )}
//                       </td>
//                       <td>
//                         {reparation.cout ? (
//                           <span className="font-semibold text-green-600 text-sm">
//                             {reparation.cout.toLocaleString('fr-FR')} Ar
//                           </span>
//                         ) : (
//                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
//                           {getStatutIcon(reparation)}
//                           {getStatutText(reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(reparation)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {isEnCours(reparation) && (
//                             <button
//                               onClick={() => handleTerminer(reparation.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Terminer la réparation"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(reparation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredReparations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Wrench className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType || filterStatut
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune réparation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()} // PASSER le nom de l'utilisateur
//       />
//     </div>
//   );
// };

// export default Reparations;






// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package, AlertTriangle, RefreshCw } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Reparation[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // Type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// // Type pour les statistiques
// interface StatistiquesReparations {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
//   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // Statistiques détaillées
//   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParMois: [],
//     topTechniciens: []
//   });

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     if (user.nom_complet) return user.nom_complet;
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user.name) return user.name;
//     if (user.username) return user.username;
    
//     return 'Technicien';
//   }, [user]);

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Calculs de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => 
//       r.date_debut && new Date(r.date_debut) >= debutMois
//     );
    
//     // Calcul des coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
//     // Calcul du coût moyen
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Calcul de la durée moyenne des réparations terminées
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         try {
//           const dateDebut = new Date(rep.date_debut);
//           const dateFin = new Date(rep.date_fin);
//           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
//             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
//             dureeTotale += duree;
//             reparationsAvecDuree++;
//           }
//         } catch (e) {
//           console.warn('Erreur calcul durée:', e);
//         }
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     const moisActuel = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         try {
//           const date = new Date(rep.date_debut);
//           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
//           if (reparationsParMoisMap[moisKey]) {
//             reparationsParMoisMap[moisKey].count++;
//             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
//           }
//         } catch (e) {
//           console.warn('Erreur date réparation:', e);
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
//     data.forEach(rep => {
//       const technicien = getTechnicienName(rep) || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
//       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Fonction pour mettre à jour l'état du matériel
//   const updateMaterielEtat = useCallback(async (materielId: number, etat: string) => {
//     try {
//       console.log(`🔄 Mise à jour état matériel #${materielId} -> ${etat}`);
      
//       // Trouver le matériel pour vérifier son existence
//       const materiel = materiels.find(m => 
//         m.id === materielId || 
//         m._id === materielId || 
//         m.id?.toString() === materielId.toString()
//       );
      
//       if (!materiel) {
//         console.warn(`⚠️ Matériel #${materielId} non trouvé dans la liste locale`);
//         return;
//       }
      
//       const updateData = { 
//         etat: etat,
//         date_derniere_maintenance: new Date().toISOString().split('T')[0]
//       };
      
//       console.log('📤 Données de mise à jour matériel:', updateData);
      
//       // Utiliser l'ID correct du matériel
//       const idToUpdate = materiel.id || materiel._id;
//       await materielsAPI.update(idToUpdate, updateData);
      
//       console.log(`✅ Matériel #${materielId} mis à jour avec état: ${etat}`);
      
//       // Rafraîchir la liste des matériels pour refléter le changement
//       fetchRelationsData();
      
//     } catch (error: any) {
//       console.error(`❌ Erreur mise à jour état matériel:`, error);
//       // Ne pas bloquer le processus principal
//       const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du matériel';
//       console.error(`Détails: ${errorMsg}`);
//     }
//   }, [materiels]);

//   // Fonction pour déterminer l'état du matériel basé sur la réparation
//   const getMaterielEtatFromReparation = useCallback((typeReparation: string, dateFin?: string): string => {
//     if (dateFin) {
//       // Réparation terminée -> matériel fonctionnel
//       return 'fonctionnel';
//     } else {
//       // Réparation en cours
//       switch (typeReparation) {
//         case 'corrective':
//           return 'en_panne';
//         case 'preventive':
//           return 'en_maintenance';
//         case 'ameliorative':
//           return 'en_amelioration';
//         default:
//           return 'en_reparation';
//       }
//     }
//   }, []);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des réparations...');
      
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log('✅ Réparations chargées:', extractedData.length);
      
//       setReparations(extractedData);
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des réparations';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);

//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Charger toutes les données au montage
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Filtrer les réparations
//   useEffect(() => {
//     let filtered = safeArray(reparations);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter(filtered, reparation => {
//         const technicien = getTechnicienName(reparation).toLowerCase();
//         return (
//           reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
//           reparation.description?.toLowerCase().includes(searchLower) ||
//           technicien.includes(searchLower)
//         );
//       });
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
//     }

//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = safeFilter(filtered, reparation => reparation.date_fin);
//       }
//     }

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut]);

//   // Gérer la sélection multiple
//   useEffect(() => {
//     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedReparations, filteredReparations]);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Trouver le nom du technicien
//   const getTechnicienName = useCallback((reparation: any): string => {
//     if (!reparation) return '';
    
//     const possibleFields = [
//       'technicien_responsable',
//       'technicien',
//       'responsable', 
//       'technician',
//       'technician_responsable',
//       'responsible_technician',
//       'tech_responsable',
//       'nom_technicien',
//       'technicien_nom',
//       'technician_name',
//       'responsible',
//       'assigné_à',
//       'assigned_to'
//     ];
    
//     for (const field of possibleFields) {
//       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
//         return reparation[field];
//       }
//     }
    
//     return '';
//   }, []);

//   // Formater la devise en Ariary
//   const formatCurrency = useCallback((amount: number | string): string => {
//     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(numAmount)) return '0 Ar';
//     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
//   }, []);

//   // Formater les nombres
//   const formatNumber = useCallback((num: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(num);
//   }, []);

//   // Gérer la soumission d'une réparation
//   // Modifier handleSubmit dans Reparations.tsx
// const handleSubmit = async (reparationData: any) => {
//   try {
//     console.log('📤 Données reçues du formulaire:', reparationData);
    
//     const currentUserName = getCurrentUserName();
//     console.log('👤 Technicien automatique:', currentUserName);
    
//     // CRITIQUE : S'assurer que le technicien n'est jamais null
//     let technicienResponsable = reparationData.technicien_responsable?.trim() || currentUserName;
    
//     // Validation supplémentaire
//     if (!technicienResponsable || technicienResponsable === '') {
//       technicienResponsable = 'Technicien DREN';
//       console.warn('⚠️ Technicien vide, valeur par défaut utilisée:', technicienResponsable);
//     }
    
//     console.log('✅ Technicien final:', technicienResponsable);
    
//     // Préparer les données pour l'API
//     const formattedData: any = {
//       materiel: reparationData.materiel,
//       type_reparation: reparationData.type_reparation,
//       date_debut: reparationData.date_debut,
//       cout: parseFloat(reparationData.cout) || 0,
//       technicien_responsable: technicienResponsable, // FORCÉ à ne jamais être null
//       description: reparationData.description || 'Réparation effectuée'
//     };
    
//     // Gérer date_fin - si vide, ne pas l'envoyer du tout
//     if (reparationData.date_fin && reparationData.date_fin.trim() !== '') {
//       formattedData.date_fin = reparationData.date_fin;
//     }
    
//     // Gérer incident - si null ou vide, ne pas l'envoyer
//     if (reparationData.incident && reparationData.incident !== '') {
//       formattedData.incident = reparationData.incident;
//     }
    
//     console.log('📝 Données formatées pour API:', formattedData);
//     console.log('🔍 Type de materiel:', typeof formattedData.materiel);
//     console.log('🔍 Type de technicien:', typeof formattedData.technicien_responsable);
    
//     let response;
    
//     if (editingReparation) {
//       console.log(`✏️ Modification réparation #${editingReparation.id}`);
//       response = await reparationsAPI.update(editingReparation.id, formattedData);
//       showMessage('success', 'Réparation modifiée avec succès');
//     } else {
//       console.log('🆕 Création nouvelle réparation');
//       response = await reparationsAPI.create(formattedData);
//       showMessage('success', 'Réparation créée avec succès');
//     }
    
//     console.log('✅ Réponse API:', response.data);
    
//     // Mettre à jour l'état du matériel
//     const materielId = reparationData.materiel;
//     if (materielId) {
//       const nouvelEtat = getMaterielEtatFromReparation(
//         reparationData.type_reparation, 
//         formattedData.date_fin
//       );
      
//       console.log(`🔄 Mise à jour matériel #${materielId} -> ${nouvelEtat}`);
      
//       try {
//         await updateMaterielEtat(materielId, nouvelEtat);
//         showMessage('info', `Matériel mis à jour: ${nouvelEtat}`);
//       } catch (error) {
//         console.error('❌ Erreur mise à jour matériel:', error);
//         // Ne pas bloquer l'utilisateur
//         showMessage('warning', 'Réparation enregistrée, mais erreur sur mise à jour matériel');
//       }
//     }
    
//     // Rafraîchir les données
//     await fetchReparations();
//     setIsFormOpen(false);
//     setEditingReparation(undefined);
    
//   } catch (error: any) {
//     console.error('❌ Erreur sauvegarde réparation:', error);
    
//     let errorMessage = 'Erreur lors de la sauvegarde de la réparation';
    
//     if (error.response?.data) {
//       // Essayez d'extraire le message d'erreur
//       const errorData = error.response.data;
      
//       if (typeof errorData === 'string') {
//         // Si c'est du HTML, chercher le message d'erreur
//         const match = errorData.match(/<pre class="exception_value">([^<]+)<\/pre>/);
//         if (match) {
//           errorMessage = match[1].trim();
//         }
//       } else if (errorData.detail) {
//         errorMessage = errorData.detail;
//       } else if (errorData.message) {
//         errorMessage = errorData.message;
//       } else if (Array.isArray(errorData.non_field_errors)) {
//         errorMessage = errorData.non_field_errors.join(', ');
//       }
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
    
//     showMessage('error', errorMessage);
    
//     console.error('🔍 Détails complets:', {
//       message: error.message,
//       response: error.response,
//       data: error.response?.data
//     });
//   }
// };
//   // Gérer l'édition
//   const handleEdit = (reparation: Reparation) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   // Gérer la suppression
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer la fin de réparation
//   const handleTerminer = async (id: number) => {
//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Trouver la réparation pour avoir l'ID du matériel
//       const reparation = reparations.find(r => r.id === id);
//       if (!reparation) {
//         throw new Error('Réparation non trouvée');
//       }
      
//       console.log(`🔧 Fin de réparation #${id} pour matériel`, reparation.materiel_id || reparation.materiel);
      
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName
//       });
      
//       // Mettre à jour l'état du matériel à "fonctionnel"
//       const materielId = reparation.materiel_id || reparation.materiel;
//       if (materielId) {
//         await updateMaterielEtat(materielId, 'fonctionnel');
//         showMessage('success', 'Réparation terminée et matériel marqué comme fonctionnel');
//       } else {
//         showMessage('success', 'Réparation terminée avec succès');
//       }
      
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'ajout d'une nouvelle réparation
//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Aucune donnée de relation disponible.');
//       return;
//     }

//     setEditingReparation(undefined);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Gérer la suppression multiple
//   const handleDeleteSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer l'édition multiple
//   const handleEditSelected = () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (selectedReparations.length === 1) {
//       const reparation = reparations.find(r => r.id === selectedReparations[0]);
//       if (reparation) {
//         handleEdit(reparation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
//       setEditingReparation(undefined);
//       setIsFormOpen(true);
//     }
//   };

//   // Gérer la fin de réparation multiple
//   const handleTerminerSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Traiter chaque réparation
//       for (const id of selectedReparations) {
//         const reparation = reparations.find(r => r.id === id);
//         if (!reparation) continue;
        
//         await reparationsAPI.update(id, { 
//           date_fin: new Date().toISOString(),
//           technicien_responsable: currentUserName
//         });
        
//         // Mettre à jour l'état du matériel
//         const materielId = reparation.materiel_id || reparation.materiel;
//         if (materielId) {
//           await updateMaterielEtat(materielId, 'fonctionnel');
//         }
//       }
      
//       showMessage('success', `${selectedReparations.length} réparation(s) terminée(s) et matériel(s) mis à jour`);
//       setSelectedReparations([]);
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Exporter en CSV
//   const handleExport = useCallback(() => {
//     try {
//       const dataToExport = filteredReparations.map(reparation => ({
//         'Matériel': reparation.materiel_nom || 'Non spécifié',
//         'Type': getTypeText(reparation.type_reparation),
//         'Technicien': getTechnicienName(reparation) || 'Non assigné',
//         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
//         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
//         'Statut': getStatutText(reparation),
//         'Description': reparation.description || 'Aucune description'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export CSV:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   }, [filteredReparations, getTechnicienName]);

//   // Fonctions d'affichage
//   const getTypeBadge = (type: string) => {
//     const badges = {
//       preventive: 'badge-info',
//       corrective: 'badge-warning',
//       ameliorative: 'badge-success'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       preventive: 'Préventive',
//       corrective: 'Corrective',
//       ameliorative: 'Améliorative'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     const icons = {
//       preventive: <Wrench className="h-4 w-4" />,
//       corrective: <Wrench className="h-4 w-4" />,
//       ameliorative: <CheckCircle className="h-4 w-4" />
//     };
//     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
//   };

//   const isEnCours = (reparation: Reparation) => {
//     return !reparation.date_fin;
//   };

//   const getStatutBadge = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'En cours' : 'Terminée';
//   };

//   const getStatutIcon = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 
//       <Calendar className="h-4 w-4" /> : 
//       <CheckCircle className="h-4 w-4" />;
//   };

//   // Obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedReparations([]);
//   };

//   // Rafraîchir les données
//   const handleRefresh = () => {
//     fetchReparations();
//     fetchRelationsData();
//     showMessage('info', '🔄 Données rafraîchies');
//   };

//   // Rendre la section statistiques
//   const renderStatistiquesSection = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {/* Carte Total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
//               <p className="text-sm opacity-60">Total réparations</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Package className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span className="text-success">{statistiques.terminees} terminées</span>
//             <span className="mx-2">•</span>
//             <span className="text-warning">{statistiques.enCours} en cours</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
//               <p className="text-sm opacity-60">Coût total</p>
//             </div>
//             <div className="p-2 bg-purple-500/10 rounded-lg">
//               <DollarSign className="h-6 w-6 text-purple-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût ce mois */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
//               <p className="text-sm opacity-60">Coût ce mois</p>
//             </div>
//             <div className="p-2 bg-blue-500/10 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-blue-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Durée moyenne */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
//               <p className="text-sm opacity-60">Jours moyen</p>
//             </div>
//             <div className="p-2 bg-green-500/10 rounded-lg">
//               <Clock className="h-6 w-6 text-green-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} réparations terminées</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Taux de complétion */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">
//                 {statistiques.total > 0 
//                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                   : '0%'
//                 }
//               </h3>
//               <p className="text-sm opacity-60">Taux de complétion</p>
//             </div>
//             <div className="p-2 bg-orange-500/10 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} / {statistiques.total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredReparations.length} réparation(s) trouvée(s)
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {getCurrentUserName()}
//             </span>
//           </p>
//           <p className="text-xs text-success opacity-70 mt-1">
//             ⚡ L'état du matériel est automatiquement mis à jour après chaque réparation
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleRefresh}
//             className="btn btn-outline btn-sm"
//             title="Rafraîchir"
//           >
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Rafraîchir
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle réparation
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques détaillées */}
//       {renderStatistiquesSection()}

//       {/* Section Utilisateur actuel */}
//       <div className="mb-6">
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Users className="h-5 w-5 text-success" />
//                 <div>
//                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
//                   <p className="text-sm">
//                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
//                   </p>
//                   <p className="text-xs text-success opacity-70 mt-1">
//                     ⚡ Ce nom sera automatiquement utilisé comme "technicien responsable".
//                     <br />
//                     🔄 L'état du matériel sera mis à jour automatiquement après chaque réparation.
//                   </p>
//                 </div>
//               </div>
//               <div className="badge badge-success badge-lg">
//                 Connecté
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section État des matériels */}
//       <div className="mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4">
//             <h3 className="font-bold text-base-content mb-3">📊 État des matériels après réparation</h3>
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
//           </div>
//         </div>
//       </div>

//       {/* Section Top Techniciens */}
//       {statistiques.topTechniciens.length > 0 && (
//         <div className="mb-6">
//           <div className="card bg-base-200 shadow-sm">
//             <div className="card-body p-4">
//               <h3 className="font-bold text-base-content mb-3">🏆 Top Techniciens</h3>
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                 {statistiques.topTechniciens.map((tech, index) => (
//                   <div key={index} className="bg-base-100 p-3 rounded-lg">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-sm truncate">{tech.technicien}</span>
//                       <span className="badge badge-primary badge-sm">{tech.count}</span>
//                     </div>
//                     <div className="text-xs opacity-70">
//                       Coût: {formatCurrency(tech.cout)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

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
//                   placeholder="Matériel, technicien..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🛠️ Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
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
//                 <option value="en_cours">En cours</option>
//                 <option value="terminee">Terminée</option>
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
//           </div>

//           {/* Actions de sélection */}
//           {selectedReparations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedReparations.length} réparation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
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

//       {/* Tableau des réparations */}
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
//                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Technicien</th>
//                   <th className="font-bold">Date début</th>
//                   <th className="font-bold">Date fin</th>
//                   <th className="font-bold">Coût</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredReparations).map((reparation) => {
//                   const technicien = getTechnicienName(reparation);
//                   const isCurrentUser = technicien === getCurrentUserName();
                  
//                   return (
//                     <tr key={reparation.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedReparations.includes(reparation.id)}
//                             onChange={() => toggleSelectReparation(reparation.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {reparation.materiel_nom}
//                           <div className="text-xs opacity-60">
//                             ID: {reparation.materiel_id || reparation.materiel}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
//                           {getTypeIcon(reparation.type_reparation)}
//                           {getTypeText(reparation.type_reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {technicien ? (
//                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
//                               <span>{technicien}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-base-content opacity-50">Non assigné</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm">
//                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                       </td>
//                       <td>
//                         {reparation.date_fin ? (
//                           <span className="text-sm">
//                             {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
//                           </span>
//                         ) : (
//                           <div className="badge badge-warning badge-sm">En cours</div>
//                         )}
//                       </td>
//                       <td>
//                         {reparation.cout ? (
//                           <span className="font-semibold text-green-600 text-sm">
//                             {reparation.cout.toLocaleString('fr-FR')} Ar
//                           </span>
//                         ) : (
//                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
//                           {getStatutIcon(reparation)}
//                           {getStatutText(reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(reparation)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {isEnCours(reparation) && (
//                             <button
//                               onClick={() => handleTerminer(reparation.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Terminer la réparation"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(reparation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredReparations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Wrench className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType || filterStatut
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune réparation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()}
//       />
//     </div>
//   );
// };

// export default Reparations;















// // import React, { useState, useEffect, useCallback, useMemo } from 'react';
// // import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package, AlertTriangle, RefreshCw } from 'lucide-react';
// // import { Reparation } from '../types';
// // import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// // import ReparationForm from '../components/ReparationForm';
// // import { useAuth } from '../context/AuthContext';

// // // Fonctions helper pour la sécurité des tableaux
// // const safeArray = (data: any): Reparation[] => {
// //   return Array.isArray(data) ? data : [];
// // };

// // const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // // Type pour les messages
// // type MessageType = 'success' | 'error' | 'info' | 'warning';

// // // Type pour les statistiques
// // interface StatistiquesReparations {
// //   total: number;
// //   enCours: number;
// //   terminees: number;
// //   coutTotal: number;
// //   coutMois: number;
// //   coutMoyen: number;
// //   dureeMoyenne: number;
// //   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
// //   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// // }

// // const Reparations: React.FC = () => {
// //   const { user } = useAuth();
  
// //   const [reparations, setReparations] = useState<Reparation[]>([]);
// //   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string>('');
// //   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
// //   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
// //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
// //   // États pour les filtres
// //   const [searchTerm, setSearchTerm] = useState<string>('');
// //   const [filterType, setFilterType] = useState<string>('');
// //   const [filterStatut, setFilterStatut] = useState<string>('');

// //   // États pour les données de relations
// //   const [materiels, setMateriels] = useState<any[]>([]);
// //   const [incidents, setIncidents] = useState<any[]>([]);
// //   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

// //   // Statistiques détaillées
// //   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
// //     total: 0,
// //     enCours: 0,
// //     terminees: 0,
// //     coutTotal: 0,
// //     coutMois: 0,
// //     coutMoyen: 0,
// //     dureeMoyenne: 0,
// //     reparationsParMois: [],
// //     topTechniciens: []
// //   });

// //   // Récupérer le nom de l'utilisateur connecté
// //   const getCurrentUserName = useCallback(() => {
// //     if (!user) return 'Utilisateur Inconnu';
    
// //     if (user.nom_complet) return user.nom_complet;
// //     if (user.full_name) return user.full_name;
// //     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
// //     if (user.name) return user.name;
// //     if (user.username) return user.username;
    
// //     return 'Technicien';
// //   }, [user]);

// //   // Fonction pour calculer les statistiques
// //   const calculerStatistiques = useCallback((data: Reparation[]) => {
// //     if (!data || data.length === 0) {
// //       setStatistiques({
// //         total: 0,
// //         enCours: 0,
// //         terminees: 0,
// //         coutTotal: 0,
// //         coutMois: 0,
// //         coutMoyen: 0,
// //         dureeMoyenne: 0,
// //         reparationsParMois: [],
// //         topTechniciens: []
// //       });
// //       return;
// //     }

// //     const now = new Date();
// //     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
// //     // Calculs de base
// //     const reparationsEnCours = data.filter(r => !r.date_fin);
// //     const reparationsTerminees = data.filter(r => r.date_fin);
// //     const reparationsCeMois = data.filter(r => 
// //       r.date_debut && new Date(r.date_debut) >= debutMois
// //     );
    
// //     // Calcul des coûts
// //     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
// //     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
// //     // Calcul du coût moyen
// //     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
// //     // Calcul de la durée moyenne des réparations terminées
// //     let dureeTotale = 0;
// //     let reparationsAvecDuree = 0;
    
// //     reparationsTerminees.forEach(rep => {
// //       if (rep.date_debut && rep.date_fin) {
// //         try {
// //           const dateDebut = new Date(rep.date_debut);
// //           const dateFin = new Date(rep.date_fin);
// //           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
// //             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
// //             dureeTotale += duree;
// //             reparationsAvecDuree++;
// //           }
// //         } catch (e) {
// //           console.warn('Erreur calcul durée:', e);
// //         }
// //       }
// //     });
    
// //     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
// //     // Réparations par mois (6 derniers mois)
// //     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
// //     const moisActuel = new Date();
    
// //     for (let i = 5; i >= 0; i--) {
// //       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
// //       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
// //       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
// //     }
    
// //     data.forEach(rep => {
// //       if (rep.date_debut) {
// //         try {
// //           const date = new Date(rep.date_debut);
// //           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
// //           if (reparationsParMoisMap[moisKey]) {
// //             reparationsParMoisMap[moisKey].count++;
// //             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
// //           }
// //         } catch (e) {
// //           console.warn('Erreur date réparation:', e);
// //         }
// //       }
// //     });
    
// //     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
// //       mois,
// //       count: data.count,
// //       cout: data.cout
// //     }));
    
// //     // Top techniciens
// //     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
// //     data.forEach(rep => {
// //       const technicien = getTechnicienName(rep) || 'Non assigné';
// //       if (!techniciensMap[technicien]) {
// //         techniciensMap[technicien] = { count: 0, cout: 0 };
// //       }
// //       techniciensMap[technicien].count++;
// //       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
// //     });
    
// //     const topTechniciens = Object.entries(techniciensMap)
// //       .map(([technicien, data]) => ({ technicien, ...data }))
// //       .sort((a, b) => b.count - a.count)
// //       .slice(0, 5);
    
// //     setStatistiques({
// //       total: data.length,
// //       enCours: reparationsEnCours.length,
// //       terminees: reparationsTerminees.length,
// //       coutTotal,
// //       coutMois,
// //       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
// //       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
// //       reparationsParMois,
// //       topTechniciens
// //     });
// //   }, []);

// //   // Fonction pour mettre à jour l'état du matériel
// //   const updateMaterielEtat = useCallback(async (materielId: number, etat: string) => {
// //     try {
// //       console.log(`🔄 Mise à jour état matériel #${materielId} -> ${etat}`);
      
// //       // Trouver le matériel pour vérifier son existence
// //       const materiel = materiels.find(m => 
// //         m.id === materielId || 
// //         m._id === materielId || 
// //         m.id?.toString() === materielId.toString()
// //       );
      
// //       if (!materiel) {
// //         console.warn(`⚠️ Matériel #${materielId} non trouvé dans la liste locale`);
// //         return;
// //       }
      
// //       const updateData = { 
// //         etat: etat,
// //         date_derniere_maintenance: new Date().toISOString().split('T')[0]
// //       };
      
// //       console.log('📤 Données de mise à jour matériel:', updateData);
      
// //       // Utiliser l'ID correct du matériel
// //       const idToUpdate = materiel.id || materiel._id;
// //       await materielsAPI.update(idToUpdate, updateData);
      
// //       console.log(`✅ Matériel #${materielId} mis à jour avec état: ${etat}`);
      
// //       // Rafraîchir la liste des matériels pour refléter le changement
// //       fetchRelationsData();
      
// //     } catch (error: any) {
// //       console.error(`❌ Erreur mise à jour état matériel:`, error);
// //       // Ne pas bloquer le processus principal
// //       const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du matériel';
// //       console.error(`Détails: ${errorMsg}`);
// //     }
// //   }, [materiels]);

// //   // Fonction pour déterminer l'état du matériel basé sur la réparation
// //   const getMaterielEtatFromReparation = useCallback((typeReparation: string, dateFin?: string): string => {
// //     if (dateFin) {
// //       // Réparation terminée -> matériel fonctionnel
// //       return 'fonctionnel';
// //     } else {
// //       // Réparation en cours
// //       switch (typeReparation) {
// //         case 'corrective':
// //           return 'en_panne';
// //         case 'preventive':
// //           return 'en_maintenance';
// //         case 'ameliorative':
// //           return 'en_amelioration';
// //         default:
// //           return 'en_reparation';
// //       }
// //     }
// //   }, []);

// //   // NOUVELLE FONCTION: Pour déterminer l'état du matériel quand une réparation est terminée
// //   const getMaterielEtatApresReparation = useCallback((typeReparation: string): string => {
// //     // Quand une réparation est terminée, le matériel devient toujours "fonctionnel"
// //     // sauf si c'était une réparation corrective où on peut le mettre en "réparé"
// //     switch (typeReparation) {
// //       case 'corrective':
// //         return 'repare'; // Après une corrective terminée, le matériel est "réparé"
// //       case 'preventive':
// //         return 'fonctionnel'; // Après une préventive terminée
// //       case 'ameliorative':
// //         return 'fonctionnel'; // Après une améliorative terminée
// //       default:
// //         return 'fonctionnel';
// //     }
// //   }, []);

// //   // Charger les réparations
// //   const fetchReparations = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       console.log('🔄 Chargement des réparations...');
      
// //       const response = await reparationsAPI.getAll();
// //       const extractedData = extractDataFromResponse(response);
      
// //       console.log('✅ Réparations chargées:', extractedData.length);
      
// //       setReparations(extractedData);
// //       calculerStatistiques(extractedData);
      
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement réparations:', err);
// //       const errorMessage = err.response?.data?.message || 
// //                           err.message || 
// //                           'Erreur lors du chargement des réparations';
// //       setError(errorMessage);
// //       showMessage('error', errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Charger les données de relations
// //   const fetchRelationsData = async () => {
// //     try {
// //       setLoadingRelations(true);

// //       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
// //         materielsAPI.getAll().catch(err => {
// //           console.error('❌ Erreur chargement matériels:', err);
// //           return { data: [] };
// //         }),
// //         incidentsAPI.getAll().catch(err => {
// //           console.error('❌ Erreur chargement incidents:', err);
// //           return { data: [] };
// //         })
// //       ]);

// //       const materielsData = materielsResponse.status === 'fulfilled' 
// //         ? extractDataFromResponse(materielsResponse.value) 
// //         : [];
      
// //       const incidentsData = incidentsResponse.status === 'fulfilled' 
// //         ? extractDataFromResponse(incidentsResponse.value) 
// //         : [];

// //       setMateriels(materielsData);
// //       setIncidents(incidentsData);

// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement relations:', err);
// //       showMessage('error', 'Erreur lors du chargement des données');
// //       setMateriels([]);
// //       setIncidents([]);
// //     } finally {
// //       setLoadingRelations(false);
// //     }
// //   };

// //   // Charger toutes les données au montage
// //   useEffect(() => {
// //     fetchReparations();
// //     fetchRelationsData();
// //   }, []);

// //   // Filtrer les réparations
// //   useEffect(() => {
// //     let filtered = safeArray(reparations);

// //     if (searchTerm) {
// //       const searchLower = searchTerm.toLowerCase();
// //       filtered = safeFilter(filtered, reparation => {
// //         const technicien = getTechnicienName(reparation).toLowerCase();
// //         return (
// //           reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
// //           reparation.description?.toLowerCase().includes(searchLower) ||
// //           technicien.includes(searchLower)
// //         );
// //       });
// //     }

// //     if (filterType) {
// //       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
// //     }

// //     if (filterStatut) {
// //       if (filterStatut === 'en_cours') {
// //         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
// //       } else if (filterStatut === 'terminee') {
// //         filtered = safeFilter(filtered, reparation => reparation.date_fin);
// //       }
// //     }

// //     setFilteredReparations(filtered);
// //     setSelectedReparations([]);
// //   }, [reparations, searchTerm, filterType, filterStatut]);

// //   // Gérer la sélection multiple
// //   useEffect(() => {
// //     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
// //       setIsSelectAll(true);
// //     } else {
// //       setIsSelectAll(false);
// //     }
// //   }, [selectedReparations, filteredReparations]);

// //   // Afficher un message
// //   const showMessage = (type: MessageType, text: string) => {
// //     setMessage({ type, text });
// //     setTimeout(() => setMessage(null), 5000);
// //   };

// //   // Trouver le nom du technicien
// //   const getTechnicienName = useCallback((reparation: any): string => {
// //     if (!reparation) return '';
    
// //     const possibleFields = [
// //       'technicien_responsable',
// //       'technicien',
// //       'responsable', 
// //       'technician',
// //       'technician_responsable',
// //       'responsible_technician',
// //       'tech_responsable',
// //       'nom_technicien',
// //       'technicien_nom',
// //       'technician_name',
// //       'responsible',
// //       'assigné_à',
// //       'assigned_to'
// //     ];
    
// //     for (const field of possibleFields) {
// //       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
// //         return reparation[field];
// //       }
// //     }
    
// //     return '';
// //   }, []);

// //   // Formater la devise en Ariary
// //   const formatCurrency = useCallback((amount: number | string): string => {
// //     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
// //     if (isNaN(numAmount)) return '0 Ar';
// //     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
// //   }, []);

// //   // Formater les nombres
// //   const formatNumber = useCallback((num: number): string => {
// //     return new Intl.NumberFormat('fr-FR').format(num);
// //   }, []);

// //   // Gérer la soumission d'une réparation
// //   const handleSubmit = async (reparationData: any) => {
// //     try {
// //       console.log('📤 Données reçues du formulaire:', reparationData);
      
// //       const currentUserName = getCurrentUserName();
// //       console.log('👤 Technicien automatique:', currentUserName);
      
// //       // CRITIQUE : S'assurer que le technicien n'est jamais null
// //       let technicienResponsable = reparationData.technicien_responsable?.trim() || currentUserName;
      
// //       // Validation supplémentaire
// //       if (!technicienResponsable || technicienResponsable === '') {
// //         technicienResponsable = 'Technicien DREN';
// //         console.warn('⚠️ Technicien vide, valeur par défaut utilisée:', technicienResponsable);
// //       }
      
// //       console.log('✅ Technicien final:', technicienResponsable);
      
// //       // Préparer les données pour l'API
// //       const formattedData: any = {
// //         materiel: reparationData.materiel,
// //         type_reparation: reparationData.type_reparation,
// //         date_debut: reparationData.date_debut,
// //         cout: parseFloat(reparationData.cout) || 0,
// //         technicien_responsable: technicienResponsable, // FORCÉ à ne jamais être null
// //         description: reparationData.description || 'Réparation effectuée'
// //       };
      
// //       // Gérer date_fin - si vide, ne pas l'envoyer du tout
// //       if (reparationData.date_fin && reparationData.date_fin.trim() !== '') {
// //         formattedData.date_fin = reparationData.date_fin;
// //       }
      
// //       // Gérer incident - si null ou vide, ne pas l'envoyer
// //       if (reparationData.incident && reparationData.incident !== '') {
// //         formattedData.incident = reparationData.incident;
// //       }
      
// //       console.log('📝 Données formatées pour API:', formattedData);
// //       console.log('🔍 Type de materiel:', typeof formattedData.materiel);
// //       console.log('🔍 Type de technicien:', typeof formattedData.technicien_responsable);
      
// //       let response;
      
// //       if (editingReparation) {
// //         console.log(`✏️ Modification réparation #${editingReparation.id}`);
// //         response = await reparationsAPI.update(editingReparation.id, formattedData);
// //         showMessage('success', 'Réparation modifiée avec succès');
// //       } else {
// //         console.log('🆕 Création nouvelle réparation');
// //         response = await reparationsAPI.create(formattedData);
// //         showMessage('success', 'Réparation créée avec succès');
// //       }
      
// //       console.log('✅ Réponse API:', response.data);
      
// //       // Mettre à jour l'état du matériel
// //       const materielId = reparationData.materiel;
// //       if (materielId) {
// //         const nouvelEtat = getMaterielEtatFromReparation(
// //           reparationData.type_reparation, 
// //           formattedData.date_fin
// //         );
        
// //         console.log(`🔄 Mise à jour matériel #${materielId} -> ${nouvelEtat}`);
        
// //         try {
// //           await updateMaterielEtat(materielId, nouvelEtat);
// //           showMessage('info', `Matériel mis à jour: ${nouvelEtat}`);
// //         } catch (error) {
// //           console.error('❌ Erreur mise à jour matériel:', error);
// //           // Ne pas bloquer l'utilisateur
// //           showMessage('warning', 'Réparation enregistrée, mais erreur sur mise à jour matériel');
// //         }
// //       }
      
// //       // Rafraîchir les données
// //       await fetchReparations();
// //       setIsFormOpen(false);
// //       setEditingReparation(undefined);
      
// //     } catch (error: any) {
// //       console.error('❌ Erreur sauvegarde réparation:', error);
      
// //       let errorMessage = 'Erreur lors de la sauvegarde de la réparation';
      
// //       if (error.response?.data) {
// //         // Essayez d'extraire le message d'erreur
// //         const errorData = error.response.data;
        
// //         if (typeof errorData === 'string') {
// //           // Si c'est du HTML, chercher le message d'erreur
// //           const match = errorData.match(/<pre class="exception_value">([^<]+)<\/pre>/);
// //           if (match) {
// //             errorMessage = match[1].trim();
// //           }
// //         } else if (errorData.detail) {
// //           errorMessage = errorData.detail;
// //         } else if (errorData.message) {
// //           errorMessage = errorData.message;
// //         } else if (Array.isArray(errorData.non_field_errors)) {
// //           errorMessage = errorData.non_field_errors.join(', ');
// //         }
// //       } else if (error.message) {
// //         errorMessage = error.message;
// //       }
      
// //       showMessage('error', errorMessage);
      
// //       console.error('🔍 Détails complets:', {
// //         message: error.message,
// //         response: error.response,
// //         data: error.response?.data
// //       });
// //     }
// //   };

// //   // Gérer l'édition
// //   const handleEdit = (reparation: Reparation) => {
// //     if (loadingRelations) {
// //       showMessage('info', 'Chargement des données en cours...');
// //       return;
// //     }

// //     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
// //     if (!hasRelationsData) {
// //       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
// //       return;
// //     }

// //     setEditingReparation(reparation);
// //     setIsFormOpen(true);
// //   };

// //   // Gérer la suppression
// //   const handleDelete = async (id: number) => {
// //     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
// //       try {
// //         await reparationsAPI.delete(id);
// //         showMessage('success', 'Réparation supprimée avec succès');
// //         fetchReparations();
// //       } catch (error: any) {
// //         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
// //         showMessage('error', errorMessage);
// //       }
// //     }
// //   };

// //   // CORRECTION: Gérer la fin de réparation
// //   const handleTerminer = async (id: number) => {
// //     try {
// //       const currentUserName = getCurrentUserName();
      
// //       if (!currentUserName || currentUserName.trim() === '') {
// //         throw new Error('Nom du technicien non disponible');
// //       }
      
// //       // Trouver la réparation pour avoir l'ID du matériel et le type
// //       const reparation = reparations.find(r => r.id === id);
// //       if (!reparation) {
// //         throw new Error('Réparation non trouvée');
// //       }
      
// //       console.log(`🔧 Fin de réparation #${id} pour matériel`, reparation.materiel_id || reparation.materiel);
      
// //       // Mettre à jour la réparation avec la date de fin
// //       await reparationsAPI.update(id, { 
// //         date_fin: new Date().toISOString(),
// //         technicien_responsable: currentUserName
// //       });
      
// //       // CORRECTION: Mettre à jour l'état du matériel selon le type de réparation
// //       const materielId = reparation.materiel_id || reparation.materiel;
// //       if (materielId) {
// //         const nouvelEtat = getMaterielEtatApresReparation(reparation.type_reparation);
// //         await updateMaterielEtat(materielId, nouvelEtat);
// //         showMessage('success', `Réparation terminée et matériel marqué comme ${nouvelEtat}`);
// //       } else {
// //         showMessage('success', 'Réparation terminée avec succès');
// //       }
      
// //       fetchReparations();
// //     } catch (error: any) {
// //       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
// //       showMessage('error', errorMessage);
// //     }
// //   };

// //   // Gérer l'ajout d'une nouvelle réparation
// //   const handleAddNew = () => {
// //     if (loadingRelations) {
// //       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
// //       return;
// //     }
    
// //     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
// //     if (!hasRelationsData) {
// //       showMessage('warning', 'Aucune donnée de relation disponible.');
// //       return;
// //     }

// //     setEditingReparation(undefined);
// //     setIsFormOpen(true);
// //   };

// //   // Fonctions de sélection
// //   const toggleSelectReparation = (id: number) => {
// //     setSelectedReparations(prev => 
// //       prev.includes(id) 
// //         ? prev.filter(item => item !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   const toggleSelectAll = () => {
// //     if (isSelectAll) {
// //       setSelectedReparations([]);
// //     } else {
// //       const allIds = filteredReparations.map(r => r.id);
// //       setSelectedReparations(allIds);
// //     }
// //   };

// //   // Gérer la suppression multiple
// //   const handleDeleteSelected = async () => {
// //     if (selectedReparations.length === 0) {
// //       showMessage('error', 'Aucune réparation sélectionnée');
// //       return;
// //     }

// //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
// //       try {
// //         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
// //         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
// //         setSelectedReparations([]);
// //         fetchReparations();
// //       } catch (error: any) {
// //         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
// //         showMessage('error', errorMessage);
// //       }
// //     }
// //   };

// //   // Gérer l'édition multiple
// //   const handleEditSelected = () => {
// //     if (selectedReparations.length === 0) {
// //       showMessage('error', 'Aucune réparation sélectionnée');
// //       return;
// //     }

// //     if (selectedReparations.length === 1) {
// //       const reparation = reparations.find(r => r.id === selectedReparations[0]);
// //       if (reparation) {
// //         handleEdit(reparation);
// //       }
// //     } else {
// //       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
// //       setEditingReparation(undefined);
// //       setIsFormOpen(true);
// //     }
// //   };

// //   // CORRECTION: Gérer la fin de réparation multiple
// //   const handleTerminerSelected = async () => {
// //     if (selectedReparations.length === 0) {
// //       showMessage('error', 'Aucune réparation sélectionnée');
// //       return;
// //     }

// //     try {
// //       const currentUserName = getCurrentUserName();
      
// //       if (!currentUserName || currentUserName.trim() === '') {
// //         throw new Error('Nom du technicien non disponible');
// //       }
      
// //       // Traiter chaque réparation
// //       for (const id of selectedReparations) {
// //         const reparation = reparations.find(r => r.id === id);
// //         if (!reparation) continue;
        
// //         await reparationsAPI.update(id, { 
// //           date_fin: new Date().toISOString(),
// //           technicien_responsable: currentUserName
// //         });
        
// //         // CORRECTION: Mettre à jour l'état du matériel selon le type
// //         const materielId = reparation.materiel_id || reparation.materiel;
// //         if (materielId) {
// //           const nouvelEtat = getMaterielEtatApresReparation(reparation.type_reparation);
// //           await updateMaterielEtat(materielId, nouvelEtat);
// //         }
// //       }
      
// //       showMessage('success', `${selectedReparations.length} réparation(s) terminée(s) et matériel(s) mis à jour`);
// //       setSelectedReparations([]);
// //       fetchReparations();
// //     } catch (error: any) {
// //       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
// //       showMessage('error', errorMessage);
// //     }
// //   };

// //   // Exporter en CSV
// //   const handleExport = useCallback(() => {
// //     try {
// //       const dataToExport = filteredReparations.map(reparation => ({
// //         'Matériel': reparation.materiel_nom || 'Non spécifié',
// //         'Type': getTypeText(reparation.type_reparation),
// //         'Technicien': getTechnicienName(reparation) || 'Non assigné',
// //         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
// //         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
// //         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
// //         'Statut': getStatutText(reparation),
// //         'Description': reparation.description || 'Aucune description'
// //       }));

// //       const csvContent = [
// //         Object.keys(dataToExport[0] || {}).join(','),
// //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// //       ].join('\n');

// //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //       const link = document.createElement('a');
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
// //       link.style.visibility = 'hidden';
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);

// //       showMessage('success', 'Export CSV réussi !');
// //     } catch (error) {
// //       console.error('❌ Erreur export CSV:', error);
// //       showMessage('error', 'Erreur lors de l\'export');
// //     }
// //   }, [filteredReparations, getTechnicienName]);

// //   // Fonctions d'affichage
// //   const getTypeBadge = (type: string) => {
// //     const badges = {
// //       preventive: 'badge-info',
// //       corrective: 'badge-warning',
// //       ameliorative: 'badge-success'
// //     };
// //     return badges[type as keyof typeof badges] || 'badge-neutral';
// //   };

// //   const getTypeText = (type: string) => {
// //     const texts = {
// //       preventive: 'Préventive',
// //       corrective: 'Corrective',
// //       ameliorative: 'Améliorative'
// //     };
// //     return texts[type as keyof typeof texts] || type;
// //   };

// //   const getTypeIcon = (type: string) => {
// //     const icons = {
// //       preventive: <Wrench className="h-4 w-4" />,
// //       corrective: <Wrench className="h-4 w-4" />,
// //       ameliorative: <CheckCircle className="h-4 w-4" />
// //     };
// //     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
// //   };

// //   const isEnCours = (reparation: Reparation) => {
// //     return !reparation.date_fin;
// //   };

// //   const getStatutBadge = (reparation: Reparation) => {
// //     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
// //   };

// //   const getStatutText = (reparation: Reparation) => {
// //     return isEnCours(reparation) ? 'En cours' : 'Terminée';
// //   };

// //   const getStatutIcon = (reparation: Reparation) => {
// //     return isEnCours(reparation) ? 
// //       <Calendar className="h-4 w-4" /> : 
// //       <CheckCircle className="h-4 w-4" />;
// //   };

// //   // Obtenir la classe CSS du message
// //   const getAlertClass = (type: MessageType) => {
// //     switch (type) {
// //       case 'success': return 'alert-success';
// //       case 'error': return 'alert-error';
// //       case 'warning': return 'alert-warning';
// //       case 'info': return 'alert-info';
// //       default: return 'alert-info';
// //     }
// //   };

// //   // Réinitialiser les filtres
// //   const resetFilters = () => {
// //     setSearchTerm('');
// //     setFilterType('');
// //     setFilterStatut('');
// //     setSelectedReparations([]);
// //   };

// //   // Rafraîchir les données
// //   const handleRefresh = () => {
// //     fetchReparations();
// //     fetchRelationsData();
// //     showMessage('info', '🔄 Données rafraîchies');
// //   };

// //   // Rendre la section statistiques
// //   const renderStatistiquesSection = () => (
// //     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
// //       {/* Carte Total */}
// //       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
// //         <div className="card-body p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
// //               <p className="text-sm opacity-60">Total réparations</p>
// //             </div>
// //             <div className="p-2 bg-primary/10 rounded-lg">
// //               <Package className="h-6 w-6 text-primary" />
// //             </div>
// //           </div>
// //           <div className="mt-2 text-xs">
// //             <span className="text-success">{statistiques.terminees} terminées</span>
// //             <span className="mx-2">•</span>
// //             <span className="text-warning">{statistiques.enCours} en cours</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Carte Coût total */}
// //       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
// //         <div className="card-body p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
// //               <p className="text-sm opacity-60">Coût total</p>
// //             </div>
// //             <div className="p-2 bg-purple-500/10 rounded-lg">
// //               <DollarSign className="h-6 w-6 text-purple-500" />
// //             </div>
// //           </div>
// //           <div className="mt-2 text-xs">
// //             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Carte Coût ce mois */}
// //       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
// //         <div className="card-body p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
// //               <p className="text-sm opacity-60">Coût ce mois</p>
// //             </div>
// //             <div className="p-2 bg-blue-500/10 rounded-lg">
// //               <TrendingUp className="h-6 w-6 text-blue-500" />
// //             </div>
// //           </div>
// //           <div className="mt-2 text-xs">
// //             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Carte Durée moyenne */}
// //       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
// //         <div className="card-body p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
// //               <p className="text-sm opacity-60">Jours moyen</p>
// //             </div>
// //             <div className="p-2 bg-green-500/10 rounded-lg">
// //               <Clock className="h-6 w-6 text-green-500" />
// //             </div>
// //           </div>
// //           <div className="mt-2 text-xs">
// //             <span>{statistiques.terminees} réparations terminées</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Carte Taux de complétion */}
// //       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
// //         <div className="card-body p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-lg font-bold">
// //                 {statistiques.total > 0 
// //                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
// //                   : '0%'
// //                 }
// //               </h3>
// //               <p className="text-sm opacity-60">Taux de complétion</p>
// //             </div>
// //             <div className="p-2 bg-orange-500/10 rounded-lg">
// //               <CheckCircle className="h-6 w-6 text-orange-500" />
// //             </div>
// //           </div>
// //           <div className="mt-2 text-xs">
// //             <span>{statistiques.terminees} / {statistiques.total}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   if (loading) {
// //     return (
// //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-4">
// //           <span className="loading loading-spinner loading-lg text-primary"></span>
// //           <p className="text-base-content">Chargement des réparations...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 bg-base-100 min-h-screen">
// //       {/* Messages */}
// //       {message && (
// //         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
// //           <span>{message.text}</span>
// //         </div>
// //       )}

// //       {error && (
// //         <div className="alert alert-error mb-4">
// //           <span>{error}</span>
// //         </div>
// //       )}

// //       {/* En-tête */}
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
// //           <p className="text-base-content opacity-60 mt-1">
// //             {filteredReparations.length} réparation(s) trouvée(s)
// //             <span className="ml-2 text-success font-medium">
// //               • 👤 Connecté: {getCurrentUserName()}
// //             </span>
// //           </p>
// //           <p className="text-xs text-success opacity-70 mt-1">
// //             ⚡ L'état du matériel est automatiquement mis à jour après chaque réparation
// //           </p>
// //         </div>
// //         <div className="flex gap-2">
// //           <button
// //             onClick={handleRefresh}
// //             className="btn btn-outline btn-sm"
// //             title="Rafraîchir"
// //           >
// //             <RefreshCw className="h-4 w-4 mr-2" />
// //             Rafraîchir
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
// //             disabled={loadingRelations}
// //           >
// //             <Plus className="h-4 w-4 mr-2" />
// //             Nouvelle réparation
// //           </button>
// //         </div>
// //       </div>

// //       {/* Section Statistiques détaillées */}
// //       {renderStatistiquesSection()}

// //       {/* Section Utilisateur actuel */}
// //       <div className="mb-6">
// //         <div className="card bg-success/10 shadow-sm">
// //           <div className="card-body p-4">
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center gap-3">
// //                 <Users className="h-5 w-5 text-success" />
// //                 <div>
// //                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
// //                   <p className="text-sm">
// //                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
// //                   </p>
// //                   <p className="text-xs text-success opacity-70 mt-1">
// //                     ⚡ Ce nom sera automatiquement utilisé comme "technicien responsable".
// //                     <br />
// //                     🔄 L'état du matériel sera mis à jour automatiquement après chaque réparation.
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="badge badge-success badge-lg">
// //                 Connecté
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section État des matériels */}
// //       <div className="mb-6">
// //         <div className="card bg-base-200 shadow-sm">
// //           <div className="card-body p-4">
// //             <h3 className="font-bold text-base-content mb-3">📊 État des matériels après réparation</h3>
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

// //       {/* Section Top Techniciens */}
// //       {statistiques.topTechniciens.length > 0 && (
// //         <div className="mb-6">
// //           <div className="card bg-base-200 shadow-sm">
// //             <div className="card-body p-4">
// //               <h3 className="font-bold text-base-content mb-3">🏆 Top Techniciens</h3>
// //               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
// //                 {statistiques.topTechniciens.map((tech, index) => (
// //                   <div key={index} className="bg-base-100 p-3 rounded-lg">
// //                     <div className="flex items-center justify-between mb-2">
// //                       <span className="font-medium text-sm truncate">{tech.technicien}</span>
// //                       <span className="badge badge-primary badge-sm">{tech.count}</span>
// //                     </div>
// //                     <div className="text-xs opacity-70">
// //                       Coût: {formatCurrency(tech.cout)}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

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
// //                   placeholder="Matériel, technicien..."
// //                   className="input input-bordered w-full pl-10 bg-base-100"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🛠️ Type</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterType}
// //                 onChange={(e) => setFilterType(e.target.value)}
// //               >
// //                 <option value="">Tous les types</option>
// //                 <option value="preventive">Préventive</option>
// //                 <option value="corrective">Corrective</option>
// //                 <option value="ameliorative">Améliorative</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">📊 Statut</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterStatut}
// //                 onChange={(e) => setFilterStatut(e.target.value)}
// //               >
// //                 <option value="">Tous les statuts</option>
// //                 <option value="en_cours">En cours</option>
// //                 <option value="terminee">Terminée</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔄 Actions</span>
// //               </label>
// //               <button
// //                 onClick={resetFilters}
// //                 className="btn btn-outline w-full gap-2"
// //               >
// //                 <Filter className="h-4 w-4" />
// //                 Réinitialiser
// //               </button>
// //             </div>
// //           </div>

// //           {/* Actions de sélection */}
// //           {selectedReparations.length > 0 && (
// //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-4">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// //                     <span className="font-semibold text-primary text-lg">
// //                       {selectedReparations.length} réparation(s) sélectionnée(s)
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={handleTerminerSelected}
// //                     className="btn btn-success btn-sm gap-2"
// //                   >
// //                     <CheckCircle className="h-4 w-4" />
// //                     Terminer ({selectedReparations.length})
// //                   </button>
// //                   <button
// //                     onClick={handleEditSelected}
// //                     className="btn btn-primary btn-sm gap-2"
// //                   >
// //                     <Edit className="h-4 w-4" />
// //                     Modifier ({selectedReparations.length})
// //                   </button>
// //                   <button
// //                     onClick={handleDeleteSelected}
// //                     className="btn btn-outline btn-error btn-sm gap-2"
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                     Supprimer ({selectedReparations.length})
// //                   </button>
// //                   <button
// //                     onClick={() => setSelectedReparations([])}
// //                     className="btn btn-ghost btn-sm"
// //                   >
// //                     <X className="h-4 w-4" />
// //                     Annuler
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Tableau des réparations */}
// //       <div className="card bg-base-200 shadow-xl">
// //         <div className="card-body p-0">
// //           <div className="overflow-x-auto">
// //             <table className="table table-zebra w-full">
// //               <thead>
// //                 <tr className="bg-base-300">
// //                   <th className="font-bold w-12 text-center">
// //                     <div className="flex justify-center">
// //                       <button
// //                         onClick={toggleSelectAll}
// //                         className="btn btn-ghost btn-xs p-1 hover:bg-base-200 transition-colors"
// //                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
// //                       >
// //                         {isSelectAll ? (
// //                           <CheckSquare className="h-5 w-5 text-primary" />
// //                         ) : (
// //                           <Square className="h-5 w-5 text-base-content/40" />
// //                         )}
// //                       </button>
// //                     </div>
// //                   </th>
// //                   <th className="font-bold">Matériel</th>
// //                   <th className="font-bold">Type</th>
// //                   <th className="font-bold">Technicien</th>
// //                   <th className="font-bold">Date début</th>
// //                   <th className="font-bold">Date fin</th>
// //                   <th className="font-bold">Coût</th>
// //                   <th className="font-bold">Statut</th>
// //                   <th className="font-bold text-center">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {safeArray(filteredReparations).map((reparation) => {
// //                   const technicien = getTechnicienName(reparation);
// //                   const isCurrentUser = technicien === getCurrentUserName();
// //                   const enCours = isEnCours(reparation);
                  
// //                   return (
// //                     <tr key={reparation.id} className="hover">
// //                       <td className="text-center">
// //                         <div className="flex justify-center">
// //                           <input
// //                             type="checkbox"
// //                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
// //                             checked={selectedReparations.includes(reparation.id)}
// //                             onChange={() => toggleSelectReparation(reparation.id)}
// //                           />
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className="font-medium">
// //                           {reparation.materiel_nom}
// //                           <div className="text-xs opacity-60">
// //                             ID: {reparation.materiel_id || reparation.materiel}
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
// //                           {getTypeIcon(reparation.type_reparation)}
// //                           {getTypeText(reparation.type_reparation)}
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className="text-sm">
// //                           {technicien ? (
// //                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
// //                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
// //                               <span>{technicien}</span>
// //                               {isCurrentUser && (
// //                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
// //                               )}
// //                             </div>
// //                           ) : (
// //                             <span className="text-base-content opacity-50">Non assigné</span>
// //                           )}
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <span className="text-sm">
// //                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
// //                         </span>
// //                       </td>
// //                       <td>
// //                         {reparation.date_fin ? (
// //                           <span className="text-sm">
// //                             {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
// //                           </span>
// //                         ) : (
// //                           <div className="badge badge-warning badge-sm">En cours</div>
// //                         )}
// //                       </td>
// //                       <td>
// //                         {reparation.cout ? (
// //                           <span className="font-semibold text-green-600 text-sm">
// //                             {reparation.cout.toLocaleString('fr-FR')} Ar
// //                           </span>
// //                         ) : (
// //                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
// //                         )}
// //                       </td>
// //                       <td>
// //                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
// //                           {getStatutIcon(reparation)}
// //                           {getStatutText(reparation)}
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className="flex justify-center space-x-1">
// //                           <button
// //                             onClick={() => handleEdit(reparation)}
// //                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
// //                             title="Modifier"
// //                           >
// //                             <Edit className="h-4 w-4" />
// //                           </button>
// //                           {enCours && (
// //                             <button
// //                               onClick={() => handleTerminer(reparation.id)}
// //                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
// //                               title="Terminer la réparation"
// //                             >
// //                               <CheckCircle className="h-4 w-4" />
// //                             </button>
// //                           )}
// //                           <button
// //                             onClick={() => handleDelete(reparation.id)}
// //                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
// //                             title="Supprimer"
// //                           >
// //                             <Trash2 className="h-4 w-4" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>

// //           {safeArray(filteredReparations).length === 0 && (
// //             <div className="text-center py-12">
// //               <div className="text-base-content opacity-40 mb-4">
// //                 <Wrench className="h-16 w-16 mx-auto mb-4" />
// //                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
// //                 <p className="text-sm mt-2">
// //                   {searchTerm || filterType || filterStatut
// //                     ? "Essayez de modifier vos critères de recherche" 
// //                     : "Aucune réparation n'est enregistrée dans le système"
// //                   }
// //                 </p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Formulaire de réparation */}
// //       <ReparationForm
// //         isOpen={isFormOpen}
// //         onClose={() => {
// //           setIsFormOpen(false);
// //           setEditingReparation(undefined);
// //         }}
// //         onSubmit={handleSubmit}
// //         reparation={editingReparation}
// //         materiels={materiels}
// //         incidents={incidents}
// //         userName={getCurrentUserName()}
// //       />
// //     </div>
// //   );
// // };

// // export default Reparations;




// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package, AlertTriangle, RefreshCw } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Reparation[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // Type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// // Type pour les statistiques
// interface StatistiquesReparations {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
//   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // Statistiques détaillées
//   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParMois: [],
//     topTechniciens: []
//   });

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     if (user.nom_complet) return user.nom_complet;
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user.name) return user.name;
//     if (user.username) return user.username;
    
//     return 'Technicien';
//   }, [user]);

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Calculs de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => 
//       r.date_debut && new Date(r.date_debut) >= debutMois
//     );
    
//     // Calcul des coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
//     // Calcul du coût moyen
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Calcul de la durée moyenne des réparations terminées
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         try {
//           const dateDebut = new Date(rep.date_debut);
//           const dateFin = new Date(rep.date_fin);
//           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
//             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
//             dureeTotale += duree;
//             reparationsAvecDuree++;
//           }
//         } catch (e) {
//           console.warn('Erreur calcul durée:', e);
//         }
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     const moisActuel = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         try {
//           const date = new Date(rep.date_debut);
//           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
//           if (reparationsParMoisMap[moisKey]) {
//             reparationsParMoisMap[moisKey].count++;
//             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
//           }
//         } catch (e) {
//           console.warn('Erreur date réparation:', e);
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
//     data.forEach(rep => {
//       const technicien = getTechnicienName(rep) || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
//       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Fonction pour mettre à jour l'état du matériel
//   const updateMaterielEtat = useCallback(async (materielId: number, etat: string) => {
//     try {
//       console.log(`🔄 Mise à jour état matériel #${materielId} -> ${etat}`);
      
//       const updateData = { 
//         etat: etat,
//         date_derniere_maintenance: new Date().toISOString().split('T')[0]
//       };
      
//       console.log('📤 Données de mise à jour matériel:', updateData);
      
//       await materielsAPI.update(materielId, updateData);
      
//       console.log(`✅ Matériel #${materielId} mis à jour avec état: ${etat}`);
      
//       // Rafraîchir la liste des matériels pour refléter le changement
//       fetchRelationsData();
      
//     } catch (error: any) {
//       console.error(`❌ Erreur mise à jour état matériel:`, error);
//       const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du matériel';
//       console.error(`Détails: ${errorMsg}`);
//     }
//   }, []);

//   // CORRECTION CRITIQUE : Fonction pour déterminer l'état du matériel basé sur la réparation
//   const getMaterielEtatFromReparation = useCallback((typeReparation: string, dateFin?: string): string => {
//     if (dateFin) {
//       // Réparation terminée
//       switch (typeReparation) {
//         case 'corrective':
//           return 'repare'; // Après une corrective terminée, le matériel est "réparé"
//         case 'preventive':
//         case 'ameliorative':
//         default:
//           return 'fonctionnel'; // Après une préventive/améliorative terminée
//       }
//     } else {
//       // Réparation en cours
//       switch (typeReparation) {
//         case 'corrective':
//           return 'en_panne';
//         case 'preventive':
//           return 'en_maintenance';
//         case 'ameliorative':
//           return 'en_amelioration';
//         default:
//           return 'en_reparation';
//       }
//     }
//   }, []);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des réparations...');
      
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log('✅ Réparations chargées:', extractedData.length);
      
//       setReparations(extractedData);
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des réparations';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);

//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Charger toutes les données au montage
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Filtrer les réparations
//   useEffect(() => {
//     let filtered = safeArray(reparations);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter(filtered, reparation => {
//         const technicien = getTechnicienName(reparation).toLowerCase();
//         return (
//           reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
//           reparation.description?.toLowerCase().includes(searchLower) ||
//           technicien.includes(searchLower)
//         );
//       });
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
//     }

//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = safeFilter(filtered, reparation => reparation.date_fin);
//       }
//     }

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut]);

//   // Gérer la sélection multiple
//   useEffect(() => {
//     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedReparations, filteredReparations]);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Trouver le nom du technicien
//   const getTechnicienName = useCallback((reparation: any): string => {
//     if (!reparation) return '';
    
//     const possibleFields = [
//       'technicien_responsable',
//       'technicien',
//       'responsable', 
//       'technician',
//       'technician_responsable',
//       'responsible_technician',
//       'tech_responsable',
//       'nom_technicien',
//       'technicien_nom',
//       'technician_name',
//       'responsible',
//       'assigné_à',
//       'assigned_to'
//     ];
    
//     for (const field of possibleFields) {
//       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
//         return reparation[field];
//       }
//     }
    
//     return '';
//   }, []);

//   // Formater la devise en Ariary
//   const formatCurrency = useCallback((amount: number | string): string => {
//     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(numAmount)) return '0 Ar';
//     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
//   }, []);

//   // Formater les nombres
//   const formatNumber = useCallback((num: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(num);
//   }, []);

//   // Gérer la soumission d'une réparation
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       console.log('📤 Données reçues du formulaire:', reparationData);
      
//       const currentUserName = getCurrentUserName();
//       console.log('👤 Technicien automatique:', currentUserName);
      
//       // CRITIQUE : S'assurer que le technicien n'est jamais null
//       let technicienResponsable = reparationData.technicien_responsable?.trim() || currentUserName;
      
//       // Validation supplémentaire
//       if (!technicienResponsable || technicienResponsable === '') {
//         technicienResponsable = 'Technicien DREN';
//         console.warn('⚠️ Technicien vide, valeur par défaut utilisée:', technicienResponsable);
//       }
      
//       console.log('✅ Technicien final:', technicienResponsable);
      
//       // Préparer les données pour l'API
//       const formattedData: any = {
//         materiel: reparationData.materiel,
//         type_reparation: reparationData.type_reparation,
//         date_debut: reparationData.date_debut,
//         cout: parseFloat(reparationData.cout) || 0,
//         technicien_responsable: technicienResponsable,
//         description: reparationData.description || 'Réparation effectuée'
//       };
      
//       // Gérer date_fin - si vide, ne pas l'envoyer du tout
//       if (reparationData.date_fin && reparationData.date_fin.trim() !== '') {
//         formattedData.date_fin = reparationData.date_fin;
//       }
      
//       // Gérer incident - si null ou vide, ne pas l'envoyer
//       if (reparationData.incident && reparationData.incident !== '') {
//         formattedData.incident = reparationData.incident;
//       }
      
//       console.log('📝 Données formatées pour API:', formattedData);
      
//       let response;
      
//       if (editingReparation) {
//         console.log(`✏️ Modification réparation #${editingReparation.id}`);
//         response = await reparationsAPI.update(editingReparation.id, formattedData);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         console.log('🆕 Création nouvelle réparation');
//         response = await reparationsAPI.create(formattedData);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       console.log('✅ Réponse API:', response.data);
      
//       // CORRECTION : Mettre à jour l'état du matériel selon la nouvelle logique
//       const materielId = reparationData.materiel;
//       if (materielId) {
//         const nouvelEtat = getMaterielEtatFromReparation(
//           reparationData.type_reparation, 
//           formattedData.date_fin
//         );
        
//         console.log(`🔄 Mise à jour matériel #${materielId} -> ${nouvelEtat}`);
        
//         try {
//           await updateMaterielEtat(materielId, nouvelEtat);
//           showMessage('info', `Matériel mis à jour: ${nouvelEtat}`);
//         } catch (error) {
//           console.error('❌ Erreur mise à jour matériel:', error);
//           // Ne pas bloquer l'utilisateur
//           showMessage('warning', 'Réparation enregistrée, mais erreur sur mise à jour matériel');
//         }
//       }
      
//       // Rafraîchir les données
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde réparation:', error);
      
//       let errorMessage = 'Erreur lors de la sauvegarde de la réparation';
      
//       if (error.response?.data) {
//         // Essayez d'extraire le message d'erreur
//         const errorData = error.response.data;
        
//         if (typeof errorData === 'string') {
//           // Si c'est du HTML, chercher le message d'erreur
//           const match = errorData.match(/<pre class="exception_value">([^<]+)<\/pre>/);
//           if (match) {
//             errorMessage = match[1].trim();
//           }
//         } else if (errorData.detail) {
//           errorMessage = errorData.detail;
//         } else if (errorData.message) {
//           errorMessage = errorData.message;
//         } else if (Array.isArray(errorData.non_field_errors)) {
//           errorMessage = errorData.non_field_errors.join(', ');
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       showMessage('error', errorMessage);
      
//       console.error('🔍 Détails complets:', {
//         message: error.message,
//         response: error.response,
//         data: error.response?.data
//       });
//     }
//   };

//   // Gérer l'édition
//   const handleEdit = (reparation: Reparation) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   // Gérer la suppression
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // CORRECTION : Gérer la fin de réparation
//   const handleTerminer = async (id: number) => {
//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Trouver la réparation pour avoir l'ID du matériel et le type
//       const reparation = reparations.find(r => r.id === id);
//       if (!reparation) {
//         throw new Error('Réparation non trouvée');
//       }
      
//       console.log(`🔧 Fin de réparation #${id} pour matériel #${reparation.materiel}`);
      
//       // Mettre à jour la réparation avec la date de fin
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName
//       });
      
//       // CORRECTION : Mettre à jour l'état du matériel selon le type de réparation
//       const materielId = reparation.materiel;
//       if (materielId) {
//         // Réparation terminée
//         let nouvelEtat = 'fonctionnel'; // Par défaut
        
//         if (reparation.type_reparation === 'corrective') {
//           nouvelEtat = 'repare'; // Après une corrective terminée
//         }
        
//         console.log(`🔄 Mise à jour matériel #${materielId} -> ${nouvelEtat} (réparation terminée)`);
        
//         await updateMaterielEtat(materielId, nouvelEtat);
//         showMessage('success', `Réparation terminée et matériel marqué comme ${nouvelEtat}`);
//       } else {
//         showMessage('success', 'Réparation terminée avec succès');
//       }
      
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'ajout d'une nouvelle réparation
//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Aucune donnée de relation disponible.');
//       return;
//     }

//     setEditingReparation(undefined);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Gérer la suppression multiple
//   const handleDeleteSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer l'édition multiple
//   const handleEditSelected = () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (selectedReparations.length === 1) {
//       const reparation = reparations.find(r => r.id === selectedReparations[0]);
//       if (reparation) {
//         handleEdit(reparation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
//       setEditingReparation(undefined);
//       setIsFormOpen(true);
//     }
//   };

//   // CORRECTION : Gérer la fin de réparation multiple
//   const handleTerminerSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Traiter chaque réparation
//       for (const id of selectedReparations) {
//         const reparation = reparations.find(r => r.id === id);
//         if (!reparation) continue;
        
//         await reparationsAPI.update(id, { 
//           date_fin: new Date().toISOString(),
//           technicien_responsable: currentUserName
//         });
        
//         // CORRECTION : Mettre à jour l'état du matériel selon le type
//         const materielId = reparation.materiel;
//         if (materielId) {
//           let nouvelEtat = 'fonctionnel'; // Par défaut
          
//           if (reparation.type_reparation === 'corrective') {
//             nouvelEtat = 'repare'; // Après une corrective terminée
//           }
          
//           await updateMaterielEtat(materielId, nouvelEtat);
//         }
//       }
      
//       showMessage('success', `${selectedReparations.length} réparation(s) terminée(s) et matériel(s) mis à jour`);
//       setSelectedReparations([]);
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Exporter en CSV
//   const handleExport = useCallback(() => {
//     try {
//       const dataToExport = filteredReparations.map(reparation => ({
//         'Matériel': reparation.materiel_nom || 'Non spécifié',
//         'Type': getTypeText(reparation.type_reparation),
//         'Technicien': getTechnicienName(reparation) || 'Non assigné',
//         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
//         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
//         'Statut': getStatutText(reparation),
//         'Description': reparation.description || 'Aucune description'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export CSV:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   }, [filteredReparations, getTechnicienName]);

//   // Fonctions d'affichage
//   const getTypeBadge = (type: string) => {
//     const badges = {
//       preventive: 'badge-info',
//       corrective: 'badge-warning',
//       ameliorative: 'badge-success'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       preventive: 'Préventive',
//       corrective: 'Corrective',
//       ameliorative: 'Améliorative'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     const icons = {
//       preventive: <Wrench className="h-4 w-4" />,
//       corrective: <Wrench className="h-4 w-4" />,
//       ameliorative: <CheckCircle className="h-4 w-4" />
//     };
//     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
//   };

//   const isEnCours = (reparation: Reparation) => {
//     return !reparation.date_fin;
//   };

//   const getStatutBadge = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'En cours' : 'Terminée';
//   };

//   const getStatutIcon = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 
//       <Calendar className="h-4 w-4" /> : 
//       <CheckCircle className="h-4 w-4" />;
//   };

//   // Obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedReparations([]);
//   };

//   // Rafraîchir les données
//   const handleRefresh = () => {
//     fetchReparations();
//     fetchRelationsData();
//     showMessage('info', '🔄 Données rafraîchies');
//   };

//   // Rendre la section statistiques
//   const renderStatistiquesSection = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {/* Carte Total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
//               <p className="text-sm opacity-60">Total réparations</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Package className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span className="text-success">{statistiques.terminees} terminées</span>
//             <span className="mx-2">•</span>
//             <span className="text-warning">{statistiques.enCours} en cours</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
//               <p className="text-sm opacity-60">Coût total</p>
//             </div>
//             <div className="p-2 bg-purple-500/10 rounded-lg">
//               <DollarSign className="h-6 w-6 text-purple-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût ce mois */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
//               <p className="text-sm opacity-60">Coût ce mois</p>
//             </div>
//             <div className="p-2 bg-blue-500/10 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-blue-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Durée moyenne */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
//               <p className="text-sm opacity-60">Jours moyen</p>
//             </div>
//             <div className="p-2 bg-green-500/10 rounded-lg">
//               <Clock className="h-6 w-6 text-green-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} réparations terminées</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Taux de complétion */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">
//                 {statistiques.total > 0 
//                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                   : '0%'
//                 }
//               </h3>
//               <p className="text-sm opacity-60">Taux de complétion</p>
//             </div>
//             <div className="p-2 bg-orange-500/10 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} / {statistiques.total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredReparations.length} réparation(s) trouvée(s)
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {getCurrentUserName()}
//             </span>
//           </p>
//           <p className="text-xs text-success opacity-70 mt-1">
//             ⚡ L'état du matériel est automatiquement mis à jour après chaque réparation
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleRefresh}
//             className="btn btn-outline btn-sm"
//             title="Rafraîchir"
//           >
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Rafraîchir
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle réparation
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques détaillées */}
//       {renderStatistiquesSection()}

//       {/* Section Utilisateur actuel */}
//       <div className="mb-6">
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Users className="h-5 w-5 text-success" />
//                 <div>
//                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
//                   <p className="text-sm">
//                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
//                   </p>
//                   <p className="text-xs text-success opacity-70 mt-1">
//                     ⚡ Ce nom sera automatiquement utilisé comme "technicien responsable".
//                     <br />
//                     🔄 L'état du matériel sera mis à jour automatiquement après chaque réparation.
//                   </p>
//                 </div>
//               </div>
//               <div className="badge badge-success badge-lg">
//                 Connecté
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section État des matériels */}
//       <div className="mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4">
//             <h3 className="font-bold text-base-content mb-3">📊 État des matériels après réparation</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Corrective terminée</span>
//                   <span className="badge badge-success badge-sm">✅</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>Réparé</strong></div>
//               </div>
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Préventive terminée</span>
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
//             </div>
//             <div className="text-xs opacity-60 mt-3">
//               ⚡ Ces mises à jour sont automatiques après chaque réparation. L'état du matériel est synchronisé en temps réel.
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
//                   placeholder="Matériel, technicien..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🛠️ Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
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
//                 <option value="en_cours">En cours</option>
//                 <option value="terminee">Terminée</option>
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
//           </div>

//           {/* Actions de sélection */}
//           {selectedReparations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedReparations.length} réparation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
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

//       {/* Tableau des réparations */}
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
//                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Technicien</th>
//                   <th className="font-bold">Date début</th>
//                   <th className="font-bold">Date fin</th>
//                   <th className="font-bold">Coût</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredReparations).map((reparation) => {
//                   const technicien = getTechnicienName(reparation);
//                   const isCurrentUser = technicien === getCurrentUserName();
//                   const enCours = isEnCours(reparation);
                  
//                   return (
//                     <tr key={reparation.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedReparations.includes(reparation.id)}
//                             onChange={() => toggleSelectReparation(reparation.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {reparation.materiel_nom}
//                           <div className="text-xs opacity-60">
//                             ID: {reparation.materiel}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
//                           {getTypeIcon(reparation.type_reparation)}
//                           {getTypeText(reparation.type_reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {technicien ? (
//                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
//                               <span>{technicien}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-base-content opacity-50">Non assigné</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm">
//                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                       </td>
//                       <td>
//                         {reparation.date_fin ? (
//                           <span className="text-sm">
//                             {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
//                           </span>
//                         ) : (
//                           <div className="badge badge-warning badge-sm">En cours</div>
//                         )}
//                       </td>
//                       <td>
//                         {reparation.cout ? (
//                           <span className="font-semibold text-green-600 text-sm">
//                             {reparation.cout.toLocaleString('fr-FR')} Ar
//                           </span>
//                         ) : (
//                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
//                           {getStatutIcon(reparation)}
//                           {getStatutText(reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(reparation)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {enCours && (
//                             <button
//                               onClick={() => handleTerminer(reparation.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Terminer la réparation"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(reparation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredReparations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Wrench className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType || filterStatut
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune réparation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()}
//       />
//     </div>
//   );
// };

// export default Reparations;









// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package, AlertTriangle, RefreshCw } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Reparation[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // Type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// // Type pour les statistiques
// interface StatistiquesReparations {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
//   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // Statistiques détaillées
//   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParMois: [],
//     topTechniciens: []
//   });

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     if (user.nom_complet) return user.nom_complet;
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user.name) return user.name;
//     if (user.username) return user.username;
    
//     return 'Technicien';
//   }, [user]);

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Calculs de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => 
//       r.date_debut && new Date(r.date_debut) >= debutMois
//     );
    
//     // Calcul des coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
//     // Calcul du coût moyen
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Calcul de la durée moyenne des réparations terminées
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         try {
//           const dateDebut = new Date(rep.date_debut);
//           const dateFin = new Date(rep.date_fin);
//           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
//             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
//             dureeTotale += duree;
//             reparationsAvecDuree++;
//           }
//         } catch (e) {
//           console.warn('Erreur calcul durée:', e);
//         }
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     const moisActuel = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         try {
//           const date = new Date(rep.date_debut);
//           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
//           if (reparationsParMoisMap[moisKey]) {
//             reparationsParMoisMap[moisKey].count++;
//             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
//           }
//         } catch (e) {
//           console.warn('Erreur date réparation:', e);
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
//     data.forEach(rep => {
//       const technicien = getTechnicienName(rep) || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
//       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Fonction pour mettre à jour l'état du matériel
//   const updateMaterielEtat = useCallback(async (materielId: number, etat: string) => {
//     try {
//       console.log(`🔄 Mise à jour état matériel #${materielId} -> ${etat}`);
      
//       const updateData = { 
//         etat: etat,
//         date_derniere_maintenance: new Date().toISOString().split('T')[0]
//       };
      
//       console.log('📤 Données de mise à jour matériel:', updateData);
      
//       await materielsAPI.update(materielId, updateData);
      
//       console.log(`✅ Matériel #${materielId} mis à jour avec état: ${etat}`);
      
//       // Rafraîchir la liste des matériels pour refléter le changement
//       fetchRelationsData();
      
//     } catch (error: any) {
//       console.error(`❌ Erreur mise à jour état matériel:`, error);
//       const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du matériel';
//       console.error(`Détails: ${errorMsg}`);
//     }
//   }, []);

//   // Fonction pour déterminer l'état du matériel basé sur la réparation
//   const getMaterielEtatFromReparation = useCallback((typeReparation: string, dateFin?: string): string => {
//     if (dateFin) {
//       // Réparation terminée
//       switch (typeReparation) {
//         case 'corrective':
//           return 'repare'; // Après une corrective terminée, le matériel est "réparé"
//         case 'preventive':
//         case 'ameliorative':
//         default:
//           return 'fonctionnel'; // Après une préventive/améliorative terminée
//       }
//     } else {
//       // Réparation en cours
//       switch (typeReparation) {
//         case 'corrective':
//           return 'en_panne';
//         case 'preventive':
//           return 'en_maintenance';
//         case 'ameliorative':
//           return 'en_amelioration';
//         default:
//           return 'en_reparation';
//       }
//     }
//   }, []);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des réparations...');
      
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log('✅ Réparations chargées:', extractedData.length);
      
//       // Afficher le statut de chaque réparation pour déboguer
//       extractedData.forEach((rep: Reparation, index: number) => {
//         console.log(`   #${index + 1}: ID=${rep.id}, date_fin=${rep.date_fin}, statut=${rep.date_fin ? 'termine' : 'en_cours'}`);
//       });
      
//       setReparations(extractedData);
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des réparations';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);

//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Charger toutes les données au montage
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Filtrer les réparations
//   useEffect(() => {
//     let filtered = safeArray(reparations);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter(filtered, reparation => {
//         const technicien = getTechnicienName(reparation).toLowerCase();
//         return (
//           reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
//           reparation.description?.toLowerCase().includes(searchLower) ||
//           technicien.includes(searchLower)
//         );
//       });
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
//     }

//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = safeFilter(filtered, reparation => reparation.date_fin);
//       }
//     }

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut]);

//   // Gérer la sélection multiple
//   useEffect(() => {
//     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedReparations, filteredReparations]);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Trouver le nom du technicien
//   const getTechnicienName = useCallback((reparation: any): string => {
//     if (!reparation) return '';
    
//     const possibleFields = [
//       'technicien_responsable',
//       'technicien',
//       'responsable', 
//       'technician',
//       'technician_responsable',
//       'responsible_technician',
//       'tech_responsable',
//       'nom_technicien',
//       'technicien_nom',
//       'technician_name',
//       'responsible',
//       'assigné_à',
//       'assigned_to'
//     ];
    
//     for (const field of possibleFields) {
//       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
//         return reparation[field];
//       }
//     }
    
//     return '';
//   }, []);

//   // Formater la devise en Ariary
//   const formatCurrency = useCallback((amount: number | string): string => {
//     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(numAmount)) return '0 Ar';
//     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
//   }, []);

//   // Formater les nombres
//   const formatNumber = useCallback((num: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(num);
//   }, []);

//   // CORRECTION CRITIQUE : Gérer la soumission d'une réparation
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       console.log('📤 Données reçues du formulaire:', reparationData);
      
//       // CORRECTION : Vérifiez si date_fin est présent ou non
//       console.log('📅 Date fin dans les données:', reparationData.date_fin);
//       console.log('📅 Type de date_fin:', typeof reparationData.date_fin);
      
//       const currentUserName = getCurrentUserName();
//       console.log('👤 Technicien automatique:', currentUserName);
      
//       // S'assurer que le technicien n'est jamais null
//       let technicienResponsable = reparationData.technicien_responsable?.trim() || currentUserName;
      
//       if (!technicienResponsable || technicienResponsable === '') {
//         technicienResponsable = 'Technicien DREN';
//       }
      
//       console.log('✅ Technicien final:', technicienResponsable);
      
//       // Préparer les données pour l'API
//       const formattedData: any = {
//         materiel: reparationData.materiel,
//         type_reparation: reparationData.type_reparation,
//         date_debut: reparationData.date_debut,
//         cout: parseFloat(reparationData.cout) || 0,
//         technicien_responsable: technicienResponsable,
//         description: reparationData.description || 'Réparation effectuée'
//       };
      
//       // CORRECTION DÉFINITIVE : Ne pas envoyer date_fin du tout si elle est vide
//       if (reparationData.date_fin && reparationData.date_fin.trim() !== '' && reparationData.date_fin !== 'null') {
//         formattedData.date_fin = reparationData.date_fin;
//         console.log('✅ Date fin envoyée:', formattedData.date_fin);
//       } else {
//         console.log('⏳ Réparation en cours - pas de date_fin dans la requête');
//         // NE PAS AJOUTER la clé date_fin du tout
//         // Django verra date_fin = None (réparation en cours)
//       }
      
//       // Gérer incident - si null ou vide, ne pas l'envoyer
//       if (reparationData.incident && reparationData.incident !== '') {
//         formattedData.incident = reparationData.incident;
//       }
      
//       console.log('📝 Données finales pour API:', formattedData);
      
//       let response;
      
//       if (editingReparation) {
//         console.log(`✏️ Modification réparation #${editingReparation.id}`);
//         response = await reparationsAPI.update(editingReparation.id, formattedData);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         console.log('🆕 Création nouvelle réparation');
//         response = await reparationsAPI.create(formattedData);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       console.log('✅ Réponse API:', response.data);
      
//       // Mettre à jour l'état du matériel
//       const materielId = reparationData.materiel;
//       if (materielId) {
//         const nouvelEtat = getMaterielEtatFromReparation(
//           reparationData.type_reparation, 
//           // Utiliser le même test pour date_fin
//           (reparationData.date_fin && reparationData.date_fin.trim() !== '' && reparationData.date_fin !== 'null') 
//             ? reparationData.date_fin 
//             : undefined
//         );
        
//         console.log(`🔄 Mise à jour matériel #${materielId} -> ${nouvelEtat}`);
        
//         try {
//           await updateMaterielEtat(materielId, nouvelEtat);
//           showMessage('info', `Matériel mis à jour: ${nouvelEtat}`);
//         } catch (error) {
//           console.error('❌ Erreur mise à jour matériel:', error);
//           showMessage('warning', 'Réparation enregistrée, mais erreur sur mise à jour matériel');
//         }
//       }
      
//       // Rafraîchir les données
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde réparation:', error);
      
//       let errorMessage = 'Erreur lors de la sauvegarde de la réparation';
      
//       if (error.response?.data) {
//         const errorData = error.response.data;
        
//         if (typeof errorData === 'string') {
//           const match = errorData.match(/<pre class="exception_value">([^<]+)<\/pre>/);
//           if (match) {
//             errorMessage = match[1].trim();
//           }
//         } else if (errorData.detail) {
//           errorMessage = errorData.detail;
//         } else if (errorData.message) {
//           errorMessage = errorData.message;
//         } else if (Array.isArray(errorData.non_field_errors)) {
//           errorMessage = errorData.non_field_errors.join(', ');
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'édition
//   const handleEdit = (reparation: Reparation) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   // Gérer la suppression
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer la fin de réparation
//   const handleTerminer = async (id: number) => {
//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Trouver la réparation pour avoir l'ID du matériel et le type
//       const reparation = reparations.find(r => r.id === id);
//       if (!reparation) {
//         throw new Error('Réparation non trouvée');
//       }
      
//       console.log(`🔧 Fin de réparation #${id} pour matériel #${reparation.materiel}`);
      
//       // Mettre à jour la réparation avec la date de fin
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName
//       });
      
//       // Mettre à jour l'état du matériel selon le type de réparation
//       const materielId = reparation.materiel;
//       if (materielId) {
//         // Réparation terminée
//         let nouvelEtat = 'fonctionnel'; // Par défaut
        
//         if (reparation.type_reparation === 'corrective') {
//           nouvelEtat = 'repare'; // Après une corrective terminée
//         }
        
//         console.log(`🔄 Mise à jour matériel #${materielId} -> ${nouvelEtat} (réparation terminée)`);
        
//         await updateMaterielEtat(materielId, nouvelEtat);
//         showMessage('success', `Réparation terminée et matériel marqué comme ${nouvelEtat}`);
//       } else {
//         showMessage('success', 'Réparation terminée avec succès');
//       }
      
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'ajout d'une nouvelle réparation
//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Aucune donnée de relation disponible.');
//       return;
//     }

//     setEditingReparation(undefined);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Gérer la suppression multiple
//   const handleDeleteSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer l'édition multiple
//   const handleEditSelected = () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (selectedReparations.length === 1) {
//       const reparation = reparations.find(r => r.id === selectedReparations[0]);
//       if (reparation) {
//         handleEdit(reparation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
//       setEditingReparation(undefined);
//       setIsFormOpen(true);
//     }
//   };

//   // Gérer la fin de réparation multiple
//   const handleTerminerSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Traiter chaque réparation
//       for (const id of selectedReparations) {
//         const reparation = reparations.find(r => r.id === id);
//         if (!reparation) continue;
        
//         await reparationsAPI.update(id, { 
//           date_fin: new Date().toISOString(),
//           technicien_responsable: currentUserName
//         });
        
//         // Mettre à jour l'état du matériel selon le type
//         const materielId = reparation.materiel;
//         if (materielId) {
//           let nouvelEtat = 'fonctionnel'; // Par défaut
          
//           if (reparation.type_reparation === 'corrective') {
//             nouvelEtat = 'repare'; // Après une corrective terminée
//           }
          
//           await updateMaterielEtat(materielId, nouvelEtat);
//         }
//       }
      
//       showMessage('success', `${selectedReparations.length} réparation(s) terminée(s) et matériel(s) mis à jour`);
//       setSelectedReparations([]);
//       fetchReparations();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Exporter en CSV
//   const handleExport = useCallback(() => {
//     try {
//       const dataToExport = filteredReparations.map(reparation => ({
//         'Matériel': reparation.materiel_nom || 'Non spécifié',
//         'Type': getTypeText(reparation.type_reparation),
//         'Technicien': getTechnicienName(reparation) || 'Non assigné',
//         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
//         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
//         'Statut': getStatutText(reparation),
//         'Description': reparation.description || 'Aucune description'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export CSV:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   }, [filteredReparations, getTechnicienName]);

//   // Fonctions d'affichage
//   const getTypeBadge = (type: string) => {
//     const badges = {
//       preventive: 'badge-info',
//       corrective: 'badge-warning',
//       ameliorative: 'badge-success'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       preventive: 'Préventive',
//       corrective: 'Corrective',
//       ameliorative: 'Améliorative'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     const icons = {
//       preventive: <Wrench className="h-4 w-4" />,
//       corrective: <Wrench className="h-4 w-4" />,
//       ameliorative: <CheckCircle className="h-4 w-4" />
//     };
//     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
//   };

//   const isEnCours = (reparation: Reparation) => {
//     // CORRECTION : Vérifier si date_fin est null, undefined, ou vide
//     return !reparation.date_fin || reparation.date_fin === null || reparation.date_fin === '';
//   };

//   const getStatutBadge = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'En cours' : 'Terminée';
//   };

//   const getStatutIcon = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 
//       <Calendar className="h-4 w-4" /> : 
//       <CheckCircle className="h-4 w-4" />;
//   };

//   // Obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedReparations([]);
//   };

//   // Rafraîchir les données
//   const handleRefresh = () => {
//     fetchReparations();
//     fetchRelationsData();
//     showMessage('info', '🔄 Données rafraîchies');
//   };

//   // Rendre la section statistiques
//   const renderStatistiquesSection = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {/* Carte Total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
//               <p className="text-sm opacity-60">Total réparations</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Package className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span className="text-success">{statistiques.terminees} terminées</span>
//             <span className="mx-2">•</span>
//             <span className="text-warning">{statistiques.enCours} en cours</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
//               <p className="text-sm opacity-60">Coût total</p>
//             </div>
//             <div className="p-2 bg-purple-500/10 rounded-lg">
//               <DollarSign className="h-6 w-6 text-purple-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût ce mois */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
//               <p className="text-sm opacity-60">Coût ce mois</p>
//             </div>
//             <div className="p-2 bg-blue-500/10 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-blue-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Durée moyenne */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
//               <p className="text-sm opacity-60">Jours moyen</p>
//             </div>
//             <div className="p-2 bg-green-500/10 rounded-lg">
//               <Clock className="h-6 w-6 text-green-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} réparations terminées</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Taux de complétion */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">
//                 {statistiques.total > 0 
//                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                   : '0%'
//                 }
//               </h3>
//               <p className="text-sm opacity-60">Taux de complétion</p>
//             </div>
//             <div className="p-2 bg-orange-500/10 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} / {statistiques.total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredReparations.length} réparation(s) trouvée(s)
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {getCurrentUserName()}
//             </span>
//           </p>
//           <p className="text-xs text-success opacity-70 mt-1">
//             ⚡ L'état du matériel est automatiquement mis à jour après chaque réparation
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleRefresh}
//             className="btn btn-outline btn-sm"
//             title="Rafraîchir"
//           >
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Rafraîchir
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle réparation
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques détaillées */}
//       {renderStatistiquesSection()}

//       {/* Section Utilisateur actuel */}
//       <div className="mb-6">
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Users className="h-5 w-5 text-success" />
//                 <div>
//                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
//                   <p className="text-sm">
//                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
//                   </p>
//                   <p className="text-xs text-success opacity-70 mt-1">
//                     ⚡ Ce nom sera automatiquement utilisé comme "technicien responsable".
//                     <br />
//                     🔄 L'état du matériel sera mis à jour automatiquement après chaque réparation.
//                   </p>
//                 </div>
//               </div>
//               <div className="badge badge-success badge-lg">
//                 Connecté
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section État des matériels */}
//       <div className="mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4">
//             <h3 className="font-bold text-base-content mb-3">📊 État des matériels après réparation</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Corrective terminée</span>
//                   <span className="badge badge-success badge-sm">✅</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>Réparé</strong></div>
//               </div>
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Préventive terminée</span>
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
//             </div>
//             <div className="text-xs opacity-60 mt-3">
//               ⚡ Ces mises à jour sont automatiques après chaque réparation. L'état du matériel est synchronisé en temps réel.
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
//                   placeholder="Matériel, technicien..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🛠️ Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
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
//                 <option value="en_cours">En cours</option>
//                 <option value="terminee">Terminée</option>
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
//           </div>

//           {/* Actions de sélection */}
//           {selectedReparations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedReparations.length} réparation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
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

//       {/* Tableau des réparations */}
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
//                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Technicien</th>
//                   <th className="font-bold">Date début</th>
//                   <th className="font-bold">Date fin</th>
//                   <th className="font-bold">Coût</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredReparations).map((reparation) => {
//                   const technicien = getTechnicienName(reparation);
//                   const isCurrentUser = technicien === getCurrentUserName();
//                   const enCours = isEnCours(reparation);
                  
//                   // Débogage pour chaque réparation
//                   console.log(`🔍 Réparation #${reparation.id}:`, {
//                     id: reparation.id,
//                     date_fin: reparation.date_fin,
//                     enCours: enCours,
//                     materiel: reparation.materiel_nom
//                   });
                  
//                   return (
//                     <tr key={reparation.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedReparations.includes(reparation.id)}
//                             onChange={() => toggleSelectReparation(reparation.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {reparation.materiel_nom}
//                           <div className="text-xs opacity-60">
//                             ID: {reparation.materiel}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
//                           {getTypeIcon(reparation.type_reparation)}
//                           {getTypeText(reparation.type_reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {technicien ? (
//                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
//                               <span>{technicien}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-base-content opacity-50">Non assigné</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm">
//                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                       </td>
//                       <td>
//                         {reparation.date_fin ? (
//                           <div className="text-sm">
//                             <span>{new Date(reparation.date_fin).toLocaleDateString('fr-FR')}</span>
//                             <div className="text-xs text-success">(terminée)</div>
//                           </div>
//                         ) : (
//                           <div>
//                             <div className="badge badge-warning badge-sm">En cours</div>
//                             <div className="text-xs text-warning mt-1">date_fin: {reparation.date_fin === null ? 'null' : 'undefined'}</div>
//                           </div>
//                         )}
//                       </td>
//                       <td>
//                         {reparation.cout ? (
//                           <span className="font-semibold text-green-600 text-sm">
//                             {reparation.cout.toLocaleString('fr-FR')} Ar
//                           </span>
//                         ) : (
//                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
//                           {getStatutIcon(reparation)}
//                           {getStatutText(reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(reparation)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {enCours && (
//                             <button
//                               onClick={() => handleTerminer(reparation.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Terminer la réparation"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(reparation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredReparations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Wrench className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType || filterStatut
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune réparation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()}
//       />
//     </div>
//   );
// };

// export default Reparations;


// // vraie code nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Reparation[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // Type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// // Type pour les statistiques
// interface StatistiquesReparations {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
//   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // Statistiques détaillées
//   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParMois: [],
//     topTechniciens: []
//   });

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     if (user.nom_complet) return user.nom_complet;
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user.name) return user.name;
//     if (user.username) return user.username;
    
//     return 'Utilisateur';
//   }, [user]);

//   // AJOUTER: Fonction pour déterminer l'état du matériel basé sur la réparation
//   const getMaterielEtatFromReparation = useCallback((typeReparation: string, dateFin?: string): string => {
//     if (dateFin) {
//       // Réparation terminée
//       switch (typeReparation) {
//         case 'corrective':
//           return 'repare'; // Après une corrective terminée
//         case 'preventive':
//         case 'ameliorative':
//         default:
//           return 'fonctionnel'; // Après une préventive/améliorative terminée
//       }
//     } else {
//       // Réparation en cours
//       switch (typeReparation) {
//         case 'corrective':
//           return 'en_panne';
//         case 'preventive':
//           return 'en_maintenance';
//         case 'ameliorative':
//           return 'en_amelioration';
//         default:
//           return 'en_reparation';
//       }
//     }
//   }, []);

//   // AJOUTER: Fonction pour mettre à jour l'état du matériel
//   const updateMaterielEtat = useCallback(async (materielId: number, nouvelEtat: string) => {
//     try {
//       console.log(`🔄 Mise à jour état matériel #${materielId} -> ${nouvelEtat}`);
      
//       const updateData = { 
//         etat: nouvelEtat,
//         date_derniere_maintenance: new Date().toISOString().split('T')[0]
//       };
      
//       console.log('📤 Données de mise à jour matériel:', updateData);
      
//       const response = await materielsAPI.update(materielId, updateData);
//       console.log(`✅ Matériel #${materielId} mis à jour avec état: ${nouvelEtat}`);
//       return response;
      
//     } catch (error: any) {
//       console.error(`❌ Erreur mise à jour état matériel:`, error);
//       const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du matériel';
//       console.error(`Détails: ${errorMsg}`);
//       throw error;
//     }
//   }, []);

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Calculs de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => 
//       r.date_debut && new Date(r.date_debut) >= debutMois
//     );
    
//     // Calcul des coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
//     // Calcul du coût moyen
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Calcul de la durée moyenne des réparations terminées
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         try {
//           const dateDebut = new Date(rep.date_debut);
//           const dateFin = new Date(rep.date_fin);
//           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
//             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
//             dureeTotale += duree;
//             reparationsAvecDuree++;
//           }
//         } catch (e) {
//           console.warn('Erreur calcul durée:', e);
//         }
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     const moisActuel = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         try {
//           const date = new Date(rep.date_debut);
//           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
//           if (reparationsParMoisMap[moisKey]) {
//             reparationsParMoisMap[moisKey].count++;
//             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
//           }
//         } catch (e) {
//           console.warn('Erreur date réparation:', e);
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
//     data.forEach(rep => {
//       const technicien = getTechnicienName(rep) || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
//       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des réparations...');
      
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log('✅ Réparations chargées:', extractedData.length);
      
//       setReparations(extractedData);
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des réparations';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);

//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Charger toutes les données au montage
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Filtrer les réparations
//   useEffect(() => {
//     let filtered = safeArray(reparations);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter(filtered, reparation => {
//         const technicien = getTechnicienName(reparation).toLowerCase();
//         return (
//           reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
//           reparation.description?.toLowerCase().includes(searchLower) ||
//           technicien.includes(searchLower)
//         );
//       });
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
//     }

//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = safeFilter(filtered, reparation => reparation.date_fin);
//       }
//     }

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut]);

//   // Gérer la sélection multiple
//   useEffect(() => {
//     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedReparations, filteredReparations]);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Trouver le nom du technicien
//   const getTechnicienName = useCallback((reparation: any): string => {
//     if (!reparation) return '';
    
//     const possibleFields = [
//       'technicien_responsable',
//       'technicien',
//       'responsable', 
//       'technician',
//       'technician_responsable',
//       'responsible_technician',
//       'tech_responsable',
//       'nom_technicien',
//       'technicien_nom',
//       'technician_name',
//       'responsible',
//       'assigné_à',
//       'assigned_to'
//     ];
    
//     for (const field of possibleFields) {
//       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
//         return reparation[field];
//       }
//     }
    
//     return '';
//   }, []);

//   // Formater la devise en Ariary
//   const formatCurrency = useCallback((amount: number | string): string => {
//     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(numAmount)) return '0 Ar';
//     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
//   }, []);

//   // Formater les nombres
//   const formatNumber = useCallback((num: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(num);
//   }, []);

//   // CORRECTION: Gérer la soumission d'une réparation avec mise à jour de l'état du matériel
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       console.log('📤 Données reçues du formulaire:', reparationData);
      
//       const currentUserName = getCurrentUserName();
//       console.log('👤 Technicien automatique (depuis parent):', currentUserName);
      
//       // Assurer que technicien_responsable n'est jamais null
//       const technicienResponsable = reparationData.technicien_responsable?.trim() || currentUserName;
      
//       if (!technicienResponsable || technicienResponsable === '') {
//         throw new Error('Le nom du technicien est requis');
//       }
      
//       // Préparer les données pour l'API
//       const formattedData = {
//         materiel: reparationData.materiel,
//         type_reparation: reparationData.type_reparation,
//         date_debut: reparationData.date_debut,
//         date_fin: reparationData.date_fin || null,
//         cout: parseFloat(reparationData.cout) || 0,
//         technicien_responsable: technicienResponsable,
//         description: reparationData.description || 'Réparation effectuée',
//         incident: reparationData.incident || null
//       };
      
//       console.log('📝 Données formatées pour API:', formattedData);
//       console.log('✅ Technicien dans données:', formattedData.technicien_responsable);
      
//       let response;
      
//       if (editingReparation) {
//         response = await reparationsAPI.update(editingReparation.id, formattedData);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         response = await reparationsAPI.create(formattedData);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       // AJOUTER: Mise à jour de l'état du matériel
//       if (formattedData.materiel) {
//         const materielId = parseInt(formattedData.materiel);
//         if (!isNaN(materielId)) {
//           const nouvelEtat = getMaterielEtatFromReparation(
//             formattedData.type_reparation,
//             formattedData.date_fin
//           );
          
//           console.log(`🔄 Mise à jour état matériel #${materielId} -> ${nouvelEtat}`);
          
//           try {
//             await updateMaterielEtat(materielId, nouvelEtat);
//             showMessage('info', `État du matériel mis à jour: ${nouvelEtat}`);
//           } catch (error: any) {
//             console.error('⚠️ Erreur mise à jour matériel:', error);
//             // Ne pas bloquer le processus pour cette erreur
//             showMessage('warning', 'Réparation enregistrée, mais erreur sur mise à jour matériel');
//           }
//         }
//       }
      
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde réparation:', error);
//       const errorMessage = error.response?.data?.message || 
//                           error.message || 
//                           'Erreur lors de la sauvegarde de la réparation';
//       showMessage('error', errorMessage);
      
//       console.error('🔍 Détails de l\'erreur:', {
//         user: getCurrentUserName(),
//         dataSent: reparationData,
//         error: error.response?.data
//       });
//     }
//   };

//   // CORRECTION: Gérer l'édition avec mise à jour du matériel
//   const handleEdit = (reparation: Reparation) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   // Gérer la suppression
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // CORRECTION: Gérer la fin de réparation avec mise à jour du matériel
//   const handleTerminer = async (id: number) => {
//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Trouver la réparation pour avoir l'ID du matériel
//       const reparation = reparations.find(r => r.id === id);
//       if (!reparation) {
//         throw new Error('Réparation non trouvée');
//       }
      
//       console.log(`🔧 Fin de réparation #${id} pour matériel #${reparation.materiel}`);
      
//       // Mettre à jour la réparation
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName
//       });
      
//       // Mettre à jour l'état du matériel
//       if (reparation.materiel) {
//         const materielId = reparation.materiel;
//         const nouvelEtat = getMaterielEtatFromReparation(reparation.type_reparation, new Date().toISOString());
        
//         console.log(`🔄 Mise à jour matériel #${materielId} -> ${nouvelEtat} (réparation terminée)`);
        
//         try {
//           await updateMaterielEtat(materielId, nouvelEtat);
//           showMessage('success', `Réparation terminée et matériel marqué comme ${nouvelEtat}`);
//         } catch (error: any) {
//           console.error('⚠️ Erreur mise à jour matériel:', error);
//           showMessage('warning', 'Réparation terminée, mais erreur sur mise à jour matériel');
//         }
//       } else {
//         showMessage('success', 'Réparation marquée comme terminée');
//       }
      
//       fetchReparations();
      
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'ajout d'une nouvelle réparation
//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Aucune donnée de relation disponible.');
//       return;
//     }

//     setEditingReparation(undefined);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Gérer la suppression multiple
//   const handleDeleteSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer l'édition multiple
//   const handleEditSelected = () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (selectedReparations.length === 1) {
//       const reparation = reparations.find(r => r.id === selectedReparations[0]);
//       if (reparation) {
//         handleEdit(reparation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
//       setEditingReparation(undefined);
//       setIsFormOpen(true);
//     }
//   };

//   // CORRECTION: Gérer la fin de réparation multiple avec mise à jour du matériel
//   const handleTerminerSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Traiter chaque réparation
//       for (const id of selectedReparations) {
//         const reparation = reparations.find(r => r.id === id);
//         if (!reparation) continue;
        
//         await reparationsAPI.update(id, { 
//           date_fin: new Date().toISOString(),
//           technicien_responsable: currentUserName
//         });
        
//         // Mettre à jour l'état du matériel
//         if (reparation.materiel) {
//           const materielId = reparation.materiel;
//           const nouvelEtat = getMaterielEtatFromReparation(reparation.type_reparation, new Date().toISOString());
          
//           try {
//             await updateMaterielEtat(materielId, nouvelEtat);
//           } catch (error: any) {
//             console.error(`⚠️ Erreur mise à jour matériel #${materielId}:`, error);
//           }
//         }
//       }
      
//       showMessage('success', `${selectedReparations.length} réparation(s) terminée(s) et matériel(s) mis à jour`);
//       setSelectedReparations([]);
//       fetchReparations();
      
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Exporter en CSV
//   const handleExport = useCallback(() => {
//     try {
//       const dataToExport = filteredReparations.map(reparation => ({
//         'Matériel': reparation.materiel_nom || 'Non spécifié',
//         'Type': getTypeText(reparation.type_reparation),
//         'Technicien': getTechnicienName(reparation) || 'Non assigné',
//         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
//         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
//         'Statut': getStatutText(reparation),
//         'Description': reparation.description || 'Aucune description'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export CSV:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   }, [filteredReparations, getTechnicienName]);

//   // Fonctions d'affichage
//   const getTypeBadge = (type: string) => {
//     const badges = {
//       preventive: 'badge-info',
//       corrective: 'badge-warning',
//       ameliorative: 'badge-success'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       preventive: 'Préventive',
//       corrective: 'Corrective',
//       ameliorative: 'Améliorative'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     const icons = {
//       preventive: <Wrench className="h-4 w-4" />,
//       corrective: <Wrench className="h-4 w-4" />,
//       ameliorative: <CheckCircle className="h-4 w-4" />
//     };
//     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
//   };

//   const isEnCours = (reparation: Reparation) => {
//     return !reparation.date_fin;
//   };

//   const getStatutBadge = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'En cours' : 'Terminée';
//   };

//   const getStatutIcon = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 
//       <Calendar className="h-4 w-4" /> : 
//       <CheckCircle className="h-4 w-4" />;
//   };

//   // Obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedReparations([]);
//   };

//   // Rendre la section statistiques
//   const renderStatistiquesSection = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {/* Carte Total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
//               <p className="text-sm opacity-60">Total réparations</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Package className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span className="text-success">{statistiques.terminees} terminées</span>
//             <span className="mx-2">•</span>
//             <span className="text-warning">{statistiques.enCours} en cours</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
//               <p className="text-sm opacity-60">Coût total</p>
//             </div>
//             <div className="p-2 bg-purple-500/10 rounded-lg">
//               <DollarSign className="h-6 w-6 text-purple-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût ce mois */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
//               <p className="text-sm opacity-60">Coût ce mois</p>
//             </div>
//             <div className="p-2 bg-blue-500/10 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-blue-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Durée moyenne */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
//               <p className="text-sm opacity-60">Jours moyen</p>
//             </div>
//             <div className="p-2 bg-green-500/10 rounded-lg">
//               <Clock className="h-6 w-6 text-green-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} réparations terminées</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Taux de complétion */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">
//                 {statistiques.total > 0 
//                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                   : '0%'
//                 }
//               </h3>
//               <p className="text-sm opacity-60">Taux de complétion</p>
//             </div>
//             <div className="p-2 bg-orange-500/10 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} / {statistiques.total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredReparations.length} réparation(s) trouvée(s)
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {getCurrentUserName()}
//             </span>
//           </p>
//           <p className="text-xs text-success opacity-70 mt-1">
//             ⚡ L'état du matériel est automatiquement mis à jour après chaque réparation
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle réparation
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques détaillées */}
//       {renderStatistiquesSection()}

//       {/* Section Utilisateur actuel */}
//       <div className="mb-6">
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Users className="h-5 w-5 text-success" />
//                 <div>
//                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
//                   <p className="text-sm">
//                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
//                   </p>
//                   <p className="text-xs text-success opacity-70 mt-1">
//                     ⚡ L'état du matériel est automatiquement mis à jour selon le type de réparation
//                   </p>
//                 </div>
//               </div>
//               <div className="badge badge-success badge-lg">
//                 Connecté
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section État des matériels */}
//       <div className="mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4">
//             <h3 className="font-bold text-base-content mb-3">📊 État des matériels après réparation</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Corrective terminée</span>
//                   <span className="badge badge-success badge-sm">✅</span>
//                 </div>
//                 <div className="text-xs opacity-70 mt-1">Matériel → <strong>Réparé</strong></div>
//               </div>
//               <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Préventive terminée</span>
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
//             </div>
//             <div className="text-xs opacity-60 mt-3">
//               ⚡ Ces mises à jour sont automatiques après chaque réparation. L'état du matériel est synchronisé en temps réel.
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section Top Techniciens */}
//       {statistiques.topTechniciens.length > 0 && (
//         <div className="mb-6">
//           <div className="card bg-base-200 shadow-sm">
//             <div className="card-body p-4">
//               <h3 className="font-bold text-base-content mb-3">🏆 Top Techniciens</h3>
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                 {statistiques.topTechniciens.map((tech, index) => (
//                   <div key={index} className="bg-base-100 p-3 rounded-lg">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-sm truncate">{tech.technicien}</span>
//                       <span className="badge badge-primary badge-sm">{tech.count}</span>
//                     </div>
//                     <div className="text-xs opacity-70">
//                       Coût: {formatCurrency(tech.cout)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

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
//                   placeholder="Matériel, technicien..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🛠️ Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
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
//                 <option value="en_cours">En cours</option>
//                 <option value="terminee">Terminée</option>
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
//           </div>

//           {/* Actions de sélection */}
//           {selectedReparations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedReparations.length} réparation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
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

//       {/* Tableau des réparations */}
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
//                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Technicien</th>
//                   <th className="font-bold">Date début</th>
//                   <th className="font-bold">Date fin</th>
//                   <th className="font-bold">Coût</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredReparations).map((reparation) => {
//                   const technicien = getTechnicienName(reparation);
//                   const isCurrentUser = technicien === getCurrentUserName();
                  
//                   return (
//                     <tr key={reparation.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedReparations.includes(reparation.id)}
//                             onChange={() => toggleSelectReparation(reparation.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {reparation.materiel_nom}
//                           {/* <div className="text-xs opacity-60">
//                             ID: {reparation.materiel}
//                           </div> */}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
//                           {getTypeIcon(reparation.type_reparation)}
//                           {getTypeText(reparation.type_reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {technicien ? (
//                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
//                               <span>{technicien}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-base-content opacity-50">Non assigné</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm">
//                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                       </td>
//                       <td>
//                         {reparation.date_fin ? (
//                           <span className="text-sm">
//                             {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
//                           </span>
//                         ) : (
//                           <div className="badge badge-warning badge-sm">En cours</div>
//                         )}
//                       </td>
//                       <td>
//                         {reparation.cout ? (
//                           <span className="font-semibold text-green-600 text-sm">
//                             {reparation.cout.toLocaleString('fr-FR')} Ar
//                           </span>
//                         ) : (
//                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
//                           {getStatutIcon(reparation)}
//                           {getStatutText(reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(reparation)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {isEnCours(reparation) && (
//                             <button
//                               onClick={() => handleTerminer(reparation.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Terminer la réparation"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(reparation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredReparations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Wrench className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType || filterStatut
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune réparation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()}
//       />
//     </div>
//   );
// };

// export default Reparations;








// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package, FileText } from 'lucide-react';
// import { Reparation } from '../types';
// import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Reparation[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// // Type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// // Type pour les statistiques
// interface StatistiquesReparations {
//   total: number;
//   enCours: number;
//   terminees: number;
//   coutTotal: number;
//   coutMois: number;
//   coutMoyen: number;
//   dureeMoyenne: number;
//   reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
//   topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
// }

// const Reparations: React.FC = () => {
//   const { user } = useAuth();
  
//   const [reparations, setReparations] = useState<Reparation[]>([]);
//   const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
//   const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
//   // États pour les filtres
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');

//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // Statistiques détaillées
//   const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
//     total: 0,
//     enCours: 0,
//     terminees: 0,
//     coutTotal: 0,
//     coutMois: 0,
//     coutMoyen: 0,
//     dureeMoyenne: 0,
//     reparationsParMois: [],
//     topTechniciens: []
//   });

//   // Récupérer le nom de l'utilisateur connecté
//   const getCurrentUserName = useCallback(() => {
//     if (!user) return 'Utilisateur Inconnu';
    
//     // CORRECTION: Récupérer comme dans le backend
//     if (user.nom_complet) return user.nom_complet;
//     if (user.full_name) return user.full_name;
//     if (user.first_name && user.last_name) {
//       const fullName = `${user.first_name} ${user.last_name}`.trim();
//       return fullName || user.username;
//     }
//     if (user.name) return user.name;
//     if (user.username) return user.username;
    
//     return 'Utilisateur';
//   }, [user]);

//   // AJOUTER: Fonction pour déterminer l'état du matériel basé sur la réparation
//   const getMaterielEtatFromReparation = useCallback((typeReparation: string, dateFin?: string): string => {
//     if (dateFin) {
//       // Réparation terminée
//       switch (typeReparation) {
//         case 'corrective':
//           return 'repare'; // Après une corrective terminée
//         case 'preventive':
//         case 'ameliorative':
//         default:
//           return 'fonctionnel'; // Après une préventive/améliorative terminée
//       }
//     } else {
//       // Réparation en cours
//       switch (typeReparation) {
//         case 'corrective':
//           return 'en_panne';
//         case 'preventive':
//           return 'en_maintenance';
//         case 'ameliorative':
//           return 'en_amelioration';
//         default:
//           return 'en_reparation';
//       }
//     }
//   }, []);

//   // AJOUTER: Fonction pour mettre à jour l'état du matériel
//   const updateMaterielEtat = useCallback(async (materielId: number, nouvelEtat: string) => {
//     try {
//       console.log(`🔄 Mise à jour état matériel #${materielId} -> ${nouvelEtat}`);
      
//       const updateData = { 
//         etat: nouvelEtat,
//         date_derniere_maintenance: new Date().toISOString().split('T')[0]
//       };
      
//       console.log('📤 Données de mise à jour matériel:', updateData);
      
//       const response = await materielsAPI.update(materielId, updateData);
//       console.log(`✅ Matériel #${materielId} mis à jour avec état: ${nouvelEtat}`);
//       return response;
      
//     } catch (error: any) {
//       console.error(`❌ Erreur mise à jour état matériel:`, error);
//       const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du matériel';
//       console.error(`Détails: ${errorMsg}`);
//       throw error;
//     }
//   }, []);

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = useCallback((data: Reparation[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         enCours: 0,
//         terminees: 0,
//         coutTotal: 0,
//         coutMois: 0,
//         coutMoyen: 0,
//         dureeMoyenne: 0,
//         reparationsParMois: [],
//         topTechniciens: []
//       });
//       return;
//     }

//     const now = new Date();
//     const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     // Calculs de base
//     const reparationsEnCours = data.filter(r => !r.date_fin);
//     const reparationsTerminees = data.filter(r => r.date_fin);
//     const reparationsCeMois = data.filter(r => 
//       r.date_debut && new Date(r.date_debut) >= debutMois
//     );
    
//     // Calcul des coûts
//     const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
//     const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
//     // Calcul du coût moyen
//     const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
//     // Calcul de la durée moyenne des réparations terminées
//     let dureeTotale = 0;
//     let reparationsAvecDuree = 0;
    
//     reparationsTerminees.forEach(rep => {
//       if (rep.date_debut && rep.date_fin) {
//         try {
//           const dateDebut = new Date(rep.date_debut);
//           const dateFin = new Date(rep.date_fin);
//           if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
//             const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
//             dureeTotale += duree;
//             reparationsAvecDuree++;
//           }
//         } catch (e) {
//           console.warn('Erreur calcul durée:', e);
//         }
//       }
//     });
    
//     const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
//     // Réparations par mois (6 derniers mois)
//     const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
//     const moisActuel = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
//       const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
//       reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
//     }
    
//     data.forEach(rep => {
//       if (rep.date_debut) {
//         try {
//           const date = new Date(rep.date_debut);
//           const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
//           if (reparationsParMoisMap[moisKey]) {
//             reparationsParMoisMap[moisKey].count++;
//             reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
//           }
//         } catch (e) {
//           console.warn('Erreur date réparation:', e);
//         }
//       }
//     });
    
//     const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
//       mois,
//       count: data.count,
//       cout: data.cout
//     }));
    
//     // Top techniciens
//     const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
//     data.forEach(rep => {
//       // CORRECTION: Utiliser la même méthode que le backend
//       const technicien = getTechnicienName(rep) || 'Non assigné';
//       if (!techniciensMap[technicien]) {
//         techniciensMap[technicien] = { count: 0, cout: 0 };
//       }
//       techniciensMap[technicien].count++;
//       techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
//     });
    
//     const topTechniciens = Object.entries(techniciensMap)
//       .map(([technicien, data]) => ({ technicien, ...data }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     setStatistiques({
//       total: data.length,
//       enCours: reparationsEnCours.length,
//       terminees: reparationsTerminees.length,
//       coutTotal,
//       coutMois,
//       coutMoyen: parseFloat(coutMoyen.toFixed(2)),
//       dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
//       reparationsParMois,
//       topTechniciens
//     });
//   }, []);

//   // Charger les réparations
//   const fetchReparations = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des réparations...');
      
//       const response = await reparationsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log('✅ Réparations chargées:', extractedData.length);
      
//       setReparations(extractedData);
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement réparations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des réparations';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);

//       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showMessage('error', 'Erreur lors du chargement des données');
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Charger toutes les données au montage
//   useEffect(() => {
//     fetchReparations();
//     fetchRelationsData();
//   }, []);

//   // Filtrer les réparations
//   useEffect(() => {
//     let filtered = safeArray(reparations);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter(filtered, reparation => {
//         const technicien = getTechnicienName(reparation).toLowerCase();
//         const description = reparation.description?.toLowerCase() || '';
        
//         return (
//           reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
//           description.includes(searchLower) ||
//           technicien.includes(searchLower)
//         );
//       });
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
//     }

//     if (filterStatut) {
//       if (filterStatut === 'en_cours') {
//         filtered = safeFilter(filtered, reparation => !reparation.date_fin);
//       } else if (filterStatut === 'terminee') {
//         filtered = safeFilter(filtered, reparation => reparation.date_fin);
//       }
//     }

//     setFilteredReparations(filtered);
//     setSelectedReparations([]);
//   }, [reparations, searchTerm, filterType, filterStatut]);

//   // Gérer la sélection multiple
//   useEffect(() => {
//     if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedReparations, filteredReparations]);

//   // Afficher un message
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // CORRECTION: Trouver le nom du technicien comme dans le backend
//   const getTechnicienName = useCallback((reparation: any): string => {
//     if (!reparation) return '';
    
//     // CORRECTION: Récupérer le champ exact comme dans le backend
//     // Le backend envoie 'technicien_responsable' directement
//     if (reparation.technicien_responsable && typeof reparation.technicien_responsable === 'string') {
//       return reparation.technicien_responsable.trim();
//     }
    
//     // Fallback: chercher dans d'autres champs possibles
//     const possibleFields = [
//       'technicien',
//       'responsable', 
//       'technician',
//       'technician_responsable',
//       'responsible_technician',
//       'tech_responsable',
//       'nom_technicien',
//       'technicien_nom',
//       'technician_name',
//       'responsible'
//     ];
    
//     for (const field of possibleFields) {
//       if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
//         return reparation[field];
//       }
//     }
    
//     // Si aucun champ trouvé, retourner une valeur par défaut
//     return 'Technicien Non Spécifié';
//   }, []);

//   // Formater la devise en Ariary
//   const formatCurrency = useCallback((amount: number | string): string => {
//     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(numAmount)) return '0 Ar';
//     return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
//   }, []);

//   // Formater les nombres
//   const formatNumber = useCallback((num: number): string => {
//     return new Intl.NumberFormat('fr-FR').format(num);
//   }, []);

//   // CORRECTION: Gérer la soumission d'une réparation avec mise à jour de l'état du matériel
//   const handleSubmit = async (reparationData: any) => {
//     try {
//       console.log('📤 Données reçues du formulaire:', reparationData);
      
//       const currentUserName = getCurrentUserName();
//       console.log('👤 Technicien automatique (depuis parent):', currentUserName);
      
//       // CORRECTION CRITIQUE: Utiliser le technicien du formulaire TOUJOURS
//       const technicienResponsable = reparationData.technicien_responsable?.trim() || currentUserName;
      
//       if (!technicienResponsable || technicienResponsable === '') {
//         throw new Error('Le nom du technicien est requis');
//       }
      
//       // Préparer les données pour l'API - IMPORTANT: format correct
//       const formattedData: any = {
//         materiel: parseInt(reparationData.materiel) || reparationData.materiel,
//         type_reparation: reparationData.type_reparation,
//         date_debut: reparationData.date_debut,
//         cout: parseFloat(reparationData.cout) || 0,
//         technicien_responsable: technicienResponsable, // TOUJOURS présent
//         description: reparationData.description || 'Réparation effectuée',
//       };
      
//       // Ajouter la date de fin si elle existe
//       if (reparationData.date_fin && reparationData.date_fin.trim() !== '') {
//         formattedData.date_fin = reparationData.date_fin;
//       }
      
//       // Ajouter l'incident si spécifié
//       if (reparationData.incident && reparationData.incident !== '') {
//         formattedData.incident = parseInt(reparationData.incident) || reparationData.incident;
//       }
      
//       console.log('📝 Données formatées pour API:', formattedData);
//       console.log('✅ Technicien dans données:', formattedData.technicien_responsable);
      
//       let response;
      
//       if (editingReparation) {
//         response = await reparationsAPI.update(editingReparation.id, formattedData);
//         showMessage('success', 'Réparation modifiée avec succès');
//       } else {
//         response = await reparationsAPI.create(formattedData);
//         showMessage('success', 'Réparation créée avec succès');
//       }
      
//       // Mise à jour de l'état du matériel
//       if (formattedData.materiel) {
//         const materielId = parseInt(formattedData.materiel);
//         if (!isNaN(materielId)) {
//           const nouvelEtat = getMaterielEtatFromReparation(
//             formattedData.type_reparation,
//             formattedData.date_fin
//           );
          
//           console.log(`🔄 Mise à jour état matériel #${materielId} -> ${nouvelEtat}`);
          
//           try {
//             await updateMaterielEtat(materielId, nouvelEtat);
//             showMessage('info', `État du matériel mis à jour: ${nouvelEtat}`);
//           } catch (error: any) {
//             console.error('⚠️ Erreur mise à jour matériel:', error);
//             showMessage('warning', 'Réparation enregistrée, mais erreur sur mise à jour matériel');
//           }
//         }
//       }
      
//       await fetchReparations();
//       setIsFormOpen(false);
//       setEditingReparation(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde réparation:', error);
      
//       // Message d'erreur amélioré
//       let errorMessage = 'Erreur lors de la sauvegarde de la réparation';
      
//       if (error.response?.data) {
//         if (typeof error.response.data === 'string') {
//           // Essayer d'extraire le message d'erreur
//           const match = error.response.data.match(/class="exception_value">([^<]+)</);
//           if (match) {
//             errorMessage = match[1].trim();
//           } else {
//             errorMessage = error.response.data.substring(0, 200);
//           }
//         } else if (error.response.data.technicien_responsable) {
//           errorMessage = `Technicien: ${error.response.data.technicien_responsable}`;
//         } else if (error.response.data.detail) {
//           errorMessage = error.response.data.detail;
//         } else if (error.response.data.message) {
//           errorMessage = error.response.data.message;
//         } else if (typeof error.response.data === 'object') {
//           errorMessage = Object.values(error.response.data).join(', ');
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       showMessage('error', errorMessage);
      
//       console.error('🔍 Détails de l\'erreur:', {
//         user: getCurrentUserName(),
//         dataSent: reparationData,
//         error: error.response?.data
//       });
//     }
//   };

//   // Gérer l'édition
//   const handleEdit = (reparation: Reparation) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingReparation(reparation);
//     setIsFormOpen(true);
//   };

//   // Gérer la suppression
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
//       try {
//         await reparationsAPI.delete(id);
//         showMessage('success', 'Réparation supprimée avec succès');
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer la fin de réparation avec mise à jour du matériel
//   const handleTerminer = async (id: number) => {
//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Trouver la réparation pour avoir l'ID du matériel
//       const reparation = reparations.find(r => r.id === id);
//       if (!reparation) {
//         throw new Error('Réparation non trouvée');
//       }
      
//       console.log(`🔧 Fin de réparation #${id} pour matériel #${reparation.materiel}`);
      
//       // CORRECTION: Mettre à jour la réparation avec le bon format
//       await reparationsAPI.update(id, { 
//         date_fin: new Date().toISOString(),
//         technicien_responsable: currentUserName
//       });
      
//       // Mettre à jour l'état du matériel
//       if (reparation.materiel) {
//         const materielId = reparation.materiel;
//         const nouvelEtat = getMaterielEtatFromReparation(reparation.type_reparation, new Date().toISOString());
        
//         console.log(`🔄 Mise à jour matériel #${materielId} -> ${nouvelEtat} (réparation terminée)`);
        
//         try {
//           await updateMaterielEtat(materielId, nouvelEtat);
//           showMessage('success', `Réparation terminée et matériel marqué comme ${nouvelEtat}`);
//         } catch (error: any) {
//           console.error('⚠️ Erreur mise à jour matériel:', error);
//           showMessage('warning', 'Réparation terminée, mais erreur sur mise à jour matériel');
//         }
//       } else {
//         showMessage('success', 'Réparation marquée comme terminée');
//       }
      
//       fetchReparations();
      
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gérer l'ajout d'une nouvelle réparation
//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Aucune donnée de relation disponible.');
//       return;
//     }

//     setEditingReparation(undefined);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectReparation = (id: number) => {
//     setSelectedReparations(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedReparations([]);
//     } else {
//       const allIds = filteredReparations.map(r => r.id);
//       setSelectedReparations(allIds);
//     }
//   };

//   // Gérer la suppression multiple
//   const handleDeleteSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
//       try {
//         await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
//         showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
//         setSelectedReparations([]);
//         fetchReparations();
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
//         showMessage('error', errorMessage);
//       }
//     }
//   };

//   // Gérer l'édition multiple
//   const handleEditSelected = () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     if (selectedReparations.length === 1) {
//       const reparation = reparations.find(r => r.id === selectedReparations[0]);
//       if (reparation) {
//         handleEdit(reparation);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
//       setEditingReparation(undefined);
//       setIsFormOpen(true);
//     }
//   };

//   // Gérer la fin de réparation multiple avec mise à jour du matériel
//   const handleTerminerSelected = async () => {
//     if (selectedReparations.length === 0) {
//       showMessage('error', 'Aucune réparation sélectionnée');
//       return;
//     }

//     try {
//       const currentUserName = getCurrentUserName();
      
//       if (!currentUserName || currentUserName.trim() === '') {
//         throw new Error('Nom du technicien non disponible');
//       }
      
//       // Traiter chaque réparation
//       for (const id of selectedReparations) {
//         const reparation = reparations.find(r => r.id === id);
//         if (!reparation) continue;
        
//         await reparationsAPI.update(id, { 
//           date_fin: new Date().toISOString(),
//           technicien_responsable: currentUserName
//         });
        
//         // Mettre à jour l'état du matériel
//         if (reparation.materiel) {
//           const materielId = reparation.materiel;
//           const nouvelEtat = getMaterielEtatFromReparation(reparation.type_reparation, new Date().toISOString());
          
//           try {
//             await updateMaterielEtat(materielId, nouvelEtat);
//           } catch (error: any) {
//             console.error(`⚠️ Erreur mise à jour matériel #${materielId}:`, error);
//           }
//         }
//       }
      
//       showMessage('success', `${selectedReparations.length} réparation(s) terminée(s) et matériel(s) mis à jour`);
//       setSelectedReparations([]);
//       fetchReparations();
      
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Exporter en CSV
//   const handleExport = useCallback(() => {
//     try {
//       const dataToExport = filteredReparations.map(reparation => ({
//         'Matériel': reparation.materiel_nom || 'Non spécifié',
//         'Type': getTypeText(reparation.type_reparation),
//         'Technicien': getTechnicienName(reparation) || 'Non assigné',
//         'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
//         'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
//         'Statut': getStatutText(reparation),
//         'Description': reparation.description || 'Aucune description'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export CSV:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   }, [filteredReparations, getTechnicienName]);

//   // Fonctions d'affichage
//   const getTypeBadge = (type: string) => {
//     const badges = {
//       preventive: 'badge-info',
//       corrective: 'badge-warning',
//       ameliorative: 'badge-success'
//     };
//     return badges[type as keyof typeof badges] || 'badge-neutral';
//   };

//   const getTypeText = (type: string) => {
//     const texts = {
//       preventive: 'Préventive',
//       corrective: 'Corrective',
//       ameliorative: 'Améliorative'
//     };
//     return texts[type as keyof typeof texts] || type;
//   };

//   const getTypeIcon = (type: string) => {
//     const icons = {
//       preventive: <Wrench className="h-4 w-4" />,
//       corrective: <Wrench className="h-4 w-4" />,
//       ameliorative: <CheckCircle className="h-4 w-4" />
//     };
//     return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
//   };

//   const isEnCours = (reparation: Reparation) => {
//     return !reparation.date_fin;
//   };

//   const getStatutBadge = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
//   };

//   const getStatutText = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 'En cours' : 'Terminée';
//   };

//   const getStatutIcon = (reparation: Reparation) => {
//     return isEnCours(reparation) ? 
//       <Calendar className="h-4 w-4" /> : 
//       <CheckCircle className="h-4 w-4" />;
//   };

//   // Obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterType('');
//     setFilterStatut('');
//     setSelectedReparations([]);
//   };

//   // Rendre la section statistiques
//   const renderStatistiquesSection = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//       {/* Carte Total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
//               <p className="text-sm opacity-60">Total réparations</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Package className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span className="text-success">{statistiques.terminees} terminées</span>
//             <span className="mx-2">•</span>
//             <span className="text-warning">{statistiques.enCours} en cours</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût total */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
//               <p className="text-sm opacity-60">Coût total</p>
//             </div>
//             <div className="p-2 bg-purple-500/10 rounded-lg">
//               <DollarSign className="h-6 w-6 text-purple-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Coût ce mois */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
//               <p className="text-sm opacity-60">Coût ce mois</p>
//             </div>
//             <div className="p-2 bg-blue-500/10 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-blue-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Durée moyenne */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
//               <p className="text-sm opacity-60">Jours moyen</p>
//             </div>
//             <div className="p-2 bg-green-500/10 rounded-lg">
//               <Clock className="h-6 w-6 text-green-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} réparations terminées</span>
//           </div>
//         </div>
//       </div>

//       {/* Carte Taux de complétion */}
//       <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="card-body p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold">
//                 {statistiques.total > 0 
//                   ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
//                   : '0%'
//                 }
//               </h3>
//               <p className="text-sm opacity-60">Taux de complétion</p>
//             </div>
//             <div className="p-2 bg-orange-500/10 rounded-lg">
//               <CheckCircle className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <div className="mt-2 text-xs">
//             <span>{statistiques.terminees} / {statistiques.total}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des réparations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredReparations.length} réparation(s) trouvée(s)
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {getCurrentUserName()}
//             </span>
//           </p>
//           <p className="text-xs text-success opacity-70 mt-1">
//             ⚡ L'état du matériel est automatiquement mis à jour après chaque réparation
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle réparation
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques détaillées */}
//       {renderStatistiquesSection()}

//       {/* Section Utilisateur actuel */}
//       <div className="mb-6">
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Users className="h-5 w-5 text-success" />
//                 <div>
//                   <h3 className="font-bold text-success">Utilisateur Connecté</h3>
//                   <p className="text-sm">
//                     Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
//                   </p>
//                   <p className="text-xs text-success opacity-70 mt-1">
//                     ⚡ L'état du matériel est automatiquement mis à jour selon le type de réparation
//                   </p>
//                 </div>
//               </div>
//               <div className="badge badge-success badge-lg">
//                 Connecté
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
//                   placeholder="Matériel, technicien, description..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🛠️ Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="preventive">Préventive</option>
//                 <option value="corrective">Corrective</option>
//                 <option value="ameliorative">Améliorative</option>
//               </select>
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
//                 <option value="en_cours">En cours</option>
//                 <option value="terminee">Terminée</option>
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
//           </div>

//           {/* Actions de sélection */}
//           {selectedReparations.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedReparations.length} réparation(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTerminerSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Terminer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedReparations.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedReparations([])}
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

//       {/* Tableau des réparations AVEC COLONNE DESCRIPTION */}
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
//                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Technicien</th>
//                   <th className="font-bold">Description</th>
//                   <th className="font-bold">Date début</th>
//                   <th className="font-bold">Date fin</th>
//                   <th className="font-bold">Coût</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredReparations).map((reparation) => {
//                   const technicien = getTechnicienName(reparation);
//                   const isCurrentUser = technicien === getCurrentUserName();
                  
//                   return (
//                     <tr key={reparation.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedReparations.includes(reparation.id)}
//                             onChange={() => toggleSelectReparation(reparation.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {reparation.materiel_nom}
//                           <div className="text-xs opacity-60">
//                             ID: {reparation.materiel}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
//                           {getTypeIcon(reparation.type_reparation)}
//                           {getTypeText(reparation.type_reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {technicien ? (
//                             <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
//                               <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
//                               <span className="font-medium">{technicien}</span>
//                               {isCurrentUser && (
//                                 <span className="badge badge-success badge-xs ml-1">VOUS</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-base-content opacity-50">Non assigné</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         {/* NOUVELLE COLONNE : Description */}
//                         <div className="max-w-xs">
//                           {reparation.description ? (
//                             <>
//                               <div className="font-medium text-sm line-clamp-2">
//                                 {reparation.description}
//                               </div>
//                               {reparation.incident && (
//                                 <div className="text-xs opacity-70 mt-1">
//                                   <FileText className="h-3 w-3 inline mr-1" />
//                                   Incident #{reparation.incident}
//                                 </div>
//                               )}
//                             </>
//                           ) : (
//                             <span className="text-base-content opacity-50 text-sm">Aucune description</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm">
//                           {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                       </td>
//                       <td>
//                         {reparation.date_fin ? (
//                           <span className="text-sm">
//                             {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
//                           </span>
//                         ) : (
//                           <div className="badge badge-warning badge-sm">En cours</div>
//                         )}
//                       </td>
//                       <td>
//                         {reparation.cout ? (
//                           <span className="font-semibold text-green-600 text-sm">
//                             {reparation.cout.toLocaleString('fr-FR')} Ar
//                           </span>
//                         ) : (
//                           <span className="text-base-content opacity-50 text-sm">0 Ar</span>
//                         )}
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
//                           {getStatutIcon(reparation)}
//                           {getStatutText(reparation)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(reparation)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {isEnCours(reparation) && (
//                             <button
//                               onClick={() => handleTerminer(reparation.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Terminer la réparation"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(reparation.id)}
//                             className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {safeArray(filteredReparations).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Wrench className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune réparation trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterType || filterStatut
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune réparation n'est enregistrée dans le système"
//                   }
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingReparation(undefined);
//         }}
//         onSubmit={handleSubmit}
//         reparation={editingReparation}
//         materiels={materiels}
//         incidents={incidents}
//         userName={getCurrentUserName()}
//       />
//     </div>
//   );
// };

// export default Reparations;





import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download, Users, TrendingUp, DollarSign, Clock, Package } from 'lucide-react';
import { Reparation } from '../types';
import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
import ReparationForm from '../components/ReparationForm';
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
      'complete': 'TERMINAISON',
      'terminate': 'TERMINAISON',
      'start': 'DÉMARRAGE'
    };
    
    const action = actionsMap[operation] || operation.toUpperCase();
    const details = `${operation === 'create' ? 'Ajout' : 
                     operation === 'read' ? 'Consultation' :
                     operation === 'update' ? 'Modification' :
                     operation === 'delete' ? 'Suppression' :
                     operation === 'export' ? 'Export' :
                     operation === 'complete' ? 'Terminaison' :
                     operation === 'terminate' ? 'Terminaison' :
                     operation === 'start' ? 'Démarrage' : operation} ${module.toLowerCase()}: ${itemName}`;
    
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
  
  const logMaterialUpdate = (materielId, oldState, newState, reparationId) => {
    logAction('MISE À JOUR MATÉRIEL', 'Réparations', `Matériel #${materielId}: ${oldState} → ${newState}`, {
      materielId: materielId,
      reparationId: reparationId,
      oldState: oldState,
      newState: newState,
      type: 'material_update'
    });
  };
  
  const logReparationCompletion = (reparationId, materielId, technicien, cout) => {
    logAction('RÉPARATION TERMINÉE', 'Réparations', `Réparation #${reparationId} terminée par ${technicien}`, {
      reparationId: reparationId,
      materielId: materielId,
      technicien: technicien,
      cout: cout,
      type: 'reparation_completion'
    });
  };
  
  return {
    logAction,
    logCRUD,
    logSearch,
    logFilter,
    logExport,
    logMaterialUpdate,
    logReparationCompletion,
    
    // Fonctions spécifiques pour les réparations
    logReparationCreate: (reparationData) => 
      logCRUD('create', 'Réparations', `Réparation: ${reparationData.description?.substring(0, 50)}...` || 'Nouvelle réparation', { 
        data: reparationData,
        materiel: reparationData.materiel,
        type: reparationData.type_reparation
      }),
    
    logReparationUpdate: (id, oldData, newData) => 
      logCRUD('update', 'Réparations', `Réparation #${id}`, {
        id: id,
        oldData: oldData,
        newData: newData,
        changes: getChanges(oldData, newData)
      }),
    
    logReparationDelete: (id, reparationData) =>
      logCRUD('delete', 'Réparations', `Réparation #${id}`, { id: id, data: reparationData }),
    
    logReparationComplete: (id, reparationData, materielId) =>
      logCRUD('complete', 'Réparations', `Réparation #${id} terminée`, { 
        id: id, 
        data: reparationData,
        materielId: materielId 
      }),
    
    logReparationExport: (format, count, filters) =>
      logExport('Réparations', format, count, filters),
    
    logReparationView: (reparation) =>
      logCRUD('read', 'Réparations', `Réparation #${reparation.id}`, { id: reparation.id, data: reparation }),
    
    logReparationSearch: (term, count) =>
      logSearch('Réparations', term, count),
    
    logReparationFilter: (filterType, count) =>
      logFilter('Réparations', filterType, count)
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
const safeArray = (data: any): Reparation[] => {
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): Reparation[] => {
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

// Type pour les messages
type MessageType = 'success' | 'error' | 'info' | 'warning';

// Type pour les statistiques
interface StatistiquesReparations {
  total: number;
  enCours: number;
  terminees: number;
  coutTotal: number;
  coutMois: number;
  coutMoyen: number;
  dureeMoyenne: number;
  reparationsParMois: Array<{ mois: string; count: number; cout: number }>;
  topTechniciens: Array<{ technicien: string; count: number; cout: number }>;
}

const Reparations: React.FC = () => {
  const { user } = useAuth();
  
  // ==================== INITIALISATION AUTO-LOGGER ====================
  const autoLogger = useAutoLogger();
  
  const [reparations, setReparations] = useState<Reparation[]>([]);
  const [filteredReparations, setFilteredReparations] = useState<Reparation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReparation, setEditingReparation] = useState<Reparation | undefined>();
  const [selectedReparations, setSelectedReparations] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatut, setFilterStatut] = useState<string>('');

  // États pour les données de relations
  const [materiels, setMateriels] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

  // Statistiques détaillées
  const [statistiques, setStatistiques] = useState<StatistiquesReparations>({
    total: 0,
    enCours: 0,
    terminees: 0,
    coutTotal: 0,
    coutMois: 0,
    coutMoyen: 0,
    dureeMoyenne: 0,
    reparationsParMois: [],
    topTechniciens: []
  });

  // Récupérer le nom de l'utilisateur connecté
  const getCurrentUserName = useCallback(() => {
    if (!user) return 'Utilisateur Inconnu';
    
    if (user.nom_complet) return user.nom_complet;
    if (user.full_name) return user.full_name;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.name) return user.name;
    if (user.username) return user.username;
    
    return 'Utilisateur';
  }, [user]);

  // AJOUTER: Fonction pour déterminer l'état du matériel basé sur la réparation
  const getMaterielEtatFromReparation = useCallback((typeReparation: string, dateFin?: string): string => {
    if (dateFin) {
      // Réparation terminée
      switch (typeReparation) {
        case 'corrective':
          return 'repare'; // Après une corrective terminée
        case 'preventive':
        case 'ameliorative':
        default:
          return 'fonctionnel'; // Après une préventive/améliorative terminée
      }
    } else {
      // Réparation en cours
      switch (typeReparation) {
        case 'corrective':
          return 'en_panne';
        case 'preventive':
          return 'en_maintenance';
        case 'ameliorative':
          return 'en_amelioration';
        default:
          return 'en_reparation';
      }
    }
  }, []);

  // AJOUTER: Fonction pour mettre à jour l'état du matériel
  const updateMaterielEtat = useCallback(async (materielId: number, nouvelEtat: string, reparationId?: number) => {
    try {
      console.log(`🔄 Mise à jour état matériel #${materielId} -> ${nouvelEtat}`);
      
      const updateData = { 
        etat: nouvelEtat,
        date_derniere_maintenance: new Date().toISOString().split('T')[0]
      };
      
      console.log('📤 Données de mise à jour matériel:', updateData);
      
      const response = await materielsAPI.update(materielId, updateData);
      
      // 🔥 AUTO-LOGGER: Mise à jour de l'état du matériel
      const oldState = 'unknown'; // On ne connaît pas l'ancien état sans requête supplémentaire
      autoLogger.logMaterialUpdate(materielId, oldState, nouvelEtat, reparationId);
      
      console.log(`✅ Matériel #${materielId} mis à jour avec état: ${nouvelEtat}`);
      return response;
      
    } catch (error: any) {
      console.error(`❌ Erreur mise à jour état matériel:`, error);
      const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du matériel';
      console.error(`Détails: ${errorMsg}`);
      throw error;
    }
  }, [autoLogger]);

  // Fonction pour calculer les statistiques
  const calculerStatistiques = useCallback((data: Reparation[]) => {
    if (!data || data.length === 0) {
      setStatistiques({
        total: 0,
        enCours: 0,
        terminees: 0,
        coutTotal: 0,
        coutMois: 0,
        coutMoyen: 0,
        dureeMoyenne: 0,
        reparationsParMois: [],
        topTechniciens: []
      });
      return;
    }

    const now = new Date();
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Calculs de base
    const reparationsEnCours = data.filter(r => !r.date_fin);
    const reparationsTerminees = data.filter(r => r.date_fin);
    const reparationsCeMois = data.filter(r => 
      r.date_debut && new Date(r.date_debut) >= debutMois
    );
    
    // Calcul des coûts
    const coutTotal = data.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    const coutMois = reparationsCeMois.reduce((sum, rep) => sum + (parseFloat(rep.cout?.toString()) || 0), 0);
    
    // Calcul du coût moyen
    const coutMoyen = data.length > 0 ? coutTotal / data.length : 0;
    
    // Calcul de la durée moyenne des réparations terminées
    let dureeTotale = 0;
    let reparationsAvecDuree = 0;
    
    reparationsTerminees.forEach(rep => {
      if (rep.date_debut && rep.date_fin) {
        try {
          const dateDebut = new Date(rep.date_debut);
          const dateFin = new Date(rep.date_fin);
          if (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) {
            const duree = (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24); // En jours
            dureeTotale += duree;
            reparationsAvecDuree++;
          }
        } catch (e) {
          console.warn('Erreur calcul durée:', e);
        }
      }
    });
    
    const dureeMoyenne = reparationsAvecDuree > 0 ? dureeTotale / reparationsAvecDuree : 0;
    
    // Réparations par mois (6 derniers mois)
    const reparationsParMoisMap: { [key: string]: { count: number; cout: number } } = {};
    const moisActuel = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const mois = new Date(moisActuel.getFullYear(), moisActuel.getMonth() - i, 1);
      const moisKey = mois.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      reparationsParMoisMap[moisKey] = { count: 0, cout: 0 };
    }
    
    data.forEach(rep => {
      if (rep.date_debut) {
        try {
          const date = new Date(rep.date_debut);
          const moisKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
          if (reparationsParMoisMap[moisKey]) {
            reparationsParMoisMap[moisKey].count++;
            reparationsParMoisMap[moisKey].cout += parseFloat(rep.cout?.toString()) || 0;
          }
        } catch (e) {
          console.warn('Erreur date réparation:', e);
        }
      }
    });
    
    const reparationsParMois = Object.entries(reparationsParMoisMap).map(([mois, data]) => ({
      mois,
      count: data.count,
      cout: data.cout
    }));
    
    // Top techniciens
    const techniciensMap: { [key: string]: { count: number; cout: number } } = {};
    
    data.forEach(rep => {
      const technicien = getTechnicienName(rep) || 'Non assigné';
      if (!techniciensMap[technicien]) {
        techniciensMap[technicien] = { count: 0, cout: 0 };
      }
      techniciensMap[technicien].count++;
      techniciensMap[technicien].cout += parseFloat(rep.cout?.toString()) || 0;
    });
    
    const topTechniciens = Object.entries(techniciensMap)
      .map(([technicien, data]) => ({ technicien, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setStatistiques({
      total: data.length,
      enCours: reparationsEnCours.length,
      terminees: reparationsTerminees.length,
      coutTotal,
      coutMois,
      coutMoyen: parseFloat(coutMoyen.toFixed(2)),
      dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1)),
      reparationsParMois,
      topTechniciens
    });
  }, []);

  // Charger les réparations
  const fetchReparations = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Chargement des réparations...');
      
      const response = await reparationsAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      
      console.log('✅ Réparations chargées:', extractedData.length);
      
      // 🔥 AUTO-LOGGER: Chargement des réparations
      autoLogger.logAction('CHARGEMENT', 'Réparations', `Chargement de ${extractedData.length} réparations`, {
        count: extractedData.length,
        type: 'load'
      });
      
      setReparations(extractedData);
      calculerStatistiques(extractedData);
      
    } catch (err: any) {
      console.error('❌ Erreur chargement réparations:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Erreur lors du chargement des réparations';
      setError(errorMessage);
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données de relations
  const fetchRelationsData = async () => {
    try {
      setLoadingRelations(true);

      const [materielsResponse, incidentsResponse] = await Promise.allSettled([
        materielsAPI.getAll().catch(err => {
          console.error('❌ Erreur chargement matériels:', err);
          return { data: [] };
        }),
        incidentsAPI.getAll().catch(err => {
          console.error('❌ Erreur chargement incidents:', err);
          return { data: [] };
        })
      ]);

      const materielsData = materielsResponse.status === 'fulfilled' 
        ? extractDataFromResponse(materielsResponse.value) 
        : [];
      
      const incidentsData = incidentsResponse.status === 'fulfilled' 
        ? extractDataFromResponse(incidentsResponse.value) 
        : [];

      setMateriels(materielsData);
      setIncidents(incidentsData);

    } catch (err: any) {
      console.error('❌ Erreur chargement relations:', err);
      showMessage('error', 'Erreur lors du chargement des données');
      setMateriels([]);
      setIncidents([]);
    } finally {
      setLoadingRelations(false);
    }
  };

  // Charger toutes les données au montage
  useEffect(() => {
    fetchReparations();
    fetchRelationsData();
  }, []);

  // Filtrer les réparations
  useEffect(() => {
    let filtered = safeArray(reparations);

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = safeFilter(filtered, reparation => {
        const technicien = getTechnicienName(reparation).toLowerCase();
        return (
          reparation.materiel_nom?.toLowerCase().includes(searchLower) ||
          reparation.description?.toLowerCase().includes(searchLower) ||
          technicien.includes(searchLower)
        );
      });
      
      // 🔥 AUTO-LOGGER: Recherche de réparations
      if (searchTerm.trim()) {
        autoLogger.logReparationSearch(searchTerm, filtered.length);
      }
    }

    if (filterType) {
      filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
      
      // 🔥 AUTO-LOGGER: Filtre par type
      autoLogger.logReparationFilter(`type: ${filterType}`, filtered.length);
    }

    if (filterStatut) {
      if (filterStatut === 'en_cours') {
        filtered = safeFilter(filtered, reparation => !reparation.date_fin);
      } else if (filterStatut === 'terminee') {
        filtered = safeFilter(filtered, reparation => reparation.date_fin);
      }
      
      // 🔥 AUTO-LOGGER: Filtre par statut
      autoLogger.logReparationFilter(`statut: ${filterStatut}`, filtered.length);
    }

    setFilteredReparations(filtered);
    setSelectedReparations([]);
  }, [reparations, searchTerm, filterType, filterStatut]);

  // Gérer la sélection multiple
  useEffect(() => {
    if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedReparations, filteredReparations]);

  // Afficher un message
  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Trouver le nom du technicien
  const getTechnicienName = useCallback((reparation: any): string => {
    if (!reparation) return '';
    
    const possibleFields = [
      'technicien_responsable',
      'technicien',
      'responsable', 
      'technician',
      'technician_responsable',
      'responsible_technician',
      'tech_responsable',
      'nom_technicien',
      'technicien_nom',
      'technician_name',
      'responsible',
      'assigné_à',
      'assigned_to'
    ];
    
    for (const field of possibleFields) {
      if (reparation[field] && typeof reparation[field] === 'string' && reparation[field].trim() !== '') {
        return reparation[field];
      }
    }
    
    return '';
  }, []);

  // Formater la devise en Ariary
  const formatCurrency = useCallback((amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '0 Ar';
    return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar';
  }, []);

  // Formater les nombres
  const formatNumber = useCallback((num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  }, []);

  // CORRECTION: Gérer la soumission d'une réparation avec mise à jour de l'état du matériel
  const handleSubmit = async (reparationData: any) => {
    try {
      console.log('📤 Données reçues du formulaire:', reparationData);
      
      const currentUserName = getCurrentUserName();
      console.log('👤 Technicien automatique (depuis parent):', currentUserName);
      
      // Assurer que technicien_responsable n'est jamais null
      const technicienResponsable = reparationData.technicien_responsable?.trim() || currentUserName;
      
      if (!technicienResponsable || technicienResponsable === '') {
        throw new Error('Le nom du technicien est requis');
      }
      
      // Préparer les données pour l'API
      const formattedData = {
        materiel: reparationData.materiel,
        type_reparation: reparationData.type_reparation,
        date_debut: reparationData.date_debut,
        date_fin: reparationData.date_fin || null,
        cout: parseFloat(reparationData.cout) || 0,
        technicien_responsable: technicienResponsable,
        description: reparationData.description || 'Réparation effectuée',
        incident: reparationData.incident || null
      };
      
      console.log('📝 Données formatées pour API:', formattedData);
      console.log('✅ Technicien dans données:', formattedData.technicien_responsable);
      
      let response;
      
      if (editingReparation) {
        response = await reparationsAPI.update(editingReparation.id, formattedData);
        showMessage('success', 'Réparation modifiée avec succès');
        
        // 🔥 AUTO-LOGGER: Modification de réparation
        autoLogger.logReparationUpdate(editingReparation.id, editingReparation, reparationData);
        
      } else {
        response = await reparationsAPI.create(formattedData);
        showMessage('success', 'Réparation créée avec succès');
        
        // 🔥 AUTO-LOGGER: Création de réparation
        autoLogger.logReparationCreate(reparationData);
      }
      
      // AJOUTER: Mise à jour de l'état du matériel
      if (formattedData.materiel) {
        const materielId = parseInt(formattedData.materiel);
        if (!isNaN(materielId)) {
          const nouvelEtat = getMaterielEtatFromReparation(
            formattedData.type_reparation,
            formattedData.date_fin
          );
          
          console.log(`🔄 Mise à jour état matériel #${materielId} -> ${nouvelEtat}`);
          
          try {
            await updateMaterielEtat(materielId, nouvelEtat, editingReparation?.id || undefined);
            showMessage('info', `État du matériel mis à jour: ${nouvelEtat}`);
          } catch (error: any) {
            console.error('⚠️ Erreur mise à jour matériel:', error);
            // Ne pas bloquer le processus pour cette erreur
            showMessage('warning', 'Réparation enregistrée, mais erreur sur mise à jour matériel');
          }
        }
      }
      
      await fetchReparations();
      setIsFormOpen(false);
      setEditingReparation(undefined);
      
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde réparation:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erreur lors de la sauvegarde de la réparation';
      showMessage('error', errorMessage);
      
      console.error('🔍 Détails de l\'erreur:', {
        user: getCurrentUserName(),
        dataSent: reparationData,
        error: error.response?.data
      });
    }
  };

  // CORRECTION: Gérer l'édition avec mise à jour du matériel
  const handleEdit = (reparation: Reparation) => {
    if (loadingRelations) {
      showMessage('info', 'Chargement des données en cours...');
      return;
    }

    const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
    if (!hasRelationsData) {
      showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
      return;
    }

    // 🔥 AUTO-LOGGER: Consultation d'une réparation (pour édition)
    autoLogger.logReparationView(reparation);
    
    setEditingReparation(reparation);
    setIsFormOpen(true);
  };

  // Gérer la suppression
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
      try {
        const reparation = reparations.find(r => r.id === id);
        await reparationsAPI.delete(id);
        
        // 🔥 AUTO-LOGGER: Suppression de réparation
        if (reparation) {
          autoLogger.logReparationDelete(id, reparation);
        }
        
        showMessage('success', 'Réparation supprimée avec succès');
        fetchReparations();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
        showMessage('error', errorMessage);
      }
    }
  };

  // CORRECTION: Gérer la fin de réparation avec mise à jour du matériel
  const handleTerminer = async (id: number) => {
    try {
      const currentUserName = getCurrentUserName();
      
      if (!currentUserName || currentUserName.trim() === '') {
        throw new Error('Nom du technicien non disponible');
      }
      
      // Trouver la réparation pour avoir l'ID du matériel
      const reparation = reparations.find(r => r.id === id);
      if (!reparation) {
        throw new Error('Réparation non trouvée');
      }
      
      console.log(`🔧 Fin de réparation #${id} pour matériel #${reparation.materiel}`);
      
      // 🔥 AUTO-LOGGER: Début de terminaison de réparation
      autoLogger.logAction('DÉMARRAGE TERMINAISON', 'Réparations', `Terminaison réparation #${id}`);
      
      // Mettre à jour la réparation
      await reparationsAPI.update(id, { 
        date_fin: new Date().toISOString(),
        technicien_responsable: currentUserName
      });
      
      // Mettre à jour l'état du matériel
      if (reparation.materiel) {
        const materielId = reparation.materiel;
        const nouvelEtat = getMaterielEtatFromReparation(reparation.type_reparation, new Date().toISOString());
        
        console.log(`🔄 Mise à jour matériel #${materielId} -> ${nouvelEtat} (réparation terminée)`);
        
        try {
          await updateMaterielEtat(materielId, nouvelEtat, id);
          
          // 🔥 AUTO-LOGGER: Réparation terminée avec succès
          autoLogger.logReparationCompletion(id, materielId, currentUserName, reparation.cout || 0);
          
          showMessage('success', `Réparation terminée et matériel marqué comme ${nouvelEtat}`);
        } catch (error: any) {
          console.error('⚠️ Erreur mise à jour matériel:', error);
          showMessage('warning', 'Réparation terminée, mais erreur sur mise à jour matériel');
        }
      } else {
        showMessage('success', 'Réparation marquée comme terminée');
        
        // 🔥 AUTO-LOGGER: Réparation terminée sans matériel
        autoLogger.logReparationComplete(id, reparation, undefined);
      }
      
      fetchReparations();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
      showMessage('error', errorMessage);
    }
  };

  // Gérer l'ajout d'une nouvelle réparation
  const handleAddNew = () => {
    if (loadingRelations) {
      showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
      return;
    }
    
    const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
    if (!hasRelationsData) {
      showMessage('warning', 'Aucune donnée de relation disponible.');
      return;
    }

    // 🔥 AUTO-LOGGER: Ouverture formulaire nouvelle réparation
    autoLogger.logAction('OUVERTURE FORMULAIRE', 'Réparations', 'Nouvelle réparation');
    
    setEditingReparation(undefined);
    setIsFormOpen(true);
  };

  // Fonctions de sélection
  const toggleSelectReparation = (id: number) => {
    setSelectedReparations(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedReparations([]);
    } else {
      const allIds = filteredReparations.map(r => r.id);
      setSelectedReparations(allIds);
    }
  };

  // Gérer la suppression multiple
  const handleDeleteSelected = async () => {
    if (selectedReparations.length === 0) {
      showMessage('error', 'Aucune réparation sélectionnée');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
      try {
        await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
        
        // 🔥 AUTO-LOGGER: Suppression multiple de réparations
        selectedReparations.forEach(id => {
          const reparation = reparations.find(r => r.id === id);
          if (reparation) {
            autoLogger.logReparationDelete(id, reparation);
          }
        });
        
        showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
        setSelectedReparations([]);
        fetchReparations();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
        showMessage('error', errorMessage);
      }
    }
  };

  // Gérer l'édition multiple
  const handleEditSelected = () => {
    if (selectedReparations.length === 0) {
      showMessage('error', 'Aucune réparation sélectionnée');
      return;
    }

    if (selectedReparations.length === 1) {
      const reparation = reparations.find(r => r.id === selectedReparations[0]);
      if (reparation) {
        handleEdit(reparation);
      }
    } else {
      showMessage('info', `Édition multiple de ${selectedReparations.length} réparations`);
      
      // 🔥 AUTO-LOGGER: Édition multiple
      autoLogger.logAction('ÉDITION MULTIPLE', 'Réparations', `Édition ${selectedReparations.length} réparations`);
      
      setEditingReparation(undefined);
      setIsFormOpen(true);
    }
  };

  // CORRECTION: Gérer la fin de réparation multiple avec mise à jour du matériel
  const handleTerminerSelected = async () => {
    if (selectedReparations.length === 0) {
      showMessage('error', 'Aucune réparation sélectionnée');
      return;
    }

    try {
      const currentUserName = getCurrentUserName();
      
      if (!currentUserName || currentUserName.trim() === '') {
        throw new Error('Nom du technicien non disponible');
      }
      
      // 🔥 AUTO-LOGGER: Début terminaison multiple
      autoLogger.logAction('DÉMARRAGE TERMINAISON', 'Réparations', `Terminaison ${selectedReparations.length} réparations`);
      
      // Traiter chaque réparation
      for (const id of selectedReparations) {
        const reparation = reparations.find(r => r.id === id);
        if (!reparation) continue;
        
        await reparationsAPI.update(id, { 
          date_fin: new Date().toISOString(),
          technicien_responsable: currentUserName
        });
        
        // Mettre à jour l'état du matériel
        if (reparation.materiel) {
          const materielId = reparation.materiel;
          const nouvelEtat = getMaterielEtatFromReparation(reparation.type_reparation, new Date().toISOString());
          
          try {
            await updateMaterielEtat(materielId, nouvelEtat, id);
            
            // 🔥 AUTO-LOGGER: Réparation terminée dans le batch
            autoLogger.logReparationCompletion(id, materielId, currentUserName, reparation.cout || 0);
          } catch (error: any) {
            console.error(`⚠️ Erreur mise à jour matériel #${materielId}:`, error);
          }
        } else {
          // 🔥 AUTO-LOGGER: Réparation terminée sans matériel
          autoLogger.logReparationComplete(id, reparation, undefined);
        }
      }
      
      showMessage('success', `${selectedReparations.length} réparation(s) terminée(s) et matériel(s) mis à jour`);
      setSelectedReparations([]);
      fetchReparations();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
      showMessage('error', errorMessage);
    }
  };

  // Exporter en CSV
  const handleExport = useCallback(() => {
    try {
      const dataToExport = filteredReparations.map(reparation => ({
        'Matériel': reparation.materiel_nom || 'Non spécifié',
        'Type': getTypeText(reparation.type_reparation),
        'Technicien': getTechnicienName(reparation) || 'Non assigné',
        'Date début': reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : 'Non spécifiée',
        'Date fin': reparation.date_fin ? new Date(reparation.date_fin).toLocaleDateString('fr-FR') : 'En cours',
        'Coût': reparation.cout ? `${reparation.cout.toLocaleString('fr-FR')} Ar` : '0 Ar',
        'Statut': getStatutText(reparation),
        'Description': reparation.description || 'Aucune description'
      }));

      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reparations_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showMessage('success', 'Export CSV réussi !');
      
      // 🔥 AUTO-LOGGER: Exportation de réparations
      autoLogger.logReparationExport('CSV', filteredReparations.length, {
        searchTerm: searchTerm,
        filterType: filterType,
        filterStatut: filterStatut
      });
      
    } catch (error) {
      console.error('❌ Erreur export CSV:', error);
      showMessage('error', 'Erreur lors de l\'export');
    }
  }, [filteredReparations, getTechnicienName, searchTerm, filterType, filterStatut, autoLogger]);

  // Fonctions d'affichage
  const getTypeBadge = (type: string) => {
    const badges = {
      preventive: 'badge-info',
      corrective: 'badge-warning',
      ameliorative: 'badge-success'
    };
    return badges[type as keyof typeof badges] || 'badge-neutral';
  };

  const getTypeText = (type: string) => {
    const texts = {
      preventive: 'Préventive',
      corrective: 'Corrective',
      ameliorative: 'Améliorative'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      preventive: <Wrench className="h-4 w-4" />,
      corrective: <Wrench className="h-4 w-4" />,
      ameliorative: <CheckCircle className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Wrench className="h-4 w-4" />;
  };

  const isEnCours = (reparation: Reparation) => {
    return !reparation.date_fin;
  };

  const getStatutBadge = (reparation: Reparation) => {
    return isEnCours(reparation) ? 'badge-warning' : 'badge-success';
  };

  const getStatutText = (reparation: Reparation) => {
    return isEnCours(reparation) ? 'En cours' : 'Terminée';
  };

  const getStatutIcon = (reparation: Reparation) => {
    return isEnCours(reparation) ? 
      <Calendar className="h-4 w-4" /> : 
      <CheckCircle className="h-4 w-4" />;
  };

  // Obtenir la classe CSS du message
  const getAlertClass = (type: MessageType) => {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return 'alert-info';
    }
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    // 🔥 AUTO-LOGGER: Réinitialisation des filtres
    autoLogger.logReparationFilter('réinitialisation', reparations.length);
    
    setSearchTerm('');
    setFilterType('');
    setFilterStatut('');
    setSelectedReparations([]);
    
    showMessage('info', 'Filtres réinitialisés');
  };

  // Rendre la section statistiques
  const renderStatistiquesSection = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {/* Carte Total */}
      <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{formatNumber(statistiques.total)}</h3>
              <p className="text-sm opacity-60">Total réparations</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span className="text-success">{statistiques.terminees} terminées</span>
            <span className="mx-2">•</span>
            <span className="text-warning">{statistiques.enCours} en cours</span>
          </div>
        </div>
      </div>

      {/* Carte Coût total */}
      <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutTotal)}</h3>
              <p className="text-sm opacity-60">Coût total</p>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span>Moyenne: {formatCurrency(statistiques.coutMoyen)}</span>
          </div>
        </div>
      </div>

      {/* Carte Coût ce mois */}
      <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{formatCurrency(statistiques.coutMois)}</h3>
              <p className="text-sm opacity-60">Coût ce mois</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span>{statistiques.reparationsParMois.find(m => m.mois.includes('mai'))?.count || 0} réparations</span>
          </div>
        </div>
      </div>

      {/* Carte Durée moyenne */}
      <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{statistiques.dureeMoyenne.toFixed(1)}</h3>
              <p className="text-sm opacity-60">Jours moyen</p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span>{statistiques.terminees} réparations terminées</span>
          </div>
        </div>
      </div>

      {/* Carte Taux de complétion */}
      <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">
                {statistiques.total > 0 
                  ? `${((statistiques.terminees / statistiques.total) * 100).toFixed(1)}%`
                  : '0%'
                }
              </h3>
              <p className="text-sm opacity-60">Taux de complétion</p>
            </div>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span>{statistiques.terminees} / {statistiques.total}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des réparations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Messages */}
      {message && (
        <div className={`alert ${getAlertClass(message.type)} mb-4`}>
          <span>{message.text}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">🔧 Gestion des Réparations</h1>
          <p className="text-base-content opacity-60 mt-1">
            {filteredReparations.length} réparation(s) trouvée(s)
            <span className="ml-2 text-success font-medium">
              • 👤 Connecté: {getCurrentUserName()}
            </span>
          </p>
          <p className="text-xs text-success opacity-70 mt-1">
            ⚡ L'état du matériel est automatiquement mis à jour après chaque réparation
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
            disabled={loadingRelations}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle réparation
          </button>
        </div>
      </div>

      {/* Section Statistiques détaillées */}
      {renderStatistiquesSection()}

      {/* Section Utilisateur actuel */}
      <div className="mb-6">
        <div className="card bg-success/10 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-success" />
                <div>
                  <h3 className="font-bold text-success">Utilisateur Connecté</h3>
                  <p className="text-sm">
                    Vous êtes connecté en tant que: <span className="font-bold">{getCurrentUserName()}</span>
                  </p>
                  <p className="text-xs text-success opacity-70 mt-1">
                    ⚡ L'état du matériel est automatiquement mis à jour selon le type de réparation
                  </p>
                </div>
              </div>
              <div className="badge badge-success badge-lg">
                Connecté
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section État des matériels */}
      <div className="mb-6">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4">
            <h3 className="font-bold text-base-content mb-3">📊 État des matériels après réparation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Corrective terminée</span>
                  <span className="badge badge-success badge-sm">✅</span>
                </div>
                <div className="text-xs opacity-70 mt-1">Matériel → <strong>Réparé</strong></div>
              </div>
              <div className="bg-base-100 p-3 rounded-lg border-l-4 border-success">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Préventive terminée</span>
                  <span className="badge badge-success badge-sm">✅</span>
                </div>
                <div className="text-xs opacity-70 mt-1">Matériel → <strong>Fonctionnel</strong></div>
              </div>
              <div className="bg-base-100 p-3 rounded-lg border-l-4 border-warning">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Corrective en cours</span>
                  <span className="badge badge-warning badge-sm">🔧</span>
                </div>
                <div className="text-xs opacity-70 mt-1">Matériel → <strong>En panne</strong></div>
              </div>
              <div className="bg-base-100 p-3 rounded-lg border-l-4 border-info">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Préventive en cours</span>
                  <span className="badge badge-info badge-sm">🛠️</span>
                </div>
                <div className="text-xs opacity-70 mt-1">Matériel → <strong>En maintenance</strong></div>
              </div>
            </div>
            <div className="text-xs opacity-60 mt-3">
              ⚡ Ces mises à jour sont automatiques après chaque réparation. L'état du matériel est synchronisé en temps réel.
            </div>
          </div>
        </div>
      </div>

      {/* Section Top Techniciens */}
      {statistiques.topTechniciens.length > 0 && (
        <div className="mb-6">
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-bold text-base-content mb-3">🏆 Top Techniciens</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {statistiques.topTechniciens.map((tech, index) => (
                  <div key={index} className="bg-base-100 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm truncate">{tech.technicien}</span>
                      <span className="badge badge-primary badge-sm">{tech.count}</span>
                    </div>
                    <div className="text-xs opacity-70">
                      Coût: {formatCurrency(tech.cout)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">🔍 Rechercher</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  placeholder="Matériel, technicien..."
                  className="input input-bordered w-full pl-10 bg-base-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">🛠️ Type</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tous les types</option>
                <option value="preventive">Préventive</option>
                <option value="corrective">Corrective</option>
                <option value="ameliorative">Améliorative</option>
              </select>
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
                <option value="en_cours">En cours</option>
                <option value="terminee">Terminée</option>
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
          {selectedReparations.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-semibold text-primary text-lg">
                      {selectedReparations.length} réparation(s) sélectionnée(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTerminerSelected}
                    className="btn btn-success btn-sm gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Terminer ({selectedReparations.length})
                  </button>
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier ({selectedReparations.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-outline btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer ({selectedReparations.length})
                  </button>
                  <button
                    onClick={() => setSelectedReparations([])}
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

      {/* Tableau des réparations */}
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
                        title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
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
                  <th className="font-bold">Type</th>
                  <th className="font-bold">Technicien</th>
                  <th className="font-bold">Date début</th>
                  <th className="font-bold">Date fin</th>
                  <th className="font-bold">Coût</th>
                  <th className="font-bold">Statut</th>
                  <th className="font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredReparations).map((reparation) => {
                  const technicien = getTechnicienName(reparation);
                  const isCurrentUser = technicien === getCurrentUserName();
                  
                  return (
                    <tr key={reparation.id} className="hover">
                      <td className="text-center">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
                            checked={selectedReparations.includes(reparation.id)}
                            onChange={() => toggleSelectReparation(reparation.id)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">
                          {reparation.materiel_nom}
                        </div>
                      </td>
                      <td>
                        <div className={`badge ${getTypeBadge(reparation.type_reparation)} badge-lg gap-1`}>
                          {getTypeIcon(reparation.type_reparation)}
                          {getTypeText(reparation.type_reparation)}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {technicien ? (
                            <div className={`flex items-center gap-1 ${isCurrentUser ? 'text-success font-medium' : ''}`}>
                              <span className={isCurrentUser ? 'text-success' : ''}>👨‍🔧</span>
                              <span>{technicien}</span>
                              {isCurrentUser && (
                                <span className="badge badge-success badge-xs ml-1">VOUS</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-base-content opacity-50">Non assigné</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm">
                          {reparation.date_debut ? new Date(reparation.date_debut).toLocaleDateString('fr-FR') : '-'}
                        </span>
                      </td>
                      <td>
                        {reparation.date_fin ? (
                          <span className="text-sm">
                            {new Date(reparation.date_fin).toLocaleDateString('fr-FR')}
                          </span>
                        ) : (
                          <div className="badge badge-warning badge-sm">En cours</div>
                        )}
                      </td>
                      <td>
                        {reparation.cout ? (
                          <span className="font-semibold text-green-600 text-sm">
                            {reparation.cout.toLocaleString('fr-FR')} Ar
                          </span>
                        ) : (
                          <span className="text-base-content opacity-50 text-sm">0 Ar</span>
                        )}
                      </td>
                      <td>
                        <div className={`badge ${getStatutBadge(reparation)} badge-lg gap-1`}>
                          {getStatutIcon(reparation)}
                          {getStatutText(reparation)}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() => handleEdit(reparation)}
                            className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {isEnCours(reparation) && (
                            <button
                              onClick={() => handleTerminer(reparation.id)}
                              className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
                              title="Terminer la réparation"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(reparation.id)}
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

          {safeArray(filteredReparations).length === 0 && (
            <div className="text-center py-12">
              <div className="text-base-content opacity-40 mb-4">
                <Wrench className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Aucune réparation trouvée</p>
                <p className="text-sm mt-2">
                  {searchTerm || filterType || filterStatut
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucune réparation n'est enregistrée dans le système"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire de réparation */}
      <ReparationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingReparation(undefined);
        }}
        onSubmit={handleSubmit}
        reparation={editingReparation}
        materiels={materiels}
        incidents={incidents}
        userName={getCurrentUserName()}
      />
    </div>
  );
};

export default Reparations;