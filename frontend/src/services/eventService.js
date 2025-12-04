import mockData from '../mocks/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const shouldSimulateError = () => Math.random() < 0.1;

export const eventService = {
  /**
   * Get all events
   */
  getAllEvents: async () => {
    await delay(700);
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch events');
    }
    
    return mockData.events;
  },

  /**
   * Get upcoming events
   */
  getUpcomingEvents: async () => {
    await delay(600);
    const today = new Date();
    return mockData.events.filter(e => new Date(e.date) >= today);
  },

  /**
   * Register for event (simulated)
   */
  registerForEvent: async (eventId, userId = 1) => {
    await delay(500);
    
    console.log(`Mock: User ${userId} registered for event ${eventId}`);
    
    return {
      success: true,
      message: 'Successfully registered for event'
    };
  },
};

export default eventService;
