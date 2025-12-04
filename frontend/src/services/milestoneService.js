import mockData from '../mocks/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const shouldSimulateError = () => Math.random() < 0.1;

export const milestoneService = {
  /**
   * Get all milestones
   */
  getAllMilestones: async () => {
    await delay(700);
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch milestones');
    }
    
    return mockData.milestones;
  },

  /**
   * Get upcoming milestones (not completed)
   */
  getUpcomingMilestones: async () => {
    await delay(600);
    return mockData.milestones.filter(m => !m.completed);
  },

  /**
   * Get completed milestones
   */
  getCompletedMilestones: async () => {
    await delay(600);
    return mockData.milestones.filter(m => m.completed);
  },

  /**
   * Update milestone status (simulated)
   */
  updateMilestoneStatus: async (milestoneId, completed) => {
    await delay(500);
    
    console.log(`Mock: Updated milestone ${milestoneId} to ${completed ? 'completed' : 'not completed'}`);
    
    return {
      success: true,
      message: 'Milestone updated successfully'
    };
  },
};

export default milestoneService;
