// Incidents.tsx - Version complètement corrigée
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
  RefreshCw
} from 'lucide-react';
import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
import api, { incidentsAPI, usersAPI, materielsAPI, logicielsAPI, reseauAPI, handleApiError } from '../services/api';
import IncidentForm from '../components/IncidentForm';

// Type pour les incidents formatés avec propriétés d'affichage
interface FormattedIncident extends Omit<Incident, 'utilisateur_nom' | 'materiel_nom' | 'logiciel_nom'> {
  utilisateur_nom?: string;
  materiel_nom?: string;
  logiciel_nom?: string;
}

// Fonctions helper pour la sécurité des tableaux
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
  
  // Si response est déjà un tableau
  if (Array.isArray(response)) return response;
  
  // Si response a une propriété data
  if (response.data !== undefined) {
    // Cas 1: data est un tableau
    if (Array.isArray(response.data)) return response.data;
    
    // Cas 2: data a une propriété results (pagination Django REST)
    if (response.data.results && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    
    // Cas 3: data a une propriété data
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Cas 4: data est un objet unique
    if (typeof response.data === 'object' && !Array.isArray(response.data)) {
      return [response.data];
    }
  }
  
  // Si response a une propriété results directement
  if (response.results && Array.isArray(response.results)) {
    return response.results;
  }
  
  return [];
};

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<FormattedIncident[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
  const [reseaux, setReseaux] = useState<Reseau[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<FormattedIncident[]>([]);
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

  // Fonction pour formater le nom d'utilisateur
  const formatUserName = (user: any): string => {
    if (!user) return 'Utilisateur inconnu';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    if (user.username) {
      return user.username;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return `Utilisateur #${user.id || '?'}`;
  };

  // Fonction pour obtenir le nom d'un matériel
  const getMaterielName = (materiel: any): string => {
    if (!materiel) return '';
    return materiel.nom || materiel.reference || `Matériel #${materiel.id}`;
  };

  // Fonction pour obtenir le nom d'un logiciel
  const getLogicielName = (logiciel: any): string => {
    if (!logiciel) return '';
    return logiciel.nom || `Logiciel #${logiciel.id}`;
  };

  // Charger les incidents
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des incidents depuis API...');
      
      const response = await incidentsAPI.getAll();
      console.log('📥 Réponse incidentsAPI:', response);
      
      const extractedData = extractDataFromResponse(response);
      console.log(`✅ ${extractedData.length} incidents chargés`);
      
      // Formater les incidents pour avoir les bonnes propriétés
      const formattedIncidents: FormattedIncident[] = extractedData.map((incident: any) => ({
        id: incident.id || 0,
        description: incident.description || '',
        type_incident: incident.type_incident || 'materiel',
        priorite: incident.priorite || 'moyenne',
        statut: incident.statut || 'ouvert',
        date_creation: incident.date_creation || incident.created_at || new Date().toISOString(),
        date_resolution: incident.date_resolution || null,
        utilisateur_signaleur: incident.utilisateur_signaleur || incident.user || null,
        materiel: incident.materiel || null,
        logiciel: incident.logiciel || null,
        reseau: incident.reseau || null,
        
        // Champs pour l'affichage
        utilisateur_nom: incident.utilisateur_nom || 
                        formatUserName(incident.utilisateur_signaleur_details) ||
                        formatUserName(incident.user_details) ||
                        (incident.utilisateur_signaleur ? `Utilisateur #${incident.utilisateur_signaleur}` : 'Inconnu'),
        materiel_nom: incident.materiel_nom || 
                     getMaterielName(incident.materiel_details) ||
                     getMaterielName(incident.materiel) ||
                     undefined,
        logiciel_nom: incident.logiciel_nom || 
                     getLogicielName(incident.logiciel_details) ||
                     getLogicielName(incident.logiciel) ||
                     undefined
      }));
      
      setIncidents(formattedIncidents);
      setFilteredIncidents(formattedIncidents);
      setError('');
      
      if (formattedIncidents.length === 0) {
        showMessage('info', 'Aucun incident trouvé dans le système');
      }
      
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

  // Charger TOUS les utilisateurs depuis l'API - FONCTION CORRIGÉE
  const fetchAllUsers = async (): Promise<UserType[]> => {
    try {
      console.log('🔄 Chargement des utilisateurs depuis API...');
      
      const response = await usersAPI.getAll();
      console.log('📥 Réponse brute usersAPI:', response);
      
      // Gérer la réponse selon le format
      let usersData: any[] = [];
      
      if (typeof response === 'object' && response !== null) {
        // Vérifier si response a une propriété data
        if ('data' in response) {
          const responseData = (response as any).data;
          
          if (Array.isArray(responseData)) {
            usersData = responseData;
          } else if (responseData && typeof responseData === 'object') {
            // Si data a une propriété results
            if (responseData.results && Array.isArray(responseData.results)) {
              usersData = responseData.results;
            } 
            // Si data est un objet avec des clés
            else if (!Array.isArray(responseData)) {
              // Essayer d'extraire un tableau des valeurs
              const values = Object.values(responseData);
              if (values.length > 0 && values.every(v => typeof v === 'object')) {
                usersData = values as any[];
              }
            }
          }
        } 
        // Si response est déjà un tableau
        else if (Array.isArray(response)) {
          usersData = response;
        }
      }
      
      console.log(`✅ ${usersData.length} utilisateurs chargés depuis l'API`);
      
      // Formater les utilisateurs selon le type User
      const formattedUsers: UserType[] = usersData.map((user: any) => ({
        id: user.id || 0,
        username: user.username || `user_${user.id}`,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        is_active: user.is_active !== undefined ? user.is_active : true,
        date_joined: user.date_joined || new Date().toISOString(),
        role: user.role,
        departement: user.departement
      }));
      
      return formattedUsers;
      
    } catch (error: any) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      
      // Debug détaillé
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('Pas de réponse du serveur');
      } else {
        console.error('Erreur de configuration:', error.message);
      }
      
      // Retourner un tableau vide en cas d'erreur
      return [];
    }
  };

  // Charger les données liées (utilisateurs, matériels, etc.)
  const fetchRelatedData = async () => {
    try {
      console.log('🔄 Chargement des données liées depuis les APIs...');
      
      // Charger en parallèle toutes les données
      const [usersData, materielsRes, logicielsRes, reseauxRes] = await Promise.allSettled([
        fetchAllUsers(), // Utilise la fonction corrigée
        materielsAPI.getAll(),
        logicielsAPI.getAll(),
        reseauAPI.getAll()
      ]);
      
      // Traiter les utilisateurs
      let usersResult: UserType[] = [];
      if (usersData.status === 'fulfilled') {
        usersResult = usersData.value;
      } else {
        console.error('❌ Erreur chargement utilisateurs:', usersData.reason);
      }
      
      // Traiter les matériels
      let materielsData: Materiel[] = [];
      if (materielsRes.status === 'fulfilled') {
        materielsData = extractDataFromResponse(materielsRes.value);
        console.log(`✅ ${materielsData.length} matériels chargés`);
      }
      
      // Traiter les logiciels
      let logicielsData: Logiciel[] = [];
      if (logicielsRes.status === 'fulfilled') {
        logicielsData = extractDataFromResponse(logicielsRes.value);
        console.log(`✅ ${logicielsData.length} logiciels chargés`);
      }
      
      // Traiter les réseaux
      let reseauxData: Reseau[] = [];
      if (reseauxRes.status === 'fulfilled') {
        reseauxData = extractDataFromResponse(reseauxRes.value);
        console.log(`✅ ${reseauxData.length} réseaux chargés`);
      }
      
      console.log('📊 DONNÉES LIÉES chargées:', {
        utilisateurs: usersResult.length,
        matériels: materielsData.length,
        logiciels: logicielsData.length,
        réseaux: reseauxData.length
      });
      
      // Mettre à jour les états
      setUsers(usersResult);
      setMateriels(materielsData);
      setLogiciels(logicielsData);
      setReseaux(reseauxData);
      
      if (usersResult.length === 0) {
        console.warn('⚠️ Aucun utilisateur chargé depuis l\'API');
      }
      
    } catch (err: any) {
      console.error('❌ Erreur générale chargement données liées:', err);
    }
  };

  // Obtenir l'utilisateur courant
  const getCurrentUser = (): UserType => {
    try {
      const currentUserStr = localStorage.getItem('user') || localStorage.getItem('current_user');
      if (currentUserStr) {
        const user = JSON.parse(currentUserStr);
        return {
          id: user.id || 0,
          username: user.username || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          is_active: user.is_active || true,
          date_joined: user.date_joined || new Date().toISOString(),
          role: user.role,
          departement: user.departement
        };
      }
    } catch (e) {
      console.error('Erreur parsing current_user:', e);
    }
    
    // Utilisateur par défaut
    return {
      id: 0,
      username: 'admin',
      first_name: 'Admin',
      last_name: 'System',
      email: 'admin@example.com',
      is_active: true,
      date_joined: new Date().toISOString()
    };
  };

  // Effet pour charger les données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchIncidents();
      await fetchRelatedData();
    };
    
    loadInitialData();
  }, []);

  // Effet pour filtrer les incidents
  useEffect(() => {
    filterIncidents();
  }, [incidents, searchTerm, filterStatut, filterPriorite, filterType]);

  // Effet pour gérer la sélection "Tout sélectionner"
  useEffect(() => {
    if (filteredIncidents.length > 0 && selectedIncidents.length === filteredIncidents.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedIncidents, filteredIncidents]);

  // Fonction de filtrage
  const filterIncidents = () => {
    let filtered = safeArray<FormattedIncident>(incidents);

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = safeFilter<FormattedIncident>(filtered, incident => 
        (incident.description?.toLowerCase() || '').includes(searchLower) ||
        (incident.materiel_nom?.toLowerCase() || '').includes(searchLower) ||
        (incident.logiciel_nom?.toLowerCase() || '').includes(searchLower) ||
        (incident.utilisateur_nom?.toLowerCase() || '').includes(searchLower)
      );
    }

    if (filterStatut) {
      filtered = safeFilter<FormattedIncident>(filtered, incident => incident.statut === filterStatut);
    }

    if (filterPriorite) {
      filtered = safeFilter<FormattedIncident>(filtered, incident => incident.priorite === filterPriorite);
    }

    if (filterType) {
      filtered = safeFilter<FormattedIncident>(filtered, incident => incident.type_incident === filterType);
    }

    setFilteredIncidents(filtered);
    setSelectedIncidents([]);
  };

  // Afficher un message (type corrigé)
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (incidentData: any) => {
    try {
      console.log('📤 Soumission incident:', incidentData);
      
      // Formater les données pour l'API
      const formattedData: any = {
        description: incidentData.description,
        type_incident: incidentData.type_incident,
        priorite: incidentData.priorite,
        statut: incidentData.statut,
        utilisateur_signaleur: incidentData.utilisateur_signaleur
      };
      
      // Ajouter les dates si définies
      if (incidentData.date_creation) {
        formattedData.date_creation = incidentData.date_creation;
      }
      if (incidentData.date_resolution) {
        formattedData.date_resolution = incidentData.date_resolution;
      }
      
      // Ajouter les relations seulement si elles sont définies
      if (incidentData.materiel && incidentData.materiel > 0) {
        formattedData.materiel = incidentData.materiel;
      }
      if (incidentData.logiciel && incidentData.logiciel > 0) {
        formattedData.logiciel = incidentData.logiciel;
      }
      if (incidentData.reseau && incidentData.reseau > 0) {
        formattedData.reseau = incidentData.reseau;
      }
      
      console.log('📤 Données formatées pour API:', formattedData);
      
      if (editingIncident && editingIncident.id) {
        await incidentsAPI.update(editingIncident.id, formattedData);
        showMessage('success', 'Incident modifié avec succès');
      } else {
        await incidentsAPI.create(formattedData);
        showMessage('success', 'Incident créé avec succès');
      }
      
      // Recharger les données
      await fetchIncidents();
      setIsFormOpen(false);
      setEditingIncident(undefined);
      
    } catch (error: any) {
      console.error('❌ Erreur soumission incident:', error);
      const errorMsg = handleApiError(error);
      showMessage('error', errorMsg);
    }
  };

  // Gérer la sélection d'un incident
  const toggleSelectIncident = (id: number) => {
    setSelectedIncidents(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Gérer la sélection de tous les incidents
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

  // Supprimer les incidents sélectionnés
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
        
        showMessage('success', `${selectedIncidents.length} incident(s) supprimé(s) avec succès`);
        setSelectedIncidents([]);
        await fetchIncidents();
      } catch (error: any) {
        console.error('❌ Erreur suppression incidents:', error);
        showMessage('error', handleApiError(error));
      }
    }
  };

  // Éditer les incidents sélectionnés
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

  // Résoudre les incidents sélectionnés
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
      
      showMessage('success', `${selectedIncidents.length} incident(s) marqué(s) comme résolu(s)`);
      setSelectedIncidents([]);
      await fetchIncidents();
    } catch (error: any) {
      console.error('❌ Erreur résolution incidents:', error);
      showMessage('error', handleApiError(error));
    }
  };

  // Éditer un incident
  const handleEdit = (incident: FormattedIncident) => {
    console.log('✏️ Édition incident:', incident);
    setEditingIncident(incident);
    setIsFormOpen(true);
  };

  // Supprimer un incident
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
      try {
        await incidentsAPI.delete(id);
        showMessage('success', 'Incident supprimé avec succès');
        await fetchIncidents();
      } catch (error: any) {
        console.error('❌ Erreur suppression incident:', error);
        showMessage('error', handleApiError(error));
      }
    }
  };

  // Résoudre un incident
  const handleResoudre = async (id: number) => {
    try {
      await incidentsAPI.resoudre(id);
      showMessage('success', 'Incident marqué comme résolu');
      await fetchIncidents();
    } catch (error: any) {
      console.error('❌ Erreur résolution incident:', error);
      showMessage('error', handleApiError(error));
    }
  };

  // Ajouter un nouvel incident
  const handleAddNew = () => {
    setEditingIncident(undefined);
    setIsFormOpen(true);
  };

  // Rafraîchir les données
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchIncidents();
    showMessage('success', 'Données rafraîchies');
  };

  // Exporter les incidents
  const handleExport = () => {
    try {
      const dataToExport = filteredIncidents.map(i => ({
        ID: i.id,
        Description: i.description,
        Type: getTypeText(i.type_incident),
        Priorité: getPriorityText(i.priorite),
        Statut: getStatusText(i.statut),
        'Matériel concerné': i.materiel_nom || 'Non spécifié',
        'Logiciel concerné': i.logiciel_nom || 'Non spécifié',
        'Utilisateur signaleur': i.utilisateur_nom || 'Non spécifié',
        'Date création': i.date_creation ? new Date(i.date_creation).toLocaleDateString('fr-FR') : 'Non spécifiée',
        'Date résolution': i.date_resolution ? new Date(i.date_resolution).toLocaleDateString('fr-FR') : 'Non résolu'
      }));

      // Vérifier qu'il y a des données à exporter
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
    } catch (error) {
      console.error('❌ Erreur export:', error);
      showMessage('error', 'Erreur lors de l\'export');
    }
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatut('');
    setFilterPriorite('');
    setFilterType('');
    setSelectedIncidents([]);
  };

  // Fonctions utilitaires pour l'affichage
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ouvert': return <AlertTriangle className="w-4 h-4" />;
      case 'en_cours': return <Clock className="w-4 h-4" />;
      case 'resolu': return <CheckCircle className="w-4 h-4" />;
      case 'ferme': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Statistiques
  const stats = {
    total: safeArray<FormattedIncident>(incidents).length,
    ouvert: safeFilter<FormattedIncident>(incidents, i => i.statut === 'ouvert').length,
    en_cours: safeFilter<FormattedIncident>(incidents, i => i.statut === 'en_cours').length,
    resolu: safeFilter<FormattedIncident>(incidents, i => i.statut === 'resolu').length
  };

  if (loading && !refreshing) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des incidents...</p>
          <p className="text-sm text-base-content opacity-60">Connexion à l'API en cours</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Message de notification */}
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

      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Incidents</h1>
          <p className="text-base-content opacity-60 mt-1">
            Suivi et résolution des incidents techniques ({safeArray<FormattedIncident>(filteredIncidents).length} incidents)
            {selectedIncidents.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedIncidents.length} sélectionné(s))
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
      </div>

      {/* Filtres et recherche */}
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
                  placeholder="Description, matériel, logiciel..."
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

          {/* Actions de sélection */}
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
                  <th className="font-bold">Type</th>
                  <th className="font-bold">Priorité</th>
                  <th className="font-bold">Statut</th>
                  <th className="font-bold">Date création</th>
                  <th className="font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray<FormattedIncident>(filteredIncidents).map((incident) => (
                  <tr key={incident.id} className="hover">
                    <td className="text-center">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
                          checked={selectedIncidents.includes(incident.id || 0)}
                          onChange={() => toggleSelectIncident(incident.id || 0)}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="max-w-xs">
                        <div className="font-medium text-base-content line-clamp-2">
                          {incident.description}
                        </div>
                        {incident.materiel_nom && (
                          <div className="text-sm text-base-content opacity-70 mt-1">
                            📦 {incident.materiel_nom}
                          </div>
                        )}
                        {incident.logiciel_nom && (
                          <div className="text-sm text-base-content opacity-70">
                            💻 {incident.logiciel_nom}
                          </div>
                        )}
                        {incident.utilisateur_nom && (
                          <div className="text-sm text-base-content opacity-70">
                            👤 Signalé par: {incident.utilisateur_nom}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-medium capitalize">{getTypeText(incident.type_incident)}</span>
                    </td>
                    <td>
                      <div className={`badge ${getPriorityBadge(incident.priorite)} badge-lg`}>
                        {getPriorityText(incident.priorite)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(incident.statut)}
                        <div className={`badge ${getStatusBadge(incident.statut)}`}>
                          {getStatusText(incident.statut)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">
                        {incident.date_creation ? new Date(incident.date_creation).toLocaleDateString('fr-FR') : '-'}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center space-x-1">
                        <button
                          className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
                          title="Voir les détails"
                          onClick={() => {
                            showMessage('info', `Détails de l'incident #${incident.id}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
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
                ))}
              </tbody>
            </table>
          </div>

          {safeArray<FormattedIncident>(filteredIncidents).length === 0 && (
            <div className="text-center py-12">
              <div className="text-base-content opacity-40 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Aucun incident trouvé</p>
                <p className="text-sm mt-2">
                  {searchTerm || filterStatut || filterPriorite || filterType
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
        currentUser={users.length > 0 ? users[0] : getCurrentUser()}
      />
    </div>
  );
};

export default Incidents;