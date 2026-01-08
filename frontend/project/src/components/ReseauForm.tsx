





// import React, { useState, useEffect } from 'react';
// import { X, Network, Wifi, Server, Monitor, Smartphone, Router, Cpu, Printer, Camera, Database } from 'lucide-react';

// interface ReseauFormData {
//   materiel: string;
//   adresse_ip: string;
//   nom_hote: string;
//   sous_reseau: string;
//   passerelle: string;
//   type_equipement: string;
//   statut_connexion: string;
// }

// interface Materiel {
//   id: string;
//   nom: string;
//   reference: string;
//   etat: string;
//   service_attribue: string;
// }

// interface ReseauFormProps {
//   isOpen: boolean;
//   configuration?: any;
//   materiels: Materiel[];
//   onSubmit: (configuration: ReseauFormData) => void;
//   onClose: () => void;
// }

// export default function ReseauForm({ 
//   isOpen, 
//   configuration, 
//   materiels, 
//   onSubmit, 
//   onClose 
// }: ReseauFormProps) {
//   const [formData, setFormData] = useState<ReseauFormData>({
//     materiel: '',
//     adresse_ip: '',
//     nom_hote: '',
//     sous_reseau: '255.255.255.0',
//     passerelle: '',
//     type_equipement: 'poste',
//     statut_connexion: 'connecte'
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [suggestedType, setSuggestedType] = useState<string>('poste');
//   const [autoDetectType, setAutoDetectType] = useState<boolean>(true); // Toggle activé par défaut

//   useEffect(() => {
//     if (configuration) {
//       setFormData({
//         materiel: configuration.materiel || '',
//         adresse_ip: configuration.adresse_ip || '',
//         nom_hote: configuration.nom_hote || '',
//         sous_reseau: configuration.sous_reseau || '255.255.255.0',
//         passerelle: configuration.passerelle || '',
//         type_equipement: configuration.type_equipement || 'poste',
//         statut_connexion: configuration.statut_connexion || 'connecte'
//       });
//       // Si on modifie une config existante, on désactive l'auto-détection par défaut
//       setAutoDetectType(false);
//     } else {
//       setFormData({
//         materiel: '',
//         adresse_ip: '',
//         nom_hote: '',
//         sous_reseau: '255.255.255.0',
//         passerelle: '',
//         type_equipement: 'poste',
//         statut_connexion: 'connecte'
//       });
//       // Pour une nouvelle config, on active l'auto-détection
//       setAutoDetectType(true);
//     }
//     setErrors({});
//   }, [configuration, isOpen]);

//   // Fonction pour détecter automatiquement le type d'équipement
//   const detectEquipmentType = (materiel: Materiel): string => {
//     const nomMateriel = materiel.nom.toLowerCase();
//     const referenceMateriel = materiel.reference?.toLowerCase() || '';

//     // Ordinateurs et postes de travail
//     if (nomMateriel.includes('ordinateur') || nomMateriel.includes('pc') || 
//         nomMateriel.includes('laptop') || nomMateriel.includes('portable') ||
//         nomMateriel.includes('desktop') || nomMateriel.includes('station')) {
//       return 'poste';
//     }
    
//     // Serveurs
//     if (nomMateriel.includes('serveur') || nomMateriel.includes('server') ||
//         referenceMateriel.includes('srv') || referenceMateriel.includes('server')) {
//       return 'serveur';
//     }
    
//     // Téléphones et mobiles
//     if (nomMateriel.includes('smartphone') || nomMateriel.includes('mobile') || 
//         nomMateriel.includes('phone') || nomMateriel.includes('téléphone') ||
//         nomMateriel.includes('tablette') || nomMateriel.includes('tablet')) {
//       return 'mobile';
//     }
    
//     // Routeurs
//     if (nomMateriel.includes('routeur') || nomMateriel.includes('router') ||
//         referenceMateriel.includes('rt') || referenceMateriel.includes('router')) {
//       return 'routeur';
//     }
    
//     // Switches
//     if (nomMateriel.includes('switch') || nomMateriel.includes('commutateur') ||
//         referenceMateriel.includes('sw') || referenceMateriel.includes('switch')) {
//       return 'switch';
//     }
    
//     // WiFi et points d'accès
//     if (nomMateriel.includes('wifi') || nomMateriel.includes('wi-fi') ||
//         nomMateriel.includes('point d\'accès') || nomMateriel.includes('access point') ||
//         nomMateriel.includes('ap') || referenceMateriel.includes('ap')) {
//       return 'wifi';
//     }
    
//     // Imprimantes
//     if (nomMateriel.includes('imprimante') || nomMateriel.includes('printer') ||
//         nomMateriel.includes('imp') || referenceMateriel.includes('prn')) {
//       return 'imprimante';
//     }
    
//     // Caméras
//     if (nomMateriel.includes('caméra') || nomMateriel.includes('camera') ||
//         nomMateriel.includes('cam') || referenceMateriel.includes('cam')) {
//       return 'camera';
//     }
    
//     // IoT et capteurs
//     if (nomMateriel.includes('iot') || nomMateriel.includes('capteur') ||
//         nomMateriel.includes('sensor') || nomMateriel.includes('internet des objets')) {
//       return 'iot';
//     }
    
