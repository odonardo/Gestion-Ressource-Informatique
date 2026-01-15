// // src/hooks/usePermissions.js
// import { useAuth } from '../context/AuthContext';

// export const usePermissions = () => {
//   const { user } = useAuth();
  
//   const permissions = {
//     // Admin: accès complet
//     isAdmin: user?.role === 'admin',
    
//     // Technicien: gestion technique
//     isTechnician: user?.role === 'technician',
    
//     // Directeur: vue globale et rapports
//     isDirector: user?.role === 'director',
    
//     // Secrétaire: gestion administrative
//     isSecretary: user?.role === 'secretary',
    
//     // Utilisateur standard: consultation basique
//     isUser: user?.role === 'user',
    
//     // Vérifier si l'utilisateur a au moins le niveau requis
//     hasAccess: (requiredRole) => {
//       const roleHierarchy = {
//         'user': 1,
//         'secretary': 2,
//         'technician': 3,
//         'director': 4,
//         'admin': 5
//       };
//       return roleHierarchy[user?.role] >= roleHierarchy[requiredRole];
//     },
    
//     // Vérifier des permissions spécifiques
//     canManageUsers: () => ['admin', 'director'].includes(user?.role),
//     canManageTechnicians: () => ['admin', 'director'].includes(user?.role),
//     canManageIncidents: () => ['admin', 'technician', 'director'].includes(user?.role),
//     canManageReparations: () => ['admin', 'technician'].includes(user?.role),
//     canViewReports: () => ['admin', 'director', 'secretary'].includes(user?.role),
//     canManageConfiguration: () => ['admin', 'technician'].includes(user?.role)
//   };
  
//   return permissions;
// };







// src/hooks/usePermissions.js
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const permissions = {
    // Admin: accès complet
    isAdmin: user?.role === 'admin',
    
    // Directeur: vue globale et rapports
    isDirecteur: user?.role === 'directeur',
    
    // Secrétaire: gestion administrative
    isSecretary: user?.role === 'secretary',
    
    // Technicien: gestion technique
    isTechnicien: user?.role === 'technician',
    
    // Utilisateur standard: consultation basique
    isUser: user?.role === 'user',
    
    // Vérifier si l'utilisateur a au moins le niveau requis
    hasAccess: (requiredRole) => {
      const roleHierarchy = {
        'user': 1,
        'technician': 2,
        'secretary': 3,
        'director': 4,
        'admin': 5
      };
      const userRole = user?.role?.toLowerCase();
      const required = requiredRole.toLowerCase();
      return roleHierarchy[userRole] >= roleHierarchy[required];
    },
    
    // Vérifier des permissions spécifiques
    canManageUsers: () => ['admin'].includes(user?.role),
    canManageFournisseurs: () => ['admin', 'secretary'].includes(user?.role),
    canManageMateriels: () => ['admin', 'user',].includes(user?.role),
    canManageLogiciels: () => ['admin', 'user'].includes(user?.role),
    canManageInstallations: () => ['admin', 'user'].includes(user?.role),
    canManageReseau: () => ['admin', 'user'].includes(user?.role),
    canManageIncidents: () => ['admin', 'user'].includes(user?.role),
    canManageAlertes: () => ['admin', 'technician',].includes(user?.role),
    canManageReparations: () => ['admin', 'technician'].includes(user?.role),
    canViewReports: () => ['admin', 'director', 'secretary'].includes(user?.role),
    canManageProfils: () => ['admin'].includes(user?.role),
    
    // Vérifier l'accès à une page spécifique
    hasPageAccess: (pagePath) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      
      const pagePermissions = {
        '/dashboard': ['admin', 'director', 'technicien', 'secretary', 'user'],
        '/fournisseurs': ['admin', 'secretary'],
        '/materiels': ['admin','user',],
        '/logiciels': ['admin', 'user',],
        '/installations-logiciels': ['admin', 'user',],
        '/configuration-reseau': ['admin', 'user'],
        '/incidents': ['admin', 'user',],
        '/alertes': ['admin', 'technician',],
        '/reparations': ['admin', 'technician'],
        '/rapports': ['admin', 'directorr', 'secretary'],
        '/profils-utilisateurs': ['admin']
      };
      
      const allowedRoles = pagePermissions[pagePath] || ['admin'];
      return allowedRoles.includes(user.role);
    }
  };
  
  return permissions;
};






























































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