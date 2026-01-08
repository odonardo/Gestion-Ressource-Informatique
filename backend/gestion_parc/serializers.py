from rest_framework import serializers
from .models import *
from django.utils import timezone
from datetime import date
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']
        read_only_fields = ['id', 'is_active', 'date_joined']

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
    materiel_nom = serializers.CharField(source='materiel_concerne.nom', read_only=True)
    logiciel_nom = serializers.CharField(source='logiciel_concerne.nom', read_only=True)
    utilisateur_nom = serializers.CharField(source='utilisateur_signaleur.get_full_name', read_only=True)
    
    class Meta:
        model = Incident
        fields = '__all__'

class AlerteSerializer(serializers.ModelSerializer):
    materiel_nom = serializers.CharField(source='materiel_source.nom', read_only=True)
    logiciel_nom = serializers.CharField(source='logiciel_source.nom', read_only=True)
    
    class Meta:
        model = Alerte
        fields = '__all__'

class ReparationSerializer(serializers.ModelSerializer):
    materiel_nom = serializers.CharField(source='materiel.nom', read_only=True)
    
    class Meta:
        model = Reparation
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
        valid_etats = [choice[0] for choice in Materiel.ETAT_CHOICES]
        if value not in valid_etats:
            raise serializers.ValidationError(f"État invalide. Choix valides: {', '.join(valid_etats)}")
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