
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Building, Phone, Mail, MapPin, X, CheckSquare, Square } from 'lucide-react';
import { Fournisseur } from '../types';
import FournisseurForm from '../components/FournisseurForm';
import { fournisseursAPI } from '../services/api';

// Fonctions helper pour la sécurité des tableaux
const safeArray = (data: any): Fournisseur[] => {
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): Fournisseur[] => {
  if (!Array.isArray(array)) return [];
  return array.filter(condition);
};

const extractDataFromResponse = (response: any): Fournisseur[] => {
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

const Fournisseurs: React.FC = () => {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [filteredFournisseurs, setFilteredFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | undefined>();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [selectedFournisseurs, setSelectedFournisseurs] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  useEffect(() => {
    filterFournisseurs();
  }, [fournisseurs, searchTerm, filterType]);

  useEffect(() => {
    // Mettre à jour l'état de sélection globale
    if (filteredFournisseurs.length > 0 && selectedFournisseurs.length === filteredFournisseurs.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedFournisseurs, filteredFournisseurs]);

  const fetchFournisseurs = async () => {
    try {
      setLoading(true);
      const response = await fournisseursAPI.getAll();
      const extractedData = extractDataFromResponse(response);
      setFournisseurs(extractedData);
    } catch (err: any) {
      setError('Erreur lors du chargement des fournisseurs');
      showMessage('error', 'Erreur lors du chargement des fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  const filterFournisseurs = () => {
    let filtered = safeArray(fournisseurs);

    if (searchTerm) {
      filtered = safeFilter(filtered, f => 
        f.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.adresse?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      filtered = safeFilter(filtered, f => f.type_fournisseur === filterType);
    }

    setFilteredFournisseurs(filtered);
    // Réinitialiser les sélections quand les filtres changent
    setSelectedFournisseurs([]);
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Gestion de la sélection individuelle
  const toggleSelectFournisseur = (id: number) => {
    setSelectedFournisseurs(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Gestion de la sélection globale
  const toggleSelectAll = () => {
    if (isSelectAll) {
      // Désélectionner tous
      setSelectedFournisseurs([]);
    } else {
      // Sélectionner tous les fournisseurs filtrés
      const allIds = filteredFournisseurs.map(f => f.id);
      setSelectedFournisseurs(allIds);
    }
  };

  // Supprimer les fournisseurs sélectionnés
  const handleDeleteSelected = async () => {
    if (selectedFournisseurs.length === 0) {
      showMessage('error', 'Aucun fournisseur sélectionné');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFournisseurs.length} fournisseur(s) ?`)) {
      try {
        // Supprimer chaque fournisseur sélectionné
        for (const id of selectedFournisseurs) {
          await fournisseursAPI.delete(id);
        }
        
        showMessage('success', `${selectedFournisseurs.length} fournisseur(s) supprimé(s) avec succès`);
        setSelectedFournisseurs([]);
        fetchFournisseurs();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression des fournisseurs');
      }
    }
  };

  // Modifier les fournisseurs sélectionnés
  const handleEditSelected = () => {
    if (selectedFournisseurs.length === 0) {
      showMessage('error', 'Aucun fournisseur sélectionné');
      return;
    }

    if (selectedFournisseurs.length === 1) {
      // Si un seul fournisseur sélectionné, ouvrir l'édition normale
      const fournisseur = fournisseurs.find(f => f.id === selectedFournisseurs[0]);
      if (fournisseur) {
        handleEdit(fournisseur);
      }
    } else {
      showMessage('info', `Édition multiple de ${selectedFournisseurs.length} fournisseurs`);
    }
  };

  const handleSubmit = async (fournisseurData: Omit<Fournisseur, 'id'>) => {
    try {
      if (editingFournisseur) {
        await fournisseursAPI.update(editingFournisseur.id, fournisseurData);
        showMessage('success', 'Fournisseur modifié avec succès');
      } else {
        await fournisseursAPI.create(fournisseurData);
        showMessage('success', 'Fournisseur créé avec succès');
      }
      fetchFournisseurs();
      setIsFormOpen(false);
      setEditingFournisseur(undefined);
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (fournisseur: Fournisseur) => {
    setEditingFournisseur(fournisseur);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      try {
        await fournisseursAPI.delete(id);
        showMessage('success', 'Fournisseur supprimé avec succès');
        fetchFournisseurs();
      } catch (error) {
        showMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const handleAddNew = () => {
    setEditingFournisseur(undefined);
    setIsFormOpen(true);
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredFournisseurs.map(f => ({
        Nom: f.nom,
        'Type Fournisseur': getTypeText(f.type_fournisseur || 'autre'),
        Email: f.contact_email,
        Téléphone: f.telephone,
        Adresse: f.adresse
      }));

      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `fournisseurs_${new Date().toISOString().split('T')[0]}.csv`);
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
    setFilterType('');
    setSelectedFournisseurs([]);
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      materiel: 'badge-primary',
      logiciel: 'badge-success',
      mixte: 'badge-neutral'
    };

    return badges[type as keyof typeof badges] || 'badge-neutral';
  };

  const getTypeText = (type: string) => {
    const texts = {
      materiel: 'Matériel',
      logiciel: 'Logiciel',
      mixte: 'Mixte'
    };
    return texts[type as keyof typeof texts] || type;
  };

  if (loading) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Chargement des fournisseurs...</p>
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
          <h1 className="text-3xl font-bold text-base-content">🏢 Gestion des Fournisseurs</h1>
          <p className="text-base-content opacity-60 mt-1">
            Liste et gestion des partenaires fournisseurs ({safeArray(filteredFournisseurs).length} fournisseurs)
            {selectedFournisseurs.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedFournisseurs.length} sélectionné(s))
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Export */}
          <button
            onClick={handleExport}
            className="btn btn-outline btn-sm"
            title="Exporter la liste"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>

          {/* Ajouter */}
          <button
            onClick={handleAddNew}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau fournisseur
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">🔍 Rechercher</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  placeholder="Nom, email, téléphone..."
                  className="input input-bordered w-full pl-10 bg-base-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtre par type */}
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
                <option value="materiel">Matériel</option>
                <option value="logiciel">Logiciel</option>
                <option value="mixte">Mixte</option>
              </select>
            </div>

            {/* Réinitialiser */}
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

            {/* Statistiques */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">📈 Statistiques</span>
              </label>
              <div className="text-sm text-base-content opacity-70">
                {safeArray(filteredFournisseurs).length} / {safeArray(fournisseurs).length} fournisseurs
              </div>
            </div>
          </div>

          {/* Actions de sélection */}
          {selectedFournisseurs.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-semibold text-primary text-lg">
                      {selectedFournisseurs.length} fournisseur(s) sélectionné(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier ({selectedFournisseurs.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-outline btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer ({selectedFournisseurs.length})
                  </button>
                  <button
                    onClick={() => setSelectedFournisseurs([])}
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

      {/* Tableau des fournisseurs */}
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
                  <th className="font-bold">Type</th>
                  <th className="font-bold">Email</th>
                  <th className="font-bold">Téléphone</th>
                  <th className="font-bold">Adresse</th>
                  <th className="font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredFournisseurs).map((fournisseur) => (
                  <tr key={fournisseur.id} className="hover">
                    <td className="text-center">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
                          checked={selectedFournisseurs.includes(fournisseur.id)}
                          onChange={() => toggleSelectFournisseur(fournisseur.id)}
                        />
                      </div>
                    </td>
                    <td className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" />
                        {fournisseur.nom}
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${getTypeBadge(fournisseur.type_fournisseur || 'autre')}`}>
                        {getTypeText(fournisseur.type_fournisseur || 'autre')}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 opacity-70" />
                        {fournisseur.contact_email || 'Non spécifié'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 opacity-70" />
                        {fournisseur.telephone || 'Non spécifié'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 max-w-xs">
                        <MapPin className="h-3 w-3 opacity-70 flex-shrink-0" />
                        <span className="truncate">{fournisseur.adresse || 'Non spécifiée'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => handleEdit(fournisseur)}
                          className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(fournisseur.id)}
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

          {safeArray(filteredFournisseurs).length === 0 && (
            <div className="text-center py-12">
              <div className="text-base-content opacity-40 mb-4">
                <Building className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Aucun fournisseur trouvé</p>
                <p className="text-sm mt-2">
                  {searchTerm || filterType
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucun fournisseur n'est enregistré dans le système"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire de fournisseur */}
      <FournisseurForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingFournisseur(undefined);
        }}
        onSubmit={handleSubmit}
        fournisseur={editingFournisseur}
      />
    </div>
  );
};

export default Fournisseurs;