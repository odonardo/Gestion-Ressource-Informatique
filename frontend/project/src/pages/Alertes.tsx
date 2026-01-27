


// // // import React, { useState, useEffect } from 'react';
// // // import { Plus, Search, Eye, Filter, Download, Edit, Trash2, Bell, AlertTriangle, Info, CheckCircle, CheckSquare, Square, X, BarChart3 } from 'lucide-react';
// // // import { Alerte } from '../types';
// // // import AlerteForm from '../components/AlerteForm';
// // // import { 
// // //   alertesAPI, 
// // //   materielsAPI, 
// // //   // logicielsAPI, 
// // //   // reseauAPI, 
// // //   incidentsAPI 
// // // } from '../services/api';

// // // // Fonctions helper pour la sécurité des tableaux
// // // const safeArray = (data: any): Alerte[] => {
// // //   return Array.isArray(data) ? data : [];
// // // };

// // // const safeFilter = (array: any[], condition: (item: any) => boolean): Alerte[] => {
// // //   if (!Array.isArray(array)) return [];
// // //   return array.filter(condition);
// // // };

// // // const extractDataFromResponse = (response: any): Alerte[] => {
// // //   if (!response || !response.data) {
// // //     console.log('❌ Réponse vide ou sans data:', response);
// // //     return [];
// // //   }
  
// // //   if (Array.isArray(response.data)) {
// // //     return response.data;
// // //   }
  
// // //   if (response.data.results && Array.isArray(response.data.results)) {
// // //     return response.data.results;
// // //   }
  
// // //   if (response.data.data && Array.isArray(response.data.data)) {
// // //     return response.data.data;
// // //   }
  
// // //   if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // //     return [response.data];
// // //   }
  
// // //   console.warn('⚠️ Format de réponse non reconnu:', response.data);
// // //   return [];
// // // };

// // // // CORRECTION : Définir le type pour les messages
// // // type MessageType = 'success' | 'error' | 'info' | 'warning';

// // // const Alertes: React.FC = () => {
// // //   const [alertes, setAlertes] = useState<Alerte[]>([]);
// // //   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
// // //   const [loading, setLoading] = useState<boolean>(true);
// // //   const [error, setError] = useState<string>('');
// // //   const [searchTerm, setSearchTerm] = useState<string>('');
// // //   const [filterSeverite, setFilterSeverite] = useState<string>('');
// // //   const [filterStatut, setFilterStatut] = useState<string>('');
// // //   const [filterType, setFilterType] = useState<string>('');
// // //   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
// // //   const [isFormOpen, setIsFormOpen] = useState(false);
// // //   const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
// // //   const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
// // //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

// // //   // ÉTAT POUR LES DONNÉES DE RELATIONS
// // //   const [materiels, setMateriels] = useState<any[]>([]);
// // //   const [logiciels, setLogiciels] = useState<any[]>([]);
// // //   const [reseaux, setReseaux] = useState<any[]>([]);
// // //   const [incidents, setIncidents] = useState<any[]>([]);
// // //   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

// // //   // AJOUT : Statistiques
// // //   const [statistiques, setStatistiques] = useState({
// // //     total: 0,
// // //     nouvelles: 0,
// // //     enTraitement: 0,
// // //     resolues: 0,
// // //     critiques: 0,
// // //     elevees: 0,
// // //     moyennes: 0,
// // //     basses: 0
// // //   });

// // //   // Charger les alertes
// // //   const fetchAlertes = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError('');
// // //       console.log('🔄 Chargement des alertes...');
      
// // //       const response = await alertesAPI.getAll();
// // //       console.log('✅ Réponse alertes:', response);
      
// // //       const extractedData = extractDataFromResponse(response);
// // //       console.log('🚨 Alertes chargées:', extractedData);
// // //       setAlertes(extractedData);
      
// // //       // Calculer les statistiques
// // //       calculerStatistiques(extractedData);
// // //     } catch (err: any) {
// // //       console.error('❌ Erreur chargement alertes:', err);
// // //       const errorMessage = err.response?.data?.message || 
// // //                           err.message || 
// // //                           'Erreur lors du chargement des alertes';
// // //       setError(errorMessage);
// // //       showMessage('error', errorMessage);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // AJOUT : Fonction pour calculer les statistiques
// // //   const calculerStatistiques = (data: Alerte[]) => {
// // //     const stats = {
// // //       total: data.length,
// // //       nouvelles: data.filter(a => a.statut === 'nouvelle').length,
// // //       enTraitement: data.filter(a => a.statut === 'en_traitement').length,
// // //       resolues: data.filter(a => a.statut === 'resolue').length,
// // //       critiques: data.filter(a => a.severite === 'critique').length,
// // //       elevees: data.filter(a => a.severite === 'elevee').length,
// // //       moyennes: data.filter(a => a.severite === 'moyenne').length,
// // //       basses: data.filter(a => a.severite === 'basse').length
// // //     };
// // //     setStatistiques(stats);
// // //   };

// // //   // CORRECTION AMÉLIORÉE : CHARGER LES DONNÉES DE RELATIONS
// // //   const fetchRelationsData = async () => {
// // //     try {
// // //       setLoadingRelations(true);
// // //       console.log('🔄 Chargement des données de relations...');

// // //       // Utiliser Promise.allSettled pour gérer les erreurs individuelles
// // //       const [materielsResponse, logicielsResponse, reseauxResponse, incidentsResponse] = await Promise.allSettled([
// // //         materielsAPI.getAll().catch(err => ({ data: [] })),
// // //         logicielsAPI.getAll().catch(err => ({ data: [] })),
// // //         reseauAPI.getAll().catch(err => ({ data: [] })),
// // //         incidentsAPI.getAll().catch(err => ({ data: [] }))
// // //       ]);

// // //       // Extraire les données avec gestion d'erreur
// // //       const materielsData = materielsResponse.status === 'fulfilled' 
// // //         ? extractDataFromResponse(materielsResponse.value) 
// // //         : [];
      
// // //       const logicielsData = logicielsResponse.status === 'fulfilled' 
// // //         ? extractDataFromResponse(logicielsResponse.value) 
// // //         : [];
      
// // //       const reseauxData = reseauxResponse.status === 'fulfilled' 
// // //         ? extractDataFromResponse(reseauxResponse.value) 
// // //         : [];
      
// // //       const incidentsData = incidentsResponse.status === 'fulfilled' 
// // //         ? extractDataFromResponse(incidentsResponse.value) 
// // //         : [];

// // //       console.log('✅ Données de relations chargées:', {
// // //         materiels: materielsData.length,
// // //         logiciels: logicielsData.length,
// // //         reseaux: reseauxData.length,
// // //         incidents: incidentsData.length
// // //       });

// // //       setMateriels(materielsData);
// // //       setLogiciels(logicielsData);
// // //       setReseaux(reseauxData);
// // //       setIncidents(incidentsData);

// // //       // Afficher un message si certaines données sont vides
// // //       const totalData = materielsData.length + logicielsData.length + reseauxData.length + incidentsData.length;
// // //       if (totalData === 0) {
// // //         showMessage('warning', 'Aucune donnée de relation disponible. Vérifiez votre connexion.');
// // //       }

// // //     } catch (err: any) {
// // //       console.error('❌ Erreur chargement relations:', err);
// // //       const errorMessage = err.response?.data?.message || 
// // //                           err.message || 
// // //                           'Erreur lors du chargement des données';
// // //       showMessage('error', errorMessage);
      
// // //       // Initialiser avec des tableaux vides
// // //       setMateriels([]);
// // //       setLogiciels([]);
// // //       setReseaux([]);
// // //       setIncidents([]);
// // //     } finally {
// // //       setLoadingRelations(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchAlertes();
// // //     fetchRelationsData(); // Charger les données de relations au montage
// // //   }, []);

// // //   useEffect(() => {
// // //     filterAlertes();
// // //   }, [alertes, searchTerm, filterSeverite, filterStatut, filterType]);

// // //   useEffect(() => {
// // //     if (filteredAlertes.length > 0 && selectedAlertes.length === filteredAlertes.length) {
// // //       setIsSelectAll(true);
// // //     } else {
// // //       setIsSelectAll(false);
// // //     }
// // //   }, [selectedAlertes, filteredAlertes]);

// // //   const filterAlertes = () => {
// // //     let filtered = safeArray(alertes);

// // //     if (searchTerm) {
// // //       filtered = safeFilter(filtered, a => 
// // //         a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
// // //         (a.logiciel_nom && a.logiciel_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
// // //         (a.reseau_nom && a.reseau_nom.toLowerCase().includes(searchTerm.toLowerCase()))
// // //       );
// // //     }

// // //     if (filterSeverite) {
// // //       filtered = safeFilter(filtered, a => a.severite === filterSeverite);
// // //     }

// // //     if (filterStatut) {
// // //       filtered = safeFilter(filtered, a => a.statut === filterStatut);
// // //     }

// // //     if (filterType) {
// // //       filtered = safeFilter(filtered, a => a.type_alerte === filterType);
// // //     }

// // //     setFilteredAlertes(filtered);
// // //     setSelectedAlertes([]);
// // //   };

// // //   // CORRECTION : Fonction showMessage avec le type MessageType
// // //   const showMessage = (type: MessageType, text: string) => {
// // //     setMessage({ type, text });
// // //     setTimeout(() => setMessage(null), 5000);
// // //   };

// // //   const handleSubmit = async (alerteData: any) => {
// // //     try {
// // //       console.log('📤 Soumission des données alerte:', alerteData);
      
// // //       if (editingAlerte) {
// // //         await alertesAPI.update(editingAlerte.id, alerteData);
// // //         showMessage('success', 'Alerte modifiée avec succès');
// // //       } else {
// // //         await alertesAPI.create(alerteData);
// // //         showMessage('success', 'Alerte créée avec succès');
// // //       }
      
// // //       // Recharger les données
// // //       await fetchAlertes();
// // //       setIsFormOpen(false);
// // //       setEditingAlerte(undefined);
// // //     } catch (error: any) {
// // //       console.error('❌ Erreur sauvegarde alerte:', error);
// // //       const errorMessage = error.response?.data?.message || 
// // //                           error.message || 
// // //                           'Erreur lors de la sauvegarde';
// // //       showMessage('error', errorMessage);
// // //     }
// // //   };

// // //   // CORRECTION : Fonctions handleAddNew et handleEdit améliorées
// // //   const handleAddNew = () => {
// // //     // Vérifier que les données de relations sont chargées
// // //     if (loadingRelations) {
// // //       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
// // //       return;
// // //     }
    
// // //     // CORRECTION : Vérifier si au moins une des sources est disponible
// // //     const hasRelationsData = materiels.length > 0 || logiciels.length > 0 || reseaux.length > 0 || incidents.length > 0;
    
// // //     if (!hasRelationsData) {
// // //       showMessage('warning', 
// // //         `Aucune donnée de relation disponible. 
// // //         Matériels: ${materiels.length} | 
// // //         Logiciels: ${logiciels.length} | 
// // //         Réseaux: ${reseaux.length} | 
// // //         Incidents: ${incidents.length}`
// // //       );
      
// // //       // Proposer de recharger
// // //       if (confirm('Voulez-vous recharger les données ?')) {
// // //         fetchRelationsData();
// // //       }
      
// // //       return;
// // //     }

// // //     console.log('✅ Données disponibles pour nouvelle alerte:', {
// // //       materiels: materiels.length,
// // //       logiciels: logiciels.length,
// // //       reseaux: reseaux.length,
// // //       incidents: incidents.length
// // //     });

// // //     setEditingAlerte(undefined);
// // //     setIsFormOpen(true);
// // //   };

// // //   const handleEdit = (alerte: Alerte) => {
// // //     if (loadingRelations) {
// // //       showMessage('info', 'Chargement des données en cours...');
// // //       return;
// // //     }

// // //     // CORRECTION : Même vérification pour l'édition
// // //     const hasRelationsData = materiels.length > 0 || logiciels.length > 0 || reseaux.length > 0 || incidents.length > 0;
    
// // //     if (!hasRelationsData) {
// // //       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
// // //       return;
// // //     }

// // //     setEditingAlerte(alerte);
// // //     setIsFormOpen(true);
// // //   };

// // //   // Fonctions de sélection
// // //   const toggleSelectAlerte = (id: number) => {
// // //     setSelectedAlertes(prev => 
// // //       prev.includes(id) 
// // //         ? prev.filter(item => item !== id)
// // //         : [...prev, id]
// // //     );
// // //   };

// // //   const toggleSelectAll = () => {
// // //     if (isSelectAll) {
// // //       setSelectedAlertes([]);
// // //     } else {
// // //       const allIds = filteredAlertes.map(a => a.id);
// // //       setSelectedAlertes(allIds);
// // //     }
// // //   };

// // //   const handleDeleteSelected = async () => {
// // //     if (selectedAlertes.length === 0) {
// // //       showMessage('error', 'Aucune alerte sélectionnée');
// // //       return;
// // //     }

// // //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ?`)) {
// // //       try {
// // //         for (const id of selectedAlertes) {
// // //           await alertesAPI.delete(id);
// // //         }
        
// // //         showMessage('success', `${selectedAlertes.length} alerte(s) supprimée(s) avec succès`);
// // //         setSelectedAlertes([]);
// // //         fetchAlertes();
// // //       } catch (error: any) {
// // //         showMessage('error', 'Erreur lors de la suppression des alertes');
// // //       }
// // //     }
// // //   };

// // //   const handleEditSelected = () => {
// // //     if (selectedAlertes.length === 0) {
// // //       showMessage('error', 'Aucune alerte sélectionnée');
// // //       return;
// // //     }

// // //     if (selectedAlertes.length === 1) {
// // //       const alerte = alertes.find(a => a.id === selectedAlertes[0]);
// // //       if (alerte) {
// // //         handleEdit(alerte);
// // //       }
// // //     } else {
// // //       showMessage('info', `Édition multiple de ${selectedAlertes.length} alertes`);
// // //     }
// // //   };

// // //   // CORRECTION : Garder les fonctions Traiter et Résoudre pour les sélections
// // //   const handleTraiterSelected = async () => {
// // //     if (selectedAlertes.length === 0) {
// // //       showMessage('error', 'Aucune alerte sélectionnée');
// // //       return;
// // //     }

// // //     try {
// // //       for (const id of selectedAlertes) {
// // //         await alertesAPI.traiter(id);
// // //       }
      
// // //       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme traitées`);
// // //       setSelectedAlertes([]);
// // //       fetchAlertes();
// // //     } catch (error: any) {
// // //       showMessage('error', 'Erreur lors du traitement des alertes');
// // //     }
// // //   };

// // //   const handleResoudreSelected = async () => {
// // //     if (selectedAlertes.length === 0) {
// // //       showMessage('error', 'Aucune alerte sélectionnée');
// // //       return;
// // //     }

// // //     try {
// // //       for (const id of selectedAlertes) {
// // //         await alertesAPI.update(id, { statut: 'resolue' });
// // //       }
      
// // //       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme résolues`);
// // //       setSelectedAlertes([]);
// // //       fetchAlertes();
// // //     } catch (error: any) {
// // //       showMessage('error', 'Erreur lors de la résolution des alertes');
// // //     }
// // //   };

// // //   const handleDelete = async (id: number) => {
// // //     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
// // //       try {
// // //         await alertesAPI.delete(id);
// // //         showMessage('success', 'Alerte supprimée avec succès');
// // //         fetchAlertes();
// // //       } catch (error: any) {
// // //         showMessage('error', 'Erreur lors de la suppression');
// // //       }
// // //     }
// // //   };

// // //   const handleTraiter = async (id: number) => {
// // //     try {
// // //       await alertesAPI.traiter(id);
// // //       showMessage('success', 'Alerte marquée comme traitée');
// // //       fetchAlertes();
// // //     } catch (error: any) {
// // //       showMessage('error', 'Erreur lors du traitement');
// // //     }
// // //   };

// // //   const handleResoudre = async (id: number) => {
// // //     try {
// // //       await alertesAPI.update(id, { statut: 'resolue' });
// // //       showMessage('success', 'Alerte marquée comme résolue');
// // //       fetchAlertes();
// // //     } catch (error: any) {
// // //       showMessage('error', 'Erreur lors de la résolution');
// // //     }
// // //   };

// // //   // Fonctions d'affichage
// // //   const getSeveriteBadge = (severite: string) => {
// // //     const badges = {
// // //       critique: 'badge-error',
// // //       elevee: 'badge-warning',
// // //       moyenne: 'badge-info',
// // //       basse: 'badge-neutral'
// // //     };
// // //     return badges[severite as keyof typeof badges] || 'badge-neutral';
// // //   };

// // //   const getSeveriteText = (severite: string) => {
// // //     const texts = {
// // //       critique: 'Critique',
// // //       elevee: 'Élevée',
// // //       moyenne: 'Moyenne',
// // //       basse: 'Basse'
// // //     };
// // //     return texts[severite as keyof typeof texts] || severite;
// // //   };

// // //   const getSeveriteIcon = (severite: string) => {
// // //     const icons = {
// // //       critique: <AlertTriangle className="h-4 w-4" />,
// // //       elevee: <AlertTriangle className="h-4 w-4" />,
// // //       moyenne: <Bell className="h-4 w-4" />,
// // //       basse: <Info className="h-4 w-4" />
// // //     };
// // //     return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
// // //   };

// // //   const getStatutBadge = (statut: string) => {
// // //     const badges = {
// // //       nouvelle: 'badge-error',
// // //       en_traitement: 'badge-warning',
// // //       resolue: 'badge-success'
// // //     };
// // //     return badges[statut as keyof typeof badges] || 'badge-neutral';
// // //   };

// // //   const getStatutText = (statut: string) => {
// // //     const texts = {
// // //       nouvelle: 'Nouvelle',
// // //       en_traitement: 'En traitement',
// // //       resolue: 'Résolue'
// // //     };
// // //     return texts[statut as keyof typeof texts] || statut;
// // //   };

// // //   const getTypeText = (type: string) => {
// // //     const texts = {
// // //       securite: 'Sécurité',
// // //       performance: 'Performance',
// // //       panne: 'Panne',
// // //       maintenance: 'Maintenance'
// // //     };
// // //     return texts[type as keyof typeof texts] || type;
// // //   };

// // //   const resetFilters = () => {
// // //     setSearchTerm('');
// // //     setFilterSeverite('');
// // //     setFilterStatut('');
// // //     setFilterType('');
// // //     setSelectedAlertes([]);
// // //   };

// // //   const handleExport = () => {
// // //     try {
// // //       const dataToExport = filteredAlertes.map(a => ({
// // //         Type: getTypeText(a.type_alerte),
// // //         Sévérité: getSeveriteText(a.severite),
// // //         Statut: getStatutText(a.statut),
// // //         Description: a.description,
// // //         'Matériel source': a.materiel_nom || 'Non spécifié',
// // //         'Logiciel source': a.logiciel_nom || 'Non spécifié',
// // //         'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée'
// // //       }));

// // //       const csvContent = [
// // //         Object.keys(dataToExport[0] || {}).join(','),
// // //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// // //       ].join('\n');

// // //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// // //       const link = document.createElement('a');
// // //       const url = URL.createObjectURL(blob);
// // //       link.setAttribute('href', url);
// // //       link.setAttribute('download', `alertes_${new Date().toISOString().split('T')[0]}.csv`);
// // //       link.style.visibility = 'hidden';
// // //       document.body.appendChild(link);
// // //       link.click();
// // //       document.body.removeChild(link);

// // //       showMessage('success', 'Export CSV réussi !');
// // //     } catch (error) {
// // //       showMessage('error', 'Erreur lors de l\'export');
// // //     }
// // //   };

// // //   // Fonction pour obtenir la classe CSS du message
// // //   const getAlertClass = (type: MessageType) => {
// // //     switch (type) {
// // //       case 'success': return 'alert-success';
// // //       case 'error': return 'alert-error';
// // //       case 'warning': return 'alert-warning';
// // //       case 'info': return 'alert-info';
// // //       default: return 'alert-info';
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// // //         <div className="flex flex-col items-center gap-4">
// // //           <span className="loading loading-spinner loading-lg text-primary"></span>
// // //           <p className="text-base-content">Chargement des alertes...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-6 bg-base-100 min-h-screen">
// // //       {/* Messages */}
// // //       {message && (
// // //         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
// // //           <span>{message.text}</span>
// // //         </div>
// // //       )}

// // //       {error && (
// // //         <div className="alert alert-error mb-4">
// // //           <span>{error}</span>
// // //           <button className="btn btn-ghost btn-sm" onClick={fetchAlertes}>
// // //             Réessayer
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* CORRECTION : Messages d'information sur les données de relations */}
// // //       {loadingRelations && (
// // //         <div className="alert alert-info mb-4">
// // //           <div className="flex items-center gap-2">
// // //             <span className="loading loading-spinner loading-sm"></span>
// // //             <span>Chargement des données de relations en cours...</span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* CORRECTION : Avertissement si pas de données de relations */}
// // //       {!loadingRelations && materiels.length === 0 && logiciels.length === 0 && reseaux.length === 0 && (
// // //         <div className="alert alert-warning mb-4">
// // //           <div className="flex items-center justify-between">
// // //             <div>
// // //               <span>⚠️ Aucune donnée de relation disponible. </span>
// // //               <button 
// // //                 onClick={fetchRelationsData}
// // //                 className="btn btn-sm btn-outline ml-2"
// // //               >
// // //                 Recharger
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* En-tête */}
// // //       <div className="flex justify-between items-center mb-6">
// // //         <div>
// // //           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Alertes</h1>
// // //           <p className="text-base-content opacity-60 mt-1">
// // //             {filteredAlertes.length} alerte(s) trouvée(s)
// // //             {loadingRelations && ' - Chargement des données...'}
// // //             {/* CORRECTION : Afficher le statut des données de relations */}
// // //             {!loadingRelations && (
// // //               <span className="text-sm ml-2">
// // //                 (📦 {materiels.length} mat. | 💾 {logiciels.length} log. | 🌐 {reseaux.length} rés. | ⚠️ {incidents.length} inc.)
// // //               </span>
// // //             )}
// // //           </p>
// // //         </div>
// // //         <div className="flex gap-2">
// // //           {/* SUPPRESSION : Bouton Actualiser retiré */}
// // //           <button
// // //             onClick={handleExport}
// // //             className="btn btn-outline btn-sm"
// // //             title="Exporter la liste"
// // //           >
// // //             <Download className="h-4 w-4 mr-2" />
// // //             Exporter
// // //           </button>
// // //           <button
// // //             onClick={handleAddNew}
// // //             className="btn btn-primary btn-sm"
// // //             disabled={loadingRelations}
// // //           >
// // //             <Plus className="h-4 w-4 mr-2" />
// // //             Nouvelle alerte
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* AJOUT : Section Statistiques */}
// // //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
// // //         {/* Carte Total */}
// // //         <div className="card bg-base-200 shadow-sm">
// // //           <div className="card-body p-4 text-center">
// // //             <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
// // //             <h3 className="text-lg font-bold">{statistiques.total}</h3>
// // //             <p className="text-sm opacity-60">Total</p>
// // //           </div>
// // //         </div>

// // //         {/* Carte Nouvelles */}
// // //         <div className="card bg-error/10 shadow-sm">
// // //           <div className="card-body p-4 text-center">
// // //             <Bell className="h-6 w-6 text-error mx-auto mb-2" />
// // //             <h3 className="text-lg font-bold text-error">{statistiques.nouvelles}</h3>
// // //             <p className="text-sm opacity-60">Nouvelles</p>
// // //           </div>
// // //         </div>

// // //         {/* Carte En traitement */}
// // //         <div className="card bg-warning/10 shadow-sm">
// // //           <div className="card-body p-4 text-center">
// // //             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
// // //             <h3 className="text-lg font-bold text-warning">{statistiques.enTraitement}</h3>
// // //             <p className="text-sm opacity-60">En traitement</p>
// // //           </div>
// // //         </div>

// // //         {/* Carte Résolues */}
// // //         <div className="card bg-success/10 shadow-sm">
// // //           <div className="card-body p-4 text-center">
// // //             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
// // //             <h3 className="text-lg font-bold text-success">{statistiques.resolues}</h3>
// // //             <p className="text-sm opacity-60">Résolues</p>
// // //           </div>
// // //         </div>

// // //         {/* Carte Critiques */}
// // //         <div className="card bg-error/10 shadow-sm">
// // //           <div className="card-body p-4 text-center">
// // //             <AlertTriangle className="h-6 w-6 text-error mx-auto mb-2" />
// // //             <h3 className="text-lg font-bold text-error">{statistiques.critiques}</h3>
// // //             <p className="text-sm opacity-60">Critiques</p>
// // //           </div>
// // //         </div>

// // //         {/* Carte Élevées */}
// // //         <div className="card bg-warning/10 shadow-sm">
// // //           <div className="card-body p-4 text-center">
// // //             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
// // //             <h3 className="text-lg font-bold text-warning">{statistiques.elevees}</h3>
// // //             <p className="text-sm opacity-60">Élevées</p>
// // //           </div>
// // //         </div>

// // //         {/* Carte Moyennes */}
// // //         <div className="card bg-info/10 shadow-sm">
// // //           <div className="card-body p-4 text-center">
// // //             <Bell className="h-6 w-6 text-info mx-auto mb-2" />
// // //             <h3 className="text-lg font-bold text-info">{statistiques.moyennes}</h3>
// // //             <p className="text-sm opacity-60">Moyennes</p>
// // //           </div>
// // //         </div>

// // //         {/* Carte Basses */}
// // //         <div className="card bg-success/10 shadow-sm">
// // //           <div className="card-body p-4 text-center">
// // //             <Info className="h-6 w-6 text-success mx-auto mb-2" />
// // //             <h3 className="text-lg font-bold text-success">{statistiques.basses}</h3>
// // //             <p className="text-sm opacity-60">Basses</p>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Filtres et recherche */}
// // //       <div className="card bg-base-200 shadow-xl mb-6">
// // //         <div className="card-body">
// // //           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">🔍 Rechercher</span>
// // //               </label>
// // //               <div className="relative">
// // //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // //                 <input
// // //                   type="text"
// // //                   placeholder="Description, matériel, logiciel..."
// // //                   className="input input-bordered w-full pl-10 bg-base-100"
// // //                   value={searchTerm}
// // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">📊 Sévérité</span>
// // //               </label>
// // //               <select
// // //                 className="select select-bordered w-full bg-base-100"
// // //                 value={filterSeverite}
// // //                 onChange={(e) => setFilterSeverite(e.target.value)}
// // //               >
// // //                 <option value="">Toutes les sévérités</option>
// // //                 <option value="critique">Critique</option>
// // //                 <option value="elevee">Élevée</option>
// // //                 <option value="moyenne">Moyenne</option>
// // //                 <option value="basse">Basse</option>
// // //               </select>
// // //             </div>

// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">📈 Statut</span>
// // //               </label>
// // //               <select
// // //                 className="select select-bordered w-full bg-base-100"
// // //                 value={filterStatut}
// // //                 onChange={(e) => setFilterStatut(e.target.value)}
// // //               >
// // //                 <option value="">Tous les statuts</option>
// // //                 <option value="nouvelle">Nouvelle</option>
// // //                 <option value="en_traitement">En traitement</option>
// // //                 <option value="resolue">Résolue</option>
// // //               </select>
// // //             </div>

// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">🔧 Type</span>
// // //               </label>
// // //               <select
// // //                 className="select select-bordered w-full bg-base-100"
// // //                 value={filterType}
// // //                 onChange={(e) => setFilterType(e.target.value)}
// // //               >
// // //                 <option value="">Tous les types</option>
// // //                 <option value="securite">Sécurité</option>
// // //                 <option value="performance">Performance</option>
// // //                 <option value="panne">Panne</option>
// // //                 <option value="maintenance">Maintenance</option>
// // //               </select>
// // //             </div>

// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">🔄 Actions</span>
// // //               </label>
// // //               <button
// // //                 onClick={resetFilters}
// // //                 className="btn btn-outline w-full gap-2"
// // //               >
// // //                 <Filter className="h-4 w-4" />
// // //                 Réinitialiser
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Actions de sélection - CORRECTION : Garder toutes les actions */}
// // //           {selectedAlertes.length > 0 && (
// // //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// // //               <div className="flex items-center justify-between">
// // //                 <div className="flex items-center gap-4">
// // //                   <div className="flex items-center gap-2">
// // //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// // //                     <span className="font-semibold text-primary text-lg">
// // //                       {selectedAlertes.length} alerte(s) sélectionnée(s)
// // //                     </span>
// // //                   </div>
// // //                 </div>
// // //                 <div className="flex gap-2">
// // //                   {/* CORRECTION : Garder Traiter et Résoudre */}
// // //                   <button
// // //                     onClick={handleTraiterSelected}
// // //                     className="btn btn-warning btn-sm gap-2"
// // //                   >
// // //                     <Bell className="h-4 w-4" />
// // //                     Traiter ({selectedAlertes.length})
// // //                   </button>
// // //                   <button
// // //                     onClick={handleResoudreSelected}
// // //                     className="btn btn-success btn-sm gap-2"
// // //                   >
// // //                     <CheckCircle className="h-4 w-4" />
// // //                     Résoudre ({selectedAlertes.length})
// // //                   </button>
// // //                   <button
// // //                     onClick={handleEditSelected}
// // //                     className="btn btn-primary btn-sm gap-2"
// // //                   >
// // //                     <Edit className="h-4 w-4" />
// // //                     Modifier ({selectedAlertes.length})
// // //                   </button>
// // //                   <button
// // //                     onClick={handleDeleteSelected}
// // //                     className="btn btn-outline btn-error btn-sm gap-2"
// // //                   >
// // //                     <Trash2 className="h-4 w-4" />
// // //                     Supprimer ({selectedAlertes.length})
// // //                   </button>
// // //                   <button
// // //                     onClick={() => setSelectedAlertes([])}
// // //                     className="btn btn-ghost btn-sm"
// // //                   >
// // //                     <X className="h-4 w-4" />
// // //                     Annuler
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Tableau des alertes */}
// // //       <div className="card bg-base-200 shadow-xl">
// // //         <div className="card-body p-0">
// // //           <div className="overflow-x-auto">
// // //             <table className="table table-zebra w-full">
// // //               <thead>
// // //                 <tr className="bg-base-300">
// // //                   <th className="font-bold w-12 text-center">
// // //                     <div className="flex justify-center">
// // //                       <button
// // //                         onClick={toggleSelectAll}
// // //                         className="btn btn-ghost btn-xs p-1 hover:bg-base-200 transition-colors"
// // //                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
// // //                       >
// // //                         {isSelectAll ? (
// // //                           <CheckSquare className="h-5 w-5 text-primary" />
// // //                         ) : (
// // //                           <Square className="h-5 w-5 text-base-content/40" />
// // //                         )}
// // //                       </button>
// // //                     </div>
// // //                   </th>
// // //                   <th className="font-bold">Type alerte</th>
// // //                   <th className="font-bold">Sévérité</th>
// // //                   <th className="font-bold">Statut</th>
// // //                   <th className="font-bold">Description</th>
// // //                   <th className="font-bold">Source</th>
// // //                   <th className="font-bold">Date alerte</th>
// // //                   <th className="font-bold text-center">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {safeArray(filteredAlertes).map((alerte) => (
// // //                   <tr key={alerte.id} className="hover">
// // //                     <td className="text-center">
// // //                       <div className="flex justify-center">
// // //                         <input
// // //                           type="checkbox"
// // //                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
// // //                           checked={selectedAlertes.includes(alerte.id)}
// // //                           onChange={() => toggleSelectAlerte(alerte.id)}
// // //                         />
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <div className="font-medium">
// // //                         {getTypeText(alerte.type_alerte)}
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <div className={`badge ${getSeveriteBadge(alerte.severite)} badge-lg gap-1`}>
// // //                         {getSeveriteIcon(alerte.severite)}
// // //                         {getSeveriteText(alerte.severite)}
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <div className={`badge ${getStatutBadge(alerte.statut)} badge-lg`}>
// // //                         {getStatutText(alerte.statut)}
// // //                       </div>
// // //                     </td>
// // //                     <td className="max-w-xs">
// // //                       <div className="line-clamp-2 text-sm">
// // //                         {alerte.description}
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <div className="text-sm">
// // //                         {alerte.materiel_nom && (
// // //                           <div>🖥️ {alerte.materiel_nom}</div>
// // //                         )}
// // //                         {alerte.logiciel_nom && (
// // //                           <div>💾 {alerte.logiciel_nom}</div>
// // //                         )}
// // //                         {!alerte.materiel_nom && !alerte.logiciel_nom && (
// // //                           <span className="text-base-content opacity-50">-</span>
// // //                         )}
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <span className="text-sm">
// // //                         {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : '-'}
// // //                       </span>
// // //                     </td>
// // //                     <td>
// // //                       <div className="flex justify-center space-x-1">
// // //                         <button
// // //                           className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
// // //                           title="Voir les détails"
// // //                         >
// // //                           <Eye className="h-4 w-4" />
// // //                         </button>
                        
// // //                         {alerte.statut === 'nouvelle' && (
// // //                           <button
// // //                             onClick={() => handleTraiter(alerte.id)}
// // //                             className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
// // //                             title="Marquer en traitement"
// // //                           >
// // //                             <Bell className="h-4 w-4" />
// // //                           </button>
// // //                         )}
                        
// // //                         {alerte.statut !== 'resolue' && (
// // //                           <button
// // //                             onClick={() => handleResoudre(alerte.id)}
// // //                             className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
// // //                             title="Marquer comme résolue"
// // //                           >
// // //                             <CheckCircle className="h-4 w-4" />
// // //                           </button>
// // //                         )}
                        
// // //                         <button
// // //                           onClick={() => handleEdit(alerte)}
// // //                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
// // //                           title="Modifier"
// // //                         >
// // //                           <Edit className="h-4 w-4" />
// // //                         </button>
                        
