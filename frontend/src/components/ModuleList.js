import React, { useState } from 'react';
import { useModules } from '../hooks/useModules';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const CATEGORIES = ['Alle', 'Pflichtbereich', 'Wahlpflichtbereich', 'Informatik-Wahlbereich', 'Studienbegleitende Leistungen', 'Abschlussbereich'];

const ModuleList = ({ language = 'de' }) => {
  const { modules, loading, error, refetch } = useModules();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Alle');
  const [semesterFilter, setSemesterFilter] = useState('Alle');
  const [selectedModule, setSelectedModule] = useState(null);

  const t = {
    de: {
      title: 'Modulkatalog B.Sc. Informatik',
      modulesLabel: 'Module',
      cpTotal: 'CP gesamt',
      searchPlaceholder: 'Modul suchen...',
      allCategories: 'Alle',
      allSemesters: 'Alle Semester',
      semester: 'Semester',
      credits: 'Credits',
      category: 'Kategorie',
      mandatory: 'Pflicht',
      required: 'Pflicht',
      requiredLabel: 'Pflichtmodul',
      yes: 'Ja',
      no: 'Nein',
      prerequisites: 'Voraussetzungen',
      close: 'Schlie\u00dfen',
    },
    en: {
      title: 'Module Catalog B.Sc. Computer Science',
      modulesLabel: 'Modules',
      cpTotal: 'CP total',
      searchPlaceholder: 'Search modules...',
      allCategories: 'All',
      allSemesters: 'All Semesters',
      semester: 'Semester',
      credits: 'Credits',
      category: 'Category',
      mandatory: 'Mandatory',
      required: 'Mandatory',
      requiredLabel: 'Required',
      yes: 'Yes',
      no: 'No',
      prerequisites: 'Prerequisites',
      close: 'Close',
    }
  }[language];

  const getCategoryLabel = (category) => {
    if (language === 'en') {
      const labels = {
        'Alle': 'All',
        'Pflichtbereich': 'Mandatory',
        'Wahlpflichtbereich': 'Elective Mandatory',
        'Informatik-Wahlbereich': 'CS Elective',
        'Studienbegleitende Leistungen': 'Accompanying Courses',
        'Abschlussbereich': 'Thesis',
      };
      return labels[category] || category;
    }
    return category;
  };

  if (loading) {
    return <LoadingSpinner message={language === 'de' ? 'Lade Module...' : 'Loading modules...'} />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  const semesters = [...new Set(modules.map(m => m.semester).filter(Boolean))].sort((a, b) => a - b);

  const filtered = modules.filter(m => {
    const matchSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.name_en && m.name_en.toLowerCase().includes(search.toLowerCase())) ||
      m.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'Alle' || m.category === categoryFilter;
    const matchSemester = semesterFilter === 'Alle' || m.semester === Number(semesterFilter);
    return matchSearch && matchCategory && matchSemester;
  });

  const totalCP = filtered.reduce((sum, m) => sum + m.credits, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 5px 0', color: '#004E8A' }}>
        {t.title}
      </h2>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        {filtered.length} {t.modulesLabel} · {totalCP} {t.cpTotal}
      </p>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '14px',
            flex: '1',
            minWidth: '200px'
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
        </select>
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
        >
          <option value="Alle">{t.allSemesters}</option>
          {semesters.map(s => <option key={s} value={s}>{t.semester} {s}</option>)}
        </select>
      </div>

      {/* Module Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {filtered.map((module) => (
          <div
            key={module.id}
            onClick={() => setSelectedModule(module)}
            style={{
              border: '1px solid #ddd',
              borderLeft: `4px solid ${getCategoryColor(module.category)}`,
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#004E8A' }}>
              {language === 'en' && module.name_en ? module.name_en : module.name}
            </h3>
            <p style={{ color: '#999', fontSize: '12px', margin: '0 0 8px 0' }}>{module.code}</p>
            <p style={{ color: '#555', fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.4' }}>
              {module.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
              <span><strong>{module.credits} CP</strong></span>
              <span>{module.semester ? `${t.semester} ${module.semester}` : ''}</span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <span style={{
                display: 'inline-block',
                padding: '3px 10px',
                backgroundColor: getCategoryColor(module.category),
                color: 'white',
                borderRadius: '10px',
                fontSize: '11px'
              }}>
                {getCategoryLabel(module.category)}
              </span>
              {module.required && (
                <span style={{
                  display: 'inline-block',
                  marginLeft: '6px',
                  padding: '3px 10px',
                  backgroundColor: '#c0392b',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '11px'
                }}>
                  {t.mandatory}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 2000
          }}
          onClick={() => setSelectedModule(null)}
        >
          <div
            style={{
              backgroundColor: 'white', borderRadius: '12px', padding: '30px',
              maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 5px 0', color: '#004E8A' }}>
              {language === 'en' && selectedModule.name_en ? selectedModule.name_en : selectedModule.name}
            </h2>
            <p style={{ color: '#999', fontSize: '13px', margin: '0 0 15px 0' }}>{selectedModule.code}</p>
            <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '15px' }}>{selectedModule.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px', marginBottom: '15px' }}>
              <div><strong>{t.credits}:</strong> {selectedModule.credits} CP</div>
              <div><strong>{t.semester}:</strong> {selectedModule.semester || '-'}</div>
              <div><strong>{t.category}:</strong> {getCategoryLabel(selectedModule.category)}</div>
              <div><strong>{t.requiredLabel}:</strong> {selectedModule.required ? t.yes : t.no}</div>
            </div>
            {selectedModule.prerequisites && selectedModule.prerequisites.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <strong>{t.prerequisites}:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  {selectedModule.prerequisites.map((p, i) => <li key={i} style={{ fontSize: '14px', color: '#555' }}>{p}</li>)}
                </ul>
              </div>
            )}
            <button
              onClick={() => setSelectedModule(null)}
              style={{
                padding: '10px 24px', backgroundColor: '#004E8A', color: 'white',
                border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
              }}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    'Pflichtbereich': '#004E8A',
    'Wahlpflichtbereich': '#e67e22',
    'Informatik-Wahlbereich': '#009CDE',
    'Studienbegleitende Leistungen': '#8e44ad',
    'Abschlussbereich': '#c0392b',
  };
  return colors[category] || '#95a5a6';
};

export default ModuleList;
