
// // // // // // IncidentForm.tsx - Version avec utilisateur signaleur automatique
// // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // import { X, Calendar, Clock, User, AlertCircle, Loader2, Bell, AlertTriangle } from 'lucide-react';
// // // // // import { Incident, User as UserType, Materiel, Logiciel, Reseau, Alerte } from '../types';
// // // // // import { materielsAPI, logicielsAPI, reseauAPI, handleApiError } from '../services/api';

// // // // // interface IncidentFormProps {
// // // // //   isOpen: boolean;
// // // // //   onClose: () => void;
// // // // //   onSubmit: (incidentData: any) => void;
// // // // //   incident?: Incident;
// // // // //   currentUser: UserType;
// // // // //   alerteSource?: Alerte;
// // // // // }

// // // // // const IncidentForm: React.FC<IncidentFormProps> = ({
// // // // //   isOpen,
// // // // //   onClose,
// // // // //   onSubmit,
// // // // //   incident,
// // // // //   currentUser,
// // // // //   alerteSource
// // // // // }) => {
// // // // //   // États du formulaire - utilisateur signaleur automatique
// // // // //   const [formData, setFormData] = useState({
// // // // //     description: '',
// // // // //     date_resolution: '',
// // // // //     heure_resolution: '',
// // // // //     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
// // // // //     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
// // // // //     type_incident: '' as '' | 'materiel' | 'logiciel' | 'reseau' | 'mixte',
// // // // //     utilisateur_signaleur: currentUser?.id || 0, // AUTO - utilisateur connecté
// // // // //     materiel: 0,
// // // // //     logiciel: 0,
// // // // //     reseau: 0,
// // // // //     alerte_source: 0
// // // // //   });

// // // // //   // États pour les données externes
// // // // //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// // // // //   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
// // // // //   const [reseaux, setReseaux] = useState<Reseau[]>([]);
// // // // //   const [errors, setErrors] = useState<Record<string, string>>({});
// // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [apiErrors, setApiErrors] = useState<string[]>([]);
// // // // //   const [mode, setMode] = useState<'normal' | 'fromAlerte'>('normal');
  
// // // // //   // Références pour éviter les boucles
// // // // //   const dataLoadedRef = useRef(false);
// // // // //   const isOpenRef = useRef(false);

// // // // //   // Formater le nom utilisateur pour l'affichage
// // // // //   const formatUserName = (user: UserType | null) => {
// // // // //     if (!user) return 'Utilisateur inconnu';
    
// // // // //     const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
// // // // //     if (fullName) {
// // // // //       return `${fullName} (${user.username || `ID: ${user.id}`})`;
// // // // //     }
// // // // //     return user.username || `Utilisateur #${user.id}`;
// // // // //   };

// // // // //   // Obtenir le nom complet de l'utilisateur connecté
// // // // //   const getCurrentUserName = () => {
// // // // //     return formatUserName(currentUser);
// // // // //   };

// // // // //   // Fonction pour extraire les données de réponse API
// // // // //   const extractDataFromResponse = (response: any): any[] => {
// // // // //     if (!response || !response.data) return [];
    
// // // // //     if (Array.isArray(response.data)) {
// // // // //       return response.data;
// // // // //     }
    
// // // // //     if (response.data.results && Array.isArray(response.data.results)) {
// // // // //       return response.data.results;
// // // // //     }
    
// // // // //     if (response.data.data && Array.isArray(response.data.data)) {
// // // // //       return response.data.data;
// // // // //     }
    
// // // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // // // //       const values = Object.values(response.data);
// // // // //       if (values.length > 0 && values.every(v => typeof v === 'object')) {
// // // // //         return values as any[];
// // // // //       }
// // // // //     }
    
// // // // //     if (response.results && Array.isArray(response.results)) {
// // // // //       return response.results;
// // // // //     }
    
// // // // //     return [];
// // // // //   };

// // // // //   // Fonction pour mapper la sévérité d'alerte vers priorité d'incident
// // // // //   const mapSeveriteToPriorite = (severite: string): 'critique' | 'elevee' | 'moyenne' | 'basse' => {
// // // // //     const mapping = {
// // // // //       'critique': 'critique',
// // // // //       'elevee': 'elevee',
// // // // //       'moyenne': 'moyenne',
// // // // //       'basse': 'basse'
// // // // //     };
// // // // //     return mapping[severite as keyof typeof mapping] || 'moyenne';
// // // // //   };

// // // // //   // Initialiser depuis une alerte
// // // // //   const initFromAlerte = () => {
// // // // //     if (!alerteSource) return;
    
// // // // //     console.log('🚨 Initialisation depuis alerte:', alerteSource);
    
// // // // //     // Déterminer le type d'incident basé sur la source de l'alerte
// // // // //     let typeIncident: 'materiel' | 'logiciel' | 'reseau' | 'mixte' = 'mixte';
    
// // // // //     if (alerteSource.materiel_id && !alerteSource.logiciel_id && !alerteSource.reseau_id) {
// // // // //       typeIncident = 'materiel';
// // // // //     } else if (alerteSource.logiciel_id && !alerteSource.materiel_id && !alerteSource.reseau_id) {
// // // // //       typeIncident = 'logiciel';
// // // // //     } else if (alerteSource.reseau_id && !alerteSource.materiel_id && !alerteSource.logiciel_id) {
// // // // //       typeIncident = 'reseau';
// // // // //     } else {
// // // // //       typeIncident = 'mixte';
// // // // //     }
    
// // // // //     // Préparer les données initiales - utilisateur automatique
// // // // //     const initialData = {
// // // // //       description: `Incident généré depuis l'alerte: ${alerteSource.description}`,
// // // // //       date_resolution: new Date().toISOString().split('T')[0],
// // // // //       heure_resolution: new Date().toTimeString().slice(0, 5),
// // // // //       priorite: mapSeveriteToPriorite(alerteSource.severite),
// // // // //       statut: 'ouvert' as const,
// // // // //       type_incident: typeIncident,
// // // // //       utilisateur_signaleur: currentUser?.id || 0, // AUTO - utilisateur connecté
// // // // //       materiel: alerteSource.materiel_id || 0,
// // // // //       logiciel: alerteSource.logiciel_id || 0,
// // // // //       reseau: alerteSource.reseau_id || 0,
// // // // //       alerte_source: alerteSource.id || 0
// // // // //     };
    
// // // // //     setFormData(initialData);
// // // // //     setMode('fromAlerte');
    
// // // // //     console.log('📝 Données initialisées depuis alerte:', initialData);
// // // // //   };

// // // // //   // Charger les matériels
// // // // //   const fetchMateriels = async () => {
// // // // //     try {
// // // // //       console.log('🔄 Chargement des matériels...');
// // // // //       const response = await materielsAPI.getAll();
// // // // //       const materielsData = extractDataFromResponse(response);
// // // // //       setMateriels(materielsData);
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Erreur chargement matériels:', error);
// // // // //     }
// // // // //   };

// // // // //   // Charger les logiciels
// // // // //   const fetchLogiciels = async () => {
// // // // //     try {
// // // // //       console.log('🔄 Chargement des logiciels...');
// // // // //       const response = await logicielsAPI.getAll();
// // // // //       const logicielsData = extractDataFromResponse(response);
// // // // //       setLogiciels(logicielsData);
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Erreur chargement logiciels:', error);
// // // // //     }
// // // // //   };

// // // // //   // Charger les réseaux
// // // // //   const fetchReseaux = async () => {
// // // // //     try {
// // // // //       console.log('🔄 Chargement des réseaux...');
// // // // //       const response = await reseauAPI.getAll();
// // // // //       const reseauxData = extractDataFromResponse(response);
// // // // //       setReseaux(reseauxData);
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Erreur chargement réseaux:', error);
// // // // //     }
// // // // //   };

// // // // //   // Charger toutes les données
// // // // //   const fetchAllData = async () => {
// // // // //     if (dataLoadedRef.current || !isOpen) return;
    
// // // // //     setLoading(true);
// // // // //     setApiErrors([]);
// // // // //     dataLoadedRef.current = true;
    
// // // // //     try {
// // // // //       console.log('🔄 Début du chargement de toutes les données...');
      
// // // // //       // Charger en parallèle
// // // // //       await Promise.allSettled([
// // // // //         fetchMateriels(),
// // // // //         fetchLogiciels(),
// // // // //         fetchReseaux()
// // // // //       ]);
      
// // // // //       // Initialiser le formulaire
// // // // //       if (alerteSource) {
// // // // //         initFromAlerte();
// // // // //       } else if (incident) {
// // // // //         console.log('📝 Initialisation avec incident:', incident);
        
// // // // //         // Pour l'édition, garder l'utilisateur signaleur d'origine
// // // // //         // ou utiliser l'utilisateur courant si non défini
// // // // //         const utilisateurSignaleur = incident.utilisateur_signaleur || currentUser?.id || 0;
        
// // // // //         setFormData({
// // // // //           description: incident.description || '',
// // // // //           date_resolution: incident.date_resolution?.split('T')[0] || '',
// // // // //           heure_resolution: incident.date_resolution?.split('T')[1]?.substring(0, 5) || '',
// // // // //           priorite: incident.priorite || 'moyenne',
// // // // //           statut: incident.statut || 'ouvert',
// // // // //           type_incident: incident.type_incident || '',
// // // // //           utilisateur_signaleur: utilisateurSignaleur, // Garder l'original ou currentUser
// // // // //           materiel: incident.materiel || 0,
// // // // //           logiciel: incident.logiciel || 0,
// // // // //           reseau: incident.reseau || 0,
// // // // //           alerte_source: 0
// // // // //         });
// // // // //       } else {
// // // // //         // Pour un nouvel incident - utilisateur automatique
// // // // //         console.log('👤 Utilisateur signaleur automatique:', currentUser);
// // // // //       }
      
// // // // //     } catch (error) {
// // // // //       console.error('💥 Erreur critique lors du chargement:', error);
// // // // //       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Effet pour charger les données
// // // // //   useEffect(() => {
// // // // //     if (isOpen && !isOpenRef.current) {
// // // // //       isOpenRef.current = true;
// // // // //       dataLoadedRef.current = false;
// // // // //       fetchAllData();
// // // // //     }
    
// // // // //     return () => {
// // // // //       if (!isOpen) {
// // // // //         isOpenRef.current = false;
// // // // //         dataLoadedRef.current = false;
// // // // //       }
// // // // //     };
// // // // //   }, [isOpen, incident, alerteSource]);

// // // // //   const resetForm = () => {
// // // // //     setFormData({
// // // // //       description: '',
// // // // //       date_resolution: '',
// // // // //       heure_resolution: '',
// // // // //       priorite: 'moyenne',
// // // // //       statut: 'ouvert',
// // // // //       type_incident: '',
// // // // //       utilisateur_signaleur: currentUser?.id || 0, // AUTO - utilisateur connecté
// // // // //       materiel: 0,
// // // // //       logiciel: 0,
// // // // //       reseau: 0,
// // // // //       alerte_source: 0
// // // // //     });
// // // // //     setErrors({});
// // // // //     setApiErrors([]);
// // // // //     setMode('normal');
// // // // //   };

// // // // //   const validateForm = () => {
// // // // //     const newErrors: Record<string, string> = {};
    
// // // // //     if (!formData.description.trim()) {
// // // // //       newErrors.description = 'Description requise';
// // // // //     }
    
// // // // //     if (!formData.type_incident) {
// // // // //       newErrors.type_incident = 'Type d\'incident requis';
// // // // //     }
    
// // // // //     // Validation basée sur le type d'incident
// // // // //     if (formData.type_incident === 'materiel' && formData.materiel === 0) {
// // // // //       newErrors.materiel = 'Matériel requis pour ce type d\'incident';
// // // // //     }
    
// // // // //     if (formData.type_incident === 'logiciel' && formData.logiciel === 0) {
// // // // //       newErrors.logiciel = 'Logiciel requis pour ce type d\'incident';
// // // // //     }
    
// // // // //     if (formData.type_incident === 'reseau' && formData.reseau === 0) {
// // // // //       newErrors.reseau = 'Réseau requis pour ce type d\'incident';
// // // // //     }
    
// // // // //     if (formData.type_incident === 'mixte' && formData.materiel === 0 && formData.logiciel === 0 && formData.reseau === 0) {
// // // // //       newErrors.type_incident = 'Au moins une source (matériel, logiciel ou réseau) est requise';
// // // // //     }
    
// // // // //     setErrors(newErrors);
// // // // //     return Object.keys(newErrors).length === 0;
// // // // //   };

// // // // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// // // // //     const { name, value } = e.target;
    
// // // // //     setFormData(prev => ({
// // // // //       ...prev,
// // // // //       [name]: name === 'materiel' || name === 'logiciel' || name === 'reseau'
// // // // //         ? parseInt(value) || 0 
// // // // //         : value
// // // // //     }));
    
// // // // //     // Réinitialiser les champs de source selon le type
// // // // //     if (name === 'type_incident') {
// // // // //       const type = value as 'materiel' | 'logiciel' | 'reseau' | 'mixte';
// // // // //       setFormData(prev => ({
// // // // //         ...prev,
// // // // //         materiel: type === 'logiciel' ? 0 : prev.materiel,
// // // // //         logiciel: type === 'materiel' ? 0 : prev.logiciel,
// // // // //         reseau: type === 'materiel' ? 0 : prev.reseau
// // // // //       }));
// // // // //     }
    
// // // // //     if (errors[name]) {
// // // // //       setErrors(prev => ({ ...prev, [name]: '' }));
// // // // //     }
// // // // //   };

// // // // //   const handleSetToday = () => {
// // // // //     const today = new Date().toISOString().split('T')[0];
// // // // //     setFormData(prev => ({ ...prev, date_resolution: today }));
// // // // //   };

// // // // //   const handleSetNow = () => {
// // // // //     const now = new Date();
// // // // //     const currentTime = now.toTimeString().slice(0, 5);
// // // // //     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
// // // // //   };

// // // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // // //     e.preventDefault();
// // // // //     if (!validateForm()) return;
    
// // // // //     setIsSubmitting(true);
// // // // //     setApiErrors([]);

// // // // //     try {
// // // // //       const incidentData: any = { 
// // // // //         description: formData.description.trim(),
// // // // //         priorite: formData.priorite,
// // // // //         statut: formData.statut,
// // // // //         type_incident: formData.type_incident,
// // // // //         utilisateur_signaleur: formData.utilisateur_signaleur // AUTO - envoyé automatiquement
// // // // //       };

// // // // //       // Ajouter la date de résolution si complète
// // // // //       if (formData.date_resolution && formData.heure_resolution) {
// // // // //         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
// // // // //       } else if (formData.date_resolution) {
// // // // //         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
// // // // //       }

// // // // //       // Ajouter les relations selon le type
// // // // //       if (formData.materiel > 0) incidentData.materiel = formData.materiel;
// // // // //       if (formData.logiciel > 0) incidentData.logiciel = formData.logiciel;
// // // // //       if (formData.reseau > 0) incidentData.reseau = formData.reseau;

// // // // //       // Ajouter l'alerte source si disponible
// // // // //       if (formData.alerte_source > 0) {
// // // // //         incidentData.alerte_source = formData.alerte_source;
// // // // //       }

// // // // //       console.log('📤 Soumission incident avec utilisateur auto:', incidentData);
// // // // //       await onSubmit(incidentData);
// // // // //       onClose();
      
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Erreur soumission:', error);
// // // // //       setApiErrors(prev => [...prev, handleApiError(error)]);
// // // // //     } finally {
// // // // //       setIsSubmitting(false);
// // // // //     }
// // // // //   };

// // // // //   const handleClose = () => {
// // // // //     if (isSubmitting) return;
// // // // //     resetForm();
// // // // //     onClose();
// // // // //   };

// // // // //   // Rendre les champs selon le type
// // // // //   const getAvailableSources = () => {
// // // // //     const type = formData.type_incident;
    
// // // // //     switch (type) {
// // // // //       case 'materiel':
// // // // //         return ['materiel'];
// // // // //       case 'logiciel':
// // // // //         return ['materiel', 'logiciel'];
// // // // //       case 'reseau':
// // // // //         return ['materiel', 'reseau'];
// // // // //       case 'mixte':
// // // // //         return ['materiel', 'logiciel', 'reseau'];
// // // // //       default:
// // // // //         return [];
// // // // //     }
// // // // //   };

// // // // //   const availableSources = getAvailableSources();

// // // // //   if (!isOpen) return null;

// // // // //   return (
// // // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // // //       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// // // // //         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
// // // // //           <div>
// // // // //             <h2 className="text-xl font-bold text-base-content">
// // // // //               {mode === 'fromAlerte' ? '📝 Créer Incident depuis Alerte' : 
// // // // //                incident ? 'Modifier l\'incident' : 'Ajouter un Incident'}
// // // // //             </h2>
// // // // //             {mode === 'fromAlerte' && alerteSource && (
// // // // //               <p className="text-sm text-base-content opacity-60 mt-1">
// // // // //                 Généré depuis l'alerte #{alerteSource.id}
// // // // //               </p>
// // // // //             )}
// // // // //           </div>
// // // // //           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
// // // // //             <X className="h-4 w-4" />
// // // // //           </button>
// // // // //         </div>

// // // // //         {/* Indicateur création depuis alerte */}
// // // // //         {mode === 'fromAlerte' && alerteSource && (
// // // // //           <div className="m-4 p-4 bg-info/10 border border-info/20 rounded-lg">
// // // // //             <div className="flex items-center gap-3">
// // // // //               <AlertTriangle className="h-5 w-5 text-info" />
// // // // //               <div className="flex-1">
// // // // //                 <p className="font-medium text-info">Incident créé automatiquement depuis une alerte</p>
// // // // //                 <p className="text-sm opacity-80 mt-1">{alerteSource.description}</p>
// // // // //                 <div className="flex flex-wrap gap-2 mt-2">
// // // // //                   <span className="badge badge-info badge-sm">
// // // // //                     Sévérité: {alerteSource.severite}
// // // // //                   </span>
// // // // //                   <span className="badge badge-info badge-sm">
// // // // //                     Type: {alerteSource.type_alerte}
// // // // //                   </span>
// // // // //                   <span className="badge badge-info badge-sm">
// // // // //                     Date: {new Date(alerteSource.date_alerte || '').toLocaleDateString('fr-FR')}
// // // // //                   </span>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Messages d'erreur API */}
// // // // //         {apiErrors.length > 0 && (
// // // // //           <div className="m-4">
// // // // //             <div className="alert alert-warning">
// // // // //               <AlertCircle className="h-5 w-5" />
// // // // //               <div className="flex flex-col gap-1">
// // // // //                 {apiErrors.map((error, index) => (
// // // // //                   <span key={index} className="text-sm">{error}</span>
// // // // //                 ))}
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {loading ? (
// // // // //           <div className="flex justify-center items-center p-12">
// // // // //             <div className="flex flex-col items-center gap-4">
// // // // //               <Loader2 className="h-8 w-8 text-primary animate-spin" />
// // // // //               <span className="text-base-content">Chargement des données...</span>
// // // // //             </div>
// // // // //           </div>
// // // // //         ) : (
// // // // //           <form onSubmit={handleSubmit} className="p-6 space-y-6">
// // // // //             {/* Description */}
// // // // //             <div className="form-control">
// // // // //               <label className="label">
// // // // //                 <span className="label-text font-semibold">Description :</span>
// // // // //                 <span className="label-text-alt text-error">*</span>
// // // // //               </label>
// // // // //               <textarea
// // // // //                 name="description"
// // // // //                 value={formData.description}
// // // // //                 onChange={handleChange}
// // // // //                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
// // // // //                 placeholder="Décrivez l'incident en détails..."
// // // // //                 disabled={isSubmitting}
// // // // //               />
// // // // //               {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
// // // // //             </div>

// // // // //             {/* Utilisateur signaleur - CHAMP FIXE (non modifiable) */}
// // // // //             <div className="form-control">
// // // // //               <label className="label">
// // // // //                 <span className="label-text font-semibold flex items-center gap-2">
// // // // //                   <User className="h-4 w-4" />
// // // // //                   Utilisateur signaleur :
// // // // //                 </span>
// // // // //               </label>
// // // // //               <div className="p-3 bg-base-200 rounded-lg border border-base-300">
// // // // //                 <div className="flex items-center justify-between">
// // // // //                   <div>
// // // // //                     <div className="font-medium">{getCurrentUserName()}</div>
// // // // //                     <div className="text-xs text-base-content opacity-60 mt-1">
// // // // //                       {currentUser?.role ? `Rôle: ${currentUser.role}` : 'Utilisateur connecté'}
// // // // //                       {currentUser?.departement && ` • Département: ${currentUser.departement}`}
// // // // //                     </div>
// // // // //                   </div>
// // // // //                   <div className="badge badge-success badge-sm">
// // // // //                     Automatique
// // // // //                   </div>
// // // // //                 </div>
// // // // //                 <input
// // // // //                   type="hidden"
// // // // //                   name="utilisateur_signaleur"
// // // // //                   value={formData.utilisateur_signaleur}
// // // // //                 />
// // // // //                 <div className="text-xs text-success mt-2">
// // // // //                   <Bell className="h-3 w-3 inline mr-1" />
// // // // //                   L'utilisateur connecté est automatiquement assigné comme signaleur
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Type d'incident */}
// // // // //             <div className="form-control">
// // // // //               <label className="label">
// // // // //                 <span className="label-text font-semibold">Type incident :</span>
// // // // //                 <span className="label-text-alt text-error">*</span>
// // // // //               </label>
// // // // //               <select
// // // // //                 name="type_incident"
// // // // //                 value={formData.type_incident}
// // // // //                 onChange={handleChange}
// // // // //                 className={`select select-bordered w-full ${errors.type_incident ? 'select-error' : ''}`}
// // // // //                 disabled={isSubmitting}
// // // // //               >
// // // // //                 <option value="">---------</option>
// // // // //                 <option value="materiel">Matériel</option>
// // // // //                 <option value="logiciel">Logiciel</option>
// // // // //                 <option value="reseau">Réseau</option>
// // // // //                 <option value="mixte">Mixte</option>
// // // // //               </select>
// // // // //               {errors.type_incident && <span className="text-error text-sm mt-1">{errors.type_incident}</span>}
// // // // //               <div className="text-xs text-base-content opacity-60 mt-1">
// // // // //                 Champs disponibles selon le type :
// // // // //                 {formData.type_incident === 'materiel' && ' Matériel uniquement'}
// // // // //                 {formData.type_incident === 'logiciel' && ' Matériel + Logiciel'}
// // // // //                 {formData.type_incident === 'reseau' && ' Matériel + Réseau'}
// // // // //                 {formData.type_incident === 'mixte' && ' Tous les champs'}
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Priorité et Statut */}
// // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //               <div className="form-control">
// // // // //                 <label className="label">
// // // // //                   <span className="label-text font-semibold">Priorité :</span>
// // // // //                 </label>
// // // // //                 <select
// // // // //                   name="priorite"
// // // // //                   value={formData.priorite}
// // // // //                   onChange={handleChange}
// // // // //                   className="select select-bordered w-full"
// // // // //                   disabled={isSubmitting}
// // // // //                 >
// // // // //                   <option value="basse">Basse</option>
// // // // //                   <option value="moyenne">Moyenne</option>
// // // // //                   <option value="elevee">Élevée</option>
// // // // //                   <option value="critique">Critique</option>
// // // // //                 </select>
// // // // //               </div>

// // // // //               <div className="form-control">
// // // // //                 <label className="label">
// // // // //                   <span className="label-text font-semibold">Statut :</span>
// // // // //                 </label>
// // // // //                 <select
// // // // //                   name="statut"
// // // // //                   value={formData.statut}
// // // // //                   onChange={handleChange}
// // // // //                   className="select select-bordered w-full"
// // // // //                   disabled={isSubmitting}
// // // // //                 >
// // // // //                   <option value="ouvert">Ouvert</option>
// // // // //                   <option value="en_cours">En cours</option>
// // // // //                   <option value="resolu">Résolu</option>
// // // // //                   <option value="ferme">Fermé</option>
// // // // //                 </select>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Sources selon le type - SECTIONS CONDITIONNELLES */}
// // // // //             {formData.type_incident && (
// // // // //               <div className="space-y-4 pt-4 border-t border-base-300">
// // // // //                 <h3 className="font-semibold text-base-content">Sources concernées :</h3>
                
// // // // //                 {/* Matériel concerné - TOUJOURS DISPONIBLE */}
// // // // //                 {availableSources.includes('materiel') && (
// // // // //                   <div className="form-control">
// // // // //                     <label className="label">
// // // // //                       <span className="label-text font-semibold">
// // // // //                         Matériel {formData.type_incident === 'materiel' && <span className="text-error">*</span>}
// // // // //                       </span>
// // // // //                     </label>
// // // // //                     <select
// // // // //                       name="materiel"
// // // // //                       value={formData.materiel}
// // // // //                       onChange={handleChange}
// // // // //                       className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
// // // // //                       disabled={isSubmitting || materiels.length === 0}
// // // // //                     >
// // // // //                       <option value={0}>Sélectionnez un matériel</option>
// // // // //                       {materiels.map(item => (
// // // // //                         <option key={item.id} value={item.id}>
// // // // //                           {item.nom} ({item.reference})
// // // // //                         </option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                     {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
// // // // //                     {formData.type_incident === 'materiel' && (
// // // // //                       <div className="text-xs text-base-content opacity-60 mt-1">
// // // // //                         Champ obligatoire pour les incidents matériels
// // // // //                       </div>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 )}

// // // // //                 {/* Logiciel concerné - SEULEMENT POUR LOGICIEL ET MIXTE */}
// // // // //                 {availableSources.includes('logiciel') && (
// // // // //                   <div className="form-control">
// // // // //                     <label className="label">
// // // // //                       <span className="label-text font-semibold">
// // // // //                         Logiciel {formData.type_incident === 'logiciel' && <span className="text-error">*</span>}
// // // // //                       </span>
// // // // //                     </label>
// // // // //                     <select
// // // // //                       name="logiciel"
// // // // //                       value={formData.logiciel}
// // // // //                       onChange={handleChange}
// // // // //                       className={`select select-bordered w-full ${errors.logiciel ? 'select-error' : ''}`}
// // // // //                       disabled={isSubmitting || logiciels.length === 0}
// // // // //                     >
// // // // //                       <option value={0}>Sélectionnez un logiciel</option>
// // // // //                       {logiciels.map(item => (
// // // // //                         <option key={item.id} value={item.id}>
// // // // //                           {item.nom} {item.version}
// // // // //                         </option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                     {errors.logiciel && <span className="text-error text-sm mt-1">{errors.logiciel}</span>}
// // // // //                   </div>
// // // // //                 )}

// // // // //                 {/* Réseau concerné - SEULEMENT POUR RESEAU ET MIXTE */}
// // // // //                 {availableSources.includes('reseau') && (
// // // // //                   <div className="form-control">
// // // // //                     <label className="label">
// // // // //                       <span className="label-text font-semibold">
// // // // //                         Réseau {formData.type_incident === 'reseau' && <span className="text-error">*</span>}
// // // // //                       </span>
// // // // //                     </label>
// // // // //                     <select
// // // // //                       name="reseau"
// // // // //                       value={formData.reseau}
// // // // //                       onChange={handleChange}
// // // // //                       className={`select select-bordered w-full ${errors.reseau ? 'select-error' : ''}`}
// // // // //                       disabled={isSubmitting || reseaux.length === 0}
// // // // //                     >
// // // // //                       <option value={0}>Sélectionnez un équipement réseau</option>
// // // // //                       {reseaux.map(item => (
// // // // //                         <option key={item.id} value={item.id}>
// // // // //                           {item.nom_hote} ({item.adresse_ip})
// // // // //                         </option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                     {errors.reseau && <span className="text-error text-sm mt-1">{errors.reseau}</span>}
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             )}

// // // // //             {/* Date et Heure */}
// // // // //             <div className="form-control">
// // // // //               <label className="label">
// // // // //                 <span className="label-text font-semibold">Date création :</span>
// // // // //               </label>
// // // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //                 {/* Date */}
// // // // //                 <div className="form-control">
// // // // //                   <label className="label">
// // // // //                     <span className="label-text">Date :</span>
// // // // //                   </label>
// // // // //                   <div className="flex items-center gap-2">
// // // // //                     <div className="relative flex-1">
// // // // //                       <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // // //                       <input
// // // // //                         type="date"
// // // // //                         name="date_resolution"
// // // // //                         value={formData.date_resolution}
// // // // //                         onChange={handleChange}
// // // // //                         className="input input-bordered w-full pl-10"
// // // // //                         disabled={isSubmitting}
// // // // //                       />
// // // // //                     </div>
// // // // //                     <button
// // // // //                       type="button"
// // // // //                       onClick={handleSetToday}
// // // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // // //                       disabled={isSubmitting}
// // // // //                     >
// // // // //                       Aujourd'hui
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 {/* Heure */}
// // // // //                 <div className="form-control">
// // // // //                   <label className="label">
// // // // //                     <span className="label-text">Heure :</span>
// // // // //                   </label>
// // // // //                   <div className="flex items-center gap-2">
// // // // //                     <div className="relative flex-1">
// // // // //                       <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // // //                       <input
// // // // //                         type="time"
// // // // //                         name="heure_resolution"
// // // // //                         value={formData.heure_resolution}
// // // // //                         onChange={handleChange}
// // // // //                         className="input input-bordered w-full pl-10"
// // // // //                         disabled={isSubmitting}
// // // // //                       />
// // // // //                     </div>
// // // // //                     <button
// // // // //                       type="button"
// // // // //                       onClick={handleSetNow}
// // // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // // //                       disabled={isSubmitting}
// // // // //                     >
// // // // //                       Maintenant
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Boutons */}
// // // // //             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
// // // // //               <button 
// // // // //                 type="button" 
// // // // //                 onClick={handleClose} 
// // // // //                 className="btn btn-ghost"
// // // // //                 disabled={isSubmitting}
// // // // //               >
// // // // //                 Annuler
// // // // //               </button>
// // // // //               <button 
// // // // //                 type="submit" 
// // // // //                 className="btn btn-primary"
// // // // //                 disabled={isSubmitting}
// // // // //               >
// // // // //                 {isSubmitting ? (
// // // // //                   <span className="flex items-center gap-2">
// // // // //                     <Loader2 className="h-4 w-4 animate-spin" />
// // // // //                     {incident ? 'Modification...' : 'Création...'}
// // // // //                   </span>
// // // // //                 ) : (
// // // // //                   incident ? 'Modifier' : 'Créer'
// // // // //                 )} l'incident
// // // // //               </button>
// // // // //             </div>
// // // // //           </form>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default IncidentForm;



// // // // // // IncidentForm.tsx - Version avec utilisateur signaleur = utilisateur connecté
// // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // import { X, Calendar, Clock, User, AlertCircle, Loader2, Bell, AlertTriangle } from 'lucide-react';
// // // // // import { Incident, User as UserType, Materiel, Logiciel, Reseau, Alerte } from '../types';
// // // // // import { materielsAPI, logicielsAPI, reseauAPI, handleApiError } from '../services/api';

// // // // // interface IncidentFormProps {
// // // // //   isOpen: boolean;
// // // // //   onClose: () => void;
// // // // //   onSubmit: (incidentData: any) => void;
// // // // //   incident?: Incident;
// // // // //   currentUser: UserType; // L'utilisateur actuellement connecté
// // // // //   alerteSource?: Alerte;
// // // // // }

// // // // // const IncidentForm: React.FC<IncidentFormProps> = ({
// // // // //   isOpen,
// // // // //   onClose,
// // // // //   onSubmit,
// // // // //   incident,
// // // // //   currentUser,
// // // // //   alerteSource
// // // // // }) => {
// // // // //   // États du formulaire
// // // // //   const [formData, setFormData] = useState({
// // // // //     description: '',
// // // // //     date_resolution: '',
// // // // //     heure_resolution: '',
// // // // //     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
// // // // //     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
// // // // //     type_incident: '' as '' | 'materiel' | 'logiciel' | 'reseau' | 'mixte',
// // // // //     materiel: 0,
// // // // //     logiciel: 0,
// // // // //     reseau: 0,
// // // // //     alerte_source: 0
// // // // //   });

// // // // //   // États pour les données externes
// // // // //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// // // // //   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
// // // // //   const [reseaux, setReseaux] = useState<Reseau[]>([]);
// // // // //   const [errors, setErrors] = useState<Record<string, string>>({});
// // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [apiErrors, setApiErrors] = useState<string[]>([]);
// // // // //   const [mode, setMode] = useState<'normal' | 'fromAlerte'>('normal');
  
// // // // //   // Références pour éviter les boucles
// // // // //   const dataLoadedRef = useRef(false);
// // // // //   const isOpenRef = useRef(false);

// // // // //   // Fonction pour obtenir le nom affichable de l'utilisateur
// // // // //   const getDisplayName = (user: UserType | null) => {
// // // // //     if (!user) return 'Utilisateur inconnu';
    
// // // // //     // Essayer différents formats de nom
// // // // //     if (user.nom_complet) return user.nom_complet;
// // // // //     if (user.first_name && user.last_name) {
// // // // //       return `${user.first_name} ${user.last_name}`;
// // // // //     }
// // // // //     if (user.username) return user.username;
// // // // //     return `Utilisateur #${user.id}`;
// // // // //   };

// // // // //   // Fonction pour extraire les données de réponse API
// // // // //   const extractDataFromResponse = (response: any): any[] => {
// // // // //     if (!response || !response.data) return [];
    
// // // // //     if (Array.isArray(response.data)) {
// // // // //       return response.data;
// // // // //     }
    
// // // // //     if (response.data.results && Array.isArray(response.data.results)) {
// // // // //       return response.data.results;
// // // // //     }
    
// // // // //     if (response.data.data && Array.isArray(response.data.data)) {
// // // // //       return response.data.data;
// // // // //     }
    
// // // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // // // //       const values = Object.values(response.data);
// // // // //       if (values.length > 0 && values.every(v => typeof v === 'object')) {
// // // // //         return values as any[];
// // // // //       }
// // // // //     }
    
// // // // //     if (response.results && Array.isArray(response.results)) {
// // // // //       return response.results;
// // // // //     }
    
// // // // //     return [];
// // // // //   };

// // // // //   // Fonction pour mapper la sévérité d'alerte vers priorité d'incident
// // // // //   const mapSeveriteToPriorite = (severite: string): 'critique' | 'elevee' | 'moyenne' | 'basse' => {
// // // // //     const mapping = {
// // // // //       'critique': 'critique',
// // // // //       'elevee': 'elevee',
// // // // //       'moyenne': 'moyenne',
// // // // //       'basse': 'basse'
// // // // //     };
// // // // //     return mapping[severite as keyof typeof mapping] || 'moyenne';
// // // // //   };

// // // // //   // Initialiser depuis une alerte
// // // // //   const initFromAlerte = () => {
// // // // //     if (!alerteSource) return;
    
// // // // //     console.log('🚨 Initialisation depuis alerte:', alerteSource);
    
// // // // //     // Déterminer le type d'incident basé sur la source de l'alerte
// // // // //     let typeIncident: 'materiel' | 'logiciel' | 'reseau' | 'mixte' = 'mixte';
    
// // // // //     if (alerteSource.materiel_id && !alerteSource.logiciel_id && !alerteSource.reseau_id) {
// // // // //       typeIncident = 'materiel';
// // // // //     } else if (alerteSource.logiciel_id && !alerteSource.materiel_id && !alerteSource.reseau_id) {
// // // // //       typeIncident = 'logiciel';
// // // // //     } else if (alerteSource.reseau_id && !alerteSource.materiel_id && !alerteSource.logiciel_id) {
// // // // //       typeIncident = 'reseau';
// // // // //     } else {
// // // // //       typeIncident = 'mixte';
// // // // //     }
    
// // // // //     // Préparer les données initiales
// // // // //     const initialData = {
// // // // //       description: `Incident généré depuis l'alerte: ${alerteSource.description}`,
// // // // //       date_resolution: new Date().toISOString().split('T')[0],
// // // // //       heure_resolution: new Date().toTimeString().slice(0, 5),
// // // // //       priorite: mapSeveriteToPriorite(alerteSource.severite),
// // // // //       statut: 'ouvert' as const,
// // // // //       type_incident: typeIncident,
// // // // //       materiel: alerteSource.materiel_id || 0,
// // // // //       logiciel: alerteSource.logiciel_id || 0,
// // // // //       reseau: alerteSource.reseau_id || 0,
// // // // //       alerte_source: alerteSource.id || 0
// // // // //     };
    
// // // // //     setFormData(initialData);
// // // // //     setMode('fromAlerte');
    
// // // // //     console.log('📝 Données initialisées depuis alerte:', initialData);
// // // // //   };

// // // // //   // Charger les matériels
// // // // //   const fetchMateriels = async () => {
// // // // //     try {
// // // // //       console.log('🔄 Chargement des matériels...');
// // // // //       const response = await materielsAPI.getAll();
// // // // //       const materielsData = extractDataFromResponse(response);
// // // // //       setMateriels(materielsData);
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Erreur chargement matériels:', error);
// // // // //     }
// // // // //   };

// // // // //   // Charger les logiciels
// // // // //   const fetchLogiciels = async () => {
// // // // //     try {
// // // // //       console.log('🔄 Chargement des logiciels...');
// // // // //       const response = await logicielsAPI.getAll();
// // // // //       const logicielsData = extractDataFromResponse(response);
// // // // //       setLogiciels(logicielsData);
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Erreur chargement logiciels:', error);
// // // // //     }
// // // // //   };

// // // // //   // Charger les réseaux
// // // // //   const fetchReseaux = async () => {
// // // // //     try {
// // // // //       console.log('🔄 Chargement des réseaux...');
// // // // //       const response = await reseauAPI.getAll();
// // // // //       const reseauxData = extractDataFromResponse(response);
// // // // //       setReseaux(reseauxData);
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Erreur chargement réseaux:', error);
// // // // //     }
// // // // //   };

// // // // //   // Charger toutes les données
// // // // //   const fetchAllData = async () => {
// // // // //     if (dataLoadedRef.current || !isOpen) return;
    
// // // // //     setLoading(true);
// // // // //     setApiErrors([]);
// // // // //     dataLoadedRef.current = true;
    
// // // // //     try {
// // // // //       console.log('🔄 Début du chargement de toutes les données...');
      
// // // // //       // Charger en parallèle
// // // // //       await Promise.allSettled([
// // // // //         fetchMateriels(),
// // // // //         fetchLogiciels(),
// // // // //         fetchReseaux()
// // // // //       ]);
      
