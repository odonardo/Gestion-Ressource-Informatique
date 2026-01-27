from rest_framework import serializers
from .models import *
from django.utils import timezone
from datetime import date
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    departement = serializers.SerializerMethodField()
    telephone = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'role', 'departement', 'telephone',
            'is_active', 'date_joined', 'is_staff', 'is_superuser'
        ]
        read_only_fields = ['id', 'is_active', 'date_joined']
    
    def get_role(self, obj):
        try:
            profil = ProfilUtilisateur.objects.get(user=obj)
            return profil.role
        except ProfilUtilisateur.DoesNotExist:
            return 'user'
    
    def get_departement(self, obj):
        try:
            profil = ProfilUtilisateur.objects.get(user=obj)
            return profil.departement or 'Non spécifié'
        except ProfilUtilisateur.DoesNotExist:
            return 'À définir'
    
    def get_telephone(self, obj):
        try:
            profil = ProfilUtilisateur.objects.get(user=obj)
            return profil.telephone or ''
        except ProfilUtilisateur.DoesNotExist:
            return ''
    
    def get_full_name(self, obj):
        full_name = f"{obj.first_name or ''} {obj.last_name or ''}".strip()
        return full_name or obj.username
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            from django.contrib.auth import authenticate
            user = authenticate(username=username, password=password)
            
            if user:
                if user.is_active:
                    data['user'] = user
                    return data
                else:
                    raise serializers.ValidationError("Ce compte est désactivé.")
            else:
                raise serializers.ValidationError("Identifiants incorrects.")
        else:
            raise serializers.ValidationError("Must include 'username' and 'password'.")

class FournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fournisseur
        fields = '__all__'

class LogicielSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logiciel
        fields = '__all__'

class InstallationLogicielSerializer(serializers.ModelSerializer):
    materiel_nom = serializers.CharField(source='materiel.nom', read_only=True)
    logiciel_nom = serializers.CharField(source='logiciel.nom', read_only=True)
    
    class Meta:
        model = InstallationLogiciel
        fields = '__all__'

class ReseauSerializer(serializers.ModelSerializer):
    materiel_nom = serializers.CharField(source='materiel.nom', read_only=True)
    
    class Meta:
        model = Reseau
        fields = '__all__'

class IncidentSerializer(serializers.ModelSerializer):
    # Ajoutez ces lignes si elles n'existent pas
    utilisateur_signaleur_info = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Incident
        fields = '__all__'
        # OU si vous avez une liste de fields spécifique :
        fields = [
            'id', 'description', 'date_creation', 'date_resolution',
            'priorite', 'statut', 'type_incident', 'utilisateur_signaleur',
            'materiel_concerne', 'logiciel_concerne', 'reseau_concerne',
            'utilisateur_signaleur_info'  # Champ supplémentaire pour affichage
        ]
        # Rendre le champ utilisateur_signaleur en lecture seule lors de la création
        read_only_fields = ['utilisateur_signaleur', 'date_creation']
    
    def get_utilisateur_signaleur_info(self, obj):
        """Retourne les informations formatées de l'utilisateur signaleur"""
        if obj.utilisateur_signaleur:
            return {
                'id': obj.utilisateur_signaleur.id,
                'username': obj.utilisateur_signaleur.username,
                'full_name': f"{obj.utilisateur_signaleur.first_name} {obj.utilisateur_signaleur.last_name}".strip() or obj.utilisateur_signaleur.username,
                'email': obj.utilisateur_signaleur.email
            }
        return None
    
    def create(self, validated_data):
        # S'assurer que l'utilisateur connecté est toujours le signaleur
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['utilisateur_signaleur'] = request.user
        return super().create(validated_data)

class AlerteSerializer(serializers.ModelSerializer):
    materiel_nom = serializers.CharField(source='materiel_source.nom', read_only=True)
    logiciel_nom = serializers.CharField(source='logiciel_source.nom', read_only=True)
    
    class Meta:
        model = Alerte
        fields = '__all__'
class ProfilUtilisateurSerializer(serializers.ModelSerializer):
    user_nom = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = ProfilUtilisateur
        fields = '__all__'

