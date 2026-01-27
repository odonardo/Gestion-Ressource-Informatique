# decorators.py
from functools import wraps
from .services.historique_service import HistoriqueService

def enregistrer_historique(action, module):
    """
    Décorateur pour enregistrer automatiquement l'historique
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Exécuter la vue
            response = view_func(request, *args, **kwargs)
            
            # Enregistrer l'historique si succès
            if response.status_code in [200, 201, 204]:
                try:
                    objet_id = kwargs.get('pk') or response.data.get('id')
                    objet_nom = response.data.get('nom') or response.data.get('title') or "Objet"
                    
                    HistoriqueService.enregistrer_action(
                        request=request,
                        action=action,
                        module=module,
                        objet_id=objet_id,
                        objet_nom=objet_nom,
                        description=f"{action.capitalize()} {module} par {request.user.username}"
                    )
                except Exception as e:
                    print(f"Erreur historique: {e}")
            
            return response
        return wrapper
    return decorator