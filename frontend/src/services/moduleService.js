import api from './api';
import mockData from '../mocks/mockData';

// Flag to use mock data when backend is not ready
const USE_MOCK = true;

// Simulate API delay for mock data
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all modules for the current user's examination regulation
 */
export const getAllModules = async () => {
  if (USE_MOCK) {
    await delay(600);
    return mockData.modules.map(transformModuleToFrontend);
  }

  const response = await api.get('/modules/');
  return response.data.map(transformModuleFromAPI);
};

/**
 * Get a single module by ID
 */
export const getModuleById = async (id) => {
  if (USE_MOCK) {
    await delay(400);
    const module = mockData.modules.find(m => m.id === parseInt(id));
    if (!module) {
      throw new Error(`Module with ID ${id} not found`);
    }
    return transformModuleToFrontend(module);
  }

  const response = await api.get(`/modules/${id}/`);
  return transformModuleFromAPI(response.data);
};

/**
 * Get user's module completions (which modules user has completed)
 */
export const getUserModuleCompletions = async () => {
  if (USE_MOCK) {
    await delay(500);
    // Return modules with their completion status
    return mockData.modules.map(m => ({
      ...transformModuleToFrontend(m),
      status: m.completed ? 'completed' : 'not_started',
      completedAt: m.completed ? '2024-01-15T10:00:00Z' : null,
    }));
  }

  const response = await api.get('/user/module-completions/');
  return response.data.map(transformCompletionFromAPI);
};

/**
 * Update module completion status
 */
export const updateModuleCompletion = async (moduleId, status) => {
  if (USE_MOCK) {
    await delay(400);
    console.log(`Mock: Updated module ${moduleId} to status: ${status}`);
    return { success: true, moduleId, status };
  }

  const response = await api.post('/user/module-completions/', {
    module_id: moduleId,
    status: status, // 'not_started', 'in_progress', 'completed', 'failed'
  });
  return response.data;
};

/**
 * Get modules by category
 */
export const getModulesByCategory = async (category) => {
  if (USE_MOCK) {
    await delay(500);
    return mockData.modules
      .filter(m => m.category.toLowerCase() === category.toLowerCase())
      .map(transformModuleToFrontend);
  }

  const response = await api.get('/modules/', {
    params: { category }
  });
  return response.data.map(transformModuleFromAPI);
};

/**
 * Get completed modules count and total credits
 */
export const getCompletionStats = async () => {
  if (USE_MOCK) {
    await delay(400);
    const completedModules = mockData.modules.filter(m => m.completed);
    const totalCredits = completedModules.reduce((sum, m) => sum + m.credits, 0);
    return {
      completedCount: completedModules.length,
      totalCount: mockData.modules.length,
      earnedCredits: totalCredits,
      requiredCredits: 180,
    };
  }

  const response = await api.get('/user/completion-stats/');
  return {
    completedCount: response.data.completed_count,
    totalCount: response.data.total_count,
    earnedCredits: response.data.earned_credits,
    requiredCredits: response.data.required_credits,
  };
};

/**
 * Transform module from mock data format to frontend format
 */
const transformModuleToFrontend = (module) => ({
  id: module.id,
  moduleCode: module.code || `MOD-${module.id}`,
  name: module.name,
  credits: module.credits,
  category: module.category,
  description: module.description || '',
  semester: module.semester,
  prerequisites: module.prerequisites || [],
  completed: module.completed || false,
});

/**
 * Transform module from API (snake_case to camelCase)
 */
const transformModuleFromAPI = (apiModule) => ({
  id: apiModule.id,
  moduleCode: apiModule.module_code,
  name: apiModule.name,
  credits: apiModule.credits,
  category: apiModule.category,
  groupName: apiModule.group_name,
  description: apiModule.description,
  prerequisites: apiModule.prerequisites || [],
});

/**
 * Transform completion from API
 */
const transformCompletionFromAPI = (apiCompletion) => ({
  id: apiCompletion.id,
  moduleId: apiCompletion.module,
  moduleCode: apiCompletion.module_code,
  moduleName: apiCompletion.module_name,
  credits: apiCompletion.module_credits,
  status: apiCompletion.status,
  completedAt: apiCompletion.completed_at,
  grade: apiCompletion.grade,
  semesterTaken: apiCompletion.semester_taken,
});

export default {
  getAllModules,
  getModuleById,
  getUserModuleCompletions,
  updateModuleCompletion,
  getModulesByCategory,
  getCompletionStats,
};
