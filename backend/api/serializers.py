from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, Module, ExaminationRegulation, MilestoneDefinition,
    MilestoneProgress, UserModuleCompletion, CareerGoal,
    SupportService, Notification
)


# ============================================
# AUTHENTICATION SERIALIZERS
# ============================================

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Accepts: email, password, name, student_ID, semester, completed_modules, career_goal
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'program', 'semester',
            'matriculation_number', 'examination_regulation'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate(self, attrs):
        """Validate that passwords match"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        """Create user with hashed password"""
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Accepts: username/email + password
    Returns: token + user object
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        """Authenticate user credentials"""
        username = attrs.get('username')
        password = attrs.get('password')

        # Try to authenticate
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        attrs['user'] = user
        return attrs


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


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    Allows updating: name, program, semester, etc.
    """
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'program', 'semester',
            'matriculation_number', 'examination_regulation'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True, write_only=True, label="Confirm New Password")

    def validate(self, attrs):
        """Validate that new passwords match"""
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "New password fields didn't match."})
        return attrs

    def validate_old_password(self, value):
        """Validate that old password is correct"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for password reset request (forgot password).
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """Check if user with this email exists"""
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for password reset confirmation.
    """
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True, write_only=True, label="Confirm New Password")

    def validate(self, attrs):
        """Validate that new passwords match"""
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs


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
