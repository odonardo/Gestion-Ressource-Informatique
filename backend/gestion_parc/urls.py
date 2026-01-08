from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import incident_users_list

router = DefaultRouter()
router.register(r'fournisseurs', views.FournisseurViewSet, basename='fournisseur')
router.register(r'materiels', views.MaterielViewSet, basename='materiel')
router.register(r'logiciels', views.LogicielViewSet, basename='logiciel')
router.register(r'installations', views.InstallationLogicielViewSet, basename='installation')
router.register(r'reseau', views.ReseauViewSet, basename='reseau')
router.register(r'incidents', views.IncidentViewSet, basename='incident')
router.register(r'alertes', views.AlerteViewSet, basename='alerte')
router.register(r'reparations', views.ReparationViewSet, basename='reparation')
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'profils-utilisateurs', views.ProfilUtilisateurViewSet, basename='profilutilisateur')
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
    
    
    path('api/', include(router.urls)),  # Inclure avec préfixe 'api/'
]





# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from . import views

# router = DefaultRouter()
# router.register(r'fournisseurs', views.FournisseurViewSet, basename='fournisseur')
# router.register(r'materiels', views.MaterielViewSet, basename='materiel')
# router.register(r'logiciels', views.LogicielViewSet, basename='logiciel')
# router.register(r'installations', views.InstallationLogicielViewSet, basename='installation')
# router.register(r'reseau', views.ReseauViewSet, basename='reseau')
# router.register(r'incidents', views.IncidentViewSet, basename='incident')
# router.register(r'alertes', views.AlerteViewSet, basename='alerte')
# router.register(r'reparations', views.ReparationViewSet, basename='reparation')
# router.register(r'users', views.UserViewSet, basename='user')
# router.register(r'profils-utilisateurs', views.ProfilUtilisateurViewSet, basename='profilutilisateur')

# urlpatterns = [
#     path('', include(router.urls)),
    
#     # Authentification
#     path('login/', views.custom_login, name='custom_login'),
#     path('register/', views.custom_register, name='custom_register'),
#     path('user-info/', views.user_info, name='user-info'),
    
#     # Tableau de bord
#     path('tableau-de-bord/', views.TableauDeBordViewSet.as_view({'get': 'list'}), name='tableau-de-bord'),
    
#     # Endpoints spécifiques pour les utilisateurs
#     path('search-users/', views.UserSearchView.as_view(), name='search-users'),
#     path('users/simple_list/', views.UserSimpleListView.as_view(), name='users-simple-list'),
#     path('incident-users/', views.IncidentUserListView.as_view(), name='incident-users'),
    
    
#     # path('api/', include(router.urls)),  # Inclure avec préfixe 'api/'
    
#     # IMPORTANT: NE PAS ajouter path('api/', include(router.urls)) ici
#     # car router.urls contient déjà tous les endpoints avec préfixe correct
# ]