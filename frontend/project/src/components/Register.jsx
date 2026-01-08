

// import React, { useState } from 'react';
// import { Monitor, Lock, User, MapPin, Mail, UserPlus, Shield, Settings, Briefcase } from 'lucide-react';
// import { useAuth } from '../context/AuthContext.tsx';
// import { Link } from 'react-router-dom'; // AJOUTEZ CET IMPORT

// const Register = ({ onSwitchToLogin }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     name: '',
//     role: 'user',
//     password_confirm: '',
//     departement: '',
//     telephone: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { register } = useAuth();

//   // Départements disponibles
//   const DEPARTEMENTS = [
//     'Direction',
//     'Comptabilité',
//     'Ressources Humaines',
//     'Informatique',
//     'Secrétariat',
//     'Archives',
//     'À définir'
//   ];

//   // Description des rôles
//   const ROLE_DESCRIPTIONS = {
//     user: 'Accès basique - Consultation et signalement',
//     technician: 'Gestion technique - Réparations et installations',
//     secretary: 'Gestion administrative - Fournisseurs et documents',
//     director: 'Vue globale - Tableaux de bord et rapports',
//     admin: 'Accès complet - Administration du système'
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const validateForm = () => {
//     // Validation mot de passe
//     if (formData.password !== formData.password_confirm) {
//       setError('Les mots de passe ne correspondent pas');
//       return false;
//     }

//     if (formData.password.length < 6) {
//       setError('Le mot de passe doit contenir au moins 6 caractères');
//       return false;
//     }

//     // Validation email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Veuillez entrer une adresse email valide');
//       return false;
//     }

//     // Validation nom d'utilisateur
//     if (formData.username.length < 3) {
//       setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
//       return false;
//     }

//     // Validation nom complet
//     if (formData.name.length < 2) {
//       setError('Le nom complet doit contenir au moins 2 caractères');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     if (!validateForm()) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Préparer les données pour l'API
//       const registerData = {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//         password_confirm: formData.password_confirm,
//         name: formData.name,
//         role: formData.role,
//         departement: formData.departement || 'À définir',
//         telephone: formData.telephone
//       };

//       const result = await register(registerData);
      
//       if (result.success) {
//         setSuccess('✅ ' + result.message);
//         // Réinitialiser le formulaire après succès
//         setFormData({
//           username: '',
//           email: '',
//           password: '',
//           name: '',
//           role: 'user',
//           password_confirm: '',
//           departement: '',
//           telephone: ''
//         });
//       } else {
//         setError('❌ ' + result.message);
//       }
//     } catch (err) {
//       console.error('Registration error:', err);
//       setError('❌ Erreur lors de la création du compte. Veuillez réessayer.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case 'admin': return <Shield className="h-4 w-4" />;
//       case 'technician': return <Settings className="h-4 w-4" />;
//       case 'director': return <Briefcase className="h-4 w-4" />;
//       case 'secretary': return <User className="h-4 w-4" />;
//       default: return <User className="h-4 w-4" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl w-full space-y-8">
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="bg-white p-4 rounded-full shadow-lg">
//               <UserPlus className="h-12 w-12 text-blue-600" />
//             </div>
//           </div>
//           <div className="flex items-center justify-center mb-2">
//             <MapPin className="h-5 w-5 text-blue-200 mr-2" />
//             <span className="text-blue-200 text-sm font-medium">Toliara, Madagascar</span>
//           </div>
//           <h2 className="text-3xl font-bold text-white mb-2">
//             DREN Antsimo Andrefana
//           </h2>
//           <p className="text-blue-200 text-lg font-medium mb-1">
//             Demander un accès
//           </p>
//           <p className="text-blue-300 text-sm">
//             Formulaire de demande de compte utilisateur
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="card bg-white/95 backdrop-blur-sm shadow-2xl animate-fade-in">
//             <div className="card-body space-y-4 p-6">
//               {/* Informations personnelles */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Nom complet *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <User className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="name"
//                       name="name"
//                       type="text"
//                       required
//                       value={formData.name}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                       placeholder="Ex: Jean Dupont"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                     Nom d'utilisateur *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <User className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="username"
//                       name="username"
//                       type="text"
//                       required
//                       value={formData.username}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                       placeholder="Ex: j.dupont"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                     Email *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="email"
//                       name="email"
//                       type="email"
//                       required
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                       placeholder="Ex: jean.dupont@dren.gov.mg"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
//                     Téléphone
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <User className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="telephone"
//                       name="telephone"
//                       type="tel"
//                       value={formData.telephone}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                       placeholder="Ex: +261 32 12 345 67"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Informations professionnelles */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="departement" className="block text-sm font-medium text-gray-700 mb-2">
//                     Département *
//                   </label>
//                   <select
//                     id="departement"
//                     name="departement"
//                     required
//                     value={formData.departement}
//                     onChange={handleChange}
//                     className="select select-bordered w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="">Sélectionnez un département</option>
//                     {DEPARTEMENTS.map(dept => (
//                       <option key={dept} value={dept}>{dept}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
//                     Rôle demandé *
//                   </label>
//                   <select
//                     id="role"
//                     name="role"
//                     required
//                     value={formData.role}
//                     onChange={handleChange}
//                     className="select select-bordered w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="user">Utilisateur standard</option>
//                     <option value="technician">Technicien</option>
//                     <option value="secretary">Secrétaire</option>
//                     <option value="director">Directeur</option>
//                     <option value="admin">Administrateur</option>
//                   </select>
                  
//                   {/* Description du rôle sélectionné */}
//                   <div className="mt-2 p-2 bg-blue-50 rounded-lg">
//                     <div className="flex items-center text-sm text-blue-700">
//                       {getRoleIcon(formData.role)}
//                       <span className="ml-2 font-medium">{ROLE_DESCRIPTIONS[formData.role]}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Mot de passe */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                     Mot de passe *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="password"
//                       name="password"
//                       type="password"
//                       required
//                       value={formData.password}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                       placeholder="Minimum 6 caractères"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirmer le mot de passe *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="password_confirm"
//                       name="password_confirm"
//                       type="password"
//                       required
//                       value={formData.password_confirm}
//                       onChange={handleChange}
//                       className="input input-bordered w-full pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                       placeholder="Retapez votre mot de passe"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Messages d'erreur/succès */}
//               {error && (
//                 <div className="alert alert-error bg-red-50 border-red-200 p-4 rounded-lg">
//                   <div className="flex items-center">
//                     <span className="text-red-800 text-sm">{error}</span>
//                   </div>
//                 </div>
//               )}

//               {success && (
//                 <div className="alert alert-success bg-green-50 border-green-200 p-4 rounded-lg">
//                   <div className="flex items-center">
//                     <span className="text-green-800 text-sm">{success}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Bouton de soumission */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full btn bg-green-600 hover:bg-green-700 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold"
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="loading loading-spinner loading-sm mr-2"></span>
//                     Traitement de la demande...
//                   </>
//                 ) : (
//                   <>
//                     <UserPlus className="h-5 w-5 mr-2" />
//                     Soumettre la demande d'accès
//                   </>
//                 )}
//               </button>

//               {/* Lien vers connexion */}
//               <div className="text-center pt-4 border-t border-gray-200">
//                 {/* <button
//                   type="button"
//                   onClick={onSwitchToLogin}
//                   className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
//                 >
//                   Déjà un compte ? Se connecter ici
//                 </button> */}
//                 <Link
//                   to="/login"
//                   className="inline-flex items-center justify-center w-full btn btn-outline btn-primary border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600 transition-all duration-200 font-medium py-3"
//                   >
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Déjà un compte ? Se connecter ici
//                 </Link>

//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Information sur les rôles */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Informations sur les rôles</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <div className="flex items-center font-semibold text-blue-700 mb-1">
//                 <User className="h-4 w-4 mr-2" />
//                 Utilisateur Standard
//               </div>
//               <p className="text-blue-600">Consultation et signalement d'incidents</p>
//             </div>
//             <div className="bg-green-50 p-3 rounded-lg">
//               <div className="flex items-center font-semibold text-green-700 mb-1">
//                 <Settings className="h-4 w-4 mr-2" />
//                 Technicien
//               </div>
//               <p className="text-green-600">Gestion technique et réparations</p>
//             </div>
//             <div className="bg-purple-50 p-3 rounded-lg">
//               <div className="flex items-center font-semibold text-purple-700 mb-1">
//                 <Briefcase className="h-4 w-4 mr-2" />
//                 Directeur
//               </div>
//               <p className="text-purple-600">Tableaux de bord et rapports</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;







import React, { useState } from 'react';
import { Monitor, Lock, User, MapPin, Mail, UserPlus, Shield, Settings, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Link } from 'react-router-dom';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    role: 'user',
    password_confirm: '',
    departement: '',
    telephone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  // Départements disponibles
  const DEPARTEMENTS = [
    'Direction',
    'Comptabilité',
    'Ressources Humaines',
    'Informatique',
    'Secrétariat',
    'Archives',
    'À définir'
  ];

  // Description des rôles
  const ROLE_DESCRIPTIONS = {
    user: 'Accès basique - Consultation et signalement',
    technician: 'Gestion technique - Réparations et installations',
    secretary: 'Gestion administrative - Fournisseurs et documents',
    director: 'Vue globale - Tableaux de bord et rapports',
    admin: 'Accès complet - Administration du système'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    // Validation mot de passe
    if (formData.password !== formData.password_confirm) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }

    // Validation nom d'utilisateur
    if (formData.username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      return false;
    }

    // Validation nom complet
    if (formData.name.length < 2) {
      setError('Le nom complet doit contenir au moins 2 caractères');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Préparer les données pour l'API
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        name: formData.name,
        role: formData.role,
        departement: formData.departement || 'À définir',
        telephone: formData.telephone
      };

      const result = await register(registerData);
      
      if (result.success) {
        setSuccess('✅ ' + result.message);
        // Réinitialiser le formulaire après succès
        setFormData({
          username: '',
          email: '',
          password: '',
          name: '',
          role: 'user',
          password_confirm: '',
          departement: '',
          telephone: ''
        });
      } else {
        setError('❌ ' + result.message);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('❌ Erreur lors de la création du compte. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'technician': return <Settings className="h-4 w-4" />;
      case 'director': return <Briefcase className="h-4 w-4" />;
      case 'secretary': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <UserPlus className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center justify-center mb-2">
            <MapPin className="h-5 w-5 text-blue-200 mr-2" />
            <span className="text-blue-200 text-sm font-medium">Toliara, Madagascar</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            DREN Antsimo Andrefana
          </h2>
          <p className="text-blue-200 text-lg font-medium mb-1">
            Demander un accès
          </p>
          <p className="text-blue-300 text-sm">
            Formulaire de demande de compte utilisateur
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card bg-white/95 backdrop-blur-sm shadow-2xl animate-fade-in">
            <div className="card-body space-y-4 p-6">
              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
                      placeholder="Ex: j.dupont"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
                      placeholder="Ex: jean.dupont@dren.gov.mg"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
                      placeholder="Ex: +261 32 12 345 67"
                    />
                  </div>
                </div>
              </div>

              {/* Informations professionnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="departement" className="block text-sm font-medium text-gray-700 mb-2">
                    Département *
                  </label>
                  <select
                    id="departement"
                    name="departement"
                    required
                    value={formData.departement}
                    onChange={handleChange}
                    className="w-full py-3 px-4 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 outline-none"
                  >
                    <option value="">Sélectionnez un département</option>
                    {DEPARTEMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle demandé *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full py-3 px-4 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 outline-none"
                  >
                    <option value="user">Utilisateur standard</option>
                    <option value="technician">Technicien</option>
                    <option value="secretary">Secrétaire</option>
                    <option value="director">Directeur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  
                  {/* Description du rôle sélectionné */}
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-700">
                      {getRoleIcon(formData.role)}
                      <span className="ml-2 font-medium">{ROLE_DESCRIPTIONS[formData.role]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mot de passe avec bouton masquer/afficher */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
                      placeholder="Minimum 6 caractères"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password_confirm"
                      name="password_confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.password_confirm}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
                      placeholder="Retapez votre mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      title={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages d'erreur/succès */}
              {error && (
                <div className="alert alert-error bg-red-50 border-red-200 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-800 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="alert alert-success bg-green-50 border-green-200 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-800 text-sm">{success}</span>
                  </div>
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn bg-green-600 hover:bg-green-700 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Traitement de la demande...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Soumettre la demande d'accès
                  </>
                )}
              </button>

              {/* Lien vers connexion */}
              <div className="text-center pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full btn bg-gradient-to-r from-white to-blue-50 text-blue-600 border-2 border-blue-400 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:border-blue-500 hover:shadow-lg transition-all duration-200 font-semibold py-3"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Déjà un compte ? Se connecter ici
                </Link>
              </div>
            </div>
          </div>
        </form>

        {/* Information sur les rôles */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Informations sur les rôles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center font-semibold text-blue-700 mb-1">
                <User className="h-4 w-4 mr-2" />
                Utilisateur Standard
              </div>
              <p className="text-blue-600">Consultation et signalement d'incidents</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center font-semibold text-green-700 mb-1">
                <Settings className="h-4 w-4 mr-2" />
                Technicien
              </div>
              <p className="text-green-600">Gestion technique et réparations</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center font-semibold text-purple-700 mb-1">
                <Briefcase className="h-4 w-4 mr-2" />
                Directeur
              </div>
              <p className="text-purple-600">Tableaux de bord et rapports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;