//     // Téléphonie IP
//     if (nomMateriel.includes('voip') || nomMateriel.includes('téléphonie ip') ||
//         nomMateriel.includes('ip phone') || referenceMateriel.includes('voip')) {
//       return 'voip';
//     }
    
//     // NAS et stockage
//     if (nomMateriel.includes('nas') || nomMateriel.includes('serveur de stockage') ||
//         nomMateriel.includes('stockage') || referenceMateriel.includes('nas')) {
//       return 'nas';
//     }
    
//     // Par défaut : poste de travail
//     return 'poste';
//   };

//   // Toggle pour activer/désactiver l'auto-détection
//   const toggleAutoDetect = () => {
//     const newState = !autoDetectType;
//     setAutoDetectType(newState);
    
//     // Si on active l'auto-détection et qu'un matériel est sélectionné, on met à jour le type
//     if (newState && formData.materiel) {
//       const selectedMateriel = materiels.find(m => m.id === formData.materiel);
//       if (selectedMateriel) {
//         const detectedType = detectEquipmentType(selectedMateriel);
//         setSuggestedType(detectedType);
//         setFormData(prev => ({ ...prev, type_equipement: detectedType }));
//       }
//     }
//   };

//   // Fonction pour filtrer les matériels qui peuvent gérer un réseau
//   const getMaterielsReseau = () => {
//     return materiels.filter(materiel => {
//       const nomMateriel = materiel.nom.toLowerCase();
//       const referenceMateriel = materiel.reference?.toLowerCase() || '';
      
//       // Liste des mots-clés pour les équipements réseau
//       const motsClesReseau = [
//         'ordinateur', 'pc', 'laptop', 'portable', 'desktop', 'station', 'serveur', 'server',
//         'smartphone', 'mobile', 'phone', 'téléphone', 'tablette', 'tablet',
//         'routeur', 'router', 'switch', 'commutateur', 'firewall', 'pare-feu',
//         'point d\'accès', 'access point', 'ap', 'wifi', 'wi-fi',
//         'modem', 'nas', 'serveur de stockage',
//         'camera', 'caméra', 'ip camera', 'caméra ip',
//         'imprimante', 'printer',
//         'iot', 'internet des objets', 'capteur', 'sensor',
//         'voip', 'téléphonie ip', 'ip phone'
//       ];
      
//       return motsClesReseau.some(motCle => 
//         nomMateriel.includes(motCle) || referenceMateriel.includes(motCle)
//       );
//     });
//   };

//   // Vérifier le type de matériel sélectionné pour afficher l'icône appropriée
//   const getMaterielIcon = (materiel: Materiel | undefined) => {
//     if (!materiel) return <Network className="w-4 h-4" />;
    
//     const nomMateriel = materiel.nom.toLowerCase();
    
//     if (nomMateriel.includes('ordinateur') || nomMateriel.includes('pc') || 
//         nomMateriel.includes('laptop') || nomMateriel.includes('portable') ||
//         nomMateriel.includes('desktop') || nomMateriel.includes('station')) {
//       return <Monitor className="w-4 h-4" />;
//     }
    
//     if (nomMateriel.includes('serveur') || nomMateriel.includes('server')) {
//       return <Server className="w-4 h-4" />;
//     }
    
//     if (nomMateriel.includes('smartphone') || nomMateriel.includes('mobile') || 
//         nomMateriel.includes('phone') || nomMateriel.includes('téléphone') ||
//         nomMateriel.includes('tablette') || nomMateriel.includes('tablet')) {
//       return <Smartphone className="w-4 h-4" />;
//     }
    
//     if (nomMateriel.includes('routeur') || nomMateriel.includes('router')) {
//       return <Router className="w-4 h-4" />;
//     }
    
//     if (nomMateriel.includes('switch') || nomMateriel.includes('commutateur')) {
//       return <Network className="w-4 h-4" />;
//     }
    
//     if (nomMateriel.includes('wifi') || nomMateriel.includes('wi-fi') ||
//         nomMateriel.includes('point d\'accès') || nomMateriel.includes('access point') ||
//         nomMateriel.includes('ap')) {
//       return <Wifi className="w-4 h-4" />;
//     }
    
//     if (nomMateriel.includes('imprimante') || nomMateriel.includes('printer')) {
//       return <Printer className="w-4 h-4" />;
//     }
    
//     if (nomMateriel.includes('caméra') || nomMateriel.includes('camera')) {
//       return <Camera className="w-4 h-4" />;
//     }
    
//     if (nomMateriel.includes('iot') || nomMateriel.includes('capteur') ||
//         nomMateriel.includes('sensor') || nomMateriel.includes('internet des objets')) {
//       return <Cpu className="w-4 h-4" />;
//     }
    
//     if (nomMateriel.includes('nas') || nomMateriel.includes('serveur de stockage') ||
//         nomMateriel.includes('stockage')) {
//       return <Database className="w-4 h-4" />;
//     }
    
