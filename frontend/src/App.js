import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ModuleList from './components/ModuleList';
import MilestoneTracker from './components/MilestoneTracker';
import RoadmapPage from './components/RoadmapPage';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Start with login screen
  const [user, setUser] = useState(null); // User data
  const [language, setLanguage] = useState('en'); // 'en' or 'de'
  
  const brandColor = '#0F6CBF';

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleGoalChange = (newGoal) => {
    setUser(prevUser => ({
      ...prevUser,
      careerGoal: newGoal
    }));
  };

  const handleLogin = (email, password) => {
    // TODO: Connect to backend authentication
    console.log('Login:', email, password);
    
    // For demo: Create user with data
    setUser({
      name: 'Max Mustermann',
      email: email,
      studentId: '1234567',
      careerGoal: 'Software Engineer',
      program: 'B.Sc. Computer Science',
      semester: 3,
      totalCredits: 63,
      requiredCredits: 180,
      completionPercentage: 35,
      expectedGraduation: 'Sep 2026'
    });
    
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleSignup = (email, password, name, studentId) => {
    // TODO: Connect to backend registration
    console.log('Signup:', email, password, name, studentId);
    
    // Create NEW empty user
    setUser({
      name: name,
      email: email,
      studentId: studentId,
      careerGoal: 'Software Engineer', // Default goal
      program: 'B.Sc. Computer Science',
      semester: 1,
      totalCredits: 0,
      requiredCredits: 180,
      completionPercentage: 0,
      expectedGraduation: 'TBD'
    });
    
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('login');
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
      profile: 'Profile',
      logout: 'Logout',
    },
    de: {
      dashboard: 'Dashboard',
      myModules: 'Meine Module',
      milestones: 'Meilensteine',
      roadmap: 'Roadmap',
      profile: 'Profil',
      logout: 'Abmelden',
    }
  };

  const t = translations[language];

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} onSignup={handleSignup} language={language} onToggleLanguage={toggleLanguage} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Navigation */}
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
              onClick={() => setCurrentView('dashboard')}
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
                active={currentView === 'dashboard'}
                onClick={() => setCurrentView('dashboard')}
              >
                {t.dashboard}
              </NavButton>
              <NavButton
                active={currentView === 'modules'}
                onClick={() => setCurrentView('modules')}
              >
                {t.myModules}
              </NavButton>
              <NavButton
                active={currentView === 'milestones'}
                onClick={() => setCurrentView('milestones')}
              >
                {t.milestones}
              </NavButton>
              <NavButton
                active={currentView === 'roadmap'}
                onClick={() => setCurrentView('roadmap')}
              >
                🗺️ {t.roadmap}
              </NavButton>
            </div>
          </div>

          {/* Right side - Language, Profile, Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '20px' }}>
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
              {language === 'en' ? '🇬🇧 EN' : '🇩🇪 DE'}
            </button>

            {/* Profile Button */}
            <button
              onClick={() => setCurrentView('profile')}
              style={{
                padding: '8px 16px',
                backgroundColor: currentView === 'profile' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
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
                if (currentView !== 'profile') {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }
              }}
            >
              👤 {t.profile}
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

      {/* Main Content */}
      <main style={{ paddingBottom: '40px' }}>
        {currentView === 'dashboard' && (
          <Dashboard 
            onNavigate={handleNavigate} 
            user={user}
            onGoalChange={handleGoalChange}
            language={language}
          />
        )}
        {currentView === 'modules' && <ModuleList language={language} />}
        {currentView === 'milestones' && <MilestoneTracker user={user} language={language} />}
        {currentView === 'roadmap' && <RoadmapPage user={user} language={language} />}
        {currentView === 'profile' && (
          <ProfilePage 
            user={user}
            onGoalChange={handleGoalChange}
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0a4a8a',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          Career Roadmap Tool - TU Darmstadt © 2025
        </p>
      </footer>
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

export default App;
