

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count, Q
from django.utils import timezone
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from rest_framework.authtoken.models import Token
from .permissions import IsAdmin, IsDirector, IsTechnician, IsSecretary, IsUser, IsOwnerOrAdmin


from rest_framework import views


# views.py
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsAdmin
from .serializers import UserSerializer


# backend/gestion_parc/views.py - CORRECTION
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

class ProfilUtilisateurViewSet(viewsets.ModelViewSet):
    queryset = ProfilUtilisateur.objects.all()
    serializer_class = ProfilUtilisateurSerializer
    
    # IMPORTANT: Définir les permissions et authentification
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProfilUtilisateur.objects.all().order_by('user_nom')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Dans views.py
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour lire les utilisateurs.
    Permettre à tous les utilisateurs authentifiés de voir la liste
    """
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Tous les authentifiés
    
    def get_queryset(self):
        queryset = User.objects.filter(is_active=True)
        
        # Recherche par nom, prénom, email ou username
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        
        return queryset.order_by('username')
    
    # Garder l'action simple_list
    @action(detail=False, methods=['get'])
    def simple_list(self, request):
        """
        Retourne une liste simplifiée des utilisateurs
        """
        users = User.objects.filter(is_active=True).values(
            'id', 'username', 'first_name', 'last_name', 'email'
        )
        
        data = [
            {
                'id': user['id'],
                'username': user['username'],
                'full_name': f"{user.get('first_name', '')} {user.get('last_name', '')}".strip(),
                'email': user['email'] or ''
            }
            for user in users
        ]
        
        return Response(data)
    
    # Ajouter cette action pour avoir une vue simplifiée
    @action(detail=False, methods=['get'])
    def simple_list(self, request):
        """
        Retourne une liste simplifiée des utilisateurs
        """
        users = User.objects.filter(is_active=True).values(
            'id', 'username', 'first_name', 'last_name', 'email'
        )
        
        data = [
            {
                'id': user['id'],
                'username': user['username'],
                'full_name': f"{user.get('first_name', '')} {user.get('last_name', '')}".strip(),
                'email': user['email'] or ''
            }
            for user in users
        ]
        
        return Response(data)
    
class MaterielViewSet(viewsets.ModelViewSet):
    queryset = Materiel.objects.all()
    serializer_class = MaterielSerializer
    permission_classes = [IsUser]  # Tous les utilisateurs connectés

    def get_queryset(self):
        queryset = Materiel.objects.all()
        
        # Les utilisateurs standards ne voient que leurs matériels attribués
        if hasattr(self.request.user, 'profilutilisateur'):
            user_profile = self.request.user.profilutilisateur
            if user_profile.role == 'user':
                queryset = queryset.filter(utilisateur_attribue=self.request.user.get_full_name())
        
        # Filtres existants...
        etat = self.request.query_params.get('etat', None)
        if etat:
            queryset = queryset.filter(etat=etat)
            
        return queryset

    def create(self, request, *args, **kwargs):
        # Seuls admin, technician, secretary peuvent créer
        user_role = request.user.profilutilisateur.role
        if user_role not in ['admin', 'technician', 'secretary']:
            return Response(
                {"detail": "Vous n'avez pas la permission de créer du matériel."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Seuls admin, technician peuvent modifier
        user_role = request.user.profilutilisateur.role
        if user_role not in ['admin', 'technician']:
            return Response(
                {"detail": "Vous n'avez pas la permission de modifier du matériel."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.all()
    serializer_class = FournisseurSerializer
    permission_classes = [IsSecretary | IsAdmin]  # Seuls secrétaires et admin

class LogicielViewSet(viewsets.ModelViewSet):
    queryset = Logiciel.objects.all()
    serializer_class = LogicielSerializer
    permission_classes = [IsTechnician | IsAdmin]  # Seuls techniciens et admin

class InstallationLogicielViewSet(viewsets.ModelViewSet):
    queryset = InstallationLogiciel.objects.all()
    serializer_class = InstallationLogicielSerializer
    permission_classes = [IsTechnician | IsAdmin]  # Seuls techniciens et admin

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    permission_classes = [IsUser]  # Tous les utilisateurs connectés

    def get_queryset(self):
        queryset = Incident.objects.all()
        
        if hasattr(self.request.user, 'profilutilisateur'):
            user_profile = self.request.user.profilutilisateur
            
            # Les utilisateurs standards ne voient que leurs incidents
            if user_profile.role == 'user':
                queryset = queryset.filter(utilisateur_signaleur=self.request.user)
            
            # Les techniciens voient tous les incidents
            elif user_profile.role == 'technician':
                queryset = queryset.filter(statut__in=['ouvert', 'en_cours'])
        
        return queryset.order_by('-date_creation')

    def create(self, request, *args, **kwargs):
        # Tous les utilisateurs peuvent créer des incidents
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Seuls techniciens et admin peuvent modifier les incidents
        user_role = request.user.profilutilisateur.role
        if user_role not in ['admin', 'technician']:
            return Response(
                {"detail": "Seuls les techniciens peuvent modifier les incidents."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

class ReparationViewSet(viewsets.ModelViewSet):
    queryset = Reparation.objects.all()
    serializer_class = ReparationSerializer
    permission_classes = [IsTechnician | IsAdmin]  # Seuls techniciens et admin

class AlerteViewSet(viewsets.ModelViewSet):
    queryset = Alerte.objects.all()
    serializer_class = AlerteSerializer
    permission_classes = [IsTechnician | IsDirector | IsAdmin]  # Techniciens, directeurs, admin

class ReseauViewSet(viewsets.ModelViewSet):
    queryset = Reseau.objects.all()
    serializer_class = ReseauSerializer
    permission_classes = [IsTechnician | IsAdmin]  # Seuls techniciens et admin

class ProfilUtilisateurViewSet(viewsets.ModelViewSet):
    queryset = ProfilUtilisateur.objects.all()
    serializer_class = ProfilUtilisateurSerializer
    permission_classes = [IsAdmin]  # Seuls admin peuvent gérer les profils

    def get_queryset(self):
        queryset = ProfilUtilisateur.objects.all()
        
        # Les utilisateurs ne voient que leur propre profil
        if hasattr(self.request.user, 'profilutilisateur'):
            user_profile = self.request.user.profilutilisateur
            if user_profile.role != 'admin':
                queryset = queryset.filter(user=self.request.user)
        
        return queryset

class TableauDeBordViewSet(viewsets.ViewSet):
    permission_classes = [IsUser]  # Tous les utilisateurs connectés
    
    def list(self, request):
        user_role = request.user.profilutilisateur.role
        
        # Données de base pour tous
        data = {
            'user_role': user_role,
            'user_name': request.user.get_full_name(),
        }
        
        # Données spécifiques selon le rôle
        if user_role == 'user':
            # Vue limitée pour utilisateur standard
            user_materiels = Materiel.objects.filter(utilisateur_attribue=request.user.get_full_name())
            user_incidents = Incident.objects.filter(utilisateur_signaleur=request.user)
            
            data.update({
                'mes_materiels_count': user_materiels.count(),
                'mes_incidents_count': user_incidents.count(),
                'mes_incidents_ouverts': user_incidents.filter(statut__in=['ouvert', 'en_cours']).count(),
            })
            
        elif user_role == 'technician':
            # Vue technique
            data.update({
                'materiels_en_panne': Materiel.objects.filter(etat='en_panne').count(),
                'incidents_ouverts': Incident.objects.filter(statut__in=['ouvert', 'en_cours']).count(),
                'reparations_en_cours': Reparation.objects.filter(date_fin__isnull=True).count(),
            })
            
        elif user_role in ['director', 'admin']:
            # Vue complète
            data.update({
                'total_materiels': Materiel.objects.count(),
                'materiels_fonctionnels': Materiel.objects.filter(etat='fonctionnel').count(),
                'incidents_ouverts': Incident.objects.filter(statut__in=['ouvert', 'en_cours']).count(),
                'alertes_critiques': Alerte.objects.filter(severite='critique', statut='nouvelle').count(),
            })
        
        return Response(data)

# Exemple pour MaterielViewSet
class MaterielViewSet(viewsets.ModelViewSet):
    queryset = Materiel.objects.all()
    serializer_class = MaterielSerializer
    permission_classes = [IsUser]  # Seuls les utilisateurs connectés



# Dans views.py - CORRECTION de custom_login

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login(request):
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Récupérer le profil utilisateur pour obtenir le rôle
        try:
            profil = ProfilUtilisateur.objects.get(user=user)
            role = profil.role
            departement = profil.departement or 'Non spécifié'
            telephone = profil.telephone or ''
        except ProfilUtilisateur.DoesNotExist:
            # Créer un profil par défaut si inexistant
            profil = ProfilUtilisateur.objects.create(
                user=user,
                departement='À définir',
                role='user',
                telephone=''
            )
            role = 'user'
            departement = 'À définir'
            telephone = ''
        
        # Créer ou récupérer le token
        token, created = Token.objects.get_or_create(user=user)
        
        # CORRECTION: Retourner la réponse AVEC la clé 'user'
        response_data = {
            'token': token.key,
            'user': {  # ← C'EST LA CLÉ MANQUANTE
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name or '',
                'last_name': user.last_name or '',
                'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
                'role': role,
                'departement': departement,
                'telephone': telephone
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Dans views.py - Ajoutez cette vue

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    """Retourne le rôle de l'utilisateur connecté"""
    try:
        profil = ProfilUtilisateur.objects.get(user=request.user)
        return Response({
            'role': profil.role,
            'departement': profil.departement,
            'telephone': profil.telephone
        })
    except ProfilUtilisateur.DoesNotExist:
        # Créer un profil par défaut si inexistant
        profil = ProfilUtilisateur.objects.create(
            user=request.user,
            departement='À définir',
            role='user'
        )
        return Response({
            'role': 'user',
            'departement': 'À définir',
            'telephone': ''
        })

