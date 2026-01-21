import api from './api';
import store from './store';
import mockData from '../mocks/mockData';
import emailjs from '@emailjs/browser';

// Flag to use mock data when backend is not ready
const USE_MOCK = true;

// Session duration in milliseconds (24 hours)
const SESSION_DURATION = 24 * 60 * 60 * 1000;

// EmailJS Configuration - Replace with your own credentials from https://www.emailjs.com/
const EMAILJS_CONFIG = {
  serviceId: 'service_careermap',    // Your EmailJS service ID
  templateId: 'template_resetpwd',   // Your EmailJS template ID
  publicKey: 'YOUR_PUBLIC_KEY',      // Your EmailJS public key
  enabled: false,                     // Set to true after configuring EmailJS
};

// Initialize EmailJS
if (EMAILJS_CONFIG.enabled && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

// Local storage key for persisting users
const USERS_STORAGE_KEY = 'career_roadmap_users';

// Default user for initial setup
const defaultUsers = [
  {
    id: 1,
    username: 'anna.schmidt',
    email: 'anna.schmidt@stud.tu-darmstadt.de',
    password: 'Test123!',
    firstName: 'Anna',
    lastName: 'Schmidt',
    program: 'Computer Science B.Sc.',
    semester: 3,
    matriculationNumber: '1234567',
    examinationRegulationId: 1,
    createdAt: '2024-10-01T10:00:00Z',
  },
];

// Load users from localStorage or use defaults
const loadUsersFromStorage = () => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading users from storage:', e);
  }
  return [...defaultUsers];
};

// Save users to localStorage
const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to storage:', e);
  }
};

// Mock user database (persisted to localStorage)
let mockUsers = loadUsersFromStorage();

// Mock token generator
const generateMockToken = (userId) => {
  return `mock_token_${userId}_${Date.now()}`;
};

/**
 * Register a new user
 * Now accepts completed modules and career goal
 */
export const register = async (userData) => {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Check if matriculation number already exists
    const existingMatrikel = mockUsers.find(u => u.matriculationNumber === userData.matriculationNumber);
    if (existingMatrikel) {
      throw new Error('This matriculation number is already registered');
    }

    // Calculate credits from completed modules
    const completedModuleIds = userData.completedModules || [];
    const completedModulesData = mockData.modules.filter(m => completedModuleIds.includes(m.id));
    const totalCredits = completedModulesData.reduce((sum, m) => sum + (m.credits || 0), 0);

    // Create new user with completed modules and career goal
    const newUser = {
      id: mockUsers.length + 1,
      username: userData.email.split('@')[0],
      email: userData.email,
      password: userData.password, // Store password for mock authentication
      firstName: userData.firstName,
      lastName: userData.lastName,
      program: userData.program || 'Computer Science B.Sc.',
      semester: userData.semester || 1,
      matriculationNumber: userData.matriculationNumber,
      examinationRegulationId: 1,
      createdAt: new Date().toISOString(),
      // New fields
      careerGoal: userData.careerGoal || null,
      completedModules: completedModuleIds,
      totalCredits: totalCredits,
    };

    mockUsers.push(newUser);
    saveUsersToStorage(mockUsers); // Persist to localStorage
    const token = generateMockToken(newUser.id);
    const expiresAt = new Date().getTime() + SESSION_DURATION;

    // Store auth state
    store.setAuth({
      token,
      userId: newUser.id,
      expiresAt
    });

    // Store user data
    store.setUser(newUser);

    // Store modules with completion status
    const modulesWithProgress = mockData.modules.map(m => ({
      ...m,
      completed: completedModuleIds.includes(m.id)
    }));
    store.setModules(modulesWithProgress);
    store.setMilestones(mockData.milestones);

    return {
      user: newUser,
      token,
    };
  }

  // Real API call
  const response = await api.post('/auth/register/', {
    email: userData.email,
    password: userData.password,
    first_name: userData.firstName,
    last_name: userData.lastName,
    matriculation_number: userData.matriculationNumber,
    program: userData.program,
    career_goal: userData.careerGoal,
    completed_modules: userData.completedModules,
  });

  return {
    user: transformUserFromAPI(response.data.user),
    token: response.data.token,
  };
};

/**
 * Login user
 * Only allows registered users to login with correct password
 */
export const login = async (email, password) => {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Only allow existing registered users to login
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      throw new Error('No account found with this email. Please sign up first.');
    }

    // Verify password
    if (user.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    const token = generateMockToken(user.id);
    const expiresAt = new Date().getTime() + SESSION_DURATION;

    // Store auth state in localStorage
    store.setAuth({
      token,
      userId: user.id,
      expiresAt
    });

    // Initialize user data in store
    store.setUser(user);

    // Load user's completed modules if stored
    const storedModules = store.getModules();
    if (!storedModules && user.completedModules) {
      // Mark user's completed modules
      const modulesWithProgress = mockData.modules.map(m => ({
        ...m,
        completed: user.completedModules.includes(m.id)
      }));
      store.setModules(modulesWithProgress);
    } else if (!storedModules) {
      store.setModules(mockData.modules);
    }

    store.setMilestones(mockData.milestones);

    return {
      user,
      token,
    };
  }

  // Real API call
  const response = await api.post('/auth/login/', {
    email,
    password,
  });

  return {
    user: transformUserFromAPI(response.data.user),
    token: response.data.token,
  };
};

/**
 * Logout user
 * Clears session from localStorage store
 */
