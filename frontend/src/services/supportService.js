import mockData from '../mocks/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const shouldSimulateError = () => Math.random() < 0.1;

export const supportService = {
  /**
   * Get all support services
   */
  getAllSupportServices: async () => {
    await delay(700);
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch support services');
    }
    
    return mockData.supportServices;
  },

  /**
   * Get support services by category
   */
  getSupportServicesByCategory: async (category) => {
    await delay(600);
    return mockData.supportServices.filter(s => 
      s.category.toLowerCase() === category.toLowerCase()
    );
  },
};

export default supportService;
