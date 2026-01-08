


import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Computer, AlertTriangle, Wrench, FileText, DollarSign, MapPin, Activity, Cpu, Shield, Network, Package, RefreshCw } from 'lucide-react';
import { 
  materielsAPI, 
  incidentsAPI, 
  reparationsAPI, 
  dashboardAPI, 
  logicielsAPI, 
  alertesAPI, 
  fournisseursAPI, 
  reseauAPI 
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';

// Import du logo pour le PDF seulement
import logoDren from '../assets/images/logo-dren.jpeg';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_materiels: 0,
    materiels_fonctionnels: 0,
    materiels_en_panne: 0,
    incidents_ouverts: 0,
    reparations_ce_mois: 0,
    cout_total_reparations: 0,
    maintenance_prevue: 0,
    total_logiciels: 0,
    alertes_actives: 0,
    total_fournisseurs: 0,
    equipements_reseau: 0,
  });
  const [materiels, setMateriels] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [reparations, setReparations] = useState([]);
  const [logiciels, setLogiciels] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [reseau, setReseau] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [errors, setErrors] = useState([]);

  // Fonctions helper pour manipuler les données en toute sécurité
  const safeArray = (data) => {
    return Array.isArray(data) ? data : [];
  };

  const safeFilter = (array, condition) => {
    if (!Array.isArray(array)) return [];
    return array.filter(condition);
  };

  const safeReduce = (array, reducer, initialValue = 0) => {
    if (!Array.isArray(array)) return initialValue;
    return array.reduce(reducer, initialValue);
  };

  const loadRealData = async () => {
    try {
      setLoading(true);
      setErrors([]);
      console.log('🔄 Chargement des données depuis les APIs...');

      const requests = [
        { key: 'materiels', api: () => materielsAPI.getAll() },
        { key: 'incidents', api: () => incidentsAPI.getAll() },
        { key: 'reparations', api: () => reparationsAPI.getAll() },
        { key: 'logiciels', api: () => logicielsAPI.getAll() },
        { key: 'alertes', api: () => alertesAPI.getAll() },
        { key: 'fournisseurs', api: () => fournisseursAPI.getAll() },
        { key: 'reseau', api: () => reseauAPI.getAll() },
      ];

      const results = {};
      const newErrors = [];

      for (const request of requests) {
        try {
          const response = await request.api();
          const extractedData = extractDataFromResponse(response);
          results[request.key] = extractedData;
          console.log(`✅ ${request.key} chargés:`, extractedData.length);
        } catch (error) {
          console.error(`❌ Erreur ${request.key}:`, error);
          results[request.key] = [];
          newErrors.push(`Erreur ${request.key}: ${error.response?.status || 'Connexion'}`);
        }
      }

      setErrors(newErrors);

      // Mettre à jour les états
      setMateriels(safeArray(results.materiels));
      setIncidents(safeArray(results.incidents));
      setReparations(safeArray(results.reparations));
      setLogiciels(safeArray(results.logiciels));
      setAlertes(safeArray(results.alertes));
      setFournisseurs(safeArray(results.fournisseurs));
      setReseau(safeArray(results.reseau));

      // CORRECTION: Calcul des alertes actives avec le bon champ statut
      const alertesActives = safeFilter(results.alertes, a => 
        a.statut === 'nouvelle' || a.statut === 'Nouvelle' || a.statut === 'en_traitement' || !a.statut
      );

      const calculatedStats = {
        total_materiels: safeArray(results.materiels).length,
        materiels_fonctionnels: safeFilter(results.materiels, m => 
          m.etat === 'fonctionnel' || m.etat === 'Fonctionnel' || m.etat === 'actif' || m.etat === 'Actif'
        ).length,
        materiels_en_panne: safeFilter(results.materiels, m => 
          m.etat === 'en_panne' || m.etat === 'En panne' || m.etat === 'panne' || m.etat === 'Panne'
        ).length,
        incidents_ouverts: safeFilter(results.incidents, i => 
          i.statut === 'ouvert' || i.statut === 'Ouvert' || i.statut === 'en_cours' || i.statut === 'En cours' || i.statut === 'open'
        ).length,
        reparations_ce_mois: safeFilter(results.reparations, r => {
          if (!r.date_reparation && !r.date_debut) return false;
          try {
            const dateReparation = new Date(r.date_reparation || r.date_debut);
            const now = new Date();
            return dateReparation.getMonth() === now.getMonth() && 
                   dateReparation.getFullYear() === now.getFullYear();
          } catch {
            return false;
          }
        }).length,
        cout_total_reparations: safeReduce(results.reparations, (sum, rep) => 
          sum + (parseFloat(rep.cout) || 0), 0),
        maintenance_prevue: safeFilter(results.materiels, m => 
          m.maintenance_prevue || m.prochaine_maintenance
        ).length,
        total_logiciels: safeArray(results.logiciels).length,
        alertes_actives: alertesActives.length, // Utilise le calcul corrigé
        total_fournisseurs: safeArray(results.fournisseurs).length,
        equipements_reseau: safeArray(results.reseau).length,
      };

      setStats(calculatedStats);
      setLastUpdate(new Date());

      console.log('✅ Stats calculées:', calculatedStats);

    } catch (error) {
      console.error('❌ Erreur générale lors du chargement:', error);
      setErrors(prev => [...prev, 'Erreur générale: ' + error.message]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealData();
  }, []);

  // Données pour les graphiques
  const materielsByEtat = [
    { name: 'Fonctionnel', value: stats.materiels_fonctionnels, color: '#10b981' },
    { name: 'En panne', value: stats.materiels_en_panne, color: '#ef4444' },
    { name: 'Maintenance', value: stats.maintenance_prevue, color: '#f59e0b' },
  ];

  // CORRECTION: Alertes par sévérité avec le champ severite
  const getAlertesByType = () => {
    const alertesActives = safeFilter(alertes, a => 
      a.statut === 'nouvelle' || a.statut === 'Nouvelle' || a.statut === 'en_traitement' || !a.statut
    );
    
    console.log('🔍 Alertes actives pour graphique:', alertesActives);
    console.log('📋 Sévérités détectées:', alertesActives.map(a => ({ 
      id: a.id, 
      severite: a.severite,
      description: a.description?.substring(0, 50)
    })));

    const niveaux = {
      critique: 0,
      elevee: 0,
      moyenne: 0,
      basse: 0
    };

    alertesActives.forEach(alerte => {
      const severite = alerte.severite ? alerte.severite.toString().toLowerCase().trim() : '';
      
      if (severite === 'critique') {
        niveaux.critique++;
      } else if (severite === 'elevee' || severite === 'élevée' || severite === 'élevé') {
        niveaux.elevee++;
      } else if (severite === 'moyenne' || severite === 'moyen') {
        niveaux.moyenne++;
      } else if (severite === 'basse' || severite === 'bas') {
        niveaux.basse++;
      }
    });

    const resultat = [
      { name: 'Critique', value: niveaux.critique, color: '#ef4444' },
      { name: 'Élevée', value: niveaux.elevee, color: '#f97316' },
      { name: 'Moyenne', value: niveaux.moyenne, color: '#eab308' },
      { name: 'Basse', value: niveaux.basse, color: '#22c55e' }
    ];

    console.log('📊 Résultat final des sévérités:', resultat);
    return resultat;
  };

  const alertesByType = getAlertesByType();

  // Répartition des matériels par service
  const materielsByService = safeReduce(materiels, (acc, materiel) => {
    const service = materiel.service || materiel.departement || materiel.service_attribue || 'Non assigné';
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});

  const serviceData = Object.entries(materielsByService).map(([service, count]) => ({
    service: service.length > 15 ? service.substring(0, 15) + '...' : service,
    count
  }));

  // Évolution des incidents par mois
  const getIncidentsByMonth = () => {
    const incidentsFiltres = safeFilter(incidents, i => 
      i.date_creation || i.date || i.created_at
    );

    const incidentsByMonth = safeReduce(incidentsFiltres, (acc, incident) => {
      let dateIncident;
      
      if (incident.date_creation) {
        dateIncident = new Date(incident.date_creation);
      } else if (incident.date) {
        dateIncident = new Date(incident.date);
      } else if (incident.created_at) {
        dateIncident = new Date(incident.created_at);
      }
      
      if (dateIncident && !isNaN(dateIncident.getTime())) {
        const month = dateIncident.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + 1;
      }
      
      return acc;
    }, {});

    const sortedMonths = Object.entries(incidentsByMonth)
      .sort(([a], [b]) => {
        const dateA = new Date('01 ' + a);
        const dateB = new Date('01 ' + b);
        return dateA - dateB;
      })
      .slice(-6);

    return sortedMonths.map(([month, count]) => ({
      month,
      incidents: count
    }));
  };

  const incidentsMonthData = getIncidentsByMonth();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' Ar';
  };

  const generatePDFReport = async () => {
    const doc = new jsPDF();
    
    try {
      const imgData = await getBase64Image(logoDren);
      doc.addImage(imgData, 'JPEG', 20, 15, 20, 20);
    } catch (error) {
      console.warn('Logo non chargé dans le PDF:', error);
    }
    
    doc.setFontSize(18);
    doc.text('DREN ANTSIMO ANDREFANA', 45, 25);
    doc.setFontSize(14);
    doc.text('Rapport de Gestion des Ressources Informatiques', 20, 40);
    doc.setFontSize(12);
    doc.text(`Date de génération: ${new Date().toLocaleDateString('fr-FR')}`, 20, 55);
    doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, 20, 65);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, 190, 75);
    
    doc.setFontSize(16);
    doc.text('STATISTIQUES GÉNÉRALES', 20, 90);
    
    doc.setFontSize(12);
    let yPos = 105;
    const statsToShow = [
      `Total matériels: ${stats.total_materiels}`,
      `Matériels fonctionnels: ${stats.materiels_fonctionnels}`,
      `Matériels en panne: ${stats.materiels_en_panne}`,
      `Incidents ouverts: ${stats.incidents_ouverts}`,
      `Alertes actives: ${stats.alertes_actives}`,
      `Réparations ce mois: ${stats.reparations_ce_mois}`,
      `Coût total réparations: ${formatCurrency(stats.cout_total_reparations)}`,
      `Total logiciels: ${stats.total_logiciels}`,
      `Fournisseurs: ${stats.total_fournisseurs}`,
      `Équipements réseau: ${stats.equipements_reseau}`
    ];

    statsToShow.forEach(stat => {
      doc.text(stat, 20, yPos);
      yPos += 8;
    });

    yPos += 10;
    doc.setFontSize(16);
    doc.text('ALERTES ACTIVES', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    const alertesActives = safeFilter(alertes, a => 
      a.statut === 'nouvelle' || a.statut === 'Nouvelle' || a.statut === 'en_traitement' || !a.statut
    );
    
    if (alertesActives.length === 0) {
      doc.text('✅ Aucune alerte active', 20, yPos);
      yPos += 8;
    } else {
      alertesActives.slice(0, 10).forEach((alerte, index) => {
        const description = alerte.description || 'Alerte sans description';
        const severite = alerte.severite || 'Non spécifiée';
        const text = `${index + 1}. ${description.substring(0, 40)}... - ${severite}`;
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(text, 20, yPos);
        yPos += 6;
      });
    }

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Système de Gestion des Ressources Informatiques - DREN Antsimo Andrefana', 20, 285);

    doc.save('Rapport-GestionRessourcesIT-DREN-AA.pdf');
  };

  const getBase64Image = (imgUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = imgUrl;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg">Chargement des données en temps réel...</p>
          <p className="text-sm text-gray-500 mt-2">Connexion aux APIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {errors.length > 0 && (
        <div className="alert alert-warning mb-6">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <h3 className="font-bold">Certaines données sont indisponibles</h3>
            <div className="text-xs">
              {errors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center mb-2">
            <MapPin className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-base-content opacity-70">Toliara, Madagascar</span>
          </div>
          <h1 className="text-3xl font-bold text-base-content">Tableau de Bord Temps Réel</h1>
          <p className="text-base-content opacity-70 mt-1">
            Données en direct • Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '...'}
          </p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Connexion aux APIs établie - {stats.total_materiels} matériels chargés
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadRealData} className="btn btn-outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </button>
          <button onClick={generatePDFReport} className="btn btn-primary">
            <FileText className="h-4 w-4 mr-2" />
            Rapport PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Matériels"
          value={stats.total_materiels}
          description={`${stats.materiels_fonctionnels} fonctionnels`}
          icon={Computer}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Logiciels"
          value={stats.total_logiciels}
          description="Parc logiciel"
          icon={Cpu}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Alertes Actives"
          value={stats.alertes_actives}
          description="Nécessitent attention"
          icon={Shield}
          color="from-red-500 to-red-600"
        />
        <StatCard
          title="Incidents Ouverts"
          value={stats.incidents_ouverts}
          description="En cours de traitement"
          icon={Wrench}
          color="from-yellow-500 to-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Coût Réparations"
          value={formatCurrency(stats.cout_total_reparations)}
          description="Total dépensé"
          icon={DollarSign}
          color="from-purple-500 to-purple-600"
          small
        />
        <StatCard
          title="Équipements Réseau"
          value={stats.equipements_reseau}
          description="Infrastructure"
          icon={Network}
          color="from-indigo-500 to-indigo-600"
          small
        />
        <StatCard
          title="Fournisseurs"
          value={stats.total_fournisseurs}
          description="Partenaires"
          icon={Package}
          color="from-orange-500 to-orange-600"
          small
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="État des Matériels">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={materielsByEtat}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                dataKey="value"
              >
                {materielsByEtat.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Alertes par Sévérité">
          {alertesByType.some(item => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertesByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {alertesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Aucune alerte active
            </div>
          )}
        </ChartCard>

        {serviceData.length > 0 && (
          <ChartCard title="Matériels par Service">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        <ChartCard title="Évolution des Incidents">
          {incidentsMonthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incidentsMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Aucune donnée d'incident disponible
            </div>
          )}
        </ChartCard>
      </div>

      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-base-content mb-4">
            Alertes Récentes ({safeArray(alertes).length})
          </h2>
          <div className="space-y-3">
            {safeArray(alertes).slice(0, 5).map((alerte, index) => (
              <AlerteItem key={alerte.id || index} alerte={alerte} />
            ))}
            {safeArray(alertes).length === 0 && (
              <div className="text-center py-4 text-base-content opacity-60">
                ✅ Aucune alerte active
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mb-4">
        Données chargées: {safeArray(materiels).length} matériels, {safeArray(incidents).length} incidents, 
        {safeArray(logiciels).length} logiciels, {safeArray(alertes).length} alertes
      </div>
    </div>
  );
};

// Composants réutilisables
const StatCard = ({ title, value, description, icon: Icon, color, small = false }) => (
  <div className={`card bg-gradient-to-r ${color} text-white shadow-xl`}>
    <div className="card-body p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`card-title text-white opacity-90 ${small ? 'text-lg' : 'text-xl'}`}>
            {title}
          </h2>
          <p className={`font-bold ${small ? 'text-xl' : 'text-3xl'}`}>{value}</p>
          <p className="text-sm opacity-80">{description}</p>
        </div>
        <Icon className={`opacity-80 ${small ? 'h-8 w-8' : 'h-12 w-12'}`} />
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="card bg-base-200 shadow-xl">
    <div className="card-body">
      <h2 className="card-title text-base-content mb-4">{title}</h2>
      {children}
    </div>
  </div>
);

// CORRECTION: Composant AlerteItem utilisant le champ severite
const AlerteItem = ({ alerte }) => {
  const getTitreAlerte = () => {
    return alerte.description || 'Alerte sans description';
  };

  const getDescription = () => {
    // Pour les alertes, on utilise seulement la description
    return 'Type: ' + (alerte.type_alerte || 'Non spécifié') + 
           ' | Source: ' + (alerte.materiel_nom || alerte.logiciel_nom || alerte.reseau_nom || 'Non spécifiée');
  };

  const getDateAlerte = () => {
    const date = alerte.date_alerte || alerte.date_creation || alerte.created_at;
    if (date) {
      try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }
      } catch (error) {
        console.warn('Date invalide:', date);
      }
    }
    return 'Date non spécifiée';
  };

  const getNiveauCouleur = () => {
    const severite = alerte.severite ? alerte.severite.toString().toLowerCase().trim() : '';
    
    if (severite === 'critique') return 'alert-error';
    if (severite === 'elevee' || severite === 'élevée' || severite === 'élevé') return 'alert-warning';
    if (severite === 'moyenne' || severite === 'moyen') return 'alert-info';
    if (severite === 'basse' || severite === 'bas') return 'alert-success';
    
    return 'alert-info';
  };

  const getNiveauFormate = () => {
    const severite = alerte.severite ? alerte.severite.toString().toLowerCase().trim() : '';
    
    if (severite === 'critique') return 'Critique';
    if (severite === 'elevee' || severite === 'élevée' || severite === 'élevé') return 'Élevée';
    if (severite === 'moyenne' || severite === 'moyen') return 'Moyenne';
    if (severite === 'basse' || severite === 'bas') return 'Basse';
    
    return alerte.severite || 'Non spécifiée';
  };

  return (
    <div className={`alert ${getNiveauCouleur()}`}>
      <div className="flex justify-between items-start w-full">
        <div className="flex-1">
          <h3 className="font-bold">{getTitreAlerte()}</h3>
          <p className="text-sm mt-1">{getDescription()}</p>
          <p className="text-xs mt-1 opacity-70">
            Sévérité: <span className="font-semibold">{getNiveauFormate()}</span>
          </p>
        </div>
        <span className="text-xs opacity-70 whitespace-nowrap ml-4">
          {getDateAlerte()}
        </span>
      </div>
    </div>
  );
};

// Fonction utilitaire pour extraire les données des réponses API
const extractDataFromResponse = (response) => {
  if (!response || !response.data) {
    console.log('❌ Réponse vide ou sans data:', response);
    return [];
  }
  
  if (Array.isArray(response.data)) {
    return response.data;
  }
  
  if (response.data.results && Array.isArray(response.data.results)) {
    return response.data.results;
  }
  
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  if (typeof response.data === 'object' && !Array.isArray(response.data)) {
    return [response.data];
  }
  
  console.warn('⚠️ Format de réponse non reconnu:', response.data);
  return [];
};

export default Dashboard;