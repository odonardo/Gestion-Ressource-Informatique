












// // // src/pages/Historique.jsx - VERSION CORRIGÉE
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   History, Filter, Search, Download, RefreshCw, 
// //   User, Calendar, FileText, Clock, Eye, Edit, 
// //   Trash2, Plus, AlertTriangle, CheckCircle, XCircle,
// //   ArrowUpDown, MoreVertical, Database
// // } from 'lucide-react';
// // import { useAuth } from '../context/AuthContext';
// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';
// // import * as XLSX from 'xlsx';

// // const Historique = () => {
// //   const { user } = useAuth();
// //   const [historique, setHistorique] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     utilisateur: '',
// //     action: '',
// //     module: '',
// //     dateDebut: '',
// //     dateFin: ''
// //   });
// //   const [pagination, setPagination] = useState({
// //     page: 1,
// //     limit: 20,
// //     total: 0,
// //     totalPages: 0
// //   });
// //   const [sortConfig, setSortConfig] = useState({
// //     key: 'date',
// //     direction: 'desc'
// //   });
// //   const [stats, setStats] = useState({
// //     totalActions: 0,
// //     actionsParJour: 0,
// //     utilisateursActifs: [],
// //     modulesPopulaires: [],
// //     storageSize: '0 KB'
// //   });

// //   // Obtenir les données depuis le localStorage
// //   const loadHistoriqueFromLocal = (page = 1, filters = {}) => {
// //     try {
// //       const STORAGE_KEY = 'gestion_parc_historique';
// //       const saved = localStorage.getItem(STORAGE_KEY);
      
// //       if (!saved) {
// //         // Initialiser avec des données de démo
// //         const defaultData = getDemoData();
// //         localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
// //         return { data: defaultData, total: defaultData.length };
// //       }
      
// //       let data = JSON.parse(saved);
      
// //       // Appliquer les filtres
// //       if (filters.search) {
// //         const searchTerm = filters.search.toLowerCase();
// //         data = data.filter(item => 
// //           item.utilisateur?.toLowerCase().includes(searchTerm) ||
// //           item.action?.toLowerCase().includes(searchTerm) ||
// //           item.module?.toLowerCase().includes(searchTerm) ||
// //           item.details?.toLowerCase().includes(searchTerm) ||
// //           false
// //         );
// //       }
      
// //       if (filters.utilisateur && filters.utilisateur !== '') {
// //         data = data.filter(item => item.utilisateur === filters.utilisateur);
// //       }
      
// //       if (filters.action && filters.action !== '') {
// //         data = data.filter(item => item.action === filters.action);
// //       }
      
// //       if (filters.module && filters.module !== '') {
// //         data = data.filter(item => item.module === filters.module);
// //       }
      
// //       if (filters.dateDebut) {
// //         const startDate = new Date(filters.dateDebut);
// //         data = data.filter(item => new Date(item.date) >= startDate);
// //       }
      
// //       if (filters.dateFin) {
// //         const endDate = new Date(filters.dateFin);
// //         endDate.setHours(23, 59, 59, 999); // Fin de la journée
// //         data = data.filter(item => new Date(item.date) <= endDate);
// //       }
      
// //       // Appliquer le tri
// //       data.sort((a, b) => {
// //         const aValue = a[sortConfig.key];
// //         const bValue = b[sortConfig.key];
        
// //         if (sortConfig.key === 'date') {
// //           return sortConfig.direction === 'desc' 
// //             ? new Date(bValue) - new Date(aValue)
// //             : new Date(aValue) - new Date(bValue);
// //         }
        
// //         if (typeof aValue === 'string' && typeof bValue === 'string') {
// //           return sortConfig.direction === 'desc'
// //             ? bValue.localeCompare(aValue)
// //             : aValue.localeCompare(bValue);
// //         }
        
// //         return 0;
// //       });
      
// //       return { data, total: data.length };
      
// //     } catch (error) {
// //       console.error('❌ Erreur chargement historique local:', error);
// //       return { data: getDemoData(), total: 0 };
// //     }
// //   };

// //   // Données de démo
// //   const getDemoData = () => {
// //     const now = new Date();
// //     return [
// //       {
// //         id: 'hist_1',
// //         utilisateur: 'admin',
// //         action: 'CONNEXION',
// //         module: 'Authentification',
// //         details: 'Connexion au système DREN AA',
// //         date: new Date(now.getTime() - 3600000).toISOString(),
// //         ip_address: '192.168.1.100',
// //         user_agent: 'Chrome/120.0',
// //         status: 'SUCCESS'
// //       },
// //       {
// //         id: 'hist_2',
// //         utilisateur: 'technicien',
// //         action: 'MODIFICATION',
// //         module: 'Matériels',
// //         details: 'Mise à jour état PC-001 → Fonctionnel',
// //         date: new Date(now.getTime() - 7200000).toISOString(),
// //         ip_address: '192.168.1.101',
// //         user_agent: 'Firefox/119.0',
// //         status: 'SUCCESS'
// //       },
// //       {
// //         id: 'hist_3',
// //         utilisateur: 'secretaire',
// //         action: 'CREATION',
// //         module: 'Fournisseurs',
// //         details: 'Ajout fournisseur "TechSolutions SARL"',
// //         date: new Date(now.getTime() - 10800000).toISOString(),
// //         ip_address: '192.168.1.102',
// //         user_agent: 'Safari/17.0',
// //         status: 'SUCCESS'
// //       },
// //       {
// //         id: 'hist_4',
// //         utilisateur: 'directeur',
// //         action: 'LECTURE',
// //         module: 'Dashboard',
// //         details: 'Consultation tableau de bord statistiques',
// //         date: new Date(now.getTime() - 14400000).toISOString(),
// //         ip_address: '192.168.1.103',
// //         user_agent: 'Edge/120.0',
// //         status: 'SUCCESS'
// //       },
// //       {
// //         id: 'hist_5',
// //         utilisateur: 'admin',
// //         action: 'SUPPRESSION',
// //         module: 'Utilisateurs',
// //         details: 'Suppression utilisateur inactif "testuser"',
// //         date: new Date(now.getTime() - 18000000).toISOString(),
// //         ip_address: '192.168.1.100',
// //         user_agent: 'Chrome/120.0',
// //         status: 'SUCCESS'
// //       },
// //       {
// //         id: 'hist_6',
// //         utilisateur: 'technicien',
// //         action: 'ECHEC',
// //         module: 'Incidents',
// //         details: 'Tentative résolution incident #123 - Échec matériel',
// //         date: new Date(now.getTime() - 21600000).toISOString(),
// //         ip_address: '192.168.1.101',
// //         user_agent: 'Firefox/119.0',
// //         status: 'FAILED'
// //       },
// //       {
// //         id: 'hist_7',
// //         utilisateur: 'secretaire',
// //         action: 'GENERATION',
// //         module: 'Rapports',
// //         details: 'Export rapport mensuel PDF - Matériels',
// //         date: new Date(now.getTime() - 25200000).toISOString(),
// //         ip_address: '192.168.1.102',
// //         user_agent: 'Safari/17.0',
// //         status: 'SUCCESS'
// //       },
// //       {
// //         id: 'hist_8',
// //         utilisateur: 'admin',
// //         action: 'MODIFICATION',
// //         module: 'Configuration',
// //         details: 'Modification paramètres système notifications',
// //         date: new Date(now.getTime() - 28800000).toISOString(),
// //         ip_address: '192.168.1.100',
// //         user_agent: 'Chrome/120.0',
// //         status: 'SUCCESS'
// //       }
// //     ];
// //   };

// //   // Charger l'historique
// //   const loadHistorique = (page = 1) => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       console.log('📥 Chargement historique local avec filtres:', filters);
      
// //       const result = loadHistoriqueFromLocal(page, filters);
// //       const data = result.data || [];
      
// //       // Pagination
// //       const startIndex = (page - 1) * pagination.limit;
// //       const endIndex = startIndex + pagination.limit;
// //       const paginatedData = data.slice(startIndex, endIndex);
      
// //       setHistorique(paginatedData);
      
// //       // Mettre à jour la pagination
// //       setPagination(prev => ({
// //         ...prev,
// //         page: page,
// //         total: result.total,
// //         totalPages: Math.ceil(result.total / prev.limit)
// //       }));
      
// //       // Calculer les statistiques
// //       calculateStats(data);
      
// //       // Calculer la taille du stockage
// //       calculateStorageSize();
      
// //     } catch (err) {
// //       console.error('❌ Erreur chargement historique:', err);
// //       setError('Erreur lors du chargement de l\'historique local');
      
// //       // Utiliser les données de démo
// //       const demoData = getDemoData();
// //       setHistorique(demoData.slice(0, pagination.limit));
// //       calculateStats(demoData);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Calculer les statistiques
// //   const calculateStats = (data) => {
// //     if (!data || data.length === 0) {
// //       setStats({
// //         totalActions: 0,
// //         actionsParJour: 0,
// //         utilisateursActifs: [],
// //         modulesPopulaires: [],
// //         storageSize: stats.storageSize
// //       });
// //       return;
// //     }

// //     // Total d'actions
// //     const totalActions = data.length;

// //     // Actions par jour (moyenne sur 7 jours)
// //     const now = new Date();
// //     const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
// //     const recentActions = data.filter(item => 
// //       new Date(item.date) >= sevenDaysAgo
// //     ).length;
// //     const actionsParJour = Math.round((recentActions / 7) * 10) / 10;

// //     // Utilisateurs actifs (top 5)
// //     const userCounts = {};
// //     data.forEach(item => {
// //       if (item.utilisateur) {
// //         userCounts[item.utilisateur] = (userCounts[item.utilisateur] || 0) + 1;
// //       }
// //     });
// //     const utilisateursActifs = Object.entries(userCounts)
// //       .map(([username, count]) => ({ username, count }))
// //       .sort((a, b) => b.count - a.count)
// //       .slice(0, 5);

// //     // Modules populaires
// //     const moduleCounts = {};
// //     data.forEach(item => {
// //       if (item.module) {
// //         moduleCounts[item.module] = (moduleCounts[item.module] || 0) + 1;
// //       }
// //     });
// //     const modulesPopulaires = Object.entries(moduleCounts)
// //       .map(([module, count]) => ({ module, count }))
// //       .sort((a, b) => b.count - a.count)
// //       .slice(0, 5);

// //     setStats(prev => ({
// //       ...prev,
// //       totalActions,
// //       actionsParJour,
// //       utilisateursActifs,
// //       modulesPopulaires
// //     }));
// //   };

// //   // Calculer la taille du stockage
// //   const calculateStorageSize = () => {
// //     try {
// //       const STORAGE_KEY = 'gestion_parc_historique';
// //       const data = localStorage.getItem(STORAGE_KEY);
// //       if (data) {
// //         const size = new Blob([data]).size;
// //         const sizeKB = (size / 1024).toFixed(2);
// //         setStats(prev => ({ ...prev, storageSize: `${sizeKB} KB` }));
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur calcul taille stockage:', error);
// //     }
// //   };

// //   // Formater la date
// //   const formatDate = (dateString) => {
// //     if (!dateString) return '-';
// //     try {
// //       const date = new Date(dateString);
// //       return new Intl.DateTimeFormat('fr-FR', {
// //         day: '2-digit',
// //         month: '2-digit',
// //         year: 'numeric',
// //         hour: '2-digit',
// //         minute: '2-digit',
// //         second: '2-digit'
// //       }).format(date);
// //     } catch (error) {
// //       return dateString;
// //     }
// //   };

// //   // Formater la date relative
// //   const formatRelativeTime = (dateString) => {
// //     if (!dateString) return '-';
// //     try {
// //       const date = new Date(dateString);
// //       const now = new Date();
// //       const diffMs = now - date;
// //       const diffMinutes = Math.floor(diffMs / 60000);
// //       const diffHours = Math.floor(diffMs / 3600000);
// //       const diffDays = Math.floor(diffMs / 86400000);

// //       if (diffMinutes < 1) return 'À l\'instant';
// //       if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
// //       if (diffHours < 24) return `Il y a ${diffHours} h`;
// //       if (diffDays < 7) return `Il y a ${diffDays} j`;
// //       return formatDate(dateString);
// //     } catch (error) {
// //       return dateString;
// //     }
// //   };

// //   // Obtenir l'icône pour l'action
// //   const getActionIcon = (action) => {
// //     switch (action) {
// //       case 'CONNEXION': return <CheckCircle className="h-4 w-4" />;
// //       case 'CREATION': return <Plus className="h-4 w-4" />;
// //       case 'MODIFICATION': return <Edit className="h-4 w-4" />;
// //       case 'SUPPRESSION': return <Trash2 className="h-4 w-4" />;
// //       case 'LECTURE': return <Eye className="h-4 w-4" />;
// //       case 'ECHEC': return <XCircle className="h-4 w-4" />;
// //       case 'GENERATION': return <Download className="h-4 w-4" />;
// //       default: return <FileText className="h-4 w-4" />;
// //     }
// //   };

// //   // Obtenir la couleur pour l'action
// //   const getActionColor = (action) => {
// //     switch (action) {
// //       case 'CONNEXION': return 'badge-success';
// //       case 'CREATION': return 'badge-primary';
// //       case 'MODIFICATION': return 'badge-warning';
// //       case 'SUPPRESSION': return 'badge-error';
// //       case 'LECTURE': return 'badge-info';
// //       case 'ECHEC': return 'badge-error bg-red-200 border-red-300';
// //       case 'GENERATION': return 'badge-secondary';
// //       default: return 'badge-neutral';
// //     }
// //   };

// //   // Obtenir la couleur pour le statut
// //   const getStatusColor = (status) => {
// //     switch (status?.toUpperCase()) {
// //       case 'SUCCESS': return 'badge-success';
// //       case 'FAILED': return 'badge-error';
// //       case 'WARNING': return 'badge-warning';
// //       case 'IN_PROGRESS': return 'badge-info';
// //       default: return 'badge-neutral';
// //     }
// //   };

// //   // Trier les données
// //   const handleSort = (key) => {
// //     setSortConfig(prev => ({
// //       key,
// //       direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
// //     }));
// //   };

// //   // Filtrer les données
// //   const handleFilterChange = (key, value) => {
// //     setFilters(prev => ({ ...prev, [key]: value }));
// //   };

// //   // Appliquer les filtres
// //   const applyFilters = () => {
// //     loadHistorique(1);
// //   };

// //   // Réinitialiser les filtres
// //   const resetFilters = () => {
// //     setFilters({
// //       search: '',
// //       utilisateur: '',
// //       action: '',
// //       module: '',
// //       dateDebut: '',
// //       dateFin: ''
// //     });
// //     setTimeout(() => loadHistorique(1), 100);
// //   };

// //   // Ajouter une action de test
// //   const addTestAction = () => {
// //     const actions = ['CONNEXION', 'CREATION', 'MODIFICATION', 'SUPPRESSION', 'LECTURE', 'GENERATION'];
// //     const modules = ['Utilisateurs', 'Matériels', 'Incidents', 'Rapports', 'Dashboard', 'Configuration'];
// //     const utilisateurs = ['admin', 'technicien', 'secretaire', 'directeur', 'user1'];
    
// //     const action = actions[Math.floor(Math.random() * actions.length)];
// //     const module = modules[Math.floor(Math.random() * modules.length)];
// //     const utilisateur = utilisateurs[Math.floor(Math.random() * utilisateurs.length)];
// //     const details = `Action de test: ${action} sur ${module} par ${utilisateur}`;
    
// //     const newEntry = {
// //       id: 'test_' + Date.now(),
// //       utilisateur,
// //       action,
// //       module,
// //       details,
// //       date: new Date().toISOString(),
// //       ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
// //       user_agent: navigator.userAgent,
// //       status: Math.random() > 0.2 ? 'SUCCESS' : 'FAILED'
// //     };
    
// //     const STORAGE_KEY = 'gestion_parc_historique';
// //     const historique = loadHistoriqueFromLocal().data || [];
// //     const newHistorique = [newEntry, ...historique];
    
// //     localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
// //     // Recharger les données
// //     loadHistorique(pagination.page);
    
// //     alert(`✅ Action de test ajoutée: ${action} - ${module}`);
// //   };

// //   // Effacer l'historique
// //   const clearHistorique = () => {
// //     if (window.confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ? Cette action est irréversible.')) {
// //       localStorage.removeItem('gestion_parc_historique');
// //       alert('✅ Historique effacé avec succès');
// //       loadHistorique(1);
// //     }
// //   };

// //   // Obtenir les options uniques pour les filtres
// //   const getUniqueOptions = (field) => {
// //     const data = loadHistoriqueFromLocal().data || [];
// //     const values = data.map(item => item[field]).filter(Boolean);
// //     return [...new Set(values)].sort();
// //   };

// //   // Générer rapport PDF
// //   const generatePDFReport = () => {
// //     const doc = new jsPDF('landscape');
    
// //     // En-tête
// //     doc.setFontSize(20);
// //     doc.text('HISTORIQUE DES ACTIONS - SYSTÈME DREN AA', 20, 20);
    
// //     doc.setFontSize(12);
// //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
// //     doc.text(`Généré par: ${user?.username || 'Utilisateur'}`, 20, 38);
// //     doc.text(`Total actions: ${historique.length}`, 20, 46);
    
// //     // Filtres appliqués
// //     let yPos = 60;
// //     doc.setFontSize(14);
// //     doc.text('FILTRES APPLIQUÉS', 20, yPos);
// //     yPos += 10;
    
// //     doc.setFontSize(10);
// //     if (filters.search) {
// //       doc.text(`Recherche: ${filters.search}`, 20, yPos);
// //       yPos += 6;
// //     }
// //     if (filters.utilisateur) {
// //       doc.text(`Utilisateur: ${filters.utilisateur}`, 20, yPos);
// //       yPos += 6;
// //     }
// //     if (filters.action) {
// //       doc.text(`Action: ${filters.action}`, 20, yPos);
// //       yPos += 6;
// //     }
// //     if (filters.module) {
// //       doc.text(`Module: ${filters.module}`, 20, yPos);
// //       yPos += 6;
// //     }
// //     if (filters.dateDebut || filters.dateFin) {
// //       doc.text(`Période: ${filters.dateDebut || 'Début'} → ${filters.dateFin || 'Fin'}`, 20, yPos);
// //       yPos += 6;
// //     }
    
// //     yPos += 10;
    
// //     // Tableau des actions
// //     const tableData = historique.map(item => [
// //       formatDate(item.date),
// //       item.utilisateur || '-',
// //       item.action || '-',
// //       item.module || '-',
// //       item.details?.substring(0, 60) + (item.details?.length > 60 ? '...' : '') || '-',
// //       item.status || '-',
// //       item.ip_address || '-'
// //     ]);
    
// //     autoTable(doc, {
// //       head: [['Date', 'Utilisateur', 'Action', 'Module', 'Détails', 'Statut', 'IP']],
// //       body: tableData,
// //       startY: yPos,
// //       theme: 'grid',
// //       headStyles: { fillColor: [59, 130, 246] },
// //       styles: { fontSize: 8 },
// //       margin: { left: 20, right: 20 }
// //     });
    
// //     // Pied de page
// //     const pageCount = doc.internal.getNumberOfPages();
// //     for (let i = 1; i <= pageCount; i++) {
// //       doc.setPage(i);
// //       doc.setFontSize(8);
// //       doc.setTextColor(150, 150, 150);
// //       doc.text(
// //         `Système de Gestion DREN AA - Historique des actions - Page ${i}/${pageCount}`,
// //         20,
// //         doc.internal.pageSize.height - 10
// //       );
// //     }
    
// //     doc.save(`historique-actions-${new Date().toISOString().split('T')[0]}.pdf`);
// //   };

// //   // Générer rapport Excel
// //   const generateExcelReport = () => {
// //     const wsData = historique.map(item => ({
// //       Date: formatDate(item.date),
// //       Utilisateur: item.utilisateur,
// //       Action: item.action,
// //       Module: item.module,
// //       Détails: item.details,
// //       'Adresse IP': item.ip_address,
// //       'User Agent': item.user_agent,
// //       Statut: item.status
// //     }));
    
// //     const ws = XLSX.utils.json_to_sheet(wsData);
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, 'Historique');
    
// //     // Ajouter les statistiques
// //     const statsWs = XLSX.utils.aoa_to_sheet([
// //       ['STATISTIQUES HISTORIQUE'],
// //       ['Date de génération', new Date().toLocaleDateString('fr-FR')],
// //       ['Généré par', user?.username || 'Utilisateur'],
// //       ['Total actions', stats.totalActions],
// //       ['Actions par jour', stats.actionsParJour],
// //       ['Taille stockage', stats.storageSize],
// //       [''],
// //       ['Top Utilisateurs', 'Actions'],
// //       ...stats.utilisateursActifs.map(u => [u.username, u.count]),
// //       [''],
// //       ['Top Modules', 'Actions'],
// //       ...stats.modulesPopulaires.map(m => [m.module, m.count])
// //     ]);
    
// //     XLSX.utils.book_append_sheet(wb, statsWs, 'Statistiques');
    
// //     XLSX.writeFile(wb, `historique-${new Date().toISOString().split('T')[0]}.xlsx`);
// //   };

// //   // Charger au démarrage et quand les filtres/tri changent
// //   useEffect(() => {
// //     loadHistorique(pagination.page);
// //   }, [filters, sortConfig]);

// //   return (
// //     <div className="p-6 bg-base-100 min-h-screen">
// //       {/* En-tête */}
// //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
// //         <div>
// //           <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
// //             <History className="h-8 w-8 text-primary" />
// //             Historique des Actions
// //             <span className="badge badge-primary badge-lg">Local</span>
// //           </h1>
// //           <p className="text-base-content opacity-70 mt-1">
// //             Suivi des activités système (stockage local)
// //           </p>
// //           <div className="flex flex-wrap gap-2 mt-2 text-sm">
// //             <span className="badge badge-primary">
// //               {stats.totalActions} actions
// //             </span>
// //             <span className="badge badge-success">
// //               {stats.actionsParJour}/jour
// //             </span>
// //             <span className="badge badge-info">
// //               <Database className="h-3 w-3 mr-1" />
// //               {stats.storageSize}
// //             </span>
// //           </div>
// //         </div>
// //         <div className="flex flex-wrap gap-2">
// //           <button 
// //             onClick={addTestAction}
// //             className="btn btn-warning btn-sm"
// //           >
// //             <Plus className="h-4 w-4 mr-2" />
// //             Action test
// //           </button>
// //           <button 
// //             onClick={clearHistorique}
// //             className="btn btn-error btn-sm"
// //           >
// //             <Trash2 className="h-4 w-4 mr-2" />
// //             Effacer
// //           </button>
// //           <div className="dropdown dropdown-end">
// //             <div tabIndex={0} role="button" className="btn btn-primary btn-sm">
// //               <Download className="h-4 w-4 mr-2" />
// //               Exporter
// //             </div>
// //             <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// //               <li>
// //                 <button onClick={generatePDFReport}>
// //                   <FileText className="h-4 w-4" />
// //                   PDF
// //                 </button>
// //               </li>
// //               <li>
// //                 <button onClick={generateExcelReport}>
// //                   <FileText className="h-4 w-4" />
// //                   Excel
// //                 </button>
// //               </li>
// //             </ul>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Statistiques */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //         <div className="stat bg-base-200 rounded-lg p-4">
// //           <div className="stat-figure text-primary">
// //             <History className="h-8 w-8" />
// //           </div>
// //           <div className="stat-title">Actions totales</div>
// //           <div className="stat-value text-3xl">{stats.totalActions}</div>
// //           <div className="stat-desc">Stockage local</div>
// //         </div>

// //         <div className="stat bg-base-200 rounded-lg p-4">
// //           <div className="stat-figure text-success">
// //             <Clock className="h-8 w-8" />
// //           </div>
// //           <div className="stat-title">Activité/jour</div>
// //           <div className="stat-value text-3xl">{stats.actionsParJour}</div>
// //           <div className="stat-desc">Moyenne 7 jours</div>
// //         </div>

// //         <div className="stat bg-base-200 rounded-lg p-4">
// //           <div className="stat-figure text-warning">
// //             <Database className="h-8 w-8" />
// //           </div>
// //           <div className="stat-title">Stockage</div>
// //           <div className="stat-value text-xl">{stats.storageSize}</div>
// //           <div className="stat-desc">Taille données</div>
// //         </div>

