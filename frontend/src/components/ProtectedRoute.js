import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute component - wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingSpinner />
        <p style={styles.loadingText}>Checking authentication...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the protected content
  return children;
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: '16px',
    color: '#666',
    fontSize: '14px',
  },
};

export default ProtectedRoute;
