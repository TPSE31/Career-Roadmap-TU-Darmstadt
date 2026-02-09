import React, { useState } from 'react';
import { useCareerOffers } from '../hooks/useCareerOffers';
import CareerOfferCard from './CareerOfferCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * CareerGoals component displays career-relevant offers filtered by career field
 */
const CareerGoals = () => {
  const [selectedCareerField, setSelectedCareerField] = useState('industry');
  const [language, setLanguage] = useState('de');
  const { offers, loading, error } = useCareerOffers(selectedCareerField);

  // Group offers by category
  const groupByCategory = (offers) => {
    return {
      berufseinstieg: offers.filter(o => o.category === 'berufseinstieg'),
      studienerfolg: offers.filter(o => o.category === 'studienerfolg'),
      integration: offers.filter(o => o.category === 'integration')
    };
  };

  const grouped = groupByCategory(offers);

  const careerFieldOptions = [
    { value: 'industry', label: 'Industry/Company' },
    { value: 'research', label: 'Research/Academia' },
    { value: 'startup', label: 'Startup/Entrepreneurship' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'public_sector', label: 'Public Sector' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'other', label: 'Other' },
  ];

  const getCategoryTitle = (category, lang) => {
    const titles = {
      berufseinstieg: { de: 'Berufseinstieg', en: 'Career Entry' },
      studienerfolg: { de: 'Studienerfolg', en: 'Study Success' },
      integration: { de: 'Integration & Unterstützung', en: 'Integration & Support' }
    };
    return titles[category]?.[lang] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      berufseinstieg: '🚀',
      studienerfolg: '📚',
      integration: '🌍'
    };
    return icons[category] || '📌';
  };

  const getCategoryColor = (category) => {
    const colors = {
      berufseinstieg: '#27ae60',
      studienerfolg: '#e67e22',
      integration: '#9b59b6'
    };
    return colors[category] || '#95a5a6';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>
          {language === 'de' ? '🎯 Karriereziele & Ressourcen' : '🎯 Career Goals & Resources'}
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          {language === 'de'
            ? 'Finde karriererelevante Angebote, die zu deinem Karriereweg an der TU Darmstadt passen'
            : 'Find career-relevant offers tailored to your career path at TU Darmstadt'}
        </p>
      </div>

      {/* Career Field Selector */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <label style={{
          display: 'block',
          marginBottom: '10px',
          fontWeight: 'bold',
          color: '#2c3e50',
          fontSize: '16px'
        }}>
          {language === 'de' ? 'Wähle deine Karriererichtung:' : 'Select Your Career Direction:'}
        </label>
        <select
          value={selectedCareerField}
          onChange={(e) => setSelectedCareerField(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #bdc3c7',
            cursor: 'pointer'
          }}
        >
          {careerFieldOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div style={{ marginTop: '15px' }}>
          <label style={{ marginRight: '10px', color: '#7f8c8d' }}>
            {language === 'de' ? 'Sprache:' : 'Language:'}
          </label>
          <button
            onClick={() => setLanguage('de')}
            style={{
              padding: '8px 15px',
              marginRight: '10px',
              backgroundColor: language === 'de' ? '#3498db' : '#ecf0f1',
              color: language === 'de' ? 'white' : '#2c3e50',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            Deutsch
          </button>
          <button
            onClick={() => setLanguage('en')}
            style={{
              padding: '8px 15px',
              backgroundColor: language === 'en' ? '#3498db' : '#ecf0f1',
              color: language === 'en' ? 'white' : '#2c3e50',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            English
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          {/* Career Entry Resources */}
          {grouped.berufseinstieg.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                color: getCategoryColor('berufseinstieg'),
                borderBottom: `2px solid ${getCategoryColor('berufseinstieg')}`,
                paddingBottom: '10px',
                fontSize: '24px'
              }}>
                {getCategoryIcon('berufseinstieg')} {getCategoryTitle('berufseinstieg', language)}
              </h2>
              {grouped.berufseinstieg.map(offer => (
                <CareerOfferCard key={offer.id} offer={offer} language={language} />
              ))}
            </div>
          )}

          {/* Study Success */}
          {grouped.studienerfolg.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                color: getCategoryColor('studienerfolg'),
                borderBottom: `2px solid ${getCategoryColor('studienerfolg')}`,
                paddingBottom: '10px',
                fontSize: '24px'
              }}>
                {getCategoryIcon('studienerfolg')} {getCategoryTitle('studienerfolg', language)}
              </h2>
              {grouped.studienerfolg.map(offer => (
                <CareerOfferCard key={offer.id} offer={offer} language={language} />
              ))}
            </div>
          )}

          {/* Integration & Support */}
          {grouped.integration.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                color: getCategoryColor('integration'),
                borderBottom: `2px solid ${getCategoryColor('integration')}`,
                paddingBottom: '10px',
                fontSize: '24px'
              }}>
                {getCategoryIcon('integration')} {getCategoryTitle('integration', language)}
              </h2>
              {grouped.integration.map(offer => (
                <CareerOfferCard key={offer.id} offer={offer} language={language} />
              ))}
            </div>
          )}

          {offers.length === 0 && (
            <div style={{
              backgroundColor: '#fff3cd',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #ffc107'
            }}>
              <p style={{ margin: 0, color: '#856404' }}>
                {language === 'de'
                  ? 'Keine Angebote für das ausgewählte Karrierefeld gefunden.'
                  : 'No offers found for the selected career field.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CareerGoals;
