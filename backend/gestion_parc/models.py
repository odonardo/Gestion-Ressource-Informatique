from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import User

class Fournisseur(models.Model):
    TYPE_FOURNISSEUR = [
        ('materiel', 'Matériel'),
        ('logiciel', 'Logiciel'),
        ('mixte', 'Mixte'),
    ]
    
    nom = models.CharField(max_length=100)
    contact_email = models.EmailField()
    telephone = models.CharField(max_length=20)
    adresse = models.TextField(blank=True, null=True)
    type_fournisseur = models.CharField(max_length=10, choices=TYPE_FOURNISSEUR)
    
    def __str__(self):
        return self.nom

    class Meta:
        verbose_name = "Fournisseur"
        verbose_name_plural = "Fournisseurs"

class Materiel(models.Model):
    ETAT_CHOICES = [
        ('fonctionnel', 'Fonctionnel'),
        ('en_panne', 'En panne'),
        ('repare', 'Réparé'),
        ('obsolete', 'Obsolète'),
        ('fonctionnel', 'Fonctionnel'),
        ('en_panne', 'En panne'),
        ('repare', 'Réparé'),
        ('obsolete', 'Obsolète'),
        ('en_maintenance', 'En maintenance'),
        ('en_amelioration', 'En amélioration'),
        ('en_reparation', 'En réparation'),
        ('hors_service', 'Hors service'),
    ]
    
    SERVICE_CHOICES = [
        ('Direction', 'Direction'),
        ('Comptabilité', 'Comptabilité'),
        ('Ressources Humaines', 'Ressources Humaines'),
        ('Informatique', 'Informatique'),
        ('Secrétariat', 'Secrétariat'),
        ('Archives', 'Archives'),
    ]

    nom = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(2)],
        verbose_name="Nom du matériel"
    )
    reference = models.CharField(
        max_length=100,
        unique=True,
        validators=[MinLengthValidator(2)],
        verbose_name="Référence/Numéro de série"
    )
    date_achat = models.DateField(verbose_name="Date d'achat")
    etat = models.CharField(
        max_length=30,
        choices=ETAT_CHOICES,
        default='fonctionnel',
        verbose_name="État"
    )
    service_attribue = models.CharField(
        max_length=50,
        choices=SERVICE_CHOICES,
        verbose_name="Service attribué"
    )
    utilisateur_attribue = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Utilisateur attribué"
    )
    fournisseur = models.ForeignKey(
        Fournisseur, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Fournisseur"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Matériel"
        verbose_name_plural = "Matériels"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.nom} ({self.reference})"

class Logiciel(models.Model):
    TYPE_LOGICIEL = [
        ('os', 'Système d exploitation'),
        ('bureautique', 'Bureautique'),
        ('metier', 'Métier'),
        ('securite', 'Sécurité'),
        ('autre', 'Autre'),
    ]
    
    nom = models.CharField(max_length=100)
    editeur = models.CharField(max_length=100)
    version = models.CharField(max_length=50)
    type_logiciel = models.CharField(max_length=20, choices=TYPE_LOGICIEL)
    date_installation = models.DateField(null=True, blank=True)
    date_expiration_licence = models.DateField(null=True, blank=True)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"{self.nom} v{self.version}"

    class Meta:
        verbose_name = "Logiciel"
        verbose_name_plural = "Logiciels"

class InstallationLogiciel(models.Model):
    STATUT_INSTALLATION = [
        ('actif', 'Actif'),
        ('desinstalle', 'Désinstallé'),
        ('en_erreur', 'En erreur'),
    ]
    
    materiel = models.ForeignKey(Materiel, on_delete=models.CASCADE)
    logiciel = models.ForeignKey(Logiciel, on_delete=models.CASCADE)
    # date_installation = models.DateField(auto_now_add=True)
    date_installation = models.DateField()  # IMPORTANT: Pas d'auto_now_add=True ici !
    statut = models.CharField(max_length=20, choices=STATUT_INSTALLATION, default='actif')
    
    class Meta:
        verbose_name = "Installation logiciel"
        verbose_name_plural = "Installations logiciels"
        unique_together = ['materiel', 'logiciel']
    
    def __str__(self):
        return f"{self.logiciel.nom} sur {self.materiel.nom}"

