import React, { useState, useEffect } from 'react';
import { Reseau, ReseauFormData, Materiel } from '../types';
import { Network, Plus, Search, Filter, Edit, Trash2, Eye, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import ReseauForm from '../components/ReseauForm';
import { reseauAPI, materielsAPI } from '../services/api';

// Fonctions helper pour la sécurité des tableaux
const safeArray = (data: any): any[] => {
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): any[] => {
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

export default function ConfigurationReseau() {
  const [configurations, setConfigurations] = useState<Reseau[]>([]);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Reseau | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [configsResponse, materielsResponse] = await Promise.all([
        reseauAPI.getAll(),
        materielsAPI.getAll()
      ]);

      const extractedConfigs = extractDataFromResponse(configsResponse);
      const extractedMateriels = extractDataFromResponse(materielsResponse);

      setConfigurations(extractedConfigs);
      setMateriels(extractedMateriels);
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
      showMessage('error', 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateConfig = async (data: ReseauFormData) => {
    try {
      await reseauAPI.create(data);
      showMessage('success', 'Configuration créée avec succès');
      await fetchData();
      setShowForm(false);
    } catch (error) {
      showMessage('error', 'Erreur lors de la création');
    }
  };

  const handleUpdateConfig = async (data: ReseauFormData) => {
    if (editingConfig) {
      try {
        await reseauAPI.update(editingConfig.id, data);
        showMessage('success', 'Configuration modifiée avec succès');
        await fetchData();
        setEditingConfig(undefined);
        setShowForm(false);
      } catch (error) {
        showMessage('error', 'Erreur lors de la modification');
      }
    }
  };

  const handleDeleteConfig = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette configuration réseau ?')) {
      try {
        await reseauAPI.delete(id);
        showMessage('success', 'Configuration supprimée avec succès');
        await fetchData();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const handleEditConfig = (config: Reseau) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingConfig(undefined);
  };

  const filteredConfigurations = safeFilter(configurations, config => {
    const matchesSearch = 
      config.materiel_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.adresse_ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.nom_hote?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatut === 'tous' || config.statut_connexion === filterStatut;
    
    return matchesSearch && matchesFilter;
  });

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'connecte':
        return <Wifi className="w-4 h-4 text-success" />;
      case 'deconnecte':
        return <WifiOff className="w-4 h-4 text-error" />;
      case 'instable':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <Wifi className="w-4 h-4" />;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'connecte':
        return 'badge-success';
      case 'deconnecte':
        return 'badge-error';
      case 'instable':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'poste':
        return 'badge-primary';
      case 'serveur':
        return 'badge-info';
      case 'imprimante':
        return 'badge-accent';
      case 'switch':
        return 'badge-info';
      case 'routeur':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  };

  // Statistiques avec safeArray et safeFilter
  const stats = {
    total: safeArray(configurations).length,
    connectes: safeFilter(configurations, c => c.statut_connexion === 'connecte').length,
    instables: safeFilter(configurations, c => c.statut_connexion === 'instable').length,
    deconnectes: safeFilter(configurations, c => c.statut_connexion === 'deconnecte').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Messages */}
      {message && (
        <div className={`alert ${
          message.type === 'success' ? 'alert-success' : 
          message.type === 'error' ? 'alert-error' : 
          'alert-info'
        } mb-4`}>
          <span>{message.text}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Network className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-base-content">Configuration Réseau</h1>
            <p className="text-base-content/70">Gérez les configurations réseau de vos équipements</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Configuration
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-primary">
            <Network className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Configurations</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-success">
            <Wifi className="w-8 h-8" />
          </div>
          <div className="stat-title">Connectés</div>
          <div className="stat-value">{stats.connectes}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-warning">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Instables</div>
          <div className="stat-value">{stats.instables}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-error">
            <WifiOff className="w-8 h-8" />
          </div>
          <div className="stat-title">Déconnectés</div>
          <div className="stat-value">{stats.deconnectes}</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="input input-bordered flex items-center gap-2">
                <Search className="w-4 h-4 opacity-70" />
                <input
                  type="text"
                  placeholder="Rechercher par IP, nom d'hôte ou matériel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="grow"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="select select-bordered"
              >
                <option value="tous">Tous les statuts</option>
                <option value="connecte">Connecté</option>
                <option value="deconnecte">Déconnecté</option>
                <option value="instable">Instable</option>
              </select>
              <button className="btn btn-outline gap-2">
                <Filter className="w-4 h-4" />
                Filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des configurations - CORRIGÉ avec safeArray */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Matériel</th>
                  <th>Adresse IP</th>
                  <th>Nom d'hôte</th>
                  <th>Type</th>
                  <th>Sous-réseau</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredConfigurations).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-base-content/70">
                        <Network className="w-12 h-12" />
                        <p>Aucune configuration réseau trouvée</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  safeArray(filteredConfigurations).map((config) => (
                    <tr key={config.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12 bg-primary/10 flex items-center justify-center">
                              <Network className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{config.materiel_nom}</div>
                            <div className="text-sm opacity-50">{config.adresse_ip}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code className="bg-base-200 px-2 py-1 rounded font-mono">
                          {config.adresse_ip}
                        </code>
                      </td>
                      <td>
                        <div className="font-medium">{config.nom_hote}</div>
                      </td>
                      <td>
                        <span className={`badge badge-sm ${getTypeColor(config.type_equipement)}`}>
                          {config.type_equipement}
                        </span>
                      </td>
                      <td>
                        <code className="bg-base-200 px-2 py-1 rounded font-mono text-sm">
                          {config.sous_reseau}
                        </code>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatutIcon(config.statut_connexion)}
                          <span className={`badge ${getStatutColor(config.statut_connexion)}`}>
                            {config.statut_connexion}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditConfig(config)}
                            className="btn btn-ghost btn-sm btn-square"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            className="btn btn-ghost btn-sm btn-square text-error"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm btn-square"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de formulaire */}
      <ReseauForm
        isOpen={showForm}
        configuration={editingConfig}
        materiels={safeArray(materiels)}
        onSubmit={editingConfig ? handleUpdateConfig : handleCreateConfig}
        onClose={handleCloseForm}
      />
    </div>
  );
}