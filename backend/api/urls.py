from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

# Create a router and register ViewSets
router = DefaultRouter()

# Module endpoints
router.register(r'modules', views.ModuleViewSet, basename='module')
router.register(r'user/modules', views.UserModuleCompletionViewSet, basename='user-module')

# Career offer endpoints
router.register(r'career-offers', views.CareerOfferViewSet, basename='career-offers')

# Milestone endpoints
router.register(r'milestones', views.MilestoneDefinitionViewSet, basename='milestone')
router.register(r'user/milestones', views.MilestoneProgressViewSet, basename='user-milestone')

# Notification endpoints
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# Support service endpoints
router.register(r'support/services', views.SupportServiceViewSet, basename='support-service')

# Career path endpoints
router.register(r'careers', views.CareerPathViewSet, basename='career')
router.register(r'user/career-interests', views.UserCareerInterestViewSet, basename='user-career-interest')

# URL patterns
urlpatterns = [
    # Test endpoint
    path('hello/', views.hello_world, name='hello'),

    # Recommendation endpoint
    path('recommendations/', views.RecommendationView.as_view(), name='recommendations'),

    # Support contact endpoint
    path('support/contact/', views.SupportContactView.as_view(), name='support-contact'),

    # Master programs endpoint
    path('master-programs/', views.MasterProgramView.as_view(), name='master-programs'),

    # Include router URLs
    path('', include(router.urls)),
]
