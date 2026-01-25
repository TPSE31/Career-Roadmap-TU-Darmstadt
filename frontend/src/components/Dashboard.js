import React, { useState, useEffect } from 'react';
import { allModules, getMandatoryModulesForSemester, TOTAL_REQUIRED_CREDITS } from '../data/modules';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Dashboard = ({ onNavigate, user, onGoalChange, language }) => {
  const [completedModules, setCompletedModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load completed modules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedModules');
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  // Calculate progress from completed modules
  const earnedCredits = allModules
    .filter(m => completedModules.includes(m.id))
    .reduce((sum, m) => sum + m.credits, 0);

  const completionPercentage = Math.round((earnedCredits / TOTAL_REQUIRED_CREDITS) * 100) || 0;
  const userSemester = user?.semester || 1;
  const expectedCredits = userSemester * 30;
  const isOnTrack = earnedCredits >= expectedCredits - 15;

  // Get modules for current semester as milestones
  const currentSemesterModules = getMandatoryModulesForSemester(userSemester);
  const upcomingMilestones = currentSemesterModules
    .filter(m => !completedModules.includes(m.id))
    .map(m => ({
      id: m.id,
      title: m.name,
      deadline: `End of Semester ${userSemester}`,
      semester: userSemester,
      credits: m.credits
    }));

  // Create progress object with safe defaults
  const progress = {
    total_credits: earnedCredits,
    required_credits: TOTAL_REQUIRED_CREDITS,
    completion_percentage: completionPercentage,
    on_track: isOnTrack,
    current_semester: userSemester
  };

  const milestones = upcomingMilestones;
  const modules = currentSemesterModules;
  
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [tempGoal, setTempGoal] = useState(user?.careerGoal || 'Software Engineer');
  
  // Career goals list
  const careerGoals = [
    'Software Engineer',
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Cloud Architect',
    'Mobile Developer',
    'Game Developer',
    'Cybersecurity Specialist',
    'AI Researcher',
    'Database Administrator',
    'IT Consultant',
    'Product Manager (Tech)',
  ];
  
  const handleSaveGoal = () => {
    onGoalChange(tempGoal);
    setShowGoalEditor(false);
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const brandColor = '#0F6CBF';
  const backgroundColor = '#FFFFFF';

  // Interactive card hover effect
  const cardHoverStyle = {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const handleCardHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.filter = 'blur(0px)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(15, 108, 191, 0.3)';
      e.currentTarget.style.transform = 'translateY(-5px)';
    } else {
      e.currentTarget.style.filter = 'blur(0px)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', backgroundColor }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#2c3e50' }}>
          Welcome back, {user?.name || 'Student'}! 👋
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          {user?.program || 'Program'} • Semester {user?.semester || 'N/A'}
        </p>
      </div>

      {/* Progress Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        
        {/* Total Credits Card - Interactive */}
        <div 
          style={{
            backgroundColor: brandColor,
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            ...cardHoverStyle
          }}
          onClick={() => setShowCreditsModal(true)}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>
            Total Credits
          </h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {progress?.total_credits}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            of {progress?.required_credits} required
          </p>
          <div style={{ marginTop: '15px', fontSize: '12px', opacity: 0.9 }}>
            Click to see all modules →
          </div>
        </div>

        {/* Status Card (Combined with Completion) - Interactive */}
        <div 
          style={{
            backgroundColor: progress?.on_track ? '#27ae60' : '#e74c3c',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            ...cardHoverStyle
          }}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>
            Status
          </h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {progress?.on_track ? '✓' : '⚠'}
          </p>
          <p style={{ margin: '5px 0 15px 0', fontSize: '14px', opacity: 0.8 }}>
            {progress?.on_track ? 'On Track' : 'Behind Schedule'}
          </p>
          
          {/* Completion Progress Bar */}
          <div style={{ marginTop: '15px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '5px',
              fontSize: '12px'
            }}>
              <span>Completion</span>
              <span>{progress?.completion_percentage}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress?.completion_percentage}%`,
                height: '100%',
                backgroundColor: 'white',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>

        {/* My Modules Card - Interactive */}
        <div 
          style={{
            backgroundColor: '#9b59b6',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            ...cardHoverStyle
          }}
          onClick={() => onNavigate && onNavigate('modules')}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>
            My Modules
          </h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {currentSemesterModules.length}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            This semester
          </p>
          <div style={{ marginTop: '15px', fontSize: '12px', opacity: 0.9 }}>
            Click to see exams & details →
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        
        {/* Upcoming Milestones - Interactive */}
        <div 
          style={{
            backgroundColor: 'white',
            border: `2px solid ${brandColor}`,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            ...cardHoverStyle
          }}
          onClick={() => onNavigate && onNavigate('milestones')}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', color: brandColor }}>
            📅 Upcoming Milestones
          </h2>
          {milestones.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No upcoming milestones. Great job! 🎉
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {milestones.slice(0, 3).map(milestone => (
                <div 
                  key={milestone.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderLeft: `4px solid ${brandColor}`,
                    borderRadius: '4px'
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#2c3e50' }}>
                    {milestone.title}
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    <span>⏰ {milestone.deadline}</span>
                    <span>📍 Semester {milestone.semester}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center', 
            color: brandColor,
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Click to see all milestones →
          </div>
        </div>
      </div>

      {/* Career Goal Section - Editable */}
      <div 
        style={{
          marginTop: '30px',
          padding: '24px',
          background: `linear-gradient(135deg, ${brandColor} 0%, #0a4a8a 100%)`,
          borderRadius: '12px',
          textAlign: 'center',
          color: 'white',
          ...cardHoverStyle
        }}
        onClick={() => setShowGoalEditor(true)}
        onMouseEnter={(e) => handleCardHover(e, true)}
        onMouseLeave={(e) => handleCardHover(e, false)}
      >
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', opacity: 0.9 }}>
          🎯 Your Career Goal
        </h3>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          {user?.careerGoal || 'Not Set'}
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
          Expected Graduation: {user?.expectedGraduation || 'TBD'}
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
          Click to change your career goal →
        </p>
      </div>

      {/* Credits Modal */}
      {showCreditsModal && (
        <Modal onClose={() => setShowCreditsModal(false)}>
          <h2 style={{ color: brandColor, marginBottom: '20px' }}>All Modules Progress</h2>
          
          {/* Overall Progress Bar */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Overall Progress</strong>
              <span>{progress.completion_percentage}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '20px',
              backgroundColor: '#ecf0f1',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress.completion_percentage}%`,
                height: '100%',
                backgroundColor: brandColor,
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>

          {/* Modules List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {modules.map((module, index) => (
              <div 
                key={module.id} 
                style={{
                  padding: '15px',
                  backgroundColor: module.completed ? '#e8f5e9' : '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{module.name}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      {module.credits} ECTS • Semester {module.semester}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {module.completed ? (
                      <span style={{ color: '#27ae60', fontSize: '24px' }}>✓</span>
                    ) : (
                      <span style={{ color: '#999', fontSize: '20px' }}>○</span>
                    )}
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      {module.completed ? 'Passed' : 'In Progress'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Goal Editor Modal */}
      {showGoalEditor && (
        <Modal onClose={() => setShowGoalEditor(false)}>
          <h2 style={{ color: brandColor, marginBottom: '20px' }}>Edit Your Career Goal</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Your career goals can change over time. Select a new goal to get personalized recommendations!
          </p>
          
          {/* Dropdown Selection */}
          <select
            value={tempGoal}
            onChange={(e) => setTempGoal(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: `2px solid ${brandColor}`,
              borderRadius: '8px',
              marginBottom: '20px',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: 'white'
            }}
          >
            {careerGoals.map(goal => (
              <option key={goal} value={goal}>{goal}</option>
            ))}
          </select>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setTempGoal(user?.careerGoal || 'Software Engineer');
                setShowGoalEditor(false);
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveGoal}
              style={{
                padding: '10px 20px',
                backgroundColor: brandColor,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Save Goal
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ children, onClose, large = false }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: large ? '900px' : '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            float: 'right',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#999'
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Dashboard;