// // //                         <button
// // //                           onClick={() => handleDelete(alerte.id)}
// // //                           className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
// // //                           title="Supprimer"
// // //                         >
// // //                           <Trash2 className="h-4 w-4" />
// // //                         </button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {safeArray(filteredAlertes).length === 0 && (
// // //             <div className="text-center py-12">
// // //               <div className="text-base-content opacity-40 mb-4">
// // //                 <Bell className="h-16 w-16 mx-auto mb-4" />
// // //                 <p className="text-lg font-medium">Aucune alerte trouvée</p>
// // //                 <p className="text-sm mt-2">
// // //                   {searchTerm || filterSeverite || filterStatut || filterType
// // //                     ? "Essayez de modifier vos critères de recherche" 
// // //                     : "Aucune alerte n'est enregistrée dans le système"
// // //                   }
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Formulaire d'alerte */}
// // //       <AlerteForm
// // //         isOpen={isFormOpen}
// // //         onClose={() => {
// // //           setIsFormOpen(false);
// // //           setEditingAlerte(undefined);
// // //         }}
// // //         onSubmit={handleSubmit}
// // //         alerte={editingAlerte}
// // //         materiels={materiels}
// // //         logiciels={logiciels}
// // //         reseaux={reseaux}
// // //         incidents={incidents}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default Alertes;




// // // // import React, { useState, useEffect } from 'react';
// // // // import { Plus, Search, Eye, Filter, Download, Edit, Trash2, Bell, AlertTriangle, Info, CheckCircle, CheckSquare, Square, X, BarChart3 } from 'lucide-react';
// // // // import { Alerte } from '../types';
// // // // import AlerteForm from '../components/AlerteForm';
// // // // import { 
// // // //   alertesAPI, 
// // // //   materielsAPI, 
// // // //   logicielsAPI, 
// // // //   reseauAPI, 
// // // //   incidentsAPI 
// // // // } from '../services/api';

// // // // // Fonctions helper pour la sécurité des tableaux
// // // // const safeArray = (data: any): Alerte[] => {
// // // //   return Array.isArray(data) ? data : [];
// // // // };

// // // // const safeFilter = (array: any[], condition: (item: any) => boolean): Alerte[] => {
// // // //   if (!Array.isArray(array)) return [];
// // // //   return array.filter(condition);
// // // // };

// // // // const extractDataFromResponse = (response: any): Alerte[] => {
// // // //   if (!response || !response.data) {
// // // //     console.log('❌ Réponse vide ou sans data:', response);
// // // //     return [];
// // // //   }
  
// // // //   if (Array.isArray(response.data)) {
// // // //     return response.data;
// // // //   }
  
// // // //   if (response.data.results && Array.isArray(response.data.results)) {
// // // //     return response.data.results;
// // // //   }
  
// // // //   if (response.data.data && Array.isArray(response.data.data)) {
// // // //     return response.data.data;
// // // //   }
  
// // // //   if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // // //     return [response.data];
// // // //   }
  
// // // //   console.warn('⚠️ Format de réponse non reconnu:', response.data);
// // // //   return [];
// // // // };

// // // // // CORRECTION : Définir le type pour les messages
// // // // type MessageType = 'success' | 'error' | 'info' | 'warning';

// // // // const Alertes: React.FC = () => {
// // // //   const [alertes, setAlertes] = useState<Alerte[]>([]);
// // // //   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
// // // //   const [loading, setLoading] = useState<boolean>(true);
// // // //   const [error, setError] = useState<string>('');
// // // //   const [searchTerm, setSearchTerm] = useState<string>('');
// // // //   const [filterSeverite, setFilterSeverite] = useState<string>('');
// // // //   const [filterStatut, setFilterStatut] = useState<string>('');
// // // //   const [filterType, setFilterType] = useState<string>('');
// // // //   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
// // // //   const [isFormOpen, setIsFormOpen] = useState(false);
// // // //   const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
// // // //   const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
// // // //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

// // // //   // ÉTAT POUR LES DONNÉES DE RELATIONS
// // // //   const [materiels, setMateriels] = useState<any[]>([]);
// // // //   const [logiciels, setLogiciels] = useState<any[]>([]);
// // // //   const [reseaux, setReseaux] = useState<any[]>([]);
// // // //   const [incidents, setIncidents] = useState<any[]>([]);
// // // //   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

// // // //   // AJOUT : Statistiques
// // // //   const [statistiques, setStatistiques] = useState({
// // // //     total: 0,
// // // //     nouvelles: 0,
// // // //     enTraitement: 0,
// // // //     resolues: 0,
// // // //     critiques: 0,
// // // //     elevees: 0,
// // // //     moyennes: 0,
// // // //     basses: 0
// // // //   });

// // // //   // Charger les alertes
// // // //   const fetchAlertes = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       setError('');
// // // //       console.log('🔄 Chargement des alertes...');
      
// // // //       const response = await alertesAPI.getAll();
// // // //       console.log('✅ Réponse alertes:', response);
      
// // // //       const extractedData = extractDataFromResponse(response);
// // // //       console.log('🚨 Alertes chargées:', extractedData);
// // // //       setAlertes(extractedData);
      
// // // //       // Calculer les statistiques
// // // //       calculerStatistiques(extractedData);
// // // //     } catch (err: any) {
// // // //       console.error('❌ Erreur chargement alertes:', err);
// // // //       const errorMessage = err.response?.data?.message || 
// // // //                           err.message || 
// // // //                           'Erreur lors du chargement des alertes';
// // // //       setError(errorMessage);
// // // //       showMessage('error', errorMessage);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // AJOUT : Fonction pour calculer les statistiques
// // // //   const calculerStatistiques = (data: Alerte[]) => {
// // // //     const stats = {
// // // //       total: data.length,
// // // //       nouvelles: data.filter(a => a.statut === 'nouvelle').length,
// // // //       enTraitement: data.filter(a => a.statut === 'en_traitement').length,
// // // //       resolues: data.filter(a => a.statut === 'resolue').length,
// // // //       critiques: data.filter(a => a.severite === 'critique').length,
// // // //       elevees: data.filter(a => a.severite === 'elevee').length,
// // // //       moyennes: data.filter(a => a.severite === 'moyenne').length,
// // // //       basses: data.filter(a => a.severite === 'basse').length
// // // //     };
// // // //     setStatistiques(stats);
// // // //   };

// // // //   // CORRECTION AMÉLIORÉE : CHARGER LES DONNÉES DE RELATIONS
// // // //   const fetchRelationsData = async () => {
// // // //     try {
// // // //       setLoadingRelations(true);
// // // //       console.log('🔄 Chargement des données de relations...');

// // // //       // Utiliser Promise.allSettled pour gérer les erreurs individuelles
// // // //       const [materielsResponse, logicielsResponse, reseauxResponse, incidentsResponse] = await Promise.allSettled([
// // // //         materielsAPI.getAll().catch(err => ({ data: [] })),
// // // //         logicielsAPI.getAll().catch(err => ({ data: [] })),
// // // //         reseauAPI.getAll().catch(err => ({ data: [] })),
// // // //         incidentsAPI.getAll().catch(err => ({ data: [] }))
// // // //       ]);

// // // //       // Extraire les données avec gestion d'erreur
// // // //       const materielsData = materielsResponse.status === 'fulfilled' 
// // // //         ? extractDataFromResponse(materielsResponse.value) 
// // // //         : [];
      
// // // //       const logicielsData = logicielsResponse.status === 'fulfilled' 
// // // //         ? extractDataFromResponse(logicielsResponse.value) 
// // // //         : [];
      
// // // //       const reseauxData = reseauxResponse.status === 'fulfilled' 
// // // //         ? extractDataFromResponse(reseauxResponse.value) 
// // // //         : [];
      
// // // //       const incidentsData = incidentsResponse.status === 'fulfilled' 
// // // //         ? extractDataFromResponse(incidentsResponse.value) 
// // // //         : [];

// // // //       console.log('✅ Données de relations chargées:', {
// // // //         materiels: materielsData.length,
// // // //         logiciels: logicielsData.length,
// // // //         reseaux: reseauxData.length,
// // // //         incidents: incidentsData.length
// // // //       });

// // // //       setMateriels(materielsData);
// // // //       setLogiciels(logicielsData);
// // // //       setReseaux(reseauxData);
// // // //       setIncidents(incidentsData);

// // // //       // Afficher un message si certaines données sont vides
// // // //       const totalData = materielsData.length + logicielsData.length + reseauxData.length + incidentsData.length;
// // // //       if (totalData === 0) {
// // // //         showMessage('warning', 'Aucune donnée de relation disponible. Vérifiez votre connexion.');
// // // //       }

// // // //     } catch (err: any) {
// // // //       console.error('❌ Erreur chargement relations:', err);
// // // //       const errorMessage = err.response?.data?.message || 
// // // //                           err.message || 
// // // //                           'Erreur lors du chargement des données';
// // // //       showMessage('error', errorMessage);
      
// // // //       // Initialiser avec des tableaux vides
// // // //       setMateriels([]);
// // // //       setLogiciels([]);
// // // //       setReseaux([]);
// // // //       setIncidents([]);
// // // //     } finally {
// // // //       setLoadingRelations(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchAlertes();
// // // //     fetchRelationsData(); // Charger les données de relations au montage
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     filterAlertes();
// // // //   }, [alertes, searchTerm, filterSeverite, filterStatut, filterType]);

// // // //   useEffect(() => {
// // // //     if (filteredAlertes.length > 0 && selectedAlertes.length === filteredAlertes.length) {
// // // //       setIsSelectAll(true);
// // // //     } else {
// // // //       setIsSelectAll(false);
// // // //     }
// // // //   }, [selectedAlertes, filteredAlertes]);

// // // //   const filterAlertes = () => {
// // // //     let filtered = safeArray(alertes);

// // // //     if (searchTerm) {
// // // //       filtered = safeFilter(filtered, a => 
// // // //         a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //         (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
// // // //         (a.logiciel_nom && a.logiciel_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
// // // //         (a.reseau_nom && a.reseau_nom.toLowerCase().includes(searchTerm.toLowerCase()))
// // // //       );
// // // //     }

// // // //     if (filterSeverite) {
// // // //       filtered = safeFilter(filtered, a => a.severite === filterSeverite);
// // // //     }

// // // //     if (filterStatut) {
// // // //       filtered = safeFilter(filtered, a => a.statut === filterStatut);
// // // //     }

// // // //     if (filterType) {
// // // //       filtered = safeFilter(filtered, a => a.type_alerte === filterType);
// // // //     }

// // // //     setFilteredAlertes(filtered);
// // // //     setSelectedAlertes([]);
// // // //   };

// // // //   // CORRECTION : Fonction showMessage avec le type MessageType
// // // //   const showMessage = (type: MessageType, text: string) => {
// // // //     setMessage({ type, text });
// // // //     setTimeout(() => setMessage(null), 5000);
// // // //   };

// // // //   const handleSubmit = async (alerteData: any) => {
// // // //     try {
// // // //       console.log('📤 Soumission des données alerte:', alerteData);
      
// // // //       if (editingAlerte) {
// // // //         await alertesAPI.update(editingAlerte.id, alerteData);
// // // //         showMessage('success', 'Alerte modifiée avec succès');
// // // //       } else {
// // // //         await alertesAPI.create(alerteData);
// // // //         showMessage('success', 'Alerte créée avec succès');
// // // //       }
      
// // // //       // Recharger les données
// // // //       await fetchAlertes();
// // // //       setIsFormOpen(false);
// // // //       setEditingAlerte(undefined);
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur sauvegarde alerte:', error);
// // // //       const errorMessage = error.response?.data?.message || 
// // // //                           error.message || 
// // // //                           'Erreur lors de la sauvegarde';
// // // //       showMessage('error', errorMessage);
// // // //     }
// // // //   };

// // // //   // CORRECTION : Fonctions handleAddNew et handleEdit améliorées
// // // //   const handleAddNew = () => {
// // // //     // Vérifier que les données de relations sont chargées
// // // //     if (loadingRelations) {
// // // //       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
// // // //       return;
// // // //     }
    
// // // //     // CORRECTION : Vérifier si au moins une des sources est disponible
// // // //     const hasRelationsData = materiels.length > 0 || logiciels.length > 0 || reseaux.length > 0 || incidents.length > 0;
    
// // // //     if (!hasRelationsData) {
// // // //       showMessage('warning', 
// // // //         `Aucune donnée de relation disponible. 
// // // //         Matériels: ${materiels.length} | 
// // // //         Logiciels: ${logiciels.length} | 
// // // //         Réseaux: ${reseaux.length} | 
// // // //         Incidents: ${incidents.length}`
// // // //       );
      
// // // //       // Proposer de recharger
// // // //       if (confirm('Voulez-vous recharger les données ?')) {
// // // //         fetchRelationsData();
// // // //       }
      
// // // //       return;
// // // //     }

// // // //     console.log('✅ Données disponibles pour nouvelle alerte:', {
// // // //       materiels: materiels.length,
// // // //       logiciels: logiciels.length,
// // // //       reseaux: reseaux.length,
// // // //       incidents: incidents.length
// // // //     });

// // // //     setEditingAlerte(undefined);
// // // //     setIsFormOpen(true);
// // // //   };

// // // //   const handleEdit = (alerte: Alerte) => {
// // // //     if (loadingRelations) {
// // // //       showMessage('info', 'Chargement des données en cours...');
// // // //       return;
// // // //     }

// // // //     // CORRECTION : Même vérification pour l'édition
// // // //     const hasRelationsData = materiels.length > 0 || logiciels.length > 0 || reseaux.length > 0 || incidents.length > 0;
    
// // // //     if (!hasRelationsData) {
// // // //       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
// // // //       return;
// // // //     }

// // // //     setEditingAlerte(alerte);
// // // //     setIsFormOpen(true);
// // // //   };

// // // //   // Fonctions de sélection
// // // //   const toggleSelectAlerte = (id: number) => {
// // // //     setSelectedAlertes(prev => 
// // // //       prev.includes(id) 
// // // //         ? prev.filter(item => item !== id)
// // // //         : [...prev, id]
// // // //     );
// // // //   };

// // // //   const toggleSelectAll = () => {
// // // //     if (isSelectAll) {
// // // //       setSelectedAlertes([]);
// // // //     } else {
// // // //       const allIds = filteredAlertes.map(a => a.id);
// // // //       setSelectedAlertes(allIds);
// // // //     }
// // // //   };

// // // //   const handleDeleteSelected = async () => {
// // // //     if (selectedAlertes.length === 0) {
// // // //       showMessage('error', 'Aucune alerte sélectionnée');
// // // //       return;
// // // //     }

// // // //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ?`)) {
// // // //       try {
// // // //         for (const id of selectedAlertes) {
// // // //           await alertesAPI.delete(id);
// // // //         }
        
// // // //         showMessage('success', `${selectedAlertes.length} alerte(s) supprimée(s) avec succès`);
// // // //         setSelectedAlertes([]);
// // // //         fetchAlertes();
// // // //       } catch (error: any) {
// // // //         showMessage('error', 'Erreur lors de la suppression des alertes');
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleEditSelected = () => {
// // // //     if (selectedAlertes.length === 0) {
// // // //       showMessage('error', 'Aucune alerte sélectionnée');
// // // //       return;
// // // //     }

// // // //     if (selectedAlertes.length === 1) {
// // // //       const alerte = alertes.find(a => a.id === selectedAlertes[0]);
// // // //       if (alerte) {
// // // //         handleEdit(alerte);
// // // //       }
// // // //     } else {
// // // //       showMessage('info', `Édition multiple de ${selectedAlertes.length} alertes`);
// // // //     }
// // // //   };

// // // //   // CORRECTION : Fonctions Traiter et Résoudre améliorées
// // // //   const handleTraiterSelected = async () => {
// // // //     if (selectedAlertes.length === 0) {
// // // //       showMessage('error', 'Aucune alerte sélectionnée');
// // // //       return;
// // // //     }

// // // //     try {
// // // //       for (const id of selectedAlertes) {
// // // //         await alertesAPI.traiter(id);
// // // //       }
      
// // // //       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme traitées`);
// // // //       setSelectedAlertes([]);
// // // //       fetchAlertes();
// // // //     } catch (error: any) {
// // // //       showMessage('error', 'Erreur lors du traitement des alertes');
// // // //     }
// // // //   };

// // // //   // CORRECTION : handleResoudreSelected réintégré
// // // //   const handleResoudreSelected = async () => {
// // // //     if (selectedAlertes.length === 0) {
// // // //       showMessage('error', 'Aucune alerte sélectionnée');
// // // //       return;
// // // //     }

// // // //     try {
// // // //       for (const id of selectedAlertes) {
// // // //         await alertesAPI.update(id, { statut: 'resolue' });
// // // //       }
      
// // // //       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme résolues`);
// // // //       setSelectedAlertes([]);
// // // //       fetchAlertes();
// // // //     } catch (error: any) {
// // // //       showMessage('error', 'Erreur lors de la résolution des alertes');
// // // //     }
// // // //   };

// // // //   const handleDelete = async (id: number) => {
// // // //     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
// // // //       try {
// // // //         await alertesAPI.delete(id);
// // // //         showMessage('success', 'Alerte supprimée avec succès');
// // // //         fetchAlertes();
// // // //       } catch (error: any) {
// // // //         showMessage('error', 'Erreur lors de la suppression');
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleTraiter = async (id: number) => {
// // // //     try {
// // // //       await alertesAPI.traiter(id);
// // // //       showMessage('success', 'Alerte marquée comme traitée');
// // // //       fetchAlertes();
// // // //     } catch (error: any) {
// // // //       showMessage('error', 'Erreur lors du traitement');
// // // //     }
// // // //   };

// // // //   // CORRECTION : Une seule fonction handleResoudre
// // // //   const handleResoudre = async (id: number) => {
// // // //     try {
// // // //       await alertesAPI.update(id, { statut: 'resolue' });
// // // //       showMessage('success', 'Alerte marquée comme résolue');
// // // //       fetchAlertes();
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur résolution:', error);
// // // //       // Afficher les détails de l'erreur
// // // //       if (error.response?.data) {
// // // //         console.log('Détails erreur:', error.response.data);
// // // //       }
// // // //       showMessage('error', 'Erreur lors de la résolution - Voir console');
// // // //     }
// // // //   };

// // // //   // Fonctions d'affichage
// // // //   const getSeveriteBadge = (severite: string) => {
// // // //     const badges = {
// // // //       critique: 'badge-error',
// // // //       elevee: 'badge-warning',
// // // //       moyenne: 'badge-info',
// // // //       basse: 'badge-neutral'
// // // //     };
// // // //     return badges[severite as keyof typeof badges] || 'badge-neutral';
// // // //   };

// // // //   const getSeveriteText = (severite: string) => {
// // // //     const texts = {
// // // //       critique: 'Critique',
// // // //       elevee: 'Élevée',
// // // //       moyenne: 'Moyenne',
// // // //       basse: 'Basse'
// // // //     };
// // // //     return texts[severite as keyof typeof texts] || severite;
// // // //   };

// // // //   const getSeveriteIcon = (severite: string) => {
// // // //     const icons = {
// // // //       critique: <AlertTriangle className="h-4 w-4" />,
// // // //       elevee: <AlertTriangle className="h-4 w-4" />,
// // // //       moyenne: <Bell className="h-4 w-4" />,
// // // //       basse: <Info className="h-4 w-4" />
// // // //     };
// // // //     return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
// // // //   };

// // // //   const getStatutBadge = (statut: string) => {
// // // //     const badges = {
// // // //       nouvelle: 'badge-error',
// // // //       en_traitement: 'badge-warning',
// // // //       resolue: 'badge-success'
// // // //     };
// // // //     return badges[statut as keyof typeof badges] || 'badge-neutral';
// // // //   };

// // // //   const getStatutText = (statut: string) => {
// // // //     const texts = {
// // // //       nouvelle: 'Nouvelle',
// // // //       en_traitement: 'En traitement',
// // // //       resolue: 'Résolue'
// // // //     };
// // // //     return texts[statut as keyof typeof texts] || statut;
// // // //   };

// // // //   const getTypeText = (type: string) => {
// // // //     const texts = {
// // // //       securite: 'Sécurité',
// // // //       performance: 'Performance',
// // // //       panne: 'Panne',
// // // //       maintenance: 'Maintenance'
// // // //     };
// // // //     return texts[type as keyof typeof texts] || type;
// // // //   };

// // // //   const resetFilters = () => {
// // // //     setSearchTerm('');
// // // //     setFilterSeverite('');
// // // //     setFilterStatut('');
// // // //     setFilterType('');
// // // //     setSelectedAlertes([]);
// // // //   };

// // // //   const handleExport = () => {
// // // //     try {
// // // //       const dataToExport = filteredAlertes.map(a => ({
// // // //         Type: getTypeText(a.type_alerte),
// // // //         Sévérité: getSeveriteText(a.severite),
// // // //         Statut: getStatutText(a.statut),
// // // //         Description: a.description,
// // // //         'Matériel source': a.materiel_nom || 'Non spécifié',
// // // //         'Logiciel source': a.logiciel_nom || 'Non spécifié',
// // // //         'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée'
// // // //       }));

// // // //       const csvContent = [
// // // //         Object.keys(dataToExport[0] || {}).join(','),
// // // //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// // // //       ].join('\n');

// // // //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// // // //       const link = document.createElement('a');
// // // //       const url = URL.createObjectURL(blob);
// // // //       link.setAttribute('href', url);
// // // //       link.setAttribute('download', `alertes_${new Date().toISOString().split('T')[0]}.csv`);
// // // //       link.style.visibility = 'hidden';
// // // //       document.body.appendChild(link);
// // // //       link.click();
// // // //       document.body.removeChild(link);

// // // //       showMessage('success', 'Export CSV réussi !');
// // // //     } catch (error) {
// // // //       showMessage('error', 'Erreur lors de l\'export');
// // // //     }
// // // //   };

// // // //   // Fonction pour obtenir la classe CSS du message
// // // //   const getAlertClass = (type: MessageType) => {
// // // //     switch (type) {
// // // //       case 'success': return 'alert-success';
// // // //       case 'error': return 'alert-error';
// // // //       case 'warning': return 'alert-warning';
// // // //       case 'info': return 'alert-info';
// // // //       default: return 'alert-info';
// // // //     }
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// // // //         <div className="flex flex-col items-center gap-4">
// // // //           <span className="loading loading-spinner loading-lg text-primary"></span>
// // // //           <p className="text-base-content">Chargement des alertes...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="p-6 bg-base-100 min-h-screen">
// // // //       {/* Messages */}
// // // //       {message && (
// // // //         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
// // // //           <span>{message.text}</span>
// // // //         </div>
// // // //       )}

// // // //       {error && (
// // // //         <div className="alert alert-error mb-4">
// // // //           <span>{error}</span>
// // // //           <button className="btn btn-ghost btn-sm" onClick={fetchAlertes}>
// // // //             Réessayer
// // // //           </button>
// // // //         </div>
// // // //       )}

// // // //       {/* CORRECTION : Messages d'information sur les données de relations */}
// // // //       {loadingRelations && (
// // // //         <div className="alert alert-info mb-4">
// // // //           <div className="flex items-center gap-2">
// // // //             <span className="loading loading-spinner loading-sm"></span>
// // // //             <span>Chargement des données de relations en cours...</span>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* CORRECTION : Avertissement si pas de données de relations */}
// // // //       {!loadingRelations && materiels.length === 0 && logiciels.length === 0 && reseaux.length === 0 && (
// // // //         <div className="alert alert-warning mb-4">
// // // //           <div className="flex items-center justify-between">
// // // //             <div>
// // // //               <span>⚠️ Aucune donnée de relation disponible. </span>
// // // //               <button 
// // // //                 onClick={fetchRelationsData}
// // // //                 className="btn btn-sm btn-outline ml-2"
// // // //               >
// // // //                 Recharger
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* En-tête */}
// // // //       <div className="flex justify-between items-center mb-6">
// // // //         <div>
// // // //           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Alertes</h1>
// // // //           <p className="text-base-content opacity-60 mt-1">
// // // //             {filteredAlertes.length} alerte(s) trouvée(s)
// // // //             {loadingRelations && ' - Chargement des données...'}
// // // //             {/* CORRECTION : Afficher le statut des données de relations */}
// // // //             {!loadingRelations && (
// // // //               <span className="text-sm ml-2">
// // // //                 (📦 {materiels.length} mat. | 💾 {logiciels.length} log. | 🌐 {reseaux.length} rés. | ⚠️ {incidents.length} inc.)
// // // //               </span>
// // // //             )}
// // // //           </p>
// // // //         </div>
// // // //         <div className="flex gap-2">
// // // //           {/* CORRECTION : Bouton Actualiser réintégré */}
// // // //           <button
// // // //             onClick={() => {
// // // //               fetchAlertes();
// // // //               fetchRelationsData();
// // // //             }}
// // // //             className="btn btn-outline btn-sm gap-2"
// // // //             title="Actualiser les données"
// // // //           >
// // // //             <span>🔄</span>
// // // //             Actualiser
// // // //           </button>
// // // //           <button
// // // //             onClick={handleExport}
// // // //             className="btn btn-outline btn-sm"
// // // //             title="Exporter la liste"
// // // //           >
// // // //             <Download className="h-4 w-4 mr-2" />
// // // //             Exporter
// // // //           </button>
// // // //           <button
// // // //             onClick={handleAddNew}
// // // //             className="btn btn-primary btn-sm"
// // // //             disabled={loadingRelations}
// // // //           >
// // // //             <Plus className="h-4 w-4 mr-2" />
// // // //             Nouvelle alerte
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* AJOUT : Section Statistiques */}
// // // //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
// // // //         {/* Carte Total */}
// // // //         <div className="card bg-base-200 shadow-sm">
// // // //           <div className="card-body p-4 text-center">
// // // //             <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
// // // //             <h3 className="text-lg font-bold">{statistiques.total}</h3>
// // // //             <p className="text-sm opacity-60">Total</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Carte Nouvelles */}
// // // //         <div className="card bg-error/10 shadow-sm">
// // // //           <div className="card-body p-4 text-center">
// // // //             <Bell className="h-6 w-6 text-error mx-auto mb-2" />
// // // //             <h3 className="text-lg font-bold text-error">{statistiques.nouvelles}</h3>
// // // //             <p className="text-sm opacity-60">Nouvelles</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Carte En traitement */}
// // // //         <div className="card bg-warning/10 shadow-sm">
// // // //           <div className="card-body p-4 text-center">
// // // //             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
// // // //             <h3 className="text-lg font-bold text-warning">{statistiques.enTraitement}</h3>
// // // //             <p className="text-sm opacity-60">En traitement</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Carte Résolues */}
// // // //         <div className="card bg-success/10 shadow-sm">
// // // //           <div className="card-body p-4 text-center">
// // // //             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
// // // //             <h3 className="text-lg font-bold text-success">{statistiques.resolues}</h3>
// // // //             <p className="text-sm opacity-60">Résolues</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Carte Critiques */}
// // // //         <div className="card bg-error/10 shadow-sm">
// // // //           <div className="card-body p-4 text-center">
// // // //             <AlertTriangle className="h-6 w-6 text-error mx-auto mb-2" />
// // // //             <h3 className="text-lg font-bold text-error">{statistiques.critiques}</h3>
// // // //             <p className="text-sm opacity-60">Critiques</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Carte Élevées */}
// // // //         <div className="card bg-warning/10 shadow-sm">
// // // //           <div className="card-body p-4 text-center">
// // // //             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
// // // //             <h3 className="text-lg font-bold text-warning">{statistiques.elevees}</h3>
// // // //             <p className="text-sm opacity-60">Élevées</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Carte Moyennes */}
// // // //         <div className="card bg-info/10 shadow-sm">
// // // //           <div className="card-body p-4 text-center">
// // // //             <Bell className="h-6 w-6 text-info mx-auto mb-2" />
// // // //             <h3 className="text-lg font-bold text-info">{statistiques.moyennes}</h3>
// // // //             <p className="text-sm opacity-60">Moyennes</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Carte Basses */}
// // // //         <div className="card bg-success/10 shadow-sm">
// // // //           <div className="card-body p-4 text-center">
// // // //             <Info className="h-6 w-6 text-success mx-auto mb-2" />
// // // //             <h3 className="text-lg font-bold text-success">{statistiques.basses}</h3>
// // // //             <p className="text-sm opacity-60">Basses</p>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Filtres et recherche */}
// // // //       <div className="card bg-base-200 shadow-xl mb-6">
// // // //         <div className="card-body">
// // // //           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text">🔍 Rechercher</span>
// // // //               </label>
// // // //               <div className="relative">
// // // //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // //                 <input
// // // //                   type="text"
// // // //                   placeholder="Description, matériel, logiciel..."
// // // //                   className="input input-bordered w-full pl-10 bg-base-100"
// // // //                   value={searchTerm}
// // // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // // //                 />
// // // //               </div>
// // // //             </div>

// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text">📊 Sévérité</span>
// // // //               </label>
// // // //               <select
// // // //                 className="select select-bordered w-full bg-base-100"
// // // //                 value={filterSeverite}
// // // //                 onChange={(e) => setFilterSeverite(e.target.value)}
// // // //               >
// // // //                 <option value="">Toutes les sévérités</option>
// // // //                 <option value="critique">Critique</option>
// // // //                 <option value="elevee">Élevée</option>
// // // //                 <option value="moyenne">Moyenne</option>
// // // //                 <option value="basse">Basse</option>
// // // //               </select>
// // // //             </div>

// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text">📈 Statut</span>
// // // //               </label>
// // // //               <select
// // // //                 className="select select-bordered w-full bg-base-100"
// // // //                 value={filterStatut}
// // // //                 onChange={(e) => setFilterStatut(e.target.value)}
// // // //               >
// // // //                 <option value="">Tous les statuts</option>
// // // //                 <option value="nouvelle">Nouvelle</option>
// // // //                 <option value="en_traitement">En traitement</option>
// // // //                 <option value="resolue">Résolue</option>
// // // //               </select>
// // // //             </div>

// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text">🔧 Type</span>
// // // //               </label>
// // // //               <select
// // // //                 className="select select-bordered w-full bg-base-100"
// // // //                 value={filterType}
// // // //                 onChange={(e) => setFilterType(e.target.value)}
// // // //               >
// // // //                 <option value="">Tous les types</option>
// // // //                 <option value="securite">Sécurité</option>
// // // //                 <option value="performance">Performance</option>
// // // //                 <option value="panne">Panne</option>
// // // //                 <option value="maintenance">Maintenance</option>
// // // //               </select>
// // // //             </div>

// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text">🔄 Actions</span>
// // // //               </label>
// // // //               <button
// // // //                 onClick={resetFilters}
// // // //                 className="btn btn-outline w-full gap-2"
// // // //               >
// // // //                 <Filter className="h-4 w-4" />
// // // //                 Réinitialiser
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Actions de sélection - CORRECTION : Garder toutes les actions */}
// // // //           {selectedAlertes.length > 0 && (
// // // //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// // // //               <div className="flex items-center justify-between">
// // // //                 <div className="flex items-center gap-4">
// // // //                   <div className="flex items-center gap-2">
// // // //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// // // //                     <span className="font-semibold text-primary text-lg">
// // // //                       {selectedAlertes.length} alerte(s) sélectionnée(s)
// // // //                     </span>
// // // //                   </div>
// // // //                 </div>
// // // //                 <div className="flex gap-2">
// // // //                   {/* CORRECTION : Garder Traiter et Résoudre */}
// // // //                   <button
// // // //                     onClick={handleTraiterSelected}
// // // //                     className="btn btn-warning btn-sm gap-2"
// // // //                   >
// // // //                     <Bell className="h-4 w-4" />
// // // //                     Traiter ({selectedAlertes.length})
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={handleResoudreSelected}
// // // //                     className="btn btn-success btn-sm gap-2"
// // // //                   >
// // // //                     <CheckCircle className="h-4 w-4" />
// // // //                     Résoudre ({selectedAlertes.length})
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={handleEditSelected}
// // // //                     className="btn btn-primary btn-sm gap-2"
// // // //                   >
// // // //                     <Edit className="h-4 w-4" />
// // // //                     Modifier ({selectedAlertes.length})
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={handleDeleteSelected}
// // // //                     className="btn btn-outline btn-error btn-sm gap-2"
// // // //                   >
// // // //                     <Trash2 className="h-4 w-4" />
// // // //                     Supprimer ({selectedAlertes.length})
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={() => setSelectedAlertes([])}
// // // //                     className="btn btn-ghost btn-sm"
// // // //                   >
// // // //                     <X className="h-4 w-4" />
// // // //                     Annuler
// // // //                   </button>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Tableau des alertes */}
// // // //       <div className="card bg-base-200 shadow-xl">
// // // //         <div className="card-body p-0">
// // // //           <div className="overflow-x-auto">
// // // //             <table className="table table-zebra w-full">
// // // //               <thead>
// // // //                 <tr className="bg-base-300">
// // // //                   <th className="font-bold w-12 text-center">
// // // //                     <div className="flex justify-center">
// // // //                       <button
// // // //                         onClick={toggleSelectAll}
// // // //                         className="btn btn-ghost btn-xs p-1 hover:bg-base-200 transition-colors"
// // // //                         title={isSelectAll ? "Désélectionner toutes" : "Sélectionner toutes"}
// // // //                       >
// // // //                         {isSelectAll ? (
// // // //                           <CheckSquare className="h-5 w-5 text-primary" />
// // // //                         ) : (
// // // //                           <Square className="h-5 w-5 text-base-content/40" />
// // // //                         )}
// // // //                       </button>
// // // //                     </div>
// // // //                   </th>
// // // //                   <th className="font-bold">Type alerte</th>
// // // //                   <th className="font-bold">Sévérité</th>
// // // //                   <th className="font-bold">Statut</th>
// // // //                   <th className="font-bold">Description</th>
// // // //                   <th className="font-bold">Source</th>
// // // //                   <th className="font-bold">Date alerte</th>
// // // //                   <th className="font-bold text-center">Actions</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {safeArray(filteredAlertes).map((alerte) => (
// // // //                   <tr key={alerte.id} className="hover">
// // // //                     <td className="text-center">
// // // //                       <div className="flex justify-center">
// // // //                         <input
// // // //                           type="checkbox"
// // // //                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
// // // //                           checked={selectedAlertes.includes(alerte.id)}
// // // //                           onChange={() => toggleSelectAlerte(alerte.id)}
// // // //                         />
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div className="font-medium">
// // // //                         {getTypeText(alerte.type_alerte)}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div className={`badge ${getSeveriteBadge(alerte.severite)} badge-lg gap-1`}>
// // // //                         {getSeveriteIcon(alerte.severite)}
// // // //                         {getSeveriteText(alerte.severite)}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div className={`badge ${getStatutBadge(alerte.statut)} badge-lg`}>
// // // //                         {getStatutText(alerte.statut)}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td className="max-w-xs">
// // // //                       <div className="line-clamp-2 text-sm">
// // // //                         {alerte.description}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div className="text-sm">
// // // //                         {alerte.materiel_nom && (
// // // //                           <div>🖥️ {alerte.materiel_nom}</div>
// // // //                         )}
// // // //                         {alerte.logiciel_nom && (
// // // //                           <div>💾 {alerte.logiciel_nom}</div>
// // // //                         )}
// // // //                         {!alerte.materiel_nom && !alerte.logiciel_nom && (
// // // //                           <span className="text-base-content opacity-50">-</span>
// // // //                         )}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       <span className="text-sm">
// // // //                         {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : '-'}
// // // //                       </span>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div className="flex justify-center space-x-1">
// // // //                         <button
// // // //                           className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
// // // //                           title="Voir les détails"
// // // //                           onClick={() => {
// // // //                             // CORRECTION : Ajouter une fonction pour voir les détails
// // // //                             showMessage('info', `Détails de l'alerte: ${alerte.description}`);
// // // //                           }}
// // // //                         >
// // // //                           <Eye className="h-4 w-4" />
// // // //                         </button>
                        