// //         <div className="stat bg-base-200 rounded-lg p-4">
// //           <div className="stat-figure text-info">
// //             <User className="h-8 w-8" />
// //           </div>
// //           <div className="stat-title">Utilisateurs</div>
// //           <div className="stat-value text-3xl">{stats.utilisateursActifs.length}</div>
// //           <div className="stat-desc">Actifs récents</div>
// //         </div>
// //       </div>

// //       {/* Filtres */}
// //       <div className="card bg-base-200 shadow-xl mb-6">
// //         <div className="card-body">
// //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
// //             <h2 className="card-title text-base-content">
// //               <Filter className="h-5 w-5" />
// //               Filtres de recherche
// //             </h2>
// //             <div className="flex gap-2">
// //               <button 
// //                 onClick={applyFilters}
// //                 className="btn btn-primary btn-sm"
// //               >
// //                 <Filter className="h-4 w-4 mr-2" />
// //                 Appliquer
// //               </button>
// //               <button 
// //                 onClick={resetFilters}
// //                 className="btn btn-outline btn-sm"
// //               >
// //                 Réinitialiser
// //               </button>
// //               <button 
// //                 onClick={() => loadHistorique(pagination.page)}
// //                 className="btn btn-outline btn-sm"
// //               >
// //                 <RefreshCw className="h-4 w-4" />
// //               </button>
// //             </div>
// //           </div>
          
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {/* Recherche */}
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text flex items-center">
// //                   <Search className="h-4 w-4 mr-2" />
// //                   Recherche
// //                 </span>
// //               </label>
// //               <input
// //                 type="text"
// //                 placeholder="Utilisateur, action, module..."
// //                 className="input input-bordered bg-base-100"
// //                 value={filters.search}
// //                 onChange={(e) => handleFilterChange('search', e.target.value)}
// //                 onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
// //               />
// //             </div>

// //             {/* Utilisateur */}
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text flex items-center">
// //                   <User className="h-4 w-4 mr-2" />
// //                   Utilisateur
// //                 </span>
// //               </label>
// //               <select
// //                 className="select select-bordered bg-base-100"
// //                 value={filters.utilisateur}
// //                 onChange={(e) => handleFilterChange('utilisateur', e.target.value)}
// //               >
// //                 <option value="">Tous les utilisateurs</option>
// //                 {getUniqueOptions('utilisateur').map(user => (
// //                   <option key={user} value={user}>{user}</option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Action */}
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Type d'action</span>
// //               </label>
// //               <select
// //                 className="select select-bordered bg-base-100"
// //                 value={filters.action}
// //                 onChange={(e) => handleFilterChange('action', e.target.value)}
// //               >
// //                 <option value="">Toutes les actions</option>
// //                 <option value="CONNEXION">Connexion</option>
// //                 <option value="CREATION">Création</option>
// //                 <option value="MODIFICATION">Modification</option>
// //                 <option value="SUPPRESSION">Suppression</option>
// //                 <option value="LECTURE">Lecture</option>
// //                 <option value="GENERATION">Génération</option>
// //                 <option value="ECHEC">Échec</option>
// //               </select>
// //             </div>
// //           </div>

// //           {/* Dates et Module */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Module</span>
// //               </label>
// //               <select
// //                 className="select select-bordered bg-base-100"
// //                 value={filters.module}
// //                 onChange={(e) => handleFilterChange('module', e.target.value)}
// //               >
// //                 <option value="">Tous les modules</option>
// //                 {getUniqueOptions('module').map(module => (
// //                   <option key={module} value={module}>{module}</option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="form-control">
// //                 <label className="label">
// //                   <span className="label-text text-xs">Date début</span>
// //                 </label>
// //                 <input
// //                   type="date"
// //                   className="input input-bordered bg-base-100"
// //                   value={filters.dateDebut}
// //                   onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
// //                 />
// //               </div>

// //               <div className="form-control">
// //                 <label className="label">
// //                   <span className="label-text text-xs">Date fin</span>
// //                 </label>
// //                 <input
// //                   type="date"
// //                   className="input input-bordered bg-base-100"
// //                   value={filters.dateFin}
// //                   onChange={(e) => handleFilterChange('dateFin', e.target.value)}
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Tableau d'historique */}
// //       <div className="card bg-base-100 shadow-xl border border-base-300">
// //         <div className="card-body p-0">
// //           {loading ? (
// //             <div className="flex items-center justify-center py-12">
// //               <div className="text-center">
// //                 <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
// //                 <p className="text-lg">Chargement de l'historique...</p>
// //               </div>
// //             </div>
// //           ) : error ? (
// //             <div className="alert alert-error m-4">
// //               <AlertTriangle className="h-6 w-6" />
// //               <div>
// //                 <h3 className="font-bold">Erreur de chargement</h3>
// //                 <div className="text-sm">{error}</div>
// //               </div>
// //             </div>
// //           ) : historique.length === 0 ? (
// //             <div className="text-center py-12">
// //               <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
// //               <h3 className="text-lg font-semibold mb-2">Aucune action enregistrée</h3>
// //               <p className="text-gray-500 mb-4">Utilisez le bouton "Action test" pour ajouter des données.</p>
// //               <button 
// //                 onClick={addTestAction}
// //                 className="btn btn-primary"
// //               >
// //                 <Plus className="h-4 w-4 mr-2" />
// //                 Ajouter une action de test
// //               </button>
// //             </div>
// //           ) : (
// //             <>
// //               <div className="overflow-x-auto">
// //                 <table className="table table-zebra w-full">
// //                   <thead>
// //                     <tr className="bg-base-200">
// //                       <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort('date')}>
// //                         <div className="flex items-center gap-1">
// //                           Date et Heure
// //                           <ArrowUpDown className="h-4 w-4" />
// //                           {sortConfig.key === 'date' && (
// //                             <span className="text-xs">{sortConfig.direction === 'desc' ? '↓' : '↑'}</span>
// //                           )}
// //                         </div>
// //                       </th>
// //                       <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort('utilisateur')}>
// //                         <div className="flex items-center gap-1">
// //                           Utilisateur
// //                           <ArrowUpDown className="h-4 w-4" />
// //                           {sortConfig.key === 'utilisateur' && (
// //                             <span className="text-xs">{sortConfig.direction === 'desc' ? '↓' : '↑'}</span>
// //                           )}
// //                         </div>
// //                       </th>
// //                       <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort('action')}>
// //                         <div className="flex items-center gap-1">
// //                           Action
// //                           <ArrowUpDown className="h-4 w-4" />
// //                           {sortConfig.key === 'action' && (
// //                             <span className="text-xs">{sortConfig.direction === 'desc' ? '↓' : '↑'}</span>
// //                           )}
// //                         </div>
// //                       </th>
// //                       <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort('module')}>
// //                         <div className="flex items-center gap-1">
// //                           Module
// //                           <ArrowUpDown className="h-4 w-4" />
// //                           {sortConfig.key === 'module' && (
// //                             <span className="text-xs">{sortConfig.direction === 'desc' ? '↓' : '↑'}</span>
// //                           )}
// //                         </div>
// //                       </th>
// //                       <th>Détails</th>
// //                       <th>Statut</th>
// //                       <th>Actions</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {historique.map((item) => (
// //                       <tr key={item.id} className="hover:bg-base-200">
// //                         <td className="whitespace-nowrap">
// //                           <div className="flex flex-col">
// //                             <span className="font-medium text-sm">{formatDate(item.date)}</span>
// //                             <span className="text-xs opacity-70">
// //                               {formatRelativeTime(item.date)}
// //                             </span>
// //                           </div>
// //                         </td>
// //                         <td>
// //                           <div className="flex items-center gap-2">
// //                             <User className="h-4 w-4 opacity-70" />
// //                             <span className="font-medium">{item.utilisateur}</span>
// //                           </div>
// //                         </td>
// //                         <td>
// //                           <div className={`badge ${getActionColor(item.action)} gap-2`}>
// //                             {getActionIcon(item.action)}
// //                             {item.action}
// //                           </div>
// //                         </td>
// //                         <td>
// //                           <div className="badge badge-outline">
// //                             {item.module}
// //                           </div>
// //                         </td>
// //                         <td className="max-w-xs">
// //                           <div className="tooltip" data-tip={item.details}>
// //                             <span className="truncate block">
// //                               {item.details || 'Aucun détail'}
// //                             </span>
// //                           </div>
// //                           {item.ip_address && (
// //                             <div className="text-xs opacity-70 mt-1">
// //                               IP: {item.ip_address}
// //                             </div>
// //                           )}
// //                         </td>
// //                         <td>
// //                           <div className={`badge ${getStatusColor(item.status)}`}>
// //                             {item.status || 'N/A'}
// //                           </div>
// //                         </td>
// //                         <td>
// //                           <div className="dropdown dropdown-end">
// //                             <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
// //                               <MoreVertical className="h-4 w-4" />
// //                             </div>
// //                             <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
// //                               <li>
// //                                 <button onClick={() => {
// //                                   const details = `
// // Utilisateur: ${item.utilisateur}
// // Action: ${item.action}
// // Module: ${item.module}
// // Date: ${formatDate(item.date)}
// // Détails: ${item.details}
// // Statut: ${item.status}
// // IP: ${item.ip_address}
// // User Agent: ${item.user_agent}
// //                                   `;
// //                                   alert(details);
// //                                 }}>
// //                                   <Eye className="h-4 w-4" />
// //                                   Voir détails
// //                                 </button>
// //                               </li>
// //                               <li>
// //                                 <button onClick={() => {
// //                                   const text = `Action: ${item.action} | Module: ${item.module} | Utilisateur: ${item.utilisateur} | Date: ${formatDate(item.date)} | Détails: ${item.details}`;
// //                                   navigator.clipboard.writeText(text);
// //                                   alert('✅ Informations copiées !');
// //                                 }}>
// //                                   <FileText className="h-4 w-4" />
// //                                   Copier
// //                                 </button>
// //                               </li>
// //                             </ul>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               {/* Pagination */}
// //               <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-base-300 gap-4">
// //                 <div className="text-sm text-base-content opacity-70">
// //                   Affichage de {historique.length} sur {stats.totalActions} actions
// //                 </div>
// //                 <div className="join">
// //                   <button
// //                     className="join-item btn btn-sm"
// //                     onClick={() => loadHistorique(pagination.page - 1)}
// //                     disabled={pagination.page <= 1}
// //                   >
// //                     «
// //                   </button>
// //                   <button className="join-item btn btn-sm">
// //                     Page {pagination.page} sur {pagination.totalPages}
// //                   </button>
// //                   <button
// //                     className="join-item btn btn-sm"
// //                     onClick={() => loadHistorique(pagination.page + 1)}
// //                     disabled={pagination.page >= pagination.totalPages}
// //                   >
// //                     »
// //                   </button>
// //                 </div>
// //                 <div className="text-sm">
// //                   <select
// //                     className="select select-bordered select-sm"
// //                     value={pagination.limit}
// //                     onChange={(e) => {
// //                       setPagination(prev => ({ ...prev, limit: parseInt(e.target.value) }));
// //                       loadHistorique(1);
// //                     }}
// //                   >
// //                     <option value={10}>10 par page</option>
// //                     <option value={20}>20 par page</option>
// //                     <option value={50}>50 par page</option>
// //                     <option value={100}>100 par page</option>
// //                   </select>
// //                 </div>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>

// //       {/* Statistiques détaillées */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
// //         {/* Top utilisateurs */}
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body">
// //             <h2 className="card-title text-base-content">
// //               <User className="h-5 w-5" />
// //               Top Utilisateurs
// //             </h2>
// //             <div className="space-y-3">
// //               {stats.utilisateursActifs.length > 0 ? (
// //                 stats.utilisateursActifs.map((userStat, index) => (
// //                   <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
// //                     <div className="flex items-center gap-3">
// //                       <div className="avatar placeholder">
// //                         <div className="bg-primary text-primary-content rounded-full w-10">
// //                           <span className="text-sm">{userStat.username.charAt(0).toUpperCase()}</span>
// //                         </div>
// //                       </div>
// //                       <div>
// //                         <h4 className="font-semibold">{userStat.username}</h4>
// //                         <p className="text-sm opacity-70">Utilisateur actif</p>
// //                       </div>
// //                     </div>
// //                     <div className="text-right">
// //                       <div className="font-bold text-lg">{userStat.count}</div>
// //                       <div className="text-xs opacity-70">actions</div>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <p className="text-center py-4 opacity-70">Aucun utilisateur trouvé</p>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Top modules */}
// //         <div className="card bg-base-200 shadow-xl">
// //           <div className="card-body">
// //             <h2 className="card-title text-base-content">
// //               <FileText className="h-5 w-5" />
// //               Modules les plus actifs
// //             </h2>
// //             <div className="space-y-3">
// //               {stats.modulesPopulaires.length > 0 ? (
// //                 stats.modulesPopulaires.map((moduleStat, index) => (
// //                   <div key={index} className="p-3 bg-base-100 rounded-lg">
// //                     <div className="flex justify-between items-center mb-2">
// //                       <span className="font-semibold">{moduleStat.module}</span>
// //                       <span className="badge badge-primary">{moduleStat.count} actions</span>
// //                     </div>
// //                     <div className="w-full bg-base-300 rounded-full h-2">
// //                       <div
// //                         className="bg-primary rounded-full h-2"
// //                         style={{ 
// //                           width: `${Math.min(100, (moduleStat.count / Math.max(1, stats.totalActions)) * 100)}%` 
// //                         }}
// //                       ></div>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <p className="text-center py-4 opacity-70">Aucun module trouvé</p>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Informations */}
// //       <div className="mt-6 p-4 bg-base-200 rounded-lg">
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
// //           <div>
// //             <h3 className="font-semibold mb-2">ℹ️ Informations</h3>
// //             <p className="text-sm opacity-70">
// //               L'historique est stocké localement dans votre navigateur.
// //               <br />
// //               Les données sont limitées à 100 entrées maximum.
// //             </p>
// //           </div>
// //           <div className="flex gap-2">
// //             <button 
// //               onClick={() => {
// //                 const key = 'gestion_parc_historique';
// //                 const data = localStorage.getItem(key);
// //                 console.log('📋 Données brutes:', data ? JSON.parse(data) : 'Vide');
// //                 alert('Données affichées dans la console (F12 → Console)');
// //               }}
// //               className="btn btn-outline btn-xs"
// //             >
// //               Voir données brutes
// //             </button>
// //             <button 
// //               onClick={() => {
// //                 if (window.confirm('Télécharger toutes les données au format JSON ?')) {
// //                   const data = localStorage.getItem('gestion_parc_historique');
// //                   const blob = new Blob([data || '[]'], { type: 'application/json' });
// //                   const url = URL.createObjectURL(blob);
// //                   const a = document.createElement('a');
// //                   a.href = url;
// //                   a.download = `historique-backup-${new Date().toISOString().split('T')[0]}.json`;
// //                   a.click();
// //                 }
// //               }}
// //               className="btn btn-outline btn-xs"
// //             >
// //               Sauvegarder JSON
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Historique;










































// // // src/pages/Historique.jsx - VERSION AMÉLIORÉE AVEC DÉTAILS CLAIRS
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   History, Filter, Search, Download, RefreshCw, 
// //   User, Calendar, FileText, Clock, Eye, Edit, 
// //   Trash2, Plus, AlertTriangle, CheckCircle, XCircle,
// //   ArrowUpDown, MoreVertical, Database, Printer,
// //   ExternalLink, ChevronDown, ChevronUp, Copy,
// //   Save, Upload, Settings, Key, LogOut, LogIn,
// //   Shield, Bell, Package, Monitor, Network,
// //   Wrench, Users as UsersIcon, FileSpreadsheet,
// //   BookOpen, FileEdit, FilePlus, FileMinus, FileDown,
// //   Database as DatabaseIcon, HardDrive, Server, Cpu
// // } from 'lucide-react';
// // import { useAuth } from '../context/AuthContext';
// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';
// // import * as XLSX from 'xlsx';

// // const Historique = () => {
// //   const { user } = useAuth();
// //   const [historique, setHistorique] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     utilisateur: '',
// //     action: '',
// //     module: '',
// //     dateDebut: '',
// //     dateFin: '',
// //     status: ''
// //   });
// //   const [pagination, setPagination] = useState({
// //     page: 1,
// //     limit: 20,
// //     total: 0,
// //     totalPages: 0
// //   });
// //   const [sortConfig, setSortConfig] = useState({
// //     key: 'date',
// //     direction: 'desc'
// //   });
// //   const [expandedRows, setExpandedRows] = useState({});
// //   const [stats, setStats] = useState({
// //     totalActions: 0,
// //     actionsParJour: 0,
// //     utilisateursActifs: [],
// //     modulesPopulaires: [],
// //     actionsParType: {},
// //     storageSize: '0 KB'
// //   });
// //   const [selectedActions, setSelectedActions] = useState([]);

// //   // Charger l'historique depuis localStorage
// //   const loadHistorique = (page = 1) => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       const STORAGE_KEY = 'gestion_parc_historique';
// //       const saved = localStorage.getItem(STORAGE_KEY);
// //       let data = saved ? JSON.parse(saved) : [];
      
// //       // Appliquer les filtres
// //       data = applyFilters(data, filters);
      
// //       // Appliquer le tri
// //       data = applySort(data, sortConfig);
      
// //       // Calculer les statistiques
// //       calculateStats(data);
      
// //       // Pagination
// //       const startIndex = (page - 1) * pagination.limit;
// //       const endIndex = startIndex + pagination.limit;
// //       const paginatedData = data.slice(startIndex, endIndex);
      
// //       setHistorique(paginatedData);
// //       setPagination(prev => ({
// //         ...prev,
// //         page: page,
// //         total: data.length,
// //         totalPages: Math.ceil(data.length / prev.limit)
// //       }));
      
// //       // Calculer la taille du stockage
// //       calculateStorageSize();
      
// //     } catch (error) {
// //       console.error('❌ Erreur chargement historique:', error);
// //       setError('Erreur de chargement des données');
// //       setHistorique([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Appliquer les filtres
// //   const applyFilters = (data, filters) => {
// //     let filtered = [...data];
    
// //     if (filters.search) {
// //       const searchTerm = filters.search.toLowerCase();
// //       filtered = filtered.filter(item => 
// //         item.utilisateur?.toLowerCase().includes(searchTerm) ||
// //         item.action?.toLowerCase().includes(searchTerm) ||
// //         item.module?.toLowerCase().includes(searchTerm) ||
// //         item.details?.toLowerCase().includes(searchTerm) ||
// //         item.fullDetails?.toLowerCase().includes(searchTerm) ||
// //         false
// //       );
// //     }
    
// //     if (filters.utilisateur) {
// //       filtered = filtered.filter(item => item.utilisateur === filters.utilisateur);
// //     }
    
// //     if (filters.action) {
// //       filtered = filtered.filter(item => item.action === filters.action);
// //     }
    
// //     if (filters.module) {
// //       filtered = filtered.filter(item => item.module === filters.module);
// //     }
    
// //     if (filters.dateDebut) {
// //       const startDate = new Date(filters.dateDebut);
// //       filtered = filtered.filter(item => new Date(item.date) >= startDate);
// //     }
    
// //     if (filters.dateFin) {
// //       const endDate = new Date(filters.dateFin);
// //       endDate.setHours(23, 59, 59, 999);
// //       filtered = filtered.filter(item => new Date(item.date) <= endDate);
// //     }
    
// //     if (filters.status) {
// //       filtered = filtered.filter(item => item.status === filters.status);
// //     }
    
// //     return filtered;
// //   };

// //   // Appliquer le tri
// //   const applySort = (data, sortConfig) => {
// //     return [...data].sort((a, b) => {
// //       let aValue = a[sortConfig.key];
// //       let bValue = b[sortConfig.key];
      
// //       if (sortConfig.key === 'date') {
// //         aValue = new Date(aValue);
// //         bValue = new Date(bValue);
// //       }
      
// //       if (sortConfig.direction === 'asc') {
// //         return aValue > bValue ? 1 : -1;
// //       } else {
// //         return aValue < bValue ? 1 : -1;
// //       }
// //     });
// //   };

// //   // Calculer les statistiques
// //   const calculateStats = (data) => {
// //     const totalActions = data.length;
    
// //     // Actions par jour (7 derniers jours)
// //     const now = new Date();
// //     const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
// //     const recentActions = data.filter(item => 
// //       new Date(item.date) >= sevenDaysAgo
// //     ).length;
// //     const actionsParJour = (recentActions / 7).toFixed(1);
    
// //     // Utilisateurs actifs
// //     const userCounts = {};
// //     data.forEach(item => {
// //       if (item.utilisateur) {
// //         userCounts[item.utilisateur] = (userCounts[item.utilisateur] || 0) + 1;
// //       }
// //     });
// //     const utilisateursActifs = Object.entries(userCounts)
// //       .map(([username, count]) => ({ username, count }))
// //       .sort((a, b) => b.count - a.count)
// //       .slice(0, 10);
    
// //     // Modules populaires
// //     const moduleCounts = {};
// //     data.forEach(item => {
// //       if (item.module) {
// //         moduleCounts[item.module] = (moduleCounts[item.module] || 0) + 1;
// //       }
// //     });
// //     const modulesPopulaires = Object.entries(moduleCounts)
// //       .map(([module, count]) => ({ module, count }))
// //       .sort((a, b) => b.count - a.count)
// //       .slice(0, 10);
    
// //     // Actions par type
// //     const actionCounts = {};
// //     data.forEach(item => {
// //       if (item.action) {
// //         actionCounts[item.action] = (actionCounts[item.action] || 0) + 1;
// //       }
// //     });
    
// //     setStats(prev => ({
// //       ...prev,
// //       totalActions,
// //       actionsParJour,
// //       utilisateursActifs,
// //       modulesPopulaires,
// //       actionsParType: actionCounts
// //     }));
// //   };

// //   // Calculer la taille du stockage
// //   const calculateStorageSize = () => {
// //     try {
// //       const STORAGE_KEY = 'gestion_parc_historique';
// //       const data = localStorage.getItem(STORAGE_KEY);
// //       if (data) {
// //         const size = new Blob([data]).size;
// //         const sizeKB = (size / 1024).toFixed(2);
// //         setStats(prev => ({ ...prev, storageSize: `${sizeKB} KB` }));
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur calcul taille stockage:', error);
// //     }
// //   };

// //   // Formater la date
// //   const formatDate = (dateString) => {
// //     if (!dateString) return '-';
// //     try {
// //       const date = new Date(dateString);
// //       return new Intl.DateTimeFormat('fr-FR', {
// //         day: '2-digit',
// //         month: '2-digit',
// //         year: 'numeric',
// //         hour: '2-digit',
// //         minute: '2-digit',
// //         second: '2-digit'
// //       }).format(date);
// //     } catch {
// //       return dateString;
// //     }
// //   };

// //   // Formater la date relative
// //   const formatRelativeTime = (dateString) => {
// //     if (!dateString) return '-';
// //     try {
// //       const date = new Date(dateString);
// //       const now = new Date();
// //       const diffMs = now - date;
// //       const diffMinutes = Math.floor(diffMs / 60000);
// //       const diffHours = Math.floor(diffMs / 3600000);
// //       const diffDays = Math.floor(diffMs / 86400000);

// //       if (diffMinutes < 1) return 'À l\'instant';
// //       if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
// //       if (diffHours < 24) return `Il y a ${diffHours} h`;
// //       if (diffDays < 7) return `Il y a ${diffDays} j`;
// //       return formatDate(dateString);
// //     } catch {
// //       return dateString;
// //     }
// //   };

// //   // Obtenir l'icône pour l'action
// //   const getActionIcon = (action) => {
// //     const actionIcons = {
// //       'CONNEXION': <LogIn className="h-4 w-4" />,
// //       'DECONNEXION': <LogOut className="h-4 w-4" />,
// //       'CREATION COMPTE': <Key className="h-4 w-4" />,
// //       'AJOUT': <FilePlus className="h-4 w-4" />,
// //       'MODIFICATION': <FileEdit className="h-4 w-4" />,
// //       'SUPPRESSION': <FileMinus className="h-4 w-4" />,
// //       'CONSULTATION': <Eye className="h-4 w-4" />,
// //       'EXPORTATION': <FileDown className="h-4 w-4" />,
// //       'GENERATION': <FileText className="h-4 w-4" />,
// //       'RÉSOLUTION': <CheckCircle className="h-4 w-4" />,
// //       'NAVIGATION': <ExternalLink className="h-4 w-4" />,
// //       'LECTURE': <BookOpen className="h-4 w-4" />
// //     };
    
