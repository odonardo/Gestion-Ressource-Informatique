


// // // import React, { useState } from 'react';
// // // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // // import { 
// // //   Monitor, 
// // //   AlertTriangle, 
// // //   Wrench, 
// // //   BarChart3, 
// // //   LogOut, 
// // //   User,
// // //   Menu,
// // //   X,
// // //   Users,
// // //   Network,
// // //   Bell,
// // //   Package,
// // //   Cpu,
// // //   MapPin,
// // //   Phone,
// // //   Mail,
// // //   FileText
// // // } from 'lucide-react';
// // // import { useAuth } from '../context/AuthContext';

// // // // Import de l'image JPEG depuis le dossier src
// // import logoDren from '../assets/images/logo-dren.jpeg';

// // // const Layout = ({ children }) => {
// // //   const { user, logout } = useAuth();
// // //   const location = useLocation();
// // //   const navigate = useNavigate();
// // //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// // //   const [logoError, setLogoError] = useState(false);

// // //   // Configuration des tailles d'image
// // //   const logoConfig = {
// // //     header: {
// // //       container: 'h-[70px] w-[160px]',
// // //       image: 'w-full h-full',
// // //     },
// // //     footer: {
// // //       container: 'h-[120px] w-[160px]',
// // //       image: 'w-full h-full',
// // //     }
// // //   };

// // //   // Tous les menus (affichés pour tous)
// // //   const allNavigation = [
// // //     { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
// // //     { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
// // //     { name: 'Matériels', href: '/materiels', icon: Monitor },
// // //     { name: 'Logiciels', href: '/logiciels', icon: Package },
// // //     { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
// // //     { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
// // //     { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
// // //     { name: 'Alertes', href: '/alertes', icon: Bell },
// // //     { name: 'Réparations', href: '/reparations', icon: Wrench },
// // //     { name: 'Rapports', href: '/rapports', icon: FileText },
// // //     { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
// // //     { name: 'Historique', href: '/historique', icon: FileText },
// // //   ];

// // //   // Permissions par rôle (qui peut accéder à quoi)
// // //   const getPermissionsByRole = () => {
// // //     if (!user || !user.role) return [];
    
// // //     const role = user.role.toLowerCase();
    
// // //     const permissions = {
// // //       // Administrateur accède à TOUT
// // //       admin: allNavigation.map(item => item.href),
      
// // //       // Directeur pour rapport + dashboard
// // //       director: ['/dashboard', '/rapports','/profils-utilisateurs'],
      
// // //       // Secrétaire pour fournisseur + rapport + matériels
// // //       secretary: ['/dashboard', '/fournisseurs', '/rapports','/profils-utilisateurs'],
      
// // //       // Technicien pour alerte, reparation, incidents, configuration réseau
// // //       technician: [
// // //         '/dashboard', 
// // //         '/alertes', 
// // //         '/reparations', 
// // //         '/profils-utilisateurs'
// // //         // '/configuration-reseau'
// // //       ],
      
// // //       // Utilisateur pour materiel, logiciel, installation logiciel, configuration reseau et incident
// // //       user: [
// // //         '/dashboard',
// // //         '/materiels',
// // //         '/logiciels',
// // //         '/installations-logiciels',
// // //         '/configuration-reseau',
// // //         '/incidents',
// // //         '/profils-utilisateurs'
// // //       ]
// // //     };

// // //     // Si rôle non trouvé, utiliser user par défaut
// // //     return permissions[role] || permissions.user;
// // //   };

// // //   // Vérifier si l'utilisateur a accès à une page spécifique
// // //   const hasPermission = (pagePath) => {
// // //     if (!user) return false;
    
// // //     // Admin a toujours accès à tout
// // //     if (user.role?.toLowerCase() === 'admin') return true;
    
// // //     // Vérifier si la page est dans les permissions
// // //     const allowedPages = getPermissionsByRole();
// // //     return allowedPages.includes(pagePath);
// // //   };

// // //   // Gérer le clic sur un menu (vérifier les permissions)
// // //   const handleMenuClick = (href, e) => {
// // //     if (!hasPermission(href)) {
// // //       e.preventDefault();
// // //       e.stopPropagation();
      
// // //       // Message d'alerte
// // //       alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
// // //     }
// // //   };

// // //   const isActive = (path) => location.pathname === path;

// // //   const getRoleBadgeColor = (role) => {
// // //     switch (role?.toLowerCase()) {
// // //       case 'admin': return 'badge-error bg-red-600';
// // //       case 'director': return 'badge-primary bg-blue-600';
// // //       case 'technician': return 'badge-warning bg-yellow-600';
// // //       case 'secretary': return 'badge-success bg-green-600';
// // //       case 'user': return 'badge-info bg-blue-400';
// // //       default: return 'badge-neutral bg-gray-600';
// // //     }
// // //   };

// // //   const getRoleText = (role) => {
// // //     switch (role?.toLowerCase()) {
// // //       case 'admin': return 'Administrateur';
// // //       case 'director': return 'Directeur';
// // //       case 'technician': return 'Technicien IT';
// // //       case 'secretary': return 'Secrétaire';
// // //       case 'user': return 'Utilisateur';
// // //       default: return role || 'Utilisateur';
// // //     }
// // //   };

// // //   const getFullName = () => {
// // //     if (user?.full_name) return user.full_name;
// // //     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
// // //     return user?.username || 'Utilisateur';
// // //   };

// // //   const getDepartement = () => {
// // //     return user?.departement || user?.service || 'Département non défini';
// // //   };

// // //   // Vérifier les permissions pour la page actuelle
// // //   React.useEffect(() => {
// // //     // if (user && !hasPermission(location.pathname) && location.pathname !== '/') {
// // //     //   // Rediriger vers le dashboard si pas de permission
// // //     //   navigate('/dashboard');
// // //     //   alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
// // //     // }
// // //   }, [location.pathname, user, navigate]);

// // //   return (
// // //     <div className="min-h-screen bg-base-100">
// // //       {/* Header - SANS BORDURES BLANCHES */}
// // //       <header className="bg-gradient-to-r from-green-800 to-green-900">
// // //         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
// // //           <div className="flex justify-between items-center h-16">
// // //             <div className="flex items-center">
// // //               {/* Logo DREN sans bordure blanche */}
// // //               <div className={`mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
// // //                 {!logoError ? (
// // //                   <img 
// // //                     src={logoDren}
// // //                     alt="Logo DREN Antsimo Andrefana" 
// // //                     className={`object-contain ${logoConfig.header.image}`}
// // //                     onError={() => setLogoError(true)}
// // //                   />
// // //                 ) : (
// // //                   <Monitor className="h-6 w-6 text-green-600" />
// // //                 )}
// // //               </div>
// // //               <div>
// // //                 <h1 className="text-lg font-bold text-white">
// // //                   DREN Antsimo Andrefana
// // //                 </h1>
// // //                 <p className="text-xs text-green-200">Gestion des Ressources Informatiques</p>
// // //               </div>
// // //             </div>

// // //             {/* Desktop Navigation - TOUS les menus affichés */}
// // //             <nav className="hidden md:flex space-x-2">
// // //               {allNavigation.map((item) => {
// // //                 const Icon = item.icon;
// // //                 const hasAccess = hasPermission(item.href);
                
// // //                 return (
// // //                   <div key={item.name} className="relative group">
// // //                     <Link
// // //                       to={hasAccess ? item.href : '#'}
// // //                       onClick={(e) => !hasAccess && handleMenuClick(item.href, e)}
// // //                       className={`flex items-center px-3 py-2 text-sm font-medium transition-colors relative ${
// // //                         isActive(item.href)
// // //                           ? 'text-white'
// // //                           : hasAccess 
// // //                             ? 'text-green-100 hover:text-white'
// // //                             : 'text-green-300 opacity-60 cursor-not-allowed'
// // //                       }`}
// // //                     >
// // //                       <Icon className="w-4 h-4 mr-2" />
// // //                       {item.name}
// // //                       {!hasAccess && (
// // //                         <span className="ml-1 text-xs">🔒</span>
// // //                       )}
// // //                     </Link>
                    
