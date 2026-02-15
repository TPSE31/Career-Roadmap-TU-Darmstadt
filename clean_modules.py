"""
Clean and enhance the extracted modules data.
Fixes truncated codes, removes artifacts, and adds career relevance tags.
"""
import json
import re
from pathlib import Path

input_file = Path(r"C:\Users\Yigit\Desktop\Career-Roadmap-FINAL-v3\docs\data-model\all_modules_full.json")
output_file = Path(r"C:\Users\Yigit\Desktop\Career-Roadmap-FINAL-v3\docs\data-model\modules_cleaned.json")

# Career path keywords mapping
CAREER_KEYWORDS = {
    "software_engineer": [
        "programmier", "software", "algorithmen", "datenstruktur", "objektorientiert",
        "funktional", "entwicklung", "engineering", "code", "testing", "debug"
    ],
    "backend_developer": [
        "datenbank", "server", "api", "verteilte systeme", "netzwerk", "sql",
        "informationsmanagement", "backend", "spring", "django"
    ],
    "frontend_developer": [
        "web", "benutzer", "interface", "ui", "ux", "interaktion", "mensch-computer",
        "visualisierung", "html", "css", "javascript", "react"
    ],
    "fullstack_developer": [
        "web", "datenbank", "software", "api", "frontend", "backend", "full stack",
        "entwicklung", "anwendung", "system"
    ],
    "mobile_developer": [
        "mobile", "android", "ios", "app", "smartphone", "tablet", "touch",
        "benutzeroberfläche", "anwendung"
    ],
    "data_scientist": [
        "daten", "statistik", "machine learning", "maschinelles lernen", "analyse",
        "probabilistisch", "wahrscheinlichkeit", "modell", "prediction"
    ],
    "data_analyst": [
        "daten", "analyse", "statistik", "visualisierung", "bericht", "dashboard",
        "excel", "sql", "business intelligence"
    ],
    "data_engineer": [
        "datenbank", "big data", "pipeline", "etl", "data warehouse", "spark",
        "informationsmanagement", "datenmodell"
    ],
    "ml_engineer": [
        "künstliche intelligenz", "machine learning", "maschinelles lernen", "neural",
        "deep learning", "tensorflow", "pytorch", "ki", "ai", "lernen"
    ],
    "ai_engineer": [
        "künstliche intelligenz", "ki", "ai", "neural", "deep learning", "nlp",
        "computer vision", "generativ", "transformer", "llm"
    ],
    "devops_engineer": [
        "betriebssystem", "linux", "container", "docker", "kubernetes", "cloud",
        "deployment", "ci/cd", "automatisierung", "infrastruktur"
    ],
    "sre_engineer": [
        "betriebssystem", "verfügbarkeit", "monitoring", "incident", "zuverlässigkeit",
        "performance", "skalierung", "automatisierung"
    ],
    "it_security_engineer": [
        "sicherheit", "security", "kryptograph", "verschlüsselung", "angriff",
        "penetration", "authentifizierung", "datenschutz", "privatheit", "cyber"
    ],
    "cybersecurity_analyst": [
        "sicherheit", "cyber", "angriff", "malware", "forensik", "incident",
        "bedrohung", "schutz", "monitoring"
    ],
    "cloud_architect": [
        "cloud", "aws", "azure", "gcp", "architektur", "skalier", "verteilte systeme",
        "microservice", "container", "infrastruktur"
    ],
    "software_architect": [
        "architektur", "design", "pattern", "system", "modellierung", "spezifikation",
        "qualität", "struktur", "komponente"
    ],
    "database_administrator": [
        "datenbank", "sql", "administration", "backup", "replikation", "performance",
        "tuning", "schema", "integrität"
    ],
    "network_engineer": [
        "netzwerk", "protokoll", "tcp", "ip", "routing", "switch", "firewall",
        "vpn", "kommunikation", "übertragung"
    ],
    "systems_administrator": [
        "betriebssystem", "server", "administration", "linux", "windows",
        "virtualisierung", "backup", "wartung"
    ],
    "qa_engineer": [
        "test", "qualität", "prüfung", "validierung", "verifikation", "fehler",
        "bug", "automatisierung", "selenium"
    ],
    "embedded_systems_engineer": [
        "embedded", "eingebettet", "mikrocontroller", "hardware", "echtzeit",
        "sensor", "aktor", "firmware", "rtos"
    ],
    "game_developer": [
        "spiel", "game", "grafik", "3d", "animation", "physik", "engine",
        "unity", "unreal", "rendering"
    ],
    "blockchain_developer": [
        "blockchain", "kryptograph", "dezentral", "smart contract", "ethereum",
        "token", "konsens", "distributed ledger"
    ],
    "ux_designer": [
        "benutzer", "user", "design", "interface", "usability", "interaktion",
        "prototyp", "wireframe", "ergonomie"
    ],
    "technical_writer": [
        "dokumentation", "schreiben", "technisch", "anleitung", "handbuch",
        "api", "spezifikation", "kommunikation"
    ],
    "product_manager_tech": [
        "projekt", "management", "anforderung", "stakeholder", "agile", "scrum",
        "requirement", "planung", "team"
    ],
    "engineering_manager": [
        "führung", "team", "management", "projekt", "organisation", "leitung",
        "personal", "entwicklung", "strategie"
    ],
    "research_scientist": [
        "forschung", "wissenschaft", "theorie", "publikation", "paper", "akademisch",
        "dissertation", "experiment", "hypothese"
    ],
    "it_consultant": [
        "beratung", "consulting", "strategie", "analyse", "empfehlung",
        "transformation", "optimierung", "prozess"
    ],
    "solutions_architect": [
        "lösung", "architektur", "integration", "enterprise", "system",
        "anforderung", "design", "kunde"
    ],
    "mlops_engineer": [
        "machine learning", "pipeline", "deployment", "monitoring", "modell",
        "automatisierung", "mlflow", "kubeflow"
    ],
    "robotics_engineer": [
        "robotik", "roboter", "autonom", "steuerung", "sensor", "aktor",
        "kinematik", "ros", "bewegung"
    ],
    "computer_vision_engineer": [
        "bild", "vision", "erkennung", "segmentierung", "kamera", "video",
        "objekt", "tracking", "3d"
    ],
    "nlp_engineer": [
        "sprache", "text", "nlp", "natural language", "verstehen", "generieren",
        "übersetzung", "sentiment", "chatbot"
    ],
    "prompt_engineer": [
        "sprache", "nlp", "ki", "ai", "generativ", "text", "modell", "neural",
        "llm", "transformer", "gpt"
    ],
    "ai_research_scientist": [
        "forschung", "ki", "ai", "neural", "deep learning", "algorithmus",
        "theorie", "paper", "wissenschaft", "experiment"
    ],
    "generative_ai_developer": [
        "generativ", "ki", "ai", "llm", "neural", "text", "bild", "modell",
        "transformer", "embedding"
    ],
    "ai_ethics_specialist": [
        "ethik", "ki", "ai", "gesellschaft", "verantwortung", "bias",
        "fairness", "recht", "datenschutz"
    ],
    "conversational_ai_developer": [
        "dialog", "chatbot", "sprache", "nlp", "konversation", "assistant",
        "interaktion", "kommunikation"
    ],
    "ai_product_manager": [
        "ki", "ai", "produkt", "management", "anforderung", "stakeholder",
        "machine learning", "entwicklung"
    ],
    "cloud_engineer": [
        "cloud", "aws", "azure", "gcp", "infrastruktur", "deployment",
        "container", "serverless"
    ],
    "platform_engineer": [
        "plattform", "entwickler", "tooling", "ci/cd", "container", "kubernetes",
        "infrastruktur", "automatisierung"
    ],
    "penetration_tester": [
        "sicherheit", "penetration", "hacking", "angriff", "schwachstelle",
        "vulnerability", "exploit", "test"
    ],
    "soc_analyst": [
        "sicherheit", "monitoring", "incident", "analyse", "bedrohung",
        "log", "alarm", "forensik"
    ],
    "iam_specialist": [
        "identität", "zugriff", "authentifizierung", "autorisierung",
        "sicherheit", "passwort", "sso", "directory"
    ],
    "security_architect": [
        "sicherheit", "architektur", "design", "risiko", "bedrohung",
        "schutz", "compliance", "enterprise"
    ],
    "ar_vr_developer": [
        "virtual", "augmented", "reality", "3d", "grafik", "visualisierung",
        "immersiv", "simulation", "unity", "unreal"
    ],
    "iot_developer": [
        "iot", "sensor", "embedded", "geräte", "smart", "vernetzt",
        "protokoll", "mqtt", "edge"
    ],
    "api_developer": [
        "api", "schnittstelle", "rest", "graphql", "integration", "service",
        "dokumentation", "endpoint"
    ],
    "low_code_developer": [
        "automatisierung", "workflow", "prozess", "plattform", "anwendung",
        "integration", "visual"
    ],
    "digital_twin_engineer": [
        "digital", "twin", "simulation", "modell", "sensor", "iot",
        "visualisierung", "industrie", "fertigung"
    ],
    "automation_engineer": [
        "automatisierung", "test", "prozess", "script", "workflow",
        "robotik", "rpa", "ci/cd"
    ],
    "it_support_specialist": [
        "support", "hilfe", "problem", "hardware", "software", "benutzer",
        "ticket", "helpdesk"
    ],
    "scrum_master": [
        "agile", "scrum", "team", "sprint", "projekt", "management",
        "kanban", "facilitation"
    ],
    "business_analyst_tech": [
        "anforderung", "analyse", "prozess", "business", "stakeholder",
        "dokumentation", "spezifikation"
    ],
    "it_project_manager": [
        "projekt", "management", "planung", "budget", "team", "risiko",
        "stakeholder", "zeitplan"
    ],
    "systems_analyst": [
        "system", "analyse", "design", "anforderung", "modellierung",
        "integration", "architektur"
    ],
    "bi_developer": [
        "business intelligence", "bericht", "dashboard", "daten", "analyse",
        "visualisierung", "warehouse", "etl"
    ],
    "data_visualization_specialist": [
        "visualisierung", "daten", "dashboard", "diagramm", "grafik",
        "bericht", "storytelling"
    ],
    "edge_computing_engineer": [
        "edge", "iot", "latenz", "echtzeit", "verarbeitung", "sensor",
        "embedded", "dezentral"
    ],
    "ai_trainer": [
        "annotation", "label", "daten", "training", "machine learning",
        "qualität", "dataset"
    ],
    "quantum_computing_researcher": [
        "quanten", "quantum", "physik", "algorithmus", "computer",
        "forschung", "mathematik"
    ],
    "fintech_developer": [
        "finanz", "bank", "zahlung", "payment", "transaktion", "handel",
        "trading", "geld"
    ],
    "healthtech_developer": [
        "gesundheit", "medizin", "patient", "klinik", "diagnose",
        "behandlung", "healthcare"
    ],
    "autonomous_vehicle_engineer": [
        "autonom", "fahrzeug", "auto", "selbstfahrend", "sensor", "steuerung",
        "navigation", "robotik"
    ],
    "speech_recognition_engineer": [
        "sprache", "audio", "stimme", "erkennung", "speech", "signal",
        "akustik", "transkription"
    ],
    "recommender_systems_engineer": [
        "empfehlung", "personalisierung", "recommendation", "filter",
        "user", "content", "collaborative"
    ],
    "information_security_manager": [
        "sicherheit", "management", "risiko", "compliance", "audit",
        "richtlinie", "policy", "führung"
    ],
    "devsecops_engineer": [
        "sicherheit", "devops", "ci/cd", "automatisierung", "container",
        "scan", "vulnerability", "pipeline"
    ],
    "technical_account_manager": [
        "kunde", "beziehung", "technisch", "support", "lösung",
        "kommunikation", "beratung"
    ],
    "developer_advocate": [
        "entwickler", "community", "dokumentation", "tutorial", "content",
        "präsentation", "event", "kommunikation"
    ],
    "sap_developer": [
        "enterprise", "geschäftsprozess", "erp", "workflow", "integration",
        "datenbank", "modul", "system", "betriebswirtschaft"
    ],
    "erp_consultant": [
        "enterprise", "geschäftsprozess", "beratung", "management", "organisation",
        "integration", "workflow", "system", "anforderung"
    ],
    "bioinformatics_scientist": [
        "biologie", "genom", "sequenz", "protein", "molekular", "evolution",
        "phylogenetik", "biostatistik", "daten", "algorithmus"
    ],
    "computational_biologist": [
        "biologie", "modellierung", "simulation", "system", "molekular",
        "mathematisch", "dynamik", "experiment", "analyse"
    ],
    "graphics_programmer": [
        "grafik", "rendering", "3d", "shader", "opengl", "vulkan", "directx",
        "visualisierung", "geometrie", "mathematik", "linear", "matrix"
    ],
    "shader_developer": [
        "grafik", "shader", "rendering", "visual", "effekt", "3d", "animation",
        "spiel", "game", "unity", "unreal"
    ],
    "audio_dsp_engineer": [
        "signal", "audio", "digital", "verarbeitung", "filter", "fourier",
        "frequenz", "transformation", "echtzeit"
    ],
    "signal_processing_engineer": [
        "signal", "digital", "verarbeitung", "filter", "fourier", "transformation",
        "frequenz", "spektral", "mathematik", "statistik"
    ],
    "compiler_engineer": [
        "compiler", "übersetzer", "parser", "grammatik", "semantik", "syntax",
        "optimierung", "sprache", "programm", "theorie"
    ],
    "programming_language_designer": [
        "sprache", "compiler", "typ", "semantik", "syntax", "formal", "theorie",
        "programm", "abstraktion", "logik"
    ],
    "database_developer": [
        "datenbank", "sql", "schema", "abfrage", "index", "performance",
        "modellierung", "relational", "transaktion"
    ],
    "search_engineer": [
        "suche", "information", "retrieval", "index", "ranking", "text",
        "nlp", "algorithmus", "datenstruktur"
    ],
    "simulation_engineer": [
        "simulation", "modellierung", "physik", "numerisch", "visualisierung",
        "dynamik", "system", "mathematik", "differentialgleichung"
    ],
    "hpc_engineer": [
        "parallel", "hochleistung", "cluster", "mpi", "openmp", "optimierung",
        "performance", "wissenschaft", "numerisch", "algorithmus"
    ],
    "firmware_engineer": [
        "embedded", "firmware", "mikrocontroller", "hardware", "echtzeit",
        "low-level", "assembly", "register", "protokoll"
    ],
    "fpga_engineer": [
        "fpga", "vhdl", "verilog", "digital", "schaltung", "hardware",
        "logik", "synthese", "timing", "signal"
    ],
    "hardware_engineer": [
        "hardware", "schaltung", "elektronik", "digital", "analog",
        "prozessor", "platine", "pcb", "design"
    ],
    "gis_developer": [
        "geo", "karte", "räumlich", "koordinate", "position", "navigation",
        "daten", "visualisierung", "analyse"
    ],
    "cad_cam_developer": [
        "cad", "cam", "3d", "geometrie", "modellierung", "fertigung",
        "konstruktion", "engineering", "visualisierung"
    ],
    "technical_support_engineer": [
        "support", "hilfe", "problem", "lösung", "benutzer", "software",
        "hardware", "kommunikation", "dokumentation"
    ],
    "release_engineer": [
        "build", "release", "deployment", "automatisierung", "version",
        "pipeline", "ci", "cd", "integration"
    ],
    "infrastructure_engineer": [
        "infrastruktur", "server", "netzwerk", "cloud", "virtualisierung",
        "administration", "automatisierung", "linux"
    ],
    "performance_engineer": [
        "performance", "optimierung", "profiling", "last", "benchmark",
        "skalierung", "monitoring", "analyse"
    ],
    "chaos_engineer": [
        "zuverlässigkeit", "resilienz", "fehler", "test", "system",
        "verfügbarkeit", "incident", "automatisierung"
    ],
    "forensics_analyst": [
        "forensik", "untersuchung", "beweis", "analyse", "datei",
        "wiederherstellung", "sicherheit", "legal"
    ],
    "malware_analyst": [
        "malware", "virus", "sicherheit", "analyse", "reverse",
        "assembly", "bedrohung", "schutz"
    ],
    "threat_intelligence_analyst": [
        "bedrohung", "intelligence", "analyse", "sicherheit", "cyber",
        "forschung", "angriff", "monitoring"
    ],
    "compliance_engineer": [
        "compliance", "regelung", "audit", "richtlinie", "risiko",
        "sicherheit", "dokumentation", "standard"
    ],
    "privacy_engineer": [
        "datenschutz", "privacy", "daten", "anonymisierung", "gdpr",
        "schutz", "recht", "sicherheit"
    ],
    "crypto_engineer": [
        "kryptograph", "verschlüsselung", "sicherheit", "protokoll",
        "mathematik", "algorithmus", "schlüssel", "hash"
    ],
    "technical_program_manager": [
        "programm", "management", "projekt", "koordination", "technisch",
        "stakeholder", "planung", "team"
    ],
    "data_product_manager": [
        "daten", "produkt", "management", "strategie", "analyse",
        "stakeholder", "governance", "plattform"
    ],
    "ai_safety_researcher": [
        "ki", "ai", "sicherheit", "forschung", "alignment", "verifizierung",
        "formal", "ethik", "risiko"
    ],
    "reinforcement_learning_engineer": [
        "reinforcement", "lernen", "agent", "umgebung", "belohnung",
        "policy", "optimierung", "simulation", "robotik"
    ],
    "ai_infrastructure_engineer": [
        "ki", "ai", "infrastruktur", "training", "gpu", "cluster",
        "skalierung", "deployment", "pipeline"
    ],
    "applied_scientist": [
        "forschung", "wissenschaft", "machine learning", "experiment",
        "daten", "analyse", "modell", "anwendung"
    ],
    "legaltech_developer": [
        "recht", "legal", "dokument", "vertrag", "text", "analyse",
        "automatisierung", "nlp"
    ],
    "edtech_developer": [
        "bildung", "lernen", "lehre", "didaktik", "interaktiv",
        "lernplattform", "visualisierung", "benutzer"
    ],
    "govtech_developer": [
        "regierung", "öffentlich", "verwaltung", "bürger", "service",
        "digital", "sicherheit", "integration"
    ],
    "cleantech_developer": [
        "umwelt", "energie", "nachhaltig", "sensor", "monitoring",
        "daten", "iot", "analyse"
    ],
    "accessibility_engineer": [
        "barrierefrei", "zugänglich", "benutzer", "interface", "web",
        "standard", "design", "test"
    ],
    "localization_engineer": [
        "sprache", "übersetzung", "international", "lokalisierung",
        "text", "kultur", "unicode", "software"
    ],
    "growth_engineer": [
        "wachstum", "experiment", "daten", "analyse", "benutzer",
        "test", "metriken", "optimierung"
    ],
    "developer_experience_engineer": [
        "entwickler", "werkzeug", "tooling", "dokumentation", "sdk",
        "api", "produktivität", "plattform"
    ],
    "observability_engineer": [
        "monitoring", "logging", "metriken", "tracing", "alarm",
        "performance", "system", "verteilte"
    ]
}