// //     return actionIcons[action] || <FileText className="h-4 w-4" />;
// //   };

// //   // Obtenir l'icône pour le module
// //   const getModuleIcon = (module) => {
// //     const moduleIcons = {
// //       'Matériels': <Monitor className="h-4 w-4" />,
// //       'Logiciels': <Package className="h-4 w-4" />,
// //       'Incidents': <AlertTriangle className="h-4 w-4" />,
// //       'Réparations': <Wrench className="h-4 w-4" />,
// //       'Alertes': <Bell className="h-4 w-4" />,
// //       'Fournisseurs': <UsersIcon className="h-4 w-4" />,
// //       'Utilisateurs': <User className="h-4 w-4" />,
// //       'Rapports': <FileSpreadsheet className="h-4 w-4" />,
// //       'Authentification': <Shield className="h-4 w-4" />,
// //       'Navigation': <ExternalLink className="h-4 w-4" />,
// //       'Système': <Cpu className="h-4 w-4" />,
// //       'Configuration': <Settings className="h-4 w-4" />,
// //       'Dashboard': <DatabaseIcon className="h-4 w-4" />,
// //       'Réseau': <Server className="h-4 w-4" />,
// //       'Stockage': <HardDrive className="h-4 w-4" />
// //     };
    
// //     return moduleIcons[module] || <FileText className="h-4 w-4" />;
// //   };

// //   // Obtenir la couleur pour l'action
// //   const getActionColor = (action) => {
// //     const actionColors = {
// //       'CONNEXION': 'badge-success',
// //       'DECONNEXION': 'badge-warning',
// //       'CREATION COMPTE': 'badge-primary',
// //       'AJOUT': 'badge-primary',
// //       'MODIFICATION': 'badge-warning',
// //       'SUPPRESSION': 'badge-error',
// //       'CONSULTATION': 'badge-info',
// //       'EXPORTATION': 'badge-secondary',
// //       'GENERATION': 'badge-secondary',
// //       'RÉSOLUTION': 'badge-success',
// //       'NAVIGATION': 'badge-neutral',
// //       'LECTURE': 'badge-info'
// //     };
    
// //     return actionColors[action] || 'badge-neutral';
// //   };

// //   // Générer une description claire de l'action
// //   const getActionDescription = (item) => {
// //     const actionTexts = {
// //       'CONNEXION': `s'est connecté(e) au système`,
// //       'DECONNEXION': `s'est déconnecté(e) du système`,
// //       'CREATION COMPTE': `a créé un compte utilisateur`,
// //       'AJOUT': `a ajouté un élément`,
// //       'MODIFICATION': `a modifié un élément`,
// //       'SUPPRESSION': `a supprimé un élément`,
// //       'CONSULTATION': `a consulté des données`,
// //       'EXPORTATION': `a exporté des données`,
// //       'GENERATION': `a généré un rapport`,
// //       'RÉSOLUTION': `a résolu un incident`,
// //       'NAVIGATION': `a navigué vers`,
// //       'LECTURE': `a consulté`
// //     };
    
// //     const actionText = actionTexts[item.action] || item.action.toLowerCase();
    
// //     // Pour la navigation, on veut afficher la page visitée
// //     if (item.action === 'NAVIGATION' && item.fullDetails) {
// //       try {
// //         const details = JSON.parse(item.fullDetails);
// //         if (details.page) {
// //           const pageName = getPageName(details.page);
// //           return `${item.utilisateur} ${actionText} ${pageName}`;
// //         }
// //       } catch (e) {
// //         // Fallback
// //       }
// //     }
    
// //     // Pour les autres actions
// //     return `${item.utilisateur} ${actionText} dans ${item.module}`;
// //   };

// //   // Obtenir le nom de la page
// //   const getPageName = (path) => {
// //     const pages = {
// //       '/dashboard': 'le Tableau de bord',
// //       '/materiels': 'la page Matériels',
// //       '/logiciels': 'la page Logiciels',
// //       '/incidents': 'la page Incidents',
// //       '/reparations': 'la page Réparations',
// //       '/rapports': 'la page Rapports',
// //       '/users': 'la page Utilisateurs',
// //       '/alertes': 'la page Alertes',
// //       '/fournisseurs': 'la page Fournisseurs',
// //       '/profils-utilisateurs': 'la page Profils utilisateurs',
// //       '/configuration-reseau': 'la page Configuration réseau',
// //       '/historique': 'la page Historique',
// //       '/installations-logiciels': 'la page Installations logiciels',
// //       '/login': 'la page Connexion',
// //       '/register': 'la page Inscription'
// //     };
    
// //     return pages[path] || path;
// //   };

// //   // Obtenir la description détaillée de l'action
// //   const getFullActionDescription = (item) => {
// //     try {
// //       const fullDetails = item.fullDetails ? JSON.parse(item.fullDetails) : {};
      
// //       let description = `=== ACTION CRUD ===\n`;
      
// //       // Description principale
// //       description += `🔹 ${getActionDescription(item)}\n\n`;
      
// //       // Informations de base
// //       description += `=== INFORMATIONS ===\n`;
// //       description += `👤 Utilisateur: ${item.utilisateur}\n`;
// //       description += `📅 Date: ${formatDate(item.date)}\n`;
// //       description += `📍 IP: ${item.ip_address || 'localhost'}\n`;
// //       description += `🌐 Navigateur: ${item.user_agent?.split(' ')[0] || 'Inconnu'}\n`;
// //       description += `✅ Statut: ${item.status || 'SUCCESS'}\n\n`;
      
// //       // Données spécifiques selon le type d'action
// //       if (fullDetails.data) {
// //         description += `=== DONNÉES MANIPULÉES ===\n`;
        
// //         // Si c'est une création
// //         if (item.action === 'AJOUT' || item.action === 'CREATION COMPTE') {
// //           description += `📝 Élément créé :\n`;
// //           Object.entries(fullDetails.data).forEach(([key, value]) => {
// //             if (value !== null && value !== undefined && value !== '') {
// //               description += `   • ${formatKey(key)}: ${formatValue(value)}\n`;
// //             }
// //           });
// //         }
        
// //         // Si c'est une modification
// //         else if (item.action === 'MODIFICATION') {
// //           description += `📝 Modifications effectuées :\n`;
// //           if (fullDetails.changes) {
// //             Object.entries(fullDetails.changes).forEach(([key, change]) => {
// //               description += `   • ${formatKey(key)}: ${formatValue(change.old)} → ${formatValue(change.new)}\n`;
// //             });
// //           } else {
// //             Object.entries(fullDetails.newData || {}).forEach(([key, value]) => {
// //               description += `   • ${formatKey(key)}: ${formatValue(value)}\n`;
// //             });
// //           }
// //         }
        
// //         // Si c'est une suppression
// //         else if (item.action === 'SUPPRESSION') {
// //           description += `🗑️ Élément supprimé :\n`;
// //           if (fullDetails.data.nom || fullDetails.data.username || fullDetails.data.titre) {
// //             description += `   • Nom: ${fullDetails.data.nom || fullDetails.data.username || fullDetails.data.titre}\n`;
// //           }
// //           Object.entries(fullDetails.data).forEach(([key, value]) => {
// //             if (key !== 'nom' && key !== 'username' && key !== 'titre' && value) {
// //               description += `   • ${formatKey(key)}: ${formatValue(value)}\n`;
// //             }
// //           });
// //         }
        
// //         // Si c'est un export
// //         else if (item.action === 'EXPORTATION' || item.action === 'GENERATION') {
// //           description += `📤 Export réalisé :\n`;
// //           description += `   • Format: ${fullDetails.format || 'PDF'}\n`;
// //           description += `   • Type: ${fullDetails.reportType || fullDetails.module || item.module}\n`;
// //           if (fullDetails.filters && Object.keys(fullDetails.filters).length > 0) {
// //             description += `   • Filtres appliqués:\n`;
// //             Object.entries(fullDetails.filters).forEach(([key, value]) => {
// //               if (value) description += `     - ${formatKey(key)}: ${formatValue(value)}\n`;
// //             });
// //           }
// //         }
        
// //         // Si c'est une consultation
// //         else if (item.action === 'CONSULTATION' || item.action === 'LECTURE') {
// //           description += `👁️ Consultation :\n`;
// //           if (fullDetails.materielId || fullDetails.incidentId) {
// //             description += `   • ID: ${fullDetails.materielId || fullDetails.incidentId}\n`;
// //           }
// //           if (fullDetails.page) {
// //             description += `   • Page: ${getPageName(fullDetails.page)}\n`;
// //           }
// //         }
        
// //         // Si c'est une navigation
// //         else if (item.action === 'NAVIGATION') {
// //           description += `🧭 Navigation :\n`;
// //           description += `   • Page visitée: ${getPageName(fullDetails.page || item.details)}\n`;
// //         }
        
// //         // Si c'est une connexion/déconnexion
// //         else if (item.action === 'CONNEXION' || item.action === 'DECONNEXION') {
// //           description += `🔐 ${item.action === 'CONNEXION' ? 'Connexion' : 'Déconnexion'} :\n`;
// //           description += `   • Utilisateur: ${fullDetails.username || item.utilisateur}\n`;
// //           if (fullDetails.userData) {
// //             description += `   • Rôle: ${fullDetails.userData.role || 'Non défini'}\n`;
// //           }
// //         }
// //       }
      
// //       // Données brutes si disponibles
// //       if (Object.keys(fullDetails).length > 0 && 
// //           !['data', 'changes', 'filters', 'page', 'username', 'userData'].some(key => key in fullDetails)) {
// //         description += `\n=== DONNÉES COMPLÈTES ===\n`;
// //         description += JSON.stringify(fullDetails, null, 2);
// //       }
      
// //       return description;
      
// //     } catch (error) {
// //       return `=== ERREUR DE FORMATAGE ===\n${item.details || 'Aucun détail disponible'}\n\nDonnées brutes: ${item.fullDetails || 'Aucune'}`;
// //     }
// //   };

// //   // Formater les clés pour l'affichage
// //   const formatKey = (key) => {
// //     const keyMap = {
// //       'nom': 'Nom',
// //       'username': 'Nom d\'utilisateur',
// //       'email': 'Email',
// //       'type': 'Type',
// //       'marque': 'Marque',
// //       'reference': 'Référence',
// //       'etat': 'État',
// //       'service_attribue': 'Service',
// //       'description': 'Description',
// //       'titre': 'Titre',
// //       'priorite': 'Priorité',
// //       'statut': 'Statut',
// //       'date_creation': 'Date création',
// //       'date_achat': 'Date achat',
// //       'cout': 'Coût',
// //       'role': 'Rôle',
// //       'departement': 'Département'
// //     };
    
// //     return keyMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
// //   };

// //   // Formater les valeurs pour l'affichage
// //   const formatValue = (value) => {
// //     if (value === null || value === undefined) return 'Non défini';
// //     if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
// //     if (typeof value === 'object') return JSON.stringify(value);
// //     if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
// //       try {
// //         return new Date(value).toLocaleDateString('fr-FR');
// //       } catch {
// //         return value;
// //       }
// //     }
// //     return value.toString();
// //   };

// //   // Obtenir un résumé court pour l'affichage dans le tableau
// //   const getShortSummary = (item) => {
// //     try {
// //       const fullDetails = item.fullDetails ? JSON.parse(item.fullDetails) : {};
      
// //       // Pour les ajouts
// //       if (item.action === 'AJOUT') {
// //         const data = fullDetails.data || {};
// //         if (data.nom) return `a ajouté "${data.nom}"`;
// //         if (data.username) return `a ajouté l'utilisateur "${data.username}"`;
// //         if (data.titre) return `a ajouté "${data.titre}"`;
// //         return `a ajouté un nouvel élément`;
// //       }
      
// //       // Pour les modifications
// //       else if (item.action === 'MODIFICATION') {
// //         const changes = fullDetails.changes || {};
// //         if (Object.keys(changes).length > 0) {
// //           const firstChange = Object.keys(changes)[0];
// //           return `a modifié ${formatKey(firstChange).toLowerCase()}`;
// //         }
// //         if (fullDetails.newData?.nom) return `a modifié "${fullDetails.newData.nom}"`;
// //         return `a modifié un élément`;
// //       }
      
// //       // Pour les suppressions
// //       else if (item.action === 'SUPPRESSION') {
// //         const data = fullDetails.data || {};
// //         if (data.nom) return `a supprimé "${data.nom}"`;
// //         if (data.username) return `a supprimé l'utilisateur "${data.username}"`;
// //         return `a supprimé un élément`;
// //       }
      
// //       // Pour les exports
// //       else if (item.action === 'EXPORTATION' || item.action === 'GENERATION') {
// //         const format = fullDetails.format || 'PDF';
// //         const type = fullDetails.reportType || item.module;
// //         return `a exporté ${type} en ${format}`;
// //       }
      
// //       // Pour la navigation
// //       else if (item.action === 'NAVIGATION') {
// //         const page = fullDetails.page || item.details;
// //         const pageName = getPageName(page);
// //         return `a visité ${pageName}`;
// //       }
      
// //       // Pour la consultation
// //       else if (item.action === 'CONSULTATION' || item.action === 'LECTURE') {
// //         if (fullDetails.materielId) return `a consulté le matériel #${fullDetails.materielId}`;
// //         if (fullDetails.incidentId) return `a consulté l'incident #${fullDetails.incidentId}`;
// //         return `a consulté des données`;
// //       }
      
// //       // Pour la connexion/déconnexion
// //       else if (item.action === 'CONNEXION') {
// //         return `s'est connecté(e)`;
// //       } else if (item.action === 'DECONNEXION') {
// //         return `s'est déconnecté(e)`;
// //       }
      
// //       // Pour la création de compte
// //       else if (item.action === 'CREATION COMPTE') {
// //         if (fullDetails.newUser?.username) return `a créé le compte "${fullDetails.newUser.username}"`;
// //         return `a créé un compte utilisateur`;
// //       }
      
// //       // Fallback
// //       return item.details || `${item.action} dans ${item.module}`;
      
// //     } catch (error) {
// //       return item.details || `${item.action} dans ${item.module}`;
// //     }
// //   };

// //   // Basculer l'expansion d'une ligne
// //   const toggleRowExpansion = (id) => {
// //     setExpandedRows(prev => ({
// //       ...prev,
// //       [id]: !prev[id]
// //     }));
// //   };

// //   // Basculer la sélection d'une action
// //   const toggleActionSelection = (id) => {
// //     setSelectedActions(prev => 
// //       prev.includes(id) 
// //         ? prev.filter(item => item !== id)
// //         : [...prev, id]
// //     );
// //   };

// //   // Sélectionner/déselectionner tout
// //   const toggleSelectAll = () => {
// //     if (selectedActions.length === historique.length) {
// //       setSelectedActions([]);
// //     } else {
// //       setSelectedActions(historique.map(item => item.id));
// //     }
// //   };

// //   // Obtenir les noms d'utilisateurs uniques (CORRECTION DE L'ERREUR)
// //   const getUniqueUsernames = () => {
// //     try {
// //       const STORAGE_KEY = 'gestion_parc_historique';
// //       const saved = localStorage.getItem(STORAGE_KEY);
// //       if (!saved) return [];
      
// //       const data = JSON.parse(saved);
// //       const usernames = new Set();
      
// //       data.forEach(item => {
// //         if (item.utilisateur) {
// //           // Si c'est un objet, extraire le nom
// //           if (typeof item.utilisateur === 'object') {
// //             usernames.add(item.utilisateur.username || item.utilisateur.nom || 'Inconnu');
// //           } else {
// //             // Si c'est déjà une string
// //             usernames.add(item.utilisateur);
// //           }
// //         }
// //       });
      
// //       return Array.from(usernames).sort();
// //     } catch (error) {
// //       console.error('Erreur extraction utilisateurs:', error);
// //       return [];
// //     }
// //   };

// //   // Obtenir les options uniques pour les filtres
// //   const getUniqueOptions = (field) => {
// //     const STORAGE_KEY = 'gestion_parc_historique';
// //     const saved = localStorage.getItem(STORAGE_KEY);
// //     const data = saved ? JSON.parse(saved) : [];
    
// //     const values = data.map(item => item[field]).filter(Boolean);
// //     return [...new Set(values)].sort();
// //   };

// //   // Générer rapport PDF
// //   const generatePDFReport = () => {
// //     const doc = new jsPDF('landscape');
    
// //     // En-tête
// //     doc.setFontSize(20);
// //     doc.text('HISTORIQUE DES ACTIONS CRUD - DREN AA', 20, 20);
    
// //     doc.setFontSize(12);
// //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
// //     doc.text(`Généré par: ${user?.username || 'Utilisateur'}`, 20, 38);
// //     doc.text(`Total actions: ${stats.totalActions}`, 20, 46);
    
// //     // Filtres appliqués
// //     let yPos = 60;
// //     if (Object.values(filters).some(f => f)) {
// //       doc.setFontSize(14);
// //       doc.text('FILTRES APPLIQUÉS', 20, yPos);
// //       yPos += 10;
      
// //       doc.setFontSize(10);
// //       if (filters.search) {
// //         doc.text(`Recherche: ${filters.search}`, 20, yPos);
// //         yPos += 6;
// //       }
// //       if (filters.utilisateur) {
// //         doc.text(`Utilisateur: ${filters.utilisateur}`, 20, yPos);
// //         yPos += 6;
// //       }
// //       if (filters.action) {
// //         doc.text(`Action: ${filters.action}`, 20, yPos);
// //         yPos += 6;
// //       }
// //       if (filters.module) {
// //         doc.text(`Module: ${filters.module}`, 20, yPos);
// //         yPos += 6;
// //       }
// //       yPos += 10;
// //     }
    
// //     // Tableau
// //     const tableData = historique.map(item => [
// //       formatDate(item.date),
// //       item.utilisateur,
// //       item.action,
// //       item.module,
// //       getShortSummary(item).substring(0, 60) + (getShortSummary(item).length > 60 ? '...' : ''),
// //       item.status
// //     ]);
    
// //     autoTable(doc, {
// //       head: [['Date', 'Utilisateur', 'Action', 'Module', 'Description', 'Statut']],
// //       body: tableData,
// //       startY: yPos,
// //       theme: 'grid',
// //       headStyles: { fillColor: [59, 130, 246] },
// //       styles: { fontSize: 8 }
// //     });
    
// //     // Pied de page
// //     const pageCount = doc.internal.getNumberOfPages();
// //     for (let i = 1; i <= pageCount; i++) {
// //       doc.setPage(i);
// //       doc.setFontSize(8);
// //       doc.setTextColor(150, 150, 150);
// //       doc.text(
// //         `Système de Gestion DREN AA - Historique CRUD - Page ${i}/${pageCount}`,
// //         20,
// //         doc.internal.pageSize.height - 10
// //       );
// //     }
    
// //     doc.save(`historique-crud-${new Date().toISOString().split('T')[0]}.pdf`);
// //   };

// //   // Générer rapport Excel
// //   const generateExcelReport = () => {
// //     const wsData = historique.map(item => {
// //       try {
// //         const fullDetails = item.fullDetails ? JSON.parse(item.fullDetails) : {};
// //         return {
// //           Date: formatDate(item.date),
// //           Utilisateur: item.utilisateur,
// //           Action: item.action,
// //           Module: item.module,
// //           Description: getShortSummary(item),
// //           'Résumé détaillé': getFullActionDescription(item),
// //           Statut: item.status,
// //           IP: item.ip_address,
// //           'User Agent': item.user_agent
// //         };
// //       } catch {
// //         return {
// //           Date: formatDate(item.date),
// //           Utilisateur: item.utilisateur,
// //           Action: item.action,
// //           Module: item.module,
// //           Description: getShortSummary(item),
// //           Statut: item.status
// //         };
// //       }
// //     });
    
// //     const ws = XLSX.utils.json_to_sheet(wsData);
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, 'Historique CRUD');
    
// //     XLSX.writeFile(wb, `historique-crud-${new Date().toISOString().split('T')[0]}.xlsx`);
// //   };

// //   // Effacer l'historique
// //   const clearHistorique = () => {
// //     if (window.confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ? Cette action est irréversible.')) {
// //       localStorage.removeItem('gestion_parc_historique');
// //       alert('✅ Historique effacé avec succès');
// //       loadHistorique(1);
// //     }
// //   };

// //   // Exporter l'historique en JSON
// //   const exportToJSON = () => {
// //     const STORAGE_KEY = 'gestion_parc_historique';
// //     const data = localStorage.getItem(STORAGE_KEY) || '[]';
// //     const blob = new Blob([data], { type: 'application/json' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `historique-backup-${new Date().toISOString().split('T')[0]}.json`;
// //     a.click();
// //   };

// //   // Importer l'historique depuis JSON
// //   const importFromJSON = () => {
// //     const input = document.createElement('input');
// //     input.type = 'file';
// //     input.accept = '.json';
    
// //     input.onchange = (e) => {
// //       const file = e.target.files[0];
// //       if (!file) return;
      
// //       const reader = new FileReader();
// //       reader.onload = (event) => {
// //         try {
// //           const data = JSON.parse(event.target.result);
// //           if (Array.isArray(data)) {
// //             localStorage.setItem('gestion_parc_historique', JSON.stringify(data));
// //             alert(`✅ ${data.length} entrées importées avec succès`);
// //             loadHistorique(1);
// //           } else {
// //             alert('❌ Format de fichier invalide');
// //           }
// //         } catch (error) {
// //           alert('❌ Erreur lors de l\'import: ' + error.message);
// //         }
// //       };
// //       reader.readAsText(file);
// //     };
    
// //     input.click();
// //   };

// //   // Ajouter une action de test
// //   const addTestActions = () => {
// //     if (!window.ActionLogger) {
// //       alert('ActionLogger non disponible');
// //       return;
// //     }
    
// //     const testUser = user?.username || 'admin';
    
// //     // Ajouter plusieurs actions de test
// //     window.ActionLogger.login(testUser, { role: 'admin' });
    
// //     setTimeout(() => {
// //       window.ActionLogger.createMateriel({
// //         nom: 'PC Portable Dell',
// //         type: 'Ordinateur portable',
// //         marque: 'Dell',
// //         reference: 'DELL-XPS-001',
// //         etat: 'fonctionnel',
// //         service_attribue: 'Informatique'
// //       }, testUser);
// //     }, 1000);
    
// //     setTimeout(() => {
// //       window.ActionLogger.updateMateriel(
// //         'MAT-001',
// //         { nom: 'PC Portable Dell', etat: 'fonctionnel' },
// //         { nom: 'PC Portable Dell XPS', etat: 'maintenance' },
// //         testUser
// //       );
// //     }, 2000);
    
// //     setTimeout(() => {
// //       window.ActionLogger.generateReport('Matériels', 'PDF', { service: 'Informatique' }, testUser);
// //     }, 3000);
    
// //     setTimeout(() => {
// //       window.ActionLogger.viewPage('/dashboard', testUser);
// //     }, 4000);
    
// //     alert('✅ 5 actions de test ajoutées !');
// //     setTimeout(() => loadHistorique(1), 5000);
// //   };

// //   // Charger au démarrage
// //   useEffect(() => {
// //     loadHistorique(pagination.page);
    
// //     // Écouter les nouvelles actions
// //     const handleNewAction = () => {
// //       loadHistorique(pagination.page);
// //     };
    
// //     window.addEventListener('action-logged', handleNewAction);
    
// //     return () => {
// //       window.removeEventListener('action-logged', handleNewAction);
// //     };
// //   }, [filters, sortConfig]);

// //   // Actions disponibles pour les filtres
// //   const availableActions = [
// //     'CONNEXION', 'DECONNEXION', 'CREATION COMPTE', 
// //     'AJOUT', 'MODIFICATION', 'SUPPRESSION', 
// //     'CONSULTATION', 'EXPORTATION', 'GENERATION',
// //     'RÉSOLUTION', 'NAVIGATION', 'LECTURE'
// //   ];

// //   // Modules disponibles pour les filtres
// //   const availableModules = [
// //     'Matériels', 'Logiciels', 'Incidents', 'Réparations',
// //     'Alertes', 'Fournisseurs', 'Utilisateurs', 'Rapports',
// //     'Authentification', 'Navigation', 'Système', 'Configuration',
// //     'Dashboard', 'Réseau'
// //   ];

