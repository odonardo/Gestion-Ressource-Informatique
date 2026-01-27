



// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Eye, Filter, Download, Edit, Trash2, CheckSquare, Square, X, User, Mail, Phone, Building, Briefcase, Calendar, CheckCircle, Key, Users } from 'lucide-react';
// import { ProfilUtilisateur, User as UserType } from '../types';
// import { profilsUtilisateurAPI, usersAPI } from '../services/api';
// import ProfilUtilisateurForm from '../components/ProfilUtilisateurForm';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): ProfilUtilisateur[] => {
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): ProfilUtilisateur[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): any[] => {
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

// // Fonctions helper pour extraire les données utilisateur
// const getUsername = (profil: ProfilUtilisateur): string => {
//   if (!profil) return 'Non spécifié';
  
//   // Vérifier si user est un objet
//   if (profil.user && typeof profil.user === 'object') {
//     return profil.user.username || profil.user.user_username || '';
//   } 
//   // Vérifier si user est un string (nom d'utilisateur)
//   else if (typeof profil.user === 'string') {
//     return profil.user;
//   }
//   // Vérifier si user_username existe au niveau racine
//   else if (profil.user_username) {
//     return profil.user_username;
//   }
//   // Vérifier si username existe au niveau racine
//   else if (profil.username) {
//     return profil.username;
//   }
  
//   return 'Non spécifié';
// };

// const getEmail = (profil: ProfilUtilisateur): string => {
//   if (!profil) return '-';
  
//   // Vérifier si user est un objet
//   if (profil.user && typeof profil.user === 'object') {
//     return profil.user.email || profil.user.user_email || '-';
//   }
//   // Vérifier si l'email existe au niveau racine
//   else if (profil.user_email) {
//     return profil.user_email;
//   }
//   else if (profil.email) {
//     return profil.email;
//   }
  
//   return '-';
// };

// const getFullName = (profil: ProfilUtilisateur): string => {
//   if (!profil) return '-';
  
//   // Vérifier si user est un objet
//   if (profil.user && typeof profil.user === 'object') {
//     const firstName = profil.user.first_name || '';
//     const lastName = profil.user.last_name || '';
//     const fullName = `${firstName} ${lastName}`.trim();
//     return fullName || '-';
//   }
//   // Vérifier si les noms existent au niveau racine
//   else if (profil.first_name || profil.last_name) {
//     const firstName = profil.first_name || '';
//     const lastName = profil.last_name || '';
//     return `${firstName} ${lastName}`.trim();
//   }
  
//   return '-';
// };

// const getInitials = (profil: ProfilUtilisateur): string => {
//   const username = getUsername(profil);
//   return username?.[0]?.toUpperCase() || 'U';
// };

// const ProfilsUtilisateurs: React.FC = () => {
//   const [profils, setProfils] = useState<ProfilUtilisateur[]>([]);
//   const [usersWithoutProfile, setUsersWithoutProfile] = useState<UserType[]>([]);
//   const [filteredProfils, setFilteredProfils] = useState<ProfilUtilisateur[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [usersLoading, setUsersLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterDepartement, setFilterDepartement] = useState<string>('');
//   const [filterRole, setFilterRole] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingProfil, setEditingProfil] = useState<ProfilUtilisateur | undefined>();
//   const [selectedProfils, setSelectedProfils] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     actifs: 0,
//     administrateurs: 0,
//     techniciens: 0,
//     parDepartement: {} as Record<string, number>,
//     parRole: {} as Record<string, number>,
//     utilisateursDisponibles: 0
//   });

//   useEffect(() => {
//     fetchProfils();
//     fetchUsersWithoutProfile();
//   }, []);

//   useEffect(() => {
//     filterProfils();
//   }, [profils, searchTerm, filterDepartement, filterRole]);

//   useEffect(() => {
//     if (filteredProfils.length > 0 && selectedProfils.length === filteredProfils.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedProfils, filteredProfils]);

//   const fetchProfils = async () => {
//     try {
//       setLoading(true);
//       const response = await profilsUtilisateurAPI.getAll();
//       const extractedData = extractDataFromResponse(response);
//       console.log('👥 Profils chargés:', extractedData);
      
//       // Normaliser les données pour avoir une structure cohérente
//       const normalizedData = extractedData.map((profil: any) => {
//         // Si user est un ID numérique
//         if (profil.user && typeof profil.user === 'number') {
//           console.log(`🔢 User est un ID: ${profil.user} pour le profil ${profil.id}`);
//           return {
//             ...profil,
//             user: { 
//               id: profil.user,
//               username: profil.user_username || `user_${profil.user}`,
//               email: profil.user_email || ''
//             }
//           };
//         }
        
//         // Si user n'existe pas mais user_username existe
//         if (!profil.user && (profil.user_username || profil.username)) {
//           return {
//             ...profil,
//             user: {
//               id: profil.user_id || profil.id,
//               username: profil.user_username || profil.username,
//               email: profil.user_email || profil.email || '',
//               first_name: profil.first_name || '',
//               last_name: profil.last_name || '',
//               is_active: profil.is_active !== false
//             }
//           };
//         }
        
//         // Si user existe mais est partiellement défini
//         if (profil.user && typeof profil.user === 'object') {
//           return {
//             ...profil,
//             user: {
//               id: profil.user.id || profil.user_id || profil.id,
//               username: profil.user.username || profil.user_username || '',
//               email: profil.user.email || profil.user_email || '',
//               first_name: profil.user.first_name || '',
//               last_name: profil.user.last_name || '',
//               is_active: profil.user.is_active !== false
//             }
//           };
//         }
        
//         return profil;
//       });
      
//       console.log('👤 Profils normalisés:', normalizedData);
//       setProfils(normalizedData);
//       calculerStatistiques(normalizedData);
//     } catch (err: any) {
//       console.error('❌ Erreur chargement profils:', err);
//       setError('Erreur lors du chargement des profils utilisateurs');
//       showMessage('error', 'Erreur lors du chargement des profils utilisateurs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsersWithoutProfile = async () => {
//     try {
//       setUsersLoading(true);
//       console.log('🔄 Chargement des utilisateurs sans profil...');
      
//       try {
//         const response = await usersAPI.getAll();
//         console.log('📋 Tous les utilisateurs:', response.data);
        
//         const allUsers = extractDataFromResponse(response);
//         console.log('👥 Utilisateurs récupérés:', allUsers.length);
        
//         // Récupérer les IDs des utilisateurs qui ont déjà un profil
//         const profilsResponse = await profilsUtilisateurAPI.getAll();
//         const profilsData = extractDataFromResponse(profilsResponse);
//         console.log('📊 Profils existants:', profilsData);
        
//         const existingUserIds = new Set<number>();
        
//         profilsData.forEach((profil: any) => {
//           console.log('🔍 Profil:', profil);
          
//           if (profil.user && typeof profil.user === 'object' && profil.user.id) {
//             existingUserIds.add(profil.user.id);
//             console.log(`✅ Ajouté user.id: ${profil.user.id}`);
//           }
//           else if (profil.user && typeof profil.user === 'number') {
//             existingUserIds.add(profil.user);
//             console.log(`✅ Ajouté user (num): ${profil.user}`);
//           }
//           else if (profil.user_id) {
//             existingUserIds.add(profil.user_id);
//             console.log(`✅ Ajouté user_id: ${profil.user_id}`);
//           }
//         });
        
//         console.log('✅ IDs avec profil:', Array.from(existingUserIds));
        
//         // Filtrer les utilisateurs sans profil
//         const usersWithout = allUsers.filter((user: any) => 
//           !existingUserIds.has(user.id)
//         );
        
//         console.log('✅ Utilisateurs sans profil:', usersWithout.length);
        
//         // Formater pour le frontend
//         const formattedUsers = usersWithout.map((user: any) => ({
//           id: user.id,
//           username: user.username,
//           email: user.email || `${user.username}@example.com`,
//           first_name: user.first_name || '',
//           last_name: user.last_name || '',
//           full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
//           is_active: user.is_active !== false
//         }));
        
//         setUsersWithoutProfile(formattedUsers);
        
//         setStatistiques(prev => ({
//           ...prev,
//           utilisateursDisponibles: formattedUsers.length
//         }));
        
//       } catch (endpointError: any) {
//         console.error('❌ Erreur chargement utilisateurs:', endpointError);
        
//         // Fallback pour le débogage
//         const fallbackUsers = [
//           {
//             id: Date.now(),
//             username: `test${Date.now()}`,
//             email: `test${Date.now()}@example.com`,
//             first_name: 'Test',
//             last_name: 'User',
//             is_active: true
//           }
//         ];
//         setUsersWithoutProfile(fallbackUsers);
//         setStatistiques(prev => ({
//           ...prev,
//           utilisateursDisponibles: fallbackUsers.length
//         }));
        
//         showMessage('warning', 'Mode test activé - Vérifiez votre API');
//       }
//     } catch (error: any) {
//       console.error('❌ Erreur générale:', error);
//       showMessage('error', 'Erreur lors du chargement des utilisateurs');
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   const calculerStatistiques = (data: ProfilUtilisateur[]) => {
//     // Calcul des statistiques par département
//     const parDepartement = data.reduce((acc, profil) => {
//       const dept = profil.departement || 'Non spécifié';
//       acc[dept] = (acc[dept] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     // Calcul des statistiques par rôle
//     const parRole = data.reduce((acc, profil) => {
//       const role = profil.role || 'user';
//       acc[role] = (acc[role] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     const administrateurs = data.filter(p => p.role === 'admin').length;
//     const techniciens = data.filter(p => p.role === 'technician').length;

//     setStatistiques(prev => ({
//       ...prev,
//       total: data.length,
//       actifs: data.filter(p => {
//         if (p.user && typeof p.user === 'object') {
//           return p.user.is_active !== false;
//         }
//         return true;
//       }).length,
//       administrateurs,
//       techniciens,
//       parDepartement,
//       parRole
//     }));
//   };

//   const filterProfils = () => {
//     let filtered = safeArray(profils);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, profil => {
//         const userName = getUsername(profil);
//         const userFullName = getFullName(profil);
//         const userEmail = getEmail(profil);
//         const departement = profil.departement || '';
//         const telephone = profil.telephone || '';
        
//         return (
//           userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           telephone.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       });
//     }

//     if (filterDepartement) {
//       filtered = safeFilter(filtered, profil => 
//         (profil.departement || '').toLowerCase().includes(filterDepartement.toLowerCase())
//       );
//     }

//     if (filterRole) {
//       filtered = safeFilter(filtered, profil => profil.role === filterRole);
//     }

//     setFilteredProfils(filtered);
//     setSelectedProfils([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   const handleSubmit = async (profilData: any) => {
//     try {
//       console.group('🔧 Soumission du profil');
      
//       console.log('📥 Données du formulaire:', profilData);
//       console.log('✏️ Mode:', editingProfil ? 'Édition' : 'Création');
//       console.log('👤 Édition profil:', editingProfil);
      
//       let apiData: any;
      
//       if (editingProfil) {
//         // MODE ÉDITION - Mise à jour
//         apiData = {
//           departement: profilData.departement?.trim() || '',
//           telephone: profilData.telephone?.trim() || '',
//           role: profilData.role || 'user'
//         };
        
//         // Ajouter l'email si fourni
//         if (profilData.email) {
//           apiData.user_email = profilData.email.trim();
//         }
        
//         console.log('🔄 Mode ÉDITION - Données:', apiData);
//         console.log('📝 ID du profil à éditer:', editingProfil.id);
        
//         const response = await profilsUtilisateurAPI.update(editingProfil.id, apiData);
//         console.log('✅ Réponse update:', response.data);
//         showMessage('success', 'Profil utilisateur modifié avec succès');
        
//       } else {
//         // MODE CRÉATION
//         // Vérifier si c'est un nouvel utilisateur ou un utilisateur existant
//         if (profilData.username && profilData.email && profilData.password) {
//           // MODE CRÉATION D'UN NOUVEL UTILISATEUR
//           apiData = {
//             username: profilData.username.trim(),
//             email: profilData.email.trim(),
//             password: profilData.password,
//             password_confirm: profilData.password_confirm,
//             name: profilData.name?.trim() || '',
//             departement: profilData.departement?.trim() || '',
//             telephone: profilData.telephone?.trim() || '',
//             role: profilData.role || 'user'
//           };
          
//           console.log('🆕 Mode CRÉATION NOUVEL UTILISATEUR - Données:', apiData);
          
//           // Utiliser l'endpoint spécifique pour créer utilisateur + profil
//           try {
//             const response = await profilsUtilisateurAPI.create(apiData);
//             console.log('✅ Réponse create:', response.data);
//             showMessage('success', 'Utilisateur et profil créés avec succès');
//           } catch (createError: any) {
//             // Si erreur 400, essayer avec l'endpoint standard
//             if (createError.response?.status === 400) {
//               console.log('⚠️ Fallback vers création standard');
//               const fallbackData = {
//                 user_username: apiData.username,
//                 user_email: apiData.email,
//                 password: apiData.password,
//                 departement: apiData.departement,
//                 telephone: apiData.telephone,
//                 role: apiData.role
//               };
//               const fallbackResponse = await profilsUtilisateurAPI.create(fallbackData);
//               console.log('✅ Réponse fallback:', fallbackResponse.data);
//               showMessage('success', 'Utilisateur et profil créés avec succès');
//             } else {
//               throw createError;
//             }
//           }
          
//         } else if (profilData.user_username) {
//           // MODE ASSOCIATION À UTILISATEUR EXISTANT
//           apiData = {
//             user_username: profilData.user_username.trim(),
//             departement: profilData.departement?.trim() || '',
//             telephone: profilData.telephone?.trim() || '',
//             role: profilData.role || 'user'
//           };
          
//           console.log('🔗 Mode ASSOCIATION UTILISATEUR EXISTANT - Données:', apiData);
          
//           const response = await profilsUtilisateurAPI.create(apiData);
//           console.log('✅ Réponse create:', response.data);
//           showMessage('success', 'Profil créé pour l\'utilisateur existant');
          
//         } else {
//           // MODE PAR DÉFAUT (sérialiseur standard)
//           apiData = {
//             user_username: profilData.user?.username || '',
//             departement: profilData.departement?.trim() || '',
//             telephone: profilData.telephone?.trim() || '',
//             role: profilData.role || 'user'
//           };
          
//           console.log('🔧 Mode DÉFAUT - Données:', apiData);
          
//           const response = await profilsUtilisateurAPI.create(apiData);
//           console.log('✅ Réponse create:', response.data);
//           showMessage('success', 'Profil utilisateur créé avec succès');
//         }
//       }
      
//       console.groupEnd();
      
//       fetchProfils();
//       fetchUsersWithoutProfile();
//       setIsFormOpen(false);
//       setEditingProfil(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur détaillée:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         config: error.config
//       });
      
//       if (error.response?.status === 400) {
//         if (error.response.data?.user_username) {
//           showMessage('error', `Erreur utilisateur: ${error.response.data.user_username}`);
//         } else if (error.response.data?.username) {
//           showMessage('error', `Erreur nom d'utilisateur: ${error.response.data.username}`);
//         } else if (error.response.data?.email) {
//           showMessage('error', `Erreur email: ${error.response.data.email}`);
//         } else if (error.response.data?.password) {
//           showMessage('error', `Erreur mot de passe: ${error.response.data.password}`);
//         } else if (error.response.data?.detail) {
//           showMessage('error', `Erreur: ${error.response.data.detail}`);
//         } else if (error.response.data) {
//           const errors = Object.entries(error.response.data)
//             .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
//             .join('; ');
//           showMessage('error', `Erreurs: ${errors}`);
//         } else {
//           showMessage('error', 'Données invalides');
//         }
//       } else if (error.response?.status === 401) {
//         showMessage('error', 'Veuillez vous reconnecter');
//       } else if (error.response?.status === 403) {
//         showMessage('error', 'Permission refusée - Admin seulement');
//       } else if (error.message) {
//         showMessage('error', error.message);
//       } else {
//         showMessage('error', 'Erreur réseau');
//       }
//     }
//   };

//   const toggleSelectProfil = (id: number) => {
//     setSelectedProfils(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedProfils([]);
//     } else {
//       const allIds = filteredProfils.map(p => p.id);
//       setSelectedProfils(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedProfils.length === 0) {
//       showMessage('error', 'Aucun profil sélectionné');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProfils.length} profil(s) ?`)) {
//       try {
//         for (const id of selectedProfils) {
//           await profilsUtilisateurAPI.delete(id);
//         }
        
//         showMessage('success', `${selectedProfils.length} profil(s) supprimé(s) avec succès`);
//         setSelectedProfils([]);
//         fetchProfils();
//         fetchUsersWithoutProfile();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression des profils');
//       }
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedProfils.length === 0) {
//       showMessage('error', 'Aucun profil sélectionné');
//       return;
//     }

//     if (selectedProfils.length === 1) {
//       const profil = profils.find(p => p.id === selectedProfils[0]);
//       if (profil) {
//         handleEdit(profil);
//       }
//     } else {
//       showMessage('info', `Édition multiple de ${selectedProfils.length} profils`);
//     }
//   };

//   const handleEdit = (profil: ProfilUtilisateur) => {
//     console.log('✏️ Édition du profil:', profil);
//     setEditingProfil(profil);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
//       try {
//         await profilsUtilisateurAPI.delete(id);
//         showMessage('success', 'Profil supprimé avec succès');
//         fetchProfils();
//         fetchUsersWithoutProfile();
//       } catch (error) {
//         showMessage('error', 'Erreur lors de la suppression');
//       }
//     }
//   };

//   const handleAddNew = () => {
//     console.log('➕ Nouveau profil');
//     setEditingProfil(undefined);
//     setIsFormOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       const dataToExport = filteredProfils.map(p => ({
//         'Username': getUsername(p),
//         'Email': getEmail(p),
//         'Prénom': p.user && typeof p.user === 'object' ? p.user.first_name || '' : '',
//         'Nom': p.user && typeof p.user === 'object' ? p.user.last_name || '' : '',
//         'Département': p.departement || 'Non spécifié',
//         'Rôle': getRoleText(p.role),
//         'Téléphone': p.telephone || 'Non spécifié',
//         'Date embauche': p.date_embauche ? new Date(p.date_embauche).toLocaleDateString('fr-FR') : 'Non spécifiée',
//         'Statut': p.user && typeof p.user === 'object' ? (p.user.is_active !== false ? 'Actif' : 'Inactif') : 'Actif'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${field}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `profils_utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterDepartement('');
//     setFilterRole('');
//     setSelectedProfils([]);
//   };

//   const getRoleBadge = (role: string) => {
//     const badges = {
//       admin: 'badge-error',
//       director: 'badge-warning',
//       technician: 'badge-primary',
//       secretary: 'badge-info',
//       user: 'badge-neutral'
//     };
//     return badges[role as keyof typeof badges] || 'badge-neutral';
//   };

//   const getRoleText = (role: string) => {
//     const texts = {
//       admin: 'Administrateur',
//       director: 'Directeur',
//       technician: 'Technicien',
//       secretary: 'Secrétaire',
//       user: 'Utilisateur'
//     };
//     return texts[role as keyof typeof texts] || role;
//   };

//   const getServiceFromDepartement = (departement: string | undefined): string => {
//     if (!departement) return 'Non attribué';
    
//     const mapping: Record<string, string> = {
//       'Informatique': 'Support Technique',
//       'Ressources Humaines': 'Administration',
//       'Comptabilité': 'Finance',
//       'Direction': 'Management',
//       'Secrétariat': 'Support Administratif',
//       'Marketing': 'Commercial',
//       'Production': 'Opérations',
//       'Commercial': 'Ventes'
//     };
    
//     return mapping[departement] || departement;
//   };

//   const getServiceBadge = (departement: string | undefined) => {
//     const service = getServiceFromDepartement(departement);
    
//     const badges: Record<string, string> = {
//       'Support Technique': 'badge-primary',
//       'Administration': 'badge-secondary',
//       'Finance': 'badge-accent',
//       'Management': 'badge-warning',
//       'Support Administratif': 'badge-info',
//       'Commercial': 'badge-success',
//       'Opérations': 'badge-error',
//       'Ventes': 'badge-neutral'
//     };
//     return badges[service] || 'badge-outline';
//   };

//   const getStatusBadge = (isActive: boolean | undefined) => {
//     return isActive !== false ? 'badge-success' : 'badge-error';
//   };

//   const getStatusText = (isActive: boolean | undefined) => {
//     return isActive !== false ? 'Actif' : 'Inactif';
//   };

//   const departements = [...new Set(safeArray(profils).map(p => p.departement).filter(Boolean))];
//   const roles = [...new Set(safeArray(profils).map(p => p.role).filter(Boolean))];

//   if (loading || usersLoading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">
//             {loading ? 'Chargement des profils...' : 'Chargement des utilisateurs...'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4`}>
//           <span>{message.text}</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {/* Debug - Afficher la structure des données (temporaire) */}
//       {profils.length > 0 && (
//         <div className="hidden">
//           <pre>Structure premier profil: {JSON.stringify(profils[0], null, 2)}</pre>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">👥 Gestion des Profils Utilisateurs</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray(filteredProfils).length} profil(s) trouvé(s)
//             {selectedProfils.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedProfils.length} sélectionné(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2">
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
//             disabled={usersWithoutProfile.length === 0}
//             title={usersWithoutProfile.length === 0 ? "Tous les utilisateurs ont déjà un profil" : "Créer un nouveau profil"}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouveau profil
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <User className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.actifs}</h3>
//             <p className="text-sm opacity-60">Actifs</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Key className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.administrateurs}</h3>
//             <p className="text-sm opacity-60">Administrateurs</p>
//           </div>
//         </div>

//         <div className="card bg-primary/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Briefcase className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-primary">{statistiques.techniciens}</h3>
//             <p className="text-sm opacity-60">Techniciens</p>
//           </div>
//         </div>

//         <div className="card bg-info/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <User className="h-6 w-6 text-info mx-auto mb-2" />
//             <h3 className={`text-lg font-bold ${statistiques.utilisateursDisponibles > 0 ? 'text-info' : 'text-warning'}`}>
//               {statistiques.utilisateursDisponibles}
//             </h3>
//             <p className="text-sm opacity-60">Disponibles</p>
//           </div>
//         </div>

//         {Object.entries(statistiques.parDepartement)
//           .slice(0, 3)
//           .map(([dept, count], index) => (
//             <div key={dept} className={`card ${index % 2 === 0 ? 'bg-warning/10' : 'bg-accent/10'} shadow-sm`}>
//               <div className="card-body p-4 text-center">
//                 <Building className={`h-6 w-6 ${index % 2 === 0 ? 'text-warning' : 'text-accent'} mx-auto mb-2`} />
//                 <h3 className="text-lg font-bold">{count}</h3>
//                 <p className="text-sm opacity-60 truncate" title={dept}>
//                   {dept.length > 12 ? `${dept.substring(0, 12)}...` : dept}
//                 </p>
//               </div>
//             </div>
//           ))}
//       </div>

//       {usersWithoutProfile.length > 0 && (
//         <div className="alert alert-warning mb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <User className="h-5 w-5" />
//               <span>
//                 <strong>{usersWithoutProfile.length} utilisateur(s)</strong>
//                 <button
//                   onClick={handleAddNew}
//                   className="btn btn-warning btn-sm ml-3"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Créer des profils et utulisateur (pour Admin seulement)
//                 </button>
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Username, email, téléphone, département..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🏢 Département</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterDepartement}
//                 onChange={(e) => setFilterDepartement(e.target.value)}
//               >
//                 <option value="">Tous les départements</option>
//                 {departements.map(dept => (
//                   <option key={dept} value={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">👑 Rôle</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterRole}
//                 onChange={(e) => setFilterRole(e.target.value)}
//               >
//                 <option value="">Tous les rôles</option>
//                 {roles.map(role => (
//                   <option key={role} value={role}>
//                     {getRoleText(role)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Statistiques</span>
//               </label>
//               <div className="flex justify-between items-center">
//                 <div className="text-sm text-base-content opacity-70">
//                   {safeArray(filteredProfils).length} / {safeArray(profils).length} profils
//                 </div>
//                 <button
//                   onClick={resetFilters}
//                   className="btn btn-outline btn-sm"
//                 >
//                   <Filter className="h-4 w-4 mr-2" />
//                   Réinitialiser
//                 </button>
//               </div>
//             </div>
//           </div>

