
// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Layout Components
// import Layout from './components/Layout';

// // Pages
// import Login from './components/Login';
// // import Login from './Pages/Register.jsx';
// import Login from './components/Register.jsx';
// import Dashboard from './pages/Dashboard';
// import Materiels from './pages/Materiels';
// import Logiciels from './pages/Logiciels';
// import Incidents from './pages/Incidents';
// import Reparations from './pages/Reparations';
// import Rapports from './pages/Rapports';
// import Users from './pages/Users';
// import Alertes from './pages/Alertes';
// import Fournisseurs from './pages/Fournisseurs';
// import InstallationsLogiciels from './pages/InstallationsLogiciels.tsx';
// import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs.tsx';
// import ConfigurationReseau from './pages/ConfigurationReseau.tsx';

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
//           <p className="text-white">Chargement du système DREN AA...</p>
//         </div>
//       </div>
//     );
//   }
  
//   return user ? children : <Navigate to="/login" replace />;
// };

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
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//         <ToastContainer position="top-right" />
//       </>
//     );
//   }

//   return (
//     <>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/materiels" element={<Materiels />} />
//           <Route path="/logiciels" element={<Logiciels />} />
//           <Route path="/incidents" element={<Incidents />} />
//           <Route path="/reparations" element={<Reparations />} />
//           <Route path="/rapports" element={<Rapports />} />
//           <Route path="/users" element={<Users />} />
//           <Route path="/alertes" element={<Alertes />} />
//           <Route path="/fournisseurs" element={<Fournisseurs />} />
//           <Route path="/installations-logiciels" element={<InstallationsLogiciels />} />
//           <Route path="/profils-utilisateurs" element={<ProfilsUtilisateurs />} />
//           <Route path="/configuration-reseau" element={<ConfigurationReseau />} />
          
//           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </Layout>
//       <ToastContainer position="top-right" />
//     </>
//   );
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-base-100">
//           <AppRoutes />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;





// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
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
// import InstallationsLogiciels from './pages/InstallationsLogiciels.tsx';
// import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
// import ConfigurationReseau from './pages/ConfigurationReseau';

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-white mb-4"></div>
//           <p className="text-white">Chargement du système DREN AA...</p>
//         </div>
//       </div>
//     );
//   }
  
//   return user ? children : <Navigate to="/login" replace />;
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
//         <ToastContainer position="top-right" />
//       </>
//     );
//   }

//   return (
//     <>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/dashboard" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/materiels" element={
//             <ProtectedRoute>
//               <Materiels />
//             </ProtectedRoute>
//           } />
//           <Route path="/logiciels" element={
//             <ProtectedRoute>
//               <Logiciels />
//             </ProtectedRoute>
//           } />
//           <Route path="/incidents" element={
//             <ProtectedRoute>
//               <Incidents />
//             </ProtectedRoute>
//           } />
//           <Route path="/reparations" element={
//             <ProtectedRoute>
//               <Reparations />
//             </ProtectedRoute>
//           } />
//           <Route path="/rapports" element={
//             <ProtectedRoute>
//               <Rapports />
//             </ProtectedRoute>
//           } />
//           <Route path="/users" element={
//             <ProtectedRoute>
//               <Users />
//             </ProtectedRoute>
//           } />
//           <Route path="/alertes" element={
//             <ProtectedRoute>
//               <Alertes />
//             </ProtectedRoute>
//           } />
//           <Route path="/fournisseurs" element={
//             <ProtectedRoute>
//               <Fournisseurs />
//             </ProtectedRoute>
//           } />
//           <Route path="/installations-logiciels" element={
//             <ProtectedRoute>
//               <InstallationsLogiciels />
//             </ProtectedRoute>
//           } />
//           <Route path="/profils-utilisateurs" element={
//             <ProtectedRoute>
//               <ProfilsUtilisateurs />
//             </ProtectedRoute>
//           } />
//           <Route path="/configuration-reseau" element={
//             <ProtectedRoute>
//               <ConfigurationReseau />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/login" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/register" element={<Navigate to="/dashboard" replace />} />
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </Layout>
//       <ToastContainer position="top-right" />
//     </>
//   );
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-base-100">
//           <AppRoutes />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;





// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { usePermissions } from './hooks/usePermissions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Layout from './components/Layout';

// Pages
import Login from './components/Login';
// import Login from './pages/Login';
// import ProtectedRoute from './components/ProtectedRoute';

import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import Materiels from './pages/Materiels';
import Logiciels from './pages/Logiciels';
import Incidents from './pages/Incidents';
import Reparations from './pages/Reparations';
import Rapports from './pages/Rapports';
import Users from './pages/Users';
import Alertes from './pages/Alertes';
import Fournisseurs from './pages/Fournisseurs';
import InstallationsLogiciels from './pages/InstallationsLogiciels.tsx';
import ProfilsUtilisateurs from './pages/ProfilsUtilisateurs';
import ConfigurationReseau from './pages/ConfigurationReseau';
import Unauthorized from './pages/Unauthorized'; // Créez cette page

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const { hasAccess } = usePermissions();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-white mb-4"></div>
          <p className="text-white">Chargement du système DREN AA...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Vérifier les permissions si un rôle est requis
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

// Définir les permissions pour chaque route
const routePermissions = {
  '/dashboard': 'user', // Tous les utilisateurs connectés
  '/materiels': 'user',
  '/logiciels': 'user',
  '/incidents': 'user',
  '/reparations': 'technician', // Seulement techniciens et +
  '/rapports': 'secretary', // Seulement secrétaires et +
  '/users': 'director', // Seulement directeurs et admin
  '/alertes': 'technician',
  '/fournisseurs': 'secretary',
  '/installations-logiciels': 'user',
  '/profils-utilisateurs': 'user',
  '/configuration-reseau': 'user'
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const { hasAccess } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-white mb-4"></div>
          <p className="text-white">Initialisation du système...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Routes>
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
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer position="top-right" />
      </>
      

    );
  }

  return (
    <>
      <Layout>
        <Routes>
          {/* Route publique pour les non-autorisés */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Routes protégées avec permissions */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="user">
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/materiels" element={
            <ProtectedRoute requiredRole="user">
              <Materiels />
            </ProtectedRoute>
          } />
          
          <Route path="/logiciels" element={
            <ProtectedRoute requiredRole="user">
              <Logiciels />
            </ProtectedRoute>
          } />
          
          <Route path="/incidents" element={
            <ProtectedRoute requiredRole="user">
              <Incidents />
            </ProtectedRoute>
          } />
          
          <Route path="/reparations" element={
            <ProtectedRoute requiredRole="technician">
              <Reparations />
            </ProtectedRoute>
          } />
          
          <Route path="/rapports" element={
            <ProtectedRoute requiredRole="secretary">
              <Rapports />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute requiredRole="director">
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="/alertes" element={
            <ProtectedRoute requiredRole="technician">
              <Alertes />
            </ProtectedRoute>
          } />
          
          <Route path="/fournisseurs" element={
            <ProtectedRoute requiredRole="secretary">
              <Fournisseurs />
            </ProtectedRoute>
          } />
          
          <Route path="/installations-logiciels" element={
            <ProtectedRoute requiredRole="technician">
              <InstallationsLogiciels />
            </ProtectedRoute>
          } />
          
          <Route path="/profils-utilisateurs" element={
            <ProtectedRoute requiredRole="user">
              <ProfilsUtilisateurs />
            </ProtectedRoute>
          } />
          
          <Route path="/configuration-reseau" element={
            <ProtectedRoute requiredRole="technician">
              <ConfigurationReseau />
            </ProtectedRoute>
          } />
          
          {/* Redirections */}
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
      <ToastContainer position="top-right" />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-base-100">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;