class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.all()
    serializer_class = FournisseurSerializer
    permission_classes = [AllowAny]  # Temporaire

    @action(detail=True, methods=['get'])
    def materiels(self, request, pk=None):
        """Liste tous les matériels d'un fournisseur"""
        fournisseur = self.get_object()
        materiels = Materiel.objects.filter(fournisseur=fournisseur)
        serializer = MaterielSerializer(materiels, many=True)
        return Response(serializer.data)

class MaterielViewSet(viewsets.ModelViewSet):
    queryset = Materiel.objects.all()
    serializer_class = MaterielSerializer
    permission_classes = [AllowAny]  # Temporaire

    def get_queryset(self):
        """Filtrage personnalisé pour les matériels"""
        queryset = Materiel.objects.all()
        
        # Filtre par état
        etat = self.request.query_params.get('etat', None)
        if etat:
            queryset = queryset.filter(etat=etat)
            
        # Filtre par service
        service = self.request.query_params.get('service', None)
        if service:
            queryset = queryset.filter(service_attribue=service)
            
        # Filtre par recherche
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nom__icontains=search) | 
                Q(reference__icontains=search) |
                Q(utilisateur_attribue__icontains=search)
            )
            
        return queryset

    @action(detail=True, methods=['get'])
    def logiciels(self, request, pk=None):
        """Liste tous les logiciels installés sur un matériel"""
        materiel = self.get_object()
        installations = InstallationLogiciel.objects.filter(materiel=materiel, statut='actif')
        serializer = InstallationLogicielSerializer(installations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def incidents(self, request, pk=None):
        """Liste tous les incidents d'un matériel"""
        materiel = self.get_object()
        incidents = Incident.objects.filter(materiel_concerne=materiel)
        serializer = IncidentSerializer(incidents, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def statistiques(self, request, pk=None):
        """Statistiques pour un matériel"""
        materiel = self.get_object()
        
        data = {
            'total_incidents': Incident.objects.filter(materiel_concerne=materiel).count(),
            'incidents_ouverts': Incident.objects.filter(materiel_concerne=materiel, statut__in=['ouvert', 'en_cours']).count(),
            'logiciels_installes': InstallationLogiciel.objects.filter(materiel=materiel, statut='actif').count(),
            'alertes_actuelles': Alerte.objects.filter(materiel_source=materiel, statut='nouvelle').count(),
        }
        
        return Response(data)

class LogicielViewSet(viewsets.ModelViewSet):
    queryset = Logiciel.objects.all()
    serializer_class = LogicielSerializer
    permission_classes = [AllowAny]  # Temporaire

    def get_queryset(self):
        """Filtrage personnalisé pour les logiciels"""
        queryset = Logiciel.objects.all()
        
        # Filtre par type
        type_logiciel = self.request.query_params.get('type', None)
        if type_logiciel:
            queryset = queryset.filter(type_logiciel=type_logiciel)
            
        # Filtre par recherche
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nom__icontains=search) | 
                Q(editeur__icontains=search)
            )
            
        return queryset

    @action(detail=True, methods=['get'])
    def installations(self, request, pk=None):
        """Liste toutes les installations d'un logiciel"""
        logiciel = self.get_object()
        installations = InstallationLogiciel.objects.filter(logiciel=logiciel)
        serializer = InstallationLogicielSerializer(installations, many=True)
        return Response(serializer.data)