// // //                     {/* Tooltip pour indiquer les permissions manquantes */}
// // //                     {!hasAccess && (
// // //                       <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
// // //                         <div className="bg-red-900 text-white text-xs py-1 px-2 whitespace-nowrap">
// // //                           🚫 Accès réservé aux: {getAllowedRolesForPage(item.href)}
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 );
// // //               })}
// // //             </nav>

// // //             {/* User Menu */}
// // //             <div className="flex items-center space-x-4">
// // //               <div className="hidden md:flex items-center text-sm text-white">
// // //                 <User className="w-4 h-4 mr-2" />
// // //                 <div className="flex flex-col items-end">
// // //                   <span className="font-medium">{getFullName()}</span>
// // //                   <span className="text-xs text-green-200">{getDepartement()}</span>
// // //                 </div>
// // //                 <div className={`ml-2 badge ${getRoleBadgeColor(user?.role)} badge-sm text-white`}>
// // //                   {getRoleText(user?.role)}
// // //                 </div>
// // //               </div>
// // //               <button
// // //                 onClick={logout}
// // //                 className="flex items-center text-green-100 hover:text-white transition-colors p-2 hover:bg-green-700"
// // //                 title="Se déconnecter"
// // //               >
// // //                 <LogOut className="w-4 h-4" />
// // //               </button>

// // //               {/* Mobile menu button */}
// // //               <button
// // //                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
// // //                 className="md:hidden p-2 text-green-100 hover:bg-green-700"
// // //               >
// // //                 {isMobileMenuOpen ? (
// // //                   <X className="w-5 h-5" />
// // //                 ) : (
// // //                   <Menu className="w-5 h-5" />
// // //                 )}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Mobile Navigation */}
// // //         {isMobileMenuOpen && (
// // //           <div className="md:hidden bg-green-800">
// // //             <div className="px-2 pt-2 pb-3 space-y-1">
// // //               {allNavigation.map((item) => {
// // //                 const Icon = item.icon;
// // //                 const hasAccess = hasPermission(item.href);
                
// // //                 return (
// // //                   <div key={item.name} className="relative">
// // //                     <Link
// // //                       to={hasAccess ? item.href : '#'}
// // //                       onClick={(e) => {
// // //                         setIsMobileMenuOpen(false);
// // //                         if (!hasAccess) {
// // //                           e.preventDefault();
// // //                           alert(`🚫 ACCÈS REFUSÉ\n\nVotre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.\n\nPour y accéder, contactez votre administrateur.`);
// // //                         }
// // //                       }}
// // //                       className={`flex items-center px-3 py-2 text-base font-medium ${
// // //                         isActive(item.href)
// // //                           ? 'text-white'
// // //                           : hasAccess 
// // //                             ? 'text-green-100 hover:text-white'
// // //                             : 'text-green-300 opacity-60 cursor-not-allowed'
// // //                       }`}
// // //                     >
// // //                       <Icon className="w-5 h-5 mr-3" />
// // //                       {item.name}
// // //                       {!hasAccess && (
// // //                         <span className="ml-auto text-xs">🔒</span>
// // //                       )}
// // //                     </Link>
// // //                   </div>
// // //                 );
// // //               })}
// // //             </div>
// // //           </div>
// // //         )}
// // //       </header>

// // //       {/* Main Content */}
// // //       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
// // //         {/* Bandeau d'information sur les permissions - SANS BORDURES BLANCHES */}
// // //         {user && (
// // //           <div className="mb-6 p-4 bg-gradient-to-r from-green-800/10 to-green-900/10">
// // //             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
// // //               <div>
// // //                 <h2 className="text-xl font-semibold text-gray-800">
// // //                   Bienvenue, {getFullName()}!
// // //                 </h2>
// // //                 <p className="text-gray-600">
// // //                   Rôle : <span className={`font-bold ${getRoleBadgeColor(user.role)} text-white px-2 py-1`}>
// // //                     {getRoleText(user.role)}
// // //                   </span>
// // //                 </p>
// // //                 <p className="text-sm text-gray-500 mt-1">
// // //                   Pages accessibles : {getPermissionsByRole().length} / {allNavigation.length}
// // //                 </p>
// // //               </div>
// // //               <div className="mt-2 md:mt-0">
// // //                 <div className="flex items-center space-x-2">
// // //                   <div className="text-sm text-gray-600">
// // //                     <span className="font-medium">Département:</span> {getDepartement()}
// // //                   </div>
// // //                   <div className="text-xs text-gray-600 px-2 py-1">
// // //                     {user?.telephone || 'Tél: Non défini'}
// // //                   </div>
// // //                 </div>
// // //                 <p className="text-xs text-gray-500 mt-1">
// // //                   Les pages verrouillées <span className="text-xs">🔒</span> ne sont pas accessibles
// // //                 </p>
// // //               </div>
// // //             </div>
            
// // //             {/* Légende des permissions - SANS BORDURES BLANCHES */}
// // //             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
// // //               <div>
// // //                 <span className="font-medium text-green-600">✅ Pages accessibles :</span>
// // //                 <div className="flex flex-wrap gap-1 mt-1">
// // //                   {allNavigation
// // //                     .filter(item => hasPermission(item.href))
// // //                     .map(item => (
// // //                       <span key={item.name} className="text-green-800 px-2 py-1 text-xs">
// // //                         {item.name}
// // //                       </span>
// // //                     ))
// // //                   }
// // //                 </div>
// // //               </div>
// // //               <div>
// // //                 <span className="font-medium text-red-600">⛔ Pages restreintes :</span>
// // //                 <div className="flex flex-wrap gap-1 mt-1">
// // //                   {allNavigation
// // //                     .filter(item => !hasPermission(item.href))
// // //                     .map(item => (
// // //                       <span key={item.name} className="text-red-800 px-2 py-1 text-xs">
// // //                         {item.name}
// // //                       </span>
// // //                     ))
// // //                   }
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
        
// // //         {/* Contenu principal - SANS BORDURES BLANCHES */}
// // //         <div className="p-6">
// // //           {children}
// // //         </div>
// // //       </main>

// // //       {/* Footer - SANS BORDURES BLANCHES */}
// // //       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
// // //         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // //             <div className="flex items-start">
// // //               {/* Logo DREN - SANS BORDURE BLANCHE */}
// // //               <div className={`mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
// // //                 <img 
// // //                   src={logoDren}
// // //                   alt="Logo DREN" 
// // //                   className={`object-contain ${logoConfig.footer.image}`}
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
// // //                 <p className="text-green-200 text-sm">
// // //                   Direction Régionale de l'Éducation Nationale
// // //                 </p>
// // //                 <p className="text-green-200 text-sm">
// // //                   Région Atsimo Andrefana, Madagascar
// // //                 </p>
// // //               </div>
// // //             </div>
// // //             <div>
// // //               <h3 className="text-lg font-semibold mb-4">Contact</h3>
// // //               <div className="space-y-2 text-sm text-green-200">
// // //                 <div className="flex items-center">
// // //                   <MapPin className="w-4 h-4 mr-2" />
// // //                   <span>Toliara, Madagascar</span>
// // //                 </div>
// // //                 <div className="flex items-center">
// // //                   <Phone className="w-4 h-4 mr-2" />
// // //                   <span>+261 94 xxx xx xx</span>
// // //                 </div>
// // //                 <div className="flex items-center">
// // //                   <Mail className="w-4 h-4 mr-2" />
// // //                   <span>drenetp@gmail.com</span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //             <div>
// // //               <h3 className="text-lg font-semibold mb-4">Système</h3>
// // //               <p className="text-green-200 text-sm">
// // //                 Système de Gestion des Ressources Informatiques
// // //               </p>
// // //               <p className="text-green-200 text-sm">

// // //               </p>
// // //             </div>
// // //           </div>
// // //           <div className="mt-8 pt-4 text-center text-sm text-green-300">
// // //             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
// // //           </div>
// // //         </div>
// // //       </footer>
// // //     </div>
// // //   );
// // // };

