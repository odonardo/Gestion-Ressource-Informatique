// // // Login.jsx - VERSION CORRIGÉE AVEC TOUTES LES AMÉLIORATIONS

// // import React, { useState } from 'react';
// // import { 
// //   Monitor, 
// //   Lock, 
// //   User, 
// //   MapPin,
// //   Eye,
// //   EyeOff,
// //   LogIn,
// //   AlertCircle,
// //   UserPlus,
// //   Mail
// // } from 'lucide-react';
// // import { useAuth } from '../context/AuthContext';
// // import { Link } from 'react-router-dom';
// // import { useNotification } from '../context/NotificationContext';
// // import { useTheme } from '../context/ThemeContext'; // Ajoutez cette ligne

// // const Login = () => {
// //   const [formData, setFormData] = useState({
// //     username: '',
// //     password: ''
// //   });
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [error, setError] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);
// //   const { login } = useAuth();
// //   const { showNotification } = useNotification();
// //   const { theme, toggleTheme } = useTheme(); // Ajoutez cette ligne

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value
// //     });
// //     setError(''); // Clear error when user starts typing
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsLoading(true);
// //     setError('');

// //     // Validation
// //     if (!formData.username.trim() || !formData.password.trim()) {
// //       setError('Veuillez remplir tous les champs');
// //       setIsLoading(false);
// //       return;
// //     }

// //     if (formData.password.length < 6) {
// //       setError('Le mot de passe doit contenir au moins 6 caractères');
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       console.log('🔄 Tentative de connexion...');
// //       const success = await login(formData.username, formData.password);
      
// //       if (success) {
// //         console.log('✅ Connexion réussie, redirection...');
// //         // La redirection est gérée par le ProtectedRoute dans App.jsx
// //       } else {
// //         setError('Nom d\'utilisateur ou mot de passe incorrect');
// //       }
// //     } catch (err) {
// //       console.error('❌ Erreur de connexion:', err);
// //       setError('Erreur de connexion au serveur. Vérifiez que le serveur est démarré sur https://gestion-ressource-informatique.onrender.com');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-md w-full space-y-8">
// //         {/* En-tête */}
// //         <div className="text-center">
// //           <div className="flex justify-center mb-4">
// //             <div className="bg-white p-4 rounded-full shadow-lg animate-pulse">
// //               <Monitor className="h-12 w-12 text-blue-600" />
// //             </div>
// //           </div>
// //           <div className="flex items-center justify-center mb-2">
// //             <MapPin className="h-5 w-5 text-blue-200 mr-2" />
// //             <span className="text-blue-200 text-sm font-medium">Toliara, Madagascar</span>
// //           </div>
// //           <h2 className="text-3xl font-bold text-white mb-2">
// //             DREN Antsimo Andrefana
// //           </h2>
// //           <p className="text-blue-200 text-lg font-medium mb-1">
// //             Gestion des Ressources Informatiques
// //           </p>
// //           <p className="text-blue-300 text-sm">
// //             Direction Régionale de l'Éducation Nationale
// //           </p>
// //         </div>

// //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //           <div className="card bg-white/95 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:shadow-2xl">
// //             <div className="card-body space-y-4 p-6">
// //               <h3 className="text-xl font-bold text-gray-800 text-center flex items-center justify-center">
// //                 <LogIn className="h-5 w-5 mr-2" />
// //                 Connexion au système
// //               </h3>
              
// //               {/* Champ nom d'utilisateur - CORRIGÉ */}
// //               <div>
// //                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
// //                   <User className="inline h-4 w-4 mr-1" />
// //                   Nom d'utilisateur *
// //                 </label>
// //                 <div className="relative">
// //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                     <User className="h-5 w-5 text-gray-400" />
// //                   </div>
// //                   <input
// //                     id="username"
// //                     name="username"
// //                     type="text"
// //                     required
// //                     value={formData.username}
// //                     onChange={handleChange}
// //                     className="input input-bordered w-full pl-10 bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
// //                     placeholder="Entrez votre nom d'utilisateur"
// //                     disabled={isLoading}
// //                     autoComplete="username"
// //                   />
// //                 </div>
// //               </div>
// //               {/* Champ mot de passe avec bouton masquer/afficher */}
// //               <div>
// //                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
// //                   <Lock className="inline h-4 w-4 mr-1" />
// //                   Mot de passe *
// //                 </label>
// //                 <div className="relative">
// //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                     <Lock className="h-5 w-5 text-gray-400" />
// //                   </div>
// //                   <input
// //                     id="password"
// //                     name="password"
// //                     type={showPassword ? "text" : "password"}
// //                     required
// //                     value={formData.password}
// //                     onChange={handleChange}
// //                     className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
// //                     placeholder="Entrez votre mot de passe"
// //                     disabled={isLoading}
// //                     autoComplete="current-password"
// //                   />
// //                   <button
// //                     type="button"
// //                     className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
// //                   >
// //                     {showPassword ? (
// //                       <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800" />
// //                     ) : (
// //                       <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800" />
// //                     )}
// //                   </button>
// //                 </div>
// //                 <div className="mt-1 text-xs text-gray-500 flex items-center">
// //                   <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
// //                   Minimum 6 caractères
// //                 </div>
// //               </div>

