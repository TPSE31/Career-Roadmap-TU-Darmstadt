// Career paths data with recommended modules for each career goal

export const careerPaths = [
  {
    id: "software_engineer",
    title_en: "Software Engineer",
    title_de: "Softwareentwickler/in",
    description_en: "Builds and maintains software applications and services across the full development lifecycle.",
    description_de: "Entwickelt und wartet Softwareanwendungen und -dienste über den gesamten Entwicklungszyklus.",
    average_salary: { junior: 50000, mid: 65000, senior: 80000 },
    required_skills: [
      "Programming (Java, C#, C++, Python)",
      "Version control (Git)",
      "Software engineering fundamentals",
      "Relational and NoSQL databases",
      "Clean code, unit testing, debugging"
    ],
    recommended_modules: [
      "20-00-0004", // Funktionale und objektorientierte Programmierkonzepte
      "20-00-0037", // Algorithmen und Datenstrukturen
      "20-00-0040", // Software Engineering
      "20-00-3003", // Datenbanksysteme
      "20-00-3008", // Web Engineering
      "20-00-0049"  // Teamprojekt Softwareentwicklung
    ]
  },
  {
    id: "backend_developer",
    title_en: "Backend Developer",
    title_de: "Backend-Entwickler/in",
    description_en: "Implements server-side logic, APIs and database access for web and mobile applications.",
    description_de: "Implementiert serverseitige Logik, APIs und Datenbankzugriffe für Web- und Mobile-Anwendungen.",
    average_salary: { junior: 48000, mid: 65000, senior: 82000 },
    required_skills: [
      "Java/Spring, Node.js or Python (Django/Flask)",
      "REST and GraphQL APIs",
      "SQL and NoSQL databases",
      "Linux and basic networking",
      "Testing and performance optimization"
    ],
    recommended_modules: [
      "20-00-0037", // Algorithmen und Datenstrukturen
      "20-00-3003", // Datenbanksysteme
      "20-00-0045", // Computernetze und verteilte Systeme
      "20-00-3001", // Betriebssysteme
      "20-00-3008", // Web Engineering
      "20-00-0044"  // Informationsmanagement
    ]
  },
  {
    id: "frontend_developer",
    title_en: "Frontend Developer",
    title_de: "Frontend-Entwickler/in",
    description_en: "Builds user interfaces for web applications with a focus on usability and responsive design.",
    description_de: "Entwickelt Benutzeroberflächen für Webanwendungen mit Fokus auf Usability und Responsive Design.",
    average_salary: { junior: 45000, mid: 60000, senior: 75000 },
    required_skills: [
      "HTML, CSS, JavaScript, TypeScript",
      "Modern frameworks (React, Vue, Angular)",
      "Responsive design and basic UX",
      "State management (Redux, Vuex, etc.)",
      "Testing (Jest, Cypress) and browser debugging"
    ],
    recommended_modules: [
      "20-00-0004", // Funktionale und objektorientierte Programmierkonzepte
      "20-00-3008", // Web Engineering
      "20-00-3004", // Mensch-Computer-Interaktion
      "20-00-0040", // Software Engineering
      "20-00-3010"  // Computergraphik
    ]
  },
  {
    id: "fullstack_developer",
    title_en: "Full Stack Developer",
    title_de: "Full-Stack-Entwickler/in",
    description_en: "Works on both frontend and backend, building complete web applications end-to-end.",
    description_de: "Arbeitet sowohl an Frontend als auch Backend und entwickelt komplette Webanwendungen.",
    average_salary: { junior: 48000, mid: 65000, senior: 85000 },
    required_skills: [
      "Frontend (React/Vue/Angular)",
      "Backend (Node.js/Python/Java)",
      "Databases (SQL and NoSQL)",
      "DevOps basics",
      "API design"
    ],
    recommended_modules: [
      "20-00-3008", // Web Engineering
      "20-00-3003", // Datenbanksysteme
      "20-00-0045", // Computernetze und verteilte Systeme
      "20-00-3004", // Mensch-Computer-Interaktion
      "20-00-0040", // Software Engineering
      "20-00-4002"  // Cloud Computing
    ]
  },
  {
    id: "data_scientist",
    title_en: "Data Scientist",
    title_de: "Data Scientist",
    description_en: "Analyses data and builds statistical and machine learning models to answer business questions.",
    description_de: "Analysiert Daten und erstellt statistische Modelle und Machine-Learning-Modelle.",
    average_salary: { junior: 55000, mid: 70000, senior: 90000 },
    required_skills: [
      "Python (pandas, scikit-learn) or R",
      "Statistics and probability",
      "SQL and data querying",
      "Data visualization",
      "Machine learning fundamentals"
    ],
    recommended_modules: [
      "20-00-0043", // Probabilistische Methoden der Informatik
      "20-00-3005", // Maschinelles Lernen
      "20-00-0042", // Einführung in die Künstliche Intelligenz
      "20-00-4003", // Data Science
      "20-00-3003", // Datenbanksysteme
      "20-00-4001"  // Deep Learning
    ]
  },
  {
    id: "ml_engineer",
    title_en: "Machine Learning Engineer",
    title_de: "Machine-Learning-Engineer",
    description_en: "Productionizes machine learning models and operates them as reliable services.",
    description_de: "Bringt Machine-Learning-Modelle in Produktion und betreibt sie als zuverlässige Services.",
    average_salary: { junior: 60000, mid: 80000, senior: 100000 },
    required_skills: [
      "Python, TensorFlow or PyTorch",
      "ML model training and evaluation",
      "APIs and microservices",
      "Docker, Kubernetes and Linux",
      "ML pipelines and experiment tracking"
    ],
    recommended_modules: [
      "20-00-3005", // Maschinelles Lernen
      "20-00-4001", // Deep Learning
      "20-00-0042", // Einführung in die Künstliche Intelligenz
      "20-00-0046", // Parallele Programmierung
      "20-00-4002", // Cloud Computing
      "20-00-3001"  // Betriebssysteme
    ]
  },
  {
    id: "devops_engineer",
    title_en: "DevOps Engineer",
    title_de: "DevOps-Engineer",
    description_en: "Automates build, deployment and monitoring processes and bridges development and operations.",
    description_de: "Automatisiert Build-, Deployment- und Monitoring-Prozesse.",
    average_salary: { junior: 55000, mid: 75000, senior: 95000 },
    required_skills: [
      "Linux and scripting (Bash, Python)",
      "CI/CD tools",
      "Docker and Kubernetes",
      "Infrastructure as Code",
      "Monitoring and logging"
    ],
    recommended_modules: [
      "20-00-3001", // Betriebssysteme
      "20-00-0045", // Computernetze und verteilte Systeme
      "20-00-4002", // Cloud Computing
      "20-00-0041", // Computersystemsicherheit
      "20-00-0046"  // Parallele Programmierung
    ]
  },
  {
    id: "security_engineer",
    title_en: "IT Security Engineer",
    title_de: "IT-Security-Engineer",
    description_en: "Secures systems and applications, performs security tests and monitors for threats.",
    description_de: "Sichert Systeme und Anwendungen, führt Sicherheitstests durch.",
    average_salary: { junior: 55000, mid: 75000, senior: 95000 },
    required_skills: [
      "Network and application security",
      "Firewalls, VPNs, IDS/IPS",
      "Secure coding practices",
      "Penetration testing tools",
      "Security monitoring"
    ],
    recommended_modules: [
      "20-00-0041", // Computersystemsicherheit
      "20-00-3007", // IT-Sicherheit
      "20-00-0045", // Computernetze und verteilte Systeme
      "20-00-3001", // Betriebssysteme
      "20-00-0037"  // Algorithmen und Datenstrukturen
    ]
  },
  {
    id: "mobile_developer",
    title_en: "Mobile Developer",
    title_de: "Mobile-Entwickler/in",
    description_en: "Develops native or cross-platform mobile applications for iOS and Android.",
    description_de: "Entwickelt native oder plattformübergreifende mobile Anwendungen.",
    average_salary: { junior: 48000, mid: 65000, senior: 85000 },
    required_skills: [
      "Swift/Kotlin or React Native/Flutter",
      "Mobile UI/UX patterns",
      "REST APIs integration",
      "App store deployment",
      "Performance optimization"
    ],
    recommended_modules: [
      "20-00-3009", // Mobile Systeme
      "20-00-0004", // Funktionale und objektorientierte Programmierkonzepte
      "20-00-3004", // Mensch-Computer-Interaktion
      "20-00-0040", // Software Engineering
      "20-00-3008"  // Web Engineering
    ]
  },
  {
    id: "cloud_architect",
    title_en: "Cloud Architect",
    title_de: "Cloud-Architekt/in",
    description_en: "Designs secure and scalable cloud architectures and selects appropriate cloud services.",
    description_de: "Entwirft sichere und skalierbare Cloud-Architekturen.",
    average_salary: { junior: 70000, mid: 90000, senior: 110000 },
    required_skills: [
      "AWS, Azure or GCP architecture",
      "Containerization",
      "Networking and IAM",
      "Infrastructure as Code",
      "Cost optimization"
    ],
    recommended_modules: [
      "20-00-4002", // Cloud Computing
      "20-00-0045", // Computernetze und verteilte Systeme
      "20-00-3001", // Betriebssysteme
      "20-00-0041", // Computersystemsicherheit
      "20-00-0046"  // Parallele Programmierung
    ]
  }
];

