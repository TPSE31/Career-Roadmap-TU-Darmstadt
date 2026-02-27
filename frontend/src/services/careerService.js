import api from './api';
import { careerPaths as localCareerPaths } from '../data/careerPaths';

/**
 * Service for managing career paths and user career interests
 */
export const careerService = {
  /**
   * Get all available career paths
   * Falls back to local data if backend is unavailable
   */
  getCareerPaths: async () => {
    try {
      const response = await api.get('/careers/');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using local career data');
      // Return local data formatted to match API response
      return localCareerPaths.map((career, index) => ({
        ...career,
        career_id: career.id,
        id: index + 1,
        salary_range: `${(career.average_salary?.junior / 1000).toFixed(0)}k - ${(career.average_salary?.senior / 1000).toFixed(0)}k €`,
        module_count: career.recommended_modules?.length || 0,
      }));
    }
  },

  /**
   * Get a specific career path with detailed module information
   */
  getCareerPath: async (careerId) => {
    try {
      const response = await api.get(`/careers/${careerId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching career path:', error);
      throw error;
    }
  },

  /**
   * Get modules relevant to a specific career path
   */
  getCareerModules: async (careerId) => {
    try {
      const response = await api.get(`/careers/${careerId}/modules/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching career modules:', error);
      throw error;
    }
  },

  /**
   * Get user's career interests
   */
  getUserCareerInterests: async () => {
    try {
      const response = await api.get('/user/career-interests/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user career interests:', error);
      throw error;
    }
  },

  /**
   * Set user's career interests (replaces existing)
   * @param {Array} interests - Array of {career_id, interest_level, is_primary}
   */
  setUserCareerInterests: async (interests) => {
    try {
      const response = await api.post('/user/career-interests/set-interests/', {
        interests
      });
      return response.data;
    } catch (error) {
      console.error('Error setting career interests:', error);
      throw error;
    }
  },

  /**
   * Add a single career interest
   */
  addCareerInterest: async (careerPathId, interestLevel = 50, isPrimary = false) => {
    try {
      const response = await api.post('/user/career-interests/', {
        career_path: careerPathId,
        interest_level: interestLevel,
        is_primary: isPrimary
      });
      return response.data;
    } catch (error) {
      console.error('Error adding career interest:', error);
      throw error;
    }
  },

  /**
   * Remove a career interest
   */
  removeCareerInterest: async (interestId) => {
    try {
      await api.delete(`/user/career-interests/${interestId}/`);
      return true;
    } catch (error) {
      console.error('Error removing career interest:', error);
      throw error;
    }
  },

  /**
   * Get recommendations based on user's career interests
   */
  getRecommendations: async (limit = 10) => {
    try {
      const response = await api.get('/recommendations/', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  /**
   * Get TU Darmstadt CS Department Master's programs and double degree info
   */
  getMasterPrograms: async () => {
    try {
      const response = await api.get('/master-programs/');
      return response.data;
    } catch (error) {
      console.error('Error fetching master programs:', error);
      throw error;
    }
  }
};

export default careerService;
