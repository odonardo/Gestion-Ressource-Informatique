// import React, { useState, useMemo } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   Monitor, 
//   AlertTriangle, 
//   Wrench, 
//   BarChart3, 
//   LogOut, 
//   User,
//   Menu,
//   X,
//   Users,
//   Network,
//   Bell,
//   Package,
//   Cpu,
//   MapPin,
//   Phone,
//   Mail,
//   Shield,
//   Settings,
//   Briefcase,
//   FileText,
//   Home
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Import de l'image JPEG depuis le dossier src
// import logoDren from '../assets/images/logo-dren.jpeg';

// const Layout = ({ children }) => {
//   const { user, logout, isLoading } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [logoError, setLogoError] = useState(false);

//   // Configuration des tailles d'image
//   const logoConfig = {
//     header: {
//       container: 'h-[65px] w-[85px]',
//       image: 'h-[115px] w-[115px]',
//     },
//     footer: {
//       container: 'h-[120px] w-[160px]',
//       image: 'w-full h-full',
//     }
//   };

//   // Configuration des permissions par rôle
//   const getNavigationForRole = (role) => {
//     const baseNavigation = [
//       { 
//         name: 'Tableau de bord', 
//         href: '/dashboard', 
//         icon: BarChart3, 
//         roles: ['user', 'technician', 'secretary', 'director', 'admin'],
//         description: 'Vue générale du système'
//       },
//     ];

//     const allRoutes = [
//       { 
//         name: 'Accueil', 
//         href: '/', 
//         icon: Home, 
//         roles: ['user', 'technician', 'secretary', 'director', 'admin'],
//         description: 'Page d\'accueil'
//       },
//       { 
//         name: 'Fournisseurs', 
//         href: '/fournisseurs', 
//         icon: Users, 
//         roles: ['secretary', 'admin'],
//         description: 'Gestion des fournisseurs'
//       },
//       { 
//         name: 'Matériels', 
//         href: '/materiels', 
//         icon: Monitor, 
//         roles: ['user', 'technician', 'secretary', 'director', 'admin'],
//         description: 'Gestion du parc matériel'
//       },
//       { 
//         name: 'Logiciels', 
//         href: '/logiciels', 
//         icon: Package, 
//         roles: ['technician', 'admin'],
//         description: 'Gestion des licences logiciels'
//       },
//       { 
//         name: 'Installations', 
//         href: '/installations-logiciels', 
//         icon: Cpu, 
//         roles: ['technician', 'admin'],
//         description: 'Installations logiciels sur matériels'
//       },
//       { 
//         name: 'Réseau', 
//         href: '/configuration-reseau', 
//         icon: Network, 
//         roles: ['technician', 'admin'],
//         description: 'Configuration réseau'
//       },
//       { 
//         name: 'Incidents', 
//         href: '/incidents', 
//         icon: AlertTriangle, 
//         roles: ['user', 'technician', 'director', 'admin'],
//         description: 'Gestion des incidents'
//       },
//       { 
//         name: 'Alertes', 
//         href: '/alertes', 
//         icon: Bell, 
//         roles: ['technician', 'director', 'admin'],
//         description: 'Alertes système'
//       },
//       { 
//         name: 'Réparations', 
//         href: '/reparations', 
//         icon: Wrench, 
//         roles: ['technician', 'admin'],
//         description: 'Suivi des réparations'
//       },
//       { 
//         name: 'Profils', 
//         href: '/profils-utilisateurs', 
//         icon: User, 
//         roles: ['admin'],
//         description: 'Gestion des profils utilisateurs'
//       },
//       { 
//         name: 'Utilisateurs', 
//         href: '/users', 
//         icon: Users, 
//         roles: ['admin'],
//         description: 'Gestion des comptes utilisateurs'
//       },
//       { 
//         name: 'Rapports', 
//         href: '/rapports', 
//         icon: FileText, 
//         roles: ['director', 'admin'],
//         description: 'Rapports et statistiques'
//       },
//     ];

//     // Filtrer les routes selon le rôle
//     const filteredRoutes = allRoutes.filter(route => 
//       route.roles.includes(role)
//     );

//     return [...baseNavigation, ...filteredRoutes];
//   };

//   // Mémoized navigation basée sur le rôle
//   const navigation = useMemo(() => {
//     return getNavigationForRole(user?.role || 'user');
//   }, [user?.role]);

//   const isActive = (path) => location.pathname === path;

//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case 'admin': return 'badge-error bg-red-500 text-white';
//       case 'technician': return 'badge-warning bg-orange-500 text-white';
//       case 'secretary': return 'badge-info bg-blue-500 text-white';
//       case 'director': return 'badge-success bg-purple-500 text-white';
//       case 'user': return 'badge-neutral bg-gray-500 text-white';
//       default: return 'badge-neutral bg-gray-500 text-white';
//     }
//   };

