import django_filters
from .models import Materiel

class MaterielFilter(django_filters.FilterSet):
    nom = django_filters.CharFilter(lookup_expr='icontains')
    reference = django_filters.CharFilter(lookup_expr='icontains')
    date_achat_after = django_filters.DateFilter(field_name='date_achat', lookup_expr='gte')
    date_achat_before = django_filters.DateFilter(field_name='date_achat', lookup_expr='lte')
    utilisateur_attribue = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Materiel
        fields = [
            'etat', 
            'service_attribue',
            'nom',
            'reference',
            'date_achat_after',
            'date_achat_before',
            'utilisateur_attribue'
        ]