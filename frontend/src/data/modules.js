// Module data from TU Darmstadt BSc Informatik curriculum
// Categories: Pflichtbereich (Mandatory), wahlpflicht (Elective Required), Studium Generale

export const moduleCategories = {
  MANDATORY: 'Pflichtbereich',
  WAHLPFLICHT: 'Informatik Wahlpflichtbereich',
  WAHLBEREICH: 'Informatik Wahlbereich',
  STUDIUM_GENERALE: 'Studium Generale'
};

export const allModules = [
  // ==================== PFLICHTBEREICH (MANDATORY) ====================
  {
    id: 1,
    code: "20-00-1141",
    name: "Erfolgreich ins Informatik-Studium starten",
    name_en: "Successfully Starting Computer Science Studies",
    credits: 1,
    semester: 1,
    category: "Pflichtbereich",
    description: "Einführung in das Informatikstudium, Studienorganisation und wissenschaftliches Arbeiten.",
    required: true
  },
  {
    id: 2,
    code: "20-00-0004",
    name: "Funktionale und objektorientierte Programmierkonzepte",
    name_en: "Functional and Object-Oriented Programming Concepts",
    credits: 10,
    semester: 1,
    category: "Pflichtbereich",
    description: "Grundlagen der funktionalen und objektorientierten Programmierung mit Java und Haskell.",
    required: true
  },
  {
    id: 3,
    code: "20-00-0900",
    name: "Digitaltechnik",
    name_en: "Digital Technology",
    credits: 5,
    semester: 1,
    category: "Pflichtbereich",
    description: "Grundlagen der digitalen Schaltungstechnik, Boolesche Algebra, Schaltnetze und Schaltwerke.",
    required: true
  },
  {
    id: 4,
    code: "04-10-0118",
    name: "Mathematik I für Informatik",
    name_en: "Mathematics I for Computer Science",
    credits: 9,
    semester: 1,
    category: "Pflichtbereich",
    description: "Lineare Algebra, Vektorräume, Matrizen und analytische Geometrie.",
    required: true
  },
  {
    id: 5,
    code: "20-00-0036",
    name: "Automaten, formale Sprachen und Entscheidbarkeit",
    name_en: "Automata, Formal Languages and Decidability",
    credits: 5,
    semester: 1,
    category: "Pflichtbereich",
    description: "Endliche Automaten, reguläre Sprachen, kontextfreie Grammatiken und Turing-Maschinen.",
    required: true
  },
  {
    id: 6,
    code: "20-00-0037",
    name: "Algorithmen und Datenstrukturen",
    name_en: "Algorithms and Data Structures",
    credits: 10,
    semester: 2,
    category: "Pflichtbereich",
    description: "Grundlegende Algorithmen, Komplexitätsanalyse, Sortieren, Suchen, Graphenalgorithmen.",
    required: true
  },
  {
    id: 7,
    code: "20-00-0038",
    name: "Rechnerorganisation",
    name_en: "Computer Organization",
    credits: 5,
    semester: 2,
    category: "Pflichtbereich",
    description: "Aufbau und Funktionsweise von Rechnern, Maschinensprache, Assembler.",
    required: true
  },
  {
    id: 8,
    code: "04-10-0119",
    name: "Mathematik II für Informatik",
    name_en: "Mathematics II for Computer Science",
    credits: 9,
    semester: 2,
    category: "Pflichtbereich",
    description: "Analysis, Differentialrechnung, Integralrechnung und Differentialgleichungen.",
    required: true
  },
  {
    id: 9,
    code: "20-00-0039",
    name: "Aussagenlogik und Prädikatenlogik",
    name_en: "Propositional and Predicate Logic",
    credits: 5,
    semester: 2,
    category: "Pflichtbereich",
    description: "Formale Logik, Beweismethoden, logische Schlussfolgerungen.",
    required: true
  },
  {
    id: 10,
    code: "20-00-0040",
    name: "Software Engineering",
    name_en: "Software Engineering",
    credits: 5,
    semester: 3,
    category: "Pflichtbereich",
    description: "Softwareentwicklungsprozesse, Requirements Engineering, Design Patterns, Testing.",
    required: true
  },
  {
    id: 11,
    code: "20-00-0041",
    name: "Computersystemsicherheit",
    name_en: "Computer System Security",
    credits: 5,
    semester: 3,
    category: "Pflichtbereich",
    description: "Grundlagen der IT-Sicherheit, Kryptographie, Netzwerksicherheit.",
    required: true
  },
  {
    id: 12,
    code: "20-00-0042",
    name: "Einführung in die Künstliche Intelligenz",
    name_en: "Introduction to Artificial Intelligence",
    credits: 5,
    semester: 3,
    category: "Pflichtbereich",
    description: "Grundlagen der KI, Suche, Wissensrepräsentation, maschinelles Lernen.",
    required: true
  },
  {
    id: 13,
    code: "20-00-0043",
    name: "Probabilistische Methoden der Informatik",
    name_en: "Probabilistic Methods in Computer Science",
    credits: 5,
    semester: 3,
    category: "Pflichtbereich",
    description: "Wahrscheinlichkeitstheorie, Statistik, stochastische Prozesse.",
    required: true
  },
  {
    id: 14,
    code: "20-00-0013",
    name: "Modellierung, Spezifikation und Semantik",
    name_en: "Modeling, Specification and Semantics",
    credits: 5,
    semester: 3,
    category: "Pflichtbereich",
    description: "Formale Modellierung, Spezifikationssprachen, Semantik von Programmiersprachen.",
    required: true
  },
  {
    id: 15,
    code: "20-00-0044",
    name: "Informationsmanagement",
    name_en: "Information Management",
    credits: 5,
    semester: 4,
    category: "Pflichtbereich",
    description: "Datenbanksysteme, SQL, Datenmodellierung, Data Warehousing.",
    required: true
  },
  {
    id: 16,
    code: "20-00-0045",
    name: "Computernetze und verteilte Systeme",
    name_en: "Computer Networks and Distributed Systems",
    credits: 5,
    semester: 4,
    category: "Pflichtbereich",
    description: "Netzwerkprotokolle, TCP/IP, verteilte Algorithmen, Middleware.",
    required: true
  },
  {
    id: 17,
    code: "20-00-0046",
    name: "Parallele Programmierung",
    name_en: "Parallel Programming",
    credits: 5,
    semester: 5,
    category: "Pflichtbereich",
    description: "Multithreading, Synchronisation, parallele Algorithmen, GPU-Programmierung.",
    required: true
  },
  {
    id: 18,
    code: "20-00-0047",
    name: "Informatik und Gesellschaft",
    name_en: "Computer Science and Society",
    credits: 3,
    semester: 5,
    category: "Pflichtbereich",
    description: "Ethische, rechtliche und soziale Aspekte der Informatik.",
    required: true
  },
  {
    id: 19,
    code: "20-00-0048",
    name: "Einführung in wissenschaftliches Arbeiten",
    name_en: "Introduction to Scientific Writing",
    credits: 3,
    semester: 5,
    category: "Pflichtbereich",
    description: "Wissenschaftliches Schreiben, Literaturrecherche, Präsentationstechniken.",
    required: true
  },
  {
    id: 20,
    code: "20-00-0049",
    name: "Teamprojekt Softwareentwicklung",
    name_en: "Team Project Software Development",
    credits: 9,
    semester: 5,
    category: "Pflichtbereich",
    description: "Praktisches Softwareprojekt im Team, agile Methoden, Projektmanagement.",
    required: true
  },

  // ==================== WAHLPFLICHT (ELECTIVE REQUIRED) ====================
  {
    id: 21,
    code: "20-00-3001",
    name: "Betriebssysteme",
    name_en: "Operating Systems",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Prozessverwaltung, Speicherverwaltung, Dateisysteme, Scheduling.",
    required: false,
    notes: "Typisches Wahlpflichtmodul im Bereich Systemsoftware."
  },
  {
    id: 22,
    code: "20-00-3002",
    name: "Computernetze und Verteilte Systeme (Vertiefung)",
    name_en: "Computer Networks and Distributed Systems (Advanced)",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Netzwerkprotokolle, verteilte Systeme, Grundlagen von Internet-Technologien.",
    required: false
  },
  {
    id: 23,
    code: "20-00-3003",
    name: "Datenbanksysteme",
    name_en: "Database Systems",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Relationale Datenbanken, SQL, Normalformen, Transaktionen.",
    required: false
  },
  {
    id: 24,
    code: "20-00-3004",
    name: "Mensch-Computer-Interaktion",
    name_en: "Human-Computer Interaction",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Usability, Interface-Design, Benutzerstudien.",
    required: false
  },
  {
    id: 25,
    code: "20-00-3005",
    name: "Maschinelles Lernen",
    name_en: "Machine Learning",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Überwachtes und unüberwachtes Lernen, Grundlagen von ML-Verfahren.",
    required: false
  },
  {
    id: 26,
    code: "20-00-3006",
    name: "Rechnerarchitektur vertieft",
    name_en: "Advanced Computer Architecture",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Pipelines, Caches, Parallelität auf Hardware-Ebene.",
    required: false
  },
  {
    id: 27,
    code: "20-00-3007",
    name: "IT-Sicherheit",
    name_en: "IT Security",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Kryptographie-Grundlagen, Angriffe, Security-Mechanismen.",
    required: false
  },
  {
    id: 28,
    code: "20-00-3008",
    name: "Web Engineering",
    name_en: "Web Engineering",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Web-Architekturen, Backend/Frontend-Konzepte, Web-Anwendungen.",
    required: false
  },
  {
    id: 29,
    code: "20-00-3009",
    name: "Mobile Systeme",
    name_en: "Mobile Systems",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Mobile Betriebssysteme, App-Entwicklung, energieeffiziente Systeme.",
    required: false
  },
  {
    id: 30,
    code: "20-00-3010",
    name: "Computergraphik",
    name_en: "Computer Graphics",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Rendering, 3D-Modelle, OpenGL/ähnliche APIs.",
    required: false
  },
  {
    id: 31,
    code: "20-00-3011",
    name: "Algorithm Engineering",
    name_en: "Algorithm Engineering",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Praxisorientierte Optimierung und Implementierung von Algorithmen.",
    required: false
  },
  {
    id: 32,
    code: "20-00-3012",
    name: "Theoretische Informatik vertieft",
    name_en: "Advanced Theoretical Computer Science",
    credits: 5,
    semester: null,
    category: "Informatik Wahlpflichtbereich",
    description: "Komplexitätstheorie, formale Sprachen und Automaten vertieft.",
    required: false
  },

  // ==================== WAHLBEREICH (ELECTIVE) ====================
  {
    id: 33,
    code: "20-00-4001",
    name: "Deep Learning",
    name_en: "Deep Learning",
    credits: 5,
    semester: null,
    category: "Informatik Wahlbereich",
    description: "Neuronale Netze, CNNs, RNNs, Transformer, praktische Anwendungen.",
    required: false
  },
  {
    id: 34,
    code: "20-00-4002",
    name: "Cloud Computing",
    name_en: "Cloud Computing",
    credits: 5,
    semester: null,
    category: "Informatik Wahlbereich",
    description: "Cloud-Architekturen, AWS/Azure/GCP, Containerisierung, Serverless.",
    required: false
  },
  {
    id: 35,
    code: "20-00-4003",
    name: "Data Science",
    name_en: "Data Science",
    credits: 5,
    semester: null,
    category: "Informatik Wahlbereich",
    description: "Datenanalyse, Visualisierung, statistische Methoden, Python.",
    required: false
  },
  {
    id: 36,
    code: "20-00-4004",
    name: "Robotik",
    name_en: "Robotics",
    credits: 5,
    semester: null,
    category: "Informatik Wahlbereich",
    description: "Robotersteuerung, Sensorik, Bewegungsplanung, ROS.",
    required: false
  },
  {
    id: 37,
    code: "20-00-4005",
    name: "Compiler Construction",
    name_en: "Compiler Construction",
    credits: 5,
    semester: null,
    category: "Informatik Wahlbereich",
    description: "Lexer, Parser, Semantische Analyse, Code-Generierung.",
    required: false
  },

  // ==================== STUDIUM GENERALE ====================
  {
    id: 38,
    code: "SG-0001",
    name: "Wissenschaftliches Schreiben",
    name_en: "Scientific Writing",
    credits: 3,
    semester: null,
    category: "Studium Generale",
    description: "Techniken des wissenschaftlichen Schreibens für verschiedene Disziplinen.",
    required: false
  },
  {
    id: 39,
    code: "SG-0002",
    name: "Projektmanagement",
    name_en: "Project Management",
    credits: 3,
    semester: null,
    category: "Studium Generale",
    description: "Grundlagen des Projektmanagements, agile Methoden, Scrum.",
    required: false
  },
  {
    id: 40,
    code: "SG-0003",
    name: "Entrepreneurship",
    name_en: "Entrepreneurship",
    credits: 3,
    semester: null,
    category: "Studium Generale",
    description: "Grundlagen der Unternehmensgründung, Business Model Canvas, Pitching.",
    required: false
  },
  {
    id: 41,
    code: "SG-0004",
    name: "Interkulturelle Kompetenz",
    name_en: "Intercultural Competence",
    credits: 3,
    semester: null,
    category: "Studium Generale",
    description: "Kommunikation in interkulturellen Teams, kulturelle Unterschiede.",
    required: false
  },
  {
    id: 42,
    code: "SG-0005",
    name: "Präsentationstechniken",
    name_en: "Presentation Skills",
    credits: 2,
    semester: null,
    category: "Studium Generale",
    description: "Effektive Präsentationen, Rhetorik, Visualisierung.",
    required: false
  }
];

