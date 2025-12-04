import mockData from '../mocks/mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random errors (10% chance) for testing
const shouldSimulateError = () => Math.random() < 0.1;

export const moduleService = {
  /**
   * Get all modules
   */
  getAllModules: async () => {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch modules');
    }
    
    return mockData.modules;
  },

  /**
   * Get a single module by ID
   */
  getModuleById: async (id) => {
    await delay(500);
    
    const module = mockData.modules.find(m => m.id === parseInt(id));
    
    if (!module) {
      throw new Error(`Module with ID ${id} not found`);
    }
    
    return module;
  },

  /**
   * Get completed modules
   */
  getCompletedModules: async () => {
    await delay(600);
    return mockData.modules.filter(m => m.completed);
  },

  /**
   * Get modules by category
   */
  getModulesByCategory: async (category) => {
    await delay(600);
    return mockData.modules.filter(m => 
      m.category.toLowerCase() === category.toLowerCase()
    );
  },
};

export default moduleService;
