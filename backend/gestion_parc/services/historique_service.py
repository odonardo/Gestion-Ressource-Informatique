# services/historique_service.py
import json
from django.utils import timezone
from django.contrib.auth.models import User
from ..models import HistoriqueAction
from django.db import transaction

class HistoriqueService:
    """
    Service pour gérer l'historique des actions
    """
    
    @staticmethod
    def enregistrer_action(request, action, module, objet_id=None, objet_nom=None, 
                          description="", donnees_avant=None, donnees_apres=None):
        """
        Enregistre une action dans l'historique
        """
        try:
            with transaction.atomic():
                # Obtenir l'adresse IP
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip_address = x_forwarded_for.split(',')[0]
                else:
                    ip_address = request.META.get('REMOTE_ADDR')
                
                # Obtenir l'user agent
                user_agent = request.META.get('HTTP_USER_AGENT', '')
                
                # Créer l'entrée d'historique
                historique = HistoriqueAction.objects.create(
                    utilisateur=request.user if request.user.is_authenticated else None,
                    action=action,
                    module=module,
                    objet_id=objet_id,
                    objet_nom=objet_nom,
                    description=description,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    date_action=timezone.now(),
                    donnees_avant=donnees_avant,
                    donnees_apres=donnees_apres
                )
                
                return historique
        except Exception as e:
            print(f"❌ Erreur lors de l'enregistrement de l'historique: {e}")
            return None
    
    @staticmethod
    def enregistrer_creation(request, module, objet_id, objet_nom, donnees):
        """
        Enregistre une création
        """
        description = f"Création de {module}: {objet_nom}"
        return HistoriqueService.enregistrer_action(
            request=request,
            action='creation',
            module=module,
            objet_id=objet_id,
            objet_nom=objet_nom,
            description=description,
            donnees_apres=donnees
        )
    
    @staticmethod
    def enregistrer_modification(request, module, objet_id, objet_nom, donnees_avant, donnees_apres):
        """
        Enregistre une modification
        """
        description = f"Modification de {module}: {objet_nom}"
        return HistoriqueService.enregistrer_action(
            request=request,
            action='modification',
            module=module,
            objet_id=objet_id,
            objet_nom=objet_nom,
            description=description,
            donnees_avant=donnees_avant,
            donnees_apres=donnees_apres
        )
    
    @staticmethod
    def enregistrer_suppression(request, module, objet_id, objet_nom, donnees_avant):
        """
        Enregistre une suppression
        """
        description = f"Suppression de {module}: {objet_nom}"
        return HistoriqueService.enregistrer_action(
            request=request,
            action='suppression',
            module=module,
            objet_id=objet_id,
            objet_nom=objet_nom,
            description=description,
            donnees_avant=donnees_avant
        )
    
    @staticmethod
    def enregistrer_connexion(request, user, success=True):
        """
        Enregistre une connexion
        """
        description = f"Connexion {'réussie' if success else 'échouée'} pour {user.username}"
        return HistoriqueService.enregistrer_action(
            request=request,
            action='login',
            module='systeme',
            objet_id=user.id,
            objet_nom=user.username,
            description=description
        )
    
    @staticmethod
    def enregistrer_deconnexion(request, user):
        """
        Enregistre une déconnexion
        """
        description = f"Déconnexion de {user.username}"
        return HistoriqueService.enregistrer_action(
            request=request,
            action='logout',
            module='systeme',
            objet_id=user.id,
            objet_nom=user.username,
            description=description
        )
    
    @staticmethod
    def get_historique_utilisateur(user_id, limit=100):
        """
        Récupère l'historique d'un utilisateur
        """
        return HistoriqueAction.objects.filter(
            utilisateur_id=user_id
        ).order_by('-date_action')[:limit]
    
    @staticmethod
    def get_historique_module(module, limit=100):
        """
        Récupère l'historique d'un module spécifique
        """
        return HistoriqueAction.objects.filter(
            module=module
        ).order_by('-date_action')[:limit]
    
    @staticmethod
    def get_statistiques():
        """
        Récupère des statistiques sur l'historique
        """
        total = HistoriqueAction.objects.count()
        par_module = HistoriqueAction.objects.values('module').annotate(
            total=Count('id'),
            creations=Count('id', filter=Q(action='creation')),
            modifications=Count('id', filter=Q(action='modification')),
            suppressions=Count('id', filter=Q(action='suppression'))
        )
        
        par_jour = HistoriqueAction.objects.extra(
            select={'date': "DATE(date_action)"}
        ).values('date').annotate(
            total=Count('id')
        ).order_by('-date')[:30]
        
        utilisateurs_actifs = HistoriqueAction.objects.values(
            'utilisateur__username',
            'utilisateur__first_name',
            'utilisateur__last_name'
        ).annotate(
            total_actions=Count('id'),
            derniere_action=Max('date_action')
        ).order_by('-total_actions')[:10]
        
        return {
            'total': total,
            'par_module': list(par_module),
            'par_jour': list(par_jour),
            'utilisateurs_actifs': list(utilisateurs_actifs)
        }