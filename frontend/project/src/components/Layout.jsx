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






// };import React, { useState } from 'react'; // IMPORT CORRIGÉ - useState doit être importé de React
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Shield,
  Settings,
  Briefcase,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Import de l'image JPEG depuis le dossier src
import logoDren from '../assets/images/logo-dren.jpeg';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

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

  // Navigation de base accessible à tous les utilisateurs connectés
  const baseNavigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
    { name: 'Matériels', href: '/materiels', icon: Monitor },
    { name: 'Logiciels', href: '/logiciels', icon: Package },
    { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
    { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
  ];

  // Navigation pour les secrétaires et au-dessus
  const secretaryNavigation = [
    { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
    { name: 'Rapports', href: '/rapports', icon: FileText },
  ];

  // Navigation pour les techniciens et au-dessus
  const technicianNavigation = [
    { name: 'Réparations', href: '/reparations', icon: Wrench },
    { name: 'Alertes', href: '/alertes', icon: Bell },
    { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
    { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
  ];

  // Navigation pour les administrateurs et directeurs
  const adminNavigation = [
    // { name: 'Utilisateurs', href: '/users', icon: Users },
  ];

  // Fonction pour vérifier les permissions
  const hasPermission = (requiredRole) => {
    const roleHierarchy = {
      'user': 1,
      'secretary': 2,
      'technician': 3,
      'director': 4,
      'admin': 5
    };
    const userRole = user?.role || 'user';
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };

  // Combiner la navigation en fonction du rôle
  const getNavigation = () => {
    let navigation = [...baseNavigation];
    
    if (hasPermission('secretary')) {
      navigation = [...navigation, ...secretaryNavigation];
    }
    
    if (hasPermission('technician')) {
      navigation = [...navigation, ...technicianNavigation];
    }
    
    if (hasPermission('director')) {
      navigation = [...navigation, ...adminNavigation];
    }
    
    return navigation;
  };

  const navigation = getNavigation();

  const isActive = (path) => location.pathname === path;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-error bg-red-500 text-white';
      case 'director': return 'badge-warning bg-orange-500 text-white';
      case 'technician': return 'badge-info bg-blue-500 text-white';
      case 'secretary': return 'badge-success bg-green-500 text-white';
      case 'user': return 'badge-neutral bg-gray-500 text-white';
      default: return 'badge-neutral bg-gray-400 text-white';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'director': return 'Directeur';
      case 'technician': return 'Technicien';
      case 'secretary': return 'Secrétaire';
      case 'user': return 'Utilisateur';
      default: return role;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'director': return <Briefcase className="w-4 h-4" />;
      case 'technician': return <Settings className="w-4 h-4" />;
      case 'secretary': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg border-b border-green-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Logo DREN avec fallback */}
              <div className={`bg-white p-1 rounded-lg mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
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
                  DREN Antsimo A
                </h1>
                <p className="text-xs text-green-200">Gestion des Ressources IT</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-green-700 text-white shadow-inner'
                        : 'text-green-100 hover:bg-green-700 hover:text-white'
                    }`}
                    title={item.name}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3 text-sm text-white">
                <div className="flex items-center space-x-2 bg-green-700/50 px-3 py-1 rounded-full">
                  {getRoleIcon(user?.role)}
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-xs">{user?.name || user?.username}</span>
                    <span className={`badge ${getRoleBadgeColor(user?.role)} badge-xs`}>
                      {getRoleText(user?.role)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center text-green-100 hover:text-white transition-colors p-2 rounded-md hover:bg-green-700 group"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-green-100 hover:bg-green-700"
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
          <div className="md:hidden border-t border-green-700 bg-green-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Informations utilisateur dans le menu mobile */}
              <div className="px-3 py-2 border-b border-green-700 mb-2">
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">{user?.name || user?.username}</div>
                    <div className={`badge ${getRoleBadgeColor(user?.role)} badge-xs mt-1`}>
                      {getRoleText(user?.role)}
                    </div>
                  </div>
                </div>
              </div>

              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? 'bg-green-700 text-white'
                        : 'text-green-100 hover:bg-green-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        {/* Indicateur de rôle en haut de page (optionnel) */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Connecté en tant que :</span>
            <span className={`badge ${getRoleBadgeColor(user?.role)}`}>
              {getRoleText(user?.role)}
            </span>
          </div>
          {user?.departement && (
            <div className="text-sm text-gray-500">
              Département : <span className="font-medium">{user.departement}</span>
            </div>
          )}
        </div>
        
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start">
              {/* Logo DREN - TAILLE FOOTER */}
              <div className={`bg-white rounded p-1 mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
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
                  <span>contact@dren-antsimo-andrefana.mg</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Système</h3>
              <p className="text-green-200 text-sm mb-2">
                Gestion des Ressources Informatiques
              </p>
              <div className="flex items-center space-x-2 text-green-300 text-xs">
                <span>Utilisateur :</span>
                <span className={`badge ${getRoleBadgeColor(user?.role)} badge-sm`}>
                  {getRoleText(user?.role)}
                </span>
              </div>
              <p className="text-green-300 text-xs mt-2">Version 1.0</p>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm text-green-300">
            <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;


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