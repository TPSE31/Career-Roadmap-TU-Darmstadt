import mockData from '../mocks/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const shouldSimulateError = () => Math.random() < 0.1;

export const roadmapService = {
  /**
   * Get user's roadmap
   */
  getUserRoadmap: async (userId = 1) => {
    await delay(1000);
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch roadmap');
    }
    
    return mockData.roadmap;
  },

  /**
   * Get current phase details
   */
  getCurrentPhase: async (userId = 1) => {
    await delay(600);
    const roadmap = mockData.roadmap;
    return roadmap.phases.find(p => p.status === 'in_progress');
  },

  /**
   * Get next recommended modules
   */
  getNextRecommendedModules: async (userId = 1) => {
    await delay(700);
    return mockData.modules.filter(m => !m.completed).slice(0, 3);
  },
};

export default roadmapService;
