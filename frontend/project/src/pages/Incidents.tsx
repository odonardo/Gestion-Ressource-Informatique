// // // Incidents.tsx - Version complète corrigée
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Plus, 
// //   Search, 
// //   Eye, 
// //   Filter, 
// //   Download, 
// //   Edit, 
// //   Trash2, 
// //   CheckSquare, 
// //   Square, 
// //   X, 
// //   AlertTriangle, 
// //   Clock, 
// //   CheckCircle,
// //   RefreshCw,
// //   Wrench
// // } from 'lucide-react';
// // import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
// // import api, { incidentsAPI, materielsAPI, logicielsAPI, reseauAPI, handleApiError } from '../services/api';
// // import IncidentForm from '../components/IncidentForm';
// // import { useAuth } from '../context/AuthContext';

// // // Type pour les incidents formatés
// // interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom' | 'logiciel_nom'> {
// //   utilisateur_nom?: string;
// //   materiel_nom?: string;
// //   logiciel_nom?: string;
// // }

// // // Fonctions helper
// // const safeArray = <T,>(data: any): T[] => {
// //   if (!data) return [];
// //   if (Array.isArray(data)) return data as T[];
// //   if (data.results && Array.isArray(data.results)) return data.results as T[];
// //   if (data.data && Array.isArray(data.data)) return data.data as T[];
// //   return [];
// // };

// // const safeFilter = <T,>(array: T[], condition: (item: T) => boolean): T[] => {
// //   if (!Array.isArray(array)) return [];
// //   return array.filter(condition);
// // };

// // const extractDataFromResponse = (response: any): any[] => {
// //   if (!response) return [];
  
// //   if (Array.isArray(response)) return response;
  
// //   if (response.data !== undefined) {
// //     if (Array.isArray(response.data)) return response.data;
    
// //     if (response.data.results && Array.isArray(response.data.results)) {
// //       return response.data.results;
// //     }
    
// //     if (response.data.data && Array.isArray(response.data.data)) {
// //       return response.data.data;
// //     }
    
// //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// //       return [response.data];
// //     }
// //   }
  
// //   if (response.results && Array.isArray(response.results)) {
// //     return response.results;
// //   }
  
// //   return [];
// // };

// // const displayIncidentSource = (incident: FormattedIncident): string => {
// //   const sources: string[] = [];
  
// //   if (incident.materiel_nom && incident.materiel_nom !== 'Non spécifié') {
// //     sources.push(`Matériel: ${incident.materiel_nom}`);
// //   }
  
// //   if (incident.logiciel_nom && incident.logiciel_nom !== 'Non spécifié') {
// //     sources.push(`Logiciel: ${incident.logiciel_nom}`);
// //   }
  
// //   if (incident.type_incident === 'reseau') {
// //     sources.push('Réseau');
// //   }
  
// //   return sources.length > 0 ? sources.join(' | ') : 'Source non spécifiée';
// // };

// // const Incidents: React.FC = () => {
// //   const { user: authUser } = useAuth();
  
// //   const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
// //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// //   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
// //   const [reseaux, setReseaux] = useState<Reseau[]>([]);
// //   const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
// //   const [activeIncidents, setActiveIncidents] = useState<FormattedIncident[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string>('');
// //   const [searchTerm, setSearchTerm] = useState<string>('');
// //   const [filterStatut, setFilterStatut] = useState<string>('');
// //   const [filterPriorite, setFilterPriorite] = useState<string>('');
// //   const [filterType, setFilterType] = useState<string>('');
// //   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [editingIncident, setEditingIncident] = useState<FormattedIncident | undefined>();
// //   const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
// //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
// //   const [refreshing, setRefreshing] = useState<boolean>(false);
// //   const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
// //   const [autoRepairMode, setAutoRepairMode] = useState<boolean>(false);

// //   const getCurrentUser = (): UserType => {
// //     console.log('👤 Récupération utilisateur depuis Auth:', authUser);
    
// //     if (authUser) {
// //       return {
// //         id: authUser.id || 0,
// //         username: authUser.username || '',
// //         first_name: authUser.first_name || '',
// //         last_name: authUser.last_name || '',
// //         email: authUser.email || '',
// //         is_active: authUser.is_active !== false,
// //         date_joined: authUser.date_joined || new Date().toISOString(),
// //         role: authUser.role,
// //         departement: authUser.departement || '',
// //         telephone: authUser.telephone || ''
// //       };
// //     }
    
// //     try {
// //       const userStr = localStorage.getItem('user');
// //       if (userStr) {
// //         const user = JSON.parse(userStr);
// //         return {
// //           id: user.id || 0,
// //           username: user.username || '',
// //           first_name: user.first_name || '',
// //           last_name: user.last_name || '',
// //           email: user.email || '',
// //           is_active: user.is_active !== false,
// //           date_joined: user.date_joined || new Date().toISOString(),
// //           role: user.role,
// //           departement: user.departement || ''
// //         };
// //       }
// //     } catch (e) {
// //       console.error('Erreur parsing user:', e);
// //     }
    
// //     return {
// //       id: 0,
// //       username: 'utilisateur',
// //       first_name: 'Utilisateur',
// //       last_name: 'Inconnu',
// //       email: 'user@example.com',
// //       is_active: true,
// //       date_joined: new Date().toISOString(),
// //       role: 'user',
// //       departement: ''
// //     };
// //   };

// //   const filterActiveIncidents = (incidentsList: FormattedIncident[]): FormattedIncident[] => {
// //     return safeFilter<FormattedIncident>(
// //       incidentsList, 
// //       i => i.statut === 'ouvert' || i.statut === 'en_cours'
// //     );
// //   };

// //   const formatUserName = (user: any): string => {
// //     if (!user) return 'Utilisateur inconnu';
    
// //     if (user.first_name && user.last_name) {
// //       return `${user.first_name} ${user.last_name}`;
// //     }
    
// //     if (user.username) {
// //       return user.username;
// //     }
    
// //     if (user.email) {
// //       return user.email.split('@')[0];
// //     }
    
// //     return `Utilisateur #${user.id || '?'}`;
// //   };

// //   const handleExport = () => {
// //     try {
// //       const dataToExport = filteredIncidents.map(i => ({
// //         ID: i.id,
// //         Description: i.description,
// //         Type: getTypeText(i.type_incident),
// //         Priorité: getPriorityText(i.priorite),
// //         Statut: getStatusText(i.statut),
// //         'Matériel concerné': i.materiel_nom || 'Non spécifié',
// //         'Logiciel concerné': i.logiciel_nom || 'Non spécifié',
// //         'Utilisateur signaleur': i.utilisateur_nom || 'Non spécifié',
// //         'Date création': i.date_creation ? new Date(i.date_creation).toLocaleDateString('fr-FR') : 'Non spécifiée',
// //         'Date résolution': i.date_resolution ? new Date(i.date_resolution).toLocaleDateString('fr-FR') : 'Non résolu'
// //       }));

// //       if (dataToExport.length === 0) {
// //         showMessage('error', 'Aucune donnée à exporter');
// //         return;
// //       }

// //       const csvContent = [
// //         Object.keys(dataToExport[0] || {}).join(','),
// //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// //       ].join('\n');

// //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //       const link = document.createElement('a');
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
// //       link.style.visibility = 'hidden';
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);

// //       showMessage('success', 'Export CSV réussi !');
// //     } catch (error) {
// //       console.error('❌ Erreur export:', error);
// //       showMessage('error', 'Erreur lors de l\'export');
// //     }
// //   };

// //   const resetFilters = () => {
// //     setSearchTerm('');
// //     setFilterStatut('');
// //     setFilterPriorite('');
// //     setFilterType('');
// //     setSelectedIncidents([]);
// //     setShowActiveOnly(false);
// //   };

// //   const toggleActiveOnly = () => {
// //     setShowActiveOnly(!showActiveOnly);
// //   };

// //   const toggleAutoRepairMode = () => {
// //     setAutoRepairMode(!autoRepairMode);
// //   };

// //   const markAllActiveForRepair = () => {
// //     if (activeIncidents.length === 0) {
// //       showMessage('info', 'Aucun incident actif à marquer');
// //       return;
// //     }
    
// //     const activeIds = activeIncidents
// //       .map(i => i.id)
// //       .filter((id): id is number => id !== undefined);
    
// //     setSelectedIncidents(activeIds);
// //     showMessage('info', `${activeIncidents.length} incidents actifs sélectionnés pour réparation`);
// //   };

// //   const resolveLongDurationIncidents = async () => {
// //     try {
// //       const sevenDaysAgo = new Date();
// //       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
// //       const oldActiveIncidents = activeIncidents.filter(incident => {
// //         const creationDate = new Date(incident.date_creation || '');
// //         return creationDate < sevenDaysAgo;
// //       });
      
// //       if (oldActiveIncidents.length === 0) {
// //         showMessage('info', 'Aucun incident ancien à résoudre');
// //         return;
// //       }
      
// //       const resolvePromises = oldActiveIncidents.map(incident => 
// //         incidentsAPI.resoudre(incident.id || 0).catch(err => {
// //           console.error(`Erreur résolution incident ${incident.id}:`, err);
// //           return null;
// //         })
// //       );
      
// //       await Promise.all(resolvePromises);
      
// //       showMessage('success', `${oldActiveIncidents.length} incidents anciens résolus`);
// //       await fetchIncidents();
// //     } catch (error: any) {
// //       console.error('❌ Erreur résolution incidents anciens:', error);
// //       showMessage('error', handleApiError(error));
// //     }
// //   };

// //   const getStatusIcon = (status: string) => {
// //     switch (status) {
// //       case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
// //       case 'en_cours': return <Clock className="w-4 h-4" />;
// //       case 'resolu': return <CheckCircle className="w-4 h-4" />;
// //       case 'ferme': return <CheckCircle className="w-4 h-4" />;
// //       default: return <AlertTriangle className="w-4 h-4" />;
// //     }
// //   };

// //   const fetchIncidents = async () => {
// //     try {
// //       setLoading(true);
// //       console.log('🔄 Chargement des incidents...');
      
// //       const response = await incidentsAPI.getAll();
// //       console.log('📥 Réponse incidents:', response);
      
// //       const extractedData = extractDataFromResponse(response);
// //       console.log(`✅ ${extractedData.length} incidents chargés`);
      
// //       const getSignaleurName = (inc: any): string => {
// //         // Fonction pour extraire le nom du signaleur
// //         const getUserDisplayName = (user: any): string => {
// //           if (!user) return '';
          
// //           if (user.first_name && user.last_name) {
// //             return `${user.first_name} ${user.last_name}`;
// //           }
          
// //           if (user.username) return user.username;
          
// //           if (user.email) return user.email.split('@')[0];
          
// //           if (user.id) return `Utilisateur #${user.id}`;
          
// //           return '';
// //         };
        
// //         // Priorité 1: utilisateur_nom direct
// //         if (inc.utilisateur_nom) return inc.utilisateur_nom;
        
// //         // Priorité 2: détails de l'utilisateur signaleur
// //         if (inc.utilisateur_signaleur_details) {
// //           const name = getUserDisplayName(inc.utilisateur_signaleur_details);
// //           if (name) return name;
// //         }
        
// //         // Priorité 3: user_details
// //         if (inc.user_details) {
// //           const name = getUserDisplayName(inc.user_details);
// //           if (name) return name;
// //         }
        
// //         // Priorité 4: champs individuels
// //         if (inc.signaleur_nom_complet) return inc.signaleur_nom_complet;
// //         if (inc.signaleur_prenom && inc.signaleur_nom) {
// //           return `${inc.signaleur_prenom} ${inc.signaleur_nom}`;
// //         }
        
// //         // Fallback
// //         return inc.utilisateur_signaleur ? `Utilisateur #${inc.utilisateur_signaleur}` : 'Non spécifié';
// //       };
      
// //       const formattedIncidents: FormattedIncident[] = extractedData.map((incident: any) => ({
// //         id: incident.id || 0,
// //         description: incident.description || '',
// //         type_incident: incident.type_incident || 'materiel',
// //         priorite: incident.priorite || 'moyenne',
// //         statut: incident.statut || 'ouvert',
// //         date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
// //         date_resolution: incident.date_resolution || null,
// //         utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
// //         materiel: incident.materiel || null,
// //         logiciel: incident.logiciel || null,
// //         reseau: incident.reseau || null,
        
// //         utilisateur_nom: getSignaleurName(incident),
// //         materiel_nom: incident.materiel_nom || 
// //                      (incident.materiel_details?.nom || incident.materiel_details?.reference || 
// //                       (incident.materiel ? `Matériel #${incident.materiel}` : '')),
// //         logiciel_nom: incident.logiciel_nom || 
// //                      (incident.logiciel_details?.nom || 
// //                       (incident.logiciel ? `Logiciel #${incident.logiciel}` : ''))
// //       }));
      
// //       const activeOnes = filterActiveIncidents(formattedIncidents);
// //       setActiveIncidents(activeOnes);
      
// //       setIncidents(formattedIncidents);
// //       setFilteredIncidents(formattedIncidents);
// //       setError('');
      
// //       if (formattedIncidents.length === 0) {
// //         showMessage('info', 'Aucun incident trouvé');
// //       }
      
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement incidents:', err);
// //       const errorMsg = handleApiError(err);
// //       setError(errorMsg);
// //       showMessage('error', errorMsg);
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   const fetchRelatedData = async () => {
// //     try {
// //       console.log('🔄 Chargement des données liées...');
      
// //       const [materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
// //         materielsAPI.getAll(),
// //         logicielsAPI.getAll(),
// //         reseauAPI.getAll()
// //       ]);
      
// //       let materielsData: Materiel[] = [];
// //       if (materielsRes.status === 'fulfilled') {
// //         materielsData = extractDataFromResponse(materielsRes.value);
// //         console.log(`✅ ${materielsData.length} matériels chargés`);
// //       }
      
// //       let logicielsData: Logiciel[] = [];
// //       if (logicielsRes.status === 'fulfilled') {
// //         logicielsData = extractDataFromResponse(logicielsRes.value);
// //         console.log(`✅ ${logicielsData.length} logiciels chargés`);
// //       }
      
// //       let reseauxData: Reseau[] = [];
// //       if (reseauxRes.status === 'fulfilled') {
// //         reseauxData = extractDataFromResponse(reseauxRes.value);
// //         console.log(`✅ ${reseauxData.length} réseaux chargés`);
// //       }
      
// //       setMateriels(materielsData);
// //       setLogiciels(logicielsData);
// //       setReseaux(reseauxData);
      
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement données liées:', err);
// //     }
// //   };

// //   useEffect(() => {
// //     const loadInitialData = async () => {
// //       await fetchIncidents();
// //       await fetchRelatedData();
// //     };
    
// //     loadInitialData();
// //   }, []);

// //   useEffect(() => {
// //     filterIncidents();
// //   }, [incidents, searchTerm, filterStatut, filterPriorite, filterType, showActiveOnly]);

// //   useEffect(() => {
// //     if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
// //       setIsSelectAll(true);
// //     } else {
// //       setIsSelectAll(false);
// //     }
// //   }, [selectedIncidents, filteredIncidents]);

// //   const filterIncidents = () => {
// //     let filtered = showActiveOnly ? activeIncidents : safeArray<FormattedIncident>(incidents);

// //     if (searchTerm) {
// //       const searchLower = searchTerm.toLowerCase();
// //       filtered = safeFilter<FormattedIncident>(filtered, incident => 
// //         (incident.description?.toLowerCase() || '').includes(searchLower) ||
// //         (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
// //         (incident.logiciel_nom?.toLowerCase() || '').includes(searchLower) ||
// //         (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
// //       );
// //     }

// //     if (filterStatut) {
// //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
// //     }

// //     if (filterPriorite) {
// //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
// //     }

// //     if (filterType) {
// //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
// //     }

// //     setFilteredIncidents(filtered);
// //     setSelectedIncidents([]);
// //   };

// //   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
// //     setMessage({ type, text });
// //     setTimeout(() => setMessage(null), 5000);
// //   };

// //   const handleSubmit = async (incidentData: any) => {
// //     try {
// //       console.log('📤 Soumission incident:', incidentData);
      
// //       const currentUser = getCurrentUser();
      
// //       const formattedData: any = {
// //         description: incidentData.description,
// //         type_incident: incidentData.type_incident,
// //         priorite: incidentData.priorite,
// //         statut: incidentData.statut,
// //         utilisateur_signaleur: currentUser.id
// //       };
      
// //       if (incidentData.date_creation) {
// //         formattedData.date_creation = incidentData.date_creation;
// //       } else if (editingIncident && editingIncident.date_creation) {
// //         formattedData.date_creation = editingIncident.date_creation;
// //       }
      
// //       if (incidentData.date_resolution) {
// //         formattedData.date_resolution = incidentData.date_resolution;
// //       }
      
// //       if (incidentData.materiel && incidentData.materiel > 0) {
// //         formattedData.materiel = incidentData.materiel;
// //       }
// //       if (incidentData.logiciel && incidentData.logiciel > 0) {
// //         formattedData.logiciel = incidentData.logiciel;
// //       }
// //       if (incidentData.reseau && incidentData.reseau > 0) {
// //         formattedData.reseau = incidentData.reseau;
// //       }
      
// //       console.log('📤 Données envoyées à l\'API:', formattedData);
      
// //       if (editingIncident && editingIncident.id) {
// //         await incidentsAPI.update(editingIncident.id, formattedData);
// //         showMessage('success', 'Incident modifié avec succès');
// //       } else {
// //         await incidentsAPI.create(formattedData);
// //         showMessage('success', 'Incident créé avec succès');
// //       }
      
// //       await fetchIncidents();
// //       setIsFormOpen(false);
// //       setEditingIncident(undefined);
      
// //     } catch (error: any) {
// //       console.error('❌ Erreur soumission incident:', error);
// //       const errorMsg = handleApiError(error);
// //       showMessage('error', errorMsg);
// //     }
// //   };

// //   const toggleSelectIncident = (id: number) => {
// //     setSelectedIncidents(prev => 
// //       prev.includes(id) 
// //         ? prev.filter(item => item !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   const toggleSelectAll = () => {
// //     if (isSelectAll) {
// //       setSelectedIncidents([]);
// //     } else {
// //       const allIds = filteredIncidents
// //         .map(i => i.id)
// //         .filter((id): id is number => id !== undefined);
// //       setSelectedIncidents(allIds);
// //     }
// //   };

// //   const handleDeleteSelected = async () => {
// //     if (selectedIncidents.length === 0) {
// //       showMessage('error', 'Aucun incident sélectionné');
// //       return;
// //     }

// //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIncidents.length} incident(s) ?`)) {
// //       try {
// //         const deletePromises = selectedIncidents.map(id => 
// //           incidentsAPI.delete(id).catch(err => {
// //             console.error(`Erreur suppression incident ${id}:`, err);
// //             return null;
// //           })
// //         );
        
// //         await Promise.all(deletePromises);
        
// //         showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
// //         setSelectedIncidents([]);
// //         await fetchIncidents();
// //       } catch (error: any) {
// //         console.error('❌ Erreur suppression incidents:', error);
// //         showMessage('error', handleApiError(error));
// //       }
// //     }
// //   };

// //   const handleEditSelected = () => {
// //     if (selectedIncidents.length === 0) {
// //       showMessage('error', 'Aucun incident sélectionné');
// //       return;
// //     }

// //     if (selectedIncidents.length === 1) {
// //       const incident = incidents.find(i => i.id === selectedIncidents[0]);
// //       if (incident) {
// //         handleEdit(incident);
// //       }
// //     } else {
// //       showMessage('info', `Édition multiple de ${selectedIncidents.length} incidents`);
// //     }
// //   };

// //   const handleResoudreSelected = async () => {
// //     if (selectedIncidents.length === 0) {
// //       showMessage('error', 'Aucun incident sélectionné');
// //       return;
// //     }

// //     try {
// //       const resolvePromises = selectedIncidents.map(id => 
// //         incidentsAPI.resoudre(id).catch(err => {
// //           console.error(`Erreur résolution incident ${id}:`, err);
// //           return null;
// //         })
// //       );
      
// //       await Promise.all(resolvePromises);
      
// //       showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
// //       setSelectedIncidents([]);
// //       await fetchIncidents();
// //     } catch (error: any) {
// //       console.error('❌ Erreur résolution incidents:', error);
// //       showMessage('error', handleApiError(error));
// //     }
// //   };

// //   const handleEdit = (incident: FormattedIncident) => {
// //     console.log('✏️ Édition incident:', incident);
// //     setEditingIncident(incident);
// //     setIsFormOpen(true);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
// //       try {
// //         await incidentsAPI.delete(id);
// //         showMessage('success', 'Incident supprimé avec succès');
// //         await fetchIncidents();
// //       } catch (error: any) {
// //         console.error('❌ Erreur suppression incident:', error);
// //         showMessage('error', handleApiError(error));
// //       }
// //     }
// //   };

// //   const handleResoudre = async (id: number) => {
// //     try {
// //       await incidentsAPI.resoudre(id);
// //       showMessage('success', 'Incident marqué comme résolu');
// //       await fetchIncidents();
// //     } catch (error: any) {
// //       console.error('❌ Erreur résolution incident:', error);
// //       showMessage('error', handleApiError(error));
// //     }
// //   };

// //   const handleAddNew = () => {
// //     setEditingIncident(undefined);
// //     setIsFormOpen(true);
// //   };

// //   const handleRefresh = async () => {
// //     setRefreshing(true);
// //     await fetchIncidents();
// //     showMessage('success', 'Données rafraîchies');
// //   };

// //   const getPriorityBadge = (priority: string) => {
// //     const badges: Record<string, string> = {
// //       critique: 'badge-error',
// //       elevee: 'badge-warning',
// //       moyenne: 'badge-info',
// //       basse: 'badge-success'
// //     };
// //     return badges[priority] || 'badge-neutral';
// //   };

// //   const getPriorityText = (priority: string) => {
// //     const texts: Record<string, string> = {
// //       critique: 'Critique',
// //       elevee: 'Élevée',
// //       moyenne: 'Moyenne',
// //       basse: 'Basse'
// //     };
// //     return texts[priority] || priority;
// //   };

// //   const getStatusBadge = (status: string) => {
// //     const badges: Record<string, string> = {
// //       ouvert: 'badge-warning',
// //       en_cours: 'badge-info',
// //       resolu: 'badge-success',
// //       ferme: 'badge-neutral'
// //     };
// //     return badges[status] || 'badge-neutral';
// //   };

// //   const getStatusText = (status: string) => {
// //     const texts: Record<string, string> = {
// //       ouvert: 'Ouvert',
// //       en_cours: 'En cours',
// //       resolu: 'Résolu',
// //       ferme: 'Fermé'
// //     };
// //     return texts[status] || status;
// //   };

// //   const getTypeText = (type: string) => {
// //     const texts: Record<string, string> = {
// //       materiel: 'Matériel',
// //       logiciel: 'Logiciel',
// //       reseau: 'Réseau',
// //       mixte: 'Mixte'
// //     };
// //     return texts[type] || type;
// //   };

// //   const stats = {
// //     total: safeArray<FormattedIncident>(incidents).length,
// //     ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
// //     en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
// //     resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu').length,
// //     actifs: activeIncidents.length
// //   };

// //   if (loading && !refreshing) {
// //     return (
// //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-4">
// //           <span className="loading loading-spinner loading-lg text-primary"></span>
// //           <p className="text-base-content">Chargement des incidents...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 bg-base-100 min-h-screen">
// //       {message && (
// //         <div className={`alert ${
// //           message.type === 'success' ? 'alert-success' : 
// //           message.type === 'error' ? 'alert-error' : 
// //           'alert-info'
// //         } mb-4 shadow-lg`}>
// //           <span>{message.text}</span>
// //         </div>
// //       )}

// //       {error && (
// //         <div className="alert alert-error mb-4 shadow-lg">
// //           <AlertTriangle className="h-5 w-5" />
// //           <span>{error}</span>
// //           <button 
// //             className="btn btn-sm btn-ghost"
// //             onClick={handleRefresh}
// //           >
// //             <RefreshCw className="h-4 w-4" />
// //             Réessayer
// //           </button>
// //         </div>
// //       )}

// //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
// //         <div>
// //           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
// //           <p className="text-base-content opacity-60 mt-1">
// //             Suivi et résolution des incidents techniques ({safeArray<FormattedIncident>(filteredIncidents).length} incidents)
// //             {selectedIncidents.length > 0 && (
// //               <span className="text-primary font-semibold ml-2">
// //                 ({selectedIncidents.length} sélectionné(s))
// //               </span>
// //             )}
// //             {showActiveOnly && (
// //               <span className="text-warning font-semibold ml-2">
// //                 🔧 Affichage actifs seulement
// //               </span>
// //             )}
// //           </p>
// //         </div>
// //         <div className="flex gap-2 flex-wrap">
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
// //             disabled={filteredIncidents.length === 0}
// //           >
// //             <Download className="h-4 w-4 mr-2" />
// //             Exporter
// //           </button>
// //           <button
// //             onClick={handleAddNew}
// //             className="btn btn-primary btn-sm"
// //           >
// //             <Plus className="h-4 w-4 mr-2" />
// //             Nouvel incident
// //           </button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
// //                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
// //               </div>
// //               <div className="text-2xl">📊</div>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">Ouverts</p>
// //                 <p className="text-2xl font-bold text-orange-600">{stats.ouvert}</p>
// //               </div>
// //               <AlertTriangle className="w-6 h-6 text-orange-500" />
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">En cours</p>
// //                 <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
// //               </div>
// //               <Clock className="w-6 h-6 text-blue-500" />
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">Résolus</p>
// //                 <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
// //               </div>
// //               <CheckCircle className="w-6 h-6 text-green-500" />
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="card bg-warning/10 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">
// //                   {autoRepairMode ? '🔄 En réparation' : '⚠️ Actifs'}
// //                 </p>
// //                 <p className="text-2xl font-bold text-warning">{activeIncidents.length}</p>
// //                 {activeIncidents.length > 0 && (
// //                   <div className="text-xs mt-1 opacity-70">
// //                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts
// //                   </div>
// //                 )}
// //               </div>
// //               <Wrench className="w-6 h-6 text-warning" />
// //             </div>
// //             {activeIncidents.length > 0 && (
// //               <div className="mt-2">
// //                 <button
// //                   onClick={toggleActiveOnly}
// //                   className="btn btn-warning btn-xs w-full mt-1"
// //                 >
// //                   {showActiveOnly ? 'Voir tous' : 'Voir actifs'}
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       <div className="card bg-base-200 shadow-xl mb-6">
// //         <div className="card-body">
// //           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔍 Rechercher</span>
// //               </label>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// //                 <input
// //                   type="text"
// //                   placeholder="Description, matériel, logiciel..."
// //                   className="input input-bordered w-full pl-10 bg-base-100"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
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
// //                 <option value="ouvert">Ouvert</option>
// //                 <option value="en_cours">En cours</option>
// //                 <option value="resolu">Résolu</option>
// //                 <option value="ferme">Fermé</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">⚠️ Priorité</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterPriorite}
// //                 onChange={(e) => setFilterPriorite(e.target.value)}
// //               >
// //                 <option value="">Toutes les priorités</option>
// //                 <option value="critique">Critique</option>
// //                 <option value="elevee">Élevée</option>
// //                 <option value="moyenne">Moyenne</option>
// //                 <option value="basse">Basse</option>
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
// //                 <option value="materiel">Matériel</option>
// //                 <option value="logiciel">Logiciel</option>
// //                 <option value="reseau">Réseau</option>
// //                 <option value="mixte">Mixte</option>
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

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔧 Réparation</span>
// //               </label>
// //               <div className="flex flex-col gap-2">
// //                 <button
// //                   onClick={toggleAutoRepairMode}
// //                   className={`btn btn-sm w-full ${autoRepairMode ? 'btn-warning' : 'btn-outline'}`}
// //                 >
// //                   {autoRepairMode ? '🔄 Auto ON' : 'Auto réparation'}
// //                 </button>
// //                 {activeIncidents.length > 0 && (
// //                   <button
// //                     onClick={markAllActiveForRepair}
// //                     className="btn btn-warning btn-sm w-full"
// //                     disabled={autoRepairMode}
// //                   >
// //                     Marquer pour réparation
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {activeIncidents.length > 0 && (
// //             <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
// //               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
// //                 <div className="flex items-center gap-3">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
// //                     <span className="font-semibold text-warning">
// //                       ⚠️ {activeIncidents.length} incident(s) actif(s)
// //                     </span>
// //                   </div>
// //                   <div className="text-sm opacity-70">
// //                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts, 
// //                     {' '}{safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'en_cours').length} en cours
// //                   </div>
// //                 </div>
// //                 <div className="flex gap-2 flex-wrap">
// //                   <button
// //                     onClick={markAllActiveForRepair}
// //                     className="btn btn-warning btn-sm gap-2"
// //                   >
// //                     <CheckSquare className="h-4 w-4" />
// //                     Tout marquer en réparation
// //                   </button>
// //                   <button
// //                     onClick={resolveLongDurationIncidents}
// //                     className="btn btn-outline btn-sm gap-2"
// //                     title="Résoudre les incidents en cours depuis plus de 7 jours"
// //                   >
// //                     <Clock className="h-4 w-4" />
// //                     Nettoyer anciens
// //                   </button>
// //                 </div>
// //               </div>
              
// //               {autoRepairMode && (
// //                 <div className="mt-3 pt-3 border-t border-warning/20">
// //                   <div className="text-sm font-medium text-warning mb-2">
// //                     🛠️ Prêts pour réparation immédiate:
// //                   </div>
// //                   <div className="flex flex-wrap gap-2">
// //                     {activeIncidents.slice(0, 5).map(incident => (
// //                       <div 
// //                         key={incident.id} 
// //                         className="badge badge-warning badge-lg gap-1 cursor-pointer hover:badge-outline"
// //                         onClick={() => handleEdit(incident)}
// //                         title={`Cliquer pour réparer: ${incident.description}`}
// //                       >
// //                         <span>#{incident.id}</span>
// //                         <span className="font-bold">{getPriorityText(incident.priorite)}</span>
// //                       </div>
// //                     ))}
// //                     {activeIncidents.length > 5 && (
// //                       <div className="badge badge-ghost">
// //                         +{activeIncidents.length - 5} autres...
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {selectedIncidents.length > 0 && (
// //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// //               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
// //                 <div className="flex items-center gap-4">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// //                     <span className="font-semibold text-primary text-lg">
// //                       {selectedIncidents.length} incident(s) sélectionné(s)
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="flex gap-2 flex-wrap">
// //                   <button
// //                     onClick={handleEditSelected}
// //                     className="btn btn-primary btn-sm gap-2"
// //                   >
// //                     <Edit className="h-4 w-4" />
// //                     Modifier ({selectedIncidents.length})
// //                   </button>
// //                   <button
// //                     onClick={handleResoudreSelected}
// //                     className="btn btn-success btn-sm gap-2"
// //                   >
// //                     <CheckCircle className="h-4 w-4" />
// //                     Résoudre ({selectedIncidents.length})
// //                   </button>
// //                   <button
// //                     onClick={handleDeleteSelected}
// //                     className="btn btn-error btn-sm gap-2"
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                     Supprimer ({selectedIncidents.length})
// //                   </button>
// //                   <button
// //                     onClick={() => setSelectedIncidents([])}
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
// //                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
// //                         disabled={filteredIncidents.length === 0}
// //                       >
// //                         {isSelectAll ? (
// //                           <CheckSquare className="h-5 w-5 text-primary" />
// //                         ) : (
// //                           <Square className="h-5 w-5 text-base-content/40" />
// //                         )}
// //                       </button>
// //                     </div>
// //                   </th>
// //                   <th className="font-bold">Description</th>
// //                   <th className="font-bold">Type</th>
// //                   <th className="font-bold">Priorité</th>
// //                   <th className="font-bold">Statut</th>
// //                   <th className="font-bold">Date création</th>
// //                   <th className="font-bold text-center">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {safeArray<FormattedIncident>(filteredIncidents).map((incident) => (
// //                   <tr key={incident.id} className="hover">
// //                     <td className="text-center">
// //                       <div className="flex justify-center">
// //                         <input
// //                           type="checkbox"
// //                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
// //                           checked={selectedIncidents.includes(incident.id || 0)}
// //                           onChange={() => toggleSelectIncident(incident.id || 0)}
// //                         />
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className="max-w-xs">
// //                         <div className="font-medium text-base-content line-clamp-2">
// //                           {incident.description}
// //                         </div>
                        
// //                         <div className="text-sm text-base-content opacity-70 mt-1">
// //                           👤 <span className="font-medium">Signaleur:</span> 
// //                           <span className="ml-1">
// //                             {incident.utilisateur_nom || 'Non spécifié'}
// //                           </span>
// //                         </div>
                        
// //                         {incident.materiel_nom && (
// //                           <div className="text-sm text-base-content opacity-70 mt-1">
// //                             📦 <span className="font-medium">Matériel:</span> 
// //                             <span className="ml-1">{incident.materiel_nom}</span>
// //                           </div>
// //                         )}
                        
// //                         {incident.logiciel_nom && (
// //                           <div className="text-sm text-base-content opacity-70">
// //                             💻 <span className="font-medium">Logiciel:</span> 
// //                             <span className="ml-1">{incident.logiciel_nom}</span>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <span className="text-sm font-medium capitalize">{getTypeText(incident.type_incident)}</span>
// //                     </td>
// //                     <td>
// //                       <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg ${(incident.statut === 'ouvert' || incident.statut === 'en_cours') ? 'badge-outline' : ''}`}>
// //                         {getPriorityText(incident.priorite)}
// //                         {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && incident.priorite === 'critique' && (
// //                           <span className="ml-1">🔥</span>
// //                         )}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className="flex items-center gap-2">
// //                         {getStatusIcon(incident.statut)}
// //                         <div className={`badge ${getStatusBadge(incident.statut)}`}>
// //                           {getStatusText(incident.statut)}
// //                         </div>
// //                         {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && (
// //                           <span className="text-xs text-warning font-semibold">
// //                             🔧
// //                           </span>
// //                         )}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <span className="text-sm font-medium">
// //                         {incident.date_creation ? new Date(incident.date_creation).toLocaleDateString('fr-FR') : '-'}
// //                       </span>
// //                       <div className="text-xs text-base-content opacity-60 mt-1">
// //                         {incident.date_creation ? new Date(incident.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className="flex justify-center space-x-1">
// //                         <button
// //                           className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
// //                           title="Voir les détails"
// //                           onClick={() => {
// //                             showMessage('info', `Détails de l'incident #${incident.id}`);
// //                           }}
// //                         >
// //                           <Eye className="h-4 w-4" />
// //                         </button>
// //                         <button
// //                           onClick={() => handleEdit(incident)}
// //                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
// //                           title="Modifier"
// //                         >
// //                           <Edit className="h-4 w-4" />
// //                         </button>
// //                         {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
// //                           <button
// //                             onClick={() => handleResoudre(incident.id || 0)}
// //                             className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
// //                             title="Marquer comme résolu"
// //                           >
// //                             <CheckCircle className="h-4 w-4" />
// //                           </button>
// //                         )}
// //                         <button
// //                           onClick={() => handleDelete(incident.id || 0)}
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

// //           {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
// //             <div className="text-center py-12">
// //               <div className="text-base-content opacity-40 mb-4">
// //                 <Search className="h-16 w-16 mx-auto mb-4" />
// //                 <p className="text-lg font-medium">Aucun incident trouvé</p>
// //                 <p className="text-sm mt-2">
// //                   {searchTerm || filterStatut || filterPriorite || filterType || showActiveOnly
// //                     ? "Essayez de modifier vos critères de recherche" 
// //                     : "Aucun incident n'est enregistré dans le système"
// //                   }
// //                 </p>
// //                 <button
// //                   onClick={handleAddNew}
// //                   className="btn btn-primary btn-sm mt-4"
// //                 >
// //                   <Plus className="h-4 w-4 mr-2" />
// //                   Créer le premier incident
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <IncidentForm
// //         isOpen={isFormOpen}
// //         onClose={() => {
// //           setIsFormOpen(false);
// //           setEditingIncident(undefined);
// //         }}
// //         onSubmit={handleSubmit}
// //         incident={editingIncident}
// //         currentUser={getCurrentUser()}
// //       />
// //     </div>
// //   );
// // };

// // export default Incidents;



// // // // // Incidents.tsx - Version avec source matérielle uniquement et date de création simplifiée
// // // // import React, { useState, useEffect } from 'react';
// // // // import { 
// // // //   Plus, 
// // // //   Search, 
// // // //   Eye, 
// // // //   Filter, 
// // // //   Download, 
// // // //   Edit, 
// // // //   Trash2, 
// // // //   CheckSquare, 
// // // //   Square, 
// // // //   X, 
// // // //   AlertTriangle, 
// // // //   Clock, 
// // // //   CheckCircle,
// // // //   RefreshCw,
// // // //   Wrench,
// // // //   User,
// // // //   UserCircle,
// // // //   Cpu
// // // // } from 'lucide-react';
// // // // import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
// // // // import api, { incidentsAPI, materielsAPI, logicielsAPI, reseauAPI, handleApiError } from '../services/api';
// // // // import IncidentForm from '../components/IncidentForm';
// // // // import { useAuth } from '../context/AuthContext';

// // // // // Type pour les incidents formatés
// // // // interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom' | 'logiciel_nom' | 'signaleur_details' | 'reseau_nom'> {
// // // //   utilisateur_nom?: string;
// // // //   materiel_nom?: string;
// // // //   logiciel_nom?: string;
// // // //   reseau_nom?: string;
// // // //   signaleur_details?: UserType;
// // // // }

// // // // // Fonctions helper
// // // // const safeArray = <T,>(data: any): T[] => {
// // // //   if (!data) return [];
// // // //   if (Array.isArray(data)) return data as T[];
// // // //   if (data.results && Array.isArray(data.results)) return data.results as T[];
// // // //   if (data.data && Array.isArray(data.data)) return data.data as T[];
// // // //   return [];
// // // // };

// // // // const safeFilter = <T,>(array: T[], condition: (item: T) => boolean): T[] => {
// // // //   if (!Array.isArray(array)) return [];
// // // //   return array.filter(condition);
// // // // };

// // // // const extractDataFromResponse = (response: any): any[] => {
// // // //   if (!response) return [];
  
// // // //   if (Array.isArray(response)) return response;
  
// // // //   if (response.data !== undefined) {
// // // //     if (Array.isArray(response.data)) return response.data;
    
// // // //     if (response.data.results && Array.isArray(response.data.results)) {
// // // //       return response.data.results;
// // // //     }
    
// // // //     if (response.data.data && Array.isArray(response.data.data)) {
// // // //       return response.data.data;
// // // //     }
    
// // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // // //       return [response.data];
// // // //     }
// // // //   }
  
// // // //   if (response.results && Array.isArray(response.results)) {
// // // //     return response.results;
// // // //   }
  
// // // //   return [];
// // // // };

// // // // const Incidents: React.FC = () => {
// // // //   // UTILISATEUR DEPUIS LE CONTEXTE AUTH
// // // //   const { user: authUser } = useAuth();
  
// // // //   const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
// // // //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// // // //   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
// // // //   const [reseaux, setReseaux] = useState<Reseau[]>([]);
// // // //   const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
// // // //   const [activeIncidents, setActiveIncidents] = useState<FormattedIncident[]>([]);
// // // //   const [loading, setLoading] = useState<boolean>(true);
// // // //   const [error, setError] = useState<string>('');
// // // //   const [searchTerm, setSearchTerm] = useState<string>('');
// // // //   const [filterStatut, setFilterStatut] = useState<string>('');
// // // //   const [filterPriorite, setFilterPriorite] = useState<string>('');
// // // //   const [filterType, setFilterType] = useState<string>('');
// // // //   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
// // // //   const [isFormOpen, setIsFormOpen] = useState(false);
// // // //   const [editingIncident, setEditingIncident] = useState<FormattedIncident | undefined>();
// // // //   const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
// // // //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
// // // //   const [refreshing, setRefreshing] = useState<boolean>(false);
// // // //   const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
// // // //   const [autoRepairMode, setAutoRepairMode] = useState<boolean>(false);

// // // //   // FONCTION POUR OBTENIR L'UTILISATEUR CONNECTÉ (DEPUIS AUTH)
// // // //   const getCurrentUser = (): UserType => {
// // // //     if (authUser) {
// // // //       return {
// // // //         id: authUser.id || 0,
// // // //         username: authUser.username || '',
// // // //         first_name: authUser.first_name || '',
// // // //         last_name: authUser.last_name || '',
// // // //         email: authUser.email || '',
// // // //         is_active: authUser.is_active !== false,
// // // //         date_joined: authUser.date_joined || new Date().toISOString(),
// // // //         role: authUser.role,
// // // //         departement: authUser.departement || '',
// // // //         telephone: authUser.telephone || ''
// // // //       };
// // // //     }
    
// // // //     // Fallback si authUser n'est pas disponible
// // // //     try {
// // // //       const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
// // // //       if (userStr) {
// // // //         const user = JSON.parse(userStr);
// // // //         return {
// // // //           id: user.id || 0,
// // // //           username: user.username || '',
// // // //           first_name: user.first_name || '',
// // // //           last_name: user.last_name || '',
// // // //           email: user.email || '',
// // // //           is_active: user.is_active !== false,
// // // //           date_joined: user.date_joined || new Date().toISOString(),
// // // //           role: user.role || 'user',
// // // //           departement: user.departement || '',
// // // //           telephone: user.telephone || ''
// // // //         };
// // // //       }
// // // //     } catch (e) {
// // // //       console.error('Erreur parsing user:', e);
// // // //     }
    
// // // //     // Fallback final
// // // //     return {
// // // //       id: 0,
// // // //       username: 'utilisateur',
// // // //       first_name: 'Utilisateur',
// // // //       last_name: 'Connecté',
// // // //       email: 'user@example.com',
// // // //       is_active: true,
// // // //       date_joined: new Date().toISOString(),
// // // //       role: 'user',
// // // //       departement: ''
// // // //     };
// // // //   };

// // // //   // Formater le nom d'utilisateur
// // // //   const formatUserName = (user: any): string => {
// // // //     if (!user) return 'Utilisateur inconnu';
    
// // // //     if (user.first_name && user.last_name) {
// // // //       return `${user.first_name} ${user.last_name}`;
// // // //     }
    
// // // //     if (user.username) {
// // // //       return user.username;
// // // //     }
    
// // // //     if (user.email) {
// // // //       return user.email.split('@')[0];
// // // //     }
    
// // // //     return `Utilisateur #${user.id || '?'}`;
// // // //   };

// // // //   // Formater la date avec heure
// // // //   const formatDateTime = (dateString: string) => {
// // // //     if (!dateString) return '-';
// // // //     const date = new Date(dateString);
// // // //     return date.toLocaleDateString('fr-FR', {
// // // //       day: '2-digit',
// // // //       month: '2-digit',
// // // //       year: 'numeric',
// // // //       hour: '2-digit',
// // // //       minute: '2-digit'
// // // //     });
// // // //   };

// // // //   // Charger les incidents avec les détails du signaleur et sources
// // // //   const fetchIncidents = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       console.log('🔄 Chargement des incidents...');
      
// // // //       const response = await incidentsAPI.getAll();
// // // //       const extractedData = extractDataFromResponse(response);
// // // //       console.log(`✅ ${extractedData.length} incidents chargés`);
      
// // // //       // Formater les incidents avec détails
// // // //       const formattedIncidents: FormattedIncident[] = extractedData.map((incident: any) => {
// // // //         // Récupérer les détails du signaleur
// // // //         let signaleurDetails: UserType | undefined;
        
// // // //         if (incident.utilisateur_signaleur_details) {
// // // //           signaleurDetails = {
// // // //             id: incident.utilisateur_signaleur_details.id,
// // // //             username: incident.utilisateur_signaleur_details.username,
// // // //             first_name: incident.utilisateur_signaleur_details.first_name,
// // // //             last_name: incident.utilisateur_signaleur_details.last_name,
// // // //             email: incident.utilisateur_signaleur_details.email,
// // // //             role: incident.utilisateur_signaleur_details.role,
// // // //             departement: incident.utilisateur_signaleur_details.departement,
// // // //             is_active: incident.utilisateur_signaleur_details.is_active,
// // // //             date_joined: incident.utilisateur_signaleur_details.date_joined
// // // //           };
// // // //         } else if (incident.user_details) {
// // // //           signaleurDetails = {
// // // //             id: incident.user_details.id,
// // // //             username: incident.user_details.username,
// // // //             first_name: incident.user_details.first_name,
// // // //             last_name: incident.user_details.last_name,
// // // //             email: incident.user_details.email,
// // // //             role: incident.user_details.role,
// // // //             departement: incident.user_details.departement,
// // // //             is_active: incident.user_details.is_active,
// // // //             date_joined: incident.user_details.date_joined
// // // //           };
// // // //         }
        
// // // //         // Déterminer le nom du signaleur
// // // //         let utilisateurNom = 'Inconnu';
// // // //         if (signaleurDetails) {
// // // //           utilisateurNom = formatUserName(signaleurDetails);
// // // //         } else if (incident.utilisateur_nom) {
// // // //           utilisateurNom = incident.utilisateur_nom;
// // // //         } else if (incident.utilisateur_signaleur) {
// // // //           utilisateurNom = `Utilisateur #${incident.utilisateur_signaleur}`;
// // // //         }
        
// // // //         // Récupérer le nom du matériel uniquement (selon votre demande)
// // // //         const materielNom = incident.materiel_nom || 
// // // //                           incident.materiel_details?.nom || 
// // // //                           incident.materiel_details?.reference || 
// // // //                           (incident.materiel ? `Matériel #${incident.materiel}` : '');
        
// // // //         return {
// // // //           id: incident.id || 0,
// // // //           description: incident.description || '',
// // // //           type_incident: incident.type_incident || 'materiel',
// // // //           priorite: incident.priorite || 'moyenne',
// // // //           statut: incident.statut || 'ouvert',
// // // //           date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
// // // //           date_resolution: incident.date_resolution || null,
// // // //           utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
// // // //           materiel: incident.materiel || null,
// // // //           logiciel: incident.logiciel || null,
// // // //           reseau: incident.reseau || null,
          
// // // //           // Champs pour l'affichage
// // // //           utilisateur_nom: utilisateurNom,
// // // //           materiel_nom: materielNom,
// // // //           logiciel_nom: '', // Vide car on n'affiche pas le logiciel
// // // //           reseau_nom: '',   // Vide car on n'affiche pas le réseau
          
// // // //           // Détails complets du signaleur
// // // //           signaleur_details: signaleurDetails
// // // //         };
// // // //       });
      
// // // //       // Filtrer les incidents actifs
// // // //       const activeOnes = safeFilter<FormattedIncident>(
// // // //         formattedIncidents, 
// // // //         i => i.statut === 'ouvert' || i.statut === 'en_cours'
// // // //       );
// // // //       setActiveIncidents(activeOnes);
      
// // // //       setIncidents(formattedIncidents);
// // // //       setFilteredIncidents(formattedIncidents);
// // // //       setError('');
      
// // // //       if (formattedIncidents.length === 0) {
// // // //         showMessage('info', 'Aucun incident trouvé');
// // // //       }
      
// // // //     } catch (err: any) {
// // // //       console.error('❌ Erreur chargement incidents:', err);
// // // //       const errorMsg = handleApiError(err);
// // // //       setError(errorMsg);
// // // //       showMessage('error', errorMsg);
// // // //     } finally {
// // // //       setLoading(false);
// // // //       setRefreshing(false);
// // // //     }
// // // //   };

// // // //   // Charger les données liées
// // // //   const fetchRelatedData = async () => {
// // // //     try {
// // // //       console.log('🔄 Chargement des données liées...');
      
// // // //       const [materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
// // // //         materielsAPI.getAll(),
// // // //         logicielsAPI.getAll(),
// // // //         reseauAPI.getAll()
// // // //       ]);
      
// // // //       // Traiter les matériels
// // // //       let materielsData: Materiel[] = [];
// // // //       if (materielsRes.status === 'fulfilled') {
// // // //         materielsData = extractDataFromResponse(materielsRes.value);
// // // //         console.log(`✅ ${materielsData.length} matériels chargés`);
// // // //       }
      
// // // //       // Traiter les logiciels
// // // //       let logicielsData: Logiciel[] = [];
// // // //       if (logicielsRes.status === 'fulfilled') {
// // // //         logicielsData = extractDataFromResponse(logicielsRes.value);
// // // //         console.log(`✅ ${logicielsData.length} logiciels chargés`);
// // // //       }
      
// // // //       // Traiter les réseaux
// // // //       let reseauxData: Reseau[] = [];
// // // //       if (reseauxRes.status === 'fulfilled') {
// // // //         reseauxData = extractDataFromResponse(reseauxRes.value);
// // // //         console.log(`✅ ${reseauxData.length} réseaux chargés`);
// // // //       }
      
// // // //       setMateriels(materielsData);
// // // //       setLogiciels(logicielsData);
// // // //       setReseaux(reseauxData);
      
// // // //     } catch (err: any) {
// // // //       console.error('❌ Erreur chargement données liées:', err);
// // // //     }
// // // //   };

// // // //   // Effet pour charger les données initiales
// // // //   useEffect(() => {
// // // //     const loadInitialData = async () => {
// // // //       await fetchIncidents();
// // // //       await fetchRelatedData();
// // // //     };
    
// // // //     loadInitialData();
// // // //   }, []);

// // // //   // Effet pour filtrer les incidents
// // // //   useEffect(() => {
// // // //     filterIncidents();
// // // //   }, [incidents, searchTerm, filterStatut, filterPriorite, filterType, showActiveOnly]);

// // // //   // Effet pour la sélection "Tout sélectionner"
// // // //   useEffect(() => {
// // // //     if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
// // // //       setIsSelectAll(true);
// // // //     } else {
// // // //       setIsSelectAll(false);
// // // //     }
// // // //   }, [selectedIncidents, filteredIncidents]);

// // // //   // Filtrer les incidents
// // // //   const filterIncidents = () => {
// // // //     let filtered = showActiveOnly ? activeIncidents : safeArray<FormattedIncident>(incidents);

// // // //     if (searchTerm) {
// // // //       const searchLower = searchTerm.toLowerCase();
// // // //       filtered = safeFilter<FormattedIncident>(filtered, incident => 
// // // //         (incident.description?.toLowerCase() || '').includes(searchLower) ||
// // // //         (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
// // // //         (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
// // // //       );
// // // //     }

// // // //     if (filterStatut) {
// // // //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
// // // //     }

// // // //     if (filterPriorite) {
// // // //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
// // // //     }

// // // //     if (filterType) {
// // // //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
// // // //     }

// // // //     setFilteredIncidents(filtered);
// // // //     setSelectedIncidents([]);
// // // //   };

// // // //   // Afficher un message
// // // //   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
// // // //     setMessage({ type, text });
// // // //     setTimeout(() => setMessage(null), 5000);
// // // //   };

// // // //   // Gérer la soumission du formulaire
// // // //   const handleSubmit = async (incidentData: any) => {
// // // //     try {
// // // //       console.log('📤 Soumission incident:', incidentData);
      
// // // //       // Obtenir l'utilisateur connecté comme signaleur
// // // //       const currentUser = getCurrentUser();
      
// // // //       const formattedData: any = {
// // // //         description: incidentData.description,
// // // //         type_incident: incidentData.type_incident,
// // // //         priorite: incidentData.priorite,
// // // //         statut: incidentData.statut || 'ouvert',
// // // //         utilisateur_signaleur: currentUser.id
// // // //       };
      
// // // //       // Utiliser la date de création si fournie, sinon utiliser maintenant
// // // //       if (incidentData.date_creation) {
// // // //         formattedData.date_creation = incidentData.date_creation;
// // // //       } else if (editingIncident && editingIncident.date_creation) {
// // // //         formattedData.date_creation = editingIncident.date_creation;
// // // //       }
      
// // // //       if (incidentData.date_resolution) {
// // // //         formattedData.date_resolution = incidentData.date_resolution;
// // // //       }
      
// // // //       // Ajouter les relations seulement si elles sont définies
// // // //       if (incidentData.materiel && incidentData.materiel > 0) {
// // // //         formattedData.materiel = incidentData.materiel;
// // // //       }
// // // //       if (incidentData.logiciel && incidentData.logiciel > 0) {
// // // //         formattedData.logiciel = incidentData.logiciel;
// // // //       }
// // // //       if (incidentData.reseau && incidentData.reseau > 0) {
// // // //         formattedData.reseau = incidentData.reseau;
// // // //       }
      
// // // //       if (editingIncident && editingIncident.id) {
// // // //         await incidentsAPI.update(editingIncident.id, formattedData);
// // // //         showMessage('success', 'Incident modifié avec succès');
// // // //       } else {
// // // //         await incidentsAPI.create(formattedData);
// // // //         showMessage('success', 'Incident créé avec succès');
// // // //       }
      
// // // //       await fetchIncidents();
// // // //       setIsFormOpen(false);
// // // //       setEditingIncident(undefined);
      
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur soumission incident:', error);
// // // //       const errorMsg = handleApiError(error);
// // // //       showMessage('error', errorMsg);
// // // //     }
// // // //   };

// // // //   // Gérer la sélection d'un incident
// // // //   const toggleSelectIncident = (id: number) => {
// // // //     setSelectedIncidents(prev => 
// // // //       prev.includes(id) 
// // // //         ? prev.filter(item => item !== id)
// // // //         : [...prev, id]
// // // //     );
// // // //   };

// // // //   // Gérer la sélection de tous les incidents
// // // //   const toggleSelectAll = () => {
// // // //     if (isSelectAll) {
// // // //       setSelectedIncidents([]);
// // // //     } else {
// // // //       const allIds = filteredIncidents
// // // //         .map(i => i.id)
// // // //         .filter((id): id is number => id !== undefined);
// // // //       setSelectedIncidents(allIds);
// // // //     }
// // // //   };

// // // //   // Supprimer les incidents sélectionnés
// // // //   const handleDeleteSelected = async () => {
// // // //     if (selectedIncidents.length === 0) {
// // // //       showMessage('error', 'Aucun incident sélectionné');
// // // //       return;
// // // //     }

// // // //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIncidents.length} incident(s) ?`)) {
// // // //       try {
// // // //         const deletePromises = selectedIncidents.map(id => 
// // // //           incidentsAPI.delete(id).catch(err => {
// // // //             console.error(`Erreur suppression incident ${id}:`, err);
// // // //             return null;
// // // //           })
// // // //         );
        
// // // //         await Promise.all(deletePromises);
        
// // // //         showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
// // // //         setSelectedIncidents([]);
// // // //         await fetchIncidents();
// // // //       } catch (error: any) {
// // // //         console.error('❌ Erreur suppression incidents:', error);
// // // //         showMessage('error', handleApiError(error));
// // // //       }
// // // //     }
// // // //   };

// // // //   // Éditer les incidents sélectionnés
// // // //   const handleEditSelected = () => {
// // // //     if (selectedIncidents.length === 0) {
// // // //       showMessage('error', 'Aucun incident sélectionné');
// // // //       return;
// // // //     }

// // // //     if (selectedIncidents.length === 1) {
// // // //       const incident = incidents.find(i => i.id === selectedIncidents[0]);
// // // //       if (incident) {
// // // //         handleEdit(incident);
// // // //       }
// // // //     } else {
// // // //       showMessage('info', `Édition multiple de ${selectedIncidents.length} incidents`);
// // // //     }
// // // //   };

// // // //   // Résoudre les incidents sélectionnés
// // // //   const handleResoudreSelected = async () => {
// // // //     if (selectedIncidents.length === 0) {
// // // //       showMessage('error', 'Aucun incident sélectionné');
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const resolvePromises = selectedIncidents.map(id => 
// // // //         incidentsAPI.resoudre(id).catch(err => {
// // // //           console.error(`Erreur résolution incident ${id}:`, err);
// // // //           return null;
// // // //         })
// // // //       );
      
// // // //       await Promise.all(resolvePromises);
      
// // // //       showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
// // // //       setSelectedIncidents([]);
// // // //       await fetchIncidents();
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur résolution incidents:', error);
// // // //       showMessage('error', handleApiError(error));
// // // //     }
// // // //   };

// // // //   // Éditer un incident
// // // //   const handleEdit = (incident: FormattedIncident) => {
// // // //     console.log('✏️ Édition incident:', incident);
// // // //     setEditingIncident(incident);
// // // //     setIsFormOpen(true);
// // // //   };

// // // //   // Supprimer un incident
// // // //   const handleDelete = async (id: number) => {
// // // //     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
// // // //       try {
// // // //         await incidentsAPI.delete(id);
// // // //         showMessage('success', 'Incident supprimé avec succès');
// // // //         await fetchIncidents();
// // // //       } catch (error: any) {
// // // //         console.error('❌ Erreur suppression incident:', error);
// // // //         showMessage('error', handleApiError(error));
// // // //       }
// // // //     }
// // // //   };

// // // //   // Résoudre un incident
// // // //   const handleResoudre = async (id: number) => {
// // // //     try {
// // // //       await incidentsAPI.resoudre(id);
// // // //       showMessage('success', 'Incident marqué comme résolu');
// // // //       await fetchIncidents();
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur résolution incident:', error);
// // // //       showMessage('error', handleApiError(error));
// // // //     }
// // // //   };

// // // //   // Ajouter un nouvel incident
// // // //   const handleAddNew = () => {
// // // //     setEditingIncident(undefined);
// // // //     setIsFormOpen(true);
// // // //   };

// // // //   // Rafraîchir les données
// // // //   const handleRefresh = async () => {
// // // //     setRefreshing(true);
// // // //     await fetchIncidents();
// // // //     showMessage('success', 'Données rafraîchies');
// // // //   };

// // // //   // Fonction pour exporter les incidents
// // // //   const handleExport = () => {
// // // //     try {
// // // //       const dataToExport = filteredIncidents.map(i => ({
// // // //         ID: i.id,
// // // //         Description: i.description,
// // // //         Type: getTypeText(i.type_incident),
// // // //         Priorité: getPriorityText(i.priorite),
// // // //         Statut: getStatusText(i.statut),
// // // //         'Matériel concerné': i.materiel_nom || 'Non spécifié',
// // // //         'Signaleur': i.utilisateur_nom || 'Non spécifié',
// // // //         'Date création': i.date_creation ? formatDateTime(i.date_creation) : 'Non spécifiée',
// // // //         'Date résolution': i.date_resolution ? formatDateTime(i.date_resolution) : 'Non résolu'
// // // //       }));

// // // //       // Vérifier qu'il y a des données à exporter
// // // //       if (dataToExport.length === 0) {
// // // //         showMessage('error', 'Aucune donnée à exporter');
// // // //         return;
// // // //       }

// // // //       const csvContent = [
// // // //         Object.keys(dataToExport[0] || {}).join(','),
// // // //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// // // //       ].join('\n');

// // // //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// // // //       const link = document.createElement('a');
// // // //       const url = URL.createObjectURL(blob);
// // // //       link.setAttribute('href', url);
// // // //       link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
// // // //       link.style.visibility = 'hidden';
// // // //       document.body.appendChild(link);
// // // //       link.click();
// // // //       document.body.removeChild(link);

// // // //       showMessage('success', 'Export CSV réussi !');
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur export:', error);
// // // //       showMessage('error', 'Erreur lors de l\'export');
// // // //     }
// // // //   };

// // // //   // Réinitialiser les filtres
// // // //   const resetFilters = () => {
// // // //     setSearchTerm('');
// // // //     setFilterStatut('');
// // // //     setFilterPriorite('');
// // // //     setFilterType('');
// // // //     setSelectedIncidents([]);
// // // //     setShowActiveOnly(false);
// // // //   };

// // // //   // Basculer l'affichage des actifs seulement
// // // //   const toggleActiveOnly = () => {
// // // //     setShowActiveOnly(!showActiveOnly);
// // // //   };

// // // //   // Basculer le mode auto-réparation
// // // //   const toggleAutoRepairMode = () => {
// // // //     setAutoRepairMode(!autoRepairMode);
// // // //   };

// // // //   // Marquer tous les actifs pour réparation
// // // //   const markAllActiveForRepair = () => {
// // // //     if (activeIncidents.length === 0) {
// // // //       showMessage('info', 'Aucun incident actif à marquer');
// // // //       return;
// // // //     }
    
// // // //     // Sélectionner tous les incidents actifs
// // // //     const activeIds = activeIncidents
// // // //       .map(i => i.id)
// // // //       .filter((id): id is number => id !== undefined);
    
// // // //     setSelectedIncidents(activeIds);
// // // //     showMessage('info', `${activeIncidents.length} incidents actifs sélectionnés pour réparation`);
// // // //   };

// // // //   // Résoudre les incidents de longue durée
// // // //   const resolveLongDurationIncidents = async () => {
// // // //     try {
// // // //       // Filtrer les incidents en cours depuis plus de 7 jours
// // // //       const sevenDaysAgo = new Date();
// // // //       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
// // // //       const oldActiveIncidents = activeIncidents.filter(incident => {
// // // //         const creationDate = new Date(incident.date_creation || '');
// // // //         return creationDate < sevenDaysAgo;
// // // //       });
      
// // // //       if (oldActiveIncidents.length === 0) {
// // // //         showMessage('info', 'Aucun incident ancien à résoudre');
// // // //         return;
// // // //       }
      
// // // //       const resolvePromises = oldActiveIncidents.map(incident => 
// // // //         incidentsAPI.resoudre(incident.id || 0).catch(err => {
// // // //           console.error(`Erreur résolution incident ${incident.id}:`, err);
// // // //           return null;
// // // //         })
// // // //       );
      
// // // //       await Promise.all(resolvePromises);
      
// // // //       showMessage('success', `${oldActiveIncidents.length} incidents anciens résolus`);
// // // //       await fetchIncidents();
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur résolution incidents anciens:', error);
// // // //       showMessage('error', handleApiError(error));
// // // //     }
// // // //   };

// // // //   // Fonctions utilitaires pour l'affichage
// // // //   const getPriorityBadge = (priority: string) => {
// // // //     const badges: Record<string, string> = {
// // // //       critique: 'badge-error',
// // // //       elevee: 'badge-warning',
// // // //       moyenne: 'badge-info',
// // // //       basse: 'badge-success'
// // // //     };
// // // //     return badges[priority] || 'badge-neutral';
// // // //   };

// // // //   const getPriorityText = (priority: string) => {
// // // //     const texts: Record<string, string> = {
// // // //       critique: 'Critique',
// // // //       elevee: 'Élevée',
// // // //       moyenne: 'Moyenne',
// // // //       basse: 'Basse'
// // // //     };
// // // //     return texts[priority] || priority;
// // // //   };

// // // //   const getStatusBadge = (status: string) => {
// // // //     const badges: Record<string, string> = {
// // // //       ouvert: 'badge-warning',
// // // //       en_cours: 'badge-info',
// // // //       resolu: 'badge-success',
// // // //       ferme: 'badge-neutral'
// // // //     };
// // // //     return badges[status] || 'badge-neutral';
// // // //   };

// // // //   const getStatusText = (status: string) => {
// // // //     const texts: Record<string, string> = {
// // // //       ouvert: 'Ouvert',
// // // //       en_cours: 'En cours',
// // // //       resolu: 'Résolu',
// // // //       ferme: 'Fermé'
// // // //     };
// // // //     return texts[status] || status;
// // // //   };

// // // //   const getTypeText = (type: string) => {
// // // //     const texts: Record<string, string> = {
// // // //       materiel: 'Matériel',
// // // //       logiciel: 'Logiciel',
// // // //       reseau: 'Réseau',
// // // //       mixte: 'Mixte'
// // // //     };
// // // //     return texts[type] || type;
// // // //   };

// // // //   // Obtenir l'icône de statut
// // // //   const getStatusIcon = (status: string) => {
// // // //     switch (status) {
// // // //       case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
// // // //       case 'en_cours': return <Clock className="w-4 h-4" />;
// // // //       case 'resolu': return <CheckCircle className="w-4 h-4" />;
// // // //       case 'ferme': return <CheckCircle className="w-4 h-4" />;
// // // //       default: return <AlertTriangle className="w-4 h-4" />;
// // // //     }
// // // //   };

// // // //   // Afficher les détails du signaleur
// // // //   const showSignaleurDetails = (incident: FormattedIncident) => {
// // // //     const signaleur = incident.signaleur_details;
    
// // // //     let message = `Incident #${incident.id}\n`;
// // // //     message += `Signaleur: ${incident.utilisateur_nom || 'Inconnu'}\n\n`;
    
// // // //     if (signaleur) {
// // // //       message += `Détails du signaleur:\n`;
// // // //       message += `- Nom: ${signaleur.first_name || ''} ${signaleur.last_name || ''}\n`;
// // // //       message += `- Email: ${signaleur.email || 'Non spécifié'}\n`;
// // // //       message += `- Rôle: ${signaleur.role || 'Non spécifié'}\n`;
// // // //       message += `- Département: ${signaleur.departement || 'Non spécifié'}\n`;
// // // //     } else {
// // // //       message += `Aucun détail supplémentaire disponible pour le signaleur.\n`;
// // // //     }
    
// // // //     showMessage('info', `Détails du signaleur pour l'incident #${incident.id}`);
// // // //   };

// // // //   // Rendu de la source (matériel uniquement)
// // // //   const renderSource = (incident: FormattedIncident) => {
// // // //     if (incident.materiel_nom) {
// // // //       return (
// // // //         <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
// // // //           <Cpu className="w-3 h-3" />
// // // //           <span>{incident.materiel_nom}</span>
// // // //         </div>
// // // //       );
// // // //     }
    
// // // //     return (
// // // //       <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
// // // //         <Cpu className="w-3 h-3" />
// // // //         <span>Aucun matériel spécifié</span>
// // // //       </div>
// // // //     );
// // // //   };

// // // //   // Statistiques
// // // //   const stats = {
// // // //     total: safeArray<FormattedIncident>(incidents).length,
// // // //     ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
// // // //     en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
// // // //     resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu').length,
// // // //     actifs: activeIncidents.length
// // // //   };

// // // //   if (loading && !refreshing) {
// // // //     return (
// // // //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// // // //         <div className="flex flex-col items-center gap-4">
// // // //           <span className="loading loading-spinner loading-lg text-primary"></span>
// // // //           <p className="text-base-content">Chargement des incidents...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="p-6 bg-base-100 min-h-screen">
// // // //       {/* Message de notification */}
// // // //       {message && (
// // // //         <div className={`alert ${
// // // //           message.type === 'success' ? 'alert-success' : 
// // // //           message.type === 'error' ? 'alert-error' : 
// // // //           'alert-info'
// // // //         } mb-4 shadow-lg`}>
// // // //           <span>{message.text}</span>
// // // //         </div>
// // // //       )}

// // // //       {error && (
// // // //         <div className="alert alert-error mb-4 shadow-lg">
// // // //           <AlertTriangle className="h-5 w-5" />
// // // //           <span>{error}</span>
// // // //           <button 
// // // //             className="btn btn-sm btn-ghost"
// // // //             onClick={handleRefresh}
// // // //           >
// // // //             <RefreshCw className="h-4 w-4" />
// // // //             Réessayer
// // // //           </button>
// // // //         </div>
// // // //       )}

// // // //       {/* En-tête */}
// // // //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
// // // //         <div>
// // // //           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
// // // //           <p className="text-base-content opacity-60 mt-1">
// // // //             Suivi et résolution des incidents techniques ({safeArray<FormattedIncident>(filteredIncidents).length} incidents)
// // // //             {selectedIncidents.length > 0 && (
// // // //               <span className="text-primary font-semibold ml-2">
// // // //                 ({selectedIncidents.length} sélectionné(s))
// // // //               </span>
// // // //             )}
// // // //             {showActiveOnly && (
// // // //               <span className="text-warning font-semibold ml-2">
// // // //                 🔧 Affichage actifs seulement
// // // //               </span>
// // // //             )}
// // // //           </p>
// // // //         </div>
// // // //         <div className="flex gap-2 flex-wrap">
// // // //           <button
// // // //             onClick={handleRefresh}
// // // //             className="btn btn-outline btn-sm"
// // // //             title="Rafraîchir"
// // // //             disabled={refreshing}
// // // //           >
// // // //             <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
// // // //             {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
// // // //           </button>
// // // //           <button
// // // //             onClick={handleExport}
// // // //             className="btn btn-outline btn-sm"
// // // //             title="Exporter la liste"
// // // //             disabled={filteredIncidents.length === 0}
// // // //           >
// // // //             <Download className="h-4 w-4 mr-2" />
// // // //             Exporter
// // // //           </button>
// // // //           <button
// // // //             onClick={handleAddNew}
// // // //             className="btn btn-primary btn-sm"
// // // //           >
// // // //             <Plus className="h-4 w-4 mr-2" />
// // // //             Nouvel incident
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Informations sur l'utilisateur connecté */}
// // // //       <div className="mb-6 p-4 bg-info/10 rounded-lg border border-info/20">
// // // //         <div className="flex items-center justify-between">
// // // //           <div className="flex items-center gap-3">
// // // //             <UserCircle className="h-6 w-6 text-info" />
// // // //             <div>
// // // //               <p className="font-medium text-info">👤 Utilisateur connecté</p>
// // // //               <p className="text-sm">
// // // //                 {getCurrentUser().first_name} {getCurrentUser().last_name} 
// // // //                 <span className="opacity-70 ml-2">({getCurrentUser().email})</span>
// // // //               </p>
// // // //               <p className="text-xs opacity-70">
// // // //                 Vous serez automatiquement désigné comme signaleur pour les nouveaux incidents
// // // //               </p>
// // // //             </div>
// // // //           </div>
// // // //           <div className="badge badge-info badge-lg">
// // // //             Signaleur par défaut
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Statistiques */}
// // // //       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
// // // //         <div className="card bg-base-200 shadow-xl">
// // // //           <div className="card-body py-4">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
// // // //                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
// // // //               </div>
// // // //               <div className="text-2xl">📊</div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
        
// // // //         <div className="card bg-base-200 shadow-xl">
// // // //           <div className="card-body py-4">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="text-sm font-medium text-base-content opacity-70">Ouverts</p>
// // // //                 <p className="text-2xl font-bold text-orange-600">{stats.ouvert}</p>
// // // //               </div>
// // // //               <AlertTriangle className="w-6 h-6 text-orange-500" />
// // // //             </div>
// // // //           </div>
// // // //         </div>
        
// // // //         <div className="card bg-base-200 shadow-xl">
// // // //           <div className="card-body py-4">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="text-sm font-medium text-base-content opacity-70">En cours</p>
// // // //                 <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
// // // //               </div>
// // // //               <Clock className="w-6 h-6 text-blue-500" />
// // // //             </div>
// // // //           </div>
// // // //         </div>
        
// // // //         <div className="card bg-base-200 shadow-xl">
// // // //           <div className="card-body py-4">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="text-sm font-medium text-base-content opacity-70">Résolus</p>
// // // //                 <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
// // // //               </div>
// // // //               <CheckCircle className="w-6 h-6 text-green-500" />
// // // //             </div>
// // // //           </div>
// // // //         </div>
        
// // // //         {/* Nouvelle carte pour les incidents actifs */}
// // // //         <div className="card bg-warning/10 shadow-xl">
// // // //           <div className="card-body py-4">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="text-sm font-medium text-base-content opacity-70">
// // // //                   {autoRepairMode ? '🔄 En réparation' : '⚠️ Actifs'}
// // // //                 </p>
// // // //                 <p className="text-2xl font-bold text-warning">{activeIncidents.length}</p>
// // // //                 {activeIncidents.length > 0 && (
// // // //                   <div className="text-xs mt-1 opacity-70">
// // // //                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //               <Wrench className="w-6 h-6 text-warning" />
// // // //             </div>
// // // //             {activeIncidents.length > 0 && (
// // // //               <div className="mt-2">
// // // //                 <button
// // // //                   onClick={toggleActiveOnly}
// // // //                   className="btn btn-warning btn-xs w-full mt-1"
// // // //                 >
// // // //                   {showActiveOnly ? 'Voir tous' : 'Voir actifs'}
// // // //                 </button>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Filtres et recherche */}
// // // //       <div className="card bg-base-200 shadow-xl mb-6">
// // // //         <div className="card-body">
// // // //           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text">🔍 Rechercher</span>
// // // //               </label>
// // // //               <div className="relative">
// // // //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // //                 <input
// // // //                   type="text"
// // // //                   placeholder="Description, matériel, signaleur..."
// // // //                   className="input input-bordered w-full pl-10 bg-base-100"
// // // //                   value={searchTerm}
// // // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // // //                 />
// // // //               </div>
// // // //             </div>

// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text">📊 Statut</span>
// // // //               </label>
// // // //               <select
// // // //                 className="select select-bordered w-full bg-base-100"
// // // //                 value={filterStatut}
// // // //                 onChange={(e) => setFilterStatut(e.target.value)}
// // // //               >
// // // //                 <option value="">Tous les statuts</option>
// // // //                 <option value="ouvert">Ouvert</option>
// // // //                 <option value="en_cours">En cours</option>
// // // //                 <option value="resolu">Résolu</option>
// // // //                 <option value="ferme">Fermé</option>
// // // //               </select>
// // // //             </div>

// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text">⚠️ Priorité</span>
// // // //               </label>
// // // //               <select
// // // //                 className="select select-bordered w-full bg-base-100"
// // // //                 value={filterPriorite}
// // // //                 onChange={(e) => setFilterPriorite(e.target.value)}
// // // //               >
// // // //                 <option value="">Toutes les priorités</option>
// // // //                 <option value="critique">Critique</option>
// // // //                 <option value="elevee">Élevée</option>
// // // //                 <option value="moyenne">Moyenne</option>
// // // //                 <option value="basse">Basse</option>
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
// // // //                 <option value="materiel">Matériel</option>
// // // //                 <option value="logiciel">Logiciel</option>
// // // //                 <option value="reseau">Réseau</option>
// // // //                 <option value="mixte">Mixte</option>
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

// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text">🔧 Réparation</span>
// // // //               </label>
// // // //               <div className="flex flex-col gap-2">
// // // //                 <button
// // // //                   onClick={toggleAutoRepairMode}
// // // //                   className={`btn btn-sm w-full ${autoRepairMode ? 'btn-warning' : 'btn-outline'}`}
// // // //                 >
// // // //                   {autoRepairMode ? '🔄 Auto ON' : 'Auto réparation'}
// // // //                 </button>
// // // //                 {activeIncidents.length > 0 && (
// // // //                   <button
// // // //                     onClick={markAllActiveForRepair}
// // // //                     className="btn btn-warning btn-sm w-full"
// // // //                     disabled={autoRepairMode}
// // // //                   >
// // // //                     Marquer pour réparation
// // // //                   </button>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Section des incidents actifs */}
// // // //           {activeIncidents.length > 0 && (
// // // //             <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
// // // //               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
// // // //                 <div className="flex items-center gap-3">
// // // //                   <div className="flex items-center gap-2">
// // // //                     <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
// // // //                     <span className="font-semibold text-warning">
// // // //                       ⚠️ {activeIncidents.length} incident(s) actif(s)
// // // //                     </span>
// // // //                   </div>
// // // //                   <div className="text-sm opacity-70">
// // // //                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts, 
// // // //                     {' '}{safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'en_cours').length} en cours
// // // //                   </div>
// // // //                 </div>
// // // //                 <div className="flex gap-2 flex-wrap">
// // // //                   <button
// // // //                     onClick={markAllActiveForRepair}
// // // //                     className="btn btn-warning btn-sm gap-2"
// // // //                   >
// // // //                     <CheckSquare className="h-4 w-4" />
// // // //                     Tout marquer en réparation
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={resolveLongDurationIncidents}
// // // //                     className="btn btn-outline btn-sm gap-2"
// // // //                     title="Résoudre les incidents en cours depuis plus de 7 jours"
// // // //                   >
// // // //                     <Clock className="h-4 w-4" />
// // // //                     Nettoyer anciens
// // // //                   </button>
// // // //                 </div>
// // // //               </div>
              
// // // //               {/* Liste rapide des incidents actifs pour réparation */}
// // // //               {autoRepairMode && (
// // // //                 <div className="mt-3 pt-3 border-t border-warning/20">
// // // //                   <div className="text-sm font-medium text-warning mb-2">
// // // //                     🛠️ Prêts pour réparation immédiate:
// // // //                   </div>
// // // //                   <div className="flex flex-wrap gap-2">
// // // //                     {activeIncidents.slice(0, 5).map(incident => (
// // // //                       <div 
// // // //                         key={incident.id} 
// // // //                         className="badge badge-warning badge-lg gap-1 cursor-pointer hover:badge-outline"
// // // //                         onClick={() => handleEdit(incident)}
// // // //                         title={`Cliquer pour réparer: ${incident.description}`}
// // // //                       >
// // // //                         <span>#{incident.id}</span>
// // // //                         <span className="font-bold">{getPriorityText(incident.priorite)}</span>
// // // //                       </div>
// // // //                     ))}
// // // //                     {activeIncidents.length > 5 && (
// // // //                       <div className="badge badge-ghost">
// // // //                         +{activeIncidents.length - 5} autres...
// // // //                       </div>
// // // //                     )}
// // // //                   </div>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )}

// // // //           {/* Actions de sélection */}
// // // //           {selectedIncidents.length > 0 && (
// // // //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// // // //               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
// // // //                 <div className="flex items-center gap-4">
// // // //                   <div className="flex items-center gap-2">
// // // //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// // // //                     <span className="font-semibold text-primary text-lg">
// // // //                       {selectedIncidents.length} incident(s) sélectionné(s)
// // // //                     </span>
// // // //                   </div>
// // // //                 </div>
// // // //                 <div className="flex gap-2 flex-wrap">
// // // //                   <button
// // // //                     onClick={handleEditSelected}
// // // //                     className="btn btn-primary btn-sm gap-2"
// // // //                   >
// // // //                     <Edit className="h-4 w-4" />
// // // //                     Modifier ({selectedIncidents.length})
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={handleResoudreSelected}
// // // //                     className="btn btn-success btn-sm gap-2"
// // // //                   >
// // // //                     <CheckCircle className="h-4 w-4" />
// // // //                     Résoudre ({selectedIncidents.length})
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={handleDeleteSelected}
// // // //                     className="btn btn-error btn-sm gap-2"
// // // //                   >
// // // //                     <Trash2 className="h-4 w-4" />
// // // //                     Supprimer ({selectedIncidents.length})
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={() => setSelectedIncidents([])}
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

// // // //       {/* Tableau des incidents */}
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
// // // //                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
// // // //                         disabled={filteredIncidents.length === 0}
// // // //                       >
// // // //                         {isSelectAll ? (
// // // //                           <CheckSquare className="h-5 w-5 text-primary" />
// // // //                         ) : (
// // // //                           <Square className="h-5 w-5 text-base-content/40" />
// // // //                         )}
// // // //                       </button>
// // // //                     </div>
// // // //                   </th>
// // // //                   <th className="font-bold">Description et Matériel</th>
// // // //                   <th className="font-bold">Type</th>
// // // //                   <th className="font-bold">Priorité</th>
// // // //                   <th className="font-bold">Statut</th>
// // // //                   <th className="font-bold">Signaleur</th>
// // // //                   <th className="font-bold">Date création</th>
// // // //                   <th className="font-bold text-center">Actions</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {safeArray<FormattedIncident>(filteredIncidents).map((incident) => (
// // // //                   <tr key={incident.id} className="hover">
// // // //                     <td className="text-center">
// // // //                       <div className="flex justify-center">
// // // //                         <input
// // // //                           type="checkbox"
// // // //                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
// // // //                           checked={selectedIncidents.includes(incident.id || 0)}
// // // //                           onChange={() => toggleSelectIncident(incident.id || 0)}
// // // //                         />
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div className="max-w-xs">
// // // //                         <div className="font-medium text-base-content line-clamp-2">
// // // //                           {incident.description}
// // // //                         </div>
                        
// // // //                         {/* Affichage du matériel uniquement (pas de logiciel/réseau) */}
// // // //                         {renderSource(incident)}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       <span className="text-sm font-medium capitalize">{getTypeText(incident.type_incident)}</span>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg ${(incident.statut === 'ouvert' || incident.statut === 'en_cours') ? 'badge-outline' : ''}`}>
// // // //                         {getPriorityText(incident.priorite)}
// // // //                         {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && incident.priorite === 'critique' && (
// // // //                           <span className="ml-1">🔥</span>
// // // //                         )}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div className="flex items-center gap-2">
// // // //                         {getStatusIcon(incident.statut)}
// // // //                         <div className={`badge ${getStatusBadge(incident.statut)}`}>
// // // //                           {getStatusText(incident.statut)}
// // // //                         </div>
// // // //                         {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && (
// // // //                           <span className="text-xs text-warning font-semibold">
// // // //                             🔧
// // // //                           </span>
// // // //                         )}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div 
// // // //                         className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
// // // //                         onClick={() => showSignaleurDetails(incident)}
// // // //                         title="Cliquer pour voir les détails du signaleur"
// // // //                       >
// // // //                         <User className="h-4 w-4" />
// // // //                         <div>
// // // //                           <span className="text-sm font-medium">{incident.utilisateur_nom || 'Inconnu'}</span>
// // // //                           {incident.signaleur_details && (
// // // //                             <div className="text-xs opacity-70">
// // // //                               {incident.signaleur_details.role || ''} 
// // // //                               {incident.signaleur_details.departement && ` • ${incident.signaleur_details.departement}`}
// // // //                             </div>
// // // //                           )}
// // // //                         </div>
// // // //                       </div>
// // // //                     </td>
// // // //                     <td>
// // // //                       {/* Date de création uniquement - sans date de résolution en dessous */}
// // // //                       <span className="text-sm">
// // // //                         {incident.date_creation ? formatDateTime(incident.date_creation) : '-'}
// // // //                       </span>
// // // //                     </td>
// // // //                     <td>
// // // //                       <div className="flex justify-center space-x-1">
// // // //                         <button
// // // //                           className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
// // // //                           title="Voir les détails"
// // // //                           onClick={() => showMessage('info', `Détails complets de l'incident #${incident.id}`)}
// // // //                         >
// // // //                           <Eye className="h-4 w-4" />
// // // //                         </button>
// // // //                         <button
// // // //                           onClick={() => handleEdit(incident)}
// // // //                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
// // // //                           title="Modifier"
// // // //                         >
// // // //                           <Edit className="h-4 w-4" />
// // // //                         </button>
// // // //                         {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
// // // //                           <button
// // // //                             onClick={() => handleResoudre(incident.id || 0)}
// // // //                             className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
// // // //                             title="Marquer comme résolu"
// // // //                           >
// // // //                             <CheckCircle className="h-4 w-4" />
// // // //                           </button>
// // // //                         )}
// // // //                         <button
// // // //                           onClick={() => handleDelete(incident.id || 0)}
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

// // // //           {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
// // // //             <div className="text-center py-12">
// // // //               <div className="text-base-content opacity-40 mb-4">
// // // //                 <Search className="h-16 w-16 mx-auto mb-4" />
// // // //                 <p className="text-lg font-medium">Aucun incident trouvé</p>
// // // //                 <p className="text-sm mt-2">
// // // //                   {searchTerm || filterStatut || filterPriorite || filterType || showActiveOnly
// // // //                     ? "Essayez de modifier vos critères de recherche" 
// // // //                     : "Aucun incident n'est enregistré dans le système"
// // // //                   }
// // // //                 </p>
// // // //                 <button
// // // //                   onClick={handleAddNew}
// // // //                   className="btn btn-primary btn-sm mt-4"
// // // //                 >
// // // //                   <Plus className="h-4 w-4 mr-2" />
// // // //                   Créer le premier incident
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Formulaire d'incident */}
// // // //       <IncidentForm
// // // //         isOpen={isFormOpen}
// // // //         onClose={() => {
// // // //           setIsFormOpen(false);
// // // //           setEditingIncident(undefined);
// // // //         }}
// // // //         onSubmit={handleSubmit}
// // // //         incident={editingIncident}
// // // //         currentUser={getCurrentUser()}
// // // //       />

// // // //       {/* Information sur les sources en bas de page */}
// // // //       <div className="mt-6 p-4 bg-base-200 rounded-lg">
// // // //         <div className="flex items-start gap-3">
// // // //           <div className="bg-primary/20 p-2 rounded-lg">
// // // //             <Cpu className="h-8 w-8 text-primary" />
// // // //           </div>
// // // //           <div className="flex-1">
// // // //             <h3 className="font-bold text-lg text-base-content mb-1">ℹ️ Information sur les sources</h3>
// // // //             <p className="text-base-content opacity-80">
// // // //               Seul le matériel concerné est affiché dans le tableau. 
// // // //               Les incidents peuvent également concerner des logiciels ou réseaux, 
// // // //               mais ces informations ne sont visibles que lors de l'édition d'un incident.
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Incidents;





// // // // Incidents.tsx - Version corrigée avec affichage du signaleur
// // // import React, { useState, useEffect } from 'react';
// // // import { 
// // //   Plus, 
// // //   Search, 
// // //   Eye, 
// // //   Filter, 
// // //   Download, 
// // //   Edit, 
// // //   Trash2, 
// // //   CheckSquare, 
// // //   Square, 
// // //   X, 
// // //   AlertTriangle, 
// // //   Clock, 
// // //   CheckCircle,
// // //   RefreshCw,
// // //   Wrench,
// // //   User,
// // //   UserCircle
// // // } from 'lucide-react';
// // // import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
// // // import api, { incidentsAPI, materielsAPI, logicielsAPI, reseauAPI, handleApiError } from '../services/api';
// // // import IncidentForm from '../components/IncidentForm';
// // // import { useAuth } from '../context/AuthContext';

// // // // Type pour les incidents formatés
// // // interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom' | 'logiciel_nom' | 'signaleur_details'> {
// // //   utilisateur_nom?: string;
// // //   materiel_nom?: string;
// // //   logiciel_nom?: string;
// // //   signaleur_details?: UserType;
// // // }

// // // // Fonctions helper
// // // const safeArray = <T,>(data: any): T[] => {
// // //   if (!data) return [];
// // //   if (Array.isArray(data)) return data as T[];
// // //   if (data.results && Array.isArray(data.results)) return data.results as T[];
// // //   if (data.data && Array.isArray(data.data)) return data.data as T[];
// // //   return [];
// // // };

// // // const safeFilter = <T,>(array: T[], condition: (item: T) => boolean): T[] => {
// // //   if (!Array.isArray(array)) return [];
// // //   return array.filter(condition);
// // // };

// // // const extractDataFromResponse = (response: any): any[] => {
// // //   if (!response) return [];
  
// // //   if (Array.isArray(response)) return response;
  
// // //   if (response.data !== undefined) {
// // //     if (Array.isArray(response.data)) return response.data;
    
// // //     if (response.data.results && Array.isArray(response.data.results)) {
// // //       return response.data.results;
// // //     }
    
// // //     if (response.data.data && Array.isArray(response.data.data)) {
// // //       return response.data.data;
// // //     }
    
// // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // //       return [response.data];
// // //     }
// // //   }
  
// // //   if (response.results && Array.isArray(response.results)) {
// // //     return response.results;
// // //   }
  
// // //   return [];
// // // };

// // // const Incidents: React.FC = () => {
// // //   // UTILISATEUR DEPUIS LE CONTEXTE AUTH
// // //   const { user: authUser } = useAuth();
  
// // //   const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
// // //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// // //   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
// // //   const [reseaux, setReseaux] = useState<Reseau[]>([]);
// // //   const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
// // //   const [activeIncidents, setActiveIncidents] = useState<FormattedIncident[]>([]);
// // //   const [loading, setLoading] = useState<boolean>(true);
// // //   const [error, setError] = useState<string>('');
// // //   const [searchTerm, setSearchTerm] = useState<string>('');
// // //   const [filterStatut, setFilterStatut] = useState<string>('');
// // //   const [filterPriorite, setFilterPriorite] = useState<string>('');
// // //   const [filterType, setFilterType] = useState<string>('');
// // //   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
// // //   const [isFormOpen, setIsFormOpen] = useState(false);
// // //   const [editingIncident, setEditingIncident] = useState<FormattedIncident | undefined>();
// // //   const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
// // //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
// // //   const [refreshing, setRefreshing] = useState<boolean>(false);
// // //   const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
// // //   const [autoRepairMode, setAutoRepairMode] = useState<boolean>(false);

// // //   // FONCTION POUR OBTENIR L'UTILISATEUR CONNECTÉ (DEPUIS AUTH)
// // //   const getCurrentUser = (): UserType => {
// // //     console.log('👤 Récupération utilisateur depuis Auth:', authUser);
    
// // //     if (authUser) {
// // //       return {
// // //         id: authUser.id || 0,
// // //         username: authUser.username || '',
// // //         first_name: authUser.first_name || '',
// // //         last_name: authUser.last_name || '',
// // //         email: authUser.email || '',
// // //         is_active: authUser.is_active !== false,
// // //         date_joined: authUser.date_joined || new Date().toISOString(),
// // //         role: authUser.role,
// // //         departement: authUser.departement || '',
// // //         telephone: authUser.telephone || ''
// // //       };
// // //     }
    
// // //     // Fallback si authUser n'est pas disponible
// // //     try {
// // //       const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
// // //       if (userStr) {
// // //         const user = JSON.parse(userStr);
// // //         console.log('👤 Utilisateur depuis localStorage:', user);
// // //         return {
// // //           id: user.id || 0,
// // //           username: user.username || '',
// // //           first_name: user.first_name || '',
// // //           last_name: user.last_name || '',
// // //           email: user.email || '',
// // //           is_active: user.is_active !== false,
// // //           date_joined: user.date_joined || new Date().toISOString(),
// // //           role: user.role || 'user',
// // //           departement: user.departement || '',
// // //           telephone: user.telephone || ''
// // //         };
// // //       }
// // //     } catch (e) {
// // //       console.error('Erreur parsing user:', e);
// // //     }
    
// // //     // Fallback final
// // //     console.warn('⚠️ Utilisation utilisateur par défaut');
// // //     return {
// // //       id: 0,
// // //       username: 'utilisateur',
// // //       first_name: 'Utilisateur',
// // //       last_name: 'Connecté',
// // //       email: 'user@example.com',
// // //       is_active: true,
// // //       date_joined: new Date().toISOString(),
// // //       role: 'user',
// // //       departement: ''
// // //     };
// // //   };

// // //   // Formater le nom d'utilisateur
// // //   const formatUserName = (user: any): string => {
// // //     if (!user) return 'Utilisateur inconnu';
    
// // //     if (user.first_name && user.last_name) {
// // //       return `${user.first_name} ${user.last_name}`;
// // //     }
    
// // //     if (user.username) {
// // //       return user.username;
// // //     }
    
// // //     if (user.email) {
// // //       return user.email.split('@')[0];
// // //     }
    
// // //     return `Utilisateur #${user.id || '?'}`;
// // //   };

// // //   // Charger les incidents avec les détails du signaleur
// // //   const fetchIncidents = async () => {
// // //     try {
// // //       setLoading(true);
// // //       console.log('🔄 Chargement des incidents avec détails du signaleur...');
      
// // //       const response = await incidentsAPI.getAll();
// // //       console.log('📥 Réponse incidents:', response);
      
// // //       const extractedData = extractDataFromResponse(response);
// // //       console.log(`✅ ${extractedData.length} incidents chargés`);
      
// // //       // Formater les incidents avec détails du signaleur
// // //       const formattedIncidents: FormattedIncident[] = extractedData.map((incident: any) => {
// // //         // Récupérer les détails du signaleur de différentes manières
// // //         let signaleurDetails: UserType | undefined;
        
// // //         // Essayer de récupérer les détails du signaleur depuis différentes sources
// // //         if (incident.utilisateur_signaleur_details) {
// // //           signaleurDetails = {
// // //             id: incident.utilisateur_signaleur_details.id,
// // //             username: incident.utilisateur_signaleur_details.username,
// // //             first_name: incident.utilisateur_signaleur_details.first_name,
// // //             last_name: incident.utilisateur_signaleur_details.last_name,
// // //             email: incident.utilisateur_signaleur_details.email,
// // //             role: incident.utilisateur_signaleur_details.role,
// // //             departement: incident.utilisateur_signaleur_details.departement,
// // //             is_active: incident.utilisateur_signaleur_details.is_active,
// // //             date_joined: incident.utilisateur_signaleur_details.date_joined
// // //           };
// // //         } else if (incident.user_details) {
// // //           signaleurDetails = {
// // //             id: incident.user_details.id,
// // //             username: incident.user_details.username,
// // //             first_name: incident.user_details.first_name,
// // //             last_name: incident.user_details.last_name,
// // //             email: incident.user_details.email,
// // //             role: incident.user_details.role,
// // //             departement: incident.user_details.departement,
// // //             is_active: incident.user_details.is_active,
// // //             date_joined: incident.user_details.date_joined
// // //           };
// // //         }
        
// // //         // Déterminer le nom du signaleur pour l'affichage
// // //         let utilisateurNom = 'Inconnu';
// // //         if (signaleurDetails) {
// // //           utilisateurNom = formatUserName(signaleurDetails);
// // //         } else if (incident.utilisateur_nom) {
// // //           utilisateurNom = incident.utilisateur_nom;
// // //         } else if (incident.utilisateur_signaleur) {
// // //           utilisateurNom = `Utilisateur #${incident.utilisateur_signaleur}`;
// // //         }
        
// // //         return {
// // //           id: incident.id || 0,
// // //           description: incident.description || '',
// // //           type_incident: incident.type_incident || 'materiel',
// // //           priorite: incident.priorite || 'moyenne',
// // //           statut: incident.statut || 'ouvert',
// // //           date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
// // //           date_resolution: incident.date_resolution || null,
// // //           utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
// // //           materiel: incident.materiel || null,
// // //           logiciel: incident.logiciel || null,
// // //           reseau: incident.reseau || null,
          
// // //           // Champs pour l'affichage
// // //           utilisateur_nom: utilisateurNom,
// // //           materiel_nom: incident.materiel_nom || 
// // //                       (incident.materiel_details?.nom || incident.materiel_details?.reference || 
// // //                        (incident.materiel ? `Matériel #${incident.materiel}` : '')),
// // //           logiciel_nom: incident.logiciel_nom || 
// // //                        (incident.logiciel_details?.nom || 
// // //                         (incident.logiciel ? `Logiciel #${incident.logiciel}` : '')),
          
// // //           // Détails complets du signaleur
// // //           signaleur_details: signaleurDetails
// // //         };
// // //       });
      
// // //       // Filtrer les incidents actifs
// // //       const activeOnes = safeFilter<FormattedIncident>(
// // //         formattedIncidents, 
// // //         i => i.statut === 'ouvert' || i.statut === 'en_cours'
// // //       );
// // //       setActiveIncidents(activeOnes);
      
// // //       setIncidents(formattedIncidents);
// // //       setFilteredIncidents(formattedIncidents);
// // //       setError('');
      
// // //       if (formattedIncidents.length === 0) {
// // //         showMessage('info', 'Aucun incident trouvé');
// // //       }
      
// // //     } catch (err: any) {
// // //       console.error('❌ Erreur chargement incidents:', err);
// // //       const errorMsg = handleApiError(err);
// // //       setError(errorMsg);
// // //       showMessage('error', errorMsg);
// // //     } finally {
// // //       setLoading(false);
// // //       setRefreshing(false);
// // //     }
// // //   };

// // //   // Charger les données liées
// // //   const fetchRelatedData = async () => {
// // //     try {
// // //       console.log('🔄 Chargement des données liées...');
      
// // //       const [materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
// // //         materielsAPI.getAll(),
// // //         logicielsAPI.getAll(),
// // //         reseauAPI.getAll()
// // //       ]);
      
// // //       // Traiter les matériels
// // //       let materielsData: Materiel[] = [];
// // //       if (materielsRes.status === 'fulfilled') {
// // //         materielsData = extractDataFromResponse(materielsRes.value);
// // //         console.log(`✅ ${materielsData.length} matériels chargés`);
// // //       }
      
// // //       // Traiter les logiciels
// // //       let logicielsData: Logiciel[] = [];
// // //       if (logicielsRes.status === 'fulfilled') {
// // //         logicielsData = extractDataFromResponse(logicielsRes.value);
// // //         console.log(`✅ ${logicielsData.length} logiciels chargés`);
// // //       }
      
// // //       // Traiter les réseaux
// // //       let reseauxData: Reseau[] = [];
// // //       if (reseauxRes.status === 'fulfilled') {
// // //         reseauxData = extractDataFromResponse(reseauxRes.value);
// // //         console.log(`✅ ${reseauxData.length} réseaux chargés`);
// // //       }
      
// // //       setMateriels(materielsData);
// // //       setLogiciels(logicielsData);
// // //       setReseaux(reseauxData);
      
// // //     } catch (err: any) {
// // //       console.error('❌ Erreur chargement données liées:', err);
// // //     }
// // //   };

// // //   // Effet pour charger les données initiales
// // //   useEffect(() => {
// // //     const loadInitialData = async () => {
// // //       await fetchIncidents();
// // //       await fetchRelatedData();
// // //     };
    
// // //     loadInitialData();
// // //   }, []);

// // //   // Effet pour filtrer les incidents
// // //   useEffect(() => {
// // //     filterIncidents();
// // //   }, [incidents, searchTerm, filterStatut, filterPriorite, filterType, showActiveOnly]);

// // //   // Effet pour la sélection "Tout sélectionner"
// // //   useEffect(() => {
// // //     if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
// // //       setIsSelectAll(true);
// // //     } else {
// // //       setIsSelectAll(false);
// // //     }
// // //   }, [selectedIncidents, filteredIncidents]);

// // //   // Filtrer les incidents
// // //   const filterIncidents = () => {
// // //     let filtered = showActiveOnly ? activeIncidents : safeArray<FormattedIncident>(incidents);

// // //     if (searchTerm) {
// // //       const searchLower = searchTerm.toLowerCase();
// // //       filtered = safeFilter<FormattedIncident>(filtered, incident => 
// // //         (incident.description?.toLowerCase() || '').includes(searchLower) ||
// // //         (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
// // //         (incident.logiciel_nom?.toLowerCase() || '').includes(searchLower) ||
// // //         (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
// // //       );
// // //     }

// // //     if (filterStatut) {
// // //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
// // //     }

// // //     if (filterPriorite) {
// // //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
// // //     }

// // //     if (filterType) {
// // //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
// // //     }

// // //     setFilteredIncidents(filtered);
// // //     setSelectedIncidents([]);
// // //   };

// // //   // Afficher un message
// // //   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
// // //     setMessage({ type, text });
// // //     setTimeout(() => setMessage(null), 5000);
// // //   };

// // //   // Gérer la soumission du formulaire
// // //   const handleSubmit = async (incidentData: any) => {
// // //     try {
// // //       console.log('📤 Soumission incident:', incidentData);
      
// // //       // Obtenir l'utilisateur connecté comme signaleur
// // //       const currentUser = getCurrentUser();
// // //       console.log('👤 Utilisateur connecté (signaleur):', currentUser);
      
// // //       const formattedData: any = {
// // //         description: incidentData.description,
// // //         type_incident: incidentData.type_incident,
// // //         priorite: incidentData.priorite,
// // //         statut: incidentData.statut || 'ouvert', // Par défaut "ouvert"
// // //         utilisateur_signaleur: currentUser.id // ← UTILISATEUR CONNECTÉ COMME SIGNALEUR
// // //       };
      
// // //       console.log('📤 Signaleur ID envoyé à l\'API:', currentUser.id);
      
// // //       // Utiliser la date de création si fournie, sinon utiliser maintenant
// // //       if (incidentData.date_creation) {
// // //         formattedData.date_creation = incidentData.date_creation;
// // //       } else if (editingIncident && editingIncident.date_creation) {
// // //         formattedData.date_creation = editingIncident.date_creation;
// // //       }
      
// // //       if (incidentData.date_resolution) {
// // //         formattedData.date_resolution = incidentData.date_resolution;
// // //       }
      
// // //       // Ajouter les relations seulement si elles sont définies
// // //       if (incidentData.materiel && incidentData.materiel > 0) {
// // //         formattedData.materiel = incidentData.materiel;
// // //       }
// // //       if (incidentData.logiciel && incidentData.logiciel > 0) {
// // //         formattedData.logiciel = incidentData.logiciel;
// // //       }
// // //       if (incidentData.reseau && incidentData.reseau > 0) {
// // //         formattedData.reseau = incidentData.reseau;
// // //       }
      
// // //       console.log('📤 Données envoyées à l\'API:', formattedData);
      
// // //       if (editingIncident && editingIncident.id) {
// // //         await incidentsAPI.update(editingIncident.id, formattedData);
// // //         showMessage('success', 'Incident modifié avec succès');
// // //       } else {
// // //         await incidentsAPI.create(formattedData);
// // //         showMessage('success', 'Incident créé avec succès');
// // //       }
      
// // //       await fetchIncidents();
// // //       setIsFormOpen(false);
// // //       setEditingIncident(undefined);
      
// // //     } catch (error: any) {
// // //       console.error('❌ Erreur soumission incident:', error);
// // //       const errorMsg = handleApiError(error);
// // //       showMessage('error', errorMsg);
// // //     }
// // //   };

// // //   // Gérer la sélection d'un incident
// // //   const toggleSelectIncident = (id: number) => {
// // //     setSelectedIncidents(prev => 
// // //       prev.includes(id) 
// // //         ? prev.filter(item => item !== id)
// // //         : [...prev, id]
// // //     );
// // //   };

// // //   // Gérer la sélection de tous les incidents
// // //   const toggleSelectAll = () => {
// // //     if (isSelectAll) {
// // //       setSelectedIncidents([]);
// // //     } else {
// // //       const allIds = filteredIncidents
// // //         .map(i => i.id)
// // //         .filter((id): id is number => id !== undefined);
// // //       setSelectedIncidents(allIds);
// // //     }
// // //   };

// // //   // Supprimer les incidents sélectionnés
// // //   const handleDeleteSelected = async () => {
// // //     if (selectedIncidents.length === 0) {
// // //       showMessage('error', 'Aucun incident sélectionné');
// // //       return;
// // //     }

// // //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIncidents.length} incident(s) ?`)) {
// // //       try {
// // //         const deletePromises = selectedIncidents.map(id => 
// // //           incidentsAPI.delete(id).catch(err => {
// // //             console.error(`Erreur suppression incident ${id}:`, err);
// // //             return null;
// // //           })
// // //         );
        
// // //         await Promise.all(deletePromises);
        
// // //         showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
// // //         setSelectedIncidents([]);
// // //         await fetchIncidents();
// // //       } catch (error: any) {
// // //         console.error('❌ Erreur suppression incidents:', error);
// // //         showMessage('error', handleApiError(error));
// // //       }
// // //     }
// // //   };

// // //   // Éditer les incidents sélectionnés
// // //   const handleEditSelected = () => {
// // //     if (selectedIncidents.length === 0) {
// // //       showMessage('error', 'Aucun incident sélectionné');
// // //       return;
// // //     }

// // //     if (selectedIncidents.length === 1) {
// // //       const incident = incidents.find(i => i.id === selectedIncidents[0]);
// // //       if (incident) {
// // //         handleEdit(incident);
// // //       }
// // //     } else {
// // //       showMessage('info', `Édition multiple de ${selectedIncidents.length} incidents`);
// // //     }
// // //   };

// // //   // Résoudre les incidents sélectionnés
// // //   const handleResoudreSelected = async () => {
// // //     if (selectedIncidents.length === 0) {
// // //       showMessage('error', 'Aucun incident sélectionné');
// // //       return;
// // //     }

// // //     try {
// // //       const resolvePromises = selectedIncidents.map(id => 
// // //         incidentsAPI.resoudre(id).catch(err => {
// // //           console.error(`Erreur résolution incident ${id}:`, err);
// // //           return null;
// // //         })
// // //       );
      
// // //       await Promise.all(resolvePromises);
      
// // //       showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
// // //       setSelectedIncidents([]);
// // //       await fetchIncidents();
// // //     } catch (error: any) {
// // //       console.error('❌ Erreur résolution incidents:', error);
// // //       showMessage('error', handleApiError(error));
// // //     }
// // //   };

// // //   // Éditer un incident
// // //   const handleEdit = (incident: FormattedIncident) => {
// // //     console.log('✏️ Édition incident:', incident);
// // //     setEditingIncident(incident);
// // //     setIsFormOpen(true);
// // //   };

// // //   // Supprimer un incident
// // //   const handleDelete = async (id: number) => {
// // //     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
// // //       try {
// // //         await incidentsAPI.delete(id);
// // //         showMessage('success', 'Incident supprimé avec succès');
// // //         await fetchIncidents();
// // //       } catch (error: any) {
// // //         console.error('❌ Erreur suppression incident:', error);
// // //         showMessage('error', handleApiError(error));
// // //       }
// // //     }
// // //   };

// // //   // Résoudre un incident
// // //   const handleResoudre = async (id: number) => {
// // //     try {
// // //       await incidentsAPI.resoudre(id);
// // //       showMessage('success', 'Incident marqué comme résolu');
// // //       await fetchIncidents();
// // //     } catch (error: any) {
// // //       console.error('❌ Erreur résolution incident:', error);
// // //       showMessage('error', handleApiError(error));
// // //     }
// // //   };

// // //   // Ajouter un nouvel incident
// // //   const handleAddNew = () => {
// // //     setEditingIncident(undefined);
// // //     setIsFormOpen(true);
// // //   };

// // //   // Rafraîchir les données
// // //   const handleRefresh = async () => {
// // //     setRefreshing(true);
// // //     await fetchIncidents();
// // //     showMessage('success', 'Données rafraîchies');
// // //   };

// // //   // Fonction pour exporter les incidents
// // //   const handleExport = () => {
// // //     try {
// // //       const dataToExport = filteredIncidents.map(i => ({
// // //         ID: i.id,
// // //         Description: i.description,
// // //         Type: getTypeText(i.type_incident),
// // //         Priorité: getPriorityText(i.priorite),
// // //         Statut: getStatusText(i.statut),
// // //         'Matériel concerné': i.materiel_nom || 'Non spécifié',
// // //         'Logiciel concerné': i.logiciel_nom || 'Non spécifié',
// // //         'Signaleur': i.utilisateur_nom || 'Non spécifié',
// // //         'Date création': i.date_creation ? new Date(i.date_creation).toLocaleDateString('fr-FR') : 'Non spécifiée',
// // //         'Date résolution': i.date_resolution ? new Date(i.date_resolution).toLocaleDateString('fr-FR') : 'Non résolu'
// // //       }));

// // //       // Vérifier qu'il y a des données à exporter
// // //       if (dataToExport.length === 0) {
// // //         showMessage('error', 'Aucune donnée à exporter');
// // //         return;
// // //       }

// // //       const csvContent = [
// // //         Object.keys(dataToExport[0] || {}).join(','),
// // //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// // //       ].join('\n');

// // //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// // //       const link = document.createElement('a');
// // //       const url = URL.createObjectURL(blob);
// // //       link.setAttribute('href', url);
// // //       link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
// // //       link.style.visibility = 'hidden';
// // //       document.body.appendChild(link);
// // //       link.click();
// // //       document.body.removeChild(link);

// // //       showMessage('success', 'Export CSV réussi !');
// // //     } catch (error) {
// // //       console.error('❌ Erreur export:', error);
// // //       showMessage('error', 'Erreur lors de l\'export');
// // //     }
// // //   };

// // //   // Réinitialiser les filtres
// // //   const resetFilters = () => {
// // //     setSearchTerm('');
// // //     setFilterStatut('');
// // //     setFilterPriorite('');
// // //     setFilterType('');
// // //     setSelectedIncidents([]);
// // //     setShowActiveOnly(false);
// // //   };

// // //   // Basculer l'affichage des actifs seulement
// // //   const toggleActiveOnly = () => {
// // //     setShowActiveOnly(!showActiveOnly);
// // //   };

// // //   // Basculer le mode auto-réparation
// // //   const toggleAutoRepairMode = () => {
// // //     setAutoRepairMode(!autoRepairMode);
// // //   };

// // //   // Marquer tous les actifs pour réparation
// // //   const markAllActiveForRepair = () => {
// // //     if (activeIncidents.length === 0) {
// // //       showMessage('info', 'Aucun incident actif à marquer');
// // //       return;
// // //     }
    
// // //     // Sélectionner tous les incidents actifs
// // //     const activeIds = activeIncidents
// // //       .map(i => i.id)
// // //       .filter((id): id is number => id !== undefined);
    
// // //     setSelectedIncidents(activeIds);
// // //     showMessage('info', `${activeIncidents.length} incidents actifs sélectionnés pour réparation`);
// // //   };

// // //   // Résoudre les incidents de longue durée
// // //   const resolveLongDurationIncidents = async () => {
// // //     try {
// // //       // Filtrer les incidents en cours depuis plus de 7 jours
// // //       const sevenDaysAgo = new Date();
// // //       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
// // //       const oldActiveIncidents = activeIncidents.filter(incident => {
// // //         const creationDate = new Date(incident.date_creation || '');
// // //         return creationDate < sevenDaysAgo;
// // //       });
      
// // //       if (oldActiveIncidents.length === 0) {
// // //         showMessage('info', 'Aucun incident ancien à résoudre');
// // //         return;
// // //       }
      
// // //       const resolvePromises = oldActiveIncidents.map(incident => 
// // //         incidentsAPI.resoudre(incident.id || 0).catch(err => {
// // //           console.error(`Erreur résolution incident ${incident.id}:`, err);
// // //           return null;
// // //         })
// // //       );
      
// // //       await Promise.all(resolvePromises);
      
// // //       showMessage('success', `${oldActiveIncidents.length} incidents anciens résolus`);
// // //       await fetchIncidents();
// // //     } catch (error: any) {
// // //       console.error('❌ Erreur résolution incidents anciens:', error);
// // //       showMessage('error', handleApiError(error));
// // //     }
// // //   };

// // //   // Fonctions utilitaires pour l'affichage
// // //   const getPriorityBadge = (priority: string) => {
// // //     const badges: Record<string, string> = {
// // //       critique: 'badge-error',
// // //       elevee: 'badge-warning',
// // //       moyenne: 'badge-info',
// // //       basse: 'badge-success'
// // //     };
// // //     return badges[priority] || 'badge-neutral';
// // //   };

// // //   const getPriorityText = (priority: string) => {
// // //     const texts: Record<string, string> = {
// // //       critique: 'Critique',
// // //       elevee: 'Élevée',
// // //       moyenne: 'Moyenne',
// // //       basse: 'Basse'
// // //     };
// // //     return texts[priority] || priority;
// // //   };

// // //   const getStatusBadge = (status: string) => {
// // //     const badges: Record<string, string> = {
// // //       ouvert: 'badge-warning',
// // //       en_cours: 'badge-info',
// // //       resolu: 'badge-success',
// // //       ferme: 'badge-neutral'
// // //     };
// // //     return badges[status] || 'badge-neutral';
// // //   };

// // //   const getStatusText = (status: string) => {
// // //     const texts: Record<string, string> = {
// // //       ouvert: 'Ouvert',
// // //       en_cours: 'En cours',
// // //       resolu: 'Résolu',
// // //       ferme: 'Fermé'
// // //     };
// // //     return texts[status] || status;
// // //   };

// // //   const getTypeText = (type: string) => {
// // //     const texts: Record<string, string> = {
// // //       materiel: 'Matériel',
// // //       logiciel: 'Logiciel',
// // //       reseau: 'Réseau',
// // //       mixte: 'Mixte'
// // //     };
// // //     return texts[type] || type;
// // //   };

// // //   // Obtenir l'icône de statut
// // //   const getStatusIcon = (status: string) => {
// // //     switch (status) {
// // //       case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
// // //       case 'en_cours': return <Clock className="w-4 h-4" />;
// // //       case 'resolu': return <CheckCircle className="w-4 h-4" />;
// // //       case 'ferme': return <CheckCircle className="w-4 h-4" />;
// // //       default: return <AlertTriangle className="w-4 h-4" />;
// // //     }
// // //   };

// // //   // Afficher les détails du signaleur dans une modal
// // //   const showSignaleurDetails = (incident: FormattedIncident) => {
// // //     const signaleur = incident.signaleur_details;
// // //     const currentUser = getCurrentUser();
    
// // //     let message = `Incident #${incident.id}\n`;
// // //     message += `Signaleur: ${incident.utilisateur_nom || 'Inconnu'}\n\n`;
    
// // //     if (signaleur) {
// // //       message += `Détails du signaleur:\n`;
// // //       message += `- Nom: ${signaleur.first_name || ''} ${signaleur.last_name || ''}\n`;
// // //       message += `- Email: ${signaleur.email || 'Non spécifié'}\n`;
// // //       message += `- Rôle: ${signaleur.role || 'Non spécifié'}\n`;
// // //       message += `- Département: ${signaleur.departement || 'Non spécifié'}\n`;
// // //     } else {
// // //       message += `Aucun détail supplémentaire disponible pour le signaleur.\n`;
// // //     }
    
// // //     message += `\n---\n`;
// // //     message += `Utilisateur connecté actuel: ${currentUser.first_name} ${currentUser.last_name} (${currentUser.email})`;
    
// // //     showMessage('info', `Détails du signaleur pour l'incident #${incident.id}`);
    
// // //     // Afficher également dans la console pour le débogage
// // //     console.log('👤 Détails signaleur:', {
// // //       incidentId: incident.id,
// // //       signaleurId: incident.utilisateur_signaleur,
// // //       signaleurNom: incident.utilisateur_nom,
// // //       signaleurDetails: signaleur,
// // //       currentUser: currentUser
// // //     });
// // //   };

// // //   // Statistiques
// // //   const stats = {
// // //     total: safeArray<FormattedIncident>(incidents).length,
// // //     ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
// // //     en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
// // //     resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu').length,
// // //     actifs: activeIncidents.length
// // //   };

// // //   if (loading && !refreshing) {
// // //     return (
// // //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// // //         <div className="flex flex-col items-center gap-4">
// // //           <span className="loading loading-spinner loading-lg text-primary"></span>
// // //           <p className="text-base-content">Chargement des incidents...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-6 bg-base-100 min-h-screen">
// // //       {/* Message de notification */}
// // //       {message && (
// // //         <div className={`alert ${
// // //           message.type === 'success' ? 'alert-success' : 
// // //           message.type === 'error' ? 'alert-error' : 
// // //           'alert-info'
// // //         } mb-4 shadow-lg`}>
// // //           <span>{message.text}</span>
// // //         </div>
// // //       )}

// // //       {error && (
// // //         <div className="alert alert-error mb-4 shadow-lg">
// // //           <AlertTriangle className="h-5 w-5" />
// // //           <span>{error}</span>
// // //           <button 
// // //             className="btn btn-sm btn-ghost"
// // //             onClick={handleRefresh}
// // //           >
// // //             <RefreshCw className="h-4 w-4" />
// // //             Réessayer
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* En-tête */}
// // //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
// // //         <div>
// // //           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
// // //           <p className="text-base-content opacity-60 mt-1">
// // //             Suivi et résolution des incidents techniques ({safeArray<FormattedIncident>(filteredIncidents).length} incidents)
// // //             {selectedIncidents.length > 0 && (
// // //               <span className="text-primary font-semibold ml-2">
// // //                 ({selectedIncidents.length} sélectionné(s))
// // //               </span>
// // //             )}
// // //             {showActiveOnly && (
// // //               <span className="text-warning font-semibold ml-2">
// // //                 🔧 Affichage actifs seulement
// // //               </span>
// // //             )}
// // //           </p>
// // //         </div>
// // //         <div className="flex gap-2 flex-wrap">
// // //           <button
// // //             onClick={handleRefresh}
// // //             className="btn btn-outline btn-sm"
// // //             title="Rafraîchir"
// // //             disabled={refreshing}
// // //           >
// // //             <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
// // //             {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
// // //           </button>
// // //           <button
// // //             onClick={handleExport}
// // //             className="btn btn-outline btn-sm"
// // //             title="Exporter la liste"
// // //             disabled={filteredIncidents.length === 0}
// // //           >
// // //             <Download className="h-4 w-4 mr-2" />
// // //             Exporter
// // //           </button>
// // //           <button
// // //             onClick={handleAddNew}
// // //             className="btn btn-primary btn-sm"
// // //           >
// // //             <Plus className="h-4 w-4 mr-2" />
// // //             Nouvel incident
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Informations sur l'utilisateur connecté */}
// // //       <div className="mb-6 p-4 bg-info/10 rounded-lg border border-info/20">
// // //         <div className="flex items-center justify-between">
// // //           <div className="flex items-center gap-3">
// // //             <UserCircle className="h-6 w-6 text-info" />
// // //             <div>
// // //               <p className="font-medium text-info">👤 Utilisateur connecté</p>
// // //               <p className="text-sm">
// // //                 {getCurrentUser().first_name} {getCurrentUser().last_name} 
// // //                 <span className="opacity-70 ml-2">({getCurrentUser().email})</span>
// // //               </p>
// // //               <p className="text-xs opacity-70">
// // //                 Vous serez automatiquement désigné comme signaleur pour les nouveaux incidents
// // //               </p>
// // //             </div>
// // //           </div>
// // //           <div className="badge badge-info badge-lg">
// // //             Signaleur par défaut
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Statistiques */}
// // //       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
// // //         <div className="card bg-base-200 shadow-xl">
// // //           <div className="card-body py-4">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
// // //                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
// // //               </div>
// // //               <div className="text-2xl">📊</div>
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         <div className="card bg-base-200 shadow-xl">
// // //           <div className="card-body py-4">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-base-content opacity-70">Ouverts</p>
// // //                 <p className="text-2xl font-bold text-orange-600">{stats.ouvert}</p>
// // //               </div>
// // //               <AlertTriangle className="w-6 h-6 text-orange-500" />
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         <div className="card bg-base-200 shadow-xl">
// // //           <div className="card-body py-4">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-base-content opacity-70">En cours</p>
// // //                 <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
// // //               </div>
// // //               <Clock className="w-6 h-6 text-blue-500" />
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         <div className="card bg-base-200 shadow-xl">
// // //           <div className="card-body py-4">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-base-content opacity-70">Résolus</p>
// // //                 <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
// // //               </div>
// // //               <CheckCircle className="w-6 h-6 text-green-500" />
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         {/* Nouvelle carte pour les incidents actifs */}
// // //         <div className="card bg-warning/10 shadow-xl">
// // //           <div className="card-body py-4">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-base-content opacity-70">
// // //                   {autoRepairMode ? '🔄 En réparation' : '⚠️ Actifs'}
// // //                 </p>
// // //                 <p className="text-2xl font-bold text-warning">{activeIncidents.length}</p>
// // //                 {activeIncidents.length > 0 && (
// // //                   <div className="text-xs mt-1 opacity-70">
// // //                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts
// // //                   </div>
// // //                 )}
// // //               </div>
// // //               <Wrench className="w-6 h-6 text-warning" />
// // //             </div>
// // //             {activeIncidents.length > 0 && (
// // //               <div className="mt-2">
// // //                 <button
// // //                   onClick={toggleActiveOnly}
// // //                   className="btn btn-warning btn-xs w-full mt-1"
// // //                 >
// // //                   {showActiveOnly ? 'Voir tous' : 'Voir actifs'}
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Filtres et recherche */}
// // //       <div className="card bg-base-200 shadow-xl mb-6">
// // //         <div className="card-body">
// // //           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">🔍 Rechercher</span>
// // //               </label>
// // //               <div className="relative">
// // //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // //                 <input
// // //                   type="text"
// // //                   placeholder="Description, matériel, signaleur..."
// // //                   className="input input-bordered w-full pl-10 bg-base-100"
// // //                   value={searchTerm}
// // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">📊 Statut</span>
// // //               </label>
// // //               <select
// // //                 className="select select-bordered w-full bg-base-100"
// // //                 value={filterStatut}
// // //                 onChange={(e) => setFilterStatut(e.target.value)}
// // //               >
// // //                 <option value="">Tous les statuts</option>
// // //                 <option value="ouvert">Ouvert</option>
// // //                 <option value="en_cours">En cours</option>
// // //                 <option value="resolu">Résolu</option>
// // //                 <option value="ferme">Fermé</option>
// // //               </select>
// // //             </div>

// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">⚠️ Priorité</span>
// // //               </label>
// // //               <select
// // //                 className="select select-bordered w-full bg-base-100"
// // //                 value={filterPriorite}
// // //                 onChange={(e) => setFilterPriorite(e.target.value)}
// // //               >
// // //                 <option value="">Toutes les priorités</option>
// // //                 <option value="critique">Critique</option>
// // //                 <option value="elevee">Élevée</option>
// // //                 <option value="moyenne">Moyenne</option>
// // //                 <option value="basse">Basse</option>
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
// // //                 <option value="materiel">Matériel</option>
// // //                 <option value="logiciel">Logiciel</option>
// // //                 <option value="reseau">Réseau</option>
// // //                 <option value="mixte">Mixte</option>
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

// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">🔧 Réparation</span>
// // //               </label>
// // //               <div className="flex flex-col gap-2">
// // //                 <button
// // //                   onClick={toggleAutoRepairMode}
// // //                   className={`btn btn-sm w-full ${autoRepairMode ? 'btn-warning' : 'btn-outline'}`}
// // //                 >
// // //                   {autoRepairMode ? '🔄 Auto ON' : 'Auto réparation'}
// // //                 </button>
// // //                 {activeIncidents.length > 0 && (
// // //                   <button
// // //                     onClick={markAllActiveForRepair}
// // //                     className="btn btn-warning btn-sm w-full"
// // //                     disabled={autoRepairMode}
// // //                   >
// // //                     Marquer pour réparation
// // //                   </button>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Section des incidents actifs */}
// // //           {activeIncidents.length > 0 && (
// // //             <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
// // //               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
// // //                 <div className="flex items-center gap-3">
// // //                   <div className="flex items-center gap-2">
// // //                     <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
// // //                     <span className="font-semibold text-warning">
// // //                       ⚠️ {activeIncidents.length} incident(s) actif(s)
// // //                     </span>
// // //                   </div>
// // //                   <div className="text-sm opacity-70">
// // //                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts, 
// // //                     {' '}{safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'en_cours').length} en cours
// // //                   </div>
// // //                 </div>
// // //                 <div className="flex gap-2 flex-wrap">
// // //                   <button
// // //                     onClick={markAllActiveForRepair}
// // //                     className="btn btn-warning btn-sm gap-2"
// // //                   >
// // //                     <CheckSquare className="h-4 w-4" />
// // //                     Tout marquer en réparation
// // //                   </button>
// // //                   <button
// // //                     onClick={resolveLongDurationIncidents}
// // //                     className="btn btn-outline btn-sm gap-2"
// // //                     title="Résoudre les incidents en cours depuis plus de 7 jours"
// // //                   >
// // //                     <Clock className="h-4 w-4" />
// // //                     Nettoyer anciens
// // //                   </button>
// // //                 </div>
// // //               </div>
              
// // //               {/* Liste rapide des incidents actifs pour réparation */}
// // //               {autoRepairMode && (
// // //                 <div className="mt-3 pt-3 border-t border-warning/20">
// // //                   <div className="text-sm font-medium text-warning mb-2">
// // //                     🛠️ Prêts pour réparation immédiate:
// // //                   </div>
// // //                   <div className="flex flex-wrap gap-2">
// // //                     {activeIncidents.slice(0, 5).map(incident => (
// // //                       <div 
// // //                         key={incident.id} 
// // //                         className="badge badge-warning badge-lg gap-1 cursor-pointer hover:badge-outline"
// // //                         onClick={() => handleEdit(incident)}
// // //                         title={`Cliquer pour réparer: ${incident.description}`}
// // //                       >
// // //                         <span>#{incident.id}</span>
// // //                         <span className="font-bold">{getPriorityText(incident.priorite)}</span>
// // //                       </div>
// // //                     ))}
// // //                     {activeIncidents.length > 5 && (
// // //                       <div className="badge badge-ghost">
// // //                         +{activeIncidents.length - 5} autres...
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* Actions de sélection */}
// // //           {selectedIncidents.length > 0 && (
// // //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// // //               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
// // //                 <div className="flex items-center gap-4">
// // //                   <div className="flex items-center gap-2">
// // //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// // //                     <span className="font-semibold text-primary text-lg">
// // //                       {selectedIncidents.length} incident(s) sélectionné(s)
// // //                     </span>
// // //                   </div>
// // //                 </div>
// // //                 <div className="flex gap-2 flex-wrap">
// // //                   <button
// // //                     onClick={handleEditSelected}
// // //                     className="btn btn-primary btn-sm gap-2"
// // //                   >
// // //                     <Edit className="h-4 w-4" />
// // //                     Modifier ({selectedIncidents.length})
// // //                   </button>
// // //                   <button
// // //                     onClick={handleResoudreSelected}
// // //                     className="btn btn-success btn-sm gap-2"
// // //                   >
// // //                     <CheckCircle className="h-4 w-4" />
// // //                     Résoudre ({selectedIncidents.length})
// // //                   </button>
// // //                   <button
// // //                     onClick={handleDeleteSelected}
// // //                     className="btn btn-error btn-sm gap-2"
// // //                   >
// // //                     <Trash2 className="h-4 w-4" />
// // //                     Supprimer ({selectedIncidents.length})
// // //                   </button>
// // //                   <button
// // //                     onClick={() => setSelectedIncidents([])}
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

// // //       {/* Tableau des incidents */}
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
// // //                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
// // //                         disabled={filteredIncidents.length === 0}
// // //                       >
// // //                         {isSelectAll ? (
// // //                           <CheckSquare className="h-5 w-5 text-primary" />
// // //                         ) : (
// // //                           <Square className="h-5 w-5 text-base-content/40" />
// // //                         )}
// // //                       </button>
// // //                     </div>
// // //                   </th>
// // //                   <th className="font-bold">Description</th>
// // //                   <th className="font-bold">Type</th>
// // //                   <th className="font-bold">Priorité</th>
// // //                   <th className="font-bold">Statut</th>
// // //                   <th className="font-bold">Signaleur</th>
// // //                   <th className="font-bold">Date création</th>
// // //                   <th className="font-bold text-center">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {safeArray<FormattedIncident>(filteredIncidents).map((incident) => (
// // //                   <tr key={incident.id} className="hover">
// // //                     <td className="text-center">
// // //                       <div className="flex justify-center">
// // //                         <input
// // //                           type="checkbox"
// // //                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
// // //                           checked={selectedIncidents.includes(incident.id || 0)}
// // //                           onChange={() => toggleSelectIncident(incident.id || 0)}
// // //                         />
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <div className="max-w-xs">
// // //                         <div className="font-medium text-base-content line-clamp-2">
// // //                           {incident.description}
// // //                         </div>
// // //                         {incident.materiel_nom && (
// // //                           <div className="text-sm text-base-content opacity-70 mt-1">
// // //                             📦 {incident.materiel_nom}
// // //                           </div>
// // //                         )}
// // //                         {incident.logiciel_nom && (
// // //                           <div className="text-sm text-base-content opacity-70">
// // //                             💻 {incident.logiciel_nom}
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <span className="text-sm font-medium capitalize">{getTypeText(incident.type_incident)}</span>
// // //                     </td>
// // //                     <td>
// // //                       <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg ${(incident.statut === 'ouvert' || incident.statut === 'en_cours') ? 'badge-outline' : ''}`}>
// // //                         {getPriorityText(incident.priorite)}
// // //                         {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && incident.priorite === 'critique' && (
// // //                           <span className="ml-1">🔥</span>
// // //                         )}
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <div className="flex items-center gap-2">
// // //                         {getStatusIcon(incident.statut)}
// // //                         <div className={`badge ${getStatusBadge(incident.statut)}`}>
// // //                           {getStatusText(incident.statut)}
// // //                         </div>
// // //                         {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && (
// // //                           <span className="text-xs text-warning font-semibold">
// // //                             🔧
// // //                           </span>
// // //                         )}
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <div 
// // //                         className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
// // //                         onClick={() => showSignaleurDetails(incident)}
// // //                         title="Cliquer pour voir les détails du signaleur"
// // //                       >
// // //                         <User className="h-4 w-4" />
// // //                         <div>
// // //                           <span className="text-sm font-medium">{incident.utilisateur_nom || 'Inconnu'}</span>
// // //                           {incident.signaleur_details && (
// // //                             <div className="text-xs opacity-70">
// // //                               {incident.signaleur_details.role || ''} 
// // //                               {incident.signaleur_details.departement && ` • ${incident.signaleur_details.departement}`}
// // //                             </div>
// // //                           )}
// // //                         </div>
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       <span className="text-sm">
// // //                         {incident.date_creation ? new Date(incident.date_creation).toLocaleDateString('fr-FR') : '-'}
// // //                       </span>
// // //                       {incident.date_resolution && (
// // //                         <div className="text-xs text-success">
// // //                           Résolu le: {new Date(incident.date_resolution).toLocaleDateString('fr-FR')}
// // //                         </div>
// // //                       )}
// // //                     </td>
// // //                     <td>
// // //                       <div className="flex justify-center space-x-1">
// // //                         <button
// // //                           className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
// // //                           title="Voir les détails du signaleur"
// // //                           onClick={() => showSignaleurDetails(incident)}
// // //                         >
// // //                           <Eye className="h-4 w-4" />
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleEdit(incident)}
// // //                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
// // //                           title="Modifier"
// // //                         >
// // //                           <Edit className="h-4 w-4" />
// // //                         </button>
// // //                         {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
// // //                           <button
// // //                             onClick={() => handleResoudre(incident.id || 0)}
// // //                             className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
// // //                             title="Marquer comme résolu"
// // //                           >
// // //                             <CheckCircle className="h-4 w-4" />
// // //                           </button>
// // //                         )}
// // //                         <button
// // //                           onClick={() => handleDelete(incident.id || 0)}
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

// // //           {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
// // //             <div className="text-center py-12">
// // //               <div className="text-base-content opacity-40 mb-4">
// // //                 <Search className="h-16 w-16 mx-auto mb-4" />
// // //                 <p className="text-lg font-medium">Aucun incident trouvé</p>
// // //                 <p className="text-sm mt-2">
// // //                   {searchTerm || filterStatut || filterPriorite || filterType || showActiveOnly
// // //                     ? "Essayez de modifier vos critères de recherche" 
// // //                     : "Aucun incident n'est enregistré dans le système"
// // //                   }
// // //                 </p>
// // //                 <button
// // //                   onClick={handleAddNew}
// // //                   className="btn btn-primary btn-sm mt-4"
// // //                 >
// // //                   <Plus className="h-4 w-4 mr-2" />
// // //                   Créer le premier incident
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Formulaire d'incident */}
// // //       <IncidentForm
// // //         isOpen={isFormOpen}
// // //         onClose={() => {
// // //           setIsFormOpen(false);
// // //           setEditingIncident(undefined);
// // //         }}
// // //         onSubmit={handleSubmit}
// // //         incident={editingIncident}
// // //         currentUser={getCurrentUser()} // ← UTILISATEUR DEPUIS AUTH/CONTEXTE
// // //       />

// // //       {/* Information sur le signaleur en bas de page */}
// // //       <div className="mt-6 p-4 bg-base-200 rounded-lg">
// // //         <div className="flex items-start gap-3">
// // //           <div className="bg-primary/20 p-2 rounded-lg">
// // //             <UserCircle className="h-8 w-8 text-primary" />
// // //           </div>
// // //           <div className="flex-1">
// // //             <h3 className="font-bold text-lg text-base-content mb-1">ℹ️ Information sur le signaleur</h3>
// // //             <p className="text-base-content opacity-80">
// // //               <strong>L'utilisateur connecté est automatiquement désigné comme signaleur</strong> pour tous les nouveaux incidents créés.
// // //               Cette information est enregistrée avec l'incident et apparaît dans la colonne "Signaleur" du tableau.
// // //             </p>
// // //             <div className="mt-2 p-3 bg-base-300 rounded">
// // //               <p className="text-sm">
// // //                 <strong>Utilisateur actuel:</strong> {getCurrentUser().first_name} {getCurrentUser().last_name} 
// // //                 <span className="opacity-70 ml-2">({getCurrentUser().email})</span>
// // //               </p>
// // //               <p className="text-xs opacity-70 mt-1">
// // //                 Pour modifier le signaleur d'un incident existant, éditez l'incident concerné.
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Incidents;




// // // Incidents.tsx - Version complète corrigée
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Plus, 
// //   Search, 
// //   Eye, 
// //   Filter, 
// //   Download, 
// //   Edit, 
// //   Trash2, 
// //   CheckSquare, 
// //   Square, 
// //   X, 
// //   AlertTriangle, 
// //   Clock, 
// //   CheckCircle,
// //   RefreshCw,
// //   Wrench
// // } from 'lucide-react';
// // import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
// // import api, { incidentsAPI, materielsAPI, logicielsAPI, reseauAPI, reparationsAPI, handleApiError } from '../services/api';
// // import IncidentForm from '../components/IncidentForm';
// // import ReparationForm from '../components/ReparationForm';
// // import { useAuth } from '../context/AuthContext';

// // // Type pour les incidents formatés
// // interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom' | 'logiciel_nom'> {
// //   utilisateur_nom?: string;
// //   materiel_nom?: string;
// //   logiciel_nom?: string;
// // }

// // // Fonctions helper
// // const safeArray = <T,>(data: any): T[] => {
// //   if (!data) return [];
// //   if (Array.isArray(data)) return data as T[];
// //   if (data.results && Array.isArray(data.results)) return data.results as T[];
// //   if (data.data && Array.isArray(data.data)) return data.data as T[];
// //   return [];
// // };

// // const safeFilter = <T,>(array: T[], condition: (item: T) => boolean): T[] => {
// //   if (!Array.isArray(array)) return [];
// //   return array.filter(condition);
// // };

// // const extractDataFromResponse = (response: any): any[] => {
// //   if (!response) return [];
  
// //   if (Array.isArray(response)) return response;
  
// //   if (response.data !== undefined) {
// //     if (Array.isArray(response.data)) return response.data;
    
// //     if (response.data.results && Array.isArray(response.data.results)) {
// //       return response.data.results;
// //     }
    
// //     if (response.data.data && Array.isArray(response.data.data)) {
// //       return response.data.data;
// //     }
    
// //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// //       return [response.data];
// //     }
// //   }
  
// //   if (response.results && Array.isArray(response.results)) {
// //     return response.results;
// //   }
  
// //   return [];
// // };

// // const displayIncidentSource = (incident: FormattedIncident): string => {
// //   const sources: string[] = [];
  
// //   if (incident.materiel_nom && incident.materiel_nom !== 'Non spécifié') {
// //     sources.push(`Matériel: ${incident.materiel_nom}`);
// //   }
  
// //   if (incident.logiciel_nom && incident.logiciel_nom !== 'Non spécifié') {
// //     sources.push(`Logiciel: ${incident.logiciel_nom}`);
// //   }
  
// //   if (incident.type_incident === 'reseau') {
// //     sources.push('Réseau');
// //   }
  
// //   return sources.length > 0 ? sources.join(' | ') : 'Source non spécifiée';
// // };

// // const Incidents: React.FC = () => {
// //   const { user: authUser } = useAuth();
  
// //   const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
// //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// //   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
// //   const [reseaux, setReseaux] = useState<Reseau[]>([]);
// //   const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
// //   const [activeIncidents, setActiveIncidents] = useState<FormattedIncident[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string>('');
// //   const [searchTerm, setSearchTerm] = useState<string>('');
// //   const [filterStatut, setFilterStatut] = useState<string>('');
// //   const [filterPriorite, setFilterPriorite] = useState<string>('');
// //   const [filterType, setFilterType] = useState<string>('');
// //   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [editingIncident, setEditingIncident] = useState<FormattedIncident | undefined>();
// //   const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
// //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
// //   const [refreshing, setRefreshing] = useState<boolean>(false);
// //   const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
// //   const [autoRepairMode, setAutoRepairMode] = useState<boolean>(false);
  
// //   // NOUVEAUX ÉTATS POUR RÉPARATION
// //   const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);
// //   const [incidentToRepair, setIncidentToRepair] = useState<FormattedIncident | null>(null);

// //   const getCurrentUser = (): UserType => {
// //     console.log('👤 Récupération utilisateur depuis Auth:', authUser);
    
// //     if (authUser) {
// //       return {
// //         id: authUser.id || 0,
// //         username: authUser.username || '',
// //         first_name: authUser.first_name || '',
// //         last_name: authUser.last_name || '',
// //         email: authUser.email || '',
// //         is_active: authUser.is_active !== false,
// //         date_joined: authUser.date_joined || new Date().toISOString(),
// //         role: authUser.role,
// //         departement: authUser.departement || '',
// //         telephone: authUser.telephone || ''
// //       };
// //     }
    
// //     try {
// //       const userStr = localStorage.getItem('user');
// //       if (userStr) {
// //         const user = JSON.parse(userStr);
// //         return {
// //           id: user.id || 0,
// //           username: user.username || '',
// //           first_name: user.first_name || '',
// //           last_name: user.last_name || '',
// //           email: user.email || '',
// //           is_active: user.is_active !== false,
// //           date_joined: user.date_joined || new Date().toISOString(),
// //           role: user.role,
// //           departement: user.departement || ''
// //         };
// //       }
// //     } catch (e) {
// //       console.error('Erreur parsing user:', e);
// //     }
    
// //     return {
// //       id: 0,
// //       username: 'utilisateur',
// //       first_name: 'Utilisateur',
// //       last_name: 'Inconnu',
// //       email: 'user@example.com',
// //       is_active: true,
// //       date_joined: new Date().toISOString(),
// //       role: 'user',
// //       departement: ''
// //     };
// //   };

// //   const filterActiveIncidents = (incidentsList: FormattedIncident[]): FormattedIncident[] => {
// //     return safeFilter<FormattedIncident>(
// //       incidentsList, 
// //       i => i.statut === 'ouvert' || i.statut === 'en_cours'
// //     );
// //   };

// //   const formatUserName = (user: any): string => {
// //     if (!user) return 'Utilisateur inconnu';
    
// //     if (user.first_name && user.last_name) {
// //       return `${user.first_name} ${user.last_name}`;
// //     }
    
// //     if (user.username) {
// //       return user.username;
// //     }
    
// //     if (user.email) {
// //       return user.email.split('@')[0];
// //     }
    
// //     return `Utilisateur #${user.id || '?'}`;
// //   };

// //   const handleExport = () => {
// //     try {
// //       const dataToExport = filteredIncidents.map(i => ({
// //         ID: i.id,
// //         Description: i.description,
// //         Type: getTypeText(i.type_incident),
// //         Priorité: getPriorityText(i.priorite),
// //         Statut: getStatusText(i.statut),
// //         'Matériel concerné': i.materiel_nom || 'Non spécifié',
// //         'Logiciel concerné': i.logiciel_nom || 'Non spécifié',
// //         'Utilisateur signaleur': i.utilisateur_nom || 'Non spécifié',
// //         'Date création': i.date_creation ? new Date(i.date_creation).toLocaleDateString('fr-FR') : 'Non spécifiée',
// //         'Date résolution': i.date_resolution ? new Date(i.date_resolution).toLocaleDateString('fr-FR') : 'Non résolu'
// //       }));

// //       if (dataToExport.length === 0) {
// //         showMessage('error', 'Aucune donnée à exporter');
// //         return;
// //       }

// //       const csvContent = [
// //         Object.keys(dataToExport[0] || {}).join(','),
// //         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
// //       ].join('\n');

// //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //       const link = document.createElement('a');
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
// //       link.style.visibility = 'hidden';
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);

// //       showMessage('success', 'Export CSV réussi !');
// //     } catch (error) {
// //       console.error('❌ Erreur export:', error);
// //       showMessage('error', 'Erreur lors de l\'export');
// //     }
// //   };

// //   const resetFilters = () => {
// //     setSearchTerm('');
// //     setFilterStatut('');
// //     setFilterPriorite('');
// //     setFilterType('');
// //     setSelectedIncidents([]);
// //     setShowActiveOnly(false);
// //   };

// //   const toggleActiveOnly = () => {
// //     setShowActiveOnly(!showActiveOnly);
// //   };

// //   const toggleAutoRepairMode = () => {
// //     setAutoRepairMode(!autoRepairMode);
// //   };

// //   const markAllActiveForRepair = () => {
// //     if (activeIncidents.length === 0) {
// //       showMessage('info', 'Aucun incident actif à marquer');
// //       return;
// //     }
    
// //     const activeIds = activeIncidents
// //       .map(i => i.id)
// //       .filter((id): id is number => id !== undefined);
    
// //     setSelectedIncidents(activeIds);
// //     showMessage('info', `${activeIncidents.length} incidents actifs sélectionnés pour réparation`);
// //   };

// //   const resolveLongDurationIncidents = async () => {
// //     try {
// //       const sevenDaysAgo = new Date();
// //       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
// //       const oldActiveIncidents = activeIncidents.filter(incident => {
// //         const creationDate = new Date(incident.date_creation || '');
// //         return creationDate < sevenDaysAgo;
// //       });
      
// //       if (oldActiveIncidents.length === 0) {
// //         showMessage('info', 'Aucun incident ancien à résoudre');
// //         return;
// //       }
      
// //       const resolvePromises = oldActiveIncidents.map(incident => 
// //         incidentsAPI.resoudre(incident.id || 0).catch(err => {
// //           console.error(`Erreur résolution incident ${incident.id}:`, err);
// //           return null;
// //         })
// //       );
      
// //       await Promise.all(resolvePromises);
      
// //       showMessage('success', `${oldActiveIncidents.length} incidents anciens résolus`);
// //       await fetchIncidents();
// //     } catch (error: any) {
// //       console.error('❌ Erreur résolution incidents anciens:', error);
// //       showMessage('error', handleApiError(error));
// //     }
// //   };

// //   const getStatusIcon = (status: string) => {
// //     switch (status) {
// //       case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
// //       case 'en_cours': return <Clock className="w-4 h-4" />;
// //       case 'resolu': return <CheckCircle className="w-4 h-4" />;
// //       case 'ferme': return <CheckCircle className="w-4 h-4" />;
// //       default: return <AlertTriangle className="w-4 h-4" />;
// //     }
// //   };

// //   const fetchIncidents = async () => {
// //     try {
// //       setLoading(true);
// //       console.log('🔄 Chargement des incidents...');
      
// //       const response = await incidentsAPI.getAll();
// //       console.log('📥 Réponse incidents:', response);
      
// //       const extractedData = extractDataFromResponse(response);
// //       console.log(`✅ ${extractedData.length} incidents chargés`);
      
// //       const getSignaleurName = (inc: any): string => {
// //         const getUserDisplayName = (user: any): string => {
// //           if (!user) return '';
          
// //           if (user.first_name && user.last_name) {
// //             return `${user.first_name} ${user.last_name}`;
// //           }
          
// //           if (user.username) return user.username;
          
// //           if (user.email) return user.email.split('@')[0];
          
// //           if (user.id) return `Utilisateur #${user.id}`;
          
// //           return '';
// //         };
        
// //         if (inc.utilisateur_nom) return inc.utilisateur_nom;
        
// //         if (inc.utilisateur_signaleur_details) {
// //           const name = getUserDisplayName(inc.utilisateur_signaleur_details);
// //           if (name) return name;
// //         }
        
// //         if (inc.user_details) {
// //           const name = getUserDisplayName(inc.user_details);
// //           if (name) return name;
// //         }
        
// //         if (inc.signaleur_nom_complet) return inc.signaleur_nom_complet;
// //         if (inc.signaleur_prenom && inc.signaleur_nom) {
// //           return `${inc.signaleur_prenom} ${inc.signaleur_nom}`;
// //         }
        
// //         return inc.utilisateur_signaleur ? `Utilisateur #${inc.utilisateur_signaleur}` : 'Non spécifié';
// //       };
      
// //       const formattedIncidents: FormattedIncident[] = extractedData.map((incident: any) => ({
// //         id: incident.id || 0,
// //         description: incident.description || '',
// //         type_incident: incident.type_incident || 'materiel',
// //         priorite: incident.priorite || 'moyenne',
// //         statut: incident.statut || 'ouvert',
// //         date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
// //         date_resolution: incident.date_resolution || null,
// //         utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
// //         materiel: incident.materiel || null,
// //         logiciel: incident.logiciel || null,
// //         reseau: incident.reseau || null,
        
// //         utilisateur_nom: getSignaleurName(incident),
// //         materiel_nom: incident.materiel_nom || 
// //                      (incident.materiel_details?.nom || incident.materiel_details?.reference || 
// //                       (incident.materiel ? `Matériel #${incident.materiel}` : '')),
// //         logiciel_nom: incident.logiciel_nom || 
// //                      (incident.logiciel_details?.nom || 
// //                       (incident.logiciel ? `Logiciel #${incident.logiciel}` : ''))
// //       }));
      
// //       const activeOnes = filterActiveIncidents(formattedIncidents);
// //       setActiveIncidents(activeOnes);
      
// //       setIncidents(formattedIncidents);
// //       setFilteredIncidents(formattedIncidents);
// //       setError('');
      
// //       if (formattedIncidents.length === 0) {
// //         showMessage('info', 'Aucun incident trouvé');
// //       }
      
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement incidents:', err);
// //       const errorMsg = handleApiError(err);
// //       setError(errorMsg);
// //       showMessage('error', errorMsg);
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   const fetchRelatedData = async () => {
// //     try {
// //       console.log('🔄 Chargement des données liées...');
      
// //       const [materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
// //         materielsAPI.getAll(),
// //         logicielsAPI.getAll(),
// //         reseauAPI.getAll()
// //       ]);
      
// //       let materielsData: Materiel[] = [];
// //       if (materielsRes.status === 'fulfilled') {
// //         materielsData = extractDataFromResponse(materielsRes.value);
// //         console.log(`✅ ${materielsData.length} matériels chargés`);
// //       }
      
// //       let logicielsData: Logiciel[] = [];
// //       if (logicielsRes.status === 'fulfilled') {
// //         logicielsData = extractDataFromResponse(logicielsRes.value);
// //         console.log(`✅ ${logicielsData.length} logiciels chargés`);
// //       }
      
// //       let reseauxData: Reseau[] = [];
// //       if (reseauxRes.status === 'fulfilled') {
// //         reseauxData = extractDataFromResponse(reseauxRes.value);
// //         console.log(`✅ ${reseauxData.length} réseaux chargés`);
// //       }
      
// //       setMateriels(materielsData);
// //       setLogiciels(logicielsData);
// //       setReseaux(reseauxData);
      
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement données liées:', err);
// //     }
// //   };

// //   useEffect(() => {
// //     const loadInitialData = async () => {
// //       await fetchIncidents();
// //       await fetchRelatedData();
// //     };
    
// //     loadInitialData();
// //   }, []);

// //   useEffect(() => {
// //     filterIncidents();
// //   }, [incidents, searchTerm, filterStatut, filterPriorite, filterType, showActiveOnly]);

// //   useEffect(() => {
// //     if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
// //       setIsSelectAll(true);
// //     } else {
// //       setIsSelectAll(false);
// //     }
// //   }, [selectedIncidents, filteredIncidents]);

// //   const filterIncidents = () => {
// //     let filtered = showActiveOnly ? activeIncidents : safeArray<FormattedIncident>(incidents);

// //     if (searchTerm) {
// //       const searchLower = searchTerm.toLowerCase();
// //       filtered = safeFilter<FormattedIncident>(filtered, incident => 
// //         (incident.description?.toLowerCase() || '').includes(searchLower) ||
// //         (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
// //         (incident.logiciel_nom?.toLowerCase() || '').includes(searchLower) ||
// //         (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
// //       );
// //     }

// //     if (filterStatut) {
// //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
// //     }

// //     if (filterPriorite) {
// //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
// //     }

// //     if (filterType) {
// //       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
// //     }

// //     setFilteredIncidents(filtered);
// //     setSelectedIncidents([]);
// //   };

// //   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
// //     setMessage({ type, text });
// //     setTimeout(() => setMessage(null), 5000);
// //   };

// //   // NOUVELLE FONCTION : Gestion de la soumission de réparation
// //   const handleReparationSubmit = async (reparationData: any) => {
// //     try {
// //       console.log('🛠️ Création de réparation pour incident:', incidentToRepair?.id);
// //       console.log('📤 Données réparation:', reparationData);
      
// //       // 1. Créer la réparation
// //       await reparationsAPI.create(reparationData);
      
// //       // 2. Marquer l'incident comme résolu AUTOMATIQUEMENT
// //       if (incidentToRepair && incidentToRepair.id) {
// //         console.log(`✅ Marquer l'incident #${incidentToRepair.id} comme résolu`);
// //         await incidentsAPI.resoudre(incidentToRepair.id);
        
// //         showMessage('success', 
// //           `✅ Réparation créée avec succès!\n` +
// //           `📋 L'incident #${incidentToRepair.id} a été automatiquement marqué comme résolu.`
// //         );
// //       } else {
// //         showMessage('success', 'Réparation créée avec succès!');
// //       }
      
// //       // 3. Rafraîchir les données
// //       await Promise.all([
// //         fetchIncidents(),
// //         fetchRelatedData()
// //       ]);
      
// //       // 4. Fermer le formulaire
// //       setIsRepairFormOpen(false);
// //       setIncidentToRepair(null);
      
// //     } catch (error: any) {
// //       console.error('❌ Erreur création réparation:', error);
      
// //       let errorMessage = 'Erreur lors de la création de la réparation';
// //       if (error.response?.status === 400) {
// //         errorMessage = 'Données invalides pour la réparation';
// //       } else if (error.response?.status === 404) {
// //         errorMessage = 'L\'incident ou le matériel n\'existe plus';
// //       } else if (error.message) {
// //         errorMessage = error.message;
// //       }
      
// //       showMessage('error', errorMessage);
// //     }
// //   };

// //   // NOUVELLE FONCTION : Lancer la réparation immédiate
// //   const handleRepairImmediate = (incident: FormattedIncident) => {
// //     console.log('🔧 Réparation immédiate pour incident:', incident.id);
// //     setIncidentToRepair(incident);
// //     setIsRepairFormOpen(true);
// //   };

// //   const handleSubmit = async (incidentData: any) => {
// //     try {
// //       console.log('📤 Soumission incident:', incidentData);
      
// //       const currentUser = getCurrentUser();
      
// //       const formattedData: any = {
// //         description: incidentData.description,
// //         type_incident: incidentData.type_incident,
// //         priorite: incidentData.priorite,
// //         statut: incidentData.statut,
// //         utilisateur_signaleur: currentUser.id
// //       };
      
// //       if (incidentData.date_creation) {
// //         formattedData.date_creation = incidentData.date_creation;
// //       } else if (editingIncident && editingIncident.date_creation) {
// //         formattedData.date_creation = editingIncident.date_creation;
// //       }
      
// //       if (incidentData.date_resolution) {
// //         formattedData.date_resolution = incidentData.date_resolution;
// //       }
      
// //       if (incidentData.materiel && incidentData.materiel > 0) {
// //         formattedData.materiel = incidentData.materiel;
// //       }
// //       if (incidentData.logiciel && incidentData.logiciel > 0) {
// //         formattedData.logiciel = incidentData.logiciel;
// //       }
// //       if (incidentData.reseau && incidentData.reseau > 0) {
// //         formattedData.reseau = incidentData.reseau;
// //       }
      
// //       console.log('📤 Données envoyées à l\'API:', formattedData);
      
// //       if (editingIncident && editingIncident.id) {
// //         await incidentsAPI.update(editingIncident.id, formattedData);
// //         showMessage('success', 'Incident modifié avec succès');
// //       } else {
// //         await incidentsAPI.create(formattedData);
// //         showMessage('success', 'Incident créé avec succès');
// //       }
      
// //       await fetchIncidents();
// //       setIsFormOpen(false);
// //       setEditingIncident(undefined);
      
// //     } catch (error: any) {
// //       console.error('❌ Erreur soumission incident:', error);
// //       const errorMsg = handleApiError(error);
// //       showMessage('error', errorMsg);
// //     }
// //   };

// //   const toggleSelectIncident = (id: number) => {
// //     setSelectedIncidents(prev => 
// //       prev.includes(id) 
// //         ? prev.filter(item => item !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   const toggleSelectAll = () => {
// //     if (isSelectAll) {
// //       setSelectedIncidents([]);
// //     } else {
// //       const allIds = filteredIncidents
// //         .map(i => i.id)
// //         .filter((id): id is number => id !== undefined);
// //       setSelectedIncidents(allIds);
// //     }
// //   };

// //   const handleDeleteSelected = async () => {
// //     if (selectedIncidents.length === 0) {
// //       showMessage('error', 'Aucun incident sélectionné');
// //       return;
// //     }

// //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIncidents.length} incident(s) ?`)) {
// //       try {
// //         const deletePromises = selectedIncidents.map(id => 
// //           incidentsAPI.delete(id).catch(err => {
// //             console.error(`Erreur suppression incident ${id}:`, err);
// //             return null;
// //           })
// //         );
        
// //         await Promise.all(deletePromises);
        
// //         showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
// //         setSelectedIncidents([]);
// //         await fetchIncidents();
// //       } catch (error: any) {
// //         console.error('❌ Erreur suppression incidents:', error);
// //         showMessage('error', handleApiError(error));
// //       }
// //     }
// //   };

// //   const handleEditSelected = () => {
// //     if (selectedIncidents.length === 0) {
// //       showMessage('error', 'Aucun incident sélectionné');
// //       return;
// //     }

// //     if (selectedIncidents.length === 1) {
// //       const incident = incidents.find(i => i.id === selectedIncidents[0]);
// //       if (incident) {
// //         handleEdit(incident);
// //       }
// //     } else {
// //       showMessage('info', `Édition multiple de ${selectedIncidents.length} incidents`);
// //     }
// //   };

// //   const handleResoudreSelected = async () => {
// //     if (selectedIncidents.length === 0) {
// //       showMessage('error', 'Aucun incident sélectionné');
// //       return;
// //     }

// //     try {
// //       const resolvePromises = selectedIncidents.map(id => 
// //         incidentsAPI.resoudre(id).catch(err => {
// //           console.error(`Erreur résolution incident ${id}:`, err);
// //           return null;
// //         })
// //       );
      
// //       await Promise.all(resolvePromises);
      
// //       showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
// //       setSelectedIncidents([]);
// //       await fetchIncidents();
// //     } catch (error: any) {
// //       console.error('❌ Erreur résolution incidents:', error);
// //       showMessage('error', handleApiError(error));
// //     }
// //   };

// //   const handleEdit = (incident: FormattedIncident) => {
// //     console.log('✏️ Édition incident:', incident);
// //     setEditingIncident(incident);
// //     setIsFormOpen(true);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
// //       try {
// //         await incidentsAPI.delete(id);
// //         showMessage('success', 'Incident supprimé avec succès');
// //         await fetchIncidents();
// //       } catch (error: any) {
// //         console.error('❌ Erreur suppression incident:', error);
// //         showMessage('error', handleApiError(error));
// //       }
// //     }
// //   };

// //   const handleResoudre = async (id: number) => {
// //     try {
// //       await incidentsAPI.resoudre(id);
// //       showMessage('success', 'Incident marqué comme résolu');
// //       await fetchIncidents();
// //     } catch (error: any) {
// //       console.error('❌ Erreur résolution incident:', error);
// //       showMessage('error', handleApiError(error));
// //     }
// //   };

// //   const handleAddNew = () => {
// //     setEditingIncident(undefined);
// //     setIsFormOpen(true);
// //   };

// //   const handleRefresh = async () => {
// //     setRefreshing(true);
// //     await fetchIncidents();
// //     showMessage('success', 'Données rafraîchies');
// //   };

// //   const getPriorityBadge = (priority: string) => {
// //     const badges: Record<string, string> = {
// //       critique: 'badge-error',
// //       elevee: 'badge-warning',
// //       moyenne: 'badge-info',
// //       basse: 'badge-success'
// //     };
// //     return badges[priority] || 'badge-neutral';
// //   };

// //   const getPriorityText = (priority: string) => {
// //     const texts: Record<string, string> = {
// //       critique: 'Critique',
// //       elevee: 'Élevée',
// //       moyenne: 'Moyenne',
// //       basse: 'Basse'
// //     };
// //     return texts[priority] || priority;
// //   };

// //   const getStatusBadge = (status: string) => {
// //     const badges: Record<string, string> = {
// //       ouvert: 'badge-warning',
// //       en_cours: 'badge-info',
// //       resolu: 'badge-success',
// //       ferme: 'badge-neutral'
// //     };
// //     return badges[status] || 'badge-neutral';
// //   };

// //   const getStatusText = (status: string) => {
// //     const texts: Record<string, string> = {
// //       ouvert: 'Ouvert',
// //       en_cours: 'En cours',
// //       resolu: 'Résolu',
// //       ferme: 'Fermé'
// //     };
// //     return texts[status] || status;
// //   };

// //   const getTypeText = (type: string) => {
// //     const texts: Record<string, string> = {
// //       materiel: 'Matériel',
// //       logiciel: 'Logiciel',
// //       reseau: 'Réseau',
// //       mixte: 'Mixte'
// //     };
// //     return texts[type] || type;
// //   };

// //   const stats = {
// //     total: safeArray<FormattedIncident>(incidents).length,
// //     ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
// //     en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
// //     resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu').length,
// //     actifs: activeIncidents.length
// //   };

// //   if (loading && !refreshing) {
// //     return (
// //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-4">
// //           <span className="loading loading-spinner loading-lg text-primary"></span>
// //           <p className="text-base-content">Chargement des incidents...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 bg-base-100 min-h-screen">
// //       {message && (
// //         <div className={`alert ${
// //           message.type === 'success' ? 'alert-success' : 
// //           message.type === 'error' ? 'alert-error' : 
// //           'alert-info'
// //         } mb-4 shadow-lg`}>
// //           <span>{message.text}</span>
// //         </div>
// //       )}

// //       {error && (
// //         <div className="alert alert-error mb-4 shadow-lg">
// //           <AlertTriangle className="h-5 w-5" />
// //           <span>{error}</span>
// //           <button 
// //             className="btn btn-sm btn-ghost"
// //             onClick={handleRefresh}
// //           >
// //             <RefreshCw className="h-4 w-4" />
// //             Réessayer
// //           </button>
// //         </div>
// //       )}

// //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
// //         <div>
// //           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
// //           <p className="text-base-content opacity-60 mt-1">
// //             Suivi et résolution des incidents techniques ({safeArray<FormattedIncident>(filteredIncidents).length} incidents)
// //             {selectedIncidents.length > 0 && (
// //               <span className="text-primary font-semibold ml-2">
// //                 ({selectedIncidents.length} sélectionné(s))
// //               </span>
// //             )}
// //             {showActiveOnly && (
// //               <span className="text-warning font-semibold ml-2">
// //                 🔧 Affichage actifs seulement
// //               </span>
// //             )}
// //           </p>
// //         </div>
// //         <div className="flex gap-2 flex-wrap">
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
// //             disabled={filteredIncidents.length === 0}
// //           >
// //             <Download className="h-4 w-4 mr-2" />
// //             Exporter
// //           </button>
// //           <button
// //             onClick={handleAddNew}
// //             className="btn btn-primary btn-sm"
// //           >
// //             <Plus className="h-4 w-4 mr-2" />
// //             Nouvel incident
// //           </button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
// //                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
// //               </div>
// //               <div className="text-2xl">📊</div>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">Ouverts</p>
// //                 <p className="text-2xl font-bold text-orange-600">{stats.ouvert}</p>
// //               </div>
// //               <AlertTriangle className="w-6 h-6 text-orange-500" />
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">En cours</p>
// //                 <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
// //               </div>
// //               <Clock className="w-6 h-6 text-blue-500" />
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">Résolus</p>
// //                 <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
// //               </div>
// //               <CheckCircle className="w-6 h-6 text-green-500" />
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="card bg-warning/10 shadow-xl">
// //           <div className="card-body py-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-base-content opacity-70">
// //                   {autoRepairMode ? '🔄 En réparation' : '⚠️ Actifs'}
// //                 </p>
// //                 <p className="text-2xl font-bold text-warning">{activeIncidents.length}</p>
// //                 {activeIncidents.length > 0 && (
// //                   <div className="text-xs mt-1 opacity-70">
// //                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts
// //                   </div>
// //                 )}
// //               </div>
// //               <Wrench className="w-6 h-6 text-warning" />
// //             </div>
// //             {activeIncidents.length > 0 && (
// //               <div className="mt-2">
// //                 <button
// //                   onClick={toggleActiveOnly}
// //                   className="btn btn-warning btn-xs w-full mt-1"
// //                 >
// //                   {showActiveOnly ? 'Voir tous' : 'Voir actifs'}
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       <div className="card bg-base-200 shadow-xl mb-6">
// //         <div className="card-body">
// //           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔍 Rechercher</span>
// //               </label>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// //                 <input
// //                   type="text"
// //                   placeholder="Description, matériel, logiciel..."
// //                   className="input input-bordered w-full pl-10 bg-base-100"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
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
// //                 <option value="ouvert">Ouvert</option>
// //                 <option value="en_cours">En cours</option>
// //                 <option value="resolu">Résolu</option>
// //                 <option value="ferme">Fermé</option>
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">⚠️ Priorité</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterPriorite}
// //                 onChange={(e) => setFilterPriorite(e.target.value)}
// //               >
// //                 <option value="">Toutes les priorités</option>
// //                 <option value="critique">Critique</option>
// //                 <option value="elevee">Élevée</option>
// //                 <option value="moyenne">Moyenne</option>
// //                 <option value="basse">Basse</option>
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
// //                 <option value="materiel">Matériel</option>
// //                 <option value="logiciel">Logiciel</option>
// //                 <option value="reseau">Réseau</option>
// //                 <option value="mixte">Mixte</option>
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

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔧 Réparation</span>
// //               </label>
// //               <div className="flex flex-col gap-2">
// //                 <button
// //                   onClick={toggleAutoRepairMode}
// //                   className={`btn btn-sm w-full ${autoRepairMode ? 'btn-warning' : 'btn-outline'}`}
// //                 >
// //                   {autoRepairMode ? '🔄 Auto ON' : 'Auto réparation'}
// //                 </button>
// //                 {activeIncidents.length > 0 && (
// //                   <button
// //                     onClick={markAllActiveForRepair}
// //                     className="btn btn-warning btn-sm w-full"
// //                     disabled={autoRepairMode}
// //                   >
// //                     Marquer pour réparation
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {activeIncidents.length > 0 && (
// //             <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
// //               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
// //                 <div className="flex items-center gap-3">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
// //                     <span className="font-semibold text-warning">
// //                       ⚠️ {activeIncidents.length} incident(s) actif(s)
// //                     </span>
// //                   </div>
// //                   <div className="text-sm opacity-70">
// //                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts, 
// //                     {' '}{safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'en_cours').length} en cours
// //                   </div>
// //                 </div>
// //                 <div className="flex gap-2 flex-wrap">
// //                   <button
// //                     onClick={markAllActiveForRepair}
// //                     className="btn btn-warning btn-sm gap-2"
// //                   >
// //                     <CheckSquare className="h-4 w-4" />
// //                     Tout marquer en réparation
// //                   </button>
// //                   <button
// //                     onClick={resolveLongDurationIncidents}
// //                     className="btn btn-outline btn-sm gap-2"
// //                     title="Résoudre les incidents en cours depuis plus de 7 jours"
// //                   >
// //                     <Clock className="h-4 w-4" />
// //                     Nettoyer anciens
// //                   </button>
// //                 </div>
// //               </div>
              
// //               {autoRepairMode && (
// //                 <div className="mt-3 pt-3 border-t border-warning/20">
// //                   <div className="text-sm font-medium text-warning mb-2">
// //                     🛠️ Prêts pour réparation immédiate:
// //                   </div>
// //                   <div className="flex flex-wrap gap-2">
// //                     {activeIncidents.slice(0, 5).map(incident => (
// //                       <div 
// //                         key={incident.id} 
// //                         className="badge badge-warning badge-lg gap-1 cursor-pointer hover:badge-outline"
// //                         onClick={() => handleRepairImmediate(incident)} // CHANGÉ ICI
// //                         title={`Cliquer pour réparer: ${incident.description}`}
// //                       >
// //                         <span>#{incident.id}</span>
// //                         <span className="font-bold">{getPriorityText(incident.priorite)}</span>
// //                       </div>
// //                     ))}
// //                     {activeIncidents.length > 5 && (
// //                       <div className="badge badge-ghost">
// //                         +{activeIncidents.length - 5} autres...
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {selectedIncidents.length > 0 && (
// //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// //               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
// //                 <div className="flex items-center gap-4">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// //                     <span className="font-semibold text-primary text-lg">
// //                       {selectedIncidents.length} incident(s) sélectionné(s)
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="flex gap-2 flex-wrap">
// //                   <button
// //                     onClick={handleEditSelected}
// //                     className="btn btn-primary btn-sm gap-2"
// //                   >
// //                     <Edit className="h-4 w-4" />
// //                     Modifier ({selectedIncidents.length})
// //                   </button>
// //                   <button
// //                     onClick={handleResoudreSelected}
// //                     className="btn btn-success btn-sm gap-2"
// //                   >
// //                     <CheckCircle className="h-4 w-4" />
// //                     Résoudre ({selectedIncidents.length})
// //                   </button>
// //                   <button
// //                     onClick={handleDeleteSelected}
// //                     className="btn btn-error btn-sm gap-2"
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                     Supprimer ({selectedIncidents.length})
// //                   </button>
// //                   <button
// //                     onClick={() => setSelectedIncidents([])}
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
// //                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
// //                         disabled={filteredIncidents.length === 0}
// //                       >
// //                         {isSelectAll ? (
// //                           <CheckSquare className="h-5 w-5 text-primary" />
// //                         ) : (
// //                           <Square className="h-5 w-5 text-base-content/40" />
// //                         )}
// //                       </button>
// //                     </div>
// //                   </th>
// //                   <th className="font-bold">Description</th>
// //                   <th className="font-bold">Type</th>
// //                   <th className="font-bold">Priorité</th>
// //                   <th className="font-bold">Statut</th>
// //                   <th className="font-bold">Date création</th>
// //                   <th className="font-bold text-center">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {safeArray<FormattedIncident>(filteredIncidents).map((incident) => (
// //                   <tr key={incident.id} className="hover">
// //                     <td className="text-center">
// //                       <div className="flex justify-center">
// //                         <input
// //                           type="checkbox"
// //                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
// //                           checked={selectedIncidents.includes(incident.id || 0)}
// //                           onChange={() => toggleSelectIncident(incident.id || 0)}
// //                         />
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className="max-w-xs">
// //                         <div className="font-medium text-base-content line-clamp-2">
// //                           {incident.description}
// //                         </div>
                        
// //                         <div className="text-sm text-base-content opacity-70 mt-1">
// //                           👤 <span className="font-medium">Signaleur:</span> 
// //                           <span className="ml-1">
// //                             {incident.utilisateur_nom || 'Non spécifié'}
// //                           </span>
// //                         </div>
                        
// //                         {incident.materiel_nom && (
// //                           <div className="text-sm text-base-content opacity-70 mt-1">
// //                             📦 <span className="font-medium">Matériel:</span> 
// //                             <span className="ml-1">{incident.materiel_nom}</span>
// //                           </div>
// //                         )}
                        
// //                         {incident.logiciel_nom && (
// //                           <div className="text-sm text-base-content opacity-70">
// //                             💻 <span className="font-medium">Logiciel:</span> 
// //                             <span className="ml-1">{incident.logiciel_nom}</span>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <span className="text-sm font-medium capitalize">{getTypeText(incident.type_incident)}</span>
// //                     </td>
// //                     <td>
// //                       <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg ${(incident.statut === 'ouvert' || incident.statut === 'en_cours') ? 'badge-outline' : ''}`}>
// //                         {getPriorityText(incident.priorite)}
// //                         {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && incident.priorite === 'critique' && (
// //                           <span className="ml-1">🔥</span>
// //                         )}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className="flex items-center gap-2">
// //                         {getStatusIcon(incident.statut)}
// //                         <div className={`badge ${getStatusBadge(incident.statut)}`}>
// //                           {getStatusText(incident.statut)}
// //                         </div>
// //                         {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && (
// //                           <span className="text-xs text-warning font-semibold">
// //                             🔧
// //                           </span>
// //                         )}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <span className="text-sm font-medium">
// //                         {incident.date_creation ? new Date(incident.date_creation).toLocaleDateString('fr-FR') : '-'}
// //                       </span>
// //                       <div className="text-xs text-base-content opacity-60 mt-1">
// //                         {incident.date_creation ? new Date(incident.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
// //                       </div>
// //                     </td>
// //                     <td>
// //                       <div className="flex justify-center space-x-1">
// //                         <button
// //                           className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
// //                           title="Voir les détails"
// //                           onClick={() => {
// //                             showMessage('info', `Détails de l'incident #${incident.id}`);
// //                           }}
// //                         >
// //                           <Eye className="h-4 w-4" />
// //                         </button>
// //                         <button
// //                           onClick={() => handleEdit(incident)}
// //                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
// //                           title="Modifier"
// //                         >
// //                           <Edit className="h-4 w-4" />
// //                         </button>
// //                         {/* AJOUT DU BOUTON RÉPARER IMMÉDIATE */}
// //                         {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
// //                           <button
// //                             onClick={() => handleRepairImmediate(incident)}
// //                             className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
// //                             title="Réparer immédiatement"
// //                           >
// //                             <Wrench className="h-4 w-4" />
// //                           </button>
// //                         )}
// //                         {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
// //                           <button
// //                             onClick={() => handleResoudre(incident.id || 0)}
// //                             className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
// //                             title="Marquer comme résolu"
// //                           >
// //                             <CheckCircle className="h-4 w-4" />
// //                           </button>
// //                         )}
// //                         <button
// //                           onClick={() => handleDelete(incident.id || 0)}
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

// //           {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
// //             <div className="text-center py-12">
// //               <div className="text-base-content opacity-40 mb-4">
// //                 <Search className="h-16 w-16 mx-auto mb-4" />
// //                 <p className="text-lg font-medium">Aucun incident trouvé</p>
// //                 <p className="text-sm mt-2">
// //                   {searchTerm || filterStatut || filterPriorite || filterType || showActiveOnly
// //                     ? "Essayez de modifier vos critères de recherche" 
// //                     : "Aucun incident n'est enregistré dans le système"
// //                   }
// //                 </p>
// //                 <button
// //                   onClick={handleAddNew}
// //                   className="btn btn-primary btn-sm mt-4"
// //                 >
// //                   <Plus className="h-4 w-4 mr-2" />
// //                   Créer le premier incident
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Formulaire d'incident */}
// //       <IncidentForm
// //         isOpen={isFormOpen}
// //         onClose={() => {
// //           setIsFormOpen(false);
// //           setEditingIncident(undefined);
// //         }}
// //         onSubmit={handleSubmit}
// //         incident={editingIncident}
// //         currentUser={getCurrentUser()}
// //       />

// //       {/* Formulaire de réparation */}
// //       <ReparationForm
// //         isOpen={isRepairFormOpen}
// //         onClose={() => {
// //           setIsRepairFormOpen(false);
// //           setIncidentToRepair(null);
// //         }}
// //         onSubmit={handleReparationSubmit}
// //         incidentSource={incidentToRepair}
// //         materiels={materiels}
// //         incidents={incidents}
// //       />
// //     </div>
// //   );
// // };

// // export default Incidents;





// // Incidents.tsx - Version corrigée complète
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Eye, 
//   Filter, 
//   Download, 
//   Edit, 
//   Trash2, 
//   CheckSquare, 
//   Square, 
//   X, 
//   AlertTriangle, 
//   Clock, 
//   CheckCircle,
//   RefreshCw,
//   Wrench,
//   User,
//   Server,
//   Monitor,
//   Cpu
// } from 'lucide-react';
// import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
// import api, { incidentsAPI, materielsAPI, logicielsAPI, reseauAPI, reparationsAPI, handleApiError } from '../services/api';
// import IncidentForm from '../components/IncidentForm';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Type pour les incidents formatés
// interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom' | 'logiciel_nom'> {
//   utilisateur_nom?: string;
//   materiel_nom?: string;
//   logiciel_nom?: string;
//   materiel_details?: any;
//   logiciel_details?: any;
//   signaleur_details?: any;
// }

// // Fonctions helper
// const safeArray = <T,>(data: any): T[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data as T[];
//   if (data.results && Array.isArray(data.results)) return data.results as T[];
//   if (data.data && Array.isArray(data.data)) return data.data as T[];
//   return [];
// };

// const safeFilter = <T,>(array: T[], condition: (item: T) => boolean): T[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
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

// // Fonction pour formater le nom d'un utilisateur
// const formatUserName = (user: any): string => {
//   if (!user) return 'Utilisateur inconnu';
  
//   console.log('👤 Formatage utilisateur:', user);
  
//   // Essayer différentes combinaisons de champs
//   if (user.first_name && user.last_name) {
//     return `${user.first_name} ${user.last_name}`;
//   }
  
//   if (user.nom && user.prenom) {
//     return `${user.prenom} ${user.nom}`;
//   }
  
//   if (user.nom_complet) {
//     return user.nom_complet;
//   }
  
//   if (user.username) {
//     return user.username;
//   }
  
//   if (user.email) {
//     return user.email.split('@')[0];
//   }
  
//   return `Utilisateur #${user.id || '?'}`;
// };

// // Fonction pour extraire le nom du matériel
// const getMaterielName = (materiel: any): string => {
//   if (!materiel) return 'Non spécifié';
  
//   if (materiel.nom) {
//     return materiel.nom;
//   }
  
//   if (materiel.libelle) {
//     return materiel.libelle;
//   }
  
//   if (materiel.reference) {
//     return `Matériel: ${materiel.reference}`;
//   }
  
//   if (materiel.id) {
//     return `Matériel #${materiel.id}`;
//   }
  
//   return 'Matériel inconnu';
// };

// // Fonction pour vérifier si un matériel est en panne
// const isMaterielEnPanne = (materiel: any): boolean => {
//   if (!materiel) return false;
  
//   const etat = (materiel.etat || '').toLowerCase().trim();
//   const statut = (materiel.statut || '').toLowerCase().trim();
  
//   const etatsPanne = [
//     'en_panne',
//     'en panne',
//     'panne',
//     'broken',
//     'out of order',
//     'hors service',
//     'defective',
//     'faulty'
//   ];
  
//   return etatsPanne.some(panneEtat => 
//     etat.includes(panneEtat) || statut.includes(panneEtat)
//   );
// };

// const Incidents: React.FC = () => {
//   const { user: authUser } = useAuth();
  
//   const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
//   const [reseaux, setReseaux] = useState<Reseau[]>([]);
//   const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
//   const [activeIncidents, setActiveIncidents] = useState<FormattedIncident[]>([]);
//   const [materielsEnPanne, setMaterielsEnPanne] = useState<Materiel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterPriorite, setFilterPriorite] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingIncident, setEditingIncident] = useState<FormattedIncident | undefined>();
//   const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
//   const [autoRepairMode, setAutoRepairMode] = useState<boolean>(false);
  
//   // États pour réparation
//   const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);
//   const [incidentToRepair, setIncidentToRepair] = useState<FormattedIncident | null>(null);
//   const [materielToRepair, setMaterielToRepair] = useState<Materiel | null>(null);

//   const getCurrentUser = (): UserType => {
//     console.log('👤 Récupération utilisateur depuis Auth:', authUser);
    
//     if (authUser) {
//       return {
//         id: authUser.id || 0,
//         username: authUser.username || '',
//         first_name: authUser.first_name || '',
//         last_name: authUser.last_name || '',
//         email: authUser.email || '',
//         is_active: authUser.is_active !== false,
//         date_joined: authUser.date_joined || new Date().toISOString(),
//         role: authUser.role,
//         departement: authUser.departement || '',
//         telephone: authUser.telephone || ''
//       };
//     }
    
//     try {
//       const userStr = localStorage.getItem('user');
//       if (userStr) {
//         const user = JSON.parse(userStr);
//         return {
//           id: user.id || 0,
//           username: user.username || '',
//           first_name: user.first_name || '',
//           last_name: user.last_name || '',
//           email: user.email || '',
//           is_active: user.is_active !== false,
//           date_joined: user.date_joined || new Date().toISOString(),
//           role: user.role,
//           departement: user.departement || ''
//         };
//       }
//     } catch (e) {
//       console.error('Erreur parsing user:', e);
//     }
    
//     return {
//       id: 0,
//       username: 'utilisateur',
//       first_name: 'Utilisateur',
//       last_name: 'Inconnu',
//       email: 'user@example.com',
//       is_active: true,
//       date_joined: new Date().toISOString(),
//       role: 'user',
//       departement: ''
//     };
//   };

//   const filterActiveIncidents = (incidentsList: FormattedIncident[]): FormattedIncident[] => {
//     return safeFilter<FormattedIncident>(
//       incidentsList, 
//       i => i.statut === 'ouvert' || i.statut === 'en_cours'
//     );
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredIncidents.map(i => ({
//         ID: i.id,
//         Description: i.description,
//         Type: getTypeText(i.type_incident),
//         Priorité: getPriorityText(i.priorite),
//         Statut: getStatusText(i.statut),
//         'Matériel concerné': i.materiel_nom || 'Non spécifié',
//         'Logiciel concerné': i.logiciel_nom || 'Non spécifié',
//         'Utilisateur signaleur': i.utilisateur_nom || 'Non spécifié',
//         'Date création': i.date_creation ? new Date(i.date_creation).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date résolution': i.date_resolution ? new Date(i.date_resolution).toLocaleDateString('fr-FR') : 'Non résolu'
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
//       link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterStatut('');
//     setFilterPriorite('');
//     setFilterType('');
//     setSelectedIncidents([]);
//     setShowActiveOnly(false);
//   };

//   const toggleActiveOnly = () => {
//     setShowActiveOnly(!showActiveOnly);
//   };

//   const toggleAutoRepairMode = () => {
//     setAutoRepairMode(!autoRepairMode);
//   };

//   const markAllActiveForRepair = () => {
//     if (activeIncidents.length === 0) {
//       showMessage('info', 'Aucun incident actif à marquer');
//       return;
//     }
    
//     const activeIds = activeIncidents
//       .map(i => i.id)
//       .filter((id): id is number => id !== undefined);
    
//     setSelectedIncidents(activeIds);
//     showMessage('info', `${activeIncidents.length} incidents actifs sélectionnés pour réparation`);
//   };

//   const resolveLongDurationIncidents = async () => {
//     try {
//       const sevenDaysAgo = new Date();
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
//       const oldActiveIncidents = activeIncidents.filter(incident => {
//         const creationDate = new Date(incident.date_creation || '');
//         return creationDate < sevenDaysAgo;
//       });
      
//       if (oldActiveIncidents.length === 0) {
//         showMessage('info', 'Aucun incident ancien à résoudre');
//         return;
//       }
      
//       const resolvePromises = oldActiveIncidents.map(incident => 
//         incidentsAPI.resoudre(incident.id || 0).catch(err => {
//           console.error(`Erreur résolution incident ${incident.id}:`, err);
//           return null;
//         })
//       );
      
//       await Promise.all(resolvePromises);
      
//       showMessage('success', `${oldActiveIncidents.length} incidents anciens résolus`);
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incidents anciens:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
//       case 'en_cours': return <Clock className="w-4 h-4" />;
//       case 'resolu': return <CheckCircle className="w-4 h-4" />;
//       case 'ferme': return <CheckCircle className="w-4 h-4" />;
//       default: return <AlertTriangle className="w-4 h-4" />;
//     }
//   };

//   // Fonction pour récupérer le nom du signaleur d'un incident
//   const getSignaleurName = (incident: any): string => {
//     if (!incident) return 'Non spécifié';
    
//     console.log('🔍 Recherche signaleur pour incident:', incident.id);
//     console.log('📋 Données incident:', incident);
    
//     // Essayer différentes sources de données
//     const sources = [
//       // 1. Données directes
//       incident.utilisateur_nom,
//       incident.signaleur_nom,
//       incident.signaleur_prenom && incident.signaleur_nom 
//         ? `${incident.signaleur_prenom} ${incident.signaleur_nom}`
//         : null,
//       incident.signaleur_nom_complet,
      
//       // 2. Détails du signaleur
//       incident.utilisateur_signaleur_details 
//         ? formatUserName(incident.utilisateur_signaleur_details)
//         : null,
      
//       incident.signaleur_details 
//         ? formatUserName(incident.signaleur_details)
//         : null,
      
//       // 3. User details
//       incident.user_details 
//         ? formatUserName(incident.user_details)
//         : null,
      
//       // 4. Fallback sur l'ID
//       incident.utilisateur_signaleur 
//         ? `Utilisateur #${incident.utilisateur_signaleur}`
//         : null,
//     ];
    
//     // Prendre la première source non nulle
//     for (const source of sources) {
//       if (source && source !== 'null' && source !== 'undefined') {
//         console.log(`✅ Signaleur trouvé: ${source}`);
//         return source;
//       }
//     }
    
//     console.log('❌ Aucun signaleur trouvé');
//     return 'Non spécifié';
//   };

//   // Fonction pour récupérer les détails du matériel
//   const getMaterielDetails = (incident: any, materielsList: Materiel[]): any => {
//     if (!incident || !materielsList.length) return null;
    
//     // Chercher le matériel par différents champs
//     const materielId = incident.materiel || incident.materiel_id || incident.materiel_concerne;
//     if (!materielId) return null;
    
//     const materiel = materielsList.find(m => m.id === Number(materielId));
//     if (materiel) {
//       console.log(`✅ Matériel trouvé pour incident ${incident.id}:`, materiel);
//       return materiel;
//     }
    
//     // Si le matériel n'est pas trouvé par ID, chercher par nom
//     if (incident.materiel_nom) {
//       const materielByName = materielsList.find(m => 
//         m.nom?.includes(incident.materiel_nom) || 
//         m.libelle?.includes(incident.materiel_nom)
//       );
//       if (materielByName) return materielByName;
//     }
    
//     return null;
//   };

//   // Fonction pour récupérer le nom du matériel
//   const getMaterielDisplayName = (incident: any, materielsList: Materiel[]): string => {
//     const materielDetails = getMaterielDetails(incident, materielsList);
    
//     if (materielDetails) {
//       return getMaterielName(materielDetails);
//     }
    
//     // Fallback sur les données de l'incident
//     if (incident.materiel_nom) {
//       return incident.materiel_nom;
//     }
    
//     if (incident.materiel) {
//       return `Matériel #${incident.materiel}`;
//     }
    
//     return 'Non spécifié';
//   };

//   // Fonction pour vérifier si un matériel est en panne
//   const getMaterielPanneStatus = (incident: any, materielsList: Materiel[]): boolean => {
//     const materielDetails = getMaterielDetails(incident, materielsList);
//     return isMaterielEnPanne(materielDetails);
//   };

//   const fetchIncidents = async () => {
//     try {
//       setLoading(true);
//       console.log('🔄 Chargement des incidents...');
      
//       // Charger les incidents avec plus de détails
//       const response = await incidentsAPI.getAll();
//       console.log('📥 Réponse incidents brute:', response);
      
//       const extractedData = extractDataFromResponse(response);
//       console.log(`✅ ${extractedData.length} incidents chargés`);
      
//       // Formater les incidents avec les détails complets
//       const formattedIncidents: FormattedIncident[] = await Promise.all(
//         extractedData.map(async (incident: any) => {
//           console.log(`🔍 Traitement incident ${incident.id}:`, incident);
          
//           // Récupérer les détails complets
//           let materielDetails = null;
//           let signaleurDetails = null;
          
//           try {
//             // Si on a un ID de matériel, récupérer les détails
//             if (incident.materiel) {
//               console.log(`🔧 Recherche matériel ${incident.materiel} pour incident ${incident.id}`);
//             }
            
//             // Si on a un ID de signaleur, récupérer les détails
//             if (incident.utilisateur_signaleur) {
//               console.log(`👤 Recherche signaleur ${incident.utilisateur_signaleur} pour incident ${incident.id}`);
//             }
//           } catch (err) {
//             console.error(`❌ Erreur récupération détails incident ${incident.id}:`, err);
//           }
          
//           const formattedIncident: FormattedIncident = {
//             id: incident.id || 0,
//             description: incident.description || '',
//             type_incident: incident.type_incident || 'materiel',
//             priorite: incident.priorite || 'moyenne',
//             statut: incident.statut || 'ouvert',
//             date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
//             date_resolution: incident.date_resolution || null,
//             utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
//             materiel: incident.materiel || null,
//             logiciel: incident.logiciel || null,
//             reseau: incident.reseau || null,
            
//             // Données formatées
//             utilisateur_nom: getSignaleurName(incident),
//             materiel_nom: getMaterielDisplayName(incident, materiels),
//             materiel_details: getMaterielDetails(incident, materiels),
//             signaleur_details: incident.utilisateur_signaleur_details || incident.signaleur_details || incident.user_details
//           };
          
//           console.log(`📄 Incident ${incident.id} formaté:`, formattedIncident);
//           return formattedIncident;
//         })
//       );
      
//       const activeOnes = filterActiveIncidents(formattedIncidents);
//       setActiveIncidents(activeOnes);
      
//       // Trouver les matériels en panne liés aux incidents actifs
//       const panneMateriels = materiels.filter(materiel => {
//         const materielId = materiel.id;
        
//         // Vérifier si le matériel est lié à un incident actif
//         const hasActiveIncident = formattedIncidents.some(incident => 
//           (incident.materiel === materielId || incident.materiel_details?.id === materielId) &&
//           (incident.statut === 'ouvert' || incident.statut === 'en_cours')
//         );
        
//         // Vérifier l'état du matériel
//         const isEnPanne = isMaterielEnPanne(materiel);
        
//         return hasActiveIncident || isEnPanne;
//       });
      
//       setMaterielsEnPanne(panneMateriels);
      
//       setIncidents(formattedIncidents);
//       setFilteredIncidents(formattedIncidents);
//       setError('');
      
//       if (formattedIncidents.length === 0) {
//         showMessage('info', 'Aucun incident trouvé');
//       } else {
//         console.log('📊 Statistiques incidents:');
//         console.log(`   Total: ${formattedIncidents.length}`);
//         console.log(`   Actifs: ${activeOnes.length}`);
//         console.log(`   Matériels en panne: ${panneMateriels.length}`);
//       }
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement incidents:', err);
//       const errorMsg = handleApiError(err);
//       setError(errorMsg);
//       showMessage('error', errorMsg);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchRelatedData = async () => {
//     try {
//       console.log('🔄 Chargement des données liées...');
      
//       const [materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
//         materielsAPI.getAll(),
//         logicielsAPI.getAll(),
//         reseauAPI.getAll()
//       ]);
      
//       let materielsData: Materiel[] = [];
//       if (materielsRes.status === 'fulfilled') {
//         materielsData = extractDataFromResponse(materielsRes.value);
//         console.log(`✅ ${materielsData.length} matériels chargés`);
        
//         // Log les premiers matériels pour debug
//         materielsData.slice(0, 3).forEach((m: any, i: number) => {
//           console.log(`   Matériel ${i+1}: ID=${m.id}, Nom=${m.nom}, État=${m.etat}`);
//         });
//       }
      
//       let logicielsData: Logiciel[] = [];
//       if (logicielsRes.status === 'fulfilled') {
//         logicielsData = extractDataFromResponse(logicielsRes.value);
//         console.log(`✅ ${logicielsData.length} logiciels chargés`);
//       }
      
//       let reseauxData: Reseau[] = [];
//       if (reseauxRes.status === 'fulfilled') {
//         reseauxData = extractDataFromResponse(reseauxRes.value);
//         console.log(`✅ ${reseauxData.length} réseaux chargés`);
//       }
      
//       setMateriels(materielsData);
//       setLogiciels(logicielsData);
//       setReseaux(reseauxData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement données liées:', err);
//     }
//   };

//   useEffect(() => {
//     const loadInitialData = async () => {
//       await fetchRelatedData(); // D'abord charger les matériels
//       await fetchIncidents();   // Puis charger les incidents
//     };
    
//     loadInitialData();
//   }, []);

//   // Rafraîchir les incidents quand les matériels changent
//   useEffect(() => {
//     if (materiels.length > 0 && incidents.length > 0) {
//       console.log('🔄 Mise à jour des incidents avec les nouveaux matériels');
//       fetchIncidents();
//     }
//   }, [materiels]);

//   useEffect(() => {
//     filterIncidents();
//   }, [incidents, searchTerm, filterStatut, filterPriorite, filterType, showActiveOnly]);

//   useEffect(() => {
//     if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedIncidents, filteredIncidents]);

//   const filterIncidents = () => {
//     let filtered = showActiveOnly ? activeIncidents : safeArray<FormattedIncident>(incidents);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter<FormattedIncident>(filtered, incident => 
//         (incident.description?.toLowerCase() || '').includes(searchLower) ||
//         (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
//         (incident.logiciel_nom?.toLowerCase() || '').includes(searchLower) ||
//         (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
//       );
//     }

//     if (filterStatut) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
//     }

//     if (filterPriorite) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
//     }

//     if (filterType) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
//     }

//     setFilteredIncidents(filtered);
//     setSelectedIncidents([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Gestion de la réparation
//   const handleReparationSubmit = async (reparationData: any) => {
//     try {
//       console.log('🛠️ Création de réparation:', reparationData);
      
//       // 1. Créer la réparation
//       await reparationsAPI.create(reparationData);
      
//       // 2. Marquer l'incident comme résolu
//       if (incidentToRepair && incidentToRepair.id) {
//         await incidentsAPI.resoudre(incidentToRepair.id);
        
//         showMessage('success', 
//           `✅ Réparation créée avec succès!\n` +
//           `📋 L'incident #${incidentToRepair.id} a été automatiquement marqué comme résolu.`
//         );
//       } else {
//         showMessage('success', 'Réparation créée avec succès!');
//       }
      
//       // 3. Rafraîchir les données
//       await Promise.all([
//         fetchIncidents(),
//         fetchRelatedData()
//       ]);
      
//       // 4. Fermer le formulaire
//       setIsRepairFormOpen(false);
//       setIncidentToRepair(null);
//       setMaterielToRepair(null);
      
//     } catch (error: any) {
//       console.error('❌ Erreur création réparation:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   // Lancer la réparation immédiate
//   const handleRepairImmediate = (incident: FormattedIncident) => {
//     console.log('🔧 Réparation immédiate pour incident:', incident);
    
//     setIncidentToRepair(incident);
    
//     // Trouver le matériel lié à l'incident
//     if (incident.materiel && materiels.length > 0) {
//       const materiel = materiels.find(m => m.id === incident.materiel);
//       if (materiel) {
//         setMaterielToRepair(materiel);
//       }
//     }
    
//     setIsRepairFormOpen(true);
//   };

//   // Lancer la réparation depuis un matériel en panne
//   const handleRepairMateriel = (materiel: Materiel) => {
//     console.log('🔧 Réparation pour matériel en panne:', materiel);
    
//     // Trouver un incident actif lié à ce matériel
//     const incidentLie = incidents.find(incident => 
//       incident.materiel === materiel.id && 
//       (incident.statut === 'ouvert' || incident.statut === 'en_cours')
//     );
    
//     if (incidentLie) {
//       setIncidentToRepair(incidentLie);
//     }
    
//     setMaterielToRepair(materiel);
//     setIsRepairFormOpen(true);
//   };

//   const handleSubmit = async (incidentData: any) => {
//     try {
//       console.log('📤 Soumission incident:', incidentData);
      
//       const currentUser = getCurrentUser();
      
//       const formattedData: any = {
//         description: incidentData.description,
//         type_incident: incidentData.type_incident,
//         priorite: incidentData.priorite,
//         statut: incidentData.statut,
//         utilisateur_signaleur: currentUser.id
//       };
      
//       if (incidentData.date_creation) {
//         formattedData.date_creation = incidentData.date_creation;
//       } else if (editingIncident && editingIncident.date_creation) {
//         formattedData.date_creation = editingIncident.date_creation;
//       }
      
//       if (incidentData.date_resolution) {
//         formattedData.date_resolution = incidentData.date_resolution;
//       }
      
//       if (incidentData.materiel && incidentData.materiel > 0) {
//         formattedData.materiel = incidentData.materiel;
//       }
//       if (incidentData.logiciel && incidentData.logiciel > 0) {
//         formattedData.logiciel = incidentData.logiciel;
//       }
//       if (incidentData.reseau && incidentData.reseau > 0) {
//         formattedData.reseau = incidentData.reseau;
//       }
      
//       console.log('📤 Données envoyées à l\'API:', formattedData);
      
//       if (editingIncident && editingIncident.id) {
//         await incidentsAPI.update(editingIncident.id, formattedData);
//         showMessage('success', 'Incident modifié avec succès');
//       } else {
//         await incidentsAPI.create(formattedData);
//         showMessage('success', 'Incident créé avec succès');
//       }
      
//       await fetchIncidents();
//       setIsFormOpen(false);
//       setEditingIncident(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur soumission incident:', error);
//       const errorMsg = handleApiError(error);
//       showMessage('error', errorMsg);
//     }
//   };

//   const toggleSelectIncident = (id: number) => {
//     setSelectedIncidents(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedIncidents([]);
//     } else {
//       const allIds = filteredIncidents
//         .map(i => i.id)
//         .filter((id): id is number => id !== undefined);
//       setSelectedIncidents(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIncidents.length} incident(s) ?`)) {
//       try {
//         const deletePromises = selectedIncidents.map(id => 
//           incidentsAPI.delete(id).catch(err => {
//             console.error(`Erreur suppression incident ${id}:`, err);
//             return null;
//           })
//         );
        
//         await Promise.all(deletePromises);
        
//         showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
//         setSelectedIncidents([]);
//         await fetchIncidents();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression incidents:', error);
//         showMessage('error', handleApiError(error));
//       }
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     if (selectedIncidents.length === 1) {
//       const incident = incidents.find(i => i.id === selectedIncidents[0]);
//       if (incident) {
//         handleEdit(incident);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedIncidents.length} incidents`);
//     }
//   };

//   const handleResoudreSelected = async () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     try {
//       const resolvePromises = selectedIncidents.map(id => 
//         incidentsAPI.resoudre(id).catch(err => {
//           console.error(`Erreur résolution incident ${id}:`, err);
//           return null;
//         })
//       );
      
//       await Promise.all(resolvePromises);
      
//       showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
//       setSelectedIncidents([]);
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incidents:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const handleEdit = (incident: FormattedIncident) => {
//     console.log('✏️ Édition incident:', incident);
//     setEditingIncident(incident);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
//       try {
//         await incidentsAPI.delete(id);
//         showMessage('success', 'Incident supprimé avec succès');
//         await fetchIncidents();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression incident:', error);
//         showMessage('error', handleApiError(error));
//       }
//     }
//   };

//   const handleResoudre = async (id: number) => {
//     try {
//       await incidentsAPI.resoudre(id);
//       showMessage('success', 'Incident marqué comme résolu');
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incident:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const handleAddNew = () => {
//     setEditingIncident(undefined);
//     setIsFormOpen(true);
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchIncidents();
//     await fetchRelatedData();
//     showMessage('success', 'Données rafraîchies');
//   };

//   const getPriorityBadge = (priority: string) => {
//     const badges: Record<string, string> = {
//       critique: 'badge-error',
//       elevee: 'badge-warning',
//       moyenne: 'badge-info',
//       basse: 'badge-success'
//     };
//     return badges[priority] || 'badge-neutral';
//   };

//   const getPriorityText = (priority: string) => {
//     const texts: Record<string, string> = {
//       critique: 'Critique',
//       elevee: 'Élevée',
//       moyenne: 'Moyenne',
//       basse: 'Basse'
//     };
//     return texts[priority] || priority;
//   };

//   const getStatusBadge = (status: string) => {
//     const badges: Record<string, string> = {
//       ouvert: 'badge-warning',
//       en_cours: 'badge-info',
//       resolu: 'badge-success',
//       ferme: 'badge-neutral'
//     };
//     return badges[status] || 'badge-neutral';
//   };

//   const getStatusText = (status: string) => {
//     const texts: Record<string, string> = {
//       ouvert: 'Ouvert',
//       en_cours: 'En cours',
//       resolu: 'Résolu',
//       ferme: 'Fermé'
//     };
//     return texts[status] || status;
//   };

//   const getTypeText = (type: string) => {
//     const texts: Record<string, string> = {
//       materiel: 'Matériel',
//       logiciel: 'Logiciel',
//       reseau: 'Réseau',
//       mixte: 'Mixte'
//     };
//     return texts[type] || type;
//   };

//   // Fonction pour afficher la source de l'incident
//   const displayIncidentSource = (incident: FormattedIncident): string => {
//     const sources: string[] = [];
    
//     if (incident.materiel_nom && incident.materiel_nom !== 'Non spécifié') {
//       const isPanne = getMaterielPanneStatus(incident, materiels);
//       sources.push(`${isPanne ? '⚠️ ' : ''}${incident.materiel_nom}`);
//     }
    
//     if (incident.type_incident === 'logiciel') {
//       sources.push('Logiciel');
//     }
    
//     if (incident.type_incident === 'reseau') {
//       sources.push('Réseau');
//     }
    
//     if (incident.type_incident === 'mixte') {
//       sources.push('Mixte');
//     }
    
//     return sources.length > 0 ? sources.join(' | ') : 'Source non spécifiée';
//   };

//   // Statistiques améliorées
//   const stats = {
//     total: safeArray<FormattedIncident>(incidents).length,
//     ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
//     en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
//     resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu').length,
//     actifs: activeIncidents.length,
//     materielsPanne: materielsEnPanne.length
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des incidents...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4 shadow-lg`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4 shadow-lg">
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button 
//             className="btn btn-sm btn-ghost"
//             onClick={handleRefresh}
//           >
//             <RefreshCw className="h-4 w-4" />
//             Réessayer
//           </button>
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             Suivi et résolution des incidents techniques ({safeArray<FormattedIncident>(filteredIncidents).length} incidents)
//             {selectedIncidents.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedIncidents.length} sélectionné(s))
//               </span>
//             )}
//             {showActiveOnly && (
//               <span className="text-warning font-semibold ml-2">
//                 🔧 Affichage actifs seulement
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
//             disabled={filteredIncidents.length === 0}
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvel incident
//           </button>
//         </div>
//       </div>

//       {/* Statistiques améliorées */}
//       <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
//                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
//               </div>
//               <div className="text-2xl">📊</div>
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Ouverts</p>
//                 <p className="text-2xl font-bold text-orange-600">{stats.ouvert}</p>
//               </div>
//               <AlertTriangle className="w-6 h-6 text-orange-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">En cours</p>
//                 <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
//               </div>
//               <Clock className="w-6 h-6 text-blue-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Résolus</p>
//                 <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
//               </div>
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-warning/10 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">
//                   {autoRepairMode ? '🔄 En réparation' : '⚠️ Actifs'}
//                 </p>
//                 <p className="text-2xl font-bold text-warning">{stats.actifs}</p>
//                 {stats.actifs > 0 && (
//                   <div className="text-xs mt-1 opacity-70">
//                     {stats.ouvert} ouverts
//                   </div>
//                 )}
//               </div>
//               <Wrench className="w-6 h-6 text-warning" />
//             </div>
//             {stats.actifs > 0 && (
//               <div className="mt-2">
//                 <button
//                   onClick={toggleActiveOnly}
//                   className="btn btn-warning btn-xs w-full mt-1"
//                 >
//                   {showActiveOnly ? 'Voir tous' : 'Voir actifs'}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
        
//         <div className="card bg-error/10 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">
//                   🔥 En panne
//                 </p>
//                 <p className="text-2xl font-bold text-error">{stats.materielsPanne}</p>
//                 {stats.materielsPanne > 0 && (
//                   <div className="text-xs mt-1 opacity-70">
//                     Matériels à réparer
//                   </div>
//                 )}
//               </div>
//               <Cpu className="w-6 h-6 text-error" />
//             </div>
//             {stats.materielsPanne > 0 && (
//               <div className="mt-2">
//                 <button
//                   onClick={() => setAutoRepairMode(true)}
//                   className="btn btn-error btn-xs w-full mt-1"
//                 >
//                   Voir en panne
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Section des matériels en panne */}
//       {materielsEnPanne.length > 0 && (
//         <div className="card bg-error/10 shadow-xl mb-6 border border-error/20">
//           <div className="card-body">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <Cpu className="h-6 w-6 text-error" />
//                 <h3 className="text-lg font-bold text-error">🚨 Matériels en Panne</h3>
//                 <span className="badge badge-error badge-lg">{materielsEnPanne.length}</span>
//               </div>
//               <button
//                 onClick={() => {
//                   if (materielsEnPanne.length > 0) {
//                     handleRepairMateriel(materielsEnPanne[0]);
//                   }
//                 }}
//                 className="btn btn-error btn-sm"
//               >
//                 <Wrench className="h-4 w-4 mr-2" />
//                 Réparer le premier
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {materielsEnPanne.slice(0, 3).map((materiel) => {
//                 const incidentsLie = incidents.filter(incident => 
//                   incident.materiel === materiel.id && 
//                   (incident.statut === 'ouvert' || incident.statut === 'en_cours')
//                 );
                
//                 return (
//                   <div 
//                     key={materiel.id}
//                     className="card bg-error/5 border border-error/20 hover:border-error/40 transition-colors cursor-pointer"
//                     onClick={() => handleRepairMateriel(materiel)}
//                   >
//                     <div className="card-body p-4">
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center gap-3">
//                           <Monitor className="h-5 w-5 text-error" />
//                           <div>
//                             <h4 className="font-bold text-base-content">
//                               {materiel.nom || materiel.libelle || `Matériel #${materiel.id}`}
//                             </h4>
//                             {materiel.reference && (
//                               <p className="text-sm text-base-content opacity-70">
//                                 Réf: {materiel.reference}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                         {incidentsLie.length > 0 && (
//                           <span className="badge badge-error badge-sm">
//                             {incidentsLie.length} incident(s)
//                           </span>
//                         )}
//                       </div>
                      
//                       <div className="mt-3">
//                         <div className="flex items-center gap-2">
//                           <span className="text-xs font-medium">État:</span>
//                           <span className="badge badge-error badge-sm">
//                             {materiel.etat || 'En panne'}
//                           </span>
//                         </div>
                        
//                         {incidentsLie.length > 0 && (
//                           <div className="mt-2">
//                             <p className="text-xs font-medium text-error">Incidents liés:</p>
//                             <div className="space-y-1 mt-1">
//                               {incidentsLie.slice(0, 2).map(incident => (
//                                 <div 
//                                   key={incident.id}
//                                   className="text-xs bg-error/10 p-2 rounded border border-error/20"
//                                 >
//                                   <div className="flex justify-between">
//                                     <span className="font-medium">#{incident.id}</span>
//                                     <span className={`badge ${incident.priorite === 'critique' ? 'badge-error' : 'badge-warning'} badge-xs`}>
//                                       {getPriorityText(incident.priorite)}
//                                     </span>
//                                   </div>
//                                   <p className="truncate">{incident.description}</p>
//                                 </div>
//                               ))}
//                               {incidentsLie.length > 2 && (
//                                 <div className="text-xs text-center text-error">
//                                   +{incidentsLie.length - 2} autres...
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
                        
//                         <button
//                           className="btn btn-error btn-xs w-full mt-3"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleRepairMateriel(materiel);
//                           }}
//                         >
//                           <Wrench className="h-3 w-3 mr-1" />
//                           Réparer maintenant
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
              
//               {materielsEnPanne.length > 3 && (
//                 <div className="md:col-span-3 text-center pt-2">
//                   <button
//                     onClick={() => setAutoRepairMode(true)}
//                     className="btn btn-outline btn-error btn-sm"
//                   >
//                     Voir tous les {materielsEnPanne.length} matériels en panne
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filtres et actions */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Description, matériel, signaleur..."
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
//                 <option value="ouvert">Ouvert</option>
//                 <option value="en_cours">En cours</option>
//                 <option value="resolu">Résolu</option>
//                 <option value="ferme">Fermé</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">⚠️ Priorité</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterPriorite}
//                 onChange={(e) => setFilterPriorite(e.target.value)}
//               >
//                 <option value="">Toutes les priorités</option>
//                 <option value="critique">Critique</option>
//                 <option value="elevee">Élevée</option>
//                 <option value="moyenne">Moyenne</option>
//                 <option value="basse">Basse</option>
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
//                 <option value="materiel">Matériel</option>
//                 <option value="logiciel">Logiciel</option>
//                 <option value="reseau">Réseau</option>
//                 <option value="mixte">Mixte</option>
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
//                 <span className="label-text">🔧 Réparation</span>
//               </label>
//               <div className="flex flex-col gap-2">
//                 <button
//                   onClick={toggleAutoRepairMode}
//                   className={`btn btn-sm w-full ${autoRepairMode ? 'btn-warning' : 'btn-outline'}`}
//                 >
//                   {autoRepairMode ? '🔄 Auto ON' : 'Auto réparation'}
//                 </button>
//                 {activeIncidents.length > 0 && (
//                   <button
//                     onClick={markAllActiveForRepair}
//                     className="btn btn-warning btn-sm w-full"
//                     disabled={autoRepairMode}
//                   >
//                     Marquer pour réparation
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {activeIncidents.length > 0 && (
//             <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
//               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-warning">
//                       ⚠️ {activeIncidents.length} incident(s) actif(s)
//                     </span>
//                   </div>
//                   <div className="text-sm opacity-70">
//                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts, 
//                     {' '}{safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'en_cours').length} en cours
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={markAllActiveForRepair}
//                     className="btn btn-warning btn-sm gap-2"
//                   >
//                     <CheckSquare className="h-4 w-4" />
//                     Tout marquer en réparation
//                   </button>
//                   <button
//                     onClick={resolveLongDurationIncidents}
//                     className="btn btn-outline btn-sm gap-2"
//                     title="Résoudre les incidents en cours depuis plus de 7 jours"
//                   >
//                     <Clock className="h-4 w-4" />
//                     Nettoyer anciens
//                   </button>
//                 </div>
//               </div>
              
//               {autoRepairMode && (
//                 <div className="mt-3 pt-3 border-t border-warning/20">
//                   <div className="text-sm font-medium text-warning mb-2">
//                     🛠️ Prêts pour réparation immédiate:
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {activeIncidents.slice(0, 5).map(incident => {
//                       const isMaterielPanne = getMaterielPanneStatus(incident, materiels);
//                       return (
//                         <div 
//                           key={incident.id} 
//                           className={`badge badge-lg gap-1 cursor-pointer hover:badge-outline ${isMaterielPanne ? 'badge-error' : 'badge-warning'}`}
//                           onClick={() => handleRepairImmediate(incident)}
//                           title={`${isMaterielPanne ? '🚨 Matériel en panne - ' : ''}Cliquer pour réparer: ${incident.description}`}
//                         >
//                           <span>#{incident.id}</span>
//                           <span className="font-bold">{getPriorityText(incident.priorite)}</span>
//                           {isMaterielPanne && <span className="ml-1">🔥</span>}
//                         </div>
//                       );
//                     })}
//                     {activeIncidents.length > 5 && (
//                       <div className="badge badge-ghost">
//                         +{activeIncidents.length - 5} autres...
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {selectedIncidents.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedIncidents.length} incident(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={handleResoudreSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Résoudre ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedIncidents([])}
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

//       {/* Tableau des incidents */}
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
//                         disabled={filteredIncidents.length === 0}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-5 w-5 text-primary" />
//                         ) : (
//                           <Square className="h-5 w-5 text-base-content/40" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th className="font-bold">Description</th>
//                   <th className="font-bold">Type / Source</th>
//                   <th className="font-bold">Priorité</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold">Date création</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray<FormattedIncident>(filteredIncidents).map((incident) => {
//                   const isMaterielPanne = getMaterielPanneStatus(incident, materiels);
//                   const materielDetails = getMaterielDetails(incident, materiels);
                  
//                   return (
//                     <tr key={incident.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedIncidents.includes(incident.id || 0)}
//                             onChange={() => toggleSelectIncident(incident.id || 0)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="max-w-xs">
//                           <div className="font-medium text-base-content line-clamp-2">
//                             {incident.description}
//                           </div>
                          
//                           {/* Informations du signaleur */}
//                           <div className="text-sm text-base-content opacity-70 mt-1 flex items-center gap-1">
//                             <User className="h-3 w-3" />
//                             <span className="font-medium">Signaleur:</span> 
//                             <span className="ml-1">
//                               {incident.utilisateur_nom || 'Non spécifié'}
//                             </span>
//                           </div>
                          
//                           {/* Informations du matériel */}
//                           {incident.materiel_nom && incident.materiel_nom !== 'Non spécifié' && (
//                             <div className={`text-sm ${isMaterielPanne ? 'text-error font-semibold' : 'text-base-content opacity-70'} mt-1 flex items-center gap-1`}>
//                               <Monitor className={`h-3 w-3 ${isMaterielPanne ? 'text-error' : ''}`} />
//                               <span className="font-medium">Matériel:</span> 
//                               <span className="ml-1">
//                                 {incident.materiel_nom}
//                                 {isMaterielPanne && ' 🔥'}
//                               </span>
//                               {materielDetails?.reference && (
//                                 <span className="text-xs ml-2 opacity-60">
//                                   (Réf: {materielDetails.reference})
//                                 </span>
//                               )}
//                             </div>
//                           )}
                          
//                           {/* Informations du logiciel */}
//                           {incident.logiciel_nom && incident.logiciel_nom !== 'Non spécifié' && (
//                             <div className="text-sm text-base-content opacity-70 mt-1 flex items-center gap-1">
//                               <Cpu className="h-3 w-3" />
//                               <span className="font-medium">Logiciel:</span> 
//                               <span className="ml-1">{incident.logiciel_nom}</span>
//                             </div>
//                           )}
                          
//                           {/* Informations réseau */}
//                           {incident.type_incident === 'reseau' && (
//                             <div className="text-sm text-base-content opacity-70 mt-1 flex items-center gap-1">
//                               <Server className="h-3 w-3" />
//                               <span className="font-medium">Réseau</span>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="space-y-1">
//                           <span className="text-sm font-medium capitalize">
//                             {getTypeText(incident.type_incident)}
//                           </span>
//                           <div className="text-xs text-base-content opacity-70">
//                             {displayIncidentSource(incident)}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg ${(incident.statut === 'ouvert' || incident.statut === 'en_cours') ? 'badge-outline' : ''}`}>
//                           {getPriorityText(incident.priorite)}
//                           {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && incident.priorite === 'critique' && (
//                             <span className="ml-1">🔥</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex items-center gap-2">
//                           {getStatusIcon(incident.statut)}
//                           <div className={`badge ${getStatusBadge(incident.statut)}`}>
//                             {getStatusText(incident.statut)}
//                           </div>
//                           {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && (
//                             <span className="text-xs text-warning font-semibold">
//                               🔧
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm font-medium">
//                           {incident.date_creation ? new Date(incident.date_creation).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                         <div className="text-xs text-base-content opacity-60 mt-1">
//                           {incident.date_creation ? new Date(incident.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
//                             title="Voir les détails"
//                             onClick={() => {
//                               showMessage('info', 
//                                 `Détails de l'incident #${incident.id}\n` +
//                                 `Signaleur: ${incident.utilisateur_nom}\n` +
//                                 `Matériel: ${incident.materiel_nom}\n` +
//                                 `Priorité: ${getPriorityText(incident.priorite)}\n` +
//                                 `Statut: ${getStatusText(incident.statut)}`
//                               );
//                             }}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleEdit(incident)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {/* Bouton Réparer immédiatement */}
//                           {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
//                             <button
//                               onClick={() => handleRepairImmediate(incident)}
//                               className={`btn btn-ghost btn-sm btn-square ${isMaterielPanne ? 'text-error hover:bg-error/10' : 'text-warning hover:bg-warning/10'}`}
//                               title={`${isMaterielPanne ? '🚨 Matériel en panne - ' : ''}Réparer immédiatement`}
//                             >
//                               <Wrench className="h-4 w-4" />
//                             </button>
//                           )}
//                           {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
//                             <button
//                               onClick={() => handleResoudre(incident.id || 0)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Marquer comme résolu"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(incident.id || 0)}
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

//           {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Search className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucun incident trouvé</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterStatut || filterPriorite || filterType || showActiveOnly
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucun incident n'est enregistré dans le système"
//                   }
//                 </p>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-primary btn-sm mt-4"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Créer le premier incident
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'incident */}
//       <IncidentForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingIncident(undefined);
//         }}
//         onSubmit={handleSubmit}
//         incident={editingIncident}
//         currentUser={getCurrentUser()}
//       />

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isRepairFormOpen}
//         onClose={() => {
//           setIsRepairFormOpen(false);
//           setIncidentToRepair(null);
//           setMaterielToRepair(null);
//         }}
//         onSubmit={handleReparationSubmit}
//         incidentSource={incidentToRepair}
//         materielSource={materielToRepair}
//         materiels={materiels}
//         incidents={incidents}
//       />
//     </div>
//   );
// };

// export default Incidents;




// // Incidents.tsx - Version corrigée pour récupération signaleurs + matériels en panne
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Eye, 
//   Filter, 
//   Download, 
//   Edit, 
//   Trash2, 
//   CheckSquare, 
//   Square, 
//   X, 
//   AlertTriangle, 
//   Clock, 
//   CheckCircle,
//   RefreshCw,
//   Wrench,
//   User,
//   Server,
//   Monitor,
//   Cpu
// } from 'lucide-react';
// import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
// import api, { incidentsAPI, materielsAPI,reparationsAPI, handleApiError } from '../services/api';
// import IncidentForm from '../components/IncidentForm';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Type pour les incidents formatés
// interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom' | 'logiciel_nom'> {
//   utilisateur_nom?: string;
//   materiel_nom?: string;
//   logiciel_nom?: string;
//   materiel_details?: any;
//   signaleur_details?: any;
// }

// // Fonctions helper
// const safeArray = <T,>(data: any): T[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data as T[];
//   if (data.results && Array.isArray(data.results)) return data.results as T[];
//   if (data.data && Array.isArray(data.data)) return data.data as T[];
//   return [];
// };

// const safeFilter = <T,>(array: T[], condition: (item: T) => boolean): T[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
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

// // Fonction pour récupérer les détails d'un utilisateur depuis l'API
// const fetchUserDetails = async (userId: number): Promise<any> => {
//   try {
//     console.log(`👤 Récupération des détails de l'utilisateur #${userId}`);
//     const response = await api.get(`/users/${userId}/`);
//     console.log(`✅ Détails utilisateur #${userId}:`, response.data);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Erreur récupération utilisateur #${userId}:`, error);
//     return null;
//   }
// };

// // Fonction pour formater le nom d'un utilisateur
// const formatUserName = (user: any): string => {
//   if (!user) return 'Non spécifié';
  
//   console.log('📝 Formatage utilisateur:', user);
  
//   // Essayer différentes combinaisons
//   if (user.first_name && user.last_name) {
//     return `${user.first_name} ${user.last_name}`;
//   }
  
//   if (user.nom && user.prenom) {
//     return `${user.prenom} ${user.nom}`;
//   }
  
//   if (user.nom_complet) {
//     return user.nom_complet;
//   }
  
//   if (user.username) {
//     return user.username;
//   }
  
//   if (user.email) {
//     return user.email.split('@')[0];
//   }
  
//   if (user.id) {
//     return `Utilisateur #${user.id}`;
//   }
  
//   return 'Non spécifié';
// };

// // Fonction pour vérifier si un matériel est en panne
// const isMaterielEnPanne = (materiel: any): boolean => {
//   if (!materiel) return false;
  
//   const etat = (materiel.etat || '').toLowerCase().trim();
//   const statut = (materiel.statut || '').toLowerCase().trim();
  
//   const etatsPanne = [
//     'en_panne',
//     'en panne',
//     'panne',
//     'broken',
//     'out of order',
//     'hors service',
//     'defective',
//     'faulty'
//   ];
  
//   return etatsPanne.some(panneEtat => 
//     etat.includes(panneEtat) || statut.includes(panneEtat)
//   );
// };

// // Fonction pour formater le nom d'un matériel
// const formatMaterielName = (materiel: any): string => {
//   if (!materiel) return 'Matériel inconnu';
  
//   if (materiel.nom) {
//     return materiel.nom;
//   }
  
//   if (materiel.libelle) {
//     return materiel.libelle;
//   }
  
//   if (materiel.reference) {
//     return `Réf: ${materiel.reference}`;
//   }
  
//   if (materiel.id) {
//     return `Matériel #${materiel.id}`;
//   }
  
//   return 'Matériel non spécifié';
// };

// const Incidents: React.FC = () => {
//   const { user: authUser } = useAuth();
  
//   const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
//   const [reseaux, setReseaux] = useState<Reseau[]>([]);
//   const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
//   const [activeIncidents, setActiveIncidents] = useState<FormattedIncident[]>([]);
//   const [materielsEnPanne, setMaterielsEnPanne] = useState<Materiel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterPriorite, setFilterPriorite] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingIncident, setEditingIncident] = useState<FormattedIncident | undefined>();
//   const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
//   const [autoRepairMode, setAutoRepairMode] = useState<boolean>(false);
  
//   // États pour réparation
//   const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);
//   const [incidentToRepair, setIncidentToRepair] = useState<FormattedIncident | null>(null);

//   const getCurrentUser = (): UserType => {
//     console.log('👤 Récupération utilisateur depuis Auth:', authUser);
    
//     if (authUser) {
//       return {
//         id: authUser.id || 0,
//         username: authUser.username || '',
//         first_name: authUser.first_name || '',
//         last_name: authUser.last_name || '',
//         email: authUser.email || '',
//         is_active: authUser.is_active !== false,
//         date_joined: authUser.date_joined || new Date().toISOString(),
//         role: authUser.role,
//         departement: authUser.departement || '',
//         telephone: authUser.telephone || ''
//       };
//     }
    
//     try {
//       const userStr = localStorage.getItem('user');
//       if (userStr) {
//         const user = JSON.parse(userStr);
//         return {
//           id: user.id || 0,
//           username: user.username || '',
//           first_name: user.first_name || '',
//           last_name: user.last_name || '',
//           email: user.email || '',
//           is_active: user.is_active !== false,
//           date_joined: user.date_joined || new Date().toISOString(),
//           role: user.role,
//           departement: user.departement || ''
//         };
//       }
//     } catch (e) {
//       console.error('Erreur parsing user:', e);
//     }
    
//     return {
//       id: 0,
//       username: 'utilisateur',
//       first_name: 'Utilisateur',
//       last_name: 'Inconnu',
//       email: 'user@example.com',
//       is_active: true,
//       date_joined: new Date().toISOString(),
//       role: 'user',
//       departement: ''
//     };
//   };

//   const filterActiveIncidents = (incidentsList: FormattedIncident[]): FormattedIncident[] => {
//     return safeFilter<FormattedIncident>(
//       incidentsList, 
//       i => i.statut === 'ouvert' || i.statut === 'en_cours'
//     );
//   };

//   // Fonction améliorée pour récupérer le nom du signaleur
//   const getSignaleurName = async (incident: any): Promise<string> => {
//     if (!incident) return 'Non spécifié';
    
//     console.log(`🔍 Recherche signaleur pour incident ${incident.id}:`, incident);
    
//     // Liste des sources possibles dans l'ordre de priorité
//     const sources = [
//       // 1. Données directes dans l'incident
//       incident.utilisateur_nom,
//       incident.signaleur_nom,
//       incident.signaleur_prenom && incident.signaleur_nom 
//         ? `${incident.signaleur_prenom} ${incident.signaleur_nom}`
//         : null,
//       incident.signaleur_nom_complet,
      
//       // 2. Détails du signaleur déjà présents
//       incident.utilisateur_signaleur_details 
//         ? formatUserName(incident.utilisateur_signaleur_details)
//         : null,
      
//       incident.signaleur_details 
//         ? formatUserName(incident.signaleur_details)
//         : null,
      
//       incident.user_details 
//         ? formatUserName(incident.user_details)
//         : null,
      
//       // 3. Récupérer depuis l'API si on a un ID
//       ...(incident.utilisateur_signaleur ? 
//         [await fetchUserDetails(incident.utilisateur_signaleur).then(user => 
//           user ? formatUserName(user) : null
//         )] 
//         : []),
      
//       // 4. Fallback
//       incident.utilisateur_signaleur 
//         ? `Utilisateur #${incident.utilisateur_signaleur}`
//         : null,
//     ];
    
//     // Prendre la première source valide
//     for (const source of sources) {
//       if (source && source !== 'null' && source !== 'undefined' && source !== 'Non spécifié') {
//         console.log(`✅ Signaleur trouvé pour incident ${incident.id}: ${source}`);
//         return source;
//       }
//     }
    
//     console.log(`❌ Aucun signaleur trouvé pour incident ${incident.id}`);
//     return 'Non spécifié';
//   };

//   // Fonction pour récupérer les détails d'un matériel
//   const getMaterielDetails = (materielId: number): any => {
//     if (!materielId || !materiels.length) return null;
    
//     const materiel = materiels.find(m => m.id === materielId);
//     if (materiel) {
//       console.log(`✅ Matériel ${materielId} trouvé:`, materiel);
//       return materiel;
//     }
    
//     console.log(`❌ Matériel ${materielId} non trouvé`);
//     return null;
//   };

//   // Fonction pour récupérer le nom d'un matériel
//   const getMaterielName = (materielId: number): string => {
//     const materiel = getMaterielDetails(materielId);
    
//     if (materiel) {
//       return formatMaterielName(materiel);
//     }
    
//     return 'Matériel non spécifié';
//   };

//   // Fonction pour vérifier si un matériel lié à un incident est en panne
//   const isIncidentMaterielEnPanne = (incident: any): boolean => {
//     if (!incident || !incident.materiel) return false;
    
//     const materiel = getMaterielDetails(incident.materiel);
//     return isMaterielEnPanne(materiel);
//   };

//   // Fonction pour récupérer le nom précis du matériel en panne
//   const getPanneMaterielName = (incident: any): string => {
//     if (!incident || !incident.materiel) return '';
    
//     const materiel = getMaterielDetails(incident.materiel);
//     if (!materiel) return '';
    
//     const isPanne = isMaterielEnPanne(materiel);
//     if (!isPanne) return '';
    
//     // Retourner le nom formaté du matériel en panne
//     let materielName = formatMaterielName(materiel);
    
//     // Ajouter l'état si disponible
//     if (materiel.etat) {
//       materielName += ` (${materiel.etat})`;
//     }
    
//     return materielName;
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredIncidents.map(i => ({
//         ID: i.id,
//         Description: i.description,
//         Type: getTypeText(i.type_incident),
//         Priorité: getPriorityText(i.priorite),
//         Statut: getStatusText(i.statut),
//         'Matériel concerné': i.materiel_nom || 'Non spécifié',
//         'Logiciel concerné': i.logiciel_nom || 'Non spécifié',
//         'Utilisateur signaleur': i.utilisateur_nom || 'Non spécifié',
//         'Date création': i.date_creation ? new Date(i.date_creation).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Date résolution': i.date_resolution ? new Date(i.date_resolution).toLocaleDateString('fr-FR') : 'Non résolu'
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
//       link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterStatut('');
//     setFilterPriorite('');
//     setFilterType('');
//     setSelectedIncidents([]);
//     setShowActiveOnly(false);
//   };

//   const toggleActiveOnly = () => {
//     setShowActiveOnly(!showActiveOnly);
//   };

//   const toggleAutoRepairMode = () => {
//     setAutoRepairMode(!autoRepairMode);
//   };

//   const markAllActiveForRepair = () => {
//     if (activeIncidents.length === 0) {
//       showMessage('info', 'Aucun incident actif à marquer');
//       return;
//     }
    
//     const activeIds = activeIncidents
//       .map(i => i.id)
//       .filter((id): id is number => id !== undefined);
    
//     setSelectedIncidents(activeIds);
//     showMessage('info', `${activeIncidents.length} incidents actifs sélectionnés pour réparation`);
//   };

//   const resolveLongDurationIncidents = async () => {
//     try {
//       const sevenDaysAgo = new Date();
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
//       const oldActiveIncidents = activeIncidents.filter(incident => {
//         const creationDate = new Date(incident.date_creation || '');
//         return creationDate < sevenDaysAgo;
//       });
      
//       if (oldActiveIncidents.length === 0) {
//         showMessage('info', 'Aucun incident ancien à résoudre');
//         return;
//       }
      
//       const resolvePromises = oldActiveIncidents.map(incident => 
//         incidentsAPI.resoudre(incident.id || 0).catch(err => {
//           console.error(`Erreur résolution incident ${incident.id}:`, err);
//           return null;
//         })
//       );
      
//       await Promise.all(resolvePromises);
      
//       showMessage('success', `${oldActiveIncidents.length} incidents anciens résolus`);
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incidents anciens:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
//       case 'en_cours': return <Clock className="w-4 h-4" />;
//       case 'resolu': return <CheckCircle className="w-4 h-4" />;
//       case 'ferme': return <CheckCircle className="w-4 h-4" />;
//       default: return <AlertTriangle className="w-4 h-4" />;
//     }
//   };

//   const fetchIncidents = async () => {
//     try {
//       setLoading(true);
//       console.log('🔄 Chargement des incidents avec détails des signaleurs...');
      
//       const response = await incidentsAPI.getAll();
//       console.log('📥 Réponse incidents brute:', response);
      
//       const extractedData = extractDataFromResponse(response);
//       console.log(`✅ ${extractedData.length} incidents extraits`);
      
//       // Formater les incidents avec les informations complètes
//       const formattedIncidentsPromises = extractedData.map(async (incident: any) => {
//         try {
//           // 1. Récupérer le nom du signaleur
//           const signaleurNom = await getSignaleurName(incident);
          
//           // 2. Récupérer les détails du matériel
//           const materielDetails = incident.materiel ? getMaterielDetails(incident.materiel) : null;
          
//           // 3. Vérifier si le matériel est en panne
//           const isPanne = isIncidentMaterielEnPanne(incident);
          
//           // 4. Récupérer le nom précis du matériel en panne
//           const panneMaterielName = isPanne ? getPanneMaterielName(incident) : '';
          
//           const formattedIncident: FormattedIncident = {
//             id: incident.id || 0,
//             description: incident.description || '',
//             type_incident: incident.type_incident || 'materiel',
//             priorite: incident.priorite || 'moyenne',
//             statut: incident.statut || 'ouvert',
//             date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
//             date_resolution: incident.date_resolution || null,
//             utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
//             materiel: incident.materiel || null,
//             logiciel: incident.logiciel || null,
//             reseau: incident.reseau || null,
            
//             // Informations formatées
//             utilisateur_nom: signaleurNom,
//             materiel_nom: incident.materiel ? getMaterielName(incident.materiel) : 'Non spécifié',
//             logiciel_nom: incident.logiciel_nom || 'Non spécifié',
//             materiel_details: materielDetails,
//             signaleur_details: incident.utilisateur_signaleur_details || incident.signaleur_details || incident.user_details
//           };
          
//           // Stocker l'information de panne dans un champ personnalisé
//           if (isPanne && panneMaterielName) {
//             formattedIncident.materiel_nom = `🚨 ${panneMaterielName} - EN PANNE`;
//           }
          
//           console.log(`📄 Incident ${incident.id} formaté:`, {
//             id: formattedIncident.id,
//             signaleur: signaleurNom,
//             materiel: formattedIncident.materiel_nom,
//             isPanne: isPanne,
//             panneMaterielName: panneMaterielName
//           });
          
//           return formattedIncident;
//         } catch (error) {
//           console.error(`❌ Erreur formatage incident ${incident.id}:`, error);
//           return null;
//         }
//       });
      
//       const formattedIncidentsResults = await Promise.all(formattedIncidentsPromises);
//       const formattedIncidents = formattedIncidentsResults.filter(inc => inc !== null) as FormattedIncident[];
      
//       // Trouver les incidents actifs
//       const activeOnes = filterActiveIncidents(formattedIncidents);
//       setActiveIncidents(activeOnes);
      
//       // Trouver les matériels en panne
//       const panneMateriels = materiels.filter(materiel => {
//         const isPanne = isMaterielEnPanne(materiel);
        
//         // Vérifier aussi s'il est lié à un incident actif
//         const hasActiveIncident = formattedIncidents.some(incident => 
//           incident.materiel === materiel.id && 
//           (incident.statut === 'ouvert' || incident.statut === 'en_cours')
//         );
        
//         return isPanne || hasActiveIncident;
//       });
      
//       setMaterielsEnPanne(panneMateriels);
      
//       setIncidents(formattedIncidents);
//       setFilteredIncidents(formattedIncidents);
//       setError('');
      
//       if (formattedIncidents.length === 0) {
//         showMessage('info', 'Aucun incident trouvé');
//       } else {
//         console.log('📊 Statistiques:');
//         console.log(`   Total incidents: ${formattedIncidents.length}`);
//         console.log(`   Incidents actifs: ${activeOnes.length}`);
//         console.log(`   Matériels en panne: ${panneMateriels.length}`);
        
//         // Afficher les premiers incidents pour debug
//         formattedIncidents.slice(0, 3).forEach((inc, i) => {
//           console.log(`   Incident ${i+1}: ID=${inc.id}, Signaleur="${inc.utilisateur_nom}", Matériel="${inc.materiel_nom}"`);
//         });
//       }
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement incidents:', err);
//       const errorMsg = handleApiError(err);
//       setError(errorMsg);
//       showMessage('error', errorMsg);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchRelatedData = async () => {
//     try {
//       console.log('🔄 Chargement des données liées...');
      
//       const [materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
//         materielsAPI.getAll(),
//         logicielsAPI.getAll(),
//         reseauAPI.getAll()
//       ]);
      
//       let materielsData: Materiel[] = [];
//       if (materielsRes.status === 'fulfilled') {
//         materielsData = extractDataFromResponse(materielsRes.value);
//         console.log(`✅ ${materielsData.length} matériels chargés`);
        
//         // Log les premiers matériels pour debug
//         materielsData.slice(0, 5).forEach((m: any, i: number) => {
//           console.log(`   Matériel ${i+1}: ID=${m.id}, Nom="${m.nom}", État="${m.etat}", Statut="${m.statut}"`);
//         });
//       }
      
//       let logicielsData: Logiciel[] = [];
//       if (logicielsRes.status === 'fulfilled') {
//         logicielsData = extractDataFromResponse(logicielsRes.value);
//         console.log(`✅ ${logicielsData.length} logiciels chargés`);
//       }
      
//       let reseauxData: Reseau[] = [];
//       if (reseauxRes.status === 'fulfilled') {
//         reseauxData = extractDataFromResponse(reseauxRes.value);
//         console.log(`✅ ${reseauxData.length} réseaux chargés`);
//       }
      
//       setMateriels(materielsData);
//       setLogiciels(logicielsData);
//       setReseaux(reseauxData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement données liées:', err);
//     }
//   };

//   useEffect(() => {
//     const loadInitialData = async () => {
//       await fetchRelatedData();
//       await fetchIncidents();
//     };
    
//     loadInitialData();
//   }, []);

//   // Rafraîchir les incidents quand les matériels changent
//   useEffect(() => {
//     if (materiels.length > 0 && incidents.length > 0) {
//       console.log('🔄 Mise à jour des incidents avec les nouveaux matériels');
//       fetchIncidents();
//     }
//   }, [materiels]);

//   useEffect(() => {
//     filterIncidents();
//   }, [incidents, searchTerm, filterStatut, filterPriorite, filterType, showActiveOnly]);

//   useEffect(() => {
//     if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedIncidents, filteredIncidents]);

//   const filterIncidents = () => {
//     let filtered = showActiveOnly ? activeIncidents : safeArray<FormattedIncident>(incidents);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter<FormattedIncident>(filtered, incident => 
//         (incident.description?.toLowerCase() || '').includes(searchLower) ||
//         (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
//         (incident.logiciel_nom?.toLowerCase() || '').includes(searchLower) ||
//         (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
//       );
//     }

//     if (filterStatut) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
//     }

//     if (filterPriorite) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
//     }

//     if (filterType) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
//     }

//     setFilteredIncidents(filtered);
//     setSelectedIncidents([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Gestion de la réparation
//   const handleReparationSubmit = async (reparationData: any) => {
//     try {
//       console.log('🛠️ Création de réparation:', reparationData);
      
//       await reparationsAPI.create(reparationData);
      
//       if (incidentToRepair && incidentToRepair.id) {
//         await incidentsAPI.resoudre(incidentToRepair.id);
//         showMessage('success', `✅ Réparation créée et incident #${incidentToRepair.id} résolu!`);
//       } else {
//         showMessage('success', 'Réparation créée avec succès!');
//       }
      
//       await Promise.all([
//         fetchIncidents(),
//         fetchRelatedData()
//       ]);
      
//       setIsRepairFormOpen(false);
//       setIncidentToRepair(null);
      
//     } catch (error: any) {
//       console.error('❌ Erreur création réparation:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   // Lancer la réparation immédiate
//   const handleRepairImmediate = (incident: FormattedIncident) => {
//     console.log('🔧 Réparation immédiate pour incident:', incident);
//     setIncidentToRepair(incident);
//     setIsRepairFormOpen(true);
//   };

//   const handleSubmit = async (incidentData: any) => {
//     try {
//       console.log('📤 Soumission incident:', incidentData);
      
//       const currentUser = getCurrentUser();
      
//       const formattedData: any = {
//         description: incidentData.description,
//         type_incident: incidentData.type_incident,
//         priorite: incidentData.priorite,
//         statut: incidentData.statut,
//         utilisateur_signaleur: currentUser.id
//       };
      
//       if (incidentData.date_creation) {
//         formattedData.date_creation = incidentData.date_creation;
//       } else if (editingIncident && editingIncident.date_creation) {
//         formattedData.date_creation = editingIncident.date_creation;
//       }
      
//       if (incidentData.date_resolution) {
//         formattedData.date_resolution = incidentData.date_resolution;
//       }
      
//       if (incidentData.materiel && incidentData.materiel > 0) {
//         formattedData.materiel = incidentData.materiel;
//       }
//       if (incidentData.logiciel && incidentData.logiciel > 0) {
//         formattedData.logiciel = incidentData.logiciel;
//       }
//       if (incidentData.reseau && incidentData.reseau > 0) {
//         formattedData.reseau = incidentData.reseau;
//       }
      
//       console.log('📤 Données envoyées à l\'API:', formattedData);
      
//       if (editingIncident && editingIncident.id) {
//         await incidentsAPI.update(editingIncident.id, formattedData);
//         showMessage('success', 'Incident modifié avec succès');
//       } else {
//         await incidentsAPI.create(formattedData);
//         showMessage('success', 'Incident créé avec succès');
//       }
      
//       await fetchIncidents();
//       setIsFormOpen(false);
//       setEditingIncident(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur soumission incident:', error);
//       const errorMsg = handleApiError(error);
//       showMessage('error', errorMsg);
//     }
//   };

//   const toggleSelectIncident = (id: number) => {
//     setSelectedIncidents(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedIncidents([]);
//     } else {
//       const allIds = filteredIncidents
//         .map(i => i.id)
//         .filter((id): id is number => id !== undefined);
//       setSelectedIncidents(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIncidents.length} incident(s) ?`)) {
//       try {
//         const deletePromises = selectedIncidents.map(id => 
//           incidentsAPI.delete(id).catch(err => {
//             console.error(`Erreur suppression incident ${id}:`, err);
//             return null;
//           })
//         );
        
//         await Promise.all(deletePromises);
        
//         showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
//         setSelectedIncidents([]);
//         await fetchIncidents();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression incidents:', error);
//         showMessage('error', handleApiError(error));
//       }
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     if (selectedIncidents.length === 1) {
//       const incident = incidents.find(i => i.id === selectedIncidents[0]);
//       if (incident) {
//         handleEdit(incident);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedIncidents.length} incidents`);
//     }
//   };

//   const handleResoudreSelected = async () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     try {
//       const resolvePromises = selectedIncidents.map(id => 
//         incidentsAPI.resoudre(id).catch(err => {
//           console.error(`Erreur résolution incident ${id}:`, err);
//           return null;
//         })
//       );
      
//       await Promise.all(resolvePromises);
      
//       showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
//       setSelectedIncidents([]);
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incidents:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const handleEdit = (incident: FormattedIncident) => {
//     console.log('✏️ Édition incident:', incident);
//     setEditingIncident(incident);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
//       try {
//         await incidentsAPI.delete(id);
//         showMessage('success', 'Incident supprimé avec succès');
//         await fetchIncidents();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression incident:', error);
//         showMessage('error', handleApiError(error));
//       }
//     }
//   };

//   const handleResoudre = async (id: number) => {
//     try {
//       await incidentsAPI.resoudre(id);
//       showMessage('success', 'Incident marqué comme résolu');
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incident:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const handleAddNew = () => {
//     setEditingIncident(undefined);
//     setIsFormOpen(true);
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchIncidents();
//     showMessage('success', 'Données rafraîchies');
//   };

//   const getPriorityBadge = (priority: string) => {
//     const badges: Record<string, string> = {
//       critique: 'badge-error',
//       elevee: 'badge-warning',
//       moyenne: 'badge-info',
//       basse: 'badge-success'
//     };
//     return badges[priority] || 'badge-neutral';
//   };

//   const getPriorityText = (priority: string) => {
//     const texts: Record<string, string> = {
//       critique: 'Critique',
//       elevee: 'Élevée',
//       moyenne: 'Moyenne',
//       basse: 'Basse'
//     };
//     return texts[priority] || priority;
//   };

//   const getStatusBadge = (status: string) => {
//     const badges: Record<string, string> = {
//       ouvert: 'badge-warning',
//       en_cours: 'badge-info',
//       resolu: 'badge-success',
//       ferme: 'badge-neutral'
//     };
//     return badges[status] || 'badge-neutral';
//   };

//   const getStatusText = (status: string) => {
//     const texts: Record<string, string> = {
//       ouvert: 'Ouvert',
//       en_cours: 'En cours',
//       resolu: 'Résolu',
//       ferme: 'Fermé'
//     };
//     return texts[status] || status;
//   };

//   const getTypeText = (type: string) => {
//     const texts: Record<string, string> = {
//       materiel: 'Matériel',
//       logiciel: 'Logiciel',
//       reseau: 'Réseau',
//       mixte: 'Mixte'
//     };
//     return texts[type] || type;
//   };

//   // Fonction pour afficher la source de l'incident avec indication de panne
//   const displayIncidentSource = (incident: FormattedIncident): string => {
//     const sources: string[] = [];
    
//     if (incident.materiel_nom && incident.materiel_nom !== 'Non spécifié') {
//       const isPanne = isIncidentMaterielEnPanne(incident);
//       const materielName = incident.materiel_nom.replace('🚨 ', '').replace(' - EN PANNE', '');
//       sources.push(`${isPanne ? '🚨 ' : ''}${materielName}`);
//     }
    
//     if (incident.logiciel_nom && incident.logiciel_nom !== 'Non spécifié') {
//       sources.push(`Logiciel: ${incident.logiciel_nom}`);
//     }
    
//     if (incident.type_incident === 'reseau') {
//       sources.push('Réseau');
//     }
    
//     return sources.length > 0 ? sources.join(' | ') : 'Source non spécifiée';
//   };

//   // Statistiques
//   const stats = {
//     total: safeArray<FormattedIncident>(incidents).length,
//     ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
//     en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
//     resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu').length,
//     actifs: activeIncidents.length,
//     materielsPanne: materielsEnPanne.length
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des incidents...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4 shadow-lg`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4 shadow-lg">
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button 
//             className="btn btn-sm btn-ghost"
//             onClick={handleRefresh}
//           >
//             <RefreshCw className="h-4 w-4" />
//             Réessayer
//           </button>
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             Suivi et résolution des incidents techniques ({safeArray<FormattedIncident>(filteredIncidents).length} incidents)
//             {selectedIncidents.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedIncidents.length} sélectionné(s))
//               </span>
//             )}
//             {showActiveOnly && (
//               <span className="text-warning font-semibold ml-2">
//                 🔧 Affichage actifs seulement
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
//           {/* <button
//             onClick={handleExport}
//             className="btn btn-outline btn-sm"
//             title="Exporter la liste"
//             disabled={filteredIncidents.length === 0}
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button> */}
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvel incident
//           </button>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
//                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
//               </div>
//               <div className="text-2xl">📊</div>
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Ouverts</p>
//                 <p className="text-2xl font-bold text-orange-600">{stats.ouvert}</p>
//               </div>
//               <AlertTriangle className="w-6 h-6 text-orange-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">En cours</p>
//                 <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
//               </div>
//               <Clock className="w-6 h-6 text-blue-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Résolus</p>
//                 <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
//               </div>
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-warning/10 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">
//                   {autoRepairMode ? '🔄 En réparation' : '⚠️ Actifs'}
//                 </p>
//                 <p className="text-2xl font-bold text-warning">{activeIncidents.length}</p>
//                 {activeIncidents.length > 0 && (
//                   <div className="text-xs mt-1 opacity-70">
//                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts
//                   </div>
//                 )}
//               </div>
//               <Wrench className="w-6 h-6 text-warning" />
//             </div>
//             {activeIncidents.length > 0 && (
//               <div className="mt-2">
//                 <button
//                   onClick={toggleActiveOnly}
//                   className="btn btn-warning btn-xs w-full mt-1"
//                 >
//                   {showActiveOnly ? 'Voir tous' : 'Voir actifs'}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Section des matériels en panne */}
//       {materielsEnPanne.length > 0 && (
//         <div className="card bg-error/10 shadow-xl mb-6 border border-error/20">
//           <div className="card-body">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <Cpu className="h-6 w-6 text-error" />
//                 <h3 className="text-lg font-bold text-error">🚨 Matériels en Panne</h3>
//                 <span className="badge badge-error badge-lg">{materielsEnPanne.length}</span>
//               </div>
//               <button
//                 onClick={() => {
//                   const materielPanne = materielsEnPanne[0];
//                   const incidentLie = incidents.find(incident => 
//                     incident.materiel === materielPanne.id && 
//                     (incident.statut === 'ouvert' || incident.statut === 'en_cours')
//                   );
                  
//                   if (incidentLie) {
//                     handleRepairImmediate(incidentLie);
//                   } else {
//                     showMessage('info', `Matériel "${formatMaterielName(materielPanne)}" en panne mais pas d'incident actif lié.`);
//                   }
//                 }}
//                 className="btn btn-error btn-sm"
//               >
//                 <Wrench className="h-4 w-4 mr-2" />
//                 Réparer le premier
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {materielsEnPanne.slice(0, 3).map((materiel) => {
//                 const materielName = formatMaterielName(materiel);
//                 const incidentsLie = incidents.filter(incident => 
//                   incident.materiel === materiel.id && 
//                   (incident.statut === 'ouvert' || incident.statut === 'en_cours')
//                 );
                
//                 return (
//                   <div 
//                     key={materiel.id}
//                     className="card bg-error/5 border border-error/20 hover:border-error/40 transition-colors"
//                   >
//                     <div className="card-body p-4">
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center gap-3">
//                           <Monitor className="h-5 w-5 text-error" />
//                           <div>
//                             <h4 className="font-bold text-base-content">
//                               {materielName}
//                             </h4>
//                             {materiel.reference && (
//                               <p className="text-sm text-base-content opacity-70">
//                                 Réf: {materiel.reference}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                         {incidentsLie.length > 0 && (
//                           <span className="badge badge-error badge-sm">
//                             {incidentsLie.length} incident(s)
//                           </span>
//                         )}
//                       </div>
                      
//                       <div className="mt-3">
//                         <div className="flex items-center gap-2">
//                           <span className="text-xs font-medium">État:</span>
//                           <span className="badge badge-error badge-sm">
//                             {materiel.etat || 'En panne'}
//                           </span>
//                         </div>
                        
//                         {incidentsLie.length > 0 && (
//                           <div className="mt-2">
//                             <p className="text-xs font-medium text-error">Incidents liés:</p>
//                             <div className="space-y-1 mt-1">
//                               {incidentsLie.slice(0, 2).map(incident => (
//                                 <div 
//                                   key={incident.id}
//                                   className="text-xs bg-error/10 p-2 rounded border border-error/20 cursor-pointer"
//                                   onClick={() => handleEdit(incident)}
//                                 >
//                                   <div className="flex justify-between">
//                                     <span className="font-medium">#{incident.id}</span>
//                                     <span className={`badge ${incident.priorite === 'critique' ? 'badge-error' : 'badge-warning'} badge-xs`}>
//                                       {getPriorityText(incident.priorite)}
//                                     </span>
//                                   </div>
//                                   <p className="truncate">{incident.description}</p>
//                                 </div>
//                               ))}
//                               {incidentsLie.length > 2 && (
//                                 <div className="text-xs text-center text-error">
//                                   +{incidentsLie.length - 2} autres...
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
                        
//                         {incidentsLie.length > 0 ? (
//                           <button
//                             className="btn btn-error btn-xs w-full mt-3"
//                             onClick={() => handleRepairImmediate(incidentsLie[0])}
//                           >
//                             <Wrench className="h-3 w-3 mr-1" />
//                             Réparer le premier incident
//                           </button>
//                         ) : (
//                           <div className="text-xs text-center text-error mt-3 p-2 bg-error/10 rounded">
//                             Aucun incident actif lié à ce matériel
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
              
//               {materielsEnPanne.length > 3 && (
//                 <div className="md:col-span-3 text-center pt-2">
//                   <button
//                     onClick={() => setAutoRepairMode(true)}
//                     className="btn btn-outline btn-error btn-sm"
//                   >
//                     Voir tous les {materielsEnPanne.length} matériels en panne
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filtres et actions */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Description, matériel, signaleur..."
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
//                 <option value="ouvert">Ouvert</option>
//                 <option value="en_cours">En cours</option>
//                 <option value="resolu">Résolu</option>
//                 <option value="ferme">Fermé</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">⚠️ Priorité</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterPriorite}
//                 onChange={(e) => setFilterPriorite(e.target.value)}
//               >
//                 <option value="">Toutes les priorités</option>
//                 <option value="critique">Critique</option>
//                 <option value="elevee">Élevée</option>
//                 <option value="moyenne">Moyenne</option>
//                 <option value="basse">Basse</option>
//               </select>
//             </div>

//             {/* <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔧 Type</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="">Tous les types</option>
//                 <option value="materiel">Matériel</option>
//                 <option value="logiciel">Logiciel</option>
//                 <option value="reseau">Réseau</option>
//                 <option value="mixte">Mixte</option>
//               </select>
//             </div> */}

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
//                 <span className="label-text">🔧 Réparation</span>
//               </label>
//               <div className="flex flex-col gap-2">
//                 <button
//                   onClick={toggleAutoRepairMode}
//                   className={`btn btn-sm w-full ${autoRepairMode ? 'btn-warning' : 'btn-outline'}`}
//                 >
//                   {autoRepairMode ? '🔄 Auto ON' : 'Auto réparation'}
//                 </button>
//                 {activeIncidents.length > 0 && (
//                   <button
//                     onClick={markAllActiveForRepair}
//                     className="btn btn-warning btn-sm w-full"
//                     disabled={autoRepairMode}
//                   >
//                     Marquer pour réparation
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {activeIncidents.length > 0 && (
//             <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
//               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-warning">
//                       ⚠️ {activeIncidents.length} incident(s) actif(s)
//                     </span>
//                   </div>
//                   <div className="text-sm opacity-70">
//                     {safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'ouvert').length} ouverts, 
//                     {' '}{safeFilter<FormattedIncident>(activeIncidents, i => i.statut === 'en_cours').length} en cours
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={markAllActiveForRepair}
//                     className="btn btn-warning btn-sm gap-2"
//                   >
//                     <CheckSquare className="h-4 w-4" />
//                     Tout marquer en réparation
//                   </button>
//                   <button
//                     onClick={resolveLongDurationIncidents}
//                     className="btn btn-outline btn-sm gap-2"
//                     title="Résoudre les incidents en cours depuis plus de 7 jours"
//                   >
//                     <Clock className="h-4 w-4" />
//                     Nettoyer anciens
//                   </button>
//                 </div>
//               </div>
              
//               {autoRepairMode && (
//                 <div className="mt-3 pt-3 border-t border-warning/20">
//                   <div className="text-sm font-medium text-warning mb-2">
//                     🛠️ Prêts pour réparation immédiate:
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {activeIncidents.slice(0, 5).map(incident => {
//                       const isPanne = isIncidentMaterielEnPanne(incident);
//                       const materielName = incident.materiel_nom?.replace('🚨 ', '').replace(' - EN PANNE', '') || '';
                      
//                       return (
//                         <div 
//                           key={incident.id} 
//                           className={`badge badge-lg gap-1 cursor-pointer hover:badge-outline ${isPanne ? 'badge-error' : 'badge-warning'}`}
//                           onClick={() => handleRepairImmediate(incident)}
//                           title={`${isPanne ? '🚨 Matériel en panne: ' + materielName + ' - ' : ''}${incident.description}`}
//                         >
//                           <span>#{incident.id}</span>
//                           <span className="font-bold">{getPriorityText(incident.priorite)}</span>
//                           {isPanne && <span className="ml-1">🔥</span>}
//                         </div>
//                       );
//                     })}
//                     {activeIncidents.length > 5 && (
//                       <div className="badge badge-ghost">
//                         +{activeIncidents.length - 5} autres...
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {selectedIncidents.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedIncidents.length} incident(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={handleResoudreSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Résoudre ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedIncidents([])}
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

//       {/* Tableau des incidents */}
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
//                         disabled={filteredIncidents.length === 0}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-5 w-5 text-primary" />
//                         ) : (
//                           <Square className="h-5 w-5 text-base-content/40" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th className="font-bold">Description</th>
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Priorité</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold">Date création</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray<FormattedIncident>(filteredIncidents).map((incident) => {
//                   const isPanne = isIncidentMaterielEnPanne(incident);
//                   const materielName = incident.materiel_nom?.replace('🚨 ', '').replace(' - EN PANNE', '') || '';
                  
//                   return (
//                     <tr key={incident.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                             checked={selectedIncidents.includes(incident.id || 0)}
//                             onChange={() => toggleSelectIncident(incident.id || 0)}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         <div className="max-w-xs">
//                           <div className="font-medium text-base-content line-clamp-2">
//                             {incident.description}
//                           </div>
                          
//                           {/* Signaleur avec détails */}
//                           <div className="text-sm text-base-content opacity-70 mt-1 flex items-center gap-1">
//                             <User className="h-3 w-3" />
//                             <span className="font-medium">Signaleur:</span> 
//                             <span className="ml-1">
//                               {incident.utilisateur_nom || 'Non spécifié'}
//                             </span>
//                           </div>
                          
//                           {/* Matériel avec indication de panne */}
//                           {incident.materiel_nom && incident.materiel_nom !== 'Non spécifié' && (
//                             <div className={`text-sm ${isPanne ? 'text-error font-semibold' : 'text-base-content opacity-70'} mt-1 flex items-center gap-1`}>
//                               <Monitor className={`h-3 w-3 ${isPanne ? 'text-error' : ''}`} />
//                               <span className="font-medium">Matériel:</span> 
//                               <span className="ml-1">
//                                 {isPanne ? '🚨 ' : ''}{materielName}
//                                 {isPanne && ' - EN PANNE'}
//                               </span>
//                             </div>
//                           )}
                          
//                           {/* Logiciel */}
//                           {incident.logiciel_nom && incident.logiciel_nom !== 'Non spécifié' && (
//                             <div className="text-sm text-base-content opacity-70 mt-1 flex items-center gap-1">
//                               <Cpu className="h-3 w-3" />
//                               <span className="font-medium">Logiciel:</span> 
//                               <span className="ml-1">{incident.logiciel_nom}</span>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm font-medium capitalize">{getTypeText(incident.type_incident)}</span>
//                       </td>
//                       <td>
//                         <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg ${(incident.statut === 'ouvert' || incident.statut === 'en_cours') ? 'badge-outline' : ''}`}>
//                           {getPriorityText(incident.priorite)}
//                           {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && incident.priorite === 'critique' && (
//                             <span className="ml-1">🔥</span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex items-center gap-2">
//                           {getStatusIcon(incident.statut)}
//                           <div className={`badge ${getStatusBadge(incident.statut)}`}>
//                             {getStatusText(incident.statut)}
//                           </div>
//                           {(incident.statut === 'ouvert' || incident.statut === 'en_cours') && (
//                             <span className="text-xs text-warning font-semibold">
//                               🔧
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="text-sm font-medium">
//                           {incident.date_creation ? new Date(incident.date_creation).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                         <div className="text-xs text-base-content opacity-60 mt-1">
//                           {incident.date_creation ? new Date(incident.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           {/* <button
//                             className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
//                             title="Voir les détails"
//                             // onClick={() => {
//                             //   const details = [
//                             //     `Incident #${incident.id}`,
//                             //     `Signaleur: ${incident.utilisateur_nom || 'Non spécifié'}`,
//                             //     `Matériel: ${materielName} ${isPanne ? '(EN PANNE)' : ''}`,
//                             //     `Type: ${getTypeText(incident.type_incident)}`,
//                             //     `Priorité: ${getPriorityText(incident.priorite)}`,
//                             //     `Statut: ${getStatusText(incident.statut)}`,
//                             //     `Date création: ${incident.date_creation ? new Date(incident.date_creation).toLocaleString('fr-FR') : 'Non spécifiée'}`,
//                             //   ];
//                             //   showMessage('info', details.join('\n'));
//                             // }}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button> */}
//                           <button
//                             onClick={() => handleEdit(incident)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {/* Bouton Réparer immédiatement */}
//                           {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
//                             <button
//                               onClick={() => handleRepairImmediate(incident)}
//                               className={`btn btn-ghost btn-sm btn-square ${isPanne ? 'text-error hover:bg-error/10' : 'text-warning hover:bg-warning/10'}`}
//                               title={`${isPanne ? '🚨 Matériel en panne - ' : ''}Réparer immédiatement`}
//                             >
//                               <Wrench className="h-4 w-4" />
//                             </button>
//                           )}
//                           {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
//                             <button
//                               onClick={() => handleResoudre(incident.id || 0)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Marquer comme résolu"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(incident.id || 0)}
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

//           {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Search className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucun incident trouvé</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterStatut || filterPriorite || filterType || showActiveOnly
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucun incident n'est enregistré dans le système"
//                   }
//                 </p>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-primary btn-sm mt-4"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Créer le premier incident
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'incident */}
//       <IncidentForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingIncident(undefined);
//         }}
//         onSubmit={handleSubmit}
//         incident={editingIncident}
//         currentUser={getCurrentUser()}
//       />

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isRepairFormOpen}
//         onClose={() => {
//           setIsRepairFormOpen(false);
//           setIncidentToRepair(null);
//         }}
//         onSubmit={handleReparationSubmit}
//         incidentSource={incidentToRepair}
//         materiels={materiels}
//         incidents={incidents}
//       />
//     </div>
//   );
// };

// export default Incidents;




// // Incidents.tsx - Version complète avec tableau du matériel concerné
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Eye, 
//   Filter, 
//   Download, 
//   Edit, 
//   Trash2, 
//   CheckSquare, 
//   Square, 
//   X, 
//   AlertTriangle, 
//   Clock, 
//   CheckCircle,
//   RefreshCw,
//   Wrench,
//   User,
//   Server,
//   Monitor,
//   Cpu,
//   Printer,
//   Network,
//   HardDrive
// } from 'lucide-react';
// import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
// import api, { incidentsAPI, materielsAPI, reparationsAPI, handleApiError } from '../services/api';
// import IncidentForm from '../components/IncidentForm';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Type pour les incidents formatés
// interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom'> {
//   utilisateur_nom?: string;
//   materiel_nom?: string;
//   logiciel_nom?: string;
//   materiel_details?: {
//     id: number;
//     nom: string;
//     reference?: string;
//     type?: string;
//     etat?: string;
//     service_attribue?: string;
//     utilisateur_attribue?: string;
//   } | null;
//   signaleur_details?: any;
// }

// // Fonctions helper
// const safeArray = <T,>(data: any): T[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data as T[];
//   if (data.results && Array.isArray(data.results)) return data.results as T[];
//   if (data.data && Array.isArray(data.data)) return data.data as T[];
//   return [];
// };

// const safeFilter = <T,>(array: T[], condition: (item: T) => boolean): T[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
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

// // Fonction pour récupérer les détails d'un utilisateur depuis l'API
// const fetchUserDetails = async (userId: number): Promise<any> => {
//   try {
//     const response = await api.get(`/users/${userId}/`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Erreur récupération utilisateur #${userId}:`, error);
//     return null;
//   }
// };

// // Fonction pour formater le nom d'un utilisateur
// const formatUserName = (user: any): string => {
//   if (!user) return 'Non spécifié';
  
//   if (user.first_name && user.last_name) {
//     return `${user.first_name} ${user.last_name}`;
//   }
  
//   if (user.nom && user.prenom) {
//     return `${user.prenom} ${user.nom}`;
//   }
  
//   if (user.nom_complet) {
//     return user.nom_complet;
//   }
  
//   if (user.username) {
//     return user.username;
//   }
  
//   if (user.email) {
//     return user.email.split('@')[0];
//   }
  
//   if (user.id) {
//     return `Utilisateur #${user.id}`;
//   }
  
//   return 'Non spécifié';
// };

// // Fonction pour vérifier si un matériel est en panne
// const isMaterielEnPanne = (materiel: any): boolean => {
//   if (!materiel) return false;
  
//   const etat = (materiel.etat || '').toLowerCase().trim();
//   const statut = (materiel.statut || '').toLowerCase().trim();
  
//   const etatsPanne = [
//     'en_panne',
//     'en panne',
//     'panne',
//     'broken',
//     'out of order',
//     'hors service',
//     'defective',
//     'faulty',
//     'défectueux'
//   ];
  
//   return etatsPanne.some(panneEtat => 
//     etat.includes(panneEtat) || statut.includes(panneEtat)
//   );
// };

// // Fonction pour formater le nom d'un matériel
// const formatMaterielName = (materiel: any): string => {
//   if (!materiel) return 'Matériel inconnu';
  
//   if (materiel.nom) {
//     return materiel.nom;
//   }
  
//   if (materiel.libelle) {
//     return materiel.libelle;
//   }
  
//   if (materiel.reference) {
//     return `Réf: ${materiel.reference}`;
//   }
  
//   if (materiel.id) {
//     return `Matériel #${materiel.id}`;
//   }
  
//   return 'Matériel non spécifié';
// };

// // Obtenir l'icône du matériel
// const getMaterielIcon = (type?: string) => {
//   if (!type) return <Monitor className="h-4 w-4" />;
  
//   const typeLower = type.toLowerCase();
//   if (typeLower.includes('ordinateur') || typeLower.includes('pc') || typeLower.includes('laptop')) 
//     return <Monitor className="h-4 w-4" />;
//   if (typeLower.includes('serveur')) return <HardDrive className="h-4 w-4" />;
//   if (typeLower.includes('imprimante') || typeLower.includes('printer')) 
//     return <Printer className="h-4 w-4" />;
//   if (typeLower.includes('réseau') || typeLower.includes('switch') || typeLower.includes('routeur')) 
//     return <Network className="h-4 w-4" />;
//   return <Monitor className="h-4 w-4" />;
// };

// const Incidents: React.FC = () => {
//   const { user: authUser } = useAuth();
  
//   const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
//   const [reseaux, setReseaux] = useState<Reseau[]>([]);
//   const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
//   const [activeIncidents, setActiveIncidents] = useState<FormattedIncident[]>([]);
//   const [materielsEnPanne, setMaterielsEnPanne] = useState<Materiel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterPriorite, setFilterPriorite] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingIncident, setEditingIncident] = useState<FormattedIncident | undefined>();
//   const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  
//   // États pour réparation
//   const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);
//   const [incidentToRepair, setIncidentToRepair] = useState<FormattedIncident | null>(null);

//   const getCurrentUser = (): UserType => {
//     if (authUser) {
//       return {
//         id: authUser.id || 0,
//         username: authUser.username || '',
//         first_name: authUser.first_name || '',
//         last_name: authUser.last_name || '',
//         email: authUser.email || '',
//         is_active: authUser.is_active !== false,
//         date_joined: authUser.date_joined || new Date().toISOString(),
//         role: authUser.role,
//         departement: authUser.departement || '',
//         telephone: authUser.telephone || ''
//       };
//     }
    
//     try {
//       const userStr = localStorage.getItem('user');
//       if (userStr) {
//         const user = JSON.parse(userStr);
//         return {
//           id: user.id || 0,
//           username: user.username || '',
//           first_name: user.first_name || '',
//           last_name: user.last_name || '',
//           email: user.email || '',
//           is_active: user.is_active !== false,
//           date_joined: user.date_joined || new Date().toISOString(),
//           role: user.role,
//           departement: user.departement || ''
//         };
//       }
//     } catch (e) {
//       console.error('Erreur parsing user:', e);
//     }
    
//     return {
//       id: 0,
//       username: 'utilisateur',
//       first_name: 'Utilisateur',
//       last_name: 'Inconnu',
//       email: 'user@example.com',
//       is_active: true,
//       date_joined: new Date().toISOString(),
//       role: 'user',
//       departement: ''
//     };
//   };

//   const filterActiveIncidents = (incidentsList: FormattedIncident[]): FormattedIncident[] => {
//     return safeFilter<FormattedIncident>(
//       incidentsList, 
//       i => i.statut === 'ouvert' || i.statut === 'en_cours'
//     );
//   };

//   // Fonction pour récupérer le nom du signaleur
//   const getSignaleurName = async (incident: any): Promise<string> => {
//     if (!incident) return 'Non spécifié';
    
//     // Liste des sources possibles
//     const sources = [
//       incident.utilisateur_nom,
//       incident.signaleur_nom,
//       incident.signaleur_prenom && incident.signaleur_nom 
//         ? `${incident.signaleur_prenom} ${incident.signaleur_nom}`
//         : null,
//       incident.signaleur_nom_complet,
//       incident.utilisateur_signaleur_details 
//         ? formatUserName(incident.utilisateur_signaleur_details)
//         : null,
//       incident.signaleur_details 
//         ? formatUserName(incident.signaleur_details)
//         : null,
//       incident.user_details 
//         ? formatUserName(incident.user_details)
//         : null,
//       ...(incident.utilisateur_signaleur ? 
//         [await fetchUserDetails(incident.utilisateur_signaleur).then(user => 
//           user ? formatUserName(user) : null
//         )] 
//         : []),
//       incident.utilisateur_signaleur 
//         ? `Utilisateur #${incident.utilisateur_signaleur}`
//         : null,
//     ];
    
//     // Prendre la première source valide
//     for (const source of sources) {
//       if (source && source !== 'null' && source !== 'undefined' && source !== 'Non spécifié') {
//         return source;
//       }
//     }
    
//     return 'Non spécifié';
//   };

//   // Fonction pour récupérer les détails d'un matériel
//   const getMaterielDetails = async (materielId: number): Promise<any> => {
//     if (!materielId) return null;
    
//     // Chercher d'abord dans les matériels déjà chargés
//     const existingMateriel = materiels.find(m => m.id === materielId);
//     if (existingMateriel) {
//       return existingMateriel;
//     }
    
//     // Sinon récupérer depuis l'API
//     try {
//       const response = await materielsAPI.getById(materielId);
//       const materielData = extractDataFromResponse(response)[0];
//       return materielData;
//     } catch (error) {
//       console.error(`❌ Erreur récupération matériel #${materielId}:`, error);
//       return null;
//     }
//   };

//   // Fonction pour récupérer le nom d'un matériel
//   const getMaterielName = async (materielId: number): Promise<string> => {
//     const materiel = await getMaterielDetails(materielId);
//     return materiel ? formatMaterielName(materiel) : 'Matériel non spécifié';
//   };

//   // Charger les incidents avec les détails du matériel
//   const fetchIncidents = async () => {
//     try {
//       setLoading(true);
//       console.log('🔄 Chargement des incidents...');
      
//       const response = await incidentsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       // Formater les incidents avec les informations complètes
//       const formattedIncidentsPromises = extractedData.map(async (incident: any) => {
//         try {
//           // 1. Récupérer le nom du signaleur
//           const signaleurNom = await getSignaleurName(incident);
          
//           // 2. Récupérer les détails du matériel
//           let materielDetails = null;
//           let materielNom = 'Non spécifié';
//           let isPanne = false;
          
//           const materielId = incident.materiel_concerne || incident.materiel;
//           if (materielId) {
//             materielDetails = await getMaterielDetails(materielId);
//             if (materielDetails) {
//               materielNom = formatMaterielName(materielDetails);
//               isPanne = isMaterielEnPanne(materielDetails);
//             }
//           }
          
//           // Créer l'incident formaté
//           const formattedIncident: FormattedIncident = {
//             id: incident.id || 0,
//             description: incident.description || '',
//             type_incident: incident.type_incident || 'materiel',
//             priorite: incident.priorite || 'moyenne',
//             statut: incident.statut || 'ouvert',
//             date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
//             date_resolution: incident.date_resolution || null,
//             utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
//             materiel: materielId || null,
//             logiciel: incident.logiciel_concerne || incident.logiciel || null,
//             reseau: incident.reseau_concerne || incident.reseau || null,
            
//             // Informations formatées
//             utilisateur_nom: signaleurNom,
//             materiel_nom: isPanne ? `🚨 ${materielNom}` : materielNom,
//             logiciel_nom: incident.logiciel_nom || 'Non spécifié',
//             materiel_details: materielDetails,
//             signaleur_details: incident.utilisateur_signaleur_details || incident.signaleur_details
//           };
          
//           return formattedIncident;
//         } catch (error) {
//           console.error(`❌ Erreur formatage incident ${incident.id}:`, error);
//           return null;
//         }
//       });
      
//       const formattedIncidentsResults = await Promise.all(formattedIncidentsPromises);
//       const formattedIncidents = formattedIncidentsResults.filter(inc => inc !== null) as FormattedIncident[];
      
//       // Trouver les incidents actifs
//       const activeOnes = filterActiveIncidents(formattedIncidents);
//       setActiveIncidents(activeOnes);
      
//       // Trouver les matériels en panne
//       const panneMateriels = materiels.filter(materiel => {
//         const isPanne = isMaterielEnPanne(materiel);
        
//         // Vérifier aussi s'il est lié à un incident actif
//         const hasActiveIncident = formattedIncidents.some(incident => 
//           incident.materiel === materiel.id && 
//           (incident.statut === 'ouvert' || incident.statut === 'en_cours')
//         );
        
//         return isPanne || hasActiveIncident;
//       });
      
//       setMaterielsEnPanne(panneMateriels);
      
//       setIncidents(formattedIncidents);
//       setFilteredIncidents(formattedIncidents);
//       setError('');
      
//       console.log(`✅ ${formattedIncidents.length} incidents chargés`);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement incidents:', err);
//       const errorMsg = handleApiError(err);
//       setError(errorMsg);
//       showMessage('error', errorMsg);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchRelatedData = async () => {
//     try {
//       console.log('🔄 Chargement des données liées...');
      
//       const [materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
//         materielsAPI.getAll(),
//         logicielsAPI.getAll(),
//         reseauAPI.getAll()
//       ]);
      
//       let materielsData: Materiel[] = [];
//       if (materielsRes.status === 'fulfilled') {
//         materielsData = extractDataFromResponse(materielsRes.value);
//         console.log(`✅ ${materielsData.length} matériels chargés`);
//       }
      
//       let logicielsData: Logiciel[] = [];
//       if (logicielsRes.status === 'fulfilled') {
//         logicielsData = extractDataFromResponse(logicielsRes.value);
//         console.log(`✅ ${logicielsData.length} logiciels chargés`);
//       }
      
//       let reseauxData: Reseau[] = [];
//       if (reseauxRes.status === 'fulfilled') {
//         reseauxData = extractDataFromResponse(reseauxRes.value);
//         console.log(`✅ ${reseauxData.length} réseaux chargés`);
//       }
      
//       setMateriels(materielsData);
//       setLogiciels(logicielsData);
//       setReseaux(reseauxData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement données liées:', err);
//     }
//   };

//   useEffect(() => {
//     const loadInitialData = async () => {
//       await fetchRelatedData();
//       await fetchIncidents();
//     };
    
//     loadInitialData();
//   }, []);

//   // Rafraîchir les incidents quand les matériels changent
//   useEffect(() => {
//     if (materiels.length > 0 && incidents.length === 0) {
//       fetchIncidents();
//     }
//   }, [materiels]);

//   useEffect(() => {
//     filterIncidents();
//   }, [incidents, searchTerm, filterStatut, filterPriorite, filterType, showActiveOnly]);

//   useEffect(() => {
//     if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedIncidents, filteredIncidents]);

//   const filterIncidents = () => {
//     let filtered = showActiveOnly ? activeIncidents : safeArray<FormattedIncident>(incidents);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter<FormattedIncident>(filtered, incident => 
//         (incident.description?.toLowerCase() || '').includes(searchLower) ||
//         (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
//         (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
//       );
//     }

//     if (filterStatut) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
//     }

//     if (filterPriorite) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
//     }

//     if (filterType) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
//     }

//     setFilteredIncidents(filtered);
//     setSelectedIncidents([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Gestion de la réparation
//   const handleReparationSubmit = async (reparationData: any) => {
//     try {
//       await reparationsAPI.create(reparationData);
      
//       if (incidentToRepair && incidentToRepair.id) {
//         await incidentsAPI.resoudre(incidentToRepair.id);
//         showMessage('success', `✅ Réparation créée et incident #${incidentToRepair.id} résolu!`);
//       } else {
//         showMessage('success', 'Réparation créée avec succès!');
//       }
      
//       await Promise.all([
//         fetchIncidents(),
//         fetchRelatedData()
//       ]);
      
//       setIsRepairFormOpen(false);
//       setIncidentToRepair(null);
      
//     } catch (error: any) {
//       console.error('❌ Erreur création réparation:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   // Lancer la réparation immédiate
//   const handleRepairImmediate = (incident: FormattedIncident) => {
//     setIncidentToRepair(incident);
//     setIsRepairFormOpen(true);
//   };

//   const handleSubmit = async (incidentData: any) => {
//     try {
//       const currentUser = getCurrentUser();
      
//       const formattedData: any = {
//         description: incidentData.description,
//         type_incident: incidentData.type_incident,
//         priorite: incidentData.priorite,
//         statut: incidentData.statut,
//         utilisateur_signaleur: currentUser.id
//       };
      
//       if (incidentData.date_creation) {
//         formattedData.date_creation = incidentData.date_creation;
//       } else if (editingIncident && editingIncident.date_creation) {
//         formattedData.date_creation = editingIncident.date_creation;
//       }
      
//       if (incidentData.date_resolution) {
//         formattedData.date_resolution = incidentData.date_resolution;
//       }
      
//       if (incidentData.materiel && incidentData.materiel > 0) {
//         formattedData.materiel_concerne = incidentData.materiel;
//       }
//       if (incidentData.logiciel && incidentData.logiciel > 0) {
//         formattedData.logiciel_concerne = incidentData.logiciel;
//       }
//       if (incidentData.reseau && incidentData.reseau > 0) {
//         formattedData.reseau_concerne = incidentData.reseau;
//       }
      
//       if (editingIncident && editingIncident.id) {
//         await incidentsAPI.update(editingIncident.id, formattedData);
//         showMessage('success', 'Incident modifié avec succès');
//       } else {
//         await incidentsAPI.create(formattedData);
//         showMessage('success', 'Incident créé avec succès');
//       }
      
//       await fetchIncidents();
//       setIsFormOpen(false);
//       setEditingIncident(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur soumission incident:', error);
//       const errorMsg = handleApiError(error);
//       showMessage('error', errorMsg);
//     }
//   };

//   const toggleSelectIncident = (id: number) => {
//     setSelectedIncidents(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedIncidents([]);
//     } else {
//       const allIds = filteredIncidents
//         .map(i => i.id)
//         .filter((id): id is number => id !== undefined);
//       setSelectedIncidents(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIncidents.length} incident(s) ?`)) {
//       try {
//         const deletePromises = selectedIncidents.map(id => 
//           incidentsAPI.delete(id).catch(err => {
//             console.error(`Erreur suppression incident ${id}:`, err);
//             return null;
//           })
//         );
        
//         await Promise.all(deletePromises);
        
//         showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
//         setSelectedIncidents([]);
//         await fetchIncidents();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression incidents:', error);
//         showMessage('error', handleApiError(error));
//       }
//     }
//   };

//   const handleResoudreSelected = async () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     try {
//       const resolvePromises = selectedIncidents.map(id => 
//         incidentsAPI.resoudre(id).catch(err => {
//           console.error(`Erreur résolution incident ${id}:`, err);
//           return null;
//         })
//       );
      
//       await Promise.all(resolvePromises);
      
//       showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
//       setSelectedIncidents([]);
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incidents:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     if (selectedIncidents.length === 1) {
//       const incident = incidents.find(i => i.id === selectedIncidents[0]);
//       if (incident) {
//         handleEdit(incident);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedIncidents.length} incidents`);
//     }
//   };

//   const handleEdit = (incident: FormattedIncident) => {
//     setEditingIncident(incident);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
//       try {
//         await incidentsAPI.delete(id);
//         showMessage('success', 'Incident supprimé avec succès');
//         await fetchIncidents();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression incident:', error);
//         showMessage('error', handleApiError(error));
//       }
//     }
//   };

//   const handleResoudre = async (id: number) => {
//     try {
//       await incidentsAPI.resoudre(id);
//       showMessage('success', 'Incident marqué comme résolu');
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incident:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const handleAddNew = () => {
//     setEditingIncident(undefined);
//     setIsFormOpen(true);
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchIncidents();
//     showMessage('success', 'Données rafraîchies');
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredIncidents.map(i => ({
//         ID: i.id,
//         Description: i.description,
//         'Matériel concerné': i.materiel_nom || 'Non spécifié',
//         Type: getTypeText(i.type_incident),
//         Priorité: getPriorityText(i.priorite),
//         Statut: getStatusText(i.statut),
//         'Utilisateur signaleur': i.utilisateur_nom || 'Non spécifié',
//         'Date création': i.date_creation ? new Date(i.date_creation).toLocaleDateString('fr-FR') : 'Non spécifiée'
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
//       link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterStatut('');
//     setFilterPriorite('');
//     setFilterType('');
//     setSelectedIncidents([]);
//     setShowActiveOnly(false);
//   };

//   const toggleActiveOnly = () => {
//     setShowActiveOnly(!showActiveOnly);
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
//       case 'en_cours': return <Clock className="w-4 h-4" />;
//       case 'resolu': return <CheckCircle className="w-4 w-4" />;
//       case 'ferme': return <CheckCircle className="w-4 w-4" />;
//       default: return <AlertTriangle className="w-4 h-4" />;
//     }
//   };

//   const getPriorityBadge = (priority: string) => {
//     const badges: Record<string, string> = {
//       critique: 'badge-error',
//       elevee: 'badge-warning',
//       moyenne: 'badge-info',
//       basse: 'badge-success'
//     };
//     return badges[priority] || 'badge-neutral';
//   };

//   const getPriorityText = (priority: string) => {
//     const texts: Record<string, string> = {
//       critique: 'Critique',
//       elevee: 'Élevée',
//       moyenne: 'Moyenne',
//       basse: 'Basse'
//     };
//     return texts[priority] || priority;
//   };

//   const getStatusBadge = (status: string) => {
//     const badges: Record<string, string> = {
//       ouvert: 'badge-warning',
//       en_cours: 'badge-info',
//       resolu: 'badge-success',
//       ferme: 'badge-neutral'
//     };
//     return badges[status] || 'badge-neutral';
//   };

//   const getStatusText = (status: string) => {
//     const texts: Record<string, string> = {
//       ouvert: 'Ouvert',
//       en_cours: 'En cours',
//       resolu: 'Résolu',
//       ferme: 'Fermé'
//     };
//     return texts[status] || status;
//   };

//   const getTypeText = (type: string) => {
//     const texts: Record<string, string> = {
//       materiel: 'Matériel',
//       logiciel: 'Logiciel',
//       reseau: 'Réseau',
//       mixte: 'Mixte'
//     };
//     return texts[type] || type;
//   };

//   // Statistiques
//   const stats = {
//     total: safeArray<FormattedIncident>(incidents).length,
//     ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
//     en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
//     resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu').length,
//     actifs: activeIncidents.length,
//     materielsPanne: materielsEnPanne.length
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des incidents...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4 shadow-lg`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4 shadow-lg">
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button 
//             className="btn btn-sm btn-ghost"
//             onClick={handleRefresh}
//           >
//             <RefreshCw className="h-4 w-4" />
//             Réessayer
//           </button>
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray<FormattedIncident>(filteredIncidents).length} incidents trouvés
//             {selectedIncidents.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedIncidents.length} sélectionné(s))
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
//             disabled={filteredIncidents.length === 0}
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvel incident
//           </button>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
//                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
//               </div>
//               <div className="text-2xl">📊</div>
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Ouverts</p>
//                 <p className="text-2xl font-bold text-orange-600">{stats.ouvert}</p>
//               </div>
//               <AlertTriangle className="w-6 h-6 text-orange-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">En cours</p>
//                 <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
//               </div>
//               <Clock className="w-6 h-6 text-blue-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Résolus</p>
//                 <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
//               </div>
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-warning/10 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Actifs</p>
//                 <p className="text-2xl font-bold text-warning">{stats.actifs}</p>
//               </div>
//               <Wrench className="w-6 h-6 text-warning" />
//             </div>
//             {stats.actifs > 0 && (
//               <div className="mt-2">
//                 <button
//                   onClick={toggleActiveOnly}
//                   className="btn btn-warning btn-xs w-full mt-1"
//                 >
//                   {showActiveOnly ? 'Voir tous' : 'Voir actifs'}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
        
//         <div className="card bg-error/10 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">En panne</p>
//                 <p className="text-2xl font-bold text-error">{stats.materielsPanne}</p>
//               </div>
//               <Monitor className="w-6 h-6 text-error" />
//             </div>
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
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Description, matériel, signaleur..."
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
//                 <option value="ouvert">Ouvert</option>
//                 <option value="en_cours">En cours</option>
//                 <option value="resolu">Résolu</option>
//                 <option value="ferme">Fermé</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">⚠️ Priorité</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterPriorite}
//                 onChange={(e) => setFilterPriorite(e.target.value)}
//               >
//                 <option value="">Toutes les priorités</option>
//                 <option value="critique">Critique</option>
//                 <option value="elevee">Élevée</option>
//                 <option value="moyenne">Moyenne</option>
//                 <option value="basse">Basse</option>
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
//                 <option value="materiel">Matériel</option>
//                 <option value="logiciel">Logiciel</option>
//                 <option value="reseau">Réseau</option>
//                 <option value="mixte">Mixte</option>
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

//           {selectedIncidents.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedIncidents.length} incident(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={handleResoudreSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Résoudre ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedIncidents([])}
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

//       {/* Tableau des incidents */}
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
//                         disabled={filteredIncidents.length === 0}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-5 w-5 text-primary" />
//                         ) : (
//                           <Square className="h-5 w-5 text-base-content/40" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th className="font-bold">Description</th>
//                   <th className="font-bold">Matériel concerné</th>
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Priorité</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold">Date création</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray<FormattedIncident>(filteredIncidents).map((incident) => {
//                   const isPanne = incident.materiel_nom?.includes('🚨');
                  
//                   return (
//                     <tr key={incident.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm"
//                             checked={selectedIncidents.includes(incident.id || 0)}
//                             onChange={() => toggleSelectIncident(incident.id || 0)}
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Colonne Description */}
//                       <td>
//                         <div className="max-w-xs">
//                           <div className="font-medium text-base-content line-clamp-2">
//                             {incident.description}
//                           </div>
                          
//                           {/* Signaleur */}
//                           <div className="text-sm text-base-content opacity-70 mt-1 flex items-center gap-1">
//                             <User className="h-3 w-3" />
//                             <span className="font-medium">Signaleur:</span> 
//                             <span className="ml-1">
//                               {incident.utilisateur_nom || 'Non spécifié'}
//                             </span>
//                           </div>
//                         </div>
//                       </td>
                      
//                       {/* NOUVELLE COLONNE : Matériel concerné */}
//                       <td>
//                         <div className="flex flex-col gap-2">
//                           {/* Nom et icône du matériel */}
//                           <div className="flex items-center gap-2">
//                             {getMaterielIcon(incident.materiel_details?.type)}
//                             <div className="flex-1">
//                               <span className={`font-medium ${isPanne ? 'text-error' : 'text-base-content'}`}>
//                                 {incident.materiel_nom || 'Non spécifié'}
//                               </span>
//                             </div>
//                           </div>
                          
//                           {/* Détails supplémentaires si disponibles */}
//                           {incident.materiel_details && (
//                             <div className="text-xs text-base-content opacity-70">
//                               <div className="grid grid-cols-2 gap-1">
//                                 {incident.materiel_details.reference && (
//                                   <div className="flex items-center gap-1">
//                                     <span className="font-medium">Réf:</span>
//                                     <span className="badge badge-xs badge-outline">
//                                       {incident.materiel_details.reference}
//                                     </span>
//                                   </div>
//                                 )}
                                
//                                 {incident.materiel_details.etat && (
//                                   <div className="flex items-center gap-1">
//                                     <span className="font-medium">État:</span>
//                                     <span className={`badge badge-xs ${
//                                       incident.materiel_details.etat.toLowerCase().includes('panne') 
//                                         ? 'badge-error' 
//                                         : 'badge-success'
//                                     }`}>
//                                       {incident.materiel_details.etat}
//                                     </span>
//                                   </div>
//                                 )}
                                
//                                 {incident.materiel_details.service_attribue && (
//                                   <div className="col-span-2 flex items-center gap-1">
//                                     <span className="font-medium">Service:</span>
//                                     <span>{incident.materiel_details.service_attribue}</span>
//                                   </div>
//                                 )}
                                
//                                 {incident.materiel_details.utilisateur_attribue && (
//                                   <div className="col-span-2 flex items-center gap-1">
//                                     <span className="font-medium">Utilisateur:</span>
//                                     <span>{incident.materiel_details.utilisateur_attribue}</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           )}
                          
//                           {/* Bouton de réparation si le matériel est en panne */}
//                           {isPanne && incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
//                             <button
//                               onClick={() => handleRepairImmediate(incident)}
//                               className="btn btn-error btn-xs w-full mt-1 gap-1"
//                             >
//                               <Wrench className="h-3 w-3" />
//                               Réparer immédiatement
//                             </button>
//                           )}
//                         </div>
//                       </td>
                      
//                       {/* Colonne Type */}
//                       <td>
//                         <span className="text-sm font-medium capitalize">
//                           {getTypeText(incident.type_incident)}
//                         </span>
//                       </td>
                      
//                       {/* Colonne Priorité */}
//                       <td>
//                         <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg`}>
//                           {getPriorityText(incident.priorite)}
//                         </div>
//                       </td>
                      
//                       {/* Colonne Statut */}
//                       <td>
//                         <div className="flex items-center gap-2">
//                           {getStatusIcon(incident.statut)}
//                           <div className={`badge ${getStatusBadge(incident.statut)}`}>
//                             {getStatusText(incident.statut)}
//                           </div>
//                         </div>
//                       </td>
                      
//                       {/* Colonne Date */}
//                       <td>
//                         <span className="text-sm font-medium">
//                           {incident.date_creation ? new Date(incident.date_creation).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                         <div className="text-xs text-base-content opacity-60 mt-1">
//                           {incident.date_creation ? new Date(incident.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
//                         </div>
//                       </td>
                      
//                       {/* Colonne Actions */}
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(incident)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
                          
//                           {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
//                             <button
//                               onClick={() => handleResoudre(incident.id || 0)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Marquer comme résolu"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           <button
//                             onClick={() => handleDelete(incident.id || 0)}
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

//           {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Search className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucun incident trouvé</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterStatut || filterPriorite || filterType || showActiveOnly
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucun incident n'est enregistré dans le système"
//                   }
//                 </p>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-primary btn-sm mt-4"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Créer le premier incident
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'incident */}
//       <IncidentForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingIncident(undefined);
//         }}
//         onSubmit={handleSubmit}
//         incident={editingIncident}
//         currentUser={getCurrentUser()}
//       />

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isRepairFormOpen}
//         onClose={() => {
//           setIsRepairFormOpen(false);
//           setIncidentToRepair(null);
//         }}
//         onSubmit={handleReparationSubmit}
//         incidentSource={incidentToRepair}
//         materiels={materiels}
//         incidents={incidents}
//       />
//     </div>
//   );
// };

// export default Incidents;



// // Incidents.tsx - Version mise à jour avec mise à jour automatique du statut
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Eye, 
//   Filter, 
//   Download, 
//   Edit, 
//   Trash2, 
//   CheckSquare, 
//   Square, 
//   X, 
//   AlertTriangle, 
//   Clock, 
//   CheckCircle,
//   RefreshCw,
//   Wrench,
//   User,
//   Server,
//   Monitor,
//   Cpu,
//   Printer,
//   Network,
//   HardDrive
// } from 'lucide-react';
// import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
// import api, { incidentsAPI, materielsAPI, reparationsAPI, handleApiError } from '../services/api';
// import IncidentForm from '../components/IncidentForm';
// import ReparationForm from '../components/ReparationForm';
// import { useAuth } from '../context/AuthContext';

// // Type pour les incidents formatés
// interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom'> {
//   utilisateur_nom?: string;
//   materiel_nom?: string;
//   logiciel_nom?: string;
//   materiel_details?: {
//     id: number;
//     nom: string;
//     reference?: string;
//     type?: string;
//     etat?: string;
//     service_attribue?: string;
//     utilisateur_attribue?: string;
//   } | null;
//   signaleur_details?: any;
// }

// // Fonctions helper
// const safeArray = <T,>(data: any): T[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data as T[];
//   if (data.results && Array.isArray(data.results)) return data.results as T[];
//   if (data.data && Array.isArray(data.data)) return data.data as T[];
//   return [];
// };

// const safeFilter = <T,>(array: T[], condition: (item: T) => boolean): T[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
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

// // Fonction pour récupérer les détails d'un utilisateur depuis l'API
// const fetchUserDetails = async (userId: number): Promise<any> => {
//   try {
//     const response = await api.get(`/users/${userId}/`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Erreur récupération utilisateur #${userId}:`, error);
//     return null;
//   }
// };

// // Fonction pour formater le nom d'un utilisateur
// const formatUserName = (user: any): string => {
//   if (!user) return 'Non spécifié';
  
//   if (user.first_name && user.last_name) {
//     return `${user.first_name} ${user.last_name}`;
//   }
  
//   if (user.nom && user.prenom) {
//     return `${user.prenom} ${user.nom}`;
//   }
  
//   if (user.nom_complet) {
//     return user.nom_complet;
//   }
  
//   if (user.username) {
//     return user.username;
//   }
  
//   if (user.email) {
//     return user.email.split('@')[0];
//   }
  
//   if (user.id) {
//     return `Utilisateur #${user.id}`;
//   }
  
//   return 'Non spécifié';
// };

// // NOUVELLE FONCTION : Vérifier si un matériel est en état "panne"
// const isMaterielEnEtatPanne = (materiel: any): boolean => {
//   if (!materiel || !materiel.etat) return false;
  
//   const etat = (materiel.etat || '').toLowerCase().trim();
  
//   const etatsPanne = [
//     'panne',
//     'en_panne',
//     'en panne',
//     'broken',
//     'out of order',
//     'hors service',
//     'defective',
//     'faulty',
//     'défectueux'
//   ];
  
//   return etatsPanne.some(panneEtat => 
//     etat.includes(panneEtat)
//   );
// };

// // NOUVELLE FONCTION : Vérifier si un matériel est en état "fonctionnel/réparé"
// const isMaterielEnEtatFonctionnel = (materiel: any): boolean => {
//   if (!materiel || !materiel.etat) return false;
  
//   const etat = (materiel.etat || '').toLowerCase().trim();
  
//   const etatsFonctionnels = [
//     'fonctionnel',
//     'fonctionnelle',
//     'repare',
//     'réparé',
//     'reparé',
//     'ameliore',
//     'amélioré',
//     'disponible',
//     'en service',
//     'actif',
//     'opérationnel',
//     'operational',
//     'working',
//     'good'
//   ];
  
//   return etatsFonctionnels.some(fonctionnelEtat => 
//     etat.includes(fonctionnelEtat)
//   );
// };

// // NOUVELLE FONCTION : Déterminer le statut de l'incident basé sur l'état du matériel
// const getStatutIncidentParEtatMateriel = (materiel: any, incidentStatut: string): string => {
//   if (!materiel) return incidentStatut;
  
//   // Si le matériel est en état panne, l'incident devrait être actif
//   if (isMaterielEnEtatPanne(materiel)) {
//     return 'ouvert'; // Forcer l'incident à "ouvert" si le matériel est en panne
//   }
  
//   // Si le matériel est fonctionnel, vérifier si l'incident est toujours actif
//   if (isMaterielEnEtatFonctionnel(materiel)) {
//     if (incidentStatut === 'ouvert' || incidentStatut === 'en_cours') {
//       return 'resolu'; // Auto-résoudre si le matériel est réparé
//     }
//   }
  
//   // Si le matériel est en réparation/maintenance, garder l'incident en cours
//   const etat = (materiel.etat || '').toLowerCase();
//   if (etat.includes('reparation') || etat.includes('maintenance') || etat.includes('amelioration')) {
//     return 'en_cours';
//   }
  
//   return incidentStatut;
// };

// // Fonction pour formater le nom d'un matériel
// const formatMaterielName = (materiel: any): string => {
//   if (!materiel) return 'Matériel inconnu';
  
//   if (materiel.nom) {
//     return materiel.nom;
//   }
  
//   if (materiel.libelle) {
//     return materiel.libelle;
//   }
  
//   if (materiel.reference) {
//     return `Réf: ${materiel.reference}`;
//   }
  
//   if (materiel.id) {
//     return `Matériel #${materiel.id}`;
//   }
  
//   return 'Matériel non spécifié';
// };

// // Obtenir l'icône du matériel
// const getMaterielIcon = (type?: string) => {
//   if (!type) return <Monitor className="h-4 w-4" />;
  
//   const typeLower = type.toLowerCase();
//   if (typeLower.includes('ordinateur') || typeLower.includes('pc') || typeLower.includes('laptop')) 
//     return <Monitor className="h-4 w-4" />;
//   if (typeLower.includes('serveur')) return <HardDrive className="h-4 w-4" />;
//   if (typeLower.includes('imprimante') || typeLower.includes('printer')) 
//     return <Printer className="h-4 w-4" />;
//   if (typeLower.includes('réseau') || typeLower.includes('switch') || typeLower.includes('routeur')) 
//     return <Network className="h-4 w-4" />;
//   return <Monitor className="h-4 w-4" />;
// };

// const Incidents: React.FC = () => {
//   const { user: authUser } = useAuth();
  
//   const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
//   const [reseaux, setReseaux] = useState<Reseau[]>([]);
//   const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
//   const [activeIncidents, setActiveIncidents] = useState<FormattedIncident[]>([]);
//   const [materielsEnPanne, setMaterielsEnPanne] = useState<Materiel[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterPriorite, setFilterPriorite] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingIncident, setEditingIncident] = useState<FormattedIncident | undefined>();
//   const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  
//   // États pour réparation
//   const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);
//   const [incidentToRepair, setIncidentToRepair] = useState<FormattedIncident | null>(null);
//   const [shouldAutoResolve, setShouldAutoResolve] = useState<boolean>(true); // Nouveau état pour auto-résolution

//   const getCurrentUser = (): UserType => {
//     if (authUser) {
//       return {
//         id: authUser.id || 0,
//         username: authUser.username || '',
//         first_name: authUser.first_name || '',
//         last_name: authUser.last_name || '',
//         email: authUser.email || '',
//         is_active: authUser.is_active !== false,
//         date_joined: authUser.date_joined || new Date().toISOString(),
//         role: authUser.role,
//         departement: authUser.departement || '',
//         telephone: authUser.telephone || ''
//       };
//     }
    
//     try {
//       const userStr = localStorage.getItem('user');
//       if (userStr) {
//         const user = JSON.parse(userStr);
//         return {
//           id: user.id || 0,
//           username: user.username || '',
//           first_name: user.first_name || '',
//           last_name: user.last_name || '',
//           email: user.email || '',
//           is_active: user.is_active !== false,
//           date_joined: user.date_joined || new Date().toISOString(),
//           role: user.role,
//           departement: user.departement || ''
//         };
//       }
//     } catch (e) {
//       console.error('Erreur parsing user:', e);
//     }
    
//     return {
//       id: 0,
//       username: 'utilisateur',
//       first_name: 'Utilisateur',
//       last_name: 'Inconnu',
//       email: 'user@example.com',
//       is_active: true,
//       date_joined: new Date().toISOString(),
//       role: 'user',
//       departement: ''
//     };
//   };

//   const filterActiveIncidents = (incidentsList: FormattedIncident[]): FormattedIncident[] => {
//     return safeFilter<FormattedIncident>(
//       incidentsList, 
//       i => i.statut === 'ouvert' || i.statut === 'en_cours'
//     );
//   };

//   // Fonction pour récupérer le nom du signaleur
//   const getSignaleurName = async (incident: any): Promise<string> => {
//     if (!incident) return 'Non spécifié';
    
//     // Liste des sources possibles
//     const sources = [
//       incident.utilisateur_nom,
//       incident.signaleur_nom,
//       incident.signaleur_prenom && incident.signaleur_nom 
//         ? `${incident.signaleur_prenom} ${incident.signaleur_nom}`
//         : null,
//       incident.signaleur_nom_complet,
//       incident.utilisateur_signaleur_details 
//         ? formatUserName(incident.utilisateur_signaleur_details)
//         : null,
//       incident.signaleur_details 
//         ? formatUserName(incident.signaleur_details)
//         : null,
//       incident.user_details 
//         ? formatUserName(incident.user_details)
//         : null,
//       ...(incident.utilisateur_signaleur ? 
//         [await fetchUserDetails(incident.utilisateur_signaleur).then(user => 
//           user ? formatUserName(user) : null
//         )] 
//         : []),
//       incident.utilisateur_signaleur 
//         ? `Utilisateur #${incident.utilisateur_signaleur}`
//         : null,
//     ];
    
//     // Prendre la première source valide
//     for (const source of sources) {
//       if (source && source !== 'null' && source !== 'undefined' && source !== 'Non spécifié') {
//         return source;
//       }
//     }
    
//     return 'Non spécifié';
//   };

//   // Fonction pour récupérer les détails d'un matériel
//   const getMaterielDetails = async (materielId: number): Promise<any> => {
//     if (!materielId) return null;
    
//     // Chercher d'abord dans les matériels déjà chargés
//     const existingMateriel = materiels.find(m => m.id === materielId);
//     if (existingMateriel) {
//       return existingMateriel;
//     }
    
//     // Sinon récupérer depuis l'API
//     try {
//       const response = await materielsAPI.getById(materielId);
//       const materielData = extractDataFromResponse(response)[0];
//       return materielData;
//     } catch (error) {
//       console.error(`❌ Erreur récupération matériel #${materielId}:`, error);
//       return null;
//     }
//   };

//   // Fonction pour récupérer le nom d'un matériel
//   const getMaterielName = async (materielId: number): Promise<string> => {
//     const materiel = await getMaterielDetails(materielId);
//     return materiel ? formatMaterielName(materiel) : 'Matériel non spécifié';
//   };

//   // NOUVELLE FONCTION : Mettre à jour le statut des incidents basé sur l'état du matériel
//   const updateIncidentStatusBasedOnMaterial = async (): Promise<void> => {
//     try {
//       console.log('🔄 Vérification auto-résolution des incidents...');
      
//       const updatedIncidents = [...incidents];
//       let updatedCount = 0;
      
//       for (const incident of updatedIncidents) {
//         if (!incident.materiel) continue;
        
//         // Récupérer l'état actuel du matériel
//         const materiel = await getMaterielDetails(incident.materiel);
//         if (!materiel) continue;
        
//         // Déterminer le nouveau statut basé sur l'état du matériel
//         const newStatut = getStatutIncidentParEtatMateriel(materiel, incident.statut);
        
//         // Si le statut a changé, mettre à jour l'incident
//         if (newStatut !== incident.statut) {
//           console.log(`🔄 Auto-mise à jour incident #${incident.id}: ${incident.statut} -> ${newStatut}`);
          
//           // Mettre à jour l'incident localement
//           incident.statut = newStatut;
          
//           // Si le matériel est fonctionnel et l'incident était ouvert/en cours, mettre à jour la date de résolution
//           if ((newStatut === 'resolu' || newStatut === 'ferme') && 
//               (incident.statut === 'ouvert' || incident.statut === 'en_cours')) {
//             incident.date_resolution = new Date().toISOString();
            
//             // Mettre à jour dans l'API si auto-résolution activée
//             if (shouldAutoResolve) {
//               try {
//                 await incidentsAPI.update(incident.id, {
//                   statut: newStatut,
//                   date_resolution: incident.date_resolution
//                 });
//                 console.log(`✅ Incident #${incident.id} auto-résolu via API`);
//               } catch (err) {
//                 console.error(`❌ Erreur auto-résolution API incident #${incident.id}:`, err);
//               }
//             }
//           }
          
//           updatedCount++;
//         }
//       }
      
//       if (updatedCount > 0) {
//         setIncidents(updatedIncidents);
//         const activeOnes = filterActiveIncidents(updatedIncidents);
//         setActiveIncidents(activeOnes);
//         console.log(`✅ ${updatedCount} incidents mis à jour basé sur l'état du matériel`);
//       }
//     } catch (error) {
//       console.error('❌ Erreur mise à jour auto-statut:', error);
//     }
//   };

//   // Charger les incidents avec les détails du matériel
//   const fetchIncidents = async () => {
//     try {
//       setLoading(true);
//       console.log('🔄 Chargement des incidents...');
      
//       const response = await incidentsAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
      
//       // Formater les incidents avec les informations complètes
//       const formattedIncidentsPromises = extractedData.map(async (incident: any) => {
//         try {
//           // 1. Récupérer le nom du signaleur
//           const signaleurNom = await getSignaleurName(incident);
          
//           // 2. Récupérer les détails du matériel
//           let materielDetails = null;
//           let materielNom = 'Non spécifié';
//           let isPanne = false;
          
//           const materielId = incident.materiel_concerne || incident.materiel;
//           if (materielId) {
//             materielDetails = await getMaterielDetails(materielId);
//             if (materielDetails) {
//               materielNom = formatMaterielName(materielDetails);
//               isPanne = isMaterielEnEtatPanne(materielDetails);
              
//               // NOUVEAU : Ajuster le statut de l'incident basé sur l'état du matériel
//               if (shouldAutoResolve) {
//                 const statutBasedOnMaterial = getStatutIncidentParEtatMateriel(materielDetails, incident.statut || 'ouvert');
//                 incident.statut = statutBasedOnMaterial;
                
//                 // Si le statut devient résolu et qu'il n'y a pas de date de résolution
//                 if ((statutBasedOnMaterial === 'resolu' || statutBasedOnMaterial === 'ferme') && 
//                     !incident.date_resolution) {
//                   incident.date_resolution = new Date().toISOString();
//                 }
//               }
//             }
//           }
          
//           // Créer l'incident formaté
//           const formattedIncident: FormattedIncident = {
//             id: incident.id || 0,
//             description: incident.description || '',
//             type_incident: incident.type_incident || 'materiel',
//             priorite: incident.priorite || 'moyenne',
//             statut: incident.statut || 'ouvert',
//             date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
//             date_resolution: incident.date_resolution || null,
//             utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
//             materiel: materielId || null,
//             logiciel: incident.logiciel_concerne || incident.logiciel || null,
//             reseau: incident.reseau_concerne || incident.reseau || null,
            
//             // Informations formatées
//             utilisateur_nom: signaleurNom,
//             materiel_nom: isPanne ? `🚨 ${materielNom}` : materielNom,
//             logiciel_nom: incident.logiciel_nom || 'Non spécifié',
//             materiel_details: materielDetails,
//             signaleur_details: incident.utilisateur_signaleur_details || incident.signaleur_details
//           };
          
//           return formattedIncident;
//         } catch (error) {
//           console.error(`❌ Erreur formatage incident ${incident.id}:`, error);
//           return null;
//         }
//       });
      
//       const formattedIncidentsResults = await Promise.all(formattedIncidentsPromises);
//       const formattedIncidents = formattedIncidentsResults.filter(inc => inc !== null) as FormattedIncident[];
      
//       // Trouver les incidents actifs
//       const activeOnes = filterActiveIncidents(formattedIncidents);
//       setActiveIncidents(activeOnes);
      
//       // Trouver les matériels en panne
//       const panneMateriels = materiels.filter(materiel => {
//         const isPanne = isMaterielEnEtatPanne(materiel);
        
//         // Vérifier aussi s'il est lié à un incident actif
//         const hasActiveIncident = formattedIncidents.some(incident => 
//           incident.materiel === materiel.id && 
//           (incident.statut === 'ouvert' || incident.statut === 'en_cours')
//         );
        
//         return isPanne || hasActiveIncident;
//       });
      
//       setMaterielsEnPanne(panneMateriels);
      
//       setIncidents(formattedIncidents);
//       setFilteredIncidents(formattedIncidents);
//       setError('');
      
//       console.log(`✅ ${formattedIncidents.length} incidents chargés`);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement incidents:', err);
//       const errorMsg = handleApiError(err);
//       setError(errorMsg);
//       showMessage('error', errorMsg);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchRelatedData = async () => {
//     try {
//       console.log('🔄 Chargement des données liées...');
      
//       const [materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
//         materielsAPI.getAll(),
//         logicielsAPI.getAll(),
//         reseauAPI.getAll()
//       ]);
      
//       let materielsData: Materiel[] = [];
//       if (materielsRes.status === 'fulfilled') {
//         materielsData = extractDataFromResponse(materielsRes.value);
//         console.log(`✅ ${materielsData.length} matériels chargés`);
//       }
      
//       let logicielsData: Logiciel[] = [];
//       if (logicielsRes.status === 'fulfilled') {
//         logicielsData = extractDataFromResponse(logicielsRes.value);
//         console.log(`✅ ${logicielsData.length} logiciels chargés`);
//       }
      
//       let reseauxData: Reseau[] = [];
//       if (reseauxRes.status === 'fulfilled') {
//         reseauxData = extractDataFromResponse(reseauxRes.value);
//         console.log(`✅ ${reseauxData.length} réseaux chargés`);
//       }
      
//       setMateriels(materielsData);
//       setLogiciels(logicielsData);
//       setReseaux(reseauxData);
      
//     } catch (err: any) {
//       console.error('❌ Erreur chargement données liées:', err);
//     }
//   };

//   useEffect(() => {
//     const loadInitialData = async () => {
//       await fetchRelatedData();
//       await fetchIncidents();
//     };
    
//     loadInitialData();
//   }, []);

//   // Rafraîchir les incidents quand les matériels changent
//   useEffect(() => {
//     if (materiels.length > 0 && incidents.length === 0) {
//       fetchIncidents();
//     }
//   }, [materiels]);

//   // NOUVEAU : Vérifier périodiquement l'état des matériels pour auto-résoudre les incidents
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (shouldAutoResolve && incidents.length > 0) {
//         updateIncidentStatusBasedOnMaterial();
//       }
//     }, 30000); // Vérifier toutes les 30 secondes
    
//     return () => clearInterval(interval);
//   }, [incidents, materiels, shouldAutoResolve]);

//   useEffect(() => {
//     filterIncidents();
//   }, [incidents, searchTerm, filterStatut, filterPriorite, filterType, showActiveOnly]);

//   useEffect(() => {
//     if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedIncidents, filteredIncidents]);

//   const filterIncidents = () => {
//     let filtered = showActiveOnly ? activeIncidents : safeArray<FormattedIncident>(incidents);

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = safeFilter<FormattedIncident>(filtered, incident => 
//         (incident.description?.toLowerCase() || '').includes(searchLower) ||
//         (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
//         (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
//       );
//     }

//     if (filterStatut) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
//     }

//     if (filterPriorite) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
//     }

//     if (filterType) {
//       filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
//     }

//     setFilteredIncidents(filtered);
//     setSelectedIncidents([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Gestion de la réparation
//   const handleReparationSubmit = async (reparationData: any) => {
//     try {
//       // Créer la réparation
//       await reparationsAPI.create(reparationData);
      
//       // NOUVEAU : Vérifier si le matériel est maintenant fonctionnel
//       if (reparationData.materiel_id) {
//         try {
//           const materiel = await getMaterielDetails(reparationData.materiel_id);
//           if (materiel && isMaterielEnEtatFonctionnel(materiel)) {
//             // Trouver tous les incidents actifs liés à ce matériel
//             const incidentsActifsMateriel = incidents.filter(inc => 
//               inc.materiel === reparationData.materiel_id && 
//               (inc.statut === 'ouvert' || inc.statut === 'en_cours')
//             );
            
//             // Auto-résoudre ces incidents
//             for (const incident of incidentsActifsMateriel) {
//               if (incident.id) {
//                 await incidentsAPI.update(incident.id, {
//                   statut: 'resolu',
//                   date_resolution: new Date().toISOString()
//                 });
//                 console.log(`✅ Incident #${incident.id} auto-résolu après réparation`);
//               }
//             }
//           }
//         } catch (error) {
//           console.error('❌ Erreur vérification état matériel:', error);
//         }
//       }
      
//       if (incidentToRepair && incidentToRepair.id) {
//         // Mettre à jour l'incident spécifique
//         const materiel = await getMaterielDetails(incidentToRepair.materiel || 0);
//         if (materiel && isMaterielEnEtatFonctionnel(materiel)) {
//           await incidentsAPI.update(incidentToRepair.id, {
//             statut: 'resolu',
//             date_resolution: new Date().toISOString()
//           });
//           showMessage('success', `✅ Réparation créée et incident #${incidentToRepair.id} auto-résolu!`);
//         } else {
//           await incidentsAPI.update(incidentToRepair.id, {
//             statut: 'en_cours'
//           });
//           showMessage('success', `✅ Réparation créée et incident #${incidentToRepair.id} mis en cours!`);
//         }
//       } else {
//         showMessage('success', 'Réparation créée avec succès!');
//       }
      
//       // Rafraîchir les données
//       await Promise.all([
//         fetchIncidents(),
//         fetchRelatedData()
//       ]);
      
//       setIsRepairFormOpen(false);
//       setIncidentToRepair(null);
      
//     } catch (error: any) {
//       console.error('❌ Erreur création réparation:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   // Lancer la réparation immédiate
//   const handleRepairImmediate = (incident: FormattedIncident) => {
//     setIncidentToRepair(incident);
//     setIsRepairFormOpen(true);
//   };

//   const handleSubmit = async (incidentData: any) => {
//     try {
//       const currentUser = getCurrentUser();
      
//       const formattedData: any = {
//         description: incidentData.description,
//         type_incident: incidentData.type_incident,
//         priorite: incidentData.priorite,
//         statut: incidentData.statut,
//         utilisateur_signaleur: currentUser.id
//       };
      
//       if (incidentData.date_creation) {
//         formattedData.date_creation = incidentData.date_creation;
//       } else if (editingIncident && editingIncident.date_creation) {
//         formattedData.date_creation = editingIncident.date_creation;
//       }
      
//       if (incidentData.date_resolution) {
//         formattedData.date_resolution = incidentData.date_resolution;
//       }
      
//       if (incidentData.materiel && incidentData.materiel > 0) {
//         formattedData.materiel_concerne = incidentData.materiel;
//       }
//       if (incidentData.logiciel && incidentData.logiciel > 0) {
//         formattedData.logiciel_concerne = incidentData.logiciel;
//       }
//       if (incidentData.reseau && incidentData.reseau > 0) {
//         formattedData.reseau_concerne = incidentData.reseau;
//       }
      
//       if (editingIncident && editingIncident.id) {
//         await incidentsAPI.update(editingIncident.id, formattedData);
//         showMessage('success', 'Incident modifié avec succès');
//       } else {
//         await incidentsAPI.create(formattedData);
//         showMessage('success', 'Incident créé avec succès');
//       }
      
//       await fetchIncidents();
//       setIsFormOpen(false);
//       setEditingIncident(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur soumission incident:', error);
//       const errorMsg = handleApiError(error);
//       showMessage('error', errorMsg);
//     }
//   };

//   const toggleSelectIncident = (id: number) => {
//     setSelectedIncidents(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedIncidents([]);
//     } else {
//       const allIds = filteredIncidents
//         .map(i => i.id)
//         .filter((id): id is number => id !== undefined);
//       setSelectedIncidents(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIncidents.length} incident(s) ?`)) {
//       try {
//         const deletePromises = selectedIncidents.map(id => 
//           incidentsAPI.delete(id).catch(err => {
//             console.error(`Erreur suppression incident ${id}:`, err);
//             return null;
//           })
//         );
        
//         await Promise.all(deletePromises);
        
//         showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
//         setSelectedIncidents([]);
//         await fetchIncidents();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression incidents:', error);
//         showMessage('error', handleApiError(error));
//       }
//     }
//   };

//   const handleResoudreSelected = async () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     try {
//       const resolvePromises = selectedIncidents.map(id => 
//         incidentsAPI.resoudre(id).catch(err => {
//           console.error(`Erreur résolution incident ${id}:`, err);
//           return null;
//         })
//       );
      
//       await Promise.all(resolvePromises);
      
//       showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
//       setSelectedIncidents([]);
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incidents:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedIncidents.length === 0) {
//       showMessage('error', 'Aucun incident sélectionné');
//       return;
//     }

//     if (selectedIncidents.length === 1) {
//       const incident = incidents.find(i => i.id === selectedIncidents[0]);
//       if (incident) {
//         handleEdit(incident);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedIncidents.length} incidents`);
//     }
//   };

//   const handleEdit = (incident: FormattedIncident) => {
//     setEditingIncident(incident);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
//       try {
//         await incidentsAPI.delete(id);
//         showMessage('success', 'Incident supprimé avec succès');
//         await fetchIncidents();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression incident:', error);
//         showMessage('error', handleApiError(error));
//       }
//     }
//   };

//   const handleResoudre = async (id: number) => {
//     try {
//       await incidentsAPI.resoudre(id);
//       showMessage('success', 'Incident marqué comme résolu');
//       await fetchIncidents();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution incident:', error);
//       showMessage('error', handleApiError(error));
//     }
//   };

//   const handleAddNew = () => {
//     setEditingIncident(undefined);
//     setIsFormOpen(true);
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchIncidents();
//     showMessage('success', 'Données rafraîchies');
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredIncidents.map(i => ({
//         ID: i.id,
//         Description: i.description,
//         'Matériel concerné': i.materiel_nom || 'Non spécifié',
//         Type: getTypeText(i.type_incident),
//         Priorité: getPriorityText(i.priorite),
//         Statut: getStatusText(i.statut),
//         'Utilisateur signaleur': i.utilisateur_nom || 'Non spécifié',
//         'Date création': i.date_creation ? new Date(i.date_creation).toLocaleDateString('fr-FR') : 'Non spécifiée'
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
//       link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterStatut('');
//     setFilterPriorite('');
//     setFilterType('');
//     setSelectedIncidents([]);
//     setShowActiveOnly(false);
//   };

//   const toggleActiveOnly = () => {
//     setShowActiveOnly(!showActiveOnly);
//   };

//   // NOUVELLE FONCTION : Toggle auto-résolution
//   const toggleAutoResolution = () => {
//     setShouldAutoResolve(!shouldAutoResolve);
//     showMessage('info', `Auto-résolution ${!shouldAutoResolve ? 'activée' : 'désactivée'}`);
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
//       case 'en_cours': return <Clock className="w-4 h-4" />;
//       case 'resolu': return <CheckCircle className="w-4 w-4" />;
//       case 'ferme': return <CheckCircle className="w-4 w-4" />;
//       default: return <AlertTriangle className="w-4 h-4" />;
//     }
//   };

//   const getPriorityBadge = (priority: string) => {
//     const badges: Record<string, string> = {
//       critique: 'badge-error',
//       elevee: 'badge-warning',
//       moyenne: 'badge-info',
//       basse: 'badge-success'
//     };
//     return badges[priority] || 'badge-neutral';
//   };

//   const getPriorityText = (priority: string) => {
//     const texts: Record<string, string> = {
//       critique: 'Critique',
//       elevee: 'Élevée',
//       moyenne: 'Moyenne',
//       basse: 'Basse'
//     };
//     return texts[priority] || priority;
//   };

//   const getStatusBadge = (status: string) => {
//     const badges: Record<string, string> = {
//       ouvert: 'badge-warning',
//       en_cours: 'badge-info',
//       resolu: 'badge-success',
//       ferme: 'badge-neutral'
//     };
//     return badges[status] || 'badge-neutral';
//   };

//   const getStatusText = (status: string) => {
//     const texts: Record<string, string> = {
//       ouvert: 'Ouvert',
//       en_cours: 'En cours',
//       resolu: 'Résolu',
//       ferme: 'Fermé'
//     };
//     return texts[status] || status;
//   };

//   const getTypeText = (type: string) => {
//     const texts: Record<string, string> = {
//       materiel: 'Matériel',
//       logiciel: 'Logiciel',
//       reseau: 'Réseau',
//       mixte: 'Mixte'
//     };
//     return texts[type] || type;
//   };

//   // Statistiques
//   const stats = {
//     total: safeArray<FormattedIncident>(incidents).length,
//     ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
//     en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
//     resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu' || i.statut === 'ferme').length,
//     actifs: activeIncidents.length,
//     materielsPanne: materielsEnPanne.length
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Chargement des incidents...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4 shadow-lg`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4 shadow-lg">
//           <AlertTriangle className="h-5 w-5" />
//           <span>{error}</span>
//           <button 
//             className="btn btn-sm btn-ghost"
//             onClick={handleRefresh}
//           >
//             <RefreshCw className="h-4 w-4" />
//             Réessayer
//           </button>
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray<FormattedIncident>(filteredIncidents).length} incidents trouvés
//             {selectedIncidents.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedIncidents.length} sélectionné(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2 flex-wrap">
//           {/* Bouton auto-résolution */}
//           <button
//             onClick={toggleAutoResolution}
//             className={`btn btn-sm ${shouldAutoResolve ? 'btn-success' : 'btn-outline'}`}
//             title={shouldAutoResolve ? 'Auto-résolution activée' : 'Auto-résolution désactivée'}
//           >
//             <CheckCircle className="h-4 w-4 mr-2" />
//             {shouldAutoResolve ? 'Auto-résolution: ON' : 'Auto-résolution: OFF'}
//           </button>
          
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
//             disabled={filteredIncidents.length === 0}
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouvel incident
//           </button>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Total</p>
//                 <p className="text-2xl font-bold text-base-content">{stats.total}</p>
//               </div>
//               <div className="text-2xl">📊</div>
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Ouverts</p>
//                 <p className="text-2xl font-bold text-orange-600">{stats.ouvert}</p>
//               </div>
//               <AlertTriangle className="w-6 h-6 text-orange-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">En cours</p>
//                 <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
//               </div>
//               <Clock className="w-6 h-6 text-blue-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-base-200 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Résolus</p>
//                 <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
//               </div>
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             </div>
//           </div>
//         </div>
        
//         <div className="card bg-warning/10 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Actifs</p>
//                 <p className="text-2xl font-bold text-warning">{stats.actifs}</p>
//               </div>
//               <Wrench className="w-6 h-6 text-warning" />
//             </div>
//             {stats.actifs > 0 && (
//               <div className="mt-2">
//                 <button
//                   onClick={toggleActiveOnly}
//                   className="btn btn-warning btn-xs w-full mt-1"
//                 >
//                   {showActiveOnly ? 'Voir tous' : 'Voir actifs'}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
        
//         <div className="card bg-error/10 shadow-xl">
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">En panne</p>
//                 <p className="text-2xl font-bold text-error">{stats.materielsPanne}</p>
//               </div>
//               <Monitor className="w-6 h-6 text-error" />
//             </div>
//           </div>
//         </div>
        
//         {/* Carte Auto-résolution */}
//         <div className={`card ${shouldAutoResolve ? 'bg-success/10' : 'bg-base-200'} shadow-xl`}>
//           <div className="card-body py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-base-content opacity-70">Auto-résolution</p>
//                 <p className={`text-2xl font-bold ${shouldAutoResolve ? 'text-success' : 'text-base-content'}`}>
//                   {shouldAutoResolve ? 'ON' : 'OFF'}
//                 </p>
//               </div>
//               <CheckCircle className={`w-6 h-6 ${shouldAutoResolve ? 'text-success' : 'text-base-content opacity-40'}`} />
//             </div>
//             <div className="mt-2">
//               <button
//                 onClick={toggleAutoResolution}
//                 className={`btn btn-xs w-full mt-1 ${shouldAutoResolve ? 'btn-success' : 'btn-outline'}`}
//               >
//                 {shouldAutoResolve ? 'Désactiver' : 'Activer'}
//               </button>
//             </div>
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
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Description, matériel, signaleur..."
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
//                 <option value="ouvert">Ouvert</option>
//                 <option value="en_cours">En cours</option>
//                 <option value="resolu">Résolu</option>
//                 <option value="ferme">Fermé</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">⚠️ Priorité</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterPriorite}
//                 onChange={(e) => setFilterPriorite(e.target.value)}
//               >
//                 <option value="">Toutes les priorités</option>
//                 <option value="critique">Critique</option>
//                 <option value="elevee">Élevée</option>
//                 <option value="moyenne">Moyenne</option>
//                 <option value="basse">Basse</option>
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
//                 <option value="materiel">Matériel</option>
//                 <option value="logiciel">Logiciel</option>
//                 <option value="reseau">Réseau</option>
//                 <option value="mixte">Mixte</option>
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

//           {/* Info auto-résolution */}
//           {shouldAutoResolve && (
//             <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="h-4 w-4 text-success" />
//                 <span className="text-sm font-medium text-success">Auto-résolution activée</span>
//                 <span className="text-xs opacity-70 ml-auto">
//                   Les incidents seront auto-résolus lorsque le matériel devient "fonctionnel"
//                 </span>
//               </div>
//             </div>
//           )}

//           {selectedIncidents.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedIncidents.length} incident(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={handleResoudreSelected}
//                     className="btn btn-success btn-sm gap-2"
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                     Résoudre ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedIncidents.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedIncidents([])}
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

//       {/* Tableau des incidents */}
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
//                         disabled={filteredIncidents.length === 0}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-5 w-5 text-primary" />
//                         ) : (
//                           <Square className="h-5 w-5 text-base-content/40" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th className="font-bold">Description</th>
//                   <th className="font-bold">Matériel concerné</th>
//                   <th className="font-bold">Type</th>
//                   <th className="font-bold">Priorité</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold">Date création</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray<FormattedIncident>(filteredIncidents).map((incident) => {
//                   const isPanne = incident.materiel_nom?.includes('🚨');
                  
//                   return (
//                     <tr key={incident.id} className="hover">
//                       <td className="text-center">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm"
//                             checked={selectedIncidents.includes(incident.id || 0)}
//                             onChange={() => toggleSelectIncident(incident.id || 0)}
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Colonne Description */}
//                       <td>
//                         <div className="max-w-xs">
//                           <div className="font-medium text-base-content line-clamp-2">
//                             {incident.description}
//                           </div>
                          
//                           {/* Signaleur */}
//                           <div className="text-sm text-base-content opacity-70 mt-1 flex items-center gap-1">
//                             <User className="h-3 w-3" />
//                             <span className="font-medium">Signaleur:</span> 
//                             <span className="ml-1">
//                               {incident.utilisateur_nom || 'Non spécifié'}
//                             </span>
//                           </div>
//                         </div>
//                       </td>
                      
//                       {/* Matériel concerné */}
//                       <td>
//                         <div className="flex flex-col gap-2">
//                           {/* Nom et icône du matériel */}
//                           <div className="flex items-center gap-2">
//                             {getMaterielIcon(incident.materiel_details?.type)}
//                             <div className="flex-1">
//                               <span className={`font-medium ${isPanne ? 'text-error' : 'text-base-content'}`}>
//                                 {incident.materiel_nom || 'Non spécifié'}
//                               </span>
//                             </div>
//                           </div>
                          
//                           {/* Détails supplémentaires si disponibles */}
//                           {incident.materiel_details && (
//                             <div className="text-xs text-base-content opacity-70">
//                               <div className="grid grid-cols-2 gap-1">
//                                 {incident.materiel_details.reference && (
//                                   <div className="flex items-center gap-1">
//                                     <span className="font-medium">Réf:</span>
//                                     <span className="badge badge-xs badge-outline">
//                                       {incident.materiel_details.reference}
//                                     </span>
//                                   </div>
//                                 )}
                                
//                                 {incident.materiel_details.etat && (
//                                   <div className="flex items-center gap-1">
//                                     <span className="font-medium">État:</span>
//                                     <span className={`badge badge-xs ${
//                                       isMaterielEnEtatPanne(incident.materiel_details) 
//                                         ? 'badge-error' 
//                                         : isMaterielEnEtatFonctionnel(incident.materiel_details)
//                                         ? 'badge-success'
//                                         : 'badge-warning'
//                                     }`}>
//                                       {incident.materiel_details.etat}
//                                     </span>
//                                   </div>
//                                 )}
                                
//                                 {incident.materiel_details.service_attribue && (
//                                   <div className="col-span-2 flex items-center gap-1">
//                                     <span className="font-medium">Service:</span>
//                                     <span>{incident.materiel_details.service_attribue}</span>
//                                   </div>
//                                 )}
                                
//                                 {incident.materiel_details.utilisateur_attribue && (
//                                   <div className="col-span-2 flex items-center gap-1">
//                                     <span className="font-medium">Utilisateur:</span>
//                                     <span>{incident.materiel_details.utilisateur_attribue}</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           )}
                          
//                           {/* Bouton de réparation si le matériel est en panne */}
//                           {isPanne && incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
//                             <button
//                               onClick={() => handleRepairImmediate(incident)}
//                               className="btn btn-error btn-xs w-full mt-1 gap-1"
//                             >
//                               <Wrench className="h-3 w-3" />
//                               Réparer immédiatement
//                             </button>
//                           )}
//                         </div>
//                       </td>
                      
//                       {/* Colonne Type */}
//                       <td>
//                         <span className="text-sm font-medium capitalize">
//                           {getTypeText(incident.type_incident)}
//                         </span>
//                       </td>
                      
//                       {/* Colonne Priorité */}
//                       <td>
//                         <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg`}>
//                           {getPriorityText(incident.priorite)}
//                         </div>
//                       </td>
                      
//                       {/* Colonne Statut */}
//                       <td>
//                         <div className="flex items-center gap-2">
//                           {getStatusIcon(incident.statut)}
//                           <div className={`badge ${getStatusBadge(incident.statut)}`}>
//                             {getStatusText(incident.statut)}
//                           </div>
//                         </div>
//                       </td>
                      
//                       {/* Colonne Date */}
//                       <td>
//                         <span className="text-sm font-medium">
//                           {incident.date_creation ? new Date(incident.date_creation).toLocaleDateString('fr-FR') : '-'}
//                         </span>
//                         <div className="text-xs text-base-content opacity-60 mt-1">
//                           {incident.date_creation ? new Date(incident.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
//                         </div>
//                       </td>
                      
//                       {/* Colonne Actions */}
//                       <td>
//                         <div className="flex justify-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(incident)}
//                             className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
                          
//                           {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
//                             <button
//                               onClick={() => handleResoudre(incident.id || 0)}
//                               className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                               title="Marquer comme résolu"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                             </button>
//                           )}
                          
//                           <button
//                             onClick={() => handleDelete(incident.id || 0)}
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

//           {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <Search className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucun incident trouvé</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterStatut || filterPriorite || filterType || showActiveOnly
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucun incident n'est enregistré dans le système"
//                   }
//                 </p>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-primary btn-sm mt-4"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Créer le premier incident
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Formulaire d'incident */}
//       <IncidentForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingIncident(undefined);
//         }}
//         onSubmit={handleSubmit}
//         incident={editingIncident}
//         currentUser={getCurrentUser()}
//       />

//       {/* Formulaire de réparation */}
//       <ReparationForm
//         isOpen={isRepairFormOpen}
//         onClose={() => {
//           setIsRepairFormOpen(false);
//           setIncidentToRepair(null);
//         }}
//         onSubmit={handleReparationSubmit}
//         incidentSource={incidentToRepair}
//         materiels={materiels}
//         incidents={incidents}
//       />
//     </div>
//   );
// };

// export default Incidents;




// src/pages/Incidents.tsx - AVEC AUTO-LOGGER AJOUTÉ
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  CheckSquare, 
  Square, 
  X, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  RefreshCw,
  Wrench,
  User,
  Server,
  Monitor,
  Cpu,
  Printer,
  Network,
  HardDrive
} from 'lucide-react';
import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
import api, { incidentsAPI, materielsAPI, reparationsAPI, handleApiError } from '../services/api';
import IncidentForm from '../components/IncidentForm';
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
      'import': 'IMPORTATION',
      'resolve': 'RÉSOLUTION'
    };
    
    const action = actionsMap[operation] || operation.toUpperCase();
    const details = `${operation === 'create' ? 'Ajout' : 
                     operation === 'read' ? 'Consultation' :
                     operation === 'update' ? 'Modification' :
                     operation === 'delete' ? 'Suppression' :
                     operation === 'export' ? 'Export' :
                     operation === 'import' ? 'Import' :
                     operation === 'resolve' ? 'Résolution' : operation} ${module.toLowerCase()}: ${itemName}`;
    
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
  
  const logAutoResolve = (incidentId, materielId, oldStatus, newStatus) => {
    logAction('AUTO-RÉSOLUTION', 'Incidents', `Incident #${incidentId} auto-résolu (${oldStatus} → ${newStatus})`, {
      incidentId: incidentId,
      materielId: materielId,
      oldStatus: oldStatus,
      newStatus: newStatus,
      type: 'auto_resolve'
    });
  };
  
  const logRepair = (operation, incidentId, materielId, details) => {
    const action = operation === 'create' ? 'RÉPARATION' : 'MODIFICATION RÉPARATION';
    logAction(action, 'Réparations', `Réparation ${operation === 'create' ? 'créée' : 'modifiée'} pour incident #${incidentId}`, {
      incidentId: incidentId,
      materielId: materielId,
      operation: operation,
      details: details
    });
  };
  
  return {
    logAction,
    logCRUD,
    logSearch,
    logFilter,
    logExport,
    logAutoResolve,
    logRepair,
    
    // Fonctions spécifiques pour les incidents
    logIncidentCreate: (incidentData) => 
      logCRUD('create', 'Incidents', `Incident: ${incidentData.description?.substring(0, 50)}...` || 'Nouvel incident', { data: incidentData }),
    
    logIncidentUpdate: (id, oldData, newData) => 
      logCRUD('update', 'Incidents', `Incident #${id}`, {
        id: id,
        oldData: oldData,
        newData: newData,
        changes: getChanges(oldData, newData)
      }),
    
    logIncidentDelete: (id, incidentData) =>
      logCRUD('delete', 'Incidents', `Incident #${id}`, { id: id, data: incidentData }),
    
    logIncidentResolve: (id, incidentData) =>
      logCRUD('resolve', 'Incidents', `Incident #${id} résolu`, { id: id, data: incidentData }),
    
    logIncidentExport: (format, count, filters) =>
      logExport('Incidents', format, count, filters),
    
    logIncidentView: (incident) =>
      logCRUD('read', 'Incidents', `Incident #${incident.id}`, { id: incident.id, data: incident }),
    
    logIncidentSearch: (term, count) =>
      logSearch('Incidents', term, count),
    
    logIncidentFilter: (filterType, count) =>
      logFilter('Incidents', filterType, count)
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

// Type pour les incidents formatés
interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom'> {
  utilisateur_nom?: string;
  materiel_nom?: string;
  logiciel_nom?: string;
  materiel_details?: {
    id: number;
    nom: string;
    reference?: string;
    type?: string;
    etat?: string;
    service_attribue?: string;
    utilisateur_attribue?: string;
  } | null;
  signaleur_details?: any;
}

// Fonctions helper
const safeArray = <T,>(data: any): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (data.results && Array.isArray(data.results)) return data.results as T[];
  if (data.data && Array.isArray(data.data)) return data.data as T[];
  return [];
};

const safeFilter = <T,>(array: T[], condition: (item: T) => boolean): T[] => {
  if (!Array.isArray(array)) return [];
  return array.filter(condition);
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

// Fonction pour récupérer les détails d'un utilisateur depuis l'API
const fetchUserDetails = async (userId: number): Promise<any> => {
  try {
    const response = await api.get(`/users/${userId}/`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur récupération utilisateur #${userId}:`, error);
    return null;
  }
};

// Fonction pour formater le nom d'un utilisateur
const formatUserName = (user: any): string => {
  if (!user) return 'Non spécifié';
  
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  
  if (user.nom && user.prenom) {
    return `${user.prenom} ${user.nom}`;
  }
  
  if (user.nom_complet) {
    return user.nom_complet;
  }
  
  if (user.username) {
    return user.username;
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  if (user.id) {
    return `Utilisateur #${user.id}`;
  }
  
  return 'Non spécifié';
};

// NOUVELLE FONCTION : Vérifier si un matériel est en état "panne"
const isMaterielEnEtatPanne = (materiel: any): boolean => {
  if (!materiel || !materiel.etat) return false;
  
  const etat = (materiel.etat || '').toLowerCase().trim();
  
  const etatsPanne = [
    'panne',
    'en_panne',
    'en panne',
    'broken',
    'out of order',
    'hors service',
    'defective',
    'faulty',
    'défectueux'
  ];
  
  return etatsPanne.some(panneEtat => 
    etat.includes(panneEtat)
  );
};

// NOUVELLE FONCTION : Vérifier si un matériel est en état "fonctionnel/réparé"
const isMaterielEnEtatFonctionnel = (materiel: any): boolean => {
  if (!materiel || !materiel.etat) return false;
  
  const etat = (materiel.etat || '').toLowerCase().trim();
  
  const etatsFonctionnels = [
    'fonctionnel',
    'fonctionnelle',
    'repare',
    'réparé',
    'reparé',
    'ameliore',
    'amélioré',
    'disponible',
    'en service',
    'actif',
    'opérationnel',
    'operational',
    'working',
    'good'
  ];
  
  return etatsFonctionnels.some(fonctionnelEtat => 
    etat.includes(fonctionnelEtat)
  );
};

// NOUVELLE FONCTION : Déterminer le statut de l'incident basé sur l'état du matériel
const getStatutIncidentParEtatMateriel = (materiel: any, incidentStatut: string): string => {
  if (!materiel) return incidentStatut;
  
  // Si le matériel est en état panne, l'incident devrait être actif
  if (isMaterielEnEtatPanne(materiel)) {
    return 'ouvert'; // Forcer l'incident à "ouvert" si le matériel est en panne
  }
  
  // Si le matériel est fonctionnel, vérifier si l'incident est toujours actif
  if (isMaterielEnEtatFonctionnel(materiel)) {
    if (incidentStatut === 'ouvert' || incidentStatut === 'en_cours') {
      return 'resolu'; // Auto-résoudre si le matériel est réparé
    }
  }
  
  // Si le matériel est en réparation/maintenance, garder l'incident en cours
  const etat = (materiel.etat || '').toLowerCase();
  if (etat.includes('reparation') || etat.includes('maintenance') || etat.includes('amelioration')) {
    return 'en_cours';
  }
  
  return incidentStatut;
};

// Fonction pour formater le nom d'un matériel
const formatMaterielName = (materiel: any): string => {
  if (!materiel) return 'Matériel inconnu';
  
  if (materiel.nom) {
    return materiel.nom;
  }
  
  if (materiel.libelle) {
    return materiel.libelle;
  }
  
  if (materiel.reference) {
    return `Réf: ${materiel.reference}`;
  }
  
  if (materiel.id) {
    return `Matériel #${materiel.id}`;
  }
  
  return 'Matériel non spécifié';
};

// Obtenir l'icône du matériel
const getMaterielIcon = (type?: string) => {
  if (!type) return <Monitor className="h-4 w-4" />;
  
  const typeLower = type.toLowerCase();
  if (typeLower.includes('ordinateur') || typeLower.includes('pc') || typeLower.includes('laptop')) 
    return <Monitor className="h-4 w-4" />;
  if (typeLower.includes('serveur')) return <HardDrive className="h-4 w-4" />;
  if (typeLower.includes('imprimante') || typeLower.includes('printer')) 
    return <Printer className="h-4 w-4" />;
  if (typeLower.includes('réseau') || typeLower.includes('switch') || typeLower.includes('routeur')) 
    return <Network className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
};

const Incidents: React.FC = () => {
  const { user: authUser } = useAuth();
  
  // ==================== INITIALISATION AUTO-LOGGER ====================
  const autoLogger = useAutoLogger();
  
  const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
  const [reseaux, setReseaux] = useState<Reseau[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
  const [activeIncidents, setActiveIncidents] = useState<FormattedIncident[]>([]);
  const [materielsEnPanne, setMaterielsEnPanne] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatut, setFilterStatut] = useState<string>('');
  const [filterPriorite, setFilterPriorite] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<FormattedIncident | undefined>();
  const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  
  // États pour réparation
  const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);
  const [incidentToRepair, setIncidentToRepair] = useState<FormattedIncident | null>(null);
  const [shouldAutoResolve, setShouldAutoResolve] = useState<boolean>(true); // Nouveau état pour auto-résolution

  const getCurrentUser = (): UserType => {
    if (authUser) {
      return {
        id: authUser.id || 0,
        username: authUser.username || '',
        first_name: authUser.first_name || '',
        last_name: authUser.last_name || '',
        email: authUser.email || '',
        is_active: authUser.is_active !== false,
        date_joined: authUser.date_joined || new Date().toISOString(),
        role: authUser.role,
        departement: authUser.departement || '',
        telephone: authUser.telephone || ''
      };
    }
    
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          id: user.id || 0,
          username: user.username || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          is_active: user.is_active !== false,
          date_joined: user.date_joined || new Date().toISOString(),
          role: user.role,
          departement: user.departement || ''
        };
      }
    } catch (e) {
      console.error('Erreur parsing user:', e);
    }
    
    return {
      id: 0,
      username: 'utilisateur',
      first_name: 'Utilisateur',
      last_name: 'Inconnu',
      email: 'user@example.com',
      is_active: true,
      date_joined: new Date().toISOString(),
      role: 'user',
      departement: ''
    };
  };

  const filterActiveIncidents = (incidentsList: FormattedIncident[]): FormattedIncident[] => {
    return safeFilter<FormattedIncident>(
      incidentsList, 
      i => i.statut === 'ouvert' || i.statut === 'en_cours'
    );
  };

  // Fonction pour récupérer le nom du signaleur
  const getSignaleurName = async (incident: any): Promise<string> => {
    if (!incident) return 'Non spécifié';
    
    // Liste des sources possibles
    const sources = [
      incident.utilisateur_nom,
      incident.signaleur_nom,
      incident.signaleur_prenom && incident.signaleur_nom 
        ? `${incident.signaleur_prenom} ${incident.signaleur_nom}`
        : null,
      incident.signaleur_nom_complet,
      incident.utilisateur_signaleur_details 
        ? formatUserName(incident.utilisateur_signaleur_details)
        : null,
      incident.signaleur_details 
        ? formatUserName(incident.signaleur_details)
        : null,
      incident.user_details 
        ? formatUserName(incident.user_details)
        : null,
      ...(incident.utilisateur_signaleur ? 
        [await fetchUserDetails(incident.utilisateur_signaleur).then(user => 
          user ? formatUserName(user) : null
        )] 
        : []),
      incident.utilisateur_signaleur 
        ? `Utilisateur #${incident.utilisateur_signaleur}`
        : null,
    ];
    
    // Prendre la première source valide
    for (const source of sources) {
      if (source && source !== 'null' && source !== 'undefined' && source !== 'Non spécifié') {
        return source;
      }
    }
    
    return 'Non spécifié';
  };

  // Fonction pour récupérer les détails d'un matériel
  const getMaterielDetails = async (materielId: number): Promise<any> => {
    if (!materielId) return null;
    
    // Chercher d'abord dans les matériels déjà chargés
    const existingMateriel = materiels.find(m => m.id === materielId);
    if (existingMateriel) {
      return existingMateriel;
    }
    
    // Sinon récupérer depuis l'API
    try {
      const response = await materielsAPI.getById(materielId);
      const materielData = extractDataFromResponse(response)[0];
      return materielData;
    } catch (error) {
      console.error(`❌ Erreur récupération matériel #${materielId}:`, error);
      return null;
    }
  };

  // Fonction pour récupérer le nom d'un matériel
  const getMaterielName = async (materielId: number): Promise<string> => {
    const materiel = await getMaterielDetails(materielId);
    return materiel ? formatMaterielName(materiel) : 'Matériel non spécifié';
  };

  // NOUVELLE FONCTION : Mettre à jour le statut des incidents basé sur l'état du matériel
  const updateIncidentStatusBasedOnMaterial = async (): Promise<void> => {
    try {
      console.log('🔄 Vérification auto-résolution des incidents...');
      
      const updatedIncidents = [...incidents];
      let updatedCount = 0;
      
      for (const incident of updatedIncidents) {
        if (!incident.materiel) continue;
        
        // Récupérer l'état actuel du matériel
        const materiel = await getMaterielDetails(incident.materiel);
        if (!materiel) continue;
        
        // Déterminer le nouveau statut basé sur l'état du matériel
        const newStatut = getStatutIncidentParEtatMateriel(materiel, incident.statut);
        
        // Si le statut a changé, mettre à jour l'incident
        if (newStatut !== incident.statut) {
          console.log(`🔄 Auto-mise à jour incident #${incident.id}: ${incident.statut} -> ${newStatut}`);
          
          // 🔥 AUTO-LOGGER: Auto-résolution d'incident
          autoLogger.logAutoResolve(incident.id || 0, incident.materiel, incident.statut, newStatut);
          
          // Mettre à jour l'incident localement
          incident.statut = newStatut;
          
          // Si le matériel est fonctionnel et l'incident était ouvert/en cours, mettre à jour la date de résolution
          if ((newStatut === 'resolu' || newStatut === 'ferme') && 
              (incident.statut === 'ouvert' || incident.statut === 'en_cours')) {
            incident.date_resolution = new Date().toISOString();
            
            // Mettre à jour dans l'API si auto-résolution activée
            if (shouldAutoResolve) {
              try {
                await incidentsAPI.update(incident.id, {
                  statut: newStatut,
                  date_resolution: incident.date_resolution
                });
                console.log(`✅ Incident #${incident.id} auto-résolu via API`);
              } catch (err) {
                console.error(`❌ Erreur auto-résolution API incident #${incident.id}:`, err);
              }
            }
          }
          
          updatedCount++;
        }
      }
      
      if (updatedCount > 0) {
        setIncidents(updatedIncidents);
        const activeOnes = filterActiveIncidents(updatedIncidents);
        setActiveIncidents(activeOnes);
        console.log(`✅ ${updatedCount} incidents mis à jour basé sur l'état du matériel`);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour auto-statut:', error);
    }
  };

  // Charger les incidents avec les détails du matériel
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des incidents...');
      
      const response = await incidentsAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      
      // 🔥 AUTO-LOGGER: Chargement des incidents
      autoLogger.logAction('CHARGEMENT', 'Incidents', `Chargement de ${extractedData.length} incidents`, {
        count: extractedData.length,
        type: 'load'
      });
      
      // Formater les incidents avec les informations complètes
      const formattedIncidentsPromises = extractedData.map(async (incident: any) => {
        try {
          // 1. Récupérer le nom du signaleur
          const signaleurNom = await getSignaleurName(incident);
          
          // 2. Récupérer les détails du matériel
          let materielDetails = null;
          let materielNom = 'Non spécifié';
          let isPanne = false;
          
          const materielId = incident.materiel_concerne || incident.materiel;
          if (materielId) {
            materielDetails = await getMaterielDetails(materielId);
            if (materielDetails) {
              materielNom = formatMaterielName(materielDetails);
              isPanne = isMaterielEnEtatPanne(materielDetails);
              
              // NOUVEAU : Ajuster le statut de l'incident basé sur l'état du matériel
              if (shouldAutoResolve) {
                const statutBasedOnMaterial = getStatutIncidentParEtatMateriel(materielDetails, incident.statut || 'ouvert');
                incident.statut = statutBasedOnMaterial;
                
                // Si le statut devient résolu et qu'il n'y a pas de date de résolution
                if ((statutBasedOnMaterial === 'resolu' || statutBasedOnMaterial === 'ferme') && 
                    !incident.date_resolution) {
                  incident.date_resolution = new Date().toISOString();
                }
              }
            }
          }
          
          // Créer l'incident formaté
          const formattedIncident: FormattedIncident = {
            id: incident.id || 0,
            description: incident.description || '',
            type_incident: incident.type_incident || 'materiel',
            priorite: incident.priorite || 'moyenne',
            statut: incident.statut || 'ouvert',
            date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
            date_resolution: incident.date_resolution || null,
            utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
            materiel: materielId || null,
            logiciel: incident.logiciel_concerne || incident.logiciel || null,
            reseau: incident.reseau_concerne || incident.reseau || null,
            
            // Informations formatées
            utilisateur_nom: signaleurNom,
            materiel_nom: isPanne ? `🚨 ${materielNom}` : materielNom,
            logiciel_nom: incident.logiciel_nom || 'Non spécifié',
            materiel_details: materielDetails,
            signaleur_details: incident.utilisateur_signaleur_details || incident.signaleur_details
          };
          
          return formattedIncident;
        } catch (error) {
          console.error(`❌ Erreur formatage incident ${incident.id}:`, error);
          return null;
        }
      });
      
      const formattedIncidentsResults = await Promise.all(formattedIncidentsPromises);
      const formattedIncidents = formattedIncidentsResults.filter(inc => inc !== null) as FormattedIncident[];
      
      // Trouver les incidents actifs
      const activeOnes = filterActiveIncidents(formattedIncidents);
      setActiveIncidents(activeOnes);
      
      // Trouver les matériels en panne
      const panneMateriels = materiels.filter(materiel => {
        const isPanne = isMaterielEnEtatPanne(materiel);
        
        // Vérifier aussi s'il est lié à un incident actif
        const hasActiveIncident = formattedIncidents.some(incident => 
          incident.materiel === materiel.id && 
          (incident.statut === 'ouvert' || incident.statut === 'en_cours')
        );
        
        return isPanne || hasActiveIncident;
      });
      
      setMaterielsEnPanne(panneMateriels);
      
      setIncidents(formattedIncidents);
      setFilteredIncidents(formattedIncidents);
      setError('');
      
      console.log(`✅ ${formattedIncidents.length} incidents chargés`);
      
    } catch (err: any) {
      console.error('❌ Erreur chargement incidents:', err);
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      showMessage('error', errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchRelatedData = async () => {
    try {
      console.log('🔄 Chargement des données liées...');
      
      const [materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
        materielsAPI.getAll(),
        logicielsAPI.getAll(),
        reseauAPI.getAll()
      ]);
      
      let materielsData: Materiel[] = [];
      if (materielsRes.status === 'fulfilled') {
        materielsData = extractDataFromResponse(materielsRes.value);
        console.log(`✅ ${materielsData.length} matériels chargés`);
      }
      
      let logicielsData: Logiciel[] = [];
      if (logicielsRes.status === 'fulfilled') {
        logicielsData = extractDataFromResponse(logicielsRes.value);
        console.log(`✅ ${logicielsData.length} logiciels chargés`);
      }
      
      let reseauxData: Reseau[] = [];
      if (reseauxRes.status === 'fulfilled') {
        reseauxData = extractDataFromResponse(reseauxRes.value);
        console.log(`✅ ${reseauxData.length} réseaux chargés`);
      }
      
      setMateriels(materielsData);
      setLogiciels(logicielsData);
      setReseaux(reseauxData);
      
    } catch (err: any) {
      console.error('❌ Erreur chargement données liées:', err);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchRelatedData();
      await fetchIncidents();
    };
    
    loadInitialData();
  }, []);

  // Rafraîchir les incidents quand les matériels changent
  useEffect(() => {
    if (materiels.length > 0 && incidents.length === 0) {
      fetchIncidents();
    }
  }, [materiels]);

  // NOUVEAU : Vérifier périodiquement l'état des matériels pour auto-résoudre les incidents
  useEffect(() => {
    const interval = setInterval(() => {
      if (shouldAutoResolve && incidents.length > 0) {
        updateIncidentStatusBasedOnMaterial();
      }
    }, 30000); // Vérifier toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, [incidents, materiels, shouldAutoResolve]);

  useEffect(() => {
    filterIncidents();
  }, [incidents, searchTerm, filterStatut, filterPriorite, filterType, showActiveOnly]);

  useEffect(() => {
    if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedIncidents, filteredIncidents]);

  const filterIncidents = () => {
    let filtered = showActiveOnly ? activeIncidents : safeArray<FormattedIncident>(incidents);

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = safeFilter<FormattedIncident>(filtered, incident => 
        (incident.description?.toLowerCase() || '').includes(searchLower) ||
        (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
        (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
      );
      
      // 🔥 AUTO-LOGGER: Recherche d'incidents
      if (searchTerm.trim()) {
        autoLogger.logIncidentSearch(searchTerm, filtered.length);
      }
    }

    if (filterStatut) {
      filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
      
      // 🔥 AUTO-LOGGER: Filtre par statut
      autoLogger.logIncidentFilter(`statut: ${filterStatut}`, filtered.length);
    }

    if (filterPriorite) {
      filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
      
      // 🔥 AUTO-LOGGER: Filtre par priorité
      autoLogger.logIncidentFilter(`priorité: ${filterPriorite}`, filtered.length);
    }

    if (filterType) {
      filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
      
      // 🔥 AUTO-LOGGER: Filtre par type
      autoLogger.logIncidentFilter(`type: ${filterType}`, filtered.length);
    }

    setFilteredIncidents(filtered);
    setSelectedIncidents([]);
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Gestion de la réparation
  const handleReparationSubmit = async (reparationData: any) => {
    try {
      // Créer la réparation
      await reparationsAPI.create(reparationData);
      
      // 🔥 AUTO-LOGGER: Création de réparation
      autoLogger.logRepair('create', incidentToRepair?.id || 0, reparationData.materiel_id, reparationData);
      
      // NOUVEAU : Vérifier si le matériel est maintenant fonctionnel
      if (reparationData.materiel_id) {
        try {
          const materiel = await getMaterielDetails(reparationData.materiel_id);
          if (materiel && isMaterielEnEtatFonctionnel(materiel)) {
            // Trouver tous les incidents actifs liés à ce matériel
            const incidentsActifsMateriel = incidents.filter(inc => 
              inc.materiel === reparationData.materiel_id && 
              (inc.statut === 'ouvert' || inc.statut === 'en_cours')
            );
            
            // Auto-résoudre ces incidents
            for (const incident of incidentsActifsMateriel) {
              if (incident.id) {
                await incidentsAPI.update(incident.id, {
                  statut: 'resolu',
                  date_resolution: new Date().toISOString()
                });
                
                // 🔥 AUTO-LOGGER: Résolution d'incident après réparation
                autoLogger.logIncidentResolve(incident.id, incident);
                
                console.log(`✅ Incident #${incident.id} auto-résolu après réparation`);
              }
            }
          }
        } catch (error) {
          console.error('❌ Erreur vérification état matériel:', error);
        }
      }
      
      if (incidentToRepair && incidentToRepair.id) {
        // Mettre à jour l'incident spécifique
        const materiel = await getMaterielDetails(incidentToRepair.materiel || 0);
        if (materiel && isMaterielEnEtatFonctionnel(materiel)) {
          await incidentsAPI.update(incidentToRepair.id, {
            statut: 'resolu',
            date_resolution: new Date().toISOString()
          });
          
          // 🔥 AUTO-LOGGER: Résolution d'incident
          autoLogger.logIncidentResolve(incidentToRepair.id, incidentToRepair);
          
          showMessage('success', `✅ Réparation créée et incident #${incidentToRepair.id} auto-résolu!`);
        } else {
          await incidentsAPI.update(incidentToRepair.id, {
            statut: 'en_cours'
          });
          showMessage('success', `✅ Réparation créée et incident #${incidentToRepair.id} mis en cours!`);
        }
      } else {
        showMessage('success', 'Réparation créée avec succès!');
      }
      
      // Rafraîchir les données
      await Promise.all([
        fetchIncidents(),
        fetchRelatedData()
      ]);
      
      setIsRepairFormOpen(false);
      setIncidentToRepair(null);
      
    } catch (error: any) {
      console.error('❌ Erreur création réparation:', error);
      showMessage('error', handleApiError(error));
    }
  };

  // Lancer la réparation immédiate
  const handleRepairImmediate = (incident: FormattedIncident) => {
    // 🔥 AUTO-LOGGER: Démarrage de réparation
    autoLogger.logAction('DÉMARRAGE RÉPARATION', 'Incidents', `Démarrage réparation incident #${incident.id}`, {
      incidentId: incident.id,
      materielId: incident.materiel,
      description: incident.description
    });
    
    setIncidentToRepair(incident);
    setIsRepairFormOpen(true);
  };

  const handleSubmit = async (incidentData: any) => {
    try {
      const currentUser = getCurrentUser();
      
      const formattedData: any = {
        description: incidentData.description,
        type_incident: incidentData.type_incident,
        priorite: incidentData.priorite,
        statut: incidentData.statut,
        utilisateur_signaleur: currentUser.id
      };
      
      if (incidentData.date_creation) {
        formattedData.date_creation = incidentData.date_creation;
      } else if (editingIncident && editingIncident.date_creation) {
        formattedData.date_creation = editingIncident.date_creation;
      }
      
      if (incidentData.date_resolution) {
        formattedData.date_resolution = incidentData.date_resolution;
      }
      
      if (incidentData.materiel && incidentData.materiel > 0) {
        formattedData.materiel_concerne = incidentData.materiel;
      }
      if (incidentData.logiciel && incidentData.logiciel > 0) {
        formattedData.logiciel_concerne = incidentData.logiciel;
      }
      if (incidentData.reseau && incidentData.reseau > 0) {
        formattedData.reseau_concerne = incidentData.reseau;
      }
      
      if (editingIncident && editingIncident.id) {
        await incidentsAPI.update(editingIncident.id, formattedData);
        showMessage('success', 'Incident modifié avec succès');
        
        // 🔥 AUTO-LOGGER: Modification d'incident
        autoLogger.logIncidentUpdate(editingIncident.id, editingIncident, incidentData);
        
      } else {
        await incidentsAPI.create(formattedData);
        showMessage('success', 'Incident créé avec succès');
        
        // 🔥 AUTO-LOGGER: Création d'incident
        autoLogger.logIncidentCreate(incidentData);
      }
      
      await fetchIncidents();
      setIsFormOpen(false);
      setEditingIncident(undefined);
      
    } catch (error: any) {
      console.error('❌ Erreur soumission incident:', error);
      const errorMsg = handleApiError(error);
      showMessage('error', errorMsg);
    }
  };

  const toggleSelectIncident = (id: number) => {
    setSelectedIncidents(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedIncidents([]);
    } else {
      const allIds = filteredIncidents
        .map(i => i.id)
        .filter((id): id is number => id !== undefined);
      setSelectedIncidents(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIncidents.length === 0) {
      showMessage('error', 'Aucun incident sélectionné');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIncidents.length} incident(s) ?`)) {
      try {
        const deletePromises = selectedIncidents.map(id => 
          incidentsAPI.delete(id).catch(err => {
            console.error(`Erreur suppression incident ${id}:`, err);
            return null;
          })
        );
        
        await Promise.all(deletePromises);
        
        // 🔥 AUTO-LOGGER: Suppression multiple d'incidents
        selectedIncidents.forEach(id => {
          const incident = incidents.find(i => i.id === id);
          if (incident) {
            autoLogger.logIncidentDelete(id, incident);
          }
        });
        
        showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
        setSelectedIncidents([]);
        await fetchIncidents();
      } catch (error: any) {
        console.error('❌ Erreur suppression incidents:', error);
        showMessage('error', handleApiError(error));
      }
    }
  };

  const handleResoudreSelected = async () => {
    if (selectedIncidents.length === 0) {
      showMessage('error', 'Aucun incident sélectionné');
      return;
    }

    try {
      const resolvePromises = selectedIncidents.map(id => 
        incidentsAPI.resoudre(id).catch(err => {
          console.error(`Erreur résolution incident ${id}:`, err);
          return null;
        })
      );
      
      await Promise.all(resolvePromises);
      
      // 🔥 AUTO-LOGGER: Résolution multiple d'incidents
      selectedIncidents.forEach(id => {
        const incident = incidents.find(i => i.id === id);
        if (incident) {
          autoLogger.logIncidentResolve(id, incident);
        }
      });
      
      showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
      setSelectedIncidents([]);
      await fetchIncidents();
    } catch (error: any) {
      console.error('❌ Erreur résolution incidents:', error);
      showMessage('error', handleApiError(error));
    }
  };

  const handleEditSelected = () => {
    if (selectedIncidents.length === 0) {
      showMessage('error', 'Aucun incident sélectionné');
      return;
    }

    if (selectedIncidents.length === 1) {
      const incident = incidents.find(i => i.id === selectedIncidents[0]);
      if (incident) {
        handleEdit(incident);
      }
    } else {
      showMessage('info', `Édition multiple de ${selectedIncidents.length} incidents`);
    }
  };

  const handleEdit = (incident: FormattedIncident) => {
    // 🔥 AUTO-LOGGER: Consultation d'incident (pour édition)
    autoLogger.logIncidentView(incident);
    
    setEditingIncident(incident);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
      try {
        const incident = incidents.find(i => i.id === id);
        await incidentsAPI.delete(id);
        
        // 🔥 AUTO-LOGGER: Suppression d'incident
        if (incident) {
          autoLogger.logIncidentDelete(id, incident);
        }
        
        showMessage('success', 'Incident supprimé avec succès');
        await fetchIncidents();
      } catch (error: any) {
        console.error('❌ Erreur suppression incident:', error);
        showMessage('error', handleApiError(error));
      }
    }
  };

  const handleResoudre = async (id: number) => {
    try {
      const incident = incidents.find(i => i.id === id);
      await incidentsAPI.resoudre(id);
      
      // 🔥 AUTO-LOGGER: Résolution manuelle d'incident
      if (incident) {
        autoLogger.logIncidentResolve(id, incident);
      }
      
      showMessage('success', 'Incident marqué comme résolu');
      await fetchIncidents();
    } catch (error: any) {
      console.error('❌ Erreur résolution incident:', error);
      showMessage('error', handleApiError(error));
    }
  };

  const handleAddNew = () => {
    // 🔥 AUTO-LOGGER: Ouverture formulaire nouveau incident
    autoLogger.logAction('OUVERTURE FORMULAIRE', 'Incidents', 'Nouvel incident');
    
    setEditingIncident(undefined);
    setIsFormOpen(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // 🔥 AUTO-LOGGER: Rafraîchissement
    autoLogger.logAction('RAFRAÎCHISSEMENT', 'Incidents', 'Rafraîchissement des incidents', {
      timestamp: new Date().toISOString()
    });
    
    await fetchIncidents();
    showMessage('success', 'Données rafraîchies');
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredIncidents.map(i => ({
        ID: i.id,
        Description: i.description,
        'Matériel concerné': i.materiel_nom || 'Non spécifié',
        Type: getTypeText(i.type_incident),
        Priorité: getPriorityText(i.priorite),
        Statut: getStatusText(i.statut),
        'Utilisateur signaleur': i.utilisateur_nom || 'Non spécifié',
        'Date création': i.date_creation ? new Date(i.date_creation).toLocaleDateString('fr-FR') : 'Non spécifiée'
      }));

      if (dataToExport.length === 0) {
        showMessage('error', 'Aucune donnée à exporter');
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
      link.setAttribute('download', `incidents_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showMessage('success', 'Export CSV réussi !');
      
      // 🔥 AUTO-LOGGER: Exportation
      autoLogger.logIncidentExport('CSV', filteredIncidents.length, {
        dateRange: 'toutes',
        searchTerm: searchTerm,
        filterStatut: filterStatut,
        filterPriorite: filterPriorite,
        filterType: filterType
      });
      
    } catch (error) {
      console.error('❌ Erreur export:', error);
      showMessage('error', 'Erreur lors de l\'export');
    }
  };

  const resetFilters = () => {
    // 🔥 AUTO-LOGGER: Réinitialisation des filtres
    autoLogger.logIncidentFilter('réinitialisation', incidents.length);
    
    setSearchTerm('');
    setFilterStatut('');
    setFilterPriorite('');
    setFilterType('');
    setSelectedIncidents([]);
    setShowActiveOnly(false);
    
    showMessage('info', 'Filtres réinitialisés');
  };

  const toggleActiveOnly = () => {
    setShowActiveOnly(!showActiveOnly);
    
    // 🔥 AUTO-LOGGER: Filtre actifs seulement
    autoLogger.logIncidentFilter(`actifs seulement: ${!showActiveOnly}`, showActiveOnly ? incidents.length : activeIncidents.length);
  };

  // NOUVELLE FONCTION : Toggle auto-résolution
  const toggleAutoResolution = () => {
    setShouldAutoResolve(!shouldAutoResolve);
    
    // 🔥 AUTO-LOGGER: Changement mode auto-résolution
    autoLogger.logAction('CONFIGURATION', 'Incidents', `Auto-résolution ${!shouldAutoResolve ? 'activée' : 'désactivée'}`);
    
    showMessage('info', `Auto-résolution ${!shouldAutoResolve ? 'activée' : 'désactivée'}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
      case 'en_cours': return <Clock className="w-4 h-4" />;
      case 'resolu': return <CheckCircle className="w-4 w-4" />;
      case 'ferme': return <CheckCircle className="w-4 w-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, string> = {
      critique: 'badge-error',
      elevee: 'badge-warning',
      moyenne: 'badge-info',
      basse: 'badge-success'
    };
    return badges[priority] || 'badge-neutral';
  };

  const getPriorityText = (priority: string) => {
    const texts: Record<string, string> = {
      critique: 'Critique',
      elevee: 'Élevée',
      moyenne: 'Moyenne',
      basse: 'Basse'
    };
    return texts[priority] || priority;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      ouvert: 'badge-warning',
      en_cours: 'badge-info',
      resolu: 'badge-success',
      ferme: 'badge-neutral'
    };
    return badges[status] || 'badge-neutral';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      ouvert: 'Ouvert',
      en_cours: 'En cours',
      resolu: 'Résolu',
      ferme: 'Fermé'
    };
    return texts[status] || status;
  };

  const getTypeText = (type: string) => {
    const texts: Record<string, string> = {
      materiel: 'Matériel',
      logiciel: 'Logiciel',
      reseau: 'Réseau',
      mixte: 'Mixte'
    };
    return texts[type] || type;
  };

  // Statistiques
  const stats = {
    total: safeArray<FormattedIncident>(incidents).length,
    ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
    en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
    resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu' || i.statut === 'ferme').length,
    actifs: activeIncidents.length,
    materielsPanne: materielsEnPanne.length
  };

  if (loading && !refreshing) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {message && (
        <div className={`alert ${
          message.type === 'success' ? 'alert-success' : 
          message.type === 'error' ? 'alert-error' : 
          'alert-info'
        } mb-4 shadow-lg`}>
          <span>{message.text}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4 shadow-lg">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
          <p className="text-base-content opacity-60 mt-1">
            {safeArray<FormattedIncident>(filteredIncidents).length} incidents trouvés
            {selectedIncidents.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedIncidents.length} sélectionné(s))
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Bouton auto-résolution */}
          <button
            onClick={toggleAutoResolution}
            className={`btn btn-sm ${shouldAutoResolve ? 'btn-success' : 'btn-outline'}`}
            title={shouldAutoResolve ? 'Auto-résolution activée' : 'Auto-résolution désactivée'}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {shouldAutoResolve ? 'Auto-résolution: ON' : 'Auto-résolution: OFF'}
          </button>
          
          <button
            onClick={handleRefresh}
            className="btn btn-outline btn-sm"
            title="Rafraîchir"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
          </button>
          <button
            onClick={handleExport}
            className="btn btn-outline btn-sm"
            title="Exporter la liste"
            disabled={filteredIncidents.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button
            onClick={handleAddNew}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel incident
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Total</p>
                <p className="text-2xl font-bold text-base-content">{stats.total}</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Ouverts</p>
                <p className="text-2xl font-bold text-orange-600">{stats.ouvert}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
              </div>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Résolus</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="card bg-warning/10 shadow-xl">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Actifs</p>
                <p className="text-2xl font-bold text-warning">{stats.actifs}</p>
              </div>
              <Wrench className="w-6 h-6 text-warning" />
            </div>
            {stats.actifs > 0 && (
              <div className="mt-2">
                <button
                  onClick={toggleActiveOnly}
                  className="btn btn-warning btn-xs w-full mt-1"
                >
                  {showActiveOnly ? 'Voir tous' : 'Voir actifs'}
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="card bg-error/10 shadow-xl">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">En panne</p>
                <p className="text-2xl font-bold text-error">{stats.materielsPanne}</p>
              </div>
              <Monitor className="w-6 h-6 text-error" />
            </div>
          </div>
        </div>
        
        {/* Carte Auto-résolution */}
        <div className={`card ${shouldAutoResolve ? 'bg-success/10' : 'bg-base-200'} shadow-xl`}>
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Auto-résolution</p>
                <p className={`text-2xl font-bold ${shouldAutoResolve ? 'text-success' : 'text-base-content'}`}>
                  {shouldAutoResolve ? 'ON' : 'OFF'}
                </p>
              </div>
              <CheckCircle className={`w-6 h-6 ${shouldAutoResolve ? 'text-success' : 'text-base-content opacity-40'}`} />
            </div>
            <div className="mt-2">
              <button
                onClick={toggleAutoResolution}
                className={`btn btn-xs w-full mt-1 ${shouldAutoResolve ? 'btn-success' : 'btn-outline'}`}
              >
                {shouldAutoResolve ? 'Désactiver' : 'Activer'}
              </button>
            </div>
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
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  placeholder="Description, matériel, signaleur..."
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
                <option value="ouvert">Ouvert</option>
                <option value="en_cours">En cours</option>
                <option value="resolu">Résolu</option>
                <option value="ferme">Fermé</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">⚠️ Priorité</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterPriorite}
                onChange={(e) => setFilterPriorite(e.target.value)}
              >
                <option value="">Toutes les priorités</option>
                <option value="critique">Critique</option>
                <option value="elevee">Élevée</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">🔧 Type</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tous les types</option>
                <option value="materiel">Matériel</option>
                <option value="logiciel">Logiciel</option>
                <option value="reseau">Réseau</option>
                <option value="mixte">Mixte</option>
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

          {/* Info auto-résolution */}
          {shouldAutoResolve && (
            <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">Auto-résolution activée</span>
                <span className="text-xs opacity-70 ml-auto">
                  Les incidents seront auto-résolus lorsque le matériel devient "fonctionnel"
                </span>
              </div>
            </div>
          )}

          {selectedIncidents.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-semibold text-primary text-lg">
                      {selectedIncidents.length} incident(s) sélectionné(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier ({selectedIncidents.length})
                  </button>
                  <button
                    onClick={handleResoudreSelected}
                    className="btn btn-success btn-sm gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Résoudre ({selectedIncidents.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer ({selectedIncidents.length})
                  </button>
                  <button
                    onClick={() => setSelectedIncidents([])}
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

      {/* Tableau des incidents */}
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
                        disabled={filteredIncidents.length === 0}
                      >
                        {isSelectAll ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5 text-base-content/40" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="font-bold">Description</th>
                  <th className="font-bold">Matériel concerné</th>
                  <th className="font-bold">Type</th>
                  <th className="font-bold">Priorité</th>
                  <th className="font-bold">Statut</th>
                  <th className="font-bold">Date création</th>
                  <th className="font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray<FormattedIncident>(filteredIncidents).map((incident) => {
                  const isPanne = incident.materiel_nom?.includes('🚨');
                  
                  return (
                    <tr key={incident.id} className="hover">
                      <td className="text-center">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm"
                            checked={selectedIncidents.includes(incident.id || 0)}
                            onChange={() => toggleSelectIncident(incident.id || 0)}
                          />
                        </div>
                      </td>
                      
                      {/* Colonne Description */}
                      <td>
                        <div className="max-w-xs">
                          <div className="font-medium text-base-content line-clamp-2">
                            {incident.description}
                          </div>
                          
                          {/* Signaleur */}
                          <div className="text-sm text-base-content opacity-70 mt-1 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="font-medium">Signaleur:</span> 
                            <span className="ml-1">
                              {incident.utilisateur_nom || 'Non spécifié'}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Matériel concerné */}
                      <td>
                        <div className="flex flex-col gap-2">
                          {/* Nom et icône du matériel */}
                          <div className="flex items-center gap-2">
                            {getMaterielIcon(incident.materiel_details?.type)}
                            <div className="flex-1">
                              <span className={`font-medium ${isPanne ? 'text-error' : 'text-base-content'}`}>
                                {incident.materiel_nom || 'Non spécifié'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Détails supplémentaires si disponibles */}
                          {incident.materiel_details && (
                            <div className="text-xs text-base-content opacity-70">
                              <div className="grid grid-cols-2 gap-1">
                                {incident.materiel_details.reference && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">Réf:</span>
                                    <span className="badge badge-xs badge-outline">
                                      {incident.materiel_details.reference}
                                    </span>
                                  </div>
                                )}
                                
                                {incident.materiel_details.etat && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">État:</span>
                                    <span className={`badge badge-xs ${
                                      isMaterielEnEtatPanne(incident.materiel_details) 
                                        ? 'badge-error' 
                                        : isMaterielEnEtatFonctionnel(incident.materiel_details)
                                        ? 'badge-success'
                                        : 'badge-warning'
                                    }`}>
                                      {incident.materiel_details.etat}
                                    </span>
                                  </div>
                                )}
                                
                                {incident.materiel_details.service_attribue && (
                                  <div className="col-span-2 flex items-center gap-1">
                                    <span className="font-medium">Service:</span>
                                    <span>{incident.materiel_details.service_attribue}</span>
                                  </div>
                                )}
                                
                                {incident.materiel_details.utilisateur_attribue && (
                                  <div className="col-span-2 flex items-center gap-1">
                                    <span className="font-medium">Utilisateur:</span>
                                    <span>{incident.materiel_details.utilisateur_attribue}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Bouton de réparation si le matériel est en panne */}
                          {isPanne && incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
                            <button
                              onClick={() => handleRepairImmediate(incident)}
                              className="btn btn-error btn-xs w-full mt-1 gap-1"
                            >
                              <Wrench className="h-3 w-3" />
                              Réparer immédiatement
                            </button>
                          )}
                        </div>
                      </td>
                      
                      {/* Colonne Type */}
                      <td>
                        <span className="text-sm font-medium capitalize">
                          {getTypeText(incident.type_incident)}
                        </span>
                      </td>
                      
                      {/* Colonne Priorité */}
                      <td>
                        <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg`}>
                          {getPriorityText(incident.priorite)}
                        </div>
                      </td>
                      
                      {/* Colonne Statut */}
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(incident.statut)}
                          <div className={`badge ${getStatusBadge(incident.statut)}`}>
                            {getStatusText(incident.statut)}
                          </div>
                        </div>
                      </td>
                      
                      {/* Colonne Date */}
                      <td>
                        <span className="text-sm font-medium">
                          {incident.date_creation ? new Date(incident.date_creation).toLocaleDateString('fr-FR') : '-'}
                        </span>
                        <div className="text-xs text-base-content opacity-60 mt-1">
                          {incident.date_creation ? new Date(incident.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </td>
                      
                      {/* Colonne Actions */}
                      <td>
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() => handleEdit(incident)}
                            className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          {incident.statut !== 'resolu' && incident.statut !== 'ferme' && (
                            <button
                              onClick={() => handleResoudre(incident.id || 0)}
                              className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
                              title="Marquer comme résolu"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(incident.id || 0)}
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

          {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
            <div className="text-center py-12">
              <div className="text-base-content opacity-40 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Aucun incident trouvé</p>
                <p className="text-sm mt-2">
                  {searchTerm || filterStatut || filterPriorite || filterType || showActiveOnly
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucun incident n'est enregistré dans le système"
                  }
                </p>
                <button
                  onClick={handleAddNew}
                  className="btn btn-primary btn-sm mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le premier incident
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire d'incident */}
      <IncidentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingIncident(undefined);
        }}
        onSubmit={handleSubmit}
        incident={editingIncident}
        currentUser={getCurrentUser()}
      />

      {/* Formulaire de réparation */}
      <ReparationForm
        isOpen={isRepairFormOpen}
        onClose={() => {
          setIsRepairFormOpen(false);
          setIncidentToRepair(null);
        }}
        onSubmit={handleReparationSubmit}
        incidentSource={incidentToRepair}
        materiels={materiels}
        incidents={incidents}
      />
    </div>
  );
};

export default Incidents;