// // // // Fonction utilitaire pour déterminer quels rôles ont accès à une page
// // // const getAllowedRolesForPage = (pagePath) => {
// // //   const pagePermissions = {
// // //     '/dashboard': ['admin', 'director', 'technician', 'secretary', 'user'],
// // //     '/fournisseurs': ['admin', 'secretary'],
// // //     '/materiels': ['admin', 'secretary', 'user'],
// // //     '/logiciels': ['admin', 'user'],
// // //     '/installations-logiciels': ['admin', 'user'],
// // //     '/configuration-reseau': ['admin', 'user'],
// // //     '/incidents': ['admin', 'user'],
// // //     '/alertes': ['admin', 'technician'],
// // //     '/reparations': ['admin', 'technician'],
// // //     '/rapports': ['admin', 'director', 'secretary'],
// // //     '/profils-utilisateurs': ['admin']
// // //   };
  
// // //   const roles = pagePermissions[pagePath] || ['admin'];
// // //   return roles.map(role => {
// // //     switch(role) {
// // //       case 'admin': return 'Admin';
// // //       case 'director': return 'Directeur';
// // //       case 'technician': return 'Technician';
// // //       case 'secretary': return 'Secrétaire';
// // //       case 'user': return 'Utilisateur';
// // //       default: return role;
// // //     }
// // //   }).join(', ');
// // // };

// // // export default Layout;





// // import React, { useState } from 'react';
// // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // import { 
// //   Monitor, 
// //   AlertTriangle, 
// //   Wrench, 
// //   BarChart3, 
// //   LogOut, 
// //   User,
// //   Menu,
// //   X,
// //   Users,
// //   Network,
// //   Bell,
// //   Package,
// //   Cpu,
// //   MapPin,
// //   Phone,
// //   Mail,
// //   FileText
// // } from 'lucide-react';
// // import { useAuth } from '../context/AuthContext';
// // import { useNotification } from '../context/NotificationContext';

// // // Import de l'image JPEG depuis le dossier src
// // import logoDren from '../assets/images/logo-dren.jpeg';

// // const Layout = ({ children }) => {
// //   const { user, logout } = useAuth();
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //   const [logoError, setLogoError] = useState(false);
// //   const { showNotification } = useNotification();

// //   // Configuration des tailles d'image
// //   const logoConfig = {
// //     header: {
// //       container: 'h-[70px] w-[160px]',
// //       image: 'w-full h-full',
// //     },
// //     footer: {
// //       container: 'h-[120px] w-[160px]',
// //       image: 'w-full h-full',
// //     }
// //   };

// //   // Tous les menus (affichés pour tous)
// //   const allNavigation = [
//     // { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
//     // { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
//     // { name: 'Matériels', href: '/materiels', icon: Monitor },
//     // { name: 'Logiciels', href: '/logiciels', icon: Package },
//     // { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
//     // { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
//     // { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
//     // { name: 'Alertes', href: '/alertes', icon: Bell },
//     // { name: 'Réparations', href: '/reparations', icon: Wrench },
//     // { name: 'Rapports', href: '/rapports', icon: FileText },
//     // { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
//     // { name: 'Historique', href: '/historique', icon: FileText },
// //   ];

// //   // Permissions par rôle (qui peut accéder à quoi)
// //   const getPermissionsByRole = () => {
// //     if (!user || !user.role) return [];
    
// //     const role = user.role.toLowerCase();
    
// //     const permissions = {
// //       // Administrateur accède à TOUT
// //       admin: allNavigation.map(item => item.href),
      
// //       // Directeur pour rapport + dashboard
// //       director: ['/dashboard', '/rapports','/profils-utilisateurs'],
      
// //       // Secrétaire pour fournisseur + rapport + matériels
// //       secretary: ['/dashboard', '/fournisseurs', '/rapports','/profils-utilisateurs'],
      
// //       // Technicien pour alerte, reparation, incidents, configuration réseau
// //       technician: [
// //         '/dashboard', 
// //         '/alertes', 
// //         '/reparations', 
// //         '/profils-utilisateurs'
// //       ],
      
// //       // Utilisateur pour materiel, logiciel, installation logiciel, configuration reseau et incident
// //       user: [
// //         '/dashboard',
// //         '/materiels',
// //         '/logiciels',
// //         '/installations-logiciels',
// //         '/configuration-reseau',
// //         '/incidents',
// //         '/profils-utilisateurs'
// //       ]
// //     };

// //     return permissions[role] || permissions.user;
// //   };

// //   // Vérifier si l'utilisateur a accès à une page spécifique
// //   const hasPermission = (pagePath) => {
// //     if (!user) return false;
    
// //     if (user.role?.toLowerCase() === 'admin') return true;
    
// //     const allowedPages = getPermissionsByRole();
// //     return allowedPages.includes(pagePath);
// //   };

// //   // Gérer le clic sur un menu (vérifier les permissions)
// //   const handleMenuClick = (href, e) => {
// //     if (!hasPermission(href)) {
// //       e.preventDefault();
// //       e.stopPropagation();
      
// //       // Notification pour permission refusée
// //       showNotification(
// //         `Votre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.`,
// //         'error',
// //         {
// //           autoClose: 4000,
// //           toastId: 'permission-denied'
// //         }
// //       );
// //     }
// //   };

// //   const isActive = (path) => location.pathname === path;

// //   const getRoleBadgeColor = (role) => {
// //     switch (role?.toLowerCase()) {
// //       case 'admin': return 'badge-error bg-red-600';
// //       case 'director': return 'badge-primary bg-blue-600';
// //       case 'technician': return 'badge-warning bg-yellow-600';
// //       case 'secretary': return 'badge-success bg-green-600';
// //       case 'user': return 'badge-info bg-blue-400';
// //       default: return 'badge-neutral bg-gray-600';
// //     }
// //   };

// //   const getRoleText = (role) => {
// //     switch (role?.toLowerCase()) {
// //       case 'admin': return 'Administrateur';
// //       case 'director': return 'Directeur';
// //       case 'technician': return 'Technicien IT';
// //       case 'secretary': return 'Secrétaire';
// //       case 'user': return 'Utilisateur';
// //       default: return role || 'Utilisateur';
// //     }
// //   };

// //   const getFullName = () => {
// //     if (user?.full_name) return user.full_name;
// //     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
// //     return user?.username || 'Utilisateur';
// //   };

// //   const getDepartement = () => {
// //     return user?.departement || user?.service || 'Département non défini';
// //   };

// //   // Vérifier les permissions pour la page actuelle
// //   React.useEffect(() => {
// //     if (user && !hasPermission(location.pathname) && location.pathname !== '/') {
// //       navigate('/dashboard');
// //       showNotification(
// //         `Accès refusé. Vous n'avez pas la permission d'accéder à cette page.`,
// //         'error',
// //         {
// //           autoClose: 4000,
// //           toastId: 'redirect-permission-denied'
// //         }
// //       );
// //     }
// //   }, [location.pathname, user, navigate, showNotification]);

// //   return (
// //     <div className="min-h-screen bg-base-100">
// //       {/* Header */}
// //       <header className="bg-gradient-to-r from-green-800 to-green-900">
// //         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-16">
// //             <div className="flex items-center">
// //               {/* Logo DREN */}
// //               <div className={`mr-3 flex items-center justify-center ${logoConfig.header.container}`}>
// //                 {!logoError ? (
// //                   <img 
// //                     src={logoDren}
// //                     alt="Logo DREN Antsimo Andrefana" 
// //                     className={`object-contain ${logoConfig.header.image}`}
// //                     onError={() => setLogoError(true)}
// //                   />
// //                 ) : (
// //                   <Monitor className="h-6 w-6 text-green-600" />
// //                 )}
// //               </div>
// //               <div>
// //                 <h1 className="text-lg font-bold text-white">
// //                   DREN Antsimo Andrefana
// //                 </h1>
// //                 <p className="text-xs text-green-200">Gestion des Ressources Informatiques</p>
// //               </div>
// //             </div>

// //             {/* Desktop Navigation */}
// //             <nav className="hidden md:flex space-x-2">
// //               {allNavigation.map((item) => {
// //                 const Icon = item.icon;
// //                 const hasAccess = hasPermission(item.href);
                