class Reseau(models.Model):
    TYPE_EQUIPEMENT = [
        ('poste', 'Poste de travail'),
        ('serveur', 'Serveur'),
        ('imprimante', 'Imprimante'),
        ('switch', 'Switch'),
        ('routeur', 'Routeur'),
    ]
    
    STATUT_CONNEXION = [
        ('connecte', 'Connecté'),
        ('deconnecte', 'Déconnecté'),
        ('instable', 'Instable'),
    ]
    
    materiel = models.OneToOneField(Materiel, on_delete=models.CASCADE)
    adresse_ip = models.GenericIPAddressField()
    nom_hote = models.CharField(max_length=100)
    sous_reseau = models.GenericIPAddressField()
    passerelle = models.GenericIPAddressField()
    type_equipement = models.CharField(max_length=20, choices=TYPE_EQUIPEMENT)
    statut_connexion = models.CharField(max_length=20, choices=STATUT_CONNEXION, default='connecte')
    
    def __str__(self):
        return f"{self.nom_hote} ({self.adresse_ip})"

    class Meta:
        verbose_name = "Configuration réseau"
        verbose_name_plural = "Configurations réseau"

class Incident(models.Model):
    TYPE_INCIDENT = [
        ('materiel', 'Matériel'),
        ('logiciel', 'Logiciel'),
        ('reseau', 'Réseau'),
        ('mixte', 'Mixte'),
    ]
    
    PRIORITE_CHOICES = [
        ('critique', 'Critique'),
        ('elevee', 'Élevée'),
        ('moyenne', 'Moyenne'),
        ('basse', 'Basse'),
    ]
    
    STATUT_INCIDENT = [
        ('ouvert', 'Ouvert'),
        ('en_cours', 'En cours'),
        ('resolu', 'Résolu'),
        ('ferme', 'Fermé'),
    ]
    
    description = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    date_resolution = models.DateTimeField(null=True, blank=True)
    priorite = models.CharField(max_length=20, choices=PRIORITE_CHOICES, default='moyenne')
    statut = models.CharField(max_length=20, choices=STATUT_INCIDENT, default='ouvert')
    type_incident = models.CharField(max_length=20, choices=TYPE_INCIDENT)
    
    # Relations
    utilisateur_signaleur = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    materiel_concerne = models.ForeignKey(Materiel, on_delete=models.CASCADE, null=True, blank=True)
    logiciel_concerne = models.ForeignKey(Logiciel, on_delete=models.SET_NULL, null=True, blank=True)
    reseau_concerne = models.ForeignKey(Reseau, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"Incident #{self.id} - {self.get_type_incident_display()}"

    class Meta:
        verbose_name = "Incident"
        verbose_name_plural = "Incidents"
        ordering = ['-date_creation']

class Alerte(models.Model):
    TYPE_ALERTE = [
        ('securite', 'Sécurité'),
        ('performance', 'Performance'),
        ('panne', 'Panne'),
        ('maintenance', 'Maintenance'),
    ]
    
    SEVERITE_CHOICES = [
        ('critique', 'Critique'),
        ('elevee', 'Élevée'),
        ('moyenne', 'Moyenne'),
        ('basse', 'Basse'),
    ]
    
    STATUT_ALERTE = [
        ('nouvelle', 'Nouvelle'),
        ('en_traitement', 'En traitement'),
        ('resolue', 'Résolue'),
    ]
    
    description = models.TextField()
    date_alerte = models.DateTimeField(auto_now_add=True)
    type_alerte = models.CharField(max_length=20, choices=TYPE_ALERTE)
    severite = models.CharField(max_length=20, choices=SEVERITE_CHOICES, default='moyenne')
    statut = models.CharField(max_length=20, choices=STATUT_ALERTE, default='nouvelle')
    
    # Sources possibles de l'alerte
    materiel_source = models.ForeignKey(Materiel, on_delete=models.CASCADE, null=True, blank=True)
    logiciel_source = models.ForeignKey(Logiciel, on_delete=models.SET_NULL, null=True, blank=True)
    reseau_source = models.ForeignKey(Reseau, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Lien avec incident si l'alerte en a déclenché un
    incident_lie = models.ForeignKey(Incident, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"Alerte {self.get_severite_display()} - {self.description[:50]}..."

    class Meta:
        verbose_name = "Alerte"
        verbose_name_plural = "Alertes"
        ordering = ['-date_alerte']
        
class ProfilUtilisateur(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,  # Suppression en cascade
        primary_key=True,
        related_name='profilutilisateur'
    )
    departement = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20, blank=True)
    date_embauche = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.departement})"

    class Meta:
        verbose_name = "Profil utilisateur"
        verbose_name_plural = "Profils utilisateurs"



