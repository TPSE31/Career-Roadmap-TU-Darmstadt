import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ModuleList from './components/ModuleList';
import RoadmapPage from './components/RoadmapPage';
import CareerPathsPage from './components/CareerPathsPage';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [language, setLanguage] = useState('de');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'de' ? 'en' : 'de');
  };

  const t = {
    de: { home: 'Home', modules: 'Module', careers: 'Karrierewege', roadmap: 'Roadmap' },
    en: { home: 'Home', modules: 'Modules', careers: 'Careers', roadmap: 'Roadmap' }
  }[language];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#004E8A',
        padding: '0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div style={{
            padding: '16px 20px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            Career Roadmap
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', flex: 1 }}>
            <NavButton
              active={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
            >
              {t.home}
            </NavButton>
            <NavButton
              active={currentView === 'modules'}
              onClick={() => setCurrentView('modules')}
            >
              {t.modules}
            </NavButton>
            <NavButton
              active={currentView === 'careers'}
              onClick={() => setCurrentView('careers')}
            >
              {t.careers}
            </NavButton>
            <NavButton
              active={currentView === 'roadmap'}
              onClick={() => setCurrentView('roadmap')}
            >
              {t.roadmap}
            </NavButton>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={{
              marginRight: '20px',
              padding: '8px 16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            <span style={{ fontSize: '16px' }}>{language === 'de' ? '🇩🇪' : '🇬🇧'}</span>
            {language === 'de' ? 'DE' : 'EN'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingBottom: '40px' }}>
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} language={language} />}
        {currentView === 'modules' && <ModuleList language={language} />}
        {currentView === 'careers' && <CareerPathsPage language={language} />}
        {currentView === 'roadmap' && <RoadmapPage language={language} />}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#003366',
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
  return (
    <button
      onClick={onClick}
      style={{
        padding: '16px 24px',
        backgroundColor: active ? '#003366' : 'transparent',
        color: 'white',
        border: 'none',
        borderBottom: active ? '3px solid #009CDE' : '3px solid transparent',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: active ? 'bold' : 'normal',
        transition: 'all 0.2s ease',
        outline: 'none'
      }}
      onMouseOver={(e) => {
        if (!active) {
          e.target.style.backgroundColor = '#003366';
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
