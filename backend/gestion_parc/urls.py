from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import incident_users_list
from .views import HistoriqueActionViewSet

router = DefaultRouter()
router.register(r'fournisseurs', views.FournisseurViewSet, basename='fournisseur')
router.register(r'materiels', views.MaterielViewSet, basename='materiel')
# router.register(r'materiels', MaterielViewSet, basename='materiel')
router.register(r'logiciels', views.LogicielViewSet, basename='logiciel')
router.register(r'installations', views.InstallationLogicielViewSet, basename='installation')
router.register(r'reseau', views.ReseauViewSet, basename='reseau')
router.register(r'incidents', views.IncidentViewSet, basename='incident')
router.register(r'alertes', views.AlerteViewSet, basename='alerte')
router.register(r'reparations', views.ReparationViewSet, basename='reparation')
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'profils-utilisateurs', views.ProfilUtilisateurViewSet, basename='profilutilisateur')
router.register(r'historique', HistoriqueActionViewSet, basename='historique')
# router.register(r'reparations', views.ReparationViewSet, basename='reparation')
# UNIQUEMENT UNE FOIS pour profils-utilisateurs

urlpatterns = [
    path('', include(router.urls)),
    path('tableau-de-bord/', views.TableauDeBordViewSet.as_view({'get': 'list'}), name='tableau-de-bord'),
    path('login/', views.custom_login, name='custom_login'),
    path('register/', views.custom_register, name='custom_register'),
    # Supprimez la ligne en double : path('', include(router.urls)),
    path('search-users/', views.UserSearchView.as_view(), name='search-users'),
    path('api/users/simple_list/', views.UserSimpleListView.as_view(), name='users-simple-list'),
    path('api/incident-users/', views.IncidentUserListView.as_view(), name='incident-users'),
    
    path('incident-users/', incident_users_list, name='incident-users-list'),
    path('api/incident-users/', incident_users_list, name='api-incident-users'),
    path('get-user-role/', views.get_user_role, name='get_user_role'),  # Nouveau
    path('login/', views.simple_login, name='login'),  # IMPORTANT: Route racine
    path('api/login/', views.simple_login, name='api-login'),
    path('materiels-en-panne/', views.get_materiels_en_panne, name='materiels-en-panne'),
    path('api/materiels-panne/', views.get_materiels_en_panne, name='materiels-panne'),
     path('api/materiels-panne/', views.get_materiels_en_panne, name='materiels-panne'),
    path('api/materiels-panne/list/', views.MaterielsEnPanneView.as_view(), name='materiels-panne-list'),
    path('api/materiels-panne/', views.get_materiels_en_panne, name='materiels-panne'),
    path('api/test-reparation/', views.test_reparation, name='test_reparation'),
    
    # path('api/incidents/materiels-disponibles/', views.get_materiels_en_panne_incident, name='incidents-materiels-disponibles'),
    
    path('me/', views.get_current_user_profile, name='current-user-profile'),
    
    
    # Register (Nouveau - route racine et api/)
    path('register/', views.register_user, name='register'),
    path('api/register/', views.register_user, name='api-register'),

    
    
    path('api/', include(router.urls)),  # Inclure avec préfixe 'api/'
    path('api/register/', views.custom_register, name='register-old'),  # Garder l'ancien pour compatibilité
]


# Routes racine supplémentaires
root_urlpatterns = [
    path('', views.test_page),  # Page d'accueil
    path('login', views.simple_login),  # Sans slash aussi
]

# root_urlpatterns = [
#     path('', views.test_page),  # Page d'accueil
#     path('login', views.simple_login),  # Sans slash aussi
# ]


# # gestion_parc/urls.py

# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from . import views

# router = DefaultRouter()
# router.register(r'users', views.UserViewSet, basename='user')
# router.register(r'materiels', views.MaterielViewSet)
# router.register(r'fournisseurs', views.FournisseurViewSet)
# router.register(r'logiciels', views.LogicielViewSet)
# router.register(r'installations', views.InstallationLogicielViewSet)
# router.register(r'incidents', views.IncidentViewSet)
# router.register(r'alertes', views.AlerteViewSet)
# router.register(r'reparations', views.ReparationViewSet)
# router.register(r'reseau', views.ReseauViewSet)
# router.register(r'profils', views.ProfilUtilisateurViewSet, basename='profilutilisateur')
# router.register(r'tableau-de-bord', views.TableauDeBordViewSet, basename='tableaudebord')

# urlpatterns = [
#     # Routes API via router
#     path('api/', include(router.urls)),
    
#     # Routes spéciales
#     path('api/login/', views.custom_login, name='api-login'),
#     path('api/simple-login/', views.simple_login, name='simple-login'),
#     path('api/health/', views.health_check, name='health-check'),
#     path('api/cors-test/', views.cors_test, name='cors-test'),
#     path('api/register/', views.custom_register, name='register'),
#     path('api/user-role/', views.get_user_role, name='get-user-role'),
#     path('api/incident-users/', views.incident_users_list, name='incident-users'),
#     path('api/users/simple/', views.UserSimpleListView.as_view(), name='users-simple'),
    
#     # Routes racine (pour le frontend)
    # path('login/', views.simple_login, name='login'),  # IMPORTANT: Route racine
#     path('health/', views.health_check, name='health-root'),
#     path('cors-test/', views.cors_test, name='cors-test-root'),
#     path('register/', views.custom_register, name='register-root'),
# ]















# from django.db import models
# from django.core.validators import MinLengthValidator
# from django.contrib.auth.models import User

# class Fournisseur(models.Model):
#     TYPE_FOURNISSEUR = [
#         ('materiel', 'Matériel'),
#         ('logiciel', 'Logiciel'),
#         ('mixte', 'Mixte'),
#     ]
    
#     nom = models.CharField(max_length=100)
#     contact_email = models.EmailField()
#     telephone = models.CharField(max_length=20)
#     adresse = models.TextField(blank=True, null=True)
#     type_fournisseur = models.CharField(max_length=10, choices=TYPE_FOURNISSEUR)
    
#     def __str__(self):
#         return self.nom

#     class Meta:
#         verbose_name = "Fournisseur"
#         verbose_name_plural = "Fournisseurs"

# class Materiel(models.Model):
#     ETAT_CHOICES = [
#         ('fonctionnel', 'Fonctionnel'),
#         ('en_panne', 'En panne'),
#         ('repare', 'Réparé'),
#         ('obsolete', 'Obsolète'),
#         ('fonctionnel', 'Fonctionnel'),
#         ('en_panne', 'En panne'),
#         ('repare', 'Réparé'),
#         ('obsolete', 'Obsolète'),
#         ('en_maintenance', 'En maintenance'),
#         ('en_amelioration', 'En amélioration'),
#         ('en_reparation', 'En réparation'),
#         ('hors_service', 'Hors service'),
#     ]
    
#     SERVICE_CHOICES = [
#         ('Direction', 'Direction'),
#         ('Comptabilité', 'Comptabilité'),
#         ('Ressources Humaines', 'Ressources Humaines'),
#         ('Informatique', 'Informatique'),
#         ('Secrétariat', 'Secrétariat'),
#         ('Archives', 'Archives'),
#     ]

#     nom = models.CharField(
#         max_length=200,
#         validators=[MinLengthValidator(2)],
#         verbose_name="Nom du matériel"
#     )
#     reference = models.CharField(
#         max_length=100,
#         unique=True,
#         validators=[MinLengthValidator(2)],
#         verbose_name="Référence/Numéro de série"
#     )
#     date_achat = models.DateField(verbose_name="Date d'achat")
#     etat = models.CharField(
#         max_length=30,
#         choices=ETAT_CHOICES,
#         default='fonctionnel',
#         verbose_name="État"
#     )
#     service_attribue = models.CharField(
#         max_length=50,
#         choices=SERVICE_CHOICES,
#         verbose_name="Service attribué"
#     )
#     utilisateur_attribue = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True,
#         verbose_name="Utilisateur attribué"
#     )
#     fournisseur = models.ForeignKey(
#         Fournisseur, 
#         on_delete=models.SET_NULL, 
#         null=True, 
#         blank=True,
#         verbose_name="Fournisseur"
#     )
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         verbose_name = "Matériel"
#         verbose_name_plural = "Matériels"
#         ordering = ['-created_at']

#     def __str__(self):
#         return f"{self.nom} ({self.reference})"

# class Logiciel(models.Model):
#     TYPE_LOGICIEL = [
#         ('os', 'Système d exploitation'),
#         ('bureautique', 'Bureautique'),
#         ('metier', 'Métier'),
#         ('securite', 'Sécurité'),
#         ('autre', 'Autre'),
#     ]
    
#     nom = models.CharField(max_length=100)
#     editeur = models.CharField(max_length=100)
#     version = models.CharField(max_length=50)
#     type_logiciel = models.CharField(max_length=20, choices=TYPE_LOGICIEL)
#     date_installation = models.DateField(null=True, blank=True)
#     date_expiration_licence = models.DateField(null=True, blank=True)
#     fournisseur = models.ForeignKey(Fournisseur, on_delete=models.SET_NULL, null=True)
    
#     def __str__(self):
#         return f"{self.nom} v{self.version}"

#     class Meta:
#         verbose_name = "Logiciel"
#         verbose_name_plural = "Logiciels"

# class InstallationLogiciel(models.Model):
#     STATUT_INSTALLATION = [
#         ('actif', 'Actif'),
#         ('desinstalle', 'Désinstallé'),
#         ('en_erreur', 'En erreur'),
#     ]
    
#     materiel = models.ForeignKey(Materiel, on_delete=models.CASCADE)
#     logiciel = models.ForeignKey(Logiciel, on_delete=models.CASCADE)
#     # date_installation = models.DateField(auto_now_add=True)
#     date_installation = models.DateField()  # IMPORTANT: Pas d'auto_now_add=True ici !
#     statut = models.CharField(max_length=20, choices=STATUT_INSTALLATION, default='actif')
    
#     class Meta:
#         verbose_name = "Installation logiciel"
#         verbose_name_plural = "Installations logiciels"
#         unique_together = ['materiel', 'logiciel']
    
#     def __str__(self):
#         return f"{self.logiciel.nom} sur {self.materiel.nom}"

# class Reseau(models.Model):
#     TYPE_EQUIPEMENT = [
#         ('poste', 'Poste de travail'),
#         ('serveur', 'Serveur'),
#         ('imprimante', 'Imprimante'),
#         ('switch', 'Switch'),
#         ('routeur', 'Routeur'),
#     ]
    
#     STATUT_CONNEXION = [
#         ('connecte', 'Connecté'),
#         ('deconnecte', 'Déconnecté'),
#         ('instable', 'Instable'),
#     ]
    
#     materiel = models.OneToOneField(Materiel, on_delete=models.CASCADE)
#     adresse_ip = models.GenericIPAddressField()
#     nom_hote = models.CharField(max_length=100)
#     sous_reseau = models.GenericIPAddressField()
#     passerelle = models.GenericIPAddressField()
#     type_equipement = models.CharField(max_length=20, choices=TYPE_EQUIPEMENT)
#     statut_connexion = models.CharField(max_length=20, choices=STATUT_CONNEXION, default='connecte')
    
#     def __str__(self):
#         return f"{self.nom_hote} ({self.adresse_ip})"

#     class Meta:
#         verbose_name = "Configuration réseau"
#         verbose_name_plural = "Configurations réseau"