# Votre serializer Materiel existant (avec les améliorations)
class MaterielSerializer(serializers.ModelSerializer):
    fournisseur_nom = serializers.CharField(source='fournisseur.nom', read_only=True)
    
    class Meta:
        model = Materiel
        fields = [
            'id', 'nom', 'reference', 'date_achat', 'etat',
            'service_attribue', 'utilisateur_attribue', 'fournisseur', 'fournisseur_nom',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_date_achat(self, value):
        if value > date.today():
            raise serializers.ValidationError("La date d'achat ne peut pas être dans le futur")
        return value

    def validate_nom(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Le nom doit contenir au moins 2 caractères")
        return value.strip()

    def validate_reference(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("La référence doit contenir au moins 2 caractères")
        return value.strip()

    def validate_service_attribue(self, value):
        valid_services = [choice[0] for choice in Materiel.SERVICE_CHOICES]
        if value not in valid_services:
            raise serializers.ValidationError(f"Service invalide. Choix valides: {', '.join(valid_services)}")
        return value

    def validate_etat(self, value):
        etats_valides = ['fonctionnel', 'en_panne', 'repare', 'obsolete', 
                        'en_maintenance', 'en_amelioration', 'en_reparation', 'hors_service']
        
        print(f"🔍 Validation état: '{value}' dans {etats_valides}")
        if value not in etats_valides:
            raise serializers.ValidationError(
                f"État '{value}' non valide. États valides: {', '.join(etats_valides)}"
            )
        print(f"✅ État '{value}' validé avec succès")
        return value
    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError(f"Erreur lors de la création: {str(e)}")

    def update(self, instance, validated_data):
        try:
            return super().update(instance, validated_data)
        except Exception as e:
            raise serializers.ValidationError(f"Erreur lors de la mise à jour: {str(e)}")

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)
    name = serializers.CharField(max_length=255)
    role = serializers.ChoiceField(
        choices=[
            ('user', 'Utilisateur standard'),
            ('technician', 'Technicien'),
            ('secretary', 'Secrétaire'),
            ('director', 'Directeur'),
            ('admin', 'Administrateur'),
        ],
        default='user'
    )

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà utilisé.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cet email est déjà utilisé.")
        return value

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Les mots de passe ne correspondent pas."})
        return data

    def create(self, validated_data):
        # Créer l'utilisateur
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('name', '').split(' ')[0],
            last_name=' '.join(validated_data.get('name', '').split(' ')[1:]) if ' ' in validated_data.get('name', '') else ''
        )
        
        # Créer le profil utilisateur avec le rôle
        profil, created = ProfilUtilisateur.objects.get_or_create(
            user=user,
            defaults={
                'departement': 'À définir',  # Vous pouvez ajuster selon vos besoins
                'role': validated_data['role']
            }
        )
        
        return user

# class ProfilUtilisateurSerializer(serializers.ModelSerializer):
#     user_nom = serializers.CharField(source='user.get_full_name', read_only=True)
#     user_email = serializers.CharField(source='user.email', read_only=True)
#     username = serializers.CharField(source='user.username', read_only=True)
    
#     class Meta:
#         model = ProfilUtilisateur
#         fields = '__all__'

# Dans serializers.py

# Dans serializers.py

# Dans serializers.py - CORRECTION

class ProfilUtilisateurSerializer(serializers.ModelSerializer):
    # Champs en lecture seule pour l'affichage
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)
    
    # Champs pour la création/édition
    user_username = serializers.CharField(write_only=True, required=False)
    user_email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    
    class Meta:
        model = ProfilUtilisateur
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_username', 'user_email', 'password',
            'departement', 'telephone', 'role'
        ]
        # Supprimer date_embauche comme demandé
        read_only_fields = ['username', 'email', 'first_name', 'last_name', 'full_name']
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
    
    def create(self, validated_data):
        """
        Créer un profil - soit pour un utilisateur existant, soit en créant un nouvel utilisateur
        """
        # Extraire les données utilisateur si fournies
        username = validated_data.pop('user_username', None)
        email = validated_data.pop('user_email', None)
        password = validated_data.pop('password', None)
        
        if username and email and password:
            # Mode création d'un nouvel utilisateur
            # Vérifier si l'utilisateur existe déjà
            if User.objects.filter(username=username).exists():
                raise serializers.ValidationError(
                    {"user_username": f"Le nom d'utilisateur '{username}' existe déjà"}
                )
            
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError(
                    {"user_email": f"L'email '{email}' est déjà utilisé"}
                )
            
            # Créer l'utilisateur
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name='',  # Remplir plus tard si nécessaire
                last_name=''
            )
            
        elif username:
            # Mode association avec utilisateur existant
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {"user_username": f"L'utilisateur '{username}' n'existe pas"}
                )
            
            # Vérifier si l'utilisateur a déjà un profil
            if ProfilUtilisateur.objects.filter(user=user).exists():
                raise serializers.ValidationError(
                    {"user_username": f"L'utilisateur '{username}' a déjà un profil"}
                )
        else:
            raise serializers.ValidationError(
                {"user_username": "Nom d'utilisateur requis"}
            )
        
        # Créer le profil
        validated_data['user'] = user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """
        Mettre à jour un profil existant
        """
        # Mettre à jour l'utilisateur si email fourni
        if 'user_email' in validated_data:
            email = validated_data.pop('user_email')
            instance.user.email = email
            instance.user.save()
        
        # Mettre à jour les autres champs
        return super().update(instance, validated_data)
    def delete(self, instance):
        """
        Surcharge de la méthode delete pour supprimer l'utilisateur aussi
        """
        user = instance.user
        # D'abord supprimer le profil
        super().delete(instance)
        # Puis supprimer l'utilisateur
        user.delete()
        return instance
    
    
    
    
