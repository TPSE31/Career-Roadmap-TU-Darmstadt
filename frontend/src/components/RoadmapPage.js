import React from 'react';

const RoadmapPage = ({ user, language }) => {
  const brandColor = '#0F6CBF';

  const translations = {
    en: {
      title: 'Your Career Roadmap',
      subtitle: 'Journey to',
      currentStage: 'Current Stage',
      completed: 'Completed',
      inProgress: 'In Progress',
      upcoming: 'Upcoming',
      stageDetails: 'Stage Details',
    },
    de: {
      title: 'Ihre Karriere-Roadmap',
      subtitle: 'Reise zu',
      currentStage: 'Aktuelle Phase',
      completed: 'Abgeschlossen',
      inProgress: 'In Bearbeitung',
      upcoming: 'Bevorstehend',
      stageDetails: 'Phasendetails',
    }
  };

  const t = translations[language];
  
  const userGoal = user?.careerGoal || 'Career';

  const stages = [
    { 
      id: 1, 
      name: 'Foundation Year', 
      completed: true, 
      icon: '🎓',
      description: 'Basic programming, mathematics, and computer science fundamentals',
      modules: ['Programming 1', 'Programming 2', 'Mathematics 1', 'Mathematics 2'],
      duration: 'Semester 1-2'
    },
    { 
      id: 2, 
      name: 'Core Modules', 
      completed: true, 
      icon: '📚',
      description: 'Essential computer science topics and theory',
      modules: ['Algorithms', 'Data Structures', 'Databases', 'Operating Systems'],
      duration: 'Semester 2-3'
    },
    { 
      id: 3, 
      name: 'Specialization', 
      completed: false, 
      icon: '🎯', 
      current: true,
      description: 'Choose your focus area and dive deep',
      modules: ['Software Engineering', 'Machine Learning', 'Web Engineering', 'Cloud Computing'],
      duration: 'Semester 3-4'
    },
    { 
      id: 4, 
      name: 'Practical Experience', 
      completed: false, 
      icon: '💼',
      description: 'Internship or working student position',
      modules: ['6-month internship', 'Industry project', 'Real-world application'],
      duration: 'Semester 5'
    },
    { 
      id: 5, 
      name: 'Advanced Studies', 
      completed: false, 
      icon: '🔬',
      description: 'Advanced topics and electives',
      modules: ['Advanced topics', 'Elective courses', 'Seminars'],
      duration: 'Semester 5-6'
    },
    { 
      id: 6, 
      name: 'Bachelor Thesis', 
      completed: false, 
      icon: '📝',
      description: 'Final research project',
      modules: ['Thesis research', 'Writing', 'Defense'],
      duration: 'Semester 6'
    },
    { 
      id: 7, 
      name: userGoal || 'Career', 
      completed: false, 
      icon: '🚀',
      description: 'Your professional career goal',
      modules: ['Job applications', 'Interviews', 'Start your career!'],
      duration: 'After graduation'
    },
  ];

  const completedCount = stages.filter(s => s.completed).length;
  const currentStage = stages.find(s => s.current);

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 200px)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            color: brandColor, 
            margin: '0 0 15px 0',
            fontWeight: 'bold'
          }}>
            🗺️ {t.title}
          </h1>
          <p style={{ fontSize: '24px', color: '#666', margin: 0 }}>
            {t.subtitle} <strong style={{ color: brandColor }}>{userGoal}</strong>
          </p>
        </div>

        {/* Progress Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '50px'
        }}>
          <ProgressCard 
            icon="✓" 
            number={completedCount} 
            label={t.completed} 
            color="#27ae60" 
          />
          <ProgressCard 
            icon="⚡" 
            number="1" 
            label={t.currentStage} 
            color={brandColor} 
          />
          <ProgressCard 
            icon="📋" 
            number={stages.length - completedCount - 1} 
            label={t.upcoming} 
            color="#f39c12" 
          />
        </div>

        {/* Roadmap Timeline */}
        <div style={{ position: 'relative' }}>
          {stages.map((stage, index) => (
            <div key={stage.id} style={{ position: 'relative', marginBottom: '40px' }}>
              {/* Connection Line */}
              {index < stages.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '50px',
                  top: '100px',
                  width: '4px',
                  height: '100px',
                  background: stage.completed 
                    ? 'linear-gradient(180deg, #27ae60 0%, #27ae60 100%)'
                    : stage.current
                    ? `linear-gradient(180deg, ${brandColor} 0%, #ddd 100%)`
                    : '#ddd',
                  zIndex: 0
                }}></div>
              )}
              
              {/* Stage Card */}
              <div style={{
                display: 'flex',
                gap: '30px',
                alignItems: 'start',
                position: 'relative',
                zIndex: 1
              }}>
                {/* Icon */}
                <div style={{
                  minWidth: '100px',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: stage.completed ? '#27ae60' : stage.current ? brandColor : '#ecf0f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  border: stage.current ? `5px solid ${brandColor}` : stage.completed ? '5px solid #27ae60' : '5px solid #ddd',
                  boxShadow: stage.current ? `0 0 0 8px rgba(15, 108, 191, 0.2)` : stage.completed ? '0 0 0 8px rgba(39, 174, 96, 0.2)' : 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}>
                  {stage.completed ? '✓' : stage.icon}
                  {stage.current && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: '#e74c3c',
                      border: '3px solid white',
                      animation: 'pulse 2s infinite'
                    }}></div>
                  )}
                </div>

                {/* Content Card */}
                <div style={{
                  flex: 1,
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: stage.current 
                    ? `0 8px 24px rgba(15, 108, 191, 0.3)` 
                    : '0 4px 12px rgba(0,0,0,0.1)',
                  border: stage.current ? `3px solid ${brandColor}` : '1px solid #e0e0e0',
                  transform: stage.current ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                      <h2 style={{ 
                        margin: '0 0 5px 0', 
                        fontSize: '28px',
                        color: stage.completed ? '#27ae60' : stage.current ? brandColor : '#2c3e50'
                      }}>
                        {stage.name}
                      </h2>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: stage.completed ? '#e8f5e9' : stage.current ? '#e3f2fd' : '#f5f5f5',
                        color: stage.completed ? '#27ae60' : stage.current ? brandColor : '#666',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {stage.duration}
                      </span>
                    </div>
                    {stage.current && (
                      <span style={{
                        padding: '6px 16px',
                        backgroundColor: brandColor,
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {t.currentStage}
                      </span>
                    )}
                    {stage.completed && (
                      <span style={{
                        fontSize: '32px',
                        color: '#27ae60'
                      }}>
                        ✓
                      </span>
                    )}
                  </div>

                  <p style={{ 
                    margin: '15px 0', 
                    fontSize: '16px', 
                    color: '#666',
                    lineHeight: '1.6'
                  }}>
                    {stage.description}
                  </p>

                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#999', textTransform: 'uppercase' }}>
                      Key Activities
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {stage.modules.map((module, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#f8f9fa',
                            color: '#2c3e50',
                            borderRadius: '6px',
                            fontSize: '14px',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pulse animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

const ProgressCard = ({ icon, number, label, color }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: `3px solid ${color}`
  }}>
    <div style={{ fontSize: '48px', marginBottom: '10px' }}>
      {icon}
    </div>
    <div style={{ fontSize: '42px', fontWeight: 'bold', color, marginBottom: '5px' }}>
      {number}
    </div>
    <div style={{ fontSize: '16px', color: '#666' }}>
      {label}
    </div>
  </div>
);

export default RoadmapPage;
