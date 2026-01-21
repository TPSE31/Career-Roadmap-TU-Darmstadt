import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Storage keys
const TOKEN_KEY = 'career_roadmap_token';
const USER_KEY = 'career_roadmap_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