// // // // //       // Initialiser le formulaire
// // // // //       if (alerteSource) {
// // // // //         initFromAlerte();
// // // // //       } else if (incident) {
// // // // //         console.log('📝 Initialisation avec incident:', incident);
        
// // // // //         setFormData({
// // // // //           description: incident.description || '',
// // // // //           date_resolution: incident.date_resolution?.split('T')[0] || '',
// // // // //           heure_resolution: incident.date_resolution?.split('T')[1]?.substring(0, 5) || '',
// // // // //           priorite: incident.priorite || 'moyenne',
// // // // //           statut: incident.statut || 'ouvert',
// // // // //           type_incident: incident.type_incident || '',
// // // // //           materiel: incident.materiel || 0,
// // // // //           logiciel: incident.logiciel || 0,
// // // // //           reseau: incident.reseau || 0,
// // // // //           alerte_source: 0
// // // // //         });
// // // // //       } else {
// // // // //         // Pour un nouvel incident
// // // // //         console.log('👤 Utilisateur connecté actuel:', {
// // // // //           id: currentUser?.id,
// // // // //           nom: getDisplayName(currentUser),
// // // // //           username: currentUser?.username
// // // // //         });
// // // // //       }
      
// // // // //     } catch (error) {
// // // // //       console.error('💥 Erreur critique lors du chargement:', error);
// // // // //       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Effet pour charger les données
// // // // //   useEffect(() => {
// // // // //     if (isOpen && !isOpenRef.current) {
// // // // //       isOpenRef.current = true;
// // // // //       dataLoadedRef.current = false;
// // // // //       fetchAllData();
// // // // //     }
    
// // // // //     return () => {
// // // // //       if (!isOpen) {
// // // // //         isOpenRef.current = false;
// // // // //         dataLoadedRef.current = false;
// // // // //       }
// // // // //     };
// // // // //   }, [isOpen, incident, alerteSource]);

// // // // //   const resetForm = () => {
// // // // //     setFormData({
// // // // //       description: '',
// // // // //       date_resolution: '',
// // // // //       heure_resolution: '',
// // // // //       priorite: 'moyenne',
// // // // //       statut: 'ouvert',
// // // // //       type_incident: '',
// // // // //       materiel: 0,
// // // // //       logiciel: 0,
// // // // //       reseau: 0,
// // // // //       alerte_source: 0
// // // // //     });
// // // // //     setErrors({});
// // // // //     setApiErrors([]);
// // // // //     setMode('normal');
// // // // //   };

// // // // //   const validateForm = () => {
// // // // //     const newErrors: Record<string, string> = {};
    
// // // // //     if (!formData.description.trim()) {
// // // // //       newErrors.description = 'Description requise';
// // // // //     }
    
// // // // //     if (!formData.type_incident) {
// // // // //       newErrors.type_incident = 'Type d\'incident requis';
// // // // //     }
    
// // // // //     // Validation basée sur le type d'incident
// // // // //     if (formData.type_incident === 'materiel' && formData.materiel === 0) {
// // // // //       newErrors.materiel = 'Matériel requis pour ce type d\'incident';
// // // // //     }
    
// // // // //     if (formData.type_incident === 'logiciel' && formData.logiciel === 0) {
// // // // //       newErrors.logiciel = 'Logiciel requis pour ce type d\'incident';
// // // // //     }
    
// // // // //     if (formData.type_incident === 'reseau' && formData.reseau === 0) {
// // // // //       newErrors.reseau = 'Réseau requis pour ce type d\'incident';
// // // // //     }
    
// // // // //     if (formData.type_incident === 'mixte' && formData.materiel === 0 && formData.logiciel === 0 && formData.reseau === 0) {
// // // // //       newErrors.type_incident = 'Au moins une source (matériel, logiciel ou réseau) est requise';
// // // // //     }
    
// // // // //     setErrors(newErrors);
// // // // //     return Object.keys(newErrors).length === 0;
// // // // //   };

// // // // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// // // // //     const { name, value } = e.target;
    
// // // // //     setFormData(prev => ({
// // // // //       ...prev,
// // // // //       [name]: name === 'materiel' || name === 'logiciel' || name === 'reseau'
// // // // //         ? parseInt(value) || 0 
// // // // //         : value
// // // // //     }));
    
// // // // //     // Réinitialiser les champs de source selon le type
// // // // //     if (name === 'type_incident') {
// // // // //       const type = value as 'materiel' | 'logiciel' | 'reseau' | 'mixte';
// // // // //       setFormData(prev => ({
// // // // //         ...prev,
// // // // //         materiel: type === 'logiciel' ? 0 : prev.materiel,
// // // // //         logiciel: type === 'materiel' ? 0 : prev.logiciel,
// // // // //         reseau: type === 'materiel' ? 0 : prev.reseau
// // // // //       }));
// // // // //     }
    
// // // // //     if (errors[name]) {
// // // // //       setErrors(prev => ({ ...prev, [name]: '' }));
// // // // //     }
// // // // //   };

// // // // //   const handleSetToday = () => {
// // // // //     const today = new Date().toISOString().split('T')[0];
// // // // //     setFormData(prev => ({ ...prev, date_resolution: today }));
// // // // //   };

// // // // //   const handleSetNow = () => {
// // // // //     const now = new Date();
// // // // //     const currentTime = now.toTimeString().slice(0, 5);
// // // // //     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
// // // // //   };

// // // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // // //     e.preventDefault();
// // // // //     if (!validateForm()) return;
    
// // // // //     setIsSubmitting(true);
// // // // //     setApiErrors([]);

// // // // //     try {
// // // // //       // L'utilisateur signaleur est TOUJOURS l'utilisateur connecté
// // // // //       const utilisateurSignaleurId = currentUser?.id || 0;
      
// // // // //       console.log('👤 Utilisateur signaleur:', {
// // // // //         id: utilisateurSignaleurId,
// // // // //         nom: getDisplayName(currentUser),
// // // // //         username: currentUser?.username
// // // // //       });
      
// // // // //       const incidentData: any = { 
// // // // //         description: formData.description.trim(),
// // // // //         priorite: formData.priorite,
// // // // //         statut: formData.statut,
// // // // //         type_incident: formData.type_incident,
// // // // //         utilisateur_signaleur: utilisateurSignaleurId // L'utilisateur connecté
// // // // //       };

// // // // //       // Ajouter la date de résolution si complète
// // // // //       if (formData.date_resolution && formData.heure_resolution) {
// // // // //         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
// // // // //       } else if (formData.date_resolution) {
// // // // //         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
// // // // //       }

// // // // //       // Ajouter les relations selon le type
// // // // //       if (formData.materiel > 0) incidentData.materiel = formData.materiel;
// // // // //       if (formData.logiciel > 0) incidentData.logiciel = formData.logiciel;
// // // // //       if (formData.reseau > 0) incidentData.reseau = formData.reseau;

// // // // //       // Ajouter l'alerte source si disponible
// // // // //       if (formData.alerte_source > 0) {
// // // // //         incidentData.alerte_source = formData.alerte_source;
// // // // //       }

// // // // //       console.log('📤 Soumission incident:', incidentData);
// // // // //       await onSubmit(incidentData);
// // // // //       onClose();
      
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Erreur soumission:', error);
// // // // //       setApiErrors(prev => [...prev, handleApiError(error)]);
// // // // //     } finally {
// // // // //       setIsSubmitting(false);
// // // // //     }
// // // // //   };

// // // // //   const handleClose = () => {
// // // // //     if (isSubmitting) return;
// // // // //     resetForm();
// // // // //     onClose();
// // // // //   };

// // // // //   // Rendre les champs selon le type
// // // // //   const getAvailableSources = () => {
// // // // //     const type = formData.type_incident;
    
// // // // //     switch (type) {
// // // // //       case 'materiel':
// // // // //         return ['materiel'];
// // // // //       case 'logiciel':
// // // // //         return ['materiel', 'logiciel'];
// // // // //       case 'reseau':
// // // // //         return ['materiel', 'reseau'];
// // // // //       case 'mixte':
// // // // //         return ['materiel', 'logiciel', 'reseau'];
// // // // //       default:
// // // // //         return [];
// // // // //     }
// // // // //   };

// // // // //   const availableSources = getAvailableSources();

// // // // //   if (!isOpen) return null;

// // // // //   return (
// // // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // // //       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// // // // //         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
// // // // //           <div>
// // // // //             <h2 className="text-xl font-bold text-base-content">
// // // // //               {mode === 'fromAlerte' ? '📝 Créer Incident depuis Alerte' : 
// // // // //                incident ? 'Modifier l\'incident' : 'Ajouter un Incident'}
// // // // //             </h2>
// // // // //             {mode === 'fromAlerte' && alerteSource && (
// // // // //               <p className="text-sm text-base-content opacity-60 mt-1">
// // // // //                 Généré depuis l'alerte #{alerteSource.id}
// // // // //               </p>
// // // // //             )}
// // // // //           </div>
// // // // //           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
// // // // //             <X className="h-4 w-4" />
// // // // //           </button>
// // // // //         </div>

// // // // //         {/* Indicateur création depuis alerte */}
// // // // //         {mode === 'fromAlerte' && alerteSource && (
// // // // //           <div className="m-4 p-4 bg-info/10 border border-info/20 rounded-lg">
// // // // //             <div className="flex items-center gap-3">
// // // // //               <AlertTriangle className="h-5 w-5 text-info" />
// // // // //               <div className="flex-1">
// // // // //                 <p className="font-medium text-info">Incident créé automatiquement depuis une alerte</p>
// // // // //                 <p className="text-sm opacity-80 mt-1">{alerteSource.description}</p>
// // // // //                 <div className="flex flex-wrap gap-2 mt-2">
// // // // //                   <span className="badge badge-info badge-sm">
// // // // //                     Sévérité: {alerteSource.severite}
// // // // //                   </span>
// // // // //                   <span className="badge badge-info badge-sm">
// // // // //                     Type: {alerteSource.type_alerte}
// // // // //                   </span>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Messages d'erreur API */}
// // // // //         {apiErrors.length > 0 && (
// // // // //           <div className="m-4">
// // // // //             <div className="alert alert-warning">
// // // // //               <AlertCircle className="h-5 w-5" />
// // // // //               <div className="flex flex-col gap-1">
// // // // //                 {apiErrors.map((error, index) => (
// // // // //                   <span key={index} className="text-sm">{error}</span>
// // // // //                 ))}
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {loading ? (
// // // // //           <div className="flex justify-center items-center p-12">
// // // // //             <div className="flex flex-col items-center gap-4">
// // // // //               <Loader2 className="h-8 w-8 text-primary animate-spin" />
// // // // //               <span className="text-base-content">Chargement des données...</span>
// // // // //             </div>
// // // // //           </div>
// // // // //         ) : (
// // // // //           <form onSubmit={handleSubmit} className="p-6 space-y-6">
// // // // //             {/* Informations de l'utilisateur connecté */}
// // // // //             <div className="bg-base-200 rounded-lg p-4 border border-base-300">
// // // // //               <div className="flex items-center justify-between mb-2">
// // // // //                 <div className="flex items-center gap-3">
// // // // //                   <User className="h-5 w-5 text-primary" />
// // // // //                   <div>
// // // // //                     <h3 className="font-semibold text-base-content">Utilisateur signaleur</h3>
// // // // //                     <p className="text-sm text-base-content opacity-70">
// // // // //                       L'utilisateur actuellement connecté sera automatiquement assigné
// // // // //                     </p>
// // // // //                   </div>
// // // // //                 </div>
// // // // //                 <div className="badge badge-success badge-sm">
// // // // //                   Automatique
// // // // //                 </div>
// // // // //               </div>
              
// // // // //               <div className="mt-3 p-3 bg-base-100 rounded border border-base-300">
// // // // //                 <div className="flex items-center gap-3">
// // // // //                   <div className="avatar placeholder">
// // // // //                     <div className="bg-neutral text-neutral-content rounded-full w-10">
// // // // //                       <span className="text-sm">
// // // // //                         {getDisplayName(currentUser).charAt(0).toUpperCase()}
// // // // //                       </span>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                   <div className="flex-1">
// // // // //                     <div className="font-bold text-base-content">{getDisplayName(currentUser)}</div>
// // // // //                     <div className="text-sm text-base-content opacity-70">
// // // // //                       {currentUser?.username && <span>Identifiant: {currentUser.username}</span>}
// // // // //                       {currentUser?.role && <span> • Rôle: {currentUser.role}</span>}
// // // // //                       {currentUser?.departement && <span> • Département: {currentUser.departement}</span>}
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
                
// // // // //                 <div className="mt-2 text-xs text-success flex items-center gap-1">
// // // // //                   <Bell className="h-3 w-3" />
// // // // //                   <span>Vous signalez cet incident en tant que: {getDisplayName(currentUser)}</span>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Description */}
// // // // //             <div className="form-control">
// // // // //               <label className="label">
// // // // //                 <span className="label-text font-semibold">Description :</span>
// // // // //                 <span className="label-text-alt text-error">*</span>
// // // // //               </label>
// // // // //               <textarea
// // // // //                 name="description"
// // // // //                 value={formData.description}
// // // // //                 onChange={handleChange}
// // // // //                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
// // // // //                 placeholder="Décrivez l'incident en détails..."
// // // // //                 disabled={isSubmitting}
// // // // //               />
// // // // //               {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
// // // // //             </div>

// // // // //             {/* Type d'incident */}
// // // // //             <div className="form-control">
// // // // //               <label className="label">
// // // // //                 <span className="label-text font-semibold">Type incident :</span>
// // // // //                 <span className="label-text-alt text-error">*</span>
// // // // //               </label>
// // // // //               <select
// // // // //                 name="type_incident"
// // // // //                 value={formData.type_incident}
// // // // //                 onChange={handleChange}
// // // // //                 className={`select select-bordered w-full ${errors.type_incident ? 'select-error' : ''}`}
// // // // //                 disabled={isSubmitting}
// // // // //               >
// // // // //                 <option value="">---------</option>
// // // // //                 <option value="materiel">Matériel</option>
// // // // //                 <option value="logiciel">Logiciel</option>
// // // // //                 <option value="reseau">Réseau</option>
// // // // //                 <option value="mixte">Mixte</option>
// // // // //               </select>
// // // // //               {errors.type_incident && <span className="text-error text-sm mt-1">{errors.type_incident}</span>}
// // // // //               <div className="text-xs text-base-content opacity-60 mt-1">
// // // // //                 Champs disponibles selon le type :
// // // // //                 {formData.type_incident === 'materiel' && ' Matériel uniquement'}
// // // // //                 {formData.type_incident === 'logiciel' && ' Matériel + Logiciel'}
// // // // //                 {formData.type_incident === 'reseau' && ' Matériel + Réseau'}
// // // // //                 {formData.type_incident === 'mixte' && ' Tous les champs'}
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Priorité et Statut */}
// // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //               <div className="form-control">
// // // // //                 <label className="label">
// // // // //                   <span className="label-text font-semibold">Priorité :</span>
// // // // //                 </label>
// // // // //                 <select
// // // // //                   name="priorite"
// // // // //                   value={formData.priorite}
// // // // //                   onChange={handleChange}
// // // // //                   className="select select-bordered w-full"
// // // // //                   disabled={isSubmitting}
// // // // //                 >
// // // // //                   <option value="basse">Basse</option>
// // // // //                   <option value="moyenne">Moyenne</option>
// // // // //                   <option value="elevee">Élevée</option>
// // // // //                   <option value="critique">Critique</option>
// // // // //                 </select>
// // // // //               </div>

// // // // //               <div className="form-control">
// // // // //                 <label className="label">
// // // // //                   <span className="label-text font-semibold">Statut :</span>
// // // // //                 </label>
// // // // //                 <select
// // // // //                   name="statut"
// // // // //                   value={formData.statut}
// // // // //                   onChange={handleChange}
// // // // //                   className="select select-bordered w-full"
// // // // //                   disabled={isSubmitting}
// // // // //                 >
// // // // //                   <option value="ouvert">Ouvert</option>
// // // // //                   <option value="en_cours">En cours</option>
// // // // //                   <option value="resolu">Résolu</option>
// // // // //                   <option value="ferme">Fermé</option>
// // // // //                 </select>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Sources selon le type - SECTIONS CONDITIONNELLES */}
// // // // //             {formData.type_incident && (
// // // // //               <div className="space-y-4 pt-4 border-t border-base-300">
// // // // //                 <h3 className="font-semibold text-base-content">Sources concernées :</h3>
                
// // // // //                 {/* Matériel concerné */}
// // // // //                 {availableSources.includes('materiel') && (
// // // // //                   <div className="form-control">
// // // // //                     <label className="label">
// // // // //                       <span className="label-text font-semibold">
// // // // //                         Matériel {formData.type_incident === 'materiel' && <span className="text-error">*</span>}
// // // // //                       </span>
// // // // //                     </label>
// // // // //                     <select
// // // // //                       name="materiel"
// // // // //                       value={formData.materiel}
// // // // //                       onChange={handleChange}
// // // // //                       className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
// // // // //                       disabled={isSubmitting || materiels.length === 0}
// // // // //                     >
// // // // //                       <option value={0}>Sélectionnez un matériel</option>
// // // // //                       {materiels.map(item => (
// // // // //                         <option key={item.id} value={item.id}>
// // // // //                           {item.nom} ({item.reference})
// // // // //                         </option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                     {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
// // // // //                   </div>
// // // // //                 )}

// // // // //                 {/* Logiciel concerné */}
// // // // //                 {availableSources.includes('logiciel') && (
// // // // //                   <div className="form-control">
// // // // //                     <label className="label">
// // // // //                       <span className="label-text font-semibold">
// // // // //                         Logiciel {formData.type_incident === 'logiciel' && <span className="text-error">*</span>}
// // // // //                       </span>
// // // // //                     </label>
// // // // //                     <select
// // // // //                       name="logiciel"
// // // // //                       value={formData.logiciel}
// // // // //                       onChange={handleChange}
// // // // //                       className={`select select-bordered w-full ${errors.logiciel ? 'select-error' : ''}`}
// // // // //                       disabled={isSubmitting || logiciels.length === 0}
// // // // //                     >
// // // // //                       <option value={0}>Sélectionnez un logiciel</option>
// // // // //                       {logiciels.map(item => (
// // // // //                         <option key={item.id} value={item.id}>
// // // // //                           {item.nom} {item.version}
// // // // //                         </option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                     {errors.logiciel && <span className="text-error text-sm mt-1">{errors.logiciel}</span>}
// // // // //                   </div>
// // // // //                 )}

// // // // //                 {/* Réseau concerné */}
// // // // //                 {availableSources.includes('reseau') && (
// // // // //                   <div className="form-control">
// // // // //                     <label className="label">
// // // // //                       <span className="label-text font-semibold">
// // // // //                         Réseau {formData.type_incident === 'reseau' && <span className="text-error">*</span>}
// // // // //                       </span>
// // // // //                     </label>
// // // // //                     <select
// // // // //                       name="reseau"
// // // // //                       value={formData.reseau}
// // // // //                       onChange={handleChange}
// // // // //                       className={`select select-bordered w-full ${errors.reseau ? 'select-error' : ''}`}
// // // // //                       disabled={isSubmitting || reseaux.length === 0}
// // // // //                     >
// // // // //                       <option value={0}>Sélectionnez un équipement réseau</option>
// // // // //                       {reseaux.map(item => (
// // // // //                         <option key={item.id} value={item.id}>
// // // // //                           {item.nom_hote} ({item.adresse_ip})
// // // // //                         </option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                     {errors.reseau && <span className="text-error text-sm mt-1">{errors.reseau}</span>}
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             )}

// // // // //             {/* Date et Heure */}
// // // // //             <div className="form-control">
// // // // //               <label className="label">
// // // // //                 <span className="label-text font-semibold">Date création :</span>
// // // // //               </label>
// // // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //                 {/* Date */}
// // // // //                 <div className="form-control">
// // // // //                   <label className="label">
// // // // //                     <span className="label-text">Date :</span>
// // // // //                   </label>
// // // // //                   <div className="flex items-center gap-2">
// // // // //                     <div className="relative flex-1">
// // // // //                       <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // // //                       <input
// // // // //                         type="date"
// // // // //                         name="date_resolution"
// // // // //                         value={formData.date_resolution}
// // // // //                         onChange={handleChange}
// // // // //                         className="input input-bordered w-full pl-10"
// // // // //                         disabled={isSubmitting}
// // // // //                       />
// // // // //                     </div>
// // // // //                     <button
// // // // //                       type="button"
// // // // //                       onClick={handleSetToday}
// // // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // // //                       disabled={isSubmitting}
// // // // //                     >
// // // // //                       Aujourd'hui
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 {/* Heure */}
// // // // //                 <div className="form-control">
// // // // //                   <label className="label">
// // // // //                     <span className="label-text">Heure :</span>
// // // // //                   </label>
// // // // //                   <div className="flex items-center gap-2">
// // // // //                     <div className="relative flex-1">
// // // // //                       <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // // //                       <input
// // // // //                         type="time"
// // // // //                         name="heure_resolution"
// // // // //                         value={formData.heure_resolution}
// // // // //                         onChange={handleChange}
// // // // //                         className="input input-bordered w-full pl-10"
// // // // //                         disabled={isSubmitting}
// // // // //                       />
// // // // //                     </div>
// // // // //                     <button
// // // // //                       type="button"
// // // // //                       onClick={handleSetNow}
// // // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // // //                       disabled={isSubmitting}
// // // // //                     >
// // // // //                       Maintenant
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Boutons */}
// // // // //             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
// // // // //               <button 
// // // // //                 type="button" 
// // // // //                 onClick={handleClose} 
// // // // //                 className="btn btn-ghost"
// // // // //                 disabled={isSubmitting}
// // // // //               >
// // // // //                 Annuler
// // // // //               </button>
// // // // //               <button 
// // // // //                 type="submit" 
// // // // //                 className="btn btn-primary"
// // // // //                 disabled={isSubmitting}
// // // // //               >
// // // // //                 {isSubmitting ? (
// // // // //                   <span className="flex items-center gap-2">
// // // // //                     <Loader2 className="h-4 w-4 animate-spin" />
// // // // //                     {incident ? 'Modification...' : 'Création...'}
// // // // //                   </span>
// // // // //                 ) : (
// // // // //                   incident ? 'Modifier' : 'Créer'
// // // // //                 )} l'incident
// // // // //               </button>
// // // // //             </div>
// // // // //           </form>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default IncidentForm;






// // // // // IncidentForm.tsx - Version avec signaleur automatique (utilisateur connecté uniquement)
// // // // // IncidentForm.tsx - Version avec signaleur automatique (tous rôles)
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import { X, Calendar, Clock, User, AlertCircle, Loader2, AlertTriangle, Shield, Wrench, Briefcase, FileText } from 'lucide-react';
// // // // import { Incident, User as UserType, Materiel, Logiciel, Reseau, Alerte } from '../types';
// // // // import { materielsAPI, logicielsAPI, reseauAPI, handleApiError } from '../services/api';

// // // // interface IncidentFormProps {
// // // //   isOpen: boolean;
// // // //   onClose: () => void;
// // // //   onSubmit: (incidentData: any) => void;
// // // //   incident?: Incident;
// // // //   currentUser: UserType; // L'utilisateur actuellement connecté
// // // //   alerteSource?: Alerte;
// // // // }

// // // // const IncidentForm: React.FC<IncidentFormProps> = ({
// // // //   isOpen,
// // // //   onClose,
// // // //   onSubmit,
// // // //   incident,
// // // //   currentUser,
// // // //   alerteSource
// // // // }) => {
// // // //   // États du formulaire
// // // //   const [formData, setFormData] = useState({
// // // //     description: '',
// // // //     date_resolution: '',
// // // //     heure_resolution: '',
// // // //     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
// // // //     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
// // // //     type_incident: '' as '' | 'materiel' | 'logiciel' | 'reseau' | 'mixte',
// // // //     materiel: 0,
// // // //     logiciel: 0,
// // // //     reseau: 0,
// // // //     alerte_source: 0
// // // //   });

// // // //   // États pour les données externes
// // // //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// // // //   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
// // // //   const [reseaux, setReseaux] = useState<Reseau[]>([]);
// // // //   const [errors, setErrors] = useState<Record<string, string>>({});
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [apiErrors, setApiErrors] = useState<string[]>([]);
// // // //   const [mode, setMode] = useState<'normal' | 'fromAlerte'>('normal');
  
// // // //   // Références pour éviter les boucles
// // // //   const dataLoadedRef = useRef(false);
// // // //   const isOpenRef = useRef(false);

// // // //   // Fonction pour obtenir le nom affichable de l'utilisateur
// // // //   const getDisplayName = (user: UserType | null) => {
// // // //     if (!user) return 'Utilisateur inconnu';
    
// // // //     // Essayer différents formats de nom
// // // //     if (user.nom_complet) return user.nom_complet;
// // // //     if (user.first_name && user.last_name) {
// // // //       return `${user.first_name} ${user.last_name}`;
// // // //     }
// // // //     if (user.username) return user.username;
// // // //     return `Utilisateur #${user.id}`;
// // // //   };

// // // //   // Fonction pour obtenir l'icône selon le rôle
// // // //   const getRoleIcon = (role: string | undefined) => {
// // // //     if (!role) return <User className="h-4 w-4" />;
    
// // // //     switch (role.toLowerCase()) {
// // // //       case 'admin':
// // // //       case 'administrateur':
// // // //         return <Shield className="h-4 w-4" />;
// // // //       case 'technician':
// // // //       case 'technicien':
// // // //         return <Wrench className="h-4 w-4" />;
// // // //       case 'director':
// // // //       case 'directeur':
// // // //         return <Briefcase className="h-4 w-4" />;
// // // //       case 'secretary':
// // // //       case 'secretaire':
// // // //         return <FileText className="h-4 w-4" />;
// // // //       default:
// // // //         return <User className="h-4 w-4" />;
// // // //     }
// // // //   };

// // // //   // Fonction pour obtenir la couleur selon le rôle
// // // //   const getRoleBadgeClass = (role: string | undefined) => {
// // // //     if (!role) return 'badge-neutral';
    
// // // //     switch (role.toLowerCase()) {
// // // //       case 'admin':
// // // //       case 'administrateur':
// // // //         return 'badge-error';
// // // //       case 'technician':
// // // //       case 'technicien':
// // // //         return 'badge-warning';
// // // //       case 'director':
// // // //       case 'directeur':
// // // //         return 'badge-success';
// // // //       case 'secretary':
// // // //       case 'secretaire':
// // // //         return 'badge-info';
// // // //       default:
// // // //         return 'badge-neutral';
// // // //     }
// // // //   };

// // // //   // Fonction pour obtenir le texte du rôle
// // // //   const getRoleText = (role: string | undefined) => {
// // // //     if (!role) return 'Utilisateur';
    
// // // //     switch (role.toLowerCase()) {
// // // //       case 'admin':
// // // //       case 'administrateur':
// // // //         return 'Administrateur';
// // // //       case 'technician':
// // // //       case 'technicien':
// // // //         return 'Technicien';
// // // //       case 'director':
// // // //       case 'directeur':
// // // //         return 'Directeur';
// // // //       case 'secretary':
// // // //       case 'secretaire':
// // // //         return 'Secrétaire';
// // // //       case 'user':
// // // //         return 'Utilisateur';
// // // //       default:
// // // //         return role.charAt(0).toUpperCase() + role.slice(1);
// // // //     }
// // // //   };

// // // //   // Fonction pour extraire les données de réponse API
// // // //   const extractDataFromResponse = (response: any): any[] => {
// // // //     if (!response || !response.data) return [];
    
// // // //     if (Array.isArray(response.data)) {
// // // //       return response.data;
// // // //     }
    
// // // //     if (response.data.results && Array.isArray(response.data.results)) {
// // // //       return response.data.results;
// // // //     }
    
// // // //     if (response.data.data && Array.isArray(response.data.data)) {
// // // //       return response.data.data;
// // // //     }
    
// // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // // //       const values = Object.values(response.data);
// // // //       if (values.length > 0 && values.every(v => typeof v === 'object')) {
// // // //         return values as any[];
// // // //       }
// // // //     }
    
// // // //     if (response.results && Array.isArray(response.results)) {
// // // //       return response.results;
// // // //     }
    
// // // //     return [];
// // // //   };

// // // //   // Fonction pour mapper la sévérité d'alerte vers priorité d'incident
// // // //   const mapSeveriteToPriorite = (severite: string): 'critique' | 'elevee' | 'moyenne' | 'basse' => {
// // // //     const mapping = {
// // // //       'critique': 'critique',
// // // //       'elevee': 'elevee',
// // // //       'moyenne': 'moyenne',
// // // //       'basse': 'basse'
// // // //     };
// // // //     return mapping[severite as keyof typeof mapping] || 'moyenne';
// // // //   };

// // // //   // Initialiser depuis une alerte
// // // //   const initFromAlerte = () => {
// // // //     if (!alerteSource) return;
    
// // // //     console.log('🚨 Initialisation depuis alerte:', alerteSource);
    
// // // //     // Déterminer le type d'incident basé sur la source de l'alerte
// // // //     let typeIncident: 'materiel' | 'logiciel' | 'reseau' | 'mixte' = 'mixte';
    
// // // //     if (alerteSource.materiel_id && !alerteSource.logiciel_id && !alerteSource.reseau_id) {
// // // //       typeIncident = 'materiel';
// // // //     } else if (alerteSource.logiciel_id && !alerteSource.materiel_id && !alerteSource.reseau_id) {
// // // //       typeIncident = 'logiciel';
// // // //     } else if (alerteSource.reseau_id && !alerteSource.materiel_id && !alerteSource.logiciel_id) {
// // // //       typeIncident = 'reseau';
// // // //     } else {
// // // //       typeIncident = 'mixte';
// // // //     }
    
// // // //     // Préparer les données initiales
// // // //     const initialData = {
// // // //       description: `Incident généré depuis l'alerte: ${alerteSource.description}`,
// // // //       date_resolution: new Date().toISOString().split('T')[0],
// // // //       heure_resolution: new Date().toTimeString().slice(0, 5),
// // // //       priorite: mapSeveriteToPriorite(alerteSource.severite),
// // // //       statut: 'ouvert' as const,
// // // //       type_incident: typeIncident,
// // // //       materiel: alerteSource.materiel_id || 0,
// // // //       logiciel: alerteSource.logiciel_id || 0,
// // // //       reseau: alerteSource.reseau_id || 0,
// // // //       alerte_source: alerteSource.id || 0
// // // //     };
    
// // // //     setFormData(initialData);
// // // //     setMode('fromAlerte');
    
// // // //     console.log('📝 Données initialisées depuis alerte:', initialData);
// // // //   };

// // // //   // Charger les matériels
// // // //   const fetchMateriels = async () => {
// // // //     try {
// // // //       console.log('🔄 Chargement des matériels...');
// // // //       const response = await materielsAPI.getAll();
// // // //       const materielsData = extractDataFromResponse(response);
// // // //       setMateriels(materielsData);
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur chargement matériels:', error);
// // // //     }
// // // //   };

// // // //   // Charger les logiciels
// // // //   const fetchLogiciels = async () => {
// // // //     try {
// // // //       console.log('🔄 Chargement des logiciels...');
// // // //       const response = await logicielsAPI.getAll();
// // // //       const logicielsData = extractDataFromResponse(response);
// // // //       setLogiciels(logicielsData);
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur chargement logiciels:', error);
// // // //     }
// // // //   };

// // // //   // Charger les réseaux
// // // //   const fetchReseaux = async () => {
// // // //     try {
// // // //       console.log('🔄 Chargement des réseaux...');
// // // //       const response = await reseauAPI.getAll();
// // // //       const reseauxData = extractDataFromResponse(response);
// // // //       setReseaux(reseauxData);
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur chargement réseaux:', error);
// // // //     }
// // // //   };

// // // //   // Charger toutes les données
// // // //   const fetchAllData = async () => {
// // // //     if (dataLoadedRef.current || !isOpen) return;
    
// // // //     setLoading(true);
// // // //     setApiErrors([]);
// // // //     dataLoadedRef.current = true;
    
// // // //     try {
// // // //       console.log('🔄 Début du chargement de toutes les données...');
      
// // // //       // Charger en parallèle
// // // //       await Promise.allSettled([
// // // //         fetchMateriels(),
// // // //         fetchLogiciels(),
// // // //         fetchReseaux()
// // // //       ]);
      
// // // //       // Initialiser le formulaire
// // // //       if (alerteSource) {
// // // //         initFromAlerte();
// // // //       } else if (incident) {
// // // //         console.log('📝 Initialisation avec incident:', incident);
        
// // // //         setFormData({
// // // //           description: incident.description || '',
// // // //           date_resolution: incident.date_resolution?.split('T')[0] || '',
// // // //           heure_resolution: incident.date_resolution?.split('T')[1]?.substring(0, 5) || '',
// // // //           priorite: incident.priorite || 'moyenne',
// // // //           statut: incident.statut || 'ouvert',
// // // //           type_incident: incident.type_incident || '',
// // // //           materiel: incident.materiel || 0,
// // // //           logiciel: incident.logiciel || 0,
// // // //           reseau: incident.reseau || 0,
// // // //           alerte_source: 0
// // // //         });
// // // //       }
      
// // // //     } catch (error) {
// // // //       console.error('💥 Erreur critique lors du chargement:', error);
// // // //       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // Effet pour charger les données
// // // //   useEffect(() => {
// // // //     if (isOpen && !isOpenRef.current) {
// // // //       isOpenRef.current = true;
// // // //       dataLoadedRef.current = false;
// // // //       fetchAllData();
// // // //     }
    
// // // //     return () => {
// // // //       if (!isOpen) {
// // // //         isOpenRef.current = false;
// // // //         dataLoadedRef.current = false;
// // // //       }
// // // //     };
// // // //   }, [isOpen, incident, alerteSource]);

// // // //   const resetForm = () => {
// // // //     setFormData({
// // // //       description: '',
// // // //       date_resolution: '',
// // // //       heure_resolution: '',
// // // //       priorite: 'moyenne',
// // // //       statut: 'ouvert',
// // // //       type_incident: '',
// // // //       materiel: 0,
// // // //       logiciel: 0,
// // // //       reseau: 0,
// // // //       alerte_source: 0
// // // //     });
// // // //     setErrors({});
// // // //     setApiErrors([]);
// // // //     setMode('normal');
// // // //   };

// // // //   const validateForm = () => {
// // // //     const newErrors: Record<string, string> = {};
    
// // // //     if (!formData.description.trim()) {
// // // //       newErrors.description = 'Description requise';
// // // //     }
    
// // // //     if (!formData.type_incident) {
// // // //       newErrors.type_incident = 'Type d\'incident requis';
// // // //     }
    
// // // //     // Validation basée sur le type d'incident
// // // //     if (formData.type_incident === 'materiel' && formData.materiel === 0) {
// // // //       newErrors.materiel = 'Matériel requis pour ce type d\'incident';
// // // //     }
    
// // // //     if (formData.type_incident === 'logiciel' && formData.logiciel === 0) {
// // // //       newErrors.logiciel = 'Logiciel requis pour ce type d\'incident';
// // // //     }
    
// // // //     if (formData.type_incident === 'reseau' && formData.reseau === 0) {
// // // //       newErrors.reseau = 'Réseau requis pour ce type d\'incident';
// // // //     }
    
// // // //     if (formData.type_incident === 'mixte' && formData.materiel === 0 && formData.logiciel === 0 && formData.reseau === 0) {
// // // //       newErrors.type_incident = 'Au moins une source (matériel, logiciel ou réseau) est requise';
// // // //     }
    
// // // //     setErrors(newErrors);
// // // //     return Object.keys(newErrors).length === 0;
// // // //   };

// // // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// // // //     const { name, value } = e.target;
    
// // // //     setFormData(prev => ({
// // // //       ...prev,
// // // //       [name]: name === 'materiel' || name === 'logiciel' || name === 'reseau'
// // // //         ? parseInt(value) || 0 
// // // //         : value
// // // //     }));
    
// // // //     // Réinitialiser les champs de source selon le type
// // // //     if (name === 'type_incident') {
// // // //       const type = value as 'materiel' | 'logiciel' | 'reseau' | 'mixte';
// // // //       setFormData(prev => ({
// // // //         ...prev,
// // // //         materiel: type === 'logiciel' ? 0 : prev.materiel,
// // // //         logiciel: type === 'materiel' ? 0 : prev.logiciel,
// // // //         reseau: type === 'materiel' ? 0 : prev.reseau
// // // //       }));
// // // //     }
    
// // // //     if (errors[name]) {
// // // //       setErrors(prev => ({ ...prev, [name]: '' }));
// // // //     }
// // // //   };

// // // //   const handleSetToday = () => {
// // // //     const today = new Date().toISOString().split('T')[0];
// // // //     setFormData(prev => ({ ...prev, date_resolution: today }));
// // // //   };

// // // //   const handleSetNow = () => {
// // // //     const now = new Date();
// // // //     const currentTime = now.toTimeString().slice(0, 5);
// // // //     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
// // // //   };

// // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // //     e.preventDefault();
// // // //     if (!validateForm()) return;
    
// // // //     setIsSubmitting(true);
// // // //     setApiErrors([]);

// // // //     try {
// // // //       // IMPORTANT: L'utilisateur signaleur est TOUJOURS l'utilisateur connecté
// // // //       // Peu importe son rôle (admin, technicien, directeur, secrétaire, user, etc.)
// // // //       const utilisateurSignaleurId = currentUser?.id || 0;
      
// // // //       console.log('👤 Utilisateur signaleur automatique:', {
// // // //         id: utilisateurSignaleurId,
// // // //         nom: getDisplayName(currentUser),
// // // //         username: currentUser?.username,
// // // //         role: currentUser?.role,
// // // //         departement: currentUser?.departement
// // // //       });
      
// // // //       const incidentData: any = { 
// // // //         description: formData.description.trim(),
// // // //         priorite: formData.priorite,
// // // //         statut: formData.statut,
// // // //         type_incident: formData.type_incident,
// // // //         utilisateur_signaleur: utilisateurSignaleurId // ← Automatiquement assigné
// // // //       };

// // // //       // Ajouter la date de résolution si complète
// // // //       if (formData.date_resolution && formData.heure_resolution) {
// // // //         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
// // // //       } else if (formData.date_resolution) {
// // // //         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
// // // //       }

// // // //       // Ajouter les relations selon le type
// // // //       if (formData.materiel > 0) incidentData.materiel = formData.materiel;
// // // //       if (formData.logiciel > 0) incidentData.logiciel = formData.logiciel;
// // // //       if (formData.reseau > 0) incidentData.reseau = formData.reseau;