# Category mapping based on German terms
CATEGORY_MAP = {
    "pflicht": "Pflichtbereich",
    "wahlpflicht": "Wahlpflichtbereich",
    "wahlbereich": "Informatik-Wahlbereich",
    "seminar": "Studienbegleitende Leistungen",
    "praktik": "Studienbegleitende Leistungen",
    "thesis": "Abschlussbereich",
    "bachelor": "Abschlussbereich",
    "studium generale": "Studium Generale"
}

def clean_text(text):
    """Remove page separators and clean up text."""
    if not text:
        return ""
    # Remove page separators
    text = re.sub(r'={10,}\nPAGE \d+\n={10,}', '', text)
    # Remove header repetitions
    text = re.sub(r'Modulhandbuch B\. Sc\. Informatik\s*\n\s*\d+\s*\n?', '', text)
    # Clean up extra whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()
    return text

def determine_category(module):
    """Determine module category based on content."""
    name = module.get('name_de', '').lower()
    content = module.get('learning_content', '').lower()

    # Check for specific keywords
    for keyword, category in CATEGORY_MAP.items():
        if keyword in name or keyword in content:
            return category

    # Default to Wahlpflichtbereich for most elective modules
    return "Wahlpflichtbereich"

def calculate_career_relevance(module):
    """Calculate relevance scores for each career path."""
    relevance = {}

    # Combine all text fields for matching
    text = ' '.join([
        module.get('name_de', ''),
        module.get('learning_content', ''),
        module.get('learning_objectives', '')
    ]).lower()

    for career, keywords in CAREER_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword.lower() in text:
                score += 1

        # Normalize to 0-100
        max_possible = len(keywords)
        if max_possible > 0:
            normalized_score = int((score / max_possible) * 100)
            if normalized_score > 0:
                relevance[career] = min(normalized_score, 100)

    return relevance

