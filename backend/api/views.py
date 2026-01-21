from django.http import HttpResponse
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

from .models import (
    User, Module, ExaminationRegulation, MilestoneDefinition,
    MilestoneProgress, UserModuleCompletion, CareerGoal,
    SupportService, Notification
)
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    UserProfileUpdateSerializer, ChangePasswordSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    ModuleSerializer, ModuleDetailSerializer, UserModuleCompletionSerializer,
    ExaminationRegulationSerializer, MilestoneDefinitionSerializer,
    MilestoneProgressSerializer, CareerGoalSerializer,
    NotificationSerializer, SupportServiceSerializer
)


# ============================================
# TEST ENDPOINT
# ============================================

def hello_world(request):
    """Simple test endpoint to verify the API is running"""
    return HttpResponse("Hello World from Gruppe 31!")


# ============================================
# AUTHENTICATION VIEWS
# ============================================

class RegisterView(APIView):
    """
    POST /auth/register/
    Register a new user account.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create token for the new user
            token, created = Token.objects.get_or_create(user=user)

            # Return user data and token
            user_serializer = UserSerializer(user)
            return Response({
                'token': token.key,
                'user': user_serializer.data,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    POST /auth/login/
    Login and receive authentication token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # Get or create token
            token, created = Token.objects.get_or_create(user=user)

            # Return user data and token
            user_serializer = UserSerializer(user)
            return Response({
                'token': token.key,
                'user': user_serializer.data,
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    POST /auth/logout/
    Logout and invalidate token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Delete the user's token
            request.user.auth_token.delete()
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    """
    GET /auth/me/
    Get current authenticated user profile.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateProfileView(APIView):
    """
    PATCH /auth/profile/
    Update user profile information.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            # Return updated user data
            user_serializer = UserSerializer(request.user)
            return Response({
                'user': user_serializer.data,
                'message': 'Profile updated successfully'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    POST /auth/change-password/
    Change user password (requires old password).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            # Set new password
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()

            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    """
    POST /auth/forgot-password/
    Send password reset email (placeholder implementation).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            # TODO: Implement email sending logic here
            # For now, just return success message

            return Response({
                'message': 'Password reset email sent successfully'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """
    POST /auth/reset-password/
    Reset password with token (placeholder implementation).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            # TODO: Implement token validation and password reset logic
            # For now, just return success message

            return Response({
                'message': 'Password reset successful'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# MODULE VIEWS
# ============================================

class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /modules/ - List all modules
    GET /modules/:id/ - Get module details
    """
    queryset = Module.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ModuleDetailSerializer
        return ModuleSerializer

    def get_queryset(self):
        """Filter modules by user's examination regulation if available"""
        queryset = Module.objects.all()

        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)

        # Filter by examination regulation if provided
        regulation_id = self.request.query_params.get('regulation', None)
        if regulation_id:
            queryset = queryset.filter(examination_regulation_id=regulation_id)
        elif self.request.user.examination_regulation:
            # Default to user's examination regulation
            queryset = queryset.filter(
                examination_regulation=self.request.user.examination_regulation
            )

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
# RECOMMENDATION VIEW
# ============================================

class RecommendationView(APIView):
    """
    GET /recommendations/
    Get course recommendations based on career goal and progress.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get user's career goals
        career_goals = CareerGoal.objects.filter(user=user, is_active=True)

        # Get completed modules
        completed_modules = UserModuleCompletion.objects.filter(
            user=user,
            status='completed'
        ).values_list('module_id', flat=True)

        # Get available modules (not completed)
        available_modules = Module.objects.exclude(
            id__in=completed_modules
        )

        # If user has examination regulation, filter by it
        if user.examination_regulation:
            available_modules = available_modules.filter(
                examination_regulation=user.examination_regulation
            )

        # Simple recommendation: prioritize elective and specialization courses
        recommended_modules = available_modules.filter(
            category__in=['elective', 'specialization']
        )[:10]  # Limit to 10 recommendations

        serializer = ModuleSerializer(recommended_modules, many=True)

        return Response({
            'recommendations': serializer.data,
            'message': 'Recommendations based on your career goals and progress'
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
