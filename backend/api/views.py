from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

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
