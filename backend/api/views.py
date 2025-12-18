from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student, Module, ModuleProgress
from .serializers import (
    StudentSerializer,
    StudentBasicSerializer,
    ModuleSerializer,
    ModuleProgressSerializer
)


def hello_world(request):
    """
    Simple test endpoint to verify the API is running.
    """
    return HttpResponse("Hello World from Gruppe 31!")


class StudentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Student CRUD operations.

    Endpoints:
    - GET /api/students/ - List all students
    - POST /api/students/ - Create a new student
    - GET /api/students/{id}/ - Retrieve a specific student
    - PUT /api/students/{id}/ - Update a student
    - PATCH /api/students/{id}/ - Partially update a student
    - DELETE /api/students/{id}/ - Delete a student
    - GET /api/students/{id}/progress/ - Get student's module progress
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_serializer_class(self):
        """
        Use StudentBasicSerializer for list view to improve performance.
        Use full StudentSerializer for detail view with nested data.
        """
        if self.action == 'list':
            return StudentBasicSerializer
        return StudentSerializer

    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        """
        Custom endpoint to get a student's module progress.
        URL: /api/students/{id}/progress/
        """
        student = self.get_object()
        progress = ModuleProgress.objects.filter(student=student).select_related('module')
        serializer = ModuleProgressSerializer(progress, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """
        Custom endpoint to get a student's statistics.
        URL: /api/students/{id}/stats/
        """
        student = self.get_object()
        progress = ModuleProgress.objects.filter(student=student)

        total_modules = progress.count()
        completed_modules = progress.filter(status='done').count()
        in_progress_modules = progress.filter(status='in_progress').count()
        open_modules = progress.filter(status='open').count()

        stats = {
            'student_id': student.id,
            'name': student.name,
            'program': student.program,
            'semester': student.semester,
            'credits_completed': student.credits_completed,
            'total_modules': total_modules,
            'completed_modules': completed_modules,
            'in_progress_modules': in_progress_modules,
            'open_modules': open_modules,
            'completion_percentage': round((completed_modules / total_modules * 100), 2) if total_modules > 0 else 0,
            'status': 'on_track' if completed_modules / total_modules >= 0.5 else 'needs_attention' if total_modules > 0 else 'just_started'
        }

        return Response(stats)


class ModuleViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Module CRUD operations.

    Endpoints:
    - GET /api/modules/ - List all modules
    - POST /api/modules/ - Create a new module
    - GET /api/modules/{id}/ - Retrieve a specific module
    - PUT /api/modules/{id}/ - Update a module
    - PATCH /api/modules/{id}/ - Partially update a module
    - DELETE /api/modules/{id}/ - Delete a module
    """
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Custom endpoint to get module statistics.
        URL: /api/modules/summary/
        """
        total_modules = Module.objects.count()
        total_credits = sum([module.credits for module in Module.objects.all()])

        summary = {
            'total_modules': total_modules,
            'total_credits': total_credits,
            'average_credits_per_module': round(total_credits / total_modules, 2) if total_modules > 0 else 0
        }

        return Response(summary)


class ModuleProgressViewSet(viewsets.ModelViewSet):
    """
    API endpoint for ModuleProgress CRUD operations.

    Endpoints:
    - GET /api/progress/ - List all progress records
    - POST /api/progress/ - Create a new progress record
    - GET /api/progress/{id}/ - Retrieve a specific progress record
    - PUT /api/progress/{id}/ - Update a progress record
    - PATCH /api/progress/{id}/ - Partially update a progress record
    - DELETE /api/progress/{id}/ - Delete a progress record
    """
    queryset = ModuleProgress.objects.all().select_related('student', 'module')
    serializer_class = ModuleProgressSerializer

    def get_queryset(self):
        """
        Optionally filter progress by student_id or status via query parameters.
        Examples:
        - /api/progress/?student_id=1
        - /api/progress/?status=done
        - /api/progress/?student_id=1&status=done
        """
        queryset = ModuleProgress.objects.all().select_related('student', 'module')

        student_id = self.request.query_params.get('student_id', None)
        status_param = self.request.query_params.get('status', None)

        if student_id is not None:
            queryset = queryset.filter(student_id=student_id)

        if status_param is not None:
            queryset = queryset.filter(status=status_param)

        return queryset

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """
        Custom endpoint to get progress records grouped by status.
        URL: /api/progress/by_status/
        """
        done = ModuleProgress.objects.filter(status='done').count()
        in_progress = ModuleProgress.objects.filter(status='in_progress').count()
        open_count = ModuleProgress.objects.filter(status='open').count()

        result = {
            'done': done,
            'in_progress': in_progress,
            'open': open_count,
            'total': done + in_progress + open_count
        }

        return Response(result)
