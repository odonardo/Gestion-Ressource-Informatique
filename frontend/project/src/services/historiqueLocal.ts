// // src/services/historiqueLocal.ts - SERVICE D'HISTORIQUE LOCAL
// import { useState, useEffect } from 'react';

// // Types
// export interface HistoriqueEntry {
//   id: number;
//   utilisateur: string;
//   action: string;
//   module: string;
//   details: string;
//   date: string;
//   ip_address?: string;
//   user_agent?: string;
// }

// // Stockage local avec IndexedDB ou localStorage
// const STORAGE_KEY = 'gestion_parc_historique';

// // Initialiser l'historique
// export const initHistoriqueLocal = () => {
//   if (typeof window === 'undefined') return;
  
//   const saved = localStorage.getItem(STORAGE_KEY);
//   if (!saved) {
//     // Données initiales
//     const initialData: HistoriqueEntry[] = [
//       {
//         id: 1,
//         utilisateur: 'admin',
//         action: 'CONNEXION',
//         module: 'Authentification',
//         details: 'Première connexion au système',
//         date: new Date().toISOString(),
//         ip_address: '192.168.1.1'
//       }
//     ];
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
//   }
// };

// // Obtenir l'historique
// export const getHistoriqueLocal = (): HistoriqueEntry[] => {
//   if (typeof window === 'undefined') return [];
  
//   try {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     return saved ? JSON.parse(saved) : [];
//   } catch (error) {
//     console.error('❌ Erreur lecture historique local:', error);
//     return [];
//   }
// };

// // Ajouter une entrée
// export const addHistoriqueEntry = (entry: Omit<HistoriqueEntry, 'id' | 'date'>): HistoriqueEntry => {
//   if (typeof window === 'undefined') {
//     return { ...entry, id: 0, date: new Date().toISOString() };
//   }
  
//   try {
//     const historique = getHistoriqueLocal();
//     const newEntry: HistoriqueEntry = {
//       ...entry,
//       id: historique.length > 0 ? Math.max(...historique.map(e => e.id)) + 1 : 1,
//       date: new Date().toISOString()
//     };
    
//     const newHistorique = [newEntry, ...historique.slice(0, 99)]; // Garder seulement les 100 dernières entrées
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistorique));
    
//     // Émettre un événement pour notifier les composants
//     window.dispatchEvent(new CustomEvent('historique-local-update', { detail: newEntry }));
    
//     return newEntry;
//   } catch (error) {
//     console.error('❌ Erreur ajout historique local:', error);
//     return { ...entry, id: 0, date: new Date().toISOString() };
//   }
// };

// // Hook React pour utiliser l'historique local
// export const useHistoriqueLocal = () => {
//   const [historique, setHistorique] = useState<HistoriqueEntry[]>([]);
  
//   useEffect(() => {
//     // Charger l'historique initial
//     const loadHistorique = () => {
//       setHistorique(getHistoriqueLocal());
//     };
    
//     loadHistorique();
    
//     // Écouter les mises à jour
//     const handleUpdate = () => {
//       loadHistorique();
//     };
    
//     window.addEventListener('historique-local-update', handleUpdate);
    
//     return () => {
//       window.removeEventListener('historique-local-update', handleUpdate);
//     };
//   }, []);
  
//   const addEntry = (entry: Omit<HistoriqueEntry, 'id' | 'date'>) => {
//     return addHistoriqueEntry(entry);
//   };
  
//   return { historique, addEntry };
// };