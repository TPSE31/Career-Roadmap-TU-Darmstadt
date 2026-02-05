from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.utils import timezone


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser for authentication.
    Stores student information and program details.
    """
    program = models.CharField(
        max_length=200,
        blank=True,
        help_text="Student's degree program (e.g., Computer Science B.Sc.)"
    )
    semester = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1)],
        help_text="Current semester number"
    )
    matriculation_number = models.CharField(
        max_length=50,
        blank=True,
        unique=True,
        null=True,
        help_text="Student matriculation number (TU-ID)"
    )
    examination_regulation = models.ForeignKey(
        'ExaminationRegulation',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        help_text="The examination regulation version this student follows"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.program or 'No program'})"

    def get_total_credits(self):
        """Calculate total earned credits from completed modules."""
        return self.module_completions.filter(
            status='completed'
        ).aggregate(
            total=models.Sum('module__credits')
        )['total'] or 0


class ExaminationRegulation(models.Model):
    """
    Represents different versions of examination regulations.
    Defines degree requirements, milestones, and module groups.
    """
    name = models.CharField(
        max_length=200,
        help_text="Name of the examination regulation (e.g., 'Computer Science B.Sc. 2020')"
    )
    version = models.CharField(
        max_length=50,
        help_text="Version identifier (e.g., '2020', 'v2.1')"
    )
    program = models.CharField(
        max_length=200,
        help_text="Degree program this regulation applies to"
    )
    total_credits_required = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="Total CP required for degree completion"
    )
    effective_date = models.DateField(
        help_text="Date when this regulation becomes effective"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this regulation is currently active"
    )
    description = models.TextField(
        blank=True,
        help_text="Additional description or notes about this regulation"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'examination_regulations'
        verbose_name = 'Examination Regulation'
        verbose_name_plural = 'Examination Regulations'
        unique_together = ('name', 'version')
        ordering = ['-effective_date', 'program']
        indexes = [
            models.Index(fields=['program', 'is_active']),
            models.Index(fields=['effective_date']),
        ]

    def __str__(self):
        return f"{self.name} (v{self.version})"


class Module(models.Model):
    """
    Module catalog entry representing a course/module.
    Linked to examination regulations and can have prerequisites.
    """
    CATEGORY_CHOICES = [
        ('Pflichtbereich', 'Pflichtbereich'),
        ('Wahlpflichtbereich', 'Wahlpflichtbereich'),
        ('Informatik-Wahlbereich', 'Informatik-Wahlbereich'),
        ('Studienbegleitende Leistungen', 'Studienbegleitende Leistungen'),
        ('Studium Generale', 'Studium Generale'),
        ('Abschlussbereich', 'Abschlussbereich'),
    ]

    examination_regulation = models.ForeignKey(
        ExaminationRegulation,
        on_delete=models.CASCADE,
        related_name='modules',
        help_text="The regulation this module belongs to"
    )
    module_code = models.CharField(
        max_length=50,
        help_text="Official module code (e.g., 'CS101', '20-00-0001')"
    )
    name = models.CharField(
        max_length=200,
        help_text="Module name (German)"
    )
    name_en = models.CharField(
        max_length=200,
        blank=True,
        help_text="Module name (English)"
    )
    credits = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="Credit points (CP/ECTS) for this module"
    )
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='Wahlpflichtbereich',
        help_text="Module category/group"
    )
    group_name = models.CharField(
        max_length=200,
        blank=True,
        help_text="Optional group name for organizing modules (e.g., 'Foundations', 'Advanced CS')"
    )
    description = models.TextField(
        blank=True,
        help_text="Module description (short)"
    )
    learning_content = models.TextField(
        blank=True,
        help_text="Detailed learning content and topics covered"
    )
    learning_objectives = models.TextField(
        blank=True,
        help_text="Learning objectives and outcomes"
    )
    prerequisites_text = models.TextField(
        blank=True,
        help_text="Prerequisites as text description"
    )
    exam_form = models.TextField(
        blank=True,
        help_text="Examination form and requirements"
    )
    workload_hours = models.IntegerField(
        null=True,
        blank=True,
        help_text="Total workload in hours"
    )
    self_study_hours = models.IntegerField(
        null=True,
        blank=True,
        help_text="Self-study hours"
    )
    duration_semesters = models.IntegerField(
        default=1,
        help_text="Duration in semesters"
    )
    language = models.CharField(
        max_length=50,
        default='Deutsch',
        help_text="Teaching language"
    )
    offering_frequency = models.CharField(
        max_length=100,
        blank=True,
        help_text="How often the module is offered (e.g., 'Jedes Semester')"
    )
    prerequisites = models.ManyToManyField(
        'self',
        symmetrical=False,
        blank=True,
        related_name='required_for',
        help_text="Modules that must be completed before this one"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'modules'
        verbose_name = 'Module'
        verbose_name_plural = 'Modules'
        unique_together = ('examination_regulation', 'module_code')
        ordering = ['module_code']
        indexes = [
            models.Index(fields=['examination_regulation', 'category']),
            models.Index(fields=['module_code']),
        ]

    def __str__(self):
        return f"{self.module_code} - {self.name} ({self.credits} CP)"

    def get_career_relevance(self):
        """Get career relevance scores for this module."""
        return {
            rel.career_path.career_id: rel.relevance_score
            for rel in self.career_relevances.all()
        }


class MilestoneDefinition(models.Model):
    """
    Defines a station on the subway/roadmap line.
    These are the checkpoints students progress through.
    """
    MILESTONE_TYPE_CHOICES = [
        ('onboarding', 'Onboarding'),
        ('cp_threshold', 'Credit Point Threshold'),
        ('module_group', 'Module Group Completion'),
        ('deadline', 'Administrative Deadline'),
        ('career_goal', 'Career Goal Checkpoint'),
        ('thesis', 'Thesis Milestone'),
        ('completion', 'Degree Completion'),
    ]

    examination_regulation = models.ForeignKey(
        ExaminationRegulation,
        on_delete=models.CASCADE,
        related_name='milestones',
        help_text="The regulation this milestone belongs to"
    )
    order_index = models.IntegerField(
        help_text="Order of this milestone in the sequence (lower = earlier)"
    )
    type = models.CharField(
        max_length=50,
        choices=MILESTONE_TYPE_CHOICES,
        help_text="Type of milestone"
    )
    label = models.CharField(
        max_length=200,
        help_text="Short display label for the milestone"
    )
    description = models.TextField(
        help_text="Detailed description of the milestone and its requirements"
    )
    rule_payload = models.JSONField(
        default=dict,
        blank=True,
        help_text="JSON data defining completion rules (e.g., {cp_required: 30, modules: [...]})"
    )
    expected_by_semester = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1)],
        help_text="Expected semester for completion (for on-track calculation)"
    )
    expected_by_date = models.DateField(
        null=True,
        blank=True,
        help_text="Expected date for completion (for deadline-based milestones)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'milestone_definitions'
        verbose_name = 'Milestone Definition'
        verbose_name_plural = 'Milestone Definitions'
        unique_together = ('examination_regulation', 'order_index')
        ordering = ['examination_regulation', 'order_index']
        indexes = [
            models.Index(fields=['examination_regulation', 'type']),
            models.Index(fields=['order_index']),
        ]

    def __str__(self):
        return f"{self.label} (Order: {self.order_index})"


class MilestoneProgress(models.Model):
    """
    Stores a user's progress status for a specific milestone station.
    Tracks whether they've completed it and when.
    """
    STATUS_CHOICES = [
        ('locked', 'Locked'),
        ('available', 'Available'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='milestone_progress',
        help_text="The user whose progress is tracked"
    )
    milestone = models.ForeignKey(
        MilestoneDefinition,
        on_delete=models.CASCADE,
        related_name='user_progress',
        help_text="The milestone being tracked"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='locked',
        help_text="Current status of this milestone for the user"
    )
    achieved_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when the milestone was completed"
    )
    computed_explanation = models.TextField(
        blank=True,
        help_text="Auto-generated explanation of progress (e.g., '25/30 CP completed')"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'milestone_progress'
        verbose_name = 'Milestone Progress'
        verbose_name_plural = 'Milestone Progress'
        unique_together = ('user', 'milestone')
        ordering = ['user', 'milestone__order_index']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['milestone', 'status']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.milestone.label}: {self.status}"


class UserModuleCompletion(models.Model):
    """
    Tracks which modules a user has completed.
    Links users to modules with completion status and dates.
    """
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='module_completions',
        help_text="The user who completed or is taking the module"
    )
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name='user_completions',
        help_text="The module being tracked"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='not_started',
        help_text="Completion status"
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Date when the module was completed"
    )
    grade = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Final grade (e.g., 1.0, 2.3)"
    )
    semester_taken = models.CharField(
        max_length=50,
        blank=True,
        help_text="Semester when module was taken (e.g., 'WS2023', 'SS2024')"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_module_completions'
        verbose_name = 'User Module Completion'
        verbose_name_plural = 'User Module Completions'
        unique_together = ('user', 'module')
        ordering = ['-completed_at', 'module__module_code']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['module', 'status']),
            models.Index(fields=['completed_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.module.module_code}: {self.status}"


class CareerGoal(models.Model):
    """
    User's career interests and goals that influence roadmap recommendations.
    """
    GOAL_TYPE_CHOICES = [
        ('industry', 'Industry/Company'),
        ('research', 'Research/Academia'),
        ('startup', 'Startup/Entrepreneurship'),
        ('consulting', 'Consulting'),
        ('public_sector', 'Public Sector'),
        ('freelance', 'Freelance'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='career_goals',
        help_text="The user who set this goal"
    )
    goal_type = models.CharField(
        max_length=50,
        choices=GOAL_TYPE_CHOICES,
        help_text="Type of career goal"
    )
    title = models.CharField(
        max_length=200,
        help_text="Brief title/description of the goal"
    )
    description = models.TextField(
        blank=True,
        help_text="Detailed description of the career goal"
    )
    tags = models.JSONField(
        default=list,
        blank=True,
        help_text="Tags/keywords related to this goal (e.g., ['AI', 'Machine Learning'])"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this goal is currently active"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'career_goals'
        verbose_name = 'Career Goal'
        verbose_name_plural = 'Career Goals'
        ordering = ['-is_active', '-created_at']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['goal_type']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class SupportService(models.Model):
    """
    TU support services and resources available to students.
    These are referenced in milestone recommendations and roadmap guidance.
    """
    SERVICE_CATEGORY_CHOICES = [
        ('academic', 'Academic Support'),
        ('career', 'Career Services'),
        ('counseling', 'Counseling'),
        ('administrative', 'Administrative'),
        ('financial', 'Financial Aid'),
        ('health', 'Health Services'),
        ('international', 'International Office'),
        ('other', 'Other'),
    ]

    name = models.CharField(
        max_length=200,
        help_text="Name of the support service"
    )
    category = models.CharField(
        max_length=50,
        choices=SERVICE_CATEGORY_CHOICES,
        help_text="Category of service"
    )
    description = models.TextField(
        help_text="Description of what the service provides"
    )
    contact_info = models.JSONField(
        default=dict,
        blank=True,
        help_text="Contact information (email, phone, office hours)"
    )
    url = models.URLField(
        blank=True,
        help_text="Website URL for the service"
    )
    location = models.CharField(
        max_length=200,
        blank=True,
        help_text="Physical location/building"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this service is currently available"
    )
    related_milestones = models.ManyToManyField(
        MilestoneDefinition,
        blank=True,
        related_name='support_services',
        help_text="Milestones where this service is recommended"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'support_services'
        verbose_name = 'Support Service'
        verbose_name_plural = 'Support Services'
        ordering = ['category', 'name']
        indexes = [
            models.Index(fields=['category', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.category})"


class Notification(models.Model):
    """
    In-app alerts and reminders for users.
    Used for upcoming milestones, missed deadlines, and recommendations.
    """
    NOTIFICATION_TYPE_CHOICES = [
        ('milestone_reminder', 'Milestone Reminder'),
        ('deadline_warning', 'Deadline Warning'),
        ('milestone_achieved', 'Milestone Achieved'),
        ('recommendation', 'Recommendation'),
        ('support_service', 'Support Service Info'),
        ('system', 'System Notification'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text="The user receiving this notification"
    )
    type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPE_CHOICES,
        help_text="Type of notification"
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='medium',
        help_text="Priority level"
    )
    title = models.CharField(
        max_length=200,
        help_text="Notification title"
    )
    message = models.TextField(
        help_text="Notification message content"
    )
    due_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Optional due date/time for deadline-based notifications"
    )
    read_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when the notification was read"
    )
    related_milestone = models.ForeignKey(
        MilestoneDefinition,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
        help_text="Optional related milestone"
    )
    action_url = models.CharField(
        max_length=500,
        blank=True,
        help_text="Optional URL for action button (e.g., '/roadmap', '/support-services')"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'read_at']),
            models.Index(fields=['user', 'type']),
            models.Index(fields=['due_at']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        read_status = "Read" if self.read_at else "Unread"
        return f"{self.user.username} - {self.title} ({read_status})"

    def mark_as_read(self):
        """Mark this notification as read."""
        if not self.read_at:
            self.read_at = timezone.now()
            self.save(update_fields=['read_at'])


class CareerPath(models.Model):
    """
    Represents a career path/job role that students can pursue.
    Contains information about the career and required skills.
    """
    career_id = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique identifier for the career (e.g., 'software_engineer')"
    )
    title_en = models.CharField(
        max_length=200,
        help_text="English title of the career"
    )
    title_de = models.CharField(
        max_length=200,
        help_text="German title of the career"
    )
    description_en = models.TextField(
        blank=True,
        help_text="English description of the career"
    )
    description_de = models.TextField(
        blank=True,
        help_text="German description of the career"
    )
    salary_junior = models.IntegerField(
        null=True,
        blank=True,
        help_text="Average junior salary in EUR"
    )
    salary_mid = models.IntegerField(
        null=True,
        blank=True,
        help_text="Average mid-level salary in EUR"
    )
    salary_senior = models.IntegerField(
        null=True,
        blank=True,
        help_text="Average senior salary in EUR"
    )
    required_skills = models.JSONField(
        default=list,
        blank=True,
        help_text="List of required skills for this career"
    )
    icon = models.CharField(
        max_length=100,
        blank=True,
        help_text="Icon name or emoji for the career"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this career path is currently displayed"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'career_paths'
        verbose_name = 'Career Path'
        verbose_name_plural = 'Career Paths'
        ordering = ['title_en']

    def __str__(self):
        return f"{self.title_en} ({self.career_id})"


class ModuleCareerRelevance(models.Model):
    """
    Maps modules to career paths with relevance scores.
    Used for generating personalized course recommendations.
    """
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name='career_relevances',
        help_text="The module"
    )
    career_path = models.ForeignKey(
        CareerPath,
        on_delete=models.CASCADE,
        related_name='module_relevances',
        help_text="The career path"
    )
    relevance_score = models.IntegerField(
        validators=[MinValueValidator(0)],
        help_text="Relevance score from 0-100 (higher = more relevant)"
    )
    is_core = models.BooleanField(
        default=False,
        help_text="Whether this is a core/essential module for the career"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'module_career_relevance'
        verbose_name = 'Module Career Relevance'
        verbose_name_plural = 'Module Career Relevances'
        unique_together = ('module', 'career_path')
        ordering = ['-relevance_score']
        indexes = [
            models.Index(fields=['career_path', 'relevance_score']),
            models.Index(fields=['module', 'relevance_score']),
        ]

    def __str__(self):
        return f"{self.module.module_code} -> {self.career_path.career_id}: {self.relevance_score}%"


class UserCareerInterest(models.Model):
    """
    Tracks user's interest in specific career paths.
    Used for personalized recommendations.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='career_interests',
        help_text="The user"
    )
    career_path = models.ForeignKey(
        CareerPath,
        on_delete=models.CASCADE,
        related_name='interested_users',
        help_text="The career path of interest"
    )
    interest_level = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0)],
        help_text="Interest level from 0-100"
    )
    is_primary = models.BooleanField(
        default=False,
        help_text="Whether this is the user's primary career interest"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_career_interests'
        verbose_name = 'User Career Interest'
        verbose_name_plural = 'User Career Interests'
        unique_together = ('user', 'career_path')
        ordering = ['-interest_level', '-is_primary']

    def __str__(self):
        return f"{self.user.username} -> {self.career_path.career_id}"