//           {selectedProfils.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedProfils.length} profil(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier ({selectedProfils.length})
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedProfils.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedProfils([])}
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
//                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-5 w-5 text-primary" />
//                         ) : (
//                           <Square className="h-5 w-5 text-base-content/40" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th className="font-bold">Utilisateur (username)</th>
//                   <th className="font-bold">Email</th>
//                   <th className="font-bold">Service</th>
//                   <th className="font-bold">Département</th>
//                   <th className="font-bold">Rôle</th>
//                   <th className="font-bold">Statut</th>
//                   <th className="font-bold">Téléphone</th>
//                   <th className="font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredProfils).map((profil) => (
//                   <tr key={profil.id} className="hover">
//                     <td className="text-center">
//                       <div className="flex justify-center">
//                         <input
//                           type="checkbox"
//                           className="checkbox checkbox-primary checkbox-sm transition-all duration-200"
//                           checked={selectedProfils.includes(profil.id)}
//                           onChange={() => toggleSelectProfil(profil.id)}
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <div className="avatar placeholder">
//                           <div className="bg-neutral text-neutral-content rounded-full w-10">
//                             <span className="text-sm">{getInitials(profil)}</span>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="font-semibold">
//                             @{getUsername(profil)}
//                           </div>
//                           <div className="text-xs text-base-content opacity-60">
//                             {getFullName(profil)}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex items-center gap-2 text-sm">
//                         <Mail className="h-3 w-3 opacity-70" />
//                         <span>{getEmail(profil)}</span>
//                       </div>
//                     </td>
//                     <td>
//                       <div className={`badge ${getServiceBadge(profil.departement)} badge-lg`}>
//                         {getServiceFromDepartement(profil.departement)}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="flex items-center gap-2">
//                         <Building className="h-4 w-4 text-base-content opacity-50" />
//                         <span>{profil.departement || '-'}</span>
//                       </div>
//                     </td>
//                     <td>
//                       <div className={`badge ${getRoleBadge(profil.role)} badge-lg`}>
//                         {getRoleText(profil.role)}
//                       </div>
//                     </td>
//                     <td>
//                       <div className={`badge ${getStatusBadge(
//                         profil.user && typeof profil.user === 'object' 
//                           ? profil.user.is_active 
//                           : true
//                       )} badge-lg`}>
//                         {getStatusText(
//                           profil.user && typeof profil.user === 'object' 
//                             ? profil.user.is_active 
//                             : true
//                         )}
//                       </div>
//                     </td>
//                     <td>
//                       {profil.telephone ? (
//                         <div className="flex items-center gap-2 text-sm">
//                           <Phone className="h-3 w-3 opacity-70" />
//                           <span>{profil.telephone}</span>
//                         </div>
//                       ) : '-'}
//                     </td>
//                     <td>
//                       <div className="flex justify-center space-x-1">
//                         <button
//                           className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
//                           title="Voir les détails"
//                           onClick={() => {
//                             showMessage('info', 
//                               `Détails du profil:
//                               Username: @${getUsername(profil)}
//                               Nom complet: ${getFullName(profil)}
//                               Email: ${getEmail(profil)}
//                               Service: ${getServiceFromDepartement(profil.departement)}
//                               Département: ${profil.departement || 'Non spécifié'}
//                               Téléphone: ${profil.telephone || 'Non spécifié'}
//                               Rôle: ${getRoleText(profil.role)}
//                               Date d'embauche: ${profil.date_embauche ? new Date(profil.date_embauche).toLocaleDateString('fr-FR') : 'Non spécifiée'}`
//                             );
//                           }}
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleEdit(profil)}
//                           className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
//                           title="Modifier"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(profil.id)}
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

//           {safeArray(filteredProfils).length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-base-content opacity-40 mb-4">
//                 <User className="h-16 w-16 mx-auto mb-4" />
//                 <p className="text-lg font-medium">Aucun profil utilisateur trouvé</p>
//                 <p className="text-sm mt-2">
//                   {searchTerm || filterDepartement || filterRole 
//                     ? "Essayez de modifier vos critères de recherche" 
//                     : "Aucun profil utilisateur n'est enregistré dans le système"
//                   }
//                 </p>
//                 {usersWithoutProfile.length > 0 && (
//                   <div className="mt-4">
//                     <button
//                       onClick={handleAddNew}
//                       className="btn btn-warning btn-sm"
//                     >
//                       Créer des profils pour {usersWithoutProfile.length} utilisateur(s) sans profil
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <ProfilUtilisateurForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingProfil(undefined);
//         }}
//         onSubmit={handleSubmit}
//         profil={editingProfil}
//         usersWithoutProfile={usersWithoutProfile}
//       />
//     </div>
//   );
// };

// export default ProfilsUtilisateurs;









// // import React, { useState, useEffect } from 'react';
// // import { Plus, Search, Eye, Filter, Download, Edit, Trash2, CheckSquare, Square, X, User, Mail, Phone, Building, Briefcase, CheckCircle, Key, AlertCircle, RefreshCw } from 'lucide-react';
// // import { ProfilUtilisateur, User as UserType } from '../types';
// // import { profilsUtilisateurAPI, usersAPI } from '../services/api';
// // import ProfilUtilisateurForm from '../components/ProfilUtilisateurForm';

// // // Fonctions helper pour la sécurité des tableaux
// // const safeArray = (data: any): ProfilUtilisateur[] => {
// //   if (!data) return [];
// //   return Array.isArray(data) ? data : [];
// // };

// // const safeFilter = (array: any[], condition: (item: any) => boolean): ProfilUtilisateur[] => {
// //   if (!Array.isArray(array)) return [];
// //   return array.filter(condition);
// // };

// // const extractDataFromResponse = (response: any): any[] => {
// //   if (!response) return [];
  
// //   if (Array.isArray(response)) {
// //     return response;
// //   }
  
// //   if (response.data) {
// //     if (Array.isArray(response.data)) {
// //       return response.data;
// //     }
    
// //     if (response.data.results && Array.isArray(response.data.results)) {
// //       return response.data.results;
// //     }
    
// //     if (response.data.data && Array.isArray(response.data.data)) {
// //       return response.data.data;
// //     }
    
// //     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// //       return [response.data];
// //     }
// //   }
  
// //   return [];
// // };

// // // Fonctions helper pour extraire les données utilisateur
// // const getUsername = (profil: ProfilUtilisateur): string => {
// //   if (!profil) return 'Non spécifié';
  
// //   if (profil.user && typeof profil.user === 'object') {
// //     return profil.user.username || profil.user.user_username || '';
// //   } 
// //   else if (typeof profil.user === 'string') {
// //     return profil.user;
// //   }
// //   else if (profil.user_username) {
// //     return profil.user_username;
// //   }
// //   else if (profil.username) {
// //     return profil.username;
// //   }
  
// //   return 'Non spécifié';
// // };

// // const getEmail = (profil: ProfilUtilisateur): string => {
// //   if (!profil) return '-';
  
// //   if (profil.user && typeof profil.user === 'object') {
// //     return profil.user.email || profil.user.user_email || '-';
// //   }
// //   else if (profil.user_email) {
// //     return profil.user_email;
// //   }
// //   else if (profil.email) {
// //     return profil.email;
// //   }
  
// //   return '-';
// // };

// // const getFullName = (profil: ProfilUtilisateur): string => {
// //   if (!profil) return '-';
  
// //   if (profil.user && typeof profil.user === 'object') {
// //     const firstName = profil.user.first_name || '';
// //     const lastName = profil.user.last_name || '';
// //     const fullName = `${firstName} ${lastName}`.trim();
// //     return fullName || '-';
// //   }
// //   else if (profil.first_name || profil.last_name) {
// //     const firstName = profil.first_name || '';
// //     const lastName = profil.last_name || '';
// //     return `${firstName} ${lastName}`.trim();
// //   }
  
// //   return '-';
// // };

// // const getInitials = (profil: ProfilUtilisateur): string => {
// //   const username = getUsername(profil);
// //   return username?.[0]?.toUpperCase() || 'U';
// // };

// // const getStatus = (profil: ProfilUtilisateur): boolean => {
// //   if (profil.user && typeof profil.user === 'object') {
// //     return profil.user.is_active !== false;
// //   }
// //   return true;
// // };

// // const ProfilsUtilisateurs: React.FC = () => {
// //   const [profils, setProfils] = useState<ProfilUtilisateur[]>([]);
// //   const [usersWithoutProfile, setUsersWithoutProfile] = useState<UserType[]>([]);
// //   const [filteredProfils, setFilteredProfils] = useState<ProfilUtilisateur[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [usersLoading, setUsersLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string>('');
// //   const [searchTerm, setSearchTerm] = useState<string>('');
// //   const [filterDepartement, setFilterDepartement] = useState<string>('');
// //   const [filterRole, setFilterRole] = useState<string>('');
// //   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [editingProfil, setEditingProfil] = useState<ProfilUtilisateur | undefined>();
// //   const [selectedProfils, setSelectedProfils] = useState<number[]>([]);
// //   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

// //   // Statistiques
// //   const [statistiques, setStatistiques] = useState({
// //     total: 0,
// //     actifs: 0,
// //     administrateurs: 0,
// //     techniciens: 0,
// //     parDepartement: {} as Record<string, number>,
// //     parRole: {} as Record<string, number>,
// //     utilisateursDisponibles: 0
// //   });

// //   useEffect(() => {
// //     fetchProfils();
// //     fetchUsersWithoutProfile();
// //   }, []);

// //   useEffect(() => {
// //     filterProfils();
// //   }, [profils, searchTerm, filterDepartement, filterRole]);

// //   useEffect(() => {
// //     if (filteredProfils.length > 0 && selectedProfils.length === filteredProfils.length) {
// //       setIsSelectAll(true);
// //     } else {
// //       setIsSelectAll(false);
// //     }
// //   }, [selectedProfils, filteredProfils]);

// //   const fetchProfils = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
      
// //       const response = await profilsUtilisateurAPI.getAll();
// //       const extractedData = extractDataFromResponse(response);
      
// //       if (extractedData.length === 0) {
// //         console.log('ℹ️ Aucun profil trouvé');
// //         setProfils([]);
// //         setFilteredProfils([]);
// //         calculerStatistiques([]);
// //         return;
// //       }
      
// //       // Normaliser les données
// //       const normalizedData = extractedData.map((profil: any, index: number) => {
// //         const normalized: any = {
// //           id: profil.id || index + 1,
// //           departement: profil.departement || '',
// //           telephone: profil.telephone || '',
// //           role: profil.role || 'user',
// //           date_embauche: profil.date_embauche || null
// //         };
        
// //         if (profil.user) {
// //           if (typeof profil.user === 'number') {
// //             normalized.user = {
// //               id: profil.user,
// //               username: profil.user_username || `user_${profil.user}`,
// //               email: profil.user_email || '',
// //               first_name: profil.user_first_name || '',
// //               last_name: profil.user_last_name || '',
// //               is_active: true
// //             };
// //           } else if (typeof profil.user === 'object') {
// //             normalized.user = {
// //               id: profil.user.id || profil.user_id || profil.id,
// //               username: profil.user.username || profil.user_username || '',
// //               email: profil.user.email || profil.user_email || '',
// //               first_name: profil.user.first_name || '',
// //               last_name: profil.user.last_name || '',
// //               is_active: profil.user.is_active !== false
// //             };
// //           }
// //         } else {
// //           normalized.user = {
// //             id: profil.user_id || profil.id,
// //             username: profil.user_username || profil.username || '',
// //             email: profil.user_email || profil.email || '',
// //             first_name: profil.first_name || '',
// //             last_name: profil.last_name || '',
// //             is_active: true
// //           };
// //         }
        
// //         return normalized;
// //       });
      
// //       console.log('👤 Profils normalisés:', normalizedData);
// //       setProfils(normalizedData);
// //       calculerStatistiques(normalizedData);
// //       showMessage('success', `${normalizedData.length} profil(s) chargé(s) avec succès`);
      
// //     } catch (err: any) {
// //       console.error('❌ Erreur chargement profils:', err);
      
// //       const errorMessage = err.response?.data?.detail 
// //         || err.response?.data?.message 
// //         || err.message 
// //         || 'Erreur lors du chargement des profils utilisateurs';
      
// //       setError(errorMessage);
// //       showMessage('error', errorMessage);
      
// //       // Données de démo
// //       const testData = [
// //         {
// //           id: 1,
// //           user: {
// //             id: 1,
// //             username: 'admin',
// //             email: 'admin@example.com',
// //             first_name: 'Admin',
// //             last_name: 'System',
// //             is_active: true
// //           },
// //           departement: 'Informatique',
// //           telephone: '0123456789',
// //           role: 'admin',
// //           // date_embauche: '2024-01-01'
// //         },
// //         {
// //           id: 2,
// //           user: {
// //             id: 2,
// //             username: 'technicien',
// //             email: 'tech@example.com',
// //             first_name: 'Technicien',
// //             last_name: 'Support',
// //             is_active: true
// //           },
// //           departement: 'Support Technique',
// //           telephone: '0987654321',
// //           role: 'technician',
// //           // date_embauche: '2024-02-01'
// //         }
// //       ];
      