// //   return (
// //     <div className="p-6 bg-base-100 min-h-screen">
// //       {/* En-tête */}
// //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
// //         <div>
// //           <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
// //             <History className="h-8 w-8 text-primary" />
// //             Historique des Actions CRUD
// //             <span className="badge badge-primary badge-lg">CRUD</span>
// //           </h1>
// //           <p className="text-base-content opacity-70 mt-1">
// //             Suivi détaillé de toutes les actions: Ajout, Modification, Suppression, Export, Connexion, etc.
// //           </p>
// //           <div className="flex flex-wrap gap-2 mt-2 text-sm">
// //             <span className="badge badge-primary">
// //               {stats.totalActions} actions
// //             </span>
// //             <span className="badge badge-success">
// //               {stats.actionsParJour}/jour
// //             </span>
// //             <span className="badge badge-info">
// //               <Database className="h-3 w-3 mr-1" />
// //               {stats.storageSize}
// //             </span>
// //             <span className="badge badge-warning">
// //               {stats.utilisateursActifs.length} utilisateurs
// //             </span>
// //             <span className="badge badge-secondary">
// //               {stats.modulesPopulaires.length} modules
// //             </span>
// //           </div>
// //         </div>
// //         <div className="flex flex-wrap gap-2">
// //           <button 
// //             onClick={addTestActions}
// //             className="btn btn-warning btn-sm"
// //           >
// //             <Plus className="h-4 w-4 mr-2" />
// //             Actions test
// //           </button>
// //           <button 
// //             onClick={() => loadHistorique(1)}
// //             className="btn btn-outline btn-sm"
// //           >
// //             <RefreshCw className="h-4 w-4 mr-2" />
// //             Actualiser
// //           </button>
// //           <div className="dropdown dropdown-end">
// //             <div tabIndex={0} role="button" className="btn btn-primary btn-sm">
// //               <Download className="h-4 w-4 mr-2" />
// //               Exporter
// //             </div>
// //             <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// //               <li>
// //                 <button onClick={generatePDFReport}>
// //                   <FileText className="h-4 w-4" />
// //                   PDF
// //                 </button>
// //               </li>
// //               <li>
// //                 <button onClick={generateExcelReport}>
// //                   <FileSpreadsheet className="h-4 w-4" />
// //                   Excel
// //                 </button>
// //               </li>
// //               <li>
// //                 <button onClick={exportToJSON}>
// //                   <Save className="h-4 w-4" />
// //                   JSON
// //                 </button>
// //               </li>
// //             </ul>
// //           </div>
// //           <div className="dropdown dropdown-end">
// //             <div tabIndex={0} role="button" className="btn btn-error btn-sm">
// //               <Settings className="h-4 w-4 mr-2" />
// //               Gestion
// //             </div>
// //             <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// //               <li>
// //                 <button onClick={clearHistorique}>
// //                   <Trash2 className="h-4 w-4" />
// //                   Effacer tout
// //                 </button>
// //               </li>
// //               <li>
// //                 <button onClick={importFromJSON}>
// //                   <Upload className="h-4 w-4" />
// //                   Importer JSON
// //                 </button>
// //               </li>
// //             </ul>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Statistiques */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //         <div className="stat bg-base-200 rounded-lg p-4">
// //           <div className="stat-figure text-primary">
// //             <History className="h-8 w-8" />
// //           </div>
// //           <div className="stat-title">Actions totales</div>
// //           <div className="stat-value text-3xl">{stats.totalActions}</div>
// //           <div className="stat-desc">Toutes opérations CRUD</div>
// //         </div>

// //         <div className="stat bg-base-200 rounded-lg p-4">
// //           <div className="stat-figure text-success">
// //             <Clock className="h-8 w-8" />
// //           </div>
// //           <div className="stat-title">Activité/jour</div>
// //           <div className="stat-value text-3xl">{stats.actionsParJour}</div>
// //           <div className="stat-desc">Moyenne 7 jours</div>
// //         </div>

// //         <div className="stat bg-base-200 rounded-lg p-4">
// //           <div className="stat-figure text-warning">
// //             <Database className="h-8 w-8" />
// //           </div>
// //           <div className="stat-title">Stockage</div>
// //           <div className="stat-value text-xl">{stats.storageSize}</div>
// //           <div className="stat-desc">Taille données</div>
// //         </div>

// //         <div className="stat bg-base-200 rounded-lg p-4">
// //           <div className="stat-figure text-info">
// //             <User className="h-8 w-8" />
// //           </div>
// //           <div className="stat-title">Utilisateurs</div>
// //           <div className="stat-value text-3xl">{stats.utilisateursActifs.length}</div>
// //           <div className="stat-desc">Actifs récents</div>
// //         </div>
// //       </div>

// //       {/* Filtres */}
// //       <div className="card bg-base-200 shadow-xl mb-6">
// //         <div className="card-body">
// //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
// //             <h2 className="card-title text-base-content">
// //               <Filter className="h-5 w-5" />
// //               Filtres de recherche avancés
// //             </h2>
// //             <div className="flex gap-2">
// //               <button 
// //                 onClick={() => loadHistorique(1)}
// //                 className="btn btn-primary btn-sm"
// //               >
// //                 <Filter className="h-4 w-4 mr-2" />
// //                 Appliquer
// //               </button>
// //               <button 
// //                 onClick={() => {
// //                   setFilters({
// //                     search: '',
// //                     utilisateur: '',
// //                     action: '',
// //                     module: '',
// //                     dateDebut: '',
// //                     dateFin: '',
// //                     status: ''
// //                   });
// //                   setTimeout(() => loadHistorique(1), 100);
// //                 }}
// //                 className="btn btn-outline btn-sm"
// //               >
// //                 Réinitialiser
// //               </button>
// //             </div>
// //           </div>
          
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //             {/* Recherche */}
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text flex items-center">
// //                   <Search className="h-4 w-4 mr-2" />
// //                   Recherche globale
// //                 </span>
// //               </label>
// //               <input
// //                 type="text"
// //                 placeholder="Rechercher dans tous les champs..."
// //                 className="input input-bordered bg-base-100"
// //                 value={filters.search}
// //                 onChange={(e) => setFilters({...filters, search: e.target.value})}
// //               />
// //             </div>

// //             {/* Utilisateur - CORRIGÉ */}
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text flex items-center">
// //                   <User className="h-4 w-4 mr-2" />
// //                   Utilisateur
// //                 </span>
// //               </label>
// //               <select
// //                 className="select select-bordered bg-base-100"
// //                 value={filters.utilisateur}
// //                 onChange={(e) => setFilters({...filters, utilisateur: e.target.value})}
// //               >
// //                 <option value="">Tous les utilisateurs</option>
// //                 {getUniqueUsernames().map(user => (
// //                   <option key={user} value={user}>{user}</option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Action */}
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Type d'action</span>
// //               </label>
// //               <select
// //                 className="select select-bordered bg-base-100"
// //                 value={filters.action}
// //                 onChange={(e) => setFilters({...filters, action: e.target.value})}
// //               >
// //                 <option value="">Toutes les actions</option>
// //                 {availableActions.map(action => (
// //                   <option key={action} value={action}>{action}</option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Module */}
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text">Module</span>
// //               </label>
// //               <select
// //                 className="select select-bordered bg-base-100"
// //                 value={filters.module}
// //                 onChange={(e) => setFilters({...filters, module: e.target.value})}
// //               >
// //                 <option value="">Tous les modules</option>
// //                 {availableModules.map(module => (
// //                   <option key={module} value={module}>{module}</option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           {/* Dates */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text flex items-center">
// //                   <Calendar className="h-4 w-4 mr-2" />
// //                   Période de début
// //                 </span>
// //               </label>
// //               <input
// //                 type="date"
// //                 className="input input-bordered bg-base-100"
// //                 value={filters.dateDebut}
// //                 onChange={(e) => setFilters({...filters, dateDebut: e.target.value})}
// //               />
// //             </div>

// //             <div className="form-control">
// //               <label className="label">
// //                 <span className="label-text flex items-center">
// //                   <Calendar className="h-4 w-4 mr-2" />
// //                   Période de fin
// //                 </span>
// //               </label>
// //               <input
// //                 type="date"
// //                 className="input input-bordered bg-base-100"
// //                 value={filters.dateFin}
// //                 onChange={(e) => setFilters({...filters, dateFin: e.target.value})}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Actions sélectionnées */}
// //       {selectedActions.length > 0 && (
// //         <div className="mb-4 p-4 bg-warning/20 rounded-lg border border-warning">
// //           <div className="flex justify-between items-center">
// //             <div className="flex items-center gap-2">
// //               <CheckCircle className="h-5 w-5 text-warning" />
// //               <span className="font-semibold">{selectedActions.length} action(s) sélectionnée(s)</span>
// //             </div>
// //             <div className="flex gap-2">
// //               <button 
// //                 onClick={() => {
// //                   const selectedItems = historique.filter(item => selectedActions.includes(item.id));
// //                   const data = selectedItems.map(item => getFullActionDescription(item)).join('\n\n---\n\n');
// //                   navigator.clipboard.writeText(data);
// //                   alert('✅ Données copiées !');
// //                 }}
// //                 className="btn btn-sm btn-outline"
// //               >
// //                 <Copy className="h-4 w-4 mr-2" />
// //                 Copier
// //               </button>
// //               <button 
// //                 onClick={() => setSelectedActions([])}
// //                 className="btn btn-sm btn-ghost"
// //               >
// //                 Tout désélectionner
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Tableau d'historique */}
// //       <div className="card bg-base-100 shadow-xl border border-base-300">
// //         <div className="card-body p-0">
// //           {loading ? (
// //             <div className="flex items-center justify-center py-12">
// //               <div className="text-center">
// //                 <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
// //                 <p className="text-lg">Chargement de l'historique...</p>
// //               </div>
// //             </div>
// //           ) : error ? (
// //             <div className="alert alert-error m-4">
// //               <AlertTriangle className="h-6 w-6" />
// //               <div>
// //                 <h3 className="font-bold">Erreur de chargement</h3>
// //                 <div className="text-sm">{error}</div>
// //               </div>
// //             </div>
// //           ) : historique.length === 0 ? (
// //             <div className="text-center py-12">
// //               <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
// //               <h3 className="text-lg font-semibold mb-2">Aucune action enregistrée</h3>
// //               <p className="text-gray-500 mb-4">Les actions CRUD apparaîtront ici automatiquement.</p>
// //               <button 
// //                 onClick={addTestActions}
// //                 className="btn btn-primary"
// //               >
// //                 <Plus className="h-4 w-4 mr-2" />
// //                 Ajouter des actions de test
// //               </button>
// //             </div>
// //           ) : (
// //             <>
// //               <div className="overflow-x-auto">
// //                 <table className="table table-zebra w-full">
// //                   <thead>
// //                     <tr className="bg-base-200">
// //                       <th className="w-12">
// //                         <input
// //                           type="checkbox"
// //                           className="checkbox checkbox-sm"
// //                           checked={selectedActions.length === historique.length && historique.length > 0}
// //                           onChange={toggleSelectAll}
// //                         />
// //                       </th>
// //                       <th className="cursor-pointer hover:bg-base-300" onClick={() => {
// //                         setSortConfig(prev => ({
// //                           key: 'date',
// //                           direction: prev.key === 'date' && prev.direction === 'desc' ? 'asc' : 'desc'
// //                         }));
// //                       }}>
// //                         <div className="flex items-center gap-1">
// //                           Date et Heure
// //                           <ArrowUpDown className="h-4 w-4" />
// //                           {sortConfig.key === 'date' && (
// //                             <span className="text-xs">{sortConfig.direction === 'desc' ? '↓' : '↑'}</span>
// //                           )}
// //                         </div>
// //                       </th>
// //                       <th>Utilisateur</th>
// //                       <th>Action</th>
// //                       <th>Module</th>
// //                       <th className="flex-1 min-w-[300px]">Description de l'action</th>
// //                       <th>Statut</th>
// //                       <th className="w-24">Détails</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {historique.map((item) => (
// //                       <React.Fragment key={item.id}>
// //                         <tr className="hover:bg-base-200">
// //                           <td>
// //                             <input
// //                               type="checkbox"
// //                               className="checkbox checkbox-sm"
// //                               checked={selectedActions.includes(item.id)}
// //                               onChange={() => toggleActionSelection(item.id)}
// //                             />
// //                           </td>
// //                           <td className="whitespace-nowrap">
// //                             <div className="flex flex-col">
// //                               <span className="font-medium text-sm">{formatDate(item.date)}</span>
// //                               <span className="text-xs opacity-70">
// //                                 {formatRelativeTime(item.date)}
// //                               </span>
// //                             </div>
// //                           </td>
// //                           <td>
// //                             <div className="flex items-center gap-2">
// //                               <User className="h-4 w-4 opacity-70" />
// //                               <span className="font-medium">{item.utilisateur}</span>
// //                             </div>
// //                           </td>
// //                           <td>
// //                             <div className={`badge ${getActionColor(item.action)} gap-2`}>
// //                               {getActionIcon(item.action)}
// //                               {item.action}
// //                             </div>
// //                           </td>
// //                           <td>
// //                             <div className="badge badge-outline gap-2">
// //                               {getModuleIcon(item.module)}
// //                               {item.module}
// //                             </div>
// //                           </td>
// //                           <td>
// //                             <div className="flex flex-col">
// //                               <div className="font-medium">
// //                                 {getActionDescription(item)}
// //                               </div>
// //                               <div className="text-sm opacity-70 mt-1">
// //                                 {getShortSummary(item)}
// //                               </div>
// //                               {expandedRows[item.id] && (
// //                                 <div className="mt-3 p-3 bg-base-200 rounded-lg text-xs font-mono whitespace-pre-wrap max-h-96 overflow-auto border border-base-300">
// //                                   {getFullActionDescription(item)}
// //                                 </div>
// //                               )}
// //                             </div>
// //                           </td>
// //                           <td>
// //                             <div className={`badge ${item.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>
// //                               {item.status || 'SUCCESS'}
// //                             </div>
// //                           </td>
// //                           <td>
// //                             <div className="flex gap-1">
// //                               <button
// //                                 onClick={() => toggleRowExpansion(item.id)}
// //                                 className="btn btn-ghost btn-xs"
// //                                 title={expandedRows[item.id] ? "Réduire les détails" : "Voir tous les détails"}
// //                               >
// //                                 {expandedRows[item.id] ? (
// //                                   <ChevronUp className="h-4 w-4" />
// //                                 ) : (
// //                                   <Eye className="h-4 w-4" />
// //                                 )}
// //                               </button>
// //                               <button
// //                                 onClick={() => {
// //                                   navigator.clipboard.writeText(getFullActionDescription(item));
// //                                   alert('✅ Tous les détails ont été copiés !');
// //                                 }}
// //                                 className="btn btn-ghost btn-xs"
// //                                 title="Copier tous les détails"
// //                               >
// //                                 <Copy className="h-4 w-4" />
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       </React.Fragment>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               {/* Pagination */}
// //               <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-base-300 gap-4">
// //                 <div className="text-sm text-base-content opacity-70">
// //                   Affichage de {historique.length} sur {stats.totalActions} actions
// //                 </div>
// //                 <div className="join">
// //                   <button
// //                     className="join-item btn btn-sm"
// //                     onClick={() => loadHistorique(pagination.page - 1)}
// //                     disabled={pagination.page <= 1}
// //                   >
// //                     «
// //                   </button>
// //                   <button className="join-item btn btn-sm">
// //                     Page {pagination.page} sur {pagination.totalPages}
// //                   </button>
// //                   <button
// //                     className="join-item btn btn-sm"
// //                     onClick={() => loadHistorique(pagination.page + 1)}
// //                     disabled={pagination.page >= pagination.totalPages}
// //                   >
// //                     »
// //                   </button>
// //                 </div>
// //                 <div className="text-sm">
// //                   <select
// //                     className="select select-bordered select-sm"
// //                     value={pagination.limit}
// //                     onChange={(e) => {
// //                       setPagination(prev => ({ ...prev, limit: parseInt(e.target.value) }));
// //                       loadHistorique(1);
// //                     }}
// //                   >
// //                     <option value={10}>10 par page</option>
// //                     <option value={20}>20 par page</option>
// //                     <option value={50}>50 par page</option>
// //                     <option value={100}>100 par page</option>
// //                   </select>
// //                 </div>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>

// //       {/* Exemples d'affichage */}
// //       <div className="mt-6 p-4 bg-base-200 rounded-lg">
// //         <h3 className="font-semibold mb-3">📋 Exemples d'affichage des actions CRUD :</h3>
// //         <div className="space-y-2 text-sm">
// //           <div className="p-2 bg-base-100 rounded">
// //             <div className="font-medium">👤 odonardo <span className="badge badge-primary badge-sm">AJOUT</span></div>
// //             <div className="opacity-70">a ajouté "PC Portable Dell" dans Matériels</div>
// //             <div className="text-xs mt-1">📅 19/01/2026 18:47 | ✅ SUCCESS</div>
// //           </div>
// //           <div className="p-2 bg-base-100 rounded">
// //             <div className="font-medium">👤 odonardo <span className="badge badge-warning badge-sm">MODIFICATION</span></div>
// //             <div className="opacity-70">a modifié l'état de "PC Portable Dell" (fonctionnel → maintenance)</div>
// //             <div className="text-xs mt-1">📅 19/01/2026 18:48 | ✅ SUCCESS</div>
// //           </div>
// //           <div className="p-2 bg-base-100 rounded">
// //             <div className="font-medium">👤 odonardo <span className="badge badge-secondary badge-sm">EXPORTATION</span></div>
// //             <div className="opacity-70">a exporté le rapport Matériels en PDF</div>
// //             <div className="text-xs mt-1">📅 19/01/2026 18:49 | ✅ SUCCESS</div>
// //           </div>
// //           <div className="p-2 bg-base-100 rounded">
// //             <div className="font-medium">👤 odonardo <span className="badge badge-neutral badge-sm">NAVIGATION</span></div>
// //             <div className="opacity-70">a visité la page Historique</div>
// //             <div className="text-xs mt-1">📅 19/01/2026 18:50 | ✅ SUCCESS</div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Historique;





