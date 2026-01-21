// ============================================
// LocalStorage Mock Store
// Provides persistent state management for mock data
// ============================================

const STORAGE_KEYS = {
  USER: 'career_roadmap_user',
  AUTH: 'career_roadmap_auth',
  MODULES: 'career_roadmap_modules',
  MILESTONES: 'career_roadmap_milestones',
  SETTINGS: 'career_roadmap_settings',
};

// Safe localStorage wrapper (handles SSR and errors)
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to read ${key} from localStorage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to write ${key} to localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }
};

// Store class for managing application state
class Store {
  constructor() {
    this.listeners = new Map();
  }

  // Auth state management
  getAuth() {
    return storage.get(STORAGE_KEYS.AUTH) || {
      isAuthenticated: false,
      token: null,
      expiresAt: null
    };
  }

  setAuth(authData) {
    const auth = {
      isAuthenticated: !!authData.token,
      token: authData.token,
      userId: authData.userId,
      expiresAt: authData.expiresAt || null
    };
    storage.set(STORAGE_KEYS.AUTH, auth);
    this.notify('auth', auth);
    return auth;
  }

  clearAuth() {
    storage.remove(STORAGE_KEYS.AUTH);
    this.notify('auth', { isAuthenticated: false, token: null });
  }

  // User data management
  getUser() {
    return storage.get(STORAGE_KEYS.USER);
  }

  setUser(userData) {
    storage.set(STORAGE_KEYS.USER, userData);
    this.notify('user', userData);
    return userData;
  }

  updateUser(updates) {
    const currentUser = this.getUser() || {};
    const updatedUser = { ...currentUser, ...updates };
    return this.setUser(updatedUser);
  }

  // Module progress tracking
  getModules() {
    return storage.get(STORAGE_KEYS.MODULES);
  }

  setModules(modules) {
    storage.set(STORAGE_KEYS.MODULES, modules);
    this.notify('modules', modules);
    return modules;
  }

  updateModuleProgress(moduleId, updates) {
    const modules = this.getModules() || [];
    const updatedModules = modules.map(m =>
      m.id === moduleId ? { ...m, ...updates } : m
    );
    return this.setModules(updatedModules);
  }

  // Milestones tracking
  getMilestones() {
    return storage.get(STORAGE_KEYS.MILESTONES);
  }

  setMilestones(milestones) {
    storage.set(STORAGE_KEYS.MILESTONES, milestones);
    this.notify('milestones', milestones);
    return milestones;
  }

  updateMilestone(milestoneId, updates) {
    const milestones = this.getMilestones() || [];
    const updatedMilestones = milestones.map(m =>
      m.id === milestoneId ? { ...m, ...updates } : m
    );
    return this.setMilestones(updatedMilestones);
  }

  // Settings management
  getSettings() {
    return storage.get(STORAGE_KEYS.SETTINGS) || {
      theme: 'light',
      notifications: true
    };
  }

  setSettings(settings) {
    storage.set(STORAGE_KEYS.SETTINGS, settings);
    this.notify('settings', settings);
    return settings;
  }

  // Calculate total credits from completed modules
  calculateTotalCredits() {
    const modules = this.getModules() || [];
    return modules
      .filter(m => m.completed)
      .reduce((sum, m) => sum + (m.credits || 0), 0);
  }

  // Observer pattern for state changes
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  notify(key, data) {
    this.listeners.get(key)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in store listener for ${key}:`, error);
      }
    });
  }

  // Initialize store with default data if empty
  initialize(defaultData) {
    if (!this.getUser() && defaultData.user) {
      this.setUser(defaultData.user);
    }
    if (!this.getModules() && defaultData.modules) {
      this.setModules(defaultData.modules);
    }
    if (!this.getMilestones() && defaultData.milestones) {
      this.setMilestones(defaultData.milestones);
    }
  }

  // Reset store to initial state
  reset() {
    storage.clear();
    this.notify('reset', null);
  }
}

// Singleton instance
const store = new Store();

export { STORAGE_KEYS, storage };
export default store;
