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
    list_display = ['id', 'type_incident', 'priorite', 'statut', 'date_creation', 'utilisateur_signaleur','materiel_concerne']
    list_filter = ['type_incident', 'priorite', 'statut', 'date_creation','materiel_concerne' ]
    search_fields = ['description', 'materiel_concerne__nom','materiel_concerne__reference']
    date_hierarchy = 'date_creation'
    list_filter.append('materiel_concerne')
@admin.register(Alerte)
class AlerteAdmin(admin.ModelAdmin):
    list_display = ['id', 'type_alerte', 'severite', 'statut', 'date_alerte']
    list_filter = ['type_alerte', 'severite', 'statut']
    search_fields = ['description',]
    date_hierarchy = 'date_alerte'

@admin.register(Reparation)
class ReparationAdmin(admin.ModelAdmin):
    list_display = ['materiel', 'type_reparation', 'date_debut', 'date_fin', 'cout','technicien_responsable']
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
    
    
    
    
from django.contrib import admin
from .models import *
from django.utils.html import format_html
from django.contrib.auth.models import User

# ... vos autres admin classes existantes ...

@admin.register(HistoriqueAction)
class HistoriqueActionAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_module_display_custom', 'get_action_display_custom', 'get_objet_info', 'get_utilisateur_info', 'date_formattee', 'get_ip_display']
    list_filter = ['module', 'action', 'date_action']
    search_fields = ['objet_nom', 'description', 'utilisateur__username', 'utilisateur__first_name', 'utilisateur__last_name', 'ip_address']
    date_hierarchy = 'date_action'
    list_select_related = ['utilisateur']
    readonly_fields = ['date_action', 'created_at', 'donnees_avant', 'donnees_apres', 'ip_address', 'user_agent']
    ordering = ['-date_action']
    
    # Personnalisation des champs d'affichage
    def get_module_display_custom(self, obj):
        color_map = {
            'materiel': 'blue',
            'logiciel': 'green',
            'incident': 'red',
            'alerte': 'orange',
            'reparation': 'purple',
            'fournisseur': 'teal',
            'utilisateur': 'pink',
            'profil_utilisateur': 'indigo',
            'systeme': 'gray',
        }
        color = color_map.get(obj.module, 'gray')
        icon_map = {
            'materiel': '💻',
            'logiciel': '📦',
            'incident': '⚠️',
            'alerte': '🚨',
            'reparation': '🔧',
            'fournisseur': '🏢',
            'utilisateur': '👤',
            'profil_utilisateur': '👥',
            'systeme': '⚙️',
        }
        icon = icon_map.get(obj.module, '📝')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{} {}</span>',
            color, icon, obj.get_module_display()
        )
    get_module_display_custom.short_description = 'Module'
    get_module_display_custom.admin_order_field = 'module'
    
    def get_action_display_custom(self, obj):
        color_map = {
            'creation': 'green',
            'modification': 'blue',
            'suppression': 'red',
            'login': 'purple',
            'logout': 'gray',
        }
        color = color_map.get(obj.action, 'black')
        icon_map = {
            'creation': '➕',
            'modification': '✏️',
            'suppression': '🗑️',
            'login': '🔑',
            'logout': '🚪',
        }
        icon = icon_map.get(obj.action, '📝')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{} {}</span>',
            color, icon, obj.get_action_display()
        )
    get_action_display_custom.short_description = 'Action'
    get_action_display_custom.admin_order_field = 'action'
    
    def get_objet_info(self, obj):
        if obj.objet_id:
            return format_html(
                '<strong>{}</strong> (ID: {})',
                obj.objet_nom or "Sans nom",
                obj.objet_id
            )
        return format_html('<em>{}</em>', obj.objet_nom or "Aucun")
    get_objet_info.short_description = 'Objet concerné'
    
    def get_utilisateur_info(self, obj):
        if obj.utilisateur:
            return format_html(
                '{}<br><small style="color: gray;">@{}</small>',
                obj.utilisateur.get_full_name() or obj.utilisateur.username,
                obj.utilisateur.username
            )
        return format_html('<span style="color: orange;">Système</span>')
    get_utilisateur_info.short_description = 'Utilisateur'
    get_utilisateur_info.admin_order_field = 'utilisateur__username'
    
    def date_formattee(self, obj):
        return obj.date_action.strftime("%d/%m/%Y %H:%M:%S")
    date_formattee.short_description = 'Date/Heure'
    date_formattee.admin_order_field = 'date_action'
    
    def get_ip_display(self, obj):
        if obj.ip_address:
            return format_html(
                '<code>{}</code>',
                obj.ip_address
            )
        return "-"
    get_ip_display.short_description = 'Adresse IP'
    
    # Champs pour la vue détaillée
    fieldsets = (
        ('Informations générales', {
            'fields': ('utilisateur', 'action', 'module', 'objet_id', 'objet_nom', 'description')
        }),
        ('Données techniques', {
            'fields': ('donnees_avant', 'donnees_apres'),
            'classes': ('collapse',),
        }),
        ('Métadonnées', {
            'fields': ('ip_address', 'user_agent', 'date_action', 'created_at'),
            'classes': ('collapse',),
        }),
    )
    
    # Actions personnalisées
    actions = ['clean_old_records', 'export_to_csv']
    
    def clean_old_records(self, request, queryset):
        """Nettoyer les enregistrements anciens"""
        from django.utils import timezone
        from datetime import timedelta
        
        # Supprimer les enregistrements de plus de 90 jours
        date_limit = timezone.now() - timedelta(days=90)
        deleted_count, _ = queryset.filter(date_action__lt=date_limit).delete()
        
        self.message_user(
            request, 
            f"{deleted_count} enregistrements anciens ont été supprimés."
        )
    clean_old_records.short_description = "Nettoyer les enregistrements anciens (>90 jours)"
    
    def export_to_csv(self, request, queryset):
        """Exporter les enregistrements sélectionnés en CSV"""
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="historique_actions.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Date', 'Utilisateur', 'Action', 'Module', 
            'Objet ID', 'Objet Nom', 'Description', 'IP'
        ])
        
        for obj in queryset:
            writer.writerow([
                obj.id,
                obj.date_action.strftime("%d/%m/%Y %H:%M:%S"),
                obj.utilisateur.username if obj.utilisateur else "Système",
                obj.get_action_display(),
                obj.get_module_display(),
                obj.objet_id or "",
                obj.objet_nom or "",
                obj.description[:100],  # Limiter la longueur
                obj.ip_address or ""
            ])
        
        return response
    export_to_csv.short_description = "Exporter les enregistrements sélectionnés en CSV"
    
    # Filtres personnalisés
    class DateRangeFilter(admin.SimpleListFilter):
        title = 'Période'
        parameter_name = 'date_range'
        
        def lookups(self, request, model_admin):
            return [
                ('today', "Aujourd'hui"),
                ('week', 'Cette semaine'),
                ('month', 'Ce mois'),
                ('quarter', 'Ce trimestre'),
                ('year', 'Cette année'),
            ]
        
        def queryset(self, request, queryset):
            from django.utils import timezone
            from datetime import datetime, timedelta
            
            if self.value() == 'today':
                today = timezone.now().date()
                return queryset.filter(date_action__date=today)
            elif self.value() == 'week':
                week_start = timezone.now() - timedelta(days=timezone.now().weekday())
                return queryset.filter(date_action__gte=week_start)
            elif self.value() == 'month':
                month_start = timezone.now().replace(day=1)
                return queryset.filter(date_action__gte=month_start)
            elif self.value() == 'quarter':
                now = timezone.now()
                quarter = (now.month - 1) // 3
                quarter_start = datetime(now.year, 3 * quarter + 1, 1)
                return queryset.filter(date_action__gte=quarter_start)
            elif self.value() == 'year':
                year_start = timezone.now().replace(month=1, day=1)
                return queryset.filter(date_action__gte=year_start)
    
    list_filter = ['module', 'action', DateRangeFilter, 'utilisateur']
    
    # Pagination personnalisée
    list_per_page = 50
    show_full_result_count = True
    
    # Panneau de statistiques dans l'en-tête
    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context=extra_context)
        
        if hasattr(response, 'context_data'):
            from django.db.models import Count
            from django.utils import timezone
            from datetime import timedelta
            
            # Statistiques pour le panneau
            total_actions = HistoriqueAction.objects.count()
            today = timezone.now().date()
            actions_today = HistoriqueAction.objects.filter(date_action__date=today).count()
            
            # Actions par module aujourd'hui
            modules_today = HistoriqueAction.objects.filter(
                date_action__date=today
            ).values('module').annotate(count=Count('id')).order_by('-count')[:5]
            
            # Top utilisateurs
            top_users = HistoriqueAction.objects.values(
                'utilisateur__username'
            ).annotate(
                count=Count('id')
            ).order_by('-count')[:5]
            
            extra_context = response.context_data or {}
            extra_context.update({
                'total_actions': total_actions,
                'actions_today': actions_today,
                'modules_today': modules_today,
                'top_users': top_users,
            })
            response.context_data = extra_context
        
        return response