# class Incident(models.Model):
#     TYPE_INCIDENT = [
#         ('materiel', 'Matériel'),
#         ('logiciel', 'Logiciel'),
#         ('reseau', 'Réseau'),
#         ('mixte', 'Mixte'),
#     ]
    
#     PRIORITE_CHOICES = [
#         ('critique', 'Critique'),
#         ('elevee', 'Élevée'),
#         ('moyenne', 'Moyenne'),
#         ('basse', 'Basse'),
#     ]
    
#     STATUT_INCIDENT = [
#         ('ouvert', 'Ouvert'),
#         ('en_cours', 'En cours'),
#         ('resolu', 'Résolu'),
#         ('ferme', 'Fermé'),
#     ]
    
#     description = models.TextField()
#     date_creation = models.DateTimeField(auto_now_add=True)
#     date_resolution = models.DateTimeField(null=True, blank=True)
#     priorite = models.CharField(max_length=20, choices=PRIORITE_CHOICES, default='moyenne')
#     statut = models.CharField(max_length=20, choices=STATUT_INCIDENT, default='ouvert')
#     type_incident = models.CharField(max_length=20, choices=TYPE_INCIDENT)
    
#     # Relations
#     utilisateur_signaleur = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
#     materiel_concerne = models.ForeignKey(Materiel, on_delete=models.CASCADE, null=True, blank=True)
#     logiciel_concerne = models.ForeignKey(Logiciel, on_delete=models.SET_NULL, null=True, blank=True)
#     reseau_concerne = models.ForeignKey(Reseau, on_delete=models.SET_NULL, null=True, blank=True)
    
#     # NOUVEAU : Champ pour stocker le nom du matériel (facultatif mais pratique)
#     materiel_nom = models.CharField(max_length=200, blank=True, null=True, verbose_name="Nom du matériel")
    
#     def save(self, *args, **kwargs):
#         """Sauvegarder automatiquement le nom du matériel"""
#         if self.materiel_concerne:
#             self.materiel_nom = f"{self.materiel_concerne.nom} ({self.materiel_concerne.reference})"
#         elif not self.materiel_nom:
#             self.materiel_nom = None
        
#         super().save(*args, **kwargs)
    
#     def __str__(self):
#         materiel_info = ""
#         if self.materiel_concerne:
#             materiel_info = f" - {self.materiel_concerne.nom}"
        
#         return f"Incident #{self.id}{materiel_info}"

#     class Meta:
#         verbose_name = "Incident"
#         verbose_name_plural = "Incidents"
#         ordering = ['-date_creation']
        
        
        
# class Alerte(models.Model):
#     TYPE_ALERTE = [
#         ('securite', 'Sécurité'),
#         ('performance', 'Performance'),
#         ('panne', 'Panne'),
#         ('maintenance', 'Maintenance'),
#     ]
    
#     SEVERITE_CHOICES = [
#         ('critique', 'Critique'),
#         ('elevee', 'Élevée'),
#         ('moyenne', 'Moyenne'),
#         ('basse', 'Basse'),
#     ]
    
#     STATUT_ALERTE = [
#         ('nouvelle', 'Nouvelle'),
#         ('en_traitement', 'En traitement'),
#         ('resolue', 'Résolue'),
#     ]
    
#     description = models.TextField()
#     date_alerte = models.DateTimeField(auto_now_add=True)
#     type_alerte = models.CharField(max_length=20, choices=TYPE_ALERTE)
#     severite = models.CharField(max_length=20, choices=SEVERITE_CHOICES, default='moyenne')
#     statut = models.CharField(max_length=20, choices=STATUT_ALERTE, default='nouvelle')
    
#     # Sources possibles de l'alerte
#     materiel_source = models.ForeignKey(Materiel, on_delete=models.CASCADE, null=True, blank=True)
#     logiciel_source = models.ForeignKey(Logiciel, on_delete=models.SET_NULL, null=True, blank=True)
#     reseau_source = models.ForeignKey(Reseau, on_delete=models.SET_NULL, null=True, blank=True)
    
#     # Lien avec incident si l'alerte en a déclenché un
#     incident_lie = models.ForeignKey(Incident, on_delete=models.SET_NULL, null=True, blank=True)
    
#     def __str__(self):
#         return f"Alerte {self.get_severite_display()} - {self.description[:50]}..."

#     class Meta:
#         verbose_name = "Alerte"
#         verbose_name_plural = "Alertes"
#         ordering = ['-date_alerte']
        
# class ProfilUtilisateur(models.Model):
#     # user = models.OneToOneField(User, on_delete=models.CASCADE)
#     user = models.OneToOneField(
#         User, 
#         on_delete=models.CASCADE,  # Suppression en cascade
#         primary_key=True,
#         related_name='profilutilisateur'
#     )
#     departement = models.CharField(max_length=100)
#     telephone = models.CharField(max_length=20, blank=True)
#     date_embauche = models.DateField(null=True, blank=True)
    
#     def __str__(self):
#         return f"{self.user.get_full_name()} ({self.departement})"

#     class Meta:
#         verbose_name = "Profil utilisateur"
#         verbose_name_plural = "Profils utilisateurs"



# # Dans models.py, modifiez le modèle ProfilUtilisateur

# class ProfilUtilisateur(models.Model):
#     ROLE_CHOICES = [
#         ('user', 'Utilisateur standard'),
#         ('technician', 'Technicien'),
#         ('secretary', 'Secrétaire'),
#         ('director', 'Directeur'),
#         ('admin', 'Administrateur'),
#     ]
    
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     departement = models.CharField(max_length=100)
#     telephone = models.CharField(max_length=20, blank=True)
#     date_embauche = models.DateField(null=True, blank=True)
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    
#     def __str__(self):
#         return f"{self.user.get_full_name()} ({self.departement}) - {self.get_role_display()}"

#     class Meta:
#         verbose_name = "Profil utilisateur"
#         verbose_name_plural = "Profils utilisateurs"
        
        
        
# # historique

# # Dans models.py - Ajoutez ce modèle
# from django.db import models
# from django.contrib.auth.models import User
# from django.utils import timezone

# class HistoriqueAction(models.Model):
#     TYPE_ACTION = [
#         ('creation', 'Création'),
#         ('modification', 'Modification'),
#         ('suppression', 'Suppression'),
#         ('consultation', 'Consultation'),
#         ('login', 'Connexion'),
#         ('logout', 'Déconnexion'),
#         ('autre', 'Autre'),
#     ]
    
#     MODULE_CHOICES = [
#         ('materiel', 'Matériel'),
#         ('logiciel', 'Logiciel'),
#         ('installation_logiciel', 'Installation Logiciel'),
#         ('reseau', 'Réseau'),
#         ('incident', 'Incident'),
#         ('alerte', 'Alerte'),
#         ('reparation', 'Réparation'),
#         ('fournisseur', 'Fournisseur'),
#         ('profil_utilisateur', 'Profil Utilisateur'),
#         ('utilisateur', 'Utilisateur'),
#         ('dashboard', 'Tableau de bord'),
#         ('rapport', 'Rapport'),
#         ('systeme', 'Système'),
#     ]
    
#     utilisateur = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
#     action = models.CharField(max_length=20, choices=TYPE_ACTION)
#     module = models.CharField(max_length=30, choices=MODULE_CHOICES)
#     objet_id = models.IntegerField(null=True, blank=True)
#     objet_nom = models.CharField(max_length=255, blank=True)
#     description = models.TextField()
#     ip_address = models.GenericIPAddressField(null=True, blank=True)
#     user_agent = models.TextField(blank=True)
#     date_action = models.DateTimeField(default=timezone.now)
#     created_at = models.DateTimeField(auto_now_add=True)
#     donnees_avant = models.JSONField(null=True, blank=True)
#     donnees_apres = models.JSONField(null=True, blank=True)
    
#     class Meta:
#         verbose_name = "Historique d'action"
#         verbose_name_plural = "Historiques d'actions"
#         ordering = ['-date_action']
    
#     def __str__(self):
#         return f"{self.get_action_display()} - {self.get_module_display()}"
    
    
    
# # Dans models.py - CORRECTION COMPLÈTE
# class Reparation(models.Model):
#     TYPE_REPARATION = [
#         ('preventive', 'Préventive'),
#         ('corrective', 'Corrective'),
#         ('ameliorative', 'Améliorative'),
#     ]
    
#     description = models.TextField()
#     date_debut = models.DateTimeField(auto_now_add=True)
#     date_fin = models.DateTimeField(null=True, blank=True)
#     type_reparation = models.CharField(max_length=20, choices=TYPE_REPARATION)
#     cout = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
#     # CORRECTION CRITIQUE ICI :
#     technicien_responsable = models.CharField(
#         max_length=200,
#         verbose_name="Technicien responsable",
#         default='Technicien non spécifié',  # Valeur par défaut
#         blank=False,  # Important : ne peut pas être vide
#         null=False,   # Important : ne peut pas être NULL
#     )
    
#     # Relations
#     materiel = models.ForeignKey(
#         'Materiel', 
#         on_delete=models.CASCADE, 
#         related_name='reparations'
#     )
#     incident = models.ForeignKey(
#         'Incident', 
#         on_delete=models.SET_NULL, 
#         null=True, 
#         blank=True,
#         related_name='reparations'
#     )
    
#     class Meta:
#         verbose_name = "Réparation"
#         verbose_name_plural = "Réparations"
#         ordering = ['-date_debut']
    
#     def __str__(self):
#         return f"Réparation #{self.id} - {self.materiel.nom if self.materiel else 'Sans matériel'}"
    
#     def save(self, *args, **kwargs):
#         """S'assurer que technicien_responsable n'est jamais vide"""
#         # S'assurer qu'il y a toujours une valeur
#         if not self.technicien_responsable or self.technicien_responsable.strip() == '':
#             self.technicien_responsable = 'Technicien non spécifié'
        
#         super().save(*args, **kwargs)
        
#         # Mettre à jour le matériel si la réparation est terminée
#         if self.date_fin and self.materiel:
#             self.materiel.etat = 'fonctionnel'
#             self.materiel.save()



















# from rest_framework import viewsets, status
# from rest_framework.decorators import action, api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from django.db.models import Count, Q
# from django.utils import timezone
# from django.contrib.auth.models import User
# from .models import *
# from .serializers import *
# from rest_framework.authtoken.models import Token
# from .permissions import IsAdmin, IsDirector, IsTechnician, IsSecretary, IsUser, IsOwnerOrAdmin


# from rest_framework import views


# # views.py
# from django.contrib.auth.models import User
# from rest_framework import viewsets, permissions
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from .permissions import IsAdmin
# from .serializers import UserSerializer


# # backend/gestion_parc/views.py - CORRECTION
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authentication import SessionAuthentication, TokenAuthentication

# class ProfilUtilisateurViewSet(viewsets.ModelViewSet):
#     queryset = ProfilUtilisateur.objects.all()
#     serializer_class = ProfilUtilisateurSerializer
    
#     # IMPORTANT: Définir les permissions et authentification
#     authentication_classes = [SessionAuthentication, TokenAuthentication]
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return ProfilUtilisateur.objects.all().order_by('user_nom')
    
#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

# # Dans views.py
# class UserViewSet(viewsets.ReadOnlyModelViewSet):
#     """
#     ViewSet pour lire les utilisateurs.
#     Permettre à tous les utilisateurs authentifiés de voir la liste
#     """
#     queryset = User.objects.filter(is_active=True)
#     serializer_class = UserSerializer
#     permission_classes = [permissions.IsAuthenticated]  # Tous les authentifiés
    
