import api from './api';
import mockData from '../mocks/mockData';

// Flag to use mock data when backend is not ready
const USE_MOCK = false;

// Simulate API delay for mock data
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock milestone definitions matching backend model
const mockMilestoneDefinitions = [
  {
    id: 1,
    orderIndex: 1,
    type: 'onboarding',
    label: 'Account Created',
    description: 'You have successfully created your Career Roadmap account.',
    rulePayload: {},
    expectedBySemester: 1,
  },
  {
    id: 2,
    orderIndex: 2,
    type: 'cp_threshold',
    label: '30 CP Earned',
    description: 'Complete modules worth 30 credit points to reach this milestone.',
    rulePayload: { cp_required: 30 },
    expectedBySemester: 2,
  },
  {
    id: 3,
    orderIndex: 3,
    type: 'cp_threshold',
    label: '60 CP Earned',
    description: 'Complete modules worth 60 credit points to reach this milestone.',
    rulePayload: { cp_required: 60 },
    expectedBySemester: 3,
  },
  {
    id: 4,
    orderIndex: 4,
    type: 'module_group',
    label: 'Core Modules Complete',
    description: 'Complete all mandatory core modules for your program.',
    rulePayload: { module_group: 'mandatory' },
    expectedBySemester: 4,
  },
  {
    id: 5,
    orderIndex: 5,
    type: 'cp_threshold',
    label: '90 CP Earned',
    description: 'Complete modules worth 90 credit points to reach this milestone.',
    rulePayload: { cp_required: 90 },
    expectedBySemester: 4,
  },
  {
    id: 6,
    orderIndex: 6,
    type: 'career_goal',
    label: 'Choose Specialization',
    description: 'Select your career goal and specialization path.',
    rulePayload: {},
    expectedBySemester: 4,
  },
  {
    id: 7,
    orderIndex: 7,
    type: 'cp_threshold',
    label: '120 CP Earned',
    description: 'Complete modules worth 120 credit points to reach this milestone.',
    rulePayload: { cp_required: 120 },
    expectedBySemester: 5,
  },
  {
    id: 8,
    orderIndex: 8,
    type: 'thesis',
    label: 'Thesis Ready',
    description: 'You have completed all prerequisites and are ready to start your thesis.',
    rulePayload: { cp_required: 150 },
    expectedBySemester: 5,
  },
  {
    id: 9,
    orderIndex: 9,
    type: 'completion',
    label: 'Degree Complete',
    description: 'Congratulations! You have completed all requirements for your degree.',
    rulePayload: { cp_required: 180 },
    expectedBySemester: 6,
  },
];

/**
 * Get all milestone definitions for the user's examination regulation
 */
export const getMilestoneDefinitions = async () => {
  if (USE_MOCK) {
    await delay(500);
    return mockMilestoneDefinitions;
  }

  const response = await api.get('/milestones/');
  return response.data.map(transformMilestoneFromAPI);
};

/**
 * Get user's milestone progress (status for each milestone)
 */
export const getUserMilestoneProgress = async () => {
  if (USE_MOCK) {
    await delay(600);
    // Simulate user progress - first 3 milestones completed
    return mockMilestoneDefinitions.map((milestone, index) => ({
      ...milestone,
      status: index < 2 ? 'completed' : index === 2 ? 'in_progress' : 'locked',
      achievedAt: index < 2 ? '2024-01-15T10:00:00Z' : null,
      computedExplanation: getExplanation(milestone, index),
    }));
  }

  const response = await api.get('/user/milestones/');
  return response.data.map(transformProgressFromAPI);
};

/**
 * Get on-track status for the user
 */