// // // //                         {alerte.statut === 'nouvelle' && (
// // // //                           <button
// // // //                             onClick={() => handleTraiter(alerte.id)}
// // // //                             className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
// // // //                             title="Marquer en traitement"
// // // //                           >
// // // //                             <Bell className="h-4 w-4" />
// // // //                           </button>
// // // //                         )}
                        
// // // //                         {alerte.statut !== 'resolue' && (
// // // //                           <button
// // // //                             onClick={() => handleResoudre(alerte.id)}
// // // //                             className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
// // // //                             title="Marquer comme résolue"
// // // //                           >
// // // //                             <CheckCircle className="h-4 w-4" />
// // // //                           </button>
// // // //                         )}
                        
// // // //                         <button
// // // //                           onClick={() => handleEdit(alerte)}
// // // //                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
// // // //                           title="Modifier"
// // // //                         >
// // // //                           <Edit className="h-4 w-4" />
// // // //                         </button>
                        
// // // //                         <button
// // // //                           onClick={() => handleDelete(alerte.id)}
// // // //                           className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
// // // //                           title="Supprimer"
// // // //                         >
// // // //                           <Trash2 className="h-4 w-4" />
// // // //                         </button>
// // // //                       </div>
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>

// // // //           {safeArray(filteredAlertes).length === 0 && (
// // // //             <div className="text-center py-12">
// // // //               <div className="text-base-content opacity-40 mb-4">
// // // //                 <Bell className="h-16 w-16 mx-auto mb-4" />
// // // //                 <p className="text-lg font-medium">Aucune alerte trouvée</p>
// // // //                 <p className="text-sm mt-2">
// // // //                   {searchTerm || filterSeverite || filterStatut || filterType
// // // //                     ? "Essayez de modifier vos critères de recherche" 
// // // //                     : "Aucune alerte n'est enregistrée dans le système"
// // // //                   }
// // // //                 </p>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Formulaire d'alerte */}
// // // //       <AlerteForm
// // // //         isOpen={isFormOpen}
// // // //         onClose={() => {
// // // //           setIsFormOpen(false);
// // // //           setEditingAlerte(undefined);
// // // //         }}
// // // //         onSubmit={handleSubmit}
// // // //         alerte={editingAlerte}
// // // //         materiels={materiels}
// // // //         logiciels={logiciels}
// // // //         reseaux={reseaux}
// // // //         incidents={incidents}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Alertes;





// // // src/pages/Alertes.jsx - VERSION SANS API LOGICIEL ET RÉSEAU
// // import React, { useState, useEffect } from 'react';
// // import { Plus, Search, Eye, Filter, Download, Edit, Trash2, Bell, AlertTriangle, Info, CheckCircle, CheckSquare, Square, X, BarChart3 } from 'lucide-react';
// // import { Alerte } from '../types';
// // import AlerteForm from '../components/AlerteForm';
// // import { 
// //   alertesAPI, 
// //   materielsAPI, 
// //   incidentsAPI 
// // } from '../services/api';

// // // Fonctions helper pour la sécurité des tableaux
// // const safeArray = (data: any): Alerte[] => {
// //   return Array.isArray(data) ? data : [];
// // };

// // const safeFilter = (array: any[], condition: (item: any) => boolean): Alerte[] => {
// //   if (!Array.isArray(array)) return [];
// //   return array.filter(condition);
// // };

// // const extractDataFromResponse = (response: any): Alerte[] => {
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

// // // Définir le type pour les messages
// // type MessageType = 'success' | 'error' | 'info' | 'warning';

// // const Alertes: React.FC = () => {
// //   const [alertes, setAlertes] = useState<Alerte[]>([]);
// //   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string>('');
// //   const [searchTerm, setSearchTerm] = useState<string>('');
// //   const [filterSeverite, setFilterSeverite] = useState<string>('');
// //   const [filterStatut, setFilterStatut] = useState<string>('');
// //   const [filterType, setFilterType] = useState<string>('');
// //   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
// //   const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
// //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

// //   // ÉTAT POUR LES DONNÉES DE RELATIONS DISPONIBLES
// //   const [materiels, setMateriels] = useState<any[]>([]);
// //   const [incidents, setIncidents] = useState<any[]>([]);
// //   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

// //   // Statistiques
// //   const [statistiques, setStatistiques] = useState({
// //     total: 0,
// //     nouvelles: 0,
// //     enTraitement: 0,
// //     resolues: 0,
// //     critiques: 0,
// //     elevees: 0,
// //     moyennes: 0,
// //     basses: 0
// //   });

// //   // Charger les alertes
// //   const fetchAlertes = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       console.log('🔄 Chargement des alertes...');
      
// //       const response = await alertesAPI.getAll();
// //       console.log('✅ Réponse alertes:', response);
      
// //       const extractedData = extractDataFromResponse(response);
// //       console.log('🚨 Alertes chargées:', extractedData);
// //       setAlertes(extractedData);
      
// //       // Calculer les statistiques
// //       calculerStatistiques(extractedData);
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement alertes:', err);
// //       const errorMessage = err.response?.data?.message || 
// //                           err.message || 
// //                           'Erreur lors du chargement des alertes';
// //       setError(errorMessage);
// //       showMessage('error', errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Fonction pour calculer les statistiques
// //   const calculerStatistiques = (data: Alerte[]) => {
// //     const stats = {
// //       total: data.length,
// //       nouvelles: data.filter(a => a.statut === 'nouvelle').length,
// //       enTraitement: data.filter(a => a.statut === 'en_traitement').length,
// //       resolues: data.filter(a => a.statut === 'resolue').length,
// //       critiques: data.filter(a => a.severite === 'critique').length,
// //       elevees: data.filter(a => a.severite === 'elevee').length,
// //       moyennes: data.filter(a => a.severite === 'moyenne').length,
// //       basses: data.filter(a => a.severite === 'basse').length
// //     };
// //     setStatistiques(stats);
// //   };

// //   // Charger les données de relations disponibles
// //   const fetchRelationsData = async () => {
// //     try {
// //       setLoadingRelations(true);
// //       console.log('🔄 Chargement des données de relations...');

// //       // Utiliser Promise.allSettled pour gérer les erreurs individuelles
// //       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
// //         materielsAPI.getAll().catch(err => ({ data: [] })),
// //         incidentsAPI.getAll().catch(err => ({ data: [] }))
// //       ]);

// //       // Extraire les données avec gestion d'erreur
// //       const materielsData = materielsResponse.status === 'fulfilled' 
// //         ? extractDataFromResponse(materielsResponse.value) 
// //         : [];
      
// //       const incidentsData = incidentsResponse.status === 'fulfilled' 
// //         ? extractDataFromResponse(incidentsResponse.value) 
// //         : [];

// //       console.log('✅ Données de relations chargées:', {
// //         materiels: materielsData.length,
// //         incidents: incidentsData.length
// //       });

// //       setMateriels(materielsData);
// //       setIncidents(incidentsData);

// //       // Afficher un message si certaines données sont vides
// //       const totalData = materielsData.length + incidentsData.length;
// //       if (totalData === 0) {
// //         showMessage('warning', 'Aucune donnée de relation disponible. Vérifiez votre connexion.');
// //       }

// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement relations:', err);
// //       const errorMessage = err.response?.data?.message || 
// //                           err.message || 
// //                           'Erreur lors du chargement des données';
// //       showMessage('error', errorMessage);
      
// //       // Initialiser avec des tableaux vides
// //       setMateriels([]);
// //       setIncidents([]);
// //     } finally {
// //       setLoadingRelations(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAlertes();
// //     fetchRelationsData();
// //   }, []);

// //   useEffect(() => {
// //     filterAlertes();
// //   }, [alertes, searchTerm, filterSeverite, filterStatut, filterType]);

// //   useEffect(() => {
// //     if (filteredAlertes.length > 0 && selectedAlertes.length === filteredAlertes.length) {
// //       setIsSelectAll(true);
// //     } else {
// //       setIsSelectAll(false);
// //     }
// //   }, [selectedAlertes, filteredAlertes]);

// //   const filterAlertes = () => {
// //     let filtered = safeArray(alertes);

// //     if (searchTerm) {
// //       filtered = safeFilter(filtered, a => 
// //         a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchTerm.toLowerCase()))
// //       );
// //     }

// //     if (filterSeverite) {
// //       filtered = safeFilter(filtered, a => a.severite === filterSeverite);
// //     }

// //     if (filterStatut) {
// //       filtered = safeFilter(filtered, a => a.statut === filterStatut);
// //     }

// //     if (filterType) {
// //       filtered = safeFilter(filtered, a => a.type_alerte === filterType);
// //     }

// //     setFilteredAlertes(filtered);
// //     setSelectedAlertes([]);
// //   };

// //   const showMessage = (type: MessageType, text: string) => {
// //     setMessage({ type, text });
// //     setTimeout(() => setMessage(null), 5000);
// //   };

// //   const handleSubmit = async (alerteData: any) => {
// //     try {
// //       console.log('📤 Soumission des données alerte:', alerteData);
      
// //       if (editingAlerte) {
// //         await alertesAPI.update(editingAlerte.id, alerteData);
// //         showMessage('success', 'Alerte modifiée avec succès');
// //       } else {
// //         await alertesAPI.create(alerteData);
// //         showMessage('success', 'Alerte créée avec succès');
// //       }
      
// //       await fetchAlertes();
// //       setIsFormOpen(false);
// //       setEditingAlerte(undefined);
// //     } catch (error: any) {
// //       console.error('❌ Erreur sauvegarde alerte:', error);
// //       const errorMessage = error.response?.data?.message || 
// //                           error.message || 
// //                           'Erreur lors de la sauvegarde';
// //       showMessage('error', errorMessage);
// //     }
// //   };

// //   const handleAddNew = () => {
// //     if (loadingRelations) {
// //       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
// //       return;
// //     }
    
// //     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
// //     if (!hasRelationsData) {
// //       showMessage('warning', 
// //         `Aucune donnée de relation disponible. 
// //         Matériels: ${materiels.length} | 
// //         Incidents: ${incidents.length}`
// //       );
      
// //       if (confirm('Voulez-vous recharger les données ?')) {
// //         fetchRelationsData();
// //       }
      
// //       return;
// //     }

// //     console.log('✅ Données disponibles pour nouvelle alerte:', {
// //       materiels: materiels.length,
// //       incidents: incidents.length
// //     });

// //     setEditingAlerte(undefined);
// //     setIsFormOpen(true);
// //   };

// //   const handleEdit = (alerte: Alerte) => {
// //     if (loadingRelations) {
// //       showMessage('info', 'Chargement des données en cours...');
// //       return;
// //     }

// //     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
// //     if (!hasRelationsData) {
// //       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
// //       return;
// //     }

// //     setEditingAlerte(alerte);
// //     setIsFormOpen(true);
// //   };

// //   // Fonctions de sélection
// //   const toggleSelectAlerte = (id: number) => {
// //     setSelectedAlertes(prev => 
// //       prev.includes(id) 
// //         ? prev.filter(item => item !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   const toggleSelectAll = () => {
// //     if (isSelectAll) {
// //       setSelectedAlertes([]);
// //     } else {
// //       const allIds = filteredAlertes.map(a => a.id);
// //       setSelectedAlertes(allIds);
// //     }
// //   };

// //   const handleDeleteSelected = async () => {
// //     if (selectedAlertes.length === 0) {
// //       showMessage('error', 'Aucune alerte sélectionnée');
// //       return;
// //     }

// //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ?`)) {
// //       try {
// //         for (const id of selectedAlertes) {
// //           await alertesAPI.delete(id);
// //         }
        
// //         showMessage('success', `${selectedAlertes.length} alerte(s) supprimée(s) avec succès`);
// //         setSelectedAlertes([]);
// //         fetchAlertes();
// //       } catch (error: any) {
// //         showMessage('error', 'Erreur lors de la suppression des alertes');
// //       }
// //     }
// //   };

// //   const handleEditSelected = () => {
// //     if (selectedAlertes.length === 0) {
// //       showMessage('error', 'Aucune alerte sélectionnée');
// //       return;
// //     }

// //     if (selectedAlertes.length === 1) {
// //       const alerte = alertes.find(a => a.id === selectedAlertes[0]);
// //       if (alerte) {
// //         handleEdit(alerte);
// //       }
// //     } else {
// //       showMessage('info', `Édition multiple de ${selectedAlertes.length} alertes`);
// //     }
// //   };

// //   const handleTraiterSelected = async () => {
// //     if (selectedAlertes.length === 0) {
// //       showMessage('error', 'Aucune alerte sélectionnée');
// //       return;
// //     }

// //     try {
// //       for (const id of selectedAlertes) {
// //         await alertesAPI.traiter(id);
// //       }
      
// //       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme traitées`);
// //       setSelectedAlertes([]);
// //       fetchAlertes();
// //     } catch (error: any) {
// //       showMessage('error', 'Erreur lors du traitement des alertes');
// //     }
// //   };

// //   const handleResoudreSelected = async () => {
// //     if (selectedAlertes.length === 0) {
// //       showMessage('error', 'Aucune alerte sélectionnée');
// //       return;
// //     }

// //     try {
// //       for (const id of selectedAlertes) {
// //         await alertesAPI.update(id, { statut: 'resolue' });
// //       }
      
// //       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme résolues`);
// //       setSelectedAlertes([]);
// //       fetchAlertes();
// //     } catch (error: any) {
// //       showMessage('error', 'Erreur lors de la résolution des alertes');
// //     }
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
// //       try {
// //         await alertesAPI.delete(id);
// //         showMessage('success', 'Alerte supprimée avec succès');
// //         fetchAlertes();
// //       } catch (error: any) {
// //         showMessage('error', 'Erreur lors de la suppression');
// //       }
// //     }
// //   };

// //   const handleTraiter = async (id: number) => {
// //     try {
// //       await alertesAPI.traiter(id);
// //       showMessage('success', 'Alerte marquée comme traitée');
// //       fetchAlertes();
// //     } catch (error: any) {
// //       showMessage('error', 'Erreur lors du traitement');
// //     }
// //   };

// //   const handleResoudre = async (id: number) => {
// //     try {
// //       await alertesAPI.update(id, { statut: 'resolue' });
// //       showMessage('success', 'Alerte marquée comme résolue');
// //       fetchAlertes();
// //     } catch (error: any) {
// //       showMessage('error', 'Erreur lors de la résolution');
// //     }
// //   };

// //   // Fonctions d'affichage
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

// //   const getSeveriteIcon = (severite: string) => {
// //     const icons = {
// //       critique: <AlertTriangle className="h-4 w-4" />,
// //       elevee: <AlertTriangle className="h-4 w-4" />,
// //       moyenne: <Bell className="h-4 w-4" />,
// //       basse: <Info className="h-4 w-4" />
// //     };
// //     return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
// //   };

// //   const getStatutBadge = (statut: string) => {
// //     const badges = {
// //       nouvelle: 'badge-error',
// //       en_traitement: 'badge-warning',
// //       resolue: 'badge-success'
// //     };
// //     return badges[statut as keyof typeof badges] || 'badge-neutral';
// //   };

// //   const getStatutText = (statut: string) => {
// //     const texts = {
// //       nouvelle: 'Nouvelle',
// //       en_traitement: 'En traitement',
// //       resolue: 'Résolue'
// //     };
// //     return texts[statut as keyof typeof texts] || statut;
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

// //   const resetFilters = () => {
// //     setSearchTerm('');
// //     setFilterSeverite('');
// //     setFilterStatut('');
// //     setFilterType('');
// //     setSelectedAlertes([]);
// //   };

// //   const handleExport = () => {
// //     try {
// //       const dataToExport = filteredAlertes.map(a => ({
// //         Type: getTypeText(a.type_alerte),
// //         Sévérité: getSeveriteText(a.severite),
// //         Statut: getStatutText(a.statut),
// //         Description: a.description,
// //         'Matériel source': a.materiel_nom || 'Non spécifié',
// //         'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée'
// //       }));

// //       const csvContent = [
// //         Object.keys(dataToExport[0] || {}).join(','),
// //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// //       ].join('\n');

// //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //       const link = document.createElement('a');
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', `alertes_${new Date().toISOString().split('T')[0]}.csv`);
// //       link.style.visibility = 'hidden';
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);

// //       showMessage('success', 'Export CSV réussi !');
// //     } catch (error) {
// //       showMessage('error', 'Erreur lors de l\'export');
// //     }
// //   };

// //   // Fonction pour obtenir la classe CSS du message
// //   const getAlertClass = (type: MessageType) => {
// //     switch (type) {
// //       case 'success': return 'alert-success';
// //       case 'error': return 'alert-error';
// //       case 'warning': return 'alert-warning';
// //       case 'info': return 'alert-info';
// //       default: return 'alert-info';
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-4">
// //           <span className="loading loading-spinner loading-lg text-primary"></span>
// //           <p className="text-base-content">Chargement des alertes...</p>
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
// //           <button className="btn btn-ghost btn-sm" onClick={fetchAlertes}>
// //             Réessayer
// //           </button>
// //         </div>
// //       )}

// //       {/* Messages d'information sur les données de relations */}
// //       {loadingRelations && (
// //         <div className="alert alert-info mb-4">
// //           <div className="flex items-center gap-2">
// //             <span className="loading loading-spinner loading-sm"></span>
// //             <span>Chargement des données de relations en cours...</span>
// //           </div>
// //         </div>
// //       )}

// //       {/* Avertissement si pas de données de relations */}
// //       {!loadingRelations && materiels.length === 0 && incidents.length === 0 && (
// //         <div className="alert alert-warning mb-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <span>⚠️ Aucune donnée de relation disponible. </span>
// //               <button 
// //                 onClick={fetchRelationsData}
// //                 className="btn btn-sm btn-outline ml-2"
// //               >
// //                 Recharger
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* En-tête */}
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Alertes</h1>
// //           <p className="text-base-content opacity-60 mt-1">
// //             {filteredAlertes.length} alerte(s) trouvée(s)
// //             {loadingRelations && ' - Chargement des données...'}
// //             {!loadingRelations && (
// //               <span className="text-sm ml-2">
// //                 (📦 {materiels.length} mat. | ⚠️ {incidents.length} inc.)
// //               </span>
// //             )}
// //           </p>
// //         </div>
// //         <div className="flex gap-2">
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
// //             Nouvelle alerte
// //           </button>
// //         </div>
// //       </div>

// //       {/* Section Statistiques */}
// //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
// //         {/* Carte Total */}
// //         <div className="card bg-base-200 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
// //             <h3 className="text-lg font-bold">{statistiques.total}</h3>
// //             <p className="text-sm opacity-60">Total</p>
// //           </div>
// //         </div>

// //         {/* Carte Nouvelles */}
// //         <div className="card bg-error/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <Bell className="h-6 w-6 text-error mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-error">{statistiques.nouvelles}</h3>
// //             <p className="text-sm opacity-60">Nouvelles</p>
// //           </div>
// //         </div>

// //         {/* Carte En traitement */}
// //         <div className="card bg-warning/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-warning">{statistiques.enTraitement}</h3>
// //             <p className="text-sm opacity-60">En traitement</p>
// //           </div>
// //         </div>

// //         {/* Carte Résolues */}
// //         <div className="card bg-success/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-success">{statistiques.resolues}</h3>
// //             <p className="text-sm opacity-60">Résolues</p>
// //           </div>
// //         </div>

// //         {/* Carte Critiques */}
// //         <div className="card bg-error/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <AlertTriangle className="h-6 w-6 text-error mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-error">{statistiques.critiques}</h3>
// //             <p className="text-sm opacity-60">Critiques</p>
// //           </div>
// //         </div>

// //         {/* Carte Élevées */}
// //         <div className="card bg-warning/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-warning">{statistiques.elevees}</h3>
// //             <p className="text-sm opacity-60">Élevées</p>
// //           </div>
// //         </div>

// //         {/* Carte Moyennes */}
// //         <div className="card bg-info/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <Bell className="h-6 w-6 text-info mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-info">{statistiques.moyennes}</h3>
// //             <p className="text-sm opacity-60">Moyennes</p>
// //           </div>
// //         </div>

// //         {/* Carte Basses */}
// //         <div className="card bg-success/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <Info className="h-6 w-6 text-success mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-success">{statistiques.basses}</h3>
// //             <p className="text-sm opacity-60">Basses</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Filtres et recherche */}
// //       <div className="card bg-base-200 shadow-xl mb-6">
// //         <div className="card-body">
// //           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔍 Rechercher</span>
// //               </label>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// //                 <input
// //                   type="text"
// //                   placeholder="Description, matériel..."
// //                   className="input input-bordered w-full pl-10 bg-base-100"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">📊 Sévérité</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterSeverite}
// //                 onChange={(e) => setFilterSeverite(e.target.value)}
// //               >
// //                 <option value="">Toutes les sévérités</option>
// //                 <option value="critique">Critique</option>
// //                 <option value="elevee">Élevée</option>
// //                 <option value="moyenne">Moyenne</option>
// //                 <option value="basse">Basse</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">📈 Statut</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterStatut}
// //                 onChange={(e) => setFilterStatut(e.target.value)}
// //               >
// //                 <option value="">Tous les statuts</option>
// //                 <option value="nouvelle">Nouvelle</option>
// //                 <option value="en_traitement">En traitement</option>
// //                 <option value="resolue">Résolue</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔧 Type</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterType}
// //                 onChange={(e) => setFilterType(e.target.value)}
// //               >
// //                 <option value="">Tous les types</option>
// //                 <option value="securite">Sécurité</option>
// //                 <option value="performance">Performance</option>
// //                 <option value="panne">Panne</option>
// //                 <option value="maintenance">Maintenance</option>
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
// //           {selectedAlertes.length > 0 && (
// //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-4">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// //                     <span className="font-semibold text-primary text-lg">
// //                       {selectedAlertes.length} alerte(s) sélectionnée(s)
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={handleTraiterSelected}
// //                     className="btn btn-warning btn-sm gap-2"
// //                   >
// //                     <Bell className="h-4 w-4" />
// //                     Traiter ({selectedAlertes.length})
// //                   </button>
// //                   <button
// //                     onClick={handleResoudreSelected}
// //                     className="btn btn-success btn-sm gap-2"
// //                   >
// //                     <CheckCircle className="h-4 w-4" />
// //                     Résoudre ({selectedAlertes.length})
// //                   </button>
// //                   <button
// //                     onClick={handleEditSelected}
// //                     className="btn btn-primary btn-sm gap-2"
// //                   >
// //                     <Edit className="h-4 w-4" />
// //                     Modifier ({selectedAlertes.length})
// //                   </button>
// //                   <button
// //                     onClick={handleDeleteSelected}
// //                     className="btn btn-outline btn-error btn-sm gap-2"
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                     Supprimer ({selectedAlertes.length})
// //                   </button>
// //                   <button
// //                     onClick={() => setSelectedAlertes([])}
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

// //       {/* Tableau des alertes */}
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
// //                   <th className="font-bold">Type alerte</th>
// //                   <th className="font-bold">Sévérité</th>
// //                   <th className="font-bold">Statut</th>
// //                   <th className="font-bold">Description</th>
// //                   <th className="font-bold">Source</th>
// //                   <th className="font-bold">Date alerte</th>
// //                   <th className="font-bold text-center">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {safeArray(filteredAlertes).map((alerte) => (
// //                   <tr key={alerte.id} className="hover">
// //                     <td className="text-center">
// //                       <div className="flex justify-center">
// //                         <input
// //                           type="checkbox"
// //                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
// //                           checked={selectedAlertes.includes(alerte.id)}
// //                           onChange={() => toggleSelectAlerte(alerte.id)}
// //                         />
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className="font-medium">
// //                         {getTypeText(alerte.type_alerte)}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className={`badge ${getSeveriteBadge(alerte.severite)} badge-lg gap-1`}>
// //                         {getSeveriteIcon(alerte.severite)}
// //                         {getSeveriteText(alerte.severite)}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className={`badge ${getStatutBadge(alerte.statut)} badge-lg`}>
// //                         {getStatutText(alerte.statut)}
// //                       </div>
// //                     </td>
// //                     <td className="max-w-xs">
// //                       <div className="line-clamp-2 text-sm">
// //                         {alerte.description}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className="text-sm">
// //                         {alerte.materiel_nom && (
// //                           <div>🖥️ {alerte.materiel_nom}</div>
// //                         )}
// //                         {!alerte.materiel_nom && (
// //                           <span className="text-base-content opacity-50">-</span>
// //                         )}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <span className="text-sm">
// //                         {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : '-'}
// //                       </span>
// //                     </td>
// //                     <td>
// //                       <div className="flex justify-center space-x-1">
// //                         <button
// //                           className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
// //                           title="Voir les détails"
// //                         >
// //                           <Eye className="h-4 w-4" />
// //                         </button>
                        
// //                         {alerte.statut === 'nouvelle' && (
// //                           <button
// //                             onClick={() => handleTraiter(alerte.id)}
// //                             className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
// //                             title="Marquer en traitement"
// //                           >
// //                             <Bell className="h-4 w-4" />
// //                           </button>
// //                         )}
                        
// //                         {alerte.statut !== 'resolue' && (
// //                           <button
// //                             onClick={() => handleResoudre(alerte.id)}
// //                             className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
// //                             title="Marquer comme résolue"
// //                           >
// //                             <CheckCircle className="h-4 w-4" />
// //                           </button>
// //                         )}
                        
// //                         <button
// //                           onClick={() => handleEdit(alerte)}
// //                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
// //                           title="Modifier"
// //                         >
// //                           <Edit className="h-4 w-4" />
// //                         </button>
                        
// //                         <button
// //                           onClick={() => handleDelete(alerte.id)}
// //                           className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
// //                           title="Supprimer"
// //                         >
// //                           <Trash2 className="h-4 w-4" />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {safeArray(filteredAlertes).length === 0 && (
// //             <div className="text-center py-12">
// //               <div className="text-base-content opacity-40 mb-4">
// //                 <Bell className="h-16 w-16 mx-auto mb-4" />
// //                 <p className="text-lg font-medium">Aucune alerte trouvée</p>
// //                 <p className="text-sm mt-2">
// //                   {searchTerm || filterSeverite || filterStatut || filterType
// //                     ? "Essayez de modifier vos critères de recherche" 
// //                     : "Aucune alerte n'est enregistrée dans le système"
// //                   }
// //                 </p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Formulaire d'alerte */}
// //       <AlerteForm
// //         isOpen={isFormOpen}
// //         onClose={() => {
// //           setIsFormOpen(false);
// //           setEditingAlerte(undefined);
// //         }}
// //         onSubmit={handleSubmit}
// //         alerte={editingAlerte}
// //         materiels={materiels}
// //         incidents={incidents}
// //       />
// //     </div>
// //   );
// // };

// // export default Alertes;



// // kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk


// // // src/pages/Alertes.jsx - VERSION AVEC BOUTON "CRÉER INCIDENT"
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Plus, Search, Eye, Filter, Download, Edit, Trash2, 
// //   Bell, AlertTriangle, Info, CheckCircle, CheckSquare, 
// //   Square, X, BarChart3, AlertCircle 
// // } from 'lucide-react';
// // import { Alerte } from '../types';
// // import AlerteForm from '../components/AlerteForm';
// // import IncidentForm from '../components/IncidentForm'; // IMPORT AJOUTÉ
// // import { 
// //   alertesAPI, 
// //   materielsAPI, 
// //   incidentsAPI 
// // } from '../services/api';

// // // Fonctions helper pour la sécurité des tableaux
// // const safeArray = (data: any): Alerte[] => {
// //   return Array.isArray(data) ? data : [];
// // };

// // const safeFilter = (array: any[], condition: (item: any) => boolean): Alerte[] => {
// //   if (!Array.isArray(array)) return [];
// //   return array.filter(condition);
// // };

// // const extractDataFromResponse = (response: any): Alerte[] => {
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

// // // Définir le type pour les messages
// // type MessageType = 'success' | 'error' | 'info' | 'warning';

// // const Alertes: React.FC = () => {
// //   const [alertes, setAlertes] = useState<Alerte[]>([]);
// //   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string>('');
// //   const [searchTerm, setSearchTerm] = useState<string>('');
// //   const [filterSeverite, setFilterSeverite] = useState<string>('');
// //   const [filterStatut, setFilterStatut] = useState<string>('');
// //   const [filterType, setFilterType] = useState<string>('');
// //   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false); // NOUVEAU ÉTAT
// //   const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
// //   const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
// //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
// //   const [selectedAlerteForIncident, setSelectedAlerteForIncident] = useState<Alerte | null>(null); // NOUVEAU ÉTAT

// //   // ÉTAT POUR LES DONNÉES DE RELATIONS DISPONIBLES
// //   const [materiels, setMateriels] = useState<any[]>([]);
// //   const [incidents, setIncidents] = useState<any[]>([]);
// //   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

// //   // Statistiques
// //   const [statistiques, setStatistiques] = useState({
// //     total: 0,
// //     nouvelles: 0,
// //     enTraitement: 0,
// //     resolues: 0,
// //     critiques: 0,
// //     elevees: 0,
// //     moyennes: 0,
// //     basses: 0
// //   });

// //   // Charger les alertes
// //   const fetchAlertes = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       console.log('🔄 Chargement des alertes...');
      
// //       const response = await alertesAPI.getAll();
// //       console.log('✅ Réponse alertes:', response);
      
// //       const extractedData = extractDataFromResponse(response);
// //       console.log('🚨 Alertes chargées:', extractedData);
// //       setAlertes(extractedData);
      
// //       // Calculer les statistiques
// //       calculerStatistiques(extractedData);
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement alertes:', err);
// //       const errorMessage = err.response?.data?.message || 
// //                           err.message || 
// //                           'Erreur lors du chargement des alertes';
// //       setError(errorMessage);
// //       showMessage('error', errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Fonction pour calculer les statistiques
// //   const calculerStatistiques = (data: Alerte[]) => {
// //     const stats = {
// //       total: data.length,
// //       nouvelles: data.filter(a => a.statut === 'nouvelle').length,
// //       enTraitement: data.filter(a => a.statut === 'en_traitement').length,
// //       resolues: data.filter(a => a.statut === 'resolue').length,
// //       critiques: data.filter(a => a.severite === 'critique').length,
// //       elevees: data.filter(a => a.severite === 'elevee').length,
// //       moyennes: data.filter(a => a.severite === 'moyenne').length,
// //       basses: data.filter(a => a.severite === 'basse').length
// //     };
// //     setStatistiques(stats);
// //   };

// //   // Charger les données de relations disponibles
// //   const fetchRelationsData = async () => {
// //     try {
// //       setLoadingRelations(true);
// //       console.log('🔄 Chargement des données de relations...');

// //       // Utiliser Promise.allSettled pour gérer les erreurs individuelles
// //       const [materielsResponse, incidentsResponse] = await Promise.allSettled([
// //         materielsAPI.getAll().catch(err => ({ data: [] })),
// //         incidentsAPI.getAll().catch(err => ({ data: [] }))
// //       ]);

// //       // Extraire les données avec gestion d'erreur
// //       const materielsData = materielsResponse.status === 'fulfilled' 
// //         ? extractDataFromResponse(materielsResponse.value) 
// //         : [];
      
// //       const incidentsData = incidentsResponse.status === 'fulfilled' 
// //         ? extractDataFromResponse(incidentsResponse.value) 
// //         : [];

// //       console.log('✅ Données de relations chargées:', {
// //         materiels: materielsData.length,
// //         incidents: incidentsData.length
// //       });

// //       setMateriels(materielsData);
// //       setIncidents(incidentsData);

// //       // Afficher un message si certaines données sont vides
// //       const totalData = materielsData.length + incidentsData.length;
// //       if (totalData === 0) {
// //         showMessage('warning', 'Aucune donnée de relation disponible. Vérifiez votre connexion.');
// //       }

// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement relations:', err);
// //       const errorMessage = err.response?.data?.message || 
// //                           err.message || 
// //                           'Erreur lors du chargement des données';
// //       showMessage('error', errorMessage);
      
// //       // Initialiser avec des tableaux vides
// //       setMateriels([]);
// //       setIncidents([]);
// //     } finally {
// //       setLoadingRelations(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAlertes();
// //     fetchRelationsData();
// //   }, []);

// //   useEffect(() => {
// //     filterAlertes();
// //   }, [alertes, searchTerm, filterSeverite, filterStatut, filterType]);

// //   useEffect(() => {
// //     if (filteredAlertes.length > 0 && selectedAlertes.length === filteredAlertes.length) {
// //       setIsSelectAll(true);
// //     } else {
// //       setIsSelectAll(false);
// //     }
// //   }, [selectedAlertes, filteredAlertes]);

// //   const filterAlertes = () => {
// //     let filtered = safeArray(alertes);

// //     if (searchTerm) {
// //       filtered = safeFilter(filtered, a => 
// //         a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchTerm.toLowerCase()))
// //       );
// //     }

// //     if (filterSeverite) {
// //       filtered = safeFilter(filtered, a => a.severite === filterSeverite);
// //     }

// //     if (filterStatut) {
// //       filtered = safeFilter(filtered, a => a.statut === filterStatut);
// //     }

