


// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
// // // // // // // import { Computer, AlertTriangle, Wrench, FileText, DollarSign, MapPin, Activity, Cpu, Shield, Network, Package, RefreshCw } from 'lucide-react';
// // // // // // // import { 
// // // // // // //   materielsAPI, 
// // // // // // //   incidentsAPI, 
// // // // // // //   reparationsAPI, 
// // // // // // //   dashboardAPI, 
// // // // // // //   logicielsAPI, 
// // // // // // //   alertesAPI, 
// // // // // // //   fournisseursAPI, 
// // // // // // //   reseauAPI 
// // // // // // // } from '../services/api';
// // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // import jsPDF from 'jspdf';

// // // // // // // // Import du logo pour le PDF seulement
// // // // // // // import logoDren from '../assets/images/logo-dren.jpeg';

// // // // // // // const Dashboard = () => {
// // // // // // //   const { user } = useAuth();
// // // // // // //   const [stats, setStats] = useState({
// // // // // // //     total_materiels: 0,
// // // // // // //     materiels_fonctionnels: 0,
// // // // // // //     materiels_en_panne: 0,
// // // // // // //     incidents_ouverts: 0,
// // // // // // //     reparations_ce_mois: 0,
// // // // // // //     cout_total_reparations: 0,
// // // // // // //     maintenance_prevue: 0,
// // // // // // //     total_logiciels: 0,
// // // // // // //     alertes_actives: 0,
// // // // // // //     total_fournisseurs: 0,
// // // // // // //     equipements_reseau: 0,
// // // // // // //   });
// // // // // // //   const [materiels, setMateriels] = useState([]);
// // // // // // //   const [incidents, setIncidents] = useState([]);
// // // // // // //   const [reparations, setReparations] = useState([]);
// // // // // // //   const [logiciels, setLogiciels] = useState([]);
// // // // // // //   const [alertes, setAlertes] = useState([]);
// // // // // // //   const [fournisseurs, setFournisseurs] = useState([]);
// // // // // // //   const [reseau, setReseau] = useState([]);
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [lastUpdate, setLastUpdate] = useState(null);
// // // // // // //   const [errors, setErrors] = useState([]);

// // // // // // //   // Fonctions helper pour manipuler les données en toute sécurité
// // // // // // //   const safeArray = (data) => {
// // // // // // //     return Array.isArray(data) ? data : [];
// // // // // // //   };

// // // // // // //   const safeFilter = (array, condition) => {
// // // // // // //     if (!Array.isArray(array)) return [];
// // // // // // //     return array.filter(condition);
// // // // // // //   };

// // // // // // //   const safeReduce = (array, reducer, initialValue = 0) => {
// // // // // // //     if (!Array.isArray(array)) return initialValue;
// // // // // // //     return array.reduce(reducer, initialValue);
// // // // // // //   };

// // // // // // //   const loadRealData = async () => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       setErrors([]);
// // // // // // //       console.log('🔄 Chargement des données depuis les APIs...');

// // // // // // //       const requests = [
// // // // // // //         { key: 'materiels', api: () => materielsAPI.getAll() },
// // // // // // //         { key: 'incidents', api: () => incidentsAPI.getAll() },
// // // // // // //         { key: 'reparations', api: () => reparationsAPI.getAll() },
// // // // // // //         { key: 'logiciels', api: () => logicielsAPI.getAll() },
// // // // // // //         { key: 'alertes', api: () => alertesAPI.getAll() },
// // // // // // //         { key: 'fournisseurs', api: () => fournisseursAPI.getAll() },
// // // // // // //         { key: 'reseau', api: () => reseauAPI.getAll() },
// // // // // // //       ];

// // // // // // //       const results = {};
// // // // // // //       const newErrors = [];

// // // // // // //       for (const request of requests) {
// // // // // // //         try {
// // // // // // //           const response = await request.api();
// // // // // // //           const extractedData = extractDataFromResponse(response);
// // // // // // //           results[request.key] = extractedData;
// // // // // // //           console.log(`✅ ${request.key} chargés:`, extractedData.length);
// // // // // // //         } catch (error) {
// // // // // // //           console.error(`❌ Erreur ${request.key}:`, error);
// // // // // // //           results[request.key] = [];
// // // // // // //           newErrors.push(`Erreur ${request.key}: ${error.response?.status || 'Connexion'}`);
// // // // // // //         }
// // // // // // //       }

// // // // // // //       setErrors(newErrors);

// // // // // // //       // Mettre à jour les états
// // // // // // //       setMateriels(safeArray(results.materiels));
// // // // // // //       setIncidents(safeArray(results.incidents));
// // // // // // //       setReparations(safeArray(results.reparations));
// // // // // // //       setLogiciels(safeArray(results.logiciels));
// // // // // // //       setAlertes(safeArray(results.alertes));
// // // // // // //       setFournisseurs(safeArray(results.fournisseurs));
// // // // // // //       setReseau(safeArray(results.reseau));

// // // // // // //       // CORRECTION: Calcul des alertes actives avec le bon champ statut
// // // // // // //       const alertesActives = safeFilter(results.alertes, a => 
// // // // // // //         a.statut === 'nouvelle' || a.statut === 'Nouvelle' || a.statut === 'en_traitement' || !a.statut
// // // // // // //       );

// // // // // // //       const calculatedStats = {
// // // // // // //         total_materiels: safeArray(results.materiels).length,
// // // // // // //         materiels_fonctionnels: safeFilter(results.materiels, m => 
// // // // // // //           m.etat === 'fonctionnel' || m.etat === 'Fonctionnel' || m.etat === 'actif' || m.etat === 'Actif'
// // // // // // //         ).length,
// // // // // // //         materiels_en_panne: safeFilter(results.materiels, m => 
// // // // // // //           m.etat === 'en_panne' || m.etat === 'En panne' || m.etat === 'panne' || m.etat === 'Panne'
// // // // // // //         ).length,
// // // // // // //         incidents_ouverts: safeFilter(results.incidents, i => 
// // // // // // //           i.statut === 'ouvert' || i.statut === 'Ouvert' || i.statut === 'en_cours' || i.statut === 'En cours' || i.statut === 'open'
// // // // // // //         ).length,
// // // // // // //         reparations_ce_mois: safeFilter(results.reparations, r => {
// // // // // // //           if (!r.date_reparation && !r.date_debut) return false;
// // // // // // //           try {
// // // // // // //             const dateReparation = new Date(r.date_reparation || r.date_debut);
// // // // // // //             const now = new Date();
// // // // // // //             return dateReparation.getMonth() === now.getMonth() && 
// // // // // // //                    dateReparation.getFullYear() === now.getFullYear();
// // // // // // //           } catch {
// // // // // // //             return false;
// // // // // // //           }
// // // // // // //         }).length,
// // // // // // //         cout_total_reparations: safeReduce(results.reparations, (sum, rep) => 
// // // // // // //           sum + (parseFloat(rep.cout) || 0), 0),
// // // // // // //         maintenance_prevue: safeFilter(results.materiels, m => 
// // // // // // //           m.maintenance_prevue || m.prochaine_maintenance
// // // // // // //         ).length,
// // // // // // //         total_logiciels: safeArray(results.logiciels).length,
// // // // // // //         alertes_actives: alertesActives.length, // Utilise le calcul corrigé
// // // // // // //         total_fournisseurs: safeArray(results.fournisseurs).length,
// // // // // // //         equipements_reseau: safeArray(results.reseau).length,
// // // // // // //       };

// // // // // // //       setStats(calculatedStats);
// // // // // // //       setLastUpdate(new Date());

// // // // // // //       console.log('✅ Stats calculées:', calculatedStats);

// // // // // // //     } catch (error) {
// // // // // // //       console.error('❌ Erreur générale lors du chargement:', error);
// // // // // // //       setErrors(prev => [...prev, 'Erreur générale: ' + error.message]);
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     loadRealData();
// // // // // // //   }, []);

// // // // // // //   // Données pour les graphiques
// // // // // // //   const materielsByEtat = [
// // // // // // //     { name: 'Fonctionnel', value: stats.materiels_fonctionnels, color: '#10b981' },
// // // // // // //     { name: 'En panne', value: stats.materiels_en_panne, color: '#ef4444' },
// // // // // // //     { name: 'Maintenance', value: stats.maintenance_prevue, color: '#f59e0b' },
// // // // // // //   ];

// // // // // // //   // CORRECTION: Alertes par sévérité avec le champ severite
// // // // // // //   const getAlertesByType = () => {
// // // // // // //     const alertesActives = safeFilter(alertes, a => 
// // // // // // //       a.statut === 'nouvelle' || a.statut === 'Nouvelle' || a.statut === 'en_traitement' || !a.statut
// // // // // // //     );
    
// // // // // // //     console.log('🔍 Alertes actives pour graphique:', alertesActives);
// // // // // // //     console.log('📋 Sévérités détectées:', alertesActives.map(a => ({ 
// // // // // // //       id: a.id, 
// // // // // // //       severite: a.severite,
// // // // // // //       description: a.description?.substring(0, 50)
// // // // // // //     })));

// // // // // // //     const niveaux = {
// // // // // // //       critique: 0,
// // // // // // //       elevee: 0,
// // // // // // //       moyenne: 0,
// // // // // // //       basse: 0
// // // // // // //     };

// // // // // // //     alertesActives.forEach(alerte => {
// // // // // // //       const severite = alerte.severite ? alerte.severite.toString().toLowerCase().trim() : '';
      
// // // // // // //       if (severite === 'critique') {
// // // // // // //         niveaux.critique++;
// // // // // // //       } else if (severite === 'elevee' || severite === 'élevée' || severite === 'élevé') {
// // // // // // //         niveaux.elevee++;
// // // // // // //       } else if (severite === 'moyenne' || severite === 'moyen') {
// // // // // // //         niveaux.moyenne++;
// // // // // // //       } else if (severite === 'basse' || severite === 'bas') {
// // // // // // //         niveaux.basse++;
// // // // // // //       }
// // // // // // //     });

// // // // // // //     const resultat = [
// // // // // // //       { name: 'Critique', value: niveaux.critique, color: '#ef4444' },
// // // // // // //       { name: 'Élevée', value: niveaux.elevee, color: '#f97316' },
// // // // // // //       { name: 'Moyenne', value: niveaux.moyenne, color: '#eab308' },
// // // // // // //       { name: 'Basse', value: niveaux.basse, color: '#22c55e' }
// // // // // // //     ];

// // // // // // //     console.log('📊 Résultat final des sévérités:', resultat);
// // // // // // //     return resultat;
// // // // // // //   };

// // // // // // //   const alertesByType = getAlertesByType();

// // // // // // //   // Répartition des matériels par service
// // // // // // //   const materielsByService = safeReduce(materiels, (acc, materiel) => {
// // // // // // //     const service = materiel.service || materiel.departement || materiel.service_attribue || 'Non assigné';
// // // // // // //     acc[service] = (acc[service] || 0) + 1;
// // // // // // //     return acc;
// // // // // // //   }, {});

// // // // // // //   const serviceData = Object.entries(materielsByService).map(([service, count]) => ({
// // // // // // //     service: service.length > 15 ? service.substring(0, 15) + '...' : service,
// // // // // // //     count
// // // // // // //   }));

// // // // // // //   // Évolution des incidents par mois
// // // // // // //   const getIncidentsByMonth = () => {
// // // // // // //     const incidentsFiltres = safeFilter(incidents, i => 
// // // // // // //       i.date_creation || i.date || i.created_at
// // // // // // //     );

// // // // // // //     const incidentsByMonth = safeReduce(incidentsFiltres, (acc, incident) => {
// // // // // // //       let dateIncident;
      
// // // // // // //       if (incident.date_creation) {
// // // // // // //         dateIncident = new Date(incident.date_creation);
// // // // // // //       } else if (incident.date) {
// // // // // // //         dateIncident = new Date(incident.date);
// // // // // // //       } else if (incident.created_at) {
// // // // // // //         dateIncident = new Date(incident.created_at);
// // // // // // //       }
      
// // // // // // //       if (dateIncident && !isNaN(dateIncident.getTime())) {
// // // // // // //         const month = dateIncident.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
// // // // // // //         acc[month] = (acc[month] || 0) + 1;
// // // // // // //       }
      
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     const sortedMonths = Object.entries(incidentsByMonth)
// // // // // // //       .sort(([a], [b]) => {
// // // // // // //         const dateA = new Date('01 ' + a);
// // // // // // //         const dateB = new Date('01 ' + b);
// // // // // // //         return dateA - dateB;
// // // // // // //       })
// // // // // // //       .slice(-6);

// // // // // // //     return sortedMonths.map(([month, count]) => ({
// // // // // // //       month,
// // // // // // //       incidents: count
// // // // // // //     }));
// // // // // // //   };

// // // // // // //   const incidentsMonthData = getIncidentsByMonth();

// // // // // // //   const formatCurrency = (amount) => {
// // // // // // //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// // // // // // //   };

// // // // // // //   const generatePDFReport = async () => {
// // // // // // //     const doc = new jsPDF();
    
// // // // // // //     try {
// // // // // // //       const imgData = await getBase64Image(logoDren);
// // // // // // //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// // // // // // //     } catch (error) {
// // // // // // //       console.warn('Logo non chargé dans le PDF:', error);
// // // // // // //     }
    
// // // // // // //     doc.setFontSize(18);
// // // // // // //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// // // // // // //     doc.setFontSize(14);
// // // // // // //     doc.text('Rapport de Gestion des Ressources Informatiques', 20, 40);
// // // // // // //     doc.setFontSize(12);
// // // // // // //     doc.text(`Date de génération: ${new Date().toLocaleDateString('fr-FR')}`, 20, 55);
// // // // // // //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 65);
    
// // // // // // //     doc.setDrawColor(200, 200, 200);
// // // // // // //     doc.line(20, 75, 190, 75);
    
// // // // // // //     doc.setFontSize(16);
// // // // // // //     doc.text('STATISTIQUES GÉNÉRALES', 20, 90);
    
// // // // // // //     doc.setFontSize(12);
// // // // // // //     let yPos = 105;
// // // // // // //     const statsToShow = [
// // // // // // //       `Total matériels: ${stats.total_materiels}`,
// // // // // // //       `Matériels fonctionnels: ${stats.materiels_fonctionnels}`,
// // // // // // //       `Matériels en panne: ${stats.materiels_en_panne}`,
// // // // // // //       `Incidents ouverts: ${stats.incidents_ouverts}`,
// // // // // // //       `Alertes actives: ${stats.alertes_actives}`,
// // // // // // //       `Réparations ce mois: ${stats.reparations_ce_mois}`,
// // // // // // //       `Coût total réparations: ${formatCurrency(stats.cout_total_reparations)}`,
// // // // // // //       `Total logiciels: ${stats.total_logiciels}`,
// // // // // // //       `Fournisseurs: ${stats.total_fournisseurs}`,
// // // // // // //       `Équipements réseau: ${stats.equipements_reseau}`
// // // // // // //     ];

// // // // // // //     statsToShow.forEach(stat => {
// // // // // // //       doc.text(stat, 20, yPos);
// // // // // // //       yPos += 8;
// // // // // // //     });

// // // // // // //     yPos += 10;
// // // // // // //     doc.setFontSize(16);
// // // // // // //     doc.text('ALERTES ACTIVES', 20, yPos);
// // // // // // //     yPos += 10;
    
// // // // // // //     doc.setFontSize(10);
// // // // // // //     const alertesActives = safeFilter(alertes, a => 
// // // // // // //       a.statut === 'nouvelle' || a.statut === 'Nouvelle' || a.statut === 'en_traitement' || !a.statut
// // // // // // //     );
    
// // // // // // //     if (alertesActives.length === 0) {
// // // // // // //       doc.text('✅ Aucune alerte active', 20, yPos);
// // // // // // //       yPos += 8;
// // // // // // //     } else {
// // // // // // //       alertesActives.slice(0, 10).forEach((alerte, index) => {
// // // // // // //         const description = alerte.description || 'Alerte sans description';
// // // // // // //         const severite = alerte.severite || 'Non spécifiée';
// // // // // // //         const text = `${index + 1}. ${description.substring(0, 40)}... - ${severite}`;
// // // // // // //         if (yPos > 270) {
// // // // // // //           doc.addPage();
// // // // // // //           yPos = 20;
// // // // // // //         }
// // // // // // //         doc.text(text, 20, yPos);
// // // // // // //         yPos += 6;
// // // // // // //       });
// // // // // // //     }

// // // // // // //     doc.setFontSize(10);
// // // // // // //     doc.setTextColor(150, 150, 150);
// // // // // // //     doc.text('Système de Gestion des Ressources Informatiques - DREN Antsimo Andrefana', 20, 285);

// // // // // // //     doc.save('Rapport-GestionRessourcesIT-DREN-AA.pdf');
// // // // // // //   };

// // // // // // //   const getBase64Image = (imgUrl) => {
// // // // // // //     return new Promise((resolve, reject) => {
// // // // // // //       const img = new Image();
// // // // // // //       img.crossOrigin = 'Anonymous';
// // // // // // //       img.onload = () => {
// // // // // // //         const canvas = document.createElement('canvas');
// // // // // // //         const ctx = canvas.getContext('2d');
// // // // // // //         canvas.width = img.width;
// // // // // // //         canvas.height = img.height;
// // // // // // //         ctx.drawImage(img, 0, 0);
// // // // // // //         const dataURL = canvas.toDataURL('image/jpeg');
// // // // // // //         resolve(dataURL);
// // // // // // //       };
// // // // // // //       img.onerror = reject;
// // // // // // //       img.src = imgUrl;
// // // // // // //     });
// // // // // // //   };

// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex items-center justify-center min-h-screen">
// // // // // // //         <div className="text-center">
// // // // // // //           <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
// // // // // // //           <p className="text-lg">Chargement des données en temps réel...</p>
// // // // // // //           <p className="text-sm text-gray-500 mt-2">Connexion aux APIs...</p>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div className="p-6 bg-base-100 min-h-screen">
// // // // // // //       {errors.length > 0 && (
// // // // // // //         <div className="alert alert-warning mb-6">
// // // // // // //           <AlertTriangle className="h-5 w-5" />
// // // // // // //           <div>
// // // // // // //             <h3 className="font-bold">Certaines données sont indisponibles</h3>
// // // // // // //             <div className="text-xs">
// // // // // // //               {errors.map((error, index) => (
// // // // // // //                 <div key={index}>• {error}</div>
// // // // // // //               ))}
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       <div className="flex justify-between items-center mb-6">
// // // // // // //         <div>
// // // // // // //           <div className="flex items-center mb-2">
// // // // // // //             <MapPin className="h-5 w-5 text-primary mr-2" />
// // // // // // //             <span className="text-sm text-base-content opacity-70">Toliara, Madagascar</span>
// // // // // // //           </div>
// // // // // // //           <h1 className="text-3xl font-bold text-base-content">Tableau de Bord Temps Réel</h1>
// // // // // // //           <p className="text-base-content opacity-70 mt-1">
// // // // // // //             Données en direct • Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
// // // // // // //           </p>
// // // // // // //           <p className="text-xs text-green-600 mt-1">
// // // // // // //             ✅ Connexion aux APIs établie - {stats.total_materiels} matériels chargés
// // // // // // //           </p>
// // // // // // //         </div>
// // // // // // //         <div className="flex gap-2">
// // // // // // //           <button onClick={loadRealData} className="btn btn-outline">
// // // // // // //             <RefreshCw className="h-4 w-4 mr-2" />
// // // // // // //             Actualiser
// // // // // // //           </button>
// // // // // // //           <button onClick={generatePDFReport} className="btn btn-primary">
// // // // // // //             <FileText className="h-4 w-4 mr-2" />
// // // // // // //             Rapport PDF
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// // // // // // //         <StatCard
// // // // // // //           title="Total Matériels"
// // // // // // //           value={stats.total_materiels}
// // // // // // //           description={`${stats.materiels_fonctionnels} fonctionnels`}
// // // // // // //           icon={Computer}
// // // // // // //           color="from-blue-500 to-blue-600"
// // // // // // //         />
// // // // // // //         <StatCard
// // // // // // //           title="Logiciels"
// // // // // // //           value={stats.total_logiciels}
// // // // // // //           description="Parc logiciel"
// // // // // // //           icon={Cpu}
// // // // // // //           color="from-green-500 to-green-600"
// // // // // // //         />
// // // // // // //         <StatCard
// // // // // // //           title="Alertes Actives"
// // // // // // //           value={stats.alertes_actives}
// // // // // // //           description="Nécessitent attention"
// // // // // // //           icon={Shield}
// // // // // // //           color="from-red-500 to-red-600"
// // // // // // //         />
// // // // // // //         <StatCard
// // // // // // //           title="Incidents Ouverts"
// // // // // // //           value={stats.incidents_ouverts}
// // // // // // //           description="En cours de traitement"
// // // // // // //           icon={Wrench}
// // // // // // //           color="from-yellow-500 to-yellow-600"
// // // // // // //         />
// // // // // // //       </div>

// // // // // // //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// // // // // // //         <StatCard
// // // // // // //           title="Coût Réparations"
// // // // // // //           value={formatCurrency(stats.cout_total_reparations)}
// // // // // // //           description="Total dépensé"
// // // // // // //           icon={DollarSign}
// // // // // // //           color="from-purple-500 to-purple-600"
// // // // // // //           small
// // // // // // //         />
// // // // // // //         <StatCard
// // // // // // //           title="Équipements Réseau"
// // // // // // //           value={stats.equipements_reseau}
// // // // // // //           description="Infrastructure"
// // // // // // //           icon={Network}
// // // // // // //           color="from-indigo-500 to-indigo-600"
// // // // // // //           small
// // // // // // //         />
// // // // // // //         <StatCard
// // // // // // //           title="Fournisseurs"
// // // // // // //           value={stats.total_fournisseurs}
// // // // // // //           description="Partenaires"
// // // // // // //           icon={Package}
// // // // // // //           color="from-orange-500 to-orange-600"
// // // // // // //           small
// // // // // // //         />
// // // // // // //       </div>

// // // // // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // // // // // //         <ChartCard title="État des Matériels">
// // // // // // //           <ResponsiveContainer width="100%" height={300}>
// // // // // // //             <PieChart>
// // // // // // //               <Pie
// // // // // // //                 data={materielsByEtat}
// // // // // // //                 cx="50%"
// // // // // // //                 cy="50%"
// // // // // // //                 labelLine={false}
// // // // // // //                 label={({ name, value }) => `${name}: ${value}`}
// // // // // // //                 outerRadius={80}
// // // // // // //                 dataKey="value"
// // // // // // //               >
// // // // // // //                 {materielsByEtat.map((entry, index) => (
// // // // // // //                   <Cell key={`cell-${index}`} fill={entry.color} />
// // // // // // //                 ))}
// // // // // // //               </Pie>
// // // // // // //               <Tooltip />
// // // // // // //             </PieChart>
// // // // // // //           </ResponsiveContainer>
// // // // // // //         </ChartCard>

// // // // // // //         <ChartCard title="Alertes par Sévérité">
// // // // // // //           {alertesByType.some(item => item.value > 0) ? (
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <BarChart data={alertesByType}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" />
// // // // // // //                 <XAxis dataKey="name" />
// // // // // // //                 <YAxis />
// // // // // // //                 <Tooltip />
// // // // // // //                 <Bar dataKey="value">
// // // // // // //                   {alertesByType.map((entry, index) => (
// // // // // // //                     <Cell key={`cell-${index}`} fill={entry.color} />
// // // // // // //                   ))}
// // // // // // //                 </Bar>
// // // // // // //               </BarChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //           ) : (
// // // // // // //             <div className="flex items-center justify-center h-64 text-gray-500">
// // // // // // //               Aucune alerte active
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </ChartCard>

// // // // // // //         {serviceData.length > 0 && (
// // // // // // //           <ChartCard title="Matériels par Service">
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <BarChart data={serviceData}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" />
// // // // // // //                 <XAxis dataKey="service" />
// // // // // // //                 <YAxis />
// // // // // // //                 <Tooltip />
// // // // // // //                 <Bar dataKey="count" fill="#3b82f6" />
// // // // // // //               </BarChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //           </ChartCard>
// // // // // // //         )}

// // // // // // //         <ChartCard title="Évolution des Incidents">
// // // // // // //           {incidentsMonthData.length > 0 ? (
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <LineChart data={incidentsMonthData}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" />
// // // // // // //                 <XAxis dataKey="month" />
// // // // // // //                 <YAxis />
// // // // // // //                 <Tooltip />
// // // // // // //                 <Line 
// // // // // // //                   type="monotone" 
// // // // // // //                   dataKey="incidents" 
// // // // // // //                   stroke="#ef4444" 
// // // // // // //                   strokeWidth={3}
// // // // // // //                   dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
// // // // // // //                 />
// // // // // // //               </LineChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //           ) : (
// // // // // // //             <div className="flex items-center justify-center h-64 text-gray-500">
// // // // // // //               Aucune donnée d'incident disponible
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </ChartCard>
// // // // // // //       </div>

// // // // // // //       <div className="card bg-base-200 shadow-xl mb-6">
// // // // // // //         <div className="card-body">
// // // // // // //           <h2 className="card-title text-base-content mb-4">
// // // // // // //             Alertes Récentes ({safeArray(alertes).length})
// // // // // // //           </h2>
// // // // // // //           <div className="space-y-3">
// // // // // // //             {safeArray(alertes).slice(0, 5).map((alerte, index) => (
// // // // // // //               <AlerteItem key={alerte.id || index} alerte={alerte} />
// // // // // // //             ))}
// // // // // // //             {safeArray(alertes).length === 0 && (
// // // // // // //               <div className="text-center py-4 text-base-content opacity-60">
// // // // // // //                 ✅ Aucune alerte active
// // // // // // //               </div>
// // // // // // //             )}
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       <div className="text-center text-sm text-gray-500 mb-4">
// // // // // // //         Données chargées: {safeArray(materiels).length} matériels, {safeArray(incidents).length} incidents, 
// // // // // // //         {safeArray(logiciels).length} logiciels, {safeArray(alertes).length} alertes
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // Composants réutilisables
// // // // // // // const StatCard = ({ title, value, description, icon: Icon, color, small = false }) => (
// // // // // // //   <div className={`card bg-gradient-to-r ${color} text-white shadow-xl`}>
// // // // // // //     <div className="card-body p-4">
// // // // // // //       <div className="flex items-center justify-between">
// // // // // // //         <div>
// // // // // // //           <h2 className={`card-title text-white opacity-90 ${small ? 'text-lg' : 'text-xl'}`}>
// // // // // // //             {title}
// // // // // // //           </h2>
// // // // // // //           <p className={`font-bold ${small ? 'text-xl' : 'text-3xl'}`}>{value}</p>
// // // // // // //           <p className="text-sm opacity-80">{description}</p>
// // // // // // //         </div>
// // // // // // //         <Icon className={`opacity-80 ${small ? 'h-8 w-8' : 'h-12 w-12'}`} />
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   </div>
// // // // // // // );

// // // // // // // const ChartCard = ({ title, children }) => (
// // // // // // //   <div className="card bg-base-200 shadow-xl">
// // // // // // //     <div className="card-body">
// // // // // // //       <h2 className="card-title text-base-content mb-4">{title}</h2>
// // // // // // //       {children}
// // // // // // //     </div>
// // // // // // //   </div>
// // // // // // // );

// // // // // // // // CORRECTION: Composant AlerteItem utilisant le champ severite
// // // // // // // const AlerteItem = ({ alerte }) => {
// // // // // // //   const getTitreAlerte = () => {
// // // // // // //     return alerte.description || 'Alerte sans description';
// // // // // // //   };

// // // // // // //   const getDescription = () => {
// // // // // // //     // Pour les alertes, on utilise seulement la description
// // // // // // //     return 'Type: ' + (alerte.type_alerte || 'Non spécifié') + 
// // // // // // //            ' | Source: ' + (alerte.materiel_nom || alerte.logiciel_nom || alerte.reseau_nom || 'Non spécifiée');
// // // // // // //   };

// // // // // // //   const getDateAlerte = () => {
// // // // // // //     const date = alerte.date_alerte || alerte.date_creation || alerte.created_at;
// // // // // // //     if (date) {
// // // // // // //       try {
// // // // // // //         const dateObj = new Date(date);
// // // // // // //         if (!isNaN(dateObj.getTime())) {
// // // // // // //           return dateObj.toLocaleDateString('fr-FR', {
// // // // // // //             day: '2-digit',
// // // // // // //             month: '2-digit',
// // // // // // //             year: 'numeric'
// // // // // // //           });
// // // // // // //         }
// // // // // // //       } catch (error) {
// // // // // // //         console.warn('Date invalide:', date);
// // // // // // //       }
// // // // // // //     }
// // // // // // //     return 'Date non spécifiée';
// // // // // // //   };

// // // // // // //   const getNiveauCouleur = () => {
// // // // // // //     const severite = alerte.severite ? alerte.severite.toString().toLowerCase().trim() : '';
    
// // // // // // //     if (severite === 'critique') return 'alert-error';
// // // // // // //     if (severite === 'elevee' || severite === 'élevée' || severite === 'élevé') return 'alert-warning';
// // // // // // //     if (severite === 'moyenne' || severite === 'moyen') return 'alert-info';
// // // // // // //     if (severite === 'basse' || severite === 'bas') return 'alert-success';
    
// // // // // // //     return 'alert-info';
// // // // // // //   };

// // // // // // //   const getNiveauFormate = () => {
// // // // // // //     const severite = alerte.severite ? alerte.severite.toString().toLowerCase().trim() : '';
    
// // // // // // //     if (severite === 'critique') return 'Critique';
// // // // // // //     if (severite === 'elevee' || severite === 'élevée' || severite === 'élevé') return 'Élevée';
// // // // // // //     if (severite === 'moyenne' || severite === 'moyen') return 'Moyenne';
// // // // // // //     if (severite === 'basse' || severite === 'bas') return 'Basse';
    
// // // // // // //     return alerte.severite || 'Non spécifiée';
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className={`alert ${getNiveauCouleur()}`}>
// // // // // // //       <div className="flex justify-between items-start w-full">
// // // // // // //         <div className="flex-1">
// // // // // // //           <h3 className="font-bold">{getTitreAlerte()}</h3>
// // // // // // //           <p className="text-sm mt-1">{getDescription()}</p>
// // // // // // //           <p className="text-xs mt-1 opacity-70">
// // // // // // //             Sévérité: <span className="font-semibold">{getNiveauFormate()}</span>
// // // // // // //           </p>
// // // // // // //         </div>
// // // // // // //         <span className="text-xs opacity-70 whitespace-nowrap ml-4">
// // // // // // //           {getDateAlerte()}
// // // // // // //         </span>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // Fonction utilitaire pour extraire les données des réponses API
// // // // // // // const extractDataFromResponse = (response) => {
// // // // // // //   if (!response || !response.data) {
// // // // // // //     console.log('❌ Réponse vide ou sans data:', response);
// // // // // // //     return [];
// // // // // // //   }
  
// // // // // // //   if (Array.isArray(response.data)) {
// // // // // // //     return response.data;
// // // // // // //   }
  
// // // // // // //   if (response.data.results && Array.isArray(response.data.results)) {
// // // // // // //     return response.data.results;
// // // // // // //   }
  
// // // // // // //   if (response.data.data && Array.isArray(response.data.data)) {
// // // // // // //     return response.data.data;
// // // // // // //   }
  
// // // // // // //   if (typeof response.data === 'object' && !Array.isArray(response.data)) {
// // // // // // //     return [response.data];
// // // // // // //   }
  
// // // // // // //   console.warn('⚠️ Format de réponse non reconnu:', response.data);
// // // // // // //   return [];
// // // // // // // };

// // // // // // // export default Dashboard;








// // // // // // // // src/pages/Dashboard.jsx - VERSION CORRIGÉE ET COMPLÈTE
// // // // // // // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // // // // // // import { 
// // // // // // //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// // // // // // //   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
// // // // // // //   AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, 
// // // // // // //   PolarRadiusAxis, Radar, ComposedChart
// // // // // // // } from 'recharts';
// // // // // // // import { 
// // // // // // //   BarChart3, TrendingUp, History, Filter, Search, 
// // // // // // //   Download, RefreshCw, Users, Calendar, FileText, 
// // // // // // //   Clock, Eye, Edit, Trash2, Plus, AlertTriangle, 
// // // // // // //   CheckCircle, XCircle, ArrowUpDown, MoreVertical, 
// // // // // // //   Database, Printer, ExternalLink, ChevronDown, 
// // // // // // //   ChevronUp, Copy, Save, Upload, Settings, Key, 
// // // // // // //   LogOut, LogIn, Shield, Bell, Package, Monitor, 
// // // // // // //   Network, Wrench, Users as UsersIcon, FileSpreadsheet,
// // // // // // //   BookOpen, FileEdit, FilePlus, FileMinus, FileDown,
// // // // // // //   Database as DatabaseIcon, HardDrive, Server, Cpu,
// // // // // // //   Activity, Zap, PieChart as PieChartIcon, CalendarDays, 
// // // // // // //   UserCheck, Target, Clock3, Layers, Grid3x3, AlertCircle,
// // // // // // //   Star, Award, Trophy, TrendingDown, DollarSign,
// // // // // // //   Percent, Hash, KeyRound, ShieldCheck, BarChart4, 
// // // // // // //   LineChart as LineChartIcon, DownloadCloud, Info, 
// // // // // // //   HelpCircle, BellRing, MapPin, Smartphone, Printer as PrinterIcon,
// // // // // // //   Router, Cloud, Wifi, Lock, Globe, Scan, Phone,
// // // // // // //   FileCode, Terminal, Battery, Thermometer, 
// // // // // // //   MemoryStick, Download as DownloadIcon, Upload as UploadIcon,
// // // // // // //   MonitorSmartphone, ShieldAlert
// // // // // // // } from 'lucide-react';
// // // // // // // import { 
// // // // // // //   materielsAPI, 
// // // // // // //   incidentsAPI, 
// // // // // // //   reparationsAPI, 
// // // // // // //   logicielsAPI, 
// // // // // // //   alertesAPI, 
// // // // // // //   fournisseursAPI, 
// // // // // // //   reseauAPI 
// // // // // // // } from '../services/api';
// // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // import { useNotification } from '../context/NotificationContext';
// // // // // // // import jsPDF from 'jspdf';
// // // // // // // import autoTable from 'jspdf-autotable';
// // // // // // // import * as XLSX from 'xlsx';

// // // // // // // // Import du logo
// // // // // // // import logoDren from '../assets/images/logo-dren.jpeg';

// // // // // // // // Fonctions utilitaires (déplacées en haut pour éviter les erreurs de référence)
// // // // // // // const getRandomColor = () => {
// // // // // // //   const colors = [
// // // // // // //     '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
// // // // // // //     '#ef4444', '#06b6d4', '#ec4899', '#84cc16'
// // // // // // //   ];
// // // // // // //   return colors[Math.floor(Math.random() * colors.length)];
// // // // // // // };

// // // // // // // const getPriorityColor = (priority) => {
// // // // // // //   const colors = {
// // // // // // //     'critique': '#ef4444',
// // // // // // //     'haute': '#f97316',
// // // // // // //     'moyenne': '#eab308',
// // // // // // //     'basse': '#22c55e',
// // // // // // //   };
// // // // // // //   return colors[priority.toLowerCase()] || '#6b7280';
// // // // // // // };

// // // // // // // const getSeverityColor = (severity) => {
// // // // // // //   const colors = {
// // // // // // //     'critique': '#ef4444',
// // // // // // //     'élevée': '#f97316',
// // // // // // //     'moyenne': '#eab308',
// // // // // // //     'basse': '#22c55e',
// // // // // // //   };
// // // // // // //   return colors[severity.toLowerCase()] || '#6b7280';
// // // // // // // };

// // // // // // // const getStatusText = (value, threshold = 80) => {
// // // // // // //   if (value > threshold) return 'Critique';
// // // // // // //   if (value > threshold - 20) return 'Élevé';
// // // // // // //   return 'Normal';
// // // // // // // };

// // // // // // // const Dashboard = () => {
// // // // // // //   const { user } = useAuth();
// // // // // // //   const { showNotification } = useNotification();
  
// // // // // // //   // États principaux
// // // // // // //   const [stats, setStats] = useState({
// // // // // // //     // Matériels
// // // // // // //     total_materiels: 0,
// // // // // // //     materiels_fonctionnels: 0,
// // // // // // //     materiels_en_panne: 0,
// // // // // // //     materiels_maintenance: 0,
// // // // // // //     materiels_par_service: {},
// // // // // // //     materiels_par_type: {},
    
// // // // // // //     // Logiciels
// // // // // // //     total_logiciels: 0,
// // // // // // //     logiciels_actifs: 0,
// // // // // // //     logiciels_expires: 0,
// // // // // // //     logiciels_par_categorie: {},
    
// // // // // // //     // Incidents & Réparations
// // // // // // //     incidents_ouverts: 0,
// // // // // // //     incidents_resolus: 0,
// // // // // // //     incidents_par_priorite: {},
// // // // // // //     reparations_ce_mois: 0,
// // // // // // //     cout_total_reparations: 0,
// // // // // // //     cout_moyen_reparation: 0,
    
// // // // // // //     // Alertes
// // // // // // //     alertes_actives: 0,
// // // // // // //     alertes_critiques: 0,
// // // // // // //     alertes_par_type: {},
// // // // // // //     alertes_par_severite: {},
    
// // // // // // //     // Fournisseurs & Réseau
// // // // // // //     total_fournisseurs: 0,
// // // // // // //     equipements_reseau: 0,
// // // // // // //     reseau_fonctionnel: 0,
    
// // // // // // //     // Utilisateurs & Système
// // // // // // //     utilisateurs_actifs: 0,
// // // // // // //     sessions_actives: 0,
// // // // // // //     activite_par_utilisateur: {},
    
// // // // // // //     // Performance système
// // // // // // //     uptime_systeme: 99.8,
// // // // // // //     taux_reponse_api: 98.5,
// // // // // // //     stockage_utilise: 76,
// // // // // // //     bande_passante: 85,
// // // // // // //     utilisation_moyenne: 65,
// // // // // // //   });
  
// // // // // // //   // États pour les données
// // // // // // //   const [materiels, setMateriels] = useState([]);
// // // // // // //   const [incidents, setIncidents] = useState([]);
// // // // // // //   const [reparations, setReparations] = useState([]);
// // // // // // //   const [logiciels, setLogiciels] = useState([]);
// // // // // // //   const [alertes, setAlertes] = useState([]);
// // // // // // //   const [fournisseurs, setFournisseurs] = useState([]);
// // // // // // //   const [reseau, setReseau] = useState([]);
  
// // // // // // //   // États UI comme l'historique
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [error, setError] = useState(null);
// // // // // // //   const [filters, setFilters] = useState({
// // // // // // //     search: '',
// // // // // // //     periode: 'today', // today, week, month, year, custom
// // // // // // //     dateDebut: '',
// // // // // // //     dateFin: '',
// // // // // // //     categorie: '', // materiels, incidents, alertes, logiciels, reseau
// // // // // // //     statut: '', // fonctionnel, panne, ouvert, résolu, active, critique
// // // // // // //   });
// // // // // // //   const [pagination, setPagination] = useState({
// // // // // // //     page: 1,
// // // // // // //     limit: 20,
// // // // // // //     total: 0,
// // // // // // //     totalPages: 0
// // // // // // //   });
// // // // // // //   const [sortConfig, setSortConfig] = useState({
// // // // // // //     key: 'date',
// // // // // // //     direction: 'desc'
// // // // // // //   });
// // // // // // //   const [expandedRows, setExpandedRows] = useState({});
// // // // // // //   const [selectedItems, setSelectedItems] = useState([]);
// // // // // // //   const [viewMode, setViewMode] = useState('overview'); // overview, detailed, analytics
// // // // // // //   const [autoRefresh, setAutoRefresh] = useState(false);
// // // // // // //   const [timeRange, setTimeRange] = useState('today');
// // // // // // //   const [selectedMetrics, setSelectedMetrics] = useState(['materiels', 'incidents', 'alertes', 'system']);
// // // // // // //   const [lastUpdate, setLastUpdate] = useState(null);

// // // // // // //   // Métriques système en temps réel
// // // // // // //   const [systemMetrics, setSystemMetrics] = useState({
// // // // // // //     cpuUsage: 45,
// // // // // // //     memoryUsage: 68,
// // // // // // //     diskUsage: 76,
// // // // // // //     networkIn: 125,
// // // // // // //     networkOut: 89,
// // // // // // //     apiLatency: 142,
// // // // // // //     activeConnections: 42,
// // // // // // //     failedRequests: 3,
// // // // // // //     databaseConnections: 12,
// // // // // // //     cacheHitRate: 92,
// // // // // // //   });
  
// // // // // // //   // Historique des métriques
// // // // // // //   const [metricsHistory, setMetricsHistory] = useState([]);

// // // // // // //   // Fonctions helper
// // // // // // //   const safeArray = (data) => Array.isArray(data) ? data : [];
// // // // // // //   const safeFilter = (array, condition) => array?.filter?.(condition) || [];
// // // // // // //   const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

// // // // // // //   // Charger les données
// // // // // // //   const loadData = useCallback(async () => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       setError(null);
// // // // // // //       console.log('📊 Chargement des données dashboard...');

// // // // // // //       const requests = [
// // // // // // //         { key: 'materiels', api: materielsAPI.getAll },
// // // // // // //         { key: 'incidents', api: incidentsAPI.getAll },
// // // // // // //         { key: 'reparations', api: reparationsAPI.getAll },
// // // // // // //         { key: 'logiciels', api: logicielsAPI.getAll },
// // // // // // //         { key: 'alertes', api: alertesAPI.getAll },
// // // // // // //         { key: 'fournisseurs', api: fournisseursAPI.getAll },
// // // // // // //         { key: 'reseau', api: reseauAPI.getAll },
// // // // // // //       ];

// // // // // // //       const results = {};
// // // // // // //       const newErrors = [];

// // // // // // //       for (const req of requests) {
// // // // // // //         try {
// // // // // // //           const response = await req.api();
// // // // // // //           results[req.key] = extractData(response);
// // // // // // //           console.log(`✅ ${req.key}: ${results[req.key].length} entrées`);
// // // // // // //         } catch (error) {
// // // // // // //           console.error(`❌ ${req.key}:`, error);
// // // // // // //           results[req.key] = [];
// // // // // // //           newErrors.push(`${req.key}: ${error.message || 'Erreur connexion'}`);
// // // // // // //         }
// // // // // // //       }

// // // // // // //       if (newErrors.length > 0) {
// // // // // // //         setError(newErrors.join(', '));
// // // // // // //       }
      
// // // // // // //       // Mettre à jour les états
// // // // // // //       setMateriels(safeArray(results.materiels));
// // // // // // //       setIncidents(safeArray(results.incidents));
// // // // // // //       setReparations(safeArray(results.reparations));
// // // // // // //       setLogiciels(safeArray(results.logiciels));
// // // // // // //       setAlertes(safeArray(results.alertes));
// // // // // // //       setFournisseurs(safeArray(results.fournisseurs));
// // // // // // //       setReseau(safeArray(results.reseau));

// // // // // // //       // Calculer les statistiques avancées
// // // // // // //       calculateAdvancedStats(results);
      
// // // // // // //       // Générer des métriques système simulées
// // // // // // //       generateSystemMetrics();
      
// // // // // // //       setLastUpdate(new Date());
// // // // // // //       showNotification('Tableau de bord actualisé', 'success');

// // // // // // //     } catch (error) {
// // // // // // //       console.error('❌ Erreur générale:', error);
// // // // // // //       setError('Erreur de chargement des données');
// // // // // // //       showNotification('Erreur lors du chargement', 'error');
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   }, [showNotification]);

// // // // // // //   // Calculer les statistiques avancées
// // // // // // //   const calculateAdvancedStats = useCallback((results) => {
// // // // // // //     // Matériels par service
// // // // // // //     const materielsParService = safeReduce(results.materiels, (acc, m) => {
// // // // // // //       const service = m.service || m.departement || m.service_attribue || 'Non assigné';
// // // // // // //       acc[service] = (acc[service] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Matériels par type
// // // // // // //     const materielsParType = safeReduce(results.materiels, (acc, m) => {
// // // // // // //       const type = m.type || m.categorie || 'Non spécifié';
// // // // // // //       acc[type] = (acc[type] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Incidents par priorité
// // // // // // //     const incidentsParPriorite = safeReduce(results.incidents, (acc, i) => {
// // // // // // //       const priorite = i.priorite || 'moyenne';
// // // // // // //       acc[priorite] = (acc[priorite] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Alertes par type
// // // // // // //     const alertesParType = safeReduce(results.alertes, (acc, a) => {
// // // // // // //       const type = a.type_alerte || 'Autre';
// // // // // // //       acc[type] = (acc[type] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Alertes par sévérité
// // // // // // //     const alertesParSeverite = safeReduce(results.alertes, (acc, a) => {
// // // // // // //       const severite = a.severite || 'non spécifiée';
// // // // // // //       acc[severite] = (acc[severite] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Activité par utilisateur (simulée pour le dashboard)
// // // // // // //     const activiteParUtilisateur = {
// // // // // // //       'admin': 45,
// // // // // // //       'technicien': 32,
// // // // // // //       'user1': 18,
// // // // // // //       'user2': 12,
// // // // // // //       'user3': 8
// // // // // // //     };

// // // // // // //     // Logiciels par catégorie
// // // // // // //     const logicielsParCategorie = safeReduce(results.logiciels, (acc, l) => {
// // // // // // //       const categorie = l.categorie || l.type || 'Autre';
// // // // // // //       acc[categorie] = (acc[categorie] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     const alertesActives = safeFilter(results.alertes, a => 
// // // // // // //       ['nouvelle', 'en_traitement', 'active'].includes(a.statut?.toLowerCase())
// // // // // // //     );

// // // // // // //     const alertesCritiques = safeFilter(alertesActives, a => 
// // // // // // //       a.severite?.toLowerCase() === 'critique'
// // // // // // //     );

// // // // // // //     const coutTotal = safeReduce(results.reparations, (sum, r) => 
// // // // // // //       sum + (parseFloat(r.cout) || 0), 0
// // // // // // //     );
// // // // // // //     const nombreReparations = safeArray(results.reparations).length;
// // // // // // //     const coutMoyen = nombreReparations > 0 ? coutTotal / nombreReparations : 0;

// // // // // // //     const calculatedStats = {
// // // // // // //       // Matériels
// // // // // // //       total_materiels: safeArray(results.materiels).length,
// // // // // // //       materiels_fonctionnels: safeFilter(results.materiels, m => 
// // // // // // //         ['fonctionnel', 'actif', 'opérationnel'].includes(m.etat?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       materiels_en_panne: safeFilter(results.materiels, m => 
// // // // // // //         ['panne', 'en_panne', 'défectueux'].includes(m.etat?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       materiels_maintenance: safeFilter(results.materiels, m => 
// // // // // // //         ['maintenance', 'réparation'].includes(m.etat?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       materiels_par_service: materielsParService,
// // // // // // //       materiels_par_type: materielsParType,
      
// // // // // // //       // Logiciels
// // // // // // //       total_logiciels: safeArray(results.logiciels).length,
// // // // // // //       logiciels_actifs: safeFilter(results.logiciels, l => 
// // // // // // //         l.statut === 'actif' || l.licence_active === true
// // // // // // //       ).length,
// // // // // // //       logiciels_expires: safeFilter(results.logiciels, l => {
// // // // // // //         const expiry = l.date_expiration || l.licence_expire;
// // // // // // //         return expiry && new Date(expiry) < new Date();
// // // // // // //       }).length,
// // // // // // //       logiciels_par_categorie: logicielsParCategorie,
      
// // // // // // //       // Incidents
// // // // // // //       incidents_ouverts: safeFilter(results.incidents, i => 
// // // // // // //         ['ouvert', 'en_cours', 'non_résolu'].includes(i.statut?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       incidents_resolus: safeFilter(results.incidents, i => 
// // // // // // //         ['résolu', 'fermé', 'traité'].includes(i.statut?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       incidents_par_priorite: incidentsParPriorite,
      
// // // // // // //       // Réparations
// // // // // // //       reparations_ce_mois: safeFilter(results.reparations, r => {
// // // // // // //         const date = r.date_reparation || r.date_debut;
// // // // // // //         if (!date) return false;
// // // // // // //         try {
// // // // // // //           const repDate = new Date(date);
// // // // // // //           const now = new Date();
// // // // // // //           return repDate.getMonth() === now.getMonth() && 
// // // // // // //                  repDate.getFullYear() === now.getFullYear();
// // // // // // //         } catch {
// // // // // // //           return false;
// // // // // // //         }
// // // // // // //       }).length,
// // // // // // //       cout_total_reparations: coutTotal,
// // // // // // //       cout_moyen_reparation: Math.round(coutMoyen),
      
// // // // // // //       // Alertes
// // // // // // //       alertes_actives: alertesActives.length,
// // // // // // //       alertes_critiques: alertesCritiques.length,
// // // // // // //       alertes_par_type: alertesParType,
// // // // // // //       alertes_par_severite: alertesParSeverite,
      
// // // // // // //       // Fournisseurs & Réseau
// // // // // // //       total_fournisseurs: safeArray(results.fournisseurs).length,
// // // // // // //       equipements_reseau: safeArray(results.reseau).length,
// // // // // // //       reseau_fonctionnel: safeFilter(results.reseau, r => 
// // // // // // //         r.statut === 'actif' || r.etat === 'fonctionnel'
// // // // // // //       ).length,
      
// // // // // // //       // Utilisateurs
// // // // // // //       utilisateurs_actifs: Math.min(50, Object.keys(activiteParUtilisateur).length),
// // // // // // //       sessions_actives: Math.floor(Math.random() * 10) + 5,
// // // // // // //       activite_par_utilisateur: activiteParUtilisateur,
      
// // // // // // //       // Performance système
// // // // // // //       uptime_systeme: 99.8,
// // // // // // //       taux_reponse_api: 98.5,
// // // // // // //       stockage_utilise: 76,
// // // // // // //       bande_passante: 85,
// // // // // // //       utilisation_moyenne: 65,
// // // // // // //     };

// // // // // // //     setStats(calculatedStats);
// // // // // // //   }, []);

// // // // // // //   // Générer des métriques système
// // // // // // //   const generateSystemMetrics = useCallback(() => {
// // // // // // //     const newMetrics = {
// // // // // // //       cpuUsage: Math.floor(Math.random() * 30) + 40,
// // // // // // //       memoryUsage: Math.floor(Math.random() * 25) + 60,
// // // // // // //       diskUsage: Math.floor(Math.random() * 20) + 70,
// // // // // // //       networkIn: Math.floor(Math.random() * 100) + 100,
// // // // // // //       networkOut: Math.floor(Math.random() * 80) + 60,
// // // // // // //       apiLatency: Math.floor(Math.random() * 100) + 100,
// // // // // // //       activeConnections: Math.floor(Math.random() * 30) + 30,
// // // // // // //       failedRequests: Math.floor(Math.random() * 5),
// // // // // // //       databaseConnections: Math.floor(Math.random() * 20) + 10,
// // // // // // //       cacheHitRate: Math.floor(Math.random() * 10) + 90,
// // // // // // //     };
    
// // // // // // //     setSystemMetrics(newMetrics);
    
// // // // // // //     // Ajouter à l'historique
// // // // // // //     const timestamp = new Date();
// // // // // // //     setMetricsHistory(prev => {
// // // // // // //       const newHistory = [...prev, {
// // // // // // //         time: timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
// // // // // // //         cpu: newMetrics.cpuUsage,
// // // // // // //         memory: newMetrics.memoryUsage,
// // // // // // //         disk: newMetrics.diskUsage,
// // // // // // //         networkIn: newMetrics.networkIn,
// // // // // // //         networkOut: newMetrics.networkOut,
// // // // // // //         connections: newMetrics.activeConnections
// // // // // // //       }].slice(-12); // Garder les 12 dernières mesures
// // // // // // //       return newHistory;
// // // // // // //     });
// // // // // // //   }, []);

// // // // // // //   // Auto-refresh
// // // // // // //   useEffect(() => {
// // // // // // //     loadData();
    
// // // // // // //     if (autoRefresh) {
// // // // // // //       const interval = setInterval(() => {
// // // // // // //         loadData();
// // // // // // //         generateSystemMetrics();
// // // // // // //       }, 30000); // 30 secondes
// // // // // // //       return () => clearInterval(interval);
// // // // // // //     }
// // // // // // //   }, [loadData, autoRefresh, generateSystemMetrics]);

// // // // // // //   // Données pour les graphiques
// // // // // // //   const chartData = useMemo(() => {
// // // // // // //     const now = new Date();
    
// // // // // // //     // Préparer les données pour chaque type de graphique
// // // // // // //     return {
// // // // // // //       // État des matériels
// // // // // // //       materielsEtat: [
// // // // // // //         { name: 'Fonctionnel', value: stats.materiels_fonctionnels, color: '#10b981' },
// // // // // // //         { name: 'En panne', value: stats.materiels_en_panne, color: '#ef4444' },
// // // // // // //         { name: 'Maintenance', value: stats.materiels_maintenance, color: '#f59e0b' },
// // // // // // //         { name: 'Autre', value: Math.max(0, stats.total_materiels - stats.materiels_fonctionnels - stats.materiels_en_panne - stats.materiels_maintenance), color: '#6b7280' },
// // // // // // //       ],
      
// // // // // // //       // Matériels par service (top 5)
// // // // // // //       materielsService: Object.entries(stats.materiels_par_service)
// // // // // // //         .sort(([,a], [,b]) => b - a)
// // // // // // //         .slice(0, 5)
// // // // // // //         .map(([service, count]) => ({
// // // // // // //           service: service.length > 15 ? service.substring(0, 15) + '...' : service,
// // // // // // //           count,
// // // // // // //           fill: getRandomColor()
// // // // // // //         })),
      
// // // // // // //       // Incidents par priorité
// // // // // // //       incidentsPriorite: Object.entries(stats.incidents_par_priorite).map(([priorite, count]) => ({
// // // // // // //         priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
// // // // // // //         count,
// // // // // // //         fill: getPriorityColor(priorite)
// // // // // // //       })),
      
// // // // // // //       // Alertes par sévérité
// // // // // // //       alertesSeverite: Object.entries(stats.alertes_par_severite).map(([severite, count]) => ({
// // // // // // //         severite: severite.charAt(0).toUpperCase() + severite.slice(1),
// // // // // // //         count,
// // // // // // //         fill: getSeverityColor(severite)
// // // // // // //       })),
      
// // // // // // //       // Évolution des incidents (derniers 7 jours)
// // // // // // //       incidentsEvolution: Array.from({ length: 7 }, (_, i) => {
// // // // // // //         const date = new Date(now);
// // // // // // //         date.setDate(date.getDate() - (6 - i));
// // // // // // //         const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
// // // // // // //         // Simulation de données basée sur le nombre d'incidents
// // // // // // //         const baseIncidents = Math.floor(Math.random() * 5) + 1;
// // // // // // //         return {
// // // // // // //           jour: dayName,
// // // // // // //           incidents: baseIncidents + (i === 3 ? 3 : 0), // Pic au milieu
// // // // // // //         };
// // // // // // //       }),
      
// // // // // // //       // Historique des métriques
// // // // // // //       historiqueMetriques: metricsHistory,
      
// // // // // // //       // Top utilisateurs
// // // // // // //       topUtilisateurs: Object.entries(stats.activite_par_utilisateur)
// // // // // // //         .sort(([,a], [,b]) => b - a)
// // // // // // //         .slice(0, 5)
// // // // // // //         .map(([utilisateur, actions]) => ({
// // // // // // //           utilisateur,
// // // // // // //           actions,
// // // // // // //           fill: getRandomColor()
// // // // // // //         })),
// // // // // // //     };
// // // // // // //   }, [stats, metricsHistory]);

// // // // // // //   // Fonction pour extraire les données des réponses API
// // // // // // //   const extractData = (response) => {
// // // // // // //     if (!response?.data) return [];
// // // // // // //     if (Array.isArray(response.data)) return response.data;
// // // // // // //     if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// // // // // // //     if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// // // // // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
// // // // // // //     return [];
// // // // // // //   };

// // // // // // //   // Formater la devise
// // // // // // //   const formatCurrency = (amount) => {
// // // // // // //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// // // // // // //   };

// // // // // // //   // Générer rapport PDF détaillé
// // // // // // //   const generateDetailedPDF = async () => {
// // // // // // //     const doc = new jsPDF('landscape');
    
// // // // // // //     try {
// // // // // // //       const imgData = await getBase64Image(logoDren);
// // // // // // //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// // // // // // //     } catch (error) {
// // // // // // //       console.warn('Logo non chargé');
// // // // // // //     }
    
// // // // // // //     doc.setFontSize(20);
// // // // // // //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// // // // // // //     doc.setFontSize(16);
// // // // // // //     doc.text('TABLEAU DE BORD ANALYTIQUE - RAPPORT COMPLET', 20, 45);
    
// // // // // // //     // Informations générales
// // // // // // //     doc.setFontSize(12);
// // // // // // //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
// // // // // // //     doc.text(`Période: ${filters.periode}`, 20, 67);
// // // // // // //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 74);
    
// // // // // // //     doc.setDrawColor(200, 200, 200);
// // // // // // //     doc.line(20, 80, 190, 80);
    
// // // // // // //     // Statistiques principales
// // // // // // //     doc.setFontSize(14);
// // // // // // //     doc.text('STATISTIQUES PRINCIPALES', 20, 90);
    
// // // // // // //     const mainStats = [
// // // // // // //       ['Indicateur', 'Valeur', 'Détail'],
// // // // // // //       ['Matériels totaux', stats.total_materiels.toString(), `${stats.materiels_fonctionnels} fonctionnels`],
// // // // // // //       ['Incidents ouverts', stats.incidents_ouverts.toString(), `${stats.incidents_resolus} résolus`],
// // // // // // //       ['Alertes actives', stats.alertes_actives.toString(), `${stats.alertes_critiques} critiques`],
// // // // // // //       ['Coût réparations', formatCurrency(stats.cout_total_reparations), `${stats.reparations_ce_mois} ce mois`],
// // // // // // //       ['Utilisateurs actifs', stats.utilisateurs_actifs.toString(), `${stats.sessions_actives} sessions`],
// // // // // // //       ['Uptime système', `${stats.uptime_systeme}%`, 'Disponibilité'],
// // // // // // //     ];
    
// // // // // // //     autoTable(doc, {
// // // // // // //       startY: 95,
// // // // // // //       head: mainStats.slice(0, 1),
// // // // // // //       body: mainStats.slice(1),
// // // // // // //       theme: 'grid',
// // // // // // //       headStyles: { fillColor: [59, 130, 246] },
// // // // // // //     });
    
// // // // // // //     // Métriques système
// // // // // // //     const yPos = doc.lastAutoTable.finalY + 10;
// // // // // // //     doc.setFontSize(14);
// // // // // // //     doc.text('MÉTRIQUES SYSTÈME', 20, yPos);
    
// // // // // // //     const systemStats = [
// // // // // // //       ['Composant', 'Utilisation', 'Statut'],
// // // // // // //       ['CPU', `${systemMetrics.cpuUsage}%`, getStatusText(systemMetrics.cpuUsage)],
// // // // // // //       ['Mémoire', `${systemMetrics.memoryUsage}%`, getStatusText(systemMetrics.memoryUsage)],
// // // // // // //       ['Disque', `${systemMetrics.diskUsage}%`, getStatusText(systemMetrics.diskUsage)],
// // // // // // //       ['Réseau IN', `${systemMetrics.networkIn} Mbps`, 'Normal'],
// // // // // // //       ['Réseau OUT', `${systemMetrics.networkOut} Mbps`, 'Normal'],
// // // // // // //       ['Latence API', `${systemMetrics.apiLatency} ms`, getStatusText(systemMetrics.apiLatency, 200)],
// // // // // // //     ];
    
// // // // // // //     autoTable(doc, {
// // // // // // //       startY: yPos + 5,
// // // // // // //       head: systemStats.slice(0, 1),
// // // // // // //       body: systemStats.slice(1),
// // // // // // //       theme: 'striped',
// // // // // // //     });
    
// // // // // // //     doc.save(`dashboard-complet-${new Date().toISOString().split('T')[0]}.pdf`);
// // // // // // //     showNotification('Rapport PDF généré avec succès', 'success');
// // // // // // //   };

// // // // // // //   // Générer rapport Excel
// // // // // // //   const generateExcelReport = () => {
// // // // // // //     const wb = XLSX.utils.book_new();
    
// // // // // // //     // Feuille statistiques générales
// // // // // // //     const statsData = [
// // // // // // //       ['TABLEAU DE BORD ANALYTIQUE - DREN AA'],
// // // // // // //       ['Date de génération', new Date().toLocaleDateString('fr-FR')],
// // // // // // //       ['Période analysée', filters.periode],
// // // // // // //       [''],
// // // // // // //       ['STATISTIQUES GÉNÉRALES'],
// // // // // // //       ['Indicateur', 'Valeur'],
// // // // // // //       ['Matériels totaux', stats.total_materiels],
// // // // // // //       ['Matériels fonctionnels', stats.materiels_fonctionnels],
// // // // // // //       ['Incidents ouverts', stats.incidents_ouverts],
// // // // // // //       ['Alertes actives', stats.alertes_actives],
// // // // // // //       ['Coût total réparations', stats.cout_total_reparations],
// // // // // // //       ['Utilisateurs actifs', stats.utilisateurs_actifs],
// // // // // // //       ['Uptime système', stats.uptime_systeme],
// // // // // // //     ];
    
// // // // // // //     const wsStats = XLSX.utils.aoa_to_sheet(statsData);
// // // // // // //     XLSX.utils.book_append_sheet(wb, wsStats, 'Statistiques');
    
// // // // // // //     // Feuille métriques système
// // // // // // //     const metricsData = [
// // // // // // //       ['MÉTRIQUES SYSTÈME'],
// // // // // // //       ['Composant', 'Valeur', 'Unité', 'Statut'],
// // // // // // //       ['CPU', systemMetrics.cpuUsage, '%', getStatusText(systemMetrics.cpuUsage)],
// // // // // // //       ['Mémoire', systemMetrics.memoryUsage, '%', getStatusText(systemMetrics.memoryUsage)],
// // // // // // //       ['Disque', systemMetrics.diskUsage, '%', getStatusText(systemMetrics.diskUsage)],
// // // // // // //       ['Réseau IN', systemMetrics.networkIn, 'Mbps', 'Normal'],
// // // // // // //       ['Réseau OUT', systemMetrics.networkOut, 'Mbps', 'Normal'],
// // // // // // //       ['Latence API', systemMetrics.apiLatency, 'ms', getStatusText(systemMetrics.apiLatency, 200)],
// // // // // // //     ];
    
// // // // // // //     const wsMetrics = XLSX.utils.aoa_to_sheet(metricsData);
// // // // // // //     XLSX.utils.book_append_sheet(wb, wsMetrics, 'Métriques Système');
    
// // // // // // //     XLSX.writeFile(wb, `dashboard-analytique-${new Date().toISOString().split('T')[0]}.xlsx`);
// // // // // // //     showNotification('Export Excel généré avec succès', 'success');
// // // // // // //   };

// // // // // // //   // Composant StatCard (comme dans l'historique)
// // // // // // //   const StatCard = ({ title, value, icon: Icon, color, subtitle, trend, onClick }) => (
// // // // // // //     <div 
// // // // // // //       className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 ${color}`}
// // // // // // //       onClick={onClick}
// // // // // // //     >
// // // // // // //       <div className="card-body p-4">
// // // // // // //         <div className="flex items-center justify-between">
// // // // // // //           <div>
// // // // // // //             <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
// // // // // // //             <p className="text-2xl font-bold mt-1">{value}</p>
// // // // // // //             {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
// // // // // // //             {trend && (
// // // // // // //               <div className={`flex items-center mt-2 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
// // // // // // //                 <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
// // // // // // //                 {trend > 0 ? '+' : ''}{trend}%
// // // // // // //               </div>
// // // // // // //             )}
// // // // // // //           </div>
// // // // // // //           <div className={`p-3 rounded-lg ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
// // // // // // //             <Icon className={`h-6 w-6 ${color.replace('border-l-', 'text-')}`} />
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );

// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex flex-col items-center justify-center min-h-screen">
// // // // // // //         <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
// // // // // // //         <h2 className="text-xl font-semibold">Chargement du tableau de bord...</h2>
// // // // // // //         <p className="text-gray-500 mt-2">Connexion aux sources de données</p>
// // // // // // //         <div className="mt-4 w-64 bg-gray-200 rounded-full h-2">
// // // // // // //           <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
// // // // // // //       {/* En-tête comme l'historique */}
// // // // // // //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
// // // // // // //         <div>
// // // // // // //           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
// // // // // // //             <BarChart3 className="h-8 w-8 text-primary" />
// // // // // // //             Tableau de Bord Analytique
// // // // // // //             <span className="badge badge-primary badge-lg">Analytics</span>
// // // // // // //           </h1>
// // // // // // //           <p className="text-base-content opacity-70 mt-1">
// // // // // // //             Surveillance avancée et analyse des performances système
// // // // // // //           </p>
// // // // // // //           <div className="flex flex-wrap gap-2 mt-2 text-sm">
// // // // // // //             <span className="badge badge-primary">
// // // // // // //               {stats.total_materiels} matériels
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-success">
// // // // // // //               {stats.materiels_fonctionnels} fonctionnels
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-error">
// // // // // // //               {stats.incidents_ouverts} incidents
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-warning">
// // // // // // //               {stats.alertes_actives} alertes
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-info">
// // // // // // //               {stats.utilisateurs_actifs} utilisateurs
// // // // // // //             </span>
// // // // // // //           </div>
// // // // // // //         </div>
        
// // // // // // //         <div className="flex flex-wrap gap-2">
// // // // // // //           <div className="form-control">
// // // // // // //             <label className="label cursor-pointer gap-2">
// // // // // // //               <span className="label-text text-sm">Auto-refresh</span>
// // // // // // //               <input 
// // // // // // //                 type="checkbox" 
// // // // // // //                 className="toggle toggle-primary toggle-sm"
// // // // // // //                 checked={autoRefresh}
// // // // // // //                 onChange={(e) => setAutoRefresh(e.target.checked)}
// // // // // // //               />
// // // // // // //             </label>
// // // // // // //           </div>
          
// // // // // // //           <select 
// // // // // // //             className="select select-bordered select-sm"
// // // // // // //             value={timeRange}
// // // // // // //             onChange={(e) => setTimeRange(e.target.value)}
// // // // // // //           >
// // // // // // //             <option value="today">Aujourd'hui</option>
// // // // // // //             <option value="week">Cette semaine</option>
// // // // // // //             <option value="month">Ce mois</option>
// // // // // // //             <option value="year">Cette année</option>
// // // // // // //           </select>
          
// // // // // // //           <div className="dropdown dropdown-end">
// // // // // // //             <button className="btn btn-primary btn-sm">
// // // // // // //               <Download className="h-4 w-4 mr-2" />
// // // // // // //               Exporter
// // // // // // //             </button>
// // // // // // //             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// // // // // // //               <li><button onClick={generateDetailedPDF}>PDF Détaillé</button></li>
// // // // // // //               <li><button onClick={generateExcelReport}>Excel Complet</button></li>
// // // // // // //             </ul>
// // // // // // //           </div>
          
// // // // // // //           <button 
// // // // // // //             onClick={loadData}
// // // // // // //             className="btn btn-outline btn-sm"
// // // // // // //             disabled={loading}
// // // // // // //           >
// // // // // // //             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
// // // // // // //             {loading ? 'Actualisation...' : 'Actualiser'}
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Filtres comme l'historique */}
// // // // // // //       <div className="card bg-base-200 shadow-xl mb-6">
// // // // // // //         <div className="card-body">
// // // // // // //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
// // // // // // //             <h2 className="card-title text-base-content">
// // // // // // //               <Filter className="h-5 w-5" />
// // // // // // //               Filtres de recherche
// // // // // // //             </h2>
// // // // // // //             <div className="flex gap-2">
// // // // // // //               <button 
// // // // // // //                 onClick={() => loadData()}
// // // // // // //                 className="btn btn-primary btn-sm"
// // // // // // //               >
// // // // // // //                 <Filter className="h-4 w-4 mr-2" />
// // // // // // //                 Appliquer
// // // // // // //               </button>
// // // // // // //               <button 
// // // // // // //                 onClick={() => {
// // // // // // //                   setFilters({
// // // // // // //                     search: '',
// // // // // // //                     periode: 'today',
// // // // // // //                     dateDebut: '',
// // // // // // //                     dateFin: '',
// // // // // // //                     categorie: '',
// // // // // // //                     statut: ''
// // // // // // //                   });
// // // // // // //                   setTimeout(() => loadData(), 100);
// // // // // // //                 }}
// // // // // // //                 className="btn btn-outline btn-sm"
// // // // // // //               >
// // // // // // //                 Réinitialiser
// // // // // // //               </button>
// // // // // // //             </div>
// // // // // // //           </div>
          
// // // // // // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// // // // // // //             <div className="form-control">
// // // // // // //               <label className="label">
// // // // // // //                 <span className="label-text flex items-center">
// // // // // // //                   <Search className="h-4 w-4 mr-2" />
// // // // // // //                   Recherche
// // // // // // //                 </span>
// // // // // // //               </label>
// // // // // // //               <input
// // // // // // //                 type="text"
// // // // // // //                 placeholder="Rechercher..."
// // // // // // //                 className="input input-bordered bg-base-100"
// // // // // // //                 value={filters.search}
// // // // // // //                 onChange={(e) => setFilters({...filters, search: e.target.value})}
// // // // // // //               />
// // // // // // //             </div>

// // // // // // //             <div className="form-control">
// // // // // // //               <label className="label">
// // // // // // //                 <span className="label-text flex items-center">
// // // // // // //                   <Calendar className="h-4 w-4 mr-2" />
// // // // // // //                   Période
// // // // // // //                 </span>
// // // // // // //               </label>
// // // // // // //               <select
// // // // // // //                 className="select select-bordered bg-base-100"
// // // // // // //                 value={filters.periode}
// // // // // // //                 onChange={(e) => setFilters({...filters, periode: e.target.value})}
// // // // // // //               >
// // // // // // //                 <option value="today">Aujourd'hui</option>
// // // // // // //                 <option value="week">Cette semaine</option>
// // // // // // //                 <option value="month">Ce mois</option>
// // // // // // //                 <option value="year">Cette année</option>
// // // // // // //                 <option value="custom">Personnalisée</option>
// // // // // // //               </select>
// // // // // // //             </div>

// // // // // // //             <div className="form-control">
// // // // // // //               <label className="label">
// // // // // // //                 <span className="label-text">Catégorie</span>
// // // // // // //               </label>
// // // // // // //               <select
// // // // // // //                 className="select select-bordered bg-base-100"
// // // // // // //                 value={filters.categorie}
// // // // // // //                 onChange={(e) => setFilters({...filters, categorie: e.target.value})}
// // // // // // //               >
// // // // // // //                 <option value="">Toutes catégories</option>
// // // // // // //                 <option value="materiels">Matériels</option>
// // // // // // //                 <option value="incidents">Incidents</option>
// // // // // // //                 <option value="alertes">Alertes</option>
// // // // // // //                 <option value="logiciels">Logiciels</option>
// // // // // // //                 <option value="reseau">Réseau</option>
// // // // // // //               </select>
// // // // // // //             </div>

// // // // // // //             <div className="form-control">
// // // // // // //               <label className="label">
// // // // // // //                 <span className="label-text">Statut</span>
// // // // // // //               </label>
// // // // // // //               <select
// // // // // // //                 className="select select-bordered bg-base-100"
// // // // // // //                 value={filters.statut}
// // // // // // //                 onChange={(e) => setFilters({...filters, statut: e.target.value})}
// // // // // // //               >
// // // // // // //                 <option value="">Tous statuts</option>
// // // // // // //                 <option value="fonctionnel">Fonctionnel</option>
// // // // // // //                 <option value="panne">En panne</option>
// // // // // // //                 <option value="ouvert">Ouvert</option>
// // // // // // //                 <option value="résolu">Résolu</option>
// // // // // // //                 <option value="active">Active</option>
// // // // // // //                 <option value="critique">Critique</option>
// // // // // // //               </select>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {filters.periode === 'custom' && (
// // // // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
// // // // // // //               <div className="form-control">
// // // // // // //                 <label className="label">
// // // // // // //                   <span className="label-text flex items-center">
// // // // // // //                     <Calendar className="h-4 w-4 mr-2" />
// // // // // // //                     Date début
// // // // // // //                   </span>
// // // // // // //                 </label>
// // // // // // //                 <input
// // // // // // //                   type="date"
// // // // // // //                   className="input input-bordered bg-base-100"
// // // // // // //                   value={filters.dateDebut}
// // // // // // //                   onChange={(e) => setFilters({...filters, dateDebut: e.target.value})}
// // // // // // //                 />
// // // // // // //               </div>

// // // // // // //               <div className="form-control">
// // // // // // //                 <label className="label">
// // // // // // //                   <span className="label-text flex items-center">
// // // // // // //                     <Calendar className="h-4 w-4 mr-2" />
// // // // // // //                     Date fin
// // // // // // //                   </span>
// // // // // // //                 </label>
// // // // // // //                 <input
// // // // // // //                   type="date"
// // // // // // //                   className="input input-bordered bg-base-100"
// // // // // // //                   value={filters.dateFin}
// // // // // // //                   onChange={(e) => setFilters({...filters, dateFin: e.target.value})}
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Statistiques principales */}
// // // // // // //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
// // // // // // //         <StatCard
// // // // // // //           title="Total Matériels"
// // // // // // //           value={stats.total_materiels}
// // // // // // //           icon={Database}
// // // // // // //           color="border-l-blue-500"
// // // // // // //           subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
// // // // // // //           trend={stats.total_materiels > 0 ? 2 : 0}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Logiciels"
// // // // // // //           value={stats.total_logiciels}
// // // // // // //           icon={Package}
// // // // // // //           color="border-l-purple-500"
// // // // // // //           subtitle="Parc logiciel"
// // // // // // //           trend={0}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Alertes Actives"
// // // // // // //           value={stats.alertes_actives}
// // // // // // //           icon={Bell}
// // // // // // //           color="border-l-yellow-500"
// // // // // // //           subtitle="Nécessitent attention"
// // // // // // //           trend={stats.alertes_actives > 0 ? 5 : 0}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Incidents Ouverts"
// // // // // // //           value={stats.incidents_ouverts}
// // // // // // //           icon={AlertTriangle}
// // // // // // //           color="border-l-red-500"
// // // // // // //           subtitle="En cours de traitement"
// // // // // // //           trend={stats.incidents_ouverts > 0 ? 3 : -1}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Coût Réparations"
// // // // // // //           value={formatCurrency(stats.cout_total_reparations)}
// // // // // // //           icon={DollarSign}
// // // // // // //           color="border-l-green-500"
// // // // // // //           subtitle="Total dépensé"
// // // // // // //           trend={stats.cout_total_reparations > 0 ? 5 : 0}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Équipements Réseau"
// // // // // // //           value={stats.equipements_reseau}
// // // // // // //           icon={Network}
// // // // // // //           color="border-l-indigo-500"
// // // // // // //           subtitle="Infrastructure"
// // // // // // //           trend={0}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Fournisseurs"
// // // // // // //           value={stats.total_fournisseurs}
// // // // // // //           icon={Users}
// // // // // // //           color="border-l-pink-500"
// // // // // // //           subtitle="Partenaires"
// // // // // // //           trend={0}
// // // // // // //         />
// // // // // // //       </div>

// // // // // // //       {/* Statistiques synthétiques */}
// // // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
// // // // // // //         <div className="card bg-blue-50 border border-blue-200">
// // // // // // //           <div className="card-body p-4">
// // // // // // //             <div className="flex items-center justify-between">
// // // // // // //               <div>
// // // // // // //                 <h3 className="text-sm font-semibold text-blue-700">Taux de Fonctionnalité</h3>
// // // // // // //                 <p className="text-2xl font-bold text-blue-800">
// // // // // // //                   {stats.total_materiels > 0 
// // // // // // //                     ? Math.round((stats.materiels_fonctionnels / stats.total_materiels) * 100) 
// // // // // // //                     : 0}%
// // // // // // //                 </p>
// // // // // // //                 <p className="text-xs text-blue-600">
// // // // // // //                   {stats.materiels_fonctionnels} / {stats.total_materiels} matériels
// // // // // // //                 </p>
// // // // // // //               </div>
// // // // // // //               <CheckCircle className="h-8 w-8 text-blue-500" />
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
        
// // // // // // //         <div className="card bg-green-50 border border-green-200">
// // // // // // //           <div className="card-body p-4">
// // // // // // //             <div className="flex items-center justify-between">
// // // // // // //               <div>
// // // // // // //                 <h3 className="text-sm font-semibold text-green-700">Taux de Résolution</h3>
// // // // // // //                 <p className="text-2xl font-bold text-green-800">
// // // // // // //                   {stats.incidents_ouverts + stats.incidents_resolus > 0
// // // // // // //                     ? Math.round((stats.incidents_resolus / (stats.incidents_ouverts + stats.incidents_resolus)) * 100)
// // // // // // //                     : 100}%
// // // // // // //                 </p>
// // // // // // //                 <p className="text-xs text-green-600">
// // // // // // //                   {stats.incidents_resolus} résolus
// // // // // // //                 </p>
// // // // // // //               </div>
// // // // // // //               <CheckCircle className="h-8 w-8 text-green-500" />
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
        
// // // // // // //         <div className="card bg-yellow-50 border border-yellow-200">
// // // // // // //           <div className="card-body p-4">
// // // // // // //             <div className="flex items-center justify-between">
// // // // // // //               <div>
// // // // // // //                 <h3 className="text-sm font-semibold text-yellow-700">Alertes Critiques</h3>
// // // // // // //                 <p className="text-2xl font-bold text-yellow-800">
// // // // // // //                   {stats.alertes_critiques}
// // // // // // //                 </p>
// // // // // // //                 <p className="text-xs text-yellow-600">
// // // // // // //                   {stats.alertes_actives} alertes actives
// // // // // // //                 </p>
// // // // // // //               </div>
// // // // // // //               <AlertTriangle className="h-8 w-8 text-yellow-500" />
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
        
// // // // // // //         <div className="card bg-purple-50 border border-purple-200">
// // // // // // //           <div className="card-body p-4">
// // // // // // //             <div className="flex items-center justify-between">
// // // // // // //               <div>
// // // // // // //                 <h3 className="text-sm font-semibold text-purple-700">Coût Moyen</h3>
// // // // // // //                 <p className="text-2xl font-bold text-purple-800">
// // // // // // //                   {formatCurrency(stats.cout_moyen_reparation)}
// // // // // // //                 </p>
// // // // // // //                 <p className="text-xs text-purple-600">
// // // // // // //                   par réparation
// // // // // // //                 </p>
// // // // // // //               </div>
// // // // // // //               <DollarSign className="h-8 w-8 text-purple-500" />
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Graphiques principaux */}
// // // // // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // // // // // //         {/* État des matériels */}
// // // // // // //         <div className="card bg-base-100 shadow-lg">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title">
// // // // // // //               <PieChartIcon className="h-5 w-5 mr-2" />
// // // // // // //               État des Matériels
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <PieChart>
// // // // // // //                 <Pie
// // // // // // //                   data={chartData.materielsEtat}
// // // // // // //                   cx="50%"
// // // // // // //                   cy="50%"
// // // // // // //                   labelLine={false}
// // // // // // //                   label={({ name, value }) => `${name}: ${value}`}
// // // // // // //                   outerRadius={80}
// // // // // // //                   dataKey="value"
// // // // // // //                 >
// // // // // // //                   {chartData.materielsEtat.map((entry, index) => (
// // // // // // //                     <Cell key={`cell-${index}`} fill={entry.color} />
// // // // // // //                   ))}
// // // // // // //                 </Pie>
// // // // // // //                 <Tooltip />
// // // // // // //                 <Legend />
// // // // // // //               </PieChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Matériels par Service */}
// // // // // // //         <div className="card bg-base-100 shadow-lg">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title">
// // // // // // //               <UsersIcon className="h-5 w-5 mr-2" />
// // // // // // //               Matériels par Service
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <BarChart data={chartData.materielsService}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" />
// // // // // // //                 <XAxis dataKey="service" />
// // // // // // //                 <YAxis />
// // // // // // //                 <Tooltip 
// // // // // // //                   formatter={(value) => [`${value} matériels`, 'Quantité']}
// // // // // // //                   labelFormatter={(label) => `Service: ${label}`}
// // // // // // //                 />
// // // // // // //                 <Legend />
// // // // // // //                 <Bar 
// // // // // // //                   dataKey="count" 
// // // // // // //                   name="Matériels"
// // // // // // //                   radius={[4, 4, 0, 0]}
// // // // // // //                 >
// // // // // // //                   {chartData.materielsService.map((entry, index) => (
// // // // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // // //                   ))}
// // // // // // //                 </Bar>
// // // // // // //               </BarChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //             <div className="text-sm text-gray-500 mt-2">
// // // // // // //               Total: {stats.total_materiels} matériels répartis dans {Object.keys(stats.materiels_par_service).length} services
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Incidents par priorité */}
// // // // // // //         <div className="card bg-base-100 shadow-lg">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title">
// // // // // // //               <BarChart3 className="h-5 w-5 mr-2" />
// // // // // // //               Incidents par Priorité
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <BarChart data={chartData.incidentsPriorite}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" />
// // // // // // //                 <XAxis dataKey="priorite" />
// // // // // // //                 <YAxis />
// // // // // // //                 <Tooltip />
// // // // // // //                 <Legend />
// // // // // // //                 <Bar dataKey="count" name="Incidents">
// // // // // // //                   {chartData.incidentsPriorite.map((entry, index) => (
// // // // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // // //                   ))}
// // // // // // //                 </Bar>
// // // // // // //               </BarChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Alertes par Sévérité */}
// // // // // // //         <div className="card bg-base-100 shadow-lg">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title">
// // // // // // //               <ShieldAlert className="h-5 w-5 mr-2" />
// // // // // // //               Alertes par Sévérité
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <BarChart data={chartData.alertesSeverite}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" />
// // // // // // //                 <XAxis dataKey="severite" />
// // // // // // //                 <YAxis />
// // // // // // //                 <Tooltip 
// // // // // // //                   formatter={(value) => [`${value} alertes`, 'Quantité']}
// // // // // // //                   labelFormatter={(label) => `Sévérité: ${label}`}
// // // // // // //                 />
// // // // // // //                 <Legend />
// // // // // // //                 <Bar 
// // // // // // //                   dataKey="count" 
// // // // // // //                   name="Alertes"
// // // // // // //                   radius={[4, 4, 0, 0]}
// // // // // // //                 >
// // // // // // //                   {chartData.alertesSeverite.map((entry, index) => (
// // // // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // // //                   ))}
// // // // // // //                 </Bar>
// // // // // // //               </BarChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //             <div className="text-sm text-gray-500 mt-2">
// // // // // // //               {stats.alertes_actives} alertes actives dont {stats.alertes_critiques} critiques
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Évolution des incidents */}
// // // // // // //         <div className="card bg-base-100 shadow-lg">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title">
// // // // // // //               <LineChartIcon className="h-5 w-5 mr-2" />
// // // // // // //               Évolution des Incidents
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <LineChart data={chartData.incidentsEvolution}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" />
// // // // // // //                 <XAxis dataKey="jour" />
// // // // // // //                 <YAxis />
// // // // // // //                 <Tooltip />
// // // // // // //                 <Legend />
// // // // // // //                 <Line 
// // // // // // //                   type="monotone" 
// // // // // // //                   dataKey="incidents" 
// // // // // // //                   stroke="#ef4444" 
// // // // // // //                   strokeWidth={3}
// // // // // // //                   dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
// // // // // // //                   name="Incidents"
// // // // // // //                 />
// // // // // // //               </LineChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         Tableau détaillé Matériels par Service
// // // // // // //         <div className="card bg-base-100 shadow-lg lg:col-span-2">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title">
// // // // // // //               <Database className="h-5 w-5 mr-2" />
// // // // // // //               Répartition Détailée des Matériels par Service
// // // // // // //               <span className="badge badge-primary ml-2">{stats.total_materiels} matériels</span>
// // // // // // //             </h3>
// // // // // // //             <div className="overflow-x-auto">
// // // // // // //               <table className="table table-zebra w-full">
// // // // // // //                 <thead>
// // // // // // //                   <tr className="bg-base-200">
// // // // // // //                     <th>Service</th>
// // // // // // //                     <th>Nombre de Matériels</th>
// // // // // // //                     <th>Pourcentage</th>
// // // // // // //                     <th>Fonctionnels</th>
// // // // // // //                     <th>En Panne</th>
// // // // // // //                     <th>Actions</th>
// // // // // // //                   </tr>
// // // // // // //                 </thead>
// // // // // // //                 <tbody>
// // // // // // //                   {Object.entries(stats.materiels_par_service)
// // // // // // //                     .sort(([,a], [,b]) => b - a)
// // // // // // //                     .map(([service, count], index) => {
// // // // // // //                       const pourcentage = stats.total_materiels > 0 ? ((count / stats.total_materiels) * 100).toFixed(1) : 0;
// // // // // // //                       const materielsService = safeArray(materiels).filter(m => 
// // // // // // //                         (m.service || m.departement || m.service_attribue) === service
// // // // // // //                       );
// // // // // // //                       const fonctionnels = materielsService.filter(m => 
// // // // // // //                         ['fonctionnel', 'actif', 'opérationnel'].includes(m.etat?.toLowerCase())
// // // // // // //                       ).length;
// // // // // // //                       const pannes = materielsService.filter(m => 
// // // // // // //                         ['panne', 'en_panne', 'défectueux'].includes(m.etat?.toLowerCase())
// // // // // // //                       ).length;
                      
// // // // // // //                       return (
// // // // // // //                         <tr key={index} className="hover:bg-base-300">
// // // // // // //                           <td className="font-medium">
// // // // // // //                             <div className="flex items-center">
// // // // // // //                               <div 
// // // // // // //                                 className="w-3 h-3 rounded-full mr-2"
// // // // // // //                                 style={{ backgroundColor: getRandomColor() }}
// // // // // // //                               />
// // // // // // //                               {service}
// // // // // // //                             </div>
// // // // // // //                           </td>
// // // // // // //                           <td>
// // // // // // //                             <span className="badge badge-primary">{count}</span>
// // // // // // //                           </td>
// // // // // // //                           <td>
// // // // // // //                             <div className="flex items-center">
// // // // // // //                               <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
// // // // // // //                                 <div 
// // // // // // //                                   className="h-full bg-blue-500 rounded-full"
// // // // // // //                                   style={{ width: `${pourcentage}%` }}
// // // // // // //                                 />
// // // // // // //                               </div>
// // // // // // //                               <span>{pourcentage}%</span>
// // // // // // //                             </div>
// // // // // // //                           </td>
// // // // // // //                           <td>
// // // // // // //                             <span className="badge badge-success">{fonctionnels}</span>
// // // // // // //                           </td>
// // // // // // //                           <td>
// // // // // // //                             <span className="badge badge-error">{pannes}</span>
// // // // // // //                           </td>
// // // // // // //                           <td>
// // // // // // //                             <button 
// // // // // // //                               className="btn btn-ghost btn-xs"
// // // // // // //                               onClick={() => {
// // // // // // //                                 setFilters({...filters, categorie: 'materiels', search: service});
// // // // // // //                                 showNotification(`Filtrage des matériels du service: ${service}`, 'info');
// // // // // // //                               }}
// // // // // // //                             >
// // // // // // //                               <Eye className="h-4 w-4" />
// // // // // // //                               Voir
// // // // // // //                             </button>
// // // // // // //                           </td>
// // // // // // //                         </tr>
// // // // // // //                       );
// // // // // // //                     })}
// // // // // // //                 </tbody>
// // // // // // //               </table>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Métriques système en temps réel */}
// // // // // // //       {/* <div className="card bg-base-100 shadow-lg mb-8">
// // // // // // //         <div className="card-body">
// // // // // // //           <h3 className="card-title">
// // // // // // //             <Cpu className="h-5 w-5 mr-2" />
// // // // // // //             Métriques Système en Temps Réel
// // // // // // //           </h3>
// // // // // // //           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
// // // // // // //             <div className="text-center p-4 bg-blue-50 rounded-lg">
// // // // // // //               <div className="text-2xl font-bold text-blue-600">{systemMetrics.cpuUsage}%</div>
// // // // // // //               <div className="text-sm text-blue-800">CPU</div>
// // // // // // //               <div className="mt-2 h-2 bg-blue-200 rounded-full">
// // // // // // //                 <div 
// // // // // // //                   className="h-full bg-blue-600 rounded-full"
// // // // // // //                   style={{ width: `${systemMetrics.cpuUsage}%` }}
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </div>
            
// // // // // // //             <div className="text-center p-4 bg-purple-50 rounded-lg">
// // // // // // //               <div className="text-2xl font-bold text-purple-600">{systemMetrics.memoryUsage}%</div>
// // // // // // //               <div className="text-sm text-purple-800">Mémoire</div>
// // // // // // //               <div className="mt-2 h-2 bg-purple-200 rounded-full">
// // // // // // //                 <div 
// // // // // // //                   className="h-full bg-purple-600 rounded-full"
// // // // // // //                   style={{ width: `${systemMetrics.memoryUsage}%` }}
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </div>
            
// // // // // // //             <div className="text-center p-4 bg-green-50 rounded-lg">
// // // // // // //               <div className="text-2xl font-bold text-green-600">{systemMetrics.diskUsage}%</div>
// // // // // // //               <div className="text-sm text-green-800">Disque</div>
// // // // // // //               <div className="mt-2 h-2 bg-green-200 rounded-full">
// // // // // // //                 <div 
// // // // // // //                   className="h-full bg-green-600 rounded-full"
// // // // // // //                   style={{ width: `${systemMetrics.diskUsage}%` }}
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </div>
            
// // // // // // //             <div className="text-center p-4 bg-orange-50 rounded-lg">
// // // // // // //               <div className="text-2xl font-bold text-orange-600">{systemMetrics.networkIn} Mbps</div>
// // // // // // //               <div className="text-sm text-orange-800">Réseau IN</div>
// // // // // // //             </div>
            
// // // // // // //             <div className="text-center p-4 bg-pink-50 rounded-lg">
// // // // // // //               <div className="text-2xl font-bold text-pink-600">{systemMetrics.apiLatency} ms</div>
// // // // // // //               <div className="text-sm text-pink-800">Latence API</div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div> */}
// // // // // // // {/*  */}
// // // // // // //       {/* Tableau des alertes récentes */}
// // // // // // //       <div className="card bg-base-200 shadow-xl mb-6">
// // // // // // //         <div className="card-body">
// // // // // // //           <h2 className="card-title">
// // // // // // //             <Bell className="h-5 w-5 mr-2" />
// // // // // // //             Alertes Récentes ({alertes.length})
// // // // // // //             {stats.alertes_critiques > 0 && (
// // // // // // //               <span className="badge badge-error ml-2">{stats.alertes_critiques} critiques</span>
// // // // // // //             )}
// // // // // // //           </h2>
// // // // // // //           <div className="overflow-x-auto">
// // // // // // //             <table className="table table-zebra w-full">
// // // // // // //               <thead>
// // // // // // //                 <tr className="bg-base-200">
// // // // // // //                   <th>Description</th>
// // // // // // //                   <th>Type</th>
// // // // // // //                   <th>Sévérité</th>
// // // // // // //                   <th>Date</th>
// // // // // // //                   <th>Statut</th>
// // // // // // //                   <th>Actions</th>
// // // // // // //                 </tr>
// // // // // // //               </thead>
// // // // // // //               <tbody>
// // // // // // //                 {safeArray(alertes).slice(0, 5).map((alerte, index) => (
// // // // // // //                   <tr key={index} className="hover:bg-base-300">
// // // // // // //                     <td>
// // // // // // //                       <div className="font-medium">
// // // // // // //                         {alerte.description || 'Alerte sans description'}
// // // // // // //                       </div>
// // // // // // //                       <div className="text-xs opacity-70">
// // // // // // //                         Source: {alerte.materiel_nom || alerte.logiciel_nom || 'Système'}
// // // // // // //                       </div>
// // // // // // //                     </td>
// // // // // // //                     <td>
// // // // // // //                       <span className="badge badge-outline">
// // // // // // //                         {alerte.type_alerte || 'Non spécifié'}
// // // // // // //                       </span>
// // // // // // //                     </td>
// // // // // // //                     <td>
// // // // // // //                       <span className={`badge ${
// // // // // // //                         alerte.severite === 'critique' ? 'badge-error' :
// // // // // // //                         alerte.severite === 'élevée' ? 'badge-warning' : 'badge-info'
// // // // // // //                       }`}>
// // // // // // //                         {alerte.severite || 'Non spécifiée'}
// // // // // // //                       </span>
// // // // // // //                     </td>
// // // // // // //                     <td>
// // // // // // //                       {new Date(alerte.date_alerte || alerte.date_creation).toLocaleDateString('fr-FR')}
// // // // // // //                     </td>
// // // // // // //                     <td>
// // // // // // //                       <span className={`badge ${
// // // // // // //                         alerte.statut === 'nouvelle' ? 'badge-warning' :
// // // // // // //                         alerte.statut === 'en_traitement' ? 'badge-info' : 'badge-success'
// // // // // // //                       }`}>
// // // // // // //                         {alerte.statut || 'Active'}
// // // // // // //                       </span>
// // // // // // //                     </td>
// // // // // // //                     <td>
// // // // // // //                       <button className="btn btn-ghost btn-xs">
// // // // // // //                         <Eye className="h-4 w-4" />
// // // // // // //                       </button>
// // // // // // //                     </td>
// // // // // // //                   </tr>
// // // // // // //                 ))}
// // // // // // //               </tbody>
// // // // // // //             </table>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Informations système */}
// // // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // // // // //         <div className="card bg-base-200">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title">
// // // // // // //               <Info className="h-5 w-5 mr-2" />
// // // // // // //               Informations système
// // // // // // //             </h3>
// // // // // // //             <div className="space-y-2 text-sm">
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium">Dernière mise à jour:</span>
// // // // // // //                 <span>{lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : 'Non disponible'}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium">Données chargées:</span>
// // // // // // //                 <span>{safeArray(materiels).length} matériels, {safeArray(incidents).length} incidents</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium">Auto-refresh:</span>
// // // // // // //                 <span>{autoRefresh ? 'Activé (30s)' : 'Désactivé'}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium">Utilisateur:</span>
// // // // // // //                 <span>{user?.nom_complet || user?.username || 'Non connecté'}</span>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
        
// // // // // // //         <div className="card bg-base-200">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title">
// // // // // // //               <BellRing className="h-5 w-5 mr-2" />
// // // // // // //               Recommandations
// // // // // // //             </h3>
// // // // // // //             <div className="space-y-2 text-sm">
// // // // // // //               {stats.alertes_critiques > 0 && (
// // // // // // //                 <div className="alert alert-warning">
// // // // // // //                   <AlertTriangle className="h-4 w-4" />
// // // // // // //                   <span>⚠️ {stats.alertes_critiques} alerte(s) critique(s) nécessite(nt) attention</span>
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //               {stats.incidents_ouverts > 5 && (
// // // // // // //                 <div className="alert alert-warning">
// // // // // // //                   <AlertTriangle className="h-4 w-4" />
// // // // // // //                   <span>⚠️ Nombre élevé d'incidents ouverts</span>
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //               {systemMetrics.cpuUsage > 80 && (
// // // // // // //                 <div className="alert alert-error">
// // // // // // //                   <XCircle className="h-4 w-4" />
// // // // // // //                   <span>❌ Utilisation CPU critique ({systemMetrics.cpuUsage}%)</span>
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //               {stats.materiels_en_panne > 0 && (
// // // // // // //                 <div className="alert alert-info">
// // // // // // //                   <Wrench className="h-4 w-4" />
// // // // // // //                   <span>🔧 {stats.materiels_en_panne} matériel(s) en panne</span>
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // Fonction pour convertir une image en base64
// // // // // // // const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
// // // // // // //   const img = new Image();
// // // // // // //   img.crossOrigin = 'Anonymous';
// // // // // // //   img.onload = () => {
// // // // // // //     const canvas = document.createElement('canvas');
// // // // // // //     const ctx = canvas.getContext('2d');
// // // // // // //     canvas.width = img.width;
// // // // // // //     canvas.height = img.height;
// // // // // // //     ctx.drawImage(img, 0, 0);
// // // // // // //     resolve(canvas.toDataURL('image/jpeg'));
// // // // // // //   };
// // // // // // //   img.onerror = reject;
// // // // // // //   img.src = imgUrl;
// // // // // // // });

// // // // // // // export default Dashboard;























// // // // // // // // src/pages/Dashboard.jsx - VERSION CORRIGÉE ET OPTIMISÉE
// // // // // // // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // // // // // // import { 
// // // // // // //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// // // // // // //   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
// // // // // // // } from 'recharts';
// // // // // // // import { 
// // // // // // //   BarChart3, TrendingUp, Filter, Search, 
// // // // // // //   Download, RefreshCw, Users, Calendar, 
// // // // // // //   Eye, AlertTriangle, CheckCircle, XCircle, 
// // // // // // //   Database, Printer, ExternalLink, 
// // // // // // //   Shield, Bell, Package, Monitor, 
// // // // // // //   Network, Wrench, Users as UsersIcon,
// // // // // // //   Server, Cpu, Activity, PieChart as PieChartIcon,
// // // // // // //   LineChart as LineChartIcon, DownloadCloud, Info, 
// // // // // // //   BellRing, ShieldAlert, DollarSign
// // // // // // // } from 'lucide-react';
// // // // // // // import { 
// // // // // // //   materielsAPI, 
// // // // // // //   incidentsAPI, 
// // // // // // //   reparationsAPI, 
// // // // // // //   logicielsAPI, 
// // // // // // //   alertesAPI, 
// // // // // // //   fournisseursAPI, 
// // // // // // //   reseauAPI 
// // // // // // // } from '../services/api';
// // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // import { useNotification } from '../context/NotificationContext';
// // // // // // // import jsPDF from 'jspdf';
// // // // // // // import autoTable from 'jspdf-autotable';
// // // // // // // import * as XLSX from 'xlsx';

// // // // // // // // Import du logo
// // // // // // // import logoDren from '../assets/images/logo-dren.jpeg';

// // // // // // // // Fonctions utilitaires
// // // // // // // const getRandomColor = () => {
// // // // // // //   const colors = [
// // // // // // //     '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
// // // // // // //     '#ef4444', '#06b6d4', '#ec4899', '#84cc16'
// // // // // // //   ];
// // // // // // //   return colors[Math.floor(Math.random() * colors.length)];
// // // // // // // };

// // // // // // // const getPriorityColor = (priority) => {
// // // // // // //   const colors = {
// // // // // // //     'critique': '#ef4444',
// // // // // // //     'haute': '#f97316',
// // // // // // //     'moyenne': '#eab308',
// // // // // // //     'basse': '#22c55e',
// // // // // // //   };
// // // // // // //   return colors[priority.toLowerCase()] || '#6b7280';
// // // // // // // };

// // // // // // // const getSeverityColor = (severity) => {
// // // // // // //   const colors = {
// // // // // // //     'critique': '#ef4444',
// // // // // // //     'élevée': '#f97316',
// // // // // // //     'moyenne': '#eab308',
// // // // // // //     'basse': '#22c55e',
// // // // // // //   };
// // // // // // //   return colors[severity.toLowerCase()] || '#6b7280';
// // // // // // // };

// // // // // // // const Dashboard = () => {
// // // // // // //   const { user } = useAuth();
// // // // // // //   const { showNotification } = useNotification();
  
// // // // // // //   // États principaux
// // // // // // //   const [stats, setStats] = useState({
// // // // // // //     // Matériels
// // // // // // //     total_materiels: 0,
// // // // // // //     materiels_fonctionnels: 0,
// // // // // // //     materiels_en_panne: 0,
// // // // // // //     materiels_maintenance: 0,
// // // // // // //     materiels_par_service: {},
// // // // // // //     materiels_par_type: {},
    
// // // // // // //     // Logiciels
// // // // // // //     total_logiciels: 0,
// // // // // // //     logiciels_actifs: 0,
// // // // // // //     logiciels_expires: 0,
// // // // // // //     logiciels_par_categorie: {},
    
// // // // // // //     // Incidents & Réparations
// // // // // // //     incidents_ouverts: 0,
// // // // // // //     incidents_resolus: 0,
// // // // // // //     incidents_par_priorite: {},
// // // // // // //     reparations_ce_mois: 0,
// // // // // // //     cout_total_reparations: 0,
// // // // // // //     cout_moyen_reparation: 0,
    
// // // // // // //     // Alertes
// // // // // // //     alertes_actives: 0,
// // // // // // //     alertes_critiques: 0,
// // // // // // //     alertes_par_type: {},
// // // // // // //     alertes_par_severite: {},
    
// // // // // // //     // Fournisseurs & Réseau
// // // // // // //     total_fournisseurs: 0,
// // // // // // //     equipements_reseau: 0,
// // // // // // //     reseau_fonctionnel: 0,
// // // // // // //   });
  
// // // // // // //   // États pour les données
// // // // // // //   const [materiels, setMateriels] = useState([]);
// // // // // // //   const [incidents, setIncidents] = useState([]);
// // // // // // //   const [reparations, setReparations] = useState([]);
// // // // // // //   const [logiciels, setLogiciels] = useState([]);
// // // // // // //   const [alertes, setAlertes] = useState([]);
// // // // // // //   const [fournisseurs, setFournisseurs] = useState([]);
// // // // // // //   const [reseau, setReseau] = useState([]);
  
// // // // // // //   // États UI
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [error, setError] = useState(null);
// // // // // // //   const [filters, setFilters] = useState({
// // // // // // //     search: '',
// // // // // // //     periode: 'today',
// // // // // // //     dateDebut: '',
// // // // // // //     dateFin: '',
// // // // // // //     categorie: '',
// // // // // // //     statut: '',
// // // // // // //   });
// // // // // // //   const [autoRefresh, setAutoRefresh] = useState(false);
// // // // // // //   const [timeRange, setTimeRange] = useState('today');
// // // // // // //   const [lastUpdate, setLastUpdate] = useState(null);

// // // // // // //   // Fonctions helper
// // // // // // //   const safeArray = (data) => Array.isArray(data) ? data : [];
// // // // // // //   const safeFilter = (array, condition) => array?.filter?.(condition) || [];
// // // // // // //   const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

// // // // // // //   // Charger les données
// // // // // // //   const loadData = useCallback(async () => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       setError(null);
// // // // // // //       console.log('📊 Chargement des données dashboard...');

// // // // // // //       const requests = [
// // // // // // //         { key: 'materiels', api: materielsAPI.getAll },
// // // // // // //         { key: 'incidents', api: incidentsAPI.getAll },
// // // // // // //         { key: 'reparations', api: reparationsAPI.getAll },
// // // // // // //         { key: 'logiciels', api: logicielsAPI.getAll },
// // // // // // //         { key: 'alertes', api: alertesAPI.getAll },
// // // // // // //         { key: 'fournisseurs', api: fournisseursAPI.getAll },
// // // // // // //         { key: 'reseau', api: reseauAPI.getAll },
// // // // // // //       ];

// // // // // // //       const results = {};
// // // // // // //       const newErrors = [];

// // // // // // //       for (const req of requests) {
// // // // // // //         try {
// // // // // // //           const response = await req.api();
// // // // // // //           results[req.key] = extractData(response);
// // // // // // //           console.log(`✅ ${req.key}: ${results[req.key].length} entrées`);
// // // // // // //         } catch (error) {
// // // // // // //           console.error(`❌ ${req.key}:`, error);
// // // // // // //           results[req.key] = [];
// // // // // // //           newErrors.push(`${req.key}: ${error.message || 'Erreur connexion'}`);
// // // // // // //         }
// // // // // // //       }

// // // // // // //       if (newErrors.length > 0) {
// // // // // // //         setError(newErrors.join(', '));
// // // // // // //       }
      
// // // // // // //       // Mettre à jour les états
// // // // // // //       setMateriels(safeArray(results.materiels));
// // // // // // //       setIncidents(safeArray(results.incidents));
// // // // // // //       setReparations(safeArray(results.reparations));
// // // // // // //       setLogiciels(safeArray(results.logiciels));
// // // // // // //       setAlertes(safeArray(results.alertes));
// // // // // // //       setFournisseurs(safeArray(results.fournisseurs));
// // // // // // //       setReseau(safeArray(results.reseau));

// // // // // // //       // Calculer les statistiques avancées
// // // // // // //       calculateAdvancedStats(results);
      
// // // // // // //       setLastUpdate(new Date());
// // // // // // //       showNotification('Tableau de bord actualisé', 'success');

// // // // // // //     } catch (error) {
// // // // // // //       console.error('❌ Erreur générale:', error);
// // // // // // //       setError('Erreur de chargement des données');
// // // // // // //       showNotification('Erreur lors du chargement', 'error');
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   }, [showNotification]);

// // // // // // //   // Calculer les statistiques avancées
// // // // // // //   const calculateAdvancedStats = useCallback((results) => {
// // // // // // //     // Matériels par service
// // // // // // //     const materielsParService = safeReduce(results.materiels, (acc, m) => {
// // // // // // //       const service = m.service || m.departement || m.service_attribue || 'Non assigné';
// // // // // // //       acc[service] = (acc[service] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Matériels par type
// // // // // // //     const materielsParType = safeReduce(results.materiels, (acc, m) => {
// // // // // // //       const type = m.type || m.categorie || 'Non spécifié';
// // // // // // //       acc[type] = (acc[type] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Incidents par priorité
// // // // // // //     const incidentsParPriorite = safeReduce(results.incidents, (acc, i) => {
// // // // // // //       const priorite = i.priorite || 'moyenne';
// // // // // // //       acc[priorite] = (acc[priorite] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Alertes par type
// // // // // // //     const alertesParType = safeReduce(results.alertes, (acc, a) => {
// // // // // // //       const type = a.type_alerte || 'Autre';
// // // // // // //       acc[type] = (acc[type] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Alertes par sévérité
// // // // // // //     const alertesParSeverite = safeReduce(results.alertes, (acc, a) => {
// // // // // // //       const severite = a.severite || 'non spécifiée';
// // // // // // //       acc[severite] = (acc[severite] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Logiciels par catégorie
// // // // // // //     const logicielsParCategorie = safeReduce(results.logiciels, (acc, l) => {
// // // // // // //       const categorie = l.categorie || l.type || 'Autre';
// // // // // // //       acc[categorie] = (acc[categorie] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     const alertesActives = safeFilter(results.alertes, a => 
// // // // // // //       ['nouvelle', 'en_traitement', 'active'].includes(a.statut?.toLowerCase())
// // // // // // //     );

// // // // // // //     const alertesCritiques = safeFilter(alertesActives, a => 
// // // // // // //       a.severite?.toLowerCase() === 'critique'
// // // // // // //     );

// // // // // // //     const coutTotal = safeReduce(results.reparations, (sum, r) => 
// // // // // // //       sum + (parseFloat(r.cout) || 0), 0
// // // // // // //     );
// // // // // // //     const nombreReparations = safeArray(results.reparations).length;
// // // // // // //     const coutMoyen = nombreReparations > 0 ? coutTotal / nombreReparations : 0;

// // // // // // //     const calculatedStats = {
// // // // // // //       // Matériels
// // // // // // //       total_materiels: safeArray(results.materiels).length,
// // // // // // //       materiels_fonctionnels: safeFilter(results.materiels, m => 
// // // // // // //         ['fonctionnel', 'actif', 'opérationnel'].includes(m.etat?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       materiels_en_panne: safeFilter(results.materiels, m => 
// // // // // // //         ['panne', 'en_panne', 'défectueux'].includes(m.etat?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       materiels_maintenance: safeFilter(results.materiels, m => 
// // // // // // //         ['maintenance', 'réparation'].includes(m.etat?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       materiels_par_service: materielsParService,
// // // // // // //       materiels_par_type: materielsParType,
      
// // // // // // //       // Logiciels
// // // // // // //       total_logiciels: safeArray(results.logiciels).length,
// // // // // // //       logiciels_actifs: safeFilter(results.logiciels, l => 
// // // // // // //         l.statut === 'actif' || l.licence_active === true
// // // // // // //       ).length,
// // // // // // //       logiciels_expires: safeFilter(results.logiciels, l => {
// // // // // // //         const expiry = l.date_expiration || l.licence_expire;
// // // // // // //         return expiry && new Date(expiry) < new Date();
// // // // // // //       }).length,
// // // // // // //       logiciels_par_categorie: logicielsParCategorie,
      
// // // // // // //       // Incidents
// // // // // // //       incidents_ouverts: safeFilter(results.incidents, i => 
// // // // // // //         ['ouvert', 'en_cours', 'non_résolu'].includes(i.statut?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       incidents_resolus: safeFilter(results.incidents, i => 
// // // // // // //         ['résolu', 'fermé', 'traité'].includes(i.statut?.toLowerCase())
// // // // // // //       ).length,
// // // // // // //       incidents_par_priorite: incidentsParPriorite,
      
// // // // // // //       // Réparations
// // // // // // //       reparations_ce_mois: safeFilter(results.reparations, r => {
// // // // // // //         const date = r.date_reparation || r.date_debut;
// // // // // // //         if (!date) return false;
// // // // // // //         try {
// // // // // // //           const repDate = new Date(date);
// // // // // // //           const now = new Date();
// // // // // // //           return repDate.getMonth() === now.getMonth() && 
// // // // // // //                  repDate.getFullYear() === now.getFullYear();
// // // // // // //         } catch {
// // // // // // //           return false;
// // // // // // //         }
// // // // // // //       }).length,
// // // // // // //       cout_total_reparations: coutTotal,
// // // // // // //       cout_moyen_reparation: Math.round(coutMoyen),
      
// // // // // // //       // Alertes
// // // // // // //       alertes_actives: alertesActives.length,
// // // // // // //       alertes_critiques: alertesCritiques.length,
// // // // // // //       alertes_par_type: alertesParType,
// // // // // // //       alertes_par_severite: alertesParSeverite,
      
// // // // // // //       // Fournisseurs & Réseau
// // // // // // //       total_fournisseurs: safeArray(results.fournisseurs).length,
// // // // // // //       equipements_reseau: safeArray(results.reseau).length,
// // // // // // //       reseau_fonctionnel: safeFilter(results.reseau, r => 
// // // // // // //         r.statut === 'actif' || r.etat === 'fonctionnel'
// // // // // // //       ).length,
// // // // // // //     };

// // // // // // //     setStats(calculatedStats);
// // // // // // //   }, []);

// // // // // // //   // Auto-refresh
// // // // // // //   useEffect(() => {
// // // // // // //     loadData();
    
// // // // // // //     if (autoRefresh) {
// // // // // // //       const interval = setInterval(() => {
// // // // // // //         loadData();
// // // // // // //       }, 30000);
// // // // // // //       return () => clearInterval(interval);
// // // // // // //     }
// // // // // // //   }, [loadData, autoRefresh]);

// // // // // // //   // Données pour les graphiques
// // // // // // //   const chartData = useMemo(() => {
// // // // // // //     const now = new Date();
    
// // // // // // //     return {
// // // // // // //       // État des matériels
// // // // // // //       materielsEtat: [
// // // // // // //         { name: 'Fonctionnel', value: stats.materiels_fonctionnels, color: '#10b981' },
// // // // // // //         { name: 'En panne', value: stats.materiels_en_panne, color: '#ef4444' },
// // // // // // //         { name: 'Maintenance', value: stats.materiels_maintenance, color: '#f59e0b' },
// // // // // // //         { name: 'Autre', value: Math.max(0, stats.total_materiels - stats.materiels_fonctionnels - stats.materiels_en_panne - stats.materiels_maintenance), color: '#6b7280' },
// // // // // // //       ],
      
// // // // // // //       // Matériels par service (top 5)
// // // // // // //       materielsService: Object.entries(stats.materiels_par_service)
// // // // // // //         .sort(([,a], [,b]) => b - a)
// // // // // // //         .slice(0, 5)
// // // // // // //         .map(([service, count]) => ({
// // // // // // //           service: service.length > 15 ? service.substring(0, 15) + '...' : service,
// // // // // // //           count,
// // // // // // //           fill: getRandomColor()
// // // // // // //         })),
      
// // // // // // //       // Incidents par priorité
// // // // // // //       incidentsPriorite: Object.entries(stats.incidents_par_priorite).map(([priorite, count]) => ({
// // // // // // //         priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
// // // // // // //         count,
// // // // // // //         fill: getPriorityColor(priorite)
// // // // // // //       })),
      
// // // // // // //       // Alertes par sévérité
// // // // // // //       alertesSeverite: Object.entries(stats.alertes_par_severite).map(([severite, count]) => ({
// // // // // // //         severite: severite.charAt(0).toUpperCase() + severite.slice(1),
// // // // // // //         count,
// // // // // // //         fill: getSeverityColor(severite)
// // // // // // //       })),
      
// // // // // // //       // Évolution des incidents (derniers 7 jours)
// // // // // // //       incidentsEvolution: Array.from({ length: 7 }, (_, i) => {
// // // // // // //         const date = new Date(now);
// // // // // // //         date.setDate(date.getDate() - (6 - i));
// // // // // // //         const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
// // // // // // //         const baseIncidents = Math.floor(Math.random() * 5) + 1;
// // // // // // //         return {
// // // // // // //           jour: dayName,
// // // // // // //           incidents: baseIncidents + (i === 3 ? 3 : 0),
// // // // // // //         };
// // // // // // //       }),
// // // // // // //     };
// // // // // // //   }, [stats]);

// // // // // // //   // Fonction pour extraire les données des réponses API
// // // // // // //   const extractData = (response) => {
// // // // // // //     if (!response?.data) return [];
// // // // // // //     if (Array.isArray(response.data)) return response.data;
// // // // // // //     if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// // // // // // //     if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// // // // // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
// // // // // // //     return [];
// // // // // // //   };

// // // // // // //   // Formater la devise
// // // // // // //   const formatCurrency = (amount) => {
// // // // // // //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// // // // // // //   };

// // // // // // //   // Générer rapport PDF détaillé
// // // // // // //   const generateDetailedPDF = async () => {
// // // // // // //     const doc = new jsPDF('landscape');
    
// // // // // // //     try {
// // // // // // //       const imgData = await getBase64Image(logoDren);
// // // // // // //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// // // // // // //     } catch (error) {
// // // // // // //       console.warn('Logo non chargé');
// // // // // // //     }
    
// // // // // // //     doc.setFontSize(20);
// // // // // // //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// // // // // // //     doc.setFontSize(16);
// // // // // // //     doc.text('TABLEAU DE BORD ANALYTIQUE - RAPPORT COMPLET', 20, 45);
    
// // // // // // //     // Informations générales
// // // // // // //     doc.setFontSize(12);
// // // // // // //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
// // // // // // //     doc.text(`Période: ${filters.periode}`, 20, 67);
// // // // // // //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 74);
    
// // // // // // //     doc.setDrawColor(200, 200, 200);
// // // // // // //     doc.line(20, 80, 190, 80);
    
// // // // // // //     // Statistiques principales
// // // // // // //     doc.setFontSize(14);
// // // // // // //     doc.text('STATISTIQUES PRINCIPALES', 20, 90);
    
// // // // // // //     const mainStats = [
// // // // // // //       ['Indicateur', 'Valeur', 'Détail'],
// // // // // // //       ['Matériels totaux', stats.total_materiels.toString(), `${stats.materiels_fonctionnels} fonctionnels`],
// // // // // // //       ['Incidents ouverts', stats.incidents_ouverts.toString(), `${stats.incidents_resolus} résolus`],
// // // // // // //       ['Alertes actives', stats.alertes_actives.toString(), `${stats.alertes_critiques} critiques`],
// // // // // // //       ['Coût réparations', formatCurrency(stats.cout_total_reparations), `${stats.reparations_ce_mois} ce mois`],
// // // // // // //       ['Fournisseurs', stats.total_fournisseurs.toString(), 'Partenaires'],
// // // // // // //       ['Équipements réseau', stats.equipements_reseau.toString(), 'Infrastructure'],
// // // // // // //     ];
    
// // // // // // //     autoTable(doc, {
// // // // // // //       startY: 95,
// // // // // // //       head: mainStats.slice(0, 1),
// // // // // // //       body: mainStats.slice(1),
// // // // // // //       theme: 'grid',
// // // // // // //       headStyles: { fillColor: [59, 130, 246] },
// // // // // // //     });
    
// // // // // // //     doc.save(`dashboard-complet-${new Date().toISOString().split('T')[0]}.pdf`);
// // // // // // //     showNotification('Rapport PDF généré avec succès', 'success');
// // // // // // //   };

// // // // // // //   // Générer rapport Excel
// // // // // // //   const generateExcelReport = () => {
// // // // // // //     const wb = XLSX.utils.book_new();
    
// // // // // // //     // Feuille statistiques générales
// // // // // // //     const statsData = [
// // // // // // //       ['TABLEAU DE BORD ANALYTIQUE - DREN AA'],
// // // // // // //       ['Date de génération', new Date().toLocaleDateString('fr-FR')],
// // // // // // //       ['Période analysée', filters.periode],
// // // // // // //       [''],
// // // // // // //       ['STATISTIQUES GÉNÉRALES'],
// // // // // // //       ['Indicateur', 'Valeur'],
// // // // // // //       ['Matériels totaux', stats.total_materiels],
// // // // // // //       ['Matériels fonctionnels', stats.materiels_fonctionnels],
// // // // // // //       ['Incidents ouverts', stats.incidents_ouverts],
// // // // // // //       ['Alertes actives', stats.alertes_actives],
// // // // // // //       ['Coût total réparations', stats.cout_total_reparations],
// // // // // // //       ['Total logiciels', stats.total_logiciels],
// // // // // // //       ['Fournisseurs', stats.total_fournisseurs],
// // // // // // //     ];
    
// // // // // // //     const wsStats = XLSX.utils.aoa_to_sheet(statsData);
// // // // // // //     XLSX.utils.book_append_sheet(wb, wsStats, 'Statistiques');
    
// // // // // // //     XLSX.writeFile(wb, `dashboard-analytique-${new Date().toISOString().split('T')[0]}.xlsx`);
// // // // // // //     showNotification('Export Excel généré avec succès', 'success');
// // // // // // //   };

// // // // // // //   // Composant StatCard
// // // // // // //   const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
// // // // // // //     <div 
// // // // // // //       className={`card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
// // // // // // //       onClick={onClick}
// // // // // // //     >
// // // // // // //       <div className="card-body p-4">
// // // // // // //         <div className="flex items-center justify-between">
// // // // // // //           <div>
// // // // // // //             <h3 className="text-sm font-semibold text-base-content opacity-70">{title}</h3>
// // // // // // //             <p className="text-2xl font-bold mt-1 text-base-content">{value}</p>
// // // // // // //             {subtitle && <p className="text-xs text-base-content opacity-60 mt-1">{subtitle}</p>}
// // // // // // //           </div>
// // // // // // //           <div className={`p-3 rounded-lg bg-${color.split('-')[1]}-100`}>
// // // // // // //             <Icon className={`h-6 w-6 text-${color.split('-')[1]}-600`} />
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );

// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex flex-col items-center justify-center min-h-screen">
// // // // // // //         <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
// // // // // // //         <h2 className="text-xl font-semibold text-base-content">Chargement du tableau de bord...</h2>
// // // // // // //         <p className="text-base-content opacity-70 mt-2">Connexion aux sources de données</p>
// // // // // // //         <div className="mt-4 w-64 bg-base-300 rounded-full h-2">
// // // // // // //           <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
// // // // // // //       {/* En-tête */}
// // // // // // //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
// // // // // // //         <div>
// // // // // // //           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
// // // // // // //             <BarChart3 className="h-8 w-8 text-primary" />
// // // // // // //             Tableau de Bord Analytique
// // // // // // //             <span className="badge badge-primary badge-lg">Analytics</span>
// // // // // // //           </h1>
// // // // // // //           <p className="text-base-content opacity-70 mt-1">
// // // // // // //             Surveillance avancée et analyse des performances système
// // // // // // //           </p>
// // // // // // //           <div className="flex flex-wrap gap-2 mt-2 text-sm">
// // // // // // //             <span className="badge badge-primary">
// // // // // // //               {stats.total_materiels} matériels
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-success">
// // // // // // //               {stats.materiels_fonctionnels} fonctionnels
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-error">
// // // // // // //               {stats.incidents_ouverts} incidents
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-warning">
// // // // // // //               {stats.alertes_actives} alertes
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-info">
// // // // // // //               {stats.total_fournisseurs} fournisseurs
// // // // // // //             </span>
// // // // // // //           </div>
// // // // // // //         </div>
        
// // // // // // //         <div className="flex flex-wrap gap-2">
// // // // // // //           <div className="form-control">
// // // // // // //             <label className="label cursor-pointer gap-2">
// // // // // // //               <span className="label-text text-sm text-base-content">Auto-refresh</span>
// // // // // // //               <input 
// // // // // // //                 type="checkbox" 
// // // // // // //                 className="toggle toggle-primary toggle-sm"
// // // // // // //                 checked={autoRefresh}
// // // // // // //                 onChange={(e) => setAutoRefresh(e.target.checked)}
// // // // // // //               />
// // // // // // //             </label>
// // // // // // //           </div>
          
// // // // // // //           <select 
// // // // // // //             className="select select-bordered select-sm bg-base-100 text-base-content"
// // // // // // //             value={timeRange}
// // // // // // //             onChange={(e) => setTimeRange(e.target.value)}
// // // // // // //           >
// // // // // // //             <option value="today">Aujourd'hui</option>
// // // // // // //             <option value="week">Cette semaine</option>
// // // // // // //             <option value="month">Ce mois</option>
// // // // // // //             <option value="year">Cette année</option>
// // // // // // //           </select>
          
// // // // // // //           <div className="dropdown dropdown-end">
// // // // // // //             <button className="btn btn-primary btn-sm">
// // // // // // //               <Download className="h-4 w-4 mr-2" />
// // // // // // //               Exporter
// // // // // // //             </button>
// // // // // // //             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// // // // // // //               <li><button onClick={generateDetailedPDF} className="text-base-content">PDF Détaillé</button></li>
// // // // // // //               {/* <li><button onClick={generateExcelReport} className="text-base-content">Excel Complet</button></li> */}
// // // // // // //             </ul>
// // // // // // //           </div>
          
// // // // // // //           <button 
// // // // // // //             onClick={loadData}
// // // // // // //             className="btn btn-outline btn-sm text-base-content"
// // // // // // //             disabled={loading}
// // // // // // //           >
// // // // // // //             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
// // // // // // //             {loading ? 'Actualisation...' : 'Actualiser'}
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Filtres */}
// // // // // // //       {/* <div className="card bg-base-200 shadow-xl mb-6 border border-base-300">
// // // // // // //         <div className="card-body">
// // // // // // //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
// // // // // // //             <h2 className="card-title text-base-content">
// // // // // // //               <Filter className="h-5 w-5" />
// // // // // // //               Filtres de recherche
// // // // // // //             </h2>
// // // // // // //             <div className="flex gap-2">
// // // // // // //               <button 
// // // // // // //                 onClick={() => loadData()}
// // // // // // //                 className="btn btn-primary btn-sm"
// // // // // // //               >
// // // // // // //                 <Filter className="h-4 w-4 mr-2" />
// // // // // // //                 Appliquer
// // // // // // //               </button>
// // // // // // //               <button 
// // // // // // //                 onClick={() => {
// // // // // // //                   setFilters({
// // // // // // //                     search: '',
// // // // // // //                     periode: 'today',
// // // // // // //                     dateDebut: '',
// // // // // // //                     dateFin: '',
// // // // // // //                     categorie: '',
// // // // // // //                     statut: ''
// // // // // // //                   });
// // // // // // //                   setTimeout(() => loadData(), 100);
// // // // // // //                 }}
// // // // // // //                 className="btn btn-outline btn-sm text-base-content"
// // // // // // //               >
// // // // // // //                 Réinitialiser
// // // // // // //               </button>
// // // // // // //             </div>
// // // // // // //           </div>
          
// // // // // // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// // // // // // //             <div className="form-control">
// // // // // // //               <label className="label">
// // // // // // //                 <span className="label-text flex items-center text-base-content">
// // // // // // //                   <Search className="h-4 w-4 mr-2" />
// // // // // // //                   Recherche
// // // // // // //                 </span>
// // // // // // //               </label>
// // // // // // //               <input
// // // // // // //                 type="text"
// // // // // // //                 placeholder="Rechercher..."
// // // // // // //                 className="input input-bordered bg-base-100 text-base-content"
// // // // // // //                 value={filters.search}
// // // // // // //                 onChange={(e) => setFilters({...filters, search: e.target.value})}
// // // // // // //               />
// // // // // // //             </div>

// // // // // // //             <div className="form-control">
// // // // // // //               <label className="label">
// // // // // // //                 <span className="label-text flex items-center text-base-content">
// // // // // // //                   <Calendar className="h-4 w-4 mr-2" />
// // // // // // //                   Période
// // // // // // //                 </span>
// // // // // // //               </label>
// // // // // // //               <select
// // // // // // //                 className="select select-bordered bg-base-100 text-base-content"
// // // // // // //                 value={filters.periode}
// // // // // // //                 onChange={(e) => setFilters({...filters, periode: e.target.value})}
// // // // // // //               >
// // // // // // //                 <option value="today">Aujourd'hui</option>
// // // // // // //                 <option value="week">Cette semaine</option>
// // // // // // //                 <option value="month">Ce mois</option>
// // // // // // //                 <option value="year">Cette année</option>
// // // // // // //                 <option value="custom">Personnalisée</option>
// // // // // // //               </select>
// // // // // // //             </div> */}

// // // // // // //             {/* <div className="form-control">
// // // // // // //               <label className="label">
// // // // // // //                 <span className="label-text text-base-content">Catégorie</span>
// // // // // // //               </label>
// // // // // // //               <select
// // // // // // //                 className="select select-bordered bg-base-100 text-base-content"
// // // // // // //                 value={filters.categorie}
// // // // // // //                 onChange={(e) => setFilters({...filters, categorie: e.target.value})}
// // // // // // //               >
// // // // // // //                 <option value="">Toutes catégories</option>
// // // // // // //                 <option value="materiels">Matériels</option>
// // // // // // //                 <option value="incidents">Incidents</option>
// // // // // // //                 <option value="alertes">Alertes</option>
// // // // // // //                 <option value="logiciels">Logiciels</option>
// // // // // // //                 <option value="reseau">Réseau</option>
// // // // // // //               </select>
// // // // // // //             </div>

// // // // // // //             <div className="form-control">
// // // // // // //               <label className="label">
// // // // // // //                 <span className="label-text text-base-content">Statut</span>
// // // // // // //               </label>
// // // // // // //               <select
// // // // // // //                 className="select select-bordered bg-base-100 text-base-content"
// // // // // // //                 value={filters.statut}
// // // // // // //                 onChange={(e) => setFilters({...filters, statut: e.target.value})}
// // // // // // //               >
// // // // // // //                 <option value="">Tous statuts</option>
// // // // // // //                 <option value="fonctionnel">Fonctionnel</option>
// // // // // // //                 <option value="panne">En panne</option>
// // // // // // //                 <option value="ouvert">Ouvert</option>
// // // // // // //                 <option value="résolu">Résolu</option>
// // // // // // //                 <option value="active">Active</option>
// // // // // // //                 <option value="critique">Critique</option>
// // // // // // //               </select>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div> */}

// // // // // // //       {/* Statistiques principales */}
// // // // // // //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
// // // // // // //         <StatCard
// // // // // // //           title="Total Matériels"
// // // // // // //           value={stats.total_materiels}
// // // // // // //           icon={Database}
// // // // // // //           color="blue-600"
// // // // // // //           subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Logiciels"
// // // // // // //           value={stats.total_logiciels}
// // // // // // //           icon={Package}
// // // // // // //           color="purple-600"
// // // // // // //           subtitle="Parc logiciel"
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Alertes Actives"
// // // // // // //           value={stats.alertes_actives}
// // // // // // //           icon={Bell}
// // // // // // //           color="yellow-600"
// // // // // // //           subtitle="Nécessitent attention"
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Incidents Ouverts"
// // // // // // //           value={stats.incidents_ouverts}
// // // // // // //           icon={AlertTriangle}
// // // // // // //           color="red-600"
// // // // // // //           subtitle="En cours de traitement"
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Coût Réparations"
// // // // // // //           value={formatCurrency(stats.cout_total_reparations)}
// // // // // // //           icon={DollarSign}
// // // // // // //           color="green-600"
// // // // // // //           subtitle="Total dépensé"
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Équipements Réseau"
// // // // // // //           value={stats.equipements_reseau}
// // // // // // //           icon={Network}
// // // // // // //           color="indigo-600"
// // // // // // //           subtitle="Infrastructure"
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Fournisseurs"
// // // // // // //           value={stats.total_fournisseurs}
// // // // // // //           icon={Users}
// // // // // // //           color="pink-600"
// // // // // // //           subtitle="Partenaires"
// // // // // // //         />
// // // // // // //       </div>

// // // // // // //       {/* Graphiques principaux */}
// // // // // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // // // // // //         {/* État des matériels */}
// // // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <PieChartIcon className="h-5 w-5 mr-2" />
// // // // // // //               État des Matériels
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <PieChart>
// // // // // // //                 <Pie
// // // // // // //                   data={chartData.materielsEtat}
// // // // // // //                   cx="50%"
// // // // // // //                   cy="50%"
// // // // // // //                   labelLine={false}
// // // // // // //                   label={({ name, value }) => `${name}: ${value}`}
// // // // // // //                   outerRadius={80}
// // // // // // //                   dataKey="value"
// // // // // // //                 >
// // // // // // //                   {chartData.materielsEtat.map((entry, index) => (
// // // // // // //                     <Cell key={`cell-${index}`} fill={entry.color} />
// // // // // // //                   ))}
// // // // // // //                 </Pie>
// // // // // // //                 <Tooltip />
// // // // // // //                 <Legend />
// // // // // // //               </PieChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Matériels par Service */}
// // // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <UsersIcon className="h-5 w-5 mr-2" />
// // // // // // //               Matériels par Service
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <BarChart data={chartData.materielsService}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // // //                 <XAxis dataKey="service" stroke="#9CA3AF" />
// // // // // // //                 <YAxis stroke="#9CA3AF" />
// // // // // // //                 <Tooltip 
// // // // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // // //                   formatter={(value) => [`${value} matériels`, 'Quantité']}
// // // // // // //                   labelFormatter={(label) => `Service: ${label}`}
// // // // // // //                 />
// // // // // // //                 <Legend />
// // // // // // //                 <Bar 
// // // // // // //                   dataKey="count" 
// // // // // // //                   name="Matériels"
// // // // // // //                   radius={[4, 4, 0, 0]}
// // // // // // //                 >
// // // // // // //                   {chartData.materielsService.map((entry, index) => (
// // // // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // // //                   ))}
// // // // // // //                 </Bar>
// // // // // // //               </BarChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // // // // //               Total: {stats.total_materiels} matériels répartis dans {Object.keys(stats.materiels_par_service).length} services
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // //         // {/* Incidents par priorité */}
// // // // // //         // <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //         //   <div className="card-body">
// // // // // //         //     <h3 className="card-title text-base-content">
// // // // // //         //       <BarChart3 className="h-5 w-5 mr-2" />
// // // // // //         //       Incidents par Priorité
// // // // // //         //     </h3>
// // // // // //         //     <ResponsiveContainer width="100%" height={300}>
// // // // // //         //       <BarChart data={chartData.incidentsPriorite}>
// // // // // //         //         <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // //         //         <XAxis dataKey="priorite" stroke="#9CA3AF" />
// // // // // //         //         <YAxis stroke="#9CA3AF" />
// // // // // //         //         <Tooltip 
// // // // // //         //           contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // //         //         />
// // // // // //         //         <Legend />
// // // // // //         //         <Bar dataKey="count" name="Incidents">
// // // // // //         //           {chartData.incidentsPriorite.map((entry, index) => (
// // // // // //         //             <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // //         //           ))}
// // // // // //         //         </Bar>
// // // // // //         //       </BarChart>
// // // // // //         //     </ResponsiveContainer>
// // // // // //         //   </div>
// // // // // //         // </div>

// // // // // // //         {/* Alertes par Sévérité */}
// // // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <ShieldAlert className="h-5 w-5 mr-2" />
// // // // // // //               Alertes par Sévérité
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <BarChart data={chartData.alertesSeverite}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // // //                 <XAxis dataKey="severite" stroke="#9CA3AF" />
// // // // // // //                 <YAxis stroke="#9CA3AF" />
// // // // // // //                 <Tooltip 
// // // // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // // //                   formatter={(value) => [`${value} alertes`, 'Quantité']}
// // // // // // //                   labelFormatter={(label) => `Sévérité: ${label}`}
// // // // // // //                 />
// // // // // // //                 <Legend />
// // // // // // //                 <Bar 
// // // // // // //                   dataKey="count" 
// // // // // // //                   name="Alertes"
// // // // // // //                   radius={[4, 4, 0, 0]}
// // // // // // //                 >
// // // // // // //                   {chartData.alertesSeverite.map((entry, index) => (
// // // // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // // //                   ))}
// // // // // // //                 </Bar>
// // // // // // //               </BarChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // // // // //               {stats.alertes_actives} alertes actives dont {stats.alertes_critiques} critiques
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Évolution des incidents */}
// // // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <LineChartIcon className="h-5 w-5 mr-2" />
// // // // // // //               Évolution des Incidents
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <LineChart data={chartData.incidentsEvolution}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // // //                 <XAxis dataKey="jour" stroke="#9CA3AF" />
// // // // // // //                 <YAxis stroke="#9CA3AF" />
// // // // // // //                 <Tooltip 
// // // // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // // //                 />
// // // // // // //                 <Legend />
// // // // // // //                 <Line 
// // // // // // //                   type="monotone" 
// // // // // // //                   dataKey="incidents" 
// // // // // // //                   stroke="#ef4444" 
// // // // // // //                   strokeWidth={3}
// // // // // // //                   dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
// // // // // // //                   name="Incidents"
// // // // // // //                 />
// // // // // // //               </LineChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Tableau récapitulatif */}
// // // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <Database className="h-5 w-5 mr-2" />
// // // // // // //               Synthèse des Données
// // // // // // //             </h3>
// // // // // // //             <div className="space-y-4">
// // // // // // //               <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
// // // // // // //                 <span className="font-medium text-base-content">Matériels fonctionnels</span>
// // // // // // //                 <span className="badge badge-success">{stats.materiels_fonctionnels}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
// // // // // // //                 <span className="font-medium text-base-content">Incidents résolus</span>
// // // // // // //                 <span className="badge badge-success">{stats.incidents_resolus}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
// // // // // // //                 <span className="font-medium text-base-content">Alertes critiques</span>
// // // // // // //                 <span className="badge badge-error">{stats.alertes_critiques}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
// // // // // // //                 <span className="font-medium text-base-content">Réparations ce mois</span>
// // // // // // //                 <span className="badge badge-info">{stats.reparations_ce_mois}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
// // // // // // //                 <span className="font-medium text-base-content">Logiciels actifs</span>
// // // // // // //                 <span className="badge badge-success">{stats.logiciels_actifs}</span>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Tableau des alertes récentes */}
// // // // // // //       <div className="card bg-base-200 shadow-xl mb-6 border border-base-300">
// // // // // // //         <div className="card-body">
// // // // // // //           <h2 className="card-title text-base-content">
// // // // // // //             <Bell className="h-5 w-5 mr-2" />
// // // // // // //             Alertes Récentes ({alertes.length})
// // // // // // //             {stats.alertes_critiques > 0 && (
// // // // // // //               <span className="badge badge-error ml-2">{stats.alertes_critiques} critiques</span>
// // // // // // //             )}
// // // // // // //           </h2>
// // // // // // //           <div className="overflow-x-auto">
// // // // // // //             <table className="table table-zebra w-full">
// // // // // // //               <thead>
// // // // // // //                 <tr className="bg-base-300">
// // // // // // //                   <th className="text-base-content">Description</th>
// // // // // // //                   <th className="text-base-content">Type</th>
// // // // // // //                   <th className="text-base-content">Sévérité</th>
// // // // // // //                   <th className="text-base-content">Date</th>
// // // // // // //                   <th className="text-base-content">Statut</th>
// // // // // // //                   <th className="text-base-content">Actions</th>
// // // // // // //                 </tr>
// // // // // // //               </thead>
// // // // // // //               <tbody>
// // // // // // //                 {safeArray(alertes).slice(0, 5).map((alerte, index) => (
// // // // // // //                   <tr key={index} className="hover:bg-base-300">
// // // // // // //                     <td className="text-base-content">
// // // // // // //                       <div className="font-medium">
// // // // // // //                         {alerte.description || 'Alerte sans description'}
// // // // // // //                       </div>
// // // // // // //                       <div className="text-xs opacity-70">
// // // // // // //                         Source: {alerte.materiel_nom || alerte.logiciel_nom || 'Système'}
// // // // // // //                       </div>
// // // // // // //                     </td>
// // // // // // //                     <td>
// // // // // // //                       <span className="badge badge-outline text-base-content border-base-300">
// // // // // // //                         {alerte.type_alerte || 'Non spécifié'}
// // // // // // //                       </span>
// // // // // // //                     </td>
// // // // // // //                     <td>
// // // // // // //                       <span className={`badge ${
// // // // // // //                         alerte.severite === 'critique' ? 'badge-error' :
// // // // // // //                         alerte.severite === 'élevée' ? 'badge-warning' : 'badge-info'
// // // // // // //                       }`}>
// // // // // // //                         {alerte.severite || 'Non spécifiée'}
// // // // // // //                       </span>
// // // // // // //                     </td>
// // // // // // //                     <td className="text-base-content">
// // // // // // //                       {new Date(alerte.date_alerte || alerte.date_creation).toLocaleDateString('fr-FR')}
// // // // // // //                     </td>
// // // // // // //                     <td>
// // // // // // //                       <span className={`badge ${
// // // // // // //                         alerte.statut === 'nouvelle' ? 'badge-warning' :
// // // // // // //                         alerte.statut === 'en_traitement' ? 'badge-info' : 'badge-success'
// // // // // // //                       }`}>
// // // // // // //                         {alerte.statut || 'Active'}
// // // // // // //                       </span>
// // // // // // //                     </td>
// // // // // // //                     <td>
// // // // // // //                       <button className="btn btn-ghost btn-xs text-base-content">
// // // // // // //                         <Eye className="h-4 w-4" />
// // // // // // //                       </button>
// // // // // // //                     </td>
// // // // // // //                   </tr>
// // // // // // //                 ))}
// // // // // // //               </tbody>
// // // // // // //             </table>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Informations système */}
// // // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // // // // //         <div className="card bg-base-200 border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <Info className="h-5 w-5 mr-2" />
// // // // // // //               Informations système
// // // // // // //             </h3>
// // // // // // //             <div className="space-y-2 text-sm">
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium text-base-content">Dernière mise à jour:</span>
// // // // // // //                 <span className="text-base-content">{lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : 'Non disponible'}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium text-base-content">Données chargées:</span>
// // // // // // //                 <span className="text-base-content">{safeArray(materiels).length} matériels, {safeArray(incidents).length} incidents</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium text-base-content">Auto-refresh:</span>
// // // // // // //                 <span className="text-base-content">{autoRefresh ? 'Activé (30s)' : 'Désactivé'}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium text-base-content">Utilisateur:</span>
// // // // // // //                 <span className="text-base-content">{user?.nom_complet || user?.username || 'Non connecté'}</span>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
        
// // // // // // //         <div className="card bg-base-200 border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <BellRing className="h-5 w-5 mr-2" />
// // // // // // //               Recommandations
// // // // // // //             </h3>
// // // // // // //             <div className="space-y-2 text-sm">
// // // // // // //               {stats.alertes_critiques > 0 && (
// // // // // // //                 <div className="alert alert-warning">
// // // // // // //                   <AlertTriangle className="h-4 w-4" />
// // // // // // //                   <span className="text-base-content">⚠️ {stats.alertes_critiques} alerte(s) critique(s) nécessite(nt) attention</span>
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //               {stats.incidents_ouverts > 5 && (
// // // // // // //                 <div className="alert alert-warning">
// // // // // // //                   <AlertTriangle className="h-4 w-4" />
// // // // // // //                   <span className="text-base-content">⚠️ Nombre élevé d'incidents ouverts</span>
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //               {stats.materiels_en_panne > 0 && (
// // // // // // //                 <div className="alert alert-info">
// // // // // // //                   <Wrench className="h-4 w-4" />
// // // // // // //                   <span className="text-base-content">🔧 {stats.materiels_en_panne} matériel(s) en panne</span>
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //               {stats.logiciels_expires > 0 && (
// // // // // // //                 <div className="alert alert-warning">
// // // // // // //                   <XCircle className="h-4 w-4" />
// // // // // // //                   <span className="text-base-content">📅 {stats.logiciels_expires} logiciel(s) expiré(s)</span>
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // Fonction pour convertir une image en base64
// // // // // // // const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
// // // // // // //   const img = new Image();
// // // // // // //   img.crossOrigin = 'Anonymous';
// // // // // // //   img.onload = () => {
// // // // // // //     const canvas = document.createElement('canvas');
// // // // // // //     const ctx = canvas.getContext('2d');
// // // // // // //     canvas.width = img.width;
// // // // // // //     canvas.height = img.height;
// // // // // // //     ctx.drawImage(img, 0, 0);
// // // // // // //     resolve(canvas.toDataURL('image/jpeg'));
// // // // // // //   };
// // // // // // //   img.onerror = reject;
// // // // // // //   img.src = imgUrl;
// // // // // // // });

// // // // // // // export default Dashboard;



// // // // // // // // src/pages/Dashboard.jsx - VERSION FINALE CORRIGÉE
// // // // // // // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // // // // // // import { 
// // // // // // //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// // // // // // //   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
// // // // // // // } from 'recharts';
// // // // // // // import { 
// // // // // // //   BarChart3, RefreshCw, Users, 
// // // // // // //   Eye, AlertTriangle, CheckCircle, XCircle, 
// // // // // // //   Database, Bell, Package, 
// // // // // // //   Network, Wrench,
// // // // // // //   Activity, PieChart as PieChartIcon,
// // // // // // //   LineChart as LineChartIcon, Info, 
// // // // // // //   Bell as BellIcon, Shield, DollarSign,
// // // // // // //   Clock, AlertCircle,
// // // // // // //   HardDrive, Printer as PrinterIcon,
// // // // // // //   Laptop, Check
// // // // // // // } from 'lucide-react';
// // // // // // // import { 
// // // // // // //   materielsAPI, 
// // // // // // //   incidentsAPI, 
// // // // // // //   reparationsAPI, 
// // // // // // //   logicielsAPI, 
// // // // // // //   alertesAPI, 
// // // // // // //   fournisseursAPI, 
// // // // // // //   reseauAPI 
// // // // // // // } from '../services/api';
// // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // import { useNotification } from '../context/NotificationContext';
// // // // // // // import jsPDF from 'jspdf';
// // // // // // // import autoTable from 'jspdf-autotable';

// // // // // // // // Import du logo
// // // // // // // import logoDren from '../assets/images/logo-dren.jpeg';

// // // // // // // // COULEURS FIXES POUR CHAQUE SERVICE
// // // // // // // const SERVICE_COLORS = {
// // // // // // //   'Direction': '#3b82f6',        // Bleu
// // // // // // //   'Administration': '#8b5cf6',   // Violet
// // // // // // //   'Informatique': '#10b981',     // Vert
// // // // // // //   'Ressources Humaines': '#f59e0b', // Orange
// // // // // // //   'Comptabilité': '#ef4444',     // Rouge
// // // // // // //   'Finance': '#ef4444',          // Rouge aussi
// // // // // // //   'Communication': '#06b6d4',    // Cyan
// // // // // // //   'Maintenance': '#ec4899',      // Rose
// // // // // // //   'Sécurité': '#84cc16',         // Vert clair
// // // // // // //   'Technique': '#f97316',        // Orange vif
// // // // // // //   'Commercial': '#8b5cf6',       // Violet
// // // // // // //   'Marketing': '#ec4899',        // Rose
// // // // // // //   'Production': '#10b981',       // Vert
// // // // // // //   'Logistique': '#f59e0b',       // Orange
// // // // // // //   'Qualité': '#06b6d4',          // Cyan
// // // // // // //   'Recherche & Développement': '#3b82f6', // Bleu
// // // // // // //   'R&D': '#3b82f6',              // Bleu
// // // // // // //   'Support': '#84cc16',          // Vert clair
// // // // // // //   'Service Client': '#06b6d4',   // Cyan
// // // // // // //   'Non assigné': '#9ca3af',      // Gris
// // // // // // //   'Autre': '#6b7280',            // Gris foncé
// // // // // // //   'Défaut': '#94a3b8'            // Gris moyen
// // // // // // // };

// // // // // // // // Fonction pour obtenir une couleur fixe pour un service
// // // // // // // const getServiceColor = (serviceName) => {
// // // // // // //   if (!serviceName) return SERVICE_COLORS['Non assigné'];
  
// // // // // // //   const name = serviceName.trim().toLowerCase();
  
// // // // // // //   // Chercher une correspondance exacte
// // // // // // //   for (const [key, color] of Object.entries(SERVICE_COLORS)) {
// // // // // // //     if (name === key.toLowerCase()) {
// // // // // // //       return color;
// // // // // // //     }
// // // // // // //   }
  
// // // // // // //   // Chercher une correspondance partielle
// // // // // // //   for (const [key, color] of Object.entries(SERVICE_COLORS)) {
// // // // // // //     if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name)) {
// // // // // // //       return color;
// // // // // // //     }
// // // // // // //   }
  
// // // // // // //   // Pour les services avec des mots clés
// // // // // // //   const colorMapping = {
// // // // // // //     'dir': SERVICE_COLORS['Direction'],
// // // // // // //     'admin': SERVICE_COLORS['Administration'],
// // // // // // //     'info': SERVICE_COLORS['Informatique'],
// // // // // // //     'rh': SERVICE_COLORS['Ressources Humaines'],
// // // // // // //     'compta': SERVICE_COLORS['Comptabilité'],
// // // // // // //     'com': SERVICE_COLORS['Communication'],
// // // // // // //     'maint': SERVICE_COLORS['Maintenance'],
// // // // // // //     'secu': SERVICE_COLORS['Sécurité'],
// // // // // // //     'tech': SERVICE_COLORS['Technique'],
// // // // // // //     'dev': SERVICE_COLORS['R&D'],
// // // // // // //   };
  
// // // // // // //   for (const [keyword, color] of Object.entries(colorMapping)) {
// // // // // // //     if (name.includes(keyword)) {
// // // // // // //       return color;
// // // // // // //     }
// // // // // // //   }
  
// // // // // // //   // Sinon, générer une couleur stable basée sur le hash
// // // // // // //   const hash = name.split('').reduce((acc, char) => {
// // // // // // //     return char.charCodeAt(0) + ((acc << 5) - acc);
// // // // // // //   }, 0);
  
// // // // // // //   const colors = Object.values(SERVICE_COLORS);
// // // // // // //   return colors[Math.abs(hash) % colors.length];
// // // // // // // };

// // // // // // // const getPriorityColor = (priority) => {
// // // // // // //   const colors = {
// // // // // // //     'critique': '#ef4444',
// // // // // // //     'haute': '#f97316',
// // // // // // //     'moyenne': '#eab308',
// // // // // // //     'basse': '#22c55e',
// // // // // // //   };
// // // // // // //   return colors[priority?.toLowerCase()] || '#6b7280';
// // // // // // // };

// // // // // // // const getSeverityColor = (severity) => {
// // // // // // //   const colors = {
// // // // // // //     'critique': '#ef4444',
// // // // // // //     'élevée': '#f97316',
// // // // // // //     'moyenne': '#eab308',
// // // // // // //     'basse': '#22c55e',
// // // // // // //   };
// // // // // // //   return colors[severity?.toLowerCase()] || '#6b7280';
// // // // // // // };

// // // // // // // const Dashboard = () => {
// // // // // // //   const { user } = useAuth();
// // // // // // //   const { showNotification } = useNotification();
  
// // // // // // //   // États principaux
// // // // // // //   const [stats, setStats] = useState({
// // // // // // //     // Matériels
// // // // // // //     total_materiels: 0,
// // // // // // //     materiels_fonctionnels: 0,
// // // // // // //     materiels_en_panne: 0,
// // // // // // //     materiels_maintenance: 0,
// // // // // // //     materiels_par_service: {},
    
// // // // // // //     // Logiciels
// // // // // // //     total_logiciels: 0,
// // // // // // //     logiciels_actifs: 0,
// // // // // // //     logiciels_expires: 0,
    
// // // // // // //     // Incidents & Réparations
// // // // // // //     incidents_ouverts: 0,
// // // // // // //     incidents_resolus: 0,
// // // // // // //     incidents_par_priorite: {},
// // // // // // //     reparations_ce_mois: 0,
// // // // // // //     cout_total_reparations: 0,
    
// // // // // // //     // Alertes
// // // // // // //     alertes_actives: 0,
// // // // // // //     alertes_critiques: 0,
// // // // // // //     alertes_par_severite: {},
    
// // // // // // //     // Fournisseurs & Réseau
// // // // // // //     total_fournisseurs: 0,
// // // // // // //     equipements_reseau: 0,
// // // // // // //     reseau_fonctionnel: 0,
// // // // // // //   });
  
// // // // // // //   // États pour les données
// // // // // // //   const [materiels, setMateriels] = useState([]);
// // // // // // //   const [incidents, setIncidents] = useState([]);
// // // // // // //   const [reparations, setReparations] = useState([]);
// // // // // // //   const [logiciels, setLogiciels] = useState([]);
// // // // // // //   const [alertes, setAlertes] = useState([]);
// // // // // // //   const [fournisseurs, setFournisseurs] = useState([]);
// // // // // // //   const [reseau, setReseau] = useState([]);
  
// // // // // // //   // États UI
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [error, setError] = useState(null);
// // // // // // //   const [autoRefresh, setAutoRefresh] = useState(false);
// // // // // // //   const [timeRange, setTimeRange] = useState('today');
// // // // // // //   const [lastUpdate, setLastUpdate] = useState(null);

// // // // // // //   // Fonctions helper
// // // // // // //   const safeArray = (data) => Array.isArray(data) ? data : [];
// // // // // // //   const safeFilter = (array, condition) => array?.filter?.(condition) || [];
// // // // // // //   const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

// // // // // // //   // Charger les données
// // // // // // //   const loadData = useCallback(async () => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       setError(null);
// // // // // // //       console.log('📊 Chargement des données dashboard...');

// // // // // // //       const requests = [
// // // // // // //         { key: 'materiels', api: materielsAPI.getAll },
// // // // // // //         { key: 'incidents', api: incidentsAPI.getAll },
// // // // // // //         { key: 'reparations', api: reparationsAPI.getAll },
// // // // // // //         { key: 'logiciels', api: logicielsAPI.getAll },
// // // // // // //         { key: 'alertes', api: alertesAPI.getAll },
// // // // // // //         { key: 'fournisseurs', api: fournisseursAPI.getAll },
// // // // // // //         { key: 'reseau', api: reseauAPI.getAll },
// // // // // // //       ];

// // // // // // //       const results = {};
// // // // // // //       const newErrors = [];

// // // // // // //       for (const req of requests) {
// // // // // // //         try {
// // // // // // //           const response = await req.api();
// // // // // // //           results[req.key] = extractData(response);
// // // // // // //           console.log(`✅ ${req.key}: ${results[req.key].length} entrées`);
// // // // // // //         } catch (error) {
// // // // // // //           console.error(`❌ ${req.key}:`, error);
// // // // // // //           results[req.key] = [];
// // // // // // //           newErrors.push(`${req.key}: ${error.message || 'Erreur connexion'}`);
// // // // // // //         }
// // // // // // //       }

// // // // // // //       if (newErrors.length > 0) {
// // // // // // //         setError(newErrors.join(', '));
// // // // // // //       }
      
// // // // // // //       // Mettre à jour les états
// // // // // // //       setMateriels(safeArray(results.materiels));
// // // // // // //       setIncidents(safeArray(results.incidents));
// // // // // // //       setReparations(safeArray(results.reparations));
// // // // // // //       setLogiciels(safeArray(results.logiciels));
// // // // // // //       setAlertes(safeArray(results.alertes));
// // // // // // //       setFournisseurs(safeArray(results.fournisseurs));
// // // // // // //       setReseau(safeArray(results.reseau));

// // // // // // //       // Calculer les statistiques
// // // // // // //       calculateAdvancedStats(results);
      
// // // // // // //       setLastUpdate(new Date());
// // // // // // //       showNotification('Tableau de bord actualisé', 'success');

// // // // // // //     } catch (error) {
// // // // // // //       console.error('❌ Erreur générale:', error);
// // // // // // //       setError('Erreur de chargement des données');
// // // // // // //       showNotification('Erreur lors du chargement', 'error');
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   }, [showNotification]);

// // // // // // //   // Calculer les statistiques
// // // // // // //   const calculateAdvancedStats = useCallback((results) => {
// // // // // // //     // Matériels par service
// // // // // // //     const materielsParService = safeReduce(results.materiels, (acc, m) => {
// // // // // // //       const service = m.service || m.departement || m.service_attribue || m.direction || 'Non assigné';
// // // // // // //       acc[service] = (acc[service] || 0) + 1;
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Matériels fonctionnels
// // // // // // //     const materielsFonctionnels = safeFilter(results.materiels, m => {
// // // // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // // // //       return etat.includes('fonctionnel') || 
// // // // // // //              etat.includes('actif') || 
// // // // // // //              etat.includes('opérationnel') ||
// // // // // // //              etat.includes('en service') ||
// // // // // // //              etat === 'bon' ||
// // // // // // //              etat === 'good';
// // // // // // //     }).length;

// // // // // // //     // Matériels en panne
// // // // // // //     const materielsEnPanne = safeFilter(results.materiels, m => {
// // // // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // // // //       return etat.includes('panne') || 
// // // // // // //              etat.includes('défectueux') || 
// // // // // // //              etat.includes('hors service') ||
// // // // // // //              etat.includes('non fonctionnel') ||
// // // // // // //              etat === 'mauvais' ||
// // // // // // //              etat === 'bad';
// // // // // // //     }).length;

// // // // // // //     // Matériels en maintenance
// // // // // // //     const materielsMaintenance = safeFilter(results.materiels, m => {
// // // // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // // // //       return etat.includes('maintenance') || 
// // // // // // //              etat.includes('réparation') || 
// // // // // // //              etat.includes('en réparation');
// // // // // // //     }).length;

// // // // // // //     // Incidents résolus
// // // // // // //     const incidentsResolus = safeFilter(results.incidents, i => {
// // // // // // //       const statut = (i.statut || '').toString().toLowerCase();
// // // // // // //       return statut.includes('résolu') || 
// // // // // // //              statut.includes('resolu') ||
// // // // // // //              statut.includes('fermé') || 
// // // // // // //              statut.includes('ferme') ||
// // // // // // //              statut.includes('traité') ||
// // // // // // //              statut.includes('traite') ||
// // // // // // //              statut.includes('terminé') ||
// // // // // // //              statut === 'closed' ||
// // // // // // //              statut === 'done';
// // // // // // //     }).length;

// // // // // // //     // Incidents ouverts
// // // // // // //     const incidentsOuverts = safeFilter(results.incidents, i => {
// // // // // // //       const statut = (i.statut || '').toString().toLowerCase();
// // // // // // //       return statut.includes('ouvert') || 
// // // // // // //              statut.includes('en cours') ||
// // // // // // //              statut.includes('en_cours') ||
// // // // // // //              statut.includes('non résolu') ||
// // // // // // //              statut === 'open' ||
// // // // // // //              statut === 'pending' ||
// // // // // // //              statut === 'in progress';
// // // // // // //     }).length;

// // // // // // //     // Alertes critiques
// // // // // // //     const alertesCritiques = safeFilter(results.alertes, a => {
// // // // // // //       const severite = (a.severite || '').toString().toLowerCase();
// // // // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // // // //       const isActive = statut.includes('nouvelle') || 
// // // // // // //                        statut.includes('en_traitement') || 
// // // // // // //                        statut.includes('active') ||
// // // // // // //                        statut.includes('ouverte') ||
// // // // // // //                        !statut;
// // // // // // //       return isActive && (severite.includes('critique') || severite === 'high');
// // // // // // //     }).length;

// // // // // // //     // Alertes actives
// // // // // // //     const alertesActives = safeFilter(results.alertes, a => {
// // // // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // // // //       return statut.includes('nouvelle') || 
// // // // // // //              statut.includes('en_traitement') || 
// // // // // // //              statut.includes('active') ||
// // // // // // //              statut.includes('ouverte') ||
// // // // // // //              !statut;
// // // // // // //     }).length;

// // // // // // //     // Réparations ce mois
// // // // // // //     const now = new Date();
// // // // // // //     const currentMonth = now.getMonth();
// // // // // // //     const currentYear = now.getFullYear();
    
// // // // // // //     const reparationsCeMois = safeFilter(results.reparations, r => {
// // // // // // //       const dateStr = r.date_reparation || r.date_debut || r.date || r.created_at;
// // // // // // //       if (!dateStr) return false;
// // // // // // //       try {
// // // // // // //         const date = new Date(dateStr);
// // // // // // //         return date.getMonth() === currentMonth && 
// // // // // // //                date.getFullYear() === currentYear;
// // // // // // //       } catch {
// // // // // // //         return false;
// // // // // // //       }
// // // // // // //     }).length;

// // // // // // //     // Coût total réparations
// // // // // // //     const coutTotalReparations = safeReduce(results.reparations, (sum, r) => 
// // // // // // //       sum + (parseFloat(r.cout) || 0), 0
// // // // // // //     );

// // // // // // //     // Logiciels actifs
// // // // // // //     const logicielsActifs = safeFilter(results.logiciels, l => {
// // // // // // //       const statut = (l.statut || '').toString().toLowerCase();
// // // // // // //       const licenceActive = l.licence_active === true || 
// // // // // // //                            l.licence_active === 'true' || 
// // // // // // //                            l.licence_active === 1 ||
// // // // // // //                            l.licence_active === '1';
// // // // // // //       return statut.includes('actif') || 
// // // // // // //              statut.includes('active') || 
// // // // // // //              statut.includes('valide') ||
// // // // // // //              licenceActive ||
// // // // // // //              l.etat === 'actif';
// // // // // // //     }).length;

// // // // // // //     // Total logiciels
// // // // // // //     const totalLogiciels = safeArray(results.logiciels).length;

// // // // // // //     // Alertes par sévérité
// // // // // // //     const alertesParSeverite = safeReduce(results.alertes, (acc, a) => {
// // // // // // //       const severite = a.severite || 'non spécifiée';
// // // // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // // // //       const isActive = statut.includes('nouvelle') || 
// // // // // // //                        statut.includes('en_traitement') || 
// // // // // // //                        statut.includes('active') ||
// // // // // // //                        statut.includes('ouverte') ||
// // // // // // //                        !statut;
// // // // // // //       if (isActive) {
// // // // // // //         acc[severite] = (acc[severite] || 0) + 1;
// // // // // // //       }
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     // Incidents par priorité
// // // // // // //     const incidentsParPriorite = safeReduce(results.incidents, (acc, i) => {
// // // // // // //       const priorite = i.priorite || 'moyenne';
// // // // // // //       const statut = (i.statut || '').toString().toLowerCase();
// // // // // // //       const isOpen = statut.includes('ouvert') || 
// // // // // // //                      statut.includes('en cours') ||
// // // // // // //                      statut.includes('non résolu') ||
// // // // // // //                      statut === 'open' ||
// // // // // // //                      statut === 'pending';
// // // // // // //       if (isOpen) {
// // // // // // //         acc[priorite] = (acc[priorite] || 0) + 1;
// // // // // // //       }
// // // // // // //       return acc;
// // // // // // //     }, {});

// // // // // // //     console.log('📊 DONNÉES CALCULÉES POUR SYSTHÈSE:');
// // // // // // //     console.log('- Matériels fonctionnels:', materielsFonctionnels);
// // // // // // //     console.log('- Incidents résolus:', incidentsResolus);
// // // // // // //     console.log('- Alertes critiques:', alertesCritiques);
// // // // // // //     console.log('- Réparations ce mois:', reparationsCeMois);
// // // // // // //     console.log('- Logiciels actifs:', logicielsActifs);
// // // // // // //     console.log('- Total matériels:', safeArray(results.materiels).length);
// // // // // // //     console.log('- Matériels par service:', materielsParService);

// // // // // // //     const calculatedStats = {
// // // // // // //       // Matériels
// // // // // // //       total_materiels: safeArray(results.materiels).length,
// // // // // // //       materiels_fonctionnels: materielsFonctionnels,
// // // // // // //       materiels_en_panne: materielsEnPanne,
// // // // // // //       materiels_maintenance: materielsMaintenance,
// // // // // // //       materiels_par_service: materielsParService,
      
// // // // // // //       // Logiciels
// // // // // // //       total_logiciels: totalLogiciels,
// // // // // // //       logiciels_actifs: logicielsActifs,
// // // // // // //       logiciels_expires: safeFilter(results.logiciels, l => {
// // // // // // //         const expiry = l.date_expiration || l.licence_expire || l.date_fin;
// // // // // // //         return expiry && new Date(expiry) < new Date();
// // // // // // //       }).length,
      
// // // // // // //       // Incidents
// // // // // // //       incidents_ouverts: incidentsOuverts,
// // // // // // //       incidents_resolus: incidentsResolus,
// // // // // // //       incidents_par_priorite: incidentsParPriorite,
      
// // // // // // //       // Réparations
// // // // // // //       reparations_ce_mois: reparationsCeMois,
// // // // // // //       cout_total_reparations: coutTotalReparations,
      
// // // // // // //       // Alertes
// // // // // // //       alertes_actives: alertesActives,
// // // // // // //       alertes_critiques: alertesCritiques,
// // // // // // //       alertes_par_severite: alertesParSeverite,
      
// // // // // // //       // Fournisseurs & Réseau
// // // // // // //       total_fournisseurs: safeArray(results.fournisseurs).length,
// // // // // // //       equipements_reseau: safeArray(results.reseau).length,
// // // // // // //       reseau_fonctionnel: safeFilter(results.reseau, r => 
// // // // // // //         r.statut === 'actif' || r.etat === 'fonctionnel' || r.etat === 'actif'
// // // // // // //       ).length,
// // // // // // //     };

// // // // // // //     setStats(calculatedStats);
// // // // // // //   }, []);

// // // // // // //   // Auto-refresh
// // // // // // //   useEffect(() => {
// // // // // // //     loadData();
    
// // // // // // //     if (autoRefresh) {
// // // // // // //       const interval = setInterval(() => {
// // // // // // //         loadData();
// // // // // // //       }, 30000);
// // // // // // //       return () => clearInterval(interval);
// // // // // // //     }
// // // // // // //   }, [loadData, autoRefresh]);

// // // // // // //   // Données pour les graphiques
// // // // // // //   const chartData = useMemo(() => {
// // // // // // //     const now = new Date();
    
// // // // // // //     // Données pour Matériels par Service avec couleurs FIXES
// // // // // // //     const servicesWithColors = Object.entries(stats.materiels_par_service)
// // // // // // //       .sort(([,a], [,b]) => b - a)
// // // // // // //       .slice(0, 8)
// // // // // // //       .map(([service, count]) => {
// // // // // // //         const color = getServiceColor(service);
// // // // // // //         return {
// // // // // // //           service: service.length > 15 ? service.substring(0, 15) + '...' : service,
// // // // // // //           originalService: service,
// // // // // // //           count,
// // // // // // //           fill: color,
// // // // // // //           color: color
// // // // // // //         };
// // // // // // //       });

// // // // // // //     // Données pour Synthèse
// // // // // // //     const syntheseData = [
// // // // // // //       {
// // // // // // //         label: 'Matériels fonctionnels',
// // // // // // //         value: stats.materiels_fonctionnels,
// // // // // // //         icon: Check,
// // // // // // //         color: 'success',
// // // // // // //         description: `${stats.materiels_fonctionnels} / ${stats.total_materiels}`
// // // // // // //       },
// // // // // // //       {
// // // // // // //         label: 'Incidents résolus',
// // // // // // //         value: stats.incidents_resolus,
// // // // // // //         icon: CheckCircle,
// // // // // // //         color: 'success',
// // // // // // //         description: `sur ${stats.incidents_ouverts + stats.incidents_resolus} total`
// // // // // // //       },
// // // // // // //       {
// // // // // // //         label: 'Alertes critiques',
// // // // // // //         value: stats.alertes_critiques,
// // // // // // //         icon: AlertCircle,
// // // // // // //         color: 'error',
// // // // // // //         description: `sur ${stats.alertes_actives} alertes actives`
// // // // // // //       },
// // // // // // //       {
// // // // // // //         label: 'Réparations ce mois',
// // // // // // //         value: stats.reparations_ce_mois,
// // // // // // //         icon: Wrench,
// // // // // // //         color: 'info',
// // // // // // //         description: 'Ce mois-ci'
// // // // // // //       },
// // // // // // //       {
// // // // // // //         label: 'Logiciels actifs',
// // // // // // //         value: stats.logiciels_actifs,
// // // // // // //         icon: Package,
// // // // // // //         color: 'success',
// // // // // // //         description: `${stats.logiciels_actifs} / ${stats.total_logiciels}`
// // // // // // //       },
// // // // // // //     ];

// // // // // // //     return {
// // // // // // //       // Graphique Matériels par Service
// // // // // // //       materielsService: servicesWithColors,
      
// // // // // // //       // Données de synthèse
// // // // // // //       syntheseData: syntheseData,
      
// // // // // // //       // État des matériels
// // // // // // //       materielsEtat: [
// // // // // // //         { 
// // // // // // //           name: 'Fonctionnel', 
// // // // // // //           value: stats.materiels_fonctionnels, 
// // // // // // //           color: '#10b981' 
// // // // // // //         },
// // // // // // //         { 
// // // // // // //           name: 'En panne', 
// // // // // // //           value: stats.materiels_en_panne, 
// // // // // // //           color: '#ef4444' 
// // // // // // //         },
// // // // // // //         { 
// // // // // // //           name: 'Maintenance', 
// // // // // // //           value: stats.materiels_maintenance, 
// // // // // // //           color: '#f59e0b' 
// // // // // // //         },
// // // // // // //         { 
// // // // // // //           name: 'Autre', 
// // // // // // //           value: Math.max(0, stats.total_materiels - stats.materiels_fonctionnels - stats.materiels_en_panne - stats.materiels_maintenance), 
// // // // // // //           color: '#6b7280' 
// // // // // // //         },
// // // // // // //       ],
      
// // // // // // //       // Autres graphiques...
// // // // // // //       incidentsPriorite: Object.entries(stats.incidents_par_priorite).map(([priorite, count]) => ({
// // // // // // //         priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
// // // // // // //         count,
// // // // // // //         fill: getPriorityColor(priorite)
// // // // // // //       })),
      
// // // // // // //       alertesSeverite: Object.entries(stats.alertes_par_severite).map(([severite, count]) => ({
// // // // // // //         severite: severite.charAt(0).toUpperCase() + severite.slice(1),
// // // // // // //         count,
// // // // // // //         fill: getSeverityColor(severite)
// // // // // // //       })),
      
// // // // // // //       incidentsEvolution: Array.from({ length: 7 }, (_, i) => {
// // // // // // //         const date = new Date(now);
// // // // // // //         date.setDate(date.getDate() - (6 - i));
// // // // // // //         const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
// // // // // // //         const baseIncidents = Math.floor(Math.random() * 5) + 1;
// // // // // // //         return {
// // // // // // //           jour: dayName,
// // // // // // //           incidents: baseIncidents + (i === 3 ? 3 : 0),
// // // // // // //         };
// // // // // // //       }),
// // // // // // //     };
// // // // // // //   }, [stats]);

// // // // // // //   // Fonction pour extraire les données des réponses API
// // // // // // //   const extractData = (response) => {
// // // // // // //     if (!response?.data) return [];
// // // // // // //     if (Array.isArray(response.data)) return response.data;
// // // // // // //     if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// // // // // // //     if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// // // // // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
// // // // // // //     return [];
// // // // // // //   };

// // // // // // //   // Formater la devise
// // // // // // //   const formatCurrency = (amount) => {
// // // // // // //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// // // // // // //   };

// // // // // // //   // Générer rapport PDF
// // // // // // //   const generateDetailedPDF = async () => {
// // // // // // //     const doc = new jsPDF('landscape');
    
// // // // // // //     try {
// // // // // // //       const imgData = await getBase64Image(logoDren);
// // // // // // //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// // // // // // //     } catch (error) {
// // // // // // //       console.warn('Logo non chargé');
// // // // // // //     }
    
// // // // // // //     doc.setFontSize(20);
// // // // // // //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// // // // // // //     doc.setFontSize(16);
// // // // // // //     doc.text('TABLEAU DE BORD - SYNTHÈSE', 20, 45);
    
// // // // // // //     // Informations générales
// // // // // // //     doc.setFontSize(12);
// // // // // // //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
// // // // // // //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 67);
    
// // // // // // //     doc.setDrawColor(200, 200, 200);
// // // // // // //     doc.line(20, 75, 190, 75);
    
// // // // // // //     // Synthèse des données
// // // // // // //     doc.setFontSize(14);
// // // // // // //     doc.text('SYNTHÈSE DES DONNÉES', 20, 90);
    
// // // // // // //     const syntheseStats = [
// // // // // // //       ['Indicateur', 'Valeur', 'Détail'],
// // // // // // //       ['Matériels fonctionnels', stats.materiels_fonctionnels.toString(), `${stats.total_materiels} total`],
// // // // // // //       ['Incidents résolus', stats.incidents_resolus.toString(), `${stats.incidents_ouverts} ouverts`],
// // // // // // //       ['Alertes critiques', stats.alertes_critiques.toString(), `${stats.alertes_actives} actives`],
// // // // // // //       ['Réparations ce mois', stats.reparations_ce_mois.toString(), formatCurrency(stats.cout_total_reparations)],
// // // // // // //       ['Logiciels actifs', stats.logiciels_actifs.toString(), `${stats.total_logiciels} total`],
// // // // // // //     ];
    
// // // // // // //     autoTable(doc, {
// // // // // // //       startY: 95,
// // // // // // //       head: syntheseStats.slice(0, 1),
// // // // // // //       body: syntheseStats.slice(1),
// // // // // // //       theme: 'grid',
// // // // // // //       headStyles: { fillColor: [59, 130, 246] },
// // // // // // //     });
    
// // // // // // //     doc.save(`dashboard-synthese-${new Date().toISOString().split('T')[0]}.pdf`);
// // // // // // //     showNotification('Rapport PDF généré avec succès', 'success');
// // // // // // //   };

// // // // // // //   // Composant StatCard
// // // // // // //   const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
// // // // // // //     <div className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300">
// // // // // // //       <div className="card-body p-4">
// // // // // // //         <div className="flex items-center justify-between">
// // // // // // //           <div>
// // // // // // //             <h3 className="text-sm font-semibold text-base-content opacity-70">{title}</h3>
// // // // // // //             <p className="text-2xl font-bold mt-1 text-base-content">{value}</p>
// // // // // // //             {subtitle && <p className="text-xs text-base-content opacity-60 mt-1">{subtitle}</p>}
// // // // // // //           </div>
// // // // // // //           <div className={`p-3 rounded-lg bg-${color.split('-')[1]}-100`}>
// // // // // // //             <Icon className={`h-6 w-6 text-${color.split('-')[1]}-600`} />
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );

// // // // // // //   // Composant SyntheseItem
// // // // // // //   const SyntheseItem = ({ label, value, icon: Icon, color, description }) => (
// // // // // // //     <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
// // // // // // //       <div className="flex items-center gap-3">
// // // // // // //         <div className={`p-2 rounded-lg bg-${color}-100`}>
// // // // // // //           <Icon className={`h-5 w-5 text-${color}-600`} />
// // // // // // //         </div>
// // // // // // //         <div>
// // // // // // //           <span className="font-medium text-base-content">{label}</span>
// // // // // // //           {description && (
// // // // // // //             <p className="text-xs text-base-content opacity-60 mt-1">{description}</p>
// // // // // // //           )}
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //       <span className={`text-2xl font-bold text-${color}-600`}>{value}</span>
// // // // // // //     </div>
// // // // // // //   );

// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="flex flex-col items-center justify-center min-h-screen">
// // // // // // //         <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
// // // // // // //         <h2 className="text-xl font-semibold text-base-content">Chargement du tableau de bord...</h2>
// // // // // // //         <p className="text-base-content opacity-70 mt-2">Connexion aux sources de données</p>
// // // // // // //         <div className="mt-4 w-64 bg-base-300 rounded-full h-2">
// // // // // // //           <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
// // // // // // //       {/* En-tête */}
// // // // // // //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
// // // // // // //         <div>
// // // // // // //           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
// // // // // // //             <BarChart3 className="h-8 w-8 text-primary" />
// // // // // // //             Tableau de Bord Analytique
// // // // // // //             <span className="badge badge-primary badge-lg">DREN AA</span>
// // // // // // //           </h1>
// // // // // // //           <p className="text-base-content opacity-70 mt-1">
// // // // // // //             Données en temps réel - Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
// // // // // // //           </p>
// // // // // // //           <div className="flex flex-wrap gap-2 mt-2 text-sm">
// // // // // // //             <span className="badge badge-primary">
// // // // // // //               {stats.total_materiels} matériels
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-success">
// // // // // // //               {stats.materiels_fonctionnels} fonctionnels
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-error">
// // // // // // //               {stats.incidents_ouverts} incidents
// // // // // // //             </span>
// // // // // // //             <span className="badge badge-warning">
// // // // // // //               {stats.alertes_actives} alertes
// // // // // // //             </span>
// // // // // // //           </div>
// // // // // // //         </div>
        
// // // // // // //         <div className="flex flex-wrap gap-2">
// // // // // // //           <div className="form-control">
// // // // // // //             <label className="label cursor-pointer gap-2">
// // // // // // //               <span className="label-text text-sm text-base-content">Auto-refresh</span>
// // // // // // //               <input 
// // // // // // //                 type="checkbox" 
// // // // // // //                 className="toggle toggle-primary toggle-sm"
// // // // // // //                 checked={autoRefresh}
// // // // // // //                 onChange={(e) => setAutoRefresh(e.target.checked)}
// // // // // // //               />
// // // // // // //             </label>
// // // // // // //           </div>
          
// // // // // // //           <select 
// // // // // // //             className="select select-bordered select-sm bg-base-100 text-base-content"
// // // // // // //             value={timeRange}
// // // // // // //             onChange={(e) => setTimeRange(e.target.value)}
// // // // // // //           >
// // // // // // //             <option value="today">Aujourd'hui</option>
// // // // // // //             <option value="week">Cette semaine</option>
// // // // // // //             <option value="month">Ce mois</option>
// // // // // // //             <option value="year">Cette année</option>
// // // // // // //           </select>
          
// // // // // // //           <button 
// // // // // // //             onClick={generateDetailedPDF}
// // // // // // //             className="btn btn-primary btn-sm"
// // // // // // //           >
// // // // // // //             Télécharger PDF
// // // // // // //           </button>
          
// // // // // // //           <button 
// // // // // // //             onClick={loadData}
// // // // // // //             className="btn btn-outline btn-sm text-base-content"
// // // // // // //             disabled={loading}
// // // // // // //           >
// // // // // // //             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
// // // // // // //             {loading ? 'Actualisation...' : 'Actualiser'}
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Statistiques principales */}
// // // // // // //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
// // // // // // //         <StatCard
// // // // // // //           title="Matériels"
// // // // // // //           value={stats.total_materiels}
// // // // // // //           icon={Database}
// // // // // // //           color="blue-600"
// // // // // // //           subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Logiciels"
// // // // // // //           value={stats.total_logiciels}
// // // // // // //           icon={Package}
// // // // // // //           color="purple-600"
// // // // // // //           subtitle={`${stats.logiciels_actifs} actifs`}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Alertes"
// // // // // // //           value={stats.alertes_actives}
// // // // // // //           icon={Bell}
// // // // // // //           color="yellow-600"
// // // // // // //           subtitle={`${stats.alertes_critiques} critiques`}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Incidents"
// // // // // // //           value={stats.incidents_ouverts}
// // // // // // //           icon={AlertTriangle}
// // // // // // //           color="red-600"
// // // // // // //           subtitle={`${stats.incidents_resolus} résolus`}
// // // // // // //         />
        
// // // // // // //         <StatCard
// // // // // // //           title="Coût"
// // // // // // //           value={formatCurrency(stats.cout_total_reparations)}
// // // // // // //           icon={DollarSign}
// // // // // // //           color="green-600"
// // // // // // //           subtitle={`${stats.reparations_ce_mois} réparations`}
// // // // // // //         />
// // // // // // //       </div>

// // // // // // //       {/* Graphiques et Synthèse */}
// // // // // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // // // // // //         {/* Matériels par Service - AVEC COULEURS FIXES */}
// // // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <Users className="h-5 w-5 mr-2" />
// // // // // // //               Matériels par Service
// // // // // // //               <span className="badge badge-primary ml-2">
// // // // // // //                 {Object.keys(stats.materiels_par_service).length} services
// // // // // // //               </span>
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <BarChart data={chartData.materielsService}>
// // // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // // //                 <XAxis 
// // // // // // //                   dataKey="service" 
// // // // // // //                   stroke="#9CA3AF"
// // // // // // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // // // // // //                   angle={-45}
// // // // // // //                   textAnchor="end"
// // // // // // //                   height={60}
// // // // // // //                 />
// // // // // // //                 <YAxis 
// // // // // // //                   stroke="#9CA3AF"
// // // // // // //                   tick={{ fill: '#9CA3AF' }}
// // // // // // //                 />
// // // // // // //                 <Tooltip 
// // // // // // //                   contentStyle={{ 
// // // // // // //                     backgroundColor: '#1F2937', 
// // // // // // //                     borderColor: '#374151', 
// // // // // // //                     color: '#F9FAFB',
// // // // // // //                     borderRadius: '8px',
// // // // // // //                     padding: '10px'
// // // // // // //                   }}
// // // // // // //                   formatter={(value) => [`${value} matériels`, 'Quantité']}
// // // // // // //                   labelFormatter={(label) => `Service: ${chartData.materielsService.find(s => s.service === label)?.originalService || label}`}
// // // // // // //                 />
// // // // // // //                 <Legend />
// // // // // // //                 <Bar 
// // // // // // //                   dataKey="count" 
// // // // // // //                   name="Matériels"
// // // // // // //                   radius={[4, 4, 0, 0]}
// // // // // // //                 >
// // // // // // //                   {chartData.materielsService.map((entry, index) => (
// // // // // // //                     <Cell 
// // // // // // //                       key={`cell-${index}`} 
// // // // // // //                       fill={entry.fill}
// // // // // // //                       stroke={entry.fill}
// // // // // // //                       strokeWidth={1}
// // // // // // //                     />
// // // // // // //                   ))}
// // // // // // //                 </Bar>
// // // // // // //               </BarChart>
// // // // // // //             </ResponsiveContainer>
            
// // // // // // //             {/* Légende des couleurs FIXES */}
// // // // // // //             <div className="mt-4">
// // // // // // //               <p className="text-sm font-medium text-base-content mb-2">Légende des services:</p>
// // // // // // //               <div className="flex flex-wrap gap-2">
// // // // // // //                 {chartData.materielsService.map((entry, index) => (
// // // // // // //                   <div 
// // // // // // //                     key={index} 
// // // // // // //                     className="flex items-center gap-1 px-2 py-1 bg-base-200 rounded"
// // // // // // //                   >
// // // // // // //                     <div 
// // // // // // //                       className="w-3 h-3 rounded"
// // // // // // //                       style={{ backgroundColor: entry.fill }}
// // // // // // //                     />
// // // // // // //                     <span className="text-xs text-base-content">
// // // // // // //                       {entry.originalService}
// // // // // // //                     </span>
// // // // // // //                   </div>
// // // // // // //                 ))}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* SYSTHÈSE DES DONNÉES - CORRIGÉ */}
// // // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <Database className="h-5 w-5 mr-2" />
// // // // // // //               Synthèse des Données
// // // // // // //               <span className="badge badge-info ml-2">Indicateurs clés</span>
// // // // // // //             </h3>
            
// // // // // // //             <div className="space-y-3">
// // // // // // //               {chartData.syntheseData.map((item, index) => (
// // // // // // //                 <SyntheseItem
// // // // // // //                   key={index}
// // // // // // //                   label={item.label}
// // // // // // //                   value={item.value}
// // // // // // //                   icon={item.icon}
// // // // // // //                   color={item.color}
// // // // // // //                   description={item.description}
// // // // // // //                 />
// // // // // // //               ))}
// // // // // // //             </div>
            
// // // // // // //             {/* Taux de performance */}
// // // // // // //             <div className="mt-6 p-4 bg-base-200 rounded-lg">
// // // // // // //               <h4 className="font-medium text-base-content mb-2">Taux de performance</h4>
// // // // // // //               <div className="space-y-2">
// // // // // // //                 <div>
// // // // // // //                   <div className="flex justify-between text-sm text-base-content mb-1">
// // // // // // //                     <span>Fonctionnalité matériels</span>
// // // // // // //                     <span className="font-semibold">
// // // // // // //                       {stats.total_materiels > 0 
// // // // // // //                         ? `${((stats.materiels_fonctionnels / stats.total_materiels) * 100).toFixed(1)}%`
// // // // // // //                         : '0%'}
// // // // // // //                     </span>
// // // // // // //                   </div>
// // // // // // //                   <div className="w-full bg-base-300 rounded-full h-2">
// // // // // // //                     <div 
// // // // // // //                       className="bg-success h-2 rounded-full"
// // // // // // //                       style={{ 
// // // // // // //                         width: `${stats.total_materiels > 0 
// // // // // // //                           ? (stats.materiels_fonctionnels / stats.total_materiels) * 100 
// // // // // // //                           : 0}%` 
// // // // // // //                       }}
// // // // // // //                     />
// // // // // // //                   </div>
// // // // // // //                 </div>
                
// // // // // // //                 <div>
// // // // // // //                   <div className="flex justify-between text-sm text-base-content mb-1">
// // // // // // //                     <span>Résolution incidents</span>
// // // // // // //                     <span className="font-semibold">
// // // // // // //                       {stats.incidents_ouverts + stats.incidents_resolus > 0
// // // // // // //                         ? `${((stats.incidents_resolus / (stats.incidents_ouverts + stats.incidents_resolus)) * 100).toFixed(1)}%`
// // // // // // //                         : '100%'}
// // // // // // //                     </span>
// // // // // // //                   </div>
// // // // // // //                   <div className="w-full bg-base-300 rounded-full h-2">
// // // // // // //                     <div 
// // // // // // //                       className="bg-success h-2 rounded-full"
// // // // // // //                       style={{ 
// // // // // // //                         width: `${stats.incidents_ouverts + stats.incidents_resolus > 0
// // // // // // //                           ? (stats.incidents_resolus / (stats.incidents_ouverts + stats.incidents_resolus)) * 100 
// // // // // // //                           : 100}%` 
// // // // // // //                       }}
// // // // // // //                     />
// // // // // // //                   </div>
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* État des matériels */}
// // // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <PieChartIcon className="h-5 w-5 mr-2" />
// // // // // // //               État des Matériels
// // // // // // //             </h3>
// // // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // // //               <PieChart>
// // // // // // //                 <Pie
// // // // // // //                   data={chartData.materielsEtat}
// // // // // // //                   cx="50%"
// // // // // // //                   cy="50%"
// // // // // // //                   labelLine={false}
// // // // // // //                   label={({ name, value }) => `${name}: ${value}`}
// // // // // // //                   outerRadius={80}
// // // // // // //                   dataKey="value"
// // // // // // //                 >
// // // // // // //                   {chartData.materielsEtat.map((entry, index) => (
// // // // // // //                     <Cell key={`cell-${index}`} fill={entry.color} />
// // // // // // //                   ))}
// // // // // // //                 </Pie>
// // // // // // //                 <Tooltip />
// // // // // // //                 <Legend />
// // // // // // //               </PieChart>
// // // // // // //             </ResponsiveContainer>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // //       //   {/* Alertes par Sévérité */}
// // // // // //       //   <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //       //     <div className="card-body">
// // // // // //       //       <h3 className="card-title text-base-content">
// // // // // //       //         <Shield className="h-5 w-5 mr-2" />
// // // // // //       //         Alertes par Sévérité
// // // // // //       //       </h3>
// // // // // //       //       <ResponsiveContainer width="100%" height={300}>
// // // // // //       //         <BarChart data={chartData.alertesSeverite}>
// // // // // //       //           <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // //       //           <XAxis dataKey="severite" stroke="#9CA3AF" />
// // // // // //       //           <YAxis stroke="#9CA3AF" />
// // // // // //       //           <Tooltip 
// // // // // //       //             contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // //       //             formatter={(value) => [`${value} alertes`, 'Quantité']}
// // // // // //       //           />
// // // // // //       //           <Legend />
// // // // // //       //           <Bar 
// // // // // //       //             dataKey="count" 
// // // // // //       //             name="Alertes"
// // // // // //       //             radius={[4, 4, 0, 0]}
// // // // // //       //           >
// // // // // //       //             {chartData.alertesSeverite.map((entry, index) => (
// // // // // //       //               <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // //       //             ))}
// // // // // //       //           </Bar>
// // // // // //       //         </BarChart>
// // // // // //       //       </ResponsiveContainer>
// // // // // //       //     </div>
// // // // // //       //   </div>
// // // // // //       // </div>

// // // // // // //       {/* Informations système */}
// // // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // // // // //         <div className="card bg-base-200 border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <Info className="h-5 w-5 mr-2" />
// // // // // // //               Informations système
// // // // // // //             </h3>
// // // // // // //             <div className="space-y-2 text-sm">
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium text-base-content">Données chargées:</span>
// // // // // // //                 <span className="text-base-content">
// // // // // // //                   {safeArray(materiels).length} matériels • {safeArray(incidents).length} incidents
// // // // // // //                 </span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium text-base-content">Services:</span>
// // // // // // //                 <span className="text-base-content">
// // // // // // //                   {Object.keys(stats.materiels_par_service).length} services
// // // // // // //                 </span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between">
// // // // // // //                 <span className="font-medium text-base-content">Utilisateur:</span>
// // // // // // //                 <span className="text-base-content">{user?.nom_complet || user?.username || 'Non connecté'}</span>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
        
// // // // // // //         <div className="card bg-base-200 border border-base-300">
// // // // // // //           <div className="card-body">
// // // // // // //             <h3 className="card-title text-base-content">
// // // // // // //               <BellIcon className="h-5 w-5 mr-2" />
// // // // // // //               Aperçu des données
// // // // // // //             </h3>
// // // // // // //             <div className="space-y-2 text-sm">
// // // // // // //               <div className="flex justify-between items-center p-2 bg-base-300 rounded">
// // // // // // //                 <span className="text-base-content">Matériels fonctionnels:</span>
// // // // // // //                 <span className="badge badge-success">{stats.materiels_fonctionnels}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between items-center p-2 bg-base-300 rounded">
// // // // // // //                 <span className="text-base-content">Incidents résolus:</span>
// // // // // // //                 <span className="badge badge-success">{stats.incidents_resolus}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between items-center p-2 bg-base-300 rounded">
// // // // // // //                 <span className="text-base-content">Alertes critiques:</span>
// // // // // // //                 <span className="badge badge-error">{stats.alertes_critiques}</span>
// // // // // // //               </div>
// // // // // // //               <div className="flex justify-between items-center p-2 bg-base-300 rounded">
// // // // // // //                 <span className="text-base-content">Réparations ce mois:</span>
// // // // // // //                 <span className="badge badge-info">{stats.reparations_ce_mois}</span>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // Fonction pour convertir une image en base64
// // // // // // // const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
// // // // // // //   const img = new Image();
// // // // // // //   img.crossOrigin = 'Anonymous';
// // // // // // //   img.onload = () => {
// // // // // // //     const canvas = document.createElement('canvas');
// // // // // // //     const ctx = canvas.getContext('2d');
// // // // // // //     canvas.width = img.width;
// // // // // // //     canvas.height = img.height;
// // // // // // //     ctx.drawImage(img, 0, 0);
// // // // // // //     resolve(canvas.toDataURL('image/jpeg'));
// // // // // // //   };
// // // // // // //   img.onerror = reject;
// // // // // // //   img.src = imgUrl;
// // // // // // // });

// // // // // // // export default Dashboard;;

// // // // // // // src/pages/Dashboard.jsx - VERSION COMPLÈTE AMÉLIORÉE
// // // // // // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // // // // // import { 
// // // // // //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// // // // // //   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
// // // // // //   AreaChart, Area
// // // // // // } from 'recharts';
// // // // // // import { 
// // // // // //   BarChart3, RefreshCw, Users, 
// // // // // //   Eye, AlertTriangle, CheckCircle, XCircle, 
// // // // // //   Database, Bell, Package, 
// // // // // //   Network, Wrench,
// // // // // //   PieChart as PieChartIcon,
// // // // // //   LineChart as LineChartIcon, Info, 
// // // // // //   Bell as BellIcon, Shield, DollarSign,
// // // // // //   Clock, AlertCircle,
// // // // // //   HardDrive, Laptop, Check,
// // // // // //   Server, Router, Cpu, Activity,
// // // // // //   FileText, Download, Printer,
// // // // // //   Monitor, Smartphone, Cloud,
// // // // // //   ShieldAlert, TrendingUp, TrendingDown
// // // // // // } from 'lucide-react';
// // // // // // import { 
// // // // // //   materielsAPI, 
// // // // // //   incidentsAPI, 
// // // // // //   reparationsAPI, 
// // // // // //   logicielsAPI, 
// // // // // //   alertesAPI, 
// // // // // //   fournisseursAPI, 
// // // // // //   reseauAPI 
// // // // // // } from '../services/api';
// // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // import { useNotification } from '../context/NotificationContext';
// // // // // // import jsPDF from 'jspdf';
// // // // // // import autoTable from 'jspdf-autotable';

// // // // // // // Import du logo
// // // // // // import logoDren from '../assets/images/logo-dren.jpeg';

// // // // // // // COULEURS FIXES POUR CHAQUE SERVICE
// // // // // // const SERVICE_COLORS = {
// // // // // //   'Secrétariat': '#3b82f6',      // Bleu
// // // // // //   'Direction': '#8b5cf6',        // Violet
// // // // // //   'Informatique': '#10b981',     // Vert
// // // // // //   'Archives': '#f59e0b',         // Orange
// // // // // //   'Administration': '#ef4444',   // Rouge
// // // // // //   'Finance': '#06b6d4',          // Cyan
// // // // // //   'Communication': '#ec4899',    // Rose
// // // // // //   'Maintenance': '#84cc16',      // Vert clair
// // // // // //   'Sécurité': '#f97316',         // Orange vif
// // // // // //   'Commercial': '#8b5cf6',       // Violet
// // // // // //   'Marketing': '#ec4899',        // Rose
// // // // // //   'Production': '#10b981',       // Vert
// // // // // //   'Logistique': '#f59e0b',       // Orange
// // // // // //   'Qualité': '#06b6d4',          // Cyan
// // // // // //   'R&D': '#3b82f6',              // Bleu
// // // // // //   'Support': '#84cc16',          // Vert clair
// // // // // //   'Service Client': '#06b6d4',   // Cyan
// // // // // //   'Non assigné': '#9ca3af',      // Gris
// // // // // //   'Autre': '#6b7280',            // Gris foncé
// // // // // // };

// // // // // // const getServiceColor = (serviceName) => {
// // // // // //   if (!serviceName) return SERVICE_COLORS['Non assigné'];
  
// // // // // //   const name = serviceName.trim().toLowerCase();
  
// // // // // //   for (const [key, color] of Object.entries(SERVICE_COLORS)) {
// // // // // //     if (name === key.toLowerCase()) {
// // // // // //       return color;
// // // // // //     }
// // // // // //   }
  
// // // // // //   for (const [key, color] of Object.entries(SERVICE_COLORS)) {
// // // // // //     if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name)) {
// // // // // //       return color;
// // // // // //     }
// // // // // //   }
  
// // // // // //   return SERVICE_COLORS['Autre'];
// // // // // // };

// // // // // // const Dashboard = () => {
// // // // // //   const { user } = useAuth();
// // // // // //   const { showNotification } = useNotification();
  
// // // // // //   // États principaux
// // // // // //   const [stats, setStats] = useState({
// // // // // //     // Matériels
// // // // // //     total_materiels: 0,
// // // // // //     materiels_fonctionnels: 0,
// // // // // //     materiels_en_panne: 0,
// // // // // //     materiels_maintenance: 0,
// // // // // //     materiels_par_service: {},
// // // // // //     materiels_par_type: {},
    
// // // // // //     // Logiciels
// // // // // //     total_logiciels: 0,
// // // // // //     logiciels_actifs: 0,
// // // // // //     logiciels_installes: 0,
// // // // // //     logiciels_expires: 0,
// // // // // //     logiciels_par_categorie: {},
    
// // // // // //     // Incidents & Réparations
// // // // // //     incidents_ouverts: 0,
// // // // // //     incidents_resolus: 0,
// // // // // //     incidents_par_priorite: {},
// // // // // //     incidents_evolution: [],
// // // // // //     reparations_ce_mois: 0,
// // // // // //     cout_total_reparations: 0,
    
// // // // // //     // Alertes
// // // // // //     alertes_actives: 0,
// // // // // //     alertes_critiques: 0,
// // // // // //     alertes_panne: 0,
// // // // // //     alertes_maintenance: 0,
// // // // // //     alertes_par_type: {},
    
// // // // // //     // Réseau
// // // // // //     total_equipements_reseau: 0,
// // // // // //     reseau_fonctionnel: 0,
// // // // // //     reseau_panne: 0,
// // // // // //     reseau_par_type: {},
    
// // // // // //     // Synthèse
// // // // // //     taux_disponibilite: 0,
// // // // // //     taux_resolution: 0,
// // // // // //     cout_moyen_reparation: 0,
// // // // // //   });
  
// // // // // //   // États pour les données
// // // // // //   const [materiels, setMateriels] = useState([]);
// // // // // //   const [incidents, setIncidents] = useState([]);
// // // // // //   const [reparations, setReparations] = useState([]);
// // // // // //   const [logiciels, setLogiciels] = useState([]);
// // // // // //   const [alertes, setAlertes] = useState([]);
// // // // // //   const [fournisseurs, setFournisseurs] = useState([]);
// // // // // //   const [reseau, setReseau] = useState([]);
  
// // // // // //   // États UI
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [autoRefresh, setAutoRefresh] = useState(false);
// // // // // //   const [lastUpdate, setLastUpdate] = useState(null);
// // // // // //   const [viewMode, setViewMode] = useState('overview'); // overview, detailed, analytics

// // // // // //   // Fonctions helper
// // // // // //   const safeArray = (data) => Array.isArray(data) ? data : [];
// // // // // //   const safeFilter = (array, condition) => array?.filter?.(condition) || [];
// // // // // //   const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

// // // // // //   // Charger les données
// // // // // //   const loadData = useCallback(async () => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       console.log('📊 Chargement des données dashboard...');

// // // // // //       const requests = [
// // // // // //         { key: 'materiels', api: materielsAPI.getAll },
// // // // // //         { key: 'incidents', api: incidentsAPI.getAll },
// // // // // //         { key: 'reparations', api: reparationsAPI.getAll },
// // // // // //         { key: 'logiciels', api: logicielsAPI.getAll },
// // // // // //         { key: 'alertes', api: alertesAPI.getAll },
// // // // // //         { key: 'fournisseurs', api: fournisseursAPI.getAll },
// // // // // //         { key: 'reseau', api: reseauAPI.getAll },
// // // // // //       ];

// // // // // //       const results = {};

// // // // // //       for (const req of requests) {
// // // // // //         try {
// // // // // //           const response = await req.api();
// // // // // //           results[req.key] = extractData(response);
// // // // // //           console.log(`✅ ${req.key}: ${results[req.key].length} entrées`);
// // // // // //         } catch (error) {
// // // // // //           console.error(`❌ ${req.key}:`, error);
// // // // // //           results[req.key] = [];
// // // // // //         }
// // // // // //       }

// // // // // //       // Mettre à jour les états
// // // // // //       setMateriels(safeArray(results.materiels));
// // // // // //       setIncidents(safeArray(results.incidents));
// // // // // //       setReparations(safeArray(results.reparations));
// // // // // //       setLogiciels(safeArray(results.logiciels));
// // // // // //       setAlertes(safeArray(results.alertes));
// // // // // //       setFournisseurs(safeArray(results.fournisseurs));
// // // // // //       setReseau(safeArray(results.reseau));

// // // // // //       // Calculer les statistiques
// // // // // //       calculateAdvancedStats(results);
      
// // // // // //       // Vérifier les alertes pour matériels en panne
// // // // // //       checkAlertesMateriels(results.materiels);
      
// // // // // //       setLastUpdate(new Date());
// // // // // //       showNotification('Tableau de bord actualisé', 'success');

// // // // // //     } catch (error) {
// // // // // //       console.error('❌ Erreur générale:', error);
// // // // // //       showNotification('Erreur lors du chargement', 'error');
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   }, [showNotification]);

// // // // // //   // Vérifier les alertes pour matériels en panne
// // // // // //   const checkAlertesMateriels = useCallback((materielsData) => {
// // // // // //     const materielsEnPanne = safeFilter(materielsData, m => {
// // // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // // //       return etat.includes('panne') || 
// // // // // //              etat.includes('défectueux') || 
// // // // // //              etat.includes('hors service') ||
// // // // // //              etat.includes('non fonctionnel') ||
// // // // // //              etat === 'mauvais' ||
// // // // // //              etat === 'bad';
// // // // // //     });

// // // // // //     const materielsEnMaintenance = safeFilter(materielsData, m => {
// // // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // // //       return etat.includes('maintenance') || 
// // // // // //              etat.includes('réparation') || 
// // // // // //              etat.includes('en réparation');
// // // // // //     });

// // // // // //     // Générer des alertes si nécessaire
// // // // // //     if (materielsEnPanne.length > 0 || materielsEnMaintenance.length > 0) {
// // // // // //       console.log('⚠️ Vérification des alertes matériels:', {
// // // // // //         panne: materielsEnPanne.length,
// // // // // //         maintenance: materielsEnMaintenance.length
// // // // // //       });
// // // // // //     }
// // // // // //   }, []);

// // // // // //   // Calculer les statistiques
// // // // // //   const calculateAdvancedStats = useCallback((results) => {
// // // // // //     // Matériels par service
// // // // // //     const materielsParService = safeReduce(results.materiels, (acc, m) => {
// // // // // //       const service = m.service || m.departement || m.service_attribue || m.direction || 'Non assigné';
// // // // // //       acc[service] = (acc[service] || 0) + 1;
// // // // // //       return acc;
// // // // // //     }, {});

// // // // // //     // Matériels par type
// // // // // //     const materielsParType = safeReduce(results.materiels, (acc, m) => {
// // // // // //       const type = m.type || m.categorie || 'Non spécifié';
// // // // // //       acc[type] = (acc[type] || 0) + 1;
// // // // // //       return acc;
// // // // // //     }, {});

// // // // // //     // Matériels fonctionnels
// // // // // //     const materielsFonctionnels = safeFilter(results.materiels, m => {
// // // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // // //       return etat.includes('fonctionnel') || 
// // // // // //              etat.includes('actif') || 
// // // // // //              etat.includes('opérationnel') ||
// // // // // //              etat.includes('en service') ||
// // // // // //              etat === 'bon' ||
// // // // // //              etat === 'good';
// // // // // //     }).length;

// // // // // //     // Matériels en panne
// // // // // //     const materielsEnPanne = safeFilter(results.materiels, m => {
// // // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // // //       return etat.includes('panne') || 
// // // // // //              etat.includes('défectueux') || 
// // // // // //              etat.includes('hors service') ||
// // // // // //              etat.includes('non fonctionnel') ||
// // // // // //              etat === 'mauvais' ||
// // // // // //              etat === 'bad';
// // // // // //     }).length;

// // // // // //     // Matériels en maintenance
// // // // // //     const materielsMaintenance = safeFilter(results.materiels, m => {
// // // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // // //       return etat.includes('maintenance') || 
// // // // // //              etat.includes('réparation') || 
// // // // // //              etat.includes('en réparation');
// // // // // //     }).length;

// // // // // //     // Logiciels installés (considérés comme actifs)
// // // // // //     const logicielsInstalles = safeFilter(results.logiciels, l => {
// // // // // //       const statut = (l.statut || '').toString().toLowerCase();
// // // // // //       const etat = (l.etat || '').toString().toLowerCase();
// // // // // //       return statut.includes('installé') || 
// // // // // //              statut.includes('installe') ||
// // // // // //              statut.includes('actif') ||
// // // // // //              etat.includes('installé') ||
// // // // // //              etat.includes('actif') ||
// // // // // //              l.licence_active === true ||
// // // // // //              l.licence_active === 'true';
// // // // // //     }).length;

// // // // // //     // Logiciels par catégorie
// // // // // //     const logicielsParCategorie = safeReduce(results.logiciels, (acc, l) => {
// // // // // //       const categorie = l.categorie || l.type || 'Autre';
// // // // // //       acc[categorie] = (acc[categorie] || 0) + 1;
// // // // // //       return acc;
// // // // // //     }, {});

// // // // // //     // Incidents par priorité
// // // // // //     const incidentsParPriorite = safeReduce(results.incidents, (acc, i) => {
// // // // // //       const priorite = i.priorite || 'moyenne';
// // // // // //       acc[priorite] = (acc[priorite] || 0) + 1;
// // // // // //       return acc;
// // // // // //     }, {});

// // // // // //     // Évolution des incidents (derniers 30 jours)
// // // // // //     const incidentsParJour = {};
// // // // // //     const now = new Date();
// // // // // //     const last30Days = Array.from({ length: 30 }, (_, i) => {
// // // // // //       const date = new Date(now);
// // // // // //       date.setDate(date.getDate() - (29 - i));
// // // // // //       return date.toISOString().split('T')[0];
// // // // // //     });

// // // // // //     safeArray(results.incidents).forEach(incident => {
// // // // // //       const dateStr = incident.date_creation || incident.date || incident.created_at;
// // // // // //       if (dateStr) {
// // // // // //         try {
// // // // // //           const date = new Date(dateStr).toISOString().split('T')[0];
// // // // // //           if (last30Days.includes(date)) {
// // // // // //             incidentsParJour[date] = (incidentsParJour[date] || 0) + 1;
// // // // // //           }
// // // // // //         } catch (e) {
// // // // // //           console.warn('Date invalide:', dateStr);
// // // // // //         }
// // // // // //       }
// // // // // //     });

// // // // // //     const incidentsEvolution = last30Days.map(date => ({
// // // // // //       date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
// // // // // //       incidents: incidentsParJour[date] || 0
// // // // // //     }));

// // // // // //     // Alertes par type
// // // // // //     const alertesParType = safeReduce(results.alertes, (acc, a) => {
// // // // // //       const type = a.type_alerte || a.type || 'Autre';
// // // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // // //       const isActive = statut.includes('nouvelle') || 
// // // // // //                        statut.includes('en_traitement') || 
// // // // // //                        statut.includes('active') ||
// // // // // //                        !statut;
// // // // // //       if (isActive) {
// // // // // //         acc[type] = (acc[type] || 0) + 1;
// // // // // //       }
// // // // // //       return acc;
// // // // // //     }, {});

// // // // // //     // Alertes panne (basées sur les matériels)
// // // // // //     const alertesPanne = safeFilter(results.alertes, a => {
// // // // // //       const type = (a.type_alerte || '').toString().toLowerCase();
// // // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // // //       const isActive = statut.includes('nouvelle') || 
// // // // // //                        statut.includes('en_traitement') || 
// // // // // //                        statut.includes('active') ||
// // // // // //                        !statut;
// // // // // //       return isActive && (type.includes('panne') || type.includes('matériel'));
// // // // // //     }).length;

// // // // // //     // Alertes maintenance
// // // // // //     const alertesMaintenance = safeFilter(results.alertes, a => {
// // // // // //       const type = (a.type_alerte || '').toString().toLowerCase();
// // // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // // //       const isActive = statut.includes('nouvelle') || 
// // // // // //                        statut.includes('en_traitement') || 
// // // // // //                        statut.includes('active') ||
// // // // // //                        !statut;
// // // // // //       return isActive && type.includes('maintenance');
// // // // // //     }).length;

// // // // // //     // Équipements réseau
// // // // // //     const equipementsReseau = safeArray(results.reseau);
// // // // // //     const reseauParType = safeReduce(equipementsReseau, (acc, r) => {
// // // // // //       const type = r.type || r.categorie || 'Autre';
// // // // // //       acc[type] = (acc[type] || 0) + 1;
// // // // // //       return acc;
// // // // // //     }, {});

// // // // // //     const reseauFonctionnel = safeFilter(equipementsReseau, r => {
// // // // // //       const etat = (r.etat || '').toString().toLowerCase();
// // // // // //       const statut = (r.statut || '').toString().toLowerCase();
// // // // // //       return etat.includes('fonctionnel') || 
// // // // // //              etat.includes('actif') ||
// // // // // //              statut.includes('actif') ||
// // // // // //              statut.includes('fonctionnel');
// // // // // //     }).length;

// // // // // //     const reseauPanne = safeFilter(equipementsReseau, r => {
// // // // // //       const etat = (r.etat || '').toString().toLowerCase();
// // // // // //       return etat.includes('panne') || 
// // // // // //              etat.includes('défectueux') ||
// // // // // //              etat.includes('hors service');
// // // // // //     }).length;

// // // // // //     // Calcul des taux
// // // // // //     const tauxDisponibilite = materielsFonctionnels > 0 ? 
// // // // // //       (materielsFonctionnels / safeArray(results.materiels).length * 100).toFixed(1) : 0;

// // // // // //     const incidentsTotal = safeArray(results.incidents).length;
// // // // // //     const incidentsResolus = safeFilter(results.incidents, i => {
// // // // // //       const statut = (i.statut || '').toString().toLowerCase();
// // // // // //       return statut.includes('résolu') || 
// // // // // //              statut.includes('fermé') ||
// // // // // //              statut.includes('traité');
// // // // // //     }).length;

// // // // // //     const tauxResolution = incidentsTotal > 0 ? 
// // // // // //       (incidentsResolus / incidentsTotal * 100).toFixed(1) : 100;

// // // // // //     const coutTotal = safeReduce(results.reparations, (sum, r) => 
// // // // // //       sum + (parseFloat(r.cout) || 0), 0
// // // // // //     );
// // // // // //     const nbReparations = safeArray(results.reparations).length;
// // // // // //     const coutMoyen = nbReparations > 0 ? Math.round(coutTotal / nbReparations) : 0;

// // // // // //     const calculatedStats = {
// // // // // //       // Matériels
// // // // // //       total_materiels: safeArray(results.materiels).length,
// // // // // //       materiels_fonctionnels: materielsFonctionnels,
// // // // // //       materiels_en_panne: materielsEnPanne,
// // // // // //       materiels_maintenance: materielsMaintenance,
// // // // // //       materiels_par_service: materielsParService,
// // // // // //       materiels_par_type: materielsParType,
      
// // // // // //       // Logiciels
// // // // // //       total_logiciels: safeArray(results.logiciels).length,
// // // // // //       logiciels_actifs: logicielsInstalles,
// // // // // //       logiciels_installes: logicielsInstalles,
// // // // // //       logiciels_expires: safeFilter(results.logiciels, l => {
// // // // // //         const expiry = l.date_expiration || l.licence_expire || l.date_fin;
// // // // // //         return expiry && new Date(expiry) < new Date();
// // // // // //       }).length,
// // // // // //       logiciels_par_categorie: logicielsParCategorie,
      
// // // // // //       // Incidents
// // // // // //       incidents_ouverts: safeFilter(results.incidents, i => {
// // // // // //         const statut = (i.statut || '').toString().toLowerCase();
// // // // // //         return statut.includes('ouvert') || 
// // // // // //                statut.includes('en cours') ||
// // // // // //                !statut.includes('résolu') &&
// // // // // //                !statut.includes('fermé');
// // // // // //       }).length,
// // // // // //       incidents_resolus: incidentsResolus,
// // // // // //       incidents_par_priorite: incidentsParPriorite,
// // // // // //       incidents_evolution: incidentsEvolution,
      
// // // // // //       // Réparations
// // // // // //       reparations_ce_mois: safeFilter(results.reparations, r => {
// // // // // //         const date = r.date_reparation || r.date_debut || r.date;
// // // // // //         if (!date) return false;
// // // // // //         try {
// // // // // //           const repDate = new Date(date);
// // // // // //           const now = new Date();
// // // // // //           return repDate.getMonth() === now.getMonth() && 
// // // // // //                  repDate.getFullYear() === now.getFullYear();
// // // // // //         } catch {
// // // // // //           return false;
// // // // // //         }
// // // // // //       }).length,
// // // // // //       cout_total_reparations: coutTotal,
// // // // // //       cout_moyen_reparation: coutMoyen,
      
// // // // // //       // Alertes
// // // // // //       alertes_actives: safeFilter(results.alertes, a => {
// // // // // //         const statut = (a.statut || '').toString().toLowerCase();
// // // // // //         return statut.includes('nouvelle') || 
// // // // // //                statut.includes('en_traitement') || 
// // // // // //                statut.includes('active') ||
// // // // // //                !statut;
// // // // // //       }).length,
// // // // // //       alertes_critiques: safeFilter(results.alertes, a => {
// // // // // //         const severite = (a.severite || '').toString().toLowerCase();
// // // // // //         const statut = (a.statut || '').toString().toLowerCase();
// // // // // //         const isActive = statut.includes('nouvelle') || 
// // // // // //                          statut.includes('en_traitement') || 
// // // // // //                          statut.includes('active') ||
// // // // // //                          !statut;
// // // // // //         return isActive && (severite.includes('critique') || severite.includes('haute'));
// // // // // //       }).length,
// // // // // //       alertes_panne: alertesPanne,
// // // // // //       alertes_maintenance: alertesMaintenance,
// // // // // //       alertes_par_type: alertesParType,
      
// // // // // //       // Réseau
// // // // // //       total_equipements_reseau: equipementsReseau.length,
// // // // // //       reseau_fonctionnel: reseauFonctionnel,
// // // // // //       reseau_panne: reseauPanne,
// // // // // //       reseau_par_type: reseauParType,
      
// // // // // //       // Synthèse
// // // // // //       taux_disponibilite: parseFloat(tauxDisponibilite),
// // // // // //       taux_resolution: parseFloat(tauxResolution),
// // // // // //       cout_moyen_reparation: coutMoyen,
// // // // // //     };

// // // // // //     console.log('📊 Statistiques calculées:', calculatedStats);
// // // // // //     setStats(calculatedStats);
// // // // // //   }, []);

// // // // // //   // Auto-refresh
// // // // // //   useEffect(() => {
// // // // // //     loadData();
    
// // // // // //     if (autoRefresh) {
// // // // // //       const interval = setInterval(() => {
// // // // // //         loadData();
// // // // // //       }, 30000);
// // // // // //       return () => clearInterval(interval);
// // // // // //     }
// // // // // //   }, [loadData, autoRefresh]);

// // // // // //   // Données pour les graphiques
// // // // // //   const chartData = useMemo(() => {
// // // // // //     // Matériels par Service avec services spécifiques
// // // // // //     const servicesSpecifiques = ['Secrétariat', 'Direction', 'Informatique', 'Archives'];
// // // // // //     const servicesAvecCouleurs = servicesSpecifiques.map(service => {
// // // // // //       const count = stats.materiels_par_service[service] || 0;
// // // // // //       return {
// // // // // //         service: service,
// // // // // //         count: count,
// // // // // //         fill: getServiceColor(service),
// // // // // //         color: getServiceColor(service)
// // // // // //       };
// // // // // //     }).filter(item => item.count > 0);

// // // // // //     // Si pas assez de données, ajouter d'autres services
// // // // // //     if (servicesAvecCouleurs.length < 4) {
// // // // // //       const autresServices = Object.entries(stats.materiels_par_service)
// // // // // //         .filter(([service]) => !servicesSpecifiques.includes(service))
// // // // // //         .sort(([,a], [,b]) => b - a)
// // // // // //         .slice(0, 4 - servicesAvecCouleurs.length)
// // // // // //         .map(([service, count]) => ({
// // // // // //           service: service.length > 15 ? service.substring(0, 15) + '...' : service,
// // // // // //           originalService: service,
// // // // // //           count,
// // // // // //           fill: getServiceColor(service),
// // // // // //           color: getServiceColor(service)
// // // // // //         }));
      
// // // // // //       servicesAvecCouleurs.push(...autresServices);
// // // // // //     }

// // // // // //     // Données pour Synthèse
// // // // // //     const syntheseData = [
// // // // // //       {
// // // // // //         label: 'Matériels fonctionnels',
// // // // // //         value: stats.materiels_fonctionnels,
// // // // // //         icon: Check,
// // // // // //         color: 'success',
// // // // // //         description: `${stats.materiels_fonctionnels} / ${stats.total_materiels}`
// // // // // //       },
// // // // // //       {
// // // // // //         label: 'Incidents résolus',
// // // // // //         value: stats.incidents_resolus,
// // // // // //         icon: CheckCircle,
// // // // // //         color: 'success',
// // // // // //         description: `sur ${stats.incidents_ouverts + stats.incidents_resolus} total`
// // // // // //       },
// // // // // //       {
// // // // // //         label: 'Alertes critiques',
// // // // // //         value: stats.alertes_critiques,
// // // // // //         icon: AlertCircle,
// // // // // //         color: 'error',
// // // // // //         description: `${stats.alertes_panne} panne, ${stats.alertes_maintenance} maintenance`
// // // // // //       },
// // // // // //       {
// // // // // //         label: 'Réparations ce mois',
// // // // // //         value: stats.reparations_ce_mois,
// // // // // //         icon: Wrench,
// // // // // //         color: 'info',
// // // // // //         description: `Coût: ${new Intl.NumberFormat('fr-FR').format(stats.cout_total_reparations)} Ar`
// // // // // //       },
// // // // // //       {
// // // // // //         label: 'Logiciels installés',
// // // // // //         value: stats.logiciels_installes,
// // // // // //         icon: Package,
// // // // // //         color: 'success',
// // // // // //         description: `${stats.logiciels_installes} / ${stats.total_logiciels} actifs`
// // // // // //       },
// // // // // //     ];

// // // // // //     // Équipements réseau par type
// // // // // //     const reseauParTypeData = Object.entries(stats.reseau_par_type).map(([type, count]) => ({
// // // // // //       type: type,
// // // // // //       count: count,
// // // // // //       fill: getServiceColor(type)
// // // // // //     }));

// // // // // //     // Logiciels par catégorie
// // // // // //     const logicielsParCategorieData = Object.entries(stats.logiciels_par_categorie).map(([categorie, count]) => ({
// // // // // //       categorie: categorie,
// // // // // //       count: count,
// // // // // //       fill: getServiceColor(categorie)
// // // // // //     }));

// // // // // //     return {
// // // // // //       // Graphique Matériels par Service
// // // // // //       materielsService: servicesAvecCouleurs,
      
// // // // // //       // Données de synthèse
// // // // // //       syntheseData: syntheseData,
      
// // // // // //       // État des matériels
// // // // // //       materielsEtat: [
// // // // // //         { 
// // // // // //           name: 'Fonctionnel', 
// // // // // //           value: stats.materiels_fonctionnels, 
// // // // // //           color: '#10b981' 
// // // // // //         },
// // // // // //         { 
// // // // // //           name: 'En panne', 
// // // // // //           value: stats.materiels_en_panne, 
// // // // // //           color: '#ef4444' 
// // // // // //         },
// // // // // //         { 
// // // // // //           name: 'Maintenance', 
// // // // // //           value: stats.materiels_maintenance, 
// // // // // //           color: '#f59e0b' 
// // // // // //         },
// // // // // //         { 
// // // // // //           name: 'Autre', 
// // // // // //           value: Math.max(0, stats.total_materiels - stats.materiels_fonctionnels - stats.materiels_en_panne - stats.materiels_maintenance), 
// // // // // //           color: '#6b7280' 
// // // // // //         },
// // // // // //       ],
      
// // // // // //       // Évolution des incidents
// // // // // //       incidentsEvolution: stats.incidents_evolution || [],
      
// // // // // //       // Équipements réseau
// // // // // //       reseauParType: reseauParTypeData,
      
// // // // // //       // Logiciels par catégorie
// // // // // //       logicielsParCategorie: logicielsParCategorieData,
      
// // // // // //       // Incidents par priorité
// // // // // //       incidentsPriorite: Object.entries(stats.incidents_par_priorite).map(([priorite, count]) => ({
// // // // // //         priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
// // // // // //         count,
// // // // // //         fill: priorite === 'critique' ? '#ef4444' : 
// // // // // //               priorite === 'haute' ? '#f97316' : 
// // // // // //               priorite === 'moyenne' ? '#eab308' : '#22c55e'
// // // // // //       })),
      
// // // // // //       // Alertes par type
// // // // // //       alertesParType: Object.entries(stats.alertes_par_type).map(([type, count]) => ({
// // // // // //         type: type,
// // // // // //         count: count,
// // // // // //         fill: type.includes('panne') ? '#ef4444' : 
// // // // // //               type.includes('maintenance') ? '#f59e0b' : 
// // // // // //               type.includes('sécurité') ? '#8b5cf6' : '#3b82f6'
// // // // // //       })),
// // // // // //     };
// // // // // //   }, [stats]);

// // // // // //   // Fonction pour extraire les données des réponses API
// // // // // //   const extractData = (response) => {
// // // // // //     if (!response?.data) return [];
// // // // // //     if (Array.isArray(response.data)) return response.data;
// // // // // //     if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// // // // // //     if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// // // // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
// // // // // //     return [];
// // // // // //   };

// // // // // //   // Formater la devise
// // // // // //   const formatCurrency = (amount) => {
// // // // // //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// // // // // //   };

// // // // // //   // Générer rapport PDF
// // // // // //   const generateDetailedPDF = async () => {
// // // // // //     const doc = new jsPDF('landscape');
    
// // // // // //     try {
// // // // // //       const imgData = await getBase64Image(logoDren);
// // // // // //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// // // // // //     } catch (error) {
// // // // // //       console.warn('Logo non chargé');
// // // // // //     }
    
// // // // // //     doc.setFontSize(20);
// // // // // //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// // // // // //     doc.setFontSize(16);
// // // // // //     doc.text('TABLEAU DE BORD COMPLET', 20, 45);
    
// // // // // //     // Informations générales
// // // // // //     doc.setFontSize(12);
// // // // // //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
// // // // // //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 67);
    
// // // // // //     doc.setDrawColor(200, 200, 200);
// // // // // //     doc.line(20, 75, 190, 75);
    
// // // // // //     // Synthèse des données
// // // // // //     doc.setFontSize(14);
// // // // // //     doc.text('SYNTHÈSE DES DONNÉES', 20, 90);
    
// // // // // //     const syntheseStats = [
// // // // // //       ['Indicateur', 'Valeur', 'Détail'],
// // // // // //       ['Matériels fonctionnels', stats.materiels_fonctionnels.toString(), `${stats.total_materiels} total`],
// // // // // //       ['Incidents résolus', stats.incidents_resolus.toString(), `${stats.incidents_ouverts} ouverts`],
// // // // // //       ['Alertes critiques', stats.alertes_critiques.toString(), `${stats.alertes_actives} actives`],
// // // // // //       ['Réparations ce mois', stats.reparations_ce_mois.toString(), formatCurrency(stats.cout_total_reparations)],
// // // // // //       ['Logiciels installés', stats.logiciels_installes.toString(), `${stats.total_logiciels} total`],
// // // // // //       ['Équipements réseau', stats.total_equipements_reseau.toString(), `${stats.reseau_fonctionnel} fonctionnels`],
// // // // // //       ['Taux disponibilité', `${stats.taux_disponibilite}%`, 'Matériels'],
// // // // // //       ['Taux résolution', `${stats.taux_resolution}%`, 'Incidents'],
// // // // // //     ];
    
// // // // // //     autoTable(doc, {
// // // // // //       startY: 95,
// // // // // //       head: syntheseStats.slice(0, 1),
// // // // // //       body: syntheseStats.slice(1),
// // // // // //       theme: 'grid',
// // // // // //       headStyles: { fillColor: [59, 130, 246] },
// // // // // //     });
    
// // // // // //     doc.save(`dashboard-complet-${new Date().toISOString().split('T')[0]}.pdf`);
// // // // // //     showNotification('Rapport PDF généré avec succès', 'success');
// // // // // //   };

// // // // // //   // Composant StatCard
// // // // // //   const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
// // // // // //     <div className={`card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 relative`}>
// // // // // //       {trend && (
// // // // // //         <div className={`absolute -top-2 -right-2 badge badge-sm ${trend > 0 ? 'badge-success' : 'badge-error'}`}>
// // // // // //           {trend > 0 ? '+' : ''}{trend}%
// // // // // //         </div>
// // // // // //       )}
// // // // // //       <div className="card-body p-4">
// // // // // //         <div className="flex items-center justify-between">
// // // // // //           <div>
// // // // // //             <h3 className="text-sm font-semibold text-base-content opacity-70">{title}</h3>
// // // // // //             <p className="text-2xl font-bold mt-1 text-base-content">{value}</p>
// // // // // //             {subtitle && <p className="text-xs text-base-content opacity-60 mt-1">{subtitle}</p>}
// // // // // //           </div>
// // // // // //           <div className={`p-3 rounded-lg bg-${color}-100`}>
// // // // // //             <Icon className={`h-6 w-6 text-${color}-600`} />
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );

// // // // // //   // Composant SyntheseItem
// // // // // //   const SyntheseItem = ({ label, value, icon: Icon, color, description }) => (
// // // // // //     <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
// // // // // //       <div className="flex items-center gap-3">
// // // // // //         <div className={`p-2 rounded-lg bg-${color}-100`}>
// // // // // //           <Icon className={`h-5 w-5 text-${color}-600`} />
// // // // // //         </div>
// // // // // //         <div>
// // // // // //           <span className="font-medium text-base-content">{label}</span>
// // // // // //           {description && (
// // // // // //             <p className="text-xs text-base-content opacity-60 mt-1">{description}</p>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       </div>
// // // // // //       <span className={`text-2xl font-bold text-${color}-600`}>{value}</span>
// // // // // //     </div>
// // // // // //   );

// // // // // //   if (loading) {
// // // // // //     return (
// // // // // //       <div className="flex flex-col items-center justify-center min-h-screen">
// // // // // //         <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
// // // // // //         <h2 className="text-xl font-semibold text-base-content">Chargement du tableau de bord...</h2>
// // // // // //         <p className="text-base-content opacity-70 mt-2">Connexion aux sources de données</p>
// // // // // //         <div className="mt-4 w-64 bg-base-300 rounded-full h-2">
// // // // // //           <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
// // // // // //       {/* En-tête */}
// // // // // //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
// // // // // //         <div>
// // // // // //           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
// // // // // //             <BarChart3 className="h-8 w-8 text-primary" />
// // // // // //             Tableau de Bord IT
// // // // // //             <span className="badge badge-primary badge-lg">DREN Antsimo Andrefana</span>
// // // // // //           </h1>
// // // // // //           <p className="text-base-content opacity-70 mt-1">
// // // // // //             Surveillance complète du parc informatique - Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
// // // // // //           </p>
// // // // // //           <div className="flex flex-wrap gap-2 mt-2 text-sm">
// // // // // //             <span className="badge badge-primary">
// // // // // //               {stats.total_materiels} matériels
// // // // // //             </span>
// // // // // //             <span className="badge badge-success">
// // // // // //               {stats.materiels_fonctionnels} fonctionnels
// // // // // //             </span>
// // // // // //             <span className="badge badge-error">
// // // // // //               {stats.incidents_ouverts} incidents
// // // // // //             </span>
// // // // // //             <span className="badge badge-warning">
// // // // // //               {stats.alertes_actives} alertes
// // // // // //             </span>
// // // // // //             <span className="badge badge-info">
// // // // // //               {stats.total_equipements_reseau} équipements réseau
// // // // // //             </span>
// // // // // //           </div>
// // // // // //         </div>
        
// // // // // //         <div className="flex flex-wrap gap-2">
// // // // // //           <div className="form-control">
// // // // // //             <label className="label cursor-pointer gap-2">
// // // // // //               <span className="label-text text-sm text-base-content">Auto-refresh (30s)</span>
// // // // // //               <input 
// // // // // //                 type="checkbox" 
// // // // // //                 className="toggle toggle-primary toggle-sm"
// // // // // //                 checked={autoRefresh}
// // // // // //                 onChange={(e) => setAutoRefresh(e.target.checked)}
// // // // // //               />
// // // // // //             </label>
// // // // // //           </div>
          
// // // // // //           <div className="dropdown dropdown-end">
// // // // // //             <button className="btn btn-primary btn-sm">
// // // // // //               <Download className="h-4 w-4 mr-2" />
// // // // // //               Exporter
// // // // // //             </button>
// // // // // //             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// // // // // //               <li><button onClick={generateDetailedPDF}>Rapport PDF</button></li>
// // // // // //               <li><button onClick={() => showNotification('Fonctionnalité à venir', 'info')}>Excel</button></li>
// // // // // //             </ul>
// // // // // //           </div>
          
// // // // // //           <button 
// // // // // //             onClick={loadData}
// // // // // //             className="btn btn-outline btn-sm text-base-content"
// // // // // //             disabled={loading}
// // // // // //           >
// // // // // //             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
// // // // // //             {loading ? 'Actualisation...' : 'Actualiser'}
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Statistiques principales */}
// // // // // //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
// // // // // //         <StatCard
// // // // // //           title="Matériels"
// // // // // //           value={stats.total_materiels}
// // // // // //           icon={Database}
// // // // // //           color="blue"
// // // // // //           subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
// // // // // //           trend={2}
// // // // // //         />
        
// // // // // //         <StatCard
// // // // // //           title="Logiciels"
// // // // // //           value={stats.total_logiciels}
// // // // // //           icon={Package}
// // // // // //           color="purple"
// // // // // //           subtitle={`${stats.logiciels_installes} installés`}
// // // // // //           trend={1}
// // // // // //         />
        
// // // // // //         <StatCard
// // // // // //           title="Alertes"
// // // // // //           value={stats.alertes_actives}
// // // // // //           icon={Bell}
// // // // // //           color="yellow"
// // // // // //           subtitle={`${stats.alertes_critiques} critiques`}
// // // // // //           trend={stats.alertes_critiques > 0 ? 5 : -2}
// // // // // //         />
        
// // // // // //         <StatCard
// // // // // //           title="Incidents"
// // // // // //           value={stats.incidents_ouverts}
// // // // // //           icon={AlertTriangle}
// // // // // //           color="red"
// // // // // //           subtitle={`${stats.incidents_resolus} résolus`}
// // // // // //           trend={-1}
// // // // // //         />
        
// // // // // //         <StatCard
// // // // // //           title="Équipements Réseau"
// // // // // //           value={stats.total_equipements_reseau}
// // // // // //           icon={Network}
// // // // // //           color="indigo"
// // // // // //           subtitle={`${stats.reseau_fonctionnel} fonctionnels`}
// // // // // //           trend={0}
// // // // // //         />
        
// // // // // //         <StatCard
// // // // // //           title="Coût Réparations"
// // // // // //           value={formatCurrency(stats.cout_total_reparations)}
// // // // // //           icon={DollarSign}
// // // // // //           color="green"
// // // // // //           subtitle={`${stats.reparations_ce_mois} ce mois`}
// // // // // //           trend={3}
// // // // // //         />
// // // // // //       </div>

// // // // // //       {/* Graphiques et Synthèse */}
// // // // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // // // // //         {/* Matériels par Service - SERVICES SPÉCIFIQUES */}
// // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <Users className="h-5 w-5 mr-2" />
// // // // // //               Matériels par Service
// // // // // //               <span className="badge badge-primary ml-2">
// // // // // //                 {Object.keys(stats.materiels_par_service).length} services
// // // // // //               </span>
// // // // // //             </h3>
// // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // //               <BarChart data={chartData.materielsService}>
// // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // //                 <XAxis 
// // // // // //                   dataKey="service" 
// // // // // //                   stroke="#9CA3AF"
// // // // // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // // // // //                 />
// // // // // //                 <YAxis 
// // // // // //                   stroke="#9CA3AF"
// // // // // //                   tick={{ fill: '#9CA3AF' }}
// // // // // //                 />
// // // // // //                 <Tooltip 
// // // // // //                   contentStyle={{ 
// // // // // //                     backgroundColor: '#1F2937', 
// // // // // //                     borderColor: '#374151', 
// // // // // //                     color: '#F9FAFB',
// // // // // //                     borderRadius: '8px',
// // // // // //                     padding: '10px'
// // // // // //                   }}
// // // // // //                   formatter={(value) => [`${value} matériels`, 'Quantité']}
// // // // // //                 />
// // // // // //                 <Legend />
// // // // // //                 <Bar 
// // // // // //                   dataKey="count" 
// // // // // //                   name="Matériels"
// // // // // //                   radius={[4, 4, 0, 0]}
// // // // // //                 >
// // // // // //                   {chartData.materielsService.map((entry, index) => (
// // // // // //                     <Cell 
// // // // // //                       key={`cell-${index}`} 
// // // // // //                       fill={entry.fill}
// // // // // //                       stroke={entry.fill}
// // // // // //                       strokeWidth={1}
// // // // // //                     />
// // // // // //                   ))}
// // // // // //                 </Bar>
// // // // // //               </BarChart>
// // // // // //             </ResponsiveContainer>
            
// // // // // //             {/* Services principaux */}
// // // // // //             <div className="mt-4">
// // // // // //               <p className="text-sm font-medium text-base-content mb-2">Services principaux:</p>
// // // // // //               <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
// // // // // //                 {['Secrétariat', 'Direction', 'Informatique', 'Archives'].map(service => {
// // // // // //                   const count = stats.materiels_par_service[service] || 0;
// // // // // //                   const color = getServiceColor(service);
// // // // // //                   return (
// // // // // //                     <div key={service} className="flex items-center gap-2 p-2 bg-base-200 rounded">
// // // // // //                       <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
// // // // // //                       <div className="flex-1">
// // // // // //                         <p className="text-sm font-medium text-base-content">{service}</p>
// // // // // //                         <p className="text-xs text-base-content opacity-70">{count} matériels</p>
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   );
// // // // // //                 })}
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* SYSTHÈSE DES DONNÉES */}
// // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <Database className="h-5 w-5 mr-2" />
// // // // // //               Synthèse des Données
// // // // // //               <span className="badge badge-info ml-2">Indicateurs clés</span>
// // // // // //             </h3>
            
// // // // // //             <div className="space-y-3">
// // // // // //               {chartData.syntheseData.map((item, index) => (
// // // // // //                 <SyntheseItem
// // // // // //                   key={index}
// // // // // //                   label={item.label}
// // // // // //                   value={item.value}
// // // // // //                   icon={item.icon}
// // // // // //                   color={item.color}
// // // // // //                   description={item.description}
// // // // // //                 />
// // // // // //               ))}
// // // // // //             </div>
            
// // // // // //             {/* Taux de performance */}
// // // // // //             <div className="mt-6 p-4 bg-base-200 rounded-lg">
// // // // // //               <h4 className="font-medium text-base-content mb-3">Performances système</h4>
// // // // // //               <div className="space-y-3">
// // // // // //                 <div>
// // // // // //                   <div className="flex justify-between text-sm text-base-content mb-1">
// // // // // //                     <span>Disponibilité matériels</span>
// // // // // //                     <span className="font-semibold">{stats.taux_disponibilite}%</span>
// // // // // //                   </div>
// // // // // //                   <div className="w-full bg-base-300 rounded-full h-2">
// // // // // //                     <div 
// // // // // //                       className={`h-2 rounded-full ${stats.taux_disponibilite > 80 ? 'bg-success' : stats.taux_disponibilite > 60 ? 'bg-warning' : 'bg-error'}`}
// // // // // //                       style={{ width: `${Math.min(stats.taux_disponibilite, 100)}%` }}
// // // // // //                     />
// // // // // //                   </div>
// // // // // //                 </div>
                
// // // // // //                 <div>
// // // // // //                   <div className="flex justify-between text-sm text-base-content mb-1">
// // // // // //                     <span>Résolution incidents</span>
// // // // // //                     <span className="font-semibold">{stats.taux_resolution}%</span>
// // // // // //                   </div>
// // // // // //                   <div className="w-full bg-base-300 rounded-full h-2">
// // // // // //                     <div 
// // // // // //                       className="bg-success h-2 rounded-full"
// // // // // //                       style={{ width: `${Math.min(stats.taux_resolution, 100)}%` }}
// // // // // //                     />
// // // // // //                   </div>
// // // // // //                 </div>
                
// // // // // //                 <div className="grid grid-cols-2 gap-3 pt-2">
// // // // // //                   <div className="text-center p-2 bg-base-300 rounded">
// // // // // //                     <p className="text-xs text-base-content opacity-70">Coût moyen/réparation</p>
// // // // // //                     <p className="font-bold text-base-content">{formatCurrency(stats.cout_moyen_reparation)}</p>
// // // // // //                   </div>
// // // // // //                   <div className="text-center p-2 bg-base-300 rounded">
// // // // // //                     <p className="text-xs text-base-content opacity-70">Alertes actives</p>
// // // // // //                     <p className="font-bold text-base-content">{stats.alertes_actives}</p>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //          {/* Incidents par priorité */}
// // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <BarChart3 className="h-5 w-5 mr-2" />
// // // // // //               Incidents par Priorité
// // // // // //             </h3>
// // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // //               <BarChart data={chartData.incidentsPriorite}>
// // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // //                 <XAxis dataKey="priorite" stroke="#9CA3AF" />
// // // // // //                 <YAxis stroke="#9CA3AF" />
// // // // // //                 <Tooltip 
// // // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // //                 />
// // // // // //                 <Legend />
// // // // // //                 <Bar dataKey="count" name="Incidents">
// // // // // //                   {chartData.incidentsPriorite.map((entry, index) => (
// // // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // //                   ))}
// // // // // //                 </Bar>
// // // // // //               </BarChart>
// // // // // //             </ResponsiveContainer>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* Évolution des incidents */}
// // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <LineChartIcon className="h-5 w-5 mr-2" />
// // // // // //               Évolution des Incidents (30 jours)
// // // // // //             </h3>
// // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // //               <AreaChart data={chartData.incidentsEvolution}>
// // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // //                 <XAxis dataKey="date" stroke="#9CA3AF" />
// // // // // //                 <YAxis stroke="#9CA3AF" />
// // // // // //                 <Tooltip 
// // // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // //                 />
// // // // // //                 <Legend />
// // // // // //                 <Area 
// // // // // //                   type="monotone" 
// // // // // //                   dataKey="incidents" 
// // // // // //                   stroke="#ef4444" 
// // // // // //                   fill="#ef4444"
// // // // // //                   fillOpacity={0.3}
// // // // // //                   name="Incidents"
// // // // // //                 />
// // // // // //               </AreaChart>
// // // // // //             </ResponsiveContainer>
// // // // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // // // //               Moyenne: {chartData.incidentsEvolution.length > 0 ? 
// // // // // //                 Math.round(chartData.incidentsEvolution.reduce((sum, day) => sum + day.incidents, 0) / chartData.incidentsEvolution.length) : 0} incidents/jour
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* Logiciels installés par catégorie */}
// // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <Package className="h-5 w-5 mr-2" />
// // // // // //               Logiciels par Catégorie
// // // // // //               <span className="badge badge-success ml-2">{stats.logiciels_installes} installés</span>
// // // // // //             </h3>
// // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // //               <BarChart data={chartData.logicielsParCategorie}>
// // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // //                 <XAxis 
// // // // // //                   dataKey="categorie" 
// // // // // //                   stroke="#9CA3AF"
// // // // // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // // // // //                   angle={-45}
// // // // // //                   textAnchor="end"
// // // // // //                   height={60}
// // // // // //                 />
// // // // // //                 <YAxis stroke="#9CA3AF" />
// // // // // //                 <Tooltip 
// // // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // //                   formatter={(value) => [`${value} logiciels`, 'Quantité']}
// // // // // //                 />
// // // // // //                 <Legend />
// // // // // //                 <Bar 
// // // // // //                   dataKey="count" 
// // // // // //                   name="Logiciels"
// // // // // //                   radius={[4, 4, 0, 0]}
// // // // // //                 >
// // // // // //                   {chartData.logicielsParCategorie.map((entry, index) => (
// // // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // //                   ))}
// // // // // //                 </Bar>
// // // // // //               </BarChart>
// // // // // //             </ResponsiveContainer>
// // // // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // // // //               {stats.total_logiciels} logiciels au total • {stats.logiciels_expires} licences expirées
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* État des matériels */}
// // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <PieChartIcon className="h-5 w-5 mr-2" />
// // // // // //               État des Matériels
// // // // // //             </h3>
// // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // //               <PieChart>
// // // // // //                 <Pie
// // // // // //                   data={chartData.materielsEtat}
// // // // // //                   cx="50%"
// // // // // //                   cy="50%"
// // // // // //                   labelLine={false}
// // // // // //                   label={({ name, value }) => `${name}: ${value}`}
// // // // // //                   outerRadius={80}
// // // // // //                   dataKey="value"
// // // // // //                 >
// // // // // //                   {chartData.materielsEtat.map((entry, index) => (
// // // // // //                     <Cell key={`cell-${index}`} fill={entry.color} />
// // // // // //                   ))}
// // // // // //                 </Pie>
// // // // // //                 <Tooltip />
// // // // // //                 <Legend />
// // // // // //               </PieChart>
// // // // // //             </ResponsiveContainer>
// // // // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // // // //               Taux de disponibilité: {stats.taux_disponibilite}%
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* Équipements réseau */}
// // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <Network className="h-5 w-5 mr-2" />
// // // // // //               Équipements Réseau
// // // // // //               <span className="badge badge-info ml-2">{stats.total_equipements_reseau} équipements</span>
// // // // // //             </h3>
// // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // //               <BarChart data={chartData.reseauParType}>
// // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // //                 <XAxis 
// // // // // //                   dataKey="type" 
// // // // // //                   stroke="#9CA3AF"
// // // // // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // // // // //                 />
// // // // // //                 <YAxis stroke="#9CA3AF" />
// // // // // //                 <Tooltip 
// // // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // //                   formatter={(value) => [`${value} équipements`, 'Quantité']}
// // // // // //                 />
// // // // // //                 <Legend />
// // // // // //                 <Bar 
// // // // // //                   dataKey="count" 
// // // // // //                   name="Équipements"
// // // // // //                   radius={[4, 4, 0, 0]}
// // // // // //                 >
// // // // // //                   {chartData.reseauParType.map((entry, index) => (
// // // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // //                   ))}
// // // // // //                 </Bar>
// // // // // //               </BarChart>
// // // // // //             </ResponsiveContainer>
// // // // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // // // //               {stats.reseau_fonctionnel} fonctionnels • {stats.reseau_panne} en panne
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //               {/* Alertes par Sévérité */}
// // // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <Shield className="h-5 w-5 mr-2" />
// // // // // //               Alertes par Sévérité
// // // // // //             </h3>
// // // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // // //               <BarChart data={chartData.alertesSeverite}>
// // // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // // //                 <XAxis dataKey="severite" stroke="#9CA3AF" />
// // // // // //                 <YAxis stroke="#9CA3AF" />
// // // // // //                 <Tooltip 
// // // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // // //                   formatter={(value) => [`${value} alertes`, 'Quantité']}
// // // // // //                 />
// // // // // //                 <Legend />
// // // // // //                 <Bar 
// // // // // //                   dataKey="count" 
// // // // // //                   name="Alertes"
// // // // // //                   radius={[4, 4, 0, 0]}
// // // // // //                 >
// // // // // //                   {chartData.alertesSeverite.map((entry, index) => (
// // // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // // //                   ))}
// // // // // //                 </Bar>
// // // // // //               </BarChart>
// // // // // //             </ResponsiveContainer>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Tableau des alertes */}
// // // // // //       <div className="card bg-base-200 shadow-xl mb-6 border border-base-300">
// // // // // //         <div className="card-body">
// // // // // //           <div className="flex justify-between items-center mb-4">
// // // // // //             <h2 className="card-title text-base-content">
// // // // // //               <Bell className="h-5 w-5 mr-2" />
// // // // // //               Alertes Actives ({stats.alertes_actives})
// // // // // //               {stats.alertes_critiques > 0 && (
// // // // // //                 <span className="badge badge-error ml-2">{stats.alertes_critiques} critiques</span>
// // // // // //               )}
// // // // // //             </h2>
// // // // // //             <button className="btn btn-sm btn-outline" onClick={() => loadData()}>
// // // // // //               <RefreshCw className="h-4 w-4" />
// // // // // //             </button>
// // // // // //           </div>
          
// // // // // //           <div className="overflow-x-auto">
// // // // // //             <table className="table table-zebra w-full">
// // // // // //               <thead>
// // // // // //                 <tr className="bg-base-300">
// // // // // //                   <th className="text-base-content">Type</th>
// // // // // //                   <th className="text-base-content">Description</th>
// // // // // //                   <th className="text-base-content">Source</th>
// // // // // //                   <th className="text-base-content">Sévérité</th>
// // // // // //                   <th className="text-base-content">Date</th>
// // // // // //                   <th className="text-base-content">Statut</th>
// // // // // //                 </tr>
// // // // // //               </thead>
// // // // // //               <tbody>
// // // // // //                 {safeArray(alertes)
// // // // // //                   .filter(alerte => {
// // // // // //                     const statut = (alerte.statut || '').toString().toLowerCase();
// // // // // //                     return statut.includes('nouvelle') || 
// // // // // //                            statut.includes('en_traitement') || 
// // // // // //                            statut.includes('active') ||
// // // // // //                            !statut;
// // // // // //                   })
// // // // // //                   .slice(0, 8)
// // // // // //                   .map((alerte, index) => (
// // // // // //                   <tr key={index} className="hover:bg-base-300">
// // // // // //                     <td>
// // // // // //                       <span className="badge badge-outline text-base-content border-base-300">
// // // // // //                         {alerte.type_alerte || 'Non spécifié'}
// // // // // //                       </span>
// // // // // //                     </td>
// // // // // //                     <td className="text-base-content">
// // // // // //                       <div className="font-medium">
// // // // // //                         {alerte.description || 'Alerte sans description'}
// // // // // //                       </div>
// // // // // //                     </td>
// // // // // //                     <td className="text-base-content">
// // // // // //                       {alerte.materiel_nom || alerte.logiciel_nom || alerte.reseau_nom || 'Système'}
// // // // // //                     </td>
// // // // // //                     <td>
// // // // // //                       <span className={`badge ${
// // // // // //                         (alerte.severite || '').toLowerCase().includes('critique') ? 'badge-error' :
// // // // // //                         (alerte.severite || '').toLowerCase().includes('haute') ? 'badge-warning' : 'badge-info'
// // // // // //                       }`}>
// // // // // //                         {alerte.severite || 'Non spécifiée'}
// // // // // //                       </span>
// // // // // //                     </td>
// // // // // //                     <td className="text-base-content">
// // // // // //                       {alerte.date_alerte || alerte.date_creation 
// // // // // //                         ? new Date(alerte.date_alerte || alerte.date_creation).toLocaleDateString('fr-FR')
// // // // // //                         : 'Non spécifiée'}
// // // // // //                     </td>
// // // // // //                     <td>
// // // // // //                       <span className={`badge ${
// // // // // //                         (alerte.statut || '').toLowerCase().includes('nouvelle') ? 'badge-warning' :
// // // // // //                         (alerte.statut || '').toLowerCase().includes('en_traitement') ? 'badge-info' : 'badge-success'
// // // // // //                       }`}>
// // // // // //                         {alerte.statut || 'Active'}
// // // // // //                       </span>
// // // // // //                     </td>
// // // // // //                   </tr>
// // // // // //                 ))}
// // // // // //               </tbody>
// // // // // //             </table>
// // // // // //           </div>
          
// // // // // //           {stats.alertes_actives === 0 && (
// // // // // //             <div className="text-center py-8 text-base-content opacity-60">
// // // // // //               ✅ Aucune alerte active
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Informations système */}
// // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // // // //         <div className="card bg-base-200 border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <Info className="h-5 w-5 mr-2" />
// // // // // //               Informations système
// // // // // //             </h3>
// // // // // //             <div className="space-y-3 text-sm">
// // // // // //               <div className="flex justify-between">
// // // // // //                 <span className="font-medium text-base-content">Données chargées:</span>
// // // // // //                 <span className="text-base-content">
// // // // // //                   {safeArray(materiels).length} matériels, {safeArray(logiciels).length} logiciels
// // // // // //                 </span>
// // // // // //               </div>
// // // // // //               <div className="flex justify-between">
// // // // // //                 <span className="font-medium text-base-content">Services actifs:</span>
// // // // // //                 <span className="text-base-content">
// // // // // //                   {Object.keys(stats.materiels_par_service).length} services
// // // // // //                 </span>
// // // // // //               </div>
// // // // // //               <div className="flex justify-between">
// // // // // //                 <span className="font-medium text-base-content">Utilisateur:</span>
// // // // // //                 <span className="text-base-content">{user?.nom_complet || user?.username || 'Non connecté'}</span>
// // // // // //               </div>
// // // // // //               <div className="flex justify-between">
// // // // // //                 <span className="font-medium text-base-content">Auto-refresh:</span>
// // // // // //                 <span className="text-base-content">{autoRefresh ? 'Activé (30s)' : 'Désactivé'}</span>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
        
// // // // // //         <div className="card bg-base-200 border border-base-300">
// // // // // //           <div className="card-body">
// // // // // //             <h3 className="card-title text-base-content">
// // // // // //               <AlertCircle className="h-5 w-5 mr-2" />
// // // // // //               Recommandations & Alertes
// // // // // //             </h3>
// // // // // //             <div className="space-y-2 text-sm">
// // // // // //               {stats.materiels_en_panne > 0 && (
// // // // // //                 <div className="alert alert-error">
// // // // // //                   <AlertTriangle className="h-4 w-4" />
// // // // // //                   <span className="text-base-content">🚨 {stats.materiels_en_panne} matériel(s) en panne nécessite(nt) intervention</span>
// // // // // //                 </div>
// // // // // //               )}
// // // // // //               {stats.alertes_critiques > 0 && (
// // // // // //                 <div className="alert alert-warning">
// // // // // //                   <Shield className="h-4 w-4" />
// // // // // //                   <span className="text-base-content">⚠️ {stats.alertes_critiques} alerte(s) critique(s) en attente</span>
// // // // // //                 </div>
// // // // // //               )}
// // // // // //               {stats.logiciels_expires > 0 && (
// // // // // //                 <div className="alert alert-info">
// // // // // //                   <Package className="h-4 w-4" />
// // // // // //                   <span className="text-base-content">📅 {stats.logiciels_expires} licence(s) logiciel(s) expirée(s)</span>
// // // // // //                 </div>
// // // // // //               )}
// // // // // //               {stats.reseau_panne > 0 && (
// // // // // //                 <div className="alert alert-warning">
// // // // // //                   <Network className="h-4 w-4" />
// // // // // //                   <span className="text-base-content">🌐 {stats.reseau_panne} équipement(s) réseau en panne</span>
// // // // // //                 </div>
// // // // // //               )}
// // // // // //               {stats.materiels_en_panne === 0 && stats.alertes_critiques === 0 && (
// // // // // //                 <div className="alert alert-success">
// // // // // //                   <CheckCircle className="h-4 w-4" />
// // // // // //                   <span className="text-base-content">✅ Tous les systèmes sont opérationnels</span>
// // // // // //                 </div>
// // // // // //               )}
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // // Fonction pour convertir une image en base64
// // // // // // const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
// // // // // //   const img = new Image();
// // // // // //   img.crossOrigin = 'Anonymous';
// // // // // //   img.onload = () => {
// // // // // //     const canvas = document.createElement('canvas');
// // // // // //     const ctx = canvas.getContext('2d');
// // // // // //     canvas.width = img.width;
// // // // // //     canvas.height = img.height;
// // // // // //     ctx.drawImage(img, 0, 0);
// // // // // //     resolve(canvas.toDataURL('image/jpeg'));
// // // // // //   };
// // // // // //   img.onerror = reject;
// // // // // //   img.src = imgUrl;
// // // // // // });

// // // // // // export default Dashboard;







// // // // // // src/pages/Dashboard.jsx - VERSION CORRIGÉE ET AMÉLIORÉE
// // // // // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // // // // import { 
// // // // //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// // // // //   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
// // // // //   AreaChart, Area
// // // // // } from 'recharts';
// // // // // import { 
// // // // //   BarChart3, RefreshCw, Users, 
// // // // //   Eye, AlertTriangle, CheckCircle, XCircle, 
// // // // //   Database, Bell, Package, 
// // // // //   Network, Wrench,
// // // // //   PieChart as PieChartIcon,
// // // // //   LineChart as LineChartIcon, Info, 
// // // // //   Bell as BellIcon, Shield, DollarSign,
// // // // //   Clock, AlertCircle,
// // // // //   HardDrive, Laptop, Check,
// // // // //   Server, Router, Cpu, Activity,
// // // // //   FileText, Download, Printer,
// // // // //   Monitor, Smartphone, Cloud,
// // // // //   ShieldAlert, TrendingUp, TrendingDown
// // // // // } from 'lucide-react';
// // // // // import { 
// // // // //   materielsAPI, 
// // // // //   incidentsAPI, 
// // // // //   reparationsAPI, 
// // // // //   logicielsAPI, 
// // // // //   alertesAPI, 
// // // // //   fournisseursAPI, 
// // // // //   reseauAPI 
// // // // // } from '../services/api';
// // // // // import { useAuth } from '../context/AuthContext';
// // // // // import { useNotification } from '../context/NotificationContext';
// // // // // import jsPDF from 'jspdf';
// // // // // import autoTable from 'jspdf-autotable';
// // // // // import { useTheme } from '../context/ThemeContext'; // Ajoutez cette importation

// // // // // // Import du logo
// // // // // import logoDren from '../assets/images/logo-dren.jpeg';

// // // // // // COULEURS FIXES POUR CHAQUE SERVICE
// // // // // const SERVICE_COLORS = {
// // // // //   'Secrétariat': '#3b82f6',      // Bleu
// // // // //   'Direction': '#8b5cf6',        // Violet
// // // // //   'Informatique': '#10b981',     // Vert
// // // // //   'Archives': '#f59e0b',         // Orange
// // // // //   'Administration': '#ef4444',   // Rouge
// // // // //   'Finance': '#06b6d4',          // Cyan
// // // // //   'Communication': '#ec4899',    // Rose
// // // // //   'Maintenance': '#84cc16',      // Vert clair
// // // // //   'Sécurité': '#f97316',         // Orange vif
// // // // //   'Commercial': '#8b5cf6',       // Violet
// // // // //   'Marketing': '#ec4899',        // Rose
// // // // //   'Production': '#10b981',       // Vert
// // // // //   'Logistique': '#f59e0b',       // Orange
// // // // //   'Qualité': '#06b6d4',          // Cyan
// // // // //   'R&D': '#3b82f6',              // Bleu
// // // // //   'Support': '#84cc16',          // Vert clair
// // // // //   'Service Client': '#06b6d4',   // Cyan
// // // // //   'Non assigné': '#9ca3af',      // Gris
// // // // //   'Autre': '#6b7280',            // Gris foncé
// // // // // };

// // // // // const getServiceColor = (serviceName) => {
// // // // //   if (!serviceName) return SERVICE_COLORS['Non assigné'];
  
// // // // //   const name = serviceName.trim().toLowerCase();
  
// // // // //   for (const [key, color] of Object.entries(SERVICE_COLORS)) {
// // // // //     if (name === key.toLowerCase()) {
// // // // //       return color;
// // // // //     }
// // // // //   }
  
// // // // //   for (const [key, color] of Object.entries(SERVICE_COLORS)) {
// // // // //     if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name)) {
// // // // //       return color;
// // // // //     }
// // // // //   }
  
// // // // //   return SERVICE_COLORS['Autre'];
// // // // // };

// // // // // const Dashboard = () => {
// // // // //   const { user } = useAuth();
// // // // //   const { showNotification } = useNotification();
// // // // //   const { theme, toggleTheme } = useTheme(); // Ajoutez cette ligne
  
// // // // //   // États principaux
// // // // //   const [stats, setStats] = useState({
// // // // //     // Matériels
// // // // //     total_materiels: 0,
// // // // //     materiels_fonctionnels: 0,
// // // // //     materiels_en_panne: 0,
// // // // //     materiels_maintenance: 0,
// // // // //     materiels_par_service: {},
// // // // //     materiels_par_type: {},
    
// // // // //     // Logiciels
// // // // //     total_logiciels: 0,
// // // // //     logiciels_actifs: 0,
// // // // //     logiciels_installes: 0,
// // // // //     logiciels_expires: 0,
// // // // //     logiciels_par_categorie: {},
    
// // // // //     // Incidents & Réparations
// // // // //     incidents_ouverts: 0,
// // // // //     incidents_resolus: 0,
// // // // //     incidents_par_priorite: {},
// // // // //     incidents_evolution: [],
// // // // //     reparations_ce_mois: 0,
// // // // //     cout_total_reparations: 0,
    
// // // // //     // Alertes
// // // // //     alertes_actives: 0,
// // // // //     alertes_critiques: 0,
// // // // //     alertes_panne: 0,
// // // // //     alertes_maintenance: 0,
// // // // //     alertes_par_type: {},
// // // // //     alertes_par_severite: {},
    
// // // // //     // Réseau
// // // // //     total_equipements_reseau: 0,
// // // // //     reseau_fonctionnel: 0,
// // // // //     reseau_panne: 0,
// // // // //     reseau_par_type: {},
    
// // // // //     // Synthèse
// // // // //     taux_disponibilite: 0,
// // // // //     taux_resolution: 0,
// // // // //     cout_moyen_reparation: 0,
// // // // //   });
  
// // // // //   // États pour les données
// // // // //   const [materiels, setMateriels] = useState([]);
// // // // //   const [incidents, setIncidents] = useState([]);
// // // // //   const [reparations, setReparations] = useState([]);
// // // // //   const [logiciels, setLogiciels] = useState([]);
// // // // //   const [alertes, setAlertes] = useState([]);
// // // // //   const [fournisseurs, setFournisseurs] = useState([]);
// // // // //   const [reseau, setReseau] = useState([]);
  
// // // // //   // États UI
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [autoRefresh, setAutoRefresh] = useState(false);
// // // // //   const [lastUpdate, setLastUpdate] = useState(null);

// // // // //   // Fonctions helper
// // // // //   const safeArray = (data) => Array.isArray(data) ? data : [];
// // // // //   const safeFilter = (array, condition) => array?.filter?.(condition) || [];
// // // // //   const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

// // // // //   // Charger les données
// // // // //   const loadData = useCallback(async () => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       console.log('📊 Chargement des données dashboard...');

// // // // //       const requests = [
// // // // //         { key: 'materiels', api: materielsAPI.getAll },
// // // // //         { key: 'incidents', api: incidentsAPI.getAll },
// // // // //         { key: 'reparations', api: reparationsAPI.getAll },
// // // // //         { key: 'logiciels', api: logicielsAPI.getAll },
// // // // //         { key: 'alertes', api: alertesAPI.getAll },
// // // // //         { key: 'fournisseurs', api: fournisseursAPI.getAll },
// // // // //         { key: 'reseau', api: reseauAPI.getAll },
// // // // //       ];

// // // // //       const results = {};

// // // // //       for (const req of requests) {
// // // // //         try {
// // // // //           const response = await req.api();
// // // // //           results[req.key] = extractData(response);
// // // // //           console.log(`✅ ${req.key}: ${results[req.key].length} entrées`);
// // // // //         } catch (error) {
// // // // //           console.error(`❌ ${req.key}:`, error);
// // // // //           results[req.key] = [];
// // // // //         }
// // // // //       }

// // // // //       // Mettre à jour les états
// // // // //       setMateriels(safeArray(results.materiels));
// // // // //       setIncidents(safeArray(results.incidents));
// // // // //       setReparations(safeArray(results.reparations));
// // // // //       setLogiciels(safeArray(results.logiciels));
// // // // //       setAlertes(safeArray(results.alertes));
// // // // //       setFournisseurs(safeArray(results.fournisseurs));
// // // // //       setReseau(safeArray(results.reseau));

// // // // //       // Calculer les statistiques
// // // // //       calculateAdvancedStats(results);
      
// // // // //       // Vérifier les alertes pour matériels en panne
// // // // //       checkAlertesMateriels(results.materiels);
      
// // // // //       setLastUpdate(new Date());
// // // // //       showNotification('Tableau de bord actualisé', 'success');

// // // // //     } catch (error) {
// // // // //       console.error('❌ Erreur générale:', error);
// // // // //       showNotification('Erreur lors du chargement', 'error');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   }, [showNotification]);

// // // // //   // Vérifier les alertes pour matériels en panne
// // // // //   const checkAlertesMateriels = useCallback((materielsData) => {
// // // // //     const materielsEnPanne = safeFilter(materielsData, m => {
// // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // //       return etat.includes('panne') || 
// // // // //              etat.includes('défectueux') || 
// // // // //              etat.includes('hors service') ||
// // // // //              etat.includes('non fonctionnel') ||
// // // // //              etat === 'mauvais' ||
// // // // //              etat === 'bad';
// // // // //     });

// // // // //     const materielsEnMaintenance = safeFilter(materielsData, m => {
// // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // //       return etat.includes('maintenance') || 
// // // // //              etat.includes('réparation') || 
// // // // //              etat.includes('en réparation');
// // // // //     });

// // // // //     // Générer des alertes si nécessaire
// // // // //     if (materielsEnPanne.length > 0 || materielsEnMaintenance.length > 0) {
// // // // //       console.log('⚠️ Vérification des alertes matériels:', {
// // // // //         panne: materielsEnPanne.length,
// // // // //         maintenance: materielsEnMaintenance.length
// // // // //       });
// // // // //     }
// // // // //   }, []);

// // // // //   // Calculer les statistiques
// // // // //   const calculateAdvancedStats = useCallback((results) => {
// // // // //     const materielsArray = safeArray(results.materiels);
// // // // //     const incidentsArray = safeArray(results.incidents);
// // // // //     const logicielsArray = safeArray(results.logiciels);
// // // // //     const alertesArray = safeArray(results.alertes);
// // // // //     const reseauArray = safeArray(results.reseau);
// // // // //     const reparationsArray = safeArray(results.reparations);

// // // // //     // Matériels par service
// // // // //     const materielsParService = safeReduce(materielsArray, (acc, m) => {
// // // // //       const service = m.service || m.departement || m.service_attribue || m.direction || 'Non assigné';
// // // // //       acc[service] = (acc[service] || 0) + 1;
// // // // //       return acc;
// // // // //     }, {});

// // // // //     // Matériels par type
// // // // //     const materielsParType = safeReduce(materielsArray, (acc, m) => {
// // // // //       const type = m.type || m.categorie || 'Non spécifié';
// // // // //       acc[type] = (acc[type] || 0) + 1;
// // // // //       return acc;
// // // // //     }, {});

// // // // //     // Matériels fonctionnels
// // // // //     const materielsFonctionnels = safeFilter(materielsArray, m => {
// // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // //       return etat.includes('fonctionnel') || 
// // // // //              etat.includes('actif') || 
// // // // //              etat.includes('opérationnel') ||
// // // // //              etat.includes('en service') ||
// // // // //              etat === 'bon' ||
// // // // //              etat === 'good';
// // // // //     }).length;

// // // // //     // Matériels en panne
// // // // //     const materielsEnPanne = safeFilter(materielsArray, m => {
// // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // //       return etat.includes('panne') || 
// // // // //              etat.includes('défectueux') || 
// // // // //              etat.includes('hors service') ||
// // // // //              etat.includes('non fonctionnel') ||
// // // // //              etat === 'mauvais' ||
// // // // //              etat === 'bad';
// // // // //     }).length;

// // // // //     // Matériels en maintenance
// // // // //     const materielsMaintenance = safeFilter(materielsArray, m => {
// // // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // // //       return etat.includes('maintenance') || 
// // // // //              etat.includes('réparation') || 
// // // // //              etat.includes('en réparation');
// // // // //     }).length;

// // // // //     // Logiciels installés (considérés comme actifs)
// // // // //     const logicielsInstalles = safeFilter(logicielsArray, l => {
// // // // //       const statut = (l.statut || '').toString().toLowerCase();
// // // // //       const etat = (l.etat || '').toString().toLowerCase();
// // // // //       return statut.includes('installé') || 
// // // // //              statut.includes('installe') ||
// // // // //              statut.includes('actif') ||
// // // // //              etat.includes('installé') ||
// // // // //              etat.includes('actif') ||
// // // // //              l.licence_active === true ||
// // // // //              l.licence_active === 'true';
// // // // //     }).length;

// // // // //     // Logiciels par catégorie
// // // // //     const logicielsParCategorie = safeReduce(logicielsArray, (acc, l) => {
// // // // //       const categorie = l.categorie || l.type || 'Autre';
// // // // //       acc[categorie] = (acc[categorie] || 0) + 1;
// // // // //       return acc;
// // // // //     }, {});

// // // // //     // Incidents par priorité
// // // // //     const incidentsParPriorite = safeReduce(incidentsArray, (acc, i) => {
// // // // //       const priorite = i.priorite || 'moyenne';
// // // // //       acc[priorite] = (acc[priorite] || 0) + 1;
// // // // //       return acc;
// // // // //     }, {});

// // // // //     // Évolution des incidents (derniers 30 jours)
// // // // //     const incidentsParJour = {};
// // // // //     const now = new Date();
// // // // //     const last30Days = Array.from({ length: 30 }, (_, i) => {
// // // // //       const date = new Date(now);
// // // // //       date.setDate(date.getDate() - (29 - i));
// // // // //       return date.toISOString().split('T')[0];
// // // // //     });

// // // // //     incidentsArray.forEach(incident => {
// // // // //       const dateStr = incident.date_creation || incident.date || incident.created_at;
// // // // //       if (dateStr) {
// // // // //         try {
// // // // //           const date = new Date(dateStr).toISOString().split('T')[0];
// // // // //           if (last30Days.includes(date)) {
// // // // //             incidentsParJour[date] = (incidentsParJour[date] || 0) + 1;
// // // // //           }
// // // // //         } catch (e) {
// // // // //           console.warn('Date invalide:', dateStr);
// // // // //         }
// // // // //       }
// // // // //     });

// // // // //     const incidentsEvolution = last30Days.map(date => ({
// // // // //       date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
// // // // //       incidents: incidentsParJour[date] || 0
// // // // //     }));

// // // // //     // Alertes par type
// // // // //     const alertesParType = safeReduce(alertesArray, (acc, a) => {
// // // // //       const type = a.type_alerte || a.type || 'Autre';
// // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // //       const isActive = statut.includes('nouvelle') || 
// // // // //                        statut.includes('en_traitement') || 
// // // // //                        statut.includes('active') ||
// // // // //                        !statut;
// // // // //       if (isActive) {
// // // // //         acc[type] = (acc[type] || 0) + 1;
// // // // //       }
// // // // //       return acc;
// // // // //     }, {});

// // // // //     // Alertes par sévérité
// // // // //     const alertesParSeverite = safeReduce(alertesArray, (acc, a) => {
// // // // //       const severite = a.severite || 'moyenne';
// // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // //       const isActive = statut.includes('nouvelle') || 
// // // // //                        statut.includes('en_traitement') || 
// // // // //                        statut.includes('active') ||
// // // // //                        !statut;
// // // // //       if (isActive) {
// // // // //         acc[severite] = (acc[severite] || 0) + 1;
// // // // //       }
// // // // //       return acc;
// // // // //     }, {});

// // // // //     // Alertes panne (basées sur les matériels)
// // // // //     const alertesPanne = safeFilter(alertesArray, a => {
// // // // //       const type = (a.type_alerte || '').toString().toLowerCase();
// // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // //       const isActive = statut.includes('nouvelle') || 
// // // // //                        statut.includes('en_traitement') || 
// // // // //                        statut.includes('active') ||
// // // // //                        !statut;
// // // // //       return isActive && (type.includes('panne') || type.includes('matériel'));
// // // // //     }).length;

// // // // //     // Alertes maintenance
// // // // //     const alertesMaintenance = safeFilter(alertesArray, a => {
// // // // //       const type = (a.type_alerte || '').toString().toLowerCase();
// // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // //       const isActive = statut.includes('nouvelle') || 
// // // // //                        statut.includes('en_traitement') || 
// // // // //                        statut.includes('active') ||
// // // // //                        !statut;
// // // // //       return isActive && type.includes('maintenance');
// // // // //     }).length;

// // // // //     // Équipements réseau
// // // // //     const reseauParType = safeReduce(reseauArray, (acc, r) => {
// // // // //       const type = r.type || r.categorie || 'Autre';
// // // // //       acc[type] = (acc[type] || 0) + 1;
// // // // //       return acc;
// // // // //     }, {});

// // // // //     const reseauFonctionnel = safeFilter(reseauArray, r => {
// // // // //       const etat = (r.etat || '').toString().toLowerCase();
// // // // //       const statut = (r.statut || '').toString().toLowerCase();
// // // // //       return etat.includes('fonctionnel') || 
// // // // //              etat.includes('actif') ||
// // // // //              statut.includes('actif') ||
// // // // //              statut.includes('fonctionnel');
// // // // //     }).length;

// // // // //     const reseauPanne = safeFilter(reseauArray, r => {
// // // // //       const etat = (r.etat || '').toString().toLowerCase();
// // // // //       return etat.includes('panne') || 
// // // // //              etat.includes('défectueux') ||
// // // // //              etat.includes('hors service');
// // // // //     }).length;

// // // // //     // Calcul des taux
// // // // //     const tauxDisponibilite = materielsArray.length > 0 ? 
// // // // //       (materielsFonctionnels / materielsArray.length * 100).toFixed(1) : 0;

// // // // //     const incidentsTotal = incidentsArray.length;
// // // // //     const incidentsResolus = safeFilter(incidentsArray, i => {
// // // // //       const statut = (i.statut || '').toString().toLowerCase();
// // // // //       return statut.includes('résolu') || 
// // // // //              statut.includes('fermé') ||
// // // // //              statut.includes('traité');
// // // // //     }).length;

// // // // //     const tauxResolution = incidentsTotal > 0 ? 
// // // // //       (incidentsResolus / incidentsTotal * 100).toFixed(1) : 100;

// // // // //     const coutTotal = safeReduce(reparationsArray, (sum, r) => 
// // // // //       sum + (parseFloat(r.cout) || 0), 0
// // // // //     );
// // // // //     const nbReparations = reparationsArray.length;
// // // // //     const coutMoyen = nbReparations > 0 ? Math.round(coutTotal / nbReparations) : 0;

// // // // //     // Incidents ouverts
// // // // //     const incidentsOuverts = safeFilter(incidentsArray, i => {
// // // // //       const statut = (i.statut || '').toString().toLowerCase();
// // // // //       return statut.includes('ouvert') || 
// // // // //              statut.includes('en cours') ||
// // // // //              (!statut.includes('résolu') && !statut.includes('fermé'));
// // // // //     }).length;

// // // // //     // Alertes actives
// // // // //     const alertesActives = safeFilter(alertesArray, a => {
// // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // //       return statut.includes('nouvelle') || 
// // // // //              statut.includes('en_traitement') || 
// // // // //              statut.includes('active') ||
// // // // //              !statut;
// // // // //     }).length;

// // // // //     // Alertes critiques
// // // // //     const alertesCritiques = safeFilter(alertesArray, a => {
// // // // //       const severite = (a.severite || '').toString().toLowerCase();
// // // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // // //       const isActive = statut.includes('nouvelle') || 
// // // // //                        statut.includes('en_traitement') || 
// // // // //                        statut.includes('active') ||
// // // // //                        !statut;
// // // // //       return isActive && (severite.includes('critique') || severite.includes('haute'));
// // // // //     }).length;

// // // // //     // Réparations ce mois
// // // // //     const reparationsCeMois = safeFilter(reparationsArray, r => {
// // // // //       const date = r.date_reparation || r.date_debut || r.date;
// // // // //       if (!date) return false;
// // // // //       try {
// // // // //         const repDate = new Date(date);
// // // // //         const now = new Date();
// // // // //         return repDate.getMonth() === now.getMonth() && 
// // // // //                repDate.getFullYear() === now.getFullYear();
// // // // //       } catch {
// // // // //         return false;
// // // // //       }
// // // // //     }).length;

// // // // //     // Logiciels expirés
// // // // //     const logicielsExpires = safeFilter(logicielsArray, l => {
// // // // //       const expiry = l.date_expiration || l.licence_expire || l.date_fin;
// // // // //       return expiry && new Date(expiry) < new Date();
// // // // //     }).length;

// // // // //     const calculatedStats = {
// // // // //       // Matériels
// // // // //       total_materiels: materielsArray.length,
// // // // //       materiels_fonctionnels: materielsFonctionnels,
// // // // //       materiels_en_panne: materielsEnPanne,
// // // // //       materiels_maintenance: materielsMaintenance,
// // // // //       materiels_par_service: materielsParService,
// // // // //       materiels_par_type: materielsParType,
      
// // // // //       // Logiciels
// // // // //       total_logiciels: logicielsArray.length,
// // // // //       logiciels_actifs: logicielsInstalles,
// // // // //       logiciels_installes: logicielsInstalles,
// // // // //       logiciels_expires: logicielsExpires,
// // // // //       logiciels_par_categorie: logicielsParCategorie,
      
// // // // //       // Incidents
// // // // //       incidents_ouverts: incidentsOuverts,
// // // // //       incidents_resolus: incidentsResolus,
// // // // //       incidents_par_priorite: incidentsParPriorite,
// // // // //       incidents_evolution: incidentsEvolution,
      
// // // // //       // Réparations
// // // // //       reparations_ce_mois: reparationsCeMois,
// // // // //       cout_total_reparations: coutTotal,
// // // // //       cout_moyen_reparation: coutMoyen,
      
// // // // //       // Alertes
// // // // //       alertes_actives: alertesActives,
// // // // //       alertes_critiques: alertesCritiques,
// // // // //       alertes_panne: alertesPanne,
// // // // //       alertes_maintenance: alertesMaintenance,
// // // // //       alertes_par_type: alertesParType,
// // // // //       alertes_par_severite: alertesParSeverite,
      
// // // // //       // Réseau
// // // // //       total_equipements_reseau: reseauArray.length,
// // // // //       reseau_fonctionnel: reseauFonctionnel,
// // // // //       reseau_panne: reseauPanne,
// // // // //       reseau_par_type: reseauParType,
      
// // // // //       // Synthèse
// // // // //       taux_disponibilite: parseFloat(tauxDisponibilite),
// // // // //       taux_resolution: parseFloat(tauxResolution),
// // // // //       cout_moyen_reparation: coutMoyen,
// // // // //     };

// // // // //     console.log('📊 Statistiques calculées:', calculatedStats);
// // // // //     setStats(calculatedStats);
// // // // //   }, []);

// // // // //   // Auto-refresh
// // // // //   useEffect(() => {
// // // // //     loadData();
    
// // // // //     if (autoRefresh) {
// // // // //       const interval = setInterval(() => {
// // // // //         loadData();
// // // // //       }, 30000);
// // // // //       return () => clearInterval(interval);
// // // // //     }
// // // // //   }, [loadData, autoRefresh]);

// // // // //   // Données pour les graphiques
// // // // //   const chartData = useMemo(() => {
// // // // //     // Matériels par Service avec services spécifiques
// // // // //     const servicesSpecifiques = ['Secrétariat', 'Direction', 'Informatique', 'Archives'];
// // // // //     const servicesAvecCouleurs = servicesSpecifiques.map(service => {
// // // // //       const count = stats.materiels_par_service[service] || 0;
// // // // //       return {
// // // // //         service: service,
// // // // //         count: count,
// // // // //         fill: getServiceColor(service),
// // // // //         color: getServiceColor(service)
// // // // //       };
// // // // //     }).filter(item => item.count > 0);

// // // // //     // Si pas assez de données, ajouter d'autres services
// // // // //     if (servicesAvecCouleurs.length < 4) {
// // // // //       const autresServices = Object.entries(stats.materiels_par_service)
// // // // //         .filter(([service]) => !servicesSpecifiques.includes(service))
// // // // //         .sort(([,a], [,b]) => b - a)
// // // // //         .slice(0, 4 - servicesAvecCouleurs.length)
// // // // //         .map(([service, count]) => ({
// // // // //           service: service.length > 15 ? service.substring(0, 15) + '...' : service,
// // // // //           originalService: service,
// // // // //           count,
// // // // //           fill: getServiceColor(service),
// // // // //           color: getServiceColor(service)
// // // // //         }));
      
// // // // //       servicesAvecCouleurs.push(...autresServices);
// // // // //     }

// // // // //     // Données pour Synthèse
// // // // //     const syntheseData = [
// // // // //       {
// // // // //         label: 'Matériels fonctionnels',
// // // // //         value: stats.materiels_fonctionnels,
// // // // //         icon: Check,
// // // // //         color: 'success',
// // // // //         description: `${stats.materiels_fonctionnels} / ${stats.total_materiels}`
// // // // //       },
// // // // //       {
// // // // //         label: 'Incidents résolus',
// // // // //         value: stats.incidents_resolus,
// // // // //         icon: CheckCircle,
// // // // //         color: 'success',
// // // // //         description: `sur ${stats.incidents_ouverts + stats.incidents_resolus} total`
// // // // //       },
// // // // //       {
// // // // //         label: 'Alertes critiques',
// // // // //         value: stats.alertes_critiques,
// // // // //         icon: AlertCircle,
// // // // //         color: 'error',
// // // // //         description: `${stats.alertes_panne} panne, ${stats.alertes_maintenance} maintenance`
// // // // //       },
// // // // //       {
// // // // //         label: 'Réparations ce mois',
// // // // //         value: stats.reparations_ce_mois,
// // // // //         icon: Wrench,
// // // // //         color: 'info',
// // // // //         description: `Coût: ${new Intl.NumberFormat('fr-FR').format(stats.cout_total_reparations)} Ar`
// // // // //       },
// // // // //       {
// // // // //         label: 'Logiciels installés',
// // // // //         value: stats.logiciels_installes,
// // // // //         icon: Package,
// // // // //         color: 'success',
// // // // //         description: `${stats.logiciels_installes} / ${stats.total_logiciels} actifs`
// // // // //       },
// // // // //     ];

// // // // //     // Équipements réseau par type
// // // // //     const reseauParTypeData = Object.entries(stats.reseau_par_type).map(([type, count]) => ({
// // // // //       type: type,
// // // // //       count: count,
// // // // //       fill: getServiceColor(type)
// // // // //     }));

// // // // //     // Logiciels par catégorie
// // // // //     const logicielsParCategorieData = Object.entries(stats.logiciels_par_categorie).map(([categorie, count]) => ({
// // // // //       categorie: categorie,
// // // // //       count: count,
// // // // //       fill: getServiceColor(categorie)
// // // // //     }));

// // // // //     // Alertes par sévérité
// // // // //     const alertesSeveriteData = Object.entries(stats.alertes_par_severite || {}).map(([severite, count]) => ({
// // // // //       severite: severite.charAt(0).toUpperCase() + severite.slice(1),
// // // // //       count,
// // // // //       fill: severite === 'critique' ? '#ef4444' : 
// // // // //             severite === 'haute' ? '#f97316' : 
// // // // //             severite === 'moyenne' ? '#eab308' : '#22c55e'
// // // // //     }));

// // // // //     return {
// // // // //       // Graphique Matériels par Service
// // // // //       materielsService: servicesAvecCouleurs,
      
// // // // //       // Données de synthèse
// // // // //       syntheseData: syntheseData,
      
// // // // //       // État des matériels
// // // // //       materielsEtat: [
// // // // //         { 
// // // // //           name: 'Fonctionnel', 
// // // // //           value: stats.materiels_fonctionnels, 
// // // // //           color: '#10b981' 
// // // // //         },
// // // // //         { 
// // // // //           name: 'En panne', 
// // // // //           value: stats.materiels_en_panne, 
// // // // //           color: '#ef4444' 
// // // // //         },
// // // // //         { 
// // // // //           name: 'Maintenance', 
// // // // //           value: stats.materiels_maintenance, 
// // // // //           color: '#f59e0b' 
// // // // //         },
// // // // //         { 
// // // // //           name: 'Autre', 
// // // // //           value: Math.max(0, stats.total_materiels - stats.materiels_fonctionnels - stats.materiels_en_panne - stats.materiels_maintenance), 
// // // // //           color: '#6b7280' 
// // // // //         },
// // // // //       ],
      
// // // // //       // Évolution des incidents
// // // // //       incidentsEvolution: stats.incidents_evolution || [],
      
// // // // //       // Équipements réseau
// // // // //       reseauParType: reseauParTypeData,
      
// // // // //       // Logiciels par catégorie
// // // // //       logicielsParCategorie: logicielsParCategorieData,
      
// // // // //       // Incidents par priorité
// // // // //       incidentsPriorite: Object.entries(stats.incidents_par_priorite).map(([priorite, count]) => ({
// // // // //         priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
// // // // //         count,
// // // // //         fill: priorite === 'critique' ? '#ef4444' : 
// // // // //               priorite === 'haute' ? '#f97316' : 
// // // // //               priorite === 'moyenne' ? '#eab308' : '#22c55e'
// // // // //       })),
      
// // // // //       // Alertes par type
// // // // //       alertesParType: Object.entries(stats.alertes_par_type).map(([type, count]) => ({
// // // // //         type: type,
// // // // //         count: count,
// // // // //         fill: type.includes('panne') ? '#ef4444' : 
// // // // //               type.includes('maintenance') ? '#f59e0b' : 
// // // // //               type.includes('sécurité') ? '#8b5cf6' : '#3b82f6'
// // // // //       })),
      
// // // // //       // Alertes par sévérité
// // // // //       alertesSeverite: alertesSeveriteData,
// // // // //     };
// // // // //   }, [stats]);

// // // // //   // Fonction pour extraire les données des réponses API
// // // // //   const extractData = (response) => {
// // // // //     if (!response?.data) return [];
// // // // //     if (Array.isArray(response.data)) return response.data;
// // // // //     if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// // // // //     if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// // // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
// // // // //     return [];
// // // // //   };

// // // // //   // Formater la devise
// // // // //   const formatCurrency = (amount) => {
// // // // //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// // // // //   };

// // // // //   // Générer rapport PDF
// // // // //   const generateDetailedPDF = async () => {
// // // // //     const doc = new jsPDF('landscape');
    
// // // // //     try {
// // // // //       const imgData = await getBase64Image(logoDren);
// // // // //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// // // // //     } catch (error) {
// // // // //       console.warn('Logo non chargé');
// // // // //     }
    
// // // // //     doc.setFontSize(20);
// // // // //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// // // // //     doc.setFontSize(16);
// // // // //     doc.text('TABLEAU DE BORD COMPLET', 20, 45);
    
// // // // //     // Informations générales
// // // // //     doc.setFontSize(12);
// // // // //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
// // // // //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 67);
    
// // // // //     doc.setDrawColor(200, 200, 200);
// // // // //     doc.line(20, 75, 190, 75);
    
// // // // //     // Synthèse des données
// // // // //     doc.setFontSize(14);
// // // // //     doc.text('SYNTHÈSE DES DONNÉES', 20, 90);
    
// // // // //     const syntheseStats = [
// // // // //       ['Indicateur', 'Valeur', 'Détail'],
// // // // //       ['Matériels fonctionnels', stats.materiels_fonctionnels.toString(), `${stats.total_materiels} total`],
// // // // //       ['Incidents résolus', stats.incidents_resolus.toString(), `${stats.incidents_ouverts} ouverts`],
// // // // //       ['Alertes critiques', stats.alertes_critiques.toString(), `${stats.alertes_actives} actives`],
// // // // //       ['Réparations ce mois', stats.reparations_ce_mois.toString(), formatCurrency(stats.cout_total_reparations)],
// // // // //       ['Logiciels installés', stats.logiciels_installes.toString(), `${stats.total_logiciels} total`],
// // // // //       ['Équipements réseau', stats.total_equipements_reseau.toString(), `${stats.reseau_fonctionnel} fonctionnels`],
// // // // //       ['Taux disponibilité', `${stats.taux_disponibilite}%`, 'Matériels'],
// // // // //       ['Taux résolution', `${stats.taux_resolution}%`, 'Incidents'],
// // // // //     ];
    
// // // // //     autoTable(doc, {
// // // // //       startY: 95,
// // // // //       head: syntheseStats.slice(0, 1),
// // // // //       body: syntheseStats.slice(1),
// // // // //       theme: 'grid',
// // // // //       headStyles: { fillColor: [59, 130, 246] },
// // // // //     });
    
// // // // //     doc.save(`dashboard-complet-${new Date().toISOString().split('T')[0]}.pdf`);
// // // // //     showNotification('Rapport PDF généré avec succès', 'success');
// // // // //   };

// // // // //   // Composant StatCard
// // // // //   const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
// // // // //     const colorClasses = {
// // // // //       blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
// // // // //       purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
// // // // //       yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
// // // // //       red: { bg: 'bg-red-100', text: 'text-red-600' },
// // // // //       indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
// // // // //       green: { bg: 'bg-green-100', text: 'text-green-600' },
// // // // //       primary: { bg: 'bg-primary/10', text: 'text-primary' },
// // // // //       success: { bg: 'bg-success/10', text: 'text-success' },
// // // // //       error: { bg: 'bg-error/10', text: 'text-error' },
// // // // //       warning: { bg: 'bg-warning/10', text: 'text-warning' },
// // // // //       info: { bg: 'bg-info/10', text: 'text-info' },
// // // // //     };

// // // // //     const colorConfig = colorClasses[color] || colorClasses.primary;

// // // // //     return (
// // // // //       <div className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 relative">
// // // // //         {trend !== undefined && (
// // // // //           <div className={`absolute -top-2 -right-2 badge badge-sm ${trend > 0 ? 'badge-success' : 'badge-error'}`}>
// // // // //             {trend > 0 ? '+' : ''}{trend}%
// // // // //           </div>
// // // // //         )}
// // // // //         <div className="card-body p-4">
// // // // //           <div className="flex items-center justify-between">
// // // // //             <div>
// // // // //               <h3 className="text-sm font-semibold text-base-content opacity-70">{title}</h3>
// // // // //               <p className="text-2xl font-bold mt-1 text-base-content">{value}</p>
// // // // //               {subtitle && <p className="text-xs text-base-content opacity-60 mt-1">{subtitle}</p>}
// // // // //             </div>
// // // // //             <div className={`p-3 rounded-lg ${colorConfig.bg}`}>
// // // // //               <Icon className={`h-6 w-6 ${colorConfig.text}`} />
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   };

// // // // //   // Composant SyntheseItem
// // // // //   const SyntheseItem = ({ label, value, icon: Icon, color = 'primary', description }) => {
// // // // //     const colorClasses = {
// // // // //       success: { bg: 'bg-success/10', text: 'text-success', icon: 'text-success' },
// // // // //       error: { bg: 'bg-error/10', text: 'text-error', icon: 'text-error' },
// // // // //       info: { bg: 'bg-info/10', text: 'text-info', icon: 'text-info' },
// // // // //       primary: { bg: 'bg-primary/10', text: 'text-primary', icon: 'text-primary' },
// // // // //     };

// // // // //     const colorConfig = colorClasses[color] || colorClasses.primary;

// // // // //     return (
// // // // //       <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
// // // // //         <div className="flex items-center gap-3">
// // // // //           <div className={`p-2 rounded-lg ${colorConfig.bg}`}>
// // // // //             <Icon className={`h-5 w-5 ${colorConfig.icon}`} />
// // // // //           </div>
// // // // //           <div>
// // // // //             <span className="font-medium text-base-content">{label}</span>
// // // // //             {description && (
// // // // //               <p className="text-xs text-base-content opacity-60 mt-1">{description}</p>
// // // // //             )}
// // // // //           </div>
// // // // //         </div>
// // // // //         <span className={`text-2xl font-bold ${colorConfig.text}`}>{value}</span>
// // // // //       </div>
// // // // //     );
// // // // //   };

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="flex flex-col items-center justify-center min-h-screen">
// // // // //         <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
// // // // //         <h2 className="text-xl font-semibold text-base-content">Chargement du tableau de bord...</h2>
// // // // //         <p className="text-base-content opacity-70 mt-2">Connexion aux sources de données</p>
// // // // //         <div className="mt-4 w-64 bg-base-300 rounded-full h-2">
// // // // //           <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
// // // // //       {/* En-tête */}
// // // // //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
// // // // //         <div>
// // // // //           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
// // // // //             <BarChart3 className="h-8 w-8 text-primary" />
// // // // //             Tableau de Bord IT
// // // // //             <span className="badge badge-primary badge-lg">DREN Antsimo Andrefana</span>
// // // // //           </h1>
// // // // //           <p className="text-base-content opacity-70 mt-1">
// // // // //             Surveillance complète du parc informatique - Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
// // // // //           </p>
// // // // //           <div className="flex flex-wrap gap-2 mt-2 text-sm">
           
// // // // //           </div>
// // // // //         </div>
        
// // // // //         <div className="flex flex-wrap gap-2">
// // // // //           <div className="form-control">
// // // // //             <label className="label cursor-pointer gap-2">
// // // // //               <span className="label-text text-sm text-base-content">Auto-refresh (30s)</span>
// // // // //               <input 
// // // // //                 type="checkbox" 
// // // // //                 className="toggle toggle-primary toggle-sm"
// // // // //                 checked={autoRefresh}
// // // // //                 onChange={(e) => setAutoRefresh(e.target.checked)}
// // // // //               />
// // // // //             </label>
// // // // //           </div>
          
// // // // //           <div className="dropdown dropdown-end">
// // // // //             <button className="btn btn-primary btn-sm">
// // // // //               <Download className="h-4 w-4 mr-2" />
// // // // //               Exporter
// // // // //             </button>
// // // // //             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// // // // //               <li><button onClick={generateDetailedPDF}>Rapport PDF</button></li>
// // // // //               <li><button onClick={() => showNotification('Fonctionnalité à venir', 'info')}>Excel</button></li>
// // // // //             </ul>
// // // // //           </div>
          
// // // // //           <button 
// // // // //             onClick={loadData}
// // // // //             className="btn btn-outline btn-sm text-base-content"
// // // // //             disabled={loading}
// // // // //           >
// // // // //             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
// // // // //             {loading ? 'Actualisation...' : 'Actualiser'}
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Statistiques principales */}
// // // // //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
// // // // //         <StatCard
// // // // //           title="Matériels"
// // // // //           value={stats.total_materiels}
// // // // //           icon={Database}
// // // // //           color="blue"
// // // // //           subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
// // // // //         />
        
// // // // //         <StatCard
// // // // //           title="Logiciels"
// // // // //           value={stats.total_logiciels}
// // // // //           icon={Package}
// // // // //           color="purple"
// // // // //           subtitle={`${stats.logiciels_installes} installés`}
// // // // //         />
        
// // // // //         <StatCard
// // // // //           title="Alertes"
// // // // //           value={stats.alertes_actives}
// // // // //           icon={Bell}
// // // // //           color="yellow"
// // // // //           subtitle={`${stats.alertes_critiques} critiques`}
// // // // //         />
        
// // // // //         <StatCard
// // // // //           title="Incidents"
// // // // //           value={stats.incidents_ouverts}
// // // // //           icon={AlertTriangle}
// // // // //           color="red"
// // // // //           subtitle={`${stats.incidents_resolus} résolus`}
// // // // //         />
        
// // // // //         <StatCard
// // // // //           title="Équipements Réseau"
// // // // //           value={stats.total_equipements_reseau}
// // // // //           icon={Network}
// // // // //           color="indigo"
// // // // //           subtitle={`${stats.reseau_fonctionnel} fonctionnels`}
// // // // //         />
        
// // // // //         <StatCard
// // // // //           title="Coût Réparations"
// // // // //           value={formatCurrency(stats.cout_total_reparations)}
// // // // //           icon={DollarSign}
// // // // //           color="green"
// // // // //           subtitle={`${stats.reparations_ce_mois} ce mois`}
// // // // //         />
// // // // //       </div>

// // // // //       {/* Graphiques et Synthèse */}
// // // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // // // //         {/* Matériels par Service */}
// // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // //           <div className="card-body">
// // // // //             <h3 className="card-title text-base-content">
// // // // //               <Users className="h-5 w-5 mr-2" />
// // // // //               Matériels par Service
// // // // //               <span className="badge badge-primary ml-2">
// // // // //                 {Object.keys(stats.materiels_par_service).length} services
// // // // //               </span>
// // // // //             </h3>
// // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // //               <BarChart data={chartData.materielsService}>
// // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // //                 <XAxis 
// // // // //                   dataKey="service" 
// // // // //                   stroke="#9CA3AF"
// // // // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // // // //                 />
// // // // //                 <YAxis 
// // // // //                   stroke="#9CA3AF"
// // // // //                   tick={{ fill: '#9CA3AF' }}
// // // // //                 />
// // // // //                 <Tooltip 
// // // // //                   contentStyle={{ 
// // // // //                     backgroundColor: '#1F2937', 
// // // // //                     borderColor: '#374151', 
// // // // //                     color: '#F9FAFB',
// // // // //                     borderRadius: '8px',
// // // // //                     padding: '10px'
// // // // //                   }}
// // // // //                   formatter={(value) => [`${value} matériels`, 'Quantité']}
// // // // //                 />
// // // // //                 <Legend />
// // // // //                 <Bar 
// // // // //                   dataKey="count" 
// // // // //                   name="Matériels"
// // // // //                   radius={[4, 4, 0, 0]}
// // // // //                 >
// // // // //                   {chartData.materielsService.map((entry, index) => (
// // // // //                     <Cell 
// // // // //                       key={`cell-${index}`} 
// // // // //                       fill={entry.fill}
// // // // //                       stroke={entry.fill}
// // // // //                       strokeWidth={1}
// // // // //                     />
// // // // //                   ))}
// // // // //                 </Bar>
// // // // //               </BarChart>
// // // // //             </ResponsiveContainer>
            
// // // // //             {/* Services principaux */}
// // // // //             <div className="mt-4">
// // // // //               <p className="text-sm font-medium text-base-content mb-2">Services principaux:</p>
// // // // //               <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
// // // // //                 {['Secrétariat', 'Direction', 'Informatique', 'Archives'].map(service => {
// // // // //                   const count = stats.materiels_par_service[service] || 0;
// // // // //                   const color = getServiceColor(service);
// // // // //                   return (
// // // // //                     <div key={service} className="flex items-center gap-2 p-2 bg-base-200 rounded">
// // // // //                       <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
// // // // //                       <div className="flex-1">
// // // // //                         <p className="text-sm font-medium text-base-content">{service}</p>
// // // // //                         <p className="text-xs text-base-content opacity-70">{count} matériels</p>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   );
// // // // //                 })}
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* SYSTHÈSE DES DONNÉES */}
// // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // //           <div className="card-body">
// // // // //             <h3 className="card-title text-base-content">
// // // // //               <Database className="h-5 w-5 mr-2" />
// // // // //               Synthèse des Données
// // // // //               <span className="badge badge-info ml-2">Indicateurs clés</span>
// // // // //             </h3>
            
// // // // //             <div className="space-y-3">
// // // // //               {chartData.syntheseData.map((item, index) => (
// // // // //                 <SyntheseItem
// // // // //                   key={index}
// // // // //                   label={item.label}
// // // // //                   value={item.value}
// // // // //                   icon={item.icon}
// // // // //                   color={item.color}
// // // // //                   description={item.description}
// // // // //                 />
// // // // //               ))}
// // // // //             </div>
            
// // // // //             {/* Taux de performance */}
// // // // //             <div className="mt-6 p-4 bg-base-200 rounded-lg">
// // // // //               <h4 className="font-medium text-base-content mb-3">Performances système</h4>
// // // // //               <div className="space-y-3">
// // // // //                 <div>
// // // // //                   <div className="flex justify-between text-sm text-base-content mb-1">
// // // // //                     <span>Disponibilité matériels</span>
// // // // //                     <span className="font-semibold">{stats.taux_disponibilite}%</span>
// // // // //                   </div>
// // // // //                   <div className="w-full bg-base-300 rounded-full h-2">
// // // // //                     <div 
// // // // //                       className={`h-2 rounded-full ${stats.taux_disponibilite > 80 ? 'bg-success' : stats.taux_disponibilite > 60 ? 'bg-warning' : 'bg-error'}`}
// // // // //                       style={{ width: `${Math.min(stats.taux_disponibilite, 100)}%` }}
// // // // //                     />
// // // // //                   </div>
// // // // //                 </div>
                
// // // // //                 <div>
// // // // //                   <div className="flex justify-between text-sm text-base-content mb-1">
// // // // //                     <span>Résolution incidents</span>
// // // // //                     <span className="font-semibold">{stats.taux_resolution}%</span>
// // // // //                   </div>
// // // // //                   <div className="w-full bg-base-300 rounded-full h-2">
// // // // //                     <div 
// // // // //                       className="bg-success h-2 rounded-full"
// // // // //                       style={{ width: `${Math.min(stats.taux_resolution, 100)}%` }}
// // // // //                     />
// // // // //                   </div>
// // // // //                 </div>
                
// // // // //                 <div className="grid grid-cols-2 gap-3 pt-2">
// // // // //                   <div className="text-center p-2 bg-base-300 rounded">
// // // // //                     <p className="text-xs text-base-content opacity-70">Coût moyen/réparation</p>
// // // // //                     <p className="font-bold text-base-content">{formatCurrency(stats.cout_moyen_reparation)}</p>
// // // // //                   </div>
// // // // //                   <div className="text-center p-2 bg-base-300 rounded">
// // // // //                     <p className="text-xs text-base-content opacity-70">Alertes actives</p>
// // // // //                     <p className="font-bold text-base-content">{stats.alertes_actives}</p>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // //         // {/* Incidents par priorité */}
// // // //         // <div className="card bg-base-100 shadow-lg border border-base-300">
// // // //         //   <div className="card-body">
// // // //         //     <h3 className="card-title text-base-content">
// // // //         //       <BarChart3 className="h-5 w-5 mr-2" />
// // // //         //       Incidents par Priorité
// // // //         //     </h3>
// // // //         //     <ResponsiveContainer width="100%" height={300}>
// // // //         //       <BarChart data={chartData.incidentsPriorite}>
// // // //         //         <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // //         //         <XAxis dataKey="priorite" stroke="#9CA3AF" />
// // // //         //         <YAxis stroke="#9CA3AF" />
// // // //         //         <Tooltip 
// // // //         //           contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // //         //         />
// // // //         //         <Legend />
// // // //         //         <Bar dataKey="count" name="Incidents">
// // // //         //           {chartData.incidentsPriorite.map((entry, index) => (
// // // //         //             <Cell key={`cell-${index}`} fill={entry.fill} />
// // // //         //           ))}
// // // //         //         </Bar>
// // // //         //       </BarChart>
// // // //         //     </ResponsiveContainer>
// // // //         //   </div>
// // // //         // </div>

// // // //         // {/* Évolution des incidents */}
// // // //         // <div className="card bg-base-100 shadow-lg border border-base-300">
// // // //         //   <div className="card-body">
// // // //         //     <h3 className="card-title text-base-content">
// // // //         //       <LineChartIcon className="h-5 w-5 mr-2" />
// // // //         //       Évolution des Incidents (30 jours)
// // // //         //     </h3>
// // // //         //     <ResponsiveContainer width="100%" height={300}>
// // // //         //       <AreaChart data={chartData.incidentsEvolution}>
// // // //         //         <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // //         //         <XAxis dataKey="date" stroke="#9CA3AF" />
// // // //         //         <YAxis stroke="#9CA3AF" />
// // // //         //         <Tooltip 
// // // //         //           contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // //         //         />
// // // //         //         <Legend />
// // // //         //         <Area 
// // // //         //           type="monotone" 
// // // //         //           dataKey="incidents" 
// // // //         //           stroke="#ef4444" 
// // // //         //           fill="#ef4444"
// // // //         //           fillOpacity={0.3}
// // // //         //           name="Incidents"
// // // //         //         />
// // // //         //       </AreaChart>
// // // //         //     </ResponsiveContainer>
// // // //         //     <div className="text-sm text-base-content opacity-70 mt-2">
// // // //         //       Moyenne: {chartData.incidentsEvolution.length > 0 ? 
// // // //         //         Math.round(chartData.incidentsEvolution.reduce((sum, day) => sum + day.incidents, 0) / chartData.incidentsEvolution.length) : 0} incidents/jour
// // // //         //     </div>
// // // //         //   </div>
// // // //         // </div>

// // // // //         {/* Logiciels installés par catégorie */}
// // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // //           <div className="card-body">
// // // // //             <h3 className="card-title text-base-content">
// // // // //               <Package className="h-5 w-5 mr-2" />
// // // // //               Logiciels par Catégorie
// // // // //               <span className="badge badge-success ml-2">{stats.logiciels_installes} installés</span>
// // // // //             </h3>
// // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // //               <BarChart data={chartData.logicielsParCategorie}>
// // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // //                 <XAxis 
// // // // //                   dataKey="categorie" 
// // // // //                   stroke="#9CA3AF"
// // // // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // // // //                   angle={-45}
// // // // //                   textAnchor="end"
// // // // //                   height={60}
// // // // //                 />
// // // // //                 <YAxis stroke="#9CA3AF" />
// // // // //                 <Tooltip 
// // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // //                   formatter={(value) => [`${value} logiciels`, 'Quantité']}
// // // // //                 />
// // // // //                 <Legend />
// // // // //                 <Bar 
// // // // //                   dataKey="count" 
// // // // //                   name="Logiciels"
// // // // //                   radius={[4, 4, 0, 0]}
// // // // //                 >
// // // // //                   {chartData.logicielsParCategorie.map((entry, index) => (
// // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // //                   ))}
// // // // //                 </Bar>
// // // // //               </BarChart>
// // // // //             </ResponsiveContainer>
// // // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // // //               {stats.total_logiciels} logiciels au total • {stats.logiciels_expires} licences expirées
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* État des matériels */}
// // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // //           <div className="card-body">
// // // // //             <h3 className="card-title text-base-content">
// // // // //               <PieChartIcon className="h-5 w-5 mr-2" />
// // // // //               État des Matériels
// // // // //             </h3>
// // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // //               <PieChart>
// // // // //                 <Pie
// // // // //                   data={chartData.materielsEtat}
// // // // //                   cx="50%"
// // // // //                   cy="50%"
// // // // //                   labelLine={false}
// // // // //                   label={({ name, value }) => `${name}: ${value}`}
// // // // //                   outerRadius={80}
// // // // //                   dataKey="value"
// // // // //                 >
// // // // //                   {chartData.materielsEtat.map((entry, index) => (
// // // // //                     <Cell key={`cell-${index}`} fill={entry.color} />
// // // // //                   ))}
// // // // //                 </Pie>
// // // // //                 <Tooltip />
// // // // //                 <Legend />
// // // // //               </PieChart>
// // // // //             </ResponsiveContainer>
// // // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // // //               Taux de disponibilité: {stats.taux_disponibilite}%
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Équipements réseau */}
// // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // //           <div className="card-body">
// // // // //             <h3 className="card-title text-base-content">
// // // // //               <Network className="h-5 w-5 mr-2" />
// // // // //               Équipements Réseau
// // // // //               <span className="badge badge-info ml-2">{stats.total_equipements_reseau} équipements</span>
// // // // //             </h3>
// // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // //               <BarChart data={chartData.reseauParType}>
// // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // //                 <XAxis 
// // // // //                   dataKey="type" 
// // // // //                   stroke="#9CA3AF"
// // // // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // // // //                 />
// // // // //                 <YAxis stroke="#9CA3AF" />
// // // // //                 <Tooltip 
// // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // //                   formatter={(value) => [`${value} équipements`, 'Quantité']}
// // // // //                 />
// // // // //                 <Legend />
// // // // //                 <Bar 
// // // // //                   dataKey="count" 
// // // // //                   name="Équipements"
// // // // //                   radius={[4, 4, 0, 0]}
// // // // //                 >
// // // // //                   {chartData.reseauParType.map((entry, index) => (
// // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // //                   ))}
// // // // //                 </Bar>
// // // // //               </BarChart>
// // // // //             </ResponsiveContainer>
// // // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // // //               {stats.reseau_fonctionnel} fonctionnels • {stats.reseau_panne} en panne
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Alertes par Sévérité */}
// // // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // // //           <div className="card-body">
// // // // //             <h3 className="card-title text-base-content">
// // // // //               <Shield className="h-5 w-5 mr-2" />
// // // // //               Alertes par Sévérité
// // // // //             </h3>
// // // // //             <ResponsiveContainer width="100%" height={300}>
// // // // //               <BarChart data={chartData.alertesSeverite}>
// // // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // // //                 <XAxis dataKey="severite" stroke="#9CA3AF" />
// // // // //                 <YAxis stroke="#9CA3AF" />
// // // // //                 <Tooltip 
// // // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // // //                   formatter={(value) => [`${value} alertes`, 'Quantité']}
// // // // //                 />
// // // // //                 <Legend />
// // // // //                 <Bar 
// // // // //                   dataKey="count" 
// // // // //                   name="Alertes"
// // // // //                   radius={[4, 4, 0, 0]}
// // // // //                 >
// // // // //                   {chartData.alertesSeverite.map((entry, index) => (
// // // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // // //                   ))}
// // // // //                 </Bar>
// // // // //               </BarChart>
// // // // //             </ResponsiveContainer>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Tableau des alertes */}
// // // // //       <div className="card bg-base-200 shadow-xl mb-6 border border-base-300">
// // // // //         <div className="card-body">
// // // // //           <div className="flex justify-between items-center mb-4">
// // // // //             <h2 className="card-title text-base-content">
// // // // //               <Bell className="h-5 w-5 mr-2" />
// // // // //               Alertes Actives ({stats.alertes_actives})
// // // // //               {stats.alertes_critiques > 0 && (
// // // // //                 <span className="badge badge-error ml-2">{stats.alertes_critiques} critiques</span>
// // // // //               )}
// // // // //             </h2>
// // // // //             <button className="btn btn-sm btn-outline" onClick={() => loadData()}>
// // // // //               <RefreshCw className="h-4 w-4" />
// // // // //             </button>
// // // // //           </div>
          
// // // // //           <div className="overflow-x-auto">
// // // // //             <table className="table table-zebra w-full">
// // // // //               <thead>
// // // // //                 <tr className="bg-base-300">
// // // // //                   <th className="text-base-content">Type</th>
// // // // //                   <th className="text-base-content">Description</th>
// // // // //                   <th className="text-base-content">Source</th>
// // // // //                   <th className="text-base-content">Sévérité</th>
// // // // //                   <th className="text-base-content">Date</th>
// // // // //                   <th className="text-base-content">Statut</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {safeArray(alertes)
// // // // //                   .filter(alerte => {
// // // // //                     const statut = (alerte.statut || '').toString().toLowerCase();
// // // // //                     return statut.includes('nouvelle') || 
// // // // //                            statut.includes('en_traitement') || 
// // // // //                            statut.includes('active') ||
// // // // //                            !statut;
// // // // //                   })
// // // // //                   .slice(0, 8)
// // // // //                   .map((alerte, index) => (
// // // // //                   <tr key={index} className="hover:bg-base-300">
// // // // //                     <td>
// // // // //                       <span className="badge badge-outline text-base-content border-base-300">
// // // // //                         {alerte.type_alerte || 'Non spécifié'}
// // // // //                       </span>
// // // // //                     </td>
// // // // //                     <td className="text-base-content">
// // // // //                       <div className="font-medium">
// // // // //                         {alerte.description || 'Alerte sans description'}
// // // // //                       </div>
// // // // //                     </td>
// // // // //                     <td className="text-base-content">
// // // // //                       {alerte.materiel_nom || alerte.logiciel_nom || alerte.reseau_nom || 'Système'}
// // // // //                     </td>
// // // // //                     <td>
// // // // //                       <span className={`badge ${
// // // // //                         (alerte.severite || '').toLowerCase().includes('critique') ? 'badge-error' :
// // // // //                         (alerte.severite || '').toLowerCase().includes('haute') ? 'badge-warning' : 'badge-info'
// // // // //                       }`}>
// // // // //                         {alerte.severite || 'Non spécifiée'}
// // // // //                       </span>
// // // // //                     </td>
// // // // //                     <td className="text-base-content">
// // // // //                       {alerte.date_alerte || alerte.date_creation 
// // // // //                         ? new Date(alerte.date_alerte || alerte.date_creation).toLocaleDateString('fr-FR')
// // // // //                         : 'Non spécifiée'}
// // // // //                     </td>
// // // // //                     <td>
// // // // //                       <span className={`badge ${
// // // // //                         (alerte.statut || '').toLowerCase().includes('nouvelle') ? 'badge-warning' :
// // // // //                         (alerte.statut || '').toLowerCase().includes('en_traitement') ? 'badge-info' : 'badge-success'
// // // // //                       }`}>
// // // // //                         {alerte.statut || 'Active'}
// // // // //                       </span>
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ))}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
          
// // // // //           {stats.alertes_actives === 0 && (
// // // // //             <div className="text-center py-8 text-base-content opacity-60">
// // // // //               ✅ Aucune alerte active
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Informations système */}
// // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // // //         <div className="card bg-base-200 border border-base-300">
// // // // //           <div className="card-body">
// // // // //             <h3 className="card-title text-base-content">
// // // // //               <Info className="h-5 w-5 mr-2" />
// // // // //               Informations système
// // // // //             </h3>
// // // // //             <div className="space-y-3 text-sm">
// // // // //               <div className="flex justify-between">
// // // // //                 <span className="font-medium text-base-content">Données chargées:</span>
// // // // //                 <span className="text-base-content">
// // // // //                   {safeArray(materiels).length} matériels, {safeArray(logiciels).length} logiciels
// // // // //                 </span>
// // // // //               </div>
// // // // //               <div className="flex justify-between">
// // // // //                 <span className="font-medium text-base-content">Services actifs:</span>
// // // // //                 <span className="text-base-content">
// // // // //                   {Object.keys(stats.materiels_par_service).length} services
// // // // //                 </span>
// // // // //               </div>
// // // // //               <div className="flex justify-between">
// // // // //                 <span className="font-medium text-base-content">Utilisateur:</span>
// // // // //                 <span className="text-base-content">{user?.nom_complet || user?.username || 'Non connecté'}</span>
// // // // //               </div>
// // // // //               <div className="flex justify-between">
// // // // //                 <span className="font-medium text-base-content">Auto-refresh:</span>
// // // // //                 <span className="text-base-content">{autoRefresh ? 'Activé (30s)' : 'Désactivé'}</span>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
        
// // // // //         <div className="card bg-base-200 border border-base-300">
// // // // //           <div className="card-body">
// // // // //             <h3 className="card-title text-base-content">
// // // // //               <AlertCircle className="h-5 w-5 mr-2" />
// // // // //               Recommandations & Alertes
// // // // //             </h3>
// // // // //             <div className="space-y-2 text-sm">
// // // // //               {stats.materiels_en_panne > 0 && (
// // // // //                 <div className="alert alert-error">
// // // // //                   <AlertTriangle className="h-4 w-4" />
// // // // //                   <span className="text-base-content">🚨 {stats.materiels_en_panne} matériel(s) en panne nécessite(nt) intervention</span>
// // // // //                 </div>
// // // // //               )}
// // // // //               {stats.alertes_critiques > 0 && (
// // // // //                 <div className="alert alert-warning">
// // // // //                   <Shield className="h-4 w-4" />
// // // // //                   <span className="text-base-content">⚠️ {stats.alertes_critiques} alerte(s) critique(s) en attente</span>
// // // // //                 </div>
// // // // //               )}
// // // // //               {stats.logiciels_expires > 0 && (
// // // // //                 <div className="alert alert-info">
// // // // //                   <Package className="h-4 w-4" />
// // // // //                   <span className="text-base-content">📅 {stats.logiciels_expires} licence(s) logiciel(s) expirée(s)</span>
// // // // //                 </div>
// // // // //               )}
// // // // //               {stats.reseau_panne > 0 && (
// // // // //                 <div className="alert alert-warning">
// // // // //                   <Network className="h-4 w-4" />
// // // // //                   <span className="text-base-content">🌐 {stats.reseau_panne} équipement(s) réseau en panne</span>
// // // // //                 </div>
// // // // //               )}
// // // // //               {stats.materiels_en_panne === 0 && stats.alertes_critiques === 0 && (
// // // // //                 <div className="alert alert-success">
// // // // //                   <CheckCircle className="h-4 w-4" />
// // // // //                   <span className="text-base-content">✅ Tous les systèmes sont opérationnels</span>
// // // // //                 </div>
// // // // //               )}
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // Fonction pour convertir une image en base64
// // // // // const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
// // // // //   const img = new Image();
// // // // //   img.crossOrigin = 'Anonymous';
// // // // //   img.onload = () => {
// // // // //     const canvas = document.createElement('canvas');
// // // // //     const ctx = canvas.getContext('2d');
// // // // //     canvas.width = img.width;
// // // // //     canvas.height = img.height;
// // // // //     ctx.drawImage(img, 0, 0);
// // // // //     resolve(canvas.toDataURL('image/jpeg'));
// // // // //   };
// // // // //   img.onerror = reject;
// // // // //   img.src = imgUrl;
// // // // // });

// // // // // export default Dashboard;




// // // // // src/pages/Dashboard.jsx - VERSION CORRIGÉE ET AMÉLIORÉE
// // // // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // // // import { 
// // // //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// // // //   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
// // // //   AreaChart, Area
// // // // } from 'recharts';
// // // // import { 
// // // //   BarChart3, RefreshCw, Users, 
// // // //   AlertTriangle, CheckCircle,
// // // //   Database, Bell, Package, 
// // // //   Network, Wrench,
// // // //   PieChart as PieChartIcon,
// // // //   LineChart as LineChartIcon, Info, 
// // // //   Shield, DollarSign,
// // // //   AlertCircle,
// // // //   Check,
// // // //   Download,
// // // //   Monitor, Server, Cpu
// // // // } from 'lucide-react';
// // // // import { 
// // // //   materielsAPI, 
// // // //   incidentsAPI, 
// // // //   reparationsAPI, 
// // // //   logicielsAPI, 
// // // //   alertesAPI, 
// // // //   reseauAPI 
// // // // } from '../services/api';
// // // // import { useAuth } from '../context/AuthContext';
// // // // import { useNotification } from '../context/NotificationContext';
// // // // import jsPDF from 'jspdf';
// // // // import autoTable from 'jspdf-autotable';

// // // // // Import du logo
// // // // import logoDren from '../assets/images/logo-dren.jpeg';

// // // // // COULEURS FIXES POUR CHAQUE SERVICE
// // // // const SERVICE_COLORS = {
// // // //   'Secrétariat': '#3b82f6',      // Bleu
// // // //   'Direction': '#8b5cf6',        // Violet
// // // //   'Informatique': '#10b981',     // Vert
// // // //   'Archives': '#f59e0b',         // Orange
// // // //   'Non assigné': '#9ca3af',      // Gris
// // // //   'Autre': '#6b7280',            // Gris foncé
// // // // };

// // // // const getServiceColor = (serviceName) => {
// // // //   if (!serviceName) return SERVICE_COLORS['Non assigné'];
  
// // // //   const name = serviceName.trim().toLowerCase();
  
// // // //   for (const [key, color] of Object.entries(SERVICE_COLORS)) {
// // // //     if (name === key.toLowerCase()) {
// // // //       return color;
// // // //     }
// // // //   }
  
// // // //   for (const [key, color] of Object.entries(SERVICE_COLORS)) {
// // // //     if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name)) {
// // // //       return color;
// // // //     }
// // // //   }
  
// // // //   return SERVICE_COLORS['Autre'];
// // // // };

// // // // const Dashboard = () => {
// // // //   const { user } = useAuth();
// // // //   const { showNotification } = useNotification();
  
// // // //   // États principaux
// // // //   const [stats, setStats] = useState({
// // // //     // Matériels
// // // //     total_materiels: 0,
// // // //     materiels_fonctionnels: 0,
// // // //     materiels_en_panne: 0,
// // // //     materiels_maintenance: 0,
// // // //     materiels_par_service: {},
// // // //     materiels_par_type: {},
    
// // // //     // Logiciels
// // // //     total_logiciels: 0,
// // // //     logiciels_actifs: 0,
// // // //     logiciels_installes: 0,
// // // //     logiciels_expires: 0,
// // // //     logiciels_par_type: {},
    
// // // //     // Incidents & Réparations
// // // //     incidents_ouverts: 0,
// // // //     incidents_resolus: 0,
// // // //     incidents_par_priorite: {},
// // // //     incidents_evolution: [],
// // // //     reparations_ce_mois: 0,
// // // //     cout_total_reparations: 0,
    
// // // //     // Alertes
// // // //     alertes_actives: 0,
// // // //     alertes_critiques: 0,
// // // //     alertes_panne: 0,
// // // //     alertes_maintenance: 0,
// // // //     alertes_par_type: {},
// // // //     alertes_par_severite: {},
    
// // // //     // Réseau
// // // //     total_equipements_reseau: 0,
// // // //     reseau_fonctionnel: 0,
// // // //     reseau_panne: 0,
// // // //     reseau_par_type: {},
// // // //     reseau_par_statut: {},
    
// // // //     // Synthèse
// // // //     taux_disponibilite: 0,
// // // //     taux_resolution: 0,
// // // //   });
  
// // // //   // États pour les données
// // // //   const [materiels, setMateriels] = useState([]);
// // // //   const [incidents, setIncidents] = useState([]);
// // // //   const [reparations, setReparations] = useState([]);
// // // //   const [logiciels, setLogiciels] = useState([]);
// // // //   const [alertes, setAlertes] = useState([]);
// // // //   const [reseau, setReseau] = useState([]);
  
// // // //   // États UI
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [autoRefresh, setAutoRefresh] = useState(false);
// // // //   const [lastUpdate, setLastUpdate] = useState(null);

// // // //   // Fonctions helper
// // // //   const safeArray = (data) => Array.isArray(data) ? data : [];
// // // //   const safeFilter = (array, condition) => array?.filter?.(condition) || [];
// // // //   const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

// // // //   // Charger les données
// // // //   const loadData = useCallback(async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       console.log('📊 Chargement des données dashboard...');

// // // //       const requests = [
// // // //         { key: 'materiels', api: materielsAPI.getAll },
// // // //         { key: 'incidents', api: incidentsAPI.getAll },
// // // //         { key: 'reparations', api: reparationsAPI.getAll },
// // // //         { key: 'logiciels', api: logicielsAPI.getAll },
// // // //         { key: 'alertes', api: alertesAPI.getAll },
// // // //         { key: 'reseau', api: reseauAPI.getAll },
// // // //       ];

// // // //       const results = {};

// // // //       for (const req of requests) {
// // // //         try {
// // // //           const response = await req.api();
// // // //           results[req.key] = extractData(response);
// // // //           console.log(`✅ ${req.key}: ${results[req.key].length} entrées`);
// // // //         } catch (error) {
// // // //           console.error(`❌ ${req.key}:`, error);
// // // //           results[req.key] = [];
// // // //         }
// // // //       }

// // // //       // Mettre à jour les états
// // // //       setMateriels(safeArray(results.materiels));
// // // //       setIncidents(safeArray(results.incidents));
// // // //       setReparations(safeArray(results.reparations));
// // // //       setLogiciels(safeArray(results.logiciels));
// // // //       setAlertes(safeArray(results.alertes));
// // // //       setReseau(safeArray(results.reseau));

// // // //       // Calculer les statistiques
// // // //       calculateAdvancedStats(results);
      
// // // //       setLastUpdate(new Date());
// // // //       showNotification('Tableau de bord actualisé', 'success');

// // // //     } catch (error) {
// // // //       console.error('❌ Erreur générale:', error);
// // // //       showNotification('Erreur lors du chargement', 'error');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }, [showNotification]);

// // // //   // Calculer les statistiques
// // // //   const calculateAdvancedStats = useCallback((results) => {
// // // //     const materielsArray = safeArray(results.materiels);
// // // //     const incidentsArray = safeArray(results.incidents);
// // // //     const logicielsArray = safeArray(results.logiciels);
// // // //     const alertesArray = safeArray(results.alertes);
// // // //     const reseauArray = safeArray(results.reseau);
// // // //     const reparationsArray = safeArray(results.reparations);

// // // //     console.log('📋 Analyse des données:', {
// // // //       materiels: materielsArray.length,
// // // //       logiciels: logicielsArray.length,
// // // //       alertes: alertesArray.length,
// // // //       reseau: reseauArray.length
// // // //     });

// // // //     // Matériels par service (4 services principaux)
// // // //     const materielsParService = safeReduce(materielsArray, (acc, m) => {
// // // //       const service = m.service || m.departement || m.service_attribue || m.direction || 'Non assigné';
      
// // // //       // Regrouper en 4 catégories principales
// // // //       let serviceNormalise = 'Autre';
      
// // // //       const serviceLower = service.toLowerCase();
// // // //       if (serviceLower.includes('secrétariat') || serviceLower.includes('secretariat')) {
// // // //         serviceNormalise = 'Secrétariat';
// // // //       } else if (serviceLower.includes('direction') || serviceLower.includes('dir')) {
// // // //         serviceNormalise = 'Direction';
// // // //       } else if (serviceLower.includes('informatique') || serviceLower.includes('it') || serviceLower.includes('info')) {
// // // //         serviceNormalise = 'Informatique';
// // // //       } else if (serviceLower.includes('archives') || serviceLower.includes('archive')) {
// // // //         serviceNormalise = 'Archives';
// // // //       } else {
// // // //         serviceNormalise = 'Autre';
// // // //       }
      
// // // //       acc[serviceNormalise] = (acc[serviceNormalise] || 0) + 1;
// // // //       return acc;
// // // //     }, {});

// // // //     // Matériels par type
// // // //     const materielsParType = safeReduce(materielsArray, (acc, m) => {
// // // //       const type = m.type || m.categorie || 'Non spécifié';
// // // //       acc[type] = (acc[type] || 0) + 1;
// // // //       return acc;
// // // //     }, {});

// // // //     // Matériels fonctionnels
// // // //     const materielsFonctionnels = safeFilter(materielsArray, m => {
// // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // //       return etat.includes('fonctionnel') || 
// // // //              etat.includes('actif') || 
// // // //              etat.includes('opérationnel') ||
// // // //              etat.includes('en service') ||
// // // //              etat === 'bon' ||
// // // //              etat === 'good' ||
// // // //              etat === 'excellent' ||
// // // //              etat === 'parfait' ||
// // // //              !etat.includes('panne') && !etat.includes('défectueux') && !etat.includes('hors service');
// // // //     }).length;

// // // //     // Matériels en panne
// // // //     const materielsEnPanne = safeFilter(materielsArray, m => {
// // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // //       return etat.includes('panne') || 
// // // //              etat.includes('défectueux') || 
// // // //              etat.includes('hors service') ||
// // // //              etat.includes('non fonctionnel') ||
// // // //              etat.includes('cassé') ||
// // // //              etat === 'mauvais' ||
// // // //              etat === 'bad' ||
// // // //              etat === 'défectueux';
// // // //     }).length;

// // // //     // Matériels en maintenance
// // // //     const materielsMaintenance = safeFilter(materielsArray, m => {
// // // //       const etat = (m.etat || '').toString().toLowerCase();
// // // //       return etat.includes('maintenance') || 
// // // //              etat.includes('réparation') || 
// // // //              etat.includes('en réparation') ||
// // // //              etat.includes('réparation en cours');
// // // //     }).length;

// // // //     // LOGICIELS - Détection améliorée des logiciels installés
// // // //     const logicielsInstalles = safeFilter(logicielsArray, l => {
// // // //       const statut = (l.statut || '').toString().toLowerCase();
// // // //       const etat = (l.etat || '').toString().toLowerCase();
// // // //       const licence = (l.licence_active || '').toString().toLowerCase();
      
// // // //       // Vérification plus large pour les logiciels installés
// // // //       const estInstalle = 
// // // //         statut.includes('installé') || 
// // // //         statut.includes('installe') ||
// // // //         statut.includes('actif') ||
// // // //         statut.includes('activé') ||
// // // //         etat.includes('installé') ||
// // // //         etat.includes('actif') ||
// // // //         etat.includes('en service') ||
// // // //         licence === 'true' ||
// // // //         licence === 'oui' ||
// // // //         licence === 'actif' ||
// // // //         licence === 'active' ||
// // // //         l.licence_active === true ||
// // // //         l.actif === true ||
// // // //         l.statut === 'actif' ||
// // // //         l.etat === 'installé';
      
// // // //       return estInstalle;
// // // //     }).length;

// // // //     console.log('🔍 Détection logiciels:', {
// // // //       total: logicielsArray.length,
// // // //       installes: logicielsInstalles,
// // // //       premierLogiciel: logicielsArray[0] ? {
// // // //         nom: logicielsArray[0].nom,
// // // //         statut: logicielsArray[0].statut,
// // // //         etat: logicielsArray[0].etat,
// // // //         licence: logicielsArray[0].licence_active
// // // //       } : 'aucun'
// // // //     });

// // // //     // LOGICIELS PAR TYPE - Classification améliorée
// // // //     const logicielsParType = safeReduce(logicielsArray, (acc, l) => {
// // // //       const nom = (l.nom || '').toString().toLowerCase();
// // // //       const categorie = (l.categorie || '').toString().toLowerCase();
// // // //       const type = (l.type || '').toString().toLowerCase();
// // // //       const description = (l.description || '').toString().toLowerCase();
      
// // // //       let typeNormalise = 'Autre';
      
// // // //       // Détection des types de logiciels
// // // //       if (nom.includes('office') || nom.includes('word') || nom.includes('excel') || 
// // // //           nom.includes('powerpoint') || nom.includes('outlook') || nom.includes('access') ||
// // // //           categorie.includes('bureautique') || type.includes('bureautique') ||
// // // //           description.includes('bureautique') || nom.includes('libreoffice') ||
// // // //           nom.includes('openoffice') || nom.includes('suite bureautique')) {
// // // //         typeNormalise = 'Bureautique';
// // // //       } else if (nom.includes('windows') || nom.includes('linux') || nom.includes('macos') || 
// // // //                  nom.includes('ubuntu') || nom.includes('centos') || nom.includes('debian') ||
// // // //                  nom.includes('os') || type.includes('système') || 
// // // //                  type.includes('system') || categorie.includes('os') ||
// // // //                  nom.includes('operating system') || description.includes('système d\'exploitation')) {
// // // //         typeNormalise = 'Système d\'exploitation';
// // // //       } else if (nom.includes('antivirus') || nom.includes('firewall') || nom.includes('sécurité') || 
// // // //                  nom.includes('security') || type.includes('sécurité') || categorie.includes('sécurité') ||
// // // //                  description.includes('antivirus') || description.includes('firewall') ||
// // // //                  nom.includes('avast') || nom.includes('kaspersky') || nom.includes('bitdefender') ||
// // // //                  nom.includes('norton') || nom.includes('malwarebytes')) {
// // // //         typeNormalise = 'Sécurité';
// // // //       } else if (type.includes('métier') || type.includes('metier') || categorie.includes('métier') ||
// // // //                  nom.includes('compta') || nom.includes('gestion') || nom.includes('erp') ||
// // // //                  nom.includes('crm') || description.includes('logiciel métier') ||
// // // //                  nom.includes('sage') || nom.includes('ciel') || nom.includes('quadratus') ||
// // // //                  nom.includes('paye') || nom.includes('comptabilité')) {
// // // //         typeNormalise = 'Métier';
// // // //       } else if (nom.includes('adobe') || nom.includes('photoshop') || nom.includes('illustrator') ||
// // // //                  nom.includes('design') || nom.includes('graphique') || categorie.includes('graphisme') ||
// // // //                  nom.includes('autocad') || nom.includes('solidworks') || nom.includes('3d') ||
// // // //                  type.includes('graphique') || description.includes('design')) {
// // // //         typeNormalise = 'Graphisme/Design';
// // // //       } else if (nom.includes('base de données') || nom.includes('database') || nom.includes('sql') ||
// // // //                  nom.includes('mysql') || nom.includes('postgresql') || nom.includes('oracle') ||
// // // //                  categorie.includes('base de données') || type.includes('base de données')) {
// // // //         typeNormalise = 'Base de données';
// // // //       } else if (nom.includes('navigateur') || nom.includes('browser') || nom.includes('chrome') ||
// // // //                  nom.includes('firefox') || nom.includes('edge') || nom.includes('safari') ||
// // // //                  categorie.includes('navigateur')) {
// // // //         typeNormalise = 'Navigateur';
// // // //       }

      
      
// // // //       acc[typeNormalise] = (acc[typeNormalise] || 0) + 1;
// // // //       return acc;
// // // //     }, {});

// // // //     // Incidents par priorité
// // // //     const incidentsParPriorite = safeReduce(incidentsArray, (acc, i) => {
// // // //       const priorite = i.priorite || 'moyenne';
// // // //       acc[priorite] = (acc[priorite] || 0) + 1;
// // // //       return acc;
// // // //     }, {});

// // // //     // Évolution des incidents (derniers 7 jours)
// // // //     const incidentsParJour = {};
// // // //     const now = new Date();
// // // //     const last30Days = Array.from({ length: 30 }, (_, i) => {
// // // //       const date = new Date(now);
// // // //       date.setDate(date.getDate() - (29 - i));
// // // //       return date.toISOString().split('T')[0];
// // // //     });

// // // //     incidentsArray.forEach(incident => {
// // // //       const dateStr = incident.date_creation || incident.date || incident.created_at;
// // // //       if (dateStr) {
// // // //         try {
// // // //           const date = new Date(dateStr).toISOString().split('T')[0];
// // // //           if (last30Days.includes(date)) {
// // // //             incidentsParJour[date] = (incidentsParJour[date] || 0) + 1;
// // // //           }
// // // //         } catch (e) {
// // // //           console.warn('Date invalide:', dateStr);
// // // //         }
// // // //       }
// // // //     });

// // // //     const incidentsEvolution = last30Days.map(date => ({
// // // //       date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
// // // //       incidents: incidentsParJour[date] || 0
// // // //     }));


// // // //     // Alertes par type
// // // //     const alertesParType = safeReduce(alertesArray, (acc, a) => {
// // // //       const type = a.type_alerte || a.type || 'Autre';
// // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // //       const isActive = statut.includes('nouvelle') || 
// // // //                        statut.includes('en_traitement') || 
// // // //                        statut.includes('active') ||
// // // //                        statut.includes('ouvert') ||
// // // //                        !statut;
// // // //       if (isActive) {
// // // //         acc[type] = (acc[type] || 0) + 1;
// // // //       }
// // // //       return acc;
// // // //     }, {});

// // // //     // Alertes par sévérité
// // // //     const alertesParSeverite = safeReduce(alertesArray, (acc, a) => {
// // // //       const severite = (a.severite || 'moyenne').toLowerCase();
// // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // //       const isActive = statut.includes('nouvelle') || 
// // // //                        statut.includes('en_traitement') || 
// // // //                        statut.includes('active') ||
// // // //                        statut.includes('ouvert') ||
// // // //                        !statut;
// // // //       if (isActive) {
// // // //         acc[severite] = (acc[severite] || 0) + 1;
// // // //       }
// // // //       return acc;
// // // //     }, {});

// // // //     // Alertes panne
// // // //     const alertesPanne = safeFilter(alertesArray, a => {
// // // //       const type = (a.type_alerte || '').toString().toLowerCase();
// // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // //       const isActive = statut.includes('nouvelle') || 
// // // //                        statut.includes('en_traitement') || 
// // // //                        statut.includes('active') ||
// // // //                        statut.includes('ouvert') ||
// // // //                        !statut;
// // // //       return isActive && (type.includes('panne') || type.includes('matériel'));
// // // //     }).length;

// // // //     // Alertes maintenance
// // // //     const alertesMaintenance = safeFilter(alertesArray, a => {
// // // //       const type = (a.type_alerte || '').toString().toLowerCase();
// // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // //       const isActive = statut.includes('nouvelle') || 
// // // //                        statut.includes('en_traitement') || 
// // // //                        statut.includes('active') ||
// // // //                        statut.includes('ouvert') ||
// // // //                        !statut;
// // // //       return isActive && type.includes('maintenance');
// // // //     }).length;

// // // //     // Équipements réseau par type
// // // //     const reseauParType = safeReduce(reseauArray, (acc, r) => {
// // // //       const type = r.type || r.categorie || 'Autre';
// // // //       acc[type] = (acc[type] || 0) + 1;
// // // //       return acc;
// // // //     }, {});

// // // //     // ÉQUIPEMENTS RÉSEAU PAR STATUT - Classification améliorée
// // // //     const reseauParStatut = safeReduce(reseauArray, (acc, r) => {
// // // //       const etat = (r.etat || '').toString().toLowerCase();
// // // //       const statut = (r.statut || '').toString().toLowerCase();
// // // //       const description = (r.description || '').toString().toLowerCase();
      
// // // //       let statutNormalise = 'Fonctionnel';
      
// // // //       // Détection des statuts réseau
// // // //       if (etat.includes('instable') || statut.includes('instable') || 
// // // //           etat.includes('intermittent') || statut.includes('intermittent') ||
// // // //           description.includes('instable') || description.includes('intermittent') ||
// // // //           etat.includes('fluctuant') || etat.includes('variable')) {
// // // //         statutNormalise = 'Connexion instable';
// // // //       } else if (etat.includes('maintenance') || statut.includes('maintenance') ||
// // // //                  etat.includes('réparation') || statut.includes('réparation') ||
// // // //                  description.includes('maintenance') || description.includes('réparation') ||
// // // //                  etat.includes('en cours de maintenance') || etat.includes('en réparation')) {
// // // //         statutNormalise = 'Maintenance';
// // // //       } else if (etat.includes('déconnecté') || statut.includes('déconnecté') ||
// // // //                  etat.includes('hors ligne') || statut.includes('hors ligne') ||
// // // //                  etat.includes('panne') || statut.includes('panne') ||
// // // //                  etat.includes('down') || statut.includes('down') ||
// // // //                  description.includes('déconnecté') || description.includes('hors service') ||
// // // //                  etat.includes('non connecté') || etat.includes('inactif') ||
// // // //                  etat.includes('offline')) {
// // // //         statutNormalise = 'Déconnexion du réseau';
// // // //       } else if (etat.includes('fonctionnel') || statut.includes('fonctionnel') ||
// // // //                  etat.includes('actif') || statut.includes('actif') ||
// // // //                  etat.includes('opérationnel') || statut.includes('opérationnel') ||
// // // //                  description.includes('fonctionnel') || description.includes('actif') ||
// // // //                  etat.includes('en service') || etat.includes('online') ||
// // // //                  !etat.includes('panne') && !etat.includes('déconnecté') && !etat.includes('instable')) {
// // // //         statutNormalise = 'Fonctionnel';
// // // //       }
      
// // // //       acc[statutNormalise] = (acc[statutNormalise] || 0) + 1;
// // // //       return acc;
// // // //     }, {});

// // // //     const reseauFonctionnel = safeFilter(reseauArray, r => {
// // // //       const etat = (r.etat || '').toString().toLowerCase();
// // // //       const statut = (r.statut || '').toString().toLowerCase();
// // // //       return etat.includes('fonctionnel') || 
// // // //              etat.includes('actif') ||
// // // //              statut.includes('actif') ||
// // // //              statut.includes('fonctionnel') ||
// // // //              !etat.includes('panne') && !etat.includes('déconnecté') && !etat.includes('instable');
// // // //     }).length;

// // // //     const reseauPanne = safeFilter(reseauArray, r => {
// // // //       const etat = (r.etat || '').toString().toLowerCase();
// // // //       return etat.includes('panne') || 
// // // //              etat.includes('défectueux') ||
// // // //              etat.includes('hors service') ||
// // // //              etat.includes('déconnecté');
// // // //     }).length;

// // // //     // Calcul des taux
// // // //     const tauxDisponibilite = materielsArray.length > 0 ? 
// // // //       (materielsFonctionnels / materielsArray.length * 100).toFixed(1) : 0;

// // // //     const incidentsTotal = incidentsArray.length;
// // // //     const incidentsResolus = safeFilter(incidentsArray, i => {
// // // //       const statut = (i.statut || '').toString().toLowerCase();
// // // //       return statut.includes('résolu') || 
// // // //              statut.includes('fermé') ||
// // // //              statut.includes('traité') ||
// // // //              statut.includes('terminé') ||
// // // //              statut.includes('clôturé');
// // // //     }).length;

// // // //     const tauxResolution = incidentsTotal > 0 ? 
// // // //       (incidentsResolus / incidentsTotal * 100).toFixed(1) : 100;

// // // //     const coutTotal = safeReduce(reparationsArray, (sum, r) => 
// // // //       sum + (parseFloat(r.cout) || 0), 0
// // // //     );

// // // //     // Incidents ouverts
// // // //     const incidentsOuverts = safeFilter(incidentsArray, i => {
// // // //       const statut = (i.statut || '').toString().toLowerCase();
// // // //       return statut.includes('ouvert') || 
// // // //              statut.includes('en cours') ||
// // // //              statut.includes('nouveau') ||
// // // //              (!statut.includes('résolu') && !statut.includes('fermé') && !statut.includes('terminé'));
// // // //     }).length;

// // // //     // Alertes actives
// // // //     const alertesActives = safeFilter(alertesArray, a => {
// // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // //       return statut.includes('nouvelle') || 
// // // //              statut.includes('en_traitement') || 
// // // //              statut.includes('active') ||
// // // //              statut.includes('ouvert') ||
// // // //              !statut;
// // // //     }).length;

// // // //     // Alertes critiques
// // // //     const alertesCritiques = safeFilter(alertesArray, a => {
// // // //       const severite = (a.severite || '').toString().toLowerCase();
// // // //       const statut = (a.statut || '').toString().toLowerCase();
// // // //       const isActive = statut.includes('nouvelle') || 
// // // //                        statut.includes('en_traitement') || 
// // // //                        statut.includes('active') ||
// // // //                        statut.includes('ouvert') ||
// // // //                        !statut;
// // // //       return isActive && (severite.includes('critique') || severite.includes('haute') || severite.includes('élevée'));
// // // //     }).length;

// // // //     // Réparations ce mois
// // // //     const reparationsCeMois = safeFilter(reparationsArray, r => {
// // // //       const date = r.date_reparation || r.date_debut || r.date || r.created_at;
// // // //       if (!date) return false;
// // // //       try {
// // // //         const repDate = new Date(date);
// // // //         const now = new Date();
// // // //         return repDate.getMonth() === now.getMonth() && 
// // // //                repDate.getFullYear() === now.getFullYear();
// // // //       } catch {
// // // //         return false;
// // // //       }
// // // //     }).length;

// // // //     // Logiciels expirés
// // // //     const logicielsExpires = safeFilter(logicielsArray, l => {
// // // //       const expiry = l.date_expiration || l.licence_expire || l.date_fin;
// // // //       if (!expiry) return false;
// // // //       try {
// // // //         return new Date(expiry) < new Date();
// // // //       } catch {
// // // //         return false;
// // // //       }
// // // //     }).length;

// // // //     const calculatedStats = {
// // // //       // Matériels
// // // //       total_materiels: materielsArray.length,
// // // //       materiels_fonctionnels: materielsFonctionnels,
// // // //       materiels_en_panne: materielsEnPanne,
// // // //       materiels_maintenance: materielsMaintenance,
// // // //       materiels_par_service: materielsParService,
// // // //       materiels_par_type: materielsParType,
      
// // // //       // Logiciels
// // // //       total_logiciels: logicielsArray.length,
// // // //       logiciels_actifs: logicielsInstalles,
// // // //       logiciels_installes: logicielsInstalles,
// // // //       logiciels_expires: logicielsExpires,
// // // //       logiciels_par_type: logicielsParType,
      
// // // //       // Incidents
// // // //       incidents_ouverts: incidentsOuverts,
// // // //       incidents_resolus: incidentsResolus,
// // // //       incidents_par_priorite: incidentsParPriorite,
// // // //       incidents_evolution: incidentsEvolution,
      
// // // //       // Réparations
// // // //       reparations_ce_mois: reparationsCeMois,
// // // //       cout_total_reparations: coutTotal,
      
// // // //       // Alertes
// // // //       alertes_actives: alertesActives,
// // // //       alertes_critiques: alertesCritiques,
// // // //       alertes_panne: alertesPanne,
// // // //       alertes_maintenance: alertesMaintenance,
// // // //       alertes_par_type: alertesParType,
// // // //       alertes_par_severite: alertesParSeverite,
      
// // // //       // Réseau
// // // //       total_equipements_reseau: reseauArray.length,
// // // //       reseau_fonctionnel: reseauFonctionnel,
// // // //       reseau_panne: reseauPanne,
// // // //       reseau_par_type: reseauParType,
// // // //       reseau_par_statut: reseauParStatut,
      
// // // //       // Synthèse
// // // //       taux_disponibilite: parseFloat(tauxDisponibilite),
// // // //       taux_resolution: parseFloat(tauxResolution),
// // // //     };

// // // //     console.log('📊 Statistiques calculées:', {
// // // //       materiels: calculatedStats.total_materiels,
// // // //       logiciels: {
// // // //         total: calculatedStats.total_logiciels,
// // // //         installes: calculatedStats.logiciels_installes,
// // // //         types: calculatedStats.logiciels_par_type
// // // //       },
// // // //       reseau: {
// // // //         total: calculatedStats.total_equipements_reseau,
// // // //         statuts: calculatedStats.reseau_par_statut
// // // //       }
// // // //     });
// // // //     setStats(calculatedStats);
// // // //   }, []);

// // // //   // Auto-refresh
// // // //   useEffect(() => {
// // // //     loadData();
    
// // // //     if (autoRefresh) {
// // // //       const interval = setInterval(() => {
// // // //         loadData();
// // // //       }, 30000);
// // // //       return () => clearInterval(interval);
// // // //     }
// // // //   }, [loadData, autoRefresh]);

// // // //   // Données pour les graphiques
// // // //   const chartData = useMemo(() => {
// // // //     // Matériels par Service (4 services)
// // // //     const servicesData = [
// // // //       { service: 'Secrétariat', count: stats.materiels_par_service['Secrétariat'] || 0, fill: '#3b82f6' },
// // // //       { service: 'Direction', count: stats.materiels_par_service['Direction'] || 0, fill: '#8b5cf6' },
// // // //       { service: 'Informatique', count: stats.materiels_par_service['Informatique'] || 0, fill: '#10b981' },
// // // //       { service: 'Archives', count: stats.materiels_par_service['Archives'] || 0, fill: '#f59e0b' },
// // // //     ].filter(item => item.count > 0);

// // // //     // LOGICIELS PAR TYPE - Données formatées
// // // //     const logicielsTypeData = [
// // // //       { type: 'Bureautique', count: stats.logiciels_par_type['Bureautique'] || 0, fill: '#3b82f6' },
// // // //       { type: 'Système d\'exploitation', count: stats.logiciels_par_type['Système d\'exploitation'] || 0, fill: '#8b5cf6' },
// // // //       { type: 'Métier', count: stats.logiciels_par_type['Métier'] || 0, fill: '#10b981' },
// // // //       { type: 'Sécurité', count: stats.logiciels_par_type['Sécurité'] || 0, fill: '#ef4444' },
// // // //       { type: 'Graphisme/Design', count: stats.logiciels_par_type['Graphisme/Design'] || 0, fill: '#ec4899' },
// // // //       { type: 'Base de données', count: stats.logiciels_par_type['Base de données'] || 0, fill: '#06b6d4' },
// // // //       { type: 'Navigateur', count: stats.logiciels_par_type['Navigateur'] || 0, fill: '#f59e0b' },
// // // //       { type: 'Autre', count: stats.logiciels_par_type['Autre'] || 0, fill: '#6b7280' },
// // // //     ].filter(item => item.count > 0);

// // // //     // ÉQUIPEMENTS RÉSEAU PAR STATUT - Données formatées
// // // //     const reseauStatutData = [
// // // //       { statut: 'Fonctionnel', count: stats.reseau_par_statut['Fonctionnel'] || 0, fill: '#10b981' },
// // // //       { statut: 'Connexion instable', count: stats.reseau_par_statut['Connexion instable'] || 0, fill: '#eab308' },
// // // //       { statut: 'Maintenance', count: stats.reseau_par_statut['Maintenance'] || 0, fill: '#f59e0b' },
// // // //       { statut: 'Déconnexion du réseau', count: stats.reseau_par_statut['Déconnexion du réseau'] || 0, fill: '#ef4444' },
// // // //     ].filter(item => item.count > 0);

// // // //     // Données pour Synthèse
// // // //     const syntheseData = [
// // // //       {
// // // //         label: 'Matériels fonctionnels',
// // // //         value: stats.materiels_fonctionnels,
// // // //         icon: Check,
// // // //         color: 'success',
// // // //         description: `${stats.materiels_fonctionnels} / ${stats.total_materiels}`
// // // //       },
// // // //       {
// // // //         label: 'Incidents résolus',
// // // //         value: stats.incidents_resolus,
// // // //         icon: CheckCircle,
// // // //         color: 'success',
// // // //         description: `sur ${stats.incidents_ouverts + stats.incidents_resolus} total`
// // // //       },
// // // //       {
// // // //         label: 'Alertes critiques',
// // // //         value: stats.alertes_critiques,
// // // //         icon: AlertCircle,
// // // //         color: 'error',
// // // //         description: `${stats.alertes_panne} panne, ${stats.alertes_maintenance} maintenance`
// // // //       },
// // // //       {
// // // //         label: 'Réparations ce mois',
// // // //         value: stats.reparations_ce_mois,
// // // //         icon: Wrench,
// // // //         color: 'info',
// // // //         description: `Coût: ${new Intl.NumberFormat('fr-FR').format(stats.cout_total_reparations)} Ar`
// // // //       },
// // // //       {
// // // //         label: 'Logiciels installés',
// // // //         value: stats.logiciels_installes,
// // // //         icon: Package,
// // // //         color: 'success',
// // // //         description: `${stats.logiciels_installes} / ${stats.total_logiciels} actifs`
// // // //       },
// // // //     ];

// // // //     // État des matériels
// // // //     const materielsEtat = [
// // // //       { 
// // // //         name: 'Fonctionnel', 
// // // //         value: stats.materiels_fonctionnels, 
// // // //         color: '#10b981' 
// // // //       },
// // // //       { 
// // // //         name: 'En panne', 
// // // //         value: stats.materiels_en_panne, 
// // // //         color: '#ef4444' 
// // // //       },
// // // //       { 
// // // //         name: 'Maintenance', 
// // // //         value: stats.materiels_maintenance, 
// // // //         color: '#f59e0b' 
// // // //       },
// // // //       { 
// // // //         name: 'Autre', 
// // // //         value: Math.max(0, stats.total_materiels - stats.materiels_fonctionnels - stats.materiels_en_panne - stats.materiels_maintenance), 
// // // //         color: '#6b7280' 
// // // //       },
// // // //     ];

// // // //     return {
// // // //       // Graphique Matériels par Service (4 services)
// // // //       servicesData,
      
// // // //       // Données de synthèse
// // // //       syntheseData,
      
// // // //       // État des matériels (diagramme circulaire)
// // // //       materielsEtat,
      
// // // //       // Évolution des incidents
// // // //       incidentsEvolution: stats.incidents_evolution || [],
      
// // // //       // Logiciels par type
// // // //       logicielsTypeData,
      
// // // //       // Équipements réseau par statut
// // // //       reseauStatutData,
      
// // // //       // Incidents par priorité
// // // //       incidentsPriorite: Object.entries(stats.incidents_par_priorite).map(([priorite, count]) => ({
// // // //         priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
// // // //         count,
// // // //         fill: priorite === 'critique' ? '#ef4444' : 
// // // //               priorite === 'haute' ? '#f97316' : 
// // // //               priorite === 'moyenne' ? '#eab308' : '#22c55e'
// // // //       })),
      
// // // //       // Alertes par sévérité
// // // //       alertesSeverite: Object.entries(stats.alertes_par_severite || {}).map(([severite, count]) => ({
// // // //         severite: severite.charAt(0).toUpperCase() + severite.slice(1),
// // // //         count,
// // // //         fill: severite === 'critique' ? '#ef4444' : 
// // // //               severite === 'haute' ? '#f97316' : 
// // // //               severite === 'moyenne' ? '#eab308' : '#22c55e'
// // // //       })),
// // // //     };
// // // //   }, [stats]);

// // // //   // Fonction pour extraire les données des réponses API
// // // //   const extractData = (response) => {
// // // //     if (!response?.data) return [];
// // // //     if (Array.isArray(response.data)) return response.data;
// // // //     if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// // // //     if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// // // //     if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
// // // //     return [];
// // // //   };

// // // //   // Formater la devise
// // // //   const formatCurrency = (amount) => {
// // // //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// // // //   };

// // // //   // Générer rapport PDF
// // // //   const generateDetailedPDF = async () => {
// // // //     const doc = new jsPDF('landscape');
    
// // // //     try {
// // // //       const imgData = await getBase64Image(logoDren);
// // // //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// // // //     } catch (error) {
// // // //       console.warn('Logo non chargé');
// // // //     }
    
// // // //     doc.setFontSize(20);
// // // //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// // // //     doc.setFontSize(16);
// // // //     doc.text('TABLEAU DE BORD COMPLET', 20, 45);
    
// // // //     doc.setFontSize(12);
// // // //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
// // // //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 67);
    
// // // //     doc.setDrawColor(200, 200, 200);
// // // //     doc.line(20, 75, 190, 75);
    
// // // //     doc.setFontSize(14);
// // // //     doc.text('SYNTHÈSE DES DONNÉES', 20, 90);
    
// // // //     const syntheseStats = [
// // // //       ['Indicateur', 'Valeur', 'Détail'],
// // // //       ['Matériels fonctionnels', stats.materiels_fonctionnels.toString(), `${stats.total_materiels} total`],
// // // //       ['Incidents résolus', stats.incidents_resolus.toString(), `${stats.incidents_ouverts} ouverts`],
// // // //       ['Alertes critiques', stats.alertes_critiques.toString(), `${stats.alertes_actives} actives`],
// // // //       ['Réparations ce mois', stats.reparations_ce_mois.toString(), formatCurrency(stats.cout_total_reparations)],
// // // //       ['Logiciels installés', stats.logiciels_installes.toString(), `${stats.total_logiciels} total`],
// // // //       ['Équipements réseau', stats.total_equipements_reseau.toString(), `${stats.reseau_fonctionnel} fonctionnels`],
// // // //       ['Taux disponibilité', `${stats.taux_disponibilite}%`, 'Matériels'],
// // // //       ['Taux résolution', `${stats.taux_resolution}%`, 'Incidents'],
// // // //     ];
    
// // // //     autoTable(doc, {
// // // //       startY: 95,
// // // //       head: syntheseStats.slice(0, 1),
// // // //       body: syntheseStats.slice(1),
// // // //       theme: 'grid',
// // // //       headStyles: { fillColor: [59, 130, 246] },
// // // //     });
    
// // // //     doc.save(`dashboard-complet-${new Date().toISOString().split('T')[0]}.pdf`);
// // // //     showNotification('Rapport PDF généré avec succès', 'success');
// // // //   };

// // // //   // Composant StatCard
// // // //   const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
// // // //     const colorClasses = {
// // // //       blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
// // // //       purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
// // // //       yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
// // // //       red: { bg: 'bg-red-100', text: 'text-red-600' },
// // // //       indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
// // // //       green: { bg: 'bg-green-100', text: 'text-green-600' },
// // // //       primary: { bg: 'bg-primary/10', text: 'text-primary' },
// // // //       success: { bg: 'bg-success/10', text: 'text-success' },
// // // //       error: { bg: 'bg-error/10', text: 'text-error' },
// // // //       warning: { bg: 'bg-warning/10', text: 'text-warning' },
// // // //       info: { bg: 'bg-info/10', text: 'text-info' },
// // // //     };

// // // //     const colorConfig = colorClasses[color] || colorClasses.primary;

// // // //     return (
// // // //       <div className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 relative">
// // // //         {trend !== undefined && (
// // // //           <div className={`absolute -top-2 -right-2 badge badge-sm ${trend > 0 ? 'badge-success' : 'badge-error'}`}>
// // // //             {trend > 0 ? '+' : ''}{trend}%
// // // //           </div>
// // // //         )}
// // // //         <div className="card-body p-4">
// // // //           <div className="flex items-center justify-between">
// // // //             <div>
// // // //               <h3 className="text-sm font-semibold text-base-content opacity-70">{title}</h3>
// // // //               <p className="text-2xl font-bold mt-1 text-base-content">{value}</p>
// // // //               {subtitle && <p className="text-xs text-base-content opacity-60 mt-1">{subtitle}</p>}
// // // //             </div>
// // // //             <div className={`p-3 rounded-lg ${colorConfig.bg}`}>
// // // //               <Icon className={`h-6 w-6 ${colorConfig.text}`} />
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   };

// // // //   // Composant SyntheseItem
// // // //   const SyntheseItem = ({ label, value, icon: Icon, color = 'primary', description }) => {
// // // //     const colorClasses = {
// // // //       success: { bg: 'bg-success/10', text: 'text-success', icon: 'text-success' },
// // // //       error: { bg: 'bg-error/10', text: 'text-error', icon: 'text-error' },
// // // //       info: { bg: 'bg-info/10', text: 'text-info', icon: 'text-info' },
// // // //       primary: { bg: 'bg-primary/10', text: 'text-primary', icon: 'text-primary' },
// // // //     };

// // // //     const colorConfig = colorClasses[color] || colorClasses.primary;

// // // //     return (
// // // //       <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
// // // //         <div className="flex items-center gap-3">
// // // //           <div className={`p-2 rounded-lg ${colorConfig.bg}`}>
// // // //             <Icon className={`h-5 w-5 ${colorConfig.icon}`} />
// // // //           </div>
// // // //           <div>
// // // //             <span className="font-medium text-base-content">{label}</span>
// // // //             {description && (
// // // //               <p className="text-xs text-base-content opacity-60 mt-1">{description}</p>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //         <span className={`text-2xl font-bold ${colorConfig.text}`}>{value}</span>
// // // //       </div>
// // // //     );
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="flex flex-col items-center justify-center min-h-screen">
// // // //         <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
// // // //         <h2 className="text-xl font-semibold text-base-content">Chargement du tableau de bord...</h2>
// // // //         <p className="text-base-content opacity-70 mt-2">Connexion aux sources de données</p>
// // // //         <div className="mt-4 w-64 bg-base-300 rounded-full h-2">
// // // //           <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
// // // //       {/* En-tête */}
// // // //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
// // // //         <div>
// // // //           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
// // // //             <BarChart3 className="h-8 w-8 text-primary" />
// // // //             Tableau de Bord IT
// // // //             <span className="badge badge-primary badge-lg">DREN Antsimo Andrefana</span>
// // // //           </h1>
// // // //           <p className="text-base-content opacity-70 mt-1">
// // // //             Surveillance complète du parc informatique - Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
// // // //           </p>
// // // //         </div>
        
// // // //         <div className="flex flex-wrap gap-2">
// // // //           <div className="form-control">
// // // //             <label className="label cursor-pointer gap-2">
// // // //               <span className="label-text text-sm text-base-content">Auto-refresh (30s)</span>
// // // //               <input 
// // // //                 type="checkbox" 
// // // //                 className="toggle toggle-primary toggle-sm"
// // // //                 checked={autoRefresh}
// // // //                 onChange={(e) => setAutoRefresh(e.target.checked)}
// // // //               />
// // // //             </label>
// // // //           </div>
          
// // // //           <div className="dropdown dropdown-end">
// // // //             <button className="btn btn-primary btn-sm">
// // // //               <Download className="h-4 w-4 mr-2" />
// // // //               Exporter
// // // //             </button>
// // // //             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// // // //               <li><button onClick={generateDetailedPDF}>Rapport PDF</button></li>
// // // //               <li><button onClick={() => showNotification('Fonctionnalité à venir', 'info')}>Excel</button></li>
// // // //             </ul>
// // // //           </div>
          
// // // //           <button 
// // // //             onClick={loadData}
// // // //             className="btn btn-outline btn-sm text-base-content"
// // // //             disabled={loading}
// // // //           >
// // // //             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
// // // //             {loading ? 'Actualisation...' : 'Actualiser'}
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Statistiques principales */}
// // // //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
// // // //         <StatCard
// // // //           title="Matériels"
// // // //           value={stats.total_materiels}
// // // //           icon={Database}
// // // //           color="blue"
// // // //           subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
// // // //         />
        
// // // //         <StatCard
// // // //           title="Logiciels"
// // // //           value={stats.total_logiciels}
// // // //           icon={Package}
// // // //           color="purple"
// // // //           subtitle={`${stats.logiciels_installes} installés`}
// // // //         />
        
// // // //         <StatCard
// // // //           title="Alertes"
// // // //           value={stats.alertes_actives}
// // // //           icon={Bell}
// // // //           color="yellow"
// // // //           subtitle={`${stats.alertes_critiques} critiques`}
// // // //         />
        
// // // //         <StatCard
// // // //           title="Incidents"
// // // //           value={stats.incidents_ouverts}
// // // //           icon={AlertTriangle}
// // // //           color="red"
// // // //           subtitle={`${stats.incidents_resolus} résolus`}
// // // //         />
        
// // // //         <StatCard
// // // //           title="Équipements Réseau"
// // // //           value={stats.total_equipements_reseau}
// // // //           icon={Network}
// // // //           color="indigo"
// // // //           subtitle={`${stats.reseau_fonctionnel} fonctionnels`}
// // // //         />
        
// // // //         <StatCard
// // // //           title="Coût Réparations"
// // // //           value={formatCurrency(stats.cout_total_reparations)}
// // // //           icon={DollarSign}
// // // //           color="green"
// // // //           subtitle={`${stats.reparations_ce_mois} ce mois`}
// // // //         />
// // // //       </div>

// // // //       {/* Graphiques et Synthèse */}
// // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // // //         {/* Matériels par Service */}
// // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // //           <div className="card-body">
// // // //             <h3 className="card-title text-base-content">
// // // //               <Users className="h-5 w-5 mr-2" />
// // // //               Matériels par Service
// // // //               <span className="badge badge-primary ml-2">
// // // //                 {Object.keys(stats.materiels_par_service).length} services
// // // //               </span>
// // // //             </h3>
// // // //             <ResponsiveContainer width="100%" height={300}>
// // // //               <BarChart data={chartData.servicesData}>
// // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // //                 <XAxis 
// // // //                   dataKey="service" 
// // // //                   stroke="#9CA3AF"
// // // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // // //                 />
// // // //                 <YAxis 
// // // //                   stroke="#9CA3AF"
// // // //                   tick={{ fill: '#9CA3AF' }}
// // // //                 />
// // // //                 <Tooltip 
// // // //                   contentStyle={{ 
// // // //                     backgroundColor: '#1F2937', 
// // // //                     borderColor: '#374151', 
// // // //                     color: '#F9FAFB',
// // // //                     borderRadius: '8px',
// // // //                     padding: '10px'
// // // //                   }}
// // // //                   formatter={(value) => [`${value} matériels`, 'Quantité']}
// // // //                 />
// // // //                 <Legend />
// // // //                 <Bar 
// // // //                   dataKey="count" 
// // // //                   name="Matériels"
// // // //                   radius={[4, 4, 0, 0]}
// // // //                 >
// // // //                   {chartData.servicesData.map((entry, index) => (
// // // //                     <Cell 
// // // //                       key={`cell-${index}`} 
// // // //                       fill={entry.fill}
// // // //                       stroke={entry.fill}
// // // //                       strokeWidth={1}
// // // //                     />
// // // //                   ))}
// // // //                 </Bar>
// // // //               </BarChart>
// // // //             </ResponsiveContainer>
// // // //           </div>
// // // //         </div>

// // // //         {/* État des Matériels */}
// // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // //           <div className="card-body">
// // // //             <h3 className="card-title text-base-content">
// // // //               <PieChartIcon className="h-5 w-5 mr-2" />
// // // //               État des Matériels
// // // //             </h3>
// // // //             <ResponsiveContainer width="100%" height={300}>
// // // //               <PieChart>
// // // //                 <Pie
// // // //                   data={chartData.materielsEtat}
// // // //                   cx="50%"
// // // //                   cy="50%"
// // // //                   labelLine={false}
// // // //                   label={({ name, value }) => `${name}: ${value}`}
// // // //                   outerRadius={80}
// // // //                   dataKey="value"
// // // //                 >
// // // //                   {chartData.materielsEtat.map((entry, index) => (
// // // //                     <Cell key={`cell-${index}`} fill={entry.color} />
// // // //                   ))}
// // // //                 </Pie>
// // // //                 <Tooltip />
// // // //                 <Legend />
// // // //               </PieChart>
// // // //             </ResponsiveContainer>
// // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // //               Taux de disponibilité: {stats.taux_disponibilite}%
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Logiciels par Type */}
// // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // //           <div className="card-body">
// // // //             <h3 className="card-title text-base-content">
// // // //               <Package className="h-5 w-5 mr-2" />
// // // //               Logiciels par Type
// // // //               <span className="badge badge-success ml-2">{stats.logiciels_installes} installés</span>
// // // //             </h3>
// // // //             <ResponsiveContainer width="100%" height={300}>
// // // //               <BarChart data={chartData.logicielsTypeData}>
// // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // //                 <XAxis 
// // // //                   dataKey="type" 
// // // //                   stroke="#9CA3AF"
// // // //                   tick={{ fill: '#9CA3AF', fontSize: 11 }}
// // // //                   angle={-45}
// // // //                   textAnchor="end"
// // // //                   height={70}
// // // //                 />
// // // //                 <YAxis stroke="#9CA3AF" />
// // // //                 <Tooltip 
// // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // //                   formatter={(value) => [`${value} logiciels`, 'Quantité']}
// // // //                 />
// // // //                 <Legend />
// // // //                 <Bar 
// // // //                   dataKey="count" 
// // // //                   name="Logiciels"
// // // //                   radius={[4, 4, 0, 0]}
// // // //                 >
// // // //                   {chartData.logicielsTypeData.map((entry, index) => (
// // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // //                   ))}
// // // //                 </Bar>
// // // //               </BarChart>
// // // //             </ResponsiveContainer>
// // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // //               {stats.total_logiciels} logiciels au total • {stats.logiciels_expires} licences expirées
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Équipements Réseau par Statut */}
// // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // //           <div className="card-body">
// // // //             <h3 className="card-title text-base-content">
// // // //               <Network className="h-5 w-5 mr-2" />
// // // //               Équipements Réseau par Statut
// // // //               <span className="badge badge-info ml-2">{stats.total_equipements_reseau} équipements</span>
// // // //             </h3>
// // // //             <ResponsiveContainer width="100%" height={300}>
// // // //               <BarChart data={chartData.reseauStatutData}>
// // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // //                 <XAxis 
// // // //                   dataKey="statut" 
// // // //                   stroke="#9CA3AF"
// // // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // // //                 />
// // // //                 <YAxis stroke="#9CA3AF" />
// // // //                 <Tooltip 
// // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // //                   formatter={(value) => [`${value} équipements`, 'Quantité']}
// // // //                 />
// // // //                 <Legend />
// // // //                 <Bar 
// // // //                   dataKey="count" 
// // // //                   name="Équipements"
// // // //                   radius={[4, 4, 0, 0]}
// // // //                 >
// // // //                   {chartData.reseauStatutData.map((entry, index) => (
// // // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // // //                   ))}
// // // //                 </Bar>
// // // //               </BarChart>
// // // //             </ResponsiveContainer>
// // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // //               {stats.reseau_fonctionnel} fonctionnels • {stats.reseau_panne} en panne
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* SYSTHÈSE DES DONNÉES */}
// // // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // // //           <div className="card-body">
// // // //             <h3 className="card-title text-base-content">
// // // //               <Database className="h-5 w-5 mr-2" />
// // // //               Synthèse des Données
// // // //               <span className="badge badge-info ml-2">Indicateurs clés</span>
// // // //             </h3>
            
// // // //             <div className="space-y-3 mb-6">
// // // //               {chartData.syntheseData.map((item, index) => (
// // // //                 <SyntheseItem
// // // //                   key={index}
// // // //                   label={item.label}
// // // //                   value={item.value}
// // // //                   icon={item.icon}
// // // //                   color={item.color}
// // // //                   description={item.description}
// // // //                 />
// // // //               ))}
// // // //             </div>
            
// // // //             {/* Taux de performance */}
// // // //             <div className="p-4 bg-base-200 rounded-lg">
// // // //               <h4 className="font-medium text-base-content mb-3">Performances système</h4>
// // // //               <div className="space-y-3">
// // // //                 <div>
// // // //                   <div className="flex justify-between text-sm text-base-content mb-1">
// // // //                     <span>Disponibilité matériels</span>
// // // //                     <span className="font-semibold">{stats.taux_disponibilite}%</span>
// // // //                   </div>
// // // //                   <div className="w-full bg-base-300 rounded-full h-2">
// // // //                     <div 
// // // //                       className={`h-2 rounded-full ${stats.taux_disponibilite > 80 ? 'bg-success' : stats.taux_disponibilite > 60 ? 'bg-warning' : 'bg-error'}`}
// // // //                       style={{ width: `${Math.min(stats.taux_disponibilite, 100)}%` }}
// // // //                     />
// // // //                   </div>
// // // //                 </div>
                
// // // //                 <div>
// // // //                   <div className="flex justify-between text-sm text-base-content mb-1">
// // // //                     <span>Résolution incidents</span>
// // // //                     <span className="font-semibold">{stats.taux_resolution}%</span>
// // // //                   </div>
// // // //                   <div className="w-full bg-base-300 rounded-full h-2">
// // // //                     <div 
// // // //                       className="bg-success h-2 rounded-full"
// // // //                       style={{ width: `${Math.min(stats.taux_resolution, 100)}%` }}
// // // //                     />
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Évolution des incidents */}
// // // //         {/* <div className="card-body">
// // // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // // //               Incidents par priorité */}
// // // //               <div>
// // // //                 <h3 className="card-title text-base-content mb-4">
// // // //                   <BarChart3 className="h-5 w-5 mr-2" />
// // // //                   Incidents par Priorité
// // // //                 </h3>
// // // //                 <ResponsiveContainer width="100%" height={250}>
// // // //                   <BarChart data={chartData.incidentsPriorite}>
// // // //                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // //                     <XAxis dataKey="priorite" stroke="#9CA3AF" />
// // // //                     <YAxis stroke="#9CA3AF" />
// // // //                     <Tooltip 
// // // //                       contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // //                     />
// // // //                     <Legend />
// // // //                     <Bar dataKey="count" name="Incidents">
// // // //                       {chartData.incidentsPriorite.map((entry, index) => (
// // // //                         <Cell key={`cell-${index}`} fill={entry.fill} />
// // // //                       ))}
// // // //                     </Bar>
// // // //                   </BarChart>
// // // //                 </ResponsiveContainer>
// // // //               </div>
// // // //         <div className="card-body">
// // // //             <h3 className="card-title text-base-content">
// // // //               <LineChartIcon className="h-5 w-5 mr-2" />
// // // //               Évolution des Incidents (30 jours)
// // // //             </h3>
// // // //             <ResponsiveContainer width="100%" height={300}>
// // // //               <AreaChart data={chartData.incidentsEvolution}>
// // // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // // //                 <XAxis dataKey="date" stroke="#9CA3AF" />
// // // //                 <YAxis stroke="#9CA3AF" />
// // // //                 <Tooltip 
// // // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // // //                 />
// // // //                 <Legend />
// // // //                 <Area 
// // // //                   type="monotone" 
// // // //                   dataKey="incidents" 
// // // //                   stroke="#ef4444" 
// // // //                   fill="#ef4444"
// // // //                   fillOpacity={0.3}
// // // //                   name="Incidents"
// // // //                 />
// // // //               </AreaChart>
// // // //             </ResponsiveContainer>
// // // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // // //               Moyenne: {chartData.incidentsEvolution.length > 0 ? 
// // // //                 Math.round(chartData.incidentsEvolution.reduce((sum, day) => sum + day.incidents, 0) / chartData.incidentsEvolution.length) : 0} incidents/jour
// // // //             </div>
// // // //           </div>
// // // //       </div>



// // // //       {/* Informations système */}
// // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // //         <div className="card bg-base-200 border border-base-300">
// // // //           <div className="card-body">
// // // //             <h3 className="card-title text-base-content">
// // // //               <Info className="h-5 w-5 mr-2" />
// // // //               Informations système
// // // //             </h3>
// // // //             <div className="space-y-3 text-sm">
// // // //               <div className="flex justify-between">
// // // //                 <span className="font-medium text-base-content">Données chargées:</span>
// // // //                 <span className="text-base-content">
// // // //                   {safeArray(materiels).length} matériels, {safeArray(logiciels).length} logiciels
// // // //                 </span>
// // // //               </div>
// // // //               <div className="flex justify-between">
// // // //                 <span className="font-medium text-base-content">Services actifs:</span>
// // // //                 <span className="text-base-content">
// // // //                   {Object.keys(stats.materiels_par_service).length} services
// // // //                 </span>
// // // //               </div>
// // // //               <div className="flex justify-between">
// // // //                 <span className="font-medium text-base-content">Utilisateur:</span>
// // // //                 <span className="text-base-content">{user?.nom_complet || user?.username || 'Non connecté'}</span>
// // // //               </div>
// // // //               <div className="flex justify-between">
// // // //                 <span className="font-medium text-base-content">Auto-refresh:</span>
// // // //                 <span className="text-base-content">{autoRefresh ? 'Activé (30s)' : 'Désactivé'}</span>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
        
// // // //         <div className="card bg-base-200 border border-base-300">
// // // //           <div className="card-body">
// // // //             <h3 className="card-title text-base-content">
// // // //               <AlertCircle className="h-5 w-5 mr-2" />
// // // //               Recommandations & Alertes
// // // //             </h3>
// // // //             <div className="space-y-2 text-sm">
// // // //               {stats.materiels_en_panne > 0 && (
// // // //                 <div className="alert alert-error">
// // // //                   <AlertTriangle className="h-4 w-4" />
// // // //                   <span className="text-base-content">🚨 {stats.materiels_en_panne} matériel(s) en panne nécessite(nt) intervention</span>
// // // //                 </div>
// // // //               )}
// // // //               {stats.alertes_critiques > 0 && (
// // // //                 <div className="alert alert-warning">
// // // //                   <Shield className="h-4 w-4" />
// // // //                   <span className="text-base-content">⚠️ {stats.alertes_critiques} alerte(s) critique(s) en attente</span>
// // // //                 </div>
// // // //               )}
// // // //               {stats.logiciels_expires > 0 && (
// // // //                 <div className="alert alert-info">
// // // //                   <Package className="h-4 w-4" />
// // // //                   <span className="text-base-content">📅 {stats.logiciels_expires} licence(s) logiciel(s) expirée(s)</span>
// // // //                 </div>
// // // //               )}
// // // //               {stats.reseau_panne > 0 && (
// // // //                 <div className="alert alert-warning">
// // // //                   <Network className="h-4 w-4" />
// // // //                   <span className="text-base-content">🌐 {stats.reseau_panne} équipement(s) réseau en panne</span>
// // // //                 </div>
// // // //               )}
// // // //               {stats.materiels_en_panne === 0 && stats.alertes_critiques === 0 && (
// // // //                 <div className="alert alert-success">
// // // //                   <CheckCircle className="h-4 w-4" />
// // // //                   <span className="text-base-content">✅ Tous les systèmes sont opérationnels</span>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // Fonction pour convertir une image en base64
// // // // const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
// // // //   const img = new Image();
// // // //   img.crossOrigin = 'Anonymous';
// // // //   img.onload = () => {
// // // //     const canvas = document.createElement('canvas');
// // // //     const ctx = canvas.getContext('2d');
// // // //     canvas.width = img.width;
// // // //     canvas.height = img.height;
// // // //     ctx.drawImage(img, 0, 0);
// // // //     resolve(canvas.toDataURL('image/jpeg'));
// // // //   };
// // // //   img.onerror = reject;
// // // //   img.src = imgUrl;
// // // // });

// // // // export default Dashboard;




// // // // src/pages/Dashboard.jsx - VERSION CORRIGÉE
// // // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // // import { 
// // //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// // //   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
// // //   AreaChart, Area
// // // } from 'recharts';
// // // import { 
// // //   BarChart3, RefreshCw, Users, 
// // //   AlertTriangle, CheckCircle,
// // //   Database, Bell, Package, 
// // //   Network, Wrench,
// // //   PieChart as PieChartIcon,
// // //   LineChart as LineChartIcon, Info, 
// // //   Shield, DollarSign,
// // //   AlertCircle,
// // //   Check,
// // //   Download,
// // //   Monitor, Server, Cpu, TrendingUp
// // // } from 'lucide-react';
// // // import { 
// // //   materielsAPI, 
// // //   incidentsAPI, 
// // //   reparationsAPI, 
// // //   logicielsAPI, 
// // //   alertesAPI, 
// // //   reseauAPI 
// // // } from '../services/api';
// // // import { useAuth } from '../context/AuthContext';
// // // import { useNotification } from '../context/NotificationContext';
// // // import jsPDF from 'jspdf';
// // // import autoTable from 'jspdf-autotable';

// // // // Import du logo
// // // import logoDren from '../assets/images/logo-dren.jpeg';

// // // // COULEURS FIXES POUR CHAQUE SERVICE
// // // const SERVICE_COLORS = {
// // //   'Secrétariat': '#3b82f6',
// // //   'Direction': '#8b5cf6',
// // //   'Informatique': '#10b981',
// // //   'Archives': '#f59e0b',
// // //   'Non assigné': '#9ca3af',
// // //   'Autre': '#6b7280',
// // // };

// // // // Fonction pour convertir une image en base64 (déclarer avant l'utilisation)
// // // const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
// // //   const img = new Image();
// // //   img.crossOrigin = 'Anonymous';
// // //   img.onload = () => {
// // //     const canvas = document.createElement('canvas');
// // //     const ctx = canvas.getContext('2d');
// // //     canvas.width = img.width;
// // //     canvas.height = img.height;
// // //     ctx.drawImage(img, 0, 0);
// // //     resolve(canvas.toDataURL('image/jpeg'));
// // //   };
// // //   img.onerror = reject;
// // //   img.src = imgUrl;
// // // });

// // // const Dashboard = () => {
// // //   const { user } = useAuth();
// // //   const { showNotification } = useNotification();
  
// // //   // États principaux
// // //   const [stats, setStats] = useState({
// // //     total_materiels: 0,
// // //     materiels_fonctionnels: 0,
// // //     materiels_en_panne: 0,
// // //     materiels_maintenance: 0,
// // //     materiels_par_service: {},
// // //     materiels_par_type: {},
    
// // //     total_logiciels: 0,
// // //     logiciels_actifs: 0,
// // //     logiciels_installes: 0,
// // //     logiciels_expires: 0,
// // //     logiciels_par_type: {},
    
// // //     incidents_ouverts: 0,
// // //     incidents_resolus: 0,
// // //     incidents_par_priorite: {},
// // //     incidents_evolution: [],
// // //     taux_resolution_incidents: 0,
    
// // //     reparations_ce_mois: 0,
// // //     cout_total_reparations: 0,
// // //     cout_reparations_ce_mois: 0,
    
// // //     alertes_actives: 0,
// // //     alertes_critiques: 0,
// // //     alertes_panne: 0,
// // //     alertes_maintenance: 0,
// // //     alertes_par_type: {},
// // //     alertes_par_severite: {},
    
// // //     total_equipements_reseau: 0,
// // //     reseau_fonctionnel: 0,
// // //     reseau_panne: 0,
// // //     reseau_par_type: {},
// // //     reseau_par_statut: {},
    
// // //     taux_disponibilite: 0,
// // //     taux_satisfaction: 0,
// // //   });
  
// // //   // États pour les données brutes
// // //   const [materiels, setMateriels] = useState([]);
// // //   const [incidents, setIncidents] = useState([]);
// // //   const [reparations, setReparations] = useState([]);
// // //   const [logiciels, setLogiciels] = useState([]);
// // //   const [alertes, setAlertes] = useState([]);
// // //   const [reseau, setReseau] = useState([]);
  
// // //   // États UI
// // //   const [loading, setLoading] = useState(true);
// // //   const [autoRefresh, setAutoRefresh] = useState(false);
// // //   const [lastUpdate, setLastUpdate] = useState(null);

// // //   // Fonctions helper
// // //   const safeArray = (data) => Array.isArray(data) ? data : [];
// // //   const safeFilter = (array, condition) => array?.filter?.(condition) || [];
// // //   const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

// // //   // Fonction pour extraire les données des réponses API
// // //   const extractData = useCallback((response) => {
// // //     if (!response) return [];
    
// // //     if (Array.isArray(response)) return response;
    
// // //     if (response?.data) {
// // //       if (Array.isArray(response.data)) return response.data;
// // //       if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// // //       if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// // //       if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
// // //     }
    
// // //     return [];
// // //   }, []);

// // //   // Formater la devise en Ariary - DÉPLACÉ AVANT SON UTILISATION
// // //   const formatCurrency = useCallback((amount) => {
// // //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// // //   }, []);

// // //   // Charger les données depuis les API
// // //   const loadData = useCallback(async () => {
// // //     try {
// // //       setLoading(true);
// // //       console.log('📊 Chargement des données dashboard depuis les API...');

// // //       const [
// // //         materielsResponse,
// // //         incidentsResponse,
// // //         reparationsResponse,
// // //         logicielsResponse,
// // //         alertesResponse,
// // //         reseauResponse
// // //       ] = await Promise.allSettled([
// // //         materielsAPI.getAll().catch(e => {
// // //           console.error('❌ Erreur matériels:', e);
// // //           return { data: [] };
// // //         }),
// // //         incidentsAPI.getAll().catch(e => {
// // //           console.error('❌ Erreur incidents:', e);
// // //           return { data: [] };
// // //         }),
// // //         reparationsAPI.getAll().catch(e => {
// // //           console.error('❌ Erreur réparations:', e);
// // //           return { data: [] };
// // //         }),
// // //         logicielsAPI.getAll().catch(e => {
// // //           console.error('❌ Erreur logiciels:', e);
// // //           return { data: [] };
// // //         }),
// // //         alertesAPI.getAll().catch(e => {
// // //           console.error('❌ Erreur alertes:', e);
// // //           return { data: [] };
// // //         }),
// // //         reseauAPI.getAll().catch(e => {
// // //           console.error('❌ Erreur réseau:', e);
// // //           return { data: [] };
// // //         })
// // //       ]);

// // //       // Extraire les données
// // //       const materielsData = extractData(materielsResponse.value);
// // //       const incidentsData = extractData(incidentsResponse.value);
// // //       const reparationsData = extractData(reparationsResponse.value);
// // //       const logicielsData = extractData(logicielsResponse.value);
// // //       const alertesData = extractData(alertesResponse.value);
// // //       const reseauData = extractData(reseauResponse.value);

// // //       console.log('📦 Données reçues:', {
// // //         materiels: materielsData.length,
// // //         incidents: incidentsData.length,
// // //         reparations: reparationsData.length,
// // //         logiciels: logicielsData.length,
// // //         alertes: alertesData.length,
// // //         reseau: reseauData.length
// // //       });

// // //       // Mettre à jour les états
// // //       setMateriels(materielsData);
// // //       setIncidents(incidentsData);
// // //       setReparations(reparationsData);
// // //       setLogiciels(logicielsData);
// // //       setAlertes(alertesData);
// // //       setReseau(reseauData);

// // //       // Calculer les statistiques
// // //       calculateStats({
// // //         materiels: materielsData,
// // //         incidents: incidentsData,
// // //         reparations: reparationsData,
// // //         logiciels: logicielsData,
// // //         alertes: alertesData,
// // //         reseau: reseauData
// // //       });
      
// // //       setLastUpdate(new Date());
// // //       showNotification('Tableau de bord actualisé', 'success');

// // //     } catch (error) {
// // //       console.error('❌ Erreur générale:', error);
// // //       showNotification('Erreur lors du chargement', 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [extractData, showNotification]);

// // //   // Calculer les statistiques
// // //   const calculateStats = useCallback((data) => {
// // //     const {
// // //       materiels: materielsArray,
// // //       incidents: incidentsArray,
// // //       reparations: reparationsArray,
// // //       logiciels: logicielsArray,
// // //       alertes: alertesArray,
// // //       reseau: reseauArray
// // //     } = data;

// // //     // === MATÉRIELS ===
// // //     const materielsFonctionnels = safeFilter(materielsArray, m => {
// // //       const etat = (m.etat || '').toString().toLowerCase();
// // //       return etat.includes('fonctionnel') || 
// // //              etat.includes('actif') || 
// // //              etat.includes('opérationnel') ||
// // //              etat.includes('en service') ||
// // //              etat === 'bon' ||
// // //              etat === 'good';
// // //     }).length;

// // //     const materielsEnPanne = safeFilter(materielsArray, m => {
// // //       const etat = (m.etat || '').toString().toLowerCase();
// // //       return etat.includes('panne') || 
// // //              etat.includes('défectueux') || 
// // //              etat.includes('hors service');
// // //     }).length;

// // //     const materielsMaintenance = safeFilter(materielsArray, m => {
// // //       const etat = (m.etat || '').toString().toLowerCase();
// // //       return etat.includes('maintenance') || 
// // //              etat.includes('réparation') || 
// // //              etat.includes('en réparation');
// // //     }).length;

// // //     const materielsParService = safeReduce(materielsArray, (acc, m) => {
// // //       const service = m.service || m.departement || m.service_attribue || m.direction || 'Non assigné';
      
// // //       let serviceNormalise = 'Autre';
// // //       const serviceLower = service.toLowerCase();
      
// // //       if (serviceLower.includes('secrétariat') || serviceLower.includes('secretariat')) {
// // //         serviceNormalise = 'Secrétariat';
// // //       } else if (serviceLower.includes('direction') || serviceLower.includes('dir')) {
// // //         serviceNormalise = 'Direction';
// // //       } else if (serviceLower.includes('informatique') || serviceLower.includes('it') || serviceLower.includes('info')) {
// // //         serviceNormalise = 'Informatique';
// // //       } else if (serviceLower.includes('archives') || serviceLower.includes('archive')) {
// // //         serviceNormalise = 'Archives';
// // //       } else {
// // //         serviceNormalise = 'Autre';
// // //       }
      
// // //       acc[serviceNormalise] = (acc[serviceNormalise] || 0) + 1;
// // //       return acc;
// // //     }, {});

// // //     // === LOGICIELS ===
// // //     const logicielsInstalles = safeFilter(logicielsArray, l => {
// // //       const statut = (l.statut || '').toString().toLowerCase();
// // //       const etat = (l.etat || '').toString().toLowerCase();
// // //       const licence = (l.licence_active || '').toString().toLowerCase();
// // //       const installe = (l.installe || '').toString().toLowerCase();
      
// // //       return statut.includes('installé') || 
// // //              statut.includes('installe') ||
// // //              statut.includes('actif') ||
// // //              statut.includes('activé') ||
// // //              etat.includes('installé') ||
// // //              etat.includes('actif') ||
// // //              licence === 'true' ||
// // //              licence === 'oui' ||
// // //              licence === 'actif' ||
// // //              installe === 'true' ||
// // //              installe === 'oui' ||
// // //              l.actif === true ||
// // //              l.statut === 'actif' ||
// // //              l.etat === 'installé';
// // //     }).length;

// // //     const logicielsParType = safeReduce(logicielsArray, (acc, l) => {
// // //       const nom = (l.nom || '').toString().toLowerCase();
// // //       const categorie = (l.categorie || '').toString().toLowerCase();
      
// // //       let typeNormalise = 'Autre';
      
// // //       if (nom.includes('office') || nom.includes('word') || nom.includes('excel') || 
// // //           nom.includes('powerpoint') || categorie.includes('bureautique')) {
// // //         typeNormalise = 'Bureautique';
// // //       } else if (nom.includes('windows') || nom.includes('linux') || nom.includes('ubuntu') || 
// // //                  categorie.includes('système') || categorie.includes('os')) {
// // //         typeNormalise = 'Système d\'exploitation';
// // //       } else if (nom.includes('antivirus') || nom.includes('firewall') || 
// // //                  categorie.includes('sécurité') || categorie.includes('security')) {
// // //         typeNormalise = 'Sécurité';
// // //       } else if (categorie.includes('métier') || categorie.includes('metier') ||
// // //                  nom.includes('compta') || nom.includes('gestion')) {
// // //         typeNormalise = 'Métier';
// // //       } else if (nom.includes('adobe') || nom.includes('photoshop') || 
// // //                  categorie.includes('graphisme') || categorie.includes('design')) {
// // //         typeNormalise = 'Graphisme/Design';
// // //       }
      
// // //       acc[typeNormalise] = (acc[typeNormalise] || 0) + 1;
// // //       return acc;
// // //     }, {});
    

// // //     // === INCIDENTS ===
// // //     const incidentsResolus = safeFilter(incidentsArray, i => {
// // //       const statut = (i.statut || '').toString().toLowerCase();
// // //       return statut.includes('résolu') || 
// // //              statut.includes('fermé') ||
// // //              statut.includes('traité') ||
// // //              statut.includes('terminé') ||
// // //              statut.includes('clôturé');
// // //     }).length;

// // //     const incidentsOuverts = safeFilter(incidentsArray, i => {
// // //       const statut = (i.statut || '').toString().toLowerCase();
// // //       return statut.includes('ouvert') || 
// // //              statut.includes('en cours') ||
// // //              statut.includes('nouveau') ||
// // //              (!statut.includes('résolu') && !statut.includes('fermé'));
// // //     }).length;

// // //     const incidentsParPriorite = safeReduce(incidentsArray, (acc, i) => {
// // //       const priorite = (i.priorite || 'moyenne').toLowerCase();
// // //       acc[priorite] = (acc[priorite] || 0) + 1;
// // //       return acc;
// // //     }, {});

// // //     // Évolution des incidents (30 derniers jours)
// // //     const incidentsParJour = {};
// // //     const now = new Date();
// // //     const last30Days = Array.from({ length: 30 }, (_, i) => {
// // //       const date = new Date(now);
// // //       date.setDate(date.getDate() - (29 - i));
// // //       return date.toISOString().split('T')[0];
// // //     });

// // //     incidentsArray.forEach(incident => {
// // //       const dateStr = incident.date_creation || incident.date || incident.created_at;
// // //       if (dateStr) {
// // //         try {
// // //           const date = new Date(dateStr).toISOString().split('T')[0];
// // //           if (last30Days.includes(date)) {
// // //             incidentsParJour[date] = (incidentsParJour[date] || 0) + 1;
// // //           }
// // //         } catch (e) {
// // //           console.warn('Date incident invalide:', dateStr);
// // //         }
// // //       }
// // //     });

// // //     const incidentsEvolution = last30Days.map(date => ({
// // //       date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
// // //       incidents: incidentsParJour[date] || 0
// // //     }));

// // //     // === ALERTES ===
// // //     const alertesActives = safeFilter(alertesArray, a => {
// // //       const statut = (a.statut || '').toString().toLowerCase();
// // //       return statut.includes('nouvelle') || 
// // //              statut.includes('en_traitement') || 
// // //              statut.includes('active') ||
// // //              statut.includes('ouvert') ||
// // //              !statut;
// // //     }).length;

// // //     const alertesCritiques = safeFilter(alertesArray, a => {
// // //       const severite = (a.severite || '').toString().toLowerCase();
// // //       const statut = (a.statut || '').toString().toLowerCase();
// // //       const isActive = statut.includes('nouvelle') || 
// // //                        statut.includes('en_traitement') || 
// // //                        statut.includes('active') ||
// // //                        statut.includes('ouvert');
// // //       return isActive && (severite.includes('critique') || severite.includes('haute'));
// // //     }).length;

// // //     const alertesParSeverite = safeReduce(alertesArray, (acc, a) => {
// // //       const severite = (a.severite || 'moyenne').toLowerCase();
// // //       const statut = (a.statut || '').toString().toLowerCase();
// // //       const isActive = statut.includes('nouvelle') || 
// // //                        statut.includes('en_traitement') || 
// // //                        statut.includes('active') ||
// // //                        statut.includes('ouvert');
// // //       if (isActive) {
// // //         acc[severite] = (acc[severite] || 0) + 1;
// // //       }
// // //       return acc;
// // //     }, {});

// // //     // === RÉPARATIONS ===
// // //     const coutTotalReparations = safeReduce(reparationsArray, (sum, r) => {
// // //       const cout = parseFloat(r.cout) || 0;
// // //       return sum + cout;
// // //     }, 0);

// // //     const reparationsCeMois = safeFilter(reparationsArray, r => {
// // //       const date = r.date_reparation || r.date_debut || r.date || r.created_at;
// // //       if (!date) return false;
// // //       try {
// // //         const repDate = new Date(date);
// // //         const now = new Date();
// // //         return repDate.getMonth() === now.getMonth() && 
// // //                repDate.getFullYear() === now.getFullYear();
// // //       } catch {
// // //         return false;
// // //       }
// // //     }).length;

// // //     const coutReparationsCeMois = safeReduce(reparationsArray, (sum, r) => {
// // //       const date = r.date_reparation || r.date_debut || r.date || r.created_at;
// // //       if (!date) return sum;
// // //       try {
// // //         const repDate = new Date(date);
// // //         const now = new Date();
// // //         if (repDate.getMonth() === now.getMonth() && repDate.getFullYear() === now.getFullYear()) {
// // //           return sum + (parseFloat(r.cout) || 0);
// // //         }
// // //       } catch {}
// // //       return sum;
// // //     }, 0);

// // //     // === RÉSEAU ===
// // //     const reseauFonctionnel = safeFilter(reseauArray, r => {
// // //       const etat = (r.etat || '').toString().toLowerCase();
// // //       const statut = (r.statut || '').toString().toLowerCase();
// // //       return etat.includes('fonctionnel') || 
// // //              etat.includes('actif') ||
// // //              statut.includes('actif') ||
// // //              !etat.includes('panne') && !etat.includes('déconnecté');
// // //     }).length;

// // //     const reseauPanne = safeFilter(reseauArray, r => {
// // //       const etat = (r.etat || '').toString().toLowerCase();
// // //       return etat.includes('panne') || 
// // //              etat.includes('défectueux') ||
// // //              etat.includes('hors service');
// // //     }).length;

// // //     const reseauParStatut = safeReduce(reseauArray, (acc, r) => {
// // //       const etat = (r.etat || '').toString().toLowerCase();
// // //       const statut = (r.statut || '').toString().toLowerCase();
      
// // //       let statutNormalise = 'Fonctionnel';
      
// // //       if (etat.includes('panne') || etat.includes('déconnecté') || etat.includes('hors ligne')) {
// // //         statutNormalise = 'Déconnexion du réseau';
// // //       } else if (etat.includes('instable') || etat.includes('intermittent')) {
// // //         statutNormalise = 'Connexion instable';
// // //       } else if (etat.includes('maintenance') || etat.includes('réparation')) {
// // //         statutNormalise = 'Maintenance';
// // //       }
      
// // //       acc[statutNormalise] = (acc[statutNormalise] || 0) + 1;
// // //       return acc;
// // //     }, {});

// // //     // === CALCUL DES TAUX ===
// // //     const tauxDisponibilite = materielsArray.length > 0 ? 
// // //       (materielsFonctionnels / materielsArray.length * 100).toFixed(1) : 0;

// // //     const tauxResolutionIncidents = (incidentsOuverts + incidentsResolus) > 0 ? 
// // //       (incidentsResolus / (incidentsOuverts + incidentsResolus) * 100).toFixed(1) : 100;

// // //     const calculatedStats = {
// // //       total_materiels: materielsArray.length,
// // //       materiels_fonctionnels: materielsFonctionnels,
// // //       materiels_en_panne: materielsEnPanne,
// // //       materiels_maintenance: materielsMaintenance,
// // //       materiels_par_service: materielsParService,
      
// // //       total_logiciels: logicielsArray.length,
// // //       logiciels_installes: logicielsInstalles,
// // //       logiciels_par_type: logicielsParType,
      
// // //       incidents_ouverts: incidentsOuverts,
// // //       incidents_resolus: incidentsResolus,
// // //       incidents_par_priorite: incidentsParPriorite,
// // //       incidents_evolution: incidentsEvolution,
// // //       taux_resolution_incidents: parseFloat(tauxResolutionIncidents),
      
// // //       reparations_ce_mois: reparationsCeMois,
// // //       cout_total_reparations: coutTotalReparations,
// // //       cout_reparations_ce_mois: coutReparationsCeMois,
      
// // //       alertes_actives: alertesActives,
// // //       alertes_critiques: alertesCritiques,
// // //       alertes_par_severite: alertesParSeverite,
      
// // //       total_equipements_reseau: reseauArray.length,
// // //       reseau_fonctionnel: reseauFonctionnel,
// // //       reseau_panne: reseauPanne,
// // //       reseau_par_statut: reseauParStatut,
      
// // //       taux_disponibilite: parseFloat(tauxDisponibilite),
// // //     };

// // //     console.log('📊 Statistiques finales:', {
// // //       materiels: calculatedStats.total_materiels,
// // //       logicielsInstalles: calculatedStats.logiciels_installes,
// // //       incidentsResolus: calculatedStats.incidents_resolus,
// // //       alertesCritiques: calculatedStats.alertes_critiques,
// // //       coutTotal: calculatedStats.cout_total_reparations
// // //     });
    
// // //     setStats(calculatedStats);
// // //   }, []);

// // //   // Auto-refresh
// // //   useEffect(() => {
// // //     loadData();
    
// // //     if (autoRefresh) {
// // //       const interval = setInterval(() => {
// // //         loadData();
// // //       }, 30000);
// // //       return () => clearInterval(interval);
// // //     }
// // //   }, [loadData, autoRefresh]);

// // //   // Préparer les données pour les graphiques
// // //   const chartData = useMemo(() => {
// // //     // Matériels par Service
// // //     const servicesData = [
// // //       { service: 'Secrétariat', count: stats.materiels_par_service['Secrétariat'] || 0, fill: '#3b82f6' },
// // //       { service: 'Direction', count: stats.materiels_par_service['Direction'] || 0, fill: '#8b5cf6' },
// // //       { service: 'Informatique', count: stats.materiels_par_service['Informatique'] || 0, fill: '#10b981' },
// // //       { service: 'Archives', count: stats.materiels_par_service['Archives'] || 0, fill: '#f59e0b' },
// // //       { service: 'Autre', count: stats.materiels_par_service['Autre'] || 0, fill: '#6b7280' },
// // //     ].filter(item => item.count > 0);

// // //     // État des Matériels
// // //     const materielsEtat = [
// // //       { name: 'Fonctionnel', value: stats.materiels_fonctionnels, color: '#10b981' },
// // //       { name: 'En panne', value: stats.materiels_en_panne, color: '#ef4444' },
// // //       { name: 'Maintenance', value: stats.materiels_maintenance, color: '#f59e0b' },
// // //     ].filter(item => item.value > 0);

// // //     // Incidents par Priorité
// // //     const incidentsPriorite = Object.entries(stats.incidents_par_priorite || {}).map(([priorite, count]) => ({
// // //       priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
// // //       count,
// // //       fill: priorite === 'critique' ? '#ef4444' : 
// // //             priorite === 'haute' ? '#f97316' : 
// // //             priorite === 'moyenne' ? '#eab308' : '#22c55e'
// // //     }));

// // //     // Évolution des Incidents
// // //     const incidentsEvolution = stats.incidents_evolution || [];

// // //     // Alertes par Sévérité
// // //     const alertesSeverite = Object.entries(stats.alertes_par_severite || {}).map(([severite, count]) => ({
// // //       severite: severite.charAt(0).toUpperCase() + severite.slice(1),
// // //       count,
// // //       fill: severite === 'critique' ? '#ef4444' : 
// // //             severite === 'haute' ? '#f97316' : 
// // //             severite === 'moyenne' ? '#eab308' : '#22c55e'
// // //     }));

// // //     // Logiciels par Type
// // //     const logicielsTypeData = Object.entries(stats.logiciels_par_type || {}).map(([type, count]) => ({
// // //       type,
// // //       count,
// // //       fill: type === 'Bureautique' ? '#3b82f6' :
// // //             type === 'Système d\'exploitation' ? '#8b5cf6' :
// // //             type === 'Sécurité' ? '#10b981' :
// // //             type === 'Métier' ? '#f59e0b' :
// // //             type === 'Graphisme/Design' ? '#ec4899' : '#6b7280'
// // //     }));

// // //     // Réseau par Statut
// // //     const reseauStatutData = Object.entries(stats.reseau_par_statut || {}).map(([statut, count]) => ({
// // //       statut,
// // //       count,
// // //       fill: statut === 'Fonctionnel' ? '#10b981' :
// // //             statut === 'Connexion instable' ? '#eab308' :
// // //             statut === 'Maintenance' ? '#f59e0b' : '#ef4444'
// // //     }));

// // //     // Données de Synthèse
// // //     const syntheseData = [
// // //       {
// // //         label: 'Matériels fonctionnels',
// // //         value: stats.materiels_fonctionnels,
// // //         total: stats.total_materiels,
// // //         icon: CheckCircle,
// // //         color: 'success',
// // //         description: `Taux: ${stats.taux_disponibilite}%`
// // //       },
// // //       {
// // //         label: 'Incidents résolus',
// // //         value: stats.incidents_resolus,
// // //         total: stats.incidents_ouverts + stats.incidents_resolus,
// // //         icon: CheckCircle,
// // //         color: 'success',
// // //         description: `Taux: ${stats.taux_resolution_incidents}%`
// // //       },
// // //       {
// // //         label: 'Alertes critiques',
// // //         value: stats.alertes_critiques,
// // //         total: stats.alertes_actives,
// // //         icon: AlertCircle,
// // //         color: 'error',
// // //         description: `${stats.alertes_actives} alertes actives`
// // //       },
// // //       {
// // //         label: 'Réparations ce mois',
// // //         value: stats.reparations_ce_mois,
// // //         icon: Wrench,
// // //         color: 'info',
// // //         description: `Coût: ${formatCurrency(stats.cout_reparations_ce_mois)}`
// // //       },
// // //       {
// // //         label: 'Logiciels installés',
// // //         value: stats.logiciels_installes,
// // //         total: stats.total_logiciels,
// // //         icon: Package,
// // //         color: 'success',
// // //         description: `${stats.logiciels_installes} / ${stats.total_logiciels}`
// // //       },
// // //       {
// // //         label: 'Équipements réseau',
// // //         value: stats.reseau_fonctionnel,
// // //         total: stats.total_equipements_reseau,
// // //         icon: Network,
// // //         color: 'success',
// // //         description: `${stats.reseau_panne} en panne`
// // //       },
// // //     ];

// // //     return {
// // //       servicesData,
// // //       materielsEtat,
// // //       incidentsPriorite,
// // //       incidentsEvolution,
// // //       alertesSeverite,
// // //       logicielsTypeData,
// // //       reseauStatutData,
// // //       syntheseData
// // //     };
// // //   }, [stats, formatCurrency]); // Ajouter formatCurrency aux dépendances

// // //   // Générer rapport PDF
// // //   const generateDetailedPDF = useCallback(async () => {
// // //     const doc = new jsPDF('landscape');
    
// // //     try {
// // //       const imgData = await getBase64Image(logoDren);
// // //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// // //     } catch (error) {
// // //       console.warn('Logo non chargé');
// // //     }
    
// // //     doc.setFontSize(20);
// // //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// // //     doc.setFontSize(16);
// // //     doc.text('TABLEAU DE BORD COMPLET', 20, 45);
    
// // //     doc.setFontSize(12);
// // //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
// // //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 67);
    
// // //     doc.setDrawColor(200, 200, 200);
// // //     doc.line(20, 75, 190, 75);
    
// // //     doc.setFontSize(14);
// // //     doc.text('SYNTHÈSE DES DONNÉES', 20, 90);
    
// // //     const syntheseStats = [
// // //       ['Indicateur', 'Valeur', 'Détail'],
// // //       ['Matériels fonctionnels', stats.materiels_fonctionnels.toString(), `${stats.total_materiels} total`],
// // //       ['Incidents résolus', stats.incidents_resolus.toString(), `Taux: ${stats.taux_resolution_incidents}%`],
// // //       ['Alertes critiques', stats.alertes_critiques.toString(), `${stats.alertes_actives} actives`],
// // //       ['Réparations ce mois', stats.reparations_ce_mois.toString(), formatCurrency(stats.cout_reparations_ce_mois)],
// // //       ['Logiciels installés', stats.logiciels_installes.toString(), `${stats.total_logiciels} total`],
// // //       ['Équipements réseau', stats.reseau_fonctionnel.toString(), `${stats.total_equipements_reseau} total`],
// // //       ['Taux disponibilité', `${stats.taux_disponibilite}%`, 'Matériels'],
// // //       ['Coût total réparations', formatCurrency(stats.cout_total_reparations), 'Depuis le début'],
// // //     ];
    
// // //     autoTable(doc, {
// // //       startY: 95,
// // //       head: syntheseStats.slice(0, 1),
// // //       body: syntheseStats.slice(1),
// // //       theme: 'grid',
// // //       headStyles: { fillColor: [59, 130, 246] },
// // //     });
    
// // //     doc.save(`dashboard-complet-${new Date().toISOString().split('T')[0]}.pdf`);
// // //     showNotification('Rapport PDF généré avec succès', 'success');
// // //   }, [user, stats, formatCurrency, showNotification]);

// // //   // Composant StatCard
// // //   const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
// // //     const colorClasses = {
// // //       blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
// // //       purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
// // //       yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
// // //       red: { bg: 'bg-red-100', text: 'text-red-600' },
// // //       indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
// // //       green: { bg: 'bg-green-100', text: 'text-green-600' },
// // //       primary: { bg: 'bg-primary/10', text: 'text-primary' },
// // //       success: { bg: 'bg-success/10', text: 'text-success' },
// // //       error: { bg: 'bg-error/10', text: 'text-error' },
// // //       warning: { bg: 'bg-warning/10', text: 'text-warning' },
// // //       info: { bg: 'bg-info/10', text: 'text-info' },
// // //     };

// // //     const colorConfig = colorClasses[color] || colorClasses.primary;

// // //     return (
// // //       <div className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 relative">
// // //         {trend !== undefined && (
// // //           <div className={`absolute -top-2 -right-2 badge badge-sm ${trend > 0 ? 'badge-success' : 'badge-error'}`}>
// // //             {trend > 0 ? '+' : ''}{trend}%
// // //           </div>
// // //         )}
// // //         <div className="card-body p-4">
// // //           <div className="flex items-center justify-between">
// // //             <div>
// // //               <h3 className="text-sm font-semibold text-base-content opacity-70">{title}</h3>
// // //               <p className="text-2xl font-bold mt-1 text-base-content">{value}</p>
// // //               {subtitle && <p className="text-xs text-base-content opacity-60 mt-1">{subtitle}</p>}
// // //             </div>
// // //             <div className={`p-3 rounded-lg ${colorConfig.bg}`}>
// // //               <Icon className={`h-6 w-6 ${colorConfig.text}`} />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // Composant SyntheseItem
// // //   const SyntheseItem = ({ label, value, total, icon: Icon, color = 'primary', description }) => {
// // //     const colorClasses = {
// // //       success: { bg: 'bg-success/10', text: 'text-success', icon: 'text-success' },
// // //       error: { bg: 'bg-error/10', text: 'text-error', icon: 'text-error' },
// // //       info: { bg: 'bg-info/10', text: 'text-info', icon: 'text-info' },
// // //       primary: { bg: 'bg-primary/10', text: 'text-primary', icon: 'text-primary' },
// // //     };

// // //     const colorConfig = colorClasses[color] || colorClasses.primary;
// // //     const percentage = total ? Math.round((value / total) * 100) : 100;

// // //     return (
// // //       <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
// // //         <div className="flex items-center gap-3">
// // //           <div className={`p-2 rounded-lg ${colorConfig.bg}`}>
// // //             <Icon className={`h-5 w-5 ${colorConfig.icon}`} />
// // //           </div>
// // //           <div className="flex-1">
// // //             <span className="font-medium text-base-content">{label}</span>
// // //             {description && (
// // //               <p className="text-xs text-base-content opacity-60 mt-1">{description}</p>
// // //             )}
// // //             {total && (
// // //               <div className="mt-2 w-full bg-base-300 rounded-full h-2">
// // //                 <div 
// // //                   className={`h-2 rounded-full ${colorConfig.text.replace('text-', 'bg-')}`}
// // //                   style={{ width: `${percentage}%` }}
// // //                 />
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //         <div className="text-right">
// // //           <span className={`text-2xl font-bold ${colorConfig.text}`}>{value}</span>
// // //           {total && (
// // //             <p className="text-xs text-base-content opacity-60">sur {total}</p>
// // //           )}
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center min-h-screen">
// // //         <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
// // //         <h2 className="text-xl font-semibold text-base-content">Chargement du tableau de bord...</h2>
// // //         <p className="text-base-content opacity-70 mt-2">Connexion aux sources de données</p>
// // //         <div className="mt-4 w-64 bg-base-300 rounded-full h-2">
// // //           <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
// // //       {/* En-tête */}
// // //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
// // //         <div>
// // //           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
// // //             <BarChart3 className="h-8 w-8 text-primary" />
// // //             Tableau de Bord IT
// // //             <span className="badge badge-primary badge-lg">DREN Antsimo Andrefana</span>
// // //           </h1>
// // //           <p className="text-base-content opacity-70 mt-1">
// // //             Surveillance complète du parc informatique - Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
// // //           </p>
// // //         </div>
        
// // //         <div className="flex flex-wrap gap-2">
// // //           <div className="form-control">
// // //             <label className="label cursor-pointer gap-2">
// // //               <span className="label-text text-sm text-base-content">Auto-refresh (30s)</span>
// // //               <input 
// // //                 type="checkbox" 
// // //                 className="toggle toggle-primary toggle-sm"
// // //                 checked={autoRefresh}
// // //                 onChange={(e) => setAutoRefresh(e.target.checked)}
// // //               />
// // //             </label>
// // //           </div>
          
// // //           <div className="dropdown dropdown-end">
// // //             <button className="btn btn-primary btn-sm">
// // //               <Download className="h-4 w-4 mr-2" />
// // //               Exporter
// // //             </button>
// // //             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// // //               <li><button onClick={generateDetailedPDF}>Rapport PDF</button></li>
// // //               <li><button onClick={() => showNotification('Fonctionnalité à venir', 'info')}>Excel</button></li>
// // //             </ul>
// // //           </div>
          
// // //           <button 
// // //             onClick={loadData}
// // //             className="btn btn-outline btn-sm text-base-content"
// // //             disabled={loading}
// // //           >
// // //             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
// // //             {loading ? 'Actualisation...' : 'Actualiser'}
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Statistiques principales */}
// // //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
// // //         <StatCard
// // //           title="Matériels"
// // //           value={stats.total_materiels}
// // //           icon={Database}
// // //           color="blue"
// // //           subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
// // //         />
        
// // //         <StatCard
// // //           title="Logiciels"
// // //           value={stats.total_logiciels}
// // //           icon={Package}
// // //           color="purple"
// // //           subtitle={`${stats.logiciels_installes} installés`}
// // //         />
        
// // //         <StatCard
// // //           title="Alertes"
// // //           value={stats.alertes_actives}
// // //           icon={Bell}
// // //           color="yellow"
// // //           subtitle={`${stats.alertes_critiques} critiques`}
// // //         />
        
// // //         <StatCard
// // //           title="Incidents"
// // //           value={stats.incidents_ouverts}
// // //           icon={AlertTriangle}
// // //           color="red"
// // //           subtitle={`${stats.incidents_resolus} résolus`}
// // //         />
        
// // //         <StatCard
// // //           title="Équipements Réseau"
// // //           value={stats.total_equipements_reseau}
// // //           icon={Network}
// // //           color="indigo"
// // //           subtitle={`${stats.reseau_fonctionnel} fonctionnels`}
// // //         />
        
// // //         <StatCard
// // //           title="Coût Réparations"
// // //           value={formatCurrency(stats.cout_total_reparations)}
// // //           icon={DollarSign}
// // //           color="green"
// // //           subtitle={`${stats.reparations_ce_mois} ce mois`}
// // //         />
// // //       </div>

// // //       {/* Section 1: Matériels */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // //         {/* Matériels par Service */}
// // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // //           <div className="card-body">
// // //             <h3 className="card-title text-base-content">
// // //               <Users className="h-5 w-5 mr-2" />
// // //               Matériels par Service
// // //               <span className="badge badge-primary ml-2">
// // //                 {Object.keys(stats.materiels_par_service).length} services
// // //               </span>
// // //             </h3>
// // //             <ResponsiveContainer width="100%" height={300}>
// // //               <BarChart data={chartData.servicesData}>
// // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // //                 <XAxis 
// // //                   dataKey="service" 
// // //                   stroke="#9CA3AF"
// // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // //                 />
// // //                 <YAxis 
// // //                   stroke="#9CA3AF"
// // //                   tick={{ fill: '#9CA3AF' }}
// // //                 />
// // //                 <Tooltip 
// // //                   contentStyle={{ 
// // //                     backgroundColor: '#1F2937', 
// // //                     borderColor: '#374151', 
// // //                     color: '#F9FAFB',
// // //                     borderRadius: '8px'
// // //                   }}
// // //                   formatter={(value) => [`${value} matériels`, 'Quantité']}
// // //                 />
// // //                 <Legend />
// // //                 <Bar 
// // //                   dataKey="count" 
// // //                   name="Matériels"
// // //                   radius={[4, 4, 0, 0]}
// // //                 >
// // //                   {chartData.servicesData.map((entry, index) => (
// // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // //                   ))}
// // //                 </Bar>
// // //               </BarChart>
// // //             </ResponsiveContainer>
// // //           </div>
// // //         </div>

// // //         {/* État des Matériels */}
// // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // //           <div className="card-body">
// // //             <h3 className="card-title text-base-content">
// // //               <PieChartIcon className="h-5 w-5 mr-2" />
// // //               État des Matériels
// // //             </h3>
// // //             <ResponsiveContainer width="100%" height={300}>
// // //               <PieChart>
// // //                 <Pie
// // //                   data={chartData.materielsEtat}
// // //                   cx="50%"
// // //                   cy="50%"
// // //                   labelLine={false}
// // //                   label={({ name, value }) => `${name}: ${value}`}
// // //                   outerRadius={80}
// // //                   dataKey="value"
// // //                 >
// // //                   {chartData.materielsEtat.map((entry, index) => (
// // //                     <Cell key={`cell-${index}`} fill={entry.color} />
// // //                   ))}
// // //                 </Pie>
// // //                 <Tooltip />
// // //                 <Legend />
// // //               </PieChart>
// // //             </ResponsiveContainer>
// // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // //               Taux de disponibilité: <strong>{stats.taux_disponibilite}%</strong>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Section 2: Incidents */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // //         {/* Incidents par Priorité */}
// // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // //           <div className="card-body">
// // //             <h3 className="card-title text-base-content">
// // //               <AlertTriangle className="h-5 w-5 mr-2" />
// // //               Incidents par Priorité
// // //               <span className="badge badge-error ml-2">{stats.incidents_ouverts} ouverts</span>
// // //             </h3>
// // //             <ResponsiveContainer width="100%" height={300}>
// // //               <BarChart data={chartData.incidentsPriorite}>
// // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // //                 <XAxis 
// // //                   dataKey="priorite" 
// // //                   stroke="#9CA3AF"
// // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // //                 />
// // //                 <YAxis stroke="#9CA3AF" />
// // //                 <Tooltip 
// // //                   contentStyle={{ 
// // //                     backgroundColor: '#1F2937', 
// // //                     borderColor: '#374151', 
// // //                     color: '#F9FAFB'
// // //                   }}
// // //                   formatter={(value) => [`${value} incidents`, 'Quantité']}
// // //                 />
// // //                 <Legend />
// // //                 <Bar 
// // //                   dataKey="count" 
// // //                   name="Incidents"
// // //                   radius={[4, 4, 0, 0]}
// // //                 >
// // //                   {chartData.incidentsPriorite.map((entry, index) => (
// // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // //                   ))}
// // //                 </Bar>
// // //               </BarChart>
// // //             </ResponsiveContainer>
// // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // //               {stats.incidents_resolus} résolus • Taux de résolution: <strong>{stats.taux_resolution_incidents}%</strong>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Évolution des Incidents */}
// // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // //           <div className="card-body">
// // //             <h3 className="card-title text-base-content">
// // //               <LineChartIcon className="h-5 w-5 mr-2" />
// // //               Évolution des Incidents (30 jours)
// // //             </h3>
// // //             <ResponsiveContainer width="100%" height={300}>
// // //               <AreaChart data={chartData.incidentsEvolution}>
// // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // //                 <XAxis 
// // //                   dataKey="date" 
// // //                   stroke="#9CA3AF"
// // //                   tick={{ fill: '#9CA3AF', fontSize: 11 }}
// // //                 />
// // //                 <YAxis stroke="#9CA3AF" />
// // //                 <Tooltip 
// // //                   contentStyle={{ 
// // //                     backgroundColor: '#1F2937', 
// // //                     borderColor: '#374151', 
// // //                     color: '#F9FAFB'
// // //                   }}
// // //                   formatter={(value) => [`${value} incidents`, 'Quantité']}
// // //                 />
// // //                 <Legend />
// // //                 <Area 
// // //                   type="monotone" 
// // //                   dataKey="incidents" 
// // //                   stroke="#ef4444" 
// // //                   fill="#ef4444"
// // //                   fillOpacity={0.3}
// // //                   name="Incidents"
// // //                 />
// // //               </AreaChart>
// // //             </ResponsiveContainer>
// // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // //               Moyenne: {chartData.incidentsEvolution.length > 0 ? 
// // //                 Math.round(chartData.incidentsEvolution.reduce((sum, day) => sum + day.incidents, 0) / chartData.incidentsEvolution.length) : 0} incidents/jour
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Section 3: Logiciels & Réseau */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // //         {/* Logiciels par Type */}
// // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // //           <div className="card-body">
// // //             <h3 className="card-title text-base-content">
// // //               <Package className="h-5 w-5 mr-2" />
// // //               Logiciels par Type
// // //               <span className="badge badge-success ml-2">{stats.logiciels_installes} installés</span>
// // //             </h3>
// // //             <ResponsiveContainer width="100%" height={300}>
// // //               <BarChart data={chartData.logicielsTypeData}>
// // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // //                 <XAxis 
// // //                   dataKey="type" 
// // //                   stroke="#9CA3AF"
// // //                   tick={{ fill: '#9CA3AF', fontSize: 11 }}
// // //                   angle={-45}
// // //                   textAnchor="end"
// // //                   height={70}
// // //                 />
// // //                 <YAxis stroke="#9CA3AF" />
// // //                 <Tooltip 
// // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // //                   formatter={(value) => [`${value} logiciels`, 'Quantité']}
// // //                 />
// // //                 <Legend />
// // //                 <Bar 
// // //                   dataKey="count" 
// // //                   name="Logiciels"
// // //                   radius={[4, 4, 0, 0]}
// // //                 >
// // //                   {chartData.logicielsTypeData.map((entry, index) => (
// // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // //                   ))}
// // //                 </Bar>
// // //               </BarChart>
// // //             </ResponsiveContainer>
// // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // //               {stats.total_logiciels} logiciels au total
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Équipements Réseau par Statut */}
// // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // //           <div className="card-body">
// // //             <h3 className="card-title text-base-content">
// // //               <Network className="h-5 w-5 mr-2" />
// // //               Équipements Réseau par Statut
// // //               <span className="badge badge-info ml-2">{stats.total_equipements_reseau} équipements</span>
// // //             </h3>
// // //             <ResponsiveContainer width="100%" height={300}>
// // //               <BarChart data={chartData.reseauStatutData}>
// // //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // //                 <XAxis 
// // //                   dataKey="statut" 
// // //                   stroke="#9CA3AF"
// // //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // //                 />
// // //                 <YAxis stroke="#9CA3AF" />
// // //                 <Tooltip 
// // //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // //                   formatter={(value) => [`${value} équipements`, 'Quantité']}
// // //                 />
// // //                 <Legend />
// // //                 <Bar 
// // //                   dataKey="count" 
// // //                   name="Équipements"
// // //                   radius={[4, 4, 0, 0]}
// // //                 >
// // //                   {chartData.reseauStatutData.map((entry, index) => (
// // //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// // //                   ))}
// // //                 </Bar>
// // //               </BarChart>
// // //             </ResponsiveContainer>
// // //             <div className="text-sm text-base-content opacity-70 mt-2">
// // //               {stats.reseau_fonctionnel} fonctionnels • {stats.reseau_panne} en panne
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Section 4: Synthèse */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// // //         {/* Synthèse des Données */}
// // //         <div className="card bg-base-100 shadow-lg border border-base-300">
// // //           <div className="card-body">
// // //             <h3 className="card-title text-base-content">
// // //               <Database className="h-5 w-5 mr-2" />
// // //               Synthèse des Données
// // //               <span className="badge badge-info ml-2">Indicateurs clés</span>
// // //             </h3>
            
// // //             <div className="space-y-3">
// // //               {chartData.syntheseData.map((item, index) => (
// // //                 <SyntheseItem
// // //                   key={index}
// // //                   label={item.label}
// // //                   value={item.value}
// // //                   total={item.total}
// // //                   icon={item.icon}
// // //                   color={item.color}
// // //                   description={item.description}
// // //                 />
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Informations système */}
// // //         <div className="space-y-6">
// // //           {/* Alertes par Sévérité */}
// // //           <div className="card bg-base-100 shadow-lg border border-base-300">
// // //             <div className="card-body">
// // //               <h3 className="card-title text-base-content">
// // //                 <Bell className="h-5 w-5 mr-2" />
// // //                 Alertes par Sévérité
// // //                 <span className="badge badge-warning ml-2">{stats.alertes_actives} actives</span>
// // //               </h3>
// // //               <ResponsiveContainer width="100%" height={250}>
// // //                 <BarChart data={chartData.alertesSeverite}>
// // //                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // //                   <XAxis 
// // //                     dataKey="severite" 
// // //                     stroke="#9CA3AF"
// // //                     tick={{ fill: '#9CA3AF', fontSize: 12 }}
// // //                   />
// // //                   <YAxis stroke="#9CA3AF" />
// // //                   <Tooltip 
// // //                     contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// // //                     formatter={(value) => [`${value} alertes`, 'Quantité']}
// // //                   />
// // //                   <Legend />
// // //                   <Bar 
// // //                     dataKey="count" 
// // //                     name="Alertes"
// // //                     radius={[4, 4, 0, 0]}
// // //                   >
// // //                     {chartData.alertesSeverite.map((entry, index) => (
// // //                       <Cell key={`cell-${index}`} fill={entry.fill} />
// // //                     ))}
// // //                   </Bar>
// // //                 </BarChart>
// // //               </ResponsiveContainer>
// // //             </div>
// // //           </div>

// // //           {/* Informations système */}
// // //           <div className="card bg-base-200 border border-base-300">
// // //             <div className="card-body">
// // //               <h3 className="card-title text-base-content">
// // //                 <Info className="h-5 w-5 mr-2" />
// // //                 Informations système
// // //               </h3>
// // //               <div className="space-y-3 text-sm">
// // //                 <div className="flex justify-between">
// // //                   <span className="font-medium text-base-content">Données chargées:</span>
// // //                   <span className="text-base-content">
// // //                     {materiels.length} matériels, {logiciels.length} logiciels
// // //                   </span>
// // //                 </div>
// // //                 <div className="flex justify-between">
// // //                   <span className="font-medium text-base-content">Utilisateur:</span>
// // //                   <span className="text-base-content">{user?.nom_complet || user?.username || 'Non connecté'}</span>
// // //                 </div>
// // //                 <div className="flex justify-between">
// // //                   <span className="font-medium text-base-content">Auto-refresh:</span>
// // //                   <span className="text-base-content">{autoRefresh ? 'Activé (30s)' : 'Désactivé'}</span>
// // //                 </div>
// // //                 <div className="flex justify-between">
// // //                   <span className="font-medium text-base-content">Dernière actualisation:</span>
// // //                   <span className="text-base-content">{lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '--'}</span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Recommandations & Alertes */}
// // //       <div className="card bg-base-200 border border-base-300 mb-6">
// // //         <div className="card-body">
// // //           <h3 className="card-title text-base-content">
// // //             <AlertCircle className="h-5 w-5 mr-2" />
// // //             Recommandations & Alertes
// // //           </h3>
// // //           <div className="space-y-2 text-sm">
// // //             {stats.materiels_en_panne > 0 && (
// // //               <div className="alert alert-error">
// // //                 <AlertTriangle className="h-4 w-4" />
// // //                 <span className="text-base-content">🚨 {stats.materiels_en_panne} matériel(s) en panne nécessite(nt) intervention</span>
// // //               </div>
// // //             )}
// // //             {stats.alertes_critiques > 0 && (
// // //               <div className="alert alert-warning">
// // //                 <Shield className="h-4 w-4" />
// // //                 <span className="text-base-content">⚠️ {stats.alertes_critiques} alerte(s) critique(s) en attente</span>
// // //               </div>
// // //             )}
// // //             {stats.incidents_ouverts > 0 && (
// // //               <div className="alert alert-warning">
// // //                 <AlertTriangle className="h-4 w-4" />
// // //                 <span className="text-base-content">📋 {stats.incidents_ouverts} incident(s) ouvert(s) à traiter</span>
// // //               </div>
// // //             )}
// // //             {stats.reseau_panne > 0 && (
// // //               <div className="alert alert-warning">
// // //                 <Network className="h-4 w-4" />
// // //                 <span className="text-base-content">🌐 {stats.reseau_panne} équipement(s) réseau en panne</span>
// // //               </div>
// // //             )}
// // //             {stats.materiels_en_panne === 0 && stats.alertes_critiques === 0 && stats.incidents_ouverts === 0 && (
// // //               <div className="alert alert-success">
// // //                 <CheckCircle className="h-4 w-4" />
// // //                 <span className="text-base-content">✅ Tous les systèmes sont opérationnels</span>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // // src/pages/Dashboard.jsx - VERSION CORRIGÉE ET COMPLÈTE
// // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // import { 
// //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// //   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
// //   AreaChart, Area
// // } from 'recharts';
// // import { 
// //   BarChart3, RefreshCw, Users, 
// //   AlertTriangle, CheckCircle,
// //   Database, Bell, Package, 
// //   Network, Wrench,
// //   PieChart as PieChartIcon,
// //   LineChart as LineChartIcon, Info, 
// //   Shield, DollarSign,
// //   AlertCircle,
// //   Check,
// //   Download,
// //   Monitor, Server, Cpu, TrendingUp
// // } from 'lucide-react';
// // import { 
// //   materielsAPI, 
// //   incidentsAPI, 
// //   reparationsAPI, 
// //   logicielsAPI, 
// //   alertesAPI, 
// //   reseauAPI 
// // } from '../services/api';
// // import { useAuth } from '../context/AuthContext';
// // import { useNotification } from '../context/NotificationContext';
// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // // Import du logo
// // import logoDren from '../assets/images/logo-dren.jpeg';

// // // COULEURS FIXES POUR CHAQUE SERVICE
// // const SERVICE_COLORS = {
// //   'Secrétariat': '#3b82f6',
// //   'Direction': '#8b5cf6',
// //   'Informatique': '#10b981',
// //   'Archives': '#f59e0b',
// //   'Non assigné': '#9ca3af',
// //   'Autre': '#6b7280',
// // };

// // // Fonction pour convertir une image en base64
// // const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
// //   const img = new Image();
// //   img.crossOrigin = 'Anonymous';
// //   img.onload = () => {
// //     const canvas = document.createElement('canvas');
// //     const ctx = canvas.getContext('2d');
// //     canvas.width = img.width;
// //     canvas.height = img.height;
// //     ctx.drawImage(img, 0, 0);
// //     resolve(canvas.toDataURL('image/jpeg'));
// //   };
// //   img.onerror = reject;
// //   img.src = imgUrl;
// // });

// // const Dashboard = () => {
// //   const { user } = useAuth();
// //   const { showNotification } = useNotification();
  
// //   // États principaux
// //   const [stats, setStats] = useState({
// //     total_materiels: 0,
// //     materiels_fonctionnels: 0,
// //     materiels_en_panne: 0,
// //     materiels_maintenance: 0,
// //     materiels_par_service: {},
// //     materiels_par_type: {},
    
// //     total_logiciels: 0,
// //     logiciels_actifs: 0,
// //     logiciels_installes: 0,
// //     logiciels_expires: 0,
// //     logiciels_par_type: {},
    
// //     incidents_ouverts: 0,
// //     incidents_actifs: 0,
// //     incidents_resolus: 0,
// //     incidents_par_priorite: {},
// //     incidents_evolution: [],
// //     taux_resolution_incidents: 0,
    
// //     reparations_ce_mois: 0,
// //     cout_total_reparations: 0,
// //     cout_reparations_ce_mois: 0,
    
// //     alertes_actives: 0,
// //     alertes_critiques: 0,
// //     alertes_panne: 0,
// //     alertes_maintenance: 0,
// //     alertes_par_type: {},
// //     alertes_par_severite: {},
    
// //     total_equipements_reseau: 0,
// //     reseau_fonctionnel: 0,
// //     reseau_panne: 0,
// //     reseau_par_type: {},
// //     reseau_par_statut: {},
    
// //     taux_disponibilite: 0,
// //     taux_satisfaction: 0,
// //   });
  
// //   // États pour les données brutes
// //   const [materiels, setMateriels] = useState([]);
// //   const [incidents, setIncidents] = useState([]);
// //   const [reparations, setReparations] = useState([]);
// //   const [logiciels, setLogiciels] = useState([]);
// //   const [alertes, setAlertes] = useState([]);
// //   const [reseau, setReseau] = useState([]);
  
// //   // États UI
// //   const [loading, setLoading] = useState(true);
// //   const [autoRefresh, setAutoRefresh] = useState(false);
// //   const [lastUpdate, setLastUpdate] = useState(null);

// //   // Fonctions helper
// //   const safeArray = (data) => Array.isArray(data) ? data : [];
// //   const safeFilter = (array, condition) => array?.filter?.(condition) || [];
// //   const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

// //   // Fonction pour extraire les données des réponses API
// //   const extractData = useCallback((response) => {
// //     if (!response) return [];
    
// //     if (Array.isArray(response)) return response;
    
// //     if (response?.data) {
// //       if (Array.isArray(response.data)) return response.data;
// //       if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// //       if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// //       if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
// //     }
    
// //     return [];
// //   }, []);

// //   // Formater la devise en Ariary
// //   const formatCurrency = useCallback((amount) => {
// //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// //   }, []);

// //   // Charger les données depuis les API
// //   const loadData = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       console.log('📊 Chargement des données dashboard depuis les API...');

// //       const [
// //         materielsResponse,
// //         incidentsResponse,
// //         reparationsResponse,
// //         logicielsResponse,
// //         alertesResponse,
// //         reseauResponse
// //       ] = await Promise.allSettled([
// //         materielsAPI.getAll().catch(e => {
// //           console.error('❌ Erreur matériels:', e);
// //           return { data: [] };
// //         }),
// //         incidentsAPI.getAll().catch(e => {
// //           console.error('❌ Erreur incidents:', e);
// //           return { data: [] };
// //         }),
// //         reparationsAPI.getAll().catch(e => {
// //           console.error('❌ Erreur réparations:', e);
// //           return { data: [] };
// //         }),
// //         logicielsAPI.getAll().catch(e => {
// //           console.error('❌ Erreur logiciels:', e);
// //           return { data: [] };
// //         }),
// //         alertesAPI.getAll().catch(e => {
// //           console.error('❌ Erreur alertes:', e);
// //           return { data: [] };
// //         }),
// //         reseauAPI.getAll().catch(e => {
// //           console.error('❌ Erreur réseau:', e);
// //           return { data: [] };
// //         })
// //       ]);

// //       // Extraire les données
// //       const materielsData = extractData(materielsResponse.value);
// //       const incidentsData = extractData(incidentsResponse.value);
// //       const reparationsData = extractData(reparationsResponse.value);
// //       const logicielsData = extractData(logicielsResponse.value);
// //       const alertesData = extractData(alertesResponse.value);
// //       const reseauData = extractData(reseauResponse.value);

// //       console.log('📦 Données reçues des API:', {
// //         materiels: materielsData.length,
// //         incidents: incidentsData.length,
// //         reparations: reparationsData.length,
// //         logiciels: logicielsData.length,
// //         alertes: alertesData.length,
// //         reseau: reseauData.length
// //       });

// //       // Afficher les premiers éléments pour vérification
// //       if (logicielsData.length > 0) {
// //         console.log('🔍 Premier logiciel:', {
// //           nom: logicielsData[0].nom,
// //           statut: logicielsData[0].statut,
// //           etat: logicielsData[0].etat,
// //           licence_active: logicielsData[0].licence_active,
// //           installe: logicielsData[0].installe,
// //           actif: logicielsData[0].actif
// //         });
// //       }

// //       if (incidentsData.length > 0) {
// //         console.log('🔍 Premier incident:', {
// //           statut: incidentsData[0].statut,
// //           priorite: incidentsData[0].priorite
// //         });
// //       }

// //       if (alertesData.length > 0) {
// //         console.log('🔍 Première alerte:', {
// //           statut: alertesData[0].statut,
// //           severite: alertesData[0].severite
// //         });
// //       }

// //       // Mettre à jour les états
// //       setMateriels(materielsData);
// //       setIncidents(incidentsData);
// //       setReparations(reparationsData);
// //       setLogiciels(logicielsData);
// //       setAlertes(alertesData);
// //       setReseau(reseauData);

// //       // Calculer les statistiques
// //       calculateStats({
// //         materiels: materielsData,
// //         incidents: incidentsData,
// //         reparations: reparationsData,
// //         logiciels: logicielsData,
// //         alertes: alertesData,
// //         reseau: reseauData
// //       });
      
// //       setLastUpdate(new Date());
// //       showNotification('Tableau de bord actualisé', 'success');

// //     } catch (error) {
// //       console.error('❌ Erreur générale:', error);
// //       showNotification('Erreur lors du chargement', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [extractData, showNotification]);

// //   // Calculer les statistiques
// //   const calculateStats = useCallback((data) => {
// //     const {
// //       materiels: materielsArray,
// //       incidents: incidentsArray,
// //       reparations: reparationsArray,
// //       logiciels: logicielsArray,
// //       alertes: alertesArray,
// //       reseau: reseauArray
// //     } = data;

// //     // === MATÉRIELS ===
// //     const materielsFonctionnels = safeFilter(materielsArray, m => {
// //       const etat = (m.etat || '').toString().toLowerCase();
// //       return etat.includes('fonctionnel') || 
// //              etat.includes('actif') || 
// //              etat.includes('opérationnel') ||
// //              etat.includes('en service') ||
// //              etat === 'bon' ||
// //              etat === 'good' ||
// //              m.statut === 'actif' ||
// //              m.statut === 'fonctionnel';
// //     }).length;

// //     const materielsEnPanne = safeFilter(materielsArray, m => {
// //       const etat = (m.etat || '').toString().toLowerCase();
// //       return etat.includes('panne') || 
// //              etat.includes('défectueux') || 
// //              etat.includes('hors service') ||
// //              m.statut === 'panne' ||
// //              m.statut === 'hors service';
// //     }).length;

// //     const materielsMaintenance = safeFilter(materielsArray, m => {
// //       const etat = (m.etat || '').toString().toLowerCase();
// //       return etat.includes('maintenance') || 
// //              etat.includes('réparation') || 
// //              etat.includes('en réparation') ||
// //              m.statut === 'maintenance' ||
// //              m.statut === 'réparation';
// //     }).length;

// //     const materielsParService = safeReduce(materielsArray, (acc, m) => {
// //       const service = m.service || m.departement || m.service_attribue || m.direction || 'Non assigné';
      
// //       let serviceNormalise = 'Autre';
// //       const serviceLower = service.toLowerCase();
      
// //       if (serviceLower.includes('secrétariat') || serviceLower.includes('secretariat')) {
// //         serviceNormalise = 'Secrétariat';
// //       } else if (serviceLower.includes('direction') || serviceLower.includes('dir')) {
// //         serviceNormalise = 'Direction';
// //       } else if (serviceLower.includes('informatique') || serviceLower.includes('it') || serviceLower.includes('info')) {
// //         serviceNormalise = 'Informatique';
// //       } else if (serviceLower.includes('archives') || serviceLower.includes('archive')) {
// //         serviceNormalise = 'Archives';
// //       } else {
// //         serviceNormalise = 'Autre';
// //       }
      
// //       acc[serviceNormalise] = (acc[serviceNormalise] || 0) + 1;
// //       return acc;
// //     }, {});

// //     // === LOGICIELS - DÉTECTION AMÉLIORÉE ===
// //     console.log('🔍 Analyse des logiciels:', {
// //       total: logicielsArray.length,
// //       premier: logicielsArray[0] ? {
// //         nom: logicielsArray[0].nom,
// //         statut: logicielsArray[0].statut,
// //         etat: logicielsArray[0].etat,
// //         licence: logicielsArray[0].licence_active,
// //         installe: logicielsArray[0].installe,
// //         actif: logicielsArray[0].actif
// //       } : 'aucun'
// //     });

// //     const logicielsInstalles = safeFilter(logicielsArray, l => {
// //       const statut = (l.statut || '').toString().toLowerCase();
// //       const etat = (l.etat || '').toString().toLowerCase();
// //       const licence = (l.licence_active || '').toString().toLowerCase();
// //       const installe = (l.installe || '').toString().toLowerCase();
// //       const actif = (l.actif || '').toString().toLowerCase();
      
// //       // Vérification complète des logiciels installés/actifs
// //       const estInstalle = 
// //         statut.includes('installé') || 
// //         statut.includes('installe') ||
// //         statut.includes('actif') ||
// //         statut.includes('activé') ||
// //         statut.includes('en service') ||
// //         etat.includes('installé') ||
// //         etat.includes('actif') ||
// //         etat.includes('en service') ||
// //         licence === 'true' ||
// //         licence === 'oui' ||
// //         licence === 'actif' ||
// //         licence === 'active' ||
// //         installe === 'true' ||
// //         installe === 'oui' ||
// //         installe === 'installé' ||
// //         actif === 'true' ||
// //         actif === 'oui' ||
// //         actif === 'actif' ||
// //         l.actif === true ||
// //         l.installe === true ||
// //         l.licence_active === true ||
// //         l.statut === 'actif' ||
// //         l.etat === 'installé';
      
// //       return estInstalle;
// //     }).length;

// //     console.log('📊 Logiciels installés détectés:', logicielsInstalles);

// //     const logicielsParType = safeReduce(logicielsArray, (acc, l) => {
// //       const nom = (l.nom || '').toString().toLowerCase();
// //       const categorie = (l.categorie || '').toString().toLowerCase();
// //       const type = (l.type || '').toString().toLowerCase();
// //       const description = (l.description || '').toString().toLowerCase();
      
// //       let typeNormalise = 'Autre';
      
// //       // Détection améliorée des types de logiciels
// //       if (nom.includes('office') || nom.includes('word') || nom.includes('excel') || 
// //           nom.includes('powerpoint') || nom.includes('outlook') || nom.includes('access') ||
// //           categorie.includes('bureautique') || type.includes('bureautique') ||
// //           description.includes('bureautique') || nom.includes('libreoffice') ||
// //           nom.includes('openoffice') || nom.includes('suite bureautique')) {
// //         typeNormalise = 'Bureautique';
// //       } else if (nom.includes('windows') || nom.includes('linux') || nom.includes('macos') || 
// //                  nom.includes('ubuntu') || nom.includes('centos') || nom.includes('debian') ||
// //                  nom.includes('os') || type.includes('système') || 
// //                  type.includes('system') || categorie.includes('os') ||
// //                  nom.includes('operating system') || description.includes('système d\'exploitation')) {
// //         typeNormalise = 'Système d\'exploitation';
// //       } else if (nom.includes('antivirus') || nom.includes('firewall') || nom.includes('sécurité') || 
// //                  nom.includes('security') || type.includes('sécurité') || categorie.includes('sécurité') ||
// //                  description.includes('antivirus') || description.includes('firewall') ||
// //                  nom.includes('avast') || nom.includes('kaspersky') || nom.includes('bitdefender') ||
// //                  nom.includes('norton') || nom.includes('malwarebytes')) {
// //         typeNormalise = 'Sécurité';
// //       } else if (type.includes('métier') || type.includes('metier') || categorie.includes('métier') ||
// //                  nom.includes('compta') || nom.includes('gestion') || nom.includes('erp') ||
// //                  nom.includes('crm') || description.includes('logiciel métier') ||
// //                  nom.includes('sage') || nom.includes('ciel') || nom.includes('quadratus') ||
// //                  nom.includes('paye') || nom.includes('comptabilité')) {
// //         typeNormalise = 'Métier';
// //       } else if (nom.includes('adobe') || nom.includes('photoshop') || nom.includes('illustrator') ||
// //                  nom.includes('design') || nom.includes('graphique') || categorie.includes('graphisme') ||
// //                  nom.includes('autocad') || nom.includes('solidworks') || nom.includes('3d') ||
// //                  type.includes('graphique') || description.includes('design')) {
// //         typeNormalise = 'Graphisme/Design';
// //       } else if (nom.includes('base de données') || nom.includes('database') || nom.includes('sql') ||
// //                  nom.includes('mysql') || nom.includes('postgresql') || nom.includes('oracle') ||
// //                  categorie.includes('base de données') || type.includes('base de données')) {
// //         typeNormalise = 'Base de données';
// //       } else if (nom.includes('navigateur') || nom.includes('browser') || nom.includes('chrome') ||
// //                  nom.includes('firefox') || nom.includes('edge') || nom.includes('safari') ||
// //                  categorie.includes('navigateur')) {
// //         typeNormalise = 'Navigateur';
// //       } else if (nom.includes('mozilla') || nom.includes('opera') || nom.includes('internet explorer')) {
// //         typeNormalise = 'Navigateur';
// //       }
      
// //       acc[typeNormalise] = (acc[typeNormalise] || 0) + 1;
// //       return acc;
// //     }, {});

// //     // === INCIDENTS - DÉTECTION AMÉLIORÉE ===
// //     const incidentsActifs = safeFilter(incidentsArray, i => {
// //       const statut = (i.statut || '').toString().toLowerCase();
// //       const etat = (i.etat || '').toString().toLowerCase();
      
// //       // Incidents actifs = non résolus
// //       return !statut.includes('résolu') && 
// //              !statut.includes('fermé') && 
// //              !statut.includes('traité') &&
// //              !statut.includes('terminé') &&
// //              !statut.includes('clôturé') &&
// //              !etat.includes('résolu') &&
// //              !etat.includes('fermé');
// //     }).length;

// //     const incidentsResolus = safeFilter(incidentsArray, i => {
// //       const statut = (i.statut || '').toString().toLowerCase();
// //       const etat = (i.etat || '').toString().toLowerCase();
      
// //       return statut.includes('résolu') || 
// //              statut.includes('fermé') ||
// //              statut.includes('traité') ||
// //              statut.includes('terminé') ||
// //              statut.includes('clôturé') ||
// //              etat.includes('résolu') ||
// //              etat.includes('fermé');
// //     }).length;

// //     const incidentsOuverts = safeFilter(incidentsArray, i => {
// //       const statut = (i.statut || '').toString().toLowerCase();
// //       return statut.includes('ouvert') || 
// //              statut.includes('en cours') ||
// //              statut.includes('nouveau') ||
// //              statut.includes('attente') ||
// //              (!statut.includes('résolu') && !statut.includes('fermé'));
// //     }).length;

// //     const incidentsParPriorite = safeReduce(incidentsArray, (acc, i) => {
// //       const priorite = (i.priorite || 'moyenne').toLowerCase();
// //       acc[priorite] = (acc[priorite] || 0) + 1;
// //       return acc;
// //     }, {});

// //     console.log('📊 Incidents détectés:', {
// //       total: incidentsArray.length,
// //       actifs: incidentsActifs,
// //       résolus: incidentsResolus,
// //       ouverts: incidentsOuverts
// //     });

// //     // Évolution des incidents (30 derniers jours)
// //     const incidentsParJour = {};
// //     const now = new Date();
// //     const last30Days = Array.from({ length: 30 }, (_, i) => {
// //       const date = new Date(now);
// //       date.setDate(date.getDate() - (29 - i));
// //       return date.toISOString().split('T')[0];
// //     });

// //     incidentsArray.forEach(incident => {
// //       const dateStr = incident.date_creation || incident.date || incident.created_at || incident.date_incident;
// //       if (dateStr) {
// //         try {
// //           const date = new Date(dateStr).toISOString().split('T')[0];
// //           if (last30Days.includes(date)) {
// //             incidentsParJour[date] = (incidentsParJour[date] || 0) + 1;
// //           }
// //         } catch (e) {
// //           console.warn('Date incident invalide:', dateStr);
// //         }
// //       }
// //     });

// //     const incidentsEvolution = last30Days.map(date => ({
// //       date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
// //       incidents: incidentsParJour[date] || 0
// //     }));

// //     // === ALERTES - DÉTECTION AMÉLIORÉE ===
// //     const alertesActives = safeFilter(alertesArray, a => {
// //       const statut = (a.statut || '').toString().toLowerCase();
// //       const etat = (a.etat || '').toString().toLowerCase();
      
// //       return statut.includes('nouvelle') || 
// //              statut.includes('en_traitement') || 
// //              statut.includes('active') ||
// //              statut.includes('ouvert') ||
// //              statut.includes('en cours') ||
// //              etat.includes('active') ||
// //              etat.includes('nouvelle') ||
// //              !statut.includes('résolu') && !statut.includes('fermé');
// //     }).length;

// //     const alertesCritiques = safeFilter(alertesArray, a => {
// //       const severite = (a.severite || '').toString().toLowerCase();
// //       const statut = (a.statut || '').toString().toLowerCase();
// //       const etat = (a.etat || '').toString().toLowerCase();
      
// //       const isActive = statut.includes('nouvelle') || 
// //                        statut.includes('en_traitement') || 
// //                        statut.includes('active') ||
// //                        statut.includes('ouvert') ||
// //                        etat.includes('active') ||
// //                        !statut.includes('résolu');
      
// //       return isActive && (severite.includes('critique') || 
// //                           severite.includes('haute') || 
// //                           severite.includes('élevée') ||
// //                           a.priorite === 'critique' ||
// //                           a.priorite === 'haute');
// //     }).length;

// //     const alertesParSeverite = safeReduce(alertesArray, (acc, a) => {
// //       const severite = (a.severite || 'moyenne').toLowerCase();
// //       const statut = (a.statut || '').toString().toLowerCase();
      
// //       const isActive = statut.includes('nouvelle') || 
// //                        statut.includes('en_traitement') || 
// //                        statut.includes('active') ||
// //                        statut.includes('ouvert') ||
// //                        !statut.includes('résolu');
      
// //       if (isActive) {
// //         let severiteNormalisee = severite;
        
// //         if (severite.includes('critique') || severite.includes('élevée')) {
// //           severiteNormalisee = 'critique';
// //         } else if (severite.includes('haute')) {
// //           severiteNormalisee = 'haute';
// //         } else if (severite.includes('moyenne') || severite.includes('moyen')) {
// //           severiteNormalisee = 'moyenne';
// //         } else if (severite.includes('basse') || severite.includes('faible')) {
// //           severiteNormalisee = 'basse';
// //         }
        
// //         acc[severiteNormalisee] = (acc[severiteNormalisee] || 0) + 1;
// //       }
// //       return acc;
// //     }, {});

// //     console.log('📊 Alertes détectées:', {
// //       total: alertesArray.length,
// //       actives: alertesActives,
// //       critiques: alertesCritiques
// //     });

// //     // === RÉPARATIONS ===
// //     const coutTotalReparations = safeReduce(reparationsArray, (sum, r) => {
// //       const cout = parseFloat(r.cout) || parseFloat(r.cout_reparation) || parseFloat(r.prix) || 0;
// //       return sum + cout;
// //     }, 0);

// //     const reparationsCeMois = safeFilter(reparationsArray, r => {
// //       const date = r.date_reparation || r.date_debut || r.date || r.created_at || r.date_fin;
// //       if (!date) return false;
// //       try {
// //         const repDate = new Date(date);
// //         const now = new Date();
// //         return repDate.getMonth() === now.getMonth() && 
// //                repDate.getFullYear() === now.getFullYear();
// //       } catch {
// //         return false;
// //       }
// //     }).length;

// //     const coutReparationsCeMois = safeReduce(reparationsArray, (sum, r) => {
// //       const date = r.date_reparation || r.date_debut || r.date || r.created_at || r.date_fin;
// //       if (!date) return sum;
// //       try {
// //         const repDate = new Date(date);
// //         const now = new Date();
// //         if (repDate.getMonth() === now.getMonth() && repDate.getFullYear() === now.getFullYear()) {
// //           return sum + (parseFloat(r.cout) || parseFloat(r.cout_reparation) || parseFloat(r.prix) || 0);
// //         }
// //       } catch {}
// //       return sum;
// //     }, 0);

// //     // === RÉSEAU ===
// //     const reseauFonctionnel = safeFilter(reseauArray, r => {
// //       const etat = (r.etat || '').toString().toLowerCase();
// //       const statut = (r.statut || '').toString().toLowerCase();
// //       return etat.includes('fonctionnel') || 
// //              etat.includes('actif') ||
// //              statut.includes('actif') ||
// //              statut.includes('fonctionnel') ||
// //              !etat.includes('panne') && !etat.includes('déconnecté') && !etat.includes('hors service');
// //     }).length;

// //     const reseauPanne = safeFilter(reseauArray, r => {
// //       const etat = (r.etat || '').toString().toLowerCase();
// //       const statut = (r.statut || '').toString().toLowerCase();
// //       return etat.includes('panne') || 
// //              etat.includes('défectueux') ||
// //              etat.includes('hors service') ||
// //              etat.includes('déconnecté') ||
// //              statut.includes('panne') ||
// //              statut.includes('hors service');
// //     }).length;

// //     const reseauParStatut = safeReduce(reseauArray, (acc, r) => {
// //       const etat = (r.etat || '').toString().toLowerCase();
// //       const statut = (r.statut || '').toString().toLowerCase();
      
// //       let statutNormalise = 'Fonctionnel';
      
// //       if (etat.includes('panne') || etat.includes('déconnecté') || etat.includes('hors ligne') ||
// //           statut.includes('panne') || statut.includes('déconnecté')) {
// //         statutNormalise = 'Déconnexion du réseau';
// //       } else if (etat.includes('instable') || etat.includes('intermittent') ||
// //                  statut.includes('instable') || statut.includes('intermittent')) {
// //         statutNormalise = 'Connexion instable';
// //       } else if (etat.includes('maintenance') || etat.includes('réparation') ||
// //                  statut.includes('maintenance') || statut.includes('réparation')) {
// //         statutNormalise = 'Maintenance';
// //       }
      
// //       acc[statutNormalise] = (acc[statutNormalise] || 0) + 1;
// //       return acc;
// //     }, {});

// //     // === CALCUL DES TAUX ===
// //     const tauxDisponibilite = materielsArray.length > 0 ? 
// //       (materielsFonctionnels / materielsArray.length * 100).toFixed(1) : 0;

// //     const tauxResolutionIncidents = (incidentsActifs + incidentsResolus) > 0 ? 
// //       (incidentsResolus / (incidentsActifs + incidentsResolus) * 100).toFixed(1) : 100;

// //     const calculatedStats = {
// //       total_materiels: materielsArray.length,
// //       materiels_fonctionnels: materielsFonctionnels,
// //       materiels_en_panne: materielsEnPanne,
// //       materiels_maintenance: materielsMaintenance,
// //       materiels_par_service: materielsParService,
      
// //       total_logiciels: logicielsArray.length,
// //       logiciels_actifs: logicielsInstalles,
// //       logiciels_installes: logicielsInstalles,
// //       logiciels_par_type: logicielsParType,
      
// //       incidents_ouverts: incidentsOuverts,
// //       incidents_actifs: incidentsActifs,
// //       incidents_resolus: incidentsResolus,
// //       incidents_par_priorite: incidentsParPriorite,
// //       incidents_evolution: incidentsEvolution,
// //       taux_resolution_incidents: parseFloat(tauxResolutionIncidents),
      
// //       reparations_ce_mois: reparationsCeMois,
// //       cout_total_reparations: coutTotalReparations,
// //       cout_reparations_ce_mois: coutReparationsCeMois,
      
// //       alertes_actives: alertesActives,
// //       alertes_critiques: alertesCritiques,
// //       alertes_par_severite: alertesParSeverite,
      
// //       total_equipements_reseau: reseauArray.length,
// //       reseau_fonctionnel: reseauFonctionnel,
// //       reseau_panne: reseauPanne,
// //       reseau_par_statut: reseauParStatut,
      
// //       taux_disponibilite: parseFloat(tauxDisponibilite),
// //     };

// //     console.log('📊 Statistiques finales calculées:', {
// //       materiels: calculatedStats.total_materiels,
// //       logiciels: {
// //         total: calculatedStats.total_logiciels,
// //         installes: calculatedStats.logiciels_installes,
// //         types: calculatedStats.logiciels_par_type
// //       },
// //       incidents: {
// //         total: incidentsArray.length,
// //         actifs: calculatedStats.incidents_actifs,
// //         résolus: calculatedStats.incidents_resolus
// //       },
// //       alertes: {
// //         total: alertesArray.length,
// //         actives: calculatedStats.alertes_actives,
// //         critiques: calculatedStats.alertes_critiques
// //       },
// //       coutTotal: calculatedStats.cout_total_reparations
// //     });
    
// //     setStats(calculatedStats);
// //   }, []);

// //   // Auto-refresh
// //   useEffect(() => {
// //     loadData();
    
// //     if (autoRefresh) {
// //       const interval = setInterval(() => {
// //         loadData();
// //       }, 30000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [loadData, autoRefresh]);

// //   // Préparer les données pour les graphiques
// //   const chartData = useMemo(() => {
// //     // Matériels par Service
// //     const servicesData = [
// //       { service: 'Secrétariat', count: stats.materiels_par_service['Secrétariat'] || 0, fill: '#3b82f6' },
// //       { service: 'Direction', count: stats.materiels_par_service['Direction'] || 0, fill: '#8b5cf6' },
// //       { service: 'Informatique', count: stats.materiels_par_service['Informatique'] || 0, fill: '#10b981' },
// //       { service: 'Archives', count: stats.materiels_par_service['Archives'] || 0, fill: '#f59e0b' },
// //       { service: 'Autre', count: stats.materiels_par_service['Autre'] || 0, fill: '#6b7280' },
// //     ].filter(item => item.count > 0);

// //     // État des Matériels
// //     const materielsEtat = [
// //       { name: 'Fonctionnel', value: stats.materiels_fonctionnels, color: '#10b981' },
// //       { name: 'En panne', value: stats.materiels_en_panne, color: '#ef4444' },
// //       { name: 'Maintenance', value: stats.materiels_maintenance, color: '#f59e0b' },
// //     ].filter(item => item.value > 0);

// //     // Incidents par Priorité
// //     const incidentsPriorite = Object.entries(stats.incidents_par_priorite || {}).map(([priorite, count]) => ({
// //       priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
// //       count,
// //       fill: priorite === 'critique' ? '#ef4444' : 
// //             priorite === 'haute' ? '#f97316' : 
// //             priorite === 'moyenne' ? '#eab308' : '#22c55e'
// //     }));

// //     // Évolution des Incidents
// //     const incidentsEvolution = stats.incidents_evolution || [];

// //     // Alertes par Sévérité
// //     const alertesSeverite = Object.entries(stats.alertes_par_severite || {}).map(([severite, count]) => ({
// //       severite: severite.charAt(0).toUpperCase() + severite.slice(1),
// //       count,
// //       fill: severite === 'critique' ? '#ef4444' : 
// //             severite === 'haute' ? '#f97316' : 
// //             severite === 'moyenne' ? '#eab308' : '#22c55e'
// //     }));

// //     // LOGICIELS PAR TYPE - Données formatées
// //     const logicielsTypeData = [
// //       { type: 'Bureautique', count: stats.logiciels_par_type['Bureautique'] || 0, fill: '#3b82f6' },
// //       { type: 'Système d\'exploitation', count: stats.logiciels_par_type['Système d\'exploitation'] || 0, fill: '#8b5cf6' },
// //       { type: 'Métier', count: stats.logiciels_par_type['Métier'] || 0, fill: '#10b981' },
// //       { type: 'Sécurité', count: stats.logiciels_par_type['Sécurité'] || 0, fill: '#ef4444' },
// //       { type: 'Graphisme/Design', count: stats.logiciels_par_type['Graphisme/Design'] || 0, fill: '#ec4899' },
// //       { type: 'Base de données', count: stats.logiciels_par_type['Base de données'] || 0, fill: '#06b6d4' },
// //       { type: 'Navigateur', count: stats.logiciels_par_type['Navigateur'] || 0, fill: '#f59e0b' },
// //       { type: 'Autre', count: stats.logiciels_par_type['Autre'] || 0, fill: '#6b7280' },
// //     ].filter(item => item.count > 0);

// //     // Réseau par Statut
// //     const reseauStatutData = Object.entries(stats.reseau_par_statut || {}).map(([statut, count]) => ({
// //       statut,
// //       count,
// //       fill: statut === 'Fonctionnel' ? '#10b981' :
// //             statut === 'Connexion instable' ? '#eab308' :
// //             statut === 'Maintenance' ? '#f59e0b' : '#ef4444'
// //     }));

// //     // Données de Synthèse
// //     const syntheseData = [
// //       {
// //         label: 'Matériels fonctionnels',
// //         value: stats.materiels_fonctionnels,
// //         total: stats.total_materiels,
// //         icon: CheckCircle,
// //         color: 'success',
// //         description: `Taux: ${stats.taux_disponibilite}%`
// //       },
// //       {
// //         label: 'Incidents actifs',
// //         value: stats.incidents_actifs,
// //         total: stats.incidents_actifs + stats.incidents_resolus,
// //         icon: AlertTriangle,
// //         color: 'error',
// //         description: `${stats.incidents_resolus} résolus • Taux: ${stats.taux_resolution_incidents}%`
// //       },
// //       {
// //         label: 'Alertes critiques',
// //         value: stats.alertes_critiques,
// //         total: stats.alertes_actives,
// //         icon: AlertCircle,
// //         color: 'error',
// //         description: `${stats.alertes_actives} alertes actives`
// //       },
// //       {
// //         label: 'Réparations ce mois',
// //         value: stats.reparations_ce_mois,
// //         icon: Wrench,
// //         color: 'info',
// //         description: `Coût: ${formatCurrency(stats.cout_reparations_ce_mois)}`
// //       },
// //       {
// //         label: 'Logiciels installés',
// //         value: stats.logiciels_installes,
// //         total: stats.total_logiciels,
// //         icon: Package,
// //         color: 'success',
// //         description: `${stats.logiciels_installes} / ${stats.total_logiciels}`
// //       },
// //       {
// //         label: 'Équipements réseau',
// //         value: stats.reseau_fonctionnel,
// //         total: stats.total_equipements_reseau,
// //         icon: Network,
// //         color: 'success',
// //         description: `${stats.reseau_panne} en panne`
// //       },
// //     ];

// //     return {
// //       servicesData,
// //       materielsEtat,
// //       incidentsPriorite,
// //       incidentsEvolution,
// //       alertesSeverite,
// //       logicielsTypeData,
// //       reseauStatutData,
// //       syntheseData
// //     };
// //   }, [stats, formatCurrency]);

// //   // Générer rapport PDF
// //   const generateDetailedPDF = useCallback(async () => {
// //     const doc = new jsPDF('landscape');
    
// //     try {
// //       const imgData = await getBase64Image(logoDren);
// //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// //     } catch (error) {
// //       console.warn('Logo non chargé');
// //     }
    
// //     doc.setFontSize(20);
// //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// //     doc.setFontSize(16);
// //     doc.text('TABLEAU DE BORD COMPLET', 20, 45);
    
// //     doc.setFontSize(12);
// //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
// //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 67);
    
// //     doc.setDrawColor(200, 200, 200);
// //     doc.line(20, 75, 190, 75);
    
// //     doc.setFontSize(14);
// //     doc.text('SYNTHÈSE DES DONNÉES', 20, 90);
    
// //     const syntheseStats = [
// //       ['Indicateur', 'Valeur', 'Détail'],
// //       ['Matériels fonctionnels', stats.materiels_fonctionnels.toString(), `${stats.total_materiels} total`],
// //       ['Incidents actifs', stats.incidents_actifs.toString(), `${stats.incidents_resolus} résolus`],
// //       ['Alertes critiques', stats.alertes_critiques.toString(), `${stats.alertes_actives} actives`],
// //       ['Réparations ce mois', stats.reparations_ce_mois.toString(), formatCurrency(stats.cout_reparations_ce_mois)],
// //       ['Logiciels installés', stats.logiciels_installes.toString(), `${stats.total_logiciels} total`],
// //       ['Équipements réseau', stats.reseau_fonctionnel.toString(), `${stats.total_equipements_reseau} total`],
// //       ['Taux disponibilité', `${stats.taux_disponibilite}%`, 'Matériels'],
// //       ['Taux résolution incidents', `${stats.taux_resolution_incidents}%`, 'Incidents'],
// //       ['Coût total réparations', formatCurrency(stats.cout_total_reparations), 'Depuis le début'],
// //     ];
    
// //     autoTable(doc, {
// //       startY: 95,
// //       head: syntheseStats.slice(0, 1),
// //       body: syntheseStats.slice(1),
// //       theme: 'grid',
// //       headStyles: { fillColor: [59, 130, 246] },
// //     });
    
// //     doc.save(`dashboard-complet-${new Date().toISOString().split('T')[0]}.pdf`);
// //     showNotification('Rapport PDF généré avec succès', 'success');
// //   }, [user, stats, formatCurrency, showNotification]);

// //   // Composant StatCard
// //   const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
// //     const colorClasses = {
// //       blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
// //       purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
// //       yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
// //       red: { bg: 'bg-red-100', text: 'text-red-600' },
// //       indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
// //       green: { bg: 'bg-green-100', text: 'text-green-600' },
// //       primary: { bg: 'bg-primary/10', text: 'text-primary' },
// //       success: { bg: 'bg-success/10', text: 'text-success' },
// //       error: { bg: 'bg-error/10', text: 'text-error' },
// //       warning: { bg: 'bg-warning/10', text: 'text-warning' },
// //       info: { bg: 'bg-info/10', text: 'text-info' },
// //     };

// //     const colorConfig = colorClasses[color] || colorClasses.primary;

// //     return (
// //       <div className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 relative">
// //         {trend !== undefined && (
// //           <div className={`absolute -top-2 -right-2 badge badge-sm ${trend > 0 ? 'badge-success' : 'badge-error'}`}>
// //             {trend > 0 ? '+' : ''}{trend}%
// //           </div>
// //         )}
// //         <div className="card-body p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-sm font-semibold text-base-content opacity-70">{title}</h3>
// //               <p className="text-2xl font-bold mt-1 text-base-content">{value}</p>
// //               {subtitle && <p className="text-xs text-base-content opacity-60 mt-1">{subtitle}</p>}
// //             </div>
// //             <div className={`p-3 rounded-lg ${colorConfig.bg}`}>
// //               <Icon className={`h-6 w-6 ${colorConfig.text}`} />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Composant SyntheseItem
// //   const SyntheseItem = ({ label, value, total, icon: Icon, color = 'primary', description }) => {
// //     const colorClasses = {
// //       success: { bg: 'bg-success/10', text: 'text-success', icon: 'text-success' },
// //       error: { bg: 'bg-error/10', text: 'text-error', icon: 'text-error' },
// //       info: { bg: 'bg-info/10', text: 'text-info', icon: 'text-info' },
// //       primary: { bg: 'bg-primary/10', text: 'text-primary', icon: 'text-primary' },
// //     };

// //     const colorConfig = colorClasses[color] || colorClasses.primary;
// //     const percentage = total ? Math.round((value / total) * 100) : 100;

// //     return (
// //       <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
// //         <div className="flex items-center gap-3">
// //           <div className={`p-2 rounded-lg ${colorConfig.bg}`}>
// //             <Icon className={`h-5 w-5 ${colorConfig.icon}`} />
// //           </div>
// //           <div className="flex-1">
// //             <span className="font-medium text-base-content">{label}</span>
// //             {description && (
// //               <p className="text-xs text-base-content opacity-60 mt-1">{description}</p>
// //             )}
// //             {total && (
// //               <div className="mt-2 w-full bg-base-300 rounded-full h-2">
// //                 <div 
// //                   className={`h-2 rounded-full ${colorConfig.text.replace('text-', 'bg-')}`}
// //                   style={{ width: `${percentage}%` }}
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //         <div className="text-right">
// //           <span className={`text-2xl font-bold ${colorConfig.text}`}>{value}</span>
// //           {total && (
// //             <p className="text-xs text-base-content opacity-60">sur {total}</p>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-screen">
// //         <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
// //         <h2 className="text-xl font-semibold text-base-content">Chargement du tableau de bord...</h2>
// //         <p className="text-base-content opacity-70 mt-2">Connexion aux sources de données</p>
// //         <div className="mt-4 w-64 bg-base-300 rounded-full h-2">
// //           <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
// //       {/* En-tête */}
// //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
// //         <div>
// //           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
// //             <BarChart3 className="h-8 w-8 text-primary" />
// //             Tableau de Bord IT
// //             <span className="badge badge-primary badge-lg">DREN Antsimo Andrefana</span>
// //           </h1>
// //           <p className="text-base-content opacity-70 mt-1">
// //             Surveillance complète du parc informatique - Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
// //           </p>
// //         </div>
        
// //         <div className="flex flex-wrap gap-2">
// //           <div className="form-control">
// //             <label className="label cursor-pointer gap-2">
// //               <span className="label-text text-sm text-base-content">Auto-refresh (30s)</span>
// //               <input 
// //                 type="checkbox" 
// //                 className="toggle toggle-primary toggle-sm"
// //                 checked={autoRefresh}
// //                 onChange={(e) => setAutoRefresh(e.target.checked)}
// //               />
// //             </label>
// //           </div>
          
// //           <div className="dropdown dropdown-end">
// //             <button className="btn btn-primary btn-sm">
// //               <Download className="h-4 w-4 mr-2" />
// //               Exporter
// //             </button>
// //             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// //               <li><button onClick={generateDetailedPDF}>Rapport PDF</button></li>
// //               <li><button onClick={() => showNotification('Fonctionnalité à venir', 'info')}>Excel</button></li>
// //             </ul>
// //           </div>
          
// //           <button 
// //             onClick={loadData}
// //             className="btn btn-outline btn-sm text-base-content"
// //             disabled={loading}
// //           >
// //             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
// //             {loading ? 'Actualisation...' : 'Actualiser'}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Statistiques principales */}
// //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
// //         <StatCard
// //           title="Matériels"
// //           value={stats.total_materiels}
// //           icon={Database}
// //           color="blue"
// //           subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
// //         />
        
// //         <StatCard
// //           title="Logiciels"
// //           value={stats.total_logiciels}
// //           icon={Package}
// //           color="purple"
// //           subtitle={`${stats.logiciels_installes} installés`}
// //         />
        
// //         <StatCard
// //           title="Alertes"
// //           value={stats.alertes_actives}
// //           icon={Bell}
// //           color="yellow"
// //           subtitle={`${stats.alertes_critiques} critiques`}
// //         />
        
// //         <StatCard
// //           title="Incidents"
// //           value={stats.incidents_actifs}
// //           icon={AlertTriangle}
// //           color="red"
// //           subtitle={`${stats.incidents_resolus} résolus`}
// //         />
        
// //         <StatCard
// //           title="Équipements Réseau"
// //           value={stats.total_equipements_reseau}
// //           icon={Network}
// //           color="indigo"
// //           subtitle={`${stats.reseau_fonctionnel} fonctionnels`}
// //         />
        
// //         <StatCard
// //           title="Coût Réparations"
// //           value={formatCurrency(stats.cout_total_reparations)}
// //           icon={DollarSign}
// //           color="green"
// //           subtitle={`${stats.reparations_ce_mois} ce mois`}
// //         />
// //       </div>

// //       {/* Section 1: Matériels */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         {/* Matériels par Service */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <Users className="h-5 w-5 mr-2" />
// //               Matériels par Service
// //               <span className="badge badge-primary ml-2">
// //                 {Object.keys(stats.materiels_par_service).length} services
// //               </span>
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={chartData.servicesData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="service" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// //                 />
// //                 <YAxis 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF' }}
// //                 />
// //                 <Tooltip 
// //                   contentStyle={{ 
// //                     backgroundColor: '#1F2937', 
// //                     borderColor: '#374151', 
// //                     color: '#F9FAFB',
// //                     borderRadius: '8px'
// //                   }}
// //                   formatter={(value) => [`${value} matériels`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Bar 
// //                   dataKey="count" 
// //                   name="Matériels"
// //                   radius={[4, 4, 0, 0]}
// //                 >
// //                   {chartData.servicesData.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// //                   ))}
// //                 </Bar>
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>

// //         {/* État des Matériels */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <PieChartIcon className="h-5 w-5 mr-2" />
// //               État des Matériels
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <PieChart>
// //                 <Pie
// //                   data={chartData.materielsEtat}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, value }) => `${name}: ${value}`}
// //                   outerRadius={80}
// //                   dataKey="value"
// //                 >
// //                   {chartData.materielsEtat.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //                 <Legend />
// //               </PieChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               Taux de disponibilité: <strong>{stats.taux_disponibilite}%</strong>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section 2: Incidents */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         {/* Incidents par Priorité */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <AlertTriangle className="h-5 w-5 mr-2" />
// //               Incidents par Priorité
// //               <span className="badge badge-error ml-2">{stats.incidents_actifs} actifs</span>
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={chartData.incidentsPriorite}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="priorite" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// //                 />
// //                 <YAxis stroke="#9CA3AF" />
// //                 <Tooltip 
// //                   contentStyle={{ 
// //                     backgroundColor: '#1F2937', 
// //                     borderColor: '#374151', 
// //                     color: '#F9FAFB'
// //                   }}
// //                   formatter={(value) => [`${value} incidents`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Bar 
// //                   dataKey="count" 
// //                   name="Incidents"
// //                   radius={[4, 4, 0, 0]}
// //                 >
// //                   {chartData.incidentsPriorite.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// //                   ))}
// //                 </Bar>
// //               </BarChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               {stats.incidents_resolus} résolus • Taux de résolution: <strong>{stats.taux_resolution_incidents}%</strong>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Évolution des Incidents */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <LineChartIcon className="h-5 w-5 mr-2" />
// //               Évolution des Incidents (30 jours)
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <AreaChart data={chartData.incidentsEvolution}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="date" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 11 }}
// //                 />
// //                 <YAxis stroke="#9CA3AF" />
// //                 <Tooltip 
// //                   contentStyle={{ 
// //                     backgroundColor: '#1F2937', 
// //                     borderColor: '#374151', 
// //                     color: '#F9FAFB'
// //                   }}
// //                   formatter={(value) => [`${value} incidents`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Area 
// //                   type="monotone" 
// //                   dataKey="incidents" 
// //                   stroke="#ef4444" 
// //                   fill="#ef4444"
// //                   fillOpacity={0.3}
// //                   name="Incidents"
// //                 />
// //               </AreaChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               Moyenne: {chartData.incidentsEvolution.length > 0 ? 
// //                 Math.round(chartData.incidentsEvolution.reduce((sum, day) => sum + day.incidents, 0) / chartData.incidentsEvolution.length) : 0} incidents/jour
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section 3: Logiciels & Réseau */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         {/* Logiciels par Type */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <Package className="h-5 w-5 mr-2" />
// //               Logiciels par Type
// //               <span className="badge badge-success ml-2">{stats.logiciels_installes} installés</span>
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={chartData.logicielsTypeData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="type" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 11 }}
// //                   angle={-45}
// //                   textAnchor="end"
// //                   height={70}
// //                 />
// //                 <YAxis stroke="#9CA3AF" />
// //                 <Tooltip 
// //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// //                   formatter={(value) => [`${value} logiciels`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Bar 
// //                   dataKey="count" 
// //                   name="Logiciels"
// //                   radius={[4, 4, 0, 0]}
// //                 >
// //                   {chartData.logicielsTypeData.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// //                   ))}
// //                 </Bar>
// //               </BarChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               {stats.total_logiciels} logiciels au total • {stats.logiciels_installes} installés ({Math.round((stats.logiciels_installes / stats.total_logiciels) * 100)}%)
// //             </div>
// //           </div>
// //         </div>

// //         {/* Équipements Réseau par Statut */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <Network className="h-5 w-5 mr-2" />
// //               Équipements Réseau par Statut
// //               <span className="badge badge-info ml-2">{stats.total_equipements_reseau} équipements</span>
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={chartData.reseauStatutData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="statut" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// //                 />
// //                 <YAxis stroke="#9CA3AF" />
// //                 <Tooltip 
// //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// //                   formatter={(value) => [`${value} équipements`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Bar 
// //                   dataKey="count" 
// //                   name="Équipements"
// //                   radius={[4, 4, 0, 0]}
// //                 >
// //                   {chartData.reseauStatutData.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// //                   ))}
// //                 </Bar>
// //               </BarChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               {stats.reseau_fonctionnel} fonctionnels • {stats.reseau_panne} en panne ({Math.round((stats.reseau_fonctionnel / stats.total_equipements_reseau) * 100)}% fonctionnels)
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section 4: Synthèse */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         {/* Synthèse des Données */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <Database className="h-5 w-5 mr-2" />
// //               Synthèse des Données
// //               <span className="badge badge-info ml-2">Indicateurs clés</span>
// //             </h3>
            
// //             <div className="space-y-3">
// //               {chartData.syntheseData.map((item, index) => (
// //                 <SyntheseItem
// //                   key={index}
// //                   label={item.label}
// //                   value={item.value}
// //                   total={item.total}
// //                   icon={item.icon}
// //                   color={item.color}
// //                   description={item.description}
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Informations système */}
// //         <div className="space-y-6">
// //           {/* Alertes par Sévérité */}
// //           <div className="card bg-base-100 shadow-lg border border-base-300">
// //             <div className="card-body">
// //               <h3 className="card-title text-base-content">
// //                 <Bell className="h-5 w-5 mr-2" />
// //                 Alertes par Sévérité
// //                 <span className="badge badge-warning ml-2">{stats.alertes_actives} actives</span>
// //               </h3>
// //               <ResponsiveContainer width="100%" height={250}>
// //                 <BarChart data={chartData.alertesSeverite}>
// //                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                   <XAxis 
// //                     dataKey="severite" 
// //                     stroke="#9CA3AF"
// //                     tick={{ fill: '#9CA3AF', fontSize: 12 }}
// //                   />
// //                   <YAxis stroke="#9CA3AF" />
// //                   <Tooltip 
// //                     contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// //                     formatter={(value) => [`${value} alertes`, 'Quantité']}
// //                   />
// //                   <Legend />
// //                   <Bar 
// //                     dataKey="count" 
// //                     name="Alertes"
// //                     radius={[4, 4, 0, 0]}
// //                   >
// //                     {chartData.alertesSeverite.map((entry, index) => (
// //                       <Cell key={`cell-${index}`} fill={entry.fill} />
// //                     ))}
// //                   </Bar>
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </div>

// //           {/* Informations système */}
// //           <div className="card bg-base-200 border border-base-300">
// //             <div className="card-body">
// //               <h3 className="card-title text-base-content">
// //                 <Info className="h-5 w-5 mr-2" />
// //                 Informations système
// //               </h3>
// //               <div className="space-y-3 text-sm">
// //                 <div className="flex justify-between">
// //                   <span className="font-medium text-base-content">Données chargées:</span>
// //                   <span className="text-base-content">
// //                     {materiels.length} matériels, {logiciels.length} logiciels
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="font-medium text-base-content">Utilisateur:</span>
// //                   <span className="text-base-content">{user?.nom_complet || user?.username || 'Non connecté'}</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="font-medium text-base-content">Auto-refresh:</span>
// //                   <span className="text-base-content">{autoRefresh ? 'Activé (30s)' : 'Désactivé'}</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="font-medium text-base-content">Dernière actualisation:</span>
// //                   <span className="text-base-content">{lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '--'}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recommandations & Alertes */}
// //       <div className="card bg-base-200 border border-base-300 mb-6">
// //         <div className="card-body">
// //           <h3 className="card-title text-base-content">
// //             <AlertCircle className="h-5 w-5 mr-2" />
// //             Recommandations & Alertes
// //           </h3>
// //           <div className="space-y-2 text-sm">
// //             {stats.materiels_en_panne > 0 && (
// //               <div className="alert alert-error">
// //                 <AlertTriangle className="h-4 w-4" />
// //                 <span className="text-base-content">🚨 {stats.materiels_en_panne} matériel(s) en panne nécessite(nt) intervention</span>
// //               </div>
// //             )}
// //             {stats.alertes_critiques > 0 && (
// //               <div className="alert alert-warning">
// //                 <Shield className="h-4 w-4" />
// //                 <span className="text-base-content">⚠️ {stats.alertes_critiques} alerte(s) critique(s) en attente</span>
// //               </div>
// //             )}
// //             {stats.incidents_actifs > 0 && (
// //               <div className="alert alert-warning">
// //                 <AlertTriangle className="h-4 w-4" />
// //                 <span className="text-base-content">📋 {stats.incidents_actifs} incident(s) actif(s) à traiter</span>
// //               </div>
// //             )}
// //             {stats.reseau_panne > 0 && (
// //               <div className="alert alert-warning">
// //                 <Network className="h-4 w-4" />
// //                 <span className="text-base-content">🌐 {stats.reseau_panne} équipement(s) réseau en panne</span>
// //               </div>
// //             )}
// //             {stats.materiels_en_panne === 0 && stats.alertes_critiques === 0 && stats.incidents_actifs === 0 && (
// //               <div className="alert alert-success">
// //                 <CheckCircle className="h-4 w-4" />
// //                 <span className="text-base-content">✅ Tous les systèmes sont opérationnels</span>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


// // // src/pages/Dashboard.jsx - VERSION CORRIGÉE POUR INCIDENTS ET LOGICIELS
// // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // import { 
// //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// //   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
// //   AreaChart, Area
// // } from 'recharts';
// // import { 
// //   BarChart3, RefreshCw, Users, 
// //   AlertTriangle, CheckCircle,
// //   Database, Bell, Package, 
// //   Network, Wrench,
// //   PieChart as PieChartIcon,
// //   LineChart as LineChartIcon, Info, 
// //   Shield, DollarSign,
// //   AlertCircle,
// //   Check,
// //   Download,
// //   Monitor, Server, Cpu, TrendingUp
// // } from 'lucide-react';
// // import { 
// //   materielsAPI, 
// //   incidentsAPI, 
// //   reparationsAPI, 
// // //   logicielsAPI, 
// //   alertesAPI, 
// // //   reseauAPI 
// // } from '../services/api';
// // import { useAuth } from '../context/AuthContext';
// // import { useNotification } from '../context/NotificationContext';
// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // // Import du logo
// // import logoDren from '../assets/images/logo-dren.jpeg';

// // // COULEURS FIXES POUR CHAQUE SERVICE
// // const SERVICE_COLORS = {
// //   'Secrétariat': '#3b82f6',
// //   'Direction': '#8b5cf6',
// //   'Informatique': '#10b981',
// //   'Archives': '#f59e0b',
// //   'Non assigné': '#9ca3af',
// //   'Autre': '#6b7280',
// // };

// // // Fonction pour convertir une image en base64
// // const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
// //   const img = new Image();
// //   img.crossOrigin = 'Anonymous';
// //   img.onload = () => {
// //     const canvas = document.createElement('canvas');
// //     const ctx = canvas.getContext('2d');
// //     canvas.width = img.width;
// //     canvas.height = img.height;
// //     ctx.drawImage(img, 0, 0);
// //     resolve(canvas.toDataURL('image/jpeg'));
// //   };
// //   img.onerror = reject;
// //   img.src = imgUrl;
// // });

// // const Dashboard = () => {
// //   const { user } = useAuth();
// //   const { showNotification } = useNotification();
  
// //   // États principaux
// //   const [stats, setStats] = useState({
// //     total_materiels: 0,
// //     materiels_fonctionnels: 0,
// //     materiels_en_panne: 0,
// //     materiels_maintenance: 0,
// //     materiels_par_service: {},
// //     materiels_par_type: {},
    
// //     total_logiciels: 0,
// //     logiciels_actifs: 0,
// //     logiciels_installes: 0,
// //     logiciels_expires: 0,
// //     logiciels_par_type: {},
    
// //     total_incidents: 0,
// //     incidents_ouverts: 0,
// //     incidents_en_cours: 0,
// //     incidents_resolus: 0,
// //     incidents_par_priorite: {},
// //     incidents_evolution: [],
// //     taux_resolution_incidents: 0,
    
// //     reparations_ce_mois: 0,
// //     cout_total_reparations: 0,
// //     cout_reparations_ce_mois: 0,
    
// //     alertes_actives: 0,
// //     alertes_critiques: 0,
// //     alertes_panne: 0,
// //     alertes_maintenance: 0,
// //     alertes_par_type: {},
// //     alertes_par_severite: {},
    
// //     total_equipements_reseau: 0,
// //     reseau_fonctionnel: 0,
// //     reseau_panne: 0,
// //     reseau_par_type: {},
// //     reseau_par_statut: {},
    
// //     taux_disponibilite: 0,
// //   });
  
// //   // États pour les données brutes
// //   const [materiels, setMateriels] = useState([]);
// //   const [incidents, setIncidents] = useState([]);
// //   const [reparations, setReparations] = useState([]);
// //   const [logiciels, setLogiciels] = useState([]);
// //   const [alertes, setAlertes] = useState([]);
// //   const [reseau, setReseau] = useState([]);
  
// //   // États UI
// //   const [loading, setLoading] = useState(true);
// //   const [autoRefresh, setAutoRefresh] = useState(false);
// //   const [lastUpdate, setLastUpdate] = useState(null);

// //   // Fonctions helper
// //   const safeArray = (data) => Array.isArray(data) ? data : [];
// //   const safeFilter = (array, condition) => array?.filter?.(condition) || [];
// //   const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

// //   // Fonction pour extraire les données des réponses API
// //   const extractData = useCallback((response) => {
// //     if (!response) return [];
    
// //     if (Array.isArray(response)) return response;
    
// //     if (response?.data) {
// //       if (Array.isArray(response.data)) return response.data;
// //       if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
// //       if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
// //       if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
// //     }
    
// //     return [];
// //   }, []);

// //   // Formater la devise en Ariary
// //   const formatCurrency = useCallback((amount) => {
// //     return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
// //   }, []);

// //   // Charger les données depuis les API
// //   const loadData = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //     //   console.log('📊 Chargement des données dashboard depuis les API...');

// //       const [
// //         materielsResponse,
// //         incidentsResponse,
// //         reparationsResponse,
// //         logicielsResponse,
// //         alertesResponse,
// //         reseauResponse
// //       ] = await Promise.allSettled([
// //         materielsAPI.getAll().catch(e => {
// //           console.error('❌ Erreur matériels:', e);
// //           return { data: [] };
// //         }),
// //         incidentsAPI.getAll().catch(e => {
// //           console.error('❌ Erreur incidents:', e);
// //           return { data: [] };
// //         }),
// //         reparationsAPI.getAll().catch(e => {
// //           console.error('❌ Erreur réparations:', e);
// //           return { data: [] };
// //         }),
// //         logicielsAPI.getAll().catch(e => {
// //           console.error('❌ Erreur logiciels:', e);
// //           return { data: [] };
// //         }),
// //         alertesAPI.getAll().catch(e => {
// //           console.error('❌ Erreur alertes:', e);
// //           return { data: [] };
// //         }),
// //         reseauAPI.getAll().catch(e => {
// //           console.error('❌ Erreur réseau:', e);
// //           return { data: [] };
// //         })
// //       ]);

// //       // Extraire les données
// //       const materielsData = extractData(materielsResponse.value);
// //       const incidentsData = extractData(incidentsResponse.value);
// //       const reparationsData = extractData(reparationsResponse.value);
// //       const logicielsData = extractData(logicielsResponse.value);
// //       const alertesData = extractData(alertesResponse.value);
// //       const reseauData = extractData(reseauResponse.value);

// //       console.log('📦 Données reçues des API:', {
// //         materiels: materielsData.length,
// //         incidents: incidentsData.length,
// //         reparations: reparationsData.length,
// //         logiciels: logicielsData.length,
// //         alertes: alertesData.length,
// //         reseau: reseauData.length
// //       });

// //       // Afficher les premiers éléments pour vérification
// //       if (logicielsData.length > 0) {
// //         console.log('🔍 Premier logiciel:', {
// //           nom: logicielsData[0].nom,
// //           statut: logicielsData[0].statut,
// //           etat: logicielsData[0].etat,
// //           licence_active: logicielsData[0].licence_active,
// //           installe: logicielsData[0].installe,
// //           actif: logicielsData[0].actif
// //         });
// //       }

// //       if (incidentsData.length > 0) {
// //         console.log('🔍 Premier incident:', {
// //           statut: incidentsData[0].statut,
// //           priorite: incidentsData[0].priorite,
// //           description: incidentsData[0].description
// //         });
// //       }

// //       // Mettre à jour les états
// //       setMateriels(materielsData);
// //       setIncidents(incidentsData);
// //       setReparations(reparationsData);
// //       setLogiciels(logicielsData);
// //       setAlertes(alertesData);
// //       setReseau(reseauData);

// //       // Calculer les statistiques
// //       calculateStats({
// //         materiels: materielsData,
// //         incidents: incidentsData,
// //         reparations: reparationsData,
// //         logiciels: logicielsData,
// //         alertes: alertesData,
// //         reseau: reseauData
// //       });
      
// //       setLastUpdate(new Date());
// //       showNotification('Tableau de bord actualisé', 'success');

// //     } catch (error) {
// //       console.error('❌ Erreur générale:', error);
// //       showNotification('Erreur lors du chargement', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [extractData, showNotification]);

// //   // Calculer les statistiques
// //   const calculateStats = useCallback((data) => {
// //     const {
// //       materiels: materielsArray,
// //       incidents: incidentsArray,
// //       reparations: reparationsArray,
// //       logiciels: logicielsArray,
// //       alertes: alertesArray,
// //       reseau: reseauArray
// //     } = data;

// //     // === MATÉRIELS ===
// //     const materielsFonctionnels = safeFilter(materielsArray, m => {
// //       const etat = (m.etat || '').toString().toLowerCase();
// //       return etat.includes('fonctionnel') || 
// //              etat.includes('actif') || 
// //              etat.includes('opérationnel') ||
// //              etat.includes('en service') ||
// //              etat === 'bon' ||
// //              etat === 'good' ||
// //              m.statut === 'actif' ||
// //              m.statut === 'fonctionnel';
// //     }).length;

// //     const materielsEnPanne = safeFilter(materielsArray, m => {
// //       const etat = (m.etat || '').toString().toLowerCase();
// //       return etat.includes('panne') || 
// //              etat.includes('défectueux') || 
// //              etat.includes('hors service') ||
// //              m.statut === 'panne' ||
// //              m.statut === 'hors service';
// //     }).length;

// //     const materielsMaintenance = safeFilter(materielsArray, m => {
// //       const etat = (m.etat || '').toString().toLowerCase();
// //       return etat.includes('maintenance') || 
// //              etat.includes('réparation') || 
// //              etat.includes('en réparation') ||
// //              m.statut === 'maintenance' ||
// //              m.statut === 'réparation';
// //     }).length;

// //     const materielsParService = safeReduce(materielsArray, (acc, m) => {
// //       const service = m.service || m.departement || m.service_attribue || m.direction || 'Non assigné';
      
// //       let serviceNormalise = 'Autre';
// //       const serviceLower = service.toLowerCase();
      
// //       if (serviceLower.includes('secrétariat') || serviceLower.includes('secretariat')) {
// //         serviceNormalise = 'Secrétariat';
// //       } else if (serviceLower.includes('direction') || serviceLower.includes('dir')) {
// //         serviceNormalise = 'Direction';
// //       } else if (serviceLower.includes('informatique') || serviceLower.includes('it') || serviceLower.includes('info')) {
// //         serviceNormalise = 'Informatique';
// //       } else if (serviceLower.includes('archives') || serviceLower.includes('archive')) {
// //         serviceNormalise = 'Archives';
// //       } else {
// //         serviceNormalise = 'Autre';
// //       }
      
// //       acc[serviceNormalise] = (acc[serviceNormalise] || 0) + 1;
// //       return acc;
// //     }, {});

// //     // === LOGICIELS - DÉTECTION DES INSTALLATIONS ===
// //     console.log('🔍 Analyse des logiciels:', {
// //       total: logicielsArray.length,
// //       premier: logicielsArray[0] ? {
// //         nom: logicielsArray[0].nom,
// //         statut: logicielsArray[0].statut,
// //         etat: logicielsArray[0].etat,
// //         licence: logicielsArray[0].licence_active,
// //         installe: logicielsArray[0].installe,
// //         actif: logicielsArray[0].actif
// //       } : 'aucun'
// //     });

// //     // Détection des logiciels installés
// //     const logicielsInstalles = safeFilter(logicielsArray, l => {
// //       const statut = (l.statut || '').toString().toLowerCase();
// //       const etat = (l.etat || '').toString().toLowerCase();
// //       const licence = (l.licence_active || '').toString().toLowerCase();
// //       const installe = (l.installe || '').toString().toLowerCase();
// //       const actif = (l.actif || '').toString().toLowerCase();
// //       const installation = (l.installation || '').toString().toLowerCase();
      
// //       // Vérification complète des logiciels installés
// //       const estInstalle = 
// //         statut.includes('installé') || 
// //         statut.includes('installe') ||
// //         statut.includes('actif') ||
// //         statut.includes('activé') ||
// //         statut.includes('en service') ||
// //         etat.includes('installé') ||
// //         etat.includes('actif') ||
// //         etat.includes('en service') ||
// //         licence === 'true' ||
// //         licence === 'oui' ||
// //         licence === 'actif' ||
// //         licence === 'active' ||
// //         installe === 'true' ||
// //         installe === 'oui' ||
// //         installe === 'installé' ||
// //         actif === 'true' ||
// //         actif === 'oui' ||
// //         actif === 'actif' ||
// //         installation === 'true' ||
// //         installation === 'oui' ||
// //         installation === 'installé' ||
// //         l.actif === true ||
// //         l.installe === true ||
// //         l.licence_active === true ||
// //         l.installation === true ||
// //         l.statut === 'actif' ||
// //         l.etat === 'installé';
      
// //       return estInstalle;
// //     }).length;

// //     console.log('📊 Logiciels installés détectés:', logicielsInstalles, 'sur', logicielsArray.length);

// //     // Détection des logiciels expirés
// //     const logicielsExpires = safeFilter(logicielsArray, l => {
// //       const dateExpiration = l.date_expiration || l.date_fin_validite || l.licence_expiration;
// //       if (!dateExpiration) return false;
// //       try {
// //         const expiryDate = new Date(dateExpiration);
// //         const today = new Date();
// //         return expiryDate < today;
// //       } catch {
// //         return false;
// //       }
// //     }).length;

// //     // Classification des logiciels par type
// //     const logicielsParType = safeReduce(logicielsArray, (acc, l) => {
// //       const nom = (l.nom || '').toString().toLowerCase();
// //       const categorie = (l.categorie || '').toString().toLowerCase();
// //       const type = (l.type || '').toString().toLowerCase();
// //       const description = (l.description || '').toString().toLowerCase();
      
// //       let typeNormalise = 'Autre';
      
// //       // Détection améliorée des types de logiciels
// //       if (nom.includes('office') || nom.includes('word') || nom.includes('excel') || 
// //           nom.includes('powerpoint') || nom.includes('outlook') || nom.includes('access') ||
// //           categorie.includes('bureautique') || type.includes('bureautique') ||
// //           description.includes('bureautique') || nom.includes('libreoffice') ||
// //           nom.includes('openoffice') || nom.includes('suite bureautique')) {
// //         typeNormalise = 'Bureautique';
// //       } else if (nom.includes('windows') || nom.includes('linux') || nom.includes('macos') || 
// //                  nom.includes('ubuntu') || nom.includes('centos') || nom.includes('debian') ||
// //                  nom.includes('os') || type.includes('système') || 
// //                  type.includes('system') || categorie.includes('os') ||
// //                  nom.includes('operating system') || description.includes('système d\'exploitation')) {
// //         typeNormalise = 'Système d\'exploitation';
// //       } else if (nom.includes('antivirus') || nom.includes('firewall') || nom.includes('sécurité') || 
// //                  nom.includes('security') || type.includes('sécurité') || categorie.includes('sécurité') ||
// //                  description.includes('antivirus') || description.includes('firewall') ||
// //                  nom.includes('avast') || nom.includes('kaspersky') || nom.includes('bitdefender') ||
// //                  nom.includes('norton') || nom.includes('malwarebytes')) {
// //         typeNormalise = 'Sécurité';
// //       } else if (type.includes('métier') || type.includes('metier') || categorie.includes('métier') ||
// //                  nom.includes('compta') || nom.includes('gestion') || nom.includes('erp') ||
// //                  nom.includes('crm') || description.includes('logiciel métier') ||
// //                  nom.includes('sage') || nom.includes('ciel') || nom.includes('quadratus') ||
// //                  nom.includes('paye') || nom.includes('comptabilité')) {
// //         typeNormalise = 'Métier';
// //       } else if (nom.includes('adobe') || nom.includes('photoshop') || nom.includes('illustrator') ||
// //                  nom.includes('design') || nom.includes('graphique') || categorie.includes('graphisme') ||
// //                  nom.includes('autocad') || nom.includes('solidworks') || nom.includes('3d') ||
// //                  type.includes('graphique') || description.includes('design')) {
// //         typeNormalise = 'Graphisme/Design';
// //       } else if (nom.includes('base de données') || nom.includes('database') || nom.includes('sql') ||
// //                  nom.includes('mysql') || nom.includes('postgresql') || nom.includes('oracle') ||
// //                  categorie.includes('base de données') || type.includes('base de données')) {
// //         typeNormalise = 'Base de données';
// //       } else if (nom.includes('navigateur') || nom.includes('browser') || nom.includes('chrome') ||
// //                  nom.includes('firefox') || nom.includes('edge') || nom.includes('safari') ||
// //                  categorie.includes('navigateur') || nom.includes('mozilla') || nom.includes('opera')) {
// //         typeNormalise = 'Navigateur';
// //       } else if (nom.includes('pdf') || nom.includes('reader') || nom.includes('acrobat')) {
// //         typeNormalise = 'Utilitaire';
// //       }
      
// //       acc[typeNormalise] = (acc[typeNormalise] || 0) + 1;
// //       return acc;
// //     }, {});

// //     // === INCIDENTS - CORRECTION SUIVANT VOS INSTRUCTIONS ===
// //     const incidentsOuverts = safeFilter(incidentsArray, i => {
// //       const statut = (i.statut || '').toString().toLowerCase();
// //       const etat = (i.etat || '').toString().toLowerCase();
      
// //       // Incidents OUVERTS seulement (statut "ouvert")
// //       return statut.includes('ouvert') || 
// //              statut === 'ouvert' ||
// //              statut === 'open';
// //     }).length;

// //     const incidentsEnCours = safeFilter(incidentsArray, i => {
// //       const statut = (i.statut || '').toString().toLowerCase();
// //       const etat = (i.etat || '').toString().toLowerCase();
      
// //       // Incidents EN COURS (en traitement, assigné, etc.)
// //       return statut.includes('en_cours') || 
// //              statut.includes('traitement') ||
// //              statut.includes('assigné') ||
// //              statut.includes('assignee') ||
// //              statut.includes('prise en charge') ||
// //              etat.includes('en_cours') ||
// //              etat.includes('traitement');
// //     }).length;

// //     const incidentsResolus = safeFilter(incidentsArray, i => {
// //       const statut = (i.statut || '').toString().toLowerCase();
// //       const etat = (i.etat || '').toString().toLowerCase();
      
// //       // Incidents RÉSOLUS
// //       return statut.includes('résolu') || 
// //              statut.includes('fermé') ||
// //              statut.includes('traité') ||
// //              statut.includes('terminé') ||
// //              statut.includes('clôturé') ||
// //              statut.includes('resolu') ||
// //              statut.includes('ferme') ||
// //              etat.includes('résolu') ||
// //              etat.includes('fermé');
// //     }).length;

// //     // Incidents qui demandent réparation
// //     const incidentsReparation = safeFilter(incidentsArray, i => {
// //       const type = (i.type || '').toString().toLowerCase();
// //       const description = (i.description || '').toString().toLowerCase();
// //       const statut = (i.statut || '').toString().toLowerCase();
      
// //       // Vérifier si l'incident demande une réparation et n'est pas résolu
// //       const demandeReparation = description.includes('réparation') || 
// //                                 description.includes('reparation') ||
// //                                 type.includes('réparation') ||
// //                                 type.includes('reparation') ||
// //                                 description.includes('panne matériel') ||
// //                                 description.includes('matériel défectueux');
      
// //       const estActif = !statut.includes('résolu') && 
// //                        !statut.includes('fermé') && 
// //                        !statut.includes('traité');
      
// //       return demandeReparation && estActif;
// //     }).length;

// //     const incidentsParPriorite = safeReduce(incidentsArray, (acc, i) => {
// //       const priorite = (i.priorite || 'moyenne').toLowerCase();
// //       acc[priorite] = (acc[priorite] || 0) + 1;
// //       return acc;
// //     }, {});

// //     console.log('📊 Incidents détectés:', {
// //       total: incidentsArray.length,
// //       ouverts: incidentsOuverts,
// //       en_cours: incidentsEnCours,
// //       résolus: incidentsResolus,
// //       demande_reparation: incidentsReparation
// //     });

// //     // Évolution des incidents (30 derniers jours)
// //     const incidentsParJour = {};
// //     const now = new Date();
// //     const last30Days = Array.from({ length: 30 }, (_, i) => {
// //       const date = new Date(now);
// //       date.setDate(date.getDate() - (29 - i));
// //       return date.toISOString().split('T')[0];
// //     });

// //     incidentsArray.forEach(incident => {
// //       const dateStr = incident.date_creation || incident.date || incident.created_at || incident.date_incident;
// //       if (dateStr) {
// //         try {
// //           const date = new Date(dateStr).toISOString().split('T')[0];
// //           if (last30Days.includes(date)) {
// //             incidentsParJour[date] = (incidentsParJour[date] || 0) + 1;
// //           }
// //         } catch (e) {
// //           console.warn('Date incident invalide:', dateStr);
// //         }
// //       }
// //     });

// //     const incidentsEvolution = last30Days.map(date => ({
// //       date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
// //       incidents: incidentsParJour[date] || 0
// //     }));

// //     // === ALERTES ===
// //     const alertesActives = safeFilter(alertesArray, a => {
// //       const statut = (a.statut || '').toString().toLowerCase();
// //       const etat = (a.etat || '').toString().toLowerCase();
      
// //       return statut.includes('nouvelle') || 
// //              statut.includes('en_traitement') || 
// //              statut.includes('active') ||
// //              statut.includes('ouvert') ||
// //              statut.includes('en_cours') ||
// //              etat.includes('active') ||
// //              etat.includes('nouvelle') ||
// //              !statut.includes('résolu') && !statut.includes('fermé');
// //     }).length;

// //     const alertesCritiques = safeFilter(alertesArray, a => {
// //       const severite = (a.severite || '').toString().toLowerCase();
// //       const statut = (a.statut || '').toString().toLowerCase();
// //       const etat = (a.etat || '').toString().toLowerCase();
      
// //       const isActive = statut.includes('nouvelle') || 
// //                        statut.includes('en_traitement') || 
// //                        statut.includes('active') ||
// //                        statut.includes('ouvert') ||
// //                        etat.includes('active') ||
// //                        !statut.includes('résolu');
      
// //       return isActive && (severite.includes('critique') || 
// //                           severite.includes('haute') || 
// //                           severite.includes('élevée') ||
// //                           a.priorite === 'critique' ||
// //                           a.priorite === 'haute');
// //     }).length;

// //     const alertesParSeverite = safeReduce(alertesArray, (acc, a) => {
// //       const severite = (a.severite || 'moyenne').toLowerCase();
// //       const statut = (a.statut || '').toString().toLowerCase();
      
// //       const isActive = statut.includes('nouvelle') || 
// //                        statut.includes('en_traitement') || 
// //                        statut.includes('active') ||
// //                        statut.includes('ouvert') ||
// //                        !statut.includes('résolu');
      
// //       if (isActive) {
// //         let severiteNormalisee = severite;
        
// //         if (severite.includes('critique') || severite.includes('élevée')) {
// //           severiteNormalisee = 'critique';
// //         } else if (severite.includes('haute')) {
// //           severiteNormalisee = 'haute';
// //         } else if (severite.includes('moyenne') || severite.includes('moyen')) {
// //           severiteNormalisee = 'moyenne';
// //         } else if (severite.includes('basse') || severite.includes('faible')) {
// //           severiteNormalisee = 'basse';
// //         }
        
// //         acc[severiteNormalisee] = (acc[severiteNormalisee] || 0) + 1;
// //       }
// //       return acc;
// //     }, {});

// //     // === RÉPARATIONS ===
// //     const coutTotalReparations = safeReduce(reparationsArray, (sum, r) => {
// //       const cout = parseFloat(r.cout) || parseFloat(r.cout_reparation) || parseFloat(r.prix) || 0;
// //       return sum + cout;
// //     }, 0);

// //     const reparationsCeMois = safeFilter(reparationsArray, r => {
// //       const date = r.date_reparation || r.date_debut || r.date || r.created_at || r.date_fin;
// //       if (!date) return false;
// //       try {
// //         const repDate = new Date(date);
// //         const now = new Date();
// //         return repDate.getMonth() === now.getMonth() && 
// //                repDate.getFullYear() === now.getFullYear();
// //       } catch {
// //         return false;
// //       }
// //     }).length;

// //     const coutReparationsCeMois = safeReduce(reparationsArray, (sum, r) => {
// //       const date = r.date_reparation || r.date_debut || r.date || r.created_at || r.date_fin;
// //       if (!date) return sum;
// //       try {
// //         const repDate = new Date(date);
// //         const now = new Date();
// //         if (repDate.getMonth() === now.getMonth() && repDate.getFullYear() === now.getFullYear()) {
// //           return sum + (parseFloat(r.cout) || parseFloat(r.cout_reparation) || parseFloat(r.prix) || 0);
// //         }
// //       } catch {}
// //       return sum;
// //     }, 0);

// //     // === RÉSEAU ===
// //     const reseauFonctionnel = safeFilter(reseauArray, r => {
// //       const etat = (r.etat || '').toString().toLowerCase();
// //       const statut = (r.statut || '').toString().toLowerCase();
// //       return etat.includes('fonctionnel') || 
// //              etat.includes('actif') ||
// //              statut.includes('actif') ||
// //              statut.includes('fonctionnel') ||
// //              !etat.includes('panne') && !etat.includes('deconnecté') && !etat.includes('hors service');
// //     }).length;

// //     const reseauPanne = safeFilter(reseauArray, r => {
// //       const etat = (r.etat || '').toString().toLowerCase();
// //       const statut = (r.statut || '').toString().toLowerCase();
// //       return etat.includes('panne') || 
// //              etat.includes('défectueux') ||
// //              etat.includes('hors service') ||
// //              etat.includes('deconnecte') ||
// //              statut.includes('panne') ||
// //              statut.includes('hors service');
// //     }).length;
    
// //         // >
// //         //       <option value="connecte">✅ Connecté au réseau</option>
// //         //       <option value="deconnecte">❌ Déconnecté du réseau</option>
// //         //       <option value="instable">⚠️ Connexion instable</option>
// //         //       <option value="maintenance">🔧 En maintenance</option>
// //         //     </select>
// //         //   </div>


// //     const reseauParStatut = safeReduce(reseauArray, (acc, r) => {
// //       const etat = (r.etat || '').toString().toLowerCase();
// //       const statut = (r.statut || '').toString().toLowerCase();
      
// //       let statutNormalise = 'Fonctionnel';
      
// //       if (etat.includes('panne') || etat.includes('deconnecte') || etat.includes('hors ligne') ||
// //           statut.includes('panne') || statut.includes('deconnecte')) {
// //         statutNormalise = 'Déconnexion du réseau';
// //       } else if (etat.includes('instable') || etat.includes('intermittent') ||
// //                  statut.includes('instable') || statut.includes('intermittent')) {
// //         statutNormalise = 'Connexion instable';
// //       } else if (etat.includes('maintenance') || etat.includes('réparation') ||
// //                  statut.includes('maintenance') || statut.includes('réparation')) {
// //         statutNormalise = 'Maintenance';
// //       }
      
// //       acc[statutNormalise] = (acc[statutNormalise] || 0) + 1;
// //       return acc;
// //     }, {});

// //     // === CALCUL DES TAUX ===
// //     const tauxDisponibilite = materielsArray.length > 0 ? 
// //       (materielsFonctionnels / materielsArray.length * 100).toFixed(1) : 0;

// //     const tauxResolutionIncidents = (incidentsOuverts + incidentsEnCours + incidentsResolus) > 0 ? 
// //       (incidentsResolus / (incidentsOuverts + incidentsEnCours + incidentsResolus) * 100).toFixed(1) : 100;

// //     const calculatedStats = {
// //       total_materiels: materielsArray.length,
// //       materiels_fonctionnels: materielsFonctionnels,
// //       materiels_en_panne: materielsEnPanne,
// //       materiels_maintenance: materielsMaintenance,
// //       materiels_par_service: materielsParService,
      
// //       total_logiciels: logicielsArray.length,
// //       logiciels_actifs: logicielsInstalles,
// //       logiciels_installes: logicielsInstalles,
// //       logiciels_expires: logicielsExpires,
// //       logiciels_par_type: logicielsParType,
      
// //       total_incidents: incidentsArray.length,
// //       incidents_ouverts: incidentsOuverts,
// //       incidents_en_cours: incidentsEnCours,
// //       incidents_resolus: incidentsResolus,
// //       incidents_par_priorite: incidentsParPriorite,
// //       incidents_evolution: incidentsEvolution,
// //       taux_resolution_incidents: parseFloat(tauxResolutionIncidents),
      
// //       reparations_ce_mois: reparationsCeMois,
// //       cout_total_reparations: coutTotalReparations,
// //       cout_reparations_ce_mois: coutReparationsCeMois,
      
// //       alertes_actives: alertesActives,
// //       alertes_critiques: alertesCritiques,
// //       alertes_par_severite: alertesParSeverite,
      
// //       total_equipements_reseau: reseauArray.length,
// //       reseau_fonctionnel: reseauFonctionnel,
// //       reseau_panne: reseauPanne,
// //       reseau_par_statut: reseauParStatut,
      
// //       taux_disponibilite: parseFloat(tauxDisponibilite),
// //     };

// //     console.log('📊 Statistiques finales calculées:', {
// //       materiels: calculatedStats.total_materiels,
// //       logiciels: {
// //         total: calculatedStats.total_logiciels,
// //         installes: calculatedStats.logiciels_installes,
// //         types: calculatedStats.logiciels_par_type
// //       },
// //       incidents: {
// //         total: calculatedStats.total_incidents,
// //         ouverts: calculatedStats.incidents_ouverts,
// //         en_cours: calculatedStats.incidents_en_cours,
// //         résolus: calculatedStats.incidents_resolus
// //       },
// //       alertes: {
// //         total: alertesArray.length,
// //         actives: calculatedStats.alertes_actives,
// //         critiques: calculatedStats.alertes_critiques
// //       }
// //     });
    
// //     setStats(calculatedStats);
// //   }, []);

// //   // Auto-refresh
// //   useEffect(() => {
// //     loadData();
    
// //     if (autoRefresh) {
// //       const interval = setInterval(() => {
// //         loadData();
// //       }, 30000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [loadData, autoRefresh]);

// //   // Préparer les données pour les graphiques
// //   const chartData = useMemo(() => {
// //     // Matériels par Service
// //     const servicesData = [
// //       { service: 'Secrétariat', count: stats.materiels_par_service['Secrétariat'] || 0, fill: '#3b82f6' },
// //       { service: 'Direction', count: stats.materiels_par_service['Direction'] || 0, fill: '#8b5cf6' },
// //       { service: 'Informatique', count: stats.materiels_par_service['Informatique'] || 0, fill: '#10b981' },
// //       { service: 'Archives', count: stats.materiels_par_service['Archives'] || 0, fill: '#f59e0b' },
// //       { service: 'Autre', count: stats.materiels_par_service['Autre'] || 0, fill: '#6b7280' },
// //     ].filter(item => item.count > 0);

// //     // État des Matériels
// //     const materielsEtat = [
// //       { name: 'Fonctionnel', value: stats.materiels_fonctionnels, color: '#10b981' },
// //       { name: 'En panne', value: stats.materiels_en_panne, color: '#ef4444' },
// //       { name: 'Maintenance', value: stats.materiels_maintenance, color: '#f59e0b' },
// //     ].filter(item => item.value > 0);

// //     // Incidents par Priorité
// //     const incidentsPriorite = Object.entries(stats.incidents_par_priorite || {}).map(([priorite, count]) => ({
// //       priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
// //       count,
// //       fill: priorite === 'critique' ? '#ef4444' : 
// //             priorite === 'haute' ? '#f97316' : 
// //             priorite === 'moyenne' ? '#eab308' : '#22c55e'
// //     }));

// //     // Évolution des Incidents
// //     const incidentsEvolution = stats.incidents_evolution || [];

// //     // Alertes par Sévérité
// //     const alertesSeverite = Object.entries(stats.alertes_par_severite || {}).map(([severite, count]) => ({
// //       severite: severite.charAt(0).toUpperCase() + severite.slice(1),
// //       count,
// //       fill: severite === 'critique' ? '#ef4444' : 
// //             severite === 'haute' ? '#f97316' : 
// //             severite === 'moyenne' ? '#eab308' : '#22c55e'
// //     }));

// //     // LOGICIELS PAR TYPE - Données formatées
// //     const logicielsTypeData = [
// //       { type: 'Bureautique', count: stats.logiciels_par_type['Bureautique'] || 0, fill: '#3b82f6' },
// //       { type: 'Système d\'exploitation', count: stats.logiciels_par_type['Système d\'exploitation'] || 0, fill: '#8b5cf6' },
// //       { type: 'Métier', count: stats.logiciels_par_type['Métier'] || 0, fill: '#10b981' },
// //       { type: 'Sécurité', count: stats.logiciels_par_type['Sécurité'] || 0, fill: '#ef4444' },
// //       { type: 'Graphisme/Design', count: stats.logiciels_par_type['Graphisme/Design'] || 0, fill: '#ec4899' },
// //       { type: 'Base de données', count: stats.logiciels_par_type['Base de données'] || 0, fill: '#06b6d4' },
// //       { type: 'Navigateur', count: stats.logiciels_par_type['Navigateur'] || 0, fill: '#f59e0b' },
// //       { type: 'Utilitaire', count: stats.logiciels_par_type['Utilitaire'] || 0, fill: '#8b5cf6' },
// //       { type: 'Autre', count: stats.logiciels_par_type['Autre'] || 0, fill: '#6b7280' },
// //     ].filter(item => item.count > 0);

// //     // Réseau par Statut
// //     const reseauStatutData = Object.entries(stats.reseau_par_statut || {}).map(([statut, count]) => ({
// //       statut,
// //       count,
// //       fill: statut === 'Fonctionnel' ? '#10b981' :
// //             statut === 'Connexion instable' ? '#eab308' :
// //             statut === 'Maintenance' ? '#f59e0b' : '#ef4444'
// //     }));

// //     // Données de Synthèse
// //     const syntheseData = [
// //       {
// //         label: 'Matériels fonctionnels',
// //         value: stats.materiels_fonctionnels,
// //         total: stats.total_materiels,
// //         icon: CheckCircle,
// //         color: 'success',
// //         description: `Taux: ${stats.taux_disponibilite}%`
// //       },
// //       {
// //         label: 'Incidents ouverts',
// //         value: stats.incidents_ouverts,
// //         icon: AlertTriangle,
// //         color: 'error',
// //         description: `${stats.incidents_en_cours} en_cours • ${stats.incidents_resolus} résolus`
// //       },
// //       {
// //         label: 'Alertes critiques',
// //         value: stats.alertes_critiques,
// //         total: stats.alertes_actives,
// //         icon: AlertCircle,
// //         color: 'error',
// //         description: `${stats.alertes_actives} alertes actives`
// //       },
// //       {
// //         label: 'Réparations ce mois',
// //         value: stats.reparations_ce_mois,
// //         icon: Wrench,
// //         color: 'info',
// //         description: `Coût: ${formatCurrency(stats.cout_reparations_ce_mois)}`
// //       },
// //       {
// //         label: 'Logiciels installés',
// //         value: stats.logiciels_installes,
// //         total: stats.total_logiciels,
// //         icon: Package,
// //         color: 'success',
// //         description: `${stats.logiciels_installes} / ${stats.total_logiciels}`
// //       },
// //       {
// //         label: 'Équipements réseau',
// //         value: stats.reseau_fonctionnel,
// //         total: stats.total_equipements_reseau,
// //         icon: Network,
// //         color: 'success',
// //         description: `${stats.reseau_panne} en panne`
// //       },
// //     ];

// //     return {
// //       servicesData,
// //       materielsEtat,
// //       incidentsPriorite,
// //       incidentsEvolution,
// //       alertesSeverite,
// //       logicielsTypeData,
// //       reseauStatutData,
// //       syntheseData
// //     };
// //   }, [stats, formatCurrency]);

// //   // Générer rapport PDF
// //   const generateDetailedPDF = useCallback(async () => {
// //     const doc = new jsPDF('landscape');
    
// //     try {
// //       const imgData = await getBase64Image(logoDren);
// //       doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
// //     } catch (error) {
// //       console.warn('Logo non chargé');
// //     }
    
// //     doc.setFontSize(20);
// //     doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
// //     doc.setFontSize(16);
// //     doc.text('TABLEAU DE BORD COMPLET', 20, 45);
    
// //     doc.setFontSize(12);
// //     doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
// //     doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 67);
    
// //     doc.setDrawColor(200, 200, 200);
// //     doc.line(20, 75, 190, 75);
    
// //     doc.setFontSize(14);
// //     doc.text('SYNTHÈSE DES DONNÉES', 20, 90);
    
// //     const syntheseStats = [
// //       ['Indicateur', 'Valeur', 'Détail'],
// //       ['Matériels fonctionnels', stats.materiels_fonctionnels.toString(), `${stats.total_materiels} total`],
// //       ['Incidents ouverts', stats.incidents_ouverts.toString(), `${stats.incidents_en_cours} en cours, ${stats.incidents_resolus} résolus`],
// //       ['Alertes critiques', stats.alertes_critiques.toString(), `${stats.alertes_actives} actives`],
// //       ['Réparations ce mois', stats.reparations_ce_mois.toString(), formatCurrency(stats.cout_reparations_ce_mois)],
// //       ['Logiciels installés', stats.logiciels_installes.toString(), `${stats.total_logiciels} total (${stats.logiciels_expires} expirés)`],
// //       ['Équipements réseau', stats.reseau_fonctionnel.toString(), `${stats.total_equipements_reseau} total`],
// //       ['Taux disponibilité', `${stats.taux_disponibilite}%`, 'Matériels'],
// //       ['Taux résolution incidents', `${stats.taux_resolution_incidents}%`, 'Incidents'],
// //       ['Coût total réparations', formatCurrency(stats.cout_total_reparations), 'Depuis le début'],
// //     ];
    
// //     autoTable(doc, {
// //       startY: 95,
// //       head: syntheseStats.slice(0, 1),
// //       body: syntheseStats.slice(1),
// //       theme: 'grid',
// //       headStyles: { fillColor: [59, 130, 246] },
// //     });
    
// //     doc.save(`dashboard-complet-${new Date().toISOString().split('T')[0]}.pdf`);
// //     showNotification('Rapport PDF généré avec succès', 'success');
// //   }, [user, stats, formatCurrency, showNotification]);

// //   // Composant StatCard
// //   const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
// //     const colorClasses = {
// //       blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
// //       purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
// //       yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
// //       red: { bg: 'bg-red-100', text: 'text-red-600' },
// //       indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
// //       green: { bg: 'bg-green-100', text: 'text-green-600' },
// //       primary: { bg: 'bg-primary/10', text: 'text-primary' },
// //       success: { bg: 'bg-success/10', text: 'text-success' },
// //       error: { bg: 'bg-error/10', text: 'text-error' },
// //       warning: { bg: 'bg-warning/10', text: 'text-warning' },
// //       info: { bg: 'bg-info/10', text: 'text-info' },
// //     };

// //     const colorConfig = colorClasses[color] || colorClasses.primary;

// //     return (
// //       <div className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 relative">
// //         {trend !== undefined && (
// //           <div className={`absolute -top-2 -right-2 badge badge-sm ${trend > 0 ? 'badge-success' : 'badge-error'}`}>
// //             {trend > 0 ? '+' : ''}{trend}%
// //           </div>
// //         )}
// //         <div className="card-body p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-sm font-semibold text-base-content opacity-70">{title}</h3>
// //               <p className="text-2xl font-bold mt-1 text-base-content">{value}</p>
// //               {subtitle && <p className="text-xs text-base-content opacity-60 mt-1">{subtitle}</p>}
// //             </div>
// //             <div className={`p-3 rounded-lg ${colorConfig.bg}`}>
// //               <Icon className={`h-6 w-6 ${colorConfig.text}`} />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Composant SyntheseItem
// //   const SyntheseItem = ({ label, value, total, icon: Icon, color = 'primary', description }) => {
// //     const colorClasses = {
// //       success: { bg: 'bg-success/10', text: 'text-success', icon: 'text-success' },
// //       error: { bg: 'bg-error/10', text: 'text-error', icon: 'text-error' },
// //       info: { bg: 'bg-info/10', text: 'text-info', icon: 'text-info' },
// //       primary: { bg: 'bg-primary/10', text: 'text-primary', icon: 'text-primary' },
// //     };

// //     const colorConfig = colorClasses[color] || colorClasses.primary;
// //     const percentage = total ? Math.round((value / total) * 100) : 100;

// //     return (
// //       <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
// //         <div className="flex items-center gap-3">
// //           <div className={`p-2 rounded-lg ${colorConfig.bg}`}>
// //             <Icon className={`h-5 w-5 ${colorConfig.icon}`} />
// //           </div>
// //           <div className="flex-1">
// //             <span className="font-medium text-base-content">{label}</span>
// //             {description && (
// //               <p className="text-xs text-base-content opacity-60 mt-1">{description}</p>
// //             )}
// //             {total && (
// //               <div className="mt-2 w-full bg-base-300 rounded-full h-2">
// //                 <div 
// //                   className={`h-2 rounded-full ${colorConfig.text.replace('text-', 'bg-')}`}
// //                   style={{ width: `${percentage}%` }}
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //         <div className="text-right">
// //           <span className={`text-2xl font-bold ${colorConfig.text}`}>{value}</span>
// //           {total && (
// //             <p className="text-xs text-base-content opacity-60">sur {total}</p>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-screen">
// //         <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
// //         <h2 className="text-xl font-semibold text-base-content">Chargement du tableau de bord...</h2>
// //         <p className="text-base-content opacity-70 mt-2">Connexion aux sources de données</p>
// //         <div className="mt-4 w-64 bg-base-300 rounded-full h-2">
// //           <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 md:p-6 bg-base-100 min-h-screen">
// //       {/* En-tête */}
// //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
// //         <div>
// //           <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
// //             <BarChart3 className="h-8 w-8 text-primary" />
// //             Tableau de Bord IT
// //             <span className="badge badge-primary badge-lg">DREN Antsimo Andrefana</span>
// //           </h1>
// //           <p className="text-base-content opacity-70 mt-1">
// //             Surveillance complète du parc informatique - Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
// //           </p>
// //         </div>
        
// //         <div className="flex flex-wrap gap-2">
// //           <div className="form-control">
// //             <label className="label cursor-pointer gap-2">
// //               <span className="label-text text-sm text-base-content">Auto-refresh (30s)</span>
// //               <input 
// //                 type="checkbox" 
// //                 className="toggle toggle-primary toggle-sm"
// //                 checked={autoRefresh}
// //                 onChange={(e) => setAutoRefresh(e.target.checked)}
// //               />
// //             </label>
// //           </div>
          
// //           <div className="dropdown dropdown-end">
// //             <button className="btn btn-primary btn-sm">
// //               <Download className="h-4 w-4 mr-2" />
// //               Exporter
// //             </button>
// //             <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// //               <li><button onClick={generateDetailedPDF}>Rapport PDF</button></li>
// //               <li><button onClick={() => showNotification('Fonctionnalité à venir', 'info')}>Excel</button></li>
// //             </ul>
// //           </div>
          
// //           <button 
// //             onClick={loadData}
// //             className="btn btn-outline btn-sm text-base-content"
// //             disabled={loading}
// //           >
// //             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
// //             {loading ? 'Actualisation...' : 'Actualiser'}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Statistiques principales */}
// //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
// //         <StatCard
// //           title="Matériels"
// //           value={stats.total_materiels}
// //           icon={Database}
// //           color="blue"
// //           subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
// //         />
        
// //         <StatCard
// //           title="Logiciels"
// //           value={stats.total_logiciels}
// //           icon={Package}
// //           color="purple"
// //           subtitle={`${stats.logiciels_installes} installés`}
// //         />
        
// //         <StatCard
// //           title="Alertes"
// //           value={stats.alertes_actives}
// //           icon={Bell}
// //           color="yellow"
// //           subtitle={`${stats.alertes_critiques} critiques`}
// //         />
        
// //         <StatCard
// //           title="Incidents"
// //           value={stats.total_incidents}
// //           icon={AlertTriangle}
// //           color="red"
// //           subtitle={`${stats.incidents_ouverts} ouverts, ${stats.incidents_en_cours} en_cours`}
// //         />
        
// //         <StatCard
// //           title="Équipements Réseau"
// //           value={stats.total_equipements_reseau}
// //           icon={Network}
// //           color="indigo"
// //           subtitle={`${stats.reseau_fonctionnel} fonctionnels`}
// //         />
        
// //         <StatCard
// //           title="Coût Réparations"
// //           value={formatCurrency(stats.cout_total_reparations)}
// //           icon={DollarSign}
// //           color="green"
// //           subtitle={`${stats.reparations_ce_mois} ce mois`}
// //         />
// //       </div>

// //       {/* Section 1: Matériels */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         {/* Matériels par Service */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <Users className="h-5 w-5 mr-2" />
// //               Matériels par Service
// //               <span className="badge badge-primary ml-2">
// //                 {Object.keys(stats.materiels_par_service).length} services
// //               </span>
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={chartData.servicesData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="service" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// //                 />
// //                 <YAxis 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF' }}
// //                 />
// //                 <Tooltip 
// //                   contentStyle={{ 
// //                     backgroundColor: '#1F2937', 
// //                     borderColor: '#374151', 
// //                     color: '#F9FAFB',
// //                     borderRadius: '8px'
// //                   }}
// //                   formatter={(value) => [`${value} matériels`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Bar 
// //                   dataKey="count" 
// //                   name="Matériels"
// //                   radius={[4, 4, 0, 0]}
// //                 >
// //                   {chartData.servicesData.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// //                   ))}
// //                 </Bar>
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>

// //         {/* État des Matériels */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <PieChartIcon className="h-5 w-5 mr-2" />
// //               État des Matériels
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <PieChart>
// //                 <Pie
// //                   data={chartData.materielsEtat}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, value }) => `${name}: ${value}`}
// //                   outerRadius={80}
// //                   dataKey="value"
// //                 >
// //                   {chartData.materielsEtat.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //                 <Legend />
// //               </PieChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               Taux de disponibilité: <strong>{stats.taux_disponibilite}%</strong> • Total: {stats.total_materiels} matériels
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section 2: Incidents */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         {/* Incidents par Priorité */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <AlertTriangle className="h-5 w-5 mr-2" />
// //               Incidents par Priorité
// //               <span className="badge badge-error ml-2">{stats.incidents_ouverts} ouverts</span>
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={chartData.incidentsPriorite}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="priorite" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// //                 />
// //                 <YAxis stroke="#9CA3AF" />
// //                 <Tooltip 
// //                   contentStyle={{ 
// //                     backgroundColor: '#1F2937', 
// //                     borderColor: '#374151', 
// //                     color: '#F9FAFB'
// //                   }}
// //                   formatter={(value) => [`${value} incidents`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Bar 
// //                   dataKey="count" 
// //                   name="Incidents"
// //                   radius={[4, 4, 0, 0]}
// //                 >
// //                   {chartData.incidentsPriorite.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// //                   ))}
// //                 </Bar>
// //               </BarChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               <strong>Total: {stats.total_incidents} incidents</strong><br />
// //               • {stats.incidents_ouverts} ouverts • {stats.incidents_en_cours} en cours • {stats.incidents_resolus} résolus<br />
// //               • Taux de résolution: <strong>{stats.taux_resolution_incidents}%</strong>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Évolution des Incidents */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <LineChartIcon className="h-5 w-5 mr-2" />
// //               Évolution des Incidents (30 jours)
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <AreaChart data={chartData.incidentsEvolution}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="date" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 11 }}
// //                 />
// //                 <YAxis stroke="#9CA3AF" />
// //                 <Tooltip 
// //                   contentStyle={{ 
// //                     backgroundColor: '#1F2937', 
// //                     borderColor: '#374151', 
// //                     color: '#F9FAFB'
// //                   }}
// //                   formatter={(value) => [`${value} incidents`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Area 
// //                   type="monotone" 
// //                   dataKey="incidents" 
// //                   stroke="#ef4444" 
// //                   fill="#ef4444"
// //                   fillOpacity={0.3}
// //                   name="Incidents"
// //                 />
// //               </AreaChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               Moyenne: {chartData.incidentsEvolution.length > 0 ? 
// //                 Math.round(chartData.incidentsEvolution.reduce((sum, day) => sum + day.incidents, 0) / chartData.incidentsEvolution.length) : 0} incidents/jour
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section 3: Logiciels & Réseau */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         {/* Logiciels par Type */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <Package className="h-5 w-5 mr-2" />
// //               Logiciels par Type
// //               <span className="badge badge-success ml-2">{stats.logiciels_installes} installés</span>
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={chartData.logicielsTypeData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="type" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 11 }}
// //                   angle={-45}
// //                   textAnchor="end"
// //                   height={70}
// //                 />
// //                 <YAxis stroke="#9CA3AF" />
// //                 <Tooltip 
// //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// //                   formatter={(value) => [`${value} logiciels`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Bar 
// //                   dataKey="count" 
// //                   name="Logiciels"
// //                   radius={[4, 4, 0, 0]}
// //                 >
// //                   {chartData.logicielsTypeData.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// //                   ))}
// //                 </Bar>
// //               </BarChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               <strong>Total: {stats.total_logiciels} logiciels</strong><br />
// //               • {stats.logiciels_installes} installés ({Math.round((stats.logiciels_installes / stats.total_logiciels) * 100)}%)<br />
// //               • {stats.logiciels_expires} licences expirées
// //             </div>
// //           </div>
// //         </div>

// //         {/* Équipements Réseau par Statut */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <Network className="h-5 w-5 mr-2" />
// //               Équipements Réseau par Statut
// //               <span className="badge badge-info ml-2">{stats.total_equipements_reseau} équipements</span>
// //             </h3>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={chartData.reseauStatutData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                 <XAxis 
// //                   dataKey="statut" 
// //                   stroke="#9CA3AF"
// //                   tick={{ fill: '#9CA3AF', fontSize: 12 }}
// //                 />
// //                 <YAxis stroke="#9CA3AF" />
// //                 <Tooltip 
// //                   contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// //                   formatter={(value) => [`${value} équipements`, 'Quantité']}
// //                 />
// //                 <Legend />
// //                 <Bar 
// //                   dataKey="count" 
// //                   name="Équipements"
// //                   radius={[4, 4, 0, 0]}
// //                 >
// //                   {chartData.reseauStatutData.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.fill} />
// //                   ))}
// //                 </Bar>
// //               </BarChart>
// //             </ResponsiveContainer>
// //             <div className="text-sm text-base-content opacity-70 mt-2">
// //               {stats.reseau_fonctionnel} fonctionnels • {stats.reseau_panne} en panne ({Math.round((stats.reseau_fonctionnel / stats.total_equipements_reseau) * 100)}% fonctionnels)
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Section 4: Synthèse */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         {/* Synthèse des Données */}
// //         <div className="card bg-base-100 shadow-lg border border-base-300">
// //           <div className="card-body">
// //             <h3 className="card-title text-base-content">
// //               <Database className="h-5 w-5 mr-2" />
// //               Synthèse des Données
// //               <span className="badge badge-info ml-2">Indicateurs clés</span>
// //             </h3>
            
// //             <div className="space-y-3">
// //               {chartData.syntheseData.map((item, index) => (
// //                 <SyntheseItem
// //                   key={index}
// //                   label={item.label}
// //                   value={item.value}
// //                   total={item.total}
// //                   icon={item.icon}
// //                   color={item.color}
// //                   description={item.description}
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Informations système */}
// //         <div className="space-y-6">
// //           {/* Alertes par Sévérité */}
// //           <div className="card bg-base-100 shadow-lg border border-base-300">
// //             <div className="card-body">
// //               <h3 className="card-title text-base-content">
// //                 <Bell className="h-5 w-5 mr-2" />
// //                 Alertes par Sévérité
// //                 <span className="badge badge-warning ml-2">{stats.alertes_actives} actives</span>
// //               </h3>
// //               <ResponsiveContainer width="100%" height={250}>
// //                 <BarChart data={chartData.alertesSeverite}>
// //                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                   <XAxis 
// //                     dataKey="severite" 
// //                     stroke="#9CA3AF"
// //                     tick={{ fill: '#9CA3AF', fontSize: 12 }}
// //                   />
// //                   <YAxis stroke="#9CA3AF" />
// //                   <Tooltip 
// //                     contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
// //                     formatter={(value) => [`${value} alertes`, 'Quantité']}
// //                   />
// //                   <Legend />
// //                   <Bar 
// //                     dataKey="count" 
// //                     name="Alertes"
// //                     radius={[4, 4, 0, 0]}
// //                   >
// //                     {chartData.alertesSeverite.map((entry, index) => (
// //                       <Cell key={`cell-${index}`} fill={entry.fill} />
// //                     ))}
// //                   </Bar>
// //                 </BarChart>
// //               </ResponsiveContainer>
// //               <div className="text-sm text-base-content opacity-70 mt-2">
// //                 {stats.alertes_critiques} critiques • {stats.alertes_actives - stats.alertes_critiques} autres
// //               </div>
// //             </div>
// //           </div>

// //           {/* Informations système */}
// //           <div className="card bg-base-200 border border-base-300">
// //             <div className="card-body">
// //               <h3 className="card-title text-base-content">
// //                 <Info className="h-5 w-5 mr-2" />
// //                 Informations système
// //               </h3>
// //               <div className="space-y-3 text-sm">
// //                 <div className="flex justify-between">
// //                   <span className="font-medium text-base-content">Données chargées:</span>
// //                   <span className="text-base-content">
// //                     {materiels.length} matériels, {logiciels.length} logiciels
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="font-medium text-base-content">Utilisateur:</span>
// //                   <span className="text-base-content">{user?.nom_complet || user?.username || 'Non connecté'}</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="font-medium text-base-content">Auto-refresh:</span>
// //                   <span className="text-base-content">{autoRefresh ? 'Activé (30s)' : 'Désactivé'}</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="font-medium text-base-content">Dernière actualisation:</span>
// //                   <span className="text-base-content">{lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '--'}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recommandations & Alertes */}
// //       <div className="card bg-base-200 border border-base-300 mb-6">
// //         <div className="card-body">
// //           <h3 className="card-title text-base-content">
// //             <AlertCircle className="h-5 w-5 mr-2" />
// //             Recommandations & Alertes
// //           </h3>
// //           <div className="space-y-2 text-sm">
// //             {stats.materiels_en_panne > 0 && (
// //               <div className="alert alert-error">
// //                 <AlertTriangle className="h-4 w-4" />
// //                 <span className="text-base-content">🚨 {stats.materiels_en_panne} matériel(s) en panne nécessite(nt) intervention</span>
// //               </div>
// //             )}
// //             {stats.alertes_critiques > 0 && (
// //               <div className="alert alert-warning">
// //                 <Shield className="h-4 w-4" />
// //                 <span className="text-base-content">⚠️ {stats.alertes_critiques} alerte(s) critique(s) en attente</span>
// //               </div>
// //             )}
// //             {stats.incidents_ouverts > 0 && (
// //               <div className="alert alert-warning">
// //                 <AlertTriangle className="h-4 w-4" />
// //                 <span className="text-base-content">📋 {stats.incidents_ouverts} incident(s) ouvert(s) à traiter</span>
// //               </div>
// //             )}
// //             {stats.incidents_en_cours > 0 && (
// //               <div className="alert alert-info">
// //                 <Wrench className="h-4 w-4" />
// //                 <span className="text-base-content">🔧 {stats.incidents_en_cours} incident(s) en cours de traitement</span>
// //               </div>
// //             )}
// //             {stats.reseau_panne > 0 && (
// //               <div className="alert alert-warning">
// //                 <Network className="h-4 w-4" />
// //                 <span className="text-base-content">🌐 {stats.reseau_panne} équipement(s) réseau en panne</span>
// //               </div>
// //             )}
// //             {stats.logiciels_expires > 0 && (
// //               <div className="alert alert-warning">
// //                 <Package className="h-4 w-4" />
// //                 <span className="text-base-content">📅 {stats.logiciels_expires} licence(s) logiciel(s) expirée(s)</span>
// //               </div>
// //             )}
// //             {stats.materiels_en_panne === 0 && stats.alertes_critiques === 0 && stats.incidents_ouverts === 0 && (
// //               <div className="alert alert-success">
// //                 <CheckCircle className="h-4 w-4" />
// //                 <span className="text-base-content">✅ Tous les systèmes sont opérationnels</span>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;



// src/pages/Dashboard.jsx - VERSION SIMPLIFIÉE SANS LOGICIELS NI RÉSEAU
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { 
  BarChart3, RefreshCw, Users, 
  AlertTriangle, CheckCircle,
  Database, Bell, Package, 
  Network, Wrench,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon, Info, 
  Shield, DollarSign,
  AlertCircle,
  Check,
  Download,
  Monitor, Server, Cpu, TrendingUp
} from 'lucide-react';
import { 
  materielsAPI, 
  incidentsAPI, 
  reparationsAPI, 
  alertesAPI, 
  fournisseursAPI
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import du logo
import logoDren from '../assets/images/logo-dren.jpeg';

// COULEURS FIXES POUR CHAQUE SERVICE
const SERVICE_COLORS = {
  'Secrétariat': '#3b82f6',
  'Direction': '#8b5cf6',
  'Informatique': '#10b981',
  'Archives': '#f59e0b',
  'Non assigné': '#9ca3af',
  'Autre': '#6b7280',
};

// Fonction pour convertir une image en base64
const getBase64Image = (imgUrl) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    resolve(canvas.toDataURL('image/jpeg'));
  };
  img.onerror = reject;
  img.src = imgUrl;
});

const Dashboard = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  // États principaux
  const [stats, setStats] = useState({
    total_materiels: 0,
    materiels_fonctionnels: 0,
    materiels_en_panne: 0,
    materiels_maintenance: 0,
    materiels_par_service: {},
    materiels_par_type: {},
    
    total_incidents: 0,
    incidents_ouverts: 0,
    incidents_en_cours: 0,
    incidents_resolus: 0,
    incidents_par_priorite: {},
    incidents_evolution: [],
    taux_resolution_incidents: 0,
    
    reparations_ce_mois: 0,
    cout_total_reparations: 0,
    cout_reparations_ce_mois: 0,
    
    alertes_actives: 0,
    alertes_critiques: 0,
    alertes_panne: 0,
    alertes_maintenance: 0,
    alertes_par_type: {},
    alertes_par_severite: {},
    
    total_fournisseurs: 0,
    fournisseurs_actifs: 0,
    
    taux_disponibilite: 0,
  });
  
  // États pour les données brutes
  const [materiels, setMateriels] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [reparations, setReparations] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  
  // États UI
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fonctions helper
  const safeArray = (data) => Array.isArray(data) ? data : [];
  const safeFilter = (array, condition) => array?.filter?.(condition) || [];
  const safeReduce = (array, reducer, initial = 0) => array?.reduce?.(reducer, initial) || initial;

  // Fonction pour extraire les données des réponses API
  const extractData = useCallback((response) => {
    if (!response) return [];
    
    if (Array.isArray(response)) return response;
    
    if (response?.data) {
      if (Array.isArray(response.data)) return response.data;
      if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
      if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
      if (typeof response.data === 'object' && !Array.isArray(response.data)) return [response.data];
    }
    
    return [];
  }, []);

  // Formater la devise en Ariary
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
  }, []);

  // Charger les données depuis les API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📊 Chargement des données dashboard...');

      const [
        materielsResponse,
        incidentsResponse,
        reparationsResponse,
        alertesResponse,
        fournisseursResponse
      ] = await Promise.allSettled([
        materielsAPI.getAll().catch(e => {
          console.error('❌ Erreur matériels:', e);
          return { data: [] };
        }),
        incidentsAPI.getAll().catch(e => {
          console.error('❌ Erreur incidents:', e);
          return { data: [] };
        }),
        reparationsAPI.getAll().catch(e => {
          console.error('❌ Erreur réparations:', e);
          return { data: [] };
        }),
        alertesAPI.getAll().catch(e => {
          console.error('❌ Erreur alertes:', e);
          return { data: [] };
        }),
        fournisseursAPI.getAll().catch(e => {
          console.error('❌ Erreur fournisseurs:', e);
          return { data: [] };
        })
      ]);

      // Extraire les données
      const materielsData = extractData(materielsResponse.value);
      const incidentsData = extractData(incidentsResponse.value);
      const reparationsData = extractData(reparationsResponse.value);
      const alertesData = extractData(alertesResponse.value);
      const fournisseursData = extractData(fournisseursResponse.value);

      console.log('📦 Données reçues des API:', {
        materiels: materielsData.length,
        incidents: incidentsData.length,
        reparations: reparationsData.length,
        alertes: alertesData.length,
        fournisseurs: fournisseursData.length
      });

      if (incidentsData.length > 0) {
        console.log('🔍 Premier incident:', {
          statut: incidentsData[0].statut,
          priorite: incidentsData[0].priorite,
          description: incidentsData[0].description
        });
      }

      // Mettre à jour les états
      setMateriels(materielsData);
      setIncidents(incidentsData);
      setReparations(reparationsData);
      setAlertes(alertesData);
      setFournisseurs(fournisseursData);

      // Calculer les statistiques
      calculateStats({
        materiels: materielsData,
        incidents: incidentsData,
        reparations: reparationsData,
        alertes: alertesData,
        fournisseurs: fournisseursData
      });
      
      setLastUpdate(new Date());
      showNotification('Tableau de bord actualisé', 'success');

    } catch (error) {
      console.error('❌ Erreur générale:', error);
      showNotification('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, [extractData, showNotification]);

  // Calculer les statistiques
  const calculateStats = useCallback((data) => {
    const {
      materiels: materielsArray,
      incidents: incidentsArray,
      reparations: reparationsArray,
      alertes: alertesArray,
      fournisseurs: fournisseursArray
    } = data;

    // === MATÉRIELS ===
    const materielsFonctionnels = safeFilter(materielsArray, m => {
      const etat = (m.etat || '').toString().toLowerCase();
      return etat.includes('fonctionnel') || 
             etat.includes('actif') || 
             etat.includes('opérationnel') ||
             etat.includes('en service') ||
             etat === 'bon' ||
             etat === 'good' ||
             m.statut === 'actif' ||
             m.statut === 'fonctionnel';
    }).length;

    const materielsEnPanne = safeFilter(materielsArray, m => {
      const etat = (m.etat || '').toString().toLowerCase();
      return etat.includes('panne') || 
             etat.includes('défectueux') || 
             etat.includes('hors service') ||
             m.statut === 'panne' ||
             m.statut === 'hors service';
    }).length;

    const materielsMaintenance = safeFilter(materielsArray, m => {
      const etat = (m.etat || '').toString().toLowerCase();
      return etat.includes('maintenance') || 
             etat.includes('réparation') || 
             etat.includes('en réparation') ||
             m.statut === 'maintenance' ||
             m.statut === 'réparation';
    }).length;

    const materielsParService = safeReduce(materielsArray, (acc, m) => {
      const service = m.service || m.departement || m.service_attribue || m.direction || 'Non assigné';
      
      let serviceNormalise = 'Autre';
      const serviceLower = service.toLowerCase();
      
      if (serviceLower.includes('secrétariat') || serviceLower.includes('secretariat')) {
        serviceNormalise = 'Secrétariat';
      } else if (serviceLower.includes('direction') || serviceLower.includes('dir')) {
        serviceNormalise = 'Direction';
      } else if (serviceLower.includes('informatique') || serviceLower.includes('it') || serviceLower.includes('info')) {
        serviceNormalise = 'Informatique';
      } else if (serviceLower.includes('archives') || serviceLower.includes('archive')) {
        serviceNormalise = 'Archives';
      } else {
        serviceNormalise = 'Autre';
      }
      
      acc[serviceNormalise] = (acc[serviceNormalise] || 0) + 1;
      return acc;
    }, {});

    // === INCIDENTS ===
    const incidentsOuverts = safeFilter(incidentsArray, i => {
      const statut = (i.statut || '').toString().toLowerCase();
      const etat = (i.etat || '').toString().toLowerCase();
      
      return statut.includes('ouvert') || 
             statut === 'ouvert' ||
             statut === 'open';
    }).length;

    const incidentsEnCours = safeFilter(incidentsArray, i => {
      const statut = (i.statut || '').toString().toLowerCase();
      const etat = (i.etat || '').toString().toLowerCase();
      
      return statut.includes('en_cours') || 
             statut.includes('traitement') ||
             statut.includes('assigné') ||
             statut.includes('assignee') ||
             statut.includes('prise en charge') ||
             etat.includes('en_cours') ||
             etat.includes('traitement');
    }).length;

    const incidentsResolus = safeFilter(incidentsArray, i => {
      const statut = (i.statut || '').toString().toLowerCase();
      const etat = (i.etat || '').toString().toLowerCase();
      
      return statut.includes('résolu') || 
             statut.includes('fermé') ||
             statut.includes('traité') ||
             statut.includes('terminé') ||
             statut.includes('clôturé') ||
             statut.includes('resolu') ||
             statut.includes('ferme') ||
             etat.includes('résolu') ||
             etat.includes('fermé');
    }).length;

    const incidentsParPriorite = safeReduce(incidentsArray, (acc, i) => {
      const priorite = (i.priorite || 'moyenne').toLowerCase();
      acc[priorite] = (acc[priorite] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Incidents détectés:', {
      total: incidentsArray.length,
      ouverts: incidentsOuverts,
      en_cours: incidentsEnCours,
      résolus: incidentsResolus
    });

    // Évolution des incidents (30 derniers jours)
    const incidentsParJour = {};
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    incidentsArray.forEach(incident => {
      const dateStr = incident.date_creation || incident.date || incident.created_at || incident.date_incident;
      if (dateStr) {
        try {
          const date = new Date(dateStr).toISOString().split('T')[0];
          if (last30Days.includes(date)) {
            incidentsParJour[date] = (incidentsParJour[date] || 0) + 1;
          }
        } catch (e) {
          console.warn('Date incident invalide:', dateStr);
        }
      }
    });

    const incidentsEvolution = last30Days.map(date => ({
      date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      incidents: incidentsParJour[date] || 0
    }));

    // === ALERTES ===
    const alertesActives = safeFilter(alertesArray, a => {
      const statut = (a.statut || '').toString().toLowerCase();
      const etat = (a.etat || '').toString().toLowerCase();
      
      return statut.includes('nouvelle') || 
             statut.includes('en_traitement') || 
             statut.includes('active') ||
             statut.includes('ouvert') ||
             statut.includes('en_cours') ||
             etat.includes('active') ||
             etat.includes('nouvelle') ||
             !statut.includes('résolu') && !statut.includes('fermé');
    }).length;

    const alertesCritiques = safeFilter(alertesArray, a => {
      const severite = (a.severite || '').toString().toLowerCase();
      const statut = (a.statut || '').toString().toLowerCase();
      const etat = (a.etat || '').toString().toLowerCase();
      
      const isActive = statut.includes('nouvelle') || 
                       statut.includes('en_traitement') || 
                       statut.includes('active') ||
                       statut.includes('ouvert') ||
                       etat.includes('active') ||
                       !statut.includes('résolu');
      
      return isActive && (severite.includes('critique') || 
                          severite.includes('haute') || 
                          severite.includes('élevée') ||
                          a.priorite === 'critique' ||
                          a.priorite === 'haute');
    }).length;

    const alertesParSeverite = safeReduce(alertesArray, (acc, a) => {
      const severite = (a.severite || 'moyenne').toLowerCase();
      const statut = (a.statut || '').toString().toLowerCase();
      
      const isActive = statut.includes('nouvelle') || 
                       statut.includes('en_traitement') || 
                       statut.includes('active') ||
                       statut.includes('ouvert') ||
                       !statut.includes('résolu');
      
      if (isActive) {
        let severiteNormalisee = severite;
        
        if (severite.includes('critique') || severite.includes('élevée')) {
          severiteNormalisee = 'critique';
        } else if (severite.includes('haute')) {
          severiteNormalisee = 'haute';
        } else if (severite.includes('moyenne') || severite.includes('moyen')) {
          severiteNormalisee = 'moyenne';
        } else if (severite.includes('basse') || severite.includes('faible')) {
          severiteNormalisee = 'basse';
        }
        
        acc[severiteNormalisee] = (acc[severiteNormalisee] || 0) + 1;
      }
      return acc;
    }, {});

    // === RÉPARATIONS ===
    const coutTotalReparations = safeReduce(reparationsArray, (sum, r) => {
      const cout = parseFloat(r.cout) || parseFloat(r.cout_reparation) || parseFloat(r.prix) || 0;
      return sum + cout;
    }, 0);

    const reparationsCeMois = safeFilter(reparationsArray, r => {
      const date = r.date_reparation || r.date_debut || r.date || r.created_at || r.date_fin;
      if (!date) return false;
      try {
        const repDate = new Date(date);
        const now = new Date();
        return repDate.getMonth() === now.getMonth() && 
               repDate.getFullYear() === now.getFullYear();
      } catch {
        return false;
      }
    }).length;

    const coutReparationsCeMois = safeReduce(reparationsArray, (sum, r) => {
      const date = r.date_reparation || r.date_debut || r.date || r.created_at || r.date_fin;
      if (!date) return sum;
      try {
        const repDate = new Date(date);
        const now = new Date();
        if (repDate.getMonth() === now.getMonth() && repDate.getFullYear() === now.getFullYear()) {
          return sum + (parseFloat(r.cout) || parseFloat(r.cout_reparation) || parseFloat(r.prix) || 0);
        }
      } catch {}
      return sum;
    }, 0);

    // === FOURNISSEURS ===
    const fournisseursActifs = safeFilter(fournisseursArray, f => {
      const statut = (f.statut || '').toString().toLowerCase();
      const actif = (f.actif || '').toString().toLowerCase();
      
      return statut.includes('actif') || 
             actif.includes('true') ||
             actif.includes('oui') ||
             actif.includes('actif') ||
             f.actif === true;
    }).length;

    // === CALCUL DES TAUX ===
    const tauxDisponibilite = materielsArray.length > 0 ? 
      (materielsFonctionnels / materielsArray.length * 100).toFixed(1) : 0;

    const tauxResolutionIncidents = (incidentsOuverts + incidentsEnCours + incidentsResolus) > 0 ? 
      (incidentsResolus / (incidentsOuverts + incidentsEnCours + incidentsResolus) * 100).toFixed(1) : 100;

    const calculatedStats = {
      total_materiels: materielsArray.length,
      materiels_fonctionnels: materielsFonctionnels,
      materiels_en_panne: materielsEnPanne,
      materiels_maintenance: materielsMaintenance,
      materiels_par_service: materielsParService,
      
      total_incidents: incidentsArray.length,
      incidents_ouverts: incidentsOuverts,
      incidents_en_cours: incidentsEnCours,
      incidents_resolus: incidentsResolus,
      incidents_par_priorite: incidentsParPriorite,
      incidents_evolution: incidentsEvolution,
      taux_resolution_incidents: parseFloat(tauxResolutionIncidents),
      
      reparations_ce_mois: reparationsCeMois,
      cout_total_reparations: coutTotalReparations,
      cout_reparations_ce_mois: coutReparationsCeMois,
      
      alertes_actives: alertesActives,
      alertes_critiques: alertesCritiques,
      alertes_par_severite: alertesParSeverite,
      
      total_fournisseurs: fournisseursArray.length,
      fournisseurs_actifs: fournisseursActifs,
      
      taux_disponibilite: parseFloat(tauxDisponibilite),
    };

    console.log('📊 Statistiques finales calculées:', {
      materiels: calculatedStats.total_materiels,
      incidents: {
        total: calculatedStats.total_incidents,
        ouverts: calculatedStats.incidents_ouverts,
        en_cours: calculatedStats.incidents_en_cours,
        résolus: calculatedStats.incidents_resolus
      },
      alertes: {
        total: alertesArray.length,
        actives: calculatedStats.alertes_actives,
        critiques: calculatedStats.alertes_critiques
      },
      fournisseurs: calculatedStats.total_fournisseurs
    });
    
    setStats(calculatedStats);
  }, []);

  // Auto-refresh
  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [loadData, autoRefresh]);

  // Préparer les données pour les graphiques
  const chartData = useMemo(() => {
    // Matériels par Service
    const servicesData = [
      { service: 'Secrétariat', count: stats.materiels_par_service['Secrétariat'] || 0, fill: '#3b82f6' },
      { service: 'Direction', count: stats.materiels_par_service['Direction'] || 0, fill: '#8b5cf6' },
      { service: 'Informatique', count: stats.materiels_par_service['Informatique'] || 0, fill: '#10b981' },
      { service: 'Archives', count: stats.materiels_par_service['Archives'] || 0, fill: '#f59e0b' },
      { service: 'Autre', count: stats.materiels_par_service['Autre'] || 0, fill: '#6b7280' },
    ].filter(item => item.count > 0);

    // État des Matériels
    const materielsEtat = [
      { name: 'Fonctionnel', value: stats.materiels_fonctionnels, color: '#10b981' },
      { name: 'En panne', value: stats.materiels_en_panne, color: '#ef4444' },
      { name: 'Maintenance', value: stats.materiels_maintenance, color: '#f59e0b' },
    ].filter(item => item.value > 0);

    // Incidents par Priorité
    const incidentsPriorite = Object.entries(stats.incidents_par_priorite || {}).map(([priorite, count]) => ({
      priorite: priorite.charAt(0).toUpperCase() + priorite.slice(1),
      count,
      fill: priorite === 'critique' ? '#ef4444' : 
            priorite === 'haute' ? '#f97316' : 
            priorite === 'moyenne' ? '#eab308' : '#22c55e'
    }));

    // Évolution des Incidents
    const incidentsEvolution = stats.incidents_evolution || [];

    // Alertes par Sévérité
    const alertesSeverite = Object.entries(stats.alertes_par_severite || {}).map(([severite, count]) => ({
      severite: severite.charAt(0).toUpperCase() + severite.slice(1),
      count,
      fill: severite === 'critique' ? '#ef4444' : 
            severite === 'haute' ? '#f97316' : 
            severite === 'moyenne' ? '#eab308' : '#22c55e'
    }));

    // Données de Synthèse
    const syntheseData = [
      {
        label: 'Matériels fonctionnels',
        value: stats.materiels_fonctionnels,
        total: stats.total_materiels,
        icon: CheckCircle,
        color: 'success',
        description: `Taux: ${stats.taux_disponibilite}%`
      },
      {
        label: 'Incidents ouverts',
        value: stats.incidents_ouverts,
        icon: AlertTriangle,
        color: 'error',
        description: `${stats.incidents_en_cours} en_cours • ${stats.incidents_resolus} résolus`
      },
      {
        label: 'Alertes critiques',
        value: stats.alertes_critiques,
        total: stats.alertes_actives,
        icon: AlertCircle,
        color: 'error',
        description: `${stats.alertes_actives} alertes actives`
      },
      {
        label: 'Réparations ce mois',
        value: stats.reparations_ce_mois,
        icon: Wrench,
        color: 'info',
        description: `Coût: ${formatCurrency(stats.cout_reparations_ce_mois)}`
      },
      {
        label: 'Fournisseurs actifs',
        value: stats.fournisseurs_actifs,
        total: stats.total_fournisseurs,
        icon: Users,
        color: 'success',
        description: `${stats.fournisseurs_actifs} / ${stats.total_fournisseurs}`
      },
      {
        label: 'Coût total réparations',
        value: formatCurrency(stats.cout_total_reparations),
        icon: DollarSign,
        color: 'info',
        description: `${stats.reparations_ce_mois} réparations ce mois`
      },
    ];

    return {
      servicesData,
      materielsEtat,
      incidentsPriorite,
      incidentsEvolution,
      alertesSeverite,
      syntheseData
    };
  }, [stats, formatCurrency]);

  // Générer rapport PDF
  const generateDetailedPDF = useCallback(async () => {
    const doc = new jsPDF('landscape');
    
    try {
      const imgData = await getBase64Image(logoDren);
      doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
    } catch (error) {
      console.warn('Logo non chargé');
    }
    
    doc.setFontSize(20);
    doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
    doc.setFontSize(16);
    doc.text('TABLEAU DE BORD - GESTION DES RESSOURCES MATÉRIELS', 20, 45);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
    doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 67);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, 190, 75);
    
    doc.setFontSize(14);
    doc.text('SYNTHÈSE DES DONNÉES', 20, 90);
    
    const syntheseStats = [
      ['Indicateur', 'Valeur', 'Détail'],
      ['Matériels fonctionnels', stats.materiels_fonctionnels.toString(), `${stats.total_materiels} total`],
      ['Incidents ouverts', stats.incidents_ouverts.toString(), `${stats.incidents_en_cours} en cours, ${stats.incidents_resolus} résolus`],
      ['Alertes critiques', stats.alertes_critiques.toString(), `${stats.alertes_actives} actives`],
      ['Réparations ce mois', stats.reparations_ce_mois.toString(), formatCurrency(stats.cout_reparations_ce_mois)],
      ['Fournisseurs actifs', stats.fournisseurs_actifs.toString(), `${stats.total_fournisseurs} total`],
      ['Taux disponibilité', `${stats.taux_disponibilite}%`, 'Matériels'],
      ['Taux résolution incidents', `${stats.taux_resolution_incidents}%`, 'Incidents'],
      ['Coût total réparations', formatCurrency(stats.cout_total_reparations), 'Depuis le début'],
    ];
    
    autoTable(doc, {
      startY: 95,
      head: syntheseStats.slice(0, 1),
      body: syntheseStats.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`dashboard-materiels-${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('Rapport PDF généré avec succès', 'success');
  }, [user, stats, formatCurrency, showNotification]);

  // Composant StatCard
  const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
    const colorClasses = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      primary: { bg: 'bg-primary/10', text: 'text-primary' },
      success: { bg: 'bg-success/10', text: 'text-success' },
      error: { bg: 'bg-error/10', text: 'text-error' },
      warning: { bg: 'bg-warning/10', text: 'text-warning' },
      info: { bg: 'bg-info/10', text: 'text-info' },
    };

    const colorConfig = colorClasses[color] || colorClasses.primary;

    return (
      <div className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 relative">
        {trend !== undefined && (
          <div className={`absolute -top-2 -right-2 badge badge-sm ${trend > 0 ? 'badge-success' : 'badge-error'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-base-content opacity-70">{title}</h3>
              <p className="text-2xl font-bold mt-1 text-base-content">{value}</p>
              {subtitle && <p className="text-xs text-base-content opacity-60 mt-1">{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-lg ${colorConfig.bg}`}>
              <Icon className={`h-6 w-6 ${colorConfig.text}`} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant SyntheseItem
  const SyntheseItem = ({ label, value, total, icon: Icon, color = 'primary', description }) => {
    const colorClasses = {
      success: { bg: 'bg-success/10', text: 'text-success', icon: 'text-success' },
      error: { bg: 'bg-error/10', text: 'text-error', icon: 'text-error' },
      info: { bg: 'bg-info/10', text: 'text-info', icon: 'text-info' },
      primary: { bg: 'bg-primary/10', text: 'text-primary', icon: 'text-primary' },
    };

    const colorConfig = colorClasses[color] || colorClasses.primary;
    const percentage = total ? Math.round((value / total) * 100) : 100;

    return (
      <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorConfig.bg}`}>
            <Icon className={`h-5 w-5 ${colorConfig.icon}`} />
          </div>
          <div className="flex-1">
            <span className="font-medium text-base-content">{label}</span>
            {description && (
              <p className="text-xs text-base-content opacity-60 mt-1">{description}</p>
            )}
            {total && (
              <div className="mt-2 w-full bg-base-300 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${colorConfig.text.replace('text-', 'bg-')}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            )}
        </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${colorConfig.text}`}>{value}</span>
          {total && (
            <p className="text-xs text-base-content opacity-60">sur {total}</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-base-content">Chargement du tableau de bord...</h2>
        <p className="text-base-content opacity-70 mt-2">Connexion aux sources de données</p>
        <div className="mt-4 w-64 bg-base-300 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-base-100 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Tableau de Bord - Gestion des Ressources Matériels IT
            <span className="badge badge-primary badge-lg">DREN Antsimo Andrefana</span>
          </h1>
          <p className="text-base-content opacity-70 mt-1">
            Surveillance du parc matériel informatique - Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <span className="label-text text-sm text-base-content">Auto-refresh (30s)</span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary toggle-sm"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            </label>
          </div>
          
          <div className="dropdown dropdown-end">
            <button className="btn btn-primary btn-sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><button onClick={generateDetailedPDF}>Rapport PDF</button></li>
              <li><button onClick={() => showNotification('Fonctionnalité à venir', 'info')}>Excel</button></li>
            </ul>
          </div>
          
          <button 
            onClick={loadData}
            className="btn btn-outline btn-sm text-base-content"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Matériels"
          value={stats.total_materiels}
          icon={Database}
          color="blue"
          subtitle={`${stats.materiels_fonctionnels} fonctionnels`}
        />
        
        <StatCard
          title="Incidents"
          value={stats.total_incidents}
          icon={AlertTriangle}
          color="red"
          subtitle={`${stats.incidents_ouverts} ouverts`}
        />
        
        <StatCard
          title="Alertes"
          value={stats.alertes_actives}
          icon={Bell}
          color="yellow"
          subtitle={`${stats.alertes_critiques} critiques`}
        />
        
        <StatCard
          title="Fournisseurs"
          value={stats.total_fournisseurs}
          icon={Users}
          color="purple"
          subtitle={`${stats.fournisseurs_actifs} actifs`}
        />
        
        <StatCard
          title="Réparations"
          value={stats.reparations_ce_mois}
          icon={Wrench}
          color="indigo"
          subtitle="ce mois"
        />
        
        <StatCard
          title="Coût Réparations"
          value={formatCurrency(stats.cout_total_reparations)}
          icon={DollarSign}
          color="green"
          subtitle="total"
        />
      </div>

      {/* Section 1: Matériels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Matériels par Service */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-base-content">
              <Users className="h-5 w-5 mr-2" />
              Matériels par Service
              <span className="badge badge-primary ml-2">
                {Object.keys(stats.materiels_par_service).length} services
              </span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.servicesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="service" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151', 
                    color: '#F9FAFB',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value} matériels`, 'Quantité']}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  name="Matériels"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* État des Matériels */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-base-content">
              <PieChartIcon className="h-5 w-5 mr-2" />
              État des Matériels
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.materielsEtat}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {chartData.materielsEtat.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-sm text-base-content opacity-70 mt-2">
              Taux de disponibilité: <strong>{stats.taux_disponibilite}%</strong> • Total: {stats.total_materiels} matériels
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Incidents par Priorité */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-base-content">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Incidents par Priorité
              <span className="badge badge-error ml-2">{stats.incidents_ouverts} ouverts</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.incidentsPriorite}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="priorite" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151', 
                    color: '#F9FAFB'
                  }}
                  formatter={(value) => [`${value} incidents`, 'Quantité']}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  name="Incidents"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.incidentsPriorite.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-sm text-base-content opacity-70 mt-2">
              <strong>Total: {stats.total_incidents} incidents</strong><br />
              • {stats.incidents_ouverts} ouverts • {stats.incidents_en_cours} en cours • {stats.incidents_resolus} résolus<br />
              • Taux de résolution: <strong>{stats.taux_resolution_incidents}%</strong>
            </div>
          </div>
        </div>

        {/* Évolution des Incidents */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-base-content">
              <LineChartIcon className="h-5 w-5 mr-2" />
              Évolution des Incidents (30 jours)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.incidentsEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151', 
                    color: '#F9FAFB'
                  }}
                  formatter={(value) => [`${value} incidents`, 'Quantité']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.3}
                  name="Incidents"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="text-sm text-base-content opacity-70 mt-2">
              Moyenne: {chartData.incidentsEvolution.length > 0 ? 
                Math.round(chartData.incidentsEvolution.reduce((sum, day) => sum + day.incidents, 0) / chartData.incidentsEvolution.length) : 0} incidents/jour
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Synthèse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Synthèse des Données */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-base-content">
              <Database className="h-5 w-5 mr-2" />
              Synthèse des Données
              <span className="badge badge-info ml-2">Indicateurs clés</span>
            </h3>
            
            <div className="space-y-3">
              {chartData.syntheseData.map((item, index) => (
                <SyntheseItem
                  key={index}
                  label={item.label}
                  value={item.value}
                  total={item.total}
                  icon={item.icon}
                  color={item.color}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Informations système */}
        <div className="space-y-6">
          {/* Alertes par Sévérité */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-base-content">
                <Bell className="h-5 w-5 mr-2" />
                Alertes par Sévérité
                <span className="badge badge-warning ml-2">{stats.alertes_actives} actives</span>
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData.alertesSeverite}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="severite" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                    formatter={(value) => [`${value} alertes`, 'Quantité']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Alertes"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.alertesSeverite.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="text-sm text-base-content opacity-70 mt-2">
                {stats.alertes_critiques} critiques • {stats.alertes_actives - stats.alertes_critiques} autres
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-base-content">
                <Info className="h-5 w-5 mr-2" />
                Informations système
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-base-content">Données chargées:</span>
                  <span className="text-base-content">
                    {materiels.length} matériels, {incidents.length} incidents
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-base-content">Utilisateur:</span>
                  <span className="text-base-content">{user?.nom_complet || user?.username || 'Non connecté'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-base-content">Auto-refresh:</span>
                  <span className="text-base-content">{autoRefresh ? 'Activé (30s)' : 'Désactivé'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-base-content">Dernière actualisation:</span>
                  <span className="text-base-content">{lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '--'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations & Alertes */}
      <div className="card bg-base-200 border border-base-300 mb-6">
        <div className="card-body">
          <h3 className="card-title text-base-content">
            <AlertCircle className="h-5 w-5 mr-2" />
            Recommandations & Alertes
          </h3>
          <div className="space-y-2 text-sm">
            {stats.materiels_en_panne > 0 && (
              <div className="alert alert-error">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-base-content">🚨 {stats.materiels_en_panne} matériel(s) en panne nécessite(nt) intervention</span>
              </div>
            )}
            {stats.alertes_critiques > 0 && (
              <div className="alert alert-warning">
                <Shield className="h-4 w-4" />
                <span className="text-base-content">⚠️ {stats.alertes_critiques} alerte(s) critique(s) en attente</span>
              </div>
            )}
            {stats.incidents_ouverts > 0 && (
              <div className="alert alert-warning">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-base-content">📋 {stats.incidents_ouverts} incident(s) ouvert(s) à traiter</span>
              </div>
            )}
            {stats.incidents_en_cours > 0 && (
              <div className="alert alert-info">
                <Wrench className="h-4 w-4" />
                <span className="text-base-content">🔧 {stats.incidents_en_cours} incident(s) en cours de traitement</span>
              </div>
            )}
            {stats.materiels_maintenance > 0 && (
              <div className="alert alert-warning">
                <Wrench className="h-4 w-4" />
                <span className="text-base-content">🔧 {stats.materiels_maintenance} matériel(s) en maintenance</span>
              </div>
            )}
            {stats.materiels_en_panne === 0 && stats.alertes_critiques === 0 && stats.incidents_ouverts === 0 && (
              <div className="alert alert-success">
                <CheckCircle className="h-4 w-4" />
                <span className="text-base-content">✅ Tous les systèmes sont opérationnels</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