#     def get_queryset(self):
#         queryset = User.objects.filter(is_active=True)
        
#         # Recherche par nom, prénom, email ou username
#         search = self.request.query_params.get('search', None)
#         if search:
#             queryset = queryset.filter(
#                 Q(username__icontains=search) |
#                 Q(first_name__icontains=search) |
#                 Q(last_name__icontains=search) |
#                 Q(email__icontains=search)
#             )
        
#         return queryset.order_by('username')
    
#     # Garder l'action simple_list
#     @action(detail=False, methods=['get'])
#     def simple_list(self, request):
#         """
#         Retourne une liste simplifiée des utilisateurs
#         """
#         users = User.objects.filter(is_active=True).values(
#             'id', 'username', 'first_name', 'last_name', 'email'
#         )
        
#         data = [
#             {
#                 'id': user['id'],
#                 'username': user['username'],
#                 'full_name': f"{user.get('first_name', '')} {user.get('last_name', '')}".strip(),
#                 'email': user['email'] or ''
#             }
#             for user in users
#         ]
        
#         return Response(data)
    
#     # Ajouter cette action pour avoir une vue simplifiée
#     @action(detail=False, methods=['get'])
#     def simple_list(self, request):
#         """
#         Retourne une liste simplifiée des utilisateurs
#         """
#         users = User.objects.filter(is_active=True).values(
#             'id', 'username', 'first_name', 'last_name', 'email'
#         )
        
#         data = [
#             {
#                 'id': user['id'],
#                 'username': user['username'],
#                 'full_name': f"{user.get('first_name', '')} {user.get('last_name', '')}".strip(),
#                 'email': user['email'] or ''
#             }
#             for user in users
#         ]
        
#         return Response(data)
    
# # ============================================================================
# # MATERIEL VIEWSET - UNE SEULE DÉFINITION
# # ============================================================================
# class MaterielViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet pour gérer les matériels
#     """
#     # ATTRIBUT QUERYSET OBLIGATOIRE
#     queryset = Materiel.objects.all()
#     serializer_class = MaterielSerializer
#     permission_classes = [IsUser]

#     def get_queryset(self):
#         """
#         Filtrer le queryset selon l'utilisateur connecté
#         """
#         # Base queryset
#         queryset = Materiel.objects.all()
        
#         # Vérifier si l'utilisateur a un profil
#         if hasattr(self.request.user, 'profilutilisateur'):
#             user_profile = self.request.user.profilutilisateur
#             if user_profile.role == 'user':
#                 # Utilisateurs standards voient seulement leurs matériels
#                 nom_utilisateur = self.request.user.get_full_name()
#                 if nom_utilisateur:
#                     queryset = queryset.filter(utilisateur_attribue=nom_utilisateur)
        
#         # Filtre par état
#         etat = self.request.query_params.get('etat', None)
#         if etat:
#             queryset = queryset.filter(etat=etat)
        
#         # Filtre par service
#         service = self.request.query_params.get('service', None)
#         if service:
#             queryset = queryset.filter(service_attribue=service)
        
#         # Filtre par recherche
#         search = self.request.query_params.get('search', None)
#         if search:
#             queryset = queryset.filter(
#                 Q(nom__icontains=search) | 
#                 Q(reference__icontains=search) |
#                 Q(utilisateur_attribue__icontains=search) |
#                 Q(service_attribue__icontains=search)
#             )
        
#         # Trier par date de création (plus récent en premier)
#         return queryset.order_by('-created_at')

#     # ==================== ACTIONS PERSONNALISÉES ====================

#     @action(detail=False, methods=['get'])
#     def en_panne(self, request):
#         """
#         Retourne uniquement les matériels en panne
#         """
#         materiels_en_panne = self.get_queryset().filter(etat='en_panne')
#         serializer = self.get_serializer(materiels_en_panne, many=True)
#         return Response(serializer.data)

#     @action(detail=True, methods=['get'])
#     def logiciels(self, request, pk=None):
#         """Liste tous les logiciels installés sur un matériel"""
#         materiel = self.get_object()
#         installations = InstallationLogiciel.objects.filter(materiel=materiel, statut='actif')
#         serializer = InstallationLogicielSerializer(installations, many=True)
#         return Response(serializer.data)

#     @action(detail=True, methods=['get'])
#     def incidents(self, request, pk=None):
#         """Liste tous les incidents d'un matériel"""
#         materiel = self.get_object()
#         incidents = Incident.objects.filter(materiel_concerne=materiel)
#         serializer = IncidentSerializer(incidents, many=True)
#         return Response(serializer.data)

#     @action(detail=True, methods=['get'])
#     def statistiques(self, request, pk=None):
#         """Statistiques pour un matériel"""
#         materiel = self.get_object()
        
#         data = {
#             'total_incidents': Incident.objects.filter(materiel_concerne=materiel).count(),
#             'incidents_ouverts': Incident.objects.filter(
#                 materiel_concerne=materiel, 
#                 statut__in=['ouvert', 'en_cours']
#             ).count(),
#             'logiciels_installes': InstallationLogiciel.objects.filter(
#                 materiel=materiel, 
#                 statut='actif'
#             ).count(),
#             'alertes_actuelles': Alerte.objects.filter(
#                 materiel_source=materiel, 
#                 statut='nouvelle'
#             ).count(),
#             'reparations': {
#                 'total': Reparation.objects.filter(materiel=materiel).count(),
#                 'en_cours': Reparation.objects.filter(materiel=materiel, date_fin__isnull=True).count(),
#                 'terminees': Reparation.objects.filter(materiel=materiel, date_fin__isnull=False).count(),
#             }
#         }
        
#         return Response(data)

#     def create(self, request, *args, **kwargs):
#         """Création avec logging"""
#         print(f"🆕 Création matériel - Utilisateur: {request.user.username}")
#         print(f"📤 Données: {request.data}")
#         return super().create(request, *args, **kwargs)

#     def update(self, request, *args, **kwargs):
#         """Mise à jour avec logging"""
#         print(f"✏️ Mise à jour matériel - Utilisateur: {request.user.username}")
#         print(f"📤 Données: {request.data}")
#         return super().update(request, *args, **kwargs)
    
# class FournisseurViewSet(viewsets.ModelViewSet):
#     queryset = Fournisseur.objects.all()
#     serializer_class = FournisseurSerializer
#     permission_classes = [IsSecretary | IsAdmin]  # Seuls secrétaires et admin

# class LogicielViewSet(viewsets.ModelViewSet):
#     queryset = Logiciel.objects.all()
#     serializer_class = LogicielSerializer
#     permission_classes = [IsTechnician | IsAdmin]  # Seuls techniciens et admin

# class InstallationLogicielViewSet(viewsets.ModelViewSet):
#     queryset = InstallationLogiciel.objects.all()
#     serializer_class = InstallationLogicielSerializer
#     permission_classes = [IsTechnician | IsAdmin]  # Seuls techniciens et admin

# # Dans views.py - IncidentViewSet

# class IncidentViewSet(viewsets.ModelViewSet):
#     queryset = Incident.objects.all()
#     serializer_class = IncidentSerializer
#     permission_classes = [IsUser]  # Tous les utilisateurs connectés

#     def create(self, request, *args, **kwargs):
#         """
#         Création d'un incident avec validation du matériel
#         """
#         print(f"🚨 Création incident - Utilisateur connecté: {request.user.username}")
        
#         mutable_data = request.data.copy()
        
#         # Vérifier si un matériel est spécifié
#         materiel_id = mutable_data.get('materiel_concerne')
#         if materiel_id:
#             try:
#                 materiel = Materiel.objects.get(id=materiel_id)
#                 # Vérifier que le matériel est bien en panne
#                 if materiel.etat != 'en_panne':
#                     return Response({
#                         'detail': f"Le matériel '{materiel.nom}' n'est pas en panne. État actuel: {materiel.etat}"
#                     }, status=status.HTTP_400_BAD_REQUEST)
#             except Materiel.DoesNotExist:
#                 return Response({
#                     'detail': 'Matériel non trouvé'
#                 }, status=status.HTTP_400_BAD_REQUEST)
        
#         # FORCER l'utilisateur connecté comme signaleur
#         mutable_data['utilisateur_signaleur'] = request.user.id
        
#         # Créer le serializer
#         serializer = self.get_serializer(data=mutable_data)
#         serializer.is_valid(raise_exception=True)
        
#         # Sauvegarder
#         self.perform_create(serializer)
        
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# class AlerteViewSet(viewsets.ModelViewSet):
#     queryset = Alerte.objects.all()
#     serializer_class = AlerteSerializer
#     permission_classes = [IsTechnician | IsDirector | IsAdmin]  # Techniciens, directeurs, admin

# class ReseauViewSet(viewsets.ModelViewSet):
#     queryset = Reseau.objects.all()
#     serializer_class = ReseauSerializer
#     permission_classes = [IsTechnician | IsAdmin]  # Seuls techniciens et admin

# class ProfilUtilisateurViewSet(viewsets.ModelViewSet):
#     queryset = ProfilUtilisateur.objects.all()
#     serializer_class = ProfilUtilisateurSerializer
#     permission_classes = [IsAdmin]  # Seuls admin peuvent gérer les profils

#     def get_queryset(self):
#         queryset = ProfilUtilisateur.objects.all()
        
#         # Les utilisateurs ne voient que leur propre profil
#         if hasattr(self.request.user, 'profilutilisateur'):
#             user_profile = self.request.user.profilutilisateur
#             if user_profile.role != 'admin':
#                 queryset = queryset.filter(user=self.request.user)
        
#         return queryset

# class TableauDeBordViewSet(viewsets.ViewSet):
#     permission_classes = [IsUser]  # Tous les utilisateurs connectés
    
#     def list(self, request):
#         user_role = request.user.profilutilisateur.role
        
#         # Données de base pour tous
#         data = {
#             'user_role': user_role,
#             'user_name': request.user.get_full_name(),
#         }
        
#         # Données spécifiques selon le rôle
#         if user_role == 'user':
#             # Vue limitée pour utilisateur standard
#             user_materiels = Materiel.objects.filter(utilisateur_attribue=request.user.get_full_name())
#             user_incidents = Incident.objects.filter(utilisateur_signaleur=request.user)
            
#             data.update({
#                 'mes_materiels_count': user_materiels.count(),
#                 'mes_incidents_count': user_incidents.count(),
#                 'mes_incidents_ouverts': user_incidents.filter(statut__in=['ouvert', 'en_cours']).count(),
#             })
            
#         elif user_role == 'technician':
#             # Vue technique
#             data.update({
#                 'materiels_en_panne': Materiel.objects.filter(etat='en_panne').count(),
#                 'incidents_ouverts': Incident.objects.filter(statut__in=['ouvert', 'en_cours']).count(),
#                 'reparations_en_cours': Reparation.objects.filter(date_fin__isnull=True).count(),
#             })
            
#         elif user_role in ['director', 'admin']:
#             # Vue complète
#             data.update({
#                 'total_materiels': Materiel.objects.count(),
#                 'materiels_fonctionnels': Materiel.objects.filter(etat='fonctionnel').count(),
#                 'incidents_ouverts': Incident.objects.filter(statut__in=['ouvert', 'en_cours']).count(),
#                 'alertes_critiques': Alerte.objects.filter(severite='critique', statut='nouvelle').count(),
#             })
        
