from rest_framework import serializers
from .models import Student, Module, ModuleProgress


class ModuleSerializer(serializers.ModelSerializer):
    """
    Serializer for Module model.
    Displays module information including name and credit points.
    """
    class Meta:
        model = Module
        fields = ['id', 'name', 'credits']
        read_only_fields = ['id']


class ModuleProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for ModuleProgress model.
    Shows the relationship between students and modules with completion status.
    """
    module_name = serializers.CharField(source='module.name', read_only=True)
    module_credits = serializers.IntegerField(source='module.credits', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = ModuleProgress
        fields = [
            'id',
            'student',
            'student_name',
            'module',
            'module_name',
            'module_credits',
            'status'
        ]
        read_only_fields = ['id']

    def validate(self, data):
        """
        Validate that student-module combination is unique.
        """
        student = data.get('student')
        module = data.get('module')

        # Check if this is an update or create operation
        if self.instance is None:  # Create operation
            if ModuleProgress.objects.filter(student=student, module=module).exists():
                raise serializers.ValidationError(
                    "This student already has a progress record for this module."
                )

        return data


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for Student model.
    Includes nested module progress information.
    """
    module_progress = ModuleProgressSerializer(many=True, read_only=True)
    completed_modules_count = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id',
            'name',
            'program',
            'semester',
            'credits_completed',
            'module_progress',
            'completed_modules_count'
        ]
        read_only_fields = ['id']

    def get_completed_modules_count(self, obj):
        """
        Calculate the number of completed modules for this student.
        """
        return obj.module_progress.filter(status='done').count()


class StudentBasicSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for Student model without nested data.
    Useful for list views and when module progress is not needed.
    """
    class Meta:
        model = Student
        fields = ['id', 'name', 'program', 'semester', 'credits_completed']
        read_only_fields = ['id']