// //                 return (
// //                   <div key={item.name} className="relative group">
// //                     <Link
// //                       to={hasAccess ? item.href : '#'}
// //                       onClick={(e) => !hasAccess && handleMenuClick(item.href, e)}
// //                       className={`flex items-center px-3 py-2 text-sm font-medium transition-colors relative ${
// //                         isActive(item.href)
// //                           ? 'text-white'
// //                           : hasAccess 
// //                             ? 'text-green-100 hover:text-white'
// //                             : 'text-green-300 opacity-60 cursor-not-allowed'
// //                       }`}
// //                     >
// //                       <Icon className="w-4 h-4 mr-2" />
// //                       {item.name}
// //                       {!hasAccess && (
// //                         <span className="ml-1 text-xs">🔒</span>
// //                       )}
// //                     </Link>
                    
// //                     {/* Tooltip pour indiquer les permissions manquantes */}
// //                     {!hasAccess && (
// //                       <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2">
// //                         <div className="bg-red-900 text-white text-xs py-1 px-2 whitespace-nowrap">
// //                           Accès réservé aux: {getAllowedRolesForPage(item.href)}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 );
// //               })}
// //             </nav>

// //             {/* User Menu */}
// //             <div className="flex items-center space-x-4">
// //               <div className="hidden md:flex items-center text-sm text-white">
// //                 <User className="w-4 h-4 mr-2" />
// //                 <div className="flex flex-col items-end">
// //                   <span className="font-medium">{getFullName()}</span>
// //                   <span className="text-xs text-green-200">{getDepartement()}</span>
// //                 </div>
// //                 <div className={`ml-2 badge ${getRoleBadgeColor(user?.role)} badge-sm text-white`}>
// //                   {getRoleText(user?.role)}
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={() => {
// //                   logout();
// //                   showNotification('Déconnexion réussie', 'success');
// //                 }}
// //                 className="flex items-center text-green-100 hover:text-white transition-colors p-2 hover:bg-green-700"
// //                 title="Se déconnecter"
// //               >
// //                 <LogOut className="w-4 h-4" />
// //               </button>

// //               {/* Mobile menu button */}
// //               <button
// //                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
// //                 className="md:hidden p-2 text-green-100 hover:bg-green-700"
// //               >
// //                 {isMobileMenuOpen ? (
// //                   <X className="w-5 h-5" />
// //                 ) : (
// //                   <Menu className="w-5 h-5" />
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Mobile Navigation */}
// //         {isMobileMenuOpen && (
// //           <div className="md:hidden bg-green-800">
// //             <div className="px-2 pt-2 pb-3 space-y-1">
// //               {allNavigation.map((item) => {
// //                 const Icon = item.icon;
// //                 const hasAccess = hasPermission(item.href);
                
// //                 return (
// //                   <div key={item.name} className="relative">
// //                     <Link
// //                       to={hasAccess ? item.href : '#'}
// //                       onClick={(e) => {
// //                         setIsMobileMenuOpen(false);
// //                         if (!hasAccess) {
// //                           e.preventDefault();
// //                           showNotification(
// //                             `Votre rôle (${getRoleText(user.role)}) ne vous permet pas d'accéder à cette page.`,
// //                             'error',
// //                             {
// //                               autoClose: 4000,
// //                               toastId: 'mobile-permission-denied'
// //                             }
// //                           );
// //                         }
// //                       }}
// //                       className={`flex items-center px-3 py-2 text-base font-medium ${
// //                         isActive(item.href)
// //                           ? 'text-white'
// //                           : hasAccess 
// //                             ? 'text-green-100 hover:text-white'
// //                             : 'text-green-300 opacity-60 cursor-not-allowed'
// //                       }`}
// //                     >
// //                       <Icon className="w-5 h-5 mr-3" />
// //                       {item.name}
// //                       {!hasAccess && (
// //                         <span className="ml-auto text-xs">🔒</span>
// //                       )}
// //                     </Link>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         )}
// //       </header>

// //       {/* Main Content - BANDEAU SUPPRIMÉ */}
// //       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
// //         {/* Contenu principal */}
// //         <div className="p-6">
// //           {children}
// //         </div>
// //       </main>

// //       {/* Footer */}
// //       <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-12">
// //         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             <div className="flex items-start">
// //               {/* Logo DREN */}
// //               <div className={`mr-3 flex items-center justify-center ${logoConfig.footer.container}`}>
// //                 <img 
// //                   src={logoDren}
// //                   alt="Logo DREN" 
// //                   className={`object-contain ${logoConfig.footer.image}`}
// //                 />
// //               </div>
// //               <div>
// //                 <h3 className="text-lg font-semibold mb-2">DREN Antsimo Andrefana</h3>
// //                 <p className="text-green-200 text-sm">
// //                   Direction Régionale de l'Éducation Nationale
// //                 </p>
// //                 <p className="text-green-200 text-sm">
// //                   Région Atsimo Andrefana, Madagascar
// //                 </p>
// //               </div>
// //             </div>
// //             <div>
// //               <h3 className="text-lg font-semibold mb-4">Contact</h3>
// //               <div className="space-y-2 text-sm text-green-200">
// //                 <div className="flex items-center">
// //                   <MapPin className="w-4 h-4 mr-2" />
// //                   <span>Toliara, Madagascar</span>
// //                 </div>
// //                 <div className="flex items-center">
// //                   <Phone className="w-4 h-4 mr-2" />
// //                   <span>+261 94 xxx xx xx</span>
// //                 </div>
// //                 <div className="flex items-center">
// //                   <Mail className="w-4 h-4 mr-2" />
// //                   <span>drenetp@gmail.com</span>
// //                 </div>
// //               </div>
// //             </div>
// //             <div>
// //               <h3 className="text-lg font-semibold mb-4">Système</h3>
// //               <p className="text-green-200 text-sm">
// //                 Système de Gestion des Ressources Informatiques
// //               </p>
// //               {user && (
// //                 <div className="mt-2">
// //                   <p className="text-green-300 text-sm">
// //                     Connecté en tant que: <span className="font-medium">{getRoleText(user.role)}</span>
// //                   </p>
// //                   <p className="text-green-300 text-xs">
// //                     Accès: {getPermissionsByRole().length} / {allNavigation.length} pages
// //                   </p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           <div className="mt-8 pt-4 text-center text-sm text-green-300">
// //             <p>&copy; 2025 DREN Antsimo Andrefana. Tous droits réservés.</p>
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // };

// // // Fonction utilitaire pour déterminer quels rôles ont accès à une page
// // const getAllowedRolesForPage = (pagePath) => {
// //   const pagePermissions = {
// //     '/dashboard': ['admin', 'director', 'technician', 'secretary', 'user'],
// //     '/fournisseurs': ['admin', 'secretary'],
// //     '/materiels': ['admin', 'secretary', 'user'],
// //     '/logiciels': ['admin', 'user'],
// //     '/installations-logiciels': ['admin', 'user'],
// //     '/configuration-reseau': ['admin', 'user'],
// //     '/incidents': ['admin', 'user'],
// //     '/alertes': ['admin', 'technician'],
// //     '/reparations': ['admin', 'technician'],
// //     '/rapports': ['admin', 'director', 'secretary'],
// //     '/profils-utilisateurs': ['admin'],
// //     '/historique': ['admin']
// //   };
  
// //   const roles = pagePermissions[pagePath] || ['admin'];
// //   return roles.map(role => {
// //     switch(role) {
// //       case 'admin': return 'Admin';
// //       case 'director': return 'Directeur';
// //       case 'technician': return 'Technicien';
// //       case 'secretary': return 'Secrétaire';
// //       case 'user': return 'Utilisateur';
// //       default: return role;
// //     }
// //   }).join(', ');
// // };

// // export default Layout;


// // kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk


// // import React, { useState } from 'react';
// // import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { useNotification } from '../context/NotificationContext';
// // import { useTheme } from '../context/ThemeContext'; // Ajoutez cette ligne
// // import { 
// //   Menu, X, Home, Database, AlertTriangle, 
// //   Wrench, Package, Users, Network, 
// //   FileText, Settings, LogOut, Bell,
// //   Sun, Moon, User
// // } from 'lucide-react';

// // const Layout = () => {
// //   const { user, logout } = useAuth();
// //   const { showNotification } = useNotification();
// //   const { theme, toggleTheme } = useTheme(); // Ajoutez cette ligne
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const [notificationsOpen, setNotificationsOpen] = useState(false);

// //   const handleLogout = async () => {
// //     try {
// //       await logout();
// //       navigate('/login');
// //       showNotification('Déconnexion réussie', 'success');
// //     } catch (error) {
// //       showNotification('Erreur lors de la déconnexion', 'error');
// //     }
// //   };

// //   const menuItems = [
// //     { path: '/dashboard', icon: Home, label: 'Tableau de Bord' },
// //     { path: '/fournisseurs', icon: Users, label: 'Fournisseurs' },
// //     { path: '/materiels', icon: Database, label: 'Matériels' },
// //     { path: '/logiciels', icon: Package, label: 'Logiciels' },
// //     { path: '/Installations Logiciels', icon: Package, label: 'Installations Logiciels' },
// //     { path: '/Configuration Réseau', icon: Network, label: 'Configuration Réseau' },
// //     { path: '/alertes', icon: Bell, label: 'Alertes' },
// //     { path: '/incidents', icon: AlertTriangle, label: 'Incidents' },
// //     { path: '/reparations', icon: Wrench, label: 'Réparations' },
// //     { path: '/rapports', icon: FileText, label: 'Rapports' },
// //     { path: '/Historique', icon: FileText, label: 'Historique' },
// //     { path: '/Profils Utilisateurs', icon: Users, label: 'Profils Utilisateurs' },
    


// //     // { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
// //     // { name: 'Fournisseurs', href: '/fournisseurs', icon: Users },
// //     // { name: 'Matériels', href: '/materiels', icon: Monitor },
// //     // { name: 'Logiciels', href: '/logiciels', icon: Package },
// //     // { name: 'Installations Logiciels', href: '/installations-logiciels', icon: Cpu },
// //     // { name: 'Configuration Réseau', href: '/configuration-reseau', icon: Network },
// //     // { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
// //     // { name: 'Alertes', href: '/alertes', icon: Bell },
// //     // { name: 'Réparations', href: '/reparations', icon: Wrench },
// //     // { name: 'Rapports', href: '/rapports', icon: FileText },
// //     // { name: 'Profils Utilisateurs', href: '/profils-utilisateurs', icon: User },
// //     // { name: 'Historique', href: '/historique', icon: FileText },
// //   ];

// //   const notifications = [
// //     { id: 1, text: 'Nouveau matériel ajouté', time: '10 min', read: false },
// //     { id: 2, text: 'Incident #123 résolu', time: '1h', read: true },
// //     { id: 3, text: 'Maintenance planifiée demain', time: '2h', read: false },
// //   ];

// //   const unreadCount = notifications.filter(n => !n.read).length;

// //   return (
// //     <div className="min-h-screen bg-base-100">
// //       {/* Top Navigation Bar */}
// //       <div className="navbar bg-base-200 border-b border-base-300 sticky top-0 z-50">
// //         <div className="navbar-start">
// //           <button
// //             onClick={() => setSidebarOpen(!sidebarOpen)}
// //             className="btn btn-ghost btn-square lg:hidden"
// //           >
// //             {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
// //           </button>
          
// //           <div className="ml-2 flex items-center">
// //             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
// //               <Database className="h-5 w-5 text-white" />
// //             </div>
// //             <div className="ml-3">
// //               <h1 className="text-lg font-bold text-base-content">Gestion IT</h1>
// //               <p className="text-xs text-base-content opacity-70">DREN Antsimo Andrefana</p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="navbar-center hidden lg:flex">
// //           <div className="tabs tabs-boxed bg-base-300">
// //             {menuItems.slice(0, 5).map((item) => (
// //               <Link
// //                 key={item.path}
// //                 to={item.path}
// //                 className={`tab tab-sm ${location.pathname === item.path ? 'tab-active' : ''}`}
// //               >
// //                 <item.icon className="h-4 w-4 mr-2" />
// //                 {item.label}
// //               </Link>
// //             ))}
// //           </div>
// //         </div>

// //         <div className="navbar-end gap-2">
// //           {/* Bouton Mode Sombre/Clair */}
// //           <button
// //             onClick={toggleTheme}
// //             className="btn btn-ghost btn-circle"
// //             title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
// //           >
// //             {theme === 'light' ? (
// //               <Moon className="h-5 w-5" />
// //             ) : (
// //               <Sun className="h-5 w-5" />
// //             )}
// //           </button>

// //           {/* Notifications */}
// //           <div className="dropdown dropdown-end">
// //             <button
// //               className="btn btn-ghost btn-circle"
// //               onClick={() => setNotificationsOpen(!notificationsOpen)}
// //             >
// //               <div className="indicator">
// //                 <Bell className="h-5 w-5" />
// //                 {unreadCount > 0 && (
// //                   <span className="badge badge-xs badge-primary indicator-item">
// //                     {unreadCount}
// //                   </span>
// //                 )}
// //               </div>
// //             </button>
            
// //             {notificationsOpen && (
// //               <div className="dropdown-content z-[1] mt-3 w-80 bg-base-100 border border-base-300 rounded-box shadow-lg">
// //                 <div className="p-4">
// //                   <h3 className="font-bold text-base-content">Notifications</h3>
// //                   <div className="divider my-2"></div>
// //                   <div className="space-y-2 max-h-60 overflow-y-auto">
// //                     {notifications.map((notification) => (
// //                       <div
// //                         key={notification.id}
// //                         className={`p-3 rounded-lg ${!notification.read ? 'bg-base-200' : ''}`}
// //                       >
// //                         <p className="text-sm text-base-content">{notification.text}</p>
// //                         <p className="text-xs text-base-content opacity-70 mt-1">
// //                           {notification.time}
// //                         </p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {/* User Profile */}
// //           <div className="dropdown dropdown-end">
// //             <button className="btn btn-ghost btn-circle avatar">
// //               <div className="w-8 rounded-full bg-primary text-white flex items-center justify-center">
// //                 <User className="h-5 w-5" />
// //               </div>
// //             </button>
// //             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// //               <li className="p-2 border-b border-base-300">
// //                 <div className="flex flex-col">
// //                   <span className="font-bold text-base-content">{user?.nom_complet || user?.username}</span>
// //                   <span className="text-xs text-base-content opacity-70">{user?.role || 'Utilisateur'}</span>
// //                 </div>
// //               </li>
// //               <li><Link to="Profils Utilisateurs">Mon Profil</Link></li>
// //               {/* <li><Link to="/parametres">Paramètres</Link></li> */}
// //               <div className="divider my-1"></div>
// //               <li>
// //                 <button onClick={handleLogout} className="text-error">
// //                   <LogOut className="h-4 w-4 mr-2" />
// //                   Déconnexion
// //                 </button>
// //               </li>
// //             </ul>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Sidebar for mobile */}
// //       {sidebarOpen && (
// //         <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
// //           <div className="fixed left-0 top-0 h-full w-64 bg-base-100 shadow-xl" onClick={(e) => e.stopPropagation()}>
// //             <div className="p-4 border-b border-base-300">
// //               <div className="flex items-center justify-between">
// //                 <h2 className="text-xl font-bold text-base-content">Menu</h2>
// //                 <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-sm">
// //                   <X className="h-5 w-5" />
// //                 </button>
// //               </div>
// //             </div>
// //             <div className="p-4 space-y-2">
// //               {menuItems.map((item) => (
// //                 <Link
// //                   key={item.path}
// //                   to={item.path}
// //                   className={`flex items-center gap-3 p-3 rounded-lg ${
// //                     location.pathname === item.path
// //                       ? 'bg-primary text-primary-content'
// //                       : 'hover:bg-base-200 text-base-content'
// //                   }`}
// //                   onClick={() => setSidebarOpen(false)}
// //                 >
// //                   <item.icon className="h-5 w-5" />
// //                   {item.label}
// //                 </Link>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Sidebar for desktop */}
// //       <div className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-base-100 border-r border-base-300">
// //         <div className="w-full p-4">
// //           <div className="space-y-2">
// //             {menuItems.map((item) => (
// //               <Link
// //                 key={item.path}
// //                 to={item.path}
// //                 className={`flex items-center gap-3 p-3 rounded-lg ${
// //                   location.pathname === item.path
// //                     ? 'bg-primary text-primary-content'
// //                     : 'hover:bg-base-200 text-base-content'
// //                 }`}
// //               >
// //                 <item.icon className="h-5 w-5" />
// //                 {item.label}
// //               </Link>
// //             ))}
// //           </div>
          
// //           <div className="mt-8 p-4 bg-base-200 rounded-lg">
// //             <h3 className="font-bold text-base-content mb-2">Statut système</h3>
// //             <div className="space-y-2">
// //               <div className="flex justify-between">
// //                 <span className="text-sm text-base-content opacity-70">Matériels</span>
// //                 <span className="badge badge-success">95%</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-sm text-base-content opacity-70">Réseau</span>
// //                 <span className="badge badge-success">99%</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-sm text-base-content opacity-70">Sécurité</span>
// //                 <span className="badge badge-warning">85%</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="lg:pl-64 pt-16">
// //         <div className="p-4 md:p-6">
// //           <Outlet />
// //         </div>
        
// //         {/* Footer */}
// //         <footer className="border-t border-base-300 p-4 mt-8">
// //           <div className="container mx-auto">
// //             <div className="flex flex-col md:flex-row justify-between items-center">
// //               <div className="text-center md:text-left mb-4 md:mb-0">
// //                 <p className="text-sm text-base-content opacity-70">
// //                   © {new Date().getFullYear()} DREN Antsimo Andrefana - Système de Gestion IT
// //                 </p>
// //                 <p className="text-xs text-base-content opacity-50 mt-1">
// //                   Version 2.1.0 • Toliara, Madagascar
// //                 </p>
// //               </div>
// //               <div className="flex gap-4">
// //                 <button className="btn btn-ghost btn-xs text-base-content opacity-70">
// //                   Confidentialité
// //                 </button>
// //                 <button className="btn btn-ghost btn-xs text-base-content opacity-70">
// //                   Conditions
// //                 </button>
// //                 <button className="btn btn-ghost btn-xs text-base-content opacity-70">
// //                   Support
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </footer>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Layout;






// import React, { useState } from 'react';
// import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useNotification } from '../context/NotificationContext';
// import { useTheme } from '../context/ThemeContext';
// import { 
//   Menu, X, Home, Database, AlertTriangle, 
//   Wrench, Package, Users, Network, 
//   FileText, Settings, LogOut, Bell,
//   Sun, Moon, User, Monitor,
//   Download, Shield, Activity, History,
//   UserCircle, Building2
// } from 'lucide-react';

// const Layout = () => {
//   const { user, logout } = useAuth();
//   const { showNotification } = useNotification();
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//       showNotification('Déconnexion réussie', 'success');
//     } catch (error) {
//       showNotification('Erreur lors de la déconnexion', 'error');
//     }
//   };

//   const menuItems = [
//     { path: '/dashboard', icon: Home, label: 'Tableau de Bord' },
//     { path: '/fournisseurs', icon: Building2, label: 'Fournisseurs' },
//     { path: '/materiels', icon: Monitor, label: 'Matériels' },
//     { path: '/logiciels', icon: Package, label: 'Logiciels' },
//     { path: '/installations-logiciels', icon: Download, label: 'Installations Logiciels' },
//     { path: '/configuration-reseau', icon: Network, label: 'Configuration Réseau' },
//     { path: '/alertes', icon: Bell, label: 'Alertes' },
//     { path: '/incidents', icon: AlertTriangle, label: 'Incidents' },
//     { path: '/reparations', icon: Wrench, label: 'Réparations' },
//     { path: '/rapports', icon: FileText, label: 'Rapports' },
//     { path: '/historique', icon: History, label: 'Historique' },
//     { path: '/profils-utilisateurs', icon: UserCircle, label: 'Profils Utilisateurs' },
//     { path: '/users', icon: Users, label: 'Utilisateurs' },
//   ];

//   const notifications = [
//     { id: 1, text: 'Nouveau matériel ajouté', time: '10 min', read: false },
//     { id: 2, text: 'Incident #123 résolu', time: '1h', read: true },
//     { id: 3, text: 'Maintenance planifiée demain', time: '2h', read: false },
//   ];

//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <div className="min-h-screen bg-base-100">
//       {/* Top Navigation Bar */}
//       <div className="navbar bg-base-200 border-b border-base-300 sticky top-0 z-50 px-4">
//         <div className="navbar-start">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="btn btn-ghost btn-square lg:hidden"
//           >
//             {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//           </button>
          
//           <div className="ml-2 flex items-center gap-3">
//             {/* Logo DREN */}
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
//                 <Database className="h-6 w-6 text-white" />
//               </div>
//               <div className="hidden md:block">
//                 <div className="flex flex-col">
//                   <h1 className="text-lg font-bold text-base-content leading-tight">
//                     DREN AA
//                   </h1>
//                   <p className="text-xs text-base-content opacity-70 leading-tight">
//                     Gestion Informatique
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="navbar-center hidden lg:flex">
//           <div className="tabs tabs-boxed bg-base-300">
//             {menuItems.slice(0, 6).map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`tab tab-sm ${location.pathname === item.path ? 'tab-active' : ''}`}
//               >
//                 <item.icon className="h-4 w-4 mr-2" />
//                 {item.label}
//               </Link>
//             ))}
//           </div>
//         </div>

//         <div className="navbar-end gap-2">
//           {/* Bouton Mode Sombre/Clair */}
//           <button
//             onClick={toggleTheme}
//             className="btn btn-ghost btn-circle"
//             title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
//           >
//             {theme === 'light' ? (
//               <Moon className="h-5 w-5" />
//             ) : (
//               <Sun className="h-5 w-5" />
//             )}
//           </button>

//           {/* Notifications */}
//           <div className="dropdown dropdown-end">
//             <button
//               className="btn btn-ghost btn-circle"
//               onClick={() => setNotificationsOpen(!notificationsOpen)}
//             >
//               <div className="indicator">
//                 <Bell className="h-5 w-5" />
//                 {unreadCount > 0 && (
//                   <span className="badge badge-xs badge-primary indicator-item">
//                     {unreadCount}
//                   </span>
//                 )}
//               </div>
//             </button>
            
//             {notificationsOpen && (
//               <div className="dropdown-content z-[1] mt-3 w-80 bg-base-100 border border-base-300 rounded-box shadow-lg">
//                 <div className="p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-bold text-base-content">Notifications</h3>
//                     <span className="badge badge-primary badge-sm">{unreadCount} non lus</span>
//                   </div>
//                   <div className="divider my-1"></div>
//                   <div className="space-y-2 max-h-60 overflow-y-auto">
//                     {notifications.map((notification) => (
//                       <div
//                         key={notification.id}
//                         className={`p-3 rounded-lg transition-colors ${
//                           !notification.read ? 'bg-blue-50 border border-blue-100' : 'hover:bg-base-200'
//                         }`}
//                       >
//                         <div className="flex items-start gap-2">
//                           <div className={`mt-0.5 w-2 h-2 rounded-full ${
//                             !notification.read ? 'bg-primary' : 'bg-base-300'
//                           }`}></div>
//                           <div className="flex-1">
//                             <p className="text-sm text-base-content">{notification.text}</p>
//                             <p className="text-xs text-base-content opacity-70 mt-1">
//                               Il y a {notification.time}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="divider my-2"></div>
//                   <button className="btn btn-sm btn-ghost w-full text-primary">
//                     Voir toutes les notifications
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* User Profile */}
//           <div className="dropdown dropdown-end">
//             <button className="btn btn-ghost flex items-center gap-2 px-3">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold">
//                 {user?.username?.charAt(0).toUpperCase() || 'U'}
//               </div>
//               <div className="hidden md:flex flex-col items-start">
//                 <span className="text-sm font-medium text-base-content leading-tight">
//                   {user?.nom_complet || user?.username || 'Utilisateur'}
//                 </span>
//                 <span className="text-xs text-base-content opacity-70 leading-tight capitalize">
//                   {user?.role || 'Utilisateur'}
//                 </span>
//               </div>
//             </button>
//             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56 mt-3">
//               <li className="p-3 border-b border-base-300">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold text-lg">
//                     {user?.username?.charAt(0).toUpperCase() || 'U'}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-bold text-base-content truncate">
//                       {user?.nom_complet || user?.username || 'Utilisateur'}
//                     </p>
//                     <p className="text-xs text-base-content opacity-70 capitalize">
//                       {user?.role || 'Utilisateur'}
//                     </p>
//                   </div>
//                 </div>
//               </li>
//               <li>
//                 <Link to="/profils-utilisateurs" className="py-3">
//                   <UserCircle className="h-4 w-4 mr-2" />
//                   Mon Profil
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/parametres" className="py-3">
//                   <Settings className="h-4 w-4 mr-2" />
//                   Paramètres
//                 </Link>
//               </li>
//               <div className="divider my-1"></div>
//               <li>
//                 <button 
//                   onClick={handleLogout} 
//                   className="py-3 text-error hover:bg-error/10"
//                 >
//                   <LogOut className="h-4 w-4 mr-2" />
//                   Déconnexion
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Sidebar for mobile */}
//       {sidebarOpen && (
//         <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
//           <div className="fixed left-0 top-0 h-full w-64 bg-base-100 shadow-xl" onClick={(e) => e.stopPropagation()}>
//             <div className="p-4 border-b border-base-300 bg-gradient-to-r from-blue-600 to-blue-800">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
//                     <Database className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">DREN AA</h2>
//                     <p className="text-xs text-blue-100">Menu Principal</p>
//                   </div>
//                 </div>
//                 <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-sm text-white">
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-120px)]">
//               {menuItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                     location.pathname === item.path
//                       ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
//                       : 'hover:bg-base-200 text-base-content'
//                   }`}
//                   onClick={() => setSidebarOpen(false)}
//                 >
//                   <item.icon className="h-5 w-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </Link>
//               ))}
//             </div>
//             <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
//               <div className="text-center">
//                 <p className="text-xs text-base-content opacity-70">
//                   Connecté en tant que
//                 </p>
//                 <p className="font-medium text-base-content">
//                   {user?.username || 'Utilisateur'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Sidebar for desktop */}
//       <div className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-base-100 border-r border-base-300">
//         <div className="w-full p-4 flex flex-col h-full">
//           <div className="flex-1 overflow-y-auto">
//             <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
//                   <Database className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-base-content">DREN AA</h3>
//                   <p className="text-xs text-base-content opacity-70">
//                     Gestion des Ressources IT
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-1 mb-6">
//               <h4 className="text-xs font-semibold text-base-content opacity-70 uppercase tracking-wider px-3 mb-2">
//                 Navigation
//               </h4>
//               {menuItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
//                     location.pathname === item.path
//                       ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600 font-medium'
//                       : 'hover:bg-base-200 text-base-content hover:border-l-4 hover:border-base-300'
//                   }`}
//                 >
//                   <item.icon className="h-5 w-5" />
//                   <span>{item.label}</span>
//                 </Link>
//               ))}
//             </div>
//           </div>
          