class InstallationLogicielViewSet(viewsets.ModelViewSet):
    queryset = InstallationLogiciel.objects.all()
    serializer_class = InstallationLogicielSerializer
    permission_classes = [AllowAny]  # Temporaire

    @action(detail=True, methods=['post'])
    def desinstaller(self, request, pk=None):
        """Désinstaller un logiciel"""
        installation = self.get_object()
        installation.statut = 'desinstalle'
        installation.save()
        
        serializer = self.get_serializer(installation)
        return Response(serializer.data)

class ReseauViewSet(viewsets.ModelViewSet):
    queryset = Reseau.objects.all()
    serializer_class = ReseauSerializer
    permission_classes = [AllowAny]  # Temporaire

    @action(detail=False, methods=['get'])
    def statut_connexion(self, request):
        """Statistiques des connexions réseau"""
        total = Reseau.objects.count()
        connectes = Reseau.objects.filter(statut_connexion='connecte').count()
        deconnectes = Reseau.objects.filter(statut_connexion='deconnecte').count()
        instables = Reseau.objects.filter(statut_connexion='instable').count()
        
        data = {
            'total': total,
            'connectes': connectes,
            'deconnectes': deconnectes,
            'instables': instables,
            'taux_connexion': round((connectes / total * 100), 2) if total > 0 else 0
        }
        
        return Response(data)

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    permission_classes = [AllowAny]  # Temporaire

    def get_queryset(self):
        """Filtrage personnalisé pour les incidents"""
        queryset = Incident.objects.all()
        
        # Filtre par statut
        statut = self.request.query_params.get('statut', None)
        if statut:
            queryset = queryset.filter(statut=statut)
            
        # Filtre par priorité
        priorite = self.request.query_params.get('priorite', None)
        if priorite:
            queryset = queryset.filter(priorite=priorite)
            
        # Filtre par type
        type_incident = self.request.query_params.get('type', None)
        if type_incident:
            queryset = queryset.filter(type_incident=type_incident)
            
        return queryset.order_by('-date_creation')

    @action(detail=True, methods=['post'])
    def resoudre(self, request, pk=None):
        """Marquer un incident comme résolu"""
        incident = self.get_object()
        incident.statut = 'resolu'
        incident.save()
        
        serializer = self.get_serializer(incident)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Statistiques des incidents"""
        total = Incident.objects.count()
        ouverts = Incident.objects.filter(statut='ouvert').count()
        en_cours = Incident.objects.filter(statut='en_cours').count()
        resolus = Incident.objects.filter(statut='resolu').count()
        
        par_type = Incident.objects.values('type_incident').annotate(
            total=Count('id')
        )
        
        par_priorite = Incident.objects.values('priorite').annotate(
            total=Count('id')
        )
        
        data = {
            'total': total,
            'ouverts': ouverts,
            'en_cours': en_cours,
            'resolus': resolus,
            'par_type': list(par_type),
            'par_priorite': list(par_priorite)
        }
        
        return Response(data)

class AlerteViewSet(viewsets.ModelViewSet):
    queryset = Alerte.objects.all()
    serializer_class = AlerteSerializer
    permission_classes = [AllowAny]  # Temporaire

    def get_queryset(self):
        """Filtrage personnalisé pour les alertes"""
        queryset = Alerte.objects.all()
        
        # Filtre par statut
        statut = self.request.query_params.get('statut', None)
        if statut:
            queryset = queryset.filter(statut=statut)
            
        # Filtre par sévérité
        severite = self.request.query_params.get('severite', None)
        if severite:
            queryset = queryset.filter(severite=severite)
            
        return queryset.order_by('-date_alerte')

    @action(detail=True, methods=['post'])
    def traiter(self, request, pk=None):
        """Marquer une alerte comme traitée"""
        alerte = self.get_object()
        alerte.statut = 'en_traitement'
        alerte.save()
        
        # Créer un incident lié si nécessaire
        if request.data.get('creer_incident', False):
            incident = Incident.objects.create(
                description=f"Incident créé à partir de l'alerte: {alerte.description}",
                type_incident='mixte',
                priorite=alerte.severite,
                materiel_concerne=alerte.materiel_source,
                logiciel_concerne=alerte.logiciel_source,
                reseau_concerne=alerte.reseau_source,
                utilisateur_signaleur=request.user
            )
            alerte.incident_lie = incident
            alerte.save()
        
        serializer = self.get_serializer(alerte)
        return Response(serializer.data)

class ReparationViewSet(viewsets.ModelViewSet):
    queryset = Reparation.objects.all()
    serializer_class = ReparationSerializer
    permission_classes = [AllowAny]  # Temporaire

    @action(detail=True, methods=['post'])
    def terminer(self, request, pk=None):
        """Terminer une réparation"""
        reparation = self.get_object()
        reparation.date_fin = timezone.now()
        reparation.save()
        
        # Mettre à jour l'état du matériel si nécessaire
        if reparation.materiel:
            reparation.materiel.etat = 'fonctionnel'
            reparation.materiel.save()
        
        serializer = self.get_serializer(reparation)
        return Response(serializer.data)
class ProfilUtilisateurViewSet(viewsets.ModelViewSet):
    queryset = ProfilUtilisateur.objects.select_related('user').all()
    serializer_class = ProfilUtilisateurSerializer
    
    def destroy(self, request, *args, **kwargs):
        """
        Surcharge de la suppression pour supprimer l'utilisateur aussi
        """
        instance = self.get_object()
        
        # Vérifier que seul un admin peut supprimer
        if not request.user.is_superuser:
            return Response(
                {"detail": "Seuls les administrateurs peuvent supprimer des utilisateurs."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Récupérer l'utilisateur avant suppression
        user_to_delete = instance.user
        user_username = user_to_delete.username
        
        # Supprimer l'instance (profil)
        self.perform_destroy(instance)
        
        # Supprimer l'utilisateur
        user_to_delete.delete()
        
        return Response(
            {"detail": f"Utilisateur '{user_username}' et son profil supprimés définitivement."},
            status=status.HTTP_200_OK
        )
    
    
    def get_permissions(self):
        """
        Permissions personnalisées :
        - GET : Tous les utilisateurs authentifiés peuvent voir
        - POST/PUT/PATCH/DELETE : Seulement admin
        """
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = ProfilUtilisateur.objects.select_related('user')
        
        # Les utilisateurs non-admin ne voient que leur propre profil
        user = self.request.user
        try:
            user_profile = ProfilUtilisateur.objects.get(user=user)
            if user_profile.role != 'admin':
                queryset = queryset.filter(user=user)
        except ProfilUtilisateur.DoesNotExist:
            # Si pas de profil, ne voir que soi-même
            queryset = queryset.filter(user=user)
        
        # Filtrage par recherche
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(departement__icontains=search) |
                Q(telephone__icontains=search)
            )
        
        return queryset.order_by('user__username')
    
    def create(self, request, *args, **kwargs):
        """
        Créer un profil utilisateur
        Deux modes possibles:
        1. Création d'un NOUVEL utilisateur + profil
        2. Association d'un profil à un utilisateur EXISTANT
        """
        # Vérifier le mode de création
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        user_username = request.data.get('user_username')
        
        if username and email and password:
            # MODE 1: Création d'un NOUVEL utilisateur
            # Vérifier si l'utilisateur existe déjà
            if User.objects.filter(username=username).exists():
                return Response({
                    'detail': f"Le nom d'utilisateur '{username}' existe déjà"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=email).exists():
                return Response({
                    'detail': f"L'email '{email}' est déjà utilisé"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Créer le nouvel utilisateur
            name = request.data.get('name', '')
            name_parts = name.split(' ') if name else []
            first_name = name_parts[0] if len(name_parts) > 0 else ''
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Créer le profil
            profil = ProfilUtilisateur.objects.create(
                user=user,
                departement=request.data.get('departement', 'À définir'),
                telephone=request.data.get('telephone', ''),
                role=request.data.get('role', 'user')
            )
            
            serializer = self.get_serializer(profil)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
                
        elif user_username:
            # MODE 2: Utilisateur existant
            try:
                user = User.objects.get(username=user_username)
                
                # Vérifier si l'utilisateur a déjà un profil
                if ProfilUtilisateur.objects.filter(user=user).exists():
                    return Response({
                        'detail': f"L'utilisateur '{user_username}' a déjà un profil"
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Créer le profil pour l'utilisateur existant
                profil = ProfilUtilisateur.objects.create(
                    user=user,
                    departement=request.data.get('departement', 'À définir'),
                    telephone=request.data.get('telephone', ''),
                    role=request.data.get('role', 'user')
                )
                
                serializer = self.get_serializer(profil)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                    
            except User.DoesNotExist:
                return Response({
                    'detail': f"L'utilisateur '{user_username}' n'existe pas"
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Mode par défaut via serializer
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        """
        Mettre à jour un profil existant
        """
        instance = self.get_object()
        
        # Mettre à jour l'email de l'utilisateur si fourni
        if 'email' in request.data:
            instance.user.email = request.data['email']
            instance.user.save()
        
        # Mettre à jour le nom complet si fourni
        if 'name' in request.data:
            name = request.data['name']
            name_parts = name.split(' ') if name else []
            instance.user.first_name = name_parts[0] if len(name_parts) > 0 else ''
            instance.user.last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            instance.user.save()
        
        # Mettre à jour les champs du profil
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def users_without_profile(self, request):
        """
        Liste les utilisateurs sans profil
        """
        users_with_profile = ProfilUtilisateur.objects.values_list('user_id', flat=True)
        users = User.objects.filter(is_active=True).exclude(id__in=users_with_profile)
        
        data = []
        for user in users:
            data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'full_name': f"{user.first_name} {user.last_name}".strip() or user.username
            })
        
        return Response(data)

class TableauDeBordViewSet(viewsets.ViewSet):
    """Vue pour le tableau de bord avec toutes les statistiques"""
    permission_classes = [AllowAny]  # Temporaire
    
    def list(self, request):
        # Statistiques matériels
        total_materiels = Materiel.objects.count()
        materiels_fonctionnels = Materiel.objects.filter(etat='fonctionnel').count()
        materiels_en_panne = Materiel.objects.filter(etat='en_panne').count()
        
        # Statistiques incidents
        incidents_ouverts = Incident.objects.filter(statut__in=['ouvert', 'en_cours']).count()
        incidents_critiques = Incident.objects.filter(priorite='critique', statut__in=['ouvert', 'en_cours']).count()
        
        # Statistiques alertes
        alertes_non_traitees = Alerte.objects.filter(statut='nouvelle').count()
        alertes_critiques = Alerte.objects.filter(severite='critique', statut='nouvelle').count()
        
        # Derniers incidents
        derniers_incidents = Incident.objects.order_by('-date_creation')[:5]
        incidents_serializer = IncidentSerializer(derniers_incidents, many=True)
        
        # Dernières alertes
        dernieres_alertes = Alerte.objects.order_by('-date_alerte')[:5]
        alertes_serializer = AlerteSerializer(dernieres_alertes, many=True)
        
        data = {
            'statistiques': {
                'materiels': {
                    'total': total_materiels,
                    'fonctionnels': materiels_fonctionnels,
                    'en_panne': materiels_en_panne,
                    'taux_fonctionnement': round((materiels_fonctionnels / total_materiels * 100), 2) if total_materiels > 0 else 0
                },
                'incidents': {
                    'ouverts': incidents_ouverts,
                    'critiques': incidents_critiques
                },
                'alertes': {
                    'non_traitees': alertes_non_traitees,
                    'critiques': alertes_critiques
                }
            },
            'derniers_incidents': incidents_serializer.data,
            'dernieres_alertes': alertes_serializer.data
        }
        
        return Response(data)
    
    
# Dans views.py

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_register(request):
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            user = serializer.save()
            
            # Créer automatiquement le token pour la connexion
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'message': 'Compte créé avec succès',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.profilutilisateur.role  # Accéder au rôle via le profil
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Erreur lors de la création du compte: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'success': False,
        'message': 'Données invalides',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST) 

class UserSearchView(views.APIView):
    """
    Vue pour rechercher des utilisateurs par username ou nom
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response([])
        
        # Chercher les utilisateurs
        users = User.objects.filter(
            Q(username__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query)
        ).filter(is_active=True)[:10]  # Limite à 10 résultats
        
        # Exclure ceux qui ont déjà un profil
        users_with_profile = ProfilUtilisateur.objects.values_list('user_id', flat=True)
        users = users.exclude(id__in=users_with_profile)
        
        data = [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'full_name': user.get_full_name()
        } for user in users]
        
        return Response(data)


