import api from './api';
import store from './store';
import mockData from '../mocks/mockData';

// Flag to use mock data when backend is not ready
const USE_MOCK = false;

// Simulate API delay for mock data
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize store with mock data on first load
const initializeStore = () => {
  if (!store.getModules()) {
    store.setModules(mockData.modules);
  }
  if (!store.getMilestones()) {
    store.setMilestones(mockData.milestones);
  }
};

/**
 * Get user profile and progress
 * Now reads from localStorage store with fallback to mock data
 */
export const getUserProgress = async () => {
  if (USE_MOCK) {
    await delay(600);
    initializeStore();

    // Get modules from store to calculate credits dynamically
    const modules = store.getModules() || mockData.modules;
    const completedModules = modules.filter(m => m.completed);
    const totalCredits = completedModules.reduce((sum, m) => sum + (m.credits || 0), 0);

    return {
      ...mockData.userProgress,
      total_credits: totalCredits,
      completed_modules: completedModules.length,
      in_progress_modules: modules.filter(m => !m.completed).length,
      completion_percentage: Math.round((totalCredits / 180) * 100),
      onTrackStatus: mockData.userProgress.on_track ? 'on_track' : 'at_risk',
    };
  }

  // Use /auth/me/ to get user data including credits
  const response = await api.get('/auth/me/');
  const user = response.data;
  return {
    studentName: `${user.first_name} ${user.last_name}`,
    studentId: user.matriculation_number,
    program: user.program,
    currentSemester: user.semester,
    totalCredits: user.total_credits,
    completionPercentage: Math.round((user.total_credits / 180) * 100),
    expectedGraduation: 'TBD',
    onTrackStatus: user.total_credits >= (user.semester * 30) ? 'on_track' : 'at_risk',
  };
};

/**
 * Get user statistics summary
 * Calculates from stored data instead of hardcoded values
 */
export const getUserStats = async () => {
  if (USE_MOCK) {
    await delay(500);
    initializeStore();

    const progress = mockData.userProgress;
    const modules = store.getModules() || mockData.modules;
    const milestones = store.getMilestones() || mockData.milestones;

    const completedModules = modules.filter(m => m.completed);
    const upcomingMilestones = milestones.filter(m => !m.completed);

    // Calculate credits dynamically from completed modules
    const totalCredits = completedModules.reduce((sum, m) => sum + (m.credits || 0), 0);
    const completionPercentage = Math.round((totalCredits / 180) * 100);

    return {
      totalCredits,
      requiredCredits: 180,
      completedModulesCount: completedModules.length,
      totalModulesCount: modules.length,
      upcomingMilestonesCount: upcomingMilestones.length,
      onTrack: progress.on_track,
      completionPercentage,
      currentSemester: progress.current_semester,
      expectedGraduation: progress.expected_graduation,
    };
  }

  // Use /auth/me/ to get user stats
  const response = await api.get('/auth/me/');
  const user = response.data;
  return {
    totalCredits: user.total_credits,
    requiredCredits: 180,
    completedModulesCount: 0, // Would need separate call to get this
    totalModulesCount: 0,
    upcomingMilestonesCount: 0,
    onTrack: user.total_credits >= (user.semester * 30),
    completionPercentage: Math.round((user.total_credits / 180) * 100),
    currentSemester: user.semester,
    expectedGraduation: 'TBD',
  };
};

/**
 * Get user's career goals
 */
export const getCareerGoals = async () => {
  if (USE_MOCK) {
    await delay(400);
    return [
      {
        id: 1,
        goalType: 'industry',
        title: 'Machine Learning Engineer',
        description: 'Build ML systems at a tech company',
        tags: ['AI', 'Machine Learning', 'Python'],
        isActive: true,
      }
    ];
  }

  const response = await api.get('/user/career-goals/');
  return response.data.map(transformCareerGoalFromAPI);
};

/**
 * Create or update career goal
 */
export const updateCareerGoal = async (goalData) => {
  if (USE_MOCK) {
    await delay(500);
    console.log('Mock: Updated career goal:', goalData);
    return {
      id: goalData.id || 1,
      ...goalData,
      isActive: true,
    };
  }

  const payload = {
    goal_type: goalData.goalType,
    title: goalData.title,
    description: goalData.description,
    tags: goalData.tags,
    is_active: true,
  };

  const response = goalData.id
    ? await api.patch(`/user/career-goals/${goalData.id}/`, payload)
    : await api.post('/user/career-goals/', payload);

  return transformCareerGoalFromAPI(response.data);
};

/**
 * Delete career goal
 */
export const deleteCareerGoal = async (goalId) => {
  if (USE_MOCK) {
    await delay(300);
    return { success: true };
  }

  await api.delete(`/user/career-goals/${goalId}/`);
  return { success: true };
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  if (USE_MOCK) {
    await delay(500);
    console.log('Mock: Updated profile:', profileData);
    return { success: true, ...profileData };
  }

  const response = await api.patch('/user/profile/', {
    program: profileData.program,
    semester: profileData.semester,
  });
  return response.data;
};

/**
 * Get available career goal options
 */
export const getCareerGoalOptions = () => {
  return [
    { value: 'software_engineer', label: 'Software Engineer' },
    { value: 'data_scientist', label: 'Data Scientist' },
    { value: 'ml_engineer', label: 'Machine Learning Engineer' },
    { value: 'backend_developer', label: 'Backend Developer' },
    { value: 'frontend_developer', label: 'Frontend Developer' },
    { value: 'fullstack_developer', label: 'Full Stack Developer' },
    { value: 'devops_engineer', label: 'DevOps Engineer' },
    { value: 'security_engineer', label: 'Security Engineer' },
    { value: 'research_scientist', label: 'Research Scientist' },
    { value: 'product_manager', label: 'Product Manager' },
    { value: 'consultant', label: 'IT Consultant' },
    { value: 'startup_founder', label: 'Startup Founder' },
    { value: 'academia', label: 'Academic/Professor' },
    { value: 'undecided', label: 'Still Deciding' },
  ];
};

/**
 * Transform user progress from API
 */
const transformUserProgressFromAPI = (apiData) => ({
  studentName: apiData.student_name,
  studentId: apiData.student_id,
  program: apiData.program,
  currentSemester: apiData.current_semester,
  totalCredits: apiData.total_credits,
  completionPercentage: apiData.completion_percentage,
  expectedGraduation: apiData.expected_graduation,
  onTrackStatus: apiData.on_track_status,
  careerGoal: apiData.career_goal,
});

/**
 * Transform career goal from API
 */
const transformCareerGoalFromAPI = (apiGoal) => ({
  id: apiGoal.id,
  goalType: apiGoal.goal_type,
  title: apiGoal.title,
  description: apiGoal.description,
  tags: apiGoal.tags,
  isActive: apiGoal.is_active,
  createdAt: apiGoal.created_at,
});

export default {
  getUserProgress,
  getUserStats,
  getCareerGoals,
  updateCareerGoal,
  deleteCareerGoal,
  updateProfile,
  getCareerGoalOptions,
};
