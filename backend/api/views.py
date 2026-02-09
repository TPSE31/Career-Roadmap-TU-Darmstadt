from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CareerOffer
from .serializers import CareerOfferSerializer

# NOTE: ViewSets and Serializers temporarily removed during data model migration.
# These will be reimplemented by backend team (Amine/Emir) to work with new models:
# - User (replaces Student)
# - ExaminationRegulation
# - Module (enhanced version)
# - MilestoneDefinition
# - MilestoneProgress
# - UserModuleCompletion (replaces ModuleProgress)
# - CareerGoal
# - SupportService
# - Notification
#
# For now, keeping only the hello world endpoint to verify API is running.


def hello_world(request):
    """
    Simple test endpoint to verify the API is running.
    """
    return HttpResponse("Hello World from Gruppe 31!")


class CareerOfferViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for career offers (yellow-highlighted from Infomappe).
    Supports filtering by career field.
    """
    queryset = CareerOffer.objects.filter(is_active=True)
    serializer_class = CareerOfferSerializer

    @action(detail=False, methods=['get'])
    def by_career_field(self, request):
        """
        GET /api/career-offers/by_career_field/?field=industry
        Returns offers where career_fields array contains the specified field.
        """
        field = request.query_params.get('field', None)
        if not field:
            return Response({'error': 'field parameter required'}, status=400)

        # Get all active offers and filter in Python (SQLite-compatible)
        all_offers = self.queryset.all()
        filtered_offers = [
            offer for offer in all_offers
            if field in offer.career_fields
        ]

        serializer = self.get_serializer(filtered_offers, many=True)
        return Response(serializer.data)
