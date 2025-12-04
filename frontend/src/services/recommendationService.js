import mockData from '../mocks/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const shouldSimulateError = () => Math.random() < 0.1;

export const recommendationService = {
  /**
   * Get personalized recommendations
   */
  getRecommendations: async (userId = 1) => {
    await delay(900);
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch recommendations');
    }
    
    return mockData.recommendations;
  },

  /**
   * Get recommendations by type
   */
  getRecommendationsByType: async (type) => {
    await delay(700);
    return mockData.recommendations.filter(r => r.type === type);
  },

  /**
   * Get high priority recommendations
   */
  getHighPriorityRecommendations: async () => {
    await delay(600);
    return mockData.recommendations.filter(r => r.priority === 'high');
  },
};

export default recommendationService;