// // // //       // Ajouter l'alerte source si disponible
// // // //       if (formData.alerte_source > 0) {
// // // //         incidentData.alerte_source = formData.alerte_source;
// // // //       }

// // // //       console.log('📤 Soumission incident:', incidentData);
// // // //       await onSubmit(incidentData);
// // // //       onClose();
      
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur soumission:', error);
// // // //       setApiErrors(prev => [...prev, handleApiError(error)]);
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const handleClose = () => {
// // // //     if (isSubmitting) return;
// // // //     resetForm();
// // // //     onClose();
// // // //   };

// // // //   // Rendre les champs selon le type
// // // //   const getAvailableSources = () => {
// // // //     const type = formData.type_incident;
    
// // // //     switch (type) {
// // // //       case 'materiel':
// // // //         return ['materiel'];
// // // //       case 'logiciel':
// // // //         return ['materiel', 'logiciel'];
// // // //       case 'reseau':
// // // //         return ['materiel', 'reseau'];
// // // //       case 'mixte':
// // // //         return ['materiel', 'logiciel', 'reseau'];
// // // //       default:
// // // //         return [];
// // // //     }
// // // //   };

// // // //   const availableSources = getAvailableSources();

// // // //   if (!isOpen) return null;

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// // // //         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
// // // //           <div>
// // // //             <h2 className="text-xl font-bold text-base-content">
// // // //               {mode === 'fromAlerte' ? '📝 Créer Incident depuis Alerte' : 
// // // //                incident ? 'Modifier l\'incident' : 'Ajouter un Incident'}
// // // //             </h2>
// // // //             {mode === 'fromAlerte' && alerteSource && (
// // // //               <p className="text-sm text-base-content opacity-60 mt-1">
// // // //                 Généré depuis l'alerte #{alerteSource.id}
// // // //               </p>
// // // //             )}
// // // //           </div>
// // // //           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
// // // //             <X className="h-4 w-4" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Indicateur création depuis alerte */}
// // // //         {mode === 'fromAlerte' && alerteSource && (
// // // //           <div className="m-4 p-4 bg-info/10 border border-info/20 rounded-lg">
// // // //             <div className="flex items-center gap-3">
// // // //               <AlertTriangle className="h-5 w-5 text-info" />
// // // //               <div className="flex-1">
// // // //                 <p className="font-medium text-info">Incident créé automatiquement depuis une alerte</p>
// // // //                 <p className="text-sm opacity-80 mt-1">{alerteSource.description}</p>
// // // //                 <div className="flex flex-wrap gap-2 mt-2">
// // // //                   <span className="badge badge-info badge-sm">
// // // //                     Sévérité: {alerteSource.severite}
// // // //                   </span>
// // // //                   <span className="badge badge-info badge-sm">
// // // //                     Type: {alerteSource.type_alerte}
// // // //                   </span>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Messages d'erreur API */}
// // // //         {apiErrors.length > 0 && (
// // // //           <div className="m-4">
// // // //             <div className="alert alert-warning">
// // // //               <AlertCircle className="h-5 w-5" />
// // // //               <div className="flex flex-col gap-1">
// // // //                 {apiErrors.map((error, index) => (
// // // //                   <span key={index} className="text-sm">{error}</span>
// // // //                 ))}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {loading ? (
// // // //           <div className="flex justify-center items-center p-12">
// // // //             <div className="flex flex-col items-center gap-4">
// // // //               <Loader2 className="h-8 w-8 text-primary animate-spin" />
// // // //               <span className="text-base-content">Chargement des données...</span>
// // // //             </div>
// // // //           </div>
// // // //         ) : (
// // // //           <form onSubmit={handleSubmit} className="p-6 space-y-6">
// // // //             {/* Section utilisateur signaleur - AFFICHAGE SEULEMENT */}
// // // //             <div className="bg-base-200 rounded-lg p-4 border border-base-300">
// // // //               <div className="flex items-center justify-between mb-3">
// // // //                 <div className="flex items-center gap-3">
// // // //                   {getRoleIcon(currentUser?.role)}
// // // //                   <div>
// // // //                     <h3 className="font-semibold text-base-content">Utilisateur signaleur</h3>
// // // //                     <p className="text-sm text-base-content opacity-70">
// // // //                       Vous signalez cet incident en votre nom
// // // //                     </p>
// // // //                   </div>
// // // //                 </div>
// // // //                 <div className={`badge ${getRoleBadgeClass(currentUser?.role)} badge-sm text-white flex items-center gap-1`}>
// // // //                   {getRoleIcon(currentUser?.role)}
// // // //                   {getRoleText(currentUser?.role)}
// // // //                 </div>
// // // //               </div>
              
// // // //               <div className="bg-base-100 rounded-lg p-3 border border-base-300">
// // // //                 <div className="flex items-center gap-3">
// // // //                   <div className="avatar placeholder">
// // // //                     <div className="bg-primary text-primary-content rounded-full w-12">
// // // //                       <span className="text-lg font-bold">
// // // //                         {getDisplayName(currentUser).charAt(0).toUpperCase()}
// // // //                       </span>
// // // //                     </div>
// // // //                   </div>
// // // //                   <div className="flex-1">
// // // //                     <div className="font-bold text-lg text-base-content">
// // // //                       {getDisplayName(currentUser)}
// // // //                     </div>
// // // //                     <div className="text-sm text-base-content opacity-80 space-y-1 mt-1">
// // // //                       <div className="flex items-center gap-2">
// // // //                         <span className="font-medium">Identifiant :</span>
// // // //                         <span className="font-mono bg-base-200 px-2 py-0.5 rounded">
// // // //                           {currentUser?.username || `user_${currentUser?.id}`}
// // // //                         </span>
// // // //                       </div>
// // // //                       <div className="flex flex-wrap gap-3">
// // // //                         {currentUser?.email && (
// // // //                           <div className="flex items-center gap-1">
// // // //                             <span className="font-medium">Email :</span>
// // // //                             <span>{currentUser.email}</span>
// // // //                           </div>
// // // //                         )}
// // // //                         {currentUser?.departement && (
// // // //                           <div className="flex items-center gap-1">
// // // //                             <span className="font-medium">Département :</span>
// // // //                             <span>{currentUser.departement}</span>
// // // //                           </div>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
                
// // // //                 <div className="mt-3 pt-3 border-t border-base-300">
// // // //                   <div className="text-sm text-primary flex items-center gap-2">
// // // //                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
// // // //                     <span className="font-medium">
// // // //                       ✅ Signaleur automatique : <strong>{getDisplayName(currentUser)}</strong>
// // // //                     </span>
// // // //                   </div>
// // // //                   <div className="text-xs text-base-content opacity-60 mt-1">
// // // //                     L'incident sera automatiquement associé à votre compte de {getRoleText(currentUser?.role).toLowerCase()}.
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             {/* Description */}
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">Description :</span>
// // // //                 <span className="label-text-alt text-error">*</span>
// // // //               </label>
// // // //               <textarea
// // // //                 name="description"
// // // //                 value={formData.description}
// // // //                 onChange={handleChange}
// // // //                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
// // // //                 placeholder="Décrivez l'incident en détails..."
// // // //                 disabled={isSubmitting}
// // // //               />
// // // //               {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
// // // //             </div>

// // // //             {/* Type d'incident */}
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">Type incident :</span>
// // // //                 <span className="label-text-alt text-error">*</span>
// // // //               </label>
// // // //               <select
// // // //                 name="type_incident"
// // // //                 value={formData.type_incident}
// // // //                 onChange={handleChange}
// // // //                 className={`select select-bordered w-full ${errors.type_incident ? 'select-error' : ''}`}
// // // //                 disabled={isSubmitting}
// // // //               >
// // // //                 <option value="">---------</option>
// // // //                 <option value="materiel">Matériel</option>
// // // //                 <option value="logiciel">Logiciel</option>
// // // //                 <option value="reseau">Réseau</option>
// // // //                 <option value="mixte">Mixte</option>
// // // //               </select>
// // // //               {errors.type_incident && <span className="text-error text-sm mt-1">{errors.type_incident}</span>}
// // // //               <div className="text-xs text-base-content opacity-60 mt-1">
// // // //                 Champs disponibles selon le type :
// // // //                 {formData.type_incident === 'materiel' && ' Matériel uniquement'}
// // // //                 {formData.type_incident === 'logiciel' && ' Matériel + Logiciel'}
// // // //                 {formData.type_incident === 'reseau' && ' Matériel + Réseau'}
// // // //                 {formData.type_incident === 'mixte' && ' Tous les champs'}
// // // //               </div>
// // // //             </div>

// // // //             {/* Priorité et Statut */}
// // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //               <div className="form-control">
// // // //                 <label className="label">
// // // //                   <span className="label-text font-semibold">Priorité :</span>
// // // //                 </label>
// // // //                 <select
// // // //                   name="priorite"
// // // //                   value={formData.priorite}
// // // //                   onChange={handleChange}
// // // //                   className="select select-bordered w-full"
// // // //                   disabled={isSubmitting}
// // // //                 >
// // // //                   <option value="basse">Basse</option>
// // // //                   <option value="moyenne">Moyenne</option>
// // // //                   <option value="elevee">Élevée</option>
// // // //                   <option value="critique">Critique</option>
// // // //                 </select>
// // // //               </div>

// // // //               <div className="form-control">
// // // //                 <label className="label">
// // // //                   <span className="label-text font-semibold">Statut :</span>
// // // //                 </label>
// // // //                 <select
// // // //                   name="statut"
// // // //                   value={formData.statut}
// // // //                   onChange={handleChange}
// // // //                   className="select select-bordered w-full"
// // // //                   disabled={isSubmitting}
// // // //                 >
// // // //                   <option value="ouvert">Ouvert</option>
// // // //                   <option value="en_cours">En cours</option>
// // // //                   <option value="resolu">Résolu</option>
// // // //                   <option value="ferme">Fermé</option>
// // // //                 </select>
// // // //               </div>
// // // //             </div>

// // // //             {/* Sources selon le type - SECTIONS CONDITIONNELLES */}
// // // //             {formData.type_incident && (
// // // //               <div className="space-y-4 pt-4 border-t border-base-300">
// // // //                 <h3 className="font-semibold text-base-content">Sources concernées :</h3>
                
// // // //                 {/* Matériel concerné */}
// // // //                 {availableSources.includes('materiel') && (
// // // //                   <div className="form-control">
// // // //                     <label className="label">
// // // //                       <span className="label-text font-semibold">
// // // //                         Matériel {formData.type_incident === 'materiel' && <span className="text-error">*</span>}
// // // //                       </span>
// // // //                     </label>
// // // //                     <select
// // // //                       name="materiel"
// // // //                       value={formData.materiel}
// // // //                       onChange={handleChange}
// // // //                       className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
// // // //                       disabled={isSubmitting || materiels.length === 0}
// // // //                     >
// // // //                       <option value={0}>Sélectionnez un matériel</option>
// // // //                       {materiels.map(item => (
// // // //                         <option key={item.id} value={item.id}>
// // // //                           {item.nom} ({item.reference})
// // // //                         </option>
// // // //                       ))}
// // // //                     </select>
// // // //                     {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
// // // //                   </div>
// // // //                 )}

// // // //                 {/* Logiciel concerné */}
// // // //                 {availableSources.includes('logiciel') && (
// // // //                   <div className="form-control">
// // // //                     <label className="label">
// // // //                       <span className="label-text font-semibold">
// // // //                         Logiciel {formData.type_incident === 'logiciel' && <span className="text-error">*</span>}
// // // //                       </span>
// // // //                     </label>
// // // //                     <select
// // // //                       name="logiciel"
// // // //                       value={formData.logiciel}
// // // //                       onChange={handleChange}
// // // //                       className={`select select-bordered w-full ${errors.logiciel ? 'select-error' : ''}`}
// // // //                       disabled={isSubmitting || logiciels.length === 0}
// // // //                     >
// // // //                       <option value={0}>Sélectionnez un logiciel</option>
// // // //                       {logiciels.map(item => (
// // // //                         <option key={item.id} value={item.id}>
// // // //                           {item.nom} {item.version}
// // // //                         </option>
// // // //                       ))}
// // // //                     </select>
// // // //                     {errors.logiciel && <span className="text-error text-sm mt-1">{errors.logiciel}</span>}
// // // //                   </div>
// // // //                 )}

// // // //                 {/* Réseau concerné */}
// // // //                 {availableSources.includes('reseau') && (
// // // //                   <div className="form-control">
// // // //                     <label className="label">
// // // //                       <span className="label-text font-semibold">
// // // //                         Réseau {formData.type_incident === 'reseau' && <span className="text-error">*</span>}
// // // //                       </span>
// // // //                     </label>
// // // //                     <select
// // // //                       name="reseau"
// // // //                       value={formData.reseau}
// // // //                       onChange={handleChange}
// // // //                       className={`select select-bordered w-full ${errors.reseau ? 'select-error' : ''}`}
// // // //                       disabled={isSubmitting || reseaux.length === 0}
// // // //                     >
// // // //                       <option value={0}>Sélectionnez un équipement réseau</option>
// // // //                       {reseaux.map(item => (
// // // //                         <option key={item.id} value={item.id}>
// // // //                           {item.nom_hote} ({item.adresse_ip})
// // // //                         </option>
// // // //                       ))}
// // // //                     </select>
// // // //                     {errors.reseau && <span className="text-error text-sm mt-1">{errors.reseau}</span>}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             )}

// // // //             {/* Date et Heure */}
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">Date création :</span>
// // // //               </label>
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                 {/* Date */}
// // // //                 <div className="form-control">
// // // //                   <label className="label">
// // // //                     <span className="label-text">Date :</span>
// // // //                   </label>
// // // //                   <div className="flex items-center gap-2">
// // // //                     <div className="relative flex-1">
// // // //                       <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // //                       <input
// // // //                         type="date"
// // // //                         name="date_resolution"
// // // //                         value={formData.date_resolution}
// // // //                         onChange={handleChange}
// // // //                         className="input input-bordered w-full pl-10"
// // // //                         disabled={isSubmitting}
// // // //                       />
// // // //                     </div>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={handleSetToday}
// // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // //                       disabled={isSubmitting}
// // // //                     >
// // // //                       Aujourd'hui
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* Heure */}
// // // //                 <div className="form-control">
// // // //                   <label className="label">
// // // //                     <span className="label-text">Heure :</span>
// // // //                   </label>
// // // //                   <div className="flex items-center gap-2">
// // // //                     <div className="relative flex-1">
// // // //                       <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // //                       <input
// // // //                         type="time"
// // // //                         name="heure_resolution"
// // // //                         value={formData.heure_resolution}
// // // //                         onChange={handleChange}
// // // //                         className="input input-bordered w-full pl-10"
// // // //                         disabled={isSubmitting}
// // // //                       />
// // // //                     </div>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={handleSetNow}
// // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // //                       disabled={isSubmitting}
// // // //                     >
// // // //                       Maintenant
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             {/* Boutons */}
// // // //             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
// // // //               <button 
// // // //                 type="button" 
// // // //                 onClick={handleClose} 
// // // //                 className="btn btn-ghost"
// // // //                 disabled={isSubmitting}
// // // //               >
// // // //                 Annuler
// // // //               </button>
// // // //               <button 
// // // //                 type="submit" 
// // // //                 className="btn btn-primary"
// // // //                 disabled={isSubmitting}
// // // //               >
// // // //                 {isSubmitting ? (
// // // //                   <span className="flex items-center gap-2">
// // // //                     <Loader2 className="h-4 w-4 animate-spin" />
// // // //                     {incident ? 'Modification...' : 'Création...'}
// // // //                   </span>
// // // //                 ) : (
// // // //                   incident ? 'Modifier' : 'Créer'
// // // //                 )} l'incident
// // // //               </button>
// // // //             </div>
// // // //           </form>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default IncidentForm;




// // // // // IncidentForm.tsx - Version avec signaleur automatique et matériels en panne
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import { X, Calendar, Clock, User, AlertCircle, Loader2, AlertTriangle, Shield, Wrench, Briefcase, FileText, Info } from 'lucide-react';
// // // // import { Incident, User as UserType, Materiel, Logiciel, Reseau, Alerte } from '../types';
// // // // // import { materielsPanneAPI, logicielsAPI, reseauAPI, handleApiError, materielsAPI } from '../services/api';
// // // // import { materielsPanneAPI, , handleApiError, materielsAPI } from '../services/api';

// // // // interface IncidentFormProps {
// // // //   isOpen: boolean;
// // // //   onClose: () => void;
// // // //   onSubmit: (incidentData: any) => void;
// // // //   incident?: Incident;
// // // //   currentUser: UserType; // L'utilisateur actuellement connecté
// // // //   alerteSource?: Alerte;
// // // // }

// // // // const IncidentForm: React.FC<IncidentFormProps> = ({
// // // //   isOpen,
// // // //   onClose,
// // // //   onSubmit,
// // // //   incident,
// // // //   currentUser,
// // // //   alerteSource
// // // // }) => {
// // // //   // États du formulaire
// // // //   const [formData, setFormData] = useState({
// // // //     description: '',
// // // //     date_resolution: '',
// // // //     heure_resolution: '',
// // // //     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
// // // //     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
// // // //     type_incident: '' as '' | 'materiel' | 'logiciel' | 'reseau' | 'mixte',
// // // //     materiel: 0,
// // // //     logiciel: 0,
// // // //     reseau: 0,
// // // //     alerte_source: 0
// // // //   });

// // // //   // États pour les données externes
// // // //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// // // //   const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
// // // //   const [reseaux, setReseaux] = useState<Reseau[]>([]);
// // // //   const [errors, setErrors] = useState<Record<string, string>>({});
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [apiErrors, setApiErrors] = useState<string[]>([]);
// // // //   const [mode, setMode] = useState<'normal' | 'fromAlerte'>('normal');
// // // //   const [showNoPanneMessage, setShowNoPanneMessage] = useState(false);
  
// // // //   // Références pour éviter les boucles
// // // //   const dataLoadedRef = useRef(false);
// // // //   const isOpenRef = useRef(false);

// // // //   // Fonction pour obtenir le nom affichable de l'utilisateur
// // // //   const getDisplayName = (user: UserType | null) => {
// // // //     if (!user) return 'Utilisateur inconnu';
    
// // // //     if (user.nom_complet) return user.nom_complet;
// // // //     if (user.first_name && user.last_name) {
// // // //       return `${user.first_name} ${user.last_name}`;
// // // //     }
// // // //     if (user.username) return user.username;
// // // //     return `Utilisateur #${user.id}`;
// // // //   };

// // // //   // Fonction pour obtenir l'icône selon le rôle
// // // //   const getRoleIcon = (role: string | undefined) => {
// // // //     if (!role) return <User className="h-4 w-4" />;
    
// // // //     switch (role.toLowerCase()) {
// // // //       case 'admin':
// // // //       case 'administrateur':
// // // //         return <Shield className="h-4 w-4" />;
// // // //       case 'technician':
// // // //       case 'technicien':
// // // //         return <Wrench className="h-4 w-4" />;
// // // //       case 'director':
// // // //       case 'directeur':
// // // //         return <Briefcase className="h-4 w-4" />;
// // // //       case 'secretary':
// // // //       case 'secretaire':
// // // //         return <FileText className="h-4 w-4" />;
// // // //       default:
// // // //         return <User className="h-4 w-4" />;
// // // //     }
// // // //   };

// // // //   // Fonction pour obtenir la couleur selon le rôle
// // // //   const getRoleBadgeClass = (role: string | undefined) => {
// // // //     if (!role) return 'badge-neutral';
    
// // // //     switch (role.toLowerCase()) {
// // // //       case 'admin':
// // // //       case 'administrateur':
// // // //         return 'badge-error';
// // // //       case 'technician':
// // // //       case 'technicien':
// // // //         return 'badge-warning';
// // // //       case 'director':
// // // //       case 'directeur':
// // // //         return 'badge-success';
// // // //       case 'secretary':
// // // //       case 'secretaire':
// // // //         return 'badge-info';
// // // //       default:
// // // //         return 'badge-neutral';
// // // //     }
// // // //   };

// // // //   // Fonction pour obtenir le texte du rôle
// // // //   const getRoleText = (role: string | undefined) => {
// // // //     if (!role) return 'Utilisateur';
    
// // // //     switch (role.toLowerCase()) {
// // // //       case 'admin':
// // // //       case 'administrateur':
// // // //         return 'Administrateur';
// // // //       case 'technician':
// // // //       case 'technicien':
// // // //         return 'Technicien';
// // // //       case 'director':
// // // //       case 'directeur':
// // // //         return 'Directeur';
// // // //       case 'secretary':
// // // //       case 'secretaire':
// // // //         return 'Secrétaire';
// // // //       case 'user':
// // // //         return 'Utilisateur';
// // // //       default:
// // // //         return role.charAt(0).toUpperCase() + role.slice(1);
// // // //     }
// // // //   };

// // // //   // Fonction pour extraire les données de réponse API
// // // //   const extractDataFromResponse = (response: any): any[] => {
// // // //     if (!response || !response.data) return [];
    
// // // //     if (Array.isArray(response.data)) {
// // // //       return response.data;
// // // //     }
    
// // // //     if (response.data.results && Array.isArray(response.data.results)) {
// // // //       return response.data.results;
// // // //     }
    
// // // //     if (response.data.data && Array.isArray(response.data.data)) {
// // // //       return response.data.data;
// // // //     }
    
// // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // // //       const values = Object.values(response.data);
// // // //       if (values.length > 0 && values.every(v => typeof v === 'object')) {
// // // //         return values as any[];
// // // //       }
// // // //     }
    
// // // //     if (response.results && Array.isArray(response.results)) {
// // // //       return response.results;
// // // //     }
    
// // // //     return [];
// // // //   };

// // // //   // Fonction pour mapper la sévérité d'alerte vers priorité d'incident
// // // //   const mapSeveriteToPriorite = (severite: string): 'critique' | 'elevee' | 'moyenne' | 'basse' => {
// // // //     const mapping = {
// // // //       'critique': 'critique',
// // // //       'elevee': 'elevee',
// // // //       'moyenne': 'moyenne',
// // // //       'basse': 'basse'
// // // //     };
// // // //     return mapping[severite as keyof typeof mapping] || 'moyenne';
// // // //   };

// // // //   // Initialiser depuis une alerte
// // // //   const initFromAlerte = () => {
// // // //     if (!alerteSource) return;
    
// // // //     console.log('🚨 Initialisation depuis alerte:', alerteSource);
    
// // // //     let typeIncident: 'materiel' | 'logiciel' | 'reseau' | 'mixte' = 'mixte';
    
// // // //     if (alerteSource.materiel_id && !alerteSource.logiciel_id && !alerteSource.reseau_id) {
// // // //       typeIncident = 'materiel';
// // // //     } else if (alerteSource.logiciel_id && !alerteSource.materiel_id && !alerteSource.reseau_id) {
// // // //       typeIncident = 'logiciel';
// // // //     } else if (alerteSource.reseau_id && !alerteSource.materiel_id && !alerteSource.logiciel_id) {
// // // //       typeIncident = 'reseau';
// // // //     } else {
// // // //       typeIncident = 'mixte';
// // // //     }
    
// // // //     const initialData = {
// // // //       description: `Incident généré depuis l'alerte: ${alerteSource.description}`,
// // // //       date_resolution: new Date().toISOString().split('T')[0],
// // // //       heure_resolution: new Date().toTimeString().slice(0, 5),
// // // //       priorite: mapSeveriteToPriorite(alerteSource.severite),
// // // //       statut: 'ouvert' as const,
// // // //       type_incident: typeIncident,
// // // //       materiel: alerteSource.materiel_id || 0,
// // // //       logiciel: alerteSource.logiciel_id || 0,
// // // //       reseau: alerteSource.reseau_id || 0,
// // // //       alerte_source: alerteSource.id || 0
// // // //     };
    
// // // //     setFormData(initialData);
// // // //     setMode('fromAlerte');
// // // //   };

// // // //   // CHARGER LES MATÉRIELS EN PANNE - FONCTION CORRIGÉE
// // // //   const fetchMateriels = async () => {
// // // //     try {
// // // //       console.log('🔄 Chargement des matériels en panne...');
      
// // // //       // Utilisez l'API spécifique pour les matériels en panne
// // // //       const materielsEnPanne = await materielsPanneAPI.getMaterielsEnPanne();
      
// // // //       console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne chargé(s)`);
      
// // // //       if (materielsEnPanne.length === 0) {
// // // //         setShowNoPanneMessage(true);
// // // //         setMateriels([]);
// // // //       } else {
// // // //         setShowNoPanneMessage(false);
// // // //         setMateriels(materielsEnPanne);
// // // //       }
      
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur chargement matériels en panne:', error);
      
// // // //       // Fallback: essayer avec l'API normale et filtrer
// // // //       try {
// // // //         console.log('🔄 Tentative fallback avec API normale...');
// // // //         const response = await materielsAPI.getAll();
// // // //         const allMateriels = extractDataFromResponse(response);
        
// // // //         // Filtrer côté client
// // // //         const materielsEnPanne = allMateriels.filter((m: any) => {
// // // //           const etat = m.etat || m.status || m.state || '';
// // // //           return etat.toLowerCase().includes('panne') || etat.toLowerCase().includes('en_panne');
// // // //         });
        
// // // //         console.log(`⚠️ ${materielsEnPanne.length} matériel(s) en panne filtré(s) côté client`);
        
// // // //         if (materielsEnPanne.length === 0) {
// // // //           setShowNoPanneMessage(true);
// // // //           setMateriels([]);
// // // //         } else {
// // // //           setShowNoPanneMessage(false);
// // // //           setMateriels(materielsEnPanne);
// // // //         }
        
// // // //       } catch (fallbackError: any) {
// // // //         console.error('❌ Échec du fallback:', fallbackError);
// // // //         setShowNoPanneMessage(true);
// // // //         setMateriels([]);
// // // //         setApiErrors(prev => [...prev, 
// // // //           'Impossible de charger les matériels en panne. ' +
// // // //           'Vérifiez votre connexion ou contactez un administrateur.'
// // // //         ]);
// // // //       }
// // // //     }
// // // //   };

// // // //   // Charger les logiciels
// // // //   const fetchLogiciels = async () => {
// // // //     try {
// // // //       console.log('🔄 Chargement des logiciels...');
// // // //       const response = await logicielsAPI.getAll();
// // // //       const logicielsData = extractDataFromResponse(response);
// // // //       setLogiciels(logicielsData);
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur chargement logiciels:', error);
// // // //     }
// // // //   };

// // // //   // Charger les réseaux
// // // //   const fetchReseaux = async () => {
// // // //     try {
// // // //       console.log('🔄 Chargement des réseaux...');
// // // //       const response = await reseauAPI.getAll();
// // // //       const reseauxData = extractDataFromResponse(response);
// // // //       setReseaux(reseauxData);
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur chargement réseaux:', error);
// // // //     }
// // // //   };

// // // //   // Charger toutes les données
// // // //   const fetchAllData = async () => {
// // // //     if (dataLoadedRef.current || !isOpen) return;
    
// // // //     setLoading(true);
// // // //     setApiErrors([]);
// // // //     dataLoadedRef.current = true;
    
// // // //     try {
// // // //       console.log('🔄 Début du chargement de toutes les données...');
      
// // // //       // Charger en parallèle
// // // //       await Promise.allSettled([
// // // //         fetchMateriels(),
// // // //         fetchLogiciels(),
// // // //         fetchReseaux()
// // // //       ]);
      
// // // //       // Initialiser le formulaire
// // // //       if (alerteSource) {
// // // //         initFromAlerte();
// // // //       } else if (incident) {
// // // //         console.log('📝 Initialisation avec incident:', incident);
        
// // // //         setFormData({
// // // //           description: incident.description || '',
// // // //           date_resolution: incident.date_resolution?.split('T')[0] || '',
// // // //           heure_resolution: incident.date_resolution?.split('T')[1]?.substring(0, 5) || '',
// // // //           priorite: incident.priorite || 'moyenne',
// // // //           statut: incident.statut || 'ouvert',
// // // //           type_incident: incident.type_incident || '',
// // // //           materiel: incident.materiel || 0,
// // // //           logiciel: incident.logiciel || 0,
// // // //           reseau: incident.reseau || 0,
// // // //           alerte_source: 0
// // // //         });
// // // //       }
      
// // // //     } catch (error) {
// // // //       console.error('💥 Erreur critique lors du chargement:', error);
// // // //       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // Effet pour charger les données
// // // //   useEffect(() => {
// // // //     if (isOpen && !isOpenRef.current) {
// // // //       isOpenRef.current = true;
// // // //       dataLoadedRef.current = false;
// // // //       fetchAllData();
// // // //     }
    
// // // //     return () => {
// // // //       if (!isOpen) {
// // // //         isOpenRef.current = false;
// // // //         dataLoadedRef.current = false;
// // // //       }
// // // //     };
// // // //   }, [isOpen, incident, alerteSource]);

// // // //   const resetForm = () => {
// // // //     setFormData({
// // // //       description: '',
// // // //       date_resolution: '',
// // // //       heure_resolution: '',
// // // //       priorite: 'moyenne',
// // // //       statut: 'ouvert',
// // // //       type_incident: '',
// // // //       materiel: 0,
// // // //       logiciel: 0,
// // // //       reseau: 0,
// // // //       alerte_source: 0
// // // //     });
// // // //     setErrors({});
// // // //     setApiErrors([]);
// // // //     setMode('normal');
// // // //     setShowNoPanneMessage(false);
// // // //   };

// // // //   const validateForm = () => {
// // // //     const newErrors: Record<string, string> = {};
    
// // // //     if (!formData.description.trim()) {
// // // //       newErrors.description = 'Description requise';
// // // //     }
    
// // // //     if (!formData.type_incident) {
// // // //       newErrors.type_incident = 'Type d\'incident requis';
// // // //     }
    
// // // //     // Validation basée sur le type d'incident
// // // //     if (formData.type_incident === 'materiel' && formData.materiel === 0) {
// // // //       newErrors.materiel = 'Matériel requis pour ce type d\'incident';
// // // //     }
    
// // // //     if (formData.type_incident === 'logiciel' && formData.logiciel === 0) {
// // // //       newErrors.logiciel = 'Logiciel requis pour ce type d\'incident';
// // // //     }
    
// // // //     if (formData.type_incident === 'reseau' && formData.reseau === 0) {
// // // //       newErrors.reseau = 'Réseau requis pour ce type d\'incident';
// // // //     }
    
// // // //     if (formData.type_incident === 'mixte' && formData.materiel === 0 && formData.logiciel === 0 && formData.reseau === 0) {
// // // //       newErrors.type_incident = 'Au moins une source (matériel, logiciel ou réseau) est requise';
// // // //     }
    
// // // //     setErrors(newErrors);
// // // //     return Object.keys(newErrors).length === 0;
// // // //   };

// // // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// // // //     const { name, value } = e.target;
    
// // // //     setFormData(prev => ({
// // // //       ...prev,
// // // //       [name]: name === 'materiel' || name === 'logiciel' || name === 'reseau'
// // // //         ? parseInt(value) || 0 
// // // //         : value
// // // //     }));
    
// // // //     // Réinitialiser les champs de source selon le type
// // // //     if (name === 'type_incident') {
// // // //       const type = value as 'materiel' | 'logiciel' | 'reseau' | 'mixte';
// // // //       setFormData(prev => ({
// // // //         ...prev,
// // // //         materiel: type === 'logiciel' ? 0 : prev.materiel,
// // // //         logiciel: type === 'materiel' ? 0 : prev.logiciel,
// // // //         reseau: type === 'materiel' ? 0 : prev.reseau
// // // //       }));
// // // //     }
    
// // // //     if (errors[name]) {
// // // //       setErrors(prev => ({ ...prev, [name]: '' }));
// // // //     }
// // // //   };

// // // //   const handleSetToday = () => {
// // // //     const today = new Date().toISOString().split('T')[0];
// // // //     setFormData(prev => ({ ...prev, date_resolution: today }));
// // // //   };

// // // //   const handleSetNow = () => {
// // // //     const now = new Date();
// // // //     const currentTime = now.toTimeString().slice(0, 5);
// // // //     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
// // // //   };

// // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // //     e.preventDefault();
// // // //     if (!validateForm()) return;
    
// // // //     setIsSubmitting(true);
// // // //     setApiErrors([]);

// // // //     try {
// // // //       const utilisateurSignaleurId = currentUser?.id || 0;
      
// // // //       console.log('👤 Utilisateur signaleur automatique:', {
// // // //         id: utilisateurSignaleurId,
// // // //         nom: getDisplayName(currentUser),
// // // //         username: currentUser?.username,
// // // //         role: currentUser?.role,
// // // //         departement: currentUser?.departement
// // // //       });
      
// // // //       const incidentData: any = { 
// // // //         description: formData.description.trim(),
// // // //         priorite: formData.priorite,
// // // //         statut: formData.statut,
// // // //         type_incident: formData.type_incident,
// // // //         utilisateur_signaleur: utilisateurSignaleurId
// // // //       };

// // // //       // Ajouter la date de résolution si complète
// // // //       if (formData.date_resolution && formData.heure_resolution) {
// // // //         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
// // // //       } else if (formData.date_resolution) {
// // // //         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
// // // //       }

// // // //       // Ajouter les relations selon le type
// // // //       if (formData.materiel > 0) incidentData.materiel = formData.materiel;
// // // //       if (formData.logiciel > 0) incidentData.logiciel = formData.logiciel;
// // // //       if (formData.reseau > 0) incidentData.reseau = formData.reseau;

// // // //       // Ajouter l'alerte source si disponible
// // // //       if (formData.alerte_source > 0) {
// // // //         incidentData.alerte_source = formData.alerte_source;
// // // //       }