// // src/pages/Historique.jsx - VERSION CORRIGÉE
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { 
//   History, Filter, Search, Download, RefreshCw, 
//   User, Calendar, FileText, Clock, Eye, Edit, 
//   Trash2, Plus, AlertTriangle, CheckCircle, XCircle,
//   ArrowUpDown, MoreVertical, Database, Printer,
//   ExternalLink, ChevronDown, ChevronUp, Copy,
//   Save, Upload, Settings, Key, LogOut, LogIn,
//   Shield, Bell, Package, Monitor, Network,
//   Wrench, Users as UsersIcon, FileSpreadsheet,
//   BookOpen, FileEdit, FilePlus, FileMinus, FileDown,
//   Database as DatabaseIcon, HardDrive, Server, Cpu,
//   BarChart3, TrendingUp, Activity, Zap,
//   PieChart, CalendarDays, UserCheck, Target,
//   Clock3, Layers, Grid3x3, AlertCircle,
//   Star, Award, Trophy, TrendingDown, DollarSign,
//   Percent, Hash, KeyRound, ShieldCheck,
//   BarChart4, LineChart, DownloadCloud,
//   Info, HelpCircle, BellRing
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { useNotification } from '../context/NotificationContext';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import * as XLSX from 'xlsx';

// const Historique = () => {
//   const { user } = useAuth();
//   const { showNotification } = useNotification();
//   const [historique, setHistorique] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     utilisateur: '',
//     action: '',
//     module: '',
//     dateDebut: '',
//     dateFin: '',
//     status: ''
//   });
  
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     totalPages: 0
//   });
  
//   const [sortConfig, setSortConfig] = useState({
//     key: 'date',
//     direction: 'desc'
//   });
  
//   const [expandedRows, setExpandedRows] = useState({});
//   const [selectedActions, setSelectedActions] = useState([]);
//   const [viewMode, setViewMode] = useState('table');
//   const [autoRefresh, setAutoRefresh] = useState(false);
  
//   // Statistiques avancées
//   const [advancedStats, setAdvancedStats] = useState({
//     totalActions: 0,
//     actionsToday: 0,
//     actionsThisWeek: 0,
//     actionsThisMonth: 0,
//     hourlyDistribution: {},
//     dailyDistribution: {},
//     monthlyTrend: [],
//     averageActionsPerDay: 0,
//     peakHour: '',
//     peakDay: '',
//     topUsers: [],
//     mostActiveUser: { username: '', count: 0 },
//     userRetention: 0,
//     topModules: [],
//     mostUsedModule: { module: '', count: 0 },
//     moduleSuccessRate: {},
//     actionDistribution: {},
//     mostCommonAction: { action: '', count: 0 },
//     successRate: 0,
//     errorRate: 0,
//     failedLogins: 0,
//     suspiciousActivities: [],
//     securityScore: 0,
//     avgResponseTime: 0,
//     storageEfficiency: 0,
//     dataGrowthRate: 0,
//     productivityIndex: 0,
//     systemAdoptionRate: 0,
//     userSatisfaction: 0
//   });

//   // Actions disponibles
//   const availableActions = useMemo(() => [
//     'CONNEXION', 'DECONNEXION', 'CREATION COMPTE', 
//     'AJOUT', 'MODIFICATION', 'SUPPRESSION', 
//     'CONSULTATION', 'EXPORTATION', 'GENERATION',
//     'RÉSOLUTION', 'NAVIGATION', 'LECTURE',
//     'IMPORTATION', 'VALIDATION', 'REJET',
//     'APPROBATION', 'ARCHIVAGE', 'RESTAURATION'
//   ], []);

//   // Modules disponibles
//   const availableModules = useMemo(() => [
//     'Matériels', 'Logiciels', 'Incidents', 'Réparations',
//     'Alertes', 'Fournisseurs', 'Utilisateurs', 'Rapports',
//     'Authentification', 'Navigation', 'Système', 'Configuration',
//     'Dashboard', 'Réseau', 'Stockage', 'Sécurité',
//     'Audit', 'Maintenance', 'Backup', 'Monitoring'
//   ], []);

//   // Charger l'historique
//   const loadHistorique = useCallback((page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const STORAGE_KEY = 'gestion_parc_historique';
//       const saved = localStorage.getItem(STORAGE_KEY);
//       let data = saved ? JSON.parse(saved) : [];
      
//       // Appliquer les filtres
//       data = applyFilters(data, filters);
      
//       // Appliquer le tri
//       data = applySort(data, sortConfig);
      
//       // Calculer les statistiques avancées
//       calculateAdvancedStats(data);
      
//       // Pagination
//       const startIndex = (page - 1) * pagination.limit;
//       const endIndex = startIndex + pagination.limit;
//       const paginatedData = data.slice(startIndex, endIndex);
      
//       setHistorique(paginatedData);
//       setPagination(prev => ({
//         ...prev,
//         page: page,
//         total: data.length,
//         totalPages: Math.ceil(data.length / prev.limit)
//       }));
      
//     } catch (error) {
//       console.error('❌ Erreur chargement historique:', error);
//       setError('Erreur de chargement des données');
//       setHistorique([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters, sortConfig, pagination.limit]);

//   // Appliquer les filtres
//   const applyFilters = (data, filters) => {
//     let filtered = [...data];
    
//     if (filters.search) {
//       const searchTerm = filters.search.toLowerCase();
//       filtered = filtered.filter(item => 
//         item.utilisateur?.toLowerCase().includes(searchTerm) ||
//         item.action?.toLowerCase().includes(searchTerm) ||
//         item.module?.toLowerCase().includes(searchTerm) ||
//         item.details?.toLowerCase().includes(searchTerm) ||
//         false
//       );
//     }
    
//     if (filters.utilisateur) {
//       filtered = filtered.filter(item => item.utilisateur === filters.utilisateur);
//     }
    
//     if (filters.action) {
//       filtered = filtered.filter(item => item.action === filters.action);
//     }
    
//     if (filters.module) {
//       filtered = filtered.filter(item => item.module === filters.module);
//     }
    
//     if (filters.dateDebut) {
//       const startDate = new Date(filters.dateDebut);
//       filtered = filtered.filter(item => new Date(item.date) >= startDate);
//     }
    
//     if (filters.dateFin) {
//       const endDate = new Date(filters.dateFin);
//       endDate.setHours(23, 59, 59, 999);
//       filtered = filtered.filter(item => new Date(item.date) <= endDate);
//     }
    
//     if (filters.status) {
//       filtered = filtered.filter(item => item.status === filters.status);
//     }
    
//     return filtered;
//   };

//   // Appliquer le tri
//   const applySort = (data, sortConfig) => {
//     return [...data].sort((a, b) => {
//       let aValue = a[sortConfig.key];
//       let bValue = b[sortConfig.key];
      
//       if (sortConfig.key === 'date') {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }
      
//       if (sortConfig.direction === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });
//   };

//   // Calculer les statistiques avancées
//   const calculateAdvancedStats = (data) => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
//     // Distribution temporelle
//     const hourlyDistribution = {};
//     const dailyDistribution = {};
//     const monthlyTrend = [];
    
//     // Compteurs
//     const userCounts = {};
//     const moduleCounts = {};
//     const actionCounts = {};
//     const moduleSuccess = {};
//     const moduleTotal = {};
    
//     let successfulActions = 0;
//     let failedLogins = 0;
//     let suspiciousActivities = [];
    
//     data.forEach(item => {
//       const date = new Date(item.date);
//       const hour = date.getHours();
//       const day = date.toLocaleDateString('fr-FR');
      
//       // Distribution horaire
//       hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
      
//       // Distribution journalière
//       dailyDistribution[day] = (dailyDistribution[day] || 0) + 1;
      
//       // Comptage utilisateurs
//       if (item.utilisateur) {
//         userCounts[item.utilisateur] = (userCounts[item.utilisateur] || 0) + 1;
//       }
      
//       // Comptage modules
//       if (item.module) {
//         moduleCounts[item.module] = (moduleCounts[item.module] || 0) + 1;
//         moduleTotal[item.module] = (moduleTotal[item.module] || 0) + 1;
        
//         if (item.status === 'SUCCESS') {
//           moduleSuccess[item.module] = (moduleSuccess[item.module] || 0) + 1;
//         }
//       }
      
//       // Comptage actions
//       if (item.action) {
//         actionCounts[item.action] = (actionCounts[item.action] || 0) + 1;
//       }
      
//       // Succès/échecs
//       if (item.status === 'SUCCESS') {
//         successfulActions++;
//       }
      
//       // Sécurité
//       if (item.action === 'CONNEXION' && item.status === 'ERROR') {
//         failedLogins++;
//       }
      
//       // Activités suspectes
//       if (item.action === 'SUPPRESSION' || item.action === 'MODIFICATION' || item.action === 'CREATION COMPTE') {
//         if (!item.utilisateur || item.utilisateur === 'unknown') {
//           suspiciousActivities.push(item);
//         }
//       }
//     });
    
//     // Tendances mensuelles
//     const monthlyData = {};
//     data.forEach(item => {
//       const date = new Date(item.date);
//       const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//       monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
//     });
    
//     Object.entries(monthlyData).forEach(([month, count]) => {
//       monthlyTrend.push({ month, count });
//     });
    
//     // Trier et préparer les données
//     const topUsers = Object.entries(userCounts)
//       .map(([username, count]) => ({ username, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     const topModules = Object.entries(moduleCounts)
//       .map(([module, count]) => ({ module, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     // Calculs avancés
//     const totalActions = data.length;
//     const actionsToday = data.filter(item => new Date(item.date) >= today).length;
//     const actionsThisWeek = data.filter(item => new Date(item.date) >= weekAgo).length;
//     const actionsThisMonth = data.filter(item => new Date(item.date) >= monthAgo).length;
    
//     // Performance
//     const averageActionsPerDay = totalActions > 0 ? (totalActions / 30).toFixed(1) : 0;
//     const peakHour = Object.entries(hourlyDistribution)
//       .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
//     const peakDay = Object.entries(dailyDistribution)
//       .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    
//     // Utilisateurs
//     const mostActiveUser = topUsers[0] || { username: '', count: 0 };
//     const userRetention = topUsers.length > 0 ? Math.min(100, (topUsers.length / totalActions) * 1000) : 0;
    
//     // Modules
//     const mostUsedModule = topModules[0] || { module: '', count: 0 };
//     const moduleSuccessRate = {};
//     Object.keys(moduleTotal).forEach(module => {
//       const success = moduleSuccess[module] || 0;
//       const total = moduleTotal[module];
//       moduleSuccessRate[module] = total > 0 ? Math.round((success / total) * 100) : 0;
//     });
    
//     // Actions
//     const actionDistribution = actionCounts;
//     const mostCommonAction = Object.entries(actionCounts)
//       .sort(([,a], [,b]) => b - a)[0] || ['', 0];
    
//     const successRate = totalActions > 0 ? Math.round((successfulActions / totalActions) * 100) : 0;
//     const errorRate = 100 - successRate;
    
//     // Indicateurs métiers
//     const productivityIndex = Math.min(100, Math.round((actionsToday / 50) * 100));
//     const systemAdoptionRate = Math.min(100, Math.round((topUsers.length / 10) * 100));
//     const userSatisfaction = Math.min(100, Math.round(successRate * 0.8 + systemAdoptionRate * 0.2));
    
//     // Sécurité
//     const securityScore = Math.max(0, 100 - (failedLogins * 5) - (suspiciousActivities.length * 10));
    
//     setAdvancedStats({
//       totalActions,
//       actionsToday,
//       actionsThisWeek,
//       actionsThisMonth,
      
//       hourlyDistribution,
//       dailyDistribution,
//       monthlyTrend,
      
//       averageActionsPerDay,
//       peakHour: `${peakHour}h`,
//       peakDay,
      
//       topUsers,
//       mostActiveUser,
//       userRetention,
      
//       topModules,
//       mostUsedModule,
//       moduleSuccessRate,
      
//       actionDistribution,
//       mostCommonAction: { action: mostCommonAction[0], count: mostCommonAction[1] },
//       successRate,
//       errorRate,
      
//       failedLogins,
//       suspiciousActivities,
//       securityScore,
      
//       avgResponseTime: 0.5,
//       storageEfficiency: 85,
//       dataGrowthRate: 12,
      
//       productivityIndex,
//       systemAdoptionRate,
//       userSatisfaction
//     });
//   };

//   // Formater la date
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       return new Intl.DateTimeFormat('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//       }).format(date);
//     } catch {
//       return dateString;
//     }
//   };

//   // Obtenir la couleur pour l'action
//   const getActionColor = (action) => {
//     const actionColors = {
//       'CONNEXION': 'badge-success',
//       'DECONNEXION': 'badge-warning',
//       'CREATION COMPTE': 'badge-primary',
//       'AJOUT': 'badge-primary',
//       'MODIFICATION': 'badge-warning',
//       'SUPPRESSION': 'badge-error',
//       'CONSULTATION': 'badge-info',
//       'EXPORTATION': 'badge-secondary',
//       'GENERATION': 'badge-secondary',
//       'RÉSOLUTION': 'badge-success',
//       'NAVIGATION': 'badge-neutral',
//       'LECTURE': 'badge-info',
//       'IMPORTATION': 'badge-primary',
//       'VALIDATION': 'badge-success',
//       'REJET': 'badge-error',
//       'APPROBATION': 'badge-success',
//       'ARCHIVAGE': 'badge-neutral',
//       'RESTAURATION': 'badge-warning'
//     };
    
//     return actionColors[action] || 'badge-neutral';
//   };

//   // Obtenir l'icône pour l'action
//   const getActionIcon = (action) => {
//     const actionIcons = {
//       'CONNEXION': <LogIn className="h-4 w-4" />,
//       'DECONNEXION': <LogOut className="h-4 w-4" />,
//       'CREATION COMPTE': <Key className="h-4 w-4" />,
//       'AJOUT': <FilePlus className="h-4 w-4" />,
//       'MODIFICATION': <FileEdit className="h-4 w-4" />,
//       'SUPPRESSION': <FileMinus className="h-4 w-4" />,
//       'CONSULTATION': <Eye className="h-4 w-4" />,
//       'EXPORTATION': <FileDown className="h-4 w-4" />,
//       'GENERATION': <FileText className="h-4 w-4" />,
//       'RÉSOLUTION': <CheckCircle className="h-4 w-4" />,
//       'NAVIGATION': <ExternalLink className="h-4 w-4" />,
//       'LECTURE': <BookOpen className="h-4 w-4" />,
//       'IMPORTATION': <Upload className="h-4 w-4" />,
//       'VALIDATION': <CheckCircle className="h-4 w-4" />,
//       'REJET': <XCircle className="h-4 w-4" />,
//       'APPROBATION': <ShieldCheck className="h-4 w-4" />,
//       'ARCHIVAGE': <Save className="h-4 w-4" />,
//       'RESTAURATION': <History className="h-4 w-4" />
//     };
    
//     return actionIcons[action] || <FileText className="h-4 w-4" />;
//   };

//   // Obtenir la description courte
//   const getShortSummary = (item) => {
//     return `${item.utilisateur} ${item.action.toLowerCase()} dans ${item.module}`;
//   };

//   // Basculer l'auto-refresh
//   useEffect(() => {
//     let interval;
//     if (autoRefresh) {
//       interval = setInterval(() => {
//         loadHistorique(pagination.page);
//         showNotification('Historique actualisé automatiquement', 'info');
//       }, 30000);
//     }
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [autoRefresh, pagination.page, loadHistorique, showNotification]);

//   // Charger au démarrage
//   useEffect(() => {
//     loadHistorique(pagination.page);
    
//     // Écouter les nouvelles actions
//     const handleNewAction = () => {
//       loadHistorique(pagination.page);
//     };
    
//     window.addEventListener('action-logged', handleNewAction);
    
//     return () => {
//       window.removeEventListener('action-logged', handleNewAction);
//     };
//   }, [loadHistorique, pagination.page]);

//   // Générer rapport détaillé - CORRECTION DE L'ERREUR ICI
//   const generateDetailedReport = () => {
//     const doc = new jsPDF();
    
//     // En-tête
//     doc.setFontSize(20);
//     doc.text('RAPPORT STATISTIQUES AVANCÉES - DREN AA', 20, 20);
    
//     // Statistiques générales
//     doc.setFontSize(12);
//     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
//     // CORRECTION: Échapper l'apostrophe avec \'
//     doc.text(`Période analysée: ${filters.dateDebut || 'Début'} - ${filters.dateFin || 'Aujourd\'hui'}`, 20, 42);
//     doc.text(`Total actions: ${advancedStats.totalActions}`, 20, 49);
    
//     // Tableau de bord
//     doc.setFontSize(16);
//     doc.text('TABLEAU DE BORD DES PERFORMANCES', 20, 65);
    
//     let yPos = 75;
    
//     // Indicateurs clés
//     const keyStats = [
//       ['Indicateur', 'Valeur', 'Statut'],
//       ['Actions aujourd\'hui', advancedStats.actionsToday, advancedStats.actionsToday > 20 ? '🔴 Haut' : '🟢 Normal'],
//       ['Taux de succès', `${advancedStats.successRate}%`, advancedStats.successRate > 90 ? '🟢 Excellent' : '🟡 Moyen'],
//       ['Score sécurité', `${advancedStats.securityScore}/100`, advancedStats.securityScore > 80 ? '🟢 Sécurisé' : '🟡 À surveiller'],
//       ['Productivité', `${advancedStats.productivityIndex}%`, advancedStats.productivityIndex > 70 ? '🟢 Bonne' : '🟡 Modérée'],
//       ['Utilisateurs actifs', advancedStats.topUsers.length, '🟢 Actif']
//     ];
    
//     autoTable(doc, {
//       head: keyStats.slice(0, 1),
//       body: keyStats.slice(1),
//       startY: yPos,
//       theme: 'grid'
//     });
    
//     yPos = doc.lastAutoTable.finalY + 10;
    
//     // Top utilisateurs
//     doc.setFontSize(14);
//     doc.text('TOP 5 UTILISATEURS', 20, yPos);
//     yPos += 10;
    
//     const userData = advancedStats.topUsers.map(user => [user.username, user.count, `${Math.round((user.count / advancedStats.totalActions) * 100)}%`]);
    
//     autoTable(doc, {
//       head: [['Utilisateur', 'Actions', 'Part']],
//       body: userData,
//       startY: yPos,
//       theme: 'striped'
//     });
    
//     // Enregistrer
//     doc.save(`rapport-statistiques-${new Date().toISOString().split('T')[0]}.pdf`);
//     showNotification('Rapport PDF généré avec succès', 'success');
//   };

//   // Composant StatCard réutilisable
//   const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
//     <div className={`stat bg-base-200 rounded-lg p-4 border-l-4 ${color}`}>
//       <div className="stat-figure text-opacity-80">
//         {icon}
//       </div>
//       <div className="stat-title">{title}</div>
//       <div className="stat-value text-2xl md:text-3xl">{value}</div>
//       {subtitle && <div className="stat-desc">{subtitle}</div>}
//       {trend && (
//         <div className={`stat-desc flex items-center gap-1 ${trend > 0 ? 'text-success' : 'text-error'}`}>
//           <TrendingUp className="h-3 w-3" />
//           {trend > 0 ? '+' : ''}{trend}%
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
//       {/* En-tête */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
//             <BarChart3 className="h-8 w-8 text-primary" />
//             Tableau de Bord Historique
//             <span className="badge badge-primary badge-lg">Analytics</span>
//           </h1>
//           <p className="text-base-content opacity-70 mt-1">
//             Surveillance avancée des performances et activités système
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <div className="form-control">
//             <label className="label cursor-pointer gap-2">
//               <span className="label-text text-sm">Auto-refresh</span>
//               <input 
//                 type="checkbox" 
//                 className="toggle toggle-primary toggle-sm"
//                 checked={autoRefresh}
//                 onChange={(e) => setAutoRefresh(e.target.checked)}
//               />
//             </label>
//           </div>
//           <select 
//             className="select select-bordered select-sm"
//             value={viewMode}
//             onChange={(e) => setViewMode(e.target.value)}
//           >
//             <option value="table">📊 Tableau</option>
//             <option value="cards">🃏 Cartes</option>
//             <option value="timeline">📅 Timeline</option>
//           </select>
//           <button 
//             onClick={generateDetailedReport}
//             className="btn btn-primary btn-sm"
//           >
//             <FileText className="h-4 w-4 mr-2" />
//             Rapport complet
//           </button>
//           <button 
//             onClick={() => loadHistorique(1)}
//             className="btn btn-outline btn-sm"
//           >
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Actualiser
//           </button>
//         </div>
//       </div>

//       {/* Indicateurs clés */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
//         <StatCard
//           title="Actions totales"
//           value={advancedStats.totalActions}
//           icon={<History className="h-6 w-6" />}
//           color="border-l-primary"
//           subtitle="Toutes opérations"
//         />
        
//         <StatCard
//           title="Aujourd'hui"
//           value={advancedStats.actionsToday}
//           icon={<Activity className="h-6 w-6" />}
//           color="border-l-success"
//           subtitle="Dernières 24h"
//           trend={12}
//         />
        
//         <StatCard
//           title="Taux succès"
//           value={`${advancedStats.successRate}%`}
//           icon={<CheckCircle className="h-6 w-6" />}
//           color="border-l-success"
//           subtitle="Opérations réussies"
//         />
        
//         <StatCard
//           title="Productivité"
//           value={`${advancedStats.productivityIndex}%`}
//           icon={<TrendingUp className="h-6 w-6" />}
//           color="border-l-warning"
//           subtitle="Index performance"
//         />
        
//         <StatCard
//           title="Sécurité"
//           value={`${advancedStats.securityScore}/100`}
//           icon={<ShieldCheck className="h-6 w-6" />}
//           color="border-l-error"
//           subtitle="Score système"
//         />
        
//         <StatCard
//           title="Adoption"
//           value={`${advancedStats.systemAdoptionRate}%`}
//           icon={<UserCheck className="h-6 w-6" />}
//           color="border-l-info"
//           subtitle="Taux d'utilisation"
//         />
//       </div>

//       {/* Statistiques détaillées */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         {/* Top utilisateurs */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body">
//             <h2 className="card-title">
//               <User className="h-5 w-5" />
//               Top Utilisateurs
//               <div className="badge badge-primary">{advancedStats.topUsers.length}</div>
//             </h2>
//             <div className="space-y-3">
//               {advancedStats.topUsers.map((user, index) => (
//                 <div key={user.username} className="flex items-center justify-between p-2 bg-base-100 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                       index === 0 ? 'bg-primary text-primary-content' : 'bg-base-300'
//                     }`}>
//                       {index + 1}
//                     </div>
//                     <div>
//                       <div className="font-semibold">{user.username}</div>
//                       <div className="text-xs opacity-70">{user.count} actions</div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-semibold">
//                       {Math.round((user.count / advancedStats.totalActions) * 100)}%
//                     </div>
//                     <progress 
//                       className="progress progress-primary w-24" 
//                       value={user.count} 
//                       max={advancedStats.mostActiveUser.count || 1}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Distribution des modules */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body">
//             <h2 className="card-title">
//               <Layers className="h-5 w-5" />
//               Modules les plus utilisés
//             </h2>
//             <div className="space-y-3">
//               {advancedStats.topModules.map((module, index) => (
//                 <div key={module.module} className="flex items-center justify-between p-2 bg-base-100 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                       index === 0 ? 'bg-secondary text-secondary-content' : 'bg-base-300'
//                     }`}>
//                       {getModuleIcon(module.module)}
//                     </div>
//                     <div className="flex-1">
//                       <div className="font-semibold">{module.module}</div>
//                       <div className="text-xs opacity-70">
//                         Taux succès: {advancedStats.moduleSuccessRate[module.module] || 0}%
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-semibold">{module.count}</div>
//                     <progress 
//                       className="progress progress-secondary w-24" 
//                       value={module.count} 
//                       max={advancedStats.mostUsedModule.count || 1}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Analyse temporelle */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body">
//             <h2 className="card-title">
//               <Clock3 className="h-5 w-5" />
//               Analyse temporelle
//             </h2>
//             <div className="space-y-4">
//               <div className="bg-base-100 p-3 rounded-lg">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm font-semibold">Pic d'activité</span>
//                   <span className="badge badge-primary">{advancedStats.peakHour}</span>
//                 </div>
//                 <div className="text-xs opacity-70">Heure de plus forte activité</div>
//               </div>
              
//               <div className="bg-base-100 p-3 rounded-lg">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm font-semibold">Moyenne journalière</span>
//                   <span className="badge badge-secondary">{advancedStats.averageActionsPerDay}</span>
//                 </div>
//                 <div className="text-xs opacity-70">Actions par jour (30 derniers jours)</div>
//               </div>
              
//               <div className="bg-base-100 p-3 rounded-lg">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm font-semibold">Cette semaine</span>
//                   <span className="badge badge-success">{advancedStats.actionsThisWeek}</span>
//                 </div>
//                 <div className="text-xs opacity-70">Actions sur 7 jours</div>
//               </div>
              
//               <div className="bg-base-100 p-3 rounded-lg">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm font-semibold">Ce mois</span>
//                   <span className="badge badge-warning">{advancedStats.actionsThisMonth}</span>
//                 </div>
//                 <div className="text-xs opacity-70">Actions sur 30 jours</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filtres */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
//             <h2 className="card-title text-base-content">
//               <Filter className="h-5 w-5" />
//               Filtres de recherche avancés
//             </h2>
//             <div className="flex gap-2">
//               <button 
//                 onClick={() => loadHistorique(1)}
//                 className="btn btn-primary btn-sm"
//               >
//                 <Filter className="h-4 w-4 mr-2" />
//                 Appliquer
//               </button>
//               <button 
//                 onClick={() => {
//                   setFilters({
//                     search: '',
//                     utilisateur: '',
//                     action: '',
//                     module: '',
//                     dateDebut: '',
//                     dateFin: '',
//                     status: ''
//                   });
//                   setTimeout(() => loadHistorique(1), 100);
//                 }}
//                 className="btn btn-outline btn-sm"
//               >
//                 Réinitialiser
//               </button>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Recherche */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center">
//                   <Search className="h-4 w-4 mr-2" />
//                   Recherche globale
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Rechercher dans tous les champs..."
//                 className="input input-bordered bg-base-100"
//                 value={filters.search}
//                 onChange={(e) => setFilters({...filters, search: e.target.value})}
//               />
//             </div>

//             {/* Utilisateur */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center">
//                   <User className="h-4 w-4 mr-2" />
//                   Utilisateur
//                 </span>
//               </label>
//               <select
//                 className="select select-bordered bg-base-100"
//                 value={filters.utilisateur}
//                 onChange={(e) => setFilters({...filters, utilisateur: e.target.value})}
//               >
//                 <option value="">Tous les utilisateurs</option>
//                 {Array.from(new Set(historique.map(h => h.utilisateur))).map(user => (
//                   <option key={user} value={user}>{user}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Action */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Type d'action</span>
//               </label>
//               <select
//                 className="select select-bordered bg-base-100"
//                 value={filters.action}
//                 onChange={(e) => setFilters({...filters, action: e.target.value})}
//               >
//                 <option value="">Toutes les actions</option>
//                 {availableActions.map(action => (
//                   <option key={action} value={action}>{action}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Module */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Module</span>
//               </label>
//               <select
//                 className="select select-bordered bg-base-100"
//                 value={filters.module}
//                 onChange={(e) => setFilters({...filters, module: e.target.value})}
//               >
//                 <option value="">Tous les modules</option>
//                 {availableModules.map(module => (
//                   <option key={module} value={module}>{module}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Dates */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center">
//                   <Calendar className="h-4 w-4 mr-2" />
//                   Période de début
//                 </span>
//               </label>
//               <input
//                 type="date"
//                 className="input input-bordered bg-base-100"
//                 value={filters.dateDebut}
//                 onChange={(e) => setFilters({...filters, dateDebut: e.target.value})}
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center">
//                   <Calendar className="h-4 w-4 mr-2" />
//                   Période de fin
//                 </span>
//               </label>
//               <input
//                 type="date"
//                 className="input input-bordered bg-base-100"
//                 value={filters.dateFin}
//                 onChange={(e) => setFilters({...filters, dateFin: e.target.value})}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Vue Tableau */}
//       {viewMode === 'table' && (
//         <div className="card bg-base-100 shadow-xl border border-base-300">
//           <div className="card-body p-0">
//             {loading ? (
//               <div className="flex items-center justify-center py-12">
//                 <div className="text-center">
//                   <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
//                   <p className="text-lg">Chargement de l'historique...</p>
//                 </div>
//               </div>
//             ) : error ? (
//               <div className="alert alert-error m-4">
//                 <AlertTriangle className="h-6 w-6" />
//                 <div>
//                   <h3 className="font-bold">Erreur de chargement</h3>
//                   <div className="text-sm">{error}</div>
//                 </div>
//               </div>
//             ) : historique.length === 0 ? (
//               <div className="text-center py-12">
//                 <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">Aucune action enregistrée</h3>
//                 <p className="text-gray-500 mb-4">Les actions CRUD apparaîtront ici automatiquement.</p>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="table table-zebra w-full">
//                     <thead>
//                       <tr className="bg-base-200">
//                         <th>Date</th>
//                         <th>Utilisateur</th>
//                         <th>Action</th>
//                         <th>Module</th>
//                         <th>Description</th>
//                         <th>Statut</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {historique.map((item) => (
//                         <tr key={item.id} className="hover:bg-base-200">
//                           <td className="whitespace-nowrap">
//                             <div className="text-sm">{formatDate(item.date)}</div>
//                           </td>
//                           <td>
//                             <div className="flex items-center gap-2">
//                               <User className="h-4 w-4 opacity-70" />
//                               <span className="font-medium">{item.utilisateur}</span>
//                             </div>
//                           </td>
//                           <td>
//                             <div className={`badge ${getActionColor(item.action)} gap-2`}>
//                               {getActionIcon(item.action)}
//                               {item.action}
//                             </div>
//                           </td>
//                           <td>
//                             <div className="badge badge-outline gap-2">
//                               {getModuleIcon(item.module)}
//                               {item.module}
//                             </div>
//                           </td>
//                           <td>
//                             <div className="text-sm">
//                               {getShortSummary(item)}
//                             </div>
//                           </td>
//                           <td>
//                             <div className={`badge ${item.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>
//                               {item.status || 'SUCCESS'}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-base-300 gap-4">
//                   <div className="text-sm text-base-content opacity-70">
//                     Affichage de {historique.length} sur {advancedStats.totalActions} actions
//                   </div>
//                   <div className="join">
//                     <button
//                       className="join-item btn btn-sm"
//                       onClick={() => loadHistorique(pagination.page - 1)}
//                       disabled={pagination.page <= 1}
//                     >
//                       «
//                     </button>
//                     <button className="join-item btn btn-sm">
//                       Page {pagination.page} sur {pagination.totalPages}
//                     </button>
//                     <button
//                       className="join-item btn btn-sm"
//                       onClick={() => loadHistorique(pagination.page + 1)}
//                       disabled={pagination.page >= pagination.totalPages}
//                     >
//                       »
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Vue Cartes */}
//       {viewMode === 'cards' && historique.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {historique.map((item) => (
//             <div key={item.id} className="card bg-base-100 shadow-lg border border-base-300">
//               <div className="card-body p-4">
//                 <div className="flex justify-between items-start mb-3">
//                   <div className={`badge ${getActionColor(item.action)} gap-2`}>
//                     {getActionIcon(item.action)}
//                     {item.action}
//                   </div>
//                   <div className={`badge ${item.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>
//                     {item.status}
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="avatar">
//                     <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
//                       <User className="h-5 w-5" />
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="font-bold">{item.utilisateur}</h3>
//                     <p className="text-sm opacity-70">{formatDate(item.date)}</p>
//                   </div>
//                 </div>
                