// //       setProfils(testData);
// //       calculerStatistiques(testData);
      
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchUsersWithoutProfile = async () => {
// //     try {
// //       setUsersLoading(true);
      
// //       try {
// //         const response = await usersAPI.getAll();
// //         const allUsers = extractDataFromResponse(response);
        
// //         const existingUserIds = new Set<number>();
// //         profils.forEach((profil) => {
// //           if (profil.user && typeof profil.user === 'object' && profil.user.id) {
// //             existingUserIds.add(profil.user.id);
// //           }
// //         });
        
// //         const usersWithout = allUsers.filter((user: any) => 
// //           !existingUserIds.has(user.id)
// //         );
        
// //         const formattedUsers = usersWithout.map((user: any) => ({
// //           id: user.id,
// //           username: user.username,
// //           email: user.email || `${user.username}@example.com`,
// //           first_name: user.first_name || '',
// //           last_name: user.last_name || '',
// //           full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
// //           is_active: user.is_active !== false
// //         }));
        
// //         setUsersWithoutProfile(formattedUsers);
// //         setStatistiques(prev => ({
// //           ...prev,
// //           utilisateursDisponibles: formattedUsers.length
// //         }));
        
// //       } catch (endpointError: any) {
// //         console.error('❌ Erreur chargement utilisateurs:', endpointError);
// //         setUsersWithoutProfile([]);
// //       }
// //     } catch (error: any) {
// //       console.error('❌ Erreur générale chargement utilisateurs:', error);
// //     } finally {
// //       setUsersLoading(false);
// //     }
// //   };

// //   const calculerStatistiques = (data: ProfilUtilisateur[]) => {
// //     if (!data || data.length === 0) {
// //       setStatistiques({
// //         total: 0,
// //         actifs: 0,
// //         administrateurs: 0,
// //         techniciens: 0,
// //         parDepartement: {},
// //         parRole: {},
// //         utilisateursDisponibles: statistiques.utilisateursDisponibles
// //       });
// //       return;
// //     }

// //     const parDepartement = data.reduce((acc, profil) => {
// //       const dept = profil.departement || 'Non spécifié';
// //       acc[dept] = (acc[dept] || 0) + 1;
// //       return acc;
// //     }, {} as Record<string, number>);

// //     const parRole = data.reduce((acc, profil) => {
// //       const role = profil.role || 'user';
// //       acc[role] = (acc[role] || 0) + 1;
// //       return acc;
// //     }, {} as Record<string, number>);

// //     const administrateurs = data.filter(p => p.role === 'admin').length;
// //     const techniciens = data.filter(p => p.role === 'technician').length;

// //     setStatistiques(prev => ({
// //       ...prev,
// //       total: data.length,
// //       actifs: data.filter(p => getStatus(p)).length,
// //       administrateurs,
// //       techniciens,
// //       parDepartement,
// //       parRole
// //     }));
// //   };

// //   const filterProfils = () => {
// //     let filtered = safeArray(profils);

// //     if (searchTerm) {
// //       filtered = safeFilter(filtered, profil => {
// //         const userName = getUsername(profil).toLowerCase();
// //         const userFullName = getFullName(profil).toLowerCase();
// //         const userEmail = getEmail(profil).toLowerCase();
// //         const departement = (profil.departement || '').toLowerCase();
// //         const telephone = (profil.telephone || '').toLowerCase();
// //         const search = searchTerm.toLowerCase();
        
// //         return (
// //           userName.includes(search) ||
// //           userFullName.includes(search) ||
// //           userEmail.includes(search) ||
// //           departement.includes(search) ||
// //           telephone.includes(search)
// //         );
// //       });
// //     }

// //     if (filterDepartement) {
// //       filtered = safeFilter(filtered, profil => 
// //         (profil.departement || '').toLowerCase().includes(filterDepartement.toLowerCase())
// //       );
// //     }

// //     if (filterRole) {
// //       filtered = safeFilter(filtered, profil => profil.role === filterRole);
// //     }

// //     setFilteredProfils(filtered);
// //     setSelectedProfils([]);
// //   };

// //   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
// //     setMessage({ type, text });
// //     setTimeout(() => setMessage(null), 5000);
// //   };

// //   const handleSubmit = async (profilData: any) => {
// //     try {
// //       console.log('📥 Soumission du profil:', profilData);
      
// //       if (editingProfil) {
// //         const apiData = {
// //           departement: profilData.departement?.trim() || '',
// //           telephone: profilData.telephone?.trim() || '',
// //           role: profilData.role || 'user'
// //         };
        
// //         await profilsUtilisateurAPI.update(editingProfil.id, apiData);
// //         showMessage('success', 'Profil modifié avec succès');
// //       } else {
// //         let apiData: any;
        
// //         if (profilData.username && profilData.email && profilData.password) {
// //           apiData = {
// //             username: profilData.username.trim(),
// //             email: profilData.email.trim(),
// //             password: profilData.password,
// //             departement: profilData.departement?.trim() || '',
// //             telephone: profilData.telephone?.trim() || '',
// //             role: profilData.role || 'user'
// //           };
// //         } else if (profilData.user_username) {
// //           apiData = {
// //             user_username: profilData.user_username.trim(),
// //             departement: profilData.departement?.trim() || '',
// //             telephone: profilData.telephone?.trim() || '',
// //             role: profilData.role || 'user'
// //           };
// //         }
        
// //         await profilsUtilisateurAPI.create(apiData);
// //         showMessage('success', 'Profil créé avec succès');
// //       }
      
// //       await fetchProfils();
// //       await fetchUsersWithoutProfile();
// //       setIsFormOpen(false);
// //       setEditingProfil(undefined);
      
// //     } catch (error: any) {
// //       console.error('❌ Erreur soumission:', error);
// //       const errorMsg = error.response?.data?.detail || error.message || 'Erreur lors de l\'opération';
// //       showMessage('error', errorMsg);
// //     }
// //   };

// //   const toggleSelectProfil = (id: number) => {
// //     setSelectedProfils(prev => 
// //       prev.includes(id) 
// //         ? prev.filter(item => item !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   const toggleSelectAll = () => {
// //     if (isSelectAll) {
// //       setSelectedProfils([]);
// //     } else {
// //       const allIds = filteredProfils.map(p => p.id);
// //       setSelectedProfils(allIds);
// //     }
// //   };

// //   const handleDeleteSelected = async () => {
// //     if (selectedProfils.length === 0) {
// //       showMessage('error', 'Aucun profil sélectionné');
// //       return;
// //     }

// //     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProfils.length} profil(s) ?`)) {
// //       try {
// //         for (const id of selectedProfils) {
// //           await profilsUtilisateurAPI.delete(id);
// //         }
        
// //         showMessage('success', `${selectedProfils.length} profil(s) supprimé(s) avec succès`);
// //         setSelectedProfils([]);
// //         await fetchProfils();
// //         await fetchUsersWithoutProfile();
// //       } catch (error) {
// //         showMessage('error', 'Erreur lors de la suppression');
// //       }
// //     }
// //   };

// //   const handleEditSelected = () => {
// //     if (selectedProfils.length === 0) {
// //       showMessage('error', 'Aucun profil sélectionné');
// //       return;
// //     }

// //     if (selectedProfils.length === 1) {
// //       const profil = profils.find(p => p.id === selectedProfils[0]);
// //       if (profil) {
// //         handleEdit(profil);
// //       }
// //     } else {
// //       showMessage('info', `Sélectionnez un seul profil pour modifier`);
// //     }
// //   };

// //   const handleEdit = (profil: ProfilUtilisateur) => {
// //     setEditingProfil(profil);
// //     setIsFormOpen(true);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
// //       try {
// //         await profilsUtilisateurAPI.delete(id);
// //         showMessage('success', 'Profil supprimé avec succès');
// //         await fetchProfils();
// //         await fetchUsersWithoutProfile();
// //       } catch (error) {
// //         showMessage('error', 'Erreur lors de la suppression');
// //       }
// //     }
// //   };

// //   const handleAddNew = () => {
// //     setEditingProfil(undefined);
// //     setIsFormOpen(true);
// //   };

// //   const handleExport = () => {
// //     try {
// //       if (filteredProfils.length === 0) {
// //         showMessage('error', 'Aucune donnée à exporter');
// //         return;
// //       }

// //       const dataToExport = filteredProfils.map(p => ({
// //         'Username': getUsername(p),
// //         'Email': getEmail(p),
// //         'Service': getServiceFromDepartement(p.departement),
// //         'Département': p.departement || 'Non spécifié',
// //         'Rôle': getRoleText(p.role),
// //         'Statut': getStatus(p) ? 'Actif' : 'Inactif',
// //         'Téléphone': p.telephone || 'Non spécifié'
// //       }));

// //       const csvContent = [
// //         Object.keys(dataToExport[0]).join(','),
// //         ...dataToExport.map(row => Object.values(row).map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
// //       ].join('\n');

// //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //       const link = document.createElement('a');
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', `profils_utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);

// //       showMessage('success', 'Export CSV réussi !');
// //     } catch (error) {
// //       showMessage('error', 'Erreur lors de l\'export');
// //     }
// //   };

// //   const resetFilters = () => {
// //     setSearchTerm('');
// //     setFilterDepartement('');
// //     setFilterRole('');
// //     setSelectedProfils([]);
// //   };

// //   const handleRetry = () => {
// //     setError('');
// //     fetchProfils();
// //     fetchUsersWithoutProfile();
// //   };

// //   const getRoleBadge = (role: string) => {
// //     const badges = {
// //       admin: 'badge-error',
// //       director: 'badge-warning',
// //       technician: 'badge-primary',
// //       secretary: 'badge-info',
// //       user: 'badge-neutral'
// //     };
// //     return badges[role as keyof typeof badges] || 'badge-neutral';
// //   };

// //   const getRoleText = (role: string) => {
// //     const texts = {
// //       admin: 'Administrateur',
// //       director: 'Directeur',
// //       technician: 'Technicien',
// //       secretary: 'Secrétaire',
// //       user: 'Utilisateur'
// //     };
// //     return texts[role as keyof typeof texts] || role;
// //   };

// //   const getServiceFromDepartement = (departement: string | undefined): string => {
// //     if (!departement) return 'Non attribué';
    
// //     const mapping: Record<string, string> = {
// //       'Informatique': 'Support Technique',
// //       'Ressources Humaines': 'Administration',
// //       'Comptabilité': 'Finance',
// //       'Direction': 'Management',
// //       'Secrétariat': 'Support Administratif',
// //       'Marketing': 'Commercial',
// //       'Production': 'Opérations',
// //       'Commercial': 'Ventes'
// //     };
    
// //     return mapping[departement] || departement;
// //   };

// //   const getServiceBadge = (departement: string | undefined) => {
// //     const service = getServiceFromDepartement(departement);
    
// //     const badges: Record<string, string> = {
// //       'Support Technique': 'badge-primary',
// //       'Administration': 'badge-secondary',
// //       'Finance': 'badge-accent',
// //       'Management': 'badge-warning',
// //       'Support Administratif': 'badge-info',
// //       'Commercial': 'badge-success',
// //       'Opérations': 'badge-error',
// //       'Ventes': 'badge-neutral'
// //     };
// //     return badges[service] || 'badge-outline';
// //   };

// //   const getStatusBadge = (isActive: boolean) => {
// //     return isActive ? 'badge-success' : 'badge-error';
// //   };

// //   const getStatusText = (isActive: boolean) => {
// //     return isActive ? 'Actif' : 'Inactif';
// //   };

// //   const departements = [...new Set(safeArray(profils).map(p => p.departement).filter(Boolean))];
// //   const roles = [...new Set(safeArray(profils).map(p => p.role).filter(Boolean))];

// //   if (loading || usersLoading) {
// //     return (
// //       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-4">
// //           <span className="loading loading-spinner loading-lg text-primary"></span>
// //           <p className="text-base-content">
// //             {loading ? 'Chargement des profils...' : 'Chargement des utilisateurs...'}
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 bg-base-100 min-h-screen">
// //       {message && (
// //         <div className={`alert ${
// //           message.type === 'success' ? 'alert-success' : 
// //           message.type === 'error' ? 'alert-error' : 
// //           'alert-info'
// //         } mb-4 flex items-center justify-between`}>
// //           <span>{message.text}</span>
// //           <button className="btn btn-ghost btn-sm" onClick={() => setMessage(null)}>
// //             <X className="h-4 w-4" />
// //           </button>
// //         </div>
// //       )}

// //       {error && (
// //         <div className="alert alert-error mb-4">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-3">
// //               <AlertCircle className="h-5 w-5" />
// //               <span>{error}</span>
// //             </div>
// //             <button 
// //               className="btn btn-outline btn-sm"
// //               onClick={handleRetry}
// //             >
// //               <RefreshCw className="h-4 w-4 mr-2" />
// //               Réessayer
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h1 className="text-3xl font-bold text-base-content">👥 Gestion des Profils Utilisateurs</h1>
// //           <p className="text-base-content opacity-60 mt-1">
// //             {safeArray(filteredProfils).length} profil(s) trouvé(s)
// //             {selectedProfils.length > 0 && (
// //               <span className="text-primary font-semibold ml-2">
// //                 ({selectedProfils.length} sélectionné(s))
// //               </span>
// //             )}
// //           </p>
// //         </div>
// //         <div className="flex gap-2">
// //           <button
// //             onClick={handleExport}
// //             className="btn btn-outline btn-sm"
// //             title="Exporter la liste"
// //             disabled={filteredProfils.length === 0}
// //           >
// //             <Download className="h-4 w-4 mr-2" />
// //             Exporter
// //           </button>
// //           <button
// //             onClick={handleAddNew}
// //             className="btn btn-primary btn-sm"
// //             title="Créer un nouveau profil"
// //           >
// //             <Plus className="h-4 w-4 mr-2" />
// //             Nouveau profil
// //           </button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
// //         <div className="card bg-base-200 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <User className="h-6 w-6 text-primary mx-auto mb-2" />
// //             <h3 className="text-lg font-bold">{statistiques.total}</h3>
// //             <p className="text-sm opacity-60">Total</p>
// //           </div>
// //         </div>

// //         <div className="card bg-success/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-success">{statistiques.actifs}</h3>
// //             <p className="text-sm opacity-60">Actifs</p>
// //           </div>
// //         </div>

// //         <div className="card bg-error/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <Key className="h-6 w-6 text-error mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-error">{statistiques.administrateurs}</h3>
// //             <p className="text-sm opacity-60">Administrateurs</p>
// //           </div>
// //         </div>

// //         <div className="card bg-primary/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <Briefcase className="h-6 w-6 text-primary mx-auto mb-2" />
// //             <h3 className="text-lg font-bold text-primary">{statistiques.techniciens}</h3>
// //             <p className="text-sm opacity-60">Techniciens</p>
// //           </div>
// //         </div>

// //         <div className="card bg-info/10 shadow-sm">
// //           <div className="card-body p-4 text-center">
// //             <User className="h-6 w-6 text-info mx-auto mb-2" />
// //             <h3 className={`text-lg font-bold ${statistiques.utilisateursDisponibles > 0 ? 'text-info' : 'text-warning'}`}>
// //               {statistiques.utilisateursDisponibles}
// //             </h3>
// //             <p className="text-sm opacity-60">Disponibles</p>
// //           </div>
// //         </div>
// //       </div>

// //       {usersWithoutProfile.length > 0 && (
// //         <div className="alert alert-warning mb-4">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-3">
// //               <User className="h-5 w-5" />
// //               <span>
// //                 <strong>{usersWithoutProfile.length} utilisateur(s) sans profil</strong>
// //               </span>
// //             </div>
// //             <button
// //               onClick={handleAddNew}
// //               className="btn btn-warning btn-sm"
// //             >
// //               <Plus className="h-4 w-4 mr-2" />
// //               Créer des profils
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       <div className="card bg-base-200 shadow-xl mb-6">
// //         <div className="card-body">
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🔍 Rechercher</span>
// //               </label>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
// //                 <input
// //                   type="text"
// //                   placeholder="Username, email, téléphone, département..."
// //                   className="input input-bordered w-full pl-10 bg-base-100"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">🏢 Département</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterDepartement}
// //                 onChange={(e) => setFilterDepartement(e.target.value)}
// //               >
// //                 <option value="">Tous les départements</option>
// //                 {departements.map((dept, index) => (
// //                   <option key={index} value={dept}>
// //                     {dept}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">👑 Rôle</span>
// //               </label>
// //               <select
// //                 className="select select-bordered w-full bg-base-100"
// //                 value={filterRole}
// //                 onChange={(e) => setFilterRole(e.target.value)}
// //               >
// //                 <option value="">Tous les rôles</option>
// //                 {roles.map((role, index) => (
// //                   <option key={index} value={role}>
// //                     {getRoleText(role)}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">📊 Statistiques</span>
// //               </label>
// //               <div className="flex justify-between items-center">
// //                 <div className="text-sm text-base-content opacity-70">
// //                   {safeArray(filteredProfils).length} / {safeArray(profils).length} profils
// //                 </div>
// //                 <button
// //                   onClick={resetFilters}
// //                   className="btn btn-outline btn-sm"
// //                 >
// //                   <Filter className="h-4 w-4 mr-2" />
// //                   Réinitialiser
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           {selectedProfils.length > 0 && (
// //             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-4">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
// //                     <span className="font-semibold text-primary text-lg">
// //                       {selectedProfils.length} profil(s) sélectionné(s)
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={handleEditSelected}
// //                     className="btn btn-primary btn-sm gap-2"
// //                     disabled={selectedProfils.length !== 1}
// //                     title={selectedProfils.length !== 1 ? "Sélectionnez un seul profil pour modifier" : ""}
// //                   >
// //                     <Edit className="h-4 w-4" />
// //                     Modifier
// //                   </button>
// //                   <button
// //                     onClick={handleDeleteSelected}
// //                     className="btn btn-outline btn-error btn-sm gap-2"
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                     Supprimer ({selectedProfils.length})
// //                   </button>
// //                   <button
// //                     onClick={() => setSelectedProfils([])}
// //                     className="btn btn-ghost btn-sm"
// //                   >
// //                     <X className="h-4 w-4" />
// //                     Annuler
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <div className="card bg-base-200 shadow-xl">
// //         <div className="card-body p-0">
// //           <div className="overflow-x-auto">
// //             <table className="table w-full">
// //               <thead>
// //                 <tr className="bg-base-300">
// //                   <th className="font-bold w-12 text-center">
// //                     <div className="flex justify-center">
// //                       <button
// //                         onClick={toggleSelectAll}
// //                         className="btn btn-ghost btn-xs p-1 hover:bg-base-200"
// //                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
// //                         disabled={filteredProfils.length === 0}
// //                       >
// //                         {isSelectAll ? (
// //                           <CheckSquare className="h-5 w-5 text-primary" />
// //                         ) : (
// //                           <Square className="h-5 w-5 text-base-content/40" />
// //                         )}
// //                       </button>
// //                     </div>
// //                   </th>
// //                   <th className="font-bold px-4 py-3">Utilisateur (username)</th>
// //                   <th className="font-bold px-4 py-3">Email</th>
// //                   <th className="font-bold px-4 py-3">Service</th>
// //                   <th className="font-bold px-4 py-3">Département</th>
// //                   <th className="font-bold px-4 py-3">Rôle</th>
// //                   <th className="font-bold px-4 py-3">Statut</th>
// //                   <th className="font-bold px-4 py-3">Téléphone</th>
// //                   <th className="font-bold px-4 py-3 text-center">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {safeArray(filteredProfils).length > 0 ? (
// //                   safeArray(filteredProfils).map((profil) => (
// //                     <tr key={profil.id} className="hover:bg-base-100 border-b border-base-300">
// //                       <td className="text-center py-3">
// //                         <div className="flex justify-center">
// //                           <input
// //                             type="checkbox"
// //                             className="checkbox checkbox-primary checkbox-sm"
// //                             checked={selectedProfils.includes(profil.id)}
// //                             onChange={() => toggleSelectProfil(profil.id)}
// //                           />
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className="flex items-center gap-3">
// //                           <div className="avatar placeholder">
// //                             <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
// //                               <span className="text-xs">{getInitials(profil)}</span>
// //                             </div>
// //                           </div>
// //                           <div>
// //                             <div className="font-semibold">
// //                               @{getUsername(profil)}
// //                             </div>
// //                             <div className="text-xs text-base-content opacity-60">
// //                               {getFullName(profil)}
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className="flex items-center gap-2 text-sm">
// //                           <Mail className="h-3 w-3 opacity-70" />
// //                           <span className="truncate max-w-[180px]" title={getEmail(profil)}>
// //                             {getEmail(profil)}
// //                           </span>
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className={`badge ${getServiceBadge(profil.departement)}`}>
// //                           {getServiceFromDepartement(profil.departement)}
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className="flex items-center gap-2">
// //                           <Building className="h-4 w-4 text-base-content opacity-50" />
// //                           <span>{profil.departement || '-'}</span>
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className={`badge ${getRoleBadge(profil.role)}`}>
// //                           {getRoleText(profil.role)}
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className={`badge ${getStatusBadge(getStatus(profil))}`}>
// //                           {getStatusText(getStatus(profil))}
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         {profil.telephone ? (
// //                           <div className="flex items-center gap-2 text-sm">
// //                             <Phone className="h-3 w-3 opacity-70" />
// //                             <span>{profil.telephone}</span>
// //                           </div>
// //                         ) : '-'}
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div className="flex justify-center space-x-2">
// //                           <button
// //                             className="btn btn-ghost btn-xs btn-square text-info hover:bg-info/10"
// //                             title="Voir les détails"
// //                             onClick={() => {
// //                               const details = `
// // Username: @${getUsername(profil)}
// // Nom complet: ${getFullName(profil)}
// // Email: ${getEmail(profil)}
// // Service: ${getServiceFromDepartement(profil.departement)}
// // Département: ${profil.departement || 'Non spécifié'}
// // Téléphone: ${profil.telephone || 'Non spécifié'}
// // Rôle: ${getRoleText(profil.role)}
// // Statut: ${getStatusText(getStatus(profil))}
// // Date embauche: ${profil.date_embauche ? new Date(profil.date_embauche).toLocaleDateString('fr-FR') : 'Non spécifiée'}`;
// //                               alert(details);
// //                             }}
// //                           >
// //                             <Eye className="h-4 w-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleEdit(profil)}
// //                             className="btn btn-ghost btn-xs btn-square text-primary hover:bg-primary/10"
// //                             title="Modifier"
// //                           >
// //                             <Edit className="h-4 w-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDelete(profil.id)}
// //                             className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
// //                             title="Supprimer"
// //                           >
// //                             <Trash2 className="h-4 w-4" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td colSpan={9} className="text-center py-12">
// //                       <div className="text-base-content opacity-40">
// //                         <User className="h-16 w-16 mx-auto mb-4" />
// //                         <p className="text-lg font-medium">Aucun profil utilisateur trouvé</p>
// //                         <p className="text-sm mt-2">
// //                           {searchTerm || filterDepartement || filterRole 
// //                             ? "Essayez de modifier vos critères de recherche" 
// //                             : "Aucun profil utilisateur n'est enregistré"
// //                           }
// //                         </p>
// //                         {profils.length === 0 && (
// //                           <div className="mt-4">
// //                             <button
// //                               onClick={handleAddNew}
// //                               className="btn btn-primary btn-sm"
// //                             >
// //                               <Plus className="h-4 w-4 mr-2" />
// //                               Créer un premier profil
// //                             </button>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>

// //       <ProfilUtilisateurForm
// //         isOpen={isFormOpen}
// //         onClose={() => {
// //           setIsFormOpen(false);
// //           setEditingProfil(undefined);
// //         }}
// //         onSubmit={handleSubmit}
// //         profil={editingProfil}
// //         usersWithoutProfile={usersWithoutProfile}
// //       />
// //     </div>
// //   );
// // };

// // export default ProfilsUtilisateurs;



// llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll



// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Eye, Filter, Download, Edit, Trash2, CheckSquare, Square, X, User, Mail, Phone, Building, Briefcase, Calendar, CheckCircle, Key, Users, AlertCircle, RefreshCw } from 'lucide-react';
// import { ProfilUtilisateur, User as UserType } from '../types';
// import { profilsUtilisateurAPI, usersAPI } from '../services/api';
// import ProfilUtilisateurForm from '../components/ProfilUtilisateurForm';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): ProfilUtilisateur[] => {
//   if (!data) return [];
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): ProfilUtilisateur[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): any[] => {
//   console.log('🔍 Extraction données de réponse:', response);
  
//   if (!response) {
//     console.log('❌ Réponse vide');
//     return [];
//   }
  
//   // Si response est déjà un tableau
//   if (Array.isArray(response)) {
//     return response;
//   }
  
//   // Si response.data existe
//   if (response.data) {
//     // Si data est un tableau
//     if (Array.isArray(response.data)) {
//       return response.data;
//     }
    
//     // Si data a une propriété results (pagination)
//     if (response.data.results && Array.isArray(response.data.results)) {
//       return response.data.results;
//     }
    
//     // Si data a une propriété data
//     if (response.data.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }
    
//     // Si data est un objet unique
//     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
//       return [response.data];
//     }
//   }
  
//   console.warn('⚠️ Format de réponse non reconnu:', response);
//   return [];
// };

// // Fonctions helper pour extraire les données utilisateur
// const getUsername = (profil: ProfilUtilisateur): string => {
//   if (!profil) return 'Non spécifié';
  
//   if (profil.user && typeof profil.user === 'object') {
//     return profil.user.username || profil.user.user_username || '';
//   } 
//   else if (typeof profil.user === 'string') {
//     return profil.user;
//   }
//   else if (profil.user_username) {
//     return profil.user_username;
//   }
//   else if (profil.username) {
//     return profil.username;
//   }
  
//   return 'Non spécifié';
// };

// const getEmail = (profil: ProfilUtilisateur): string => {
//   if (!profil) return '-';
  
//   if (profil.user && typeof profil.user === 'object') {
//     return profil.user.email || profil.user.user_email || '-';
//   }
//   else if (profil.user_email) {
//     return profil.user_email;
//   }
//   else if (profil.email) {
//     return profil.email;
//   }
  
//   return '-';
// };

// const getFullName = (profil: ProfilUtilisateur): string => {
//   if (!profil) return '-';
  
//   if (profil.user && typeof profil.user === 'object') {
//     const firstName = profil.user.first_name || '';
//     const lastName = profil.user.last_name || '';
//     const fullName = `${firstName} ${lastName}`.trim();
//     return fullName || '-';
//   }
//   else if (profil.first_name || profil.last_name) {
//     const firstName = profil.first_name || '';
//     const lastName = profil.last_name || '';
//     return `${firstName} ${lastName}`.trim();
//   }
  
//   return '-';
// };

// const getInitials = (profil: ProfilUtilisateur): string => {
//   const username = getUsername(profil);
//   return username?.[0]?.toUpperCase() || 'U';
// };

// const getStatus = (profil: ProfilUtilisateur): boolean => {
//   if (profil.user && typeof profil.user === 'object') {
//     return profil.user.is_active !== false;
//   }
//   return true;
// };

// const ProfilsUtilisateurs: React.FC = () => {
//   const [profils, setProfils] = useState<ProfilUtilisateur[]>([]);
//   const [usersWithoutProfile, setUsersWithoutProfile] = useState<UserType[]>([]);
//   const [filteredProfils, setFilteredProfils] = useState<ProfilUtilisateur[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [usersLoading, setUsersLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterDepartement, setFilterDepartement] = useState<string>('');
//   const [filterRole, setFilterRole] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingProfil, setEditingProfil] = useState<ProfilUtilisateur | undefined>();
//   const [selectedProfils, setSelectedProfils] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [isViewingDetails, setIsViewingDetails] = useState(false);
//   const [selectedProfilDetails, setSelectedProfilDetails] = useState<ProfilUtilisateur | null>(null);

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     actifs: 0,
//     administrateurs: 0,
//     techniciens: 0,
//     parDepartement: {} as Record<string, number>,
//     parRole: {} as Record<string, number>,
//     utilisateursDisponibles: 0
//   });

//   useEffect(() => {
//     fetchProfils();
//     fetchUsersWithoutProfile();
//   }, []);

//   useEffect(() => {
//     filterProfils();
//   }, [profils, searchTerm, filterDepartement, filterRole]);

//   useEffect(() => {
//     if (filteredProfils.length > 0 && selectedProfils.length === filteredProfils.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedProfils, filteredProfils]);

//   const fetchProfils = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Début chargement profils...');
      
//       const response = await profilsUtilisateurAPI.getAll();
//       console.log('📦 Réponse API profils:', response);
      
//       const extractedData = extractDataFromResponse(response);
//       console.log('📊 Données extraites:', extractedData);
      
//       if (extractedData.length === 0) {
//         console.log('ℹ️ Aucun profil trouvé dans la réponse');
//         setProfils([]);
//         setFilteredProfils([]);
//         calculerStatistiques([]);
//         return;
//       }
      
//       // Normaliser les données pour avoir une structure cohérente
//       const normalizedData = extractedData.map((profil: any, index: number) => {
//         console.log(`🔍 Profil ${index}:`, profil);
        
//         // Structure de base
//         const normalized: any = {
//           id: profil.id || index + 1,
//           departement: profil.departement || '',
//           telephone: profil.telephone || '',
//           role: profil.role || 'user',
//           date_embauche: profil.date_embauche || null
//         };
        
//         // Gestion de l'utilisateur
//         if (profil.user) {
//           if (typeof profil.user === 'number') {
//             // user est un ID
//             normalized.user = {
//               id: profil.user,
//               username: profil.user_username || `user_${profil.user}`,
//               email: profil.user_email || '',
//               first_name: profil.user_first_name || '',
//               last_name: profil.user_last_name || '',
//               is_active: true
//             };
//           } else if (typeof profil.user === 'object') {
//             // user est un objet
//             normalized.user = {
//               id: profil.user.id || profil.user_id || profil.id,
//               username: profil.user.username || profil.user_username || '',
//               email: profil.user.email || profil.user_email || '',
//               first_name: profil.user.first_name || '',
//               last_name: profil.user.last_name || '',
//               is_active: profil.user.is_active !== false
//             };
//           }
//         } else {
//           // Pas d'objet user, vérifier les propriétés directes
//           normalized.user = {
//             id: profil.user_id || profil.id,
//             username: profil.user_username || profil.username || '',
//             email: profil.user_email || profil.email || '',
//             first_name: profil.first_name || '',
//             last_name: profil.last_name || '',
//             is_active: true
//           };
//         }
        
//         return normalized;
//       });
      
//       console.log('👤 Profils normalisés:', normalizedData);
//       setProfils(normalizedData);
//       calculerStatistiques(normalizedData);
//       showMessage('success', `${normalizedData.length} profil(s) chargé(s) avec succès`);
      
//     } catch (err: any) {
//       console.error('❌ Erreur détaillée chargement profils:', {
//         message: err.message,
//         response: err.response,
//         status: err.response?.status,
//         data: err.response?.data
//       });
      
//       const errorMessage = err.response?.data?.detail 
//         || err.response?.data?.message 
//         || err.message 
//         || 'Erreur lors du chargement des profils utilisateurs';
      
//       setError(errorMessage);
//       showMessage('error', errorMessage);
      
//       // Données de test pour le développement
//       const testData = [
//         {
//           id: 1,
//           user: {
//             id: 1,
//             username: 'admin',
//             email: 'admin@example.com',
//             first_name: 'Admin',
//             last_name: 'System',
//             is_active: true
//           },
//           departement: 'Informatique',
//           telephone: '0123456789',
//           role: 'admin',
//           date_embauche: '2024-01-01'
//         },
//         {
//           id: 2,
//           user: {
//             id: 2,
//             username: 'technicien',
//             email: 'tech@example.com',
//             first_name: 'Technicien',
//             last_name: 'Support',
//             is_active: true
//           },
//           departement: 'Support Technique',
//           telephone: '0987654321',
//           role: 'technician',
//           date_embauche: '2024-02-01'
//         }
//       ];
      
//       setProfils(testData);
//       calculerStatistiques(testData);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsersWithoutProfile = async () => {
//     try {
//       setUsersLoading(true);
//       console.log('🔄 Chargement des utilisateurs sans profil...');
      
//       try {
//         const response = await usersAPI.getAll();
//         console.log('📋 Réponse API utilisateurs:', response);
        
//         const allUsers = extractDataFromResponse(response);
//         console.log('👥 Utilisateurs récupérés:', allUsers.length);
        
//         if (allUsers.length === 0) {
//           console.log('ℹ️ Aucun utilisateur trouvé');
//           setUsersWithoutProfile([]);
//           return;
//         }
        
//         // Récupérer les IDs des utilisateurs qui ont déjà un profil
//         const existingUserIds = new Set<number>();
        
//         profils.forEach((profil) => {
//           if (profil.user && typeof profil.user === 'object' && profil.user.id) {
//             existingUserIds.add(profil.user.id);
//           }
//         });
        
//         console.log('✅ IDs avec profil:', Array.from(existingUserIds));
        
//         // Filtrer les utilisateurs sans profil
//         const usersWithout = allUsers.filter((user: any) => 
//           !existingUserIds.has(user.id)
//         );
        
//         console.log('✅ Utilisateurs sans profil:', usersWithout.length);
        
//         // Formater pour le frontend
//         const formattedUsers = usersWithout.map((user: any) => ({
//           id: user.id,
//           username: user.username,
//           email: user.email || `${user.username}@example.com`,
//           first_name: user.first_name || '',
//           last_name: user.last_name || '',
//           full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
//           is_active: user.is_active !== false
//         }));
        
//         setUsersWithoutProfile(formattedUsers);
        
//         setStatistiques(prev => ({
//           ...prev,
//           utilisateursDisponibles: formattedUsers.length
//         }));
        
//       } catch (endpointError: any) {
//         console.error('❌ Erreur chargement utilisateurs:', endpointError);
        
//         // Fallback pour le débogage
//         const fallbackUsers = [
//           {
//             id: Date.now(),
//             username: `test${Date.now()}`,
//             email: `test${Date.now()}@example.com`,
//             first_name: 'Test',
//             last_name: 'User',
//             is_active: true
//           }
//         ];
//         setUsersWithoutProfile(fallbackUsers);
//         setStatistiques(prev => ({
//           ...prev,
//           utilisateursDisponibles: fallbackUsers.length
//         }));
        
//         showMessage('warning', 'Mode test activé pour les utilisateurs - Vérifiez votre API');
//       }
//     } catch (error: any) {
//       console.error('❌ Erreur générale chargement utilisateurs:', error);
//       showMessage('error', 'Erreur lors du chargement des utilisateurs');
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   const calculerStatistiques = (data: ProfilUtilisateur[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         actifs: 0,
//         administrateurs: 0,
//         techniciens: 0,
//         parDepartement: {},
//         parRole: {},
//         utilisateursDisponibles: statistiques.utilisateursDisponibles
//       });
//       return;
//     }

//     // Calcul des statistiques par département
//     const parDepartement = data.reduce((acc, profil) => {
//       const dept = profil.departement || 'Non spécifié';
//       acc[dept] = (acc[dept] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     // Calcul des statistiques par rôle
//     const parRole = data.reduce((acc, profil) => {
//       const role = profil.role || 'user';
//       acc[role] = (acc[role] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     const administrateurs = data.filter(p => p.role === 'admin').length;
//     const techniciens = data.filter(p => p.role === 'technician').length;

//     setStatistiques(prev => ({
//       ...prev,
//       total: data.length,
//       actifs: data.filter(p => getStatus(p)).length,
//       administrateurs,
//       techniciens,
//       parDepartement,
//       parRole
//     }));
//   };

//   const filterProfils = () => {
//     let filtered = safeArray(profils);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, profil => {
//         const userName = getUsername(profil).toLowerCase();
//         const userFullName = getFullName(profil).toLowerCase();
//         const userEmail = getEmail(profil).toLowerCase();
//         const departement = (profil.departement || '').toLowerCase();
//         const telephone = (profil.telephone || '').toLowerCase();
//         const search = searchTerm.toLowerCase();
        
//         return (
//           userName.includes(search) ||
//           userFullName.includes(search) ||
//           userEmail.includes(search) ||
//           departement.includes(search) ||
//           telephone.includes(search)
//         );
//       });
//     }

//     if (filterDepartement) {
//       filtered = safeFilter(filtered, profil => 
//         (profil.departement || '').toLowerCase().includes(filterDepartement.toLowerCase())
//       );
//     }

//     if (filterRole) {
//       filtered = safeFilter(filtered, profil => profil.role === filterRole);
//     }

//     console.log('🔍 Profils filtrés:', filtered.length);
//     setFilteredProfils(filtered);
//     setSelectedProfils([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   const handleSubmit = async (profilData: any) => {
//     try {
//       console.group('🔧 Soumission du profil');
//       console.log('📥 Données du formulaire:', profilData);
      
//       let apiData: any;
//       let response: any;
      
//       if (editingProfil) {
//         // MODE ÉDITION
//         apiData = {
//           departement: profilData.departement?.trim() || '',
//           telephone: profilData.telephone?.trim() || '',
//           role: profilData.role || 'user'
//         };
        
//         console.log('🔄 Mode ÉDITION - Données:', apiData);
//         console.log('📝 ID du profil à éditer:', editingProfil.id);
        
//         try {
//           response = await profilsUtilisateurAPI.update(editingProfil.id, apiData);
//           console.log('✅ Réponse update:', response);
//           showMessage('success', 'Profil utilisateur modifié avec succès');
//         } catch (updateError: any) {
//           console.error('❌ Erreur update:', updateError);
//           throw updateError;
//         }
        
//       } else {
//         // MODE CRÉATION
//         if (profilData.username && profilData.email && profilData.password) {
//           // Nouvel utilisateur + profil
//           apiData = {
//             username: profilData.username.trim(),
//             email: profilData.email.trim(),
//             password: profilData.password,
//             password_confirm: profilData.password_confirm,
//             name: profilData.name?.trim() || '',
//             departement: profilData.departement?.trim() || '',
//             telephone: profilData.telephone?.trim() || '',
//             role: profilData.role || 'user'
//           };
          
//           console.log('🆕 Mode CRÉATION NOUVEL UTILISATEUR - Données:', apiData);
          
//           try {
//             response = await profilsUtilisateurAPI.create(apiData);
//             console.log('✅ Réponse create:', response);
//             showMessage('success', 'Utilisateur et profil créés avec succès');
//           } catch (createError: any) {
//             if (createError.response?.status === 400) {
//               console.log('⚠️ Tentative avec format alternatif...');
//               // Format alternatif
//               const altData = {
//                 user_username: apiData.username,
//                 user_email: apiData.email,
//                 password: apiData.password,
//                 departement: apiData.departement,
//                 telephone: apiData.telephone,
//                 role: apiData.role
//               };
//               response = await profilsUtilisateurAPI.create(altData);
//               console.log('✅ Réponse alternative:', response);
//               showMessage('success', 'Utilisateur et profil créés avec succès');
//             } else {
//               throw createError;
//             }
//           }
          
//         } else if (profilData.user_username) {
//           // Association à utilisateur existant
//           apiData = {
//             user_username: profilData.user_username.trim(),
//             departement: profilData.departement?.trim() || '',
//             telephone: profilData.telephone?.trim() || '',
//             role: profilData.role || 'user'
//           };
          
//           console.log('🔗 Mode ASSOCIATION - Données:', apiData);
          
//           response = await profilsUtilisateurAPI.create(apiData);
//           console.log('✅ Réponse create:', response);
//           showMessage('success', 'Profil créé pour l\'utilisateur existant');
          
//         } else {
//           // Mode par défaut
//           apiData = {
//             user_username: profilData.user?.username || '',
//             departement: profilData.departement?.trim() || '',
//             telephone: profilData.telephone?.trim() || '',
//             role: profilData.role || 'user'
//           };
          
//           console.log('🔧 Mode DÉFAUT - Données:', apiData);
          
//           response = await profilsUtilisateurAPI.create(apiData);
//           console.log('✅ Réponse create:', response);
//           showMessage('success', 'Profil utilisateur créé avec succès');
//         }
//       }
      
//       console.groupEnd();
      
//       // Recharger les données
//       await fetchProfils();
//       await fetchUsersWithoutProfile();
//       setIsFormOpen(false);
//       setEditingProfil(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur soumission:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message
//       });
      
//       if (error.response?.data) {
//         const errorData = error.response.data;
        
//         if (errorData.detail) {
//           showMessage('error', `Erreur: ${errorData.detail}`);
//         } else if (errorData.message) {
//           showMessage('error', `Erreur: ${errorData.message}`);
//         } else if (typeof errorData === 'object') {
//           const errors = Object.entries(errorData)
//             .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
//             .join('; ');
//           showMessage('error', `Erreurs: ${errors}`);
//         } else {
//           showMessage('error', 'Erreur lors de l\'opération');
//         }
//       } else if (error.message) {
//         showMessage('error', error.message);
//       } else {
//         showMessage('error', 'Erreur réseau ou serveur');
//       }
//     }
//   };

//   const toggleSelectProfil = (id: number) => {
//     setSelectedProfils(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedProfils([]);
//     } else {
//       const allIds = filteredProfils.map(p => p.id);
//       setSelectedProfils(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedProfils.length === 0) {
//       showMessage('error', 'Aucun profil sélectionné');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProfils.length} profil(s) ?`)) {
//       try {
//         const deletePromises = selectedProfils.map(id => 
//           profilsUtilisateurAPI.delete(id).catch(err => {
//             console.error(`❌ Erreur suppression profil ${id}:`, err);
//             return null;
//           })
//         );
        
//         await Promise.all(deletePromises);
        
//         showMessage('success', `${selectedProfils.length} profil(s) supprimé(s) avec succès`);
//         setSelectedProfils([]);
//         await fetchProfils();
//         await fetchUsersWithoutProfile();
//       } catch (error) {
//         console.error('❌ Erreur suppression multiple:', error);
//         showMessage('error', 'Erreur lors de la suppression des profils');
//       }
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedProfils.length === 0) {
//       showMessage('error', 'Aucun profil sélectionné');
//       return;
//     }

//     if (selectedProfils.length === 1) {
//       const profil = profils.find(p => p.id === selectedProfils[0]);
//       if (profil) {
//         handleEdit(profil);
//       }
//     } else {
//       showMessage('info', `Sélectionnez un seul profil pour modifier`);
//     }
//   };

//   const handleViewDetails = (profil: ProfilUtilisateur) => {
//     console.log('🔍 Voir détails profil:', profil);
//     setSelectedProfilDetails(profil);
//     setIsViewingDetails(true);
//   };

//   const handleEdit = (profil: ProfilUtilisateur) => {
//     console.log('✏️ Édition du profil:', profil);
//     setEditingProfil(profil);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
//       try {
//         await profilsUtilisateurAPI.delete(id);
//         showMessage('success', 'Profil supprimé avec succès');
//         await fetchProfils();
//         await fetchUsersWithoutProfile();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression:', error);
//         const errorMsg = error.response?.data?.detail || error.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMsg);
//       }
//     }
//   };

//   const handleAddNew = () => {
//     console.log('➕ Nouveau profil');
//     setEditingProfil(undefined);
//     setIsFormOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       if (filteredProfils.length === 0) {
//         showMessage('error', 'Aucune donnée à exporter');
//         return;
//       }

//       const dataToExport = filteredProfils.map(p => ({
//         'Username': getUsername(p),
//         'Email': getEmail(p),
//         'Service': getServiceFromDepartement(p.departement),
//         'Département': p.departement || 'Non spécifié',
//         'Rôle': getRoleText(p.role),
//         'Statut': getStatus(p) ? 'Actif' : 'Inactif',
//         'Téléphone': p.telephone || 'Non spécifié'
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `profils_utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterDepartement('');
//     setFilterRole('');
//     setSelectedProfils([]);
//     showMessage('info', 'Filtres réinitialisés');
//   };

//   const handleRetry = () => {
//     setError('');
//     fetchProfils();
//     fetchUsersWithoutProfile();
//   };

//   const getRoleBadge = (role: string) => {
//     const badges = {
//       admin: 'badge-error',
//       director: 'badge-warning',
//       technician: 'badge-primary',
//       secretary: 'badge-info',
//       user: 'badge-neutral'
//     };
//     return badges[role as keyof typeof badges] || 'badge-neutral';
//   };

//   const getRoleText = (role: string) => {
//     const texts = {
//       admin: 'Administrateur',
//       director: 'Directeur',
//       technician: 'Technicien',
//       secretary: 'Secrétaire',
//       user: 'Utilisateur'
//     };
//     return texts[role as keyof typeof texts] || role;
//   };

//   const getServiceFromDepartement = (departement: string | undefined): string => {
//     if (!departement) return 'Non attribué';
    
//     const mapping: Record<string, string> = {
//       'Informatique': 'Supp Tech',
//       'Ressources Humaines': 'Administration',
//       'Comptabilité': 'Finance',
//       'Direction': 'Management',
//       'Secrétariat': 'Supp Ad',
//       'Marketing': 'Commercial',
//       'Production': 'Opérations',
//       'Commercial': 'Ventes'
//     };
    
//     return mapping[departement] || departement;
//   };

//   const getServiceBadge = (departement: string | undefined) => {
//     const service = getServiceFromDepartement(departement);
    
//     const badges: Record<string, string> = {
//       'Supp Tech': 'badge-primary',
//       'Administration': 'badge-secondary',
//       'Finance': 'badge-accent',
//       'Management': 'badge-warning',
//       'Supp Ad': 'badge-info',
//       'Commercial': 'badge-success',
//       'Opérations': 'badge-error',
//       'Ventes': 'badge-neutral'
//     };
//     return badges[service] || 'badge-outline';
//   };

//   const getStatusBadge = (isActive: boolean) => {
//     return isActive ? 'badge-success' : 'badge-error';
//   };

//   const getStatusText = (isActive: boolean) => {
//     return isActive ? 'Actif' : 'Inactif';
//   };

//   const formatDate = (dateString: string | null | undefined): string => {
//     if (!dateString) return 'Non spécifiée';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const departements = [...new Set(safeArray(profils).map(p => p.departement).filter(Boolean))];
//   const roles = [...new Set(safeArray(profils).map(p => p.role).filter(Boolean))];

//   if (loading || usersLoading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">
//             {loading ? 'Chargement des profils...' : 'Chargement des utilisateurs...'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4 flex items-center justify-between`}>
//           <span>{message.text}</span>
//           <button className="btn btn-ghost btn-sm" onClick={() => setMessage(null)}>
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <AlertCircle className="h-5 w-5" />
//               <span>{error}</span>
//             </div>
//             <button 
//               className="btn btn-outline btn-sm"
//               onClick={handleRetry}
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Réessayer
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">👥 Gestion des Profils Utilisateurs</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray(filteredProfils).length} profil(s) trouvé(s)
//             {selectedProfils.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedProfils.length} sélectionné(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleExport}
//             className="btn btn-outline btn-sm"
//             title="Exporter la liste"
//             disabled={filteredProfils.length === 0}
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//             title="Créer un nouveau profil"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouveau profil
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <User className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.actifs}</h3>
//             <p className="text-sm opacity-60">Actifs</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Key className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.administrateurs}</h3>
//             <p className="text-sm opacity-60">Administrateurs</p>
//           </div>
//         </div>

//         <div className="card bg-primary/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Briefcase className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-primary">{statistiques.techniciens}</h3>
//             <p className="text-sm opacity-60">Techniciens</p>
//           </div>
//         </div>

//         <div className="card bg-info/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <User className="h-6 w-6 text-info mx-auto mb-2" />
//             <h3 className={`text-lg font-bold ${statistiques.utilisateursDisponibles > 0 ? 'text-info' : 'text-warning'}`}>
//               {statistiques.utilisateursDisponibles}
//             </h3>
//             <p className="text-sm opacity-60">Disponibles</p>
//           </div>
//         </div>
//       </div>

//       {usersWithoutProfile.length > 0 && (
//         <div className="alert alert-warning mb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <User className="h-5 w-5" />
//               <span>
//                 <strong>{usersWithoutProfile.length} utilisateur(s)</strong> sans profil
//               </span>
//             </div>
//             <button
//               onClick={handleAddNew}
//               className="btn btn-warning btn-sm"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Créer des profils
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Username, email, téléphone, département..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🏢 Département</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterDepartement}
//                 onChange={(e) => setFilterDepartement(e.target.value)}
//               >
//                 <option value="">Tous les départements</option>
//                 {departements.map((dept, index) => (
//                   <option key={index} value={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">👑 Rôle</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterRole}
//                 onChange={(e) => setFilterRole(e.target.value)}
//               >
//                 <option value="">Tous les rôles</option>
//                 {roles.map((role, index) => (
//                   <option key={index} value={role}>
//                     {getRoleText(role)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Statistiques</span>
//               </label>
//               <div className="flex justify-between items-center">
//                 <div className="text-sm text-base-content opacity-70">
//                   {safeArray(filteredProfils).length} / {safeArray(profils).length} profils
//                 </div>
//                 <button
//                   onClick={resetFilters}
//                   className="btn btn-outline btn-sm"
//                 >
//                   <Filter className="h-4 w-4 mr-2" />
//                   Réinitialiser
//                 </button>
//               </div>
//             </div>
//           </div>

//           {selectedProfils.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedProfils.length} profil(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                     disabled={selectedProfils.length !== 1}
//                     title={selectedProfils.length !== 1 ? "Sélectionnez un seul profil pour modifier" : ""}
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedProfils.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedProfils([])}
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

//       <div className="card bg-base-200 shadow-xl">
//         <div className="card-body p-0">
//           <div className="overflow-x-auto">
//             <table className="table w-full">
//               <thead>
//                 <tr className="bg-base-300">
//                   <th className="font-bold w-12 text-center">
//                     <div className="flex justify-center">
//                       <button
//                         onClick={toggleSelectAll}
//                         className="btn btn-ghost btn-xs p-1 hover:bg-base-200"
//                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
//                         disabled={filteredProfils.length === 0}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-5 w-5 text-primary" />
//                         ) : (
//                           <Square className="h-5 w-5 text-base-content/40" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th className="font-bold px-4 py-3">Utilisateur (username)</th>
//                   <th className="font-bold px-4 py-3">Email</th>
//                   <th className="font-bold px-4 py-3">Service</th>
//                   <th className="font-bold px-4 py-3">Département</th>
//                   <th className="font-bold px-4 py-3">Rôle</th>
//                   <th className="font-bold px-4 py-3">Statut</th>
//                   <th className="font-bold px-4 py-3">Téléphone</th>
//                   <th className="font-bold px-4 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredProfils).length > 0 ? (
//                   safeArray(filteredProfils).map((profil) => (
//                     <tr key={profil.id} className="hover:bg-base-100 border-b border-base-300">
//                       <td className="text-center py-3">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm"
//                             checked={selectedProfils.includes(profil.id)}
//                             onChange={() => toggleSelectProfil(profil.id)}
//                           />
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="avatar placeholder">
//                             <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
//                               <span className="text-xs">{getInitials(profil)}</span>
//                             </div>
//                           </div>
//                           <div>
//                             <div className="font-semibold">
//                               @{getUsername(profil)}
//                             </div>
//                             <div className="text-xs text-base-content opacity-60">
//                               {getFullName(profil)}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2 text-sm">
//                           <Mail className="h-3 w-3 opacity-70" />
//                           <span className="truncate max-w-[180px]" title={getEmail(profil)}>
//                             {getEmail(profil)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className={`badge ${getServiceBadge(profil.departement)}`}>
//                           {getServiceFromDepartement(profil.departement)}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <Building className="h-4 w-4 text-base-content opacity-50" />
//                           <span>{profil.departement || '-'}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className={`badge ${getRoleBadge(profil.role)}`}>
//                           {getRoleText(profil.role)}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className={`badge ${getStatusBadge(getStatus(profil))}`}>
//                           {getStatusText(getStatus(profil))}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         {profil.telephone ? (
//                           <div className="flex items-center gap-2 text-sm">
//                             <Phone className="h-3 w-3 opacity-70" />
//                             <span>{profil.telephone}</span>
//                           </div>
//                         ) : '-'}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex justify-center space-x-2">
//                           <button
//                             onClick={() => handleViewDetails(profil)}
//                             className="btn btn-ghost btn-xs btn-square text-info hover:bg-info/10"
//                             title="Voir les détails"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleEdit(profil)}
//                             className="btn btn-ghost btn-xs btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(profil.id)}
//                             className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={9} className="text-center py-12">
//                       <div className="text-base-content opacity-40">
//                         <User className="h-16 w-16 mx-auto mb-4" />
//                         <p className="text-lg font-medium">Aucun profil utilisateur trouvé</p>
//                         <p className="text-sm mt-2">
//                           {searchTerm || filterDepartement || filterRole 
//                             ? "Essayez de modifier vos critères de recherche" 
//                             : "Aucun profil utilisateur n'est enregistré"
//                           }
//                         </p>
//                         {profils.length === 0 && (
//                           <div className="mt-4">
//                             <button
//                               onClick={handleAddNew}
//                               className="btn btn-primary btn-sm"
//                             >
//                               <Plus className="h-4 w-4 mr-2" />
//                               Créer un premier profil
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal de détails des profils */}
//       {isViewingDetails && selectedProfilDetails && (
//         <div className="modal modal-open modal-bottom sm:modal-middle">
//           <div className="modal-box bg-base-200 max-w-4xl">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="font-bold text-2xl text-base-content">👤 Détails du profil utilisateur</h3>
//               <button 
//                 onClick={() => setIsViewingDetails(false)} 
//                 className="btn btn-sm btn-circle btn-ghost"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Colonne gauche: Informations personnelles */}
//               <div className="space-y-6">
//                 <div className="flex items-center space-x-4 p-4 bg-base-100 rounded-lg">
//                   <div className="avatar placeholder">
//                     <div className="bg-primary text-primary-content rounded-full w-16 h-16">
//                       <span className="text-2xl">
//                         {getInitials(selectedProfilDetails)}
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold">{getFullName(selectedProfilDetails)}</h2>
//                     <p className="text-base-content opacity-60">@{getUsername(selectedProfilDetails)}</p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-4 p-4 bg-base-100 rounded-lg">
//                   <h4 className="font-semibold text-lg flex items-center gap-2">
//                     <Mail className="h-5 w-5" /> Informations de contact
//                   </h4>
                  
//                   <div className="space-y-3">
//                     <div>
//                       <label className="label-text text-sm opacity-60">📧 Email</label>
//                       <p className="font-medium text-lg">{getEmail(selectedProfilDetails)}</p>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">📞 Téléphone</label>
//                       <p className="font-medium text-lg">{selectedProfilDetails.telephone || 'Non spécifié'}</p>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">🏢 Département</label>
//                       <p className="font-medium text-lg">{selectedProfilDetails.departement || 'Non spécifié'}</p>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">🏭 Service</label>
//                       <div className={`badge ${getServiceBadge(selectedProfilDetails.departement)} p-3 mt-1`}>
//                         <span className="text-lg">{getServiceFromDepartement(selectedProfilDetails.departement)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Colonne droite: Informations système */}
//               <div className="space-y-6">
//                 <div className="p-4 bg-base-100 rounded-lg">
//                   <h4 className="font-semibold text-lg flex items-center gap-2 mb-4">
//                     <Key className="h-5 w-5" /> Informations système
//                   </h4>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="label-text text-sm opacity-60">👑 Rôle</label>
//                       <div className={`badge ${getRoleBadge(selectedProfilDetails.role)} gap-2 p-3 mt-1`}>
//                         <span className="text-lg">{getRoleText(selectedProfilDetails.role)}</span>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">🔓 Statut</label>
//                       <div className={`badge ${getStatusBadge(getStatus(selectedProfilDetails))} p-3 mt-1`}>
//                         <span className="text-lg">{getStatusText(getStatus(selectedProfilDetails))}</span>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">📊 ID du profil</label>
//                       <p className="font-medium text-lg">{selectedProfilDetails.id}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="p-4 bg-base-100 rounded-lg">
//                   <h4 className="font-semibold text-lg flex items-center gap-2 mb-4">
//                     <Calendar className="h-5 w-5" /> Informations complémentaires
//                   </h4>
                  
//                   <div className="space-y-3">
//                     <div>
//                       <label className="label-text text-sm opacity-60">📅 Date d'embauche</label>
//                       <p className="font-medium">{formatDate(selectedProfilDetails.date_embauche)}</p>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">🆔 ID Utilisateur</label>
//                       <p className="font-medium">
//                         {selectedProfilDetails.user && typeof selectedProfilDetails.user === 'object' 
//                           ? selectedProfilDetails.user.id 
//                           : 'Non spécifié'}
//                       </p>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">👤 Nom complet</label>
//                       <p className="font-medium">{getFullName(selectedProfilDetails)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="modal-action mt-6">
//               <button onClick={() => setIsViewingDetails(false)} className="btn btn-primary">
//                 Fermer
//               </button>
//               <button 
//                 onClick={() => {
//                   setIsViewingDetails(false);
//                   handleEdit(selectedProfilDetails);
//                 }}
//                 className="btn btn-outline btn-primary"
//               >
//                 <Edit className="h-4 w-4 mr-2" />
//                 Modifier ce profil
//               </button>
//             </div>
//           </div>
          
//           {/* Overlay pour fermer le modal en cliquant à côté */}
//           <div 
//             className="modal-backdrop" 
//             onClick={() => setIsViewingDetails(false)}
//           />
//         </div>
//       )}

//       <ProfilUtilisateurForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingProfil(undefined);
//         }}
//         onSubmit={handleSubmit}
//         profil={editingProfil}
//         usersWithoutProfile={usersWithoutProfile}
//       />
//     </div>
//   );
// };

// export default ProfilsUtilisateurs;





// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Eye, Filter, Download, Edit, Trash2, CheckSquare, Square, X, User, Mail, Phone, Building, Briefcase, Calendar, CheckCircle, Key, Users, AlertCircle, RefreshCw } from 'lucide-react';
// import { ProfilUtilisateur, User as UserType } from '../types';
// import { profilsUtilisateurAPI, usersAPI } from '../services/api';
// import ProfilUtilisateurForm from '../components/ProfilUtilisateurForm';

// // Fonctions helper pour la sécurité des tableaux
// const safeArray = (data: any): ProfilUtilisateur[] => {
//   if (!data) return [];
//   return Array.isArray(data) ? data : [];
// };

// const safeFilter = (array: any[], condition: (item: any) => boolean): ProfilUtilisateur[] => {
//   if (!Array.isArray(array)) return [];
//   return array.filter(condition);
// };

// const extractDataFromResponse = (response: any): any[] => {
//   console.log('🔍 Extraction données de réponse:', response);
  
//   if (!response) {
//     console.log('❌ Réponse vide');
//     return [];
//   }
  
//   // Si response est déjà un tableau
//   if (Array.isArray(response)) {
//     return response;
//   }
  
//   // Si response.data existe
//   if (response.data) {
//     // Si data est un tableau
//     if (Array.isArray(response.data)) {
//       return response.data;
//     }
    
//     // Si data a une propriété results (pagination)
//     if (response.data.results && Array.isArray(response.data.results)) {
//       return response.data.results;
//     }
    
//     // Si data a une propriété data
//     if (response.data.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }
    
//     // Si data est un objet unique
//     if (typeof response.data === 'object' && !Array.isArray(response.data)) {
//       return [response.data];
//     }
//   }
  
//   console.warn('⚠️ Format de réponse non reconnu:', response);
//   return [];
// };

// // Fonctions helper pour extraire les données utilisateur
// const getUsername = (profil: ProfilUtilisateur): string => {
//   if (!profil) return 'Non spécifié';
  
//   if (profil.user && typeof profil.user === 'object') {
//     return profil.user.username || profil.user.user_username || '';
//   } 
//   else if (typeof profil.user === 'string') {
//     return profil.user;
//   }
//   else if (profil.user_username) {
//     return profil.user_username;
//   }
//   else if (profil.username) {
//     return profil.username;
//   }
  
//   return 'Non spécifié';
// };

// const getEmail = (profil: ProfilUtilisateur): string => {
//   if (!profil) return '-';
  
//   if (profil.user && typeof profil.user === 'object') {
//     return profil.user.email || profil.user.user_email || '-';
//   }
//   else if (profil.user_email) {
//     return profil.user_email;
//   }
//   else if (profil.email) {
//     return profil.email;
//   }
  
//   return '-';
// };

// const getFullName = (profil: ProfilUtilisateur): string => {
//   if (!profil) return '-';
  
//   if (profil.user && typeof profil.user === 'object') {
//     const firstName = profil.user.first_name || '';
//     const lastName = profil.user.last_name || '';
//     const fullName = `${firstName} ${lastName}`.trim();
//     return fullName || '-';
//   }
//   else if (profil.first_name || profil.last_name) {
//     const firstName = profil.first_name || '';
//     const lastName = profil.last_name || '';
//     return `${firstName} ${lastName}`.trim();
//   }
  
//   return '-';
// };

// const getInitials = (profil: ProfilUtilisateur): string => {
//   const username = getUsername(profil);
//   return username?.[0]?.toUpperCase() || 'U';
// };

// const getStatus = (profil: ProfilUtilisateur): boolean => {
//   if (profil.user && typeof profil.user === 'object') {
//     return profil.user.is_active !== false;
//   }
//   return true;
// };

// // Fonction pour obtenir la date d'inscription de l'utilisateur (depuis son registre)
// const getDateInscription = (profil: ProfilUtilisateur): string | null => {
//   if (!profil) return null;
  
//   // Chercher la date d'inscription dans l'objet user
//   if (profil.user && typeof profil.user === 'object') {
//     return profil.user.date_inscription || 
//            profil.user.date_joined || 
//            profil.user.created_at || 
//            profil.user_created_at || 
//            null;
//   }
  
//   // Si pas d'objet user, chercher directement dans le profil
//   return profil.user_date_inscription || 
//          profil.user_date_joined || 
//          profil.user_created_at || 
//          null;
// };

// const ProfilsUtilisateurs: React.FC = () => {
//   const [profils, setProfils] = useState<ProfilUtilisateur[]>([]);
//   const [usersWithoutProfile, setUsersWithoutProfile] = useState<UserType[]>([]);
//   const [filteredProfils, setFilteredProfils] = useState<ProfilUtilisateur[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [usersLoading, setUsersLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterDepartement, setFilterDepartement] = useState<string>('');
//   const [filterRole, setFilterRole] = useState<string>('');
//   const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingProfil, setEditingProfil] = useState<ProfilUtilisateur | undefined>();
//   const [selectedProfils, setSelectedProfils] = useState<number[]>([]);
//   const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
//   const [isViewingDetails, setIsViewingDetails] = useState(false);
//   const [selectedProfilDetails, setSelectedProfilDetails] = useState<ProfilUtilisateur | null>(null);

//   // Statistiques
//   const [statistiques, setStatistiques] = useState({
//     total: 0,
//     actifs: 0,
//     administrateurs: 0,
//     techniciens: 0,
//     parDepartement: {} as Record<string, number>,
//     parRole: {} as Record<string, number>,
//     utilisateursDisponibles: 0
//   });

//   useEffect(() => {
//     fetchProfils();
//     fetchUsersWithoutProfile();
//   }, []);

//   useEffect(() => {
//     filterProfils();
//   }, [profils, searchTerm, filterDepartement, filterRole]);

//   useEffect(() => {
//     if (filteredProfils.length > 0 && selectedProfils.length === filteredProfils.length) {
//       setIsSelectAll(true);
//     } else {
//       setIsSelectAll(false);
//     }
//   }, [selectedProfils, filteredProfils]);

//   const fetchProfils = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔄 Début chargement profils...');
      
//       const response = await profilsUtilisateurAPI.getAll();
//       console.log('📦 Réponse API profils:', response);
      
//       const extractedData = extractDataFromResponse(response);
//       console.log('📊 Données extraites:', extractedData);
      
//       if (extractedData.length === 0) {
//         console.log('ℹ️ Aucun profil trouvé dans la réponse');
//         setProfils([]);
//         setFilteredProfils([]);
//         calculerStatistiques([]);
//         return;
//       }
      
//       // Normaliser les données pour avoir une structure cohérente
//       const normalizedData = extractedData.map((profil: any, index: number) => {
//         console.log(`🔍 Profil ${index}:`, profil);
        
//         // Structure de base
//         const normalized: any = {
//           id: profil.id || index + 1,
//           departement: profil.departement || '',
//           telephone: profil.telephone || '',
//           role: profil.role || 'user',
//           created_at: profil.created_at || null // Date de création du profil
//         };
        
//         // Gestion de l'utilisateur
//         if (profil.user) {
//           if (typeof profil.user === 'number') {
//             // user est un ID
//             normalized.user = {
//               id: profil.user,
//               username: profil.user_username || `user_${profil.user}`,
//               email: profil.user_email || '',
//               first_name: profil.user_first_name || '',
//               last_name: profil.user_last_name || '',
//               is_active: true,
//               date_inscription: profil.user_date_inscription || profil.user_date_joined || null
//             };
//           } else if (typeof profil.user === 'object') {
//             // user est un objet
//             normalized.user = {
//               id: profil.user.id || profil.user_id || profil.id,
//               username: profil.user.username || profil.user_username || '',
//               email: profil.user.email || profil.user_email || '',
//               first_name: profil.user.first_name || '',
//               last_name: profil.user.last_name || '',
//               is_active: profil.user.is_active !== false,
//               // Priorité à date_inscription de l'utilisateur
//               date_inscription: profil.user.date_inscription || 
//                               profil.user.date_joined || 
//                               profil.user.created_at || 
//                               profil.user_created_at || 
//                               null
//             };
//           }
//         } else {
//           // Pas d'objet user, vérifier les propriétés directes
//           normalized.user = {
//             id: profil.user_id || profil.id,
//             username: profil.user_username || profil.username || '',
//             email: profil.user_email || profil.email || '',
//             first_name: profil.first_name || '',
//             last_name: profil.last_name || '',
//             is_active: true,
//             date_inscription: profil.user_date_inscription || profil.user_date_joined || null
//           };
//         }
        
//         return normalized;
//       });
      
//       console.log('👤 Profils normalisés:', normalizedData);
//       setProfils(normalizedData);
//       calculerStatistiques(normalizedData);
//       showMessage('success', `${normalizedData.length} profil(s) chargé(s) avec succès`);
      
//     } catch (err: any) {
//       console.error('❌ Erreur détaillée chargement profils:', {
//         message: err.message,
//         response: err.response,
//         status: err.response?.status,
//         data: err.response?.data
//       });
      
//       const errorMessage = err.response?.data?.detail 
//         || err.response?.data?.message 
//         || err.message 
//         || 'Erreur lors du chargement des profils utilisateurs';
      
//       setError(errorMessage);
//       showMessage('error', errorMessage);
      
//       // Données de test pour le développement
//       const testData = [
//         {
//           id: 1,
//           user: {
//             id: 1,
//             username: 'admin',
//             email: 'admin@example.com',
//             first_name: 'Admin',
//             last_name: 'System',
//             is_active: true,
//             date_inscription: '2024-01-01T10:30:00Z' // Date d'inscription utilisateur
//           },
//           departement: 'Informatique',
//           telephone: '0123456789',
//           role: 'admin',
//           created_at: '2024-01-02T09:15:00Z' // Date création profil
//         },
//         {
//           id: 2,
//           user: {
//             id: 2,
//             username: 'technicien',
//             email: 'tech@example.com',
//             first_name: 'Technicien',
//             last_name: 'Support',
//             is_active: true,
//             date_inscription: '2024-02-15T14:45:00Z' // Date d'inscription utilisateur
//           },
//           departement: 'Support Technique',
//           telephone: '0987654321',
//           role: 'technician',
//           created_at: '2024-02-16T10:20:00Z' // Date création profil
//         }
//       ];
      
//       setProfils(testData);
//       calculerStatistiques(testData);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsersWithoutProfile = async () => {
//     try {
//       setUsersLoading(true);
//       console.log('🔄 Chargement des utilisateurs sans profil...');
      
//       try {
//         const response = await usersAPI.getAll();
//         console.log('📋 Réponse API utilisateurs:', response);
        
//         const allUsers = extractDataFromResponse(response);
//         console.log('👥 Utilisateurs récupérés:', allUsers.length);
        
//         if (allUsers.length === 0) {
//           console.log('ℹ️ Aucun utilisateur trouvé');
//           setUsersWithoutProfile([]);
//           return;
//         }
        
//         // Récupérer les IDs des utilisateurs qui ont déjà un profil
//         const existingUserIds = new Set<number>();
        
//         profils.forEach((profil) => {
//           if (profil.user && typeof profil.user === 'object' && profil.user.id) {
//             existingUserIds.add(profil.user.id);
//           }
//         });
        
//         console.log('✅ IDs avec profil:', Array.from(existingUserIds));
        
//         // Filtrer les utilisateurs sans profil
//         const usersWithout = allUsers.filter((user: any) => 
//           !existingUserIds.has(user.id)
//         );
        
//         console.log('✅ Utilisateurs sans profil:', usersWithout.length);
        
//         // Formater pour le frontend
//         const formattedUsers = usersWithout.map((user: any) => ({
//           id: user.id,
//           username: user.username,
//           email: user.email || `${user.username}@example.com`,
//           first_name: user.first_name || '',
//           last_name: user.last_name || '',
//           full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
//           is_active: user.is_active !== false,
//           date_inscription: user.date_inscription || user.date_joined || user.created_at || null
//         }));
        
//         setUsersWithoutProfile(formattedUsers);
        
//         setStatistiques(prev => ({
//           ...prev,
//           utilisateursDisponibles: formattedUsers.length
//         }));
        
//       } catch (endpointError: any) {
//         console.error('❌ Erreur chargement utilisateurs:', endpointError);
        
//         // Fallback pour le débogage
//         const fallbackUsers = [
//           {
//             id: Date.now(),
//             username: `test${Date.now()}`,
//             email: `test${Date.now()}@example.com`,
//             first_name: 'Test',
//             last_name: 'User',
//             is_active: true,
//             date_inscription: new Date().toISOString()
//           }
//         ];
//         setUsersWithoutProfile(fallbackUsers);
//         setStatistiques(prev => ({
//           ...prev,
//           utilisateursDisponibles: fallbackUsers.length
//         }));
        
//         showMessage('warning', 'Mode test activé pour les utilisateurs - Vérifiez votre API');
//       }
//     } catch (error: any) {
//       console.error('❌ Erreur générale chargement utilisateurs:', error);
//       showMessage('error', 'Erreur lors du chargement des utilisateurs');
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   const calculerStatistiques = (data: ProfilUtilisateur[]) => {
//     if (!data || data.length === 0) {
//       setStatistiques({
//         total: 0,
//         actifs: 0,
//         administrateurs: 0,
//         techniciens: 0,
//         parDepartement: {},
//         parRole: {},
//         utilisateursDisponibles: statistiques.utilisateursDisponibles
//       });
//       return;
//     }

//     // Calcul des statistiques par département
//     const parDepartement = data.reduce((acc, profil) => {
//       const dept = profil.departement || 'Non spécifié';
//       acc[dept] = (acc[dept] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     // Calcul des statistiques par rôle
//     const parRole = data.reduce((acc, profil) => {
//       const role = profil.role || 'user';
//       acc[role] = (acc[role] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     const administrateurs = data.filter(p => p.role === 'admin').length;
//     const techniciens = data.filter(p => p.role === 'technician').length;

//     setStatistiques(prev => ({
//       ...prev,
//       total: data.length,
//       actifs: data.filter(p => getStatus(p)).length,
//       administrateurs,
//       techniciens,
//       parDepartement,
//       parRole
//     }));
//   };

//   const filterProfils = () => {
//     let filtered = safeArray(profils);

//     if (searchTerm) {
//       filtered = safeFilter(filtered, profil => {
//         const userName = getUsername(profil).toLowerCase();
//         const userFullName = getFullName(profil).toLowerCase();
//         const userEmail = getEmail(profil).toLowerCase();
//         const departement = (profil.departement || '').toLowerCase();
//         const telephone = (profil.telephone || '').toLowerCase();
//         const search = searchTerm.toLowerCase();
        
//         return (
//           userName.includes(search) ||
//           userFullName.includes(search) ||
//           userEmail.includes(search) ||
//           departement.includes(search) ||
//           telephone.includes(search)
//         );
//       });
//     }

//     if (filterDepartement) {
//       filtered = safeFilter(filtered, profil => 
//         (profil.departement || '').toLowerCase().includes(filterDepartement.toLowerCase())
//       );
//     }

//     if (filterRole) {
//       filtered = safeFilter(filtered, profil => profil.role === filterRole);
//     }

//     console.log('🔍 Profils filtrés:', filtered.length);
//     setFilteredProfils(filtered);
//     setSelectedProfils([]);
//   };

//   const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   const handleSubmit = async (profilData: any) => {
//     try {
//       console.group('🔧 Soumission du profil');
//       console.log('📥 Données du formulaire:', profilData);
      
//       let apiData: any;
//       let response: any;
      
//       if (editingProfil) {
//         // MODE ÉDITION
//         apiData = {
//           departement: profilData.departement?.trim() || '',
//           telephone: profilData.telephone?.trim() || '',
//           role: profilData.role || 'user'
//         };
        
//         console.log('🔄 Mode ÉDITION - Données:', apiData);
//         console.log('📝 ID du profil à éditer:', editingProfil.id);
        
//         try {
//           response = await profilsUtilisateurAPI.update(editingProfil.id, apiData);
//           console.log('✅ Réponse update:', response);
//           showMessage('success', 'Profil utilisateur modifié avec succès');
//         } catch (updateError: any) {
//           console.error('❌ Erreur update:', updateError);
//           throw updateError;
//         }
        
//       } else {
//         // MODE CRÉATION
//         if (profilData.username && profilData.email && profilData.password) {
//           // Nouvel utilisateur + profil
//           apiData = {
//             username: profilData.username.trim(),
//             email: profilData.email.trim(),
//             password: profilData.password,
//             password_confirm: profilData.password_confirm,
//             name: profilData.name?.trim() || '',
//             departement: profilData.departement?.trim() || '',
//             telephone: profilData.telephone?.trim() || '',
//             role: profilData.role || 'user'
//           };
          
//           console.log('🆕 Mode CRÉATION NOUVEL UTILISATEUR - Données:', apiData);
          
//           try {
//             response = await profilsUtilisateurAPI.create(apiData);
//             console.log('✅ Réponse create:', response);
//             showMessage('success', 'Utilisateur et profil créés avec succès');
//           } catch (createError: any) {
//             if (createError.response?.status === 400) {
//               console.log('⚠️ Tentative avec format alternatif...');
//               // Format alternatif
//               const altData = {
//                 user_username: apiData.username,
//                 user_email: apiData.email,
//                 password: apiData.password,
//                 departement: apiData.departement,
//                 telephone: apiData.telephone,
//                 role: apiData.role
//               };
//               response = await profilsUtilisateurAPI.create(altData);
//               console.log('✅ Réponse alternative:', response);
//               showMessage('success', 'Utilisateur et profil créés avec succès');
//             } else {
//               throw createError;
//             }
//           }
          
//         } else if (profilData.user_username) {
//           // Association à utilisateur existant
//           apiData = {
//             user_username: profilData.user_username.trim(),
//             departement: profilData.departement?.trim() || '',
//             telephone: profilData.telephone?.trim() || '',
//             role: profilData.role || 'user'
//           };
          
//           console.log('🔗 Mode ASSOCIATION - Données:', apiData);
          
//           response = await profilsUtilisateurAPI.create(apiData);
//           console.log('✅ Réponse create:', response);
//           showMessage('success', 'Profil créé pour l\'utilisateur existant');
          
//         } else {
//           // Mode par défaut
//           apiData = {
//             user_username: profilData.user?.username || '',
//             departement: profilData.departement?.trim() || '',
//             telephone: profilData.telephone?.trim() || '',
//             role: profilData.role || 'user'
//           };
          
//           console.log('🔧 Mode DÉFAUT - Données:', apiData);
          
//           response = await profilsUtilisateurAPI.create(apiData);
//           console.log('✅ Réponse create:', response);
//           showMessage('success', 'Profil utilisateur créé avec succès');
//         }
//       }
      
//       console.groupEnd();
      
//       // Recharger les données
//       await fetchProfils();
//       await fetchUsersWithoutProfile();
//       setIsFormOpen(false);
//       setEditingProfil(undefined);
      
//     } catch (error: any) {
//       console.error('❌ Erreur soumission:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message
//       });
      
//       if (error.response?.data) {
//         const errorData = error.response.data;
        
//         if (errorData.detail) {
//           showMessage('error', `Erreur: ${errorData.detail}`);
//         } else if (errorData.message) {
//           showMessage('error', `Erreur: ${errorData.message}`);
//         } else if (typeof errorData === 'object') {
//           const errors = Object.entries(errorData)
//             .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
//             .join('; ');
//           showMessage('error', `Erreurs: ${errors}`);
//         } else {
//           showMessage('error', 'Erreur lors de l\'opération');
//         }
//       } else if (error.message) {
//         showMessage('error', error.message);
//       } else {
//         showMessage('error', 'Erreur réseau ou serveur');
//       }
//     }
//   };

//   const toggleSelectProfil = (id: number) => {
//     setSelectedProfils(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isSelectAll) {
//       setSelectedProfils([]);
//     } else {
//       const allIds = filteredProfils.map(p => p.id);
//       setSelectedProfils(allIds);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedProfils.length === 0) {
//       showMessage('error', 'Aucun profil sélectionné');
//       return;
//     }

//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProfils.length} profil(s) ?`)) {
//       try {
//         const deletePromises = selectedProfils.map(id => 
//           profilsUtilisateurAPI.delete(id).catch(err => {
//             console.error(`❌ Erreur suppression profil ${id}:`, err);
//             return null;
//           })
//         );
        
//         await Promise.all(deletePromises);
        
//         showMessage('success', `${selectedProfils.length} profil(s) supprimé(s) avec succès`);
//         setSelectedProfils([]);
//         await fetchProfils();
//         await fetchUsersWithoutProfile();
//       } catch (error) {
//         console.error('❌ Erreur suppression multiple:', error);
//         showMessage('error', 'Erreur lors de la suppression des profils');
//       }
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedProfils.length === 0) {
//       showMessage('error', 'Aucun profil sélectionné');
//       return;
//     }

//     if (selectedProfils.length === 1) {
//       const profil = profils.find(p => p.id === selectedProfils[0]);
//       if (profil) {
//         handleEdit(profil);
//       }
//     } else {
//       showMessage('info', `Sélectionnez un seul profil pour modifier`);
//     }
//   };

//   const handleViewDetails = (profil: ProfilUtilisateur) => {
//     console.log('🔍 Voir détails profil:', profil);
//     setSelectedProfilDetails(profil);
//     setIsViewingDetails(true);
//   };

//   const handleEdit = (profil: ProfilUtilisateur) => {
//     console.log('✏️ Édition du profil:', profil);
//     setEditingProfil(profil);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
//       try {
//         await profilsUtilisateurAPI.delete(id);
//         showMessage('success', 'Profil supprimé avec succès');
//         await fetchProfils();
//         await fetchUsersWithoutProfile();
//       } catch (error: any) {
//         console.error('❌ Erreur suppression:', error);
//         const errorMsg = error.response?.data?.detail || error.message || 'Erreur lors de la suppression';
//         showMessage('error', errorMsg);
//       }
//     }
//   };

//   const handleAddNew = () => {
//     console.log('➕ Nouveau profil');
//     setEditingProfil(undefined);
//     setIsFormOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       if (filteredProfils.length === 0) {
//         showMessage('error', 'Aucune donnée à exporter');
//         return;
//       }

//       const dataToExport = filteredProfils.map(p => ({
//         'Username': getUsername(p),
//         'Email': getEmail(p),
//         'Service': getServiceFromDepartement(p.departement),
//         'Département': p.departement || 'Non spécifié',
//         'Rôle': getRoleText(p.role),
//         'Statut': getStatus(p) ? 'Actif' : 'Inactif',
//         'Téléphone': p.telephone || 'Non spécifié',
//         'Date inscription': formatDate(getDateInscription(p))
//       }));

//       const csvContent = [
//         Object.keys(dataToExport[0] || {}).join(','),
//         ...dataToExport.map(row => Object.values(row).map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `profils_utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showMessage('success', 'Export CSV réussi !');
//     } catch (error) {
//       console.error('❌ Erreur export:', error);
//       showMessage('error', 'Erreur lors de l\'export');
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterDepartement('');
//     setFilterRole('');
//     setSelectedProfils([]);
//     showMessage('info', 'Filtres réinitialisés');
//   };

//   const handleRetry = () => {
//     setError('');
//     fetchProfils();
//     fetchUsersWithoutProfile();
//   };

//   const getRoleBadge = (role: string) => {
//     const badges = {
//       admin: 'badge-error',
//       director: 'badge-warning',
//       technician: 'badge-primary',
//       secretary: 'badge-info',
//       user: 'badge-neutral'
//     };
//     return badges[role as keyof typeof badges] || 'badge-neutral';
//   };

//   const getRoleText = (role: string) => {
//     const texts = {
//       admin: 'Administrateur',
//       director: 'Directeur',
//       technician: 'Technicien',
//       secretary: 'Secrétaire',
//       user: 'Utilisateur'
//     };
//     return texts[role as keyof typeof texts] || role;
//   };

//   const getServiceFromDepartement = (departement: string | undefined): string => {
//     if (!departement) return 'Non attribué';
    
//     const mapping: Record<string, string> = {
//       'Informatique': 'Supp Tech',
//       'Ressources Humaines': 'Administration',
//       'Comptabilité': 'Finance',
//       'Direction': 'Management',
//       'Secrétariat': 'Supp Ad',
//       'Marketing': 'Commercial',
//       'Production': 'Opérations',
//       'Commercial': 'Ventes'
//     };
    
//     return mapping[departement] || departement;
//   };

//   const getServiceBadge = (departement: string | undefined) => {
//     const service = getServiceFromDepartement(departement);
    
//     const badges: Record<string, string> = {
//       'Supp Tech': 'badge-primary',
//       'Administration': 'badge-secondary',
//       'Finance': 'badge-accent',
//       'Management': 'badge-warning',
//       'Supp Ad': 'badge-info',
//       'Commercial': 'badge-success',
//       'Opérations': 'badge-error',
//       'Ventes': 'badge-neutral'
//     };
//     return badges[service] || 'badge-outline';
//   };

//   const getStatusBadge = (isActive: boolean) => {
//     return isActive ? 'badge-success' : 'badge-error';
//   };

//   const getStatusText = (isActive: boolean) => {
//     return isActive ? 'Actif' : 'Inactif';
//   };

//   const formatDate = (dateString: string | null | undefined): string => {
//     if (!dateString) return 'Non spécifiée';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const departements = [...new Set(safeArray(profils).map(p => p.departement).filter(Boolean))];
//   const roles = [...new Set(safeArray(profils).map(p => p.role).filter(Boolean))];

//   if (loading || usersLoading) {
//     return (
//       <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">
//             {loading ? 'Chargement des profils...' : 'Chargement des utilisateurs...'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       {message && (
//         <div className={`alert ${
//           message.type === 'success' ? 'alert-success' : 
//           message.type === 'error' ? 'alert-error' : 
//           'alert-info'
//         } mb-4 flex items-center justify-between`}>
//           <span>{message.text}</span>
//           <button className="btn btn-ghost btn-sm" onClick={() => setMessage(null)}>
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error mb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <AlertCircle className="h-5 w-5" />
//               <span>{error}</span>
//             </div>
//             <button 
//               className="btn btn-outline btn-sm"
//               onClick={handleRetry}
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Réessayer
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-base-content">👥 Gestion des Profils Utilisateurs</h1>
//           <p className="text-base-content opacity-60 mt-1">
//             {safeArray(filteredProfils).length} profil(s) trouvé(s)
//             {selectedProfils.length > 0 && (
//               <span className="text-primary font-semibold ml-2">
//                 ({selectedProfils.length} sélectionné(s))
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleExport}
//             className="btn btn-outline btn-sm"
//             title="Exporter la liste"
//             disabled={filteredProfils.length === 0}
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="btn btn-primary btn-sm"
//             title="Créer un nouveau profil"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Nouveau profil
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         <div className="card bg-base-200 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <User className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold">{statistiques.total}</h3>
//             <p className="text-sm opacity-60">Total</p>
//           </div>
//         </div>

//         <div className="card bg-success/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-success">{statistiques.actifs}</h3>
//             <p className="text-sm opacity-60">Actifs</p>
//           </div>
//         </div>

//         <div className="card bg-error/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Key className="h-6 w-6 text-error mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-error">{statistiques.administrateurs}</h3>
//             <p className="text-sm opacity-60">Administrateurs</p>
//           </div>
//         </div>

//         <div className="card bg-primary/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <Briefcase className="h-6 w-6 text-primary mx-auto mb-2" />
//             <h3 className="text-lg font-bold text-primary">{statistiques.techniciens}</h3>
//             <p className="text-sm opacity-60">Techniciens</p>
//           </div>
//         </div>

//         <div className="card bg-info/10 shadow-sm">
//           <div className="card-body p-4 text-center">
//             <User className="h-6 w-6 text-info mx-auto mb-2" />
//             <h3 className={`text-lg font-bold ${statistiques.utilisateursDisponibles > 0 ? 'text-info' : 'text-warning'}`}>
//               {statistiques.utilisateursDisponibles}
//             </h3>
//             <p className="text-sm opacity-60">Disponibles</p>
//           </div>
//         </div>
//       </div>

//       {usersWithoutProfile.length > 0 && (
//         <div className="alert alert-warning mb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <User className="h-5 w-5" />
//               <span>
//                 <strong>{usersWithoutProfile.length} utilisateur(s)</strong> sans profil
//               </span>
//             </div>
//             <button
//               onClick={handleAddNew}
//               className="btn btn-warning btn-sm"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Créer des profils
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🔍 Rechercher</span>
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-50" />
//                 <input
//                   type="text"
//                   placeholder="Username, email, téléphone, département..."
//                   className="input input-bordered w-full pl-10 bg-base-100"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">🏢 Département</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterDepartement}
//                 onChange={(e) => setFilterDepartement(e.target.value)}
//               >
//                 <option value="">Tous les départements</option>
//                 {departements.map((dept, index) => (
//                   <option key={index} value={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">👑 Rôle</span>
//               </label>
//               <select
//                 className="select select-bordered w-full bg-base-100"
//                 value={filterRole}
//                 onChange={(e) => setFilterRole(e.target.value)}
//               >
//                 <option value="">Tous les rôles</option>
//                 {roles.map((role, index) => (
//                   <option key={index} value={role}>
//                     {getRoleText(role)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">📊 Statistiques</span>
//               </label>
//               <div className="flex justify-between items-center">
//                 <div className="text-sm text-base-content opacity-70">
//                   {safeArray(filteredProfils).length} / {safeArray(profils).length} profils
//                 </div>
//                 <button
//                   onClick={resetFilters}
//                   className="btn btn-outline btn-sm"
//                 >
//                   <Filter className="h-4 w-4 mr-2" />
//                   Réinitialiser
//                 </button>
//               </div>
//             </div>
//           </div>

//           {selectedProfils.length > 0 && (
//             <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//                     <span className="font-semibold text-primary text-lg">
//                       {selectedProfils.length} profil(s) sélectionné(s)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleEditSelected}
//                     className="btn btn-primary btn-sm gap-2"
//                     disabled={selectedProfils.length !== 1}
//                     title={selectedProfils.length !== 1 ? "Sélectionnez un seul profil pour modifier" : ""}
//                   >
//                     <Edit className="h-4 w-4" />
//                     Modifier
//                   </button>
//                   <button
//                     onClick={handleDeleteSelected}
//                     className="btn btn-outline btn-error btn-sm gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer ({selectedProfils.length})
//                   </button>
//                   <button
//                     onClick={() => setSelectedProfils([])}
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

//       <div className="card bg-base-200 shadow-xl">
//         <div className="card-body p-0">
//           <div className="overflow-x-auto">
//             <table className="table w-full">
//               <thead>
//                 <tr className="bg-base-300">
//                   <th className="font-bold w-12 text-center">
//                     <div className="flex justify-center">
//                       <button
//                         onClick={toggleSelectAll}
//                         className="btn btn-ghost btn-xs p-1 hover:bg-base-200"
//                         title={isSelectAll ? "Désélectionner tous" : "Sélectionner tous"}
//                         disabled={filteredProfils.length === 0}
//                       >
//                         {isSelectAll ? (
//                           <CheckSquare className="h-5 w-5 text-primary" />
//                         ) : (
//                           <Square className="h-5 w-5 text-base-content/40" />
//                         )}
//                       </button>
//                     </div>
//                   </th>
//                   <th className="font-bold px-4 py-3">Utilisateur (username)</th>
//                   <th className="font-bold px-4 py-3">Email</th>
//                   <th className="font-bold px-4 py-3">Service</th>
//                   <th className="font-bold px-4 py-3">Département</th>
//                   <th className="font-bold px-4 py-3">Rôle</th>
//                   <th className="font-bold px-4 py-3">Statut</th>
//                   <th className="font-bold px-4 py-3">Téléphone</th>
//                   <th className="font-bold px-4 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeArray(filteredProfils).length > 0 ? (
//                   safeArray(filteredProfils).map((profil) => (
//                     <tr key={profil.id} className="hover:bg-base-100 border-b border-base-300">
//                       <td className="text-center py-3">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="checkbox checkbox-primary checkbox-sm"
//                             checked={selectedProfils.includes(profil.id)}
//                             onChange={() => toggleSelectProfil(profil.id)}
//                           />
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="avatar placeholder">
//                             <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
//                               <span className="text-xs">{getInitials(profil)}</span>
//                             </div>
//                           </div>
//                           <div>
//                             <div className="font-semibold">
//                               @{getUsername(profil)}
//                             </div>
//                             <div className="text-xs text-base-content opacity-60">
//                               {getFullName(profil)}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2 text-sm">
//                           <Mail className="h-3 w-3 opacity-70" />
//                           <span className="truncate max-w-[180px]" title={getEmail(profil)}>
//                             {getEmail(profil)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className={`badge ${getServiceBadge(profil.departement)}`}>
//                           {getServiceFromDepartement(profil.departement)}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <Building className="h-4 w-4 text-base-content opacity-50" />
//                           <span>{profil.departement || '-'}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className={`badge ${getRoleBadge(profil.role)}`}>
//                           {getRoleText(profil.role)}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className={`badge ${getStatusBadge(getStatus(profil))}`}>
//                           {getStatusText(getStatus(profil))}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         {profil.telephone ? (
//                           <div className="flex items-center gap-2 text-sm">
//                             <Phone className="h-3 w-3 opacity-70" />
//                             <span>{profil.telephone}</span>
//                           </div>
//                         ) : '-'}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex justify-center space-x-2">
//                           <button
//                             onClick={() => handleViewDetails(profil)}
//                             className="btn btn-ghost btn-xs btn-square text-info hover:bg-info/10"
//                             title="Voir les détails"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleEdit(profil)}
//                             className="btn btn-ghost btn-xs btn-square text-primary hover:bg-primary/10"
//                             title="Modifier"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(profil.id)}
//                             className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={9} className="text-center py-12">
//                       <div className="text-base-content opacity-40">
//                         <User className="h-16 w-16 mx-auto mb-4" />
//                         <p className="text-lg font-medium">Aucun profil utilisateur trouvé</p>
//                         <p className="text-sm mt-2">
//                           {searchTerm || filterDepartement || filterRole 
//                             ? "Essayez de modifier vos critères de recherche" 
//                             : "Aucun profil utilisateur n'est enregistré"
//                           }
//                         </p>
//                         {profils.length === 0 && (
//                           <div className="mt-4">
//                             <button
//                               onClick={handleAddNew}
//                               className="btn btn-primary btn-sm"
//                             >
//                               <Plus className="h-4 w-4 mr-2" />
//                               Créer un premier profil
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal de détails des profils avec date d'inscription utilisateur */}
//       {isViewingDetails && selectedProfilDetails && (
//         <div className="modal modal-open modal-bottom sm:modal-middle">
//           <div className="modal-box bg-base-200 max-w-4xl">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="font-bold text-2xl text-base-content">👤 Détails du profil utilisateur</h3>
//               <button 
//                 onClick={() => setIsViewingDetails(false)} 
//                 className="btn btn-sm btn-circle btn-ghost"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Colonne gauche: Informations personnelles */}
//               <div className="space-y-6">
//                 <div className="flex items-center space-x-4 p-4 bg-base-100 rounded-lg">
//                   <div className="avatar placeholder">
//                     <div className="bg-primary text-primary-content rounded-full w-16 h-16">
//                       <span className="text-2xl">
//                         {getInitials(selectedProfilDetails)}
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold">{getFullName(selectedProfilDetails)}</h2>
//                     <p className="text-base-content opacity-60">@{getUsername(selectedProfilDetails)}</p>
//                     <p className="text-sm text-primary mt-1">{getEmail(selectedProfilDetails)}</p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-4 p-4 bg-base-100 rounded-lg">
//                   <h4 className="font-semibold text-lg flex items-center gap-2">
//                     <Mail className="h-5 w-5" /> Informations de contact
//                   </h4>
                  
//                   <div className="space-y-3">
//                     <div>
//                       <label className="label-text text-sm opacity-60">📧 Email</label>
//                       <p className="font-medium text-lg">{getEmail(selectedProfilDetails)}</p>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">📞 Téléphone</label>
//                       <p className="font-medium text-lg">{selectedProfilDetails.telephone || 'Non spécifié'}</p>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">🏢 Département</label>
//                       <p className="font-medium text-lg">{selectedProfilDetails.departement || 'Non spécifié'}</p>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">🏭 Service</label>
//                       <div className={`badge ${getServiceBadge(selectedProfilDetails.departement)} p-3 mt-1`}>
//                         <span className="text-lg">{getServiceFromDepartement(selectedProfilDetails.departement)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Colonne droite: Informations système avec date d'inscription */}
//               <div className="space-y-6">
//                 <div className="p-4 bg-base-100 rounded-lg">
//                   <h4 className="font-semibold text-lg flex items-center gap-2 mb-4">
//                     <Key className="h-5 w-5" /> Informations système
//                   </h4>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="label-text text-sm opacity-60">👑 Rôle</label>
//                       <div className={`badge ${getRoleBadge(selectedProfilDetails.role)} gap-2 p-3 mt-1`}>
//                         <span className="text-lg">{getRoleText(selectedProfilDetails.role)}</span>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">🔓 Statut</label>
//                       <div className={`badge ${getStatusBadge(getStatus(selectedProfilDetails))} p-3 mt-1`}>
//                         <span className="text-lg">{getStatusText(getStatus(selectedProfilDetails))}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="p-4 bg-base-100 rounded-lg">
//                   {/* <h4 className="font-semibold text-lg flex items-center gap-2 mb-4">
//                     <Calendar className="h-5 w-5" /> Dates importantes
//                   </h4> */}
                  
//                   <div className="space-y-3">
//                     <div>
//                       {/* <label className="label-text text-sm opacity-60">📅 Date d'inscription utilisateur</label> */}
//                       {/* <div className="flex items-center gap-2 mt-1">
//                         <Calendar className="h-4 w-4 text-primary" />
//                         <div>
//                           <p className="font-medium text-lg">
//                             {formatDate(getDateInscription(selectedProfilDetails))}
//                           </p>
//                           <p className="text-xs opacity-60 mt-1">
//                             (depuis l'enregistrement initial)
//                           </p>
//                         </div>
//                       </div> */}
//                     </div>
                    
//                     {/* Optionnel: Afficher la date de création du profil si différente */}
//                     {selectedProfilDetails.created_at && (
//                       <div>
//                         <label className="label-text text-sm opacity-60">📋 Date création profil</label>
//                         <p className="text-sm opacity-70">
//                           {formatDate(selectedProfilDetails.created_at)}
//                         </p>
//                       </div>
//                     )}
                    
//                     <div>
//                       <label className="label-text text-sm opacity-60">👤 Nom complet</label>
//                       <div className="flex items-center gap-2 mt-1">
//                         <User className="h-4 w-4 text-primary" />
//                         <p className="font-medium text-lg">{getFullName(selectedProfilDetails)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="modal-action mt-6">
//               <button onClick={() => setIsViewingDetails(false)} className="btn btn-primary">
//                 Fermer
//               </button>
//               <button 
//                 onClick={() => {
//                   setIsViewingDetails(false);
//                   handleEdit(selectedProfilDetails);
//                 }}
//                 className="btn btn-outline btn-primary"
//               >
//                 <Edit className="h-4 w-4 mr-2" />
//                 Modifier ce profil
//               </button>
//             </div>
//           </div>
          
//           {/* Overlay pour fermer le modal en cliquant à côté */}
//           <div 
//             className="modal-backdrop" 
//             onClick={() => setIsViewingDetails(false)}
//           />
//         </div>
//       )}

//       <ProfilUtilisateurForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingProfil(undefined);
//         }}
//         onSubmit={handleSubmit}
//         profil={editingProfil}
//         usersWithoutProfile={usersWithoutProfile}
//       />
//     </div>
//   );
// };

// export default ProfilsUtilisateurs;





import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Eye, Filter, Download, Edit, Trash2, CheckSquare, Square, X, 
  User, Mail, Phone, Building, Briefcase, Calendar, CheckCircle, Key, 
  Users, AlertCircle, RefreshCw, ArrowLeft, BarChart3, Shield, Clock
} from 'lucide-react';
import { ProfilUtilisateur, User as UserType } from '../types';
import { profilsUtilisateurAPI, usersAPI } from '../services/api';
import ProfilUtilisateurForm from '../components/ProfilUtilisateurForm';

// ==================== AUTO-LOGGER ====================
// Ajout du système de logging automatique
import { useAuth } from '../context/AuthContext';

// Hook pour l'Auto-Logger
const useAutoLogger = () => {
  const { user } = useAuth();
  
  const getUsername = () => {
    if (user?.username) return user.username;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        return parsed.username || 'System';
      } catch {
        return 'System';
      }
    }
    
    return 'System';
  };
  
  const logAction = (action, module, details, extraData = {}) => {
    if (!window.ActionLogger) {
      console.log(`📝 [AUTO-LOGGER] ${action} - ${module} - ${details}`);
      return;
    }
    
    const username = getUsername();
    
    window.ActionLogger.custom(action, module, details, username, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...extraData
    });
    
    console.log(`📝 [AUTO-LOGGER] ${action} - ${module} - ${details}`);
  };
  
  const logCRUD = (operation, module, itemName, itemData = {}) => {
    const actionsMap = {
      'create': 'AJOUT',
      'read': 'CONSULTATION',
      'update': 'MODIFICATION',
      'delete': 'SUPPRESSION',
      'export': 'EXPORTATION',
      'import': 'IMPORTATION'
    };
    
    const action = actionsMap[operation] || operation.toUpperCase();
    const details = `${operation === 'create' ? 'Ajout' : 
                     operation === 'read' ? 'Consultation' :
                     operation === 'update' ? 'Modification' :
                     operation === 'delete' ? 'Suppression' :
                     operation === 'export' ? 'Export' :
                     operation === 'import' ? 'Import' : operation} ${module.toLowerCase()}: ${itemName}`;
    
    logAction(action, module, details, {
      type: operation,
      itemType: module.toLowerCase(),
      itemName: itemName,
      ...itemData
    });
  };
  
  const logSearch = (module, searchTerm, resultsCount) => {
    logAction('RECHERCHE', module, `Recherche "${searchTerm}" (${resultsCount} résultats)`, {
      searchTerm: searchTerm,
      resultsCount: resultsCount,
      type: 'search'
    });
  };
  
  const logFilter = (module, filterType, resultsCount) => {
    logAction('FILTRAGE', module, `Filtre ${filterType} (${resultsCount} résultats)`, {
      filterType: filterType,
      resultsCount: resultsCount,
      type: 'filter'
    });
  };
  
  const logExport = (module, format, dataCount, filters = {}) => {
    logAction('EXPORTATION', 'Rapports', `Export ${module} en ${format} (${dataCount} éléments)`, {
      module: module,
      format: format,
      count: dataCount,
      filters: filters,
      type: 'export'
    });
  };
  
  return {
    logAction,
    logCRUD,
    logSearch,
    logFilter,
    logExport,
    
    // Fonctions spécifiques pour les profils utilisateurs
    logProfilCreate: (profilData) => 
      logCRUD('create', 'Profils Utilisateurs', profilData.username || profilData.user_username || 'Nouveau profil', { data: profilData }),
    
    logProfilUpdate: (id, oldData, newData) => 
      logCRUD('update', 'Profils Utilisateurs', getUsernameFromProfil(newData) || getUsernameFromProfil(oldData) || id.toString(), {
        id: id,
        oldData: oldData,
        newData: newData,
        changes: getChanges(oldData, newData)
      }),
    
    logProfilDelete: (id, profilData) =>
      logCRUD('delete', 'Profils Utilisateurs', getUsernameFromProfil(profilData) || id.toString(), { id: id, data: profilData }),
    
    logProfilExport: (format, count, filters) =>
      logExport('Profils Utilisateurs', format, count, filters),
    
    logProfilView: (profil) =>
      logCRUD('read', 'Profils Utilisateurs', getUsernameFromProfil(profil) || 'Profil', { id: profil.id, data: profil }),
    
    logProfilSearch: (term, count) =>
      logSearch('Profils Utilisateurs', term, count),
    
    logProfilFilter: (filterType, count) =>
      logFilter('Profils Utilisateurs', filterType, count)
  };
};

