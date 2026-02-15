import api from './api';

const careerOfferService = {
  /**
   * Get all career offers
   * @returns {Promise<Array>} List of all active career offers
   */
  async getCareerOffers() {
    const response = await api.get('/career-offers/');
    return response.data;
  },

  /**
   * Get career offers filtered by career field
   * @param {string} careerField - The career field to filter by (e.g., 'industry', 'research')
   * @returns {Promise<Array>} List of career offers for the specified field
   */
  async getCareerOffersByField(careerField) {
    const response = await api.get(`/career-offers/by_career_field/?field=${careerField}`);
    return response.data;
  },
};

export default careerOfferService;