//           <div className="mt-auto">
//             <div className="p-4 bg-base-200 rounded-lg border border-base-300">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-bold text-base-content">Statut système</h3>
//                 <Activity className="h-4 w-4 text-primary" />
//               </div>
//               <div className="space-y-3">
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <span className="text-sm text-base-content opacity-70">Matériels</span>
//                     <span className="text-sm font-medium text-success">95%</span>
//                   </div>
//                   <progress className="progress progress-success w-full" value="95" max="100"></progress>
//                 </div>
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <span className="text-sm text-base-content opacity-70">Réseau</span>
//                     <span className="text-sm font-medium text-success">99%</span>
//                   </div>
//                   <progress className="progress progress-success w-full" value="99" max="100"></progress>
//                 </div>
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <span className="text-sm text-base-content opacity-70">Sécurité</span>
//                     <span className="text-sm font-medium text-warning">85%</span>
//                   </div>
//                   <progress className="progress progress-warning w-full" value="85" max="100"></progress>
//                 </div>
//               </div>
//             </div>
            
//             <div className="mt-4 p-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                   <User className="h-5 w-5" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-semibold truncate">
//                     {user?.nom_complet || user?.username || 'Utilisateur'}
//                   </p>
//                   <p className="text-xs opacity-90 capitalize">
//                     {user?.role || 'Utilisateur'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="lg:pl-64 pt-16">
//         <div className="p-4 md:p-6 min-h-[calc(100vh-8rem)]">
//           <div className="mb-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-base-content">
//                   {menuItems.find(item => item.path === location.pathname)?.label || 'Tableau de Bord'}
//                 </h1>
//                 <p className="text-base-content opacity-70 mt-1">
//                   Direction Régionale de l'Éducation Nationale - Antsimo Andrefana
//                 </p>
//               </div>
//               <div className="text-sm text-base-content opacity-70">
//                 {new Date().toLocaleDateString('fr-FR', { 
//                   weekday: 'long', 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}
//               </div>
//             </div>
//             <div className="divider my-4"></div>
//           </div>
          