//                 <div className="mb-3">
//                   <div className="badge badge-outline gap-2 mb-2">
//                     {getModuleIcon(item.module)}
//                     {item.module}
//                   </div>
//                   <p className="text-sm">{getShortSummary(item)}</p>
//                 </div>
                
//                 <div className="card-actions justify-end">
//                   <button 
//                     onClick={() => {
//                       const details = `${item.utilisateur} ${item.action.toLowerCase()} dans ${item.module}\nDate: ${formatDate(item.date)}\nStatut: ${item.status}`;
//                       navigator.clipboard.writeText(details);
//                       showNotification('Détails copiés', 'success');
//                     }}
//                     className="btn btn-ghost btn-sm"
//                   >
//                     <Copy className="h-4 w-4" />
//                     Copier
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Aide et informations */}
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="card bg-base-200">
//           <div className="card-body">
//             <h3 className="card-title">
//               <Info className="h-5 w-5" />
//               Comment utiliser ces statistiques ?
//             </h3>
//             <ul className="space-y-2 text-sm">
//               <li>• <strong>Actions totales</strong>: Volume global d'activités</li>
//               <li>• <strong>Taux de succès</strong>: Indicateur de fiabilité</li>
//               <li>• <strong>Productivité</strong>: Efficacité du système</li>
//               <li>• <strong>Score sécurité</strong>: Niveau de protection</li>
//               <li>• <strong>Top utilisateurs</strong>: Utilisateurs les plus actifs</li>
//               <li>• <strong>Pic d'activité</strong>: Heure de charge maximale</li>
//             </ul>
//           </div>
//         </div>
        
//         <div className="card bg-base-200">
//           <div className="card-body">
//             <h3 className="card-title">
//               <BellRing className="h-5 w-5" />
//               Alertes et recommandations
//             </h3>
//             <div className="space-y-2 text-sm">
//               {advancedStats.failedLogins > 10 && (
//                 <div className="alert alert-warning">
//                   <AlertTriangle className="h-4 w-4" />
//                   <span>⚠️ Nombre élevé de tentatives de connexion échouées</span>
//                 </div>
//               )}
//               {advancedStats.successRate < 90 && (
//                 <div className="alert alert-warning">
//                   <AlertTriangle className="h-4 w-4" />
//                   <span>⚠️ Taux de succès inférieur à 90%</span>
//                 </div>
//               )}
//               {advancedStats.securityScore < 80 && (
//                 <div className="alert alert-error">
//                   <XCircle className="h-4 w-4" />
//                   <span>❌ Score sécurité critique</span>
//                 </div>
//               )}
//               {advancedStats.actionsToday > 50 && (
//                 <div className="alert alert-info">
//                   <Activity className="h-4 w-4" />
//                   <span>📈 Forte activité aujourd'hui</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Fonction pour obtenir l'icône du module
// const getModuleIcon = (module) => {
//   const icons = {
//     'Matériels': <Monitor className="h-4 w-4" />,
//     'Logiciels': <Package className="h-4 w-4" />,
//     'Incidents': <AlertTriangle className="h-4 w-4" />,
//     'Réparations': <Wrench className="h-4 w-4" />,
//     'Alertes': <Bell className="h-4 w-4" />,
//     'Fournisseurs': <UsersIcon className="h-4 w-4" />,
//     'Utilisateurs': <User className="h-4 w-4" />,
//     'Rapports': <FileSpreadsheet className="h-4 w-4" />,
//     'Authentification': <Shield className="h-4 w-4" />,
//     'Navigation': <ExternalLink className="h-4 w-4" />,
//     'Système': <Cpu className="h-4 w-4" />,
//     'Configuration': <Settings className="h-4 w-4" />,
//     'Dashboard': <DatabaseIcon className="h-4 w-4" />,
//     'Réseau': <Server className="h-4 w-4" />,
//     'Stockage': <HardDrive className="h-4 w-4" />,
//     'Sécurité': <ShieldCheck className="h-4 w-4" />,
//     'Audit': <FileText className="h-4 w-4" />,
//     'Maintenance': <Wrench className="h-4 w-4" />,
//     'Backup': <Save className="h-4 w-4" />,
//     'Monitoring': <Activity className="h-4 w-4" />
//   };
  
//   return icons[module] || <FileText className="h-4 w-4" />;
// };

// export default Historique;