// //     if (filterType) {
// //       filtered = safeFilter(filtered, a => a.type_alerte === filterType);
// //     }

// //     setFilteredAlertes(filtered);
// //     setSelectedAlertes([]);
// //   };

// //   const showMessage = (type: MessageType, text: string) => {
// //     setMessage({ type, text });
// //     setTimeout(() => setMessage(null), 5000);
// //   };

// //   // Gestion des alertes
// //   const handleSubmit = async (alerteData: any) => {
// //     try {
// //       console.log('📤 Soumission des données alerte:', alerteData);
      
// //       if (editingAlerte) {
// //         await alertesAPI.update(editingAlerte.id, alerteData);
// //         showMessage('success', 'Alerte modifiée avec succès');
// //       } else {
// //         await alertesAPI.create(alerteData);
// //         showMessage('success', 'Alerte créée avec succès');
// //       }
      
// //       await fetchAlertes();
// //       setIsFormOpen(false);
// //       setEditingAlerte(undefined);
// //     } catch (error: any) {
// //       console.error('❌ Erreur sauvegarde alerte:', error);
// //       const errorMessage = error.response?.data?.message || 
// //                           error.message || 
// //                           'Erreur lors de la sauvegarde';
// //       showMessage('error', errorMessage);
// //     }
// //   };

// //   // Gestion des incidents
// //   const handleCreateIncident = async (incidentData: any) => {
// //     try {
// //       console.log('📤 Création incident depuis alerte:', incidentData);
      
// //       // Appeler l'API pour créer l'incident
// //       const response = await incidentsAPI.create(incidentData);
      
// //       // Si l'incident a été créé avec succès, mettre à jour l'alerte
// //       if (selectedAlerteForIncident) {
// //         try {
// //           // Marquer l'alerte comme liée à un incident
// //           await alertesAPI.update(selectedAlerteForIncident.id, {
// //             ...selectedAlerteForIncident,
// //             incident_associe_id: response.data.id || response.data.id,
// //             statut: 'en_traitement' // Mettre à jour le statut
// //           });
          
// //           showMessage('success', 'Incident créé avec succès et alerte mise à jour');
// //         } catch (updateError) {
// //           console.error('❌ Erreur mise à jour alerte:', updateError);
// //           showMessage('warning', 'Incident créé mais erreur lors de la mise à jour de l\'alerte');
// //         }
// //       } else {
// //         showMessage('success', 'Incident créé avec succès');
// //       }
      
// //       // Recharger les données
// //       await fetchAlertes();
// //       setIsIncidentFormOpen(false);
// //       setSelectedAlerteForIncident(null);
      
// //     } catch (error: any) {
// //       console.error('❌ Erreur création incident:', error);
// //       const errorMessage = error.response?.data?.message || 
// //                           error.message || 
// //                           'Erreur lors de la création de l\'incident';
// //       showMessage('error', errorMessage);
// //     }
// //   };

// //   // Fonction pour ouvrir le formulaire d'incident depuis une alerte
// //   const openIncidentFormFromAlerte = (alerte: Alerte) => {
// //     // Vérifier si l'alerte peut créer un incident
// //     const canCreateIncident = alerte.severite === 'critique' && 
// //                              (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
    
// //     if (!canCreateIncident) {
// //       showMessage('warning', 'Seules les alertes critiques (nouvelle ou en traitement) peuvent créer des incidents');
// //       return;
// //     }
    
// //     // Vérifier si l'alerte a déjà un incident
// //     if (alerte.incident_associe_id) {
// //       showMessage('info', 'Cette alerte a déjà un incident associé');
// //       return;
// //     }
    
// //     console.log('🚨 Ouverture formulaire incident depuis alerte:', alerte);
// //     setSelectedAlerteForIncident(alerte);
// //     setIsIncidentFormOpen(true);
// //   };

// //   const handleAddNew = () => {
// //     if (loadingRelations) {
// //       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
// //       return;
// //     }
    
// //     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
// //     if (!hasRelationsData) {
// //       showMessage('warning', 
// //         `Aucune donnée de relation disponible. 
// //         Matériels: ${materiels.length} | 
// //         Incidents: ${incidents.length}`
// //       );
      
// //       if (confirm('Voulez-vous recharger les données ?')) {
// //         fetchRelationsData();
// //       }
      
// //       return;
// //     }

// //     console.log('✅ Données disponibles pour nouvelle alerte:', {
// //       materiels: materiels.length,
// //       incidents: incidents.length
// //     });

// //     setEditingAlerte(undefined);
// //     setIsFormOpen(true);
// //   };

// //   const handleEdit = (alerte: Alerte) => {
// //     if (loadingRelations) {
// //       showMessage('info', 'Chargement des données en cours...');
// //       return;
// //     }

// //     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
// //     if (!hasRelationsData) {
// //       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
// //       return;
// //     }

// //     setEditingAlerte(alerte);
// //     setIsFormOpen(true);
// //   };

// //   // Fonctions de sélection
// //   const toggleSelectAlerte = (id: number) => {
// //     setSelectedAlertes(prev => 
// //       prev.includes(id) 
// //         ? prev.filter(item => item !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   const toggleSelectAll = () => {
// //     if (isSelectAll) {
// //       setSelectedAlertes([]);
// //     } else {
// //       const allIds = filteredAlertes.map(a => a.id);
// //       setSelectedAlertes(allIds);
// //     }
// //   };

// //   const handleDeleteSelected = async () => {
// //     if (selectedAlertes.length === 0) {
// //       showMessage('error', 'Aucune alerte sélectionnée');
// //       return;
// //     }

// //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ?`)) {
// //       try {
// //         for (const id of selectedAlertes) {
// //           await alertesAPI.delete(id);
// //         }
        
// //         showMessage('success', `${selectedAlertes.length} alerte(s) supprimée(s) avec succès`);
// //         setSelectedAlertes([]);
// //         fetchAlertes();
// //       } catch (error: any) {
// //         showMessage('error', 'Erreur lors de la suppression des alertes');
// //       }
// //     }
// //   };

// //   const handleEditSelected = () => {
// //     if (selectedAlertes.length === 0) {
// //       showMessage('error', 'Aucune alerte sélectionnée');
// //       return;
// //     }

// //     if (selectedAlertes.length === 1) {
// //       const alerte = alertes.find(a => a.id === selectedAlertes[0]);
// //       if (alerte) {
// //         handleEdit(alerte);
// //       }
// //     } else {
// //       showMessage('info', `Édition multiple de ${selectedAlertes.length} alertes`);
// //     }
// //   };

// //   const handleTraiterSelected = async () => {
// //     if (selectedAlertes.length === 0) {
// //       showMessage('error', 'Aucune alerte sélectionnée');
// //       return;
// //     }

// //     try {
// //       for (const id of selectedAlertes) {
// //         await alertesAPI.update(id, { statut: 'en_traitement' });
// //       }
      
// //       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme traitées`);
// //       setSelectedAlertes([]);
// //       fetchAlertes();
// //     } catch (error: any) {
// //       showMessage('error', 'Erreur lors du traitement des alertes');
// //     }
// //   };

// //   const handleResoudreSelected = async () => {
// //     if (selectedAlertes.length === 0) {
// //       showMessage('error', 'Aucune alerte sélectionnée');
// //       return;
// //     }

// //     try {
// //       for (const id of selectedAlertes) {
// //         await alertesAPI.update(id, { statut: 'resolue' });
// //       }
      
// //       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme résolues`);
// //       setSelectedAlertes([]);
// //       fetchAlertes();
// //     } catch (error: any) {
// //       showMessage('error', 'Erreur lors de la résolution des alertes');
// //     }
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
// //       try {
// //         await alertesAPI.delete(id);
// //         showMessage('success', 'Alerte supprimée avec succès');
// //         fetchAlertes();
// //       } catch (error: any) {
// //         showMessage('error', 'Erreur lors de la suppression');
// //       }
// //     }
// //   };

// //   const handleTraiter = async (id: number) => {
// //     try {
// //       await alertesAPI.update(id, { statut: 'en_traitement' });
// //       showMessage('success', 'Alerte marquée comme traitée');
// //       fetchAlertes();
// //     } catch (error: any) {
// //       showMessage('error', 'Erreur lors du traitement');
// //     }
// //   };

// //   const handleResoudre = async (id: number) => {
// //     try {
// //       await alertesAPI.update(id, { statut: 'resolue' });
// //       showMessage('success', 'Alerte marquée comme résolue');
// //       fetchAlertes();
// //     } catch (error: any) {
// //       showMessage('error', 'Erreur lors de la résolution');
// //     }
// //   };

// //   // Fonctions d'affichage
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

// //   const getSeveriteIcon = (severite: string) => {
// //     const icons = {
// //       critique: <AlertTriangle className="h-4 w-4" />,
// //       elevee: <AlertTriangle className="h-4 w-4" />,
// //       moyenne: <Bell className="h-4 w-4" />,
// //       basse: <Info className="h-4 w-4" />
// //     };
// //     return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
// //   };

// //   const getStatutBadge = (statut: string) => {
// //     const badges = {
// //       nouvelle: 'badge-error',
// //       en_traitement: 'badge-warning',
// //       resolue: 'badge-success'
// //     };
// //     return badges[statut as keyof typeof badges] || 'badge-neutral';
// //   };

// //   const getStatutText = (statut: string) => {
// //     const texts = {
// //       nouvelle: 'Nouvelle',
// //       en_traitement: 'En traitement',
// //       resolue: 'Résolue'
// //     };
// //     return texts[statut as keyof typeof texts] || statut;
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

// //   const resetFilters = () => {
// //     setSearchTerm('');
// //     setFilterSeverite('');
// //     setFilterStatut('');
// //     setFilterType('');
// //     setSelectedAlertes([]);
// //   };

// //   const handleExport = () => {
// //     try {
// //       const dataToExport = filteredAlertes.map(a => ({
// //         Type: getTypeText(a.type_alerte),
// //         Sévérité: getSeveriteText(a.severite),
// //         Statut: getStatutText(a.statut),
// //         Description: a.description,
// //         'Matériel source': a.materiel_nom || 'Non spécifié',
// //         'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée'
// //       }));

// //       const csvContent = [
// //         Object.keys(dataToExport[0] || {}).join(','),
// //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// //       ].join('\n');

// //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //       const link = document.createElement('a');
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', `alertes_${new Date().toISOString().split('T')[0]}.csv`);
// //       link.style.visibility = 'hidden';
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);

// //       showMessage('success', 'Export CSV réussi !');
// //     } catch (error) {
// //       showMessage('error', 'Erreur lors de l\'export');
// //     }
// //   };

// //   // Fonction pour obtenir la classe CSS du message
// //   const getAlertClass = (type: MessageType) => {
// //     switch (type) {
// //       case 'success': return 'alert-success';
// //       case 'error': return 'alert-error';
// //       case 'warning': return 'alert-warning';
// //       case 'info': return 'alert-info';
// //       default: return 'alert-info';
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-4">
// //           <span className="loading loading-spinner loading-lg text-primary"></span>
// //           <p className="text-base-content">Chargement des alertes...</p>
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
// //           <button className="btn btn-ghost btn-sm" onClick={fetchAlertes}>
// //             Réessayer
// //           </button>
// //         </div>
// //       )}

// //       {/* Messages d'information sur les données de relations */}
// //       {loadingRelations && (
// //         <div className="alert alert-info mb-4">
// //           <div className="flex items-center gap-2">
// //             <span className="loading loading-spinner loading-sm"></span>
// //             <span>Chargement des données de relations en cours...</span>
// //           </div>
// //         </div>
// //       )}

// //       {/* Avertissement si pas de données de relations */}
// //       {!loadingRelations && materiels.length === 0 && incidents.length === 0 && (
// //         <div className="alert alert-warning mb-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <span>⚠️ Aucune donnée de relation disponible. </span>
// //               <button 
// //                 onClick={fetchRelationsData}
// //                 className="btn btn-sm btn-outline ml-2"
// //               >
// //                 Recharger
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* En-tête */}
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Alertes</h1>
// //           <p className="text-base-content opacity-60 mt-1">
// //             {filteredAlertes.length} alerte(s) trouvée(s)
// //             {loadingRelations && ' - Chargement des données...'}
// //             {!loadingRelations && (
// //               <span className="text-sm ml-2">
// //                 (📦 {materiels.length} mat. | ⚠️ {incidents.length} inc.)
// //               </span>
// //             )}
// //           </p>
// //         </div>
// //         <div className="flex gap-2">
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
// //             Nouvelle alerte
// //           </button>
// //         </div>
// //       </div>

// //       {/* Section Statistiques */}
// //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
// //         {/* Carte Total */}
// //         <div className="card bg-base-200 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
// //             <h3 className="text-lg font-bold">{statistiques.total}</h3>
// //             <p className="text-sm opacity-60">Total</p>
// //           </div>
// //         </div>

// //         {/* Carte Nouvelles */}
// //         <div className="card bg-error/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <Bell className="h-6 w-6 text-error mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-error">{statistiques.nouvelles}</h3>
// //             <p className="text-sm opacity-60">Nouvelles</p>
// //           </div>
// //         </div>

// //         {/* Carte En traitement */}
// //         <div className="card bg-warning/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-warning">{statistiques.enTraitement}</h3>
// //             <p className="text-sm opacity-60">En traitement</p>
// //           </div>
// //         </div>

// //         {/* Carte Résolues */}
// //         <div className="card bg-success/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-success">{statistiques.resolues}</h3>
// //             <p className="text-sm opacity-60">Résolues</p>
// //           </div>
// //         </div>

// //         {/* Carte Critiques */}
// //         <div className="card bg-error/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <AlertTriangle className="h-6 w-6 text-error mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-error">{statistiques.critiques}</h3>
// //             <p className="text-sm opacity-60">Critiques</p>
// //           </div>
// //         </div>

// //         {/* Carte Élevées */}
// //         <div className="card bg-warning/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-warning">{statistiques.elevees}</h3>
// //             <p className="text-sm opacity-60">Élevées</p>
// //           </div>
// //         </div>

// //         {/* Carte Moyennes */}
// //         <div className="card bg-info/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <Bell className="h-6 w-6 text-info mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-info">{statistiques.moyennes}</h3>
// //             <p className="text-sm opacity-60">Moyennes</p>
// //           </div>
// //         </div>

// //         {/* Carte Basses */}
// //         <div className="card bg-success/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <Info className="h-6 w-6 text-success mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-success">{statistiques.basses}</h3>
// //             <p className="text-sm opacity-60">Basses</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Filtres et recherche */}
// //       <div className="card bg-base-200 shadow-xl mb-6">
// //         <div className="card-body">
// //           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔍 Rechercher</span>
// //               </label>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// //                 <input
// //                   type="text"
// //                   placeholder="Description, matériel..."
// //                   className="input input-bordered w-full pl-10 bg-base-100"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">📊 Sévérité</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterSeverite}
// //                 onChange={(e) => setFilterSeverite(e.target.value)}
// //               >
// //                 <option value="">Toutes les sévérités</option>
// //                 <option value="critique">Critique</option>
// //                 <option value="elevee">Élevée</option>
// //                 <option value="moyenne">Moyenne</option>
// //                 <option value="basse">Basse</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">📈 Statut</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterStatut}
// //                 onChange={(e) => setFilterStatut(e.target.value)}
// //               >
// //                 <option value="">Tous les statuts</option>
// //                 <option value="nouvelle">Nouvelle</option>
// //                 <option value="en_traitement">En traitement</option>
// //                 <option value="resolue">Résolue</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔧 Type</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterType}
// //                 onChange={(e) => setFilterType(e.target.value)}
// //               >
// //                 <option value="">Tous les types</option>
// //                 <option value="securite">Sécurité</option>
// //                 <option value="performance">Performance</option>
// //                 <option value="panne">Panne</option>
// //                 <option value="maintenance">Maintenance</option>
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
// //           {selectedAlertes.length > 0 && (
// //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-4">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// //                     <span className="font-semibold text-primary text-lg">
// //                       {selectedAlertes.length} alerte(s) sélectionnée(s)
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={handleTraiterSelected}
// //                     className="btn btn-warning btn-sm gap-2"
// //                   >
// //                     <Bell className="h-4 w-4" />
// //                     Traiter ({selectedAlertes.length})
// //                   </button>
// //                   <button
// //                     onClick={handleResoudreSelected}
// //                     className="btn btn-success btn-sm gap-2"
// //                   >
// //                     <CheckCircle className="h-4 w-4" />
// //                     Résoudre ({selectedAlertes.length})
// //                   </button>
// //                   <button
// //                     onClick={handleEditSelected}
// //                     className="btn btn-primary btn-sm gap-2"
// //                   >
// //                     <Edit className="h-4 w-4" />
// //                     Modifier ({selectedAlertes.length})
// //                   </button>
// //                   <button
// //                     onClick={handleDeleteSelected}
// //                     className="btn btn-outline btn-error btn-sm gap-2"
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                     Supprimer ({selectedAlertes.length})
// //                   </button>
// //                   <button
// //                     onClick={() => setSelectedAlertes([])}
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

// //       {/* Tableau des alertes */}
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
// //                   <th className="font-bold">Type alerte</th>
// //                   <th className="font-bold">Sévérité</th>
// //                   <th className="font-bold">Statut</th>
// //                   <th className="font-bold">Description</th>
// //                   <th className="font-bold">Source</th>
// //                   <th className="font-bold">Date alerte</th>
// //                   <th className="font-bold text-center">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {safeArray(filteredAlertes).map((alerte) => {
// //                   // Vérifier si cette alerte peut créer un incident
// //                   const canCreateIncident = alerte.severite === 'critique' && 
// //                                            (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement') &&
// //                                            !alerte.incident_associe_id;
                  
// //                   return (
// //                     <tr key={alerte.id} className="hover">
// //                       <td className="text-center">
// //                         <div className="flex justify-center">
// //                           <input
// //                             type="checkbox"
// //                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
// //                             checked={selectedAlertes.includes(alerte.id)}
// //                             onChange={() => toggleSelectAlerte(alerte.id)}
// //                           />
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className="font-medium">
// //                           {getTypeText(alerte.type_alerte)}
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className={`badge ${getSeveriteBadge(alerte.severite)} badge-lg gap-1`}>
// //                           {getSeveriteIcon(alerte.severite)}
// //                           {getSeveriteText(alerte.severite)}
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className={`badge ${getStatutBadge(alerte.statut)} badge-lg`}>
// //                           {getStatutText(alerte.statut)}
// //                         </div>
// //                       </td>
// //                       <td className="max-w-xs">
// //                         <div className="line-clamp-2 text-sm">
// //                           {alerte.description}
// //                           {alerte.incident_associe_id && (
// //                             <span className="ml-2 text-xs text-info">
// //                               (Incident #{alerte.incident_associe_id})
// //                             </span>
// //                           )}
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className="text-sm">
// //                           {alerte.materiel_nom && (
// //                             <div>🖥️ {alerte.materiel_nom}</div>
// //                           )}
// //                           {!alerte.materiel_nom && (
// //                             <span className="text-base-content opacity-50">-</span>
// //                           )}
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <span className="text-sm">
// //                           {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : '-'}
// //                         </span>
// //                       </td>
// //                       <td>
// //                         <div className="flex justify-center space-x-1">
// //                           <button
// //                             className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
// //                             title="Voir les détails"
// //                           >
// //                             <Eye className="h-4 w-4" />
// //                           </button>
                          
// //                           {/* BOUTON "CRÉER INCIDENT" - SCÉNARIO 2 */}
// //                           {canCreateIncident && (
// //                             <button
// //                               onClick={() => openIncidentFormFromAlerte(alerte)}
// //                               className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
// //                               title="Créer un incident depuis cette alerte"
// //                             >
// //                               <AlertCircle className="h-4 w-4" />
// //                             </button>
// //                           )}
                          
// //                           {alerte.statut === 'nouvelle' && (
// //                             <button
// //                               onClick={() => handleTraiter(alerte.id)}
// //                               className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
// //                               title="Marquer en traitement"
// //                             >
// //                               <Bell className="h-4 w-4" />
// //                             </button>
// //                           )}
                          
// //                           {alerte.statut !== 'resolue' && (
// //                             <button
// //                               onClick={() => handleResoudre(alerte.id)}
// //                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
// //                               title="Marquer comme résolue"
// //                             >
// //                               <CheckCircle className="h-4 w-4" />
// //                             </button>
// //                           )}
                          
// //                           <button
// //                             onClick={() => handleEdit(alerte)}
// //                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
// //                             title="Modifier"
// //                           >
// //                             <Edit className="h-4 w-4" />
// //                           </button>
                          
// //                           <button
// //                             onClick={() => handleDelete(alerte.id)}
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

// //           {safeArray(filteredAlertes).length === 0 && (
// //             <div className="text-center py-12">
// //               <div className="text-base-content opacity-40 mb-4">
// //                 <Bell className="h-16 w-16 mx-auto mb-4" />
// //                 <p className="text-lg font-medium">Aucune alerte trouvée</p>
// //                 <p className="text-sm mt-2">
// //                   {searchTerm || filterSeverite || filterStatut || filterType
// //                     ? "Essayez de modifier vos critères de recherche" 
// //                     : "Aucune alerte n'est enregistrée dans le système"
// //                   }
// //                 </p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Formulaire d'alerte */}
// //       <AlerteForm
// //         isOpen={isFormOpen}
// //         onClose={() => {
// //           setIsFormOpen(false);
// //           setEditingAlerte(undefined);
// //         }}
// //         onSubmit={handleSubmit}
// //         alerte={editingAlerte}
// //         materiels={materiels}
// //         incidents={incidents}
// //       />

// //       {/* Formulaire d'incident - SCÉNARIO 2 */}
// //       <IncidentForm
// //         isOpen={isIncidentFormOpen}
// //         onClose={() => {
// //           setIsIncidentFormOpen(false);
// //           setSelectedAlerteForIncident(null);
// //         }}
// //         onSubmit={handleCreateIncident}
// //         currentUser={{
// //           id: 1, // À remplacer par l'utilisateur réel
// //           username: "admin",
// //           role: "admin"
// //         }}
// //         alerteSource={selectedAlerteForIncident || undefined}
// //       />
// //     </div>
// //   );
// // };

// // export default Alertes;






// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   Container,
// //   Typography,
// //   Paper,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Chip,
// //   IconButton,
// //   Tooltip,
// //   Button,
// //   Box,
// //   Alert,
// //   CircularProgress,
// //   Card,
// //   CardContent,
// //   Grid,
// //   TextField,
// //   MenuItem,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   Snackbar
// // } from '@mui/material';
// // import {
// //   Add as AddIcon,
// //   Edit as EditIcon,
// //   Delete as DeleteIcon,
// //   Visibility as ViewIcon,
// //   Refresh as RefreshIcon,
// //   Warning as WarningIcon,
// //   CheckCircle as CheckCircleIcon,
// //   Error as ErrorIcon,
// //   Info as InfoIcon
// // } from '@mui/icons-material';
// // import { format } from 'date-fns';
// // import { fr } from 'date-fns/locale';
// // import { alertesAPI } from '../services/api';
// // import { Alerte } from '../types';
// // import AlerteForm from '../components/AlerteForm';
// // import { useNotification } from '../context/NotificationContext';

// // const Alertes = () => {
// //   const [alertes, setAlertes] = useState<Alerte[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [openForm, setOpenForm] = useState(false);
// //   const [selectedAlerte, setSelectedAlerte] = useState<Alerte | null>(null);
// //   const [filter, setFilter] = useState<string>('all');
// //   const [search, setSearch] = useState('');
// //   const [refreshTrigger, setRefreshTrigger] = useState(0);
// //   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
// //   const [alerteToDelete, setAlerteToDelete] = useState<Alerte | null>(null);
  
// //   const { showNotification } = useNotification();

// //   const fetchAlertes = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       const response = await alertesAPI.getAll();
// //       const data = Array.isArray(response.data) ? response.data : [];
      
// //       console.log('📝 Action: Alertes chargées', { count: data.length });
// //       setAlertes(data);
      
// //     } catch (error: any) {
// //       console.error('❌ Erreur chargement alertes:', error);
// //       setError('Erreur lors du chargement des alertes');
// //       showNotification('Erreur lors du chargement des alertes', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [showNotification]);

// //   useEffect(() => {
// //     fetchAlertes();
// //   }, [fetchAlertes, refreshTrigger]);

// //   const handleAddNew = () => {
// //     setSelectedAlerte(null);
// //     setOpenForm(true);
// //   };

// //   const handleEdit = (alerte: Alerte) => {
// //     setSelectedAlerte(alerte);
// //     setOpenForm(true);
// //   };

// //   const handleView = (alerte: Alerte) => {
// //     setSelectedAlerte(alerte);
// //     // Ici, vous pouvez implémenter une modal de visualisation détaillée
// //     showNotification(`Détails de l'alerte: ${alerte.type}`, 'info');
// //   };

// //   const handleDeleteClick = (alerte: Alerte) => {
// //     setAlerteToDelete(alerte);
// //     setOpenDeleteDialog(true);
// //   };

// //   const handleDeleteConfirm = async () => {
// //     if (!alerteToDelete) return;
    
// //     try {
// //       await alertesAPI.delete(alerteToDelete.id);
// //       showNotification('Alerte supprimée avec succès', 'success');
// //       setRefreshTrigger(prev => prev + 1);
// //     } catch (error: any) {
// //       console.error('❌ Erreur suppression alerte:', error);
// //       showNotification('Erreur lors de la suppression de l\'alerte', 'error');
// //     } finally {
// //       setOpenDeleteDialog(false);
// //       setAlerteToDelete(null);
// //     }
// //   };

// //   const handleFormClose = () => {
// //     setOpenForm(false);
// //     setSelectedAlerte(null);
// //   };

// //   const handleFormSubmit = () => {
// //     setRefreshTrigger(prev => prev + 1);
// //     handleFormClose();
// //   };

// //   const getStatusColor = (status: string) => {
// //     switch (status.toLowerCase()) {
// //       case 'active':
// //       case 'en_cours':
// //         return 'warning';
// //       case 'resolved':
// //       case 'resolu':
// //         return 'success';
// //       case 'critical':
// //       case 'critique':
// //         return 'error';
// //       default:
// //         return 'default';
// //     }
// //   };

// //   const getTypeIcon = (type: string) => {
// //     switch (type.toLowerCase()) {
// //       case 'warning':
// //       case 'avertissement':
// //         return <WarningIcon />;
// //       case 'error':
// //       case 'erreur':
// //         return <ErrorIcon />;
// //       case 'info':
// //       case 'information':
// //         return <InfoIcon />;
// //       case 'success':
// //         return <CheckCircleIcon />;
// //       default:
// //         return <InfoIcon />;
// //     }
// //   };

// //   const filteredAlertes = alertes.filter(alerte => {
// //     if (filter !== 'all' && alerte.etat !== filter) {
// //       return false;
// //     }
// //     if (search) {
// //       const searchLower = search.toLowerCase();
// //       return (
// //         alerte.titre?.toLowerCase().includes(searchLower) ||
// //         alerte.description?.toLowerCase().includes(searchLower) ||
// //         alerte.type?.toLowerCase().includes(searchLower) ||
// //         alerte.source?.toLowerCase().includes(searchLower)
// //       );
// //     }
// //     return true;
// //   });

// //   const stats = {
// //     total: alertes.length,
// //     active: alertes.filter(a => a.etat === 'active' || a.etat === 'en_cours').length,
// //     critical: alertes.filter(a => a.type === 'critical' || a.type === 'critique').length,
// //     resolved: alertes.filter(a => a.etat === 'resolved' || a.etat === 'resolu').length
// //   };

// //   if (loading) {
// //     return (
// //       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
// //         <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
// //           <CircularProgress />
// //         </Box>
// //       </Container>
// //     );
// //   }

// //   return (
// //     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
// //       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
// //         <Typography variant="h4" component="h1" gutterBottom>
// //           Gestion des Alertes
// //         </Typography>
// //         <Box>
// //           <Button
// //             variant="contained"
// //             startIcon={<RefreshIcon />}
// //             onClick={() => setRefreshTrigger(prev => prev + 1)}
// //             sx={{ mr: 2 }}
// //           >
// //             Actualiser
// //           </Button>
// //           <Button
// //             variant="contained"
// //             color="primary"
// //             startIcon={<AddIcon />}
// //             onClick={handleAddNew}
// //           >
// //             Nouvelle Alerte
// //           </Button>
// //         </Box>
// //       </Box>

// //       {error && (
// //         <Alert severity="error" sx={{ mb: 3 }}>
// //           {error}
// //         </Alert>
// //       )}

// //       {/* Statistiques */}
// //       <Grid container spacing={3} sx={{ mb: 4 }}>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card>
// //             <CardContent>
// //               <Typography color="textSecondary" gutterBottom>
// //                 Total Alertes
// //               </Typography>
// //               <Typography variant="h4">
// //                 {stats.total}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card>
// //             <CardContent>
// //               <Typography color="textSecondary" gutterBottom>
// //                 En Cours
// //               </Typography>
// //               <Typography variant="h4" color="warning.main">
// //                 {stats.active}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card>
// //             <CardContent>
// //               <Typography color="textSecondary" gutterBottom>
// //                 Critiques
// //               </Typography>
// //               <Typography variant="h4" color="error.main">
// //                 {stats.critical}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card>
// //             <CardContent>
// //               <Typography color="textSecondary" gutterBottom>
// //                 Résolues
// //               </Typography>
// //               <Typography variant="h4" color="success.main">
// //                 {stats.resolved}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //       </Grid>

// //       {/* Filtres et recherche */}
// //       <Paper sx={{ p: 2, mb: 3 }}>
// //         <Grid container spacing={2} alignItems="center">
// //           <Grid item xs={12} sm={6} md={3}>
// //             <FormControl fullWidth size="small">
// //               <InputLabel>Filtrer par statut</InputLabel>
// //               <Select
// //                 value={filter}
// //                 label="Filtrer par statut"
// //                 onChange={(e) => setFilter(e.target.value)}
// //               >
// //                 <MenuItem value="all">Tous les statuts</MenuItem>
// //                 <MenuItem value="active">Actives</MenuItem>
// //                 <MenuItem value="en_cours">En cours</MenuItem>
// //                 <MenuItem value="resolved">Résolues</MenuItem>
// //                 <MenuItem value="critical">Critiques</MenuItem>
// //               </Select>
// //             </FormControl>
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={6}>
// //             <TextField
// //               fullWidth
// //               size="small"
// //               label="Rechercher..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               placeholder="Rechercher par titre, description, type..."
// //             />
// //           </Grid>
// //           <Grid item xs={12} md={3}>
// //             <Box display="flex" justifyContent="flex-end">
// //               <Typography variant="body2" color="textSecondary">
// //                 {filteredAlertes.length} alerte(s) trouvée(s)
// //               </Typography>
// //             </Box>
// //           </Grid>
// //         </Grid>
// //       </Paper>

// //       {/* Tableau des alertes */}
// //       <TableContainer component={Paper}>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Type</TableCell>
// //               <TableCell>Titre</TableCell>
// //               <TableCell>Description</TableCell>
// //               <TableCell>Source</TableCell>
// //               <TableCell>Statut</TableCell>
// //               <TableCell>Date</TableCell>
// //               <TableCell align="center">Actions</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {filteredAlertes.length === 0 ? (
// //               <TableRow>
// //                 <TableCell colSpan={7} align="center">
// //                   <Typography color="textSecondary" py={3}>
// //                     Aucune alerte trouvée
// //                   </Typography>
// //                 </TableCell>
// //               </TableRow>
// //             ) : (
// //               filteredAlertes.map((alerte) => (
// //                 <TableRow key={alerte.id} hover>
// //                   <TableCell>
// //                     <Tooltip title={alerte.type}>
// //                       <Box display="flex" alignItems="center">
// //                         {getTypeIcon(alerte.type)}
// //                         <Typography variant="body2" sx={{ ml: 1 }}>
// //                           {alerte.type}
// //                         </Typography>
// //                       </Box>
// //                     </Tooltip>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Typography variant="body2" fontWeight="medium">
// //                       {alerte.titre}
// //                     </Typography>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
// //                       {alerte.description}
// //                     </Typography>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Chip
// //                       label={alerte.source}
// //                       size="small"
// //                       variant="outlined"
// //                     />
// //                   </TableCell>
// //                   <TableCell>
// //                     <Chip
// //                       label={alerte.etat}
// //                       color={getStatusColor(alerte.etat) as any}
// //                       size="small"
// //                     />
// //                   </TableCell>
// //                   <TableCell>
// //                     <Typography variant="body2">
// //                       {format(new Date(alerte.date_creation), 'dd/MM/yyyy HH:mm', { locale: fr })}
// //                     </Typography>
// //                   </TableCell>
// //                   <TableCell align="center">
// //                     <Box display="flex" justifyContent="center" gap={1}>
// //                       <Tooltip title="Voir les détails">
// //                         <IconButton
// //                           size="small"
// //                           color="info"
// //                           onClick={() => handleView(alerte)}
// //                         >
// //                           <ViewIcon fontSize="small" />
// //                         </IconButton>
// //                       </Tooltip>
// //                       <Tooltip title="Modifier">
// //                         <IconButton
// //                           size="small"
// //                           color="primary"
// //                           onClick={() => handleEdit(alerte)}
// //                         >
// //                           <EditIcon fontSize="small" />
// //                         </IconButton>
// //                       </Tooltip>
// //                       <Tooltip title="Supprimer">
// //                         <IconButton
// //                           size="small"
// //                           color="error"
// //                           onClick={() => handleDeleteClick(alerte)}
// //                         >
// //                           <DeleteIcon fontSize="small" />
// //                         </IconButton>
// //                       </Tooltip>
// //                     </Box>
// //                   </TableCell>
// //                 </TableRow>
// //               ))
// //             )}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       {/* Formulaire d'alerte */}
// //       <AlerteForm
// //         open={openForm}
// //         onClose={handleFormClose}
// //         onSubmit={handleFormSubmit}
// //         alerte={selectedAlerte}
// //       />

// //       {/* Dialog de confirmation de suppression */}
// //       <Dialog
// //         open={openDeleteDialog}
// //         onClose={() => setOpenDeleteDialog(false)}
// //       >
// //         <DialogTitle>
// //           Confirmer la suppression
// //         </DialogTitle>
// //         <DialogContent>
// //           <Typography>
// //             Êtes-vous sûr de vouloir supprimer l'alerte "{alerteToDelete?.titre}" ?
// //             Cette action est irréversible.
// //           </Typography>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={() => setOpenDeleteDialog(false)}>
// //             Annuler
// //           </Button>
// //           <Button
// //             onClick={handleDeleteConfirm}
// //             color="error"
// //             variant="contained"
// //           >
// //             Supprimer
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Container>
// //   );
// // };

