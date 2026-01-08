

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Package, Calendar, AlertTriangle, Download, CheckSquare, Square, X } from 'lucide-react';
import { Logiciel, Fournisseur } from '../types';
import { logicielsAPI, fournisseursAPI } from '../services/api';
import LogicielForm from '../components/LogicielForm';

// Fonctions helper pour la sécurité des tableaux
const safeArray = (data: any): Logiciel[] => {
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): Logiciel[] => {
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

const Logiciels: React.FC = () => {
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [filteredLogiciels, setFilteredLogiciels] = useState<Logiciel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLogiciel, setEditingLogiciel] = useState<Logiciel | undefined>();
  const [selectedLogiciels, setSelectedLogiciels] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  // Fonction pour calculer la date d'expiration - CORRIGÉE avec useCallback
  const calculerDateExpiration = useCallback((installationDate?: string): string | null => {
    if (!installationDate) return null;
    try {
      const installation = new Date(installationDate);
      const expiration = new Date(installation);
      expiration.setFullYear(expiration.getFullYear() + 1);
      return expiration.toISOString().split('T')[0];
    } catch {
      return null;
    }
  }, []);

  // Fonction pour obtenir le texte d'expiration - CORRIGÉE avec useCallback
  const getExpirationText = useCallback((expirationDate: string, installationDate?: string): string => {
    try {
      let dateExpiration: Date;
      
      // Si date d'expiration explicite existe, l'utiliser
      if (expirationDate) {
        dateExpiration = new Date(expirationDate);
      } 
      // Sinon, si date d'installation existe, calculer +1 an
      else if (installationDate) {
        const installation = new Date(installationDate);
        dateExpiration = new Date(installation);
        dateExpiration.setFullYear(dateExpiration.getFullYear() + 1);
      } else {
        return "Pas de date d'expiration";
      }

      const aujourdhui = new Date();
      const difference = dateExpiration.getTime() - aujourdhui.getTime();
      const joursRestants = Math.ceil(difference / (1000 * 60 * 60 * 24));

      if (joursRestants < 0) {
        const joursDepuis = Math.abs(joursRestants);
        if (joursDepuis === 1) return "❌ Expiré depuis hier";
        if (joursDepuis < 30) return `❌ Expiré depuis ${joursDepuis} jours`;
        if (joursDepuis < 365) {
          const mois = Math.floor(joursDepuis / 30);
          return `❌ Expiré depuis ${mois} mois`;
        }
        const annees = Math.floor(joursDepuis / 365);
        return `❌ Expiré depuis ${annees} an${annees > 1 ? 's' : ''}`;
      }

      if (joursRestants === 0) return "⚠️ Expire aujourd'hui";
      if (joursRestants === 1) return "⚠️ Expire demain";
      if (joursRestants <= 7) return `⚠️ Expire dans ${joursRestants} jours`;
      if (joursRestants <= 30) return `✅ Expire dans ${Math.ceil(joursRestants / 7)} semaines`;
      if (joursRestants <= 365) {
        const mois = Math.ceil(joursRestants / 30);
        return `✅ Expire dans ${mois} mois`;
      }
      
      const annees = Math.ceil(joursRestants / 365);
      return `✅ Expire dans ${annees} an${annees > 1 ? 's' : ''}`;
    } catch {
      return "Date invalide";
    }
  }, []);

  // Fonctions de vérification - CORRIGÉES avec useCallback
  const isLicenceExpiree = useCallback((logiciel: Logiciel): boolean => {
    let dateExpiration: Date;
    
    // Si date d'expiration explicite existe, l'utiliser
    if (logiciel.date_expiration_licence) {
      try {
        dateExpiration = new Date(logiciel.date_expiration_licence);
      } catch {
        return false;
      }
    } 
    // Sinon, si date d'installation existe, calculer +1 an
    else if (logiciel.date_installation) {
      try {
        const installation = new Date(logiciel.date_installation);
        dateExpiration = new Date(installation);
        dateExpiration.setFullYear(dateExpiration.getFullYear() + 1);
      } catch {
        return false;
      }
    } else {
      return false;
    }
    
    return dateExpiration < new Date();
  }, []);

  const isLicenceProcheExpiration = useCallback((logiciel: Logiciel): boolean => {
    let dateExpiration: Date;
    
    // Si date d'expiration explicite existe, l'utiliser
    if (logiciel.date_expiration_licence) {
      try {
        dateExpiration = new Date(logiciel.date_expiration_licence);
      } catch {
        return false;
      }
    } 
    // Sinon, si date d'installation existe, calculer +1 an
    else if (logiciel.date_installation) {
      try {
        const installation = new Date(logiciel.date_installation);
        dateExpiration = new Date(installation);
        dateExpiration.setFullYear(dateExpiration.getFullYear() + 1);
      } catch {
        return false;
      }
    } else {
      return false;
    }
    
    const aujourdhui = new Date();
    const trenteJours = 30 * 24 * 60 * 60 * 1000;
    
    return dateExpiration > aujourdhui && 
           (dateExpiration.getTime() - aujourdhui.getTime()) <= trenteJours;
  }, []);

  useEffect(() => {
    fetchLogiciels();
    fetchFournisseurs();
  }, []);

  useEffect(() => {
    filterLogiciels();
  }, [logiciels, searchTerm, filterType]);

  useEffect(() => {
    if (filteredLogiciels.length > 0 && selectedLogiciels.length === filteredLogiciels.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedLogiciels, filteredLogiciels]);

  const fetchLogiciels = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await logicielsAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      console.log('📦 Logiciels chargés:', extractedData);
      setLogiciels(extractedData);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erreur lors du chargement des logiciels';
      setError(errorMessage);
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchFournisseurs = async (): Promise<void> => {
    try {
      const response = await fournisseursAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      console.log('🏢 Fournisseurs chargés:', extractedData);
      setFournisseurs(extractedData);
    } catch (err: any) {
      console.error('❌ Erreur chargement fournisseurs:', err);
    }
  };

  const filterLogiciels = (): void => {
    let filtered = safeArray(logiciels);

    if (searchTerm) {
      filtered = safeFilter(filtered, logiciel => 
        logiciel.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logiciel.editeur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logiciel.version?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      filtered = safeFilter(filtered, logiciel => logiciel.type_logiciel === filterType);
    }

    setFilteredLogiciels(filtered);
    setSelectedLogiciels([]);
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string): void => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (logicielData: Omit<Logiciel, 'id'>): Promise<void> => {
    try {
      console.group('🔧 DEBUG Logiciel Submission');
      console.log('Données du formulaire:', logicielData);
      
      // Formater les données pour l'API
      const apiData: any = {
        nom: logicielData.nom?.trim() || '',
        editeur: logicielData.editeur?.trim() || '',
        version: logicielData.version?.trim() || '',
        type_logiciel: logicielData.type_logiciel || 'os',
        date_installation: logicielData.date_installation || null,
        date_expiration_licence: logicielData.date_expiration_licence || null
      };

      // Ajouter le fournisseur seulement s'il est défini
      if (logicielData.fournisseur) {
        apiData.fournisseur = logicielData.fournisseur;
      }
      
      console.log('📤 Données API formatées:', apiData);
      console.groupEnd();

      if (editingLogiciel) {
        const response = await logicielsAPI.update(editingLogiciel.id, apiData);
        console.log('✅ Réponse update:', response.data);
        showMessage('success', 'Logiciel modifié avec succès');
      } else {
        const response = await logicielsAPI.create(apiData);
        console.log('✅ Réponse create:', response.data);
        showMessage('success', 'Logiciel créé avec succès');
      }
      
      fetchLogiciels();
      setIsFormOpen(false);
      setEditingLogiciel(undefined);
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

  const toggleSelectLogiciel = (id: number): void => {
    setSelectedLogiciels(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = (): void => {
    if (isSelectAll) {
      setSelectedLogiciels([]);
    } else {
      const allIds = filteredLogiciels.map(l => l.id);
      setSelectedLogiciels(allIds);
    }
  };

  const handleDeleteSelected = async (): Promise<void> => {
    if (selectedLogiciels.length === 0) {
      showMessage('error', 'Aucun logiciel sélectionné');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedLogiciels.length} logiciel(s) ?`)) {
      try {
        for (const id of selectedLogiciels) {
          await logicielsAPI.delete(id);
        }
        
        showMessage('success', `${selectedLogiciels.length} logiciel(s) supprimé(s) avec succès`);
        setSelectedLogiciels([]);
        fetchLogiciels();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression des logiciels');
      }
    }
  };

  const handleEditSelected = (): void => {
    if (selectedLogiciels.length === 0) {
      showMessage('error', 'Aucun logiciel sélectionné');
      return;
    }

    if (selectedLogiciels.length === 1) {
      const logiciel = logiciels.find(l => l.id === selectedLogiciels[0]);
      if (logiciel) {
        handleEdit(logiciel);
      }
    } else {
      showMessage('info', `Édition multiple de ${selectedLogiciels.length} logiciels`);
    }
  };

  const handleEdit = (logiciel: Logiciel): void => {
    setEditingLogiciel(logiciel);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce logiciel ?')) {
      try {
        await logicielsAPI.delete(id);
        showMessage('success', 'Logiciel supprimé avec succès');
        fetchLogiciels();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const handleAddNew = (): void => {
    setEditingLogiciel(undefined);
    setIsFormOpen(true);
  };

  const handleExport = (): void => {
    try {
      const dataToExport = filteredLogiciels.map(l => ({
        Nom: l.nom,
        Éditeur: l.editeur,
        Version: l.version,
        Type: getTypeText(l.type_logiciel),
        'Mise en exploitation': l.date_installation ? new Date(l.date_installation).toLocaleDateString('fr-FR') : 'Non spécifiée',
        'Expiration licence': l.date_expiration_licence ? new Date(l.date_expiration_licence).toLocaleDateString('fr-FR') : 
          (l.date_installation ? `Calculé: ${new Date(calculerDateExpiration(l.date_installation)!).toLocaleDateString('fr-FR')}` : 'Non spécifiée'),
        'Statut licence': getExpirationText(l.date_expiration_licence || '', l.date_installation)
      }));

      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `logiciels_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showMessage('success', 'Export CSV réussi !');
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'export');
    }
  };

  const resetFilters = (): void => {
    setSearchTerm('');
    setFilterType('');
    setSelectedLogiciels([]);
  };

  const getTypeBadge = (type: string): string => {
    const badges = {
      os: 'badge-primary',
      // os: 'badge-success',
      bureautique: 'badge-info',
      metier: 'badge-success',
      securite: 'badge-error',
      autre: 'badge-neutral'
    };



      // const badges = {
      // os: 'badge-success',
      // bureautique: 'badge-info',
      // metier: 'badge-accent',
      // securite: 'badge-error',
      // autre: 'badge-neutral'
    
    return badges[type as keyof typeof badges] || 'badge-neutral';
  };

  const getTypeText = (type: string): string => {
    const texts = {
      os: 'Système d\'exploitation',
      bureautique: 'Bureautique',
      metier: 'Métier',
      securite: 'Sécurité',
      autre: 'Autre'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return '-';
    }
  };

  // Statistiques avec safeArray et safeFilter - CORRIGÉES
  const stats = {
    total: safeArray(logiciels).length,
    os: safeFilter(logiciels, l => l.type_logiciel === 'os').length,
    bureautique: safeFilter(logiciels, l => l.type_logiciel === 'bureautique').length,
    licencesExpirees: safeFilter(logiciels, l => isLicenceExpiree(l)).length,
    licencesProcheExpiration: safeFilter(logiciels, l => isLicenceProcheExpiration(l)).length
  };

  if (loading) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des logiciels...</p>
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
          <h1 className="text-3xl font-bold text-base-content">📋 Inventaire des Logiciels</h1>
          <p className="text-base-content opacity-60 mt-1">
            Catalogue et gestion des licences logicielles ({safeArray(filteredLogiciels).length} logiciel{safeArray(filteredLogiciels).length !== 1 ? 's' : ''})
            {selectedLogiciels.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedLogiciels.length} sélectionné(s))
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
            Nouveau logiciel
          </button>
        </div>
      </div>

      {/* Statistiques */}
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
                <p className="text-sm font-medium text-base-content opacity-70">Systèmes</p>
                <p className="text-2xl font-bold text-primary">{stats.os}</p>
              </div>
              <div className="text-2xl">💻</div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Bureautique</p>
                <p className="text-2xl font-bold text-info">{stats.bureautique}</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content opacity-70">Licences expirées</p>
                <p className="text-2xl font-bold text-error">{stats.licencesExpirees}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
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
                  placeholder="Nom, éditeur, version..."
                  className="input input-bordered w-full pl-10 bg-base-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📁 Type</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tous les types</option>
                <option value="os">Système d'exploitation</option>
                <option value="bureautique">Bureautique</option>
                <option value="metier">Métier</option>
                <option value="securite">Sécurité</option>
                <option value="autre">Autre</option>
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">📈 Statistiques</span>
              </label>
              <div className="text-sm text-base-content opacity-70">
                {safeArray(filteredLogiciels).length} / {safeArray(logiciels).length} logiciels
              </div>
            </div>
          </div>

          {/* Actions de sélection */}
          {selectedLogiciels.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-semibold text-primary text-lg">
                      {selectedLogiciels.length} logiciel(s) sélectionné(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier ({selectedLogiciels.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-outline btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer ({selectedLogiciels.length})
                  </button>
                  <button
                    onClick={() => setSelectedLogiciels([])}
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

      {/* Tableau des logiciels */}
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
                  <th className="font-bold">Nom</th>
                  <th className="font-bold">Éditeur</th>
                  <th className="font-bold">Version</th>
                  <th className="font-bold">Type</th>
                  <th className="font-bold">Date entrée inventaire</th>
                  <th className="font-bold">Expiration licence</th>
                  <th className="font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredLogiciels).map((logiciel) => {
                  const dateExpirationCalculee = calculerDateExpiration(logiciel.date_installation);
                  const afficherExpirationCalculee = !logiciel.date_expiration_licence && logiciel.date_installation;
                  
                  return (
                    <tr key={logiciel.id} className="hover">
                      <td className="text-center">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
                            checked={selectedLogiciels.includes(logiciel.id)}
                            onChange={() => toggleSelectLogiciel(logiciel.id)}
                          />
                        </div>
                      </td>
                      <td className="font-semibold">{logiciel.nom}</td>
                      <td>{logiciel.editeur}</td>
                      <td>
                        <code className="bg-base-100 px-2 py-1 rounded text-sm">
                          {logiciel.version}
                        </code>
                      </td>
                      <td>
                        <div className={`badge ${getTypeBadge(logiciel.type_logiciel)} badge-lg`}>
                          {getTypeText(logiciel.type_logiciel)}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm">
                          {logiciel.date_installation ? formatDate(logiciel.date_installation) : '-'}
                        </span>
                      </td>
                      <td>
                        {logiciel.date_expiration_licence || afficherExpirationCalculee ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {logiciel.date_expiration_licence 
                                  ? formatDate(logiciel.date_expiration_licence)
                                  : dateExpirationCalculee 
                                    ? `Calculé: ${formatDate(dateExpirationCalculee)}`
                                    : '-'
                                }
                              </span>
                              {isLicenceExpiree(logiciel) && (
                                <div className="badge badge-error badge-sm" title="Licence expirée">
                                  <AlertTriangle className="w-3 h-3" />
                                </div>
                              )}
                              {isLicenceProcheExpiration(logiciel) && (
                                <div className="badge badge-warning badge-sm" title="Licence expire bientôt">
                                  <Calendar className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                            {/* Affichage du temps restant - CORRIGÉ */}
                            <div className="text-xs opacity-70">
                              {getExpirationText(
                                logiciel.date_expiration_licence || '', 
                                logiciel.date_installation
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-base-content opacity-50">-</span>
                        )}
                      </td>
                      <td>
                        <div className="flex justify-center space-x-1">
                          <button
                            className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(logiciel)}
                            className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(logiciel.id)}
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

          {safeArray(filteredLogiciels).length === 0 && (
            <div className="text-center py-12">
              <div className="text-base-content opacity-40 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Aucun logiciel trouvé</p>
                <p className="text-sm mt-2">
                  {searchTerm || filterType 
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucun logiciel n'est enregistré dans le système"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire de logiciel */}
      <LogicielForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLogiciel(undefined);
        }}
        onSubmit={handleSubmit}
        logiciel={editingLogiciel}
        fournisseurs={fournisseurs}
      />
    </div>
  );
};

export default Logiciels;




