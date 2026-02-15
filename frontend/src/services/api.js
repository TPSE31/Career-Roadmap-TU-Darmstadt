import axios from 'axios';

// Backend API base URL
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Storage key for auth token
const TOKEN_KEY = 'career_roadmap_token';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Set the auth token for all requests
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Get stored auth token
 */
export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Initialize auth token from storage (call on app start)
 */
export const initializeAuth = () => {
  const token = getStoredToken();
  if (token) {
    setAuthToken(token);
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          console.error('Unauthorized access - session expired');
          setAuthToken(null);
          // Dispatch event for auth context to handle
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found:', error.config.url);
          break;
        case 422:
          console.error('Validation error:', data);
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          console.error('API error:', status, data);
      }

      // Create a more useful error object
      const enhancedError = new Error(
        data?.message || data?.detail || `Request failed with status ${status}`
      );
      enhancedError.status = status;
      enhancedError.data = data;
      return Promise.reject(enhancedError);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response from server');
      console.error('Is the Django backend running on', BASE_URL, '?');

      const networkError = new Error('Network error - please check your connection');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