// Fonction utilitaire pour extraire le username d'un profil
const getUsernameFromProfil = (profil) => {
  if (!profil) return '';
  
  if (profil.user && typeof profil.user === 'object') {
    return profil.user.username || profil.user.user_username || '';
  }
  
  if (typeof profil.user === 'string') {
    return profil.user;
  }
  
  if (profil.user_username) {
    return profil.user_username;
  }
  
  if (profil.username) {
    return profil.username;
  }
  
  return '';
};

// Fonction utilitaire pour détecter les changements
const getChanges = (oldData, newData) => {
  const changes = {};
  
  if (!oldData || !newData) return changes;
  
  // Fonction pour normaliser les valeurs
  const getValue = (obj, key) => {
    if (typeof obj === 'object' && obj !== null) {
      return obj[key];
    }
    return undefined;
  };
  
  // Comparer les propriétés de base
  const baseProps = ['departement', 'telephone', 'role', 'username', 'email'];
  
  baseProps.forEach(key => {
    const oldVal = getValue(oldData, key);
    const newVal = getValue(newData, key);
    
    if (oldVal !== newVal) {
      changes[key] = {
        old: oldVal,
        new: newVal
      };
    }
  });
  
  return changes;
};
// ==================== FIN AUTO-LOGGER ====================

