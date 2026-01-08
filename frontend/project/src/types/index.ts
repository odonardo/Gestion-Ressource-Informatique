



// // Types de base
// export interface User {
//   // id: string;
//   id: number; // CHANGÉ: string -> number
//   username: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   is_active: boolean;
//   date_joined: string;
// }

// export interface LoginCredentials {
//   username: string;
//   password: string;
// }

// // // Types pour les fournisseurs
// // export interface Fournisseur {
// //   id: string;
// //   nom: string;
// //   contact_email: string;
// //   telephone: string;
// //   type_fournisseur: 'materiel' | 'logiciel' | 'mixte';
// //   created_at?: string;
// //   updated_at?: string;
// // }


// export interface Fournisseur {
//   id: number;
//   nom: string;
//   // type: string;
//   type_fournisseur: 'materiel' | 'logiciel' | 'mixte';
//   // contact?: string;
//   contact_email: string;
//   // email?: string;
//   // user_email?: string;
//   telephone?: string;
//   adresse?: string;
// }





// export interface Materiel {
//   id: number;
//   nom: string;
//   reference: string;
//   date_achat: string;
//   etat: 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete';
//   service_attribue: string;
//   utilisateur_attribue: string;
//   fournisseur: number | null; // Changé de string à number | null
//   fournisseur_nom?: string;
//   created_at?: string;
//   updated_at?: string;

// }
// // Types pour les logiciels
// export interface Logiciel {
//   id: number; // Changé de string à number
//   nom: string;
//   editeur: string;
//   version: string;
//   type_logiciel: 'os' | 'bureautique' | 'metier' | 'securite' | 'autre';
//   date_installation?: string;
//   date_expiration_licence?: string;
//   fournisseur?: number; // Changé de string à number
//   fournisseur_nom?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// // Types pour les installations logiciel
// export interface InstallationLogiciel {
//   id: string;
//   materiel: string;
//   materiel_nom?: string;
//   logiciel: string;
//   logiciel_nom?: string;
//   date_installation: string;
//   statut: 'actif' | 'desinstalle' | 'en_erreur';
//   created_at?: string;
//   updated_at?: string;
// }

// // Types pour le réseau
// export interface Reseau {
//   id: string;
//   materiel: string;
//   materiel_nom?: string;
//   adresse_ip: string;
//   nom_hote: string;
//   sous_reseau: string;
//   passerelle: string;
//   type_equipement: 'poste' | 'serveur' | 'imprimante' | 'switch' | 'routeur';
//   statut_connexion: 'connecte' | 'deconnecte' | 'instable';
//   created_at?: string;
//   updated_at?: string;
// }






// // Dans votre fichier types.ts

// // types.ts
// export interface Incident {
//   id: number;
//   description: string;
//   date_creation: string;
//   date_resolution?: string | null;
//   priorite: 'critique' | 'elevee' | 'moyenne' | 'basse';
//   statut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
//   type_incident: 'materiel' | 'logiciel' | 'reseau' | 'mixte';
  
//   // Relations - CORRIGÉ selon votre modèle Django
//   utilisateur_signaleur: number; // Obligatoire dans votre modèle
//   materiel_concerne?: number | null;
//   logiciel_concerne?: number | null;
//   reseau_concerne?: number | null;
  
//   // Champs en lecture seule pour l'affichage
//   materiel_nom?: string;
//   logiciel_nom?: string;
//   utilisateur_nom?: string;
//   reseau_nom?: string; // Ajouté pour l'affichage réseau
// }



// // Types pour les alertes
// export interface Alerte {
//   id: string;
//   description: string;
//   date_alerte: string;
//   type_alerte: 'securite' | 'performance' | 'panne' | 'maintenance';
//   severite: 'critique' | 'elevee' | 'moyenne' | 'basse';
//   statut: 'nouvelle' | 'en_traitement' | 'resolue';
//   materiel_source?: string;
//   materiel_nom?: string;
//   logiciel_source?: string;
//   logiciel_nom?: string;
//   reseau_source?: string;
//   incident_lie?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// // Types pour les réparations
// export interface Reparation {
//   id: string;
//   description: string;
//   date_debut: string;
//   date_fin?: string;
//   type_reparation: 'preventive' | 'corrective' | 'ameliorative';
//   cout?: number;
//   materiel: string;
//   materiel_nom?: string;
//   incident?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// // Types pour les profils utilisateur
// export interface ProfilUtilisateur {
//   id: string;
//   user: string;
//   user_nom?: string;
//   user_email?: string;
//   departement: string;
//   telephone: string;
//   date_embauche: string;
//   created_at?: string;
//   updated_at?: string;
// }