//   const getRoleText = (role) => {
//     switch (role) {
//       case 'admin': return 'Administrateur';
//       case 'technician': return 'Technicien IT';
//       case 'secretary': return 'Secrétaire';
//       case 'director': return 'Directeur';
//       case 'user': return 'Utilisateur';
//       default: return role;
//     }
//   };

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case 'admin': return <Shield className="w-4 h-4" />;
//       case 'technician': return <Settings className="w-4 h-4" />;
//       case 'secretary': return <User className="w-4 h-4" />;
//       case 'director': return <Briefcase className="w-4 h-4" />;
//       case 'user': return <User className="w-4 h-4" />;
//       default: return <User className="w-4 h-4" />;
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const getRoleDescription = (role) => {
//     switch (role) {
//       case 'user': 
//         return 'Accès limité à vos matériels et incidents';
//       case 'technician': 
//         return 'Accès aux fonctionnalités techniques et gestion';
//       case 'secretary': 
//         return 'Gestion administrative et fournisseurs';
//       case 'director': 
//         return 'Vue globale avec rapports et statistiques';
//       case 'admin': 
//         return 'Accès complet à toutes les fonctionnalités';
//       default: 
//         return 'Utilisateur du système';
//     }
//   };

//   // Si en cours de chargement
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-base-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-green-600 mb-4"></div>
//           <p className="text-gray-600">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   // Si pas d'utilisateur connecté (ne devrait pas arriver avec Layout protégé)
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-base-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="alert alert-warning max-w-md">
//             <span>Session expirée. Veuillez vous reconnecter.</span>
//             <button 
//               onClick={() => navigate('/login')}
//               className="btn btn-sm btn-primary mt-2"
//             >
//               Se connecter
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg border-b border-green-700 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               {/* Logo DREN avec fallback */}
//               <div className={`bg-white p-1 rounded-lg mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
//                 {!logoError ? (
//                   <img 
//                     src={logoDren}
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className={`object-contain ${logoConfig.header.image}`}
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <Monitor className="h-6 w-6 text-green-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white">
//                   DREN Antsimo A
//                 </h1>
//                 <p className="text-xs text-green-200">Gestion des Ressources IT</p>
//               </div>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex space-x-1">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors group relative ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white shadow-sm'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                     title={item.description}
//                   >
//                     <Icon className="w-4 h-4 mr-2" />
//                     {item.name}
                    
//                     {/* Tooltip pour description */}
//                     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
//                       {item.description}
//                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </nav>

//             {/* User Menu */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:flex items-center text-sm text-white">
//                 <div className="flex flex-col items-end mr-3">
//                   <span className="font-medium">{user?.name || user?.username || 'Utilisateur'}</span>
//                   <span className="text-xs text-green-200">{user?.departement || 'Département'}</span>
//                 </div>
//                 <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
//                   {getRoleIcon(user?.role)}
//                   <span>{getRoleText(user?.role)}</span>
//                 </div>
//               </div>
              
//               <div className="dropdown dropdown-end">
//                 <button 
//                   tabIndex={0}
//                   className="flex items-center text-green-100 hover:text-white transition-colors p-2 rounded-md hover:bg-green-700"
//                   title="Menu utilisateur"
//                 >
//                   <User className="w-4 h-4" />
//                 </button>
//                 <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
//                   <li className="menu-title">
//                     <span>{user?.name || user?.username}</span>
//                     <span className="text-xs text-gray-500">{getRoleText(user?.role)}</span>
//                   </li>
//                   <li>
//                     <Link to="/mon-profil" onClick={() => setIsMobileMenuOpen(false)}>
//                       <User className="w-4 h-4" />
//                       Mon profil
//                     </Link>
//                   </li>
//                   <li>
//                     <button onClick={handleLogout}>
//                       <LogOut className="w-4 h-4" />
//                       Se déconnecter
//                     </button>
//                   </li>
//                 </ul>
//               </div>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 rounded-md text-green-100 hover:bg-green-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-green-700 bg-green-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-5 h-5 mr-3" />
//                     <div>
//                       <div>{item.name}</div>
//                       <div className="text-xs text-green-300 opacity-75">{item.description}</div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Bannière d'information du rôle */}
//         {user?.role && (
//           <div className={`mb-6 p-4 border rounded-lg ${
//             user.role === 'admin' ? 'bg-red-50 border-red-200' :
//             user.role === 'technician' ? 'bg-orange-50 border-orange-200' :
//             user.role === 'secretary' ? 'bg-blue-50 border-blue-200' :
//             user.role === 'director' ? 'bg-purple-50 border-purple-200' :
//             'bg-gray-50 border-gray-200'
//           }`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
//                   {getRoleIcon(user.role)}
//                   <span>{getRoleText(user.role)}</span>
//                 </div>
//                 <div className="ml-4 text-sm">
//                   <span className={
//                     user.role === 'admin' ? 'text-red-700' :
//                     user.role === 'technician' ? 'text-orange-700' :
//                     user.role === 'secretary' ? 'text-blue-700' :
//                     user.role === 'director' ? 'text-purple-700' :
//                     'text-gray-700'
//                   }>
//                     {getRoleDescription(user.role)}
//                   </span>
//                 </div>
//               </div>
//               {user.role === 'user' && (
//                 <button 
//                   onClick={() => navigate('/demande-acces')}
//                   className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors"
//                 >
//                   Demander plus d'accès
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {children}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-start">
//               {/* Logo DREN - TAILLE FOOTER */}
//               <div className={`bg-white rounded p-1 mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
//                 <img 
//                   src={logoDren}
//                   alt="Logo DREN" 
//                   className={`object-contain ${logoConfig.footer.image}`}
//                 />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
//                 <p className="text-green-200 text-sm">
//                   Direction Régionale de l'Éducation Nationale
//                 </p>
//                 <p className="text-green-200 text-sm">
//                   Région Atsimo Andrefana, Madagascar
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <div className="space-y-2 text-sm text-green-200">
//                 <div className="flex items-center">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span>Toliara, Madagascar</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>+261 94 xxx xx xx</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span>contact@dren-antsimo-andrefana.mg</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Système</h3>
//               <p className="text-green-200 text-sm">
//                 Système de Gestion des Ressources Informatiques
//               </p>
//               <p className="text-green-200 text-sm">
//                 Connecté en tant que: <span className="font-medium">{getRoleText(user?.role)}</span>
//               </p>
//               <p className="text-green-200 text-sm">
//                 Version 1.0 - {new Date().getFullYear()}
//               </p>
//             </div>
//           </div>
//           <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm text-green-300">
//             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Layout;






// import React, { useState, useMemo } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   Monitor, 
//   AlertTriangle, 
//   Wrench, 
//   BarChart3, 
//   LogOut, 
//   User,
//   Menu,
//   X,
//   Users,
//   Network,
//   Bell,
//   Package,
//   Cpu,
//   MapPin,
//   Phone,
//   Mail,
//   Shield,
//   Settings,
//   Briefcase,
//   FileText,
//   Home
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Import de l'image JPEG depuis le dossier src
// import logoDren from '../assets/images/logo-dren.jpeg';

// const Layout = ({ children }) => {
//   const { user, logout, isLoading } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [logoError, setLogoError] = useState(false);

//   // Configuration des tailles d'image
//   const logoConfig = {
//     header: {
//       container: 'h-[65px] w-[85px]',
//       image: 'h-[115px] w-[115px]',
//     },
//     footer: {
//       container: 'h-[120px] w-[160px]',
//       image: 'w-full h-full',
//     }
//   };

//   // Configuration des permissions par rôle
//   const getNavigationForRole = (role) => {
//     const baseNavigation = [
//       { 
//         name: 'Tableau de bord', 
//         href: '/dashboard', 
//         icon: BarChart3, 
//         roles: ['user', 'technician', 'secretary', 'director', 'admin'],
//         description: 'Vue générale du système'
//       },
//     ];

//     const allRoutes = [
//       { 
//         name: 'Accueil', 
//         href: '/', 
//         icon: Home, 
//         roles: ['user', 'technician', 'secretary', 'director', 'admin'],
//         description: 'Page d\'accueil'
//       },
//       { 
//         name: 'Fournisseurs', 
//         href: '/fournisseurs', 
//         icon: Users, 
//         roles: ['secretary', 'admin'],
//         description: 'Gestion des fournisseurs'
//       },
//       { 
//         name: 'Matériels', 
//         href: '/materiels', 
//         icon: Monitor, 
//         roles: ['user', 'technician', 'secretary', 'director', 'admin'],
//         description: 'Gestion du parc matériel'
//       },
//       { 
//         name: 'Logiciels', 
//         href: '/logiciels', 
//         icon: Package, 
//         roles: ['technician', 'admin'],
//         description: 'Gestion des licences logiciels'
//       },
//       { 
//         name: 'Installations', 
//         href: '/installations-logiciels', 
//         icon: Cpu, 
//         roles: ['technician', 'admin'],
//         description: 'Installations logiciels sur matériels'
//       },
//       { 
//         name: 'Réseau', 
//         href: '/configuration-reseau', 
//         icon: Network, 
//         roles: ['technician', 'admin'],
//         description: 'Configuration réseau'
//       },
//       { 
//         name: 'Incidents', 
//         href: '/incidents', 
//         icon: AlertTriangle, 
//         roles: ['user', 'technician', 'director', 'admin'],
//         description: 'Gestion des incidents'
//       },
//       { 
//         name: 'Alertes', 
//         href: '/alertes', 
//         icon: Bell, 
//         roles: ['technician', 'director', 'admin'],
//         description: 'Alertes système'
//       },
//       { 
//         name: 'Réparations', 
//         href: '/reparations', 
//         icon: Wrench, 
//         roles: ['technician', 'admin'],
//         description: 'Suivi des réparations'
//       },
//       { 
//         name: 'Profils', 
//         href: '/profils-utilisateurs', 
//         icon: User, 
//         roles: ['admin'],
//         description: 'Gestion des profils utilisateurs'
//       },
//       { 
//         name: 'Utilisateurs', 
//         href: '/users', 
//         icon: Users, 
//         roles: ['admin'],
//         description: 'Gestion des comptes utilisateurs'
//       },
//       { 
//         name: 'Rapports', 
//         href: '/rapports', 
//         icon: FileText, 
//         roles: ['director', 'admin'],
//         description: 'Rapports et statistiques'
//       },
//     ];

//     // Filtrer les routes selon le rôle
//     const filteredRoutes = allRoutes.filter(route => 
//       route.roles.includes(role)
//     );

//     return [...baseNavigation, ...filteredRoutes];
//   };

//   // Mémoized navigation basée sur le rôle
//   const navigation = useMemo(() => {
//     return getNavigationForRole(user?.role || 'user');
//   }, [user?.role]);

//   const isActive = (path) => location.pathname === path;

//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case 'admin': return 'badge-error bg-red-500 text-white';
//       case 'technician': return 'badge-warning bg-orange-500 text-white';
//       case 'secretary': return 'badge-info bg-blue-500 text-white';
//       case 'director': return 'badge-success bg-purple-500 text-white';
//       case 'user': return 'badge-neutral bg-gray-500 text-white';
//       default: return 'badge-neutral bg-gray-500 text-white';
//     }
//   };

//   const getRoleText = (role) => {
//     switch (role) {
//       case 'admin': return 'Administrateur';
//       case 'technician': return 'Technicien IT';
//       case 'secretary': return 'Secrétaire';
//       case 'director': return 'Directeur';
//       case 'user': return 'Utilisateur';
//       default: return role;
//     }
//   };

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case 'admin': return <Shield className="w-4 h-4" />;
//       case 'technician': return <Settings className="w-4 h-4" />;
//       case 'secretary': return <User className="w-4 h-4" />;
//       case 'director': return <Briefcase className="w-4 h-4" />;
//       case 'user': return <User className="w-4 h-4" />;
//       default: return <User className="w-4 h-4" />;
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const getRoleDescription = (role) => {
//     switch (role) {
//       case 'user': 
//         return 'Accès limité à vos matériels et incidents';
//       case 'technician': 
//         return 'Accès aux fonctionnalités techniques et gestion';
//       case 'secretary': 
//         return 'Gestion administrative et fournisseurs';
//       case 'director': 
//         return 'Vue globale avec rapports et statistiques';
//       case 'admin': 
//         return 'Accès complet à toutes les fonctionnalités';
//       default: 
//         return 'Utilisateur du système';
//     }
//   };

//   // Si en cours de chargement
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-base-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-green-600 mb-4"></div>
//           <p className="text-gray-600">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   // Si pas d'utilisateur connecté (ne devrait pas arriver avec Layout protégé)
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-base-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="alert alert-warning max-w-md">
//             <span>Session expirée. Veuillez vous reconnecter.</span>
//             <button 
//               onClick={() => navigate('/login')}
//               className="btn btn-sm btn-primary mt-2"
//             >
//               Se connecter
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg border-b border-green-700 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               {/* Logo DREN avec fallback */}
//               <div className={`bg-white p-1 rounded-lg mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
//                 {!logoError ? (
//                   <img 
//                     src={logoDren}
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className={`object-contain ${logoConfig.header.image}`}
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <Monitor className="h-6 w-6 text-green-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white">
//                   DREN Antsimo A
//                 </h1>
//                 <p className="text-xs text-green-200">Gestion des Ressources IT</p>
//               </div>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex space-x-1">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors group relative ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white shadow-sm'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                     title={item.description}
//                   >
//                     <Icon className="w-4 h-4 mr-2" />
//                     {item.name}
                    
//                     {/* Tooltip pour description */}
//                     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
//                       {item.description}
//                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </nav>

//             {/* User Menu */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:flex items-center text-sm text-white">
//                 <div className="flex flex-col items-end mr-3">
//                   <span className="font-medium">{user?.name || user?.username || 'Utilisateur'}</span>
//                   <span className="text-xs text-green-200">{user?.departement || 'Département'}</span>
//                 </div>
//                 <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
//                   {getRoleIcon(user?.role)}
//                   <span>{getRoleText(user?.role)}</span>
//                 </div>
//               </div>
              
//               <div className="dropdown dropdown-end">
//                 <button 
//                   tabIndex={0}
//                   className="flex items-center text-green-100 hover:text-white transition-colors p-2 rounded-md hover:bg-green-700"
//                   title="Menu utilisateur"
//                 >
//                   <User className="w-4 h-4" />
//                 </button>
//                 <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
//                   <li className="menu-title">
//                     <span>{user?.name || user?.username}</span>
//                     <span className="text-xs text-gray-500">{getRoleText(user?.role)}</span>
//                   </li>
//                   <li>
//                     <Link to="/mon-profil" onClick={() => setIsMobileMenuOpen(false)}>
//                       <User className="w-4 h-4" />
//                       Mon profil
//                     </Link>
//                   </li>
//                   <li>
//                     <button onClick={handleLogout}>
//                       <LogOut className="w-4 h-4" />
//                       Se déconnecter
//                     </button>
//                   </li>
//                 </ul>
//               </div>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 rounded-md text-green-100 hover:bg-green-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-green-700 bg-green-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-5 h-5 mr-3" />
//                     <div>
//                       <div>{item.name}</div>
//                       <div className="text-xs text-green-300 opacity-75">{item.description}</div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Bannière d'information du rôle */}
//         {user?.role && (
//           <div className={`mb-6 p-4 border rounded-lg ${
//             user.role === 'admin' ? 'bg-red-50 border-red-200' :
//             user.role === 'technician' ? 'bg-orange-50 border-orange-200' :
//             user.role === 'secretary' ? 'bg-blue-50 border-blue-200' :
//             user.role === 'director' ? 'bg-purple-50 border-purple-200' :
//             'bg-gray-50 border-gray-200'
//           }`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
//                   {getRoleIcon(user.role)}
//                   <span>{getRoleText(user.role)}</span>
//                 </div>
//                 <div className="ml-4 text-sm">
//                   <span className={
//                     user.role === 'admin' ? 'text-red-700' :
//                     user.role === 'technician' ? 'text-orange-700' :
//                     user.role === 'secretary' ? 'text-blue-700' :
//                     user.role === 'director' ? 'text-purple-700' :
//                     'text-gray-700'
//                   }>
//                     {getRoleDescription(user.role)}
//                   </span>
//                 </div>
//               </div>
//               {user.role === 'user' && (
//                 <button 
//                   onClick={() => navigate('/demande-acces')}
//                   className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors"
//                 >
//                   Demander plus d'accès
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {children}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-start">
//               {/* Logo DREN - TAILLE FOOTER */}
//               <div className={`bg-white rounded p-1 mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
//                 <img 
//                   src={logoDren}
//                   alt="Logo DREN" 
//                   className={`object-contain ${logoConfig.footer.image}`}
//                 />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
//                 <p className="text-green-200 text-sm">
//                   Direction Régionale de l'Éducation Nationale
//                 </p>
//                 <p className="text-green-200 text-sm">
//                   Région Atsimo Andrefana, Madagascar
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <div className="space-y-2 text-sm text-green-200">
//                 <div className="flex items-center">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span>Toliara, Madagascar</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>+261 94 xxx xx xx</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span>contact@dren-antsimo-andrefana.mg</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Système</h3>
//               <p className="text-green-200 text-sm">
//                 Système de Gestion des Ressources Informatiques
//               </p>
//               <p className="text-green-200 text-sm">
//                 Connecté en tant que: <span className="font-medium">{getRoleText(user?.role)}</span>
//               </p>
//               <p className="text-green-200 text-sm">
//                 Version 1.0 - {new Date().getFullYear()}
//               </p>
//             </div>
//           </div>
//           <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm text-green-300">
//             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Layout;




// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   Monitor, 
//   AlertTriangle, 
//   Wrench, 
//   BarChart3, 
//   LogOut, 
//   User,
//   Menu,
//   X,
//   Users,
//   Network,
//   Bell,
//   Package,
//   Cpu,
//   MapPin,
//   Phone,
//   Mail
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Import de l'image JPEG depuis le dossier src
// import logoDren from '../assets/images/logo-dren.jpeg';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [logoError, setLogoError] = useState(false);

//   // Configuration des tailles d'image
//   const logoConfig = {
//     header: {
//       container: 'h-[70px] w-[160px]',  // Taille exacte
//       image: 'w-full h-full',    // Prend toute la place du container
//     },
//     footer: {
//       container: 'h-[120px] w-[160px]',  // Taille exacte
//       image: 'w-full h-full',     // Image dans le footer
//     }
//   };

//   const navigation = [
//     { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
//     { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
//     { name: 'Matériels', href: '/materiels', icon: Monitor },
//     { name: 'Logiciels', href: '/logiciels', icon: Package },
//     { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
//     { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//     { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//     { name: 'Alertes', href: '/alertes', icon: Bell },
//     { name: 'Réparations', href: '/reparations', icon: Wrench },
//     { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
//   ];

//   if (user?.role === 'admin') {
//     navigation.push({ name: 'Utilisateurs', href: '/users', icon: Users });
//   }

//   const isActive = (path) => location.pathname === path;

//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case 'admin': return 'badge-error';
//       case 'technicien': return 'badge-warning';
//       case 'utilisateur': return 'badge-info';
//       default: return 'badge-neutral';
//     }
//   };

//   const getRoleText = (role) => {
//     switch (role) {
//       case 'admin': return 'Administrateur';
//       case 'technicien': return 'Technicien IT';
//       case 'utilisateur': return 'Utilisateur';
//       default: return role;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg border-b border-green-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               {/* Logo DREN avec fallback - TAILLE HEADER */}
//               <div className={`bg-white p-1 rounded-lg mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
//                 {!logoError ? (
//                   <img 
//                     src={logoDren}
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className={`object-contain ${logoConfig.header.image}`}
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <Monitor className="h-6 w-6 text-green-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white">
//                   DREN Antsimo A
//                 </h1>
//                 <p className="text-xs text-green-200">Gestion des Ressources IT</p>
//               </div>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex space-x-2">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-4 h-4 mr-2" />
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </nav>

//             {/* User Menu */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:flex items-center text-sm text-white">
//                 <User className="w-4 h-4 mr-2" />
//                 <div className="flex flex-col items-end">
//                   <span className="font-medium">{user?.nom_complet || user?.username}</span>
//                   <span className="text-xs text-green-200">{user?.service}</span>
//                 </div>
//                 <div className={`ml-2 badge ${getRoleBadgeColor(user?.role)} badge-sm`}>
//                   {getRoleText(user?.role)}
//                 </div>
//               </div>
//               <button
//                 onClick={logout}
//                 className="flex items-center text-green-100 hover:text-white transition-colors p-2 rounded-md hover:bg-green-700"
//                 title="Se déconnecter"
//               >
//                 <LogOut className="w-4 h-4" />
//               </button>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 rounded-md text-green-100 hover:bg-green-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-green-700 bg-green-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-5 h-5 mr-3" />
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {children}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-start">
//               {/* Logo DREN - TAILLE FOOTER */}
//               <div className={`bg-white rounded p-1 mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
//                 <img 
//                   src={logoDren}
//                   alt="Logo DREN" 
//                   className={`object-contain ${logoConfig.footer.image}`}
//                 />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
//                 <p className="text-green-200 text-sm">
//                   Direction Régionale de l'Éducation Nationale
//                 </p>
//                 <p className="text-green-200 text-sm">
//                   Région Atsimo Andrefana, Madagascar
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <div className="space-y-2 text-sm text-green-200">
//                 <div className="flex items-center">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span>Toliara, Madagascar</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>+261 94 xxx xx xx</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span>contact@dren-antsimo-andrefana.mg</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Système</h3>
//               <p className="text-green-200 text-sm">
//                 Système de Gestion des Ressources Informatiques
//               </p>
//               <p className="text-green-200 text-sm">
//                 Version 1.0
//               </p>
//             </div>
//           </div>
//           <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm text-green-300">
//             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );






// // };import React, { useState } from 'react'; // IMPORT CORRIGÉ - useState doit être importé de React
// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   Monitor, 
//   AlertTriangle, 
//   Wrench, 
//   BarChart3, 
//   LogOut, 
//   User,
//   Menu,
//   X,
//   Users,
//   Network,
//   Bell,
//   Package,
//   Cpu,
//   MapPin,
//   Phone,
//   Mail,
//   Shield,
//   Settings,
//   Briefcase,
//   FileText
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Import de l'image JPEG depuis le dossier src
// import logoDren from '../assets/images/logo-dren.jpeg';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
//   const [logoError, setLogoError] = React.useState(false);

//   // Configuration des tailles d'image
//   const logoConfig = {
//     header: {
//       container: 'h-[70px] w-[160px]',
//       image: 'w-full h-full',
//     },
//     footer: {
//       container: 'h-[120px] w-[160px]',
//       image: 'w-full h-full',
//     }
//   };

//   // Navigation de base accessible à tous les utilisateurs connectés
//   const baseNavigation = [
//     { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
//     { name: 'Matériels', href: '/materiels', icon: Monitor },
//     { name: 'Logiciels', href: '/logiciels', icon: Package },
//     { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//     { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
//   ];

//   // Navigation pour les secrétaires et au-dessus
//   const secretaryNavigation = [
//     { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
//     { name: 'Rapports', href: '/rapports', icon: FileText },
//   ];

//   // Navigation pour les techniciens et au-dessus
//   const technicianNavigation = [
//     { name: 'Réparations', href: '/reparations', icon: Wrench },
//     { name: 'Alertes', href: '/alertes', icon: Bell },
//     { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
//     { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//   ];

//   // Navigation pour les administrateurs et directeurs
//   const adminNavigation = [
//     // { name: 'Utilisateurs', href: '/users', icon: Users },
//   ];

//   // Fonction pour vérifier les permissions
//   const hasPermission = (requiredRole) => {
//     const roleHierarchy = {
//       'user': 1,
//       'secretary': 2,
//       'technician': 3,
//       'director': 4,
//       'admin': 5
//     };
//     const userRole = user?.role || 'user';
//     return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
//   };

//   // Combiner la navigation en fonction du rôle
//   const getNavigation = () => {
//     let navigation = [...baseNavigation];
    
//     if (hasPermission('secretary')) {
//       navigation = [...navigation, ...secretaryNavigation];
//     }
    
//     if (hasPermission('technician')) {
//       navigation = [...navigation, ...technicianNavigation];
//     }
    
//     if (hasPermission('director')) {
//       navigation = [...navigation, ...adminNavigation];
//     }
    
//     return navigation;
//   };

//   const navigation = getNavigation();

//   const isActive = (path) => location.pathname === path;

//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case 'admin': return 'badge-error bg-red-500 text-white';
//       case 'director': return 'badge-warning bg-orange-500 text-white';
//       case 'technician': return 'badge-info bg-blue-500 text-white';
//       case 'secretary': return 'badge-success bg-green-500 text-white';
//       case 'user': return 'badge-neutral bg-gray-500 text-white';
//       default: return 'badge-neutral bg-gray-400 text-white';
//     }
//   };

//   const getRoleText = (role) => {
//     switch (role) {
//       case 'admin': return 'Administrateur';
//       case 'director': return 'Directeur';
//       case 'technician': return 'Technicien';
//       case 'secretary': return 'Secrétaire';
//       case 'user': return 'Utilisateur';
//       default: return role;
//     }
//   };

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case 'admin': return <Shield className="w-4 h-4" />;
//       case 'director': return <Briefcase className="w-4 h-4" />;
//       case 'technician': return <Settings className="w-4 h-4" />;
//       case 'secretary': return <User className="w-4 h-4" />;
//       default: return <User className="w-4 h-4" />;
//     }
//   };

//   const handleLogout = () => {
//     if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
//       logout();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-100 flex flex-col">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg border-b border-green-700 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               {/* Logo DREN avec fallback */}
//               <div className={`bg-white p-1 rounded-lg mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
//                 {!logoError ? (
//                   <img 
//                     src={logoDren}
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className={`object-contain ${logoConfig.header.image}`}
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <Monitor className="h-6 w-6 text-green-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white">
//                   DREN Antsimo A
//                 </h1>
//                 <p className="text-xs text-green-200">Gestion des Ressources IT</p>
//               </div>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex space-x-1">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white shadow-inner'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                     title={item.name}
//                   >
//                     <Icon className="w-4 h-4 mr-2" />
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </nav>

//             {/* User Menu */}
//             <div className="flex items-center space-x-3">
//               <div className="hidden md:flex items-center space-x-3 text-sm text-white">
//                 <div className="flex items-center space-x-2 bg-green-700/50 px-3 py-1 rounded-full">
//                   {getRoleIcon(user?.role)}
//                   <div className="flex flex-col items-start">
//                     <span className="font-medium text-xs">{user?.name || user?.username}</span>
//                     <span className={`badge ${getRoleBadgeColor(user?.role)} badge-xs`}>
//                       {getRoleText(user?.role)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-green-100 hover:text-white transition-colors p-2 rounded-md hover:bg-green-700 group"
//                 title="Se déconnecter"
//               >
//                 <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
//               </button>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 rounded-md text-green-100 hover:bg-green-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-green-700 bg-green-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {/* Informations utilisateur dans le menu mobile */}
//               <div className="px-3 py-2 border-b border-green-700 mb-2">
//                 <div className="flex items-center space-x-2 text-white">
//                   <User className="w-4 h-4" />
//                   <div>
//                     <div className="font-medium text-sm">{user?.name || user?.username}</div>
//                     <div className={`badge ${getRoleBadgeColor(user?.role)} badge-xs mt-1`}>
//                       {getRoleText(user?.role)}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-5 h-5 mr-3" />
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
//         {/* Indicateur de rôle en haut de page (optionnel) */}
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span>Connecté en tant que :</span>
//             <span className={`badge ${getRoleBadgeColor(user?.role)}`}>
//               {getRoleText(user?.role)}
//             </span>
//           </div>
//           {user?.departement && (
//             <div className="text-sm text-gray-500">
//               Département : <span className="font-medium">{user.departement}</span>
//             </div>
//           )}
//         </div>
        
//         {children}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-start">
//               {/* Logo DREN - TAILLE FOOTER */}
//               <div className={`bg-white rounded p-1 mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
//                 <img 
//                   src={logoDren}
//                   alt="Logo DREN" 
//                   className={`object-contain ${logoConfig.footer.image}`}
//                 />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
//                 <p className="text-green-200 text-sm">
//                   Direction Régionale de l'Éducation Nationale
//                 </p>
//                 <p className="text-green-200 text-sm">
//                   Région Atsimo Andrefana, Madagascar
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <div className="space-y-2 text-sm text-green-200">
//                 <div className="flex items-center">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span>Toliara, Madagascar</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>+261 94 xxx xx xx</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span>contact@dren-antsimo-andrefana.mg</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Système</h3>
//               <p className="text-green-200 text-sm mb-2">
//                 Gestion des Ressources Informatiques
//               </p>
//               <div className="flex items-center space-x-2 text-green-300 text-xs">
//                 <span>Utilisateur :</span>
//                 <span className={`badge ${getRoleBadgeColor(user?.role)} badge-sm`}>
//                   {getRoleText(user?.role)}
//                 </span>
//               </div>
//               <p className="text-green-300 text-xs mt-2">Version 1.0</p>
//             </div>
//           </div>
//           <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm text-green-300">
//             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Layout;









// import React, { useState } from 'react'; // ✅ Importez useState
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   Monitor, 
//   AlertTriangle, 
//   Wrench, 
//   BarChart3, 
//   LogOut, 
//   User,
//   Menu,
//   X,
//   Users,
//   Network,
//   Bell,
//   Package,
//   Cpu,
//   MapPin,
//   Phone,
//   Mail
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Import de l'image JPEG depuis le dossier src
// import logoDren from '../assets/images/logo-dren.jpeg';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [logoError, setLogoError] = useState(false);

//   // Configuration des tailles d'image
//   const logoConfig = {
//     header: {
//       container: 'h-[70px] w-[160px]',
//       image: 'w-full h-full',
//     },
//     footer: {
//       container: 'h-[120px] w-[160px]',
//       image: 'w-full h-full',
//     }
//   };

//   const navigation = [
//     { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
//     { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
//     { name: 'Matériels', href: '/materiels', icon: Monitor },
//     { name: 'Logiciels', href: '/logiciels', icon: Package },
//     { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
//     { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//     { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//     { name: 'Alertes', href: '/alertes', icon: Bell },
//     { name: 'Réparations', href: '/reparations', icon: Wrench },
//     // { name: 'Rapports', href: '/rapports', icon: FileText },

//     { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
//   ];

//   if (user?.role === 'admin') {
//     // navigation.push({ name: 'Utilisateurs', href: '/users', icon: Users });
//   }

//   const isActive = (path) => location.pathname === path;

//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case 'admin': return 'badge-error';
//       case 'technicien': return 'badge-warning';
//       case 'utilisateur': return 'badge-info';
//       default: return 'badge-neutral';
//     }
//   };

//   const getRoleText = (role) => {
//     switch (role) {
//       case 'admin': return 'Administrateur';
//       case 'technicien': return 'Technicien IT';
//       case 'utilisateur': return 'Utilisateur';
//       default: return role;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg border-b border-green-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               {/* Logo DREN avec fallback */}
//               <div className={`bg-white p-1 rounded-lg mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
//                 {!logoError ? (
//                   <img 
//                     src={logoDren}
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className={`object-contain ${logoConfig.header.image}`}
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <Monitor className="h-6 w-6 text-green-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white">
//                   DREN Antsimo A
//                 </h1>
//                 <p className="text-xs text-green-200">Gestion des Ressources IT</p>
//               </div>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex space-x-2">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-4 h-4 mr-2" />
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </nav>

//             {/* User Menu */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:flex items-center text-sm text-white">
//                 <User className="w-4 h-4 mr-2" />
//                 <div className="flex flex-col items-end">
//                   <span className="font-medium">{user?.nom_complet || user?.username}</span>
//                   <span className="text-xs text-green-200">{user?.service}</span>
//                 </div>
//                 <div className={`ml-2 badge ${getRoleBadgeColor(user?.role)} badge-sm`}>
//                   {getRoleText(user?.role)}
//                 </div>
//               </div>
//               <button
//                 onClick={logout}
//                 className="flex items-center text-green-100 hover:text-white transition-colors p-2 rounded-md hover:bg-green-700"
//                 title="Se déconnecter"
//               >
//                 <LogOut className="w-4 h-4" />
//               </button>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 rounded-md text-green-100 hover:bg-green-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-green-700 bg-green-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-5 h-5 mr-3" />
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {children}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-start">
//               {/* Logo DREN - TAILLE FOOTER */}
//               <div className={`bg-white rounded p-1 mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
//                 <img 
//                   src={logoDren}
//                   alt="Logo DREN" 
//                   className={`object-contain ${logoConfig.footer.image}`}
//                 />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
//                 <p className="text-green-200 text-sm">
//                   Direction Régionale de l'Éducation Nationale
//                 </p>
//                 <p className="text-green-200 text-sm">
//                   Région Atsimo Andrefana, Madagascar
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <div className="space-y-2 text-sm text-green-200">
//                 <div className="flex items-center">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span>Toliara, Madagascar</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>+261 94 xxx xx xx</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span>drenetp@gmail.com</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Système</h3>
//               <p className="text-green-200 text-sm">
//                 Système de Gestion des Ressources Informatiques
//               </p>
//               <p className="text-green-200 text-sm">

//               </p>
//             </div>
//           </div>
//           <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm text-green-300">
//             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Layout;







// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   Monitor, 
//   AlertTriangle, 
//   Wrench, 
//   BarChart3, 
//   LogOut, 
//   User,
//   Menu,
//   X,
//   Users,
//   Network,
//   Bell,
//   Package,
//   Cpu,
//   MapPin,
//   Phone,
//   Mail,
//   FileText,
//   Settings
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Import de l'image JPEG
// import logoDren from '../assets/images/logo-dren.jpeg';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [logoError, setLogoError] = useState(false);

//   const logoConfig = {
//     header: {
//       container: 'h-[70px] w-[160px]',
//       image: 'w-full h-full',
//     },
//     footer: {
//       container: 'h-[120px] w-[160px]',
//       image: 'w-full h-full',
//     }
//   };

//   // Navigation de base pour tous les rôles
//   const baseNavigation = [
//     { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3, roles: ['admin', 'directeur', 'technicien', 'secretary', 'user'] },
//   ];

//   // Navigation par rôle
//   const roleNavigation = {
//     admin: [
//       { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
//       { name: 'Matériels', href: '/materiels', icon: Monitor },
//       { name: 'Logiciels', href: '/logiciels', icon: Package },
//       { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
//       { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//       { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//       { name: 'Alertes', href: '/alertes', icon: Bell },
//       { name: 'Réparations', href: '/reparations', icon: Wrench },
//       { name: 'Rapports', href: '/rapports', icon: FileText },
//       { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
//       { name: 'Utilisateurs', href: '/users', icon: Settings },
//     ],
//     directeur: [
//       { name: 'Rapports', href: '/rapports', icon: FileText },
//       { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
//     ],
//     secretary: [
//       { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
//       { name: 'Rapports', href: '/rapports', icon: FileText },
//       { name: 'Matériels', href: '/materiels', icon: Monitor },
//     ],
//     technicien: [
//       { name: 'Alertes', href: '/alertes', icon: Bell },
//       { name: 'Réparations', href: '/reparations', icon: Wrench },
//       { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//       { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//     ],
//     user: [
//       { name: 'Matériels', href: '/materiels', icon: Monitor },
//       { name: 'Logiciels', href: '/logiciels', icon: Package },
//       { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
//       { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//       { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//     ]
//   };

//   // Fonction pour déterminer la navigation selon le rôle
//   const getNavigationForRole = () => {
//     if (!user || !user.role) return baseNavigation;
    
//     const role = user.role.toLowerCase();
//     const specificNav = roleNavigation[role] || [];
    
//     // Fusionner la navigation de base avec la navigation spécifique au rôle
//     return [
//       ...baseNavigation.filter(item => item.roles.includes(role)),
//       ...specificNav
//     ];
//   };

//   const navigation = getNavigationForRole();

//   const isActive = (path) => location.pathname === path;

//   const getRoleBadgeColor = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'badge-error bg-red-600';
//       case 'directeur': return 'badge-primary bg-blue-600';
//       case 'technicien': return 'badge-warning bg-yellow-600';
//       case 'secretary': return 'badge-success bg-green-600';
//       case 'user': return 'badge-info bg-blue-400';
//       default: return 'badge-neutral bg-gray-600';
//     }
//   };

//   const getRoleText = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'Administrateur';
//       case 'directeur': return 'Directeur';
//       case 'technicien': return 'Technicien IT';
//       case 'secretary': return 'Secrétaire';
//       case 'user': return 'Utilisateur';
//       default: return role || 'Utilisateur';
//     }
//   };

//   const getFullName = () => {
//     if (user?.full_name) return user.full_name;
//     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
//     return user?.username || 'Utilisateur';
//   };

//   const getDepartement = () => {
//     return user?.departement || user?.service || 'Département non défini';
//   };

//   // Rediriger si l'utilisateur tente d'accéder à une page non autorisée
//   React.useEffect(() => {
//     const currentPath = location.pathname;
//     const allowedPaths = navigation.map(item => item.href);
    
//     // Si l'utilisateur n'est pas sur le dashboard et n'a pas accès à la page courante
//     if (currentPath !== '/dashboard' && !allowedPaths.includes(currentPath)) {
//       // Rediriger vers le dashboard
//       navigate('/dashboard');
//     }
//   }, [location.pathname, navigation, navigate]);

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg border-b border-green-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <div className={`bg-white p-1 rounded-lg mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
//                 {!logoError ? (
//                   <img 
//                     src={logoDren}
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className={`object-contain ${logoConfig.header.image}`}
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <Monitor className="h-6 w-6 text-green-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white">
//                   DREN Antsimo Andrefana
//                 </h1>
//                 <p className="text-xs text-green-200">Gestion des Ressources IT</p>
//               </div>
//             </div>

//             {/* Desktop Navigation - Seulement les pages autorisées */}
//             <nav className="hidden md:flex space-x-2">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-4 h-4 mr-2" />
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </nav>

//             {/* User Menu */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:flex items-center text-sm text-white">
//                 <User className="w-4 h-4 mr-2" />
//                 <div className="flex flex-col items-end">
//                   <span className="font-medium">{getFullName()}</span>
//                   <span className="text-xs text-green-200">{getDepartement()}</span>
//                 </div>
//                 <div className={`ml-2 badge ${getRoleBadgeColor(user?.role)} badge-sm text-white border-0`}>
//                   {getRoleText(user?.role)}
//                 </div>
//               </div>
//               <button
//                 onClick={logout}
//                 className="flex items-center text-green-100 hover:text-white transition-colors p-2 rounded-md hover:bg-green-700"
//                 title="Se déconnecter"
//               >
//                 <LogOut className="w-4 h-4" />
//               </button>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 rounded-md text-green-100 hover:bg-green-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-green-700 bg-green-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//                       isActive(item.href)
//                         ? 'bg-green-700 text-white'
//                         : 'text-green-100 hover:bg-green-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-5 h-5 mr-3" />
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Indicateur de rôle et permissions */}
//         {user && (
//           <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Bienvenue, {getFullName()}!
//                 </h2>
//                 <p className="text-gray-600">
//                   Vous êtes connecté en tant que <span className={`font-bold ${getRoleBadgeColor(user.role)} text-white px-2 py-1 rounded`}>
//                     {getRoleText(user.role)}
//                   </span>
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Accès autorisés selon votre profil
//                 </p>
//               </div>
//               <div className="mt-2 md:mt-0">
//                 <p className="text-sm text-gray-600">
//                   Département: <span className="font-medium">{getDepartement()}</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {children}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-start">
//               <div className={`bg-white rounded p-1 mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
//                 <img 
//                   src={logoDren}
//                   alt="Logo DREN" 
//                   className={`object-contain ${logoConfig.footer.image}`}
//                 />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
//                 <p className="text-green-200 text-sm">
//                   Direction Régionale de l'Éducation Nationale
//                 </p>
//                 <p className="text-green-200 text-sm">
//                   Région Atsimo Andrefana, Madagascar
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <div className="space-y-2 text-sm text-green-200">
//                 <div className="flex items-center">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span>Toliara, Madagascar</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>+261 94 xxx xx xx</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span>drenetp@gmail.com</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Système</h3>
//               <p className="text-green-200 text-sm">
//                 Système de Gestion des Ressources Informatiques
//               </p>
//               <p className="text-green-200 text-sm mt-2">
//                 Version 1.0 • Accès contrôlé par rôles
//               </p>
//             </div>
//           </div>
//           <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm text-green-300">
//             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
//             <p className="mt-1">
//               Connecté en tant que: <span className="font-medium">{getRoleText(user?.role)}</span>
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // Composant pour protéger les routes par rôle
// export const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, isLoading } = useAuth();
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     if (!isLoading && user) {
//       const userRole = user.role?.toLowerCase();
//       const isAllowed = allowedRoles.includes(userRole);
      
//       if (!isAllowed) {
//         navigate('/dashboard');
//       }
//     }
//   }, [user, isLoading, allowedRoles, navigate]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-primary"></div>
//           <p className="mt-4 text-gray-600">Vérification des permissions...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   const userRole = user.role?.toLowerCase();
//   if (!allowedRoles.includes(userRole)) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center p-8 bg-red-50 rounded-lg shadow">
//           <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-red-700 mb-2">Accès refusé</h2>
//           <p className="text-gray-600 mb-4">
//             Vous n'avez pas les permissions nécessaires pour accéder à cette page.
//           </p>
//           <p className="text-sm text-gray-500">
//             Rôle actuel: <span className="font-bold">{user.role}</span>
//           </p>
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Retour au tableau de bord
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return children;
// };

// export default Layout;







































// // mon vrai code 


// import React, { useState } from 'react'; // ✅ Importez useState
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   Monitor, 
//   AlertTriangle, 
//   Wrench, 
//   BarChart3, 
//   LogOut, 
//   User,
//   Menu,
//   X,
//   Users,
//   Network,
//   Bell,
//   Package,
//   Cpu,
//   MapPin,
//   Phone,
//   Mail,
//   FileText,
//   Lock
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Import de l'image JPEG depuis le dossier src
// import logoDren from '../assets/images/logo-dren.jpeg';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [logoError, setLogoError] = useState(false);

//   // Configuration des tailles d'image
//   const logoConfig = {
//     header: {
//       container: 'h-[70px] w-[160px]',
//       image: 'w-full h-full',
//     },
//     footer: {
//       container: 'h-[120px] w-[160px]',
//       image: 'w-full h-full',
//     }
//   };

//   // Tous les menus (affichés pour tous)
//   const allNavigation = [
//     { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
//     { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
//     { name: 'Matériels', href: '/materiels', icon: Monitor },
//     { name: 'Logiciels', href: '/logiciels', icon: Package },
//     { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
//     { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//     { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//     { name: 'Alertes', href: '/alertes', icon: Bell },
//     { name: 'Réparations', href: '/reparations', icon: Wrench },
//     { name: 'Rapports', href: '/rapports', icon: FileText },
//     { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
//   ];

//   // Permissions par rôle (qui peut accéder à quoi)
//   const getPermissionsByRole = () => {
//     if (!user || !user.role) return [];
    
//     const role = user.role.toLowerCase();
    
//     const permissions = {
//       // Administrateur accède à TOUT
//       admin: allNavigation.map(item => item.href),
      
//       // Directeur pour rapport + dashboard
//       directeur: ['/dashboard', '/rapports'],
      
//       // Secrétaire pour fournisseur + rapport + matériels
//       secretary: ['/dashboard', '/fournisseurs', '/materiels', '/rapports'],
      
//       // Technicien pour alerte, reparation, incidents, configuration réseau
//       technicien: [
//         '/dashboard', 
//         '/alertes', 
//         '/reparations', 
//         '/incidents', 
//         '/configuration-reseau'
//       ],
      
//       // Utilisateur pour materiel, logiciel, installation logiciel, configuration reseau et incident
//       user: [
//         '/dashboard',
//         '/materiels',
//         '/logiciels',
//         '/installations-logiciels',
//         '/configuration-reseau',
//         '/incidents'
//       ]
//     };

//     // Si rôle non trouvé, utiliser user par défaut
//     return permissions[role] || permissions.user;
//   };

//   // Vérifier si l'utilisateur a accès à une page spécifique
//   const hasPermission = (pagePath) => {
//     if (!user) return false;
    
//     // Admin a toujours accès à tout
//     if (user.role?.toLowerCase() === 'admin') return true;
    
//     // Vérifier si la page est dans les permissions
//     const allowedPages = getPermissionsByRole();
//     return allowedPages.includes(pagePath);
//   };

//   // Gérer le clic sur un menu (vérifier les permissions)
//   const handleMenuClick = (href, e) => {
//     if (!hasPermission(href)) {
//       e.preventDefault();
//       e.stopPropagation();
      
//       // Afficher un message d'alerte
//       alert(`⛔ Accès refusé!\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.`);
//     }
//   };

//   const isActive = (path) => location.pathname === path;

//   const getRoleBadgeColor = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'badge-error bg-red-600';
//       case 'directeur': return 'badge-primary bg-blue-600';
//       case 'technicien': return 'badge-warning bg-yellow-600';
//       case 'secretary': return 'badge-success bg-green-600';
//       case 'user': return 'badge-info bg-blue-400';
//       default: return 'badge-neutral bg-gray-600';
//     }
//   };

//   const getRoleText = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'Administrateur';
//       case 'directeur': return 'Directeur';
//       case 'technicien': return 'Technicien IT';
//       case 'secretary': return 'Secrétaire';
//       case 'user': return 'Utilisateur';
//       default: return role || 'Utilisateur';
//     }
//   };

//   const getFullName = () => {
//     if (user?.full_name) return user.full_name;
//     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
//     return user?.username || 'Utilisateur';
//   };

//   const getDepartement = () => {
//     return user?.departement || user?.service || 'Département non défini';
//   };

//   // Vérifier les permissions pour la page actuelle
//   React.useEffect(() => {
//     if (user && !hasPermission(location.pathname) && location.pathname !== '/') {
//       // Rediriger vers le dashboard si pas de permission
//       navigate('/dashboard');
//       alert(`⛔ Accès refusé!\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.`);
//     }
//   }, [location.pathname, user, navigate]);

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg border-b border-green-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               {/* Logo DREN avec fallback */}
//               <div className={`bg-white p-1 rounded-lg mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
//                 {!logoError ? (
//                   <img 
//                     src={logoDren}
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className={`object-contain ${logoConfig.header.image}`}
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <Monitor className="h-6 w-6 text-green-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white">
//                   DREN Antsimo A
//                 </h1>
//                 <p className="text-xs text-green-200">Gestion des Ressources IT</p>
//               </div>
//             </div>

//             {/* Desktop Navigation - TOUS les menus affichés */}
//             <nav className="hidden md:flex space-x-2">
//               {allNavigation.map((item) => {
//                 const Icon = item.icon;
//                 const hasAccess = hasPermission(item.href);
                
//                 return (
//                   <div key={item.name} className="relative group">
//                     <Link
//                       to={hasAccess ? item.href : '#'}
//                       onClick={(e) => !hasAccess && handleMenuClick(item.href, e)}
//                       className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
//                         isActive(item.href)
//                           ? 'bg-green-700 text-white'
//                           : hasAccess 
//                             ? 'text-green-100 hover:bg-green-700 hover:text-white'
//                             : 'text-green-300 opacity-60 cursor-not-allowed'
//                       }`}
//                     >
//                       <Icon className="w-4 h-4 mr-2" />
//                       {item.name}
//                       {!hasAccess && (
//                         <Lock className="w-3 h-3 ml-1" />
//                       )}
//                     </Link>
                    
//                     {/* Tooltip pour indiquer les permissions manquantes */}
//                     {!hasAccess && (
//                       <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
//                         <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
//                           ⛔ Accès réservé aux: {getAllowedRolesForPage(item.href)}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </nav>

//             {/* User Menu */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:flex items-center text-sm text-white">
//                 <User className="w-4 h-4 mr-2" />
//                 <div className="flex flex-col items-end">
//                   <span className="font-medium">{getFullName()}</span>
//                   <span className="text-xs text-green-200">{getDepartement()}</span>
//                 </div>
//                 <div className={`ml-2 badge ${getRoleBadgeColor(user?.role)} badge-sm text-white border-0`}>
//                   {getRoleText(user?.role)}
//                 </div>
//               </div>
//               <button
//                 onClick={logout}
//                 className="flex items-center text-green-100 hover:text-white transition-colors p-2 rounded-md hover:bg-green-700"
//                 title="Se déconnecter"
//               >
//                 <LogOut className="w-4 h-4" />
//               </button>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 rounded-md text-green-100 hover:bg-green-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation - TOUS les menus affichés */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-green-700 bg-green-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {allNavigation.map((item) => {
//                 const Icon = item.icon;
//                 const hasAccess = hasPermission(item.href);
                
//                 return (
//                   <div key={item.name} className="relative">
//                     <Link
//                       to={hasAccess ? item.href : '#'}
//                       onClick={(e) => {
//                         setIsMobileMenuOpen(false);
//                         if (!hasAccess) {
//                           e.preventDefault();
//                           alert(`⛔ Accès refusé!\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.`);
//                         }
//                       }}
//                       className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//                         isActive(item.href)
//                           ? 'bg-green-700 text-white'
//                           : hasAccess 
//                             ? 'text-green-100 hover:bg-green-700 hover:text-white'
//                             : 'text-green-300 opacity-60 cursor-not-allowed'
//                       }`}
//                     >
//                       <Icon className="w-5 h-5 mr-3" />
//                       {item.name}
//                       {!hasAccess && (
//                         <Lock className="w-3 h-3 ml-auto" />
//                       )}
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </header>

      // {/* Main Content */}
      // <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      //   {/* Bandeau d'information sur les permissions */}
      //   {user && (
      //     <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm">
      //       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      //         <div>
      //           <h2 className="text-xl font-semibold text-gray-800">
      //             Bienvenue, {getFullName()}!
      //           </h2>
      //           <p className="text-gray-600">
      //             Rôle : <span className={`font-bold ${getRoleBadgeColor(user.role)} text-white px-2 py-1 rounded`}>
      //               {getRoleText(user.role)}
      //             </span>
      //           </p>
      //           <p className="text-sm text-gray-500 mt-1">
      //             Pages accessibles : {getPermissionsByRole().length} / {allNavigation.length}
      //           </p>
      //         </div>
      //         <div className="mt-2 md:mt-0">
      //           <div className="flex items-center space-x-2">
      //             <div className="text-sm text-gray-600">
      //               <span className="font-medium">Département:</span> {getDepartement()}
      //             </div>
      //             <div className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded">
      //               {user?.telephone || 'Tél: Non défini'}
      //             </div>
      //           </div>
      //           <p className="text-xs text-gray-500 mt-1">
      //             Les pages verrouillées <Lock className="w-3 h-3 inline ml-1" /> ne sont pas accessibles
      //           </p>
      //         </div>
      //       </div>
            
      //       {/* Légende des permissions */}
      //       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
      //         <div>
      //           <span className="font-medium text-green-600">✅ Pages accessibles :</span>
      //           <div className="flex flex-wrap gap-1 mt-1">
      //             {allNavigation
      //               .filter(item => hasPermission(item.href))
      //               .map(item => (
      //                 <span key={item.name} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
      //                   {item.name}
      //                 </span>
      //               ))
      //             }
      //           </div>
      //         </div>
      //         <div>
      //           <span className="font-medium text-red-600">⛔ Pages restreintes :</span>
      //           <div className="flex flex-wrap gap-1 mt-1">
      //             {allNavigation
      //               .filter(item => !hasPermission(item.href))
      //               .map(item => (
      //                 <span key={item.name} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
      //                   {item.name}
      //                 </span>
      //               ))
      //             }
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   )}
        
//         {/* Contenu principal */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           {children}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-start">
//               {/* Logo DREN - TAILLE FOOTER */}
//               <div className={`bg-white rounded p-1 mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
//                 <img 
//                   src={logoDren}
//                   alt="Logo DREN" 
//                   className={`object-contain ${logoConfig.footer.image}`}
//                 />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
//                 <p className="text-green-200 text-sm">
//                   Direction Régionale de l'Éducation Nationale
//                 </p>
//                 <p className="text-green-200 text-sm">
//                   Région Atsimo Andrefana, Madagascar
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <div className="space-y-2 text-sm text-green-200">
//                 <div className="flex items-center">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span>Toliara, Madagascar</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>+261 94 xxx xx xx</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span>drenetp@gmail.com</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Système</h3>
//               <p className="text-green-200 text-sm">
//                 Système de Gestion des Ressources Informatiques
//               </p>
//               <p className="text-green-200 text-sm mt-2">
//                 Version 1.0 • Contrôle d'accès par rôles
//               </p>
//               {user && (
//                 <div className="mt-3 p-2 bg-green-900/50 rounded">
//                   <p className="text-green-300 text-xs">
//                     Connecté en tant que : <span className="font-bold">{getRoleText(user.role)}</span>
//                   </p>
//                   <p className="text-green-300 text-xs mt-1">
//                     Accès : {getPermissionsByRole().length} pages autorisées
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm text-green-300">
//             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
//             <p className="mt-1">
//               Système sécurisé avec contrôle des permissions par rôle utilisateur
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // Fonction utilitaire pour déterminer quels rôles ont accès à une page
// const getAllowedRolesForPage = (pagePath) => {
//   const pagePermissions = {
//     '/dashboard': ['admin', 'directeur', 'technicien', 'secretary', 'user'],
//     '/fournisseurs': ['admin', 'secretary'],
//     '/materiels': ['admin', 'secretary', 'user'],
//     '/logiciels': ['admin', 'user'],
//     '/installations-logiciels': ['admin', 'user'],
//     '/configuration-reseau': ['admin', 'technicien', 'user'],
//     '/incidents': ['admin', 'technicien', 'user'],
//     '/alertes': ['admin', 'technicien'],
//     '/reparations': ['admin', 'technicien'],
//     '/rapports': ['admin', 'directeur', 'secretary'],
//     '/profils-utilisateurs': ['admin']
//   };
  
//   const roles = pagePermissions[pagePath] || ['admin'];
//   return roles.map(role => {
//     switch(role) {
//       case 'admin': return 'Admin';
//       case 'directeur': return 'Directeur';
//       case 'technicien': return 'Technicien';
//       case 'secretary': return 'Secrétaire';
//       case 'user': return 'Utilisateur';
//       default: return role;
//     }
//   }).join(', ');
// };

// export default Layout;









































// gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg



// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   Monitor, 
//   AlertTriangle, 
//   Wrench, 
//   BarChart3, 
//   LogOut, 
//   User,
//   Menu,
//   X,
//   Users,
//   Network,
//   Bell,
//   Package,
//   Cpu,
//   MapPin,
//   Phone,
//   Mail,
//   FileText
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Import de l'image JPEG depuis le dossier src
// import logoDren from '../assets/images/logo-dren.jpeg';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [logoError, setLogoError] = useState(false);

//   // Configuration des tailles d'image
//   const logoConfig = {
//     header: {
//       container: 'h-[70px] w-[160px]',
//       image: 'w-full h-full',
//     },
//     footer: {
//       container: 'h-[120px] w-[160px]',
//       image: 'w-full h-full',
//     }
//   };

//   // Tous les menus (affichés pour tous)
//   const allNavigation = [
//     { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
//     { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
//     { name: 'Matériels', href: '/materiels', icon: Monitor },
//     { name: 'Logiciels', href: '/logiciels', icon: Package },
//     { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
//     { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//     { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//     { name: 'Alertes', href: '/alertes', icon: Bell },
//     { name: 'Réparations', href: '/reparations', icon: Wrench },
//     { name: 'Rapports', href: '/rapports', icon: FileText },
//     { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
//   ];

//   // Permissions par rôle (qui peut accéder à quoi)
//   const getPermissionsByRole = () => {
//     if (!user || !user.role) return [];
    
//     const role = user.role.toLowerCase();
    
//     const permissions = {
//       // Administrateur accède à TOUT
//       admin: allNavigation.map(item => item.href),
      
//       // Directeur pour rapport + dashboard
//       directeur: ['/dashboard', '/rapports'],
      
//       // Secrétaire pour fournisseur + rapport + matériels
//       secretary: ['/dashboard', '/fournisseurs', '/materiels', '/rapports'],
      
//       // Technicien pour alerte, reparation, incidents, configuration réseau
//       technicien: [
//         '/dashboard', 
//         '/alertes', 
//         '/reparations', 
//         '/incidents', 
//         '/configuration-reseau'
//       ],
      
//       // Utilisateur pour materiel, logiciel, installation logiciel, configuration reseau et incident
//       user: [
//         '/dashboard',
//         '/materiels',
//         '/logiciels',
//         '/installations-logiciels',
//         '/configuration-reseau',
//         '/incidents'
//       ]
//     };

//     // Si rôle non trouvé, utiliser user par défaut
//     return permissions[role] || permissions.user;
//   };

//   // Vérifier si l'utilisateur a accès à une page spécifique
//   const hasPermission = (pagePath) => {
//     if (!user) return false;
    
//     // Admin a toujours accès à tout
//     if (user.role?.toLowerCase() === 'admin') return true;
    
//     // Vérifier si la page est dans les permissions
//     const allowedPages = getPermissionsByRole();
//     return allowedPages.includes(pagePath);
//   };

//   // Gérer le clic sur un menu (vérifier les permissions)
//   const handleMenuClick = (href, e) => {
//     if (!hasPermission(href)) {
//       e.preventDefault();
//       e.stopPropagation();
      
//       // Message d'alerte
//       alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
//     }
//   };

//   const isActive = (path) => location.pathname === path;

//   const getRoleBadgeColor = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'badge-error bg-red-600';
//       case 'directeur': return 'badge-primary bg-blue-600';
//       case 'technicien': return 'badge-warning bg-yellow-600';
//       case 'secretary': return 'badge-success bg-green-600';
//       case 'user': return 'badge-info bg-blue-400';
//       default: return 'badge-neutral bg-gray-600';
//     }
//   };

//   const getRoleText = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'Administrateur';
//       case 'directeur': return 'Directeur';
//       case 'technicien': return 'Technicien IT';
//       case 'secretary': return 'Secrétaire';
//       case 'user': return 'Utilisateur';
//       default: return role || 'Utilisateur';
//     }
//   };

//   const getFullName = () => {
//     if (user?.full_name) return user.full_name;
//     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
//     return user?.username || 'Utilisateur';
//   };

//   const getDepartement = () => {
//     return user?.departement || user?.service || 'Département non défini';
//   };

//   // Vérifier les permissions pour la page actuelle
//   React.useEffect(() => {
//     if (user && !hasPermission(location.pathname) && location.pathname !== '/') {
//       // Rediriger vers le dashboard si pas de permission
//       navigate('/dashboard');
//       alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
//     }
//   }, [location.pathname, user, navigate]);

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               {/* Logo DREN avec fallback */}
//               <div className={`bg-white p-1 rounded-lg mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
//                 {!logoError ? (
//                   <img 
//                     src={logoDren}
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className={`object-contain ${logoConfig.header.image}`}
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <Monitor className="h-6 w-6 text-green-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white">
//                   DREN Antsimo A
//                 </h1>
//                 <p className="text-xs text-green-200">Gestion des Ressources IT</p>
//               </div>
//             </div>

//             {/* Desktop Navigation - TOUS les menus affichés */}
//             <nav className="hidden md:flex space-x-2">
//               {allNavigation.map((item) => {
//                 const Icon = item.icon;
//                 const hasAccess = hasPermission(item.href);
                
//                 return (
//                   <div key={item.name} className="relative group">
//                     <Link
//                       to={hasAccess ? item.href : '#'}
//                       onClick={(e) => !hasAccess && handleMenuClick(item.href, e)}
//                       className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
//                         isActive(item.href)
//                           ? 'bg-green-700 text-white'
//                           : hasAccess 
//                             ? 'text-green-100 hover:bg-green-700 hover:text-white'
//                             : 'text-green-300 opacity-60 cursor-not-allowed'
//                       }`}
//                     >
//                       <Icon className="w-4 h-4 mr-2" />
//                       {item.name}
//                       {!hasAccess && (
//                         <span className="ml-1 text-xs">🔒</span>
//                       )}
//                     </Link>
                    
//                     {/* Tooltip pour indiquer les permissions manquantes */}
//                     {!hasAccess && (
//                       <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
//                         <div className="bg-red-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
//                           🚫 Accès réservé aux: {getAllowedRolesForPage(item.href)}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </nav>

//             {/* User Menu */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:flex items-center text-sm text-white">
//                 <User className="w-4 h-4 mr-2" />
//                 <div className="flex flex-col items-end">
//                   <span className="font-medium">{getFullName()}</span>
//                   <span className="text-xs text-green-200">{getDepartement()}</span>
//                 </div>
//                 <div className={`ml-2 badge ${getRoleBadgeColor(user?.role)} badge-sm text-white`}>
//                   {getRoleText(user?.role)}
//                 </div>
//               </div>
//               <button
//                 onClick={logout}
//                 className="flex items-center text-green-100 hover:text-white transition-colors p-2 rounded-md hover:bg-green-700"
//                 title="Se déconnecter"
//               >
//                 <LogOut className="w-4 h-4" />
//               </button>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 rounded-md text-green-100 hover:bg-green-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden bg-green-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {allNavigation.map((item) => {
//                 const Icon = item.icon;
//                 const hasAccess = hasPermission(item.href);
                
//                 return (
//                   <div key={item.name} className="relative">
//                     <Link
//                       to={hasAccess ? item.href : '#'}
//                       onClick={(e) => {
//                         setIsMobileMenuOpen(false);
//                         if (!hasAccess) {
//                           e.preventDefault();
//                           alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
//                         }
//                       }}
//                       className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//                         isActive(item.href)
//                           ? 'bg-green-700 text-white'
//                           : hasAccess 
//                             ? 'text-green-100 hover:bg-green-700 hover:text-white'
//                             : 'text-green-300 opacity-60 cursor-not-allowed'
//                       }`}
//                     >
//                       <Icon className="w-5 h-5 mr-3" />
//                       {item.name}
//                       {!hasAccess && (
//                         <span className="ml-auto text-xs">🔒</span>
//                       )}
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {children}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-start">
//               {/* Logo DREN - TAILLE FOOTER */}
//               <div className={`bg-white rounded p-1 mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
//                 <img 
//                   src={logoDren}
//                   alt="Logo DREN" 
//                   className={`object-contain ${logoConfig.footer.image}`}
//                 />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
//                 <p className="text-green-200 text-sm">
//                   Direction Régionale de l'Éducation Nationale
//                 </p>
//                 <p className="text-green-200 text-sm">
//                   Région Atsimo Andrefana, Madagascar
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <div className="space-y-2 text-sm text-green-200">
//                 <div className="flex items-center">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span>Toliara, Madagascar</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>+261 94 xxx xx xx</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span>drenetp@gmail.com</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Système</h3>
//               <p className="text-green-200 text-sm">
//                 Système de Gestion des Ressources Informatiques
//               </p>
//               <p className="text-green-200 text-sm">

//               </p>
//             </div>
//           </div>
//           <div className="mt-8 pt-4 text-center text-sm text-green-300">
//             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // Fonction utilitaire pour déterminer quels rôles ont accès à une page
// const getAllowedRolesForPage = (pagePath) => {
//   const pagePermissions = {
//     '/dashboard': ['admin', 'directeur', 'technicien', 'secretary', 'user'],
//     '/fournisseurs': ['admin', 'secretary'],
//     '/materiels': ['admin', 'secretary', 'user'],
//     '/logiciels': ['admin', 'user'],
//     '/installations-logiciels': ['admin', 'user'],
//     '/configuration-reseau': ['admin', 'technicien', 'user'],
//     '/incidents': ['admin', 'technicien', 'user'],
//     '/alertes': ['admin', 'technicien'],
//     '/reparations': ['admin', 'technicien'],
//     '/rapports': ['admin', 'directeur', 'secretary'],
//     '/profils-utilisateurs': ['admin']
//   };
  
//   const roles = pagePermissions[pagePath] || ['admin'];
//   return roles.map(role => {
//     switch(role) {
//       case 'admin': return 'Admin';
//       case 'directeur': return 'Directeur';
//       case 'technicien': return 'Technicien';
//       case 'secretary': return 'Secrétaire';
//       case 'user': return 'Utilisateur';
//       default: return role;
//     }
//   }).join(', ');
// };

// export default Layout;













































// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   Monitor, 
//   AlertTriangle, 
//   Wrench, 
//   BarChart3, 
//   LogOut, 
//   User,
//   Menu,
//   X,
//   Users,
//   Network,
//   Bell,
//   Package,
//   Cpu,
//   MapPin,
//   Phone,
//   Mail,
//   FileText
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Import de l'image JPEG depuis le dossier src
// import logoDren from '../assets/images/logo-dren.jpeg';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [logoError, setLogoError] = useState(false);

//   // Configuration des tailles d'image
//   const logoConfig = {
//     header: {
//       container: 'h-[70px] w-[160px]',
//       image: 'w-full h-full',
//     },
//     footer: {
//       container: 'h-[120px] w-[160px]',
//       image: 'w-full h-full',
//     }
//   };

//   // Tous les menus (affichés pour tous)
//   const allNavigation = [
//     { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
//     { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
//     { name: 'Matériels', href: '/materiels', icon: Monitor },
//     { name: 'Logiciels', href: '/logiciels', icon: Package },
//     { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
//     { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//     { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//     { name: 'Alertes', href: '/alertes', icon: Bell },
//     { name: 'Réparations', href: '/reparations', icon: Wrench },
//     { name: 'Rapports', href: '/rapports', icon: FileText },
//     { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
//   ];

//   // Permissions par rôle (qui peut accéder à quoi)
//   const getPermissionsByRole = () => {
//     if (!user || !user.role) return [];
    
//     const role = user.role.toLowerCase();
    
//     const permissions = {
//       // Administrateur accède à TOUT
//       admin: allNavigation.map(item => item.href),
      
//       // Directeur pour rapport + dashboard
//       directeur: ['/dashboard', '/rapports'],
      
//       // Secrétaire pour fournisseur + rapport + matériels
//       secretary: ['/dashboard', '/fournisseurs', '/materiels', '/rapports'],
      
//       // Technicien pour alerte, reparation, incidents, configuration réseau
//       technicien: [
//         '/dashboard', 
//         '/alertes', 
//         '/reparations', 
//         '/incidents', 
//         '/configuration-reseau'
//       ],
      
//       // Utilisateur pour materiel, logiciel, installation logiciel, configuration reseau et incident
//       user: [
//         '/dashboard',
//         '/materiels',
//         '/logiciels',
//         '/installations-logiciels',
//         '/configuration-reseau',
//         '/incidents'
//       ]
//     };

//     // Si rôle non trouvé, utiliser user par défaut
//     return permissions[role] || permissions.user;
//   };

//   // Vérifier si l'utilisateur a accès à une page spécifique
//   const hasPermission = (pagePath) => {
//     if (!user) return false;
    
//     // Admin a toujours accès à tout
//     if (user.role?.toLowerCase() === 'admin') return true;
    
//     // Vérifier si la page est dans les permissions
//     const allowedPages = getPermissionsByRole();
//     return allowedPages.includes(pagePath);
//   };

//   // Gérer le clic sur un menu (vérifier les permissions)
//   const handleMenuClick = (href, e) => {
//     if (!hasPermission(href)) {
//       e.preventDefault();
//       e.stopPropagation();
      
//       // Message d'alerte
//       alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
//     }
//   };

//   const isActive = (path) => location.pathname === path;

//   const getRoleBadgeColor = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'badge-error bg-red-600';
//       case 'directeur': return 'badge-primary bg-blue-600';
//       case 'technicien': return 'badge-warning bg-yellow-600';
//       case 'secretary': return 'badge-success bg-green-600';
//       case 'user': return 'badge-info bg-blue-400';
//       default: return 'badge-neutral bg-gray-600';
//     }
//   };

//   const getRoleText = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'Administrateur';
//       case 'directeur': return 'Directeur';
//       case 'technicien': return 'Technicien IT';
//       case 'secretary': return 'Secrétaire';
//       case 'user': return 'Utilisateur';
//       default: return role || 'Utilisateur';
//     }
//   };

//   const getFullName = () => {
//     if (user?.full_name) return user.full_name;
//     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
//     return user?.username || 'Utilisateur';
//   };

//   const getDepartement = () => {
//     return user?.departement || user?.service || 'Département non défini';
//   };

//   // Vérifier les permissions pour la page actuelle
//   React.useEffect(() => {
//     if (user && !hasPermission(location.pathname) && location.pathname !== '/') {
//       // Rediriger vers le dashboard si pas de permission
//       navigate('/dashboard');
//       alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
//     }
//   }, [location.pathname, user, navigate]);

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* Header - SANS BORDURES BLANCHES */}
//       <header className="bg-gradient-to-r from-green-800 to-green-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               {/* Logo DREN sans bordure blanche */}
//               <div className={`mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
//                 {!logoError ? (
//                   <img 
//                     src={logoDren}
//                     alt="Logo DREN Antsimo Andrefana" 
//                     className={`object-contain ${logoConfig.header.image}`}
//                     onError={() => setLogoError(true)}
//                   />
//                 ) : (
//                   <Monitor className="h-6 w-6 text-green-600" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white">
//                   DREN Antsimo A
//                 </h1>
//                 <p className="text-xs text-green-200">Gestion des Ressources IT</p>
//               </div>
//             </div>

//             {/* Desktop Navigation - TOUS les menus affichés */}
//             <nav className="hidden md:flex space-x-2">
//               {allNavigation.map((item) => {
//                 const Icon = item.icon;
//                 const hasAccess = hasPermission(item.href);
                
//                 return (
//                   <div key={item.name} className="relative group">
//                     <Link
//                       to={hasAccess ? item.href : '#'}
//                       onClick={(e) => !hasAccess && handleMenuClick(item.href, e)}
//                       className={`flex items-center px-3 py-2 text-sm font-medium transition-colors relative ${
//                         isActive(item.href)
//                           ? 'text-white'
//                           : hasAccess 
//                             ? 'text-green-100 hover:text-white'
//                             : 'text-green-300 opacity-60 cursor-not-allowed'
//                       }`}
//                     >
//                       <Icon className="w-4 h-4 mr-2" />
//                       {item.name}
//                       {!hasAccess && (
//                         <span className="ml-1 text-xs">🔒</span>
//                       )}
//                     </Link>
                    
//                     {/* Tooltip pour indiquer les permissions manquantes */}
//                     {!hasAccess && (
//                       <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
//                         <div className="bg-red-900 text-white text-xs py-1 px-2 whitespace-nowrap">
//                           🚫 Accès réservé aux: {getAllowedRolesForPage(item.href)}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </nav>

//             {/* User Menu */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:flex items-center text-sm text-white">
//                 <User className="w-4 h-4 mr-2" />
//                 <div className="flex flex-col items-end">
//                   <span className="font-medium">{getFullName()}</span>
//                   <span className="text-xs text-green-200">{getDepartement()}</span>
//                 </div>
//                 <div className={`ml-2 badge ${getRoleBadgeColor(user?.role)} badge-sm text-white`}>
//                   {getRoleText(user?.role)}
//                 </div>
//               </div>
//               <button
//                 onClick={logout}
//                 className="flex items-center text-green-100 hover:text-white transition-colors p-2 hover:bg-green-700"
//                 title="Se déconnecter"
//               >
//                 <LogOut className="w-4 h-4" />
//               </button>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-2 text-green-100 hover:bg-green-700"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden bg-green-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {allNavigation.map((item) => {
//                 const Icon = item.icon;
//                 const hasAccess = hasPermission(item.href);
                
//                 return (
//                   <div key={item.name} className="relative">
//                     <Link
//                       to={hasAccess ? item.href : '#'}
//                       onClick={(e) => {
//                         setIsMobileMenuOpen(false);
//                         if (!hasAccess) {
//                           e.preventDefault();
//                           alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
//                         }
//                       }}
//                       className={`flex items-center px-3 py-2 text-base font-medium ${
//                         isActive(item.href)
//                           ? 'text-white'
//                           : hasAccess 
//                             ? 'text-green-100 hover:text-white'
//                             : 'text-green-300 opacity-60 cursor-not-allowed'
//                       }`}
//                     >
//                       <Icon className="w-5 h-5 mr-3" />
//                       {item.name}
//                       {!hasAccess && (
//                         <span className="ml-auto text-xs">🔒</span>
//                       )}
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Bandeau d'information sur les permissions - SANS BORDURES BLANCHES */}
//         {user && (
//           <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Bienvenue, {getFullName()}!
//                 </h2>
//                 <p className="text-gray-600">
//                   Rôle : <span className={`font-bold ${getRoleBadgeColor(user.role)} text-white px-2 py-1`}>
//                     {getRoleText(user.role)}
//                   </span>
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Pages accessibles : {getPermissionsByRole().length} / {allNavigation.length}
//                 </p>
//               </div>
//               <div className="mt-2 md:mt-0">
//                 <div className="flex items-center space-x-2">
//                   <div className="text-sm text-gray-600">
//                     <span className="font-medium">Département:</span> {getDepartement()}
//                   </div>
//                   <div className="text-xs text-gray-600 px-2 py-1">
//                     {user?.telephone || 'Tél: Non défini'}
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Les pages verrouillées <span className="text-xs">🔒</span> ne sont pas accessibles
//                 </p>
//               </div>
//             </div>
            
//             {/* Légende des permissions - SANS BORDURES BLANCHES */}
//             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//               <div>
//                 <span className="font-medium text-green-600">✅ Pages accessibles :</span>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {allNavigation
//                     .filter(item => hasPermission(item.href))
//                     .map(item => (
//                       <span key={item.name} className="text-green-800 px-2 py-1 text-xs">
//                         {item.name}
//                       </span>
//                     ))
//                   }
//                 </div>
//               </div>
//               <div>
//                 <span className="font-medium text-red-600">⛔ Pages restreintes :</span>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {allNavigation
//                     .filter(item => !hasPermission(item.href))
//                     .map(item => (
//                       <span key={item.name} className="text-red-800 px-2 py-1 text-xs">
//                         {item.name}
//                       </span>
//                     ))
//                   }
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Contenu principal - SANS BORDURES BLANCHES */}
//         <div className="p-6">
//           {children}
//         </div>
//       </main>