// //               {/* Message d'erreur */}
// //               {error && (
// //                 <div className="alert alert-error bg-red-50 border-2 border-red-200 p-3 animate-shake">
// //                   <div className="flex items-center">
// //                     <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
// //                     <span className="text-red-800 text-sm font-medium">{error}</span>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Bouton de connexion */}
// //               <button
// //                 type="submit"
// //                 disabled={isLoading}
// //                 className="w-full btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
// //               >
// //                 {isLoading ? (
// //                   <>
// //                     <span className="loading loading-spinner loading-sm mr-2"></span>
// //                     Connexion en cours...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <LogIn className="w-5 h-5 mr-2" />
// //                     Se connecter
// //                   </>
// //                 )}
// //               </button>

// //               {/* Lien vers inscription */}
// //               <div className="text-center pt-4 border-t border-gray-200">
// //                 <p className="text-sm text-gray-600 mb-2">
// //                   Pas encore de compte ?
// //                 </p>
// //                 <Link
// //                   to="/register"
// //                   className="inline-flex items-center justify-center w-full btn btn-outline btn-primary border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600 transition-all duration-200 font-medium py-3"
// //                   >
// //                   <UserPlus className="h-4 w-4 mr-2" />
// //                   Créer un nouveau compte
// //                 </Link>
// //                 {/* <Link
// //                   to="/register"
// //   className="inline-flex items-center justify-center w-full btn bg-gradient-to-r from-white to-blue-50 text-blue-600 border-2 border-blue-400 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:border-blue-500 hover:shadow-lg transition-all duration-200 font-semibold py-3"
// // >
// //                   <UserPlus className="h-4 w-4 mr-2" />
// //                   Créer un nouveau compte
// //                 </Link> */}
                
// //                 <div className="mt-4 text-xs text-gray-500">
// //                   <p className="flex items-center justify-center">
// //                     <Mail className="h-3 w-3 mr-1" />
// //                     Contact: support@dren-antsimoandrefana.mg
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Informations de débogage
// //           <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
// //             <div className="flex items-start">
// //               <div className="flex-shrink-0">
// //                 <div className="animate-bounce">
// //                   <span className="text-yellow-500">⚠️</span>
// //                 </div>
// //               </div>
// //               <div className="ml-3">
// //                 <h4 className="text-sm font-medium text-yellow-800">Information importante</h4>
// //                 <p className="text-xs text-yellow-700 mt-1">
// //                   Assurez-vous que le serveur Django est démarré sur <strong>https://gestion-ressource-informatique.onrender.com</strong>
// //                 </p>
// //                 <p className="text-xs text-yellow-700 mt-1">
// //                   Pour tester, utilisez un compte démo: <strong>admin.dren</strong> / <strong>admin2024</strong>
// //                 </p>
// //               </div>
// //             </div>
// //           </div> */}

// //           {/* Démo rapide */}
// //           {/* <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
// //             <h4 className="text-sm font-medium text-blue-800 mb-2">Comptes de démonstration</h4>
// //             <div className="grid grid-cols-2 gap-2 text-xs">
// //               <div className="bg-white p-2 rounded border">
// //                 <div className="font-semibold text-blue-700">Admin</div>
// //                 <div className="font-mono">admin.dren</div>
// //                 <div className="font-mono text-gray-600">admin2024</div>
// //               </div>
// //               <div className="bg-white p-2 rounded border">
// //                 <div className="font-semibold text-green-700">Technicien</div>
// //                 <div className="font-mono">technicien.it</div>
// //                 <div className="font-mono text-gray-600">tech2024</div>
// //               </div>
// //             </div>
// //           </div> */}
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;

// // // src/components/Login.jsx - VERSION AVEC EXPORT PAR DÉFAUT
// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { toast } from 'react-toastify';

// // const Login = () => {
// //   const [username, setUsername] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
    