//     return <Network className="w-4 h-4" />;
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.materiel) {
//       newErrors.materiel = 'Le matériel est requis';
//     }
//     if (!formData.adresse_ip) {
//       newErrors.adresse_ip = 'L\'adresse IP est requise';
//     } else if (!isValidIP(formData.adresse_ip)) {
//       newErrors.adresse_ip = 'Adresse IP invalide';
//     }
//     if (!formData.nom_hote.trim()) {
//       newErrors.nom_hote = 'Le nom d\'hôte est requis';
//     }
//     if (formData.passerelle && !isValidIP(formData.passerelle)) {
//       newErrors.passerelle = 'Passerelle invalide';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const isValidIP = (ip: string): boolean => {
//     const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
//     if (!ipRegex.test(ip)) return false;
    
//     const parts = ip.split('.');
//     return parts.every(part => {
//       const num = parseInt(part, 10);
//       return num >= 0 && num <= 255;
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       onSubmit(formData);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'materiel' && value) {
//       const selectedMateriel = materiels.find(m => m.id === value);
//       if (selectedMateriel) {
//         // Détecter automatiquement le type d'équipement
//         const detectedType = detectEquipmentType(selectedMateriel);
//         setSuggestedType(detectedType);
        
//         // Si l'auto-détection est activée, mettre à jour le type
//         if (autoDetectType) {
//           setFormData(prev => ({ 
//             ...prev, 
//             [name]: value,
//             type_equipement: detectedType 
//           }));
//           return;
//         }
//       }
//     }
    
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   // Fonction pour formater l'affichage du type
//   const getTypeDisplay = (type: string) => {
//     switch (type) {
//       case 'poste': return '💻 Poste de travail';
//       case 'serveur': return '🖥️ Serveur';
//       case 'mobile': return '📱 Mobile/Smartphone';
//       case 'imprimante': return '🖨️ Imprimante réseau';
//       case 'switch': return '🔀 Switch/Commutateur';
//       case 'routeur': return '🌐 Routeur';
//       case 'wifi': return '📶 Point d\'accès WiFi';
//       case 'camera': return '📹 Caméra IP';
//       case 'iot': return '🤖 Appareil IoT/Capteur';
//       case 'voip': return '📞 Téléphonie IP';
//       case 'nas': return '💾 NAS/Serveur de stockage';
//       default: return '💻 Poste de travail';
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       materiel: '',
//       adresse_ip: '',
//       nom_hote: '',
//       sous_reseau: '255.255.255.0',
//       passerelle: '',
//       type_equipement: 'poste',
//       statut_connexion: 'connecte'
//     });
//     setErrors({});
//     setAutoDetectType(true);
//     onClose();
//   };

//   const materielsReseau = getMaterielsReseau();
//   const selectedMateriel = materiels.find(m => m.id === formData.materiel);
//   const materielIcon = getMaterielIcon(selectedMateriel);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center p-6 border-b border-base-300">
//           <div className="flex items-center gap-2">
//             <Network className="w-6 h-6 text-success" />
//             <h2 className="text-xl font-bold text-base-content">
//               {configuration ? 'Modifier la configuration réseau' : 'Nouvelle configuration réseau'}
//             </h2>
//           </div>
//           <button
//             onClick={handleClose}
//             className="btn btn-ghost btn-sm btn-circle"
//             type="button"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* Section d'information simplifiée */}
//           <div className="alert alert-info p-3">
//             <div className="text-sm">
//               <strong>💡 Sélectionnez un matériel pour détecter automatiquement son type</strong>
//               <p className="mt-1">Le type d'équipement sera suggéré automatiquement, vous pourrez l'ajuster si nécessaire.</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Matériel réseau *</span>
//               </label>
//               <select
//                 name="materiel"
//                 value={formData.materiel}
//                 onChange={handleChange}
//                 className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
//               >
//                 <option value="">Sélectionnez un équipement...</option>
//                 {materielsReseau.map((materiel) => {
//                   const icon = getMaterielIcon(materiel);
//                   return (
//                     <option key={materiel.id} value={materiel.id}>
//                       {icon && <span className="mr-2 inline-block">{icon}</span>}
//                       {materiel.nom} ({materiel.reference})
//                     </option>
//                   );
//                 })}
//               </select>
//               {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
              
//               <div className="mt-2 text-xs text-base-content/60">
//                 {materielsReseau.length} équipement(s) réseau disponible(s)
//               </div>
//             </div>

//             {/* CHAMP TYPE D'ÉQUIPEMENT AVEC TOGGLE AUTO-DÉTECTION */}
//             <div className="form-control">
//               <label className="label">
//                 <div className="flex items-center gap-2">
//                   <span className="label-text font-semibold">Type d'équipement *</span>
//                   <div className="flex items-center gap-1">
//                     <input
//                       type="checkbox"
//                       checked={autoDetectType}
//                       onChange={toggleAutoDetect}
//                       className="checkbox checkbox-xs"
//                     />
//                     <span className="text-xs opacity-70">Détection auto</span>
//                   </div>
//                 </div>
//               </label>
              
//               <select
//                 name="type_equipement"
//                 value={formData.type_equipement}
//                 onChange={handleChange}
//                 className="select select-bordered w-full"
//                 disabled={autoDetectType}
//                 title={autoDetectType ? "Type détecté automatiquement" : "Sélection manuelle"}
//               >
//                 <option value="poste">💻 Poste de travail</option>
//                 <option value="serveur">🖥️ Serveur</option>
//                 <option value="mobile">📱 Mobile/Smartphone</option>
//                 <option value="imprimante">🖨️ Imprimante réseau</option>
//                 <option value="switch">🔀 Switch/Commutateur</option>
//                 <option value="routeur">🌐 Routeur</option>
//                 <option value="wifi">📶 Point d'accès WiFi</option>
//                 <option value="camera">📹 Caméra IP</option>
//                 <option value="iot">🤖 Appareil IoT/Capteur</option>
//                 <option value="voip">📞 Téléphonie IP</option>
//                 <option value="nas">💾 NAS/Serveur de stockage</option>
//               </select>
              
//               {/* Afficher l'info de détection automatique */}
//               {autoDetectType && selectedMateriel && (
//                 <div className="text-xs text-info mt-1">
//                   ⓘ Type détecté: {getTypeDisplay(suggestedType)}
//                 </div>
//               )}
              
//               {/* Bouton pour utiliser le type détecté si on est en mode manuel */}
//               {!autoDetectType && selectedMateriel && formData.type_equipement !== suggestedType && (
//                 <div className="mt-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setFormData(prev => ({ ...prev, type_equipement: suggestedType }));
//                       // Optionnel: réactiver l'auto-détection
//                       setAutoDetectType(true);
//                     }}
//                     className="btn btn-xs btn-outline btn-info"
//                   >
//                     Utiliser le type détecté: {getTypeDisplay(suggestedType)}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Adresse IP et Nom d'hôte */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Adresse IP *</span>
//               </label>
//               <input
//                 type="text"
//                 name="adresse_ip"
//                 value={formData.adresse_ip}
//                 onChange={handleChange}
//                 className={`input input-bordered w-full ${errors.adresse_ip ? 'input-error' : ''}`}
//                 placeholder="192.168.1.100"
//               />
//               {errors.adresse_ip && <span className="text-error text-sm mt-1">{errors.adresse_ip}</span>}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Nom d'hôte *</span>
//               </label>
//               <input
//                 type="text"
//                 name="nom_hote"
//                 value={formData.nom_hote}
//                 onChange={handleChange}
//                 className={`input input-bordered w-full ${errors.nom_hote ? 'input-error' : ''}`}
//                 placeholder="PC-001"
//               />
//               {errors.nom_hote && <span className="text-error text-sm mt-1">{errors.nom_hote}</span>}
//             </div>
//           </div>

//           {/* Sous-réseau et Passerelle */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Masque de sous-réseau</span>
//               </label>
//               <select
//                 name="sous_reseau"
//                 value={formData.sous_reseau}
//                 onChange={handleChange}
//                 className="select select-bordered w-full"
//               >
//                 <option value="255.255.255.0">255.255.255.0 (/24) - Standard</option>
//                 <option value="255.255.0.0">255.255.0.0 (/16)</option>
//                 <option value="255.255.255.128">255.255.255.128 (/25)</option>
//                 <option value="255.255.255.192">255.255.255.192 (/26)</option>
//                 <option value="255.255.255.224">255.255.255.224 (/27)</option>
//                 <option value="255.255.255.240">255.255.255.240 (/28)</option>
//                 <option value="255.255.255.248">255.255.255.248 (/29)</option>
//                 <option value="255.255.255.252">255.255.255.252 (/30)</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Passerelle par défaut</span>
//               </label>
//               <input
//                 type="text"
//                 name="passerelle"
//                 value={formData.passerelle}
//                 onChange={handleChange}
//                 className={`input input-bordered w-full ${errors.passerelle ? 'input-error' : ''}`}
//                 placeholder="192.168.1.1"
//               />
//               {errors.passerelle && <span className="text-error text-sm mt-1">{errors.passerelle}</span>}
//             </div>
//           </div>

//           {/* Statut connexion */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-semibold">Statut de connexion</span>
//             </label>
//             <select
//               name="statut_connexion"
//               value={formData.statut_connexion}
//               onChange={handleChange}
//               className="select select-bordered w-full"
//             >
//               <option value="connecte">✅ Connecté au réseau</option>
//               <option value="deconnecte">❌ Déconnecté du réseau</option>
//               <option value="instable">⚠️ Connexion instable</option>
//               <option value="maintenance">🔧 En maintenance</option>
//             </select>
//           </div>

//           {/* Informations rapides du matériel */}
//           {selectedMateriel && (
//             <div className="bg-base-200 rounded-lg p-3">
//               <div className="flex items-center gap-2 mb-2">
//                 {materielIcon}
//                 <span className="font-medium">{selectedMateriel.nom}</span>
//                 <span className="badge badge-sm">{selectedMateriel.etat}</span>
//               </div>
//               <div className="text-sm">
//                 <span className="opacity-70">Référence:</span> {selectedMateriel.reference}
//                 {selectedMateriel.service_attribue && (
//                   <>
//                     <span className="mx-2">•</span>
//                     <span className="opacity-70">Service:</span> {selectedMateriel.service_attribue}
//                   </>
//                 )}
//               </div>
//               {autoDetectType && (
//                 <div className="mt-2 text-xs text-info flex items-center gap-1">
//                   <span>ⓘ Type détecté: {getTypeDisplay(suggestedType)}</span>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Boutons d'action simplifiés */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="btn btn-outline flex-1"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary flex-1"
//               disabled={!formData.materiel || !formData.adresse_ip || !formData.nom_hote}
//             >
//               {configuration ? 'Modifier' : 'Configurer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }









import React, { useState, useEffect } from 'react';
import { X, Network, Wifi, Server, Monitor, Smartphone, Router, Cpu, Printer, Camera, Database } from 'lucide-react';

interface ReseauFormData {
  materiel: string;
  adresse_ip: string;
  nom_hote: string;
  sous_reseau: string;
  passerelle: string;
  type_equipement: string;
  statut_connexion: string;
}

interface Materiel {
  id: string;
  nom: string;
  reference: string;
  etat: string;
  service_attribue: string;
}

interface ReseauFormProps {
  isOpen: boolean;
  configuration?: any;
  materiels: Materiel[];
  onSubmit: (configuration: ReseauFormData) => void;
  onClose: () => void;
}

export default function ReseauForm({ 
  isOpen, 
  configuration, 
  materiels, 
  onSubmit, 
  onClose 
}: ReseauFormProps) {
  const [formData, setFormData] = useState<ReseauFormData>({
    materiel: '',
    adresse_ip: '',
    nom_hote: '',
    sous_reseau: '255.255.255.0',
    passerelle: '',
    type_equipement: 'poste',
    statut_connexion: 'connecte'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestedType, setSuggestedType] = useState<string>('poste');
  const [autoDetectType, setAutoDetectType] = useState<boolean>(true);

  useEffect(() => {
    if (configuration) {
      setFormData({
        materiel: configuration.materiel || '',
        adresse_ip: configuration.adresse_ip || '',
        nom_hote: configuration.nom_hote || '',
        sous_reseau: configuration.sous_reseau || '255.255.255.0',
        passerelle: configuration.passerelle || '',
        type_equipement: configuration.type_equipement || 'poste',
        statut_connexion: configuration.statut_connexion || 'connecte'
      });
      // Si c'est une modification, garder l'auto-détection activée
      setAutoDetectType(true);
    } else {
      setFormData({
        materiel: '',
        adresse_ip: '',
        nom_hote: '',
        sous_reseau: '255.255.255.0',
        passerelle: '',
        type_equipement: 'poste',
        statut_connexion: 'connecte'
      });
      setAutoDetectType(true);
    }
    setErrors({});
  }, [configuration, isOpen]);

  // Fonction améliorée pour détecter automatiquement le type d'équipement
  const detectEquipmentType = (materiel: Materiel): string => {
    const nomMateriel = materiel.nom.toLowerCase();
    const referenceMateriel = materiel.reference?.toLowerCase() || '';

    // ORDINATEURS & POSTES DE TRAVAIL
    if (nomMateriel.includes('ordinateur') || nomMateriel.includes('pc ') || 
        nomMateriel.includes(' laptop') || nomMateriel.includes('portable') ||
        nomMateriel.includes('desktop') || nomMateriel.includes('station') ||
        nomMateriel.includes('workstation') || referenceMateriel.includes('pc-') ||
        referenceMateriel.includes('laptop') || referenceMateriel.includes('desktop')) {
      return 'poste';
    }
    
    // SERVEURS
    if (nomMateriel.includes('serveur') || nomMateriel.includes('server') ||
        referenceMateriel.includes('srv-') || referenceMateriel.includes('server') ||
        referenceMateriel.includes('dl') || referenceMateriel.includes('poweredge') ||
        nomMateriel.includes('proliant') || nomMateriel.includes('dell poweredge') ||
        nomMateriel.includes('hp proliant')) {
      return 'serveur';
    }
    
    // MOBILES & SMARTPHONES
    if (nomMateriel.includes('smartphone') || nomMateriel.includes('mobile') || 
        nomMateriel.includes('phone') || nomMateriel.includes('téléphone') ||
        nomMateriel.includes('tablette') || nomMateriel.includes('tablet') ||
        nomMateriel.includes('iphone') || nomMateriel.includes('samsung') ||
        nomMateriel.includes('huawei') || nomMateriel.includes('xiaomi') ||
        referenceMateriel.includes('iphone') || referenceMateriel.includes('galaxy')) {
      return 'mobile';
    }
    
    // ROUTEURS
    if (nomMateriel.includes('routeur') || nomMateriel.includes('router') ||
        referenceMateriel.includes('rt-') || referenceMateriel.includes('router') ||
        referenceMateriel.includes('asr') || referenceMateriel.includes('isr') ||
        nomMateriel.includes('cisco') || nomMateriel.includes('juniper') ||
        nomMateriel.includes('fortigate') || nomMateriel.includes('palo alto')) {
      return 'routeur';
    }
    
    // SWITCHES - CORRECTION ICI
    if (nomMateriel.includes('switch') || nomMateriel.includes('commutateur') ||
        referenceMateriel.includes('sw-') || referenceMateriel.includes('switch') ||
        referenceMateriel.includes('ws-') || referenceMateriel.includes('catalyst') ||
        referenceMateriel.includes('nexus') || nomMateriel.includes('catalyst') ||
        nomMateriel.includes('nexus') || nomMateriel.includes('hp procurve') ||
        nomMateriel.includes('aruba switch') || nomMateriel.includes('comware')) {
      return 'switch';
    }
    
    // POINTS D'ACCÈS WIFI
    if (nomMateriel.includes('wifi') || nomMateriel.includes('wi-fi') ||
        nomMateriel.includes('point d\'accès') || nomMateriel.includes('access point') ||
        nomMateriel.includes('ap ') || referenceMateriel.includes('ap-') ||
        referenceMateriel.includes('wap') || referenceMateriel.includes('airo') ||
        nomMateriel.includes('unifi ap') || nomMateriel.includes('cisco ap') ||
        nomMateriel.includes('aruba ap')) {
      return 'wifi';
    }
    
    // IMPRIMANTES
    if (nomMateriel.includes('imprimante') || nomMateriel.includes('printer') ||
        nomMateriel.includes('imp ') || referenceMateriel.includes('prn-') ||
        referenceMateriel.includes('laserjet') || referenceMateriel.includes('deskjet') ||
        referenceMateriel.includes('officejet') || nomMateriel.includes('hp laserjet') ||
        nomMateriel.includes('canon pixma') || nomMateriel.includes('epson workforce')) {
      return 'imprimante';
    }
    
    // CAMÉRAS IP
    if (nomMateriel.includes('caméra') || nomMateriel.includes('camera') ||
        nomMateriel.includes('cam ') || referenceMateriel.includes('cam-') ||
        referenceMateriel.includes('ipc') || referenceMateriel.includes('dome') ||
        referenceMateriel.includes('bullet') || nomMateriel.includes('hikvision') ||
        nomMateriel.includes('dahua') || nomMateriel.includes('axis')) {
      return 'camera';
    }
    
    // APPAREILS IoT
    if (nomMateriel.includes('iot') || nomMateriel.includes('capteur') ||
        nomMateriel.includes('sensor') || nomMateriel.includes('internet des objets') ||
        nomMateriel.includes('raspberry') || nomMateriel.includes('arduino') ||
        nomMateriel.includes('esp32') || nomMateriel.includes('smart device') ||
        referenceMateriel.includes('pi-') || referenceMateriel.includes('iot-')) {
      return 'iot';
    }
    
    // TÉLÉPHONIE IP
    if (nomMateriel.includes('voip') || nomMateriel.includes('téléphonie ip') ||
        nomMateriel.includes('ip phone') || referenceMateriel.includes('voip') ||
        referenceMateriel.includes('ipp') || referenceMateriel.includes('yealink') ||
        referenceMateriel.includes('polycom') || nomMateriel.includes('cisco ip phone') ||
        nomMateriel.includes('yealink') || nomMateriel.includes('grandstream')) {
      return 'voip';
    }
    
    // NAS & STOCKAGE
    if (nomMateriel.includes('nas') || nomMateriel.includes('serveur de stockage') ||
        nomMateriel.includes('stockage') || referenceMateriel.includes('nas-') ||
        referenceMateriel.includes('synology') || referenceMateriel.includes('qnap') ||
        referenceMateriel.includes('netgear ready') || nomMateriel.includes('synology') ||
        nomMateriel.includes('qnap') || nomMateriel.includes('netapp')) {
      return 'nas';
    }
    
    // FIREWALLS
    if (nomMateriel.includes('firewall') || nomMateriel.includes('pare-feu') ||
        referenceMateriel.includes('fw-') || referenceMateriel.includes('asa') ||
        nomMateriel.includes('fortigate') || nomMateriel.includes('palo alto') ||
        nomMateriel.includes('checkpoint') || nomMateriel.includes('sophos')) {
      return 'routeur'; // On met dans routeur car c'est souvent combiné
    }
    
    // Par défaut : poste de travail
    return 'poste';
  };

  // Toggle pour activer/désactiver l'auto-détection
  const toggleAutoDetect = () => {
    const newState = !autoDetectType;
    setAutoDetectType(newState);
    
    // Si on active l'auto-détection et qu'un matériel est sélectionné, on met à jour le type
    if (newState && formData.materiel) {
      const selectedMateriel = materiels.find(m => m.id === formData.materiel);
      if (selectedMateriel) {
        const detectedType = detectEquipmentType(selectedMateriel);
        setSuggestedType(detectedType);
        setFormData(prev => ({ ...prev, type_equipement: detectedType }));
      }
    }
  };

  // Fonction pour filtrer les matériels qui peuvent gérer un réseau
  const getMaterielsReseau = () => {
    return materiels.filter(materiel => {
      const nomMateriel = materiel.nom.toLowerCase();
      const referenceMateriel = materiel.reference?.toLowerCase() || '';
      
      // Liste des mots-clés pour les équipements réseau
      const motsClesReseau = [
        'ordinateur', 'pc', 'laptop', 'portable', 'desktop', 'station', 'workstation',
        'serveur', 'server', 'srv', 'proliant', 'poweredge',
        'smartphone', 'mobile', 'phone', 'téléphone', 'tablette', 'tablet', 'iphone',
        'routeur', 'router', 'rt', 'cisco', 'juniper', 'fortigate',
        'switch', 'commutateur', 'sw', 'catalyst', 'nexus',
        'firewall', 'pare-feu', 'fw', 'asa',
        'point d\'accès', 'access point', 'ap', 'wifi', 'wi-fi', 'unifi',
        'modem', 'nas', 'synology', 'qnap',
        'camera', 'caméra', 'ip camera', 'caméra ip', 'hikvision',
        'imprimante', 'printer', 'imp', 'laserjet',
        'iot', 'internet des objets', 'capteur', 'sensor', 'raspberry',
        'voip', 'téléphonie ip', 'ip phone', 'yealink'
      ];
      
      return motsClesReseau.some(motCle => 
        nomMateriel.includes(motCle) || referenceMateriel.includes(motCle)
      );
    });
  };

  // Vérifier le type de matériel sélectionné pour afficher l'icône appropriée
  const getMaterielIcon = (materiel: Materiel | undefined) => {
    if (!materiel) return <Network className="w-4 h-4" />;
    
    const type = detectEquipmentType(materiel);
    
    switch (type) {
      case 'poste':
        return <Monitor className="w-4 h-4" />;
      case 'serveur':
        return <Server className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'routeur':
        return <Router className="w-4 h-4" />;
      case 'switch':
        return <Network className="w-4 h-4" />;
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'imprimante':
        return <Printer className="w-4 h-4" />;
      case 'camera':
        return <Camera className="w-4 h-4" />;
      case 'iot':
        return <Cpu className="w-4 h-4" />;
      case 'nas':
        return <Database className="w-4 h-4" />;
      default:
        return <Network className="w-4 h-4" />;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.materiel) {
      newErrors.materiel = 'Le matériel est requis';
    }
    if (!formData.adresse_ip) {
      newErrors.adresse_ip = 'L\'adresse IP est requise';
    } else if (!isValidIP(formData.adresse_ip)) {
      newErrors.adresse_ip = 'Adresse IP invalide';
    }
    if (!formData.nom_hote.trim()) {
      newErrors.nom_hote = 'Le nom d\'hôte est requis';
    }
    if (formData.passerelle && !isValidIP(formData.passerelle)) {
      newErrors.passerelle = 'Passerelle invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidIP = (ip: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'materiel' && value) {
      const selectedMateriel = materiels.find(m => m.id === value);
      if (selectedMateriel) {
        // Détecter automatiquement le type d'équipement
        const detectedType = detectEquipmentType(selectedMateriel);
        setSuggestedType(detectedType);
        
        // Si l'auto-détection est activée, mettre à jour le type automatiquement
        if (autoDetectType) {
          setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            type_equipement: detectedType 
          }));
          return;
        }
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Fonction pour formater l'affichage du type
  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'poste': return '💻 Poste de travail';
      case 'serveur': return '🖥️ Serveur';
      case 'mobile': return '📱 Mobile/Smartphone';
      case 'imprimante': return '🖨️ Imprimante réseau';
      case 'switch': return '🔀 Switch/Commutateur';
      case 'routeur': return '🌐 Routeur';
      case 'wifi': return '📶 Point d\'accès WiFi';
      case 'camera': return '📹 Caméra IP';
      case 'iot': return '🤖 Appareil IoT/Capteur';
      case 'voip': return '📞 Téléphonie IP';
      case 'nas': return '💾 NAS/Serveur de stockage';
      default: return '💻 Poste de travail';
    }
  };

  const handleClose = () => {
    setFormData({
      materiel: '',
      adresse_ip: '',
      nom_hote: '',
      sous_reseau: '255.255.255.0',
      passerelle: '',
      type_equipement: 'poste',
      statut_connexion: 'connecte'
    });
    setErrors({});
    setAutoDetectType(true);
    onClose();
  };

  const materielsReseau = getMaterielsReseau();
  const selectedMateriel = materiels.find(m => m.id === formData.materiel);
  const materielIcon = getMaterielIcon(selectedMateriel);

  // Vérifier si le type actuel correspond au type détecté
  const isTypeCorrect = selectedMateriel && formData.type_equipement === detectEquipmentType(selectedMateriel);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-success" />
            <h2 className="text-xl font-bold text-base-content">
              {configuration ? 'Modifier la configuration réseau' : 'Nouvelle configuration réseau'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Section d'information */}
          <div className="alert alert-info p-3">
            <div className="text-sm">
              <strong>💡 Sélection automatique du type</strong>
              <p className="mt-1">Le type d'équipement est automatiquement détecté en fonction du matériel sélectionné (switch → switch, ordinateur → poste, etc.).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Matériel réseau *</span>
              </label>
              <select
                name="materiel"
                value={formData.materiel}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.materiel ? 'select-error' : ''}`}
              >
                <option value="">Sélectionnez un équipement...</option>
                {materielsReseau.map((materiel) => {
                  const icon = getMaterielIcon(materiel);
                  const type = detectEquipmentType(materiel);
                  return (
                    <option key={materiel.id} value={materiel.id}>
                      {icon && <span className="mr-2 inline-block">{icon}</span>}
                      {materiel.nom} ({materiel.reference}) - {getTypeDisplay(type)}
                    </option>
                  );
                })}
              </select>
              {errors.materiel && <span className="text-error text-sm mt-1">{errors.materiel}</span>}
              
              <div className="mt-2 text-xs text-base-content/60">
                {materielsReseau.length} équipement(s) réseau disponible(s)
              </div>
            </div>

            {/* CHAMP TYPE D'ÉQUIPEMENT */}
            <div className="form-control">
              <label className="label">
                <div className="flex items-center justify-between w-full">
                  <span className="label-text font-semibold">Type d'équipement *</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={autoDetectType}
                      onChange={toggleAutoDetect}
                      className="checkbox checkbox-xs"
                    />
                    <span className="text-xs opacity-70">Auto-détection</span>
                  </div>
                </div>
              </label>
              
              <select
                name="type_equipement"
                value={formData.type_equipement}
                onChange={handleChange}
                className="select select-bordered w-full"
                disabled={autoDetectType}
                title={autoDetectType ? "Type détecté automatiquement" : "Sélection manuelle"}
              >
                <option value="poste">💻 Poste de travail</option>
                <option value="serveur">🖥️ Serveur</option>
                <option value="mobile">📱 Mobile/Smartphone</option>
                <option value="imprimante">🖨️ Imprimante réseau</option>
                <option value="switch">🔀 Switch/Commutateur</option>
                <option value="routeur">🌐 Routeur</option>
                <option value="wifi">📶 Point d'accès WiFi</option>
                <option value="camera">📹 Caméra IP</option>
                <option value="iot">🤖 Appareil IoT/Capteur</option>
                <option value="voip">📞 Téléphonie IP</option>
                <option value="nas">💾 NAS/Serveur de stockage</option>
              </select>
              
              {/* Afficher l'info de détection automatique */}
              {autoDetectType && selectedMateriel && (
                <div className="text-xs text-success mt-1 flex items-center gap-1">
                  <span>✓</span>
                  <span>Type détecté automatiquement: <strong>{getTypeDisplay(suggestedType)}</strong></span>
                </div>
              )}
              
              {/* Avertissement si le type manuel ne correspond pas au type détecté */}
              {!autoDetectType && selectedMateriel && !isTypeCorrect && (
                <div className="text-xs text-warning mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>
                    Type recommandé: <strong>{getTypeDisplay(suggestedType)}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, type_equipement: suggestedType }));
                        setAutoDetectType(true);
                      }}
                      className="ml-2 btn btn-xs btn-outline btn-warning"
                    >
                      Utiliser le type détecté
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Adresse IP et Nom d'hôte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Adresse IP *</span>
              </label>
              <input
                type="text"
                name="adresse_ip"
                value={formData.adresse_ip}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.adresse_ip ? 'input-error' : ''}`}
                placeholder="192.168.1.100"
              />
              {errors.adresse_ip && <span className="text-error text-sm mt-1">{errors.adresse_ip}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nom d'hôte *</span>
              </label>
              <input
                type="text"
                name="nom_hote"
                value={formData.nom_hote}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.nom_hote ? 'input-error' : ''}`}
                placeholder="PC-001"
              />
              {errors.nom_hote && <span className="text-error text-sm mt-1">{errors.nom_hote}</span>}
            </div>
          </div>

          {/* Sous-réseau et Passerelle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Masque de sous-réseau</span>
              </label>
              <select
                name="sous_reseau"
                value={formData.sous_reseau}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="255.255.255.0">255.255.255.0 (/24) - Standard</option>
                <option value="255.255.0.0">255.255.0.0 (/16)</option>
                <option value="255.255.255.128">255.255.255.128 (/25)</option>
                <option value="255.255.255.192">255.255.255.192 (/26)</option>
                <option value="255.255.255.224">255.255.255.224 (/27)</option>
                <option value="255.255.255.240">255.255.255.240 (/28)</option>
                <option value="255.255.255.248">255.255.255.248 (/29)</option>
                <option value="255.255.255.252">255.255.255.252 (/30)</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Passerelle par défaut</span>
              </label>
              <input
                type="text"
                name="passerelle"
                value={formData.passerelle}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.passerelle ? 'input-error' : ''}`}
                placeholder="192.168.1.1"
              />
              {errors.passerelle && <span className="text-error text-sm mt-1">{errors.passerelle}</span>}
            </div>
          </div>

          {/* Statut connexion */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Statut de connexion</span>
            </label>
            <select
              name="statut_connexion"
              value={formData.statut_connexion}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="connecte">✅ Connecté au réseau</option>
              <option value="deconnecte">❌ Déconnecté du réseau</option>
              <option value="instable">⚠️ Connexion instable</option>
              <option value="maintenance">🔧 En maintenance</option>
            </select>
          </div>

          {/* Informations détaillées du matériel */}
          {selectedMateriel && (
            <div className="bg-base-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                {materielIcon}
                <span className="font-medium">{selectedMateriel.nom}</span>
                <span className="badge badge-sm">{selectedMateriel.etat}</span>
                <span className="badge badge-sm badge-info">
                  {getTypeDisplay(detectEquipmentType(selectedMateriel))}
                </span>
              </div>
              <div className="text-sm">
                <span className="opacity-70">Référence:</span> {selectedMateriel.reference}
                {selectedMateriel.service_attribue && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="opacity-70">Service:</span> {selectedMateriel.service_attribue}
                  </>
                )}
              </div>
              {autoDetectType && (
                <div className="mt-2 text-xs text-success flex items-center gap-1">
                  <span>✓ Type automatiquement détecté: {getTypeDisplay(suggestedType)}</span>
                </div>
              )}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={!formData.materiel || !formData.adresse_ip || !formData.nom_hote}
            >
              {configuration ? 'Modifier' : 'Configurer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}