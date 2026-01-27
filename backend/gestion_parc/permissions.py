

from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Permission pour les administrateurs seulement
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'profilutilisateur') and 
            request.user.profilutilisateur.role == 'admin'
        )

class IsDirector(permissions.BasePermission):
    """
    Permission pour les directeurs et administrateurs
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'profilutilisateur') and 
            request.user.profilutilisateur.role in ['director', 'admin']
        )

class IsTechnician(permissions.BasePermission):
    """
    Permission pour les techniciens, directeurs et administrateurs
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'profilutilisateur') and 
            request.user.profilutilisateur.role in ['technician', 'director', 'admin']
        )
        
class IsSecretary(permissions.BasePermission):
    """
    Permission pour les secrétaires, directeurs et administrateurs
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'profilutilisateur') and 
            request.user.profilutilisateur.role in ['secretary', 'director', 'admin']
        )

class IsUser(permissions.BasePermission):
    """
    Permission pour tous les utilisateurs authentifiés
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

class IsOwnerOrStaff(permissions.BasePermission):
    """
    Permission pour le propriétaire de l'objet ou le staff
    """
    def has_object_permission(self, request, view, obj):
        # L'utilisateur peut voir/modifier ses propres objets
        if hasattr(obj, 'utilisateur') and obj.utilisateur == request.user:
            return True
        
        # Le staff peut voir/modifier tous les objets
        if hasattr(request.user, 'profilutilisateur'):
            return request.user.profilutilisateur.role in ['technician', 'director', 'admin']
        
        return False

class CanCreateIncident(permissions.BasePermission):
    """
    Permission pour créer des incidents (tous les utilisateurs authentifiés)
    """
    def has_permission(self, request, view):
        if request.method == 'POST':
            return request.user.is_authenticated
        return True

class CanModifyIncident(permissions.BasePermission):
    """
    Permission pour modifier des incidents (techniciens, directeurs, admin)
    """
    def has_permission(self, request, view):
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            return (
                request.user.is_authenticated and 
                hasattr(request.user, 'profilutilisateur') and 
                request.user.profilutilisateur.role in ['technician', 'director', 'admin']
            )
        return True

class CanViewAllIncidents(permissions.BasePermission):
    """
    Permission pour voir tous les incidents (pas seulement les siens)
    """
    def has_permission(self, request, view):
        if request.method == 'GET':
            return (
                request.user.is_authenticated and 
                hasattr(request.user, 'profilutilisateur') and 
                request.user.profilutilisateur.role in ['technician', 'director', 'admin', 'secretary']
            )
        return True

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission en lecture pour tous, en écriture pour les admin seulement
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'profilutilisateur') and 
            request.user.profilutilisateur.role == 'admin'
        )

class IsTechnicianOrReadOnly(permissions.BasePermission):
    """
    Permission en lecture pour tous, en écriture pour les techniciens et admin
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'profilutilisateur') and 
            request.user.profilutilisateur.role in ['technician', 'director', 'admin']
        )






# permissions.py
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profilutilisateur') and request.user.profilutilisateur.role == 'admin'

class IsDirector(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profilutilisateur') and request.user.profilutilisateur.role in ['admin', 'director']

class IsTechnician(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profilutilisateur') and request.user.profilutilisateur.role in ['admin', 'technician']

class IsSecretary(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profilutilisateur') and request.user.profilutilisateur.role in ['admin', 'secretary']

class IsUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profilutilisateur')

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Les admins peuvent tout faire
        if hasattr(request.user, 'profilutilisateur') and request.user.profilutilisateur.role == 'admin':
            return True
        
        # Les utilisateurs ne peuvent modifier que leurs propres données
        if hasattr(obj, 'utilisateur_attribue'):
            return obj.utilisateur_attribue == request.user.get_full_name()
        
        return False
    
    
# permissions.py
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Permission qui permet uniquement aux administrateurs d'accéder.
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            if hasattr(request.user, 'profilutilisateur'):
                return request.user.profilutilisateur.role == 'admin'
        return False

class CanViewUsers(permissions.BasePermission):
    """
    Permission qui permet aux administrateurs et techniciens de voir les utilisateurs.
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            if hasattr(request.user, 'profilutilisateur'):
                return request.user.profilutilisateur.role in ['admin', 'technician', 'director']
        return False
    
    
 
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
#     # permissions.py
# from rest_framework import permissions