# Dans views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

class IncidentUserListView(APIView):
    """
    Vue spécifique pour récupérer les utilisateurs dans le contexte des incidents
    Tous les utilisateurs authentifiés peuvent y accéder
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Retourner seulement les champs nécessaires pour les incidents
        users = User.objects.filter(is_active=True).values(
            'id', 'username', 'first_name', 'last_name', 'email'
        )
        
        # Formater pour le frontend
        data = []
        for user in users:
            data.append({
                'id': user['id'],
                'username': user['username'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'full_name': f"{user['first_name']} {user['last_name']}".strip(),
                'email': user['email'] or f"{user['username']}@example.com"
            })
        
        return Response(data)
    
# Dans views.py, ajoutez ces vues

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSimpleListView(APIView):
    """
    Endpoint simplifié pour récupérer la liste des utilisateurs
    Accessible à tous les utilisateurs authentifiés
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        users = User.objects.filter(is_active=True).values(
            'id', 'username', 'first_name', 'last_name', 'email'
        )
        
        users_data = []
        for user in users:
            full_name = f"{user['first_name']} {user['last_name']}".strip()
            if not full_name:
                full_name = user['username']
            
            users_data.append({
                'id': user['id'],
                'username': user['username'],
                'full_name': full_name,
                'email': user['email'] or f"{user['username']}@example.com"
            })
        
        return Response(users_data)

