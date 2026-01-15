import React, { useState, useEffect } from 'react';
import { 
  X, User, Phone, Building, Shield, 
  Briefcase, Mail, Lock, Eye, EyeOff, UserPlus
} from 'lucide-react';
import { ProfilUtilisateur, User as UserType } from '../types';

interface ProfilUtilisateurFormData {
  // Pour nouvel utilisateur
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  
  // Pour utilisateur existant
  user_username: string;
  
  // Informations du profil
  departement: string;
  telephone: string;
  role: 'user' | 'technician' | 'secretary' | 'directeur' | 'admin';
}

interface ProfilUtilisateurFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profilData: any) => void;
  profil?: ProfilUtilisateur;
  usersWithoutProfile?: UserType[];
}

const ProfilUtilisateurForm: React.FC<ProfilUtilisateurFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  profil,
  usersWithoutProfile = []
}) => {
  const DEPARTEMENTS = [
    'Direction',
    'Comptabilité',
    'Ressources Humaines',
    'Informatique',
    'Secrétariat',
    'Archives',
    'À définir'
  ];

  const ROLE_DESCRIPTIONS = {
    user: 'Accès basique - Consultation et signalement',
    technician: 'Gestion technique - Réparations et installations',
    secretary: 'Gestion administrative - Fournisseurs et documents',
    director: 'Vue globale - Tableaux de bord et rapports',
    admin: 'Accès complet - Administration du système'
  };

  const [formData, setFormData] = useState<ProfilUtilisateurFormData>({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    name: '',
    user_username: '',
    departement: '',
    telephone: '',
    role: 'user'
  });

  const [mode, setMode] = useState<'new' | 'existing'>(profil ? 'existing' : 'new');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    if (profil) {
      // Mode édition
      const user = profil.user;
      const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
      
      setFormData({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        password_confirm: '',
        name: fullName,
        user_username: user?.username || '',
        departement: profil.departement || '',
        telephone: profil.telephone || '',
        role: profil.role || 'user'
      });
      
      setSelectedUser(profil.user || null);
      setMode('existing');
    } else {
      // Mode création
      setFormData({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        name: '',
        user_username: '',
        departement: '',
        telephone: '',
        role: 'user'
      });
      setSelectedUser(null);
      setMode('new');
    }
    setErrors({});
  }, [profil, isOpen]);

  // Vérifier la force du mot de passe
  useEffect(() => {
    if (formData.password && mode === 'new') {
      let strength = 0;
      if (formData.password.length >= 8) strength += 1;
      if (/[A-Z]/.test(formData.password)) strength += 1;
      if (/[0-9]/.test(formData.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'new') {
      // Validation pour la création d'un nouvel utilisateur
      if (!formData.username.trim()) {
        newErrors.username = "Le nom d'utilisateur est requis";
      } else if (formData.username.length < 3) {
        newErrors.username = "Minimum 3 caractères";
      }

      if (!formData.email.trim()) {
        newErrors.email = "L'email est requis";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email invalide";
      }

      if (!formData.password) {
        newErrors.password = "Le mot de passe est requis";
      } else if (formData.password.length < 6) {
        newErrors.password = "Minimum 6 caractères";
      }

      if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = "Les mots de passe ne correspondent pas";
      }

      if (!formData.name.trim()) {
        newErrors.name = "Le nom complet est requis";
      }
    } else {
      // Validation pour la sélection d'un utilisateur existant
      if (!profil && !formData.user_username.trim()) {
        newErrors.user_username = "Veuillez sélectionner un utilisateur";
      }
    }
    
    if (!formData.departement.trim()) {
      newErrors.departement = 'Le département est requis';
    }
    
    if (!formData.role) {
      newErrors.role = 'Le rôle est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'role') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as 'user' | 'technician' | 'secretary' | 'director' | 'admin'
      }));
    } else if (name === 'user_username') {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (value) {
        const user = usersWithoutProfile.find(u => u.username === value);
        if (user) {
          setSelectedUser(user);
          // Pré-remplir avec les infos de l'utilisateur
          setFormData(prev => ({
            ...prev,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            email: user.email || ''
          }));
        }
      } else {
        setSelectedUser(null);
      }
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: '' 
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let submitData: any;
    
    if (profil) {
      // MODE ÉDITION
      submitData = {
        id: profil.id,
        user_username: formData.user_username,
        user_email: formData.email,
        departement: formData.departement.trim(),
        telephone: formData.telephone.trim(),
        role: formData.role
      };
    } else if (mode === 'new') {
      // MODE CRÉATION D'UN NOUVEL UTILISATEUR
      submitData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirm: formData.password_confirm,
        name: formData.name.trim(),
        departement: formData.departement.trim(),
        telephone: formData.telephone.trim(),
        role: formData.role
      };
    } else {
      // MODE CRÉATION AVEC UTILISATEUR EXISTANT
      submitData = {
        user_username: formData.user_username.trim(),
        departement: formData.departement.trim(),
        telephone: formData.telephone.trim(),
        role: formData.role
      };
    }

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      password_confirm: '',
      name: '',
      user_username: '',
      departement: '',
      telephone: '',
      role: 'user'
    });
    setMode('new');
    setSelectedUser(null);
    setErrors({});
    onClose();
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Non renseigné';
    if (passwordStrength === 1) return 'Très faible';
    if (passwordStrength === 2) return 'Faible';
    if (passwordStrength === 3) return 'Moyen';
    return 'Fort';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'technician': return <Briefcase className="h-4 w-4" />;
      case 'director': return <User className="h-4 w-4" />;
      case 'secretary': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <div>
            <h2 className="text-xl font-bold text-base-content">
              {profil ? '✏️ Modifier le profil' : '👤 Créer un utilisateur et son profil'}
            </h2>
            <p className="text-base-content opacity-70 text-sm mt-1">
              {profil 
                ? `Modification du profil de @${profil.user?.username}`
                : 'Créer un nouvel utilisateur ou utiliser un utilisateur existant'
              }
            </p>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!profil && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-base-content">
                  Type de création
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode('new')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    mode === 'new'
                      ? 'border-primary bg-primary/10'
                      : 'border-base-300 hover:border-base-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-full ${
                      mode === 'new' ? 'bg-primary text-primary-content' : 'bg-base-300'
                    }`}>
                      <UserPlus className="h-6 w-6" />
                    </div>
                    <span className="font-semibold">Nouvel utilisateur</span>
                    <p className="text-sm text-center text-base-content opacity-70">
                      Créer un compte utilisateur complet
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('existing')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    mode === 'existing'
                      ? 'border-primary bg-primary/10'
                      : 'border-base-300 hover:border-base-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-full ${
                      mode === 'existing' ? 'bg-primary text-primary-content' : 'bg-base-300'
                    }`}>
                      <User className="h-6 w-6" />
                    </div>
                    <span className="font-semibold">Utilisateur existant</span>
                    <p className="text-sm text-center text-base-content opacity-70">
                      Associer à un compte existant
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {!profil && mode === 'new' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-base-content">
                  Informations de connexion
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Nom d'utilisateur *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`input input-bordered w-full bg-base-200 text-base-content ${
                      errors.username ? 'input-error' : ''
                    }`}
                    placeholder="john.doe"
                  />
                  {errors.username && (
                    <div className="text-error text-sm mt-1">{errors.username}</div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Email *
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-70" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input input-bordered w-full pl-10 bg-base-200 text-base-content ${
                        errors.email ? 'input-error' : ''
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <div className="text-error text-sm mt-1">{errors.email}</div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Nom complet *
                  </span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-70" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input input-bordered w-full pl-10 bg-base-200 text-base-content ${
                      errors.name ? 'input-error' : ''
                    }`}
                    placeholder="Jean Dupont"
                  />
                </div>
                {errors.name && (
                  <div className="text-error text-sm mt-1">{errors.name}</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Mot de passe *
                    </span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-70" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`input input-bordered w-full pl-10 pr-10 bg-base-200 text-base-content ${
                        errors.password ? 'input-error' : ''
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-base-content opacity-70" />
                      ) : (
                        <Eye className="h-4 w-4 text-base-content opacity-70" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="text-error text-sm mt-1">{errors.password}</div>
                  )}
                  
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-base-content">
                          Force du mot de passe: {getPasswordStrengthText()}
                        </span>
                        <span className="text-xs font-bold text-base-content">
                          {passwordStrength}/4
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded ${
                              level <= passwordStrength
                                ? getPasswordStrengthColor()
                                : 'bg-base-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-base-content opacity-70 mt-2">
                        Le mot de passe doit contenir au moins 6 caractères
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Confirmer le mot de passe *
                    </span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-70" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirm"
                      value={formData.password_confirm}
                      onChange={handleChange}
                      className={`input input-bordered w-full pl-10 pr-10 bg-base-200 text-base-content ${
                        errors.password_confirm ? 'input-error' : ''
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-base-content opacity-70" />
                      ) : (
                        <Eye className="h-4 w-4 text-base-content opacity-70" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirm && (
                    <div className="text-error text-sm mt-1">{errors.password_confirm}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!profil && mode === 'existing' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-base-content">
                  Sélection de l'utilisateur
                </h3>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Utilisateur sans profil *
                  </span>
                  <span className="badge badge-info badge-sm">
                    {usersWithoutProfile.length} disponible(s)
                  </span>
                </label>
                <select
                  name="user_username"
                  value={formData.user_username || ''}
                  onChange={handleChange}
                  className={`select select-bordered w-full bg-base-200 text-base-content ${
                    errors.user_username ? 'select-error' : ''
                  }`}
                >
                  <option value="">Sélectionnez un utilisateur</option>
                  {usersWithoutProfile.map(user => (
                    <option key={user.id} value={user.username} className="text-base-content">
                      @{user.username} - {user.first_name || ''} {user.last_name || ''} - {user.email || 'Pas d\'email'}
                    </option>
                  ))}
                </select>
                {errors.user_username && (
                  <div className="text-error text-sm mt-1">{errors.user_username}</div>
                )}
                
                {selectedUser && (
                  <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span className="text-sm">
                            {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-primary">
                          @{selectedUser.username}
                        </div>
                        <div className="text-sm text-base-content opacity-70">
                          {selectedUser.first_name} {selectedUser.last_name} • {selectedUser.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section Informations professionnelles */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-base-content">
                Informations professionnelles
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Département */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Département *
                  </span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-70" />
                  <select
                    name="departement"
                    value={formData.departement}
                    onChange={handleChange}
                    className={`select select-bordered w-full pl-10 bg-base-200 text-base-content ${
                      errors.departement ? 'select-error' : ''
                    }`}
                    required
                  >
                    <option value="">Sélectionnez un département</option>
                    {DEPARTEMENTS.map(dept => (
                      <option key={dept} value={dept} className="text-base-content">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.departement && (
                  <div className="text-error text-sm mt-1">{errors.departement}</div>
                )}
              </div>

              {/* Rôle */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Rôle *
                  </span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-70" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`select select-bordered w-full pl-10 bg-base-200 text-base-content ${
                      errors.role ? 'select-error' : ''
                    }`}
                    required
                  >
                    <option value="">Sélectionnez un rôle</option>
                    <option value="user" className="text-base-content">Utilisateur standard</option>
                    <option value="technician" className="text-base-content">Technicien</option>
                    <option value="secretary" className="text-base-content">Secrétaire</option>
                    <option value="director" className="text-base-content">Directeur</option>
                    <option value="admin" className="text-base-content">Administrateur</option>
                  </select>
                </div>
                {formData.role && (
                  <div className="mt-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center text-sm">
                      <div className="p-1 rounded bg-base-300 mr-2">
                        {getRoleIcon(formData.role)}
                      </div>
                      <span className="font-medium text-base-content">
                        {ROLE_DESCRIPTIONS[formData.role]}
                      </span>
                    </div>
                  </div>
                )}
                {errors.role && (
                  <div className="text-error text-sm mt-1">{errors.role}</div>
                )}
              </div>
            </div>

            {/* Téléphone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">
                  Téléphone
                </span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-base-content opacity-70" />
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10 bg-base-200 text-base-content"
                  placeholder="Ex: +261 32 12 345 67"
                />
              </div>
            </div>
          </div>

          {/* Aperçu */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 rounded bg-base-300">
                  <User className="h-4 w-4 text-base-content" />
                </div>
                <h3 className="card-title text-sm font-semibold text-base-content">
                  Aperçu du profil
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-2">
                <div className="flex justify-between items-center p-2 bg-base-100 rounded border border-base-300">
                  <span className="font-medium text-base-content">Type:</span>
                  <span className="font-semibold text-primary">
                    {profil ? 'Édition' : mode === 'new' ? 'Nouvel utilisateur' : 'Utilisateur existant'}
                  </span>
                </div>
                
                {mode === 'new' && !profil && (
                  <>
                    <div className="flex justify-between items-center p-2 bg-base-100 rounded border border-base-300">
                      <span className="font-medium text-base-content">Username:</span>
                      <span className="font-semibold text-primary">
                        {formData.username || 'Non défini'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-base-100 rounded border border-base-300">
                      <span className="font-medium text-base-content">Email:</span>
                      <span className="font-semibold text-primary">
                        {formData.email || 'Non défini'}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center p-2 bg-base-100 rounded border border-base-300">
                  <span className="font-medium text-base-content">Département:</span>
                  <span className="badge badge-primary">
                    {formData.departement || 'Non sélectionné'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-base-100 rounded border border-base-300">
                  <span className="font-medium text-base-content">Rôle:</span>
                  <span className={`badge ${
                    formData.role === 'admin' ? 'badge-error' :
                    formData.role === 'director' ? 'badge-warning' :
                    formData.role === 'technician' ? 'badge-primary' :
                    formData.role === 'secretary' ? 'badge-info' :
                    'badge-neutral'
                  }`}>
                    {formData.role === 'user' ? 'Utilisateur' :
                     formData.role === 'technician' ? 'Technicien' :
                     formData.role === 'secretary' ? 'Secrétaire' :
                     formData.role === 'director' ? 'Directeur' : 'Administrateur'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost flex-1 gap-2 text-base-content"
            >
              <X className="h-4 w-4" />
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 gap-2"
              disabled={
                (!profil && mode === 'new' && (
                  !formData.username || 
                  !formData.email || 
                  !formData.password || 
                  formData.password !== formData.password_confirm ||
                  !formData.name ||
                  !formData.departement ||
                  !formData.role
                )) ||
                (!profil && mode === 'existing' && !formData.user_username) ||
                !formData.departement ||
                !formData.role
              }
            >
              {profil ? 'Modifier le profil' : 'Créer utilisateur et profil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilUtilisateurForm;