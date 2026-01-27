
// // // // // // // // // // src/App.jsx
// // // // // // // // // import React from 'react';
// // // // // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // // // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // // // // // // // import { ToastContainer } from 'react-toastify';
// // // // // // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // // // // // Layout Components
// // // // // // // // // import Layout from './components/Layout';

// // // // // // // // // // Pages
// // // // // // // // // import Login from './components/Login';
// // // // // // // // // // import Login from './Pages/Register.jsx';
// // // // // // // // // import Login from './components/Register.jsx';
// // // // // // // // // import Dashboard from './pages/Dashboard';
// // // // // // // // // import Materiels from './pages/Materiels';
// // // // // // // // // import Logiciels from './pages/Logiciels';
// // // // // // // // // import Incidents from './pages/Incidents';
// // // // // // // // // import Reparations from './pages/Reparations';
// // // // // // // // // import Rapports from './pages/Rapports';
// // // // // // // // // import Users from './pages/Users';
// // // // // // // // // import Alertes from './pages/Alertes';
// // // // // // // // // import Fournisseurs from './pages/Fournisseurs';
// // // // // // // // // import InstallationsLogiciels from './pages/InstallationsLogiciels.tsx';
// // // // // // // // // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs.tsx';
// // // // // // // // // import ConfigurationReseau from './pages/ConfigurationReseau.tsx';

// // // // // // // // // const ProtectedRoute = ({ children }) => {
// // // // // // // // //   const { user, loading } = useAuth();
  
// // // // // // // // //   if (loading) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // // // //         <div className="text-center">
// // // // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // // // //           <p className="text-white">Chargement du système DREN AA...</p>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }
  
// // // // // // // // //   return user ? children : <Navigate to="/login" replace />;
// // // // // // // // // };

// // // // // // // // // const AppRoutes = () => {
// // // // // // // // //   const { user, loading } = useAuth();

// // // // // // // // //   if (loading) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // // // //         <div className="text-center">
// // // // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // // // //           <p className="text-white">Initialisation du système...</p>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   if (!user) {
// // // // // // // // //     return (
// // // // // // // // //       <>
// // // // // // // // //         <Routes>
// // // // // // // // //           <Route path="/login" element={<Login />} />
// // // // // // // // //           <Route path="/register" element={<Register />} />
// // // // // // // // //           <Route path="*" element={<Navigate to="/login" replace />} />
// // // // // // // // //         </Routes>
// // // // // // // // //         <ToastContainer position="top-right" />
// // // // // // // // //       </>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <>
// // // // // // // // //       <Layout>
// // // // // // // // //         <Routes>
// // // // // // // // //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
// // // // // // // // //           <Route path="/dashboard" element={<Dashboard />} />
// // // // // // // // //           <Route path="/materiels" element={<Materiels />} />
// // // // // // // // //           <Route path="/logiciels" element={<Logiciels />} />
// // // // // // // // //           <Route path="/incidents" element={<Incidents />} />
// // // // // // // // //           <Route path="/reparations" element={<Reparations />} />
// // // // // // // // //           <Route path="/rapports" element={<Rapports />} />
// // // // // // // // //           <Route path="/users" element={<Users />} />
// // // // // // // // //           <Route path="/alertes" element={<Alertes />} />
// // // // // // // // //           <Route path="/fournisseurs" element={<Fournisseurs />} />
// // // // // // // // //           <Route path="/installations-logiciels" element={<InstallationsLogiciels />} />
// // // // // // // // //           <Route path="/profils-utilisateurs" element={<ProfilsUtilisateurs />} />
// // // // // // // // //           <Route path="/configuration-reseau" element={<ConfigurationReseau />} />
          
// // // // // // // // //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// // // // // // // // //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// // // // // // // // //         </Routes>
// // // // // // // // //       </Layout>
// // // // // // // // //       <ToastContainer position="top-right" />
// // // // // // // // //     </>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // function App() {
// // // // // // // // //   return (
// // // // // // // // //     <AuthProvider>
// // // // // // // // //       <Router>
// // // // // // // // //         <div className="min-h-screen bg-base-100">
// // // // // // // // //           <AppRoutes />
// // // // // // // // //         </div>
// // // // // // // // //       </Router>
// // // // // // // // //     </AuthProvider>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // export default App;





// // // // // // // // // // src/App.jsx
// // // // // // // // // import React from 'react';
// // // // // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // // // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // // // // // // // import { ToastContainer } from 'react-toastify';
// // // // // // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // // // // // Layout Components
// // // // // // // // // import Layout from './components/Layout';

// // // // // // // // // // Pages
// // // // // // // // // import Login from './components/Login';
// // // // // // // // // import Register from './components/Register';
// // // // // // // // // import Dashboard from './pages/Dashboard';
// // // // // // // // // import Materiels from './pages/Materiels';
// // // // // // // // // import Logiciels from './pages/Logiciels';
// // // // // // // // // import Incidents from './pages/Incidents';
// // // // // // // // // import Reparations from './pages/Reparations';
// // // // // // // // // import Rapports from './pages/Rapports';
// // // // // // // // // import Users from './pages/Users';
// // // // // // // // // import Alertes from './pages/Alertes';
// // // // // // // // // import Fournisseurs from './pages/Fournisseurs';
// // // // // // // // // import InstallationsLogiciels from './pages/InstallationsLogiciels.tsx';
// // // // // // // // // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // // // // // // // // import ConfigurationReseau from './pages/ConfigurationReseau';

// // // // // // // // // const ProtectedRoute = ({ children }) => {
// // // // // // // // //   const { user, loading } = useAuth();
  
// // // // // // // // //   if (loading) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // // // //         <div className="text-center">
// // // // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // // // //           <p className="text-white">Chargement du système DREN AA...</p>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }
  
// // // // // // // // //   return user ? children : <Navigate to="/login" replace />;
// // // // // // // // // };

// // // // // // // // // const PublicRoute = ({ children }) => {
// // // // // // // // //   const { user, loading } = useAuth();
  
// // // // // // // // //   if (loading) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // // // //         <div className="text-center">
// // // // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // // // //           <p className="text-white">Chargement...</p>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }
  
// // // // // // // // //   return !user ? children : <Navigate to="/dashboard" replace />;
// // // // // // // // // };

// // // // // // // // // const AppRoutes = () => {
// // // // // // // // //   const { user, loading } = useAuth();

// // // // // // // // //   if (loading) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // // // //         <div className="text-center">
// // // // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // // // //           <p className="text-white">Initialisation du système...</p>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   if (!user) {
// // // // // // // // //     return (
// // // // // // // // //       <>
// // // // // // // // //         <Routes>
// // // // // // // // //           <Route path="/login" element={
// // // // // // // // //             <PublicRoute>
// // // // // // // // //               <Login />
// // // // // // // // //             </PublicRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/register" element={
// // // // // // // // //             <PublicRoute>
// // // // // // // // //               <Register />
// // // // // // // // //             </PublicRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="*" element={<Navigate to="/login" replace />} />
// // // // // // // // //         </Routes>
// // // // // // // // //         <ToastContainer position="top-right" />
// // // // // // // // //       </>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <>
// // // // // // // // //       <Layout>
// // // // // // // // //         <Routes>
// // // // // // // // //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
// // // // // // // // //           <Route path="/dashboard" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <Dashboard />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/materiels" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <Materiels />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/logiciels" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <Logiciels />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/incidents" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <Incidents />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/reparations" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <Reparations />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/rapports" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <Rapports />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/users" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <Users />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/alertes" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <Alertes />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/fournisseurs" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <Fournisseurs />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/installations-logiciels" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <InstallationsLogiciels />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/profils-utilisateurs" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <ProfilsUtilisateurs />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
// // // // // // // // //           <Route path="/configuration-reseau" element={
// // // // // // // // //             <ProtectedRoute>
// // // // // // // // //               <ConfigurationReseau />
// // // // // // // // //             </ProtectedRoute>
// // // // // // // // //           } />
          
// // // // // // // // //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// // // // // // // // //           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
// // // // // // // // //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// // // // // // // // //         </Routes>
// // // // // // // // //       </Layout>
// // // // // // // // //       <ToastContainer position="top-right" />
// // // // // // // // //     </>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // function App() {
// // // // // // // // //   return (
// // // // // // // // //     <AuthProvider>
// // // // // // // // //       <Router>
// // // // // // // // //         <div className="min-h-screen bg-base-100">
// // // // // // // // //           <AppRoutes />
// // // // // // // // //         </div>
// // // // // // // // //       </Router>
// // // // // // // // //     </AuthProvider>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // export default App;





// // // // // // // // // src/App.jsx
// // // // // // // // import React from 'react';
// // // // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // // // // // // import { usePermissions } from './hooks/usePermissions';
// // // // // // // // import { ToastContainer } from 'react-toastify';
// // // // // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // // // // Layout Components
// // // // // // // // import Layout from './components/Layout';

// // // // // // // // // Pages
// // // // // // // // import Login from './components/Login';
// // // // // // // // // import Login from './pages/Login';
// // // // // // // // // import ProtectedRoute from './components/ProtectedRoute';

// // // // // // // // import Register from './components/Register';
// // // // // // // // import Dashboard from './pages/Dashboard';
// // // // // // // // import Materiels from './pages/Materiels';
// // // // // // // // import Logiciels from './pages/Logiciels';
// // // // // // // // import Incidents from './pages/Incidents';
// // // // // // // // import Reparations from './pages/Reparations';
// // // // // // // // import Rapports from './pages/Rapports';
// // // // // // // // import Users from './pages/Users';
// // // // // // // // import Alertes from './pages/Alertes';
// // // // // // // // import Fournisseurs from './pages/Fournisseurs';
// // // // // // // // import InstallationsLogiciels from './pages/InstallationsLogiciels.tsx';
// // // // // // // // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // // // // // // // import ConfigurationReseau from './pages/ConfigurationReseau';
// // // // // // // // import Unauthorized from './pages/Unauthorized'; // Créez cette page
// // // // // // // // import Historique from './pages/Historique';

// // // // // // // // const ProtectedRoute = ({ children, requiredRole = null }) => {
// // // // // // // //   const { user, loading } = useAuth();
// // // // // // // //   const { hasAccess } = usePermissions();
  
// // // // // // // //   if (loading) {
// // // // // // // //     return (
// // // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // // //         <div className="text-center">
// // // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // // //           <p className="text-white">Chargement du système DREN AA...</p>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }
  
// // // // // // // //   if (!user) {
// // // // // // // //     return <Navigate to="/login" replace />;
// // // // // // // //   }
  
// // // // // // // //   // Vérifier les permissions si un rôle est requis
// // // // // // // //   if (requiredRole && !hasAccess(requiredRole)) {
// // // // // // // //     return <Navigate to="/unauthorized" replace />;
// // // // // // // //   }
  
// // // // // // // //   return children;
// // // // // // // // };

// // // // // // // // const PublicRoute = ({ children }) => {
// // // // // // // //   const { user, loading } = useAuth();
  
// // // // // // // //   if (loading) {
// // // // // // // //     return (
// // // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // // //         <div className="text-center">
// // // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // // //           <p className="text-white">Chargement...</p>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }
  
// // // // // // // //   return !user ? children : <Navigate to="/dashboard" replace />;
// // // // // // // // };

// // // // // // // // // Définir les permissions pour chaque route
// // // // // // // // const routePermissions = {
// // // // // // // //   '/dashboard': 'user', // Tous les utilisateurs connectés
// // // // // // // //   '/materiels': 'user',
// // // // // // // //   '/logiciels': 'user',
// // // // // // // //   '/incidents': 'user',
// // // // // // // //   '/reparations': 'technician', // Seulement techniciens et +
// // // // // // // //   '/rapports': 'secretary', // Seulement secrétaires et +
// // // // // // // //   '/users': 'director', // Seulement directeurs et admin
// // // // // // // //   '/alertes': 'technician',
// // // // // // // //   '/fournisseurs': 'secretary',
// // // // // // // //   '/installations-logiciels': 'user',
// // // // // // // //   '/profils-utilisateurs': 'user',
// // // // // // // //   '/configuration-reseau': 'user'
// // // // // // // // };

// // // // // // // // const AppRoutes = () => {
// // // // // // // //   const { user, loading } = useAuth();
// // // // // // // //   const { hasAccess } = usePermissions();

// // // // // // // //   if (loading) {
// // // // // // // //     return (
// // // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // // //         <div className="text-center">
// // // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // // //           <p className="text-white">Initialisation du système...</p>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   if (!user) {
// // // // // // // //     return (
// // // // // // // //       <>
// // // // // // // //         <Routes>
// // // // // // // //           <Route path="/login" element={
// // // // // // // //             <PublicRoute>
// // // // // // // //               <Login />
// // // // // // // //             </PublicRoute>
// // // // // // // //           } />
// // // // // // // //           <Route path="/register" element={
// // // // // // // //             <PublicRoute>
// // // // // // // //               <Register />
// // // // // // // //             </PublicRoute>
// // // // // // // //           } />
// // // // // // // //           <Route path="*" element={<Navigate to="/login" replace />} />
// // // // // // // //         </Routes>
// // // // // // // //         <ToastContainer position="top-right" />
// // // // // // // //       </>
      

// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <>
// // // // // // // //       <Layout>
// // // // // // // //         <Routes>
// // // // // // // //           {/* Route publique pour les non-autorisés */}
// // // // // // // //           <Route path="/unauthorized" element={<Unauthorized />} />
          
// // // // // // // //           {/* Routes protégées avec permissions */}
// // // // // // // //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
// // // // // // // //           <Route path="/dashboard" element={
// // // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // // //               <Dashboard />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/materiels" element={
// // // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // // //               <Materiels />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/logiciels" element={
// // // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // // //               <Logiciels />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/incidents" element={
// // // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // // //               <Incidents />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/reparations" element={
// // // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // // //               <Reparations />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/rapports" element={
// // // // // // // //             <ProtectedRoute requiredRole="secretary">
// // // // // // // //               <Rapports />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/users" element={
// // // // // // // //             <ProtectedRoute requiredRole="director">
// // // // // // // //               <Users />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/alertes" element={
// // // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // // //               <Alertes />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/fournisseurs" element={
// // // // // // // //             <ProtectedRoute requiredRole="secretary">
// // // // // // // //               <Fournisseurs />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/installations-logiciels" element={
// // // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // // //               <InstallationsLogiciels />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/profils-utilisateurs" element={
// // // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // // //               <ProfilsUtilisateurs />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           <Route path="/configuration-reseau" element={
// // // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // // //               <ConfigurationReseau />
// // // // // // // //             </ProtectedRoute>
// // // // // // // //           } />
          
// // // // // // // //           // Ajoutez dans les routes
// // // // // // // //         <Route path="/historique" element={
// // // // // // // //             <ProtectedRoute requiredRole="director">
// // // // // // // //              <Historique />
// // // // // // // //           </ProtectedRoute>
// // // // // // // //       } />
// // // // // // // //           {/* Redirections */}
// // // // // // // //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// // // // // // // //           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
// // // // // // // //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// // // // // // // //         </Routes>
// // // // // // // //       </Layout>
// // // // // // // //       <ToastContainer position="top-right" />
// // // // // // // //     </>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // function App() {
// // // // // // // //   return (
// // // // // // // //     <AuthProvider>
// // // // // // // //       <Router>
// // // // // // // //         <div className="min-h-screen bg-base-100">
// // // // // // // //           <AppRoutes />
// // // // // // // //         </div>
// // // // // // // //       </Router>
// // // // // // // //     </AuthProvider>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // export default App;



// // // // // // // // src/App.jsx - VERSION COMPLÈTE AVEC TOUTES LES FONCTIONS
// // // // // // // import React, { useEffect } from 'react';
// // // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // // // // // import { NotificationProvider } from './context/NotificationContext';
// // // // // // // import { usePermissions } from './hooks/usePermissions';
// // // // // // // import { ToastContainer } from 'react-toastify';
// // // // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // // // Layout Components
// // // // // // // import Layout from './components/Layout';

// // // // // // // // Pages
// // // // // // // import Login from './components/Login';
// // // // // // // import Register from './components/Register';
// // // // // // // import Dashboard from './pages/Dashboard';
// // // // // // // import Materiels from './pages/Materiels';
// // // // // // // import Logiciels from './pages/Logiciels';
// // // // // // // import Incidents from './pages/Incidents';
// // // // // // // import Reparations from './pages/Reparations';
// // // // // // // import Rapports from './pages/Rapports';
// // // // // // // import Users from './pages/Users';
// // // // // // // import Alertes from './pages/Alertes';
// // // // // // // import Fournisseurs from './pages/Fournisseurs';
// // // // // // // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // // // // // // import ConfigurationReseau from './pages/ConfigurationReseau';
// // // // // // // import Unauthorized from './pages/Unauthorized';

// // // // // // // // Importez les composants
// // // // // // // import Historique from './pages/Historique';
// // // // // // // import InstallationsLogiciels from './pages/InstallationsLogiciels';

// // // // // // // // ==================== FONCTIONS DE L'HISTORIQUE ====================

// // // // // // // // Fonction pour initialiser l'historique local
// // // // // // // const initHistoriqueLocal = () => {
// // // // // // //   console.log('🔄 Initialisation de l\'historique local...');
  
// // // // // // //   const STORAGE_KEY = 'gestion_parc_historique';
  
// // // // // // //   const saved = localStorage.getItem(STORAGE_KEY);
// // // // // // //   if (!saved) {
// // // // // // //     const now = new Date();
// // // // // // //     const defaultData = [
// // // // // // //       {
// // // // // // //         id: 'hist_' + Date.now(),
// // // // // // //         utilisateur: 'admin',
// // // // // // //         action: 'CONNEXION',
// // // // // // //         module: 'Authentification',
// // // // // // //         details: 'Première initialisation du système',
// // // // // // //         date: new Date(now.getTime() - 86400000).toISOString(),
// // // // // // //         ip_address: '192.168.1.1'
// // // // // // //       },
// // // // // // //       {
// // // // // // //         id: 'hist_' + (Date.now() + 1),
// // // // // // //         utilisateur: 'admin',
// // // // // // //         action: 'CREATION',
// // // // // // //         module: 'Utilisateurs',
// // // // // // //         details: 'Création compte technicien',
// // // // // // //         date: new Date(now.getTime() - 172800000).toISOString(),
// // // // // // //         ip_address: '192.168.1.1'
// // // // // // //       },
// // // // // // //       {
// // // // // // //         id: 'hist_' + (Date.now() + 2),
// // // // // // //         utilisateur: 'technicien',
// // // // // // //         action: 'MODIFICATION',
// // // // // // //         module: 'Matériels',
// // // // // // //         details: 'Mise à jour PC-001',
// // // // // // //         date: new Date(now.getTime() - 259200000).toISOString(),
// // // // // // //         ip_address: '192.168.1.2'
// // // // // // //       },
// // // // // // //       {
// // // // // // //         id: 'hist_' + (Date.now() + 3),
// // // // // // //         utilisateur: 'user1',
// // // // // // //         action: 'LECTURE',
// // // // // // //         module: 'Dashboard',
// // // // // // //         details: 'Consultation tableau de bord',
// // // // // // //         date: new Date(now.getTime() - 345600000).toISOString(),
// // // // // // //         ip_address: '192.168.1.3'
// // // // // // //       },
// // // // // // //       {
// // // // // // //         id: 'hist_' + (Date.now() + 4),
// // // // // // //         utilisateur: 'admin',
// // // // // // //         action: 'SUPPRESSION',
// // // // // // //         module: 'Fournisseurs',
// // // // // // //         details: 'Suppression fournisseur TechCorp',
// // // // // // //         date: new Date(now.getTime() - 432000000).toISOString(),
// // // // // // //         ip_address: '192.168.1.1'
// // // // // // //       }
// // // // // // //     ];
    
// // // // // // //     localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
// // // // // // //     console.log(`✅ Historique initialisé avec ${defaultData.length} entrées`);
// // // // // // //   } else {
// // // // // // //     try {
// // // // // // //       const data = JSON.parse(saved);
// // // // // // //       console.log(`✅ Historique déjà initialisé (${data.length} entrées)`);
// // // // // // //     } catch {
// // // // // // //       console.log('⚠️ Historique corrompu, réinitialisation...');
// // // // // // //       localStorage.removeItem(STORAGE_KEY);
// // // // // // //       initHistoriqueLocal();
// // // // // // //     }
// // // // // // //   }
// // // // // // // };

// // // // // // // // Fonction pour obtenir l'historique
// // // // // // // const getHistoriqueLocal = () => {
// // // // // // //   const STORAGE_KEY = 'gestion_parc_historique';
// // // // // // //   try {
// // // // // // //     const saved = localStorage.getItem(STORAGE_KEY);
// // // // // // //     return saved ? JSON.parse(saved) : [];
// // // // // // //   } catch {
// // // // // // //     return [];
// // // // // // //   }
// // // // // // // };

// // // // // // // // Fonction pour ajouter une entrée d'historique
// // // // // // // const addHistoriqueEntry = (action, module, details, utilisateur = null) => {
// // // // // // //   try {
// // // // // // //     const userStr = localStorage.getItem('user');
// // // // // // //     const user = userStr ? JSON.parse(userStr) : null;
    
// // // // // // //     const newEntry = {
// // // // // // //       id: 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
// // // // // // //       utilisateur: utilisateur || user?.username || 'System',
// // // // // // //       action: action,
// // // // // // //       module: module,
// // // // // // //       details: details,
// // // // // // //       date: new Date().toISOString(),
// // // // // // //       ip_address: 'localhost'
// // // // // // //     };
    
// // // // // // //     const STORAGE_KEY = 'gestion_parc_historique';
// // // // // // //     const historique = getHistoriqueLocal();
// // // // // // //     const newHistorique = [newEntry, ...historique.slice(0, 99)]; // Limite à 100 entrées
    
// // // // // // //     localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
// // // // // // //     console.log(`✅ Entrée ajoutée: ${action} - ${module}`);
    
// // // // // // //     // Émettre un événement de mise à jour
// // // // // // //     window.dispatchEvent(new CustomEvent('historique-updated', { detail: newEntry }));
    
// // // // // // //     return newEntry;
// // // // // // //   } catch (error) {
// // // // // // //     console.error('❌ Erreur ajout historique:', error);
// // // // // // //     return null;
// // // // // // //   }
// // // // // // // };

// // // // // // // // ==================== ACTION LOGGER ====================

// // // // // // // // Fonction principale pour logger les actions
// // // // // // // const logAction = (action, module, details, username = null) => {
// // // // // // //   return addHistoriqueEntry(action, module, details, username);
// // // // // // // };

// // // // // // // // Objet ActionLogger avec des méthodes prédéfinies
// // // // // // // const ActionLogger = {
// // // // // // //   // Authentification
// // // // // // //   login: (username) => 
// // // // // // //     logAction('CONNEXION', 'Authentification', `Connexion de ${username}`, username),
  
// // // // // // //   logout: (username) => 
// // // // // // //     logAction('DECONNEXION', 'Authentification', `Déconnexion de ${username}`, username),
  
// // // // // // //   // Utilisateurs
// // // // // // //   createUser: (username, createdBy) => 
// // // // // // //     logAction('CREATION', 'Utilisateurs', `Création utilisateur ${username}`, createdBy),
  
// // // // // // //   updateUser: (username, updatedBy) => 
// // // // // // //     logAction('MODIFICATION', 'Utilisateurs', `Mise à jour utilisateur ${username}`, updatedBy),
  
// // // // // // //   deleteUser: (username, deletedBy) => 
// // // // // // //     logAction('SUPPRESSION', 'Utilisateurs', `Suppression utilisateur ${username}`, deletedBy),
  
// // // // // // //   // Matériels
// // // // // // //   createMateriel: (name, createdBy) => 
// // // // // // //     logAction('CREATION', 'Matériels', `Création matériel ${name}`, createdBy),
  
// // // // // // //   updateMateriel: (name, updatedBy) => 
// // // // // // //     logAction('MODIFICATION', 'Matériels', `Mise à jour matériel ${name}`, updatedBy),
  
// // // // // // //   deleteMateriel: (name, deletedBy) => 
// // // // // // //     logAction('SUPPRESSION', 'Matériels', `Suppression matériel ${name}`, deletedBy),
  
// // // // // // //   // Incidents
// // // // // // //   createIncident: (id, createdBy) => 
// // // // // // //     logAction('CREATION', 'Incidents', `Création incident #${id}`, createdBy),
  
// // // // // // //   resolveIncident: (id, resolvedBy) => 
// // // // // // //     logAction('MODIFICATION', 'Incidents', `Résolution incident #${id}`, resolvedBy),
  
// // // // // // //   // Dashboard
// // // // // // //   viewDashboard: (username) => 
// // // // // // //     logAction('LECTURE', 'Dashboard', 'Consultation tableau de bord', username),
  
// // // // // // //   // Générique
// // // // // // //   custom: (action, module, details, username) => 
// // // // // // //     logAction(action, module, details, username)
// // // // // // // };

// // // // // // // // Initialiser les écouteurs d'actions
// // // // // // // const initActionLogger = () => {
// // // // // // //   console.log('🎯 Configuration des écouteurs d\'actions...');
  
// // // // // // //   // Écouter les événements de connexion
// // // // // // //   window.addEventListener('user-login', (event) => {
// // // // // // //     const { username } = event.detail || {};
// // // // // // //     if (username) {
// // // // // // //       ActionLogger.login(username);
// // // // // // //     }
// // // // // // //   });
  
// // // // // // //   // Écouter les événements de déconnexion
// // // // // // //   window.addEventListener('user-logout', (event) => {
// // // // // // //     const { username } = event.detail || {};
// // // // // // //     if (username) {
// // // // // // //       ActionLogger.logout(username);
// // // // // // //     }
// // // // // // //   });
  
// // // // // // //   // Écouter les événements génériques
// // // // // // //   window.addEventListener('log-action', (event) => {
// // // // // // //     const { action, module, details, username } = event.detail || {};
// // // // // // //     if (action && module && details) {
// // // // // // //       ActionLogger.custom(action, module, details, username);
// // // // // // //     }
// // // // // // //   });
  
// // // // // // //   console.log('✅ ActionLogger initialisé');
// // // // // // // };

// // // // // // // // ==================== HOOK useActionLogger ====================

// // // // // // // // Hook pour utiliser le logger d'actions dans les composants
// // // // // // // const useActionLogger = () => {
// // // // // // //   const log = (action, module, details, username = null) => {
// // // // // // //     return ActionLogger.custom(action, module, details, username);
// // // // // // //   };
  
// // // // // // //   const logLogin = (username) => {
// // // // // // //     return ActionLogger.login(username);
// // // // // // //   };
  
// // // // // // //   const logLogout = (username) => {
// // // // // // //     return ActionLogger.logout(username);
// // // // // // //   };
  
// // // // // // //   const logCreate = (module, itemName, username = null) => {
// // // // // // //     return ActionLogger.custom('CREATION', module, `Création: ${itemName}`, username);
// // // // // // //   };
  
// // // // // // //   const logUpdate = (module, itemName, username = null) => {
// // // // // // //     return ActionLogger.custom('MODIFICATION', module, `Mise à jour: ${itemName}`, username);
// // // // // // //   };
  
// // // // // // //   const logDelete = (module, itemName, username = null) => {
// // // // // // //     return ActionLogger.custom('SUPPRESSION', module, `Suppression: ${itemName}`, username);
// // // // // // //   };
  
// // // // // // //   const logView = (module, username = null) => {
// // // // // // //     return ActionLogger.custom('LECTURE', module, 'Consultation', username);
// // // // // // //   };
  
// // // // // // //   return {
// // // // // // //     log,
// // // // // // //     logLogin,
// // // // // // //     logLogout,
// // // // // // //     logCreate,
// // // // // // //     logUpdate,
// // // // // // //     logDelete,
// // // // // // //     logView
// // // // // // //   };
// // // // // // // };

// // // // // // // // ==================== COMPOSANTS DE ROUTE ====================

// // // // // // // const ProtectedRoute = ({ children, requiredRole = null }) => {
// // // // // // //   const { user, loading } = useAuth();
// // // // // // //   const { hasAccess } = usePermissions();
  
// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // //         <div className="text-center">
// // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // //           <p className="text-white">Chargement du système...</p>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }
  
// // // // // // //   if (!user) {
// // // // // // //     return <Navigate to="/login" replace />;
// // // // // // //   }
  
// // // // // // //   if (requiredRole && !hasAccess(requiredRole)) {
// // // // // // //     return <Navigate to="/unauthorized" replace />;
// // // // // // //   }
  
// // // // // // //   return children;
// // // // // // // };

// // // // // // // const PublicRoute = ({ children }) => {
// // // // // // //   const { user, loading } = useAuth();
  
// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // //         <div className="text-center">
// // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // //           <p className="text-white">Chargement...</p>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }
  
// // // // // // //   return !user ? children : <Navigate to="/dashboard" replace />;
// // // // // // // };

// // // // // // // // ==================== COMPOSANT APP ROUTES ====================

// // // // // // // const AppRoutes = () => {
// // // // // // //   const { user, loading } = useAuth();

// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // //         <div className="text-center">
// // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // //           <p className="text-white">Initialisation du système...</p>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   if (!user) {
// // // // // // //     return (
// // // // // // //       <>
// // // // // // //         <Routes>
// // // // // // //           <Route path="/login" element={
// // // // // // //             <PublicRoute>
// // // // // // //               <Login />
// // // // // // //             </PublicRoute>
// // // // // // //           } />
// // // // // // //           <Route path="/register" element={
// // // // // // //             <PublicRoute>
// // // // // // //               <Register />
// // // // // // //             </PublicRoute>
// // // // // // //           } />
// // // // // // //           <Route path="*" element={<Navigate to="/login" replace />} />
// // // // // // //         </Routes>
// // // // // // //         <ToastContainer 
// // // // // // //           position="top-right"
// // // // // // //           autoClose={5000}
// // // // // // //           hideProgressBar={false}
// // // // // // //           newestOnTop
// // // // // // //           closeOnClick
// // // // // // //           rtl={false}
// // // // // // //           pauseOnFocusLoss
// // // // // // //           draggable
// // // // // // //           pauseOnHover
// // // // // // //         />
// // // // // // //       </>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       <Layout>
// // // // // // //         <Routes>
// // // // // // //           <Route path="/unauthorized" element={<Unauthorized />} />
// // // // // // //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
// // // // // // //           <Route path="/dashboard" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <Dashboard />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/materiels" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <Materiels />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/logiciels" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <Logiciels />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/incidents" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <Incidents />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/reparations" element={
// // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // //               <Reparations />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/rapports" element={
// // // // // // //             <ProtectedRoute requiredRole="secretary">
// // // // // // //               <Rapports />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/users" element={
// // // // // // //             <ProtectedRoute requiredRole="director">
// // // // // // //               <Users />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/alertes" element={
// // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // //               <Alertes />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/fournisseurs" element={
// // // // // // //             <ProtectedRoute requiredRole="secretary">
// // // // // // //               <Fournisseurs />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/installations-logiciels" element={
// // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // //               <InstallationsLogiciels />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/profils-utilisateurs" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <ProfilsUtilisateurs />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/configuration-reseau" element={
// // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // //               <ConfigurationReseau />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/historique" element={
// // // // // // //             <ProtectedRoute requiredRole="director">
// // // // // // //               <Historique />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// // // // // // //           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
// // // // // // //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// // // // // // //         </Routes>
// // // // // // //       </Layout>
// // // // // // //       <ToastContainer 
// // // // // // //         position="top-right"
// // // // // // //         autoClose={5000}
// // // // // // //         hideProgressBar={false}
// // // // // // //         newestOnTop
// // // // // // //         closeOnClick
// // // // // // //         rtl={false}
// // // // // // //         pauseOnFocusLoss
// // // // // // //         draggable
// // // // // // //         pauseOnHover
// // // // // // //       />
// // // // // // //     </>
// // // // // // //   );
// // // // // // // };

// // // // // // // // ==================== COMPOSANT APP PRINCIPAL ====================

// // // // // // // function App() {
// // // // // // //   useEffect(() => {
// // // // // // //     // Initialiser l'historique
// // // // // // //     initHistoriqueLocal();
    
// // // // // // //     // Initialiser le logger d'actions
// // // // // // //     initActionLogger();
    
// // // // // // //     // Enregistrer le démarrage de l'application
// // // // // // //     const userStr = localStorage.getItem('user');
// // // // // // //     if (userStr) {
// // // // // // //       try {
// // // // // // //         const user = JSON.parse(userStr);
// // // // // // //         console.log(`✅ Application démarrée pour: ${user.username}`);
        
// // // // // // //         // Enregistrer l'action de démarrage
// // // // // // //         setTimeout(() => {
// // // // // // //           ActionLogger.custom('DEMARRAGE', 'Système', 'Application démarrée', user.username);
// // // // // // //         }, 1000);
// // // // // // //       } catch (error) {
// // // // // // //         console.error('❌ Erreur parsing user:', error);
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     // Ajouter un bouton de test dans la console
// // // // // // //     if (typeof window !== 'undefined') {
// // // // // // //       window.addTestAction = () => {
// // // // // // //         const username = prompt("Nom d'utilisateur pour le test:", "admin");
// // // // // // //         const action = prompt("Action:", "TEST");
// // // // // // //         const module = prompt("Module:", "Test");
// // // // // // //         const details = prompt("Détails:", "Action de test manuelle");
        
// // // // // // //         if (username && action && module && details) {
// // // // // // //           ActionLogger.custom(action, module, details, username);
// // // // // // //           alert(`✅ Action "${action}" ajoutée à l'historique!`);
// // // // // // //         }
// // // // // // //       };
      
// // // // // // //       console.log('🔧 Fonctions de test disponibles:');
// // // // // // //       console.log('- addTestAction(): Ajouter une action de test');
// // // // // // //       console.log('- ActionLogger: Objet pour logger les actions');
// // // // // // //       console.log('- useActionLogger: Hook React pour logger');
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   return (
// // // // // // //     <AuthProvider>
// // // // // // //       <NotificationProvider>
// // // // // // //         <Router>
// // // // // // //           <div className="min-h-screen bg-base-100">
// // // // // // //             <AppRoutes />
// // // // // // //           </div>
// // // // // // //         </Router>
// // // // // // //       </NotificationProvider>
// // // // // // //     </AuthProvider>
// // // // // // //   );
// // // // // // // }

// // // // // // // // Exporter les fonctions pour les utiliser ailleurs
// // // // // // // export { 
// // // // // // //   initHistoriqueLocal, 
// // // // // // //   getHistoriqueLocal, 
// // // // // // //   addHistoriqueEntry,
// // // // // // //   ActionLogger,
// // // // // // //   initActionLogger,
// // // // // // //   useActionLogger 
// // // // // // // };

// // // // // // // export default App;


// // // // // // // // src/App.jsx - VERSION CORRIGÉE
// // // // // // // import React, { useEffect } from 'react';
// // // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // // // // // import { NotificationProvider } from './context/NotificationContext';
// // // // // // // import { usePermissions } from './hooks/usePermissions';
// // // // // // // import { ToastContainer } from 'react-toastify';
// // // // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // // // Layout Components
// // // // // // // import Layout from './components/Layout';

// // // // // // // // Pages
// // // // // // // import Login from './components/Login';
// // // // // // // import Register from './components/Register';
// // // // // // // import Dashboard from './pages/Dashboard';
// // // // // // // import Materiels from './pages/Materiels';
// // // // // // // import Logiciels from './pages/Logiciels';
// // // // // // // import Incidents from './pages/Incidents';
// // // // // // // import Reparations from './pages/Reparations';
// // // // // // // import Rapports from './pages/Rapports';
// // // // // // // import Users from './pages/Users';
// // // // // // // import Alertes from './pages/Alertes';
// // // // // // // import Fournisseurs from './pages/Fournisseurs';
// // // // // // // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // // // // // // import ConfigurationReseau from './pages/ConfigurationReseau';
// // // // // // // import Unauthorized from './pages/Unauthorized';

// // // // // // // // Importez les composants
// // // // // // // import Historique from './pages/Historique';
// // // // // // // import InstallationsLogiciels from './pages/InstallationsLogiciels';

// // // // // // // // Import des utilitaires d'historique
// // // // // // // import { 
// // // // // // //   initHistoriqueLocal, 
// // // // // // //   getHistoriqueLocal, 
// // // // // // //   addHistoriqueEntry,
// // // // // // //   ActionLogger,
// // // // // // //   initActionLogger,
// // // // // // //   useActionLogger 
// // // // // // // } from './utils/historyLogger'; // Vous devrez créer ce fichier

// // // // // // // // ==================== COMPOSANTS DE ROUTE ====================

// // // // // // // const ProtectedRoute = ({ children, requiredRole = null }) => {
// // // // // // //   const { user, loading } = useAuth();
// // // // // // //   const { hasAccess } = usePermissions();
  
// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // //         <div className="text-center">
// // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // //           <p className="text-white">Chargement du système...</p>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }
  
// // // // // // //   if (!user) {
// // // // // // //     return <Navigate to="/login" replace />;
// // // // // // //   }
  
// // // // // // //   if (requiredRole && !hasAccess(requiredRole)) {
// // // // // // //     return <Navigate to="/unauthorized" replace />;
// // // // // // //   }
  
// // // // // // //   return children;
// // // // // // // };

// // // // // // // const PublicRoute = ({ children }) => {
// // // // // // //   const { user, loading } = useAuth();
  
// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // //         <div className="text-center">
// // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // //           <p className="text-white">Chargement...</p>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }
  
// // // // // // //   return !user ? children : <Navigate to="/dashboard" replace />;
// // // // // // // };

// // // // // // // // ==================== COMPOSANT APP ROUTES ====================

// // // // // // // const AppRoutes = () => {
// // // // // // //   const { user, loading } = useAuth();

// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // // //         <div className="text-center">
// // // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // // //           <p className="text-white">Initialisation du système...</p>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   if (!user) {
// // // // // // //     return (
// // // // // // //       <>
// // // // // // //         <Routes>
// // // // // // //           <Route path="/login" element={
// // // // // // //             <PublicRoute>
// // // // // // //               <Login />
// // // // // // //             </PublicRoute>
// // // // // // //           } />
// // // // // // //           <Route path="/register" element={
// // // // // // //             <PublicRoute>
// // // // // // //               <Register />
// // // // // // //             </PublicRoute>
// // // // // // //           } />
// // // // // // //           <Route path="*" element={<Navigate to="/login" replace />} />
// // // // // // //         </Routes>
// // // // // // //         <ToastContainer 
// // // // // // //           position="top-right"
// // // // // // //           autoClose={5000}
// // // // // // //           hideProgressBar={false}
// // // // // // //           newestOnTop
// // // // // // //           closeOnClick
// // // // // // //           rtl={false}
// // // // // // //           pauseOnFocusLoss
// // // // // // //           draggable
// // // // // // //           pauseOnHover
// // // // // // //         />
// // // // // // //       </>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       <Layout>
// // // // // // //         <Routes>
// // // // // // //           <Route path="/unauthorized" element={<Unauthorized />} />
// // // // // // //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
// // // // // // //           <Route path="/dashboard" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <Dashboard />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/materiels" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <Materiels />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/logiciels" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <Logiciels />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/incidents" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <Incidents />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/reparations" element={
// // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // //               <Reparations />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/rapports" element={
// // // // // // //             <ProtectedRoute requiredRole="secretary">
// // // // // // //               <Rapports />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/users" element={
// // // // // // //             <ProtectedRoute requiredRole="director">
// // // // // // //               <Users />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/alertes" element={
// // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // //               <Alertes />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/fournisseurs" element={
// // // // // // //             <ProtectedRoute requiredRole="secretary">
// // // // // // //               <Fournisseurs />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/installations-logiciels" element={
// // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // //               <InstallationsLogiciels />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/profils-utilisateurs" element={
// // // // // // //             <ProtectedRoute requiredRole="user">
// // // // // // //               <ProfilsUtilisateurs />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/configuration-reseau" element={
// // // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // // //               <ConfigurationReseau />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/historique" element={
// // // // // // //             <ProtectedRoute requiredRole="director">
// // // // // // //               <Historique />
// // // // // // //             </ProtectedRoute>
// // // // // // //           } />
          
// // // // // // //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// // // // // // //           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
// // // // // // //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// // // // // // //         </Routes>
// // // // // // //       </Layout>
// // // // // // //       <ToastContainer 
// // // // // // //         position="top-right"
// // // // // // //         autoClose={5000}
// // // // // // //         hideProgressBar={false}
// // // // // // //         newestOnTop
// // // // // // //         closeOnClick
// // // // // // //         rtl={false}
// // // // // // //         pauseOnFocusLoss
// // // // // // //         draggable
// // // // // // //         pauseOnHover
// // // // // // //       />
// // // // // // //     </>
// // // // // // //   );
// // // // // // // };

// // // // // // // // ==================== COMPOSANT APP PRINCIPAL ====================

// // // // // // // function App() {
// // // // // // //   useEffect(() => {
// // // // // // //     // Initialiser l'historique
// // // // // // //     initHistoriqueLocal();
    
// // // // // // //     // Initialiser le logger d'actions
// // // // // // //     initActionLogger();
    
// // // // // // //     // Enregistrer le démarrage de l'application
// // // // // // //     const userStr = localStorage.getItem('user');
// // // // // // //     if (userStr) {
// // // // // // //       try {
// // // // // // //         const user = JSON.parse(userStr);
// // // // // // //         console.log(`✅ Application démarrée pour: ${user.username}`);
        
// // // // // // //         // Enregistrer l'action de démarrage
// // // // // // //         setTimeout(() => {
// // // // // // //           ActionLogger.custom('DEMARRAGE', 'Système', 'Application démarrée', user.username);
// // // // // // //         }, 1000);
// // // // // // //       } catch (error) {
// // // // // // //         console.error('❌ Erreur parsing user:', error);
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     // Ajouter un bouton de test dans la console
// // // // // // //     if (typeof window !== 'undefined') {
// // // // // // //       window.addTestAction = () => {
// // // // // // //         const username = prompt("Nom d'utilisateur pour le test:", "admin");
// // // // // // //         const action = prompt("Action:", "TEST");
// // // // // // //         const module = prompt("Module:", "Test");
// // // // // // //         const details = prompt("Détails:", "Action de test manuelle");
        
// // // // // // //         if (username && action && module && details) {
// // // // // // //           ActionLogger.custom(action, module, details, username);
// // // // // // //           alert(`✅ Action "${action}" ajoutée à l'historique!`);
// // // // // // //         }
// // // // // // //       };
      
// // // // // // //       console.log('🔧 Fonctions de test disponibles:');
// // // // // // //       console.log('- addTestAction(): Ajouter une action de test');
// // // // // // //       console.log('- ActionLogger: Objet pour logger les actions');
// // // // // // //       console.log('- useActionLogger: Hook React pour logger');
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   return (
// // // // // // //     <AuthProvider>
// // // // // // //       <NotificationProvider>
// // // // // // //         <Router>
// // // // // // //           <div className="min-h-screen bg-base-100">
// // // // // // //             <AppRoutes />
// // // // // // //           </div>
// // // // // // //         </Router>
// // // // // // //       </NotificationProvider>
// // // // // // //     </AuthProvider>
// // // // // // //   );
// // // // // // // }

// // // // // // // export default App;




// // // // // // // src/App.jsx - VERSION COMPLÈTE AVEC LOGGING D'ACTIONS
// // // // // // import React, { useEffect } from 'react';
// // // // // // import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// // // // // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // // // // import { NotificationProvider } from './context/NotificationContext';
// // // // // // import { usePermissions } from './hooks/usePermissions';
// // // // // // import { ToastContainer } from 'react-toastify';
// // // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // // Layout Components
// // // // // // import Layout from './components/Layout';

// // // // // // // Pages
// // // // // // import Login from './components/Login';
// // // // // // import Register from './components/Register';
// // // // // // import Dashboard from './pages/Dashboard';
// // // // // // import Materiels from './pages/Materiels';
// // // // // // import Logiciels from './pages/Logiciels';
// // // // // // import Incidents from './pages/Incidents';
// // // // // // import Reparations from './pages/Reparations';
// // // // // // import Rapports from './pages/Rapports';
// // // // // // import Users from './pages/Users';
// // // // // // import Alertes from './pages/Alertes';
// // // // // // import Fournisseurs from './pages/Fournisseurs';
// // // // // // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // // // // // import ConfigurationReseau from './pages/ConfigurationReseau';
// // // // // // import Unauthorized from './pages/Unauthorized';
// // // // // // import Historique from './pages/Historique';
// // // // // // import InstallationsLogiciels from './pages/InstallationsLogiciels';

// // // // // // // Import du composant QuickActionLogger
// // // // // // import QuickActionLogger from './components/QuickActionLogger';

// // // // // // // ==================== FONCTIONS DE L'HISTORIQUE ====================

// // // // // // // Fonction pour initialiser l'historique local
// // // // // // const initHistoriqueLocal = () => {
// // // // // //   console.log('🔄 Initialisation de l\'historique local...');
  
// // // // // //   const STORAGE_KEY = 'gestion_parc_historique';
  
// // // // // //   const saved = localStorage.getItem(STORAGE_KEY);
// // // // // //   if (!saved) {
// // // // // //     const now = new Date();
// // // // // //     const defaultData = [
// // // // // //       {
// // // // // //         id: 'hist_' + Date.now(),
// // // // // //         utilisateur: 'admin',
// // // // // //         action: 'CONNEXION',
// // // // // //         module: 'Authentification',
// // // // // //         details: 'Première initialisation du système',
// // // // // //         date: new Date(now.getTime() - 86400000).toISOString(),
// // // // // //         ip_address: '192.168.1.1',
// // // // // //         user_agent: 'Chrome/120.0',
// // // // // //         status: 'SUCCESS'
// // // // // //       },
// // // // // //       {
// // // // // //         id: 'hist_' + (Date.now() + 1),
// // // // // //         utilisateur: 'admin',
// // // // // //         action: 'CREATION',
// // // // // //         module: 'Utilisateurs',
// // // // // //         details: 'Création compte technicien',
// // // // // //         date: new Date(now.getTime() - 172800000).toISOString(),
// // // // // //         ip_address: '192.168.1.1',
// // // // // //         user_agent: 'Chrome/120.0',
// // // // // //         status: 'SUCCESS'
// // // // // //       },
// // // // // //       {
// // // // // //         id: 'hist_' + (Date.now() + 2),
// // // // // //         utilisateur: 'technicien',
// // // // // //         action: 'MODIFICATION',
// // // // // //         module: 'Matériels',
// // // // // //         details: 'Mise à jour PC-001',
// // // // // //         date: new Date(now.getTime() - 259200000).toISOString(),
// // // // // //         ip_address: '192.168.1.2',
// // // // // //         user_agent: 'Firefox/119.0',
// // // // // //         status: 'SUCCESS'
// // // // // //       }
// // // // // //     ];
    
// // // // // //     localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
// // // // // //     console.log(`✅ Historique initialisé avec ${defaultData.length} entrées`);
// // // // // //   } else {
// // // // // //     try {
// // // // // //       const data = JSON.parse(saved);
// // // // // //       console.log(`✅ Historique déjà initialisé (${data.length} entrées)`);
// // // // // //     } catch {
// // // // // //       console.log('⚠️ Historique corrompu, réinitialisation...');
// // // // // //       localStorage.removeItem(STORAGE_KEY);
// // // // // //       initHistoriqueLocal();
// // // // // //     }
// // // // // //   }
// // // // // // };

// // // // // // // Fonction pour logger une action
// // // // // // const logAction = (action, module, details, username = null) => {
// // // // // //   try {
// // // // // //     const userStr = localStorage.getItem('user');
// // // // // //     const user = userStr ? JSON.parse(userStr) : null;
    
// // // // // //     const newEntry = {
// // // // // //       id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
// // // // // //       utilisateur: username || user?.username || 'System',
// // // // // //       action: action,
// // // // // //       module: module,
// // // // // //       details: details,
// // // // // //       date: new Date().toISOString(),
// // // // // //       ip_address: 'localhost',
// // // // // //       user_agent: navigator.userAgent,
// // // // // //       status: 'SUCCESS'
// // // // // //     };
    
// // // // // //     const STORAGE_KEY = 'gestion_parc_historique';
// // // // // //     const historique = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
// // // // // //     const newHistorique = [newEntry, ...historique.slice(0, 99)]; // Limite à 100 entrées
    
// // // // // //     localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
// // // // // //     console.log(`📝 Action loggée: ${action} - ${module} - ${details}`);
    
// // // // // //     // Émettre un événement pour mettre à jour l'UI en temps réel
// // // // // //     window.dispatchEvent(new CustomEvent('action-logged', { detail: newEntry }));
    
// // // // // //     return newEntry;
// // // // // //   } catch (error) {
// // // // // //     console.error('❌ Erreur logging action:', error);
// // // // // //     return null;
// // // // // //   }
// // // // // // };

// // // // // // // Objet ActionLogger avec des méthodes prédéfinies
// // // // // // const ActionLogger = {
// // // // // //   // Authentification
// // // // // //   login: (username) => 
// // // // // //     logAction('CONNEXION', 'Authentification', `Connexion de ${username}`, username),
  
// // // // // //   logout: (username) => 
// // // // // //     logAction('DECONNEXION', 'Authentification', `Déconnexion de ${username}`, username),
  
// // // // // //   // Matériels
// // // // // //   createMateriel: (nom, username) => 
// // // // // //     logAction('CREATION', 'Matériels', `Création matériel: ${nom}`, username),
  
// // // // // //   updateMateriel: (nom, username) => 
// // // // // //     logAction('MODIFICATION', 'Matériels', `Mise à jour matériel: ${nom}`, username),
  
// // // // // //   deleteMateriel: (nom, username) => 
// // // // // //     logAction('SUPPRESSION', 'Matériels', `Suppression matériel: ${nom}`, username),
  
// // // // // //   // Logiciels
// // // // // //   createLogiciel: (nom, username) => 
// // // // // //     logAction('CREATION', 'Logiciels', `Création logiciel: ${nom}`, username),
  
// // // // // //   updateLogiciel: (nom, username) => 
// // // // // //     logAction('MODIFICATION', 'Logiciels', `Mise à jour logiciel: ${nom}`, username),
  
// // // // // //   // Incidents
// // // // // //   createIncident: (description, username) => 
// // // // // //     logAction('CREATION', 'Incidents', `Création incident: ${description.substring(0, 50)}...`, username),
  
// // // // // //   resolveIncident: (id, username) => 
// // // // // //     logAction('MODIFICATION', 'Incidents', `Résolution incident #${id}`, username),
  
// // // // // //   // Réparations
// // // // // //   createReparation: (details, username) => 
// // // // // //     logAction('CREATION', 'Réparations', `Création réparation: ${details.substring(0, 50)}...`, username),
  
// // // // // //   // Alertes
// // // // // //   createAlerte: (titre, username) => 
// // // // // //     logAction('CREATION', 'Alertes', `Création alerte: ${titre}`, username),
  
// // // // // //   // Fournisseurs
// // // // // //   createFournisseur: (nom, username) => 
// // // // // //     logAction('CREATION', 'Fournisseurs', `Création fournisseur: ${nom}`, username),
  
// // // // // //   // Utilisateurs
// // // // // //   createUser: (username, createdBy) => 
// // // // // //     logAction('CREATION', 'Utilisateurs', `Création utilisateur: ${username}`, createdBy),
  
// // // // // //   updateUser: (username, updatedBy) => 
// // // // // //     logAction('MODIFICATION', 'Utilisateurs', `Mise à jour utilisateur: ${username}`, updatedBy),
  
// // // // // //   // Rapports
// // // // // //   generateReport: (type, username) => 
// // // // // //     logAction('GENERATION', 'Rapports', `Génération rapport: ${type}`, username),
  
// // // // // //   // Navigation
// // // // // //   viewPage: (page, username) => 
// // // // // //     logAction('NAVIGATION', 'Système', `Consultation page: ${page}`, username),
  
// // // // // //   // Générique
// // // // // //   custom: (action, module, details, username) => 
// // // // // //     logAction(action, module, details, username)
// // // // // // };

// // // // // // // Initialiser les écouteurs d'actions
// // // // // // const initActionLogger = () => {
// // // // // //   console.log('🎯 Configuration des écouteurs d\'actions...');
  
// // // // // //   // Exposer globalement
// // // // // //   window.ActionLogger = ActionLogger;
  
// // // // // //   // Écouter les événements de connexion
// // // // // //   window.addEventListener('user-login', (event) => {
// // // // // //     const { username } = event.detail || {};
// // // // // //     if (username) {
// // // // // //       ActionLogger.login(username);
// // // // // //     }
// // // // // //   });
  
// // // // // //   // Écouter les événements de déconnexion
// // // // // //   window.addEventListener('user-logout', (event) => {
// // // // // //     const { username } = event.detail || {};
// // // // // //     if (username) {
// // // // // //       ActionLogger.logout(username);
// // // // // //     }
// // // // // //   });
  
// // // // // //   console.log('✅ ActionLogger initialisé');
// // // // // // };

// // // // // // // ==================== COMPOSANT POUR LOGGER LA NAVIGATION ====================

// // // // // // const NavigationLogger = () => {
// // // // // //   const location = useLocation();
// // // // // //   const { user } = useAuth();
  
// // // // // //   useEffect(() => {
// // // // // //     if (user && window.ActionLogger) {
// // // // // //       // Logger la navigation après un court délai
// // // // // //       setTimeout(() => {
// // // // // //         window.ActionLogger.viewPage(location.pathname, user.username);
// // // // // //       }, 500);
// // // // // //     }
// // // // // //   }, [location.pathname, user]);
  
// // // // // //   return null;
// // // // // // };

// // // // // // // ==================== COMPOSANTS DE ROUTE ====================

// // // // // // const ProtectedRoute = ({ children, requiredRole = null }) => {
// // // // // //   const { user, loading } = useAuth();
// // // // // //   const { hasAccess } = usePermissions();
  
// // // // // //   if (loading) {
// // // // // //     return (
// // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // //         <div className="text-center">
// // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // //           <p className="text-white">Chargement du système...</p>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }
  
// // // // // //   if (!user) {
// // // // // //     return <Navigate to="/login" replace />;
// // // // // //   }
  
// // // // // //   if (requiredRole && !hasAccess(requiredRole)) {
// // // // // //     return <Navigate to="/unauthorized" replace />;
// // // // // //   }
  
// // // // // //   return children;
// // // // // // };

// // // // // // const PublicRoute = ({ children }) => {
// // // // // //   const { user, loading } = useAuth();
  
// // // // // //   if (loading) {
// // // // // //     return (
// // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // //         <div className="text-center">
// // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // //           <p className="text-white">Chargement...</p>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }
  
// // // // // //   return !user ? children : <Navigate to="/dashboard" replace />;
// // // // // // };

// // // // // // // ==================== COMPOSANT APP ROUTES ====================

// // // // // // const AppRoutes = () => {
// // // // // //   const { user, loading } = useAuth();

// // // // // //   if (loading) {
// // // // // //     return (
// // // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // // //         <div className="text-center">
// // // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // // //           <p className="text-white">Initialisation du système...</p>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   if (!user) {
// // // // // //     return (
// // // // // //       <>
// // // // // //         <Routes>
// // // // // //           <Route path="/login" element={
// // // // // //             <PublicRoute>
// // // // // //               <Login />
// // // // // //             </PublicRoute>
// // // // // //           } />
// // // // // //           <Route path="/register" element={
// // // // // //             <PublicRoute>
// // // // // //               <Register />
// // // // // //             </PublicRoute>
// // // // // //           } />
// // // // // //           <Route path="*" element={<Navigate to="/login" replace />} />
// // // // // //         </Routes>
// // // // // //         <ToastContainer 
// // // // // //           position="top-right"
// // // // // //           autoClose={5000}
// // // // // //           hideProgressBar={false}
// // // // // //           newestOnTop
// // // // // //           closeOnClick
// // // // // //           rtl={false}
// // // // // //           pauseOnFocusLoss
// // // // // //           draggable
// // // // // //           pauseOnHover
// // // // // //         />
// // // // // //       </>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <>
// // // // // //       <Layout>
// // // // // //         <NavigationLogger />
// // // // // //         <Routes>
// // // // // //           <Route path="/unauthorized" element={<Unauthorized />} />
// // // // // //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
// // // // // //           <Route path="/dashboard" element={
// // // // // //             <ProtectedRoute requiredRole="user">
// // // // // //               <Dashboard />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/materiels" element={
// // // // // //             <ProtectedRoute requiredRole="user">
// // // // // //               <Materiels />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/logiciels" element={
// // // // // //             <ProtectedRoute requiredRole="user">
// // // // // //               <Logiciels />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/incidents" element={
// // // // // //             <ProtectedRoute requiredRole="user">
// // // // // //               <Incidents />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/reparations" element={
// // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // //               <Reparations />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/rapports" element={
// // // // // //             <ProtectedRoute requiredRole="secretary">
// // // // // //               <Rapports />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/users" element={
// // // // // //             <ProtectedRoute requiredRole="director">
// // // // // //               <Users />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/alertes" element={
// // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // //               <Alertes />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/fournisseurs" element={
// // // // // //             <ProtectedRoute requiredRole="secretary">
// // // // // //               <Fournisseurs />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/installations-logiciels" element={
// // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // //               <InstallationsLogiciels />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/profils-utilisateurs" element={
// // // // // //             <ProtectedRoute requiredRole="user">
// // // // // //               <ProfilsUtilisateurs />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/configuration-reseau" element={
// // // // // //             <ProtectedRoute requiredRole="technician">
// // // // // //               <ConfigurationReseau />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/historique" element={
// // // // // //             <ProtectedRoute requiredRole="director">
// // // // // //               <Historique />
// // // // // //             </ProtectedRoute>
// // // // // //           } />
          
// // // // // //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// // // // // //           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
// // // // // //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// // // // // //         </Routes>
        
// // // // // //         {/* Composant pour ajouter des actions manuellement */}
// // // // // //         <QuickActionLogger />
// // // // // //       </Layout>
// // // // // //       <ToastContainer 
// // // // // //         position="top-right"
// // // // // //         autoClose={5000}
// // // // // //         hideProgressBar={false}
// // // // // //         newestOnTop
// // // // // //         closeOnClick
// // // // // //         rtl={false}
// // // // // //         pauseOnFocusLoss
// // // // // //         draggable
// // // // // //         pauseOnHover
// // // // // //       />
// // // // // //     </>
// // // // // //   );
// // // // // // };

// // // // // // // ==================== COMPOSANT APP PRINCIPAL ====================

// // // // // // function App() {
// // // // // //   useEffect(() => {
// // // // // //     // Initialiser l'historique
// // // // // //     initHistoriqueLocal();
    
// // // // // //     // Initialiser le logger d'actions
// // // // // //     initActionLogger();
    
// // // // // //     // Enregistrer le démarrage de l'application
// // // // // //     const userStr = localStorage.getItem('user');
// // // // // //     if (userStr) {
// // // // // //       try {
// // // // // //         const user = JSON.parse(userStr);
// // // // // //         console.log(`✅ Application démarrée pour: ${user.username}`);
        
// // // // // //         // Enregistrer l'action de démarrage
// // // // // //         setTimeout(() => {
// // // // // //           ActionLogger.custom('DEMARRAGE', 'Système', 'Application démarrée', user.username);
// // // // // //         }, 1000);
// // // // // //       } catch (error) {
// // // // // //         console.error('❌ Erreur parsing user:', error);
// // // // // //       }
// // // // // //     }
    
// // // // // //     // Ajouter un bouton de test dans la console
// // // // // //     if (typeof window !== 'undefined') {
// // // // // //       window.addTestAction = () => {
// // // // // //         const username = prompt("Nom d'utilisateur pour le test:", "admin");
// // // // // //         const action = prompt("Action:", "TEST");
// // // // // //         const module = prompt("Module:", "Test");
// // // // // //         const details = prompt("Détails:", "Action de test manuelle");
        
// // // // // //         if (username && action && module && details) {
// // // // // //           ActionLogger.custom(action, module, details, username);
// // // // // //           alert(`✅ Action "${action}" ajoutée à l'historique!`);
// // // // // //         }
// // // // // //       };
      
// // // // // //       console.log('🔧 Fonctions de test disponibles:');
// // // // // //       console.log('- addTestAction(): Ajouter une action de test');
// // // // // //       console.log('- ActionLogger: Objet pour logger les actions');
// // // // // //     }
// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <AuthProvider>
// // // // // //       <NotificationProvider>
// // // // // //         <Router>
// // // // // //           <div className="min-h-screen bg-base-100">
// // // // // //             <AppRoutes />
// // // // // //           </div>
// // // // // //         </Router>
// // // // // //       </NotificationProvider>
// // // // // //     </AuthProvider>
// // // // // //   );
// // // // // // }

// // // // // // // Exportez les fonctions pour les utiliser ailleurs
// // // // // // export { 
// // // // // //   initHistoriqueLocal, 
// // // // // //   ActionLogger,
// // // // // //   initActionLogger,
// // // // // //   logAction 
// // // // // // };

// // // // // // export default App;





// // // // // // src/App.jsx - VERSION CORRIGÉE
// // // // // import React, { useEffect } from 'react';
// // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // // // import { NotificationProvider } from './context/NotificationContext';
// // // // // import { usePermissions } from './hooks/usePermissions';
// // // // // import { ToastContainer } from 'react-toastify';
// // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // Layout Components
// // // // // import Layout from './components/Layout';

// // // // // // Pages
// // // // // import Login from './components/Login';
// // // // // import Register from './components/Register';
// // // // // import Dashboard from './pages/Dashboard';
// // // // // import Materiels from './pages/Materiels';
// // // // // import Logiciels from './pages/Logiciels';
// // // // // import Incidents from './pages/Incidents';
// // // // // import Reparations from './pages/Reparations';
// // // // // import Rapports from './pages/Rapports';
// // // // // import Users from './pages/Users';
// // // // // import Alertes from './pages/Alertes';
// // // // // import Fournisseurs from './pages/Fournisseurs';
// // // // // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // // // // import ConfigurationReseau from './pages/ConfigurationReseau';
// // // // // import Unauthorized from './pages/Unauthorized';

// // // // // // Importez les composants
// // // // // import Historique from './pages/Historique';
// // // // // import InstallationsLogiciels from './pages/InstallationsLogiciels';

// // // // // // Import des utilitaires d'historique
// // // // // import { 
// // // // //   initHistoriqueLocal, 
// // // // //   getHistoriqueLocal, 
// // // // //   addHistoriqueEntry,
// // // // //   ActionLogger,
// // // // //   initActionLogger,
// // // // //   useActionLogger 
// // // // // } from './utils/historyLogger'; // Vous devrez créer ce fichier

// // // // // // ==================== COMPOSANTS DE ROUTE ====================

// // // // // const ProtectedRoute = ({ children, requiredRole = null }) => {
// // // // //   const { user, loading } = useAuth();
// // // // //   const { hasAccess } = usePermissions();
  
// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // //         <div className="text-center">
// // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // //           <p className="text-white">Chargement du système...</p>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }
  
// // // // //   if (!user) {
// // // // //     return <Navigate to="/login" replace />;
// // // // //   }
  
// // // // //   if (requiredRole && !hasAccess(requiredRole)) {
// // // // //     return <Navigate to="/unauthorized" replace />;
// // // // //   }
  
// // // // //   return children;
// // // // // };

// // // // // const PublicRoute = ({ children }) => {
// // // // //   const { user, loading } = useAuth();
  
// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // //         <div className="text-center">
// // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // //           <p className="text-white">Chargement...</p>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }
  
// // // // //   return !user ? children : <Navigate to="/dashboard" replace />;
// // // // // };

// // // // // // ==================== COMPOSANT APP ROUTES ====================

// // // // // const AppRoutes = () => {
// // // // //   const { user, loading } = useAuth();

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // // //         <div className="text-center">
// // // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // // //           <p className="text-white">Initialisation du système...</p>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   if (!user) {
// // // // //     return (
// // // // //       <>
// // // // //         <Routes>
// // // // //           <Route path="/login" element={
// // // // //             <PublicRoute>
// // // // //               <Login />
// // // // //             </PublicRoute>
// // // // //           } />
// // // // //           <Route path="/register" element={
// // // // //             <PublicRoute>
// // // // //               <Register />
// // // // //             </PublicRoute>
// // // // //           } />
// // // // //           <Route path="*" element={<Navigate to="/login" replace />} />
// // // // //         </Routes>
// // // // //         <ToastContainer 
// // // // //           position="top-right"
// // // // //           autoClose={5000}
// // // // //           hideProgressBar={false}
// // // // //           newestOnTop
// // // // //           closeOnClick
// // // // //           rtl={false}
// // // // //           pauseOnFocusLoss
// // // // //           draggable
// // // // //           pauseOnHover
// // // // //         />
// // // // //       </>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <>
// // // // //       <Layout>
// // // // //         <Routes>
// // // // //           <Route path="/unauthorized" element={<Unauthorized />} />
// // // // //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
// // // // //           <Route path="/dashboard" element={
// // // // //             <ProtectedRoute requiredRole="user">
// // // // //               <Dashboard />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/materiels" element={
// // // // //             <ProtectedRoute requiredRole="user">
// // // // //               <Materiels />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/logiciels" element={
// // // // //             <ProtectedRoute requiredRole="user">
// // // // //               <Logiciels />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/incidents" element={
// // // // //             <ProtectedRoute requiredRole="user">
// // // // //               <Incidents />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/reparations" element={
// // // // //             <ProtectedRoute requiredRole="technician">
// // // // //               <Reparations />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/rapports" element={
// // // // //             <ProtectedRoute requiredRole="secretary">
// // // // //               <Rapports />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/users" element={
// // // // //             <ProtectedRoute requiredRole="director">
// // // // //               <Users />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/alertes" element={
// // // // //             <ProtectedRoute requiredRole="technician">
// // // // //               <Alertes />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/fournisseurs" element={
// // // // //             <ProtectedRoute requiredRole="secretary">
// // // // //               <Fournisseurs />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/installations-logiciels" element={
// // // // //             <ProtectedRoute requiredRole="technician">
// // // // //               <InstallationsLogiciels />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/profils-utilisateurs" element={
// // // // //             <ProtectedRoute requiredRole="user">
// // // // //               <ProfilsUtilisateurs />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/configuration-reseau" element={
// // // // //             <ProtectedRoute requiredRole="technician">
// // // // //               <ConfigurationReseau />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/historique" element={
// // // // //             <ProtectedRoute requiredRole="director">
// // // // //               <Historique />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// // // // //           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
// // // // //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// // // // //         </Routes>
// // // // //       </Layout>
// // // // //       <ToastContainer 
// // // // //         position="top-right"
// // // // //         autoClose={5000}
// // // // //         hideProgressBar={false}
// // // // //         newestOnTop
// // // // //         closeOnClick
// // // // //         rtl={false}
// // // // //         pauseOnFocusLoss
// // // // //         draggable
// // // // //         pauseOnHover
// // // // //       />
// // // // //     </>
// // // // //   );
// // // // // };

// // // // // // ==================== COMPOSANT APP PRINCIPAL ====================

// // // // // function App() {
// // // // //   useEffect(() => {
// // // // //     // Initialiser l'historique
// // // // //     initHistoriqueLocal();
    
// // // // //     // Initialiser le logger d'actions
// // // // //     initActionLogger();
    
// // // // //     // Enregistrer le démarrage de l'application
// // // // //     const userStr = localStorage.getItem('user');
// // // // //     if (userStr) {
// // // // //       try {
// // // // //         const user = JSON.parse(userStr);
// // // // //         console.log(`✅ Application démarrée pour: ${user.username}`);
        
// // // // //         // Enregistrer l'action de démarrage
// // // // //         setTimeout(() => {
// // // // //           ActionLogger.custom('DEMARRAGE', 'Système', 'Application démarrée', user.username);
// // // // //         }, 1000);
// // // // //       } catch (error) {
// // // // //         console.error('❌ Erreur parsing user:', error);
// // // // //       }
// // // // //     }
    
// // // // //     // Ajouter un bouton de test dans la console
// // // // //     if (typeof window !== 'undefined') {
// // // // //       window.addTestAction = () => {
// // // // //         const username = prompt("Nom d'utilisateur pour le test:", "admin");
// // // // //         const action = prompt("Action:", "TEST");
// // // // //         const module = prompt("Module:", "Test");
// // // // //         const details = prompt("Détails:", "Action de test manuelle");
        
// // // // //         if (username && action && module && details) {
// // // // //           ActionLogger.custom(action, module, details, username);
// // // // //           alert(`✅ Action "${action}" ajoutée à l'historique!`);
// // // // //         }
// // // // //       };
      
// // // // //       console.log('🔧 Fonctions de test disponibles:');
// // // // //       console.log('- addTestAction(): Ajouter une action de test');
// // // // //       console.log('- ActionLogger: Objet pour logger les actions');
// // // // //       console.log('- useActionLogger: Hook React pour logger');
// // // // //     }
// // // // //   }, []);

// // // // //   return (
// // // // //     <AuthProvider>
// // // // //       <NotificationProvider>
// // // // //         <Router>
// // // // //           <div className="min-h-screen bg-base-100">
// // // // //             <AppRoutes />
// // // // //           </div>
// // // // //         </Router>
// // // // //       </NotificationProvider>
// // // // //     </AuthProvider>
// // // // //   );
// // // // // }

// // // // // export default App;



// // // // // src/App.jsx - VERSION COMPLÈTE AVEC LOGGING D'ACTIONS
// // // // import React, { useEffect } from 'react';
// // // // import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// // // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // // import { NotificationProvider } from './context/NotificationContext';
// // // // import { usePermissions } from './hooks/usePermissions';
// // // // import { ToastContainer } from 'react-toastify';
// // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // Layout Components
// // // // import Layout from './components/Layout';

// // // // // Pages
// // // // import Login from './components/Login';
// // // // import Register from './components/Register';
// // // // import Dashboard from './pages/Dashboard';
// // // // import Materiels from './pages/Materiels';
// // // // import Logiciels from './pages/Logiciels';
// // // // import Incidents from './pages/Incidents';
// // // // import Reparations from './pages/Reparations';
// // // // import Rapports from './pages/Rapports';
// // // // import Users from './pages/Users';
// // // // import Alertes from './pages/Alertes';
// // // // import Fournisseurs from './pages/Fournisseurs';
// // // // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // // // import ConfigurationReseau from './pages/ConfigurationReseau';
// // // // import Unauthorized from './pages/Unauthorized';
// // // // import Historique from './pages/Historique';
// // // // import InstallationsLogiciels from './pages/InstallationsLogiciels';

// // // // // Import du composant QuickActionLogger
// // // // import QuickActionLogger from './components/QuickActionLogger';

// // // // // ==================== FONCTIONS DE L'HISTORIQUE ====================

// // // // // Fonction pour initialiser l'historique local
// // // // const initHistoriqueLocal = () => {
// // // //   console.log('🔄 Initialisation de l\'historique local...');
  
// // // //   const STORAGE_KEY = 'gestion_parc_historique';
  
// // // //   const saved = localStorage.getItem(STORAGE_KEY);
// // // //   if (!saved) {
// // // //     const now = new Date();
// // // //     const defaultData = [
// // // //       {
// // // //         id: 'hist_' + Date.now(),
// // // //         utilisateur: 'admin',
// // // //         action: 'CONNEXION',
// // // //         module: 'Authentification',
// // // //         details: 'Première initialisation du système',
// // // //         date: new Date(now.getTime() - 86400000).toISOString(),
// // // //         ip_address: '192.168.1.1',
// // // //         user_agent: 'Chrome/120.0',
// // // //         status: 'SUCCESS'
// // // //       },
// // // //       {
// // // //         id: 'hist_' + (Date.now() + 1),
// // // //         utilisateur: 'admin',
// // // //         action: 'CREATION',
// // // //         module: 'Utilisateurs',
// // // //         details: 'Création compte technicien',
// // // //         date: new Date(now.getTime() - 172800000).toISOString(),
// // // //         ip_address: '192.168.1.1',
// // // //         user_agent: 'Chrome/120.0',
// // // //         status: 'SUCCESS'
// // // //       },
// // // //       {
// // // //         id: 'hist_' + (Date.now() + 2),
// // // //         utilisateur: 'technicien',
// // // //         action: 'MODIFICATION',
// // // //         module: 'Matériels',
// // // //         details: 'Mise à jour PC-001',
// // // //         date: new Date(now.getTime() - 259200000).toISOString(),
// // // //         ip_address: '192.168.1.2',
// // // //         user_agent: 'Firefox/119.0',
// // // //         status: 'SUCCESS'
// // // //       }
// // // //     ];
    
// // // //     localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
// // // //     console.log(`✅ Historique initialisé avec ${defaultData.length} entrées`);
// // // //   } else {
// // // //     try {
// // // //       const data = JSON.parse(saved);
// // // //       console.log(`✅ Historique déjà initialisé (${data.length} entrées)`);
// // // //     } catch {
// // // //       console.log('⚠️ Historique corrompu, réinitialisation...');
// // // //       localStorage.removeItem(STORAGE_KEY);
// // // //       initHistoriqueLocal();
// // // //     }
// // // //   }
// // // // };

// // // // // Fonction pour logger une action
// // // // const logAction = (action, module, details, username = null) => {
// // // //   try {
// // // //     const userStr = localStorage.getItem('user');
// // // //     const user = userStr ? JSON.parse(userStr) : null;
    
// // // //     const newEntry = {
// // // //       id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
// // // //       utilisateur: username || user?.username || 'System',
// // // //       action: action,
// // // //       module: module,
// // // //       details: details,
// // // //       date: new Date().toISOString(),
// // // //       ip_address: 'localhost',
// // // //       user_agent: navigator.userAgent,
// // // //       status: 'SUCCESS'
// // // //     };
    
// // // //     const STORAGE_KEY = 'gestion_parc_historique';
// // // //     const historique = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
// // // //     const newHistorique = [newEntry, ...historique.slice(0, 99)]; // Limite à 100 entrées
    
// // // //     localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
// // // //     console.log(`📝 Action loggée: ${action} - ${module} - ${details}`);
    
// // // //     // Émettre un événement pour mettre à jour l'UI en temps réel
// // // //     window.dispatchEvent(new CustomEvent('action-logged', { detail: newEntry }));
    
// // // //     return newEntry;
// // // //   } catch (error) {
// // // //     console.error('❌ Erreur logging action:', error);
// // // //     return null;
// // // //   }
// // // // };

// // // // // Objet ActionLogger avec des méthodes prédéfinies
// // // // const ActionLogger = {
// // // //   // Authentification
// // // //   login: (username) => 
// // // //     logAction('CONNEXION', 'Authentification', `Connexion de ${username}`, username),
  
// // // //   logout: (username) => 
// // // //     logAction('DECONNEXION', 'Authentification', `Déconnexion de ${username}`, username),
  
// // // //   // Matériels
// // // //   createMateriel: (nom, username) => 
// // // //     logAction('CREATION', 'Matériels', `Création matériel: ${nom}`, username),
  
// // // //   updateMateriel: (nom, username) => 
// // // //     logAction('MODIFICATION', 'Matériels', `Mise à jour matériel: ${nom}`, username),
  
// // // //   deleteMateriel: (nom, username) => 
// // // //     logAction('SUPPRESSION', 'Matériels', `Suppression matériel: ${nom}`, username),
  
// // // //   // Logiciels
// // // //   createLogiciel: (nom, username) => 
// // // //     logAction('CREATION', 'Logiciels', `Création logiciel: ${nom}`, username),
  
// // // //   updateLogiciel: (nom, username) => 
// // // //     logAction('MODIFICATION', 'Logiciels', `Mise à jour logiciel: ${nom}`, username),
  
// // // //   // Incidents
// // // //   createIncident: (description, username) => 
// // // //     logAction('CREATION', 'Incidents', `Création incident: ${description.substring(0, 50)}...`, username),
  
// // // //   resolveIncident: (id, username) => 
// // // //     logAction('MODIFICATION', 'Incidents', `Résolution incident #${id}`, username),
  
// // // //   // Réparations
// // // //   createReparation: (details, username) => 
// // // //     logAction('CREATION', 'Réparations', `Création réparation: ${details.substring(0, 50)}...`, username),
  
// // // //   // Alertes
// // // //   createAlerte: (titre, username) => 
// // // //     logAction('CREATION', 'Alertes', `Création alerte: ${titre}`, username),
  
// // // //   // Fournisseurs
// // // //   createFournisseur: (nom, username) => 
// // // //     logAction('CREATION', 'Fournisseurs', `Création fournisseur: ${nom}`, username),
  
// // // //   // Utilisateurs
// // // //   createUser: (username, createdBy) => 
// // // //     logAction('CREATION', 'Utilisateurs', `Création utilisateur: ${username}`, createdBy),
  
// // // //   updateUser: (username, updatedBy) => 
// // // //     logAction('MODIFICATION', 'Utilisateurs', `Mise à jour utilisateur: ${username}`, updatedBy),
  
// // // //   // Rapports
// // // //   generateReport: (type, username) => 
// // // //     logAction('GENERATION', 'Rapports', `Génération rapport: ${type}`, username),
  
// // // //   // Navigation
// // // //   viewPage: (page, username) => 
// // // //     logAction('NAVIGATION', 'Système', `Consultation page: ${page}`, username),
  
// // // //   // Générique
// // // //   custom: (action, module, details, username) => 
// // // //     logAction(action, module, details, username)
// // // // };

// // // // // Initialiser les écouteurs d'actions
// // // // const initActionLogger = () => {
// // // //   console.log('🎯 Configuration des écouteurs d\'actions...');
  
// // // //   // Exposer globalement
// // // //   window.ActionLogger = ActionLogger;
  
// // // //   // Écouter les événements de connexion
// // // //   window.addEventListener('user-login', (event) => {
// // // //     const { username } = event.detail || {};
// // // //     if (username) {
// // // //       ActionLogger.login(username);
// // // //     }
// // // //   });
  
// // // //   // Écouter les événements de déconnexion
// // // //   window.addEventListener('user-logout', (event) => {
// // // //     const { username } = event.detail || {};
// // // //     if (username) {
// // // //       ActionLogger.logout(username);
// // // //     }
// // // //   });
  
// // // //   console.log('✅ ActionLogger initialisé');
// // // // };

// // // // // ==================== COMPOSANT POUR LOGGER LA NAVIGATION ====================

// // // // const NavigationLogger = () => {
// // // //   const location = useLocation();
// // // //   const { user } = useAuth();
  
// // // //   useEffect(() => {
// // // //     if (user && window.ActionLogger) {
// // // //       // Logger la navigation après un court délai
// // // //       setTimeout(() => {
// // // //         window.ActionLogger.viewPage(location.pathname, user.username);
// // // //       }, 500);
// // // //     }
// // // //   }, [location.pathname, user]);
  
// // // //   return null;
// // // // };

// // // // // ==================== COMPOSANTS DE ROUTE ====================

// // // // const ProtectedRoute = ({ children, requiredRole = null }) => {
// // // //   const { user, loading } = useAuth();
// // // //   const { hasAccess } = usePermissions();
  
// // // //   if (loading) {
// // // //     return (
// // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // //         <div className="text-center">
// // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // //           <p className="text-white">Chargement du système...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }
  
// // // //   if (!user) {
// // // //     return <Navigate to="/login" replace />;
// // // //   }
  
// // // //   if (requiredRole && !hasAccess(requiredRole)) {
// // // //     return <Navigate to="/unauthorized" replace />;
// // // //   }
  
// // // //   return children;
// // // // };

// // // // const PublicRoute = ({ children }) => {
// // // //   const { user, loading } = useAuth();
  
// // // //   if (loading) {
// // // //     return (
// // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // //         <div className="text-center">
// // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // //           <p className="text-white">Chargement...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }
  
// // // //   return !user ? children : <Navigate to="/dashboard" replace />;
// // // // };

// // // // // ==================== COMPOSANT APP ROUTES ====================

// // // // const AppRoutes = () => {
// // // //   const { user, loading } = useAuth();

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // // //         <div className="text-center">
// // // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // // //           <p className="text-white">Initialisation du système...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (!user) {
// // // //     return (
// // // //       <>
// // // //         <Routes>
// // // //           <Route path="/login" element={
// // // //             <PublicRoute>
// // // //               <Login />
// // // //             </PublicRoute>
// // // //           } />
// // // //           <Route path="/register" element={
// // // //             <PublicRoute>
// // // //               <Register />
// // // //             </PublicRoute>
// // // //           } />
// // // //           <Route path="*" element={<Navigate to="/login" replace />} />
// // // //         </Routes>
// // // //         <ToastContainer 
// // // //           position="top-right"
// // // //           autoClose={5000}
// // // //           hideProgressBar={false}
// // // //           newestOnTop
// // // //           closeOnClick
// // // //           rtl={false}
// // // //           pauseOnFocusLoss
// // // //           draggable
// // // //           pauseOnHover
// // // //         />
// // // //       </>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <>
// // // //       <Layout>
// // // //         <NavigationLogger />
// // // //         <Routes>
// // // //           <Route path="/unauthorized" element={<Unauthorized />} />
// // // //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
// // // //           <Route path="/dashboard" element={
// // // //             <ProtectedRoute requiredRole="user">
// // // //               <Dashboard />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/materiels" element={
// // // //             <ProtectedRoute requiredRole="user">
// // // //               <Materiels />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/logiciels" element={
// // // //             <ProtectedRoute requiredRole="user">
// // // //               <Logiciels />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/incidents" element={
// // // //             <ProtectedRoute requiredRole="user">
// // // //               <Incidents />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/reparations" element={
// // // //             <ProtectedRoute requiredRole="technician">
// // // //               <Reparations />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/rapports" element={
// // // //             <ProtectedRoute requiredRole="secretary">
// // // //               <Rapports />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/users" element={
// // // //             <ProtectedRoute requiredRole="director">
// // // //               <Users />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/alertes" element={
// // // //             <ProtectedRoute requiredRole="technician">
// // // //               <Alertes />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/fournisseurs" element={
// // // //             <ProtectedRoute requiredRole="secretary">
// // // //               <Fournisseurs />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/installations-logiciels" element={
// // // //             <ProtectedRoute requiredRole="technician">
// // // //               <InstallationsLogiciels />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/profils-utilisateurs" element={
// // // //             <ProtectedRoute requiredRole="user">
// // // //               <ProfilsUtilisateurs />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/configuration-reseau" element={
// // // //             <ProtectedRoute requiredRole="technician">
// // // //               <ConfigurationReseau />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/historique" element={
// // // //             <ProtectedRoute requiredRole="director">
// // // //               <Historique />
// // // //             </ProtectedRoute>
// // // //           } />
          
// // // //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// // // //           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
// // // //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// // // //         </Routes>
        
// // // //         {/* Composant pour ajouter des actions manuellement */}
// // // //         <QuickActionLogger />
// // // //       </Layout>
// // // //       <ToastContainer 
// // // //         position="top-right"
// // // //         autoClose={5000}
// // // //         hideProgressBar={false}
// // // //         newestOnTop
// // // //         closeOnClick
// // // //         rtl={false}
// // // //         pauseOnFocusLoss
// // // //         draggable
// // // //         pauseOnHover
// // // //       />
// // // //     </>
// // // //   );
// // // // };

// // // // // ==================== COMPOSANT APP PRINCIPAL ====================

// // // // function App() {
// // // //   useEffect(() => {
// // // //     // Initialiser l'historique
// // // //     initHistoriqueLocal();
    
// // // //     // Initialiser le logger d'actions
// // // //     initActionLogger();
    
// // // //     // Enregistrer le démarrage de l'application
// // // //     const userStr = localStorage.getItem('user');
// // // //     if (userStr) {
// // // //       try {
// // // //         const user = JSON.parse(userStr);
// // // //         console.log(`✅ Application démarrée pour: ${user.username}`);
        
// // // //         // Enregistrer l'action de démarrage
// // // //         setTimeout(() => {
// // // //           ActionLogger.custom('DEMARRAGE', 'Système', 'Application démarrée', user.username);
// // // //         }, 1000);
// // // //       } catch (error) {
// // // //         console.error('❌ Erreur parsing user:', error);
// // // //       }
// // // //     }
    
// // // //     // Ajouter un bouton de test dans la console
// // // //     if (typeof window !== 'undefined') {
// // // //       window.addTestAction = () => {
// // // //         const username = prompt("Nom d'utilisateur pour le test:", "admin");
// // // //         const action = prompt("Action:", "TEST");
// // // //         const module = prompt("Module:", "Test");
// // // //         const details = prompt("Détails:", "Action de test manuelle");
        
// // // //         if (username && action && module && details) {
// // // //           ActionLogger.custom(action, module, details, username);
// // // //           alert(`✅ Action "${action}" ajoutée à l'historique!`);
// // // //         }
// // // //       };
      
// // // //       console.log('🔧 Fonctions de test disponibles:');
// // // //       console.log('- addTestAction(): Ajouter une action de test');
// // // //       console.log('- ActionLogger: Objet pour logger les actions');
// // // //     }
// // // //   }, []);

// // // //   return (
// // // //     <AuthProvider>
// // // //       <NotificationProvider>
// // // //         <Router>
// // // //           <div className="min-h-screen bg-base-100">
// // // //             <AppRoutes />
// // // //           </div>
// // // //         </Router>
// // // //       </NotificationProvider>
// // // //     </AuthProvider>
// // // //   );
// // // // }

// // // // // Exportez les fonctions pour les utiliser ailleurs
// // // // export { 
// // // //   initHistoriqueLocal, 
// // // //   ActionLogger,
// // // //   initActionLogger,
// // // //   logAction 
// // // // };

// // // // export default App;





// // // src/App.jsx - VERSION COMPLÈTE AVEC LOGGING D'ACTIONS
// // import React, { useEffect } from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// // import { AuthProvider, useAuth } from './context/AuthContext';
// // import { NotificationProvider } from './context/NotificationContext';
// // import { usePermissions } from './hooks/usePermissions';
// // import { ToastContainer } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// // // Layout Components
// // import Layout from './components/Layout';

// // // Pages
// // import Login from './components/Login';
// // import Register from './components/Register';
// // import Dashboard from './pages/Dashboard';
// // import Materiels from './pages/Materiels';
// // import Logiciels from './pages/Logiciels';
// // import Incidents from './pages/Incidents';
// // import Reparations from './pages/Reparations';
// // import Rapports from './pages/Rapports';
// // import Users from './pages/Users';
// // import Alertes from './pages/Alertes';
// // import Fournisseurs from './pages/Fournisseurs';
// // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // import ConfigurationReseau from './pages/ConfigurationReseau';
// // import Unauthorized from './pages/Unauthorized';
// // import Historique from './pages/Historique';
// // import InstallationsLogiciels from './pages/InstallationsLogiciels';

// // // Import du composant QuickActionLogger
// // import QuickActionLogger from './components/QuickActionLogger';

// // // ==================== FONCTIONS DE L'HISTORIQUE ====================

// // // Fonction pour initialiser l'historique local
// // const initHistoriqueLocal = () => {
// //   console.log('🔄 Initialisation de l\'historique local...');
  
// //   const STORAGE_KEY = 'gestion_parc_historique';
  
// //   const saved = localStorage.getItem(STORAGE_KEY);
// //   if (!saved) {
// //     const now = new Date();
// //     const defaultData = [
// //       {
// //         id: 'hist_' + Date.now(),
// //         utilisateur: 'admin',
// //         action: 'CONNEXION',
// //         module: 'Authentification',
// //         details: 'Première initialisation du système',
// //         date: new Date(now.getTime() - 86400000).toISOString(),
// //         ip_address: '192.168.1.1',
// //         user_agent: 'Chrome/120.0',
// //         status: 'SUCCESS'
// //       },
// //       {
// //         id: 'hist_' + (Date.now() + 1),
// //         utilisateur: 'admin',
// //         action: 'CREATION',
// //         module: 'Utilisateurs',
// //         details: 'Création compte technicien',
// //         date: new Date(now.getTime() - 172800000).toISOString(),
// //         ip_address: '192.168.1.1',
// //         user_agent: 'Chrome/120.0',
// //         status: 'SUCCESS'
// //       },
// //       {
// //         id: 'hist_' + (Date.now() + 2),
// //         utilisateur: 'technicien',
// //         action: 'MODIFICATION',
// //         module: 'Matériels',
// //         details: 'Mise à jour PC-001',
// //         date: new Date(now.getTime() - 259200000).toISOString(),
// //         ip_address: '192.168.1.2',
// //         user_agent: 'Firefox/119.0',
// //         status: 'SUCCESS'
// //       }
// //     ];
    
// //     localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
// //     console.log(`✅ Historique initialisé avec ${defaultData.length} entrées`);
// //   } else {
// //     try {
// //       const data = JSON.parse(saved);
// //       console.log(`✅ Historique déjà initialisé (${data.length} entrées)`);
// //     } catch {
// //       console.log('⚠️ Historique corrompu, réinitialisation...');
// //       localStorage.removeItem(STORAGE_KEY);
// //       initHistoriqueLocal();
// //     }
// //   }
// // };

// // // Fonction pour logger une action
// // const logAction = (action, module, details, username = null) => {
// //   try {
// //     const userStr = localStorage.getItem('user');
// //     const user = userStr ? JSON.parse(userStr) : null;
    
// //     const newEntry = {
// //       id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
// //       utilisateur: username || user?.username || 'System',
// //       action: action,
// //       module: module,
// //       details: details,
// //       date: new Date().toISOString(),
// //       ip_address: 'localhost',
// //       user_agent: navigator.userAgent,
// //       status: 'SUCCESS'
// //     };
    
// //     const STORAGE_KEY = 'gestion_parc_historique';
// //     const historique = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
// //     const newHistorique = [newEntry, ...historique.slice(0, 99)]; // Limite à 100 entrées
    
// //     localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
// //     console.log(`📝 Action loggée: ${action} - ${module} - ${details}`);
    
// //     // Émettre un événement pour mettre à jour l'UI en temps réel
// //     window.dispatchEvent(new CustomEvent('action-logged', { detail: newEntry }));
    
// //     return newEntry;
// //   } catch (error) {
// //     console.error('❌ Erreur logging action:', error);
// //     return null;
// //   }
// // };

// // // Objet ActionLogger avec des méthodes prédéfinies
// // const ActionLogger = {
// //   // Authentification
// //   login: (username) => 
// //     logAction('CONNEXION', 'Authentification', `Connexion de ${username}`, username),
  
// //   logout: (username) => 
// //     logAction('DECONNEXION', 'Authentification', `Déconnexion de ${username}`, username),
  
// //   // Matériels
// //   createMateriel: (nom, username) => 
// //     logAction('CREATION', 'Matériels', `Création matériel: ${nom}`, username),
  
// //   updateMateriel: (nom, username) => 
// //     logAction('MODIFICATION', 'Matériels', `Mise à jour matériel: ${nom}`, username),
  
// //   deleteMateriel: (nom, username) => 
// //     logAction('SUPPRESSION', 'Matériels', `Suppression matériel: ${nom}`, username),
  
// //   // Logiciels
// //   createLogiciel: (nom, username) => 
// //     logAction('CREATION', 'Logiciels', `Création logiciel: ${nom}`, username),
  
// //   updateLogiciel: (nom, username) => 
// //     logAction('MODIFICATION', 'Logiciels', `Mise à jour logiciel: ${nom}`, username),
  
// //   // Incidents
// //   createIncident: (description, username) => 
// //     logAction('CREATION', 'Incidents', `Création incident: ${description.substring(0, 50)}...`, username),
  
// //   resolveIncident: (id, username) => 
// //     logAction('MODIFICATION', 'Incidents', `Résolution incident #${id}`, username),
  
// //   // Réparations
// //   createReparation: (details, username) => 
// //     logAction('CREATION', 'Réparations', `Création réparation: ${details.substring(0, 50)}...`, username),
  
// //   // Alertes
// //   createAlerte: (titre, username) => 
// //     logAction('CREATION', 'Alertes', `Création alerte: ${titre}`, username),
  
// //   // Fournisseurs
// //   createFournisseur: (nom, username) => 
// //     logAction('CREATION', 'Fournisseurs', `Création fournisseur: ${nom}`, username),
  
// //   // Utilisateurs
// //   createUser: (username, createdBy) => 
// //     logAction('CREATION', 'Utilisateurs', `Création utilisateur: ${username}`, createdBy),
  
// //   updateUser: (username, updatedBy) => 
// //     logAction('MODIFICATION', 'Utilisateurs', `Mise à jour utilisateur: ${username}`, updatedBy),
  
// //   // Rapports
// //   generateReport: (type, username) => 
// //     logAction('GENERATION', 'Rapports', `Génération rapport: ${type}`, username),
  
// //   // Navigation
// //   viewPage: (page, username) => 
// //     logAction('NAVIGATION', 'Système', `Consultation page: ${page}`, username),
  
// //   // Générique
// //   custom: (action, module, details, username) => 
// //     logAction(action, module, details, username)
// // };

// // // Initialiser les écouteurs d'actions
// // const initActionLogger = () => {
// //   console.log('🎯 Configuration des écouteurs d\'actions...');
  
// //   // Exposer globalement
// //   window.ActionLogger = ActionLogger;
  
// //   // Écouter les événements de connexion
// //   window.addEventListener('user-login', (event) => {
// //     const { username } = event.detail || {};
// //     if (username) {
// //       ActionLogger.login(username);
// //     }
// //   });
  
// //   // Écouter les événements de déconnexion
// //   window.addEventListener('user-logout', (event) => {
// //     const { username } = event.detail || {};
// //     if (username) {
// //       ActionLogger.logout(username);
// //     }
// //   });
  
// //   console.log('✅ ActionLogger initialisé');
// // };

// // // ==================== COMPOSANT POUR LOGGER LA NAVIGATION ====================

// // const NavigationLogger = () => {
// //   const location = useLocation();
// //   const { user } = useAuth();
  
// //   useEffect(() => {
// //     if (user && window.ActionLogger) {
// //       // Logger la navigation après un court délai
// //       setTimeout(() => {
// //         window.ActionLogger.viewPage(location.pathname, user.username);
// //       }, 500);
// //     }
// //   }, [location.pathname, user]);
  
// //   return null;
// // };

// // // ==================== COMPOSANTS DE ROUTE ====================

// // const ProtectedRoute = ({ children, requiredRole = null }) => {
// //   const { user, loading } = useAuth();
// //   const { hasAccess } = usePermissions();
  
// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// //         <div className="text-center">
// //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// //           <p className="text-white">Chargement du système...</p>
// //         </div>
// //       </div>
// //     );
// //   }
  
// //   if (!user) {
// //     return <Navigate to="/login" replace />;
// //   }
  
// //   if (requiredRole && !hasAccess(requiredRole)) {
// //     return <Navigate to="/unauthorized" replace />;
// //   }
  
// //   return children;
// // };

// // const PublicRoute = ({ children }) => {
// //   const { user, loading } = useAuth();
  
// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// //         <div className="text-center">
// //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// //           <p className="text-white">Chargement...</p>
// //         </div>
// //       </div>
// //     );
// //   }
  
// //   return !user ? children : <Navigate to="/dashboard" replace />;
// // };

// // // ==================== COMPOSANT APP ROUTES ====================

// // const AppRoutes = () => {
// //   const { user, loading } = useAuth();

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// //         <div className="text-center">
// //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// //           <p className="text-white">Initialisation du système...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!user) {
// //     return (
// //       <>
// //         <Routes>
// //           <Route path="/login" element={
// //             <PublicRoute>
// //               <Login />
// //             </PublicRoute>
// //           } />
// //           <Route path="/register" element={
// //             <PublicRoute>
// //               <Register />
// //             </PublicRoute>
// //           } />
// //           <Route path="*" element={<Navigate to="/login" replace />} />
// //         </Routes>
// //         <ToastContainer 
// //           position="top-right"
// //           autoClose={5000}
// //           hideProgressBar={false}
// //           newestOnTop
// //           closeOnClick
// //           rtl={false}
// //           pauseOnFocusLoss
// //           draggable
// //           pauseOnHover
// //         />
// //       </>
// //     );
// //   }

// //   return (
// //     <>
// //       <Layout>
// //         <NavigationLogger />
// //         <Routes>
// //           <Route path="/unauthorized" element={<Unauthorized />} />
// //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
// //           <Route path="/dashboard" element={
// //             <ProtectedRoute requiredRole="user">
// //               <Dashboard />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/materiels" element={
// //             <ProtectedRoute requiredRole="user">
// //               <Materiels />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/logiciels" element={
// //             <ProtectedRoute requiredRole="user">
// //               <Logiciels />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/incidents" element={
// //             <ProtectedRoute requiredRole="user">
// //               <Incidents />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/reparations" element={
// //             <ProtectedRoute requiredRole="technician">
// //               <Reparations />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/rapports" element={
// //             <ProtectedRoute requiredRole="secretary">
// //               <Rapports />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/users" element={
// //             <ProtectedRoute requiredRole="director">
// //               <Users />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/alertes" element={
// //             <ProtectedRoute requiredRole="technician">
// //               <Alertes />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/fournisseurs" element={
// //             <ProtectedRoute requiredRole="secretary">
// //               <Fournisseurs />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/installations-logiciels" element={
// //             <ProtectedRoute requiredRole="technician">
// //               <InstallationsLogiciels />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/profils-utilisateurs" element={
// //             <ProtectedRoute requiredRole="user">
// //               <ProfilsUtilisateurs />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/configuration-reseau" element={
// //             <ProtectedRoute requiredRole="technician">
// //               <ConfigurationReseau />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/historique" element={
// //             <ProtectedRoute requiredRole="director">
// //               <Historique />
// //             </ProtectedRoute>
// //           } />
          
// //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// //           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
// //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// //         </Routes>
        
// //         {/* Composant pour ajouter des actions manuellement */}
// //         <QuickActionLogger />
// //       </Layout>
// //       <ToastContainer 
// //         position="top-right"
// //         autoClose={5000}
// //         hideProgressBar={false}
// //         newestOnTop
// //         closeOnClick
// //         rtl={false}
// //         pauseOnFocusLoss
// //         draggable
// //         pauseOnHover
// //       />
// //     </>
// //   );
// // };

// // // ==================== COMPOSANT APP PRINCIPAL ====================

// // function App() {
// //   useEffect(() => {
// //     // Initialiser l'historique
// //     initHistoriqueLocal();
    
// //     // Initialiser le logger d'actions
// //     initActionLogger();
    
// //     // Enregistrer le démarrage de l'application
// //     const userStr = localStorage.getItem('user');
// //     if (userStr) {
// //       try {
// //         const user = JSON.parse(userStr);
// //         console.log(`✅ Application démarrée pour: ${user.username}`);
        
// //         // Enregistrer l'action de démarrage
// //         setTimeout(() => {
// //           ActionLogger.custom('DEMARRAGE', 'Système', 'Application démarrée', user.username);
// //         }, 1000);
// //       } catch (error) {
// //         console.error('❌ Erreur parsing user:', error);
// //       }
// //     }
    
// //     // Ajouter un bouton de test dans la console
// //     if (typeof window !== 'undefined') {
// //       window.addTestAction = () => {
// //         const username = prompt("Nom d'utilisateur pour le test:", "admin");
// //         const action = prompt("Action:", "TEST");
// //         const module = prompt("Module:", "Test");
// //         const details = prompt("Détails:", "Action de test manuelle");
        
// //         if (username && action && module && details) {
// //           ActionLogger.custom(action, module, details, username);
// //           alert(`✅ Action "${action}" ajoutée à l'historique!`);
// //         }
// //       };
      
// //       console.log('🔧 Fonctions de test disponibles:');
// //       console.log('- addTestAction(): Ajouter une action de test');
// //       console.log('- ActionLogger: Objet pour logger les actions');
// //     }
// //   }, []);

// //   return (
// //     <AuthProvider>
// //       <NotificationProvider>
// //         <Router>
// //           <div className="min-h-screen bg-base-100">
// //             <AppRoutes />
// //           </div>
// //         </Router>
// //       </NotificationProvider>
// //     </AuthProvider>
// //   );
// // }

// // // Exportez les fonctions pour les utiliser ailleurs
// // export { 
// //   initHistoriqueLocal, 
// //   ActionLogger,
// //   initActionLogger,
// //   logAction 
// // };

// // export default App;









// // // // src/App.jsx - VERSION COMPLÈTE AVEC LOGGER CRUD
// // // import React, { useEffect } from 'react';
// // // import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // import { NotificationProvider } from './context/NotificationContext';
// // // import { usePermissions } from './hooks/usePermissions';
// // // import { ToastContainer } from 'react-toastify';
// // // import 'react-toastify/dist/ReactToastify.css';

// // // // Layout Components
// // // import Layout from './components/Layout';

// // // // Pages
// // // import Login from './components/Login';
// // // import Register from './components/Register';
// // // import Dashboard from './pages/Dashboard';
// // // import Materiels from './pages/Materiels';
// // // import Logiciels from './pages/Logiciels';
// // // import Incidents from './pages/Incidents';
// // // import Reparations from './pages/Reparations';
// // // import Rapports from './pages/Rapports';
// // // import Users from './pages/Users';
// // // import Alertes from './pages/Alertes';
// // // import Fournisseurs from './pages/Fournisseurs';
// // // import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // // import ConfigurationReseau from './pages/ConfigurationReseau';
// // // import Unauthorized from './pages/Unauthorized';
// // // import Historique from './pages/Historique';
// // // import InstallationsLogiciels from './pages/InstallationsLogiciels';

// // // // Import du composant QuickActionLogger
// // // import QuickActionLogger from './components/QuickActionLogger';

// // // // ==================== FONCTIONS DE L'HISTORIQUE COMPLET ====================

// // // // Fonction pour initialiser l'historique local
// // // const initHistoriqueLocal = () => {
// // //   console.log('🔄 Initialisation de l\'historique local...');
  
// // //   const STORAGE_KEY = 'gestion_parc_historique';
  
// // //   const saved = localStorage.getItem(STORAGE_KEY);
// // //   if (!saved) {
// // //     const now = new Date();
// // //     const defaultData = [
// // //       {
// // //         id: 'hist_' + Date.now(),
// // //         utilisateur: 'admin',
// // //         action: 'CONNEXION',
// // //         module: 'Authentification',
// // //         details: 'Admin connecté au système DREN AA',
// // //         fullDetails: JSON.stringify({
// // //           username: 'admin',
// // //           ip: '192.168.1.1',
// // //           browser: 'Chrome/120.0',
// // //           timestamp: new Date(now.getTime() - 86400000).toISOString()
// // //         }, null, 2),
// // //         date: new Date(now.getTime() - 86400000).toISOString(),
// // //         ip_address: '192.168.1.1',
// // //         user_agent: 'Chrome/120.0',
// // //         status: 'SUCCESS'
// // //       }
// // //     ];
    
// // //     localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
// // //     console.log(`✅ Historique initialisé avec ${defaultData.length} entrée`);
// // //   } else {
// // //     try {
// // //       const data = JSON.parse(saved);
// // //       console.log(`✅ Historique déjà initialisé (${data.length} entrées)`);
// // //     } catch {
// // //       console.log('⚠️ Historique corrompu, réinitialisation...');
// // //       localStorage.removeItem(STORAGE_KEY);
// // //       initHistoriqueLocal();
// // //     }
// // //   }
// // // };

// // // // Fonction pour logger une action avec tous les détails
// // // const logAction = (action, module, details, fullDetails = {}, username = null) => {
// // //   try {
// // //     const userStr = localStorage.getItem('user');
// // //     const user = userStr ? JSON.parse(userStr) : null;
    
// // //     const currentUser = username || user?.username || 'System';
    
// // //     const newEntry = {
// // //       id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
// // //       utilisateur: currentUser,
// // //       action: action,
// // //       module: module,
// // //       details: details,
// // //       fullDetails: typeof fullDetails === 'string' ? fullDetails : JSON.stringify(fullDetails, null, 2),
// // //       date: new Date().toISOString(),
// // //       ip_address: 'localhost',
// // //       user_agent: navigator.userAgent,
// // //       status: 'SUCCESS'
// // //     };
    
// // //     const STORAGE_KEY = 'gestion_parc_historique';
// // //     const historique = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
// // //     const newHistorique = [newEntry, ...historique.slice(0, 499)]; // Limite à 500 entrées
    
// // //     localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
// // //     console.log(`📝 Action loggée: ${currentUser} - ${action} - ${module}`);
    
// // //     // Émettre un événement pour mettre à jour l'UI en temps réel
// // //     window.dispatchEvent(new CustomEvent('action-logged', { detail: newEntry }));
    
// // //     return newEntry;
// // //   } catch (error) {
// // //     console.error('❌ Erreur logging action:', error);
// // //     return null;
// // //   }
// // // };

// // // // Objet ActionLogger complet pour toutes les actions CRUD
// // // const ActionLogger = {
// // //   // ========== AUTHENTIFICATION ==========
// // //   login: (username, userData = {}) => {
// // //     const fullDetails = {
// // //       username: username,
// // //       userData: userData,
// // //       ip: 'localhost',
// // //       browser: navigator.userAgent,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     return logAction('CONNEXION', 'Authentification', `Connexion de ${username}`, fullDetails, username);
// // //   },
  
// // //   logout: (username) => {
// // //     const fullDetails = {
// // //       username: username,
// // //       action: 'logout',
// // //       timestamp: new Date().toISOString(),
// // //       sessionDuration: 'N/A'
// // //     };
// // //     return logAction('DECONNEXION', 'Authentification', `Déconnexion de ${username}`, fullDetails, username);
// // //   },
  
// // //   register: (username, userData = {}) => {
// // //     const fullDetails = {
// // //       newUser: username,
// // //       userData: userData,
// // //       createdBy: 'self',
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     return logAction('CREATION COMPTE', 'Authentification', `Création compte ${username}`, fullDetails, username);
// // //   },
  
// // //   // ========== MATÉRIELS ==========
// // //   createMateriel: (materielData, username) => {
// // //     const fullDetails = {
// // //       action: 'create',
// // //       module: 'Matériels',
// // //       data: materielData,
// // //       createdBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const nom = materielData.nom || materielData.reference || 'Matériel sans nom';
// // //     return logAction('AJOUT', 'Matériels', `Ajout matériel: ${nom}`, fullDetails, username);
// // //   },
  
// // //   updateMateriel: (materielId, oldData, newData, username) => {
// // //     const fullDetails = {
// // //       action: 'update',
// // //       module: 'Matériels',
// // //       materielId: materielId,
// // //       oldData: oldData,
// // //       newData: newData,
// // //       changes: getObjectChanges(oldData, newData),
// // //       updatedBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const nom = newData.nom || oldData.nom || `Matériel #${materielId}`;
// // //     return logAction('MODIFICATION', 'Matériels', `Modification matériel: ${nom}`, fullDetails, username);
// // //   },
  
// // //   deleteMateriel: (materielData, username) => {
// // //     const fullDetails = {
// // //       action: 'delete',
// // //       module: 'Matériels',
// // //       data: materielData,
// // //       deletedBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const nom = materielData.nom || materielData.reference || 'Matériel';
// // //     return logAction('SUPPRESSION', 'Matériels', `Suppression matériel: ${nom}`, fullDetails, username);
// // //   },
  
// // //   viewMateriel: (materielId, username) => {
// // //     const fullDetails = {
// // //       action: 'view',
// // //       module: 'Matériels',
// // //       materielId: materielId,
// // //       viewedBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     return logAction('CONSULTATION', 'Matériels', `Consultation matériel #${materielId}`, fullDetails, username);
// // //   },
  
// // //   // ========== LOGICIELS ==========
// // //   createLogiciel: (logicielData, username) => {
// // //     const fullDetails = {
// // //       action: 'create',
// // //       module: 'Logiciels',
// // //       data: logicielData,
// // //       createdBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const nom = logicielData.nom || logicielData.type || 'Logiciel';
// // //     return logAction('AJOUT', 'Logiciels', `Ajout logiciel: ${nom}`, fullDetails, username);
// // //   },
  
// // //   updateLogiciel: (logicielId, oldData, newData, username) => {
// // //     const fullDetails = {
// // //       action: 'update',
// // //       module: 'Logiciels',
// // //       logicielId: logicielId,
// // //       oldData: oldData,
// // //       newData: newData,
// // //       changes: getObjectChanges(oldData, newData),
// // //       updatedBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const nom = newData.nom || oldData.nom || `Logiciel #${logicielId}`;
// // //     return logAction('MODIFICATION', 'Logiciels', `Modification logiciel: ${nom}`, fullDetails, username);
// // //   },
  
// // //   deleteLogiciel: (logicielData, username) => {
// // //     const fullDetails = {
// // //       action: 'delete',
// // //       module: 'Logiciels',
// // //       data: logicielData,
// // //       deletedBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const nom = logicielData.nom || logicielData.type || 'Logiciel';
// // //     return logAction('SUPPRESSION', 'Logiciels', `Suppression logiciel: ${nom}`, fullDetails, username);
// // //   },
  
// // //   // ========== INCIDENTS ==========
// // //   createIncident: (incidentData, username) => {
// // //     const fullDetails = {
// // //       action: 'create',
// // //       module: 'Incidents',
// // //       data: incidentData,
// // //       createdBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const desc = incidentData.description ? incidentData.description.substring(0, 50) + '...' : 'Incident';
// // //     return logAction('AJOUT', 'Incidents', `Ajout incident: ${desc}`, fullDetails, username);
// // //   },
  
// // //   resolveIncident: (incidentId, resolution, username) => {
// // //     const fullDetails = {
// // //       action: 'resolve',
// // //       module: 'Incidents',
// // //       incidentId: incidentId,
// // //       resolution: resolution,
// // //       resolvedBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     return logAction('RÉSOLUTION', 'Incidents', `Résolution incident #${incidentId}`, fullDetails, username);
// // //   },
  
// // //   // ========== RÉPARATIONS ==========
// // //   createReparation: (reparationData, username) => {
// // //     const fullDetails = {
// // //       action: 'create',
// // //       module: 'Réparations',
// // //       data: reparationData,
// // //       createdBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     return logAction('AJOUT', 'Réparations', `Ajout réparation`, fullDetails, username);
// // //   },
  
// // //   // ========== ALERTES ==========
// // //   createAlerte: (alerteData, username) => {
// // //     const fullDetails = {
// // //       action: 'create',
// // //       module: 'Alertes',
// // //       data: alerteData,
// // //       createdBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const titre = alerteData.titre || 'Alerte';
// // //     return logAction('AJOUT', 'Alertes', `Ajout alerte: ${titre}`, fullDetails, username);
// // //   },
  
// // //   // ========== FOURNISSEURS ==========
// // //   createFournisseur: (fournisseurData, username) => {
// // //     const fullDetails = {
// // //       action: 'create',
// // //       module: 'Fournisseurs',
// // //       data: fournisseurData,
// // //       createdBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const nom = fournisseurData.nom || 'Fournisseur';
// // //     return logAction('AJOUT', 'Fournisseurs', `Ajout fournisseur: ${nom}`, fullDetails, username);
// // //   },
  
// // //   // ========== UTILISATEURS ==========
// // //   createUser: (userData, createdBy) => {
// // //     const fullDetails = {
// // //       action: 'create',
// // //       module: 'Utilisateurs',
// // //       newUser: userData,
// // //       createdBy: createdBy,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const username = userData.username || 'Nouvel utilisateur';
// // //     return logAction('CREATION COMPTE', 'Utilisateurs', `Création compte: ${username}`, fullDetails, createdBy);
// // //   },
  
// // //   updateUser: (userId, oldData, newData, updatedBy) => {
// // //     const fullDetails = {
// // //       action: 'update',
// // //       module: 'Utilisateurs',
// // //       userId: userId,
// // //       oldData: oldData,
// // //       newData: newData,
// // //       changes: getObjectChanges(oldData, newData),
// // //       updatedBy: updatedBy,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const username = newData.username || oldData.username || `Utilisateur #${userId}`;
// // //     return logAction('MODIFICATION', 'Utilisateurs', `Modification utilisateur: ${username}`, fullDetails, updatedBy);
// // //   },
  
// // //   deleteUser: (userData, deletedBy) => {
// // //     const fullDetails = {
// // //       action: 'delete',
// // //       module: 'Utilisateurs',
// // //       deletedUser: userData,
// // //       deletedBy: deletedBy,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const username = userData.username || 'Utilisateur';
// // //     return logAction('SUPPRESSION', 'Utilisateurs', `Suppression utilisateur: ${username}`, fullDetails, deletedBy);
// // //   },
  
// // //   // ========== RAPPORTS ==========
// // //   generateReport: (reportType, format, filters = {}, username) => {
// // //     const fullDetails = {
// // //       action: 'export',
// // //       module: 'Rapports',
// // //       reportType: reportType,
// // //       format: format,
// // //       filters: filters,
// // //       generatedBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     return logAction('EXPORTATION', 'Rapports', `Export ${format}: ${reportType}`, fullDetails, username);
// // //   },
  
// // //   // ========== NAVIGATION ==========
// // //   viewPage: (page, username, pageData = {}) => {
// // //     const fullDetails = {
// // //       action: 'navigation',
// // //       page: page,
// // //       pageData: pageData,
// // //       viewedBy: username,
// // //       timestamp: new Date().toISOString()
// // //     };
// // //     const pageName = getPageName(page);
// // //     return logAction('NAVIGATION', 'Navigation', `Page: ${pageName}`, fullDetails, username);
// // //   },
  
// // //   // ========== GÉNÉRIQUE ==========
// // //   custom: (action, module, details, fullDetails = {}, username) => {
// // //     return logAction(action, module, details, fullDetails, username);
// // //   }
// // // };

// // // // Fonction utilitaire pour détecter les changements
// // // const getObjectChanges = (oldObj, newObj) => {
// // //   const changes = {};
// // //   const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
  
// // //   allKeys.forEach(key => {
// // //     if (JSON.stringify(oldObj?.[key]) !== JSON.stringify(newObj?.[key])) {
// // //       changes[key] = {
// // //         old: oldObj?.[key],
// // //         new: newObj?.[key]
// // //       };
// // //     }
// // //   });
  
// // //   return changes;
// // // };

// // // // Fonction pour obtenir le nom de la page
// // // const getPageName = (path) => {
// // //   const pages = {
// // //     '/dashboard': 'Tableau de bord',
// // //     '/materiels': 'Matériels',
// // //     '/logiciels': 'Logiciels',
// // //     '/incidents': 'Incidents',
// // //     '/reparations': 'Réparations',
// // //     '/rapports': 'Rapports',
// // //     '/users': 'Utilisateurs',
// // //     '/alertes': 'Alertes',
// // //     '/fournisseurs': 'Fournisseurs',
// // //     '/profils-utilisateurs': 'Profils utilisateurs',
// // //     '/configuration-reseau': 'Configuration réseau',
// // //     '/historique': 'Historique',
// // //     '/installations-logiciels': 'Installations logiciels'
// // //   };
  
// // //   return pages[path] || path;
// // // };

// // // // Initialiser les écouteurs d'actions
// // // const initActionLogger = () => {
// // //   console.log('🎯 Configuration du logger d\'actions CRUD...');
  
// // //   // Exposer globalement
// // //   window.ActionLogger = ActionLogger;
  
// // //   // Intercepter les soumissions de formulaire
// // //   const originalSubmit = HTMLFormElement.prototype.submit;
// // //   HTMLFormElement.prototype.submit = function() {
// // //     const form = this;
// // //     const formId = form.id || form.name || 'formulaire';
    
// // //     // Récupérer l'utilisateur
// // //     const userStr = localStorage.getItem('user');
// // //     const user = userStr ? JSON.parse(userStr) : null;
    
// // //     if (user) {
// // //       // Collecter les données du formulaire
// // //       const formData = new FormData(form);
// // //       const data = {};
// // //       formData.forEach((value, key) => {
// // //         data[key] = value;
// // //       });
      
// // //       ActionLogger.custom('SOUMISSION FORMULAIRE', 'Système', `Soumission: ${formId}`, {
// // //         formId: formId,
// // //         data: data,
// // //         submittedBy: user.username
// // //       }, user.username);
// // //     }
    
// // //     return originalSubmit.apply(this, arguments);
// // //   };
  
// // //   // Intercepter les clics sur les boutons
// // //   document.addEventListener('click', (event) => {
// // //     const target = event.target;
// // //     const userStr = localStorage.getItem('user');
// // //     const user = userStr ? JSON.parse(userStr) : null;
    
// // //     if (!user || !window.ActionLogger) return;
    
// // //     // Boutons de création
// // //     if (target.matches('button.btn-success, button[class*="btn-success"], button[class*="create"], button[class*="ajouter"]')) {
// // //       const buttonText = target.textContent || target.innerText || target.title || 'Bouton';
// // //       ActionLogger.custom('CLIC BOUTON', 'Interface', `Clic: ${buttonText}`, {
// // //         buttonText: buttonText,
// // //         element: target.tagName,
// // //         className: target.className
// // //       }, user.username);
// // //     }
    
// // //     // Boutons de suppression
// // //     if (target.matches('button.btn-error, button[class*="btn-error"], button[class*="delete"], button[class*="supprimer"]')) {
// // //       const buttonText = target.textContent || target.innerText || target.title || 'Bouton';
// // //       ActionLogger.custom('CLIC SUPPRESSION', 'Interface', `Clic suppression: ${buttonText}`, {
// // //         buttonText: buttonText,
// // //         element: target.tagName,
// // //         className: target.className
// // //       }, user.username);
// // //     }
    
// // //     // Boutons d'export
// // //     if (target.matches('button[class*="export"], button[class*="download"], button[class*="excel"], button[class*="pdf"]')) {
// // //       const buttonText = target.textContent || target.innerText || target.title || 'Bouton';
// // //       ActionLogger.custom('CLIC EXPORT', 'Interface', `Clic export: ${buttonText}`, {
// // //         buttonText: buttonText,
// // //         element: target.tagName,
// // //         className: target.className
// // //       }, user.username);
// // //     }
// // //   }, true);
  
// // //   console.log('✅ Logger d\'actions CRUD initialisé');
// // // };

// // // // ==================== COMPOSANT POUR LOGGER LA NAVIGATION ====================

// // // const NavigationLogger = () => {
// // //   const location = useLocation();
// // //   const { user } = useAuth();
  
// // //   useEffect(() => {
// // //     if (user && window.ActionLogger) {
// // //       // Logger la navigation après un court délai
// // //       setTimeout(() => {
// // //         window.ActionLogger.viewPage(location.pathname, user.username);
// // //       }, 500);
// // //     }
// // //   }, [location.pathname, user]);
  
// // //   return null;
// // // };

// // // // ==================== COMPOSANTS DE ROUTE ====================

// // // const ProtectedRoute = ({ children, requiredRole = null }) => {
// // //   const { user, loading } = useAuth();
// // //   const { hasAccess } = usePermissions();
  
// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // //         <div className="text-center">
// // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // //           <p className="text-white">Chargement du système...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }
  
// // //   if (!user) {
// // //     return <Navigate to="/login" replace />;
// // //   }
  
// // //   if (requiredRole && !hasAccess(requiredRole)) {
// // //     return <Navigate to="/unauthorized" replace />;
// // //   }
  
// // //   return children;
// // // };

// // // const PublicRoute = ({ children }) => {
// // //   const { user, loading } = useAuth();
  
// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // //         <div className="text-center">
// // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // //           <p className="text-white">Chargement...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }
  
// // //   return !user ? children : <Navigate to="/dashboard" replace />;
// // // };

// // // // ==================== HOOK POUR LOGGER LES ACTIONS ====================

// // // // Hook pour utiliser le logger dans les composants
// // // const useActionLogger = () => {
// // //   return {
// // //     log: (action, module, details, fullDetails = {}, username = null) => {
// // //       return ActionLogger.custom(action, module, details, fullDetails, username);
// // //     },
    
// // //     logMateriel: {
// // //       create: (data, username) => ActionLogger.createMateriel(data, username),
// // //       update: (id, oldData, newData, username) => ActionLogger.updateMateriel(id, oldData, newData, username),
// // //       delete: (data, username) => ActionLogger.deleteMateriel(data, username),
// // //       view: (id, username) => ActionLogger.viewMateriel(id, username)
// // //     },
    
// // //     logReport: (type, format, filters, username) => 
// // //       ActionLogger.generateReport(type, format, filters, username),
    
// // //     logUser: {
// // //       create: (data, createdBy) => ActionLogger.createUser(data, createdBy),
// // //       update: (id, oldData, newData, updatedBy) => ActionLogger.updateUser(id, oldData, newData, updatedBy),
// // //       delete: (data, deletedBy) => ActionLogger.deleteUser(data, deletedBy)
// // //     }
// // //   };
// // // };

// // // // ==================== COMPOSANT APP ROUTES ====================

// // // const AppRoutes = () => {
// // //   const { user, loading } = useAuth();

// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
// // //         <div className="text-center">
// // //           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
// // //           <p className="text-white">Initialisation du système...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!user) {
// // //     return (
// // //       <>
// // //         <Routes>
// // //           <Route path="/login" element={
// // //             <PublicRoute>
// // //               <Login />
// // //             </PublicRoute>
// // //           } />
// // //           <Route path="/register" element={
// // //             <PublicRoute>
// // //               <Register />
// // //             </PublicRoute>
// // //           } />
// // //           <Route path="*" element={<Navigate to="/login" replace />} />
// // //         </Routes>
// // //         <ToastContainer 
// // //           position="top-right"
// // //           autoClose={5000}
// // //           hideProgressBar={false}
// // //           newestOnTop
// // //           closeOnClick
// // //           rtl={false}
// // //           pauseOnFocusLoss
// // //           draggable
// // //           pauseOnHover
// // //         />
// // //       </>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       <Layout>
// // //         <NavigationLogger />
// // //         <Routes>
// // //           <Route path="/unauthorized" element={<Unauthorized />} />
// // //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
// // //           <Route path="/dashboard" element={
// // //             <ProtectedRoute requiredRole="user">
// // //               <Dashboard />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/materiels" element={
// // //             <ProtectedRoute requiredRole="user">
// // //               <Materiels />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/logiciels" element={
// // //             <ProtectedRoute requiredRole="user">
// // //               <Logiciels />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/incidents" element={
// // //             <ProtectedRoute requiredRole="user">
// // //               <Incidents />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/reparations" element={
// // //             <ProtectedRoute requiredRole="technician">
// // //               <Reparations />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/rapports" element={
// // //             <ProtectedRoute requiredRole="secretary">
// // //               <Rapports />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/users" element={
// // //             <ProtectedRoute requiredRole="director">
// // //               <Users />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/alertes" element={
// // //             <ProtectedRoute requiredRole="technician">
// // //               <Alertes />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/fournisseurs" element={
// // //             <ProtectedRoute requiredRole="secretary">
// // //               <Fournisseurs />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/installations-logiciels" element={
// // //             <ProtectedRoute requiredRole="technician">
// // //               <InstallationsLogiciels />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/profils-utilisateurs" element={
// // //             <ProtectedRoute requiredRole="user">
// // //               <ProfilsUtilisateurs />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/configuration-reseau" element={
// // //             <ProtectedRoute requiredRole="technician">
// // //               <ConfigurationReseau />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/historique" element={
// // //             <ProtectedRoute requiredRole="director">
// // //               <Historique />
// // //             </ProtectedRoute>
// // //           } />
          
// // //           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
// // //           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
// // //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
// // //         </Routes>
        
// // //         {/* Composant pour ajouter des actions manuellement */}
// // //         <QuickActionLogger />
// // //       </Layout>
// // //       <ToastContainer 
// // //         position="top-right"
// // //         autoClose={5000}
// // //         hideProgressBar={false}
// // //         newestOnTop
// // //         closeOnClick
// // //         rtl={false}
// // //         pauseOnFocusLoss
// // //         draggable
// // //         pauseOnHover
// // //       />
// // //     </>
// // //   );
// // // };

// // // // ==================== COMPOSANT APP PRINCIPAL ====================

// // // function App() {
// // //   useEffect(() => {
// // //     // Initialiser l'historique
// // //     initHistoriqueLocal();
    
// // //     // Initialiser le logger d'actions
// // //     initActionLogger();
    
// // //     // Enregistrer le démarrage de l'application
// // //     const userStr = localStorage.getItem('user');
// // //     if (userStr) {
// // //       try {
// // //         const user = JSON.parse(userStr);
// // //         console.log(`✅ Application démarrée pour: ${user.username}`);
        
// // //         // Enregistrer l'action de démarrage
// // //         setTimeout(() => {
// // //           ActionLogger.custom('DÉMARRAGE', 'Système', 'Application DREN AA démarrée', {
// // //             version: '1.0.0',
// // //             user: user.username,
// // //             timestamp: new Date().toISOString()
// // //           }, user.username);
// // //         }, 1000);
// // //       } catch (error) {
// // //         console.error('❌ Erreur parsing user:', error);
// // //       }
// // //     }
    
// // //     // Ajouter des fonctions de test dans la console
// // //     if (typeof window !== 'undefined') {
// // //       window.testCRUD = {
// // //         addMateriel: () => {
// // //           const data = {
// // //             nom: 'PC Test',
// // //             type: 'Ordinateur',
// // //             marque: 'Dell',
// // //             reference: 'PC-TEST-001',
// // //             etat: 'fonctionnel',
// // //             service_attribue: 'Informatique'
// // //           };
// // //           const user = JSON.parse(localStorage.getItem('user') || '{"username": "admin"}');
// // //           ActionLogger.createMateriel(data, user.username);
// // //           console.log('✅ Matériel de test ajouté');
// // //         },
        
// // //         addUser: () => {
// // //           const data = {
// // //             username: 'testuser',
// // //             email: 'test@example.com',
// // //             role: 'user'
// // //           };
// // //           const user = JSON.parse(localStorage.getItem('user') || '{"username": "admin"}');
// // //           ActionLogger.createUser(data, user.username);
// // //           console.log('✅ Utilisateur de test ajouté');
// // //         },
        
// // //         addReport: () => {
// // //           const user = JSON.parse(localStorage.getItem('user') || '{"username": "admin"}');
// // //           ActionLogger.generateReport('Materiels', 'PDF', {}, user.username);
// // //           console.log('✅ Rapport de test ajouté');
// // //         }
// // //       };
      
// // //       console.log('🔧 Fonctions de test CRUD disponibles:');
// // //       console.log('- testCRUD.addMateriel(): Ajouter un matériel test');
// // //       console.log('- testCRUD.addUser(): Ajouter un utilisateur test');
// // //       console.log('- testCRUD.addReport(): Ajouter un rapport test');
// // //       console.log('- ActionLogger: Objet complet pour logger les actions');
// // //     }
// // //   }, []);

// // //   return (
// // //     <AuthProvider>
// // //       <NotificationProvider>
// // //         <Router>
// // //           <div className="min-h-screen bg-base-100">
// // //             <AppRoutes />
// // //           </div>
// // //         </Router>
// // //       </NotificationProvider>
// // //     </AuthProvider>
// // //   );
// // // }

// // // // Exportez les fonctions pour les utiliser ailleurs
// // // export { 
// // //   initHistoriqueLocal, 
// // //   ActionLogger,
// // //   initActionLogger,
// // //   useActionLogger,
// // //   logAction 
// // // };

// // // export default App;





// // src/App.jsx - VERSION COMPLÈTE AVEC LOGGING D'ACTIONS CRUD
// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { NotificationProvider } from './context/NotificationContext';
// import { usePermissions } from './hooks/usePermissions';
// // import { historyLogger } from './utils/historyLogger';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Layout Components
// import Layout from './components/Layout';

// // Pages
// import Login from './components/Login';
// import Register from './components/Register';
// import Dashboard from './pages/Dashboard';
// import Materiels from './pages/Materiels';
// import Logiciels from './pages/Logiciels';
// import Incidents from './pages/Incidents';
// import Reparations from './pages/Reparations';
// import Rapports from './pages/Rapports';
// import Users from './pages/Users';
// import Alertes from './pages/Alertes';
// import Fournisseurs from './pages/Fournisseurs';
// import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// import ConfigurationReseau from './pages/ConfigurationReseau';
// import Unauthorized from './pages/Unauthorized';
// import Historique from './pages/Historique';
// import InstallationsLogiciels from './pages/InstallationsLogiciels';

// // Import du composant QuickActionLogger
// import QuickActionLogger from './components/QuickActionLogger';

// // ==================== FONCTIONS DE L'HISTORIQUE ====================

// // Fonction pour initialiser l'historique local avec des données CRUD complètes
// const initHistoriqueLocal = () => {
//   console.log('🔄 Initialisation historique CRUD...');
  
//   const STORAGE_KEY = 'gestion_parc_historique';
//   const saved = localStorage.getItem(STORAGE_KEY);
  
//   if (!saved) {
//     const now = new Date();
//     const defaultData = [
//       // AJOUT Matériel
//       {
//         id: 'hist_' + Date.now(),
//         utilisateur: 'odonardo',
//         action: 'AJOUT',
//         module: 'Matériels',
//         details: 'Ajout matériel: PC Portable Dell XPS 15',
//         fullDetails: JSON.stringify({
//           data: {
//             id: 'MAT-001',
//             nom: 'PC Portable Dell XPS 15',
//             type: 'Ordinateur portable',
//             marque: 'Dell',
//             reference: 'XPS-15-9520',
//             etat: 'fonctionnel',
//             service_attribue: 'Direction',
//             date_achat: '2024-01-15',
//             cout: 1899.99
//           },
//           type: 'create',
//           itemType: 'materiel',
//           itemName: 'PC Portable Dell XPS 15',
//           timestamp: new Date(now.getTime() - 86400000).toISOString()
//         }),
//         date: new Date(now.getTime() - 86400000).toISOString(),
//         ip_address: '192.168.1.1',
//         user_agent: 'Chrome/120.0',
//         status: 'SUCCESS'
//       },
      
//       // MODIFICATION Matériel
//       {
//         id: 'hist_' + (Date.now() + 1),
//         utilisateur: 'technicien',
//         action: 'MODIFICATION',
//         module: 'Matériels',
//         details: 'Modification matériel: PC Portable Dell',
//         fullDetails: JSON.stringify({
//           materielId: 'MAT-001',
//           oldData: { nom: 'PC Portable Dell', etat: 'fonctionnel', service_attribue: 'Informatique' },
//           newData: { nom: 'PC Portable Dell XPS', etat: 'maintenance', service_attribue: 'Direction' },
//           changes: {
//             nom: { old: 'PC Portable Dell', new: 'PC Portable Dell XPS' },
//             etat: { old: 'fonctionnel', new: 'maintenance' },
//             service_attribue: { old: 'Informatique', new: 'Direction' }
//           },
//           type: 'update',
//           itemType: 'materiel',
//           itemName: 'PC Portable Dell XPS',
//           timestamp: new Date(now.getTime() - 43200000).toISOString()
//         }),
//         date: new Date(now.getTime() - 43200000).toISOString(),
//         ip_address: '192.168.1.2',
//         user_agent: 'Firefox/119.0',
//         status: 'SUCCESS'
//       },
      
//       // SUPPRESSION Matériel
//       {
//         id: 'hist_' + (Date.now() + 2),
//         utilisateur: 'admin',
//         action: 'SUPPRESSION',
//         module: 'Matériels',
//         details: 'Suppression matériel: Imprimante HP LaserJet',
//         fullDetails: JSON.stringify({
//           data: {
//             id: 'MAT-005',
//             nom: 'Imprimante HP LaserJet',
//             type: 'Imprimante',
//             marque: 'HP',
//             etat: 'hors_service',
//             service_attribue: 'Comptabilité'
//           },
//           type: 'delete',
//           itemType: 'materiel',
//           itemName: 'Imprimante HP LaserJet',
//           timestamp: new Date(now.getTime() - 64800000).toISOString()
//         }),
//         date: new Date(now.getTime() - 64800000).toISOString(),
//         ip_address: '192.168.1.1',
//         user_agent: 'Chrome/120.0',
//         status: 'SUCCESS'
//       },
      
//       // EXPORTATION Rapport
//       {
//         id: 'hist_' + (Date.now() + 3),
//         utilisateur: 'secretariat',
//         action: 'EXPORTATION',
//         module: 'Rapports',
//         details: 'Export rapport Matériels en PDF',
//         fullDetails: JSON.stringify({
//           reportType: 'Matériels',
//           format: 'PDF',
//           filters: { service: 'Direction', etat: 'fonctionnel' },
//           type: 'export',
//           count: 15,
//           timestamp: new Date(now.getTime() - 21600000).toISOString()
//         }),
//         date: new Date(now.getTime() - 21600000).toISOString(),
//         ip_address: '192.168.1.3',
//         user_agent: 'Safari/17.0',
//         status: 'SUCCESS'
//       },
      
//       // EXPORTATION Excel
//       {
//         id: 'hist_' + (Date.now() + 4),
//         utilisateur: 'secretariat',
//         action: 'EXPORTATION',
//         module: 'Rapports',
//         details: 'Export Incidents en Excel',
//         fullDetails: JSON.stringify({
//           reportType: 'Incidents',
//           format: 'Excel',
//           filters: { statut: 'Résolu', date_debut: '2024-01-01' },
//           type: 'export',
//           count: 42,
//           timestamp: new Date(now.getTime() - 18000000).toISOString()
//         }),
//         date: new Date(now.getTime() - 18000000).toISOString(),
//         ip_address: '192.168.1.3',
//         user_agent: 'Safari/17.0',
//         status: 'SUCCESS'
//       },
      
//       // CONSULTATION
//       {
//         id: 'hist_' + (Date.now() + 5),
//         utilisateur: 'directeur',
//         action: 'CONSULTATION',
//         module: 'Matériels',
//         details: 'Consultation Matériels: PC Portable Dell XPS',
//         fullDetails: JSON.stringify({
//           module: 'Matériels',
//           itemId: 'MAT-001',
//           itemName: 'PC Portable Dell XPS',
//           type: 'view',
//           timestamp: new Date(now.getTime() - 10800000).toISOString()
//         }),
//         date: new Date(now.getTime() - 10800000).toISOString(),
//         ip_address: '192.168.1.4',
//         user_agent: 'Edge/120.0',
//         status: 'SUCCESS'
//       },
      
//       // AJOUT Logiciel
//       {
//         id: 'hist_' + (Date.now() + 6),
//         utilisateur: 'technicien',
//         action: 'AJOUT',
//         module: 'Logiciels',
//         details: 'Ajout logiciel: Microsoft Office 365',
//         fullDetails: JSON.stringify({
//           data: {
//             id: 'LOG-001',
//             nom: 'Microsoft Office 365',
//             version: '2024',
//             type: 'Suite bureautique',
//             licence: 'Commerciale',
//             date_expiration: '2025-12-31'
//           },
//           type: 'create',
//           itemType: 'logiciel',
//           itemName: 'Microsoft Office 365',
//           timestamp: new Date(now.getTime() - 7200000).toISOString()
//         }),
//         date: new Date(now.getTime() - 7200000).toISOString(),
//         ip_address: '192.168.1.2',
//         user_agent: 'Firefox/119.0',
//         status: 'SUCCESS'
//       },
      
//       // AJOUT Incident
//       {
//         id: 'hist_' + (Date.now() + 7),
//         utilisateur: 'user1',
//         action: 'AJOUT',
//         module: 'Incidents',
//         details: 'Création incident: Écran cassé sur PC-12',
//         fullDetails: JSON.stringify({
//           data: {
//             id: 'INC-001',
//             titre: 'Écran cassé sur PC-12',
//             description: 'Écran LCD fissuré après chute',
//             priorite: 'Haute',
//             statut: 'En cours',
//             materiel_id: 'MAT-001'
//           },
//           type: 'create',
//           itemType: 'incident',
//           itemName: 'Écran cassé sur PC-12',
//           timestamp: new Date(now.getTime() - 3600000).toISOString()
//         }),
//         date: new Date(now.getTime() - 3600000).toISOString(),
//         ip_address: '192.168.1.5',
//         user_agent: 'Chrome/121.0',
//         status: 'SUCCESS'
//       },
      
//       // CONNEXION
//       {
//         id: 'hist_' + (Date.now() + 8),
//         utilisateur: 'odonardo',
//         action: 'CONNEXION',
//         module: 'Authentification',
//         details: 'Connexion de odonardo',
//         fullDetails: JSON.stringify({
//           username: 'odonardo',
//           userData: { role: 'admin', email: 'odonardo@dren-aa.com' },
//           type: 'auth',
//           timestamp: new Date(now.getTime() - 1800000).toISOString()
//         }),
//         date: new Date(now.getTime() - 1800000).toISOString(),
//         ip_address: '192.168.1.1',
//         user_agent: 'Chrome/120.0',
//         status: 'SUCCESS'
//       },
      
//       // NAVIGATION (seulement une pour l'exemple)
//       {
//         id: 'hist_' + (Date.now() + 9),
//         utilisateur: 'odonardo',
//         action: 'NAVIGATION',
//         module: 'Système',
//         details: 'Navigation vers /dashboard',
//         fullDetails: JSON.stringify({
//           page: '/dashboard',
//           type: 'navigation',
//           timestamp: new Date().toISOString()
//         }),
//         date: new Date().toISOString(),
//         ip_address: '192.168.1.1',
//         user_agent: 'Chrome/120.0',
//         status: 'SUCCESS'
//       }
//     ];
    
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
//     console.log(`✅ Historique CRUD initialisé avec ${defaultData.length} actions variées`);
//   } else {
//     try {
//       const data = JSON.parse(saved);
//       console.log(`✅ Historique déjà chargé (${data.length} actions)`);
//     } catch {
//       console.log('⚠️ Historique corrompu, réinitialisation...');
//       localStorage.removeItem(STORAGE_KEY);
//       initHistoriqueLocal();
//     }
//   }
// };

// // Fonction utilitaire pour détecter les changements
// const getChanges = (oldData, newData) => {
//   const changes = {};
//   for (const key in newData) {
//     if (oldData[key] !== newData[key]) {
//       changes[key] = {
//         old: oldData[key],
//         new: newData[key]
//       };
//     }
//   }
//   return changes;
// };

// // Fonction pour logger une action CRUD
// const logAction = (action, module, details, username = null, extraData = {}) => {
//   try {
//     const userStr = localStorage.getItem('user');
//     const user = userStr ? JSON.parse(userStr) : null;
    
//     // S'assurer que le module est correct
//     const finalModule = module === 'Navigation' ? 'Système' : module;
    
//     const newEntry = {
//       id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
//       utilisateur: username || user?.username || 'System',
//       action: action,  // AJOUT, MODIFICATION, SUPPRESSION, EXPORTATION, etc.
//       module: finalModule,  // Matériels, Logiciels, Incidents, etc.
//       details: details,
//       fullDetails: JSON.stringify({
//         ...extraData,
//         timestamp: new Date().toISOString(),
//         userAgent: navigator.userAgent,
//         ip: 'localhost'
//       }),
//       date: new Date().toISOString(),
//       ip_address: 'localhost',
//       user_agent: navigator.userAgent,
//       status: 'SUCCESS'
//     };
    
//     const STORAGE_KEY = 'gestion_parc_historique';
//     const historique = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
//     const newHistorique = [newEntry, ...historique.slice(0, 499)]; // Limite à 500 entrées
    
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
//     console.log(`📝 Action CRUD loggée: ${action} - ${finalModule} - ${details}`);
    
//     // Émettre un événement pour mettre à jour l'UI en temps réel
//     window.dispatchEvent(new CustomEvent('action-logged', { detail: newEntry }));
    
//     return newEntry;
//   } catch (error) {
//     console.error('❌ Erreur logging action:', error);
//     return null;
//   }
// };

// // ==================== ACTION LOGGER COMPLET ====================

// // Objet ActionLogger avec toutes les méthodes CRUD
// const ActionLogger = {
//   // ========== AUTHENTIFICATION ==========
//   login: (username, userData = {}) => 
//     logAction('CONNEXION', 'Authentification', `Connexion de ${username}`, username, {
//       username: username,
//       userData: userData,
//       type: 'auth'
//     }),
  
//   logout: (username) => 
//     logAction('DECONNEXION', 'Authentification', `Déconnexion de ${username}`, username, {
//       username: username,
//       type: 'auth'
//     }),
  
//   // ========== MATÉRIELS ==========
//   createMateriel: (materielData, username) => 
//     logAction('AJOUT', 'Matériels', `Ajout matériel: ${materielData.nom || 'Nouveau matériel'}`, username, {
//       data: materielData,
//       type: 'create',
//       itemType: 'materiel',
//       itemName: materielData.nom
//     }),
  
//   updateMateriel: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Matériels', `Modification matériel: ${oldData.nom || id}`, username, {
//       materielId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'materiel',
//       itemName: newData.nom || oldData.nom
//     }),
  
//   deleteMateriel: (id, materielData, username) => 
//     logAction('SUPPRESSION', 'Matériels', `Suppression matériel: ${materielData.nom || id}`, username, {
//       materielId: id,
//       data: materielData,
//       type: 'delete',
//       itemType: 'materiel',
//       itemName: materielData.nom
//     }),
  
//   // ========== LOGICIELS ==========
//   createLogiciel: (logicielData, username) => 
//     logAction('AJOUT', 'Logiciels', `Ajout logiciel: ${logicielData.nom || 'Nouveau logiciel'}`, username, {
//       data: logicielData,
//       type: 'create',
//       itemType: 'logiciel',
//       itemName: logicielData.nom
//     }),
  
//   updateLogiciel: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Logiciels', `Modification logiciel: ${oldData.nom || id}`, username, {
//       logicielId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'logiciel',
//       itemName: newData.nom || oldData.nom
//     }),
  
//   deleteLogiciel: (id, logicielData, username) => 
//     logAction('SUPPRESSION', 'Logiciels', `Suppression logiciel: ${logicielData.nom || id}`, username, {
//       logicielId: id,
//       data: logicielData,
//       type: 'delete',
//       itemType: 'logiciel',
//       itemName: logicielData.nom
//     }),
  
//   // ========== INCIDENTS ==========
//   createIncident: (incidentData, username) => 
//     logAction('AJOUT', 'Incidents', `Création incident: ${incidentData.titre || 'Nouvel incident'}`, username, {
//       data: incidentData,
//       type: 'create',
//       itemType: 'incident',
//       itemName: incidentData.titre
//     }),
  
//   updateIncident: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Incidents', `Modification incident: ${oldData.titre || id}`, username, {
//       incidentId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'incident',
//       itemName: newData.titre || oldData.titre
//     }),
  
//   resolveIncident: (id, incidentData, username) => 
//     logAction('RÉSOLUTION', 'Incidents', `Résolution incident: ${incidentData.titre || id}`, username, {
//       incidentId: id,
//       data: incidentData,
//       type: 'resolve',
//       itemType: 'incident',
//       itemName: incidentData.titre
//     }),
  
//   deleteIncident: (id, incidentData, username) => 
//     logAction('SUPPRESSION', 'Incidents', `Suppression incident: ${incidentData.titre || id}`, username, {
//       incidentId: id,
//       data: incidentData,
//       type: 'delete',
//       itemType: 'incident',
//       itemName: incidentData.titre
//     }),
  
//   // ========== RÉPARATIONS ==========
//   createReparation: (reparationData, username) => 
//     logAction('AJOUT', 'Réparations', `Création réparation pour: ${reparationData.materiel_id || 'Matériel'}`, username, {
//       data: reparationData,
//       type: 'create',
//       itemType: 'reparation'
//     }),
  
//   updateReparation: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Réparations', `Modification réparation #${id}`, username, {
//       reparationId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'reparation'
//     }),
  
//   completeReparation: (id, reparationData, username) => 
//     logAction('MODIFICATION', 'Réparations', `Réparation terminée #${id}`, username, {
//       reparationId: id,
//       data: reparationData,
//       type: 'complete',
//       itemType: 'reparation'
//     }),
  
//   // ========== ALERTES ==========
//   createAlerte: (alerteData, username) => 
//     logAction('AJOUT', 'Alertes', `Création alerte: ${alerteData.titre || 'Nouvelle alerte'}`, username, {
//       data: alerteData,
//       type: 'create',
//       itemType: 'alerte',
//       itemName: alerteData.titre
//     }),
  
//   updateAlerte: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Alertes', `Modification alerte: ${oldData.titre || id}`, username, {
//       alerteId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'alerte',
//       itemName: newData.titre || oldData.titre
//     }),
  
//   // ========== FOURNISSEURS ==========
//   createFournisseur: (fournisseurData, username) => 
//     logAction('AJOUT', 'Fournisseurs', `Ajout fournisseur: ${fournisseurData.nom || 'Nouveau fournisseur'}`, username, {
//       data: fournisseurData,
//       type: 'create',
//       itemType: 'fournisseur',
//       itemName: fournisseurData.nom
//     }),
  
//   updateFournisseur: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Fournisseurs', `Modification fournisseur: ${oldData.nom || id}`, username, {
//       fournisseurId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'fournisseur',
//       itemName: newData.nom || oldData.nom
//     }),
  
//   deleteFournisseur: (id, fournisseurData, username) => 
//     logAction('SUPPRESSION', 'Fournisseurs', `Suppression fournisseur: ${fournisseurData.nom || id}`, username, {
//       fournisseurId: id,
//       data: fournisseurData,
//       type: 'delete',
//       itemType: 'fournisseur',
//       itemName: fournisseurData.nom
//     }),
  
//   // ========== UTILISATEURS ==========
//   createUser: (userData, createdBy) => 
//     logAction('AJOUT', 'Utilisateurs', `Création utilisateur: ${userData.username || 'Nouvel utilisateur'}`, createdBy, {
//       data: userData,
//       type: 'create',
//       itemType: 'user',
//       itemName: userData.username
//     }),
  
//   updateUser: (id, oldData, newData, updatedBy) => 
//     logAction('MODIFICATION', 'Utilisateurs', `Modification utilisateur: ${oldData.username || id}`, updatedBy, {
//       userId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'user',
//       itemName: newData.username || oldData.username
//     }),
  
//   deleteUser: (id, userData, deletedBy) => 
//     logAction('SUPPRESSION', 'Utilisateurs', `Suppression utilisateur: ${userData.username || id}`, deletedBy, {
//       userId: id,
//       data: userData,
//       type: 'delete',
//       itemType: 'user',
//       itemName: userData.username
//     }),
  
//   // ========== RAPPORTS & EXPORTATIONS ==========
//   generateReport: (type, format, filters, username) => 
//     logAction('EXPORTATION', 'Rapports', `Export rapport ${type} en ${format}`, username, {
//       reportType: type,
//       format: format,
//       filters: filters || {},
//       type: 'export',
//       timestamp: new Date().toISOString()
//     }),
  
//   exportData: (module, format, dataCount, username) => 
//     logAction('EXPORTATION', 'Rapports', `Export ${module} (${dataCount} éléments) en ${format}`, username, {
//       module: module,
//       format: format,
//       count: dataCount,
//       type: 'export',
//       timestamp: new Date().toISOString()
//     }),
  
//   printReport: (type, username) => 
//     logAction('GENERATION', 'Rapports', `Impression rapport ${type}`, username, {
//       reportType: type,
//       format: 'PDF',
//       type: 'print',
//       timestamp: new Date().toISOString()
//     }),
  
//   // ========== CONSULTATIONS ==========
//   viewDetails: (module, itemId, itemName, username) => 
//     logAction('CONSULTATION', module, `Consultation ${module}: ${itemName || itemId}`, username, {
//       module: module,
//       itemId: itemId,
//       itemName: itemName,
//       type: 'view',
//       timestamp: new Date().toISOString()
//     }),
  
//   searchData: (module, searchTerm, resultsCount, username) => 
//     logAction('CONSULTATION', module, `Recherche dans ${module}: "${searchTerm}" (${resultsCount} résultats)`, username, {
//       module: module,
//       searchTerm: searchTerm,
//       resultsCount: resultsCount,
//       type: 'search',
//       timestamp: new Date().toISOString()
//     }),
  
//   // ========== INSTALLATIONS LOGICIELS ==========
//   installLogiciel: (logicielName, materielId, username) => 
//     logAction('AJOUT', 'Installations', `Installation logiciel: ${logicielName} sur ${materielId}`, username, {
//       logicielName: logicielName,
//       materielId: materielId,
//       type: 'install',
//       timestamp: new Date().toISOString()
//     }),
  
//   uninstallLogiciel: (logicielName, materielId, username) => 
//     logAction('SUPPRESSION', 'Installations', `Désinstallation logiciel: ${logicielName} de ${materielId}`, username, {
//       logicielName: logicielName,
//       materielId: materielId,
//       type: 'uninstall',
//       timestamp: new Date().toISOString()
//     }),
  
//   // ========== NAVIGATION (seulement pour les changements de page) ==========
//   viewPage: (page, username) => 
//     logAction('NAVIGATION', 'Système', `Navigation vers ${page}`, username, {
//       page: page,
//       type: 'navigation',
//       timestamp: new Date().toISOString()
//     }),
  
//   // ========== GÉNÉRIQUE ==========
//   custom: (action, module, details, username, extraData = {}) => 
//     logAction(action, module, details, username, extraData)
// };

// // ==================== FONCTIONS DE TEST ====================

// // Fonction pour tester toutes les actions CRUD
// const testAllCRUDActions = () => {
//   const testUser = 'odonardo';
  
//   console.log('🧪 Test des actions CRUD...');
  
//   // 1. AJOUT Matériel
//   setTimeout(() => {
//     ActionLogger.createMateriel({
//       id: 'MAT-' + Date.now(),
//       nom: 'PC Portable Dell XPS 15',
//       type: 'Ordinateur portable',
//       marque: 'Dell',
//       reference: 'XPS-15-9520',
//       etat: 'fonctionnel',
//       service_attribue: 'Direction',
//       date_achat: '2024-01-15',
//       cout: 1899.99
//     }, testUser);
//   }, 100);
  
//   // 2. MODIFICATION Matériel
//   setTimeout(() => {
//     ActionLogger.updateMateriel(
//       'MAT-001',
//       { nom: 'PC Portable Dell', etat: 'fonctionnel', service_attribue: 'Informatique' },
//       { nom: 'PC Portable Dell XPS', etat: 'maintenance', service_attribue: 'Direction' },
//       testUser
//     );
//   }, 500);
  
//   // 3. SUPPRESSION Matériel
//   setTimeout(() => {
//     ActionLogger.deleteMateriel(
//       'MAT-005',
//       { nom: 'Imprimante HP LaserJet', type: 'Imprimante', marque: 'HP' },
//       testUser
//     );
//   }, 1000);
  
//   // 4. AJOUT Logiciel
//   setTimeout(() => {
//     ActionLogger.createLogiciel({
//       id: 'LOG-' + Date.now(),
//       nom: 'Microsoft Office 365',
//       version: '2024',
//       type: 'Suite bureautique',
//       licence: 'Commerciale',
//       date_expiration: '2025-12-31'
//     }, testUser);
//   }, 1500);
  
//   // 5. AJOUT Incident
//   setTimeout(() => {
//     ActionLogger.createIncident({
//       id: 'INC-' + Date.now(),
//       titre: 'Écran cassé sur PC-12',
//       description: 'Écran LCD fissuré après chute',
//       priorite: 'Haute',
//       statut: 'En cours',
//       materiel_id: 'MAT-001'
//     }, testUser);
//   }, 2000);
  
//   // 6. RÉSOLUTION Incident
//   setTimeout(() => {
//     ActionLogger.resolveIncident(
//       'INC-001',
//       { titre: 'Écran cassé sur PC-12', statut: 'En cours' },
//       testUser
//     );
//   }, 2500);
  
//   // 7. AJOUT Réparation
//   setTimeout(() => {
//     ActionLogger.createReparation({
//       id: 'REP-' + Date.now(),
//       materiel_id: 'MAT-001',
//       description: 'Remplacement écran LCD',
//       cout: 350.00,
//       date_debut: '2024-01-20',
//       date_fin: '2024-01-21',
//       technicien: 'Jean Tech'
//     }, testUser);
//   }, 3000);
  
//   // 8. EXPORTATION Rapport PDF
//   setTimeout(() => {
//     ActionLogger.generateReport('Matériels', 'PDF', { 
//       service: 'Direction',
//       etat: 'fonctionnel',
//       date_debut: '2024-01-01',
//       date_fin: '2024-12-31'
//     }, testUser);
//   }, 3500);
  
//   // 9. EXPORTATION Excel
//   setTimeout(() => {
//     ActionLogger.exportData('Incidents', 'Excel', 24, testUser);
//   }, 4000);
  
//   // 10. CONSULTATION
//   setTimeout(() => {
//     ActionLogger.viewDetails('Matériels', 'MAT-001', 'PC Portable Dell XPS', testUser);
//   }, 4500);
  
//   // 11. RECHERCHE
//   setTimeout(() => {
//     ActionLogger.searchData('Matériels', 'Dell', 8, testUser);
//   }, 5000);
  
//   // 12. INSTALLATION Logiciel
//   setTimeout(() => {
//     ActionLogger.installLogiciel('Microsoft Office 365', 'MAT-001', testUser);
//   }, 5500);
  
//   // 13. CONNEXION
//   setTimeout(() => {
//     ActionLogger.login(testUser, { role: 'admin', email: 'odonardo@dren-aa.com' });
//   }, 6000);
  
//   // 14. NAVIGATION (seulement une)
//   setTimeout(() => {
//     ActionLogger.viewPage('/historique', testUser);
//   }, 6500);
  
//   console.log('✅ 14 actions CRUD de test programmées');
  
//   return 'Test CRUD démarré. Vérifiez la page Historique dans quelques secondes.';
// };

// // Initialiser les écouteurs d'actions
// const initActionLogger = () => {
//   console.log('🎯 Configuration des écouteurs d\'actions CRUD...');
  
//   // Exposer globalement
//   window.ActionLogger = ActionLogger;
  
//   // Écouter les événements de connexion
//   window.addEventListener('user-login', (event) => {
//     const { username, userData } = event.detail || {};
//     if (username) {
//       ActionLogger.login(username, userData);
//     }
//   });
  
//   // Écouter les événements de déconnexion
//   window.addEventListener('user-logout', (event) => {
//     const { username } = event.detail || {};
//     if (username) {
//       ActionLogger.logout(username);
//     }
//   });
  
//   // Écouter les événements génériques d'actions
//   window.addEventListener('log-crud-action', (event) => {
//     const { action, module, details, username, extraData } = event.detail || {};
//     if (action && module && details) {
//       ActionLogger.custom(action, module, details, username, extraData);
//     }
//   });
  
//   console.log('✅ ActionLogger CRUD initialisé');
// };

// // ==================== COMPOSANT POUR LOGGER LA NAVIGATION ====================

// const NavigationLogger = () => {
//   const location = useLocation();
//   const { user } = useAuth();
  
//   useEffect(() => {
//     if (user && window.ActionLogger) {
//       // Logger la navigation après un court délai
//       setTimeout(() => {
//         // Seulement logger les vraies navigations, pas toutes les actions
//         if (location.pathname !== window.lastLoggedPath) {
//           window.ActionLogger.viewPage(location.pathname, user.username);
//           window.lastLoggedPath = location.pathname;
//         }
//       }, 500);
//     }
//   }, [location.pathname, user]);
  
//   return null;
// };

// // ==================== COMPOSANTS DE ROUTE ====================

// const ProtectedRoute = ({ children, requiredRole = null }) => {
//   const { user, loading } = useAuth();
//   const { hasAccess } = usePermissions();
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
//           <p className="text-white">Chargement du système...</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
  
//   if (requiredRole && !hasAccess(requiredRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }
  
//   return children;
// };

// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
//           <p className="text-white">Chargement...</p>
//         </div>
//       </div>
//     );
//   }
  
//   return !user ? children : <Navigate to="/dashboard" replace />;
// };

// // ==================== COMPOSANT APP ROUTES ====================

// const AppRoutes = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
//           <p className="text-white">Initialisation du système...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <>
//         <Routes>
//           <Route path="/login" element={
//             <PublicRoute>
//               <Login />
//             </PublicRoute>
//           } />
//           <Route path="/register" element={
//             <PublicRoute>
//               <Register />
//             </PublicRoute>
//           } />
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//         <ToastContainer 
//           position="top-right"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         />
//       </>
//     );
//   }

//   return (
//     <>
//       <Layout>
//         <NavigationLogger />
//         <Routes>
//           <Route path="/unauthorized" element={<Unauthorized />} />
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
//           <Route path="/dashboard" element={
//             <ProtectedRoute requiredRole="user">
//               <Dashboard />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/materiels" element={
//             <ProtectedRoute requiredRole="user">
//               <Materiels />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/logiciels" element={
//             <ProtectedRoute requiredRole="user">
//               <Logiciels />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/incidents" element={
//             <ProtectedRoute requiredRole="user">
//               <Incidents />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/reparations" element={
//             <ProtectedRoute requiredRole="technician">
//               <Reparations />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/rapports" element={
//             <ProtectedRoute requiredRole="secretary">
//               <Rapports />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/users" element={
//             <ProtectedRoute requiredRole="director">
//               <Users />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/alertes" element={
//             <ProtectedRoute requiredRole="technician">
//               <Alertes />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/fournisseurs" element={
//             <ProtectedRoute requiredRole="secretary">
//               <Fournisseurs />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/installations-logiciels" element={
//             <ProtectedRoute requiredRole="technician">
//               <InstallationsLogiciels />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/profils-utilisateurs" element={
//             <ProtectedRoute requiredRole="user">
//               <ProfilsUtilisateurs />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/configuration-reseau" element={
//             <ProtectedRoute requiredRole="technician">
//               <ConfigurationReseau />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/historique" element={
//             <ProtectedRoute requiredRole="director">
//               <Historique />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
        
//         {/* Composant pour ajouter des actions manuellement */}
//         <QuickActionLogger />
//       </Layout>
//       <ToastContainer 
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </>
//   );
// };

// // ==================== COMPOSANT APP PRINCIPAL ====================

// function App() {
//   useEffect(() => {
//     console.log('🚀 Démarrage application DREN AA...');
    
//     // Initialiser l'historique avec des données CRUD
//     initHistoriqueLocal();
    
//     // Initialiser le logger d'actions CRUD
//     initActionLogger();
    
//     // Enregistrer le démarrage de l'application
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         console.log(`✅ Application démarrée pour: ${user.username}`);
        
//         // Enregistrer l'action de démarrage
//         setTimeout(() => {
//           ActionLogger.custom('DEMARRAGE', 'Système', 'Application DREN AA démarrée', user.username, {
//             version: '2.0.0',
//             timestamp: new Date().toISOString(),
//             environment: 'production'
//           });
//         }, 1000);
//       } catch (error) {
//         console.error('❌ Erreur parsing user:', error);
//       }
//     }
    
//     // Ajouter des fonctions de test dans la console
//     if (typeof window !== 'undefined') {
//       // Exposer les fonctions de test CRUD
//       window.testAllCRUDActions = testAllCRUDActions;
      
//       // Fonction pour ajouter une action CRUD manuelle
//       window.addCRUDAction = () => {
//         const action = prompt("Type d'action (AJOUT/MODIFICATION/SUPPRESSION/EXPORTATION/CONSULTATION/NAVIGATION):", "AJOUT");
//         const module = prompt("Module:", "Matériels");
//         const details = prompt("Détails:", "Ajout d'un nouveau matériel");
//         const username = prompt("Utilisateur:", "odonardo");
        
//         if (action && module && details && username) {
//           const extraData = {
//             itemName: details.split(':')[1]?.trim() || 'Élément',
//             timestamp: new Date().toISOString(),
//             type: action.toLowerCase()
//           };
          
//           ActionLogger.custom(action, module, details, username, extraData);
//           alert(`✅ Action "${action}" ajoutée pour ${module}!`);
          
//           // Recharger l'historique si ouvert
//           if (window.location.pathname === '/historique') {
//             setTimeout(() => window.dispatchEvent(new CustomEvent('action-logged')), 1000);
//           }
//         }
//       };
      
//       // Fonction pour effacer l'historique
//       window.clearHistorique = () => {
//         if (confirm('Voulez-vous vraiment effacer tout l\'historique?')) {
//           localStorage.removeItem('gestion_parc_historique');
//           alert('✅ Historique effacé!');
//           initHistoriqueLocal();
//           alert('✅ Données de test réinitialisées!');
//         }
//       };
      
//       // Fonction pour voir le contenu de l'historique
//       window.showHistorique = () => {
//         const STORAGE_KEY = 'gestion_parc_historique';
//         const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
//         console.log('📊 Contenu historique:', data);
//         console.log(`Total: ${data.length} actions`);
        
//         // Afficher les statistiques par type d'action
//         const stats = {};
//         data.forEach(item => {
//           stats[item.action] = (stats[item.action] || 0) + 1;
//         });
//         console.log('📈 Statistiques par action:', stats);
        
//         alert(`Historique: ${data.length} actions\n` + 
//               Object.entries(stats).map(([action, count]) => `${action}: ${count}`).join('\n'));
//       };
      
//       console.log('🔧 Fonctions CRUD disponibles dans la console:');
//       console.log('- testAllCRUDActions(): Tester toutes les actions CRUD');
//       console.log('- addCRUDAction(): Ajouter une action CRUD manuelle');
//       console.log('- clearHistorique(): Effacer l\'historique');
//       console.log('- showHistorique(): Voir le contenu');
//       console.log('- ActionLogger: Objet complet pour logger les actions');
//     }
//   }, []);

//   return (
//     <AuthProvider>
//       <NotificationProvider>
//         <Router>
//           <div className="min-h-screen bg-base-100">
//             <AppRoutes />
//           </div>
//         </Router>
//       </NotificationProvider>
//     </AuthProvider>
//   );
// }

// // Exportez les fonctions pour les utiliser ailleurs
// export { 
//   initHistoriqueLocal, 
//   ActionLogger,
//   initActionLogger,
//   testAllCRUDActions,
//   logAction 
// };

// export default App;



// // src/App.jsx - VERSION CORRIGÉE
// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { NotificationProvider } from './context/NotificationContext';
// import { usePermissions } from './hooks/usePermissions';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ThemeProvider } from './context/ThemeContext';

// // Layout Components
// import Layout from './components/Layout';

// // Pages
// import Login from './components/Login';
// import Register from './components/Register';
// import Dashboard from './pages/Dashboard';
// import Materiels from './pages/Materiels';
// // import Logiciels from './pages/Logiciels';
// import Incidents from './pages/Incidents';
// import Reparations from './pages/Reparations';
// import Rapports from './pages/Rapports';
// import Users from './pages/Users';
// import Alertes from './pages/Alertes';
// import Fournisseurs from './pages/Fournisseurs';
// import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// // import ConfigurationReseau from './pages/ConfigurationReseau';
// import Unauthorized from './pages/Unauthorized';
// import Historique from './pages/Historique';
// // import InstallationsLogiciels from './pages/InstallationsLogiciels';

// // Import du composant QuickActionLogger
// import QuickActionLogger from './components/QuickActionLogger';

// // ==================== FONCTIONS DE L'HISTORIQUE AMÉLIORÉES ====================

// // Fonction pour initialiser l'historique local avec des données CRUD complètes
// const initHistoriqueLocal = () => {
//   console.log('🔄 Initialisation historique CRUD...');
  
//   const STORAGE_KEY = 'gestion_parc_historique';
//   const saved = localStorage.getItem(STORAGE_KEY);
  
//   if (!saved) {
//     const now = new Date();
//     const defaultData = [
//       // AJOUT Matériel
//       {
//         id: 'hist_' + Date.now(),
//         utilisateur: 'odonardo',
//         action: 'AJOUT',
//         module: 'Matériels',
//         details: 'Ajout matériel: PC Portable Dell XPS 15',
//         fullDetails: JSON.stringify({
//           data: {
//             id: 'MAT-001',
//             nom: 'PC Portable Dell XPS 15',
//             type: 'Ordinateur portable',
//             marque: 'Dell',
//             reference: 'XPS-15-9520',
//             etat: 'fonctionnel',
//             service_attribue: 'Direction',
//             date_achat: '2024-01-15',
//             cout: 1899.99
//           },
//           type: 'create',
//           itemType: 'materiel',
//           itemName: 'PC Portable Dell XPS 15',
//           timestamp: new Date(now.getTime() - 86400000).toISOString()
//         }),
//         date: new Date(now.getTime() - 86400000).toISOString(),
//         ip_address: '192.168.1.1',
//         user_agent: 'Chrome/120.0',
//         status: 'SUCCESS'
//       },
      
//       // MODIFICATION Matériel
//       {
//         id: 'hist_' + (Date.now() + 1),
//         utilisateur: 'technicien',
//         action: 'MODIFICATION',
//         module: 'Matériels',
//         details: 'Modification matériel: PC Portable Dell',
//         fullDetails: JSON.stringify({
//           materielId: 'MAT-001',
//           oldData: { nom: 'PC Portable Dell', etat: 'fonctionnel', service_attribue: 'Informatique' },
//           newData: { nom: 'PC Portable Dell XPS', etat: 'maintenance', service_attribue: 'Direction' },
//           changes: {
//             nom: { old: 'PC Portable Dell', new: 'PC Portable Dell XPS' },
//             etat: { old: 'fonctionnel', new: 'maintenance' },
//             service_attribue: { old: 'Informatique', new: 'Direction' }
//           },
//           type: 'update',
//           itemType: 'materiel',
//           itemName: 'PC Portable Dell XPS',
//           timestamp: new Date(now.getTime() - 43200000).toISOString()
//         }),
//         date: new Date(now.getTime() - 43200000).toISOString(),
//         ip_address: '192.168.1.2',
//         user_agent: 'Firefox/119.0',
//         status: 'SUCCESS'
//       },
      
//       // SUPPRESSION Matériel
//       {
//         id: 'hist_' + (Date.now() + 2),
//         utilisateur: 'admin',
//         action: 'SUPPRESSION',
//         module: 'Matériels',
//         details: 'Suppression matériel: Imprimante HP LaserJet',
//         fullDetails: JSON.stringify({
//           data: {
//             id: 'MAT-005',
//             nom: 'Imprimante HP LaserJet',
//             type: 'Imprimante',
//             marque: 'HP',
//             etat: 'hors_service',
//             service_attribue: 'Comptabilité'
//           },
//           type: 'delete',
//           itemType: 'materiel',
//           itemName: 'Imprimante HP LaserJet',
//           timestamp: new Date(now.getTime() - 64800000).toISOString()
//         }),
//         date: new Date(now.getTime() - 64800000).toISOString(),
//         ip_address: '192.168.1.1',
//         user_agent: 'Chrome/120.0',
//         status: 'SUCCESS'
//       },
      
//       // EXPORTATION Rapport
//       {
//         id: 'hist_' + (Date.now() + 3),
//         utilisateur: 'secretariat',
//         action: 'EXPORTATION',
//         module: 'Rapports',
//         details: 'Export rapport Matériels en PDF',
//         fullDetails: JSON.stringify({
//           reportType: 'Matériels',
//           format: 'PDF',
//           filters: { service: 'Direction', etat: 'fonctionnel' },
//           type: 'export',
//           count: 15,
//           timestamp: new Date(now.getTime() - 21600000).toISOString()
//         }),
//         date: new Date(now.getTime() - 21600000).toISOString(),
//         ip_address: '192.168.1.3',
//         user_agent: 'Safari/17.0',
//         status: 'SUCCESS'
//       },
      
//       // EXPORTATION Excel
//       {
//         id: 'hist_' + (Date.now() + 4),
//         utilisateur: 'secretariat',
//         action: 'EXPORTATION',
//         module: 'Rapports',
//         details: 'Export Incidents en Excel',
//         fullDetails: JSON.stringify({
//           reportType: 'Incidents',
//           format: 'Excel',
//           filters: { statut: 'Résolu', date_debut: '2024-01-01' },
//           type: 'export',
//           count: 42,
//           timestamp: new Date(now.getTime() - 18000000).toISOString()
//         }),
//         date: new Date(now.getTime() - 18000000).toISOString(),
//         ip_address: '192.168.1.3',
//         user_agent: 'Safari/17.0',
//         status: 'SUCCESS'
//       },
      
//       // CONSULTATION
//       {
//         id: 'hist_' + (Date.now() + 5),
//         utilisateur: 'directeur',
//         action: 'CONSULTATION',
//         module: 'Matériels',
//         details: 'Consultation Matériels: PC Portable Dell XPS',
//         fullDetails: JSON.stringify({
//           module: 'Matériels',
//           itemId: 'MAT-001',
//           itemName: 'PC Portable Dell XPS',
//           type: 'view',
//           timestamp: new Date(now.getTime() - 10800000).toISOString()
//         }),
//         date: new Date(now.getTime() - 10800000).toISOString(),
//         ip_address: '192.168.1.4',
//         user_agent: 'Edge/120.0',
//         status: 'SUCCESS'
//       },
      
//       // AJOUT Logiciel
//       {
//         id: 'hist_' + (Date.now() + 6),
//         utilisateur: 'technicien',
//         action: 'AJOUT',
//         module: 'Logiciels',
//         details: 'Ajout logiciel: Microsoft Office 365',
//         fullDetails: JSON.stringify({
//           data: {
//             id: 'LOG-001',
//             nom: 'Microsoft Office 365',
//             version: '2024',
//             type: 'Suite bureautique',
//             licence: 'Commerciale',
//             date_expiration: '2025-12-31'
//           },
//           type: 'create',
//           itemType: 'logiciel',
//           itemName: 'Microsoft Office 365',
//           timestamp: new Date(now.getTime() - 7200000).toISOString()
//         }),
//         date: new Date(now.getTime() - 7200000).toISOString(),
//         ip_address: '192.168.1.2',
//         user_agent: 'Firefox/119.0',
//         status: 'SUCCESS'
//       },
      
//       // AJOUT Incident
//       {
//         id: 'hist_' + (Date.now() + 7),
//         utilisateur: 'user1',
//         action: 'AJOUT',
//         module: 'Incidents',
//         details: 'Création incident: Écran cassé sur PC-12',
//         fullDetails: JSON.stringify({
//           data: {
//             id: 'INC-001',
//             titre: 'Écran cassé sur PC-12',
//             description: 'Écran LCD fissuré après chute',
//             priorite: 'Haute',
//             statut: 'En cours',
//             materiel_id: 'MAT-001'
//           },
//           type: 'create',
//           itemType: 'incident',
//           itemName: 'Écran cassé sur PC-12',
//           timestamp: new Date(now.getTime() - 3600000).toISOString()
//         }),
//         date: new Date(now.getTime() - 3600000).toISOString(),
//         ip_address: '192.168.1.5',
//         user_agent: 'Chrome/121.0',
//         status: 'SUCCESS'
//       },
      
//       // CONNEXION
//       {
//         id: 'hist_' + (Date.now() + 8),
//         utilisateur: 'odonardo',
//         action: 'CONNEXION',
//         module: 'Authentification',
//         details: 'Connexion de odonardo',
//         fullDetails: JSON.stringify({
//           username: 'odonardo',
//           userData: { role: 'admin', email: 'odonardo@dren-aa.com' },
//           type: 'auth',
//           timestamp: new Date(now.getTime() - 1800000).toISOString()
//         }),
//         date: new Date(now.getTime() - 1800000).toISOString(),
//         ip_address: '192.168.1.1',
//         user_agent: 'Chrome/120.0',
//         status: 'SUCCESS'
//       },
      
//       // NAVIGATION (seulement une pour l'exemple)
//       {
//         id: 'hist_' + (Date.now() + 9),
//         utilisateur: 'odonardo',
//         action: 'NAVIGATION',
//         module: 'Système',
//         details: 'Navigation vers /dashboard',
//         fullDetails: JSON.stringify({
//           page: '/dashboard',
//           type: 'navigation',
//           timestamp: new Date().toISOString()
//         }),
//         date: new Date().toISOString(),
//         ip_address: '192.168.1.1',
//         user_agent: 'Chrome/120.0',
//         status: 'SUCCESS'
//       }
//     ];
    
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
//     console.log(`✅ Historique CRUD initialisé avec ${defaultData.length} actions variées`);
//   } else {
//     try {
//       const data = JSON.parse(saved);
//       console.log(`✅ Historique déjà chargé (${data.length} actions)`);
//     } catch {
//       console.log('⚠️ Historique corrompu, réinitialisation...');
//       localStorage.removeItem(STORAGE_KEY);
//       initHistoriqueLocal();
//     }
//   }
// };

// // Fonction utilitaire pour détecter les changements
// const getChanges = (oldData, newData) => {
//   const changes = {};
//   for (const key in newData) {
//     if (oldData[key] !== newData[key]) {
//       changes[key] = {
//         old: oldData[key],
//         new: newData[key]
//       };
//     }
//   }
//   return changes;
// };

// // Fonction pour logger une action CRUD (compatible avec historyLogger.js)
// const logAction = (action, module, details, username = null, extraData = {}) => {
//   try {
//     const userStr = localStorage.getItem('user');
//     const user = userStr ? JSON.parse(userStr) : null;
    
//     // S'assurer que le module est correct
//     const finalModule = module === 'Navigation' ? 'Système' : module;
    
//     const newEntry = {
//       id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
//       utilisateur: username || user?.username || 'System',
//       action: action,  // AJOUT, MODIFICATION, SUPPRESSION, EXPORTATION, etc.
//       module: finalModule,  // Matériels, Logiciels, Incidents, etc.
//       details: details,
//       fullDetails: JSON.stringify({
//         ...extraData,
//         timestamp: new Date().toISOString(),
//         userAgent: navigator.userAgent,
//         ip: 'localhost'
//       }),
//       date: new Date().toISOString(),
//       ip_address: 'localhost',
//       user_agent: navigator.userAgent,
//       status: 'SUCCESS'
//     };
    
//     const STORAGE_KEY = 'gestion_parc_historique';
//     const historique = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
//     const newHistorique = [newEntry, ...historique.slice(0, 499)]; // Limite à 500 entrées
    
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
//     console.log(`📝 Action CRUD loggée: ${action} - ${finalModule} - ${details}`);
    
//     // Émettre un événement pour mettre à jour l'UI en temps réel
//     window.dispatchEvent(new CustomEvent('action-logged', { detail: newEntry }));
    
//     return newEntry;
//   } catch (error) {
//     console.error('❌ Erreur logging action:', error);
//     return null;
//   }
// };

// // ==================== ACTION LOGGER COMPLET (compatible) ====================

// // Objet ActionLogger étendu pour toutes les méthodes CRUD
// const ActionLogger = {
//   // ========== AUTHENTIFICATION ==========
//   login: (username, userData = {}) => 
//     logAction('CONNEXION', 'Authentification', `Connexion de ${username}`, username, {
//       username: username,
//       userData: userData,
//       type: 'auth'
//     }),
  
//   logout: (username) => 
//     logAction('DECONNEXION', 'Authentification', `Déconnexion de ${username}`, username, {
//       username: username,
//       type: 'auth'
//     }),
  
//   // ========== MATÉRIELS ==========
//   createMateriel: (materielData, username) => 
//     logAction('AJOUT', 'Matériels', `Ajout matériel: ${materielData.nom || 'Nouveau matériel'}`, username, {
//       data: materielData,
//       type: 'create',
//       itemType: 'materiel',
//       itemName: materielData.nom
//     }),
  
//   updateMateriel: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Matériels', `Modification matériel: ${oldData.nom || id}`, username, {
//       materielId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'materiel',
//       itemName: newData.nom || oldData.nom
//     }),
  
//   deleteMateriel: (id, materielData, username) => 
//     logAction('SUPPRESSION', 'Matériels', `Suppression matériel: ${materielData.nom || id}`, username, {
//       materielId: id,
//       data: materielData,
//       type: 'delete',
//       itemType: 'materiel',
//       itemName: materielData.nom
//     }),
  
//   // ========== LOGICIELS ==========
//   createLogiciel: (logicielData, username) => 
//     logAction('AJOUT', 'Logiciels', `Ajout logiciel: ${logicielData.nom || 'Nouveau logiciel'}`, username, {
//       data: logicielData,
//       type: 'create',
//       itemType: 'logiciel',
//       itemName: logicielData.nom
//     }),
  
//   updateLogiciel: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Logiciels', `Modification logiciel: ${oldData.nom || id}`, username, {
//       logicielId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'logiciel',
//       itemName: newData.nom || oldData.nom
//     }),
  
//   deleteLogiciel: (id, logicielData, username) => 
//     logAction('SUPPRESSION', 'Logiciels', `Suppression logiciel: ${logicielData.nom || id}`, username, {
//       logicielId: id,
//       data: logicielData,
//       type: 'delete',
//       itemType: 'logiciel',
//       itemName: logicielData.nom
//     }),
  
//   // ========== INCIDENTS ==========
//   createIncident: (incidentData, username) => 
//     logAction('AJOUT', 'Incidents', `Création incident: ${incidentData.titre || 'Nouvel incident'}`, username, {
//       data: incidentData,
//       type: 'create',
//       itemType: 'incident',
//       itemName: incidentData.titre
//     }),
  
//   updateIncident: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Incidents', `Modification incident: ${oldData.titre || id}`, username, {
//       incidentId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'incident',
//       itemName: newData.titre || oldData.titre
//     }),
  
//   resolveIncident: (id, incidentData, username) => 
//     logAction('RÉSOLUTION', 'Incidents', `Résolution incident: ${incidentData.titre || id}`, username, {
//       incidentId: id,
//       data: incidentData,
//       type: 'resolve',
//       itemType: 'incident',
//       itemName: incidentData.titre
//     }),
  
//   deleteIncident: (id, incidentData, username) => 
//     logAction('SUPPRESSION', 'Incidents', `Suppression incident: ${incidentData.titre || id}`, username, {
//       incidentId: id,
//       data: incidentData,
//       type: 'delete',
//       itemType: 'incident',
//       itemName: incidentData.titre
//     }),
  
//   // ========== RÉPARATIONS ==========
//   createReparation: (reparationData, username) => 
//     logAction('AJOUT', 'Réparations', `Création réparation pour: ${reparationData.materiel_id || 'Matériel'}`, username, {
//       data: reparationData,
//       type: 'create',
//       itemType: 'reparation'
//     }),
  
//   updateReparation: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Réparations', `Modification réparation #${id}`, username, {
//       reparationId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'reparation'
//     }),
  
//   completeReparation: (id, reparationData, username) => 
//     logAction('MODIFICATION', 'Réparations', `Réparation terminée #${id}`, username, {
//       reparationId: id,
//       data: reparationData,
//       type: 'complete',
//       itemType: 'reparation'
//     }),
  
//   // ========== ALERTES ==========
//   createAlerte: (alerteData, username) => 
//     logAction('AJOUT', 'Alertes', `Création alerte: ${alerteData.titre || 'Nouvelle alerte'}`, username, {
//       data: alerteData,
//       type: 'create',
//       itemType: 'alerte',
//       itemName: alerteData.titre
//     }),
  
//   updateAlerte: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Alertes', `Modification alerte: ${oldData.titre || id}`, username, {
//       alerteId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'alerte',
//       itemName: newData.titre || oldData.titre
//     }),
  
//   // ========== FOURNISSEURS ==========
//   createFournisseur: (fournisseurData, username) => 
//     logAction('AJOUT', 'Fournisseurs', `Ajout fournisseur: ${fournisseurData.nom || 'Nouveau fournisseur'}`, username, {
//       data: fournisseurData,
//       type: 'create',
//       itemType: 'fournisseur',
//       itemName: fournisseurData.nom
//     }),
  
//   updateFournisseur: (id, oldData, newData, username) => 
//     logAction('MODIFICATION', 'Fournisseurs', `Modification fournisseur: ${oldData.nom || id}`, username, {
//       fournisseurId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'fournisseur',
//       itemName: newData.nom || oldData.nom
//     }),
  
//   deleteFournisseur: (id, fournisseurData, username) => 
//     logAction('SUPPRESSION', 'Fournisseurs', `Suppression fournisseur: ${fournisseurData.nom || id}`, username, {
//       fournisseurId: id,
//       data: fournisseurData,
//       type: 'delete',
//       itemType: 'fournisseur',
//       itemName: fournisseurData.nom
//     }),
  
//   // ========== UTILISATEURS ==========
//   createUser: (userData, createdBy) => 
//     logAction('AJOUT', 'Utilisateurs', `Création utilisateur: ${userData.username || 'Nouvel utilisateur'}`, createdBy, {
//       data: userData,
//       type: 'create',
//       itemType: 'user',
//       itemName: userData.username
//     }),
  
//   updateUser: (id, oldData, newData, updatedBy) => 
//     logAction('MODIFICATION', 'Utilisateurs', `Modification utilisateur: ${oldData.username || id}`, updatedBy, {
//       userId: id,
//       oldData: oldData,
//       newData: newData,
//       changes: getChanges(oldData, newData),
//       type: 'update',
//       itemType: 'user',
//       itemName: newData.username || oldData.username
//     }),
  
//   deleteUser: (id, userData, deletedBy) => 
//     logAction('SUPPRESSION', 'Utilisateurs', `Suppression utilisateur: ${userData.username || id}`, deletedBy, {
//       userId: id,
//       data: userData,
//       type: 'delete',
//       itemType: 'user',
//       itemName: userData.username
//     }),
  
//   // ========== RAPPORTS & EXPORTATIONS ==========
//   generateReport: (type, format, filters, username) => 
//     logAction('EXPORTATION', 'Rapports', `Export rapport ${type} en ${format}`, username, {
//       reportType: type,
//       format: format,
//       filters: filters || {},
//       type: 'export',
//       timestamp: new Date().toISOString()
//     }),
  
//   exportData: (module, format, dataCount, username) => 
//     logAction('EXPORTATION', 'Rapports', `Export ${module} (${dataCount} éléments) en ${format}`, username, {
//       module: module,
//       format: format,
//       count: dataCount,
//       type: 'export',
//       timestamp: new Date().toISOString()
//     }),
  
//   printReport: (type, username) => 
//     logAction('GENERATION', 'Rapports', `Impression rapport ${type}`, username, {
//       reportType: type,
//       format: 'PDF',
//       type: 'print',
//       timestamp: new Date().toISOString()
//     }),
  
//   // ========== CONSULTATIONS ==========
//   viewDetails: (module, itemId, itemName, username) => 
//     logAction('CONSULTATION', module, `Consultation ${module}: ${itemName || itemId}`, username, {
//       module: module,
//       itemId: itemId,
//       itemName: itemName,
//       type: 'view',
//       timestamp: new Date().toISOString()
//     }),
  
//   searchData: (module, searchTerm, resultsCount, username) => 
//     logAction('CONSULTATION', module, `Recherche dans ${module}: "${searchTerm}" (${resultsCount} résultats)`, username, {
//       module: module,
//       searchTerm: searchTerm,
//       resultsCount: resultsCount,
//       type: 'search',
//       timestamp: new Date().toISOString()
//     }),
  
//   // ========== INSTALLATIONS LOGICIELS ==========
//   installLogiciel: (logicielName, materielId, username) => 
//     logAction('AJOUT', 'Installations', `Installation logiciel: ${logicielName} sur ${materielId}`, username, {
//       logicielName: logicielName,
//       materielId: materielId,
//       type: 'install',
//       timestamp: new Date().toISOString()
//     }),
  
//   uninstallLogiciel: (logicielName, materielId, username) => 
//     logAction('SUPPRESSION', 'Installations', `Désinstallation logiciel: ${logicielName} de ${materielId}`, username, {
//       logicielName: logicielName,
//       materielId: materielId,
//       type: 'uninstall',
//       timestamp: new Date().toISOString()
//     }),
  
//   // ========== NAVIGATION (seulement pour les changements de page) ==========
//   viewPage: (page, username) => 
//     logAction('NAVIGATION', 'Système', `Navigation vers ${page}`, username, {
//       page: page,
//       type: 'navigation',
//       timestamp: new Date().toISOString()
//     }),
  
//   // ========== GÉNÉRIQUE ==========
//   custom: (action, module, details, username, extraData = {}) => 
//     logAction(action, module, details, username, extraData)
// };

// // ==================== FONCTIONS DE TEST ====================

// // Fonction pour tester toutes les actions CRUD
// const testAllCRUDActions = () => {
//   const testUser = 'odonardo';
  
//   console.log('🧪 Test des actions CRUD...');
  
//   // 1. AJOUT Matériel
//   setTimeout(() => {
//     ActionLogger.createMateriel({
//       id: 'MAT-' + Date.now(),
//       nom: 'PC Portable Dell XPS 15',
//       type: 'Ordinateur portable',
//       marque: 'Dell',
//       reference: 'XPS-15-9520',
//       etat: 'fonctionnel',
//       service_attribue: 'Direction',
//       date_achat: '2024-01-15',
//       cout: 1899.99
//     }, testUser);
//   }, 100);
  
//   // 2. MODIFICATION Matériel
//   setTimeout(() => {
//     ActionLogger.updateMateriel(
//       'MAT-001',
//       { nom: 'PC Portable Dell', etat: 'fonctionnel', service_attribue: 'Informatique' },
//       { nom: 'PC Portable Dell XPS', etat: 'maintenance', service_attribue: 'Direction' },
//       testUser
//     );
//   }, 500);
  
//   // 3. SUPPRESSION Matériel
//   setTimeout(() => {
//     ActionLogger.deleteMateriel(
//       'MAT-005',
//       { nom: 'Imprimante HP LaserJet', type: 'Imprimante', marque: 'HP' },
//       testUser
//     );
//   }, 1000);
  
//   // 4. AJOUT Logiciel
//   setTimeout(() => {
//     ActionLogger.createLogiciel({
//       id: 'LOG-' + Date.now(),
//       nom: 'Microsoft Office 365',
//       version: '2024',
//       type: 'Suite bureautique',
//       licence: 'Commerciale',
//       date_expiration: '2025-12-31'
//     }, testUser);
//   }, 1500);
  
//   // 5. AJOUT Incident
//   setTimeout(() => {
//     ActionLogger.createIncident({
//       id: 'INC-' + Date.now(),
//       titre: 'Écran cassé sur PC-12',
//       description: 'Écran LCD fissuré après chute',
//       priorite: 'Haute',
//       statut: 'En cours',
//       materiel_id: 'MAT-001'
//     }, testUser);
//   }, 2000);
  
//   // 6. RÉSOLUTION Incident
//   setTimeout(() => {
//     ActionLogger.resolveIncident(
//       'INC-001',
//       { titre: 'Écran cassé sur PC-12', statut: 'En cours' },
//       testUser
//     );
//   }, 2500);
  
//   // 7. AJOUT Réparation
//   setTimeout(() => {
//     ActionLogger.createReparation({
//       id: 'REP-' + Date.now(),
//       materiel_id: 'MAT-001',
//       description: 'Remplacement écran LCD',
//       cout: 350.00,
//       date_debut: '2024-01-20',
//       date_fin: '2024-01-21',
//       technicien: 'Jean Tech'
//     }, testUser);
//   }, 3000);
  
//   // 8. EXPORTATION Rapport PDF
//   setTimeout(() => {
//     ActionLogger.generateReport('Matériels', 'PDF', { 
//       service: 'Direction',
//       etat: 'fonctionnel',
//       date_debut: '2024-01-01',
//       date_fin: '2024-12-31'
//     }, testUser);
//   }, 3500);
  
//   // 9. EXPORTATION Excel
//   setTimeout(() => {
//     ActionLogger.exportData('Incidents', 'Excel', 24, testUser);
//   }, 4000);
  
//   // 10. CONSULTATION
//   setTimeout(() => {
//     ActionLogger.viewDetails('Matériels', 'MAT-001', 'PC Portable Dell XPS', testUser);
//   }, 4500);
  
//   // 11. RECHERCHE
//   setTimeout(() => {
//     ActionLogger.searchData('Matériels', 'Dell', 8, testUser);
//   }, 5000);
  
//   // 12. INSTALLATION Logiciel
//   setTimeout(() => {
//     ActionLogger.installLogiciel('Microsoft Office 365', 'MAT-001', testUser);
//   }, 5500);
  
//   // 13. CONNEXION
//   setTimeout(() => {
//     ActionLogger.login(testUser, { role: 'admin', email: 'odonardo@dren-aa.com' });
//   }, 6000);
  
//   // 14. NAVIGATION (seulement une)
//   setTimeout(() => {
//     ActionLogger.viewPage('/historique', testUser);
//   }, 6500);
  
//   console.log('✅ 14 actions CRUD de test programmées');
  
//   return 'Test CRUD démarré. Vérifiez la page Historique dans quelques secondes.';
// };

// // Initialiser les écouteurs d'actions
// const initActionLogger = () => {
//   console.log('🎯 Configuration des écouteurs d\'actions CRUD...');
  
//   // Exposer globalement
//   window.ActionLogger = ActionLogger;
  
//   // Écouter les événements de connexion
//   window.addEventListener('user-login', (event) => {
//     const { username, userData } = event.detail || {};
//     if (username) {
//       ActionLogger.login(username, userData);
//     }
//   });
  
//   // Écouter les événements de déconnexion
//   window.addEventListener('user-logout', (event) => {
//     const { username } = event.detail || {};
//     if (username) {
//       ActionLogger.logout(username);
//     }
//   });
  
//   // Écouter les événements génériques d'actions
//   window.addEventListener('log-crud-action', (event) => {
//     const { action, module, details, username, extraData } = event.detail || {};
//     if (action && module && details) {
//       ActionLogger.custom(action, module, details, username, extraData);
//     }
//   });
  
//   console.log('✅ ActionLogger CRUD initialisé');
// };

// // ==================== COMPOSANT POUR LOGGER LA NAVIGATION ====================

// const NavigationLogger = () => {
//   const location = useLocation();
//   const { user } = useAuth();
  
//   useEffect(() => {
//     if (user && window.ActionLogger) {
//       // Logger la navigation après un court délai
//       setTimeout(() => {
//         // Seulement logger les vraies navigations, pas toutes les actions
//         if (location.pathname !== window.lastLoggedPath) {
//           window.ActionLogger.viewPage(location.pathname, user.username);
//           window.lastLoggedPath = location.pathname;
//         }
//       }, 500);
//     }
//   }, [location.pathname, user]);
  
//   return null;
// };

// // ==================== COMPOSANTS DE ROUTE ====================

// const ProtectedRoute = ({ children, requiredRole = null }) => {
//   const { user, loading } = useAuth();
//   const { hasAccess } = usePermissions();
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
//           <p className="text-white">Chargement du système...</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
  
//   if (requiredRole && !hasAccess(requiredRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }
  
//   return children;
// };

// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
//           <p className="text-white">Chargement...</p>
//         </div>
//       </div>
//     );
//   }
  
//   return !user ? children : <Navigate to="/dashboard" replace />;
// };

// // ==================== COMPOSANT APP ROUTES ====================

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Routes publiques */}
//       <Route path="/login" element={
//         <PublicRoute>
//           <Login />
//         </PublicRoute>
//       } />
      
//       <Route path="/register" element={
//         <PublicRoute>
//           <Register />
//         </PublicRoute>
//       } />
      
//       {/* Route pour unauthorized */}
//       <Route path="/unauthorized" element={<Unauthorized />} />
      
//       {/* Routes protégées avec Layout */}
//       <Route path="/" element={
//         <ProtectedRoute>
//           <Layout />
//         </ProtectedRoute>
//       }>
//         <Route index element={<Navigate to="/dashboard" replace />} />
//         <Route path="dashboard" element={
//           <ProtectedRoute requiredRole="user">
//             <Dashboard />
//           </ProtectedRoute>
//         } />
        
//         <Route path="materiels" element={
//           <ProtectedRoute requiredRole="user">
//             <Materiels />
//           </ProtectedRoute>
//         } />
        
//         {/* <Route path="logiciels" element={
//           <ProtectedRoute requiredRole="user">
//             <Logiciels />
//           </ProtectedRoute>
//         } /> */}
        
//         <Route path="incidents" element={
//           <ProtectedRoute requiredRole="user">
//             <Incidents />
//           </ProtectedRoute>
//         } />
        
//         <Route path="reparations" element={
//           <ProtectedRoute requiredRole="technician">
//             <Reparations />
//           </ProtectedRoute>
//         } />
        
//         <Route path="rapports" element={
//           <ProtectedRoute requiredRole="secretary">
//             <Rapports />
//           </ProtectedRoute>
//         } />
        
//         <Route path="users" element={
//           <ProtectedRoute requiredRole="director">
//             <Users />
//           </ProtectedRoute>
//         } />
        
//         <Route path="alertes" element={
//           <ProtectedRoute requiredRole="technician">
//             <Alertes />
//           </ProtectedRoute>
//         } />
        
//         <Route path="fournisseurs" element={
//           <ProtectedRoute requiredRole="secretary">
//             <Fournisseurs />
//           </ProtectedRoute>
//         } />
        
//         {/* <Route path="installations-logiciels" element={
//           <ProtectedRoute requiredRole="technician">
//             <InstallationsLogiciels />
//           </ProtectedRoute>
//         } /> */}
        
//         <Route path="profils-utilisateurs" element={
//           <ProtectedRoute requiredRole="user">
//             <ProfilsUtilisateurs />
//           </ProtectedRoute>
//         } />
        
//         {/* <Route path="configuration-reseau" element={
//           <ProtectedRoute requiredRole="technician">
//             <ConfigurationReseau />
//           </ProtectedRoute>
//         } /> */}
        
//         <Route path="historique" element={
//           <ProtectedRoute requiredRole="director">
//             <Historique />
//           </ProtectedRoute>
//         } />
//       </Route>
      
//       {/* Redirection par défaut */}
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// };

// // ==================== COMPOSANT APP PRINCIPAL ====================

// function App() {
//   useEffect(() => {
//     console.log('🚀 Démarrage application DREN AA...');
    
//     // Initialiser l'historique avec des données CRUD
//     initHistoriqueLocal();
    
//     // Initialiser le logger d'actions CRUD
//     initActionLogger();
    
//     // Enregistrer le démarrage de l'application
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         console.log(`✅ Application démarrée pour: ${user.username}`);
        
//         // Enregistrer l'action de démarrage
//         setTimeout(() => {
//           ActionLogger.custom('DEMARRAGE', 'Système', 'Application DREN AA démarrée', user.username, {
//             version: '2.0.0',
//             timestamp: new Date().toISOString(),
//             environment: 'production'
//           });
//         }, 1000);
//       } catch (error) {
//         console.error('❌ Erreur parsing user:', error);
//       }
//     }
    
//     // Ajouter des fonctions de test dans la console
//     if (typeof window !== 'undefined') {
//       // Exposer les fonctions de test CRUD
//       window.testAllCRUDActions = testAllCRUDActions;
      
//       // Fonction pour ajouter une action CRUD manuelle
//       window.addCRUDAction = () => {
//         const action = prompt("Type d'action (AJOUT/MODIFICATION/SUPPRESSION/EXPORTATION/CONSULTATION/NAVIGATION):", "AJOUT");
//         const module = prompt("Module:", "Matériels");
//         const details = prompt("Détails:", "Ajout d'un nouveau matériel");
//         const username = prompt("Utilisateur:", "odonardo");
        
//         if (action && module && details && username) {
//           const extraData = {
//             itemName: details.split(':')[1]?.trim() || 'Élément',
//             timestamp: new Date().toISOString(),
//             type: action.toLowerCase()
//           };
          
//           ActionLogger.custom(action, module, details, username, extraData);
//           alert(`✅ Action "${action}" ajoutée pour ${module}!`);
          
//           // Recharger l'historique si ouvert
//           if (window.location.pathname === '/historique') {
//             setTimeout(() => window.dispatchEvent(new CustomEvent('action-logged')), 1000);
//           }
//         }
//       };
      
//       // Fonction pour effacer l'historique
//       window.clearHistorique = () => {
//         if (confirm('Voulez-vous vraiment effacer tout l\'historique?')) {
//           localStorage.removeItem('gestion_parc_historique');
//           alert('✅ Historique effacé!');
//           initHistoriqueLocal();
//           alert('✅ Données de test réinitialisées!');
//         }
//       };
      
//       // Fonction pour voir le contenu de l'historique
//       window.showHistorique = () => {
//         const STORAGE_KEY = 'gestion_parc_historique';
//         const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
//         console.log('📊 Contenu historique:', data);
//         console.log(`Total: ${data.length} actions`);
        
//         // Afficher les statistiques par type d'action
//         const stats = {};
//         data.forEach(item => {
//           stats[item.action] = (stats[item.action] || 0) + 1;
//         });
//         console.log('📈 Statistiques par action:', stats);
        
//         alert(`Historique: ${data.length} actions\n` + 
//               Object.entries(stats).map(([action, count]) => `${action}: ${count}`).join('\n'));
//       };
      
//       console.log('🔧 Fonctions CRUD disponibles dans la console:');
//       console.log('- testAllCRUDActions(): Tester toutes les actions CRUD');
//       console.log('- addCRUDAction(): Ajouter une action CRUD manuelle');
//       console.log('- clearHistorique(): Effacer l\'historique');
//       console.log('- showHistorique(): Voir le contenu');
//       console.log('- ActionLogger: Objet complet pour logger les actions');
//     }
//   }, []);

//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <NotificationProvider>
//           <Router>
//             <div className="min-h-screen bg-base-100">
//               <NavigationLogger />
//               <AppRoutes />
//               <QuickActionLogger />
//               <ToastContainer 
//                 position="top-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 newestOnTop
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//               />
//             </div>
//           </Router>
//         </NotificationProvider>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// // Exportez les fonctions pour les utiliser ailleurs
// export { 
//   initHistoriqueLocal, 
//   ActionLogger,
//   initActionLogger,
//   testAllCRUDActions,
//   logAction 
// };

// export default App;





// src/App.jsx - VERSION CORRIGÉE
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { usePermissions } from './hooks/usePermissions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import Layout from './components/Layout';

// Pages
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import Materiels from './pages/Materiels';
// import Logiciels from './pages/Logiciels';
import Incidents from './pages/Incidents';
import Reparations from './pages/Reparations';
import Rapports from './pages/Rapports';
import Users from './pages/Users';
import Alertes from './pages/Alertes';
import Fournisseurs from './pages/Fournisseurs';
import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// import ConfigurationReseau from './pages/ConfigurationReseau';
import Unauthorized from './pages/Unauthorized';
import Historique from './pages/Historique';
// import InstallationsLogiciels from './pages/InstallationsLogiciels';

// Import du composant QuickActionLogger
import QuickActionLogger from './components/QuickActionLogger';

// Dans src/App.jsx, ajoutez:
import AutoLoggerProvider from './components/AutoLoggerProvider';

// ==================== FONCTIONS DE L'HISTORIQUE AMÉLIORÉES ====================

// Fonction pour initialiser l'historique local avec des données CRUD complètes
const initHistoriqueLocal = () => {
  console.log('🔄 Initialisation historique CRUD...');
  
  const STORAGE_KEY = 'gestion_parc_historique';
  const saved = localStorage.getItem(STORAGE_KEY);
  
  if (!saved) {
    const now = new Date();
    const defaultData = [
      // AJOUT Matériel
      {
        id: 'hist_' + Date.now(),
        utilisateur: 'odonardo',
        action: 'AJOUT',
        module: 'Matériels',
        details: 'Ajout matériel: PC Portable Dell XPS 15',
        fullDetails: JSON.stringify({
          data: {
            id: 'MAT-001',
            nom: 'PC Portable Dell XPS 15',
            type: 'Ordinateur portable',
            marque: 'Dell',
            reference: 'XPS-15-9520',
            etat: 'fonctionnel',
            service_attribue: 'Direction',
            date_achat: '2024-01-15',
            cout: 1899.99
          },
          type: 'create',
          itemType: 'materiel',
          itemName: 'PC Portable Dell XPS 15',
          timestamp: new Date(now.getTime() - 86400000).toISOString()
        }),
        date: new Date(now.getTime() - 86400000).toISOString(),
        ip_address: '192.168.1.1',
        user_agent: 'Chrome/120.0',
        status: 'SUCCESS'
      },
      
      // MODIFICATION Matériel
      {
        id: 'hist_' + (Date.now() + 1),
        utilisateur: 'technicien',
        action: 'MODIFICATION',
        module: 'Matériels',
        details: 'Modification matériel: PC Portable Dell',
        fullDetails: JSON.stringify({
          materielId: 'MAT-001',
          oldData: { nom: 'PC Portable Dell', etat: 'fonctionnel', service_attribue: 'Informatique' },
          newData: { nom: 'PC Portable Dell XPS', etat: 'maintenance', service_attribue: 'Direction' },
          changes: {
            nom: { old: 'PC Portable Dell', new: 'PC Portable Dell XPS' },
            etat: { old: 'fonctionnel', new: 'maintenance' },
            service_attribue: { old: 'Informatique', new: 'Direction' }
          },
          type: 'update',
          itemType: 'materiel',
          itemName: 'PC Portable Dell XPS',
          timestamp: new Date(now.getTime() - 43200000).toISOString()
        }),
        date: new Date(now.getTime() - 43200000).toISOString(),
        ip_address: '192.168.1.2',
        user_agent: 'Firefox/119.0',
        status: 'SUCCESS'
      },
      
      // SUPPRESSION Matériel
      {
        id: 'hist_' + (Date.now() + 2),
        utilisateur: 'admin',
        action: 'SUPPRESSION',
        module: 'Matériels',
        details: 'Suppression matériel: Imprimante HP LaserJet',
        fullDetails: JSON.stringify({
          data: {
            id: 'MAT-005',
            nom: 'Imprimante HP LaserJet',
            type: 'Imprimante',
            marque: 'HP',
            etat: 'hors_service',
            service_attribue: 'Comptabilité'
          },
          type: 'delete',
          itemType: 'materiel',
          itemName: 'Imprimante HP LaserJet',
          timestamp: new Date(now.getTime() - 64800000).toISOString()
        }),
        date: new Date(now.getTime() - 64800000).toISOString(),
        ip_address: '192.168.1.1',
        user_agent: 'Chrome/120.0',
        status: 'SUCCESS'
      },
      
      // EXPORTATION Rapport
      {
        id: 'hist_' + (Date.now() + 3),
        utilisateur: 'secretariat',
        action: 'EXPORTATION',
        module: 'Rapports',
        details: 'Export rapport Matériels en PDF',
        fullDetails: JSON.stringify({
          reportType: 'Matériels',
          format: 'PDF',
          filters: { service: 'Direction', etat: 'fonctionnel' },
          type: 'export',
          count: 15,
          timestamp: new Date(now.getTime() - 21600000).toISOString()
        }),
        date: new Date(now.getTime() - 21600000).toISOString(),
        ip_address: '192.168.1.3',
        user_agent: 'Safari/17.0',
        status: 'SUCCESS'
      },
      
      // EXPORTATION Excel
      {
        id: 'hist_' + (Date.now() + 4),
        utilisateur: 'secretariat',
        action: 'EXPORTATION',
        module: 'Rapports',
        details: 'Export Incidents en Excel',
        fullDetails: JSON.stringify({
          reportType: 'Incidents',
          format: 'Excel',
          filters: { statut: 'Résolu', date_debut: '2024-01-01' },
          type: 'export',
          count: 42,
          timestamp: new Date(now.getTime() - 18000000).toISOString()
        }),
        date: new Date(now.getTime() - 18000000).toISOString(),
        ip_address: '192.168.1.3',
        user_agent: 'Safari/17.0',
        status: 'SUCCESS'
      },
      
      // CONSULTATION
      {
        id: 'hist_' + (Date.now() + 5),
        utilisateur: 'directeur',
        action: 'CONSULTATION',
        module: 'Matériels',
        details: 'Consultation Matériels: PC Portable Dell XPS',
        fullDetails: JSON.stringify({
          module: 'Matériels',
          itemId: 'MAT-001',
          itemName: 'PC Portable Dell XPS',
          type: 'view',
          timestamp: new Date(now.getTime() - 10800000).toISOString()
        }),
        date: new Date(now.getTime() - 10800000).toISOString(),
        ip_address: '192.168.1.4',
        user_agent: 'Edge/120.0',
        status: 'SUCCESS'
      },
      
      // AJOUT Logiciel
      {
        id: 'hist_' + (Date.now() + 6),
        utilisateur: 'technicien',
        action: 'AJOUT',
        module: 'Logiciels',
        details: 'Ajout logiciel: Microsoft Office 365',
        fullDetails: JSON.stringify({
          data: {
            id: 'LOG-001',
            nom: 'Microsoft Office 365',
            version: '2024',
            type: 'Suite bureautique',
            licence: 'Commerciale',
            date_expiration: '2025-12-31'
          },
          type: 'create',
          itemType: 'logiciel',
          itemName: 'Microsoft Office 365',
          timestamp: new Date(now.getTime() - 7200000).toISOString()
        }),
        date: new Date(now.getTime() - 7200000).toISOString(),
        ip_address: '192.168.1.2',
        user_agent: 'Firefox/119.0',
        status: 'SUCCESS'
      },
      
      // AJOUT Incident
      {
        id: 'hist_' + (Date.now() + 7),
        utilisateur: 'user1',
        action: 'AJOUT',
        module: 'Incidents',
        details: 'Création incident: Écran cassé sur PC-12',
        fullDetails: JSON.stringify({
          data: {
            id: 'INC-001',
            titre: 'Écran cassé sur PC-12',
            description: 'Écran LCD fissuré après chute',
            priorite: 'Haute',
            statut: 'En cours',
            materiel_id: 'MAT-001'
          },
          type: 'create',
          itemType: 'incident',
          itemName: 'Écran cassé sur PC-12',
          timestamp: new Date(now.getTime() - 3600000).toISOString()
        }),
        date: new Date(now.getTime() - 3600000).toISOString(),
        ip_address: '192.168.1.5',
        user_agent: 'Chrome/121.0',
        status: 'SUCCESS'
      },
      
      // CONNEXION
      {
        id: 'hist_' + (Date.now() + 8),
        utilisateur: 'odonardo',
        action: 'CONNEXION',
        module: 'Authentification',
        details: 'Connexion de odonardo',
        fullDetails: JSON.stringify({
          username: 'odonardo',
          userData: { role: 'admin', email: 'odonardo@dren-aa.com' },
          type: 'auth',
          timestamp: new Date(now.getTime() - 1800000).toISOString()
        }),
        date: new Date(now.getTime() - 1800000).toISOString(),
        ip_address: '192.168.1.1',
        user_agent: 'Chrome/120.0',
        status: 'SUCCESS'
      },
      
      // NAVIGATION (seulement une pour l'exemple)
      {
        id: 'hist_' + (Date.now() + 9),
        utilisateur: 'odonardo',
        action: 'NAVIGATION',
        module: 'Système',
        details: 'Navigation vers /dashboard',
        fullDetails: JSON.stringify({
          page: '/dashboard',
          type: 'navigation',
          timestamp: new Date().toISOString()
        }),
        date: new Date().toISOString(),
        ip_address: '192.168.1.1',
        user_agent: 'Chrome/120.0',
        status: 'SUCCESS'
      }
    ];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    console.log(`✅ Historique CRUD initialisé avec ${defaultData.length} actions variées`);
  } else {
    try {
      const data = JSON.parse(saved);
      console.log(`✅ Historique déjà chargé (${data.length} actions)`);
    } catch {
      console.log('⚠️ Historique corrompu, réinitialisation...');
      localStorage.removeItem(STORAGE_KEY);
      initHistoriqueLocal();
    }
  }
};

// Fonction utilitaire pour détecter les changements
const getChanges = (oldData, newData) => {
  const changes = {};
  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        old: oldData[key],
        new: newData[key]
      };
    }
  }
  return changes;
};

// Fonction pour logger une action CRUD (compatible avec historyLogger.js)
const logAction = (action, module, details, username = null, extraData = {}) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // S'assurer que le module est correct
    const finalModule = module === 'Navigation' ? 'Système' : module;
    
    const newEntry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      utilisateur: username || user?.username || 'System',
      action: action,  // AJOUT, MODIFICATION, SUPPRESSION, EXPORTATION, etc.
      module: finalModule,  // Matériels, Logiciels, Incidents, etc.
      details: details,
      fullDetails: JSON.stringify({
        ...extraData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: 'localhost'
      }),
      date: new Date().toISOString(),
      ip_address: 'localhost',
      user_agent: navigator.userAgent,
      status: 'SUCCESS'
    };
    
    const STORAGE_KEY = 'gestion_parc_historique';
    const historique = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newHistorique = [newEntry, ...historique.slice(0, 499)]; // Limite à 500 entrées
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
    console.log(`📝 Action CRUD loggée: ${action} - ${finalModule} - ${details}`);
    
    // Émettre un événement pour mettre à jour l'UI en temps réel
    window.dispatchEvent(new CustomEvent('action-logged', { detail: newEntry }));
    
    return newEntry;
  } catch (error) {
    console.error('❌ Erreur logging action:', error);
    return null;
  }
};