// //     try {
// //       await login(username, password);
// //       toast.success('Connexion réussie !');
// //       navigate('/dashboard');
// //     } catch (error) {
// //       toast.error('Identifiants incorrects');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
// //       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
// //         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
// //           Connexion DREN AA
// //         </h2>
// //         <form onSubmit={handleSubmit}>
// //           <div className="mb-4">
// //             <label className="block text-gray-700 mb-2">Nom d'utilisateur</label>
// //             <input
// //               type="text"
// //               value={username}
// //               onChange={(e) => setUsername(e.target.value)}
// //               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               placeholder="Entrez votre nom d'utilisateur"
// //               required
// //             />
// //           </div>
// //           <div className="mb-6">
// //             <label className="block text-gray-700 mb-2">Mot de passe</label>
// //             <input
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               placeholder="Entrez votre mot de passe"
// //               required
// //             />
// //           </div>
// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
// //           >
// //             {loading ? 'Connexion...' : 'Se connecter'}
// //           </button>
// //         </form>
// //         <p className="text-center text-gray-600 mt-4">
// //           Pas de compte ?{' '}
// //           <a href="/register" className="text-blue-600 hover:underline">
// //             S'inscrire
// //           </a>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login; // <-- IMPORTANT: export par défaut




// // import React, { useState } from 'react';
// // import { 
// //   Monitor, 
// //   Lock, 
// //   User, 
// //   MapPin,
// //   Eye,
// //   EyeOff,
// //   LogIn,
// //   AlertCircle,
// //   UserPlus,
// //   Mail
// // } from 'lucide-react';
// // import { useAuth } from '../context/AuthContext';
// // import { Link } from 'react-router-dom';
// // import { useNotification } from '../context/NotificationContext';
// // import { useTheme } from '../context/ThemeContext';

// // const Login = () => {
// //   const [formData, setFormData] = useState({
// //     username: '',
// //     password: ''
// //   });
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [error, setError] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);
// //   const { login } = useAuth();
// //   const { showNotification } = useNotification();
// //   const { theme, toggleTheme } = useTheme();

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value
// //     });
// //     setError('');
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsLoading(true);
// //     setError('');

// //     if (!formData.username.trim() || !formData.password.trim()) {
// //       setError('Veuillez remplir tous les champs');
// //       setIsLoading(false);
// //       return;
// //     }

// //     if (formData.password.length < 6) {
// //       setError('Le mot de passe doit contenir au moins 6 caractères');
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       console.log('🔄 Tentative de connexion...');
// //       const success = await login(formData.username, formData.password);
      
// //       if (success) {
// //         console.log('✅ Connexion réussie, redirection...');
// //         showNotification('Connexion réussie !', 'success');
// //       } else {
// //         setError('Nom d\'utilisateur ou mot de passe incorrect');
// //       }
// //     } catch (err) {
// //       console.error('❌ Erreur de connexion:', err);
// //       setError('Erreur de connexion au serveur. Vérifiez que le serveur est démarré sur https://gestion-ressource-informatique.onrender.com');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-md w-full space-y-8">
// //         <div className="text-center">
// //           <div className="flex justify-center mb-4">
// //             <div className="bg-white p-4 rounded-full shadow-lg animate-pulse">
// //               <Monitor className="h-12 w-12 text-blue-600" />
// //             </div>
// //           </div>
// //           <div className="flex items-center justify-center mb-2">
// //             <MapPin className="h-5 w-5 text-blue-200 mr-2" />
// //             <span className="text-blue-200 text-sm font-medium">Toliara, Madagascar</span>
// //           </div>
// //           <h2 className="text-3xl font-bold text-white mb-2">
// //             DREN Antsimo Andrefana
// //           </h2>
// //           <p className="text-blue-200 text-lg font-medium mb-1">
// //             Gestion des Ressources Informatiques
// //           </p>
// //           <p className="text-blue-300 text-sm">
// //             Direction Régionale de l'Éducation Nationale
// //           </p>
// //         </div>

// //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //           <div className="card bg-white/95 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:shadow-2xl">
// //             <div className="card-body space-y-4 p-6">
// //               <h3 className="text-xl font-bold text-gray-800 text-center flex items-center justify-center">
// //                 <LogIn className="h-5 w-5 mr-2" />
// //                 Connexion au système
// //               </h3>
              
// //               <div>
// //                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
// //                   <User className="inline h-4 w-4 mr-1" />
// //                   Nom d'utilisateur *
// //                 </label>
// //                 <div className="relative">
// //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                     <User className="h-5 w-5 text-gray-400" />
// //                   </div>
// //                   <input
// //                     id="username"
// //                     name="username"
// //                     type="text"
// //                     required
// //                     value={formData.username}
// //                     onChange={handleChange}
// //                     className="input input-bordered w-full pl-10 bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
// //                     placeholder="Entrez votre nom d'utilisateur"
// //                     disabled={isLoading}
// //                     autoComplete="username"
// //                   />
// //                 </div>
// //               </div>
              
