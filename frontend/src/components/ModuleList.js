import React, { useState, useEffect } from 'react';
import { allModules, moduleCategories, TOTAL_REQUIRED_CREDITS } from '../data/modules';
import { useAuth } from '../context/AuthContext';

const ModuleList = ({ language = 'en' }) => {
  const { user } = useAuth();
  const [modules, setModules] = useState(allModules);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);

  const brandColor = '#0F6CBF';

  // Load completed modules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedModules');
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
  }, []);

  // Save completed modules to localStorage
  const toggleModuleCompletion = (moduleId) => {
    const newCompleted = completedModules.includes(moduleId)
      ? completedModules.filter(id => id !== moduleId)
      : [...completedModules, moduleId];
    setCompletedModules(newCompleted);
    localStorage.setItem('completedModules', JSON.stringify(newCompleted));
  };

  // Calculate total earned credits
  const earnedCredits = allModules
    .filter(m => completedModules.includes(m.id))
    .reduce((sum, m) => sum + m.credits, 0);

  // Filter modules
  const filteredModules = allModules.filter(m => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSemester = selectedSemester === 'all' ||
      (selectedSemester === 'elective' && !m.semester) ||
      m.semester === parseInt(selectedSemester);
    const matchesSearch = searchTerm === '' ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSemester && matchesSearch;
  });

  // Get unique categories
  const categories = ['all', ...new Set(allModules.map(m => m.category))];

  // Translations
  const t = {
    en: {
      title: 'Module Catalog',
      subtitle: 'Browse and track your modules',
      search: 'Search modules...',
      allCategories: 'All Categories',
      allSemesters: 'All Semesters',
      semester: 'Semester',
      electives: 'Electives (Flexible)',
      credits: 'Credits',
      totalCredits: 'Total Credits Earned',
      required: 'Required',
      completed: 'Completed',
      markComplete: 'Mark as Completed',
      markIncomplete: 'Mark as Incomplete',
      description: 'Description',
      code: 'Module Code',
      prerequisites: 'Prerequisites',
      category: 'Category',
      close: 'Close',
      mandatory: 'Mandatory',
      noModules: 'No modules found matching your filters',
      moduleCount: 'modules'
    },
    de: {
      title: 'Modulkatalog',
      subtitle: 'Durchsuchen und verfolgen Sie Ihre Module',
      search: 'Module suchen...',
      allCategories: 'Alle Kategorien',
      allSemesters: 'Alle Semester',
      semester: 'Semester',
      electives: 'Wahlfächer (Flexibel)',
      credits: 'Credits',
      totalCredits: 'Gesammelte Credits',
      required: 'Pflicht',
      completed: 'Abgeschlossen',
      markComplete: 'Als abgeschlossen markieren',
      markIncomplete: 'Als nicht abgeschlossen markieren',
      description: 'Beschreibung',
      code: 'Modulcode',
      prerequisites: 'Voraussetzungen',
      category: 'Kategorie',
      close: 'Schließen',
      mandatory: 'Pflicht',
      noModules: 'Keine Module gefunden',
      moduleCount: 'Module'
    }
  }[language];

  // Category badge colors
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Pflichtbereich': return '#e74c3c';
      case 'Informatik Wahlpflichtbereich': return '#9b59b6';
      case 'Informatik Wahlbereich': return '#3498db';
      case 'Studium Generale': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#2c3e50' }}>
          {t.title}
        </h1>
        <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
          {t.subtitle}
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{t.totalCredits}</span>
          <span style={{ fontWeight: 'bold', color: brandColor }}>
            {earnedCredits} / {TOTAL_REQUIRED_CREDITS} {t.credits}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#ecf0f1',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(earnedCredits / TOTAL_REQUIRED_CREDITS) * 100}%`,
            height: '100%',
            backgroundColor: brandColor,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          {Math.round((earnedCredits / TOTAL_REQUIRED_CREDITS) * 100)}% {t.completed}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 15px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '200px',
            flex: 1,
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = brandColor}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px 15px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: 'white',
            minWidth: '200px'
          }}
        >
          <option value="all">{t.allCategories}</option>
          <option value="Pflichtbereich">Pflichtbereich (Mandatory)</option>
          <option value="Informatik Wahlpflichtbereich">Informatik Wahlpflichtbereich</option>
          <option value="Informatik Wahlbereich">Informatik Wahlbereich</option>
          <option value="Studium Generale">Studium Generale</option>
        </select>

        {/* Semester Filter */}
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          style={{
            padding: '10px 15px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: 'white',
            minWidth: '150px'
          }}
        >
          <option value="all">{t.allSemesters}</option>
          {[1, 2, 3, 4, 5, 6].map(s => (
            <option key={s} value={s}>{t.semester} {s}</option>
          ))}
          <option value="elective">{t.electives}</option>
        </select>

        {/* Module count */}
        <div style={{ color: '#666', fontSize: '14px' }}>
          {filteredModules.length} {t.moduleCount}
        </div>
      </div>

      {/* Module Grid */}
      {filteredModules.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          color: '#666'
        }}>
          {t.noModules}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredModules.map((module) => {
            const isCompleted = completedModules.includes(module.id);
            return (
              <div
                key={module.id}
                onClick={() => setSelectedModule(module)}
                style={{
                  border: isCompleted ? '2px solid #27ae60' : '1px solid #ddd',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: isCompleted ? '#f0fff4' : 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 5px 0',
                      fontSize: '16px',
                      color: '#2c3e50',
                      lineHeight: '1.3'
                    }}>
                      {language === 'en' && module.name_en ? module.name_en : module.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                      {module.code}
                    </p>
                  </div>
                  {isCompleted && (
                    <span style={{
                      fontSize: '24px',
                      color: '#27ae60',
                      marginLeft: '10px'
                    }}>
                      ✓
                    </span>
                  )}
                </div>

                {/* Description */}
                <p style={{
                  color: '#666',
                  fontSize: '13px',
                  margin: '0 0 15px 0',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {module.description}
                </p>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: getCategoryColor(module.category),
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {module.category}
                  </span>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666' }}>
                    {module.semester && (
                      <span>Sem. {module.semester}</span>
                    )}
                    <span style={{ fontWeight: 'bold', color: brandColor }}>
                      {module.credits} CP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Module Detail Modal */}
      {selectedModule && (
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
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedModule(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedModule(null)}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#999',
                padding: '0',
                lineHeight: '1'
              }}
            >
              ×
            </button>

            {/* Module Title */}
            <h2 style={{ margin: '0 0 10px 0', color: brandColor, paddingRight: '40px' }}>
              {language === 'en' && selectedModule.name_en ? selectedModule.name_en : selectedModule.name}
            </h2>

            {/* Module Code */}
            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '14px' }}>
              {selectedModule.code}
            </p>

            {/* Category Badge */}
            <span style={{
              display: 'inline-block',
              padding: '6px 14px',
              backgroundColor: getCategoryColor(selectedModule.category),
              color: 'white',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '20px'
            }}>
              {selectedModule.category}
            </span>

            {/* Info Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              marginBottom: '25px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: brandColor }}>
                  {selectedModule.credits}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>{t.credits}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: brandColor }}>
                  {selectedModule.semester || '—'}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>{t.semester}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px' }}>
                  {selectedModule.required ? '✓' : '○'}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>{t.mandatory}</div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{t.description}</h4>
              <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
                {selectedModule.description}
              </p>
            </div>

            {/* Notes if any */}
            {selectedModule.notes && (
              <div style={{
                padding: '15px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                marginBottom: '25px',
                fontSize: '14px',
                color: '#856404'
              }}>
                <strong>Note:</strong> {selectedModule.notes}
              </div>
            )}

            {/* Completion Status */}
            <div style={{
              padding: '20px',
              backgroundColor: completedModules.includes(selectedModule.id) ? '#d4edda' : '#f8f9fa',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>
                  {completedModules.includes(selectedModule.id) ? t.completed : 'Not completed'}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  Click below to update status
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModuleCompletion(selectedModule.id);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: completedModules.includes(selectedModule.id) ? '#dc3545' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {completedModules.includes(selectedModule.id) ? t.markIncomplete : t.markComplete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleList;