// // // //       console.log('📤 Soumission incident:', incidentData);
// // // //       await onSubmit(incidentData);
// // // //       onClose();
      
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur soumission:', error);
// // // //       setApiErrors(prev => [...prev, handleApiError(error)]);
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const handleClose = () => {
// // // //     if (isSubmitting) return;
// // // //     resetForm();
// // // //     onClose();
// // // //   };

// // // //   // Rendre les champs selon le type
// // // //   const getAvailableSources = () => {
// // // //     const type = formData.type_incident;
    
// // // //     switch (type) {
// // // //       case 'materiel':
// // // //         return ['materiel'];
// // // //       case 'logiciel':
// // // //         return ['materiel', 'logiciel'];
// // // //       case 'reseau':
// // // //         return ['materiel', 'reseau'];
// // // //       case 'mixte':
// // // //         return ['materiel', 'logiciel', 'reseau'];
// // // //       default:
// // // //         return [];
// // // //     }
// // // //   };

// // // //   const availableSources = getAvailableSources();

// // // //   if (!isOpen) return null;

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// // // //         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
// // // //           <div>
// // // //             <h2 className="text-xl font-bold text-base-content">
// // // //               {mode === 'fromAlerte' ? '📝 Créer Incident depuis Alerte' : 
// // // //                incident ? 'Modifier l\'incident' : 'Ajouter un Incident'}
// // // //             </h2>
// // // //             {mode === 'fromAlerte' && alerteSource && (
// // // //               <p className="text-sm text-base-content opacity-60 mt-1">
// // // //                 Généré depuis l'alerte #{alerteSource.id}
// // // //               </p>
// // // //             )}
// // // //           </div>
// // // //           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
// // // //             <X className="h-4 w-4" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Indicateur création depuis alerte */}
// // // //         {mode === 'fromAlerte' && alerteSource && (
// // // //           <div className="m-4 p-4 bg-info/10 border border-info/20 rounded-lg">
// // // //             <div className="flex items-center gap-3">
// // // //               <AlertTriangle className="h-5 w-5 text-info" />
// // // //               <div className="flex-1">
// // // //                 <p className="font-medium text-info">Incident créé automatiquement depuis une alerte</p>
// // // //                 <p className="text-sm opacity-80 mt-1">{alerteSource.description}</p>
// // // //                 <div className="flex flex-wrap gap-2 mt-2">
// // // //                   <span className="badge badge-info badge-sm">
// // // //                     Sévérité: {alerteSource.severite}
// // // //                   </span>
// // // //                   <span className="badge badge-info badge-sm">
// // // //                     Type: {alerteSource.type_alerte}
// // // //                   </span>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Messages d'erreur API */}
// // // //         {apiErrors.length > 0 && (
// // // //           <div className="m-4">
// // // //             <div className="alert alert-warning">
// // // //               <AlertCircle className="h-5 w-5" />
// // // //               <div className="flex flex-col gap-1">
// // // //                 {apiErrors.map((error, index) => (
// // // //                   <span key={index} className="text-sm">{error}</span>
// // // //                 ))}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {loading ? (
// // // //           <div className="flex justify-center items-center p-12">
// // // //             <div className="flex flex-col items-center gap-4">
// // // //               <Loader2 className="h-8 w-8 text-primary animate-spin" />
// // // //               <span className="text-base-content">Chargement des données...</span>
// // // //             </div>
// // // //           </div>
// // // //         ) : (
// // // //           <form onSubmit={handleSubmit} className="p-6 space-y-6">
// // // //             {/* Section utilisateur signaleur */}
// // // //             <div className="bg-base-200 rounded-lg p-4 border border-base-300">
// // // //               <div className="flex items-center justify-between mb-3">
// // // //                 <div className="flex items-center gap-3">
// // // //                   {getRoleIcon(currentUser?.role)}
// // // //                   <div>
// // // //                     <h3 className="font-semibold text-base-content">Utilisateur signaleur</h3>
// // // //                     <p className="text-sm text-base-content opacity-70">
// // // //                       Vous signalez cet incident en votre nom
// // // //                     </p>
// // // //                   </div>
// // // //                 </div>
// // // //                 <div className={`badge ${getRoleBadgeClass(currentUser?.role)} badge-sm text-white flex items-center gap-1`}>
// // // //                   {getRoleIcon(currentUser?.role)}
// // // //                   {getRoleText(currentUser?.role)}
// // // //                 </div>
// // // //               </div>
              
// // // //               <div className="bg-base-100 rounded-lg p-3 border border-base-300">
// // // //                 <div className="flex items-center gap-3">
// // // //                   <div className="avatar placeholder">
// // // //                     <div className="bg-primary text-primary-content rounded-full w-12">
// // // //                       <span className="text-lg font-bold">
// // // //                         {getDisplayName(currentUser).charAt(0).toUpperCase()}
// // // //                       </span>
// // // //                     </div>
// // // //                   </div>
// // // //                   <div className="flex-1">
// // // //                     <div className="font-bold text-lg text-base-content">
// // // //                       {getDisplayName(currentUser)}
// // // //                     </div>
// // // //                     <div className="text-sm text-base-content opacity-80 space-y-1 mt-1">
// // // //                       <div className="flex items-center gap-2">
// // // //                         <span className="font-medium">Identifiant :</span>
// // // //                         <span className="font-mono bg-base-200 px-2 py-0.5 rounded">
// // // //                           {currentUser?.username || `user_${currentUser?.id}`}
// // // //                         </span>
// // // //                       </div>
// // // //                       <div className="flex flex-wrap gap-3">
// // // //                         {currentUser?.email && (
// // // //                           <div className="flex items-center gap-1">
// // // //                             <span className="font-medium">Email :</span>
// // // //                             <span>{currentUser.email}</span>
// // // //                           </div>
// // // //                         )}
// // // //                         {currentUser?.departement && (
// // // //                           <div className="flex items-center gap-1">
// // // //                             <span className="font-medium">Département :</span>
// // // //                             <span>{currentUser.departement}</span>
// // // //                           </div>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
                
// // // //                 <div className="mt-3 pt-3 border-t border-base-300">
// // // //                   <div className="text-sm text-primary flex items-center gap-2">
// // // //                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
// // // //                     <span className="font-medium">
// // // //                       ✅ Signaleur automatique : <strong>{getDisplayName(currentUser)}</strong>
// // // //                     </span>
// // // //                   </div>
// // // //                   <div className="text-xs text-base-content opacity-60 mt-1">
// // // //                     L'incident sera automatiquement associé à votre compte de {getRoleText(currentUser?.role).toLowerCase()}.
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             {/* Description */}
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">Description :</span>
// // // //                 <span className="label-text-alt text-error">*</span>
// // // //               </label>
// // // //               <textarea
// // // //                 name="description"
// // // //                 value={formData.description}
// // // //                 onChange={handleChange}
// // // //                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
// // // //                 placeholder="Décrivez l'incident en détails..."
// // // //                 disabled={isSubmitting}
// // // //               />
// // // //               {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
// // // //             </div>

// // // //             {/* Type d'incident */}
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">Type incident :</span>
// // // //                 <span className="label-text-alt text-error">*</span>
// // // //               </label>
// // // //               <select
// // // //                 name="type_incident"
// // // //                 value={formData.type_incident}
// // // //                 onChange={handleChange}
// // // //                 className={`select select-bordered w-full ${errors.type_incident ? 'select-error' : ''}`}
// // // //                 disabled={isSubmitting}
// // // //               >
// // // //                 <option value="">---------</option>
// // // //                 <option value="materiel">Matériel</option>
// // // //                 <option value="logiciel">Logiciel</option>
// // // //                 <option value="reseau">Réseau</option>
// // // //                 <option value="mixte">Mixte</option>
// // // //               </select>
// // // //               {errors.type_incident && <span className="text-error text-sm mt-1">{errors.type_incident}</span>}
// // // //               <div className="text-xs text-base-content opacity-60 mt-1">
// // // //                 Champs disponibles selon le type :
// // // //                 {formData.type_incident === 'materiel' && ' Matériel uniquement'}
// // // //                 {formData.type_incident === 'logiciel' && ' Matériel + Logiciel'}
// // // //                 {formData.type_incident === 'reseau' && ' Matériel + Réseau'}
// // // //                 {formData.type_incident === 'mixte' && ' Tous les champs'}
// // // //               </div>
// // // //             </div>

// // // //             {/* Priorité et Statut */}
// // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //               <div className="form-control">
// // // //                 <label className="label">
// // // //                   <span className="label-text font-semibold">Priorité :</span>
// // // //                 </label>
// // // //                 <select
// // // //                   name="priorite"
// // // //                   value={formData.priorite}
// // // //                   onChange={handleChange}
// // // //                   className="select select-bordered w-full"
// // // //                   disabled={isSubmitting}
// // // //                 >
// // // //                   <option value="basse">Basse</option>
// // // //                   <option value="moyenne">Moyenne</option>
// // // //                   <option value="elevee">Élevée</option>
// // // //                   <option value="critique">Critique</option>
// // // //                 </select>
// // // //               </div>

// // // //               <div className="form-control">
// // // //                 <label className="label">
// // // //                   <span className="label-text font-semibold">Statut :</span>
// // // //                 </label>
// // // //                 <select
// // // //                   name="statut"
// // // //                   value={formData.statut}
// // // //                   onChange={handleChange}
// // // //                   className="select select-bordered w-full"
// // // //                   disabled={isSubmitting}
// // // //                 >
// // // //                   <option value="ouvert">Ouvert</option>
// // // //                   <option value="en_cours">En cours</option>
// // // //                   <option value="resolu">Résolu</option>
// // // //                   <option value="ferme">Fermé</option>
// // // //                 </select>
// // // //               </div>
// // // //             </div>

// // // //             {/* Sources selon le type - SECTIONS CONDITIONNELLES */}
// // // //             {formData.type_incident && (
// // // //               <div className="space-y-4 pt-4 border-t border-base-300">
// // // //                 <h3 className="font-semibold text-base-content">Sources concernées :</h3>
                
// // // //                 {/* Matériel concerné - SEULEMENT EN PANNE */}
// // // //                 {availableSources.includes('materiel') && (
// // // //                   <div className="form-control">
// // // //                     <label className="label">
// // // //                       <span className="label-text font-semibold">
// // // //                         Matériel en panne {formData.type_incident === 'materiel' && <span className="text-error">*</span>}
// // // //                       </span>
// // // //                       {materiels.length > 0 && (
// // // //                         <span className="label-text-alt text-success">
// // // //                           ✅ {materiels.length} matériel(s) en panne
// // // //                         </span>
// // // //                       )}
// // // //                     </label>
                    
// // // //                     {showNoPanneMessage ? (
// // // //                       <div className="alert alert-warning">
// // // //                         <Info className="h-4 w-4" />
// // // //                         <div className="flex flex-col">
// // // //                           <span className="font-medium">Aucun matériel en panne disponible</span>
// // // //                           <span className="text-sm mt-1">
// // // //                             {currentUser?.role === 'technician' || currentUser?.role === 'admin' || currentUser?.role === 'administrateur' ? (
// // // //                               <span>
// // // //                                 Pour créer un incident matériel, vous devez d'abord marquer un matériel comme "en panne".
// // // //                                 <br />
// // // //                                 <a 
// // // //                                   href="/materiels" 
// // // //                                   className="link link-primary mt-1 inline-block"
// // // //                                   onClick={(e) => {
// // // //                                     e.preventDefault();
// // // //                                     onClose();
// // // //                                     window.location.href = '/materiels';
// // // //                                   }}
// // // //                                 >
// // // //                                   Gérer les états des matériels →
// // // //                                 </a>
// // // //                               </span>
// // // //                             ) : (
// // // //                               'Contactez un technicien ou un administrateur pour marquer un matériel comme "en panne".'
// // // //                             )}
// // // //                           </span>
// // // //                         </div>
// // // //                       </div>
// // // //                     ) : (
// // // //                       <>
// // // //                         <select
// // // //                           name="materiel"
// // // //                           value={formData.materiel}
// // // //                           onChange={handleChange}
// // // //                           className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
// // // //                           disabled={isSubmitting || materiels.length === 0}
// // // //                         >
// // // //                           <option value={0}>Sélectionnez un matériel en panne</option>
// // // //                           {materiels.map(item => (
// // // //                             <option key={item.id} value={item.id}>
// // // //                               {item.nom} ({item.reference}) - {item.service_attribue || 'Non spécifié'}
// // // //                             </option>
// // // //                           ))}
// // // //                         </select>
// // // //                         <div className="text-xs text-base-content opacity-60 mt-1 flex items-center gap-2">
// // // //                           <span>💡 Seuls les matériels marqués comme "en panne" sont disponibles</span>
// // // //                         </div>
// // // //                       </>
// // // //                     )}
                    
// // // //                     {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
// // // //                   </div>
// // // //                 )}

// // // //                 {/* Logiciel concerné */}
// // // //                 {availableSources.includes('logiciel') && (
// // // //                   <div className="form-control">
// // // //                     <label className="label">
// // // //                       <span className="label-text font-semibold">
// // // //                         Logiciel {formData.type_incident === 'logiciel' && <span className="text-error">*</span>}
// // // //                       </span>
// // // //                     </label>
// // // //                     <select
// // // //                       name="logiciel"
// // // //                       value={formData.logiciel}
// // // //                       onChange={handleChange}
// // // //                       className={`select select-bordered w-full ${errors.logiciel ? 'select-error' : ''}`}
// // // //                       disabled={isSubmitting || logiciels.length === 0}
// // // //                     >
// // // //                       <option value={0}>Sélectionnez un logiciel</option>
// // // //                       {logiciels.map(item => (
// // // //                         <option key={item.id} value={item.id}>
// // // //                           {item.nom} {item.version}
// // // //                         </option>
// // // //                       ))}
// // // //                     </select>
// // // //                     {errors.logiciel && <span className="text-error text-sm mt-1">{errors.logiciel}</span>}
// // // //                   </div>
// // // //                 )}

// // // //                 {/* Réseau concerné */}
// // // //                 {availableSources.includes('reseau') && (
// // // //                   <div className="form-control">
// // // //                     <label className="label">
// // // //                       <span className="label-text font-semibold">
// // // //                         Réseau {formData.type_incident === 'reseau' && <span className="text-error">*</span>}
// // // //                       </span>
// // // //                     </label>
// // // //                     <select
// // // //                       name="reseau"
// // // //                       value={formData.reseau}
// // // //                       onChange={handleChange}
// // // //                       className={`select select-bordered w-full ${errors.reseau ? 'select-error' : ''}`}
// // // //                       disabled={isSubmitting || reseaux.length === 0}
// // // //                     >
// // // //                       <option value={0}>Sélectionnez un équipement réseau</option>
// // // //                       {reseaux.map(item => (
// // // //                         <option key={item.id} value={item.id}>
// // // //                           {item.nom_hote} ({item.adresse_ip})
// // // //                         </option>
// // // //                       ))}
// // // //                     </select>
// // // //                     {errors.reseau && <span className="text-error text-sm mt-1">{errors.reseau}</span>}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             )}

// // // //             {/* Date et Heure */}
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">Date création :</span>
// // // //               </label>
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                 {/* Date */}
// // // //                 <div className="form-control">
// // // //                   <label className="label">
// // // //                     <span className="label-text">Date :</span>
// // // //                   </label>
// // // //                   <div className="flex items-center gap-2">
// // // //                     <div className="relative flex-1">
// // // //                       <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // //                       <input
// // // //                         type="date"
// // // //                         name="date_resolution"
// // // //                         value={formData.date_resolution}
// // // //                         onChange={handleChange}
// // // //                         className="input input-bordered w-full pl-10"
// // // //                         disabled={isSubmitting}
// // // //                       />
// // // //                     </div>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={handleSetToday}
// // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // //                       disabled={isSubmitting}
// // // //                     >
// // // //                       Aujourd'hui
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* Heure */}
// // // //                 <div className="form-control">
// // // //                   <label className="label">
// // // //                     <span className="label-text">Heure :</span>
// // // //                   </label>
// // // //                   <div className="flex items-center gap-2">
// // // //                     <div className="relative flex-1">
// // // //                       <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // //                       <input
// // // //                         type="time"
// // // //                         name="heure_resolution"
// // // //                         value={formData.heure_resolution}
// // // //                         onChange={handleChange}
// // // //                         className="input input-bordered w-full pl-10"
// // // //                         disabled={isSubmitting}
// // // //                       />
// // // //                     </div>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={handleSetNow}
// // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // //                       disabled={isSubmitting}
// // // //                     >
// // // //                       Maintenant
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             {/* Boutons */}
// // // //             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
// // // //               <button 
// // // //                 type="button" 
// // // //                 onClick={handleClose} 
// // // //                 className="btn btn-ghost"
// // // //                 disabled={isSubmitting}
// // // //               >
// // // //                 Annuler
// // // //               </button>
// // // //               <button 
// // // //                 type="submit" 
// // // //                 className="btn btn-primary"
// // // //                 disabled={isSubmitting || (formData.type_incident === 'materiel' && materiels.length === 0)}
// // // //               >
// // // //                 {isSubmitting ? (
// // // //                   <span className="flex items-center gap-2">
// // // //                     <Loader2 className="h-4 w-4 animate-spin" />
// // // //                     {incident ? 'Modification...' : 'Création...'}
// // // //                   </span>
// // // //                 ) : (
// // // //                   incident ? 'Modifier' : 'Créer'
// // // //                 )} l'incident
// // // //               </button>
// // // //             </div>
// // // //           </form>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default IncidentForm;





// // // // // IncidentForm.tsx - Version simplifiée SANS LOGICIELS NI RÉSEAU
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import { X, Calendar, Clock, User, AlertCircle, Loader2, AlertTriangle, Shield, Wrench, Briefcase, FileText, Info } from 'lucide-react';
// // // // import { Incident, User as UserType, Materiel, Alerte } from '../types';
// // // // import { materielsPanneAPI, handleApiError, materielsAPI } from '../services/api';

// // // // interface IncidentFormProps {
// // // //   isOpen: boolean;
// // // //   onClose: () => void;
// // // //   onSubmit: (incidentData: any) => void;
// // // //   incident?: Incident;
// // // //   currentUser: UserType; // L'utilisateur actuellement connecté
// // // //   alerteSource?: Alerte;
// // // // }

// // // // const IncidentForm: React.FC<IncidentFormProps> = ({
// // // //   isOpen,
// // // //   onClose,
// // // //   onSubmit,
// // // //   incident,
// // // //   currentUser,
// // // //   alerteSource
// // // // }) => {
// // // //   // États du formulaire - SIMPLIFIÉ
// // // //   const [formData, setFormData] = useState({
// // // //     description: '',
// // // //     date_resolution: '',
// // // //     heure_resolution: '',
// // // //     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
// // // //     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
// // // //     materiel: 0,
// // // //     alerte_source: 0
// // // //   });

// // // //   // États pour les données externes
// // // //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// // // //   const [errors, setErrors] = useState<Record<string, string>>({});
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [apiErrors, setApiErrors] = useState<string[]>([]);
// // // //   const [mode, setMode] = useState<'normal' | 'fromAlerte'>('normal');
// // // //   const [showNoPanneMessage, setShowNoPanneMessage] = useState(false);
  
// // // //   // Références pour éviter les boucles
// // // //   const dataLoadedRef = useRef(false);
// // // //   const isOpenRef = useRef(false);

// // // //   // Fonction pour obtenir le nom affichable de l'utilisateur
// // // //   const getDisplayName = (user: UserType | null) => {
// // // //     if (!user) return 'Utilisateur inconnu';
    
// // // //     if (user.nom_complet) return user.nom_complet;
// // // //     if (user.first_name && user.last_name) {
// // // //       return `${user.first_name} ${user.last_name}`;
// // // //     }
// // // //     if (user.username) return user.username;
// // // //     return `Utilisateur #${user.id}`;
// // // //   };

// // // //   // Fonction pour obtenir l'icône selon le rôle
// // // //   const getRoleIcon = (role: string | undefined) => {
// // // //     if (!role) return <User className="h-4 w-4" />;
    
// // // //     switch (role.toLowerCase()) {
// // // //       case 'admin':
// // // //       case 'administrateur':
// // // //         return <Shield className="h-4 w-4" />;
// // // //       case 'technician':
// // // //       case 'technicien':
// // // //         return <Wrench className="h-4 w-4" />;
// // // //       case 'director':
// // // //       case 'directeur':
// // // //         return <Briefcase className="h-4 w-4" />;
// // // //       case 'secretary':
// // // //       case 'secretaire':
// // // //         return <FileText className="h-4 w-4" />;
// // // //       default:
// // // //         return <User className="h-4 w-4" />;
// // // //     }
// // // //   };

// // // //   // Fonction pour obtenir la couleur selon le rôle
// // // //   const getRoleBadgeClass = (role: string | undefined) => {
// // // //     if (!role) return 'badge-neutral';
    
// // // //     switch (role.toLowerCase()) {
// // // //       case 'admin':
// // // //       case 'administrateur':
// // // //         return 'badge-error';
// // // //       case 'technician':
// // // //       case 'technicien':
// // // //         return 'badge-warning';
// // // //       case 'director':
// // // //       case 'directeur':
// // // //         return 'badge-success';
// // // //       case 'secretary':
// // // //       case 'secretaire':
// // // //         return 'badge-info';
// // // //       default:
// // // //         return 'badge-neutral';
// // // //     }
// // // //   };

// // // //   // Fonction pour obtenir le texte du rôle
// // // //   const getRoleText = (role: string | undefined) => {
// // // //     if (!role) return 'Utilisateur';
    
// // // //     switch (role.toLowerCase()) {
// // // //       case 'admin':
// // // //       case 'administrateur':
// // // //         return 'Administrateur';
// // // //       case 'technician':
// // // //       case 'technicien':
// // // //         return 'Technicien';
// // // //       case 'director':
// // // //       case 'directeur':
// // // //         return 'Directeur';
// // // //       case 'secretary':
// // // //       case 'secretaire':
// // // //         return 'Secrétaire';
// // // //       case 'user':
// // // //         return 'Utilisateur';
// // // //       default:
// // // //         return role.charAt(0).toUpperCase() + role.slice(1);
// // // //     }
// // // //   };

// // // //   // Fonction pour extraire les données de réponse API
// // // //   const extractDataFromResponse = (response: any): any[] => {
// // // //     if (!response || !response.data) return [];
    
// // // //     if (Array.isArray(response.data)) {
// // // //       return response.data;
// // // //     }
    
// // // //     if (response.data.results && Array.isArray(response.data.results)) {
// // // //       return response.data.results;
// // // //     }
    
// // // //     if (response.data.data && Array.isArray(response.data.data)) {
// // // //       return response.data.data;
// // // //     }
    
// // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // // //       const values = Object.values(response.data);
// // // //       if (values.length > 0 && values.every(v => typeof v === 'object')) {
// // // //         return values as any[];
// // // //       }
// // // //     }
    
// // // //     if (response.results && Array.isArray(response.results)) {
// // // //       return response.results;
// // // //     }
    
// // // //     return [];
// // // //   };

// // // //   // Fonction pour mapper la sévérité d'alerte vers priorité d'incident
// // // //   const mapSeveriteToPriorite = (severite: string): 'critique' | 'elevee' | 'moyenne' | 'basse' => {
// // // //     const mapping = {
// // // //       'critique': 'critique',
// // // //       'elevee': 'elevee',
// // // //       'moyenne': 'moyenne',
// // // //       'basse': 'basse'
// // // //     };
// // // //     return mapping[severite as keyof typeof mapping] || 'moyenne';
// // // //   };

// // // //   // Initialiser depuis une alerte
// // // //   const initFromAlerte = () => {
// // // //     if (!alerteSource) return;
    
// // // //     console.log('🚨 Initialisation depuis alerte:', alerteSource);
    
// // // //     const initialData = {
// // // //       description: `Incident généré depuis l'alerte: ${alerteSource.description}`,
// // // //       date_resolution: new Date().toISOString().split('T')[0],
// // // //       heure_resolution: new Date().toTimeString().slice(0, 5),
// // // //       priorite: mapSeveriteToPriorite(alerteSource.severite),
// // // //       statut: 'ouvert' as const,
// // // //       materiel: alerteSource.materiel_id || 0,
// // // //       alerte_source: alerteSource.id || 0
// // // //     };
    
// // // //     setFormData(initialData);
// // // //     setMode('fromAlerte');
// // // //   };

// // // //   // CHARGER LES MATÉRIELS EN PANNE - FONCTION CORRIGÉE
// // // //   const fetchMateriels = async () => {
// // // //     try {
// // // //       console.log('🔄 Chargement des matériels en panne...');
      
// // // //       // Utilisez l'API spécifique pour les matériels en panne
// // // //       const materielsEnPanne = await materielsPanneAPI.getMaterielsEnPanne();
      
// // // //       console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne chargé(s)`);
      
// // // //       if (materielsEnPanne.length === 0) {
// // // //         setShowNoPanneMessage(true);
// // // //         setMateriels([]);
// // // //       } else {
// // // //         setShowNoPanneMessage(false);
// // // //         setMateriels(materielsEnPanne);
// // // //       }
      
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur chargement matériels en panne:', error);
      
// // // //       // Fallback: essayer avec l'API normale et filtrer
// // // //       try {
// // // //         console.log('🔄 Tentative fallback avec API normale...');
// // // //         const response = await materielsAPI.getAll();
// // // //         const allMateriels = extractDataFromResponse(response);
        
// // // //         // Filtrer côté client
// // // //         const materielsEnPanne = allMateriels.filter((m: any) => {
// // // //           const etat = m.etat || m.status || m.state || '';
// // // //           return etat.toLowerCase().includes('panne') || etat.toLowerCase().includes('en_panne');
// // // //         });
        
// // // //         console.log(`⚠️ ${materielsEnPanne.length} matériel(s) en panne filtré(s) côté client`);
        
// // // //         if (materielsEnPanne.length === 0) {
// // // //           setShowNoPanneMessage(true);
// // // //           setMateriels([]);
// // // //         } else {
// // // //           setShowNoPanneMessage(false);
// // // //           setMateriels(materielsEnPanne);
// // // //         }
        
// // // //       } catch (fallbackError: any) {
// // // //         console.error('❌ Échec du fallback:', fallbackError);
// // // //         setShowNoPanneMessage(true);
// // // //         setMateriels([]);
// // // //         setApiErrors(prev => [...prev, 
// // // //           'Impossible de charger les matériels en panne. ' +
// // // //           'Vérifiez votre connexion ou contactez un administrateur.'
// // // //         ]);
// // // //       }
// // // //     }
// // // //   };

// // // //   // Charger toutes les données
// // // //   const fetchAllData = async () => {
// // // //     if (dataLoadedRef.current || !isOpen) return;
    
// // // //     setLoading(true);
// // // //     setApiErrors([]);
// // // //     dataLoadedRef.current = true;
    
// // // //     try {
// // // //       console.log('🔄 Début du chargement des données...');
      
// // // //       // Charger uniquement les matériels en panne
// // // //       await fetchMateriels();
      
// // // //       // Initialiser le formulaire
// // // //       if (alerteSource) {
// // // //         initFromAlerte();
// // // //       } else if (incident) {
// // // //         console.log('📝 Initialisation avec incident:', incident);
        
// // // //         setFormData({
// // // //           description: incident.description || '',
// // // //           date_resolution: incident.date_resolution?.split('T')[0] || '',
// // // //           heure_resolution: incident.date_resolution?.split('T')[1]?.substring(0, 5) || '',
// // // //           priorite: incident.priorite || 'moyenne',
// // // //           statut: incident.statut || 'ouvert',
// // // //           materiel: incident.materiel || 0,
// // // //           alerte_source: 0
// // // //         });
// // // //       }
      
// // // //     } catch (error) {
// // // //       console.error('💥 Erreur critique lors du chargement:', error);
// // // //       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // Effet pour charger les données
// // // //   useEffect(() => {
// // // //     if (isOpen && !isOpenRef.current) {
// // // //       isOpenRef.current = true;
// // // //       dataLoadedRef.current = false;
// // // //       fetchAllData();
// // // //     }
    
// // // //     return () => {
// // // //       if (!isOpen) {
// // // //         isOpenRef.current = false;
// // // //         dataLoadedRef.current = false;
// // // //       }
// // // //     };
// // // //   }, [isOpen, incident, alerteSource]);

// // // //   const resetForm = () => {
// // // //     setFormData({
// // // //       description: '',
// // // //       date_resolution: '',
// // // //       heure_resolution: '',
// // // //       priorite: 'moyenne',
// // // //       statut: 'ouvert',
// // // //       materiel: 0,
// // // //       alerte_source: 0
// // // //     });
// // // //     setErrors({});
// // // //     setApiErrors([]);
// // // //     setMode('normal');
// // // //     setShowNoPanneMessage(false);
// // // //   };

// // // //   const validateForm = () => {
// // // //     const newErrors: Record<string, string> = {};
    
// // // //     if (!formData.description.trim()) {
// // // //       newErrors.description = 'Description requise';
// // // //     }
    
// // // //     if (formData.materiel === 0) {
// // // //       newErrors.materiel = 'Matériel en panne requis';
// // // //     }
    
// // // //     setErrors(newErrors);
// // // //     return Object.keys(newErrors).length === 0;
// // // //   };

// // // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// // // //     const { name, value } = e.target;
    
// // // //     setFormData(prev => ({
// // // //       ...prev,
// // // //       [name]: name === 'materiel' 
// // // //         ? parseInt(value) || 0 
// // // //         : value
// // // //     }));
    
// // // //     if (errors[name]) {
// // // //       setErrors(prev => ({ ...prev, [name]: '' }));
// // // //     }
// // // //   };

// // // //   const handleSetToday = () => {
// // // //     const today = new Date().toISOString().split('T')[0];
// // // //     setFormData(prev => ({ ...prev, date_resolution: today }));
// // // //   };

// // // //   const handleSetNow = () => {
// // // //     const now = new Date();
// // // //     const currentTime = now.toTimeString().slice(0, 5);
// // // //     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
// // // //   };

// // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // //     e.preventDefault();
// // // //     if (!validateForm()) return;
    
// // // //     setIsSubmitting(true);
// // // //     setApiErrors([]);

// // // //     try {
// // // //       const utilisateurSignaleurId = currentUser?.id || 0;
      
// // // //       console.log('👤 Utilisateur signaleur automatique:', {
// // // //         id: utilisateurSignaleurId,
// // // //         nom: getDisplayName(currentUser),
// // // //         username: currentUser?.username,
// // // //         role: currentUser?.role,
// // // //         departement: currentUser?.departement
// // // //       });
      
// // // //       const incidentData: any = { 
// // // //         description: formData.description.trim(),
// // // //         priorite: formData.priorite,
// // // //         statut: formData.statut,
// // // //         type_incident: 'materiel', // Toujours matériel maintenant
// // // //         utilisateur_signaleur: utilisateurSignaleurId
// // // //       };

// // // //       // Ajouter la date de résolution si complète
// // // //       if (formData.date_resolution && formData.heure_resolution) {
// // // //         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
// // // //       } else if (formData.date_resolution) {
// // // //         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
// // // //       }

// // // //       // Ajouter le matériel
// // // //       if (formData.materiel > 0) incidentData.materiel = formData.materiel;

// // // //       // Ajouter l'alerte source si disponible
// // // //       if (formData.alerte_source > 0) {
// // // //         incidentData.alerte_source = formData.alerte_source;
// // // //       }

// // // //       console.log('📤 Soumission incident:', incidentData);
// // // //       await onSubmit(incidentData);
// // // //       onClose();
      
// // // //     } catch (error: any) {
// // // //       console.error('❌ Erreur soumission:', error);
// // // //       setApiErrors(prev => [...prev, handleApiError(error)]);
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const handleClose = () => {
// // // //     if (isSubmitting) return;
// // // //     resetForm();
// // // //     onClose();
// // // //   };

// // // //   if (!isOpen) return null;

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// // // //         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
// // // //           <div>
// // // //             <h2 className="text-xl font-bold text-base-content">
// // // //               {mode === 'fromAlerte' ? '📝 Créer Incident depuis Alerte' : 
// // // //                incident ? 'Modifier l\'incident' : 'Ajouter un Incident Matériel'}
// // // //             </h2>
// // // //             {mode === 'fromAlerte' && alerteSource && (
// // // //               <p className="text-sm text-base-content opacity-60 mt-1">
// // // //                 Généré depuis l'alerte #{alerteSource.id}
// // // //               </p>
// // // //             )}
// // // //           </div>
// // // //           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
// // // //             <X className="h-4 w-4" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Indicateur création depuis alerte */}
// // // //         {mode === 'fromAlerte' && alerteSource && (
// // // //           <div className="m-4 p-4 bg-info/10 border border-info/20 rounded-lg">
// // // //             <div className="flex items-center gap-3">
// // // //               <AlertTriangle className="h-5 w-5 text-info" />
// // // //               <div className="flex-1">
// // // //                 <p className="font-medium text-info">Incident créé automatiquement depuis une alerte</p>
// // // //                 <p className="text-sm opacity-80 mt-1">{alerteSource.description}</p>
// // // //                 <div className="flex flex-wrap gap-2 mt-2">
// // // //                   <span className="badge badge-info badge-sm">
// // // //                     Sévérité: {alerteSource.severite}
// // // //                   </span>
// // // //                   <span className="badge badge-info badge-sm">
// // // //                     Type: Matériel
// // // //                   </span>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Messages d'erreur API */}
// // // //         {apiErrors.length > 0 && (
// // // //           <div className="m-4">
// // // //             <div className="alert alert-warning">
// // // //               <AlertCircle className="h-5 w-5" />
// // // //               <div className="flex flex-col gap-1">
// // // //                 {apiErrors.map((error, index) => (
// // // //                   <span key={index} className="text-sm">{error}</span>
// // // //                 ))}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {loading ? (
// // // //           <div className="flex justify-center items-center p-12">
// // // //             <div className="flex flex-col items-center gap-4">
// // // //               <Loader2 className="h-8 w-8 text-primary animate-spin" />
// // // //               <span className="text-base-content">Chargement des matériels en panne...</span>
// // // //             </div>
// // // //           </div>
// // // //         ) : (
// // // //           <form onSubmit={handleSubmit} className="p-6 space-y-6">
// // // //             {/* Section utilisateur signaleur */}
// // // //             <div className="bg-base-200 rounded-lg p-4 border border-base-300">
// // // //               <div className="flex items-center justify-between mb-3">
// // // //                 <div className="flex items-center gap-3">
// // // //                   {getRoleIcon(currentUser?.role)}
// // // //                   <div>
// // // //                     <h3 className="font-semibold text-base-content">Utilisateur signaleur</h3>
// // // //                     <p className="text-sm text-base-content opacity-70">
// // // //                       Vous signalez cet incident en votre nom
// // // //                     </p>
// // // //                   </div>
// // // //                 </div>
// // // //                 <div className={`badge ${getRoleBadgeClass(currentUser?.role)} badge-sm text-white flex items-center gap-1`}>
// // // //                   {getRoleIcon(currentUser?.role)}
// // // //                   {getRoleText(currentUser?.role)}
// // // //                 </div>
// // // //               </div>
              
// // // //               <div className="bg-base-100 rounded-lg p-3 border border-base-300">
// // // //                 <div className="flex items-center gap-3">
// // // //                   <div className="avatar placeholder">
// // // //                     <div className="bg-primary text-primary-content rounded-full w-12">
// // // //                       <span className="text-lg font-bold">
// // // //                         {getDisplayName(currentUser).charAt(0).toUpperCase()}
// // // //                       </span>
// // // //                     </div>
// // // //                   </div>
// // // //                   <div className="flex-1">
// // // //                     <div className="font-bold text-lg text-base-content">
// // // //                       {getDisplayName(currentUser)}
// // // //                     </div>
// // // //                     <div className="text-sm text-base-content opacity-80 space-y-1 mt-1">
// // // //                       <div className="flex items-center gap-2">
// // // //                         <span className="font-medium">Identifiant :</span>
// // // //                         <span className="font-mono bg-base-200 px-2 py-0.5 rounded">
// // // //                           {currentUser?.username || `user_${currentUser?.id}`}
// // // //                         </span>
// // // //                       </div>
// // // //                       <div className="flex flex-wrap gap-3">
// // // //                         {currentUser?.email && (
// // // //                           <div className="flex items-center gap-1">
// // // //                             <span className="font-medium">Email :</span>
// // // //                             <span>{currentUser.email}</span>
// // // //                           </div>
// // // //                         )}
// // // //                         {currentUser?.departement && (
// // // //                           <div className="flex items-center gap-1">
// // // //                             <span className="font-medium">Département :</span>
// // // //                             <span>{currentUser.departement}</span>
// // // //                           </div>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
                
// // // //                 <div className="mt-3 pt-3 border-t border-base-300">
// // // //                   <div className="text-sm text-primary flex items-center gap-2">
// // // //                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
// // // //                     <span className="font-medium">
// // // //                       ✅ Signaleur automatique : <strong>{getDisplayName(currentUser)}</strong>
// // // //                     </span>
// // // //                   </div>
// // // //                   <div className="text-xs text-base-content opacity-60 mt-1">
// // // //                     L'incident sera automatiquement associé à votre compte de {getRoleText(currentUser?.role).toLowerCase()}.
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             {/* Description */}
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">Description :</span>
// // // //                 <span className="label-text-alt text-error">*</span>
// // // //               </label>
// // // //               <textarea
// // // //                 name="description"
// // // //                 value={formData.description}
// // // //                 onChange={handleChange}
// // // //                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
// // // //                 placeholder="Décrivez l'incident en détails..."
// // // //                 disabled={isSubmitting}
// // // //               />
// // // //               {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
// // // //               <div className="text-xs text-base-content opacity-60 mt-1">
// // // //                 Décrivez précisément le problème matériel rencontré.
// // // //               </div>
// // // //             </div>

// // // //             {/* Type d'incident (fixé à Matériel) */}
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">Type incident :</span>
// // // //                 <span className="label-text-alt text-error">*</span>
// // // //               </label>
// // // //               <div className="alert alert-info">
// // // //                 <Info className="h-5 w-5" />
// // // //                 <div>
// // // //                   <p className="font-medium">Incident matériel</p>
// // // //                   <p className="text-sm mt-1">
// // // //                     Le système gère désormais uniquement les incidents matériels.
// // // //                   </p>
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             {/* Priorité et Statut */}
// // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //               <div className="form-control">
// // // //                 <label className="label">
// // // //                   <span className="label-text font-semibold">Priorité :</span>
// // // //                 </label>
// // // //                 <select
// // // //                   name="priorite"
// // // //                   value={formData.priorite}
// // // //                   onChange={handleChange}
// // // //                   className="select select-bordered w-full"
// // // //                   disabled={isSubmitting}
// // // //                 >
// // // //                   <option value="basse">Basse</option>
// // // //                   <option value="moyenne">Moyenne</option>
// // // //                   <option value="elevee">Élevée</option>
// // // //                   <option value="critique">Critique</option>
// // // //                 </select>
// // // //               </div>

// // // //               <div className="form-control">
// // // //                 <label className="label">
// // // //                   <span className="label-text font-semibold">Statut :</span>
// // // //                 </label>
// // // //                 <select
// // // //                   name="statut"
// // // //                   value={formData.statut}
// // // //                   onChange={handleChange}
// // // //                   className="select select-bordered w-full"
// // // //                   disabled={isSubmitting}
// // // //                 >
// // // //                   <option value="ouvert">Ouvert</option>
// // // //                   <option value="en_cours">En cours</option>
// // // //                   <option value="resolu">Résolu</option>
// // // //                   <option value="ferme">Fermé</option>
// // // //                 </select>
// // // //               </div>
// // // //             </div>

// // // //             {/* Matériel en panne */}
// // // //             <div className="form-control pt-4 border-t border-base-300">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">
// // // //                   Matériel en panne 
// // // //                   <span className="text-error ml-1">*</span>
// // // //                 </span>
// // // //                 {materiels.length > 0 && (
// // // //                   <span className="label-text-alt text-success">
// // // //                     ✅ {materiels.length} matériel(s) en panne
// // // //                   </span>
// // // //                 )}
// // // //               </label>
              
// // // //               {showNoPanneMessage ? (
// // // //                 <div className="alert alert-warning">
// // // //                   <Info className="h-4 w-4" />
// // // //                   <div className="flex flex-col">
// // // //                     <span className="font-medium">Aucun matériel en panne disponible</span>
// // // //                     <span className="text-sm mt-1">
// // // //                       {currentUser?.role === 'technician' || currentUser?.role === 'admin' || currentUser?.role === 'administrateur' ? (
// // // //                         <span>
// // // //                           Pour créer un incident matériel, vous devez d'abord marquer un matériel comme "en panne".
// // // //                           <br />
// // // //                           <a 
// // // //                             href="/materiels" 
// // // //                             className="link link-primary mt-1 inline-block"
// // // //                             onClick={(e) => {
// // // //                               e.preventDefault();
// // // //                               onClose();
// // // //                               window.location.href = '/materiels';
// // // //                             }}
// // // //                           >
// // // //                             Gérer les états des matériels →
// // // //                           </a>
// // // //                         </span>
// // // //                       ) : (
// // // //                         'Contactez un technicien ou un administrateur pour marquer un matériel comme "en panne".'
// // // //                       )}
// // // //                     </span>
// // // //                   </div>
// // // //                 </div>
// // // //               ) : (
// // // //                 <>
// // // //                   <select
// // // //                     name="materiel"
// // // //                     value={formData.materiel}
// // // //                     onChange={handleChange}
// // // //                     className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
// // // //                     disabled={isSubmitting || materiels.length === 0}
// // // //                   >
// // // //                     <option value={0}>Sélectionnez un matériel en panne</option>
// // // //                     {materiels.map(item => (
// // // //                       <option key={item.id} value={item.id}>
// // // //                         {item.nom} ({item.reference}) - {item.service_attribue || 'Non spécifié'}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   <div className="text-xs text-base-content opacity-60 mt-1 flex items-center gap-2">
// // // //                     <span>💡 Seuls les matériels marqués comme "en panne" sont disponibles</span>
// // // //                   </div>
// // // //                 </>
// // // //               )}
              
// // // //               {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
// // // //             </div>

// // // //             {/* Date et Heure */}
// // // //             <div className="form-control">
// // // //               <label className="label">
// // // //                 <span className="label-text font-semibold">Date création :</span>
// // // //               </label>
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                 {/* Date */}
// // // //                 <div className="form-control">
// // // //                   <label className="label">
// // // //                     <span className="label-text">Date :</span>
// // // //                   </label>
// // // //                   <div className="flex items-center gap-2">
// // // //                     <div className="relative flex-1">
// // // //                       <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // //                       <input
// // // //                         type="date"
// // // //                         name="date_resolution"
// // // //                         value={formData.date_resolution}
// // // //                         onChange={handleChange}
// // // //                         className="input input-bordered w-full pl-10"
// // // //                         disabled={isSubmitting}
// // // //                       />
// // // //                     </div>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={handleSetToday}
// // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // //                       disabled={isSubmitting}
// // // //                     >
// // // //                       Aujourd'hui
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* Heure */}
// // // //                 <div className="form-control">
// // // //                   <label className="label">
// // // //                     <span className="label-text">Heure :</span>
// // // //                   </label>
// // // //                   <div className="flex items-center gap-2">
// // // //                     <div className="relative flex-1">
// // // //                       <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // // //                       <input
// // // //                         type="time"
// // // //                         name="heure_resolution"
// // // //                         value={formData.heure_resolution}
// // // //                         onChange={handleChange}
// // // //                         className="input input-bordered w-full pl-10"
// // // //                         disabled={isSubmitting}
// // // //                       />
// // // //                     </div>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={handleSetNow}
// // // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // // //                       disabled={isSubmitting}
// // // //                     >
// // // //                       Maintenant
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             {/* Boutons */}
// // // //             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
// // // //               <button 
// // // //                 type="button" 
// // // //                 onClick={handleClose} 
// // // //                 className="btn btn-ghost"
// // // //                 disabled={isSubmitting}
// // // //               >
// // // //                 Annuler
// // // //               </button>
// // // //               <button 
// // // //                 type="submit" 
// // // //                 className="btn btn-primary"
// // // //                 disabled={isSubmitting || materiels.length === 0}
// // // //               >
// // // //                 {isSubmitting ? (
// // // //                   <span className="flex items-center gap-2">
// // // //                     <Loader2 className="h-4 w-4 animate-spin" />
// // // //                     {incident ? 'Modification...' : 'Création...'}
// // // //                   </span>
// // // //                 ) : (
// // // //                   incident ? 'Modifier' : 'Créer'
// // // //                 )} l'incident
// // // //               </button>
// // // //             </div>
// // // //           </form>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default IncidentForm;




