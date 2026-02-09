from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, ExaminationRegulation, Module, MilestoneDefinition,
    MilestoneProgress, UserModuleCompletion, CareerGoal,
    SupportService, Notification, CareerOffer, CareerPath, ModuleCareerRelevance,
    UserCareerInterest
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for custom User model."""
    list_display = ['username', 'email', 'program', 'semester', 'examination_regulation', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'program']
    search_fields = ['username', 'email', 'matriculation_number', 'program']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Student Information', {
            'fields': ('program', 'semester', 'matriculation_number', 'examination_regulation')
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Student Information', {
            'fields': ('program', 'semester', 'matriculation_number', 'examination_regulation')
        }),
    )


@admin.register(ExaminationRegulation)
class ExaminationRegulationAdmin(admin.ModelAdmin):
    """Admin configuration for ExaminationRegulation model."""
    list_display = ['name', 'version', 'program', 'total_credits_required', 'effective_date', 'is_active']
    list_filter = ['is_active', 'program', 'effective_date']
    search_fields = ['name', 'version', 'program', 'description']
    date_hierarchy = 'effective_date'
    ordering = ['-effective_date', 'program']


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    """Admin configuration for Module model."""
    list_display = ['module_code', 'name', 'credits', 'category', 'examination_regulation']
    list_filter = ['category', 'examination_regulation']
    search_fields = ['module_code', 'name', 'description']
    filter_horizontal = ['prerequisites']
    ordering = ['module_code']


@admin.register(MilestoneDefinition)
class MilestoneDefinitionAdmin(admin.ModelAdmin):
    """Admin configuration for MilestoneDefinition model."""
    list_display = ['label', 'order_index', 'type', 'examination_regulation', 'expected_by_semester']
    list_filter = ['type', 'examination_regulation']
    search_fields = ['label', 'description']
    ordering = ['examination_regulation', 'order_index']


@admin.register(MilestoneProgress)
class MilestoneProgressAdmin(admin.ModelAdmin):
    """Admin configuration for MilestoneProgress model."""
    list_display = ['user', 'milestone', 'status', 'achieved_at']
    list_filter = ['status', 'milestone__type']
    search_fields = ['user__username', 'milestone__label']
    date_hierarchy = 'achieved_at'
    ordering = ['user', 'milestone__order_index']


@admin.register(UserModuleCompletion)
class UserModuleCompletionAdmin(admin.ModelAdmin):
    """Admin configuration for UserModuleCompletion model."""
    list_display = ['user', 'module', 'status', 'grade', 'completed_at', 'semester_taken']
    list_filter = ['status', 'module__category', 'semester_taken']
    search_fields = ['user__username', 'module__module_code', 'module__name']
    date_hierarchy = 'completed_at'
    ordering = ['-completed_at']


@admin.register(CareerGoal)
class CareerGoalAdmin(admin.ModelAdmin):
    """Admin configuration for CareerGoal model."""
    list_display = ['user', 'title', 'goal_type', 'is_active', 'created_at']
    list_filter = ['goal_type', 'is_active']
    search_fields = ['user__username', 'title', 'description']
    date_hierarchy = 'created_at'
    ordering = ['-is_active', '-created_at']


@admin.register(SupportService)
class SupportServiceAdmin(admin.ModelAdmin):
    """Admin configuration for SupportService model."""
    list_display = ['name', 'category', 'is_active', 'location']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description', 'location']
    filter_horizontal = ['related_milestones']
    ordering = ['category', 'name']


@admin.register(CareerOffer)
class CareerOfferAdmin(admin.ModelAdmin):
    """Admin configuration for CareerOffer model."""
    list_display = ['title_de', 'provider', 'category', 'is_active', 'priority']
    list_filter = ['category', 'is_active']
    search_fields = ['title_de', 'title_en', 'provider', 'description_de', 'description_en']
    ordering = ['-priority', 'category', 'title_de']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin configuration for Notification model."""
    list_display = ['user', 'title', 'type', 'priority', 'read_at', 'due_at', 'created_at']
    list_filter = ['type', 'priority', 'read_at']
    search_fields = ['user__username', 'title', 'message']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        """Mark selected notifications as read."""
        from django.utils import timezone
        count = queryset.filter(read_at__isnull=True).update(read_at=timezone.now())
        self.message_user(request, f'{count} notification(s) marked as read.')
    mark_as_read.short_description = 'Mark selected notifications as read'


@admin.register(CareerPath)
class CareerPathAdmin(admin.ModelAdmin):
    """Admin configuration for CareerPath model."""
    list_display = ['career_id', 'title_en', 'title_de', 'salary_junior', 'salary_senior', 'is_active']
    list_filter = ['is_active']
    search_fields = ['career_id', 'title_en', 'title_de', 'description_en']
    ordering = ['title_en']


@admin.register(ModuleCareerRelevance)
class ModuleCareerRelevanceAdmin(admin.ModelAdmin):
    """Admin configuration for ModuleCareerRelevance model."""
    list_display = ['module', 'career_path', 'relevance_score', 'is_core']
    list_filter = ['career_path', 'is_core', 'relevance_score']
    search_fields = ['module__module_code', 'module__name', 'career_path__career_id']
    ordering = ['-relevance_score']
    raw_id_fields = ['module', 'career_path']


@admin.register(UserCareerInterest)
class UserCareerInterestAdmin(admin.ModelAdmin):
    """Admin configuration for UserCareerInterest model."""
    list_display = ['user', 'career_path', 'interest_level', 'is_primary', 'created_at']
    list_filter = ['career_path', 'is_primary']
    search_fields = ['user__username', 'career_path__career_id']
    ordering = ['-is_primary', '-interest_level']
