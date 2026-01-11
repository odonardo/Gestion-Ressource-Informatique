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
    path('login/', views.simple_login, name='login'),  # IMPORTANT: Route racine
    path('api/login/', views.simple_login, name='api-login'),
    # path('login', views.simple_login),  # Sans slash aussi
    
    
    path('api/', include(router.urls)),  # Inclure avec préfixe 'api/'
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