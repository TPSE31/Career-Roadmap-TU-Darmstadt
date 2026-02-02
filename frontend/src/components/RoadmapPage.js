import React, { useState } from 'react';
import { mockRoadmap, mockMilestones, mockCareerPaths, mockModules } from '../mocks/mockData';

const RoadmapPage = () => {
  const [selectedCareer, setSelectedCareer] = useState(null);

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 5px 0', color: '#004E8A' }}>Studien-Roadmap & Karrierewege</h2>
      <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>
        Offizieller Studienplan B.Sc. Informatik (Satzungsbeilage 2023_II) mit Karriereweg-Empfehlungen
      </p>

      {/* Credit overview */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px', marginBottom: '30px'
      }}>
        {[
          { label: 'Pflichtbereich', cp: '114 CP', color: '#004E8A' },
          { label: 'Wahlpflichtbereich', cp: '10\u201335 CP', color: '#e67e22' },
          { label: 'Informatik-Wahlbereiche', cp: '5\u201330 CP', color: '#009CDE' },
          { label: 'Studienbegleitend', cp: '9\u201318 CP', color: '#8e44ad' },
          { label: 'Studium Generale', cp: '5\u20136 CP', color: '#27ae60' },
          { label: 'Bachelorarbeit', cp: '12 CP', color: '#c0392b' },
        ].map(item => (
          <div key={item.label} style={{
            padding: '12px', backgroundColor: 'white', borderLeft: `4px solid ${item.color}`,
            borderRadius: '6px', border: '1px solid #eee', borderLeftWidth: '4px', borderLeftColor: item.color
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>{item.label}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: item.color }}>{item.cp}</div>
          </div>
        ))}
      </div>

      {/* Semester-by-semester timeline */}
      <h3 style={{ color: '#004E8A', marginBottom: '16px' }}>Studienplan nach Semester</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        {mockRoadmap.semesters.map((sem) => {
          const semModules = sem.moduleIds.map(id => mockModules.find(m => m.id === id)).filter(Boolean);
          const phase = mockRoadmap.phases.find(p => {
            const [start, end] = p.semester_range.split('\u2013').map(Number);
            return sem.semester >= start && sem.semester <= end;
          });
          const semMilestones = mockMilestones.filter(ms => ms.semester === sem.semester);
          const careerSemModules = selectedCareer?.semesters?.[sem.semester];

          return (
            <div
              key={sem.semester}
              style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderLeft: `6px solid ${getSemesterColor(sem.semester)}`,
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '17px', color: '#004E8A' }}>
                  Semester {sem.semester}
                  {phase && <span style={{ fontWeight: 'normal', color: '#666', fontSize: '14px' }}> \u2014 {phase.name}</span>}
                </h4>
                <span style={{
                  padding: '3px 10px', backgroundColor: getSemesterColor(sem.semester), color: 'white',
                  borderRadius: '10px', fontSize: '12px', fontWeight: 'bold'
                }}>
                  {sem.cp} CP Pflicht
                </span>
              </div>
              <p style={{ margin: '0 0 10px 0', color: '#777', fontSize: '13px' }}>{sem.description}</p>

              {/* Pflicht modules */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {semModules.map(mod => (
                  <div key={mod.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', backgroundColor: '#f8f9fa', borderRadius: '6px',
                    borderLeft: `3px solid ${getCategoryColor(mod.category)}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{mod.name}</span>
                      {mod.needsStudienleistung && (
                        <span style={{ fontSize: '10px', color: '#e67e22', fontWeight: 'bold' }}>* Studienleistung</span>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>{mod.credits} CP</span>
                  </div>
                ))}
              </div>

              {/* Career-specific elective recommendations for this semester */}
              {careerSemModules && (
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f6fc', borderRadius: '8px', border: '1px solid #d0e3f0' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#004E8A', marginBottom: '4px' }}>
                    Empfohlen fuer {selectedCareer.name}:
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#555', fontStyle: 'italic' }}>
                    {careerSemModules.note}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {careerSemModules.modules.map(id => {
                      const mod = mockModules.find(m => m.id === id);
                      if (!mod) return null;
                      return (
                        <div key={id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '7px 10px', backgroundColor: 'white', borderRadius: '5px',
                          borderLeft: `3px solid ${getCategoryColor(mod.category)}`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{mod.name}</span>
                            <span style={{
                              fontSize: '9px', padding: '1px 6px',
                              backgroundColor: getCategoryColor(mod.category), color: 'white', borderRadius: '6px'
                            }}>
                              {mod.category}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>{mod.credits} CP</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hint for semesters 4+ when no career selected */}
              {sem.semester >= 4 && !selectedCareer && (
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#009CDE', fontStyle: 'italic' }}>
                  Ab jetzt: Wahlpflicht, Informatik-Wahlbereiche, Studienbegleitende Leistungen und Studium Generale \u2014 waehle unten einen Karriereweg fuer konkrete Empfehlungen.
                </p>
              )}

              {/* Milestones */}
              {semMilestones.length > 0 && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                  {semMilestones.map(ms => (
                    <div key={ms.id} style={{
                      padding: '6px 10px', backgroundColor: '#fff8e1', borderRadius: '6px',
                      fontSize: '12px', color: '#6d4c00', marginTop: '4px'
                    }}>
                      <strong>Meilenstein:</strong> {ms.title} \u2014 {ms.description}
                      {ms.credits_required && <span> ({ms.credits_required} CP)</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Career Paths selector */}
      <h3 style={{ color: '#004E8A', marginBottom: '8px' }}>Karriereweg auswaehlen</h3>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>
        Waehle einen Karriereweg, um im Studienplan oben zu sehen, welche Wahlmodule du ab dem 4. Semester belegen solltest.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '30px'
      }}>
        {mockCareerPaths.map(career => (
          <button
            key={career.id}
            onClick={() => setSelectedCareer(selectedCareer?.id === career.id ? null : career)}
            style={{
              padding: '14px',
              backgroundColor: selectedCareer?.id === career.id ? '#004E8A' : 'white',
              color: selectedCareer?.id === career.id ? 'white' : '#004E8A',
              border: '2px solid #004E8A',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{career.icon}</div>
            {career.name}
          </button>
        ))}
      </div>

      {/* Selected Career Detail */}
      {selectedCareer && (
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #004E8A',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '36px' }}>{selectedCareer.icon}</span>
            <div>
              <h3 style={{ margin: 0, color: '#004E8A' }}>{selectedCareer.name}</h3>
              <p style={{ margin: '2px 0 0 0', color: '#009CDE', fontSize: '14px', fontWeight: '600' }}>
                {selectedCareer.salary}
              </p>
            </div>
          </div>

          <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '16px' }}>
            {selectedCareer.description}
          </p>

          <div style={{ marginBottom: '20px' }}>
            <strong style={{ color: '#004E8A' }}>Gefragte Skills:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {selectedCareer.skills.map((skill, i) => (
                <span key={i} style={{
                  padding: '4px 10px', backgroundColor: '#e8f4fd',
                  color: '#004E8A', borderRadius: '10px', fontSize: '12px'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Semester-by-semester recommendations */}
          <strong style={{ color: '#004E8A' }}>Empfohlener Wahlmodul-Plan:</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            {Object.entries(selectedCareer.semesters).map(([sem, data]) => {
              const modules = data.modules.map(id => mockModules.find(m => m.id === id)).filter(Boolean);
              return (
                <div key={sem} style={{ padding: '14px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: `4px solid ${getSemesterColor(Number(sem))}` }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#004E8A', marginBottom: '4px' }}>
                    Semester {sem}
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>{data.note}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {modules.map(mod => (
                      <div key={mod.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '6px 10px', backgroundColor: 'white', borderRadius: '5px',
                        borderLeft: `3px solid ${getCategoryColor(mod.category)}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{mod.name}</span>
                          <span style={{
                            fontSize: '9px', padding: '1px 6px',
                            backgroundColor: getCategoryColor(mod.category), color: 'white', borderRadius: '6px'
                          }}>
                            {mod.category}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>{mod.credits} CP</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const getSemesterColor = (semester) => {
  const colors = { 1: '#004E8A', 2: '#005fa3', 3: '#0070bb', 4: '#009CDE', 5: '#00599A', 6: '#003366' };
  return colors[semester] || '#004E8A';
};

const getCategoryColor = (category) => {
  const colors = {
    'Pflichtbereich': '#004E8A',
    'Wahlpflichtbereich': '#e67e22',
    'Informatik-Wahlbereich': '#009CDE',
    'Studienbegleitende Leistungen': '#8e44ad',
    'Studium Generale': '#27ae60',
    'Abschlussbereich': '#c0392b',
  };
  return colors[category] || '#95a5a6';
};

export default RoadmapPage;