// //               <div>
// //                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
// //                   <Lock className="inline h-4 w-4 mr-1" />
// //                   Mot de passe *
// //                 </label>
// //                 <div className="relative">
// //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                     <Lock className="h-5 w-5 text-gray-400" />
// //                   </div>
// //                   <input
// //                     id="password"
// //                     name="password"
// //                     type={showPassword ? "text" : "password"}
// //                     required
// //                     value={formData.password}
// //                     onChange={handleChange}
// //                     className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
// //                     placeholder="Entrez votre mot de passe"
// //                     disabled={isLoading}
// //                     autoComplete="current-password"
// //                   />
// //                   <button
// //                     type="button"
// //                     className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
// //                   >
// //                     {showPassword ? (
// //                       <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800" />
// //                     ) : (
// //                       <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800" />
// //                     )}
// //                   </button>
// //                 </div>
// //                 <div className="mt-1 text-xs text-gray-500 flex items-center">
// //                   <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
// //                   Minimum 6 caractères
// //                 </div>
// //               </div>

// //               {error && (
// //                 <div className="alert alert-error bg-red-50 border-2 border-red-200 p-3 animate-shake">
// //                   <div className="flex items-center">
// //                     <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
// //                     <span className="text-red-800 text-sm font-medium">{error}</span>
// //                   </div>
// //                 </div>
// //               )}

// //               <button
// //                 type="submit"
// //                 disabled={isLoading}
// //                 className="w-full btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
// //               >
// //                 {isLoading ? (
// //                   <>
// //                     <span className="loading loading-spinner loading-sm mr-2"></span>
// //                     Connexion en cours...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <LogIn className="w-5 h-5 mr-2" />
// //                     Se connecter
// //                   </>
// //                 )}
// //               </button>

// //               <div className="text-center pt-4 border-t border-gray-200">
// //                 <p className="text-sm text-gray-600 mb-2">
// //                   Pas encore de compte ?
// //                 </p>
// //                 <Link
// //                   to="/register"
// //                   className="inline-flex items-center justify-center w-full btn btn-outline btn-primary border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600 transition-all duration-200 font-medium py-3"
// //                 >
// //                   <UserPlus className="h-4 w-4 mr-2" />
// //                   Créer un nouveau compte
// //                 </Link>
                
// //                 <div className="mt-4 text-xs text-gray-500">
// //                   <p className="flex items-center justify-center">
// //                     <Mail className="h-3 w-3 mr-1" />
// //                     Contact: support@dren-antsimoandrefana.mg
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;




























// // src/components/Login.jsx - VERSION STYLISÉE
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';
// import { 
//   Monitor, 
//   Lock, 
//   User, 
//   MapPin,
//   Eye,
//   EyeOff,
//   LogIn,
//   AlertCircle,
//   UserPlus,
//   Mail
// } from 'lucide-react';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     // Validation
//     if (!formData.username.trim() || !formData.password.trim()) {
//       setError('Veuillez remplir tous les champs');
//       setIsLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Le mot de passe doit contenir au moins 6 caractères');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('🔄 Tentative de connexion...');
//       const success = await login(formData.username, formData.password);
      
//       if (success) {
//         console.log('✅ Connexion réussie, redirection...');
//         toast.success('Connexion réussie !');
//         navigate('/dashboard');
//       } else {
//         setError('Nom d\'utilisateur ou mot de passe incorrect');
//         toast.error('Identifiants incorrects');
//       }
//     } catch (err) {
//       console.error('❌ Erreur de connexion:', err);
//       setError('Erreur de connexion au serveur');
//       toast.error('Erreur de connexion');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         {/* En-tête */}
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="bg-white p-4 rounded-full shadow-lg animate-pulse">
//               <Monitor className="h-12 w-12 text-blue-600" />
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
//             Gestion des Ressources Informatiques
//           </p>
//           <p className="text-blue-300 text-sm">
//             Direction Régionale de l'Éducation Nationale
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="card bg-white/95 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:shadow-2xl">
//             <div className="card-body space-y-4 p-6">
//               <h3 className="text-xl font-bold text-gray-800 text-center flex items-center justify-center">
//                 <LogIn className="h-5 w-5 mr-2" />
//                 Connexion au système
//               </h3>
              
//               {/* Champ nom d'utilisateur */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                   <User className="inline h-4 w-4 mr-1" />
//                   Nom d'utilisateur *
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     required
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="input input-bordered w-full pl-10 bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
//                     placeholder="Entrez votre nom d'utilisateur"
//                     disabled={isLoading}
//                     autoComplete="username"
//                   />
//                 </div>
//               </div>
              
//               {/* Champ mot de passe avec bouton masquer/afficher */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   <Lock className="inline h-4 w-4 mr-1" />
//                   Mot de passe *
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
//                     placeholder="Entrez votre mot de passe"
//                     disabled={isLoading}
//                     autoComplete="current-password"
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
//                     onClick={() => setShowPassword(!showPassword)}
//                     title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800" />
//                     )}
//                   </button>
//                 </div>
//                 <div className="mt-1 text-xs text-gray-500 flex items-center">
//                   <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
//                   Minimum 6 caractères
//                 </div>
//               </div>