#         return Response(data)

# # Exemple pour MaterielViewSet
# class MaterielViewSet(viewsets.ModelViewSet):
#     queryset = Materiel.objects.all()
#     serializer_class = MaterielSerializer
#     permission_classes = [IsUser]  # Seuls les utilisateurs connectés



# # Dans views.py - CORRECTION de custom_login

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def custom_login(request):
#     serializer = LoginSerializer(data=request.data)
    
#     if serializer.is_valid():
#         user = serializer.validated_data['user']
        
#         # Récupérer le profil utilisateur pour obtenir le rôle
#         try:
#             profil = ProfilUtilisateur.objects.get(user=user)
#             role = profil.role
#             departement = profil.departement or 'Non spécifié'
#             telephone = profil.telephone or ''
#         except ProfilUtilisateur.DoesNotExist:
#             # Créer un profil par défaut si inexistant
#             profil = ProfilUtilisateur.objects.create(
#                 user=user,
#                 departement='À définir',
#                 role='user',
#                 telephone=''
#             )
#             role = 'user'
#             departement = 'À définir'
#             telephone = ''
        
#         # Créer ou récupérer le token
#         token, created = Token.objects.get_or_create(user=user)
        
#         # CORRECTION: Retourner la réponse AVEC la clé 'user'
#         response_data = {
#             'token': token.key,
#             'user': {  # ← C'EST LA CLÉ MANQUANTE
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name or '',
#                 'last_name': user.last_name or '',
#                 'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
#                 'role': role,
#                 'departement': departement,
#                 'telephone': telephone
#             }
#         }
        
#         return Response(response_data, status=status.HTTP_200_OK)
    
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # Dans views.py - Ajoutez cette vue

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_user_role(request):
#     """Retourne le rôle de l'utilisateur connecté"""
#     try:
#         profil = ProfilUtilisateur.objects.get(user=request.user)
#         return Response({
#             'role': profil.role,
#             'departement': profil.departement,
#             'telephone': profil.telephone
#         })
#     except ProfilUtilisateur.DoesNotExist:
#         # Créer un profil par défaut si inexistant
#         profil = ProfilUtilisateur.objects.create(
#             user=request.user,
#             departement='À définir',
#             role='user'
#         )
#         return Response({
#             'role': 'user',
#             'departement': 'À définir',
#             'telephone': ''
#         })

# class FournisseurViewSet(viewsets.ModelViewSet):
#     queryset = Fournisseur.objects.all()
#     serializer_class = FournisseurSerializer
#     permission_classes = [AllowAny]  # Temporaire

#     @action(detail=True, methods=['get'])
#     def materiels(self, request, pk=None):
#         """Liste tous les matériels d'un fournisseur"""
#         fournisseur = self.get_object()
#         materiels = Materiel.objects.filter(fournisseur=fournisseur)
#         serializer = MaterielSerializer(materiels, many=True)
#         return Response(serializer.data)

# class MaterielViewSet(viewsets.ModelViewSet):
#     queryset = Materiel.objects.all()
#     serializer_class = MaterielSerializer
#     permission_classes = [AllowAny]  # Temporaire

#     def get_queryset(self):
#         """Filtrage personnalisé pour les matériels"""
#         queryset = Materiel.objects.all()
        
#         # Filtre par état
#         etat = self.request.query_params.get('etat', None)
#         if etat:
#             queryset = queryset.filter(etat=etat)
            
#         # Filtre par service
#         service = self.request.query_params.get('service', None)
#         if service:
#             queryset = queryset.filter(service_attribue=service)
            
#         # Filtre par recherche
#         search = self.request.query_params.get('search', None)
#         if search:
#             queryset = queryset.filter(
#                 Q(nom__icontains=search) | 
#                 Q(reference__icontains=search) |
#                 Q(utilisateur_attribue__icontains=search)
#             )
            
#         return queryset

#     @action(detail=True, methods=['get'])
#     def logiciels(self, request, pk=None):
#         """Liste tous les logiciels installés sur un matériel"""
#         materiel = self.get_object()
#         installations = InstallationLogiciel.objects.filter(materiel=materiel, statut='actif')
#         serializer = InstallationLogicielSerializer(installations, many=True)
#         return Response(serializer.data)

#     @action(detail=True, methods=['get'])
#     def incidents(self, request, pk=None):
#         """Liste tous les incidents d'un matériel"""
#         materiel = self.get_object()
#         incidents = Incident.objects.filter(materiel_concerne=materiel)
#         serializer = IncidentSerializer(incidents, many=True)
#         return Response(serializer.data)

#     @action(detail=True, methods=['get'])
#     def statistiques(self, request, pk=None):
#         """Statistiques pour un matériel"""
#         materiel = self.get_object()
        
#         data = {
#             'total_incidents': Incident.objects.filter(materiel_concerne=materiel).count(),
#             'incidents_ouverts': Incident.objects.filter(materiel_concerne=materiel, statut__in=['ouvert', 'en_cours']).count(),
#             'logiciels_installes': InstallationLogiciel.objects.filter(materiel=materiel, statut='actif').count(),
#             'alertes_actuelles': Alerte.objects.filter(materiel_source=materiel, statut='nouvelle').count(),
#         }
        
#         return Response(data)

# class LogicielViewSet(viewsets.ModelViewSet):
#     queryset = Logiciel.objects.all()
#     serializer_class = LogicielSerializer
#     permission_classes = [AllowAny]  # Temporaire

#     def get_queryset(self):
#         """Filtrage personnalisé pour les logiciels"""
#         queryset = Logiciel.objects.all()
        
#         # Filtre par type
#         type_logiciel = self.request.query_params.get('type', None)
#         if type_logiciel:
#             queryset = queryset.filter(type_logiciel=type_logiciel)
            
#         # Filtre par recherche
#         search = self.request.query_params.get('search', None)
#         if search:
#             queryset = queryset.filter(
#                 Q(nom__icontains=search) | 
#                 Q(editeur__icontains=search)
#             )
            
#         return queryset

#     @action(detail=True, methods=['get'])
#     def installations(self, request, pk=None):
#         """Liste toutes les installations d'un logiciel"""
#         logiciel = self.get_object()
#         installations = InstallationLogiciel.objects.filter(logiciel=logiciel)
#         serializer = InstallationLogicielSerializer(installations, many=True)
#         return Response(serializer.data)

# class InstallationLogicielViewSet(viewsets.ModelViewSet):
#     queryset = InstallationLogiciel.objects.all()
#     serializer_class = InstallationLogicielSerializer
#     permission_classes = [AllowAny]  # Temporaire

#     @action(detail=True, methods=['post'])
#     def desinstaller(self, request, pk=None):
#         """Désinstaller un logiciel"""
#         installation = self.get_object()
#         installation.statut = 'desinstalle'
#         installation.save()
        
#         serializer = self.get_serializer(installation)
#         return Response(serializer.data)

# class ReseauViewSet(viewsets.ModelViewSet):
#     queryset = Reseau.objects.all()
#     serializer_class = ReseauSerializer
#     permission_classes = [AllowAny]  # Temporaire

#     @action(detail=False, methods=['get'])
#     def statut_connexion(self, request):
#         """Statistiques des connexions réseau"""
#         total = Reseau.objects.count()
#         connectes = Reseau.objects.filter(statut_connexion='connecte').count()
#         deconnectes = Reseau.objects.filter(statut_connexion='deconnecte').count()
#         instables = Reseau.objects.filter(statut_connexion='instable').count()
        
#         data = {
#             'total': total,
#             'connectes': connectes,
#             'deconnectes': deconnectes,
#             'instables': instables,
#             'taux_connexion': round((connectes / total * 100), 2) if total > 0 else 0
#         }
        
#         return Response(data)

# class IncidentViewSet(viewsets.ModelViewSet):
#     queryset = Incident.objects.all()
#     serializer_class = IncidentSerializer
#     permission_classes = [AllowAny]  # Temporaire

#     def get_queryset(self):
#         """Filtrage personnalisé pour les incidents"""
#         queryset = Incident.objects.all()
        
#         # Filtre par statut
#         statut = self.request.query_params.get('statut', None)
#         if statut:
#             queryset = queryset.filter(statut=statut)
            
#         # Filtre par priorité
#         priorite = self.request.query_params.get('priorite', None)
#         if priorite:
#             queryset = queryset.filter(priorite=priorite)
            
#         # Filtre par type
#         type_incident = self.request.query_params.get('type', None)
#         if type_incident:
#             queryset = queryset.filter(type_incident=type_incident)
            
#         return queryset.order_by('-date_creation')

#     @action(detail=True, methods=['post'])
#     def resoudre(self, request, pk=None):
#         """Marquer un incident comme résolu"""
#         incident = self.get_object()
#         incident.statut = 'resolu'
#         incident.save()
        
#         serializer = self.get_serializer(incident)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def statistiques(self, request):
#         """Statistiques des incidents"""
#         total = Incident.objects.count()
#         ouverts = Incident.objects.filter(statut='ouvert').count()
#         en_cours = Incident.objects.filter(statut='en_cours').count()
#         resolus = Incident.objects.filter(statut='resolu').count()
        
#         par_type = Incident.objects.values('type_incident').annotate(
#             total=Count('id')
#         )
        
#         par_priorite = Incident.objects.values('priorite').annotate(
#             total=Count('id')
#         )
        
#         data = {
#             'total': total,
#             'ouverts': ouverts,
#             'en_cours': en_cours,
#             'resolus': resolus,
#             'par_type': list(par_type),
#             'par_priorite': list(par_priorite)
#         }
        
#         return Response(data)

# class AlerteViewSet(viewsets.ModelViewSet):
#     queryset = Alerte.objects.all()
#     serializer_class = AlerteSerializer
#     permission_classes = [AllowAny]  # Temporaire

#     def get_queryset(self):
#         """Filtrage personnalisé pour les alertes"""
#         queryset = Alerte.objects.all()
        
#         # Filtre par statut
#         statut = self.request.query_params.get('statut', None)
#         if statut:
#             queryset = queryset.filter(statut=statut)
            
#         # Filtre par sévérité
#         severite = self.request.query_params.get('severite', None)
#         if severite:
#             queryset = queryset.filter(severite=severite)
            
#         return queryset.order_by('-date_alerte')

#     @action(detail=True, methods=['post'])
#     def traiter(self, request, pk=None):
#         """Marquer une alerte comme traitée"""
#         alerte = self.get_object()
#         alerte.statut = 'en_traitement'
#         alerte.save()
        
#         # Créer un incident lié si nécessaire
#         if request.data.get('creer_incident', False):
#             incident = Incident.objects.create(
#                 description=f"Incident créé à partir de l'alerte: {alerte.description}",
#                 type_incident='mixte',
#                 priorite=alerte.severite,
#                 materiel_concerne=alerte.materiel_source,
#                 logiciel_concerne=alerte.logiciel_source,
#                 reseau_concerne=alerte.reseau_source,
#                 utilisateur_signaleur=request.user
#             )
#             alerte.incident_lie = incident
#             alerte.save()
        
#         serializer = self.get_serializer(alerte)
#         return Response(serializer.data)
    
    
    
# class ProfilUtilisateurViewSet(viewsets.ModelViewSet):
#     queryset = ProfilUtilisateur.objects.select_related('user').all()
#     serializer_class = ProfilUtilisateurSerializer
    