// // // // IncidentForm.tsx - VERSION CORRIGÉE avec 3 scénarios
// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { X, Calendar, Clock, User, AlertCircle, Loader2, AlertTriangle, Shield, Wrench, Briefcase, FileText, Info, Cpu, Battery } from 'lucide-react';
// // // import { Incident, User as UserType, Materiel, Alerte } from '../types';
// // // import { materielsPanneAPI, handleApiError, materielsAPI } from '../services/api';

// // // interface IncidentFormProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   onSubmit: (incidentData: any) => void;
// // //   incident?: Incident;
// // //   currentUser: UserType;
// // //   alerteSource?: Alerte;
// // //   materielSource?: Materiel; // Nouveau: pour scénario Dashboard
// // //   mode?: 'normal' | 'fromAlerte' | 'fromMateriel'; // Nouveau mode
// // // }

// // // const IncidentForm: React.FC<IncidentFormProps> = ({
// // //   isOpen,
// // //   onClose,
// // //   onSubmit,
// // //   incident,
// // //   currentUser,
// // //   alerteSource,
// // //   materielSource,
// // //   mode: initialMode = 'normal'
// // // }) => {
// // //   // États du formulaire
// // //   const [formData, setFormData] = useState({
// // //     description: '',
// // //     date_resolution: '',
// // //     heure_resolution: '',
// // //     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
// // //     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
// // //     materiel: 0,
// // //     alerte_source: 0
// // //   });

// // //   // États pour les données externes
// // //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// // //   const [errors, setErrors] = useState<Record<string, string>>({});
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [apiErrors, setApiErrors] = useState<string[]>([]);
// // //   const [mode, setMode] = useState<'normal' | 'fromAlerte' | 'fromMateriel'>(initialMode);
// // //   const [showNoPanneMessage, setShowNoPanneMessage] = useState(false);
  
// // //   // Références pour éviter les boucles
// // //   const dataLoadedRef = useRef(false);
// // //   const isOpenRef = useRef(false);

// // //   // Fonction pour obtenir le nom affichable de l'utilisateur
// // //   const getDisplayName = (user: UserType | null) => {
// // //     if (!user) return 'Utilisateur inconnu';
// // //     return user.nom_complet || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || `Utilisateur #${user.id}`;
// // //   };

// // //   // Fonction pour obtenir l'icône selon le rôle
// // //   const getRoleIcon = (role: string | undefined) => {
// // //     if (!role) return <User className="h-4 w-4" />;
// // //     const roleLower = role.toLowerCase();
// // //     if (roleLower.includes('admin')) return <Shield className="h-4 w-4" />;
// // //     if (roleLower.includes('technic')) return <Wrench className="h-4 w-4" />;
// // //     if (roleLower.includes('directeur')) return <Briefcase className="h-4 w-4" />;
// // //     if (roleLower.includes('secretaire')) return <FileText className="h-4 w-4" />;
// // //     return <User className="h-4 w-4" />;
// // //   };

// // //   // Fonction pour obtenir la couleur selon le rôle
// // //   const getRoleBadgeClass = (role: string | undefined) => {
// // //     if (!role) return 'badge-neutral';
// // //     const roleLower = role.toLowerCase();
// // //     if (roleLower.includes('admin')) return 'badge-error';
// // //     if (roleLower.includes('technic')) return 'badge-warning';
// // //     if (roleLower.includes('directeur')) return 'badge-success';
// // //     if (roleLower.includes('secretaire')) return 'badge-info';
// // //     return 'badge-neutral';
// // //   };

// // //   // Fonction pour obtenir le texte du rôle
// // //   const getRoleText = (role: string | undefined) => {
// // //     if (!role) return 'Utilisateur';
// // //     const roleLower = role.toLowerCase();
// // //     if (roleLower.includes('admin')) return 'Administrateur';
// // //     if (roleLower.includes('technic')) return 'Technicien';
// // //     if (roleLower.includes('directeur')) return 'Directeur';
// // //     if (roleLower.includes('secretaire')) return 'Secrétaire';
// // //     return role.charAt(0).toUpperCase() + role.slice(1);
// // //   };

// // //   // Fonction pour extraire les données de réponse API
// // //   const extractDataFromResponse = (response: any): any[] => {
// // //     if (!response || !response.data) return [];
// // //     if (Array.isArray(response.data)) return response.data;
// // //     if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// // //     if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// // //     if (typeof response.data === 'object') {
// // //       const values = Object.values(response.data);
// // //       if (values.length > 0 && values.every(v => typeof v === 'object')) return values as any[];
// // //     }
// // //     if (response.results && Array.isArray(response.results)) return response.results;
// // //     return [];
// // //   };

// // //   // Fonction pour mapper la sévérité d'alerte vers priorité d'incident
// // //   const mapSeveriteToPriorite = (severite: string): 'critique' | 'elevee' | 'moyenne' | 'basse' => {
// // //     const mapping = {
// // //       'critique': 'critique',
// // //       'elevee': 'elevee',
// // //       'moyenne': 'moyenne',
// // //       'basse': 'basse'
// // //     };
// // //     return mapping[severite as keyof typeof mapping] || 'moyenne';
// // //   };

// // //   // SCÉNARIO 2 : Initialiser depuis une alerte critique
// // //   const initFromAlerte = () => {
// // //     if (!alerteSource) return;
    
// // //     console.log('🚨 SCÉNARIO 2 : Initialisation depuis alerte critique:', alerteSource);
    
// // //     // Vérifier si l'alerte est critique
// // //     const isAlerteCritique = alerteSource.severite === 'critique';
// // //     const isStatutValide = alerteSource.statut === 'nouvelle' || alerteSource.statut === 'en_traitement';
    
// // //     if (!isAlerteCritique) {
// // //       console.warn('⚠️ Seules les alertes critiques peuvent créer automatiquement des incidents');
// // //       setApiErrors(prev => [...prev, 'Seules les alertes critiques peuvent créer des incidents automatiquement']);
// // //       return;
// // //     }
    
// // //     if (!isStatutValide) {
// // //       console.warn('⚠️ Alerte doit être "nouvelle" ou "en_traitement"');
// // //       setApiErrors(prev => [...prev, 'Les alertes résolues ne peuvent pas créer d\'incidents']);
// // //       return;
// // //     }
    
// // //     const initialData = {
// // //       description: `🚨 INCIDENT CRITIQUE - ${alerteSource.description}`,
// // //       date_resolution: new Date().toISOString().split('T')[0],
// // //       heure_resolution: new Date().toTimeString().slice(0, 5),
// // //       priorite: 'critique' as const, // Toujours critique pour les alertes critiques
// // //       statut: alerteSource.statut === 'en_traitement' ? 'en_cours' as const : 'ouvert' as const,
// // //       materiel: alerteSource.materiel_id || 0,
// // //       alerte_source: alerteSource.id || 0
// // //     };
    
// // //     setFormData(initialData);
// // //     setMode('fromAlerte');
// // //   };

// // //   // SCÉNARIO 3 : Initialiser depuis un matériel (Dashboard)
// // //   const initFromMateriel = () => {
// // //     if (!materielSource) return;
    
// // //     console.log('🖥️ SCÉNARIO 3 : Initialisation depuis matériel:', materielSource);
    
// // //     // Vérifier que le matériel est bien en panne
// // //     if (materielSource.etat !== 'en_panne' && !materielSource.etat?.toLowerCase().includes('panne')) {
// // //       console.warn('⚠️ Le matériel doit être en panne pour créer un incident');
// // //       setApiErrors(prev => [...prev, 'Seuls les matériels en panne peuvent avoir des incidents']);
// // //       return;
// // //     }
    
// // //     const initialData = {
// // //       description: `Incident sur ${materielSource.nom} (${materielSource.reference})`,
// // //       date_resolution: new Date().toISOString().split('T')[0],
// // //       heure_resolution: new Date().toTimeString().slice(0, 5),
// // //       priorite: 'moyenne' as const, // Par défaut moyenne
// // //       statut: 'ouvert' as const,
// // //       materiel: materielSource.id || 0,
// // //       alerte_source: 0
// // //     };
    
// // //     setFormData(initialData);
// // //     setMode('fromMateriel');
// // //   };

// // //   // SCÉNARIO 1 : Charger les matériels en panne
// // //   const fetchMateriels = async () => {
// // //     try {
// // //       console.log('🔄 SCÉNARIO 1 : Chargement des matériels en panne...');
      
// // //       const materielsEnPanne = await materielsPanneAPI.getMaterielsEnPanne();
      
// // //       console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne chargé(s)`);
      
// // //       if (materielsEnPanne.length === 0) {
// // //         setShowNoPanneMessage(true);
// // //         setMateriels([]);
// // //       } else {
// // //         setShowNoPanneMessage(false);
// // //         setMateriels(materielsEnPanne);
// // //       }
      
// // //     } catch (error: any) {
// // //       console.error('❌ Erreur chargement matériels en panne:', error);
      
// // //       try {
// // //         console.log('🔄 Tentative fallback...');
// // //         const response = await materielsAPI.getAll();
// // //         const allMateriels = extractDataFromResponse(response);
        
// // //         const materielsEnPanne = allMateriels.filter((m: any) => {
// // //           const etat = m.etat || m.status || m.state || '';
// // //           return etat.toLowerCase().includes('panne') || etat.toLowerCase().includes('en_panne');
// // //         });
        
// // //         console.log(`⚠️ ${materielsEnPanne.length} matériel(s) en panne filtré(s) côté client`);
        
// // //         if (materielsEnPanne.length === 0) {
// // //           setShowNoPanneMessage(true);
// // //           setMateriels([]);
// // //         } else {
// // //           setShowNoPanneMessage(false);
// // //           setMateriels(materielsEnPanne);
// // //         }
        
// // //       } catch (fallbackError: any) {
// // //         console.error('❌ Échec du fallback:', fallbackError);
// // //         setShowNoPanneMessage(true);
// // //         setMateriels([]);
// // //         setApiErrors(prev => [...prev, 
// // //           'Impossible de charger les matériels en panne. ' +
// // //           'Vérifiez votre connexion ou contactez un administrateur.'
// // //         ]);
// // //       }
// // //     }
// // //   };

// // //   // Charger toutes les données selon le scénario
// // //   const fetchAllData = async () => {
// // //     if (dataLoadedRef.current || !isOpen) return;
    
// // //     setLoading(true);
// // //     setApiErrors([]);
// // //     dataLoadedRef.current = true;
    
// // //     try {
// // //       console.log(`🔄 Début du chargement - Mode: ${mode}`);
      
// // //       // SCÉNARIO 1 : Normal - Charger tous les matériels en panne
// // //       if (mode === 'normal') {
// // //         await fetchMateriels();
// // //       }
      
// // //       // SCÉNARIO 2 : Depuis alerte - Pas besoin de charger les matériels
// // //       // SCÉNARIO 3 : Depuis matériel - Pas besoin de charger les matériels
      
// // //       // Initialiser le formulaire selon le scénario
// // //       if (mode === 'fromAlerte' && alerteSource) {
// // //         initFromAlerte();
// // //       } else if (mode === 'fromMateriel' && materielSource) {
// // //         initFromMateriel();
// // //       } else if (incident) {
// // //         console.log('📝 Mode édition incident:', incident);
        
// // //         setFormData({
// // //           description: incident.description || '',
// // //           date_resolution: incident.date_resolution?.split('T')[0] || '',
// // //           heure_resolution: incident.date_resolution?.split('T')[1]?.substring(0, 5) || '',
// // //           priorite: incident.priorite || 'moyenne',
// // //           statut: incident.statut || 'ouvert',
// // //           materiel: incident.materiel || 0,
// // //           alerte_source: incident.alerte_source || 0
// // //         });
// // //       }
      
// // //     } catch (error) {
// // //       console.error('💥 Erreur critique lors du chargement:', error);
// // //       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Effet pour charger les données
// // //   useEffect(() => {
// // //     if (isOpen && !isOpenRef.current) {
// // //       isOpenRef.current = true;
// // //       dataLoadedRef.current = false;
// // //       fetchAllData();
// // //     }
    
// // //     return () => {
// // //       if (!isOpen) {
// // //         isOpenRef.current = false;
// // //         dataLoadedRef.current = false;
// // //       }
// // //     };
// // //   }, [isOpen, incident, alerteSource, materielSource, mode]);

// // //   const resetForm = () => {
// // //     setFormData({
// // //       description: '',
// // //       date_resolution: '',
// // //       heure_resolution: '',
// // //       priorite: 'moyenne',
// // //       statut: 'ouvert',
// // //       materiel: 0,
// // //       alerte_source: 0
// // //     });
// // //     setErrors({});
// // //     setApiErrors([]);
// // //     setMode('normal');
// // //     setShowNoPanneMessage(false);
// // //   };

// // //   const validateForm = () => {
// // //     const newErrors: Record<string, string> = {};
    
// // //     if (!formData.description.trim()) {
// // //       newErrors.description = 'Description requise';
// // //     }
    
// // //     if (formData.materiel === 0) {
// // //       newErrors.materiel = 'Matériel en panne requis';
// // //     }
    
// // //     setErrors(newErrors);
// // //     return Object.keys(newErrors).length === 0;
// // //   };

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// // //     const { name, value } = e.target;
    
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [name]: name === 'materiel' 
// // //         ? parseInt(value) || 0 
// // //         : value
// // //     }));
    
// // //     if (errors[name]) {
// // //       setErrors(prev => ({ ...prev, [name]: '' }));
// // //     }
// // //   };

// // //   const handleSetToday = () => {
// // //     const today = new Date().toISOString().split('T')[0];
// // //     setFormData(prev => ({ ...prev, date_resolution: today }));
// // //   };

// // //   const handleSetNow = () => {
// // //     const now = new Date();
// // //     const currentTime = now.toTimeString().slice(0, 5);
// // //     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!validateForm()) return;
    
// // //     setIsSubmitting(true);
// // //     setApiErrors([]);

// // //     try {
// // //       const utilisateurSignaleurId = currentUser?.id || 0;
      
// // //       console.log('👤 Utilisateur signaleur:', {
// // //         id: utilisateurSignaleurId,
// // //         nom: getDisplayName(currentUser),
// // //         role: currentUser?.role
// // //       });
      
// // //       const incidentData: any = { 
// // //         description: formData.description.trim(),
// // //         priorite: formData.priorite,
// // //         statut: formData.statut,
// // //         type_incident: 'materiel',
// // //         utilisateur_signaleur: utilisateurSignaleurId
// // //       };

// // //       // Ajouter la date de résolution si complète
// // //       if (formData.date_resolution && formData.heure_resolution) {
// // //         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
// // //       } else if (formData.date_resolution) {
// // //         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
// // //       }

// // //       // Ajouter le matériel
// // //       if (formData.materiel > 0) incidentData.materiel = formData.materiel;

// // //       // Ajouter l'alerte source si disponible
// // //       if (formData.alerte_source > 0) {
// // //         incidentData.alerte_source = formData.alerte_source;
// // //       }

// // //       console.log('📤 Soumission incident:', incidentData);
// // //       await onSubmit(incidentData);
// // //       onClose();
      
// // //     } catch (error: any) {
// // //       console.error('❌ Erreur soumission:', error);
// // //       setApiErrors(prev => [...prev, handleApiError(error)]);
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleClose = () => {
// // //     if (isSubmitting) return;
// // //     resetForm();
// // //     onClose();
// // //   };

// // //   // Fonction pour obtenir le titre selon le mode
// // //   const getFormTitle = () => {
// // //     switch (mode) {
// // //       case 'fromAlerte':
// // //         return '📝 Créer Incident depuis Alerte Critique';
// // //       case 'fromMateriel':
// // //         return '🖥️ Créer Incident pour Matériel';
// // //       default:
// // //         return incident ? 'Modifier l\'incident' : '➕ Nouvel Incident Matériel';
// // //     }
// // //   };

// // //   // Fonction pour obtenir l'icône du matériel
// // //   const getMaterielIcon = () => {
// // //     switch (mode) {
// // //       case 'fromAlerte':
// // //         return <AlertTriangle className="h-5 w-5 text-error" />;
// // //       case 'fromMateriel':
// // //         return <Cpu className="h-5 w-5 text-warning" />;
// // //       default:
// // //         return <Battery className="h-5 w-5 text-info" />;
// // //     }
// // //   };

// // //   // Fonction pour obtenir la couleur du header
// // //   const getHeaderClass = () => {
// // //     switch (mode) {
// // //       case 'fromAlerte':
// // //         return 'bg-error/10 text-error border-error/20';
// // //       case 'fromMateriel':
// // //         return 'bg-warning/10 text-warning border-warning/20';
// // //       default:
// // //         return 'bg-primary/10 text-primary border-primary/20';
// // //     }
// // //   };

// // //   if (!isOpen) return null;

// // //   return (
// // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // //       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// // //         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
// // //           <div className="flex items-center gap-3">
// // //             {getMaterielIcon()}
// // //             <div>
// // //               <h2 className="text-xl font-bold text-base-content">
// // //                 {getFormTitle()}
// // //               </h2>
// // //               {mode === 'fromAlerte' && alerteSource && (
// // //                 <p className="text-sm text-base-content opacity-60 mt-1">
// // //                   Généré depuis l'alerte #{alerteSource.id} - {alerteSource.severite}
// // //                 </p>
// // //               )}
// // //               {mode === 'fromMateriel' && materielSource && (
// // //                 <p className="text-sm text-base-content opacity-60 mt-1">
// // //                   Matériel: {materielSource.nom} ({materielSource.reference})
// // //                 </p>
// // //               )}
// // //             </div>
// // //           </div>
// // //           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
// // //             <X className="h-4 w-4" />
// // //           </button>
// // //         </div>

// // //         {/* Indicateur selon le mode */}
// // //         {(mode === 'fromAlerte' && alerteSource) && (
// // //           <div className={`m-4 p-4 rounded-lg border ${getHeaderClass()}`}>
// // //             <div className="flex items-center gap-3">
// // //               <AlertTriangle className="h-5 w-5" />
// // //               <div className="flex-1">
// // //                 <p className="font-medium">🚨 SCÉNARIO 2 : Incident créé depuis une alerte critique</p>
// // //                 <p className="text-sm opacity-80 mt-1">{alerteSource.description}</p>
// // //                 <div className="flex flex-wrap gap-2 mt-2">
// // //                   <span className="badge badge-error badge-sm">
// // //                     Sévérité: {alerteSource.severite}
// // //                   </span>
// // //                   <span className="badge badge-warning badge-sm">
// // //                     Statut: {alerteSource.statut}
// // //                   </span>
// // //                   <span className="badge badge-info badge-sm">
// // //                     Type: Matériel
// // //                   </span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {mode === 'fromMateriel' && materielSource && (
// // //           <div className={`m-4 p-4 rounded-lg border ${getHeaderClass()}`}>
// // //             <div className="flex items-center gap-3">
// // //               <Cpu className="h-5 w-5" />
// // //               <div className="flex-1">
// // //                 <p className="font-medium">🖥️ SCÉNARIO 3 : Incident créé depuis Dashboard</p>
// // //                 <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
// // //                   <div>
// // //                     <span className="opacity-70">Matériel:</span>
// // //                     <span className="font-medium ml-2">{materielSource.nom}</span>
// // //                   </div>
// // //                   <div>
// // //                     <span className="opacity-70">Référence:</span>
// // //                     <span className="font-medium ml-2">{materielSource.reference}</span>
// // //                   </div>
// // //                   <div>
// // //                     <span className="opacity-70">État:</span>
// // //                     <span className="font-medium ml-2">{materielSource.etat}</span>
// // //                   </div>
// // //                   <div>
// // //                     <span className="opacity-70">Service:</span>
// // //                     <span className="font-medium ml-2">{materielSource.service_attribue || 'Non spécifié'}</span>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Messages d'erreur API */}
// // //         {apiErrors.length > 0 && (
// // //           <div className="m-4">
// // //             <div className="alert alert-warning">
// // //               <AlertCircle className="h-5 w-5" />
// // //               <div className="flex flex-col gap-1">
// // //                 {apiErrors.map((error, index) => (
// // //                   <span key={index} className="text-sm">{error}</span>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {loading ? (
// // //           <div className="flex justify-center items-center p-12">
// // //             <div className="flex flex-col items-center gap-4">
// // //               <Loader2 className="h-8 w-8 text-primary animate-spin" />
// // //               <span className="text-base-content">
// // //                 {mode === 'normal' ? 'Chargement des matériels en panne...' : 'Chargement...'}
// // //               </span>
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           <form onSubmit={handleSubmit} className="p-6 space-y-6">
// // //             {/* Section utilisateur signaleur */}
// // //             <div className="bg-base-200 rounded-lg p-4 border border-base-300">
// // //               <div className="flex items-center justify-between mb-3">
// // //                 <div className="flex items-center gap-3">
// // //                   {getRoleIcon(currentUser?.role)}
// // //                   <div>
// // //                     <h3 className="font-semibold text-base-content">Utilisateur signaleur</h3>
// // //                     <p className="text-sm text-base-content opacity-70">
// // //                       Vous signalez cet incident en votre nom
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //                 <div className={`badge ${getRoleBadgeClass(currentUser?.role)} badge-sm text-white flex items-center gap-1`}>
// // //                   {getRoleIcon(currentUser?.role)}
// // //                   {getRoleText(currentUser?.role)}
// // //                 </div>
// // //               </div>
              
// // //               <div className="bg-base-100 rounded-lg p-3 border border-base-300">
// // //                 <div className="flex items-center gap-3">
// // //                   <div className="avatar placeholder">
// // //                     <div className="bg-primary text-primary-content rounded-full w-12">
// // //                       <span className="text-lg font-bold">
// // //                         {getDisplayName(currentUser).charAt(0).toUpperCase()}
// // //                       </span>
// // //                     </div>
// // //                   </div>
// // //                   <div className="flex-1">
// // //                     <div className="font-bold text-lg text-base-content">
// // //                       {getDisplayName(currentUser)}
// // //                     </div>
// // //                     <div className="text-sm text-base-content opacity-80 space-y-1 mt-1">
// // //                       <div className="flex items-center gap-2">
// // //                         <span className="font-medium">Identifiant :</span>
// // //                         <span className="font-mono bg-base-200 px-2 py-0.5 rounded">
// // //                           {currentUser?.username || `user_${currentUser?.id}`}
// // //                         </span>
// // //                       </div>
// // //                       <div className="flex flex-wrap gap-3">
// // //                         {currentUser?.email && (
// // //                           <div className="flex items-center gap-1">
// // //                             <span className="font-medium">Email :</span>
// // //                             <span>{currentUser.email}</span>
// // //                           </div>
// // //                         )}
// // //                         {currentUser?.departement && (
// // //                           <div className="flex items-center gap-1">
// // //                             <span className="font-medium">Département :</span>
// // //                             <span>{currentUser.departement}</span>
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
                
// // //                 <div className="mt-3 pt-3 border-t border-base-300">
// // //                   <div className="text-sm text-primary flex items-center gap-2">
// // //                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
// // //                     <span className="font-medium">
// // //                       ✅ Signaleur automatique : <strong>{getDisplayName(currentUser)}</strong>
// // //                     </span>
// // //                   </div>
// // //                   <div className="text-xs text-base-content opacity-60 mt-1">
// // //                     L'incident sera automatiquement associé à votre compte de {getRoleText(currentUser?.role).toLowerCase()}.
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Description */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text font-semibold">Description :</span>
// // //                 <span className="label-text-alt text-error">*</span>
// // //               </label>
// // //               <textarea
// // //                 name="description"
// // //                 value={formData.description}
// // //                 onChange={handleChange}
// // //                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
// // //                 placeholder="Décrivez l'incident en détails..."
// // //                 disabled={isSubmitting}
// // //               />
// // //               {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
// // //               <div className="text-xs text-base-content opacity-60 mt-1">
// // //                 Décrivez précisément le problème matériel rencontré.
// // //               </div>
// // //             </div>

// // //             {/* Type d'incident (fixé à Matériel) */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text font-semibold">Type incident :</span>
// // //                 <span className="label-text-alt text-error">*</span>
// // //               </label>
// // //               <div className="alert alert-info">
// // //                 <Info className="h-5 w-5" />
// // //                 <div>
// // //                   <p className="font-medium">Incident matériel</p>
// // //                   <p className="text-sm mt-1">
// // //                     Le système gère désormais uniquement les incidents matériels.
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Priorité et Statut */}
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //               <div className="form-control">
// // //                 <label className="label">
// // //                   <span className="label-text font-semibold">Priorité :</span>
// // //                   {mode === 'fromAlerte' && (
// // //                     <span className="label-text-alt text-error">(Critique pour alerte critique)</span>
// // //                   )}
// // //                 </label>
// // //                 <select
// // //                   name="priorite"
// // //                   value={formData.priorite}
// // //                   onChange={handleChange}
// // //                   className="select select-bordered w-full"
// // //                   disabled={isSubmitting || mode === 'fromAlerte'} // Désactivé pour alerte critique
// // //                 >
// // //                   <option value="basse">Basse</option>
// // //                   <option value="moyenne">Moyenne</option>
// // //                   <option value="elevee">Élevée</option>
// // //                   <option value="critique">Critique</option>
// // //                 </select>
// // //                 {mode === 'fromAlerte' && (
// // //                   <div className="text-xs text-warning mt-1">
// // //                     ⚠️ La priorité est fixée à "Critique" pour les incidents créés depuis une alerte critique
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <div className="form-control">
// // //                 <label className="label">
// // //                   <span className="label-text font-semibold">Statut :</span>
// // //                   {mode === 'fromAlerte' && alerteSource?.statut === 'en_traitement' && (
// // //                     <span className="label-text-alt text-info">(Défini selon l'alerte)</span>
// // //                   )}
// // //                 </label>
// // //                 <select
// // //                   name="statut"
// // //                   value={formData.statut}
// // //                   onChange={handleChange}
// // //                   className="select select-bordered w-full"
// // //                   disabled={isSubmitting}
// // //                 >
// // //                   <option value="ouvert">Ouvert</option>
// // //                   <option value="en_cours">En cours</option>
// // //                   <option value="resolu">Résolu</option>
// // //                   <option value="ferme">Fermé</option>
// // //                 </select>
// // //               </div>
// // //             </div>

// // //             {/* Matériel en panne - SCÉNARIO 1 seulement */}
// // //             {(mode === 'normal' || (mode === 'fromMateriel' && !materielSource)) && (
// // //               <div className="form-control pt-4 border-t border-base-300">
// // //                 <label className="label">
// // //                   <span className="label-text font-semibold">
// // //                     Matériel en panne 
// // //                     <span className="text-error ml-1">*</span>
// // //                   </span>
// // //                   {materiels.length > 0 && (
// // //                     <span className="label-text-alt text-success">
// // //                       ✅ {materiels.length} matériel(s) en panne
// // //                     </span>
// // //                   )}
// // //                 </label>
                
// // //                 {showNoPanneMessage ? (
// // //                   <div className="alert alert-warning">
// // //                     <Info className="h-4 w-4" />
// // //                     <div className="flex flex-col">
// // //                       <span className="font-medium">Aucun matériel en panne disponible</span>
// // //                       <span className="text-sm mt-1">
// // //                         {currentUser?.role === 'technician' || currentUser?.role === 'admin' || currentUser?.role === 'administrateur' ? (
// // //                           <span>
// // //                             Pour créer un incident matériel, vous devez d'abord marquer un matériel comme "en panne".
// // //                             <br />
// // //                             <a 
// // //                               href="/materiels" 
// // //                               className="link link-primary mt-1 inline-block"
// // //                               onClick={(e) => {
// // //                                 e.preventDefault();
// // //                                 onClose();
// // //                                 window.location.href = '/materiels';
// // //                               }}
// // //                             >
// // //                               Gérer les états des matériels →
// // //                             </a>
// // //                           </span>
// // //                         ) : (
// // //                           'Contactez un technicien ou un administrateur pour marquer un matériel comme "en panne".'
// // //                         )}
// // //                       </span>
// // //                     </div>
// // //                   </div>
// // //                 ) : (
// // //                   <>
// // //                     <select
// // //                       name="materiel"
// // //                       value={formData.materiel}
// // //                       onChange={handleChange}
// // //                       className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
// // //                       disabled={isSubmitting || materiels.length === 0 || mode !== 'normal'}
// // //                     >
// // //                       <option value={0}>Sélectionnez un matériel en panne</option>
// // //                       {materiels.map(item => (
// // //                         <option key={item.id} value={item.id}>
// // //                           {item.nom} ({item.reference}) - {item.service_attribue || 'Non spécifié'}
// // //                         </option>
// // //                       ))}
// // //                     </select>
// // //                     <div className="text-xs text-base-content opacity-60 mt-1 flex items-center gap-2">
// // //                       <span>💡 Seuls les matériels marqués comme "en panne" sont disponibles</span>
// // //                     </div>
// // //                   </>
// // //                 )}
                
// // //                 {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
// // //               </div>
// // //             )}

// // //             {/* Affichage du matériel sélectionné pour SCÉNARIO 2 et 3 */}
// // //             {(mode === 'fromAlerte' || mode === 'fromMateriel') && formData.materiel > 0 && (
// // //               <div className="form-control">
// // //                 <label className="label">
// // //                   <span className="label-text font-semibold">Matériel concerné :</span>
// // //                 </label>
// // //                 <div className="p-4 bg-base-200 rounded-lg border border-base-300">
// // //                   <div className="flex items-center gap-3">
// // //                     <Cpu className="h-6 w-6 text-primary" />
// // //                     <div className="flex-1">
// // //                       <p className="font-bold text-base-content">
// // //                         {mode === 'fromAlerte' 
// // //                           ? `Matériel de l'alerte #${alerteSource?.id}`
// // //                           : `Matériel sélectionné`}
// // //                       </p>
// // //                       <p className="text-sm text-base-content opacity-70 mt-1">
// // //                         Ce matériel est automatiquement sélectionné pour l'incident
// // //                       </p>
// // //                     </div>
// // //                     <div className="badge badge-primary">ID: {formData.materiel}</div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Date et Heure */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text font-semibold">Date création :</span>
// // //               </label>
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                 {/* Date */}
// // //                 <div className="form-control">
// // //                   <label className="label">
// // //                     <span className="label-text">Date :</span>
// // //                   </label>
// // //                   <div className="flex items-center gap-2">
// // //                     <div className="relative flex-1">
// // //                       <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // //                       <input
// // //                         type="date"
// // //                         name="date_resolution"
// // //                         value={formData.date_resolution}
// // //                         onChange={handleChange}
// // //                         className="input input-bordered w-full pl-10"
// // //                         disabled={isSubmitting}
// // //                       />
// // //                     </div>
// // //                     <button
// // //                       type="button"
// // //                       onClick={handleSetToday}
// // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // //                       disabled={isSubmitting}
// // //                     >
// // //                       Aujourd'hui
// // //                     </button>
// // //                   </div>
// // //                 </div>

// // //                 {/* Heure */}
// // //                 <div className="form-control">
// // //                   <label className="label">
// // //                     <span className="label-text">Heure :</span>
// // //                   </label>
// // //                   <div className="flex items-center gap-2">
// // //                     <div className="relative flex-1">
// // //                       <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// // //                       <input
// // //                         type="time"
// // //                         name="heure_resolution"
// // //                         value={formData.heure_resolution}
// // //                         onChange={handleChange}
// // //                         className="input input-bordered w-full pl-10"
// // //                         disabled={isSubmitting}
// // //                       />
// // //                     </div>
// // //                     <button
// // //                       type="button"
// // //                       onClick={handleSetNow}
// // //                       className="btn btn-outline btn-sm whitespace-nowrap"
// // //                       disabled={isSubmitting}
// // //                     >
// // //                       Maintenant
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Boutons */}
// // //             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
// // //               <button 
// // //                 type="button" 
// // //                 onClick={handleClose} 
// // //                 className="btn btn-ghost"
// // //                 disabled={isSubmitting}
// // //               >
// // //                 Annuler
// // //               </button>
// // //               <button 
// // //                 type="submit" 
// // //                 className={`btn ${mode === 'fromAlerte' ? 'btn-error' : 'btn-primary'}`}
// // //                 disabled={isSubmitting || 
// // //                   (mode === 'normal' && materiels.length === 0) ||
// // //                   (mode === 'fromAlerte' && !formData.materiel) ||
// // //                   (mode === 'fromMateriel' && !formData.materiel)
// // //                 }
// // //               >
// // //                 {isSubmitting ? (
// // //                   <span className="flex items-center gap-2">
// // //                     <Loader2 className="h-4 w-4 animate-spin" />
// // //                     {incident ? 'Modification...' : 'Création...'}
// // //                   </span>
// // //                 ) : (
// // //                   <span className="flex items-center gap-2">
// // //                     {mode === 'fromAlerte' && <AlertTriangle className="h-4 w-4" />}
// // //                     {mode === 'fromMateriel' && <Cpu className="h-4 w-4" />}
// // //                     {incident ? 'Modifier' : 'Créer'} l'incident
// // //                   </span>
// // //                 )}
// // //               </button>
// // //             </div>

// // //             {/* Guide des scénarios */}
// // //             <div className="text-xs text-base-content opacity-60 pt-4 border-t border-base-300">
// // //               <p className="font-medium mb-2">📋 Scénarios disponibles :</p>
// // //               <ul className="space-y-1">
// // //                 <li className="flex items-center gap-2">
// // //                   <span className="badge badge-primary badge-xs">1</span>
// // //                   <span>Normal : Sélectionnez un matériel dans la liste</span>
// // //                 </li>
// // //                 <li className="flex items-center gap-2">
// // //                   <span className="badge badge-error badge-xs">2</span>
// // //                   <span>Depuis alerte : Formulaire pré-rempli depuis une alerte critique</span>
// // //                 </li>
// // //                 <li className="flex items-center gap-2">
// // //                   <span className="badge badge-warning badge-xs">3</span>
// // //                   <span>Depuis Dashboard : Matériel pré-sélectionné depuis le tableau de bord</span>
// // //                 </li>
// // //               </ul>
// // //             </div>
// // //           </form>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default IncidentForm;



// // // IncidentForm.tsx - VERSION SIMPLIFIÉE avec 3 scénarios
// // import React, { useState, useEffect, useRef } from 'react';
// // import { X, Calendar, Clock, User, AlertCircle, Loader2, AlertTriangle, Shield, Wrench, Info, Cpu } from 'lucide-react';
// // import { Incident, User as UserType, Materiel, Alerte } from '../types';
// // import { materielsPanneAPI, handleApiError } from '../services/api';

// // interface IncidentFormProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   onSubmit: (incidentData: any) => void;
// //   incident?: Incident;
// //   currentUser: UserType;
// //   alerteSource?: Alerte;       // Pour SCÉNARIO 2
// //   materielSource?: Materiel;   // Pour SCÉNARIO 3
// // }

// // const IncidentForm: React.FC<IncidentFormProps> = ({
// //   isOpen,
// //   onClose,
// //   onSubmit,
// //   incident,
// //   currentUser,
// //   alerteSource,
// //   materielSource
// // }) => {
// //   // Déterminer automatiquement le mode
// //   const getMode = () => {
// //     if (alerteSource) return 'fromAlerte';
// //     if (materielSource) return 'fromMateriel';
// //     return 'normal';
// //   };

// //   // États du formulaire
// //   const [formData, setFormData] = useState({
// //     description: '',
// //     date_resolution: '',
// //     heure_resolution: '',
// //     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
// //     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
// //     materiel: 0,
// //     alerte_source: 0
// //   });

// //   // États pour les données externes
// //   const [materiels, setMateriels] = useState<Materiel[]>([]);
// //   const [errors, setErrors] = useState<Record<string, string>>({});
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [apiErrors, setApiErrors] = useState<string[]>([]);
// //   const [showNoPanneMessage, setShowNoPanneMessage] = useState(false);
  
// //   // Références pour éviter les boucles
// //   const dataLoadedRef = useRef(false);
// //   const isOpenRef = useRef(false);
// //   const mode = getMode();

// //   // SCÉNARIO 1 : Charger les matériels en panne (Normal)
// //   const fetchMaterielsEnPanne = async () => {
// //     try {
// //       console.log('🔄 Chargement des matériels en panne...');
// //       const materielsEnPanne = await materielsPanneAPI.getMaterielsEnPanne();
      
// //       console.log(`✅ ${materielsEnPanne.length} matériel(s) en panne`);
// //       setMateriels(materielsEnPanne);
// //       setShowNoPanneMessage(materielsEnPanne.length === 0);
      
// //     } catch (error: any) {
// //       console.error('❌ Erreur chargement matériels:', error);
// //       setApiErrors(prev => [...prev, 'Impossible de charger les matériels en panne']);
// //       setShowNoPanneMessage(true);
// //     }
// //   };

// //   // Initialiser selon le scénario
// //   const initializeForm = () => {
// //     console.log(`🎯 Initialisation - Mode: ${mode}`);
    
// //     // SCÉNARIO 2 : Depuis alerte
// //     if (mode === 'fromAlerte' && alerteSource) {
// //       console.log('🚨 SCÉNARIO 2 : Depuis alerte critique');
      
// //       // Vérification : alerte doit être critique
// //       if (alerteSource.severite !== 'critique') {
// //         setApiErrors(prev => [...prev, 'Seules les alertes critiques peuvent créer des incidents']);
// //         return;
// //       }
      