// // export default Alertes;







// // src/pages/Alertes.jsx - VERSION CORRIGÉE
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Eye, Filter, Download, Edit, Trash2, 
//   Bell, AlertTriangle, Info, CheckCircle, CheckSquare, 
//   Square, X, BarChart3, AlertCircle, User, HardDrive, Clock
// } from 'lucide-react';
// import { Alerte } from '../types';
// import AlerteForm from '../components/AlerteForm';
// import IncidentForm from '../components/IncidentForm';
// import { 
//   alertesAPI, 
//   materielsAPI, 
//   incidentsAPI 
// } from '../services/api';

// // Fonctions helper
// const safeArray = (data: any): Alerte[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   if (data.data && Array.isArray(data.data)) return data.data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   return [];
// };

// const extractDataFromResponse = (response: any): any[] => {
//   if (!response) return [];
  
//   if (Array.isArray(response)) return response;
  
//   if (response.data !== undefined) {
//     if (Array.isArray(response.data)) return response.data;
    
//     if (response.data.results && Array.isArray(response.data.results)) {
//       return response.data.results;
//     }
    
//     if (response.data.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }
    
//     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
//       return [response.data];
//     }
//   }
  
//   if (response.results && Array.isArray(response.results)) {
//     return response.results;
//   }
  
//   return [];
// };

// // Fonction pour simuler un utilisateur courant
// const getCurrentUser = () => {
//   return {
//     id: 1,
//     username: "admin",
//     first_name: "Admin",
//     last_name: "System",
//     email: "admin@system.com",
//     role: "admin",
//     departement: "IT"
//   };
// };

// const Alertes: React.FC = () => {
//   const [alertes, setAlertes] = useState<Alerte[]>([]);
//   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterSeverite, setFilterSeverite] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false);
//   const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
//   const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [selectedAlerteForIncident, setSelectedAlerteForIncident] = useState<Alerte | null>(null);
  
//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);
//   const [currentUser] = useState(getCurrentUser());

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     nouvelles: 0,
//     enTraitement: 0,
//     resolues: 0,
//     critiques: 0,
//     elevees: 0,
//     moyennes: 0,
//     basses: 0
//   });

//   // Charger les alertes
//   const fetchAlertes = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des alertes...');
      
//       const response = await alertesAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log(`✅ ${extractedData.length} alertes chargées`);
//       setAlertes(extractedData);
      
//       // Calculer les statistiques
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement alertes:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des alertes';
//       setError(errorMessage);
//       showMessage('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = (data: Alerte[]) => {
//     const stats = {
//       total: data.length,
//       nouvelles: data.filter(a => a.statut === 'nouvelle').length,
//       enTraitement: data.filter(a => a.statut === 'en_traitement').length,
//       resolues: data.filter(a => a.statut === 'resolue').length,
//       critiques: data.filter(a => a.severite === 'critique').length,
//       elevees: data.filter(a => a.severite === 'elevee').length,
//       moyennes: data.filter(a => a.severite === 'moyenne').length,
//       basses: data.filter(a => a.severite === 'basse').length
//     };
//     setStatistiques(stats);
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);
//       console.log('🔄 Chargement des données de relations...');

//       // Utiliser Promise.all pour charger simultanément
//       const [materielsResponse, incidentsResponse] = await Promise.all([
//         materielsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement matériels:', err);
//           return { data: [] };
//         }),
//         incidentsAPI.getAll().catch(err => {
//           console.error('❌ Erreur chargement incidents:', err);
//           return { data: [] };
//         })
//       ]);

//       const materielsData = extractDataFromResponse(materielsResponse);
//       const incidentsData = extractDataFromResponse(incidentsResponse);

//       console.log('✅ Données de relations chargées:', {
//         materiels: materielsData.length,
//         incidents: incidentsData.length
//       });

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

//   useEffect(() => {
//     fetchAlertes();
//     fetchRelationsData();
//   }, []);

//   useEffect(() => {
//     filterAlertes();
//   }, [alertes, searchTerm, filterSeverite, filterStatut, filterType]);

//   useEffect(() => {
//     if (filteredAlertes.length > 0 && selectedAlertes.length === filteredAlertes.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedAlertes, filteredAlertes]);

//   const filterAlertes = () => {
//     let filtered = safeArray(alertes);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(a => 
//         a.description?.toLowerCase().includes(searchLower) ||
//         (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchLower))
//       );
//     }

//     if (filterSeverite) {
//       filtered = filtered.filter(a => a.severite === filterSeverite);
//     }

//     if (filterStatut) {
//       filtered = filtered.filter(a => a.statut === filterStatut);
//     }

//     if (filterType) {
//       filtered = filtered.filter(a => a.type_alerte === filterType);
//     }

//     setFilteredAlertes(filtered);
//     setSelectedAlertes([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Gestion des alertes
//   const handleSubmit = async (alerteData: any) => {
//     try {
//       console.log('📤 Soumission des données alerte:', alerteData);
      
//       if (editingAlerte) {
//         await alertesAPI.update(editingAlerte.id, alerteData);
//         showMessage('success', 'Alerte modifiée avec succès');
//       } else {
//         await alertesAPI.create(alerteData);
//         showMessage('success', 'Alerte créée avec succès');
//       }
      
//       await fetchAlertes();
//       setIsFormOpen(false);
//       setEditingAlerte(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde alerte:', error);
//       const errorMessage = error.response?.data?.message || 
//                           error.message || 
//                           'Erreur lors de la sauvegarde';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Gestion des incidents - SCÉNARIO 2
//   const handleCreateIncident = async (incidentData: any) => {
//     try {
//       console.log('📤 Création incident depuis alerte:', incidentData);
      
//       // Appeler l'API pour créer l'incident
//       const response = await incidentsAPI.create(incidentData);
      
//       // Si l'incident a été créé avec succès, mettre à jour l'alerte
//       if (selectedAlerteForIncident) {
//         try {
//           // Marquer l'alerte comme liée à un incident
//           await alertesAPI.update(selectedAlerteForIncident.id, {
//             ...selectedAlerteForIncident,
//             incident_associe_id: response.data?.id || response.id,
//             statut: 'en_traitement' // Mettre à jour le statut
//           });
          
//           showMessage('success', '✅ Incident créé avec succès et alerte mise à jour');
//         } catch (updateError) {
//           console.error('❌ Erreur mise à jour alerte:', updateError);
//           showMessage('warning', '⚠️ Incident créé mais erreur lors de la mise à jour de l\'alerte');
//         }
//       } else {
//         showMessage('success', '✅ Incident créé avec succès');
//       }
      
//       // Recharger les données
//       await Promise.all([
//         fetchAlertes(),
//         fetchRelationsData()
//       ]);
      
//       setIsIncidentFormOpen(false);
//       setSelectedAlerteForIncident(null);
      
//     } catch (error: any) {
//       console.error('❌ Erreur création incident:', error);
//       const errorMessage = error.response?.data?.message || 
//                           error.message || 
//                           'Erreur lors de la création de l\'incident';
//       showMessage('error', errorMessage);
//     }
//   };

//   // Fonction pour ouvrir le formulaire d'incident depuis une alerte
//   const openIncidentFormFromAlerte = (alerte: Alerte) => {
//     // Vérifier si l'alerte peut créer un incident
//     const canCreateIncident = alerte.severite === 'critique' && 
//                              (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
    
//     if (!canCreateIncident) {
//       showMessage('warning', 'Seules les alertes critiques (nouvelle ou en traitement) peuvent créer des incidents');
//       return;
//     }
    
//     // Vérifier si l'alerte a déjà un incident
//     if (alerte.incident_associe_id) {
//       showMessage('info', 'Cette alerte a déjà un incident associé');
//       return;
//     }
    
//     console.log('🚨 Ouverture formulaire incident depuis alerte:', alerte);
//     setSelectedAlerteForIncident(alerte);
//     setIsIncidentFormOpen(true);
//   };

//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 
//         `Aucune donnée de relation disponible. 
//         Matériels: ${materiels.length} | 
//         Incidents: ${incidents.length}`
//       );
      
//       if (confirm('Voulez-vous recharger les données ?')) {
//         fetchRelationsData();
//       }
      
//       return;
//     }

//     console.log('✅ Données disponibles pour nouvelle alerte:', {
//       materiels: materiels.length,
//       incidents: incidents.length
//     });

//     setEditingAlerte(undefined);
//     setIsFormOpen(true);
//   };

//   const handleEdit = (alerte: Alerte) => {
//     if (loadingRelations) {
//       showMessage('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingAlerte(alerte);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectAlerte = (id: number) => {
//     setSelectedAlertes(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedAlertes([]);
//     } else {
//       const allIds = filteredAlertes.map(a => a.id);
//       setSelectedAlertes(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showMessage('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ?`)) {
//       try {
//         const deletePromises = selectedAlertes.map(id => 
//           alertesAPI.delete(id).catch(err => {
//             console.error(`Erreur suppression alerte ${id}:`, err);
//             return null;
//           })
//         );
        
//         await Promise.all(deletePromises);
        
