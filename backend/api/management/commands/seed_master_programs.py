"""
Management command to populate TU Darmstadt Department of Computer Science
Master's programs into the database.

Usage:
    python manage.py seed_master_programs
"""
from django.core.management.base import BaseCommand
from api.models import MasterProgram


MASTER_PROGRAMS = [
    {
        'name': 'M.Sc. Informatik',
        'language_of_instruction': 'German',
        'specializations': [],
        'url': 'https://www.informatik.tu-darmstadt.de/studium_fb20/im_studium/studiengaenge_liste/informatik_msc.de.jsp',
        'description_en': (
            'The M.Sc. Informatik is a research-oriented master\'s program taught in German. '
            'It deepens theoretical and applied computer science knowledge and prepares graduates '
            'for demanding roles in industry and academia.'
        ),
        'description_de': (
            'Der M.Sc. Informatik ist ein forschungsorientierter Masterstudiengang, der auf Deutsch gelehrt wird. '
            'Er vertieft theoretisches und angewandtes Informatikwissen und bereitet Absolventen auf '
            'anspruchsvolle Tätigkeiten in Industrie und Wissenschaft vor.'
        ),
        'order_index': 1,
    },
    {
        'name': 'M.Sc. Computer Science',
        'language_of_instruction': 'English',
        'specializations': [
            'Data Science & Engineering',
            'Visual Computing',
            'Complex Networked Systems',
        ],
        'url': 'https://www.informatik.tu-darmstadt.de/studium_fb20/im_studium/studiengaenge_liste/computer_science_msc.de.jsp',
        'description_en': (
            'An internationally oriented master\'s program taught entirely in English. Students specialise in '
            'one of three tracks: Data Science & Engineering, Visual Computing, or Complex Networked Systems.'
        ),
        'description_de': (
            'Ein international ausgerichteter Masterstudiengang, der vollständig auf Englisch gelehrt wird. '
            'Studierende spezialisieren sich in einem von drei Schwerpunkten: Data Science & Engineering, '
            'Visual Computing oder Complex Networked Systems.'
        ),
        'order_index': 2,
    },
    {
        'name': 'M.Sc. Autonome Systeme und Robotik',
        'language_of_instruction': 'German',
        'specializations': [],
        'url': 'https://www.informatik.tu-darmstadt.de/studium_fb20/im_studium/studiengaenge_liste/asur_msc.de.jsp',
        'description_en': (
            'A German-language master\'s program focusing on autonomous systems, robotics, machine perception, '
            'and intelligent control. Ideal for students interested in robotics and automation.'
        ),
        'description_de': (
            'Ein deutschsprachiger Masterstudiengang mit Schwerpunkt auf autonomen Systemen, Robotik, '
            'Maschinenwahrnehmung und intelligentem Steuern. Ideal für Studierende, die sich für '
            'Robotik und Automatisierung interessieren.'
        ),
        'order_index': 3,
    },
    {
        'name': 'M.Sc. Artificial Intelligence and Machine Learning',
        'language_of_instruction': 'English',
        'specializations': [],
        'url': 'https://www.informatik.tu-darmstadt.de/studium_fb20/im_studium/studiengaenge_liste/aim_msc.de.jsp',
        'description_en': (
            'An English-language master\'s program covering modern AI techniques, deep learning, '
            'probabilistic modelling, and machine learning systems. Prepares graduates for careers '
            'in AI research and applied AI engineering.'
        ),
        'description_de': (
            'Ein englischsprachiger Masterstudiengang, der moderne KI-Techniken, Deep Learning, '
            'probabilistische Modellierung und maschinelle Lernsysteme abdeckt. Bereitet Absolventen '
            'auf Karrieren in der KI-Forschung und im angewandten KI-Engineering vor.'
        ),
        'order_index': 4,
    },
    {
        'name': 'M.Sc. IT Security',
        'language_of_instruction': 'English',
        'specializations': [],
        'url': 'https://www.informatik.tu-darmstadt.de/studium_fb20/im_studium/studiengaenge_liste/itsecurity_msc.de.jsp',
        'description_en': (
            'An English-language master\'s program specialising in cybersecurity, cryptography, '
            'secure software engineering, and network security. TU Darmstadt is one of Germany\'s '
            'leading institutions for IT security research.'
        ),
        'description_de': (
            'Ein englischsprachiger Masterstudiengang mit Schwerpunkt auf Cybersicherheit, Kryptographie, '
            'sicherem Software-Engineering und Netzwerksicherheit. Die TU Darmstadt ist eine der führenden '
            'deutschen Institutionen für IT-Sicherheitsforschung.'
        ),
        'order_index': 5,
    },
]


class Command(BaseCommand):
    help = 'Seed TU Darmstadt CS Department Master\'s programs into the database'

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for program_data in MASTER_PROGRAMS:
            obj, created = MasterProgram.objects.update_or_create(
                name=program_data['name'],
                defaults=program_data,
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'  Created: {obj.name}'))
            else:
                updated_count += 1
                self.stdout.write(f'  Updated: {obj.name}')

        self.stdout.write(
            self.style.SUCCESS(
                f'\nDone! {created_count} created, {updated_count} updated. '
                f'Total: {MasterProgram.objects.count()} master programs.'
            )
        )
