import React, { useState } from 'react';

const RoadmapPage = ({ language = 'de' }) => {
  const [selectedSemester, setSelectedSemester] = useState(null);

  const t = {
    de: {
      title: 'Dein Studien-Roadmap',
      subtitle: 'Dein Weg zum B.Sc. Informatik - Semester für Semester',
      semester: 'Semester',
      credits: 'Credits',
      modules: 'Module',
      phase: 'Phase',
      mandatory: 'Pflicht',
      elective: 'Wahlpflicht',
      specialization: 'Wahlbereich',
      thesis: 'Abschluss',
      close: 'Schließen',
      clickDetails: 'Klick für Details',
      totalCredits: 'Gesamt ECTS',
      phases: {
        foundation: 'Grundlagen',
        core: 'Kernstudium',
        specialization: 'Vertiefung'
      }
    },
    en: {
      title: 'Your Study Roadmap',
      subtitle: 'Your path to B.Sc. Computer Science - Semester by semester',
      semester: 'Semester',
      credits: 'Credits',
      modules: 'Modules',
      phase: 'Phase',
      mandatory: 'Mandatory',
      elective: 'Elective',
      specialization: 'Specialization',
      thesis: 'Thesis',
      close: 'Close',
      clickDetails: 'Click for details',
      totalCredits: 'Total ECTS',
      phases: {
        foundation: 'Foundations',
        core: 'Core Studies',
        specialization: 'Specialization'
      }
    }
  }[language];

  const semesters = [
    {
      id: 1,
      credits: 30,
      phase: 'foundation',
      icon: '🚀',
      modules: [
        { name: language === 'de' ? 'Funktionale und objektorientierte Programmierkonzepte' : 'Functional and OOP Concepts', credits: 10, type: 'mandatory' },
        { name: language === 'de' ? 'Mathematik I' : 'Mathematics I', credits: 9, type: 'mandatory' },
        { name: language === 'de' ? 'Digitaltechnik' : 'Digital Technology', credits: 5, type: 'mandatory' },
        { name: language === 'de' ? 'Automaten, formale Sprachen' : 'Automata, Formal Languages', credits: 5, type: 'mandatory' },
        { name: language === 'de' ? 'Erfolgreich ins Studium starten' : 'Study Start', credits: 1, type: 'mandatory' },
      ]
    },
    {
      id: 2,
      credits: 29,
      phase: 'foundation',
      icon: '📚',
      modules: [
        { name: language === 'de' ? 'Algorithmen und Datenstrukturen' : 'Algorithms & Data Structures', credits: 10, type: 'mandatory' },
        { name: language === 'de' ? 'Mathematik II' : 'Mathematics II', credits: 9, type: 'mandatory' },
        { name: language === 'de' ? 'Rechnerorganisation' : 'Computer Organization', credits: 5, type: 'mandatory' },
        { name: language === 'de' ? 'Aussagen- und Prädikatenlogik' : 'Propositional & Predicate Logic', credits: 5, type: 'mandatory' },
      ]
    },
    {
      id: 3,
      credits: 25,
      phase: 'core',
      icon: '🧠',
      modules: [
        { name: language === 'de' ? 'Einführung in die KI' : 'Intro to AI', credits: 5, type: 'mandatory' },
        { name: language === 'de' ? 'Computersystemsicherheit' : 'Computer Security', credits: 5, type: 'mandatory' },
        { name: 'Software Engineering', credits: 5, type: 'mandatory' },
        { name: language === 'de' ? 'Probabilistische Methoden' : 'Probabilistic Methods', credits: 5, type: 'mandatory' },
        { name: language === 'de' ? 'Modellierung & Semantik' : 'Modeling & Semantics', credits: 5, type: 'mandatory' },
      ]
    },
    {
      id: 4,
      credits: 22,
      phase: 'core',
      icon: '👥',
      modules: [
        { name: language === 'de' ? 'Teamprojekt' : 'Team Project', credits: 9, type: 'mandatory' },
        { name: language === 'de' ? 'Informationsmanagement' : 'Information Management', credits: 5, type: 'mandatory' },
        { name: language === 'de' ? 'Computernetze' : 'Computer Networks', credits: 5, type: 'mandatory' },
        { name: language === 'de' ? 'Wissenschaftliches Arbeiten' : 'Academic Writing', credits: 3, type: 'mandatory' },
      ]
    },
    {
      id: 5,
      credits: 30,
      phase: 'specialization',
      icon: '⚡',
      modules: [
        { name: language === 'de' ? 'Parallele Programmierung' : 'Parallel Programming', credits: 5, type: 'mandatory' },
        { name: language === 'de' ? 'Informatik und Gesellschaft' : 'CS & Society', credits: 3, type: 'mandatory' },
        { name: language === 'de' ? 'Wahlpflichtmodule' : 'Elective Modules', credits: '~10', type: 'elective' },
        { name: language === 'de' ? 'Praktikum / Seminar' : 'Practicum / Seminar', credits: '~12', type: 'specialization' },
      ]
    },
    {
      id: 6,
      credits: 30,
      phase: 'specialization',
      icon: '🎓',
      modules: [
        { name: language === 'de' ? 'Bachelorarbeit' : 'Bachelor Thesis', credits: 12, type: 'thesis' },
        { name: language === 'de' ? 'Restliche Wahlmodule' : 'Remaining Electives', credits: '~18', type: 'elective' },
      ]
    },
  ];

  const phaseColors = {
    foundation: { main: '#58cc02', light: '#d7ffb8' },
    core: { main: '#1cb0f6', light: '#ddf4ff' },
    specialization: { main: '#ff9600', light: '#fff4e5' }
  };

  const typeColors = {
    mandatory: '#004E8A',
    elective: '#e67e22',
    specialization: '#9b59b6',
    thesis: '#c0392b'
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'linear-gradient(180deg, #f5f7fa 0%, #e8f4f8 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{
          fontSize: '28px',
          color: '#004E8A',
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {t.title}
        </h1>
        <p style={{ color: '#666', fontSize: '15px' }}>
          {t.subtitle}
        </p>
      </div>

      {/* Phase Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {Object.entries(t.phases).map(([key, label]) => (
          <div key={key} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: phaseColors[key].main
            }} />
            <span style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Duolingo-style Path */}
      <div style={{ position: 'relative', padding: '0 20px' }}>
        {semesters.map((semester, index) => {
          const isLeft = index % 2 === 0;
          const colors = phaseColors[semester.phase];
          const isLast = index === semesters.length - 1;

          return (
            <div key={semester.id} style={{ position: 'relative', marginBottom: isLast ? '0' : '20px' }}>
              {/* Connecting Path */}
              {!isLast && (
                <svg
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '80px',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '60px',
                    zIndex: 0
                  }}
                >
                  <path
                    d={isLeft
                      ? "M 50 0 Q 80 30 50 60"
                      : "M 50 0 Q 20 30 50 60"
                    }
                    fill="none"
                    stroke={colors.main}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="0"
                    opacity="0.3"
                  />
                  {/* Arrow */}
                  <polygon
                    points="45,50 55,50 50,60"
                    fill={colors.main}
                    opacity="0.5"
                  />
                </svg>
              )}

              {/* Semester Node */}
              <div
                onClick={() => setSelectedSemester(semester)}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: isLeft ? 'flex-start' : 'flex-end',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {/* Main Circle Node */}
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: colors.main,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 6px 20px ${colors.main}50, 0 3px 10px rgba(0,0,0,0.1)`,
                    border: '4px solid white',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = `0 10px 30px ${colors.main}70, 0 5px 15px rgba(0,0,0,0.15)`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${colors.main}50, 0 3px 10px rgba(0,0,0,0.1)`;
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{semester.icon}</span>
                  <span style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    marginTop: '2px'
                  }}>
                    {t.semester} {semester.id}
                  </span>
                </div>

                {/* Info Card below node */}
                <div style={{
                  marginTop: '12px',
                  padding: '12px 20px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  minWidth: '160px',
                  border: `2px solid ${colors.light}`,
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: colors.main
                  }}>
                    {semester.credits} CP
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#888',
                    marginTop: '2px'
                  }}>
                    {semester.modules.length} {t.modules}
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '11px',
                    color: colors.main,
                    fontWeight: '600'
                  }}>
                    ▼ {t.clickDetails}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Finish Trophy */}
        <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 40px',
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
          }}>
            <span style={{ fontSize: '50px' }}>🏆</span>
            <div style={{
              fontWeight: 'bold',
              color: '#8b6914',
              fontSize: '18px',
              marginTop: '5px'
            }}>
              B.Sc. Informatik
            </div>
            <div style={{
              fontSize: '13px',
              color: '#a67c00',
              marginTop: '2px'
            }}>
              180 ECTS • 6 {t.semester}
            </div>
          </div>
        </div>
      </div>

      {/* Semester Detail Modal */}
      {selectedSemester && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setSelectedSemester(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '0',
              maxWidth: '450px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              backgroundColor: phaseColors[selectedSemester.phase].main,
              color: 'white',
              padding: '25px',
              textAlign: 'center',
              borderRadius: '24px 24px 0 0'
            }}>
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>
                {selectedSemester.icon}
              </span>
              <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
                {t.semester} {selectedSemester.id}
              </div>
              <div style={{ marginTop: '5px', opacity: 0.9, fontSize: '14px' }}>
                {t.phases[selectedSemester.phase]} • {selectedSemester.credits} {t.credits}
              </div>
            </div>

            {/* Module List */}
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {selectedSemester.modules.map((module, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 16px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${typeColors[module.type]}`,
                      transition: 'transform 0.2s'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#333'
                      }}>
                        {module.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: typeColors[module.type],
                        marginTop: '3px',
                        fontWeight: '500'
                      }}>
                        {t[module.type]}
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: typeColors[module.type],
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      minWidth: '50px',
                      textAlign: 'center'
                    }}>
                      {module.credits} CP
                    </div>
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedSemester(null)}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '14px',
                  backgroundColor: phaseColors[selectedSemester.phase].main,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RoadmapPage;