#     def destroy(self, request, *args, **kwargs):
#         """
#         Surcharge de la suppression pour supprimer l'utilisateur aussi
#         """
#         instance = self.get_object()
        
#         # Vérifier que seul un admin peut supprimer
#         if not request.user.is_superuser:
#             return Response(
#                 {"detail": "Seuls les administrateurs peuvent supprimer des utilisateurs."},
#                 status=status.HTTP_403_FORBIDDEN
#             )
        
#         # Récupérer l'utilisateur avant suppression
#         user_to_delete = instance.user
#         user_username = user_to_delete.username
        
#         # Supprimer l'instance (profil)
#         self.perform_destroy(instance)
        
#         # Supprimer l'utilisateur
#         user_to_delete.delete()
        
#         return Response(
#             {"detail": f"Utilisateur '{user_username}' et son profil supprimés définitivement."},
#             status=status.HTTP_200_OK
#         )
    
    
#     def get_permissions(self):
#         """
#         Permissions personnalisées :
#         - GET : Tous les utilisateurs authentifiés peuvent voir
#         - POST/PUT/PATCH/DELETE : Seulement admin
#         """
#         if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
#             permission_classes = [IsAuthenticated]
#         else:
#             permission_classes = [IsAdmin]
#         return [permission() for permission in permission_classes]
    
#     def get_queryset(self):
#         queryset = ProfilUtilisateur.objects.select_related('user')
        
#         # Les utilisateurs non-admin ne voient que leur propre profil
#         user = self.request.user
#         try:
#             user_profile = ProfilUtilisateur.objects.get(user=user)
#             if user_profile.role != 'admin':
#                 queryset = queryset.filter(user=user)
#         except ProfilUtilisateur.DoesNotExist:
#             # Si pas de profil, ne voir que soi-même
#             queryset = queryset.filter(user=user)
        
#         # Filtrage par recherche
#         search = self.request.query_params.get('search', None)
#         if search:
#             queryset = queryset.filter(
#                 Q(user__username__icontains=search) |
#                 Q(user__first_name__icontains=search) |
#                 Q(user__last_name__icontains=search) |
#                 Q(departement__icontains=search) |
#                 Q(telephone__icontains=search)
#             )
        
#         return queryset.order_by('user__username')
    
#     def create(self, request, *args, **kwargs):
#         """
#         Créer un profil utilisateur
#         Deux modes possibles:
#         1. Création d'un NOUVEL utilisateur + profil
#         2. Association d'un profil à un utilisateur EXISTANT
#         """
#         # Vérifier le mode de création
#         username = request.data.get('username')
#         email = request.data.get('email')
#         password = request.data.get('password')
#         user_username = request.data.get('user_username')
        
#         if username and email and password:
#             # MODE 1: Création d'un NOUVEL utilisateur
#             # Vérifier si l'utilisateur existe déjà
#             if User.objects.filter(username=username).exists():
#                 return Response({
#                     'detail': f"Le nom d'utilisateur '{username}' existe déjà"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             if User.objects.filter(email=email).exists():
#                 return Response({
#                     'detail': f"L'email '{email}' est déjà utilisé"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Créer le nouvel utilisateur
#             name = request.data.get('name', '')
#             name_parts = name.split(' ') if name else []
#             first_name = name_parts[0] if len(name_parts) > 0 else ''
#             last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            
#             user = User.objects.create_user(
#                 username=username,
#                 email=email,
#                 password=password,
#                 first_name=first_name,
#                 last_name=last_name
#             )
            
#             # Créer le profil
#             profil = ProfilUtilisateur.objects.create(
#                 user=user,
#                 departement=request.data.get('departement', 'À définir'),
#                 telephone=request.data.get('telephone', ''),
#                 role=request.data.get('role', 'user')
#             )
            
#             serializer = self.get_serializer(profil)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
                
#         elif user_username:
#             # MODE 2: Utilisateur existant
#             try:
#                 user = User.objects.get(username=user_username)
                
#                 # Vérifier si l'utilisateur a déjà un profil
#                 if ProfilUtilisateur.objects.filter(user=user).exists():
#                     return Response({
#                         'detail': f"L'utilisateur '{user_username}' a déjà un profil"
#                     }, status=status.HTTP_400_BAD_REQUEST)
                
#                 # Créer le profil pour l'utilisateur existant
#                 profil = ProfilUtilisateur.objects.create(
#                     user=user,
#                     departement=request.data.get('departement', 'À définir'),
#                     telephone=request.data.get('telephone', ''),
#                     role=request.data.get('role', 'user')
#                 )
                
#                 serializer = self.get_serializer(profil)
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
                    
#             except User.DoesNotExist:
#                 return Response({
#                     'detail': f"L'utilisateur '{user_username}' n'existe pas"
#                 }, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             # Mode par défaut via serializer
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
#     def update(self, request, *args, **kwargs):
#         """
#         Mettre à jour un profil existant
#         """
#         instance = self.get_object()
        
#         # Mettre à jour l'email de l'utilisateur si fourni
#         if 'email' in request.data:
#             instance.user.email = request.data['email']
#             instance.user.save()
        
#         # Mettre à jour le nom complet si fourni
#         if 'name' in request.data:
#             name = request.data['name']
#             name_parts = name.split(' ') if name else []
#             instance.user.first_name = name_parts[0] if len(name_parts) > 0 else ''
#             instance.user.last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
#             instance.user.save()
        
#         # Mettre à jour les champs du profil
#         serializer = self.get_serializer(instance, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
        
#         return Response(serializer.data)
    
#     @action(detail=False, methods=['get'])
#     def users_without_profile(self, request):
#         """
#         Liste les utilisateurs sans profil
#         """
#         users_with_profile = ProfilUtilisateur.objects.values_list('user_id', flat=True)
#         users = User.objects.filter(is_active=True).exclude(id__in=users_with_profile)
        
#         data = []
#         for user in users:
#             data.append({
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'full_name': f"{user.first_name} {user.last_name}".strip() or user.username
#             })
        
#         return Response(data)

# class TableauDeBordViewSet(viewsets.ViewSet):
#     """Vue pour le tableau de bord avec toutes les statistiques"""
#     permission_classes = [AllowAny]  # Temporaire
    
#     def list(self, request):
#         # Statistiques matériels
#         total_materiels = Materiel.objects.count()
#         materiels_fonctionnels = Materiel.objects.filter(etat='fonctionnel').count()
#         materiels_en_panne = Materiel.objects.filter(etat='en_panne').count()
        
#         # Statistiques incidents
#         incidents_ouverts = Incident.objects.filter(statut__in=['ouvert', 'en_cours']).count()
#         incidents_critiques = Incident.objects.filter(priorite='critique', statut__in=['ouvert', 'en_cours']).count()
        
#         # Statistiques alertes
#         alertes_non_traitees = Alerte.objects.filter(statut='nouvelle').count()
#         alertes_critiques = Alerte.objects.filter(severite='critique', statut='nouvelle').count()
        
#         # Derniers incidents
#         derniers_incidents = Incident.objects.order_by('-date_creation')[:5]
#         incidents_serializer = IncidentSerializer(derniers_incidents, many=True)
        
#         # Dernières alertes
#         dernieres_alertes = Alerte.objects.order_by('-date_alerte')[:5]
#         alertes_serializer = AlerteSerializer(dernieres_alertes, many=True)
        
#         data = {
#             'statistiques': {
#                 'materiels': {
#                     'total': total_materiels,
#                     'fonctionnels': materiels_fonctionnels,
#                     'en_panne': materiels_en_panne,
#                     'taux_fonctionnement': round((materiels_fonctionnels / total_materiels * 100), 2) if total_materiels > 0 else 0
#                 },
#                 'incidents': {
#                     'ouverts': incidents_ouverts,
#                     'critiques': incidents_critiques
#                 },
#                 'alertes': {
#                     'non_traitees': alertes_non_traitees,
#                     'critiques': alertes_critiques
#                 }
#             },
#             'derniers_incidents': incidents_serializer.data,
#             'dernieres_alertes': alertes_serializer.data
#         }
        
#         return Response(data)
    
    
# # Dans views.py

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def custom_register(request):
#     serializer = RegisterSerializer(data=request.data)
    
#     if serializer.is_valid():
#         try:
#             user = serializer.save()
            
#             # Créer automatiquement le token pour la connexion
#             token, created = Token.objects.get_or_create(user=user)
            
#             return Response({
#                 'success': True,
#                 'message': 'Compte créé avec succès',
#                 'token': token.key,
#                 'user': {
#                     'id': user.id,
#                     'username': user.username,
#                     'email': user.email,
#                     'first_name': user.first_name,
#                     'last_name': user.last_name,
#                     'role': user.profilutilisateur.role  # Accéder au rôle via le profil
#                 }
#             }, status=status.HTTP_201_CREATED)
            
#         except Exception as e:
#             return Response({
#                 'success': False,
#                 'message': f'Erreur lors de la création du compte: {str(e)}'
#             }, status=status.HTTP_400_BAD_REQUEST)
    
#     return Response({
#         'success': False,
#         'message': 'Données invalides',
#         'errors': serializer.errors
#     }, status=status.HTTP_400_BAD_REQUEST) 

# class UserSearchView(views.APIView):
#     """
#     Vue pour rechercher des utilisateurs par username ou nom
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         query = request.query_params.get('q', '')
        
#         if not query:
#             return Response([])
        
#         # Chercher les utilisateurs
#         users = User.objects.filter(
#             Q(username__icontains=query) |
#             Q(first_name__icontains=query) |
#             Q(last_name__icontains=query) |
#             Q(email__icontains=query)
#         ).filter(is_active=True)[:10]  # Limite à 10 résultats
        
#         # Exclure ceux qui ont déjà un profil
#         users_with_profile = ProfilUtilisateur.objects.values_list('user_id', flat=True)
#         users = users.exclude(id__in=users_with_profile)
        
#         data = [{
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             'first_name': user.first_name,
#             'last_name': user.last_name,
#             'full_name': user.get_full_name()
#         } for user in users]
        
#         return Response(data)


# # Dans views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class IncidentUserListView(APIView):
#     """
#     Vue spécifique pour récupérer les utilisateurs dans le contexte des incidents
#     Tous les utilisateurs authentifiés peuvent y accéder
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         # Retourner seulement les champs nécessaires pour les incidents
#         users = User.objects.filter(is_active=True).values(
#             'id', 'username', 'first_name', 'last_name', 'email'
#         )
        
#         # Formater pour le frontend
#         data = []
#         for user in users:
#             data.append({
#                 'id': user['id'],
#                 'username': user['username'],
#                 'first_name': user['first_name'],
#                 'last_name': user['last_name'],
#                 'full_name': f"{user['first_name']} {user['last_name']}".strip(),
#                 'email': user['email'] or f"{user['username']}@example.com"
#             })
        
#         return Response(data)
    