# Optionnel: Ajouter une action de débogage pour peupler l'historique
@admin.action(description="Créer des données de test pour l'historique")
def create_test_history(modeladmin, request, queryset):
    """Action pour créer des données de test dans l'historique"""
    from django.utils import timezone
    from datetime import timedelta
    import random
    
    users = User.objects.all()
    modules = ['materiel', 'logiciel', 'incident', 'alerte', 'reparation', 'fournisseur']
    actions = ['creation', 'modification', 'suppression', 'consultation']
    objets = ['Poste de travail', 'Serveur', 'Imprimante', 'Switch', 'Routeur', 'Logiciel Office']
    
    for i in range(20):  # Créer 20 enregistrements de test
        HistoriqueAction.objects.create(
            utilisateur=random.choice(users) if users.exists() else None,
            action=random.choice(actions),
            module=random.choice(modules),
            objet_id=random.randint(1, 100),
            objet_nom=random.choice(objets),
            description=f"Action de test #{i+1} - {random.choice(['Test', 'Debug', 'Démonstration'])}",
            ip_address=f"192.168.1.{random.randint(1, 255)}",
            date_action=timezone.now() - timedelta(days=random.randint(0, 30)),
        )
    
    modeladmin.message_user(request, "20 enregistrements de test ont été créés dans l'historique.")

# Ajouter l'action au ModelAdmin
HistoriqueActionAdmin.actions.append(create_test_history)