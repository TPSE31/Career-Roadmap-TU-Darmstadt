import api from './api';
import mockData from '../mocks/mockData';
import { allModules as localModules } from '../data/modules';

// Flag to use mock data when backend is not ready
const USE_MOCK = false;

// Simulate API delay for mock data
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all modules for the current user's examination regulation
 * Falls back to local data if backend is unavailable
 */
export const getAllModules = async () => {
  if (USE_MOCK) {
    await delay(600);
    return mockData.modules.map(transformModuleToFrontend);
  }

  try {
    const response = await api.get('/modules/');
    return response.data.map(transformModuleFromAPI);
  } catch (error) {
    console.warn('API unavailable, using local module data');
    // Return local modules directly - they already have the right format
    return localModules.map(m => ({
      ...m,
      prerequisites: m.prerequisites || [],
    }));
  }
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

  const response = await api.get('/user/modules/');
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

  // Mark module as completed or uncompleted
  if (status === 'completed') {
    const response = await api.post(`/user/modules/${moduleId}/complete/`);
    return response.data;
  } else {
    const response = await api.delete(`/user/modules/${moduleId}/complete/`);
    return response.data;
  }
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
 * Transform module from API to the format components expect
 */
const transformModuleFromAPI = (apiModule) => ({
  id: apiModule.id,
  code: apiModule.module_code,
  moduleCode: apiModule.module_code,
  name: apiModule.name,
  name_en: apiModule.name_en || '',
  credits: apiModule.credits,
  category: apiModule.category,
  groupName: apiModule.group_name,
  description: apiModule.description || '',
  semester: apiModule.semester || null,
  required: apiModule.category === 'Pflichtbereich',
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
