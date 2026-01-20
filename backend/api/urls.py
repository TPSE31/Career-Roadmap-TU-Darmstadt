from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
# NOTE: ViewSets temporarily removed during data model migration.
# Will be reimplemented by backend team (Amine/Emir) for new models.
# router.register(r'users', views.UserViewSet, basename='user')
# router.register(r'modules', views.ModuleViewSet, basename='module')
# router.register(r'milestones', views.MilestoneViewSet, basename='milestone')
# etc.

# The API URLs
# unsere API-Routen
router.register(r"students", views.StudentViewSet, basename="student")
router.register(r"modules", views.ModuleViewSet, basename="module")
router.register(r"progress", views.ModuleProgressViewSet, basename="progress")

urlpatterns = [
    # Test endpoint
    path("hello/", views.hello_world, name="hello"),

    # Alle ViewSet-Routen
    path("", include(router.urls)),
]