# # Dans views.py, ajoutez ces vues

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class UserSimpleListView(APIView):
#     """
#     Endpoint simplifié pour récupérer la liste des utilisateurs
#     Accessible à tous les utilisateurs authentifiés
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         users = User.objects.filter(is_active=True).values(
#             'id', 'username', 'first_name', 'last_name', 'email'
#         )
        
#         users_data = []
#         for user in users:
#             full_name = f"{user['first_name']} {user['last_name']}".strip()
#             if not full_name:
#                 full_name = user['username']
            
#             users_data.append({
#                 'id': user['id'],
#                 'username': user['username'],
#                 'full_name': full_name,
#                 'email': user['email'] or f"{user['username']}@example.com"
#             })
        
#         return Response(users_data)

# class IncidentUserListView(APIView):
#     """
#     Vue spécifique pour les incidents
#     Retourne les données formatées pour le formulaire d'incident
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         # Priorité 1: Récupérer via ProfilUtilisateur si disponible
#         try:
#             from .models import ProfilUtilisateur
#             profils = ProfilUtilisateur.objects.select_related('user').all()
            
#             data = []
#             for profil in profils:
#                 user = profil.user
#                 data.append({
#                     'id': user.id,
#                     'username': user.username,
#                     'first_name': user.first_name or '',
#                     'last_name': user.last_name or '',
#                     'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
#                     'email': user.email or f"{user.username}@example.com",
#                     'role': profil.role,
#                     'departement': profil.departement
#                 })
            
#             return Response(data)
            
#         except Exception:
#             # Fallback: Récupérer directement les utilisateurs
#             users = User.objects.filter(is_active=True)
            
#             data = []
#             for user in users:
#                 data.append({
#                     'id': user.id,
#                     'username': user.username,
#                     'first_name': user.first_name or '',
#                     'last_name': user.last_name or '',
#                     'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
#                     'email': user.email or f"{user.username}@example.com",
#                     'role': 'user',  # Valeur par défaut
#                     'departement': 'Non spécifié'
#                 })
            
#             return Response(data)
        
# # Ajoutez cette vue dans views.py

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def incident_users_list(request):
#     """
#     Endpoint spécifique pour récupérer les utilisateurs 
#     dans le contexte des incidents
#     """
#     users = User.objects.filter(is_active=True)
    
#     # Formater les données pour le frontend
#     data = []
#     for user in users:
#         data.append({
#             'id': user.id,
#             'username': user.username,
#             'first_name': user.first_name or '',
#             'last_name': user.last_name or '',
#             'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
#             'email': user.email or f"{user.username}@example.com"
#         })
    
#     return Response(data)








# # AJOUTEZ CES VUES SIMPLES À VOTRE views.py - À LA FIN DU FICHIER

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth import authenticate
# from rest_framework.authtoken.models import Token
# import json
# from django.utils import timezone

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def simple_login(request):
#     """
#     Endpoint de login SIMPLE pour tester
#     POST: https://gestion-ressource-informatique.onrender.com/login/
#     """
#     try:
#         # Parse les données JSON
#         if isinstance(request.data, dict):
#             data = request.data
#         else:
#             try:
#                 data = json.loads(request.body)
#             except:
#                 data = {}
        
#         username = data.get('username', '').strip()
#         password = data.get('password', '').strip()
        
#         print(f"🔐 Simple login attempt for: {username}")
        
#         # SIMULATION POUR TEST - À REMPLACER PAR VOTRE VÉRIFICATION
#         if username and password:
#             # Essayer d'authentifier l'utilisateur
#             user = authenticate(username=username, password=password)
            
#             if user is not None:
#                 # Utilisateur authentifié - créer token
#                 token, created = Token.objects.get_or_create(user=user)
                
#                 return Response({
#                     'success': True,
#                     'token': token.key,
#                     'user': {
#                         'id': user.id,
#                         'username': user.username,
#                         'email': user.email or f"{user.username}@example.com",
#                         'first_name': user.first_name or '',
#                         'last_name': user.last_name or '',
#                         'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
#                         'role': 'admin' if user.is_superuser else 'user',
#                         'departement': 'Administration' if user.is_superuser else 'Utilisateur'
#                     },
#                     'message': 'Connexion réussie'
#                 })
#             else:
#                 # Authentification échouée - utiliser mode test
#                 from django.utils.crypto import get_random_string
#                 fake_token = get_random_string(40)
                
#                 return Response({
#                     'success': True,  # Toujours true pour test
#                     'token': fake_token,
#                     'user': {
#                         'id': 1,
#                         'username': username,
#                         'email': f'{username}@example.com',
#                         'first_name': 'Test',
#                         'last_name': 'User',
#                         'full_name': username,
#                         'role': 'admin' if username == 'admin' else 'user',
#                         'departement': 'Test'
#                     },
#                     'message': 'Connexion de test (mode simulation)'
#                 })
#         else:
#             return Response({
#                 'success': False,
#                 'message': 'Nom d\'utilisateur et mot de passe requis'
#             }, status=status.HTTP_400_BAD_REQUEST)
            
#     except Exception as e:
#         print(f"❌ Login error: {str(e)}")
#         return Response({
#             'success': False,
#             'message': f'Erreur serveur: {str(e)}'
#         }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['GET'])
# @permission_classes([AllowAny]) 
# def health_check(request):
#     """Endpoint de vérification de santé"""
#     return Response({
#         'status': 'OK',
#         'service': 'Backend Django - Gestion Parc Informatique',
#         'backend_url': 'https://gestion-ressource-informatique.onrender.com',
#         'timestamp': timezone.now().isoformat(),
#         'message': 'API est en ligne'
#     })

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def cors_test(request):
#     """Test CORS - Retourne l'origine pour vérifier"""
#     origin = request.headers.get('Origin', 'Non spécifié')
    
#     return Response({
#         'cors_status': 'CONFIGURÉ',
#         'origin_received': origin,
#         'allowed': True,
#         'message': 'CORS devrait fonctionner',
#         'timestamp': timezone.now().isoformat()
#     })
    
    
    
    
# # AJOUTEZ CETTE FONCTION À LA FIN DE VOTRE views.py

# from django.http import HttpResponse
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def test_page(request):
#     """Page de test simple pour vérifier que Django fonctionne"""
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>✅ Django Backend Fonctionnel</title>
#         <style>
#             body { font-family: Arial, sans-serif; padding: 40px; }
#             .success { color: green; font-weight: bold; }
#             .box { border: 1px solid #ccc; padding: 20px; margin: 10px 0; }
#         </style>
#     </head>
#     <body>
#         <h1 class="success">✅ Backend Django est en ligne !</h1>
#         <p>URL : <strong>https://gestion-ressource-informatique.onrender.com</strong></p>
        
#         <div class="box">
#             <h2>📊 Endpoints disponibles :</h2>
#             <ul>
#                 <li><a href="/health/">/health/</a> - Vérification santé</li>
#                 <li><a href="/cors-test/">/cors-test/</a> - Test CORS</li>
#                 <li><a href="/login/">/login/</a> - Connexion (POST)</li>
#                 <li><a href="/admin/">/admin/</a> - Interface administrateur</li>
#                 <li><a href="/api/users/">/api/users/</a> - Liste utilisateurs</li>
#             </ul>
#         </div>
        
#         <div class="box">
#             <h2>🔧 Test CORS :</h2>
#             <button onclick="testCors()">Tester CORS</button>
#             <div id="cors-result"></div>
#         </div>
        
#         <div class="box">
#             <h2>🔐 Test Login (simulation) :</h2>
#             <button onclick="testLogin()">Tester Login</button>
#             <div id="login-result"></div>
#         </div>
        
#         <script>
#             async function testCors() {
#                 try {
#                     const response = await fetch('/cors-test/');
#                     const data = await response.json();
#                     document.getElementById('cors-result').innerHTML = 
#                         '<p class="success">✅ CORS fonctionne : ' + JSON.stringify(data) + '</p>';
#                 } catch (error) {
#                     document.getElementById('cors-result').innerHTML = 
#                         '<p style="color:red">❌ Erreur CORS : ' + error + '</p>';
#                 }
#             }
            
#             async function testLogin() {
#                 try {
#                     const response = await fetch('/login/', {
#                         method: 'POST',
#                         headers: { 'Content-Type': 'application/json' },
#                         body: JSON.stringify({username: 'test', password: 'test'})
#                     });
#                     const data = await response.json();
#                     document.getElementById('login-result').innerHTML = 
#                         '<p class="success">✅ Login simulation : Token reçu</p>' +
#                         '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
#                 } catch (error) {
#                     document.getElementById('login-result').innerHTML = 
#                         '<p style="color:red">❌ Erreur login : ' + error + '</p>';
#                 }
#             }
            
#             // Test automatique au chargement
#             window.onload = function() {
#                 fetch('/health/')
#                     .then(r => r.json())
#                     .then(data => {
#                         console.log('Health check:', data);
#                     });
#             };
#         </script>
#     </body>
#     </html>
#     """
#     return HttpResponse(html)




# # AJOUTEZ CETTE FONCTION À VOTRE views.py

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth.models import User
# from rest_framework.authtoken.models import Token
# from .serializers import RegisterSerializer
# import json

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def register_user(request):
#     """
#     Inscription utilisateur simple
#     POST /register/ ou /api/register/
#     """
#     try:
#         print("📝 Tentative d'inscription...")
        
#         # Accepter JSON ou form data
#         if hasattr(request, 'data'):
#             data = request.data
#         else:
#             try:
#                 data = json.loads(request.body.decode('utf-8'))
#             except:
#                 data = request.POST
        
#         username = data.get('username', '').strip()
#         email = data.get('email', '').strip()
#         password = data.get('password', '').strip()
#         password_confirm = data.get('password_confirm', data.get('password2', '').strip())
#         first_name = data.get('first_name', data.get('name', '').strip())
#         last_name = data.get('last_name', '')
        
#         print(f"Données reçues: username={username}, email={email}")
        
#         # Validation simple
#         if not username:
#             return Response({
#                 'success': False,
#                 'message': 'Le nom d\'utilisateur est requis'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         if not password:
#             return Response({
#                 'success': False,
#                 'message': 'Le mot de passe est requis'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         if password != password_confirm:
#             return Response({
#                 'success': False,
#                 'message': 'Les mots de passe ne correspondent pas'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Vérifier si l'utilisateur existe déjà
#         if User.objects.filter(username=username).exists():
#             return Response({
#                 'success': False,
#                 'message': f"Le nom d'utilisateur '{username}' est déjà pris"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         if email and User.objects.filter(email=email).exists():
#             return Response({
#                 'success': False,
#                 'message': f"L'email '{email}' est déjà utilisé"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Créer l'utilisateur
#         try:
#             user = User.objects.create_user(
#                 username=username,
#                 email=email if email else f"{username}@example.com",
#                 password=password,
#                 first_name=first_name,
#                 last_name=last_name
#             )
            
#             print(f"✅ Utilisateur créé: {user.username}")
            
#             # Créer le token
#             token, created = Token.objects.get_or_create(user=user)
            
#             # Créer automatiquement un profil
#             try:
#                 from .models import ProfilUtilisateur
#                 profil = ProfilUtilisateur.objects.create(
#                     user=user,
#                     departement=data.get('departement', 'À définir'),
#                     role='user',
#                     telephone=data.get('telephone', '')
#                 )
#                 role = profil.role
#             except:
#                 role = 'user'
            
#             return Response({
#                 'success': True,
#                 'message': 'Compte créé avec succès',
#                 'token': token.key,
#                 'user': {
#                     'id': user.id,
#                     'username': user.username,
#                     'email': user.email,
#                     'first_name': user.first_name,
#                     'last_name': user.last_name,
#                     'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
#                     'role': role
#                 }
#             }, status=status.HTTP_201_CREATED)
            
#         except Exception as e:
#             print(f"❌ Erreur création utilisateur: {e}")
#             return Response({
#                 'success': False,
#                 'message': f'Erreur lors de la création du compte: {str(e)}'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#     except Exception as e:
#         print(f"❌ Erreur inscription: {e}")
#         return Response({
#             'success': False,
#             'message': f'Erreur serveur: {str(e)}'
#         }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
# # AJOUTEZ CES VUES À views.py

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def api_info(request):
#     """Informations sur l'API"""
#     return Response({
#         'api_name': 'Gestion Parc Informatique API',
#         'version': '1.0',
#         'endpoints': {
#             'login': {
#                 'url': '/login/',
#                 'method': 'POST',
#                 'description': 'Connexion utilisateur'
#             },
#             'register': {
#                 'url': '/register/',
#                 'method': 'POST',
#                 'description': 'Inscription utilisateur'
#             },
#             'health': {
#                 'url': '/health/',
#                 'method': 'GET',
#                 'description': 'Vérification santé'
#             },
#             'users': {
#                 'url': '/api/users/',
#                 'method': 'GET',
#                 'description': 'Liste des utilisateurs'
#             }
#         },
#         'backend_url': 'https://gestion-ressource-informatique.onrender.com',
#         'status': 'online'
#     })

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def debug_request(request):
#     """Debug: Affiche les informations de la requête"""
#     return Response({
#         'method': request.method,
#         'path': request.path,
#         'headers': dict(request.headers),
#         'data': request.data if hasattr(request, 'data') else 'No data',
#         'user': str(request.user) if request.user.is_authenticated else 'Anonymous',
#         'query_params': dict(request.query_params)
#     })
    
    
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_current_user_profile(request):
#     """
#     Récupère les informations complètes de l'utilisateur connecté
#     avec son profil (rôle, département, etc.)
#     """
#     user = request.user
    
#     try:
#         profil = ProfilUtilisateur.objects.get(user=user)
#         role = profil.role
#         departement = profil.departement or 'Non spécifié'
#         telephone = profil.telephone or ''
#     except ProfilUtilisateur.DoesNotExist:
#         # Créer un profil par défaut si inexistant
#         profil = ProfilUtilisateur.objects.create(
#             user=user,
#             departement='À définir',
#             role='user',
#             telephone=''
#         )
#         role = 'user'
#         departement = 'À définir'
#         telephone = ''
    
#     data = {
#         'id': user.id,
#         'username': user.username,
#         'email': user.email or f"{user.username}@example.com",
#         'first_name': user.first_name or '',
#         'last_name': user.last_name or '',
#         'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
#         'role': role,
#         'departement': departement,
#         'telephone': telephone,
#         'is_active': user.is_active,
#         'date_joined': user.date_joined,
#         'is_staff': user.is_staff,
#         'is_superuser': user.is_superuser
#     }
    
#     return Response(data)

# # Dans views.py
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def debug_current_user(request):
#     """Endpoint pour déboguer l'utilisateur connecté"""
#     try:
#         profil = ProfilUtilisateur.objects.get(user=request.user)
#         role = profil.role
#     except:
#         role = 'unknown'
    
#     return Response({
#         'user': {
#             'id': request.user.id,
#             'username': request.user.username,
#             'email': request.user.email,
#             'is_authenticated': request.user.is_authenticated,
#             'is_staff': request.user.is_staff,
#             'is_superuser': request.user.is_superuser,
#             'role': role
#         }
#     })
    
# # historique

# # Dans views.py
# from .models import HistoriqueAction
# from .serializers import HistoriqueActionSerializer
# from .services.historique_service import HistoriqueService

# class HistoriqueActionViewSet(viewsets.ReadOnlyModelViewSet):
#     """
#     ViewSet pour consulter l'historique des actions
#     Accessible seulement aux admin et directeur
#     """
#     queryset = HistoriqueAction.objects.all()
#     serializer_class = HistoriqueActionSerializer
#     permission_classes = [IsDirector | IsAdmin]  # Seuls directeurs et admin
    
#     def get_queryset(self):
#         queryset = HistoriqueAction.objects.select_related('utilisateur').all()
        
#         # Filtres
#         module = self.request.query_params.get('module', None)
#         if module:
#             queryset = queryset.filter(module=module)
            
#         action = self.request.query_params.get('action', None)
#         if action:
#             queryset = queryset.filter(action=action)
            
#         utilisateur_id = self.request.query_params.get('utilisateur_id', None)
#         if utilisateur_id:
#             queryset = queryset.filter(utilisateur_id=utilisateur_id)
            
#         date_debut = self.request.query_params.get('date_debut', None)
#         date_fin = self.request.query_params.get('date_fin', None)
        
#         if date_debut:
#             queryset = queryset.filter(date_action__gte=date_debut)
#         if date_fin:
#             queryset = queryset.filter(date_action__lte=date_fin)
        
#         # Recherche
#         search = self.request.query_params.get('search', None)
#         if search:
#             queryset = queryset.filter(
#                 Q(objet_nom__icontains=search) |
#                 Q(description__icontains=search) |
#                 Q(utilisateur__username__icontains=search) |
#                 Q(utilisateur__first_name__icontains=search) |
#                 Q(utilisateur__last_name__icontains=search)
#             )
        
#         return queryset.order_by('-date_action')
    
#     @action(detail=False, methods=['get'])
#     def statistiques(self, request):
#         """Retourne des statistiques sur l'historique"""
#         stats = HistoriqueService.get_statistiques()
#         return Response(stats)
    
#     @action(detail=False, methods=['get'])
#     def mes_actions(self, request):
#         """Retourne l'historique des actions de l'utilisateur connecté"""
#         queryset = self.get_queryset().filter(utilisateur=request.user)
#         page = self.paginate_queryset(queryset)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
        
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)
    