//               {/* Message d'erreur */}
//               {error && (
//                 <div className="alert alert-error bg-red-50 border-2 border-red-200 p-3 animate-shake">
//                   <div className="flex items-center">
//                     <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
//                     <span className="text-red-800 text-sm font-medium">{error}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Bouton de connexion */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="loading loading-spinner loading-sm mr-2"></span>
//                     Connexion en cours...
//                   </>
//                 ) : (
//                   <>
//                     <LogIn className="w-5 h-5 mr-2" />
//                     Se connecter
//                   </>
//                 )}
//               </button>

//               {/* Lien vers inscription */}
//               <div className="text-center pt-4 border-t border-gray-200">
//                 <p className="text-sm text-gray-600 mb-2">
//                   Pas encore de compte ?
//                 </p>
//                 <Link
//                   to="/register"
//                   className="inline-flex items-center justify-center w-full btn btn-outline btn-primary border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600 transition-all duration-200 font-medium py-3"
//                 >
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Créer un nouveau compte
//                 </Link>
                
//                 <div className="mt-4 text-xs text-gray-500">
//                   <p className="flex items-center justify-center">
//                     <Mail className="h-3 w-3 mr-1" />
//                     Contact: support@dren-antsimoandrefana.mg
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section de démo (optionnelle) */}
//           {/*  */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;





// // src/components/Login.jsx - VERSION AVEC LOGO DREN
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';
// import { 
//   Lock, 
//   User, 
//   MapPin,
//   Eye,
//   EyeOff,
//   LogIn,
//   AlertCircle,
//   UserPlus,
//   Mail
// } from 'lucide-react';

// // Import du logo DREN
// // import logoDren from '../assets/images/logo-dren.png';
// // import logoDren from '../assets/images/logo-dren.jpeg';
// import logoDren from '../assets/images/logo.png';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     // Validation
//     if (!formData.username.trim() || !formData.password.trim()) {
//       setError('Veuillez remplir tous les champs');
//       setIsLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Le mot de passe doit contenir au moins 6 caractères');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('🔄 Tentative de connexion...');
//       const success = await login(formData.username, formData.password);
      
//       if (success) {
//         console.log('✅ Connexion réussie, redirection...');
//         toast.success('Connexion réussie !');
//         navigate('/dashboard');
//       } else {
//         setError('Nom d\'utilisateur ou mot de passe incorrect');
//         toast.error('Identifiants incorrects');
//       }
//     } catch (err) {
//       console.error('❌ Erreur de connexion:', err);
//       setError('Erreur de connexion au serveur');
//       toast.error('Erreur de connexion');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         {/* En-tête avec logo DREN */}
//         <div className="text-center">
//           <div className="flex justify-center mb-3">
//             <div className="bg-white p-0 rounded-full shadow-lg animate-pulse border-0 border-white">
//               <div className="w-20 h-21 rounded-full overflow-hidden flex items-center justify-center">
//                 <img 
//                   src={logoDren} 
//                   alt="Logo DREN Antsimo Andrefana" 
//                   className="w-full h-full object-contain"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23006db6' rx='50'/%3E%3Ctext x='50' y='50' font-size='24' fill='white' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-weight='bold'%3EDREN%3C/text%3E%3C/svg%3E";
//                   }}
//                 />
//               </div>
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
//             Gestion des Ressources Informatiques
//           </p>
//           <p className="text-blue-300 text-sm">
//             Direction Régionale de l'Éducation Nationale
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="card bg-white/95 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:shadow-2xl">
//             <div className="card-body space-y-4 p-6">
//               <h3 className="text-xl font-bold text-gray-800 text-center flex items-center justify-center">
//                 <LogIn className="h-5 w-5 mr-2" />
//                 Connexion au système
//               </h3>
              
//               {/* Champ nom d'utilisateur */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                   <User className="inline h-4 w-4 mr-1" />
//                   Nom d'utilisateur *
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     required
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="input input-bordered w-full pl-10 bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
//                     placeholder="Entrez votre nom d'utilisateur"
//                     disabled={isLoading}
//                     autoComplete="username"
//                   />
//                 </div>
//               </div>
              
//               {/* Champ mot de passe avec bouton masquer/afficher */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   <Lock className="inline h-4 w-4 mr-1" />
//                   Mot de passe *
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
//                     placeholder="Entrez votre mot de passe"
//                     disabled={isLoading}
//                     autoComplete="current-password"
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
//                     onClick={() => setShowPassword(!showPassword)}
//                     title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800" />
//                     )}
//                   </button>
//                 </div>
//                 <div className="mt-1 text-xs text-gray-500 flex items-center">
//                   <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
//                   Minimum 6 caractères
//                 </div>
//               </div>