// ==================== ACTION LOGGER COMPLET (compatible) ====================

// Objet ActionLogger étendu pour toutes les méthodes CRUD
const ActionLogger = {
  // ========== AUTHENTIFICATION ==========
  login: (username, userData = {}) => 
    logAction('CONNEXION', 'Authentification', `Connexion de ${username}`, username, {
      username: username,
      userData: userData,
      type: 'auth'
    }),
  
  logout: (username) => 
    logAction('DECONNEXION', 'Authentification', `Déconnexion de ${username}`, username, {
      username: username,
      type: 'auth'
    }),
  
  // ========== MATÉRIELS ==========
  createMateriel: (materielData, username) => 
    logAction('AJOUT', 'Matériels', `Ajout matériel: ${materielData.nom || 'Nouveau matériel'}`, username, {
      data: materielData,
      type: 'create',
      itemType: 'materiel',
      itemName: materielData.nom
    }),
  
  updateMateriel: (id, oldData, newData, username) => 
    logAction('MODIFICATION', 'Matériels', `Modification matériel: ${oldData.nom || id}`, username, {
      materielId: id,
      oldData: oldData,
      newData: newData,
      changes: getChanges(oldData, newData),
      type: 'update',
      itemType: 'materiel',
      itemName: newData.nom || oldData.nom
    }),
  
  deleteMateriel: (id, materielData, username) => 
    logAction('SUPPRESSION', 'Matériels', `Suppression matériel: ${materielData.nom || id}`, username, {
      materielId: id,
      data: materielData,
      type: 'delete',
      itemType: 'materiel',
      itemName: materielData.nom
    }),
  
  // ========== LOGICIELS ==========
  createLogiciel: (logicielData, username) => 
    logAction('AJOUT', 'Logiciels', `Ajout logiciel: ${logicielData.nom || 'Nouveau logiciel'}`, username, {
      data: logicielData,
      type: 'create',
      itemType: 'logiciel',
      itemName: logicielData.nom
    }),
  
  updateLogiciel: (id, oldData, newData, username) => 
    logAction('MODIFICATION', 'Logiciels', `Modification logiciel: ${oldData.nom || id}`, username, {
      logicielId: id,
      oldData: oldData,
      newData: newData,
      changes: getChanges(oldData, newData),
      type: 'update',
      itemType: 'logiciel',
      itemName: newData.nom || oldData.nom
    }),
  
  deleteLogiciel: (id, logicielData, username) => 
    logAction('SUPPRESSION', 'Logiciels', `Suppression logiciel: ${logicielData.nom || id}`, username, {
      logicielId: id,
      data: logicielData,
      type: 'delete',
      itemType: 'logiciel',
      itemName: logicielData.nom
    }),
  
  // ========== INCIDENTS ==========
  createIncident: (incidentData, username) => 
    logAction('AJOUT', 'Incidents', `Création incident: ${incidentData.titre || 'Nouvel incident'}`, username, {
      data: incidentData,
      type: 'create',
      itemType: 'incident',
      itemName: incidentData.titre
    }),
  
  updateIncident: (id, oldData, newData, username) => 
    logAction('MODIFICATION', 'Incidents', `Modification incident: ${oldData.titre || id}`, username, {
      incidentId: id,
      oldData: oldData,
      newData: newData,
      changes: getChanges(oldData, newData),
      type: 'update',
      itemType: 'incident',
      itemName: newData.titre || oldData.titre
    }),
  
  resolveIncident: (id, incidentData, username) => 
    logAction('RÉSOLUTION', 'Incidents', `Résolution incident: ${incidentData.titre || id}`, username, {
      incidentId: id,
      data: incidentData,
      type: 'resolve',
      itemType: 'incident',
      itemName: incidentData.titre
    }),
  
  deleteIncident: (id, incidentData, username) => 
    logAction('SUPPRESSION', 'Incidents', `Suppression incident: ${incidentData.titre || id}`, username, {
      incidentId: id,
      data: incidentData,
      type: 'delete',
      itemType: 'incident',
      itemName: incidentData.titre
    }),
  
  // ========== RÉPARATIONS ==========
  createReparation: (reparationData, username) => 
    logAction('AJOUT', 'Réparations', `Création réparation pour: ${reparationData.materiel_id || 'Matériel'}`, username, {
      data: reparationData,
      type: 'create',
      itemType: 'reparation'
    }),
  
  updateReparation: (id, oldData, newData, username) => 
    logAction('MODIFICATION', 'Réparations', `Modification réparation #${id}`, username, {
      reparationId: id,
      oldData: oldData,
      newData: newData,
      changes: getChanges(oldData, newData),
      type: 'update',
      itemType: 'reparation'
    }),
  
  completeReparation: (id, reparationData, username) => 
    logAction('MODIFICATION', 'Réparations', `Réparation terminée #${id}`, username, {
      reparationId: id,
      data: reparationData,
      type: 'complete',
      itemType: 'reparation'
    }),
  
  // ========== ALERTES ==========
  createAlerte: (alerteData, username) => 
    logAction('AJOUT', 'Alertes', `Création alerte: ${alerteData.titre || 'Nouvelle alerte'}`, username, {
      data: alerteData,
      type: 'create',
      itemType: 'alerte',
      itemName: alerteData.titre
    }),
  
  updateAlerte: (id, oldData, newData, username) => 
    logAction('MODIFICATION', 'Alertes', `Modification alerte: ${oldData.titre || id}`, username, {
      alerteId: id,
      oldData: oldData,
      newData: newData,
      changes: getChanges(oldData, newData),
      type: 'update',
      itemType: 'alerte',
      itemName: newData.titre || oldData.titre
    }),
  
  // ========== FOURNISSEURS ==========
  createFournisseur: (fournisseurData, username) => 
    logAction('AJOUT', 'Fournisseurs', `Ajout fournisseur: ${fournisseurData.nom || 'Nouveau fournisseur'}`, username, {
      data: fournisseurData,
      type: 'create',
      itemType: 'fournisseur',
      itemName: fournisseurData.nom
    }),
  
  updateFournisseur: (id, oldData, newData, username) => 
    logAction('MODIFICATION', 'Fournisseurs', `Modification fournisseur: ${oldData.nom || id}`, username, {
      fournisseurId: id,
      oldData: oldData,
      newData: newData,
      changes: getChanges(oldData, newData),
      type: 'update',
      itemType: 'fournisseur',
      itemName: newData.nom || oldData.nom
    }),
  
  deleteFournisseur: (id, fournisseurData, username) => 
    logAction('SUPPRESSION', 'Fournisseurs', `Suppression fournisseur: ${fournisseurData.nom || id}`, username, {
      fournisseurId: id,
      data: fournisseurData,
      type: 'delete',
      itemType: 'fournisseur',
      itemName: fournisseurData.nom
    }),
  
  // ========== UTILISATEURS ==========
  createUser: (userData, createdBy) => 
    logAction('AJOUT', 'Utilisateurs', `Création utilisateur: ${userData.username || 'Nouvel utilisateur'}`, createdBy, {
      data: userData,
      type: 'create',
      itemType: 'user',
      itemName: userData.username
    }),
  
  updateUser: (id, oldData, newData, updatedBy) => 
    logAction('MODIFICATION', 'Utilisateurs', `Modification utilisateur: ${oldData.username || id}`, updatedBy, {
      userId: id,
      oldData: oldData,
      newData: newData,
      changes: getChanges(oldData, newData),
      type: 'update',
      itemType: 'user',
      itemName: newData.username || oldData.username
    }),
  
  deleteUser: (id, userData, deletedBy) => 
    logAction('SUPPRESSION', 'Utilisateurs', `Suppression utilisateur: ${userData.username || id}`, deletedBy, {
      userId: id,
      data: userData,
      type: 'delete',
      itemType: 'user',
      itemName: userData.username
    }),
  
  // ========== RAPPORTS & EXPORTATIONS ==========
  generateReport: (type, format, filters, username) => 
    logAction('EXPORTATION', 'Rapports', `Export rapport ${type} en ${format}`, username, {
      reportType: type,
      format: format,
      filters: filters || {},
      type: 'export',
      timestamp: new Date().toISOString()
    }),
  
  exportData: (module, format, dataCount, username) => 
    logAction('EXPORTATION', 'Rapports', `Export ${module} (${dataCount} éléments) en ${format}`, username, {
      module: module,
      format: format,
      count: dataCount,
      type: 'export',
      timestamp: new Date().toISOString()
    }),
  
  printReport: (type, username) => 
    logAction('GENERATION', 'Rapports', `Impression rapport ${type}`, username, {
      reportType: type,
      format: 'PDF',
      type: 'print',
      timestamp: new Date().toISOString()
    }),
  
  // ========== CONSULTATIONS ==========
  viewDetails: (module, itemId, itemName, username) => 
    logAction('CONSULTATION', module, `Consultation ${module}: ${itemName || itemId}`, username, {
      module: module,
      itemId: itemId,
      itemName: itemName,
      type: 'view',
      timestamp: new Date().toISOString()
    }),
  
  searchData: (module, searchTerm, resultsCount, username) => 
    logAction('CONSULTATION', module, `Recherche dans ${module}: "${searchTerm}" (${resultsCount} résultats)`, username, {
      module: module,
      searchTerm: searchTerm,
      resultsCount: resultsCount,
      type: 'search',
      timestamp: new Date().toISOString()
    }),
  
  // ========== INSTALLATIONS LOGICIELS ==========
  installLogiciel: (logicielName, materielId, username) => 
    logAction('AJOUT', 'Installations', `Installation logiciel: ${logicielName} sur ${materielId}`, username, {
      logicielName: logicielName,
      materielId: materielId,
      type: 'install',
      timestamp: new Date().toISOString()
    }),
  
  uninstallLogiciel: (logicielName, materielId, username) => 
    logAction('SUPPRESSION', 'Installations', `Désinstallation logiciel: ${logicielName} de ${materielId}`, username, {
      logicielName: logicielName,
      materielId: materielId,
      type: 'uninstall',
      timestamp: new Date().toISOString()
    }),
  
  // ========== NAVIGATION (seulement pour les changements de page) ==========
  viewPage: (page, username) => 
    logAction('NAVIGATION', 'Système', `Navigation vers ${page}`, username, {
      page: page,
      type: 'navigation',
      timestamp: new Date().toISOString()
    }),
  
  // ========== GÉNÉRIQUE ==========
  custom: (action, module, details, username, extraData = {}) => 
    logAction(action, module, details, username, extraData)
};

