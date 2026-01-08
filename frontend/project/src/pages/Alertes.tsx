


import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Filter, Download, Edit, Trash2, Bell, AlertTriangle, Info, CheckCircle, CheckSquare, Square, X, BarChart3 } from 'lucide-react';
import { Alerte } from '../types';
import AlerteForm from '../components/AlerteForm';
import { 
  alertesAPI, 
  materielsAPI, 
  logicielsAPI, 
  reseauAPI, 
  incidentsAPI 
} from '../services/api';

// Fonctions helper pour la sécurité des tableaux
const safeArray = (data: any): Alerte[] => {
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): Alerte[] => {
  if (!Array.isArray(array)) return [];
  return array.filter(condition);
};

const extractDataFromResponse = (response: any): Alerte[] => {
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

// CORRECTION : Définir le type pour les messages
type MessageType = 'success' | 'error' | 'info' | 'warning';

const Alertes: React.FC = () => {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSeverite, setFilterSeverite] = useState<string>('');
  const [filterStatut, setFilterStatut] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
  const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

  // ÉTAT POUR LES DONNÉES DE RELATIONS
  const [materiels, setMateriels] = useState<any[]>([]);
  const [logiciels, setLogiciels] = useState<any[]>([]);
  const [reseaux, setReseaux] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

  // AJOUT : Statistiques
  const [statistiques, setStatistiques] = useState({
    total: 0,
    nouvelles: 0,
    enTraitement: 0,
    resolues: 0,
    critiques: 0,
    elevees: 0,
    moyennes: 0,
    basses: 0
  });

  // Charger les alertes
  const fetchAlertes = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Chargement des alertes...');
      
      const response = await alertesAPI.getAll();
      console.log('✅ Réponse alertes:', response);
      
      const extractedData = extractDataFromResponse(response);
      console.log('🚨 Alertes chargées:', extractedData);
      setAlertes(extractedData);
      
      // Calculer les statistiques
      calculerStatistiques(extractedData);
    } catch (err: any) {
      console.error('❌ Erreur chargement alertes:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Erreur lors du chargement des alertes';
      setError(errorMessage);
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // AJOUT : Fonction pour calculer les statistiques
  const calculerStatistiques = (data: Alerte[]) => {
    const stats = {
      total: data.length,
      nouvelles: data.filter(a => a.statut === 'nouvelle').length,
      enTraitement: data.filter(a => a.statut === 'en_traitement').length,
      resolues: data.filter(a => a.statut === 'resolue').length,
      critiques: data.filter(a => a.severite === 'critique').length,
      elevees: data.filter(a => a.severite === 'elevee').length,
      moyennes: data.filter(a => a.severite === 'moyenne').length,
      basses: data.filter(a => a.severite === 'basse').length
    };
    setStatistiques(stats);
  };

  // CORRECTION AMÉLIORÉE : CHARGER LES DONNÉES DE RELATIONS
  const fetchRelationsData = async () => {
    try {
      setLoadingRelations(true);
      console.log('🔄 Chargement des données de relations...');

      // Utiliser Promise.allSettled pour gérer les erreurs individuelles
      const [materielsResponse, logicielsResponse, reseauxResponse, incidentsResponse] = await Promise.allSettled([
        materielsAPI.getAll().catch(err => ({ data: [] })),
        logicielsAPI.getAll().catch(err => ({ data: [] })),
        reseauAPI.getAll().catch(err => ({ data: [] })),
        incidentsAPI.getAll().catch(err => ({ data: [] }))
      ]);

      // Extraire les données avec gestion d'erreur
      const materielsData = materielsResponse.status === 'fulfilled' 
        ? extractDataFromResponse(materielsResponse.value) 
        : [];
      
      const logicielsData = logicielsResponse.status === 'fulfilled' 
        ? extractDataFromResponse(logicielsResponse.value) 
        : [];
      
      const reseauxData = reseauxResponse.status === 'fulfilled' 
        ? extractDataFromResponse(reseauxResponse.value) 
        : [];
      
      const incidentsData = incidentsResponse.status === 'fulfilled' 
        ? extractDataFromResponse(incidentsResponse.value) 
        : [];

      console.log('✅ Données de relations chargées:', {
        materiels: materielsData.length,
        logiciels: logicielsData.length,
        reseaux: reseauxData.length,
        incidents: incidentsData.length
      });

      setMateriels(materielsData);
      setLogiciels(logicielsData);
      setReseaux(reseauxData);
      setIncidents(incidentsData);

      // Afficher un message si certaines données sont vides
      const totalData = materielsData.length + logicielsData.length + reseauxData.length + incidentsData.length;
      if (totalData === 0) {
        showMessage('warning', 'Aucune donnée de relation disponible. Vérifiez votre connexion.');
      }

    } catch (err: any) {
      console.error('❌ Erreur chargement relations:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Erreur lors du chargement des données';
      showMessage('error', errorMessage);
      
      // Initialiser avec des tableaux vides
      setMateriels([]);
      setLogiciels([]);
      setReseaux([]);
      setIncidents([]);
    } finally {
      setLoadingRelations(false);
    }
  };

  useEffect(() => {
    fetchAlertes();
    fetchRelationsData(); // Charger les données de relations au montage
  }, []);

  useEffect(() => {
    filterAlertes();
  }, [alertes, searchTerm, filterSeverite, filterStatut, filterType]);

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
      filtered = safeFilter(filtered, a => 
        a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.logiciel_nom && a.logiciel_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.reseau_nom && a.reseau_nom.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterSeverite) {
      filtered = safeFilter(filtered, a => a.severite === filterSeverite);
    }

    if (filterStatut) {
      filtered = safeFilter(filtered, a => a.statut === filterStatut);
    }

    if (filterType) {
      filtered = safeFilter(filtered, a => a.type_alerte === filterType);
    }

    setFilteredAlertes(filtered);
    setSelectedAlertes([]);
  };

  // CORRECTION : Fonction showMessage avec le type MessageType
  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (alerteData: any) => {
    try {
      console.log('📤 Soumission des données alerte:', alerteData);
      
      if (editingAlerte) {
        await alertesAPI.update(editingAlerte.id, alerteData);
        showMessage('success', 'Alerte modifiée avec succès');
      } else {
        await alertesAPI.create(alerteData);
        showMessage('success', 'Alerte créée avec succès');
      }
      
      // Recharger les données
      await fetchAlertes();
      setIsFormOpen(false);
      setEditingAlerte(undefined);
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde alerte:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erreur lors de la sauvegarde';
      showMessage('error', errorMessage);
    }
  };

  // CORRECTION : Fonctions handleAddNew et handleEdit améliorées
  const handleAddNew = () => {
    // Vérifier que les données de relations sont chargées
    if (loadingRelations) {
      showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
      return;
    }
    
    // CORRECTION : Vérifier si au moins une des sources est disponible
    const hasRelationsData = materiels.length > 0 || logiciels.length > 0 || reseaux.length > 0 || incidents.length > 0;
    
    if (!hasRelationsData) {
      showMessage('warning', 
        `Aucune donnée de relation disponible. 
        Matériels: ${materiels.length} | 
        Logiciels: ${logiciels.length} | 
        Réseaux: ${reseaux.length} | 
        Incidents: ${incidents.length}`
      );
      
      // Proposer de recharger
      if (confirm('Voulez-vous recharger les données ?')) {
        fetchRelationsData();
      }
      
      return;
    }

    console.log('✅ Données disponibles pour nouvelle alerte:', {
      materiels: materiels.length,
      logiciels: logiciels.length,
      reseaux: reseaux.length,
      incidents: incidents.length
    });

    setEditingAlerte(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (alerte: Alerte) => {
    if (loadingRelations) {
      showMessage('info', 'Chargement des données en cours...');
      return;
    }

    // CORRECTION : Même vérification pour l'édition
    const hasRelationsData = materiels.length > 0 || logiciels.length > 0 || reseaux.length > 0 || incidents.length > 0;
    
    if (!hasRelationsData) {
      showMessage('warning', 'Les données de relations ne sont pas disponibles. Impossible de modifier.');
      return;
    }

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
    } else {
      const allIds = filteredAlertes.map(a => a.id);
      setSelectedAlertes(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAlertes.length === 0) {
      showMessage('error', 'Aucune alerte sélectionnée');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedAlertes.length} alerte(s) ?`)) {
      try {
        for (const id of selectedAlertes) {
          await alertesAPI.delete(id);
        }
        
        showMessage('success', `${selectedAlertes.length} alerte(s) supprimée(s) avec succès`);
        setSelectedAlertes([]);
        fetchAlertes();
      } catch (error: any) {
        showMessage('error', 'Erreur lors de la suppression des alertes');
      }
    }
  };

  const handleEditSelected = () => {
    if (selectedAlertes.length === 0) {
      showMessage('error', 'Aucune alerte sélectionnée');
      return;
    }

    if (selectedAlertes.length === 1) {
      const alerte = alertes.find(a => a.id === selectedAlertes[0]);
      if (alerte) {
        handleEdit(alerte);
      }
    } else {
      showMessage('info', `Édition multiple de ${selectedAlertes.length} alertes`);
    }
  };

  // CORRECTION : Garder les fonctions Traiter et Résoudre pour les sélections
  const handleTraiterSelected = async () => {
    if (selectedAlertes.length === 0) {
      showMessage('error', 'Aucune alerte sélectionnée');
      return;
    }

    try {
      for (const id of selectedAlertes) {
        await alertesAPI.traiter(id);
      }
      
      showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme traitées`);
      setSelectedAlertes([]);
      fetchAlertes();
    } catch (error: any) {
      showMessage('error', 'Erreur lors du traitement des alertes');
    }
  };

  const handleResoudreSelected = async () => {
    if (selectedAlertes.length === 0) {
      showMessage('error', 'Aucune alerte sélectionnée');
      return;
    }

    try {
      for (const id of selectedAlertes) {
        await alertesAPI.update(id, { statut: 'resolue' });
      }
      
      showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme résolues`);
      setSelectedAlertes([]);
      fetchAlertes();
    } catch (error: any) {
      showMessage('error', 'Erreur lors de la résolution des alertes');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      try {
        await alertesAPI.delete(id);
        showMessage('success', 'Alerte supprimée avec succès');
        fetchAlertes();
      } catch (error: any) {
        showMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const handleTraiter = async (id: number) => {
    try {
      await alertesAPI.traiter(id);
      showMessage('success', 'Alerte marquée comme traitée');
      fetchAlertes();
    } catch (error: any) {
      showMessage('error', 'Erreur lors du traitement');
    }
  };

  const handleResoudre = async (id: number) => {
    try {
      await alertesAPI.update(id, { statut: 'resolue' });
      showMessage('success', 'Alerte marquée comme résolue');
      fetchAlertes();
    } catch (error: any) {
      showMessage('error', 'Erreur lors de la résolution');
    }
  };

  // Fonctions d'affichage
  const getSeveriteBadge = (severite: string) => {
    const badges = {
      critique: 'badge-error',
      elevee: 'badge-warning',
      moyenne: 'badge-info',
      basse: 'badge-neutral'
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

  const getSeveriteIcon = (severite: string) => {
    const icons = {
      critique: <AlertTriangle className="h-4 w-4" />,
      elevee: <AlertTriangle className="h-4 w-4" />,
      moyenne: <Bell className="h-4 w-4" />,
      basse: <Info className="h-4 w-4" />
    };
    return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      nouvelle: 'badge-error',
      en_traitement: 'badge-warning',
      resolue: 'badge-success'
    };
    return badges[statut as keyof typeof badges] || 'badge-neutral';
  };

  const getStatutText = (statut: string) => {
    const texts = {
      nouvelle: 'Nouvelle',
      en_traitement: 'En traitement',
      resolue: 'Résolue'
    };
    return texts[statut as keyof typeof texts] || statut;
  };

  const getTypeText = (type: string) => {
    const texts = {
      securite: 'Sécurité',
      performance: 'Performance',
      panne: 'Panne',
      maintenance: 'Maintenance'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterSeverite('');
    setFilterStatut('');
    setFilterType('');
    setSelectedAlertes([]);
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredAlertes.map(a => ({
        Type: getTypeText(a.type_alerte),
        Sévérité: getSeveriteText(a.severite),
        Statut: getStatutText(a.statut),
        Description: a.description,
        'Matériel source': a.materiel_nom || 'Non spécifié',
        'Logiciel source': a.logiciel_nom || 'Non spécifié',
        'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée'
      }));

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

      showMessage('success', 'Export CSV réussi !');
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'export');
    }
  };

  // Fonction pour obtenir la classe CSS du message
  const getAlertClass = (type: MessageType) => {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return 'alert-info';
    }
  };

  if (loading) {
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
      {/* Messages */}
      {message && (
        <div className={`alert ${getAlertClass(message.type)} mb-4`}>
          <span>{message.text}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button className="btn btn-ghost btn-sm" onClick={fetchAlertes}>
            Réessayer
          </button>
        </div>
      )}

      {/* CORRECTION : Messages d'information sur les données de relations */}
      {loadingRelations && (
        <div className="alert alert-info mb-4">
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            <span>Chargement des données de relations en cours...</span>
          </div>
        </div>
      )}

      {/* CORRECTION : Avertissement si pas de données de relations */}
      {!loadingRelations && materiels.length === 0 && logiciels.length === 0 && reseaux.length === 0 && (
        <div className="alert alert-warning mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span>⚠️ Aucune donnée de relation disponible. </span>
              <button 
                onClick={fetchRelationsData}
                className="btn btn-sm btn-outline ml-2"
              >
                Recharger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Alertes</h1>
          <p className="text-base-content opacity-60 mt-1">
            {filteredAlertes.length} alerte(s) trouvée(s)
            {loadingRelations && ' - Chargement des données...'}
            {/* CORRECTION : Afficher le statut des données de relations */}
            {!loadingRelations && (
              <span className="text-sm ml-2">
                (📦 {materiels.length} mat. | 💾 {logiciels.length} log. | 🌐 {reseaux.length} rés. | ⚠️ {incidents.length} inc.)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {/* SUPPRESSION : Bouton Actualiser retiré */}
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
            Nouvelle alerte
          </button>
        </div>
      </div>

      {/* AJOUT : Section Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {/* Carte Total */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4 text-center">
            <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="text-lg font-bold">{statistiques.total}</h3>
            <p className="text-sm opacity-60">Total</p>
          </div>
        </div>

        {/* Carte Nouvelles */}
        <div className="card bg-error/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <Bell className="h-6 w-6 text-error mx-auto mb-2" />
            <h3 className="text-lg font-bold text-error">{statistiques.nouvelles}</h3>
            <p className="text-sm opacity-60">Nouvelles</p>
          </div>
        </div>

        {/* Carte En traitement */}
        <div className="card bg-warning/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
            <h3 className="text-lg font-bold text-warning">{statistiques.enTraitement}</h3>
            <p className="text-sm opacity-60">En traitement</p>
          </div>
        </div>

        {/* Carte Résolues */}
        <div className="card bg-success/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
            <h3 className="text-lg font-bold text-success">{statistiques.resolues}</h3>
            <p className="text-sm opacity-60">Résolues</p>
          </div>
        </div>

        {/* Carte Critiques */}
        <div className="card bg-error/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-error mx-auto mb-2" />
            <h3 className="text-lg font-bold text-error">{statistiques.critiques}</h3>
            <p className="text-sm opacity-60">Critiques</p>
          </div>
        </div>

        {/* Carte Élevées */}
        <div className="card bg-warning/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
            <h3 className="text-lg font-bold text-warning">{statistiques.elevees}</h3>
            <p className="text-sm opacity-60">Élevées</p>
          </div>
        </div>

        {/* Carte Moyennes */}
        <div className="card bg-info/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <Bell className="h-6 w-6 text-info mx-auto mb-2" />
            <h3 className="text-lg font-bold text-info">{statistiques.moyennes}</h3>
            <p className="text-sm opacity-60">Moyennes</p>
          </div>
        </div>

        {/* Carte Basses */}
        <div className="card bg-success/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <Info className="h-6 w-6 text-success mx-auto mb-2" />
            <h3 className="text-lg font-bold text-success">{statistiques.basses}</h3>
            <p className="text-sm opacity-60">Basses</p>
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
                <span className="label-text">📊 Sévérité</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterSeverite}
                onChange={(e) => setFilterSeverite(e.target.value)}
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
                <span className="label-text">📈 Statut</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="nouvelle">Nouvelle</option>
                <option value="en_traitement">En traitement</option>
                <option value="resolue">Résolue</option>
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
                <option value="securite">Sécurité</option>
                <option value="performance">Performance</option>
                <option value="panne">Panne</option>
                <option value="maintenance">Maintenance</option>
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

          {/* Actions de sélection - CORRECTION : Garder toutes les actions */}
          {selectedAlertes.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-semibold text-primary text-lg">
                      {selectedAlertes.length} alerte(s) sélectionnée(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* CORRECTION : Garder Traiter et Résoudre */}
                  <button
                    onClick={handleTraiterSelected}
                    className="btn btn-warning btn-sm gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    Traiter ({selectedAlertes.length})
                  </button>
                  <button
                    onClick={handleResoudreSelected}
                    className="btn btn-success btn-sm gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Résoudre ({selectedAlertes.length})
                  </button>
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier ({selectedAlertes.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-outline btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer ({selectedAlertes.length})
                  </button>
                  <button
                    onClick={() => setSelectedAlertes([])}
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

      {/* Tableau des alertes */}
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
                  <th className="font-bold">Type alerte</th>
                  <th className="font-bold">Sévérité</th>
                  <th className="font-bold">Statut</th>
                  <th className="font-bold">Description</th>
                  <th className="font-bold">Source</th>
                  <th className="font-bold">Date alerte</th>
                  <th className="font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredAlertes).map((alerte) => (
                  <tr key={alerte.id} className="hover">
                    <td className="text-center">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
                          checked={selectedAlertes.includes(alerte.id)}
                          onChange={() => toggleSelectAlerte(alerte.id)}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">
                        {getTypeText(alerte.type_alerte)}
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${getSeveriteBadge(alerte.severite)} badge-lg gap-1`}>
                        {getSeveriteIcon(alerte.severite)}
                        {getSeveriteText(alerte.severite)}
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${getStatutBadge(alerte.statut)} badge-lg`}>
                        {getStatutText(alerte.statut)}
                      </div>
                    </td>
                    <td className="max-w-xs">
                      <div className="line-clamp-2 text-sm">
                        {alerte.description}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {alerte.materiel_nom && (
                          <div>🖥️ {alerte.materiel_nom}</div>
                        )}
                        {alerte.logiciel_nom && (
                          <div>💾 {alerte.logiciel_nom}</div>
                        )}
                        {!alerte.materiel_nom && !alerte.logiciel_nom && (
                          <span className="text-base-content opacity-50">-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">
                        {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : '-'}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center space-x-1">
                        <button
                          className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {alerte.statut === 'nouvelle' && (
                          <button
                            onClick={() => handleTraiter(alerte.id)}
                            className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
                            title="Marquer en traitement"
                          >
                            <Bell className="h-4 w-4" />
                          </button>
                        )}
                        
                        {alerte.statut !== 'resolue' && (
                          <button
                            onClick={() => handleResoudre(alerte.id)}
                            className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
                            title="Marquer comme résolue"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleEdit(alerte)}
                          className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(alerte.id)}
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

          {safeArray(filteredAlertes).length === 0 && (
            <div className="text-center py-12">
              <div className="text-base-content opacity-40 mb-4">
                <Bell className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Aucune alerte trouvée</p>
                <p className="text-sm mt-2">
                  {searchTerm || filterSeverite || filterStatut || filterType
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucune alerte n'est enregistrée dans le système"
                  }
                </p>
              </div>
            </div>
          )}
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
        logiciels={logiciels}
        reseaux={reseaux}
        incidents={incidents}
      />
    </div>
  );
};

export default Alertes;




// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Eye, Filter, Download, Edit, Trash2, Bell, AlertTriangle, Info, CheckCircle, CheckSquare, Square, X, BarChart3 } from 'lucide-react';
// import { Alerte } from '../types';
// import AlerteForm from '../components/AlerteForm';
// import { 
//   alertesAPI, 
//   materielsAPI, 
//   logicielsAPI, 
//   reseauAPI, 
//   incidentsAPI 
// } from '../services/api';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): Alerte[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): Alerte[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): Alerte[] => {
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

// // CORRECTION : Définir le type pour les messages
// type MessageType = 'success' | 'error' | 'info' | 'warning';

// const Alertes: React.FC = () => {
//   const [alertes, setAlertes] = useState<Alerte[]>([]);
//   const [filteredAlertes, setFilteredAlertes] = useState<Alerte[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterSeverite, setFilterSeverite] = useState<string>('');
//   const [filterStatut, setFilterStatut] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingAlerte, setEditingAlerte] = useState<Alerte | undefined>();
//   const [selectedAlertes, setSelectedAlertes] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

//   // ÉTAT POUR LES DONNÉES DE RELATIONS
//   const [materiels, setMateriels] = useState<any[]>([]);
//   const [logiciels, setLogiciels] = useState<any[]>([]);
//   const [reseaux, setReseaux] = useState<any[]>([]);
//   const [incidents, setIncidents] = useState<any[]>([]);
//   const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

//   // AJOUT : Statistiques
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
//       console.log('✅ Réponse alertes:', response);
      
//       const extractedData = extractDataFromResponse(response);
//       console.log('🚨 Alertes chargées:', extractedData);
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

//   // AJOUT : Fonction pour calculer les statistiques
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

//   // CORRECTION AMÉLIORÉE : CHARGER LES DONNÉES DE RELATIONS
//   const fetchRelationsData = async () => {
//     try {
//       setLoadingRelations(true);
//       console.log('🔄 Chargement des données de relations...');

//       // Utiliser Promise.allSettled pour gérer les erreurs individuelles
//       const [materielsResponse, logicielsResponse, reseauxResponse, incidentsResponse] = await Promise.allSettled([
//         materielsAPI.getAll().catch(err => ({ data: [] })),
//         logicielsAPI.getAll().catch(err => ({ data: [] })),
//         reseauAPI.getAll().catch(err => ({ data: [] })),
//         incidentsAPI.getAll().catch(err => ({ data: [] }))
//       ]);

//       // Extraire les données avec gestion d'erreur
//       const materielsData = materielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(materielsResponse.value) 
//         : [];
      
//       const logicielsData = logicielsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(logicielsResponse.value) 
//         : [];
      
//       const reseauxData = reseauxResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(reseauxResponse.value) 
//         : [];
      
//       const incidentsData = incidentsResponse.status === 'fulfilled' 
//         ? extractDataFromResponse(incidentsResponse.value) 
//         : [];

//       console.log('✅ Données de relations chargées:', {
//         materiels: materielsData.length,
//         logiciels: logicielsData.length,
//         reseaux: reseauxData.length,
//         incidents: incidentsData.length
//       });

//       setMateriels(materielsData);
//       setLogiciels(logicielsData);
//       setReseaux(reseauxData);
//       setIncidents(incidentsData);

//       // Afficher un message si certaines données sont vides
//       const totalData = materielsData.length + logicielsData.length + reseauxData.length + incidentsData.length;
//       if (totalData === 0) {
//         showMessage('warning', 'Aucune donnée de relation disponible. Vérifiez votre connexion.');
//       }

//     } catch (err: any) {
//       console.error('❌ Erreur chargement relations:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Erreur lors du chargement des données';
//       showMessage('error', errorMessage);
      
//       // Initialiser avec des tableaux vides
//       setMateriels([]);
//       setLogiciels([]);
//       setReseaux([]);
//       setIncidents([]);
//     } finally {
//       setLoadingRelations(false);
//     }
//   };

//   useEffect(() => {
//     fetchAlertes();
//     fetchRelationsData(); // Charger les données de relations au montage
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
//       filtered = safeFilter(filtered, a => 
//         a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (a.materiel_nom && a.materiel_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (a.logiciel_nom && a.logiciel_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (a.reseau_nom && a.reseau_nom.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     if (filterSeverite) {
//       filtered = safeFilter(filtered, a => a.severite === filterSeverite);
//     }

//     if (filterStatut) {
//       filtered = safeFilter(filtered, a => a.statut === filterStatut);
//     }

//     if (filterType) {
//       filtered = safeFilter(filtered, a => a.type_alerte === filterType);
//     }

//     setFilteredAlertes(filtered);
//     setSelectedAlertes([]);
//   };

//   // CORRECTION : Fonction showMessage avec le type MessageType
//   const showMessage = (type: MessageType, text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

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
      
//       // Recharger les données
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

//   // CORRECTION : Fonctions handleAddNew et handleEdit améliorées
//   const handleAddNew = () => {
//     // Vérifier que les données de relations sont chargées
//     if (loadingRelations) {
//       showMessage('info', '📦 Chargement des données en cours... Veuillez patienter.');
//       return;
//     }
    
//     // CORRECTION : Vérifier si au moins une des sources est disponible
//     const hasRelationsData = materiels.length > 0 || logiciels.length > 0 || reseaux.length > 0 || incidents.length > 0;
    
//     if (!hasRelationsData) {
//       showMessage('warning', 
//         `Aucune donnée de relation disponible. 
//         Matériels: ${materiels.length} | 
//         Logiciels: ${logiciels.length} | 
//         Réseaux: ${reseaux.length} | 
//         Incidents: ${incidents.length}`
//       );
      
//       // Proposer de recharger
//       if (confirm('Voulez-vous recharger les données ?')) {
//         fetchRelationsData();
//       }
      
//       return;
//     }

//     console.log('✅ Données disponibles pour nouvelle alerte:', {
//       materiels: materiels.length,
//       logiciels: logiciels.length,
//       reseaux: reseaux.length,
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

//     // CORRECTION : Même vérification pour l'édition
//     const hasRelationsData = materiels.length > 0 || logiciels.length > 0 || reseaux.length > 0 || incidents.length > 0;
    
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
//         for (const id of selectedAlertes) {
//           await alertesAPI.delete(id);
//         }
        
//         showMessage('success', `${selectedAlertes.length} alerte(s) supprimée(s) avec succès`);
//         setSelectedAlertes([]);
//         fetchAlertes();
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

//   // CORRECTION : Fonctions Traiter et Résoudre améliorées
//   const handleTraiterSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showMessage('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     try {
//       for (const id of selectedAlertes) {
//         await alertesAPI.traiter(id);
//       }
      
//       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme traitées`);
//       setSelectedAlertes([]);
//       fetchAlertes();
//     } catch (error: any) {
//       showMessage('error', 'Erreur lors du traitement des alertes');
//     }
//   };

//   // CORRECTION : handleResoudreSelected réintégré
//   const handleResoudreSelected = async () => {
//     if (selectedAlertes.length === 0) {
//       showMessage('error', 'Aucune alerte sélectionnée');
//       return;
//     }

//     try {
//       for (const id of selectedAlertes) {
//         await alertesAPI.update(id, { statut: 'resolue' });
//       }
      
//       showMessage('success', `${selectedAlertes.length} alerte(s) marquée(s) comme résolues`);
//       setSelectedAlertes([]);
//       fetchAlertes();
//     } catch (error: any) {
//       showMessage('error', 'Erreur lors de la résolution des alertes');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
//       try {
//         await alertesAPI.delete(id);
//         showMessage('success', 'Alerte supprimée avec succès');
//         fetchAlertes();
//       } catch (error: any) {
//         showMessage('error', 'Erreur lors de la suppression');
//       }
//     }
//   };

//   const handleTraiter = async (id: number) => {
//     try {
//       await alertesAPI.traiter(id);
//       showMessage('success', 'Alerte marquée comme traitée');
//       fetchAlertes();
//     } catch (error: any) {
//       showMessage('error', 'Erreur lors du traitement');
//     }
//   };

//   // CORRECTION : Une seule fonction handleResoudre
//   const handleResoudre = async (id: number) => {
//     try {
//       await alertesAPI.update(id, { statut: 'resolue' });
//       showMessage('success', 'Alerte marquée comme résolue');
//       fetchAlertes();
//     } catch (error: any) {
//       console.error('❌ Erreur résolution:', error);
//       // Afficher les détails de l'erreur
//       if (error.response?.data) {
//         console.log('Détails erreur:', error.response.data);
//       }
//       showMessage('error', 'Erreur lors de la résolution - Voir console');
//     }
//   };

//   // Fonctions d'affichage
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

//   const getSeveriteIcon = (severite: string) => {
//     const icons = {
//       critique: <AlertTriangle className="h-4 w-4" />,
//       elevee: <AlertTriangle className="h-4 w-4" />,
//       moyenne: <Bell className="h-4 w-4" />,
//       basse: <Info className="h-4 w-4" />
//     };
//     return icons[severite as keyof typeof icons] || <Bell className="h-4 w-4" />;
//   };

//   const getStatutBadge = (statut: string) => {
//     const badges = {
//       nouvelle: 'badge-error',
//       en_traitement: 'badge-warning',
//       resolue: 'badge-success'
//     };
//     return badges[statut as keyof typeof badges] || 'badge-neutral';
//   };

//   const getStatutText = (statut: string) => {
//     const texts = {
//       nouvelle: 'Nouvelle',
//       en_traitement: 'En traitement',
//       resolue: 'Résolue'
//     };
//     return texts[statut as keyof typeof texts] || statut;
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
//         'Logiciel source': a.logiciel_nom || 'Non spécifié',
//         'Date alerte': a.date_alerte ? new Date(a.date_alerte).toLocaleDateString('fr-FR') : 'Non spécifiée'
//       }));

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

//   // Fonction pour obtenir la classe CSS du message
//   const getAlertClass = (type: MessageType) => {
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
//         <div className={`alert ${getAlertClass(message.type)} mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//           <button className="btn btn-ghost btn-sm" onClick={fetchAlertes}>
//             Réessayer
//           </button>
//         </div>
//       )}

//       {/* CORRECTION : Messages d'information sur les données de relations */}
//       {loadingRelations && (
//         <div className="alert alert-info mb-4">
//           <div className="flex items-center gap-2">
//             <span className="loading loading-spinner loading-sm"></span>
//             <span>Chargement des données de relations en cours...</span>
//           </div>
//         </div>
//       )}

//       {/* CORRECTION : Avertissement si pas de données de relations */}
//       {!loadingRelations && materiels.length === 0 && logiciels.length === 0 && reseaux.length === 0 && (
//         <div className="alert alert-warning mb-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <span>⚠️ Aucune donnée de relation disponible. </span>
//               <button 
//                 onClick={fetchRelationsData}
//                 className="btn btn-sm btn-outline ml-2"
//               >
//                 Recharger
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">🚨 Gestion des Alertes</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {filteredAlertes.length} alerte(s) trouvée(s)
//             {loadingRelations && ' - Chargement des données...'}
//             {/* CORRECTION : Afficher le statut des données de relations */}
//             {!loadingRelations && (
//               <span className="text-sm ml-2">
//                 (📦 {materiels.length} mat. | 💾 {logiciels.length} log. | 🌐 {reseaux.length} rés. | ⚠️ {incidents.length} inc.)
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {/* CORRECTION : Bouton Actualiser réintégré */}
//           <button
//             onClick={() => {
//               fetchAlertes();
//               fetchRelationsData();
//             }}
//             className="btn btn-outline btn-sm gap-2"
//             title="Actualiser les données"
//           >
//             <span>🔄</span>
//             Actualiser
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

//       {/* AJOUT : Section Statistiques */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         {/* Carte Total */}
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total</p>
//           </div>
//         </div>

//         {/* Carte Nouvelles */}
//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Bell className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.nouvelles}</h3>
//             <p className="text-sm opacity-60">Nouvelles</p>
//           </div>
//         </div>

//         {/* Carte En traitement */}
//         <div className="card bg-warning/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-warning">{statistiques.enTraitement}</h3>
//             <p className="text-sm opacity-60">En traitement</p>
//           </div>
//         </div>

//         {/* Carte Résolues */}
//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.resolues}</h3>
//             <p className="text-sm opacity-60">Résolues</p>
//           </div>
//         </div>

//         {/* Carte Critiques */}
//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.critiques}</h3>
//             <p className="text-sm opacity-60">Critiques</p>
//           </div>
//         </div>

//         {/* Carte Élevées */}
//         <div className="card bg-warning/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-warning">{statistiques.elevees}</h3>
//             <p className="text-sm opacity-60">Élevées</p>
//           </div>
//         </div>

//         {/* Carte Moyennes */}
//         <div className="card bg-info/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Bell className="h-6 w-6 text-info mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-info">{statistiques.moyennes}</h3>
//             <p className="text-sm opacity-60">Moyennes</p>
//           </div>
//         </div>

//         {/* Carte Basses */}
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
//                   placeholder="Description, matériel, logiciel..."
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

//           {/* Actions de sélection - CORRECTION : Garder toutes les actions */}
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
//                   {/* CORRECTION : Garder Traiter et Résoudre */}
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
//                 {safeArray(filteredAlertes).map((alerte) => (
//                   <tr key={alerte.id} className="hover">
//                     <td className="text-center">
//                       <div className="flex justify-center">
//                         <input
//                           type="checkbox"
//                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                           checked={selectedAlertes.includes(alerte.id)}
//                           onChange={() => toggleSelectAlerte(alerte.id)}
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       <div className="font-medium">
//                         {getTypeText(alerte.type_alerte)}
//                       </div>
//                     </td>
//                     <td>
//                       <div className={`badge ${getSeveriteBadge(alerte.severite)} badge-lg gap-1`}>
//                         {getSeveriteIcon(alerte.severite)}
//                         {getSeveriteText(alerte.severite)}
//                       </div>
//                     </td>
//                     <td>
//                       <div className={`badge ${getStatutBadge(alerte.statut)} badge-lg`}>
//                         {getStatutText(alerte.statut)}
//                       </div>
//                     </td>
//                     <td className="max-w-xs">
//                       <div className="line-clamp-2 text-sm">
//                         {alerte.description}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="text-sm">
//                         {alerte.materiel_nom && (
//                           <div>🖥️ {alerte.materiel_nom}</div>
//                         )}
//                         {alerte.logiciel_nom && (
//                           <div>💾 {alerte.logiciel_nom}</div>
//                         )}
//                         {!alerte.materiel_nom && !alerte.logiciel_nom && (
//                           <span className="text-base-content opacity-50">-</span>
//                         )}
//                       </div>
//                     </td>
//                     <td>
//                       <span className="text-sm">
//                         {alerte.date_alerte ? new Date(alerte.date_alerte).toLocaleDateString('fr-FR') : '-'}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="flex justify-center space-x-1">
//                         <button
//                           className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
//                           title="Voir les détails"
//                           onClick={() => {
//                             // CORRECTION : Ajouter une fonction pour voir les détails
//                             showMessage('info', `Détails de l'alerte: ${alerte.description}`);
//                           }}
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
                        
//                         {alerte.statut === 'nouvelle' && (
//                           <button
//                             onClick={() => handleTraiter(alerte.id)}
//                             className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
//                             title="Marquer en traitement"
//                           >
//                             <Bell className="h-4 w-4" />
//                           </button>
//                         )}
                        
//                         {alerte.statut !== 'resolue' && (
//                           <button
//                             onClick={() => handleResoudre(alerte.id)}
//                             className="btn btn-ghost btn-sm btn-square text-success hover:bg-success/10"
//                             title="Marquer comme résolue"
//                           >
//                             <CheckCircle className="h-4 w-4" />
//                           </button>
//                         )}
                        
//                         <button
//                           onClick={() => handleEdit(alerte)}
//                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                           title="Modifier"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
                        
//                         <button
//                           onClick={() => handleDelete(alerte.id)}
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

//           {safeArray(filteredAlertes).length === 0 && (
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
//         logiciels={logiciels}
//         reseaux={reseaux}
//         incidents={incidents}
//       />
//     </div>
//   );
// };

// export default Alertes;