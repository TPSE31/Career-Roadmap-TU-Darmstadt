from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.hello_world, name="hello"),
    path("user/basic-info/", views.basic_user_info, name="basic_user_info"),
    path("program/overview/", views.program_overview, name="program_overview"),
    path("modules/list/", views.module_list, name="module_list"),
]