def clean_module(module):
    """Clean a single module entry."""
    cleaned = {}

    # Fix module code (some are truncated like "20-00-")
    code = module.get('code', '')
    if code.endswith('-'):
        # Try to extract from name if code is incomplete
        code = code + "0000"  # Placeholder for incomplete codes
    cleaned['module_code'] = code

    # Basic fields
    cleaned['name_de'] = module.get('name_de', '').strip()
    cleaned['name_en'] = ''  # Not in source, can be added later
    cleaned['credits'] = module.get('credits', 0)
    cleaned['workload_hours'] = module.get('workload_hours', 0)
    cleaned['self_study_hours'] = module.get('self_study_hours', 0)
    cleaned['duration_semesters'] = module.get('duration_semesters', 1)
    cleaned['language'] = module.get('language', 'Deutsch')
    cleaned['offering_frequency'] = module.get('offering_frequency', '').strip()

    # Clean text fields
    cleaned['learning_content'] = clean_text(module.get('learning_content', ''))
    cleaned['learning_objectives'] = clean_text(module.get('learning_objectives', ''))
    cleaned['prerequisites_text'] = clean_text(module.get('prerequisites', ''))
    cleaned['exam_form'] = clean_text(module.get('exam_form', ''))
    cleaned['usable_in_programs'] = clean_text(module.get('usable_in_programs', ''))

    # Determine category
    cleaned['category'] = determine_category(module)

    # Calculate career relevance
    cleaned['career_relevance'] = calculate_career_relevance(module)

    return cleaned

