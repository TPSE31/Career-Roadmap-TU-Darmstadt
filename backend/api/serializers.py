from rest_framework import serializers
from .models import (
    User, Module, ExaminationRegulation, MilestoneDefinition,
    MilestoneProgress, UserModuleCompletion, CareerGoal,
    SupportService, Notification, CareerPath, ModuleCareerRelevance,
    UserCareerInterest, CareerOffer
)


# ============================================
# USER SERIALIZERS
# ============================================

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model - basic user information.
    Used for profile display and user details.
    """
    total_credits = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'program', 'semester', 'matriculation_number',
            'examination_regulation', 'total_credits',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'username', 'created_at', 'updated_at']

    def get_total_credits(self, obj):
        """Calculate total earned credits"""
        return obj.get_total_credits()


# ============================================
# MODULE SERIALIZERS
# ============================================

class ExaminationRegulationSerializer(serializers.ModelSerializer):
    """Serializer for ExaminationRegulation model"""
    class Meta:
        model = ExaminationRegulation
        fields = [
            'id', 'name', 'version', 'program',
            'total_credits_required', 'effective_date',
            'is_active', 'description'
        ]
        read_only_fields = ['id']


class ModuleSerializer(serializers.ModelSerializer):
    """
    Basic serializer for Module model.
    Used for module lists.
    """
    class Meta:
        model = Module
        fields = [
            'id', 'examination_regulation', 'module_code', 'name',
            'credits', 'category', 'group_name', 'description'
        ]
        read_only_fields = ['id']


class ModuleDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for Module model with prerequisites.
    Used for individual module details.
    """
    prerequisites = ModuleSerializer(many=True, read_only=True)
    required_for = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = [
            'id', 'examination_regulation', 'module_code', 'name',
            'credits', 'category', 'group_name', 'description',
            'prerequisites', 'required_for', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserModuleCompletionSerializer(serializers.ModelSerializer):
    """
    Serializer for UserModuleCompletion model.
    Tracks which modules a user has completed.
    """
    module_name = serializers.CharField(source='module.name', read_only=True)
    module_code = serializers.CharField(source='module.module_code', read_only=True)
    module_credits = serializers.IntegerField(source='module.credits', read_only=True)

    class Meta:
        model = UserModuleCompletion
        fields = [
            'id', 'user', 'module', 'module_name', 'module_code',
            'module_credits', 'status', 'completed_at', 'grade',
            'semester_taken', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


# ============================================
# MILESTONE SERIALIZERS
# ============================================

class MilestoneDefinitionSerializer(serializers.ModelSerializer):
    """Serializer for MilestoneDefinition model"""
    class Meta:
        model = MilestoneDefinition
        fields = [
            'id', 'examination_regulation', 'order_index', 'type',
            'label', 'description', 'rule_payload',
            'expected_by_semester', 'expected_by_date'
        ]
        read_only_fields = ['id']


class MilestoneProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for MilestoneProgress model.
    Shows user's progress on milestones.
    """
    milestone_label = serializers.CharField(source='milestone.label', read_only=True)
    milestone_type = serializers.CharField(source='milestone.type', read_only=True)
    milestone_description = serializers.CharField(source='milestone.description', read_only=True)
    milestone_order = serializers.IntegerField(source='milestone.order_index', read_only=True)

    class Meta:
        model = MilestoneProgress
        fields = [
            'id', 'user', 'milestone', 'milestone_label', 'milestone_type',
            'milestone_description', 'milestone_order', 'status',
            'achieved_at', 'computed_explanation', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


# ============================================
# CAREER GOAL SERIALIZERS
# ============================================

class CareerGoalSerializer(serializers.ModelSerializer):
    """Serializer for CareerGoal model"""
    class Meta:
        model = CareerGoal
        fields = [
            'id', 'user', 'goal_type', 'title', 'description',
            'tags', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


# ============================================
# NOTIFICATION SERIALIZERS
# ============================================

class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'type', 'priority', 'title', 'message',
            'due_at', 'read_at', 'is_read', 'related_milestone',
            'action_url', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']

    def get_is_read(self, obj):
        """Check if notification has been read"""
        return obj.read_at is not None


# ============================================
# SUPPORT SERVICE SERIALIZERS
# ============================================

class SupportServiceSerializer(serializers.ModelSerializer):
    """Serializer for SupportService model"""
    class Meta:
        model = SupportService
        fields = [
            'id', 'name', 'category', 'description',
            'contact_info', 'url', 'location', 'is_active',
            'related_milestones'
        ]
        read_only_fields = ['id']


# ============================================
# CAREER PATH SERIALIZERS
# ============================================

class CareerPathSerializer(serializers.ModelSerializer):
    """Serializer for CareerPath model"""
    salary_range = serializers.SerializerMethodField()
    module_count = serializers.SerializerMethodField()
    average_salary = serializers.SerializerMethodField()

    class Meta:
        model = CareerPath
        fields = [
            'id', 'career_id', 'title_en', 'title_de',
            'description_en', 'description_de',
            'salary_junior', 'salary_mid', 'salary_senior',
            'salary_range', 'average_salary', 'required_skills', 'icon',
            'is_active', 'module_count'
        ]
        read_only_fields = ['id']

    def get_salary_range(self, obj):
        """Format salary range as string."""
        if obj.salary_junior and obj.salary_senior:
            return f"€{obj.salary_junior:,} - €{obj.salary_senior:,}"
        return None

    def get_average_salary(self, obj):
        """Return salary as nested object for frontend."""
        return {
            'junior': obj.salary_junior,
            'mid': obj.salary_mid,
            'senior': obj.salary_senior
        }

    def get_module_count(self, obj):
        """Count related modules."""
        return obj.module_relevances.count()


class CareerPathDetailSerializer(CareerPathSerializer):
    """Detailed serializer with related modules."""
    top_modules = serializers.SerializerMethodField()

    class Meta(CareerPathSerializer.Meta):
        fields = CareerPathSerializer.Meta.fields + ['top_modules']

    def get_top_modules(self, obj):
        """Get top 10 most relevant modules for this career."""
        relevances = obj.module_relevances.select_related('module').order_by('-relevance_score')[:10]
        return [
            {
                'module_code': rel.module.module_code,
                'name': rel.module.name,
                'credits': rel.module.credits,
                'relevance_score': rel.relevance_score,
                'is_core': rel.is_core
            }
            for rel in relevances
        ]


class ModuleCareerRelevanceSerializer(serializers.ModelSerializer):
    """Serializer for ModuleCareerRelevance model"""
    career_title = serializers.CharField(source='career_path.title_en', read_only=True)
    career_id = serializers.CharField(source='career_path.career_id', read_only=True)

    class Meta:
        model = ModuleCareerRelevance
        fields = [
            'id', 'module', 'career_path', 'career_id', 'career_title',
            'relevance_score', 'is_core'
        ]
        read_only_fields = ['id']


class UserCareerInterestSerializer(serializers.ModelSerializer):
    """Serializer for UserCareerInterest model"""
    career_title = serializers.CharField(source='career_path.title_en', read_only=True)
    career_id = serializers.CharField(source='career_path.career_id', read_only=True)

    class Meta:
        model = UserCareerInterest
        fields = [
            'id', 'user', 'career_path', 'career_id', 'career_title',
            'interest_level', 'is_primary', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class ModuleWithRelevanceSerializer(serializers.ModelSerializer):
    """Module serializer with career relevance scores."""
    career_relevance = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = [
            'id', 'module_code', 'name', 'name_en', 'credits',
            'category', 'learning_content', 'learning_objectives',
            'language', 'career_relevance'
        ]
        read_only_fields = ['id']

    def get_career_relevance(self, obj):
        """Get career relevance scores for this module."""
        return {
            rel.career_path.career_id: {
                'score': rel.relevance_score,
                'is_core': rel.is_core
            }
            for rel in obj.career_relevances.select_related('career_path').all()
        }


class RecommendedModuleSerializer(serializers.ModelSerializer):
    """Serializer for recommended modules with relevance info."""
    relevance_score = serializers.IntegerField(read_only=True)
    matching_careers = serializers.ListField(read_only=True)
    recommendation_reason = serializers.CharField(read_only=True)

    class Meta:
        model = Module
        fields = [
            'id', 'module_code', 'name', 'name_en', 'credits',
            'category', 'learning_content', 'learning_objectives',
            'language', 'relevance_score', 'matching_careers',
            'recommendation_reason'
        ]
        read_only_fields = ['id']


# ============================================
# CAREER OFFER SERIALIZERS
# ============================================

class CareerOfferSerializer(serializers.ModelSerializer):
    """
    Serializer for CareerOffer model.
    Displays all fields for career offers from Infomappe.
    """
    class Meta:
        model = CareerOffer
        fields = '__all__'