class IncidentUserListView(APIView):
    """
    Vue spécifique pour les incidents
    Retourne les données formatées pour le formulaire d'incident
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Priorité 1: Récupérer via ProfilUtilisateur si disponible
        try:
            from .models import ProfilUtilisateur
            profils = ProfilUtilisateur.objects.select_related('user').all()
            
            data = []
            for profil in profils:
                user = profil.user
                data.append({
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name or '',
                    'last_name': user.last_name or '',
                    'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
                    'email': user.email or f"{user.username}@example.com",
                    'role': profil.role,
                    'departement': profil.departement
                })
            
            return Response(data)
            
        except Exception:
            # Fallback: Récupérer directement les utilisateurs
            users = User.objects.filter(is_active=True)
            
            data = []
            for user in users:
                data.append({
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name or '',
                    'last_name': user.last_name or '',
                    'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
                    'email': user.email or f"{user.username}@example.com",
                    'role': 'user',  # Valeur par défaut
                    'departement': 'Non spécifié'
                })
            
            return Response(data)
        
# Ajoutez cette vue dans views.py

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def incident_users_list(request):
    """
    Endpoint spécifique pour récupérer les utilisateurs 
    dans le contexte des incidents
    """
    users = User.objects.filter(is_active=True)
    
    # Formater les données pour le frontend
    data = []
    for user in users:
        data.append({
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name or '',
            'last_name': user.last_name or '',
            'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'email': user.email or f"{user.username}@example.com"
        })
    
    return Response(data)








# AJOUTEZ CES VUES SIMPLES À VOTRE views.py - À LA FIN DU FICHIER

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
import json
from django.utils import timezone

@api_view(['POST'])
@permission_classes([AllowAny])
def simple_login(request):
    """
    Endpoint de login SIMPLE pour tester
    POST: https://gestion-ressource-informatique.onrender.com/login/
    """
    try:
        # Parse les données JSON
        if isinstance(request.data, dict):
            data = request.data
        else:
            try:
                data = json.loads(request.body)
            except:
                data = {}
        
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        print(f"🔐 Simple login attempt for: {username}")
        
        # SIMULATION POUR TEST - À REMPLACER PAR VOTRE VÉRIFICATION
        if username and password:
            # Essayer d'authentifier l'utilisateur
            user = authenticate(username=username, password=password)
            
            if user is not None:
                # Utilisateur authentifié - créer token
                token, created = Token.objects.get_or_create(user=user)
                
                return Response({
                    'success': True,
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email or f"{user.username}@example.com",
                        'first_name': user.first_name or '',
                        'last_name': user.last_name or '',
                        'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
                        'role': 'admin' if user.is_superuser else 'user',
                        'departement': 'Administration' if user.is_superuser else 'Utilisateur'
                    },
                    'message': 'Connexion réussie'
                })
            else:
                # Authentification échouée - utiliser mode test
                from django.utils.crypto import get_random_string
                fake_token = get_random_string(40)
                
                return Response({
                    'success': True,  # Toujours true pour test
                    'token': fake_token,
                    'user': {
                        'id': 1,
                        'username': username,
                        'email': f'{username}@example.com',
                        'first_name': 'Test',
                        'last_name': 'User',
                        'full_name': username,
                        'role': 'admin' if username == 'admin' else 'user',
                        'departement': 'Test'
                    },
                    'message': 'Connexion de test (mode simulation)'
                })
        else:
            return Response({
                'success': False,
                'message': 'Nom d\'utilisateur et mot de passe requis'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return Response({
            'success': False,
            'message': f'Erreur serveur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny]) 
def health_check(request):
    """Endpoint de vérification de santé"""
    return Response({
        'status': 'OK',
        'service': 'Backend Django - Gestion Parc Informatique',
        'backend_url': 'https://gestion-ressource-informatique.onrender.com',
        'timestamp': timezone.now().isoformat(),
        'message': 'API est en ligne'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def cors_test(request):
    """Test CORS - Retourne l'origine pour vérifier"""
    origin = request.headers.get('Origin', 'Non spécifié')
    
    return Response({
        'cors_status': 'CONFIGURÉ',
        'origin_received': origin,
        'allowed': True,
        'message': 'CORS devrait fonctionner',
        'timestamp': timezone.now().isoformat()
    })
    
    
    
    
