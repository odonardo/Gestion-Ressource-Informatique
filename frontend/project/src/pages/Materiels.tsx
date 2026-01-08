
import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Filter, Download, Upload, Edit, Trash2, CheckSquare, Square, X } from 'lucide-react';
import { Materiel, Fournisseur } from '../types';
import MaterielForm from '../components/MaterielForm';
import { materielsAPI, fournisseursAPI } from '../services/api';

// Fonctions helper pour la sécurité des tableaux
const safeArray = (data: any): Materiel[] => {
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): Materiel[] => {
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

const Materiels: React.FC = () => {
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [filteredMateriels, setFilteredMateriels] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterEtat, setFilterEtat] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMateriel, setEditingMateriel] = useState<Materiel | undefined>();
  const [selectedMateriels, setSelectedMateriels] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

  useEffect(() => {
    fetchMateriels();
    fetchFournisseurs();
  }, []);

  useEffect(() => {
    filterMateriels();
  }, [materiels, searchTerm, filterEtat]);

  useEffect(() => {
    if (filteredMateriels.length > 0 && selectedMateriels.length === filteredMateriels.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedMateriels, filteredMateriels]);

  const fetchMateriels = async () => {
    try {
      setLoading(true);
      const response = await materielsAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      console.log('📦 Matériels chargés:', extractedData);
      setMateriels(extractedData);
    } catch (err: any) {
      console.error('❌ Erreur chargement matériels:', err);
      setError('Erreur lors du chargement des matériels');
      showMessage('error', 'Erreur lors du chargement des matériels');
    } finally {
      setLoading(false);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const response = await fournisseursAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      console.log('🏢 Fournisseurs chargés:', extractedData);
      setFournisseurs(extractedData);
    } catch (err: any) {
      console.error('❌ Erreur chargement fournisseurs:', err);
    }
  };

  const filterMateriels = () => {
    let filtered = safeArray(materiels);

    if (searchTerm) {
      filtered = safeFilter(filtered, m => 
        m.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.utilisateur_attribue && m.utilisateur_attribue.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterEtat) {
      filtered = safeFilter(filtered, m => m.etat === filterEtat);
    }

    setFilteredMateriels(filtered);
    setSelectedMateriels([]);
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // CORRECTION : handleSubmit simplifiée et corrigée
  const handleSubmit = async (materielData: Omit<Materiel, 'id'>) => {
    try {
      console.group('🔧 DEBUG Materiel Submission');
      console.log('Données du formulaire:', materielData);
      
      // Formater les données pour l'API - CORRECTION ICI
      const apiData: any = {
        nom: materielData.nom?.trim() || '',
        reference: materielData.reference?.trim() || '',
        date_achat: materielData.date_achat,
        etat: materielData.etat || 'fonctionnel',
        service_attribue: materielData.service_attribue || '',
        utilisateur_attribue: materielData.utilisateur_attribue?.trim() || ''
      };

      // Ajouter le fournisseur seulement s'il est défini
      if (materielData.fournisseur) {
        apiData.fournisseur = materielData.fournisseur;
      }
      
      console.log('📤 Données API formatées:', apiData);
      console.groupEnd();

      if (editingMateriel) {
        const response = await materielsAPI.update(editingMateriel.id, apiData);
        console.log('✅ Réponse update:', response.data);
        showMessage('success', 'Matériel modifié avec succès');
      } else {
        const response = await materielsAPI.create(apiData);
        console.log('✅ Réponse create:', response.data);
        showMessage('success', 'Matériel créé avec succès');
      }
      
      fetchMateriels();
      setIsFormOpen(false);
      setEditingMateriel(undefined);
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

  const toggleSelectMateriel = (id: number) => {
    setSelectedMateriels(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedMateriels([]);
    } else {
      const allIds = filteredMateriels.map(m => m.id);
      setSelectedMateriels(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedMateriels.length === 0) {
      showMessage('error', 'Aucun matériel sélectionné');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedMateriels.length} matériel(s) ?`)) {
      try {
        for (const id of selectedMateriels) {
          await materielsAPI.delete(id);
        }
        
        showMessage('success', `${selectedMateriels.length} matériel(s) supprimé(s) avec succès`);
        setSelectedMateriels([]);
        fetchMateriels();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression des matériels');
      }
    }
  };

  const handleEditSelected = () => {
    if (selectedMateriels.length === 0) {
      showMessage('error', 'Aucun matériel sélectionné');
      return;
    }

    if (selectedMateriels.length === 1) {
      const materiel = materiels.find(m => m.id === selectedMateriels[0]);
      if (materiel) {
        handleEdit(materiel);
      }
    } else {
      showMessage('info', `Édition multiple de ${selectedMateriels.length} matériels`);
    }
  };

  const handleEdit = (materiel: Materiel) => {
    setEditingMateriel(materiel);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
      try {
        await materielsAPI.delete(id);
        showMessage('success', 'Matériel supprimé avec succès');
        fetchMateriels();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const handleAddNew = () => {
    setEditingMateriel(undefined);
    setIsFormOpen(true);
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredMateriels.map(m => ({
        Nom: m.nom,
        Référence: m.reference,
        État: getEtatText(m.etat),
        Service: m.service_attribue,
        Utilisateur: m.utilisateur_attribue || 'Non attribué',
        'Date d\'achat': m.date_achat ? new Date(m.date_achat).toLocaleDateString('fr-FR') : 'Non spécifiée'
      }));

      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `materiels_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showMessage('success', 'Export CSV réussi !');
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'export');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterEtat('');
    setSelectedMateriels([]);
  };

  const getEtatBadge = (etat: string) => {
    const badges = {
      fonctionnel: 'badge-success',
      en_panne: 'badge-error',
      repare: 'badge-warning',
      obsolete: 'badge-neutral'
    };
    return badges[etat as keyof typeof badges] || 'badge-neutral';
  };

  const getEtatText = (etat: string) => {
    const texts = {
      fonctionnel: 'Fonctionnel',
      en_panne: 'En panne',
      repare: 'Réparé',
      obsolete: 'Obsolète'
    };
    return texts[etat as keyof typeof texts] || etat;
  };

  if (loading) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des matériels...</p>
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
        } mb-4`}>
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
          <h1 className="text-3xl font-bold text-base-content">💻 Gestion des Matériels</h1>
          <p className="text-base-content opacity-60 mt-1">
            Liste et gestion du parc informatique ({safeArray(filteredMateriels).length} matériels)
            {selectedMateriels.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedMateriels.length} sélectionné(s))
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
            Nouveau matériel
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
                  placeholder="Nom, référence, utilisateur..."
                  className="input input-bordered w-full pl-10 bg-base-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📊 État</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterEtat}
                onChange={(e) => setFilterEtat(e.target.value)}
              >
                <option value="">Tous les états</option>
                <option value="fonctionnel">Fonctionnel</option>
                <option value="en_panne">En panne</option>
                <option value="repare">Réparé</option>
                <option value="obsolete">Obsolète</option>
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
                {safeArray(filteredMateriels).length} / {safeArray(materiels).length} matériels
              </div>
            </div>
          </div>

          {/* Actions de sélection */}
          {selectedMateriels.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-semibold text-primary text-lg">
                      {selectedMateriels.length} matériel(s) sélectionné(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier ({selectedMateriels.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-outline btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer ({selectedMateriels.length})
                  </button>
                  <button
                    onClick={() => setSelectedMateriels([])}
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

      {/* Tableau des matériels */}
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
                  <th className="font-bold">Référence</th>
                  <th className="font-bold">État</th>
                  <th className="font-bold">Service</th>
                  <th className="font-bold">Utilisateur</th>
                  <th className="font-bold">Date d'achat</th>
                  <th className="font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredMateriels).map((materiel) => (
                  <tr key={materiel.id} className="hover">
                    <td className="text-center">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
                          checked={selectedMateriels.includes(materiel.id)}
                          onChange={() => toggleSelectMateriel(materiel.id)}
                        />
                      </div>
                    </td>
                    <td className="font-semibold">{materiel.nom}</td>
                    <td>
                      <code className="bg-base-100 px-2 py-1 rounded text-sm">
                        {materiel.reference}
                      </code>
                    </td>
                    <td>
                      <div className={`badge ${getEtatBadge(materiel.etat)} badge-lg`}>
                        {getEtatText(materiel.etat)}
                      </div>
                    </td>
                    <td>{materiel.service_attribue}</td>
                    <td>
                      {materiel.utilisateur_attribue ? (
                        <span className="font-medium">{materiel.utilisateur_attribue}</span>
                      ) : (
                        <span className="text-base-content opacity-50">-</span>
                      )}
                    </td>
                    <td>
                      <span className="text-sm">
                        {materiel.date_achat ? new Date(materiel.date_achat).toLocaleDateString('fr-FR') : '-'}
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
                        <button
                          onClick={() => handleEdit(materiel)}
                          className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(materiel.id)}
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

          {safeArray(filteredMateriels).length === 0 && (
            <div className="text-center py-12">
              <div className="text-base-content opacity-40 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Aucun matériel trouvé</p>
                <p className="text-sm mt-2">
                  {searchTerm || filterEtat 
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucun matériel n'est enregistré dans le système"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire de matériel */}
      <MaterielForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMateriel(undefined);
        }}
        onSubmit={handleSubmit}
        materiel={editingMateriel}
        fournisseurs={fournisseurs}
      />
    </div>
  );
};

export default Materiels;