// ============================================
// MOCK DATA - TU Darmstadt B.Sc. Informatik
// Basierend auf: Satzungsbeilage 2023_II, Stand 03.09.2025
// ============================================

export const mockModules = [
  // === PFLICHTBEREICH (114 CP) ===
  // Semester 1
  { id: 1, name: "Erfolgreich ins Informatik-Studium starten", code: "20-00-0001", credits: 1, semester: 1, description: "Orientierungsmodul: Einstieg ins Studium, Lernstrategien und Studienorganisation", required: true, category: "Pflichtbereich", prerequisites: [], needsStudienleistung: false },
  { id: 2, name: "Funktionale und objektorientierte Programmierkonzepte", code: "20-00-0002", credits: 10, semester: 1, description: "Grundlagen der Programmierung in funktionalen und objektorientierten Paradigmen (Java, Racket)", required: true, category: "Pflichtbereich", prerequisites: [], needsStudienleistung: true },
  { id: 3, name: "Digitaltechnik", code: "18-su-2010", credits: 5, semester: 1, description: "Boolesche Algebra, Schaltnetze, Schaltwerke, Entwurf digitaler Systeme", required: true, category: "Pflichtbereich", prerequisites: [], needsStudienleistung: true },
  { id: 4, name: "Mathematik I (fuer Informatik und Wirtschaftsinformatik)", code: "04-00-0126", credits: 9, semester: 1, description: "Analysis: Folgen, Reihen, Stetigkeit, Differentialrechnung, Integralrechnung", required: true, category: "Pflichtbereich", prerequisites: [], needsStudienleistung: true },
  { id: 5, name: "Automaten, formale Sprachen und Entscheidbarkeit", code: "20-00-0006", credits: 5, semester: 1, description: "Endliche Automaten, regulaere Sprachen, kontextfreie Grammatiken, Turingmaschinen, Entscheidbarkeit", required: true, category: "Pflichtbereich", prerequisites: [], needsStudienleistung: true },

  // Semester 2
  { id: 6, name: "Algorithmen und Datenstrukturen", code: "20-00-0004", credits: 10, semester: 2, description: "Entwurf und Analyse von Algorithmen, grundlegende Datenstrukturen, Komplexitaetstheorie", required: true, category: "Pflichtbereich", prerequisites: ["Funktionale und objektorientierte Programmierkonzepte"], needsStudienleistung: true },
  { id: 7, name: "Rechnerorganisation", code: "20-00-0012", credits: 5, semester: 2, description: "Aufbau und Funktionsweise von Rechnern, Assembler, Speicherhierarchie, Pipelining", required: true, category: "Pflichtbereich", prerequisites: ["Digitaltechnik"], needsStudienleistung: true },
  { id: 8, name: "Mathematik II (fuer Informatik und Wirtschaftsinformatik)", code: "04-00-0127", credits: 9, semester: 2, description: "Lineare Algebra: Vektorraeume, Matrizen, lineare Abbildungen, Eigenwerte", required: true, category: "Pflichtbereich", prerequisites: ["Mathematik I (fuer Informatik und Wirtschaftsinformatik)"], needsStudienleistung: true },
  { id: 9, name: "Aussagen- und Praedikatenlogik", code: "20-00-0008", credits: 5, semester: 2, description: "Formale Logik, Beweisverfahren, Resolution, Modelltheorie", required: true, category: "Pflichtbereich", prerequisites: [], needsStudienleistung: true },

  // Semester 3
  { id: 10, name: "Software Engineering", code: "20-00-0016", credits: 5, semester: 3, description: "Softwareentwicklungsprozesse, Entwurfsmuster, Testen, Projektmanagement", required: true, category: "Pflichtbereich", prerequisites: ["Algorithmen und Datenstrukturen"], needsStudienleistung: false },
  { id: 11, name: "Computersystemsicherheit", code: "20-00-0022", credits: 5, semester: 3, description: "Kryptographie, Authentifizierung, Netzwerksicherheit, Systemsicherheit", required: true, category: "Pflichtbereich", prerequisites: ["Algorithmen und Datenstrukturen"], needsStudienleistung: false },
  { id: 12, name: "Einfuehrung in die Kuenstliche Intelligenz", code: "20-00-0024", credits: 5, semester: 3, description: "Suchverfahren, Wissensrepraesentation, Planung, maschinelles Lernen Grundlagen", required: true, category: "Pflichtbereich", prerequisites: ["Algorithmen und Datenstrukturen"], needsStudienleistung: false },
  { id: 13, name: "Probabilistische Methoden der Informatik", code: "20-00-0030", credits: 5, semester: 3, description: "Wahrscheinlichkeitstheorie, Statistik, stochastische Prozesse fuer Informatik-Anwendungen", required: true, category: "Pflichtbereich", prerequisites: ["Mathematik II (fuer Informatik und Wirtschaftsinformatik)"], needsStudienleistung: false },
  { id: 14, name: "Modellierung, Spezifikation und Semantik", code: "20-00-0028", credits: 5, semester: 3, description: "Formale Modellierung von Software, Petrinetze, operationelle und denotationale Semantik", required: true, category: "Pflichtbereich", prerequisites: ["Aussagen- und Praedikatenlogik"], needsStudienleistung: false },

  // Semester 4
  { id: 15, name: "Informationsmanagement", code: "20-00-0018", credits: 5, semester: 4, description: "Relationale Datenbanken, SQL, ER-Modellierung, Normalisierung, NoSQL-Grundlagen", required: true, category: "Pflichtbereich", prerequisites: ["Funktionale und objektorientierte Programmierkonzepte"], needsStudienleistung: false },
  { id: 16, name: "Computernetze und verteilte Systeme", code: "20-00-0020", credits: 5, semester: 4, description: "OSI-Modell, TCP/IP, Routing, verteilte Algorithmen, Middleware", required: true, category: "Pflichtbereich", prerequisites: ["Rechnerorganisation"], needsStudienleistung: false },
  { id: 17, name: "Einfuehrung in wissenschaftliches Arbeiten", code: "20-00-0032", credits: 3, semester: 4, description: "Wissenschaftliche Methodik, Literaturrecherche, akademisches Schreiben und Praesentieren", required: true, category: "Pflichtbereich", prerequisites: [], needsStudienleistung: false },
  { id: 18, name: "Teamprojekt Softwareentwicklung", code: "20-00-0034", credits: 9, semester: 4, description: "Praktische Projektarbeit im Team: Planung, Entwurf, Implementierung und Testen eines Softwareprojekts", required: true, category: "Pflichtbereich", prerequisites: ["Software Engineering"], needsStudienleistung: false },

  // Semester 5
  { id: 19, name: "Parallele Programmierung", code: "20-00-0036", credits: 5, semester: 5, description: "Threads, Synchronisation, GPU-Programmierung, parallele Algorithmen, Performance-Optimierung", required: true, category: "Pflichtbereich", prerequisites: ["Algorithmen und Datenstrukturen"], needsStudienleistung: false },
  { id: 20, name: "Informatik und Gesellschaft", code: "20-00-0038", credits: 3, semester: 5, description: "Ethische, soziale und gesellschaftliche Auswirkungen der Informatik, Datenschutz, Verantwortung", required: true, category: "Pflichtbereich", prerequisites: [], needsStudienleistung: false },

  // Semester 6
  { id: 21, name: "Bachelorarbeit", code: "20-00-0999", credits: 12, semester: 6, description: "Abschlussarbeit: eigenstaendige wissenschaftliche Bearbeitung eines Informatik-Themas (12 Wochen)", required: true, category: "Abschlussbereich", prerequisites: [], needsStudienleistung: false },

  // === WAHLPFLICHTBEREICH (10-35 CP) ===
  // Offener Wahlkatalog, aktuelle Auswahl:
  { id: 22, name: "Betriebssysteme", code: "20-00-0014", credits: 5, semester: 5, description: "Prozessverwaltung, Speicherverwaltung, Dateisysteme, Synchronisation, Scheduling", required: false, category: "Wahlpflichtbereich", prerequisites: ["Rechnerorganisation"], needsStudienleistung: false },
  { id: 23, name: "Einfuehrung in den Compilerbau", code: "20-00-0010", credits: 5, semester: 5, description: "Lexikalische Analyse, Parsing, Syntaxbaeume, Codeerzeugung, Optimierung", required: false, category: "Wahlpflichtbereich", prerequisites: ["Automaten, formale Sprachen und Entscheidbarkeit"], needsStudienleistung: false },
  { id: 24, name: "Scientific Computing", code: "20-00-0040", credits: 5, semester: 5, description: "Numerische Verfahren, Simulation, High-Performance Computing, wissenschaftliches Rechnen", required: false, category: "Wahlpflichtbereich", prerequisites: ["Mathematik II (fuer Informatik und Wirtschaftsinformatik)"], needsStudienleistung: false },
  { id: 25, name: "Formale Methoden im Softwareentwurf", code: "20-00-0042", credits: 5, semester: 5, description: "Formale Verifikation, Model Checking, Spezifikationssprachen, Korrektheitsbeweise", required: false, category: "Wahlpflichtbereich", prerequisites: ["Modellierung, Spezifikation und Semantik"], needsStudienleistung: false },
  { id: 26, name: "Visual Computing", code: "20-00-0026", credits: 5, semester: 5, description: "Computergraphik, Bildverarbeitung, Visualisierung, geometrische Modellierung", required: false, category: "Wahlpflichtbereich", prerequisites: ["Mathematik II (fuer Informatik und Wirtschaftsinformatik)"], needsStudienleistung: false },

  // === INFORMATIK-WAHLBEREICHE (5-30 CP) ===
  // Lehrveranstaltungen aus den Forschungsschwerpunkten der Informatik
  { id: 27, name: "Machine Learning: The Basics", code: "20-00-0501", credits: 6, semester: 5, description: "Supervised/Unsupervised Learning, neuronale Netze, SVMs, Ensemble-Methoden", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Probabilistische Methoden der Informatik"], needsStudienleistung: false },
  { id: 28, name: "Computer Vision", code: "20-00-0502", credits: 5, semester: 5, description: "Bildverarbeitung, Objekterkennung, 3D-Rekonstruktion, Deep Learning fuer Bilder", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Einfuehrung in die Kuenstliche Intelligenz"], needsStudienleistung: false },
  { id: 29, name: "IT-Sicherheit", code: "20-00-0503", credits: 5, semester: 5, description: "Vertiefung Kryptographie, Penetration Testing, Sicherheitsanalysen, Malware-Analyse", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Computersystemsicherheit"], needsStudienleistung: false },
  { id: 30, name: "Web Engineering", code: "20-00-0504", credits: 6, semester: 5, description: "Webarchitekturen, Frontend/Backend-Frameworks, REST APIs, moderne Webtechnologien", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Software Engineering"], needsStudienleistung: false },
  { id: 31, name: "Cloud Computing", code: "20-00-0505", credits: 5, semester: 5, description: "Cloud-Architekturen, Virtualisierung, Container, Microservices, AWS/Azure", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Computernetze und verteilte Systeme"], needsStudienleistung: false },
  { id: 32, name: "Mobile Application Development", code: "20-00-0506", credits: 5, semester: 5, description: "Android/iOS-Entwicklung, Cross-Platform-Frameworks, mobile UI-Patterns", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Software Engineering"], needsStudienleistung: false },
  { id: 33, name: "Data Mining und maschinelles Lernen", code: "20-00-0507", credits: 5, semester: 6, description: "Clustering, Klassifikation, Assoziationsregeln, Text Mining, Big Data Analyse", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Machine Learning: The Basics"], needsStudienleistung: false },
  { id: 34, name: "Robotik", code: "20-00-0508", credits: 5, semester: 6, description: "Kinematik, Bahnplanung, Sensorfusion, autonome Systeme, ROS", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Einfuehrung in die Kuenstliche Intelligenz"], needsStudienleistung: false },
  { id: 35, name: "Natural Language Processing", code: "20-00-0509", credits: 5, semester: 6, description: "Sprachmodelle, Textklassifikation, Named Entity Recognition, Transformers", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Machine Learning: The Basics"], needsStudienleistung: false },
  { id: 36, name: "Verteilte Systeme und Algorithmen", code: "20-00-0510", credits: 5, semester: 5, description: "Konsensalgorithmen, Replikation, verteilte Datenbanken, Fehlertoleranz", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Computernetze und verteilte Systeme"], needsStudienleistung: false },
  { id: 37, name: "Human-Computer Interaction", code: "20-00-0511", credits: 5, semester: 5, description: "Usability Engineering, User-Centered Design, Evaluationsmethoden, Prototyping", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Software Engineering"], needsStudienleistung: false },
  { id: 38, name: "Deep Learning", code: "20-00-0512", credits: 6, semester: 6, description: "CNNs, RNNs, GANs, Reinforcement Learning, Transfer Learning", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Machine Learning: The Basics"], needsStudienleistung: false },
  { id: 39, name: "Embedded Systems", code: "20-00-0515", credits: 5, semester: 5, description: "Echtzeitbetriebssysteme, Mikrocontroller, Hardware-Software-Codesign", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Rechnerorganisation"], needsStudienleistung: false },
  { id: 40, name: "Datenbanken und Webtechnologien", code: "20-00-0513", credits: 5, semester: 5, description: "Fortgeschrittene Datenbankkonzepte, NoSQL, GraphDB, Webservices", required: false, category: "Informatik-Wahlbereich", prerequisites: ["Informationsmanagement"], needsStudienleistung: false },

  // === STUDIENBEGLEITENDE LEISTUNGEN (9-18 CP) ===
  { id: 41, name: "Seminar (mind. 1)", code: "20-00-0900", credits: 5, semester: 5, description: "Wissenschaftliches Seminar mit Vortrag und schriftlicher Ausarbeitung zu einem Fachthema", required: false, category: "Studienbegleitende Leistungen", prerequisites: [], needsStudienleistung: false },
  { id: 42, name: "Praktikum / Projektpraktikum (mind. 1)", code: "20-00-0901", credits: 9, semester: 5, description: "Praktische Projektarbeit in einem Fachgebiet der Informatik, oft in Zusammenarbeit mit Fachgebieten", required: false, category: "Studienbegleitende Leistungen", prerequisites: [], needsStudienleistung: false },
  { id: 43, name: "Praktikum in der Lehre (max. 1)", code: "20-00-0902", credits: 5, semester: 5, description: "Unterstuetzung in der Lehre: Uebungsleitung, Tutorien, Aufgabenkorrektur", required: false, category: "Studienbegleitende Leistungen", prerequisites: [], needsStudienleistung: false },
  { id: 44, name: "Studienarbeit (max. 1)", code: "20-00-0903", credits: 9, semester: 6, description: "Eigenstaendige wissenschaftliche Arbeit unter Betreuung eines Fachgebiets", required: false, category: "Studienbegleitende Leistungen", prerequisites: [], needsStudienleistung: false },

  // === STUDIUM GENERALE (5-6 CP) ===
  { id: 45, name: "Studium Generale", code: "00-00-0001", credits: 6, semester: 5, description: "Wahl aus den Gesamtkatalogen aller Fachbereiche der TU Darmstadt ausser dem Fachbereich Informatik", required: false, category: "Studium Generale", prerequisites: [], needsStudienleistung: false },
];

export const mockCareerPaths = [
  {
    id: 1, name: "Software Engineer", icon: "\u{1F4BB}",
    description: "Entwurf, Entwicklung und Wartung von Softwaresystemen in Teams. Arbeit an Backend-Systemen, APIs und Softwarearchitektur.",
    salary: "50.000 - 75.000 \u20AC/Jahr (Einstieg)",
    skills: ["Java/Python/C++", "Software Design Patterns", "Agile Methoden", "Testing", "Git"],
    semesters: {
      4: { modules: [22, 30], note: "Betriebssysteme und Web Engineering als Einstieg" },
      5: { modules: [25, 40, 36, 42], note: "Formale Methoden, Datenbanken-Vertiefung, verteilte Systeme + Praktikum" },
      6: { modules: [31, 41, 44], note: "Cloud Computing, Seminar und ggf. Studienarbeit" },
    },
  },
  {
    id: 2, name: "Data Scientist", icon: "\u{1F4CA}",
    description: "Analyse grosser Datenmengen, statistische Modellierung und datengetriebene Entscheidungsfindung.",
    salary: "55.000 - 80.000 \u20AC/Jahr (Einstieg)",
    skills: ["Python/R", "Statistik", "Machine Learning", "SQL", "Visualisierung"],
    semesters: {
      4: { modules: [24, 26], note: "Scientific Computing und Visual Computing als Grundlage" },
      5: { modules: [27, 40, 42], note: "Machine Learning, Datenbanken-Vertiefung + Praktikum" },
      6: { modules: [38, 33, 35, 41], note: "Deep Learning, Data Mining, NLP + Seminar" },
    },
  },
  {
    id: 3, name: "Web Developer", icon: "\u{1F310}",
    description: "Entwicklung moderner Webanwendungen (Frontend & Backend) mit aktuellen Frameworks.",
    salary: "45.000 - 65.000 \u20AC/Jahr (Einstieg)",
    skills: ["JavaScript/TypeScript", "React/Angular", "Node.js", "REST APIs", "Datenbanken"],
    semesters: {
      4: { modules: [22, 30], note: "Betriebssysteme und Web Engineering frueh starten" },
      5: { modules: [40, 37, 32, 42], note: "DB-Vertiefung, HCI, Mobile Dev + Praktikum" },
      6: { modules: [31, 41], note: "Cloud Computing + Seminar" },
    },
  },
  {
    id: 4, name: "Cybersecurity Analyst", icon: "\u{1F512}",
    description: "Schutz von IT-Systemen, Schwachstellenanalyse, Penetration Testing und Incident Response.",
    salary: "50.000 - 75.000 \u20AC/Jahr (Einstieg)",
    skills: ["Netzwerksicherheit", "Penetration Testing", "Kryptographie", "SIEM", "Forensik"],
    semesters: {
      4: { modules: [22, 25], note: "Betriebssysteme und Formale Methoden als Basis" },
      5: { modules: [29, 36, 42], note: "IT-Sicherheit Vertiefung, verteilte Systeme + Praktikum" },
      6: { modules: [31, 39, 41], note: "Cloud Computing, Embedded Systems + Seminar" },
    },
  },
  {
    id: 5, name: "DevOps Engineer", icon: "\u2699\uFE0F",
    description: "Automatisierung von Build-, Test- und Deployment-Pipelines, Infrastructure as Code, Cloud-Betrieb.",
    salary: "55.000 - 78.000 \u20AC/Jahr (Einstieg)",
    skills: ["Docker/Kubernetes", "CI/CD", "Linux", "Cloud (AWS/Azure)", "Terraform"],
    semesters: {
      4: { modules: [22], note: "Betriebssysteme als Grundlage fuer Systemadministration" },
      5: { modules: [31, 36, 30, 42], note: "Cloud, verteilte Systeme, Web Engineering + Praktikum" },
      6: { modules: [39, 41], note: "Embedded Systems + Seminar" },
    },
  },
  {
    id: 6, name: "AI/ML Engineer", icon: "\u{1F916}",
    description: "Entwicklung und Deployment von KI- und Machine-Learning-Modellen in Produktion.",
    salary: "58.000 - 85.000 \u20AC/Jahr (Einstieg)",
    skills: ["Python", "TensorFlow/PyTorch", "MLOps", "Mathematik", "Cloud ML"],
    semesters: {
      4: { modules: [24, 26], note: "Scientific Computing und Visual Computing als Basis" },
      5: { modules: [27, 28, 42], note: "Machine Learning, Computer Vision + Praktikum" },
      6: { modules: [38, 35, 33, 41], note: "Deep Learning, NLP, Data Mining + Seminar" },
    },
  },
  {
    id: 7, name: "Mobile Developer", icon: "\u{1F4F1}",
    description: "Entwicklung nativer und plattformuebergreifender mobiler Anwendungen (Android/iOS).",
    salary: "48.000 - 68.000 \u20AC/Jahr (Einstieg)",
    skills: ["Kotlin/Swift", "Flutter/React Native", "Mobile UI", "REST APIs", "App Stores"],
    semesters: {
      4: { modules: [22, 32], note: "Betriebssysteme und Mobile App Development starten" },
      5: { modules: [30, 37, 40, 42], note: "Web Engineering, HCI, DB-Vertiefung + Praktikum" },
      6: { modules: [31, 41], note: "Cloud Computing + Seminar" },
    },
  },
  {
    id: 8, name: "Cloud Architect", icon: "\u2601\uFE0F",
    description: "Entwurf und Verwaltung von Cloud-Infrastrukturen, Microservices und verteilten Systemen.",
    salary: "60.000 - 90.000 \u20AC/Jahr (Einstieg)",
    skills: ["AWS/Azure/GCP", "Microservices", "Networking", "Security", "IaC"],
    semesters: {
      4: { modules: [22], note: "Betriebssysteme als Grundlage" },
      5: { modules: [31, 36, 29, 42], note: "Cloud, verteilte Systeme, IT-Sicherheit + Praktikum" },
      6: { modules: [30, 39, 41], note: "Web Engineering, Embedded Systems + Seminar" },
    },
  },
  {
    id: 9, name: "Embedded Systems Engineer", icon: "\u{1F527}",
    description: "Entwicklung von Software fuer eingebettete Systeme, Mikrocontroller und Echtzeitsysteme.",
    salary: "50.000 - 72.000 \u20AC/Jahr (Einstieg)",
    skills: ["C/C++", "RTOS", "Hardware-Interfaces", "Signalverarbeitung", "Testing"],
    semesters: {
      4: { modules: [22, 23], note: "Betriebssysteme und Compilerbau als Basis" },
      5: { modules: [24, 39, 42], note: "Scientific Computing, Embedded Systems + Praktikum" },
      6: { modules: [34, 41], note: "Robotik + Seminar" },
    },
  },
  {
    id: 10, name: "UX/UI Designer", icon: "\u{1F3A8}",
    description: "Gestaltung benutzerfreundlicher Interfaces, Nutzerforschung und Prototyping.",
    salary: "42.000 - 60.000 \u20AC/Jahr (Einstieg)",
    skills: ["Figma/Sketch", "User Research", "Prototyping", "Accessibility", "Design Systems"],
    semesters: {
      4: { modules: [26, 37], note: "Visual Computing und HCI als Einstieg" },
      5: { modules: [32, 30, 42], note: "Mobile Dev, Web Engineering + Praktikum" },
      6: { modules: [40, 41], note: "DB/Webtechnologien + Seminar" },
    },
  },
];

export const mockMilestones = [
  { id: 1, title: "Orientierungspruefung bestehen", description: "Mindestens eine Pruefung aus dem 1. Semester bestehen", type: "academic", deadline: "Ende 1. Semester", semester: 1, credits_required: null },
  { id: 2, title: "Grundlagen abschliessen", description: "Pflichtmodule der ersten zwei Semester (Sem 1+2: 59 CP)", type: "credit", deadline: "Ende 2. Semester", semester: 2, credits_required: 59 },
  { id: 3, title: "Wahlpflicht- und Wahlbereich beginnen", description: "Ab dem 4. Semester Spezialisierung waehlen und erste Wahlmodule belegen", type: "decision", deadline: "Beginn 4. Semester", semester: 3, credits_required: null },
  { id: 4, title: "Pflichtbereich abschliessen (114 CP)", description: "Alle Pflichtmodule bestanden", type: "academic", deadline: "Ende 5. Semester", semester: 5, credits_required: 114 },
  { id: 5, title: "Bachelorarbeit anmelden", description: "Thema und Betreuer fuer die Bachelorarbeit finden", type: "thesis", deadline: "Beginn 6. Semester", semester: 6, credits_required: null },
  { id: 6, title: "Bachelorarbeit abgeben", description: "Abschlussarbeit fertigstellen und einreichen (12 CP)", type: "thesis", deadline: "Ende 6. Semester", semester: 6, credits_required: null },
];

export const mockRoadmap = {
  semesters: [
    { semester: 1, moduleIds: [1, 2, 3, 4, 5], cp: 30, description: "Programmierung, Mathematik, Digitaltechnik und Automatentheorie" },
    { semester: 2, moduleIds: [6, 7, 8, 9], cp: 29, description: "Algorithmen, Rechnerorganisation, Lineare Algebra und Logik" },
    { semester: 3, moduleIds: [10, 11, 12, 13, 14], cp: 25, description: "Software Engineering, Sicherheit, KI, Stochastik und formale Modellierung" },
    { semester: 4, moduleIds: [15, 16, 17, 18], cp: 22, description: "Datenbanken, Netzwerke, wiss. Arbeiten, Teamprojekt + Beginn Wahlpflicht/Wahlbereich" },
    { semester: 5, moduleIds: [19, 20], cp: 8, description: "Parallele Programmierung, Informatik & Gesellschaft + Wahlpflicht/Wahlbereich/Studienbegleitend" },
    { semester: 6, moduleIds: [21], cp: 12, description: "Bachelorarbeit + restliche Wahlpflicht/Wahlbereich/Studienbegleitend" },
  ],
  phases: [
    { id: 1, name: "Grundlagen", semester_range: "1\u20132", description: "Programmierung, Mathematik und digitale Grundlagen", milestoneIds: [1, 2] },
    { id: 2, name: "Kernstudium", semester_range: "3\u20134", description: "Theoretische Informatik, Systeme, Datenbanken und Teamprojekt", milestoneIds: [3] },
    { id: 3, name: "Vertiefung & Abschluss", semester_range: "5\u20136", description: "Wahlpflicht, Wahlbereiche, Studienbegleitendes und Bachelorarbeit", milestoneIds: [4, 5, 6] },
  ]
};

export const mockSupportServices = [
  { id: 1, name: "Zentrale Studienberatung und -orientierung ZSB", category: "Beratung", description: "Individuelle Studienorientierung, Entscheidungsfindung, zielgerichtete Studienplanung", contact_email: "info@zsb.tu-darmstadt.de", website: "https://www.zsb.tu-darmstadt.de", location: "Karolinenplatz 5, Gebaeude S1|01" },
  { id: 2, name: "Fachbereich Informatik", category: "Fachbereich", description: "Informationen zum Studiengang, Pruefungsordnung und Modulkatalog", contact_email: "studienberatung@cs.tu-darmstadt.de", website: "https://www.informatik.tu-darmstadt.de", location: "Fachbereich 20" },
];

export const mockRecommendations = [];
export const mockEvents = [];

export const calculateCreditsFromModules = (modules) => {
  return modules.reduce((sum, m) => sum + (m.credits || 0), 0);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  modules: mockModules,
  milestones: mockMilestones,
  careerPaths: mockCareerPaths,
  recommendations: mockRecommendations,
  supportServices: mockSupportServices,
  events: mockEvents,
  roadmap: mockRoadmap,
  calculateCreditsFromModules
};