//       {/* Footer - SANS BORDURES BLANCHES */}
//       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-start">
//               {/* Logo DREN - SANS BORDURE BLANCHE */}
//               <div className={`mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
//                 <img 
//                   src={logoDren}
//                   alt="Logo DREN" 
//                   className={`object-contain ${logoConfig.footer.image}`}
//                 />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
//                 <p className="text-green-200 text-sm">
//                   Direction Régionale de l'Éducation Nationale
//                 </p>
//                 <p className="text-green-200 text-sm">
//                   Région Atsimo Andrefana, Madagascar
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <div className="space-y-2 text-sm text-green-200">
//                 <div className="flex items-center">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span>Toliara, Madagascar</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>+261 94 xxx xx xx</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span>drenetp@gmail.com</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Système</h3>
//               <p className="text-green-200 text-sm">
//                 Système de Gestion des Ressources Informatiques
//               </p>
//               <p className="text-green-200 text-sm">

//               </p>
//             </div>
//           </div>
//           <div className="mt-8 pt-4 text-center text-sm text-green-300">
//             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // Fonction utilitaire pour déterminer quels rôles ont accès à une page
// const getAllowedRolesForPage = (pagePath) => {
//   const pagePermissions = {
//     '/dashboard': ['admin', 'directeur', 'technicien', 'secretary', 'user'],
//     '/fournisseurs': ['admin', 'secretary'],
//     '/materiels': ['admin', 'secretary', 'user'],
//     '/logiciels': ['admin', 'user'],
//     '/installations-logiciels': ['admin', 'user'],
//     '/configuration-reseau': ['admin', 'technicien', 'user'],
//     '/incidents': ['admin', 'technicien', 'user'],
//     '/alertes': ['admin', 'technicien'],
//     '/reparations': ['admin', 'technicien'],
//     '/rapports': ['admin', 'directeur', 'secretary'],
//     '/profils-utilisateurs': ['admin']
//   };
  
