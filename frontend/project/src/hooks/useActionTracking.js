// // src/hooks/useActionTracking.js
// import { useActionLogger } from '../context/ActionLoggerContext';

// export const useActionTracking = () => {
//   const logger = useActionLogger();
  
//   const trackMaterielAction = (action, materiel, user) => {
//     switch(action) {
//       case 'create':
//         logger.createMateriel(materiel.nom || 'Matériel', user);
//         break;
//       case 'update':
//         logger.updateMateriel(materiel.nom || 'Matériel', user);
//         break;
//       case 'delete':
//         logger.deleteMateriel(materiel.nom || 'Matériel', user);
//         break;
//     }
//   };
  
//   const trackIncidentAction = (action, incident, user) => {
//     switch(action) {
//       case 'create':
//         logger.createIncident(incident.description || 'Incident', user);
//         break;
//       case 'resolve':
//         logger.resolveIncident(incident.id || 'Incident', user);
//         break;
//     }
//   };
  
//   const trackReportAction = (type, user) => {
//     logger.generateReport(type, user);
//   };
  
//   return {
//     trackMaterielAction,
//     trackIncidentAction,
//     trackReportAction,
//     logger
//   };
// };