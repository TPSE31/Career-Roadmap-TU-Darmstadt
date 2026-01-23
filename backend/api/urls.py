from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

# Create a router and register ViewSets
router = DefaultRouter()

# Module endpoints
router.register(r'modules', views.ModuleViewSet, basename='module')
router.register(r'user/modules', views.UserModuleCompletionViewSet, basename='user-module')

# Milestone endpoints
router.register(r'milestones', views.MilestoneDefinitionViewSet, basename='milestone')
router.register(r'user/milestones', views.MilestoneProgressViewSet, basename='user-milestone')

# Notification endpoints
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# Support service endpoints
router.register(r'support/services', views.SupportServiceViewSet, basename='support-service')

# URL patterns
urlpatterns = [
    # Test endpoint
    path('hello/', views.hello_world, name='hello'),

    # Authentication endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/me/', views.CurrentUserView.as_view(), name='current-user'),
    path('auth/profile/', views.UpdateProfileView.as_view(), name='update-profile'),
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('auth/forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),

    # Recommendation endpoint
    path('recommendations/', views.RecommendationView.as_view(), name='recommendations'),

    # Support contact endpoint
    path('support/contact/', views.SupportContactView.as_view(), name='support-contact'),

    # Include router URLs
    path('', include(router.urls)),
]
