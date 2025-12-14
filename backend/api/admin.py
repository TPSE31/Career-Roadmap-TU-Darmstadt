from django.contrib import admin
from .models import Student, Module, ModuleProgress

admin.site.register(Student)
admin.site.register(Module)
admin.site.register(ModuleProgress)
# Register your models here.