// Fonctions helper pour la sécurité des tableaux
const safeArray = (data: any): ProfilUtilisateur[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [];
};

const safeFilter = (array: any[], condition: (item: any) => boolean): ProfilUtilisateur[] => {
  if (!Array.isArray(array)) return [];
  return array.filter(condition);
};

const extractDataFromResponse = (response: any): any[] => {
  console.log('🔍 Extraction données de réponse:', response);
  
  if (!response) {
    console.log('❌ Réponse vide');
    return [];
  }
  
  // Si response est déjà un tableau
  if (Array.isArray(response)) {
    return response;
  }
  
  // Si response.data existe
  if (response.data) {
    // Si data est un tableau
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Si data a une propriété results (pagination)
    if (response.data.results && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    
    // Si data a une propriété data
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Si data est un objet unique
    if (typeof response.data === 'object' && !Array.isArray(response.data)) {
      return [response.data];
    }
  }
  
  console.warn('⚠️ Format de réponse non reconnu:', response);
  return [];
};

// Fonctions helper pour extraire les données utilisateur
const getUsername = (profil: ProfilUtilisateur): string => {
  if (!profil) return 'Non spécifié';
  
  if (profil.user && typeof profil.user === 'object') {
    return profil.user.username || profil.user.user_username || '';
  } 
  else if (typeof profil.user === 'string') {
    return profil.user;
  }
  else if (profil.user_username) {
    return profil.user_username;
  }
  else if (profil.username) {
    return profil.username;
  }
  
  return 'Non spécifié';
};

const getEmail = (profil: ProfilUtilisateur): string => {
  if (!profil) return '-';
  
  if (profil.user && typeof profil.user === 'object') {
    return profil.user.email || profil.user.user_email || '-';
  }
  else if (profil.user_email) {
    return profil.user_email;
  }
  else if (profil.email) {
    return profil.email;
  }
  
  return '-';
};

const getFullName = (profil: ProfilUtilisateur): string => {
  if (!profil) return '-';
  
  if (profil.user && typeof profil.user === 'object') {
    const firstName = profil.user.first_name || '';
    const lastName = profil.user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || '-';
  }
  else if (profil.first_name || profil.last_name) {
    const firstName = profil.first_name || '';
    const lastName = profil.last_name || '';
    return `${firstName} ${lastName}`.trim();
  }
  
  return '-';
};

const getInitials = (profil: ProfilUtilisateur): string => {
  const username = getUsername(profil);
  return username?.[0]?.toUpperCase() || 'U';
};

const getStatus = (profil: ProfilUtilisateur): boolean => {
  if (profil.user && typeof profil.user === 'object') {
    return profil.user.is_active !== false;
  }
  return true;
};

// Fonction pour obtenir la date d'inscription de l'utilisateur (depuis son registre)
const getDateInscription = (profil: ProfilUtilisateur): string | null => {
  if (!profil) return null;
  
  // Chercher la date d'inscription dans l'objet user
  if (profil.user && typeof profil.user === 'object') {
    return profil.user.date_inscription || 
           profil.user.date_joined || 
           profil.user.created_at || 
           profil.user_created_at || 
           null;
  }
  
  // Si pas d'objet user, chercher directement dans le profil
  return profil.user_date_inscription || 
         profil.user_date_joined || 
         profil.user_created_at || 
         null;
};

// Système de notification simple
const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
  // Créer l'élément de notification
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slideInRight ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    type === 'warning' ? 'bg-yellow-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  
  // Ajouter le style d'animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slideInRight {
      animation: slideInRight 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
  
  // Icône selon le type
  const icon = type === 'success' ? '✅' : 
               type === 'error' ? '❌' : 
               type === 'warning' ? '⚠️' : 'ℹ️';
  
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="text-xl">${icon}</div>
      <div class="flex-1">
        ${title ? `<div class="font-bold mb-1">${title}</div>` : ''}
        <div class="text-sm">${message}</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="btn btn-ghost btn-xs p-1 hover:bg-white/20">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-suppression après 5 secondes
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentElement) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
};