export const logout = async (token) => {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Clear auth state from store
    store.clearAuth();

    return { success: true };
  }

  // Real API call
  await api.post('/auth/logout/', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });

  // Clear local auth state
  store.clearAuth();

  return { success: true };
};

/**
 * Get current user info
 */
export const getCurrentUser = async (token) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return the first mock user
    return mockUsers[0];
  }

  // Real API call
  const response = await api.get('/auth/me/', {
    headers: { Authorization: `Bearer ${token}` }
  });

  return transformUserFromAPI(response.data);
};

/**
 * Update user profile
 */
export const updateProfile = async (token, updates) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find and update mock user
    const userIndex = mockUsers.findIndex(u => u.id === 1);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      return mockUsers[userIndex];
    }
    throw new Error('User not found');
  }

  // Real API call
  const response = await api.patch('/auth/profile/', {
    first_name: updates.firstName,
    last_name: updates.lastName,
    program: updates.program,
    semester: updates.semester,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return transformUserFromAPI(response.data);
};

/**
 * Change password
 */
export const changePassword = async (token, currentPassword, newPassword) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }

  // Real API call
  await api.post('/auth/change-password/', {
    current_password: currentPassword,
    new_password: newPassword,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return { success: true };
};

// Mock storage for password reset tokens (for development)
const mockResetTokens = new Map();

/**
 * Request password reset - sends email with reset link
 * Uses EmailJS to send real emails if configured, otherwise shows link in UI
 */
export const requestPasswordReset = async (email) => {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find user by email
    const user = mockUsers.find(u => u.email === email);

    if (user) {
      // Generate reset token
      const resetToken = `reset_${user.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Store token with expiry (1 hour)
      mockResetTokens.set(resetToken, {
        userId: user.id,
        email: user.email,
        expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
      });

      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;

      // Try to send real email if EmailJS is configured
      if (EMAILJS_CONFIG.enabled && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        try {
          await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
              to_email: user.email,
              to_name: `${user.firstName} ${user.lastName}`,
              reset_link: resetLink,
              app_name: 'Career Roadmap',
            }
          );
          console.log('Password reset email sent to:', user.email);
          return { success: true, emailSent: true };
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // Fall back to showing link in UI
          return { success: true, mockResetLink: resetLink, emailError: true };
        }
      }

      // EmailJS not configured - return link for UI display
      console.log('Password reset link:', resetLink);
      return { success: true, mockResetLink: resetLink };
    }

    // User not found - still return success to prevent email enumeration
    return { success: true, mockResetLink: null };
  }

  // Real API call
  await api.post('/auth/forgot-password/', { email });
  return { success: true };
};

/**
 * Validate password reset token
 */
export const validateResetToken = async (token) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const tokenData = mockResetTokens.get(token);

    if (!tokenData) {
      throw new Error('Invalid reset token');
    }

    if (Date.now() > tokenData.expiresAt) {
      mockResetTokens.delete(token);
      throw new Error('Reset token has expired');
    }

    return { valid: true, email: tokenData.email };
  }

  // Real API call
  const response = await api.post('/auth/validate-reset-token/', { token });
  return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));

    const tokenData = mockResetTokens.get(token);

    if (!tokenData) {
      throw new Error('Invalid reset token');
    }

    if (Date.now() > tokenData.expiresAt) {
      mockResetTokens.delete(token);
      throw new Error('Reset token has expired');
    }

    // Update the user's password in mock database
    const userIndex = mockUsers.findIndex(u => u.id === tokenData.userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].password = newPassword;
      saveUsersToStorage(mockUsers); // Persist to localStorage
      console.log(`Password updated for user ${tokenData.email}`);
    }

    // Invalidate the token after use
    mockResetTokens.delete(token);

    return { success: true };
  }

  // Real API call
  await api.post('/auth/reset-password/', {
    token,
    new_password: newPassword,
  });

  return { success: true };
};

/**
 * Initialize auth service - check for existing session
 */
export const initialize = async () => {
  const auth = store.getAuth();

  if (auth.isAuthenticated && auth.expiresAt) {
    const isExpired = new Date().getTime() > auth.expiresAt;

    if (isExpired) {
      console.log('Session expired, clearing auth');
      store.clearAuth();
      return { isAuthenticated: false, user: null };
    }

    // Session valid, return stored user
    const user = store.getUser();
    if (user) {
      return { isAuthenticated: true, user };
    }
  }

  return { isAuthenticated: false, user: null };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const auth = store.getAuth();

  if (!auth.isAuthenticated) {
    return false;
  }

  if (auth.expiresAt && new Date().getTime() > auth.expiresAt) {
    store.clearAuth();
    return false;
  }

  return true;
};

/**
 * Get stored auth token
 */
export const getToken = () => {
  const auth = store.getAuth();
  return auth.token;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthChange = (callback) => {
  return store.subscribe('auth', callback);
};

/**
 * Transform user data from API (snake_case to camelCase)
 */
const transformUserFromAPI = (apiUser) => {
  return {
    id: apiUser.id,
    username: apiUser.username,
    email: apiUser.email,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    program: apiUser.program,
    semester: apiUser.semester,
    matriculationNumber: apiUser.matriculation_number,
    examinationRegulationId: apiUser.examination_regulation,
    createdAt: apiUser.created_at,
  };
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  requestPasswordReset,
  validateResetToken,
  resetPassword,
  initialize,
  isAuthenticated,
  getToken,
  onAuthChange,
};