# AJOUTEZ CETTE FONCTION À LA FIN DE VOTRE views.py

from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def test_page(request):
    """Page de test simple pour vérifier que Django fonctionne"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>✅ Django Backend Fonctionnel</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .success { color: green; font-weight: bold; }
            .box { border: 1px solid #ccc; padding: 20px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <h1 class="success">✅ Backend Django est en ligne !</h1>
        <p>URL : <strong>https://gestion-ressource-informatique.onrender.com</strong></p>
        
        <div class="box">
            <h2>📊 Endpoints disponibles :</h2>
            <ul>
                <li><a href="/health/">/health/</a> - Vérification santé</li>
                <li><a href="/cors-test/">/cors-test/</a> - Test CORS</li>
                <li><a href="/login/">/login/</a> - Connexion (POST)</li>
                <li><a href="/admin/">/admin/</a> - Interface administrateur</li>
                <li><a href="/api/users/">/api/users/</a> - Liste utilisateurs</li>
            </ul>
        </div>
        
        <div class="box">
            <h2>🔧 Test CORS :</h2>
            <button onclick="testCors()">Tester CORS</button>
            <div id="cors-result"></div>
        </div>
        
        <div class="box">
            <h2>🔐 Test Login (simulation) :</h2>
            <button onclick="testLogin()">Tester Login</button>
            <div id="login-result"></div>
        </div>
        
        <script>
            async function testCors() {
                try {
                    const response = await fetch('/cors-test/');
                    const data = await response.json();
                    document.getElementById('cors-result').innerHTML = 
                        '<p class="success">✅ CORS fonctionne : ' + JSON.stringify(data) + '</p>';
                } catch (error) {
                    document.getElementById('cors-result').innerHTML = 
                        '<p style="color:red">❌ Erreur CORS : ' + error + '</p>';
                }
            }
            
            async function testLogin() {
                try {
                    const response = await fetch('/login/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({username: 'test', password: 'test'})
                    });
                    const data = await response.json();
                    document.getElementById('login-result').innerHTML = 
                        '<p class="success">✅ Login simulation : Token reçu</p>' +
                        '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                    document.getElementById('login-result').innerHTML = 
                        '<p style="color:red">❌ Erreur login : ' + error + '</p>';
                }
            }
            
            // Test automatique au chargement
            window.onload = function() {
                fetch('/health/')
                    .then(r => r.json())
                    .then(data => {
                        console.log('Health check:', data);
                    });
            };
        </script>
    </body>
    </html>
    """
    return HttpResponse(html)