# Dans models.py, modifiez le modèle ProfilUtilisateur

class ProfilUtilisateur(models.Model):
    ROLE_CHOICES = [
        ('user', 'Utilisateur standard'),
        ('technician', 'Technicien'),
        ('secretary', 'Secrétaire'),
        ('director', 'Directeur'),
        ('admin', 'Administrateur'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    departement = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20, blank=True)
    date_embauche = models.DateField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.departement}) - {self.get_role_display()}"

    class Meta:
        verbose_name = "Profil utilisateur"
        verbose_name_plural = "Profils utilisateurs"
        
        
        
# historique

# Dans models.py - Ajoutez ce modèle
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class HistoriqueAction(models.Model):
    TYPE_ACTION = [
        ('creation', 'Création'),
        ('modification', 'Modification'),
        ('suppression', 'Suppression'),
        ('consultation', 'Consultation'),
        ('login', 'Connexion'),
        ('logout', 'Déconnexion'),
        ('autre', 'Autre'),
    ]
    
    MODULE_CHOICES = [
        ('materiel', 'Matériel'),
        ('logiciel', 'Logiciel'),
        ('installation_logiciel', 'Installation Logiciel'),
        ('reseau', 'Réseau'),
        ('incident', 'Incident'),
        ('alerte', 'Alerte'),
        ('reparation', 'Réparation'),
        ('fournisseur', 'Fournisseur'),
        ('profil_utilisateur', 'Profil Utilisateur'),
        ('utilisateur', 'Utilisateur'),
        ('dashboard', 'Tableau de bord'),
        ('rapport', 'Rapport'),
        ('systeme', 'Système'),
    ]
    
    utilisateur = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=20, choices=TYPE_ACTION)
    module = models.CharField(max_length=30, choices=MODULE_CHOICES)
    objet_id = models.IntegerField(null=True, blank=True)
    objet_nom = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    date_action = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    donnees_avant = models.JSONField(null=True, blank=True)
    donnees_apres = models.JSONField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Historique d'action"
        verbose_name_plural = "Historiques d'actions"
        ordering = ['-date_action']
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.get_module_display()}"
    
    
    
# Dans models.py - CORRECTION COMPLÈTE
class Reparation(models.Model):
    TYPE_REPARATION = [
        ('preventive', 'Préventive'),
        ('corrective', 'Corrective'),
        ('ameliorative', 'Améliorative'),
    ]
    
    description = models.TextField()
    date_debut = models.DateTimeField(auto_now_add=True)
    date_fin = models.DateTimeField(null=True, blank=True)
    type_reparation = models.CharField(max_length=20, choices=TYPE_REPARATION)
    cout = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # CORRECTION CRITIQUE ICI :
    technicien_responsable = models.CharField(
        max_length=200,
        verbose_name="Technicien responsable",
        default='Technicien non spécifié',  # Valeur par défaut
        blank=False,  # Important : ne peut pas être vide
        null=False,   # Important : ne peut pas être NULL
    )
    
    # Relations
    materiel = models.ForeignKey(
        'Materiel', 
        on_delete=models.CASCADE, 
        related_name='reparations'
    )
    incident = models.ForeignKey(
        'Incident', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='reparations'
    )
    
    class Meta:
        verbose_name = "Réparation"
        verbose_name_plural = "Réparations"
        ordering = ['-date_debut']
    
    def __str__(self):
        return f"Réparation #{self.id} - {self.materiel.nom if self.materiel else 'Sans matériel'}"
    
    def save(self, *args, **kwargs):
        """S'assurer que technicien_responsable n'est jamais vide"""
        # S'assurer qu'il y a toujours une valeur
        if not self.technicien_responsable or self.technicien_responsable.strip() == '':
            self.technicien_responsable = 'Technicien non spécifié'
        
        super().save(*args, **kwargs)
        
        # Mettre à jour le matériel si la réparation est terminée
        if self.date_fin and self.materiel:
            self.materiel.etat = 'fonctionnel'
            self.materiel.save()