// // Types pour le dashboard
// export interface DashboardData {
//   statistiques: {
//     materiels: {
//       total: number;
//       fonctionnels: number;
//       en_panne: number;
//       taux_fonctionnement: number;
//     };
//     incidents: {
//       ouverts: number;
//       critiques: number;
//     };
//     alertes: {
//       non_traitees: number;
//       critiques: number;
//     };
//   };
//   derniers_incidents: Incident[];
//   dernieres_alertes: Alerte[];
// }

// // Types pour les statistiques
// export interface Statistiques {
//   materiels: {
//     total: number;
//     par_etat: Record<string, number>;
//     par_service: Record<string, number>;
//   };
//   incidents: {
//     total: number;
//     par_statut: Record<string, number>;
//     par_priorite: Record<string, number>;
//   };
//   logiciels: {
//     total: number;
//     par_type: Record<string, number>;
//   };
// }

// // Types pour les filtres
// export interface FiltreMateriels {
//   etat?: string;
//   service?: string;
//   search?: string;
// }

// export interface FiltreIncidents {
//   statut?: string;
//   priorite?: string;
//   search?: string;
// }

// export interface FiltreLogiciels {
//   type?: string;
//   search?: string;
// }

// export interface FiltreAlertes {
//   statut?: string;
//   severite?: string;
//   search?: string;
// }

// // Types pour les formulaires
// export interface MaterielFormData extends Omit<Materiel, 'id' | 'created_at' | 'updated_at' | 'fournisseur_nom'> {}
// export interface LogicielFormData extends Omit<Logiciel, 'id' | 'created_at' | 'updated_at' | 'fournisseur_nom'> {}
// export interface InstallationLogicielFormData extends Omit<InstallationLogiciel, 'id' | 'created_at' | 'updated_at' | 'materiel_nom' | 'logiciel_nom'> {}
// export interface ReseauFormData extends Omit<Reseau, 'id' | 'created_at' | 'updated_at' | 'materiel_nom'> {}
// export interface IncidentFormData extends Omit<Incident, 'id' | 'created_at' | 'updated_at' | 'utilisateur_nom' | 'materiel_nom' | 'logiciel_nom'> {}
// export interface AlerteFormData extends Omit<Alerte, 'id' | 'created_at' | 'updated_at' | 'materiel_nom' | 'logiciel_nom'> {}
// export interface ReparationFormData extends Omit<Reparation, 'id' | 'created_at' | 'updated_at' | 'materiel_nom'> {}
// export interface ProfilUtilisateurFormData extends Omit<ProfilUtilisateur, 'id' | 'created_at' | 'updated_at' | 'user_nom' | 'user_email'> {}
// export interface FournisseurFormData extends Omit<Fournisseur, 'id' | 'created_at' | 'updated_at'> {}

// // Types pour les réponses API
// export interface ApiResponse<T> {
//   data: T;
//   status: number;
//   message?: string;
// }

// export interface PaginatedResponse<T> {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// }

// // Types pour les états
// export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

// export interface ApiState {
//   loading: LoadingState;
//   error: string | null;
// }








// // Types de base
// export interface User {
//   id: number;
//   username: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   is_active: boolean;
//   date_joined: string;
// }

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  role: 'user' | 'technician' | 'secretary' | 'director' | 'admin';
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Fournisseur
export interface Fournisseur {
  id: number;
  nom: string;
  type_fournisseur: 'materiel' | 'logiciel' | 'mixte';
  contact_email: string;
  telephone: string;
  adresse?: string;
}

// Matériel
export interface Materiel {
  id: number;
  nom: string;
  reference: string;
  date_achat: string;
  etat: 'fonctionnel' | 'en_panne' | 'repare' | 'obsolete';
  service_attribue: string;
  utilisateur_attribue?: string | null;
  fournisseur: number | null;
  fournisseur_nom?: string;
  created_at: string;
  updated_at: string;
}

// Logiciel
export interface Logiciel {
  id: number;
  nom: string;
  editeur: string;
  version: string;
  type_logiciel: 'os' | 'bureautique' | 'metier' | 'securite' | 'autre';
  date_installation?: string | null;
  date_expiration_licence?: string | null;
  fournisseur?: number | null;
  fournisseur_nom?: string;
}

