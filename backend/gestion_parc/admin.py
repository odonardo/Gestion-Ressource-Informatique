from django.contrib import admin
from .models import *

@admin.register(Fournisseur)
class FournisseurAdmin(admin.ModelAdmin):
    list_display = ['nom', 'type_fournisseur', 'contact_email', 'telephone', 'adresse']
    list_filter = ['type_fournisseur']
    search_fields = ['nom', 'contact_email', 'adresse']


@admin.register(Materiel)
class MaterielAdmin(admin.ModelAdmin):
    list_display = ['nom', 'reference', 'etat', 'service_attribue', 'utilisateur_attribue', 'fournisseur', 'date_achat']
    list_filter = ['etat', 'service_attribue', 'fournisseur', 'date_achat']
    search_fields = ['nom', 'reference', 'utilisateur_attribue', 'fournisseur__nom']
    date_hierarchy = 'date_achat'
    list_select_related = ['fournisseur']

@admin.register(Logiciel)
class LogicielAdmin(admin.ModelAdmin):
    list_display = ['nom', 'editeur', 'version', 'type_logiciel', 'date_expiration_licence']
    list_filter = ['type_logiciel', 'editeur']
    search_fields = ['nom', 'editeur']

@admin.register(InstallationLogiciel)
class InstallationLogicielAdmin(admin.ModelAdmin):
    list_display = ['materiel', 'logiciel', 'date_installation', 'statut']
    list_filter = ['statut', 'date_installation']
    search_fields = ['materiel__nom', 'logiciel__nom']

@admin.register(Reseau)
class ReseauAdmin(admin.ModelAdmin):
    list_display = ['nom_hote', 'adresse_ip', 'type_equipement', 'statut_connexion', 'materiel']
    list_filter = ['type_equipement', 'statut_connexion']
    search_fields = ['nom_hote', 'adresse_ip', 'materiel__nom']

@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = ['id', 'type_incident', 'priorite', 'statut', 'date_creation', 'utilisateur_signaleur']
    list_filter = ['type_incident', 'priorite', 'statut', 'date_creation']
    search_fields = ['description', 'materiel_concerne__nom']
    date_hierarchy = 'date_creation'

@admin.register(Alerte)
class AlerteAdmin(admin.ModelAdmin):
    list_display = ['id', 'type_alerte', 'severite', 'statut', 'date_alerte']
    list_filter = ['type_alerte', 'severite', 'statut']
    search_fields = ['description']
    date_hierarchy = 'date_alerte'

@admin.register(Reparation)
class ReparationAdmin(admin.ModelAdmin):
    list_display = ['materiel', 'type_reparation', 'date_debut', 'date_fin', 'cout']
    list_filter = ['type_reparation', 'date_debut']
    search_fields = ['materiel__nom', 'description']

# Correction: ProfilUtilisateurAdmin sans date_embauche
@admin.register(ProfilUtilisateur)
class ProfilUtilisateurAdmin(admin.ModelAdmin):
    list_display = ['user', 'departement', 'telephone', 'role', 'get_user_email', 'get_full_name']
    list_filter = ['role', 'departement']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'departement', 'telephone']
    list_select_related = ['user']
    
    # Champs personnalisés pour afficher plus d'informations
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'Email'
    get_user_email.admin_order_field = 'user__email'
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
    get_full_name.short_description = 'Nom complet'
    get_full_name.admin_order_field = 'user__first_name'
    
    # Pour un meilleur affichage en admin
    fieldsets = (
        ('Informations utilisateur', {
            'fields': ('user',)
        }),
        ('Informations professionnelles', {
            'fields': ('departement', 'telephone', 'role')
        }),
    )