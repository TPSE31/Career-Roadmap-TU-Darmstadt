# Career Roadmap - Team Task Assignment
**Project:** TU Darmstadt Career Roadmap Tool - Gruppe 31
**Date:** 23. Januar 2026
**Status:** Frontend fertig, Backend-Erweiterungen benötigt

---

## Aktueller Stand

### Was funktioniert:
- Login/Registrierung mit E-Mail
- Dashboard
- Modulübersicht
- Meilensteine
- Benachrichtigungen
- Support-Services
- Empfehlungen (Basis-Version)
- Profilseite

### Was fehlt:
- Deutsche Übersetzungen für Kursdaten
- Vollständige Kursliste (Informatik B.Sc.)
- Karriereziele/Jobs Datenbank
- Verknüpfung Jobs ↔ Kurse für intelligente Empfehlungen

---

## Aufgabenverteilung

---

## STAS - Data Modeling & Database Schema

### Aufgabe 1: Kurse erweitern
Füge deutsche Übersetzungen zu den Modellen hinzu:

```python
# In models.py - Module Model erweitern
class Module(models.Model):
    name = models.CharField(max_length=200)  # English
    name_de = models.CharField(max_length=200, blank=True)  # German
    description = models.TextField(blank=True)
    description_de = models.TextField(blank=True)  # German
    # ... rest bleibt gleich
```

### Aufgabe 2: Job/Karriere Model erstellen

```python
class CareerPath(models.Model):
    """Karrierewege für Informatik-Studenten"""
    title = models.CharField(max_length=200)  # z.B. "Software Engineer"
    title_de = models.CharField(max_length=200)
    description = models.TextField()
    description_de = models.TextField()
    average_salary = models.CharField(max_length=50, blank=True)  # z.B. "50.000 - 70.000 €"
    required_skills = models.JSONField(default=list)  # ["Python", "SQL", "Git"]
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Career Paths"
```

### Aufgabe 3: Job-Kurs Verknüpfung

```python
class CareerModuleRecommendation(models.Model):
    """Verknüpft Karrierewege mit empfohlenen Modulen"""
    career_path = models.ForeignKey(CareerPath, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    relevance_score = models.IntegerField(default=5)  # 1-10, wie wichtig ist das Modul
    reason = models.CharField(max_length=500, blank=True)  # Warum ist es wichtig

    class Meta:
        unique_together = ['career_path', 'module']
```

### Aufgabe 4: Migrationen erstellen
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## EMIR - API Endpoints

### Aufgabe 1: Career Goals API (für User)

```python
# In views.py

class CareerGoalViewSet(viewsets.ModelViewSet):
    """
    GET    /api/user/career-goals/     - Liste der Karriereziele des Users
    POST   /api/user/career-goals/     - Neues Karriereziel erstellen
    PATCH  /api/user/career-goals/:id/ - Karriereziel aktualisieren
    DELETE /api/user/career-goals/:id/ - Karriereziel löschen
    """
    serializer_class = CareerGoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CareerGoal.objects.filter(user=self.request.user)
```

### Aufgabe 2: Career Paths API (allgemein)

```python
class CareerPathViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/careers/           - Alle Karrierewege auflisten
    GET /api/careers/:id/       - Details eines Karrierewegs
    GET /api/careers/:id/modules/ - Empfohlene Module für diesen Karriereweg
    """
    queryset = CareerPath.objects.filter(is_active=True)
    serializer_class = CareerPathSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def modules(self, request, pk=None):
        """Empfohlene Module für diesen Karriereweg"""
        career = self.get_object()
        recommendations = CareerModuleRecommendation.objects.filter(
            career_path=career
        ).order_by('-relevance_score')
        # Return modules with relevance info
```

### Aufgabe 3: URLs registrieren

```python
# In urls.py
router.register(r'user/career-goals', CareerGoalViewSet, basename='user-career-goal')
router.register(r'careers', CareerPathViewSet, basename='career')
```

### Aufgabe 4: Recommendations Endpoint verbessern

Der aktuelle `/api/recommendations/` Endpoint soll:
1. User's gewähltes Karriereziel laden
2. Passende Module aus `CareerModuleRecommendation` holen
3. Bereits abgeschlossene Module ausfiltern
4. Nach `relevance_score` sortieren

### Aufgabe 5: Sprach-Support (Optional)

```python
# Header auslesen: Accept-Language: de
def get_serializer_context(self):
    context = super().get_serializer_context()
    context['language'] = self.request.headers.get('Accept-Language', 'en')
    return context

# Im Serializer
def to_representation(self, instance):
    data = super().to_representation(instance)
    lang = self.context.get('language', 'en')
    if lang == 'de' and instance.name_de:
        data['name'] = instance.name_de
        data['description'] = instance.description_de
    return data
```

---

## AMINE - Daten & Testing

### Aufgabe 1: Informatik B.Sc. Kurse sammeln

Hole alle Module aus dem TUCaN / Modulhandbuch:

**Pflichtbereich:**
- Funktionale und objektorientierte Programmierkonzepte
- Algorithmen und Datenstrukturen
- Digitaltechnik
- Rechnerorganisation
- Betriebssysteme
- Formale Grundlagen der Informatik 1, 2, 3
- Automaten, formale Sprachen und Entscheidbarkeit
- Aussagen- und Prädikatenlogik
- Software Engineering
- Computer Netzwerke und verteilte Systeme
- etc.