//           <Outlet />
//         </div>
        
//         {/* Footer */}
//         <footer className="bg-base-200 border-t border-base-300 mt-8">
//           <div className="container mx-auto px-6 py-4">
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <div className="text-center md:text-left mb-4 md:mb-0">
//                 <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
//                   <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
//                     <Shield className="h-3 w-3 text-white" />
//                   </div>
//                   <p className="text-sm font-medium text-base-content">
//                     DREN Antsimo Andrefana
//                   </p>
//                 </div>
//                 <p className="text-xs text-base-content opacity-70">
//                   © {new Date().getFullYear()} Système de Gestion des Ressources Informatiques
//                 </p>
//                 <p className="text-xs text-base-content opacity-50 mt-1">
//                   Version 2.1.0 • Toliara, Madagascar
//                 </p>
//               </div>
//               <div className="flex flex-wrap gap-3 justify-center">
//                 <a className="btn btn-ghost btn-xs text-base-content opacity-70 hover:text-primary">
//                   Confidentialité
//                 </a>
//                 <a className="btn btn-ghost btn-xs text-base-content opacity-70 hover:text-primary">
//                   Conditions
//                 </a>
//                 <a className="btn btn-ghost btn-xs text-base-content opacity-70 hover:text-primary">
//                   Support
//                 </a>
//                 <a className="btn btn-ghost btn-xs text-base-content opacity-70 hover:text-primary">
//                   Contact
//                 </a>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, X, Home, Database, AlertTriangle, 
  Wrench, Package, Users, Network, 
  FileText, Settings, LogOut, Bell,
  Sun, Moon, User, Monitor,
  Download, Shield, Activity, History,
  UserCircle, Building2
} from 'lucide-react';

