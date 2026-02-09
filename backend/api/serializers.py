from rest_framework import serializers
from .models import CareerOffer

# NOTE: Old serializers temporarily removed during data model migration.
# These will be reimplemented by backend team (Amine/Emir) to work with new models:
# - User (replaces Student)
# - Module (enhanced version)
# - UserModuleCompletion (replaces ModuleProgress)
# etc.


class CareerOfferSerializer(serializers.ModelSerializer):
    """
    Serializer for CareerOffer model.
    Displays all fields for career offers from Infomappe.
    """
    class Meta:
        model = CareerOffer
        fields = '__all__'
