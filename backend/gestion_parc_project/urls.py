
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('gestion_parc/', include('gestion_parc.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # IMPORTANT
]



from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('gestion_parc.urls')),  # Supprimé le préfixe 'gestion_parc/'
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    
    
    
]

# from django.contrib import admin
# from django.urls import path, include
# from rest_framework import permissions
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi

# # Configuration Swagger
# schema_view = get_schema_view(
#     openapi.Info(
#         title="API Gestion de Parc Informatique",
#         default_version='v1',
#         description="API pour la gestion du parc informatique DREN Antsimo Andrefana",
#         contact=openapi.Contact(email="support@dren.gov.mg"),
#         license=openapi.License(name="License DREN"),
#     ),
#     public=True,
#     permission_classes=(permissions.AllowAny,),
# )

# urlpatterns = [
#     path('admin/', admin.site.urls),
    
#     # ✅ CORRECTION : Inclure les URLs de l'application gestion_parc
#     path('api/', include('gestion_parc.urls')),
    
#     # Documentation API
#     path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
#     path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
# ]