# Load and process
with open(input_file, 'r', encoding='utf-8') as f:
    modules = json.load(f)

print(f"Loaded {len(modules)} modules")

# Clean each module
cleaned_modules = []
seen_codes = set()

for module in modules:
    cleaned = clean_module(module)

    # Skip if no valid code or duplicate
    if not cleaned['module_code'] or cleaned['module_code'] in seen_codes:
        continue

    # Skip if no name
    if not cleaned['name_de']:
        continue

    seen_codes.add(cleaned['module_code'])
    cleaned_modules.append(cleaned)

print(f"Cleaned {len(cleaned_modules)} unique modules")

# Sort by module code
cleaned_modules.sort(key=lambda x: x['module_code'])

# Save cleaned data
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(cleaned_modules, f, ensure_ascii=False, indent=2)

print(f"Saved to: {output_file}")

# Print statistics
categories = {}
careers_covered = set()
for m in cleaned_modules:
    cat = m['category']
    categories[cat] = categories.get(cat, 0) + 1
    careers_covered.update(m['career_relevance'].keys())

print("\n--- Statistics ---")
print(f"Total modules: {len(cleaned_modules)}")
print(f"Categories: {categories}")
print(f"Career paths covered: {len(careers_covered)}")

# Sample output
print("\n--- Sample module ---")
sample = next((m for m in cleaned_modules if m['career_relevance']), cleaned_modules[0])
print(f"Name: {sample['name_de']}")
print(f"Code: {sample['module_code']}")
print(f"Credits: {sample['credits']}")
print(f"Career relevance: {sample['career_relevance']}")