// Import du logo DREN
import logoDren from '../assets/images/logo-dren.jpeg';

const Layout = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      showNotification('Déconnexion réussie', 'success');
    } catch (error) {
      showNotification('Erreur lors de la déconnexion', 'error');
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Tableau de Bord' },
    { path: '/fournisseurs', icon: Building2, label: 'Fournisseurs' },
    { path: '/materiels', icon: Monitor, label: 'Matériels' },
    // { path: '/logiciels', icon: Package, label: 'Logiciels' },
    // { path: '/installations-logiciels', icon: Download, label: 'Installations Logiciels' },
    // { path: '/configuration-reseau', icon: Network, label: 'Configuration Réseau' },
    { path: '/alertes', icon: Bell, label: 'Alertes' },
    { path: '/incidents', icon: AlertTriangle, label: 'Incidents' },
    { path: '/reparations', icon: Wrench, label: 'Réparations' },
    { path: '/rapports', icon: FileText, label: 'Rapports' },
    { path: '/historique', icon: History, label: 'Historique' },
    { path: '/profils-utilisateurs', icon: UserCircle, label: 'Profils Utilisateurs' },
    { path: '/users', icon: Users, label: 'Utilisateurs' },
  ];

  const notifications = [
    { id: 1, text: 'Nouveau matériel ajouté', time: '10 min', read: false },
    { id: 2, text: 'Incident #123 résolu', time: '1h', read: true },
    { id: 3, text: 'Maintenance planifiée demain', time: '2h', read: false },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Top Navigation Bar */}
      <div className="navbar bg-base-200 border-b border-base-300 sticky top-0 z-50 px-4">
        <div className="navbar-start">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-ghost btn-square lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="ml-2 flex items-center gap-3">
            {/* Logo DREN */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-white">
                <img 
                  src={logoDren} 
                  alt="Logo DREN Antsimo Andrefana" 
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23006db6'/%3E%3Ctext x='50' y='50' font-size='18' fill='white' text-anchor='middle' dy='.3em'%3EDREN%3C/text%3E%3Ctext x='50' y='70' font-size='12' fill='white' text-anchor='middle'%3EAA%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="hidden md:block">
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-base-content leading-tight">
                    DREN Antsimo Andrefana
                  </h1>
                  <p className="text-xs text-base-content opacity-70 leading-tight">
                    Système de Gestion des Ressources Materiels Informatique
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="navbar-center hidden lg:flex">
          <div className="tabs tabs-boxed bg-base-300">
            {menuItems.slice(0, 6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`tab tab-sm ${location.pathname === item.path ? 'tab-active' : ''}`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>
        </div> */}

        <div className="navbar-end gap-2">
          {/* Bouton Mode Sombre/Clair */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="dropdown dropdown-end">
            {/* <button
              className="btn btn-ghost btn-circle"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <div className="indicator">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="badge badge-xs badge-primary indicator-item">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button> */}
            
            {notificationsOpen && (
              <div className="dropdown-content z-[1] mt-3 w-80 bg-base-100 border border-base-300 rounded-box shadow-lg">
                <div className="p-4">
                  {/* <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-base-content">Notifications</h3>
                    <span className="badge badge-primary badge-sm">{unreadCount} non lus</span>
                  </div> */}
                  {/* <div className="divider my-1"></div> */}
                  {/* <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg transition-colors ${
                          !notification.read ? 'bg-blue-50 border border-blue-100' : 'hover:bg-base-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-0.5 w-2 h-2 rounded-full ${
                            !notification.read ? 'bg-primary' : 'bg-base-300'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-base-content">{notification.text}</p>
                            <p className="text-xs text-base-content opacity-70 mt-1">
                              Il y a {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="divider my-2"></div> */}
                  {/* <button className="btn btn-sm btn-ghost w-full text-primary">
                    Voir toutes les notifications
                  </button> */}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost flex items-center gap-2 px-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-base-content leading-tight">
                  {user?.nom_complet || user?.username || 'Utilisateur'}
                </span>
                <span className="text-xs text-base-content opacity-70 leading-tight capitalize">
                  {user?.role || 'Utilisateur'}
                </span>
              </div>
            </button>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56 mt-3">
              <li className="p-3 border-b border-base-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold text-lg">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base-content truncate">
                      {user?.nom_complet || user?.username || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-base-content opacity-70 capitalize">
                      {user?.role || 'Utilisateur'}
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <Link to="/profils-utilisateurs" className="py-3">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profil
                </Link>
              </li>
              <li>
                {/* <Link to="/parametres" className="py-3">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Link> */}
              </li>
              <div className="divider my-1"></div>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="py-3 text-error hover:bg-error/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-64 bg-base-100 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-base-300 bg-gradient-to-r from-blue-600 to-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <img 
                      src={logoDren} 
                      alt="Logo DREN" 
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='white'/%3E%3Ctext x='50' y='50' font-size='24' fill='%23006db6' text-anchor='middle' dy='.3em'%3EDREN%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">DREN AA</h2>
                    <p className="text-xs text-blue-100">Menu Principal</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-sm text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-120px)]">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                      : 'hover:bg-base-200 text-base-content'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
              <div className="text-center">
                <p className="text-xs text-base-content opacity-70">
                  Connecté en tant que
                </p>
                <p className="font-medium text-base-content">
                  {user?.username || 'Utilisateur'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-base-100 border-r border-base-300">
        <div className="w-full p-4 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {/* <div className="p-4 border-b border-base-300 bg-gradient-to-r from-blue-600 to-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-white">
                  <img 
                    src={logoDren} 
                    alt="Logo DREN" 
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23006db6' rx='8'/%3E%3Ctext x='50' y='50' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3EDREN%3C/text%3E%3Ctext x='50' y='70' font-size='14' fill='white' text-anchor='middle'%3EAA%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base-content">DREN AA</h3>
                  <p className="text-xs text-base-content opacity-70">
                    Gestion des Ressources Materiels IT
                  </p>
                </div>
              </div>
            </div> */}
            
            <div className="space-y-1 mb-6">
              <h4 className="text-xs font-semibold text-base-content opacity-70 uppercase tracking-wider px-3 mb-2">
                Navigation
              </h4>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600 font-medium'
                      : 'hover:bg-base-200 text-base-content hover:border-l-4 hover:border-base-300'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="p-4 bg-base-200 rounded-lg border border-base-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base-content">Statut système</h3>
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-base-content opacity-70">Matériels</span>
                    <span className="text-sm font-medium text-success">95%</span>
                  </div>
                  <progress className="progress progress-success w-full" value="95" max="100"></progress>
                </div>
                <div>
                  {/* <div className="flex justify-between mb-1">
                    <span className="text-sm text-base-content opacity-70">Réseau</span>
                    <span className="text-sm font-medium text-success">99%</span>
                  </div> */}
                  {/* <progress className="progress progress-success w-full" value="99" max="100"></progress> */}
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-base-content opacity-70">Sécurité</span>
                    <span className="text-sm font-medium text-warning">96%</span>
                  </div>
                  <progress className="progress progress-warning w-full" value="85" max="100"></progress>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold truncate">
                    {user?.nom_complet || user?.username || 'Utilisateur'}
                  </p>
                  <p className="text-xs opacity-90 capitalize">
                    {user?.role || 'Utilisateur'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pt-16">
        <div className="p-4 md:p-6 min-h-[calc(100vh-8rem)]">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-base-content">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Tableau de Bord'}
                </h1>
                <p className="text-base-content opacity-70 mt-1">
                  Direction Régionale de l'Éducation Nationale - Antsimo Andrefana
                </p>
              </div>
              <div className="text-sm text-base-content opacity-70">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div className="divider my-4"></div>
          </div>
          
          <Outlet />
        </div>
        
        {/* Footer */}
        <footer className="bg-base-200 border-t border-base-300 mt-8">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded overflow-hidden border border-white shadow-sm">
                    <img 
                      src={logoDren} 
                      alt="Logo DREN" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23006db6'/%3E%3Ctext x='50' y='50' font-size='16' fill='white' text-anchor='middle' dy='.3em'%3EDREN%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">
                      DREN Antsimo Andrefana
                    </p>
                    <p className="text-xs text-base-content opacity-70">
                      Ministère de l'Éducation Nationale
                    </p>
                  </div>
                </div>
                <p className="text-xs text-base-content opacity-70 mt-2">
                  © {new Date().getFullYear()} Système de Gestion des Ressources Materiels Informatiques
                </p>
                <p className="text-xs text-base-content opacity-50 mt-1">
                  Version 2.1.0 • Toliara, Madagascar
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <a className="btn btn-ghost btn-xs text-base-content opacity-70 hover:text-primary">
                  Confidentialité
                </a>
                <a className="btn btn-ghost btn-xs text-base-content opacity-70 hover:text-primary">
                  Conditions
                </a>
                <a className="btn btn-ghost btn-xs text-base-content opacity-70 hover:text-primary">
                  Support
                </a>
                <a className="btn btn-ghost btn-xs text-base-content opacity-70 hover:text-primary">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;