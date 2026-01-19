"""
Management command to seed the database with sample data for testing.

Usage:
    python manage.py seed_data
    python manage.py seed_data --clear  # Clear existing data first
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from api.models import (
    User, ExaminationRegulation, Module, MilestoneDefinition,
    MilestoneProgress, UserModuleCompletion, CareerGoal,
    SupportService, Notification
)


class Command(BaseCommand):
    help = 'Seeds the database with sample data for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            self.clear_data()

        self.stdout.write('Seeding database with sample data...')

        # Create examination regulations
        self.stdout.write('Creating examination regulations...')
        reg_cs_2020 = self.create_examination_regulations()

        # Create modules
        self.stdout.write('Creating modules...')
        modules = self.create_modules(reg_cs_2020)

        # Create milestone definitions
        self.stdout.write('Creating milestone definitions...')
        milestones = self.create_milestones(reg_cs_2020)

        # Create support services
        self.stdout.write('Creating support services...')
        services = self.create_support_services(milestones)

        # Create test users
        self.stdout.write('Creating test users...')
        users = self.create_users(reg_cs_2020)

        # Create user module completions
        self.stdout.write('Creating user module completions...')
        self.create_user_module_completions(users, modules)

        # Create milestone progress
        self.stdout.write('Creating milestone progress...')
        self.create_milestone_progress(users, milestones)

        # Create career goals
        self.stdout.write('Creating career goals...')
        self.create_career_goals(users)

        # Create notifications
        self.stdout.write('Creating notifications...')
        self.create_notifications(users, milestones)

        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))
        self.stdout.write(f'Created:')
        self.stdout.write(f'  - {ExaminationRegulation.objects.count()} examination regulations')
        self.stdout.write(f'  - {Module.objects.count()} modules')
        self.stdout.write(f'  - {MilestoneDefinition.objects.count()} milestone definitions')
        self.stdout.write(f'  - {SupportService.objects.count()} support services')
        self.stdout.write(f'  - {User.objects.count()} users')
        self.stdout.write(f'  - {UserModuleCompletion.objects.count()} module completions')
        self.stdout.write(f'  - {MilestoneProgress.objects.count()} milestone progress records')
        self.stdout.write(f'  - {CareerGoal.objects.count()} career goals')
        self.stdout.write(f'  - {Notification.objects.count()} notifications')

    def clear_data(self):
        """Clear all existing data from the database."""
        Notification.objects.all().delete()
        CareerGoal.objects.all().delete()
        MilestoneProgress.objects.all().delete()
        UserModuleCompletion.objects.all().delete()
        SupportService.objects.all().delete()
        MilestoneDefinition.objects.all().delete()
        Module.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()  # Keep superusers
        ExaminationRegulation.objects.all().delete()

    def create_examination_regulations(self):
        """Create sample examination regulations."""
        reg_cs_2020 = ExaminationRegulation.objects.create(
            name='Computer Science B.Sc.',
            version='2020',
            program='Computer Science B.Sc.',
            total_credits_required=180,
            effective_date=datetime(2020, 10, 1).date(),
            is_active=True,
            description='Bachelor of Science in Computer Science, version 2020'
        )

        ExaminationRegulation.objects.create(
            name='Informatik B.Sc.',
            version='2023',
            program='Informatik B.Sc.',
            total_credits_required=180,
            effective_date=datetime(2023, 10, 1).date(),
            is_active=True,
            description='Bachelor-Studiengang Informatik, Prüfungsordnung 2023'
        )

        return reg_cs_2020

    def create_modules(self, regulation):
        """Create sample modules."""
        modules_data = [
            # Foundation modules (Semester 1-2)
            ('CS101', 'Introduction to Programming', 6, 'mandatory', 'Foundations'),
            ('CS102', 'Mathematics for CS I', 9, 'mandatory', 'Foundations'),
            ('CS103', 'Computer Systems', 6, 'mandatory', 'Foundations'),
            ('CS104', 'Discrete Mathematics', 6, 'mandatory', 'Foundations'),
            ('CS105', 'Mathematics for CS II', 9, 'mandatory', 'Foundations'),
            ('CS106', 'Data Structures and Algorithms', 9, 'mandatory', 'Foundations'),

            # Core modules (Semester 3-4)
            ('CS201', 'Software Engineering', 6, 'mandatory', 'Core'),
            ('CS202', 'Databases', 6, 'mandatory', 'Core'),
            ('CS203', 'Operating Systems', 6, 'mandatory', 'Core'),
            ('CS204', 'Computer Networks', 6, 'mandatory', 'Core'),
            ('CS205', 'Theoretical Computer Science', 6, 'mandatory', 'Core'),
            ('CS206', 'Algorithm Engineering', 6, 'mandatory', 'Core'),

            # Advanced modules (Semester 5-6)
            ('CS301', 'Machine Learning', 6, 'elective', 'Advanced'),
            ('CS302', 'Computer Graphics', 6, 'elective', 'Advanced'),
            ('CS303', 'Distributed Systems', 6, 'elective', 'Advanced'),
            ('CS304', 'IT Security', 6, 'elective', 'Advanced'),
            ('CS305', 'Web Engineering', 6, 'elective', 'Advanced'),

            # Specialization
            ('CS401', 'Advanced AI', 6, 'specialization', 'Specialization'),
            ('CS402', 'Big Data Analytics', 6, 'specialization', 'Specialization'),

            # Thesis
            ('CS999', 'Bachelor Thesis', 12, 'thesis', 'Thesis'),
        ]

        modules = []
        for code, name, credits, category, group in modules_data:
            module = Module.objects.create(
                examination_regulation=regulation,
                module_code=code,
                name=name,
                credits=credits,
                category=category,
                group_name=group,
                description=f'Course description for {name}'
            )
            modules.append(module)

        # Add some prerequisites
        if len(modules) >= 6:
            modules[5].prerequisites.add(modules[0])  # Data Structures requires Intro Programming
            modules[6].prerequisites.add(modules[5])  # Software Engineering requires Data Structures

        return modules

    def create_milestones(self, regulation):
        """Create sample milestone definitions."""
        milestones_data = [
            # Onboarding
            (0, 'onboarding', 'Account Created', 'Successfully registered for the Career Roadmap system', {}, 1, None),
            (1, 'onboarding', 'Regulation Selected', 'Selected examination regulation and program', {}, 1, None),
            (2, 'onboarding', 'Roadmap Generated', 'Initial study plan and roadmap created', {}, 1, None),

            # Progress checkpoints
            (3, 'cp_threshold', '30 CP Completed', 'Completed at least 30 credit points', {'cp_required': 30}, 2, None),
            (4, 'module_group', 'Foundations Complete', 'Completed all foundation modules', {'group': 'Foundations'}, 2, None),
            (5, 'cp_threshold', '60 CP Completed', 'Completed at least 60 credit points', {'cp_required': 60}, 3, None),
            (6, 'module_group', 'Core Modules Complete', 'Completed all core modules', {'group': 'Core'}, 4, None),
            (7, 'cp_threshold', '90 CP Completed', 'Completed at least 90 credit points', {'cp_required': 90}, 4, None),
            (8, 'cp_threshold', '120 CP Completed', 'Completed at least 120 credit points', {'cp_required': 120}, 5, None),

            # Career and advanced
            (9, 'career_goal', 'Career Goal Set', 'Defined career goals and specialization interests', {}, 3, None),
            (10, 'module_group', 'Electives Complete', 'Completed elective modules', {'group': 'Advanced'}, 5, None),

            # Thesis and completion
            (11, 'thesis', 'Thesis Ready', 'Ready to begin bachelor thesis', {'min_cp': 150}, 6, None),
            (12, 'thesis', 'Thesis Submitted', 'Bachelor thesis submitted', {}, 6, None),
            (13, 'completion', 'Degree Complete', 'All requirements fulfilled - ready to graduate!', {'cp_required': 180}, 6, None),
        ]

        milestones = []
        for order, m_type, label, desc, rules, sem, date in milestones_data:
            milestone = MilestoneDefinition.objects.create(
                examination_regulation=regulation,
                order_index=order,
                type=m_type,
                label=label,
                description=desc,
                rule_payload=rules,
                expected_by_semester=sem,
                expected_by_date=date
            )
            milestones.append(milestone)

        return milestones

    def create_support_services(self, milestones):
        """Create sample support services."""
        services_data = [
            ('Study Coordination Office', 'administrative', 'Help with registration, examination regulations, and administrative questions',
             {'email': 'study-office@cs.tu-darmstadt.de', 'phone': '+49 6151 16-25000'}, 'https://www.tu-darmstadt.de', 'Building S2|02'),

            ('Career Service', 'career', 'Career counseling, internship placement, and job market preparation',
             {'email': 'career@tu-darmstadt.de'}, 'https://www.tu-darmstadt.de/career', 'Building S1|03'),

            ('Psychological Counseling', 'counseling', 'Support for study-related stress and personal challenges',
             {'email': 'psych@tu-darmstadt.de', 'hours': 'Mon-Fri 9:00-16:00'}, 'https://www.tu-darmstadt.de/psych', 'Building S1|01'),

            ('Academic Writing Center', 'academic', 'Support with academic writing, thesis preparation, and research methods',
             {'email': 'writing@tu-darmstadt.de'}, 'https://www.tu-darmstadt.de/writing', 'ULB Building'),

            ('International Office', 'international', 'Support for international students and study abroad programs',
             {'email': 'international@tu-darmstadt.de'}, 'https://www.tu-darmstadt.de/international', 'Building S1|01'),

            ('Financial Aid Office', 'financial', 'Information about scholarships, BAföG, and financial support',
             {'email': 'finanzielle-beratung@tu-darmstadt.de'}, 'https://www.tu-darmstadt.de/finance', 'Building S1|01'),
        ]

        services = []
        for name, category, desc, contact, url, location in services_data:
            service = SupportService.objects.create(
                name=name,
                category=category,
                description=desc,
                contact_info=contact,
                url=url,
                location=location,
                is_active=True
            )
            services.append(service)

        # Link services to relevant milestones
        if len(milestones) > 0 and len(services) > 0:
            services[0].related_milestones.add(milestones[0], milestones[1])  # Admin office for onboarding
            services[1].related_milestones.add(milestones[9])  # Career service for career goals
            services[3].related_milestones.add(milestones[11], milestones[12])  # Writing center for thesis

        return services

    def create_users(self, regulation):
        """Create sample test users."""
        users = []

        # Student 1: High achiever
        user1 = User.objects.create_user(
            username='stas_mustermann',
            email='stas.mustermann@stud.tu-darmstadt.de',
            password='testpass123',
            first_name='Stas',
            last_name='Mustermann',
            program='Computer Science B.Sc.',
            semester=4,
            matriculation_number='1234567',
            examination_regulation=regulation
        )
        users.append(user1)

        # Student 2: Mid-progress student
        user2 = User.objects.create_user(
            username='maria_schmidt',
            email='maria.schmidt@stud.tu-darmstadt.de',
            password='testpass123',
            first_name='Maria',
            last_name='Schmidt',
            program='Computer Science B.Sc.',
            semester=2,
            matriculation_number='2345678',
            examination_regulation=regulation
        )
        users.append(user2)

        # Student 3: New student
        user3 = User.objects.create_user(
            username='john_doe',
            email='john.doe@stud.tu-darmstadt.de',
            password='testpass123',
            first_name='John',
            last_name='Doe',
            program='Computer Science B.Sc.',
            semester=1,
            matriculation_number='3456789',
            examination_regulation=regulation
        )
        users.append(user3)

        return users

    def create_user_module_completions(self, users, modules):
        """Create sample module completions for users."""
        if len(users) == 0 or len(modules) == 0:
            return

        # User 1 (Stas) - completed foundation and core modules
        for i in range(12):  # First 12 modules
            if i < len(modules):
                UserModuleCompletion.objects.create(
                    user=users[0],
                    module=modules[i],
                    status='completed',
                    completed_at=timezone.now() - timedelta(days=30 * (12 - i)),
                    grade=round(1.0 + (i % 3) * 0.3, 1),
                    semester_taken=f'WS{2022 + i // 6}' if i % 2 == 0 else f'SS{2023 + i // 6}'
                )

        # User 2 (Maria) - completed foundation modules
        for i in range(6):  # First 6 modules
            if i < len(modules):
                UserModuleCompletion.objects.create(
                    user=users[1],
                    module=modules[i],
                    status='completed',
                    completed_at=timezone.now() - timedelta(days=20 * (6 - i)),
                    grade=round(1.5 + (i % 4) * 0.3, 1),
                    semester_taken=f'WS2023' if i % 2 == 0 else 'SS2024'
                )

        # User 3 (John) - just started
        for i in range(2):
            if i < len(modules):
                UserModuleCompletion.objects.create(
                    user=users[2],
                    module=modules[i],
                    status='in_progress',
                    semester_taken='WS2024'
                )

    def create_milestone_progress(self, users, milestones):
        """Create sample milestone progress for users."""
        if len(users) == 0 or len(milestones) == 0:
            return

        # User 1 (Stas) - advanced progress
        for i, milestone in enumerate(milestones):
            if i <= 7:  # Completed first 8 milestones
                MilestoneProgress.objects.create(
                    user=users[0],
                    milestone=milestone,
                    status='completed',
                    achieved_at=timezone.now() - timedelta(days=15 * (8 - i)),
                    computed_explanation=f'Milestone completed successfully'
                )
            elif i <= 9:  # Next 2 available
                MilestoneProgress.objects.create(
                    user=users[0],
                    milestone=milestone,
                    status='available',
                    computed_explanation=f'Ready to work on this milestone'
                )
            else:  # Rest locked
                MilestoneProgress.objects.create(
                    user=users[0],
                    milestone=milestone,
                    status='locked',
                    computed_explanation=f'Complete previous milestones first'
                )

        # User 2 (Maria) - mid progress
        for i, milestone in enumerate(milestones):
            if i <= 3:
                MilestoneProgress.objects.create(
                    user=users[1],
                    milestone=milestone,
                    status='completed',
                    achieved_at=timezone.now() - timedelta(days=10 * (4 - i))
                )
            elif i <= 5:
                MilestoneProgress.objects.create(
                    user=users[1],
                    milestone=milestone,
                    status='available'
                )
            else:
                MilestoneProgress.objects.create(
                    user=users[1],
                    milestone=milestone,
                    status='locked'
                )

        # User 3 (John) - just started
        for i, milestone in enumerate(milestones):
            if i == 0:
                MilestoneProgress.objects.create(
                    user=users[2],
                    milestone=milestone,
                    status='completed',
                    achieved_at=timezone.now() - timedelta(days=2)
                )
            elif i <= 2:
                MilestoneProgress.objects.create(
                    user=users[2],
                    milestone=milestone,
                    status='available'
                )
            else:
                MilestoneProgress.objects.create(
                    user=users[2],
                    milestone=milestone,
                    status='locked'
                )

    def create_career_goals(self, users):
        """Create sample career goals."""
        if len(users) == 0:
            return

        CareerGoal.objects.create(
            user=users[0],
            goal_type='research',
            title='Research in Machine Learning',
            description='Interested in pursuing a PhD in machine learning and AI',
            tags=['AI', 'Machine Learning', 'Research', 'PhD'],
            is_active=True
        )

        CareerGoal.objects.create(
            user=users[1],
            goal_type='industry',
            title='Software Engineering at Tech Company',
            description='Want to work as a software engineer at a major tech company',
            tags=['Software Engineering', 'Backend', 'Python', 'Industry'],
            is_active=True
        )

        CareerGoal.objects.create(
            user=users[2],
            goal_type='industry',
            title='Web Development',
            description='Interested in full-stack web development',
            tags=['Web Development', 'Frontend', 'Backend', 'JavaScript'],
            is_active=True
        )

    def create_notifications(self, users, milestones):
        """Create sample notifications."""
        if len(users) == 0:
            return

        # Milestone reminders
        Notification.objects.create(
            user=users[0],
            type='milestone_reminder',
            priority='medium',
            title='Career Goal Milestone Available',
            message='You can now set your career goals to get personalized recommendations!',
            related_milestone=milestones[9] if len(milestones) > 9 else None,
            action_url='/roadmap'
        )

        # Recommendation
        Notification.objects.create(
            user=users[1],
            type='recommendation',
            priority='low',
            title='Consider Setting Career Goals',
            message='Setting career goals will help us recommend relevant modules and support services.',
            action_url='/career-goals'
        )

        # Deadline warning
        Notification.objects.create(
            user=users[0],
            type='deadline_warning',
            priority='high',
            title='Module Registration Deadline',
            message='Remember to register for next semester modules by the end of this month.',
            due_at=timezone.now() + timedelta(days=10)
        )

        # Milestone achieved
        Notification.objects.create(
            user=users[1],
            type='milestone_achieved',
            priority='medium',
            title='Milestone Completed!',
            message='Congratulations! You completed the "30 CP Completed" milestone.',
            related_milestone=milestones[3] if len(milestones) > 3 else None,
            read_at=timezone.now() - timedelta(days=1)
        )