// //       // Vérification : alerte doit être nouvelle ou en traitement
// //       if (alerteSource.statut !== 'nouvelle' && alerteSource.statut !== 'en_traitement') {
// //         setApiErrors(prev => [...prev, 'Seules les alertes "nouvelle" ou "en_traitement" peuvent créer des incidents']);
// //         return;
// //       }
      
// //       setFormData({
// //         description: `🚨 INCIDENT CRITIQUE - ${alerteSource.description}`,
// //         date_resolution: new Date().toISOString().split('T')[0],
// //         heure_resolution: new Date().toTimeString().slice(0, 5),
// //         priorite: 'critique',
// //         statut: alerteSource.statut === 'en_traitement' ? 'en_cours' : 'ouvert',
// //         materiel: alerteSource.materiel_id || 0,
// //         alerte_source: alerteSource.id || 0
// //       });
// //     }
    
// //     // SCÉNARIO 3 : Depuis matériel (Dashboard)
// //     else if (mode === 'fromMateriel' && materielSource) {
// //       console.log('🖥️ SCÉNARIO 3 : Depuis matériel');
      
// //       // Vérification : matériel doit être en panne
// //       if (!materielSource.etat?.toLowerCase().includes('panne')) {
// //         setApiErrors(prev => [...prev, 'Seuls les matériels en panne peuvent avoir des incidents']);
// //         return;
// //       }
      
// //       setFormData({
// //         description: `Incident sur ${materielSource.nom} (${materielSource.reference})`,
// //         date_resolution: new Date().toISOString().split('T')[0],
// //         heure_resolution: new Date().toTimeString().slice(0, 5),
// //         priorite: 'moyenne',
// //         statut: 'ouvert',
// //         materiel: materielSource.id || 0,
// //         alerte_source: 0
// //       });
// //     }
    
// //     // SCÉNARIO 1 : Normal ou édition
// //     else if (incident) {
// //       console.log('📝 Mode édition');
// //       setFormData({
// //         description: incident.description || '',
// //         date_resolution: incident.date_resolution?.split('T')[0] || '',
// //         heure_resolution: incident.date_resolution?.split('T')[1]?.substring(0, 5) || '',
// //         priorite: incident.priorite || 'moyenne',
// //         statut: incident.statut || 'ouvert',
// //         materiel: incident.materiel || 0,
// //         alerte_source: incident.alerte_source || 0
// //       });
// //     }
// //   };

// //   // Charger les données selon le scénario
// //   const loadData = async () => {
// //     if (dataLoadedRef.current || !isOpen) return;
    
// //     setLoading(true);
// //     setApiErrors([]);
// //     dataLoadedRef.current = true;
    
// //     try {
// //       // SCÉNARIO 1 : Charger les matériels en panne
// //       if (mode === 'normal' && !incident) {
// //         await fetchMaterielsEnPanne();
// //       }
      
// //       // Initialiser le formulaire
// //       initializeForm();
      
// //     } catch (error) {
// //       console.error('💥 Erreur chargement:', error);
// //       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Effet pour charger les données
// //   useEffect(() => {
// //     if (isOpen && !isOpenRef.current) {
// //       isOpenRef.current = true;
// //       dataLoadedRef.current = false;
// //       loadData();
// //     }
    
// //     if (!isOpen) {
// //       isOpenRef.current = false;
// //       dataLoadedRef.current = false;
// //     }
// //   }, [isOpen]);

// //   const resetForm = () => {
// //     setFormData({
// //       description: '',
// //       date_resolution: '',
// //       heure_resolution: '',
// //       priorite: 'moyenne',
// //       statut: 'ouvert',
// //       materiel: 0,
// //       alerte_source: 0
// //     });
// //     setErrors({});
// //     setApiErrors([]);
// //     setMateriels([]);
// //     setShowNoPanneMessage(false);
// //   };

// //   const validateForm = () => {
// //     const newErrors: Record<string, string> = {};
    
// //     if (!formData.description.trim()) {
// //       newErrors.description = 'Description requise';
// //     }
    
// //     if (formData.materiel === 0) {
// //       newErrors.materiel = 'Matériel en panne requis';
// //     }
    
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
    
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: name === 'materiel' ? parseInt(value) || 0 : value
// //     }));
    
// //     if (errors[name]) {
// //       setErrors(prev => ({ ...prev, [name]: '' }));
// //     }
// //   };

// //   const handleSetToday = () => {
// //     const today = new Date().toISOString().split('T')[0];
// //     setFormData(prev => ({ ...prev, date_resolution: today }));
// //   };

// //   const handleSetNow = () => {
// //     const now = new Date();
// //     const currentTime = now.toTimeString().slice(0, 5);
// //     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!validateForm()) return;
    
// //     setIsSubmitting(true);
// //     setApiErrors([]);

// //     try {
// //       const incidentData: any = { 
// //         description: formData.description.trim(),
// //         priorite: formData.priorite,
// //         statut: formData.statut,
// //         type_incident: 'materiel',
// //         utilisateur_signaleur: currentUser?.id || 0,
// //         materiel: formData.materiel
// //       };

// //       // Date de résolution
// //       if (formData.date_resolution && formData.heure_resolution) {
// //         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
// //       } else if (formData.date_resolution) {
// //         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
// //       }

// //       // Lien avec alerte
// //       if (formData.alerte_source > 0) {
// //         incidentData.alerte_source = formData.alerte_source;
// //       }

// //       console.log('📤 Soumission incident:', incidentData);
// //       await onSubmit(incidentData);
// //       onClose();
      
// //     } catch (error: any) {
// //       console.error('❌ Erreur soumission:', error);
// //       setApiErrors(prev => [...prev, handleApiError(error)]);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleClose = () => {
// //     if (isSubmitting) return;
// //     resetForm();
// //     onClose();
// //   };

// //   // Obtenir le titre du formulaire
// //   const getFormTitle = () => {
// //     if (incident) return 'Modifier l\'incident';
    
// //     switch (mode) {
// //       case 'fromAlerte': return '📝 Créer Incident depuis Alerte';
// //       case 'fromMateriel': return '🖥️ Créer Incident pour Matériel';
// //       default: return '➕ Nouvel Incident Matériel';
// //     }
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// //         {/* Header */}
// //         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
// //           <div className="flex items-center gap-3">
// //             {mode === 'fromAlerte' ? (
// //               <AlertTriangle className="h-5 w-5 text-error" />
// //             ) : mode === 'fromMateriel' ? (
// //               <Cpu className="h-5 w-5 text-warning" />
// //             ) : (
// //               <Wrench className="h-5 w-5 text-primary" />
// //             )}
// //             <div>
// //               <h2 className="text-xl font-bold text-base-content">
// //                 {getFormTitle()}
// //               </h2>
// //               {mode === 'fromAlerte' && alerteSource && (
// //                 <p className="text-sm text-base-content opacity-60 mt-1">
// //                   Alerte #{alerteSource.id} - {alerteSource.severite}
// //                 </p>
// //               )}
// //               {mode === 'fromMateriel' && materielSource && (
// //                 <p className="text-sm text-base-content opacity-60 mt-1">
// //                   Matériel: {materielSource.nom}
// //                 </p>
// //               )}
// //             </div>
// //           </div>
// //           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
// //             <X className="h-4 w-4" />
// //           </button>
// //         </div>

// //         {/* Messages d'erreur */}
// //         {apiErrors.length > 0 && (
// //           <div className="m-4">
// //             <div className="alert alert-error">
// //               <AlertCircle className="h-5 w-5" />
// //               <div className="flex flex-col gap-1">
// //                 {apiErrors.map((error, index) => (
// //                   <span key={index} className="text-sm">{error}</span>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {loading ? (
// //           <div className="flex justify-center items-center p-12">
// //             <div className="flex flex-col items-center gap-4">
// //               <Loader2 className="h-8 w-8 text-primary animate-spin" />
// //               <span className="text-base-content">Chargement...</span>
// //             </div>
// //           </div>
// //         ) : (
// //           <form onSubmit={handleSubmit} className="p-6 space-y-6">
// //             {/* Indicateur de scénario */}
// //             {mode === 'fromAlerte' && alerteSource && (
// //               <div className="alert alert-error">
// //                 <div className="flex items-center gap-3">
// //                   <AlertTriangle className="h-5 w-5" />
// //                   <div>
// //                     <p className="font-bold">SCÉNARIO 2 : Incident depuis alerte critique</p>
// //                     <p className="text-sm mt-1">{alerteSource.description}</p>
// //                     <div className="flex gap-2 mt-2">
// //                       <span className="badge badge-error badge-sm">Sévérité: {alerteSource.severite}</span>
// //                       <span className="badge badge-warning badge-sm">Statut: {alerteSource.statut}</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {mode === 'fromMateriel' && materielSource && (
// //               <div className="alert alert-warning">
// //                 <div className="flex items-center gap-3">
// //                   <Cpu className="h-5 w-5" />
// //                   <div>
// //                     <p className="font-bold">SCÉNARIO 3 : Incident depuis Dashboard</p>
// //                     <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
// //                       <div><span className="opacity-70">Matériel:</span> <span className="font-medium">{materielSource.nom}</span></div>
// //                       <div><span className="opacity-70">Référence:</span> <span className="font-medium">{materielSource.reference}</span></div>
// //                       <div><span className="opacity-70">État:</span> <span className="font-medium">{materielSource.etat}</span></div>
// //                       <div><span className="opacity-70">Service:</span> <span className="font-medium">{materielSource.service_attribue || 'Non spécifié'}</span></div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Description */}
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text font-semibold">Description :</span>
// //                 <span className="label-text-alt text-error">*</span>
// //               </label>
// //               <textarea
// //                 name="description"
// //                 value={formData.description}
// //                 onChange={handleChange}
// //                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
// //                 placeholder="Décrivez le problème matériel..."
// //                 disabled={isSubmitting}
// //               />
// //               {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
// //             </div>

// //             {/* Priorité et Statut */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="form-control">
// //                 <label className="label">
// //                   <span className="label-text font-semibold">Priorité :</span>
// //                 </label>
// //                 <select
// //                   name="priorite"
// //                   value={formData.priorite}
// //                   onChange={handleChange}
// //                   className="select select-bordered w-full"
// //                   disabled={isSubmitting || mode === 'fromAlerte'}
// //                 >
// //                   <option value="basse">Basse</option>
// //                   <option value="moyenne">Moyenne</option>
// //                   <option value="elevee">Élevée</option>
// //                   <option value="critique">Critique</option>
// //                 </select>
// //                 {mode === 'fromAlerte' && (
// //                   <div className="text-xs text-error mt-1">⚠️ Priorité fixée à "Critique" pour alerte critique</div>
// //                 )}
// //               </div>

// //               <div className="form-control">
// //                 <label className="label">
// //                   <span className="label-text font-semibold">Statut :</span>
// //                 </label>
// //                 <select
// //                   name="statut"
// //                   value={formData.statut}
// //                   onChange={handleChange}
// //                   className="select select-bordered w-full"
// //                   disabled={isSubmitting}
// //                 >
// //                   <option value="ouvert">Ouvert</option>
// //                   <option value="en_cours">En cours</option>
// //                   <option value="resolu">Résolu</option>
// //                   <option value="ferme">Fermé</option>
// //                 </select>
// //               </div>
// //             </div>

// //             {/* Matériel - SCÉNARIO 1 seulement */}
// //             {mode === 'normal' && !incident && (
// //               <div className="form-control">
// //                 <label className="label">
// //                   <span className="label-text font-semibold">
// //                     Matériel en panne 
// //                     <span className="text-error ml-1">*</span>
// //                   </span>
// //                   {materiels.length > 0 && (
// //                     <span className="label-text-alt text-success">
// //                       ✅ {materiels.length} matériel(s) en panne
// //                     </span>
// //                   )}
// //                 </label>
                
// //                 {showNoPanneMessage ? (
// //                   <div className="alert alert-warning">
// //                     <Info className="h-4 w-4" />
// //                     <div>
// //                       <p className="font-medium">Aucun matériel en panne disponible</p>
// //                       <p className="text-sm mt-1">
// //                         Marquez d'abord un matériel comme "en panne" dans la section Matériels.
// //                       </p>
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <>
// //                     <select
// //                       name="materiel"
// //                       value={formData.materiel}
// //                       onChange={handleChange}
// //                       className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
// //                       disabled={isSubmitting || materiels.length === 0}
// //                     >
// //                       <option value={0}>Sélectionnez un matériel en panne</option>
// //                       {materiels.map(item => (
// //                         <option key={item.id} value={item.id}>
// //                           {item.nom} ({item.reference}) - {item.service_attribue || 'Non spécifié'}
// //                         </option>
// //                       ))}
// //                     </select>
// //                     {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
// //                   </>
// //                 )}
// //               </div>
// //             )}

// //             {/* Matériel affiché pour SCÉNARIO 2 et 3 */}
// //             {(mode === 'fromAlerte' || mode === 'fromMateriel') && formData.materiel > 0 && (
// //               <div className="form-control">
// //                 <label className="label">
// //                   <span className="label-text font-semibold">Matériel concerné :</span>
// //                 </label>
// //                 <div className="p-4 bg-base-200 rounded-lg">
// //                   <div className="flex items-center gap-3">
// //                     <Cpu className="h-5 w-5 text-primary" />
// //                     <div>
// //                       <p className="font-bold">
// //                         Matériel #{formData.materiel} {mode === 'fromAlerte' ? '(depuis alerte)' : '(depuis dashboard)'}
// //                       </p>
// //                       <p className="text-sm opacity-70">Pré-sélectionné automatiquement</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Date et Heure */}
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text font-semibold">Date création :</span>
// //               </label>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div className="form-control">
// //                   <label className="label">
// //                     <span className="label-text">Date :</span>
// //                   </label>
// //                   <div className="flex items-center gap-2">
// //                     <div className="relative flex-1">
// //                       <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// //                       <input
// //                         type="date"
// //                         name="date_resolution"
// //                         value={formData.date_resolution}
// //                         onChange={handleChange}
// //                         className="input input-bordered w-full pl-10"
// //                         disabled={isSubmitting}
// //                       />
// //                     </div>
// //                     <button type="button" onClick={handleSetToday} className="btn btn-outline btn-sm" disabled={isSubmitting}>
// //                       Aujourd'hui
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div className="form-control">
// //                   <label className="label">
// //                     <span className="label-text">Heure :</span>
// //                   </label>
// //                   <div className="flex items-center gap-2">
// //                     <div className="relative flex-1">
// //                       <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// //                       <input
// //                         type="time"
// //                         name="heure_resolution"
// //                         value={formData.heure_resolution}
// //                         onChange={handleChange}
// //                         className="input input-bordered w-full pl-10"
// //                         disabled={isSubmitting}
// //                       />
// //                     </div>
// //                     <button type="button" onClick={handleSetNow} className="btn btn-outline btn-sm" disabled={isSubmitting}>
// //                       Maintenant
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Boutons */}
// //             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
// //               <button 
// //                 type="button" 
// //                 onClick={handleClose} 
// //                 className="btn btn-ghost"
// //                 disabled={isSubmitting}
// //               >
// //                 Annuler
// //               </button>
// //               <button 
// //                 type="submit" 
// //                 className={`btn ${mode === 'fromAlerte' ? 'btn-error' : 'btn-primary'}`}
// //                 disabled={isSubmitting || 
// //                   (mode === 'normal' && materiels.length === 0 && !incident)
// //                 }
// //               >
// //                 {isSubmitting ? (
// //                   <span className="flex items-center gap-2">
// //                     <Loader2 className="h-4 w-4 animate-spin" />
// //                     {incident ? 'Modification...' : 'Création...'}
// //                   </span>
// //                 ) : (
// //                   incident ? 'Modifier' : 'Créer l\'incident'
// //                 )}
// //               </button>
// //             </div>
// //           </form>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default IncidentForm;



// // IncidentForm.tsx - VERSION SIMPLIFIÉE avec description automatique
// import React, { useState, useEffect, useRef } from 'react';
// import { X, Calendar, Clock, User, AlertCircle, Loader2, AlertTriangle, Shield, Wrench, Info, Cpu } from 'lucide-react';
// import { Incident, User as UserType, Materiel, Alerte } from '../types';
// import { materielsAPI, handleApiError } from '../services/api';

// interface IncidentFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (incidentData: any) => void;
//   incident?: Incident;
//   currentUser: UserType;
//   alerteSource?: Alerte;       // Pour SCÉNARIO 2
//   materielSource?: Materiel;   // Pour SCÉNARIO 3
// }

// // Fonction pour extraire les données de la réponse API
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
//     'défectueux',
//     'ne fonctionne pas'
//   ];
  
//   return etatsPanne.some(panneEtat => 
//     etat.includes(panneEtat) || statut.includes(panneEtat)
//   );
// };

// const IncidentForm: React.FC<IncidentFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   incident,
//   currentUser,
//   alerteSource,
//   materielSource
// }) => {
//   // Déterminer automatiquement le mode
//   const getMode = () => {
//     if (alerteSource) return 'fromAlerte';
//     if (materielSource) return 'fromMateriel';
//     return 'normal';
//   };

//   // États du formulaire
//   const [formData, setFormData] = useState({
//     description: '',
//     date_resolution: '',
//     heure_resolution: '',
//     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
//     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
//     materiel: 0,
//     alerte_source: 0,
//     source: 'manuel' as 'manuel' | 'dashboard' | 'alerte' | 'automatique'
//   });

//   // États pour les données externes
//   const [materiels, setMateriels] = useState<Materiel[]>([]);
//   const [materielsEnPanne, setMaterielsEnPanne] = useState<Materiel[]>([]);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiErrors, setApiErrors] = useState<string[]>([]);
//   const [showNoPanneMessage, setShowNoPanneMessage] = useState(false);
//   const [selectedMaterielDetails, setSelectedMaterielDetails] = useState<Materiel | null>(null);
  
//   // Références pour éviter les boucles
//   const dataLoadedRef = useRef(false);
//   const isOpenRef = useRef(false);
//   const mode = getMode();

//   // Fonction pour générer une description automatique
//   const generateDescriptionFromMateriel = (materiel: Materiel | null | undefined): string => {
//     if (!materiel) return '';
    
//     const nom = materiel.nom || materiel.reference || `Matériel #${materiel.id}`;
//     const etat = materiel.etat || 'en panne';
//     const service = materiel.service_attribue || 'Non spécifié';
    
//     // Détecter si le matériel est en panne
//     const isPanne = isMaterielEnPanne(materiel);
    
//     // Détecter le type de problème
//     let typeProbleme = 'Problème';
//     if (etat.toLowerCase().includes('écran')) typeProbleme = 'Problème d\'écran';
//     else if (etat.toLowerCase().includes('clavier')) typeProbleme = 'Problème de clavier';
//     else if (etat.toLowerCase().includes('souris')) typeProbleme = 'Problème de souris';
//     else if (etat.toLowerCase().includes('réseau')) typeProbleme = 'Problème réseau';
//     else if (etat.toLowerCase().includes('batterie')) typeProbleme = 'Problème de batterie';
//     else if (etat.toLowerCase().includes('alimentation')) typeProbleme = 'Problème d\'alimentation';
    
//     const emplacement = materiel.emplacement || 'Local inconnu';
    
//     // Générer la description basée sur le mode
//     if (mode === 'fromAlerte' && alerteSource) {
//       return `🚨 INCIDENT CRITIQUE - ${alerteSource.description}`;
//     }
    
//     if (mode === 'fromMateriel') {
//       return `${isPanne ? '🚨 ' : ''}${typeProbleme} sur ${nom} (${service}). État: ${etat}. Localisation: ${emplacement}.`;
//     }
    
//     // Mode normal
//     if (isPanne) {
//       return `🚨 PANNE MATÉRIEL - ${nom} est ${etat}. Service: ${service}. Localisation: ${emplacement}. Nécessite intervention.`;
//     }
    
//     return `Incident sur ${nom}. Service: ${service}. État: ${etat}. Localisation: ${emplacement}.`;
//   };

//   // Charger les matériels et filtrer côté client
//   const fetchMateriels = async () => {
//     try {
//       console.log('🔄 Chargement des matériels...');
//       const response = await materielsAPI.getAll();
//       const allMateriels = extractDataFromResponse(response);
      
//       // Filtrer côté client pour trouver les matériels en panne
//       const materielsPanne = allMateriels.filter(materiel => 
//         isMaterielEnPanne(materiel)
//       );
      
//       console.log(`✅ ${allMateriels.length} matériels chargés, ${materielsPanne.length} en panne`);
//       setMateriels(allMateriels);
//       setMaterielsEnPanne(materielsPanne);
//       setShowNoPanneMessage(materielsPanne.length === 0);
      
//     } catch (error: any) {
//       console.error('❌ Erreur chargement matériels:', error);
//       setApiErrors(prev => [...prev, 'Impossible de charger les matériels']);
//       setShowNoPanneMessage(true);
//     }
//   };

//   // Initialiser selon le scénario
//   const initializeForm = () => {
//     console.log(`🎯 Initialisation - Mode: ${mode}`);
    
//     let initialSource: 'manuel' | 'dashboard' | 'alerte' | 'automatique' = 'manuel';
//     let initialMaterielId = 0;
//     let initialDescription = '';
//     let initialPriorite: 'critique' | 'elevee' | 'moyenne' | 'basse' = 'moyenne';
//     let initialStatut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme' = 'ouvert';

//     // SCÉNARIO 2 : Depuis alerte
//     if (mode === 'fromAlerte' && alerteSource) {
//       console.log('🚨 SCÉNARIO 2 : Depuis alerte critique');
      
//       // Vérification : alerte doit être critique
//       if (alerteSource.severite !== 'critique') {
//         setApiErrors(prev => [...prev, 'Seules les alertes critiques peuvent créer des incidents']);
//         return;
//       }
      
//       // Vérification : alerte doit être nouvelle ou en traitement
//       if (alerteSource.statut !== 'nouvelle' && alerteSource.statut !== 'en_traitement') {
//         setApiErrors(prev => [...prev, 'Seules les alertes "nouvelle" ou "en_traitement" peuvent créer des incidents']);
//         return;
//       }
      
//       initialSource = 'alerte';
//       initialMaterielId = alerteSource.materiel_id || 0;
//       initialPriorite = 'critique';
//       initialStatut = alerteSource.statut === 'en_traitement' ? 'en_cours' : 'ouvert';
//       initialDescription = `🚨 INCIDENT CRITIQUE - ${alerteSource.description}`;
//     }
    
//     // SCÉNARIO 3 : Depuis matériel (Dashboard)
//     else if (mode === 'fromMateriel' && materielSource) {
//       console.log('🖥️ SCÉNARIO 3 : Depuis matériel');
      
//       // Vérification : matériel doit être en panne
//       if (!isMaterielEnPanne(materielSource)) {
//         setApiErrors(prev => [...prev, 'Seuls les matériels en panne peuvent avoir des incidents']);
//         return;
//       }
      
//       initialSource = 'dashboard';
//       initialMaterielId = materielSource.id || 0;
//       initialDescription = generateDescriptionFromMateriel(materielSource);
//       initialPriorite = 'moyenne';
//       initialStatut = 'ouvert';
      
//       // Mettre à jour les détails du matériel
//       setSelectedMaterielDetails(materielSource);
//     }
    
//     // SCÉNARIO 1 : Normal ou édition
//     else if (incident) {
//       console.log('📝 Mode édition');
      
//       initialMaterielId = incident.materiel || 0;
//       initialDescription = incident.description || '';
//       initialPriorite = incident.priorite || 'moyenne';
//       initialStatut = incident.statut || 'ouvert';
//       initialSource = incident.source as any || 'manuel';
//     }

//     setFormData({
//       description: initialDescription,
//       date_resolution: new Date().toISOString().split('T')[0],
//       heure_resolution: new Date().toTimeString().slice(0, 5),
//       priorite: initialPriorite,
//       statut: initialStatut,
//       materiel: initialMaterielId,
//       alerte_source: alerteSource?.id || 0,
//       source: initialSource
//     });
    
//     // Mettre à jour les détails du matériel si nécessaire
//     if (initialMaterielId > 0) {
//       updateSelectedMaterielDetails(initialMaterielId);
//     }
//   };

//   // Mettre à jour les détails du matériel sélectionné
//   const updateSelectedMaterielDetails = (materielId: number) => {
//     if (materielId === 0) {
//       setSelectedMaterielDetails(null);
//       return;
//     }
    
//     // Chercher d'abord dans les matériels en panne
//     const foundMateriel = materielsEnPanne.find(m => m.id === materielId);
//     if (foundMateriel) {
//       setSelectedMaterielDetails(foundMateriel);
//       return;
//     }
    
//     // Sinon chercher dans tous les matériels
//     const foundInAll = materiels.find(m => m.id === materielId);
//     if (foundInAll) {
//       setSelectedMaterielDetails(foundInAll);
//     } else {
//       setSelectedMaterielDetails(null);
//     }
//   };

//   // Charger les données selon le scénario
//   const loadData = async () => {
//     if (dataLoadedRef.current || !isOpen) return;
    
//     setLoading(true);
//     setApiErrors([]);
//     dataLoadedRef.current = true;
    
//     try {
//       // Charger les matériels pour tous les modes
//       await fetchMateriels();
      
//       // Initialiser le formulaire
//       initializeForm();
      
//     } catch (error) {
//       console.error('💥 Erreur chargement:', error);
//       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effet pour charger les données
//   useEffect(() => {
//     if (isOpen && !isOpenRef.current) {
//       isOpenRef.current = true;
//       dataLoadedRef.current = false;
//       loadData();
//     }
    
//     if (!isOpen) {
//       isOpenRef.current = false;
//       dataLoadedRef.current = false;
//     }
//   }, [isOpen]);

//   const resetForm = () => {
//     setFormData({
//       description: '',
//       date_resolution: '',
//       heure_resolution: '',
//       priorite: 'moyenne',
//       statut: 'ouvert',
//       materiel: 0,
//       alerte_source: 0,
//       source: 'manuel'
//     });
//     setErrors({});
//     setApiErrors([]);
//     setMateriels([]);
//     setMaterielsEnPanne([]);
//     setShowNoPanneMessage(false);
//     setSelectedMaterielDetails(null);
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!formData.description.trim()) {
//       newErrors.description = 'Description requise';
//     }
    
//     if (formData.materiel === 0) {
//       newErrors.materiel = 'Matériel en panne requis';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     const newValue = name === 'materiel' ? parseInt(value) || 0 : value;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: newValue
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
    
//     // Mettre à jour les détails du matériel si nécessaire
//     if (name === 'materiel') {
//       updateSelectedMaterielDetails(newValue as number);
//     }
//   };

//   // Gestion spécifique du changement de matériel
//   const handleMaterielChange = (materielId: number) => {
//     setFormData(prev => ({
//       ...prev,
//       materiel: materielId
//     }));
    
//     // Mettre à jour les détails du matériel
//     updateSelectedMaterielDetails(materielId);
    
//     // Générer une description automatique si le matériel existe
//     if (materielId > 0 && selectedMaterielDetails) {
//       const newDescription = generateDescriptionFromMateriel(selectedMaterielDetails);
//       setFormData(prev => ({
//         ...prev,
//         description: newDescription
//       }));
//     }
    
//     if (errors.materiel) {
//       setErrors(prev => ({ ...prev, materiel: '' }));
//     }
//   };

//   const handleSetToday = () => {
//     const today = new Date().toISOString().split('T')[0];
//     setFormData(prev => ({ ...prev, date_resolution: today }));
//   };

//   const handleSetNow = () => {
//     const now = new Date();
//     const currentTime = now.toTimeString().slice(0, 5);
//     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
//   };

//   // Bouton pour regénérer la description
//   const handleRegenerateDescription = () => {
//     if (selectedMaterielDetails) {
//       const newDescription = generateDescriptionFromMateriel(selectedMaterielDetails);
//       setFormData(prev => ({
//         ...prev,
//         description: newDescription
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     setIsSubmitting(true);
//     setApiErrors([]);

//     try {
//       const incidentData: any = { 
//         description: formData.description.trim(),
//         priorite: formData.priorite,
//         statut: formData.statut,
//         type_incident: 'materiel',
//         utilisateur_signaleur: currentUser?.id || 0,
//         materiel: formData.materiel,
//         source: formData.source
//       };

//       // Date de résolution
//       if (formData.date_resolution && formData.heure_resolution) {
//         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
//       } else if (formData.date_resolution) {
//         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
//       }

//       // Lien avec alerte
//       if (formData.alerte_source > 0) {
//         incidentData.alerte_source = formData.alerte_source;
//       }

//       console.log('📤 Soumission incident:', incidentData);
//       await onSubmit(incidentData);
//       onClose();
      
//     } catch (error: any) {
//       console.error('❌ Erreur soumission:', error);
//       setApiErrors(prev => [...prev, handleApiError(error)]);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     if (isSubmitting) return;
//     resetForm();
//     onClose();
//   };

//   // Obtenir le titre du formulaire
//   const getFormTitle = () => {
//     if (incident) return 'Modifier l\'incident';
    
//     switch (mode) {
//       case 'fromAlerte': return '📝 Créer Incident depuis Alerte';
//       case 'fromMateriel': return '🖥️ Créer Incident pour Matériel';
//       default: return '➕ Nouvel Incident Matériel';
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
//           <div className="flex items-center gap-3">
//             {mode === 'fromAlerte' ? (
//               <AlertTriangle className="h-5 w-5 text-error" />
//             ) : mode === 'fromMateriel' ? (
//               <Cpu className="h-5 w-5 text-warning" />
//             ) : (
//               <Wrench className="h-5 w-5 text-primary" />
//             )}
//             <div>
//               <h2 className="text-xl font-bold text-base-content">
//                 {getFormTitle()}
//               </h2>
//               {mode === 'fromAlerte' && alerteSource && (
//                 <p className="text-sm text-base-content opacity-60 mt-1">
//                   Alerte #{alerteSource.id} - {alerteSource.severite}
//                 </p>
//               )}
//               {mode === 'fromMateriel' && materielSource && (
//                 <p className="text-sm text-base-content opacity-60 mt-1">
//                   Matériel: {materielSource.nom}
//                 </p>
//               )}
//             </div>
//           </div>
//           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Messages d'erreur */}
//         {apiErrors.length > 0 && (
//           <div className="m-4">
//             <div className="alert alert-error">
//               <AlertCircle className="h-5 w-5" />
//               <div className="flex flex-col gap-1">
//                 {apiErrors.map((error, index) => (
//                   <span key={index} className="text-sm">{error}</span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center p-12">
//             <div className="flex flex-col items-center gap-4">
//               <Loader2 className="h-8 w-8 text-primary animate-spin" />
//               <span className="text-base-content">Chargement...</span>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* Indicateur de scénario */}
//             {mode === 'fromAlerte' && alerteSource && (
//               <div className="alert alert-error">
//                 <div className="flex items-center gap-3">
//                   <AlertTriangle className="h-5 w-5" />
//                   <div>
//                     <p className="font-bold">SCÉNARIO 2 : Incident depuis alerte critique</p>
//                     <p className="text-sm mt-1">{alerteSource.description}</p>
//                     <div className="flex gap-2 mt-2">
//                       <span className="badge badge-error badge-sm">Sévérité: {alerteSource.severite}</span>
//                       <span className="badge badge-warning badge-sm">Statut: {alerteSource.statut}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {mode === 'fromMateriel' && materielSource && (
//               <div className="alert alert-warning">
//                 <div className="flex items-center gap-3">
//                   <Cpu className="h-5 w-5" />
//                   <div>
//                     <p className="font-bold">SCÉNARIO 3 : Incident depuis Dashboard</p>
//                     <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
//                       <div><span className="opacity-70">Matériel:</span> <span className="font-medium">{materielSource.nom}</span></div>
//                       <div><span className="opacity-70">Référence:</span> <span className="font-medium">{materielSource.reference}</span></div>
//                       <div><span className="opacity-70">État:</span> <span className="font-medium">{materielSource.etat}</span></div>
//                       <div><span className="opacity-70">Service:</span> <span className="font-medium">{materielSource.service_attribue || 'Non spécifié'}</span></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Description avec bouton de regénération */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Description :</span>
//                 <span className="label-text-alt text-error">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
//                 placeholder="Décrivez le problème matériel..."
//                 disabled={isSubmitting}
//               />
//               <div className="flex justify-between mt-1">
//                 {errors.description && (
//                   <span className="label-text-alt text-error">{errors.description}</span>
//                 )}
//                 <button
//                   type="button"
//                   onClick={handleRegenerateDescription}
//                   className="btn btn-xs btn-outline"
//                   disabled={!formData.materiel || isSubmitting}
//                 >
//                   Générer automatiquement
//                 </button>
//               </div>
//             </div>

//             {/* Priorité et Statut */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Priorité :</span>
//                 </label>
//                 <select
//                   name="priorite"
//                   value={formData.priorite}
//                   onChange={handleChange}
//                   className="select select-bordered w-full"
//                   disabled={isSubmitting || mode === 'fromAlerte'}
//                 >
//                   <option value="basse">Basse</option>
//                   <option value="moyenne">Moyenne</option>
//                   <option value="elevee">Élevée</option>
//                   <option value="critique">Critique</option>
//                 </select>
//                 {mode === 'fromAlerte' && (
//                   <div className="text-xs text-error mt-1">⚠️ Priorité fixée à "Critique" pour alerte critique</div>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Statut :</span>
//                 </label>
//                 <select
//                   name="statut"
//                   value={formData.statut}
//                   onChange={handleChange}
//                   className="select select-bordered w-full"
//                   disabled={isSubmitting}
//                 >
//                   <option value="ouvert">Ouvert</option>
//                   <option value="en_cours">En cours</option>
//                   <option value="resolu">Résolu</option>
//                   <option value="ferme">Fermé</option>
//                 </select>
//               </div>
//             </div>

//             {/* Matériel - SCÉNARIO 1 seulement */}
//             {mode === 'normal' && !incident && (
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">
//                     Matériel en panne 
//                     <span className="text-error ml-1">*</span>
//                   </span>
//                   {materielsEnPanne.length > 0 && (
//                     <span className="label-text-alt text-success">
//                       ✅ {materielsEnPanne.length} matériel(s) en panne
//                     </span>
//                   )}
//                 </label>
                
//                 {showNoPanneMessage ? (
//                   <div className="alert alert-warning">
//                     <Info className="h-4 w-4" />
//                     <div>
//                       <p className="font-medium">Aucun matériel en panne disponible</p>
//                       <p className="text-sm mt-1">
//                         Marquez d'abord un matériel comme "en panne" dans la section Matériels.
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <select
//                       name="materiel"
//                       value={formData.materiel}
//                       onChange={(e) => handleMaterielChange(parseInt(e.target.value))}
//                       className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
//                       disabled={isSubmitting || materielsEnPanne.length === 0}
//                     >
//                       <option value={0}>Sélectionnez un matériel en panne</option>
//                       {materielsEnPanne.map(item => (
//                         <option key={item.id} value={item.id}>
//                           {item.nom} ({item.reference}) - {item.service_attribue || 'Non spécifié'}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
//                   </>
//                 )}
//               </div>
//             )}

//             {/* Aperçu du matériel sélectionné */}
//             {selectedMaterielDetails && (
//               <div className="p-4 bg-base-200 rounded-lg">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-3">
//                     <Cpu className="h-5 w-5 text-primary" />
//                     <div>
//                       <h4 className="font-bold text-base-content">
//                         {selectedMaterielDetails.nom}
//                       </h4>
//                       <p className="text-sm text-base-content opacity-70">
//                         Réf: {selectedMaterielDetails.reference}
//                       </p>
//                     </div>
//                   </div>
//                   <span className={`badge ${
//                     isMaterielEnPanne(selectedMaterielDetails) ? 'badge-error' : 'badge-info'
//                   }`}>
//                     {selectedMaterielDetails.etat || 'État inconnu'}
//                   </span>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4 text-sm mt-3">
//                   <div>
//                     <span className="opacity-70">Type:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.type || 'Non spécifié'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Emplacement:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.emplacement || 'Non spécifié'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Service:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.service_attribue || 'Non spécifié'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Dernière MAJ:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.date_derniere_maintenance 
//                         ? new Date(selectedMaterielDetails.date_derniere_maintenance).toLocaleDateString('fr-FR')
//                         : 'Jamais'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Date et Heure */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Date création :</span>
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Date :</span>
//                   </label>
//                   <div className="flex items-center gap-2">
//                     <div className="relative flex-1">
//                       <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                       <input
//                         type="date"
//                         name="date_resolution"
//                         value={formData.date_resolution}
//                         onChange={handleChange}
//                         className="input input-bordered w-full pl-10"
//                         disabled={isSubmitting}
//                       />
//                     </div>
//                     <button type="button" onClick={handleSetToday} className="btn btn-outline btn-sm" disabled={isSubmitting}>
//                       Aujourd'hui
//                     </button>
//                   </div>
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Heure :</span>
//                   </label>
//                   <div className="flex items-center gap-2">
//                     <div className="relative flex-1">
//                       <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                       <input
//                         type="time"
//                         name="heure_resolution"
//                         value={formData.heure_resolution}
//                         onChange={handleChange}
//                         className="input input-bordered w-full pl-10"
//                         disabled={isSubmitting}
//                       />
//                     </div>
//                     <button type="button" onClick={handleSetNow} className="btn btn-outline btn-sm" disabled={isSubmitting}>
//                       Maintenant
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Boutons */}
//             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
//               <button 
//                 type="button" 
//                 onClick={handleClose} 
//                 className="btn btn-ghost"
//                 disabled={isSubmitting}
//               >
//                 Annuler
//               </button>
//               <button 
//                 type="submit" 
//                 className={`btn ${mode === 'fromAlerte' ? 'btn-error' : 'btn-primary'}`}
//                 disabled={isSubmitting || 
//                   (mode === 'normal' && materielsEnPanne.length === 0 && !incident)
//                 }
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     {incident ? 'Modification...' : 'Création...'}
//                   </span>
//                 ) : (
//                   incident ? 'Modifier' : 'Créer l\'incident'
//                 )}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IncidentForm;




// // IncidentForm.tsx - Version corrigée avec récupération automatique du nom du matériel
// import React, { useState, useEffect, useRef } from 'react';
// import { X, Calendar, Clock, User, AlertCircle, Loader2, AlertTriangle, Wrench, Info, Cpu, Monitor, HardDrive, Search } from 'lucide-react';
// import { Incident, User as UserType, Materiel, Alerte } from '../types';
// import { materielsAPI, handleApiError } from '../services/api';

// interface IncidentFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (incidentData: any) => void;
//   incident?: Incident;
//   currentUser: UserType;
//   alerteSource?: Alerte;
//   materielSource?: Materiel;
//   alertes?: Alerte[];        // Ajouté pour la sélection d'alertes
//   materiels?: Materiel[];    // Ajouté pour la sélection de matériels
// }