//               {/* Message d'erreur */}
//               {error && (
//                 <div className="alert alert-error bg-red-50 border-2 border-red-200 p-3 animate-shake">
//                   <div className="flex items-center">
//                     <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
//                     <span className="text-red-800 text-sm font-medium">{error}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Bouton de connexion */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="loading loading-spinner loading-sm mr-2"></span>
//                     Connexion en cours...
//                   </>
//                 ) : (
//                   <>
//                     <LogIn className="w-5 h-5 mr-2" />
//                     Se connecter
//                   </>
//                 )}
//               </button>

//               {/* Lien vers inscription */}
//               <div className="text-center pt-4 border-t border-gray-200">
//                 <p className="text-sm text-gray-600 mb-2">
//                   Pas encore de compte ?
//                 </p>
//                 <Link
//                   to="/register"
//                   className="inline-flex items-center justify-center w-full btn btn-outline btn-primary border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600 transition-all duration-200 font-medium py-3"
//                 >
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Créer un nouveau compte
//                 </Link>
                
//                 <div className="mt-4 text-xs text-gray-500">
//                   <p className="flex items-center justify-center">
//                     <Mail className="h-3 w-3 mr-1" />
//                     Contact: support@dren-antsimoandrefana.mg
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section informations */}
//           <div className="bg-blue-50/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg p-4">
//             <div className="flex items-start">
//               <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <h4 className="text-sm font-medium text-blue-800 mb-2">
//                   Informations importantes
//                 </h4>
//                 <ul className="text-xs text-blue-700 space-y-1">
//                   <li className="flex items-start">
//                     <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
//                     Assurez-vous d'utiliser votre identifiant DREN officiel
//                   </li>
//                   <li className="flex items-start">
//                     <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
//                     En cas d'oubli de mot de passe, contactez l'administrateur système
//                   </li>
//                   <li className="flex items-start">
//                     <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
//                     Accès réservé au personnel autorisé de la DREN AA
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;






// // src/components/Login.jsx - VERSION AVEC LOGO BIEN ENCADRÉ
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';
// import { 
//   Lock, 
//   User, 
//   MapPin,
//   Eye,
//   EyeOff,
//   LogIn,
//   AlertCircle,
//   UserPlus,
//   Mail
// } from 'lucide-react';

// // Import du logo DREN
// import logoDren from '../assets/images/logo-dren.png';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     // Validation
//     if (!formData.username.trim() || !formData.password.trim()) {
//       setError('Veuillez remplir tous les champs');
//       setIsLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Le mot de passe doit contenir au moins 6 caractères');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('🔄 Tentative de connexion...');
//       const success = await login(formData.username, formData.password);
      
//       if (success) {
//         console.log('✅ Connexion réussie, redirection...');
//         toast.success('Connexion réussie !');
//         navigate('/dashboard');
//       } else {
//         setError('Nom d\'utilisateur ou mot de passe incorrect');
//         toast.error('Identifiants incorrects');
//       }
//     } catch (err) {
//       console.error('❌ Erreur de connexion:', err);
//       setError('Erreur de connexion au serveur');
//       toast.error('Erreur de connexion');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         {/* En-tête avec logo DREN bien encadré */}
//         <div className="text-center">
//           <div className="flex justify-center mb-6">
//             {/* Cadre du logo avec bordure et ombre */}
//             <div className="relative group">
//               {/* Effet de halo externe */}
//               <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-300"></div>
              
//               {/* Cadre principal */}
//               <div className="relative bg-gradient-to-br from-white to-blue-50 p-2 rounded-full shadow-xl border- border-white animate-pulse">
//                 {/* Conteneur du logo */}
//                 <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-inner">
//                   <img 
//                     src={logoDren} 
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23006db6' rx='50'/%3E%3Ctext x='50' y='50' font-size='24' fill='white' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-weight='bold'%3EDREN%3C/text%3E%3Ctext x='50' y='75' font-size='14' fill='white' text-anchor='middle' font-family='Arial, sans-serif'%3EAA%3C/text%3E%3C/svg%3E";
//                     }}
//                   />
//                 </div>
                
//                 {/* Indicateur de chargement (optionnel) */}
//                 {isLoading && (
//                   <div className="absolute inset-0 rounded-full bg-white/50 flex items-center justify-center">
//                     <div className="loading loading-spinner loading-md text-blue-600"></div>
//                   </div>
//                 )}
//               </div>
              
//               {/* Étoile décorative (optionnelle) */}
//               <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
//                 <span className="text-xs font-bold text-blue-900">★</span>
//               </div>
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
//             Gestion des Ressources Informatiques
//           </p>
//           <p className="text-blue-300 text-sm">
//             Direction Régionale de l'Éducation Nationale
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="card bg-white/95 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:shadow-2xl">
//             <div className="card-body space-y-4 p-6">
//               <h3 className="text-xl font-bold text-gray-800 text-center flex items-center justify-center">
//                 <LogIn className="h-5 w-5 mr-2" />
//                 Connexion au système
//               </h3>
              
