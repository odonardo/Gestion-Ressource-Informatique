import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Wrench, Calendar, CheckSquare, Square, X, BarChart3, Download } from 'lucide-react';
import { Reparation } from '../types';
import { reparationsAPI, materielsAPI, incidentsAPI } from '../services/api';
import ReparationForm from '../components/ReparationForm';

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

// CORRECTION : Définir le type pour les messages
type MessageType = 'success' | 'error' | 'info' | 'warning';

const Reparations: React.FC = () => {
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

  // AJOUT: États pour les données de relations
  const [materiels, setMateriels] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

  // AJOUT : Statistiques détaillées - CORRIGÉ : seulement coût total
  const [statistiques, setStatistiques] = useState({
    total: 0,
    enCours: 0,
    terminees: 0,
    coutTotal: 0
  });

  // CORRECTION: Fonction pour charger les réparations avec DEBUG COMPLET
  const fetchReparations = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Chargement des réparations...');
      
      const response = await reparationsAPI.getAll();
      console.log('✅ Réponse réparations COMPLÈTE:', response);
      
      const extractedData = extractDataFromResponse(response);
      console.log('🔧 Réparations chargées:', extractedData);
      
      // DEBUG COMPLET: Afficher la structure de toutes les réparations
      if (extractedData.length > 0) {
        console.log('🔍 ANALYSE DES DONNÉES RÉPARATIONS:');
        extractedData.forEach((rep, index) => {
          console.log(`📋 Réparation ${index + 1} (ID: ${rep.id}):`, {
            id: rep.id,
            materiel_nom: rep.materiel_nom,
            type_reparation: rep.type_reparation,
            date_debut: rep.date_debut,
            date_fin: rep.date_fin,
            cout: rep.cout,
            description: rep.description,
            // Rechercher tous les champs qui pourraient être le technicien
            allFields: Object.keys(rep),
            allValues: rep
          });
          
          // Recherche spécifique du champ technicien
          const technicienFields = Object.keys(rep).filter(key => 
            key.toLowerCase().includes('technicien') || 
            key.toLowerCase().includes('responsable') ||
            key.toLowerCase().includes('technician')
          );
          console.log(`👨‍🔧 Champs technicien trouvés pour rep ${index + 1}:`, technicienFields);
          technicienFields.forEach(field => {
            console.log(`   ${field}:`, (rep as any)[field]);
          });
        });
      }
      
      setReparations(extractedData);
      
      // Calculer les statistiques
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

  // CORRECTION: Fonction pour charger les données de relations
  const fetchRelationsData = async () => {
    try {
      setLoadingRelations(true);
      console.log('🔄 Chargement des données de relations...');

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

      console.log('✅ Données de relations chargées:', {
        materiels: materielsData.length,
        incidents: incidentsData.length
      });

      setMateriels(materielsData);
      setIncidents(incidentsData);

    } catch (err: any) {
      console.error('❌ Erreur chargement relations:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Erreur lors du chargement des données';
      showMessage('error', errorMessage);
      
      setMateriels([]);
      setIncidents([]);
    } finally {
      setLoadingRelations(false);
    }
  };

  // CORRECTION: Charger toutes les données au montage
  useEffect(() => {
    fetchReparations();
    fetchRelationsData();
  }, []);

  useEffect(() => {
    filterReparations();
  }, [reparations, searchTerm, filterType, filterStatut]);

  useEffect(() => {
    if (filteredReparations.length > 0 && selectedReparations.length === filteredReparations.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedReparations, filteredReparations]);

  const filterReparations = () => {
    let filtered = safeArray(reparations);

    if (searchTerm) {
      filtered = safeFilter(filtered, reparation => 
        reparation.materiel_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reparation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (getTechnicienName(reparation) && getTechnicienName(reparation).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType) {
      filtered = safeFilter(filtered, reparation => reparation.type_reparation === filterType);
    }

    if (filterStatut) {
      if (filterStatut === 'en_cours') {
        filtered = safeFilter(filtered, reparation => !reparation.date_fin);
      } else if (filterStatut === 'terminee') {
        filtered = safeFilter(filtered, reparation => reparation.date_fin);
      }
    }

    setFilteredReparations(filtered);
    setSelectedReparations([]);
  };

  // NOUVELLE FONCTION : Trouver le nom du technicien de manière robuste
  const getTechnicienName = (reparation: any): string => {
    if (!reparation) return '';
    
    // Essayer différents noms de champs possibles
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
  };

  // CORRECTION: Fonction showMessage améliorée
  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // CORRECTION: handleSubmit avec gestion d'erreur améliorée
  const handleSubmit = async (reparationData: any) => {
    try {
      console.log('📤 Soumission des données réparation:', reparationData);
      
      if (editingReparation) {
        await reparationsAPI.update(editingReparation.id, reparationData);
        showMessage('success', 'Réparation modifiée avec succès');
      } else {
        await reparationsAPI.create(reparationData);
        showMessage('success', 'Réparation créée avec succès');
      }
      
      await fetchReparations();
      setIsFormOpen(false);
      setEditingReparation(undefined);
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde réparation:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde';
      showMessage('error', errorMessage);
    }
  };

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

    setEditingReparation(reparation);
    setIsFormOpen(true);
  };

  // CORRECTION: handleDelete avec gestion d'erreur améliorée
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réparation ?')) {
      try {
        await reparationsAPI.delete(id);
        showMessage('success', 'Réparation supprimée avec succès');
        fetchReparations();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
        showMessage('error', errorMessage);
      }
    }
  };

  // CORRECTION: handleTerminer avec gestion d'erreur améliorée
  const handleTerminer = async (id: number) => {
    try {
      await reparationsAPI.update(id, { 
        date_fin: new Date().toISOString() 
      });
      showMessage('success', 'Réparation marquée comme terminée');
      fetchReparations();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation de la réparation';
      showMessage('error', errorMessage);
    }
  };

  // CORRECTION: handleAddNew avec vérification des données de relations
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

  // CORRECTION: handleDeleteSelected avec gestion d'erreur améliorée
  const handleDeleteSelected = async () => {
    if (selectedReparations.length === 0) {
      showMessage('error', 'Aucune réparation sélectionnée');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReparations.length} réparation(s) ?`)) {
      try {
        await Promise.all(selectedReparations.map(id => reparationsAPI.delete(id)));
        showMessage('success', `${selectedReparations.length} réparation(s) supprimée(s) avec succès`);
        setSelectedReparations([]);
        fetchReparations();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression des réparations';
        showMessage('error', errorMessage);
      }
    }
  };

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
      setEditingReparation(undefined);
      setIsFormOpen(true);
    }
  };

  // CORRECTION: handleTerminerSelected avec gestion d'erreur améliorée
  const handleTerminerSelected = async () => {
    if (selectedReparations.length === 0) {
      showMessage('error', 'Aucune réparation sélectionnée');
      return;
    }

    try {
      await Promise.all(
        selectedReparations.map(id => 
          reparationsAPI.update(id, { 
            date_fin: new Date().toISOString() 
          })
        )
      );
      
      showMessage('success', `${selectedReparations.length} réparation(s) marquée(s) comme terminées`);
      setSelectedReparations([]);
      fetchReparations();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la finalisation des réparations';
      showMessage('error', errorMessage);
    }
  };

  // NOUVEAU : Fonction pour exporter en CSV
  const handleExport = () => {
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
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'export');
    }
  };

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

  // CORRECTION : Fonctions pour le statut
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

  // AJOUT : Fonction pour calculer les statistiques - CORRIGÉ : seulement coût total
  const calculerStatistiques = (data: Reparation[]) => {
    const stats = {
      total: data.length,
      enCours: data.filter(r => !r.date_fin).length,
      terminees: data.filter(r => r.date_fin).length,
      coutTotal: data.reduce((sum, rep) => sum + (rep.cout || 0), 0)
    };
    setStatistiques(stats);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatut('');
    setSelectedReparations([]);
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

      {/* Section Statistiques détaillées - CORRIGÉ : seulement coût total */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Carte Total */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4 text-center">
            <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="text-lg font-bold">{statistiques.total}</h3>
            <p className="text-sm opacity-60">Total</p>
          </div>
        </div>

        {/* Carte En cours */}
        <div className="card bg-warning/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <Calendar className="h-6 w-6 text-warning mx-auto mb-2" />
            <h3 className="text-lg font-bold text-warning">{statistiques.enCours}</h3>
            <p className="text-sm opacity-60">En cours</p>
          </div>
        </div>

        {/* Carte Terminées */}
        <div className="card bg-success/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
            <h3 className="text-lg font-bold text-success">{statistiques.terminees}</h3>
            <p className="text-sm opacity-60">Terminées</p>
          </div>
        </div>

        {/* Carte Coût total - CORRIGÉ : Affichage en Ar sans dollar */}
        <div className="card bg-purple-500/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <span className="text-lg font-bold text-purple-500 mx-auto mb-2">Ar</span>
            <h3 className="text-lg font-bold text-purple-500">
              {statistiques.coutTotal.toLocaleString('fr-FR')}
            </h3>
            <p className="text-sm opacity-60">Coût total</p>
          </div>
        </div>
      </div>

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
                            <div className="flex items-center gap-1">
                              <span>👨‍🔧</span>
                              <span>{technicien}</span>
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
                            className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
                            title="Voir les détails"
                            onClick={() => {
                              showMessage('info', `Détails de la réparation: ${reparation.description || 'Aucune description'}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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
      />
    </div>
  );
};

export default Reparations;