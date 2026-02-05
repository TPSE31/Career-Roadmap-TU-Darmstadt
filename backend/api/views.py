from django.http import HttpResponse
from django.utils import timezone
from django.db.models import Sum, Avg, Q, F
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from .models import (
    Module, ExaminationRegulation, MilestoneDefinition,
    MilestoneProgress, UserModuleCompletion, CareerGoal,
    SupportService, Notification, CareerPath, ModuleCareerRelevance,
    UserCareerInterest
)
from .serializers import (
    ModuleSerializer, ModuleDetailSerializer, UserModuleCompletionSerializer,
    ExaminationRegulationSerializer, MilestoneDefinitionSerializer,
    MilestoneProgressSerializer, CareerGoalSerializer,
    NotificationSerializer, SupportServiceSerializer,
    CareerPathSerializer, CareerPathDetailSerializer,
    UserCareerInterestSerializer, ModuleWithRelevanceSerializer
)


# ============================================
# TEST ENDPOINT
# ============================================

def hello_world(request):
    """Simple test endpoint to verify the API is running"""
    return HttpResponse("Hello World from Gruppe 31!")


# ============================================
# MODULE VIEWS
# ============================================

class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /modules/ - List all modules
    GET /modules/:id/ - Get module details
    """
    queryset = Module.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ModuleDetailSerializer
        return ModuleSerializer

    def get_queryset(self):
        """Filter modules by examination regulation if available"""
        queryset = Module.objects.all()

        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)

        # Filter by examination regulation if provided
        regulation_id = self.request.query_params.get('regulation', None)
        if regulation_id:
            queryset = queryset.filter(examination_regulation_id=regulation_id)

        # Filter by career path if provided
        career_id = self.request.query_params.get('career', None)
        if career_id:
            queryset = queryset.filter(
                career_relevances__career_path__career_id=career_id
            ).distinct()

        return queryset.order_by('module_code')


class UserModuleCompletionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user module completions.
    POST /user/modules/:id/complete - Mark module as completed
    DELETE /user/modules/:id/complete - Unmark module
    """
    serializer_class = UserModuleCompletionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only current user's module completions"""
        return UserModuleCompletion.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='complete')
    def mark_complete(self, request, pk=None):
        """Mark a module as completed"""
        try:
            module = Module.objects.get(pk=pk)
        except Module.DoesNotExist:
            return Response({
                'error': 'Module not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if completion already exists
        completion, created = UserModuleCompletion.objects.get_or_create(
            user=request.user,
            module=module,
            defaults={
                'status': 'completed',
                'completed_at': timezone.now()
            }
        )

        if not created:
            # Update existing completion
            completion.status = 'completed'
            completion.completed_at = timezone.now()
            completion.save()

        serializer = self.get_serializer(completion)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], url_path='complete')
    def unmark_complete(self, request, pk=None):
        """Unmark a module (delete completion record)"""
        try:
            module = Module.objects.get(pk=pk)
            completion = UserModuleCompletion.objects.get(
                user=request.user,
                module=module
            )
            completion.delete()
            return Response({
                'message': 'Module unmarked successfully'
            }, status=status.HTTP_200_OK)
        except Module.DoesNotExist:
            return Response({
                'error': 'Module not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except UserModuleCompletion.DoesNotExist:
            return Response({
                'error': 'Module completion not found'
            }, status=status.HTTP_404_NOT_FOUND)


# ============================================
# MILESTONE VIEWS
# ============================================

class MilestoneDefinitionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /milestones/ - Get all milestones
    """
    queryset = MilestoneDefinition.objects.all()
    serializer_class = MilestoneDefinitionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by user's examination regulation"""
        queryset = MilestoneDefinition.objects.all()

        if self.request.user.examination_regulation:
            queryset = queryset.filter(
                examination_regulation=self.request.user.examination_regulation
            )

        return queryset.order_by('order_index')


class MilestoneProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /user/milestones/ - Get user's milestone progress
    """
    serializer_class = MilestoneProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only current user's milestone progress"""
        return MilestoneProgress.objects.filter(
            user=self.request.user
        ).order_by('milestone__order_index')


# ============================================
# CAREER PATH VIEWS
# ============================================

class CareerPathViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /careers/ - List all career paths
    GET /careers/:id/ - Get career path details with top modules
    """
    queryset = CareerPath.objects.filter(is_active=True)
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CareerPathDetailSerializer
        return CareerPathSerializer

    @action(detail=True, methods=['get'], url_path='modules')
    def get_modules(self, request, pk=None):
        """Get all modules relevant to this career path."""
        career_path = self.get_object()
        relevances = ModuleCareerRelevance.objects.filter(
            career_path=career_path
        ).select_related('module').order_by('-relevance_score')

        modules_data = []
        for rel in relevances:
            module = rel.module
            modules_data.append({
                'id': module.id,
                'module_code': module.module_code,
                'name': module.name,
                'credits': module.credits,
                'category': module.category,
                'relevance_score': rel.relevance_score,
                'is_core': rel.is_core,
                'learning_objectives': module.learning_objectives[:200] + '...' if len(module.learning_objectives) > 200 else module.learning_objectives
            })

        return Response({
            'career_path': CareerPathSerializer(career_path).data,
            'modules': modules_data,
            'total_count': len(modules_data)
        })


class UserCareerInterestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user career interests.
    """
    serializer_class = UserCareerInterestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserCareerInterest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # If this is set as primary, unset other primary interests
        if serializer.validated_data.get('is_primary', False):
            UserCareerInterest.objects.filter(
                user=self.request.user, is_primary=True
            ).update(is_primary=False)
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='set-interests')
    def set_interests(self, request):
        """Set multiple career interests at once."""
        interests_data = request.data.get('interests', [])

        # Clear existing interests
        UserCareerInterest.objects.filter(user=request.user).delete()

        created_interests = []
        for interest in interests_data:
            career_id = interest.get('career_id')
            try:
                career_path = CareerPath.objects.get(career_id=career_id)
                user_interest = UserCareerInterest.objects.create(
                    user=request.user,
                    career_path=career_path,
                    interest_level=interest.get('interest_level', 50),
                    is_primary=interest.get('is_primary', False)
                )
                created_interests.append(user_interest)
            except CareerPath.DoesNotExist:
                continue

        serializer = UserCareerInterestSerializer(created_interests, many=True)
        return Response({
            'message': f'Set {len(created_interests)} career interests',
            'interests': serializer.data
        })


# ============================================
# RECOMMENDATION VIEW
# ============================================

class RecommendationView(APIView):
    """
    GET /recommendations/
    Get smart course recommendations based on career interests and progress.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        limit = int(request.query_params.get('limit', 10))

        # Get user's career interests
        career_interests = UserCareerInterest.objects.filter(
            user=user
        ).select_related('career_path')

        # Get completed module IDs
        completed_module_ids = UserModuleCompletion.objects.filter(
            user=user,
            status='completed'
        ).values_list('module_id', flat=True)

        # Get in-progress module IDs
        in_progress_module_ids = UserModuleCompletion.objects.filter(
            user=user,
            status='in_progress'
        ).values_list('module_id', flat=True)

        # Base queryset: exclude completed and in-progress modules
        available_modules = Module.objects.exclude(
            id__in=list(completed_module_ids) + list(in_progress_module_ids)
        )

        # If user has examination regulation, filter by it
        if user.examination_regulation:
            available_modules = available_modules.filter(
                examination_regulation=user.examination_regulation
            )

        recommendations = []

        if career_interests.exists():
            # Smart recommendation based on career interests
            career_path_ids = [ci.career_path_id for ci in career_interests]
            interest_weights = {ci.career_path_id: ci.interest_level for ci in career_interests}

            # Get modules with relevance to user's career interests
            relevant_modules = available_modules.filter(
                career_relevances__career_path_id__in=career_path_ids
            ).prefetch_related('career_relevances__career_path').distinct()

            # Calculate weighted score for each module
            module_scores = {}
            for module in relevant_modules:
                total_score = 0
                matching_careers = []

                for relevance in module.career_relevances.all():
                    if relevance.career_path_id in interest_weights:
                        # Weight by both relevance score and user interest level
                        weighted_score = (
                            relevance.relevance_score *
                            interest_weights[relevance.career_path_id] / 100
                        )
                        total_score += weighted_score
                        matching_careers.append({
                            'career_id': relevance.career_path.career_id,
                            'career_title': relevance.career_path.title_en,
                            'relevance_score': relevance.relevance_score
                        })

                if total_score > 0:
                    module_scores[module.id] = {
                        'module': module,
                        'score': total_score,
                        'matching_careers': matching_careers
                    }

            # Sort by score and take top modules
            sorted_modules = sorted(
                module_scores.values(),
                key=lambda x: x['score'],
                reverse=True
            )[:limit]

            for item in sorted_modules:
                module = item['module']
                career_names = [c['career_title'] for c in item['matching_careers'][:3]]
                recommendations.append({
                    'id': module.id,
                    'module_code': module.module_code,
                    'name': module.name,
                    'name_en': module.name_en,
                    'credits': module.credits,
                    'category': module.category,
                    'language': module.language,
                    'relevance_score': round(item['score']),
                    'matching_careers': item['matching_careers'],
                    'recommendation_reason': f"Relevant for: {', '.join(career_names)}",
                    'learning_objectives': module.learning_objectives[:300] + '...' if len(module.learning_objectives) > 300 else module.learning_objectives
                })
        else:
            # Fallback: recommend by category (elective/specialization)
            fallback_modules = available_modules.filter(
                category__in=['elective', 'specialization']
            ).order_by('?')[:limit]

            for module in fallback_modules:
                recommendations.append({
                    'id': module.id,
                    'module_code': module.module_code,
                    'name': module.name,
                    'name_en': module.name_en,
                    'credits': module.credits,
                    'category': module.category,
                    'language': module.language,
                    'relevance_score': 0,
                    'matching_careers': [],
                    'recommendation_reason': "Set your career interests for personalized recommendations",
                    'learning_objectives': module.learning_objectives[:300] + '...' if len(module.learning_objectives) > 300 else module.learning_objectives
                })

        # Calculate user stats
        total_completed_credits = Module.objects.filter(
            id__in=completed_module_ids
        ).aggregate(total=Sum('credits'))['total'] or 0

        return Response({
            'recommendations': recommendations,
            'user_stats': {
                'completed_modules': len(completed_module_ids),
                'completed_credits': total_completed_credits,
                'career_interests_set': career_interests.exists(),
                'career_interests': [
                    {
                        'career_id': ci.career_path.career_id,
                        'title': ci.career_path.title_en,
                        'interest_level': ci.interest_level,
                        'is_primary': ci.is_primary
                    }
                    for ci in career_interests
                ]
            },
            'message': 'Personalized recommendations based on your career interests' if career_interests.exists() else 'Set your career interests for personalized recommendations'
        }, status=status.HTTP_200_OK)


# ============================================
# NOTIFICATION VIEWS
# ============================================

class NotificationViewSet(viewsets.ModelViewSet):
    """
    GET /notifications/ - Get user's notifications
    PATCH /notifications/:id/read - Mark notification as read
    DELETE /notifications/:id/ - Delete notification
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only current user's notifications"""
        queryset = Notification.objects.filter(user=self.request.user)

        # Filter by read status if provided
        read_status = self.request.query_params.get('read', None)
        if read_status == 'true':
            queryset = queryset.filter(read_at__isnull=False)
        elif read_status == 'false':
            queryset = queryset.filter(read_at__isnull=True)

        return queryset.order_by('-created_at')

    @action(detail=True, methods=['patch'], url_path='read')
    def mark_as_read(self, request, pk=None):
        """Mark notification as read"""
        try:
            notification = self.get_object()
            notification.mark_as_read()
            serializer = self.get_serializer(notification)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({
                'error': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)


# ============================================
# SUPPORT SERVICE VIEWS
# ============================================

class SupportServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /support/services/ - Get list of support services
    """
    queryset = SupportService.objects.filter(is_active=True)
    serializer_class = SupportServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by category if provided"""
        queryset = SupportService.objects.filter(is_active=True)

        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)

        return queryset.order_by('category', 'name')


class SupportContactView(APIView):
    """
    POST /support/contact/
    Submit contact form to support services.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # TODO: Implement contact form submission logic
        # For now, just return success message

        return Response({
            'message': 'Contact form submitted successfully. We will get back to you soon.'
        }, status=status.HTTP_200_OK)