// // src/pages/Historique.jsx - VERSION CONNECTÉE AU LOGGER
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { 
//   History, Filter, Search, Download, RefreshCw, 
//   User, Calendar, FileText, Clock, Eye, Edit, 
//   Trash2, Plus, AlertTriangle, CheckCircle, XCircle,
//   ArrowUpDown, MoreVertical, Database, Printer,
//   ExternalLink, ChevronDown, ChevronUp, Copy,
//   Save, Upload, Settings, Key, LogOut, LogIn,
//   Shield, Bell, Package, Monitor, Network,
//   Wrench, Users as UsersIcon, FileSpreadsheet,
//   BookOpen, FileEdit, FilePlus, FileMinus, FileDown,
//   Database as DatabaseIcon, HardDrive, Server, Cpu,
//   BarChart3, TrendingUp, Activity, Zap,
//   PieChart, CalendarDays, UserCheck, Target,
//   Clock3, Layers, Grid3x3, AlertCircle,
//   Star, Award, Trophy, TrendingDown, DollarSign,
//   Percent, Hash, KeyRound, ShieldCheck,
//   BarChart4, LineChart, DownloadCloud,
//   Info, HelpCircle, BellRing
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { useNotification } from '../context/NotificationContext';
// import { getHistoriqueLocal, initHistoriqueLocal } from '../services/api';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import * as XLSX from 'xlsx';

// const Historique = () => {
//   const { user } = useAuth();
//   const { showNotification } = useNotification();
//   const [historique, setHistorique] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     utilisateur: '',
//     action: '',
//     module: '',
//     dateDebut: '',
//     dateFin: '',
//     status: ''
//   });
  
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     totalPages: 0
//   });
  
//   const [sortConfig, setSortConfig] = useState({
//     key: 'date',
//     direction: 'desc'
//   });
  
//   const [expandedRows, setExpandedRows] = useState({});
//   const [selectedActions, setSelectedActions] = useState([]);
//   const [viewMode, setViewMode] = useState('table');
//   const [autoRefresh, setAutoRefresh] = useState(false);
  
//   // Statistiques avancées
//   const [advancedStats, setAdvancedStats] = useState({
//     totalActions: 0,
//     actionsToday: 0,
//     actionsThisWeek: 0,
//     actionsThisMonth: 0,
//     hourlyDistribution: {},
//     dailyDistribution: {},
//     monthlyTrend: [],
//     averageActionsPerDay: 0,
//     peakHour: '',
//     peakDay: '',
//     topUsers: [],
//     mostActiveUser: { username: '', count: 0 },
//     userRetention: 0,
//     topModules: [],
//     mostUsedModule: { module: '', count: 0 },
//     moduleSuccessRate: {},
//     actionDistribution: {},
//     mostCommonAction: { action: '', count: 0 },
//     successRate: 0,
//     errorRate: 0,
//     failedLogins: 0,
//     suspiciousActivities: [],
//     securityScore: 0,
//     avgResponseTime: 0,
//     storageEfficiency: 0,
//     dataGrowthRate: 0,
//     productivityIndex: 0,
//     systemAdoptionRate: 0,
//     userSatisfaction: 0
//   });

//   // Actions disponibles - MIS À JOUR POUR CORRESPONDRE AU LOGGER
//   const availableActions = useMemo(() => [
//     'CONNEXION', 'DECONNEXION', 'CREATION', 
//     'MODIFICATION', 'SUPPRESSION', 'LECTURE',
//     'EXPORTATION', 'IMPORTATION', 'VALIDATION',
//     'REJET', 'APPROBATION', 'ARCHIVAGE',
//     'RESTAURATION', 'RESOLUTION', 'NAVIGATION'
//   ], []);

//   // Modules disponibles - MIS À JOUR POUR CORRESPONDRE AU LOGGER
//   const availableModules = useMemo(() => [
//     'Matériels', 'Logiciels', 'Incidents', 'Réparations',
//     'Alertes', 'Fournisseurs', 'Utilisateurs', 'Rapports',
//     'Authentification', 'Dashboard', 'Configuration',
//     'Sécurité', 'Maintenance', 'Monitoring'
//   ], []);

//   // Initialiser l'historique
//   useEffect(() => {
//     initHistoriqueLocal();
//   }, []);

//   // Charger l'historique depuis localStorage
//   const loadHistorique = useCallback((page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Utiliser la fonction getHistoriqueLocal du service
//       const data = getHistoriqueLocal(filters);
      
//       // Appliquer le tri
//       const sortedData = applySort(data, sortConfig);
      
//       // Calculer les statistiques avancées
//       calculateAdvancedStats(sortedData);
      
//       // Pagination
//       const startIndex = (page - 1) * pagination.limit;
//       const endIndex = startIndex + pagination.limit;
//       const paginatedData = sortedData.slice(startIndex, endIndex);
      
//       setHistorique(paginatedData);
//       setPagination(prev => ({
//         ...prev,
//         page: page,
//         total: sortedData.length,
//         totalPages: Math.ceil(sortedData.length / prev.limit)
//       }));
      
//       console.log(`📊 ${sortedData.length} actions chargées, ${paginatedData.length} affichées`);
      
//     } catch (error) {
//       console.error('❌ Erreur chargement historique:', error);
//       setError('Erreur de chargement des données');
//       setHistorique([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters, sortConfig, pagination.limit]);

//   // Appliquer le tri
//   const applySort = (data, sortConfig) => {
//     return [...data].sort((a, b) => {
//       let aValue = a[sortConfig.key];
//       let bValue = b[sortConfig.key];
      
//       if (sortConfig.key === 'date') {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }
      
//       if (sortConfig.direction === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });
//   };

//   // Calculer les statistiques avancées
//   const calculateAdvancedStats = (data) => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
//     // Distribution temporelle
//     const hourlyDistribution = {};
//     const dailyDistribution = {};
//     const monthlyTrend = [];
    
//     // Compteurs
//     const userCounts = {};
//     const moduleCounts = {};
//     const actionCounts = {};
    
//     let successfulActions = 0;
//     let failedLogins = 0;
//     let suspiciousActivities = [];
    
//     data.forEach(item => {
//       const date = new Date(item.date);
//       const hour = date.getHours();
//       const day = date.toLocaleDateString('fr-FR');
      
//       // Distribution horaire
//       hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
      
//       // Distribution journalière
//       dailyDistribution[day] = (dailyDistribution[day] || 0) + 1;
      
//       // Comptage utilisateurs
//       if (item.utilisateur) {
//         userCounts[item.utilisateur] = (userCounts[item.utilisateur] || 0) + 1;
//       }
      
//       // Comptage modules
//       if (item.module) {
//         moduleCounts[item.module] = (moduleCounts[item.module] || 0) + 1;
//       }
      
//       // Comptage actions
//       if (item.action) {
//         actionCounts[item.action] = (actionCounts[item.action] || 0) + 1;
//       }
      
//       // Succès/échecs
//       if (item.status === 'SUCCESS') {
//         successfulActions++;
//       }
      
//       // Sécurité
//       if (item.action === 'CONNEXION' && item.status === 'ERROR') {
//         failedLogins++;
//       }
      
//       // Activités suspectes
//       if (item.action === 'SUPPRESSION' || item.action === 'MODIFICATION' || item.action === 'CREATION') {
//         if (!item.utilisateur || item.utilisateur === 'unknown') {
//           suspiciousActivities.push(item);
//         }
//       }
//     });
    
//     // Tendances mensuelles
//     const monthlyData = {};
//     data.forEach(item => {
//       const date = new Date(item.date);
//       const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//       monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
//     });
    
//     Object.entries(monthlyData).forEach(([month, count]) => {
//       monthlyTrend.push({ month, count });
//     });
    
//     // Trier et préparer les données
//     const topUsers = Object.entries(userCounts)
//       .map(([username, count]) => ({ username, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     const topModules = Object.entries(moduleCounts)
//       .map(([module, count]) => ({ module, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
    
//     // Calculs avancés
//     const totalActions = data.length;
//     const actionsToday = data.filter(item => new Date(item.date) >= today).length;
//     const actionsThisWeek = data.filter(item => new Date(item.date) >= weekAgo).length;
//     const actionsThisMonth = data.filter(item => new Date(item.date) >= monthAgo).length;
    
//     // Performance
//     const averageActionsPerDay = totalActions > 0 ? (totalActions / 30).toFixed(1) : 0;
//     const peakHour = Object.entries(hourlyDistribution)
//       .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
//     const peakDay = Object.entries(dailyDistribution)
//       .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    
//     // Utilisateurs
//     const mostActiveUser = topUsers[0] || { username: '', count: 0 };
//     const userRetention = topUsers.length > 0 ? Math.min(100, (topUsers.length / totalActions) * 1000) : 0;
    
//     // Modules
//     const mostUsedModule = topModules[0] || { module: '', count: 0 };
    
//     // Actions
//     const actionDistribution = actionCounts;
//     const mostCommonAction = Object.entries(actionCounts)
//       .sort(([,a], [,b]) => b - a)[0] || ['', 0];
    
//     const successRate = totalActions > 0 ? Math.round((successfulActions / totalActions) * 100) : 0;
//     const errorRate = 100 - successRate;
    
//     // Indicateurs métiers
//     const productivityIndex = Math.min(100, Math.round((actionsToday / 50) * 100));
//     const systemAdoptionRate = Math.min(100, Math.round((topUsers.length / 10) * 100));
//     const userSatisfaction = Math.min(100, Math.round(successRate * 0.8 + systemAdoptionRate * 0.2));
    
//     // Sécurité
//     const securityScore = Math.max(0, 100 - (failedLogins * 5) - (suspiciousActivities.length * 10));
    
//     setAdvancedStats({
//       totalActions,
//       actionsToday,
//       actionsThisWeek,
//       actionsThisMonth,
      
//       hourlyDistribution,
//       dailyDistribution,
//       monthlyTrend,
      
//       averageActionsPerDay,
//       peakHour: `${peakHour}h`,
//       peakDay,
      
//       topUsers,
//       mostActiveUser,
//       userRetention,
      
//       topModules,
//       mostUsedModule,
//       moduleSuccessRate: {},
      
//       actionDistribution,
//       mostCommonAction: { action: mostCommonAction[0], count: mostCommonAction[1] },
//       successRate,
//       errorRate,
      
//       failedLogins,
//       suspiciousActivities,
//       securityScore,
      
//       avgResponseTime: 0.5,
//       storageEfficiency: 85,
//       dataGrowthRate: 12,
      
//       productivityIndex,
//       systemAdoptionRate,
//       userSatisfaction
//     });
//   };

//   // Formater la date
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       return new Intl.DateTimeFormat('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//       }).format(date);
//     } catch {
//       return dateString;
//     }
//   };

//   // Obtenir la couleur pour l'action
//   const getActionColor = (action) => {
//     const actionColors = {
//       'CONNEXION': 'badge-success',
//       'DECONNEXION': 'badge-warning',
//       'CREATION': 'badge-primary',
//       'MODIFICATION': 'badge-warning',
//       'SUPPRESSION': 'badge-error',
//       'LECTURE': 'badge-info',
//       'EXPORTATION': 'badge-secondary',
//       'IMPORTATION': 'badge-primary',
//       'VALIDATION': 'badge-success',
//       'REJET': 'badge-error',
//       'APPROBATION': 'badge-success',
//       'ARCHIVAGE': 'badge-neutral',
//       'RESTAURATION': 'badge-warning',
//       'RESOLUTION': 'badge-success',
//       'NAVIGATION': 'badge-neutral'
//     };
    
//     return actionColors[action] || 'badge-neutral';
//   };

//   // Obtenir l'icône pour l'action
//   const getActionIcon = (action) => {
//     const actionIcons = {
//       'CONNEXION': <LogIn className="h-4 w-4" />,
//       'DECONNEXION': <LogOut className="h-4 w-4" />,
//       'CREATION': <FilePlus className="h-4 w-4" />,
//       'MODIFICATION': <FileEdit className="h-4 w-4" />,
//       'SUPPRESSION': <FileMinus className="h-4 w-4" />,
//       'LECTURE': <Eye className="h-4 w-4" />,
//       'EXPORTATION': <FileDown className="h-4 w-4" />,
//       'IMPORTATION': <Upload className="h-4 w-4" />,
//       'VALIDATION': <CheckCircle className="h-4 w-4" />,
//       'REJET': <XCircle className="h-4 w-4" />,
//       'APPROBATION': <ShieldCheck className="h-4 w-4" />,
//       'ARCHIVAGE': <Save className="h-4 w-4" />,
//       'RESTAURATION': <History className="h-4 w-4" />,
//       'RESOLUTION': <CheckCircle className="h-4 w-4" />,
//       'NAVIGATION': <ExternalLink className="h-4 w-4" />
//     };
    
//     return actionIcons[action] || <FileText className="h-4 w-4" />;
//   };

//   // Obtenir la description courte
//   const getShortSummary = (item) => {
//     return `${item.utilisateur} ${item.action.toLowerCase()} dans ${item.module}: ${item.details}`;
//   };

//   // Écouter les nouvelles actions
//   useEffect(() => {
//     const handleHistoriqueUpdated = (event) => {
//       console.log('🔄 Nouvelle action détectée, rechargement...', event.detail);
//       loadHistorique(pagination.page);
//       showNotification('Nouvelle action enregistrée', 'info');
//     };
    
//     window.addEventListener('historique-updated', handleHistoriqueUpdated);
    
//     return () => {
//       window.removeEventListener('historique-updated', handleHistoriqueUpdated);
//     };
//   }, [loadHistorique, pagination.page, showNotification]);

//   // Basculer l'auto-refresh
//   useEffect(() => {
//     let interval;
//     if (autoRefresh) {
//       interval = setInterval(() => {
//         loadHistorique(pagination.page);
//         showNotification('Historique actualisé automatiquement', 'info');
//       }, 30000);
//     }
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [autoRefresh, pagination.page, loadHistorique, showNotification]);

//   // Charger au démarrage
//   useEffect(() => {
//     loadHistorique(pagination.page);
//   }, [loadHistorique, pagination.page]);

//   // Générer rapport détaillé
//   const generateDetailedReport = () => {
//     const doc = new jsPDF();
    
//     // En-tête
//     doc.setFontSize(20);
//     doc.text('RAPPORT STATISTIQUES AVANCÉES - DREN AA', 20, 20);
    
//     // Statistiques générales
//     doc.setFontSize(12);
//     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
//     doc.text(`Période analysée: ${filters.dateDebut || 'Début'} - ${filters.dateFin || 'Aujourd\'hui'}`, 20, 42);
//     doc.text(`Total actions: ${advancedStats.totalActions}`, 20, 49);
    
//     // Tableau de bord
//     doc.setFontSize(16);
//     doc.text('TABLEAU DE BORD DES PERFORMANCES', 20, 65);
    
//     let yPos = 75;
    
//     // Indicateurs clés
//     const keyStats = [
//       ['Indicateur', 'Valeur', 'Statut'],
//       ['Actions aujourd\'hui', advancedStats.actionsToday, advancedStats.actionsToday > 20 ? '🔴 Haut' : '🟢 Normal'],
//       ['Taux de succès', `${advancedStats.successRate}%`, advancedStats.successRate > 90 ? '🟢 Excellent' : '🟡 Moyen'],
//       ['Score sécurité', `${advancedStats.securityScore}/100`, advancedStats.securityScore > 80 ? '🟢 Sécurisé' : '🟡 À surveiller'],
//       ['Productivité', `${advancedStats.productivityIndex}%`, advancedStats.productivityIndex > 70 ? '🟢 Bonne' : '🟡 Modérée'],
//       ['Utilisateurs actifs', advancedStats.topUsers.length, '🟢 Actif']
//     ];
    
//     autoTable(doc, {
//       head: keyStats.slice(0, 1),
//       body: keyStats.slice(1),
//       startY: yPos,
//       theme: 'grid'
//     });
    
//     yPos = doc.lastAutoTable.finalY + 10;
    
//     // Top utilisateurs
//     doc.setFontSize(14);
//     doc.text('TOP 5 UTILISATEURS', 20, yPos);
//     yPos += 10;
    
//     const userData = advancedStats.topUsers.map(user => [user.username, user.count, `${Math.round((user.count / advancedStats.totalActions) * 100)}%`]);
    
//     autoTable(doc, {
//       head: [['Utilisateur', 'Actions', 'Part']],
//       body: userData,
//       startY: yPos,
//       theme: 'striped'
//     });
    
//     // Enregistrer
//     doc.save(`rapport-statistiques-${new Date().toISOString().split('T')[0]}.pdf`);
//     showNotification('Rapport PDF généré avec succès', 'success');
//   };

//   // Composant StatCard réutilisable
//   const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
//     <div className={`stat bg-base-200 rounded-lg p-4 border-l-4 ${color}`}>
//       <div className="stat-figure text-opacity-80">
//         {icon}
//       </div>
//       <div className="stat-title">{title}</div>
//       <div className="stat-value text-2xl md:text-3xl">{value}</div>
//       {subtitle && <div className="stat-desc">{subtitle}</div>}
//       {trend && (
//         <div className={`stat-desc flex items-center gap-1 ${trend > 0 ? 'text-success' : 'text-error'}`}>
//           <TrendingUp className="h-3 w-3" />
//           {trend > 0 ? '+' : ''}{trend}%
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
//       {/* En-tête */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
//             <BarChart3 className="h-8 w-8 text-primary" />
//             Tableau de Bord Historique
//             <span className="badge badge-primary badge-lg">Analytics</span>
//           </h1>
//           <p className="text-base-content opacity-70 mt-1">
//             Surveillance avancée des performances et activités système
//             <span className="ml-2 text-success font-medium">
//               • 👤 Connecté: {user?.username || 'Utilisateur'}
//             </span>
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <div className="form-control">
//             <label className="label cursor-pointer gap-2">
//               <span className="label-text text-sm">Auto-refresh</span>
//               <input 
//                 type="checkbox" 
//                 className="toggle toggle-primary toggle-sm"
//                 checked={autoRefresh}
//                 onChange={(e) => setAutoRefresh(e.target.checked)}
//               />
//             </label>
//           </div>
//           <select 
//             className="select select-bordered select-sm"
//             value={viewMode}
//             onChange={(e) => setViewMode(e.target.value)}
//           >
//             <option value="table">📊 Tableau</option>
//             <option value="cards">🃏 Cartes</option>
//             <option value="timeline">📅 Timeline</option>
//           </select>
//           <button 
//             onClick={generateDetailedReport}
//             className="btn btn-primary btn-sm"
//           >
//             <FileText className="h-4 w-4 mr-2" />
//             Rapport complet
//           </button>
//           <button 
//             onClick={() => loadHistorique(1)}
//             className="btn btn-outline btn-sm"
//           >
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Actualiser
//           </button>
//         </div>
//       </div>

//       {/* Indicateurs clés */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
//         <StatCard
//           title="Actions totales"
//           value={advancedStats.totalActions}
//           icon={<History className="h-6 w-6" />}
//           color="border-l-primary"
//           subtitle="Toutes opérations"
//         />
        
//         <StatCard
//           title="Aujourd'hui"
//           value={advancedStats.actionsToday}
//           icon={<Activity className="h-6 w-6" />}
//           color="border-l-success"
//           subtitle="Dernières 24h"
//           trend={12}
//         />
        
//         <StatCard
//           title="Taux succès"
//           value={`${advancedStats.successRate}%`}
//           icon={<CheckCircle className="h-6 w-6" />}
//           color="border-l-success"
//           subtitle="Opérations réussies"
//         />
        
//         <StatCard
//           title="Productivité"
//           value={`${advancedStats.productivityIndex}%`}
//           icon={<TrendingUp className="h-6 w-6" />}
//           color="border-l-warning"
//           subtitle="Index performance"
//         />
        
//         <StatCard
//           title="Sécurité"
//           value={`${advancedStats.securityScore}/100`}
//           icon={<ShieldCheck className="h-6 w-6" />}
//           color="border-l-error"
//           subtitle="Score système"
//         />
        
//         <StatCard
//           title="Adoption"
//           value={`${advancedStats.systemAdoptionRate}%`}
//           icon={<UserCheck className="h-6 w-6" />}
//           color="border-l-info"
//           subtitle="Taux d'utilisation"
//         />
//       </div>

//       {/* Statistiques détaillées */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         {/* Top utilisateurs */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body">
//             <h2 className="card-title">
//               <User className="h-5 w-5" />
//               Top Utilisateurs
//               <div className="badge badge-primary">{advancedStats.topUsers.length}</div>
//             </h2>
//             <div className="space-y-3">
//               {advancedStats.topUsers.map((user, index) => (
//                 <div key={user.username} className="flex items-center justify-between p-2 bg-base-100 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                       index === 0 ? 'bg-primary text-primary-content' : 'bg-base-300'
//                     }`}>
//                       {index + 1}
//                     </div>
//                     <div>
//                       <div className="font-semibold">{user.username}</div>
//                       <div className="text-xs opacity-70">{user.count} actions</div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-semibold">
//                       {Math.round((user.count / advancedStats.totalActions) * 100)}%
//                     </div>
//                     <progress 
//                       className="progress progress-primary w-24" 
//                       value={user.count} 
//                       max={advancedStats.mostActiveUser.count || 1}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Distribution des modules */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body">
//             <h2 className="card-title">
//               <Layers className="h-5 w-5" />
//               Modules les plus utilisés
//             </h2>
//             <div className="space-y-3">
//               {advancedStats.topModules.map((module, index) => (
//                 <div key={module.module} className="flex items-center justify-between p-2 bg-base-100 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                       index === 0 ? 'bg-secondary text-secondary-content' : 'bg-base-300'
//                     }`}>
//                       {getModuleIcon(module.module)}
//                     </div>
//                     <div className="flex-1">
//                       <div className="font-semibold">{module.module}</div>
//                       <div className="text-xs opacity-70">
//                         {module.count} actions
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-semibold">{Math.round((module.count / advancedStats.totalActions) * 100)}%</div>
//                     <progress 
//                       className="progress progress-secondary w-24" 
//                       value={module.count} 
//                       max={advancedStats.mostUsedModule.count || 1}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Analyse temporelle */}
//         <div className="card bg-base-200 shadow-lg">
//           <div className="card-body">
//             <h2 className="card-title">
//               <Clock3 className="h-5 w-5" />
//               Analyse temporelle
//             </h2>
//             <div className="space-y-4">
//               <div className="bg-base-100 p-3 rounded-lg">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm font-semibold">Pic d'activité</span>
//                   <span className="badge badge-primary">{advancedStats.peakHour}</span>
//                 </div>
//                 <div className="text-xs opacity-70">Heure de plus forte activité</div>
//               </div>
              
//               <div className="bg-base-100 p-3 rounded-lg">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm font-semibold">Moyenne journalière</span>
//                   <span className="badge badge-secondary">{advancedStats.averageActionsPerDay}</span>
//                 </div>
//                 <div className="text-xs opacity-70">Actions par jour (30 derniers jours)</div>
//               </div>
              
//               <div className="bg-base-100 p-3 rounded-lg">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm font-semibold">Cette semaine</span>
//                   <span className="badge badge-success">{advancedStats.actionsThisWeek}</span>
//                 </div>
//                 <div className="text-xs opacity-70">Actions sur 7 jours</div>
//               </div>
              
//               <div className="bg-base-100 p-3 rounded-lg">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm font-semibold">Ce mois</span>
//                   <span className="badge badge-warning">{advancedStats.actionsThisMonth}</span>
//                 </div>
//                 <div className="text-xs opacity-70">Actions sur 30 jours</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filtres */}
//       <div className="card bg-base-200 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
//             <h2 className="card-title text-base-content">
//               <Filter className="h-5 w-5" />
//               Filtres de recherche avancés
//             </h2>
//             <div className="flex gap-2">
//               <button 
//                 onClick={() => loadHistorique(1)}
//                 className="btn btn-primary btn-sm"
//               >
//                 <Filter className="h-4 w-4 mr-2" />
//                 Appliquer
//               </button>
//               <button 
//                 onClick={() => {
//                   setFilters({
//                     search: '',
//                     utilisateur: '',
//                     action: '',
//                     module: '',
//                     dateDebut: '',
//                     dateFin: '',
//                     status: ''
//                   });
//                   setTimeout(() => loadHistorique(1), 100);
//                 }}
//                 className="btn btn-outline btn-sm"
//               >
//                 Réinitialiser
//               </button>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Recherche */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center">
//                   <Search className="h-4 w-4 mr-2" />
//                   Recherche globale
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Rechercher dans tous les champs..."
//                 className="input input-bordered bg-base-100"
//                 value={filters.search}
//                 onChange={(e) => setFilters({...filters, search: e.target.value})}
//               />
//             </div>

//             {/* Utilisateur */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center">
//                   <User className="h-4 w-4 mr-2" />
//                   Utilisateur
//                 </span>
//               </label>
//               <select
//                 className="select select-bordered bg-base-100"
//                 value={filters.utilisateur}
//                 onChange={(e) => setFilters({...filters, utilisateur: e.target.value})}
//               >
//                 <option value="">Tous les utilisateurs</option>
//                 {Array.from(new Set(historique.map(h => h.utilisateur))).map(user => (
//                   <option key={user} value={user}>{user}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Action */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Type d'action</span>
//               </label>
//               <select
//                 className="select select-bordered bg-base-100"
//                 value={filters.action}
//                 onChange={(e) => setFilters({...filters, action: e.target.value})}
//               >
//                 <option value="">Toutes les actions</option>
//                 {availableActions.map(action => (
//                   <option key={action} value={action}>{action}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Module */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Module</span>
//               </label>
//               <select
//                 className="select select-bordered bg-base-100"
//                 value={filters.module}
//                 onChange={(e) => setFilters({...filters, module: e.target.value})}
//               >
//                 <option value="">Tous les modules</option>
//                 {availableModules.map(module => (
//                   <option key={module} value={module}>{module}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Dates */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center">
//                   <Calendar className="h-4 w-4 mr-2" />
//                   Période de début
//                 </span>
//               </label>
//               <input
//                 type="date"
//                 className="input input-bordered bg-base-100"
//                 value={filters.dateDebut}
//                 onChange={(e) => setFilters({...filters, dateDebut: e.target.value})}
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text flex items-center">
//                   <Calendar className="h-4 w-4 mr-2" />
//                   Période de fin
//                 </span>
//               </label>
//               <input
//                 type="date"
//                 className="input input-bordered bg-base-100"
//                 value={filters.dateFin}
//                 onChange={(e) => setFilters({...filters, dateFin: e.target.value})}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Vue Tableau */}
//       {viewMode === 'table' && (
//         <div className="card bg-base-100 shadow-xl border border-base-300">
//           <div className="card-body p-0">
//             {loading ? (
//               <div className="flex items-center justify-center py-12">
//                 <div className="text-center">
//                   <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
//                   <p className="text-lg">Chargement de l'historique...</p>
//                 </div>
//               </div>
//             ) : error ? (
//               <div className="alert alert-error m-4">
//                 <AlertTriangle className="h-6 w-6" />
//                 <div>
//                   <h3 className="font-bold">Erreur de chargement</h3>
//                   <div className="text-sm">{error}</div>
//                 </div>
//               </div>
//             ) : historique.length === 0 ? (
//               <div className="text-center py-12">
//                 <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">Aucune action enregistrée</h3>
//                 <p className="text-gray-500 mb-4">
//                   Les actions CRUD apparaîtront ici automatiquement lorsque vous utiliserez le système.
//                 </p>
//                 <div className="text-sm text-gray-400">
//                   Essayez de créer un matériel, un incident ou un utilisateur pour voir l'historique.
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="table table-zebra w-full">
//                     <thead>
//                       <tr className="bg-base-200">
//                         <th>Date</th>
//                         <th>Utilisateur</th>
//                         <th>Action</th>
//                         <th>Module</th>
//                         <th>Description</th>
//                         <th>Statut</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {historique.map((item) => (
//                         <tr key={item.id} className="hover:bg-base-200">
//                           <td className="whitespace-nowrap">
//                             <div className="text-sm">{formatDate(item.date)}</div>
//                           </td>
//                           <td>
//                             <div className="flex items-center gap-2">
//                               <User className="h-4 w-4 opacity-70" />
//                               <span className="font-medium">{item.utilisateur}</span>
//                             </div>
//                           </td>
//                           <td>
//                             <div className={`badge ${getActionColor(item.action)} gap-2`}>
//                               {getActionIcon(item.action)}
//                               {item.action}
//                             </div>
//                           </td>
//                           <td>
//                             <div className="badge badge-outline gap-2">
//                               {getModuleIcon(item.module)}
//                               {item.module}
//                             </div>
//                           </td>
//                           <td>
//                             <div className="text-sm">
//                               {item.details}
//                               <div className="text-xs opacity-60 mt-1">
//                                 {item.ip_address && `IP: ${item.ip_address}`}
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <div className={`badge ${item.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>
//                               {item.status || 'SUCCESS'}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-base-300 gap-4">
//                   <div className="text-sm text-base-content opacity-70">
//                     Affichage de {historique.length} sur {advancedStats.totalActions} actions
//                   </div>
//                   <div className="join">
//                     <button
//                       className="join-item btn btn-sm"
//                       onClick={() => loadHistorique(pagination.page - 1)}
//                       disabled={pagination.page <= 1}
//                     >
//                       «
//                     </button>
//                     <button className="join-item btn btn-sm">
//                       Page {pagination.page} sur {pagination.totalPages}
//                     </button>
//                     <button
//                       className="join-item btn btn-sm"
//                       onClick={() => loadHistorique(pagination.page + 1)}
//                       disabled={pagination.page >= pagination.totalPages}
//                     >
//                       »
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Vue Cartes */}
//       {viewMode === 'cards' && historique.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {historique.map((item) => (
//             <div key={item.id} className="card bg-base-100 shadow-lg border border-base-300">
//               <div className="card-body p-4">
//                 <div className="flex justify-between items-start mb-3">
//                   <div className={`badge ${getActionColor(item.action)} gap-2`}>
//                     {getActionIcon(item.action)}
//                     {item.action}
//                   </div>
//                   <div className={`badge ${item.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>
//                     {item.status}
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="avatar">
//                     <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
//                       <User className="h-5 w-5" />
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="font-bold">{item.utilisateur}</h3>
//                     <p className="text-sm opacity-70">{formatDate(item.date)}</p>
//                   </div>
//                 </div>
                
//                 <div className="mb-3">
//                   <div className="badge badge-outline gap-2 mb-2">
//                     {getModuleIcon(item.module)}
//                     {item.module}
//                   </div>
//                   <p className="text-sm">{item.details}</p>
//                   {item.ip_address && (
//                     <p className="text-xs opacity-60 mt-1">IP: {item.ip_address}</p>
//                   )}
//                 </div>
                
//                 <div className="card-actions justify-end">
//                   <button 
//                     onClick={() => {
//                       const details = `${item.utilisateur} ${item.action.toLowerCase()} dans ${item.module}\nDate: ${formatDate(item.date)}\nDétails: ${item.details}\nStatut: ${item.status}\nIP: ${item.ip_address || 'N/A'}`;
//                       navigator.clipboard.writeText(details);
//                       showNotification('Détails copiés', 'success');
//                     }}
//                     className="btn btn-ghost btn-sm"
//                   >
//                     <Copy className="h-4 w-4" />
//                     Copier
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Aide et informations */}
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="card bg-base-200">
//           <div className="card-body">
//             <h3 className="card-title">
//               <Info className="h-5 w-5" />
//               Comment utiliser ces statistiques ?
//             </h3>
//             <ul className="space-y-2 text-sm">
//               <li>• <strong>Actions totales</strong>: Volume global d'activités</li>
//               <li>• <strong>Taux de succès</strong>: Indicateur de fiabilité</li>
//               <li>• <strong>Productivité</strong>: Efficacité du système</li>
//               <li>• <strong>Score sécurité</strong>: Niveau de protection</li>
//               <li>• <strong>Top utilisateurs</strong>: Utilisateurs les plus actifs</li>
//               <li>• <strong>Pic d'activité</strong>: Heure de charge maximale</li>
//             </ul>
//           </div>
//         </div>
        
//         <div className="card bg-base-200">
//           <div className="card-body">
//             <h3 className="card-title">
//               <BellRing className="h-5 w-5" />
//               Alertes et recommandations
//             </h3>
//             <div className="space-y-2 text-sm">
//               {advancedStats.failedLogins > 10 && (
//                 <div className="alert alert-warning">
//                   <AlertTriangle className="h-4 w-4" />
//                   <span>⚠️ Nombre élevé de tentatives de connexion échouées</span>
//                 </div>
//               )}
//               {advancedStats.successRate < 90 && (
//                 <div className="alert alert-warning">
//                   <AlertTriangle className="h-4 w-4" />
//                   <span>⚠️ Taux de succès inférieur à 90%</span>
//                 </div>
//               )}
//               {advancedStats.securityScore < 80 && (
//                 <div className="alert alert-error">
//                   <XCircle className="h-4 w-4" />
//                   <span>❌ Score sécurité critique</span>
//                 </div>
//               )}
//               {advancedStats.actionsToday > 50 && (
//                 <div className="alert alert-info">
//                   <Activity className="h-4 w-4" />
//                   <span>📈 Forte activité aujourd'hui</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Fonction pour obtenir l'icône du module
// const getModuleIcon = (module) => {
//   const icons = {
//     'Matériels': <Monitor className="h-4 w-4" />,
//     'Logiciels': <Package className="h-4 w-4" />,
//     'Incidents': <AlertTriangle className="h-4 w-4" />,
//     'Réparations': <Wrench className="h-4 w-4" />,
//     'Alertes': <Bell className="h-4 w-4" />,
//     'Fournisseurs': <UsersIcon className="h-4 w-4" />,
//     'Utilisateurs': <User className="h-4 w-4" />,
//     'Rapports': <FileSpreadsheet className="h-4 w-4" />,
//     'Authentification': <Shield className="h-4 w-4" />,
//     'Dashboard': <DatabaseIcon className="h-4 w-4" />,
//     'Configuration': <Settings className="h-4 w-4" />,
//     'Sécurité': <ShieldCheck className="h-4 w-4" />,
//     'Maintenance': <Wrench className="h-4 w-4" />,
//     'Monitoring': <Activity className="h-4 w-4" />
//   };
  
//   return icons[module] || <FileText className="h-4 w-4" />;
// };

// export default Historique;





// src/pages/Historique.jsx - VERSION FINALE COMPLÈTEMENT CONNECTÉE
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  History, Filter, Search, Download, RefreshCw, 
  User, Calendar, FileText, Clock, Eye, Edit, 
  Trash2, Plus, AlertTriangle, CheckCircle, XCircle,
  ArrowUpDown, MoreVertical, Database, Printer,
  ExternalLink, ChevronDown, ChevronUp, Copy,
  Save, Upload, Settings, Key, LogOut, LogIn,
  Shield, Bell, Package, Monitor, Network,
  Wrench, Users as UsersIcon, FileSpreadsheet,
  BookOpen, FileEdit, FilePlus, FileMinus, FileDown,
  Database as DatabaseIcon, HardDrive, Server, Cpu,
  BarChart3, TrendingUp, Activity, Zap,
  PieChart, CalendarDays, UserCheck, Target,
  Clock3, Layers, Grid3x3, AlertCircle,
  Star, Award, Trophy, TrendingDown, DollarSign,
  Percent, Hash, KeyRound, ShieldCheck,
  BarChart4, LineChart, DownloadCloud,
  Info, HelpCircle, BellRing,
  Eye as EyeIcon,
  FileUp,
  FileMinus as FileDelete,
  FileSearch,
  Navigation,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// IMPORTANT: Ces fonctions sont maintenant définies dans App.jsx
// Elles sont exposées globalement via window
const getHistoriqueLocal = () => {
  try {
    const STORAGE_KEY = 'gestion_parc_historique';
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : [];
    
    // Convertir les dates en objets Date pour le tri
    return data.map(item => ({
      ...item,
      _date: new Date(item.date)
    }));
  } catch (error) {
    console.error('❌ Erreur chargement historique local:', error);
    return [];
  }
};

const Historique = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    utilisateur: '',
    action: '',
    module: '',
    dateDebut: '',
    dateFin: '',
    status: ''
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedActions, setSelectedActions] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  // Statistiques avancées
  const [advancedStats, setAdvancedStats] = useState({
    totalActions: 0,
    actionsToday: 0,
    actionsThisWeek: 0,
    actionsThisMonth: 0,
    hourlyDistribution: {},
    dailyDistribution: {},
    monthlyTrend: [],
    averageActionsPerDay: 0,
    peakHour: '',
    peakDay: '',
    topUsers: [],
    mostActiveUser: { username: '', count: 0 },
    userRetention: 0,
    topModules: [],
    mostUsedModule: { module: '', count: 0 },
    moduleSuccessRate: {},
    actionDistribution: {},
    mostCommonAction: { action: '', count: 0 },
    successRate: 0,
    errorRate: 0,
    failedLogins: 0,
    suspiciousActivities: [],
    securityScore: 0,
    avgResponseTime: 0,
    storageEfficiency: 0,
    dataGrowthRate: 0,
    productivityIndex: 0,
    systemAdoptionRate: 0,
    userSatisfaction: 0
  });

  // Actions disponibles - MIS À JOUR AVEC LES ACTIONS CRUD
  const availableActions = useMemo(() => [
    'CONNEXION', 'DECONNEXION', 'CREATION COMPTE',
    'AJOUT', 'MODIFICATION', 'SUPPRESSION', 
    'CONSULTATION', 'EXPORTATION', 'GENERATION',
    'RÉSOLUTION', 'NAVIGATION', 'LECTURE',
    'IMPORTATION', 'VALIDATION', 'REJET',
    'APPROBATION', 'ARCHIVAGE', 'RESTAURATION',
    'DEMARRAGE' // Ajouté pour l'action de démarrage
  ], []);

  // Modules disponibles - MIS À JOUR
  const availableModules = useMemo(() => [
    'Matériels', 'Logiciels', 'Incidents', 'Réparations',
    'Alertes', 'Fournisseurs', 'Utilisateurs', 'Rapports',
    'Authentification', 'Navigation', 'Système', 'Configuration',
    'Dashboard', 'Réseau', 'Stockage', 'Sécurité',
    'Audit', 'Maintenance', 'Backup', 'Monitoring',
    'Installations' // Ajouté pour les installations logiciels
  ], []);

  // Charger l'historique
  const loadHistorique = useCallback((page = 1, forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser la fonction getHistoriqueLocal qui est maintenant dans window
      const allData = getHistoriqueLocal();
      
      console.log(`📊 ${allData.length} actions chargées depuis localStorage`);
      
      // Appliquer les filtres
      const filteredData = applyFilters(allData, filters);
      
      // Appliquer le tri
      const sortedData = applySort(filteredData, sortConfig);
      
      // Calculer les statistiques avancées
      calculateAdvancedStats(sortedData);
      
      // Pagination
      const startIndex = (page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedData = sortedData.slice(startIndex, endIndex);
      
      setHistorique(paginatedData);
      setPagination(prev => ({
        ...prev,
        page: page,
        total: sortedData.length,
        totalPages: Math.ceil(sortedData.length / prev.limit)
      }));
      
      if (forceRefresh) {
        showNotification('Historique actualisé', 'success');
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement historique:', error);
      setError('Erreur de chargement des données');
      setHistorique([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortConfig, pagination.limit, showNotification]);

  // Appliquer les filtres
  const applyFilters = (data, filters) => {
    let filtered = [...data];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.utilisateur?.toLowerCase().includes(searchTerm) ||
        item.action?.toLowerCase().includes(searchTerm) ||
        item.module?.toLowerCase().includes(searchTerm) ||
        item.details?.toLowerCase().includes(searchTerm) ||
        false
      );
    }
    
    if (filters.utilisateur) {
      filtered = filtered.filter(item => item.utilisateur === filters.utilisateur);
    }
    
    if (filters.action) {
      filtered = filtered.filter(item => item.action === filters.action);
    }
    
    if (filters.module) {
      filtered = filtered.filter(item => item.module === filters.module);
    }
    
    if (filters.dateDebut) {
      const startDate = new Date(filters.dateDebut);
      filtered = filtered.filter(item => new Date(item.date) >= startDate);
    }
    
    if (filters.dateFin) {
      const endDate = new Date(filters.dateFin);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => new Date(item.date) <= endDate);
    }
    
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    
    return filtered;
  };

  // Appliquer le tri
  const applySort = (data, sortConfig) => {
    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Calculer les statistiques avancées
  const calculateAdvancedStats = (data) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Distribution temporelle
    const hourlyDistribution = {};
    const dailyDistribution = {};
    const monthlyTrend = [];
    
    // Compteurs
    const userCounts = {};
    const moduleCounts = {};
    const actionCounts = {};
    
    let successfulActions = 0;
    let failedLogins = 0;
    let suspiciousActivities = [];
    
    data.forEach(item => {
      const date = new Date(item.date);
      const hour = date.getHours();
      const day = date.toLocaleDateString('fr-FR');
      
      // Distribution horaire
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
      
      // Distribution journalière
      dailyDistribution[day] = (dailyDistribution[day] || 0) + 1;
      
      // Comptage utilisateurs
      if (item.utilisateur) {
        userCounts[item.utilisateur] = (userCounts[item.utilisateur] || 0) + 1;
      }
      
      // Comptage modules
      if (item.module) {
        moduleCounts[item.module] = (moduleCounts[item.module] || 0) + 1;
      }
      
      // Comptage actions
      if (item.action) {
        actionCounts[item.action] = (actionCounts[item.action] || 0) + 1;
      }
      
      // Succès/échecs
      if (item.status === 'SUCCESS') {
        successfulActions++;
      }
      
      // Sécurité
      if (item.action === 'CONNEXION' && item.status === 'ERROR') {
        failedLogins++;
      }
      
      // Activités suspectes
      if (item.action === 'SUPPRESSION' || item.action === 'MODIFICATION' || item.action === 'CREATION COMPTE') {
        if (!item.utilisateur || item.utilisateur === 'unknown') {
          suspiciousActivities.push(item);
        }
      }
    });
    
    // Tendances mensuelles
    const monthlyData = {};
    data.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });
    
    Object.entries(monthlyData).forEach(([month, count]) => {
      monthlyTrend.push({ month, count });
    });
    
    // Trier et préparer les données
    const topUsers = Object.entries(userCounts)
      .map(([username, count]) => ({ username, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const topModules = Object.entries(moduleCounts)
      .map(([module, count]) => ({ module, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Calculs avancés
    const totalActions = data.length;
    const actionsToday = data.filter(item => new Date(item.date) >= today).length;
    const actionsThisWeek = data.filter(item => new Date(item.date) >= weekAgo).length;
    const actionsThisMonth = data.filter(item => new Date(item.date) >= monthAgo).length;
    
    // Performance
    const averageActionsPerDay = totalActions > 0 ? (totalActions / 30).toFixed(1) : 0;
    const peakHour = Object.entries(hourlyDistribution)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    const peakDay = Object.entries(dailyDistribution)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    
    // Utilisateurs
    const mostActiveUser = topUsers[0] || { username: '', count: 0 };
    const userRetention = topUsers.length > 0 ? Math.min(100, (topUsers.length / totalActions) * 1000) : 0;
    
    // Modules
    const mostUsedModule = topModules[0] || { module: '', count: 0 };
    
    // Actions
    const actionDistribution = actionCounts;
    const mostCommonAction = Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)[0] || ['', 0];
    
    const successRate = totalActions > 0 ? Math.round((successfulActions / totalActions) * 100) : 0;
    const errorRate = 100 - successRate;
    
    // Indicateurs métiers
    const productivityIndex = Math.min(100, Math.round((actionsToday / 50) * 100));
    const systemAdoptionRate = Math.min(100, Math.round((topUsers.length / 10) * 100));
    const userSatisfaction = Math.min(100, Math.round(successRate * 0.8 + systemAdoptionRate * 0.2));
    
    // Sécurité
    const securityScore = Math.max(0, 100 - (failedLogins * 5) - (suspiciousActivities.length * 10));
    
    setAdvancedStats({
      totalActions,
      actionsToday,
      actionsThisWeek,
      actionsThisMonth,
      
      hourlyDistribution,
      dailyDistribution,
      monthlyTrend,
      
      averageActionsPerDay,
      peakHour: `${peakHour}h`,
      peakDay,
      
      topUsers,
      mostActiveUser,
      userRetention,
      
      topModules,
      mostUsedModule,
      moduleSuccessRate: {},
      
      actionDistribution,
      mostCommonAction: { action: mostCommonAction[0], count: mostCommonAction[1] },
      successRate,
      errorRate,
      
      failedLogins,
      suspiciousActivities,
      securityScore,
      
      avgResponseTime: 0.5,
      storageEfficiency: 85,
      dataGrowthRate: 12,
      
      productivityIndex,
      systemAdoptionRate,
      userSatisfaction
    });
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Obtenir la couleur pour l'action
  const getActionColor = (action) => {
    const actionColors = {
      'CONNEXION': 'badge-success',
      'DECONNEXION': 'badge-warning',
      'CREATION COMPTE': 'badge-primary',
      'AJOUT': 'badge-primary',
      'MODIFICATION': 'badge-warning',
      'SUPPRESSION': 'badge-error',
      'CONSULTATION': 'badge-info',
      'EXPORTATION': 'badge-secondary',
      'GENERATION': 'badge-secondary',
      'RÉSOLUTION': 'badge-success',
      'NAVIGATION': 'badge-neutral',
      'LECTURE': 'badge-info',
      'IMPORTATION': 'badge-primary',
      'VALIDATION': 'badge-success',
      'REJET': 'badge-error',
      'APPROBATION': 'badge-success',
      'ARCHIVAGE': 'badge-neutral',
      'RESTAURATION': 'badge-warning',
      'DEMARRAGE': 'badge-accent'
    };
    
    return actionColors[action] || 'badge-neutral';
  };

  // Obtenir l'icône pour l'action
  const getActionIcon = (action) => {
    const actionIcons = {
      'CONNEXION': <LogIn className="h-4 w-4" />,
      'DECONNEXION': <LogOut className="h-4 w-4" />,
      'CREATION COMPTE': <Key className="h-4 w-4" />,
      'AJOUT': <FilePlus className="h-4 w-4" />,
      'MODIFICATION': <FileEdit className="h-4 w-4" />,
      'SUPPRESSION': <FileDelete className="h-4 w-4" />,
      'CONSULTATION': <EyeIcon className="h-4 w-4" />,
      'EXPORTATION': <FileDown className="h-4 w-4" />,
      'GENERATION': <FileText className="h-4 w-4" />,
      'RÉSOLUTION': <CheckCircle className="h-4 w-4" />,
      'NAVIGATION': <Navigation className="h-4 w-4" />,
      'LECTURE': <BookOpen className="h-4 w-4" />,
      'IMPORTATION': <Upload className="h-4 w-4" />,
      'VALIDATION': <CheckCircle className="h-4 w-4" />,
      'REJET': <XCircle className="h-4 w-4" />,
      'APPROBATION': <ShieldCheck className="h-4 w-4" />,
      'ARCHIVAGE': <Save className="h-4 w-4" />,
      'RESTAURATION': <History className="h-4 w-4" />,
      'DEMARRAGE': <PlayCircle className="h-4 w-4" />
    };
    
    return actionIcons[action] || <FileText className="h-4 w-4" />;
  };

  // Obtenir la description courte
  const getShortSummary = (item) => {
    return `${item.utilisateur} ${item.action.toLowerCase()} dans ${item.module}: ${item.details}`;
  };

  // Basculer l'auto-refresh
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadHistorique(pagination.page, true);
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, pagination.page, loadHistorique]);

  // Charger au démarrage et écouter les nouvelles actions
  useEffect(() => {
    loadHistorique(pagination.page);
    
    // Écouter les nouvelles actions CRUD
    const handleNewAction = (event) => {
      console.log('🔄 Nouvelle action CRUD détectée:', event.detail);
      loadHistorique(pagination.page);
      if (event.detail) {
        showNotification(`Nouvelle action: ${event.detail.action} - ${event.detail.module}`, 'info');
      }
    };
    
    window.addEventListener('action-logged', handleNewAction);
    window.addEventListener('historique-updated', handleNewAction);
    
    return () => {
      window.removeEventListener('action-logged', handleNewAction);
      window.removeEventListener('historique-updated', handleNewAction);
    };
  }, [loadHistorique, pagination.page, showNotification]);

  // Générer rapport détaillé
  const generateDetailedReport = () => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('RAPPORT STATISTIQUES AVANCÉES - DREN AA', 20, 20);
    
    // Statistiques générales
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
    doc.text(`Période analysée: ${filters.dateDebut || 'Début'} - ${filters.dateFin || 'Aujourd\'hui'}`, 20, 42);
    doc.text(`Total actions: ${advancedStats.totalActions}`, 20, 49);
    
    // Tableau de bord
    doc.setFontSize(16);
    doc.text('TABLEAU DE BORD DES PERFORMANCES', 20, 65);
    
    let yPos = 75;
    
    // Indicateurs clés
    const keyStats = [
      ['Indicateur', 'Valeur', 'Statut'],
      ['Actions aujourd\'hui', advancedStats.actionsToday, advancedStats.actionsToday > 20 ? '🔴 Haut' : '🟢 Normal'],
      ['Taux de succès', `${advancedStats.successRate}%`, advancedStats.successRate > 90 ? '🟢 Excellent' : '🟡 Moyen'],
      ['Score sécurité', `${advancedStats.securityScore}/100`, advancedStats.securityScore > 80 ? '🟢 Sécurisé' : '🟡 À surveiller'],
      ['Productivité', `${advancedStats.productivityIndex}%`, advancedStats.productivityIndex > 70 ? '🟢 Bonne' : '🟡 Modérée'],
      ['Utilisateurs actifs', advancedStats.topUsers.length, '🟢 Actif']
    ];
    
    autoTable(doc, {
      head: keyStats.slice(0, 1),
      body: keyStats.slice(1),
      startY: yPos,
      theme: 'grid'
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Top utilisateurs
    doc.setFontSize(14);
    doc.text('TOP 5 UTILISATEURS', 20, yPos);
    yPos += 10;
    
    const userData = advancedStats.topUsers.map(user => [user.username, user.count, `${Math.round((user.count / advancedStats.totalActions) * 100)}%`]);
    
    autoTable(doc, {
      head: [['Utilisateur', 'Actions', 'Part']],
      body: userData,
      startY: yPos,
      theme: 'striped'
    });
    
    // Top actions
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('DISTRIBUTION DES ACTIONS', 20, yPos);
    yPos += 10;
    
    const actionData = Object.entries(advancedStats.actionDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => [action, count, `${Math.round((count / advancedStats.totalActions) * 100)}%`]);
    
    autoTable(doc, {
      head: [['Action', 'Nombre', 'Pourcentage']],
      body: actionData,
      startY: yPos,
      theme: 'grid'
    });
    
    // Enregistrer
    doc.save(`rapport-statistiques-${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('Rapport PDF généré avec succès', 'success');
  };

  // Test rapide des actions CRUD
  const testCRUDActions = () => {
    if (window.testAllCRUDActions) {
      const result = window.testAllCRUDActions();
      showNotification('Test des actions CRUD démarré!', 'info');
      console.log('🧪 Test CRUD:', result);
    } else {
      showNotification('Fonction de test non disponible', 'error');
    }
  };

  // Ajouter une action manuelle
  const addManualAction = () => {
    if (window.addCRUDAction) {
      window.addCRUDAction();
    } else {
      showNotification('Fonction non disponible', 'error');
    }
  };

  // Voir le contenu complet
  const viewFullContent = () => {
    if (window.showHistorique) {
      window.showHistorique();
    } else {
      // Afficher le contenu directement
      const data = getHistoriqueLocal();
      console.log('📊 Historique complet:', data);
      alert(`Historique complet: ${data.length} actions`);
    }
  };

  // Effacer l'historique
  const clearHistorique = () => {
    if (window.confirm('Voulez-vous vraiment effacer tout l\'historique? Les actions CRUD continueront d\'être enregistrées.')) {
      if (window.clearHistorique) {
        window.clearHistorique();
        loadHistorique(1, true);
      } else {
        localStorage.removeItem('gestion_parc_historique');
        showNotification('Historique effacé!', 'success');
        loadHistorique(1, true);
      }
    }
  };

  // Composant StatCard réutilisable
  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <div className={`stat bg-base-200 rounded-lg p-4 border-l-4 ${color}`}>
      <div className="stat-figure text-opacity-80">
        {icon}
      </div>
      <div className="stat-title">{title}</div>
      <div className="stat-value text-2xl md:text-3xl">{value}</div>
      {subtitle && <div className="stat-desc">{subtitle}</div>}
      {trend && (
        <div className={`stat-desc flex items-center gap-1 ${trend > 0 ? 'text-success' : 'text-error'}`}>
          <TrendingUp className="h-3 w-3" />
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );

  // Trier par colonne
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Obtenir l'indicateur de tri
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽';
  };

  return (
    <div className="p-4 md:p-6 bg-base-100 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Tableau de Bord Historique
            <span className="badge badge-primary badge-lg">Analytics</span>
          </h1>
          <p className="text-base-content opacity-70 mt-1">
            Surveillance avancée des performances et activités système
            <span className="ml-2 text-success font-medium">
              • 👤 Connecté: {user?.username || 'Utilisateur'}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <span className="label-text text-sm">Auto-refresh (30s)</span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary toggle-sm"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            </label>
          </div>
          <select 
            className="select select-bordered select-sm"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="table">📊 Tableau</option>
            <option value="cards">🃏 Cartes</option>
            <option value="timeline">📅 Timeline</option>
          </select>
          <button 
            onClick={generateDetailedReport}
            className="btn btn-primary btn-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Rapport PDF
          </button>
          <button 
            onClick={() => loadHistorique(1, true)}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mb-6 p-4 bg-base-200 rounded-lg">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-medium text-base-content">Actions rapides:</span>
          <button 
            onClick={testCRUDActions}
            className="btn btn-sm btn-success"
            title="Tester toutes les actions CRUD"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Tester actions CRUD
          </button>
          <button 
            onClick={addManualAction}
            className="btn btn-sm btn-primary"
            title="Ajouter une action manuelle"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter action
          </button>
          <button 
            onClick={viewFullContent}
            className="btn btn-sm btn-info"
            title="Voir le contenu complet"
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir contenu
          </button>
          <button 
            onClick={clearHistorique}
            className="btn btn-sm btn-error"
            title="Effacer l'historique"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Effacer
          </button>
        </div>
        <div className="text-xs text-base-content opacity-60 mt-2">
          Utilisez ces boutons pour tester et gérer l'historique. Les actions CRUD sont automatiquement enregistrées.
        </div>
      </div>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Actions totales"
          value={advancedStats.totalActions}
          icon={<History className="h-6 w-6" />}
          color="border-l-primary"
          subtitle="Toutes opérations"
        />
        
        <StatCard
          title="Aujourd'hui"
          value={advancedStats.actionsToday}
          icon={<Activity className="h-6 w-6" />}
          color="border-l-success"
          subtitle="Dernières 24h"
          trend={12}
        />
        
        <StatCard
          title="Taux succès"
          value={`${advancedStats.successRate}%`}
          icon={<CheckCircle className="h-6 w-6" />}
          color="border-l-success"
          subtitle="Opérations réussies"
        />
        
        <StatCard
          title="Productivité"
          value={`${advancedStats.productivityIndex}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="border-l-warning"
          subtitle="Index performance"
        />
        
        <StatCard
          title="Sécurité"
          value={`${advancedStats.securityScore}/100`}
          icon={<ShieldCheck className="h-6 w-6" />}
          color="border-l-error"
          subtitle="Score système"
        />
        
        <StatCard
          title="Adoption"
          value={`${advancedStats.systemAdoptionRate}%`}
          icon={<UserCheck className="h-6 w-6" />}
          color="border-l-info"
          subtitle="Taux d'utilisation"
        />
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top utilisateurs */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">
              <User className="h-5 w-5" />
              Top Utilisateurs
              <div className="badge badge-primary">{advancedStats.topUsers.length}</div>
            </h2>
            <div className="space-y-3">
              {advancedStats.topUsers.map((user, index) => (
                <div key={user.username} className="flex items-center justify-between p-2 bg-base-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-primary text-primary-content' : 'bg-base-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-xs opacity-70">{user.count} actions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {Math.round((user.count / advancedStats.totalActions) * 100)}%
                    </div>
                    <progress 
                      className="progress progress-primary w-24" 
                      value={user.count} 
                      max={advancedStats.mostActiveUser.count || 1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution des modules */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">
              <Layers className="h-5 w-5" />
              Modules les plus utilisés
            </h2>
            <div className="space-y-3">
              {advancedStats.topModules.map((module, index) => (
                <div key={module.module} className="flex items-center justify-between p-2 bg-base-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-secondary text-secondary-content' : 'bg-base-300'
                    }`}>
                      {getModuleIcon(module.module)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{module.module}</div>
                      <div className="text-xs opacity-70">
                        {module.count} actions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{Math.round((module.count / advancedStats.totalActions) * 100)}%</div>
                    <progress 
                      className="progress progress-secondary w-24" 
                      value={module.count} 
                      max={advancedStats.mostUsedModule.count || 1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analyse temporelle */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">
              <Clock3 className="h-5 w-5" />
              Analyse temporelle
            </h2>
            <div className="space-y-4">
              <div className="bg-base-100 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Pic d'activité</span>
                  <span className="badge badge-primary">{advancedStats.peakHour}</span>
                </div>
                <div className="text-xs opacity-70">Heure de plus forte activité</div>
              </div>
              
              <div className="bg-base-100 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Moyenne journalière</span>
                  <span className="badge badge-secondary">{advancedStats.averageActionsPerDay}</span>
                </div>
                <div className="text-xs opacity-70">Actions par jour (30 derniers jours)</div>
              </div>
              
              <div className="bg-base-100 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Cette semaine</span>
                  <span className="badge badge-success">{advancedStats.actionsThisWeek}</span>
                </div>
                <div className="text-xs opacity-70">Actions sur 7 jours</div>
              </div>
              
              <div className="bg-base-100 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Ce mois</span>
                  <span className="badge badge-warning">{advancedStats.actionsThisMonth}</span>
                </div>
                <div className="text-xs opacity-70">Actions sur 30 jours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="card-title text-base-content">
              <Filter className="h-5 w-5" />
              Filtres de recherche avancés
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => loadHistorique(1)}
                className="btn btn-primary btn-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Appliquer
              </button>
              <button 
                onClick={() => {
                  setFilters({
                    search: '',
                    utilisateur: '',
                    action: '',
                    module: '',
                    dateDebut: '',
                    dateFin: '',
                    status: ''
                  });
                  setTimeout(() => loadHistorique(1), 100);
                }}
                className="btn btn-outline btn-sm"
              >
                Réinitialiser
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Recherche globale
                </span>
              </label>
              <input
                type="text"
                placeholder="Rechercher dans tous les champs..."
                className="input input-bordered bg-base-100"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>

            {/* Utilisateur */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Utilisateur
                </span>
              </label>
              <select
                className="select select-bordered bg-base-100"
                value={filters.utilisateur}
                onChange={(e) => setFilters({...filters, utilisateur: e.target.value})}
              >
                <option value="">Tous les utilisateurs</option>
                {Array.from(new Set(historique.map(h => h.utilisateur))).map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            {/* Action */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type d'action</span>
              </label>
              <select
                className="select select-bordered bg-base-100"
                value={filters.action}
                onChange={(e) => setFilters({...filters, action: e.target.value})}
              >
                <option value="">Toutes les actions</option>
                {availableActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>

            {/* Module */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Module</span>
              </label>
              <select
                className="select select-bordered bg-base-100"
                value={filters.module}
                onChange={(e) => setFilters({...filters, module: e.target.value})}
              >
                <option value="">Tous les modules</option>
                {availableModules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Période de début
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered bg-base-100"
                value={filters.dateDebut}
                onChange={(e) => setFilters({...filters, dateDebut: e.target.value})}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Période de fin
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered bg-base-100"
                value={filters.dateFin}
                onChange={(e) => setFilters({...filters, dateFin: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vue Tableau */}
      {viewMode === 'table' && (
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-lg">Chargement de l'historique...</p>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-error m-4">
                <AlertTriangle className="h-6 w-6" />
                <div>
                  <h3 className="font-bold">Erreur de chargement</h3>
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            ) : historique.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune action enregistrée</h3>
                <p className="text-gray-500 mb-4">Les actions CRUD apparaîtront ici automatiquement.</p>
                <div className="space-x-2">
                  <button 
                    onClick={testCRUDActions}
                    className="btn btn-primary btn-sm"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Générer des actions de test
                  </button>
                  <button 
                    onClick={() => loadHistorique(1)}
                    className="btn btn-outline btn-sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="bg-base-200">
                        <th 
                          className="cursor-pointer hover:bg-base-300"
                          onClick={() => requestSort('date')}
                        >
                          Date {getSortIndicator('date')}
                        </th>
                        <th 
                          className="cursor-pointer hover:bg-base-300"
                          onClick={() => requestSort('utilisateur')}
                        >
                          Utilisateur {getSortIndicator('utilisateur')}
                        </th>
                        <th>Action</th>
                        <th>Module</th>
                        <th>Description</th>
                        <th>Statut</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historique.map((item) => (
                        <tr key={item.id} className="hover:bg-base-200">
                          <td className="whitespace-nowrap">
                            <div className="text-sm">{formatDate(item.date)}</div>
                            <div className="text-xs opacity-60">
                              {new Date(item.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 opacity-70" />
                              <span className="font-medium">{item.utilisateur}</span>
                            </div>
                          </td>
                          <td>
                            <div className={`badge ${getActionColor(item.action)} gap-2`}>
                              {getActionIcon(item.action)}
                              {item.action}
                            </div>
                          </td>
                          <td>
                            <div className="badge badge-outline gap-2">
                              {getModuleIcon(item.module)}
                              {item.module}
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              {item.details}
                              {item.ip_address && (
                                <div className="text-xs opacity-60 mt-1">
                                  IP: {item.ip_address}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className={`badge ${item.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>
                              {item.status || 'SUCCESS'}
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="flex justify-center gap-1">
                              <button
                                className="btn btn-ghost btn-xs"
                                onClick={() => {
                                  navigator.clipboard.writeText(JSON.stringify(item, null, 2));
                                  showNotification('Détails copiés', 'success');
                                }}
                                title="Copier les détails"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              <button
                                className="btn btn-ghost btn-xs"
                                onClick={() => {
                                  console.log('Détails complets:', item);
                                  alert(`Action: ${item.action}\nModule: ${item.module}\nUtilisateur: ${item.utilisateur}\nDate: ${formatDate(item.date)}\nDétails: ${item.details}`);
                                }}
                                title="Voir les détails"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-base-300 gap-4">
                  <div className="text-sm text-base-content opacity-70">
                    Affichage de {historique.length} sur {advancedStats.totalActions} actions
                  </div>
                  <div className="join">
                    <button
                      className="join-item btn btn-sm"
                      onClick={() => loadHistorique(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      «
                    </button>
                    <button className="join-item btn btn-sm">
                      Page {pagination.page} sur {pagination.totalPages}
                    </button>
                    <button
                      className="join-item btn btn-sm"
                      onClick={() => loadHistorique(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Vue Cartes */}
      {viewMode === 'cards' && historique.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {historique.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className={`badge ${getActionColor(item.action)} gap-2`}>
                    {getActionIcon(item.action)}
                    {item.action}
                  </div>
                  <div className={`badge ${item.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>
                    {item.status}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">{item.utilisateur}</h3>
                    <p className="text-sm opacity-70">{formatDate(item.date)}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="badge badge-outline gap-2 mb-2">
                    {getModuleIcon(item.module)}
                    {item.module}
                  </div>
                  <p className="text-sm">{item.details}</p>
                  {item.ip_address && (
                    <p className="text-xs opacity-60 mt-1">IP: {item.ip_address}</p>
                  )}
                </div>
                
                <div className="card-actions justify-end">
                  <button 
                    onClick={() => {
                      const details = `${item.utilisateur} ${item.action.toLowerCase()} dans ${item.module}\nDate: ${formatDate(item.date)}\nDétails: ${item.details}\nStatut: ${item.status}\nIP: ${item.ip_address || 'N/A'}`;
                      navigator.clipboard.writeText(details);
                      showNotification('Détails copiés', 'success');
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    <Copy className="h-4 w-4" />
                    Copier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aide et informations */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">
              <Info className="h-5 w-5" />
              Comment utiliser ces statistiques ?
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Actions totales</strong>: Volume global d'activités</li>
              <li>• <strong>Taux de succès</strong>: Indicateur de fiabilité</li>
              <li>• <strong>Productivité</strong>: Efficacité du système</li>
              <li>• <strong>Score sécurité</strong>: Niveau de protection</li>
              <li>• <strong>Top utilisateurs</strong>: Utilisateurs les plus actifs</li>
              <li>• <strong>Pic d'activité</strong>: Heure de charge maximale</li>
            </ul>
          </div>
        </div>
        
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">
              <BellRing className="h-5 w-5" />
              Alertes et recommandations
            </h3>
            <div className="space-y-2 text-sm">
              {advancedStats.failedLogins > 10 && (
                <div className="alert alert-warning">
                  <AlertTriangle className="h-4 w-4" />
                  <span>⚠️ Nombre élevé de tentatives de connexion échouées</span>
                </div>
              )}
              {advancedStats.successRate < 90 && (
                <div className="alert alert-warning">
                  <AlertTriangle className="h-4 w-4" />
                  <span>⚠️ Taux de succès inférieur à 90%</span>
                </div>
              )}
              {advancedStats.securityScore < 80 && (
                <div className="alert alert-error">
                  <XCircle className="h-4 w-4" />
                  <span>❌ Score sécurité critique</span>
                </div>
              )}
              {advancedStats.actionsToday > 50 && (
                <div className="alert alert-info">
                  <Activity className="h-4 w-4" />
                  <span>📈 Forte activité aujourd'hui</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fonction pour obtenir l'icône du module
const getModuleIcon = (module) => {
  const icons = {
    'Matériels': <Monitor className="h-4 w-4" />,
    'Logiciels': <Package className="h-4 w-4" />,
    'Incidents': <AlertTriangle className="h-4 w-4" />,
    'Réparations': <Wrench className="h-4 w-4" />,
    'Alertes': <Bell className="h-4 w-4" />,
    'Fournisseurs': <UsersIcon className="h-4 w-4" />,
    'Utilisateurs': <User className="h-4 w-4" />,
    'Rapports': <FileSpreadsheet className="h-4 w-4" />,
    'Authentification': <Shield className="h-4 w-4" />,
    'Navigation': <ExternalLink className="h-4 w-4" />,
    'Système': <Cpu className="h-4 w-4" />,
    'Configuration': <Settings className="h-4 w-4" />,
    'Dashboard': <DatabaseIcon className="h-4 w-4" />,
    'Réseau': <Server className="h-4 w-4" />,
    'Stockage': <HardDrive className="h-4 w-4" />,
    'Sécurité': <ShieldCheck className="h-4 w-4" />,
    'Audit': <FileText className="h-4 w-4" />,
    'Maintenance': <Wrench className="h-4 w-4" />,
    'Backup': <Save className="h-4 w-4" />,
    'Monitoring': <Activity className="h-4 w-4" />,
    'Installations': <Package className="h-4 w-4" />
  };
  
  return icons[module] || <FileText className="h-4 w-4" />;
};

export default Historique;