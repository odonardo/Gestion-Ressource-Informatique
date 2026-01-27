import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Filter, Edit, Trash2, Wifi, Server, Router, Network } from 'lucide-react';
import { EquipementReseau } from '../types';
import ReseauForm from '../components/ReseauForm';
import { reseauAPI } from '../services/api';

const Reseau: React.FC = () => {
  const [equipements, setEquipements] = useState<EquipementReseau[]>([]);
  const [filteredEquipements, setFilteredEquipements] = useState<EquipementReseau[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipement, setEditingEquipement] = useState<EquipementReseau | undefined>();

  useEffect(() => {
    fetchEquipements();
  }, []);

  useEffect(() => {
    filterEquipements();
  }, [equipements, searchTerm, filterType]);

  const fetchEquipements = async () => {
    try {
      setLoading(true);
      const response = await reseauAPI.getAll();
      setEquipements(response.data || response);
    } catch (err: any) {
      setError('Erreur lors du chargement des équipements réseau');
      showMessage('error', 'Erreur lors du chargement des équipements réseau');
    } finally {
      setLoading(false);
    }
  };

  const filterEquipements = () => {
    let filtered = equipements;

    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.localisation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter(e => e.type === filterType);
    }

    setFilteredEquipements(filtered);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (equipementData: Omit<EquipementReseau, 'id'>) => {
    try {
      if (editingEquipement) {
        await reseauAPI.update(editingEquipement.id, equipementData);
        showMessage('success', 'Équipement réseau modifié avec succès');
      } else {
        await reseauAPI.create(equipementData);
        showMessage('success', 'Équipement réseau créé avec succès');
      }
      fetchEquipements();
      setIsFormOpen(false);
      setEditingEquipement(undefined);
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (equipement: EquipementReseau) => {
    setEditingEquipement(equipement);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement réseau ?')) {
      try {
        await reseauAPI.delete(id);
        showMessage('success', 'Équipement réseau supprimé avec succès');
        fetchEquipements();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const handleAddNew = () => {
    setEditingEquipement(undefined);
    setIsFormOpen(true);
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      routeur: 'badge-primary',
      switch: 'badge-secondary',
      serveur: 'badge-accent',
      point_acces: 'badge-warning',
      firewall: 'badge-error',
      autre: 'badge-neutral'
    };
    return badges[type as keyof typeof badges] || 'badge-neutral';
  };

  const getTypeText = (type: string) => {
    const texts = {
      routeur: 'Routeur',
      switch: 'Switch',
      serveur: 'Serveur',
      point_acces: 'Point d\'accès',
      firewall: 'Firewall',
      autre: 'Autre'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      routeur: <Router className="h-4 w-4" />,
      switch: <Network className="h-4 w-4" />, // Changé de Switch à Network
      serveur: <Server className="h-4 w-4" />,
      point_acces: <Wifi className="h-4 w-4" />,
      firewall: <Server className="h-4 w-4" />,
      autre: <Wifi className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Wifi className="h-4 w-4" />;
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      actif: 'badge-success',
      inactif: 'badge-error',
      maintenance: 'badge-warning'
    };
    return badges[statut as keyof typeof badges] || 'badge-neutral';
  };

  const getStatutText = (statut: string) => {
    const texts = {
      actif: 'Actif',
      inactif: 'Inactif',
      maintenance: 'Maintenance'
    };
    return texts[statut as keyof typeof texts] || statut;
  };

  if (loading) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des équipements réseau...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Message de notification */}
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : message.type === 'error' ? 'alert-error' : 'alert-info'} mb-4`}>
          <span>{message.text}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">🌐 Gestion du Réseau</h1>
          <p className="text-base-content opacity-60 mt-1">
            Infrastructure et équipements réseau ({filteredEquipements.length} équipements)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddNew}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel équipement
          </button>
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
                  placeholder="Nom, modèle, IP..."
                  className="input input-bordered w-full pl-10 bg-base-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📊 Type</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tous les types</option>
                <option value="routeur">Routeur</option>
                <option value="switch">Switch</option>
                <option value="serveur">Serveur</option>
                <option value="point_acces">Point d'accès</option>
                <option value="firewall">Firewall</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">🔄 Actions</span>
              </label>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('');
                }}
                className="btn btn-outline w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </button>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📈 Statistiques</span>
              </label>
              <div className="text-sm text-base-content opacity-70">
                {equipements.filter(e => e.statut === 'actif').length} équipements actifs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des équipements réseau */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-300">
                  <th className="font-bold">Nom</th>
                  <th className="font-bold">Type</th>
                  <th className="font-bold">Modèle</th>
                  <th className="font-bold">Adresse IP</th>
                  <th className="font-bold">Localisation</th>
                  <th className="font-bold">Statut</th>
                  <th className="font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipements.map((equipement) => (
                  <tr key={equipement.id} className="hover:bg-base-300 transition-colors">
                    <td className="font-semibold">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(equipement.type)}
                        {equipement.nom}
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${getTypeBadge(equipement.type)}`}>
                        {getTypeText(equipement.type)}
                      </div>
                    </td>
                    <td>{equipement.modele}</td>
                    <td>
                      <code className="bg-base-100 px-2 py-1 rounded text-sm">
                        {equipement.ip}
                      </code>
                    </td>
                    <td>{equipement.localisation}</td>
                    <td>
                      <div className={`badge ${getStatutBadge(equipement.statut)}`}>
                        {getStatutText(equipement.statut)}
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-1">
                        {/* <button
                          className="btn btn-sm btn-primary btn-outline"
                          title="Voir les détails"
                        >
                          <Eye className="h-3 w-3" />
                        </button> */}
                        <button
                          onClick={() => handleEdit(equipement)}
                          className="btn btn-sm btn-secondary btn-outline"
                          title="Modifier"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(equipement.id)}
                          className="btn btn-sm btn-error btn-outline"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEquipements.length === 0 && (
            <div className="text-center py-12">
              <div className="text-base-content opacity-40 mb-4">
                <Wifi className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Aucun équipement réseau trouvé</p>
                <p className="text-sm mt-2">
                  {searchTerm || filterType
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucun équipement réseau n'est enregistré dans le système"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire d'équipement réseau */}
      <ReseauForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEquipement(undefined);
        }}
        onSubmit={handleSubmit}
        equipement={editingEquipement}
      />
    </div>
  );
};

export default Reseau;