#     @action(detail=False, methods=['get'])
#     def modules(self, request):
#         """Retourne la liste des modules disponibles"""
#         modules = HistoriqueAction.MODULE_CHOICES
#         return Response(modules)
    
#     @action(detail=False, methods=['get'])
#     def actions(self, request):
#         """Retourne la liste des types d'actions disponibles"""
#         actions = HistoriqueAction.TYPE_ACTION
#         return Response(actions)

# # Ajoutez cette vue pour les statistiques d'historique
# @api_view(['GET'])
# @permission_classes([IsDirector | IsAdmin])
# def historique_statistiques(request):
#     """Endpoint pour les statistiques d'historique"""
#     stats = HistoriqueService.get_statistiques()
#     return Response(stats)


# # Dans views.py - MODIFIEZ les ViewSets existants

# from .services.historique_service import HistoriqueService

# class MaterielViewSet(viewsets.ModelViewSet):
#     # ... code existant ...
    
#     def create(self, request, *args, **kwargs):
#         # Code existant...
#         response = super().create(request, *args, **kwargs)
        
#         # Enregistrer dans l'historique
#         if response.status_code == status.HTTP_201_CREATED:
#             data = response.data
#             HistoriqueService.enregistrer_creation(
#                 request=request,
#                 module='materiel',
#                 objet_id=data['id'],
#                 objet_nom=data['nom'],
#                 donnees=data
#             )
        
#         return response
    
#     def update(self, request, *args, **kwargs):
#         # Récupérer les données avant modification
#         instance = self.get_object()
#         donnees_avant = MaterielSerializer(instance).data
        
#         # Exécuter la modification
#         response = super().update(request, *args, **kwargs)
        
#         # Enregistrer dans l'historique
#         if response.status_code == status.HTTP_200_OK:
#             HistoriqueService.enregistrer_modification(
#                 request=request,
#                 module='materiel',
#                 objet_id=instance.id,
#                 objet_nom=instance.nom,
#                 donnees_avant=donnees_avant,
#                 donnees_apres=response.data
#             )
        
#         return response
    
#     def destroy(self, request, *args, **kwargs):
#         # Récupérer les données avant suppression
#         instance = self.get_object()
#         donnees_avant = MaterielSerializer(instance).data
        
#         # Exécuter la suppression
#         response = super().destroy(request, *args, **kwargs)
        
#         # Enregistrer dans l'historique
#         if response.status_code == status.HTTP_204_NO_CONTENT:
#             HistoriqueService.enregistrer_suppression(
#                 request=request,
#                 module='materiel',
#                 objet_id=instance.id,
#                 objet_nom=instance.nom,
#                 donnees_avant=donnees_avant
#             )
        
#         return response

# # Appliquez le même pattern à tous les autres ViewSets:
# # LogicielViewSet, FournisseurViewSet, IncidentViewSet, etc.


# # Dans views.py - Ajoutez ces imports
# from .models import HistoriqueAction
# from .serializers import HistoriqueActionSerializer
# from django.db.models import Count, Q, Max
# from rest_framework.decorators import action
# from django.utils import timezone
# from datetime import timedelta

# # Ajoutez ce ViewSet à la fin de votre fichier
# class HistoriqueActionViewSet(viewsets.ReadOnlyModelViewSet):
#     """
#     ViewSet pour consulter l'historique des actions
#     Accessible seulement aux admin et directeur
#     """
#     queryset = HistoriqueAction.objects.all()
#     serializer_class = HistoriqueActionSerializer
#     permission_classes = [IsDirector | IsAdmin]  # Seuls directeurs et admin
    
#     def get_queryset(self):
#         queryset = HistoriqueAction.objects.select_related('utilisateur').all()
        
#         # Filtres
#         module = self.request.query_params.get('module', None)
#         if module:
#             queryset = queryset.filter(module=module)
            
#         action = self.request.query_params.get('action', None)
#         if action:
#             queryset = queryset.filter(action=action)
            
#         utilisateur_id = self.request.query_params.get('utilisateur_id', None)
#         if utilisateur_id:
#             queryset = queryset.filter(utilisateur_id=utilisateur_id)
            
#         date_debut = self.request.query_params.get('date_debut', None)
#         date_fin = self.request.query_params.get('date_fin', None)
        
#         if date_debut:
#             queryset = queryset.filter(date_action__gte=date_debut)
#         if date_fin:
#             queryset = queryset.filter(date_action__lte=date_fin)
        
#         # Recherche
#         search = self.request.query_params.get('search', None)
#         if search:
#             queryset = queryset.filter(
#                 Q(objet_nom__icontains=search) |
#                 Q(description__icontains=search) |
#                 Q(utilisateur__username__icontains=search) |
#                 Q(utilisateur__first_name__icontains=search) |
#                 Q(utilisateur__last_name__icontains=search)
#             )
        
#         return queryset.order_by('-date_action')
    
#     @action(detail=False, methods=['get'])
#     def statistiques(self, request):
#         """Retourne des statistiques sur l'historique"""
#         total = HistoriqueAction.objects.count()
        
#         par_module = HistoriqueAction.objects.values('module').annotate(
#             total=Count('id'),
#             creations=Count('id', filter=Q(action='creation')),
#             modifications=Count('id', filter=Q(action='modification')),
#             suppressions=Count('id', filter=Q(action='suppression'))
#         )
        
#         # Pour les 30 derniers jours
#         trente_jours = timezone.now() - timedelta(days=30)
        
#         par_jour = HistoriqueAction.objects.filter(
#             date_action__gte=trente_jours
#         ).extra(
#             select={'date': "DATE(date_action)"}
#         ).values('date').annotate(
#             total=Count('id')
#         ).order_by('-date')
        
#         utilisateurs_actifs = HistoriqueAction.objects.values(
#             'utilisateur__username',
#             'utilisateur__first_name',
#             'utilisateur__last_name'
#         ).annotate(
#             total_actions=Count('id'),
#             derniere_action=Max('date_action')
#         ).order_by('-total_actions')[:10]
        