export const getOnTrackStatus = async () => {
  if (USE_MOCK) {
    await delay(400);
    const earnedCP = mockData.userProgress?.total_credits || 63;
    const currentSemester = mockData.userProgress?.current_semester || 3;
    const expectedCP = currentSemester * 30; // 30 CP per semester target

    let status, message, actions;

    if (earnedCP >= expectedCP) {
      status = 'on_track';
      message = 'Great! You are on schedule for your expected graduation.';
      actions = ['Continue with your current pace', 'Consider taking electives'];
    } else if (earnedCP >= expectedCP - 15) {
      status = 'at_risk';
      message = `You are ${expectedCP - earnedCP} CP behind schedule.`;
      actions = ['Complete 2 more modules this semester', 'Visit study counseling'];
    } else {
      status = 'off_track';
      message = `You need to catch up. You are ${expectedCP - earnedCP} CP behind.`;
      actions = ['Schedule a meeting with study advisor', 'Consider taking summer courses'];
    }

    return {
      status,
      message,
      earnedCredits: earnedCP,
      expectedCredits: expectedCP,
      currentSemester,
      expectedGraduation: 'September 2026',
      recommendedActions: actions,
    };
  }

  const response = await api.get('/user/on-track-status/');
  return {
    status: response.data.status,
    message: response.data.message,
    earnedCredits: response.data.earned_credits,
    expectedCredits: response.data.expected_credits,
    currentSemester: response.data.current_semester,
    expectedGraduation: response.data.expected_graduation,
    recommendedActions: response.data.recommended_actions,
  };
};

/**
 * Update milestone progress (mark as completed, etc.)
 */
export const updateMilestoneProgress = async (milestoneId, status) => {
  if (USE_MOCK) {
    await delay(400);
    console.log(`Mock: Updated milestone ${milestoneId} to status: ${status}`);
    return { success: true, milestoneId, status };
  }

  const response = await api.patch(`/user/milestone-progress/${milestoneId}/`, {
    status,
  });
  return response.data;
};

/**
 * Get upcoming milestones (not completed)
 */
export const getUpcomingMilestones = async () => {
  const progress = await getUserMilestoneProgress();
  return progress.filter(m => m.status !== 'completed');
};

/**
 * Get completed milestones
 */
export const getCompletedMilestones = async () => {
  const progress = await getUserMilestoneProgress();
  return progress.filter(m => m.status === 'completed');
};

/**
 * Helper function to generate explanation text
 */
const getExplanation = (milestone, index) => {
  if (index < 2) return 'Completed';
  if (index === 2) return '45/60 CP completed (75%)';
  if (milestone.type === 'cp_threshold') {
    return `0/${milestone.rulePayload.cp_required} CP`;
  }
  return 'Not started';
};

/**
 * Transform milestone definition from API
 */
const transformMilestoneFromAPI = (apiMilestone) => ({
  id: apiMilestone.id,
  orderIndex: apiMilestone.order_index,
  type: apiMilestone.type,
  label: apiMilestone.label,
  description: apiMilestone.description,
  rulePayload: apiMilestone.rule_payload,
  expectedBySemester: apiMilestone.expected_by_semester,
  expectedByDate: apiMilestone.expected_by_date,
});

/**
 * Transform milestone progress from API
 */
const transformProgressFromAPI = (apiProgress) => ({
  id: apiProgress.milestone || apiProgress.id,
  orderIndex: apiProgress.milestone_order || apiProgress.order_index,
  type: apiProgress.milestone_type || apiProgress.type,
  label: apiProgress.milestone_label || apiProgress.label,
  description: apiProgress.milestone_description || apiProgress.description,
  rulePayload: apiProgress.rule_payload || {},
  expectedBySemester: apiProgress.expected_by_semester,
  status: apiProgress.status,
  achievedAt: apiProgress.achieved_at,
  computedExplanation: apiProgress.computed_explanation,
});

// Aliases for backward compatibility
export const getAllMilestones = getUserMilestoneProgress;
export const updateMilestoneStatus = updateMilestoneProgress;

export default {
  getMilestoneDefinitions,
  getUserMilestoneProgress,
  getOnTrackStatus,
  updateMilestoneProgress,
  getUpcomingMilestones,
  getCompletedMilestones,
  // Aliases
  getAllMilestones: getUserMilestoneProgress,
  updateMilestoneStatus: updateMilestoneProgress,
};