const ProfilsUtilisateurs: React.FC = () => {
  // ==================== INITIALISATION AUTO-LOGGER ====================
  const autoLogger = useAutoLogger();
  
  const [profils, setProfils] = useState<ProfilUtilisateur[]>([]);
  const [usersWithoutProfile, setUsersWithoutProfile] = useState<UserType[]>([]);
  const [filteredProfils, setFilteredProfils] = useState<ProfilUtilisateur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartement, setFilterDepartement] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfil, setEditingProfil] = useState<ProfilUtilisateur | undefined>();
  const [selectedProfils, setSelectedProfils] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [selectedProfilDetails, setSelectedProfilDetails] = useState<ProfilUtilisateur | null>(null);

  // États pour la confirmation de suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profilToDelete, setProfilToDelete] = useState<number | null>(null);
  const [deleteMultiple, setDeleteMultiple] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  // Statistiques
  const [statistiques, setStatistiques] = useState({
    total: 0,
    actifs: 0,
    administrateurs: 0,
    techniciens: 0,
    parDepartement: {} as Record<string, number>,
    parRole: {} as Record<string, number>,
    utilisateursDisponibles: 0
  });

  useEffect(() => {
    fetchProfils();
    fetchUsersWithoutProfile();
    
    // Afficher une notification de bienvenue
    setTimeout(() => {
      showNotification('info', 'Chargement des profils utilisateurs...', 'Bienvenue');
    }, 500);
  }, []);

  useEffect(() => {
    filterProfils();
  }, [profils, searchTerm, filterDepartement, filterRole]);

  useEffect(() => {
    if (filteredProfils.length > 0 && selectedProfils.length === filteredProfils.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedProfils, filteredProfils]);

  const fetchProfils = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Début chargement profils...');
      
      const response = await profilsUtilisateurAPI.getAll();
      console.log('📦 Réponse API profils:', response);
      
      const extractedData = extractDataFromResponse(response);
      console.log('📊 Données extraites:', extractedData);
      
      if (extractedData.length === 0) {
        console.log('ℹ️ Aucun profil trouvé dans la réponse');
        setProfils([]);
        setFilteredProfils([]);
        calculerStatistiques([]);
        return;
      }
      
      // Normaliser les données pour avoir une structure cohérente
      const normalizedData = extractedData.map((profil: any, index: number) => {
        console.log(`🔍 Profil ${index}:`, profil);
        
        // Structure de base
        const normalized: any = {
          id: profil.id || index + 1,
          departement: profil.departement || '',
          telephone: profil.telephone || '',
          role: profil.role || 'user',
          created_at: profil.created_at || null
        };
        
        // Gestion de l'utilisateur
        if (profil.user) {
          if (typeof profil.user === 'number') {
            normalized.user = {
              id: profil.user,
              username: profil.user_username || `user_${profil.user}`,
              email: profil.user_email || '',
              first_name: profil.user_first_name || '',
              last_name: profil.user_last_name || '',
              is_active: true,
              date_inscription: profil.user_date_inscription || profil.user_date_joined || null
            };
          } else if (typeof profil.user === 'object') {
            normalized.user = {
              id: profil.user.id || profil.user_id || profil.id,
              username: profil.user.username || profil.user_username || '',
              email: profil.user.email || profil.user_email || '',
              first_name: profil.user.first_name || '',
              last_name: profil.user.last_name || '',
              is_active: profil.user.is_active !== false,
              date_inscription: profil.user.date_inscription || 
                              profil.user.date_joined || 
                              profil.user.created_at || 
                              profil.user_created_at || 
                              null
            };
          }
        } else {
          normalized.user = {
            id: profil.user_id || profil.id,
            username: profil.user_username || profil.username || '',
            email: profil.user_email || profil.email || '',
            first_name: profil.first_name || '',
            last_name: profil.last_name || '',
            is_active: true,
            date_inscription: profil.user_date_inscription || profil.user_date_joined || null
          };
        }
        
        return normalized;
      });
      
      console.log('👤 Profils normalisés:', normalizedData);
      setProfils(normalizedData);
      calculerStatistiques(normalizedData);
      
      // 🔥 AUTO-LOGGER: Chargement des profils
      autoLogger.logAction('CHARGEMENT', 'Profils Utilisateurs', `Chargement de ${normalizedData.length} profils`, {
        count: normalizedData.length,
        type: 'load'
      });
      
      showNotification('success', `${normalizedData.length} profil(s) chargé(s) avec succès`, 'Chargement réussi');
      
    } catch (err: any) {
      console.error('❌ Erreur détaillée chargement profils:', err);
      
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.message 
        || err.message 
        || 'Erreur lors du chargement des profils utilisateurs';
      
      setError(errorMessage);
      showNotification('error', errorMessage, 'Erreur');
      
      // Données de test pour le développement
      const testData = [
        {
          id: 1,
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            first_name: 'Admin',
            last_name: 'System',
            is_active: true,
            date_inscription: '2024-01-01T10:30:00Z'
          },
          departement: 'Informatique',
          telephone: '0123456789',
          role: 'admin',
          created_at: '2024-01-02T09:15:00Z'
        },
        {
          id: 2,
          user: {
            id: 2,
            username: 'technicien',
            email: 'tech@example.com',
            first_name: 'Technicien',
            last_name: 'Support',
            is_active: true,
            date_inscription: '2024-02-15T14:45:00Z'
          },
          departement: 'Support Technique',
          telephone: '0987654321',
          role: 'technician',
          created_at: '2024-02-16T10:20:00Z'
        }
      ];
      
      setProfils(testData);
      calculerStatistiques(testData);
      
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersWithoutProfile = async () => {
    try {
      setUsersLoading(true);
      console.log('🔄 Chargement des utilisateurs sans profil...');
      
      try {
        const response = await usersAPI.getAll();
        console.log('📋 Réponse API utilisateurs:', response);
        
        const allUsers = extractDataFromResponse(response);
        console.log('👥 Utilisateurs récupérés:', allUsers.length);
        
        if (allUsers.length === 0) {
          console.log('ℹ️ Aucun utilisateur trouvé');
          setUsersWithoutProfile([]);
          return;
        }
        
        const existingUserIds = new Set<number>();
        
        profils.forEach((profil) => {
          if (profil.user && typeof profil.user === 'object' && profil.user.id) {
            existingUserIds.add(profil.user.id);
          }
        });
        
        console.log('✅ IDs avec profil:', Array.from(existingUserIds));
        
        const usersWithout = allUsers.filter((user: any) => 
          !existingUserIds.has(user.id)
        );
        
        console.log('✅ Utilisateurs sans profil:', usersWithout.length);
        
        const formattedUsers = usersWithout.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email || `${user.username}@example.com`,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
          is_active: user.is_active !== false,
          date_inscription: user.date_inscription || user.date_joined || user.created_at || null
        }));
        
        setUsersWithoutProfile(formattedUsers);
        
        setStatistiques(prev => ({
          ...prev,
          utilisateursDisponibles: formattedUsers.length
        }));
        
      } catch (endpointError: any) {
        console.error('❌ Erreur chargement utilisateurs:', endpointError);
        
        const fallbackUsers = [
          {
            id: Date.now(),
            username: `test${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            first_name: 'Test',
            last_name: 'User',
            is_active: true,
            date_inscription: new Date().toISOString()
          }
        ];
        setUsersWithoutProfile(fallbackUsers);
        setStatistiques(prev => ({
          ...prev,
          utilisateursDisponibles: fallbackUsers.length
        }));
        
        showNotification('warning', 'Mode test activé pour les utilisateurs - Vérifiez votre API', 'Avertissement');
      }
    } catch (error: any) {
      console.error('❌ Erreur générale chargement utilisateurs:', error);
      showNotification('error', 'Erreur lors du chargement des utilisateurs', 'Erreur');
    } finally {
      setUsersLoading(false);
    }
  };

  const calculerStatistiques = (data: ProfilUtilisateur[]) => {
    if (!data || data.length === 0) {
      setStatistiques({
        total: 0,
        actifs: 0,
        administrateurs: 0,
        techniciens: 0,
        parDepartement: {},
        parRole: {},
        utilisateursDisponibles: statistiques.utilisateursDisponibles
      });
      return;
    }

    const parDepartement = data.reduce((acc, profil) => {
      const dept = profil.departement || 'Non spécifié';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parRole = data.reduce((acc, profil) => {
      const role = profil.role || 'user';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const administrateurs = data.filter(p => p.role === 'admin').length;
    const techniciens = data.filter(p => p.role === 'technician').length;

    setStatistiques(prev => ({
      ...prev,
      total: data.length,
      actifs: data.filter(p => getStatus(p)).length,
      administrateurs,
      techniciens,
      parDepartement,
      parRole
    }));
  };

  const filterProfils = () => {
    let filtered = safeArray(profils);

    if (searchTerm) {
      filtered = safeFilter(filtered, profil => {
        const userName = getUsername(profil).toLowerCase();
        const userFullName = getFullName(profil).toLowerCase();
        const userEmail = getEmail(profil).toLowerCase();
        const departement = (profil.departement || '').toLowerCase();
        const telephone = (profil.telephone || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return (
          userName.includes(search) ||
          userFullName.includes(search) ||
          userEmail.includes(search) ||
          departement.includes(search) ||
          telephone.includes(search)
        );
      });
    }

    if (filterDepartement) {
      filtered = safeFilter(filtered, profil => 
        (profil.departement || '').toLowerCase().includes(filterDepartement.toLowerCase())
      );
    }

    if (filterRole) {
      filtered = safeFilter(filtered, profil => profil.role === filterRole);
    }

    console.log('🔍 Profils filtrés:', filtered.length);
    setFilteredProfils(filtered);
    setSelectedProfils([]);
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (profilData: any) => {
    try {
      console.group('🔧 Soumission du profil');
      console.log('📥 Données du formulaire:', profilData);
      
      let apiData: any;
      let response: any;
      
      if (editingProfil) {
        // MODE ÉDITION
        apiData = {
          departement: profilData.departement?.trim() || '',
          telephone: profilData.telephone?.trim() || '',
          role: profilData.role || 'user'
        };
        
        console.log('🔄 Mode ÉDITION - Données:', apiData);
        console.log('📝 ID du profil à éditer:', editingProfil.id);
        
        try {
          response = await profilsUtilisateurAPI.update(editingProfil.id, apiData);
          console.log('✅ Réponse update:', response);
          
          // 🔥 AUTO-LOGGER: Modification de profil
          autoLogger.logProfilUpdate(editingProfil.id, editingProfil, profilData);
          
          showNotification('success', 'Profil utilisateur modifié avec succès', 'Modification réussie');
        } catch (updateError: any) {
          console.error('❌ Erreur update:', updateError);
          throw updateError;
        }
        
      } else {
        // MODE CRÉATION
        if (profilData.username && profilData.email && profilData.password) {
          apiData = {
            username: profilData.username.trim(),
            email: profilData.email.trim(),
            password: profilData.password,
            password_confirm: profilData.password_confirm,
            name: profilData.name?.trim() || '',
            departement: profilData.departement?.trim() || '',
            telephone: profilData.telephone?.trim() || '',
            role: profilData.role || 'user'
          };
          
          console.log('🆕 Mode CRÉATION NOUVEL UTILISATEUR - Données:', apiData);
          
          try {
            response = await profilsUtilisateurAPI.create(apiData);
            console.log('✅ Réponse create:', response);
            
            // 🔥 AUTO-LOGGER: Création de profil
            autoLogger.logProfilCreate(apiData);
            
            showNotification('success', 'Utilisateur et profil créés avec succès', 'Création réussie');
          } catch (createError: any) {
            if (createError.response?.status === 400) {
              console.log('⚠️ Tentative avec format alternatif...');
              const altData = {
                user_username: apiData.username,
                user_email: apiData.email,
                password: apiData.password,
                departement: apiData.departement,
                telephone: apiData.telephone,
                role: apiData.role
              };
              response = await profilsUtilisateurAPI.create(altData);
              console.log('✅ Réponse alternative:', response);
              
              // 🔥 AUTO-LOGGER: Création de profil (format alternatif)
              autoLogger.logProfilCreate(altData);
              
              showNotification('success', 'Utilisateur et profil créés avec succès', 'Création réussie');
            } else {
              throw createError;
            }
          }
          
        } else if (profilData.user_username) {
          apiData = {
            user_username: profilData.user_username.trim(),
            departement: profilData.departement?.trim() || '',
            telephone: profilData.telephone?.trim() || '',
            role: profilData.role || 'user'
          };
          
          console.log('🔗 Mode ASSOCIATION - Données:', apiData);
          
          response = await profilsUtilisateurAPI.create(apiData);
          console.log('✅ Réponse create:', response);
          
          // 🔥 AUTO-LOGGER: Création de profil pour utilisateur existant
          autoLogger.logProfilCreate(apiData);
          
          showNotification('success', 'Profil créé pour l\'utilisateur existant', 'Création réussie');
          
        } else {
          apiData = {
            user_username: profilData.user?.username || '',
            departement: profilData.departement?.trim() || '',
            telephone: profilData.telephone?.trim() || '',
            role: profilData.role || 'user'
          };
          
          console.log('🔧 Mode DÉFAUT - Données:', apiData);
          
          response = await profilsUtilisateurAPI.create(apiData);
          console.log('✅ Réponse create:', response);
          
          // 🔥 AUTO-LOGGER: Création de profil
          autoLogger.logProfilCreate(apiData);
          
          showNotification('success', 'Profil utilisateur créé avec succès', 'Création réussie');
        }
      }
      
      console.groupEnd();
      
      await fetchProfils();
      await fetchUsersWithoutProfile();
      setIsFormOpen(false);
      setEditingProfil(undefined);
      
    } catch (error: any) {
      console.error('❌ Erreur soumission:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.detail) {
          showNotification('error', `Erreur: ${errorData.detail}`, 'Erreur');
        } else if (errorData.message) {
          showNotification('error', `Erreur: ${errorData.message}`, 'Erreur');
        } else if (typeof errorData === 'object') {
          const errors = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          showNotification('error', `Erreurs: ${errors}`, 'Erreur');
        } else {
          showNotification('error', 'Erreur lors de l\'opération', 'Erreur');
        }
      } else if (error.message) {
        showNotification('error', error.message, 'Erreur');
      } else {
        showNotification('error', 'Erreur réseau ou serveur', 'Erreur');
      }
    }
  };

  const toggleSelectProfil = (id: number) => {
    setSelectedProfils(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedProfils([]);
      showNotification('info', 'Sélection annulée', 'Information');
    } else {
      const allIds = filteredProfils.map(p => p.id);
      setSelectedProfils(allIds);
      showNotification('success', `${allIds.length} profils sélectionnés`, 'Sélection');
    }
  };

  const handleDeleteSelected = () => {
    if (selectedProfils.length === 0) {
      showNotification('error', 'Aucun profil sélectionné', 'Erreur');
      return;
    }

    setDeleteMultiple(true);
    setDeleteMessage(`Êtes-vous sûr de vouloir supprimer ${selectedProfils.length} profil(s) ? Cette action est irréversible.`);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteMultiple) {
        const deletePromises = selectedProfils.map(id => 
          profilsUtilisateurAPI.delete(id).catch(err => {
            console.error(`❌ Erreur suppression profil ${id}:`, err);
            return null;
          })
        );
        
        await Promise.all(deletePromises);
        
        showNotification('success', `${selectedProfils.length} profil(s) supprimé(s) avec succès`, 'Suppression réussie');
        
        // 🔥 AUTO-LOGGER: Suppression multiple
        selectedProfils.forEach(id => {
          const profil = profils.find(p => p.id === id);
          if (profil) {
            autoLogger.logProfilDelete(id, profil);
          }
        });
        
        setSelectedProfils([]);
        
      } else if (profilToDelete) {
        const profil = profils.find(p => p.id === profilToDelete);
        await profilsUtilisateurAPI.delete(profilToDelete);
        showNotification('success', 'Profil supprimé avec succès', 'Suppression réussie');
        
        // 🔥 AUTO-LOGGER: Suppression unique
        if (profil) {
          autoLogger.logProfilDelete(profilToDelete, profil);
        }
      }
      
      await fetchProfils();
      await fetchUsersWithoutProfile();
    } catch (error) {
      showNotification('error', 'Erreur lors de la suppression', 'Erreur');
    } finally {
      setShowDeleteConfirm(false);
      setProfilToDelete(null);
      setDeleteMultiple(false);
      setDeleteMessage('');
    }
  };

  const handleEditSelected = () => {
    if (selectedProfils.length === 0) {
      showNotification('error', 'Aucun profil sélectionné', 'Erreur');
      return;
    }

    if (selectedProfils.length === 1) {
      const profil = profils.find(p => p.id === selectedProfils[0]);
      if (profil) {
        handleEdit(profil);
      }
    } else {
      showNotification('info', `Sélectionnez un seul profil pour modifier`, 'Information');
    }
  };

  const handleViewDetails = (profil: ProfilUtilisateur) => {
    console.log('🔍 Voir détails profil:', profil);
    setSelectedProfilDetails(profil);
    setIsViewingDetails(true);
    
    // 🔥 AUTO-LOGGER: Consultation de profil
    autoLogger.logProfilView(profil);
  };

  const handleEdit = (profil: ProfilUtilisateur) => {
    console.log('✏️ Édition du profil:', profil);
    setEditingProfil(profil);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    const profil = profils.find(p => p.id === id);
    setProfilToDelete(id);
    setDeleteMultiple(false);
    setDeleteMessage(`Êtes-vous sûr de vouloir supprimer le profil de "${getUsername(profil || {})}" ? Cette action est irréversible.`);
    setShowDeleteConfirm(true);
  };

  const handleAddNew = () => {
    console.log('➕ Nouveau profil');
    setEditingProfil(undefined);
    setIsFormOpen(true);
  };

  const handleExport = () => {
    try {
      if (filteredProfils.length === 0) {
        showNotification('error', 'Aucune donnée à exporter', 'Erreur');
        return;
      }

      const dataToExport = filteredProfils.map(p => ({
        'Username': getUsername(p),
        'Email': getEmail(p),
        'Service': getServiceFromDepartement(p.departement),
        'Département': p.departement || 'Non spécifié',
        'Rôle': getRoleText(p.role),
        'Statut': getStatus(p) ? 'Actif' : 'Inactif',
        'Téléphone': p.telephone || 'Non spécifié',
        'Date inscription': formatDate(getDateInscription(p))
      }));

      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `profils_utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('success', 'Export CSV réussi !', 'Export');
      
      // 🔥 AUTO-LOGGER: Exportation
      autoLogger.logProfilExport('CSV', filteredProfils.length, {
        searchTerm: searchTerm,
        filterDepartement: filterDepartement,
        filterRole: filterRole
      });
      
    } catch (error) {
      console.error('❌ Erreur export:', error);
      showNotification('error', 'Erreur lors de l\'export', 'Erreur');
    }
  };

  const resetFilters = () => {
    // 🔥 AUTO-LOGGER: Réinitialisation des filtres
    autoLogger.logProfilFilter('réinitialisation', profils.length);
    
    setSearchTerm('');
    setFilterDepartement('');
    setFilterRole('');
    setSelectedProfils([]);
    showNotification('info', 'Filtres réinitialisés', 'Information');
  };

  const handleRetry = () => {
    setError('');
    fetchProfils();
    fetchUsersWithoutProfile();
    
    // 🔥 AUTO-LOGGER: Tentative de rechargement
    autoLogger.logAction('REESSAI', 'Profils Utilisateurs', 'Tentative de rechargement des données', {
      type: 'retry',
      timestamp: new Date().toISOString()
    });
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'badge-error',
      director: 'badge-warning',
      technician: 'badge-primary',
      secretary: 'badge-info',
      user: 'badge-neutral'
    };
    return badges[role as keyof typeof badges] || 'badge-neutral';
  };

  const getRoleText = (role: string) => {
    const texts = {
      admin: 'Administrateur',
      director: 'Directeur',
      technician: 'Technicien',
      secretary: 'Secrétaire',
      user: 'Utilisateur'
    };
    return texts[role as keyof typeof texts] || role;
  };

  const getServiceFromDepartement = (departement: string | undefined): string => {
    if (!departement) return 'Non attribué';
    
    const mapping: Record<string, string> = {
      'Informatique': 'Supp Tech',
      'Ressources Humaines': 'Administration',
      'Comptabilité': 'Finance',
      'Direction': 'Management',
      'Secrétariat': 'Supp Ad',
      'Marketing': 'Commercial',
      'Production': 'Opérations',
      'Commercial': 'Ventes'
    };
    
    return mapping[departement] || departement;
  };

  const getServiceBadge = (departement: string | undefined) => {
    const service = getServiceFromDepartement(departement);
    
    const badges: Record<string, string> = {
      'Supp Tech': 'badge-primary',
      'Administration': 'badge-secondary',
      'Finance': 'badge-accent',
      'Management': 'badge-warning',
      'Supp Ad': 'badge-info',
      'Commercial': 'badge-success',
      'Opérations': 'badge-error',
      'Ventes': 'badge-neutral'
    };
    return badges[service] || 'badge-outline';
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 'badge-success' : 'badge-error';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Actif' : 'Inactif';
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Non spécifiée';
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

  const departements = [...new Set(safeArray(profils).map(p => p.departement).filter(Boolean))];
  const roles = [...new Set(safeArray(profils).map(p => p.role).filter(Boolean))];

  if (loading || usersLoading) {
    return (
      <div className="p-6 bg-base-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">
            {loading ? 'Chargement des profils...' : 'Chargement des utilisateurs...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Confirmation de suppression
            </h3>
            <p className="py-4">{deleteMessage}</p>
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProfilToDelete(null);
                  setDeleteMultiple(false);
                  setDeleteMessage('');
                }}
              >
                Annuler
              </button>
              <button 
                className="btn btn-error"
                onClick={confirmDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`alert ${
          message.type === 'success' ? 'alert-success' : 
          message.type === 'error' ? 'alert-error' : 
          'alert-info'
        } mb-4 flex items-center justify-between`}>
          <span>{message.text}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <button 
              className="btn btn-outline btn-sm"
              onClick={handleRetry}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">👥 Gestion des Profils Utilisateurs</h1>
          <p className="text-base-content opacity-60 mt-1">
            {safeArray(filteredProfils).length} profil(s) trouvé(s)
            {selectedProfils.length > 0 && (
              <span className="text-primary font-semibold ml-2">
                ({selectedProfils.length} sélectionné(s))
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="btn btn-outline btn-sm"
            title="Exporter la liste"
            disabled={filteredProfils.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button
            onClick={handleAddNew}
            className="btn btn-primary btn-sm"
            title="Créer un nouveau profil"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau profil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4 text-center">
            <User className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="text-lg font-bold">{statistiques.total}</h3>
            <p className="text-sm opacity-60">Total</p>
          </div>
        </div>

        <div className="card bg-success/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
            <h3 className="text-lg font-bold text-success">{statistiques.actifs}</h3>
            <p className="text-sm opacity-60">Actifs</p>
          </div>
        </div>

        <div className="card bg-error/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <Key className="h-6 w-6 text-error mx-auto mb-2" />
            <h3 className="text-lg font-bold text-error">{statistiques.administrateurs}</h3>
            <p className="text-sm opacity-60">Administrateurs</p>
          </div>
        </div>

        <div className="card bg-primary/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <Briefcase className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="text-lg font-bold text-primary">{statistiques.techniciens}</h3>
            <p className="text-sm opacity-60">Techniciens</p>
          </div>
        </div>

        <div className="card bg-info/10 shadow-sm">
          <div className="card-body p-4 text-center">
            <User className="h-6 w-6 text-info mx-auto mb-2" />
            <h3 className={`text-lg font-bold ${statistiques.utilisateursDisponibles > 0 ? 'text-info' : 'text-warning'}`}>
              {statistiques.utilisateursDisponibles}
            </h3>
            <p className="text-sm opacity-60">Disponibles</p>
          </div>
        </div>
      </div>

      {usersWithoutProfile.length > 0 && (
        <div className="alert alert-warning mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <span>
                <strong>{usersWithoutProfile.length} utilisateur(s)</strong> sans profil
              </span>
            </div>
            <button
              onClick={handleAddNew}
              className="btn btn-warning btn-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer des profils
            </button>
          </div>
        </div>
      )}

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
                  placeholder="Username, email, téléphone, département..."
                  className="input input-bordered w-full pl-10 bg-base-100"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // 🔥 AUTO-LOGGER: Recherche
                    if (e.target.value.trim()) {
                      const resultsCount = profils.filter(profil => {
                        const userName = getUsername(profil).toLowerCase();
                        const userEmail = getEmail(profil).toLowerCase();
                        const departement = (profil.departement || '').toLowerCase();
                        const search = e.target.value.toLowerCase();
                        
                        return (
                          userName.includes(search) ||
                          userEmail.includes(search) ||
                          departement.includes(search)
                        );
                      }).length;
                      
                      autoLogger.logProfilSearch(e.target.value, resultsCount);
                    }
                  }}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">🏢 Département</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterDepartement}
                onChange={(e) => {
                  setFilterDepartement(e.target.value);
                  // 🔥 AUTO-LOGGER: Filtre par département
                  if (e.target.value) {
                    const resultsCount = profils.filter(p => 
                      (p.departement || '').toLowerCase().includes(e.target.value.toLowerCase())
                    ).length;
                    
                    autoLogger.logProfilFilter(`département: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Tous les départements</option>
                {departements.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">👑 Rôle</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100"
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  // 🔥 AUTO-LOGGER: Filtre par rôle
                  if (e.target.value) {
                    const resultsCount = profils.filter(p => p.role === e.target.value).length;
                    
                    autoLogger.logProfilFilter(`rôle: ${e.target.value}`, resultsCount);
                  }
                }}
              >
                <option value="">Tous les rôles</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {getRoleText(role)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">📊 Actions</span>
              </label>
              <div className="flex justify-between items-center">
                <div className="text-sm text-base-content opacity-70">
                  {safeArray(filteredProfils).length} / {safeArray(profils).length} profils
                </div>
                <button
                  onClick={resetFilters}
                  className="btn btn-outline btn-sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {selectedProfils.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-semibold text-primary text-lg">
                      {selectedProfils.length} profil(s) sélectionné(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSelected}
                    className="btn btn-primary btn-sm gap-2"
                    disabled={selectedProfils.length !== 1}
                    title={selectedProfils.length !== 1 ? "Sélectionnez un seul profil pour modifier" : ""}
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="btn btn-outline btn-error btn-sm gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer ({selectedProfils.length})
                  </button>
                  <button
                    onClick={() => setSelectedProfils([])}
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

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-0">
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
                        disabled={filteredProfils.length === 0}
                      >
                        {isSelectAll ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5 text-base-content/40" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="font-bold px-4 py-3">Utilisateur (username)</th>
                  <th className="font-bold px-4 py-3">Email</th>
                  <th className="font-bold px-4 py-3">Service</th>
                  <th className="font-bold px-4 py-3">Département</th>
                  <th className="font-bold px-4 py-3">Rôle</th>
                  <th className="font-bold px-4 py-3">Statut</th>
                  <th className="font-bold px-4 py-3">Téléphone</th>
                  <th className="font-bold px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(filteredProfils).length > 0 ? (
                  safeArray(filteredProfils).map((profil) => (
                    <tr key={profil.id} className="hover:bg-base-100 border-b border-base-300">
                      <td className="text-center py-3">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm"
                            checked={selectedProfils.includes(profil.id)}
                            onChange={() => toggleSelectProfil(profil.id)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                              <span className="text-xs">{getInitials(profil)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">
                              @{getUsername(profil)}
                            </div>
                            <div className="text-xs text-base-content opacity-60">
                              {getFullName(profil)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 opacity-70" />
                          <span className="truncate max-w-[180px]" title={getEmail(profil)}>
                            {getEmail(profil)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`badge ${getServiceBadge(profil.departement)}`}>
                          {getServiceFromDepartement(profil.departement)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-base-content opacity-50" />
                          <span>{profil.departement || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`badge ${getRoleBadge(profil.role)}`}>
                          {getRoleText(profil.role)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`badge ${getStatusBadge(getStatus(profil))}`}>
                          {getStatusText(getStatus(profil))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {profil.telephone ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 opacity-70" />
                            <span>{profil.telephone}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(profil)}
                            className="btn btn-ghost btn-xs btn-square text-info hover:bg-info/10"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(profil)}
                            className="btn btn-ghost btn-xs btn-square text-primary hover:bg-primary/10"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(profil.id)}
                            className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <div className="text-base-content opacity-40">
                        <User className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-lg font-medium">Aucun profil utilisateur trouvé</p>
                        <p className="text-sm mt-2">
                          {searchTerm || filterDepartement || filterRole 
                            ? "Essayez de modifier vos critères de recherche" 
                            : "Aucun profil utilisateur n'est enregistré"
                          }
                        </p>
                        {profils.length === 0 && (
                          <div className="mt-4">
                            <button
                              onClick={handleAddNew}
                              className="btn btn-primary btn-sm"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Créer un premier profil
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de détails des profils */}
      {isViewingDetails && selectedProfilDetails && (
        <div className="modal modal-open modal-bottom sm:modal-middle">
          <div className="modal-box bg-base-200 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl text-base-content">👤 Détails du profil utilisateur</h3>
              <button 
                onClick={() => setIsViewingDetails(false)} 
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-base-100 rounded-lg">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-16 h-16">
                      <span className="text-2xl">
                        {getInitials(selectedProfilDetails)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{getFullName(selectedProfilDetails)}</h2>
                    <p className="text-base-content opacity-60">@{getUsername(selectedProfilDetails)}</p>
                    <p className="text-sm text-primary mt-1">{getEmail(selectedProfilDetails)}</p>
                  </div>
                </div>
                
                <div className="space-y-4 p-4 bg-base-100 rounded-lg">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" /> Informations de contact
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="label-text text-sm opacity-60">📧 Email</label>
                      <p className="font-medium text-lg">{getEmail(selectedProfilDetails)}</p>
                    </div>
                    
                    <div>
                      <label className="label-text text-sm opacity-60">📞 Téléphone</label>
                      <p className="font-medium text-lg">{selectedProfilDetails.telephone || 'Non spécifié'}</p>
                    </div>
                    
                    <div>
                      <label className="label-text text-sm opacity-60">🏢 Département</label>
                      <p className="font-medium text-lg">{selectedProfilDetails.departement || 'Non spécifié'}</p>
                    </div>
                    
                    <div>
                      <label className="label-text text-sm opacity-60">🏭 Service</label>
                      <div className={`badge ${getServiceBadge(selectedProfilDetails.departement)} p-3 mt-1`}>
                        <span className="text-lg">{getServiceFromDepartement(selectedProfilDetails.departement)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-base-100 rounded-lg">
                  <h4 className="font-semibold text-lg flex items-center gap-2 mb-4">
                    <Key className="h-5 w-5" /> Informations système
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label-text text-sm opacity-60">👑 Rôle</label>
                      <div className={`badge ${getRoleBadge(selectedProfilDetails.role)} gap-2 p-3 mt-1`}>
                        <span className="text-lg">{getRoleText(selectedProfilDetails.role)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="label-text text-sm opacity-60">🔓 Statut</label>
                      <div className={`badge ${getStatusBadge(getStatus(selectedProfilDetails))} p-3 mt-1`}>
                        <span className="text-lg">{getStatusText(getStatus(selectedProfilDetails))}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-base-100 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="label-text text-sm opacity-60">👤 Nom complet</label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-primary" />
                        <p className="font-medium text-lg">{getFullName(selectedProfilDetails)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-action mt-6">
              <button onClick={() => setIsViewingDetails(false)} className="btn btn-primary">
                Fermer
              </button>
              <button 
                onClick={() => {
                  setIsViewingDetails(false);
                  handleEdit(selectedProfilDetails);
                }}
                className="btn btn-outline btn-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier ce profil
              </button>
            </div>
          </div>
          
          <div 
            className="modal-backdrop" 
            onClick={() => setIsViewingDetails(false)}
          />
        </div>
      )}

      <ProfilUtilisateurForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProfil(undefined);
        }}
        onSubmit={handleSubmit}
        profil={editingProfil}
        usersWithoutProfile={usersWithoutProfile}
      />
    </div>
  );
};

export default ProfilsUtilisateurs;