#         data = {
#             'total': total,
#             'par_module': list(par_module),
#             'par_jour': list(par_jour),
#             'utilisateurs_actifs': list(utilisateurs_actifs)
#         }
        
#         return Response(data)
    
#     @action(detail=False, methods=['get'])
#     def mes_actions(self, request):
#         """Retourne l'historique des actions de l'utilisateur connecté"""
#         queryset = self.get_queryset().filter(utilisateur=request.user)
#         page = self.paginate_queryset(queryset)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
        
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)
    
#     @action(detail=False, methods=['get'])
#     def modules(self, request):
#         """Retourne la liste des modules disponibles"""
#         modules = [
#             ['materiel', 'Matériel'],
#             ['logiciel', 'Logiciel'],
#             ['installation_logiciel', 'Installation Logiciel'],
#             ['reseau', 'Réseau'],
#             ['incident', 'Incident'],
#             ['alerte', 'Alerte'],
#             ['reparation', 'Réparation'],
#             ['fournisseur', 'Fournisseur'],
#             ['profil_utilisateur', 'Profil Utilisateur'],
#             ['utilisateur', 'Utilisateur'],
#             ['dashboard', 'Tableau de bord'],
#             ['rapport', 'Rapport'],
#             ['systeme', 'Système'],
#         ]
#         return Response(modules)
    
#     @action(detail=False, methods=['get'])
#     def actions(self, request):
#         """Retourne la liste des types d'actions disponibles"""
#         actions = [
#             ['creation', 'Création'],
#             ['modification', 'Modification'],
#             ['suppression', 'Suppression'],
#             ['consultation', 'Consultation'],
#             ['login', 'Connexion'],
#             ['logout', 'Déconnexion'],
#             ['autre', 'Autre'],
#         ]
#         return Response(actions)
    
    
    
    
# # VOTRE views.py - À LA FIN DU FICHIER, GARDEZ CECI :

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_materiels_en_panne(request):
#     """
#     Endpoint pour récupérer UNIQUEMENT les matériels en panne
#     pour le formulaire d'incident
#     """
#     try:
#         # Filtrer strictement les matériels en panne
#         queryset = Materiel.objects.filter(etat='en_panne')
        
#         # Pour utilisateur standard, ne voir que ses matériels
#         if hasattr(request.user, 'profilutilisateur'):
#             user_profile = request.user.profilutilisateur
#             if user_profile.role == 'user':
#                 nom_utilisateur = request.user.get_full_name()
#                 queryset = queryset.filter(utilisateur_attribue=nom_utilisateur)
        
#         # Si aucun matériel en panne
#         if not queryset.exists():
#             return Response({
#                 'success': True,
#                 'message': 'Aucun matériel en panne trouvé',
#                 'materiels': [],
#                 'count': 0
#             })
        
#         # Format simple pour le frontend
#         data = [
#             {
#                 'id': materiel.id,
#                 'nom': materiel.nom,
#                 'reference': materiel.reference,
#                 'utilisateur_attribue': materiel.utilisateur_attribue or 'Non attribué',
#                 'service_attribue': materiel.service_attribue,
#                 'label': f"{materiel.nom} ({materiel.reference})"
#             }
#             for materiel in queryset
#         ]
        
#         return Response({
#             'success': True,
#             'count': len(data),
#             'materiels': data
#         })
        
#     except Exception as e:
#         return Response({
#             'success': False,
#             'message': f'Erreur: {str(e)}'
#         }, status=500)
        
        
# # AJOUTEZ CETTE CLASSE DANS views.py (vers la fin, avant les dernières fonctions)

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated

# class MaterielsEnPanneView(APIView):
#     """
#     Vue API pour récupérer exclusivement les matériels en panne
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         try:
#             # Filtrer UNIQUEMENT les matériels en panne
#             queryset = Materiel.objects.filter(etat='en_panne')
            
#             # Filtrer par service si spécifié
#             service = request.query_params.get('service', None)
#             if service:
#                 queryset = queryset.filter(service_attribue=service)
            
#             # Pour utilisateur standard, ne voir que ses matériels
#             if hasattr(request.user, 'profilutilisateur'):
#                 user_profile = request.user.profilutilisateur
#                 if user_profile.role == 'user':
#                     nom_utilisateur = request.user.get_full_name()
#                     queryset = queryset.filter(utilisateur_attribue=nom_utilisateur)
            
#             # Si aucun matériel en panne
#             if not queryset.exists():
#                 return Response({
#                     'success': True,
#                     'message': 'Aucun matériel en panne trouvé',
#                     'materiels': [],
#                     'count': 0
#                 })
            
#             # Format simple pour le frontend
#             data = [
#                 {
#                     'id': materiel.id,
#                     'nom': materiel.nom,
#                     'reference': materiel.reference,
#                     'utilisateur_attribue': materiel.utilisateur_attribue or 'Non attribué',
#                     'service_attribue': materiel.service_attribue,
#                     'label': f"{materiel.nom} ({materiel.reference})"
#                 }
#                 for materiel in queryset
#             ]
            
#             return Response({
#                 'success': True,
#                 'count': len(data),
#                 'materiels': data
#             })
            
#         except Exception as e:
#             return Response({
#                 'success': False,
#                 'message': f'Erreur: {str(e)}'
#             }, status=500)
            
            
# # Option temporaire pour tester
# @api_view(['GET'])
# @permission_classes([AllowAny])  # ← Changez à AllowAny temporairement
# def get_materiels_en_panne(request):
#     """
#     Récupère uniquement les matériels en panne
#     Temporairement accessible sans authentification pour tester
#     """
#     # Filtrer uniquement les matériels en panne
#     materiels_en_panne = Materiel.objects.filter(etat='en_panne')
    
#     # Format simple
#     data = [
#         {
#             'id': materiel.id,
#             'nom': materiel.nom,
#             'reference': materiel.reference,
#             'label': f"{materiel.nom} ({materiel.reference})"
#         }
#         for materiel in materiels_en_panne
#     ]
    
#     return Response({
#         'success': True,
#         'message': 'Matériels en panne (test sans auth)',
#         'count': len(data),
#         'materiels': data
#     })
    
    
# # Fichier: votre_app/views.py

# from rest_framework import viewsets, permissions, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from django.utils import timezone
# from .models import Reparation, Materiel
# from .serializers import ReparationSerializer

# # Dans views.py - REPLACE the ReparationViewSet with this
# class ReparationViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet pour gérer les réparations.
#     """
#     queryset = Reparation.objects.all()
#     serializer_class = ReparationSerializer
#     permission_classes = [IsTechnician | IsAdmin]  # Seuls techniciens et admin
    
#     def get_serializer_context(self):
#         """Ajouter le request au contexte du serializer"""
#         context = super().get_serializer_context()
#         context['request'] = self.request
#         return context
    
#     def create(self, request, *args, **kwargs):
#         """Surcharge de la création pour logger les données"""
#         print("🔍 DEBUG ReparationViewSet.create()")
#         print(f"   - request.data: {request.data}")
#         print(f"   - request.user: {request.user.username}")
        
#         # Si date_fin est vide ou 'null' dans la requête, la mettre à None
#         data = request.data.copy()
#         date_fin = data.get('date_fin')
        
#         if date_fin in ['', 'null', None]:
#             data['date_fin'] = None
#             print("   → date_fin définie à None (réparation en cours)")
#         else:
#             print(f"   → date_fin définie à: {date_fin}")
        
#         # Créer le serializer avec les données modifiées
#         serializer = self.get_serializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
        
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
#         # Appeler le parent
#         return super().create(request, *args, **kwargs)
    
#     def perform_create(self, serializer):
#         """S'assurer que le technicien est bien assigné"""
#         user = self.request.user
        
#         # Formater le nom du technicien
#         nom_complet = f"{user.first_name or ''} {user.last_name or ''}".strip()
#         if not nom_complet:
#             nom_complet = user.username
        
#         print(f"   ✅ Technicien à assigner: {nom_complet}")
        
#         # Ajouter le technicien aux données validées
#         serializer.validated_data['technicien_responsable'] = nom_complet
        
#         # Sauvegarder
#         reparation = serializer.save()
        
#         print(f"✅ Réparation #{reparation.id} créée avec technicien: {reparation.technicien_responsable}")
#         print(f"📊 Détails réparation: type={reparation.type_reparation}, date_fin={reparation.date_fin}")
#         return reparation
    
#     def get_queryset(self):
#         """Filtrer les réparations"""
#         queryset = Reparation.objects.select_related('materiel', 'incident').all()
        
#         # Filtres
#         materiel_id = self.request.query_params.get('materiel_id', None)
#         if materiel_id:
#             queryset = queryset.filter(materiel_id=materiel_id)
        
#         statut = self.request.query_params.get('statut', None)
#         if statut == 'en_cours':
#             queryset = queryset.filter(date_fin__isnull=True)
#         elif statut == 'termine':
#             queryset = queryset.filter(date_fin__isnull=False)
        
#         # Pour les techniciens, voir seulement leurs réparations
#         if hasattr(self.request.user, 'profilutilisateur'):
#             profil = self.request.user.profilutilisateur
#             if profil.role == 'technician':
#                 nom_technicien = f"{self.request.user.first_name or ''} {self.request.user.last_name or ''}".strip()
#                 if not nom_technicien:
#                     nom_technicien = self.request.user.username
#                 queryset = queryset.filter(technicien_responsable=nom_technicien)
        
#         return queryset.order_by('-date_debut')
    
#     @action(detail=True, methods=['post'])
#     def terminer(self, request, pk=None):
#         """Terminer une réparation"""
#         reparation = self.get_object()
        
#         # Mettre à jour le technicien
#         user = request.user
#         nom_complet = f"{user.first_name or ''} {user.last_name or ''}".strip()
#         if not nom_complet:
#             nom_complet = user.username
        
#         reparation.date_fin = timezone.now()
#         reparation.technicien_responsable = nom_complet
#         reparation.save()
        
#         serializer = self.get_serializer(reparation)
#         return Response(serializer.data)
    
    
# # À la fin de views.py - Endpoint de test
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def test_reparation(request):
#     """Endpoint de test pour déboguer la création de réparation"""
#     print("🧪 TEST REPARATION ENDPOINT")
#     print(f"   - Méthode: {request.method}")
#     print(f"   - User: {request.user.username}")
#     print(f"   - Données brutes: {request.data}")
#     print(f"   - Headers: {dict(request.headers)}")
    
#     # Tester avec des données minimales
#     test_data = {
#         'description': 'Test réparation',
#         'type_reparation': 'preventive',
#         'cout': 100,
#         'technicien_responsable': f"Test {request.user.username}",
#         'materiel': 1  # ID existant
#     }
    
#     serializer = ReparationSerializer(data=test_data, context={'request': request})
    
#     if serializer.is_valid():
#         print("✅ Serializer valide")
#         print(f"   - Données validées: {serializer.validated_data}")
        
#         # Créer
#         reparation = serializer.save()
        
#         return Response({
#             'success': True,
#             'message': f'Réparation test #{reparation.id} créée',
#             'data': ReparationSerializer(reparation).data
#         })
#     else:
#         print("❌ Serializer invalide")
#         print(f"   - Erreurs: {serializer.errors}")
        
#         return Response({
#             'success': False,
#             'errors': serializer.errors
#         }, status=400)