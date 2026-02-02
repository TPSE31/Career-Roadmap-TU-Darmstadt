import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ModuleList from './components/ModuleList';
import RoadmapPage from './components/RoadmapPage';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

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
              Home
            </NavButton>
            <NavButton
              active={currentView === 'modules'}
              onClick={() => setCurrentView('modules')}
            >
              Module
            </NavButton>
            <NavButton
              active={currentView === 'roadmap'}
              onClick={() => setCurrentView('roadmap')}
            >
              Roadmap
            </NavButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingBottom: '40px' }}>
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'modules' && <ModuleList />}
        {currentView === 'roadmap' && <RoadmapPage />}
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