//         showMessage('success', `${selectedAlertes.length} alerte(s) supprimée(s) avec succès`);
//         setSelectedAlertes([]);
//         await fetchAlertes();
//       } catch (error: any) {
//         showMessage('error', 'Erreur lors de la suppression des alertes');
//       }
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedAlertes.length === 0) {
//       showMessage('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     if (selectedAlertes.length === 1) {
//       const alerte = alertes.find(a => a.id === selectedAlertes[0]);
//       if (alerte) {
//         handleEdit(alerte);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedAlertes.length} alertes`);
//     }
//   };

//   const handleTraiterSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showMessage('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     try {
//       const updatePromises = selectedAlertes.map(id => 
//         alertesAPI.update(id, { statut: 'en_traitement' }).catch(err => {
//           console.error(`Erreur traitement alerte ${id}:`, err);
//           return null;
//         })
//       );
      
//       await Promise.all(updatePromises);
      
//       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme traitées`);
//       setSelectedAlertes([]);
//       await fetchAlertes();
//     } catch (error: any) {
//       showMessage('error', 'Erreur lors du traitement des alertes');
//     }
//   };

//   const handleResoudreSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showMessage('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     try {
//       const updatePromises = selectedAlertes.map(id => 
//         alertesAPI.update(id, { statut: 'resolue' }).catch(err => {
//           console.error(`Erreur résolution alerte ${id}:`, err);
//           return null;
//         })
//       );
      
//       await Promise.all(updatePromises);
      
//       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme résolues`);
//       setSelectedAlertes([]);
//       await fetchAlertes();
//     } catch (error: any) {
//       showMessage('error', 'Erreur lors de la résolution des alertes');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
//       try {
//         await alertesAPI.delete(id);
//         showMessage('success', 'Alerte supprimée avec succès');
//         await fetchAlertes();
//       } catch (error: any) {
//         showMessage('error', 'Erreur lors de la suppression');
//       }
//     }
//   };

//   const handleTraiter = async (id: number) => {
//     try {
//       await alertesAPI.update(id, { statut: 'en_traitement' });
//       showMessage('success', 'Alerte marquée comme traitée');
//       await fetchAlertes();
//     } catch (error: any) {
//       showMessage('error', 'Erreur lors du traitement');
//     }
//   };

//   const handleResoudre = async (id: number) => {
//     try {
//       await alertesAPI.update(id, { statut: 'resolue' });
//       showMessage('success', 'Alerte marquée comme résolue');
//       await fetchAlertes();
//     } catch (error: any) {
//       showMessage('error', 'Erreur lors de la résolution');
//     }
//   };

//   // Fonctions d'affichage
//   const getSeveriteBadge = (severite: string) => {
//     const badges: Record<string, string> = {
//       critique: 'badge-error',
//       elevee: 'badge-warning',
//       moyenne: 'badge-info',
//       basse: 'badge-neutral'
//     };
//     return badges[severite] || 'badge-neutral';
//   };

//   const getSeveriteText = (severite: string) => {
//     const texts: Record<string, string> = {
//       critique: 'Critique',
//       elevee: 'Élevée',
//       moyenne: 'Moyenne',
//       basse: 'Basse'
//     };
//     return texts[severite] || severite;
//   };

//   const getSeveriteIcon = (severite: string) => {
//     switch (severite) {
//       case 'critique': return <AlertTriangle className="h-4 w-4" />;
//       case 'elevee': return <AlertTriangle className="h-4 w-4" />;
//       case 'moyenne': return <Bell className="h-4 w-4" />;
//       case 'basse': return <Info className="h-4 w-4" />;
//       default: return <Bell className="h-4 w-4" />;
//     }
//   };

//   const getStatutBadge = (statut: string) => {
//     const badges: Record<string, string> = {
//       nouvelle: 'badge-error',
//       en_traitement: 'badge-warning',
//       resolue: 'badge-success'
//     };
//     return badges[statut] || 'badge-neutral';
//   };

//   const getStatutText = (statut: string) => {
//     const texts: Record<string, string> = {
//       nouvelle: 'Nouvelle',
//       en_traitement: 'En traitement',
//       resolue: 'Résolue'
//     };
//     return texts[statut] || statut;
//   };

//   const getTypeText = (type: string) => {
//     const texts: Record<string, string> = {
//       securite: 'Sécurité',
//       performance: 'Performance',
//       panne: 'Panne',
//       maintenance: 'Maintenance'
//     };
//     return texts[type] || type;
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterSeverite('');
//     setFilterStatut('');
//     setFilterType('');
//     setSelectedAlertes([]);
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredAlertes.map(a => ({
//         Type: getTypeText(a.type_alerte),
//         Sévérité: getSeveriteText(a.severite),
//         Statut: getStatutText(a.statut),
//         Description: a.description,
//         'Matériel source': a.materiel_nom || 'Non spécifié',
//         'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée'
//       }));

//       if (dataToExport.length === 0) {
//         showMessage('error', 'Aucune donnée à exporter');
//         return;
//       }

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `alertes_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const getAlertClass = (type: 'success' | 'error' | 'info' | 'warning') => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des alertes...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4 shadow-lg`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4 shadow-lg">
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button className="btn btn-ghost btn-sm" onClick={fetchAlertes}>
//             Réessayer
//           </button>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Alertes</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredAlertes.length} alerte(s) trouvée(s)
//             {selectedAlertes.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedAlertes.length} sélectionnée(s))
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle alerte
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Bell className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.nouvelles}</h3>
//             <p className="text-sm opacity-60">Nouvelles</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-warning">{statistiques.enTraitement}</h3>
//             <p className="text-sm opacity-60">En traitement</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.resolues}</h3>
//             <p className="text-sm opacity-60">Résolues</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.critiques}</h3>
//             <p className="text-sm opacity-60">Critiques</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-warning">{statistiques.elevees}</h3>
//             <p className="text-sm opacity-60">Élevées</p>
//           </div>
//         </div>

//         <div className="card bg-info/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Bell className="h-6 w-6 text-info mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-info">{statistiques.moyennes}</h3>
//             <p className="text-sm opacity-60">Moyennes</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Info className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.basses}</h3>
//             <p className="text-sm opacity-60">Basses</p>
//           </div>
//         </div>
//       </div>

//       {/* Filtres et recherche */}
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
//                   placeholder="Description, matériel..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Sévérité</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterSeverite}
//                 onChange={(e) => setFilterSeverite(e.target.value)}
//               >
//                 <option value="">Toutes les sévérités</option>
//                 <option value="critique">Critique</option>
//                 <option value="elevee">Élevée</option>
//                 <option value="moyenne">Moyenne</option>
//                 <option value="basse">Basse</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📈 Statut</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterStatut}
//                 onChange={(e) => setFilterStatut(e.target.value)}
//               >
//                 <option value="">Tous les statuts</option>
//                 <option value="nouvelle">Nouvelle</option>
//                 <option value="en_traitement">En traitement</option>
//                 <option value="resolue">Résolue</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔧 Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="securite">Sécurité</option>
//                 <option value="performance">Performance</option>
//                 <option value="panne">Panne</option>
//                 <option value="maintenance">Maintenance</option>
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
//           {selectedAlertes.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedAlertes.length} alerte(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleTraiterSelected}
//                     className="btn btn-warning btn-sm gap-2"
//                   >
//                     <Bell className="h-4 w-4" />
//                     Traiter ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleResoudreSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Résoudre ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedAlertes([])}
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

//       {/* Tableau des alertes */}
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
//                   <th className="font-bold">Type alerte</th>
//                   <th className="font-bold">Sévérité</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold">Description</th>
//                   <th className="font-bold">Source</th>
//                   <th className="font-bold">Date alerte</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAlertes.map((alerte) => {
//                   // Vérifier si cette alerte peut créer un incident
//                   const canCreateIncident = alerte.severite === 'critique' && 
//                                            (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement') &&
//                                            !alerte.incident_associe_id;
                  
//                   return (
//                     <tr key={alerte.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm"
//                             checked={selectedAlertes.includes(alerte.id)}
//                             onChange={() => toggleSelectAlerte(alerte.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {getTypeText(alerte.type_alerte)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getSeveriteBadge(alerte.severite)} badge-lg gap-1`}>
//                           {getSeveriteIcon(alerte.severite)}
//                           {getSeveriteText(alerte.severite)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(alerte.statut)} badge-lg`}>
//                           {getStatutText(alerte.statut)}
//                         </div>
//                       </td>
//                       <td className="max-w-xs">
//                         <div className="line-clamp-2 text-sm">
//                           {alerte.description}
//                           {alerte.incident_associe_id && (
//                             <span className="ml-2 text-xs text-info">
//                               (Incident #{alerte.incident_associe_id})
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {alerte.materiel_nom && (
//                             <div className="flex items-center gap-1">
//                               <HardDrive className="h-3 w-3" />
//                               {alerte.materiel_nom}
//                             </div>
//                           )}
//                           {!alerte.materiel_nom && (
//                             <span className="text-base-content opacity-50">-</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           <div className="flex items-center gap-1">
//                             <Clock className="h-3 w-3 opacity-50" />
//                             {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : '-'}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
//                             title="Voir les détails"
//                             onClick={() => {
//                               const details = [
//                                 `Alerte #${alerte.id}`,
//                                 `Type: ${getTypeText(alerte.type_alerte)}`,
//                                 `Sévérité: ${getSeveriteText(alerte.severite)}`,
//                                 `Statut: ${getStatutText(alerte.statut)}`,
//                                 `Description: ${alerte.description}`,
//                                 `Matériel: ${alerte.materiel_nom || 'Non spécifié'}`,
//                                 `Date: ${alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleString('fr-FR') : 'Non spécifiée'}`
//                               ];
//                               showMessage('info', details.join('\n'));
//                             }}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
                          
//                           {/* BOUTON "CRÉER INCIDENT" - SCÉNARIO 2 */}
//                           {canCreateIncident && (
//                             <button
//                               onClick={() => openIncidentFormFromAlerte(alerte)}
//                               className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                               title="Créer un incident depuis cette alerte"
//                             >
//                               <AlertCircle className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           {alerte.statut === 'nouvelle' && (
//                             <button
//                               onClick={() => handleTraiter(alerte.id)}
//                               className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
//                               title="Marquer en traitement"
//                             >
//                               <Bell className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           {alerte.statut !== 'resolue' && (
//                             <button
//                               onClick={() => handleResoudre(alerte.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Marquer comme résolue"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           <button
//                             onClick={() => handleEdit(alerte)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
                          
//                           <button
//                             onClick={() => handleDelete(alerte.id)}
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

//           {filteredAlertes.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Bell className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune alerte trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterSeverite || filterStatut || filterType
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune alerte n'est enregistrée dans le système"
//                   }
//                 </p>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-primary btn-sm mt-4"
//                   disabled={loadingRelations}
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Créer la première alerte
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'alerte */}
//       <AlerteForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingAlerte(undefined);
//         }}
//         onSubmit={handleSubmit}
//         alerte={editingAlerte}
//         materiels={materiels}
//         incidents={incidents}
//       />

//       {/* Formulaire d'incident - SCÉNARIO 2 */}
//       {selectedAlerteForIncident && (
//         <IncidentForm
//           isOpen={isIncidentFormOpen}
//           onClose={() => {
//             setIsIncidentFormOpen(false);
//             setSelectedAlerteForIncident(null);
//           }}
//           onSubmit={handleCreateIncident}
//           currentUser={currentUser}
//           alerteSource={selectedAlerteForIncident}
//         />
//       )}
//     </div>
//   );
// };

// export default Alertes;





// // src/pages/Alertes.tsx - VERSION CORRIGÉE AVEC NOTIFICATIONS
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Eye, Filter, Download, Edit, Trash2, 
//   Bell, AlertTriangle, Info, CheckCircle, CheckSquare, 
//   Square, X, BarChart3, AlertCircle, User, HardDrive, Clock,
//   RefreshCw
// } from 'lucide-react';
// import { Alerte } from '../types';
// import AlerteForm from '../components/AlerteForm';
// import IncidentForm from '../components/IncidentForm';
// import { 
//   alertesAPI, 
//   materielsAPI, 
//   incidentsAPI,
//   handleApiError 
// } from '../services/api';

// // Fonctions helper
// const safeArray = (data: any): Alerte[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   if (data.data && Array.isArray(data.data)) return data.data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   return [];
// };

// const extractDataFromResponse = (response: any): any[] => {
//   if (!response) return [];
  
//   if (Array.isArray(response)) return response;
  
//   if (response.data !== undefined) {
//     if (Array.isArray(response.data)) return response.data;
    
//     if (response.data.results && Array.isArray(response.data.results)) {
//       return response.data.results;
//     }
    
//     if (response.data.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }
    
//     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
//       return [response.data];
//     }
//   }
  
//   if (response.results && Array.isArray(response.results)) {
//     return response.results;
//   }
  
//   return [];
// };

// // Fonction pour simuler un utilisateur courant
// const getCurrentUser = () => {
//   return {
//     id: 1,
//     username: "admin",
//     first_name: "Admin",
//     last_name: "System",
//     email: "admin@system.com",
//     role: "admin",
//     departement: "IT",
//     is_active: true,
//     date_joined: new Date().toISOString()
//   };
// };

// // Fonction de notification simple
// const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
//   // Créer une div pour la notification
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
  
//   // Supprimer après 5 secondes
//   setTimeout(() => {
//     document.body.removeChild(notification);
//   }, 5000);
// };

// const Alertes: React.FC = () => {
//   const [alertes, setAlertes] = useState<Alerte[]>([]);
//   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterSeverite, setFilterSeverite] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false);
//   const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
//   const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [selectedAlerteForIncident, setSelectedAlerteForIncident] = useState<Alerte | null>(null);
  
//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);
//   const [currentUser] = useState(getCurrentUser());
//   const [refreshing, setRefreshing] = useState<boolean>(false);

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     nouvelles: 0,
//     enTraitement: 0,
//     resolues: 0,
//     critiques: 0,
//     elevees: 0,
//     moyennes: 0,
//     basses: 0
//   });

//   // Charger les alertes
//   const fetchAlertes = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des alertes...');
      
//       const response = await alertesAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log(`✅ ${extractedData.length} alertes chargées`);
//       setAlertes(extractedData);
      
//       // Calculer les statistiques
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement alertes:', err);
//       const errorMessage = handleApiError(err);
//       setError(errorMessage);
//       showNotification('error', errorMessage);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = (data: Alerte[]) => {
//     const stats = {
//       total: data.length,
//       nouvelles: data.filter(a => a.statut === 'nouvelle').length,
//       enTraitement: data.filter(a => a.statut === 'en_traitement').length,
//       resolues: data.filter(a => a.statut === 'resolue').length,
//       critiques: data.filter(a => a.severite === 'critique').length,
//       elevees: data.filter(a => a.severite === 'elevee').length,
//       moyennes: data.filter(a => a.severite === 'moyenne').length,
//       basses: data.filter(a => a.severite === 'basse').length
//     };
//     setStatistiques(stats);
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);
//       console.log('🔄 Chargement des données de relations...');

//       // Charger les matériels
//       let materielsData: any[] = [];
//       try {
//         const materielsResponse = await materielsAPI.getAll();
//         materielsData = extractDataFromResponse(materielsResponse);
//         console.log(`✅ ${materielsData.length} matériels chargés`);
//       } catch (materielError) {
//         console.error('❌ Erreur chargement matériels:', materielError);
//         showNotification('warning', 'Certains matériels n\'ont pas pu être chargés');
//       }

//       // Charger les incidents
//       let incidentsData: any[] = [];
//       try {
//         const incidentsResponse = await incidentsAPI.getAll();
//         incidentsData = extractDataFromResponse(incidentsResponse);
//         console.log(`✅ ${incidentsData.length} incidents chargés`);
//       } catch (incidentError) {
//         console.error('❌ Erreur chargement incidents:', incidentError);
//         showNotification('warning', 'Certains incidents n\'ont pas pu être chargés');
//       }

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showNotification('error', 'Erreur lors du chargement des données');
      
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Rafraîchir toutes les données
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([
//       fetchAlertes(),
//       fetchRelationsData()
//     ]);
//     showNotification('success', 'Données rafraîchies');
//   };

//   useEffect(() => {
//     fetchAlertes();
//     fetchRelationsData();
//   }, []);

//   useEffect(() => {
//     filterAlertes();
//   }, [alertes, searchTerm, filterSeverite, filterStatut, filterType]);

//   useEffect(() => {
//     if (filteredAlertes.length > 0 && selectedAlertes.length === filteredAlertes.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedAlertes, filteredAlertes]);

//   const filterAlertes = () => {
//     let filtered = safeArray(alertes);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(a => 
//         a.description?.toLowerCase().includes(searchLower) ||
//         (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchLower))
//       );
//     }

//     if (filterSeverite) {
//       filtered = filtered.filter(a => a.severite === filterSeverite);
//     }

//     if (filterStatut) {
//       filtered = filtered.filter(a => a.statut === filterStatut);
//     }

//     if (filterType) {
//       filtered = filtered.filter(a => a.type_alerte === filterType);
//     }

//     setFilteredAlertes(filtered);
//     setSelectedAlertes([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Gestion des alertes
//   const handleSubmit = async (alerteData: any) => {
//     try {
//       console.log('📤 Soumission des données alerte:', alerteData);
      
//       if (editingAlerte) {
//         await alertesAPI.update(editingAlerte.id, alerteData);
//         showNotification('success', '✅ Alerte modifiée avec succès');
//       } else {
//         await alertesAPI.create(alerteData);
//         showNotification('success', '✅ Alerte créée avec succès');
//       }
      
//       await fetchAlertes();
//       setIsFormOpen(false);
//       setEditingAlerte(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde alerte:', error);
//       const errorMessage = handleApiError(error);
//       showNotification('error', errorMessage);
//     }
//   };

//   // Gestion des incidents - SCÉNARIO 2
//   const handleCreateIncident = async (incidentData: any) => {
//     try {
//       console.log('📤 Création incident depuis alerte:', incidentData);
      
//       // Appeler l'API pour créer l'incident
//       const response = await incidentsAPI.create(incidentData);
//       console.log('✅ Réponse création incident:', response);
      
//       // Vérifier si la réponse contient un ID
//       const incidentId = response.data?.id || response.id || 
//                        (response.data && response.data.data && response.data.data.id);
      
//       if (!incidentId) {
//         throw new Error('L\'incident a été créé mais aucun ID n\'a été retourné');
//       }
      
//       // Si l'incident a été créé avec succès, mettre à jour l'alerte
//       if (selectedAlerteForIncident) {
//         try {
//           // Marquer l'alerte comme liée à un incident
//           await alertesAPI.update(selectedAlerteForIncident.id, {
//             ...selectedAlerteForIncident,
//             incident_associe_id: incidentId,
//             statut: 'en_traitement' // Mettre à jour le statut
//           });
          
//           showNotification('success', `✅ Incident #${incidentId} créé avec succès et alerte mise à jour`);
//         } catch (updateError) {
//           console.error('❌ Erreur mise à jour alerte:', updateError);
//           showNotification('warning', `⚠️ Incident #${incidentId} créé mais erreur lors de la mise à jour de l\'alerte`);
//         }
//       } else {
//         showNotification('success', `✅ Incident #${incidentId} créé avec succès`);
//       }
      
//       // Recharger les données
//       await Promise.all([
//         fetchAlertes(),
//         fetchRelationsData()
//       ]);
      
//       setIsIncidentFormOpen(false);
//       setSelectedAlerteForIncident(null);
      
//     } catch (error: any) {
//       console.error('❌ Erreur création incident:', error);
//       const errorMessage = handleApiError(error);
//       showNotification('error', errorMessage);
//     }
//   };

//   // Fonction pour ouvrir le formulaire d'incident depuis une alerte
//   const openIncidentFormFromAlerte = (alerte: Alerte) => {
//     // Vérifier si l'alerte peut créer un incident
//     const canCreateIncident = alerte.severite === 'critique' && 
//                              (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
    
//     if (!canCreateIncident) {
//       showNotification('warning', 'Seules les alertes critiques (nouvelle ou en traitement) peuvent créer des incidents');
//       return;
//     }
    
//     // Vérifier si l'alerte a déjà un incident
//     if (alerte.incident_associe_id) {
//       showNotification('info', 'Cette alerte a déjà un incident associé');
//       return;
//     }
    
//     console.log('🚨 Ouverture formulaire incident depuis alerte:', alerte);
//     setSelectedAlerteForIncident(alerte);
//     setIsIncidentFormOpen(true);
//   };

//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showNotification('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showNotification('warning', 
//         `Aucune donnée de relation disponible. 
//         Matériels: ${materiels.length} | 
//         Incidents: ${incidents.length}`
//       );
      
//       if (confirm('Voulez-vous recharger les données ?')) {
//         fetchRelationsData();
//       }
      
//       return;
//     }

//     console.log('✅ Données disponibles pour nouvelle alerte:', {
//       materiels: materiels.length,
//       incidents: incidents.length
//     });

//     setEditingAlerte(undefined);
//     setIsFormOpen(true);
//   };

//   const handleEdit = (alerte: Alerte) => {
//     if (loadingRelations) {
//       showNotification('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showNotification('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingAlerte(alerte);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectAlerte = (id: number) => {
//     setSelectedAlertes(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedAlertes([]);
//     } else {
//       const allIds = filteredAlertes.map(a => a.id);
//       setSelectedAlertes(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ?`)) {
//       try {
//         const deletePromises = selectedAlertes.map(id => 
//           alertesAPI.delete(id).catch(err => {
//             console.error(`Erreur suppression alerte ${id}:`, err);
//             showNotification('warning', `Alerte #${id} non supprimée: ${handleApiError(err)}`);
//             return null;
//           })
//         );
        
//         const results = await Promise.all(deletePromises);
//         const successfulDeletes = results.filter(r => r !== null).length;
        
//         if (successfulDeletes > 0) {
//           showNotification('success', `${successfulDeletes} alerte(s) supprimée(s) avec succès`);
//         }
        
//         setSelectedAlertes([]);
//         await fetchAlertes();
//       } catch (error: any) {
//         showNotification('error', 'Erreur lors de la suppression des alertes');
//       }
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     if (selectedAlertes.length === 1) {
//       const alerte = alertes.find(a => a.id === selectedAlertes[0]);
//       if (alerte) {
//         handleEdit(alerte);
//       }
//     } else {
//       showNotification('info', `Édition multiple de ${selectedAlertes.length} alertes`);
//     }
//   };

//   const handleTraiterSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     try {
//       const updatePromises = selectedAlertes.map(id => 
//         alertesAPI.update(id, { statut: 'en_traitement' }).catch(err => {
//           console.error(`Erreur traitement alerte ${id}:`, err);
//           showNotification('warning', `Alerte #${id} non traitée: ${handleApiError(err)}`);
//           return null;
//         })
//       );
      
//       const results = await Promise.all(updatePromises);
//       const successfulUpdates = results.filter(r => r !== null).length;
      
//       if (successfulUpdates > 0) {
//         showNotification('success', `${successfulUpdates} alerte(s) marquée(s) comme traitées`);
//       }
      
//       setSelectedAlertes([]);
//       await fetchAlertes();
//     } catch (error: any) {
//       showNotification('error', 'Erreur lors du traitement des alertes');
//     }
//   };

//   const handleResoudreSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     try {
//       const updatePromises = selectedAlertes.map(id => 
//         alertesAPI.update(id, { statut: 'resolue' }).catch(err => {
//           console.error(`Erreur résolution alerte ${id}:`, err);
//           showNotification('warning', `Alerte #${id} non résolue: ${handleApiError(err)}`);
//           return null;
//         })
//       );
      
//       const results = await Promise.all(updatePromises);
//       const successfulUpdates = results.filter(r => r !== null).length;
      
//       if (successfulUpdates > 0) {
//         showNotification('success', `${successfulUpdates} alerte(s) marquée(s) comme résolues`);
//       }
      
//       setSelectedAlertes([]);
//       await fetchAlertes();
//     } catch (error: any) {
//       showNotification('error', 'Erreur lors de la résolution des alertes');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
//       try {
//         await alertesAPI.delete(id);
//         showNotification('success', '✅ Alerte supprimée avec succès');
//         await fetchAlertes();
//       } catch (error: any) {
//         const errorMessage = handleApiError(error);
//         showNotification('error', `❌ Erreur suppression: ${errorMessage}`);
//       }
//     }
//   };

//   const handleTraiter = async (id: number) => {
//     try {
//       await alertesAPI.update(id, { statut: 'en_traitement' });
//       showNotification('success', '✅ Alerte marquée comme traitée');
//       await fetchAlertes();
//     } catch (error: any) {
//       const errorMessage = handleApiError(error);
//       showNotification('error', `❌ Erreur traitement: ${errorMessage}`);
//     }
//   };

//   const handleResoudre = async (id: number) => {
//     try {
//       await alertesAPI.update(id, { statut: 'resolue' });
//       showNotification('success', '✅ Alerte marquée comme résolue');
//       await fetchAlertes();
//     } catch (error: any) {
//       const errorMessage = handleApiError(error);
//       showNotification('error', `❌ Erreur résolution: ${errorMessage}`);
//     }
//   };

//   // Fonctions d'affichage
//   const getSeveriteBadge = (severite: string) => {
//     const badges: Record<string, string> = {
//       critique: 'badge-error',
//       elevee: 'badge-warning',
//       moyenne: 'badge-info',
//       basse: 'badge-neutral'
//     };
//     return badges[severite] || 'badge-neutral';
//   };

//   const getSeveriteText = (severite: string) => {
//     const texts: Record<string, string> = {
//       critique: 'Critique',
//       elevee: 'Élevée',
//       moyenne: 'Moyenne',
//       basse: 'Basse'
//     };
//     return texts[severite] || severite;
//   };

//   const getSeveriteIcon = (severite: string) => {
//     switch (severite) {
//       case 'critique': return <AlertTriangle className="h-4 w-4" />;
//       case 'elevee': return <AlertTriangle className="h-4 w-4" />;
//       case 'moyenne': return <Bell className="h-4 w-4" />;
//       case 'basse': return <Info className="h-4 w-4" />;
//       default: return <Bell className="h-4 w-4" />;
//     }
//   };

//   const getStatutBadge = (statut: string) => {
//     const badges: Record<string, string> = {
//       nouvelle: 'badge-error',
//       en_traitement: 'badge-warning',
//       resolue: 'badge-success'
//     };
//     return badges[statut] || 'badge-neutral';
//   };

//   const getStatutText = (statut: string) => {
//     const texts: Record<string, string> = {
//       nouvelle: 'Nouvelle',
//       en_traitement: 'En traitement',
//       resolue: 'Résolue'
//     };
//     return texts[statut] || statut;
//   };

//   const getTypeText = (type: string) => {
//     const texts: Record<string, string> = {
//       securite: 'Sécurité',
//       performance: 'Performance',
//       panne: 'Panne',
//       maintenance: 'Maintenance'
//     };
//     return texts[type] || type;
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterSeverite('');
//     setFilterStatut('');
//     setFilterType('');
//     setSelectedAlertes([]);
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredAlertes.map(a => ({
//         Type: getTypeText(a.type_alerte),
//         Sévérité: getSeveriteText(a.severite),
//         Statut: getStatutText(a.statut),
//         Description: a.description,
//         'Matériel source': a.materiel_nom || 'Non spécifié',
//         'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée'
//       }));

//       if (dataToExport.length === 0) {
//         showNotification('error', 'Aucune donnée à exporter');
//         return;
//       }

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `alertes_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showNotification('success', '✅ Export CSV réussi !');
//     } catch (error) {
//       showNotification('error', '❌ Erreur lors de l\'export');
//     }
//   };

//   const getAlertClass = (type: 'success' | 'error' | 'info' | 'warning') => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des alertes...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {/* Messages locaux */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4 shadow-lg`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4 shadow-lg">
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button className="btn btn-ghost btn-sm" onClick={fetchAlertes}>
//             Réessayer
//           </button>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Alertes</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredAlertes.length} alerte(s) trouvée(s)
//             {selectedAlertes.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedAlertes.length} sélectionnée(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2 flex-wrap">
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle alerte
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Bell className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.nouvelles}</h3>
//             <p className="text-sm opacity-60">Nouvelles</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-warning">{statistiques.enTraitement}</h3>
//             <p className="text-sm opacity-60">En traitement</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.resolues}</h3>
//             <p className="text-sm opacity-60">Résolues</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.critiques}</h3>
//             <p className="text-sm opacity-60">Critiques</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-warning">{statistiques.elevees}</h3>
//             <p className="text-sm opacity-60">Élevées</p>
//           </div>
//         </div>

//         <div className="card bg-info/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Bell className="h-6 w-6 text-info mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-info">{statistiques.moyennes}</h3>
//             <p className="text-sm opacity-60">Moyennes</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Info className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.basses}</h3>
//             <p className="text-sm opacity-60">Basses</p>
//           </div>
//         </div>
//       </div>

//       {/* Filtres et recherche */}
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
//                   placeholder="Description, matériel..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Sévérité</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterSeverite}
//                 onChange={(e) => setFilterSeverite(e.target.value)}
//               >
//                 <option value="">Toutes les sévérités</option>
//                 <option value="critique">Critique</option>
//                 <option value="elevee">Élevée</option>
//                 <option value="moyenne">Moyenne</option>
//                 <option value="basse">Basse</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📈 Statut</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterStatut}
//                 onChange={(e) => setFilterStatut(e.target.value)}
//               >
//                 <option value="">Tous les statuts</option>
//                 <option value="nouvelle">Nouvelle</option>
//                 <option value="en_traitement">En traitement</option>
//                 <option value="resolue">Résolue</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔧 Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="securite">Sécurité</option>
//                 <option value="performance">Performance</option>
//                 <option value="panne">Panne</option>
//                 <option value="maintenance">Maintenance</option>
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
//           {selectedAlertes.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedAlertes.length} alerte(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={handleTraiterSelected}
//                     className="btn btn-warning btn-sm gap-2"
//                   >
//                     <Bell className="h-4 w-4" />
//                     Traiter ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleResoudreSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Résoudre ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedAlertes([])}
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

//       {/* Tableau des alertes */}
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
//                   <th className="font-bold">Type alerte</th>
//                   <th className="font-bold">Sévérité</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold">Description</th>
//                   <th className="font-bold">Source</th>
//                   <th className="font-bold">Date alerte</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAlertes.map((alerte) => {
//                   // Vérifier si cette alerte peut créer un incident
//                   const canCreateIncident = alerte.severite === 'critique' && 
//                                            (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
                  
//                   return (
//                     <tr key={alerte.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm"
//                             checked={selectedAlertes.includes(alerte.id)}
//                             onChange={() => toggleSelectAlerte(alerte.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {getTypeText(alerte.type_alerte)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getSeveriteBadge(alerte.severite)} badge-lg gap-1`}>
//                           {getSeveriteIcon(alerte.severite)}
//                           {getSeveriteText(alerte.severite)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(alerte.statut)} badge-lg`}>
//                           {getStatutText(alerte.statut)}
//                         </div>
//                       </td>
//                       <td className="max-w-xs">
//                         <div className="line-clamp-2 text-sm">
//                           {alerte.description}
//                           {alerte.incident_associe_id && (
//                             <span className="ml-2 text-xs text-info">
//                               (Incident #{alerte.incident_associe_id})
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {alerte.materiel_nom && (
//                             <div className="flex items-center gap-1">
//                               <HardDrive className="h-3 w-3" />
//                               {alerte.materiel_nom}
//                             </div>
//                           )}
//                           {!alerte.materiel_nom && (
//                             <span className="text-base-content opacity-50">-</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           <div className="flex items-center gap-1">
//                             <Clock className="h-3 w-3 opacity-50" />
//                             {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : '-'}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
//                             title="Voir les détails"
//                             onClick={() => {
//                               const details = [
//                                 `Alerte #${alerte.id}`,
//                                 `Type: ${getTypeText(alerte.type_alerte)}`,
//                                 `Sévérité: ${getSeveriteText(alerte.severite)}`,
//                                 `Statut: ${getStatutText(alerte.statut)}`,
//                                 `Description: ${alerte.description}`,
//                                 `Matériel: ${alerte.materiel_nom || 'Non spécifié'}`,
//                                 `Date: ${alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleString('fr-FR') : 'Non spécifiée'}`
//                               ];
//                               showNotification('info', details.join('\n'));
//                             }}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
                          
//                           {/* BOUTON "CRÉER INCIDENT" - SCÉNARIO 2 */}
//                           {canCreateIncident && (
//                             <button
//                               onClick={() => openIncidentFormFromAlerte(alerte)}
//                               className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                               title="Créer un incident depuis cette alerte"
//                             >
//                               <AlertCircle className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           {alerte.statut === 'nouvelle' && (
//                             <button
//                               onClick={() => handleTraiter(alerte.id)}
//                               className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
//                               title="Marquer en traitement"
//                             >
//                               <Bell className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           {alerte.statut !== 'resolue' && (
//                             <button
//                               onClick={() => handleResoudre(alerte.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Marquer comme résolue"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           <button
//                             onClick={() => handleEdit(alerte)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
                          
//                           <button
//                             onClick={() => handleDelete(alerte.id)}
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

//           {filteredAlertes.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Bell className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune alerte trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterSeverite || filterStatut || filterType
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune alerte n'est enregistrée dans le système"
//                   }
//                 </p>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-primary btn-sm mt-4"
//                   disabled={loadingRelations}
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Créer la première alerte
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'alerte */}
//       <AlerteForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingAlerte(undefined);
//         }}
//         onSubmit={handleSubmit}
//         alerte={editingAlerte}
//         materiels={materiels}
//         incidents={incidents}
//       />

//       {/* Formulaire d'incident - SCÉNARIO 2 */}
//       {selectedAlerteForIncident && (
//         <IncidentForm
//           isOpen={isIncidentFormOpen}
//           onClose={() => {
//             setIsIncidentFormOpen(false);
//             setSelectedAlerteForIncident(null);
//           }}
//           onSubmit={handleCreateIncident}
//           currentUser={currentUser}
//           alerteSource={selectedAlerteForIncident}
//         />
//       )}
//     </div>
//   );
// };

// export default Alertes;





// // src/pages/Alertes.tsx - VERSION AVEC CONFIRMATION DE SUPPRESSION
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Eye, Filter, Download, Edit, Trash2, 
//   Bell, AlertTriangle, Info, CheckCircle, CheckSquare, 
//   Square, X, BarChart3, AlertCircle, User, HardDrive, Clock,
//   RefreshCw
// } from 'lucide-react';
// import { Alerte } from '../types';
// import AlerteForm from '../components/AlerteForm';
// import IncidentForm from '../components/IncidentForm';
// import { 
//   alertesAPI, 
//   materielsAPI, 
//   incidentsAPI,
//   handleApiError 
// } from '../services/api';

// // Fonctions helper
// const safeArray = (data: any): Alerte[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   if (data.data && Array.isArray(data.data)) return data.data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   return [];
// };

// const extractDataFromResponse = (response: any): any[] => {
//   if (!response) return [];
  
//   if (Array.isArray(response)) return response;
  
//   if (response.data !== undefined) {
//     if (Array.isArray(response.data)) return response.data;
    
//     if (response.data.results && Array.isArray(response.data.results)) {
//       return response.data.results;
//     }
    
//     if (response.data.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }
    
//     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
//       return [response.data];
//     }
//   }
  
//   if (response.results && Array.isArray(response.results)) {
//     return response.results;
//   }
  
//   return [];
// };

// // Fonction pour simuler un utilisateur courant
// const getCurrentUser = () => {
//   return {
//     id: 1,
//     username: "admin",
//     first_name: "Admin",
//     last_name: "System",
//     email: "admin@system.com",
//     role: "admin",
//     departement: "IT",
//     is_active: true,
//     date_joined: new Date().toISOString()
//   };
// };

// // Fonction de notification simple
// const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
//   // Créer une div pour la notification
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
  
//   // Supprimer après 5 secondes
//   setTimeout(() => {
//     document.body.removeChild(notification);
//   }, 5000);
// };

// const Alertes: React.FC = () => {
//   const [alertes, setAlertes] = useState<Alerte[]>([]);
//   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterSeverite, setFilterSeverite] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false);
//   const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
//   const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [selectedAlerteForIncident, setSelectedAlerteForIncident] = useState<Alerte | null>(null);
  
//   // États pour la confirmation de suppression
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [alerteToDelete, setAlerteToDelete] = useState<number | null>(null);
//   const [deleteMultiple, setDeleteMultiple] = useState(false);
  
//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);
//   const [currentUser] = useState(getCurrentUser());
//   const [refreshing, setRefreshing] = useState<boolean>(false);

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     nouvelles: 0,
//     enTraitement: 0,
//     resolues: 0,
//     critiques: 0,
//     elevees: 0,
//     moyennes: 0,
//     basses: 0
//   });

//   // Charger les alertes
//   const fetchAlertes = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des alertes...');
      
//       const response = await alertesAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log(`✅ ${extractedData.length} alertes chargées`);
//       setAlertes(extractedData);
      
//       // Calculer les statistiques
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement alertes:', err);
//       const errorMessage = handleApiError(err);
//       setError(errorMessage);
//       showNotification('error', errorMessage);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = (data: Alerte[]) => {
//     const stats = {
//       total: data.length,
//       nouvelles: data.filter(a => a.statut === 'nouvelle').length,
//       enTraitement: data.filter(a => a.statut === 'en_traitement').length,
//       resolues: data.filter(a => a.statut === 'resolue').length,
//       critiques: data.filter(a => a.severite === 'critique').length,
//       elevees: data.filter(a => a.severite === 'elevee').length,
//       moyennes: data.filter(a => a.severite === 'moyenne').length,
//       basses: data.filter(a => a.severite === 'basse').length
//     };
//     setStatistiques(stats);
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);
//       console.log('🔄 Chargement des données de relations...');

//       // Charger les matériels
//       let materielsData: any[] = [];
//       try {
//         const materielsResponse = await materielsAPI.getAll();
//         materielsData = extractDataFromResponse(materielsResponse);
//         console.log(`✅ ${materielsData.length} matériels chargés`);
//       } catch (materielError) {
//         console.error('❌ Erreur chargement matériels:', materielError);
//         showNotification('warning', 'Certains matériels n\'ont pas pu être chargés');
//       }

//       // Charger les incidents
//       let incidentsData: any[] = [];
//       try {
//         const incidentsResponse = await incidentsAPI.getAll();
//         incidentsData = extractDataFromResponse(incidentsResponse);
//         console.log(`✅ ${incidentsData.length} incidents chargés`);
//       } catch (incidentError) {
//         console.error('❌ Erreur chargement incidents:', incidentError);
//         showNotification('warning', 'Certains incidents n\'ont pas pu être chargés');
//       }

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showNotification('error', 'Erreur lors du chargement des données');
      
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Rafraîchir toutes les données
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([
//       fetchAlertes(),
//       fetchRelationsData()
//     ]);
//     showNotification('success', 'Données rafraîchies');
//   };

//   useEffect(() => {
//     fetchAlertes();
//     fetchRelationsData();
//   }, []);

//   useEffect(() => {
//     filterAlertes();
//   }, [alertes, searchTerm, filterSeverite, filterStatut, filterType]);

//   useEffect(() => {
//     if (filteredAlertes.length > 0 && selectedAlertes.length === filteredAlertes.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedAlertes, filteredAlertes]);

//   const filterAlertes = () => {
//     let filtered = safeArray(alertes);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(a => 
//         a.description?.toLowerCase().includes(searchLower) ||
//         (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchLower))
//       );
//     }

//     if (filterSeverite) {
//       filtered = filtered.filter(a => a.severite === filterSeverite);
//     }

//     if (filterStatut) {
//       filtered = filtered.filter(a => a.statut === filterStatut);
//     }

//     if (filterType) {
//       filtered = filtered.filter(a => a.type_alerte === filterType);
//     }

//     setFilteredAlertes(filtered);
//     setSelectedAlertes([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Gestion des alertes
//   const handleSubmit = async (alerteData: any) => {
//     try {
//       console.log('📤 Soumission des données alerte:', alerteData);
      
//       if (editingAlerte) {
//         await alertesAPI.update(editingAlerte.id, alerteData);
//         showNotification('success', '✅ Alerte modifiée avec succès');
//       } else {
//         await alertesAPI.create(alerteData);
//         showNotification('success', '✅ Alerte créée avec succès');
//       }
      
//       await fetchAlertes();
//       setIsFormOpen(false);
//       setEditingAlerte(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde alerte:', error);
//       const errorMessage = handleApiError(error);
//       showNotification('error', errorMessage);
//     }
//   };

//   // Gestion des incidents - SCÉNARIO 2
//   const handleCreateIncident = async (incidentData: any) => {
//     try {
//       console.log('📤 Création incident depuis alerte:', incidentData);
      
//       // Appeler l'API pour créer l'incident
//       const response = await incidentsAPI.create(incidentData);
//       console.log('✅ Réponse création incident:', response);
      
//       // Vérifier si la réponse contient un ID
//       const incidentId = response.data?.id || response.id || 
//                        (response.data && response.data.data && response.data.data.id);
      
//       if (!incidentId) {
//         throw new Error('L\'incident a été créé mais aucun ID n\'a été retourné');
//       }
      
//       // Si l'incident a été créé avec succès, mettre à jour l'alerte
//       if (selectedAlerteForIncident) {
//         try {
//           // Marquer l'alerte comme liée à un incident
//           await alertesAPI.update(selectedAlerteForIncident.id, {
//             ...selectedAlerteForIncident,
//             incident_associe_id: incidentId,
//             statut: 'en_traitement' // Mettre à jour le statut
//           });
          
//           showNotification('success', `✅ Incident #${incidentId} créé avec succès et alerte mise à jour`);
//         } catch (updateError) {
//           console.error('❌ Erreur mise à jour alerte:', updateError);
//           showNotification('warning', `⚠️ Incident #${incidentId} créé mais erreur lors de la mise à jour de l\'alerte`);
//         }
//       } else {
//         showNotification('success', `✅ Incident #${incidentId} créé avec succès`);
//       }
      
//       // Recharger les données
//       await Promise.all([
//         fetchAlertes(),
//         fetchRelationsData()
//       ]);
      
//       setIsIncidentFormOpen(false);
//       setSelectedAlerteForIncident(null);
      
//     } catch (error: any) {
//       console.error('❌ Erreur création incident:', error);
//       const errorMessage = handleApiError(error);
//       showNotification('error', errorMessage);
//     }
//   };

//   // Fonction pour ouvrir le formulaire d'incident depuis une alerte
//   const openIncidentFormFromAlerte = (alerte: Alerte) => {
//     // Vérifier si l'alerte peut créer un incident
//     const canCreateIncident = alerte.severite === 'critique' && 
//                              (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
    
//     if (!canCreateIncident) {
//       showNotification('warning', 'Seules les alertes critiques (nouvelle ou en traitement) peuvent créer des incidents');
//       return;
//     }
    
//     // Vérifier si l'alerte a déjà un incident
//     if (alerte.incident_associe_id) {
//       showNotification('info', 'Cette alerte a déjà un incident associé');
//       return;
//     }
    
//     console.log('🚨 Ouverture formulaire incident depuis alerte:', alerte);
//     setSelectedAlerteForIncident(alerte);
//     setIsIncidentFormOpen(true);
//   };

//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showNotification('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showNotification('warning', 
//         `Aucune donnée de relation disponible. 
//         Matériels: ${materiels.length} | 
//         Incidents: ${incidents.length}`
//       );
      
//       if (confirm('Voulez-vous recharger les données ?')) {
//         fetchRelationsData();
//       }
      
//       return;
//     }

//     console.log('✅ Données disponibles pour nouvelle alerte:', {
//       materiels: materiels.length,
//       incidents: incidents.length
//     });

//     setEditingAlerte(undefined);
//     setIsFormOpen(true);
//   };

//   const handleEdit = (alerte: Alerte) => {
//     if (loadingRelations) {
//       showNotification('info', 'Chargement des données en cours...');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showNotification('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
//       return;
//     }

//     setEditingAlerte(alerte);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectAlerte = (id: number) => {
//     setSelectedAlertes(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedAlertes([]);
//     } else {
//       const allIds = filteredAlertes.map(a => a.id);
//       setSelectedAlertes(allIds);
//     }
//   };

//   // Fonction pour demander confirmation de suppression multiple
//   const handleDeleteSelected = () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     setDeleteMultiple(true);
//     setShowDeleteConfirm(true);
//   };

//   // Fonction pour demander confirmation de suppression simple
//   const handleDelete = (id: number) => {
//     setAlerteToDelete(id);
//     setDeleteMultiple(false);
//     setShowDeleteConfirm(true);
//   };

//   // Fonction pour exécuter la suppression après confirmation
//   const confirmDelete = async () => {
//     try {
//       if (deleteMultiple) {
//         // Suppression multiple
//         const deletePromises = selectedAlertes.map(id => 
//           alertesAPI.delete(id).catch(err => {
//             console.error(`Erreur suppression alerte ${id}:`, err);
//             showNotification('warning', `Alerte #${id} non supprimée: ${handleApiError(err)}`);
//             return null;
//           })
//         );
        
//         const results = await Promise.all(deletePromises);
//         const successfulDeletes = results.filter(r => r !== null).length;
        
//         if (successfulDeletes > 0) {
//           showNotification('success', `${successfulDeletes} alerte(s) supprimée(s) avec succès`);
//         }
        
//         setSelectedAlertes([]);
//       } else if (alerteToDelete) {
//         // Suppression simple
//         await alertesAPI.delete(alerteToDelete);
//         showNotification('success', '✅ Alerte supprimée avec succès');
//       }
      
//       await fetchAlertes();
//     } catch (error: any) {
//       const errorMessage = handleApiError(error);
//       showNotification('error', `❌ Erreur suppression: ${errorMessage}`);
//     } finally {
//       // Réinitialiser les états de confirmation
//       setShowDeleteConfirm(false);
//       setAlerteToDelete(null);
//       setDeleteMultiple(false);
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     if (selectedAlertes.length === 1) {
//       const alerte = alertes.find(a => a.id === selectedAlertes[0]);
//       if (alerte) {
//         handleEdit(alerte);
//       }
//     } else {
//       showNotification('info', `Édition multiple de ${selectedAlertes.length} alertes`);
//     }
//   };

//   const handleTraiterSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     try {
//       const updatePromises = selectedAlertes.map(id => 
//         alertesAPI.update(id, { statut: 'en_traitement' }).catch(err => {
//           console.error(`Erreur traitement alerte ${id}:`, err);
//           showNotification('warning', `Alerte #${id} non traitée: ${handleApiError(err)}`);
//           return null;
//         })
//       );
      
//       const results = await Promise.all(updatePromises);
//       const successfulUpdates = results.filter(r => r !== null).length;
      
//       if (successfulUpdates > 0) {
//         showNotification('success', `${successfulUpdates} alerte(s) marquée(s) comme traitées`);
//       }
      
//       setSelectedAlertes([]);
//       await fetchAlertes();
//     } catch (error: any) {
//       showNotification('error', 'Erreur lors du traitement des alertes');
//     }
//   };

//   const handleResoudreSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     try {
//       const updatePromises = selectedAlertes.map(id => 
//         alertesAPI.update(id, { statut: 'resolue' }).catch(err => {
//           console.error(`Erreur résolution alerte ${id}:`, err);
//           showNotification('warning', `Alerte #${id} non résolue: ${handleApiError(err)}`);
//           return null;
//         })
//       );
      
//       const results = await Promise.all(updatePromises);
//       const successfulUpdates = results.filter(r => r !== null).length;
      
//       if (successfulUpdates > 0) {
//         showNotification('success', `${successfulUpdates} alerte(s) marquée(s) comme résolues`);
//       }
      
//       setSelectedAlertes([]);
//       await fetchAlertes();
//     } catch (error: any) {
//       showNotification('error', 'Erreur lors de la résolution des alertes');
//     }
//   };

//   const handleTraiter = async (id: number) => {
//     try {
//       await alertesAPI.update(id, { statut: 'en_traitement' });
//       showNotification('success', '✅ Alerte marquée comme traitée');
//       await fetchAlertes();
//     } catch (error: any) {
//       const errorMessage = handleApiError(error);
//       showNotification('error', `❌ Erreur traitement: ${errorMessage}`);
//     }
//   };

//   const handleResoudre = async (id: number) => {
//     try {
//       await alertesAPI.update(id, { statut: 'resolue' });
//       showNotification('success', '✅ Alerte marquée comme résolue');
//       await fetchAlertes();
//     } catch (error: any) {
//       const errorMessage = handleApiError(error);
//       showNotification('error', `❌ Erreur résolution: ${errorMessage}`);
//     }
//   };

//   // Fonctions d'affichage
//   const getSeveriteBadge = (severite: string) => {
//     const badges: Record<string, string> = {
//       critique: 'badge-error',
//       elevee: 'badge-warning',
//       moyenne: 'badge-info',
//       basse: 'badge-neutral'
//     };
//     return badges[severite] || 'badge-neutral';
//   };

//   const getSeveriteText = (severite: string) => {
//     const texts: Record<string, string> = {
//       critique: 'Critique',
//       elevee: 'Élevée',
//       moyenne: 'Moyenne',
//       basse: 'Basse'
//     };
//     return texts[severite] || severite;
//   };

//   const getSeveriteIcon = (severite: string) => {
//     switch (severite) {
//       case 'critique': return <AlertTriangle className="h-4 w-4" />;
//       case 'elevee': return <AlertTriangle className="h-4 w-4" />;
//       case 'moyenne': return <Bell className="h-4 w-4" />;
//       case 'basse': return <Info className="h-4 w-4" />;
//       default: return <Bell className="h-4 w-4" />;
//     }
//   };

//   const getStatutBadge = (statut: string) => {
//     const badges: Record<string, string> = {
//       nouvelle: 'badge-error',
//       en_traitement: 'badge-warning',
//       resolue: 'badge-success'
//     };
//     return badges[statut] || 'badge-neutral';
//   };

//   const getStatutText = (statut: string) => {
//     const texts: Record<string, string> = {
//       nouvelle: 'Nouvelle',
//       en_traitement: 'En traitement',
//       resolue: 'Résolue'
//     };
//     return texts[statut] || statut;
//   };

//   const getTypeText = (type: string) => {
//     const texts: Record<string, string> = {
//       securite: 'Sécurité',
//       performance: 'Performance',
//       panne: 'Panne',
//       maintenance: 'Maintenance'
//     };
//     return texts[type] || type;
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterSeverite('');
//     setFilterStatut('');
//     setFilterType('');
//     setSelectedAlertes([]);
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredAlertes.map(a => ({
//         Type: getTypeText(a.type_alerte),
//         Sévérité: getSeveriteText(a.severite),
//         Statut: getStatutText(a.statut),
//         Description: a.description,
//         'Matériel source': a.materiel_nom || 'Non spécifié',
//         'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée'
//       }));

//       if (dataToExport.length === 0) {
//         showNotification('error', 'Aucune donnée à exporter');
//         return;
//       }

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `alertes_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showNotification('success', '✅ Export CSV réussi !');
//     } catch (error) {
//       showNotification('error', '❌ Erreur lors de l\'export');
//     }
//   };

//   const getAlertClass = (type: 'success' | 'error' | 'info' | 'warning') => {
//     switch (type) {
//       case 'success': return 'alert-success';
//       case 'error': return 'alert-error';
//       case 'warning': return 'alert-warning';
//       case 'info': return 'alert-info';
//       default: return 'alert-info';
//     }
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des alertes...</p>
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
//                 ? `Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ?`
//                 : 'Êtes-vous sûr de vouloir supprimer cette alerte ?'
//               }
//             </p>
//             <div className="modal-action">
//               <button 
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setAlerteToDelete(null);
//                   setDeleteMultiple(false);
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

//       {/* Messages locaux */}
//       {message && (
//         <div className={`alert ${getAlertClass(message.type)} mb-4 shadow-lg`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4 shadow-lg">
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button className="btn btn-ghost btn-sm" onClick={fetchAlertes}>
//             Réessayer
//           </button>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Alertes</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredAlertes.length} alerte(s) trouvée(s)
//             {selectedAlertes.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedAlertes.length} sélectionnée(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2 flex-wrap">
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
//             disabled={loadingRelations}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle alerte
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Bell className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.nouvelles}</h3>
//             <p className="text-sm opacity-60">Nouvelles</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-warning">{statistiques.enTraitement}</h3>
//             <p className="text-sm opacity-60">En traitement</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.resolues}</h3>
//             <p className="text-sm opacity-60">Résolues</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.critiques}</h3>
//             <p className="text-sm opacity-60">Critiques</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-warning">{statistiques.elevees}</h3>
//             <p className="text-sm opacity-60">Élevées</p>
//           </div>
//         </div>

//         <div className="card bg-info/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Bell className="h-6 w-6 text-info mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-info">{statistiques.moyennes}</h3>
//             <p className="text-sm opacity-60">Moyennes</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Info className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.basses}</h3>
//             <p className="text-sm opacity-60">Basses</p>
//           </div>
//         </div>
//       </div>

//       {/* Filtres et recherche */}
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
//                   placeholder="Description, matériel..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Sévérité</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterSeverite}
//                 onChange={(e) => setFilterSeverite(e.target.value)}
//               >
//                 <option value="">Toutes les sévérités</option>
//                 <option value="critique">Critique</option>
//                 <option value="elevee">Élevée</option>
//                 <option value="moyenne">Moyenne</option>
//                 <option value="basse">Basse</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📈 Statut</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterStatut}
//                 onChange={(e) => setFilterStatut(e.target.value)}
//               >
//                 <option value="">Tous les statuts</option>
//                 <option value="nouvelle">Nouvelle</option>
//                 <option value="en_traitement">En traitement</option>
//                 <option value="resolue">Résolue</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔧 Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="securite">Sécurité</option>
//                 <option value="performance">Performance</option>
//                 <option value="panne">Panne</option>
//                 <option value="maintenance">Maintenance</option>
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
//           {selectedAlertes.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedAlertes.length} alerte(s) sélectionnée(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={handleTraiterSelected}
//                     className="btn btn-warning btn-sm gap-2"
//                   >
//                     <Bell className="h-4 w-4" />
//                     Traiter ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleResoudreSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Résoudre ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedAlertes([])}
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

//       {/* Tableau des alertes */}
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
//                   <th className="font-bold">Type alerte</th>
//                   <th className="font-bold">Sévérité</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold">Description</th>
//                   <th className="font-bold">Source</th>
//                   <th className="font-bold">Date alerte</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAlertes.map((alerte) => {
//                   // Vérifier si cette alerte peut créer un incident
//                   const canCreateIncident = alerte.severite === 'critique' && 
//                                            (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
                  
//                   return (
//                     <tr key={alerte.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm"
//                             checked={selectedAlertes.includes(alerte.id)}
//                             onChange={() => toggleSelectAlerte(alerte.id)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="font-medium">
//                           {getTypeText(alerte.type_alerte)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getSeveriteBadge(alerte.severite)} badge-lg gap-1`}>
//                           {getSeveriteIcon(alerte.severite)}
//                           {getSeveriteText(alerte.severite)}
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getStatutBadge(alerte.statut)} badge-lg`}>
//                           {getStatutText(alerte.statut)}
//                         </div>
//                       </td>
//                       <td className="max-w-xs">
//                         <div className="line-clamp-2 text-sm">
//                           {alerte.description}
//                           {alerte.incident_associe_id && (
//                             <span className="ml-2 text-xs text-info">
//                               (Incident #{alerte.incident_associe_id})
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           {alerte.materiel_nom && (
//                             <div className="flex items-center gap-1">
//                               <HardDrive className="h-3 w-3" />
//                               {alerte.materiel_nom}
//                             </div>
//                           )}
//                           {!alerte.materiel_nom && (
//                             <span className="text-base-content opacity-50">-</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="text-sm">
//                           <div className="flex items-center gap-1">
//                             <Clock className="h-3 w-3 opacity-50" />
//                             {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : '-'}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
                          
//                           {/* BOUTON "CRÉER INCIDENT" - SCÉNARIO 2 */}
//                           {canCreateIncident && (
//                             <button
//                               onClick={() => openIncidentFormFromAlerte(alerte)}
//                               className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
//                               title="Créer un incident depuis cette alerte"
//                             >
//                               <AlertCircle className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           {alerte.statut === 'nouvelle' && (
//                             <button
//                               onClick={() => handleTraiter(alerte.id)}
//                               className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
//                               title="Marquer en traitement"
//                             >
//                               <Bell className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           {alerte.statut !== 'resolue' && (
//                             <button
//                               onClick={() => handleResoudre(alerte.id)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Marquer comme résolue"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           <button
//                             onClick={() => handleEdit(alerte)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
                          
//                           <button
//                             onClick={() => handleDelete(alerte.id)}
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

//           {filteredAlertes.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Bell className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucune alerte trouvée</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterSeverite || filterStatut || filterType
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucune alerte n'est enregistrée dans le système"
//                   }
//                 </p>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-primary btn-sm mt-4"
//                   disabled={loadingRelations}
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Créer la première alerte
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'alerte */}
//       <AlerteForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingAlerte(undefined);
//         }}
//         onSubmit={handleSubmit}
//         alerte={editingAlerte}
//         materiels={materiels}
//         incidents={incidents}
//       />

//       {/* Formulaire d'incident - SCÉNARIO 2 */}
//       {selectedAlerteForIncident && (
//         <IncidentForm
//           isOpen={isIncidentFormOpen}
//           onClose={() => {
//             setIsIncidentFormOpen(false);
//             setSelectedAlerteForIncident(null);
//           }}
//           onSubmit={handleCreateIncident}
//           currentUser={currentUser}
//           alerteSource={selectedAlerteForIncident}
//         />
//       )}
//     </div>
//   );
// };

// export default Alertes;

// // src/pages/Alertes.tsx - VERSION CORRIGÉE
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, Search, Edit, Trash2, Download, 
//   Bell, AlertTriangle, CheckCircle, 
//   CheckSquare, Square, X, RefreshCw,
//   Clock, HardDrive, Eye
// } from 'lucide-react';
// import { Alerte } from '../types';
// import AlerteForm from '../components/AlerteForm';
// import IncidentForm from '../components/IncidentForm';
// import { 
//   alertesAPI, 
//   materielsAPI, 
//   incidentsAPI,
//   handleApiError 
// } from '../services/api';

// // Fonctions helper
// const safeArray = (data: any): Alerte[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   if (data.data && Array.isArray(data.data)) return data.data;
//   if (data.results && Array.isArray(data.results)) return data.results;
//   return [];
// };

// const extractDataFromResponse = (response: any): any[] => {
//   if (!response) return [];
  
//   if (Array.isArray(response)) return response;
  
//   if (response.data !== undefined) {
//     if (Array.isArray(response.data)) return response.data;
    
//     if (response.data.results && Array.isArray(response.data.results)) {
//       return response.data.results;
//     }
    
//     if (response.data.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }
    
//     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
//       return [response.data];
//     }
//   }
  
//   if (response.results && Array.isArray(response.results)) {
//     return response.results;
//   }
  
//   return [];
// };

// // Fonction pour simuler un utilisateur courant
// const getCurrentUser = () => {
//   return {
//     id: 1,
//     username: "admin",
//     first_name: "Admin",
//     last_name: "System",
//     email: "admin@system.com",
//     role: "admin",
//     departement: "IT",
//     is_active: true,
//     date_joined: new Date().toISOString()
//   };
// };

// // Fonction de notification améliorée
// const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
//   const notification = document.createElement('div');
//   notification.className = `fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slideInRight ${
//     type === 'success' ? 'bg-green-500 text-white' :
//     type === 'error' ? 'bg-red-500 text-white' :
//     type === 'warning' ? 'bg-yellow-500 text-white' :
//     'bg-blue-500 text-white'
//   }`;
  
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

// const Alertes: React.FC = () => {
//   const [alertes, setAlertes] = useState<Alerte[]>([]);
//   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterSeverite, setFilterSeverite] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false);
//   const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
//   const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [selectedAlerteForIncident, setSelectedAlerteForIncident] = useState<Alerte | null>(null);
  
//   // États pour la confirmation de suppression
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [alerteToDelete, setAlerteToDelete] = useState<number | null>(null);
//   const [deleteMultiple, setDeleteMultiple] = useState(false);
  
//   // États pour les données de relations
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);
//   const [currentUser] = useState(getCurrentUser());
//   const [refreshing, setRefreshing] = useState<boolean>(false);

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     nouvelles: 0,
//     enTraitement: 0,
//     resolues: 0,
//     critiques: 0,
//     elevees: 0,
//     moyennes: 0,
//     basses: 0,
//     alertesPanne: 0,
//     alertesAutomatiques: 0
//   });

//   // Fonction pour vérifier l'état du matériel
//   const verifierEtatMateriel = (materiel: any): string => {
//     if (materiel.etat === 'fonctionnel') return 'fonctionnel';
//     if (materiel.etat === 'en_panne') return 'en_panne';
//     if (materiel.etat === 'en_reparation') return 'en_reparation';
//     if (materiel.etat === 'repare') return 'repare';
//     return 'inconnu';
//   };

//   // Vérifier et résoudre automatiquement les alertes selon l'état du matériel
//   const verifierEtResoudreAlertesAutomatiquement = () => {
//     let alertesResolues = 0;
//     let alertesMisesAJour = [...alertes];

//     alertesMisesAJour.forEach((alerte, index) => {
//       // Vérifier si l'alerte est liée à un matériel
//       if (alerte.materiel_concerne) {
//         const materiel = materiels.find(m => m.id === alerte.materiel_concerne);
        
//         if (materiel) {
//           const etatMateriel = verifierEtatMateriel(materiel);
          
//           // Si le matériel est fonctionnel ou réparé, et que l'alerte est encore active
//           if ((etatMateriel === 'fonctionnel' || etatMateriel === 'repare') && 
//               (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement')) {
            
//             // Marquer automatiquement l'alerte comme résolue
//             alertesMisesAJour[index] = {
//               ...alerte,
//               statut: 'resolue',
//               date_resolution: new Date().toISOString(),
//               notes: `Alerte résolue automatiquement - Matériel ${etatMateriel === 'repare' ? 'réparé' : 'fonctionnel'}`
//             };
            
//             alertesResolues++;
            
//             // Afficher une notification
//             showNotification('info', 
//               `Alerte #${alerte.id} résolue automatiquement (matériel ${etatMateriel})`, 
//               '🔧 Synchronisation automatique'
//             );
//           }
          
//           // Si le matériel est en panne et l'alerte n'existe pas encore, créer une alerte automatique
//           if (etatMateriel === 'en_panne' && !alerte) {
//             const nouvelleAlerte = {
//               id: Date.now(), // ID temporaire
//               type_alerte: 'panne',
//               severite: 'critique',
//               statut: 'nouvelle',
//               description: `🚨 ALERTE URGENTE - ${materiel.nom} est en panne. Nécessite une intervention immédiate.`,
//               materiel_concerne: materiel.id,
//               materiel_nom: materiel.nom,
//               date_alerte: new Date().toISOString(),
//               source: 'automatique'
//             };
            
//             alertesMisesAJour.push(nouvelleAlerte as Alerte);
//             showNotification('warning', 
//               `Nouvelle alerte créée pour ${materiel.nom}`, 
//               '🚨 Détection automatique'
//             );
//           }
//         }
//       }
//     });

//     // Mettre à jour les alertes si des changements ont été effectués
//     if (alertesResolues > 0) {
//       setAlertes(alertesMisesAJour);
//       showNotification('success', 
//         `${alertesResolues} alerte(s) résolue(s) automatiquement`, 
//         '✅ Synchronisation terminée'
//       );
      
//       // Recalculer les statistiques
//       calculerStatistiques(alertesMisesAJour);
//     }
//   };

//   // Charger les alertes
//   const fetchAlertes = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Chargement des alertes...');
      
//       const response = await alertesAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       console.log(`✅ ${extractedData.length} alertes chargées`);
//       setAlertes(extractedData);
      
//       // Calculer les statistiques
//       calculerStatistiques(extractedData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement alertes:', err);
//       const errorMessage = handleApiError(err);
//       setError(errorMessage);
//       showNotification('error', errorMessage, 'Erreur de chargement');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Fonction pour calculer les statistiques
//   const calculerStatistiques = (data: Alerte[]) => {
//     let alertesPanne = 0;
//     let alertesAutomatiques = 0;

//     data.forEach(alerte => {
//       // Compter les alertes de panne
//       if (alerte.type_alerte === 'panne') {
//         alertesPanne++;
//       }
      
//       // Compter les alertes automatiques
//       if (alerte.source === 'automatique') {
//         alertesAutomatiques++;
//       }
//     });

//     const stats = {
//       total: data.length,
//       nouvelles: data.filter(a => a.statut === 'nouvelle').length,
//       enTraitement: data.filter(a => a.statut === 'en_traitement').length,
//       resolues: data.filter(a => a.statut === 'resolue').length,
//       critiques: data.filter(a => a.severite === 'critique').length,
//       elevees: data.filter(a => a.severite === 'elevee').length,
//       moyennes: data.filter(a => a.severite === 'moyenne').length,
//       basses: data.filter(a => a.severite === 'basse').length,
//       alertesPanne,
//       alertesAutomatiques
//     };
//     setStatistiques(stats);
//   };

//   // Charger les données de relations
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);
//       console.log('🔄 Chargement des données de relations...');

//       // Charger les matériels
//       let materielsData: any[] = [];
//       try {
//         const materielsResponse = await materielsAPI.getAll();
//         materielsData = extractDataFromResponse(materielsResponse);
//         console.log(`✅ ${materielsData.length} matériels chargés`);
//       } catch (materielError) {
//         console.error('❌ Erreur chargement matériels:', materielError);
//         showNotification('warning', 'Certains matériels n\'ont pas pu être chargés', 'Avertissement');
//       }

//       // Charger les incidents
//       let incidentsData: any[] = [];
//       try {
//         const incidentsResponse = await incidentsAPI.getAll();
//         incidentsData = extractDataFromResponse(incidentsResponse);
//         console.log(`✅ ${incidentsData.length} incidents chargés`);
//       } catch (incidentError) {
//         console.error('❌ Erreur chargement incidents:', incidentError);
//         showNotification('warning', 'Certains incidents n\'ont pas pu être chargés', 'Avertissement');
//       }

//       setMateriels(materielsData);
//       setIncidents(incidentsData);

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       showNotification('error', 'Erreur lors du chargement des données', 'Erreur');
      
//       setMateriels([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   // Rafraîchir toutes les données
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     showNotification('info', 'Rafraîchissement des données en cours...', '🔄 Synchronisation');
    
//     await Promise.all([
//       fetchAlertes(),
//       fetchRelationsData()
//     ]);
    
//     // Vérifier et résoudre les alertes automatiquement
//     if (materiels.length > 0) {
//       verifierEtResoudreAlertesAutomatiquement();
//     }
    
//     showNotification('success', 'Données rafraîchies avec succès', '✅ Synchronisation terminée');
//   };

//   useEffect(() => {
//     fetchAlertes();
//     fetchRelationsData();
//   }, []);

//   useEffect(() => {
//     filterAlertes();
//   }, [alertes, searchTerm, filterSeverite, filterStatut]);

//   // Appeler la vérification automatique quand les matériels ou alertes changent
//   useEffect(() => {
//     if (alertes.length > 0 && materiels.length > 0) {
//       verifierEtResoudreAlertesAutomatiquement();
//     }
//   }, [materiels, alertes.length]);

//   useEffect(() => {
//     if (filteredAlertes.length > 0 && selectedAlertes.length === filteredAlertes.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedAlertes, filteredAlertes]);

//   const filterAlertes = () => {
//     let filtered = safeArray(alertes);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(a => 
//         a.description?.toLowerCase().includes(searchLower) ||
//         (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchLower))
//       );
//     }

//     if (filterSeverite) {
//       filtered = filtered.filter(a => a.severite === filterSeverite);
//     }

//     if (filterStatut) {
//       filtered = filtered.filter(a => a.statut === filterStatut);
//     }

//     setFilteredAlertes(filtered);
//     setSelectedAlertes([]);
//   };

//   // Gestion des alertes
//   const handleSubmit = async (alerteData: any) => {
//     try {
//       console.log('📤 Soumission des données alerte:', alerteData);
      
//       if (editingAlerte) {
//         await alertesAPI.update(editingAlerte.id, alerteData);
//         showNotification('success', 'Alerte modifiée avec succès', '✅ Modification réussie');
//       } else {
//         await alertesAPI.create(alerteData);
//         showNotification('success', 'Alerte créée avec succès', '✅ Création réussie');
//       }
      
//       await fetchAlertes();
//       setIsFormOpen(false);
//       setEditingAlerte(undefined);
//     } catch (error: any) {
//       console.error('❌ Erreur sauvegarde alerte:', error);
//       const errorMessage = handleApiError(error);
//       showNotification('error', errorMessage, '❌ Erreur');
//     }
//   };

//   // Gestion des incidents - SCÉNARIO 2
//   const handleCreateIncident = async (incidentData: any) => {
//     try {
//       console.log('📤 Création incident depuis alerte:', incidentData);
      
//       // Appeler l'API pour créer l'incident
//       const response = await incidentsAPI.create(incidentData);
//       console.log('✅ Réponse création incident:', response);
      
//       const incidentId = response.data?.id || response.id || 
//                        (response.data && response.data.data && response.data.data.id);
      
//       if (!incidentId) {
//         throw new Error('L\'incident a été créé mais aucun ID n\'a été retourné');
//       }
      
//       // Si l'incident a été créé avec succès, mettre à jour l'alerte
//       if (selectedAlerteForIncident) {
//         try {
//           await alertesAPI.update(selectedAlerteForIncident.id, {
//             ...selectedAlerteForIncident,
//             incident_associe_id: incidentId,
//             statut: 'en_traitement'
//           });
          
//           showNotification('success', 
//             `Incident #${incidentId} créé avec succès et alerte mise à jour`, 
//             '🚨 Incident créé'
//           );
//         } catch (updateError) {
//           console.error('❌ Erreur mise à jour alerte:', updateError);
//           showNotification('warning', 
//             `Incident #${incidentId} créé mais erreur lors de la mise à jour de l'alerte`, 
//             '⚠️ Avertissement'
//           );
//         }
//       } else {
//         showNotification('success', `Incident #${incidentId} créé avec succès`, '✅ Incident créé');
//       }
      
//       // Recharger les données
//       await Promise.all([
//         fetchAlertes(),
//         fetchRelationsData()
//       ]);
      
//       setIsIncidentFormOpen(false);
//       setSelectedAlerteForIncident(null);
      
//     } catch (error: any) {
//       console.error('❌ Erreur création incident:', error);
//       const errorMessage = handleApiError(error);
//       showNotification('error', errorMessage, '❌ Erreur');
//     }
//   };

//   // Fonction pour ouvrir le formulaire d'incident depuis une alerte
//   const openIncidentFormFromAlerte = (alerte: Alerte) => {
//     // Vérifier si l'alerte peut créer un incident
//     const canCreateIncident = alerte.severite === 'critique' && 
//                              (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
    
//     if (!canCreateIncident) {
//       showNotification('warning', 
//         'Seules les alertes critiques (nouvelle ou en traitement) peuvent créer des incidents', 
//         'ℹ️ Information'
//       );
//       return;
//     }
    
//     // Vérifier si l'alerte a déjà un incident
//     if (alerte.incident_associe_id) {
//       showNotification('info', 'Cette alerte a déjà un incident associé', 'ℹ️ Information');
//       return;
//     }
    
//     console.log('🚨 Ouverture formulaire incident depuis alerte:', alerte);
//     setSelectedAlerteForIncident(alerte);
//     setIsIncidentFormOpen(true);
//   };

//   const handleAddNew = () => {
//     if (loadingRelations) {
//       showNotification('info', 'Chargement des données en cours... Veuillez patienter.', '🔄 Chargement');
//       return;
//     }
    
//     const hasRelationsData = materiels.length > 0;
    
//     if (!hasRelationsData) {
//       showNotification('warning', 
//         `Aucune donnée de matériel disponible`, 
//         '⚠️ Données manquantes'
//       );
      
//       if (confirm('Voulez-vous recharger les données ?')) {
//         fetchRelationsData();
//       }
      
//       return;
//     }

//     setEditingAlerte(undefined);
//     setIsFormOpen(true);
//   };

//   const handleEdit = (alerte: Alerte) => {
//     if (loadingRelations) {
//       showNotification('info', 'Chargement des données en cours...', '🔄 Chargement');
//       return;
//     }

//     const hasRelationsData = materiels.length > 0;
    
//     if (!hasRelationsData) {
//       showNotification('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.', '⚠️ Données manquantes');
//       return;
//     }

//     setEditingAlerte(alerte);
//     setIsFormOpen(true);
//   };

//   // Fonctions de sélection
//   const toggleSelectAlerte = (id: number) => {
//     setSelectedAlertes(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedAlertes([]);
//       showNotification('info', 'Sélection annulée', 'ℹ️ Information');
//     } else {
//       const allIds = filteredAlertes.map(a => a.id);
//       setSelectedAlertes(allIds);
//       showNotification('success', `${allIds.length} alertes sélectionnées`, '✅ Sélection');
//     }
//   };

//   // Fonction pour demander confirmation de suppression multiple
//   const handleDeleteSelected = () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée', '❌ Erreur');
//       return;
//     }

//     setDeleteMultiple(true);
//     setShowDeleteConfirm(true);
//   };

//   // Fonction pour demander confirmation de suppression simple
//   const handleDelete = (id: number) => {
//     setAlerteToDelete(id);
//     setDeleteMultiple(false);
//     setShowDeleteConfirm(true);
//   };

//   // Fonction pour exécuter la suppression après confirmation
//   const confirmDelete = async () => {
//     try {
//       if (deleteMultiple) {
//         // Suppression multiple
//         const deletePromises = selectedAlertes.map(id => 
//           alertesAPI.delete(id).catch(err => {
//             console.error(`Erreur suppression alerte ${id}:`, err);
//             showNotification('warning', `Alerte #${id} non supprimée: ${handleApiError(err)}`, '⚠️ Avertissement');
//             return null;
//           })
//         );
        
//         const results = await Promise.all(deletePromises);
//         const successfulDeletes = results.filter(r => r !== null).length;
        
//         if (successfulDeletes > 0) {
//           showNotification('success', `${successfulDeletes} alerte(s) supprimée(s) avec succès`, '✅ Suppression réussie');
//         }
        
//         setSelectedAlertes([]);
//       } else if (alerteToDelete) {
//         // Suppression simple
//         await alertesAPI.delete(alerteToDelete);
//         showNotification('success', 'Alerte supprimée avec succès', '✅ Suppression réussie');
//       }
      
//       await fetchAlertes();
//     } catch (error: any) {
//       const errorMessage = handleApiError(error);
//       showNotification('error', `Erreur suppression: ${errorMessage}`, '❌ Erreur');
//     } finally {
//       setShowDeleteConfirm(false);
//       setAlerteToDelete(null);
//       setDeleteMultiple(false);
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée', '❌ Erreur');
//       return;
//     }

//     if (selectedAlertes.length === 1) {
//       const alerte = alertes.find(a => a.id === selectedAlertes[0]);
//       if (alerte) {
//         handleEdit(alerte);
//       }
//     } else {
//       showNotification('info', `Édition multiple de ${selectedAlertes.length} alertes`, 'ℹ️ Information');
//     }
//   };

//   const handleTraiterSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée', '❌ Erreur');
//       return;
//     }

//     try {
//       const updatePromises = selectedAlertes.map(id => 
//         alertesAPI.update(id, { statut: 'en_traitement' }).catch(err => {
//           console.error(`Erreur traitement alerte ${id}:`, err);
//           showNotification('warning', `Alerte #${id} non traitée: ${handleApiError(err)}`, '⚠️ Avertissement');
//           return null;
//         })
//       );
      
//       const results = await Promise.all(updatePromises);
//       const successfulUpdates = results.filter(r => r !== null).length;
      
//       if (successfulUpdates > 0) {
//         showNotification('success', `${successfulUpdates} alerte(s) marquée(s) comme traitées`, '✅ Traitement réussi');
//       }
      
//       setSelectedAlertes([]);
//       await fetchAlertes();
//     } catch (error: any) {
//       showNotification('error', 'Erreur lors du traitement des alertes', '❌ Erreur');
//     }
//   };

//   const handleResoudreSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showNotification('error', 'Aucune alerte sélectionnée', '❌ Erreur');
//       return;
//     }

//     try {
//       const updatePromises = selectedAlertes.map(id => 
//         alertesAPI.update(id, { 
//           statut: 'resolue',
//           date_resolution: new Date().toISOString()
//         }).catch(err => {
//           console.error(`Erreur résolution alerte ${id}:`, err);
//           showNotification('warning', `Alerte #${id} non résolue: ${handleApiError(err)}`, '⚠️ Avertissement');
//           return null;
//         })
//       );
      
//       const results = await Promise.all(updatePromises);
//       const successfulUpdates = results.filter(r => r !== null).length;
      
//       if (successfulUpdates > 0) {
//         showNotification('success', `${successfulUpdates} alerte(s) marquée(s) comme résolues`, '✅ Résolution réussie');
//       }
      
//       setSelectedAlertes([]);
//       await fetchAlertes();
//     } catch (error: any) {
//       showNotification('error', 'Erreur lors de la résolution des alertes', '❌ Erreur');
//     }
//   };

//   const handleTraiter = async (id: number) => {
//     try {
//       await alertesAPI.update(id, { statut: 'en_traitement' });
//       showNotification('success', 'Alerte marquée comme traitée', '✅ Traitement réussi');
//       await fetchAlertes();
//     } catch (error: any) {
//       const errorMessage = handleApiError(error);
//       showNotification('error', `Erreur traitement: ${errorMessage}`, '❌ Erreur');
//     }
//   };

//   const handleResoudre = async (id: number) => {
//     try {
//       await alertesAPI.update(id, { 
//         statut: 'resolue',
//         date_resolution: new Date().toISOString()
//       });
//       showNotification('success', 'Alerte marquée comme résolue', '✅ Résolution réussie');
//       await fetchAlertes();
//     } catch (error: any) {
//       const errorMessage = handleApiError(error);
//       showNotification('error', `Erreur résolution: ${errorMessage}`, '❌ Erreur');
//     }
//   };

//   // Fonctions d'affichage
//   const getSeveriteBadge = (severite: string) => {
//     const badges: Record<string, string> = {
//       critique: 'badge-error',
//       elevee: 'badge-warning',
//       moyenne: 'badge-info',
//       basse: 'badge-neutral'
//     };
//     return badges[severite] || 'badge-neutral';
//   };

//   const getSeveriteText = (severite: string) => {
//     const texts: Record<string, string> = {
//       critique: 'Critique',
//       elevee: 'Élevée',
//       moyenne: 'Moyenne',
//       basse: 'Basse'
//     };
//     return texts[severite] || severite;
//   };

//   const getSeveriteIcon = (severite: string) => {
//     switch (severite) {
//       case 'critique': return <AlertTriangle className="h-4 w-4" />;
//       case 'elevee': return <AlertTriangle className="h-4 w-4" />;
//       case 'moyenne': return <Bell className="h-4 w-4" />;
//       case 'basse': return <Bell className="h-4 w-4" />;
//       default: return <Bell className="h-4 w-4" />;
//     }
//   };

//   const getStatutBadge = (statut: string) => {
//     const badges: Record<string, string> = {
//       nouvelle: 'badge-error',
//       en_traitement: 'badge-warning',
//       resolue: 'badge-success'
//     };
//     return badges[statut] || 'badge-neutral';
//   };

//   const getStatutText = (statut: string) => {
//     const texts: Record<string, string> = {
//       nouvelle: 'Nouvelle',
//       en_traitement: 'En traitement',
//       resolue: 'Résolue'
//     };
//     return texts[statut] || statut;
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterSeverite('');
//     setFilterStatut('');
//     setSelectedAlertes([]);
//     showNotification('info', 'Filtres réinitialisés', 'ℹ️ Information');
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredAlertes.map(a => ({
//         Sévérité: getSeveriteText(a.severite),
//         Statut: getStatutText(a.statut),
//         Description: a.description,
//         'Matériel source': a.materiel_nom || 'Non spécifié',
//         'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date résolution': a.date_resolution ? new Date(a.date_resolution).toLocaleDateString('fr-FR') : 'Non résolue'
//       }));

//       if (dataToExport.length === 0) {
//         showNotification('error', 'Aucune donnée à exporter', '❌ Erreur');
//         return;
//       }

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `alertes_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showNotification('success', 'Export CSV réussi !', '✅ Export');
//     } catch (error) {
//       showNotification('error', 'Erreur lors de l\'export', '❌ Erreur');
//     }
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des alertes...</p>
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
//             <p className="py-4">
//               {deleteMultiple 
//                 ? `Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ? Cette action est irréversible.`
//                 : 'Êtes-vous sûr de vouloir supprimer cette alerte ? Cette action est irréversible.'
//               }
//             </p>
//             <div className="modal-action">
//               <button 
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setAlerteToDelete(null);
//                   setDeleteMultiple(false);
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

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
//             <Bell className="h-8 w-8 text-primary" />
//             Gestion des Alertes
//           </h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredAlertes.length} alerte(s) trouvée(s)
//             {selectedAlertes.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedAlertes.length} sélectionnée(s))
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
//             onClick={handleExport}
//             className="btn btn-outline btn-sm"
//             title="Exporter"
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvelle alerte
//           </button>
//         </div>
//       </div>

//       {/* Section Statistiques */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Bell className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total alertes</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Bell className="h-8 w-8 text-error" />
//             </div>
//             <h3 className="text-3xl font-bold text-error mb-1">{statistiques.nouvelles}</h3>
//             <p className="text-sm opacity-60">Nouvelles</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <RefreshCw className="h-8 w-8 text-warning" />
//             </div>
//             <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.enTraitement}</h3>
//             <p className="text-sm opacity-60">En traitement</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <CheckCircle className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-3xl font-bold text-success mb-1">{statistiques.resolues}</h3>
//             <p className="text-sm opacity-60">Résolues</p>
//           </div>
//         </div>
//       </div>

//       {/* Autres statistiques */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//         <div className="card bg-error/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <AlertTriangle className="h-8 w-8 text-error" />
//             </div>
//             <h3 className="text-2xl font-bold text-error mb-1">{statistiques.critiques}</h3>
//             <p className="text-sm opacity-60">Critiques</p>
//           </div>
//         </div>

//         <div className="card bg-warning/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <HardDrive className="h-8 w-8 text-warning" />
//             </div>
//             <h3 className="text-2xl font-bold text-warning mb-1">{statistiques.alertesPanne}</h3>
//             <p className="text-sm opacity-60">Alertes panne</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-lg">
//           <div className="card-body p-4 text-center">
//             <div className="flex justify-center mb-2">
//               <Bell className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-2xl font-bold text-success mb-1">{statistiques.alertesAutomatiques}</h3>
//             <p className="text-sm opacity-60">Automatiques</p>
//           </div>
//         </div>
//       </div>

//       {/* Filtres */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Description, matériel..."
//                 className="input input-bordered w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Sévérité</span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 value={filterSeverite}
//                 onChange={(e) => setFilterSeverite(e.target.value)}
//               >
//                 <option value="">Toutes les sévérités</option>
//                 <option value="critique">Critique</option>
//                 <option value="elevee">Élevée</option>
//                 <option value="moyenne">Moyenne</option>
//                 <option value="basse">Basse</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center gap-1">
//                   <RefreshCw className="h-4 w-4" />
//                   Statut
//                 </span>
//               </label>
//               <select
//                 className="select select-bordered w-full"
//                 value={filterStatut}
//                 onChange={(e) => setFilterStatut(e.target.value)}
//               >
//                 <option value="">Tous les statuts</option>
//                 <option value="nouvelle">Nouvelle</option>
//                 <option value="en_traitement">En traitement</option>
//                 <option value="resolue">Résolue</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔄 Actions</span>
//               </label>
//               <div className="flex gap-2">
//                 <button
//                   onClick={resetFilters}
//                   className="btn btn-ghost btn-sm flex-1"
//                 >
//                   <X className="h-4 w-4 mr-2" />
//                   Réinitialiser
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-between items-center mt-4">
//             <div className="flex gap-2">
//               {selectedAlertes.length > 0 && (
//                 <>
//                   <button
//                     onClick={handleTraiterSelected}
//                     className="btn btn-warning btn-sm"
//                   >
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                     Traiter ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleResoudreSelected}
//                     className="btn btn-success btn-sm"
//                   >
//                     <CheckCircle className="h-4 w-4 mr-2" />
//                     Résoudre ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-outline btn-sm"
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Modifier ({selectedAlertes.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-error btn-sm"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Supprimer ({selectedAlertes.length})
//                   </button>
//                 </>
//               )}
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
//                   <th>Description</th>
//                   <th>Sévérité</th>
//                   <th>Statut</th>
//                   <th>Matériel</th>
//                   <th>Date</th>
//                   <th className="text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAlertes.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-8">
//                       <div className="flex flex-col items-center gap-2">
//                         <Bell className="h-12 w-12 text-base-content opacity-30" />
//                         <p className="text-base-content opacity-50">
//                           {searchTerm || filterSeverite || filterStatut ? 'Aucune alerte correspondant aux filtres' : 'Aucune alerte trouvée'}
//                         </p>
//                         <button 
//                           onClick={searchTerm || filterSeverite || filterStatut ? resetFilters : handleAddNew}
//                           className="btn btn-sm btn-primary mt-2"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           {searchTerm || filterSeverite || filterStatut ? 'Réinitialiser les filtres' : 'Créer une première alerte'}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredAlertes.map(alerte => {
//                     // Vérifier si cette alerte peut créer un incident
//                     const canCreateIncident = alerte.severite === 'critique' && 
//                                              (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
                    
//                     return (
//                       <tr key={alerte.id} className="hover:bg-base-100/50">
//                         <td>
//                           <div className="flex items-center">
//                             <input
//                               type="checkbox"
//                               className="checkbox checkbox-xs"
//                               checked={selectedAlertes.includes(alerte.id)}
//                               onChange={() => toggleSelectAlerte(alerte.id)}
//                             />
//                           </div>
//                         </td>
//                         <td>
//                           <div className="text-sm max-w-[250px] truncate">
//                             {alerte.description}
//                             {alerte.source === 'automatique' && (
//                               <span className="ml-2 text-xs text-info">(Auto)</span>
//                             )}
//                             {alerte.incident_associe_id && (
//                               <span className="ml-2 text-xs text-warning">
//                                 (Incident #{alerte.incident_associe_id})
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           <div className={`badge gap-2 ${getSeveriteBadge(alerte.severite)}`}>
//                             {getSeveriteIcon(alerte.severite)}
//                             {getSeveriteText(alerte.severite)}
//                           </div>
//                         </td>
//                         <td>
//                           <div className={`badge gap-2 ${getStatutBadge(alerte.statut)}`}>
//                             {getStatutText(alerte.statut)}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="flex items-center gap-2">
//                             <HardDrive className="h-4 w-4 opacity-70" />
//                             <div className="text-sm font-medium">
//                               {alerte.materiel_nom || 'Non spécifié'}
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="text-xs space-y-1">
//                             <div className="flex items-center gap-1">
//                               <Clock className="h-3 w-3 opacity-70" />
//                               {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : 'N/A'}
//                             </div>
//                             {alerte.date_resolution && (
//                               <div className="flex items-center gap-1 text-green-600">
//                                 <CheckCircle className="h-3 w-3" />
//                                 {new Date(alerte.date_resolution).toLocaleDateString('fr-FR')}
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="flex justify-end gap-2">
//                             {/* Bouton pour créer un incident depuis une alerte critique */}
//                             {canCreateIncident && (
//                               <button
//                                 onClick={() => openIncidentFormFromAlerte(alerte)}
//                                 className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/20"
//                                 title="Créer un incident"
//                               >
//                                 <AlertTriangle className="h-4 w-4" />
//                               </button>
//                             )}
                            
//                             {alerte.statut === 'nouvelle' && (
//                               <button
//                                 onClick={() => handleTraiter(alerte.id)}
//                                 className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/20"
//                               >
//                                 <RefreshCw className="h-4 w-4" />
//                               </button>
//                             )}
                            
//                             {alerte.statut !== 'resolue' && (
//                               <button
//                                 onClick={() => handleResoudre(alerte.id)}
//                                 className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/20"
//                               >
//                                 <CheckCircle className="h-4 w-4" />
//                               </button>
//                             )}
                            
//                             <button
//                               onClick={() => handleEdit(alerte)}
//                               className="btn btn-ghost btn-sm btn-square"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(alerte.id)}
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

//       {/* Message d'information sur la synchronisation automatique */}
//       <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
//         <div className="flex items-start gap-3">
//           <AlertTriangle className="h-5 w-5 text-info mt-0.5" />
//           <div className="flex-1">
//             <h4 className="font-bold text-info mb-1">🔄 Synchronisation automatique des alertes</h4>
//             <p className="text-sm opacity-80 mb-2">
//               Les alertes sont automatiquement mises à jour selon l'état du matériel concerné :
//             </p>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
//               <div className="flex items-center gap-1">
//                 <span className="badge badge-success badge-xs">Matériel réparé</span>
//                 <span>→ Alerte automatiquement résolue</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="badge badge-success badge-xs">Matériel fonctionnel</span>
//                 <span>→ Alerte automatiquement résolue</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="badge badge-error badge-xs">Matériel en panne</span>
//                 <span>→ Alerte reste active</span>
//               </div>
//             </div>
//             <p className="text-xs opacity-60 mt-2">
//               Cette fonctionnalité permet de maintenir la cohérence entre l'état des matériels et leurs alertes associées.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Formulaire d'alerte */}
//       <AlerteForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingAlerte(undefined);
//         }}
//         onSubmit={handleSubmit}
//         alerte={editingAlerte}
//         materiels={materiels}
//       />

//       {/* Formulaire d'incident */}
//       {selectedAlerteForIncident && (
//         <IncidentForm
//           isOpen={isIncidentFormOpen}
//           onClose={() => {
//             setIsIncidentFormOpen(false);
//             setSelectedAlerteForIncident(null);
//           }}
//           onSubmit={handleCreateIncident}
//           currentUser={currentUser}
//           alerteSource={selectedAlerteForIncident}
//         />
//       )}
//     </div>
//   );
// };

// export default Alertes;



// src/pages/Alertes.tsx - VERSION AVEC AUTO-LOGGER
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, Download, 
  Bell, AlertTriangle, CheckCircle, 
  CheckSquare, Square, X, RefreshCw,
  Clock, HardDrive, Eye
} from 'lucide-react';
import { Alerte } from '../types';
import AlerteForm from '../components/AlerteForm';
import IncidentForm from '../components/IncidentForm';
import { 
  alertesAPI, 
  materielsAPI, 
  incidentsAPI,
  handleApiError 
} from '../services/api';
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
      'resolve': 'RÉSOLUTION',
      'treat': 'TRAITEMENT',
      'auto-resolve': 'AUTO-RÉSOLUTION',
      'sync': 'SYNCHRONISATION'
    };
    
    const action = actionsMap[operation] || operation.toUpperCase();
    const details = `${operation === 'create' ? 'Ajout' : 
                     operation === 'read' ? 'Consultation' :
                     operation === 'update' ? 'Modification' :
                     operation === 'delete' ? 'Suppression' :
                     operation === 'export' ? 'Export' :
                     operation === 'resolve' ? 'Résolution' :
                     operation === 'treat' ? 'Traitement' :
                     operation === 'auto-resolve' ? 'Auto-résolution' :
                     operation === 'sync' ? 'Synchronisation' : operation} ${module.toLowerCase()}: ${itemName}`;
    
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
  
  const logAutoResolution = (alerteId, materielId, reason) => {
    logAction('AUTO-RÉSOLUTION', 'Alertes', `Alerte #${alerteId} auto-résolue (${reason})`, {
      alerteId: alerteId,
      materielId: materielId,
      reason: reason,
      type: 'auto_resolution'
    });
  };
  
  const logAutoDetection = (materielId, materielNom) => {
    logAction('DÉTECTION AUTOMATIQUE', 'Alertes', `Nouvelle alerte créée pour ${materielNom}`, {
      materielId: materielId,
      materielNom: materielNom,
      type: 'auto_detection'
    });
  };
  
  const logIncidentFromAlerte = (alerteId, incidentId) => {
    logAction('CRÉATION INCIDENT', 'Alertes', `Incident #${incidentId} créé depuis alerte #${alerteId}`, {
      alerteId: alerteId,
      incidentId: incidentId,
      type: 'incident_creation'
    });
  };
  
  return {
    logAction,
    logCRUD,
    logSearch,
    logFilter,
    logExport,
    logAutoResolution,
    logAutoDetection,
    logIncidentFromAlerte,
    
    // Fonctions spécifiques pour les alertes
    logAlerteCreate: (alerteData) => 
      logCRUD('create', 'Alertes', `Alerte: ${alerteData.description?.substring(0, 50)}...` || 'Nouvelle alerte', { 
        data: alerteData,
        materielId: alerteData.materiel_concerne,
        severite: alerteData.severite
      }),
    
    logAlerteUpdate: (id, oldData, newData) => 
      logCRUD('update', 'Alertes', `Alerte #${id}`, {
        id: id,
        oldData: oldData,
        newData: newData,
        changes: getChanges(oldData, newData)
      }),
    
    logAlerteDelete: (id, alerteData) =>
      logCRUD('delete', 'Alertes', `Alerte #${id}`, { id: id, data: alerteData }),
    
    logAlerteResolve: (id, alerteData) =>
      logCRUD('resolve', 'Alertes', `Alerte #${id} résolue`, { id: id, data: alerteData }),
    
    logAlerteTreat: (id, alerteData) =>
      logCRUD('treat', 'Alertes', `Alerte #${id} traitée`, { id: id, data: alerteData }),
    
    logAlerteExport: (format, count, filters) =>
      logExport('Alertes', format, count, filters),
    
    logAlerteView: (alerte) =>
      logCRUD('read', 'Alertes', `Alerte #${alerte.id}`, { id: alerte.id, data: alerte }),
    
    logAlerteSearch: (term, count) =>
      logSearch('Alertes', term, count),
    
    logAlerteFilter: (filterType, count) =>
      logFilter('Alertes', filterType, count)
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

// Fonctions helper
const safeArray = (data: any): Alerte[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.results && Array.isArray(data.results)) return data.results;
  return [];
};

const extractDataFromResponse = (response: any): any[] => {
  if (!response) return [];
  
  if (Array.isArray(response)) return response;
  
  if (response.data !== undefined) {
    if (Array.isArray(response.data)) return response.data;
    
    if (response.data.results && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    if (typeof response.data === 'object' && !Array.isArray(response.data)) {
      return [response.data];
    }
  }
  
  if (response.results && Array.isArray(response.results)) {
    return response.results;
  }
  
  return [];
};

// Fonction pour simuler un utilisateur courant
const getCurrentUser = () => {
  return {
    id: 1,
    username: "admin",
    first_name: "Admin",
    last_name: "System",
    email: "admin@system.com",
    role: "admin",
    departement: "IT",
    is_active: true,
    date_joined: new Date().toISOString()
  };
};

// Fonction de notification améliorée
const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slideInRight ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    type === 'warning' ? 'bg-yellow-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  
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

const Alertes: React.FC = () => {
  // ==================== INITIALISATION AUTO-LOGGER ====================
  const autoLogger = useAutoLogger();
  
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSeverite, setFilterSeverite] = useState<string>('');
  const [filterStatut, setFilterStatut] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false);
  const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
  const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [selectedAlerteForIncident, setSelectedAlerteForIncident] = useState<Alerte | null>(null);
  
  // États pour la confirmation de suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [alerteToDelete, setAlerteToDelete] = useState<number | null>(null);
  const [deleteMultiple, setDeleteMultiple] = useState(false);
  
  // États pour les données de relations
  const [materiels, setMateriels] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loadingRelations, setLoadingRelations] = useState<boolean>(false);
  const [currentUser] = useState(getCurrentUser());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Statistiques
  const [statistiques, setStatistiques] = useState({
    total: 0,
    nouvelles: 0,
    enTraitement: 0,
    resolues: 0,
    critiques: 0,
    elevees: 0,
    moyennes: 0,
    basses: 0,
    alertesPanne: 0,
    alertesAutomatiques: 0
  });

  // Fonction pour vérifier l'état du matériel
  const verifierEtatMateriel = (materiel: any): string => {
    if (materiel.etat === 'fonctionnel') return 'fonctionnel';
    if (materiel.etat === 'en_panne') return 'en_panne';
    if (materiel.etat === 'en_reparation') return 'en_reparation';
    if (materiel.etat === 'repare') return 'repare';
    return 'inconnu';
  };

  // Vérifier et résoudre automatiquement les alertes selon l'état du matériel
  const verifierEtResoudreAlertesAutomatiquement = () => {
    let alertesResolues = 0;
    let alertesMisesAJour = [...alertes];

    alertesMisesAJour.forEach((alerte, index) => {
      // Vérifier si l'alerte est liée à un matériel
      if (alerte.materiel_concerne) {
        const materiel = materiels.find(m => m.id === alerte.materiel_concerne);
        
        if (materiel) {
          const etatMateriel = verifierEtatMateriel(materiel);
          
          // Si le matériel est fonctionnel ou réparé, et que l'alerte est encore active
          if ((etatMateriel === 'fonctionnel' || etatMateriel === 'repare') && 
              (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement')) {
            
            // 🔥 AUTO-LOGGER: Auto-résolution d'alerte
            autoLogger.logAutoResolution(alerte.id, materiel.id, `Matériel ${etatMateriel}`);
            
            // Marquer automatiquement l'alerte comme résolue
            alertesMisesAJour[index] = {
              ...alerte,
              statut: 'resolue',
              date_resolution: new Date().toISOString(),
              notes: `Alerte résolue automatiquement - Matériel ${etatMateriel === 'repare' ? 'réparé' : 'fonctionnel'}`
            };
            
            alertesResolues++;
            
            // Afficher une notification
            showNotification('info', 
              `Alerte #${alerte.id} résolue automatiquement (matériel ${etatMateriel})`, 
              '🔧 Synchronisation automatique'
            );
          }
          
          // Si le matériel est en panne et l'alerte n'existe pas encore, créer une alerte automatique
          if (etatMateriel === 'en_panne' && !alerte) {
            
            // 🔥 AUTO-LOGGER: Détection automatique d'alerte
            autoLogger.logAutoDetection(materiel.id, materiel.nom);
            
            const nouvelleAlerte = {
              id: Date.now(), // ID temporaire
              type_alerte: 'panne',
              severite: 'critique',
              statut: 'nouvelle',
              description: `🚨 ALERTE URGENTE - ${materiel.nom} est en panne. Nécessite une intervention immédiate.`,
              materiel_concerne: materiel.id,
              materiel_nom: materiel.nom,
              date_alerte: new Date().toISOString(),
              source: 'automatique'
            };
            
            alertesMisesAJour.push(nouvelleAlerte as Alerte);
            showNotification('warning', 
              `Nouvelle alerte créée pour ${materiel.nom}`, 
              '🚨 Détection automatique'
            );
          }
        }
      }
    });

    // Mettre à jour les alertes si des changements ont été effectués
    if (alertesResolues > 0) {
      setAlertes(alertesMisesAJour);
      showNotification('success', 
        `${alertesResolues} alerte(s) résolue(s) automatiquement`, 
        '✅ Synchronisation terminée'
      );
      
      // Recalculer les statistiques
      calculerStatistiques(alertesMisesAJour);
    }
  };

  // Charger les alertes
  const fetchAlertes = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Chargement des alertes...');
      
      const response = await alertesAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      
      console.log(`✅ ${extractedData.length} alertes chargées`);
      setAlertes(extractedData);
      
      // 🔥 AUTO-LOGGER: Chargement des alertes
      autoLogger.logAction('CHARGEMENT', 'Alertes', `Chargement de ${extractedData.length} alertes`, {
        count: extractedData.length,
        type: 'load'
      });
      
      // Calculer les statistiques
      calculerStatistiques(extractedData);
      
    } catch (err: any) {
      console.error('❌ Erreur chargement alertes:', err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      showNotification('error', errorMessage, 'Erreur de chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fonction pour calculer les statistiques
  const calculerStatistiques = (data: Alerte[]) => {
    let alertesPanne = 0;
    let alertesAutomatiques = 0;

    data.forEach(alerte => {
      // Compter les alertes de panne
      if (alerte.type_alerte === 'panne') {
        alertesPanne++;
      }
      
      // Compter les alertes automatiques
      if (alerte.source === 'automatique') {
        alertesAutomatiques++;
      }
    });

    const stats = {
      total: data.length,
      nouvelles: data.filter(a => a.statut === 'nouvelle').length,
      enTraitement: data.filter(a => a.statut === 'en_traitement').length,
      resolues: data.filter(a => a.statut === 'resolue').length,
      critiques: data.filter(a => a.severite === 'critique').length,
      elevees: data.filter(a => a.severite === 'elevee').length,
      moyennes: data.filter(a => a.severite === 'moyenne').length,
      basses: data.filter(a => a.severite === 'basse').length,
      alertesPanne,
      alertesAutomatiques
    };
    setStatistiques(stats);
  };

  // Charger les données de relations
  const fetchRelationsData = async () => {
    try {
      setLoadingRelations(true);
      console.log('🔄 Chargement des données de relations...');

      // Charger les matériels
      let materielsData: any[] = [];
      try {
        const materielsResponse = await materielsAPI.getAll();
        materielsData = extractDataFromResponse(materielsResponse);
        console.log(`✅ ${materielsData.length} matériels chargés`);
      } catch (materielError) {
        console.error('❌ Erreur chargement matériels:', materielError);
        showNotification('warning', 'Certains matériels n\'ont pas pu être chargés', 'Avertissement');
      }

      // Charger les incidents
      let incidentsData: any[] = [];
      try {
        const incidentsResponse = await incidentsAPI.getAll();
        incidentsData = extractDataFromResponse(incidentsResponse);
        console.log(`✅ ${incidentsData.length} incidents chargés`);
      } catch (incidentError) {
        console.error('❌ Erreur chargement incidents:', incidentError);
        showNotification('warning', 'Certains incidents n\'ont pas pu être chargés', 'Avertissement');
      }

      setMateriels(materielsData);
      setIncidents(incidentsData);

    } catch (err: any) {
      console.error('❌ Erreur chargement relations:', err);
      showNotification('error', 'Erreur lors du chargement des données', 'Erreur');
      
      setMateriels([]);
      setIncidents([]);
    } finally {
      setLoadingRelations(false);
    }
  };

  // Rafraîchir toutes les données
  const handleRefresh = async () => {
    setRefreshing(true);
    
    // 🔥 AUTO-LOGGER: Rafraîchissement
    autoLogger.logAction('RAFRAÎCHISSEMENT', 'Alertes', 'Rafraîchissement des données', {
      timestamp: new Date().toISOString()
    });
    
    showNotification('info', 'Rafraîchissement des données en cours...', '🔄 Synchronisation');
    
    await Promise.all([
      fetchAlertes(),
      fetchRelationsData()
    ]);
    
    // Vérifier et résoudre les alertes automatiquement
    if (materiels.length > 0) {
      verifierEtResoudreAlertesAutomatiquement();
    }
    
    showNotification('success', 'Données rafraîchies avec succès', '✅ Synchronisation terminée');
  };

  useEffect(() => {
    fetchAlertes();
    fetchRelationsData();
  }, []);

  useEffect(() => {
    filterAlertes();
  }, [alertes, searchTerm, filterSeverite, filterStatut]);

  // Appeler la vérification automatique quand les matériels ou alertes changent
  useEffect(() => {
    if (alertes.length > 0 && materiels.length > 0) {
      verifierEtResoudreAlertesAutomatiquement();
    }
  }, [materiels, alertes.length]);

  useEffect(() => {
    if (filteredAlertes.length > 0 && selectedAlertes.length === filteredAlertes.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedAlertes, filteredAlertes]);

  const filterAlertes = () => {
    let filtered = safeArray(alertes);

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.description?.toLowerCase().includes(searchLower) ||
        (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchLower))
      );
      
      // 🔥 AUTO-LOGGER: Recherche d'alertes
      if (searchTerm.trim()) {
        autoLogger.logAlerteSearch(searchTerm, filtered.length);
      }
    }

    if (filterSeverite) {
      filtered = filtered.filter(a => a.severite === filterSeverite);
      
      // 🔥 AUTO-LOGGER: Filtre par sévérité
      autoLogger.logAlerteFilter(`sévérité: ${filterSeverite}`, filtered.length);
    }

    if (filterStatut) {
      filtered = filtered.filter(a => a.statut === filterStatut);
      
      // 🔥 AUTO-LOGGER: Filtre par statut
      autoLogger.logAlerteFilter(`statut: ${filterStatut}`, filtered.length);
    }

    setFilteredAlertes(filtered);
    setSelectedAlertes([]);
  };

  // Gestion des alertes
  const handleSubmit = async (alerteData: any) => {
    try {
      console.log('📤 Soumission des données alerte:', alerteData);
      
      if (editingAlerte) {
        await alertesAPI.update(editingAlerte.id, alerteData);
        showNotification('success', 'Alerte modifiée avec succès', '✅ Modification réussie');
        
        // 🔥 AUTO-LOGGER: Modification d'alerte
        autoLogger.logAlerteUpdate(editingAlerte.id, editingAlerte, alerteData);
        
      } else {
        await alertesAPI.create(alerteData);
        showNotification('success', 'Alerte créée avec succès', '✅ Création réussie');
        
        // 🔥 AUTO-LOGGER: Création d'alerte
        autoLogger.logAlerteCreate(alerteData);
      }
      
      await fetchAlertes();
      setIsFormOpen(false);
      setEditingAlerte(undefined);
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde alerte:', error);
      const errorMessage = handleApiError(error);
      showNotification('error', errorMessage, '❌ Erreur');
    }
  };

  // Gestion des incidents - SCÉNARIO 2
  const handleCreateIncident = async (incidentData: any) => {
    try {
      console.log('📤 Création incident depuis alerte:', incidentData);
      
      // Appeler l'API pour créer l'incident
      const response = await incidentsAPI.create(incidentData);
      console.log('✅ Réponse création incident:', response);
      
      const incidentId = response.data?.id || response.id || 
                       (response.data && response.data.data && response.data.data.id);
      
      if (!incidentId) {
        throw new Error('L\'incident a été créé mais aucun ID n\'a été retourné');
      }
      
      // Si l'incident a été créé avec succès, mettre à jour l'alerte
      if (selectedAlerteForIncident) {
        try {
          await alertesAPI.update(selectedAlerteForIncident.id, {
            ...selectedAlerteForIncident,
            incident_associe_id: incidentId,
            statut: 'en_traitement'
          });
          
          // 🔥 AUTO-LOGGER: Création d'incident depuis alerte
          autoLogger.logIncidentFromAlerte(selectedAlerteForIncident.id, incidentId);
          
          showNotification('success', 
            `Incident #${incidentId} créé avec succès et alerte mise à jour`, 
            '🚨 Incident créé'
          );
        } catch (updateError) {
          console.error('❌ Erreur mise à jour alerte:', updateError);
          showNotification('warning', 
            `Incident #${incidentId} créé mais erreur lors de la mise à jour de l'alerte`, 
            '⚠️ Avertissement'
          );
        }
      } else {
        showNotification('success', `Incident #${incidentId} créé avec succès`, '✅ Incident créé');
      }
      
      // Recharger les données
      await Promise.all([
        fetchAlertes(),
        fetchRelationsData()
      ]);
      
      setIsIncidentFormOpen(false);
      setSelectedAlerteForIncident(null);
      
    } catch (error: any) {
      console.error('❌ Erreur création incident:', error);
      const errorMessage = handleApiError(error);
      showNotification('error', errorMessage, '❌ Erreur');
    }
  };

  // Fonction pour ouvrir le formulaire d'incident depuis une alerte
  const openIncidentFormFromAlerte = (alerte: Alerte) => {
    // Vérifier si l'alerte peut créer un incident
    const canCreateIncident = alerte.severite === 'critique' && 
                             (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
    
    if (!canCreateIncident) {
      showNotification('warning', 
        'Seules les alertes critiques (nouvelle ou en traitement) peuvent créer des incidents', 
        'ℹ️ Information'
      );
      return;
    }
    
    // Vérifier si l'alerte a déjà un incident
    if (alerte.incident_associe_id) {
      showNotification('info', 'Cette alerte a déjà un incident associé', 'ℹ️ Information');
      return;
    }
    
    console.log('🚨 Ouverture formulaire incident depuis alerte:', alerte);
    
    // 🔥 AUTO-LOGGER: Ouverture formulaire incident depuis alerte
    autoLogger.logAction('OUVERTURE FORMULAIRE', 'Alertes', `Création incident depuis alerte #${alerte.id}`);
    
    setSelectedAlerteForIncident(alerte);
    setIsIncidentFormOpen(true);
  };

  const handleAddNew = () => {
    if (loadingRelations) {
      showNotification('info', 'Chargement des données en cours... Veuillez patienter.', '🔄 Chargement');
      return;
    }
    
    const hasRelationsData = materiels.length > 0;
    
    if (!hasRelationsData) {
      showNotification('warning', 
        `Aucune donnée de matériel disponible`, 
        '⚠️ Données manquantes'
      );
      
      if (confirm('Voulez-vous recharger les données ?')) {
        fetchRelationsData();
      }
      
      return;
    }

    // 🔥 AUTO-LOGGER: Ouverture formulaire nouvelle alerte
    autoLogger.logAction('OUVERTURE FORMULAIRE', 'Alertes', 'Nouvelle alerte');
    
    setEditingAlerte(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (alerte: Alerte) => {
    if (loadingRelations) {
      showNotification('info', 'Chargement des données en cours...', '🔄 Chargement');
      return;
    }

    const hasRelationsData = materiels.length > 0;
    
    if (!hasRelationsData) {
      showNotification('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.', '⚠️ Données manquantes');
      return;
    }

    // 🔥 AUTO-LOGGER: Consultation d'alerte (pour édition)
    autoLogger.logAlerteView(alerte);
    
    setEditingAlerte(alerte);
    setIsFormOpen(true);
  };

  // Fonctions de sélection
  const toggleSelectAlerte = (id: number) => {
    setSelectedAlertes(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedAlertes([]);
      showNotification('info', 'Sélection annulée', 'ℹ️ Information');
    } else {
      const allIds = filteredAlertes.map(a => a.id);
      setSelectedAlertes(allIds);
      showNotification('success', `${allIds.length} alertes sélectionnées`, '✅ Sélection');
    }
  };

  // Fonction pour demander confirmation de suppression multiple
  const handleDeleteSelected = () => {
    if (selectedAlertes.length === 0) {
      showNotification('error', 'Aucune alerte sélectionnée', '❌ Erreur');
      return;
    }

    setDeleteMultiple(true);
    setShowDeleteConfirm(true);
  };

  // Fonction pour demander confirmation de suppression simple
  const handleDelete = (id: number) => {
    setAlerteToDelete(id);
    setDeleteMultiple(false);
    setShowDeleteConfirm(true);
  };

  // Fonction pour exécuter la suppression après confirmation
  const confirmDelete = async () => {
    try {
      if (deleteMultiple) {
        // Suppression multiple
        const deletePromises = selectedAlertes.map(id => 
          alertesAPI.delete(id).catch(err => {
            console.error(`Erreur suppression alerte ${id}:`, err);
            showNotification('warning', `Alerte #${id} non supprimée: ${handleApiError(err)}`, '⚠️ Avertissement');
            return null;
          })
        );
        
        const results = await Promise.all(deletePromises);
        const successfulDeletes = results.filter(r => r !== null).length;
        
        // 🔥 AUTO-LOGGER: Suppression multiple d'alertes
        selectedAlertes.forEach(id => {
          const alerte = alertes.find(a => a.id === id);
          if (alerte) {
            autoLogger.logAlerteDelete(id, alerte);
          }
        });
        
        if (successfulDeletes > 0) {
          showNotification('success', `${successfulDeletes} alerte(s) supprimée(s) avec succès`, '✅ Suppression réussie');
        }
        
        setSelectedAlertes([]);
      } else if (alerteToDelete) {
        // Suppression simple
        const alerte = alertes.find(a => a.id === alerteToDelete);
        await alertesAPI.delete(alerteToDelete);
        
        // 🔥 AUTO-LOGGER: Suppression d'alerte
        if (alerte) {
          autoLogger.logAlerteDelete(alerteToDelete, alerte);
        }
        
        showNotification('success', 'Alerte supprimée avec succès', '✅ Suppression réussie');
      }
      
      await fetchAlertes();
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showNotification('error', `Erreur suppression: ${errorMessage}`, '❌ Erreur');
    } finally {
      setShowDeleteConfirm(false);
      setAlerteToDelete(null);
      setDeleteMultiple(false);
    }
  };

  const handleEditSelected = () => {
    if (selectedAlertes.length === 0) {
      showNotification('error', 'Aucune alerte sélectionnée', '❌ Erreur');
      return;
    }

    if (selectedAlertes.length === 1) {
      const alerte = alertes.find(a => a.id === selectedAlertes[0]);
      if (alerte) {
        handleEdit(alerte);
      }
    } else {
      showNotification('info', `Édition multiple de ${selectedAlertes.length} alertes`, 'ℹ️ Information');
      
      // 🔥 AUTO-LOGGER: Édition multiple d'alertes
      autoLogger.logAction('ÉDITION MULTIPLE', 'Alertes', `Édition ${selectedAlertes.length} alertes`);
    }
  };

  const handleTraiterSelected = async () => {
    if (selectedAlertes.length === 0) {
      showNotification('error', 'Aucune alerte sélectionnée', '❌ Erreur');
      return;
    }

    try {
      const updatePromises = selectedAlertes.map(id => 
        alertesAPI.update(id, { statut: 'en_traitement' }).catch(err => {
          console.error(`Erreur traitement alerte ${id}:`, err);
          showNotification('warning', `Alerte #${id} non traitée: ${handleApiError(err)}`, '⚠️ Avertissement');
          return null;
        })
      );
      
      const results = await Promise.all(updatePromises);
      const successfulUpdates = results.filter(r => r !== null).length;
      
      // 🔥 AUTO-LOGGER: Traitement multiple d'alertes
      selectedAlertes.forEach(id => {
        const alerte = alertes.find(a => a.id === id);
        if (alerte) {
          autoLogger.logAlerteTreat(id, alerte);
        }
      });
      
      if (successfulUpdates > 0) {
        showNotification('success', `${successfulUpdates} alerte(s) marquée(s) comme traitées`, '✅ Traitement réussi');
      }
      
      setSelectedAlertes([]);
      await fetchAlertes();
    } catch (error: any) {
      showNotification('error', 'Erreur lors du traitement des alertes', '❌ Erreur');
    }
  };

  const handleResoudreSelected = async () => {
    if (selectedAlertes.length === 0) {
      showNotification('error', 'Aucune alerte sélectionnée', '❌ Erreur');
      return;
    }

    try {
      const updatePromises = selectedAlertes.map(id => 
        alertesAPI.update(id, { 
          statut: 'resolue',
          date_resolution: new Date().toISOString()
        }).catch(err => {
          console.error(`Erreur résolution alerte ${id}:`, err);
          showNotification('warning', `Alerte #${id} non résolue: ${handleApiError(err)}`, '⚠️ Avertissement');
          return null;
        })
      );
      
      const results = await Promise.all(updatePromises);
      const successfulUpdates = results.filter(r => r !== null).length;
      
      // 🔥 AUTO-LOGGER: Résolution multiple d'alertes
      selectedAlertes.forEach(id => {
        const alerte = alertes.find(a => a.id === id);
        if (alerte) {
          autoLogger.logAlerteResolve(id, alerte);
        }
      });
      
      if (successfulUpdates > 0) {
        showNotification('success', `${successfulUpdates} alerte(s) marquée(s) comme résolues`, '✅ Résolution réussie');
      }
      
      setSelectedAlertes([]);
      await fetchAlertes();
    } catch (error: any) {
      showNotification('error', 'Erreur lors de la résolution des alertes', '❌ Erreur');
    }
  };

  const handleTraiter = async (id: number) => {
    try {
      const alerte = alertes.find(a => a.id === id);
      await alertesAPI.update(id, { statut: 'en_traitement' });
      
      // 🔥 AUTO-LOGGER: Traitement d'alerte
      if (alerte) {
        autoLogger.logAlerteTreat(id, alerte);
      }
      
      showNotification('success', 'Alerte marquée comme traitée', '✅ Traitement réussi');
      await fetchAlertes();
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showNotification('error', `Erreur traitement: ${errorMessage}`, '❌ Erreur');
    }
  };

  const handleResoudre = async (id: number) => {
    try {
      const alerte = alertes.find(a => a.id === id);
      await alertesAPI.update(id, { 
        statut: 'resolue',
        date_resolution: new Date().toISOString()
      });
      
      // 🔥 AUTO-LOGGER: Résolution d'alerte
      if (alerte) {
        autoLogger.logAlerteResolve(id, alerte);
      }
      
      showNotification('success', 'Alerte marquée comme résolue', '✅ Résolution réussie');
      await fetchAlertes();
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showNotification('error', `Erreur résolution: ${errorMessage}`, '❌ Erreur');
    }
  };

  // Fonctions d'affichage
  const getSeveriteBadge = (severite: string) => {
    const badges: Record<string, string> = {
      critique: 'badge-error',
      elevee: 'badge-warning',
      moyenne: 'badge-info',
      basse: 'badge-neutral'
    };
    return badges[severite] || 'badge-neutral';
  };

  const getSeveriteText = (severite: string) => {
    const texts: Record<string, string> = {
      critique: 'Critique',
      elevee: 'Élevée',
      moyenne: 'Moyenne',
      basse: 'Basse'
    };
    return texts[severite] || severite;
  };

  const getSeveriteIcon = (severite: string) => {
    switch (severite) {
      case 'critique': return <AlertTriangle className="h-4 w-4" />;
      case 'elevee': return <AlertTriangle className="h-4 w-4" />;
      case 'moyenne': return <Bell className="h-4 w-4" />;
      case 'basse': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, string> = {
      nouvelle: 'badge-error',
      en_traitement: 'badge-warning',
      resolue: 'badge-success'
    };
    return badges[statut] || 'badge-neutral';
  };

  const getStatutText = (statut: string) => {
    const texts: Record<string, string> = {
      nouvelle: 'Nouvelle',
      en_traitement: 'En traitement',
      resolue: 'Résolue'
    };
    return texts[statut] || statut;
  };

  const resetFilters = () => {
    // 🔥 AUTO-LOGGER: Réinitialisation des filtres
    autoLogger.logAlerteFilter('réinitialisation', alertes.length);
    
    setSearchTerm('');
    setFilterSeverite('');
    setFilterStatut('');
    setSelectedAlertes([]);
    showNotification('info', 'Filtres réinitialisés', 'ℹ️ Information');
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredAlertes.map(a => ({
        Sévérité: getSeveriteText(a.severite),
        Statut: getStatutText(a.statut),
        Description: a.description,
        'Matériel source': a.materiel_nom || 'Non spécifié',
        'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée',
        'Date résolution': a.date_resolution ? new Date(a.date_resolution).toLocaleDateString('fr-FR') : 'Non résolue'
      }));

      if (dataToExport.length === 0) {
        showNotification('error', 'Aucune donnée à exporter', '❌ Erreur');
        return;
      }

      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `alertes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('success', 'Export CSV réussi !', '✅ Export');
      
      // 🔥 AUTO-LOGGER: Exportation d'alertes
      autoLogger.logAlerteExport('CSV', filteredAlertes.length, {
        searchTerm: searchTerm,
        filterSeverite: filterSeverite,
        filterStatut: filterStatut
      });
      
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'export', '❌ Erreur');
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des alertes...</p>
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
            <p className="py-4">
              {deleteMultiple 
                ? `Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ? Cette action est irréversible.`
                : 'Êtes-vous sûr de vouloir supprimer cette alerte ? Cette action est irréversible.'
              }
            </p>
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setAlerteToDelete(null);
                  setDeleteMultiple(false);
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

      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Gestion des Alertes
          </h1>
          <p className="text-base-content opacity-60 mt-1">
            {filteredAlertes.length} alerte(s) trouvée(s)
            {selectedAlertes.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedAlertes.length} sélectionnée(s))
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
            title="Exporter"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button
            onClick={handleAddNew}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle alerte
          </button>
        </div>
      </div>

      {/* Section Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-1">{statistiques.total}</h3>
            <p className="text-sm opacity-60">Total alertes</p>
          </div>
        </div>

        <div className="card bg-error/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Bell className="h-8 w-8 text-error" />
            </div>
            <h3 className="text-3xl font-bold text-error mb-1">{statistiques.nouvelles}</h3>
            <p className="text-sm opacity-60">Nouvelles</p>
          </div>
        </div>

        <div className="card bg-warning/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <RefreshCw className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-3xl font-bold text-warning mb-1">{statistiques.enTraitement}</h3>
            <p className="text-sm opacity-60">En traitement</p>
          </div>
        </div>

        <div className="card bg-success/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-3xl font-bold text-success mb-1">{statistiques.resolues}</h3>
            <p className="text-sm opacity-60">Résolues</p>
          </div>
        </div>
      </div>

      {/* Autres statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-error/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-error" />
            </div>
            <h3 className="text-2xl font-bold text-error mb-1">{statistiques.critiques}</h3>
            <p className="text-sm opacity-60">Critiques</p>
          </div>
        </div>

        <div className="card bg-warning/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <HardDrive className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-2xl font-bold text-warning mb-1">{statistiques.alertesPanne}</h3>
            <p className="text-sm opacity-60">Alertes panne</p>
          </div>
        </div>

        <div className="card bg-success/10 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="flex justify-center mb-2">
              <Bell className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-success mb-1">{statistiques.alertesAutomatiques}</h3>
            <p className="text-sm opacity-60">Automatiques</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">🔍 Rechercher</span>
              </label>
              <input
                type="text"
                placeholder="Description, matériel..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📊 Sévérité</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filterSeverite}
                onChange={(e) => {
                  setFilterSeverite(e.target.value);
                  // 🔥 AUTO-LOGGER: Filtre par sévérité
                  if (e.target.value) {
                    const resultsCount = alertes.filter(a => a.severite === e.target.value).length;
                    autoLogger.logAlerteFilter(`sévérité: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Toutes les sévérités</option>
                <option value="critique">Critique</option>
                <option value="elevee">Élevée</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" />
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
                    const resultsCount = alertes.filter(a => a.statut === e.target.value).length;
                    autoLogger.logAlerteFilter(`statut: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Tous les statuts</option>
                <option value="nouvelle">Nouvelle</option>
                <option value="en_traitement">En traitement</option>
                <option value="resolue">Résolue</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">🔄 Actions</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={resetFilters}
                  className="btn btn-ghost btn-sm flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              {selectedAlertes.length > 0 && (
                <>
                  <button
                    onClick={handleTraiterSelected}
                    className="btn btn-warning btn-sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Traiter ({selectedAlertes.length})
                  </button>
                  <button
                    onClick={handleResoudreSelected}
                    className="btn btn-success btn-sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Résoudre ({selectedAlertes.length})
                  </button>
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier ({selectedAlertes.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-error btn-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer ({selectedAlertes.length})
                  </button>
                </>
              )}
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
                  <th>Description</th>
                  <th>Sévérité</th>
                  <th>Statut</th>
                  <th>Matériel</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlertes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Bell className="h-12 w-12 text-base-content opacity-30" />
                        <p className="text-base-content opacity-50">
                          {searchTerm || filterSeverite || filterStatut ? 'Aucune alerte correspondant aux filtres' : 'Aucune alerte trouvée'}
                        </p>
                        <button 
                          onClick={searchTerm || filterSeverite || filterStatut ? resetFilters : handleAddNew}
                          className="btn btn-sm btn-primary mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {searchTerm || filterSeverite || filterStatut ? 'Réinitialiser les filtres' : 'Créer une première alerte'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAlertes.map(alerte => {
                    // Vérifier si cette alerte peut créer un incident
                    const canCreateIncident = alerte.severite === 'critique' && 
                                             (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement');
                    
                    return (
                      <tr key={alerte.id} className="hover:bg-base-100/50">
                        <td>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs"
                              checked={selectedAlertes.includes(alerte.id)}
                              onChange={() => toggleSelectAlerte(alerte.id)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="text-sm max-w-[250px] truncate">
                            {alerte.description}
                            {alerte.source === 'automatique' && (
                              <span className="ml-2 text-xs text-info">(Auto)</span>
                            )}
                            {alerte.incident_associe_id && (
                              <span className="ml-2 text-xs text-warning">
                                (Incident #{alerte.incident_associe_id})
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={`badge gap-2 ${getSeveriteBadge(alerte.severite)}`}>
                            {getSeveriteIcon(alerte.severite)}
                            {getSeveriteText(alerte.severite)}
                          </div>
                        </td>
                        <td>
                          <div className={`badge gap-2 ${getStatutBadge(alerte.statut)}`}>
                            {getStatutText(alerte.statut)}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 opacity-70" />
                            <div className="text-sm font-medium">
                              {alerte.materiel_nom || 'Non spécifié'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 opacity-70" />
                              {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : 'N/A'}
                            </div>
                            {alerte.date_resolution && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                {new Date(alerte.date_resolution).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-end gap-2">
                            {/* Bouton pour créer un incident depuis une alerte critique */}
                            {canCreateIncident && (
                              <button
                                onClick={() => openIncidentFormFromAlerte(alerte)}
                                className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/20"
                                title="Créer un incident"
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </button>
                            )}
                            
                            {alerte.statut === 'nouvelle' && (
                              <button
                                onClick={() => handleTraiter(alerte.id)}
                                className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/20"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            )}
                            
                            {alerte.statut !== 'resolue' && (
                              <button
                                onClick={() => handleResoudre(alerte.id)}
                                className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/20"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleEdit(alerte)}
                              className="btn btn-ghost btn-sm btn-square"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(alerte.id)}
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

      {/* Message d'information sur la synchronisation automatique */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-info mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-info mb-1">🔄 Synchronisation automatique des alertes</h4>
            <p className="text-sm opacity-80 mb-2">
              Les alertes sont automatiquement mises à jour selon l'état du matériel concerné :
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="badge badge-success badge-xs">Matériel réparé</span>
                <span>→ Alerte automatiquement résolue</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="badge badge-success badge-xs">Matériel fonctionnel</span>
                <span>→ Alerte automatiquement résolue</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="badge badge-error badge-xs">Matériel en panne</span>
                <span>→ Alerte reste active</span>
              </div>
            </div>
            <p className="text-xs opacity-60 mt-2">
              Cette fonctionnalité permet de maintenir la cohérence entre l'état des matériels et leurs alertes associées.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire d'alerte */}
      <AlerteForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAlerte(undefined);
        }}
        onSubmit={handleSubmit}
        alerte={editingAlerte}
        materiels={materiels}
      />

      {/* Formulaire d'incident */}
      {selectedAlerteForIncident && (
        <IncidentForm
          isOpen={isIncidentFormOpen}
          onClose={() => {
            setIsIncidentFormOpen(false);
            setSelectedAlerteForIncident(null);
          }}
          onSubmit={handleCreateIncident}
          currentUser={currentUser}
          alerteSource={selectedAlerteForIncident}
        />
      )}
    </div>
  );
};

export default Alertes;