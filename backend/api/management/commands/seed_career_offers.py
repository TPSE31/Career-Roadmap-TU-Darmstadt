from django.core.management.base import BaseCommand
from api.models import CareerOffer


class Command(BaseCommand):
    help = 'Seeds the 13 yellow-highlighted career offers from Infomappe'

    def handle(self, *args, **options):
        # Clear existing
        CareerOffer.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing career offers'))

        offers_data = [
            # Category: Berufseinstieg (7 offers)
            {
                'title_de': 'Das Future Engineering Career Programme (FEC) & International Career Counter',
                'title_en': 'The Future Engineering Career Programme (FEC) & International Career Counter',
                'provider': 'TU Darmstadt: Dezernat Internationales',
                'category': 'berufseinstieg',
                'description_de': 'Das Future Engineering Career Programme (FEC) der TU Darmstadt unterstützt dich als internationale Studierende während deines gesamten Studiums und hilft dir beim Einstieg in den deutschen Arbeitsmarkt. International Career Counter Öffnungszeiten: jeden Mittwoch von 14:00 bis 16:00 Uhr am Counter Internationales im karo 5 (S1|01, Campus Stadtmitte).',
                'description_en': 'The Future Engineering Career Programme (FEC) of TU Darmstadt supports you as an international student throughout your studies and helps you to enter the German job market. International Career Counter opening hours: every Wednesday from 2:00 p.m. to 4:00 p.m. at the International Counter in karo 5 (S1|01, Stadtmitte Campus).',
                'relevance_reason_de': 'Umfassende Karriereberatung für alle Berufswege, speziell für internationale Studierende',
                'relevance_reason_en': 'Comprehensive career counseling for all career paths, specifically for international students',
                'links': ['https://www.tu-darmstadt.de/fec'],
                'contact_emails': ['fec@tu-darmstadt.de'],
                'career_fields': ['industry', 'research', 'consulting', 'public_sector', 'startup'],
                'priority': 10,
            },
            {
                'title_de': 'Bundesagentur für Arbeit: Agentur für Arbeit Darmstadt',
                'title_en': 'Federal Employment Agency: Darmstadt Employment Agency',
                'provider': 'Hochschulteam Darmstadt: Bundesagentur für Arbeit',
                'category': 'berufseinstieg',
                'description_de': 'Karriereberatung, jeden dritten Mittwoch im Monat am International Career Counter des Future Engineering Career Programmes, u.a. zur individuellen Strategie einer arbeitsmarktnahen Studiengestaltung.',
                'description_en': 'Career consultation, every third Wednesday at the International Career Counter of the Future Engineering Career Programme; individual strategy for labor market-oriented study design.',
                'relevance_reason_de': 'Professionelle Karriereberatung mit Fokus auf den deutschen Arbeitsmarkt',
                'relevance_reason_en': 'Professional career counseling focused on the German job market',
                'links': ['https://www.arbeitsagentur.de/vor-ort/darmstadt/berufsberatung/hochschulteam'],
                'contact_emails': ['Darmstadt.Hochschulteam@arbeitsagentur.de'],
                'career_fields': ['industry', 'public_sector', 'freelance', 'other'],
                'priority': 9,
            },
            {
                'title_de': 'SchreibCenter – Bewerbungen schreiben',
                'title_en': 'Writing Center – Writing Applications',
                'provider': 'TU Darmstadt: Schreibzentrum',
                'category': 'berufseinstieg',
                'description_de': 'Informationen, Tipps und Hilfen zum Schreiben deiner Bewerbung; Online Writing Lab: Bewerbungen schreiben',
                'description_en': 'Information, tips and help for writing your application; Online Writing Lab: Application',
                'relevance_reason_de': 'Bewerbungsschreiben ist essentiell für den Berufseinstieg in allen Bereichen',
                'relevance_reason_en': 'Application writing is essential for career entry in all fields',
                'links': [],
                'contact_emails': ['schreibcenter@spz.tu-darmstadt.de'],
                'career_fields': ['industry', 'consulting', 'public_sector', 'startup', 'freelance', 'research'],
                'priority': 8,
            },
            {
                'title_de': 'Stellenwerk - Jobbörse für Studenten',
                'title_en': 'Stellenwerk - Job Board for Students',
                'provider': 'Universität Hamburg Marketing GmbH',
                'category': 'berufseinstieg',
                'description_de': 'Ob Hiwi-Jobs, Praktika oder Werkstudententätigkeiten – hier findest du alle Angebote und Informationen.',
                'description_en': 'Whether you\'re looking for student assistant jobs, internships or working student positions – you\'ll find all the offers and information here.',
                'relevance_reason_de': 'Jobbörse speziell für Studierende mit Praktika und Werkstudentenstellen',
                'relevance_reason_en': 'Job board specifically for students with internships and working student positions',
                'links': ['https://www.stellenwerk.de/'],
                'contact_emails': ['info@stellenwerk.de'],
                'career_fields': ['industry', 'startup', 'consulting'],
                'priority': 7,
            },
            {
                'title_de': 'Konaktiva – Unternehmenskontaktmesse',
                'title_en': 'Konaktiva – Company Contact Fair',
                'provider': 'konaktiva Darmstadt GbR',
                'category': 'berufseinstieg',
                'description_de': 'Die Konaktiva bietet dir die Chance, Arbeitgeber*innen kennenzulernen und dich um ein Praktikum, eine Abschlussarbeit sowie für den Berufseinstieg zu bewerben.',
                'description_en': 'Konaktiva offers you the chance to get to know employers and to apply for an internship, a thesis, or for your first job.',
                'relevance_reason_de': 'Direkter Kontakt zu Unternehmen für Praktika und Berufseinstieg',
                'relevance_reason_en': 'Direct contact with companies for internships and career entry',
                'links': [],
                'contact_emails': ['konaktiva@tu-darmstadt.de'],
                'career_fields': ['industry', 'consulting', 'startup'],
                'priority': 6,
            },
            {
                'title_de': 'International Career Service Rhein-Main (ICS RM)',
                'title_en': 'International Career Service Rhine-Main (ICS RM)',
                'provider': 'TU Darmstadt',
                'category': 'berufseinstieg',
                'description_de': 'Du brauchst Tipps für den Berufseinstieg? Der International Career Service Rhein-Main (ICS RM) unterstützt dich dabei, die Jobchancen in der Rhein-Main-Region zu nutzen und Ihre Traumkarriere zu starten.',
                'description_en': 'Do you need tips for starting your career? The International Career Service Rhein-Main (ICS RM) supports you in taking advantage of job opportunities in the Rhine-Main region and launching your dream career.',
                'relevance_reason_de': 'Regionale Karriereunterstützung für internationale Studierende',
                'relevance_reason_en': 'Regional career support for international students',
                'links': ['https://ics-rm.de/'],
                'contact_emails': [],
                'career_fields': ['industry', 'research', 'consulting', 'startup'],
                'priority': 5,
            },
            {
                'title_de': 'Übersicht Career Services TU Darmstadt',
                'title_en': 'Overview of Career Services TU Darmstadt',
                'provider': 'TU Darmstadt',
                'category': 'berufseinstieg',
                'description_de': 'Speziell zugeschnittenen Career Services unterstützen wir bei der beruflichen Entwicklung, beim Aufbau von Netzwerken sowie beim Einstieg in die Berufswelt.',
                'description_en': 'Tailored career services and support for professional development, building networks and entering the professional world for international students.',
                'relevance_reason_de': 'Gesamtübersicht aller Karriereservices für alle Berufswege',
                'relevance_reason_en': 'Comprehensive overview of all career services for all career paths',
                'links': [],
                'contact_emails': [],
                'career_fields': ['industry', 'research', 'consulting', 'public_sector', 'startup', 'freelance', 'other'],
                'priority': 4,
            },
            # Category: Studienerfolg (2 offers)
            {
                'title_de': 'TU4YOU-Skills Portal',
                'title_en': 'TU4YOU-Skills Portal',
                'provider': 'TU Darmstadt: HDA',
                'category': 'studienerfolg',
                'description_de': 'Hier findest du vielfältige Kurse für Studium und Beruf.',
                'description_en': 'Here you will find a wide range of courses for your studies and career.',
                'relevance_reason_de': 'Kompetenzentwicklung unterstützt alle Karriereziele',
                'relevance_reason_en': 'Skill development supports all career goals',
                'links': [],
                'contact_emails': ['tu4you@tu-darmstadt.de'],
                'career_fields': ['industry', 'research', 'consulting', 'public_sector', 'startup', 'freelance', 'other'],
                'priority': 3,
            },
            {
                'title_de': 'Selbstlernkurs: Studiertechniken',
                'title_en': 'Self-Study Course: Study Techniques',
                'provider': 'TU Darmstadt: HDA',
                'category': 'studienerfolg',
                'description_de': 'In diesem Moodle-Kurs findest du viele Hilfestellungen, Materialien und Methoden, damit du noch erfolgreicher durchs Studium kommst.',
                'description_en': 'In this Moodle course you will find plenty of help, materials and methods to help you be even more successful in your studies.',
                'relevance_reason_de': 'Studienerfolg ist die Grundlage für jede Karriere',
                'relevance_reason_en': 'Academic success is the foundation for any career',
                'links': [],
                'contact_emails': ['info@hda.tu-darmstadt.de'],
                'career_fields': ['industry', 'research', 'consulting', 'public_sector', 'startup', 'freelance', 'other'],
                'priority': 2,
            },
            # Category: Integration (4 offers)
            {
                'title_de': 'International Student Services (ISS)',
                'title_en': 'International Student Services (ISS)',
                'provider': 'TU Darmstadt: Dezernat Internationales',
                'category': 'integration',
                'description_de': 'International Student Services (ISS), ist die zentrale Anlaufstelle für internationale Studierende. ISS richtet sich speziell an internationale Studierende, Austauschstudierende und Studieninteressierte; u.a. zu Visa- und Aufenthaltsangelegenheiten.',
                'description_en': 'International Student Services (ISS), is a central contact point for all international students, exchange students, and prospective students; e.g. visa & residence permit matters',
                'relevance_reason_de': 'Unterstützung für internationale Studierende bei rechtlichen Fragen, die alle Karrierewege betreffen',
                'relevance_reason_en': 'Support for international students on legal matters affecting all career paths',
                'links': ['https://www.tu-darmstadt.de/iss'],
                'contact_emails': ['iss@zv.tu-darmstadt.de'],
                'career_fields': ['industry', 'research', 'consulting', 'public_sector', 'startup', 'freelance', 'other'],
                'priority': 1,
            },
            {
                'title_de': 'TUtor International',
                'title_en': 'TUtor International',
                'provider': 'TU Darmstadt: Dezernat Internationales',
                'category': 'integration',
                'description_de': 'TUtor International fördert die soziale, fachliche und kulturelle Integration internationaler Studierende. Das Projekt hilft dir, dich schnell an der TU Darmstadt zurechtzufinden und am Campusleben teilzunehmen.',
                'description_en': 'TUtor International promotes the social, academic, and cultural integration of international students. The project helps them quickly find their way around TU Darmstadt and participate in campus life.',
                'relevance_reason_de': 'Soziale und kulturelle Integration erleichtert den Karriereeinstieg',
                'relevance_reason_en': 'Social and cultural integration facilitates career entry',
                'links': ['https://tutor-international.de/de/'],
                'contact_emails': ['info@tutor-international.de'],
                'career_fields': ['industry', 'research', 'consulting', 'public_sector', 'startup', 'freelance', 'other'],
                'priority': 0,
            },
            {
                'title_de': 'Sprachenzentrum',
                'title_en': 'Language Center',
                'provider': 'TU Darmstadt: SPZ',
                'category': 'integration',
                'description_de': 'Das Sprachenzentrum der TU Darmstadt bietet als zentrale Einrichtung nicht nur vielfältige Sprachkurse, sondern auch zusätzliche Services für alle Studierenden und Beschäftigten der Universität.',
                'description_en': 'The language center of TU Darmstadt, as a central institution, offers not only diverse language courses but also additional services for all students and employees of the university.',
                'relevance_reason_de': 'Sprachkenntnisse sind wichtig für die meisten Karrierewege',
                'relevance_reason_en': 'Language skills are important for most career paths',
                'links': ['https://www.spz.tu-darmstadt.de/'],
                'contact_emails': [],
                'career_fields': ['industry', 'research', 'consulting', 'public_sector', 'startup', 'freelance'],
                'priority': 0,
            },
            {
                'title_de': 'Sprachencafé (ZIKK)',
                'title_en': 'Language Café (ZIKK)',
                'provider': 'TU Darmstadt: ZIKK',
                'category': 'integration',
                'description_de': 'Das Sprachencafé ist ein Treffpunkt, an dem Menschen unterschiedlicher Nationalitäten zusammenkommen, um Sprachen zu üben und kulturelle Erfahrungen auszutauschen.',
                'description_en': 'The language café is a meeting place where people of different nationalities come together to practice languages and exchange cultural experiences.',
                'relevance_reason_de': 'Sprachpraxis und interkulturelle Kompetenz sind wertvoll für die Karriere',
                'relevance_reason_en': 'Language practice and intercultural competence are valuable for career',
                'links': ['https://www.interkulturelle-kompetenz.tu-darmstadt.de/spz_zikk/sprachencafe/index.de.jsp'],
                'contact_emails': [],
                'career_fields': ['industry', 'research', 'consulting', 'public_sector', 'startup', 'freelance'],
                'priority': 0,
            },
        ]

        created_count = 0
        for offer_dict in offers_data:
            CareerOffer.objects.create(**offer_dict)
            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(f'[OK] Created: {offer_dict["title_de"][:50]}...')
            )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully seeded {created_count} career offers!')
        )
        self.stdout.write(
            self.style.WARNING(f'Source: PM-approved (yellow-highlighted from Infomappe.pdf)')
        )
