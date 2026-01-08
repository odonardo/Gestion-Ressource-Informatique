// Login.jsx - VERSION CORRIGÉE AVEC TOUTES LES AMÉLIORATIONS

import React, { useState } from 'react';
import { 
  Monitor, 
  Lock, 
  User, 
  MapPin,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  UserPlus,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 Tentative de connexion...');
      const success = await login(formData.username, formData.password);
      
      if (success) {
        console.log('✅ Connexion réussie, redirection...');
        // La redirection est gérée par le ProtectedRoute dans App.jsx
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      setError('Erreur de connexion au serveur. Vérifiez que le serveur est démarré sur http://localhost:8000');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* En-tête */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg animate-pulse">
              <Monitor className="h-12 w-12 text-blue-600" />
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
          <div className="card bg-white/95 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:shadow-2xl">
            <div className="card-body space-y-4 p-6">
              <h3 className="text-xl font-bold text-gray-800 text-center flex items-center justify-center">
                <LogIn className="h-5 w-5 mr-2" />
                Connexion au système
              </h3>
              
              {/* Champ nom d'utilisateur - CORRIGÉ */}
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
                    className="input input-bordered w-full pl-10 bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
                    placeholder="Entrez votre nom d'utilisateur"
                    disabled={isLoading}
                    autoComplete="username"
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
                    className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder:text-gray-400 outline-none"
                    placeholder="Entrez votre mot de passe"
                    disabled={isLoading}
                    autoComplete="current-password"
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
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Minimum 6 caractères
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="alert alert-error bg-red-50 border-2 border-red-200 p-3 animate-shake">
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
                className="w-full btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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
                  className="inline-flex items-center justify-center w-full btn btn-outline btn-primary border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600 transition-all duration-200 font-medium py-3"
                  >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer un nouveau compte
                </Link>
                {/* <Link
                  to="/register"
  className="inline-flex items-center justify-center w-full btn bg-gradient-to-r from-white to-blue-50 text-blue-600 border-2 border-blue-400 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:border-blue-500 hover:shadow-lg transition-all duration-200 font-semibold py-3"
>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer un nouveau compte
                </Link> */}
                
                <div className="mt-4 text-xs text-gray-500">
                  <p className="flex items-center justify-center">
                    <Mail className="h-3 w-3 mr-1" />
                    Contact: support@dren-antsimoandrefana.mg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de débogage
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="animate-bounce">
                  <span className="text-yellow-500">⚠️</span>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">Information importante</h4>
                <p className="text-xs text-yellow-700 mt-1">
                  Assurez-vous que le serveur Django est démarré sur <strong>http://localhost:8000</strong>
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Pour tester, utilisez un compte démo: <strong>admin.dren</strong> / <strong>admin2024</strong>
                </p>
              </div>
            </div>
          </div> */}

          {/* Démo rapide */}
          {/* <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Comptes de démonstration</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border">
                <div className="font-semibold text-blue-700">Admin</div>
                <div className="font-mono">admin.dren</div>
                <div className="font-mono text-gray-600">admin2024</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-semibold text-green-700">Technicien</div>
                <div className="font-mono">technicien.it</div>
                <div className="font-mono text-gray-600">tech2024</div>
              </div>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;