//               {/* Champ nom d'utilisateur */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                   <User className="inline h-4 w-4 mr-1" />
//                   Nom d'utilisateur *
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     required
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="input input-bordered w-full pl-10 bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
//                     placeholder="Entrez votre nom d'utilisateur"
//                     disabled={isLoading}
//                     autoComplete="username"
//                   />
//                 </div>
//               </div>
              
//               {/* Champ mot de passe avec bouton masquer/afficher */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   <Lock className="inline h-4 w-4 mr-1" />
//                   Mot de passe *
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
//                     placeholder="Entrez votre mot de passe"
//                     disabled={isLoading}
//                     autoComplete="current-password"
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
//                     onClick={() => setShowPassword(!showPassword)}
//                     title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800" />
//                     )}
//                   </button>
//                 </div>
//                 <div className="mt-1 text-xs text-gray-500 flex items-center">
//                   <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
//                   Minimum 6 caractères
//                 </div>
//               </div>

//               {/* Message d'erreur */}
//               {error && (
//                 <div className="alert alert-error bg-red-50 border-2 border-red-200 p-3 animate-shake">
//                   <div className="flex items-center">
//                     <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
//                     <span className="text-red-800 text-sm font-medium">{error}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Bouton de connexion */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="loading loading-spinner loading-sm mr-2"></span>
//                     Connexion en cours...
//                   </>
//                 ) : (
//                   <>
//                     <LogIn className="w-5 h-5 mr-2" />
//                     Se connecter
//                   </>
//                 )}
//               </button>

//               {/* Lien vers inscription */}
//               <div className="text-center pt-4 border-t border-gray-200">
//                 <p className="text-sm text-gray-600 mb-2">
//                   Pas encore de compte ?
//                 </p>
//                 <Link
//                   to="/register"
//                   className="inline-flex items-center justify-center w-full btn btn-outline btn-primary border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600 transition-all duration-200 font-medium py-3"
//                 >
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Créer un nouveau compte
//                 </Link>
                
//                 <div className="mt-4 text-xs text-gray-500">
//                   <p className="flex items-center justify-center">
//                     <Mail className="h-3 w-3 mr-1" />
//                     Contact: support@dren-antsimoandrefana.mg
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section informations */}
//           <div className="bg-blue-50/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg p-4">
//             <div className="flex items-start">
//               <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <h4 className="text-sm font-medium text-blue-800 mb-2">
//                   Informations importantes
//                 </h4>
//                 <ul className="text-xs text-blue-700 space-y-1">
//                   <li className="flex items-start">
//                     <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
//                     Assurez-vous d'utiliser votre identifiant DREN officiel
//                   </li>
//                   <li className="flex items-start">
//                     <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
//                     En cas d'oubli de mot de passe, contactez l'administrateur système
//                   </li>
//                   <li className="flex items-start">
//                     <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
//                     Accès réservé au personnel autorisé de la DREN AA
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;






// src/components/Login.jsx - VERSION OPTIMISÉE AVEC AUTO-LOGGER
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Lock, 
  User, 
  MapPin,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  UserPlus,
  Mail,
  Shield,
  CheckCircle
} from 'lucide-react';

// Import du logo DREN
import logoDren from '../assets/images/logo.png';

// ==================== AUTO-LOGGER ====================
// Fonction de logging simplifiée pour le login
const logLoginAction = (action, details, username = 'Guest') => {
  const timestamp = new Date().toISOString();
  
  // Log dans console
  console.log(`🔐 [LOGIN-LOGGER] ${action} - ${details}`, { timestamp, username });
  
  // Stocker dans localStorage pour l'historique
  if (window.ActionLogger) {
    window.ActionLogger.custom(
      action, 
      'Authentification', 
      details, 
      username, 
      { timestamp, userAgent: navigator.userAgent }
    );
  }
  
  // Stocker aussi localement pour accès rapide
  const loginLogs = JSON.parse(localStorage.getItem('login_logs') || '[]');
  loginLogs.push({
    action,
    details,
    username,
    timestamp,
    module: 'Authentification'
  });
  
  // Garder seulement les 100 derniers logs
  if (loginLogs.length > 100) {
    loginLogs.splice(0, loginLogs.length - 100);
  }
  
  localStorage.setItem('login_logs', JSON.stringify(loginLogs));
};
// ==================== FIN AUTO-LOGGER ====================