//   const roles = pagePermissions[pagePath] || ['admin'];
//   return roles.map(role => {
//     switch(role) {
//       case 'admin': return 'Admin';
//       case 'directeur': return 'Directeur';
//       case 'technicien': return 'Technicien';
//       case 'secretary': return 'Secrétaire';
//       case 'user': return 'Utilisateur';
//       default: return role;
//     }
//   }).join(', ');
// };

// export default Layout;



// mon vraie code fonctionne bien ffffffffffff



import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  AlertTriangle, 
  Wrench, 
  BarChart3, 
  LogOut, 
  User,
  Menu,
  X,
  Users,
  Network,
  Bell,
  Package,
  Cpu,
  MapPin,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Import de l'image JPEG depuis le dossier src
import logoDren from '../assets/images/logo-dren.jpeg';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Configuration des tailles d'image
  const logoConfig = {
    header: {
      container: 'h-[70px] w-[160px]',
      image: 'w-full h-full',
    },
    footer: {
      container: 'h-[120px] w-[160px]',
      image: 'w-full h-full',
    }
  };

  // Tous les menus (affichés pour tous)
  const allNavigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
    { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
    { name: 'Matériels', href: '/materiels', icon: Monitor },
    { name: 'Logiciels', href: '/logiciels', icon: Package },
    { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
    { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
    { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
    { name: 'Alertes', href: '/alertes', icon: Bell },
    { name: 'Réparations', href: '/reparations', icon: Wrench },
    { name: 'Rapports', href: '/rapports', icon: FileText },
    { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
  ];

  // Permissions par rôle (qui peut accéder à quoi)
  const getPermissionsByRole = () => {
    if (!user || !user.role) return [];
    
    const role = user.role.toLowerCase();
    
    const permissions = {
      // Administrateur accède à TOUT
      admin: allNavigation.map(item => item.href),
      
      // Directeur pour rapport + dashboard
      director: ['/dashboard', '/rapports','/profils-utilisateurs'],
      
      // Secrétaire pour fournisseur + rapport + matériels
      secretary: ['/dashboard', '/fournisseurs', '/rapports','/profils-utilisateurs'],
      
      // Technicien pour alerte, reparation, incidents, configuration réseau
      technician: [
        '/dashboard', 
        '/alertes', 
        '/reparations', 
        '/profils-utilisateurs'
        // '/configuration-reseau'
      ],
      
      // Utilisateur pour materiel, logiciel, installation logiciel, configuration reseau et incident
      user: [
        '/dashboard',
        '/materiels',
        '/logiciels',
        '/installations-logiciels',
        '/configuration-reseau',
        '/incidents',
        '/profils-utilisateurs'
      ]
    };

    // Si rôle non trouvé, utiliser user par défaut
    return permissions[role] || permissions.user;
  };

  // Vérifier si l'utilisateur a accès à une page spécifique
  const hasPermission = (pagePath) => {
    if (!user) return false;
    
    // Admin a toujours accès à tout
    if (user.role?.toLowerCase() === 'admin') return true;
    
    // Vérifier si la page est dans les permissions
    const allowedPages = getPermissionsByRole();
    return allowedPages.includes(pagePath);
  };

  // Gérer le clic sur un menu (vérifier les permissions)
  const handleMenuClick = (href, e) => {
    if (!hasPermission(href)) {
      e.preventDefault();
      e.stopPropagation();
      
      // Message d'alerte
      alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
    }
  };

  const isActive = (path) => location.pathname === path;

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'badge-error bg-red-600';
      case 'director': return 'badge-primary bg-blue-600';
      case 'technician': return 'badge-warning bg-yellow-600';
      case 'secretary': return 'badge-success bg-green-600';
      case 'user': return 'badge-info bg-blue-400';
      default: return 'badge-neutral bg-gray-600';
    }
  };

  const getRoleText = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'Administrateur';
      case 'director': return 'Directeur';
      case 'technician': return 'Technicien IT';
      case 'secretary': return 'Secrétaire';
      case 'user': return 'Utilisateur';
      default: return role || 'Utilisateur';
    }
  };

  const getFullName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
    return user?.username || 'Utilisateur';
  };

  const getDepartement = () => {
    return user?.departement || user?.service || 'Département non défini';
  };

  // Vérifier les permissions pour la page actuelle
  React.useEffect(() => {
    // if (user && !hasPermission(location.pathname) && location.pathname !== '/') {
    //   // Rediriger vers le dashboard si pas de permission
    //   navigate('/dashboard');
    //   alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
    // }
  }, [location.pathname, user, navigate]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header - SANS BORDURES BLANCHES */}
      <header className="bg-gradient-to-r from-green-800 to-green-900">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Logo DREN sans bordure blanche */}
              <div className={`mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
                {!logoError ? (
                  <img 
                    src={logoDren}
                    alt="Logo DREN Antsimo Andrefana" 
                    className={`object-contain ${logoConfig.header.image}`}
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Monitor className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  DREN Antsimo Andrefana
                </h1>
                <p className="text-xs text-green-200">Gestion des Ressources Informatiques</p>
              </div>
            </div>

            {/* Desktop Navigation - TOUS les menus affichés */}
            <nav className="hidden md:flex space-x-2">
              {allNavigation.map((item) => {
                const Icon = item.icon;
                const hasAccess = hasPermission(item.href);
                
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      to={hasAccess ? item.href : '#'}
                      onClick={(e) => !hasAccess && handleMenuClick(item.href, e)}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors relative ${
                        isActive(item.href)
                          ? 'text-white'
                          : hasAccess 
                            ? 'text-green-100 hover:text-white'
                            : 'text-green-300 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                      {!hasAccess && (
                        <span className="ml-1 text-xs">🔒</span>
                      )}
                    </Link>
                    
                    {/* Tooltip pour indiquer les permissions manquantes */}
                    {!hasAccess && (
                      <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                        <div className="bg-red-900 text-white text-xs py-1 px-2 whitespace-nowrap">
                          🚫 Accès réservé aux: {getAllowedRolesForPage(item.href)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-sm text-white">
                <User className="w-4 h-4 mr-2" />
                <div className="flex flex-col items-end">
                  <span className="font-medium">{getFullName()}</span>
                  <span className="text-xs text-green-200">{getDepartement()}</span>
                </div>
                <div className={`ml-2 badge ${getRoleBadgeColor(user?.role)} badge-sm text-white`}>
                  {getRoleText(user?.role)}
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-green-100 hover:text-white transition-colors p-2 hover:bg-green-700"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-green-100 hover:bg-green-700"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-green-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {allNavigation.map((item) => {
                const Icon = item.icon;
                const hasAccess = hasPermission(item.href);
                
                return (
                  <div key={item.name} className="relative">
                    <Link
                      to={hasAccess ? item.href : '#'}
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);
                        if (!hasAccess) {
                          e.preventDefault();
                          alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
                        }
                      }}
                      className={`flex items-center px-3 py-2 text-base font-medium ${
                        isActive(item.href)
                          ? 'text-white'
                          : hasAccess 
                            ? 'text-green-100 hover:text-white'
                            : 'text-green-300 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                      {!hasAccess && (
                        <span className="ml-auto text-xs">🔒</span>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Bandeau d'information sur les permissions - SANS BORDURES BLANCHES */}
        {user && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-800/10 to-green-900/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Bienvenue, {getFullName()}!
                </h2>
                <p className="text-gray-600">
                  Rôle : <span className={`font-bold ${getRoleBadgeColor(user.role)} text-white px-2 py-1`}>
                    {getRoleText(user.role)}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Pages accessibles : {getPermissionsByRole().length} / {allNavigation.length}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Département:</span> {getDepartement()}
                  </div>
                  <div className="text-xs text-gray-600 px-2 py-1">
                    {user?.telephone || 'Tél: Non défini'}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Les pages verrouillées <span className="text-xs">🔒</span> ne sont pas accessibles
                </p>
              </div>
            </div>
            
            {/* Légende des permissions - SANS BORDURES BLANCHES */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-green-600">✅ Pages accessibles :</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {allNavigation
                    .filter(item => hasPermission(item.href))
                    .map(item => (
                      <span key={item.name} className="text-green-800 px-2 py-1 text-xs">
                        {item.name}
                      </span>
                    ))
                  }
                </div>
              </div>
              <div>
                <span className="font-medium text-red-600">⛔ Pages restreintes :</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {allNavigation
                    .filter(item => !hasPermission(item.href))
                    .map(item => (
                      <span key={item.name} className="text-red-800 px-2 py-1 text-xs">
                        {item.name}
                      </span>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenu principal - SANS BORDURES BLANCHES */}
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Footer - SANS BORDURES BLANCHES */}
      <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start">
              {/* Logo DREN - SANS BORDURE BLANCHE */}
              <div className={`mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
                <img 
                  src={logoDren}
                  alt="Logo DREN" 
                  className={`object-contain ${logoConfig.footer.image}`}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
                <p className="text-green-200 text-sm">
                  Direction Régionale de l'Éducation Nationale
                </p>
                <p className="text-green-200 text-sm">
                  Région Atsimo Andrefana, Madagascar
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-green-200">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Toliara, Madagascar</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+261 94 xxx xx xx</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>drenetp@gmail.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Système</h3>
              <p className="text-green-200 text-sm">
                Système de Gestion des Ressources Informatiques
              </p>
              <p className="text-green-200 text-sm">

              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 text-center text-sm text-green-300">
            <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Fonction utilitaire pour déterminer quels rôles ont accès à une page
const getAllowedRolesForPage = (pagePath) => {
  const pagePermissions = {
    '/dashboard': ['admin', 'director', 'technician', 'secretary', 'user'],
    '/fournisseurs': ['admin', 'secretary'],
    '/materiels': ['admin', 'secretary', 'user'],
    '/logiciels': ['admin', 'user'],
    '/installations-logiciels': ['admin', 'user'],
    '/configuration-reseau': ['admin', 'user'],
    '/incidents': ['admin', 'user'],
    '/alertes': ['admin', 'technician'],
    '/reparations': ['admin', 'technician'],
    '/rapports': ['admin', 'director', 'secretary'],
    '/profils-utilisateurs': ['admin']
  };
  
  const roles = pagePermissions[pagePath] || ['admin'];
  return roles.map(role => {
    switch(role) {
      case 'admin': return 'Admin';
      case 'director': return 'Directeur';
      case 'technician': return 'Technician';
      case 'secretary': return 'Secrétaire';
      case 'user': return 'Utilisateur';
      default: return role;
    }
  }).join(', ');
};

export default Layout;