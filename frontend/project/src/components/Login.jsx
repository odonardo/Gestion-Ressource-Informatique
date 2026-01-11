// // Login.jsx - VERSION CORRIGÉE AVEC TOUTES LES AMÉLIORATIONS

// import React, { useState } from 'react';
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
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError(''); // Clear error when user starts typing
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
//         // La redirection est gérée par le ProtectedRoute dans App.jsx
//       } else {
//         setError('Nom d\'utilisateur ou mot de passe incorrect');
//       }
//     } catch (err) {
//       console.error('❌ Erreur de connexion:', err);
//       setError('Erreur de connexion au serveur. Vérifiez que le serveur est démarré sur https://gestion-ressources-informatiques.onrender.com');
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
              
//               {/* Champ nom d'utilisateur - CORRIGÉ */}
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
//                   >
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Créer un nouveau compte
//                 </Link>
//                 {/* <Link
//                   to="/register"
//   className="inline-flex items-center justify-center w-full btn bg-gradient-to-r from-white to-blue-50 text-blue-600 border-2 border-blue-400 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:border-blue-500 hover:shadow-lg transition-all duration-200 font-semibold py-3"
// >
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Créer un nouveau compte
//                 </Link> */}
                
//                 <div className="mt-4 text-xs text-gray-500">
//                   <p className="flex items-center justify-center">
//                     <Mail className="h-3 w-3 mr-1" />
//                     Contact: support@dren-antsimoandrefana.mg
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Informations de débogage
//           <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <div className="animate-bounce">
//                   <span className="text-yellow-500">⚠️</span>
//                 </div>
//               </div>
//               <div className="ml-3">
//                 <h4 className="text-sm font-medium text-yellow-800">Information importante</h4>
//                 <p className="text-xs text-yellow-700 mt-1">
//                   Assurez-vous que le serveur Django est démarré sur <strong>https://gestion-ressources-informatiques.onrender.com</strong>
//                 </p>
//                 <p className="text-xs text-yellow-700 mt-1">
//                   Pour tester, utilisez un compte démo: <strong>admin.dren</strong> / <strong>admin2024</strong>
//                 </p>
//               </div>
//             </div>
//           </div> */}

//           {/* Démo rapide */}
//           {/* <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
//             <h4 className="text-sm font-medium text-blue-800 mb-2">Comptes de démonstration</h4>
//             <div className="grid grid-cols-2 gap-2 text-xs">
//               <div className="bg-white p-2 rounded border">
//                 <div className="font-semibold text-blue-700">Admin</div>
//                 <div className="font-mono">admin.dren</div>
//                 <div className="font-mono text-gray-600">admin2024</div>
//               </div>
//               <div className="bg-white p-2 rounded border">
//                 <div className="font-semibold text-green-700">Technicien</div>
//                 <div className="font-mono">technicien.it</div>
//                 <div className="font-mono text-gray-600">tech2024</div>
//               </div>
//             </div>
//           </div> */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;



// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  Bug, 
  Monitor,
  MapPin,
  Mail,
  Shield
} from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [testResults, setTestResults] = useState([]);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Initialisation et logs de debug
  useEffect(() => {
    console.log('🚀 Initialisation Login Component');
    console.log('🔧 Variables d\'environnement:', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      MODE: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV
    });
    
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    console.log('📦 Local Storage:', {
      token: token ? '✅ PRÉSENT' : '❌ ABSENT',
      userData: userData ? '✅ PRÉSENT' : '❌ ABSENT'
    });
    
    setDebugInfo(`API URL: ${import.meta.env.VITE_API_URL || 'Non définie'}`);
  }, []);

  // Tester tous les endpoints possibles
  const testAllEndpoints = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    const API_BASE = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';
    const endpoints = [
      { path: '/api-token-auth/', method: 'POST', name: 'Django REST Token' },
      { path: '/login/', method: 'POST', name: 'Login standard' },
      { path: '/api/login/', method: 'POST', name: 'API Login' },
      { path: '/auth/login/', method: 'POST', name: 'Auth Login' },
      { path: '/api/token/', method: 'POST', name: 'Simple JWT' },
      { path: '/', method: 'GET', name: 'Root endpoint' },
      { path: '/api/', method: 'GET', name: 'API Root' }
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const url = `${API_BASE}${endpoint.path}`;
        const testData = endpoint.method === 'POST' ? {
          username: 'admin',
          password: 'admin2024'
        } : null;
        
        console.log(`🧪 Test ${endpoint.name}: ${url}`);
        
        const startTime = Date.now();
        const response = await axios({
          method: endpoint.method,
          url,
          data: testData,
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const responseTime = Date.now() - startTime;
        
        const result = {
          name: endpoint.name,
          url,
          status: response.status,
          time: responseTime,
          success: true,
          cors: response.headers['access-control-allow-origin'] || 'Non',
          message: `✅ ${response.status} - ${responseTime}ms - CORS: ${response.headers['access-control-allow-origin'] ? '✅' : '❌'}`
        };
        
        results.push(result);
        console.log(`✅ ${endpoint.name}: ${response.status} ${responseTime}ms`);
        
      } catch (error) {
        const result = {
          name: endpoint.name,
          url: `${API_BASE}${endpoint.path}`,
          status: error.response?.status || 'ERROR',
          time: 0,
          success: false,
          cors: 'Non',
          message: `❌ ${error.response?.status || 'Erreur réseau'} - ${error.message}`
        };
        
        results.push(result);
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
    
    setTestResults(results);
    
    // Afficher un résumé
    const successCount = results.filter(r => r.success).length;
    const corsCount = results.filter(r => r.cors && r.cors !== 'Non').length;
    
    setDebugInfo(`
🔍 Test API complet - ${new Date().toLocaleTimeString()}
✅ Endpoints fonctionnels: ${successCount}/${endpoints.length}
🛡️ CORS configuré: ${corsCount}/${endpoints.length}
📍 URL de base: ${API_BASE}
📊 Détails:
${results.map(r => `  ${r.success ? '✅' : '❌'} ${r.name}: ${r.message}`).join('\n')}
    `);
    
    setIsLoading(false);
  };

  // Tester un login direct
  const testDirectLogin = async () => {
    setIsLoading(true);
    setError('');
    setDebugInfo('🧪 Test de login direct en cours...');
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://gestion-ressource-informatique.onrender.com';
      const testUsername = username || 'admin';
      const testPassword = password || 'admin2024';
      
      console.log('🧪 Login direct avec:', testUsername);
      
      // Essayer l'endpoint Django REST
      const response = await axios.post(`${API_BASE}/api-token-auth/`, {
        username: testUsername,
        password: testPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        setDebugInfo(`
✅ LOGIN DIRECT RÉUSSI!
🔑 Token reçu: OUI
👤 Utilisateur: ${response.data.user?.username || testUsername}
🎯 Redirection automatique...
        `);
        
        // Redirection automatique après 2 secondes
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
        
      } else {
        setDebugInfo('⚠️ Login réussi mais pas de token dans la réponse');
      }
      
    } catch (error) {
      console.error('❌ Erreur login direct:', error);
      
      let errorMessage = `Erreur ${error.response?.status || 'réseau'}: `;
      
      if (error.response?.status === 400) {
        errorMessage += 'Requête invalide';
      } else if (error.response?.status === 401) {
        errorMessage += 'Identifiants incorrects';
      } else if (error.response?.status === 404) {
        errorMessage += 'Endpoint non trouvé';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += 'Timeout - Serveur trop lent';
      } else if (error.message.includes('Network Error')) {
        errorMessage += 'Erreur réseau - CORS probablement mal configuré';
      } else {
        errorMessage += error.message;
      }
      
      setDebugInfo(`❌ ÉCHEC LOGIN DIRECT:\n${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler pour le formulaire de login normal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebugInfo('');
    
    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('🔄 Tentative de connexion via AuthContext...');
      const success = await login(username, password);
      
      if (success) {
        console.log('✅ Connexion réussie via AuthContext');
        navigate(from, { replace: true });
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (err) {
      console.error('❌ Erreur login:', err);
      setError(err.message || 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full border border-white/20">
                <Monitor className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Gestion des Ressources Informatiques
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white/80">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>DREN Antsimo Andrefana - Toliara, Madagascar</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Système sécurisé d'authentification</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Carte de login */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    <LogIn className="inline h-6 w-6 mr-2" />
                    Connexion au système
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowDebug(!showDebug)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Bug className="h-4 w-4" />
                    {showDebug ? 'Masquer debug' : 'Debug'}
                  </button>
                </div>

                {/* Section debug */}
                {showDebug && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <Bug className="h-5 w-5 mr-2" />
                      Panneau de diagnostic
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={testAllEndpoints}
                        disabled={isLoading}
                        className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        🧪 Tester tous les endpoints
                      </button>
                      
                      <button
                        onClick={testDirectLogin}
                        disabled={isLoading}
                        className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        🔑 Tester login direct
                      </button>
                    </div>
                    
                    {debugInfo && (
                      <div className="mt-4">
                        <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-60">
                          {debugInfo}
                        </pre>
                      </div>
                    )}
                    
                    {testResults.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-700 mb-2">Résultats des tests:</h4>
                        <div className="space-y-2">
                          {testResults.map((result, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{result.name}</span>
                                <span className={`px-2 py-1 rounded text-xs ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {result.success ? 'SUCCÈS' : 'ÉCHEC'}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {result.url}
                              </div>
                              <div className="text-xs mt-1">
                                Status: {result.status} • CORS: {result.cors} • Temps: {result.time}ms
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Formulaire de login */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-gray-400"
                      placeholder="Entrez votre nom d'utilisateur"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-gray-400 pr-12"
                        placeholder="Entrez votre mot de passe"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Minimum 6 caractères • Recommandé: majuscules, minuscules, chiffres
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-red-800">Erreur de connexion</h4>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        Se connecter au système
                      </>
                    )}
                  </button>
                </form>

                {/* Informations utiles */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Mail className="h-4 w-4" />
                      <span>Support: it-support@dren-aa.mg</span>
                    </div>
                    <p className="text-xs">
                      <strong>Pour tester:</strong> admin / admin2024 • 
                      <strong> URL API:</strong> {import.meta.env.VITE_API_URL || 'Non définie'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panneau d'information */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl p-8 text-white h-full">
                <h3 className="text-2xl font-bold mb-6">Instructions importantes</h3>
                
                <div className="space-y-6">
                  <div className="bg-white/10 p-4 rounded-xl">
                    <h4 className="font-semibold mb-2">1. Configuration requise</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-1 mr-2" />
                        Backend Django démarré
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-1 mr-2" />
                        CORS configuré pour le frontend
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-1 mr-2" />
                        Endpoint /api-token-auth/ accessible
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 p-4 rounded-xl">
                    <h4 className="font-semibold mb-2">2. Problèmes courants</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-1 mr-2" />
                        Erreur CORS: Vérifier la configuration Django CORS
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-1 mr-2" />
                        404 Not Found: Endpoint inexistant
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-1 mr-2" />
                        401 Unauthorized: Identifiants incorrects
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 p-4 rounded-xl">
                    <h4 className="font-semibold mb-2">3. Solutions rapides</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1 mr-2" />
                        Utilisez le bouton "Debug" pour diagnostiquer
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1 mr-2" />
                        Testez avec admin/admin2024
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1 mr-2" />
                        Vérifiez la console navigateur (F12)
                      </li>
                    </ul>
                  </div>

                  <div className="text-center mt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Système sécurisé</span>
                    </div>
                    <p className="text-xs mt-4 text-blue-200">
                      © 2024 DREN Antsimo Andrefana - Tous droits réservés
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;