// // Fonction pour extraire les données de la réponse API
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
//     'défectueux',
//     'ne fonctionne pas'
//   ];
  
//   return etatsPanne.some(panneEtat => 
//     etat.includes(panneEtat) || statut.includes(panneEtat)
//   );
// };

// const IncidentForm: React.FC<IncidentFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   incident,
//   currentUser,
//   alerteSource,
//   materielSource,
//   alertes = [],
//   materiels = []
// }) => {
//   // Déterminer automatiquement le mode
//   const getMode = () => {
//     if (alerteSource) return 'fromAlerte';
//     if (materielSource) return 'fromMateriel';
//     return 'normal';
//   };

//   // États du formulaire
//   const [formData, setFormData] = useState({
//     description: '',
//     date_resolution: '',
//     heure_resolution: '',
//     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
//     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
//     materiel: 0,
//     alerte_source: 0,
//     source: 'manuel' as 'manuel' | 'dashboard' | 'alerte' | 'automatique',
//     type_incident: 'materiel' as 'materiel' | 'logiciel' | 'reseau' | 'mixte'
//   });

//   // États pour les données
//   const [allMateriels, setAllMateriels] = useState<Materiel[]>([]);
//   const [materielsEnPanne, setMaterielsEnPanne] = useState<Materiel[]>([]);
//   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiErrors, setApiErrors] = useState<string[]>([]);
//   const [selectedMaterielDetails, setSelectedMaterielDetails] = useState<Materiel | null>(null);
//   const [selectedAlerteDetails, setSelectedAlerteDetails] = useState<Alerte | null>(null);
  
//   // Filtres de recherche
//   const [searchMateriel, setSearchMateriel] = useState('');
//   const [searchAlerte, setSearchAlerte] = useState('');
  
//   // Références
//   const dataLoadedRef = useRef(false);
//   const isOpenRef = useRef(false);
//   const mode = getMode();

//   // Fonction pour générer une description automatique
//   const generateDescriptionFromMateriel = (materiel: Materiel | null | undefined): string => {
//     if (!materiel) return '';
    
//     const nom = materiel.nom || materiel.reference || `Matériel #${materiel.id}`;
//     const etat = materiel.etat || 'en panne';
//     const service = materiel.service_attribue || 'Non spécifié';
    
//     const isPanne = isMaterielEnPanne(materiel);
    
//     // Détecter le type de problème
//     let typeProbleme = 'Problème';
//     if (etat.toLowerCase().includes('écran')) typeProbleme = 'Problème d\'écran';
//     else if (etat.toLowerCase().includes('clavier')) typeProbleme = 'Problème de clavier';
//     else if (etat.toLowerCase().includes('souris')) typeProbleme = 'Problème de souris';
//     else if (etat.toLowerCase().includes('réseau')) typeProbleme = 'Problème réseau';
//     else if (etat.toLowerCase().includes('batterie')) typeProbleme = 'Problème de batterie';
//     else if (etat.toLowerCase().includes('alimentation')) typeProbleme = 'Problème d\'alimentation';
    
//     const emplacement = materiel.emplacement || 'Local inconnu';
    
//     if (mode === 'fromAlerte' && selectedAlerteDetails) {
//       return `🚨 INCIDENT CRITIQUE - ${selectedAlerteDetails.description}`;
//     }
    
//     if (mode === 'fromMateriel') {
//       return `${isPanne ? '🚨 ' : ''}${typeProbleme} sur ${nom} (${service}). État: ${etat}. Localisation: ${emplacement}.`;
//     }
    
//     if (isPanne) {
//       return `🚨 PANNE MATÉRIEL - ${nom} est ${etat}. Service: ${service}. Localisation: ${emplacement}. Nécessite intervention.`;
//     }
    
//     return `Incident sur ${nom}. Service: ${service}. État: ${etat}. Localisation: ${emplacement}.`;
//   };

//   // Charger tous les matériels
//   const fetchAllMateriels = async () => {
//     try {
//       console.log('🔄 Chargement de tous les matériels...');
//       const response = await materielsAPI.getAll();
//       const allMateriels = extractDataFromResponse(response);
      
//       // Filtrer les matériels en panne
//       const materielsPanne = allMateriels.filter(materiel => 
//         isMaterielEnPanne(materiel)
//       );
      
//       console.log(`✅ ${allMateriels.length} matériels chargés, ${materielsPanne.length} en panne`);
//       setAllMateriels(allMateriels);
//       setMaterielsEnPanne(materielsPanne);
      
//       // Si nous avons des matériels passés en props, les ajouter
//       if (materiels.length > 0) {
//         setAllMateriels(prev => {
//           const uniqueMateriels = [...prev];
//           materiels.forEach(materiel => {
//             if (!uniqueMateriels.some(m => m.id === materiel.id)) {
//               uniqueMateriels.push(materiel);
//             }
//           });
//           return uniqueMateriels;
//         });
//       }
      
//     } catch (error: any) {
//       console.error('❌ Erreur chargement matériels:', error);
//       setApiErrors(prev => [...prev, 'Impossible de charger les matériels']);
//     }
//   };

//   // Initialiser les alertes
//   const initializeAlertes = () => {
//     // Filtrer les alertes critiques et nouvelles/en traitement
//     const alertesFiltrees = alertes.filter(alerte => 
//       alerte.severite === 'critique' && 
//       (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement')
//     );
    
//     setFilteredAlertes(alertesFiltrees);
//     console.log(`✅ ${alertesFiltrees.length} alertes critiques disponibles`);
//   };

//   // Initialiser le formulaire selon le scénario
//   const initializeForm = () => {
//     console.log(`🎯 Initialisation - Mode: ${mode}`);
    
//     let initialSource: 'manuel' | 'dashboard' | 'alerte' | 'automatique' = 'manuel';
//     let initialMaterielId = 0;
//     let initialAlerteId = 0;
//     let initialDescription = '';
//     let initialPriorite: 'critique' | 'elevee' | 'moyenne' | 'basse' = 'moyenne';
//     let initialStatut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme' = 'ouvert';

//     // SCÉNARIO 2 : Depuis alerte
//     if (mode === 'fromAlerte' && alerteSource) {
//       console.log('🚨 SCÉNARIO 2 : Depuis alerte critique');
      
//       // Vérifications
//       if (alerteSource.severite !== 'critique') {
//         setApiErrors(prev => [...prev, 'Seules les alertes critiques peuvent créer des incidents']);
//         return;
//       }
      
//       if (alerteSource.statut !== 'nouvelle' && alerteSource.statut !== 'en_traitement') {
//         setApiErrors(prev => [...prev, 'Seules les alertes "nouvelle" ou "en_traitement" peuvent créer des incidents']);
//         return;
//       }
      
//       initialSource = 'alerte';
//       initialAlerteId = alerteSource.id || 0;
//       initialMaterielId = alerteSource.materiel_id || 0;
//       initialPriorite = 'critique';
//       initialStatut = alerteSource.statut === 'en_traitement' ? 'en_cours' : 'ouvert';
//       initialDescription = `🚨 INCIDENT CRITIQUE - ${alerteSource.description}`;
      
//       setSelectedAlerteDetails(alerteSource);
//     }
    
//     // SCÉNARIO 3 : Depuis matériel
//     else if (mode === 'fromMateriel' && materielSource) {
//       console.log('🖥️ SCÉNARIO 3 : Depuis matériel');
      
//       initialSource = 'dashboard';
//       initialMaterielId = materielSource.id || 0;
//       initialDescription = generateDescriptionFromMateriel(materielSource);
//       initialPriorite = isMaterielEnPanne(materielSource) ? 'critique' : 'moyenne';
//       initialStatut = 'ouvert';
      
//       setSelectedMaterielDetails(materielSource);
//     }
    
//     // SCÉNARIO 1 : Édition
//     else if (incident) {
//       console.log('📝 Mode édition');
      
//       initialMaterielId = incident.materiel || 0;
//       initialAlerteId = incident.alerte_id || 0;
//       initialDescription = incident.description || '';
//       initialPriorite = incident.priorite || 'moyenne';
//       initialStatut = incident.statut || 'ouvert';
//       initialSource = incident.source as any || 'manuel';
//     }

//     setFormData({
//       description: initialDescription,
//       date_resolution: new Date().toISOString().split('T')[0],
//       heure_resolution: new Date().toTimeString().slice(0, 5),
//       priorite: initialPriorite,
//       statut: initialStatut,
//       materiel: initialMaterielId,
//       alerte_source: initialAlerteId,
//       source: initialSource,
//       type_incident: 'materiel'
//     });
    
//     // Mettre à jour les détails du matériel si nécessaire
//     if (initialMaterielId > 0) {
//       updateSelectedMaterielDetails(initialMaterielId);
//     }
    
//     // Mettre à jour les détails de l'alerte si nécessaire
//     if (initialAlerteId > 0) {
//       updateSelectedAlerteDetails(initialAlerteId);
//     }
//   };

//   // Mettre à jour les détails du matériel sélectionné
//   const updateSelectedMaterielDetails = (materielId: number) => {
//     if (materielId === 0) {
//       setSelectedMaterielDetails(null);
//       return;
//     }
    
//     // Chercher d'abord dans les matériels en panne
//     const foundMateriel = materielsEnPanne.find(m => m.id === materielId);
//     if (foundMateriel) {
//       setSelectedMaterielDetails(foundMateriel);
//       return;
//     }
    
//     // Sinon chercher dans tous les matériels
//     const foundInAll = allMateriels.find(m => m.id === materielId);
//     if (foundInAll) {
//       setSelectedMaterielDetails(foundInAll);
//     } else {
//       setSelectedMaterielDetails(null);
//     }
//   };

//   // Mettre à jour les détails de l'alerte sélectionnée
//   const updateSelectedAlerteDetails = (alerteId: number) => {
//     if (alerteId === 0) {
//       setSelectedAlerteDetails(null);
//       return;
//     }
    
//     const foundAlerte = filteredAlertes.find(a => a.id === alerteId);
//     if (foundAlerte) {
//       setSelectedAlerteDetails(foundAlerte);
      
//       // Si l'alerte a un matériel associé, le sélectionner automatiquement
//       if (foundAlerte.materiel_id && formData.materiel === 0) {
//         setFormData(prev => ({
//           ...prev,
//           materiel: foundAlerte.materiel_id
//         }));
//         updateSelectedMaterielDetails(foundAlerte.materiel_id);
//       }
//     } else {
//       setSelectedAlerteDetails(null);
//     }
//   };

//   // Filtrer les matériels par recherche
//   const getFilteredMateriels = () => {
//     let filtered = materielsEnPanne.length > 0 ? materielsEnPanne : allMateriels;
    
//     if (searchMateriel) {
//       const searchLower = searchMateriel.toLowerCase();
//       filtered = filtered.filter(materiel => 
//         (materiel.nom?.toLowerCase() || '').includes(searchLower) ||
//         (materiel.reference?.toLowerCase() || '').includes(searchLower) ||
//         (materiel.service_attribue?.toLowerCase() || '').includes(searchLower)
//       );
//     }
    
//     return filtered;
//   };

//   // Filtrer les alertes par recherche
//   const getFilteredAlertes = () => {
//     let filtered = filteredAlertes;
    
//     if (searchAlerte) {
//       const searchLower = searchAlerte.toLowerCase();
//       filtered = filtered.filter(alerte => 
//         (alerte.description?.toLowerCase() || '').includes(searchLower)
//       );
//     }
    
//     return filtered;
//   };

//   // Charger les données
//   const loadData = async () => {
//     if (dataLoadedRef.current || !isOpen) return;
    
//     setLoading(true);
//     setApiErrors([]);
//     dataLoadedRef.current = true;
    
//     try {
//       // Charger les matériels
//       await fetchAllMateriels();
      
//       // Initialiser les alertes
//       initializeAlertes();
      
//       // Initialiser le formulaire
//       initializeForm();
      
//     } catch (error) {
//       console.error('💥 Erreur chargement:', error);
//       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effets
//   useEffect(() => {
//     if (isOpen && !isOpenRef.current) {
//       isOpenRef.current = true;
//       dataLoadedRef.current = false;
//       loadData();
//     }
    
//     if (!isOpen) {
//       isOpenRef.current = false;
//       dataLoadedRef.current = false;
//     }
//   }, [isOpen]);

//   // Réinitialiser le formulaire
//   const resetForm = () => {
//     setFormData({
//       description: '',
//       date_resolution: '',
//       heure_resolution: '',
//       priorite: 'moyenne',
//       statut: 'ouvert',
//       materiel: 0,
//       alerte_source: 0,
//       source: 'manuel',
//       type_incident: 'materiel'
//     });
//     setErrors({});
//     setApiErrors([]);
//     setAllMateriels([]);
//     setMaterielsEnPanne([]);
//     setFilteredAlertes([]);
//     setSelectedMaterielDetails(null);
//     setSelectedAlerteDetails(null);
//     setSearchMateriel('');
//     setSearchAlerte('');
//   };

//   // Validation
//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!formData.description.trim()) {
//       newErrors.description = 'Description requise';
//     }
    
//     if (formData.materiel === 0) {
//       newErrors.materiel = 'Matériel concerné requis';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handlers
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleMaterielChange = (materielId: number) => {
//     setFormData(prev => ({
//       ...prev,
//       materiel: materielId
//     }));
    
//     updateSelectedMaterielDetails(materielId);
    
//     // Générer une description automatique
//     if (materielId > 0 && selectedMaterielDetails) {
//       const newDescription = generateDescriptionFromMateriel(selectedMaterielDetails);
//       setFormData(prev => ({
//         ...prev,
//         description: newDescription
//       }));
//     }
    
//     if (errors.materiel) {
//       setErrors(prev => ({ ...prev, materiel: '' }));
//     }
//   };

//   const handleAlerteChange = (alerteId: number) => {
//     setFormData(prev => ({
//       ...prev,
//       alerte_source: alerteId,
//       source: 'alerte',
//       priorite: 'critique'
//     }));
    
//     updateSelectedAlerteDetails(alerteId);
    
//     // Générer une description automatique depuis l'alerte
//     if (alerteId > 0 && selectedAlerteDetails) {
//       const newDescription = `🚨 INCIDENT CRITIQUE - ${selectedAlerteDetails.description}`;
//       setFormData(prev => ({
//         ...prev,
//         description: newDescription
//       }));
//     }
//   };

//   const handleSetToday = () => {
//     const today = new Date().toISOString().split('T')[0];
//     setFormData(prev => ({ ...prev, date_resolution: today }));
//   };

//   const handleSetNow = () => {
//     const now = new Date();
//     const currentTime = now.toTimeString().slice(0, 5);
//     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
//   };

//   const handleRegenerateDescription = () => {
//     if (selectedMaterielDetails) {
//       const newDescription = generateDescriptionFromMateriel(selectedMaterielDetails);
//       setFormData(prev => ({
//         ...prev,
//         description: newDescription
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     setIsSubmitting(true);
//     setApiErrors([]);

//     try {
//       const incidentData: any = { 
//         description: formData.description.trim(),
//         priorite: formData.priorite,
//         statut: formData.statut,
//         type_incident: formData.type_incident,
//         utilisateur_signaleur: currentUser?.id || 0,
//         materiel: formData.materiel,
//         source: formData.source,
//         materiel_nom: selectedMaterielDetails?.nom || 'Matériel non spécifié' // IMPORTANT: Récupérer le nom pour l'affichage
//       };

//       // Date de résolution
//       if (formData.date_resolution && formData.heure_resolution) {
//         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
//       } else if (formData.date_resolution) {
//         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
//       }

//       // Lien avec alerte
//       if (formData.alerte_source > 0) {
//         incidentData.alerte_source = formData.alerte_source;
//         incidentData.alerte_id = formData.alerte_source;
//       }

//       // Ajouter les détails du matériel pour l'affichage
//       if (selectedMaterielDetails) {
//         incidentData.materiel_details = {
//           id: selectedMaterielDetails.id,
//           nom: selectedMaterielDetails.nom,
//           reference: selectedMaterielDetails.reference,
//           type_materiel: selectedMaterielDetails.type,
//           etat: selectedMaterielDetails.etat,
//           service_attribue: selectedMaterielDetails.service_attribue,
//           utilisateur_attribue: selectedMaterielDetails.utilisateur_attribue
//         };
//       }

//       console.log('📤 Soumission incident avec matériel:', {
//         ...incidentData,
//         materiel_nom: selectedMaterielDetails?.nom
//       });
      
//       await onSubmit(incidentData);
//       onClose();
      
//     } catch (error: any) {
//       console.error('❌ Erreur soumission:', error);
//       setApiErrors(prev => [...prev, handleApiError(error)]);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     if (isSubmitting) return;
//     resetForm();
//     onClose();
//   };

//   // Obtenir le titre
//   const getFormTitle = () => {
//     if (incident) return 'Modifier l\'incident';
    
//     switch (mode) {
//       case 'fromAlerte': return '🚨 Créer Incident depuis Alerte';
//       case 'fromMateriel': return '🖥️ Créer Incident pour Matériel';
//       default: return '➕ Nouvel Incident Matériel';
//     }
//   };

//   // Obtenir l'icône du matériel
//   const getMaterielIcon = (type?: string) => {
//     if (!type) return <Monitor className="h-4 w-4" />;
    
//     const typeLower = type.toLowerCase();
//     if (typeLower.includes('ordinateur') || typeLower.includes('pc') || typeLower.includes('laptop')) 
//       return <Monitor className="h-4 w-4" />;
//     if (typeLower.includes('serveur')) return <HardDrive className="h-4 w-4" />;
//     if (typeLower.includes('imprimante') || typeLower.includes('printer')) 
//       return <Printer className="h-4 w-4" />;
//     if (typeLower.includes('réseau') || typeLower.includes('switch') || typeLower.includes('routeur')) 
//       return <Network className="h-4 w-4" />;
//     return <Monitor className="h-4 w-4" />;
//   };

//   // Composant d'icône
//   const Printer = ({ className }: { className: string }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//     </svg>
//   );

//   const Network = ({ className }: { className: string }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
//     </svg>
//   );

//   const filteredMateriels = getFilteredMateriels();
//   const filteredAlertesList = getFilteredAlertes();

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
//           <div className="flex items-center gap-3">
//             {mode === 'fromAlerte' ? (
//               <AlertTriangle className="h-5 w-5 text-error" />
//             ) : mode === 'fromMateriel' ? (
//               <Cpu className="h-5 w-5 text-warning" />
//             ) : (
//               <Wrench className="h-5 w-5 text-primary" />
//             )}
//             <div>
//               <h2 className="text-xl font-bold text-base-content">
//                 {getFormTitle()}
//               </h2>
//               <p className="text-sm text-base-content opacity-60 mt-1">
//                 Matériel: {selectedMaterielDetails?.nom || 'Non sélectionné'}
//               </p>
//             </div>
//           </div>
//           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Messages d'erreur */}
//         {apiErrors.length > 0 && (
//           <div className="m-4">
//             <div className="alert alert-error">
//               <AlertCircle className="h-5 w-5" />
//               <div className="flex flex-col gap-1">
//                 {apiErrors.map((error, index) => (
//                   <span key={index} className="text-sm">{error}</span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center p-12">
//             <div className="flex flex-col items-center gap-4">
//               <Loader2 className="h-8 w-8 text-primary animate-spin" />
//               <span className="text-base-content">Chargement...</span>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* Indicateur de scénario */}
//             {mode === 'fromAlerte' && alerteSource && (
//               <div className="alert alert-error">
//                 <div className="flex items-center gap-3">
//                   <AlertTriangle className="h-5 w-5" />
//                   <div>
//                     <p className="font-bold">SCÉNARIO 2 : Incident depuis alerte critique</p>
//                     <p className="text-sm mt-1">{alerteSource.description}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Sélection d'alerte (si mode normal et des alertes sont disponibles) */}
//             {mode === 'normal' && filteredAlertesList.length > 0 && (
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Créer depuis une alerte (optionnel)</span>
//                 </label>
//                 <div className="space-y-2">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                     <input
//                       type="text"
//                       placeholder="Rechercher une alerte..."
//                       className="input input-bordered w-full pl-10"
//                       value={searchAlerte}
//                       onChange={(e) => setSearchAlerte(e.target.value)}
//                     />
//                   </div>
//                   <select
//                     value={formData.alerte_source}
//                     onChange={(e) => handleAlerteChange(parseInt(e.target.value))}
//                     className="select select-bordered w-full"
//                     disabled={isSubmitting}
//                   >
//                     <option value={0}>Sélectionnez une alerte critique</option>
//                     {filteredAlertesList.map(alerte => (
//                       <option key={alerte.id} value={alerte.id}>
//                         🚨 Alerte #{alerte.id}: {alerte.description.substring(0, 50)}...
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* Sélection du matériel */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">
//                   Matériel concerné 
//                   <span className="text-error ml-1">*</span>
//                 </span>
//                 {materielsEnPanne.length > 0 && (
//                   <span className="label-text-alt text-success">
//                     ✅ {materielsEnPanne.length} matériel(s) en panne disponible(s)
//                   </span>
//                 )}
//               </label>
              
//               <div className="space-y-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                   <input
//                     type="text"
//                     placeholder="Rechercher un matériel..."
//                     className="input input-bordered w-full pl-10"
//                     value={searchMateriel}
//                     onChange={(e) => setSearchMateriel(e.target.value)}
//                     disabled={isSubmitting}
//                   />
//                 </div>
                
//                 <select
//                   value={formData.materiel}
//                   onChange={(e) => handleMaterielChange(parseInt(e.target.value))}
//                   className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
//                   disabled={isSubmitting}
//                 >
//                   <option value={0}>Sélectionnez un matériel</option>
//                   {filteredMateriels.map(item => (
//                     <option key={item.id} value={item.id}>
//                       {getMaterielIcon(item.type)}
//                       {' '}
//                       {item.nom} ({item.reference}) - {item.service_attribue || 'Non spécifié'}
//                       {isMaterielEnPanne(item) && ' 🚨'}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
//               </div>
//             </div>

//             {/* Aperçu du matériel sélectionné */}
//             {selectedMaterielDetails && (
//               <div className="p-4 bg-base-200 rounded-lg border border-primary/20">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-3">
//                     {getMaterielIcon(selectedMaterielDetails.type)}
//                     <div>
//                       <h4 className="font-bold text-base-content">
//                         {selectedMaterielDetails.nom}
//                       </h4>
//                       <p className="text-sm text-base-content opacity-70">
//                         Référence: {selectedMaterielDetails.reference}
//                       </p>
//                     </div>
//                   </div>
//                   <span className={`badge ${
//                     isMaterielEnPanne(selectedMaterielDetails) ? 'badge-error' : 'badge-info'
//                   }`}>
//                     {selectedMaterielDetails.etat || 'État inconnu'}
//                     {isMaterielEnPanne(selectedMaterielDetails) && ' 🚨'}
//                   </span>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <span className="opacity-70">Type:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.type || 'Non spécifié'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Service:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.service_attribue || 'Non spécifié'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Utilisateur:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.utilisateur_attribue || 'Non attribué'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Emplacement:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.emplacement || 'Non spécifié'}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="mt-3 text-xs text-base-content opacity-60">
//                   Ce nom sera automatiquement récupéré dans le tableau des incidents
//                 </div>
//               </div>
//             )}

//             {/* Description */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Description :</span>
//                 <span className="label-text-alt text-error">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
//                 placeholder="Décrivez le problème..."
//                 disabled={isSubmitting}
//               />
//               <div className="flex justify-between mt-1">
//                 {errors.description && (
//                   <span className="label-text-alt text-error">{errors.description}</span>
//                 )}
//                 <button
//                   type="button"
//                   onClick={handleRegenerateDescription}
//                   className="btn btn-xs btn-outline"
//                   disabled={!formData.materiel || isSubmitting}
//                 >
//                   Générer automatiquement
//                 </button>
//               </div>
//             </div>

//             {/* Priorité et Statut */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Priorité :</span>
//                 </label>
//                 <select
//                   name="priorite"
//                   value={formData.priorite}
//                   onChange={handleChange}
//                   className="select select-bordered w-full"
//                   disabled={isSubmitting || formData.alerte_source > 0}
//                 >
//                   <option value="basse">Basse</option>
//                   <option value="moyenne">Moyenne</option>
//                   <option value="elevee">Élevée</option>
//                   <option value="critique">Critique</option>
//                 </select>
//                 {formData.alerte_source > 0 && (
//                   <div className="text-xs text-error mt-1">⚠️ Priorité fixée à "Critique" pour alerte critique</div>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Statut :</span>
//                 </label>
//                 <select
//                   name="statut"
//                   value={formData.statut}
//                   onChange={handleChange}
//                   className="select select-bordered w-full"
//                   disabled={isSubmitting}
//                 >
//                   <option value="ouvert">Ouvert</option>
//                   <option value="en_cours">En cours</option>
//                   <option value="resolu">Résolu</option>
//                   <option value="ferme">Fermé</option>
//                 </select>
//               </div>
//             </div>

//             {/* Date et Heure */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Date de création :</span>
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <div className="relative flex-1">
//                     <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                     <input
//                       type="date"
//                       name="date_resolution"
//                       value={formData.date_resolution}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10"
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleSetToday}
//                     className="btn btn-outline btn-sm"
//                     disabled={isSubmitting}
//                   >
//                     Aujourd'hui
//                   </button>
//                 </div>
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Heure :</span>
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <div className="relative flex-1">
//                     <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                     <input
//                       type="time"
//                       name="heure_resolution"
//                       value={formData.heure_resolution}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10"
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleSetNow}
//                     className="btn btn-outline btn-sm"
//                     disabled={isSubmitting}
//                   >
//                     Maintenant
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Type d'incident (caché mais toujours matériel) */}
//             <input type="hidden" name="type_incident" value="materiel" />

//             {/* Boutons */}
//             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
//               <button 
//                 type="button" 
//                 onClick={handleClose} 
//                 className="btn btn-ghost"
//                 disabled={isSubmitting}
//               >
//                 Annuler
//               </button>
//               <button 
//                 type="submit" 
//                 className={`btn ${formData.alerte_source > 0 ? 'btn-error' : 'btn-primary'}`}
//                 disabled={isSubmitting || !formData.materiel}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     {incident ? 'Modification...' : 'Création...'}
//                   </span>
//                 ) : (
//                   incident ? 'Modifier l\'incident' : 'Créer l\'incident'
//                 )}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IncidentForm;  






// // IncidentForm.tsx - Version corrigée avec récupération automatique du nom du matériel
// import React, { useState, useEffect, useRef } from 'react';
// import { X, Calendar, Clock, User, AlertCircle, Loader2, AlertTriangle, Wrench, Info, Cpu, Monitor, HardDrive, Search } from 'lucide-react';
// import { Incident, User as UserType, Materiel, Alerte } from '../types';
// import { materielsAPI, handleApiError } from '../services/api';

// interface IncidentFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (incidentData: any) => void;
//   incident?: Incident;
//   currentUser: UserType;
//   alerteSource?: Alerte;
//   materielSource?: Materiel;
//   alertes?: Alerte[];        // Ajouté pour la sélection d'alertes
//   materiels?: Materiel[];    // Ajouté pour la sélection de matériels
// }

// // Fonction pour extraire les données de la réponse API
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
//     'défectueux',
//     'ne fonctionne pas'
//   ];
  
//   return etatsPanne.some(panneEtat => 
//     etat.includes(panneEtat) || statut.includes(panneEtat)
//   );
// };

// const IncidentForm: React.FC<IncidentFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   incident,
//   currentUser,
//   alerteSource,
//   materielSource,
//   alertes = [],
//   materiels = []
// }) => {
//   // Déterminer automatiquement le mode
//   const getMode = () => {
//     if (alerteSource) return 'fromAlerte';
//     if (materielSource) return 'fromMateriel';
//     return 'normal';
//   };

//   // États du formulaire
//   const [formData, setFormData] = useState({
//     description: '',
//     date_resolution: '',
//     heure_resolution: '',
//     priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
//     statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
//     materiel: 0,
//     alerte_source: 0,
//     source: 'manuel' as 'manuel' | 'dashboard' | 'alerte' | 'automatique',
//     type_incident: 'materiel' as 'materiel' | 'logiciel' | 'reseau' | 'mixte'
//   });

//   // États pour les données
//   const [allMateriels, setAllMateriels] = useState<Materiel[]>([]);
//   const [materielsEnPanne, setMaterielsEnPanne] = useState<Materiel[]>([]);
//   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiErrors, setApiErrors] = useState<string[]>([]);
//   const [selectedMaterielDetails, setSelectedMaterielDetails] = useState<Materiel | null>(null);
//   const [selectedAlerteDetails, setSelectedAlerteDetails] = useState<Alerte | null>(null);
  
//   // Filtres de recherche
//   const [searchMateriel, setSearchMateriel] = useState('');
//   const [searchAlerte, setSearchAlerte] = useState('');
  
//   // Références
//   const dataLoadedRef = useRef(false);
//   const isOpenRef = useRef(false);
//   const mode = getMode();

//   // Fonction pour générer une description automatique
//   const generateDescriptionFromMateriel = (materiel: Materiel | null | undefined): string => {
//     if (!materiel) return '';
    
//     const nom = materiel.nom || materiel.reference || `Matériel #${materiel.id}`;
//     const etat = materiel.etat || 'en panne';
//     const service = materiel.service_attribue || 'Non spécifié';
    
//     const isPanne = isMaterielEnPanne(materiel);
    
//     // Détecter le type de problème
//     let typeProbleme = 'Problème';
//     if (etat.toLowerCase().includes('écran')) typeProbleme = 'Problème d\'écran';
//     else if (etat.toLowerCase().includes('clavier')) typeProbleme = 'Problème de clavier';
//     else if (etat.toLowerCase().includes('souris')) typeProbleme = 'Problème de souris';
//     else if (etat.toLowerCase().includes('réseau')) typeProbleme = 'Problème réseau';
//     else if (etat.toLowerCase().includes('batterie')) typeProbleme = 'Problème de batterie';
//     else if (etat.toLowerCase().includes('alimentation')) typeProbleme = 'Problème d\'alimentation';
    
//     const emplacement = materiel.emplacement || 'Local inconnu';
    
//     if (mode === 'fromAlerte' && selectedAlerteDetails) {
//       return `🚨 INCIDENT CRITIQUE - ${selectedAlerteDetails.description}`;
//     }
    
//     if (mode === 'fromMateriel') {
//       return `${isPanne ? '🚨 ' : ''}${typeProbleme} sur ${nom} (${service}). État: ${etat}. Localisation: ${emplacement}.`;
//     }
    
//     if (isPanne) {
//       return `🚨 PANNE MATÉRIEL - ${nom} est ${etat}. Service: ${service}. Localisation: ${emplacement}. Nécessite intervention.`;
//     }
    
//     return `Incident sur ${nom}. Service: ${service}. État: ${etat}. Localisation: ${emplacement}.`;
//   };

//   // Charger tous les matériels
//   const fetchAllMateriels = async () => {
//     try {
//       console.log('🔄 Chargement de tous les matériels...');
//       const response = await materielsAPI.getAll();
//       const allMateriels = extractDataFromResponse(response);
      
//       // Filtrer les matériels en panne
//       const materielsPanne = allMateriels.filter(materiel => 
//         isMaterielEnPanne(materiel)
//       );
      
//       console.log(`✅ ${allMateriels.length} matériels chargés, ${materielsPanne.length} en panne`);
//       setAllMateriels(allMateriels);
//       setMaterielsEnPanne(materielsPanne);
      
//       // Si nous avons des matériels passés en props, les ajouter
//       if (materiels.length > 0) {
//         setAllMateriels(prev => {
//           const uniqueMateriels = [...prev];
//           materiels.forEach(materiel => {
//             if (!uniqueMateriels.some(m => m.id === materiel.id)) {
//               uniqueMateriels.push(materiel);
//             }
//           });
//           return uniqueMateriels;
//         });
//       }
      
//     } catch (error: any) {
//       console.error('❌ Erreur chargement matériels:', error);
//       setApiErrors(prev => [...prev, 'Impossible de charger les matériels']);
//     }
//   };

//   // Initialiser les alertes
//   const initializeAlertes = () => {
//     // Filtrer les alertes critiques et nouvelles/en traitement
//     const alertesFiltrees = alertes.filter(alerte => 
//       alerte.severite === 'critique' && 
//       (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement')
//     );
    
//     setFilteredAlertes(alertesFiltrees);
//     console.log(`✅ ${alertesFiltrees.length} alertes critiques disponibles`);
//   };

//   // Initialiser le formulaire selon le scénario
//   const initializeForm = () => {
//     console.log(`🎯 Initialisation - Mode: ${mode}`);
    
//     let initialSource: 'manuel' | 'dashboard' | 'alerte' | 'automatique' = 'manuel';
//     let initialMaterielId = 0;
//     let initialAlerteId = 0;
//     let initialDescription = '';
//     let initialPriorite: 'critique' | 'elevee' | 'moyenne' | 'basse' = 'moyenne';
//     let initialStatut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme' = 'ouvert';

//     // SCÉNARIO 2 : Depuis alerte
//     if (mode === 'fromAlerte' && alerteSource) {
//       console.log('🚨 SCÉNARIO 2 : Depuis alerte critique');
      
//       // Vérifications
//       if (alerteSource.severite !== 'critique') {
//         setApiErrors(prev => [...prev, 'Seules les alertes critiques peuvent créer des incidents']);
//         return;
//       }
      
//       if (alerteSource.statut !== 'nouvelle' && alerteSource.statut !== 'en_traitement') {
//         setApiErrors(prev => [...prev, 'Seules les alertes "nouvelle" ou "en_traitement" peuvent créer des incidents']);
//         return;
//       }
      
//       initialSource = 'alerte';
//       initialAlerteId = alerteSource.id || 0;
//       initialMaterielId = alerteSource.materiel_id || 0;
//       initialPriorite = 'critique';
//       initialStatut = alerteSource.statut === 'en_traitement' ? 'en_cours' : 'ouvert';
//       initialDescription = `🚨 INCIDENT CRITIQUE - ${alerteSource.description}`;
      
//       setSelectedAlerteDetails(alerteSource);
//     }
    
//     // SCÉNARIO 3 : Depuis matériel
//     else if (mode === 'fromMateriel' && materielSource) {
//       console.log('🖥️ SCÉNARIO 3 : Depuis matériel');
      
//       initialSource = 'dashboard';
//       initialMaterielId = materielSource.id || 0;
//       initialDescription = generateDescriptionFromMateriel(materielSource);
//       initialPriorite = isMaterielEnPanne(materielSource) ? 'critique' : 'moyenne';
//       initialStatut = 'ouvert';
      
//       setSelectedMaterielDetails(materielSource);
//     }
    
//     // SCÉNARIO 1 : Édition
//     else if (incident) {
//       console.log('📝 Mode édition');
      
//       initialMaterielId = incident.materiel || 0;
//       initialAlerteId = incident.alerte_id || 0;
//       initialDescription = incident.description || '';
//       initialPriorite = incident.priorite || 'moyenne';
//       initialStatut = incident.statut || 'ouvert';
//       initialSource = incident.source as any || 'manuel';
//     }

//     setFormData({
//       description: initialDescription,
//       date_resolution: new Date().toISOString().split('T')[0],
//       heure_resolution: new Date().toTimeString().slice(0, 5),
//       priorite: initialPriorite,
//       statut: initialStatut,
//       materiel: initialMaterielId,
//       alerte_source: initialAlerteId,
//       source: initialSource,
//       type_incident: 'materiel'
//     });
    
//     // Mettre à jour les détails du matériel si nécessaire
//     if (initialMaterielId > 0) {
//       updateSelectedMaterielDetails(initialMaterielId);
//     }
    
//     // Mettre à jour les détails de l'alerte si nécessaire
//     if (initialAlerteId > 0) {
//       updateSelectedAlerteDetails(initialAlerteId);
//     }
//   };

//   // Mettre à jour les détails du matériel sélectionné
//   const updateSelectedMaterielDetails = (materielId: number) => {
//     if (materielId === 0) {
//       setSelectedMaterielDetails(null);
//       return;
//     }
    
//     // Chercher d'abord dans les matériels en panne
//     const foundMateriel = materielsEnPanne.find(m => m.id === materielId);
//     if (foundMateriel) {
//       setSelectedMaterielDetails(foundMateriel);
//       return;
//     }
    
//     // Sinon chercher dans tous les matériels
//     const foundInAll = allMateriels.find(m => m.id === materielId);
//     if (foundInAll) {
//       setSelectedMaterielDetails(foundInAll);
//     } else {
//       setSelectedMaterielDetails(null);
//     }
//   };

//   // Mettre à jour les détails de l'alerte sélectionnée
//   const updateSelectedAlerteDetails = (alerteId: number) => {
//     if (alerteId === 0) {
//       setSelectedAlerteDetails(null);
//       return;
//     }
    
//     const foundAlerte = filteredAlertes.find(a => a.id === alerteId);
//     if (foundAlerte) {
//       setSelectedAlerteDetails(foundAlerte);
      
//       // Si l'alerte a un matériel associé, le sélectionner automatiquement
//       if (foundAlerte.materiel_id && formData.materiel === 0) {
//         setFormData(prev => ({
//           ...prev,
//           materiel: foundAlerte.materiel_id
//         }));
//         updateSelectedMaterielDetails(foundAlerte.materiel_id);
//       }
//     } else {
//       setSelectedAlerteDetails(null);
//     }
//   };

//   // Filtrer les matériels par recherche
//   const getFilteredMateriels = () => {
//     let filtered = materielsEnPanne.length > 0 ? materielsEnPanne : allMateriels;
    
//     if (searchMateriel) {
//       const searchLower = searchMateriel.toLowerCase();
//       filtered = filtered.filter(materiel => 
//         (materiel.nom?.toLowerCase() || '').includes(searchLower) ||
//         (materiel.reference?.toLowerCase() || '').includes(searchLower) ||
//         (materiel.service_attribue?.toLowerCase() || '').includes(searchLower)
//       );
//     }
    
//     return filtered;
//   };

//   // Filtrer les alertes par recherche
//   const getFilteredAlertes = () => {
//     let filtered = filteredAlertes;
    
//     if (searchAlerte) {
//       const searchLower = searchAlerte.toLowerCase();
//       filtered = filtered.filter(alerte => 
//         (alerte.description?.toLowerCase() || '').includes(searchLower)
//       );
//     }
    
//     return filtered;
//   };

//   // Charger les données
//   const loadData = async () => {
//     if (dataLoadedRef.current || !isOpen) return;
    
//     setLoading(true);
//     setApiErrors([]);
//     dataLoadedRef.current = true;
    