// Système de notification optimisé
const showQuickNotification = (type, message) => {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-[9999] max-w-sm w-full p-3 rounded-lg shadow-lg animate-slideInRight ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  
  // Style d'animation inline
  notification.style.cssText = `
    animation: slideInRight 0.2s ease-out;
  `;
  
  // Ajouter le style CSS une seule fois
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="text-xl">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      </div>
      <div class="flex-1 text-sm font-medium">${message}</div>
      <button onclick="this.parentElement.parentElement.remove()" class="p-1 hover:bg-white/20 rounded">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-suppression rapide
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'fadeOut 0.2s ease-out';
      setTimeout(() => {
        if (notification.parentElement) {
          document.body.removeChild(notification);
        }
      }, 200);
    }
  }, 3000);
};

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Initialisation rapide
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
      logLoginAction('CHARGEMENT', 'Page login initialisée', 'System');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation rapide côté client
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Veuillez remplir tous les champs');
      showQuickNotification('error', 'Veuillez remplir tous les champs');
      setIsLoading(false);
      
      // 🔥 AUTO-LOGGER: Tentative de connexion incomplète
      logLoginAction('TENTATIVE', 'Champs manquants', formData.username || 'Guest');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      showQuickNotification('error', 'Mot de passe trop court');
      setIsLoading(false);
      
      // 🔥 AUTO-LOGGER: Mot de passe invalide
      logLoginAction('TENTATIVE', 'Mot de passe invalide', formData.username);
      return;
    }

    // 🔥 AUTO-LOGGER: Début de la tentative de connexion
    logLoginAction('DÉBUT', 'Tentative de connexion en cours', formData.username);

    try {
      console.time('⏱️ Temps connexion');
      const success = await login(formData.username, formData.password);
      console.timeEnd('⏱️ Temps connexion');
      
      if (success) {
        // 🔥 AUTO-LOGGER: Connexion réussie
        logLoginAction('SUCCÈS', 'Connexion réussie', formData.username);
        
        showQuickNotification('success', 'Connexion réussie !');
        
        // Redirection IMMÉDIATE sans délai
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 50); // Délai minimal pour laisser le state se mettre à jour
        
      } else {
        // 🔥 AUTO-LOGGER: Échec de connexion
        logLoginAction('ÉCHEC', 'Identifiants incorrects', formData.username);
        
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        showQuickNotification('error', 'Identifiants incorrects');
      }
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      
      // 🔥 AUTO-LOGGER: Erreur serveur
      logLoginAction('ERREUR', `Erreur serveur: ${err.message}`, formData.username);
      
      setError('Erreur de connexion au serveur');
      showQuickNotification('error', 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Formulaire optimisé pour le chargement rapide
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4"></div>
          </div>
          <div className="flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-white mr-3"></span>
            <p className="text-white text-lg font-medium">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fadeIn">
        {/* En-tête avec logo DREN */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white p-1 rounded-full shadow-lg border-4 border-white">
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-white">
                <img 
                  src={logoDren} 
                  alt="Logo DREN Antsimo Andrefana" 
                  className="w-full h-full object-contain"
                  loading="eager"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23006db6' rx='50'/%3E%3Ctext x='50' y='50' font-size='24' fill='white' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-weight='bold'%3EDREN%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
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
            Gestion des Ressources Informatiques
          </p>
          <p className="text-blue-300 text-sm">
            Direction Régionale de l'Éducation Nationale
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card bg-white/95 backdrop-blur-sm shadow-2xl">
            <div className="card-body space-y-4 p-6">
              <h3 className="text-xl font-bold text-gray-800 text-center flex items-center justify-center">
                <LogIn className="h-5 w-5 mr-2" />
                Connexion au système
              </h3>
              
              {/* Champ nom d'utilisateur */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
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
                    className="input input-bordered w-full pl-10 bg-white border-2 border-gray-300 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                    placeholder="Entrez votre nom d'utilisateur"
                    disabled={isLoading}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Champ mot de passe avec bouton masquer/afficher */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-1" />
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
                    className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 text-gray-900 placeholder:text-gray-400 outline-none"
                    placeholder="Entrez votre mot de passe"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Minimum 6 caractères
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="alert alert-error bg-red-50 border-2 border-red-200 p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-red-800 text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold shadow-lg"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Se connecter
                  </>
                )}
              </button>

              {/* Lien vers inscription */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Pas encore de compte ?
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center w-full btn btn-outline btn-primary border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600 font-medium py-3"
                  onClick={() => logLoginAction('NAVIGATION', 'Clic sur "Créer un compte"', 'Guest')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer un nouveau compte
                </Link>
                
                <div className="mt-4 text-xs text-gray-500">
                  <p className="flex items-center justify-center">
                    <Mail className="h-3 w-3 mr-1" />
                    Contact: support@dren-antsimoandrefana.mg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section informations */}
          <div className="bg-blue-50/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  🔒 Sécurité et Accès
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Connexion sécurisée HTTPS
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Toutes les actions sont journalisées
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Accès réservé au personnel DREN AA
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Ajout des styles d'animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Optimisation des performances */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Désactiver les animations si l'utilisateur préfère réduire le mouvement */
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeIn {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;