from django.http import HttpResponse
from rest_framework import viewsets
from .models import Student, Module, ModuleProgress
from .serializers import StudentSerializer, ModuleSerializer, ModuleProgressSerializer

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
    return HttpResponse("Hello World from Gruppe 31!")


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer


class ModuleProgressViewSet(viewsets.ModelViewSet):
    queryset = ModuleProgress.objects.all()
    serializer_class = ModuleProgressSerializer