// ==================== FONCTIONS DE TEST ====================

// Fonction pour tester toutes les actions CRUD
const testAllCRUDActions = () => {
  const testUser = 'odonardo';
  
  console.log('🧪 Test des actions CRUD...');
  
  // 1. AJOUT Matériel
  setTimeout(() => {
    ActionLogger.createMateriel({
      id: 'MAT-' + Date.now(),
      nom: 'PC Portable Dell XPS 15',
      type: 'Ordinateur portable',
      marque: 'Dell',
      reference: 'XPS-15-9520',
      etat: 'fonctionnel',
      service_attribue: 'Direction',
      date_achat: '2024-01-15',
      cout: 1899.99
    }, testUser);
  }, 100);
  
  // 2. MODIFICATION Matériel
  setTimeout(() => {
    ActionLogger.updateMateriel(
      'MAT-001',
      { nom: 'PC Portable Dell', etat: 'fonctionnel', service_attribue: 'Informatique' },
      { nom: 'PC Portable Dell XPS', etat: 'maintenance', service_attribue: 'Direction' },
      testUser
    );
  }, 500);
  
  // 3. SUPPRESSION Matériel
  setTimeout(() => {
    ActionLogger.deleteMateriel(
      'MAT-005',
      { nom: 'Imprimante HP LaserJet', type: 'Imprimante', marque: 'HP' },
      testUser
    );
  }, 1000);
  
  // 4. AJOUT Logiciel
  setTimeout(() => {
    ActionLogger.createLogiciel({
      id: 'LOG-' + Date.now(),
      nom: 'Microsoft Office 365',
      version: '2024',
      type: 'Suite bureautique',
      licence: 'Commerciale',
      date_expiration: '2025-12-31'
    }, testUser);
  }, 1500);
  
  // 5. AJOUT Incident
  setTimeout(() => {
    ActionLogger.createIncident({
      id: 'INC-' + Date.now(),
      titre: 'Écran cassé sur PC-12',
      description: 'Écran LCD fissuré après chute',
      priorite: 'Haute',
      statut: 'En cours',
      materiel_id: 'MAT-001'
    }, testUser);
  }, 2000);
  
  // 6. RÉSOLUTION Incident
  setTimeout(() => {
    ActionLogger.resolveIncident(
      'INC-001',
      { titre: 'Écran cassé sur PC-12', statut: 'En cours' },
      testUser
    );
  }, 2500);
  
  // 7. AJOUT Réparation
  setTimeout(() => {
    ActionLogger.createReparation({
      id: 'REP-' + Date.now(),
      materiel_id: 'MAT-001',
      description: 'Remplacement écran LCD',
      cout: 350.00,
      date_debut: '2024-01-20',
      date_fin: '2024-01-21',
      technicien: 'Jean Tech'
    }, testUser);
  }, 3000);
  
  // 8. EXPORTATION Rapport PDF
  setTimeout(() => {
    ActionLogger.generateReport('Matériels', 'PDF', { 
      service: 'Direction',
      etat: 'fonctionnel',
      date_debut: '2024-01-01',
      date_fin: '2024-12-31'
    }, testUser);
  }, 3500);
  
  // 9. EXPORTATION Excel
  setTimeout(() => {
    ActionLogger.exportData('Incidents', 'Excel', 24, testUser);
  }, 4000);
  
  // 10. CONSULTATION
  setTimeout(() => {
    ActionLogger.viewDetails('Matériels', 'MAT-001', 'PC Portable Dell XPS', testUser);
  }, 4500);
  
  // 11. RECHERCHE
  setTimeout(() => {
    ActionLogger.searchData('Matériels', 'Dell', 8, testUser);
  }, 5000);
  
  // 12. INSTALLATION Logiciel
  setTimeout(() => {
    ActionLogger.installLogiciel('Microsoft Office 365', 'MAT-001', testUser);
  }, 5500);
  
  // 13. CONNEXION
  setTimeout(() => {
    ActionLogger.login(testUser, { role: 'admin', email: 'odonardo@dren-aa.com' });
  }, 6000);
  
  // 14. NAVIGATION (seulement une)
  setTimeout(() => {
    ActionLogger.viewPage('/historique', testUser);
  }, 6500);
  
  console.log('✅ 14 actions CRUD de test programmées');
  
  return 'Test CRUD démarré. Vérifiez la page Historique dans quelques secondes.';
};

