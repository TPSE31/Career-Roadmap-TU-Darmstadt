import React, { useState, useEffect } from 'react';
import { allModules, getMandatoryModulesForSemester, TOTAL_REQUIRED_CREDITS } from '../data/modules';
import { careerPaths, getCareerPath, careerGoalToPathId } from '../data/careerPaths';

const RoadmapPage = ({ user, language }) => {
  const brandColor = '#0F6CBF';
  const [completedModules, setCompletedModules] = useState([]);

  // Load completed modules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedModules');
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
  }, []);

  // Calculate credits
  const earnedCredits = allModules
    .filter(m => completedModules.includes(m.id))
    .reduce((sum, m) => sum + m.credits, 0);

  const translations = {
    en: {
      title: 'Your Career Roadmap',
      subtitle: 'Journey to',
      currentStage: 'Current Stage',
      completed: 'Completed',
      inProgress: 'In Progress',
      upcoming: 'Upcoming',
      credits: 'Credits',
      recommendedModules: 'Recommended Modules for Your Career Goal',
      salary: 'Expected Salary Range',
      skills: 'Key Skills to Develop'
    },
    de: {
      title: 'Ihre Karriere-Roadmap',
      subtitle: 'Reise zu',
      currentStage: 'Aktuelle Phase',
      completed: 'Abgeschlossen',
      inProgress: 'In Bearbeitung',
      upcoming: 'Bevorstehend',
      credits: 'Credits',
      recommendedModules: 'Empfohlene Module für Ihr Karriereziel',
      salary: 'Erwartete Gehaltsspanne',
      skills: 'Wichtige Fähigkeiten'
    }
  };

  const t = translations[language] || translations.en;

  const userGoal = user?.careerGoal || 'Software Engineer';
  const userSemester = user?.semester || 1;

  // Get career path info
  const careerPathId = careerGoalToPathId[userGoal] || 'software_engineer';
  const careerInfo = getCareerPath(careerPathId);

  // Get recommended modules for career
  const recommendedModuleCodes = careerInfo?.recommended_modules || [];
  const recommendedModules = allModules.filter(m =>
    recommendedModuleCodes.includes(m.code)
  );

  // Dynamic stages based on user's actual semester
  const stages = [
    {
      id: 1,
      name: 'Foundation',
      completed: userSemester > 2,
      current: userSemester <= 2,
      icon: '📚',
      description: 'Basic programming, mathematics, and computer science fundamentals',
      modules: getMandatoryModulesForSemester(1).concat(getMandatoryModulesForSemester(2)).map(m => m.name),
      duration: 'Semester 1-2',
      creditsNeeded: 59
    },
    {
      id: 2,
      name: 'Core Studies',
      completed: userSemester > 4,
      current: userSemester > 2 && userSemester <= 4,
      icon: '🎯',
      description: 'Core computer science modules and specialization basics',
      modules: getMandatoryModulesForSemester(3).concat(getMandatoryModulesForSemester(4)).map(m => m.name),
      duration: 'Semester 3-4',
      creditsNeeded: 35
    },
    {
      id: 3,
      name: 'Specialization',
      completed: userSemester > 5,
      current: userSemester === 5,
      icon: '💡',
      description: 'Electives, team project, and career-focused modules',
      modules: getMandatoryModulesForSemester(5).map(m => m.name),
      duration: 'Semester 5',
      creditsNeeded: 20
    },
    {
      id: 4,
      name: 'Thesis & Graduation',
      completed: false,
      current: userSemester >= 6,
      icon: '🎓',
      description: 'Bachelor thesis and final preparations',
      modules: ['Bachelor Thesis (12 CP)', 'Final Electives'],
      duration: 'Semester 6',
      creditsNeeded: 12
    },
    {
      id: 5,
      name: userGoal,
      completed: false,
      current: false,
      icon: '🚀',
      description: `Start your career as a ${userGoal}`,
      modules: careerInfo?.required_skills?.slice(0, 4) || ['Job applications', 'Interviews', 'Start your career!'],
      duration: 'After graduation'
    }
  ];

  const completedCount = stages.filter(s => s.completed).length;

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 200px)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '42px',
            color: brandColor,
            margin: '0 0 15px 0',
            fontWeight: 'bold'
          }}>
            {t.title}
          </h1>
          <p style={{ fontSize: '20px', color: '#666', margin: 0 }}>
            {t.subtitle} <strong style={{ color: brandColor }}>{userGoal}</strong>
          </p>
        </div>

        {/* Progress Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
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
          <ProgressCard
            icon="🎯"
            number={`${earnedCredits}/${TOTAL_REQUIRED_CREDITS}`}
            label={t.credits}
            color="#9b59b6"
          />
        </div>

        {/* Career Goal Info Card */}
        {careerInfo && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: `3px solid ${brandColor}`
          }}>
            <h2 style={{ margin: '0 0 15px 0', color: brandColor }}>
              {language === 'de' ? careerInfo.title_de : careerInfo.title_en}
            </h2>
            <p style={{ color: '#666', margin: '0 0 20px 0', lineHeight: '1.6' }}>
              {language === 'de' ? careerInfo.description_de : careerInfo.description_en}
            </p>

            {/* Salary Range */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{t.salary}</h4>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <SalaryBadge label="Junior" amount={careerInfo.average_salary.junior} />
                <SalaryBadge label="Mid" amount={careerInfo.average_salary.mid} />
                <SalaryBadge label="Senior" amount={careerInfo.average_salary.senior} />
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{t.skills}</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {careerInfo.required_skills.map((skill, i) => (
                  <span key={i} style={{
                    padding: '6px 12px',
                    backgroundColor: '#e3f2fd',
                    color: brandColor,
                    borderRadius: '20px',
                    fontSize: '13px'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Modules */}
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{t.recommendedModules}</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {recommendedModules.map((module, i) => {
                  const isCompleted = completedModules.includes(module.id);
                  return (
                    <span key={i} style={{
                      padding: '8px 14px',
                      backgroundColor: isCompleted ? '#d4edda' : '#f8f9fa',
                      border: isCompleted ? '2px solid #27ae60' : '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: isCompleted ? '#27ae60' : '#2c3e50',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {isCompleted && <span>✓</span>}
                      {module.name}
                      <span style={{ color: '#999', fontSize: '11px' }}>({module.credits} CP)</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Roadmap Timeline */}
        <div style={{ position: 'relative' }}>
          {stages.map((stage, index) => (
            <div key={stage.id} style={{ position: 'relative', marginBottom: '30px' }}>
              {/* Connection Line */}
              {index < stages.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '45px',
                  top: '90px',
                  width: '4px',
                  height: '80px',
                  background: stage.completed
                    ? '#27ae60'
                    : stage.current
                      ? `linear-gradient(180deg, ${brandColor} 0%, #ddd 100%)`
                      : '#ddd',
                  zIndex: 0
                }}></div>
              )}

              {/* Stage Card */}
              <div style={{
                display: 'flex',
                gap: '25px',
                alignItems: 'start',
                position: 'relative',
                zIndex: 1
              }}>
                {/* Icon */}
                <div style={{
                  minWidth: '90px',
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  backgroundColor: stage.completed ? '#27ae60' : stage.current ? brandColor : '#ecf0f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  border: stage.current ? `4px solid ${brandColor}` : stage.completed ? '4px solid #27ae60' : '4px solid #ddd',
                  boxShadow: stage.current ? `0 0 0 6px rgba(15, 108, 191, 0.2)` : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {stage.completed ? '✓' : stage.icon}
                </div>

                {/* Content Card */}
                <div style={{
                  flex: 1,
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '25px',
                  boxShadow: stage.current
                    ? `0 6px 20px rgba(15, 108, 191, 0.2)`
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  border: stage.current ? `2px solid ${brandColor}` : '1px solid #e0e0e0',
                  transform: stage.current ? 'scale(1.01)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h2 style={{
                        margin: '0 0 5px 0',
                        fontSize: '22px',
                        color: stage.completed ? '#27ae60' : stage.current ? brandColor : '#2c3e50'
                      }}>
                        {stage.name}
                      </h2>
                      <span style={{
                        padding: '3px 10px',
                        backgroundColor: stage.completed ? '#e8f5e9' : stage.current ? '#e3f2fd' : '#f5f5f5',
                        color: stage.completed ? '#27ae60' : stage.current ? brandColor : '#666',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {stage.duration}
                      </span>
                    </div>
                    {stage.current && (
                      <span style={{
                        padding: '5px 12px',
                        backgroundColor: brandColor,
                        color: 'white',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {t.currentStage}
                      </span>
                    )}
                    {stage.completed && (
                      <span style={{ fontSize: '28px', color: '#27ae60' }}>✓</span>
                    )}
                  </div>

                  <p style={{
                    margin: '12px 0',
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.5'
                  }}>
                    {stage.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {stage.modules.slice(0, 5).map((module, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#f8f9fa',
                          color: '#2c3e50',
                          borderRadius: '5px',
                          fontSize: '12px',
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        {module}
                      </span>
                    ))}
                    {stage.modules.length > 5 && (
                      <span style={{
                        padding: '5px 10px',
                        backgroundColor: '#f8f9fa',
                        color: '#999',
                        borderRadius: '5px',
                        fontSize: '12px'
                      }}>
                        +{stage.modules.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProgressCard = ({ icon, number, label, color }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: `2px solid ${color}`
  }}>
    <div style={{ fontSize: '36px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color, marginBottom: '5px' }}>{number}</div>
    <div style={{ fontSize: '13px', color: '#666' }}>{label}</div>
  </div>
);

const SalaryBadge = ({ label, amount }) => (
  <div style={{
    padding: '10px 15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '11px', color: '#999', marginBottom: '3px' }}>{label}</div>
    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#27ae60' }}>
      €{amount.toLocaleString()}
    </div>
  </div>
);

export default RoadmapPage;
