
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

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

urlpatterns += staticfiles_urlpatterns()