// Initialiser les écouteurs d'actions
const initActionLogger = () => {
  console.log('🎯 Configuration des écouteurs d\'actions CRUD...');
  
  // Exposer globalement
  window.ActionLogger = ActionLogger;
  
  // Écouter les événements de connexion
  window.addEventListener('user-login', (event) => {
    const { username, userData } = event.detail || {};
    if (username) {
      ActionLogger.login(username, userData);
    }
  });
  
  // Écouter les événements de déconnexion
  window.addEventListener('user-logout', (event) => {
    const { username } = event.detail || {};
    if (username) {
      ActionLogger.logout(username);
    }
  });
  
  // Écouter les événements génériques d'actions
  window.addEventListener('log-crud-action', (event) => {
    const { action, module, details, username, extraData } = event.detail || {};
    if (action && module && details) {
      ActionLogger.custom(action, module, details, username, extraData);
    }
  });
  
  console.log('✅ ActionLogger CRUD initialisé');
};

// ==================== COMPOSANT POUR LOGGER LA NAVIGATION ====================

const NavigationLogger = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && window.ActionLogger) {
      // Logger la navigation après un court délai
      setTimeout(() => {
        // Seulement logger les vraies navigations, pas toutes les actions
        if (location.pathname !== window.lastLoggedPath) {
          window.ActionLogger.viewPage(location.pathname, user.username);
          window.lastLoggedPath = location.pathname;
        }
      }, 500);
    }
  }, [location.pathname, user]);
  
  return null;
};