# historique

# Dans serializers.py
# Dans serializers.py - Ajoutez ce serializer
class HistoriqueActionSerializer(serializers.ModelSerializer):
    utilisateur_nom = serializers.SerializerMethodField()
    action_display = serializers.SerializerMethodField()
    module_display = serializers.SerializerMethodField()
    date_formattee = serializers.SerializerMethodField()
    
    class Meta:
        model = HistoriqueAction
        fields = [
            'id', 'utilisateur', 'utilisateur_nom', 'action', 'action_display',
            'module', 'module_display', 'objet_id', 'objet_nom', 'description',
            'date_action', 'date_formattee', 'ip_address', 'donnees_avant',
            'donnees_apres', 'created_at'
        ]
    
    def get_utilisateur_nom(self, obj):
        if obj.utilisateur:
            return f"{obj.utilisateur.get_full_name()} ({obj.utilisateur.username})"
        return "Système"
    
    def get_action_display(self, obj):
        return obj.get_action_display()
    
    def get_module_display(self, obj):
        return obj.get_module_display()
    
    def get_date_formattee(self, obj):
        return obj.date_action.strftime("%d/%m/%Y %H:%M:%S")
    
    
# Dans serializers.py, ajoutez ce serializer
class MaterielEnPanneSerializer(serializers.ModelSerializer):
    """Serializer spécifique pour les matériels en panne"""
    class Meta:
        model = Materiel
        fields = [
            'id', 'nom', 'reference', 'etat', 'service_attribue',
            'utilisateur_attribue', 'date_achat'
        ]
        read_only_fields = fields
        
        
        
# Dans serializers.py - REPLACE COMPLETELY the ReparationSerializer
class ReparationSerializer(serializers.ModelSerializer):
    materiel_nom = serializers.CharField(source='materiel.nom', read_only=True)
    incident_nom = serializers.SerializerMethodField(read_only=True)
    statut = serializers.SerializerMethodField(read_only=True)
    technicien_responsable = serializers.CharField(required=True)  # FORCER comme requis
    
    class Meta:
        model = Reparation
        fields = [
            'id', 'description', 'date_debut', 'date_fin', 
            'type_reparation', 'cout', 'technicien_responsable',
            'materiel', 'materiel_nom', 'incident', 'incident_nom',
            'statut'
        ]
        read_only_fields = ['date_debut', 'materiel_nom', 'incident_nom']
    
    def get_incident_nom(self, obj):
        if obj.incident:
            return f"Incident #{obj.incident.id}"
        return None
    
    def get_statut(self, obj):
        return 'termine' if obj.date_fin else 'en_cours'
    
    def validate_technicien_responsable(self, value):
        """Valider que le nom du technicien n'est pas vide"""
        if not value or value.strip() == '':
            raise serializers.ValidationError("Le nom du technicien est requis")
        return value.strip()
    
    def create(self, validated_data):
        """Création avec mise à jour automatique du matériel"""
        # Assurer que technicien_responsable est présent
        if 'technicien_responsable' not in validated_data:
            # Récupérer l'utilisateur connecté
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                user = request.user
                validated_data['technicien_responsable'] = f"{user.first_name} {user.last_name}".strip() or user.username
        
        reparation = super().create(validated_data)
        
        # Mettre à jour l'état du matériel
        materiel = reparation.materiel
        if reparation.date_fin:
            # Réparation terminée
            if reparation.type_reparation == 'corrective':
                materiel.etat = 'repare'
            else:
                materiel.etat = 'fonctionnel'
        else:
            # Réparation en cours
            if reparation.type_reparation == 'corrective':
                materiel.etat = 'en_panne'
            elif reparation.type_reparation == 'preventive':
                materiel.etat = 'en_maintenance'
            elif reparation.type_reparation == 'ameliorative':
                materiel.etat = 'en_amelioration'
            else:
                materiel.etat = 'en_reparation'
        
        materiel.save()
        return reparation
    
    def update(self, instance, validated_data):
        """Mise à jour avec mise à jour automatique du matériel"""
        # Assurer que technicien_responsable est présent
        if 'technicien_responsable' not in validated_data:
            # Garder la valeur existante
            validated_data['technicien_responsable'] = instance.technicien_responsable
        
        reparation = super().update(instance, validated_data)
        
        # Mettre à jour l'état du matériel
        materiel = reparation.materiel
        if reparation.date_fin:
            # Réparation terminée
            if reparation.type_reparation == 'corrective':
                materiel.etat = 'repare'
            else:
                materiel.etat = 'fonctionnel'
        else:
            # Réparation en cours
            if reparation.type_reparation == 'corrective':
                materiel.etat = 'en_panne'
            elif reparation.type_reparation == 'preventive':
                materiel.etat = 'en_maintenance'
            elif reparation.type_reparation == 'ameliorative':
                materiel.etat = 'en_amelioration'
            else:
                materiel.etat = 'en_reparation'
        
        materiel.save()
        return reparation