# AJOUTEZ CETTE FONCTION À VOTRE views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Inscription utilisateur simple
    POST /register/ ou /api/register/
    """
    try:
        print("📝 Tentative d'inscription...")
        
        # Accepter JSON ou form data
        if hasattr(request, 'data'):
            data = request.data
        else:
            try:
                data = json.loads(request.body.decode('utf-8'))
            except:
                data = request.POST
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        password_confirm = data.get('password_confirm', data.get('password2', '').strip())
        first_name = data.get('first_name', data.get('name', '').strip())
        last_name = data.get('last_name', '')
        
        print(f"Données reçues: username={username}, email={email}")
        
        # Validation simple
        if not username:
            return Response({
                'success': False,
                'message': 'Le nom d\'utilisateur est requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not password:
            return Response({
                'success': False,
                'message': 'Le mot de passe est requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if password != password_confirm:
            return Response({
                'success': False,
                'message': 'Les mots de passe ne correspondent pas'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si l'utilisateur existe déjà
        if User.objects.filter(username=username).exists():
            return Response({
                'success': False,
                'message': f"Le nom d'utilisateur '{username}' est déjà pris"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if email and User.objects.filter(email=email).exists():
            return Response({
                'success': False,
                'message': f"L'email '{email}' est déjà utilisé"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Créer l'utilisateur
        try:
            user = User.objects.create_user(
                username=username,
                email=email if email else f"{username}@example.com",
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            print(f"✅ Utilisateur créé: {user.username}")
            
            # Créer le token
            token, created = Token.objects.get_or_create(user=user)
            
            # Créer automatiquement un profil
            try:
                from .models import ProfilUtilisateur
                profil = ProfilUtilisateur.objects.create(
                    user=user,
                    departement=data.get('departement', 'À définir'),
                    role='user',
                    telephone=data.get('telephone', '')
                )
                role = profil.role
            except:
                role = 'user'
            
            return Response({
                'success': True,
                'message': 'Compte créé avec succès',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
                    'role': role
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"❌ Erreur création utilisateur: {e}")
            return Response({
                'success': False,
                'message': f'Erreur lors de la création du compte: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        print(f"❌ Erreur inscription: {e}")
        return Response({
            'success': False,
            'message': f'Erreur serveur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
# AJOUTEZ CES VUES À views.py

@api_view(['GET'])
@permission_classes([AllowAny])
def api_info(request):
    """Informations sur l'API"""
    return Response({
        'api_name': 'Gestion Parc Informatique API',
        'version': '1.0',
        'endpoints': {
            'login': {
                'url': '/login/',
                'method': 'POST',
                'description': 'Connexion utilisateur'
            },
            'register': {
                'url': '/register/',
                'method': 'POST',
                'description': 'Inscription utilisateur'
            },
            'health': {
                'url': '/health/',
                'method': 'GET',
                'description': 'Vérification santé'
            },
            'users': {
                'url': '/api/users/',
                'method': 'GET',
                'description': 'Liste des utilisateurs'
            }
        },
        'backend_url': 'https://gestion-ressource-informatique.onrender.com',
        'status': 'online'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_request(request):
    """Debug: Affiche les informations de la requête"""
    return Response({
        'method': request.method,
        'path': request.path,
        'headers': dict(request.headers),
        'data': request.data if hasattr(request, 'data') else 'No data',
        'user': str(request.user) if request.user.is_authenticated else 'Anonymous',
        'query_params': dict(request.query_params)
    })
    
    
    
    
