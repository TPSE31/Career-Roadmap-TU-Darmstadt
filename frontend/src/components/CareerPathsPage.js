import React, { useState, useEffect } from 'react';
import careerService from '../services/careerService';

const CareerPathsPage = ({ language = 'de' }) => {
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [roadmapModules, setRoadmapModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoadmapNode, setSelectedRoadmapNode] = useState(null);

  const t = {
    de: {
      title: 'Karrierewege erkunden',
      subtitle: 'Klicke auf einen Karriereweg, um den empfohlenen Studien-Roadmap zu sehen',
      searchPlaceholder: 'Karrieren suchen (z.B. KI, Security, Entwickler...)',
      careersFound: 'Karrierewege gefunden',
      viewRoadmap: 'Roadmap anzeigen',
      backToAll: '\u2190 Zur\u00fcck zu allen Karrierewegen',
      salaryRange: 'Gehaltsbereich (Deutschland)',
      requiredSkills: 'Ben\u00f6tigte F\u00e4higkeiten',
      junior: 'Junior',
      midLevel: 'Mid-Level',
      senior: 'Senior',
      yourRoadmap: 'Dein Karriere-Roadmap',
      roadmapSubtitle: 'Empfohlene Module f\u00fcr die Karriere als',
      core: 'Kernmodul',
      recommended: 'Empfohlen',
      supplementary: 'Erg\u00e4nzend',
      careerReady: 'Karrierebereit!',
      noResults: 'Keine Karrierewege gefunden f\u00fcr',
      clearSearch: 'Suche l\u00f6schen',
      loading: 'Lade Karrierewege...',
      loadingModules: 'Lade Module...',
      retry: 'Erneut versuchen',
      errorMsg: 'Fehler beim Laden der Karrierewege. Bitte erneut versuchen.',
      clickForDetails: 'Klick f\u00fcr Details',
      close: 'Schlie\u00dfen',
      credits: 'Credits',
      semester: 'Semester',
      category: 'Kategorie',
      relevance: 'Relevanz',
      noModules: 'Keine spezifischen Module f\u00fcr diesen Karriereweg gefunden.',
      description: 'Beschreibung',
      totalCredits: 'Gesamt CP',
      modules: 'Module',
      match: '\u00dcbereinstimmung',
    },
    en: {
      title: 'Explore Career Paths',
      subtitle: 'Click on any career to see the recommended study roadmap',
      searchPlaceholder: 'Search careers (e.g., AI, Security, Developer...)',
      careersFound: 'careers found',
      viewRoadmap: 'View Roadmap',
      backToAll: '\u2190 Back to all careers',
      salaryRange: 'Salary Range (Germany)',
      requiredSkills: 'Required Skills',
      junior: 'Junior',
      midLevel: 'Mid-Level',
      senior: 'Senior',
      yourRoadmap: 'Your Career Roadmap',
      roadmapSubtitle: 'Recommended modules for a career as',
      core: 'Core Module',
      recommended: 'Recommended',
      supplementary: 'Supplementary',
      careerReady: 'Career Ready!',
      noResults: 'No careers found matching',
      clearSearch: 'Clear search',
      loading: 'Loading career paths...',
      loadingModules: 'Loading modules...',
      retry: 'Retry',
      errorMsg: 'Failed to load career paths. Please try again.',
      clickForDetails: 'Click for details',
      close: 'Close',
      credits: 'Credits',
      semester: 'Semester',
      category: 'Category',
      relevance: 'Relevance',
      noModules: 'No specific modules found for this career path.',
      description: 'Description',
      totalCredits: 'Total CP',
      modules: 'Modules',
      match: 'match',
    }
  }[language];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadCareers(); }, []);

  const loadCareers = async () => {
    setLoading(true);
    setError(null);
    try {
      const careers = await careerService.getCareerPaths();
      setCareerPaths(careers);
    } catch (err) {
      setError(t.errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCareerVisual = (careerId) => {
    const visuals = {
      'software_engineer': { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '\uD83D\uDCBB' },
      'backend_developer': { gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', icon: '\u2699\uFE0F' },
      'frontend_developer': { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '\uD83C\uDFA8' },
      'fullstack_developer': { gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: '\uD83D\uDD04' },
      'data_scientist': { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '\uD83D\uDCCA' },
      'data_analyst': { gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', icon: '\uD83D\uDCC8' },
      'data_engineer': { gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)', icon: '\uD83D\uDD27' },
      'ml_engineer': { gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', icon: '\uD83E\uDD16' },
      'ai_engineer': { gradient: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)', icon: '\uD83E\uDDE0' },
      'devops_engineer': { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '\uD83D\uDE80' },
      'sre_engineer': { gradient: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)', icon: '\u26A1' },
      'it_security_engineer': { gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', icon: '\uD83D\uDD10' },
      'cybersecurity_analyst': { gradient: 'linear-gradient(135deg, #e44d26 0%, #f16529 100%)', icon: '\uD83D\uDEE1\uFE0F' },
      'cloud_architect': { gradient: 'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)', icon: '\u2601\uFE0F' },
      'software_architect': { gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)', icon: '\uD83C\uDFD7\uFE0F' },
      'database_administrator': { gradient: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)', icon: '\uD83D\uDDC4\uFE0F' },
      'network_engineer': { gradient: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)', icon: '\uD83C\uDF10' },
      'mobile_developer': { gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', icon: '\uD83D\uDCF1' },
      'game_developer': { gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', icon: '\uD83C\uDFAE' },
      'blockchain_developer': { gradient: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)', icon: '\u26D3\uFE0F' },
      'ux_designer': { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', icon: '\u270F\uFE0F' },
      'qa_engineer': { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '\u2705' },
      'embedded_systems_engineer': { gradient: 'linear-gradient(135deg, #6a3093 0%, #a044ff 100%)', icon: '\uD83D\uDD0C' },
      'robotics_engineer': { gradient: 'linear-gradient(135deg, #cb356b 0%, #bd3f32 100%)', icon: '\uD83E\uDDBE' },
      'computer_vision_engineer': { gradient: 'linear-gradient(135deg, #0575e6 0%, #021b79 100%)', icon: '\uD83D\uDC41\uFE0F' },
      'nlp_engineer': { gradient: 'linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)', icon: '\uD83D\uDCAC' },
      'prompt_engineer': { gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', icon: '\uD83D\uDCDD' },
      'ai_research_scientist': { gradient: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)', icon: '\uD83D\uDD2C' },
      'generative_ai_developer': { gradient: 'linear-gradient(135deg, #e1eec3 0%, #f05053 100%)', icon: '\u2728' },
      'ar_vr_developer': { gradient: 'linear-gradient(135deg, #a770ef 0%, #cf8bf3 100%)', icon: '\uD83E\uDD7D' },
      'iot_developer': { gradient: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)', icon: '\uD83D\uDCE1' },
      'graphics_programmer': { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '\uD83D\uDDBC\uFE0F' },
      'compiler_engineer': { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '\u26A1' },
      'bioinformatics_scientist': { gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: '\uD83E\uDDEC' },
      'quantum_computing_researcher': { gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)', icon: '\u269B\uFE0F' },
      'fintech_developer': { gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', icon: '\uD83D\uDCB3' },
      'healthtech_developer': { gradient: 'linear-gradient(135deg, #e53935 0%, #e35d5b 100%)', icon: '\uD83C\uDFE5' },
      'security_architect': { gradient: 'linear-gradient(135deg, #b71c1c 0%, #880e4f 100%)', icon: '\uD83D\uDEE1\uFE0F' },
      'information_security_manager': { gradient: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)', icon: '\uD83D\uDD12' },
      'api_developer': { gradient: 'linear-gradient(135deg, #00838f 0%, #006064 100%)', icon: '\uD83D\uDD17' },
      'automation_engineer': { gradient: 'linear-gradient(135deg, #ff8f00 0%, #ff6f00 100%)', icon: '\u2699\uFE0F' },
      'ai_product_manager': { gradient: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)', icon: '\uD83D\uDCCB' },
      'ai_safety_researcher': { gradient: 'linear-gradient(135deg, #1b5e20 0%, #33691e 100%)', icon: '\uD83D\uDEE1\uFE0F' },
      'ai_trainer': { gradient: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)', icon: '\uD83C\uDF93' },
      'ai_ethics_specialist': { gradient: 'linear-gradient(135deg, #4527a0 0%, #311b92 100%)', icon: '\u2696\uFE0F' },
      'applied_scientist': { gradient: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', icon: '\uD83E\uDDEA' },
      'autonomous_vehicle_engineer': { gradient: 'linear-gradient(135deg, #37474f 0%, #263238 100%)', icon: '\uD83D\uDE97' },
      'accessibility_engineer': { gradient: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)', icon: '\u267F' },
    };
    return visuals[careerId] || { gradient: 'linear-gradient(135deg, #546e7a 0%, #37474f 100%)', icon: '\uD83D\uDCBC' };
  };

  const getCareerTitle = (career) => {
    if (language === 'de') return career.title_de || career.title_en;
    return career.title_en;
  };

  const getCareerDescription = (career) => {
    if (language === 'de') return career.description_de || career.description_en;
    return career.description_en;
  };

  const getModulePhase = (module) => {
    if (module.is_core || module.relevance_score >= 35) return 'core';
    if (module.relevance_score >= 25) return 'recommended';
    return 'supplementary';
  };

  const phaseColors = {
    core: { main: '#58cc02', light: '#d7ffb8' },
    recommended: { main: '#1cb0f6', light: '#ddf4ff' },
    supplementary: { main: '#ff9600', light: '#fff4e5' }
  };

  const selectCareer = async (career) => {
    setSelectedCareer(career);
    setLoadingModules(true);
    setRoadmapModules([]);
    try {
      const data = await careerService.getCareerModules(career.id);
      const modules = (data.modules || [])
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 8);
      setRoadmapModules(modules);
    } catch (err) {
      console.error('Failed to load career modules:', err);
      setRoadmapModules([]);
    } finally {
      setLoadingModules(false);
    }
  };

  const goBack = () => {
    setSelectedCareer(null);
    setRoadmapModules([]);
    setSelectedRoadmapNode(null);
  };

  const filteredCareers = careerPaths.filter(career => {
    const term = searchTerm.toLowerCase();
    return (
      career.title_en?.toLowerCase().includes(term) ||
      career.title_de?.toLowerCase().includes(term) ||
      career.description_en?.toLowerCase().includes(term) ||
      career.description_de?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  // Career Detail View with Roadmap
  if (selectedCareer) {
    const totalCP = roadmapModules.reduce((sum, m) => sum + m.credits, 0);
    const visual = getCareerVisual(selectedCareer.career_id || selectedCareer.id);

    return (
      <div style={styles.container}>
        <button onClick={goBack} style={styles.backButton}>
          {t.backToAll}
        </button>

        {/* Career Header with Gradient */}
        <div style={{
          ...styles.careerDetailHeader,
          background: visual.gradient,
          borderRadius: '16px',
          padding: '30px',
          color: 'white',
          marginBottom: '30px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: '50px', display: 'block', marginBottom: '10px' }}>{visual.icon}</span>
          <h1 style={{ ...styles.detailTitle, color: 'white' }}>{getCareerTitle(selectedCareer)}</h1>
          <p style={{ fontSize: '16px', opacity: 0.9, marginTop: '10px', lineHeight: '1.6' }}>
            {getCareerDescription(selectedCareer)}
          </p>
        </div>

        <div style={styles.detailGrid}>
          {/* Left Column - Career Info */}
          <div style={styles.infoColumn}>
            <div style={styles.infoCard}>
              <h3 style={styles.infoCardTitle}>{t.salaryRange}</h3>
              <div style={styles.salaryGrid}>
                <div style={styles.salaryItem}>
                  <span style={styles.salaryLevel}>{t.junior}</span>
                  <span style={styles.salaryAmount}>
                    {(selectedCareer.average_salary?.junior || selectedCareer.salary_junior || 45000).toLocaleString()} \u20AC
                  </span>
                </div>
                <div style={styles.salaryItem}>
                  <span style={styles.salaryLevel}>{t.midLevel}</span>
                  <span style={styles.salaryAmount}>
                    {(selectedCareer.average_salary?.mid || selectedCareer.salary_mid || 65000).toLocaleString()} \u20AC
                  </span>
                </div>
                <div style={styles.salaryItem}>
                  <span style={styles.salaryLevel}>{t.senior}</span>
                  <span style={styles.salaryAmount}>
                    {(selectedCareer.average_salary?.senior || selectedCareer.salary_senior || 85000).toLocaleString()} \u20AC
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoCardTitle}>{t.requiredSkills}</h3>
              <div style={styles.skillsList}>
                {selectedCareer.required_skills?.map((skill, idx) => (
                  <div key={idx} style={styles.skillItem}>
                    <span style={styles.skillBullet}>&#10003;</span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Career-Specific Roadmap */}
          <div style={styles.roadmapColumn}>
            <div style={{
              ...styles.roadmapCard,
              background: 'linear-gradient(180deg, #f5f7fa 0%, #e8f4f8 100%)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <h3 style={styles.roadmapTitle}>{t.yourRoadmap}</h3>
                <p style={styles.roadmapSubtitle}>
                  {t.roadmapSubtitle} {getCareerTitle(selectedCareer)}
                </p>
              </div>

              {/* Phase Legend */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '25px',
                flexWrap: 'wrap'
              }}>
                {[
                  { key: 'core', label: t.core },
                  { key: 'recommended', label: t.recommended },
                  { key: 'supplementary', label: t.supplementary },
                ].map(({ key, label }) => (
                  <div key={key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    fontSize: '12px',
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: phaseColors[key].main,
                    }} />
                    <span style={{ color: '#555', fontWeight: '500' }}>{label}</span>
                  </div>
                ))}
              </div>

              {loadingModules ? (
                <div style={styles.loadingModulesContainer}>
                  <div style={styles.spinnerSmall}></div>
                  <p>{t.loadingModules}</p>
                </div>
              ) : roadmapModules.length === 0 ? (
                <div style={styles.emptyModules}>
                  <p>{t.noModules}</p>
                </div>
              ) : (
                <div style={{ position: 'relative', padding: '0 10px' }}>
                  {/* Roadmap Path - Individual module nodes */}
                  {roadmapModules.map((module, index) => {
                    const phase = getModulePhase(module);
                    const colors = phaseColors[phase];
                    const isLast = index === roadmapModules.length - 1;
                    const isLeft = index % 2 === 0;

                    return (
                      <div key={module.id} style={{ position: 'relative', marginBottom: isLast ? '0' : '15px' }}>
                        {/* Connecting Path */}
                        {!isLast && (
                          <svg
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '65px',
                              transform: 'translateX(-50%)',
                              width: '80px',
                              height: '50px',
                              zIndex: 0
                            }}
                          >
                            <path
                              d={isLeft ? "M 40 0 Q 60 25 40 50" : "M 40 0 Q 20 25 40 50"}
                              fill="none"
                              stroke={colors.main}
                              strokeWidth="6"
                              strokeLinecap="round"
                              opacity="0.3"
                            />
                            <polygon
                              points="35,42 45,42 40,50"
                              fill={colors.main}
                              opacity="0.5"
                            />
                          </svg>
                        )}

                        {/* Module Node */}
                        <div
                          onClick={() => setSelectedRoadmapNode(module)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            zIndex: 1,
                          }}
                        >
                          {/* Circle Node */}
                          <div
                            style={{
                              width: '75px',
                              height: '75px',
                              borderRadius: '50%',
                              backgroundColor: colors.main,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: `0 4px 15px ${colors.main}50, 0 2px 8px rgba(0,0,0,0.1)`,
                              border: '3px solid white',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                              e.currentTarget.style.boxShadow = `0 8px 25px ${colors.main}70`;
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = `0 4px 15px ${colors.main}50, 0 2px 8px rgba(0,0,0,0.1)`;
                            }}
                          >
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                              #{index + 1}
                            </span>
                            <span style={{ color: 'white', fontSize: '10px', fontWeight: '600' }}>
                              {module.credits} CP
                            </span>
                          </div>

                          {/* Module Info Card */}
                          <div style={{
                            marginTop: '8px',
                            padding: '10px 16px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
                            textAlign: 'center',
                            maxWidth: '240px',
                            border: `2px solid ${colors.light}`,
                          }}>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#333',
                              marginBottom: '4px',
                              lineHeight: '1.3',
                            }}>
                              {module.name}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '11px',
                                color: colors.main,
                                fontWeight: '500',
                              }}>
                                {phase === 'core' ? t.core : phase === 'recommended' ? t.recommended : t.supplementary}
                              </span>
                              <span style={{
                                fontSize: '11px',
                                backgroundColor: module.relevance_score >= 35 ? '#27ae60' :
                                  module.relevance_score >= 25 ? '#f39c12' : '#3498db',
                                color: 'white',
                                padding: '1px 6px',
                                borderRadius: '8px',
                                fontWeight: '600',
                              }}>
                                {module.relevance_score}% {t.match}
                              </span>
                            </div>
                            <div style={{ marginTop: '5px', fontSize: '10px', color: '#999' }}>
                              \u25BC {t.clickForDetails}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Career Ready Badge */}
                  <div style={{ textAlign: 'center', marginTop: '25px', paddingBottom: '10px' }}>
                    <div style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '15px 30px',
                      background: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
                      borderRadius: '16px',
                      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.35)',
                    }}>
                      <span style={{ fontSize: '35px' }}>{'\uD83C\uDFC6'}</span>
                      <div style={{ fontWeight: 'bold', color: '#8b6914', fontSize: '14px', marginTop: '4px' }}>
                        {t.careerReady}
                      </div>
                      <div style={{ fontSize: '12px', color: '#a67c00', marginTop: '2px' }}>
                        {totalCP} {t.totalCredits} \u2022 {roadmapModules.length} {t.modules}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module Detail Modal */}
        {selectedRoadmapNode && (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px',
              animation: 'fadeIn 0.2s ease',
            }}
            onClick={() => setSelectedRoadmapNode(null)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '0',
                maxWidth: '420px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                animation: 'slideUp 0.3s ease',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                backgroundColor: phaseColors[getModulePhase(selectedRoadmapNode)].main,
                color: 'white',
                padding: '22px',
                textAlign: 'center',
                borderRadius: '20px 20px 0 0',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {selectedRoadmapNode.name}
                </div>
                <div style={{ marginTop: '5px', opacity: 0.9, fontSize: '13px' }}>
                  {selectedRoadmapNode.module_code} \u2022 {selectedRoadmapNode.credits} CP
                </div>
              </div>

              {/* Modal Content */}
              <div style={{ padding: '20px' }}>
                {selectedRoadmapNode.learning_objectives && (
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#888', marginBottom: '5px' }}>
                      {t.description}
                    </div>
                    <p style={{ color: '#444', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
                      {selectedRoadmapNode.learning_objectives}
                    </p>
                  </div>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  fontSize: '14px',
                  marginBottom: '15px',
                }}>
                  <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '11px', marginBottom: '3px' }}>{t.credits}</div>
                    <div style={{ fontWeight: 'bold', color: '#004E8A' }}>{selectedRoadmapNode.credits} CP</div>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '11px', marginBottom: '3px' }}>{t.relevance}</div>
                    <div style={{ fontWeight: 'bold', color: '#004E8A' }}>{selectedRoadmapNode.relevance_score}%</div>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '11px', marginBottom: '3px' }}>{t.category}</div>
                    <div style={{ fontWeight: 'bold', color: '#004E8A', fontSize: '12px' }}>
                      {selectedRoadmapNode.category}
                    </div>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '11px', marginBottom: '3px' }}>
                      {language === 'de' ? 'Kernmodul' : 'Core Module'}
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#004E8A' }}>
                      {selectedRoadmapNode.is_core ? (language === 'de' ? 'Ja' : 'Yes') : (language === 'de' ? 'Nein' : 'No')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRoadmapNode(null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: phaseColors[getModulePhase(selectedRoadmapNode)].main,
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Career List View
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.subtitle}>{t.subtitle}</p>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          {error}
          <button onClick={loadCareers} style={styles.retryButton}>{t.retry}</button>
        </div>
      )}

      {/* Search */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <span style={styles.resultsCount}>
          {filteredCareers.length} {t.careersFound}
        </span>
      </div>

      {/* Career Grid */}
      <div style={styles.careerGrid}>
        {filteredCareers.map(career => {
          const visual = getCareerVisual(career.career_id || career.id);
          return (
            <div
              key={career.id}
              style={styles.careerCard}
              onClick={() => selectCareer(career)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              {/* Gradient Header with Icon */}
              <div style={{
                background: visual.gradient,
                borderRadius: '10px 10px 0 0',
                margin: '-20px -20px 15px -20px',
                padding: '25px 20px',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '40px' }}>{visual.icon}</span>
              </div>

              <h3 style={styles.careerTitle}>{getCareerTitle(career)}</h3>
              <p style={styles.careerDescription}>
                {getCareerDescription(career)?.substring(0, 120)}...
              </p>
              <div style={styles.careerMeta}>
                <span style={styles.salaryRange}>{career.salary_range}</span>
                <span style={styles.moduleCount}>
                  {career.module_count} {t.modules}
                </span>
              </div>
              <div style={styles.viewRoadmap}>
                {t.viewRoadmap} &rarr;
              </div>
            </div>
          );
        })}
      </div>

      {filteredCareers.length === 0 && (
        <div style={styles.noResults}>
          <p>{t.noResults} "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} style={styles.clearButton}>
            {t.clearSearch}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1400px', margin: '0 auto', padding: '20px' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#004E8A', marginBottom: '10px' },
  subtitle: { fontSize: '16px', color: '#666' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #004E8A', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  spinnerSmall: { width: '24px', height: '24px', border: '3px solid #f3f3f3', borderTop: '3px solid #004E8A', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  errorBanner: { backgroundColor: '#fee', border: '1px solid #f99', borderRadius: '8px', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  retryButton: { backgroundColor: '#004E8A', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  searchContainer: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' },
  searchInput: { flex: 1, padding: '12px 20px', fontSize: '16px', border: '2px solid #e0e0e0', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' },
  resultsCount: { color: '#666', fontSize: '14px', whiteSpace: 'nowrap' },
  careerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  careerCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s ease', border: '2px solid transparent', overflow: 'hidden' },
  careerTitle: { fontSize: '18px', fontWeight: 'bold', color: '#004E8A', marginBottom: '10px' },
  careerDescription: { fontSize: '14px', color: '#555', lineHeight: '1.5', marginBottom: '15px' },
  careerMeta: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  salaryRange: { fontSize: '13px', color: '#27ae60', fontWeight: '500' },
  moduleCount: { fontSize: '13px', color: '#666' },
  viewRoadmap: { textAlign: 'center', padding: '10px', backgroundColor: '#f0f7ff', borderRadius: '6px', color: '#004E8A', fontWeight: '600', fontSize: '14px' },
  noResults: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8f9fa', borderRadius: '12px' },
  clearButton: { marginTop: '15px', backgroundColor: '#004E8A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  backButton: { backgroundColor: 'transparent', border: '2px solid #004E8A', color: '#004E8A', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '20px' },
  careerDetailHeader: { marginBottom: '30px' },
  detailTitle: { fontSize: '32px', fontWeight: 'bold', color: '#004E8A', marginBottom: '5px' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
  infoColumn: { display: 'flex', flexDirection: 'column', gap: '20px' },
  infoCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  infoCardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#004E8A', marginBottom: '15px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' },
  salaryGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  salaryItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8f9fa', borderRadius: '6px' },
  salaryLevel: { color: '#666', fontSize: '14px' },
  salaryAmount: { color: '#27ae60', fontWeight: 'bold', fontSize: '14px' },
  skillsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  skillItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' },
  skillBullet: { color: '#27ae60', fontWeight: 'bold' },
  roadmapColumn: { minHeight: '500px' },
  roadmapCard: { backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' },
  roadmapTitle: { fontSize: '22px', fontWeight: 'bold', color: '#004E8A', marginBottom: '5px' },
  roadmapSubtitle: { fontSize: '14px', color: '#666', marginBottom: '0' },
  loadingModulesContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#666' },
  emptyModules: { textAlign: 'center', padding: '40px', color: '#666' },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(styleSheet);

export default CareerPathsPage;
