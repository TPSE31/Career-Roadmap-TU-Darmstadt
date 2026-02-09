import React from 'react';

/**
 * CareerOfferCard component displays a single career offer with bilingual support
 * @param {Object} offer - The career offer data
 * @param {string} language - The display language ('de' or 'en')
 */
const CareerOfferCard = ({ offer, language = 'de' }) => {
  const title = language === 'de' ? offer.title_de : offer.title_en;
  const description = language === 'de' ? offer.description_de : offer.description_en;
  const relevance = language === 'de' ? offer.relevance_reason_de : offer.relevance_reason_en;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
    >
      <h3 style={{ marginTop: 0, color: '#2c3e50', fontSize: '18px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '10px' }}>
        <strong>{language === 'de' ? 'Anbieter:' : 'Provider:'}</strong> {offer.provider}
      </p>

      <p style={{ color: '#34495e', lineHeight: '1.6', fontSize: '15px' }}>{description}</p>

      <div style={{
        backgroundColor: '#ecf0f1',
        padding: '10px',
        borderRadius: '4px',
        marginTop: '10px',
        marginBottom: '10px'
      }}>
        <strong style={{ color: '#2980b9' }}>
          {language === 'de' ? 'Warum relevant:' : 'Why relevant:'}
        </strong>
        <span style={{ color: '#2c3e50', marginLeft: '5px' }}>{relevance}</span>
      </div>

      {offer.links && offer.links.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          {offer.links.map((link, idx) => (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#3498db',
                marginRight: '15px',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              🔗 Website
            </a>
          ))}
        </div>
      )}

      {offer.contact_emails && offer.contact_emails.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          {offer.contact_emails.map((email, idx) => (
            <a
              key={idx}
              href={`mailto:${email}`}
              style={{
                color: '#3498db',
                marginRight: '15px',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              ✉️ {email}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerOfferCard;
