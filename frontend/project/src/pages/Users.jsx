// pages/Users.jsx - VERSION CORRIGÉE POUR VITE
import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, User, Shield, UserCheck, Briefcase, Users as UsersIcon, Loader2, Eye, X, Mail, Calendar, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Renommer le composant pour éviter le conflit avec l'import Users
const UsersPage = () => {
  const { user: currentUser, logout, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // URL de l'API - CORRIGÉ POUR VITE
  // Utiliser import.meta.env au lieu de process.env
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Rôles disponibles (doivent correspondre à ceux de votre backend)
  const availableRoles = [
    { value: 'utilisateur', label: 'Utilisateur Standard', icon: <User className="h-4 w-4" /> },
    { value: 'technicien', label: 'Technicien', icon: <UserCheck className="h-4 w-4" /> },
    { value: 'secretaire', label: 'Secrétaire', icon: <Briefcase className="h-4 w-4" /> },
    { value: 'directeur', label: 'Directeur', icon: <Briefcase className="h-4 w-4" /> },
    { value: 'admin', label: 'Administrateur', icon: <Shield className="h-4 w-4" /> },
  ];

  // Départements disponibles
  const departements = [
    'Direction',
    'Comptabilité',
    'Ressources Humaines',
    'Informatique',
    'Secrétariat',
    'Archives',
    'Pédagogie',
    'Maintenance',
    'Autre'
  ];

  // Fonction pour extraire les données de la réponse API
  const extractDataFromResponse = (response) => {
    if (!response) return [];
    
    if (response.data !== undefined) {
      if (Array.isArray(response.data)) return response.data;
      if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
      if (typeof response.data === 'object') {
        const values = Object.values(response.data);
        if (values.length > 0 && Array.isArray(values[0])) return values[0];
      }
    }
    
    return Array.isArray(response) ? response : [];
  };

  // Charger les utilisateurs depuis l'API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const authToken = token || localStorage.getItem('auth_token');
      
      console.log('🔄 Chargement des utilisateurs...');
      console.log('🔑 Token disponible:', !!authToken);
      console.log('🌐 URL API:', API_URL);
      
      // Essayer plusieurs endpoints possibles pour Django
      const endpoints = [
        '/api/utilisateurs/',            // Endpoint principal
        '/api/users/',                   // Alternative standard
        '/api/auth/users/',              // Django REST Auth
        '/api/profils/',                 // Profils utilisateurs
      ];
      
      let usersData = [];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Tentative endpoint: ${endpoint}`);
          
          const response = await axios.get(`${API_URL}${endpoint}`, {
            headers: {
              'Authorization': `Token ${authToken}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000
          });
          
          console.log(`✅ Réponse ${endpoint}:`, response.status);
          
          const extractedData = extractDataFromResponse(response);
          console.log(`📊 Données extraites: ${extractedData.length} éléments`);
          
          if (extractedData.length > 0) {
            usersData = extractedData;
            console.log(`✅ ${usersData.length} utilisateurs trouvés via ${endpoint}`);
            break;
          }
        } catch (error) {
          console.log(`❌ Endpoint ${endpoint} échoué:`, 
            error.response?.status || error.code, 
            error.message
          );
          continue;
        }
      }
      
      // Si aucun endpoint ne fonctionne, montrer un message
      if (usersData.length === 0) {
        console.warn('⚠️ Aucun utilisateur trouvé via API');
        showMessage('warning', 'Aucun utilisateur trouvé. Vérifiez la connexion à l\'API.');
        
        // Données de démonstration pour le développement
        const testUsers = [
          {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            first_name: 'Admin',
            last_name: 'System',
            role: 'admin',
            departement: 'Informatique',
            telephone: '+261 32 12 345 67',
            date_joined: '2024-01-01T00:00:00Z',
            is_active: true,
            is_staff: true,
            is_superuser: true
          },
          {
            id: 2,
            username: 'technicien1',
            email: 'technicien@example.com',
            first_name: 'Jean',
            last_name: 'Technicien',
            role: 'technicien',
            departement: 'Informatique',
            telephone: '+261 33 12 345 67',
            date_joined: '2024-01-02T00:00:00Z',
            is_active: true,
            is_staff: false,
            is_superuser: false
          }
        ];
        
        usersData = testUsers;
      }
      
      // Formater les données de manière cohérente
      const formattedUsers = usersData.map(user => {
        console.log('📋 Formatage utilisateur:', user);
        
        // Déterminer le rôle
        let userRole = 'utilisateur';
        if (user.role) {
          userRole = user.role;
        } else if (user.groups && user.groups.length > 0) {
          const groupNames = user.groups.map(g => 
            typeof g === 'object' ? g.name?.toLowerCase() : g.toLowerCase()
          );
          if (groupNames.includes('admin')) userRole = 'admin';
          else if (groupNames.includes('technicien')) userRole = 'technicien';
          else if (groupNames.includes('directeur')) userRole = 'directeur';
          else if (groupNames.includes('secretaire')) userRole = 'secretaire';
        } else if (user.is_staff || user.is_superuser) {
          userRole = 'admin';
        }
        
        // Déterminer le département
        let userDepartement = 'Non spécifié';
        if (user.departement) {
          userDepartement = user.departement;
        } else if (user.profile?.departement) {
          userDepartement = user.profile.departement;
        } else if (user.department) {
          userDepartement = user.department;
        }
        
        // Téléphone
        let userTelephone = '';
        if (user.telephone) {
          userTelephone = user.telephone;
        } else if (user.profile?.telephone) {
          userTelephone = user.profile.telephone;
        } else if (user.phone) {
          userTelephone = user.phone;
        }
        
        return {
          id: user.id || 0,
          username: user.username || 'Non spécifié',
          email: user.email || `${user.username || 'user'}@example.com`,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          full_name: user.full_name || 
                     `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
                     user.username ||
                     'Utilisateur sans nom',
          role: userRole,
          departement: userDepartement,
          telephone: userTelephone,
          date_joined: user.date_joined || new Date().toISOString(),
          is_active: user.is_active !== false,
          is_staff: user.is_staff || false,
          is_superuser: user.is_superuser || false,
          last_login: user.last_login || null,
          groups: user.groups || [],
          profile: user.profile || {}
        };
      });
      
      console.log('📊 Utilisateurs formatés:', formattedUsers);
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response?.status === 401) {
        showMessage('error', 'Session expirée. Veuillez vous reconnecter.');
        setTimeout(() => logout(), 2000);
      } else if (error.response?.status === 403) {
        showMessage('error', 'Vous n\'avez pas les permissions nécessaires pour voir les utilisateurs.');
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        showMessage('error', 'Impossible de se connecter au serveur. Vérifiez votre connexion.');
      } else if (error.code === 'ETIMEDOUT') {
        showMessage('error', 'Le serveur met trop de temps à répondre.');
      } else {
        showMessage('error', `Erreur: ${error.message || 'Impossible de charger les utilisateurs'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'directeur') {
      fetchUsers();
    }
  }, [currentUser]);

  // Filtrer les utilisateurs lorsque les critères changent
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  // Gérer la sélection de tous les utilisateurs
  useEffect(() => {
    if (filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedUsers, filteredUsers]);

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.departement?.toLowerCase().includes(term) ||
        u.full_name?.toLowerCase().includes(term) ||
        u.telephone?.includes(searchTerm) ||
        u.first_name?.toLowerCase().includes(term) ||
        u.last_name?.toLowerCase().includes(term)
      );
    }

    if (filterRole) {
      filtered = filtered.filter(u => u.role === filterRole);
    }

    setFilteredUsers(filtered);
    setSelectedUsers([]);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedUsers([]);
    } else {
      const allIds = filteredUsers.map(u => u.id);
      setSelectedUsers(allIds);
    }
  };

  const handleSubmit = async (userData) => {
    setIsSubmitting(true);
    try {
      const authToken = token || localStorage.getItem('auth_token');
      
      // Préparer les données pour l'API Django
      const apiData = {
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        is_active: true
      };
      
      // Ajouter le mot de passe seulement pour la création
      if (!editingUser) {
        apiData.password = userData.password;
      }
      
      if (editingUser) {
        // Modifier un utilisateur existant
        console.log('✏️ Modification utilisateur:', editingUser.id, apiData);
        
        // Essayer plusieurs endpoints pour la modification
        const endpoints = [
          `/api/utilisateurs/${editingUser.id}/`,
          `/api/users/${editingUser.id}/`
        ];
        
        let updateSuccess = false;
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.put(
              `${API_URL}${endpoint}`, 
              apiData, 
              {
                headers: {
                  'Authorization': `Token ${authToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            
            console.log('✅ Utilisateur modifié via', endpoint, response.data);
            updateSuccess = true;
            
            // Mettre à jour le profil si nécessaire
            if (userData.role !== 'utilisateur' || userData.departement || userData.telephone) {
              try {
                const profileData = {
                  user: editingUser.id,
                  role: userData.role,
                  departement: userData.departement,
                  telephone: userData.telephone
                };
                
                // Essayer de mettre à jour ou créer le profil
                await axios.post(
                  `${API_URL}/api/profils/`, 
                  profileData,
                  {
                    headers: {
                      'Authorization': `Token ${authToken}`,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                console.log('✅ Profil utilisateur mis à jour');
              } catch (profileError) {
                console.warn('⚠️ Erreur mise à jour profil:', profileError.message);
              }
            }
            
            break;
          } catch (error) {
            console.log(`❌ Endpoint ${endpoint} échoué:`, error.message);
            continue;
          }
        }
        
        if (!updateSuccess) {
          throw new Error('Impossible de modifier l\'utilisateur');
        }
        
        showMessage('success', 'Utilisateur modifié avec succès');
        
      } else {
        // Créer un nouvel utilisateur
        console.log('🆕 Création utilisateur:', apiData);
        
        // Essayer plusieurs endpoints pour la création
        const endpoints = [
          '/api/utilisateurs/',
          '/api/users/'
        ];
        
        let createdUser = null;
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.post(
              `${API_URL}${endpoint}`, 
              apiData, 
              {
                headers: {
                  'Authorization': `Token ${authToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            
            console.log('✅ Utilisateur créé via', endpoint, response.data);
            createdUser = response.data;
            
            // Créer le profil utilisateur si nécessaire
            if (createdUser.id && (userData.role !== 'utilisateur' || userData.departement || userData.telephone)) {
              try {
                const profileData = {
                  user: createdUser.id,
                  role: userData.role,
                  departement: userData.departement,
                  telephone: userData.telephone
                };
                
                await axios.post(
                  `${API_URL}/api/profils/`, 
                  profileData,
                  {
                    headers: {
                      'Authorization': `Token ${authToken}`,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                console.log('✅ Profil utilisateur créé');
              } catch (profileError) {
                console.warn('⚠️ Erreur création profil:', profileError.message);
                // Continuer même si le profil n'a pas pu être créé
              }
            }
            
            break;
          } catch (error) {
            console.log(`❌ Endpoint ${endpoint} échoué:`, error.message);
            continue;
          }
        }
        
        if (!createdUser) {
          throw new Error('Impossible de créer l\'utilisateur');
        }
        
        showMessage('success', 'Utilisateur créé avec succès');
      }
      
      // Recharger la liste des utilisateurs
      await fetchUsers();
      setIsFormOpen(false);
      setEditingUser(null);
      
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      
      let errorMessage = 'Erreur lors de la sauvegarde';
      
      if (error.response?.data) {
        console.error('📋 Détails erreur API:', error.response.data);
        
        // Traiter les erreurs Django REST Framework
        if (error.response.data.username) {
          errorMessage = `Nom d'utilisateur: ${Array.isArray(error.response.data.username) ? error.response.data.username[0] : error.response.data.username}`;
        } else if (error.response.data.email) {
          errorMessage = `Email: ${Array.isArray(error.response.data.email) ? error.response.data.email[0] : error.response.data.email}`;
        } else if (error.response.data.password) {
          errorMessage = `Mot de passe: ${Array.isArray(error.response.data.password) ? error.response.data.password[0] : error.response.data.password}`;
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ');
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === 'object') {
          const errors = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          errorMessage = `Erreurs: ${errors}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showMessage('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    console.log('✏️ Édition utilisateur:', user);
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsViewingDetails(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      showMessage('error', 'Aucun utilisateur sélectionné');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir désactiver ${selectedUsers.length} utilisateur(s) ?`)) {
      try {
        const authToken = token || localStorage.getItem('auth_token');
        let successCount = 0;
        
        for (const id of selectedUsers) {
          if (id === currentUser?.id) {
            showMessage('error', 'Vous ne pouvez pas vous désactiver vous-même');
            continue;
          }
          
          // Essayer plusieurs endpoints
          const endpoints = [
            `/api/utilisateurs/${id}/`,
            `/api/users/${id}/`
          ];
          
          let deactivated = false;
          
          for (const endpoint of endpoints) {
            try {
              await axios.patch(
                `${API_URL}${endpoint}`, 
                { is_active: false },
                {
                  headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
              deactivated = true;
              successCount++;
              break;
            } catch (error) {
              console.log(`❌ Endpoint ${endpoint} échoué pour l'utilisateur ${id}:`, error.message);
              continue;
            }
          }
          
          if (!deactivated) {
            console.error(`❌ Impossible de désactiver l'utilisateur ${id}`);
          }
        }
        
        if (successCount > 0) {
          showMessage('success', `${successCount} utilisateur(s) désactivé(s) avec succès`);
          setSelectedUsers([]);
          await fetchUsers();
        } else {
          showMessage('error', 'Aucun utilisateur n\'a pu être désactivé');
        }
        
      } catch (error) {
        console.error('❌ Erreur lors de la désactivation:', error);
        showMessage('error', `Erreur lors de la désactivation: ${error.message}`);
      }
    }
  };

  const handleActivateSelected = async () => {
    if (selectedUsers.length === 0) {
      showMessage('error', 'Aucun utilisateur sélectionné');
      return;
    }

    try {
      const authToken = token || localStorage.getItem('auth_token');
      let successCount = 0;
      
      for (const id of selectedUsers) {
        // Essayer plusieurs endpoints
        const endpoints = [
          `/api/utilisateurs/${id}/`,
          `/api/users/${id}/`
        ];
        
        let activated = false;
        
        for (const endpoint of endpoints) {
          try {
            await axios.patch(
              `${API_URL}${endpoint}`, 
              { is_active: true },
              {
                headers: {
                  'Authorization': `Token ${authToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            activated = true;
            successCount++;
            break;
          } catch (error) {
            console.log(`❌ Endpoint ${endpoint} échoué pour l'utilisateur ${id}:`, error.message);
            continue;
          }
        }
        
        if (!activated) {
          console.error(`❌ Impossible d'activer l'utilisateur ${id}`);
        }
      }
      
      if (successCount > 0) {
        showMessage('success', `${successCount} utilisateur(s) activé(s) avec succès`);
        setSelectedUsers([]);
        await fetchUsers();
      } else {
        showMessage('error', 'Aucun utilisateur n\'a pu être activé');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'activation:', error);
      showMessage('error', `Erreur lors de l'activation: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
      showMessage('error', 'Vous ne pouvez pas vous désactiver vous-même');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
      try {
        const authToken = token || localStorage.getItem('auth_token');
        
        // Essayer plusieurs endpoints
        const endpoints = [
          `/api/utilisateurs/${id}/`,
          `/api/users/${id}/`
        ];
        
        let deactivated = false;
        
        for (const endpoint of endpoints) {
          try {
            await axios.patch(
              `${API_URL}${endpoint}`, 
              { is_active: false },
              {
                headers: {
                  'Authorization': `Token ${authToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            deactivated = true;
            break;
          } catch (error) {
            console.log(`❌ Endpoint ${endpoint} échoué:`, error.message);
            continue;
          }
        }
        
        if (deactivated) {
          showMessage('success', 'Utilisateur désactivé avec succès');
          await fetchUsers();
        } else {
          throw new Error('Impossible de désactiver l\'utilisateur');
        }
        
      } catch (error) {
        console.error('❌ Erreur lors de la désactivation:', error);
        showMessage('error', `Erreur lors de la désactivation: ${error.message}`);
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      const authToken = token || localStorage.getItem('auth_token');
      
      // Essayer plusieurs endpoints
      const endpoints = [
        `/api/utilisateurs/${id}/`,
        `/api/users/${id}/`
      ];
      
      let activated = false;
      
      for (const endpoint of endpoints) {
        try {
          await axios.patch(
            `${API_URL}${endpoint}`, 
            { is_active: true },
            {
              headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          activated = true;
          break;
        } catch (error) {
          console.log(`❌ Endpoint ${endpoint} échoué:`, error.message);
          continue;
        }
      }
      
      if (activated) {
        showMessage('success', 'Utilisateur activé avec succès');
        await fetchUsers();
      } else {
        throw new Error('Impossible d\'activer l\'utilisateur');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'activation:', error);
      showMessage('error', `Erreur lors de l'activation: ${error.message}`);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      'admin': 'badge-error',
      'technicien': 'badge-warning',
      'directeur': 'badge-primary',
      'secretaire': 'badge-info',
      'utilisateur': 'badge-success'
    };
    return badges[role] || 'badge-neutral';
  };

  const getRoleText = (role) => {
    const texts = {
      'admin': 'Administrateur',
      'technicien': 'Technicien',
      'directeur': 'Directeur',
      'secretaire': 'Secrétaire',
      'utilisateur': 'Utilisateur'
    };
    return texts[role] || role;
  };

  const getRoleIcon = (role) => {
    const roleConfig = availableRoles.find(r => r.value === role);
    return roleConfig ? roleConfig.icon : <User className="h-4 w-4" />;
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 'badge-success' : 'badge-error';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Actif' : 'Inactif';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Statistiques
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    technicians: users.filter(u => u.role === 'technicien').length,
    directors: users.filter(u => u.role === 'directeur').length,
    secretaries: users.filter(u => u.role === 'secretaire').length,
    standardUsers: users.filter(u => u.role === 'utilisateur').length,
    active: users.filter(u => u.is_active !== false).length,
    inactive: users.filter(u => u.is_active === false).length,
  };

  // Vérifier les permissions
  const canManageUsers = currentUser?.role === 'admin' || currentUser?.role === 'directeur';
  
  if (!canManageUsers) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex flex-col items-center justify-center">
        <div className="card bg-base-200 shadow-xl max-w-md">
          <div className="card-body">
            <div className="text-center">
              <Shield className="h-16 w-16 text-error mx-auto mb-4" />
              <h2 className="card-title text-error justify-center">Accès refusé</h2>
              <p className="py-4">
                Seuls les administrateurs et directeurs peuvent accéder à la gestion des utilisateurs.
              </p>
              <div className="card-actions justify-center">
                <button onClick={() => window.history.back()} className="btn btn-primary">
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Message de notification */}
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : message.type === 'warning' ? 'alert-warning' : 'alert-error'} mb-4`}>
          <div className="flex-1">
            <span>{message.text}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">👥 Gestion des Utilisateurs</h1>
          <p className="text-base-content opacity-70 mt-1">
            Administration des comptes utilisateurs ({stats.total} utilisateur{stats.total > 1 ? 's' : ''})
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="badge badge-primary">Admins: {stats.admins}</span>
            <span className="badge badge-warning">Techniciens: {stats.technicians}</span>
            <span className="badge badge-success">Actifs: {stats.active}</span>
            <span className="badge badge-error">Inactifs: {stats.inactive}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchUsers}
            className="btn btn-outline btn-sm"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '🔄 Actualiser'}
          </button>
          <button
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary btn-sm"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <div className="card bg-base-200 shadow">
          <div className="card-body p-4 text-center">
            <UsersIcon className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="text-lg font-bold">{stats.total}</h3>
            <p className="text-sm opacity-60">Total</p>
          </div>
        </div>

        <div className="card bg-success/10 shadow">
          <div className="card-body p-4 text-center">
            <User className="h-6 w-6 text-success mx-auto mb-2" />
            <h3 className="text-lg font-bold text-success">{stats.active}</h3>
            <p className="text-sm opacity-60">Actifs</p>
          </div>
        </div>

        <div className="card bg-error/10 shadow">
          <div className="card-body p-4 text-center">
            <Shield className="h-6 w-6 text-error mx-auto mb-2" />
            <h3 className="text-lg font-bold text-error">{stats.admins}</h3>
            <p className="text-sm opacity-60">Admins</p>
          </div>
        </div>

        <div className="card bg-warning/10 shadow">
          <div className="card-body p-4 text-center">
            <UserCheck className="h-6 w-6 text-warning mx-auto mb-2" />
            <h3 className="text-lg font-bold text-warning">{stats.technicians}</h3>
            <p className="text-sm opacity-60">Techniciens</p>
          </div>
        </div>

        <div className="card bg-primary/10 shadow">
          <div className="card-body p-4 text-center">
            <Briefcase className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="text-lg font-bold text-primary">{stats.directors}</h3>
            <p className="text-sm opacity-60">Directeurs</p>
          </div>
        </div>

        <div className="card bg-info/10 shadow">
          <div className="card-body p-4 text-center">
            <Briefcase className="h-6 w-6 text-info mx-auto mb-2" />
            <h3 className="text-lg font-bold text-info">{stats.secretaries}</h3>
            <p className="text-sm opacity-60">Secrétaires</p>
          </div>
        </div>

        <div className="card bg-neutral/10 shadow">
          <div className="card-body p-4 text-center">
            <User className="h-6 w-6 text-neutral mx-auto mb-2" />
            <h3 className="text-lg font-bold text-neutral">{stats.standardUsers}</h3>
            <p className="text-sm opacity-60">Standard</p>
          </div>
        </div>

        <div className="card bg-error/10 shadow">
          <div className="card-body p-4 text-center">
            <X className="h-6 w-6 text-error mx-auto mb-2" />
            <h3 className="text-lg font-bold text-error">{stats.inactive}</h3>
            <p className="text-sm opacity-60">Inactifs</p>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">🔍 Rechercher</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
                <input
                  type="text"
                  placeholder="Nom, email, téléphone, département..."
                  className="input input-bordered w-full pl-10 bg-base-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">👑 Rôle</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Tous les rôles</option>
                {availableRoles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control flex flex-col justify-end">
              <div className="flex justify-between items-center">
                <div className="text-sm opacity-70">
                  {filteredUsers.length} / {users.length} utilisateurs
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRole('');
                  }}
                  className="btn btn-outline btn-sm"
                  disabled={isLoading}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="font-semibold text-primary">
                    {selectedUsers.length} utilisateur(s) sélectionné(s)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleActivateSelected}
                    className="btn btn-success btn-sm gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Activer ({selectedUsers.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Désactiver ({selectedUsers.length})
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
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

      {/* Tableau des utilisateurs */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <span className="text-lg">Chargement des utilisateurs...</span>
              <span className="text-sm opacity-70 mt-2">Connexion à l'API en cours</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-base-300">
                      <th className="font-bold w-12 text-center">
                        <div className="flex justify-center">
                          <button
                            onClick={toggleSelectAll}
                            className="btn btn-ghost btn-xs p-1 hover:bg-base-200"
                            title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
                            disabled={filteredUsers.length === 0}
                          >
                            {isSelectAll ? (
                              <CheckSquare className="h-5 w-5 text-primary" />
                            ) : (
                              <Square className="h-5 w-5 text-base-content/40" />
                            )}
                          </button>
                        </div>
                      </th>
                      <th className="font-bold px-4 py-3">Utilisateur</th>
                      <th className="font-bold px-4 py-3">Email</th>
                      <th className="font-bold px-4 py-3">Rôle</th>
                      <th className="font-bold px-4 py-3">Département</th>
                      <th className="font-bold px-4 py-3">Statut</th>
                      <th className="font-bold px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-base-100 border-b border-base-300">
                        <td className="text-center py-3">
                          <div className="flex justify-center">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-primary checkbox-sm"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleSelectUser(user.id)}
                              disabled={user.id === currentUser?.id}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                                <span className="text-xs">
                                  {user.first_name?.[0] || user.last_name?.[0] || user.username?.[0] || 'U'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{user.full_name}</div>
                              <div className="text-sm opacity-50">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 opacity-50" />
                            <span className="text-sm truncate max-w-xs">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`badge ${getRoleBadge(user.role)} gap-1`}>
                            {getRoleIcon(user.role)}
                            {getRoleText(user.role)}
                          </div>
                        </td>
                        <td className="px-4 py-3">{user.departement}</td>
                        <td className="px-4 py-3">
                          <div className={`badge ${getStatusBadge(user.is_active)}`}>
                            {getStatusText(user.is_active)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(user)}
                              className="btn btn-ghost btn-xs btn-square text-info hover:bg-info/10"
                              title="Voir détails"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className="btn btn-ghost btn-xs btn-square text-primary hover:bg-primary/10"
                              title="Modifier"
                              disabled={user.id === currentUser?.id}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            {user.id !== currentUser?.id && (
                              <>
                                {user.is_active ? (
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                                    title="Désactiver"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivate(user.id)}
                                    className="btn btn-ghost btn-xs btn-square text-success hover:bg-success/10"
                                    title="Activer"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <UsersIcon className="h-16 w-16 text-base-content opacity-30 mx-auto mb-4" />
                  <p className="text-lg font-medium text-base-content opacity-60">
                    Aucun utilisateur trouvé
                  </p>
                  <p className="text-sm mt-2">
                    {searchTerm || filterRole 
                      ? "Essayez de modifier vos critères de recherche" 
                      : "Aucun utilisateur n'est enregistré dans le système"
                    }
                  </p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="btn btn-primary btn-sm mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier utilisateur
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      {isViewingDetails && selectedUser && (
        <div className="modal modal-open modal-bottom sm:modal-middle">
          <div className="modal-box bg-base-200 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl text-base-content">👤 Détails de l'utilisateur</h3>
              <button 
                onClick={() => setIsViewingDetails(false)} 
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne gauche: Informations personnelles */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-base-100 rounded-lg">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-16 h-16">
                      <span className="text-2xl">
                        {selectedUser.first_name?.[0] || selectedUser.username?.[0] || 'U'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.full_name}</h2>
                    <p className="text-base-content opacity-60">@{selectedUser.username}</p>
                    <p className="text-sm text-primary">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="space-y-4 p-4 bg-base-100 rounded-lg">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" /> Informations de contact
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="label-text text-sm opacity-60">📧 Email</label>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    
                    <div>
                      <label className="label-text text-sm opacity-60">📞 Téléphone</label>
                      <p className="font-medium">{selectedUser.telephone || 'Non spécifié'}</p>
                    </div>
                    
                    <div>
                      <label className="label-text text-sm opacity-60">🏢 Département</label>
                      <p className="font-medium">{selectedUser.departement}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Colonne droite: Informations système */}
              <div className="space-y-6">
                <div className="p-4 bg-base-100 rounded-lg">
                  <h4 className="font-semibold text-lg flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5" /> Informations système
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label-text text-sm opacity-60">👑 Rôle</label>
                      <div className={`badge ${getRoleBadge(selectedUser.role)} gap-2 p-3 mt-1`}>
                        {getRoleIcon(selectedUser.role)}
                        <span className="text-lg">{getRoleText(selectedUser.role)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="label-text text-sm opacity-60">🔓 Statut</label>
                      <div className={`badge ${getStatusBadge(selectedUser.is_active)} p-3 mt-1`}>
                        <span className="text-lg">{getStatusText(selectedUser.is_active)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-base-100 rounded-lg">
                  <h4 className="font-semibold text-lg flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5" /> Dates
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="label-text text-sm opacity-60">📅 Date d'inscription</label>
                      <p className="font-medium">{formatDate(selectedUser.date_joined)}</p>
                    </div>
                    
                    <div>
                      <label className="label-text text-sm opacity-60">🕒 Dernière connexion</label>
                      <p className="font-medium">{selectedUser.last_login ? formatDate(selectedUser.last_login) : 'Jamais connecté'}</p>
                    </div>
                  </div>
                </div>
                
                {selectedUser.groups && selectedUser.groups.length > 0 && (
                  <div className="p-4 bg-base-100 rounded-lg">
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-4">
                      <UsersIcon className="h-5 w-5" /> Groupes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.groups.map((group, index) => (
                        <span key={index} className="badge badge-outline badge-lg">
                          {typeof group === 'object' ? group.name : group}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-action mt-6">
              <button onClick={() => setIsViewingDetails(false)} className="btn btn-primary">
                Fermer
              </button>
              <button 
                onClick={() => {
                  setIsViewingDetails(false);
                  handleEdit(selectedUser);
                }}
                className="btn btn-outline btn-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier cet utilisateur
              </button>
            </div>
          </div>
          
          {/* Overlay pour fermer le modal en cliquant à côté */}
          <div 
            className="modal-backdrop" 
            onClick={() => setIsViewingDetails(false)}
          />
        </div>
      )}

      {/* Formulaire utilisateur */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        user={editingUser}
        isSubmitting={isSubmitting}
        departements={departements}
        availableRoles={availableRoles}
      />
    </div>
  );
};

// Composant formulaire utilisateur
const UserForm = ({ isOpen, onClose, onSubmit, user, isSubmitting, departements, availableRoles }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'utilisateur',
    departement: '',
    telephone: '',
    password: '',
    password_confirm: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'utilisateur',
        departement: user.departement || '',
        telephone: user.telephone || '',
        password: '',
        password_confirm: ''
      });
    } else {
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'utilisateur',
        departement: '',
        telephone: '',
        password: '',
        password_confirm: ''
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Minimum 3 caractères';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!user) {
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Minimum 6 caractères';
      }
      
      if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = 'Les mots de passe ne correspondent pas';
      }
    }
    
    if (!formData.departement) {
      newErrors.departement = 'Le département est requis';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box bg-base-200 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-base-content">
            {user ? '✏️ Modifier l\'utilisateur' : '➕ Nouvel utilisateur'}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Prénom</span>
              </label>
              <input
                type="text"
                className="input input-bordered bg-base-100"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                placeholder="Jean"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom</span>
              </label>
              <input
                type="text"
                className="input input-bordered bg-base-100"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                placeholder="Dupont"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">👤 Nom d'utilisateur *</span>
            </label>
            <input
              type="text"
              className={`input input-bordered bg-base-100 ${errors.username ? 'input-error' : ''}`}
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="j.dupont"
              required
              minLength="3"
            />
            {errors.username && <span className="text-error text-xs mt-1">{errors.username}</span>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">📧 Email *</span>
            </label>
            <input
              type="email"
              className={`input input-bordered bg-base-100 ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="jean.dupont@dren.mg"
              required
            />
            {errors.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">👑 Rôle *</span>
            </label>
            <select
              className="select select-bordered bg-base-100"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              {availableRoles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">🏢 Département *</span>
            </label>
            <select
              className={`select select-bordered bg-base-100 ${errors.departement ? 'select-error' : ''}`}
              value={formData.departement}
              onChange={(e) => setFormData({...formData, departement: e.target.value})}
              required
            >
              <option value="">Sélectionner un département</option>
              {departements.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.departement && <span className="text-error text-xs mt-1">{errors.departement}</span>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">📞 Téléphone</span>
            </label>
            <input
              type="tel"
              className="input input-bordered bg-base-100"
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              placeholder="+261 32 12 345 67"
            />
          </div>

          {!user && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">🔒 Mot de passe *</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered bg-base-100 ${errors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength="6"
                />
                {errors.password && <span className="text-error text-xs mt-1">{errors.password}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">🔒 Confirmer le mot de passe *</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered bg-base-100 ${errors.password_confirm ? 'input-error' : ''}`}
                  value={formData.password_confirm}
                  onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
                  required
                />
                {errors.password_confirm && <span className="text-error text-xs mt-1">{errors.password_confirm}</span>}
              </div>
            </>
          )}

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost" disabled={isSubmitting}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {user ? 'Modification...' : 'Création...'}
                </>
              ) : (
                user ? 'Modifier' : 'Créer'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Overlay pour fermer le modal en cliquant à côté */}
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default UsersPage;