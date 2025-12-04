import mockData from '../mocks/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const shouldSimulateError = () => Math.random() < 0.1;

export const userService = {
  /**
   * Get user profile and progress
   */
  getUserProgress: async (userId = 1) => {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch user progress');
    }
    
    return mockData.userProgress;
  },

  /**
   * Get user statistics
   */
  getUserStats: async (userId = 1) => {
    await delay(600);
    
    const progress = mockData.userProgress;
    const completedModules = mockData.modules.filter(m => m.completed);
    const upcomingMilestones = mockData.milestones.filter(m => !m.completed);
    
    return {
      total_credits: progress.total_credits,
      completed_modules_count: completedModules.length,
      upcoming_milestones_count: upcomingMilestones.length,
      on_track: progress.on_track,
      completion_percentage: progress.completion_percentage
    };
  },

  /**
   * Update career goals (simulated)
   */
  updateCareerGoals: async (userId, goals) => {
    await delay(500);
    
    console.log(`Mock: Updated career goals for user ${userId}:`, goals);
    
    return {
      success: true,
      updated_goals: goals
    };
  },
};

export default userService;
