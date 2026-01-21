import store from './store';
import mockData from '../mocks/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Career goal to recommended modules/skills mapping
const careerGoalRecommendations = {
  software_engineer: {
    modules: ['Software Engineering', 'Algorithms and Data Structures', 'Databases'],
    skills: ['System Design', 'Clean Code', 'Testing'],
    electives: ['Cloud Computing', 'DevOps', 'Distributed Systems'],
  },
  data_scientist: {
    modules: ['Machine Learning', 'Statistics', 'Databases'],
    skills: ['Python', 'Data Visualization', 'Statistical Analysis'],
    electives: ['Deep Learning', 'Big Data', 'Data Mining'],
  },
  ml_engineer: {
    modules: ['Machine Learning', 'Algorithms and Data Structures', 'Software Engineering'],
    skills: ['Python', 'TensorFlow/PyTorch', 'MLOps'],
    electives: ['Deep Learning', 'Computer Vision', 'NLP'],
  },
  backend_developer: {
    modules: ['Databases', 'Web Engineering', 'Software Engineering'],
    skills: ['API Design', 'Database Optimization', 'Security'],
    electives: ['Cloud Computing', 'Microservices', 'Message Queues'],
  },
  frontend_developer: {
    modules: ['Web Engineering', 'Software Engineering', 'UI/UX Design'],
    skills: ['JavaScript', 'React/Vue', 'CSS'],
    electives: ['Mobile Development', 'Accessibility', 'Performance Optimization'],
  },
  fullstack_developer: {
    modules: ['Web Engineering', 'Databases', 'Software Engineering'],
    skills: ['Frontend & Backend', 'DevOps Basics', 'System Design'],
    electives: ['Cloud Computing', 'Mobile Development', 'Security'],
  },
  devops_engineer: {
    modules: ['Software Engineering', 'Networks', 'Operating Systems'],
    skills: ['CI/CD', 'Containerization', 'Infrastructure as Code'],
    electives: ['Cloud Computing', 'Security', 'Monitoring'],
  },
  security_engineer: {
    modules: ['Networks', 'Operating Systems', 'Cryptography'],
    skills: ['Penetration Testing', 'Security Auditing', 'Incident Response'],
    electives: ['Ethical Hacking', 'Forensics', 'Compliance'],
  },
  research_scientist: {
    modules: ['Machine Learning', 'Algorithms and Data Structures', 'Mathematics'],
    skills: ['Research Methods', 'Paper Writing', 'Experimentation'],
    electives: ['Advanced ML', 'Theory of Computation', 'Optimization'],
  },
  product_manager: {
    modules: ['Software Engineering', 'UI/UX Design', 'Business'],
    skills: ['Agile/Scrum', 'User Research', 'Analytics'],
    electives: ['Entrepreneurship', 'Marketing', 'Data Analysis'],
  },
  consultant: {
    modules: ['Software Engineering', 'Business', 'Communication'],
    skills: ['Problem Solving', 'Presentation', 'Client Management'],
    electives: ['Project Management', 'Industry Specialization', 'Analytics'],
  },
  startup_founder: {
    modules: ['Software Engineering', 'Business', 'Entrepreneurship'],
    skills: ['Full Stack', 'Leadership', 'Fundraising'],
    electives: ['Marketing', 'Finance', 'Legal Basics'],
  },
  academia: {
    modules: ['Research Methods', 'Mathematics', 'Specialization Area'],
    skills: ['Teaching', 'Paper Writing', 'Grant Writing'],
    electives: ['Advanced Theory', 'Thesis Research', 'Pedagogy'],
  },
};

/**
 * Generate recommendations based on user's career goal and progress
 */
const generateRecommendations = (careerGoal, completedModules = []) => {
  const recommendations = [];
  const goalConfig = careerGoalRecommendations[careerGoal] || careerGoalRecommendations.software_engineer;
  const completedModuleNames = completedModules.map(m => m.name);

  // Recommend modules based on career goal
  goalConfig.modules.forEach((moduleName, index) => {
    const module = mockData.modules.find(m => m.name.includes(moduleName.split(' ')[0]));
    if (module && !completedModuleNames.includes(module.name)) {
      recommendations.push({
        id: recommendations.length + 1,
        type: 'module',
        title: `Complete "${module.name}"`,
        description: `This module is essential for your ${careerGoal.replace(/_/g, ' ')} career path`,
        priority: index === 0 ? 'high' : 'medium',
        reason: `Core module for ${careerGoal.replace(/_/g, ' ')}`,
        action_url: `/modules/${module.id}`,
        created_at: new Date().toISOString(),
      });
    }
  });

  // Recommend electives based on career goal
  goalConfig.electives.forEach((elective, index) => {
    if (recommendations.length < 5) {
      recommendations.push({
        id: recommendations.length + 1,
        type: 'elective',
        title: `Consider "${elective}" as an elective`,
        description: `This elective aligns well with your career goal`,
        priority: index === 0 ? 'high' : 'low',
        reason: `Recommended elective for ${careerGoal.replace(/_/g, ' ')}`,
        action_url: '/modules?category=elective',
        created_at: new Date().toISOString(),
      });
    }
  });

  // Add skill recommendations
  goalConfig.skills.forEach((skill, index) => {
    if (recommendations.length < 6) {
      recommendations.push({
        id: recommendations.length + 1,
        type: 'skill',
        title: `Develop "${skill}" skills`,
        description: `This skill is highly valued for ${careerGoal.replace(/_/g, ' ')} positions`,
        priority: 'medium',
        reason: `Key skill for your career goal`,
        action_url: '/resources',
        created_at: new Date().toISOString(),
      });
    }
  });

  // Add event recommendations from mock data
  mockData.recommendations
    .filter(r => r.type === 'event' || r.type === 'deadline')
    .forEach(r => {
      recommendations.push({
        ...r,
        id: recommendations.length + 1,
      });
    });

  return recommendations;
};

export const recommendationService = {
  /**
   * Get personalized recommendations based on career goal
   */
  getRecommendations: async (userId = 1) => {
    await delay(900);

    // Get user's career goal and completed modules from store
    const user = store.getUser();
    const modules = store.getModules() || mockData.modules;
    const completedModules = modules.filter(m => m.completed);

    const careerGoal = user?.careerGoal || 'software_engineer';

    return generateRecommendations(careerGoal, completedModules);
  },

  /**
   * Get recommendations by type
   */
  getRecommendationsByType: async (type) => {
    await delay(700);
    const allRecs = await recommendationService.getRecommendations();
    return allRecs.filter(r => r.type === type);
  },

  /**
   * Get high priority recommendations
   */
  getHighPriorityRecommendations: async () => {
    await delay(600);
    const allRecs = await recommendationService.getRecommendations();
    return allRecs.filter(r => r.priority === 'high');
  },

  /**
   * Get recommendations for a specific career goal (preview)
   */
  getRecommendationsForGoal: async (careerGoal) => {
    await delay(500);
    const modules = store.getModules() || mockData.modules;
    const completedModules = modules.filter(m => m.completed);
    return generateRecommendations(careerGoal, completedModules);
  },
};

export default recommendationService;