// ==================== COMPOSANTS DE ROUTE ====================

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const { hasAccess } = usePermissions();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-white mb-4"></div>
          <p className="text-white">Chargement du système...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !hasAccess(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-white mb-4"></div>
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }
  
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// ==================== COMPOSANT APP ROUTES ====================

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Route pour unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Routes protégées avec Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={
          <ProtectedRoute requiredRole="user">
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="materiels" element={
          <ProtectedRoute requiredRole="user">
            <Materiels />
          </ProtectedRoute>
        } />
        
        {/* <Route path="logiciels" element={
          <ProtectedRoute requiredRole="user">
            <Logiciels />
          </ProtectedRoute>
        } /> */}
        
        <Route path="incidents" element={
          <ProtectedRoute requiredRole="user">
            <Incidents />
          </ProtectedRoute>
        } />
        
        <Route path="reparations" element={
          <ProtectedRoute requiredRole="technician">
            <Reparations />
          </ProtectedRoute>
        } />
        
        <Route path="rapports" element={
          <ProtectedRoute requiredRole="secretary">
            <Rapports />
          </ProtectedRoute>
        } />
        
        <Route path="users" element={
          <ProtectedRoute requiredRole="director">
            <Users />
          </ProtectedRoute>
        } />
        
        <Route path="alertes" element={
          <ProtectedRoute requiredRole="technician">
            <Alertes />
          </ProtectedRoute>
        } />
        
        <Route path="fournisseurs" element={
          <ProtectedRoute requiredRole="secretary">
            <Fournisseurs />
          </ProtectedRoute>
        } />
        
        {/* <Route path="installations-logiciels" element={
          <ProtectedRoute requiredRole="technician">
            <InstallationsLogiciels />
          </ProtectedRoute>
        } /> */}
        
        <Route path="profils-utilisateurs" element={
          <ProtectedRoute requiredRole="user">
            <ProfilsUtilisateurs />
          </ProtectedRoute>
        } />
        
        {/* <Route path="configuration-reseau" element={
          <ProtectedRoute requiredRole="technician">
            <ConfigurationReseau />
          </ProtectedRoute>
        } /> */}
        
        <Route path="historique" element={
          <ProtectedRoute requiredRole="director">
            <Historique />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// ==================== COMPOSANT APP PRINCIPAL ====================

function App() {
  useEffect(() => {
    console.log('🚀 Démarrage application DREN AA...');
    
    // Initialiser l'historique avec des données CRUD
    initHistoriqueLocal();
    
    // Initialiser le logger d'actions CRUD
    initActionLogger();
    
    // Enregistrer le démarrage de l'application
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log(`✅ Application démarrée pour: ${user.username}`);
        
        // Enregistrer l'action de démarrage
        setTimeout(() => {
          ActionLogger.custom('DEMARRAGE', 'Système', 'Application DREN AA démarrée', user.username, {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            environment: 'production'
          });
        }, 1000);
      } catch (error) {
        console.error('❌ Erreur parsing user:', error);
      }
    }
    
    // Ajouter des fonctions de test dans la console
    if (typeof window !== 'undefined') {
      // Exposer les fonctions de test CRUD
      window.testAllCRUDActions = testAllCRUDActions;
      
      // Fonction pour ajouter une action CRUD manuelle
      window.addCRUDAction = () => {
        const action = prompt("Type d'action (AJOUT/MODIFICATION/SUPPRESSION/EXPORTATION/CONSULTATION/NAVIGATION):", "AJOUT");
        const module = prompt("Module:", "Matériels");
        const details = prompt("Détails:", "Ajout d'un nouveau matériel");
        const username = prompt("Utilisateur:", "odonardo");
        
        if (action && module && details && username) {
          const extraData = {
            itemName: details.split(':')[1]?.trim() || 'Élément',
            timestamp: new Date().toISOString(),
            type: action.toLowerCase()
          };
          
          ActionLogger.custom(action, module, details, username, extraData);
          alert(`✅ Action "${action}" ajoutée pour ${module}!`);
          
          // Recharger l'historique si ouvert
          if (window.location.pathname === '/historique') {
            setTimeout(() => window.dispatchEvent(new CustomEvent('action-logged')), 1000);
          }
        }
      };
      
      // Fonction pour effacer l'historique
      window.clearHistorique = () => {
        if (confirm('Voulez-vous vraiment effacer tout l\'historique?')) {
          localStorage.removeItem('gestion_parc_historique');
          alert('✅ Historique effacé!');
          initHistoriqueLocal();
          alert('✅ Données de test réinitialisées!');
        }
      };
      
      // Fonction pour voir le contenu de l'historique
      window.showHistorique = () => {
        const STORAGE_KEY = 'gestion_parc_historique';
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        console.log('📊 Contenu historique:', data);
        console.log(`Total: ${data.length} actions`);
        
        // Afficher les statistiques par type d'action
        const stats = {};
        data.forEach(item => {
          stats[item.action] = (stats[item.action] || 0) + 1;
        });
        console.log('📈 Statistiques par action:', stats);
        
        alert(`Historique: ${data.length} actions\n` + 
              Object.entries(stats).map(([action, count]) => `${action}: ${count}`).join('\n'));
      };
      
      console.log('🔧 Fonctions CRUD disponibles dans la console:');
      console.log('- testAllCRUDActions(): Tester toutes les actions CRUD');
      console.log('- addCRUDAction(): Ajouter une action CRUD manuelle');
      console.log('- clearHistorique(): Effacer l\'historique');
      console.log('- showHistorique(): Voir le contenu');
      console.log('- ActionLogger: Objet complet pour logger les actions');
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-base-100">
              <AutoLoggerProvider>
                <NavigationLogger />
                <AppRoutes />
                <QuickActionLogger />
                <ToastContainer 
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </AutoLoggerProvider>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Exportez les fonctions pour les utiliser ailleurs
export { 
  initHistoriqueLocal, 
  ActionLogger,
  initActionLogger,
  testAllCRUDActions,
  logAction 
};

export default App;