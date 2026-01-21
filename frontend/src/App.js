import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initializeAuth } from './services/api';
import { getUnreadCount } from './services/notificationService';

// Components
import Dashboard from './components/Dashboard';
import ModuleList from './components/ModuleList';
import MilestoneTracker from './components/MilestoneTracker';
import RoadmapPage from './components/RoadmapPage';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationsPage from './components/NotificationsPage';
import SupportPage from './components/SupportPage';

// Initialize auth token from storage
initializeAuth();

function AppContent() {
  const [language, setLanguage] = useState('en');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const brandColor = '#0F6CBF';

  // Fetch unread notification count
  useEffect(() => {
    if (isAuthenticated) {
      getUnreadCount().then(setUnreadNotifications).catch(console.error);
    }
  }, [isAuthenticated, location.pathname]);

  const handleGoalChange = (newGoal) => {
    if (user) {
      updateUser({ ...user, careerGoal: newGoal });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  // Translations
  const translations = {
    en: {
      dashboard: 'Dashboard',
      myModules: 'My Modules',
      milestones: 'Milestones',
      roadmap: 'Roadmap',
      support: 'Support',
      profile: 'Profile',
      notifications: 'Notifications',
      logout: 'Logout',
    },
    de: {
      dashboard: 'Dashboard',
      myModules: 'Meine Module',
      milestones: 'Meilensteine',
      roadmap: 'Roadmap',
      support: 'Hilfe',
      profile: 'Profil',
      notifications: 'Benachrichtigungen',
      logout: 'Abmelden',
    }
  };

  const t = translations[language];

  // Prepare user data for components (merge auth user with additional fields)
  const userData = user ? {
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
    email: user.email,
    studentId: user.matriculationNumber || '1234567',
    careerGoal: user.careerGoal || 'Software Engineer',
    program: user.program || 'B.Sc. Computer Science',
    semester: user.semester || 3,
    totalCredits: 63,
    requiredCredits: 180,
    completionPercentage: 35,
    expectedGraduation: 'Sep 2026'
  } : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Navigation - only show when authenticated */}
      {isAuthenticated && (
        <nav style={{
          backgroundColor: brandColor,
          padding: '0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {/* Logo */}
              <div
                style={{
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onClick={() => navigate('/dashboard')}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <img
                  src="/logo.png"
                  alt="Career Roadmap"
                  style={{
                    height: '50px',
                    width: 'auto'
                  }}
                />
              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', flex: 1 }}>
                <NavButton
                  active={location.pathname === '/dashboard'}
                  onClick={() => navigate('/dashboard')}
                >
                  {t.dashboard}
                </NavButton>
                <NavButton
                  active={location.pathname === '/modules'}
                  onClick={() => navigate('/modules')}
                >
                  {t.myModules}
                </NavButton>
                <NavButton
                  active={location.pathname === '/milestones'}
                  onClick={() => navigate('/milestones')}
                >
                  {t.milestones}
                </NavButton>
                <NavButton
                  active={location.pathname === '/roadmap'}
                  onClick={() => navigate('/roadmap')}
                >
                  {t.roadmap}
                </NavButton>
                <NavButton
                  active={location.pathname === '/support'}
                  onClick={() => navigate('/support')}
                >
                  {t.support}
                </NavButton>
              </div>
            </div>

            {/* Right side - Notifications, Language, Profile, Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '20px' }}>
              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: location.pathname === '/notifications' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/notifications') {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  }
                }}
              >
                {unreadNotifications > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {unreadNotifications}
                  </span>
                )}
                {t.notifications}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              >
                {language === 'en' ? 'EN' : 'DE'}
              </button>

              {/* Profile Button */}
              <button
                onClick={() => navigate('/profile')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: location.pathname === '/profile' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/profile') {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  }
                }}
              >
                {t.profile}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                {t.logout}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content - Routes */}
      <main style={{ paddingBottom: isAuthenticated ? '40px' : '0' }}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <LoginPage language={language} onToggleLanguage={toggleLanguage} />
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <ForgotPasswordPage language={language} onToggleLanguage={toggleLanguage} />
            }
          />
          <Route
            path="/reset-password"
            element={
              isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <ResetPasswordPage language={language} onToggleLanguage={toggleLanguage} />
            }
          />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard
                onNavigate={(view) => navigate(`/${view}`)}
                user={userData}
                onGoalChange={handleGoalChange}
                language={language}
              />
            </ProtectedRoute>
          } />

          <Route path="/modules" element={
            <ProtectedRoute>
              <ModuleList language={language} />
            </ProtectedRoute>
          } />

          <Route path="/milestones" element={
            <ProtectedRoute>
              <MilestoneTracker user={userData} language={language} />
            </ProtectedRoute>
          } />

          <Route path="/roadmap" element={
            <ProtectedRoute>
              <RoadmapPage user={userData} language={language} />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage
                user={userData}
                onGoalChange={handleGoalChange}
                language={language}
              />
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage language={language} />
            </ProtectedRoute>
          } />

          <Route path="/support" element={
            <ProtectedRoute>
              <SupportPage language={language} />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Footer - only show when authenticated */}
      {isAuthenticated && (
        <footer style={{
          backgroundColor: '#0a4a8a',
          color: 'white',
          textAlign: 'center',
          padding: '20px',
          marginTop: '40px'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Career Roadmap Tool - TU Darmstadt - Group 31 © 2026
          </p>
        </footer>
      )}
    </div>
  );
}

// Navigation Button Component
const NavButton = ({ children, active, onClick }) => {
  const hoverColor = '#0a4a8a';

  return (
    <button
      onClick={onClick}
      style={{
        padding: '16px 24px',
        backgroundColor: active ? hoverColor : 'transparent',
        color: 'white',
        border: 'none',
        borderBottom: active ? '3px solid white' : '3px solid transparent',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: active ? 'bold' : 'normal',
        transition: 'all 0.2s ease',
        outline: 'none'
      }}
      onMouseOver={(e) => {
        if (!active) {
          e.target.style.backgroundColor = hoverColor;
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          e.target.style.backgroundColor = 'transparent';
        }
      }}
    >
      {children}
    </button>
  );
};

// Main App with providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