// Installation Logiciel
export interface InstallationLogiciel {
  id: number;
  materiel: number;
  materiel_nom?: string;
  logiciel: number;
  logiciel_nom?: string;
  date_installation: string;
  statut: 'actif' | 'desinstalle' | 'en_erreur';
}

// Réseau
export interface Reseau {
  id: number;
  materiel: number;
  materiel_nom?: string;
  adresse_ip: string;
  nom_hote: string;
  sous_reseau: string;
  passerelle: string;
  type_equipement: 'poste' | 'serveur' | 'imprimante' | 'switch' | 'routeur';
  statut_connexion: 'connecte' | 'deconnecte' | 'instable';
}

// Incident
export interface Incident {
  id: number;
  description: string;
  date_creation: string;
  date_resolution?: string | null;
  priorite: 'critique' | 'elevee' | 'moyenne' | 'basse';
  statut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
  type_incident: 'materiel' | 'logiciel' | 'reseau' | 'mixte';
  materiel?: number | null;  // Ajout de cette propriété
  logiciel?: number | null;  // Ajout de cette propriété
  reseau?: number | null;    // Ajout de cette prop
  
  // Relations (IDs)
  utilisateur_signaleur?: number | null;
  materiel_concerne?: number | null;
  logiciel_concerne?: number | null;
  reseau_concerne?: number | null;
  
  // Champs en lecture seule pour l'affichage
  materiel_nom?: string;
  logiciel_nom?: string;
  utilisateur_nom?: string;
  reseau_nom?: string;
}
// utilisateur_signaleur?: number | null;
//   materiel?: number | null;  // Ajout de cette propriété
//   logiciel?: number | null;  // Ajout de cette propriété
//   reseau?: number | null;    // Ajout de cette propriété
  
// Interface pour le formulaire incident
export interface IncidentFormData {
  description: string;
  date_resolution?: string;
  priorite: 'critique' | 'elevee' | 'moyenne' | 'basse';
  statut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
  type_incident: 'materiel' | 'logiciel' | 'reseau' | 'mixte';
  utilisateur_signaleur: number;
  materiel_concerne?: number;
  logiciel_concerne?: number;
  reseau_concerne?: number;
}

// Alerte
export interface Alerte {
  id: number;
  description: string;
  date_alerte: string;
  type_alerte: 'securite' | 'performance' | 'panne' | 'maintenance';
  severite: 'critique' | 'elevee' | 'moyenne' | 'basse';
  statut: 'nouvelle' | 'en_traitement' | 'resolue';
  materiel_nom?: string;
  logiciel_nom?: string;
  reseau_nom?: string;
  

  // / Relations (IDs seulement pour la création/mise à jour)
  materiel_source?: number | null;
  logiciel_source?: number | null;
  reseau_source?: number | null;
  incident_lie?: number | null;

}


// Réparation
export interface Reparation {
  id: number;
  description: string;
  date_debut: string;
  date_fin?: string | null;
  type_reparation: 'preventive' | 'corrective' | 'ameliorative';
  cout?: number | null;
  materiel: number;
  materiel_nom?: string;
  incident?: number | null;
  technicien_responsable?: string; // propriété optionnelle
}

// Profil Utilisateur
// export interface ProfilUtilisateur {
//   id: number;
//   user: number; // ID de l'utilisateur (OneToOneField)
//   user_nom?: string; // Champ calculé depuis user.get_full_name()
//   user_email?: string; // Champ calculé depuis user.email
//   username?: string; // Champ calculé depuis user.username
//   departement: string;
//   telephone: string; // Peut être vide (blank=True)
//   date_embauche?: string | null; // Peut être null (null=True, blank=True)
//   role: 'user' | 'technician' | 'secretary' | 'director' | 'admin';
// }

// Dashboard
export interface DashboardData {
  statistiques: {
    materiels: {
      total: number;
      fonctionnels: number;
      en_panne: number;
      taux_fonctionnement: number;
    };
    incidents: {
      ouverts: number;
      critiques: number;
    };
    alertes: {
      non_traitees: number;
      critiques: number;
    };
  };
  derniers_incidents: Incident[];
  dernieres_alertes: Alerte[];
}

// Statistiques
export interface Statistiques {
  materiels: {
    total: number;
    par_etat: Record<string, number>;
    par_service: Record<string, number>;
  };
  incidents: {
    total: number;
    par_statut: Record<string, number>;
    par_priorite: Record<string, number>;
  };
  logiciels: {
    total: number;
    par_type: Record<string, number>;
  };
}