// Get modules by category
export const getModulesByCategory = (category) => {
  return allModules.filter(m => m.category === category);
};

// Get modules by semester
export const getModulesBySemester = (semester) => {
  return allModules.filter(m => m.semester === semester);
};

// Get mandatory modules for a specific semester
export const getMandatoryModulesForSemester = (semester) => {
  return allModules.filter(m =>
    m.category === 'Pflichtbereich' && m.semester === semester
  );
};

// Calculate total credits for mandatory modules up to a semester
export const getMandatoryCreditsUpToSemester = (semester) => {
  return allModules
    .filter(m => m.category === 'Pflichtbereich' && m.semester && m.semester <= semester)
    .reduce((sum, m) => sum + m.credits, 0);
};

// Total required credits for degree
export const TOTAL_REQUIRED_CREDITS = 180;

// Credit requirements by category
export const creditRequirements = {
  'Pflichtbereich': 97, // Sum of all mandatory modules
  'Informatik Wahlpflichtbereich': 42,
  'Informatik Wahlbereich': 26,
  'Studium Generale': 6,
  'Bachelorarbeit': 12
};

export default {
  allModules,
  moduleCategories,
  getModulesByCategory,
  getModulesBySemester,
  getMandatoryModulesForSemester,
  getMandatoryCreditsUpToSemester,
  TOTAL_REQUIRED_CREDITS,
  creditRequirements
};