// Get career path by ID
export const getCareerPath = (id) => {
  return careerPaths.find(c => c.id === id);
};

// Get recommended modules for a career path
export const getRecommendedModulesForCareer = (careerId, allModules) => {
  const career = getCareerPath(careerId);
  if (!career) return [];

  return allModules.filter(m =>
    career.recommended_modules.includes(m.code)
  );
};

// Map frontend career goal names to career path IDs
export const careerGoalToPathId = {
  'Software Engineer': 'software_engineer',
  'Backend Developer': 'backend_developer',
  'Frontend Developer': 'frontend_developer',
  'Full Stack Developer': 'fullstack_developer',
  'Data Scientist': 'data_scientist',
  'Machine Learning Engineer': 'ml_engineer',
  'DevOps Engineer': 'devops_engineer',
  'Cybersecurity Specialist': 'security_engineer',
  'Mobile Developer': 'mobile_developer',
  'Cloud Architect': 'cloud_architect',
  'AI Researcher': 'ml_engineer',
  'Database Administrator': 'backend_developer',
  'IT Consultant': 'software_engineer',
  'Product Manager (Tech)': 'software_engineer',
  'Game Developer': 'frontend_developer'
};

export default {
  careerPaths,
  getCareerPath,
  getRecommendedModulesForCareer,
  careerGoalToPathId
};