// Filtres
export interface FiltreMateriels {
  etat?: string;
  service?: string;
  search?: string;
}

export interface FiltreIncidents {
  statut?: string;
  priorite?: string;
  type_incident?: string;
  search?: string;
}

export interface FiltreLogiciels {
  type?: string;
  search?: string;
}

export interface FiltreAlertes {
  statut?: string;
  severite?: string;
  search?: string;
}

// Formulaires
export interface MaterielFormData extends Omit<Materiel, 'id' | 'created_at' | 'updated_at' | 'fournisseur_nom'> {}
export interface LogicielFormData extends Omit<Logiciel, 'id' | 'fournisseur_nom'> {}
export interface InstallationLogicielFormData extends Omit<InstallationLogiciel, 'id' | 'materiel_nom' | 'logiciel_nom'> {}
export interface ReseauFormData extends Omit<Reseau, 'id' | 'materiel_nom'> {}
export interface IncidentFormData extends Omit<Incident, 'id' | 'utilisateur_nom' | 'materiel_nom' | 'logiciel_nom' | 'reseau_nom'> {}
export interface AlerteFormData extends Omit<Alerte, 'id' | 'materiel_nom' | 'logiciel_nom'> {}
export interface ReparationFormData extends Omit<Reparation, 'id' | 'materiel_nom'> {}
// export interface ProfilUtilisateurFormData extends Omit<ProfilUtilisateur, 'id' | 'user_nom' | 'user_email' | 'username'> {}
export interface FournisseurFormData extends Omit<Fournisseur, 'id'> {}

// Réponses API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// États
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ApiState {
  loading: LoadingState;
  error: string | null;
}

// Types pour les endpoints d'actions
export interface ResolveIncidentData {
  id: number;
}

export interface TreatAlerteData {
  id: number;
  creer_incident?: boolean;
}

export interface FinishReparationData {
  id: number;
}

// Types pour les réponses de statistiques spécifiques
export interface IncidentStats {
  total: number;
  ouverts: number;
  en_cours: number;
  resolus: number;
  par_type: Array<{ type_incident: string; total: number }>;
  par_priorite: Array<{ priorite: string; total: number }>;
}

export interface ReseauStats {
  total: number;
  connectes: number;
  deconnectes: number;
  instables: number;
  taux_connexion: number;
}

// Dans types.ts
export interface ProfilUtilisateur {
  id: number;
  user: {
    id: number;
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    is_active: boolean;
  };
  departement: string;
  telephone?: string;
  date_embauche?: string;
  role: 'user' | 'technician' | 'secretary' | 'director' | 'admin';
}

// Corriger l'interface User
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  date_joined: string;
  role?: string; // Ajouter cette ligne
  departement?: string; // Ajouter cette ligne
}


// 
// export interface ProfilUtilisateur {
//   id: number;
//   user: number; // ID de l'utilisateur (OneToOneField)
//   user_nom?: string; // Champ calculé depuis user.get_full_name()
//   user_email?: string; // Champ calculé depuis user.email
//   username?: string; // Champ calculé depuis user.username
//   departement: string;
//   telephone: string; // Peut être vide (blank=True)
//   date_embauche?: string | null; // Peut être null (null=True, blank=True)
//   role: 'user' | 'technician' | 'secretary' | 'director' | 'admin';
// }

// Interface pour le formulaire (simplifiée pour l'UI)
export interface ProfilUtilisateurFormData {
  username: string; // username pour la sélection
  departement: string;
  telephone: string;
  date_embauche: string;
  role: 'user' | 'technician' | 'secretary' | 'director' | 'admin';
}

// Interface pour l'API (pour envoyer au backend)
export interface ProfilUtilisateurAPIData {
  user: number; // ID de l'utilisateur (obligatoire pour le backend)
  departement: string;
  telephone: string;
  date_embauche: string | null;
  role: 'user' | 'technician' | 'secretary' | 'director' | 'admin';
}
// export const usersAPI = {
//   getAll: (params?: any) => api.get<User[]>('/users/', { params }),
//   getById: (id: number) => api.get<User>(`/users/${id}/`),
//   getWithoutProfile: () => api.get<User[]>('/users/without_profile/'),
//   search: (query: string) => api.get<User[]>('/users/', { params: { search: query } }),
// };