# class IsAdmin(permissions.BasePermission):
#     """
#     Permission pour les administrateurs seulement
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role == 'admin'
#         )

# class IsDirecteur(permissions.BasePermission):
#     """
#     Permission pour les directeurs et administrateurs
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['directeur', 'admin']
#         )

# class IsTechnicien(permissions.BasePermission):
#     """
#     Permission pour les techniciens, directeurs et administrateurs
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['technicien', 'directeur', 'admin']
#         )

# class IsSecretary(permissions.BasePermission):
#     """
#     Permission pour les secrétaires, directeurs et administrateurs
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['secretary', 'directeur', 'admin']
#         )

# class IsUser(permissions.BasePermission):
#     """
#     Permission pour tous les utilisateurs authentifiés
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['user', 'technicien', 'secretary', 'directeur', 'admin']
#         )

# class CanManageFournisseurs(permissions.BasePermission):
#     """
#     Permission pour gérer les fournisseurs (admin, secretary)
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['admin', 'secretary']
#         )

# class CanManageMateriels(permissions.BasePermission):
#     """
#     Permission pour gérer les matériels (tous sauf peut-être certains rôles)
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['user', 'technicien', 'secretary', 'directeur', 'admin']
#         )

# class CanManageLogiciels(permissions.BasePermission):
#     """
#     Permission pour gérer les logiciels (admin, technicien, user)
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['admin', 'technicien', 'user']
#         )

# class CanManageIncidents(permissions.BasePermission):
#     """
#     Permission pour gérer les incidents (admin, technicien, user, directeur)
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['admin', 'technicien', 'user', 'directeur']
#         )

# class CanManageAlertes(permissions.BasePermission):
#     """
#     Permission pour gérer les alertes (admin, technicien, directeur)
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['admin', 'technicien', 'directeur']
#         )

# class CanManageReparations(permissions.BasePermission):
#     """
#     Permission pour gérer les réparations (admin, technicien)
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['admin', 'technicien']
#         )

# class CanViewReports(permissions.BasePermission):
#     """
#     Permission pour voir les rapports (admin, directeur, secretary)
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['admin', 'directeur', 'secretary']
#         )

# class IsOwnerOrAdmin(permissions.BasePermission):
#     """
#     Permission pour le propriétaire de l'objet ou admin
#     """
#     def has_object_permission(self, request, view, obj):
#         # Les admins peuvent tout faire
#         if hasattr(request.user, 'profilutilisateur') and request.user.profilutilisateur.role == 'admin':
#             return True
        
#         # Vérifier si l'utilisateur est propriétaire
#         if hasattr(obj, 'utilisateur') and obj.utilisateur == request.user:
#             return True
        
#         # Vérifier par nom d'utilisateur
#         if hasattr(obj, 'utilisateur_attribue'):
#             return obj.utilisateur_attribue == request.user.username
        
#         return False

# class IsAdminOrReadOnly(permissions.BasePermission):
#     """
#     Permission en lecture pour tous, en écriture pour admin seulement
#     """
#     def has_permission(self, request, view):
#         if request.method in permissions.SAFE_METHODS:
#             return (
#                 request.user.is_authenticated and 
#                 hasattr(request.user, 'profilutilisateur')
#             )
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role == 'admin'
#         )

# class IsTechnicienOrReadOnly(permissions.BasePermission):
#     """
#     Permission en lecture pour tous, en écriture pour techniciens et admin
#     """
#     def has_permission(self, request, view):
#         if request.method in permissions.SAFE_METHODS:
#             return (
#                 request.user.is_authenticated and 
#                 hasattr(request.user, 'profilutilisateur')
#             )
#         return (
#             request.user.is_authenticated and 
#             hasattr(request.user, 'profilutilisateur') and 
#             request.user.profilutilisateur.role in ['technicien', 'directeur', 'admin']
#         )