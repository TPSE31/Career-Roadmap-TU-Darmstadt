"""
Management command to import course/module data and career paths from JSON files.

Usage:
    python manage.py import_course_data
    python manage.py import_course_data --clear  # Clear existing modules and career data first
"""
import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import (
    ExaminationRegulation, Module, CareerPath, ModuleCareerRelevance
)


class Command(BaseCommand):
    help = 'Import course/module data and career paths from JSON files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing modules and career data before importing',
        )
        parser.add_argument(
            '--modules-file',
            type=str,
            default=str(Path(__file__).resolve().parent.parent.parent.parent.parent / 'docs' / 'data-model' / 'modules_cleaned.json'),
            help='Path to modules JSON file',
        )
        parser.add_argument(
            '--careers-file',
            type=str,
            default=str(Path(__file__).resolve().parent.parent.parent.parent.parent / 'docs' / 'data-model' / 'career_paths.json'),
            help='Path to career paths JSON file',
        )

    def handle(self, *args, **options):
        modules_file = Path(options['modules_file'])
        careers_file = Path(options['careers_file'])

        self.stdout.write(f"Modules file: {modules_file}")
        self.stdout.write(f"Careers file: {careers_file}")

        if options['clear']:
            self.stdout.write('Clearing existing data...')
            self.clear_data()

        with transaction.atomic():
            # Create or get examination regulation
            regulation = self.get_or_create_regulation()

            # Import career paths
            if careers_file.exists():
                self.stdout.write('Importing career paths...')
                career_paths = self.import_career_paths(careers_file)
                self.stdout.write(self.style.SUCCESS(f'Imported {len(career_paths)} career paths'))
            else:
                self.stdout.write(self.style.WARNING(f'Career paths file not found: {careers_file}'))
                career_paths = {}

            # Import modules
            if modules_file.exists():
                self.stdout.write('Importing modules...')
                modules = self.import_modules(modules_file, regulation, career_paths)
                self.stdout.write(self.style.SUCCESS(f'Imported {len(modules)} modules'))
            else:
                self.stdout.write(self.style.ERROR(f'Modules file not found: {modules_file}'))
                return

        # Print summary
        self.stdout.write(self.style.SUCCESS('\n=== Import Complete ==='))
        self.stdout.write(f'Modules: {Module.objects.count()}')
        self.stdout.write(f'Career Paths: {CareerPath.objects.count()}')
        self.stdout.write(f'Module-Career Mappings: {ModuleCareerRelevance.objects.count()}')

    def clear_data(self):
        """Clear existing modules and career data."""
        ModuleCareerRelevance.objects.all().delete()
        CareerPath.objects.all().delete()
        Module.objects.all().delete()

    def get_or_create_regulation(self):
        """Get or create the B.Sc. Informatik examination regulation."""
        regulation, created = ExaminationRegulation.objects.get_or_create(
            name='B.Sc. Informatik',
            version='2022',
            defaults={
                'program': 'B.Sc. Informatik',
                'total_credits_required': 180,
                'effective_date': '2022-10-01',
                'is_active': True,
                'description': 'Bachelor of Science Informatik - TU Darmstadt - Modulhandbuch 30.09.2022'
            }
        )
        if created:
            self.stdout.write(f'Created examination regulation: {regulation}')
        else:
            self.stdout.write(f'Using existing examination regulation: {regulation}')
        return regulation

    def import_career_paths(self, file_path):
        """Import career paths from JSON file."""
        with open(file_path, 'r', encoding='utf-8') as f:
            careers_data = json.load(f)

        career_paths = {}
        for career in careers_data:
            salary = career.get('average_salary', {})
            career_path, created = CareerPath.objects.update_or_create(
                career_id=career['id'],
                defaults={
                    'title_en': career.get('title_en', ''),
                    'title_de': career.get('title_de', ''),
                    'description_en': career.get('description_en', ''),
                    'description_de': career.get('description_de', ''),
                    'salary_junior': salary.get('junior'),
                    'salary_mid': salary.get('mid'),
                    'salary_senior': salary.get('senior'),
                    'required_skills': career.get('required_skills', []),
                    'is_active': True
                }
            )
            career_paths[career['id']] = career_path
            action = 'Created' if created else 'Updated'
            self.stdout.write(f'  {action}: {career_path.title_en}')

        return career_paths

    def import_modules(self, file_path, regulation, career_paths):
        """Import modules from JSON file."""
        with open(file_path, 'r', encoding='utf-8') as f:
            modules_data = json.load(f)

        modules = []
        relevance_count = 0

        for module_data in modules_data:
            # Use German category directly or map to valid choice
            valid_categories = [
                'Pflichtbereich', 'Wahlpflichtbereich', 'Informatik-Wahlbereich',
                'Studienbegleitende Leistungen', 'Studium Generale', 'Abschlussbereich'
            ]
            category = module_data.get('category', 'Wahlpflichtbereich')
            if category not in valid_categories:
                category = 'Wahlpflichtbereich'

            module, created = Module.objects.update_or_create(
                examination_regulation=regulation,
                module_code=module_data['module_code'],
                defaults={
                    'name': module_data.get('name_de', ''),
                    'name_en': module_data.get('name_en', ''),
                    'credits': module_data.get('credits', 0) or 5,
                    'category': category,
                    'learning_content': module_data.get('learning_content', ''),
                    'learning_objectives': module_data.get('learning_objectives', ''),
                    'prerequisites_text': module_data.get('prerequisites_text', ''),
                    'exam_form': module_data.get('exam_form', ''),
                    'workload_hours': module_data.get('workload_hours'),
                    'self_study_hours': module_data.get('self_study_hours'),
                    'duration_semesters': module_data.get('duration_semesters', 1),
                    'language': module_data.get('language', 'Deutsch'),
                    'offering_frequency': module_data.get('offering_frequency', ''),
                }
            )
            modules.append(module)

            # Create career relevance mappings
            career_relevance = module_data.get('career_relevance', {})
            for career_id, score in career_relevance.items():
                if career_id in career_paths and score > 0:
                    ModuleCareerRelevance.objects.update_or_create(
                        module=module,
                        career_path=career_paths[career_id],
                        defaults={
                            'relevance_score': score,
                            'is_core': score >= 50
                        }
                    )
                    relevance_count += 1

        self.stdout.write(f'  Created {relevance_count} module-career relevance mappings')
        return modules
