from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for future viewsets
router = DefaultRouter()

# NOTE: ViewSets temporarily removed during data model migration.
# Will be reimplemented by backend team (Amine/Emir) for new models.
# router.register(r'users', views.UserViewSet, basename='user')
# router.register(r'modules', views.ModuleViewSet, basename='module')
# router.register(r'milestones', views.MilestoneViewSet, basename='milestone')
# etc.

# The API URLs
urlpatterns = [
    # Test endpoint
    path("hello/", views.hello_world, name="hello"),

    # Include all router-generated URLs (empty for now)
    path("", include(router.urls)),
]