**Wahlpflichtbereich:**
- Machine Learning
- Deep Learning
- Computer Vision
- Datenbanken
- IT-Sicherheit
- etc.

**Studium Generale:**
- Alle verfügbaren Module

### Aufgabe 2: Kursdaten JSON erstellen

```json
{
  "modules": [
    {
      "code": "20-00-0001",
      "name": "Functional and Object-Oriented Programming Concepts",
      "name_de": "Funktionale und objektorientierte Programmierkonzepte",
      "credits": 10,
      "semester": 1,
      "category": "mandatory",
      "description": "Introduction to programming...",
      "description_de": "Einführung in die Programmierung..."
    }
  ]
}
```

### Aufgabe 3: Karrierewege definieren

| Karriereweg | Englisch | Deutsch |
|-------------|----------|---------|
| Software Engineer | Software Engineer | Softwareentwickler/in |
| Data Scientist | Data Scientist | Data Scientist |
| ML Engineer | Machine Learning Engineer | Machine Learning Ingenieur/in |
| Backend Developer | Backend Developer | Backend-Entwickler/in |
| Frontend Developer | Frontend Developer | Frontend-Entwickler/in |
| Full Stack Developer | Full Stack Developer | Full-Stack-Entwickler/in |
| DevOps Engineer | DevOps Engineer | DevOps-Ingenieur/in |
| Security Engineer | Security Engineer | IT-Sicherheitsingenieur/in |
| Data Engineer | Data Engineer | Dateningenieur/in |
| Cloud Architect | Cloud Architect | Cloud-Architekt/in |
| Research Scientist | Research Scientist | Wissenschaftler/in |
| IT Consultant | IT Consultant | IT-Berater/in |
| Product Manager | Product Manager | Produktmanager/in |
| Technical Lead | Technical Lead | Technische Leitung |

### Aufgabe 4: Job-Kurs Mapping erstellen

Beispiel für "Machine Learning Engineer":

| Modul | Relevanz (1-10) | Grund |
|-------|-----------------|-------|
| Machine Learning | 10 | Kernkompetenz |
| Deep Learning | 9 | Wichtige Spezialisierung |
| Algorithmen und Datenstrukturen | 8 | Grundlage für ML-Algorithmen |
| Statistik | 8 | Mathematische Grundlage |
| Python-Programmierung | 9 | Hauptsprache für ML |
| Lineare Algebra | 7 | Mathematische Grundlage |
| Datenbanken | 6 | Daten-Management |

**Erstelle solche Mappings für alle 14 Karrierewege!**

### Aufgabe 5: seed_data.py aktualisieren

```python
# In management/commands/seed_data.py

def seed_career_paths(self):
    careers = [
        {
            'title': 'Software Engineer',
            'title_de': 'Softwareentwickler/in',
            'description': 'Design, develop and maintain software systems...',
            'description_de': 'Entwurf, Entwicklung und Wartung von Softwaresystemen...',
            'average_salary': '55.000 - 75.000 €',
            'required_skills': ['Python', 'Java', 'SQL', 'Git', 'Agile'],
        },
        # ... weitere Karrierewege
    ]

def seed_career_module_links(self):
    # Verknüpfe Karrierewege mit Modulen
    links = [
        {'career': 'Software Engineer', 'module_code': '20-00-0001', 'relevance': 9},
        # ... weitere Verknüpfungen
    ]
```

### Aufgabe 6: API Testing

Teste alle Endpoints mit curl oder Postman:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "stas.mustermann@stud.tu-darmstadt.de", "password": "testpass123"}'

# Karrierewege abrufen
curl http://localhost:8000/api/careers/ \
  -H "Authorization: Token <token>"

# Empfohlene Module für Karriereweg
curl http://localhost:8000/api/careers/1/modules/ \
  -H "Authorization: Token <token>"

# User Karriereziel setzen
curl -X POST http://localhost:8000/api/user/career-goals/ \
  -H "Authorization: Token <token>" \
  -H "Content-Type: application/json" \
  -d '{"career_path": 1}'
```

---

## EILEEN - Finanzierung

### EmailJS Subscription

| Was | Kosten | Wofür |
|-----|--------|-------|
| EmailJS | ~$15/Monat | Passwort-Reset E-Mails |

Nach Kauf: Credentials an Yigit geben für Konfiguration.

---

## Zeitplan (Vorschlag)

| Woche | Aufgaben |
|-------|----------|
| 1 | Stas: Models erstellen, Amine: Kursdaten sammeln |
| 2 | Emir: API Endpoints, Amine: Job-Kurs Mappings |
| 3 | Testing & Integration, Bug Fixes |
| 4 | Finale Tests, Dokumentation |

---

## Kontakt bei Fragen

- **Frontend (Yigit):** Bei UI/API-Integration Fragen
- **Backend (Emir):** Bei API-Fragen
- **Datenbank (Stas):** Bei Model-Fragen
- **Daten (Amine):** Bei Kursdaten-Fragen

---

## Git Branches

```
main                              # Produktiv
├── feature/yigit-frontend-integration  # Frontend (fertig)
├── feature/stas-career-models    # Neue Models für Karrierewege
├── feature/emir-career-api       # Neue API Endpoints
└── feature/amine-course-data     # Kursdaten & Seed
```

**Workflow:**
1. Eigenen Branch erstellen
2. Änderungen committen
3. Pull Request erstellen
4. Code Review
5. Merge in main

---

*Erstellt am 23. Januar 2026*