//     try {
//       // Charger les matériels
//       await fetchAllMateriels();
      
//       // Initialiser les alertes
//       initializeAlertes();
      
//       // Initialiser le formulaire
//       initializeForm();
      
//     } catch (error) {
//       console.error('💥 Erreur chargement:', error);
//       setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effets
//   useEffect(() => {
//     if (isOpen && !isOpenRef.current) {
//       isOpenRef.current = true;
//       dataLoadedRef.current = false;
//       loadData();
//     }
    
//     if (!isOpen) {
//       isOpenRef.current = false;
//       dataLoadedRef.current = false;
//     }
//   }, [isOpen]);

//   // Réinitialiser le formulaire
//   const resetForm = () => {
//     setFormData({
//       description: '',
//       date_resolution: '',
//       heure_resolution: '',
//       priorite: 'moyenne',
//       statut: 'ouvert',
//       materiel: 0,
//       alerte_source: 0,
//       source: 'manuel',
//       type_incident: 'materiel'
//     });
//     setErrors({});
//     setApiErrors([]);
//     setAllMateriels([]);
//     setMaterielsEnPanne([]);
//     setFilteredAlertes([]);
//     setSelectedMaterielDetails(null);
//     setSelectedAlerteDetails(null);
//     setSearchMateriel('');
//     setSearchAlerte('');
//   };

//   // Validation
//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!formData.description.trim()) {
//       newErrors.description = 'Description requise';
//     }
    
//     if (formData.materiel === 0) {
//       newErrors.materiel = 'Matériel concerné requis';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handlers
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleMaterielChange = (materielId: number) => {
//     setFormData(prev => ({
//       ...prev,
//       materiel: materielId
//     }));
    
//     updateSelectedMaterielDetails(materielId);
    
//     // Générer une description automatique
//     if (materielId > 0 && selectedMaterielDetails) {
//       const newDescription = generateDescriptionFromMateriel(selectedMaterielDetails);
//       setFormData(prev => ({
//         ...prev,
//         description: newDescription
//       }));
//     }
    
//     if (errors.materiel) {
//       setErrors(prev => ({ ...prev, materiel: '' }));
//     }
//   };

//   const handleAlerteChange = (alerteId: number) => {
//     setFormData(prev => ({
//       ...prev,
//       alerte_source: alerteId,
//       source: 'alerte',
//       priorite: 'critique'
//     }));
    
//     updateSelectedAlerteDetails(alerteId);
    
//     // Générer une description automatique depuis l'alerte
//     if (alerteId > 0 && selectedAlerteDetails) {
//       const newDescription = `🚨 INCIDENT CRITIQUE - ${selectedAlerteDetails.description}`;
//       setFormData(prev => ({
//         ...prev,
//         description: newDescription
//       }));
//     }
//   };

//   const handleSetToday = () => {
//     const today = new Date().toISOString().split('T')[0];
//     setFormData(prev => ({ ...prev, date_resolution: today }));
//   };

//   const handleSetNow = () => {
//     const now = new Date();
//     const currentTime = now.toTimeString().slice(0, 5);
//     setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
//   };

//   const handleRegenerateDescription = () => {
//     if (selectedMaterielDetails) {
//       const newDescription = generateDescriptionFromMateriel(selectedMaterielDetails);
//       setFormData(prev => ({
//         ...prev,
//         description: newDescription
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     setIsSubmitting(true);
//     setApiErrors([]);

//     try {
//       const incidentData: any = { 
//         description: formData.description.trim(),
//         priorite: formData.priorite,
//         statut: formData.statut,
//         type_incident: formData.type_incident,
//         utilisateur_signaleur: currentUser?.id || 0,
//         materiel: formData.materiel,
//         source: formData.source,
//         materiel_nom: selectedMaterielDetails?.nom || 'Matériel non spécifié' // IMPORTANT: Récupérer le nom pour l'affichage
//       };

//       // Date de résolution
//       if (formData.date_resolution && formData.heure_resolution) {
//         incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
//       } else if (formData.date_resolution) {
//         incidentData.date_resolution = `${formData.date_resolution}T00:00`;
//       }

//       // Lien avec alerte
//       if (formData.alerte_source > 0) {
//         incidentData.alerte_source = formData.alerte_source;
//         incidentData.alerte_id = formData.alerte_source;
//       }

//       // Ajouter les détails du matériel pour l'affichage
//       if (selectedMaterielDetails) {
//         incidentData.materiel_details = {
//           id: selectedMaterielDetails.id,
//           nom: selectedMaterielDetails.nom,
//           reference: selectedMaterielDetails.reference,
//           type_materiel: selectedMaterielDetails.type,
//           etat: selectedMaterielDetails.etat,
//           service_attribue: selectedMaterielDetails.service_attribue,
//           utilisateur_attribue: selectedMaterielDetails.utilisateur_attribue
//         };
//       }

//       console.log('📤 Soumission incident avec matériel:', {
//         ...incidentData,
//         materiel_nom: selectedMaterielDetails?.nom
//       });
      
//       await onSubmit(incidentData);
//       onClose();
      
//     } catch (error: any) {
//       console.error('❌ Erreur soumission:', error);
//       setApiErrors(prev => [...prev, handleApiError(error)]);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     if (isSubmitting) return;
//     resetForm();
//     onClose();
//   };

//   // Obtenir le titre
//   const getFormTitle = () => {
//     if (incident) return 'Modifier l\'incident';
    
//     switch (mode) {
//       case 'fromAlerte': return '🚨 Créer Incident depuis Alerte';
//       case 'fromMateriel': return '🖥️ Créer Incident pour Matériel';
//       default: return '➕ Nouvel Incident Matériel';
//     }
//   };

//   // Obtenir l'icône du matériel
//   const getMaterielIcon = (type?: string) => {
//     if (!type) return <Monitor className="h-4 w-4" />;
    
//     const typeLower = type.toLowerCase();
//     if (typeLower.includes('ordinateur') || typeLower.includes('pc') || typeLower.includes('laptop')) 
//       return <Monitor className="h-4 w-4" />;
//     if (typeLower.includes('serveur')) return <HardDrive className="h-4 w-4" />;
//     if (typeLower.includes('imprimante') || typeLower.includes('printer')) 
//       return <Printer className="h-4 w-4" />;
//     if (typeLower.includes('réseau') || typeLower.includes('switch') || typeLower.includes('routeur')) 
//       return <Network className="h-4 w-4" />;
//     return <Monitor className="h-4 w-4" />;
//   };

//   // Composant d'icône
//   const Printer = ({ className }: { className: string }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//     </svg>
//   );

//   const Network = ({ className }: { className: string }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
//     </svg>
//   );

//   const filteredMateriels = getFilteredMateriels();
//   const filteredAlertesList = getFilteredAlertes();

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
//           <div className="flex items-center gap-3">
//             {mode === 'fromAlerte' ? (
//               <AlertTriangle className="h-5 w-5 text-error" />
//             ) : mode === 'fromMateriel' ? (
//               <Cpu className="h-5 w-5 text-warning" />
//             ) : (
//               <Wrench className="h-5 w-5 text-primary" />
//             )}
//             <div>
//               <h2 className="text-xl font-bold text-base-content">
//                 {getFormTitle()}
//               </h2>
//               <p className="text-sm text-base-content opacity-60 mt-1">
//                 Matériel: {selectedMaterielDetails?.nom || 'Non sélectionné'}
//               </p>
//             </div>
//           </div>
//           <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Messages d'erreur */}
//         {apiErrors.length > 0 && (
//           <div className="m-4">
//             <div className="alert alert-error">
//               <AlertCircle className="h-5 w-5" />
//               <div className="flex flex-col gap-1">
//                 {apiErrors.map((error, index) => (
//                   <span key={index} className="text-sm">{error}</span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center p-12">
//             <div className="flex flex-col items-center gap-4">
//               <Loader2 className="h-8 w-8 text-primary animate-spin" />
//               <span className="text-base-content">Chargement...</span>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* Indicateur de scénario */}
//             {mode === 'fromAlerte' && alerteSource && (
//               <div className="alert alert-error">
//                 <div className="flex items-center gap-3">
//                   <AlertTriangle className="h-5 w-5" />
//                   <div>
//                     <p className="font-bold">SCÉNARIO 2 : Incident depuis alerte critique</p>
//                     <p className="text-sm mt-1">{alerteSource.description}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Sélection d'alerte (si mode normal et des alertes sont disponibles) */}
//             {mode === 'normal' && filteredAlertesList.length > 0 && (
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Créer depuis une alerte (optionnel)</span>
//                 </label>
//                 <div className="space-y-2">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                     <input
//                       type="text"
//                       placeholder="Rechercher une alerte..."
//                       className="input input-bordered w-full pl-10"
//                       value={searchAlerte}
//                       onChange={(e) => setSearchAlerte(e.target.value)}
//                     />
//                   </div>
//                   <select
//                     value={formData.alerte_source}
//                     onChange={(e) => handleAlerteChange(parseInt(e.target.value))}
//                     className="select select-bordered w-full"
//                     disabled={isSubmitting}
//                   >
//                     <option value={0}>Sélectionnez une alerte critique</option>
//                     {filteredAlertesList.map(alerte => (
//                       <option key={alerte.id} value={alerte.id}>
//                         🚨 Alerte #{alerte.id}: {alerte.description.substring(0, 50)}...
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* Sélection du matériel */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">
//                   Matériel concerné 
//                   <span className="text-error ml-1">*</span>
//                 </span>
//                 {materielsEnPanne.length > 0 && (
//                   <span className="label-text-alt text-success">
//                     ✅ {materielsEnPanne.length} matériel(s) en panne disponible(s)
//                   </span>
//                 )}
//               </label>
              
//               <div className="space-y-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                   <input
//                     type="text"
//                     placeholder="Rechercher un matériel..."
//                     className="input input-bordered w-full pl-10"
//                     value={searchMateriel}
//                     onChange={(e) => setSearchMateriel(e.target.value)}
//                     disabled={isSubmitting}
//                   />
//                 </div>
                
//                 <select
//                   value={formData.materiel}
//                   onChange={(e) => handleMaterielChange(parseInt(e.target.value))}
//                   className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
//                   disabled={isSubmitting}
//                 >
//                   <option value={0}>Sélectionnez un matériel</option>
//                   {filteredMateriels.map(item => (
//                     <option key={item.id} value={item.id}>
//                       {getMaterielIcon(item.type)}
//                       {' '}
//                       {item.nom} ({item.reference}) - {item.service_attribue || 'Non spécifié'}
//                       {isMaterielEnPanne(item) && ' 🚨'}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
//               </div>
//             </div>

//             {/* Aperçu du matériel sélectionné */}
//             {selectedMaterielDetails && (
//               <div className="p-4 bg-base-200 rounded-lg border border-primary/20">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-3">
//                     {getMaterielIcon(selectedMaterielDetails.type)}
//                     <div>
//                       <h4 className="font-bold text-base-content">
//                         {selectedMaterielDetails.nom}
//                       </h4>
//                       <p className="text-sm text-base-content opacity-70">
//                         Référence: {selectedMaterielDetails.reference}
//                       </p>
//                     </div>
//                   </div>
//                   <span className={`badge ${
//                     isMaterielEnPanne(selectedMaterielDetails) ? 'badge-error' : 'badge-info'
//                   }`}>
//                     {selectedMaterielDetails.etat || 'État inconnu'}
//                     {isMaterielEnPanne(selectedMaterielDetails) && ' 🚨'}
//                   </span>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <span className="opacity-70">Type:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.type || 'Non spécifié'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Service:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.service_attribue || 'Non spécifié'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Utilisateur:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.utilisateur_attribue || 'Non attribué'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="opacity-70">Emplacement:</span>
//                     <span className="font-medium ml-2">
//                       {selectedMaterielDetails.emplacement || 'Non spécifié'}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="mt-3 text-xs text-base-content opacity-60">
//                   Ce nom sera automatiquement récupéré dans le tableau des incidents
//                 </div>
//               </div>
//             )}

//             {/* Description */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Description :</span>
//                 <span className="label-text-alt text-error">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
//                 placeholder="Décrivez le problème..."
//                 disabled={isSubmitting}
//               />
//               <div className="flex justify-between mt-1">
//                 {errors.description && (
//                   <span className="label-text-alt text-error">{errors.description}</span>
//                 )}
//                 <button
//                   type="button"
//                   onClick={handleRegenerateDescription}
//                   className="btn btn-xs btn-outline"
//                   disabled={!formData.materiel || isSubmitting}
//                 >
//                   Générer automatiquement
//                 </button>
//               </div>
//             </div>

//             {/* Priorité et Statut */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Priorité :</span>
//                 </label>
//                 <select
//                   name="priorite"
//                   value={formData.priorite}
//                   onChange={handleChange}
//                   className="select select-bordered w-full"
//                   disabled={isSubmitting || formData.alerte_source > 0}
//                 >
//                   <option value="basse">Basse</option>
//                   <option value="moyenne">Moyenne</option>
//                   <option value="elevee">Élevée</option>
//                   <option value="critique">Critique</option>
//                 </select>
//                 {formData.alerte_source > 0 && (
//                   <div className="text-xs text-error mt-1">⚠️ Priorité fixée à "Critique" pour alerte critique</div>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Statut :</span>
//                 </label>
//                 <select
//                   name="statut"
//                   value={formData.statut}
//                   onChange={handleChange}
//                   className="select select-bordered w-full"
//                   disabled={isSubmitting}
//                 >
//                   <option value="ouvert">Ouvert</option>
//                   <option value="en_cours">En cours</option>
//                   <option value="resolu">Résolu</option>
//                   <option value="ferme">Fermé</option>
//                 </select>
//               </div>
//             </div>

//             {/* Date et Heure */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Date de création :</span>
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <div className="relative flex-1">
//                     <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                     <input
//                       type="date"
//                       name="date_resolution"
//                       value={formData.date_resolution}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10"
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleSetToday}
//                     className="btn btn-outline btn-sm"
//                     disabled={isSubmitting}
//                   >
//                     Aujourd'hui
//                   </button>
//                 </div>
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Heure :</span>
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <div className="relative flex-1">
//                     <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                     <input
//                       type="time"
//                       name="heure_resolution"
//                       value={formData.heure_resolution}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10"
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleSetNow}
//                     className="btn btn-outline btn-sm"
//                     disabled={isSubmitting}
//                   >
//                     Maintenant
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Type d'incident (caché mais toujours matériel) */}
//             <input type="hidden" name="type_incident" value="materiel" />

//             {/* Boutons */}
//             <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
//               <button 
//                 type="button" 
//                 onClick={handleClose} 
//                 className="btn btn-ghost"
//                 disabled={isSubmitting}
//               >
//                 Annuler
//               </button>
//               <button 
//                 type="submit" 
//                 className={`btn ${formData.alerte_source > 0 ? 'btn-error' : 'btn-primary'}`}
//                 disabled={isSubmitting || !formData.materiel}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     {incident ? 'Modification...' : 'Création...'}
//                   </span>
//                 ) : (
//                   incident ? 'Modifier l\'incident' : 'Créer l\'incident'
//                 )}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IncidentForm;






// IncidentForm.tsx - Version corrigée avec récupération automatique du nom du matériel
import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, User, AlertCircle, Loader2, AlertTriangle, Wrench, Info, Cpu, Monitor, HardDrive, Search } from 'lucide-react';
import { Incident, User as UserType, Materiel, Alerte } from '../types';
import { materielsAPI, handleApiError } from '../services/api';

interface IncidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incidentData: any) => void;
  incident?: Incident;
  currentUser: UserType;
  alerteSource?: Alerte;
  materielSource?: Materiel;
  alertes?: Alerte[];        // Ajouté pour la sélection d'alertes
  materiels?: Materiel[];    // Ajouté pour la sélection de matériels
}

// Fonction pour extraire les données de la réponse API
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

// Fonction pour vérifier si un matériel est en panne
const isMaterielEnPanne = (materiel: any): boolean => {
  if (!materiel) return false;
  
  const etat = (materiel.etat || '').toLowerCase().trim();
  const statut = (materiel.statut || '').toLowerCase().trim();
  
  const etatsPanne = [
    'en_panne',
    'en panne',
    'panne',
    'broken',
    'out of order',
    'hors service',
    'defective',
    'faulty',
    'défectueux',
    'ne fonctionne pas'
  ];
  
  return etatsPanne.some(panneEtat => 
    etat.includes(panneEtat) || statut.includes(panneEtat)
  );
};

const IncidentForm: React.FC<IncidentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  incident,
  currentUser,
  alerteSource,
  materielSource,
  alertes = [],
  materiels = []
}) => {
  // Déterminer automatiquement le mode
  const getMode = () => {
    if (alerteSource) return 'fromAlerte';
    if (materielSource) return 'fromMateriel';
    return 'normal';
  };

  // États du formulaire
  const [formData, setFormData] = useState({
    description: '',
    date_resolution: '',
    heure_resolution: '',
    priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
    statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
    materiel: 0,
    alerte_source: 0,
    source: 'manuel' as 'manuel' | 'dashboard' | 'alerte' | 'automatique',
    type_incident: 'materiel' as 'materiel' | 'logiciel' | 'reseau' | 'mixte'
  });

  // États pour les données
  const [allMateriels, setAllMateriels] = useState<Materiel[]>([]);
  const [materielsEnPanne, setMaterielsEnPanne] = useState<Materiel[]>([]);
  const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [selectedMaterielDetails, setSelectedMaterielDetails] = useState<Materiel | null>(null);
  const [selectedAlerteDetails, setSelectedAlerteDetails] = useState<Alerte | null>(null);
  
  // Filtres de recherche
  const [searchMateriel, setSearchMateriel] = useState('');
  const [searchAlerte, setSearchAlerte] = useState('');
  
  // Références
  const dataLoadedRef = useRef(false);
  const isOpenRef = useRef(false);
  const mode = getMode();

  // Fonction pour générer une description automatique
  const generateDescriptionFromMateriel = (materiel: Materiel | null | undefined): string => {
    if (!materiel) return '';
    
    const nom = materiel.nom || materiel.reference || `Matériel #${materiel.id}`;
    const etat = materiel.etat || 'en panne';
    const service = materiel.service_attribue || 'Non spécifié';
    
    const isPanne = isMaterielEnPanne(materiel);
    
    // Détecter le type de problème
    let typeProbleme = 'Problème';
    if (etat.toLowerCase().includes('écran')) typeProbleme = 'Problème d\'écran';
    else if (etat.toLowerCase().includes('clavier')) typeProbleme = 'Problème de clavier';
    else if (etat.toLowerCase().includes('souris')) typeProbleme = 'Problème de souris';
    else if (etat.toLowerCase().includes('réseau')) typeProbleme = 'Problème réseau';
    else if (etat.toLowerCase().includes('batterie')) typeProbleme = 'Problème de batterie';
    else if (etat.toLowerCase().includes('alimentation')) typeProbleme = 'Problème d\'alimentation';
    
    const emplacement = materiel.emplacement || 'Local inconnu';
    
    if (mode === 'fromAlerte' && selectedAlerteDetails) {
      return `🚨 INCIDENT CRITIQUE - ${selectedAlerteDetails.description}`;
    }
    
    if (mode === 'fromMateriel') {
      return `${isPanne ? '🚨 ' : ''}${typeProbleme} sur ${nom} (${service}). État: ${etat}. Localisation: ${emplacement}.`;
    }
    
    if (isPanne) {
      return `🚨 PANNE MATÉRIEL - ${nom} est ${etat}. Service: ${service}. Localisation: ${emplacement}. Nécessite intervention.`;
    }
    
    return `Incident sur ${nom}. Service: ${service}. État: ${etat}. Localisation: ${emplacement}.`;
  };

  // Charger tous les matériels
  const fetchAllMateriels = async () => {
    try {
      console.log('🔄 Chargement de tous les matériels...');
      const response = await materielsAPI.getAll();
      const allMateriels = extractDataFromResponse(response);
      
      // Filtrer les matériels en panne
      const materielsPanne = allMateriels.filter(materiel => 
        isMaterielEnPanne(materiel)
      );
      
      console.log(`✅ ${allMateriels.length} matériels chargés, ${materielsPanne.length} en panne`);
      setAllMateriels(allMateriels);
      setMaterielsEnPanne(materielsPanne);
      
      // Si nous avons des matériels passés en props, les ajouter
      if (materiels.length > 0) {
        setAllMateriels(prev => {
          const uniqueMateriels = [...prev];
          materiels.forEach(materiel => {
            if (!uniqueMateriels.some(m => m.id === materiel.id)) {
              uniqueMateriels.push(materiel);
            }
          });
          return uniqueMateriels;
        });
      }
      
    } catch (error: any) {
      console.error('❌ Erreur chargement matériels:', error);
      setApiErrors(prev => [...prev, 'Impossible de charger les matériels']);
    }
  };

  // Initialiser les alertes
  const initializeAlertes = () => {
    // Filtrer les alertes critiques et nouvelles/en traitement
    const alertesFiltrees = alertes.filter(alerte => 
      alerte.severite === 'critique' && 
      (alerte.statut === 'nouvelle' || alerte.statut === 'en_traitement')
    );
    
    setFilteredAlertes(alertesFiltrees);
    console.log(`✅ ${alertesFiltrees.length} alertes critiques disponibles`);
  };

  // Initialiser le formulaire selon le scénario
  const initializeForm = () => {
    console.log(`🎯 Initialisation - Mode: ${mode}`);
    
    let initialSource: 'manuel' | 'dashboard' | 'alerte' | 'automatique' = 'manuel';
    let initialMaterielId = 0;
    let initialAlerteId = 0;
    let initialDescription = '';
    let initialPriorite: 'critique' | 'elevee' | 'moyenne' | 'basse' = 'moyenne';
    let initialStatut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme' = 'ouvert';

    // SCÉNARIO 2 : Depuis alerte
    if (mode === 'fromAlerte' && alerteSource) {
      console.log('🚨 SCÉNARIO 2 : Depuis alerte critique');
      
      // Vérifications
      if (alerteSource.severite !== 'critique') {
        setApiErrors(prev => [...prev, 'Seules les alertes critiques peuvent créer des incidents']);
        return;
      }
      
      if (alerteSource.statut !== 'nouvelle' && alerteSource.statut !== 'en_traitement') {
        setApiErrors(prev => [...prev, 'Seules les alertes "nouvelle" ou "en_traitement" peuvent créer des incidents']);
        return;
      }
      
      initialSource = 'alerte';
      initialAlerteId = alerteSource.id || 0;
      initialMaterielId = alerteSource.materiel_id || 0;
      initialPriorite = 'critique';
      initialStatut = alerteSource.statut === 'en_traitement' ? 'en_cours' : 'ouvert';
      initialDescription = `🚨 INCIDENT CRITIQUE - ${alerteSource.description}`;
      
      setSelectedAlerteDetails(alerteSource);
    }
    
    // SCÉNARIO 3 : Depuis matériel
    else if (mode === 'fromMateriel' && materielSource) {
      console.log('🖥️ SCÉNARIO 3 : Depuis matériel');
      
      initialSource = 'dashboard';
      initialMaterielId = materielSource.id || 0;
      initialDescription = generateDescriptionFromMateriel(materielSource);
      initialPriorite = isMaterielEnPanne(materielSource) ? 'critique' : 'moyenne';
      initialStatut = 'ouvert';
      
      setSelectedMaterielDetails(materielSource);
    }
    
    // SCÉNARIO 1 : Édition
    else if (incident) {
      console.log('📝 Mode édition');
      
      initialMaterielId = incident.materiel || 0;
      initialAlerteId = incident.alerte_id || 0;
      initialDescription = incident.description || '';
      initialPriorite = incident.priorite || 'moyenne';
      initialStatut = incident.statut || 'ouvert';
      initialSource = incident.source as any || 'manuel';
    }

    setFormData({
      description: initialDescription,
      date_resolution: new Date().toISOString().split('T')[0],
      heure_resolution: new Date().toTimeString().slice(0, 5),
      priorite: initialPriorite,
      statut: initialStatut,
      materiel: initialMaterielId,
      alerte_source: initialAlerteId,
      source: initialSource,
      type_incident: 'materiel'
    });
    
    // Mettre à jour les détails du matériel si nécessaire
    if (initialMaterielId > 0) {
      updateSelectedMaterielDetails(initialMaterielId);
    }
    
    // Mettre à jour les détails de l'alerte si nécessaire
    if (initialAlerteId > 0) {
      updateSelectedAlerteDetails(initialAlerteId);
    }
  };

  // Mettre à jour les détails du matériel sélectionné
  const updateSelectedMaterielDetails = (materielId: number) => {
    if (materielId === 0) {
      setSelectedMaterielDetails(null);
      return;
    }
    
    // Chercher d'abord dans les matériels en panne
    const foundMateriel = materielsEnPanne.find(m => m.id === materielId);
    if (foundMateriel) {
      setSelectedMaterielDetails(foundMateriel);
      return;
    }
    
    // Sinon chercher dans tous les matériels
    const foundInAll = allMateriels.find(m => m.id === materielId);
    if (foundInAll) {
      setSelectedMaterielDetails(foundInAll);
    } else {
      setSelectedMaterielDetails(null);
    }
  };

  // Mettre à jour les détails de l'alerte sélectionnée
  const updateSelectedAlerteDetails = (alerteId: number) => {
    if (alerteId === 0) {
      setSelectedAlerteDetails(null);
      return;
    }
    
    const foundAlerte = filteredAlertes.find(a => a.id === alerteId);
    if (foundAlerte) {
      setSelectedAlerteDetails(foundAlerte);
      
      // Si l'alerte a un matériel associé, le sélectionner automatiquement
      if (foundAlerte.materiel_id && formData.materiel === 0) {
        setFormData(prev => ({
          ...prev,
          materiel: foundAlerte.materiel_id
        }));
        updateSelectedMaterielDetails(foundAlerte.materiel_id);
      }
    } else {
      setSelectedAlerteDetails(null);
    }
  };

  // Filtrer les matériels par recherche
  const getFilteredMateriels = () => {
    let filtered = materielsEnPanne.length > 0 ? materielsEnPanne : allMateriels;
    
    if (searchMateriel) {
      const searchLower = searchMateriel.toLowerCase();
      filtered = filtered.filter(materiel => 
        (materiel.nom?.toLowerCase() || '').includes(searchLower) ||
        (materiel.reference?.toLowerCase() || '').includes(searchLower) ||
        (materiel.service_attribue?.toLowerCase() || '').includes(searchLower)
      );
    }
    
    return filtered;
  };

  // Filtrer les alertes par recherche
  const getFilteredAlertes = () => {
    let filtered = filteredAlertes;
    
    if (searchAlerte) {
      const searchLower = searchAlerte.toLowerCase();
      filtered = filtered.filter(alerte => 
        (alerte.description?.toLowerCase() || '').includes(searchLower)
      );
    }
    
    return filtered;
  };

  // Charger les données
  const loadData = async () => {
    if (dataLoadedRef.current || !isOpen) return;
    
    setLoading(true);
    setApiErrors([]);
    dataLoadedRef.current = true;
    
    try {
      // Charger les matériels
      await fetchAllMateriels();
      
      // Initialiser les alertes
      initializeAlertes();
      
      // Initialiser le formulaire
      initializeForm();
      
    } catch (error) {
      console.error('💥 Erreur chargement:', error);
      setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
    } finally {
      setLoading(false);
    }
  };

  // Effets
  useEffect(() => {
    if (isOpen && !isOpenRef.current) {
      isOpenRef.current = true;
      dataLoadedRef.current = false;
      loadData();
    }
    
    if (!isOpen) {
      isOpenRef.current = false;
      dataLoadedRef.current = false;
    }
  }, [isOpen]);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      description: '',
      date_resolution: '',
      heure_resolution: '',
      priorite: 'moyenne',
      statut: 'ouvert',
      materiel: 0,
      alerte_source: 0,
      source: 'manuel',
      type_incident: 'materiel'
    });
    setErrors({});
    setApiErrors([]);
    setAllMateriels([]);
    setMaterielsEnPanne([]);
    setFilteredAlertes([]);
    setSelectedMaterielDetails(null);
    setSelectedAlerteDetails(null);
    setSearchMateriel('');
    setSearchAlerte('');
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description requise';
    }
    
    if (formData.materiel === 0) {
      newErrors.materiel = 'Matériel concerné requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
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

  const handleMaterielChange = (materielId: number) => {
    setFormData(prev => ({
      ...prev,
      materiel: materielId
    }));
    
    updateSelectedMaterielDetails(materielId);
    
    // Générer une description automatique
    if (materielId > 0 && selectedMaterielDetails) {
      const newDescription = generateDescriptionFromMateriel(selectedMaterielDetails);
      setFormData(prev => ({
        ...prev,
        description: newDescription
      }));
    }
    
    if (errors.materiel) {
      setErrors(prev => ({ ...prev, materiel: '' }));
    }
  };

  const handleAlerteChange = (alerteId: number) => {
    setFormData(prev => ({
      ...prev,
      alerte_source: alerteId,
      source: 'alerte',
      priorite: 'critique'
    }));
    
    updateSelectedAlerteDetails(alerteId);
    
    // Générer une description automatique depuis l'alerte
    if (alerteId > 0 && selectedAlerteDetails) {
      const newDescription = `🚨 INCIDENT CRITIQUE - ${selectedAlerteDetails.description}`;
      setFormData(prev => ({
        ...prev,
        description: newDescription
      }));
    }
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date_resolution: today }));
  };

  const handleSetNow = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    setFormData(prev => ({ ...prev, heure_resolution: currentTime }));
  };

  const handleRegenerateDescription = () => {
    if (selectedMaterielDetails) {
      const newDescription = generateDescriptionFromMateriel(selectedMaterielDetails);
      setFormData(prev => ({
        ...prev,
        description: newDescription
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setApiErrors([]);

    try {
      const incidentData: any = { 
        description: formData.description.trim(),
        priorite: formData.priorite,
        statut: formData.statut,
        type_incident: formData.type_incident,
        utilisateur_signaleur: currentUser?.id || 0,
        materiel: formData.materiel,
        source: formData.source,
        materiel_nom: selectedMaterielDetails?.nom || 'Matériel non spécifié' // IMPORTANT: Récupérer le nom pour l'affichage
      };

      // Date de résolution
      if (formData.date_resolution && formData.heure_resolution) {
        incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
      } else if (formData.date_resolution) {
        incidentData.date_resolution = `${formData.date_resolution}T00:00`;
      }

      // Lien avec alerte
      if (formData.alerte_source > 0) {
        incidentData.alerte_source = formData.alerte_source;
        incidentData.alerte_id = formData.alerte_source;
      }

      // Ajouter les détails du matériel pour l'affichage
      if (selectedMaterielDetails) {
        incidentData.materiel_details = {
          id: selectedMaterielDetails.id,
          nom: selectedMaterielDetails.nom,
          reference: selectedMaterielDetails.reference,
          type_materiel: selectedMaterielDetails.type,
          etat: selectedMaterielDetails.etat,
          service_attribue: selectedMaterielDetails.service_attribue,
          utilisateur_attribue: selectedMaterielDetails.utilisateur_attribue
        };
      }

      console.log('📤 Soumission incident avec matériel:', {
        ...incidentData,
        materiel_nom: selectedMaterielDetails?.nom
      });
      
      await onSubmit(incidentData);
      onClose();
      
    } catch (error: any) {
      console.error('❌ Erreur soumission:', error);
      setApiErrors(prev => [...prev, handleApiError(error)]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  // Obtenir le titre
  const getFormTitle = () => {
    if (incident) return 'Modifier l\'incident';
    
    switch (mode) {
      case 'fromAlerte': return '🚨 Créer Incident depuis Alerte';
      case 'fromMateriel': return '🖥️ Créer Incident pour Matériel';
      default: return '➕ Nouvel Incident Matériel';
    }
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

  // Composant d'icône
  const Printer = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  );

  const Network = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  );

  const filteredMateriels = getFilteredMateriels();
  const filteredAlertesList = getFilteredAlertes();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
          <div className="flex items-center gap-3">
            {mode === 'fromAlerte' ? (
              <AlertTriangle className="h-5 w-5 text-error" />
            ) : mode === 'fromMateriel' ? (
              <Cpu className="h-5 w-5 text-warning" />
            ) : (
              <Wrench className="h-5 w-5 text-primary" />
            )}
            <div>
              <h2 className="text-xl font-bold text-base-content">
                {getFormTitle()}
              </h2>
              <p className="text-sm text-base-content opacity-60 mt-1">
                Matériel: {selectedMaterielDetails?.nom || 'Non sélectionné'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages d'erreur */}
        {apiErrors.length > 0 && (
          <div className="m-4">
            <div className="alert alert-error">
              <AlertCircle className="h-5 w-5" />
              <div className="flex flex-col gap-1">
                {apiErrors.map((error, index) => (
                  <span key={index} className="text-sm">{error}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-base-content">Chargement...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Indicateur de scénario */}
            {mode === 'fromAlerte' && alerteSource && (
              <div className="alert alert-error">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <p className="font-bold">SCÉNARIO 2 : Incident depuis alerte critique</p>
                    <p className="text-sm mt-1">{alerteSource.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sélection d'alerte (si mode normal et des alertes sont disponibles) */}
            {mode === 'normal' && filteredAlertesList.length > 0 && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Créer depuis une alerte (optionnel)</span>
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                    <input
                      type="text"
                      placeholder="Rechercher une alerte..."
                      className="input input-bordered w-full pl-10"
                      value={searchAlerte}
                      onChange={(e) => setSearchAlerte(e.target.value)}
                    />
                  </div>
                  <select
                    value={formData.alerte_source}
                    onChange={(e) => handleAlerteChange(parseInt(e.target.value))}
                    className="select select-bordered w-full"
                    disabled={isSubmitting}
                  >
                    <option value={0}>Sélectionnez une alerte critique</option>
                    {filteredAlertesList.map(alerte => (
                      <option key={alerte.id} value={alerte.id}>
                        🚨 Alerte #{alerte.id}: {alerte.description.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Sélection du matériel */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Matériel concerné 
                  <span className="text-error ml-1">*</span>
                </span>
                {materielsEnPanne.length > 0 && (
                  <span className="label-text-alt text-success">
                    ✅ {materielsEnPanne.length} matériel(s) en panne disponible(s)
                  </span>
                )}
              </label>
              
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                  <input
                    type="text"
                    placeholder="Rechercher un matériel..."
                    className="input input-bordered w-full pl-10"
                    value={searchMateriel}
                    onChange={(e) => setSearchMateriel(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                
                <select
                  value={formData.materiel}
                  onChange={(e) => handleMaterielChange(parseInt(e.target.value))}
                  className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value={0}>Sélectionnez un matériel</option>
                  {filteredMateriels.map(item => (
                    <option key={item.id} value={item.id}>
                      {getMaterielIcon(item.type)}
                      {' '}
                      {item.nom} ({item.reference}) - {item.service_attribue || 'Non spécifié'}
                      {isMaterielEnPanne(item) && ' 🚨'}
                    </option>
                  ))}
                </select>
                {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
              </div>
            </div>

            {/* Aperçu du matériel sélectionné */}
            {selectedMaterielDetails && (
              <div className="p-4 bg-base-200 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getMaterielIcon(selectedMaterielDetails.type)}
                    <div>
                      <h4 className="font-bold text-base-content">
                        {selectedMaterielDetails.nom}
                      </h4>
                      <p className="text-sm text-base-content opacity-70">
                        Référence: {selectedMaterielDetails.reference}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${
                    isMaterielEnPanne(selectedMaterielDetails) ? 'badge-error' : 'badge-info'
                  }`}>
                    {selectedMaterielDetails.etat || 'État inconnu'}
                    {isMaterielEnPanne(selectedMaterielDetails) && ' 🚨'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="opacity-70">Type:</span>
                    <span className="font-medium ml-2">
                      {selectedMaterielDetails.type || 'Non spécifié'}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-70">Service:</span>
                    <span className="font-medium ml-2">
                      {selectedMaterielDetails.service_attribue || 'Non spécifié'}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-70">Utilisateur:</span>
                    <span className="font-medium ml-2">
                      {selectedMaterielDetails.utilisateur_attribue || 'Non attribué'}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-70">Emplacement:</span>
                    <span className="font-medium ml-2">
                      {selectedMaterielDetails.emplacement || 'Non spécifié'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-base-content opacity-60">
                  Ce nom sera automatiquement récupéré dans le tableau des incidents
                </div>
              </div>
            )}

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
                placeholder="Décrivez le problème..."
                disabled={isSubmitting}
              />
              <div className="flex justify-between mt-1">
                {errors.description && (
                  <span className="label-text-alt text-error">{errors.description}</span>
                )}
                <button
                  type="button"
                  onClick={handleRegenerateDescription}
                  className="btn btn-xs btn-outline"
                  disabled={!formData.materiel || isSubmitting}
                >
                  Générer automatiquement
                </button>
              </div>
            </div>

            {/* Priorité et Statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Priorité :</span>
                </label>
                <select
                  name="priorite"
                  value={formData.priorite}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  disabled={isSubmitting || formData.alerte_source > 0}
                >
                  <option value="basse">Basse</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="elevee">Élevée</option>
                  <option value="critique">Critique</option>
                </select>
                {formData.alerte_source > 0 && (
                  <div className="text-xs text-error mt-1">⚠️ Priorité fixée à "Critique" pour alerte critique</div>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Statut :</span>
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  disabled={isSubmitting}
                >
                  <option value="ouvert">Ouvert</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolu">Résolu</option>
                  <option value="ferme">Fermé</option>
                </select>
              </div>
            </div>

            {/* Date et Heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Date de création :</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                    <input
                      type="date"
                      name="date_resolution"
                      value={formData.date_resolution}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSetToday}
                    className="btn btn-outline btn-sm"
                    disabled={isSubmitting}
                  >
                    Aujourd'hui
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Heure :</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                    <input
                      type="time"
                      name="heure_resolution"
                      value={formData.heure_resolution}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSetNow}
                    className="btn btn-outline btn-sm"
                    disabled={isSubmitting}
                  >
                    Maintenant
                  </button>
                </div>
              </div>
            </div>

            {/* Type d'incident (caché mais toujours matériel) */}
            <input type="hidden" name="type_incident" value="materiel" />

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-base-300">
              <button 
                type="button" 
                onClick={handleClose} 
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className={`btn ${formData.alerte_source > 0 ? 'btn-error' : 'btn-primary'}`}
                disabled={isSubmitting || !formData.materiel}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {incident ? 'Modification...' : 'Création...'}
                  </span>
                ) : (
                  incident ? 'Modifier l\'incident' : 'Créer l\'incident'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default IncidentForm;