import api from './api';

// Flag to use mock data when backend is not ready
const USE_MOCK = false;

// Simulate API delay for mock data
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock support services matching backend model
const mockSupportServices = [
  {
    id: 1,
    name: 'Study Counseling (Studienberatung)',
    category: 'academic',
    description: 'Get advice on course planning, study strategies, and academic challenges. The study counselors can help you create a personalized study plan.',
    contactInfo: {
      email: 'studienberatung@tu-darmstadt.de',
      phone: '+49 6151 16-25800',
      officeHours: 'Mon-Thu 9:00-12:00, 13:00-15:00',
    },
    url: 'https://www.tu-darmstadt.de/studienberatung',
    location: 'S1|01 Room 123, Karolinenplatz 5',
    isActive: true,
  },
  {
    id: 2,
    name: 'Career Service',
    category: 'career',
    description: 'Career counseling, CV reviews, interview preparation, and job search support. They also organize career fairs and company presentations.',
    contactInfo: {
      email: 'career@tu-darmstadt.de',
      phone: '+49 6151 16-25801',
      officeHours: 'Mon-Fri 10:00-16:00',
    },
    url: 'https://www.tu-darmstadt.de/career',
    location: 'S1|01 Room 456',
    isActive: true,
  },
  {
    id: 3,
    name: 'Psychological Counseling',
    category: 'counseling',
    description: 'Confidential support for personal issues, stress management, exam anxiety, and other psychological challenges.',
    contactInfo: {
      email: 'psychologische-beratung@studwerk.tu-darmstadt.de',
      phone: '+49 6151 16-25802',
      officeHours: 'By appointment',
    },
    url: 'https://www.studierendenwerk-darmstadt.de/beratung',
    location: 'Mensa Building, 2nd Floor',
    isActive: true,
  },
  {
    id: 4,
    name: 'International Student Office',
    category: 'international',
    description: 'Support for international students including visa matters, integration programs, and German language courses.',
    contactInfo: {
      email: 'international@tu-darmstadt.de',
      phone: '+49 6151 16-25803',
      officeHours: 'Mon-Fri 9:00-12:00',
    },
    url: 'https://www.tu-darmstadt.de/international',
    location: 'S1|03 Room 12',
    isActive: true,
  },
  {
    id: 5,
    name: 'Financial Aid Office (BAfoG)',
    category: 'financial',
    description: 'Information about student financial aid, scholarships, and emergency funding options.',
    contactInfo: {
      email: 'bafoeg@studwerk.tu-darmstadt.de',
      phone: '+49 6151 16-25804',
      officeHours: 'Tue-Thu 9:00-12:00',
    },
    url: 'https://www.studierendenwerk-darmstadt.de/bafoeg',
    location: 'Mensa Building, Ground Floor',
    isActive: true,
  },
  {
    id: 6,
    name: 'Exam Office (Prufungssekretariat)',
    category: 'administrative',
    description: 'Handle exam registrations, grade inquiries, and official transcripts. Contact them for any examination-related administrative matters.',
    contactInfo: {
      email: 'pruefungssekretariat@informatik.tu-darmstadt.de',
      phone: '+49 6151 16-25805',
      officeHours: 'Mon, Wed 10:00-12:00',
    },
    url: 'https://www.informatik.tu-darmstadt.de/pruefungssekretariat',
    location: 'S2|02 Room 201',
    isActive: true,
  },
];

/**
 * Get all support services
 */
export const getSupportServices = async () => {
  if (USE_MOCK) {
    await delay(500);
    return mockSupportServices.filter(s => s.isActive);
  }

  const response = await api.get('/support/services/');
  return response.data.map(transformSupportServiceFromAPI);
};

/**
 * Get support service by ID
 */
export const getSupportServiceById = async (id) => {
  if (USE_MOCK) {
    await delay(300);
    const service = mockSupportServices.find(s => s.id === parseInt(id));
    if (!service) {
      throw new Error('Support service not found');
    }
    return service;
  }

  const response = await api.get(`/support/services/${id}/`);
  return transformSupportServiceFromAPI(response.data);
};

/**
 * Get support services by category
 */
export const getSupportServicesByCategory = async (category) => {
  if (USE_MOCK) {
    await delay(400);
    return mockSupportServices.filter(
      s => s.category === category && s.isActive
    );
  }

  const response = await api.get('/support/services/', {
    params: { category }
  });
  return response.data.map(transformSupportServiceFromAPI);
};

/**
 * Get all available categories
 */
export const getCategories = () => {
  return [
    { value: 'academic', label: 'Academic Support', icon: 'book' },
    { value: 'career', label: 'Career Services', icon: 'briefcase' },
    { value: 'counseling', label: 'Counseling', icon: 'heart' },
    { value: 'administrative', label: 'Administrative', icon: 'file' },
    { value: 'financial', label: 'Financial Aid', icon: 'euro' },
    { value: 'health', label: 'Health Services', icon: 'plus' },
    { value: 'international', label: 'International Office', icon: 'globe' },
    { value: 'other', label: 'Other', icon: 'info' },
  ];
};

/**
 * Transform support service from API (snake_case to camelCase)
 */
const transformSupportServiceFromAPI = (apiService) => ({
  id: apiService.id,
  name: apiService.name,
  category: apiService.category,
  description: apiService.description,
  contactInfo: apiService.contact_info,
  url: apiService.url,
  location: apiService.location,
  isActive: apiService.is_active,
  relatedMilestones: apiService.related_milestones || [],
});

export default {
  getSupportServices,
  getSupportServiceById,
  getSupportServicesByCategory,
  getCategories,
};
