// // IncidentForm.tsx - Version corrigée avec récupération des utilisateurs
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, AlertCircle, Loader2 } from 'lucide-react';
import { Incident, User as UserType, Materiel, Logiciel, Reseau } from '../types';
import { usersAPI, materielsAPI, logicielsAPI, reseauAPI, handleApiError } from '../services/api';

interface IncidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incidentData: any) => void;
  incident?: Incident;
  currentUser: UserType;
}

const IncidentForm: React.FC<IncidentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  incident,
  currentUser
}) => {
  const [formData, setFormData] = useState({
    description: '',
    date_resolution: '',
    heure_resolution: '',
    priorite: 'moyenne' as 'critique' | 'elevee' | 'moyenne' | 'basse',
    statut: 'ouvert' as 'ouvert' | 'en_cours' | 'resolu' | 'ferme',
    type_incident: '' as '' | 'materiel' | 'logiciel' | 'reseau' | 'mixte',
    utilisateur_signaleur: currentUser?.id || 0,
    materiel: 0,
    logiciel: 0,
    reseau: 0
  });

  const [users, setUsers] = useState<UserType[]>([]);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
  const [reseaux, setReseaux] = useState<Reseau[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  // Formater le nom utilisateur
  const formatUserName = (user: UserType) => {
    if (!user) return 'Utilisateur inconnu';
    
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    if (fullName) {
      return `${fullName} (${user.username || `ID: ${user.id}`})`;
    }
    return user.username || `Utilisateur #${user.id}`;
  };

  // Fonction pour extraire les données de réponse API - CORRIGÉE
  const extractDataFromResponse = (response: any): any[] => {
    if (!response) return [];
    
    console.log('📥 Extraction données depuis:', response);
    
    // Si response est déjà un tableau
    if (Array.isArray(response)) {
      return response;
    }
    
    // Si response a une propriété data
    if (response.data !== undefined) {
      // Cas 1: data est un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
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
        // Essayer d'extraire un tableau des valeurs
        const values = Object.values(response.data);
        if (values.length > 0 && values.every(v => typeof v === 'object')) {
          return values as any[];
        }
      }
    }
    
    // Si response a une propriété results directement
    if (response.results && Array.isArray(response.results)) {
      return response.results;
    }
    
    console.warn('⚠️ Aucune donnée extraite de la réponse');
    return [];
  };

  // Charger les utilisateurs - VERSION CORRIGÉE
  const fetchUsers = async () => {
    try {
      console.log('🔄 Chargement des utilisateurs...');
      setApiErrors(prev => prev.filter(e => !e.includes('Utilisateurs:')));
      
      const response = await usersAPI.getAll();
      console.log('📥 Réponse brute usersAPI:', response);
      
      // Extraire les données selon le format
      const usersData = extractDataFromResponse(response);
      console.log(`✅ ${usersData.length} utilisateur(s) extrait(s)`, usersData);
      
      // Convertir au format UserType
      const formattedUsers: UserType[] = usersData.map((user: any) => ({
        id: user.id || 0,
        username: user.username || `user_${user.id}`,
        first_name: user.first_name || user.prenom || '',
        last_name: user.last_name || user.nom || '',
        email: user.email || '',
        is_active: user.is_active !== undefined ? user.is_active : true,
        date_joined: user.date_joined || user.date_creation || new Date().toISOString(),
        role: user.role || user.role_utilisateur || 'user',
        departement: user.departement || user.service || ''
      }));
      
      setUsers(formattedUsers);
      
      // Si pas d'utilisateurs chargés, ajouter un message d'avertissement
      if (formattedUsers.length === 0) {
        console.warn('⚠️ Aucun utilisateur trouvé dans la réponse API');
        setApiErrors(prev => [...prev, 'Aucun utilisateur trouvé. Utilisez l\'utilisateur courant.']);
        
        // Ajouter l'utilisateur courant comme fallback
        if (currentUser && currentUser.id) {
          setUsers([currentUser]);
          setFormData(prev => ({ ...prev, utilisateur_signaleur: currentUser.id }));
        }
      } else {
        // Définir l'utilisateur par défaut
        const defaultUser = formattedUsers.find(u => u.id === currentUser?.id) || formattedUsers[0];
        if (defaultUser && !formData.utilisateur_signaleur) {
          setFormData(prev => ({ ...prev, utilisateur_signaleur: defaultUser.id }));
        }
      }
      
    } catch (error: any) {
      console.error('❌ Erreur chargement utilisateurs:', error);
      const errorMsg = handleApiError(error);
      setApiErrors(prev => [...prev, `Utilisateurs: ${errorMsg}`]);
      
      // Fallback: utiliser l'utilisateur courant
      if (currentUser && currentUser.id) {
        setUsers([currentUser]);
        setFormData(prev => ({ ...prev, utilisateur_signaleur: currentUser.id }));
      }
    }
  };

  // Charger les matériels
  const fetchMateriels = async () => {
    try {
      console.log('🔄 Chargement des matériels...');
      const response = await materielsAPI.getAll();
      const materielsData = extractDataFromResponse(response);
      console.log(`✅ ${materielsData.length} matériel(s) chargé(s)`);
      setMateriels(materielsData);
    } catch (error: any) {
      console.error('❌ Erreur chargement matériels:', error);
      setApiErrors(prev => [...prev, `Matériels: ${handleApiError(error)}`]);
    }
  };

  // Charger les logiciels
  const fetchLogiciels = async () => {
    try {
      console.log('🔄 Chargement des logiciels...');
      const response = await logicielsAPI.getAll();
      const logicielsData = extractDataFromResponse(response);
      console.log(`✅ ${logicielsData.length} logiciel(s) chargé(s)`);
      setLogiciels(logicielsData);
    } catch (error: any) {
      console.error('❌ Erreur chargement logiciels:', error);
      setApiErrors(prev => [...prev, `Logiciels: ${handleApiError(error)}`]);
    }
  };

  // Charger les réseaux
  const fetchReseaux = async () => {
    try {
      console.log('🔄 Chargement des réseaux...');
      const response = await reseauAPI.getAll();
      const reseauxData = extractDataFromResponse(response);
      console.log(`✅ ${reseauxData.length} réseau(x) chargé(s)`);
      setReseaux(reseauxData);
    } catch (error: any) {
      console.error('❌ Erreur chargement réseaux:', error);
      setApiErrors(prev => [...prev, `Réseaux: ${handleApiError(error)}`]);
    }
  };

  // Charger toutes les données
  const fetchAllData = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    setApiErrors([]);
    
    try {
      console.log('🔄 Début du chargement de toutes les données...');
      
      // Charger en parallèle, mais users en premier (important)
      await Promise.allSettled([
        fetchUsers(),  // Prioritaire
        fetchMateriels(),
        fetchLogiciels(),
        fetchReseaux()
      ]);
      
      console.log('📊 Données chargées:', {
        utilisateurs: users.length,
        matériels: materiels.length,
        logiciels: logiciels.length,
        réseaux: reseaux.length
      });
      
      // Initialiser le formulaire si on a un incident à éditer
      if (incident) {
        console.log('📝 Initialisation avec incident:', incident);
        
        setFormData({
          description: incident.description || '',
          date_resolution: incident.date_resolution?.split('T')[0] || '',
          heure_resolution: incident.date_resolution?.split('T')[1]?.substring(0, 5) || '',
          priorite: incident.priorite || 'moyenne',
          statut: incident.statut || 'ouvert',
          type_incident: incident.type_incident || '',
          utilisateur_signaleur: incident.utilisateur_signaleur || currentUser?.id || 0,
          materiel: incident.materiel || 0,
          logiciel: incident.logiciel || 0,
          reseau: incident.reseau || 0
        });
      } else {
        // Pour un nouvel incident, s'assurer qu'on a un utilisateur par défaut
        if (users.length > 0 && !formData.utilisateur_signaleur) {
          const defaultUser = users.find(u => u.id === currentUser?.id) || users[0];
          if (defaultUser) {
            setFormData(prev => ({ ...prev, utilisateur_signaleur: defaultUser.id }));
          }
        }
      }
      
    } catch (error) {
      console.error('💥 Erreur critique lors du chargement:', error);
      setApiErrors(prev => [...prev, 'Erreur lors du chargement des données']);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les données
  useEffect(() => {
    if (isOpen) {
      fetchAllData();
    } else {
      resetForm();
    }
  }, [isOpen, incident]);

  const resetForm = () => {
    setFormData({
      description: '',
      date_resolution: '',
      heure_resolution: '',
      priorite: 'moyenne',
      statut: 'ouvert',
      type_incident: '',
      utilisateur_signaleur: currentUser?.id || 0,
      materiel: 0,
      logiciel: 0,
      reseau: 0
    });
    setErrors({});
    setApiErrors([]);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) newErrors.description = 'Description requise';
    if (!formData.type_incident) newErrors.type_incident = 'Type d\'incident requis';
    if (!formData.utilisateur_signaleur || formData.utilisateur_signaleur === 0) {
      newErrors.utilisateur_signaleur = 'Utilisateur signaleur requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'utilisateur_signaleur' || name === 'materiel' || name === 'logiciel' || name === 'reseau'
        ? parseInt(value) || 0 
        : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
        utilisateur_signaleur: formData.utilisateur_signaleur
      };

      // Ajouter la date de résolution si complète
      if (formData.date_resolution && formData.heure_resolution) {
        incidentData.date_resolution = `${formData.date_resolution}T${formData.heure_resolution}`;
      } else if (formData.date_resolution) {
        incidentData.date_resolution = `${formData.date_resolution}T00:00`;
      }

      // Ajouter les relations seulement si elles sont définies
      if (formData.materiel > 0) incidentData.materiel = formData.materiel;
      if (formData.logiciel > 0) incidentData.logiciel = formData.logiciel;
      if (formData.reseau > 0) incidentData.reseau = formData.reseau;

      console.log('📤 Soumission incident:', incidentData);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-300 sticky top-0 bg-base-100 z-10">
          <h2 className="text-xl font-bold text-base-content">
            {incident ? 'Modifier l\'incident' : 'Ajouter un Incident'}
          </h2>
          <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages d'erreur API */}
        {apiErrors.length > 0 && (
          <div className="m-4">
            <div className="alert alert-warning">
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
              <span className="text-base-content">Chargement des données...</span>
              <div className="text-sm text-base-content opacity-60 text-center">
                Connexion aux APIs en cours
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Description :</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Décrivez l'incident en détails..."
                disabled={isSubmitting}
              />
              {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
            </div>

            {/* Utilisateur signaleur - SECTION CRITIQUE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Utilisateur signaleur :
                </span>
              </label>
              <select
                name="utilisateur_signaleur"
                value={formData.utilisateur_signaleur}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.utilisateur_signaleur ? 'select-error' : ''}`}
                disabled={isSubmitting || users.length === 0}
              >
                <option value={0}>Sélectionnez un utilisateur</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {formatUserName(user)}
                  </option>
                ))}
              </select>
              {errors.utilisateur_signaleur && <span className="text-error text-sm mt-1">{errors.utilisateur_signaleur}</span>}
              <div className="text-xs text-base-content opacity-60 mt-1">
                {users.length === 0 ? (
                  <span className="text-warning">⚠️ Aucun utilisateur trouvé</span>
                ) : (
                  `${users.length} utilisateur(s) disponible(s)`
                )}
                {users.length === 1 && users[0]?.id === currentUser?.id && (
                  <span className="text-success ml-2">(Utilisateur courant)</span>
                )}
              </div>
            </div>

            {/* Type d'incident */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Type incident :</span>
              </label>
              <select
                name="type_incident"
                value={formData.type_incident}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.type_incident ? 'select-error' : ''}`}
                disabled={isSubmitting}
              >
                <option value="">---------</option>
                <option value="materiel">Matériel</option>
                <option value="logiciel">Logiciel</option>
                <option value="reseau">Réseau</option>
                <option value="mixte">Mixte</option>
              </select>
              {errors.type_incident && <span className="text-error text-sm mt-1">{errors.type_incident}</span>}
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
                  disabled={isSubmitting}
                >
                  <option value="basse">Basse</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="elevee">Élevée</option>
                  <option value="critique">Critique</option>
                </select>
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

            {/* Date et Heure de résolution */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Date création :</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date :</span>
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
                      className="btn btn-outline btn-sm whitespace-nowrap"
                      disabled={isSubmitting}
                    >
                      Aujourd'hui
                    </button>
                  </div>
                </div>

                {/* Heure */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Heure :</span>
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
                      className="btn btn-outline btn-sm whitespace-nowrap"
                      disabled={isSubmitting}
                    >
                      Maintenant
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Relations optionnelles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Matériel concerné */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Matériel :</span>
                </label>
                <select
                  name="materiel"
                  value={formData.materiel}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  disabled={isSubmitting || materiels.length === 0}
                >
                  <option value={0}>Aucun</option>
                  {materiels.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nom} ({item.reference})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-base-content opacity-60 mt-1">
                  {materiels.length} matériel(s)
                </div>
              </div>

              {/* Logiciel concerné */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Logiciel :</span>
                </label>
                <select
                  name="logiciel"
                  value={formData.logiciel}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  disabled={isSubmitting || logiciels.length === 0}
                >
                  <option value={0}>Aucun</option>
                  {logiciels.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nom} {item.version}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-base-content opacity-60 mt-1">
                  {logiciels.length} logiciel(s)
                </div>
              </div>

              {/* Réseau concerné */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Réseau :</span>
                </label>
                <select
                  name="reseau"
                  value={formData.reseau}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  disabled={isSubmitting || reseaux.length === 0}
                >
                  <option value={0}>Aucun</option>
                  {reseaux.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nom_hote} ({item.adresse_ip})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-base-content opacity-60 mt-1">
                  {reseaux.length} équipement(s)
                </div>
              </div>
            </div>

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
                className="btn btn-primary"
                disabled={isSubmitting || users.length === 0}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {incident ? 'Modification...' : 'Création...'}
                  </span>
                ) : (
                  incident ? 'Modifier' : 'Créer'
                )} l'incident
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default IncidentForm;






