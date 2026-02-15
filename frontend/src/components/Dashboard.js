import React, { useState, useEffect } from 'react';
import careerService from '../services/careerService';

const Dashboard = ({ onNavigate, language = 'de' }) => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const INITIAL_SHOW = 12;

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      const data = await careerService.getCareerPaths();
      setCareers(data);
    } catch (err) {
      console.error('Failed to load careers:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayedCareers = careers.slice(0, INITIAL_SHOW);

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
    };
    return visuals[careerId] || { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '\uD83D\uDCBC' };
  };

  const t = {
    de: {
      title: 'B.Sc. Informatik - Career Roadmap',
      subtitle: 'Entdecke Module, Karrierewege und den Studienplan des B.Sc. Informatik an der TU Darmstadt.',
      moduleCatalog: 'Modulkatalog',
      moduleCatalogDesc: 'Alle Pflicht-, Wahlpflicht- und Wahlbereich-Module mit CP und Semesterempfehlung.',
      exploreCareers: 'Karrierewege erkunden',
      exploreCareersDesc: 'Karrierepfade mit passenden Modulempfehlungen f\u00fcr deinen Traumjob.',
      careers: 'Karrierewege',
      showMore: 'Alle Karrierewege anzeigen',
      loading: 'Lade Karrierewege...',
      modules: 'Module',
      ectsTotal: 'ECTS Total',
      semesters: 'Semester',
    },
    en: {
      title: 'B.Sc. Computer Science - Career Roadmap',
      subtitle: 'Discover modules, career paths and the study plan for B.Sc. Computer Science at TU Darmstadt.',
      moduleCatalog: 'Module Catalog',
      moduleCatalogDesc: 'All mandatory, elective and specialization modules with credits and semester recommendations.',
      exploreCareers: 'Explore Careers',
      exploreCareersDesc: 'Career paths with matching module recommendations for your dream job.',
      careers: 'Career Paths',
      showMore: 'View all career paths',
      loading: 'Loading careers...',
      modules: 'Modules',
      ectsTotal: 'ECTS Total',
      semesters: 'Semesters',
    }
  }[language];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#004E8A' }}>
          {t.title}
        </h1>
        <p style={{ color: '#666', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
          {t.subtitle}
        </p>
      </div>

      {/* Quick Links */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <QuickLink
          title={t.moduleCatalog}
          description={t.moduleCatalogDesc}
          color="#004E8A"
          onClick={() => onNavigate('modules')}
        />
        <QuickLink
          title={t.exploreCareers}
          description={`${careers.length} ${t.exploreCareersDesc}`}
          color="#009CDE"
          onClick={() => onNavigate('careers')}
        />
      </div>

      {/* Career Paths Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#004E8A' }}>
          {t.careers} ({careers.length})
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {t.loading}
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px'
            }}>
              {displayedCareers.map((career) => {
                const visual = getCareerVisual(career.career_id);
                return (
                  <div
                    key={career.id}
                    onClick={() => onNavigate('careers')}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    }}
                  >
                    {/* Gradient Banner */}
                    <div style={{
                      background: visual.gradient,
                      padding: '12px',
                      textAlign: 'center',
                    }}>
                      <span style={{ fontSize: '28px' }}>{visual.icon}</span>
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#004E8A', marginBottom: '2px' }}>
                        {language === 'en' ? career.title_en : career.title_de || career.title_en}
                      </div>
                      <div style={{ fontSize: '10px', color: '#27ae60' }}>
                        {career.module_count} {t.modules}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More → Navigate to Careers Page */}
            {careers.length > INITIAL_SHOW && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => onNavigate('careers')}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#004E8A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#003366';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#004E8A';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {t.showMore} ({careers.length - INITIAL_SHOW} {language === 'de' ? 'weitere' : 'more'}) &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '20px',
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <StatCard number={careers.length} label={t.careers} />
        <StatCard number="251" label={t.modules} />
        <StatCard number="180" label={t.ectsTotal} />
        <StatCard number="6" label={t.semesters} />
      </div>
    </div>
  );
};

const QuickLink = ({ title, description, color, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: '24px',
      backgroundColor: color,
      color: 'white',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease'
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{description}</p>
  </div>
);

const StatCard = ({ number, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#004E8A' }}>{number}</div>
    <div style={{ fontSize: '13px', color: '#666' }}>{label}</div>
  </div>
);

export default Dashboard;
