// src/pages/Rapports.jsx - VERSION CORRIGÉE AVEC ICÔNES VALIDES
import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Filter, TrendingUp, 
  RefreshCw, Monitor, Network, Package, AlertTriangle, 
  Users, Database, Search, Bell, User, Wrench,
  Printer, Image as ImageIcon
} from 'lucide-react';
// Pour CSV, on peut utiliser FileSpreadsheet ou créer notre propre composant
import { FileSpreadsheet } from 'lucide-react';
import { 
  materielsAPI, incidentsAPI, reparationsAPI, logicielsAPI, 
  alertesAPI, fournisseursAPI, reseauAPI, usersAPI
} from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';

// Import du logo DREN
import logoDren from '../assets/images/logo-dren.jpeg';

// Composant SVG pour Excel (puisque FileExcel n'existe pas)
const ExcelIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18v-6" />
    <path d="M9 15h6" />
  </svg>
);

// Composant SVG pour CSV
const CsvIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const Rapports = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    materiels: [],
    incidents: [],
    reparations: [],
    logiciels: [],
    alertes: [],
    fournisseurs: [],
    reseau: [],
    utilisateurs: []
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [filters, setFilters] = useState({
    dateDebut: '',
    dateFin: '',
    service: '',
    etat: '',
    type: '',
    typeRapport: 'inventaire_complet',
    searchTerm: ''
  });
  const [currentTable, setCurrentTable] = useState('materiels');
  const [statsGenerales, setStatsGenerales] = useState({});
  const [dynamicColumns, setDynamicColumns] = useState({});
  const [logoBase64, setLogoBase64] = useState(null);

  // Charger le logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        // Essayer de convertir l'image importée en base64
        const response = await fetch(logoDren);
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setLogoBase64(reader.result);
          };
          reader.readAsDataURL(blob);
        } else {
          console.log('Logo non trouvé, génération de rapports sans logo');
        }
      } catch (error) {
        console.log('Erreur chargement logo:', error);
        // Continuer sans logo en cas d'erreur
      }
    };
    
    loadLogo();
  }, []);

  const extractDataFromResponse = (response) => {
    if (!response) return [];
    
    if (response.data !== undefined) {
      if (Array.isArray(response.data)) return response.data;
      if (response.data.results && Array.isArray(response.data.results)) return response.data.results;
      if (typeof response.data === 'object') {
        const values = Object.values(response.data);
        if (values.length > 0) return values;
      }
    }
    
    return Array.isArray(response) ? response : [];
  };

  const determineColumnsForTable = (tableData, tableKey) => {
    if (!tableData || tableData.length === 0) return [];
    
    const sampleItem = tableData[0];
    if (!sampleItem) return [];
    
    const columnsConfigs = {
      materiels: [
        { header: 'Nom/Modèle', accessor: 'nom', testField: 'nom' },
        { header: 'Type', accessor: 'type_materiel', testField: 'type_materiel' },
        { header: 'État', accessor: 'etat', testField: 'etat' },
        { header: 'Marque', accessor: 'marque', testField: 'marque' },
        { header: 'Référence', accessor: 'reference', testField: 'reference' },
        { header: 'Service', accessor: 'service_attribue', testField: 'service_attribue' },
        { header: 'Utilisateur', accessor: 'utilisateur_attribue', testField: 'utilisateur_attribue' },
        { header: 'Date Achat', accessor: 'date_achat', testField: 'date_achat', formatter: formatDate },
        { header: 'Garantie (jours)', accessor: 'garantie_jours', testField: 'garantie_jours' }
      ],
      logiciels: [
        { header: 'Nom', accessor: 'nom', testField: 'nom' },
        { header: 'Type', accessor: 'type', testField: 'type' },
        { header: 'État', accessor: 'statut', testField: 'statut' },
        { header: 'Version', accessor: 'version', testField: 'version' },
        { header: 'Éditeur', accessor: 'editeur', testField: 'editeur' },
        { header: 'Mise en exploitation', accessor: 'date_installation', testField: 'date_installation', formatter: formatDate },
        { header: 'Expiration licence', accessor: 'date_expiration', testField: 'date_expiration', formatter: formatDate },
        { header: 'Licences', accessor: 'nombre_licences', testField: 'nombre_licences' },
        { header: 'Utilisées', accessor: 'licences_utilisees', testField: 'licences_utilisees' },
        { header: 'Coût', accessor: 'cout_licence', testField: 'cout_licence', formatter: formatCurrency }
      ],
      incidents: [
        { header: 'Description', accessor: 'description', testField: 'description' },
        { header: 'Type', accessor: 'type_incident', testField: 'type_incident' },
        { header: 'Priorité', accessor: 'priorite', testField: 'priorite' },
        { header: 'Statut', accessor: 'statut', testField: 'statut' },
        { header: 'Date création', accessor: 'date_creation', testField: 'date_creation', formatter: formatDate },
        { header: 'Matériel', accessor: 'materiel_nom', testField: 'materiel_nom' },
        { header: 'Technicien', accessor: 'technicien_responsable', testField: 'technicien_responsable' },
        { header: 'Service affecté', accessor: 'service_affecte', testField: 'service_affecte' },
        { header: 'Temps Résolution', accessor: 'temps_resolution', testField: 'temps_resolution' }
      ],
      fournisseurs: [
        { header: 'Nom', accessor: 'nom', testField: 'nom' },
        { header: 'Type', accessor: 'type_fournisseur', testField: 'type_fournisseur' },
        { header: 'Email', accessor: 'email', testField: 'email' },
        { header: 'Téléphone', accessor: 'telephone', testField: 'telephone' },
        { header: 'Adresse', accessor: 'adresse', testField: 'adresse' },
        { header: 'Contact', accessor: 'contact', testField: 'contact' },
        { header: 'Type Service', accessor: 'type_service', testField: 'type_service' },
        { header: 'Note', accessor: 'note', testField: 'note' },
        { header: 'Statut', accessor: 'statut', testField: 'statut' }
      ],
      reparations: [
        { header: 'Matériel', accessor: 'materiel_nom', testField: 'materiel_nom' },
        { header: 'Type', accessor: 'type_reparation', testField: 'type_reparation' },
        { header: 'Action', accessor: 'action_effectuee', testField: 'action_effectuee' },
        { header: 'Technicien', accessor: 'technicien', testField: 'technicien' },
        { header: 'Date début', accessor: 'date_debut', testField: 'date_debut', formatter: formatDate },
        { header: 'Date fin', accessor: 'date_fin', testField: 'date_fin', formatter: formatDate },
        { header: 'Coût', accessor: 'cout', testField: 'cout', formatter: formatCurrency },
        { header: 'Statut', accessor: 'statut_reparation', testField: 'statut_reparation' },
        { header: 'Incident ID', accessor: 'incident_id', testField: 'incident_id' },
        { header: 'Temps réparation', accessor: 'temps_reparation', testField: 'temps_reparation' },
        { header: 'Pièces utilisées', accessor: 'pieces_utilisees', testField: 'pieces_utilisees' },
        { header: 'Garantie réparation', accessor: 'garantie_reparation', testField: 'garantie_reparation' }
      ],
      reseau: [
        { header: 'Matériel', accessor: 'nom_equipement', testField: 'nom_equipement' },
        { header: 'Adresse IP', accessor: 'adresse_ip', testField: 'adresse_ip' },
        { header: 'Nom d\'hôte', accessor: 'nom_hote', testField: 'nom_hote' },
        { header: 'Type', accessor: 'type_equipement', testField: 'type_equipement' },
        { header: 'Sous-réseau', accessor: 'sous_reseau', testField: 'sous_reseau' },
        { header: 'Statut', accessor: 'etat', testField: 'etat' },
        { header: 'MAC', accessor: 'adresse_mac', testField: 'adresse_mac' },
        { header: 'Localisation', accessor: 'localisation', testField: 'localisation' },
        { header: 'Fabricant', accessor: 'fabricant', testField: 'fabricant' },
        { header: 'Modèle', accessor: 'modele', testField: 'modele' },
        { header: 'Date Installation', accessor: 'date_installation', testField: 'date_installation', formatter: formatDate }
      ],
      utilisateurs: [
        { header: 'Utilisateur', accessor: 'username', testField: 'username' },
        { header: 'Email', accessor: 'email', testField: 'email' },
        { header: 'Prénom', accessor: 'first_name', testField: 'first_name' },
        { header: 'Nom', accessor: 'last_name', testField: 'last_name' },
        { header: 'Service', accessor: 'departement', testField: 'departement' },
        { header: 'Rôle', accessor: 'role', testField: 'role' },
        { header: 'Statut', accessor: 'is_active', testField: 'is_active', formatter: formatActif },
        { header: 'Téléphone', accessor: 'telephone', testField: 'telephone' },
        { header: 'Date Inscription', accessor: 'date_joined', testField: 'date_joined', formatter: formatDate },
        { header: 'Dernière connexion', accessor: 'last_login', testField: 'last_login', formatter: formatDate }
      ],
      alertes: [
        { header: 'Titre', accessor: 'titre', testField: 'titre' },
        { header: 'Description', accessor: 'description', testField: 'description' },
        { header: 'Type', accessor: 'type_alerte', testField: 'type_alerte' },
        { header: 'Sévérité', accessor: 'severite', testField: 'severite' },
        { header: 'Statut', accessor: 'statut', testField: 'statut' },
        { header: 'Date Alerte', accessor: 'date_alerte', testField: 'date_alerte', formatter: formatDate },
        { header: 'Source', accessor: 'source', testField: 'source' },
        { header: 'Assigné à', accessor: 'assigne_a', testField: 'assigne_a' },
        { header: 'Actions', accessor: 'actions_prises', testField: 'actions_prises' }
      ]
    };
    
    const config = columnsConfigs[tableKey] || [];
    
    const filteredColumns = config.filter(column => {
      return tableData.some(item => {
        const value = item[column.testField || column.accessor];
        return value !== undefined && value !== null && value !== '';
      });
    });
    
    if (filteredColumns.length === 0 && config.length > 0) {
      return config.slice(0, Math.min(3, config.length));
    }
    
    return filteredColumns;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setErrors([]);
      console.log('🔄 Chargement des données pour les rapports...');

      const requests = [
        { key: 'materiels', api: () => materielsAPI.getAll() },
        { key: 'incidents', api: () => incidentsAPI.getAll() },
        { key: 'reparations', api: () => reparationsAPI.getAll() },
        { key: 'logiciels', api: () => logicielsAPI.getAll() },
        { key: 'alertes', api: () => alertesAPI.getAll() },
        { key: 'fournisseurs', api: () => fournisseursAPI.getAll() },
        { key: 'reseau', api: () => reseauAPI.getAll() },
        { key: 'utilisateurs', api: () => usersAPI.getAll() }
      ];

      const results = {};
      const newErrors = [];
      const newDynamicColumns = {};

      for (const request of requests) {
        try {
          const response = await request.api();
          const extractedData = extractDataFromResponse(response);
          results[request.key] = extractedData;
          
          newDynamicColumns[request.key] = determineColumnsForTable(extractedData, request.key);
        } catch (error) {
          console.error(`❌ Erreur ${request.key}:`, error);
          results[request.key] = [];
          newDynamicColumns[request.key] = [];
          newErrors.push(`Erreur ${request.key}: ${error.response?.status || 'Connexion'}`);
        }
      }

      setErrors(newErrors);
      setData(results);
      setDynamicColumns(newDynamicColumns);
      calculerStatsGenerales(results);

    } catch (error) {
      console.error('❌ Erreur générale lors du chargement:', error);
      setErrors(prev => [...prev, 'Erreur générale: ' + error.message]);
    } finally {
      setLoading(false);
    }
  };

  const calculerStatsGenerales = (donnees) => {
    const stats = {
      total_materiels: donnees.materiels.length,
      materiels_fonctionnels: donnees.materiels.filter(m => 
        m.etat === 'fonctionnel' || m.etat === 'Fonctionnel' || m.statut === 'actif'
      ).length,
      materiels_en_panne: donnees.materiels.filter(m => 
        m.etat === 'en_panne' || m.etat === 'En panne' || m.statut === 'panne'
      ).length,
      total_logiciels: donnees.logiciels.length,
      logiciels_actifs: donnees.logiciels.filter(l => 
        l.statut === 'actif' || l.statut === 'Actif' || l.actif === true
      ).length,
      total_equipements_reseau: donnees.reseau.length,
      incidents_ouverts: donnees.incidents.filter(i => 
        i.statut === 'ouvert' || i.statut === 'Ouvert' || i.statut === 'en_cours'
      ).length,
      incidents_total: donnees.incidents.length,
      alertes_actives: donnees.alertes.filter(a => 
        a.statut === 'nouvelle' || a.statut === 'Nouvelle' || a.statut === 'en_traitement'
      ).length,
      alertes_total: donnees.alertes.length,
      total_utilisateurs: donnees.utilisateurs.length,
      total_fournisseurs: donnees.fournisseurs.length,
      cout_total_reparations: donnees.reparations.reduce((sum, r) => sum + (parseFloat(r.cout) || 0), 0),
      reparations_total: donnees.reparations.length
    };
    setStatsGenerales(stats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getFilteredData = () => {
    let filteredData = [...data[currentTable]];
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        return Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(term)
        );
      });
    }
    
    switch (currentTable) {
      case 'materiels':
        if (filters.service) {
          filteredData = filteredData.filter(m => 
            m.service_attribue === filters.service || 
            m.service === filters.service ||
            m.departement === filters.service
          );
        }
        if (filters.etat) {
          filteredData = filteredData.filter(m => 
            m.etat?.toLowerCase() === filters.etat.toLowerCase() ||
            m.statut?.toLowerCase() === filters.etat.toLowerCase()
          );
        }
        break;
      
      case 'incidents':
        if (filters.dateDebut && filters.dateFin) {
          filteredData = filteredData.filter(i => {
            const incidentDate = new Date(i.date_signalement || i.date_creation || i.created_at);
            return incidentDate >= new Date(filters.dateDebut) && 
                   incidentDate <= new Date(filters.dateFin);
          });
        }
        if (filters.etat) {
          filteredData = filteredData.filter(i => 
            i.statut?.toLowerCase() === filters.etat.toLowerCase()
          );
        }
        break;
      
      case 'reparations':
        if (filters.dateDebut && filters.dateFin) {
          filteredData = filteredData.filter(r => {
            const repDate = new Date(r.date_reparation || r.date_debut || r.created_at);
            return repDate >= new Date(filters.dateDebut) && 
                   repDate <= new Date(filters.dateFin);
          });
        }
        break;
      
      case 'logiciels':
        if (filters.type) {
          filteredData = filteredData.filter(l => 
            l.type?.toLowerCase() === filters.type.toLowerCase() ||
            l.categorie?.toLowerCase() === filters.type.toLowerCase()
          );
        }
        break;
      
      case 'alertes':
        if (filters.dateDebut && filters.dateFin) {
          filteredData = filteredData.filter(a => {
            const alerteDate = new Date(a.date_alerte || a.date_creation || a.created_at);
            return alerteDate >= new Date(filters.dateDebut) && 
                   alerteDate <= new Date(filters.dateFin);
          });
        }
        if (filters.etat) {
          filteredData = filteredData.filter(a => 
            a.statut?.toLowerCase() === filters.etat.toLowerCase()
          );
        }
        break;
    }
    
    return filteredData;
  };

  const getTableColumns = () => {
    return dynamicColumns[currentTable] || [];
  };

  const formatDate = (value) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleDateString('fr-FR');
    } catch {
      return value;
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('fr-FR').format(num) + ' Ar';
  };

  const formatActif = (value) => {
    if (value === true || value === 'true' || value === 1 || value === 'actif') return 'Actif';
    if (value === false || value === 'false' || value === 0 || value === 'inactif') return 'Inactif';
    return value || '-';
  };

  // Fonction pour ajouter l'en-tête avec logo au PDF
  const addHeaderToPDF = (doc, title, subtitle = '') => {
    // Ajouter le logo si disponible
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'JPEG', 20, 10, 30, 30);
      } catch (error) {
        console.log('Erreur lors de l\'ajout du logo:', error);
      }
    }
    
    // Titre principal
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('DREN ANTSIMO ANDREFANA', logoBase64 ? 60 : 20, 20);
    
    // Sous-titre
    doc.setFontSize(14);
    doc.text(title, logoBase64 ? 60 : 20, 30);
    
    if (subtitle) {
      doc.setFontSize(12);
      doc.text(subtitle, logoBase64 ? 60 : 20, 38);
    }
    
    // Informations de génération
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, logoBase64 ? 60 : 20, 45);
    doc.text(`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`, logoBase64 ? 60 : 20, 51);
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 58, doc.internal.pageSize.width - 20, 58);
    
    return 65; // Retourne la position Y après l'en-tête
  };

  // GÉNÉRATION RAPPORT PDF PAR TYPE
  const generatePDFReport = () => {
    const filteredData = getFilteredData();
    const columns = getTableColumns();
    
    if (filteredData.length === 0) {
      alert('Aucune donnée à exporter !');
      return;
    }
    
    const titres = {
      'materiels': 'INVENTAIRE DES MATÉRIELS',
      'logiciels': 'INVENTAIRE DES LOGICIELS',
      'reseau': 'CONFIGURATION RÉSEAU',
      'incidents': 'RAPPORT DES INCIDENTS',
      'reparations': 'RAPPORT DES RÉPARATIONS',
      'alertes': 'RAPPORT DES ALERTES',
      'fournisseurs': 'LISTE DES FOURNISSEURS',
      'utilisateurs': 'PROFIL UTILISATEURS'
    };
    
    const isLandscape = columns.length > 6;
    const doc = new jsPDF(isLandscape ? 'landscape' : 'portrait');
    
    let yPos = addHeaderToPDF(doc, titres[currentTable] || 'RAPPORT');
    
    // Informations de filtrage
    if (filters.service || filters.dateDebut || filters.dateFin) {
      doc.setFontSize(10);
      let infoY = yPos;
      if (filters.service) {
        doc.text(`Service: ${filters.service}`, 20, infoY);
        infoY += 6;
      }
      if (filters.dateDebut && filters.dateFin) {
        doc.text(`Période: ${filters.dateDebut} au ${filters.dateFin}`, 20, infoY);
        infoY += 6;
      }
      yPos = infoY + 5;
    }
    
    // Statistiques
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: ${filteredData.length} éléments`, 20, yPos);
    
    if (currentTable === 'reparations') {
      const coutTotal = filteredData.reduce((sum, r) => sum + (parseFloat(r.cout) || 0), 0);
      doc.text(`Coût total: ${formatCurrency(coutTotal)}`, 100, yPos);
    }
    
    yPos += 10;
    
    // Tableau principal
    const tableData = filteredData.map(item => 
      columns.map(col => {
        const value = item[col.accessor];
        return col.formatter ? col.formatter(value) : (value || '-');
      })
    );
    
    autoTable(doc, {
      head: [columns.map(col => col.header)],
      body: tableData,
      startY: yPos,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 },
      pageBreak: 'auto'
    });
    
    // Pied de page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Système de Gestion des Ressources Informatiques - DREN Antsimo Andrefana - Page ${i}/${pageCount}`,
        20,
        doc.internal.pageSize.height - 10
      );
    }
    
    doc.save(`${currentTable}-rapport-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // GÉNÉRATION RAPPORT EXCEL
  const generateExcelReport = () => {
    const filteredData = getFilteredData();
    const columns = getTableColumns();
    
    if (filteredData.length === 0) {
      alert('Aucune donnée à exporter !');
      return;
    }
    
    const titres = {
      'materiels': 'Inventaire des Matériels',
      'logiciels': 'Inventaire des Logiciels',
      'reseau': 'Configuration Réseau',
      'incidents': 'Rapport des Incidents',
      'reparations': 'Rapport des Réparations',
      'alertes': 'Rapport des Alertes',
      'fournisseurs': 'Liste des Fournisseurs',
      'utilisateurs': 'Profil Utilisateurs'
    };
    
    // Préparer les données
    const dataToExport = filteredData.map(item => {
      const row = {};
      columns.forEach(col => {
        const value = item[col.accessor];
        row[col.header] = col.formatter ? col.formatter(value) : (value || '');
      });
      return row;
    });
    
    // Créer le workbook
    const wb = XLSX.utils.book_new();
    
    // Créer la feuille avec les données
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    
    // Ajouter les métadonnées
    const metadata = [
      ['DREN ANTSIMO ANDREFANA'],
      [titres[currentTable] || 'Rapport'],
      [`Date: ${new Date().toLocaleDateString('fr-FR')}`],
      [`Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}`],
      [''],
      [`Total: ${filteredData.length} éléments`]
    ];
    
    if (filters.service) {
      metadata.push([`Service: ${filters.service}`]);
    }
    if (filters.dateDebut && filters.dateFin) {
      metadata.push([`Période: ${filters.dateDebut} au ${filters.dateFin}`]);
    }
    
    // Ajouter les métadonnées en haut de la feuille
    XLSX.utils.sheet_add_aoa(ws, metadata, { origin: 'A1' });
    
    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Rapport');
    
    // Générer le fichier Excel
    XLSX.writeFile(wb, `${currentTable}-rapport-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // GÉNÉRATION RAPPORT CSV
  const generateCSVReport = () => {
    const filteredData = getFilteredData();
    const columns = getTableColumns();
    
    if (filteredData.length === 0) {
      alert('Aucune donnée à exporter !');
      return;
    }
    
    // Préparer les en-têtes
    const headers = columns.map(col => col.header);
    
    // Préparer les données
    const rows = filteredData.map(item => 
      columns.map(col => {
        const value = item[col.accessor];
        const formatted = col.formatter ? col.formatter(value) : (value || '');
        // Échapper les guillemets pour CSV
        return `"${String(formatted).replace(/"/g, '""')}"`;
      })
    );
    
    // Créer le contenu CSV
    const csvContent = [
      `"DREN ANTSIMO ANDREFANA - ${new Date().toLocaleDateString('fr-FR')}"`,
      `"Généré par: ${user?.nom_complet || user?.username || 'Utilisateur'}"`,
      '',
      headers.map(header => `"${header}"`).join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentTable}-rapport-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // GÉNÉRATION RAPPORT PDF COMPLET
  const generateRapportCompletPDF = () => {
    const doc = new jsPDF('landscape');
    
    let yPos = addHeaderToPDF(doc, 'RAPPORT COMPLET DU SYSTÈME IT');
    
    // Statistiques générales
    doc.setFontSize(14);
    doc.text('1. STATISTIQUES GÉNÉRALES', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`• Total Matériels: ${statsGenerales.total_materiels || 0}`, 20, yPos);
    doc.text(`• Fonctionnels: ${statsGenerales.materiels_fonctionnels || 0}`, 90, yPos);
    doc.text(`• En panne: ${statsGenerales.materiels_en_panne || 0}`, 160, yPos);
    yPos += 7;
    doc.text(`• Total Logiciels: ${statsGenerales.total_logiciels || 0}`, 20, yPos);
    doc.text(`• Logiciels actifs: ${statsGenerales.logiciels_actifs || 0}`, 90, yPos);
    yPos += 7;
    doc.text(`• Équipements réseau: ${statsGenerales.total_equipements_reseau || 0}`, 20, yPos);
    doc.text(`• Incidents ouverts: ${statsGenerales.incidents_ouverts || 0}`, 90, yPos);
    doc.text(`• Alertes actives: ${statsGenerales.alertes_actives || 0}`, 160, yPos);
    yPos += 7;
    doc.text(`• Utilisateurs: ${statsGenerales.total_utilisateurs || 0}`, 20, yPos);
    doc.text(`• Fournisseurs: ${statsGenerales.total_fournisseurs || 0}`, 90, yPos);
    doc.text(`• Coût total réparations: ${formatCurrency(statsGenerales.cout_total_reparations || 0)}`, 160, yPos);
    yPos += 15;
    
    // Tableaux
    const tables = [
      { key: 'materiels', title: '2. INVENTAIRE DES MATÉRIELS' },
      { key: 'logiciels', title: '3. INVENTAIRE DES LOGICIELS' },
      { key: 'reseau', title: '4. CONFIGURATION RÉSEAU' },
      { key: 'incidents', title: '5. RAPPORT DES INCIDENTS' },
      { key: 'reparations', title: '6. RAPPORT DES RÉPARATIONS' },
      { key: 'alertes', title: '7. RAPPORT DES ALERTES' },
      { key: 'fournisseurs', title: '8. LISTE DES FOURNISSEURS' },
      { key: 'utilisateurs', title: '9. PROFIL UTILISATEURS' }
    ];
    
    for (const table of tables) {
      const tableData = data[table.key] || [];
      const columns = dynamicColumns[table.key] || [];
      
      if (tableData.length > 0 && columns.length > 0) {
        if (yPos > 150) {
          doc.addPage('landscape');
          yPos = 20;
          addHeaderToPDF(doc, 'RAPPORT COMPLET DU SYSTÈME IT (suite)');
          yPos = 65;
        }
        
        doc.setFontSize(14);
        doc.text(table.title, 20, yPos);
        yPos += 10;
        
        const tableRows = tableData.map(item => 
          columns.map(col => {
            const value = item[col.accessor];
            return col.formatter ? col.formatter(value) : (value || '-');
          })
        );
        
        autoTable(doc, {
          head: [columns.map(col => col.header)],
          body: tableRows,
          startY: yPos,
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { 
            fillColor: table.key === 'materiels' ? [59, 130, 246] :
                      table.key === 'logiciels' ? [16, 185, 129] :
                      table.key === 'reseau' ? [139, 92, 246] :
                      table.key === 'incidents' ? [245, 158, 11] :
                      table.key === 'reparations' ? [239, 68, 68] :
                      table.key === 'alertes' ? [236, 72, 153] :
                      table.key === 'fournisseurs' ? [14, 165, 233] :
                      table.key === 'utilisateurs' ? [34, 197, 94] :
                      [59, 130, 246]
          },
          margin: { left: 20, right: 20 },
          pageBreak: 'auto'
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
      }
    }
    
    // Pied de page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Système de Gestion des Ressources Informatiques - DREN Antsimo Andrefana - Page ${i}/${pageCount}`,
        20,
        doc.internal.pageSize.height - 10
      );
    }
    
    doc.save(`rapport-complet-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Types de tableaux disponibles
  const tableTypes = [
    { key: 'materiels', label: 'Matériels', icon: Monitor, color: 'primary', count: data.materiels.length },
    { key: 'logiciels', label: 'Logiciels', icon: Package, color: 'success', count: data.logiciels.length },
    { key: 'reseau', label: 'Réseau', icon: Network, color: 'secondary', count: data.reseau.length },
    { key: 'incidents', label: 'Incidents', icon: AlertTriangle, color: 'warning', count: data.incidents.length },
    { key: 'reparations', label: 'Réparations', icon: Wrench, color: 'accent', count: data.reparations.length },
    { key: 'alertes', label: 'Alertes', icon: Bell, color: 'error', count: data.alertes.length },
    { key: 'fournisseurs', label: 'Fournisseurs', icon: Users, color: 'info', count: data.fournisseurs.length },
    { key: 'utilisateurs', label: 'Utilisateurs', icon: User, color: 'neutral', count: data.utilisateurs.length }  
  ];

  const services = [...new Set(data.materiels.map(m => 
    m.service_attribue || m.departement || m.service
  ).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {errors.length > 0 && (
        <div className="alert alert-warning mb-6">
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

      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">📊 Rapports et Tableaux</h1>
          <p className="text-base-content opacity-70 mt-1">
            Visualisation et export des données du système
          </p>
          <div className="flex flex-wrap gap-2 mt-2 text-sm">
            <span className="badge badge-info">Fournisseurs: {data.fournisseurs.length}</span>
            <span className="badge badge-primary">Matériels: {data.materiels.length}</span>
            <span className="badge badge-success">Logiciels: {data.logiciels.length}</span>
            <span className="badge badge-neutral">Réseau: {data.reseau.length}</span>
            <span className="badge badge-warning">Incidents: {data.incidents.length}</span>
            <span className="badge badge-error">Alertes: {data.alertes.length}</span>
            <span className="badge badge-accent">Reparation: {data.reparations.length}</span>
            <span className="badge badge-neutral">Utulisateurs: {data.utilisateurs.length}</span>
            <span className="badge badge-info">Profif: {data.fournisseurs.length}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="btn btn-outline btn-sm">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={generateRapportCompletPDF} className="btn btn-primary">
            <FileText className="h-4 w-4 mr-2" />
            Rapport Complet PDF
          </button>
        </div>
      </div>

      {/* Types de tableaux */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-base-content mb-4">
            <Database className="h-5 w-5" />
            Types de Données ({tableTypes.reduce((sum, t) => sum + t.count, 0)} éléments)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {tableTypes.map((table) => (
              <button
                key={table.key}
                onClick={() => setCurrentTable(table.key)}
                className={`btn btn-sm ${currentTable === table.key ? `btn-${table.color}` : 'btn-outline'} flex flex-col h-auto py-3`}
                disabled={table.count === 0}
              >
                <table.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{table.label}</span>
                <span className="badge badge-sm mt-1">{table.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="card-title text-base-content">
              <Filter className="h-5 w-5" />
              Filtres pour: {tableTypes.find(t => t.key === currentTable)?.label}
              <span className="text-sm font-normal ml-2">
                ({getFilteredData().length} éléments, {dynamicColumns[currentTable]?.length || 0} colonnes)
              </span>
            </h2>
            <div className="flex gap-2">
              {/* Boutons d'export */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-primary btn-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button 
                      onClick={generatePDFReport}
                      disabled={getFilteredData().length === 0}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={generateExcelReport}
                      disabled={getFilteredData().length === 0}
                      className="flex items-center gap-2"
                    >
                      <ExcelIcon className="h-4 w-4" />
                      Excel
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={generateCSVReport}
                      disabled={getFilteredData().length === 0}
                      className="flex items-center gap-2"
                    >
                      <CsvIcon className="h-4 w-4" />
                      CSV
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche globale */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Recherche
                </span>
              </label>
              <input
                type="text"
                placeholder="Rechercher dans le tableau..."
                className="input input-bordered bg-base-100"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              />
            </div>

            {/* Filtres spécifiques */}
            {(currentTable === 'materiels' || currentTable === 'incidents') && services.length > 0 && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Service</span>
                </label>
                <select
                  className="select select-bordered bg-base-100"
                  value={filters.service}
                  onChange={(e) => setFilters({...filters, service: e.target.value})}
                >
                  <option value="">Tous les services</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtre État pour plus de tables */}
            {(currentTable === 'materiels' || currentTable === 'incidents' || currentTable === 'logiciels' || currentTable === 'alertes') && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    {currentTable === 'logiciels' ? 'Type' : 
                     currentTable === 'alertes' ? 'Sévérité' : 'État'}
                  </span>
                </label>
                <select
                  className="select select-bordered bg-base-100"
                  value={currentTable === 'logiciels' ? filters.type : 
                        currentTable === 'alertes' ? filters.type : filters.etat}
                  onChange={(e) => {
                    if (currentTable === 'logiciels') {
                      setFilters({...filters, type: e.target.value});
                    } else if (currentTable === 'alertes') {
                      setFilters({...filters, type: e.target.value});
                    } else {
                      setFilters({...filters, etat: e.target.value});
                    }
                  }}
                >
                  <option value="">Tous</option>
                  {currentTable === 'logiciels' ? (
                    <>
                      <option value="système">Système</option>
                      <option value="bureautique">Bureautique</option>
                      <option value="spécialisé">Spécialisé</option>
                      <option value="sécurité">Sécurité</option>
                    </>
                  ) : currentTable === 'materiels' ? (
                    <>
                      <option value="fonctionnel">Fonctionnel</option>
                      <option value="en_panne">En panne</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="obsolete">Obsolète</option>
                    </>
                  ) : currentTable === 'incidents' ? (
                    <>
                      <option value="ouvert">Ouvert</option>
                      <option value="en_cours">En cours</option>
                      <option value="résolu">Résolu</option>
                      <option value="fermé">Fermé</option>
                    </>
                  ) : currentTable === 'alertes' ? (
                    <>
                      <option value="critique">Critique</option>
                      <option value="élevée">Élevée</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="faible">Faible</option>
                    </>
                  ) : (
                    <>
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Filtres de date pour plus de tables */}
            {(currentTable === 'incidents' || currentTable === 'reparations' || currentTable === 'alertes') && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date début</span>
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
                    <span className="label-text">Date fin</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered bg-base-100"
                    value={filters.dateFin}
                    onChange={(e) => setFilters({...filters, dateFin: e.target.value})}
                  />
                </div>
              </>
            )}
          </div>
          
          {/* Boutons de réinitialisation */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setFilters({
                dateDebut: '', dateFin: '', service: '', etat: '', type: '', searchTerm: ''
              })}
              className="btn btn-ghost btn-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Tableau principal */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200">
                  {getTableColumns().map((column, index) => (
                    <th key={index} className="font-semibold">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getFilteredData().length === 0 ? (
                  <tr>
                    <td colSpan={getTableColumns().length} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FileText className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg">Aucune donnée trouvée</p>
                        <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  getFilteredData().slice(0, 100).map((item, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-base-200">
                      {getTableColumns().map((column, colIndex) => {
                        const value = item[column.accessor];
                        const formattedValue = column.formatter 
                          ? column.formatter(value)
                          : (value || '-');
                        
                        let cellClass = '';
                        if (column.accessor === 'etat' || column.accessor === 'statut' || column.accessor === 'statut_reparation') {
                          if (value === 'fonctionnel' || value === 'actif' || value === 'résolu' || value === 'fermé' || value === 'terminé') {
                            cellClass = 'text-success';
                          } else if (value === 'en_panne' || value === 'panne' || value === 'ouvert' || value === 'critique' || value === 'en_cours') {
                            cellClass = 'text-error';
                          } else if (value === 'maintenance' || value === 'en_traitement' || value === 'élevée') {
                            cellClass = 'text-warning';
                          }
                        } else if (column.accessor === 'cout' || column.accessor === 'cout_licence') {
                          cellClass = 'font-semibold text-primary';
                        } else if (column.accessor === 'severite') {
                          if (value === 'critique') cellClass = 'text-error font-bold';
                          else if (value === 'élevée') cellClass = 'text-warning font-semibold';
                          else if (value === 'moyenne') cellClass = 'text-info';
                        } else if (column.accessor === 'is_active') {
                          cellClass = value === true || value === 'true' || value === 'actif' ? 'text-success' : 'text-error';
                        } else if (column.accessor === 'priorite') {
                          if (value === 'haute') cellClass = 'text-error font-bold';
                          else if (value === 'moyenne') cellClass = 'text-warning';
                          else if (value === 'basse') cellClass = 'text-success';
                        }
                        
                        return (
                          <td key={colIndex} className={cellClass}>
                            {formattedValue}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Résumé du tableau */}
          <div className="p-4 border-t border-base-300 bg-base-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="text-sm text-base-content opacity-70">
                Affichage de <span className="font-semibold">{Math.min(getFilteredData().length, 100)}</span> sur <span className="font-semibold">{getFilteredData().length}</span> éléments • 
                <span className="ml-2">{getTableColumns().length} colonnes affichées</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="badge badge-success badge-xs"></span>
                  <span className="text-xs">Actif/Terminé</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-error badge-xs"></span>
                  <span className="text-xs">En cours/Problème</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-xs"></span>
                  <span className="text-xs">Maintenance/Traitement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-figure text-primary">
            <Monitor className="h-8 w-8" />
          </div>
          <div className="stat-title">Matériels</div>
          <div className="stat-value">{statsGenerales.total_materiels || 0}</div>
          <div className="stat-desc">
            {statsGenerales.materiels_fonctionnels || 0} fonctionnels • {statsGenerales.materiels_en_panne || 0} en panne
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-figure text-success">
            <Package className="h-8 w-8" />
          </div>
          <div className="stat-title">Logiciels</div>
          <div className="stat-value">{statsGenerales.total_logiciels || 0}</div>
          <div className="stat-desc">
            {statsGenerales.logiciels_actifs || 0} actifs • {data.logiciels.filter(l => l.date_expiration).length} avec expiration
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-figure text-secondary">
            <Network className="h-8 w-8" />
          </div>
          <div className="stat-title">Réseau</div>
          <div className="stat-value">{statsGenerales.total_equipements_reseau || 0}</div>
          <div className="stat-desc">
            {data.reseau.filter(r => r.etat === 'actif').length} actifs
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-figure text-warning">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="stat-title">Incidents</div>
          <div className="stat-value">{statsGenerales.incidents_ouverts || 0}</div>
          <div className="stat-desc">
            Ouverts • Total: {statsGenerales.incidents_total || 0}
          </div>
        </div>
      </div>

      {/* Deuxième ligne de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-figure text-accent">
            <Wrench className="h-8 w-8" />
          </div>
          <div className="stat-title">Réparations</div>
          <div className="stat-value">{statsGenerales.reparations_total || 0}</div>
          <div className="stat-desc">
            Coût: {formatCurrency(statsGenerales.cout_total_reparations || 0)}
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-figure text-error">
            <Bell className="h-8 w-8" />
          </div>
          <div className="stat-title">Alertes</div>
          <div className="stat-value">{statsGenerales.alertes_actives || 0}</div>
          <div className="stat-desc">
            Actives • Total: {statsGenerales.alertes_total || 0}
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-figure text-info">
            <Users className="h-8 w-8" />
          </div>
          <div className="stat-title">Fournisseurs</div>
          <div className="stat-value">{statsGenerales.total_fournisseurs || 0}</div>
          <div className="stat-desc">
            Partenaires et contacts
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-figure text-neutral">
            <User className="h-8 w-8" />
          </div>
          <div className="stat-title">Utilisateurs</div>
          <div className="stat-value">{statsGenerales.total_utilisateurs || 0}</div>
          <div className="stat-desc">
            Utilisateurs du système
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rapports;